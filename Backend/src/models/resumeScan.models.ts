import mongoose from "mongoose";

export interface ResumeScanDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  overallScore: number; // 0-100

  // Dynamic sections based on resume content
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

  // Comprehensive benchmark results - all consistent with passed & score (0-10)
  overallBenchmarks: {
    // Content Quality Benchmarks
    buzzwordPresence: { passed: boolean; score: number }; // 0-10
    roleClarity: { passed: boolean; score: number }; // 0-10
    quantifiedAchievements: { passed: boolean; score: number }; // 0-10
    actionVerbUsage: { passed: boolean; score: number }; // 0-10
    industryKeywords: { passed: boolean; score: number }; // 0-10

    // Structure & Format Benchmarks
    contactInfoComplete: { passed: boolean; score: number }; // 0-10
    professionalSummary: { passed: boolean; score: number }; // 0-10
    chronologicalOrder: { passed: boolean; score: number }; // 0-10
    consistentFormatting: { passed: boolean; score: number }; // 0-10
    optimalLength: { passed: boolean; score: number }; // 0-10

    // ATS Compliance Benchmarks
    noImages: { passed: boolean; score: number }; // 0-10
    noTables: { passed: boolean; score: number }; // 0-10
    standardFonts: { passed: boolean; score: number }; // 0-10
    properHeadings: { passed: boolean; score: number }; // 0-10
    keywordDensity: { passed: boolean; score: number }; // 0-10

    // Experience & Skills Benchmarks
    relevantExperience: { passed: boolean; score: number }; // 0-10
    skillsRelevance: { passed: boolean; score: number }; // 0-10
    leadershipExamples: { passed: boolean; score: number }; // 0-10
    teamworkHighlighted: { passed: boolean; score: number }; // 0-10
    problemSolvingExamples: { passed: boolean; score: number }; // 0-10

    // Education & Certifications
    educationRelevance: { passed: boolean; score: number }; // 0-10
    certificationPresence: { passed: boolean; score: number }; // 0-10
    continuousLearning: { passed: boolean; score: number }; // 0-10

    // Additional Quality Metrics
    grammarCheck: { passed: boolean; score: number }; // 0-10
    spellingCheck: { passed: boolean; score: number }; // 0-10
    readabilityScore: { passed: boolean; score: number }; // 0-10
    uniquenessScore: { passed: boolean; score: number }; // 0-10
  };

  scanDate: Date;
  processingTime: number;
  improvementPotential: number; // 0-100 score indicating room for improvement
}

const resumeScanSchema = new mongoose.Schema<ResumeScanDocument>(
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
      },
      experienceLevel: {
        type: String,
        enum: ["entry", "mid", "senior", "executive"],
        required: true,
      },
      targetJobTitle: {
        type: String,
        required: true,
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

    // All benchmarks now have consistent structure: passed (boolean) and score (0-10)
    overallBenchmarks: {
      // Content Quality Benchmarks
      buzzwordPresence: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 }, // Changed min from 1 to 0
      },
      roleClarity: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 }, // Changed min from 1 to 0
      },
      quantifiedAchievements: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 }, // Changed min from 1 to 0
      },
      actionVerbUsage: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 }, // Changed min from 1 to 0
      },
      industryKeywords: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 }, // Changed min from 1 to 0
      },

      // Structure & Format Benchmarks
      contactInfoComplete: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 }, // Changed min from 1 to 0
      },
      professionalSummary: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 }, // Changed min from 1 to 0
      },
      chronologicalOrder: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 }, // Changed min from 1 to 0
      },
      consistentFormatting: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 }, // Changed min from 1 to 0
      },
      optimalLength: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 }, // Changed min from 1 to 0
      },

      // ATS Compliance Benchmarks
      noImages: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      noTables: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      standardFonts: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      properHeadings: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      keywordDensity: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },

      // Experience & Skills Benchmarks
      relevantExperience: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      skillsRelevance: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      leadershipExamples: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      teamworkHighlighted: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      problemSolvingExamples: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },

      // Education & Certifications
      educationRelevance: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      certificationPresence: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      continuousLearning: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },

      // Additional Quality Metrics
      grammarCheck: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      spellingCheck: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      readabilityScore: {
        passed: { type: Boolean, default: false },
        score: { type: Number, min: 0, max: 10, default: 0 },
      },
      uniquenessScore: {
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
resumeScanSchema.index({ userId: 1, scanDate: -1 });
resumeScanSchema.index({ "scanPreferences.targetIndustry": 1 });
resumeScanSchema.index({ overallScore: -1 });

export const ResumeScan = mongoose.model<ResumeScanDocument>(
  "ResumeScan",
  resumeScanSchema
);
