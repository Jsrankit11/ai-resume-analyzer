import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  BrainCircuit, 
  Code, 
  FolderGit2, 
  Users,
  Layers
} from 'lucide-react';
import { getInterviewQuestions } from '../services/api';
import { useResume } from '../context/ResumeContext';
import LoadingSkeleton from '../components/LoadingSkeleton';

const TARGET_ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer',
  'Data Scientist'
];

export default function Interview() {
  const { currentAnalysis } = useResume();
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [activeTab, setActiveTab] = useState('all');
  const [questionsData, setQuestionsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const fetchQuestions = async (role = selectedRole) => {
    try {
      setLoading(true);
      const res = await getInterviewQuestions({
        role,
        resumeData: currentAnalysis,
        resumeId: currentAnalysis?.id,
      });
      setQuestionsData(res);
      const firstId = res.categories?.[0]?.questions?.[0]?.id;
      if (firstId) {
        setExpandedQuestions({ [firstId]: true });
      }
    } catch (e) {
      console.error('Failed to load interview questions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(selectedRole);
  }, [selectedRole]);

  const toggleExpand = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyAnswer = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const allQuestions = questionsData?.categories?.flatMap((cat) =>
    cat.questions.map((q) => ({ ...q, categoryName: cat.name }))
  ) || [];

  const filteredQuestions = activeTab === 'all'
    ? allQuestions
    : allQuestions.filter((q) => {
        const cat = q.categoryName.toLowerCase();
        return cat.includes(activeTab);
      });

  const getDifficultyBadge = (difficulty) => {
    const diff = (difficulty || '').toLowerCase();
    if (diff === 'easy') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (diff === 'medium') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>JSR AI Interview & Viva Prep</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">
          AI Interview Question Generator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
          Practice technical, architectural, behavioral, and scenario questions generated dynamically from your extracted skills.
        </p>
      </div>

      {/* Role Selector & Tab Filters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div>
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block font-heading mb-2">
            Target Interview Role:
          </label>
          <div className="flex flex-wrap gap-2">
            {TARGET_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === role
                    ? 'bg-[#ff5656] text-white shadow-md shadow-[#ff5656]/25'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Filters */}
        <div className="pt-3 border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Questions', icon: Layers },
            { id: 'technical', label: 'Technical', icon: Code },
            { id: 'project', label: 'Projects', icon: FolderGit2 },
            { id: 'hr', label: 'HR & Behavioral', icon: Users },
            { id: 'skill', label: 'Scenario', icon: BrainCircuit },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-coral-50 text-[#ff5656] border border-coral-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <LoadingSkeleton type="card" />
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const isExpanded = !!expandedQuestions[q.id || idx];
            return (
              <div
                key={q.id || idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm transition-all hover:border-slate-300"
              >
                <div
                  onClick={() => toggleExpand(q.id || idx)}
                  className="cursor-pointer space-y-2.5 select-none"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                        {q.categoryName || 'Technical'}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-0.5 rounded-full border ${getDifficultyBadge(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty || 'Medium'}
                      </span>
                    </div>

                    <button
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                      aria-label="Toggle Answer"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#ff5656]" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-snug">
                    {q.question}
                  </h3>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                    {q.keyPoints && q.keyPoints.length > 0 && (
                      <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100 space-y-2">
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block font-heading">
                          Key Talking Points:
                        </span>
                        <ul className="space-y-1.5">
                          {q.keyPoints.map((pt, pidx) => (
                            <li key={pidx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                              <span className="text-[#ff5656] font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-coral-50/40 rounded-2xl p-5 border border-coral-200 space-y-2">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-[#ff5656] uppercase tracking-wider flex items-center gap-1.5 font-heading">
                          <Check className="w-3.5 h-3.5" />
                          Suggested Model Answer:
                        </span>
                        <button
                          onClick={() => handleCopyAnswer(q.id || idx, q.suggestedAnswer)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
                        >
                          {copiedId === (q.id || idx) ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Answer</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans font-medium">
                        {q.suggestedAnswer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
