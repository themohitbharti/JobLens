import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchResumeStats } from "../../store/authSlice";
import { Button, ScanStatistics } from "../index";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, resumeStatsData, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    // Fetch resume stats when dashboard loads
    dispatch(fetchResumeStats());
  }, [dispatch]);

  const stats = {
    totalScans:
      resumeStatsData?.totalScans ?? user?.resumeStats?.totalScans ?? 0,
    bestScore: resumeStatsData?.bestScore ?? user?.resumeStats?.bestScore ?? 0,
    averageScore:
      resumeStatsData?.weeklyAvg ?? user?.resumeStats?.weeklyAvg ?? 0,
    improvementTrend:
      resumeStatsData?.improvementTrend ??
      user?.resumeStats?.improvementTrend ??
      0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1
          className="mr-8 bg-clip-text text-5xl font-extrabold text-transparent"
          style={{
            background:
              "linear-gradient(135deg, hsl(0 114% 50%), hsl(195 54% 49%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.fullName}! Here's your resume optimization
          overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white">
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
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Total Scans
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalScans}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Best Score
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.bestScore}/100
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Average Score
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.averageScore.toFixed(1)}/100
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-md ${
                  stats.improvementTrend > 0
                    ? "bg-green-500"
                    : stats.improvementTrend < 0
                      ? "bg-red-500"
                      : "bg-gray-500"
                } text-white`}
              >
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
                    d={
                      stats.improvementTrend > 0
                        ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    }
                  />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Improvement Trend
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.improvementTrend > 0 ? "+" : ""}
                  {(stats.improvementTrend * 10).toFixed(1)}%
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Statistics Component */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ScanStatistics />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link to="/resume-scan">
                <Button className="w-full justify-start">
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  New Resume Scan
                </Button>
              </Link>

              <Link to="/resume-stats">
                <Button variant="default" className="w-full justify-start">
                  <svg
                    className="mr-2 h-5 w-5"
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
                  View Statistics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="py-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-red-500"></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
