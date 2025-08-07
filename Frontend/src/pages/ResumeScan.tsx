import React, { useState } from "react";
import {ResumeUpload} from "../components/index";

const features = [
  "AI-powered resume analysis",
  "Instant feedback & suggestions",
  "ATS compatibility check",
  "Personalized improvement tips",
  "Data privacy guaranteed",
];

const ResumeScan: React.FC = () => {
  const [scansLeft, setScansLeft] = useState(3);

  const handleScanUsed = () => {
    setScansLeft((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div
      className="resume-scan-page"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(60,72,100,0.12)",
          padding: "40px 32px",
          maxWidth: 520,
          width: "100%",
          marginBottom: 32,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 8,
            color: "#3730a3",
          }}
        >
          Resume Scan
        </h1>
        <p style={{ color: "#64748b", marginBottom: 24 }}>
          Upload your resume and get instant, AI-powered feedback to boost your
          job search!
        </p>
        <ResumeUpload />
        <button
          onClick={handleScanUsed}
          disabled={scansLeft === 0}
          style={{
            marginTop: 24,
            padding: "12px 32px",
            background: scansLeft === 0 ? "#cbd5e1" : "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: scansLeft === 0 ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {scansLeft === 0 ? "No Scans Left" : "Scan Now"}
        </button>
        <div style={{ marginTop: 16, color: "#6366f1", fontWeight: 500 }}>
          Scans left: <span style={{ fontWeight: 700 }}>{scansLeft}</span>
        </div>
      </div>
      <div
        style={{
          background: "#f1f5f9",
          borderRadius: "16px",
          padding: "32px 24px",
          maxWidth: 600,
          width: "100%",
          boxShadow: "0 2px 12px rgba(60,72,100,0.06)",
          marginBottom: 32,
        }}
      >
        <h2
          style={{
            color: "#3730a3",
            fontSize: 24,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Why use our Resume Scanner?
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {features.map((feature, idx) => (
            <li
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 12,
                fontSize: 17,
                color: "#334155",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 24,
                  height: 24,
                  background: "#6366f1",
                  color: "#fff",
                  borderRadius: "50%",
                  textAlign: "center",
                  lineHeight: "24px",
                  fontWeight: 700,
                  marginRight: 12,
                }}
              >
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      {/* Decorative visual element */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
          height: 180,
          background:
            "radial-gradient(circle at 50% 100%, #6366f1 0%, transparent 80%)",
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default ResumeScan;
