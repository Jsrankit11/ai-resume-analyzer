import { generateInterviewQuestionsAI } from '../services/aiService.js';
import { getAnalysisById } from '../services/storageService.js';

export const getInterviewQuestions = async (req, res) => {
  try {
    const { resumeId, resumeData, role = 'Software Developer' } = req.body;

    let candidateData = resumeData;
    if (!candidateData && resumeId) {
      candidateData = await getAnalysisById(resumeId);
    }

    if (!candidateData) {
      candidateData = {
        skills: { technical: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Git'] },
        projects: [{ title: 'Full Stack Web Platform' }]
      };
    }

    const questionsData = await generateInterviewQuestionsAI(candidateData, role);

    return res.status(200).json({
      success: true,
      data: questionsData
    });
  } catch (error) {
    console.error('Interview Question Gen Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate interview questions'
    });
  }
};
