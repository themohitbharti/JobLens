import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface ScanStatisticsProps {
  scansLeft?: number;
  completedScans?: number;
  lastResumes?: Array<{
    scanId: string;
    overallScore: number;
    scanDate: string;
  }>;
}

const ScanStatistics: React.FC<ScanStatisticsProps> = ({
  scansLeft: propScansLeft,
  completedScans: propCompletedScans,
  lastResumes: propLastResumes,
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

  // Handle arrays properly - get the most recent resume
  const lastResumes =
    propLastResumes !== undefined
      ? propLastResumes
      : (resumeStatsData?.lastResumes ?? user?.lastResumes ?? []);

  const mostRecentResume = lastResumes.length > 0 ? lastResumes[0] : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Scan Statistics
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{scansLeft}</div>
          <div className="text-sm text-gray-600">Scans Left</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {completedScans}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
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

      {/* Last Resume Section - Updated for array */}
      {mostRecentResume && (
        <div className="mt-4 rounded-lg bg-blue-50 p-3">
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            Last Resume Scan
          </h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Score:{" "}
              <span className="font-medium text-gray-900">
                {mostRecentResume.overallScore}%
              </span>
            </span>
            <span className="text-gray-500">
              {formatDate(mostRecentResume.scanDate)}
            </span>
          </div>

          {/* Show recent scan history if multiple scans available */}
          {lastResumes.length > 1 && (
            <div className="mt-2 border-t border-blue-100 pt-2">
              <div className="text-xs text-gray-500">Recent Scores:</div>
              <div className="flex space-x-2 text-xs">
                {lastResumes.slice(1, 4).map((resume) => (
                  <span key={resume.scanId} className="text-gray-600">
                    {resume.overallScore}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanStatistics;
