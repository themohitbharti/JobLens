import React from "react";

const FeaturesList: React.FC = () => {
  const features = [
    "AI-Powered Resume Analysis",
    "Real-Time Feedback on Resume Quality",
    "Keyword Optimization Suggestions",
    "ATS Compatibility Checks",
    "Downloadable Reports with Insights",
    "User-Friendly Interface",
    "Secure and Confidential Processing",
  ];

  return (
    <div className="mt-8 w-full rounded-xl bg-gradient-to-r from-red-50 via-rose-50 to-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-red-700">
        Features of Our Resume Scanning Service
      </h3>
      <ul className="space-y-3 text-left">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturesList;
