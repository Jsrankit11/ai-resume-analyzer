import mongoose from 'mongoose';

let isMongoConnected = false;
let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    isMongoConnected = true;
    return true;
  }

  const uri = process.env.MONGODB_URI;

  // On Vercel / serverless: if no remote MONGODB_URI is provided, skip immediately
  if (process.env.VERCEL && (!uri || uri.includes('localhost') || uri.includes('127.0.0.1'))) {
    isMongoConnected = false;
    return false;
  }

  // If already connecting, reuse promise
  if (connectionPromise) {
    return connectionPromise;
  }

  const targetUri = uri || 'mongodb://localhost:27017/ai_resume_analyzer';

  connectionPromise = (async () => {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(targetUri, {
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 2500,
      });
      isMongoConnected = true;
      console.log('✅ MongoDB Connected successfully:', targetUri.includes('@') ? targetUri.split('@')[1] : targetUri);
      return true;
    } catch (err) {
      isMongoConnected = false;
      console.warn('⚠️ MongoDB not connected (running in instant fallback mode).');
      return false;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

export const getIsMongoConnected = () => isMongoConnected || mongoose.connection.readyState >= 1;
