import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex min-h-96 items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-red-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Loading Results...
        </h3>
        <p className="mt-2 text-gray-600">
          Please wait while we process your resume analysis
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
