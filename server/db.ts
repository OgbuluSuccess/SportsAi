import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";

// Get the connection string from environment variable or use a default
const connectionString = process.env.DATABASE_URL;

// Check if connection string is available
if (!connectionString) {
  console.error("No DATABASE_URL found in environment");
  console.error("Using default PostgreSQL connection string");
}

// Create client with explicit connection string
const client = postgres(
  connectionString ||
    "postgresql://postgres:1234567@localhost:5432/sports_ai_db"
);
export const db = drizzle(client);
