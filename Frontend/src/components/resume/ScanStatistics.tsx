import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface ScanStatisticsProps {
  scansLeft?: number;
  completedScans?: number;
  lastResume?: {
    scanId: string;
    overallScore: number;
    scanDate: string;
  } | null;
}

const ScanStatistics: React.FC<ScanStatisticsProps> = ({
  scansLeft: propScansLeft,
  completedScans: propCompletedScans,
  lastResume: propLastResume,
}) => {
  const { user, resumeStatsData } = useSelector(
    (state: RootState) => state.auth,
  );

  // Use props if provided, otherwise use Redux state
  const scansLeft = propScansLeft ?? user?.scansLeft ?? 30;
  const completedScans =
    propCompletedScans ??
    resumeStatsData?.totalScans ??
    user?.resumeStats?.totalScans ??
    0;

  // Handle null values properly
  const lastResume =
    propLastResume !== undefined
      ? propLastResume
      : (resumeStatsData?.lastResume ?? user?.lastResume ?? null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Your Scan Usage
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <div className="mb-2">
            <span className="text-3xl font-bold text-red-600">{scansLeft}</span>
          </div>
          <span className="text-sm font-medium text-gray-600">
            Scans Remaining
          </span>
        </div>

        <div className="rounded-lg bg-green-50 p-4 text-center">
          <div className="mb-2">
            <span className="text-3xl font-bold text-green-600">
              {completedScans}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-600">
            Completed Scans
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="mb-2 flex justify-between text-sm text-gray-600">
          <span>Daily Usage</span>
          <span>{30 - scansLeft}/30</span>
        </div>
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300"
            style={{ width: `${((30 - scansLeft) / 30) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Last Resume Section - Handle null properly */}
      {lastResume && (
        <div className="mt-4 rounded-lg bg-blue-50 p-3">
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            Last Resume Scan
          </h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Score:{" "}
              <span className="font-semibold text-blue-600">
                {lastResume.overallScore}/100
              </span>
            </span>
            <span className="text-gray-500">
              {formatDate(lastResume.scanDate)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanStatistics;
