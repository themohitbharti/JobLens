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
    return `
You are an expert resume analyzer for ${
      preferences.targetIndustry
    } industry, focusing on ${preferences.targetJobTitle} positions at ${
      preferences.experienceLevel
    } level.

**Resume Content:**
${content.fullText}

**Target Context:**
- Industry: ${preferences.targetIndustry}
- Experience Level: ${preferences.experienceLevel}  
- Job Title: ${preferences.targetJobTitle}
- Keywords: ${preferences.keywords?.join(", ") || "None provided"}

**Analyze each benchmark and provide detailed scoring rationale:**

**IMPORTANT: For each benchmark, analyze the content and provide:**
1. Whether it passes (boolean)
2. A detailed scoring explanation (0-10 scale)
3. Specific evidence from the resume

**Provide JSON response:**
{
  "benchmarkResults": {
    "buzzwordPresence": { 
      "passed": boolean, 
      "evidence": "specific examples found",
      "scoreRationale": "why this deserves X/10 score",
      "detectedCount": number
    },
    "roleClarity": { 
      "passed": boolean,
      "evidence": "how role clarity is demonstrated",
      "scoreRationale": "scoring explanation",
      "matchPercentage": number
    },
    "quantifiedAchievements": { 
      "passed": boolean,
      "evidence": "metrics and numbers found",
      "scoreRationale": "scoring explanation", 
      "achievementCount": number
    },
    "actionVerbUsage": { 
      "passed": boolean,
      "evidence": "action verbs identified",
      "scoreRationale": "scoring explanation",
      "verbCount": number
    },
    "industryKeywords": { 
      "passed": boolean,
      "evidence": "industry terms found",
      "scoreRationale": "scoring explanation",
      "keywordMatches": number
    },
    "contactInfoComplete": { 
      "passed": boolean,
      "evidence": "contact elements found",
      "scoreRationale": "scoring explanation",
      "completenessScore": number
    },
    "professionalSummary": { 
      "passed": boolean,
      "evidence": "summary quality assessment",
      "scoreRationale": "scoring explanation",
      "qualityScore": number
    },
    "chronologicalOrder": { 
      "passed": boolean,
      "evidence": "date ordering analysis",
      "scoreRationale": "scoring explanation"
    },
    "consistentFormatting": { 
      "passed": boolean,
      "evidence": "formatting consistency notes",
      "scoreRationale": "scoring explanation"
    },
    "optimalLength": { 
      "passed": boolean,
      "evidence": "length analysis",
      "scoreRationale": "scoring explanation",
      "wordCount": number
    },
    "noImages": { 
      "passed": boolean,
      "evidence": "image detection result",
      "scoreRationale": "scoring explanation"
    },
    "noTables": { 
      "passed": boolean,
      "evidence": "table detection result", 
      "scoreRationale": "scoring explanation"
    },
    "standardFonts": { 
      "passed": boolean,
      "evidence": "font analysis",
      "scoreRationale": "scoring explanation"
    },
    "properHeadings": { 
      "passed": boolean,
      "evidence": "heading structure analysis",
      "scoreRationale": "scoring explanation"
    },
    "keywordDensity": { 
      "passed": boolean,
      "evidence": "keyword density analysis",
      "scoreRationale": "scoring explanation",
      "densityPercentage": number
    },
    "relevantExperience": { 
      "passed": boolean,
      "evidence": "experience relevance assessment",
      "scoreRationale": "scoring explanation",
      "relevanceScore": number
    },
    "skillsRelevance": { 
      "passed": boolean,
      "evidence": "skills matching analysis",
      "scoreRationale": "scoring explanation",
      "matchScore": number
    },
    "leadershipExamples": { 
      "passed": boolean,
      "evidence": "leadership evidence found",
      "scoreRationale": "scoring explanation",
      "exampleCount": number
    },
    "teamworkHighlighted": { 
      "passed": boolean,
      "evidence": "teamwork examples identified",
      "scoreRationale": "scoring explanation"
    },
    "problemSolvingExamples": { 
      "passed": boolean,
      "evidence": "problem-solving examples found",
      "scoreRationale": "scoring explanation",
      "exampleCount": number
    },
    "educationRelevance": { 
      "passed": boolean,
      "evidence": "education relevance assessment",
      "scoreRationale": "scoring explanation"
    },
    "certificationPresence": { 
      "passed": boolean,
      "evidence": "certifications found",
      "scoreRationale": "scoring explanation",
      "certCount": number
    },
    "continuousLearning": { 
      "passed": boolean,
      "evidence": "learning evidence identified",
      "scoreRationale": "scoring explanation"
    },
    "grammarCheck": { 
      "passed": boolean,
      "evidence": "grammar quality assessment",
      "scoreRationale": "scoring explanation"
    },
    "spellingCheck": { 
      "passed": boolean,
      "evidence": "spelling accuracy assessment", 
      "scoreRationale": "scoring explanation"
    },
    "readabilityScore": { 
      "passed": boolean,
      "evidence": "readability assessment",
      "scoreRationale": "scoring explanation"
    },
    "uniquenessScore": { 
      "passed": boolean,
      "evidence": "uniqueness assessment",
      "scoreRationale": "scoring explanation"
    }
  },
  "sectionAnalysis": [
    {
      "sectionName": "Contact Information",
      "issues": ["specific issues found"],
      "suggestions": ["specific improvements needed"]
    },
    {
      "sectionName": "Professional Summary", 
      "issues": ["specific issues found"],
      "suggestions": ["specific improvements needed"]
    },
    {
      "sectionName": "Work Experience",
      "issues": ["specific issues found"],
      "suggestions": ["specific improvements needed"]
    },
    {
      "sectionName": "Skills",
      "issues": ["specific issues found"],
      "suggestions": ["specific improvements needed"]
    },
    {
      "sectionName": "Education",
      "issues": ["specific issues found"],
      "suggestions": ["specific improvements needed"]
    },
    {
      "sectionName": "Projects",
      "issues": ["specific issues found"],
      "suggestions": ["specific improvements needed"]
    },
    {
      "sectionName": "Certifications",
      "issues": ["specific issues found"],
      "suggestions": ["specific improvements needed"]
    },
    {
      "sectionName": "Achievements",
      "issues": ["specific issues found"],
      "suggestions": ["specific improvements needed"]
    }
  ],
  "aiSuggestions": [
    {
      "sectionName": "string",
      "originalText": "text needing improvement",
      "improvedText": "improved version",
      "explanation": "why this helps for ${preferences.targetJobTitle} role"
    }
  ]
}

Be thorough in your analysis. Provide specific evidence and scoring rationale for each benchmark.
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
      "buzzwordPresence",
      "roleClarity",
      "quantifiedAchievements",
      "actionVerbUsage",
      "industryKeywords",
      "contactInfoComplete",
      "professionalSummary",
      "chronologicalOrder",
      "consistentFormatting",
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
      "continuousLearning",
      "grammarCheck",
      "spellingCheck",
      "readabilityScore",
      "uniquenessScore",
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

      case "contactInfoComplete":
        const completeness = result.completenessScore || 0;
        return Math.min(10, completeness);

      case "professionalSummary":
        const quality = result.qualityScore || 0;
        return Math.min(10, quality);

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

      case "relevantExperience":
        const relevanceScore = result.relevanceScore || 0;
        return Math.min(10, relevanceScore);

      case "skillsRelevance":
        const matchScore = result.matchScore || 0;
        return Math.min(10, matchScore);

      case "leadershipExamples":
        const leadershipCount = result.exampleCount || 0;
        return Math.min(10, baseScore + Math.min(3, leadershipCount));

      case "problemSolvingExamples":
        const problemCount = result.exampleCount || 0;
        return Math.min(10, baseScore + Math.min(3, problemCount));

      case "certificationPresence":
        const certCount = result.certCount || 0;
        return Math.min(10, baseScore + Math.min(3, certCount));

      // Boolean benchmarks (ATS compliance)
      case "noImages":
      case "noTables":
      case "standardFonts":
      case "properHeadings":
      case "chronologicalOrder":
      case "consistentFormatting":
        return result.passed ? 10 : 0;

      // Quality assessments
      case "grammarCheck":
      case "spellingCheck":
      case "readabilityScore":
      case "uniquenessScore":
      case "teamworkHighlighted":
      case "educationRelevance":
      case "continuousLearning":
      case "buzzwordPresence":
        return result.passed
          ? Math.min(10, baseScore + 2)
          : Math.max(0, baseScore - 2);

      default:
        return baseScore;
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
      "buzzwordPresence",
      "roleClarity",
      "quantifiedAchievements",
      "actionVerbUsage",
      "industryKeywords",
      "contactInfoComplete",
      "professionalSummary",
      "chronologicalOrder",
      "consistentFormatting",
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
      "continuousLearning",
      "grammarCheck",
      "spellingCheck",
      "readabilityScore",
      "uniquenessScore",
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
