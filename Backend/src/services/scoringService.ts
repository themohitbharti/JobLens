export class DeterministicScoringService {
  // Add a comprehensive default/general role weights
  private readonly ROLE_SPECIFIC_WEIGHTS: Record<
    string,
    Record<string, number>
  > = {
    // 🔥 NEW: Default/General role for any job type
    default: {
      // Balanced weights for universal resume quality
      contactInfoComplete: 9, // Always critical
      professionalSummary: 8, // Very important for any role
      roleClarity: 8, // Clear positioning matters
      relevantExperience: 8, // Experience is always key
      quantifiedAchievements: 7, // Numbers matter in most roles
      skillsRelevance: 7, // Skills matching is important
      actionVerbUsage: 6, // Good writing matters
      industryKeywords: 6, // Some keyword matching helps
      chronologicalOrder: 6, // Proper structure
      consistentFormatting: 5, // Professional appearance
      optimalLength: 5, // Right length
      properHeadings: 5, // Clear structure
      grammarCheck: 5, // Basic quality
      spellingCheck: 5, // Basic quality
      keywordDensity: 4, // Moderate importance
      noImages: 4, // ATS compliance
      noTables: 4, // ATS compliance
      standardFonts: 4, // ATS compliance
      readabilityScore: 4, // General quality
      leadershipExamples: 3, // Nice to have
      teamworkHighlighted: 3, // Nice to have
      problemSolvingExamples: 3, // Nice to have
      educationRelevance: 3, // Depends on role
      certificationPresence: 3, // Depends on industry
      continuousLearning: 3, // Good but not critical
      uniquenessScore: 2, // Least critical
      buzzwordPresence: 2, // Can be harmful if overdone
    },

    "software engineer": {
      // Technical roles prioritize these
      skillsRelevance: 10,
      industryKeywords: 9,
      quantifiedAchievements: 8,
      problemSolvingExamples: 8,
      relevantExperience: 9,
      continuousLearning: 7,
      certificationPresence: 6,
      // Standard weights for others
      contactInfoComplete: 8,
      professionalSummary: 6,
      actionVerbUsage: 5,
      roleClarity: 7,
      chronologicalOrder: 5,
      consistentFormatting: 4,
      optimalLength: 4,
      noImages: 5,
      noTables: 4,
      standardFonts: 4,
      properHeadings: 5,
      keywordDensity: 6,
      leadershipExamples: 4,
      teamworkHighlighted: 3,
      educationRelevance: 5,
      grammarCheck: 3,
      spellingCheck: 3,
      readabilityScore: 3,
      uniquenessScore: 3,
      buzzwordPresence: 2,
    },

    "product manager": {
      // Leadership and strategy focused
      leadershipExamples: 10,
      quantifiedAchievements: 9,
      problemSolvingExamples: 8,
      teamworkHighlighted: 8,
      roleClarity: 9,
      relevantExperience: 9,
      industryKeywords: 7,
      skillsRelevance: 7,
      continuousLearning: 6,
      // Standard weights
      contactInfoComplete: 8,
      professionalSummary: 7,
      actionVerbUsage: 6,
      chronologicalOrder: 5,
      consistentFormatting: 4,
      optimalLength: 4,
      noImages: 5,
      noTables: 4,
      standardFonts: 4,
      properHeadings: 5,
      keywordDensity: 5,
      certificationPresence: 4,
      educationRelevance: 5,
      grammarCheck: 3,
      spellingCheck: 3,
      readabilityScore: 4,
      uniquenessScore: 4,
      buzzwordPresence: 3,
    },

    "marketing manager": {
      // Communication and creativity focused
      roleClarity: 9,
      quantifiedAchievements: 9,
      actionVerbUsage: 8,
      industryKeywords: 8,
      relevantExperience: 8,
      teamworkHighlighted: 7,
      leadershipExamples: 7,
      skillsRelevance: 7,
      readabilityScore: 6,
      uniquenessScore: 6,
      // Standard weights
      contactInfoComplete: 8,
      professionalSummary: 7,
      chronologicalOrder: 5,
      consistentFormatting: 5,
      optimalLength: 5,
      noImages: 5,
      noTables: 4,
      standardFonts: 4,
      properHeadings: 5,
      keywordDensity: 6,
      problemSolvingExamples: 5,
      certificationPresence: 4,
      continuousLearning: 5,
      educationRelevance: 5,
      grammarCheck: 4,
      spellingCheck: 4,
      buzzwordPresence: 3,
    },

    "data scientist": {
      // Technical + analytical focus
      skillsRelevance: 10,
      quantifiedAchievements: 10,
      industryKeywords: 9,
      problemSolvingExamples: 9,
      relevantExperience: 9,
      certificationPresence: 8,
      continuousLearning: 8,
      educationRelevance: 8,
      // Standard weights
      contactInfoComplete: 8,
      professionalSummary: 6,
      roleClarity: 7,
      actionVerbUsage: 6,
      chronologicalOrder: 5,
      consistentFormatting: 4,
      optimalLength: 4,
      noImages: 5,
      noTables: 4,
      standardFonts: 4,
      properHeadings: 5,
      keywordDensity: 7,
      leadershipExamples: 4,
      teamworkHighlighted: 4,
      grammarCheck: 3,
      spellingCheck: 3,
      readabilityScore: 3,
      uniquenessScore: 3,
      buzzwordPresence: 2,
    },

    "sales representative": {
      // Results and communication focused
      quantifiedAchievements: 10,
      roleClarity: 9,
      actionVerbUsage: 8,
      relevantExperience: 8,
      industryKeywords: 7,
      teamworkHighlighted: 6,
      skillsRelevance: 6,
      readabilityScore: 6,
      // Standard weights
      contactInfoComplete: 8,
      professionalSummary: 7,
      chronologicalOrder: 5,
      consistentFormatting: 4,
      optimalLength: 4,
      noImages: 5,
      noTables: 4,
      standardFonts: 4,
      properHeadings: 5,
      keywordDensity: 6,
      leadershipExamples: 5,
      problemSolvingExamples: 5,
      certificationPresence: 4,
      continuousLearning: 4,
      educationRelevance: 4,
      grammarCheck: 4,
      spellingCheck: 4,
      uniquenessScore: 5,
      buzzwordPresence: 4,
    },
  };

  // 🔥 UPDATE: Add default experience modifiers
  private readonly EXPERIENCE_MODIFIERS: Record<
    string,
    Record<string, number>
  > = {
    // Default for when experience level is not provided
    default: {
      // Balanced modifiers - no extreme adjustments
      relevantExperience: 1.0,
      quantifiedAchievements: 1.0,
      skillsRelevance: 1.0,
      leadershipExamples: 1.0,
      educationRelevance: 1.0,
      certificationPresence: 1.0,
    },

    entry: {
      educationRelevance: 1.3,
      certificationPresence: 1.2,
      continuousLearning: 1.2,
      skillsRelevance: 1.1,
      relevantExperience: 0.8,
      leadershipExamples: 0.7,
      quantifiedAchievements: 0.9,
    },

    mid: {
      relevantExperience: 1.2,
      quantifiedAchievements: 1.2,
      skillsRelevance: 1.1,
      problemSolvingExamples: 1.1,
      educationRelevance: 0.9,
      leadershipExamples: 1.0,
    },

    senior: {
      leadershipExamples: 1.3,
      quantifiedAchievements: 1.3,
      relevantExperience: 1.2,
      problemSolvingExamples: 1.2,
      teamworkHighlighted: 1.1,
      educationRelevance: 0.8,
      certificationPresence: 0.9,
    },

    executive: {
      leadershipExamples: 1.5,
      quantifiedAchievements: 1.4,
      roleClarity: 1.3,
      relevantExperience: 1.2,
      teamworkHighlighted: 1.2,
      educationRelevance: 0.7,
      skillsRelevance: 0.9,
      certificationPresence: 0.8,
    },
  };

  // 🔥 UPDATE: Handle null/undefined and use defaults
  calculateOverallScore(
    benchmarkResults: any,
    targetJobTitle?: string,
    experienceLevel?: string,
    targetIndustry?: string
  ): number {
    // 🔥 Validate and set defaults
    if (!benchmarkResults || typeof benchmarkResults !== "object") {
      console.warn("Invalid benchmarkResults provided, using fallback scoring");
      return 50;
    }

    const safeJobTitle = targetJobTitle?.trim() || null;
    const safeExperienceLevel = experienceLevel?.trim() || null;
    const safeIndustry = targetIndustry?.trim() || null;

    const weights = this.getAdjustedWeights(
      safeJobTitle,
      safeExperienceLevel,
      safeIndustry
    );

    // Use Multiple Weighted Algorithm Approaches
    const scores = {
      weightedAverage: this.calculateWeightedAverage(benchmarkResults, weights),
      harmonicMean: this.calculateHarmonicMean(benchmarkResults, weights),
      normalizedScore: this.calculateNormalizedScore(benchmarkResults, weights),
      penalizedScore: this.calculatePenalizedScore(benchmarkResults, weights),
    };

    // Combine algorithms with their own weights
    const finalScore =
      scores.weightedAverage * 0.4 + // Primary method
      scores.normalizedScore * 0.3 + // Handles outliers
      scores.penalizedScore * 0.2 + // Penalizes missing critical elements
      scores.harmonicMean * 0.1; // Prevents inflation from single high scores

    return Math.round(Math.min(100, Math.max(0, finalScore)));
  }

  // 🔥 UPDATE: Handle nulls and use defaults
  private getAdjustedWeights(
    jobTitle: string | null,
    experienceLevel: string | null,
    industry: string | null
  ): Record<string, number> {
    // Get base weights for job role (with default fallback)
    const normalizedJobTitle = jobTitle
      ? this.normalizeJobTitle(jobTitle)
      : "default";
    let baseWeights =
      this.ROLE_SPECIFIC_WEIGHTS[normalizedJobTitle] ||
      this.getDefaultWeights();

    // Apply experience level modifiers (with default fallback)
    const safeExperienceLevel = experienceLevel || "default";
    const experienceModifiers =
      this.EXPERIENCE_MODIFIERS[safeExperienceLevel] || {};

    const adjustedWeights: Record<string, number> = { ...baseWeights };

    Object.entries(experienceModifiers).forEach(([benchmark, modifier]) => {
      if (
        adjustedWeights[benchmark] &&
        typeof modifier === "number" &&
        !isNaN(modifier)
      ) {
        adjustedWeights[benchmark] = Math.round(
          adjustedWeights[benchmark] * modifier
        );
      }
    });

    // Apply industry-specific adjustments (only if industry is provided)
    if (industry) {
      this.applyIndustryAdjustments(adjustedWeights, industry);
    }

    return adjustedWeights;
  }

  // 🔥 UPDATE: Better job title normalization with default
  private normalizeJobTitle(jobTitle: string): string {
    if (!jobTitle || typeof jobTitle !== "string") {
      return "default";
    }

    const title = jobTitle.toLowerCase().trim();

    // If title is empty after trimming
    if (title.length === 0) {
      return "default";
    }

    if (
      title.includes("software") ||
      title.includes("developer") ||
      title.includes("engineer")
    ) {
      return "software engineer";
    }
    if (title.includes("product") && title.includes("manager")) {
      return "product manager";
    }
    if (title.includes("marketing")) {
      return "marketing manager";
    }
    if (
      title.includes("data") &&
      (title.includes("scientist") || title.includes("analyst"))
    ) {
      return "data scientist";
    }
    if (title.includes("sales")) {
      return "sales representative";
    }

    // 🔥 Return default instead of hard-coded role
    return "default";
  }

  // 🔥 UPDATE: Industry adjustments only if industry provided
  private applyIndustryAdjustments(
    weights: Record<string, number>,
    industry: string
  ): void {
    if (!industry || typeof industry !== "string") {
      return; // No adjustments for invalid/missing industry
    }

    const industryLower = industry.toLowerCase().trim();

    // Only apply if we actually recognize the industry
    if (industryLower.includes("tech") || industryLower.includes("software")) {
      this.safeAdjustWeight(weights, "skillsRelevance", 1.2);
      this.safeAdjustWeight(weights, "industryKeywords", 1.1);
      this.safeAdjustWeight(weights, "continuousLearning", 1.1);
    } else if (
      industryLower.includes("finance") ||
      industryLower.includes("banking")
    ) {
      this.safeAdjustWeight(weights, "quantifiedAchievements", 1.3);
      this.safeAdjustWeight(weights, "certificationPresence", 1.2);
      this.safeAdjustWeight(weights, "educationRelevance", 1.1);
    } else if (industryLower.includes("healthcare")) {
      this.safeAdjustWeight(weights, "certificationPresence", 1.4);
      this.safeAdjustWeight(weights, "continuousLearning", 1.2);
      this.safeAdjustWeight(weights, "educationRelevance", 1.2);
    }
    // If industry doesn't match known patterns, no adjustments (which is fine)
  }

  // 🔥 UPDATE: Use default weights
  private getDefaultWeights(): Record<string, number> {
    return this.ROLE_SPECIFIC_WEIGHTS["default"];
  }

  // 🔥 UPDATE: Section score calculation with nulls handling
  calculateSectionScore(
    sectionName: string,
    benchmarkResults: any,
    jobTitle?: string,
    experienceLevel?: string
  ): number {
    if (
      !sectionName?.trim() ||
      !benchmarkResults ||
      typeof benchmarkResults !== "object"
    ) {
      console.warn(
        `Invalid parameters for section score calculation: ${sectionName}`
      );
      return 5; // Fallback score
    }

    const safeSectionName = sectionName.trim();
    const safeJobTitle = jobTitle?.trim() || null;
    const safeExperienceLevel = experienceLevel?.trim() || null;

    const sectionBenchmarks = this.getSectionBenchmarks(safeSectionName);

    if (sectionBenchmarks.length === 0) {
      console.warn(`No benchmarks found for section: ${safeSectionName}`);
      return 5;
    }

    const weights = this.getAdjustedWeights(
      safeJobTitle,
      safeExperienceLevel,
      null
    );

    let weightedScore = 0;
    let totalWeight = 0;

    sectionBenchmarks.forEach((benchmark) => {
      const result = benchmarkResults[benchmark];
      const weight = weights[benchmark] || 1;

      if (result && typeof result.score === "number" && !isNaN(result.score)) {
        weightedScore += result.score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 5;
  }

  private calculateWeightedAverage(
    benchmarkResults: any,
    weights: Record<string, number>
  ): number {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([benchmark, weight]) => {
      const result = benchmarkResults[benchmark];
      if (
        result &&
        typeof result.score === "number" &&
        !isNaN(result.score) &&
        typeof weight === "number" &&
        !isNaN(weight)
      ) {
        totalWeightedScore += result.score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? (totalWeightedScore / totalWeight) * 10 : 50;
  }

  private calculateHarmonicMean(
    benchmarkResults: any,
    weights: Record<string, number>
  ): number {
    let weightedSum = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([benchmark, weight]) => {
      const result = benchmarkResults[benchmark];
      if (
        result &&
        typeof result.score === "number" &&
        result.score > 0 &&
        !isNaN(result.score) &&
        typeof weight === "number" &&
        !isNaN(weight)
      ) {
        weightedSum += weight / result.score;
        totalWeight += weight;
      }
    });

    if (weightedSum === 0 || totalWeight === 0) return 50;
    return (totalWeight / weightedSum) * 10;
  }

  private calculateNormalizedScore(
    benchmarkResults: any,
    weights: Record<string, number>
  ): number {
    const scores: number[] = [];
    const weightValues: number[] = [];

    Object.entries(weights).forEach(([benchmark, weight]) => {
      const result = benchmarkResults[benchmark];
      if (result && typeof weight === "number") {
        scores.push(result.score);
        weightValues.push(weight);
      }
    });

    if (scores.length === 0) return 50;

    // Z-score normalization then weighted average
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const stdDev = Math.sqrt(
      scores.reduce((sq, score) => sq + Math.pow(score - mean, 2), 0) /
        scores.length
    );

    if (stdDev === 0) return mean * 10;

    let normalizedWeightedSum = 0;
    let totalWeight = 0;

    scores.forEach((score, index) => {
      const normalizedScore = (score - mean) / stdDev;
      const adjustedScore = Math.max(
        0,
        Math.min(10, (normalizedScore + 2) * 2.5)
      );
      normalizedWeightedSum += adjustedScore * weightValues[index];
      totalWeight += weightValues[index];
    });

    return totalWeight > 0 ? (normalizedWeightedSum / totalWeight) * 10 : 50;
  }

  private calculatePenalizedScore(
    benchmarkResults: any,
    weights: Record<string, number>
  ): number {
    const criticalBenchmarks = [
      "contactInfoComplete",
      "relevantExperience",
      "skillsRelevance",
      "roleClarity",
    ];

    let baseScore = this.calculateWeightedAverage(benchmarkResults, weights);

    // Apply penalties for missing critical elements
    criticalBenchmarks.forEach((benchmark) => {
      const result = benchmarkResults[benchmark];
      if (!result || result.score < 3) {
        baseScore *= 0.85; // 15% penalty for each critical missing element
      }
    });

    // Bonus for exceptional performance
    let exceptionalCount = 0;
    Object.values(benchmarkResults).forEach((result: any) => {
      if (result && result.score >= 9) {
        exceptionalCount++;
      }
    });

    if (exceptionalCount >= 5) {
      baseScore *= 1.1; // 10% bonus for 5+ exceptional scores
    }

    return baseScore;
  }

  private getSectionBenchmarks(sectionName: string): string[] {
    const sectionMapping: Record<string, string[]> = {
      "Contact Information": ["contactInfoComplete"],
      "Professional Summary": [
        "professionalSummary",
        "roleClarity",
        "buzzwordPresence",
      ],
      "Work Experience": [
        "quantifiedAchievements",
        "actionVerbUsage",
        "relevantExperience",
        "chronologicalOrder",
        "leadershipExamples",
        "teamworkHighlighted",
        "problemSolvingExamples",
      ],
      Skills: ["skillsRelevance", "industryKeywords"],
      Education: ["educationRelevance"],
      Projects: ["problemSolvingExamples", "skillsRelevance"],
      Certifications: ["certificationPresence", "continuousLearning"],
      Achievements: ["quantifiedAchievements", "leadershipExamples"],
    };

    return sectionMapping[sectionName] || [];
  }

  // Helper method for safe weight adjustment (already exists)
  private safeAdjustWeight(
    weights: Record<string, number>,
    key: string,
    multiplier: number
  ): void {
    if (
      weights[key] &&
      typeof weights[key] === "number" &&
      !isNaN(weights[key])
    ) {
      weights[key] = Math.round(weights[key] * multiplier);
    }
  }

  // ...rest of the existing methods remain the same...
}
