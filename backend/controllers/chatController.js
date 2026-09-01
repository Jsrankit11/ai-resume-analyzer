import { chatWithCoachAI } from '../services/aiService.js';
import { getAnalysisById } from '../services/storageService.js';

export const handleChat = async (req, res) => {
  try {
    const { message, history = [], resumeId, resumeData } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    let resumeContext = resumeData;
    if (!resumeContext && resumeId) {
      resumeContext = await getAnalysisById(resumeId);
    }

    const response = await chatWithCoachAI(message, history, resumeContext);

    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Chat Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process chat message'
    });
  }
};
