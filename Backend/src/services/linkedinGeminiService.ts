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
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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

**ANALYZE AGAINST THESE 20 ENHANCED LINKEDIN BENCHMARKS:**

**Contact Information Quality:**
1. contactInfoComplete - Email, LinkedIn URL, and location present
2. linkedinUrlPresent - Custom or standard LinkedIn URL included
3. portfolioLinked - Portfolio/website link included

**Professional Summary Quality:**
4. professionalSummaryCompelling - Engaging summary with value proposition
5. industryKeywords - Strategic use of industry-relevant keywords
6. careerGoalsClear - Clear career direction and goals stated
7. personalBrandingStrong - Strong personal brand messaging

**Experience Quality (Enhanced):**
8. experienceDetailed - Detailed work experience descriptions
9. experienceQuantified - Measurable achievements and metrics (numbers, percentages, results)
10. roleProgressionClear - Clear career progression shown
11. jobTitlesOptimized - Job titles include relevant hard skills and are not vague
12. noEmploymentGaps - No unexplained gaps or unemployment indicators
13. roleDescriptionsPresent - Each role has comprehensive description, not just title

**Education & Skills:**
14. educationComplete - Complete education information
15. skillsRelevant - Industry-relevant skills listed and organized
16. technicalSkillsListed - Technical competencies highlighted
17. languagesProficiency - Language skills documented

**Additional Value:**
18. certificationsPresent - Professional certifications included
19. publicationsPresent - Publications or thought leadership content
20. volunteering - Volunteer experience or community involvement
21. achievementsHighlighted - Notable achievements and recognitions

**IMPORTANT: For experience section, specifically look for:**
- Job titles with technical/hard skills (not vague like "Coordinator" or "Assistant")
- Detailed role descriptions (not just company name and title)
- Quantified achievements with numbers, percentages, dollar amounts
- No gaps between positions or explanations for gaps
- Clear progression in responsibility and skills

**Provide JSON response:**
{
  "benchmarkResults": {
    "contactInfoComplete": { 
      "passed": boolean,
      "evidence": "what contact info is present",
      "scoreRationale": "scoring explanation",
      "matchPercentage": number
    },
    "jobTitlesOptimized": { 
      "passed": boolean, 
      "evidence": "analysis of job title quality and technical skills inclusion",
      "scoreRationale": "why job titles are strong/weak",
      "matchPercentage": number
    },
    "noEmploymentGaps": { 
      "passed": boolean, 
      "evidence": "employment continuity analysis",
      "scoreRationale": "gap assessment",
      "matchPercentage": number
    },
    "roleDescriptionsPresent": { 
      "passed": boolean, 
      "evidence": "quality of role descriptions",
      "scoreRationale": "description completeness",
      "matchPercentage": number
    },
    ... (all 20 benchmarks)
  },
  "sectionAnalysis": [
    {
      "sectionName": "Contact Information",
      "score": number,
      "issues": ["specific issues found"],
      "suggestions": ["specific improvement suggestions"]
    },
    {
      "sectionName": "Professional Summary",
      "score": number,
      "issues": ["specific issues found"],
      "suggestions": ["specific improvement suggestions"]
    },
    {
      "sectionName": "Experience",
      "score": number,
      "issues": ["job title issues", "description gaps", "missing quantification", "employment gaps"],
      "suggestions": ["optimize job titles with hard skills", "add detailed descriptions", "quantify achievements", "explain any gaps"]
    },
    {
      "sectionName": "Education",
      "score": number,
      "issues": ["specific issues found"],
      "suggestions": ["specific improvement suggestions"]
    },
    {
      "sectionName": "Skills & Languages",
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

**Focus on LinkedIn-specific optimization factors based on actual PDF content:**
- Job title optimization with hard skills
- Employment continuity and professional progression
- Quantified impact and achievements
- Complete role descriptions
- Contact information completeness and professionalism

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
    // Ensure all required LinkedIn benchmarks exist (20 enhanced ones)
    const requiredBenchmarks = [
      "contactInfoComplete", "linkedinUrlPresent", "portfolioLinked",
      "professionalSummaryCompelling", "industryKeywords", "careerGoalsClear", "personalBrandingStrong",
      "experienceDetailed", "experienceQuantified", "roleProgressionClear", 
      "jobTitlesOptimized", "noEmploymentGaps", "roleDescriptionsPresent",
      "educationComplete", "skillsRelevant", "technicalSkillsListed", "languagesProficiency",
      "certificationsPresent", "publicationsPresent", "volunteering", "achievementsHighlighted"
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
      "Contact Information",
      "Professional Summary", 
      "Experience",
      "Education",
      "Skills & Languages",
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
    
    // Create fallback for enhanced benchmarks
    const requiredBenchmarks = [
      "contactInfoComplete", "linkedinUrlPresent", "portfolioLinked",
      "professionalSummaryCompelling", "industryKeywords", "careerGoalsClear", "personalBrandingStrong",
      "experienceDetailed", "experienceQuantified", "roleProgressionClear", 
      "jobTitlesOptimized", "noEmploymentGaps", "roleDescriptionsPresent",
      "educationComplete", "skillsRelevant", "technicalSkillsListed", "languagesProficiency",
      "certificationsPresent", "publicationsPresent", "volunteering", "achievementsHighlighted"
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