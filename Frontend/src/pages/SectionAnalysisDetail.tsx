import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchSectionAnalysis,
  setSidebarCollapsed,
} from "../store/resumeScanSlice";
import {
  BenchmarkResults,
  ImprovementSuggestions,
  LoadingSpinner,
} from "../components/resume/index";

const SectionAnalysisDetail: React.FC = () => {
  const { scanId, sectionName } = useParams<{
    scanId: string;
    sectionName: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedSection, loading, error } = useSelector(
    (state: RootState) => state.resumeScan,
  );

  useEffect(() => {
    // Keep sidebar collapsed for section detail page
    dispatch(setSidebarCollapsed(true));

    if (scanId && sectionName) {
      dispatch(
        fetchSectionAnalysis({
          scanId,
          sectionName: decodeURIComponent(sectionName),
        }),
      );
    }
  }, [scanId, sectionName, dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !selectedSection) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Error Loading Section Analysis
          </h3>
          <p className="mt-2 text-gray-600">
            {error || "Failed to load section details"}
          </p>
          <button
            onClick={() => navigate(`/resume-scan-result/${scanId}`)}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="relative min-h-full">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-rose-100 opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-red-100 opacity-40 blur-2xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/resume-scan-result/${scanId}`)}
            className="mb-4 flex items-center text-red-600 hover:text-red-700"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Results
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">
                {decodeURIComponent(sectionName || "")} Analysis
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Detailed breakdown and improvement suggestions
              </p>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex items-center rounded-2xl border-2 px-6 py-3 ${getScoreBadgeColor(selectedSection.currentScore)}`}
              >
                <span className="mr-2 text-2xl font-bold">
                  {selectedSection.currentScore}/10
                </span>
                <span className="text-sm font-medium">Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Section Score Overview */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Score Visualization */}
              <div className="text-center">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Performance Score
                </h2>

                {/* Circular Progress */}
                <div className="relative mb-6 flex justify-center">
                  <svg
                    className="h-40 w-40 -rotate-90 transform"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(selectedSection.currentScore / 10) * 283} 283`}
                      className={getScoreColor(selectedSection.currentScore)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className={`text-4xl font-bold ${getScoreColor(selectedSection.currentScore)}`}
                      >
                        {selectedSection.currentScore}
                      </div>
                      <div className="text-sm font-medium text-gray-600">
                        out of 10
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Status */}
                <div
                  className={`mx-auto w-fit rounded-2xl px-6 py-3 ${getScoreBadgeColor(selectedSection.currentScore)}`}
                >
                  <span className="font-semibold">
                    {selectedSection.currentScore >= 8
                      ? "🎉 Excellent"
                      : selectedSection.currentScore >= 6
                        ? "👍 Good"
                        : "💪 Needs Improvement"}
                  </span>
                </div>
              </div>

              {/* Issues Summary */}
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Issues Identified
                </h3>
                {selectedSection.issues.length > 0 ? (
                  <div className="space-y-3">
                    {selectedSection.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="flex items-start rounded-lg bg-red-50 p-4"
                      >
                        <div className="mr-3 mt-1 h-2 w-2 rounded-full bg-red-400" />
                        <p className="text-sm text-red-800">{issue}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg bg-green-50 p-6 text-center">
                    <svg
                      className="mx-auto mb-2 h-8 w-8 text-green-500"
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
                    <p className="font-medium text-green-800">
                      No issues found!
                    </p>
                    <p className="mt-1 text-sm text-green-600">
                      This section looks great.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Suggestion */}
          {selectedSection.aiSuggestion && (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center">
                <div className="mr-4 rounded-full bg-blue-100 p-3">
                  <svg
                    className="h-6 w-6 text-blue-600"
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
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    AI Improvement Suggestion
                  </h2>
                  <p className="text-gray-600">
                    Powered by advanced language models
                  </p>
                </div>
              </div>

              <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <p className="mb-4 font-medium text-blue-900">
                  {selectedSection.aiSuggestion.explanation}
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  {selectedSection.aiSuggestion.originalText !== "Missing" && (
                    <div>
                      <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Current Version:
                      </h5>
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-800">
                          {selectedSection.aiSuggestion.originalText}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Improved Version:
                    </h5>
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <p className="text-sm text-green-800">
                        {selectedSection.aiSuggestion.improvedText}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          selectedSection.aiSuggestion!.improvedText,
                        )
                      }
                      className="mt-3 flex items-center text-xs text-blue-600 hover:text-blue-700"
                    >
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
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benchmark Results */}
          <BenchmarkResults
            benchmarkResults={selectedSection.benchmarkResults}
          />

          {/* Improvement Suggestions */}
          <ImprovementSuggestions
            detailedFeedback={[selectedSection]}
            improvementPotential={10 - selectedSection.currentScore}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionAnalysisDetail;
