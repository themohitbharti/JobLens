import React from "react";
import LinkedinUpload from "../components/linkedin/LinkedinUpload";

const LinkedinScan: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-100 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-100 opacity-15 blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-100 opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
            LinkedIn Analyzer
          </h1>
          <p className="text-xl font-medium text-gray-700">
            Upload your LinkedIn profile and get AI-powered insights to enhance
            your professional presence!
          </p>
        </div>

        {/* Upload Section - Grand and Stylish (Full Width) */}
        <div className="mb-16">
          <div className="border-gradient-to-r relative rounded-3xl border-2 bg-gradient-to-br from-blue-200 via-blue-50/90 to-purple-200 p-8 shadow-2xl backdrop-blur-xl">
            {/* Decorative elements for the upload section */}
            <div className="pointer-events-none absolute -left-4 -top-4 h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-60 blur-sm"></div>
            <div className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-40 blur-md"></div>
            <div className="pointer-events-none absolute -bottom-4 -left-4 h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-50 blur-sm"></div>

            {/* Header for upload section */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-xl">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                Analyze Your LinkedIn Profile
              </h2>
              <p className="text-lg font-medium text-gray-700">
                Upload your LinkedIn profile and get comprehensive AI-powered
                insights
              </p>

              {/* Feature highlights */}
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                {[
                  { icon: "👔", text: "Professional Analysis" },
                  { icon: "🎯", text: "Industry Focused" },
                  { icon: "📈", text: "Growth Insights" },
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
              <LinkedinUpload />
            </div>

            {/* Bottom decorative stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { number: "5K+", label: "Profiles Analyzed" },
                { number: "92%", label: "Success Rate" },
                { number: "24/7", label: "Available" },
                { number: "2min", label: "Average Time" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
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
          <div className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-white/80 via-blue-50/80 to-indigo-100/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
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
                Why Choose Our LinkedIn Analyzer?
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  ),
                  title: "Professional Branding Analysis",
                  description:
                    "Comprehensive review of your professional image",
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
                  title: "Real-Time Insights",
                  description:
                    "Instant recommendations for profile improvement",
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
                  description: "Industry-specific keyword suggestions",
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ),
                  title: "Network Enhancement",
                  description: "Tips to improve your professional network",
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
                  title: "Detailed Reports",
                  description:
                    "Comprehensive analysis with actionable insights",
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
                  title: "Privacy Protected",
                  description: "Your data is encrypted and confidential",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group flex items-start space-x-4 rounded-xl border border-white/40 bg-gradient-to-r from-white/60 to-white/40 p-4 backdrop-blur-sm transition-all hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transition-transform group-hover:scale-110">
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
          <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 p-8 shadow-xl">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
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
              <h3 className="text-xl font-bold text-indigo-900">💡 Pro Tips</h3>
              <p className="text-sm text-indigo-600">
                Maximize your analysis results
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
                  text: "Download your LinkedIn profile as PDF for best analysis",
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
                  text: "Keep your profile updated before analysis",
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
                  text: "Set preferences for industry-specific recommendations",
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
                  text: "Use insights to enhance your professional presence",
                },
              ].map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-100/60 to-purple-100/60 p-3 backdrop-blur-sm"
                >
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    {tip.icon}
                  </div>
                  <p className="text-sm font-medium text-indigo-800">
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What You'll Get from LinkedIn Analysis Section - Full Width */}
        <div className="border-gradient-to-r rounded-3xl border-2 bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="mb-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              What You'll Get from LinkedIn Analysis
            </h3>
            <p className="text-lg font-medium text-gray-700">
              Comprehensive insights to transform your LinkedIn profile into a
              professional magnet
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: (
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
                title: "Profile Strength Score",
                description:
                  "Get a comprehensive score based on LinkedIn best practices",
                gradient: "from-blue-500 to-indigo-500",
              },
              {
                icon: (
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ),
                title: "Professional Branding",
                description:
                  "Analysis of your professional image and personal branding",
                gradient: "from-indigo-500 to-purple-500",
              },
              {
                icon: (
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: "Content Optimization",
                description:
                  "Recommendations to improve your posts and content strategy",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: (
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                title: "Network Analysis",
                description:
                  "Insights on your connections and networking effectiveness",
                gradient: "from-pink-500 to-red-500",
              },
            ].map((item, idx) => (
              <div key={idx} className="group text-center">
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r ${item.gradient} shadow-xl transition-transform group-hover:scale-110`}
                >
                  {item.icon}
                </div>
                <h4 className="mb-3 text-xl font-bold text-gray-900">
                  {item.title}
                </h4>
                <p className="text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional stats row */}
          <div className="mt-12 grid grid-cols-1 gap-8 border-t border-gray-200 pt-8 md:grid-cols-3">
            {[
              {
                icon: "🚀",
                stat: "5x More Views",
                label: "Increased Profile Visibility",
              },
              {
                icon: "💼",
                stat: "3x More Recruiters",
                label: "Enhanced Professional Reach",
              },
              {
                icon: "🎯",
                stat: "Industry Focused",
                label: "Tailored Recommendations",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="mb-3 text-3xl">{item.icon}</div>
                <div className="mb-1 text-lg font-bold text-gray-900">
                  {item.stat}
                </div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedinScan;
