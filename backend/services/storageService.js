import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { getIsMongoConnected } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'history.json');

// Ensure data folder and file exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
}

const readLocalHistory = () => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
};

const writeLocalHistory = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing local history:', e);
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
      return doc.toObject();
    } catch (err) {
      console.warn('MongoDB save failed, falling back to local file store:', err.message);
    }
  }

  // Fallback to local file store
  const history = readLocalHistory();
  const existingIdx = history.findIndex((h) => h.id === analysisData.id);
  const record = { ...analysisData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
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
      return docs.map((d) => d.toObject());
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
