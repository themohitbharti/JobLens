import React from "react";
import type { ResumeScoreHistory } from "../../types";

interface ScoreChartProps {
  scores: ResumeScoreHistory[];
  loading?: boolean;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ scores, loading }) => {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-500"></div>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No scan history
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload your first resume to see score trends
          </p>
        </div>
      </div>
    );
  }

  // Sort scores by date
  const sortedScores = [...scores].sort(
    (a, b) => new Date(a.scanDate).getTime() - new Date(b.scanDate).getTime(),
  );

  // Calculate chart dimensions
  const chartWidth = 400;
  const chartHeight = 200;
  const padding = 40;
  const innerWidth = chartWidth - padding * 2;
  const innerHeight = chartHeight - padding * 2;

  // Find min and max scores for scaling
  const minScore = Math.min(...sortedScores.map((s) => s.overallScore));
  const maxScore = Math.max(...sortedScores.map((s) => s.overallScore));
  const chartMinScore = Math.max(0, minScore - 10);
  const chartMaxScore = Math.min(100, maxScore + 10);
  const chartRange = chartMaxScore - chartMinScore;

  // Create points for the line
  const points = sortedScores.map((score, index) => {
    const x = padding + (index / (sortedScores.length - 1 || 1)) * innerWidth;
    const y =
      padding +
      ((chartMaxScore - score.overallScore) / chartRange) * innerHeight;
    return { x, y, score: score.overallScore, date: score.scanDate };
  });

  // Create path string for the line
  const pathD = points.reduce((path, point, index) => {
    const command = index === 0 ? "M" : "L";
    return `${path} ${command} ${point.x} ${point.y}`;
  }, "");

  // Create gradient path for fill
  const fillPathD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // Calculate trend
  const firstScore = sortedScores[0]?.overallScore || 0;
  const lastScore = sortedScores[sortedScores.length - 1]?.overallScore || 0;
  const trend = lastScore - firstScore;

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Score Trend</h3>
          <p className="text-sm text-gray-500">Last {scores.length} scans</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(lastScore)}`}>
            {lastScore}
          </div>
          <div className="flex items-center text-sm">
            {trend > 0 ? (
              <svg
                className="mr-1 h-4 w-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : trend < 0 ? (
              <svg
                className="mr-1 h-4 w-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="mr-1 h-4 w-4 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span
              className={
                trend > 0
                  ? "text-green-600"
                  : trend < 0
                    ? "text-red-600"
                    : "text-gray-600"
              }
            >
              {trend > 0 ? "+" : ""}
              {trend} points
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="w-full overflow-visible rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => {
            const y =
              padding + ((chartMaxScore - value) / chartRange) * innerHeight;
            return (
              <g key={value}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="rgba(156, 163, 175, 0.3)"
                  strokeWidth="1"
                />
                <text
                  x={padding - 8}
                  y={y + 4}
                  fill="rgba(107, 114, 128, 0.7)"
                  fontSize="12"
                  textAnchor="end"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id="scoreGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="rgb(99, 102, 241)"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="rgb(99, 102, 241)"
                stopOpacity="0.05"
              />
            </linearGradient>
          </defs>

          {/* Fill area */}
          <path d={fillPathD} fill="url(#scoreGradient)" stroke="none" />

          {/* Main line */}
          <path
            d={pathD}
            fill="none"
            stroke="rgb(99, 102, 241)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="white"
                stroke="rgb(99, 102, 241)"
                strokeWidth="3"
                className="hover:r-8 cursor-pointer transition-all"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="2"
                fill="rgb(99, 102, 241)"
              />
            </g>
          ))}

          {/* X-axis labels */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={chartHeight - padding + 20}
              fill="rgba(107, 114, 128, 0.7)"
              fontSize="12"
              textAnchor="middle"
            >
              {formatDate(point.date)}
            </text>
          ))}
        </svg>
      </div>

      {/* Score details */}
      <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {firstScore}
          </div>
          <div className="text-sm text-gray-500">First Score</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {Math.round((minScore + maxScore) / 2)}
          </div>
          <div className="text-sm text-gray-500">Average</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{maxScore}</div>
          <div className="text-sm text-gray-500">Best Score</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;
