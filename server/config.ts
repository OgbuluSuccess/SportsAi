import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Validate required environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'MONGODB_URI', 'SESSION_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} environment variable is required`);
  }
}

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
} as const;