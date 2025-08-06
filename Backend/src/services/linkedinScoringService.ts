interface LinkedinBenchmarkResult {
  passed: boolean;
  score: number;
}

interface LinkedinBenchmarkResults {
  [key: string]: LinkedinBenchmarkResult;
}

interface LinkedinGeminiBenchmarkResult {
  passed: boolean;
  evidence: string;
  scoreRationale: string;
  matchPercentage: number;
}

interface LinkedinGeminiBenchmarkResults {
  [key: string]: LinkedinGeminiBenchmarkResult;
}

interface IndustryWeights {
  [benchmarkName: string]: number;
}

interface IndustryWeightsConfig {
  [industry: string]: IndustryWeights;
}

export class LinkedinScoringService {
  // Section weights for different experience levels
  private getSectionWeights(experienceLevel: string) {
    const weights = {
      entry: {
        "Profile Header": 0.25,
        "About Section": 0.20,
        "Experience": 0.20,
        "Education": 0.15,
        "Skills": 0.10,
        "Network & Engagement": 0.05,
        "Additional Sections": 0.05,
      },
      mid: {
        "Profile Header": 0.20,
        "About Section": 0.18,
        "Experience": 0.25,
        "Education": 0.10,
        "Skills": 0.12,
        "Network & Engagement": 0.10,
        "Additional Sections": 0.05,
      },
      senior: {
        "Profile Header": 0.15,
        "About Section": 0.20,
        "Experience": 0.30,
        "Education": 0.08,
        "Skills": 0.12,
        "Network & Engagement": 0.10,
        "Additional Sections": 0.05,
      },
      executive: {
        "Profile Header": 0.15,
        "About Section": 0.25,
        "Experience": 0.35,
        "Education": 0.05,
        "Skills": 0.10,
        "Network & Engagement": 0.07,
        "Additional Sections": 0.03,
      },
    };

    return weights[experienceLevel as keyof typeof weights] || weights.mid;
  }

  // Industry-specific benchmark weights
  private getIndustryWeights(industry: string): IndustryWeights {
    const industryWeights: IndustryWeightsConfig = {
      Technology: {
        skillsRelevant: 1.2,
        certificationsPresent: 1.3,
        activityConsistent: 1.1,
      },
      Finance: {
        quantifiedAchievements: 1.3,
        certificationsPresent: 1.2,
        recommendationsPresent: 1.1,
      },
      Healthcare: {
        certificationsPresent: 1.4,
        educationComplete: 1.2,
        volunteering: 1.1,
      },
      Marketing: {
        featuredSection: 1.3,
        activityConsistent: 1.2,
        industryKeywords: 1.1,
      },
      Sales: {
        quantifiedAchievements: 1.3,
        recommendationsPresent: 1.2,
        connectionCount: 1.1,
      },
      General: {},
    };

    return industryWeights[industry] || industryWeights.General;
  }

  // Convert Gemini benchmark results to scoring format
  private convertBenchmarkResults(geminiBenchmarkResults: LinkedinGeminiBenchmarkResults): LinkedinBenchmarkResults {
    const scoringResults: LinkedinBenchmarkResults = {};
    
    Object.entries(geminiBenchmarkResults).forEach(([benchmark, result]) => {
      scoringResults[benchmark] = {
        passed: result.passed,
        score: this.calculateBenchmarkScore(benchmark, result)
      };
    });

    return scoringResults;
  }

  // Calculate individual benchmark score based on Gemini analysis
  private calculateBenchmarkScore(benchmark: string, result: LinkedinGeminiBenchmarkResult): number {
    const baseScore = result.passed ? 6 : 2;
    const matchPercentage = result.matchPercentage || 0;
    
    // Use match percentage to enhance the score
    const matchBonus = Math.round((matchPercentage / 100) * 4); // 0-4 bonus points
    
    return Math.min(10, Math.max(0, baseScore + matchBonus));
  }

  // Calculate overall LinkedIn profile score
  calculateOverallScore(
    geminiBenchmarkResults: LinkedinGeminiBenchmarkResults,
    targetJobTitle: string,
    experienceLevel: string,
    targetIndustry: string
  ): number {
    // Convert Gemini results to scoring format
    const benchmarkResults = this.convertBenchmarkResults(geminiBenchmarkResults);
    
    const sectionWeights = this.getSectionWeights(experienceLevel);
    const industryWeights = this.getIndustryWeights(targetIndustry);

    let totalScore = 0;
    let totalWeight = 0;

    // Calculate section scores
    Object.entries(sectionWeights).forEach(([sectionName, weight]) => {
      const sectionScore = this.calculateSectionScore(
        sectionName,
        benchmarkResults,
        targetJobTitle,
        experienceLevel
      );

      totalScore += sectionScore * weight;
      totalWeight += weight;
    });

    // Apply industry-specific adjustments with proper typing
    Object.entries(industryWeights).forEach(([benchmark, multiplier]) => {
      if (benchmarkResults[benchmark] && typeof multiplier === 'number') {
        const adjustment = (benchmarkResults[benchmark].score * multiplier - benchmarkResults[benchmark].score) * 0.1;
        totalScore += adjustment;
      }
    });

    // Normalize to 0-100 scale
    const normalizedScore = Math.round((totalScore / totalWeight) * 10);
    return Math.min(100, Math.max(0, normalizedScore));
  }

  // Calculate section-specific scores
  calculateSectionScore(
    sectionName: string,
    benchmarkResults: LinkedinBenchmarkResults,
    targetJobTitle: string,
    experienceLevel: string
  ): number {
    const sectionBenchmarks = this.getSectionBenchmarks(sectionName);
    
    if (sectionBenchmarks.length === 0) return 5; // Default score

    let sectionScore = 0;
    let benchmarkCount = 0;

    sectionBenchmarks.forEach(benchmark => {
      if (benchmarkResults[benchmark]) {
        sectionScore += benchmarkResults[benchmark].score;
        benchmarkCount++;
      }
    });

    return benchmarkCount > 0 ? Math.round(sectionScore / benchmarkCount) : 5;
  }

  // Overloaded method for Gemini benchmark results
  calculateSectionScoreFromGemini(
    sectionName: string,
    geminiBenchmarkResults: LinkedinGeminiBenchmarkResults,
    targetJobTitle: string,
    experienceLevel: string
  ): number {
    const benchmarkResults = this.convertBenchmarkResults(geminiBenchmarkResults);
    return this.calculateSectionScore(sectionName, benchmarkResults, targetJobTitle, experienceLevel);
  }

  // Get benchmarks relevant to each LinkedIn section
  getSectionBenchmarks(sectionName: string): string[] {
    const sectionBenchmarkMap = {
      "Profile Header": [
        "profilePhotoPresent",
        "headlineOptimized",
        "contactInfoComplete",
        "customURL"
      ],
      "About Section": [
        "summaryCompelling",
        "industryKeywords",
        "quantifiedAchievements"
      ],
      "Experience": [
        "experienceDetailed",
        "quantifiedAchievements",
        "industryKeywords"
      ],
      "Education": [
        "educationComplete",
        "coursesRelevant"
      ],
      "Skills": [
        "skillsRelevant",
        "endorsementsReceived"
      ],
      "Network & Engagement": [
        "connectionCount",
        "recommendationsPresent",
        "activityConsistent"
      ],
      "Additional Sections": [
        "backgroundImage",
        "featuredSection",
        "volunteering",
        "certificationsPresent",
        "languagesProficiency"
      ]
    };

    return sectionBenchmarkMap[sectionName as keyof typeof sectionBenchmarkMap] || [];
  }

  // Calculate improvement potential
  calculateImprovementPotential(overallScore: number): number {
    return Math.max(0, 100 - overallScore);
  }

  // Get section importance based on job title and experience level
  getSectionImportance(sectionName: string, jobTitle: string, experienceLevel: string): string {
    // Higher importance for certain sections based on role
    const jobTitleSectionImportance = {
      developer: {
        "Skills": "high",
        "Experience": "high",
        "Additional Sections": "medium",
      },
      manager: {
        "Experience": "high",
        "About Section": "high",
        "Network & Engagement": "medium",
      },
      sales: {
        "Experience": "high",
        "Network & Engagement": "high",
        "About Section": "medium",
      },
    };

    const lowerJobTitle = jobTitle.toLowerCase();
    for (const [role, importance] of Object.entries(jobTitleSectionImportance)) {
      if (lowerJobTitle.includes(role)) {
        return importance[sectionName as keyof typeof importance] || "medium";
      }
    }

    return "medium";
  }

  // Convert Gemini benchmark results for storage in database
  convertForDatabase(geminiBenchmarkResults: LinkedinGeminiBenchmarkResults): { [key: string]: { passed: boolean; score: number } } {
    const dbResults: { [key: string]: { passed: boolean; score: number } } = {};
    
    Object.entries(geminiBenchmarkResults).forEach(([benchmark, result]) => {
      dbResults[benchmark] = {
        passed: result.passed,
        score: this.calculateBenchmarkScore(benchmark, result)
      };
    });

    return dbResults;
  }
}