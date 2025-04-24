import { User, Session, ContentItem } from '@shared/models';
import type { SessionData } from 'express-session';
import { Store } from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

class Storage {
  private mongoConnection: Promise<typeof mongoose> | null = null;

  private async ensureConnection() {
    if (!this.mongoConnection) {
      this.mongoConnection = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sports_ai', {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 75000,
        connectTimeoutMS: 30000,
        maxPoolSize: 50,
        minPoolSize: 10,
        retryWrites: true
        // Remove these two lines:
        // keepAlive: true,
        // keepAliveInitialDelay: 300000
      });
    }
    return this.mongoConnection;
  }

  async createUser(user: any) {
    await this.ensureConnection();
    const newUser = new User(user);
    return await newUser.save();
  }

  async getUser(id: string) {
    await this.ensureConnection();
    return await User.findById(id);
  }

  async getUserByUsername(username: string) {
    await this.ensureConnection();
    return await User.findOne({ username });
  }

  async createContent(content: any) {
    await this.ensureConnection();
    const newContent = new ContentItem(content);
    return await newContent.save();
  }

  async getContent(id: string) {
    await this.ensureConnection();
    return await ContentItem.findById(id);
  }

  async getAllContent(userId: string) {
    await this.ensureConnection();
    return await ContentItem.find({ userId });
  }

  get sessionStore() {
    this.ensureConnection();
    return MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/sports_ai',
      ttl: 86400,
      autoRemove: 'native',
      touchAfter: 24 * 3600
    });
  }
}

export const storage = new Storage();