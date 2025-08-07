import { ExtractedContent } from "../utils/pdfProcessor";
import { LinkedinAnalysisResult } from "./linkedinGeminiService";
import { LinkedinScoringService } from "./linkedinScoringService";

interface LinkedinData {
  fileName: string;
  extractedContent: ExtractedContent;
  analysis: LinkedinAnalysisResult;
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
  profile1: {
    score: number;
    passed: boolean;
    status: 'better' | 'worse' | 'equal';
  };
  profile2: {
    score: number;
    passed: boolean;
    status: 'better' | 'worse' | 'equal';
  };
  difference: number;
  importance: 'high' | 'medium' | 'low';
}

interface SectionComparison {
  sectionName: string;
  profile1: {
    score: number;
    hasSection: boolean;
    status: 'better' | 'worse' | 'equal';
  };
  profile2: {
    score: number;
    hasSection: boolean;
    status: 'better' | 'worse' | 'equal';
  };
  difference: number;
  keyDifferences: string[];
}

export interface LinkedinComparisonResult {
  winner: {
    profile: 'profile1' | 'profile2' | 'tie';
    fileName: string;
    scoreDifference: number;
  };
  scores: {
    profile1: {
      fileName: string;
      overallScore: number;
      rank: number;
    };
    profile2: {
      fileName: string;
      overallScore: number;
      rank: number;
    };
  };
  keyDifferences: {
    profile1Advantages: string[];
    profile2Advantages: string[];
    commonWeaknesses: string[];
    improvementOpportunities: string[];
  };
  benchmarkComparison: BenchmarkComparison[];
  sectionComparison: SectionComparison[];
  recommendations: {
    forProfile1: string[];
    forProfile2: string[];
    generalAdvice: string[];
  };
  detailedInsights: {
    strongestAreas: {
      profile1: string[];
      profile2: string[];
    };
    weakestAreas: {
      profile1: string[];
      profile2: string[];
    };
    competitiveAdvantages: {
      profile1: string[];
      profile2: string[];
    };
  };
}

export class LinkedinComparisonService {
  private scoringService: LinkedinScoringService;

  constructor() {
    this.scoringService = new LinkedinScoringService();
  }

  async compareLinkedinProfiles(
    profile1: LinkedinData,
    profile2: LinkedinData,
    preferences: ComparisonPreferences
  ): Promise<LinkedinComparisonResult> {
    
    // Determine winner
    const winner = this.determineWinner(profile1, profile2);
    
    // Compare benchmarks
    const benchmarkComparison = this.compareBenchmarks(profile1, profile2, preferences);
    
    // Compare sections
    const sectionComparison = this.compareSections(profile1, profile2, preferences);
    
    // Generate key differences
    const keyDifferences = this.generateKeyDifferences(
      profile1, 
      profile2, 
      benchmarkComparison, 
      sectionComparison
    );
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(
      profile1, 
      profile2, 
      benchmarkComparison, 
      sectionComparison
    );
    
    // Generate detailed insights
    const detailedInsights = this.generateDetailedInsights(
      profile1, 
      profile2, 
      benchmarkComparison, 
      sectionComparison
    );

    return {
      winner,
      scores: {
        profile1: {
          fileName: profile1.fileName,
          overallScore: profile1.score,
          rank: profile1.score >= profile2.score ? 1 : 2,
        },
        profile2: {
          fileName: profile2.fileName,
          overallScore: profile2.score,
          rank: profile2.score >= profile1.score ? 1 : 2,
        },
      },
      keyDifferences,
      benchmarkComparison,
      sectionComparison,
      recommendations,
      detailedInsights,
    };
  }

  private determineWinner(profile1: LinkedinData, profile2: LinkedinData) {
    const scoreDiff = Math.abs(profile1.score - profile2.score);
    
    if (scoreDiff < 2) { // Very close scores
      return {
        profile: 'tie' as const,
        fileName: 'Both LinkedIn profiles are equally strong',
        scoreDifference: scoreDiff,
      };
    }
    
    if (profile1.score > profile2.score) {
      return {
        profile: 'profile1' as const,
        fileName: profile1.fileName,
        scoreDifference: scoreDiff,
      };
    } else {
      return {
        profile: 'profile2' as const,
        fileName: profile2.fileName,
        scoreDifference: scoreDiff,
      };
    }
  }

