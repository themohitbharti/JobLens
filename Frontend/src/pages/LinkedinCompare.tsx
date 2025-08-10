import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { linkedinCompareAPI } from "../api/linkedinScan";
import { setComparisonResult } from "../store/linkedinCompareSlice";
import type { AppDispatch } from "../store/store";

interface ProfilePreferences {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
}

const LinkedinCompare: React.FC = () => {
  const [profile1, setProfile1] = useState<File | null>(null);
  const [profile2, setProfile2] = useState<File | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<ProfilePreferences>({
    targetIndustry: "",
    experienceLevel: "",
    targetJobTitle: "",
  });
  const [showInstruction, setShowInstruction] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleFileUpload = (fileNumber: 1 | 2, file: File | null) => {
    if (fileNumber === 1) {
      setProfile1(file);
    } else {
      setProfile2(file);
    }
  };

  const handleCompareProfiles = async () => {
    if (!profile1 || !profile2) {
      toast.error("Please upload both LinkedIn profiles to compare");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("profile1", profile1);
      formData.append("profile2", profile2);

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

      const response = await linkedinCompareAPI.compareProfiles(formData);

      if (response.success) {
        // Store the comparison result in Redux
        dispatch(setComparisonResult(response.data));
        toast.success("LinkedIn profiles compared successfully!");
        navigate("/compare-linkedin-result");
      } else {
        toast.error(response.message || "Failed to compare LinkedIn profiles");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to compare LinkedIn profiles";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetComparison = () => {
    setProfile1(null);
    setProfile2(null);
    setPreferences({
      targetIndustry: "",
      experienceLevel: "",
      targetJobTitle: "",
    });
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6`}
    >
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="blur-1xl absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-100 opacity-10" />
        <div className="blur-1xl absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-100 opacity-10" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-100 opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <h1 className=" bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
            Compare LinkedIn Profiles
          </h1>
          <p className="text-xl font-medium text-gray-700">
            Upload two LinkedIn profiles and get detailed AI-powered comparison
            insights
          </p>
          {/* Info icon and instruction trigger */}
          <div className="mt-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowInstruction(true)}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className="flex items-center justify-center rounded-full bg-blue-100 p-4 shadow-lg">
                <svg
                  className="h-6 w-6 text-blue-500 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>
              <span className="mt-3 text-lg font-semibold text-blue-700 underline cursor-pointer">
                How to get your LinkedIn profile PDF?
              </span>
            </button>
          </div>
        </div>

        {/* Main comparison layout */}
        <div className="relative flex min-h-[80vh] items-center justify-center">
          <div className="grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Profile 1 Upload */}
            <div className="relative flex-1">
              <div className="rounded-3xl border-2 border-dashed border-blue-300 bg-white/70 p-8 text-center shadow-xl backdrop-blur-sm transition-all hover:border-blue-400 hover:shadow-2xl">
                <div className="mb-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
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
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    LinkedIn Profile 1
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Upload your first LinkedIn profile for comparison
                  </p>
                </div>

                {!profile1 ? (
                  <div
                    className="w-full cursor-pointer"
                    onClick={() =>
                      document.getElementById("profile1-input")?.click()
                    }
                  >
                    <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 p-8 transition-colors hover:bg-blue-100">
                      <svg
                        className="mx-auto mb-4 h-12 w-12 text-blue-400"
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
                      <p className="font-medium text-blue-600">
                        Click to upload LinkedIn profile
                      </p>
                      <p className="text-sm text-blue-500">
                        PDF files only • Max 10MB
                      </p>
                    </div>
                    <input
                      id="profile1-input"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(1, e.target.files?.[0] || null)
                      }
                    />
                  </div>
                ) : (
                  <div className="text-left">
                    <div className="mb-4 flex items-center rounded-lg bg-green-50 p-4">
                      <svg
                        className="mr-3 h-6 w-6 text-green-500"
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
                      <div className="flex-1">
                        <p className="font-medium text-green-800">
                          {profile1.name}
                        </p>
                        <p className="text-sm text-green-600">
                          {(profile1.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setProfile1(null)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center - LinkedIn Instructions, VS, and Preferences */}
            <div className="flex flex-col items-center justify-center space-y-6">

              {/* VS Badge */}
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-6 shadow-2xl">
                <span className="text-3xl font-bold text-white">VS</span>
              </div>

              {/* Preferences Toggle */}
              <div
                onClick={() => setShowPreferences(!showPreferences)}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-purple-300 bg-white/70 p-6 text-center shadow-lg backdrop-blur-sm transition-all hover:border-purple-400 hover:shadow-xl"
              >
                <div className="mb-3 flex justify-center">
                  <svg
                    className="h-8 w-8 text-purple-500"
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

            {/* Profile 2 Upload */}
            <div className="relative flex-1">
              <div className="rounded-3xl border-2 border-dashed border-indigo-300 bg-white/70 p-8 text-center shadow-xl backdrop-blur-sm transition-all hover:border-indigo-400 hover:shadow-2xl">
                <div className="mb-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
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
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    LinkedIn Profile 2
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Upload your second LinkedIn profile for comparison
                  </p>
                </div>

                {!profile2 ? (
                  <div
                    className="w-full cursor-pointer"
                    onClick={() =>
                      document.getElementById("profile2-input")?.click()
                    }
                  >
                    <div className="rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 p-8 transition-colors hover:bg-indigo-100">
                      <svg
                        className="mx-auto mb-4 h-12 w-12 text-indigo-400"
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
                      <p className="font-medium text-indigo-600">
                        Click to upload LinkedIn profile
                      </p>
                      <p className="text-sm text-indigo-500">
                        PDF files only • Max 10MB
                      </p>
                    </div>
                    <input
                      id="profile2-input"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(2, e.target.files?.[0] || null)
                      }
                    />
                  </div>
                ) : (
                  <div className="text-left">
                    <div className="mb-4 flex items-center rounded-lg bg-green-50 p-4">
                      <svg
                        className="mr-3 h-6 w-6 text-green-500"
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
                      <div className="flex-1">
                        <p className="font-medium text-green-800">
                          {profile2.name}
                        </p>
                        <p className="text-sm text-green-600">
                          {(profile2.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setProfile2(null)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col items-center space-y-4">
          <button
            onClick={handleCompareProfiles}
            disabled={loading || !profile1 || !profile2}
            className="hover:shadow-3xl flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-12 py-4 text-xl font-bold text-white shadow-2xl transition-all hover:from-blue-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
          >
            {loading ? (
              <>
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Analyzing Profiles...
              </>
            ) : (
              <div className="flex items-center gap-3">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Compare LinkedIn Profiles
              </div>
            )}
          </button>

          {(profile1 || profile2) && (
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
              What You'll Get from LinkedIn Profile Comparison
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
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
                  Clear Winner
                </h4>
                <p className="text-sm text-gray-600">
                  Detailed comparison of both profiles with clear winner
                  identification
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
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
                  Highlight strengths and weaknesses of each LinkedIn profile
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">
                  Benchmark Analysis
                </h4>
                <p className="text-sm text-gray-600">
                  Compare performance across industry standard LinkedIn
                  benchmarks
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500">
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
                  Actionable recommendations for both LinkedIn profiles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Comparison Preferences
              </h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
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
                  className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:from-blue-600 hover:to-purple-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Instruction Modal */}
      {showInstruction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm"
          onClick={() => setShowInstruction(false)}
        >
          <div
            className="relative rounded-2xl bg-white/95 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => setShowInstruction(false)}
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
            <img
              src="/Linkedin_instruction.png"
              alt="LinkedIn Profile Instructions"
              className="max-h-[50vh] w-auto rounded-xl shadow-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedinCompare;
