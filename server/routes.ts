import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { assessmentSchema, type AssessmentData } from "@shared/schema";
import { z } from "zod";

// Request validation schemas
const assessmentSubmissionSchema = z.object({
  assessmentData: assessmentSchema,
  anonymousId: z.string().uuid().optional(), // Optional UUID for returning users
});
import { calculateAssessmentWithERI } from "../client/src/utils/assessmentAlgorithm";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Assessment Routes
  
  // Submit assessment and get ERI results
  app.post("/api/assessment/submit", async (req, res) => {
    try {
      // Validate the entire request payload
      const { assessmentData, anonymousId: providedAnonymousId } = assessmentSubmissionSchema.parse(req.body);
      
      // Generate or use provided anonymousId
      const anonymousId = providedAnonymousId || randomUUID();
      
      // Calculate ERI results
      const eriResult = calculateAssessmentWithERI(assessmentData);
      
      // Get or create user profile
      let userProfile = await storage.getUserProfile(anonymousId);
      if (!userProfile) {
        userProfile = await storage.createUserProfile({ anonymousId });
      } else {
        await storage.updateUserProfileActivity(userProfile.id);
      }
      
      // Store assessment session
      const session = await storage.createAssessmentSession({
        userProfileId: userProfile.id,
        assessmentData: assessmentData,
        profileId: eriResult.profileMatch.id,
        eriScore: eriResult.eriScore,
        riskLevel: eriResult.riskLevel,
        subScores: eriResult.subScores,
      });
      
      // Update risk metrics for benchmarking
      await storage.updateRiskMetrics(
        eriResult.profileMatch.id,
        assessmentData.gender,
        assessmentData.occupation,
        eriResult.eriScore
      );
      
      res.json({
        sessionId: session.id,
        eriResult,
        userProfile: { id: userProfile.id, anonymousId: userProfile.anonymousId },
        // Always return the anonymousId for client to persist
        anonymousId: userProfile.anonymousId
      });
    } catch (error) {
      console.error("Assessment submission error:", error);
      res.status(400).json({ error: "Invalid assessment data" });
    }
  });
  
  // User Profile Routes
  
  // Get user profile by anonymous ID
  app.get("/api/profile/:anonymousId", async (req, res) => {
    try {
      const { anonymousId } = req.params;
      const profile = await storage.getUserProfile(anonymousId);
      
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Assessment History Routes
  
  // Get user assessment history
  app.get("/api/history/:anonymousId", async (req, res) => {
    try {
      const { anonymousId } = req.params;
      const { limit } = req.query;
      
      const profile = await storage.getUserProfile(anonymousId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      const history = await storage.getUserAssessmentHistory(
        profile.id, 
        limit ? parseInt(limit as string) : undefined
      );
      
      res.json(history);
    } catch (error) {
      console.error("History fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Get specific assessment session
  app.get("/api/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getAssessmentSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Session fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Analytics Routes
  
  // Get user progress and achievements
  app.get("/api/progress/:anonymousId", async (req, res) => {
    try {
      const { anonymousId } = req.params;
      
      const profile = await storage.getUserProfile(anonymousId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      const progress = await storage.getUserProgress(profile.id);
      res.json(progress);
    } catch (error) {
      console.error("Progress fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Get benchmarking data
  app.get("/api/benchmark", async (req, res) => {
    try {
      const { profileId, gender, occupation } = req.query;
      
      const benchmarkData = await storage.getBenchmarkData(
        profileId as string,
        gender as string,
        occupation as string
      );
      
      res.json(benchmarkData);
    } catch (error) {
      console.error("Benchmark fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Get global statistics
  app.get("/api/stats/global", async (req, res) => {
    try {
      const globalAverage = await storage.getGlobalAverageERI();
      const allMetrics = await storage.getAllRiskMetrics();
      
      res.json({
        globalAverageERI: globalAverage,
        totalProfiles: allMetrics.length,
        totalSessions: allMetrics.reduce((sum, metric) => sum + metric.totalSessions, 0)
      });
    } catch (error) {
      console.error("Global stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Get profile-specific statistics
  app.get("/api/stats/profile/:profileId", async (req, res) => {
    try {
      const { profileId } = req.params;
      const profileAverage = await storage.getProfileAverageERI(profileId);
      
      res.json({
        profileId,
        averageERI: profileAverage
      });
    } catch (error) {
      console.error("Profile stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Get demographic statistics
  app.get("/api/stats/demographic", async (req, res) => {
    try {
      const { gender, occupation } = req.query;
      
      if (!gender || !occupation) {
        return res.status(400).json({ error: "Gender and occupation are required" });
      }
      
      const demographicAverage = await storage.getDemographicAverageERI(
        gender as string,
        occupation as string
      );
      
      res.json({
        gender,
        occupation,
        averageERI: demographicAverage
      });
    } catch (error) {
      console.error("Demographic stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Risk Metrics Routes
  
  // Get all risk metrics (for admin/analytics)
  app.get("/api/metrics/risk", async (req, res) => {
    try {
      const metrics = await storage.getAllRiskMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Risk metrics fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "2.0.0-analytics" 
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
