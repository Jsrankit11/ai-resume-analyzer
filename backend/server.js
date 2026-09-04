import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'AI Resume Parser & Analyzer API',
    timestamp: new Date().toISOString(),
    aiEngine: process.env.GEMINI_API_KEY
      ? 'Google Gemini 1.5'
      : process.env.OPENAI_API_KEY
      ? 'OpenAI GPT-3.5'
      : 'Smart Rule-Based NLP Engine'
  });
});

// Initialize DB connection in background without blocking requests
connectDB().catch(() => {});

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: `File upload error: ${err.message}`
    });
  }
  return res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server when running locally
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
    console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
    connectDB();
  });
}

export default app;
