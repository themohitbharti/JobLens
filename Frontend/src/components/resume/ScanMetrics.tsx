import React from "react";

interface ContentInfo {
  originalWordCount: number;
  processedWordCount: number;
  wasTruncated: boolean;
  estimatedTokensUsed: number;
}

interface UsedPreferences {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
  isUsingDefaults: {
    industry: boolean;
    experienceLevel: boolean;
    jobTitle: boolean;
  };
}

interface ScanMetricsProps {
  processingTime: number;
  contentInfo: ContentInfo;
  usedPreferences: UsedPreferences;
}

const ScanMetrics: React.FC<ScanMetricsProps> = ({
  processingTime,
  contentInfo,
  usedPreferences,
}) => {
  const formatProcessingTime = (time: number) => {
    return (time / 1000).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Processing Info */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Scan Information
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Processing Time:</span>
            <span className="text-sm font-medium text-gray-900">
              {formatProcessingTime(processingTime)}s
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Word Count:</span>
            <span className="text-sm font-medium text-gray-900">
              {contentInfo.originalWordCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Tokens Used:</span>
            <span className="text-sm font-medium text-gray-900">
              {contentInfo.estimatedTokensUsed}
            </span>
          </div>
          {contentInfo.wasTruncated && (
            <div className="rounded-md bg-yellow-50 p-2">
              <p className="text-xs text-yellow-800">
                ⚠️ Content was truncated for processing
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preferences Used */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Analysis Preferences
        </h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-600">Target Industry:</span>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">
                {usedPreferences.targetIndustry}
              </span>
              {usedPreferences.isUsingDefaults.industry && (
                <span className="ml-2 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  Default
                </span>
              )}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Experience Level:</span>
            <div className="flex items-center">
              <span className="text-sm font-medium capitalize text-gray-900">
                {usedPreferences.experienceLevel}
              </span>
              {usedPreferences.isUsingDefaults.experienceLevel && (
                <span className="ml-2 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  Default
                </span>
              )}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Target Job Title:</span>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">
                {usedPreferences.targetJobTitle}
              </span>
              {usedPreferences.isUsingDefaults.jobTitle && (
                <span className="ml-2 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  Default
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanMetrics;
