import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store/store";
import { scanLinkedInProfile } from "../../store/linkedinScanSlice";
import {
  updateScansLeft,
  updateLastLinkedins,
  fetchLinkedinStats,
} from "../../store/authSlice";
import toast from "react-hot-toast";

interface LinkedinPreferences {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
}

const LinkedinUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Remove linkedinUrl and uploadMethod state
  const [preferences, setPreferences] = useState<LinkedinPreferences>({
    targetIndustry: "",
    experienceLevel: "",
    targetJobTitle: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading } = useSelector((state: RootState) => state.linkedinScan);
  const { user } = useSelector((state: RootState) => state.auth);

  const scansLeft = user?.scansLeft ?? 30;

  useEffect(() => {
    dispatch(fetchLinkedinStats());
  }, [dispatch]);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    if (scansLeft <= 0) {
      toast.error("Daily scan limit reached. Please try again tomorrow.");
      return;
    }

    try {
      const requestData = {
        linkedin: selectedFile,
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

      const result = await dispatch(scanLinkedInProfile(requestData)).unwrap();

      dispatch(updateScansLeft(Math.max(0, scansLeft - 1)));
      dispatch(
        updateLastLinkedins({
          scanId: result.scanId,
          overallScore: result.overallScore,
          scanDate: new Date().toISOString(),
        }),
      );

      toast.success("LinkedIn profile analyzed successfully!");
      navigate(`/linkedin-builder-result/${result.scanId}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to analyze LinkedIn profile";
      toast.error(errorMessage);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreferences({
      targetIndustry: "",
      experienceLevel: "",
      targetJobTitle: "",
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Upload Section */}
      <div className="rounded-3xl border-2 border-white/60 bg-gradient-to-br from-white/80 via-blue-50/80 to-indigo-100/80 p-8 shadow-2xl backdrop-blur-xl">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -left-2 -top-2 h-6 w-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-60 blur-sm"></div>
        <div className="pointer-events-none absolute -right-2 -top-2 h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-40 blur-md"></div>

        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-xl">
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

          <h2 className="mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
            Analyze Your LinkedIn Profile
          </h2>
          <p className="mb-8 font-medium text-gray-700">
            Get comprehensive insights to optimize your professional presence
          </p>

          {/* File Upload Area */}
          <div
            className="group mb-6 cursor-pointer rounded-2xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 transition-all duration-300 hover:border-blue-400 hover:shadow-lg"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <div className="flex flex-col items-center">
              <div className="mb-4 rounded-full bg-blue-100 p-3 transition-colors group-hover:bg-blue-200">
                <svg
                  className="h-8 w-8 text-blue-500"
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
              <p className="mb-2 text-lg font-semibold text-gray-700">
                Click to upload LinkedIn PDF
              </p>
              <p className="text-sm text-gray-500">PDF only (MAX. 10MB)</p>
            </div>
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* File Display */}
          {selectedFile && (
            <div className="mb-6 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
              <div className="flex items-center justify-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                  <svg
                    className="h-5 w-5 text-green-600"
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
                </div>
                <span className="font-medium text-green-800">
                  {selectedFile.name}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading || scansLeft <= 0}
              className={`w-full rounded-xl px-6 py-4 text-lg font-bold transition-all duration-300 ${
                !selectedFile || loading || scansLeft <= 0
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "transform bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:scale-105 hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl"
              }`}
            >
              {loading
                ? "Analyzing..."
                : scansLeft <= 0
                  ? "Daily Limit Reached"
                  : "Analyze LinkedIn Profile"}
            </button>

            {selectedFile && (
              <button
                onClick={resetUpload}
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Preferences Section */}
      <div className="rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-100 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
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
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
          </div>
          <h3 className="mb-3 text-2xl font-bold text-purple-900">
            Analysis Preferences
          </h3>
          <p className="font-medium text-purple-700">
            Customize your analysis for better LinkedIn insights
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-purple-800">
              Target Industry
            </label>
            <input
              type="text"
              placeholder="e.g., Technology, Healthcare, Finance"
              value={preferences.targetIndustry}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  targetIndustry: e.target.value,
                }))
              }
              className="w-full rounded-xl border-2 border-purple-200 bg-white/70 px-4 py-3 text-sm font-medium focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-purple-800">
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
              className="w-full rounded-xl border-2 border-purple-200 bg-white/70 px-4 py-3 text-sm font-medium focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <option value="">Select experience level</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (3-5 years)</option>
              <option value="senior">Senior Level (6-10 years)</option>
              <option value="executive">Executive (10+ years)</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-purple-800">
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
              className="w-full rounded-xl border-2 border-purple-200 bg-white/70 px-4 py-3 text-sm font-medium focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedinUpload;
