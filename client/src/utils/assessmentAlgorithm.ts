import { AssessmentData, RiskProfile, riskProfiles, ProfileCriteria, ERIResult, ERISubScores, ERIWeights } from "@shared/schema";

interface ProcessedAssessmentData {
  stress: "Yes" | "No";
  coping_struggles: "Yes" | "No";
  work_interest_loss: "Yes" | "No";
  social_weakness: "Yes" | "No";
  interview_comfort: "Yes" | "No";
  care_awareness: "Yes" | "No" | "Not sure";
  mental_health_history: "Yes" | "No";
  habit_change: "Yes" | "No";
  mood_swings: "Low" | "Medium" | "High";
  treatment: "Yes" | "No";
  days_indoors: "1-14" | "15-30" | "31-60" | ">60" | "Go out every day";
  occupation: "Student" | "Others" | "Corporate" | "Business" | "Homemaker";
}

// ERI Calculation Constants
const ERI_WEIGHTS: ERIWeights = {
  stress: 0.25,
  copingStruggles: 0.20,
  habitChange: 0.15,
  moodSwings: 0.15,
  workInterestLoss: 0.10,
  socialWeakness: 0.10,
  daysIndoors: 0.05,
};

/**
 * Calculate ERI (Emotional Risk Index) score based on assessment data
 * Returns a score from 0-100 with risk level categorization
 */
export function calculateERI(data: ProcessedAssessmentData): ERIResult {
  // Calculate normalized sub-scores (0-1 scale)
  const subScores: ERISubScores = {
    stress: data.stress === "Yes" ? 1 : 0,
    copingStruggles: data.coping_struggles === "Yes" ? 1 : 0,
    habitChange: data.habit_change === "Yes" ? 1 : 0,
    moodSwings: getMoodSwingScore(data.mood_swings),
    workInterestLoss: data.work_interest_loss === "Yes" ? 1 : 0,
    socialWeakness: data.social_weakness === "Yes" ? 1 : 0,
    daysIndoors: getDaysIndoorsScore(data.days_indoors),
  };

  // Calculate weighted ERI score
  const eriScore = Math.round(
    (subScores.stress * ERI_WEIGHTS.stress +
     subScores.copingStruggles * ERI_WEIGHTS.copingStruggles +
     subScores.habitChange * ERI_WEIGHTS.habitChange +
     subScores.moodSwings * ERI_WEIGHTS.moodSwings +
     subScores.workInterestLoss * ERI_WEIGHTS.workInterestLoss +
     subScores.socialWeakness * ERI_WEIGHTS.socialWeakness +
     subScores.daysIndoors * ERI_WEIGHTS.daysIndoors) * 100
  );

  // Determine risk level based on score
  const riskLevel = getRiskLevel(eriScore);

  // Get the best matching profile
  const profileMatch = getMatchingProfile(data);

  return {
    eriScore,
    riskLevel,
    subScores,
    profileMatch,
  };
}

/**
 * Convert mood swings to normalized score (0-1)
 */
function getMoodSwingScore(moodSwings: "Low" | "Medium" | "High"): number {
  switch (moodSwings) {
    case "Low": return 0;
    case "Medium": return 0.5;
    case "High": return 1;
    default: return 0;
  }
}

/**
 * Convert days indoors to normalized score (0-1)
 */
function getDaysIndoorsScore(daysIndoors: "1-14" | "15-30" | "31-60" | ">60" | "Go out every day"): number {
  switch (daysIndoors) {
    case "Go out every day": return 0;
    case "1-14": return 0.25;
    case "15-30": return 0.5;
    case "31-60": return 0.75;
    case ">60": return 1;
    default: return 0;
  }
}

/**
 * Determine risk level based on ERI score
 */
function getRiskLevel(eriScore: number): "Low" | "Medium" | "High" {
  if (eriScore >= 67) return "High";
  if (eriScore >= 34) return "Medium";
  return "Low";
}

// Helper function to get matching profile (uses existing logic)
function getMatchingProfile(data: ProcessedAssessmentData): RiskProfile {
  return calculateRiskProfile(convertToAssessmentData(data));
}

// Convert ProcessedAssessmentData back to AssessmentData for compatibility
// Note: This preserves the original assessment context when available
let cachedOriginalAssessment: AssessmentData | null = null;

function convertToAssessmentData(data: ProcessedAssessmentData): AssessmentData {
  return {
    gender: cachedOriginalAssessment?.gender ?? "Male", // Use original or default
    country: cachedOriginalAssessment?.country ?? "Unknown", // Use original or default
    occupation: data.occupation,
    self_employed: cachedOriginalAssessment?.self_employed ?? "No", // Use original or default
    family_history: cachedOriginalAssessment?.family_history ?? "No", // Use original or default
    treatment: data.treatment,
    days_indoors: mapDaysIndoorsBack(data.days_indoors),
    growing_stress: data.stress,
    changes_habits: data.habit_change,
    mental_health_history: data.mental_health_history,
    mood_swings: data.mood_swings,
    coping_struggles: data.coping_struggles,
    work_interest: data.work_interest_loss === "Yes" ? "No" : "Yes", // Inverted logic
    social_weakness: data.social_weakness,
    mental_health_interview: data.interview_comfort,
    care_options: data.care_awareness
  } as AssessmentData;
}

