import { Request, Response } from "express";
import { check, body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler";
import { User, UserDocument } from "../models/user.models";
import { CustomRequest } from "../middlewares/verifyToken.middleware";
import { OTP, OTPDocument } from "../models/otp.models";
import { sendEmail } from "../utils/sendEmails";
import { redisClient } from "../config/redisClient";
import mongoose from "mongoose";

const generateOTP = (): string => {
  const otp = crypto.randomInt(1000, 9999).toString();
  return otp;
};

const registerUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { email, fullName, password } = req.body as {
    email: string;
    fullName: string;
    password: string;
  };

  if (!email || !fullName || !password) {
    res.status(400).json({
      success: false,
      message: "Please provide all fields",
    });
    return;
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  let existedUser: UserDocument | null;
  try {
    existedUser = await User.findOne({
      email,
    });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }

  if (existedUser) {
    res.status(400).json({
      success: false,
      message: "User credentials already registered",
    });
    return;
  }

  let otpDocument: OTPDocument | null;
  try {
    otpDocument = await OTP.findOne({ email });
  } catch (error) {
    console.error("Error finding OTP document:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  if (otpDocument) {
    otpDocument.otp = otp;
    otpDocument.expiresAt = otpExpiresAt;
  } else {
    otpDocument = new OTP({
      email,
      otp,
      expiresAt: otpExpiresAt,
    });
  }

  await otpDocument.save();
  await sendEmail(
    email,
    "Your OTP Code",
    `Your OTP code is ${otp}. It is valid for 10 minutes.`
  );

  res.status(201).json({
    success: true,
    message: "OTP sent to email. Please verify to complete registration.",
  });
});

const verifyOTP = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { email, otp, fullName, password } = req.body as {
    email: string;
    otp: string;
    fullName: string;
    password: string;
  };

  const otpRecord = await OTP.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  if (otpRecord.expiresAt < new Date()) {
    return res.status(400).json({
      success: false,
      message: "OTP has expired",
    });
  }

  const newUser = await User.create({
    email,
    fullName,
    password,
  });

  const data = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  await OTP.deleteOne({ email, otp });

  await sendEmail(
    email,
    "Welcome to Our Platform",
    "Thank you for registering!"
  );

  res.status(201).json({
    success: true,
    message: "User registered",
    data,
  });
});

const loginUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  await check("email", "Email is not valid").isEmail().run(req);
  await check("password", "Password cannot be blank")
    .isLength({ min: 6 })
    .run(req);
  await body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  if (!email) {
    return res.status(402).json({
      success: false,
      message: "enter email",
    });
  }

  if (!password) {
    return res.status(402).json({
      success: false,
      message: "enter password",
    });
  }

  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    return res.status(400).json({
      success: false,
      message: "no such user found",
    });
  }

  const passwordCheck = await existedUser.isPasswordCorrect(password);

  if (!passwordCheck) {
    return res.status(402).json({
      success: false,
      message: "wrong password",
    });
  }

  const accessToken = await existedUser.generateAccessToken();
  const refreshToken = await existedUser.generateRefreshToken();

  existedUser.refreshToken = refreshToken;
  await existedUser.save({ validateBeforeSave: false });

  const loggedInUser = (await User.findOne({
    email,
  }).select("-password -refreshToken")) as UserDocument | null;

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "user successfully login",
      data: [
        {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      ],
      user: loggedInUser,
    });
});

const logoutUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
      message: "user logged out",
    });
});

const refreshAccessToken = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const oldResfreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!oldResfreshToken) {
      return res.status(400).json({
        success: false,
        message: "invalid access",
      });
    }

    try {
      const decodedToken = jwt.verify(
        oldResfreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as { _id: string };

      const user = await User.findById(decodedToken?._id);

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "invalid access",
        });
      }

      if (user.refreshToken !== oldResfreshToken) {
        return res.status(400).json({
          success: false,
          message: "invalid token",
        });
      }

      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
      };

      const accessToken = await user.generateAccessToken();

      const safeUser = await User.findById(user._id)
        .select("-password -refreshToken")
        .lean();

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json({
          success: true,
          message: "new Tokens generated",
          data: {
            accessToken: accessToken,
          },
          user: safeUser,
        });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: "invalid token",
      });
    }
  }
);

const changePassword = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body as {
      oldPassword: string;
      newPassword: string;
    };

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password needed",
      });
    }

    const passwordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!passwordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Wrong password",
      });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Password changed",
    });
  }
);

const forgotPassword = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { email } = req.body as { email: string };

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expirationTime = new Date(Date.now() + 3600000); // 1 hour from now

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expirationTime;
    await user.save();

    const subject =
      "Verification link for resetting password in Typescript Auth";
    const message = `Click this verification link: http://localhost:3000/api/v1/user/reset-password/?token=${token}`;

    try {
      await sendEmail(email, subject, message);
      return res.json({
        success: true,
        message: "Email sent successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Email not sent",
        error: error,
      });
    }
  }
);

