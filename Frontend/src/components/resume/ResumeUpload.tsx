import React, { useState } from "react";
import { ScanStatistics, VisualElements, FeaturesList } from "../index";

const ResumeScanPage: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [scansLeft, setScansLeft] = useState<number>(3);
  const [completedScans, setCompletedScans] = useState<number>(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setScansLeft((prev) => (prev > 0 ? prev - 1 : 0));
        setCompletedScans((prev) => prev + 1);
      }, 2000);
    }
  };

  return (
    <div className="relative mx-auto flex max-w-2xl flex-col items-center rounded-2xl bg-white/90 p-8 shadow-xl">
      <VisualElements />
      <h2 className="mb-4 text-2xl font-bold text-red-600">
        Upload Your Resume
      </h2>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        disabled={isUploading}
        className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-red-50 file:px-4 file:py-2 file:text-red-700 hover:file:bg-red-100"
      />
      {isUploading && (
        <p className="mb-2 animate-pulse text-sm text-gray-500">
          Uploading <span className="font-semibold">{fileName}</span>...
        </p>
      )}
      {fileName && !isUploading && (
        <p className="mb-2 text-sm text-green-600">
          Uploaded: <span className="font-semibold">{fileName}</span>
        </p>
      )}
      <ScanStatistics scansLeft={scansLeft} completedScans={completedScans} />
      <FeaturesList />
    </div>
  );
};

export default ResumeScanPage;
