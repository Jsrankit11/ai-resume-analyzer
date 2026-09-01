import React, { useState } from 'react';
import { 
  Target, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  ArrowRight, 
  FileText, 
  AlertCircle
} from 'lucide-react';
import { matchJobDescription } from '../services/api';
import { useResume } from '../context/ResumeContext';
import ScoreGauge from '../components/ScoreGauge';
import SkillBadge from '../components/SkillBadge';

const SAMPLE_JDS = [
  {
    title: 'Frontend React Developer',
    text: `Job Title: Senior Frontend Developer
Location: Remote / Bangalore
Requirements:
- 2+ years experience with React.js, Next.js, and TypeScript.
- Strong proficiency in JavaScript ES6+, HTML5, CSS3, and Tailwind CSS.
- Experience with state management (Redux Toolkit, Zustand) and REST API integration.
- Familiarity with CI/CD, Git, GitHub Actions, Docker, and Jest testing.
- Excellent communication and Agile teamwork capabilities.`
  },
  {
    title: 'Full Stack MERN Developer',
    text: `Job Title: Full Stack Software Engineer (MERN)
Requirements:
- Solid background in React.js, Node.js, Express, and MongoDB.
- Experience designing RESTful APIs, JWT authentication, and GraphQL.
- Hands-on knowledge of Redis caching, Docker containers, and AWS Cloud (S3, EC2).
- Strong problem-solving, clean code principles, and PostgreSQL/SQL experience.`
  },
  {
    title: 'Data Scientist & ML Engineer',
    text: `Job Title: Data Scientist & AI Specialist
Requirements:
- Strong programming skills in Python, SQL, and R.
- Hands-on experience with Scikit-learn, TensorFlow, PyTorch, and NLP models.
- Experience with BigQuery, GCP Vertex AI, Pandas, NumPy, and Docker.
- Proven track record of statistical analysis, predictive modeling, and data pipelines.`
  }
];

export default function JobMatch() {
  const { currentAnalysis } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter or select a job description to compare.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await matchJobDescription({
        resumeData: currentAnalysis,
        resumeId: currentAnalysis?.id,
        jobDescription,
      });
      setResult(res);
    } catch (err) {
      console.error('Job match error:', err);
      setError(err.message || 'Failed to match job description.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-coral-50 text-[#ff5656] border border-coral-200">
          <Target className="w-3.5 h-3.5" />
          <span>Role Matching & Gap Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">
          Job Description Matcher
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
          Compare your parsed resume with any target job description to compute your match percentage, identify missing keywords, and get tailored application advice.
        </p>
      </div>

      {/* Active Resume Context Notice */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="p-2.5 rounded-xl bg-coral-50 text-[#ff5656] shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-slate-900 truncate font-heading">
              {currentAnalysis?.candidate?.name || 'Candidate Profile'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {currentAnalysis?.originalFileName || 'Sample Resume.pdf'} (
              {currentAnalysis?.skills?.technical?.length || 8} skills loaded)
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
          Active Profile
        </span>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        {/* Sample JD Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block font-heading">
            Try a Sample Job Posting:
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_JDS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setJobDescription(sample.text)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-coral-50 hover:text-[#ff5656] transition-colors border border-slate-200"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block font-heading">
            Paste Job Description / Requirements:
          </label>
          <textarea
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target job description, responsibilities, and required qualifications here..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff5656] transition-colors leading-relaxed"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Compare Button */}
        <button
          onClick={handleMatch}
          disabled={loading || !jobDescription.trim()}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-base font-bold bg-[#ff5656] hover:bg-[#ff4242] text-white shadow-xl shadow-[#ff5656]/25 hover:shadow-[#ff5656]/40 transition-all disabled:opacity-50"
        >
          {loading ? 'Evaluating Match & Skill Gaps...' : 'Compare Resume vs Job Description'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Top Score Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center border border-slate-200 shadow-sm">
            <div className="md:col-span-1 flex justify-center">
              <ScoreGauge
                score={result.matchScore || 85}
                size={170}
                strokeWidth={14}
                label="Role Match Score"
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  AI Fit Assessment & Guidance
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                {result.recommendation}
              </p>
            </div>
          </div>

          {/* Matching vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900 font-heading">
                    Matching Skills ({result.matchingSkills?.length || 0})
                  </h4>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Found in Resume
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {result.matchingSkills?.map((sk, idx) => (
                  <SkillBadge key={idx} skill={sk} isMatching={true} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <h4 className="text-sm font-bold text-slate-900 font-heading">
                    Missing Skills ({result.missingSkills?.length || 0})
                  </h4>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700">
                  Recommended to Add
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {result.missingSkills?.map((sk, idx) => (
                  <SkillBadge key={idx} skill={sk} isMissing={true} />
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Keywords */}
          {result.recommendedKeywords?.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
                <Target className="w-4 h-4 text-[#ff5656]" />
                Recommended ATS Keywords for this Role
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.recommendedKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-coral-50 text-[#ff5656] border border-coral-200"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
