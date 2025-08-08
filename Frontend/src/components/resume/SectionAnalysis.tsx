import React, { useState } from "react";

interface SectionScore {
  sectionName: string;
  score: number;
  weight: number;
}

interface DetailedFeedback {
  sectionName: string;
  currentScore: number;
  issues: string[];
  aiSuggestion?: {
    originalText: string;
    improvedText: string;
    explanation: string;
    improvementType: string;
  };
  benchmarkResults: Record<string, { passed: boolean; score: number }>;
  _id: string;
}

interface SectionAnalysisProps {
  sectionScores: SectionScore[];
  detailedFeedback: DetailedFeedback[];
  onSectionClick?: (sectionName: string) => void;
  isMainView?: boolean;
}

const SectionAnalysis: React.FC<SectionAnalysisProps> = ({
  sectionScores,
  detailedFeedback,
  onSectionClick,
  isMainView = false,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 8) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (score >= 6) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-rose-500";
  };

  if (isMainView) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Section Analysis</h2>
          <p className="text-gray-600">
            Click on any section to see detailed analysis and improvements
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sectionScores.map((section) => {
            const feedback = detailedFeedback.find(
              (f) => f.sectionName === section.sectionName,
            );
            const issuesCount = feedback?.issues.length || 0;

            return (
              <button
                key={section.sectionName}
                onClick={() => onSectionClick?.(section.sectionName)}
                className="group relative rounded-xl border border-gray-200 bg-gray-50 p-6 text-left transition-all hover:scale-[1.02] hover:bg-white hover:shadow-lg active:scale-[0.98]"
              >
                {/* Section Header */}
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-red-600">
                    {section.sectionName}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getScoreBadgeColor(
                      section.score,
                    )}`}
                  >
                    {section.score}/10
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-3 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-3 rounded-full ${getScoreBarColor(section.score)}`}
                      style={{ width: `${(section.score / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center">
                    {issuesCount > 0 ? (
                      <>
                        <svg
                          className="mr-1 h-4 w-4 text-amber-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        {issuesCount} issue
                        {issuesCount !== 1 ? "s" : ""}
                      </>
                    ) : (
                      <>
                        <svg
                          className="mr-1 h-4 w-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        All good
                      </>
                    )}
                  </span>
                  <svg
                    className="h-4 w-4 text-gray-400 transition-colors group-hover:text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>

                {/* Hover Effect Overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent transition-colors group-hover:border-red-200" />
              </button>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            💡 Click on sections with lower scores to get detailed improvement
            suggestions
          </p>
        </div>
      </div>
    );
  }

  // Original expandable view (if needed elsewhere)
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Section Analysis</h2>
        <p className="text-sm text-gray-600">
          Detailed breakdown of each resume section
        </p>
      </div>

      <div className="space-y-4">
        {sectionScores.map((section) => {
          const feedback = detailedFeedback.find(
            (f) => f.sectionName === section.sectionName,
          );
          const isExpanded = expandedSection === section.sectionName;

          return (
            <div
              key={section.sectionName}
              className="rounded-lg border border-gray-100 bg-gray-50"
            >
              <button
                onClick={() =>
                  setExpandedSection(isExpanded ? null : section.sectionName)
                }
                className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-900">
                    {section.sectionName}
                  </h3>
                  <span
                    className={`ml-3 rounded-full px-2 py-1 text-xs font-medium ${getScoreBadgeColor(
                      section.score,
                    )}`}
                  >
                    {section.score}/10
                  </span>
                </div>
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-200 bg-white p-4">
                  {feedback ? (
                    <div className="space-y-4">
                      {/* Issues */}
                      {feedback.issues.length > 0 && (
                        <div>
                          <h4 className="mb-2 font-medium text-red-900">
                            Issues Found:
                          </h4>
                          <ul className="space-y-1">
                            {feedback.issues.map((issue, idx) => (
                              <li
                                key={idx}
                                className="flex items-start text-sm text-red-700"
                              >
                                <span className="mr-2 mt-1 h-1 w-1 rounded-full bg-red-500" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* AI Suggestion */}
                      {feedback.aiSuggestion && (
                        <div className="rounded-lg bg-blue-50 p-4">
                          <h4 className="mb-2 font-medium text-blue-900">
                            AI Suggestion:
                          </h4>
                          <p className="mb-3 text-sm text-blue-800">
                            {feedback.aiSuggestion.explanation}
                          </p>

                          {feedback.aiSuggestion.originalText !== "Missing" && (
                            <div className="mb-3">
                              <h5 className="text-xs font-medium uppercase tracking-wide text-gray-600">
                                Original:
                              </h5>
                              <div className="mt-1 rounded bg-red-50 p-2 text-sm text-red-800">
                                {feedback.aiSuggestion.originalText}
                              </div>
                            </div>
                          )}

                          <div>
                            <h5 className="text-xs font-medium uppercase tracking-wide text-gray-600">
                              Improved:
                            </h5>
                            <div className="mt-1 rounded bg-green-50 p-2 text-sm text-green-800">
                              {feedback.aiSuggestion.improvedText}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Benchmark Results */}
                      <div>
                        <h4 className="mb-2 font-medium text-gray-900">
                          Benchmark Results:
                        </h4>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {Object.entries(feedback.benchmarkResults).map(
                            ([key, result]) => (
                              <div
                                key={key}
                                className={`flex items-center justify-between rounded p-2 text-xs ${
                                  result.passed
                                    ? "bg-green-50 text-green-800"
                                    : "bg-red-50 text-red-800"
                                }`}
                              >
                                <span className="font-medium">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span className="font-bold">
                                  {result.score}/10
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      No detailed feedback available for this section.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionAnalysis;
