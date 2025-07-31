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

    // Extract scan preferences from request body
    const {
      targetIndustry,
      experienceLevel,
      targetJobTitle,
      targetCompany,
      aiSuggestionLevel = "basic",
      keywords,
    } = req.body;

    if (!targetIndustry || !experienceLevel || !targetJobTitle) {
      return res.status(400).json({
        success: false,
        message:
          "Target industry, experience level, and job title are required",
      });
    }

    // Extract text from PDF
    const extractedContent = await extractTextFromPDF(req.file.path);

    // Analyze with Gemini (ONLY for benchmarks and suggestions, NOT scores)
    const geminiService = new GeminiAnalysisService();
    const analysisResult = await geminiService.analyzeResume(extractedContent, {
      targetIndustry,
      experienceLevel,
      targetJobTitle,
      targetCompany,
      keywords: keywords
        ? keywords.split(",").map((k: string) => k.trim())
        : [],
    });

    // Calculate deterministic scores using algorithm
    const scoringService = new DeterministicScoringService();

    // Calculate overall score using algorithm (NOT from AI)
    const calculatedOverallScore = scoringService.calculateOverallScore(
      analysisResult.benchmarkResults,
      targetJobTitle,
      experienceLevel,
      targetIndustry
    );

    // Calculate section scores using algorithm (NOT from AI)
    const calculatedSectionScores = analysisResult.sectionAnalysis.map(
      (section) => ({
        sectionName: section.sectionName,
        score: scoringService.calculateSectionScore(
          section.sectionName,
          analysisResult.benchmarkResults,
          targetJobTitle,
          experienceLevel
        ),
        weight: 1,
      })
    );

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Create detailed feedback array (use calculated scores, not AI scores)
    const detailedFeedback = analysisResult.sectionAnalysis.map((section) => ({
      sectionName: section.sectionName,
      currentScore: scoringService.calculateSectionScore(
        // Use algorithm score
        section.sectionName,
        analysisResult.benchmarkResults,
        targetJobTitle,
        experienceLevel
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
      benchmarkResults: analysisResult.benchmarkResults,
    }));

    // Create resume scan document (use calculated scores)
    const resumeScan = new ResumeScan({
      userId: req.user._id,
      fileName: req.file.originalname,
      overallScore: calculatedOverallScore, //Algorithm score, not AI
      sectionsFound: extractedContent.sections.map((s) => s.sectionName),
      sectionScores: calculatedSectionScores, //Algorithm scores, not AI
      scanPreferences: {
        targetIndustry,
        experienceLevel,
        targetJobTitle,
        targetCompany,
        aiSuggestionLevel,
        keywords: keywords
          ? keywords.split(",").map((k: string) => k.trim())
          : [],
      },
      detailedFeedback,
      overallBenchmarks: analysisResult.benchmarkResults,
      processingTime,
      improvementPotential: Math.max(0, 100 - calculatedOverallScore), // Use calculated score
    });

    await resumeScan.save();

    // Update user scan counts and stats
    await user.updateDailyScanCount();
    user.resumeStats.totalScans += 1;
    user.resumeStats.lastScanDate = new Date();

    if (calculatedOverallScore > user.resumeStats.bestScore) {
      // Use calculated score
      user.resumeStats.bestScore = calculatedOverallScore;
    }

    await user.calculateWeeklyStats();
    await user.save();

    // Clean up uploaded file (success case)
    if (uploadedFilePath) {
      safeDeleteFile(uploadedFilePath);
    }

    // Return response (use calculated scores)
    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: {
        scanId: resumeScan._id,
        overallScore: calculatedOverallScore, //Algorithm score
        sectionScores: calculatedSectionScores, //Algorithm scores
        detailedFeedback: resumeScan.detailedFeedback,
        benchmarkResults: resumeScan.overallBenchmarks,
        processingTime,
        improvementPotential: resumeScan.improvementPotential,
        sectionsFound: resumeScan.sectionsFound,
      },
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
