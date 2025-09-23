import { useState } from "react";
import { AssessmentData, RiskProfile } from "@shared/schema";
import { LandingPage } from "@/components/LandingPage";
import { AssessmentForm } from "@/components/AssessmentForm";
import { ResultsPage } from "@/components/ResultsPage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { calculateRiskProfile } from "@/utils/assessmentAlgorithm";

type AppState = "landing" | "assessment" | "results";

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>("landing");
  const [assessmentResults, setAssessmentResults] = useState<RiskProfile | null>(null);

  const handleStartAssessment = () => {
    setCurrentState("assessment");
  };

  const handleAssessmentSubmit = (data: AssessmentData) => {
    console.log('Assessment data received:', data);
    const profile = calculateRiskProfile(data);
    console.log('Calculated profile:', profile);
    setAssessmentResults(profile);
    setCurrentState("results");
  };

  const handleBackToLanding = () => {
    setCurrentState("landing");
  };

  const handleStartOver = () => {
    setAssessmentResults(null);
    setCurrentState("landing");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      {currentState === "landing" && (
        <LandingPage onStartAssessment={handleStartAssessment} />
      )}

      {currentState === "assessment" && (
        <AssessmentForm 
          onSubmit={handleAssessmentSubmit}
          onBack={handleBackToLanding}
        />
      )}

      {currentState === "results" && assessmentResults && (
        <ResultsPage 
          profile={assessmentResults}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
}