import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../index";

const Home = () => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      <div className="flex min-h-screen">
        {/* Left Section - Content */}
        <div className="flex flex-1 items-center justify-center px-8 lg:px-16">
          <div className="max-w-2xl">
            <h1 className="mb-8 text-5xl font-bold leading-tight text-gray-900 lg:text-6xl">
              Improve your resume
              <br />
              <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                and LinkedIn profile
              </span>
            </h1>

            <div className="mb-8 space-y-4 text-lg text-gray-600">
              <p>
                Designed by top recruiters, our AI-powered platform instantly
                gives you tailored feedback on your resume and LinkedIn profile.
              </p>
              <p className="font-medium text-red-600">
                Land 5x more interviews, opportunities and job offers.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button
                  variant="gradient"
                  className="px-8 py-4 text-lg font-semibold text-white"
                >
                  Get started for free
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
              </Link>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-6 py-4 text-lg font-semibold text-red-600 transition-colors hover:text-red-700"
              >
                See preview
                <svg
                  className={`ml-2 h-5 w-5 transition-transform ${
                    showPreview ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Dashboard Preview */}
        <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 lg:flex">
          <div className="relative">
            {/* Resume Document Mock */}
            <div className="relative z-10 w-80 rounded-lg bg-gray-800 p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-gray-400">resume.pdf</span>
              </div>

              {/* Resume Sections */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-red-400">
                    <span className="mr-2">📄</span>
                    IMPACT
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-3/4 rounded bg-gray-600"></div>
                    <div className="h-2 w-1/2 rounded bg-gray-600"></div>
                    <div className="h-2 w-2/3 rounded bg-gray-600"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-red-400">
                    <span className="mr-2">⚡</span>
                    BREVITY
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded bg-gray-600"></div>
                    <div className="h-2 w-4/5 rounded bg-gray-600"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-red-400">
                    <span className="mr-2">🎨</span>
                    STYLE
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-5/6 rounded bg-gray-600"></div>
                    <div className="h-2 w-3/5 rounded bg-gray-600"></div>
                    <div className="h-2 w-4/5 rounded bg-gray-600"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-red-400">
                    <span className="mr-2">💼</span>
                    SKILLS
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-2/3 rounded bg-gray-600"></div>
                    <div className="h-2 w-3/4 rounded bg-gray-600"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Card */}
            <div className="absolute -right-20 top-8 w-72 rounded-xl bg-white p-6 shadow-2xl">
              <div className="mb-6 text-center">
                <p className="mb-2 text-sm text-gray-600">
                  Your resume scored 78 out of 100.
                </p>
                <div className="relative mx-auto h-24 w-24">
                  <svg className="h-24 w-24 -rotate-90 transform">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${78 * 2.51} 251.2`}
                      className="text-red-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">78</span>
                    <span className="text-xs text-gray-500">Overall Score</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  BREAKDOWN
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="mb-1 text-xs font-medium text-red-600">
                      IMPACT
                    </div>
                    <div className="text-lg font-bold text-red-600">100</div>
                    <div className="text-xs text-red-600">EXCELLENT</div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-medium text-orange-500">
                      BREVITY
                    </div>
                    <div className="text-lg font-bold text-orange-500">65</div>
                    <div className="text-xs text-orange-500">AVERAGE</div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-medium text-green-500">
                      STYLE
                    </div>
                    <div className="text-lg font-bold text-green-500">90</div>
                    <div className="text-xs text-green-500">VERY GOOD</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="mr-3 h-16 w-16 rounded-full bg-green-100 p-2">
                    <div className="flex h-full items-center justify-center rounded-full bg-green-500">
                      <span className="text-lg font-bold text-green-600">100</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-xs text-gray-500">Impact Score</div>
                    <div className="flex items-center">
                      <svg className="mr-1 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">Quantifying impact</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Strong action verbs</span>
                </div>

                <div className="flex items-center text-sm">
                  <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">No spelling errors</span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -left-4 top-20 h-2 w-2 rounded-full bg-red-400 opacity-60"></div>
            <div className="absolute -bottom-8 left-16 h-3 w-3 rounded-full bg-rose-400 opacity-40"></div>
            <div className="absolute -right-8 -top-4 h-2 w-2 rounded-full bg-red-500 opacity-50"></div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="border-t border-gray-200 bg-white px-8 py-16 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              See how JobLens improves your resume
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Before JobLens
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Vague job descriptions
                  </div>
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    No quantified achievements
                  </div>
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Poor formatting
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-green-50 p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  After JobLens
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Clear, impactful descriptions
                  </div>
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Metrics-driven achievements
                  </div>
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Professional layout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;