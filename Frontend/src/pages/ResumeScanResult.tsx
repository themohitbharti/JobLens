import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchResumeScanResult,
  setSidebarCollapsed,
} from "../store/resumeScanSlice";
import {
  ScoreOverview,
  SectionAnalysis,
  LoadingSpinner,
} from "../components/resume/index";

const ResumeScanResult: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { scanData, loading, error } = useSelector(
    (state: RootState) => state.resumeScan,
  );

  useEffect(() => {
    // Collapse sidebar when entering result page
    dispatch(setSidebarCollapsed(true));

    if (scanId) {
      // Always fetch the data when the component mounts
      dispatch(fetchResumeScanResult(scanId));
    } else {
      navigate("/resume-scan");
    }
  }, [scanId, navigate, dispatch]);

  const handleSectionClick = (sectionName: string) => {
    navigate(
      `/resume-scan-result/${scanId}/section/${encodeURIComponent(sectionName)}`,
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !scanData) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Error Loading Results
          </h3>
          <p className="mt-2 text-gray-600">
            {error || "Failed to load scan results"}
          </p>
          <button
            onClick={() => navigate("/resume-scan")}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Back to Resume Scan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-rose-100 opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-red-100 opacity-40 blur-2xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/resume-scan")}
              className="mb-4 flex items-center text-red-600 hover:text-red-700"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Resume Scan
            </button>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Resume Analysis Results
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Detailed analysis of your resume with AI-powered insights
            </p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">
              Download Report
            </button>
            <button
              onClick={() => navigate("/resume-scan")}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
            >
              Scan Another Resume
            </button>
          </div>
        </div>

        {/* Main Content - Centered Layout */}
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Main Score Overview - Wide and Prominent */}
          <ScoreOverview
            overallScore={scanData.overallScore}
            improvementPotential={scanData.improvementPotential}
            sectionScores={scanData.sectionScores}
            isMainView={true}
          />

          {/* Section Analysis - Clickable Cards */}
          <SectionAnalysis
            sectionScores={scanData.sectionScores}
            detailedFeedback={scanData.detailedFeedback}
            onSectionClick={handleSectionClick}
            isMainView={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeScanResult;
