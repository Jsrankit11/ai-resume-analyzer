import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    originalFileName: { type: String, default: 'Resume.pdf' },
    fileSize: { type: Number, default: 0 },
    rawText: { type: String, default: '' },
    candidate: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    summary: { type: String, default: '' },
    education: [
      {
        degree: String,
        college: String,
        year: String,
        score: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        responsibilities: [String],
        achievements: [String],
      },
    ],
    skills: {
      technical: [String],
      soft: [String],
      categories: {
        programming: [String],
        frontend: [String],
        backend: [String],
        database: [String],
        cloud: [String],
        tools: [String],
      },
    },
    projects: [
      {
        title: String,
        description: String,
        techStack: [String],
        link: String,
      },
    ],
    certifications: [String],
    scores: {
      overall: { type: Number, default: 0 },
      ats: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 },
      keywords: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
    },
    atsBreakdown: {
      score: { type: Number, default: 0 },
      passed: [String],
      issues: [String],
    },
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    improvementSuggestions: [
      {
        id: String,
        original: String,
        suggestion: String,
        category: String,
        impact: String,
      },
    ],
    missingSkills: [String],
    careerRecommendations: [
      {
        role: String,
        matchPercentage: Number,
        requiredSkills: [String],
        missingSkills: [String],
        learningTopics: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis = mongoose.models.ResumeAnalysis || mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

export default ResumeAnalysis;
