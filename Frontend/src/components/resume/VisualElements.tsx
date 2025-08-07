import React from "react";

const VisualElements: React.FC = () => {
  return (
    <div className="mb-8 w-full rounded-xl bg-gradient-to-r from-red-50 via-rose-50 to-white p-6 text-center shadow">
      <h2 className="mb-2 text-xl font-bold text-red-700">
        Welcome to the Resume Scan Service
      </h2>
      <p className="mb-4 text-gray-600">
        Our service provides a comprehensive analysis of your resume to help you
        stand out in the job market.
      </p>
      <div className="mb-4 flex justify-center">
        <img
          src="/images/scan-illustration.png"
          alt="Resume Scan Illustration"
          className="h-40 w-auto rounded-lg shadow-lg"
        />
      </div>
      <div className="rounded-lg bg-red-100/60 p-4">
        <h3 className="mb-1 text-lg font-semibold text-red-700">
          Get Started Today!
        </h3>
        <p className="text-gray-700">
          Upload your resume and let us help you enhance your job application.
        </p>
      </div>
    </div>
  );
};

export default VisualElements;
