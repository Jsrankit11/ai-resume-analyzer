import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isMongoConnected = false;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    isMongoConnected = true;
    return;
  }
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_resume_analyzer';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log('✅ MongoDB Connected successfully:', uri.includes('@') ? uri.split('@')[1] : uri);
  } catch (err) {
    isMongoConnected = false;
    console.warn('⚠️ MongoDB connection failed (running in offline/fallback mode).');
    console.log('💡 Using built-in persistent storage fallback.');
  }
};

export const getIsMongoConnected = () => isMongoConnected || mongoose.connection.readyState >= 1;
