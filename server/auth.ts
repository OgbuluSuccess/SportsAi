import {
  type Request,
  type Response,
  type NextFunction,
  type Express,
} from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import { type User, loginSchema, registerUserSchema } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      plan: "free" | "pro" | "enterprise";
      createdAt: Date;
    }
  }
}

// Auth middleware
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Attach user to request for route handlers
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    next(error);
  }
}

// Auth routes
export function registerAuthRoutes(app: Express) {
  // Setup passport
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      } catch (error) {
        console.error("Passport strategy error:", error);
        return done(error);
      }
    })
  );

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      const { password: _, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } catch (error) {
      console.error("Passport deserialize error:", error);
      done(error);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.post("/api/auth/register", async (req, res) => {
    try {
      console.log("Registration request:", {
        ...req.body,
        password: "[REDACTED]",
      });
      const data = registerUserSchema.parse(req.body);

      // Check if user exists
      const existing = await storage.getUserByUsername(data.username);
      if (existing) {
        res.status(400).json({ error: "Username already taken" });
        return;
      }

      // Check if email exists
      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        res.status(400).json({ error: "Email already registered" });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      // Start session
      req.session.userId = user.id;

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Invalid request format", details: error.errors });
      } else {
        res.status(500).json({ error: "Server error" });
      }
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message?: string }
      ) => {
        if (err) {
          console.error("Login error:", err);
          return next(err);
        }
        if (!user) {
          return res
            .status(401)
            .json({ error: info?.message || "Invalid credentials" });
        }
        req.logIn(user, (err: any) => {
          if (err) {
            console.error("Login session error:", err);
            return next(err);
          }
          req.session.userId = user.id;
          res.json(user);
        });
      }
    )(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json(req.user);
  });
}
