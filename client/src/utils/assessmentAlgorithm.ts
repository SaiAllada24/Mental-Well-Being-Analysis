import { AssessmentData, RiskProfile, riskProfiles } from "@shared/schema";

export function calculateRiskProfile(data: AssessmentData): RiskProfile {
  // Score each profile based on matching criteria
  const scores = riskProfiles.map(profile => {
    let score = 0;
    
    // Base occupation match (high weight)
    if (profile.occupation.includes(data.occupation)) {
      score += 30;
    }
    
    // Corporate Burnout signals
    if (profile.id === "corporate-burnout") {
      if (data.growing_stress === "Yes") score += 20;
      if (data.coping_struggles === "Yes") score += 20;
      if (data.days_indoors === "60+ days") score += 25;
      if (data.occupation === "Corporate") score += 10;
    }
    
    // Overwhelmed Achiever signals
    if (profile.id === "overwhelmed-achiever") {
      if (data.growing_stress === "Yes") score += 25;
      if (data.changes_habits === "Yes") score += 20;
      if (data.work_interest === "No") score += 20;
      if (data.occupation === "Business") score += 10;
    }
    
    // Quiet Responder signals
    if (profile.id === "quiet-responder") {
      if (data.growing_stress === "No") score += 25;
      if (data.social_weakness === "No") score += 20;
      if (data.days_indoors === "15-30 days") score += 20;
      if (data.occupation === "Homemaker") score += 10;
    }
    
    // Self-Aware Seeker signals
    if (profile.id === "self-aware-seeker") {
      if (data.care_options === "Yes") score += 25;
      if (data.mental_health_history === "Yes") score += 25;
      if (data.occupation === "Others") score += 10;
    }
    
    // Socially Isolated signals
    if (profile.id === "socially-isolated") {
      if (data.social_weakness === "Yes") score += 25;
      if (data.days_indoors === "60+ days") score += 20;
      if (data.mental_health_interview === "No") score += 20;
      if (data.occupation === "Student") score += 10;
    }
    
    // Habitual Adapter signals
    if (profile.id === "habitual-adapter") {
      if (data.changes_habits === "Yes") score += 25;
      if (data.growing_stress === "Yes") score += 15; // moderate stress
      if (data.treatment === "No") score += 20;
      if (data.occupation === "Business") score += 10;
    }
    
    // Expressive Empath signals
    if (profile.id === "expressive-empath") {
      if (data.mental_health_interview === "Yes") score += 25;
      if (data.treatment === "Yes") score += 25;
      if (data.occupation === "Corporate") score += 10;
    }
    
    // Resilient Realist signals
    if (profile.id === "resilient-realist") {
      if (data.growing_stress === "No") score += 25;
      if (data.mood_swings === "Low") score += 20;
      if (data.care_options === "Yes") score += 20;
      if (data.occupation === "Homemaker") score += 10;
    }
    
    // Interview Avoider signals
    if (profile.id === "interview-avoider") {
      if (data.mental_health_interview === "No") score += 25;
      if (data.growing_stress === "Yes") score += 20;
      if (data.work_interest === "Yes") score += 20;
      if (data.occupation === "Others") score += 10;
    }
    
    // History Holder signals
    if (profile.id === "history-holder") {
      if (data.mental_health_history === "Yes") score += 25;
      if (data.coping_struggles === "Yes") score += 20;
      if (data.mood_swings === "High") score += 20;
      if (data.occupation === "Student") score += 10;
    }
    
    return { profile, score };
  });
  
  // Sort by score and return the highest matching profile
  scores.sort((a, b) => b.score - a.score);
  
  // If no clear match, default to appropriate profile based on occupation
  if (scores[0].score < 30) {
    const occupationDefault = riskProfiles.find(p => 
      p.occupation.includes(data.occupation)
    );
    return occupationDefault || riskProfiles[0];
  }
  
  return scores[0].profile;
}