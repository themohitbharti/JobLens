import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/envConfig";
import { ExtractedContent } from "../utils/pdfProcessor";

export interface GeminiAnalysisResult {
  overallScore: number;
  sectionAnalysis: {
    sectionName: string;
    score: number;
    issues: string[];
    suggestions: string[];
  }[];
  benchmarkResults: {
    [key: string]: {
      passed: boolean;
      score: number;
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

      return this.parseGeminiResponse(response, extractedContent);
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
You are an expert resume analyzer and ATS specialist. Analyze the following resume and provide detailed feedback.

**Resume Content:**
${content.fullText}

**Target Requirements:**
- Industry: ${preferences.targetIndustry}
- Experience Level: ${preferences.experienceLevel}
- Job Title: ${preferences.targetJobTitle}
- Target Company: ${preferences.targetCompany || "Not specified"}
- Keywords: ${preferences.keywords?.join(", ") || "None provided"}

**Sections Found:**
${content.sections
  .map((s) => `- ${s.sectionName}: ${s.content.substring(0, 100)}...`)
  .join("\n")}

**IMPORTANT SCORING GUIDELINES:**
- All benchmark scores must be between 0-10 (0 = very poor, 10 = excellent)
- Use 0 for completely missing elements
- Use 1-3 for poor performance
- Use 4-6 for average performance  
- Use 7-8 for good performance
- Use 9-10 for excellent performance

**Please analyze and provide a JSON response with the following structure:**
{
  "overallScore": <number 0-100>,
  "sectionAnalysis": [
    {
      "sectionName": "string",
      "score": <number 0-10>,
      "issues": ["string array of issues"],
      "suggestions": ["string array of improvement suggestions"]
    }
  ],
  "benchmarkResults": {
    "buzzwordPresence": { "passed": boolean, "score": <0-10> },
    "roleClarity": { "passed": boolean, "score": <0-10> },
    "quantifiedAchievements": { "passed": boolean, "score": <0-10> },
    "actionVerbUsage": { "passed": boolean, "score": <0-10> },
    "industryKeywords": { "passed": boolean, "score": <0-10> },
    "contactInfoComplete": { "passed": boolean, "score": <0-10> },
    "professionalSummary": { "passed": boolean, "score": <0-10> },
    "chronologicalOrder": { "passed": boolean, "score": <0-10> },
    "consistentFormatting": { "passed": boolean, "score": <0-10> },
    "optimalLength": { "passed": boolean, "score": <0-10> },
    "noImages": { "passed": boolean, "score": <0-10> },
    "noTables": { "passed": boolean, "score": <0-10> },
    "standardFonts": { "passed": boolean, "score": <0-10> },
    "properHeadings": { "passed": boolean, "score": <0-10> },
    "keywordDensity": { "passed": boolean, "score": <0-10> },
    "relevantExperience": { "passed": boolean, "score": <0-10> },
    "skillsRelevance": { "passed": boolean, "score": <0-10> },
    "leadershipExamples": { "passed": boolean, "score": <0-10> },
    "teamworkHighlighted": { "passed": boolean, "score": <0-10> },
    "problemSolvingExamples": { "passed": boolean, "score": <0-10> },
    "educationRelevance": { "passed": boolean, "score": <0-10> },
    "certificationPresence": { "passed": boolean, "score": <0-10> },
    "continuousLearning": { "passed": boolean, "score": <0-10> },
    "grammarCheck": { "passed": boolean, "score": <0-10> },
    "spellingCheck": { "passed": boolean, "score": <0-10> },
    "readabilityScore": { "passed": boolean, "score": <0-10> },
    "uniquenessScore": { "passed": boolean, "score": <0-10> }
  },
  "aiSuggestions": [
    {
      "sectionName": "string",
      "originalText": "string",
      "improvedText": "string", 
      "explanation": "string"
    }
  ]
}

Ensure ALL scores are integers between 0-10. Never use negative numbers or scores above 10.
Focus on ATS compatibility, keyword optimization, and industry-specific requirements.
`;
  }

  private parseGeminiResponse(
    response: string,
    content: ExtractedContent
  ): GeminiAnalysisResult {
    try {
      // Extract JSON from response (Gemini sometimes adds extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      // Validate and set defaults if needed
      return {
        overallScore: parsedResponse.overallScore || 50,
        sectionAnalysis: parsedResponse.sectionAnalysis || [],
        benchmarkResults: parsedResponse.benchmarkResults || {},
        aiSuggestions: parsedResponse.aiSuggestions || [],
      };
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      // Return fallback analysis
      return this.generateFallbackAnalysis(content);
    }
  }

  private generateFallbackAnalysis(
    content: ExtractedContent
  ): GeminiAnalysisResult {
    return {
      overallScore: 60,
      sectionAnalysis: content.sections.map((section) => ({
        sectionName: section.sectionName,
        score: 6,
        issues: ["Analysis failed - manual review required"],
        suggestions: ["Please try uploading the resume again"],
      })),
      benchmarkResults: {},
      aiSuggestions: [],
    };
  }
}
