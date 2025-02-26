import { type Content, type InsertContent, type User, type InsertUser, users, contentItems } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresStore = connectPg(session);

export interface IStorage {
  // User management
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;

  // Content management
  createContent(content: InsertContent & { userId: number }): Promise<Content>;
  getContent(id: number): Promise<Content | undefined>;
  getAllContent(userId: number): Promise<Content[]>;

  // Session store
  sessionStore: session.Store;
}

export class PostgresStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
    });
  }

  // User management
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }

  // Content management
  async createContent(content: InsertContent & { userId: number }): Promise<Content> {
    const [newContent] = await db.insert(contentItems).values(content).returning();
    return newContent;
  }

  async getContent(id: number): Promise<Content | undefined> {
    const [content] = await db
      .select()
      .from(contentItems)
      .where(eq(contentItems.id, id))
      .limit(1);
    return content;
  }

  async getAllContent(userId: number): Promise<Content[]> {
    return db
      .select()
      .from(contentItems)
      .where(eq(contentItems.userId, userId))
      .orderBy(desc(contentItems.id));
  }
}

export const storage = new PostgresStorage();