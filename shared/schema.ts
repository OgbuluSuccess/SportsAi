import { z } from "zod";

// Schema for user registration and login
export const registerUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Content schemas
export const generateContentSchema = z.object({
  topic: z.string().min(1),
  type: z.enum(["article", "script"]),
  sportType: z.string().min(1),
  tone: z.string().optional(),
  length: z.number().min(100).max(2000),
});

// Types
export type InsertUser = z.infer<typeof registerUserSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type GenerateContentRequest = z.infer<typeof generateContentSchema>;

// Re-export MongoDB models
export { User, ContentItem, Session } from './models';
export type { UserDocument, ContentDocument } from './models';

// Pricing plan configurations
export const PRICING_PLANS = {
  free: {
    name: "Free",
    price: 0,
    features: [
      "5 articles/month",
      "Basic topic suggestions",
      "Standard response time",
    ],
    limits: {
      monthlyArticles: 5,
      maxLength: 1000,
    },
  },
  pro: {
    name: "Pro",
    price: 29,
    features: [
      "50 articles/month",
      "Advanced topic suggestions",
      "Priority response time",
      "Extended article length",
    ],
    limits: {
      monthlyArticles: 50,
      maxLength: 2000,
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 99,
    features: [
      "Unlimited articles",
      "Custom topic suggestions",
      "Instant response time",
      "Maximum article length",
      "Dedicated support",
    ],
    limits: {
      monthlyArticles: Infinity,
      maxLength: 5000,
    },
  },
} as const;
