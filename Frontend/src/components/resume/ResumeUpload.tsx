import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { uploadAndAnalyzeResume } from "../../store/resumeScanSlice";
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, uploadProgress } = useSelector(
    (state: RootState) => state.resumeScan,
  );

  // Extract file validation logic into a separate function
  const validateAndSetFile = (file: File) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOC, or DOCX file");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should not exceed 10MB");
      return;
    }

    setSelectedFile(file);
    toast.success("File selected successfully");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handlePreferenceChange = (
    field: keyof ResumePreferences,
    value: string,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
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

      console.log(result);

      // Make sure the result is stored in Redux
      // Then navigate to results page
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Upload Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <svg
                className="h-12 w-12 text-red-600"
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
          </div>

          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Upload Your Resume
          </h2>

          <p className="mb-6 text-gray-600">
            Drop your resume file here or click to browse
          </p>

          {/* File Input */}
          <div className="mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`inline-flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-all duration-300 ${
                loading
                  ? "cursor-not-allowed border-gray-300 bg-gray-50"
                  : selectedFile
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50 hover:border-red-400 hover:bg-red-100"
              }`}
            >
              <div>
                <svg
                  className={`mx-auto mb-4 h-12 w-12 ${
                    selectedFile ? "text-green-400" : "text-red-400"
                  }`}
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
                <p
                  className={`text-lg font-medium ${
                    selectedFile ? "text-green-700" : "text-gray-700"
                  }`}
                >
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : loading
                      ? "Processing..."
                      : "Choose file or drag and drop"}
                </p>
                <p className="text-sm text-gray-500">
                  PDF, DOC, DOCX up to 10MB
                </p>
              </div>
            </label>
          </div>

          {/* Upload Progress */}
          {loading && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-center">
                <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-red-200 border-t-red-600"></div>
                <p className="text-sm text-gray-600">
                  Analyzing resume... {uploadProgress}%
                </p>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-red-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* File Selected Actions */}
          {selectedFile && !loading && (
            <div className="mb-6 space-y-3">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {showPreferences ? "Hide" : "Show"} Advanced Options
              </button>

              <div className="flex gap-3">
                <button
                  onClick={resetUpload}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Analyze Resume
                </button>
              </div>
            </div>
          )}

          {/* Advanced Preferences */}
          {showPreferences && (
            <div className="rounded-lg bg-gray-50 p-4 text-left">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Analysis Preferences (Optional)
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Target Industry
                  </label>
                  <select
                    value={preferences.targetIndustry}
                    onChange={(e) =>
                      handlePreferenceChange("targetIndustry", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Experience Level
                  </label>
                  <select
                    value={preferences.experienceLevel}
                    onChange={(e) =>
                      handlePreferenceChange("experienceLevel", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">Select Experience Level</option>
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
                    value={preferences.targetJobTitle}
                    onChange={(e) =>
                      handlePreferenceChange("targetJobTitle", e.target.value)
                    }
                    placeholder="e.g., Software Engineer, Marketing Manager"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-8">
        {/* Features List */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <div className="mb-6 flex items-center">
            <div className="mr-4 rounded-full bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
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
              What You'll Get
            </h2>
          </div>

          <ul className="space-y-4">
            {[
              "AI-Powered Resume Analysis",
              "ATS Compatibility Score",
              "Section-by-Section Feedback",
              "Keyword Optimization Tips",
              "Industry-Specific Suggestions",
              "Improvement Recommendations",
              "Downloadable Report",
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center text-gray-700">
                <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-base font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tips Card */}
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900">💡 Pro Tips</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-blue-500">•</span>
              Upload your resume in PDF format for best results
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-blue-500">•</span>
              Ensure your resume is up-to-date before scanning
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-blue-500">•</span>
              Provide target job details for personalized feedback
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-blue-500">•</span>
              Review all suggestions carefully before applying
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
