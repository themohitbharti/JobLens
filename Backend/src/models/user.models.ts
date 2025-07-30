import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config/envConfig";

export interface UserDocument extends mongoose.Document {
  email: string;
  fullName: string;
  googleId?: string;
  coverImage?: string;
  password: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  dailyScans: {
    date: Date;
    count: number;
  }[];

  resumeStats: {
    totalScans: number;
    weeklyScans: number;
    weeklyAvg: number;
    bestScore: number;
    lastScanDate?: Date;
    improvementTrend: number;
  };

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
  canPerformScan(): Promise<boolean>;
  updateDailyScanCount(): Promise<void>;
  calculateWeeklyStats(): Promise<void>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    coverImage: {
      type: String,
    },
    password: {
      type: String,
      required: function (): boolean {
        return !this.googleId; // Required only if not signed up via Google
      },
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },

    dailyScans: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],

    resumeStats: {
      totalScans: {
        type: Number,
        default: 0,
      },
      weeklyScans: {
        type: Number,
        default: 0,
      },
      weeklyAvg: {
        type: Number,
        default: 0,
      },
      bestScore: {
        type: Number,
        default: 0,
      },
      lastScanDate: Date,
      improvementTrend: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

userSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  if (!this.password) {
    throw new Error("Password is undefined");
  }
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },

    config.ACCESS_TOKEN_SECRET,

    {
      expiresIn: "1d",
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },

    config.REFRESH_TOKEN_SECRET,

    {
      expiresIn: "10d",
    }
  );
};

userSchema.methods.canPerformScan = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayScans = this.dailyScans.find((scan: any) => {
    const scanDate = new Date(scan.date);
    scanDate.setHours(0, 0, 0, 0);
    return scanDate.getTime() === today.getTime();
  });

  return !todayScans || todayScans.count < 30;
};

userSchema.methods.updateDailyScanCount = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayIndex = this.dailyScans.findIndex((scan: any) => {
    const scanDate = new Date(scan.date);
    scanDate.setHours(0, 0, 0, 0);
    return scanDate.getTime() === today.getTime();
  });

  if (todayIndex >= 0) {
    this.dailyScans[todayIndex].count += 1;
  } else {
    this.dailyScans.push({ date: today, count: 1 });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  this.dailyScans = this.dailyScans.filter(
    (scan: any) => scan.date >= thirtyDaysAgo
  );
};

userSchema.methods.calculateWeeklyStats = async function () {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const ResumeScan = mongoose.model("ResumeScan");

  const weeklyScans = await ResumeScan.find({
    userId: this._id,
    scanDate: { $gte: sevenDaysAgo },
  });

  this.resumeStats.weeklyScans = weeklyScans.length;

  if (weeklyScans.length > 0) {
    const totalScore = weeklyScans.reduce(
      (sum: number, scan: any) => sum + scan.overallScore,
      0
    );
    this.resumeStats.weeklyAvg = Math.round(totalScore / weeklyScans.length);
  } else {
    this.resumeStats.weeklyAvg = 0;
  }
};

export const User = mongoose.model<UserDocument>("User", userSchema);
