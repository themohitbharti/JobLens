import React from "react";

interface AnalysisLoaderProps {
  label?: string;
}

const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({
  label = "Analyzing your resume...",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-100 via-orange-100 to-red-100">
      {/* Animated tangy background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-rose-400 via-red-400 to-orange-400 opacity-25 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-orange-400 via-amber-400 to-rose-400 opacity-25 blur-3xl animate-pulse" />
        <div className="absolute left-1/2 top-1/3 h-36 w-36 -translate-x-1/2 rounded-full bg-gradient-to-br from-red-300 to-orange-300 opacity-40 blur-2xl animate-[float_4s_ease-in-out_infinite]" />
      </div>

      <div className="relative text-center">
        {/* Glow halo */}
        <div className="absolute -top-10 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-red-300/20 blur-2xl" />

        {/* Gradient bordered resume card with scanning overlay */}
        <div className="relative mx-auto mb-7 w-72 rounded-2xl bg-gradient-to-r from-rose-400 via-red-400 to-orange-400 p-[2px] shadow-2xl">
          <div className="relative rounded-2xl bg-white/95 p-5">
            {/* Scanning line overlay */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <div className="scan-line"></div>
            </div>

            {/* Top header line */}
            <div className="mb-3 flex items-center justify-between">
              <div className="h-2 w-16 rounded bg-rose-200"></div>
              <div className="h-2 w-10 rounded bg-orange-200"></div>
            </div>

            {/* Text lines (skeleton) */}
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-gray-200/80"></div>
              <div className="h-3 w-5/6 rounded bg-gray-200/80"></div>
              <div className="h-3 w-4/6 rounded bg-gray-200/80"></div>
              <div className="h-3 w-11/12 rounded bg-gray-200/80"></div>
              <div className="h-3 w-8/12 rounded bg-gray-200/80"></div>
            </div>

            {/* Footer with spinner */}
            <div className="mt-4 flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
              <span className="ml-2 text-sm font-medium text-red-700">AI Analysis</span>
            </div>
          </div>
        </div>

        {/* Labels */}
        <p className="text-lg font-semibold bg-gradient-to-r from-rose-700 via-red-700 to-orange-700 bg-clip-text text-transparent">{label}</p>
        <p className="mt-1 text-sm text-red-600/80">This usually takes a few seconds.</p>
      </div>
    </div>
  );
};

export default AnalysisLoader;