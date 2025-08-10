import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resumeCompareAPI } from "../api/resumeScan";

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
        // Store the comparison result in sessionStorage to pass to results page
        sessionStorage.setItem('compareResult', JSON.stringify(response.data));
        toast.success("Resumes compared successfully!");
        navigate("/compare-resume-result");
      } else {
        toast.error(response.message || "Failed to compare resumes");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to compare resumes";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetComparison = () => {
    setResume1(null);
    setResume2(null);
    setShowPreferences(false);
    setPreferences({
      targetIndustry: "",
      experienceLevel: "",
      targetJobTitle: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-rose-100 opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-red-100 opacity-40 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 rounded-full bg-pink-100 opacity-50 blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
            Compare Resumes
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Upload two resumes and get detailed AI-powered comparison insights
          </p>
        </div>

        {/* Main comparison layout */}
        <div className="relative flex items-center justify-center min-h-[80vh]">
          {/* Resume 1 Upload */}
          <div className="flex-1 relative">
            <div className="h-[75vh] w-full max-w-md mx-auto rounded-3xl border-2 border-dashed border-red-300 bg-gradient-to-br from-red-50 to-pink-50 p-8 shadow-xl hover:border-red-400 transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-6">
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Resume 1</h3>
                  <p className="text-gray-600 mb-6">Upload your first resume for comparison</p>
                </div>

                {!resume1 ? (
                  <div
                    className="w-full cursor-pointer"
                    onClick={() => document.getElementById("resume1-input")?.click()}
                  >
                    <div className="border-2 border-dashed border-red-300 rounded-xl p-8 hover:border-red-400 transition-colors">
                      <svg
                        className="mx-auto h-16 w-16 text-red-400 mb-4"
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
                      <p className="text-lg font-medium text-gray-700">Click to upload</p>
                      <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                    <input
                      id="resume1-input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(1, e.target.files?.[0] || null)}
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 truncate">{resume1.name}</p>
                            <p className="text-sm text-gray-500">{(resume1.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleFileUpload(1, null)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => document.getElementById("resume1-input")?.click()}
                        className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Change File
                      </button>
                    </div>
                    <input
                      id="resume1-input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(1, e.target.files?.[0] || null)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Circle with Preferences */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-80 h-80 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-2xl border-4 border-white flex flex-col items-center justify-center p-6 hover:shadow-3xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Comparison Settings</h3>
                <p className="text-sm text-gray-600">Optional preferences for analysis</p>
              </div>

              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="mb-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {showPreferences ? "Hide" : "Show"} Preferences
              </button>

              <button
                onClick={handleCompareResumes}
                disabled={!resume1 || !resume2 || loading}
                className={`w-full py-3 px-6 rounded-xl font-bold text-white shadow-lg transition-all duration-300 ${
                  resume1 && resume2 && !loading
                    ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Comparing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Compare Resumes
                  </div>
                )}
              </button>

              {(resume1 || resume2) && (
                <button
                  onClick={resetComparison}
                  className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>

          {/* Resume 2 Upload */}
          <div className="flex-1 relative">
            <div className="h-[75vh] w-full max-w-md mx-auto rounded-3xl border-2 border-dashed border-red-300 bg-gradient-to-br from-pink-50 to-purple-50 p-8 shadow-xl hover:border-red-400 transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-6">
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Resume 2</h3>
                  <p className="text-gray-600 mb-6">Upload your second resume for comparison</p>
                </div>

                {!resume2 ? (
                  <div
                    className="w-full cursor-pointer"
                    onClick={() => document.getElementById("resume2-input")?.click()}
                  >
                    <div className="border-2 border-dashed border-red-300 rounded-xl p-8 hover:border-red-400 transition-colors">
                      <svg
                        className="mx-auto h-16 w-16 text-red-400 mb-4"
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
                      <p className="text-lg font-medium text-gray-700">Click to upload</p>
                      <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                    <input
                      id="resume2-input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(2, e.target.files?.[0] || null)}
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 truncate">{resume2.name}</p>
                            <p className="text-sm text-gray-500">{(resume2.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleFileUpload(2, null)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => document.getElementById("resume2-input")?.click()}
                        className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Change File
                      </button>
                    </div>
                    <input
                      id="resume2-input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(2, e.target.files?.[0] || null)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Modal */}
        {showPreferences && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Analysis Preferences</h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">Select experience level</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (3-5 years)</option>
                    <option value="senior">Senior Level (6-10 years)</option>
                    <option value="executive">Executive (10+ years)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-pink-600"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
            <h3 className="mb-6 text-2xl font-bold text-gray-900 text-center">
              What You'll Get from Resume Comparison
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Side-by-Side Analysis</h4>
                <p className="text-sm text-gray-600">Detailed comparison of both resumes with clear winner identification</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Differences</h4>
                <p className="text-sm text-gray-600">Highlight strengths and weaknesses of each resume</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Benchmark Analysis</h4>
                <p className="text-sm text-gray-600">Compare performance across industry standard benchmarks</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Improvement Tips</h4>
                <p className="text-sm text-gray-600">Actionable recommendations for both resumes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCompare;