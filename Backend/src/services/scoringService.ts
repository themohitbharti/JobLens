export class DeterministicScoringService {
  // Updated role weights for 20 benchmarks
  private readonly ROLE_SPECIFIC_WEIGHTS: Record<
    string,
    Record<string, number>
  > = {
    // Default/General role for any job type
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
      optimalLength: 5, // Right length
      properHeadings: 5, // Clear structure
      keywordDensity: 4, // Moderate importance
      noImages: 4, // ATS compliance
      noTables: 4, // ATS compliance
      standardFonts: 4, // ATS compliance
      leadershipExamples: 3, // Nice to have
      teamworkHighlighted: 3, // Nice to have
      problemSolvingExamples: 3, // Nice to have
      educationRelevance: 3, // Depends on role
      certificationPresence: 3, // Depends on industry
    },

    "software engineer": {
      // Technical roles prioritize these
      skillsRelevance: 10,
      industryKeywords: 9,
      quantifiedAchievements: 8,
      problemSolvingExamples: 8,
      relevantExperience: 9,
      certificationPresence: 6,
      // Standard weights for others
      contactInfoComplete: 8,
      professionalSummary: 6,
      actionVerbUsage: 5,
      roleClarity: 7,
      chronologicalOrder: 5,
      optimalLength: 4,
      noImages: 5,
      noTables: 4,
      standardFonts: 4,
      properHeadings: 5,
      keywordDensity: 6,
      leadershipExamples: 4,
      teamworkHighlighted: 3,
      educationRelevance: 5,
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
      // Standard weights
      contactInfoComplete: 8,
      professionalSummary: 7,
      actionVerbUsage: 6,
      chronologicalOrder: 5,
      optimalLength: 4,
      noImages: 5,
      noTables: 4,
      standardFonts: 4,
      properHeadings: 5,
      keywordDensity: 5,
      certificationPresence: 4,
      educationRelevance: 5,
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
      // Standard weights
      contactInfoComplete: 8,
      professionalSummary: 7,
      chronologicalOrder: 5,
      optimalLength: 5,
      noImages: 5,
      noTables: 4,
      standardFonts: 4,
      properHeadings: 5,
      keywordDensity: 6,
      problemSolvingExamples: 5,
      certificationPresence: 4,
      educationRelevance: 5,
    },

    "data scientist": {
      // Technical + analytical focus
      skillsRelevance: 10,
      quantifiedAchievements: 10,
      industryKeywords: 9,
      problemSolvingExamples: 9,
      relevantExperience: 9,
      certificationPresence: 8,
      educationRelevance: 8,
      // Standard weights
      contactInfoComplete: 8,
      professionalSummary: 6,
      roleClarity: 7,
      actionVerbUsage: 6,
      chronologicalOrder: 5,
      optimalLength: 4,
      noImages: 5,
      noTables: 4,
      standardFonts: 4,
      properHeadings: 5,
      keywordDensity: 7,
      leadershipExamples: 4,
      teamworkHighlighted: 4,
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
      // Standard weights
      contactInfoComplete: 8,
      professionalSummary: 7,
      chronologicalOrder: 5,
      optimalLength: 4,
      noImages: 5,
      noTables: 4,
      standardFonts: 4,
      properHeadings: 5,
      keywordDensity: 6,
      leadershipExamples: 5,
      problemSolvingExamples: 5,
      certificationPresence: 4,
      educationRelevance: 4,
    },
  };

  // Section importance weights by role
  private readonly SECTION_IMPORTANCE_WEIGHTS: Record<
    string,
    Record<string, number>
  > = {
    default: {
      "Contact Information": 0.15, // 15% - Always critical
      "Professional Summary": 0.2, // 20% - Very important
      "Work Experience": 0.3, // 30% - Most important
      Skills: 0.15, // 15% - Important
      Education: 0.1, // 10% - Moderate
      Projects: 0.05, // 5% - Nice to have
      Certifications: 0.03, // 3% - Nice to have
      Achievements: 0.02, // 2% - Nice to have
    },

    "software engineer": {
      "Contact Information": 0.1,
      "Professional Summary": 0.15,
      "Work Experience": 0.35, // Higher for tech roles
      Skills: 0.25, // Much higher for tech
      Education: 0.08,
      Projects: 0.05, // Important for developers
      Certifications: 0.02,
      Achievements: 0.0,
    },

    "product manager": {
      "Contact Information": 0.12,
      "Professional Summary": 0.25, // Higher for leadership
      "Work Experience": 0.35,
      Skills: 0.15,
      Education: 0.08,
      Projects: 0.03,
      Certifications: 0.01,
      Achievements: 0.01,
    },

    "marketing manager": {
      "Contact Information": 0.15,
      "Professional Summary": 0.25,
      "Work Experience": 0.3,
      Skills: 0.15,
      Education: 0.08,
      Projects: 0.04,
      Certifications: 0.02,
      Achievements: 0.01,
    },

    "data scientist": {
      "Contact Information": 0.08,
      "Professional Summary": 0.15,
      "Work Experience": 0.3,
      Skills: 0.25,
      Education: 0.15, // Higher for data science
      Projects: 0.05,
      Certifications: 0.02,
      Achievements: 0.0,
    },

    "sales representative": {
      "Contact Information": 0.15,
      "Professional Summary": 0.2,
      "Work Experience": 0.35,
      Skills: 0.12,
      Education: 0.05,
      Projects: 0.02,
      Certifications: 0.01,
      Achievements: 0.1, // Higher for sales achievements
    },
  };

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

  // Calculate overall score from section scores
  calculateOverallScore(
    benchmarkResults: any,
    targetJobTitle?: string,
    experienceLevel?: string,
    targetIndustry?: string
  ): number {
    // Validate inputs
    if (!benchmarkResults || typeof benchmarkResults !== "object") {
      console.warn("Invalid benchmarkResults provided, using fallback scoring");
      return 50;
    }

    const safeJobTitle = targetJobTitle?.trim() || undefined;
    const safeExperienceLevel = experienceLevel?.trim() || undefined;
    const safeIndustry = targetIndustry?.trim() || undefined;

    // Get section importance weights for this role
    const sectionWeights = this.getSectionImportanceWeights(safeJobTitle);

    // Calculate individual section scores
    const sectionScores: Record<string, number> = {};
    const definedSections = Object.keys(sectionWeights);

    definedSections.forEach((sectionName) => {
      sectionScores[sectionName] = this.calculateSectionScore(
        sectionName,
        benchmarkResults,
        safeJobTitle,
        safeExperienceLevel
      );
    });

    // Calculate weighted average of section scores
    let totalWeightedScore = 0;
    let totalWeight = 0;

    Object.entries(sectionWeights).forEach(([sectionName, weight]) => {
      const sectionScore = sectionScores[sectionName];
      if (typeof sectionScore === "number" && !isNaN(sectionScore)) {
        totalWeightedScore += sectionScore * weight;
        totalWeight += weight;
      }
    });

    // Convert from 0-10 scale to 0-100 scale
    const baseScore =
      totalWeight > 0 ? (totalWeightedScore / totalWeight) * 10 : 50;

    // Apply role and industry bonuses/penalties
    const adjustedScore = this.applyOverallAdjustments(
      baseScore,
      sectionScores,
      benchmarkResults,
      safeJobTitle,
      safeIndustry
    );

    return Math.round(Math.min(100, Math.max(0, adjustedScore)));
  }

  // Handle null/undefined and use defaults
  private getAdjustedWeights(
    jobTitle: string | undefined, // Changed from string | null
    experienceLevel: string | undefined, // Changed from string | null
    industry: string | undefined // Changed from string | null
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

  // Get section importance weights by role
  private getSectionImportanceWeights(
    jobTitle: string | undefined
  ): Record<string, number> {
    const normalizedJobTitle = jobTitle
      ? this.normalizeJobTitle(jobTitle)
      : "default";
    return (
      this.SECTION_IMPORTANCE_WEIGHTS[normalizedJobTitle] ||
      this.SECTION_IMPORTANCE_WEIGHTS["default"]
    );
  }

  // Better job title normalization with default
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

    // Return default instead of hard-coded role
    return "default";
  }

  // Industry adjustments only for existing benchmarks
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
    } else if (
      industryLower.includes("finance") ||
      industryLower.includes("banking")
    ) {
      this.safeAdjustWeight(weights, "quantifiedAchievements", 1.3);
      this.safeAdjustWeight(weights, "certificationPresence", 1.2);
      this.safeAdjustWeight(weights, "educationRelevance", 1.1);
    } else if (industryLower.includes("healthcare")) {
      this.safeAdjustWeight(weights, "certificationPresence", 1.4);
      this.safeAdjustWeight(weights, "educationRelevance", 1.2);
    }
    // If industry doesn't match known patterns, no adjustments (which is fine)
  }

  // Use default weights
  private getDefaultWeights(): Record<string, number> {
    return this.ROLE_SPECIFIC_WEIGHTS["default"];
  }

  // Apply overall adjustments based on performance patterns
  private applyOverallAdjustments(
    baseScore: number,
    sectionScores: Record<string, number>,
    benchmarkResults: any,
    jobTitle: string | undefined,
    industry: string | undefined
  ): number {
    let adjustedScore = baseScore;

    // 1. Consistency bonus - reward well-rounded resumes
    const sectionScoreValues = Object.values(sectionScores).filter(
      (score) => !isNaN(score)
    );
    if (sectionScoreValues.length > 0) {
      const mean =
        sectionScoreValues.reduce((a, b) => a + b, 0) /
        sectionScoreValues.length;
      const variance =
        sectionScoreValues.reduce(
          (sq, score) => sq + Math.pow(score - mean, 2),
          0
        ) / sectionScoreValues.length;
      const standardDev = Math.sqrt(variance);

      // Lower standard deviation = more consistent = bonus
      if (standardDev < 1.5) {
        adjustedScore *= 1.05; // 5% bonus for consistency
      } else if (standardDev > 3.0) {
        adjustedScore *= 0.95; // 5% penalty for inconsistency
      }
    }

    // 2. Critical benchmarks penalty
    const criticalBenchmarks = [
      "contactInfoComplete",
      "relevantExperience",
      "skillsRelevance",
      "roleClarity",
    ];

    let criticalFailures = 0;
    criticalBenchmarks.forEach((benchmark) => {
      const result = benchmarkResults[benchmark];
      if (!result || result.score < 5) {
        criticalFailures++;
      }
    });

    if (criticalFailures > 0) {
      adjustedScore *= Math.pow(0.9, criticalFailures); // 10% penalty per critical failure
    }

    // 3. Excellence bonus - reward exceptional sections
    let excellentSections = 0;
    Object.values(sectionScores).forEach((score) => {
      if (score >= 9) excellentSections++;
    });

    if (excellentSections >= 3) {
      adjustedScore *= 1.1; // 10% bonus for 3+ excellent sections
    }

    // 4. Industry-specific adjustments
    if (industry) {
      adjustedScore = this.applyIndustryOverallAdjustments(
        adjustedScore,
        sectionScores,
        industry
      );
    }

    return adjustedScore;
  }

  // Industry-specific overall adjustments
  private applyIndustryOverallAdjustments(
    score: number,
    sectionScores: Record<string, number>,
    industry: string
  ): number {
    const industryLower = industry.toLowerCase().trim();
    let adjustedScore = score;

    if (industryLower.includes("tech") || industryLower.includes("software")) {
      // Tech industry values skills and projects highly
      const skillsScore = sectionScores["Skills"] || 0;
      const projectsScore = sectionScores["Projects"] || 0;

      if (skillsScore >= 8 && projectsScore >= 7) {
        adjustedScore *= 1.08; // 8% bonus for strong tech profile
      }
    } else if (
      industryLower.includes("finance") ||
      industryLower.includes("banking")
    ) {
      // Finance values achievements and certifications
      const achievementsScore = sectionScores["Achievements"] || 0;
      const certsScore = sectionScores["Certifications"] || 0;

      if (achievementsScore >= 7 && certsScore >= 6) {
        adjustedScore *= 1.06; // 6% bonus for finance credentials
      }
    } else if (industryLower.includes("healthcare")) {
      // Healthcare values education and certifications highly
      const educationScore = sectionScores["Education"] || 0;
      const certsScore = sectionScores["Certifications"] || 0;

      if (educationScore >= 8 && certsScore >= 7) {
        adjustedScore *= 1.07; // 7% bonus for healthcare qualifications
      }
    }

    return adjustedScore;
  }

  // Section score calculation with nulls handling
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
    // Use undefined consistently
    const safeJobTitle = jobTitle?.trim() || undefined;
    const safeExperienceLevel = experienceLevel?.trim() || undefined;

    const sectionBenchmarks = this.getSectionBenchmarks(safeSectionName);

    if (sectionBenchmarks.length === 0) {
      console.warn(`No benchmarks found for section: ${safeSectionName}`);
      return 5;
    }

    // Pass undefined instead of null
    const weights = this.getAdjustedWeights(
      safeJobTitle,
      safeExperienceLevel,
      undefined 
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

    const finalScore =
      totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 5;

    // Optional: Add section-specific adjustments
    return this.applySectionSpecificAdjustments(
      safeSectionName,
      finalScore,
      benchmarkResults
    );
  }

  // Section-specific adjustments
  private applySectionSpecificAdjustments(
    sectionName: string,
    baseScore: number,
    benchmarkResults: any
  ): number {
    let adjustedScore = baseScore;

    switch (sectionName) {
      case "Work Experience":
        // Bonus for strong leadership + achievements combination
        const leadership = benchmarkResults["leadershipExamples"]?.score || 0;
        const achievements =
          benchmarkResults["quantifiedAchievements"]?.score || 0;
        if (leadership >= 8 && achievements >= 8) {
          adjustedScore = Math.min(10, adjustedScore * 1.1);
        }
        break;

      case "Skills":
        // Bonus for both skills relevance + industry keywords
        const skillsRel = benchmarkResults["skillsRelevance"]?.score || 0;
        const keywords = benchmarkResults["industryKeywords"]?.score || 0;
        if (skillsRel >= 8 && keywords >= 7) {
          adjustedScore = Math.min(10, adjustedScore * 1.08);
        }
        break;

      case "Professional Summary":
        // Penalty for missing professional summary but having role clarity
        const summary = benchmarkResults["professionalSummary"]?.score || 0;
        const clarity = benchmarkResults["roleClarity"]?.score || 0;
        if (summary < 5 && clarity >= 7) {
          adjustedScore = Math.max(0, adjustedScore * 0.85); // Encourage having both
        }
        break;
    }

    return Math.round(Math.min(10, Math.max(0, adjustedScore)));
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

  // Updated section mapping to only use 20 benchmarks
  public getSectionBenchmarks(sectionName: string): string[] {
    const sectionMapping: Record<string, string[]> = {
      "Contact Information": ["contactInfoComplete"],
      "Professional Summary": ["professionalSummary", "roleClarity"],
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
      Certifications: ["certificationPresence"],
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

  // Get detailed scoring breakdown for debugging
  getDetailedScoreBreakdown(
    benchmarkResults: any,
    targetJobTitle?: string,
    experienceLevel?: string,
    targetIndustry?: string
  ): {
    sectionScores: Record<string, number>;
    sectionWeights: Record<string, number>;
    overallScore: number;
    adjustments: string[];
  } {
    const safeJobTitle = targetJobTitle?.trim() || undefined;
    const sectionWeights = this.getSectionImportanceWeights(safeJobTitle);

    const sectionScores: Record<string, number> = {};
    Object.keys(sectionWeights).forEach((sectionName) => {
      sectionScores[sectionName] = this.calculateSectionScore(
        sectionName,
        benchmarkResults,
        safeJobTitle,
        experienceLevel?.trim() || undefined
      );
    });

    const overallScore = this.calculateOverallScore(
      benchmarkResults,
      targetJobTitle,
      experienceLevel,
      targetIndustry
    );

    return {
      sectionScores,
      sectionWeights,
      overallScore,
      adjustments: [], // Could add specific adjustment reasons
    };
  }
}
