import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import bcrypt from "bcryptjs";

// Configure passport to use local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);

      if (!user) {
        return done(null, false, { message: "Invalid username" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return done(null, false, { message: "Invalid password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Configure serialization (what goes into session)
passport.serializeUser((user: any, done) => {
  console.log("Serializing user:", user.id);
  done(null, user.id);
});

// Configure deserialization (how to get user from session data)
passport.deserializeUser(async (id: number, done) => {
  try {
    // Reduce logging noise
    const user = await storage.getUser(id);
    if (!user) {
      console.log("User not found during deserialization");
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    console.error("Error during deserialization:", error);
    done(error);
  }
});

export function registerAuthRoutes(app: Express) {
  // Initialize passport and session handling
  app.use(passport.initialize());
  app.use(passport.session());

  // Debug middleware to log session and user (only for specific endpoints)
  app.use((req, res, next) => {
    // Only log session data for auth-related endpoints
    if (req.path.startsWith("/api/auth/")) {
      console.log("Session ID:", req.sessionID);
      console.log("Is authenticated:", req.isAuthenticated());
      // Don't log full session and user data for cleaner logs
    }
    next();
  });

  // Register route
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        plan: "free",
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // Login route
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Authentication error:", err);
        return next(err);
      }

      if (!user) {
        return res
          .status(401)
          .json({ error: info?.message || "Invalid credentials" });
      }

      console.log("User authenticated successfully:", user.username);

      req.login(user, (err) => {
        if (err) {
          console.error("Login session error:", err);
          return next(err);
        }

        // Save the session explicitly to ensure cookie is set
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return next(err);
          }

          // Remove password from response
          const { password: _, ...userWithoutPassword } = user;
          console.log("Login successful. Session ID:", req.sessionID);
          console.log("Session after login:", req.session);

          res.json(userWithoutPassword);
        });
      });
    })(req, res, next);
  });

  // Current user route
  app.get("/api/auth/me", (req, res) => {
    console.log("GET /api/auth/me - isAuthenticated:", req.isAuthenticated());
    console.log("Session:", req.session);
    console.log("User:", req.user);

    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).json({ error: "Failed to destroy session" });
        }
        res.json({ message: "Logged out successfully" });
      });
    });
  });
}

// Middleware to protect routes
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
