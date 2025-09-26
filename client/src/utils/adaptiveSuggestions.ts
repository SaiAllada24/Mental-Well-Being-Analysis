import { AssessmentData, ERIResult, RiskProfile } from "@shared/schema";

// Resource Library Types
export interface MentalHealthResource {
  id: string;
  title: string;
  type: "app" | "article" | "tool" | "technique" | "community" | "professional";
  description: string;
  url?: string;
  relevantFor: {
    genders: string[];
    occupations: string[];
    riskFactors: string[];
    eriRange: { min: number; max: number };
  };
  evidence: "high" | "medium" | "emerging";
  timeCommitment: "minutes" | "daily" | "weekly" | "ongoing";
}

export interface AdaptiveSuggestion {
  category: "immediate" | "mediumTerm" | "mindset" | "resources";
  priority: number; // 1-5, higher = more important
  text: string;
  reasoning: string; // Why this suggestion was chosen
  resources: MentalHealthResource[];
  demographic: {
    gender: string;
    occupation: string;
    daysIndoors: string;
  };
}

export interface PersonalizedRecommendations {
  primarySuggestions: AdaptiveSuggestion[];
  additionalResources: MentalHealthResource[];
  emergencySupport: MentalHealthResource[];
  contextualMessage: string;
}

// Comprehensive Resource Library
const RESOURCE_LIBRARY: MentalHealthResource[] = [
  // Apps & Digital Tools
  {
    id: "headspace-app",
    title: "Headspace - Guided Meditation",
    type: "app",
    description: "Structured meditation and mindfulness exercises for stress reduction",
    url: "https://headspace.com",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Corporate", "Student", "Business"],
      riskFactors: ["stress", "anxiety", "mood_swings"],
      eriRange: { min: 30, max: 100 }
    },
    evidence: "high",
    timeCommitment: "daily"
  },
  {
    id: "calm-app",
    title: "Calm - Sleep & Relaxation",
    type: "app", 
    description: "Sleep stories, meditation, and relaxation techniques",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Any"],
      riskFactors: ["mood_swings", "stress", "habit_change"],
      eriRange: { min: 20, max: 80 }
    },
    evidence: "high",
    timeCommitment: "daily"
  },
  {
    id: "daylio-tracker",
    title: "Daylio - Mood Tracking",
    type: "app",
    description: "Simple mood tracking to identify patterns and triggers",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Any"],
      riskFactors: ["mood_swings", "habit_change"],
      eriRange: { min: 25, max: 100 }
    },
    evidence: "medium",
    timeCommitment: "daily"
  },

  // Techniques & Practices
  {
    id: "box-breathing",
    title: "Box Breathing Technique",
    type: "technique",
    description: "4-4-4-4 breathing pattern to reduce acute stress and anxiety",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Corporate", "Business", "Student"],
      riskFactors: ["stress", "interview_anxiety"],
      eriRange: { min: 20, max: 100 }
    },
    evidence: "high",
    timeCommitment: "minutes"
  },
  {
    id: "progressive-muscle",
    title: "Progressive Muscle Relaxation",
    type: "technique",
    description: "Systematic tensing and relaxing of muscle groups",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Any"],
      riskFactors: ["stress", "mood_swings", "days_indoors"],
      eriRange: { min: 30, max: 100 }
    },
    evidence: "high",
    timeCommitment: "daily"
  },
  {
    id: "journaling-cbt",
    title: "CBT Thought Record Journaling",
    type: "technique",
    description: "Structured journaling to challenge negative thought patterns",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Student", "Corporate"],
      riskFactors: ["coping_struggles", "mood_swings"],
      eriRange: { min: 35, max: 100 }
    },
    evidence: "high",
    timeCommitment: "daily"
  },

  // Physical & Social Activities
  {
    id: "indoor-exercise",
    title: "Indoor Exercise Routines",
    type: "tool",
    description: "Bodyweight exercises and yoga for confined spaces",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Any"],
      riskFactors: ["days_indoors", "habit_change"],
      eriRange: { min: 15, max: 80 }
    },
    evidence: "high",
    timeCommitment: "daily"
  },
  {
    id: "nature-connection",
    title: "Nature Connection Practices",
    type: "technique",
    description: "Ways to connect with nature from indoors or brief outdoor moments",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Any"],
      riskFactors: ["days_indoors", "mood_swings"],
      eriRange: { min: 20, max: 100 }
    },
    evidence: "medium",
    timeCommitment: "daily"
  },

  // Professional Support
  {
    id: "betterhelp-therapy",
    title: "BetterHelp - Online Therapy",
    type: "professional",
    description: "Professional therapy sessions via video, phone, or messaging",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Any"],
      riskFactors: ["mental_health_history", "coping_struggles"],
      eriRange: { min: 50, max: 100 }
    },
    evidence: "high",
    timeCommitment: "weekly"
  },
  {
    id: "crisis-hotline",
    title: "National Crisis Text Line",
    type: "professional",
    description: "24/7 crisis support via text message - Text HOME to 741741",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Any"],
      riskFactors: ["Any"],
      eriRange: { min: 70, max: 100 }
    },
    evidence: "high",
    timeCommitment: "ongoing"
  },

  // Occupation-Specific Resources
  {
    id: "student-wellness",
    title: "Student Mental Health Resources",
    type: "community",
    description: "Campus counseling services and peer support groups",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Student"],
      riskFactors: ["stress", "social_weakness"],
      eriRange: { min: 25, max: 100 }
    },
    evidence: "medium",
    timeCommitment: "weekly"
  },
  {
    id: "workplace-stress",
    title: "Corporate Stress Management",
    type: "tool",
    description: "Workplace-specific stress reduction and boundary setting",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Corporate"],
      riskFactors: ["stress", "work_interest_loss"],
      eriRange: { min: 30, max: 100 }
    },
    evidence: "medium",
    timeCommitment: "daily"
  },
  {
    id: "entrepreneur-support",
    title: "Entrepreneur Mental Health Network",
    type: "community",
    description: "Peer support for business owners facing unique stressors",
    relevantFor: {
      genders: ["Any"],
      occupations: ["Business"],
      riskFactors: ["stress", "social_weakness"],
      eriRange: { min: 35, max: 100 }
    },
    evidence: "medium",
    timeCommitment: "weekly"
  },

  // Gender-Specific Considerations  
  {
    id: "mens-mental-health",
    title: "Men's Mental Health Support",
    type: "community",
    description: "Resources addressing male-specific mental health challenges",
    relevantFor: {
      genders: ["Male"],
      occupations: ["Any"],
      riskFactors: ["social_weakness", "coping_struggles"],
      eriRange: { min: 40, max: 100 }
    },
    evidence: "medium",
    timeCommitment: "ongoing"
  },
  {
    id: "womens-wellness",
    title: "Women's Mental Wellness Community",
    type: "community",
    description: "Gender-specific support for hormonal, social, and career stressors",
    relevantFor: {
      genders: ["Female"],
      occupations: ["Any"],
      riskFactors: ["mood_swings", "stress"],
      eriRange: { min: 30, max: 100 }
    },
    evidence: "medium",
    timeCommitment: "weekly"
  }
];

/**
 * Generate personalized recommendations based on assessment data, ERI results, and demographic profile
 */
export function generateAdaptiveSuggestions(
  assessmentData: AssessmentData,
  eriResult: ERIResult,
  profileMatch: RiskProfile
): PersonalizedRecommendations {
  
  const { gender, occupation, days_indoors } = assessmentData;
  const { eriScore, subScores } = eriResult;
  
  // Identify primary risk factors based on sub-scores
  const primaryRiskFactors = getPrimaryRiskFactors(subScores);
  
  // Generate context-aware suggestions
  const adaptiveSuggestions = generateContextualSuggestions(
    gender, occupation, days_indoors, eriScore, primaryRiskFactors
  );
  
  // Find relevant resources
  const relevantResources = findRelevantResources(
    gender, occupation, primaryRiskFactors, eriScore
  );
  
  // Get emergency support if needed
  const emergencySupport = eriScore >= 70 ? getEmergencyResources() : [];
  
  // Generate contextual message
  const contextualMessage = generateContextualMessage(
    gender, occupation, days_indoors, eriScore, primaryRiskFactors
  );
  
  return {
    primarySuggestions: adaptiveSuggestions,
    additionalResources: relevantResources.slice(0, 6), // Limit to top 6
    emergencySupport,
    contextualMessage
  };
}

/**
 * Identify primary risk factors from ERI sub-scores
 */
function getPrimaryRiskFactors(subScores: any): string[] {
  const factors = [];
  
  if (subScores.stress >= 0.8) factors.push("stress");
  if (subScores.copingStruggles >= 0.8) factors.push("coping_struggles");
  if (subScores.moodSwings >= 0.7) factors.push("mood_swings");
  if (subScores.habitChange >= 0.8) factors.push("habit_change");
  if (subScores.workInterestLoss >= 0.8) factors.push("work_interest_loss");
  if (subScores.socialWeakness >= 0.8) factors.push("social_weakness");
  if (subScores.daysIndoors >= 0.7) factors.push("days_indoors");
  
  return factors;
}

/**
 * Generate contextual suggestions based on demographic and risk profile
 */
function generateContextualSuggestions(
  gender: string,
  occupation: string,
  daysIndoors: string,
  eriScore: number,
  riskFactors: string[]
): AdaptiveSuggestion[] {
  
  const suggestions: AdaptiveSuggestion[] = [];
  
  // Immediate action based on highest risk factors
  if (riskFactors.includes("stress")) {
    suggestions.push({
      category: "immediate",
      priority: 5,
      text: getStressReliefSuggestion(occupation, daysIndoors),
      reasoning: "High stress levels detected - immediate relief needed",
      resources: findResourcesByType("technique", ["stress"]),
      demographic: { gender, occupation, daysIndoors }
    });
  }
  
  // Medium-term goals based on occupation and lifestyle
  if (riskFactors.includes("days_indoors") && parseInt(daysIndoors.split("-")[0] || "0") > 30) {
    suggestions.push({
      category: "mediumTerm",
      priority: 4,
      text: getOutdoorIntegrationSuggestion(occupation),
      reasoning: "Extended indoor time - gradual outdoor integration needed",
      resources: findResourcesByType("tool", ["days_indoors"]),
      demographic: { gender, occupation, daysIndoors }
    });
  }
  
  // Mindset shifts based on coping struggles
  if (riskFactors.includes("coping_struggles")) {
    suggestions.push({
      category: "mindset",
      priority: 4,
      text: getCopingMindsetSuggestion(gender, occupation),
      reasoning: "Coping difficulties identified - cognitive reframing needed",
      resources: findResourcesByType("technique", ["coping_struggles"]),
      demographic: { gender, occupation, daysIndoors }
    });
  }
  
  // Professional help for high ERI scores
  if (eriScore >= 60) {
    suggestions.push({
      category: "resources",
      priority: 5,
      text: "Consider connecting with a mental health professional for personalized support",
      reasoning: "ERI score indicates significant risk - professional guidance recommended",
      resources: findResourcesByType("professional", ["Any"]),
      demographic: { gender, occupation, daysIndoors }
    });
  }
  
  const sortedSuggestions = suggestions.sort((a, b) => b.priority - a.priority);
  
  // Get additional resources and emergency support
  const additionalResources = findResourcesByType("app", [gender]).slice(0, 3);
  const emergencySupport = findResourcesByType("professional", ["Any"]).slice(0, 2);
  
  // Create contextual message based on ERI score
  const contextualMessage = eriScore >= 70 
    ? "Your risk assessment indicates significant concerns. These personalized recommendations are designed to provide immediate and ongoing support."
    : eriScore >= 40
    ? "Your assessment shows moderate risk factors. These suggestions can help you build resilience and improve your wellbeing."
    : "Your assessment shows some areas for growth. These recommendations can help you maintain and enhance your mental wellness.";
  
  const result: PersonalizedRecommendations = {
    primarySuggestions: sortedSuggestions,
    additionalResources,
    emergencySupport,
    contextualMessage
  };
  
  return result;
}

/**
 * Get stress relief suggestion based on context
 */
function getStressReliefSuggestion(occupation: string, daysIndoors: string): string {
  const isIndoorFocused = daysIndoors.includes(">60") || daysIndoors.includes("31-60");
  
  if (occupation === "Corporate") {
    return isIndoorFocused 
      ? "Try the 5-4-3-2-1 grounding technique during work breaks: 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste"
      : "Take a 10-minute walk outside during lunch break while practicing deep breathing";
  }
  
  if (occupation === "Student") {
    return isIndoorFocused
      ? "Create a 'study sanctuary' with plants and natural light, then practice 4-7-8 breathing between study sessions"
      : "Find a quiet outdoor study spot and use the Pomodoro technique with fresh air breaks";
  }
  
  if (occupation === "Business") {
    return "Schedule 'breathing meetings' with yourself - 5 minutes of box breathing before important decisions";
  }
  
  return "Practice the STOP technique: Stop, Take a breath, Observe your thoughts, Proceed mindfully";
}

/**
 * Get outdoor integration suggestion based on occupation
 */
function getOutdoorIntegrationSuggestion(occupation: string): string {
  if (occupation === "Corporate") {
    return "Negotiate one outdoor meeting per week or take phone calls while walking";
  }
  
  if (occupation === "Student") {
    return "Join a study group that meets in a park or outdoor campus area once weekly";
  }
  
  if (occupation === "Business") {
    return "Schedule walking meetings with clients or partners when possible";
  }
  
  return "Set a daily 15-minute 'nature timer' - even looking out a window with plants counts";
}

/**
 * Get coping mindset suggestion based on demographics
 */
function getCopingMindsetSuggestion(gender: string, occupation: string): string {
  const genderContext = gender === "Male" ? "strength and resilience" : "self-compassion and community";
  
  if (occupation === "Student") {
    return `Reframe challenges as learning opportunities - your ${genderContext} grows with each difficulty you navigate`;
  }
  
  if (occupation === "Corporate") {
    return `View setbacks as data points, not failures - your ${genderContext} helps you adapt and grow`;
  }
  
  return `Remember: asking for help is a sign of wisdom, not weakness - your ${genderContext} includes knowing when to seek support`;
}

/**
 * Find relevant resources based on criteria
 */
function findRelevantResources(
  gender: string,
  occupation: string,
  riskFactors: string[],
  eriScore: number
): MentalHealthResource[] {
  
  return RESOURCE_LIBRARY.filter(resource => {
    // Check gender relevance
    const genderMatch = resource.relevantFor.genders.includes("Any") || 
                       resource.relevantFor.genders.includes(gender);
    
    // Check occupation relevance
    const occupationMatch = resource.relevantFor.occupations.includes("Any") ||
                           resource.relevantFor.occupations.includes(occupation);
    
    // Check risk factor relevance
    const riskMatch = resource.relevantFor.riskFactors.includes("Any") ||
                     riskFactors.some(factor => resource.relevantFor.riskFactors.includes(factor));
    
    // Check ERI score range
    const eriMatch = eriScore >= resource.relevantFor.eriRange.min &&
                    eriScore <= resource.relevantFor.eriRange.max;
    
    return genderMatch && occupationMatch && riskMatch && eriMatch;
  }).sort((a, b) => {
    // Prioritize high evidence resources
    const evidenceScore = { high: 3, medium: 2, emerging: 1 };
    return evidenceScore[b.evidence] - evidenceScore[a.evidence];
  });
}

/**
 * Find resources by type and risk factors
 */
function findResourcesByType(type: string, riskFactors: string[]): MentalHealthResource[] {
  return RESOURCE_LIBRARY.filter(resource => 
    resource.type === type && 
    (resource.relevantFor.riskFactors.includes("Any") ||
     riskFactors.some(factor => resource.relevantFor.riskFactors.includes(factor)))
  ).slice(0, 3);
}

/**
 * Get emergency support resources
 */
function getEmergencyResources(): MentalHealthResource[] {
  return RESOURCE_LIBRARY.filter(resource => 
    resource.type === "professional" && 
    resource.relevantFor.eriRange.min <= 70
  );
}

/**
 * Generate contextual message based on user profile
 */
function generateContextualMessage(
  gender: string,
  occupation: string,
  daysIndoors: string,
  eriScore: number,
  riskFactors: string[]
): string {
  
  const contextParts = [];
  
  // Occupation context
  if (occupation === "Student") {
    contextParts.push("As a student, you're navigating unique academic and social pressures");
  } else if (occupation === "Corporate") {
    contextParts.push("Your corporate environment brings specific workplace stressors");
  } else if (occupation === "Business") {
    contextParts.push("As a business professional, you face entrepreneurial challenges");
  }
  
  // Indoor lifestyle context
  if (daysIndoors.includes(">60") || daysIndoors.includes("31-60")) {
    contextParts.push("spending significant time indoors affects mood and energy");
  }
  
  // Risk level context
  if (eriScore >= 70) {
    contextParts.push("Your current stress levels suggest immediate support would be beneficial");
  } else if (eriScore >= 40) {
    contextParts.push("You're experiencing moderate stress that's manageable with the right tools");
  } else {
    contextParts.push("You're in a relatively stable place but can still benefit from preventive strategies");
  }
  
  return contextParts.join(", ") + ". These personalized recommendations are designed specifically for your situation.";
}