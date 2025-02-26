import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  json,
  foreignKey,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  plan: text("plan", { enum: ["free", "pro", "enterprise"] })
    .default("free")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  topic: text("topic").notNull(),
  type: text("type", { enum: ["article", "script"] }).notNull(),
  prompt: text("prompt").notNull(),
  content: text("content").notNull(),
  metadata: json("metadata")
    .$type<{
      wordCount?: number;
      suggestedTags?: string[];
      created?: string;
    }>()
    .notNull(),
});

// Schema for user registration and login
export const registerUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    email: true,
    password: true,
  })
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
    email: z.string().email("Invalid email address"),
  });

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Content schemas
export const insertContentSchema = createInsertSchema(contentItems).pick({
  topic: true,
  type: true,
  prompt: true,
  content: true,
  metadata: true,
  userId: true,
});

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
export type User = typeof users.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contentItems.$inferSelect;
export type GenerateContentRequest = z.infer<typeof generateContentSchema>;

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
