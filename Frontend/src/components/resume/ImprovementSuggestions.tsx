import React, { useState } from "react";

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

interface ImprovementSuggestionsProps {
  detailedFeedback: DetailedFeedback[];
  improvementPotential: number;
}

const ImprovementSuggestions: React.FC<ImprovementSuggestionsProps> = ({
  detailedFeedback,
  improvementPotential,
}) => {
  const [activeTab, setActiveTab] = useState<"high" | "medium" | "low">("high");
  const [copiedSuggestion, setCopiedSuggestion] = useState<string | null>(null);

  // Categorize suggestions by priority
  const categorizeSuggestions = () => {
    const high: DetailedFeedback[] = [];
    const medium: DetailedFeedback[] = [];
    const low: DetailedFeedback[] = [];

    detailedFeedback.forEach((feedback) => {
      if (feedback.currentScore <= 4) {
        high.push(feedback);
      } else if (feedback.currentScore <= 7) {
        medium.push(feedback);
      } else {
        low.push(feedback);
      }
    });

    return { high, medium, low };
  };

  const { high, medium, low } = categorizeSuggestions();

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
    }
  };

  const getActiveTabColor = (tab: "high" | "medium" | "low") => {
    if (activeTab === tab) {
      switch (tab) {
        case "high":
          return "bg-red-600 text-white";
        case "medium":
          return "bg-yellow-600 text-white";
        case "low":
          return "bg-green-600 text-white";
      }
    }
    return "bg-gray-100 text-gray-600 hover:bg-gray-200";
  };

  const copyToClipboard = async (text: string, suggestionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSuggestion(suggestionId);
      setTimeout(() => setCopiedSuggestion(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const renderSuggestions = (
    suggestions: DetailedFeedback[],
    priority: "high" | "medium" | "low",
  ) => {
    if (suggestions.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          <svg
            className="mx-auto mb-4 h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>No {priority} priority suggestions found.</p>
          <p className="mt-1 text-sm">Great job on this area!</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {suggestions.map((feedback) => (
          <div
            key={feedback._id}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {feedback.sectionName}
                </h3>
                <span
                  className={`ml-3 rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(
                    priority,
                  )}`}
                >
                  {feedback.currentScore}/10
                </span>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(
                  priority,
                )}`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </span>
            </div>

            {/* Issues */}
            {feedback.issues.length > 0 && (
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Issues Identified:
                </h4>
                <ul className="space-y-1">
                  {feedback.issues.map((issue, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-sm text-gray-600"
                    >
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Suggestion */}
            {feedback.aiSuggestion && (
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="flex items-center text-sm font-medium text-blue-900">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    AI Suggestion
                  </h4>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {feedback.aiSuggestion.improvementType}
                  </span>
                </div>

                <p className="mb-4 text-sm text-blue-800">
                  {feedback.aiSuggestion.explanation}
                </p>

                {/* Before/After Comparison */}
                <div className="grid gap-4 md:grid-cols-2">
                  {feedback.aiSuggestion.originalText !== "Missing" && (
                    <div>
                      <h5 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-600">
                        Current:
                      </h5>
                      <div className="rounded bg-red-50 p-3 text-sm text-red-800">
                        {feedback.aiSuggestion.originalText}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h5 className="text-xs font-medium uppercase tracking-wide text-gray-600">
                        Improved:
                      </h5>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            feedback.aiSuggestion!.improvedText,
                            feedback._id,
                          )
                        }
                        className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                      >
                        {copiedSuggestion === feedback._id ? (
                          <>
                            <svg
                              className="mr-1 h-3 w-3"
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
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg
                              className="mr-1 h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="rounded bg-green-50 p-3 text-sm text-green-800">
                      {feedback.aiSuggestion.improvedText}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Improvement Suggestions
            </h2>
            <p className="text-sm text-gray-600">
              AI-powered recommendations to boost your resume score
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              +{improvementPotential}
            </div>
            <div className="text-xs text-gray-500">potential points</div>
          </div>
        </div>
      </div>

      {/* Priority Tabs */}
      <div className="mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab("high")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${getActiveTabColor(
            "high",
          )}`}
        >
          High Priority ({high.length})
        </button>
        <button
          onClick={() => setActiveTab("medium")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${getActiveTabColor(
            "medium",
          )}`}
        >
          Medium Priority ({medium.length})
        </button>
        <button
          onClick={() => setActiveTab("low")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${getActiveTabColor(
            "low",
          )}`}
        >
          Low Priority ({low.length})
        </button>
      </div>

      {/* Suggestion Content */}
      <div className="min-h-96">
        {activeTab === "high" && renderSuggestions(high, "high")}
        {activeTab === "medium" && renderSuggestions(medium, "medium")}
        {activeTab === "low" && renderSuggestions(low, "low")}
      </div>

      {/* Action Footer */}
      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <p className="font-medium">💡 Pro Tip:</p>
            <p>Focus on high priority suggestions first for maximum impact.</p>
          </div>
          <button className="rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 text-sm font-medium text-white hover:from-red-600 hover:to-rose-600">
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImprovementSuggestions;
