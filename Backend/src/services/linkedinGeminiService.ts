import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExtractedContent } from "../utils/pdfProcessor";

export interface LinkedinAnalysisResult {
  benchmarkResults: {
    [benchmarkName: string]: {
      passed: boolean;
      evidence: string;
      scoreRationale: string;
      matchPercentage: number;
    };
  };
  sectionAnalysis: {
    sectionName: string;
    score: number;
    issues: string[];
    suggestions: string[];
  }[];
  aiSuggestions: {
    sectionName: string;
    originalText: string;
    improvedText: string;
    explanation: string;
    improvementType: "content" | "structure" | "keywords" | "formatting";
  }[];
  overallFeedback: {
    strengths: string[];
    weaknesses: string[];
    priorityImprovements: string[];
  };
}

export class LinkedinGeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required");
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async analyzeLinkedinProfile(
    content: ExtractedContent,
    preferences: any
  ): Promise<LinkedinAnalysisResult> {
    try {
      const prompt = this.buildLinkedinAnalysisPrompt(content, preferences);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const cleanedText = this.cleanJsonResponse(text);
      const analysisData = JSON.parse(cleanedText);

      // Validate and structure the response
      return this.validateAndStructureResponse(analysisData, content);
    } catch (error) {
      console.error("LinkedIn Gemini analysis error:", error);
      return this.createFallbackResponse(content);
    }
  }

  private buildLinkedinAnalysisPrompt(
    content: ExtractedContent,
    preferences: any
  ): string {
    return `
You are an expert LinkedIn profile analyzer and career coach. Analyze this LinkedIn profile PDF content against professional LinkedIn optimization standards.

**TARGET ROLE:** ${preferences.targetJobTitle || "General Position"}
**INDUSTRY:** ${preferences.targetIndustry || "General"}
**EXPERIENCE LEVEL:** ${preferences.experienceLevel || "mid"}

**LINKEDIN PROFILE CONTENT:**
${content.fullText}

**SECTIONS FOUND:**
${content.sections.map(s => `- ${s.sectionName}: ${s.content.substring(0, 200)}...`).join('\n')}

**ANALYZE AGAINST THESE 20 LINKEDIN BENCHMARKS:**

**Profile Completeness:**
1. profilePhotoPresent - Professional photo visible
2. headlineOptimized - Compelling, keyword-rich headline
3. summaryCompelling - Engaging about section with value proposition
4. contactInfoComplete - Complete contact information

**Content Quality:**
5. experienceDetailed - Detailed work experience with achievements
6. quantifiedAchievements - Measurable results and metrics
7. skillsRelevant - Industry-relevant skills listed
8. industryKeywords - Strategic use of industry keywords

**Network & Engagement:**
9. connectionCount - Adequate professional connections (mentioned/visible)
10. recommendationsPresent - Professional recommendations received
11. endorsementsReceived - Skills endorsed by network
12. activityConsistent - Evidence of regular LinkedIn activity

**Professional Branding:**
13. customURL - Custom LinkedIn URL
14. backgroundImage - Professional background banner
15. featuredSection - Showcased work/content in featured section
16. volunteering - Volunteer experience highlighted

**Education & Development:**
17. educationComplete - Complete education information
18. certificationsPresent - Relevant professional certifications
19. coursesRelevant - Continuous learning courses
20. languagesProficiency - Language skills listed

**IMPORTANT: For each benchmark, analyze the content and provide:**
1. Whether it passes (boolean)
2. A detailed scoring explanation (0-10 scale)
3. Specific evidence from the profile

**Provide JSON response:**
{
  "benchmarkResults": {
    "profilePhotoPresent": { 
      "passed": boolean,
      "evidence": "evidence of professional photo or mention",
      "scoreRationale": "scoring explanation",
      "matchPercentage": number
    },
    "headlineOptimized": { 
      "passed": boolean, 
      "evidence": "specific headline content found",
      "scoreRationale": "why this deserves X/10 score",
      "matchPercentage": number
    },
    ... (all 20 benchmarks)
  },
  "sectionAnalysis": [
    {
      "sectionName": "Profile Header",
      "score": number,
      "issues": ["specific issues found"],
      "suggestions": ["specific improvement suggestions"]
    },
    {
      "sectionName": "About Section",
      "score": number,
      "issues": ["specific issues found"],
      "suggestions": ["specific improvement suggestions"]
    },
    {
      "sectionName": "Experience",
      "score": number,
      "issues": ["specific issues found"],
      "suggestions": ["specific improvement suggestions"]
    },
    {
      "sectionName": "Education",
      "score": number,
      "issues": ["specific issues found"],
      "suggestions": ["specific improvement suggestions"]
    },
    {
      "sectionName": "Skills",
      "score": number,
      "issues": ["specific issues found"],
      "suggestions": ["specific improvement suggestions"]
    },
    {
      "sectionName": "Network & Engagement",
      "score": number,
      "issues": ["specific issues found"],
      "suggestions": ["specific improvement suggestions"]
    },
    {
      "sectionName": "Additional Sections",
      "score": number,
      "issues": ["specific issues found"],
      "suggestions": ["specific improvement suggestions"]
    }
  ],
  "aiSuggestions": [
    {
      "sectionName": "string",
      "originalText": "current content excerpt",
      "improvedText": "enhanced version",
      "explanation": "why this improvement helps",
      "improvementType": "content|structure|keywords|formatting"
    }
  ],
  "overallFeedback": {
    "strengths": ["top profile strengths"],
    "weaknesses": ["areas needing improvement"],
    "priorityImprovements": ["most important changes to make"]
  }
}

**Focus on LinkedIn-specific optimization factors:**
- Profile completeness and professional presentation
- Content quality and achievement quantification
- Network engagement and social proof
- Industry keyword optimization
- Professional branding elements
- Continuous learning demonstration

Provide specific, actionable feedback for ${preferences.targetJobTitle} in ${preferences.targetIndustry}.
`;
  }

  private cleanJsonResponse(text: string): string {
    // Remove markdown code blocks
    let cleaned = text.replace(/```json\s*|\s*```/g, '');
    
    // Remove any text before the first {
    const firstBrace = cleaned.indexOf('{');
    if (firstBrace > 0) {
      cleaned = cleaned.substring(firstBrace);
    }
    
    // Remove any text after the last }
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace < cleaned.length - 1) {
      cleaned = cleaned.substring(0, lastBrace + 1);
    }
    
    return cleaned.trim();
  }

  private validateAndStructureResponse(
    analysisData: any,
    content: ExtractedContent
  ): LinkedinAnalysisResult {
    // Ensure all required LinkedIn benchmarks exist
    const requiredBenchmarks = [
      "profilePhotoPresent", "headlineOptimized", "summaryCompelling", "contactInfoComplete",
      "experienceDetailed", "quantifiedAchievements", "skillsRelevant", "industryKeywords",
      "connectionCount", "recommendationsPresent", "endorsementsReceived", "activityConsistent",
      "customURL", "backgroundImage", "featuredSection", "volunteering",
      "educationComplete", "certificationsPresent", "coursesRelevant", "languagesProficiency"
    ];

    const benchmarkResults: any = {};
    
    requiredBenchmarks.forEach(benchmark => {
      if (analysisData.benchmarkResults?.[benchmark]) {
        benchmarkResults[benchmark] = {
          passed: Boolean(analysisData.benchmarkResults[benchmark].passed),
          evidence: String(analysisData.benchmarkResults[benchmark].evidence || "No evidence provided"),
          scoreRationale: String(analysisData.benchmarkResults[benchmark].scoreRationale || "No rationale provided"),
          matchPercentage: Number(analysisData.benchmarkResults[benchmark].matchPercentage || 0)
        };
      } else {
        benchmarkResults[benchmark] = {
          passed: false,
          evidence: "Benchmark not analyzed",
          scoreRationale: "No analysis performed",
          matchPercentage: 0
        };
      }
    });

    // Ensure all LinkedIn sections are analyzed
    const sectionAnalysis = this.ensureAllLinkedinSections(
      analysisData.sectionAnalysis || []
    );

    return {
      benchmarkResults,
      sectionAnalysis,
      aiSuggestions: analysisData.aiSuggestions || [],
      overallFeedback: {
        strengths: analysisData.overallFeedback?.strengths || ["Professional experience documented"],
        weaknesses: analysisData.overallFeedback?.weaknesses || ["Profile needs optimization"],
        priorityImprovements: analysisData.overallFeedback?.priorityImprovements || ["Enhance profile completeness"]
      }
    };
  }

  private ensureAllLinkedinSections(sectionAnalysis: any[]): any[] {
    const requiredSections = [
      "Profile Header",
      "About Section", 
      "Experience",
      "Education",
      "Skills",
      "Network & Engagement",
      "Additional Sections"
    ];

    const analysisMap = new Map(sectionAnalysis.map((s) => [s.sectionName, s]));

    return requiredSections.map((sectionName) => {
      if (analysisMap.has(sectionName)) {
        return analysisMap.get(sectionName);
      } else {
        return {
          sectionName,
          score: 0,
          issues: ["Section needs attention or is missing"],
          suggestions: ["Optimize this section to improve your LinkedIn profile"],
        };
      }
    });
  }

  private createFallbackResponse(content: ExtractedContent): LinkedinAnalysisResult {
    const fallbackBenchmarks: any = {};
    
    // Create fallback for all benchmarks
    const requiredBenchmarks = [
      "profilePhotoPresent", "headlineOptimized", "summaryCompelling", "contactInfoComplete",
      "experienceDetailed", "quantifiedAchievements", "skillsRelevant", "industryKeywords",
      "connectionCount", "recommendationsPresent", "endorsementsReceived", "activityConsistent",
      "customURL", "backgroundImage", "featuredSection", "volunteering",
      "educationComplete", "certificationsPresent", "coursesRelevant", "languagesProficiency"
    ];

    requiredBenchmarks.forEach(benchmark => {
      fallbackBenchmarks[benchmark] = {
        passed: false,
        evidence: "Analysis unavailable - using fallback",
        scoreRationale: "Could not perform detailed analysis",
        matchPercentage: 30
      };
    });

    return {
      benchmarkResults: fallbackBenchmarks,
      sectionAnalysis: this.ensureAllLinkedinSections([]),
      aiSuggestions: [],
      overallFeedback: {
        strengths: ["Profile content uploaded successfully"],
        weaknesses: ["Detailed analysis unavailable"],
        priorityImprovements: ["Try uploading again for detailed analysis"]
      }
    };
  }
}