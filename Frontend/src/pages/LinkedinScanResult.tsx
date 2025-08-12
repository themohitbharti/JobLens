import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchLinkedinScanResult,
  setSidebarCollapsed,
} from "../store/linkedinScanSlice";
import CustomCircularProgress from "../components/ui/CustomCircularProgress";

const LinkedinScanResult: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [animatedRadar, setAnimatedRadar] = useState(false);

  // Get scan data from Redux store
  const { scanResult, loading, error } = useSelector(
    (state: RootState) => state.linkedinScan,
  );

  useEffect(() => {
    dispatch(setSidebarCollapsed(true));

    if (scanId && !scanResult) {
      dispatch(fetchLinkedinScanResult(scanId));
    }

    // Animate radar chart after component mounts
    const timer = setTimeout(() => setAnimatedRadar(true), 1000);
    return () => clearTimeout(timer);
  }, [dispatch, scanId, scanResult]);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600"></div>
          <p className="text-gray-600">Analyzing your LinkedIn profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !scanResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-800">
            Error Loading Results
          </h3>
          <p className="mb-6 text-gray-600">
            {error || "Failed to load LinkedIn analysis results"}
          </p>
          <button
            onClick={() => navigate("/linkedin-builder")}
            className="transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const scanData = scanResult;

  // Helper functions
  const getScoreIcon = (score: number): JSX.Element => {
    if (score >= 8)
      return (
        <div className="flex items-center justify-center rounded-xl bg-green-200 p-2.5 shadow-inner">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      );
    if (score >= 5)
      return (
        <div className="flex items-center justify-center rounded-xl bg-yellow-200 p-2.5 shadow-inner">
          <svg
            className="h-6 w-6 text-yellow-600"
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
      <div className="flex items-center justify-center rounded-xl bg-red-200 p-2.5 shadow-inner">
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    );
  };

  const getScoreGradient = (score: number): string => {
    if (score >= 8) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (score >= 5) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-rose-500";
  };

  const getSectionIcon = (sectionName: string): JSX.Element => {
    const iconMap: { [key: string]: JSX.Element } = {
      "Contact Information": (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      "Professional Summary": (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      Experience: (
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
            d="M21 13.255A23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
          />
        </svg>
      ),
      Education: (
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
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
        </svg>
      ),
      "Skills & Languages": (
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      "Additional Sections": (
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
            d="M19 11H5m14-7H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
          />
        </svg>
      ),
    };

    return (
      iconMap[sectionName] || (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      )
    );
  };

  const handleSectionClick = (sectionName: string) => {
    navigate(
      `/linkedin-builder-result/${scanId}/section/${encodeURIComponent(sectionName)}`,
    );
  };

  // Prepare data for sections with proper typing
  const sortedSections = [...scanData.sectionScores].sort(
    (a, b) => b.score - a.score,
  );
  const highestSection = sortedSections[0];
  const lowestSection = sortedSections[sortedSections.length - 1];

  // Calculate average score
  const averageScore =
    scanData.sectionScores.reduce((sum, section) => sum + section.score, 0) /
    scanData.sectionScores.length;

  // Helper to get all AI suggestions from detailedFeedback with proper typing
  const aiSuggestions = scanData.detailedFeedback
    .filter((fb) => fb.aiSuggestion && fb.aiSuggestion.improvedText)
    .map((fb) => ({
      section: fb.sectionName,
      ...fb.aiSuggestion!,
    }));

  // Prepare radar chart data similar to resume scan
  const radarData = scanData.sectionScores.map((section) => ({
    section:
      section.sectionName.length > 15
        ? section.sectionName.substring(0, 15) + "..."
        : section.sectionName,
    score: section.score,
    fullName: section.sectionName,
  }));

  // Helper function to convert score to radius for radar chart
  const scoreToRadius = (
    score: number,
    maxRadius: number,
    minRadius: number,
  ) => {
    return minRadius + (score / 10) * (maxRadius - minRadius);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-100 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-100 opacity-15 blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-100 opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/linkedin-builder")}
            className="group mb-8 flex items-center text-blue-600 transition-all duration-200 hover:text-blue-700"
          >
            <div className="mr-3 rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/40 p-2.5 shadow-md backdrop-blur-sm transition-all duration-200 group-hover:shadow-lg">
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
            <span className="font-medium">Back to LinkedIn Builder</span>
          </button>

          {/* Main Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-gray-800 via-blue-700 to-blue-600 bg-clip-text text-4xl font-extrabold text-transparent">
                LinkedIn Analysis Complete
              </h1>
              <div className="mt-2 flex items-center space-x-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
                <p className="text-lg font-medium text-gray-600">
                  Professional profile insights and recommendations
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl space-y-8">
          {/* Main Score Overview */}
          <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white/90 via-indigo-100/90 to-purple-200/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
              {/* Main Score Circle */}
              <div className="flex flex-col items-center lg:col-span-1">
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-gray-800">
                    Overall Score
                  </h3>
                  <div className="mx-auto h-0.5 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                </div>
                <CustomCircularProgress
                  score={scanData.overallScore}
                  size={180}
                  strokeWidth={14}
                />
                <div className="mt-6 text-center">
                  <div className="mb-2">
                    {getScoreIcon(scanData.overallScore)}
                  </div>
                  <p className="font-medium text-gray-600">
                    LinkedIn Profile Quality Index
                  </p>
                </div>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
                {/* Improvement Potential Card */}
                <div className="rounded-2xl border border-blue-300/60 bg-gradient-to-br from-blue-100/90 via-indigo-100/80 to-purple-200/60 p-6 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-700">
                        Improvement Potential
                      </h4>
                      <p className="text-3xl font-bold text-blue-600">
                        {scanData.improvementPotential}%
                      </p>
                    </div>
                    <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Sections Found Card */}
                <div className="rounded-2xl border border-indigo-300/60 bg-gradient-to-br from-indigo-100/90 via-purple-100/80 to-pink-200/60 p-6 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-700">
                        Sections Analyzed
                      </h4>
                      <p className="text-3xl font-bold text-indigo-600">
                        {scanData.sectionScores.length}
                      </p>
                    </div>
                    <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-4a2 2 0 01-2-2V7z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Processing Time Card */}
                <div className="rounded-2xl border border-green-300/60 bg-gradient-to-br from-green-100/90 via-emerald-100/80 to-teal-200/60 p-6 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-700">
                        Processing Time
                      </h4>
                      <p className="text-3xl font-bold text-green-600">
                        {scanData.processingTime
                          ? `${(scanData.processingTime / 1000).toFixed(1)}s`
                          : "< 30s"}
                      </p>
                    </div>
                    <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-3">
                      <svg
                        className="h-6 w-6 text-white"
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
                    </div>
                  </div>
                </div>

                {/* AI Suggestions Card */}
                <div className="rounded-2xl border border-red-300/60 bg-gradient-to-br from-pink-100/90 via-red-100/80 to-red-200/60 p-6 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-700">
                        AI Suggestions
                      </h4>
                      <p className="text-3xl font-bold text-red-600">
                        {aiSuggestions.length}
                      </p>
                    </div>
                    <div className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Highlights */}
            <div className="mt-8 space-y-4">
              {/* Highest Section */}
              <div className="rounded-2xl border border-emerald-300/60 bg-gradient-to-br from-emerald-100/90 via-green-100/80 to-teal-200/60 p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-gradient-to-r from-emerald-500 to-green-500 p-2">
                    <svg
                      className="h-5 w-5 text-white"
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
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-700">
                      Strongest Section
                    </p>
                    <p className="text-lg font-bold capitalize text-emerald-800">
                      {highestSection.sectionName}
                    </p>
                    <p className="text-sm text-emerald-600">
                      {highestSection.score}/10 Score
                    </p>
                  </div>
                </div>
              </div>

              {/* Lowest Section */}
              <div className="rounded-2xl border border-red-300/60 bg-gradient-to-br from-red-100/90 via-rose-100/80 to-pink-200/60 p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-gradient-to-r from-red-500 to-rose-500 p-2">
                    <svg
                      className="h-5 w-5 text-white"
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
                  <div>
                    <p className="text-sm font-medium text-red-700">
                      Needs Improvement
                    </p>
                    <p className="text-lg font-bold capitalize text-red-800">
                      {lowestSection.sectionName}
                    </p>
                    <p className="text-sm text-red-600">
                      {lowestSection.score}/10 Score
                    </p>
                  </div>
                </div>
              </div>

              {/* Average Score */}
              <div className="rounded-2xl border border-blue-300/60 bg-gradient-to-br from-blue-100/90 via-indigo-100/80 to-purple-200/60 p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-2">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      Average Score
                    </p>
                    <p className="text-lg font-bold text-blue-800">
                      {averageScore.toFixed(1)}/10
                    </p>
                    <p className="text-sm text-blue-600">Across all sections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Radar Chart Section */}
          <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white/90 via-blue-50/90 to-indigo-100/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-2xl font-bold text-gray-800">
                Section Analysis Radar
              </h3>
              <div className="mx-auto h-0.5 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <p className="mt-2 text-gray-600">
                Visual breakdown of your profile sections
              </p>
            </div>

            {/* Main Chart Area */}
            <div className="mb-8 grid gap-8 lg:grid-cols-3">
              {/* Left Side - Radar Chart */}
              <div className="flex justify-center lg:col-span-2">
                <div className="relative">
                  <svg viewBox="0 0 350 350" className="h-80 w-80">
                    <defs>
                      <radialGradient
                        id="linkedinRadarGradient"
                        cx="50%"
                        cy="50%"
                      >
                        <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
                        <stop
                          offset="100%"
                          stopColor="rgba(99, 102, 241, 0.1)"
                        />
                      </radialGradient>
                      <filter id="linkedinRadarShadow">
                        <feDropShadow
                          dx="0"
                          dy="2"
                          stdDeviation="4"
                          floodColor="rgba(0,0,0,0.1)"
                        />
                      </filter>
                    </defs>

                    {/* Grid circles with better visibility */}
                    {[1, 2, 3, 4, 5].map((ring) => (
                      <circle
                        key={ring}
                        cx="175"
                        cy="175"
                        r={(140 / 5) * ring}
                        fill="none"
                        stroke="rgba(99, 102, 241, 0.2)"
                        strokeWidth="1.5"
                      />
                    ))}

                    {/* Grid lines */}
                    {radarData.map((_, index) => {
                      const angle = index * ((2 * Math.PI) / radarData.length);
                      const x2 = 175 + Math.cos(angle - Math.PI / 2) * 140;
                      const y2 = 175 + Math.sin(angle - Math.PI / 2) * 140;
                      return (
                        <line
                          key={`line-${index}`}
                          x1="175"
                          y1="175"
                          x2={x2}
                          y2={y2}
                          stroke="rgba(99, 102, 241, 0.2)"
                          strokeWidth="1.5"
                        />
                      );
                    })}

                    {/* Score labels */}
                    {[1, 2, 3, 4, 5].map((i) => {
                      const score = (i * 2).toString(); // 2, 4, 6, 8, 10
                      return (
                        <text
                          key={`score-${i}`}
                          x={175}
                          y={175 - (140 / 5) * i}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-indigo-600 text-xs font-semibold"
                          dy="-5"
                        >
                          {score}
                        </text>
                      );
                    })}

                    {/* Data area with animation */}
                    <path
                      d={`
                        M ${radarData
                          .map((item, index) => {
                            const angle =
                              index * ((2 * Math.PI) / radarData.length);
                            const radius = animatedRadar
                              ? scoreToRadius(item.score, 140, 0)
                              : 0;
                            const point = {
                              x: 175 + Math.cos(angle - Math.PI / 2) * radius,
                              y: 175 + Math.sin(angle - Math.PI / 2) * radius,
                            };
                            return `${point.x},${point.y}`;
                          })
                          .join(" L ")} Z
                      `}
                      fill="rgba(99, 102, 241, 0.3)"
                      stroke="rgb(99, 102, 241)"
                      strokeWidth="3"
                      className="duration-2000 transition-all ease-out"
                    />

                    {/* Data points */}
                    {radarData.map((item, index) => {
                      const angle = index * ((2 * Math.PI) / radarData.length);
                      const radius = animatedRadar
                        ? scoreToRadius(item.score, 140, 0)
                        : 0;
                      const point = {
                        x: 175 + Math.cos(angle - Math.PI / 2) * radius,
                        y: 175 + Math.sin(angle - Math.PI / 2) * radius,
                      };
                      return (
                        <g key={`point-${index}`}>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill="rgb(99, 102, 241)"
                            stroke="white"
                            strokeWidth="3"
                            filter="url(#linkedinRadarShadow)"
                            className="duration-2000 hover:r-7 cursor-pointer transition-all ease-out"
                          />
                          {/* Tooltip on hover */}
                          <title>{`${item.fullName}: ${item.score}/10`}</title>
                        </g>
                      );
                    })}

                    {/* Section labels */}
                    {radarData.map((item, index) => {
                      const angle = index * ((2 * Math.PI) / radarData.length);
                      const labelRadius = 165;
                      const point = {
                        x: 175 + Math.cos(angle - Math.PI / 2) * labelRadius,
                        y: 175 + Math.sin(angle - Math.PI / 2) * labelRadius,
                      };

                      return (
                        <text
                          key={`label-${index}`}
                          x={point.x}
                          y={point.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-gray-700 text-xs font-semibold"
                        >
                          {item.section}
                        </text>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Right Side - Average Score Display */}
              <div className="flex items-center justify-center">
                <div className="border-gradient-to-r rounded-3xl bg-gradient-to-br from-indigo-300 via-blue-100 to-purple-300 p-8 shadow-xl">
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
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
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2v-8a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h4 className="mb-2 text-xl font-bold text-gray-800">
                      Average Score
                    </h4>
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-5xl font-extrabold text-transparent">
                      {averageScore.toFixed(1)}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-gray-600">
                      /10
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      Overall Performance
                    </div>

                    {/* Performance indicator */}
                    <div className="mt-4">
                      <div
                        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                          averageScore >= 8
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                            : averageScore >= 6
                              ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800"
                              : averageScore >= 4
                                ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800"
                                : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800"
                        }`}
                      >
                        {averageScore >= 8
                          ? "Excellent"
                          : averageScore >= 6
                            ? "Good"
                            : averageScore >= 4
                              ? "Fair"
                              : "Needs Work"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 2x2 Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Performance Summary */}
              <div className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 p-6 shadow-lg">
                <h4 className="mb-4 flex items-center text-lg font-bold text-indigo-800">
                  <div className="mr-3 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 p-2 shadow-inner">
                    <svg
                      className="h-5 w-5 text-white"
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
                  Performance Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-3">
                    <span className="text-sm font-medium text-gray-700">
                      Excellent Sections
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-lg font-bold text-green-600">
                        {radarData.filter((item) => item.score >= 8).length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 p-3">
                    <span className="text-sm font-medium text-gray-700">
                      Good Sections
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span className="text-lg font-bold text-yellow-600">
                        {
                          radarData.filter(
                            (item) => item.score >= 5 && item.score < 8,
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-red-50 to-rose-50 p-3">
                    <span className="text-sm font-medium text-gray-700">
                      Needs Work
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-lg font-bold text-red-600">
                        {radarData.filter((item) => item.score < 5).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Sections */}
              <div className="rounded-2xl border border-green-200/60 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-6 shadow-lg">
                <h4 className="mb-4 flex items-center text-lg font-bold text-green-800">
                  <div className="mr-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-2 shadow-inner">
                    <svg
                      className="h-5 w-5 text-white"
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
                  </div>
                  Top Performing
                </h4>
                <div className="space-y-3">
                  {radarData
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-xs font-bold text-white">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {item.fullName.length > 16
                              ? item.fullName.substring(0, 16) + "..."
                              : item.fullName}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">
                            {item.score}
                          </span>
                          <span className="text-xs text-gray-500">/10</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Improvement Areas */}
              <div className="rounded-2xl border border-red-200/60 bg-gradient-to-br from-red-50 via-rose-50 to-red-100 p-6 shadow-lg">
                <h4 className="mb-4 flex items-center text-lg font-bold text-red-800">
                  <div className="mr-3 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 p-2 shadow-inner">
                    <svg
                      className="h-5 w-5 text-white"
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
                  Focus Areas
                </h4>
                <div className="space-y-3">
                  {radarData
                    .sort((a, b) => a.score - b.score)
                    .slice(0, 3)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gradient-to-r from-red-100 to-rose-100 p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-xs font-bold text-white">
                            !
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {item.fullName.length > 16
                              ? item.fullName.substring(0, 16) + "..."
                              : item.fullName}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-red-600">
                            {item.score}
                          </span>
                          <span className="text-xs text-gray-500">/10</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-6 shadow-lg">
                <h4 className="mb-4 flex items-center text-lg font-bold text-purple-800">
                  <div className="mr-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-2 shadow-inner">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  Quick Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-3">
                    <span className="text-sm font-medium text-gray-700">
                      Profile Completeness
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      {Math.round((averageScore / 10) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-3">
                    <span className="text-sm font-medium text-gray-700">
                      Sections Found
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      {scanData.sectionsFound.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-3">
                    <span className="text-sm font-medium text-gray-700">
                      AI Suggestions
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      {aiSuggestions.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Each axis represents a section of your LinkedIn profile • Scores
                range from 0-10
              </p>
            </div>
          </div>

          {/* Section Analysis */}
          <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white/90 via-blue-50/90 to-indigo-100/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-3">
                  <svg
                    className="h-6 w-6 text-white"
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
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Section Analysis
                  </h3>
                  <p className="text-gray-600">
                    Click on any section for detailed insights
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {scanData.sectionScores.map((section, index) => (
                <div
                  key={index}
                  className={`group cursor-pointer rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    hoveredSection === section.sectionName
                      ? "border-blue-400/60 bg-gradient-to-br from-blue-100/90 to-indigo-200/80"
                      : "border-gray-200/60 bg-gradient-to-br from-white/90 to-gray-100/80 hover:border-blue-300/60"
                  }`}
                  onClick={() => handleSectionClick(section.sectionName)}
                  onMouseEnter={() => setHoveredSection(section.sectionName)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`rounded-lg p-2 shadow-inner transition-colors ${
                          section.score >= 8
                            ? "bg-green-100 text-green-600"
                            : section.score >= 5
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {getSectionIcon(section.sectionName)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 group-hover:text-blue-700">
                          {section.sectionName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Weight: {section.weight}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`mb-1 text-2xl font-bold ${
                          section.score >= 8
                            ? "text-green-600"
                            : section.score >= 5
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {section.score}
                      </div>
                      <div className="text-xs text-gray-500">out of 10</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-800">
                        {section.score * 10}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${getScoreGradient(
                          section.score,
                        )}`}
                        style={{ width: `${section.score * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Panel with Button */}
          <div className="rounded-3xl border border-green-200/50 bg-gradient-to-br from-green-50/90 via-emerald-50/80 to-green-100/60 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    AI Insights
                  </h3>
                  <p className="text-gray-600">
                    Personalized suggestions to enhance your LinkedIn profile
                  </p>
                </div>
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className={`rounded-2xl px-6 py-3 font-semibold shadow-lg transition-all duration-200 ${
                  showSuggestions
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    : "border-2 border-green-200 bg-white/80 text-green-700 hover:bg-green-50"
                }`}
              >
                {showSuggestions ? "Hide Suggestions" : "View AI Suggestions"}
              </button>
            </div>

            {/* Show suggestions count and potential improvement even when collapsed */}
            {!showSuggestions && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-4 rounded-xl bg-white/60 px-6 py-3 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {aiSuggestions.length} AI Suggestions Available
                    </span>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="h-4 w-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-green-700">
                      +{scanData.improvementPotential}% Potential Improvement
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions Content */}
            {showSuggestions && aiSuggestions.length > 0 && (
              <div className="space-y-6">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-green-300/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm"
                  >
                    <div className="mb-4">
                      <h4 className="flex items-center text-lg font-semibold text-green-800">
                        <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-200 text-sm font-bold text-green-700">
                          {index + 1}
                        </span>
                        {suggestion.section}
                      </h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-700">
                          Current
                        </p>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                          <p className="text-sm text-red-800">
                            {suggestion.originalText}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-700">
                          Suggested Improvement
                        </p>
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                          <p className="text-sm text-green-800">
                            {suggestion.improvedText}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <p className="text-sm text-blue-800">
                          <span className="font-semibold">
                            💡 Why this works:{" "}
                          </span>
                          {suggestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No suggestions available message */}
            {showSuggestions && aiSuggestions.length === 0 && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
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
                </div>
                <h4 className="mb-2 text-lg font-semibold text-gray-800">
                  Great Work!
                </h4>
                <p className="text-gray-600">
                  Your LinkedIn profile is already optimized. No AI suggestions
                  needed at this time.
                </p>
              </div>
            )}
          </div>

          {/* Action Panel */}
          <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white/90 via-purple-50/90 to-pink-100/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2v-8a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4 className="mb-2 text-xl font-bold text-gray-800">
                  View Analytics
                </h4>
                <p className="mb-4 text-sm text-gray-600">
                  Track your LinkedIn improvement over time
                </p>
                <button
                  className="mt-auto rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-800 hover:to-indigo-800 hover:shadow-blue-600/30"
                  onClick={() => navigate("/linkedin-stats")}
                >
                  View Analytics
                </button>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </div>
                <h4 className="mb-2 text-xl font-bold text-gray-800">
                  Compare Profiles
                </h4>
                <p className="mb-4 text-sm text-gray-600">
                  Compare with other LinkedIn profiles
                </p>
                <button
                  className="mt-auto rounded-xl bg-gradient-to-r from-purple-700 to-pink-700 px-6 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-800 hover:to-pink-800 hover:shadow-purple-600/30"
                  onClick={() => navigate("/compare-linkedin")}
                >
                  Compare Now
                </button>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h4 className="mb-2 text-xl font-bold text-gray-800">
                  Analyze Again
                </h4>
                <p className="mb-4 text-sm text-gray-600">
                  Run a fresh analysis with updated profile
                </p>
                <button
                  className="mt-auto rounded-xl bg-gradient-to-r from-green-700 to-emerald-700 px-6 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:from-green-800 hover:to-emerald-800 hover:shadow-green-600/30"
                  onClick={() => navigate("/linkedin-builder")}
                >
                  New Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedinScanResult;
