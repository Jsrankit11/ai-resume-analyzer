import {
  extractPersonalInfo,
  extractSkills,
  extractSections,
  analyzeContent,
  matchJobDescription as fallbackMatch,
  generateInterviewQuestions as fallbackQuestions,
  generateChatResponse as fallbackChat
} from './nlpFallbackEngine.js';

/**
 * Main AI Analysis Service for Resume Text
 */
export const analyzeResumeAI = async (resumeText, originalFileName = 'Resume.pdf', fileSize = 0) => {
  // First run NLP extraction as base
  const candidate = extractPersonalInfo(resumeText);
  const skills = extractSkills(resumeText);
  const sections = extractSections(resumeText);
  const analysis = analyzeContent(resumeText, {
    candidate,
    skills,
    experience: sections.experience,
    projects: sections.projects,
    education: sections.education
  });

  // If Gemini or OpenAI API Key exists, we can enhance with LLM; otherwise use NLP engine
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      const llmResult = await callGeminiAPI(geminiKey, resumeText);
      if (llmResult && llmResult.candidate) {
        return mergeResults(llmResult, originalFileName, fileSize, resumeText);
      }
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent NLP fallback:', err.message);
    }
  } else if (openaiKey) {
    try {
      const llmResult = await callOpenAIAPI(openaiKey, resumeText);
      if (llmResult && llmResult.candidate) {
        return mergeResults(llmResult, originalFileName, fileSize, resumeText);
      }
    } catch (err) {
      console.warn('OpenAI API call failed, using intelligent NLP fallback:', err.message);
    }
  }

  // Return full NLP structured output
  return {
    id: 'res_' + Math.random().toString(36).substring(2, 10),
    originalFileName,
    fileSize,
    rawText: resumeText,
    candidate,
    summary: sections.summary,
    education: sections.education,
    experience: sections.experience,
    skills,
    projects: sections.projects,
    certifications: sections.certifications,
    scores: analysis.scores,
    atsBreakdown: analysis.atsBreakdown,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    recommendations: analysis.recommendations,
    improvementSuggestions: analysis.improvementSuggestions,
    missingSkills: analysis.missingSkills,
    careerRecommendations: analysis.careerRecommendations,
    createdAt: new Date().toISOString()
  };
};

/**
 * Job Description Matcher
 */
export const matchJobDescriptionAI = async (resumeData, jobDescription) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const prompt = `Compare this candidate resume with the target job description. Output pure JSON with:
      {
        "matchScore": number (0-100),
        "matchingSkills": [string],
        "missingSkills": [string],
        "recommendedKeywords": [string],
        "recommendation": string
      }
      Candidate Skills: ${JSON.stringify(resumeData.skills?.technical || [])}
      Resume Summary: ${resumeData.summary || ''}
      Job Description: ${jobDescription}`;

      const res = await callGeminiRaw(geminiKey, prompt);
      const parsed = parseJsonSafe(res);
      if (parsed && parsed.matchScore !== undefined) {
        return parsed;
      }
    } catch (e) {
      console.warn('Gemini Job Match fallback triggered:', e.message);
    }
  }

  return fallbackMatch(resumeData, jobDescription);
};

/**
 * Interview Questions Generator
 */
export const generateInterviewQuestionsAI = async (resumeData, role = 'Software Developer') => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const prompt = `Generate interview questions categorized into Technical, Project, HR, and Skill for a candidate with skills: ${JSON.stringify(resumeData.skills?.technical || [])} and target role ${role}.
      Format as JSON with:
      {
        "role": "${role}",
        "categories": [
          {
            "name": string,
            "questions": [
              {
                "id": string,
                "question": string,
                "difficulty": "Easy" | "Medium" | "Hard",
                "category": string,
                "keyPoints": [string],
                "suggestedAnswer": string
              }
            ]
          }
        ]
      }`;
      const res = await callGeminiRaw(geminiKey, prompt);
      const parsed = parseJsonSafe(res);
      if (parsed && parsed.categories) {
        return parsed;
      }
    } catch (e) {
      console.warn('Gemini Interview Gen fallback triggered:', e.message);
    }
  }

  return fallbackQuestions(resumeData, role);
};

/**
 * Chat Coach AI
 */
export const chatWithCoachAI = async (message, history = [], resumeContext = null) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const systemPrompt = `You are "Resume Coach", an expert AI career advisor and ATS resume consultant. Give concise, encouraging, actionable advice with bullet points where appropriate. Candidate Skills: ${JSON.stringify(resumeContext?.skills?.technical || [])}.`;
      const prompt = `${systemPrompt}\nUser Query: ${message}`;
      const reply = await callGeminiRaw(geminiKey, prompt);
      return {
        reply: reply || 'I am here to help you refine your resume and prepare for interviews!',
        suggestions: ['How to improve ATS score?', 'Top skills to learn in 2026', 'Job role recommendation']
      };
    } catch (e) {
      console.warn('Gemini Chat fallback triggered:', e.message);
    }
  }

  return fallbackChat(message, resumeContext);
};

/**
 * Helper to call Gemini REST API without extra heavy dependencies
 */
async function callGeminiRaw(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API responded with status ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callGeminiAPI(apiKey, text) {
  const prompt = `Analyze this resume and output structured JSON only, strictly matching this schema:
  {
    "candidate": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "portfolio": "" },
    "summary": "",
    "education": [{ "degree": "", "college": "", "year": "", "score": "" }],
    "experience": [{ "company": "", "role": "", "duration": "", "responsibilities": [], "achievements": [] }],
    "skills": { "technical": [], "soft": [], "categories": { "programming": [], "frontend": [], "backend": [], "database": [], "cloud": [], "tools": [] } },
    "projects": [{ "title": "", "description": "", "techStack": [], "link": "" }],
    "certifications": [],
    "scores": { "overall": 80, "ats": 85, "skills": 80, "experience": 75, "education": 85, "formatting": 90, "keywords": 80, "projects": 80 },
    "atsBreakdown": { "score": 85, "passed": [], "issues": [] },
    "strengths": [],
    "weaknesses": [],
    "recommendations": [],
    "improvementSuggestions": [{ "id": "imp-1", "category": "", "original": "", "suggestion": "", "impact": "" }],
    "missingSkills": [],
    "careerRecommendations": [{ "role": "", "matchPercentage": 90, "requiredSkills": [], "missingSkills": [], "learningTopics": [] }]
  }
  Resume Text:
  ${text}`;

  const raw = await callGeminiRaw(apiKey, prompt);
  return parseJsonSafe(raw);
}

async function callOpenAIAPI(apiKey, text) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI Resume Parser. Return valid JSON only.'
        },
        {
          role: 'user',
          content: `Parse and analyze this resume into JSON:\n${text}`
        }
      ],
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '{}';
  return parseJsonSafe(raw);
}

function parseJsonSafe(text) {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

function mergeResults(llmResult, originalFileName, fileSize, rawText) {
  return {
    id: 'res_' + Math.random().toString(36).substring(2, 10),
    originalFileName,
    fileSize,
    rawText,
    ...llmResult,
    createdAt: new Date().toISOString()
  };
}
