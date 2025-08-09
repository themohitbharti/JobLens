import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store/store";
import { uploadAndAnalyzeResume } from "../../store/resumeScanSlice";
import {
  updateScansLeft,
  updateLastResume,
  fetchResumeStats,
} from "../../store/authSlice";
import toast from "react-hot-toast";

interface ResumePreferences {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
}

const ResumeUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<ResumePreferences>({
    targetIndustry: "",
    experienceLevel: "",
    targetJobTitle: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading } = useSelector((state: RootState) => state.resumeScan);
  const { user } = useSelector((state: RootState) => state.auth);

  const scansLeft = user?.scansLeft ?? 30;

  // Fetch user stats on component mount
  useEffect(() => {
    dispatch(fetchResumeStats());
  }, [dispatch]);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    // Check scans left before uploading
    if (scansLeft <= 0) {
      toast.error("Daily scan limit reached. Please try again tomorrow.");
      return;
    }

    try {
      const requestData = {
        resume: selectedFile,
        ...(preferences.targetIndustry && {
          targetIndustry: preferences.targetIndustry,
        }),
        ...(preferences.experienceLevel && {
          experienceLevel: preferences.experienceLevel,
        }),
        ...(preferences.targetJobTitle && {
          targetJobTitle: preferences.targetJobTitle,
        }),
      };

      const result = await dispatch(
        uploadAndAnalyzeResume(requestData),
      ).unwrap();

      // Update Redux state after successful upload
      dispatch(updateScansLeft(Math.max(0, scansLeft - 1)));
      dispatch(
        updateLastResume({
          scanId: result.scanId,
          overallScore: result.overallScore,
          scanDate: new Date().toISOString(),
        }),
      );

      toast.success("Resume analyzed successfully!");
      navigate(`/resume-scan-result/${result.scanId}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to analyze resume";
      toast.error(errorMessage);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setShowPreferences(false);
    setPreferences({
      targetIndustry: "",
      experienceLevel: "",
      targetJobTitle: "",
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Upload Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        {/* Scans Left Indicator */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">Daily scans remaining:</span>
          <span
            className={`text-sm font-semibold ${scansLeft > 5 ? "text-green-600" : scansLeft > 0 ? "text-yellow-600" : "text-red-600"}`}
          >
            {scansLeft}/30
          </span>
        </div>

        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Upload Your Resume
          </h2>
          <p className="mb-8 text-gray-600">
            Get instant AI-powered feedback and improve your resume score
          </p>

          {/* File Upload Area */}
          <div
            className="mb-6 rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-red-400"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <div className="flex flex-col items-center">
              <svg
                className="mb-4 h-12 w-12 text-gray-400"
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
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 5MB)</p>
            </div>
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </div>

          {selectedFile && (
            <div className="mb-4">
              <div className="mb-2 text-sm text-green-600">
                Selected: {selectedFile.name}
              </div>

              {/* Preferences Toggle */}
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="mb-4 text-sm text-blue-600 underline hover:text-blue-700"
              >
                {showPreferences ? "Hide" : "Show"} Analysis Preferences
              </button>
            </div>
          )}

          {/* Preferences Section */}
          {showPreferences && selectedFile && (
            <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Analysis Preferences (Optional)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">Select experience level</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (3-5 years)</option>
                    <option value="senior">Senior Level (6-10 years)</option>
                    <option value="executive">Executive (10+ years)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
              <button
                onClick={resetUpload}
                className="mt-3 text-xs text-gray-500 hover:text-gray-700"
              >
                Reset All
              </button>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading || scansLeft <= 0}
            className={`w-full rounded-lg px-4 py-3 font-medium transition-colors ${
              !selectedFile || loading || scansLeft <= 0
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600"
            }`}
          >
            {loading
              ? "Analyzing..."
              : scansLeft <= 0
                ? "Daily Limit Reached"
                : "Analyze Resume"}
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            What You'll Get
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <svg
                className="mr-3 mt-0.5 h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">
                  AI-Powered Analysis
                </h4>
                <p className="text-sm text-gray-600">
                  Comprehensive scoring across multiple dimensions
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <svg
                className="mr-3 mt-0.5 h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">Detailed Feedback</h4>
                <p className="text-sm text-gray-600">
                  Section-by-section improvement suggestions
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <svg
                className="mr-3 mt-0.5 h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">ATS Optimization</h4>
                <p className="text-sm text-gray-600">
                  Ensure your resume passes applicant tracking systems
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
