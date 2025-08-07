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
    <div className="my-6 flex w-full items-center justify-around rounded-lg bg-red-50 px-6 py-4 shadow">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-red-600">{scansLeft}</span>
        <span className="text-xs text-gray-500">Scans Left</span>
      </div>
      <div className="h-8 w-px bg-red-200" />
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-green-600">
          {completedScans}
        </span>
        <span className="text-xs text-gray-500">Completed Scans</span>
      </div>
    </div>
  );
};

export default ScanStatistics;
