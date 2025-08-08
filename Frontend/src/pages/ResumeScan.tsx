import React from "react";
import ResumeUpload from "../components/resume/ResumeUpload";

const ResumeScan: React.FC = () => {
  return (
    <div className="relative min-h-full">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-rose-100 opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-red-100 opacity-40 blur-2xl" />
      </div>

      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-extrabold text-gray-900">
            Resume Scan
          </h1>
          <p className="text-lg text-gray-600">
            Upload your resume and get instant, AI-powered feedback to boost
            your job search!
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          {/* Left: Upload & Stats */}
          <div>
            <ResumeUpload />
          </div>

          {/* Right: Features and Info */}
          <div className="space-y-6">
            {/* Features Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center">
                <div className="mr-4 rounded-full bg-red-100 p-3">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Why use our Resume Scanner?
                </h2>
              </div>

              <ul className="space-y-4">
                {[
                  "AI-Powered Resume Analysis",
                  "Real-Time Feedback on Resume Quality",
                  "Keyword Optimization Suggestions",
                  "ATS Compatibility Checks",
                  "Downloadable Reports with Insights",
                  "User-Friendly Interface",
                  "Secure and Confidential Processing",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
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
                    <span className="text-base font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips Card */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                💡 Pro Tips
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-500">•</span>
                  Upload your resume in PDF format for best results
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-500">•</span>
                  Ensure your resume is up-to-date before scanning
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-500">•</span>
                  Review all suggestions carefully before applying
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeScan;
