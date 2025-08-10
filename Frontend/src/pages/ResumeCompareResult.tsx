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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
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

  // Determine which resume won
  const isResume1Winner = winner.resume === "resume1";
  const winnerScore = isResume1Winner ? scores.resume1 : scores.resume2;

  const formatBenchmarkName = (benchmark: string) => {
    return benchmark
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              Resume Comparison Results
            </h1>
            <p className="text-gray-600">
              Detailed analysis and comparison of your resumes
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleExportReport}
              disabled={isExporting}
              className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 shadow-lg transition-all hover:border-red-300 hover:shadow-xl"
            >
              {isExporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
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
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-red-600 hover:to-pink-600 hover:shadow-xl"
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
              New Comparison
            </button>
          </div>
        </div>

        {/* Winner Announcement */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-2xl">
            <svg
              className="h-12 w-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3l14 9-14 9V3z"
              />
            </svg>
          </div>
          <div className="rounded-3xl border-2 border-yellow-200 bg-white p-8 shadow-2xl">
            <h2 className="mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-4xl font-bold text-transparent">
              🏆 Winner
            </h2>
            <p className="mb-4 text-2xl font-bold text-gray-800">
              {winnerScore.fileName}
            </p>
            <div className="mx-auto w-fit rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 shadow-lg">
              <span className="text-3xl font-bold text-white">
                {winnerScore.overallScore}%
              </span>
              <span className="ml-2 font-medium text-yellow-100">
                Final Score
              </span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-6">
              <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-100 to-pink-100 p-4">
                <div className="mb-1 text-2xl font-bold text-red-600">
                  {winner.scoreDifference}
                </div>
                <div className="text-sm font-medium text-red-800">
                  Point Difference
                </div>
              </div>
              <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-100 to-indigo-100 p-4">
                <div className="mb-1 text-2xl font-bold text-blue-600">
                  {(comparisonResult.processingTime / 1000).toFixed(1)}s
                </div>
                <div className="text-sm font-medium text-blue-800">
                  Processing Time
                </div>
              </div>
              <div className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 p-4">
                <div className="mb-1 text-2xl font-bold text-purple-600">
                  {comparisonResult.usedPreferences.targetIndustry || "General"}
                </div>
                <div className="text-sm font-medium text-purple-800">
                  Target Industry
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Head-to-Head Comparison */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Resume 1 */}
          <div
            className={`rounded-3xl border-2 p-8 shadow-xl transition-all ${
              isResume1Winner
                ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50"
                : "border-gray-300 bg-gradient-to-br from-gray-50 to-slate-100"
            }`}
          >
            <div className="mb-6 text-center">
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-lg ${
                  isResume1Winner
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-gray-400 to-gray-500"
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {scores.resume1.fileName}
              </h3>
              <p className="mb-4 font-medium text-gray-600">
                Rank #{scores.resume1.rank}
              </p>
              <div
                className={`mb-2 text-4xl font-bold ${
                  isResume1Winner ? "text-green-600" : "text-gray-500"
                }`}
              >
                {scores.resume1.overallScore}%
              </div>
              <div
                className={`inline-block rounded-full px-4 py-2 text-sm font-bold shadow-md ${
                  isResume1Winner
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700"
                }`}
              >
                {isResume1Winner ? "🏆 Winner" : "🥈 Second Place"}
              </div>
            </div>

            {/* Resume 1 Advantages */}
            <div className="mb-6">
              <h4 className="mb-3 flex items-center text-lg font-bold text-gray-900">
                <svg
                  className="mr-2 h-5 w-5 text-blue-500"
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
                Key Advantages
              </h4>
              <div className="space-y-2">
                {keyDifferences.resume1Advantages.length > 0 ? (
                  keyDifferences.resume1Advantages.map((advantage, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-100 to-cyan-50 p-3 text-sm font-medium text-blue-800"
                    >
                      • {advantage}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-100 to-gray-50 p-3 text-sm italic text-gray-600">
                    No specific advantages identified
                  </div>
                )}
              </div>
            </div>

            {/* Strongest Areas */}
            <div>
              <h4 className="mb-3 flex items-center text-lg font-bold text-gray-900">
                <svg
                  className="mr-2 h-5 w-5 text-green-500"
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
                    className="rounded-xl border border-green-200 bg-gradient-to-r from-green-100 to-emerald-50 p-3 text-sm font-medium capitalize text-green-800"
                  >
                    • {area.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resume 2 */}
          <div
            className={`rounded-3xl border-2 p-8 shadow-xl transition-all ${
              !isResume1Winner
                ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50"
                : "border-gray-300 bg-gradient-to-br from-gray-50 to-slate-100"
            }`}
          >
            <div className="mb-6 text-center">
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-lg ${
                  !isResume1Winner
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-gray-400 to-gray-500"
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {scores.resume2.fileName}
              </h3>
              <p className="mb-4 font-medium text-gray-600">
                Rank #{scores.resume2.rank}
              </p>
              <div
                className={`mb-2 text-4xl font-bold ${
                  !isResume1Winner ? "text-green-600" : "text-gray-500"
                }`}
              >
                {scores.resume2.overallScore}%
              </div>
              <div
                className={`inline-block rounded-full px-4 py-2 text-sm font-bold shadow-md ${
                  !isResume1Winner
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700"
                }`}
              >
                {!isResume1Winner ? "🏆 Winner" : "🥈 Second Place"}
              </div>
            </div>

            {/* Resume 2 Advantages */}
            <div className="mb-6">
              <h4 className="mb-3 flex items-center text-lg font-bold text-gray-900">
                <svg
                  className="mr-2 h-5 w-5 text-blue-500"
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
                Key Advantages
              </h4>
              <div className="space-y-2">
                {keyDifferences.resume2Advantages.length > 0 ? (
                  keyDifferences.resume2Advantages.map((advantage, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-100 to-cyan-50 p-3 text-sm font-medium text-blue-800"
                    >
                      • {advantage}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-100 to-gray-50 p-3 text-sm italic text-gray-600">
                    No specific advantages identified
                  </div>
                )}
              </div>
            </div>

            {/* Strongest Areas */}
            <div>
              <h4 className="mb-3 flex items-center text-lg font-bold text-gray-900">
                <svg
                  className="mr-2 h-5 w-5 text-green-500"
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
                    className="rounded-xl border border-green-200 bg-gradient-to-r from-green-100 to-emerald-50 p-3 text-sm font-medium capitalize text-green-800"
                  >
                    • {area.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section-by-Section Comparison - Full Width */}
        <div className="mb-8 rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-xl">
          <h3 className="mb-8 flex items-center justify-center text-2xl font-bold text-gray-900">
            <svg
              className="mr-3 h-7 w-7 text-purple-500"
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
            Section-by-Section Analysis
          </h3>

          <div className="space-y-6">
            {sectionComparison.map((section, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 p-6 shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-xl font-bold text-gray-900">
                    {section.sectionName}
                  </h4>
                  {section.difference !== 0 && (
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-bold shadow-md ${
                        section.difference > 0
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                      }`}
                    >
                      {section.difference > 0 ? "+" : ""}
                      {section.difference} pts difference
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Resume 1 */}
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 text-center">
                      <h5 className="mb-2 font-bold text-gray-800">
                        {scores.resume1.fileName}
                      </h5>
                      <div
                        className={`mb-2 text-3xl font-bold ${
                          section.resume1.status === "better"
                            ? "text-green-600"
                            : section.resume1.status === "worse"
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {section.resume1.score}/10
                      </div>
                      <div
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                          section.resume1.status === "better"
                            ? "bg-green-100 text-green-800"
                            : section.resume1.status === "worse"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {section.resume1.status}
                      </div>
                      <div
                        className={`mt-2 text-sm font-medium ${
                          section.resume1.hasSection
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {section.resume1.hasSection
                          ? "✓ Section Present"
                          : "✗ Section Missing"}
                      </div>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          section.resume1.score >= 8
                            ? "bg-gradient-to-r from-green-500 to-emerald-400"
                            : section.resume1.score >= 6
                              ? "bg-gradient-to-r from-yellow-500 to-orange-400"
                              : "bg-gradient-to-r from-red-500 to-pink-400"
                        }`}
                        style={{
                          width: `${(section.resume1.score / 10) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Resume 2 */}
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 text-center">
                      <h5 className="mb-2 font-bold text-gray-800">
                        {scores.resume2.fileName}
                      </h5>
                      <div
                        className={`mb-2 text-3xl font-bold ${
                          section.resume2.status === "better"
                            ? "text-green-600"
                            : section.resume2.status === "worse"
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {section.resume2.score}/10
                      </div>
                      <div
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                          section.resume2.status === "better"
                            ? "bg-green-100 text-green-800"
                            : section.resume2.status === "worse"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {section.resume2.status}
                      </div>
                      <div
                        className={`mt-2 text-sm font-medium ${
                          section.resume2.hasSection
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {section.resume2.hasSection
                          ? "✓ Section Present"
                          : "✗ Section Missing"}
                      </div>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          section.resume2.score >= 8
                            ? "bg-gradient-to-r from-green-500 to-emerald-400"
                            : section.resume2.score >= 6
                              ? "bg-gradient-to-r from-yellow-500 to-orange-400"
                              : "bg-gradient-to-r from-red-500 to-pink-400"
                        }`}
                        style={{
                          width: `${(section.resume2.score / 10) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Key Differences */}
                {section.keyDifferences.length > 0 && (
                  <div className="mt-6">
                    <h6 className="mb-3 font-semibold text-gray-800">
                      Key Differences:
                    </h6>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {section.keyDifferences.map((diff, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-100 to-cyan-50 p-3 text-sm font-medium text-blue-800"
                        >
                          • {diff}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benchmark Comparison - Full Width */}
        <div className="mb-8 rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-xl">
          <h3 className="mb-8 flex items-center justify-center text-2xl font-bold text-gray-900">
            <svg
              className="mr-3 h-7 w-7 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Benchmark Analysis
          </h3>

          <div className="space-y-6">
            {benchmarkComparison
              .filter((b) => b.difference !== 0 || b.importance === "high")
              .sort((a, b) => {
                if (a.importance === "high" && b.importance !== "high")
                  return -1;
                if (b.importance === "high" && a.importance !== "high")
                  return 1;
                return Math.abs(b.difference) - Math.abs(a.difference);
              })
              .slice(0, 10)
              .map((benchmark, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 p-6 shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-xl font-bold capitalize text-gray-900">
                      {formatBenchmarkName(benchmark.benchmark)}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          benchmark.importance === "high"
                            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                            : benchmark.importance === "medium"
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                              : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                        }`}
                      >
                        {benchmark.importance} priority
                      </span>
                      {benchmark.difference !== 0 && (
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-bold ${
                            benchmark.difference > 0
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          }`}
                        >
                          {benchmark.difference > 0 ? "+" : ""}
                          {benchmark.difference} pts
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Resume 1 Benchmark */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="text-center">
                        <h5 className="mb-3 font-bold text-gray-800">
                          {scores.resume1.fileName}
                        </h5>
                        <div
                          className={`mb-2 text-3xl font-bold ${
                            benchmark.resume1.passed
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {benchmark.resume1.score}/10
                        </div>
                        <div
                          className={`inline-block rounded-full px-4 py-2 text-sm font-bold shadow-md ${
                            benchmark.resume1.passed
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          }`}
                        >
                          {benchmark.resume1.passed ? "✓ Passed" : "✗ Failed"}
                        </div>
                      </div>
                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full transition-all duration-1000 ${
                            benchmark.resume1.passed
                              ? "bg-gradient-to-r from-green-500 to-emerald-400"
                              : "bg-gradient-to-r from-red-500 to-pink-400"
                          }`}
                          style={{
                            width: `${(benchmark.resume1.score / 10) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Resume 2 Benchmark */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="text-center">
                        <h5 className="mb-3 font-bold text-gray-800">
                          {scores.resume2.fileName}
                        </h5>
                        <div
                          className={`mb-2 text-3xl font-bold ${
                            benchmark.resume2.passed
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {benchmark.resume2.score}/10
                        </div>
                        <div
                          className={`inline-block rounded-full px-4 py-2 text-sm font-bold shadow-md ${
                            benchmark.resume2.passed
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          }`}
                        >
                          {benchmark.resume2.passed ? "✓ Passed" : "✗ Failed"}
                        </div>
                      </div>
                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full transition-all duration-1000 ${
                            benchmark.resume2.passed
                              ? "bg-gradient-to-r from-green-500 to-emerald-400"
                              : "bg-gradient-to-r from-red-500 to-pink-400"
                          }`}
                          style={{
                            width: `${(benchmark.resume2.score / 10) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recommendations - Three Column Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Common Issues */}
          <div className="rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 p-8 shadow-xl">
            <h3 className="mb-6 flex items-center text-xl font-bold text-orange-800">
              <svg
                className="mr-2 h-6 w-6 text-orange-500"
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
            <div className="space-y-3">
              {keyDifferences.commonWeaknesses.map((weakness, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-orange-300 bg-gradient-to-r from-orange-100 to-yellow-100 p-4 text-sm font-medium text-orange-800 shadow-sm"
                >
                  • {weakness}
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Opportunities */}
          <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-xl">
            <h3 className="mb-6 flex items-center text-xl font-bold text-blue-800">
              <svg
                className="mr-2 h-6 w-6 text-blue-500"
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
            <div className="space-y-3">
              {keyDifferences.improvementOpportunities.map(
                (opportunity, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-blue-300 bg-gradient-to-r from-blue-100 to-indigo-100 p-4 text-sm font-medium text-blue-800 shadow-sm"
                  >
                    • {opportunity}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* General Advice */}
          <div className="rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-xl">
            <h3 className="mb-6 flex items-center text-xl font-bold text-purple-800">
              <svg
                className="mr-2 h-6 w-6 text-purple-500"
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
            <div className="space-y-3">
              {recommendations.generalAdvice.map((advice, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-purple-300 bg-gradient-to-r from-purple-100 to-pink-100 p-4 text-sm font-medium text-purple-800 shadow-sm"
                >
                  • {advice}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specific Recommendations for Each Resume */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Resume 1 Recommendations */}
          <div className="rounded-3xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-8 shadow-xl">
            <h3 className="mb-6 text-xl font-bold text-red-800">
              {scores.resume1.fileName} - Specific Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.forResume1.map((rec, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-red-300 bg-gradient-to-r from-red-100 to-pink-100 p-4 text-sm font-medium text-red-800 shadow-sm"
                >
                  • {rec}
                </div>
              ))}
            </div>
          </div>

          {/* Resume 2 Recommendations */}
          <div className="rounded-3xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-xl">
            <h3 className="mb-6 text-xl font-bold text-green-800">
              {scores.resume2.fileName} - Specific Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.forResume2.map((rec, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-green-300 bg-gradient-to-r from-green-100 to-emerald-100 p-4 text-sm font-medium text-green-800 shadow-sm"
                >
                  • {rec}
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
