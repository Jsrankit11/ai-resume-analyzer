import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  ArrowRight,
  TrendingUp,
  FileText,
  Target,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { useResume } from '../context/ResumeContext';

export default function Dashboard() {
  const { currentAnalysis } = useResume();

  if (!currentAnalysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-coral-50 text-[#ff5656] flex items-center justify-center">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">
          No Resume Analyzed Yet
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Upload your resume or load a sample resume to view your full analytics dashboard.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-[#ff5656] text-white hover:bg-[#ff4242] shadow-lg shadow-[#ff5656]/25 transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Resume
        </Link>
      </div>
    );
  }

  const { scores, candidate, skills, experience, projects, certifications, careerRecommendations } = currentAnalysis;

  const radarData = [
    { subject: 'ATS Score', value: scores?.ats || 85, fullMark: 100 },
    { subject: 'Skills', value: scores?.skills || 80, fullMark: 100 },
    { subject: 'Experience', value: scores?.experience || 75, fullMark: 100 },
    { subject: 'Education', value: scores?.education || 85, fullMark: 100 },
    { subject: 'Formatting', value: scores?.formatting || 90, fullMark: 100 },
    { subject: 'Keywords', value: scores?.keywords || 80, fullMark: 100 },
  ];

  const barData = [
    { category: 'Prog', count: skills?.categories?.programming?.length || 3, fill: '#3b82f6' },
    { category: 'Front', count: skills?.categories?.frontend?.length || 4, fill: '#06b6d4' },
    { category: 'Back', count: skills?.categories?.backend?.length || 3, fill: '#10b981' },
    { category: 'DB', count: skills?.categories?.database?.length || 2, fill: '#f59e0b' },
    { category: 'Cloud', count: skills?.categories?.cloud?.length || 2, fill: '#a855f7' },
    { category: 'Soft', count: skills?.soft?.length || 3, fill: '#ec4899' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Resume Intelligence Dashboard
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Profile
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Profile: <span className="text-slate-900 font-bold">{candidate?.name || 'Candidate'}</span> • {currentAnalysis.originalFileName}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to={`/analysis/${currentAnalysis.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            Full Report
          </Link>
          <Link
            to="/upload"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#ff5656] text-white hover:bg-[#ff4242] shadow-md shadow-[#ff5656]/20"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            New Upload
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Overall</span>
          <p className="text-2xl font-black text-[#ff5656] font-heading">{scores?.overall || 82}%</p>
        </div>

        <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">ATS Score</span>
          <p className="text-2xl font-black text-emerald-600 font-heading">{scores?.ats || 85}%</p>
        </div>

        <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Skills</span>
          <p className="text-2xl font-black text-cyan-600 font-heading">
            {(skills?.technical?.length || 0) + (skills?.soft?.length || 0)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
          <p className="text-2xl font-black text-purple-600 font-heading">
            {experience?.length || 1} Role
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Projects</span>
          <p className="text-2xl font-black text-amber-500 font-heading">
            {projects?.length || 2}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Certs</span>
          <p className="text-2xl font-black text-pink-600 font-heading">
            {certifications?.length || 2}
          </p>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              6-Dimensional Performance Matrix
            </h3>
            <span className="text-[11px] text-[#ff5656] font-bold bg-coral-50 px-2.5 py-0.5 rounded-full border border-coral-200">
              Balanced Profile
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={9} />
                <Radar
                  name="Candidate"
                  dataKey="value"
                  stroke="#ff5656"
                  fill="#ff5656"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 text-center">
            Measures ATS readiness, experience impact, and keyword richness.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Extracted Skill Category Counts
            </h3>
            <span className="text-[11px] text-cyan-700 font-bold bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
              Domain Spread
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 text-center">
            Prog = Languages, Front = UI, Back = Server, DB = Databases, Cloud = DevOps
          </p>
        </div>
      </div>

      {/* Target Role Alignment */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Target Role Alignment & Match Overview
            </h3>
          </div>
          <Link to="/job-match" className="text-xs font-bold text-[#ff5656] hover:underline flex items-center gap-1">
            Test Job Match <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careerRecommendations?.slice(0, 4).map((role, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-900 font-heading">{role.role}</span>
                <span className="text-emerald-600">{role.matchPercentage}% Match</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${role.matchPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
