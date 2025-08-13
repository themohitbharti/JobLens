import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchResumeScanResult,
  setSidebarCollapsed,
} from "../store/resumeScanSlice";
import {
  // ScoreOverview,
  // SectionAnalysis,
  LoadingSpinner,
} from "../components/resume/index";

const ResumeScanResult: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [animateScore, setAnimateScore] = useState(false);
  // Add state to control visibility of suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const handleSectionClick = (sectionName: string) => {
    navigate(
      `/resume-scan-result/${scanId}/section/${encodeURIComponent(sectionName)}`,
    );
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8.5)
      return "bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-700";
    if (score >= 7.5)
      return "bg-gradient-to-r from-green-500 via-green-600 to-emerald-700";
    if (score >= 6.5)
      return "bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700"; // Changed from yellow/orange
    if (score >= 5.5)
      return "bg-gradient-to-r from-purple-500 via-pink-600 to-red-600"; // Changed from yellow/orange/red
    if (score >= 4)
      return "bg-gradient-to-r from-orange-500 via-red-600 to-red-700";
    return "bg-gradient-to-r from-red-600 via-red-700 to-rose-800";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8.5)
      return (
        <div className="flex items-center justify-center rounded-xl bg-emerald-200 p-2.5 shadow-inner">
          <svg
            className="h-5 w-5 text-emerald-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            />
          </svg>
        </div>
      );
    if (score >= 7)
      return (
        <div className="flex items-center justify-center rounded-xl bg-green-200 p-2.5 shadow-inner">
          <svg
            className="h-5 w-5 text-green-700"
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
        <div className="flex items-center justify-center rounded-xl bg-purple-200 p-2.5 shadow-inner">
          {" "}
          <svg
            className="h-5 w-5 text-purple-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            />
          </svg>
        </div>
      );
    return (
      <div className="flex items-center justify-center rounded-xl bg-red-200 p-2.5 shadow-inner">
        <svg
          className="h-5 w-5 text-red-700"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4a1 1 0 012 0v-3a1 1 0 10-2 0v3zm1-5a1 1 0 100-2 1 1 0 000 2z"
          />
        </svg>
      </div>
    );
  };

  const getSectionIcon = (sectionName: string) => {
    const icons: { [key: string]: JSX.Element } = {
      "personal information": (
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
      experience: (
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
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"
          />
        </svg>
      ),
      education: (
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
      skills: (
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
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      projects: (
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
            d="M19 11H5m14-4H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2z"
          />
        </svg>
      ),
    };

    const normalizedName = sectionName.toLowerCase();
    return (
      icons[normalizedName] || (
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

  const CustomCircularProgress = ({
    score,
    size = 120,
    strokeWidth = 8,
  }: {
    score: number;
    size?: number;
    strokeWidth?: number;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = (score / 10) * 100;
    const offset = circumference - (percentage / 100) * circumference;

    const getGradientColors = (score: number) => {
      if (score >= 8.5)
        return { start: "#10b981", middle: "#059669", end: "#047857" };
      if (score >= 7.5)
        return { start: "#22c55e", middle: "#16a34a", end: "#15803d" };
      if (score >= 6.5)
        return { start: "#84cc16", middle: "#eab308", end: "#f97316" };
      if (score >= 5.5)
        return { start: "#eab308", middle: "#f97316", end: "#ef4444" };
      if (score >= 4)
        return { start: "#fb923c", middle: "#ef4444", end: "#dc2626" };
      return { start: "#ef4444", middle: "#dc2626", end: "#b91c1c" };
    };

    const colors = getGradientColors(score);

    return (
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90 transform">
          <defs>
            <linearGradient
              id={`progressGradient-${score}-${size}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="50%" stopColor={colors.middle} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>
            <filter id={`shadow-${score}-${size}`}>
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
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="drop-shadow-sm"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#progressGradient-${score}-${size})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={animateScore ? offset : circumference}
            strokeLinecap="round"
            filter={`url(#shadow-${score}-${size})`}
            className="duration-2000 transition-all ease-out"
          />

          {/* Inner glow circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - strokeWidth / 2}
            stroke="none"
            fill="rgba(255,255,255,0.05)"
            className="pointer-events-none"
          />
        </svg>

        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{score}</span>
          <span className="text-xs font-medium text-gray-500">/ 10</span>
        </div>
      </div>
    );
  };

  // Enhanced Radar Chart Component with more space for labels
  // const RadarChart = ({
  //   data,
  // }: {
  //   data: Array<{ name: string; score: number }>;
  // }) => {
  //   const size = 350; // Increased from 300
  //   const center = size / 2;
  //   const maxRadius = size / 2 - 60; // Increased padding from 40 to 60
  //   const levels = 5;
  //   const angleStep = (2 * Math.PI) / data.length;

  //   const getPoint = (angle: number, radius: number) => ({
  //     x: center + Math.cos(angle - Math.PI / 2) * radius,
  //     y: center + Math.sin(angle - Math.PI / 2) * radius,
  //   });

  //   // const dataPoints = data.map((item, index) => {
  //   //   const angle = index * angleStep;
  //   //   const radius = (item.score / 10) * maxRadius;
  //   //   return getPoint(angle, radius);
  //   // });

  //   // const pathData = `M ${dataPoints.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;

  //   return (
  //     <div className="rounded-2xl border border-gray-200/50 bg-gradient-to-br from-pink-50 via-red-200 to-slate-50/50 p-6 shadow-lg backdrop-blur-sm">
  //       <div className="mb-4">
  //         <h4 className="mb-1 text-lg font-semibold text-gray-800">
  //           Section Comparison
  //         </h4>
  //         <p className="text-sm text-gray-600">
  //           Performance across all sections
  //         </p>
  //       </div>

  //       <svg width={size} height={size} className="mx-auto">
  //         <defs>
  //           <radialGradient id="radarGradient" cx="50%" cy="50%">
  //             <stop offset="0%" stopColor="rgba(239, 68, 68, 0.3)" />
  //             <stop offset="100%" stopColor="rgba(239, 68, 68, 0.1)" />
  //           </radialGradient>
  //           <filter id="radarShadow">
  //             <feDropShadow
  //               dx="0"
  //               dy="2"
  //               stdDeviation="4"
  //               floodColor="rgba(0,0,0,0.1)"
  //             />
  //           </filter>
  //         </defs>

  //         {/* Grid circles */}
  //         {Array.from({ length: levels }, (_, i) => (
  //           <circle
  //             key={i}
  //             cx={center}
  //             cy={center}
  //             r={(maxRadius / levels) * (i + 1)}
  //             fill="none"
  //             stroke="#e5e7eb"
  //             strokeWidth="1"
  //             opacity={0.6}
  //           />
  //         ))}

  //         {/* Grid lines */}
  //         {data.map((_, index) => {
  //           const angle = index * angleStep;
  //           const endPoint = getPoint(angle, maxRadius);
  //           return (
  //             <line
  //               key={index}
  //               x1={center}
  //               y1={center}
  //               x2={endPoint.x}
  //               y2={endPoint.y}
  //               stroke="#e5e7eb"
  //               strokeWidth="1"
  //               opacity={0.6}
  //             />
  //           );
  //         })}

  //         {/* Data area */}
  //         <path
  //           d={`
  //             M ${data
  //               .map((item, index) => {
  //                 const angle = index * angleStep;
  //                 const radius = _scoreToRadius(item.score, 350, 60);
  //                 const point = {
  //                   x: 175 + Math.cos(angle - Math.PI / 2) * radius,
  //                   y: 175 + Math.sin(angle - Math.PI / 2) * radius,
  //                 };
  //                 return `${point.x},${point.y}`;
  //               })
  //               .join(" L ")} Z
  //           `}
  //           fill="url(#radarGradient)"
  //           stroke="#ef4444"
  //           strokeWidth="2"
  //           filter="url(#radarShadow)"
  //         />

  //         {/* Data points */}
  //         {data.map((item, index) => {
  //           const angle = index * angleStep;
  //           const radius = _scoreToRadius(item.score, 350, 60);
  //           const point = {
  //             x: 175 + Math.cos(angle - Math.PI / 2) * radius,
  //             y: 175 + Math.sin(angle - Math.PI / 2) * radius,
  //           };
  //           return (
  //             <circle
  //               key={index}
  //               cx={point.x}
  //               cy={point.y}
  //               r="4"
  //               fill="#ef4444"
  //               stroke="white"
  //               strokeWidth="2"
  //               filter="url(#radarShadow)"
  //             />
  //           );
  //         })}

  //         {/* Enhanced Labels with better spacing */}
  //         {data.map((item, index) => {
  //           const angle = index * angleStep;
  //           const labelRadius = maxRadius + 35; // Increased from 20 to 35
  //           const labelPoint = getPoint(angle, labelRadius);

  //           // Truncate long section names and capitalize
  //           const displayName =
  //             item.name.length > 8
  //               ? item.name.substring(0, 8) + "..."
  //               : item.name;

  //           return (
  //             <text
  //               key={index}
  //               x={labelPoint.x}
  //               y={labelPoint.y}
  //               textAnchor="middle"
  //               dominantBaseline="middle"
  //               className="fill-gray-700 text-xs font-medium"
  //             >
  //               <tspan className="capitalize">{displayName}</tspan>
  //             </text>
  //           );
  //         })}
  //       </svg>

  //       {/* Legend */}
  //       <div className="mt-4 flex justify-center space-x-6 text-sm">
  //         <div className="flex items-center space-x-2">
  //           <div className="h-3 w-3 rounded-full bg-red-500"></div>
  //           <span className="text-gray-600">Current Score</span>
  //         </div>
  //         <div className="flex items-center space-x-2">
  //           <div className="h-3 w-3 rounded-full bg-gray-300"></div>
  //           <span className="text-gray-600">Target (10/10)</span>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const _scoreToRadius = (score: number, size: number, padding: number) => {
    const maxRadius = size / 2 - padding;
    return (score / 10) * maxRadius;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !scanData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-red-50 to-red-100">
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
            Error Loading Results
          </h3>
          <p className="mb-6 text-gray-600">
            {error || "Failed to load scan results"}
          </p>
          <button
            onClick={() => navigate("/resume-scan")}
            className="transform rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-700 hover:to-red-800 hover:shadow-red-500/25"
          >
            Back to Resume Scan
          </button>
        </div>
      </div>
    );
  }

  // Prepare radar chart data
  const radarData = scanData.sectionScores.map((section) => ({
    name: section.sectionName.split(" ")[0], // Use first word for cleaner labels
    score: section.score,
  }));

  // Find highest and lowest scoring sections
  const sortedSections = [...scanData.sectionScores].sort(
    (a, b) => b.score - a.score,
  );
  const highestSection = sortedSections[0];
  const lowestSection = sortedSections[sortedSections.length - 1];

  // Helper to get all AI suggestions from detailedFeedback
  const aiSuggestions =
    scanData?.detailedFeedback
      ?.filter((fb) => fb.aiSuggestion && fb.aiSuggestion.improvedText)
      .map((fb) => ({
        section: fb.sectionName,
        ...fb.aiSuggestion,
      })) || [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Decorative background elements - matching compare resume page */}
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
            onClick={() => navigate("/resume-scan")}
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
            <span className="font-medium">Back to Resume Scan</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-gray-800 via-red-700 to-red-600 bg-clip-text text-6xl font-extrabold text-transparent">
                Resume Analysis
              </h1>
              <div className="mt-4 flex items-center space-x-2">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-red-500 to-red-600"></div>
                <p className="text-xl font-medium text-gray-600">
                  AI-powered insights with precision scoring
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="group rounded-xl border border-red-200/50 bg-gradient-to-br from-white/90 via-red-50/30 to-pink-50/20 px-6 py-3 font-semibold text-gray-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:from-white hover:shadow-xl">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-red-500"
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
                  <span>Download Report</span>
                </div>
              </button>
              <button
                onClick={() => navigate("/resume-scan")}
                className="transform rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-700 hover:to-red-800 hover:shadow-red-500/25"
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Scan Another</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Enhanced Score Overview */}
          <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white/90 via-pink-100/90 to-purple-200/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
              {/* Main Score Circle */}
              <div className="flex flex-col items-center lg:col-span-1">
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-gray-800">
                    Overall Score
                  </h3>
                  <div className="mx-auto h-0.5 w-12 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
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
                    Resume Quality Index
                  </p>
                </div>
              </div>

              {/* Enhanced Stats Cards Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
                {/* Improvement Potential Card */}
                <div className="rounded-2xl border border-red-300/60 bg-gradient-to-br from-red-100/90 via-rose-100/80 to-pink-200/60 p-6 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-700">
                        Improvement Potential
                      </h4>
                      <p className="text-3xl font-bold text-red-600">
                        {scanData.improvementPotential}%
                      </p>
                    </div>
                    <div className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 p-3">
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

                {/* Sections Analyzed Card */}
                <div className="rounded-2xl border border-blue-300/60 bg-gradient-to-br from-blue-100/90 via-indigo-100/80 to-purple-200/60 p-6 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-700">
                        Sections Analyzed
                      </h4>
                      <p className="text-3xl font-bold text-blue-600">
                        {scanData.sectionScores.length}
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
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2M15 7a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2h4a2 2 0 002-2V7z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* User Profile/Preferences Card */}
                <div className="col-span-1 rounded-2xl border border-purple-300/60 bg-gradient-to-br from-purple-100/90 via-pink-100/80 to-rose-200/60 p-6 shadow-lg backdrop-blur-sm sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-3">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-gray-700">
                          Target Role Match
                        </h4>
                        <div className="flex items-center space-x-4">
                          <p className="text-2xl font-bold text-purple-600">
                            {scanData.usedPreferences?.targetJobTitle ||
                              "General Role"}
                          </p>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-600">
                              Active Profile
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Industry Focus</p>
                      <p className="font-semibold text-gray-800">
                        {scanData.usedPreferences?.targetIndustry || "General"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Performance Overview */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Enhanced Radar Chart */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-pink-300/60 bg-gradient-to-br from-pink-100/90 via-rose-100/80 to-red-200/60 p-6 shadow-lg backdrop-blur-sm">
                <div className="mb-4">
                  <h4 className="mb-1 text-lg font-semibold text-gray-800">
                    Section Comparison
                  </h4>
                  <p className="text-sm text-gray-600">
                    Performance across all sections
                  </p>
                </div>

                <svg width={350} height={350} className="mx-auto">
                  <defs>
                    <radialGradient id="radarGradient" cx="50%" cy="50%">
                      <stop offset="0%" stopColor="rgba(239, 68, 68, 0.3)" />
                      <stop offset="100%" stopColor="rgba(239, 68, 68, 0.1)" />
                    </radialGradient>
                    <filter id="radarShadow">
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="4"
                        floodColor="rgba(0,0,0,0.1)"
                      />
                    </filter>
                  </defs>

                  {/* Grid circles - made more visible */}
                  {Array.from({ length: 5 }, (_, i) => (
                    <circle
                      key={i}
                      cx={175}
                      cy={175}
                      r={(140 / 5) * (i + 1)}
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                      opacity={0.8}
                    />
                  ))}

                  {/* Grid lines - made more visible */}
                  {radarData.map((_, index) => {
                    const angle = index * ((2 * Math.PI) / radarData.length);
                    const endPoint = {
                      x: 175 + Math.cos(angle - Math.PI / 2) * 140,
                      y: 175 + Math.sin(angle - Math.PI / 2) * 140,
                    };
                    return (
                      <line
                        key={index}
                        x1={175}
                        y1={175}
                        x2={endPoint.x}
                        y2={endPoint.y}
                        stroke="#d1d5db"
                        strokeWidth="1.5"
                        opacity={0.8}
                      />
                    );
                  })}

                  {/* Score level labels on circles */}
                  {Array.from({ length: 5 }, (_, i) => {
                    const score = ((i + 1) * 2).toString(); // 2, 4, 6, 8, 10
                    return (
                      <text
                        key={`score-${i}`}
                        x={175}
                        y={175 - (140 / 5) * (i + 1)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-gray-500 text-xs font-medium"
                        dy="-5"
                      >
                        {score}
                      </text>
                    );
                  })}

                  {/* Data area */}
                  <path
                    d={`
                      M ${radarData
                        .map((item, index) => {
                          const angle =
                            index * ((2 * Math.PI) / radarData.length);
                          const radius = _scoreToRadius(item.score, 350, 60);
                          const point = {
                            x: 175 + Math.cos(angle - Math.PI / 2) * radius,
                            y: 175 + Math.sin(angle - Math.PI / 2) * radius,
                          };
                          return `${point.x},${point.y}`;
                        })
                        .join(" L ")} Z
                    `}
                    fill="url(#radarGradient)"
                    stroke="#ef4444"
                    strokeWidth="2"
                    filter="url(#radarShadow)"
                  />

                  {/* Data points */}
                  {radarData.map((item, index) => {
                    const angle = index * ((2 * Math.PI) / radarData.length);
                    const radius = _scoreToRadius(item.score, 350, 60);
                    const point = {
                      x: 175 + Math.cos(angle - Math.PI / 2) * radius,
                      y: 175 + Math.sin(angle - Math.PI / 2) * radius,
                    };
                    return (
                      <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="5"
                        fill="#ef4444"
                        stroke="white"
                        strokeWidth="3"
                        filter="url(#radarShadow)"
                      />
                    );
                  })}

                  {/* Section labels - enhanced visibility without white rectangles */}
                  {radarData.map((item, index) => {
                    const angle = index * ((2 * Math.PI) / radarData.length);
                    const labelRadius = 160; // Increased distance from center
                    const labelPoint = {
                      x: 175 + Math.cos(angle - Math.PI / 2) * labelRadius,
                      y: 175 + Math.sin(angle - Math.PI / 2) * labelRadius,
                    };

                    const displayName =
                      item.name.length > 10
                        ? item.name.substring(0, 10) + "..."
                        : item.name;

                    return (
                      <g key={index}>
                        {/* Text label with enhanced visibility using text shadow */}
                        <text
                          x={labelPoint.x}
                          y={labelPoint.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-gray-900 text-xs font-bold"
                          style={{
                            textShadow:
                              "2px 2px 4px rgba(255,255,255,0.9), -1px -1px 2px rgba(255,255,255,0.9), 1px -1px 2px rgba(255,255,255,0.9), -1px 1px 2px rgba(255,255,255,0.9)",
                          }}
                        >
                          <tspan className="capitalize">{displayName}</tspan>
                        </text>
                        {/* Score value below section name with text shadow */}
                        <text
                          x={labelPoint.x}
                          y={labelPoint.y + 16}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-red-700 text-xs font-bold"
                          style={{
                            textShadow:
                              "2px 2px 4px rgba(255,255,255,0.9), -1px -1px 2px rgba(255,255,255,0.9), 1px -1px 2px rgba(255,255,255,0.9), -1px 1px 2px rgba(255,255,255,0.9)",
                          }}
                        >
                          {item.score}/10
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="mt-4 flex justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">Current Score</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                    <span className="text-gray-600">Target (10/10)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Highlights */}
            <div className="space-y-4">
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
                        d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2v-8a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      Average Score
                    </p>
                    <p className="text-lg font-bold text-blue-800">
                      {(
                        scanData.sectionScores.reduce(
                          (sum, s) => sum + s.score,
                          0,
                        ) / scanData.sectionScores.length
                      ).toFixed(1)}
                      /10
                    </p>
                    <p className="text-sm text-blue-600">Across All Sections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Section Analysis */}
          <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-white/90 via-purple-100/90 to-pink-200/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 p-3">
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
                  <h3 className="text-3xl font-bold text-gray-800">
                    Detailed Section Analysis
                  </h3>
                  <div className="mt-2 h-0.5 w-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Click any section for detailed feedback
                </p>
                <div className="mt-1 flex items-center justify-end space-x-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500 delay-75"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-red-500 delay-150"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {scanData.sectionScores.map((section, index) => {
                const sectionFeedback = scanData.detailedFeedback.find(
                  (feedback) => feedback.sectionName === section.sectionName,
                );

                // Enhanced gradients for section cards
                const sectionGradients = [
                  "bg-gradient-to-br from-slate-100/95 via-gray-100/85 to-zinc-200/75 border-slate-300/80", // More intense silver
                  "bg-gradient-to-br from-amber-100/95 via-orange-100/85 to-red-200/75 border-amber-300/80", // More intense gold
                  "bg-gradient-to-br from-rose-100/95 via-pink-100/85 to-red-200/75 border-rose-300/80", // More intense rose gold
                  "bg-gradient-to-br from-blue-100/95 via-indigo-100/85 to-purple-200/75 border-blue-300/80", // More intense blue steel
                  "bg-gradient-to-br from-emerald-100/95 via-teal-100/85 to-cyan-200/75 border-emerald-300/80", // More intense mint
                  "bg-gradient-to-br from-violet-100/95 via-purple-100/85 to-indigo-200/75 border-violet-300/80", // More intense purple chrome
                ];

                return (
                  <div
                    key={section.sectionName}
                    className={`group transform cursor-pointer transition-all duration-300 hover:scale-105 ${
                      hoveredSection === section.sectionName ? "scale-105" : ""
                    }`}
                    onMouseEnter={() => setHoveredSection(section.sectionName)}
                    onMouseLeave={() => setHoveredSection(null)}
                    onClick={() => handleSectionClick(section.sectionName)}
                  >
                    <div
                      className={`relative flex h-full flex-col rounded-2xl border ${sectionGradients[index % sectionGradients.length]} p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl`}
                      style={{ minHeight: "310px" }}
                    >
                      {/* Section Header with enhanced styling */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="rounded-lg bg-white/80 p-2 text-gray-600 shadow-sm">
                            {getSectionIcon(section.sectionName)}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold capitalize text-gray-800">
                              {section.sectionName}
                            </h4>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Section {index + 1}
                            </p>
                          </div>
                        </div>
                        {getScoreIcon(section.score)}
                      </div>

                      {/* Enhanced Circular Progress */}
                      <div className="mb-4 flex items-center justify-center">
                        <CustomCircularProgress
                          score={section.score}
                          size={80}
                          strokeWidth={6}
                        />
                      </div>

                      {/* Modern Score Bar with enhanced details */}
                      <div className="relative mb-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">
                            Progress
                          </span>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`h-2 w-2 animate-pulse rounded-full ${
                                section.score >= 8
                                  ? "bg-green-500"
                                  : section.score >= 5
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-xs font-bold text-gray-700">
                              {((section.score / 10) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/60 shadow-inner backdrop-blur-sm">
                          <div
                            className={`h-full ${getScoreGradient(section.score)} duration-1500 rounded-full shadow-sm transition-all ease-out`}
                            style={{
                              width: animateScore
                                ? `${(section.score / 10) * 100}%`
                                : "0%",
                            }}
                          />
                        </div>
                        <div
                          className="absolute -top-8 right-0 rounded-lg border px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-sm"
                          style={{
                            color:
                              section.score >= 7
                                ? "#059669"
                                : section.score >= 5
                                  ? "#d97706"
                                  : "#dc2626",
                          }}
                        >
                          {section.score >= 7
                            ? "High"
                            : section.score >= 5
                              ? "Medium"
                              : "Low"}
                        </div>
                      </div>

                      {/* Enhanced Feedback Preview */}
                      {sectionFeedback && (
                        <div className="mb-4 rounded-lg border-l-4 border-indigo-400 bg-white/60 p-3 shadow-inner backdrop-blur-sm">
                          <div className="flex items-start space-x-2">
                            <svg
                              className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500"
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
                            <p className="line-clamp-2 text-sm text-gray-700">
                              {sectionFeedback.issues.length > 0
                                ? sectionFeedback.issues[0]
                                : sectionFeedback.aiSuggestion?.explanation ||
                                  "Click to view detailed feedback and suggestions"}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Enhanced Hover indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500"></div>
                        <div className="flex items-center text-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <span className="mr-2 text-sm font-medium">
                            View Details
                          </span>
                          <svg
                            className="h-4 w-4 transform transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Metallic decoration */}
                      <div className="absolute right-2 top-2 h-8 w-8 rounded-full bg-gradient-to-br from-white/20 to-gray-200/20 blur-sm"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modern Action Cards with More Intense Gradients */}
          <div className="space-y-6">
            {/* Quick Improvements Card */}
            <div className="hover:shadow-3xl flex w-full flex-col rounded-2xl border border-white/80 bg-gradient-to-br from-white/95 via-red-100/90 to-orange-200/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300">
              <div className="mb-4 flex items-center">
                <div className="mr-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-3">
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
                <h3 className="text-xl font-bold text-gray-800">AI Insights</h3>
              </div>
              {/* Highlighted improvement potential above suggestions */}
              <div className="mb-3 flex items-center justify-center">
                <span className="rounded-lg bg-gradient-to-r from-red-500 to-orange-400 px-4 py-2 text-lg font-bold text-white shadow-lg">
                  +{scanData.improvementPotential}% Potential Improvement
                </span>
              </div>
              <p className="mb-4 text-gray-600">
                Get instant suggestions to boost your resume score by{" "}
                {scanData.improvementPotential}%
              </p>

              {!showSuggestions ? (
                <div className="flex justify-center">
                  <button
                    className="mb-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:from-red-700 hover:to-red-800 hover:shadow-red-500/25"
                    onClick={() => setShowSuggestions(true)}
                  >
                    Show AI Suggestions
                  </button>
                </div>
              ) : null}

              {showSuggestions && (
                <div className="relative mt-4 flex-1">
                  {/* Hide button styled like Show AI Suggestions button, but small and at top right */}
                  <button
                    className="absolute right-3 top-3 z-10 rounded-lg bg-gradient-to-r from-red-700 to-red-800 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-200 hover:from-red-800 hover:to-red-900 hover:shadow-red-600/30"
                    onClick={() => setShowSuggestions(false)}
                  >
                    Hide
                  </button>
                  <div className="max-h-72 space-y-5 overflow-y-auto rounded-xl bg-white/95 p-6 shadow-inner backdrop-blur-sm">
                    {aiSuggestions.length === 0 ? (
                      <div className="flex items-center gap-3 text-base italic text-gray-400">
                        <svg
                          className="h-6 w-6 text-gray-300"
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
                        <span className="font-medium">
                          No AI suggestions found. Great job!
                        </span>
                      </div>
                    ) : (
                      aiSuggestions.map((s, idx) => (
                        <div
                          key={idx}
                          className="group relative overflow-hidden rounded-2xl border border-orange-300/80 bg-gradient-to-br from-pink-100/90 via-white to-red-100/90 p-6 shadow-md transition-all duration-300 hover:border-orange-400/90 hover:shadow-lg"
                        >
                          {/* Header Section with more intense gradients */}
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="rounded-xl bg-gradient-to-br from-red-600/20 to-orange-600/30 p-2.5 shadow-sm">
                                <svg
                                  className="h-5 w-5 text-red-600"
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
                                <span className="block text-sm font-bold uppercase tracking-wider text-orange-900 drop-shadow-sm">
                                  {s.section}
                                </span>
                                <span className="text-xs font-medium text-gray-600">
                                  Section Analysis
                                </span>
                              </div>
                            </div>
                            <span className="rounded-full border border-orange-300/80 bg-gradient-to-r from-orange-200 to-red-200 px-4 py-1.5 text-xs font-bold text-orange-900 shadow-sm">
                              {s.improvementType}
                            </span>
                          </div>

                          {/* Explanation Section with more intense gradient */}
                          <div className="mb-5 rounded-xl border border-orange-200/80 bg-gradient-to-r from-orange-100/90 via-red-100/70 to-pink-100/90 px-4 py-3 shadow-sm">
                            <div className="flex items-start gap-2">
                              <svg
                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-700"
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
                              <p className="text-sm font-medium italic leading-relaxed text-orange-900">
                                {s.explanation}
                              </p>
                            </div>
                          </div>

                          {/* Comparison Section with more intense gradients */}
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                              {/* Current Text with more intense red */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-red-600 shadow-sm"></div>
                                  <span className="text-sm font-bold uppercase tracking-wide text-red-800">
                                    Current
                                  </span>
                                </div>
                                <div className="rounded-xl border border-red-300 bg-gradient-to-br from-red-100/90 to-rose-200/80 px-4 py-3 shadow-sm">
                                  <p className="break-words text-sm font-medium leading-relaxed text-red-900">
                                    {s.originalText}
                                  </p>
                                </div>
                              </div>

                              {/* AI Suggestion with more intense green */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-600 shadow-sm"></div>
                                  <span className="text-sm font-bold uppercase tracking-wide text-green-800">
                                    AI Suggestion
                                  </span>
                                </div>
                                <div className="rounded-xl border border-green-300 bg-gradient-to-br from-green-100/90 to-emerald-200/80 px-4 py-3 shadow-sm">
                                  <p className="break-words text-sm font-semibold leading-relaxed text-green-900">
                                    {s.improvedText}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Action Indicator with more intense blue */}
                            <div className="mt-4 flex items-center justify-center">
                              <div className="flex items-center gap-2 rounded-full border border-blue-300/80 bg-gradient-to-r from-blue-100 to-indigo-200 px-4 py-1.5 text-xs font-medium text-blue-800 shadow-sm">
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                                <span>Apply Suggestion</span>
                              </div>
                            </div>
                          </div>

                          {/* More intense decoration */}
                          <div className="absolute right-3 top-3 h-12 w-12 rounded-full bg-gradient-to-br from-white/40 to-orange-200/30 opacity-60 blur-xl"></div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Track Progress card with more intense gradient */}
            <div className="hover:shadow-3xl mt-6 flex w-full flex-col justify-between rounded-2xl border border-white/80 bg-gradient-to-br from-white/95 via-blue-100/90 to-indigo-200/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300">
              <div>
                <div className="mb-4 flex items-center">
                  <div className="mr-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-3">
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2v-8a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Analytics Dashboard
                  </h3>
                </div>
                <p className="mb-4 text-gray-600">
                  Monitor your resume improvements and compare with industry
                  standards
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  className="mt-auto rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-800 hover:to-indigo-800 hover:shadow-blue-600/30"
                  onClick={() => navigate("/resume-stats")}
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeScanResult;
