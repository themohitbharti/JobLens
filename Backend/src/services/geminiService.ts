import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/envConfig";
import { ExtractedContent } from "../utils/pdfProcessor";

export interface GeminiAnalysisResult {
  overallScore: number; // Will be calculated by algorithm
  sectionAnalysis: {
    sectionName: string;
    score: number; // Will be calculated by algorithm
    issues: string[];
    suggestions: string[];
  }[];
  benchmarkResults: {
    [key: string]: {
      passed: boolean;
      score: number; // Will be generated from passed + content analysis
    };
  };
  aiSuggestions: {
    sectionName: string;
    originalText: string;
    improvedText: string;
    explanation: string;
  }[];
}

export class GeminiAnalysisService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async analyzeResume(
    extractedContent: ExtractedContent,
    preferences: {
      targetIndustry: string;
      experienceLevel: string;
      targetJobTitle: string;
      targetCompany?: string;
      keywords?: string[];
    }
  ): Promise<GeminiAnalysisResult> {
    const prompt = this.buildAnalysisPrompt(extractedContent, preferences);

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return this.parseGeminiResponse(response, extractedContent, preferences);
    } catch (error) {
      console.error("Gemini analysis error:", error);
      throw new Error("Failed to analyze resume with AI");
    }
  }

  private buildAnalysisPrompt(
    content: ExtractedContent,
    preferences: any
  ): string {
    // Handle default values in prompt
    const isUsingDefaults = {
      industry: preferences.targetIndustry === "General",
      jobTitle: preferences.targetJobTitle === "General Position",
      experienceLevel: preferences.experienceLevel === "mid",
    };

    return `
You are an expert resume analyzer${
      isUsingDefaults.industry
        ? " providing general resume quality assessment"
        : ` for ${preferences.targetIndustry} industry`
    }${
      isUsingDefaults.jobTitle
        ? ""
        : `, focusing on ${preferences.targetJobTitle} positions`
    } at ${preferences.experienceLevel} level.

**Resume Content:**
${content.fullText}

**Analysis Context:**
- Industry: ${preferences.targetIndustry}${
      isUsingDefaults.industry ? " (using general analysis)" : ""
    }
- Experience Level: ${preferences.experienceLevel}
- Job Title: ${preferences.targetJobTitle}${
      isUsingDefaults.jobTitle ? " (using general analysis)" : ""
    }
- Keywords: ${preferences.keywords?.join(", ") || "None provided"}

${
  isUsingDefaults.industry && isUsingDefaults.jobTitle
    ? `**Note:** Performing general resume quality analysis. Provide universal best practices and quality assessments.`
    : `**Note:** Tailoring analysis for ${preferences.targetJobTitle} in ${preferences.targetIndustry} industry.`
}

**Analyze each of these 20 core benchmarks and provide detailed scoring rationale:**

**Core Benchmarks to Analyze:**
1. roleClarity
2. quantifiedAchievements
3. actionVerbUsage
4. industryKeywords
5. contactInfoComplete
6. professionalSummary
7. chronologicalOrder
8. optimalLength
9. noImages
10. noTables
11. standardFonts
12. properHeadings
13. keywordDensity
14. relevantExperience
15. skillsRelevance
16. leadershipExamples
17. teamworkHighlighted
18. problemSolvingExamples
19. educationRelevance
20. certificationPresence

**IMPORTANT: For each benchmark, analyze the content and provide:**
1. Whether it passes (boolean)
2. A detailed scoring explanation (0-10 scale)
3. Specific evidence from the resume

**Provide JSON response:**
{
  "benchmarkResults": {
    "roleClarity": { 
      "passed": boolean,
      "evidence": "how role clarity is demonstrated",
      "scoreRationale": "scoring explanation",
      "matchPercentage": number
    },
    "quantifiedAchievements": { 
      "passed": boolean, 
      "evidence": "specific examples found",
      "scoreRationale": "why this deserves X/10 score",
      "detectedCount": number
    },
    // ... rest of 20 benchmarks
  },
  "sectionAnalysis": [
    {
      "sectionName": "Contact Information",
      "issues": ["specific issues found"],
      "suggestions": ["specific improvements needed"]
    },
    // ... rest of sections
  ],
  "aiSuggestions": [
    {
      "sectionName": "string",
      "originalText": "text needing improvement",
      "improvedText": "improved version",
      "explanation": "${
        isUsingDefaults.jobTitle
          ? "general improvement rationale"
          : `why this helps for ${preferences.targetJobTitle} role`
      }"
    }
  ]
}

Be thorough in your analysis of all 20 benchmarks. ${
      isUsingDefaults.industry && isUsingDefaults.jobTitle
        ? "Focus on universal resume quality principles."
        : "Provide specific evidence and scoring rationale for each benchmark based on the target role."
    }
`;
  }

  private parseGeminiResponse(
    response: string,
    content: ExtractedContent,
    preferences: any
  ): GeminiAnalysisResult {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      // Convert AI analysis to numeric scores
      const processedBenchmarks = this.convertToNumericScores(
        parsedResponse.benchmarkResults || {},
        content,
        preferences
      );

      return {
        overallScore: 0, // Will be calculated by scoring service
        sectionAnalysis: this.ensureAllSections(
          parsedResponse.sectionAnalysis || []
        ),
        benchmarkResults: processedBenchmarks,
        aiSuggestions: parsedResponse.aiSuggestions || [],
      };
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return this.generateFallbackAnalysis(content, preferences);
    }
  }

  private convertToNumericScores(
    benchmarkResults: any,
    content: ExtractedContent,
    preferences: any
  ): { [key: string]: { passed: boolean; score: number } } {
    const processedResults: {
      [key: string]: { passed: boolean; score: number };
    } = {};

    // Define all expected benchmarks
    const allBenchmarks = [
      "roleClarity",
      "quantifiedAchievements",
      "actionVerbUsage",
      "industryKeywords",
      "contactInfoComplete",
      "professionalSummary",
      "chronologicalOrder",
      "optimalLength",
      "noImages",
      "noTables",
      "standardFonts",
      "properHeadings",
      "keywordDensity",
      "relevantExperience",
      "skillsRelevance",
      "leadershipExamples",
      "teamworkHighlighted",
      "problemSolvingExamples",
      "educationRelevance",
      "certificationPresence",
    ];

    allBenchmarks.forEach((benchmark) => {
      const result = benchmarkResults[benchmark];

      if (result) {
        processedResults[benchmark] = {
          passed: result.passed || false,
          score: this.calculateBenchmarkScore(
            benchmark,
            result,
            content,
            preferences
          ),
        };
      } else {
        // Fallback scoring for missing benchmarks
        processedResults[benchmark] = {
          passed: false,
          score: this.calculateFallbackScore(benchmark, content, preferences),
        };
      }
    });

    return processedResults;
  }

  private calculateBenchmarkScore(
    benchmark: string,
    result: any,
    content: ExtractedContent,
    preferences: any
  ): number {
    const baseScore = result.passed ? 6 : 2; // Base score for pass/fail

    // Enhance score based on specific evidence and metrics
    switch (benchmark) {
      case "quantifiedAchievements":
        const achievementCount = result.achievementCount || 0;
        return Math.min(10, baseScore + Math.min(4, achievementCount));

      case "industryKeywords":
        const keywordMatches = result.keywordMatches || 0;
        const keywordBonus = Math.min(3, keywordMatches / 2);
        return Math.min(10, baseScore + keywordBonus);

      case "roleClarity":
        const matchPercentage = result.matchPercentage || 0;
        return Math.min(10, Math.round(matchPercentage / 10));

      case "actionVerbUsage":
        const verbCount = result.verbCount || 0;
        return Math.min(10, baseScore + Math.min(3, Math.floor(verbCount / 3)));

      // 🔥 FIXED: Handle contactInfoComplete properly
      case "contactInfoComplete":
        // If we have a specific completeness score, use it
        if (
          result.completenessScore &&
          typeof result.completenessScore === "number"
        ) {
          return Math.min(10, result.completenessScore);
        }
        // Otherwise, use pass/fail logic with enhancement
        return result.passed
          ? Math.min(10, baseScore + 4)
          : Math.max(0, baseScore - 2);

      // 🔥 FIXED: Handle professionalSummary properly
      case "professionalSummary":
        // If we have a specific quality score, use it
        if (result.qualityScore && typeof result.qualityScore === "number") {
          return Math.min(10, result.qualityScore);
        }
        // Otherwise, use pass/fail logic with enhancement
        return result.passed
          ? Math.min(10, baseScore + 4)
          : Math.max(0, baseScore - 2);

      case "optimalLength":
        const wordCount = result.wordCount || 0;
        if (wordCount >= 200 && wordCount <= 600) return 10;
        if (wordCount >= 150 && wordCount <= 800) return 8;
        if (wordCount >= 100 && wordCount <= 1000) return 6;
        return 3;

      case "keywordDensity":
        const density = result.densityPercentage || 0;
        if (density >= 2 && density <= 4) return 10;
        if (density >= 1 && density <= 6) return 8;
        if (density > 0) return 5;
        return 2;

      // 🔥 FIXED: Handle relevantExperience properly
      case "relevantExperience":
        // If we have a specific relevance score, use it
        if (
          result.relevanceScore &&
          typeof result.relevanceScore === "number"
        ) {
          return Math.min(10, result.relevanceScore);
        }
        // Otherwise, use pass/fail logic with enhancement
        return result.passed
          ? Math.min(10, baseScore + 4)
          : Math.max(0, baseScore - 2);

      // 🔥 FIXED: Handle skillsRelevance properly
      case "skillsRelevance":
        // If we have a specific match score, use it
        if (result.matchScore && typeof result.matchScore === "number") {
          return Math.min(10, result.matchScore);
        }
        // Otherwise, use pass/fail logic with enhancement
        return result.passed
          ? Math.min(10, baseScore + 4)
          : Math.max(0, baseScore - 2);

      case "leadershipExamples":
        const leadershipCount = result.exampleCount || 0;
        return Math.min(10, baseScore + Math.min(3, leadershipCount));

      case "problemSolvingExamples":
        const problemCount = result.exampleCount || 0;
        return Math.min(10, baseScore + Math.min(3, problemCount));

      case "certificationPresence":
        const certCount = result.certCount || 0;
        return Math.min(10, baseScore + Math.min(3, certCount));

      // Boolean benchmarks (ATS compliance) - these work correctly
      case "noImages":
      case "noTables":
      case "standardFonts":
      case "properHeadings":
      case "chronologicalOrder":
        return result.passed ? 10 : 0;

      // 🔥 FIXED: Handle other quality assessments properly
      case "teamworkHighlighted":
      case "educationRelevance":
        return result.passed
          ? Math.min(10, baseScore + 4) // Give higher score for pass
          : Math.max(0, baseScore - 2); // Lower score for fail

      default:
        // Default case - use enhanced pass/fail scoring
        return result.passed
          ? Math.min(10, baseScore + 2)
          : Math.max(0, baseScore - 2);
    }
  }

  private calculateFallbackScore(
    benchmark: string,
    content: ExtractedContent,
    preferences: any
  ): number {
    // Simple content-based scoring for missing benchmarks
    const text = content.fullText.toLowerCase();

    switch (benchmark) {
      case "contactInfoComplete":
        const hasEmail = /@/.test(text);
        const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
        return (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0);

      case "quantifiedAchievements":
        const numberMatches = text.match(/\d+%|\d+\+|\$\d+|\d+x/g) || [];
        return Math.min(10, numberMatches.length * 2);

      case "industryKeywords":
        const keywords = preferences.keywords || [];
        const matches = keywords.filter((kw: string) =>
          text.includes(kw.toLowerCase())
        ).length;
        return Math.min(10, matches * 2);

      case "optimalLength":
        const wordCount = content.metadata.wordCount;
        if (wordCount >= 200 && wordCount <= 600) return 10;
        if (wordCount >= 150 && wordCount <= 800) return 8;
        return 5;

      default:
        return 5; // Default neutral score
    }
  }

  private ensureAllSections(sectionAnalysis: any[]): any[] {
    const requiredSections = [
      "Contact Information",
      "Professional Summary",
      "Work Experience",
      "Skills",
      "Education",
      "Projects",
      "Certifications",
      "Achievements",
    ];

    const analysisMap = new Map(sectionAnalysis.map((s) => [s.sectionName, s]));

    return requiredSections.map((sectionName) => {
      if (analysisMap.has(sectionName)) {
        return analysisMap.get(sectionName);
      } else {
        return {
          sectionName,
          score: 0, // Will be calculated by scoring service
          issues: ["Section is missing from resume"],
          suggestions: ["Add this section to improve your resume completeness"],
        };
      }
    });
  }

  private generateFallbackAnalysis(
    content: ExtractedContent,
    preferences: any
  ): GeminiAnalysisResult {
    // Create fallback benchmark results with basic scoring
    const fallbackBenchmarks: {
      [key: string]: { passed: boolean; score: number };
    } = {};

    const allBenchmarks = [
      "roleClarity",
      "quantifiedAchievements",
      "actionVerbUsage",
      "industryKeywords",
      "contactInfoComplete",
      "professionalSummary",
      "chronologicalOrder",
      "optimalLength",
      "noImages",
      "noTables",
      "standardFonts",
      "properHeadings",
      "keywordDensity",
      "relevantExperience",
      "skillsRelevance",
      "leadershipExamples",
      "teamworkHighlighted",
      "problemSolvingExamples",
      "educationRelevance",
      "certificationPresence",
    ];

    allBenchmarks.forEach((benchmark) => {
      fallbackBenchmarks[benchmark] = {
        passed: false,
        score: this.calculateFallbackScore(benchmark, content, preferences),
      };
    });

    return {
      overallScore: 0, // Will be calculated by scoring service
      sectionAnalysis: this.ensureAllSections([]),
      benchmarkResults: fallbackBenchmarks,
      aiSuggestions: [],
    };
  }
}
