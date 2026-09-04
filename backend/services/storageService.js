import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { getIsMongoConnected } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Vercel / serverless, write to os.tmpdir(), otherwise write to ../data
const isServerless = Boolean(process.env.VERCEL);
const DATA_DIR = isServerless ? os.tmpdir() : path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'history.json');

// In-memory cache for fast access and fallback
let inMemoryHistory = [];

// Initialize local storage safely
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  } else {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    inMemoryHistory = JSON.parse(raw || '[]');
  }
} catch (e) {
  // Silent catch in read-only serverless filesystems
}

const readLocalHistory = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      inMemoryHistory = JSON.parse(raw || '[]');
    }
  } catch (e) {
    // fallback to inMemoryHistory
  }
  return inMemoryHistory || [];
};

const writeLocalHistory = (data) => {
  inMemoryHistory = data;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    // In-memory history is already updated
  }
};

export const saveAnalysis = async (analysisData) => {
  if (getIsMongoConnected()) {
    try {
      const doc = await ResumeAnalysis.findOneAndUpdate(
        { id: analysisData.id },
        analysisData,
        { upsert: true, new: true }
      );
      if (doc) return doc.toObject();
    } catch (err) {
      console.warn('MongoDB save failed, falling back to local store:', err.message);
    }
  }

  // Fallback to local / in-memory store
  const history = readLocalHistory();
  const existingIdx = history.findIndex((h) => h.id === analysisData.id);
  const record = { ...analysisData, createdAt: analysisData.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
  if (existingIdx >= 0) {
    history[existingIdx] = record;
  } else {
    history.unshift(record);
  }
  writeLocalHistory(history);
  return record;
};

export const getAnalysisById = async (id) => {
  if (getIsMongoConnected()) {
    try {
      const doc = await ResumeAnalysis.findOne({ id });
      if (doc) return doc.toObject();
    } catch (err) {
      console.warn('MongoDB fetch failed, trying local store:', err.message);
    }
  }

  const history = readLocalHistory();
  return history.find((item) => item.id === id) || null;
};

export const getAllAnalyses = async () => {
  if (getIsMongoConnected()) {
    try {
      const docs = await ResumeAnalysis.find().sort({ createdAt: -1 });
      if (docs && docs.length > 0) {
        return docs.map((d) => d.toObject());
      }
    } catch (err) {
      console.warn('MongoDB list failed, trying local store:', err.message);
    }
  }

  return readLocalHistory();
};

export const deleteAnalysisById = async (id) => {
  if (getIsMongoConnected()) {
    try {
      await ResumeAnalysis.findOneAndDelete({ id });
    } catch (err) {
      console.warn('MongoDB delete failed, continuing with local store:', err.message);
    }
  }

  const history = readLocalHistory();
  const updated = history.filter((item) => item.id !== id);
  writeLocalHistory(updated);
  return true;
};
