import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchResumeStats, fetchLastResumeScores } from "../store/authSlice";
import type { ResumeStatsData } from "../types";
import ScoreChart from "../components/resume/ScoreChart";

const ResumeStats = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { resumeStatsData, lastResumeScores, loading } = useSelector(
    (state: RootState) => state.auth,
  );
  const [stats, setStats] = useState<ResumeStatsData | null>(null);

  useEffect(() => {
    dispatch(fetchResumeStats());
    dispatch(fetchLastResumeScores());
  }, [dispatch]);

  useEffect(() => {
    if (resumeStatsData) {
      setStats(resumeStatsData);
    }
  }, [resumeStatsData]);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                Resume Analytics
              </h2>
              <p className="text-xl font-semibold text-gray-700">
                Track your resume performance and improvement trends
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
        </div>

        {/* Top Stats Cards */}
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
                {stats.bestScore}
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
                {stats.improvementPercentage}
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
              <div className="text-3xl font-bold text-gray-900">+15.0%</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  LinkedIn Improvement
                </span>
                <span className="text-xs text-orange-600">Market aligned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Category Performance
              </h2>
            </div>

            <div className="space-y-6">
              {/* Skills */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Skills</span>
                  <span className="font-semibold text-green-600">95%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: "95%" }}
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Experience</span>
                  <span className="font-semibold text-blue-600">92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: "92%" }}
                  />
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Education</span>
                  <span className="font-semibold text-purple-600">88%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: "88%" }}
                  />
                </div>
              </div>

              {/* Keywords */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Keywords</span>
                  <span className="font-semibold text-orange-600">89%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                    style={{ width: "89%" }}
                  />
                </div>
              </div>

              {/* Format */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Format</span>
                  <span className="font-semibold text-red-600">98%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500"
                    style={{ width: "98%" }}
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Contact</span>
                  <span className="font-semibold text-cyan-600">100%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Improvement Areas */}
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Improvement Areas
              </h2>
            </div>

            <div className="space-y-6">
              {/* Technical Skills */}
              <div className="rounded-lg bg-red-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-red-800">
                    Technical Skills
                  </span>
                  <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    High
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current: 89%</span>
                    <span className="text-gray-600">Target: 95%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500"
                      style={{ width: "89%" }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Add Docker, Kubernetes, and GraphQL to stay competitive
                </p>
              </div>

              {/* Leadership Experience */}
              <div className="rounded-lg bg-orange-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-orange-800">
                    Leadership Experience
                  </span>
                  <span className="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                    Medium
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current: 72%</span>
                    <span className="text-gray-600">Target: 85%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                      style={{ width: "72%" }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Highlight team lead roles and mentoring experience
                </p>
              </div>

              {/* Industry Keywords */}
              <div className="rounded-lg bg-yellow-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-yellow-800">
                    Industry Keywords
                  </span>
                  <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    Medium
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current: 85%</span>
                    <span className="text-gray-600">Target: 92%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Include more specific technology terms from job descriptions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Score History Trend - Updated */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-2">
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
                Score History Trend
              </h2>
            </div>

            <ScoreChart
              scores={lastResumeScores?.scores || []}
              loading={loading}
            />
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Trending Skills
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                <span className="font-medium text-green-800">React.js</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">47 mentions</span>
                  <span className="text-sm font-semibold text-green-600">
                    +12%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                <span className="font-medium text-blue-800">TypeScript</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">38 mentions</span>
                  <span className="text-sm font-semibold text-green-600">
                    +8%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-purple-50 p-3">
                <span className="font-medium text-purple-800">Node.js</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">32 mentions</span>
                  <span className="text-sm font-semibold text-green-600">
                    +5%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                <span className="font-medium text-red-800">Python</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">28 mentions</span>
                  <span className="text-sm font-semibold text-red-600">
                    -2%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                <span className="font-medium text-orange-800">AWS</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">42 mentions</span>
                  <span className="text-sm font-semibold text-green-600">
                    +15%
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

export default ResumeStats;
