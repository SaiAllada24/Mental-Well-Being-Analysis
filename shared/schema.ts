import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
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
  suggestions: string[];
  quote: string;
  celebrityParallel: string;
  youreNotAlone: string;
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
    suggestions: ["Track emotional triggers", "build small daily rituals", "celebrate incremental wins"],
    quote: "Healing is not linear.",
    celebrityParallel: "Demi Lovato",
    youreNotAlone: "42.5% of people with a mental health history report growing stress."
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
    suggestions: ["Join a safe discussion space", "practice sharing one thought daily", "seek mentorship"],
    quote: "Your voice is your power.",
    celebrityParallel: "Selena Gomez",
    youreNotAlone: "Nearly half of those comfortable discussing mental health also seek treatment."
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
    suggestions: ["Set achievable goals", "acknowledge small victories", "avoid comparing your pace to others"],
    quote: "Slow progress is still progress.",
    celebrityParallel: "Emma Stone",
    youreNotAlone: "41.1% of people with high stress report similar cautious engagement."
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
    suggestions: ["Share insights with trusted peers", "keep learning", "use awareness to guide action"],
    quote: "Awareness is the first step toward change.",
    celebrityParallel: "Lady Gaga",
    youreNotAlone: "52.2% of people with mental health history report habit changes."
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
    suggestions: ["Use adaptability to create stability", "maintain a few core routines", "nurture connections"],
    quote: "Flexibility is strength in motion.",
    celebrityParallel: "Jim Carrey",
    youreNotAlone: "40.7% of people report habit change within 30 days indoors."
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
    suggestions: ["Schedule rest", "protect personal time", "acknowledge your resilience"],
    quote: "Rest is not a reward. It's a requirement.",
    celebrityParallel: "Naomi Osaka",
    youreNotAlone: "38.6% of people in extended isolation report work disengagement."
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
    suggestions: ["Keep communication honest", "seek feedback", "share your story when safe"],
    quote: "Connection is the energy between people.",
    celebrityParallel: "Dwayne Johnson",
    youreNotAlone: "Nearly half of those who seek treatment also report coping struggles."
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
    suggestions: ["Practice expressive writing", "join peer support groups", "share feelings without self-judgment"],
    quote: "Vulnerability is strength.",
    celebrityParallel: "Brené Brown",
    youreNotAlone: "49.4% of people with treatment history report coping struggles."
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
    suggestions: ["Keep a flexible plan", "monitor stress levels", "celebrate adaptability"],
    quote: "Adaptability is about the powerful difference between reacting and responding.",
    celebrityParallel: "Michelle Obama",
    youreNotAlone: "Many report moderate stress while adapting to new habits."
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
    suggestions: ["Schedule downtime", "delegate when possible", "avoid overcommitment"],
    quote: "You can't pour from an empty cup.",
    celebrityParallel: "Simone Biles",
    youreNotAlone: "44.3% report growing stress within 14 days indoors."
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
    suggestions: ["Keep goals realistic", "blend ambition with rest", "share your perspective"],
    quote: "Vision without action is a dream.",
    celebrityParallel: "Trevor Noah",
    youreNotAlone: "32.2% of people with care awareness report habit change."
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
    suggestions: ["Channel creativity into routines", "balance novelty with stability"],
    quote: "Creativity is intelligence having fun.",
    celebrityParallel: "Pharrell Williams",
    youreNotAlone: "Many report habit change as a positive adaptation."
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
    suggestions: ["Maintain social ties", "be present for others", "protect your own energy"],
    quote: "We rise by lifting others.",
    celebrityParallel: "Oprah Winfrey",
    youreNotAlone: "Socially grounded individuals report lower stress levels."
  },
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
    suggestions: ["Accept help when offered", "set boundaries", "practice self-care"],
    quote: "Still waters run deep.",
    celebrityParallel: "Michelle Obama",
    youreNotAlone: "35.5% report low stress in moderate isolation."
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
    suggestions: ["Stay connected virtually", "schedule self-care", "seek support when needed"],
    quote: "Compassion is a verb.",
    celebrityParallel: "Princess Diana",
    youreNotAlone: "Many caregivers report stress during extended isolation."
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
    suggestions: ["Keep consistent habits", "offer guidance", "protect your own peace"],
    quote: "Be a lighthouse, not a lifeboat.",
    celebrityParallel: "Malala Yousafzai",
    youreNotAlone: "Routine-based resilience is common among low-stress individuals."
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
    suggestions: ["Journal regularly", "set gentle goals", "practice mindfulness"],
    quote: "Knowing yourself is the beginning of all wisdom.",
    celebrityParallel: "Lady Gaga",
    youreNotAlone: "Many report habit change alongside self-reflection."
  }
];