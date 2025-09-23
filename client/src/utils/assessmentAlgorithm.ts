import { AssessmentData, RiskProfile, riskProfiles, ProfileCriteria } from "@shared/schema";

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