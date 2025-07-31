import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomRequest } from "../middlewares/verifyToken.middleware";
import { extractTextFromPDF } from "../utils/pdfProcessor";
import { GeminiAnalysisService } from "../services/geminiService";
import { DeterministicScoringService } from "../services/scoringService";
import { ResumeScan } from "../models/resumeScan.models";
import { User } from "../models/user.models";

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/resumes";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
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

const scanResume = asyncHandler(async (req: CustomRequest, res: Response) => {
  const startTime = Date.now();
  let uploadedFilePath: string | null = null;

  try {
    // Check if user can perform scan
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
      if (error.message.includes("Resume too short")) {
        return res.status(400).json({
          success: false,
          message: error.message,
          details: "Please upload a more detailed resume.",
        });
      }
      throw error; // Re-throw other errors
    }

    // Log content statistics for monitoring
    console.log(`📊 Content Stats:`, {
      originalWords: extractedContent.metadata.originalWordCount,
      processedWords: extractedContent.metadata.wordCount,
      isTruncated: extractedContent.metadata.isTruncated,
      estimatedTokens: Math.ceil(extractedContent.fullText.length / 4),
    });

    // Analyze with Gemini using safe preferences
    const geminiService = new GeminiAnalysisService();
    const analysisResult = await geminiService.analyzeResume(
      extractedContent,
      analysisPreferences
    );

    // Calculate deterministic scores using algorithm
    const scoringService = new DeterministicScoringService();

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
        score: scoringService.calculateSectionScore(
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

      sectionBenchmarks.forEach((benchmark) => {
        if (analysisResult.benchmarkResults[benchmark]) {
          sectionSpecificBenchmarks[benchmark] =
            analysisResult.benchmarkResults[benchmark];
        }
      });

      return {
        sectionName: section.sectionName,
        currentScore: scoringService.calculateSectionScore(
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

    // Create resume scan document (use safe preferences)
    const resumeScan = new ResumeScan({
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
      overallBenchmarks: analysisResult.benchmarkResults,
      processingTime,
      improvementPotential: Math.max(0, 100 - calculatedOverallScore),
    });

    await resumeScan.save();

    // Update user scan counts and stats
    await user.updateDailyScanCount();
    user.resumeStats.totalScans += 1;
    user.resumeStats.lastScanDate = new Date();

    if (calculatedOverallScore > user.resumeStats.bestScore) {
      user.resumeStats.bestScore = calculatedOverallScore;
    }

    await user.calculateWeeklyStats();
    await user.save();

    // Clean up uploaded file (success case)
    if (uploadedFilePath) {
      safeDeleteFile(uploadedFilePath);
    }

    // Return response with truncation info
    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: {
        scanId: resumeScan._id,
        overallScore: calculatedOverallScore,
        sectionScores: calculatedSectionScores,
        detailedFeedback: resumeScan.detailedFeedback,
        benchmarkResults: resumeScan.overallBenchmarks,
        processingTime,
        improvementPotential: resumeScan.improvementPotential,
        sectionsFound: resumeScan.sectionsFound,
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
          "Your resume was longer than optimal for analysis. Content was automatically truncated to focus on the most important sections.",
      }),
    });
  } catch (error: any) {
    console.error("Resume scan error:", error);

    // Clean up file in error case
    if (uploadedFilePath) {
      safeDeleteFile(uploadedFilePath);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: error.message,
    });
  }
});

export { scanResume };
