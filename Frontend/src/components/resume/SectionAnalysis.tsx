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
}

const SectionAnalysis: React.FC<SectionAnalysisProps> = ({
  sectionScores,
  detailedFeedback,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

//   const getScoreColor = (score: number) => {
//     if (score >= 8) return "text-green-600";
//     if (score >= 6) return "text-yellow-600";
//     return "text-red-600";
//   };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

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
