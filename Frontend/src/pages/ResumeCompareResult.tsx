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

  const handleNewComparison = () => {
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

  interface CircularProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    label: string;
    color?: string;
  }

  const CircularProgress: React.FC<CircularProgressProps> = ({
    percentage,
    size = 120,
    strokeWidth = 8,
    label,
    color = "red",
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const getGradientColors = (color: string) => {
      switch (color) {
        case "green":
          return { from: "#10b981", to: "#34d399" };
        case "red":
          return { from: "#ef4444", to: "#f87171" };
        case "blue":
          return { from: "#3b82f6", to: "#60a5fa" };
        case "purple":
          return { from: "#8b5cf6", to: "#a78bfa" };
        default:
          return { from: "#6b7280", to: "#9ca3af" };
      }
    };

    const colors = getGradientColors(color);

    return (
      <div className="relative flex flex-col items-center">
        <svg width={size} height={size} className="-rotate-90 transform">
          <defs>
            <linearGradient
              id={`gradient-${label}-${color}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gradient-${label}-${color})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            {percentage}%
          </span>
          <span className="text-xs font-medium text-gray-600">{label}</span>
        </div>
      </div>
    );
  };

  interface ComparisonBarProps {
    leftValue: number;
    rightValue: number;
    leftLabel: string;
    rightLabel: string;
    leftColor?: string;
    rightColor?: string;
  }

  const ComparisonBar: React.FC<ComparisonBarProps> = ({
    leftValue,
    rightValue,
    leftLabel,
    rightLabel,
  }) => {
    const total = leftValue + rightValue;
    const leftPercentage = (leftValue / total) * 100;
    const rightPercentage = (rightValue / total) * 100;

    return (
      <div className="space-y-3">
        <div className="flex justify-between text-sm font-medium text-gray-700">
          <span>
            {leftLabel}: {leftValue}
          </span>
          <span>
            {rightLabel}: {rightValue}
          </span>
        </div>
        <div className="relative h-5 overflow-hidden rounded-full bg-gray-100 shadow-inner">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-1000"
            style={{ width: `${leftPercentage}%` }}
          />
          <div
            className="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-1000"
            style={{ width: `${rightPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span className="font-medium text-red-600">
            {leftPercentage.toFixed(1)}%
          </span>
          <span className="font-medium text-blue-600">
            {rightPercentage.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

  interface GradientIconProps {
    children: React.ReactNode;
    gradient?: string;
  }

  const GradientIcon: React.FC<GradientIconProps> = ({
    children,
    gradient = "red",
  }) => {
    const gradients = {
      red: "from-red-500 to-pink-500",
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
      purple: "from-purple-500 to-indigo-500",
      orange: "from-orange-500 to-yellow-500",
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="relative mx-auto mb-8 h-24 w-24">
            <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-red-500 to-pink-500 opacity-75"></div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500">
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Decorative background elements - matching other pages */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-rose-100 opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-red-100 opacity-10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-pink-100 opacity-10 blur-3xl" />
      </div>

      {/* Elegant Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.1) 0.5px, transparent 0.5px),
                           linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0.5px, transparent 0.5px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative z-10 px-6 py-8">
        {/* Header - consistent with other pages */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/compare-resumes")}
            className="group mb-8 flex items-center text-red-600 transition-all duration-200 hover:text-red-700"
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
                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-red-500 to-pink-500 opacity-75 blur-lg"></div>
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-2xl">
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
              Resume{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Comparison
              </span>{" "}
              Results
            </h1>

            <p className="mb-8 text-xl text-gray-600">
              AI-powered resume comparison analysis complete
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6">
              <button
                onClick={handleExportReport}
                disabled={isExporting}
                className="group relative transform rounded-2xl border border-gray-200 bg-white px-8 py-4 shadow-lg transition-all duration-300 hover:scale-105 hover:border-red-300 hover:shadow-xl"
              >
                <div className="flex items-center gap-3 font-medium text-gray-700">
                  {isExporting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <GradientIcon gradient="red">
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
                className="group relative transform rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 px-8 py-4 shadow-lg transition-all duration-300 hover:scale-105"
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
          <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-white/95 via-red-50/90 to-pink-100/80 p-12 shadow-2xl backdrop-blur-xl">
            <div className="text-center">
              {/* Winner Crown Animation */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-red-400/30 to-pink-400/30 blur-2xl"></div>
                  <div className="relative flex h-32 w-32 animate-bounce items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-2xl">
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

              <h2 className="mb-6 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-5xl font-black text-transparent">
                TOP PERFORMER
              </h2>

              <div className="mb-8 space-y-4">
                <h3 className="text-4xl font-bold text-gray-800">
                  {winnerScore.fileName}
                </h3>
                <div className="flex justify-center">
                  <CircularProgress
                    percentage={winnerScore.overallScore}
                    size={160}
                    strokeWidth={12}
                    label="Overall Score"
                    color="red"
                  />
                </div>
              </div>

              {/* Comparison Stats */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-pink-100 p-6 shadow-lg">
                  <div className="mb-4 flex justify-center">
                    <GradientIcon gradient="red">
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
                    <div className="text-3xl font-bold text-red-600">
                      +{winner.scoreDifference}
                    </div>
                    <div className="text-sm font-medium text-red-700">
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

                <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-100 p-6 shadow-lg">
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-3h6m-8 0V9a2 2 0 012-2h8a2 2 0 012 2v8M9 7h.01M9 10h.01"
                        />
                      </svg>
                    </GradientIcon>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {comparisonResult.usedPreferences.targetIndustry ||
                        "General"}
                    </div>
                    <div className="text-sm font-medium text-blue-700">
                      Target Industry
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Resume Analysis */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Resume 1 */}
          <div
            className={`relative rounded-3xl border-2 p-8 shadow-2xl transition-all duration-500 ${
              isResume1Winner
                ? "border-red-300 bg-gradient-to-br from-red-50/90 to-pink-100/70"
                : "border-gray-300 bg-gradient-to-br from-gray-50/90 to-slate-100/70"
            }`}
          >
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <GradientIcon gradient={isResume1Winner ? "red" : "purple"}>
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </GradientIcon>
                </div>

                <h3 className="mb-2 text-2xl font-bold text-gray-800">
                  {scores.resume1.fileName}
                </h3>
                <div
                  className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${
                    isResume1Winner
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                      : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                  }`}
                >
                  {isResume1Winner ? "🏆 TOP PERFORMER" : "🥈 SECOND PLACE"}
                </div>
              </div>

              <div className="flex justify-center">
                <CircularProgress
                  percentage={scores.resume1.overallScore}
                  size={140}
                  strokeWidth={10}
                  label="Score"
                  color={isResume1Winner ? "red" : "purple"}
                />
              </div>

              {/* Key Strengths */}
              <div className="space-y-4">
                <h4 className="flex items-center text-lg font-bold text-gray-800">
                  <div className="mr-3 flex justify-center">
                    <GradientIcon gradient="blue">
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
                  {keyDifferences.resume1Advantages.length > 0 ? (
                    keyDifferences.resume1Advantages.map((advantage, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-100 p-3 text-sm font-medium text-blue-800 shadow-sm"
                      >
                        ⚡ {advantage}
                      </div>
                    ))
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
                  {detailedInsights.strongestAreas.resume1.map(
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

          {/* Resume 2 */}
          <div
            className={`relative rounded-3xl border-2 p-8 shadow-2xl transition-all duration-500 ${
              !isResume1Winner
                ? "border-blue-300 bg-gradient-to-br from-blue-50/90 to-cyan-100/70"
                : "border-gray-300 bg-gradient-to-br from-gray-50/90 to-slate-100/70"
            }`}
          >
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <GradientIcon gradient={!isResume1Winner ? "blue" : "purple"}>
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </GradientIcon>
                </div>

                <h3 className="mb-2 text-2xl font-bold text-gray-800">
                  {scores.resume2.fileName}
                </h3>
                <div
                  className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${
                    !isResume1Winner
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                  }`}
                >
                  {!isResume1Winner ? "🏆 TOP PERFORMER" : "🥈 SECOND PLACE"}
                </div>
              </div>

              <div className="flex justify-center">
                <CircularProgress
                  percentage={scores.resume2.overallScore}
                  size={140}
                  strokeWidth={10}
                  label="Score"
                  color={!isResume1Winner ? "blue" : "purple"}
                />
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
                  {keyDifferences.resume2Advantages.length > 0 ? (
                    keyDifferences.resume2Advantages.map((advantage, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-100 p-3 text-sm font-medium text-orange-800 shadow-sm"
                      >
                        ⚡ {advantage}
                      </div>
                    ))
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
                  {detailedInsights.strongestAreas.resume2.map(
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
            <h3 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-black text-transparent">
              DETAILED SECTION ANALYSIS
            </h3>
            <p className="text-xl text-gray-600">
              Comprehensive breakdown by resume sections
            </p>
          </div>

          <div className="space-y-8">
            {sectionComparison.map((section, index) => (
              <div
                key={index}
                className="relative rounded-3xl border border-purple-200 bg-gradient-to-br from-white/95 via-purple-50/90 to-pink-100/70 p-8 shadow-2xl"
              >
                <div className="relative">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex justify-center">
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
                              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </GradientIcon>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-800">
                        {section.sectionName}
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
                      leftValue={section.resume1.score}
                      rightValue={section.resume2.score}
                      leftLabel={scores.resume1.fileName}
                      rightLabel={scores.resume2.fileName}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Resume 1 Section Details */}
                    <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-pink-100 p-6 shadow-lg">
                      <div className="mb-4 text-center">
                        <h5 className="mb-2 text-lg font-bold text-gray-800">
                          {scores.resume1.fileName}
                        </h5>
                        <div className="mb-3 flex justify-center">
                          <CircularProgress
                            percentage={(section.resume1.score / 10) * 100}
                            size={100}
                            strokeWidth={8}
                            label={`${section.resume1.score}/10`}
                            color={
                              section.resume1.status === "better"
                                ? "green"
                                : section.resume1.status === "worse"
                                  ? "red"
                                  : "purple"
                            }
                          />
                        </div>
                        <div
                          className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${
                            section.resume1.status === "better"
                              ? "border border-green-200 bg-green-100 text-green-800"
                              : section.resume1.status === "worse"
                                ? "border border-red-200 bg-red-100 text-red-800"
                                : "border border-purple-200 bg-purple-100 text-purple-800"
                          }`}
                        >
                          {section.resume1.status.toUpperCase()}
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
                    </div>

                    {/* Resume 2 Section Details */}
                    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-100 p-6 shadow-lg">
                      <div className="mb-4 text-center">
                        <h5 className="mb-2 text-lg font-bold text-gray-800">
                          {scores.resume2.fileName}
                        </h5>
                        <div className="mb-3 flex justify-center">
                          <CircularProgress
                            percentage={(section.resume2.score / 10) * 100}
                            size={100}
                            strokeWidth={8}
                            label={`${section.resume2.score}/10`}
                            color={
                              section.resume2.status === "better"
                                ? "green"
                                : section.resume2.status === "worse"
                                  ? "red"
                                  : "purple"
                            }
                          />
                        </div>
                        <div
                          className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${
                            section.resume2.status === "better"
                              ? "border border-green-200 bg-green-100 text-green-800"
                              : section.resume2.status === "worse"
                                ? "border border-red-200 bg-red-100 text-red-800"
                                : "border border-purple-200 bg-purple-100 text-purple-800"
                          }`}
                        >
                          {section.resume2.status.toUpperCase()}
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
            <h3 className="mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-4xl font-black text-transparent">
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
                if (a.importance === "high" && b.importance !== "high")
                  return -1;
                if (b.importance === "high" && a.importance !== "high")
                  return 1;
                return Math.abs(b.difference) - Math.abs(a.difference);
              })
              .slice(0, 8)
              .map((benchmark, index) => (
                <div
                  key={index}
                  className="relative rounded-3xl border border-blue-200 bg-gradient-to-br from-white/95 via-blue-50/90 to-cyan-100/70 p-8 shadow-2xl"
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
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </GradientIcon>
                        </div>
                        <h4 className="text-2xl font-bold capitalize text-gray-800">
                          {formatBenchmarkName(benchmark.benchmark)}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            benchmark.importance === "high"
                              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                              : benchmark.importance === "medium"
                                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                                : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                          }`}
                        >
                          {benchmark.importance.toUpperCase()} PRIORITY
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
                            {benchmark.difference} pts
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Benchmark Score Comparison */}
                    <div className="mb-6">
                      <ComparisonBar
                        leftValue={benchmark.resume1.score}
                        rightValue={benchmark.resume2.score}
                        leftLabel={`${scores.resume1.fileName} (${benchmark.resume1.passed ? "PASSED" : "FAILED"})`}
                        rightLabel={`${scores.resume2.fileName} (${benchmark.resume2.passed ? "PASSED" : "FAILED"})`}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* Resume 1 Benchmark */}
                      <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-pink-100 p-6 text-center shadow-lg">
                        <h5 className="mb-3 text-lg font-bold text-gray-800">
                          {scores.resume1.fileName}
                        </h5>
                        <div className="mb-4 flex justify-center">
                          <CircularProgress
                            percentage={(benchmark.resume1.score / 10) * 100}
                            size={120}
                            strokeWidth={10}
                            label={`${benchmark.resume1.score}/10`}
                            color={benchmark.resume1.passed ? "green" : "red"}
                          />
                        </div>
                        <div
                          className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${
                            benchmark.resume1.passed
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          }`}
                        >
                          {benchmark.resume1.passed ? "✓ PASSED" : "✗ FAILED"}
                        </div>
                      </div>

                      {/* Resume 2 Benchmark */}
                      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-100 p-6 text-center shadow-lg">
                        <h5 className="mb-3 text-lg font-bold text-gray-800">
                          {scores.resume2.fileName}
                        </h5>
                        <div className="mb-4 flex justify-center">
                          <CircularProgress
                            percentage={(benchmark.resume2.score / 10) * 100}
                            size={120}
                            strokeWidth={10}
                            label={`${benchmark.resume2.score}/10`}
                            color={benchmark.resume2.passed ? "green" : "red"}
                          />
                        </div>
                        <div
                          className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${
                            benchmark.resume2.passed
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          }`}
                        >
                          {benchmark.resume2.passed ? "✓ PASSED" : "✗ FAILED"}
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </GradientIcon>
                </div>
                <h3 className="text-2xl font-bold text-orange-600">
                  AREAS TO WATCH
                </h3>
                <p className="text-orange-700">
                  Common improvement opportunities
                </p>
              </div>
              <div className="space-y-3">
                {keyDifferences.commonWeaknesses.map((weakness, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-100 p-4 text-sm font-medium text-orange-800 shadow-sm"
                  >
                    ⚠️ {weakness}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhancement Opportunities */}
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
                      className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-100 p-4 text-sm font-medium text-blue-800 shadow-sm"
                    >
                      💡 {opportunity}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Best Practices */}
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
                  BEST PRACTICES
                </h3>
                <p className="text-purple-700">Expert recommendations</p>
              </div>
              <div className="space-y-3">
                {recommendations.generalAdvice.map((advice, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-100 p-4 text-sm font-medium text-purple-800 shadow-sm"
                  >
                    ✨ {advice}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Resume 1 Recommendations */}
          <div className="relative rounded-3xl border border-red-200 bg-gradient-to-br from-white/95 via-red-50/90 to-pink-100/70 p-8 shadow-2xl">
            <div className="relative">
              <div className="mb-6 text-center">
                <div className="mb-4 flex justify-center">
                  <GradientIcon gradient="red">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </GradientIcon>
                </div>
                <h3 className="text-2xl font-bold text-red-600">
                  {scores.resume1.fileName}
                </h3>
                <p className="text-red-700">Personalized recommendations</p>
              </div>
              <div className="space-y-3">
                {recommendations.forResume1.map((rec, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-pink-100 p-4 text-sm font-medium text-red-800 shadow-sm"
                  >
                    📍 {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resume 2 Recommendations */}
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </GradientIcon>
                </div>
                <h3 className="text-2xl font-bold text-blue-600">
                  {scores.resume2.fileName}
                </h3>
                <p className="text-blue-700">Personalized recommendations</p>
              </div>
              <div className="space-y-3">
                {recommendations.forResume2.map((rec, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-100 p-4 text-sm font-medium text-blue-800 shadow-sm"
                  >
                    📍 {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCompareResult;
