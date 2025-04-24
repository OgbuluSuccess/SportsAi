import mongoose from 'mongoose';
import 'dotenv/config';

// Get the MongoDB connection string from environment variable
const mongoUri = process.env.MONGODB_URI;

// Check if connection string is available
if (!mongoUri) {
  throw new Error('MONGODB_URI environment variable is required');
}

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export const db = mongoose.connection;
