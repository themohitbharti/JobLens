import { ExtractedContent } from "../utils/pdfProcessor";
import { GeminiAnalysisResult } from "./geminiService";
import { DeterministicScoringService } from "./scoringService";

interface ResumeData {
  fileName: string;
  extractedContent: ExtractedContent;
  analysis: GeminiAnalysisResult;
  score: number;
}

interface ComparisonPreferences {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
  keywords: string[];
}

interface BenchmarkComparison {
  benchmark: string;
  resume1: {
    score: number;
    passed: boolean;
    status: 'better' | 'worse' | 'equal';
  };
  resume2: {
    score: number;
    passed: boolean;
    status: 'better' | 'worse' | 'equal';
  };
  difference: number;
  importance: 'high' | 'medium' | 'low';
}

interface SectionComparison {
  sectionName: string;
  resume1: {
    score: number;
    hasSection: boolean;
    status: 'better' | 'worse' | 'equal';
  };
  resume2: {
    score: number;
    hasSection: boolean;
    status: 'better' | 'worse' | 'equal';
  };
  difference: number;
  keyDifferences: string[];
}

export interface ComparisonResult {
  winner: {
    resume: 'resume1' | 'resume2' | 'tie';
    fileName: string;
    scoreDifference: number;
  };
  scores: {
    resume1: {
      fileName: string;
      overallScore: number;
      rank: number;
    };
    resume2: {
      fileName: string;
      overallScore: number;
      rank: number;
    };
  };
  keyDifferences: {
    resume1Advantages: string[];
    resume2Advantages: string[];
    commonWeaknesses: string[];
    improvementOpportunities: string[];
  };
  benchmarkComparison: BenchmarkComparison[];
  sectionComparison: SectionComparison[];
  recommendations: {
    forResume1: string[];
    forResume2: string[];
    generalAdvice: string[];
  };
  detailedInsights: {
    strongestAreas: {
      resume1: string[];
      resume2: string[];
    };
    weakestAreas: {
      resume1: string[];
      resume2: string[];
    };
    competitiveAdvantages: {
      resume1: string[];
      resume2: string[];
    };
  };
}

export class ResumeComparisonService {
  private scoringService: DeterministicScoringService;

  constructor() {
    this.scoringService = new DeterministicScoringService();
  }

  async compareResumes(
    resume1: ResumeData,
    resume2: ResumeData,
    preferences: ComparisonPreferences
  ): Promise<ComparisonResult> {
    
    // Determine winner
    const winner = this.determineWinner(resume1, resume2);
    
    // Compare benchmarks
    const benchmarkComparison = this.compareBenchmarks(resume1, resume2, preferences);
    
    // Compare sections
    const sectionComparison = this.compareSections(resume1, resume2, preferences);
    
    // Generate key differences
    const keyDifferences = this.generateKeyDifferences(
      resume1, 
      resume2, 
      benchmarkComparison, 
      sectionComparison
    );
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(
      resume1, 
      resume2, 
      benchmarkComparison, 
      sectionComparison
    );
    
    // Generate detailed insights
    const detailedInsights = this.generateDetailedInsights(
      resume1, 
      resume2, 
      benchmarkComparison, 
      sectionComparison
    );

    return {
      winner,
      scores: {
        resume1: {
          fileName: resume1.fileName,
          overallScore: resume1.score,
          rank: resume1.score >= resume2.score ? 1 : 2,
        },
        resume2: {
          fileName: resume2.fileName,
          overallScore: resume2.score,
          rank: resume2.score >= resume1.score ? 1 : 2,
        },
      },
      keyDifferences,
      benchmarkComparison,
      sectionComparison,
      recommendations,
      detailedInsights,
    };
  }

  private determineWinner(resume1: ResumeData, resume2: ResumeData) {
    const scoreDiff = Math.abs(resume1.score - resume2.score);
    
    if (scoreDiff < 2) { // Very close scores
      return {
        resume: 'tie' as const,
        fileName: 'Both resumes are equally strong',
        scoreDifference: scoreDiff,
      };
    }
    
    if (resume1.score > resume2.score) {
      return {
        resume: 'resume1' as const,
        fileName: resume1.fileName,
        scoreDifference: scoreDiff,
      };
    } else {
      return {
        resume: 'resume2' as const,
        fileName: resume2.fileName,
        scoreDifference: scoreDiff,
      };
    }
  }

  private compareBenchmarks(
    resume1: ResumeData,
    resume2: ResumeData,
    preferences: ComparisonPreferences
  ): BenchmarkComparison[] {
    const allBenchmarks = [
      "roleClarity", "quantifiedAchievements", "actionVerbUsage", "industryKeywords",
      "contactInfoComplete", "professionalSummary", "chronologicalOrder", "optimalLength",
      "noImages", "noTables", "standardFonts", "properHeadings", "keywordDensity",
      "relevantExperience", "skillsRelevance", "leadershipExamples", "teamworkHighlighted",
      "problemSolvingExamples", "educationRelevance", "certificationPresence"
    ];

    // Get benchmark importance based on preferences
    const importanceWeights = this.scoringService['getAdjustedWeights'](
      preferences.targetJobTitle,
      preferences.experienceLevel,
      preferences.targetIndustry
    );

    return allBenchmarks.map(benchmark => {
      const score1 = resume1.analysis.benchmarkResults[benchmark]?.score || 0;
      const score2 = resume2.analysis.benchmarkResults[benchmark]?.score || 0;
      const passed1 = resume1.analysis.benchmarkResults[benchmark]?.passed || false;
      const passed2 = resume2.analysis.benchmarkResults[benchmark]?.passed || false;
      
      const difference = score1 - score2;
      const weight = importanceWeights[benchmark] || 5;
      
      // Determine importance based on weight
      let importance: 'high' | 'medium' | 'low' = 'medium';
      if (weight >= 8) importance = 'high';
      else if (weight <= 4) importance = 'low';

      return {
        benchmark,
        resume1: {
          score: score1,
          passed: passed1,
          status: difference > 1 ? 'better' : difference < -1 ? 'worse' : 'equal',
        },
        resume2: {
          score: score2,
          passed: passed2,
          status: difference < -1 ? 'better' : difference > 1 ? 'worse' : 'equal',
        },
        difference: Math.abs(difference),
        importance,
      } as BenchmarkComparison;
    });
  }

  private compareSections(
    resume1: ResumeData,
    resume2: ResumeData,
    preferences: ComparisonPreferences
  ): SectionComparison[] {
    const allSections = [
      "Contact Information", "Professional Summary", "Work Experience", 
      "Skills", "Education", "Projects", "Certifications", "Achievements"
    ];

    return allSections.map(sectionName => {
      const score1 = this.scoringService.calculateSectionScore(
        sectionName,
        resume1.analysis.benchmarkResults,
        preferences.targetJobTitle,
        preferences.experienceLevel
      );
      
      const score2 = this.scoringService.calculateSectionScore(
        sectionName,
        resume2.analysis.benchmarkResults,
        preferences.targetJobTitle,
        preferences.experienceLevel
      );

      const hasSection1 = resume1.extractedContent.sections.some(s => s.sectionName === sectionName);
      const hasSection2 = resume2.extractedContent.sections.some(s => s.sectionName === sectionName);
      
      const difference = score1 - score2;
      
      // Generate key differences for this section
      const keyDifferences = this.generateSectionDifferences(
        sectionName, resume1, resume2, hasSection1, hasSection2
      );

      return {
        sectionName,
        resume1: {
          score: score1,
          hasSection: hasSection1,
          status: difference > 0.5 ? 'better' : difference < -0.5 ? 'worse' : 'equal',
        },
        resume2: {
          score: score2,
          hasSection: hasSection2,
          status: difference < -0.5 ? 'better' : difference > 0.5 ? 'worse' : 'equal',
        },
        difference: Math.abs(difference),
        keyDifferences,
      } as SectionComparison;
    });
  }

  private generateSectionDifferences(
    sectionName: string,
    resume1: ResumeData,
    resume2: ResumeData,
    hasSection1: boolean,
    hasSection2: boolean
  ): string[] {
    const differences: string[] = [];

    if (hasSection1 && !hasSection2) {
      differences.push(`Resume 1 includes ${sectionName} section, Resume 2 missing`);
    } else if (!hasSection1 && hasSection2) {
      differences.push(`Resume 2 includes ${sectionName} section, Resume 1 missing`);
    }

    // Add section-specific insights based on analysis
    const analysis1 = resume1.analysis.sectionAnalysis.find(s => s.sectionName === sectionName);
    const analysis2 = resume2.analysis.sectionAnalysis.find(s => s.sectionName === sectionName);

    if (analysis1 && analysis2) {
      // Compare issues length
      if (analysis1.issues.length < analysis2.issues.length) {
        differences.push(`Resume 1 has fewer issues in ${sectionName}`);
      } else if (analysis1.issues.length > analysis2.issues.length) {
        differences.push(`Resume 2 has fewer issues in ${sectionName}`);
      }
    }

    return differences;
  }