const resetPassword = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { token, newPassword } = req.body as {
      token: string;
      newPassword: string;
    };

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and password required",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been changed",
    });
  }
);

const getUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID not provided",
    });
  }

  try {
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err) {
    console.error("Error retrieving user:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const editUserProfile = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.user._id;
    const { fullName } = req.body;

    // Validate input
    if (!fullName || fullName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Full name is required for update",
      });
    }

    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { fullName: fullName.trim() } },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Clear cached user data if using Redis
    if (redisClient) {
      await redisClient.del(`user:${userId}`);
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  }
);

const getResumeStats = asyncHandler(async (req: CustomRequest, res: Response) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate current resume stats
    await user.calculateResumeStats();
    await user.calculateImprovementTrend('resume');
    await user.save();

    // Interpret the improvement trend
    const interpretTrend = (trend: number) => {
      if (trend > 2)
        return { status: "excellent", message: "Strong upward trend! 📈" };
      if (trend > 0.5)
        return { status: "good", message: "Steady improvement 📊" };
      if (trend > -0.5)
        return { status: "stable", message: "Consistent performance 📋" };
      if (trend > -2)
        return { status: "declining", message: "Slight decline 📉" };
      return { status: "poor", message: "Needs attention 🔻" };
    };

    const resumeTrendInterpretation = interpretTrend(
      user.resumeStats.improvementTrend || 0
    );

    return res.status(200).json({
      success: true,
      message: "Resume stats retrieved successfully",
      data: {
        totalScans: user.resumeStats.totalScans || 0,
        weeklyScans: user.resumeStats.weeklyScans || 0,
        weeklyAvg: user.resumeStats.weeklyAvg || 0,
        bestScore: user.resumeStats.bestScore || 0,
        lastScanDate: user.resumeStats.lastScanDate || null,
        improvementTrend: user.resumeStats.improvementTrend || 0,
        trendInterpretation: resumeTrendInterpretation,
        improvementPercentage:
          (user.resumeStats.improvementTrend || 0) > 0
            ? `+${((user.resumeStats.improvementTrend || 0) * 10).toFixed(1)}%`
            : `${((user.resumeStats.improvementTrend || 0) * 10).toFixed(1)}%`,
        // Updated to use lastResumes array (last 5 resume scans)
        lastResumes: user.lastResumes.map(resume => ({
          scanId: resume.scanId.toString(),
          overallScore: resume.overallScore,
          scanDate: resume.scanDate.toISOString(),
        })),
        scansLeft: user.scansLeft || user.calculateScansLeft(),
      },
    });
  } catch (error) {
    console.error("Error retrieving resume stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const getLinkedinStats = asyncHandler(async (req: CustomRequest, res: Response) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize LinkedIn stats if they don't exist
    if (!user.linkedinStats) {
      user.linkedinStats = {
        totalScans: 0,
        weeklyScans: 0,
        weeklyAvg: 0,
        bestScore: 0,
        lastScanDate: undefined,
        improvementTrend: 0,
      };
      await user.save();
    }

    // Calculate current LinkedIn stats
    await user.calculateLinkedinStats();
    await user.calculateImprovementTrend('linkedin');
    await user.save();

    // Interpret the improvement trend
    const interpretTrend = (trend: number) => {
      if (trend > 2)
        return { status: "excellent", message: "Strong upward trend! 📈" };
      if (trend > 0.5)
        return { status: "good", message: "Steady improvement 📊" };
      if (trend > -0.5)
        return { status: "stable", message: "Consistent performance 📋" };
      if (trend > -2)
        return { status: "declining", message: "Slight decline 📉" };
      return { status: "poor", message: "Needs attention 🔻" };
    };

    const linkedinTrendInterpretation = interpretTrend(
      user.linkedinStats.improvementTrend || 0
    );

    return res.status(200).json({
      success: true,
      message: "LinkedIn stats retrieved successfully",
      data: {
        totalScans: user.linkedinStats.totalScans || 0,
        weeklyScans: user.linkedinStats.weeklyScans || 0,
        weeklyAvg: user.linkedinStats.weeklyAvg || 0,
        bestScore: user.linkedinStats.bestScore || 0,
        lastScanDate: user.linkedinStats.lastScanDate || null,
        improvementTrend: user.linkedinStats.improvementTrend || 0,
        trendInterpretation: linkedinTrendInterpretation,
        improvementPercentage:
          (user.linkedinStats.improvementTrend || 0) > 0
            ? `+${((user.linkedinStats.improvementTrend || 0) * 10).toFixed(1)}%`
            : `${((user.linkedinStats.improvementTrend || 0) * 10).toFixed(1)}%`,
        // Add lastLinkedins array (last 5 LinkedIn scans)
        lastLinkedins: user.lastLinkedins.map(linkedin => ({
          scanId: linkedin.scanId.toString(),
          overallScore: linkedin.overallScore,
          scanDate: linkedin.scanDate.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Error retrieving LinkedIn stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const getCombinedStats = asyncHandler(async (req: CustomRequest, res: Response) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize LinkedIn stats if they don't exist
    if (!user.linkedinStats) {
      user.linkedinStats = {
        totalScans: 0,
        weeklyScans: 0,
        weeklyAvg: 0,
        bestScore: 0,
        lastScanDate: undefined,
        improvementTrend: 0,
      };
    }

    // Calculate current stats for both
    await user.calculateResumeStats();
    await user.calculateLinkedinStats();
    await user.calculateImprovementTrend('resume');
    await user.calculateImprovementTrend('linkedin');
    await user.save();

    // Interpret the improvement trend
    const interpretTrend = (trend: number) => {
      if (trend > 2)
        return { status: "excellent", message: "Strong upward trend! 📈" };
      if (trend > 0.5)
        return { status: "good", message: "Steady improvement 📊" };
      if (trend > -0.5)
        return { status: "stable", message: "Consistent performance 📋" };
      if (trend > -2)
        return { status: "declining", message: "Slight decline 📉" };
      return { status: "poor", message: "Needs attention 🔻" };
    };

    const resumeTrendInterpretation = interpretTrend(
      user.resumeStats.improvementTrend || 0
    );

    const linkedinTrendInterpretation = interpretTrend(
      user.linkedinStats.improvementTrend || 0
    );

    // Calculate combined stats
    const totalScans = (user.resumeStats.totalScans || 0) + (user.linkedinStats.totalScans || 0);
    const totalWeeklyScans = (user.resumeStats.weeklyScans || 0) + (user.linkedinStats.weeklyScans || 0);
    
    const combinedStats = {
      totalScans,
      weeklyScans: totalWeeklyScans,
      bestOverallScore: Math.max(user.resumeStats.bestScore || 0, user.linkedinStats.bestScore || 0),
      averageScore: totalWeeklyScans > 0 
        ? Math.round((((user.resumeStats.weeklyAvg || 0) * (user.resumeStats.weeklyScans || 0)) + 
                     ((user.linkedinStats.weeklyAvg || 0) * (user.linkedinStats.weeklyScans || 0))) / 
                    totalWeeklyScans)
        : 0,
    };

    return res.status(200).json({
      success: true,
      message: "Combined stats retrieved successfully",
      data: {
        combined: combinedStats,
        resume: {
          totalScans: user.resumeStats.totalScans || 0,
          weeklyScans: user.resumeStats.weeklyScans || 0,
          weeklyAvg: user.resumeStats.weeklyAvg || 0,
          bestScore: user.resumeStats.bestScore || 0,
          lastScanDate: user.resumeStats.lastScanDate || null,
          improvementTrend: user.resumeStats.improvementTrend || 0,
          trendInterpretation: resumeTrendInterpretation,
          improvementPercentage:
            (user.resumeStats.improvementTrend || 0) > 0
              ? `+${((user.resumeStats.improvementTrend || 0) * 10).toFixed(1)}%`
              : `${((user.resumeStats.improvementTrend || 0) * 10).toFixed(1)}%`,
          // Updated to use lastResumes array (last 5 resume scans)
          lastResumes: user.lastResumes.map(resume => ({
            scanId: resume.scanId.toString(),
            overallScore: resume.overallScore,
            scanDate: resume.scanDate.toISOString(),
          })),
        },
        linkedin: {
          totalScans: user.linkedinStats.totalScans || 0,
          weeklyScans: user.linkedinStats.weeklyScans || 0,
          weeklyAvg: user.linkedinStats.weeklyAvg || 0,
          bestScore: user.linkedinStats.bestScore || 0,
          lastScanDate: user.linkedinStats.lastScanDate || null,
          improvementTrend: user.linkedinStats.improvementTrend || 0,
          trendInterpretation: linkedinTrendInterpretation,
          improvementPercentage:
            (user.linkedinStats.improvementTrend || 0) > 0
              ? `+${((user.linkedinStats.improvementTrend || 0) * 10).toFixed(1)}%`
              : `${((user.linkedinStats.improvementTrend || 0) * 10).toFixed(1)}%`,
          // Add lastLinkedins array (last 5 LinkedIn scans)
          lastLinkedins: user.lastLinkedins.map(linkedin => ({
            scanId: linkedin.scanId.toString(),
            overallScore: linkedin.overallScore,
            scanDate: linkedin.scanDate.toISOString(),
          })),
        },
        scansLeft: user.scansLeft || user.calculateScansLeft(),
      },
    });
  } catch (error) {
    console.error("Error retrieving combined stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update any endpoint that returns user data to include the new arrays
const getUserProfile = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('lastResumes.scanId', 'fileName scanDate overallScore')
      .populate('lastLinkedins.scanId', 'scanDate overallScore')
      .select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
      error: error.message,
    });
  }
});

const getLastResumeScores = asyncHandler(async (req: CustomRequest, res: Response) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select('lastResumes');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Extract only the overall scores from lastResumes
    const resumeScores = user.lastResumes.map(resume => ({
      scanId: resume.scanId.toString(),
      overallScore: resume.overallScore,
      scanDate: resume.scanDate.toISOString(),
    }));

    return res.status(200).json({
      success: true,
      message: "Last resume scores retrieved successfully",
      data: {
        totalScans: resumeScores.length,
        scores: resumeScores,
      },
    });
  } catch (error) {
    console.error("Error retrieving last resume scores:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const getLastLinkedinScores = asyncHandler(async (req: CustomRequest, res: Response) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select('lastLinkedins');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Extract only the overall scores from lastLinkedins
    const linkedinScores = user.lastLinkedins.map(linkedin => ({
      scanId: linkedin.scanId.toString(),
      overallScore: linkedin.overallScore,
      scanDate: linkedin.scanDate.toISOString(),
    }));

    return res.status(200).json({
      success: true,
      message: "Last LinkedIn scores retrieved successfully",
      data: {
        totalScans: linkedinScores.length,
        scores: linkedinScores,
      },
    });
  } catch (error) {
    console.error("Error retrieving last LinkedIn scores:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const getLastFiveScans = asyncHandler(async (req: CustomRequest, res: Response) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select('lastResumes lastLinkedins');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Combine resume and LinkedIn scans with type indication
    const allScans = [
      ...user.lastResumes.map(resume => ({
        scanId: resume.scanId.toString(),
        overallScore: resume.overallScore,
        scanDate: resume.scanDate,
        scanType: 'resume' as const,
      })),
      ...user.lastLinkedins.map(linkedin => ({
        scanId: linkedin.scanId.toString(),
        overallScore: linkedin.overallScore,
        scanDate: linkedin.scanDate,
        scanType: 'linkedin' as const,
      }))
    ];

    // Sort by scanDate in descending order (most recent first) and take last 5
    const lastFiveScans = allScans
      .sort((a, b) => new Date(b.scanDate).getTime() - new Date(a.scanDate).getTime())
      .slice(0, 5)
      .map(scan => ({
        scanId: scan.scanId,
        overallScore: scan.overallScore,
        scanDate: scan.scanDate.toISOString(),
        scanType: scan.scanType,
      }));

    // Calculate some basic stats
    const totalScans = allScans.length;
    const averageScore = lastFiveScans.length > 0 
      ? Math.round(lastFiveScans.reduce((sum, scan) => sum + scan.overallScore, 0) / lastFiveScans.length)
      : 0;

    const resumeScans = lastFiveScans.filter(scan => scan.scanType === 'resume').length;
    const linkedinScans = lastFiveScans.filter(scan => scan.scanType === 'linkedin').length;

    return res.status(200).json({
      success: true,
      message: "Last five scans retrieved successfully",
      data: {
        totalScans,
        resumeScans,
        linkedinScans,
        averageScore,
        scans: lastFiveScans,
      },
    });
  } catch (error) {
    console.error("Error retrieving last five scans:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const getUserDetails = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('lastResumes.scanId', 'fileName scanDate overallScore')
      .populate('lastLinkedins.scanId', 'scanDate overallScore')
      .select('-password -refreshToken -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate current stats if they don't exist
    if (!user.resumeStats.totalScans) {
      await user.calculateResumeStats();
    }
    if (!user.linkedinStats.totalScans) {
      await user.calculateLinkedinStats();
    }

    // Calculate improvement trends
    await user.calculateImprovementTrend('resume');
    await user.calculateImprovementTrend('linkedin');
    
    // Calculate scans left
    user.calculateScansLeft();
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    console.error("Error retrieving user details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user details",
      error: error.message,
    });
  }
});

export {
  registerUser,
  verifyOTP,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getUser,
  editUserProfile,
  getResumeStats,
  getLinkedinStats,
  getCombinedStats,
  getUserProfile,
  getLastResumeScores,
  getLastLinkedinScores,
  getLastFiveScans,        // New API
  getUserDetails,
};
