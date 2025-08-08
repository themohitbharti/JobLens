import React from "react";

interface SectionScore {
  sectionName: string;
  score: number;
  weight: number;
}

interface ScoreOverviewProps {
  overallScore: number;
  improvementPotential: number;
  sectionScores: SectionScore[];
  isMainView?: boolean;
}

const ScoreOverview: React.FC<ScoreOverviewProps> = ({
  overallScore,
  improvementPotential,
  sectionScores,
  isMainView = false,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 8) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (score >= 6) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-rose-500";
  };

  const circumference = 2 * Math.PI * (isMainView ? 65 : 45);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  if (isMainView) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Resume Score
          </h2>
          <p className="mb-8 text-gray-600">Your overall performance rating</p>

          {/* Large Circular Score Display */}
          <div className="relative mb-8 flex justify-center">
            <svg
              className="h-48 w-48 -rotate-90 transform"
              viewBox="0 0 140 140"
            >
              <circle
                cx="70"
                cy="70"
                r="65"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="70"
                cy="70"
                r="65"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className={getScoreColor(overallScore / 10)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className={`text-5xl font-bold ${getScoreColor(overallScore / 10)}`}
                >
                  {overallScore}
                </div>
                <div className="text-lg font-medium text-gray-600">
                  out of 100
                </div>
              </div>
            </div>
          </div>

          {/* Score Status */}
          <div className="mb-8">
            {overallScore >= 85 ? (
              <div className="mx-auto w-fit rounded-full bg-green-100 px-6 py-3 text-green-800">
                <span className="text-lg font-semibold">🎉 Excellent</span>
                <p className="mt-1 text-sm">Top 5% of resumes</p>
              </div>
            ) : overallScore >= 70 ? (
              <div className="mx-auto w-fit rounded-full bg-yellow-100 px-6 py-3 text-yellow-800">
                <span className="text-lg font-semibold">👍 Good</span>
                <p className="mt-1 text-sm">Above average performance</p>
              </div>
            ) : (
              <div className="mx-auto w-fit rounded-full bg-red-100 px-6 py-3 text-red-800">
                <span className="text-lg font-semibold">💪 Needs Work</span>
                <p className="mt-1 text-sm">Room for improvement</p>
              </div>
            )}
          </div>

          {/* Improvement Potential */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <div className="mb-2 flex items-center justify-center">
              <svg
                className="mr-2 h-6 w-6 text-blue-600"
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
              <span className="text-xl font-semibold text-blue-900">
                Improvement Potential
              </span>
            </div>
            <div className="mb-1 text-3xl font-bold text-blue-600">
              +{improvementPotential} points
            </div>
            <p className="text-blue-700">
              Potential score after implementing AI suggestions
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Original compact view for sidebar
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">Resume Score</h2>
        <p className="text-sm text-gray-600">Overall performance rating</p>
      </div>

      {/* Circular Score Display */}
      <div className="relative mb-6 flex justify-center">
        <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={getScoreColor(overallScore / 10)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className={`text-3xl font-bold ${getScoreColor(overallScore / 10)}`}
            >
              {overallScore}
            </div>
            <div className="text-sm font-medium text-gray-600">out of 100</div>
          </div>
        </div>
      </div>

      {/* Section Breakdown */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Section Breakdown
        </h3>
        <div className="space-y-3">
          {sectionScores.map((section, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {section.sectionName}
              </span>
              <div className="flex items-center">
                <div className="mr-3 h-2 w-16 rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full ${getScoreBarColor(section.score)}`}
                    style={{ width: `${(section.score / 10) * 100}%` }}
                  />
                </div>
                <span
                  className={`text-sm font-bold ${getScoreColor(section.score)}`}
                >
                  {section.score}/10
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreOverview;
