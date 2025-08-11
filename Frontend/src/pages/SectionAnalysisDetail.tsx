// Replace the entire component with this themed version:

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchResumeScanResult,
  setSidebarCollapsed,
} from "../store/resumeScanSlice";
import { LoadingSpinner } from "../components/resume/index";

const SectionAnalysisDetail: React.FC = () => {
  const { scanId, sectionName } = useParams<{
    scanId: string;
    sectionName: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [animateScore, setAnimateScore] = useState(false);

  const { scanData, loading, error } = useSelector(
    (state: RootState) => state.resumeScan,
  );

  useEffect(() => {
    dispatch(setSidebarCollapsed(true));

    if (scanId) {
      dispatch(fetchResumeScanResult(scanId));
    } else {
      navigate("/resume-scan");
    }
  }, [scanId, navigate, dispatch]);

  useEffect(() => {
    if (scanData) {
      setTimeout(() => setAnimateScore(true), 500);
    }
  }, [scanData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !scanData || !sectionName) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="max-w-md rounded-3xl border border-red-200/50 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-lg">
          <div className="mb-6 text-red-500">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-800">
            Section Not Found
          </h3>
          <p className="mb-6 text-gray-600">
            {error || "Unable to load section details"}
          </p>
          <button
            onClick={() => navigate(`/resume-scan-result/${scanId}`)}
            className="transform rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-700 hover:to-red-800 hover:shadow-red-500/25"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const selectedSection = scanData.detailedFeedback.find(
    (feedback) => feedback.sectionName === decodeURIComponent(sectionName),
  );

  if (!selectedSection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="max-w-md rounded-3xl border border-red-200/50 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-lg">
          <div className="mb-6 text-red-500">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-800">
            Section Not Found
          </h3>
          <p className="mb-6 text-gray-600">
            No detailed feedback available for this section
          </p>
          <button
            onClick={() => navigate(`/resume-scan-result/${scanId}`)}
            className="transform rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-700 hover:to-red-800 hover:shadow-red-500/25"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-purple-600"; // Changed from yellow to purple
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 6) return "bg-purple-100 text-purple-800 border-purple-200"; // Changed from yellow to purple
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Decorative background elements - matching main page */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="blur-1xl absolute right-0 top-0 h-96 w-96 rounded-full bg-rose-100 opacity-10" />
        <div className="blur-1xl absolute bottom-0 left-0 h-64 w-64 rounded-full bg-red-100 opacity-10" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-pink-100 opacity-10 blur-3xl" />
      </div>

      {/* Elegant Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(339, 168, 68, 0.1) 0.5px, transparent 0.5px),
                           linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0.5px, transparent 0.5px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative z-10 px-6 py-8">
        {/* Refined Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(`/resume-scan-result/${scanId}`)}
            className="group mb-8 flex items-center text-red-600 transition-all duration-200 hover:text-red-700"
          >
            <div className="mr-3 rounded-xl border border-red-200/50 bg-gradient-to-br from-red-50/80 via-pink-50/60 to-rose-50/40 p-2.5 shadow-md backdrop-blur-sm transition-all duration-200 group-hover:shadow-lg">
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
            <span className="font-medium">Back to Results</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-gray-800 via-red-700 to-red-600 bg-clip-text text-5xl font-extrabold capitalize text-transparent">
                {decodeURIComponent(sectionName || "")} Analysis
              </h1>
              <div className="mt-4 flex items-center space-x-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-red-500 to-red-600"></div>
                <p className="text-xl font-medium text-gray-600">
                  Detailed breakdown and improvement suggestions
                </p>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`inline-flex items-center rounded-2xl border-2 px-6 py-3 ${getScoreBadgeColor(selectedSection.currentScore)} shadow-lg backdrop-blur-sm`}
              >
                <span className="mr-2 text-2xl font-bold">
                  {selectedSection.currentScore}/10
                </span>
                <span className="text-sm font-medium">Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Section Score Overview */}
          <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white/90 via-pink-100/90 to-purple-200/80 p-8 shadow-2xl backdrop-blur-xl">
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
                    <defs>
                      <linearGradient
                        id={`sectionGradient-${selectedSection.currentScore}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor={
                            selectedSection.currentScore >= 8.5
                              ? "#10b981"
                              : selectedSection.currentScore >= 7.5
                                ? "#22c55e"
                                : selectedSection.currentScore >= 6.5
                                  ? "#3b82f6"
                                  : selectedSection.currentScore >= 5.5
                                    ? "#8b5cf6"
                                    : selectedSection.currentScore >= 4
                                      ? "#f97316"
                                      : "#ef4444"
                          }
                        />
                        <stop
                          offset="100%"
                          stopColor={
                            selectedSection.currentScore >= 8.5
                              ? "#047857"
                              : selectedSection.currentScore >= 7.5
                                ? "#15803d"
                                : selectedSection.currentScore >= 6.5
                                  ? "#1e40af"
                                  : selectedSection.currentScore >= 5.5
                                    ? "#6d28d9"
                                    : selectedSection.currentScore >= 4
                                      ? "#ea580c"
                                      : "#dc2626"
                          }
                        />
                      </linearGradient>
                      <filter id="sectionShadow">
                        <feDropShadow
                          dx="0"
                          dy="2"
                          stdDeviation="3"
                          floodColor="rgba(0,0,0,0.1)"
                        />
                      </filter>
                    </defs>

                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                      fill="none"
                      className="drop-shadow-sm"
                    />

                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={`url(#sectionGradient-${selectedSection.currentScore})`}
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={283}
                      strokeDashoffset={
                        animateScore
                          ? 283 - (selectedSection.currentScore / 10) * 283
                          : 283
                      }
                      strokeLinecap="round"
                      filter="url(#sectionShadow)"
                      className="duration-2000 transition-all ease-out"
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
                  className={`mx-auto w-fit rounded-2xl px-6 py-3 ${getScoreBadgeColor(selectedSection.currentScore)} shadow-lg backdrop-blur-sm`}
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

              {/* Section Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">
                    Section Overview
                  </h3>
                  <div className="rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/40 p-6 shadow-lg backdrop-blur-sm">
                    <div className="mb-4 flex items-center space-x-3">
                      <div className="rounded-lg bg-blue-500/10 p-2 shadow-inner">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold capitalize text-gray-800">
                        {selectedSection.sectionName}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Issues Found:
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-bold ${
                            selectedSection.issues.length === 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedSection.issues.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          AI Suggestions:
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-bold ${
                            selectedSection.aiSuggestion
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedSection.aiSuggestion ? "Available" : "None"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Issues and Feedback */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Issues Section */}
            <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white/90 via-red-100/90 to-orange-200/80 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center">
                <div className="mr-4 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 p-3 shadow-inner">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Issues Identified
                  </h3>
                  <div className="mt-1 h-0.5 w-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500"></div>
                </div>
              </div>

              <div>
                {selectedSection.issues.length > 0 ? (
                  <div className="space-y-4">
                    {selectedSection.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="flex items-start rounded-xl border border-red-200/50 bg-gradient-to-r from-red-50/80 via-rose-50/60 to-pink-50/40 p-4 shadow-sm backdrop-blur-sm"
                      >
                        <div className="mr-3 mt-1 h-2 w-2 rounded-full bg-red-500 shadow-sm" />
                        <p className="text-sm font-medium leading-relaxed text-red-800">
                          {issue}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-green-200/50 bg-gradient-to-r from-green-50/80 via-emerald-50/60 to-teal-50/40 p-6 text-center shadow-sm backdrop-blur-sm">
                    <svg
                      className="mx-auto mb-3 h-8 w-8 text-green-500"
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

            {/* Benchmarks Section */}
            <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white/90 via-blue-100/90 to-indigo-200/80 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center">
                <div className="mr-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-3 shadow-inner">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2v-8a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Industry Benchmarks
                  </h3>
                  <div className="mt-1 h-0.5 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(selectedSection.benchmarkResults || {}).length >
                0 ? (
                  Object.entries(selectedSection.benchmarkResults).map(
                    ([key, result], idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-blue-200/50 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/40 p-4 shadow-sm backdrop-blur-sm"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-semibold capitalize text-blue-800">
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())
                              .trim()}
                          </h4>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              result.score >= 8
                                ? "bg-green-100 text-green-800"
                                : result.score >= 6
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.score}/10
                          </span>
                        </div>
                        <div
                          className={`mb-2 text-sm font-medium ${
                            result.passed ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {result.passed ? "✓ Passed" : "✗ Failed"}
                        </div>
                        <div className="h-2 w-full rounded-full bg-blue-200">
                          <div
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              result.score >= 8
                                ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                : result.score >= 6
                                  ? "bg-gradient-to-r from-purple-500 to-indigo-400"
                                  : "bg-gradient-to-r from-red-500 to-pink-400"
                            }`}
                            style={{
                              width: `${(result.score / 10) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <div className="rounded-xl border border-gray-200/50 bg-gradient-to-r from-gray-50/80 via-slate-50/60 to-zinc-50/40 p-6 text-center shadow-sm backdrop-blur-sm">
                    <p className="text-sm italic text-gray-600">
                      No benchmark data available for this section
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Suggestion */}
          {selectedSection.aiSuggestion && (
            <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white/90 via-purple-100/90 to-pink-200/80 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center">
                <div className="mr-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-3 shadow-inner">
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

              <div className="rounded-2xl border border-purple-200/50 bg-gradient-to-r from-purple-50/80 via-pink-50/60 to-rose-50/40 p-6 shadow-lg backdrop-blur-sm">
                <p className="mb-6 text-lg font-medium italic leading-relaxed text-purple-900">
                  {selectedSection.aiSuggestion.explanation}
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  {selectedSection.aiSuggestion.originalText !== "Missing" && (
                    <div className="space-y-3">
                      <h5 className="text-sm font-bold uppercase tracking-wide text-red-700">
                        Current Version:
                      </h5>
                      <div className="rounded-xl border border-red-300 bg-gradient-to-br from-red-100/90 to-rose-200/80 p-4 shadow-sm">
                        <p className="text-sm font-medium leading-relaxed text-red-800">
                          {selectedSection.aiSuggestion.originalText}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h5 className="text-sm font-bold uppercase tracking-wide text-green-700">
                      Improved Version:
                    </h5>
                    <div className="rounded-xl border border-green-300 bg-gradient-to-br from-green-100/90 to-emerald-200/80 p-4 shadow-sm">
                      <p className="text-sm font-semibold leading-relaxed text-green-800">
                        {selectedSection.aiSuggestion.improvedText}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          selectedSection.aiSuggestion!.improvedText,
                        )
                      }
                      className="mt-3 flex items-center text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
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

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={() => navigate(`/resume-scan-result/${scanId}`)}
              className="transform rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-700 hover:to-red-800 hover:shadow-red-500/25"
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5"
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
                <span>Back to All Sections</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionAnalysisDetail;