  private generateKeyDifferences(
    resume1: ResumeData,
    resume2: ResumeData,
    benchmarkComparison: BenchmarkComparison[],
    sectionComparison: SectionComparison[]
  ) {
    const resume1Advantages: string[] = [];
    const resume2Advantages: string[] = [];
    const commonWeaknesses: string[] = [];
    const improvementOpportunities: string[] = [];

    // Find significant benchmark differences
    benchmarkComparison.forEach(comp => {
      if (comp.difference >= 2 && comp.importance === 'high') {
        if (comp.resume1.status === 'better') {
          resume1Advantages.push(`Stronger ${comp.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        } else if (comp.resume2.status === 'better') {
          resume2Advantages.push(`Stronger ${comp.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        }
      }

      // Find common weaknesses
      if (!comp.resume1.passed && !comp.resume2.passed && comp.importance === 'high') {
        commonWeaknesses.push(`Both resumes need improvement in ${comp.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      }
    });

    // Find section advantages
    sectionComparison.forEach(comp => {
      if (comp.difference >= 1) {
        if (comp.resume1.status === 'better') {
          resume1Advantages.push(`Better ${comp.sectionName} section`);
        } else if (comp.resume2.status === 'better') {
          resume2Advantages.push(`Better ${comp.sectionName} section`);
        }
      }
    });

    // Generate improvement opportunities
    if (resume1.score < 80) {
      improvementOpportunities.push(`Resume 1 could benefit from overall content enhancement`);
    }
    if (resume2.score < 80) {
      improvementOpportunities.push(`Resume 2 could benefit from overall content enhancement`);
    }

    return {
      resume1Advantages: resume1Advantages.slice(0, 5), // Limit to top 5
      resume2Advantages: resume2Advantages.slice(0, 5),
      commonWeaknesses: commonWeaknesses.slice(0, 3),
      improvementOpportunities: improvementOpportunities.slice(0, 3),
    };
  }

  private generateRecommendations(
    resume1: ResumeData,
    resume2: ResumeData,
    benchmarkComparison: BenchmarkComparison[],
    sectionComparison: SectionComparison[]
  ) {
    const forResume1: string[] = [];
    const forResume2: string[] = [];
    const generalAdvice: string[] = [];

    // Generate specific recommendations based on benchmark gaps
    benchmarkComparison.forEach(comp => {
      if (comp.difference >= 2) {
        if (comp.resume1.status === 'worse') {
          forResume1.push(`Improve ${comp.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        }
        if (comp.resume2.status === 'worse') {
          forResume2.push(`Improve ${comp.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        }
      }
    });

    // Add section-specific recommendations
    sectionComparison.forEach(comp => {
      if (!comp.resume1.hasSection) {
        forResume1.push(`Add ${comp.sectionName} section`);
      }
      if (!comp.resume2.hasSection) {
        forResume2.push(`Add ${comp.sectionName} section`);
      }
    });

    // General advice
    generalAdvice.push("Focus on quantified achievements to demonstrate impact");
    generalAdvice.push("Ensure ATS compliance with proper formatting");
    generalAdvice.push("Tailor content to target role and industry");

    return {
      forResume1: forResume1.slice(0, 5),
      forResume2: forResume2.slice(0, 5),
      generalAdvice,
    };
  }

  private generateDetailedInsights(
    resume1: ResumeData,
    resume2: ResumeData,
    benchmarkComparison: BenchmarkComparison[],
    sectionComparison: SectionComparison[]
  ) {
    // Find strongest areas (high scores)
    const strongestAreas = {
      resume1: benchmarkComparison
        .filter(c => c.resume1.score >= 8)
        .map(c => c.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase())
        .slice(0, 3),
      resume2: benchmarkComparison
        .filter(c => c.resume2.score >= 8)
        .map(c => c.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase())
        .slice(0, 3),
    };

    // Find weakest areas (low scores)
    const weakestAreas = {
      resume1: benchmarkComparison
        .filter(c => c.resume1.score <= 4)
        .map(c => c.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase())
        .slice(0, 3),
      resume2: benchmarkComparison
        .filter(c => c.resume2.score <= 4)
        .map(c => c.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase())
        .slice(0, 3),
    };

    // Find competitive advantages (significantly better than the other)
    const competitiveAdvantages = {
      resume1: benchmarkComparison
        .filter(c => c.resume1.status === 'better' && c.difference >= 3)
        .map(c => c.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase())
        .slice(0, 3),
      resume2: benchmarkComparison
        .filter(c => c.resume2.status === 'better' && c.difference >= 3)
        .map(c => c.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase())
        .slice(0, 3),
    };

    return {
      strongestAreas,
      weakestAreas,
      competitiveAdvantages,
    };
  }
}