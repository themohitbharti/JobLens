import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomRequest } from "../middlewares/verifyToken.middleware";
import { extractTextFromPDF } from "../utils/pdfProcessor";
import { LinkedinGeminiService } from "../services/linkedinGeminiService";
import { LinkedinScoringService } from "../services/linkedinScoringService";
import { LinkedinScan } from "../models/linkedinScan.models";
import { User } from "../models/user.models";
import { LinkedinComparisonService } from "../services/linkedinComparisonService";

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/linkedin";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `linkedin-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Helper function to safely delete file
const safeDeleteFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ File deleted: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting file ${filePath}:`, error);
  }
};

// Helper function to safely delete multiple files
const safeDeleteFiles = (filePaths: string[]) => {
    filePaths.forEach(filePath => safeDeleteFile(filePath));
  };

  const scanLinkedinProfile = asyncHandler(async (req: CustomRequest, res: Response) => {
    const startTime = Date.now();
    let uploadedFilePath: string | null = null;
  
    try {
      // Check if user can perform scan (this already checks the 30 scans per day limit)
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const canScan = await user.canPerformScan();
      if (!canScan) {
        return res.status(429).json({
          success: false,
          message: "Daily scan limit reached (30 scans per day for both resume and LinkedIn combined)",
        });
      }
  
      // Validate file upload
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a PDF file",
        });
      }
  
      // Store file path for cleanup
      uploadedFilePath = req.file.path;
  
      // Extract scan preferences from request body with defaults
      const {
        targetIndustry,
        experienceLevel,
        targetJobTitle,
        targetCompany,
        aiSuggestionLevel = "basic",
        keywords,
      } = req.body;
  
      const analysisPreferences = {
        targetIndustry: targetIndustry?.trim() || "General",
        experienceLevel: experienceLevel?.trim() || "mid",
        targetJobTitle: targetJobTitle?.trim() || "General Position",
        targetCompany: targetCompany?.trim() || null,
        keywords: keywords
          ? keywords.split(",").map((k: string) => k.trim())
          : [],
      };
  
      // Extract text from PDF with content limits
      let extractedContent;
      try {
        extractedContent = await extractTextFromPDF(req.file.path);
      } catch (error: any) {
        // Handle content validation errors
        if (error.message.includes("Profile too short")) {
          return res.status(400).json({
            success: false,
            message: error.message,
            details: "Please upload a more detailed LinkedIn profile.",
          });
        }
        throw error; // Re-throw other errors
      }
  
      // Log content statistics for monitoring
      console.log(`📊 LinkedIn Content Stats:`, {
        originalWords: extractedContent.metadata.originalWordCount,
        processedWords: extractedContent.metadata.wordCount,
        isTruncated: extractedContent.metadata.isTruncated,
        estimatedTokens: Math.ceil(extractedContent.fullText.length / 4),
      });
  
      // Analyze with Gemini using safe preferences
      const geminiService = new LinkedinGeminiService();
      const analysisResult = await geminiService.analyzeLinkedinProfile(
        extractedContent,
        analysisPreferences
      );
  
      // Calculate deterministic scores using algorithm
      const scoringService = new LinkedinScoringService();
  
      // Calculate overall score using algorithm (with defaults if needed)
      const calculatedOverallScore = scoringService.calculateOverallScore(
        analysisResult.benchmarkResults,
        analysisPreferences.targetJobTitle,
        analysisPreferences.experienceLevel,
        analysisPreferences.targetIndustry
      );
  
      // Calculate section scores using algorithm (with defaults if needed)
      const calculatedSectionScores = analysisResult.sectionAnalysis.map(
        (section) => ({
          sectionName: section.sectionName,
          score: scoringService.calculateSectionScoreFromGemini(
            section.sectionName,
            analysisResult.benchmarkResults,
            analysisPreferences.targetJobTitle,
            analysisPreferences.experienceLevel
          ),
          weight: 1,
        })
      );
  
      // Calculate processing time
      const processingTime = Date.now() - startTime;
  
      // Create detailed feedback array with section-specific benchmarks
      const detailedFeedback = analysisResult.sectionAnalysis.map((section) => {
        // Get benchmarks specific to this section
        const sectionBenchmarks = scoringService.getSectionBenchmarks(
          section.sectionName
        );
  
        // Filter benchmark results to only include relevant ones for this section
        const sectionSpecificBenchmarks: {
          [key: string]: { passed: boolean; score: number };
        } = {};
  
        const convertedBenchmarks = scoringService.convertForDatabase(analysisResult.benchmarkResults);
  
        sectionBenchmarks.forEach((benchmark) => {
          if (convertedBenchmarks[benchmark]) {
            sectionSpecificBenchmarks[benchmark] = convertedBenchmarks[benchmark];
          }
        });
  
        return {
          sectionName: section.sectionName,
          currentScore: scoringService.calculateSectionScoreFromGemini(
            section.sectionName,
            analysisResult.benchmarkResults,
            analysisPreferences.targetJobTitle,
            analysisPreferences.experienceLevel
          ),
          issues: section.issues,
          aiSuggestion: analysisResult.aiSuggestions.find(
            (suggestion) => suggestion.sectionName === section.sectionName
          )
            ? {
                originalText:
                  analysisResult.aiSuggestions.find(
                    (s) => s.sectionName === section.sectionName
                  )?.originalText || "",
                improvedText:
                  analysisResult.aiSuggestions.find(
                    (s) => s.sectionName === section.sectionName
                  )?.improvedText || "",
                explanation:
                  analysisResult.aiSuggestions.find(
                    (s) => s.sectionName === section.sectionName
                  )?.explanation || "",
                improvementType: "content" as const,
              }
            : undefined,
          benchmarkResults: sectionSpecificBenchmarks, // Only section-specific benchmarks
        };
      });
  
      // Convert benchmark results for database storage
      const dbBenchmarkResults = scoringService.convertForDatabase(analysisResult.benchmarkResults);
  
      // Create LinkedIn scan document
      const linkedinScan = new LinkedinScan({
        userId: req.user._id,
        fileName: req.file.originalname,
        overallScore: calculatedOverallScore,
        sectionsFound: extractedContent.sections.map((s) => s.sectionName),
        sectionScores: calculatedSectionScores,
        scanPreferences: {
          targetIndustry: analysisPreferences.targetIndustry,
          experienceLevel: analysisPreferences.experienceLevel,
          targetJobTitle: analysisPreferences.targetJobTitle,
          targetCompany: analysisPreferences.targetCompany,
          aiSuggestionLevel,
          keywords: analysisPreferences.keywords,
        },
        detailedFeedback,
        overallBenchmarks: dbBenchmarkResults,
        processingTime,
        improvementPotential: Math.max(0, 100 - calculatedOverallScore),
      });
  
      await linkedinScan.save();
  
      // Update user scan counts and stats for LINKEDIN only
      await user.updateDailyScanCount('linkedin'); // Specify linkedin scan type
      user.linkedinStats.totalScans += 1; // Update linkedin stats only
      user.linkedinStats.lastScanDate = new Date();

      // Update best score if this linkedin scan is better
      if (calculatedOverallScore > user.linkedinStats.bestScore) {
        user.linkedinStats.bestScore = calculatedOverallScore;
      }

      // Update lastLinkedins with current scan (new method)
      await user.updateLastLinkedins(linkedinScan._id as mongoose.Types.ObjectId, calculatedOverallScore);

      await user.calculateLinkedinStats(); // Calculate linkedin stats only
      await user.calculateImprovementTrend('linkedin'); // Calculate linkedin trend only
      await user.save();
  
      // Clean up uploaded file (success case)
      if (uploadedFilePath) {
        safeDeleteFile(uploadedFilePath);
      }
  
      // Return response
      return res.status(200).json({
        success: true,
        message: "LinkedIn profile analyzed successfully",
        data: {
          scanId: linkedinScan._id,
          overallScore: calculatedOverallScore,
          sectionScores: calculatedSectionScores,
          detailedFeedback: linkedinScan.detailedFeedback,
          benchmarkResults: linkedinScan.overallBenchmarks,
          processingTime,
          improvementPotential: linkedinScan.improvementPotential,
          sectionsFound: linkedinScan.sectionsFound,
          usedPreferences: {
            targetIndustry: analysisPreferences.targetIndustry,
            experienceLevel: analysisPreferences.experienceLevel,
            targetJobTitle: analysisPreferences.targetJobTitle,
            isUsingDefaults: {
              industry: !targetIndustry?.trim(),
              experienceLevel: !experienceLevel?.trim(),
              jobTitle: !targetJobTitle?.trim(),
            },
          },
          // Content processing info
          contentInfo: {
            originalWordCount: extractedContent.metadata.originalWordCount,
            processedWordCount: extractedContent.metadata.wordCount,
            wasTruncated: extractedContent.metadata.isTruncated,
            estimatedTokensUsed: Math.ceil(extractedContent.fullText.length / 4),
          },
        },
        // Warning if content was truncated
        ...(extractedContent.metadata.isTruncated && {
          warning:
            "Your LinkedIn profile was longer than optimal for analysis. Content was automatically truncated to focus on the most important sections.",
        }),
      });
    } catch (error: any) {
      console.error("LinkedIn scan error:", error);
  
      // Clean up file in error case
      if (uploadedFilePath) {
        safeDeleteFile(uploadedFilePath);
      }
  
      return res.status(500).json({
        success: false,
        message: "Failed to analyze LinkedIn profile",
        error: error.message,
      });
    }
  });

const compareLinkedinProfiles = asyncHandler(async (req: CustomRequest, res: Response) => {
  const startTime = Date.now();
  let uploadedFilePaths: string[] = [];

  try {
    // Check if user can perform comparison
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const canScan = await user.canPerformScan();
    if (!canScan) {
      return res.status(429).json({
        success: false,
        message: "Daily scan limit reached (30 scans per day)",
      });
    }

    // Validate file uploads
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files?.profile1?.[0] || !files?.profile2?.[0]) {
      return res.status(400).json({
        success: false,
        message: "Please upload both LinkedIn profile files (PDF format)",
      });
    }

    const profile1File = files.profile1[0];
    const profile2File = files.profile2[0];
    
    // Store file paths for cleanup
    uploadedFilePaths = [profile1File.path, profile2File.path];

    // Extract comparison preferences from request body with defaults
    const {
      targetIndustry,
      experienceLevel,
      targetJobTitle,
      keywords,
    } = req.body;

    const comparisonPreferences = {
      targetIndustry: targetIndustry?.trim() || "General",
      experienceLevel: experienceLevel?.trim() || "mid",
      targetJobTitle: targetJobTitle?.trim() || "General Position",
      keywords: keywords
        ? keywords.split(",").map((k: string) => k.trim())
        : [],
    };

    // Extract text from both PDFs
    const [extractedContent1, extractedContent2] = await Promise.all([
      extractTextFromPDF(profile1File.path),
      extractTextFromPDF(profile2File.path)
    ]);

    // Analyze both LinkedIn profiles using existing services
    const geminiService = new LinkedinGeminiService();
    const scoringService = new LinkedinScoringService();
    const comparisonService = new LinkedinComparisonService();

    // Get analysis for both profiles
    const [analysis1, analysis2] = await Promise.all([
      geminiService.analyzeLinkedinProfile(extractedContent1, comparisonPreferences),
      geminiService.analyzeLinkedinProfile(extractedContent2, comparisonPreferences)
    ]);

    // Calculate scores for both profiles
    const score1 = scoringService.calculateOverallScore(
      analysis1.benchmarkResults,
      comparisonPreferences.targetJobTitle,
      comparisonPreferences.experienceLevel,
      comparisonPreferences.targetIndustry
    );

    const score2 = scoringService.calculateOverallScore(
      analysis2.benchmarkResults,
      comparisonPreferences.targetJobTitle,
      comparisonPreferences.experienceLevel,
      comparisonPreferences.targetIndustry
    );

    // Generate comprehensive comparison
    const comparisonResult = await comparisonService.compareLinkedinProfiles(
      {
        fileName: profile1File.originalname,
        extractedContent: extractedContent1,
        analysis: analysis1,
        score: score1
      },
      {
        fileName: profile2File.originalname,
        extractedContent: extractedContent2,
        analysis: analysis2,
        score: score2
      },
      comparisonPreferences
    );

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Update user scan count (comparison counts as 1 LinkedIn scan)
    await user.updateDailyScanCount('linkedin');

    // Clean up uploaded files
    safeDeleteFiles(uploadedFilePaths);

    // Return comprehensive comparison result
    return res.status(200).json({
      success: true,
      message: "LinkedIn profiles compared successfully",
      data: {
        ...comparisonResult,
        processingTime,
        usedPreferences: comparisonPreferences,
        comparisonDate: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error("LinkedIn comparison error:", error);

    // Clean up files in error case
    if (uploadedFilePaths.length > 0) {
      safeDeleteFiles(uploadedFilePaths);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to compare LinkedIn profiles",
      error: error.message,
    });
  }
});

const getLinkedinScanById = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    const { scanId } = req.params;

    // Validate scanId format
    if (!scanId || !scanId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scan ID format",
      });
    }

    // Find the LinkedIn scan by ID and ensure it belongs to the authenticated user
    const linkedinScan = await LinkedinScan.findOne({
      _id: scanId,
      userId: req.user._id,
    });

    if (!linkedinScan) {
      return res.status(404).json({
        success: false,
        message: "LinkedIn scan not found or you don't have permission to access it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "LinkedIn scan retrieved successfully",
      data: linkedinScan,
    });

  } catch (error: any) {
    console.error("Get LinkedIn scan error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve LinkedIn scan",
      error: error.message,
    });
  }
});

export { scanLinkedinProfile, compareLinkedinProfiles, getLinkedinScanById };
