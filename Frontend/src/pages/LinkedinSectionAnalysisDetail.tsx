import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchLinkedinSectionAnalysis } from "../store/linkedinScanSlice";
import CustomCircularProgress from "../components/ui/CustomCircularProgress";

const LinkedinSectionAnalysisDetail: React.FC = () => {
  const { scanId, sectionName } = useParams<{
    scanId: string;
    sectionName: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { scanResult, selectedSection, loading } = useSelector(
    (state: RootState) => state.linkedinScan,
  );

  useEffect(() => {
    if (scanId && sectionName) {
      dispatch(
        fetchLinkedinSectionAnalysis({
          scanId,
          sectionName: decodeURIComponent(sectionName),
        }),
      );
    }
  }, [dispatch, scanId, sectionName]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600"></div>
          <p className="text-gray-600">Loading section details...</p>
        </div>
      </div>
    );
  }

  if (!scanResult || !sectionName || !selectedSection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-md rounded-3xl border border-red-200/50 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-lg">
          <h3 className="mb-4 text-2xl font-bold text-gray-800">
            Section Not Found
          </h3>
          <p className="mb-6 text-gray-600">
            The requested section analysis could not be found.
          </p>
          <button
            onClick={() => navigate(`/linkedin-builder-result/${scanId}`)}
            className="transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const decodedSectionName = decodeURIComponent(sectionName);
  const sectionScore = scanResult.sectionScores.find(
    (section) => section.sectionName === decodedSectionName,
  );
  const sectionFeedback = selectedSection;

  if (!sectionScore) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-md rounded-3xl border border-red-200/50 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-lg">
          <h3 className="mb-4 text-2xl font-bold text-gray-800">
            Section Not Found
          </h3>
          <p className="mb-6 text-gray-600">
            The requested section analysis could not be found.
          </p>
          <button
            onClick={() => navigate(`/linkedin-builder-result/${scanId}`)}
            className="transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const getScoreIcon = (score: number) => {
    if (score >= 8)
      return (
        <div className="rounded-full bg-green-100 p-3">
          <svg
            className="h-8 w-8 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            />
          </svg>
        </div>
      );
    if (score >= 5)
      return (
        <div className="rounded-full bg-yellow-100 p-3">
          <svg
            className="h-8 w-8 text-yellow-600"
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
        </div>
      );
    return (
      <div className="rounded-full bg-red-100 p-3">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/linkedin-builder-result/${scanId}`)}
            className="group mb-6 flex items-center text-blue-600 transition-all duration-200 hover:text-blue-700"
          >
            <div className="mr-3 rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-blue-50/40 p-2.5 shadow-md backdrop-blur-sm transition-all duration-200 group-hover:shadow-lg">
              <svg
                className="h-4 w-4"
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
            </div>
            <span className="font-medium">Back to LinkedIn Analysis</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-gray-800 via-blue-700 to-blue-600 bg-clip-text text-4xl font-extrabold text-transparent">
                {decodedSectionName}
              </h1>
              <div className="mt-2 flex items-center space-x-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
                <p className="text-lg font-medium text-gray-600">
                  Detailed Section Analysis
                </p>
              </div>
            </div>
            {getScoreIcon(sectionScore.score)}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Score Overview */}
          <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white/90 via-blue-50/90 to-indigo-100/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="text-center">
                <CustomCircularProgress score={sectionScore.score} />
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Section Score
                  </h3>
                  <p className="text-gray-600">Current performance rating</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Weight</span>
                    <span className="text-xl font-bold text-blue-600">
                      {sectionScore.weight}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
                      style={{ width: `${(sectionScore.weight / 1) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm">
                  <h4 className="mb-3 font-semibold text-gray-800">
                    Performance Level
                  </h4>
                  <div
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${
                      sectionScore.score >= 8
                        ? "bg-green-100 text-green-800"
                        : sectionScore.score >= 5
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sectionScore.score >= 8
                      ? "Excellent"
                      : sectionScore.score >= 5
                        ? "Good"
                        : "Needs Improvement"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Issues Section */}
          {sectionFeedback.issues && sectionFeedback.issues.length > 0 && (
            <div className="rounded-3xl border border-red-200/50 bg-gradient-to-br from-red-50/90 via-rose-50/80 to-red-100/60 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center">
                <div className="mr-4 rounded-xl bg-red-100/80 p-3 shadow-inner">
                  <svg
                    className="h-6 w-6 text-red-600"
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
                </div>
                <h3 className="text-2xl font-bold text-red-800">
                  Issues Found
                </h3>
              </div>

              <div className="space-y-4">
                {sectionFeedback.issues.map((issue: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 rounded-xl border border-red-300/60 bg-white/70 p-4 shadow-sm backdrop-blur-sm"
                  >
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-200 text-red-600">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-sm text-red-800">{issue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Suggestion Section */}
          {sectionFeedback.aiSuggestion && (
            <div className="rounded-3xl border border-green-200/50 bg-gradient-to-br from-green-50/90 via-emerald-50/80 to-green-100/60 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center">
                <div className="mr-4 rounded-xl bg-green-100/80 p-3 shadow-inner">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-800">
                  AI Improvement Suggestion
                </h3>
              </div>

              <div className="space-y-6">
                {/* Original Text */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="text-sm font-bold uppercase tracking-wide text-red-800">
                      Current Text
                    </span>
                  </div>
                  <div className="rounded-xl border border-red-300 bg-gradient-to-br from-red-100/90 to-rose-200/80 px-4 py-3 shadow-sm">
                    <p className="text-sm font-medium text-red-900">
                      {sectionFeedback.aiSuggestion.originalText}
                    </p>
                  </div>
                </div>

                {/* Improved Text */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-600"></div>
                    <span className="text-sm font-bold uppercase tracking-wide text-green-800">
                      AI Suggestion
                    </span>
                  </div>
                  <div className="rounded-xl border border-green-300 bg-gradient-to-br from-green-100/90 to-emerald-200/80 px-4 py-3 shadow-sm">
                    <p className="text-sm font-semibold text-green-900">
                      {sectionFeedback.aiSuggestion.improvedText}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-100/90 to-indigo-100/70 px-4 py-3 shadow-sm">
                  <div className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Why this works: </span>
                      {sectionFeedback.aiSuggestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benchmark Results */}
          {sectionFeedback.benchmarkResults && (
            <div className="rounded-3xl border border-purple-200/50 bg-gradient-to-br from-purple-50/90 via-indigo-50/80 to-purple-100/60 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center">
                <div className="mr-4 rounded-xl bg-purple-100/80 p-3 shadow-inner">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-purple-800">
                  Benchmark Analysis
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(sectionFeedback.benchmarkResults).map(
                  ([key, result]) => (
                    <div
                      key={key}
                      className={`rounded-xl border p-4 shadow-sm ${
                        result.passed
                          ? "border-green-300/60 bg-green-100/70"
                          : "border-red-300/60 bg-red-100/70"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-sm font-semibold capitalize text-gray-800">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </h4>
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${
                            result.passed ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          <svg
                            className="h-3 w-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            {result.passed ? (
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              />
                            ) : (
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              />
                            )}
                          </svg>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-lg font-bold ${
                            result.passed ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {result.score}/10
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedinSectionAnalysisDetail;
