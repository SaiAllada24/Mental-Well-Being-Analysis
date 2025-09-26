import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User Profiles for Anonymous Tracking
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  anonymousId: varchar("anonymous_id").notNull().unique(), // Client-generated UUID for privacy
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
});

// Assessment Sessions - Individual assessment records
export const assessmentSessions = pgTable("assessment_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userProfileId: varchar("user_profile_id").references(() => userProfiles.id).notNull(),
  assessmentData: json("assessment_data").notNull(), // Raw assessment answers
  profileId: varchar("profile_id").notNull(), // Matched risk profile ID
  eriScore: real("eri_score").notNull(), // 0-100 ERI score
  riskLevel: varchar("risk_level").notNull(), // Low, Medium, High
  subScores: json("sub_scores").notNull(), // Individual component scores
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Risk Metrics for Aggregate Statistics
export const riskMetrics = pgTable("risk_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull(),
  gender: varchar("gender").notNull(),
  occupation: varchar("occupation").notNull(),
  avgEriScore: real("avg_eri_score").notNull(),
  totalSessions: integer("total_sessions").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  anonymousId: true,
});

export const insertAssessmentSessionSchema = createInsertSchema(assessmentSessions).pick({
  userProfileId: true,
  assessmentData: true,
  profileId: true,
  eriScore: true,
  riskLevel: true,
  subScores: true,
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertAssessmentSession = z.infer<typeof insertAssessmentSessionSchema>;
export type AssessmentSession = typeof assessmentSessions.$inferSelect;
export type RiskMetric = typeof riskMetrics.$inferSelect;

// ERI Scoring Types
export interface ERIWeights {
  stress: 0.25;
  copingStruggles: 0.20;
  habitChange: 0.15;
  moodSwings: 0.15;
  workInterestLoss: 0.10;
  socialWeakness: 0.10;
  daysIndoors: 0.05;
}

export interface ERISubScores {
  stress: number;          // 0-1 normalized
  copingStruggles: number; // 0-1 normalized
  habitChange: number;     // 0-1 normalized
  moodSwings: number;      // 0-1 normalized (Low=0, Medium=0.5, High=1)
  workInterestLoss: number; // 0-1 normalized
  socialWeakness: number;  // 0-1 normalized
  daysIndoors: number;     // 0-1 normalized (Go out every day=0, 1-14=0.25, 15-30=0.5, 31-60=0.75, >60=1)
}

export interface ERIResult {
  eriScore: number;        // 0-100 final score
  riskLevel: "Low" | "Medium" | "High";
  subScores: ERISubScores;
  profileMatch: RiskProfile;
  comparisonStats?: {
    avgForProfile: number;
    avgForDemographic: number;
    percentileRank: number;
  };
}

// Adaptive Suggestions Types
export interface AdaptiveSuggestion {
  immediate: string;
  mediumTerm: string;
  mindset: string;
  theme: "Social" | "Emotional" | "Routine" | "Cognitive";
  resources?: ResourceLink[];
}

export interface ResourceLink {
  type: "Article" | "App" | "Helpline" | "Video" | "Book";
  title: string;
  url: string;
  description: string;
  region?: string; // For location-specific resources
}

// Progress Tracking Types
export interface UserProgress {
  currentStreak: number;
  totalAssessments: number;
  improvementScore: number; // Change in ERI over time
  trendsData: {
    dates: string[];
    eriScores: number[];
    riskLevels: string[];
  };
  achievements: UserAchievement[];
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  dateEarned: string;
  badgeEmoji: string; // Icon key (e.g., "sprout", "flame", "muscle") - to be rendered with lucide-react icons
}

// Anonymous Benchmarking Types
export interface BenchmarkData {
  globalAverage: number;
  profileAverage: number;
  demographicAverage: {
    gender: number;
    occupation: number;
    combined: number;
  };
  distributionPercentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
}

// Mental Health Assessment Schema
export const assessmentSchema = z.object({
  gender: z.enum(["Male", "Female", "Other"]),
  country: z.string().min(1, "Country is required"),
  occupation: z.enum(["Corporate", "Business", "Student", "Homemaker", "Others"]),
  self_employed: z.enum(["Yes", "No", "NaN"]),
  family_history: z.enum(["Yes", "No"]),
  treatment: z.enum(["Yes", "No"]),
  days_indoors: z.enum(["1-14 days", "15-30 days", "31-60 days", "60+ days", "Go out every day"]),
  growing_stress: z.enum(["Yes", "No"]),
  changes_habits: z.enum(["Yes", "No"]),
  mental_health_history: z.enum(["Yes", "No"]),
  mood_swings: z.enum(["Low", "Medium", "High"]),
  coping_struggles: z.enum(["Yes", "No"]),
  work_interest: z.enum(["Yes", "No"]),
  social_weakness: z.enum(["Yes", "No"]),
  mental_health_interview: z.enum(["Yes", "No"]),
  care_options: z.enum(["Yes", "No", "Not sure"])
});

export type AssessmentData = z.infer<typeof assessmentSchema>;

export interface ProfileCriteria {
  gender: "Any" | "Male" | "Female" | "Other";
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

export interface RiskProfile {
  id: string;
  name: string;
  emoji: string;
  criteria: ProfileCriteria;
  narrative: string;
  philosophy: string;
  suggestions: {
    immediate: string;
    mediumTerm: string;
    mindset: string;
  };
  celebrityParallel: string;
  whoElseWentThroughThis: string;
}

export const riskProfiles: RiskProfile[] = [
  {
    id: "story-weaver",
    name: "The Story Weaver",
    emoji: "📖",
    criteria: {
      gender: "Any",
      stress: "Yes",
      coping_struggles: "Yes",
      work_interest_loss: "Yes",
      social_weakness: "No",
      interview_comfort: "No",
      care_awareness: "Yes",
      mental_health_history: "Yes",
      habit_change: "Yes",
      mood_swings: "High",
      treatment: "No",
      days_indoors: ">60",
      occupation: "Student"
    },
    narrative: "You carry experiences like chapters — some heavy, some hopeful. You've been here before, and you're learning to shape new endings.",
    philosophy: "Life is a tapestry; even the frayed threads add depth and beauty.",
    suggestions: {
      immediate: "Keep a \"chapter journal\" to reframe difficult moments as lessons.",
      mediumTerm: "Share one chapter with a trusted listener to lighten its weight.",
      mindset: "See yourself as the author, not just the character."
    },
    celebrityParallel: "Demi Lovato — turned her struggles with addiction and mental health into music and advocacy, showing that rewriting your story is possible.",
    whoElseWentThroughThis: "42.5% of people with a mental health history report growing stress."
  },
  {
    id: "rising-voice",
    name: "The Rising Voice",
    emoji: "🎤",
    criteria: {
      gender: "Any",
      stress: "No",
      coping_struggles: "No",
      work_interest_loss: "No",
      social_weakness: "No",
      interview_comfort: "Yes",
      care_awareness: "Yes",
      mental_health_history: "No",
      habit_change: "No",
      mood_swings: "Medium",
      treatment: "Yes",
      days_indoors: "15-30",
      occupation: "Student"
    },
    narrative: "You're finding your words and your courage. Speaking up feels new, but each time you do, you strengthen your voice.",
    philosophy: "Courage grows in the space between fear and action.",
    suggestions: {
      immediate: "Practice speaking in safe, low-stakes spaces.",
      mediumTerm: "Join a cause or group aligned with your values.",
      mindset: "Treat each conversation as a seed for change."
    },
    celebrityParallel: "Selena Gomez — overcame anxiety and depression, using her platform to speak openly and create a mental health fund through Rare Beauty.",
    whoElseWentThroughThis: "Nearly half of those comfortable discussing mental health also seek treatment."
  },
  {
    id: "careful-climber",
    name: "The Careful Climber",
    emoji: "🧗",
    criteria: {
      gender: "Any",
      stress: "Yes",
      coping_struggles: "Yes",
      work_interest_loss: "Yes",
      social_weakness: "Yes",
      interview_comfort: "No",
      care_awareness: "No",
      mental_health_history: "No",
      habit_change: "No",
      mood_swings: "Medium",
      treatment: "No",
      days_indoors: "31-60",
      occupation: "Others"
    },
    narrative: "You move forward with intention, weighing each step. Progress is steady, even if cautious.",
    philosophy: "Steady steps build unshakable foundations.",
    suggestions: {
      immediate: "Break goals into micro-tasks.",
      mediumTerm: "Track progress visually to see growth.",
      mindset: "Value sustainability over speed."
    },
    celebrityParallel: "Emma Stone — navigated panic attacks early in life, choosing roles and routines that supported her mental health while building a successful career.",
    whoElseWentThroughThis: "41.1% of people with high stress report similar cautious engagement."
  },
  {
    id: "insightful-ally",
    name: "The Insightful Ally",
    emoji: "🔍",
    criteria: {
      gender: "Any",
      stress: "No",
      coping_struggles: "No",
      work_interest_loss: "No",
      social_weakness: "No",
      interview_comfort: "Yes",
      care_awareness: "Yes",
      mental_health_history: "Yes",
      habit_change: "Yes",
      mood_swings: "Low",
      treatment: "Yes",
      days_indoors: "15-30",
      occupation: "Others"
    },
    narrative: "You see patterns others miss. Your awareness is a gift — it helps you support yourself and those around you.",
    philosophy: "Awareness without action is observation; awareness with action is transformation.",
    suggestions: {
      immediate: "Share one insight weekly with a trusted person.",
      mediumTerm: "Use awareness to anticipate challenges.",
      mindset: "See your insight as a tool for empowerment."
    },
    celebrityParallel: "Lady Gaga — transformed her experiences with PTSD and chronic pain into advocacy for kindness and mental health through the Born This Way Foundation.",
    whoElseWentThroughThis: "52.2% of people with mental health history report habit changes."
  },
  {
    id: "flexible-link",
    name: "The Flexible Link",
    emoji: "🔗",
    criteria: {
      gender: "Any",
      stress: "No",
      coping_struggles: "No",
      work_interest_loss: "No",
      social_weakness: "No",
      interview_comfort: "Yes",
      care_awareness: "Yes",
      mental_health_history: "No",
      habit_change: "Yes",
      mood_swings: "Medium",
      treatment: "No",
      days_indoors: "Go out every day",
      occupation: "Others"
    },
    narrative: "You adapt easily and connect people, ideas, and opportunities. Change doesn't scare you — you work with it.",
    philosophy: "Flexibility is the art of staying rooted while bending with the wind.",
    suggestions: {
      immediate: "Keep a core routine while experimenting with new activities.",
      mediumTerm: "Build bridges between different social circles.",
      mindset: "See change as a collaborator, not an enemy."
    },
    celebrityParallel: "Jim Carrey — shifted from comedic fame to painting and speaking openly about depression, embracing change as part of his identity.",
    whoElseWentThroughThis: "40.7% of people report habit change within 30 days indoors."
  },
  {
    id: "steady-horizon",
    name: "The Steady Horizon",
    emoji: "🏔️",
    criteria: {
      gender: "Any",
      stress: "Yes",
      coping_struggles: "Yes",
      work_interest_loss: "Yes",
      social_weakness: "No",
      interview_comfort: "No",
      care_awareness: "Not sure",
      mental_health_history: "Yes",
      habit_change: "No",
      mood_swings: "High",
      treatment: "No",
      days_indoors: ">60",
      occupation: "Corporate"
    },
    narrative: "You've been on a long journey, and you keep moving forward. Your endurance is quiet but powerful.",
    philosophy: "Endurance is not about never stopping; it's about starting again after every pause.",
    suggestions: {
      immediate: "Schedule intentional rest.",
      mediumTerm: "Create a \"recovery plan\" for high-stress weeks.",
      mindset: "See pauses as part of progress."
    },
    celebrityParallel: "Naomi Osaka — stepped back from tennis to protect her mental health, showing that rest can be a strategic choice.",
    whoElseWentThroughThis: "38.6% of people in extended isolation report work disengagement."
  },
  {
    id: "open-bridge",
    name: "The Open Bridge",
    emoji: "🌉",
    criteria: {
      gender: "Any",
      stress: "No",
      coping_struggles: "No",
      work_interest_loss: "No",
      social_weakness: "No",
      interview_comfort: "Yes",
      care_awareness: "Yes",
      mental_health_history: "No",
      habit_change: "No",
      mood_swings: "Low",
      treatment: "Yes",
      days_indoors: "15-30",
      occupation: "Corporate"
    },
    narrative: "You connect openly, building trust between yourself and others. Your openness is a strength.",
    philosophy: "Openness invites connection; connection invites healing.",
    suggestions: {
      immediate: "Initiate one honest conversation weekly.",
      mediumTerm: "Build a support network.",
      mindset: "Treat vulnerability as a bridge, not a risk."
    },
    celebrityParallel: "Dwayne Johnson — speaks candidly about depression, using openness to connect with millions.",
    whoElseWentThroughThis: "Nearly half of those who seek treatment also report coping struggles."
  },
  {
    id: "heartfelt-voice",
    name: "The Heartfelt Voice",
    emoji: "💖",
    criteria: {
      gender: "Any",
      stress: "Yes",
      coping_struggles: "No",
      work_interest_loss: "No",
      social_weakness: "No",
      interview_comfort: "Yes",
      care_awareness: "Yes",
      mental_health_history: "Yes",
      habit_change: "No",
      mood_swings: "Medium",
      treatment: "Yes",
      days_indoors: "31-60",
      occupation: "Corporate"
    },
    narrative: "You speak from the heart, even when it's hard. Your authenticity inspires others.",
    philosophy: "Authenticity is the courage to be seen as you are.",
    suggestions: {
      immediate: "Practice expressive writing.",
      mediumTerm: "Share feelings with a trusted group.",
      mindset: "See honesty as a gift to yourself and others."
    },
    celebrityParallel: "Brené Brown — built a career on researching vulnerability and courage, showing how openness transforms relationships.",
    whoElseWentThroughThis: "49.4% of people with treatment history report coping struggles."
  },
  {
    id: "agile-pathfinder",
    name: "The Agile Pathfinder",
    emoji: "🧭",
    criteria: {
      gender: "Any",
      stress: "No",
      coping_struggles: "Yes",
      work_interest_loss: "No",
      social_weakness: "No",
      interview_comfort: "Yes",
      care_awareness: "Not sure",
      mental_health_history: "No",
      habit_change: "Yes",
      mood_swings: "Medium",
      treatment: "No",
      days_indoors: "15-30",
      occupation: "Corporate"
    },
    narrative: "You adjust your course with skill, navigating change thoughtfully.",
    philosophy: "Adaptability is choosing your response, not just reacting.",
    suggestions: {
      immediate: "Keep a flexible plan.",
      mediumTerm: "Build \"pivot points\" into projects.",
      mindset: "See change as a skill to master."
    },
    celebrityParallel: "Michelle Obama — adapted to public life while maintaining personal values and routines.",
    whoElseWentThroughThis: "Many report moderate stress while adapting to new habits."
  },
  {
    id: "tireless-voyager",
    name: "The Tireless Voyager",
    emoji: "⛵",
    criteria: {
      gender: "Any",
      stress: "Yes",
      coping_struggles: "Yes",
      work_interest_loss: "Yes",
      social_weakness: "No",
      interview_comfort: "No",
      care_awareness: "No",
      mental_health_history: "No",
      habit_change: "Yes",
      mood_swings: "High",
      treatment: "No",
      days_indoors: "1-14",
      occupation: "Business"
    },
    narrative: "You keep going, even when the path is steep. Your drive is admirable, but rest matters too.",
    philosophy: "Persistence without rest becomes depletion.",
    suggestions: {
      immediate: "Schedule downtime.",
      mediumTerm: "Delegate tasks.",
      mindset: "Value energy as much as effort."
    },
    celebrityParallel: "Simone Biles — withdrew from Olympic events to prioritize mental health, redefining success.",
    whoElseWentThroughThis: "44.3% report growing stress within 14 days indoors."
  },
  {
    id: "grounded-visionary",
    name: "The Grounded Visionary",
    emoji: "🎯",
    criteria: {
      gender: "Any",
      stress: "No",
      coping_struggles: "No",
      work_interest_loss: "No",
      social_weakness: "No",
      interview_comfort: "Yes",
      care_awareness: "Yes",
      mental_health_history: "No",
      habit_change: "No",
      mood_swings: "Low",
      treatment: "No",
      days_indoors: "15-30",
      occupation: "Business"
    },
    narrative: "You see the big picture and act with balance. Your vision is rooted in reality.",
    philosophy: "Vision grows best when planted in the soil of reality.",
    suggestions: {
      immediate: "Align goals with current resources.",
      mediumTerm: "Share vision with collaborators.",
      mindset: "Balance ambition with rest."
    },
    celebrityParallel: "Trevor Noah — navigated complex personal history to become a global storyteller.",
    whoElseWentThroughThis: "32.2% of people with care awareness report habit change."
  },
  {
    id: "creative-rhythm",
    name: "The Creative Rhythm",
    emoji: "🎨",
    criteria: {
      gender: "Any",
      stress: "No",
      coping_struggles: "No",
      work_interest_loss: "No",
      social_weakness: "No",
      interview_comfort: "Yes",
      care_awareness: "Yes",
      mental_health_history: "No",
      habit_change: "Yes",
      mood_swings: "Medium",
      treatment: "Yes",
      days_indoors: "Go out every day",
      occupation: "Business"
    },
    narrative: "You thrive on innovation and change, finding new ways to grow.",
    philosophy: "Creativity is the pulse of renewal.",
    suggestions: {
      immediate: "Schedule creative time.",
      mediumTerm: "Blend novelty with stability.",
      mindset: "See creativity as self-care."
    },
    celebrityParallel: "Pharrell Williams — uses music and design to express joy and emotional depth.",
    whoElseWentThroughThis: "Many report habit change as a positive adaptation."
  },
  {
    id: "community-anchor",
    name: "The Community Anchor",
    emoji: "⚓",
    criteria: {
      gender: "Any",
      stress: "No",
      coping_struggles: "No",
      work_interest_loss: "No",
      social_weakness: "No",
      interview_comfort: "Yes",
      care_awareness: "Yes",
      mental_health_history: "No",
      habit_change: "No",
      mood_swings: "Low",
      treatment: "No",
      days_indoors: "15-30",
      occupation: "Business"
    },
    narrative: "You're rooted in connection, offering stability to those around you.",
    philosophy: "We rise by lifting others.",
    suggestions: {
      immediate: "Maintain social ties.",
      mediumTerm: "Offer support without overextending.",
      mindset: "See community as mutual care."
    },
    celebrityParallel: "Oprah Winfrey — built a career on fostering connection and empowering others through authentic storytelling.",
    whoElseWentThroughThis: "Socially grounded individuals report lower stress levels."
  },
  // Fallback profiles for Homemaker category (using improved format but keeping original content until updated document is provided)
  {
    id: "quiet-pillar",
    name: "The Quiet Pillar",
    emoji: "🏛️",
    criteria: {
      gender: "Any",
      stress: "No",
      coping_struggles: "No",
      work_interest_loss: "No",
      social_weakness: "No",
      interview_comfort: "No",
      care_awareness: "Yes",
      mental_health_history: "No",
      habit_change: "No",
      mood_swings: "Low",
      treatment: "No",
      days_indoors: "15-30",
      occupation: "Homemaker"
    },
    narrative: "You support others quietly, without seeking recognition.",
    philosophy: "Still waters run deep.",
    suggestions: {
      immediate: "Accept help when offered.",
      mediumTerm: "Set boundaries to protect your energy.",
      mindset: "Practice self-care as an act of strength."
    },
    celebrityParallel: "Michelle Obama — balanced family responsibilities with personal goals, showing quiet strength and determination.",
    whoElseWentThroughThis: "35.5% report low stress in moderate isolation."
  },
  {
    id: "gentle-guardian",
    name: "The Gentle Guardian",
    emoji: "🛡️",
    criteria: {
      gender: "Any",
      stress: "Yes",
      coping_struggles: "Yes",
      work_interest_loss: "No",
      social_weakness: "Yes",
      interview_comfort: "No",
      care_awareness: "Yes",
      mental_health_history: "No",
      habit_change: "No",
      mood_swings: "Medium",
      treatment: "No",
      days_indoors: ">60",
      occupation: "Homemaker"
    },
    narrative: "You care deeply, even in solitude. Your empathy is a gift.",
    philosophy: "Compassion is a verb.",
    suggestions: {
      immediate: "Stay connected virtually with loved ones.",
      mediumTerm: "Schedule regular self-care activities.",
      mindset: "Seek support when needed without guilt."
    },
    celebrityParallel: "Princess Diana — dedicated her life to caring for others while managing her own struggles with mental health.",
    whoElseWentThroughThis: "Many caregivers report stress during extended isolation."
  },
  {
    id: "everyday-lighthouse",
    name: "The Everyday Lighthouse",
    emoji: "🗼",
    criteria: {
      gender: "Any",
      stress: "No",
      coping_struggles: "No",
      work_interest_loss: "No",
      social_weakness: "No",
      interview_comfort: "Yes",
      care_awareness: "Yes",
      mental_health_history: "No",
      habit_change: "No",
      mood_swings: "Low",
      treatment: "No",
      days_indoors: "15-30",
      occupation: "Homemaker"
    },
    narrative: "You guide others through routine and calm presence.",
    philosophy: "Be a lighthouse, not a lifeboat.",
    suggestions: {
      immediate: "Keep consistent daily habits.",
      mediumTerm: "Offer guidance when others seek it.",
      mindset: "Protect your own peace while helping others."
    },
    celebrityParallel: "Malala Yousafzai — maintains unwavering commitment to education while caring for her own wellbeing.",
    whoElseWentThroughThis: "Routine-based resilience is common among low-stress individuals."
  },
  {
    id: "thoughtful-horizon",
    name: "The Thoughtful Horizon",
    emoji: "🌅",
    criteria: {
      gender: "Any",
      stress: "No",
      coping_struggles: "No",
      work_interest_loss: "No",
      social_weakness: "No",
      interview_comfort: "Yes",
      care_awareness: "Yes",
      mental_health_history: "Yes",
      habit_change: "Yes",
      mood_swings: "Medium",
      treatment: "No",
      days_indoors: "31-60",
      occupation: "Homemaker"
    },
    narrative: "You look inward and forward, balancing reflection with hope.",
    philosophy: "Knowing yourself is the beginning of all wisdom.",
    suggestions: {
      immediate: "Journal regularly to process thoughts.",
      mediumTerm: "Set gentle, achievable goals.",
      mindset: "Practice mindfulness and self-reflection."
    },
    celebrityParallel: "Lady Gaga — uses self-reflection and personal experiences to create meaningful art and advocacy.",
    whoElseWentThroughThis: "Many report habit change alongside self-reflection."
  }
];