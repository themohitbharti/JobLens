import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../store/store";
import { fetchLinkedinStats } from "../store/authSlice";
import type { LinkedinStatsData } from "../types";
import ScoreChart from "../components/resume/ScoreChart";

const LinkedinStats = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { linkedinStatsData, loading } = useSelector(
    (state: RootState) => state.auth,
  );
  const [stats, setStats] = useState<LinkedinStatsData | null>(null);

  useEffect(() => {
    dispatch(fetchLinkedinStats());
  }, [dispatch]);

  useEffect(() => {
    if (linkedinStatsData) {
      setStats(linkedinStatsData);
    }
  }, [linkedinStatsData]);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleViewLastLinkedin = () => {
    if (stats.lastLinkedins && stats.lastLinkedins.length > 0) {
      navigate(`/linkedin-builder-result/${stats.lastLinkedins[0].scanId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                LinkedIn Analytics
              </h2>
              <p className="text-xl font-semibold text-gray-700">
                Track your LinkedIn profile performance and improvement trends
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
              <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-600 hover:to-indigo-600">
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
        </div>

        {/* Main Content Area with Side Panel Layout */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left Side - Graph and Top Cards */}
          <div className="space-y-6 lg:col-span-3">
            {/* Top Stats Cards - Only over the left side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Weekly Average */}
              <div className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 opacity-60"></div>
                <div className="relative">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-2">
                      <svg
                        className="h-4 w-4 text-white"
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
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.weeklyAvg}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">
                      Weekly Average
                    </span>
                    <span className="text-xs text-blue-600">
                      {stats.weeklyScans} scans
                    </span>
                  </div>
                </div>
              </div>

              {/* Best Score */}
              <div className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 opacity-60"></div>
                <div className="relative">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-2">
                      <svg
                        className="h-4 w-4 text-white"
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
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.bestScore}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">
                      Best Score
                    </span>
                    <span className="text-xs text-green-600">
                      Personal Best
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Last LinkedIn Reference - Moved here for height balance */}
            {stats.lastLinkedins && stats.lastLinkedins.length > 0 && (
              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-2">
                      <svg
                        className="h-4 w-4 text-white"
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
                      <h3 className="text-sm font-bold text-blue-800">
                        Last LinkedIn Scan
                      </h3>
                      <p className="text-xs text-blue-600">
                        Recent analysis results
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleViewLastLinkedin}
                    className="rounded-full border border-blue-300 bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200"
                  >
                    View Details
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-900">
                    Score: {stats.lastLinkedins[0].overallScore}%
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {formatDate(stats.lastLinkedins[0].scanDate)}
                  </span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-blue-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{
                      width: `${stats.lastLinkedins[0].overallScore}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Score History Chart */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
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
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Score History Trend
                  </h2>
                  <p className="text-sm text-gray-600">
                    Your LinkedIn profile improvement journey
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden">
                <ScoreChart
                  scores={stats.lastLinkedins || []}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Stats Dashboard */}
          <div className="lg:col-span-2">
            <div className="relative rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 shadow-xl h-full">
              {/* Decorative Elements */}
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 opacity-20"></div>

              <div className="relative">
                {/* Top Section - Enhanced Semicircle */}
                <div className="relative mb-8">
                  <div className="mx-auto h-40 w-80 overflow-hidden rounded-t-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 shadow-lg">
                    <div className="flex h-full items-end justify-center pb-6">
                      <div className="text-center text-white">
                        <div className="mb-1 text-4xl font-bold">
                          {stats.totalScans}
                        </div>
                        <div className="text-sm font-medium opacity-90">
                          Total Scans
                        </div>
                      </div>
                    </div>

                    {/* Glowing effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-10"></div>
                  </div>

                  {/* Enhanced Improvement Badge */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 transform">
                    <div className="flex items-center gap-2 rounded-full border-2 border-green-100 bg-white px-4 py-2 text-sm font-bold text-green-600 shadow-lg">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {stats.improvementPercentage}
                    </div>
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="mb-8 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 text-center shadow-md">
                    <div className="mb-1 text-3xl font-bold text-blue-700">
                      {stats.weeklyScans}
                    </div>
                    <div className="text-xs font-medium text-blue-600">
                      This Week
                    </div>
                  </div>
                  <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 text-center shadow-md">
                    <div className="mb-1 text-3xl font-bold text-indigo-700">
                      {stats.weeklyAvg}
                    </div>
                    <div className="text-xs font-medium text-indigo-600">
                      Weekly Avg
                    </div>
                  </div>
                  <div className="col-span-2 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-6 text-center shadow-md">
                    <div className="mb-2 text-4xl font-bold text-green-700">
                      {stats.bestScore}
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      Personal Best Score
                    </div>
                  </div>
                  {/* Scans Left Card */}
                  <div className="col-span-2 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-100 p-4 text-center shadow-md">
                    <div className="mb-1 text-2xl font-bold text-purple-700">
                      {stats.scansLeft} Scans Left
                    </div>
                    <div className="text-xs font-medium text-purple-600">
                      Daily Limit Remaining
                    </div>
                  </div>
                </div>

                {/* Enhanced Trend Interpretation - Final section */}
                <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-md">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800">
                      Progress Status
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        stats.trendInterpretation.status === "good"
                          ? "border border-green-200 bg-green-100 text-green-800"
                          : stats.trendInterpretation.status === "neutral"
                          ? "border border-blue-200 bg-blue-100 text-blue-800"
                          : "border border-yellow-200 bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {stats.trendInterpretation.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    {stats.trendInterpretation.message}
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Trend: </span>
                    <span
                      className={`ml-2 font-bold ${
                        stats.improvementTrend > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stats.improvementTrend > 0 ? "+" : ""}
                      {stats.improvementTrend.toFixed(2)} points
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category Performance */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Profile Performance
              </h2>
            </div>

            <div className="space-y-6">
              {/* Professional Summary */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Summary</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: "92%" }}
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Experience</span>
                  <span className="font-semibold text-blue-600">88%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: "88%" }}
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Skills</span>
                  <span className="font-semibold text-purple-600">95%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: "95%" }}
                  />
                </div>
              </div>

              {/* Keywords */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Keywords</span>
                  <span className="font-semibold text-orange-600">85%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>

              {/* Network */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Network</span>
                  <span className="font-semibold text-cyan-600">78%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: "78%" }}
                  />
                </div>
              </div>

              {/* Engagement */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Engagement</span>
                  <span className="font-semibold text-pink-600">82%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"
                    style={{ width: "82%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trending Skills */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
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
              <h2 className="text-xl font-bold text-gray-900">
                Top Skills
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                <span className="font-medium text-green-800">Leadership</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">52 endorsements</span>
                  <span className="text-sm font-semibold text-green-600">
                    +15%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                <span className="font-medium text-blue-800">Project Management</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">43 endorsements</span>
                  <span className="text-sm font-semibold text-green-600">
                    +10%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-purple-50 p-3">
                <span className="font-medium text-purple-800">Digital Marketing</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">38 endorsements</span>
                  <span className="text-sm font-semibold text-green-600">
                    +8%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                <span className="font-medium text-red-800">Data Analysis</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">35 endorsements</span>
                  <span className="text-sm font-semibold text-red-600">
                    -3%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                <span className="font-medium text-orange-800">Communication</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">47 endorsements</span>
                  <span className="text-sm font-semibold text-green-600">
                    +12%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedinStats;