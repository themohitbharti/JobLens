import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchResumeStats } from "../../store/authSlice";
import { ScanStatistics } from "../index";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, resumeStatsData } = useSelector(
    (state: RootState) => state.auth,
  );

  const [preferences, setPreferences] = useState({
    targetIndustry: "Technology",
    experienceLevel: "mid",
    targetJobTitle: "Software Engineer",
  });

  const [editingPreference, setEditingPreference] = useState<string | null>(
    null,
  );
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    dispatch(fetchResumeStats());
  }, [dispatch]);

  const stats = {
    totalScans:
      resumeStatsData?.totalScans ?? user?.resumeStats?.totalScans ?? 0,
    latestScore:
      resumeStatsData?.bestScore ?? user?.resumeStats?.bestScore ?? 0,
    resumeImprovement:
      resumeStatsData?.improvementTrend ??
      user?.resumeStats?.improvementTrend ??
      0,
    linkedinImprovement: 0.15,
    averageScore:
      resumeStatsData?.weeklyAvg ?? user?.resumeStats?.weeklyAvg ?? 0,
  };

  const recentActivities = [
    {
      id: 1,
      type: "resume",
      action: "Resume score improved to 97%",
      description: "Added new skills and optimized keywords",
      time: "2 hours ago",
      icon: "🎯",
      color: "bg-green-500",
    },
    {
      id: 2,
      type: "application",
      action: "Applied to Software Engineer at TechCorp",
      description: "Resume automatically tailored for the position",
      time: "1 day ago",
      icon: "📋",
      color: "bg-blue-500",
    },
    {
      id: 3,
      type: "profile",
      action: "Profile viewed by 47 recruiters",
      description: "Increased visibility from recent updates",
      time: "2 days ago",
      icon: "👥",
      color: "bg-purple-500",
    },
  ];

  const handlePreferenceEdit = (key: string, currentValue: string) => {
    setEditingPreference(key);
    setTempValue(currentValue);
  };

  const handlePreferenceSave = () => {
    if (editingPreference) {
      setPreferences((prev) => ({
        ...prev,
        [editingPreference]: tempValue,
      }));
    }
    setEditingPreference(null);
    setTempValue("");
  };

  const handlePreferenceCancel = () => {
    setEditingPreference(null);
    setTempValue("");
  };

  const getExperienceLevelDisplay = (level: string) => {
    const levels = {
      entry: "Entry Level (0-2 years)",
      mid: "Mid Level (3-5 years)",
      senior: "Senior Level (6-10 years)",
      executive: "Executive (10+ years)",
    };
    return levels[level as keyof typeof levels] || level;
  };

  return (
    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
              Dashboard
            </h1>
            <p className="text-2xl font-semibold text-gray-700">
              Track your career progress and insights
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              This Week
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-red-600 hover:to-pink-600">
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
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Scans */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-r from-red-100 to-pink-100 opacity-60"></div>
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalScans}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Total Scans
                </span>
                <span className="text-xs text-green-600">
                  +5% from last week
                </span>
              </div>
            </div>
          </div>

          {/* Latest Score */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 opacity-60"></div>
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
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
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {stats.latestScore}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Latest Score
                </span>
                <span className="text-xs text-blue-600">Last scan</span>
              </div>
            </div>
          </div>

          {/* Resume Improvement */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 opacity-60"></div>
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
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
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                +{(stats.resumeImprovement * 100).toFixed(1)}%
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Resume Improvement
                </span>
                <span className="text-xs text-purple-600">+18% growth</span>
              </div>
            </div>
          </div>

          {/* LinkedIn Improvement */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-r from-orange-100 to-red-100 opacity-60"></div>
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-3">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                +{(stats.linkedinImprovement * 100).toFixed(1)}%
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  LinkedIn Improvement
                </span>
                <span className="text-xs text-orange-600">Market aligned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of your Dashboard content remains exactly the same */}
        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Career Preferences */}
          <div className="lg:col-span-2">
            <div className="h-full rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 p-2">
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Career Preferences
                  </h2>
                </div>
                <button className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200">
                  View Details
                </button>
              </div>

              <div className="mb-8 grid gap-6 md:grid-cols-3">
                {/* Experience Level */}
                <button
                  onClick={() =>
                    handlePreferenceEdit(
                      "experienceLevel",
                      preferences.experienceLevel,
                    )
                  }
                  className="rounded-xl bg-green-50 p-4 text-center transition-colors hover:bg-green-100"
                >
                  <div className="mx-auto mb-2 w-fit rounded-full bg-green-500 p-2">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-green-800">
                    Experience Level
                  </h3>
                  <p className="text-sm text-green-600">
                    {getExperienceLevelDisplay(preferences.experienceLevel)}
                  </p>
                </button>

                {/* Target Job Title */}
                <button
                  onClick={() =>
                    handlePreferenceEdit(
                      "targetJobTitle",
                      preferences.targetJobTitle,
                    )
                  }
                  className="rounded-xl bg-blue-50 p-4 text-center transition-colors hover:bg-blue-100"
                >
                  <div className="mx-auto mb-2 w-fit rounded-full bg-blue-500 p-2">
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
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-blue-800">
                    Target Job Title
                  </h3>
                  <p className="text-sm text-blue-600">
                    {preferences.targetJobTitle}
                  </p>
                </button>

                {/* Target Industry */}
                <button
                  onClick={() =>
                    handlePreferenceEdit(
                      "targetIndustry",
                      preferences.targetIndustry,
                    )
                  }
                  className="rounded-xl bg-purple-50 p-4 text-center transition-colors hover:bg-purple-100"
                >
                  <div className="mx-auto mb-2 w-fit rounded-full bg-purple-500 p-2">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-purple-800">
                    Target Industry
                  </h3>
                  <p className="text-sm text-purple-600">
                    {preferences.targetIndustry}
                  </p>
                </button>
              </div>

              {/* Last Scan Compatibility Progress */}
              <div className="mt-auto">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Last Scan Compatibility
                  </h3>
                  <span className="text-lg font-bold text-red-500">
                    87% Compatible
                  </span>
                </div>
                <div className="mb-2 h-3 w-full rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500"
                    style={{ width: "87%" }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Your profile matches well with recent scan preferences
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="lg:col-span-1">
            <div className="h-full rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2">
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">AI Insights</h2>
              </div>

              <div className="flex-1 space-y-4">
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="font-semibold text-green-800">
                      Resume Optimized
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your resume is performing 23% better than average
                  </p>
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-blue-600"
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
                    <span className="font-semibold text-blue-800">
                      Trending Skills
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    React & TypeScript demand up 18% this month
                  </p>
                </div>

                <div className="rounded-lg bg-orange-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="font-semibold text-orange-800">
                      Job Match
                    </span>
                  </div>
                  <p className="text-sm text-orange-700">
                    87% compatibility with recent postings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Scan Statistics, This Week Stats, and Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Scan Statistics - Styled */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 p-2">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Scan Usage</h2>
              </div>
              <ScanStatistics />
            </div>
          </div>

          {/* This Week Stats */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-lg h-full">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-2">
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
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">This Week</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Views</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">342</div>
                    <div className="text-xs text-green-600">+23%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Applications</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">8</div>
                    <div className="text-xs text-blue-600">+2 new</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Responses</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">5</div>
                    <div className="text-xs text-purple-600">63% rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-lg h-full">
              <div className="mb-6 flex items-center gap-3">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Quick Actions
                </h2>
              </div>

              <div className="space-y-3">
                <Link to="/resume-scan">
                  <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50">
                    <svg
                      className="h-5 w-5 text-gray-600"
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
                    <span className="font-medium text-gray-900">
                      Upload New Resume
                    </span>
                  </button>
                </Link>

                <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50">
                  <svg
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-medium text-gray-900">
                    Job Application Tracker
                  </span>
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50">
                  <svg
                    className="h-5 w-5 text-gray-600"
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
                  <span className="font-medium text-gray-900">
                    Skills Assessment
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Recent Activity (Full Width) */}
        <div className="grid gap-6">
          {/* Recent Activity - Full Width */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-2">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                >
                  <div className={`rounded-full ${activity.color} p-2`}>
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {activity.action}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Preference Modal */}
        {editingPreference && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-96 rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Edit{" "}
                {editingPreference === "experienceLevel"
                  ? "Experience Level"
                  : editingPreference === "targetJobTitle"
                    ? "Target Job Title"
                    : "Target Industry"}
              </h3>

              {editingPreference === "experienceLevel" ? (
                <select
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6-10 years)</option>
                  <option value="executive">Executive (10+ years)</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder={
                    editingPreference === "targetJobTitle"
                      ? "e.g., Software Engineer"
                      : "e.g., Technology"
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              )}

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={handlePreferenceCancel}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePreferenceSave}
                  className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:from-red-600 hover:to-pink-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
