import { matchJobDescriptionAI } from '../services/aiService.js';
import { getAnalysisById } from '../services/storageService.js';

export const matchJob = async (req, res) => {
  try {
    const { resumeId, resumeData, jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a job description to compare against.'
      });
    }

    let candidateData = resumeData;
    if (!candidateData && resumeId) {
      candidateData = await getAnalysisById(resumeId);
    }

    if (!candidateData) {
      return res.status(400).json({
        success: false,
        error: 'Resume data not found. Please upload or analyze a resume first.'
      });
    }

    const matchResult = await matchJobDescriptionAI(candidateData, jobDescription);

    return res.status(200).json({
      success: true,
      data: matchResult
    });
  } catch (error) {
    console.error('Job Match Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to match resume with job description.'
    });
  }
};
