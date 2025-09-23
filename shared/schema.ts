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
  days_indoors: z.enum(["1-14 days", "15+ days", "15-30 days", "31-60 days", "60+ days"]),
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

export interface RiskProfile {
  id: string;
  name: string;
  emoji: string;
  occupation: string[];
  keySignals: string[];
  emotionalNarrative: string;
  suggestions: string[];
  quote: string;
  celebrityParallel: string;
  youreNotAlone: string;
  expandedNarrative: string;
}

export const riskProfiles: RiskProfile[] = [
  {
    id: "corporate-burnout",
    name: "The Corporate Burnout",
    emoji: "🧱",
    occupation: ["Corporate"],
    keySignals: ["Stress = Yes", "Coping = Yes", "Indoors > 60"],
    emotionalNarrative: "You've been carrying silent pressure. You're not weak — you're worn.",
    suggestions: ["Block reflection time weekly", "Say 'I need time'"],
    quote: "Rest is not a reward. It's a requirement.",
    celebrityParallel: "Naomi Osaka",
    youreNotAlone: "38.6% of corporate professionals indoors >60 days report work interest loss",
    expandedNarrative: "You're in a structured role, often high-pressure, and you've been indoors far too long. You're coping, but barely. You may feel emotionally numb, fatigued, or disconnected from your work. This profile reflects silent burnout — the kind that builds slowly and invisibly."
  },
  {
    id: "overwhelmed-achiever",
    name: "The Overwhelmed Achiever",
    emoji: "🌪",
    occupation: ["Business"],
    keySignals: ["Stress = Yes", "Habit Change = Yes", "Work Interest = No"],
    emotionalNarrative: "You push through everything — even when it hurts.",
    suggestions: ["Micro-breaks", "journaling", "reduce overcommitment"],
    quote: "You can't pour from an empty cup.",
    celebrityParallel: "Simone Biles",
    youreNotAlone: "44.3% of business professionals report growing stress within 14 days indoors",
    expandedNarrative: "You're driven, ambitious, and constantly adapting — but it's taking a toll. You've lost interest in work, your habits are shifting, and stress is mounting. You may feel like you're failing, but you're simply overloaded."
  },
  {
    id: "quiet-responder",
    name: "The Quiet Responder",
    emoji: "🌿",
    occupation: ["Homemaker"],
    keySignals: ["Stress = No", "Social Weakness = No", "Indoors = 15–30"],
    emotionalNarrative: "You're steady, but quiet. You keep things together.",
    suggestions: ["Light social engagement", "gratitude journaling"],
    quote: "Still waters run deep.",
    celebrityParallel: "Michelle Obama",
    youreNotAlone: "35.5% of homemakers report indoor time of 15–30 days with low stress",
    expandedNarrative: "You're emotionally steady and socially grounded. You may not feel overwhelmed, but you're quietly absorbing stress. You're the type who supports others — often without asking for help yourself."
  },
  {
    id: "self-aware-seeker",
    name: "The Self-Aware Seeker",
    emoji: "🔍",
    occupation: ["Others"],
    keySignals: ["Care Awareness = Yes", "Mental Health History = Yes"],
    emotionalNarrative: "You've faced storms before. You're seeking clarity.",
    suggestions: ["Explore therapy", "read mental health blogs"],
    quote: "Knowing yourself is the beginning of all wisdom.",
    celebrityParallel: "Lady Gaga",
    youreNotAlone: "52.2% of 'Others' with mental health history report habit change",
    expandedNarrative: "You've experienced mental health challenges before, and you're actively seeking clarity. You're reflective, informed, and emotionally literate. You may feel stuck, but you're also equipped to move forward."
  },
  {
    id: "socially-isolated",
    name: "The Socially Isolated",
    emoji: "🕸",
    occupation: ["Student"],
    keySignals: ["Social Weakness = Yes", "Indoors > 60", "Interview = No"],
    emotionalNarrative: "You feel unseen. But your silence is a signal.",
    suggestions: ["Join low-pressure community", "track one habit"],
    quote: "You are not alone, even when it feels like it.",
    celebrityParallel: "Selena Gomez",
    youreNotAlone: "28.7% of students indoors >2 months report work interest loss",
    expandedNarrative: "You feel disconnected — from people, from work, from yourself. You may struggle to speak up or ask for help. This profile reflects emotional invisibility, often masked by silence."
  },
  {
    id: "habitual-adapter",
    name: "The Habitual Adapter",
    emoji: "🔄",
    occupation: ["Business"],
    keySignals: ["Habit Change = Yes", "Stress = Moderate", "Treatment = No"],
    emotionalNarrative: "You adapt fast — sometimes too fast.",
    suggestions: ["Anchor routines", "reduce digital overload"],
    quote: "Change is hard at first, messy in the middle…",
    celebrityParallel: "Jim Carrey",
    youreNotAlone: "40.7% of business professionals report habit change at 15–30 days indoors",
    expandedNarrative: "You're flexible, but it's exhausting. You change routines often, but struggle to anchor emotionally. You may feel reactive, scattered, or overstimulated."
  },
  {
    id: "expressive-empath",
    name: "The Expressive Empath",
    emoji: "💬",
    occupation: ["Corporate"],
    keySignals: ["Interview = Yes", "Treatment = Yes"],
    emotionalNarrative: "You speak your truth. You seek help.",
    suggestions: ["Peer support", "expressive writing"],
    quote: "Vulnerability is strength.",
    celebrityParallel: "Dwayne Johnson",
    youreNotAlone: "49.4% of corporate workers with treatment history report coping struggles",
    expandedNarrative: "You're emotionally open and proactive. You've sought help, and you're comfortable talking about it. You may still struggle, but you're not afraid to feel."
  },
  {
    id: "resilient-realist",
    name: "The Resilient Realist",
    emoji: "🧭",
    occupation: ["Homemaker"],
    keySignals: ["Stress = No", "Mood Swings = Low", "Care Awareness = Yes"],
    emotionalNarrative: "You've built resilience through routine.",
    suggestions: ["Maintain routines", "support others"],
    quote: "Resilience is built, not born.",
    celebrityParallel: "Trevor Noah",
    youreNotAlone: "32.2% of homemakers with care awareness report habit change",
    expandedNarrative: "You're grounded, emotionally balanced, and proactive. You've built resilience through routine and reflection. You may not need urgent help — but you're a quiet pillar for others."
  },
  {
    id: "interview-avoider",
    name: "The Interview Avoider",
    emoji: "🔒",
    occupation: ["Others"],
    keySignals: ["Interview = No", "Stress = Yes", "Work Interest = Yes"],
    emotionalNarrative: "You avoid the spotlight to protect yourself.",
    suggestions: ["Practice small disclosures", "affirm boundaries"],
    quote: "Courage doesn't always roar.",
    celebrityParallel: "Emma Stone",
    youreNotAlone: "41.1% of 'Others' report stress at 15–30 days indoors",
    expandedNarrative: "You avoid mental health conversations — not out of denial, but self-protection. You may fear judgment or feel unsafe expressing vulnerability. This profile reflects guarded resilience."
  },
  {
    id: "history-holder",
    name: "The History Holder",
    emoji: "🧠",
    occupation: ["Student"],
    keySignals: ["Mental Health History = Yes", "Coping = Yes", "Mood Swings = High"],
    emotionalNarrative: "You've been here before. You're learning to rewrite the story.",
    suggestions: ["Track triggers", "build support rituals"],
    quote: "Healing is not linear.",
    celebrityParallel: "Demi Lovato",
    youreNotAlone: "42.5% of students with mental health history report growing stress",
    expandedNarrative: "You've lived with mental health challenges. You know the patterns, and you're trying to rewrite them. You may feel overwhelmed, but you're also deeply self-aware."
  }
];