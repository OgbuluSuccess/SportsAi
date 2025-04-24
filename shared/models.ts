import mongoose from 'mongoose';
import { z } from 'zod';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { 
    type: String, 
    enum: ['free', 'pro', 'enterprise'], 
    default: 'free',
    required: true 
  },
  createdAt: { type: Date, default: Date.now, required: true }
});

// Session Schema
const sessionSchema = new mongoose.Schema({
  sid: { type: String, required: true },
  sess: { type: Object, required: true },
  expire: { type: Date, required: true }
});

// Content Item Schema
const contentItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  type: { type: String, enum: ['article', 'script'], required: true },
  prompt: { type: String, required: true },
  content: { type: String, required: true },
  metadata: {
    wordCount: Number,
    suggestedTags: [String],
    created: String
  }
});

// Zod Schemas for Validation
export const registerUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export const generateContentSchema = z.object({
  topic: z.string().min(1),
  type: z.enum(['article', 'script']),
  sportType: z.string().min(1),
  tone: z.string().optional(),
  length: z.number().min(100).max(2000)
});

// Mongoose Models
export const User = mongoose.model('User', userSchema);
export const Session = mongoose.model('Session', sessionSchema);
export const ContentItem = mongoose.model('ContentItem', contentItemSchema);

// Types
export type UserDocument = mongoose.Document & {
  username: string;
  email: string;
  password: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
};

export type ContentDocument = mongoose.Document & {
  userId: mongoose.Types.ObjectId;
  topic: string;
  type: 'article' | 'script';
  prompt: string;
  content: string;
  metadata: {
    wordCount?: number;
    suggestedTags?: string[];
    created?: string;
  };
};

// Pricing Plans Configuration
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '5 articles/month',
      'Basic topic suggestions',
      'Standard response time'
    ],
    limits: {
      monthlyArticles: 5,
      maxLength: 1000
    }
  },
  pro: {
    name: 'Pro',
    price: 29,
    features: [
      '50 articles/month',
      'Advanced topic suggestions',
      'Priority response time',
      'Extended article length'
    ],
    limits: {
      monthlyArticles: 50,
      maxLength: 2000
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    features: [
      'Unlimited articles',
      'Custom topic suggestions',
      'Instant response time',
      'Maximum article length',
      'Dedicated support'
    ],
    limits: {
      monthlyArticles: Infinity,
      maxLength: 5000
    }
  }
} as const;