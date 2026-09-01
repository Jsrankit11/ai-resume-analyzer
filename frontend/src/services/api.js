const API_BASE = '/api';

/**
 * Upload resume document (PDF / DOCX)
 */
export const uploadResumeFile = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(`${API_BASE}/resume/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload resume file.');
  }
  return data.data;
};

/**
 * Trigger AI Resume Analysis
 */
export const analyzeResumeText = async (text, fileName = 'Resume.pdf', fileSize = 0) => {
  const response = await fetch(`${API_BASE}/resume/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, fileName, fileSize }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to analyze resume.');
  }
  return data.data;
};

/**
 * AI Resume Generator from Prompt / Inputs
 */
export const generateResumeFromPrompt = async (payload) => {
  const response = await fetch(`${API_BASE}/resume/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate resume from prompt.');
  }
  return data.data;
};

/**
 * Fetch Analysis by ID
 */
export const getAnalysisById = async (id) => {
  const response = await fetch(`${API_BASE}/analysis/${id}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Analysis not found.');
  }
  return data.data;
};

/**
 * Fetch Analysis History
 */
export const getAnalysisHistory = async () => {
  const response = await fetch(`${API_BASE}/analysis/history`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch history.');
  }
  return data.data || [];
};

/**
 * Delete Analysis Record
 */
export const deleteAnalysisById = async (id) => {
  const response = await fetch(`${API_BASE}/analysis/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete analysis.');
  }
  return data;
};

/**
 * Job Description Matcher
 */
export const matchJobDescription = async (payload) => {
  const response = await fetch(`${API_BASE}/job-match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to match job description.');
  }
  return data.data;
};

/**
 * Interview Questions Generator
 */
export const getInterviewQuestions = async (payload) => {
  const response = await fetch(`${API_BASE}/interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate interview questions.');
  }
  return data.data;
};

/**
 * AI Assistant Chat
 */
export const sendChatMessage = async (payload) => {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Chat service unavailable.');
  }
  return data.data;
};

/**
 * Improve Bullet Point
 */
export const improveBulletText = async (originalText, category = 'General') => {
  const response = await fetch(`${API_BASE}/resume/improve-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalText, category }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to optimize bullet point.');
  }
  return data.data;
};
