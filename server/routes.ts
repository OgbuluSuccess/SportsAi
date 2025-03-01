import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import {
  generateContent,
  generateTopicSuggestions,
  analyzeTopicInDepth,
} from "./ai"; // Added import for analyzeTopicInDepth
import { generateContentSchema } from "@shared/schema";
import { ZodError } from "zod";
import { registerAuthRoutes, requireAuth } from "./auth";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId: number;
    passport: any;
  }
}

export async function registerRoutes(app: Express) {
  // Setup sessions
  app.use(
    session({
      store: storage.sessionStore,
      secret: process.env.SESSION_SECRET || "development_secret",
      resave: true,
      saveUninitialized: false,
      name: "sports_ai_session", // Specific name helps avoid conflicts
      cookie: {
        secure: false, // Set to false for both dev and production in Replit
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        path: "/",
      },
    })
  );

  // Register auth routes
  registerAuthRoutes(app);

  // Protected routes
  app.post("/api/generate", requireAuth, async (req, res) => {
    try {
      const params = generateContentSchema.parse(req.body);
      const result = await generateContent(params);

      const saved = await storage.createContent({
        userId: req.user!.id,
        topic: params.topic,
        type: params.type,
        prompt: JSON.stringify(params),
        content: result.content,
        metadata: {
          ...result.metadata,
          created: new Date().toISOString(),
        },
      });

      res.json(saved);
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({ error: "Invalid request format", details: error.errors });
      } else {
        const message =
          error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ error: message });
      }
    }
  });

  app.get("/api/content", requireAuth, async (req, res) => {
    try {
      const content = await storage.getAllContent(req.user!.id);
      res.json(content);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: message });
    }
  });

  app.get("/api/content/:id", requireAuth, async (req, res) => {
    try {
      const content = await storage.getContent(parseInt(req.params.id));
      if (!content) {
        res.status(404).json({ error: "Content not found" });
        return;
      }
      if (content.userId !== req.user!.id) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      res.json(content);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: message });
    }
  });

  app.get("/api/health/openai", requireAuth, (req, res) => {
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    res.json({
      status: hasApiKey ? "configured" : "missing",
      apiKeyConfigured: hasApiKey,
      keyLength: hasApiKey ? process.env.OPENAI_API_KEY!.length : 0,
    });
  });

  app.get("/api/suggestions/:sport", requireAuth, async (req, res) => {
    try {
      const topics = await generateTopicSuggestions(req.params.sport);
      res.json({ topics });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/analyze", requireAuth, async (req, res) => {
    try {
      const { topic, sportType } = req.body;

      if (!topic || !sportType) {
        res.status(400).json({ error: "Topic and sport type are required" });
        return;
      }

      const analysis = await analyzeTopicInDepth(topic, sportType);
      res.json(analysis);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: message });
    }
  });

  app.get("/api/topic-analysis", requireAuth, async (req, res) => {
    try {
      const { topic, sportType } = req.query;

      if (!topic || typeof topic !== "string") {
        res.status(400).json({ error: "Topic is required" });
        return;
      }

      console.log(
        `[topic-analysis] Fetching analysis for topic: "${topic}", sport: "${sportType}"`
      );

      // Use the provided sportType or default to "general"
      const sport = typeof sportType === "string" ? sportType : "general";
      const analysis = await analyzeTopicInDepth(topic, sport);

      console.log(
        `[topic-analysis] Analysis received from OpenAI. Relevance: ${analysis.relevance}, Timeliness: ${analysis.timeliness}`
      );

      // Return a simplified version for the topic analysis component
      const responseData = {
        popularity: analysis.relevance,
        trending: analysis.timeliness,
        relatedTopics: analysis.relatedSubtopics,
        keyInsights: analysis.keyAspects,
        summary: analysis.analysis,
      };

      console.log(
        `[topic-analysis] Sending response: ${JSON.stringify(
          responseData
        ).substring(0, 150)}...`
      );
      res.json(responseData);
    } catch (error) {
      console.error("Topic analysis error:", error);
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
