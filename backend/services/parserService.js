import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extracts plain text from an uploaded buffer based on mimetype or file extension
 * @param {Buffer} buffer
 * @param {string} mimetype
 * @param {string} originalname
 * @returns {Promise<string>}
 */
export const extractTextFromFile = async (buffer, mimetype, originalname) => {
  const ext = originalname.split('.').pop()?.toLowerCase();

  try {
    if (mimetype === 'application/pdf' || ext === 'pdf') {
      const data = await pdfParse(buffer);
      const text = data.text || '';
      return cleanText(text);
    }

    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword' ||
      ext === 'docx' ||
      ext === 'doc'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value || '';
      return cleanText(text);
    }

    // Plain text fallback
    if (mimetype.includes('text') || ext === 'txt') {
      return cleanText(buffer.toString('utf-8'));
    }

    throw new Error(`Unsupported file type: ${mimetype} (${originalname}). Please upload a PDF or DOCX file.`);
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error(`Failed to extract text from ${originalname}: ${error.message}`);
  }
};

/**
 * Clean and normalize extracted resume text
 */
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u0000/g, '') // remove null characters
    .replace(/[ \t]+/g, ' ') // collapse multi-spaces
    .replace(/\n{3,}/g, '\n\n') // collapse multiple blank lines
    .trim();
}
