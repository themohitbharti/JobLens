import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../store/store";
import {
  clearComparisonResult,
  setComparisonResult,
} from "../store/linkedinCompareSlice";

const LinkedinCompareResult: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { comparisonResult } = useSelector(
    (state: RootState) => state.linkedinCompare,
  );
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Only redirect if there's no comparison result and we're not coming from a direct navigation
    if (!comparisonResult) {
      // Check if we have comparison data in sessionStorage as a backup
      const storedResult = sessionStorage.getItem("linkedinComparisonResult");
      if (storedResult) {
        try {
          const parsedResult = JSON.parse(storedResult);
          dispatch(setComparisonResult(parsedResult));
          return;
        } catch (error) {
          console.error("Failed to parse stored comparison result:", error);
        }
      }

      // Only redirect if we're certain there's no valid data
      const timer = setTimeout(() => {
        navigate("/compare-linkedin");
      }, 100); // Small delay to allow for any pending state updates

      return () => clearTimeout(timer);
    }
  }, [comparisonResult, navigate, dispatch]);

  // Store comparison result in sessionStorage whenever it changes
  useEffect(() => {
    if (comparisonResult) {
      sessionStorage.setItem(
        "linkedinComparisonResult",
        JSON.stringify(comparisonResult),
      );
    }
  }, [comparisonResult]);

  const handleNewComparison = () => {
    dispatch(clearComparisonResult());
    sessionStorage.removeItem("linkedinComparisonResult"); // Clean up stored data
    navigate("/compare-linkedin");
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      // Simulate export functionality
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create and download a simple text report
      const reportContent = `
LinkedIn Profile Comparison Report
=================================

Winner: ${comparisonResult?.winner.profile}
Overall Score Difference: ${comparisonResult?.winner.scoreDifference}

Profile 1 Score: ${comparisonResult?.scores.profile1.overallScore}/10
Profile 2 Score: ${comparisonResult?.scores.profile2.overallScore}/10

Generated on: ${new Date().toLocaleDateString()}
      `.trim();

      const blob = new Blob([reportContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "linkedin-comparison-report.txt";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Circular Progress Component
  const CircularProgress: React.FC<{
    percentage: number;
    size: number;
    strokeWidth: number;
    color: string;
    label: string;
  }> = ({ percentage, size, strokeWidth, color, label }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const colors = {
      red: "stroke-red-500",
      blue: "stroke-blue-500",
      green: "stroke-green-500",
      purple: "stroke-purple-500",
      indigo: "stroke-indigo-500", // Add this line
    };

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 transform">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${colors[color as keyof typeof colors]} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">{label}</span>
        </div>
      </div>
    );
  };

  // Comparison Bar Component
  const ComparisonBar: React.FC<{
    leftValue: number;
    rightValue: number;
    leftLabel: string;
    rightLabel: string;
  }> = ({ leftValue, rightValue, leftLabel, rightLabel }) => {
    const leftPercentage = leftValue * 100;
    const rightPercentage = rightValue * 100;

    return (
      <div className="w-full">
        <div className="mb-2 flex justify-between text-sm font-medium text-gray-600">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
        <div className="flex h-4 overflow-hidden rounded-full bg-gray-200">
          <div
            className="bg-gradient-to-r from-red-400 to-pink-400"
            style={{ width: `${leftPercentage}%` }}
          />
          <div
            className="bg-gradient-to-r from-blue-400 to-cyan-400"
            style={{ width: `${rightPercentage}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{leftValue}/10</span>
          <span>{rightValue}/10</span>
        </div>
      </div>
    );
  };

  // Gradient Icon Component
  const GradientIcon: React.FC<{
    gradient: string;
    children: React.ReactNode;
  }> = ({ gradient, children }) => {
    const gradients = {
      red: "from-red-500 to-pink-500",
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
      purple: "from-purple-500 to-indigo-500",
      orange: "from-orange-500 to-yellow-500",
      indigo: "from-indigo-500 to-purple-500", // Add this line
    };

    return (
      <div
        className={`rounded-2xl bg-gradient-to-br p-3 ${gradients[gradient as keyof typeof gradients]} flex transform items-center justify-center shadow-xl transition-all duration-300 hover:scale-105`}
      >
        <div className="flex items-center justify-center text-white">
          {children}
        </div>
      </div>
    );
  };

  if (!comparisonResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative mx-auto mb-8 h-24 w-24">
            <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-75"></div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
              <svg
                className="h-10 w-10 animate-spin text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
          <p className="text-xl font-medium text-gray-600">
            Analyzing comparison results...
          </p>
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

  // Determine which profile won
  const isProfile1Winner = winner.profile === "profile1";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="blur-1xl absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-100 opacity-10" />
        <div className="blur-1xl absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-100 opacity-10" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-100 opacity-10 blur-3xl" />
      </div>

      {/* Elegant Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 0.5px, transparent 0.5px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0.5px, transparent 0.5px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative z-10 px-6 py-8">
        {/* Header - consistent with other pages */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/compare-linkedin")}
            className="group mb-8 flex items-center text-blue-600 transition-all duration-200 hover:text-blue-700"
          >
            <svg
              className="mr-2 h-5 w-5 transform transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Compare
          </button>

          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-75 blur-lg"></div>
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-2xl">
                  <svg
                    className="h-10 w-10 text-white"
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
                </div>
              </div>
            </div>

            <h1 className="mb-4 text-5xl font-black text-gray-800 lg:text-6xl">
              LinkedIn{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(217 91% 60%), hsl(237 84% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Comparison
              </span>{" "}
              Results
            </h1>

            <p className="mb-8 text-xl text-gray-600">
              AI-powered LinkedIn profile comparison analysis complete
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6">
              <button
                onClick={handleExportReport}
                disabled={isExporting}
                className="group relative transform rounded-2xl border border-gray-200 bg-white px-8 py-4 shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-xl"
              >
                <div className="flex items-center gap-3 font-medium text-gray-700">
                  {isExporting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <GradientIcon gradient="blue">
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
                      </GradientIcon>
                      Export Comparison Report
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={handleNewComparison}
                className="group relative transform rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-4 shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-3 font-medium text-white">
                  <GradientIcon gradient="purple">
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </GradientIcon>
                  New Comparison
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Winner Announcement Card */}
        <div className="relative mb-16">
          <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-white/95 via-blue-50/90 to-indigo-100/80 p-12 shadow-2xl backdrop-blur-xl">
            <div className="text-center">
              {/* Winner Crown Animation */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400/30 to-indigo-400/30 blur-2xl"></div>
                  <div className="relative flex h-32 w-32 animate-bounce items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-2xl">
                    <svg
                      className="h-16 w-16 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>

              <h2 className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl font-black text-transparent">
                TOP PERFORMER
              </h2>

              <div className="mb-8 space-y-4">
                <h3 className="text-4xl font-bold text-gray-800">
                  {isProfile1Winner
                    ? scores.profile1.fileName
                    : scores.profile2.fileName}
                </h3>
                <div className="flex justify-center">
                  <CircularProgress
                    percentage={
                      isProfile1Winner
                        ? scores.profile1.overallScore * 10
                        : scores.profile2.overallScore * 10
                    }
                    size={160}
                    strokeWidth={12}
                    label={`${isProfile1Winner ? scores.profile1.overallScore : scores.profile2.overallScore}/100`}
                    color="blue"
                  />
                </div>
              </div>

              {/* Comparison Stats */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-lg">
                  <div className="mb-4 flex justify-center">
                    <GradientIcon gradient="blue">
                      <svg
                        className="h-6 w-6"
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
                    </GradientIcon>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      +{winner.scoreDifference}
                    </div>
                    <div className="text-sm font-medium text-blue-700">
                      Point Advantage
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-100 p-6 shadow-lg">
                  <div className="mb-4 flex justify-center">
                    <GradientIcon gradient="purple">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </GradientIcon>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {(comparisonResult.processingTime / 1000).toFixed(1)}s
                    </div>
                    <div className="text-sm font-medium text-purple-700">
                      Analysis Duration
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-6 shadow-lg">
                  <div className="mb-4 flex justify-center">
                    <GradientIcon gradient="green">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </GradientIcon>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {comparisonResult.usedPreferences.targetIndustry ||
                        "General"}
                    </div>
                    <div className="text-sm font-medium text-green-700">
                      Target Industry
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 p-6 shadow-lg">
                <div className="mb-4 flex justify-center">
                  <GradientIcon gradient="indigo">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm8 0V3a2 2 0 00-2-2h-4a2 2 0 00-2 2v2h8zm0 2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2V7z"
                      />
                    </svg>
                  </GradientIcon>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-lg font-bold text-gray-700">
                    Winner Analysis
                  </div>
                  <p className="text-sm text-indigo-700">
                    {winner.reason ||
                      `Achieved ${winner.scoreDifference} point advantage with superior professional presentation across multiple LinkedIn sections`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Profile Analysis */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Profile 1 */}
          <div
            className={`relative rounded-3xl border-2 p-8 shadow-2xl transition-all duration-500 ${
              isProfile1Winner
                ? "border-blue-300 bg-gradient-to-br from-blue-50/90 to-cyan-100/70"
                : "border-gray-300 bg-gradient-to-br from-gray-50/90 to-slate-100/70"
            }`}
          >
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <GradientIcon gradient={isProfile1Winner ? "blue" : "purple"}>
                    <svg
                      className="h-8 w-8"
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
                  </GradientIcon>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800">
                  {scores.profile1.fileName}
                </h3>
                <div className="mb-6 flex justify-center">
                  <CircularProgress
                    percentage={(scores.profile1.overallScore / 10) * 100}
                    size={150}
                    strokeWidth={12}
                    label={`${scores.profile1.overallScore}/100`}
                    color={isProfile1Winner ? "blue" : "purple"}
                  />
                </div>
                <div
                  className={`inline-block rounded-full px-6 py-2 text-lg font-bold ${
                    isProfile1Winner
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                  }`}
                >
                  {isProfile1Winner ? "🏆 WINNER" : "🥈 RUNNER-UP"}
                </div>
              </div>

              {/* Key Strengths */}
              <div className="space-y-4">
                <h4 className="flex items-center text-lg font-bold text-gray-800">
                  <div className="mr-3 flex justify-center">
                    <GradientIcon gradient="orange">
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </GradientIcon>
                  </div>
                  <span>Key Strengths</span>
                </h4>
                <div className="space-y-2">
                  {keyDifferences.profile1Advantages.length > 0 ? (
                    keyDifferences.profile1Advantages.map(
                      (advantage, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-100 p-3 text-sm font-medium text-orange-800 shadow-sm"
                        >
                          ⚡ {advantage}
                        </div>
                      ),
                    )
                  ) : (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm italic text-gray-500">
                      No specific advantages identified
                    </div>
                  )}
                </div>
              </div>

              {/* Strong Areas */}
              <div className="space-y-4">
                <h4 className="flex items-center text-lg font-bold text-gray-800">
                  <div className="mr-3 flex justify-center">
                    <GradientIcon gradient="green">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </GradientIcon>
                  </div>
                  <span>Strong Areas</span>
                </h4>
                <div className="space-y-2">
                  {detailedInsights.strongestAreas.profile1.map(
                    (area, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-100 p-3 text-sm font-medium capitalize text-green-800 shadow-sm"
                      >
                        🔥 {area.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile 2 */}
          <div
            className={`relative rounded-3xl border-2 p-8 shadow-2xl transition-all duration-500 ${
              !isProfile1Winner
                ? "border-indigo-300 bg-gradient-to-br from-indigo-50/90 to-purple-100/70"
                : "border-gray-300 bg-gradient-to-br from-gray-50/90 to-slate-100/70"
            }`}
          >
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <GradientIcon
                    gradient={!isProfile1Winner ? "indigo" : "purple"}
                  >
                    <svg
                      className="h-8 w-8"
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
                  </GradientIcon>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800">
                  {scores.profile2.fileName}
                </h3>
                <div className="mb-6 flex justify-center">
                  <CircularProgress
                    percentage={(scores.profile2.overallScore / 10) * 100}
                    size={150}
                    strokeWidth={12}
                    label={`${scores.profile2.overallScore}/100`}
                    color={!isProfile1Winner ? "indigo" : "purple"}
                  />
                </div>
                <div
                  className={`inline-block rounded-full px-6 py-2 text-lg font-bold ${
                    !isProfile1Winner
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  }`}
                >
                  {!isProfile1Winner ? "🏆 WINNER" : "🥈 RUNNER-UP"}
                </div>
              </div>

              {/* Key Strengths */}
              <div className="space-y-4">
                <h4 className="flex items-center text-lg font-bold text-gray-800">
                  <div className="mr-3 flex justify-center">
                    <GradientIcon gradient="orange">
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </GradientIcon>
                  </div>
                  <span>Key Strengths</span>
                </h4>
                <div className="space-y-2">
                  {keyDifferences.profile2Advantages.length > 0 ? (
                    keyDifferences.profile2Advantages.map(
                      (advantage, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-100 p-3 text-sm font-medium text-orange-800 shadow-sm"
                        >
                          ⚡ {advantage}
                        </div>
                      ),
                    )
                  ) : (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm italic text-gray-500">
                      No specific advantages identified
                    </div>
                  )}
                </div>
              </div>

              {/* Strong Areas */}
              <div className="space-y-4">
                <h4 className="flex items-center text-lg font-bold text-gray-800">
                  <div className="mr-3 flex justify-center">
                    <GradientIcon gradient="green">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </GradientIcon>
                  </div>
                  <span>Strong Areas</span>
                </h4>
                <div className="space-y-2">
                  {detailedInsights.strongestAreas.profile2.map(
                    (area, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-100 p-3 text-sm font-medium capitalize text-green-800 shadow-sm"
                      >
                        🔥 {area.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section-by-Section Analysis */}
        <div className="mb-16">
          <div className="mb-8 text-center">
            <h3 className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-black text-transparent">
              DETAILED SECTION ANALYSIS
            </h3>
            <p className="text-xl text-gray-600">
              Comprehensive breakdown by LinkedIn profile sections
            </p>
          </div>

          <div className="space-y-8">
            {sectionComparison.map((section, index) => (
              <div
                key={index}
                className="relative rounded-3xl border border-blue-200 bg-gradient-to-br from-white/95 via-blue-50/90 to-indigo-100/70 p-8 shadow-2xl"
              >
                <div className="relative">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex justify-center">
                        <GradientIcon gradient="blue">
                          <svg
                            className="h-6 w-6"
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
                        </GradientIcon>
                      </div>
                      <h4 className="text-2xl font-bold capitalize text-gray-800">
                        {section.sectionName.replace(/([A-Z])/g, " $1").trim()}
                      </h4>
                    </div>
                    {section.difference !== 0 && (
                      <div
                        className={`rounded-full px-4 py-2 text-sm font-bold ${
                          section.difference > 0
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                        }`}
                      >
                        {section.difference > 0 ? "+" : ""}
                        {section.difference} pts difference
                      </div>
                    )}
                  </div>

                  {/* Score Comparison Bar */}
                  <div className="mb-6">
                    <ComparisonBar
                      leftValue={section.profile1.score}
                      rightValue={section.profile2.score}
                      leftLabel={scores.profile1.fileName}
                      rightLabel={scores.profile2.fileName}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Profile 1 Section Details */}
                    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-100 p-6 shadow-lg">
                      <div className="mb-4 text-center">
                        <h5 className="mb-2 text-lg font-bold text-gray-800">
                          {scores.profile1.fileName}
                        </h5>
                        <div className="mb-3 flex justify-center">
                          <CircularProgress
                            percentage={(section.profile1.score / 10) * 100}
                            size={100}
                            strokeWidth={8}
                            label={`${section.profile1.score}/10`}
                            color={
                              section.profile1.status === "better"
                                ? "green"
                                : section.profile1.status === "worse"
                                  ? "red"
                                  : "blue"
                            }
                          />
                        </div>
                        <div
                          className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${
                            section.profile1.status === "better"
                              ? "border border-green-200 bg-green-100 text-green-800"
                              : section.profile1.status === "worse"
                                ? "border border-red-200 bg-red-100 text-red-800"
                                : "border border-blue-200 bg-blue-100 text-blue-800"
                          }`}
                        >
                          {section.profile1.status.toUpperCase()}
                        </div>
                        <div
                          className={`mt-2 text-sm font-medium ${
                            section.profile1.hasSection
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {section.profile1.hasSection
                            ? "✓ Section Present"
                            : "✗ Section Missing"}
                        </div>
                      </div>
                    </div>

                    {/* Profile 2 Section Details */}
                    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 p-6 shadow-lg">
                      <div className="mb-4 text-center">
                        <h5 className="mb-2 text-lg font-bold text-gray-800">
                          {scores.profile2.fileName}
                        </h5>
                        <div className="mb-3 flex justify-center">
                          <CircularProgress
                            percentage={(section.profile2.score / 10) * 100}
                            size={100}
                            strokeWidth={8}
                            label={`${section.profile2.score}/10`}
                            color={
                              section.profile2.status === "better"
                                ? "green"
                                : section.profile2.status === "worse"
                                  ? "red"
                                  : "blue"
                            }
                          />
                        </div>
                        <div
                          className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${
                            section.profile2.status === "better"
                              ? "border border-green-200 bg-green-100 text-green-800"
                              : section.profile2.status === "worse"
                                ? "border border-red-200 bg-red-100 text-red-800"
                                : "border border-blue-200 bg-blue-100 text-blue-800"
                          }`}
                        >
                          {section.profile2.status.toUpperCase()}
                        </div>
                        <div
                          className={`mt-2 text-sm font-medium ${
                            section.profile2.hasSection
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {section.profile2.hasSection
                            ? "✓ Section Present"
                            : "✗ Section Missing"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Differences */}
                  {section.keyDifferences.length > 0 && (
                    <div className="mt-6">
                      <h6 className="mb-3 flex items-center text-lg font-bold text-gray-800">
                        <div className="mr-3 flex justify-center">
                          <GradientIcon gradient="orange">
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
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </GradientIcon>
                        </div>
                        <span>Notable Differences</span>
                      </h6>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {section.keyDifferences.map((diff, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-100 p-3 text-sm font-medium text-orange-800 shadow-sm"
                          >
                            📝 {diff}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmark Analysis */}
        <div className="mb-16">
          <div className="mb-8 text-center">
            <h3 className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-black text-transparent">
              INDUSTRY BENCHMARK ANALYSIS
            </h3>
            <p className="text-xl text-gray-600">
              Performance against industry standards
            </p>
          </div>

          <div className="space-y-8">
            {benchmarkComparison
              .filter((b) => b.difference !== 0 || b.importance === "high")
              .sort((a, b) => {
                const importanceOrder = { high: 3, medium: 2, low: 1 };
                return (
                  importanceOrder[
                    b.importance as keyof typeof importanceOrder
                  ] -
                  importanceOrder[a.importance as keyof typeof importanceOrder]
                );
              })
              .map((benchmark, index) => (
                <div
                  key={index}
                  className={`relative rounded-3xl border p-8 shadow-2xl ${
                    benchmark.importance === "high"
                      ? "border-red-200 bg-gradient-to-br from-white/95 via-red-50/90 to-pink-100/70"
                      : benchmark.importance === "medium"
                        ? "border-yellow-200 bg-gradient-to-br from-white/95 via-yellow-50/90 to-orange-100/70"
                        : "border-green-200 bg-gradient-to-br from-white/95 via-green-50/90 to-emerald-100/70"
                  }`}
                >
                  <div className="relative">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex justify-center">
                          <GradientIcon
                            gradient={
                              benchmark.importance === "high"
                                ? "red"
                                : benchmark.importance === "medium"
                                  ? "orange"
                                  : "green"
                            }
                          >
                            <svg
                              className="h-6 w-6"
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
                          </GradientIcon>
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold capitalize text-gray-800">
                            {benchmark.benchmark
                              .replace(/([A-Z])/g, " $1")
                              .trim()}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-bold uppercase tracking-wide ${
                                benchmark.importance === "high"
                                  ? "bg-red-100 text-red-800"
                                  : benchmark.importance === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {benchmark.importance} Priority
                            </span>
                          </div>
                        </div>
                      </div>
                      {benchmark.difference !== 0 && (
                        <div
                          className={`rounded-full px-4 py-2 text-sm font-bold ${
                            benchmark.difference > 0
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          }`}
                        >
                          {benchmark.difference > 0 ? "+" : ""}
                          {benchmark.difference} pts difference
                        </div>
                      )}
                    </div>

                    {/* Benchmark Score Comparison */}
                    <div className="mb-6">
                      <ComparisonBar
                        leftValue={benchmark.profile1.score}
                        rightValue={benchmark.profile2.score}
                        leftLabel={`${scores.profile1.fileName} (${benchmark.profile1.passed ? "PASSED" : "FAILED"})`}
                        rightLabel={`${scores.profile2.fileName} (${benchmark.profile2.passed ? "PASSED" : "FAILED"})`}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* Profile 1 Benchmark */}
                      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-100 p-6 text-center shadow-lg">
                        <h5 className="mb-3 text-lg font-bold text-gray-800">
                          {scores.profile1.fileName}
                        </h5>
                        <div className="mb-4 flex justify-center">
                          <CircularProgress
                            percentage={(benchmark.profile1.score / 10) * 100}
                            size={120}
                            strokeWidth={10}
                            label={`${benchmark.profile1.score}/10`}
                            color={benchmark.profile1.passed ? "green" : "red"}
                          />
                        </div>
                        <div
                          className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${
                            benchmark.profile1.passed
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          }`}
                        >
                          {benchmark.profile1.passed ? "✓ PASSED" : "✗ FAILED"}
                        </div>
                      </div>

                      {/* Profile 2 Benchmark */}
                      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 p-6 text-center shadow-lg">
                        <h5 className="mb-3 text-lg font-bold text-gray-800">
                          {scores.profile2.fileName}
                        </h5>
                        <div className="mb-4 flex justify-center">
                          <CircularProgress
                            percentage={(benchmark.profile2.score / 10) * 100}
                            size={120}
                            strokeWidth={10}
                            label={`${benchmark.profile2.score}/10`}
                            color={benchmark.profile2.passed ? "green" : "red"}
                          />
                        </div>
                        <div
                          className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${
                            benchmark.profile2.passed
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          }`}
                        >
                          {benchmark.profile2.passed ? "✓ PASSED" : "✗ FAILED"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Enhancement Ideas */}
          <div className="relative rounded-3xl border border-blue-200 bg-gradient-to-br from-white/95 via-blue-50/90 to-cyan-100/70 p-8 shadow-2xl">
            <div className="relative">
              <div className="mb-6 text-center">
                <div className="mb-4 flex justify-center">
                  <GradientIcon gradient="blue">
                    <svg
                      className="h-8 w-8"
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
                  </GradientIcon>
                </div>
                <h3 className="text-2xl font-bold text-blue-600">
                  ENHANCEMENT IDEAS
                </h3>
                <p className="text-blue-700">
                  Strategic improvement opportunities
                </p>
              </div>
              <div className="space-y-3">
                {keyDifferences.improvementOpportunities.map(
                  (opportunity, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-100 p-4 text-sm font-medium text-blue-800 shadow-sm"
                    >
                      💡 {opportunity}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="relative rounded-3xl border border-green-200 bg-gradient-to-br from-white/95 via-green-50/90 to-emerald-100/70 p-8 shadow-2xl">
            <div className="relative">
              <div className="mb-6 text-center">
                <div className="mb-4 flex justify-center">
                  <GradientIcon gradient="green">
                    <svg
                      className="h-8 w-8"
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
                  </GradientIcon>
                </div>
                <h3 className="text-2xl font-bold text-green-600">
                  BEST PRACTICES
                </h3>
                <p className="text-green-700">Industry standards to follow</p>
              </div>
              <div className="space-y-3">
                {(keyDifferences.bestPractices || []).map((practice, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-100 p-4 text-sm font-medium text-green-800 shadow-sm"
                  >
                    ✅ {practice}
                  </div>
                ))}
                {(!keyDifferences.bestPractices ||
                  keyDifferences.bestPractices.length === 0) && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm italic text-gray-500">
                    General LinkedIn best practices apply
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="relative rounded-3xl border border-orange-200 bg-gradient-to-br from-white/95 via-orange-50/90 to-yellow-100/70 p-8 shadow-2xl">
            <div className="relative">
              <div className="mb-6 text-center">
                <div className="mb-4 flex justify-center">
                  <GradientIcon gradient="orange">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </GradientIcon>
                </div>
                <h3 className="text-2xl font-bold text-orange-600">
                  IMPROVEMENT AREAS
                </h3>
                <p className="text-orange-700">Focus areas for enhancement</p>
              </div>
              <div className="space-y-3">
                {(detailedInsights.improvementAreas || []).map(
                  (area, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-100 p-4 text-sm font-medium text-orange-800 shadow-sm"
                    >
                      🎯 {area}
                    </div>
                  ),
                )}
                {(!detailedInsights.improvementAreas ||
                  detailedInsights.improvementAreas.length === 0) && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm italic text-gray-500">
                    General improvement opportunities will be shown here
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="mb-16">
          <div className="mb-8 text-center">
            <h3 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-black text-transparent">
              PERSONALIZED RECOMMENDATIONS
            </h3>
            <p className="text-xl text-gray-600">
              Tailored improvement suggestions for each profile
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Profile 1 Recommendations */}
            <div className="relative rounded-3xl border border-blue-200 bg-gradient-to-br from-white/95 via-blue-50/90 to-cyan-100/70 p-8 shadow-2xl">
              <div className="relative">
                <div className="mb-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <GradientIcon gradient="blue">
                      <svg
                        className="h-8 w-8"
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
                    </GradientIcon>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-600">
                    {scores.profile1.fileName}
                  </h3>
                  <p className="text-blue-700">
                    Personalized recommendations for improvement
                  </p>
                </div>
                <div className="space-y-3">
                  {recommendations.forProfile1.map((rec, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-100 p-4 text-sm font-medium text-blue-800 shadow-sm"
                    >
                      📋 {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile 2 Recommendations */}
            <div className="relative rounded-3xl border border-indigo-200 bg-gradient-to-br from-white/95 via-indigo-50/90 to-purple-100/70 p-8 shadow-2xl">
              <div className="relative">
                <div className="mb-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <GradientIcon gradient="purple">
                      <svg
                        className="h-8 w-8"
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
                    </GradientIcon>
                  </div>
                  <h3 className="text-2xl font-bold text-indigo-600">
                    {scores.profile2.fileName}
                  </h3>
                  <p className="text-indigo-700">
                    Personalized recommendations for improvement
                  </p>
                </div>
                <div className="space-y-3">
                  {recommendations.forProfile2.map((rec, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-100 p-4 text-sm font-medium text-indigo-800 shadow-sm"
                    >
                      📋 {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* General Advice */}
          <div className="mt-8">
            <div className="relative rounded-3xl border border-purple-200 bg-gradient-to-br from-white/95 via-purple-50/90 to-pink-100/70 p-8 shadow-2xl">
              <div className="relative">
                <div className="mb-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <GradientIcon gradient="purple">
                      <svg
                        className="h-8 w-8"
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
                    </GradientIcon>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-600">
                    GENERAL ADVICE
                  </h3>
                  <p className="text-purple-700">
                    Universal tips for LinkedIn success
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {recommendations.generalAdvice.map((advice, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-100 p-4 text-sm font-medium text-purple-800 shadow-sm"
                    >
                      🎯 {advice}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Summary */}
        <div className="mb-16">
          <div className="relative rounded-3xl border border-gray-200 bg-gradient-to-br from-white/95 via-gray-50/90 to-blue-100/70 p-8 shadow-2xl">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <GradientIcon gradient="blue">
                  <svg
                    className="h-10 w-10"
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
                </GradientIcon>
              </div>
              <h3 className="mb-4 text-3xl font-bold text-gray-800">
                Analysis Complete!
              </h3>
              <p className="mb-6 text-lg text-gray-600">
                Your LinkedIn profiles have been thoroughly analyzed using
                AI-powered insights. Use these recommendations to enhance your
                professional presence.
              </p>
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                <button
                  onClick={handleExportReport}
                  disabled={isExporting}
                  className="w-full rounded-2xl border border-blue-300 bg-blue-50 px-6 py-3 font-medium text-blue-700 transition-all hover:bg-blue-100 sm:w-auto"
                >
                  {isExporting ? "Exporting..." : "Export Full Report"}
                </button>
                <button
                  onClick={handleNewComparison}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 font-medium text-white transition-all hover:from-blue-600 hover:to-indigo-600 sm:w-auto"
                >
                  Compare New Profiles
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Analysis completed in {comparisonResult.processingTime}s on{" "}
            {new Date(comparisonResult.comparisonDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkedinCompareResult;
