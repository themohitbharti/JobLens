import { Request, Response } from "express";
import mongoose from "mongoose";
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
import { ResumeComparisonService } from "../services/resumeComparisonService";

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

const safeDeleteFiles = (filePaths: string[]) => {
  filePaths.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ File deleted: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Error deleting file ${filePath}:`, error);
    }
  });
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
        message: "Daily scan limit reached (10 scans per day)",
        data: {
          scansLeft: user.scansLeft,
          dailyLimit: 10,
        },
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

    // Update user scan counts and stats for RESUME only
    await user.updateDailyScanCount('resume'); // Specify resume scan type
    user.resumeStats.totalScans += 1; // Update resume stats only
    user.resumeStats.lastScanDate = new Date();

    // Update best score if this resume scan is better
    if (calculatedOverallScore > user.resumeStats.bestScore) {
      user.resumeStats.bestScore = calculatedOverallScore;
    }

    // Update lastResumes with current scan (updated method name)
    await user.updateLastResumes(resumeScan._id as mongoose.Types.ObjectId, calculatedOverallScore);

    await user.calculateResumeStats(); // Calculate resume stats only
    await user.calculateImprovementTrend('resume'); // Calculate resume trend only
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

const compareResumes = asyncHandler(async (req: CustomRequest, res: Response) => {
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
        message: "Daily scan limit reached (10 scans per day)",
      });
    }

    // Validate file uploads
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files?.resume1?.[0] || !files?.resume2?.[0]) {
      return res.status(400).json({
        success: false,
        message: "Please upload both resume files (PDF format)",
      });
    }

    const resume1File = files.resume1[0];
    const resume2File = files.resume2[0];
    
    // Store file paths for cleanup
    uploadedFilePaths = [resume1File.path, resume2File.path];

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
      extractTextFromPDF(resume1File.path),
      extractTextFromPDF(resume2File.path)
    ]);

    console.log(`📊 Comparison Stats:`, {
      resume1: {
        words: extractedContent1.metadata.wordCount,
        sections: extractedContent1.sections.length
      },
      resume2: {
        words: extractedContent2.metadata.wordCount,
        sections: extractedContent2.sections.length
      }
    });

    // Analyze both resumes using existing services
    const geminiService = new GeminiAnalysisService();
    const scoringService = new DeterministicScoringService();
    const comparisonService = new ResumeComparisonService();

    // Get analysis for both resumes
    const [analysis1, analysis2] = await Promise.all([
      geminiService.analyzeResume(extractedContent1, comparisonPreferences),
      geminiService.analyzeResume(extractedContent2, comparisonPreferences)
    ]);

    // Calculate scores for both resumes
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
    const comparisonResult = await comparisonService.compareResumes(
      {
        fileName: resume1File.originalname,
        extractedContent: extractedContent1,
        analysis: analysis1,
        score: score1
      },
      {
        fileName: resume2File.originalname,
        extractedContent: extractedContent2,
        analysis: analysis2,
        score: score2
      },
      comparisonPreferences
    );

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Update user scan count (comparison counts as 1 resume scan)
    await user.updateDailyScanCount('resume');

    // Clean up uploaded files
    safeDeleteFiles(uploadedFilePaths);

    console.log(comparisonResult);

    // Return comprehensive comparison result
    return res.status(200).json({
      success: true,
      message: "Resumes compared successfully",
      data: {
        ...comparisonResult,
        processingTime,
        usedPreferences: comparisonPreferences,
        comparisonDate: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error("Resume comparison error:", error);

    // Clean up files in error case
    if (uploadedFilePaths.length > 0) {
      safeDeleteFiles(uploadedFilePaths);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to compare resumes",
      error: error.message,
    });
  }
});

const getResumeScanById = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    const { scanId } = req.params;

    // Validate scanId format
    if (!scanId || !scanId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scan ID format",
      });
    }

    // Find the resume scan by ID and ensure it belongs to the authenticated user
    const resumeScan = await ResumeScan.findOne({
      _id: scanId,
      userId: req.user._id
    });

    if (!resumeScan) {
      return res.status(404).json({
        success: false,
        message: "Resume scan not found or you don't have permission to access it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume scan retrieved successfully",
      data: resumeScan,
    });

  } catch (error: any) {
    console.error("Get resume scan error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve resume scan",
      error: error.message,
    });
  }
});

export { scanResume, compareResumes, getResumeScanById };
