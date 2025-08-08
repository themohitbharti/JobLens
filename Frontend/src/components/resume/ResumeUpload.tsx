import React, { useState } from "react";
import { ScanStatistics } from "../index";

const ResumeUpload: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [scansLeft, setScansLeft] = useState<number>(5);
  const [completedScans, setCompletedScans] = useState<number>(2);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        setIsUploading(false);
        setScansLeft((prev) => (prev > 0 ? prev - 1 : 0));
        setCompletedScans((prev) => prev + 1);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Upload Card */}
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
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className={`inline-flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-all duration-300 ${
                isUploading
                  ? "border-gray-300 bg-gray-50"
                  : "border-red-300 bg-red-50 hover:border-red-400 hover:bg-red-100"
              }`}
            >
              <div>
                <svg
                  className="mx-auto mb-4 h-12 w-12 text-red-400"
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
                <p className="text-lg font-medium text-gray-700">
                  {isUploading
                    ? "Processing..."
                    : "Choose file or drag and drop"}
                </p>
                <p className="text-sm text-gray-500">
                  PDF, DOC, DOCX up to 10MB
                </p>
              </div>
            </label>
          </div>

          {/* Upload Status */}
          {isUploading && (
            <div className="mb-4 flex items-center justify-center">
              <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-red-200 border-t-red-600"></div>
              <p className="text-sm text-gray-600">
                Uploading <span className="font-semibold">{fileName}</span>...
              </p>
            </div>
          )}

          {fileName && !isUploading && (
            <div className="mb-4 rounded-lg bg-green-50 p-3">
              <p className="text-sm text-green-700">
                ✅ Uploaded: <span className="font-semibold">{fileName}</span>
              </p>
            </div>
          )}

          {/* Action Button */}
          {fileName && !isUploading && (
            <button className="w-full rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              Start Analysis
            </button>
          )}
        </div>
      </div>

      {/* Scan Statistics */}
      <ScanStatistics scansLeft={scansLeft} completedScans={completedScans} />
    </div>
  );
};

export default ResumeUpload;
