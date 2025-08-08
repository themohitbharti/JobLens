import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ScoreOverview,
  SectionAnalysis,
  BenchmarkResults,
  ImprovementSuggestions,
  ScanMetrics,
  LoadingSpinner,
} from "../components/resume/index";

interface ResumeScanData {
  success: boolean;
  message: string;
  data: {
    scanId: string;
    overallScore: number;
    sectionScores: SectionScore[];
    detailedFeedback: DetailedFeedback[];
    benchmarkResults: Record<string, BenchmarkResult>;
    processingTime: number;
    improvementPotential: number;
    sectionsFound: string[];
    usedPreferences: UsedPreferences;
    contentInfo: ContentInfo;
  };
}

interface SectionScore {
  sectionName: string;
  score: number;
  weight: number;
}

interface DetailedFeedback {
  sectionName: string;
  currentScore: number;
  issues: string[];
  aiSuggestion?: AISuggestion;
  benchmarkResults: Record<string, BenchmarkResult>;
  _id: string;
}

interface AISuggestion {
  originalText: string;
  improvedText: string;
  explanation: string;
  improvementType: string;
}

interface BenchmarkResult {
  passed: boolean;
  score: number;
}

interface UsedPreferences {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
  isUsingDefaults: {
    industry: boolean;
    experienceLevel: boolean;
    jobTitle: boolean;
  };
}

interface ContentInfo {
  originalWordCount: number;
  processedWordCount: number;
  wasTruncated: boolean;
  estimatedTokensUsed: number;
}

const ResumeScanResult: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [scanData, setScanData] = useState<ResumeScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScanResult = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/resume-scan/${scanId}`);
        // const data = await response.json();

        // Mock data for now - replace with actual API call
        const mockData: ResumeScanData = {
          success: true,
          message: "Resume analyzed successfully",
          data: {
            scanId: scanId || "6895d092aa95e23c0ba152c5",
            overallScore: 83,
            sectionScores: [
              { sectionName: "Contact Information", score: 10, weight: 1 },
              { sectionName: "Professional Summary", score: 4, weight: 1 },
              { sectionName: "Work Experience", score: 8, weight: 1 },
              { sectionName: "Skills", score: 8, weight: 1 },
              { sectionName: "Education", score: 10, weight: 1 },
              { sectionName: "Projects", score: 8, weight: 1 },
              { sectionName: "Certifications", score: 2, weight: 1 },
              { sectionName: "Achievements", score: 6, weight: 1 },
            ],
            detailedFeedback: [], // Add mock detailed feedback
            benchmarkResults: {}, // Add mock benchmark results
            processingTime: 18347,
            improvementPotential: 17,
            sectionsFound: [
              "Education",
              "Work Experience",
              "Projects",
              "Professional Summary",
              "Skills",
            ],
            usedPreferences: {
              targetIndustry: "Technology",
              experienceLevel: "entry",
              targetJobTitle: "Software Engineer",
              isUsingDefaults: {
                industry: false,
                experienceLevel: false,
                jobTitle: false,
              },
            },
            contentInfo: {
              originalWordCount: 435,
              processedWordCount: 435,
              wasTruncated: false,
              estimatedTokensUsed: 867,
            },
          },
        };

        setScanData(mockData);
      } catch (err) {
        setError("Failed to load scan results");
        console.error("Error fetching scan result:", err);
      } finally {
        setLoading(false);
      }
    };

    if (scanId) {
      fetchScanResult();
    } else {
      navigate("/resume-scan");
    }
  }, [scanId, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !scanData?.success) {
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

  const { data } = scanData;

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
            <button className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
              Scan Another Resume
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Score Overview & Metrics */}
          <div className="space-y-6">
            <ScoreOverview
              overallScore={data.overallScore}
              improvementPotential={data.improvementPotential}
              sectionScores={data.sectionScores}
            />
            <ScanMetrics
              processingTime={data.processingTime}
              contentInfo={data.contentInfo}
              usedPreferences={data.usedPreferences}
            />
          </div>

          {/* Middle Column - Section Analysis */}
          <div className="space-y-6 lg:col-span-2">
            <SectionAnalysis
              sectionScores={data.sectionScores}
              detailedFeedback={data.detailedFeedback}
            />
            <BenchmarkResults benchmarkResults={data.benchmarkResults} />
            <ImprovementSuggestions
              detailedFeedback={data.detailedFeedback}
              improvementPotential={data.improvementPotential}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeScanResult;
