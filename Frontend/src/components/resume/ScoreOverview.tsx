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
}

const ScoreOverview: React.FC<ScoreOverviewProps> = ({
  overallScore,
  improvementPotential,
  sectionScores,
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

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

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

      {/* Score Status */}
      <div className="mb-6 text-center">
        {overallScore >= 85 ? (
          <div className="rounded-full bg-green-100 px-4 py-2 text-green-800">
            <span className="font-medium">Excellent</span> - Top 5% of resumes
          </div>
        ) : overallScore >= 70 ? (
          <div className="rounded-full bg-yellow-100 px-4 py-2 text-yellow-800">
            <span className="font-medium">Good</span> - Above average
          </div>
        ) : (
          <div className="rounded-full bg-red-100 px-4 py-2 text-red-800">
            <span className="font-medium">Needs Work</span> - Below average
          </div>
        )}
      </div>

      {/* Improvement Potential */}
      <div className="mb-6 rounded-lg bg-blue-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            Improvement Potential
          </span>
          <span className="text-lg font-bold text-blue-600">
            +{improvementPotential} points
          </span>
        </div>
        <p className="mt-1 text-xs text-blue-700">
          Potential score after implementing suggestions
        </p>
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
