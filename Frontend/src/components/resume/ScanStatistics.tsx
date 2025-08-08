import React from "react";

interface ScanStatisticsProps {
  scansLeft: number;
  completedScans: number;
}

const ScanStatistics: React.FC<ScanStatisticsProps> = ({
  scansLeft,
  completedScans,
}) => {
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
          <span>Monthly Usage</span>
          <span>{completedScans}/10</span>
        </div>
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300"
            style={{ width: `${(completedScans / 10) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ScanStatistics;
