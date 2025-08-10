import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { resumeCompareAPI } from "../api/resumeScan";
import { setComparisonResult } from "../store/resumeCompareSlice";
import type { AppDispatch } from "../store/store";

interface ResumePreferences {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
}

const ResumeCompare: React.FC = () => {
  const [resume1, setResume1] = useState<File | null>(null);
  const [resume2, setResume2] = useState<File | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<ResumePreferences>({
    targetIndustry: "",
    experienceLevel: "",
    targetJobTitle: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleFileUpload = (fileNumber: 1 | 2, file: File | null) => {
    if (fileNumber === 1) {
      setResume1(file);
    } else {
      setResume2(file);
    }
  };

  const handleCompareResumes = async () => {
    if (!resume1 || !resume2) {
      toast.error("Please upload both resumes to compare");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume1", resume1);
      formData.append("resume2", resume2);

      // Add preferences if provided
      if (preferences.targetIndustry) {
        formData.append("targetIndustry", preferences.targetIndustry);
      }
      if (preferences.experienceLevel) {
        formData.append("experienceLevel", preferences.experienceLevel);
      }
      if (preferences.targetJobTitle) {
        formData.append("targetJobTitle", preferences.targetJobTitle);
      }

      const response = await resumeCompareAPI.compareResumes(formData);

      if (response.success) {
        // Store the comparison result in Redux
        dispatch(setComparisonResult(response.data));
        toast.success("Resumes compared successfully!");
        navigate("/compare-resume-result");
      } else {
        toast.error(response.message || "Failed to compare resumes");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to compare resumes";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetComparison = () => {
    setResume1(null);
    setResume2(null);
    setPreferences({
      targetIndustry: "",
      experienceLevel: "",
      targetJobTitle: "",
    });
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6`}
    >
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="blur-1xl absolute right-0 top-0 h-96 w-96 rounded-full bg-rose-100 opacity-10" />
        <div className="blur-1xl absolute bottom-0 left-0 h-64 w-64 rounded-full bg-red-100 opacity-10" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-pink-100 opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
            Compare Resumes
          </h1>
          <p className="text-xl font-medium text-gray-700">
            Upload two resumes and get detailed AI-powered comparison insights
          </p>
        </div>

        {/* Main comparison layout */}
        <div className="relative flex min-h-[80vh] items-center justify-center">
          {/* Resume 1 Upload */}
          <div className="relative flex-1">
            <div className="mx-auto h-[75vh] w-full max-w-md rounded-3xl border-2 border-dashed border-red-300 bg-gradient-to-br from-red-50 to-pink-50 p-8 shadow-xl transition-all duration-300 hover:border-red-400 hover:shadow-2xl">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-6">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-lg">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    Resume 1
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Upload your first resume for comparison
                  </p>
                </div>

                {!resume1 ? (
                  <div
                    className="w-full cursor-pointer"
                    onClick={() =>
                      document.getElementById("resume1-input")?.click()
                    }
                  >
                    <div className="rounded-xl border-2 border-dashed border-red-300 p-8 transition-colors hover:border-red-400">
                      <svg
                        className="mx-auto mb-4 h-16 w-16 text-red-400"
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
                      <p className="text-lg font-medium text-gray-700">
                        Click to upload
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        PDF, DOC, DOCX up to 10MB
                      </p>
                    </div>
                    <input
                      id="resume1-input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        handleFileUpload(1, e.target.files?.[0] || null)
                      }
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="rounded-xl border border-green-200 bg-white p-6 shadow-md">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                            <svg
                              className="h-6 w-6 text-green-600"
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
                          <div>
                            <p className="truncate font-medium text-gray-900">
                              {resume1.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(resume1.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleFileUpload(1, null)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          document.getElementById("resume1-input")?.click()
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        Change File
                      </button>
                    </div>
                    <input
                      id="resume1-input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        handleFileUpload(1, e.target.files?.[0] || null)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Circle - Only for Preferences */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform">
            <div
              className="hover:shadow-3xl flex h-64 w-64 cursor-pointer flex-col items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-white/80 to-gray-100/70 p-6 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
              onClick={() => setShowPreferences(true)}
            >
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
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
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="mb-1 text-lg font-bold text-gray-900">
                  Set Preferences
                </h3>
                <p className="text-center text-sm leading-tight text-gray-600">
                  Click to customize analysis settings
                </p>
              </div>
            </div>
          </div>

          {/* Resume 2 Upload */}
          <div className="relative flex-1">
            <div className="mx-auto h-[75vh] w-full max-w-md rounded-3xl border-2 border-dashed border-red-300 bg-gradient-to-br from-pink-50 to-purple-50 p-8 shadow-xl transition-all duration-300 hover:border-red-400 hover:shadow-2xl">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-6">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    Resume 2
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Upload your second resume for comparison
                  </p>
                </div>

                {!resume2 ? (
                  <div
                    className="w-full cursor-pointer"
                    onClick={() =>
                      document.getElementById("resume2-input")?.click()
                    }
                  >
                    <div className="rounded-xl border-2 border-dashed border-red-300 p-8 transition-colors hover:border-red-400">
                      <svg
                        className="mx-auto mb-4 h-16 w-16 text-red-400"
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
                      <p className="text-lg font-medium text-gray-700">
                        Click to upload
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        PDF, DOC, DOCX up to 10MB
                      </p>
                    </div>
                    <input
                      id="resume2-input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        handleFileUpload(2, e.target.files?.[0] || null)
                      }
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="rounded-xl border border-green-200 bg-white p-6 shadow-md">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                            <svg
                              className="h-6 w-6 text-green-600"
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
                          <div>
                            <p className="truncate font-medium text-gray-900">
                              {resume2.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(resume2.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleFileUpload(2, null)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          document.getElementById("resume2-input")?.click()
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        Change File
                      </button>
                    </div>
                    <input
                      id="resume2-input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        handleFileUpload(2, e.target.files?.[0] || null)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Compare Button and Reset - Below rectangles */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <button
            onClick={handleCompareResumes}
            disabled={!resume1 || !resume2 || loading}
            className={`rounded-2xl px-12 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 ${
              resume1 && resume2 && !loading
                ? "transform bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 hover:from-red-600 hover:to-pink-600 hover:shadow-xl"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Comparing Resumes...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg
                  className="mr-3 h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Compare Resumes
              </div>
            )}
          </button>

          {(resume1 || resume2) && (
            <button
              onClick={resetComparison}
              className="text-sm text-gray-500 underline transition-colors hover:text-gray-700"
            >
              Reset All Files
            </button>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
            <h3 className="mb-6 text-center text-2xl font-bold text-gray-900">
              What You'll Get from Resume Comparison
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">
                  Side-by-Side Analysis
                </h4>
                <p className="text-sm text-gray-600">
                  Detailed comparison of both resumes with clear winner
                  identification
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">
                  Key Differences
                </h4>
                <p className="text-sm text-gray-600">
                  Highlight strengths and weaknesses of each resume
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">
                  Benchmark Analysis
                </h4>
                <p className="text-sm text-gray-600">
                  Compare performance across industry standard benchmarks
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-500">
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">
                  Improvement Tips
                </h4>
                <p className="text-sm text-gray-600">
                  Actionable recommendations for both resumes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal - Glassy style, blurred bg, no black overlay */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred background */}
          <div
            className="absolute inset-0 backdrop-blur-sm transition-all duration-300"
            onClick={() => setShowPreferences(false)}
          />
          {/* Glassy modal */}
          <div className="relative w-full max-w-md rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 via-pink-50/80 to-purple-100/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Analysis Preferences
              </h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Target Industry
                </label>
                <input
                  type="text"
                  placeholder="e.g., Technology, Healthcare"
                  value={preferences.targetIndustry}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      targetIndustry: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Experience Level
                </label>
                <select
                  value={preferences.experienceLevel}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      experienceLevel: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6-10 years)</option>
                  <option value="executive">Executive (10+ years)</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Target Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  value={preferences.targetJobTitle}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      targetJobTitle: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  setPreferences({
                    targetIndustry: "",
                    experienceLevel: "",
                    targetJobTitle: "",
                  })
                }
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowPreferences(false)}
                className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-red-600 hover:to-pink-600"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeCompare;
