import React from "react";
import AnalysisLoader from "../common/AnalysisLoader";

const LoadingSpinner: React.FC = () => {
  return <AnalysisLoader label="Analyzing your resume..." />;
};

export default LoadingSpinner;
