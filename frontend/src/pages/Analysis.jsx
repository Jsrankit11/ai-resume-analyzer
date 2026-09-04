import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  FileEdit, 
  KeyRound, 
  FolderGit2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Target, 
  HelpCircle, 
  ArrowLeft,
  AlertTriangle,
  TrendingUp,
  ExternalLink as LinkIcon,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { getAnalysisById } from '../services/api';
import { useResume } from '../context/ResumeContext';
import ScoreGauge from '../components/ScoreGauge';
import ScoreCard from '../components/ScoreCard';
import SkillBadge from '../components/SkillBadge';
import ATSBreakdown from '../components/ATSBreakdown';
import ImprovementCard from '../components/ImprovementCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function Analysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentAnalysis, setCurrentAnalysis, loadSample } = useResume();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. If currentAnalysis in context matches this ID, use it immediately
        if (currentAnalysis && (currentAnalysis.id === id || !id || id === 'latest')) {
          setData(currentAnalysis);
          setLoading(false);
          return;
        }

        // 2. Check localStorage for cached analysis
        try {
          const cached = localStorage.getItem('ai_current_analysis');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && (parsed.id === id || !id || id === 'latest')) {
              setData(parsed);
              setCurrentAnalysis(parsed);
              setLoading(false);
              return;
            }
          }
        } catch (e) {}

        // 3. Try fetching from backend API
        if (id && id !== 'latest') {
          try {
            const res = await getAnalysisById(id);
            if (res) {
              setData(res);
              setCurrentAnalysis(res);
              setLoading(false);
              return;
            }
          } catch (fetchErr) {
            console.warn('API fetch failed, using fallback:', fetchErr);
          }
        }

        // 4. Fallback to currentAnalysis if available
        if (currentAnalysis) {
          setData(currentAnalysis);
          setLoading(false);
          return;
        }

        // 5. Fallback to sample resume
        const sample = await loadSample('sample-fullstack');
        setData(sample);
      } catch (err) {
        console.error('Failed to load analysis:', err);
        setError('Could not retrieve analysis. Please upload or choose a sample resume.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [id]);

  useEffect(() => {
    if (data?.scores?.overall >= 80) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#ff5656', '#10b981', '#f59e0b'],
        });
      } catch (e) {}
    }
  }, [data]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-200">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-heading">No Analysis Found</h2>
        <p className="text-xs text-slate-500">{error || 'Please upload a resume to view analysis.'}</p>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#ff5656] text-white hover:bg-[#ff4242]"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Upload
        </Link>
      </div>
    );
  }

  const { candidate, scores, atsBreakdown, skills, improvementSuggestions, careerRecommendations, experience, education, projects, summary } = data;

  const skillChartData = [
    { name: 'Programming', count: skills?.categories?.programming?.length || 0, color: '#3b82f6' },
    { name: 'Frontend', count: skills?.categories?.frontend?.length || 0, color: '#06b6d4' },
    { name: 'Backend', count: skills?.categories?.backend?.length || 0, color: '#10b981' },
    { name: 'Database', count: skills?.categories?.database?.length || 0, color: '#f59e0b' },
    { name: 'Cloud/DevOps', count: skills?.categories?.cloud?.length || 0, color: '#a855f7' },
    { name: 'Soft Skills', count: skills?.soft?.length || 0, color: '#ec4899' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading flex items-center gap-2">
              <span>{candidate?.name || 'Resume Analysis Report'}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-coral-50 text-[#ff5656] border border-coral-200">
                JSR Verified
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              File: <span className="text-slate-800 font-medium">{data.originalFileName || 'Resume.pdf'}</span> • Analyzed on {new Date(data.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/templates"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-coral-50 border border-coral-200 text-[#ff5656] hover:bg-coral-100 shadow-sm transition-colors"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            Download in 5+ Templates (PDF)
          </Link>
          <Link
            to="/job-match"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Target className="w-3.5 h-3.5 text-[#ff5656]" />
            Job Match
          </Link>
          <Link
            to="/interview"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#ff5656] text-white hover:bg-[#ff4242] transition-colors shadow-md shadow-[#ff5656]/20"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Interview Prep
          </Link>
        </div>
      </div>

      {/* Candidate Contact Overview */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {candidate?.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#ff5656]" />
              <span className="font-medium text-slate-800">{candidate.email}</span>
            </div>
          )}
          {candidate?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-slate-800">{candidate.phone}</span>
            </div>
          )}
          {candidate?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span className="font-medium text-slate-800">{candidate.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {candidate?.linkedin && (
            <a
              href={candidate.linkedin.startsWith('http') ? candidate.linkedin : `https://${candidate.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900"
            >
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>LinkedIn</span>
            </a>
          )}
          {candidate?.github && (
            <a
              href={candidate.github.startsWith('http') ? candidate.github : `https://${candidate.github}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900"
            >
              <LinkIcon className="w-3.5 h-3.5 text-slate-600" />
              <span>GitHub</span>
            </a>
          )}
          {candidate?.portfolio && (
            <a
              href={candidate.portfolio.startsWith('http') ? candidate.portfolio : `https://${candidate.portfolio}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900"
            >
              <Globe className="w-3.5 h-3.5 text-[#ff5656]" />
              <span>Portfolio</span>
            </a>
          )}
        </div>
      </div>

      {/* Hero Score Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Score Gauge Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center border border-slate-200 shadow-sm relative overflow-hidden">
          <ScoreGauge score={scores?.overall || 82} size={190} strokeWidth={16} label="Overall Resume Score" />
          <p className="text-xs text-slate-500 mt-4 max-w-xs leading-relaxed">
            Evaluated across ATS compatibility, technical breadth, and quantifiable achievements.
          </p>
        </div>

        {/* 7-Score Categories Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ScoreCard
            title="ATS Score"
            score={scores?.ats || 85}
            icon={ShieldCheck}
            description="Heading & keyword audit"
          />
          <ScoreCard
            title="Skills Score"
            score={scores?.skills || 88}
            icon={Code2}
            description="Tech stack richness"
          />
          <ScoreCard
            title="Experience"
            score={scores?.experience || 80}
            icon={Briefcase}
            description="Action verbs & roles"
          />
          <ScoreCard
            title="Education"
            score={scores?.education || 90}
            icon={GraduationCap}
            description="Degrees & GPA tracking"
          />
          <ScoreCard
            title="Formatting"
            score={scores?.formatting || 85}
            icon={FileEdit}
            description="Structure & margins"
          />
          <ScoreCard
            title="Keywords"
            score={scores?.keywords || 82}
            icon={KeyRound}
            description="Recruiter search density"
          />
        </div>
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <h3 className="text-xs font-bold text-[#ff5656] uppercase tracking-wider font-heading flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Parsed Professional Summary
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed font-sans">
            {summary}
          </p>
        </div>
      )}

      {/* ATS Breakdown Component */}
      <ATSBreakdown
        atsScore={scores?.ats || 85}
        passed={atsBreakdown?.passed || []}
        issues={atsBreakdown?.issues || []}
      />

      {/* AI Skill Analyzer Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#ff5656]" />
              AI Skill Analyzer & Taxonomies
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Extracted breakdown of technical stacks, frameworks, databases, and interpersonal skills.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
            {(skills?.technical?.length || 0) + (skills?.soft?.length || 0)} Total Skills
          </span>
        </div>

        {/* Skill Badges by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {skills?.categories?.programming?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2 font-heading">
                  Programming Languages
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.categories.programming.map((sk, idx) => (
                    <SkillBadge key={idx} skill={sk} category="programming" />
                  ))}
                </div>
              </div>
            )}

            {skills?.categories?.frontend?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-cyan-700 uppercase tracking-wider mb-2 font-heading">
                  Frontend Development
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.categories.frontend.map((sk, idx) => (
                    <SkillBadge key={idx} skill={sk} category="frontend" />
                  ))}
                </div>
              </div>
            )}

            {skills?.categories?.backend?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 font-heading">
                  Backend & APIs
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.categories.backend.map((sk, idx) => (
                    <SkillBadge key={idx} skill={sk} category="backend" />
                  ))}
                </div>
              </div>
            )}

            {skills?.categories?.database?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 font-heading">
                  Databases & Storage
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.categories.database.map((sk, idx) => (
                    <SkillBadge key={idx} skill={sk} category="database" />
                  ))}
                </div>
              </div>
            )}

            {skills?.categories?.cloud?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2 font-heading">
                  Cloud & DevOps
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.categories.cloud.map((sk, idx) => (
                    <SkillBadge key={idx} skill={sk} category="cloud" />
                  ))}
                </div>
              </div>
            )}

            {skills?.soft?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wider mb-2 font-heading">
                  Soft Skills & Collaboration
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map((sk, idx) => (
                    <SkillBadge key={idx} skill={sk} category="soft" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skill Distribution Chart */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-heading">
              Skill Distribution Chart
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillChartData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 0 }}>
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={85} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      color: '#0f172a',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {skillChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* AI Resume Improvement Section (Before / After) */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-[#ff5656]" />
            AI Resume Bullet Improvements (Before & After)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Transform passive responsibilities into high-impact STAR formatted accomplishments.
          </p>
        </div>

        <div className="space-y-4">
          {improvementSuggestions?.map((item, idx) => (
            <ImprovementCard key={item.id || idx} item={item} />
          ))}
        </div>
      </div>

      {/* Career & Role Recommendations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              AI Career & Role Recommendations
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Matched against current industry job profiles based on your extracted skillset.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careerRecommendations?.map((rec, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900 font-heading">{rec.role}</h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {rec.matchPercentage}% Match
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${rec.matchPercentage}%` }}
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-bold">Matched Skills: </span>
                    <span className="text-slate-800">{rec.requiredSkills?.join(', ')}</span>
                  </div>

                  {rec.missingSkills?.length > 0 && (
                    <div>
                      <span className="text-rose-600 font-bold">Missing Skills: </span>
                      <span className="text-rose-700">{rec.missingSkills.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {rec.learningTopics?.length > 0 && (
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-heading">
                    Recommended Learning Topics:
                  </span>
                  <ul className="space-y-1">
                    {rec.learningTopics.map((topic, tidx) => (
                      <li key={tidx} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="text-[#ff5656] mt-0.5">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Parsed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience Timeline */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#ff5656]" />
            Parsed Experience & Internships
          </h3>
          <div className="space-y-4">
            {experience?.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <h4 className="text-sm font-bold text-slate-900 font-heading">{exp.role}</h4>
                  <span className="text-[11px] text-[#ff5656] font-bold px-2 py-0.5 bg-coral-50 rounded">
                    {exp.duration}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold">{exp.company}</p>
                {exp.responsibilities?.map((r, ri) => (
                  <p key={ri} className="text-xs text-slate-700 leading-relaxed pl-2 border-l-2 border-slate-300">
                    {r}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Projects & Education */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-purple-600" />
              Parsed Projects
            </h3>
            <div className="space-y-3">
              {projects?.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 font-heading">{proj.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  {proj.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.techStack.map((t, ti) => (
                        <span key={ti} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              Education
            </h3>
            <div className="space-y-3">
              {education?.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 font-heading">{edu.degree}</h4>
                    <p className="text-slate-500">{edu.college}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 block">{edu.score}</span>
                    <span className="text-[11px] text-slate-400">{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
