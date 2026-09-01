import express from 'express';
import multer from 'multer';
import { uploadResume, analyzeResume, improveText, generateResume } from '../controllers/resumeController.js';
import { matchJob } from '../controllers/jobMatchController.js';
import { getInterviewQuestions } from '../controllers/interviewController.js';
import { handleChat } from '../controllers/chatController.js';
import { getAnalysis, getHistory, deleteAnalysis } from '../controllers/analysisController.js';

const router = express.Router();

// Multer in-memory storage configuration with file validation
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (allowedTypes.includes(file.mimetype) || ['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX documents are supported.'));
    }
  }
});

// Resume Endpoints
router.post('/resume/upload', upload.single('resume'), uploadResume);
router.post('/resume/analyze', analyzeResume);
router.post('/resume/generate', generateResume);
router.post('/resume/improve-text', improveText);

// Job Match Endpoint
router.post('/job-match', matchJob);

// Interview Prep Endpoint
router.post('/interview', getInterviewQuestions);

// Chatbot Endpoint
router.post('/chat', handleChat);

// Analysis & History Endpoints
router.get('/analysis/history', getHistory);
router.get('/analysis/:id', getAnalysis);
router.delete('/analysis/:id', deleteAnalysis);

export default router;
