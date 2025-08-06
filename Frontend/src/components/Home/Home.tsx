import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../index";

const Home = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does JobLens AI analyze my resume?",
      answer:
        "Our AI uses advanced natural language processing and machine learning algorithms trained on thousands of successful resumes. It analyzes content quality, formatting, keyword optimization, ATS compatibility, and compares your resume against industry standards to provide personalized feedback.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Absolutely. We use enterprise-grade security measures including SSL encryption, secure cloud storage, and strict data privacy protocols. Your resume data is never shared with third parties, and you can delete your information at any time.",
    },
    {
      question: "What file formats does JobLens support?",
      answer:
        "JobLens supports PDF, Word (.docx), and plain text formats. We recommend uploading your resume as a PDF for the most accurate analysis, as this preserves formatting and ensures consistency across different systems.",
    },
    {
      question: "How accurate is the resume scoring?",
      answer:
        "Our scoring system has been trained on over 50,000 successful resumes and validated by recruiting professionals. The accuracy rate is over 92% when compared to human recruiter assessments. However, remember that our tool is meant to complement, not replace, human judgment.",
    },
    {
      question: "Can I use JobLens for different job roles?",
      answer:
        "Yes! JobLens can analyze resumes for various industries and job levels, from entry-level positions to executive roles. Our AI adapts its analysis based on the role you're targeting and provides relevant suggestions for each specific position.",
    },
    {
      question: "What's included in the free plan?",
      answer:
        "The free plan includes one resume analysis per month, basic scoring, and general improvement suggestions. Premium plans offer unlimited analyses, detailed feedback, ATS optimization, LinkedIn profile reviews, and priority support.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, hsl(0 0% 6%), hsl(345 84% 25%))",
      }}
    >
      {/* Hero Section */}
      <div id="home" className="relative overflow-hidden px-8 py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div
                className="mb-6 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-red-400"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                }}
              >
                ✨ Ready to transform your career?
              </div>

              <h1 className="mb-8 text-5xl font-bold leading-tight text-white lg:text-7xl">
                Improve your{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  resume
                </span>
                <br />
                and LinkedIn profile
              </h1>

              <p className="mb-4 text-xl text-gray-300 lg:text-2xl">
                Designed by top recruiters, our AI-powered platform instantly
                gives you tailored feedback on your resume and LinkedIn profile.
              </p>

              <p className="mb-8 text-lg font-semibold text-red-400">
                Land 5x more interviews, opportunities and job offers.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link to="/signup">
                  <Button
                    variant="gradient"
                    className="w-full px-8 py-4 text-lg font-semibold text-white sm:w-auto"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                      border: "none",
                    }}
                  >
                    Get Started Free
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
                  className="flex items-center justify-center px-6 py-4 text-lg font-semibold text-gray-300 transition-colors hover:text-white"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-7 4h6"
                    />
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
              <div
                className="relative z-10 rounded-2xl border border-gray-200 p-8 shadow-xl backdrop-blur-sm"
                style={{
                  background: "white",
                }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    JobLens Dashboard
                  </span>
                </div>

                {/* Score Circle */}
                <div className="mb-8 text-center">
                  <div className="relative mx-auto h-32 w-32">
                    <svg className="h-32 w-32 -rotate-90 transform">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="hsl(0 84% 60%)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${78 * 3.51} 352`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-gray-800">
                        78
                      </span>
                      <span className="text-sm text-gray-600">
                        Overall Score
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700">
                    Your resume scored 78 out of 100.
                  </p>
                </div>

                {/* Breakdown Section */}
                <div className="mb-6">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-600">
                    Breakdown
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="text-2xl font-bold text-green-600">
                        100
                      </div>
                      <div className="text-xs text-green-600">EXCELLENT</div>
                      <div className="text-xs text-gray-600">IMPACT</div>
                    </div>
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                      <div className="text-2xl font-bold text-orange-600">
                        65
                      </div>
                      <div className="text-xs text-orange-600">AVERAGE</div>
                      <div className="text-xs text-gray-600">BREVITY</div>
                    </div>
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="text-2xl font-bold text-green-600">
                        90
                      </div>
                      <div className="text-xs text-green-600">VERY GOOD</div>
                      <div className="text-xs text-gray-600">STYLE</div>
                    </div>
                  </div>
                </div>

                {/* Impact Score Details */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <span className="text-sm font-bold text-green-600">
                        100
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-700">Impact Score</div>
                      <div className="flex items-center text-xs text-gray-600">
                        <svg
                          className="mr-1 h-3 w-3 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Quantifying impact
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-700">
                    <svg
                      className="mr-2 h-4 w-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Strong action verbs
                  </div>

                  <div className="flex items-center text-sm text-gray-700">
                    <svg
                      className="mr-2 h-4 w-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    No spelling errors
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -left-4 top-20 h-2 w-2 animate-pulse rounded-full bg-red-400 opacity-60"></div>
              <div className="absolute -bottom-8 left-16 h-3 w-3 animate-pulse rounded-full bg-rose-400 opacity-40 delay-1000"></div>
              <div className="absolute -right-8 -top-4 h-2 w-2 animate-pulse rounded-full bg-red-500 opacity-50 delay-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - WHITE */}
      <div
        id="stats"
        className="border-t border-gray-200 px-8 py-16 lg:px-16"
        style={{
          background: "white",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div
                className="mb-2 bg-clip-text text-4xl font-bold text-transparent"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                92%
              </div>
              <div className="text-sm font-medium text-gray-800">
                Success Rate
              </div>
              <div className="text-xs text-gray-600">
                Users who improved their score
              </div>
            </div>
            <div className="text-center">
              <div
                className="mb-2 bg-clip-text text-4xl font-bold text-transparent"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                5x
              </div>
              <div className="text-sm font-medium text-gray-800">
                More Interviews
              </div>
              <div className="text-xs text-gray-600">
                Average increase in callbacks
              </div>
            </div>
            <div className="text-center">
              <div
                className="mb-2 bg-clip-text text-4xl font-bold text-transparent"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                50k+
              </div>
              <div className="text-sm font-medium text-gray-800">
                Resumes Analyzed
              </div>
              <div className="text-xs text-gray-600">
                And counting every day
              </div>
            </div>
            <div className="text-center">
              <div
                className="mb-2 bg-clip-text text-4xl font-bold text-transparent"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                24/7
              </div>
              <div className="text-sm font-medium text-gray-800">
                AI Assistance
              </div>
              <div className="text-xs text-gray-600">
                Get feedback anytime, anywhere
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - CHANGED TO WHITE with animations */}
      <div
        id="features"
        className="border-t border-gray-200 px-8 py-20 lg:px-16"
        style={{
          background: "white",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-800 lg:text-5xl">
              Why choose our{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                resume builder?
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Get the competitive edge you need with features designed by
              industry experts
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 - With hover animations */}
            <div
              className="group rounded-xl border border-gray-200 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-red-300 hover:shadow-xl"
              style={{
                background: "white",
              }}
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                }}
              >
                <svg
                  className="h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-12"
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
              <h3 className="mb-2 text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover:text-red-600">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                Our advanced AI analyzes your resume using patterns from
                thousands of successful applications.
              </p>
            </div>

            {/* Feature 2 - With hover animations */}
            <div
              className="group rounded-xl border border-gray-200 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-red-300 hover:shadow-xl"
              style={{
                background: "white",
              }}
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                }}
              >
                <svg
                  className="h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-12"
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
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover:text-red-600">
                Instant Results
              </h3>
              <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                Receive detailed feedback and improvement suggestions in
                seconds, not days.
              </p>
            </div>

            {/* Feature 3 - With hover animations */}
            <div
              className="group rounded-xl border border-gray-200 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-red-300 hover:shadow-xl"
              style={{
                background: "white",
              }}
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                }}
              >
                <svg
                  className="h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-12"
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
              <h3 className="mb-2 text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover:text-red-600">
                ATS Optimization
              </h3>
              <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                Ensure your resume passes Applicant Tracking Systems used by top
                companies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - HERO GRADIENT THEME */}
      <div
        id="faq"
        className="border-t border-gray-700/30 px-8 py-20 lg:px-16"
        style={{
          background: "linear-gradient(135deg, hsl(0 0% 6%), hsl(345 84% 25%))",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div
              className="mb-6 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-red-400"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
              }}
            >
              ❓ Got questions?
            </div>

            <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
              Frequently Asked{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about JobLens and how it works
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:border-red-400/50"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors duration-300 hover:bg-white/5"
                >
                  <h3 className="pr-4 text-lg font-semibold text-white">
                    {faq.question}
                  </h3>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                      openFAQ === index
                        ? "rotate-45 bg-red-500"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFAQ === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-gray-700/30 p-6 pt-4">
                    <p className="leading-relaxed text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-4 text-gray-400">
              Still have questions? We're here to help!
            </p>
            <button className="inline-flex items-center text-red-400 transition-colors duration-300 hover:text-red-300">
              Contact our support team
              <svg
                className="ml-2 h-4 w-4"
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
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section - WHITE THEME */}
      <div
        id="contact"
        className="border-t border-gray-200 px-8 py-20 lg:px-16"
        style={{
          background: "white",
        }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="mb-6 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white"
            style={{
              background:
                "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
            }}
          >
            ✨ Ready to transform your career?
          </div>

          <h2 className="mb-6 text-4xl font-bold text-gray-800 lg:text-6xl">
            Start building your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background:
                  "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              perfect resume
            </span>{" "}
            today
          </h2>

          <p className="mb-8 text-xl text-gray-600">
            Join thousands of professionals who have already improved their
            resumes and landed their dream jobs
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/signup">
              <Button
                variant="gradient"
                className="w-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg sm:w-auto"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                  border: "none",
                }}
              >
                Get Started Free
                <svg
                  className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
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

            <button className="flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-600 transition-all duration-300 hover:scale-105 hover:text-gray-800">
              <svg
                className="mr-2 h-5 w-5 transition-transform duration-300 hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-7 4h6"
                />
              </svg>
              View Examples
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </div>
  );
};

// Export the scrollToSection function for use in header
export { Home as default, Home };