function mapDaysIndoorsBack(daysIndoors: "1-14" | "15-30" | "31-60" | ">60" | "Go out every day"): string {
  switch (daysIndoors) {
    case "1-14": return "1-14 days";
    case "15-30": return "15-30 days";
    case "31-60": return "31-60 days";
    case ">60": return "60+ days";
    case "Go out every day": return "Go out every day";
    default: return "15-30 days";
  }
}

// Enhanced assessment calculation that includes ERI
export function calculateAssessmentWithERI(data: AssessmentData): ERIResult {
  // Cache the original assessment for demographic preservation
  cachedOriginalAssessment = data;
  
  // Map assessment data to processed format
  const processedData: ProcessedAssessmentData = {
    stress: data.growing_stress,
    coping_struggles: data.coping_struggles,
    work_interest_loss: data.work_interest === "No" ? "Yes" : "No", // Inverted logic
    social_weakness: data.social_weakness,
    interview_comfort: data.mental_health_interview,
    care_awareness: data.care_options,
    mental_health_history: data.mental_health_history,
    habit_change: data.changes_habits,
    mood_swings: data.mood_swings,
    treatment: data.treatment,
    days_indoors: mapDaysIndoors(data.days_indoors),
    occupation: data.occupation
  };

  // Calculate ERI result with profile matching
  const result = calculateERI(processedData);
  
  console.log(`ERI Calculation Results:`, {
    eriScore: result.eriScore,
    riskLevel: result.riskLevel,
    subScores: result.subScores,
    profileMatch: result.profileMatch.name
  });
  
  return result;
}

// Mapping function to convert assessment answers to profile criteria format
function mapAssessmentToProfileFormat(data: AssessmentData): Partial<ProfileCriteria> {
  return {
    stress: data.growing_stress,
    coping_struggles: data.coping_struggles,
    work_interest_loss: data.work_interest === "No" ? "Yes" : "No", // Inverted logic
    social_weakness: data.social_weakness,
    interview_comfort: data.mental_health_interview,
    care_awareness: data.care_options,
    mental_health_history: data.mental_health_history,
    habit_change: data.changes_habits,
    mood_swings: data.mood_swings,
    treatment: data.treatment,
    days_indoors: mapDaysIndoors(data.days_indoors),
    occupation: data.occupation
  };
}

function mapDaysIndoors(daysIndoors: string): "1-14" | "15-30" | "31-60" | ">60" | "Go out every day" {
  switch (daysIndoors) {
    case "1-14 days":
      return "1-14";
    case "15-30 days":
      return "15-30";
    case "31-60 days":
      return "31-60";
    case "60+ days":
      return ">60";
    case "Go out every day":
      return "Go out every day";
    default:
      return "15-30"; // Default fallback
  }
}

function calculateProfileMatch(mappedData: Partial<ProfileCriteria>, profile: RiskProfile): number {
  let score = 0;
  let totalCriteria = 0;

  // Check each criteria field and calculate match percentage
  Object.entries(profile.criteria).forEach(([key, expectedValue]) => {
    if (key === 'gender') return; // Skip gender as it's "Any" for all profiles
    
    totalCriteria++;
    const actualValue = mappedData[key as keyof ProfileCriteria];
    
    if (actualValue === expectedValue) {
      score += 1;
    }
  });

  // Return percentage match
  return totalCriteria > 0 ? (score / totalCriteria) * 100 : 0;
}

export function calculateRiskProfile(data: AssessmentData): RiskProfile {
  console.log('Assessment data:', data);
  
  // Convert assessment data to profile criteria format
  const mappedData = mapAssessmentToProfileFormat(data);
  console.log('Mapped data:', mappedData);
  
  // Calculate match score for each profile
  const profileScores = riskProfiles.map(profile => {
    const matchScore = calculateProfileMatch(mappedData, profile);
    console.log(`${profile.name}: ${matchScore}% match`);
    return {
      profile,
      score: matchScore
    };
  });

  // Sort by score (highest first)
  profileScores.sort((a, b) => b.score - a.score);
  
  console.log('Top 3 matches:', profileScores.slice(0, 3).map(p => ({
    name: p.profile.name,
    score: p.score
  })));

  // Return the best matching profile
  // If the best match has a very low score, fall back to occupation-based matching
  const bestMatch = profileScores[0];
  
  if (bestMatch.score < 50) {
    console.log('Low match score, falling back to occupation-based matching');
    // Find profiles that match the occupation
    const occupationMatches = riskProfiles.filter(profile => 
      profile.criteria.occupation === data.occupation
    );
    
    if (occupationMatches.length > 0) {
      // Among occupation matches, find the one with highest overall score
      const occupationScores = occupationMatches.map(profile => ({
        profile,
        score: calculateProfileMatch(mappedData, profile)
      }));
      
      occupationScores.sort((a, b) => b.score - a.score);
      console.log('Best occupation match:', occupationScores[0].profile.name, occupationScores[0].score);
      return occupationScores[0].profile;
    }
  }
  
  console.log('Selected profile:', bestMatch.profile.name);
  return bestMatch.profile;
}