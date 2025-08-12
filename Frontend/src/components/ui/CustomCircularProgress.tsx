import React, { useState, useEffect } from "react";

interface CustomCircularProgressProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

const CustomCircularProgress: React.FC<CustomCircularProgressProps> = ({
  score,
  size = 120,
  strokeWidth = 8,
}) => {
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateScore(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (score / 10) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  const getGradientColors = (score: number) => {
    if (score >= 8) {
      return {
        start: "#10b981", // emerald-500
        middle: "#059669", // emerald-600
        end: "#047857", // emerald-700
      };
    } else if (score >= 6) {
      return {
        start: "#f59e0b", // amber-500
        middle: "#d97706", // amber-600
        end: "#b45309", // amber-700
      };
    } else if (score >= 4) {
      return {
        start: "#f97316", // orange-500
        middle: "#ea580c", // orange-600
        end: "#c2410c", // orange-700
      };
    } else {
      return {
        start: "#ef4444", // red-500
        middle: "#dc2626", // red-600
        end: "#b91c1c", // red-700
      };
    }
  };

  const colors = getGradientColors(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90 transform">
        <defs>
          <linearGradient
            id={`progressGradient-${score}-${size}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="50%" stopColor={colors.middle} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
          <filter id={`shadow-${score}-${size}`}>
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="rgba(0,0,0,0.1)"
            />
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="drop-shadow-sm"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#progressGradient-${score}-${size})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={animateScore ? offset : circumference}
          strokeLinecap="round"
          filter={`url(#shadow-${score}-${size})`}
          className="duration-2000 transition-all ease-out"
        />

        {/* Inner glow circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth / 2}
          stroke="none"
          fill="rgba(255,255,255,0.05)"
          className="pointer-events-none"
        />
      </svg>

      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{score}</span>
        <span className="text-xs font-medium text-gray-500">/ 10</span>
      </div>
    </div>
  );
};

export default CustomCircularProgress;
