import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAnalysisHistory, analyzeResumeText } from '../services/api';
import { SAMPLE_RESUMES } from '../utils/sampleResumes';

const ResumeContext = createContext(null);

export const THEMES = [
  { id: 'light', name: 'Light (Kickresume)', icon: '☀️', color: '#ff5656', bg: '#fcfbfa', text: '#0f172a' },
  { id: 'dark', name: 'Dark Slate', icon: '🌙', color: '#ff5656', bg: '#0b0f19', text: '#f8fafc' },
  { id: 'midnight', name: 'Midnight Navy', icon: '🌌', color: '#38bdf8', bg: '#030712', text: '#f0f9ff' },
  { id: 'warm', name: 'Warm Sepia', icon: '☕', color: '#d97706', bg: '#faf6f0', text: '#292524' },
  { id: 'emerald', name: 'Emerald Pro', icon: '🌿', color: '#10b981', bg: '#f0fdf4', text: '#064e3b' },
];

export const ResumeProvider = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_current_analysis');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  // Theme Management
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('jsr_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('jsr_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark' || theme === 'midnight') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync current analysis to local storage
  useEffect(() => {
    if (currentAnalysis) {
      try {
        localStorage.setItem('ai_current_analysis', JSON.stringify(currentAnalysis));
      } catch (e) {
        console.error('Failed to save analysis to localStorage', e);
      }
    }
  }, [currentAnalysis]);

  const refreshHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await getAnalysisHistory();
      setHistory(data);
    } catch (err) {
      console.warn('Failed to load history:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const loadSample = async (sampleId = 'sample-fullstack') => {
    const sample = SAMPLE_RESUMES.find((s) => s.id === sampleId) || SAMPLE_RESUMES[0];
    try {
      const analysis = await analyzeResumeText(sample.text, sample.fileName, 24500);
      setCurrentAnalysis(analysis);
      refreshHistory();
      return analysis;
    } catch (err) {
      console.error('Failed to load sample analysis:', err);
      throw err;
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        currentAnalysis,
        setCurrentAnalysis,
        history,
        loadingHistory,
        refreshHistory,
        loadSample,
        globalError,
        setGlobalError,
        theme,
        setTheme,
        themes: THEMES,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