  private compareBenchmarks(
    profile1: LinkedinData,
    profile2: LinkedinData,
    preferences: ComparisonPreferences
  ): BenchmarkComparison[] {
    // LinkedIn-specific benchmarks
    const allBenchmarks = [
      "contactInfoComplete", "linkedinUrlPresent", "portfolioLinked",
      "professionalSummaryCompelling", "industryKeywords", "careerGoalsClear", "personalBrandingStrong",
      "experienceDetailed", "experienceQuantified", "roleProgressionClear", 
      "jobTitlesOptimized", "noEmploymentGaps", "roleDescriptionsPresent",
      "educationComplete", "skillsRelevant", "technicalSkillsListed", "languagesProficiency",
      "certificationsPresent", "publicationsPresent", "volunteering", "achievementsHighlighted"
    ];

    // Get benchmark importance based on preferences
    const importanceWeights = this.getLinkedinBenchmarkWeights(
      preferences.targetJobTitle,
      preferences.experienceLevel,
      preferences.targetIndustry
    );

    return allBenchmarks.map(benchmark => {
      const score1 = profile1.analysis.benchmarkResults[benchmark]?.matchPercentage || 0;
      const score2 = profile2.analysis.benchmarkResults[benchmark]?.matchPercentage || 0;
      const passed1 = profile1.analysis.benchmarkResults[benchmark]?.passed || false;
      const passed2 = profile2.analysis.benchmarkResults[benchmark]?.passed || false;
      
      const difference = score1 - score2;
      const weight = importanceWeights[benchmark] || 5;
      
      // Determine importance based on weight
      let importance: 'high' | 'medium' | 'low' = 'medium';
      if (weight >= 8) importance = 'high';
      else if (weight <= 4) importance = 'low';

      return {
        benchmark,
        profile1: {
          score: score1,
          passed: passed1,
          status: difference > 1 ? 'better' : difference < -1 ? 'worse' : 'equal',
        },
        profile2: {
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
    profile1: LinkedinData,
    profile2: LinkedinData,
    preferences: ComparisonPreferences
  ): SectionComparison[] {
    const allSections = [
      "Contact Information", "Professional Summary", "Experience", 
      "Education", "Skills & Languages", "Additional Sections"
    ];

    return allSections.map(sectionName => {
      const score1 = this.scoringService.calculateSectionScoreFromGemini(
        sectionName,
        profile1.analysis.benchmarkResults,
        preferences.targetJobTitle,
        preferences.experienceLevel
      );
      
      const score2 = this.scoringService.calculateSectionScoreFromGemini(
        sectionName,
        profile2.analysis.benchmarkResults,
        preferences.targetJobTitle,
        preferences.experienceLevel
      );

      const hasSection1 = profile1.extractedContent.sections.some(s => s.sectionName === sectionName);
      const hasSection2 = profile2.extractedContent.sections.some(s => s.sectionName === sectionName);
      
      const difference = score1 - score2;

      // Generate key differences for this section
      const keyDifferences = this.generateSectionDifferences(
        sectionName, profile1, profile2, hasSection1, hasSection2
      );

      return {
        sectionName,
        profile1: {
          score: score1,
          hasSection: hasSection1,
          status: difference > 0.5 ? 'better' : difference < -0.5 ? 'worse' : 'equal',
        },
        profile2: {
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
    profile1: LinkedinData,
    profile2: LinkedinData,
    hasSection1: boolean,
    hasSection2: boolean
  ): string[] {
    const differences: string[] = [];

    if (hasSection1 && !hasSection2) {
      differences.push(`Profile 1 includes ${sectionName} section, Profile 2 missing`);
    } else if (!hasSection1 && hasSection2) {
      differences.push(`Profile 2 includes ${sectionName} section, Profile 1 missing`);
    }

    // Add section-specific insights based on analysis
    const analysis1 = profile1.analysis.sectionAnalysis.find(s => s.sectionName === sectionName);
    const analysis2 = profile2.analysis.sectionAnalysis.find(s => s.sectionName === sectionName);

    if (analysis1 && analysis2) {
      // Compare issues length
      if (analysis1.issues.length < analysis2.issues.length) {
        differences.push(`Profile 1 has fewer issues in ${sectionName}`);
      } else if (analysis1.issues.length > analysis2.issues.length) {
        differences.push(`Profile 2 has fewer issues in ${sectionName}`);
      }
    }

    return differences;
  }

  private generateKeyDifferences(
    profile1: LinkedinData,
    profile2: LinkedinData,
    benchmarkComparison: BenchmarkComparison[],
    sectionComparison: SectionComparison[]
  ) {
    const profile1Advantages: string[] = [];
    const profile2Advantages: string[] = [];
    const commonWeaknesses: string[] = [];
    const improvementOpportunities: string[] = [];

    // Find significant benchmark differences
    benchmarkComparison.forEach(comp => {
      if (comp.difference >= 2 && comp.importance === 'high') {
        if (comp.profile1.status === 'better') {
          profile1Advantages.push(`Stronger ${comp.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        } else if (comp.profile2.status === 'better') {
          profile2Advantages.push(`Stronger ${comp.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        }
      }

      // Find common weaknesses
      if (!comp.profile1.passed && !comp.profile2.passed && comp.importance === 'high') {
        commonWeaknesses.push(`Both profiles need improvement in ${comp.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      }
    });

    // Find section advantages
    sectionComparison.forEach(comp => {
      if (comp.difference >= 1) {
        if (comp.profile1.status === 'better') {
          profile1Advantages.push(`Better ${comp.sectionName} section`);
        } else if (comp.profile2.status === 'better') {
          profile2Advantages.push(`Better ${comp.sectionName} section`);
        }
      }
    });

    // Generate improvement opportunities
    if (profile1.score < 80) {
      improvementOpportunities.push(`Profile 1 could benefit from overall LinkedIn optimization`);
    }
    if (profile2.score < 80) {
      improvementOpportunities.push(`Profile 2 could benefit from overall LinkedIn optimization`);
    }

    return {
      profile1Advantages: profile1Advantages.slice(0, 5), // Limit to top 5
      profile2Advantages: profile2Advantages.slice(0, 5),
      commonWeaknesses: commonWeaknesses.slice(0, 3),
      improvementOpportunities: improvementOpportunities.slice(0, 3),
    };
  }

  private generateRecommendations(
    profile1: LinkedinData,
    profile2: LinkedinData,
    benchmarkComparison: BenchmarkComparison[],
    sectionComparison: SectionComparison[]
  ) {
    const forProfile1: string[] = [];
    const forProfile2: string[] = [];
    const generalAdvice: string[] = [];

    // Generate specific recommendations based on benchmark gaps
    benchmarkComparison.forEach(comp => {
      if (comp.difference >= 2) {
        if (comp.profile1.status === 'worse') {
          forProfile1.push(`Improve ${comp.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        }
        if (comp.profile2.status === 'worse') {
          forProfile2.push(`Improve ${comp.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        }
      }
    });

    // Add section-specific recommendations
    sectionComparison.forEach(comp => {
      if (!comp.profile1.hasSection) {
        forProfile1.push(`Add ${comp.sectionName} section`);
      }
      if (!comp.profile2.hasSection) {
        forProfile2.push(`Add ${comp.sectionName} section`);
      }
    });

    // General LinkedIn advice
    generalAdvice.push("Focus on quantified achievements to demonstrate impact");
    generalAdvice.push("Ensure professional consistency across all sections");
    generalAdvice.push("Optimize for LinkedIn search with relevant keywords");
    generalAdvice.push("Maintain active engagement and professional networking");

    return {
      forProfile1: forProfile1.slice(0, 5),
      forProfile2: forProfile2.slice(0, 5),
      generalAdvice,
    };
  }

  private generateDetailedInsights(
    profile1: LinkedinData,
    profile2: LinkedinData,
    benchmarkComparison: BenchmarkComparison[],
    sectionComparison: SectionComparison[]
  ) {
    // Find strongest areas (high scores)
    const strongestAreas = {
      profile1: benchmarkComparison
        .filter(c => c.profile1.score >= 80)
        .map(c => c.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase())
        .slice(0, 3),
      profile2: benchmarkComparison
        .filter(c => c.profile2.score >= 80)
        .map(c => c.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase())
        .slice(0, 3),
    };

    // Find weakest areas (low scores)
    const weakestAreas = {
      profile1: benchmarkComparison
        .filter(c => c.profile1.score <= 40)
        .map(c => c.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase())
        .slice(0, 3),
      profile2: benchmarkComparison
        .filter(c => c.profile2.score <= 40)
        .map(c => c.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase())
        .slice(0, 3),
    };

    // Find competitive advantages (significantly better than the other)
    const competitiveAdvantages = {
      profile1: benchmarkComparison
        .filter(c => c.profile1.status === 'better' && c.difference >= 3)
        .map(c => c.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase())
        .slice(0, 3),
      profile2: benchmarkComparison
        .filter(c => c.profile2.status === 'better' && c.difference >= 3)
        .map(c => c.benchmark.replace(/([A-Z])/g, ' $1').toLowerCase())
        .slice(0, 3),
    };

    return {
      strongestAreas,
      weakestAreas,
      competitiveAdvantages,
    };
  }

  private getLinkedinBenchmarkWeights(
    targetJobTitle: string,
    experienceLevel: string,
    targetIndustry: string
  ): { [benchmark: string]: number } {
    // LinkedIn-specific benchmark weights based on role and industry
    const baseWeights: { [key: string]: number } = {
      contactInfoComplete: 6,
      linkedinUrlPresent: 5,
      portfolioLinked: 4,
      professionalSummaryCompelling: 9,
      industryKeywords: 8,
      careerGoalsClear: 7,
      personalBrandingStrong: 8,
      experienceDetailed: 9,
      experienceQuantified: 10,
      roleProgressionClear: 8,
      jobTitlesOptimized: 7,
      noEmploymentGaps: 6,
      roleDescriptionsPresent: 8,
      educationComplete: 5,
      skillsRelevant: 8,
      technicalSkillsListed: 7,
      languagesProficiency: 4,
      certificationsPresent: 6,
      publicationsPresent: 5,
      volunteering: 4,
      achievementsHighlighted: 7,
    };

    // Adjust weights based on job title and industry
    if (targetJobTitle.toLowerCase().includes('senior') || targetJobTitle.toLowerCase().includes('lead')) {
      baseWeights.experienceQuantified = 10;
      baseWeights.roleProgressionClear = 9;
    }

    if (targetIndustry.toLowerCase() === 'technology') {
      baseWeights.technicalSkillsListed = 9;
      baseWeights.portfolioLinked = 8;
    }

    return baseWeights;
  }
}