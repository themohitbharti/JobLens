import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../store/store";
import { clearComparisonResult } from "../store/resumeCompareSlice";

const ResumeCompareResult: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { comparisonResult } = useSelector(
    (state: RootState) => state.resumeCompare,
  );
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // If no comparison result, redirect back to compare page
    if (!comparisonResult) {
      navigate("/compare-resumes");
    }
  }, [comparisonResult, navigate]);

  const handleNewBattle = () => {
    dispatch(clearComparisonResult());
    navigate("/compare-resumes");
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      // Simulate export functionality
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Here you would implement actual PDF export
      console.log("Exporting report...");
    } finally {
      setIsExporting(false);
    }
  };

  if (!comparisonResult) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-red-300 border-t-red-600"></div>
          <p className="text-gray-600">Loading comparison results...</p>
        </div>
      </div>
    );
  }

  const {
    winner,
    scores,
    keyDifferences,
    benchmarkComparison,
    sectionComparison,
    recommendations,
    detailedInsights,
  } = comparisonResult;

  // Determine which resume won and assign challenger/winner
  const isResume1Winner = winner.resume === "resume1";
  const winnerScore = isResume1Winner ? scores.resume1 : scores.resume2;

  const formatBenchmarkName = (benchmark: string) => {
    return benchmark
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-white">
              Resume Battle Arena
            </h1>
            <p className="text-gray-400">
              Compare resumes head-to-head and discover the ultimate winner
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleExportReport}
              disabled={isExporting}
              className="flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
            >
              {isExporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Exporting...
                </>
              ) : (
                <>
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export Report
                </>
              )}
            </button>
            <button
              onClick={handleNewBattle}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-500"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Battle
            </button>
          </div>
        </div>

        {/* Main Battle Result */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Challenger (Left) */}
          <div
            className={`rounded-xl border p-6 backdrop-blur-sm ${
              !isResume1Winner
                ? "border-red-800 bg-gradient-to-br from-red-900/50 to-red-800/30"
                : "border-green-800 bg-gradient-to-br from-green-900/50 to-green-800/30"
            }`}
          >
            <div className="mb-6 text-center">
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                  !isResume1Winner ? "bg-red-600" : "bg-green-600"
                }`}
              >
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-1 text-2xl font-bold text-white">
                {scores.resume1.fileName}
              </h3>
              <p
                className={`mb-4 ${!isResume1Winner ? "text-red-200" : "text-green-200"}`}
              >
                Rank #{scores.resume1.rank}
              </p>
              <div
                className={`mb-1 text-4xl font-bold ${!isResume1Winner ? "text-red-400" : "text-green-400"}`}
              >
                {scores.resume1.overallScore}%
              </div>
              <div
                className={`text-sm font-medium ${!isResume1Winner ? "text-red-300" : "text-green-300"}`}
              >
                {!isResume1Winner ? "Challenger" : "Champion"}
              </div>
            </div>

            {/* Resume 1 Advantages */}
            <div className="mb-6">
              <h4 className="mb-4 flex items-center text-lg font-bold text-white">
                <svg
                  className={`mr-2 h-5 w-5 ${!isResume1Winner ? "text-red-400" : "text-green-400"}`}
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
                Advantages
              </h4>
              <div className="space-y-2">
                {keyDifferences.resume1Advantages.length > 0 ? (
                  keyDifferences.resume1Advantages.map((advantage, index) => (
                    <div
                      key={index}
                      className={`rounded p-2 text-sm ${!isResume1Winner ? "bg-red-800/30 text-red-200" : "bg-green-800/30 text-green-200"}`}
                    >
                      • {advantage}
                    </div>
                  ))
                ) : (
                  <div className="text-sm italic text-gray-400">
                    No specific advantages identified
                  </div>
                )}
              </div>
            </div>

            {/* Strongest Areas */}
            <div>
              <h4 className="mb-4 flex items-center text-lg font-bold text-white">
                <svg
                  className={`mr-2 h-5 w-5 ${!isResume1Winner ? "text-red-400" : "text-green-400"}`}
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
                Strongest Areas
              </h4>
              <div className="space-y-2">
                {detailedInsights.strongestAreas.resume1.map((area, index) => (
                  <div
                    key={index}
                    className={`rounded p-2 text-sm capitalize ${!isResume1Winner ? "bg-red-800/30 text-red-200" : "bg-green-800/30 text-green-200"}`}
                  >
                    • {area.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* VS Battle Center */}
          <div className="flex flex-col items-center justify-center p-6">
            <div className="relative mb-6">
              <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-2xl font-bold text-white shadow-2xl">
                VS
              </div>
            </div>

            <div className="mb-6 text-center">
              <div className="mb-2 text-lg font-bold text-yellow-400">
                WINNER
              </div>
              <div className="mb-2 text-3xl font-bold text-white">
                {winnerScore.fileName}
              </div>
              <div className="text-yellow-300">Rank #{winnerScore.rank}</div>
            </div>

            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-500 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">
                    {winnerScore.overallScore}%
                  </div>
                  <div className="text-sm font-medium text-yellow-100">
                    Final Score
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 animate-ping rounded-full border-4 border-yellow-400/30"></div>
            </div>

            <div className="mt-6 rounded-lg bg-gray-800/50 p-4 backdrop-blur-sm">
              <h4 className="mb-2 font-semibold text-white">
                Battle Statistics
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Score Difference:</span>
                  <span className="text-white">
                    {winner.scoreDifference} points
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Processing Time:</span>
                  <span className="text-yellow-400">
                    {(comparisonResult.processingTime / 1000).toFixed(2)}s
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Winner (Right) */}
          <div
            className={`rounded-xl border p-6 backdrop-blur-sm ${
              isResume1Winner
                ? "border-red-800 bg-gradient-to-br from-red-900/50 to-red-800/30"
                : "border-green-800 bg-gradient-to-br from-green-900/50 to-green-800/30"
            }`}
          >
            <div className="mb-6 text-center">
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                  isResume1Winner ? "bg-red-600" : "bg-green-600"
                }`}
              >
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-1 text-2xl font-bold text-white">
                {scores.resume2.fileName}
              </h3>
              <p
                className={`mb-4 ${isResume1Winner ? "text-red-200" : "text-green-200"}`}
              >
                Rank #{scores.resume2.rank}
              </p>
              <div
                className={`mb-1 text-4xl font-bold ${isResume1Winner ? "text-red-400" : "text-green-400"}`}
              >
                {scores.resume2.overallScore}%
              </div>
              <div
                className={`text-sm font-medium ${isResume1Winner ? "text-red-300" : "text-green-300"}`}
              >
                {isResume1Winner ? "Challenger" : "Champion"}
              </div>
            </div>

            {/* Resume 2 Advantages */}
            <div className="mb-6">
              <h4 className="mb-4 flex items-center text-lg font-bold text-white">
                <svg
                  className={`mr-2 h-5 w-5 ${isResume1Winner ? "text-red-400" : "text-green-400"}`}
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
                Advantages
              </h4>
              <div className="space-y-2">
                {keyDifferences.resume2Advantages.length > 0 ? (
                  keyDifferences.resume2Advantages.map((advantage, index) => (
                    <div
                      key={index}
                      className={`rounded p-2 text-sm ${isResume1Winner ? "bg-red-800/30 text-red-200" : "bg-green-800/30 text-green-200"}`}
                    >
                      • {advantage}
                    </div>
                  ))
                ) : (
                  <div className="text-sm italic text-gray-400">
                    No specific advantages identified
                  </div>
                )}
              </div>
            </div>

            {/* Strongest Areas */}
            <div>
              <h4 className="mb-4 flex items-center text-lg font-bold text-white">
                <svg
                  className={`mr-2 h-5 w-5 ${isResume1Winner ? "text-red-400" : "text-green-400"}`}
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
                Strongest Areas
              </h4>
              <div className="space-y-2">
                {detailedInsights.strongestAreas.resume2.map((area, index) => (
                  <div
                    key={index}
                    className={`rounded p-2 text-sm capitalize ${isResume1Winner ? "bg-red-800/30 text-red-200" : "bg-green-800/30 text-green-200"}`}
                  >
                    • {area.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benchmark Comparison */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-6 flex items-center text-xl font-bold text-white">
              <svg
                className="mr-2 h-6 w-6 text-red-400"
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
              Benchmark Analysis
            </h3>

            <div className="space-y-4">
              {benchmarkComparison.filter((b) => b.difference !== 0).length >
              0 ? (
                benchmarkComparison
                  .filter((b) => b.difference !== 0)
                  .sort(
                    (a, b) => Math.abs(b.difference) - Math.abs(a.difference),
                  )
                  .slice(0, 8)
                  .map((benchmark, index) => (
                    <div key={index} className="rounded-lg bg-gray-700/50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium capitalize text-white">
                          {formatBenchmarkName(benchmark.benchmark)}
                        </h4>
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            benchmark.importance === "high"
                              ? "bg-red-600 text-white"
                              : benchmark.importance === "medium"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-600 text-white"
                          }`}
                        >
                          {benchmark.importance}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div
                            className={`font-bold ${benchmark.resume1.passed ? "text-green-400" : "text-red-400"}`}
                          >
                            {benchmark.resume1.score}/10
                          </div>
                          <div className="text-xs text-gray-400">
                            {scores.resume1.fileName}
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`font-bold ${benchmark.resume2.passed ? "text-green-400" : "text-red-400"}`}
                          >
                            {benchmark.resume2.score}/10
                          </div>
                          <div className="text-xs text-gray-400">
                            {scores.resume2.fileName}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="py-8 text-center text-gray-400">
                  <p>Both resumes performed equally across all benchmarks</p>
                </div>
              )}
            </div>
          </div>

          {/* Section Comparison */}
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-6 flex items-center text-xl font-bold text-white">
              <svg
                className="mr-2 h-6 w-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2h2a2 2 0 002-2z"
                />
              </svg>
              Section-by-Section Breakdown
            </h3>

            <div className="space-y-4">
              {sectionComparison.map((section, index) => (
                <div key={index} className="rounded-lg bg-gray-700/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium text-white">
                      {section.sectionName}
                    </h4>
                    {section.difference !== 0 && (
                      <span
                        className={`rounded px-2 py-1 text-sm ${
                          section.difference > 0
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {section.difference > 0 ? "+" : ""}
                        {section.difference} pts
                      </span>
                    )}
                  </div>

                  <div className="mb-3 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div
                        className={`text-lg font-bold ${
                          section.resume1.status === "better"
                            ? "text-green-400"
                            : section.resume1.status === "worse"
                              ? "text-red-400"
                              : "text-gray-300"
                        }`}
                      >
                        {section.resume1.score}/10
                      </div>
                      <div className="text-xs text-gray-400">
                        {section.resume1.hasSection
                          ? "✓ Has Section"
                          : "✗ Missing"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {scores.resume1.fileName}
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-lg font-bold ${
                          section.resume2.status === "better"
                            ? "text-green-400"
                            : section.resume2.status === "worse"
                              ? "text-red-400"
                              : "text-gray-300"
                        }`}
                      >
                        {section.resume2.score}/10
                      </div>
                      <div className="text-xs text-gray-400">
                        {section.resume2.hasSection
                          ? "✓ Has Section"
                          : "✗ Missing"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {scores.resume2.fileName}
                      </div>
                    </div>
                  </div>

                  {section.keyDifferences.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {section.keyDifferences.map((diff, idx) => (
                        <div
                          key={idx}
                          className="rounded bg-gray-600/50 p-2 text-sm text-gray-300"
                        >
                          • {diff}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Common Issues & Recommendations */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Common Weaknesses */}
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-4 flex items-center text-lg font-bold text-white">
              <svg
                className="mr-2 h-5 w-5 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              Common Issues
            </h3>
            <div className="space-y-2">
              {keyDifferences.commonWeaknesses.map((weakness, index) => (
                <div
                  key={index}
                  className="rounded bg-orange-800/30 p-2 text-sm text-orange-200"
                >
                  • {weakness}
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Opportunities */}
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-4 flex items-center text-lg font-bold text-white">
              <svg
                className="mr-2 h-5 w-5 text-blue-400"
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
              Opportunities
            </h3>
            <div className="space-y-2">
              {keyDifferences.improvementOpportunities.map(
                (opportunity, index) => (
                  <div
                    key={index}
                    className="rounded bg-blue-800/30 p-2 text-sm text-blue-200"
                  >
                    • {opportunity}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* General Advice */}
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
            <h3 className="mb-4 flex items-center text-lg font-bold text-white">
              <svg
                className="mr-2 h-5 w-5 text-purple-400"
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
              General Tips
            </h3>
            <div className="space-y-2">
              {recommendations.generalAdvice.map((advice, index) => (
                <div
                  key={index}
                  className="rounded bg-purple-800/30 p-2 text-sm text-purple-200"
                >
                  • {advice}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCompareResult;
