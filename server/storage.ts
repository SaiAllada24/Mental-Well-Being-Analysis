import { 
  type User, 
  type InsertUser,
  type UserProfile,
  type InsertUserProfile,
  type AssessmentSession,
  type InsertAssessmentSession,
  type RiskMetric,
  type UserProgress,
  type BenchmarkData,
  type ERIResult
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // User Profile operations (anonymous tracking)
  getUserProfile(anonymousId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfileActivity(id: string): Promise<void>;

  // Assessment Session operations
  createAssessmentSession(session: InsertAssessmentSession): Promise<AssessmentSession>;
  getUserAssessmentHistory(userProfileId: string, limit?: number): Promise<AssessmentSession[]>;
  getAssessmentSession(id: string): Promise<AssessmentSession | undefined>;

  // Risk Metrics operations (for benchmarking)
  getRiskMetric(profileId: string, gender: string, occupation: string): Promise<RiskMetric | undefined>;
  updateRiskMetrics(profileId: string, gender: string, occupation: string, eriScore: number): Promise<void>;
  getAllRiskMetrics(): Promise<RiskMetric[]>;

  // Analytics operations
  getUserProgress(userProfileId: string): Promise<UserProgress>;
  getBenchmarkData(profileId?: string, gender?: string, occupation?: string): Promise<BenchmarkData>;
  getGlobalAverageERI(): Promise<number>;
  getProfileAverageERI(profileId: string): Promise<number>;
  getDemographicAverageERI(gender: string, occupation: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProfiles: Map<string, UserProfile>;
  private userProfilesByAnonymousId: Map<string, UserProfile>;
  private assessmentSessions: Map<string, AssessmentSession>;
  private riskMetrics: Map<string, RiskMetric>;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.userProfilesByAnonymousId = new Map();
    this.assessmentSessions = new Map();
    this.riskMetrics = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // User Profile operations (anonymous tracking)
  async getUserProfile(anonymousId: string): Promise<UserProfile | undefined> {
    return this.userProfilesByAnonymousId.get(anonymousId);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const now = new Date();
    const profile: UserProfile = {
      id,
      anonymousId: insertProfile.anonymousId,
      createdAt: now,
      lastActiveAt: now,
    };
    this.userProfiles.set(id, profile);
    this.userProfilesByAnonymousId.set(insertProfile.anonymousId, profile);
    return profile;
  }

  async updateUserProfileActivity(id: string): Promise<void> {
    const profile = this.userProfiles.get(id);
    if (profile) {
      profile.lastActiveAt = new Date();
      this.userProfiles.set(id, profile);
      this.userProfilesByAnonymousId.set(profile.anonymousId, profile);
    }
  }

  // Assessment Session operations
  async createAssessmentSession(insertSession: InsertAssessmentSession): Promise<AssessmentSession> {
    const id = randomUUID();
    const session: AssessmentSession = {
      id,
      userProfileId: insertSession.userProfileId,
      assessmentData: insertSession.assessmentData,
      profileId: insertSession.profileId,
      eriScore: insertSession.eriScore,
      riskLevel: insertSession.riskLevel,
      subScores: insertSession.subScores,
      createdAt: new Date(),
    };
    this.assessmentSessions.set(id, session);
    return session;
  }

  async getUserAssessmentHistory(userProfileId: string, limit?: number): Promise<AssessmentSession[]> {
    const sessions = Array.from(this.assessmentSessions.values())
      .filter(session => session.userProfileId === userProfileId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? sessions.slice(0, limit) : sessions;
  }

  async getAssessmentSession(id: string): Promise<AssessmentSession | undefined> {
    return this.assessmentSessions.get(id);
  }

  // Risk Metrics operations (for benchmarking)
  async getRiskMetric(profileId: string, gender: string, occupation: string): Promise<RiskMetric | undefined> {
    const key = `${profileId}-${gender}-${occupation}`;
    return this.riskMetrics.get(key);
  }

  async updateRiskMetrics(profileId: string, gender: string, occupation: string, eriScore: number): Promise<void> {
    const key = `${profileId}-${gender}-${occupation}`;
    const existing = this.riskMetrics.get(key);
    
    if (existing) {
      // Update average ERI score
      const totalScore = existing.avgEriScore * existing.totalSessions + eriScore;
      existing.totalSessions += 1;
      existing.avgEriScore = totalScore / existing.totalSessions;
      existing.updatedAt = new Date();
    } else {
      // Create new metric
      const id = randomUUID();
      const metric: RiskMetric = {
        id,
        profileId,
        gender,
        occupation,
        avgEriScore: eriScore,
        totalSessions: 1,
        updatedAt: new Date(),
      };
      this.riskMetrics.set(key, metric);
    }
  }

  async getAllRiskMetrics(): Promise<RiskMetric[]> {
    return Array.from(this.riskMetrics.values());
  }

  // Analytics operations
  async getUserProgress(userProfileId: string): Promise<UserProgress> {
    const sessions = await this.getUserAssessmentHistory(userProfileId);
    
    // Calculate current streak (consecutive assessments within past 7 days each)
    let currentStreak = 0;
    const now = new Date();
    
    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = sessions[i].createdAt;
      const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7 * (i + 1)) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate improvement score (change in ERI over time)
    let improvementScore = 0;
    if (sessions.length >= 2) {
      const latestERI = sessions[0].eriScore;
      const earliestERI = sessions[sessions.length - 1].eriScore;
      improvementScore = earliestERI - latestERI; // Positive = improvement (lower ERI)
    }
    
    return {
      currentStreak,
      totalAssessments: sessions.length,
      improvementScore,
      trendsData: {
        dates: sessions.map(s => s.createdAt.toISOString()),
        eriScores: sessions.map(s => s.eriScore),
        riskLevels: sessions.map(s => s.riskLevel),
      },
      achievements: this.calculateAchievements(currentStreak, sessions.length, improvementScore),
    };
  }

  async getBenchmarkData(profileId?: string, gender?: string, occupation?: string): Promise<BenchmarkData> {
    const allMetrics = await this.getAllRiskMetrics();
    const allSessions = Array.from(this.assessmentSessions.values());
    
    // Global average
    const globalAverage = allSessions.length > 0 
      ? allSessions.reduce((sum, s) => sum + s.eriScore, 0) / allSessions.length
      : 0;
    
    // Profile average
    const profileSessions = profileId 
      ? allSessions.filter(s => s.profileId === profileId)
      : [];
    const profileAverage = profileSessions.length > 0
      ? profileSessions.reduce((sum, s) => sum + s.eriScore, 0) / profileSessions.length
      : globalAverage;
    
    // Demographic averages
    const genderSessions = gender 
      ? allSessions.filter(s => {
          const data = s.assessmentData as any;
          return data.gender === gender;
        })
      : [];
    const occupationSessions = occupation
      ? allSessions.filter(s => {
          const data = s.assessmentData as any;
          return data.occupation === occupation;
        })
      : [];
    const combinedSessions = gender && occupation
      ? allSessions.filter(s => {
          const data = s.assessmentData as any;
          return data.gender === gender && data.occupation === occupation;
        })
      : [];
    
    // Calculate percentiles
    const sortedScores = allSessions.map(s => s.eriScore).sort((a, b) => a - b);
    
    return {
      globalAverage,
      profileAverage,
      demographicAverage: {
        gender: genderSessions.length > 0 
          ? genderSessions.reduce((sum, s) => sum + s.eriScore, 0) / genderSessions.length
          : globalAverage,
        occupation: occupationSessions.length > 0
          ? occupationSessions.reduce((sum, s) => sum + s.eriScore, 0) / occupationSessions.length
          : globalAverage,
        combined: combinedSessions.length > 0
          ? combinedSessions.reduce((sum, s) => sum + s.eriScore, 0) / combinedSessions.length
          : globalAverage,
      },
      distributionPercentiles: {
        p25: this.getPercentile(sortedScores, 0.25),
        p50: this.getPercentile(sortedScores, 0.50),
        p75: this.getPercentile(sortedScores, 0.75),
        p90: this.getPercentile(sortedScores, 0.90),
      },
    };
  }

  async getGlobalAverageERI(): Promise<number> {
    const allSessions = Array.from(this.assessmentSessions.values());
    return allSessions.length > 0 
      ? allSessions.reduce((sum, s) => sum + s.eriScore, 0) / allSessions.length
      : 0;
  }

  async getProfileAverageERI(profileId: string): Promise<number> {
    const profileSessions = Array.from(this.assessmentSessions.values())
      .filter(s => s.profileId === profileId);
    return profileSessions.length > 0
      ? profileSessions.reduce((sum, s) => sum + s.eriScore, 0) / profileSessions.length
      : 0;
  }

  async getDemographicAverageERI(gender: string, occupation: string): Promise<number> {
    const demographicSessions = Array.from(this.assessmentSessions.values())
      .filter(s => {
        const data = s.assessmentData as any;
        return data.gender === gender && data.occupation === occupation;
      });
    return demographicSessions.length > 0
      ? demographicSessions.reduce((sum, s) => sum + s.eriScore, 0) / demographicSessions.length
      : 0;
  }

  // Helper methods
  private getPercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;
    const index = Math.ceil(sortedArray.length * percentile) - 1;
    return sortedArray[Math.max(0, index)];
  }

  private calculateAchievements(streak: number, totalAssessments: number, improvementScore: number) {
    const achievements = [];
    
    if (totalAssessments >= 1) {
      achievements.push({
        id: "first-assessment",
        title: "First Step",
        description: "Completed your first mental health assessment",
        dateEarned: new Date().toISOString(),
        badgeEmoji: "sprout" // Icon key instead of emoji
      });
    }
    
    if (streak >= 3) {
      achievements.push({
        id: "streak-week",
        title: "Building Momentum",
        description: "Maintained a 3-week assessment streak",
        dateEarned: new Date().toISOString(),
        badgeEmoji: "flame" // Icon key instead of emoji
      });
    }
    
    if (improvementScore > 10) {
      achievements.push({
        id: "improvement-significant",
        title: "Growing Stronger",
        description: "Showed significant improvement in emotional resilience",
        dateEarned: new Date().toISOString(),
        badgeEmoji: "muscle" // Icon key instead of emoji
      });
    }
    
    return achievements;
  }
}

export const storage = new MemStorage();
