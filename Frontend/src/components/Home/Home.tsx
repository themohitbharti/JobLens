import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../index";

const Home = () => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden px-8 py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center rounded-full bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
                ✨ Ready to transform your career?
              </div>
              
              <h1 className="mb-8 text-5xl font-bold leading-tight text-white lg:text-7xl">
                Improve your{" "}
                <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                  resume
                </span>
                <br />
                and LinkedIn profile
              </h1>

              <p className="mb-4 text-xl text-gray-300 lg:text-2xl">
                Designed by top recruiters, our AI-powered platform instantly gives you tailored feedback on your resume and LinkedIn profile.
              </p>
              
              <p className="mb-8 text-lg font-semibold text-red-400">
                Land 5x more interviews, opportunities and job offers.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link to="/signup">
                  <Button
                    variant="gradient"
                    className="w-full px-8 py-4 text-lg font-semibold text-white sm:w-auto"
                  >
                    Get Started Free
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center justify-center px-6 py-4 text-lg font-semibold text-gray-300 transition-colors hover:text-white"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-7 4h6" />
                  </svg>
                  See preview
                </button>
              </div>

              <p className="mt-6 text-sm text-gray-400">
                No credit card required • Free forever plan available
              </p>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="relative z-10 rounded-2xl bg-gray-800/50 p-8 backdrop-blur-sm border border-gray-700">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-400">JobLens Dashboard</span>
                </div>

                {/* Score Circle */}
                <div className="mb-8 text-center">
                  <div className="relative mx-auto h-32 w-32">
                    <svg className="h-32 w-32 -rotate-90 transform">
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700" />
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${78 * 3.51} 352`} className="text-red-500" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-white">78</span>
                      <span className="text-sm text-gray-400">Overall Score</span>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-300">Your resume scored 78 out of 100.</p>
                </div>

                {/* Breakdown Section */}
                <div className="mb-6">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Breakdown</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg bg-green-500/10 p-4 border border-green-500/20">
                      <div className="text-2xl font-bold text-green-400">100</div>
                      <div className="text-xs text-green-400">EXCELLENT</div>
                      <div className="text-xs text-gray-400">IMPACT</div>
                    </div>
                    <div className="rounded-lg bg-orange-500/10 p-4 border border-orange-500/20">
                      <div className="text-2xl font-bold text-orange-400">65</div>
                      <div className="text-xs text-orange-400">AVERAGE</div>
                      <div className="text-xs text-gray-400">BREVITY</div>
                    </div>
                    <div className="rounded-lg bg-green-500/10 p-4 border border-green-500/20">
                      <div className="text-2xl font-bold text-green-400">90</div>
                      <div className="text-xs text-green-400">VERY GOOD</div>
                      <div className="text-xs text-gray-400">STYLE</div>
                    </div>
                  </div>
                </div>

                {/* Impact Score Details */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                      <span className="text-sm font-bold text-green-400">100</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-300">Impact Score</div>
                      <div className="flex items-center text-xs text-gray-400">
                        <svg className="mr-1 h-3 w-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Quantifying impact
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-300">
                    <svg className="mr-2 h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Strong action verbs
                  </div>

                  <div className="flex items-center text-sm text-gray-300">
                    <svg className="mr-2 h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    No spelling errors
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -left-4 top-20 h-2 w-2 rounded-full bg-red-400 opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-8 left-16 h-3 w-3 rounded-full bg-rose-400 opacity-40 animate-pulse delay-1000"></div>
              <div className="absolute -right-8 -top-4 h-2 w-2 rounded-full bg-red-500 opacity-50 animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-gray-700 bg-gray-900/50 px-8 py-16 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-red-400">92%</div>
              <div className="text-sm font-medium text-gray-300">Success Rate</div>
              <div className="text-xs text-gray-500">Users who improved their score</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-red-400">5x</div>
              <div className="text-sm font-medium text-gray-300">More Interviews</div>
              <div className="text-xs text-gray-500">Average increase in callbacks</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-red-400">50k+</div>
              <div className="text-sm font-medium text-gray-300">Resumes Analyzed</div>
              <div className="text-xs text-gray-500">And counting every day</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-red-400">24/7</div>
              <div className="text-sm font-medium text-gray-300">AI Assistance</div>
              <div className="text-xs text-gray-500">Get feedback anytime, anywhere</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-8 py-20 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
              Why choose our{" "}
              <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                resume builder?
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Get the competitive edge you need with features designed by industry experts
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
                <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">AI-Powered Analysis</h3>
              <p className="text-gray-400">
                Our advanced AI analyzes your resume using patterns from thousands of successful applications.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
                <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Instant Results</h3>
              <p className="text-gray-400">
                Receive detailed feedback and improvement suggestions in seconds, not days.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
                <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">ATS Optimization</h3>
              <p className="text-gray-400">
                Ensure your resume passes Applicant Tracking Systems used by top companies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-gray-700 bg-gradient-to-r from-red-600 to-rose-600 px-8 py-20 lg:px-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            ✨ Ready to transform your career?
          </div>
          
          <h2 className="mb-6 text-4xl font-bold text-white lg:text-6xl">
            Start building your{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              perfect resume
            </span>{" "}
            today
          </h2>
          
          <p className="mb-8 text-xl text-white/90">
            Join thousands of professionals who have already improved their resumes and landed their dream jobs
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/signup">
              <Button
                variant="gradient"
                className="w-full bg-white px-8 py-4 text-lg font-semibold text-red-600 hover:bg-gray-100 sm:w-auto"
              >
                Get Started Free
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            
            <button className="flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-colors hover:text-gray-200">
              View Examples
            </button>
          </div>

          <p className="mt-6 text-sm text-white/70">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>

      {/* Before/After Comparison Section */}
      {showPreview && (
        <div className="border-t border-gray-700 bg-gray-900 px-8 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-4xl font-bold text-white">
              See how JobLens improves your resume
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
                <h3 className="mb-4 text-xl font-semibold text-white">Before JobLens</h3>
                <div className="space-y-3 text-gray-400">
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Vague job descriptions
                  </div>
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    No quantified achievements
                  </div>
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Poor formatting
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
                <h3 className="mb-4 text-xl font-semibold text-white">After JobLens</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Clear, impactful descriptions
                  </div>
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Metrics-driven achievements
                  </div>
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
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