import { extractTextFromFile } from '../services/parserService.js';
import { analyzeResumeAI } from '../services/aiService.js';
import { saveAnalysis } from '../services/storageService.js';
import { validateResumeText, generateResumeFromPrompt } from '../services/nlpFallbackEngine.js';

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No resume file uploaded.' });
    }

    const { originalname, mimetype, buffer, size } = req.file;
    const text = await extractTextFromFile(buffer, mimetype, originalname);

    if (!text || text.length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Could not extract readable text from the file. Please ensure the document is not an empty or image-only scan.'
      });
    }

    // Validate that the uploaded text is a genuine resume
    const validation = validateResumeText(text);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error || 'Please upload a valid Resume or CV containing standard sections (Skills, Experience, Education, Contact).'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Resume parsed and validated successfully',
      data: {
        fileName: originalname,
        fileSize: size,
        text
      }
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process resume upload'
    });
  }
};

export const analyzeResume = async (req, res) => {
  try {
    const { text, fileName = 'Resume.pdf', fileSize = 0 } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Resume text is required for analysis.'
      });
    }

    // Validate resume content before analysis
    const validation = validateResumeText(text);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error || 'Please upload a valid Resume or CV with required sections.'
      });
    }

    const analysisResult = await analyzeResumeAI(text, fileName, fileSize);
    const saved = await saveAnalysis(analysisResult);

    return res.status(200).json({
      success: true,
      data: saved
    });
  } catch (error) {
    console.error('Analysis Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze resume'
    });
  }
};

export const generateResume = async (req, res) => {
  try {
    const generatedData = generateResumeFromPrompt(req.body || {});
    const saved = await saveAnalysis(generatedData);

    return res.status(200).json({
      success: true,
      message: 'Resume generated successfully',
      data: saved
    });
  } catch (error) {
    console.error('Resume Generation Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate resume from prompt'
    });
  }
};

export const improveText = async (req, res) => {
  try {
    const { originalText, category = 'General' } = req.body;
    if (!originalText) {
      return res.status(400).json({ success: false, error: 'Original text is required.' });
    }

    const verbs = ['Spearheaded', 'Engineered', 'Architected', 'Streamlined', 'Optimized', 'Accelerated'];
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    const improved = `${randomVerb} the development and enhancement of core workflows, driving a 25% increase in operational efficiency and improving overall system maintainability.`;

    return res.status(200).json({
      success: true,
      data: {
        original: originalText,
        suggestion: improved,
        impact: '+20% Impact Score'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
