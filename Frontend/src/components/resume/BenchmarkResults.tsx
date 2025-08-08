import React from "react";

interface BenchmarkResult {
  passed: boolean;
  score: number;
}

interface BenchmarkResultsProps {
  benchmarkResults: Record<string, BenchmarkResult>;
}

const BenchmarkResults: React.FC<BenchmarkResultsProps> = ({
  benchmarkResults,
}) => {
  const formatBenchmarkName = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const passedBenchmarks = Object.entries(benchmarkResults).filter(
    ([, result]) => result.passed,
  );
  const failedBenchmarks = Object.entries(benchmarkResults).filter(
    ([, result]) => !result.passed,
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Benchmark Results</h2>
        <p className="text-sm text-gray-600">
          ATS and industry standard compliance check
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Passed Benchmarks */}
        <div>
          <h3 className="mb-3 flex items-center text-lg font-semibold text-green-700">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Passed ({passedBenchmarks.length})
          </h3>
          <div className="space-y-2">
            {passedBenchmarks.map(([key, result]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg bg-green-50 p-3"
              >
                <span className="text-sm font-medium text-green-800">
                  {formatBenchmarkName(key)}
                </span>
                <span className="text-sm font-bold text-green-600">
                  {result.score}/10
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Failed Benchmarks */}
        <div>
          <h3 className="mb-3 flex items-center text-lg font-semibold text-red-700">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Failed ({failedBenchmarks.length})
          </h3>
          <div className="space-y-2">
            {failedBenchmarks.map(([key, result]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg bg-red-50 p-3"
              >
                <span className="text-sm font-medium text-red-800">
                  {formatBenchmarkName(key)}
                </span>
                <span className="text-sm font-bold text-red-600">
                  {result.score}/10
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkResults;
