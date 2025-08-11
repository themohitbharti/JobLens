import React from "react";
import ResumeUpload from "../components/resume/ResumeUpload";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const ResumeScan: React.FC = () => {
  const scansLeft = useSelector(
    (state: RootState) => state.auth.user?.scansLeft ?? 30,
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-rose-100 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-red-100 opacity-15 blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-pink-100 opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
            Resume Scanner
          </h1>
          <p className="text-xl font-medium text-gray-700">
            Upload your resume and get instant, AI-powered feedback to boost
            your job search!
          </p>
        </div>

        {/* Daily Scans Left Tab */}
        <div className="mx-auto mb-10 flex max-w-xs items-center justify-center rounded-xl border border-white/40 bg-white/60 p-4 shadow backdrop-blur-sm">
          <span className="text-sm font-medium text-gray-700">
            Daily scans remaining:
          </span>
          <span
            className={`ml-2 text-sm font-bold ${
              scansLeft > 5
                ? "text-green-600"
                : scansLeft > 0
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {scansLeft}/30
          </span>
        </div>

        {/* Upload Section - Grand and Stylish (Full Width) */}
        <div className="mb-16">
          <div className="border-gradient-to-r relative rounded-3xl border-2 bg-gradient-to-br from-red-200 via-pink-200 to-purple-200 p-8 shadow-2xl backdrop-blur-xl">
            {/* Decorative elements for the upload section */}
            <div className="pointer-events-none absolute -left-4 -top-4 h-8 w-8 rounded-full bg-gradient-to-r from-red-400 to-pink-400 opacity-60 blur-sm"></div>
            <div className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 opacity-40 blur-md"></div>
            <div className="pointer-events-none absolute -bottom-4 -left-4 h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 opacity-50 blur-sm"></div>

            {/* Header for upload section */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 shadow-xl">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h2 className="mb-3 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                Upload Your Resume
              </h2>
              <p className="text-lg font-medium text-gray-700">
                Drop your resume here and let our AI analyze it instantly
              </p>

              {/* Feature highlights */}
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                {[
                  { icon: "🚀", text: "Instant Analysis" },
                  { icon: "🎯", text: "ATS Optimized" },
                  { icon: "📊", text: "Detailed Report" },
                  { icon: "🔒", text: "100% Secure" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 rounded-full bg-white/60 px-4 py-2 shadow-md backdrop-blur-sm"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-semibold text-gray-700">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Component */}
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <ResumeUpload />
            </div>

            {/* Bottom decorative stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { number: "10K+", label: "Resumes Analyzed" },
                { number: "95%", label: "Success Rate" },
                { number: "24/7", label: "Available" },
                { number: "3min", label: "Average Time" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side by Side Layout for Features and Tips */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Features Card */}
          <div className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-white/80 via-pink-50/80 to-purple-100/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-lg">
                <svg
                  className="h-8 w-8 text-white"
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
                Why Choose Our Scanner?
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Powered by advanced AI technology
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  ),
                  title: "AI-Powered Analysis",
                  description: "Advanced algorithms analyze your resume",
                },
                {
                  icon: (
                    <svg
                      className="h-5 w-5"
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
                  ),
                  title: "Real-Time Feedback",
                  description: "Instant suggestions for improvement",
                },
                {
                  icon: (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
                      />
                    </svg>
                  ),
                  title: "Keyword Optimization",
                  description: "ATS-friendly keyword suggestions",
                },
                {
                  icon: (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  ),
                  title: "ATS Compatibility",
                  description: "Ensure your resume passes ATS filters",
                },
                {
                  icon: (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  ),
                  title: "Downloadable Reports",
                  description: "Get detailed PDF reports with insights",
                },
                {
                  icon: (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  ),
                  title: "Secure Processing",
                  description: "Your data is encrypted and confidential",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group flex items-start space-x-4 rounded-xl border border-white/40 bg-gradient-to-r from-white/60 to-white/40 p-4 backdrop-blur-sm transition-all hover:border-red-200 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg transition-transform group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips Card */}
          <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 shadow-xl">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900">💡 Pro Tips</h3>
              <p className="text-sm text-blue-600">
                Maximize your scan results
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: (
                    <svg
                      className="h-4 w-4"
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
                  ),
                  text: "Upload your resume in PDF format for best results",
                },
                {
                  icon: (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  ),
                  text: "Ensure your resume is up-to-date before scanning",
                },
                {
                  icon: (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  ),
                  text: "Review all suggestions carefully before applying",
                },
                {
                  icon: (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  text: "Use the detailed feedback to optimize your resume",
                },
              ].map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-100/60 to-indigo-100/60 p-3 backdrop-blur-sm"
                >
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    {tip.icon}
                  </div>
                  <p className="text-sm font-medium text-blue-800">
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeScan;
