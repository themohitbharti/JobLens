import mongoose from "mongoose";

export interface LinkedinScanDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  overallScore: number; // 0-100

  // Dynamic sections based on LinkedIn profile content
  sectionsFound: string[];
  sectionScores: {
    sectionName: string;
    score: number; // 1-10
    weight: number; // importance weight of this section
  }[];

  // Scan preferences (dynamic per scan)
  scanPreferences: {
    targetIndustry: string;
    experienceLevel: "entry" | "mid" | "senior" | "executive";
    targetJobTitle: string;
    targetCompany?: string;
    aiSuggestionLevel: "basic" | "detailed" | "comprehensive";
    keywords?: string[]; // Job description keywords
  };

  // Combined feedback with AI suggestions
  detailedFeedback: {
    sectionName: string;
    currentScore: number; // 1-10
    issues: string[];
    aiSuggestion?: {
      originalText: string;
      improvedText: string;
      explanation: string;
      improvementType: "content" | "structure" | "keywords" | "formatting";
    };
    benchmarkResults: {
      [benchmarkName: string]: {
        passed: boolean;
        score: number; // 1-10
      };
    };
  }[];

  // Comprehensive benchmark results - 20 enhanced LinkedIn benchmarks
  overallBenchmarks: {
    // Contact Information Benchmarks
    contactInfoComplete: { passed: boolean; score: number }; // 0-10
    linkedinUrlPresent: { passed: boolean; score: number }; // 0-10
    portfolioLinked: { passed: boolean; score: number }; // 0-10

    // Professional Summary Benchmarks
    professionalSummaryCompelling: { passed: boolean; score: number }; // 0-10
    industryKeywords: { passed: boolean; score: number }; // 0-10
    careerGoalsClear: { passed: boolean; score: number }; // 0-10
    personalBrandingStrong: { passed: boolean; score: number }; // 0-10

    // Experience Quality Benchmarks (Enhanced)
    experienceDetailed: { passed: boolean; score: number }; // 0-10
    experienceQuantified: { passed: boolean; score: number }; // 0-10
    roleProgressionClear: { passed: boolean; score: number }; // 0-10
    jobTitlesOptimized: { passed: boolean; score: number }; // 0-10 - Hard skills in job titles
    noEmploymentGaps: { passed: boolean; score: number }; // 0-10 - No unemployment indicators
    roleDescriptionsPresent: { passed: boolean; score: number }; // 0-10 - Detailed job descriptions

    // Education & Skills Benchmarks
    educationComplete: { passed: boolean; score: number }; // 0-10
    skillsRelevant: { passed: boolean; score: number }; // 0-10
    technicalSkillsListed: { passed: boolean; score: number }; // 0-10
    languagesProficiency: { passed: boolean; score: number }; // 0-10

    // Additional Value Benchmarks
    certificationsPresent: { passed: boolean; score: number }; // 0-10
    publicationsPresent: { passed: boolean; score: number }; // 0-10
    volunteering: { passed: boolean; score: number }; // 0-10
    achievementsHighlighted: { passed: boolean; score: number }; // 0-10
  };

  scanDate: Date;
  processingTime: number;
  improvementPotential: number; // 0-100 score indicating room for improvement
}

const linkedinScanSchema = new mongoose.Schema<LinkedinScanDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    sectionsFound: [String],

    sectionScores: [
      {
        sectionName: String,
        score: {
          type: Number,
          min: 0,
          max: 10,
        },
        weight: {
          type: Number,
          min: 0,
          max: 1,
          default: 1,
        },
      },
    ],

    scanPreferences: {
      targetIndustry: {
        type: String,
        required: true,
        default: "General",
      },
      experienceLevel: {
        type: String,
        enum: ["entry", "mid", "senior", "executive"],
        required: true,
        default: "mid",
      },
      targetJobTitle: {
        type: String,
        required: true,
        default: "General Position",
      },
      targetCompany: String,
      aiSuggestionLevel: {
        type: String,
        enum: ["basic", "detailed", "comprehensive"],
        default: "detailed",
      },
      keywords: [String],
    },

    detailedFeedback: [
      {
        sectionName: String,
        currentScore: {
          type: Number,
          min: 0,
          max: 10,
        },
        issues: [String],
        aiSuggestion: {
          originalText: String,
          improvedText: String,
          explanation: String,
          improvementType: {
            type: String,
            enum: ["content", "structure", "keywords", "formatting"],
          },
        },
        benchmarkResults: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],

    // 20 enhanced benchmarks with consistent structure: passed (boolean) and score (0-10)
    overallBenchmarks: {
      // Contact Information Benchmarks
      contactInfoComplete: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      linkedinUrlPresent: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      portfolioLinked: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },

      // Professional Summary Benchmarks
      professionalSummaryCompelling: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      industryKeywords: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      careerGoalsClear: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      personalBrandingStrong: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },

      // Experience Quality Benchmarks (Enhanced)
      experienceDetailed: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      experienceQuantified: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      roleProgressionClear: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      jobTitlesOptimized: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      noEmploymentGaps: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      roleDescriptionsPresent: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },

      // Education & Skills Benchmarks
      educationComplete: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      skillsRelevant: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      technicalSkillsListed: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      languagesProficiency: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },

      // Additional Value Benchmarks
      certificationsPresent: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      publicationsPresent: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      volunteering: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      achievementsHighlighted: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
    },

    scanDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    processingTime: {
      type: Number,
      required: true,
    },
    improvementPotential: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
linkedinScanSchema.index({ userId: 1, scanDate: -1 });
linkedinScanSchema.index({ "scanPreferences.targetIndustry": 1 });
linkedinScanSchema.index({ overallScore: -1 });

export const LinkedinScan = mongoose.model<LinkedinScanDocument>(
  "LinkedinScan",
  linkedinScanSchema
);