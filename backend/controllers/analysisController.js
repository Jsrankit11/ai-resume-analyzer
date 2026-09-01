import { getAnalysisById, getAllAnalyses, deleteAnalysisById } from '../services/storageService.js';

export const getAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await getAnalysisById(id);

    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Resume analysis not found.' });
    }

    return res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    console.error('Get Analysis Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await getAllAnalyses();
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('Get History Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteAnalysisById(id);
    return res.status(200).json({ success: true, message: 'Analysis deleted successfully.' });
  } catch (error) {
    console.error('Delete Analysis Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
