import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wand2, 
  FileEdit, 
  Download, 
  Printer, 
  Check, 
  Plus, 
  Trash2, 
  Eye, 
  Zap, 
  ArrowRight, 
  Layers, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FileText, 
  FolderGit2,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { generateResumeFromPrompt } from '../services/api';
import { useResume } from '../context/ResumeContext';
import ResumeTemplateView from '../components/ResumeTemplateView';

const SAMPLE_PROMPTS = [
  {
    title: 'Full Stack MERN Developer',
    prompt: 'I am a CSE student with strong skills in React, Node.js, Express, MongoDB, and Tailwind CSS. Built an e-commerce store and real-time chat app. Generate an ATS-friendly resume for Full Stack Engineer roles.',
    role: 'Full Stack Developer',
    level: 'Fresher / Entry-Level',
    skills: 'React.js, Node.js, Express.js, MongoDB, JavaScript ES6+, TypeScript, Tailwind CSS, REST APIs, Git, Docker'
  },
  {
    title: 'Frontend React & UI Engineer',
    prompt: '2+ years experience building modern web apps with React, Next.js, Redux, and TypeScript. Experience with responsive web design, performance optimization, and Figma to code.',
    role: 'Frontend Developer',
    level: 'Junior (1-3 Years)',
    skills: 'React.js, Next.js, TypeScript, JavaScript, Tailwind CSS, Redux Toolkit, HTML5/CSS3, Jest, Git'
  },
  {
    title: 'Data Scientist & AI Specialist',
    prompt: 'B.Tech student passionate about Machine Learning and Data Science. Proficient in Python, SQL, Pandas, Scikit-learn, TensorFlow, and BigQuery with predictive modeling projects.',
    role: 'Data Scientist',
    level: 'Fresher / Entry-Level',
    skills: 'Python, SQL, Pandas, NumPy, Scikit-learn, TensorFlow, BigQuery, Tableau, Git, Docker'
  }
];

export default function Builder() {
  const { currentAnalysis, setCurrentAnalysis } = useResume();
  const navigate = useNavigate();

  // Mode: 'prompt' | 'edit' | 'preview'
  const [activeTab, setActiveTab] = useState('prompt');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Inputs
  const [formData, setFormData] = useState({
    prompt: '',
    targetRole: 'Full Stack Developer',
    experienceLevel: 'Fresher / Entry-Level',
    fullName: 'Ankit Sharma',
    email: 'ankit.dev@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/ankitsharma',
    github: 'github.com/ankitdev',
    keySkills: 'React.js, Node.js, Express.js, MongoDB, JavaScript ES6+, TypeScript, Tailwind CSS, REST APIs, Git'
  });

  // Editable Resume Object (Initialized from current analysis or default)
  const [editableResume, setEditableResume] = useState(() => {
    if (currentAnalysis) return currentAnalysis;
    return null;
  });

  const handleApplySamplePrompt = (sample) => {
    setFormData((prev) => ({
      ...prev,
      prompt: sample.prompt,
      targetRole: sample.role,
      experienceLevel: sample.level,
      keySkills: sample.skills
    }));
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);

      const skillsArray = formData.keySkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const generated = await generateResumeFromPrompt({
        ...formData,
        keySkills: skillsArray
      });

      setEditableResume(generated);
      setCurrentAnalysis(generated);
      setActiveTab('edit');
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate resume.');
    } finally {
      setLoading(false);
    }
  };

  // Editable Resume Handlers
  const handleUpdateCandidate = (field, value) => {
    setEditableResume((prev) => ({
      ...prev,
      candidate: { ...prev?.candidate, [field]: value }
    }));
  };

  const handleUpdateSummary = (value) => {
    setEditableResume((prev) => ({ ...prev, summary: value }));
  };

  const handleAddSkill = (skillText) => {
    if (!skillText.trim()) return;
    setEditableResume((prev) => {
      const curTech = prev?.skills?.technical || [];
      if (curTech.includes(skillText.trim())) return prev;
      return {
        ...prev,
        skills: {
          ...prev?.skills,
          technical: [...curTech, skillText.trim()]
        }
      };
    });
  };

  const handleRemoveSkill = (skillText) => {
    setEditableResume((prev) => ({
      ...prev,
      skills: {
        ...prev?.skills,
        technical: (prev?.skills?.technical || []).filter((s) => s !== skillText)
      }
    }));
  };

  const handleUpdateExperience = (idx, field, value) => {
    setEditableResume((prev) => {
      const exps = [...(prev?.experience || [])];
      exps[idx] = { ...exps[idx], [field]: value };
      return { ...prev, experience: exps };
    });
  };

  const handleUpdateProject = (idx, field, value) => {
    setEditableResume((prev) => {
      const projs = [...(prev?.projects || [])];
      projs[idx] = { ...projs[idx], [field]: value };
      return { ...prev, projects: projs };
    });
  };

  const handleViewAnalysis = () => {
    if (editableResume?.id) {
      setCurrentAnalysis(editableResume);
      navigate(`/analysis/${editableResume.id}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-coral-50 text-[#ff5656] border border-coral-200">
          <Wand2 className="w-3.5 h-3.5" />
          <span>AI Resume Builder & Prompt Generator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">
          AI Resume Generator & Live Editor
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Generate an ATS-optimized professional resume from a single prompt, customize all details with real-time editing, and export directly to PDF.
        </p>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm flex items-center max-w-lg mx-auto">
        <button
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'prompt'
              ? 'bg-[#ff5656] text-white shadow-md shadow-[#ff5656]/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          1. Prompt Generator
        </button>

        <button
          onClick={() => {
            if (!editableResume) handleGenerate();
            else setActiveTab('edit');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'edit'
              ? 'bg-[#ff5656] text-white shadow-md shadow-[#ff5656]/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileEdit className="w-4 h-4" />
          2. Live Editor
        </button>

        <button
          onClick={() => {
            if (!editableResume) handleGenerate();
            else setActiveTab('preview');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'preview'
              ? 'bg-[#ff5656] text-white shadow-md shadow-[#ff5656]/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-4 h-4" />
          3. Templates & PDF
        </button>
      </div>

      {/* ================= TAB 1: PROMPT GENERATOR ================= */}
      {activeTab === 'prompt' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Generate Resume with AI Prompt
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter your bio, target role, and key skills or pick a preset prompt below.
            </p>
          </div>

          {/* Sample Prompts */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block font-heading">
              Quick Presets:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplySamplePrompt(sample)}
                  className="p-3.5 rounded-2xl text-left border border-slate-200 hover:border-[#ff5656] bg-slate-50 hover:bg-coral-50/50 transition-all space-y-1"
                >
                  <p className="text-xs font-bold text-slate-900 font-heading">
                    {sample.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {sample.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block font-heading">
              Your Custom Resume Prompt / Background:
            </label>
            <textarea
              rows={4}
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              placeholder="Describe your education, past projects, target job role, skills you know, and experience level..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff5656] transition-colors leading-relaxed"
            />
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Target Role Title</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                placeholder="e.g. Full Stack Developer"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff5656]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff5656]"
              >
                <option value="Fresher / Entry-Level">Fresher / Student (0-1 yrs)</option>
                <option value="Junior (1-3 Years)">Junior Engineer (1-3 yrs)</option>
                <option value="Mid-Level (3-5 Years)">Mid-Level Professional (3-5 yrs)</option>
                <option value="Senior (5+ Years)">Senior Lead / Architect (5+ yrs)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Your Full Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff5656]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff5656]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff5656]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bangalore, India"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff5656]"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-800">Core Technical Skills (comma separated)</label>
            <input
              type="text"
              value={formData.keySkills}
              onChange={(e) => setFormData({ ...formData, keySkills: e.target.value })}
              placeholder="e.g. React.js, Node.js, Express, MongoDB, TypeScript, Tailwind CSS, Docker"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#ff5656]"
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-base font-bold bg-[#ff5656] hover:bg-[#ff4242] text-white shadow-xl shadow-[#ff5656]/25 hover:shadow-[#ff5656]/40 transition-all disabled:opacity-50"
          >
            <Wand2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Crafting High-Scoring ATS Resume...' : 'Generate Resume with AI'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* ================= TAB 2: LIVE IN-PLACE EDITOR ================= */}
      {activeTab === 'edit' && editableResume && (
        <div className="space-y-6">
          {/* Top Actions Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-900 font-heading">
                Editing: {editableResume.candidate?.name || 'Resume'}
              </span>
              <span className="text-slate-500">({editableResume.skills?.technical?.length || 0} skills)</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleViewAnalysis}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-[#ff5656]" />
                Audit ATS Score
              </button>

              <button
                onClick={() => setActiveTab('preview')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold bg-[#ff5656] text-white hover:bg-[#ff4242] shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview in Templates & Download
              </button>
            </div>
          </div>

          {/* Section 1: Personal Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <User className="w-4 h-4 text-[#ff5656]" />
              Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={editableResume.candidate?.name || ''}
                  onChange={(e) => handleUpdateCandidate('name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-[#ff5656] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={editableResume.candidate?.email || ''}
                  onChange={(e) => handleUpdateCandidate('email', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-[#ff5656] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={editableResume.candidate?.phone || ''}
                  onChange={(e) => handleUpdateCandidate('phone', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-[#ff5656] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Location</label>
                <input
                  type="text"
                  value={editableResume.candidate?.location || ''}
                  onChange={(e) => handleUpdateCandidate('location', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-[#ff5656] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">LinkedIn Profile</label>
                <input
                  type="text"
                  value={editableResume.candidate?.linkedin || ''}
                  onChange={(e) => handleUpdateCandidate('linkedin', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-[#ff5656] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">GitHub / Portfolio</label>
                <input
                  type="text"
                  value={editableResume.candidate?.github || ''}
                  onChange={(e) => handleUpdateCandidate('github', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-[#ff5656] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#ff5656]" />
              Professional Summary
            </h3>
            <textarea
              rows={3}
              value={editableResume.summary || ''}
              onChange={(e) => handleUpdateSummary(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 leading-relaxed outline-none focus:border-[#ff5656]"
            />
          </div>

          {/* Section 3: Technical Skills Management */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ff5656]" />
              Technical & Core Skills ({editableResume.skills?.technical?.length || 0})
            </h3>

            <div className="flex flex-wrap gap-2">
              {editableResume.skills?.technical?.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-coral-50 text-[#ff5656] border border-coral-200"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-700 rounded-full p-0.5"
                    title="Remove Skill"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Add Skill Input */}
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                id="newSkillInput"
                placeholder="Add new skill (e.g. GraphQL, AWS)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSkill(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-[#ff5656] outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('newSkillInput');
                  if (input && input.value) {
                    handleAddSkill(input.value);
                    input.value = '';
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#ff5656] text-white hover:bg-[#ff4242]"
              >
                Add
              </button>
            </div>
          </div>

          {/* Section 4: Work Experience */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#ff5656]" />
              Work & Internship Experience
            </h3>

            <div className="space-y-4">
              {editableResume.experience?.map((exp, expIdx) => (
                <div key={expIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={exp.role || ''}
                      onChange={(e) => handleUpdateExperience(expIdx, 'role', e.target.value)}
                      placeholder="Role Title"
                      className="bg-white border border-slate-200 rounded-xl p-2 font-bold text-slate-900"
                    />
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => handleUpdateExperience(expIdx, 'company', e.target.value)}
                      placeholder="Company Name"
                      className="bg-white border border-slate-200 rounded-xl p-2 text-slate-800"
                    />
                    <input
                      type="text"
                      value={exp.duration || ''}
                      onChange={(e) => handleUpdateExperience(expIdx, 'duration', e.target.value)}
                      placeholder="Duration (e.g. 2023 - Present)"
                      className="bg-white border border-slate-200 rounded-xl p-2 text-slate-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Responsibilities (One per line)</label>
                    <textarea
                      rows={3}
                      value={exp.responsibilities?.join('\n') || ''}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n');
                        handleUpdateExperience(expIdx, 'responsibilities', lines);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 leading-relaxed outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Projects */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#ff5656]" />
              Key Projects
            </h3>

            <div className="space-y-4">
              {editableResume.projects?.map((proj, projIdx) => (
                <div key={projIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={proj.title || ''}
                      onChange={(e) => handleUpdateProject(projIdx, 'title', e.target.value)}
                      placeholder="Project Title"
                      className="bg-white border border-slate-200 rounded-xl p-2 font-bold text-slate-900"
                    />
                    <input
                      type="text"
                      value={proj.techStack?.join(', ') || ''}
                      onChange={(e) => {
                        const stacks = e.target.value.split(',').map((s) => s.trim());
                        handleUpdateProject(projIdx, 'techStack', stacks);
                      }}
                      placeholder="Technologies (React, Node, MongoDB)"
                      className="bg-white border border-slate-200 rounded-xl p-2 text-slate-700"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={proj.description || ''}
                    onChange={(e) => handleUpdateProject(projIdx, 'description', e.target.value)}
                    placeholder="Project description & key accomplishments..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 leading-relaxed outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Save & Preview CTA */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setActiveTab('preview')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold bg-[#ff5656] hover:bg-[#ff4242] text-white shadow-lg shadow-[#ff5656]/25 transition-all"
            >
              <Eye className="w-4 h-4" />
              Save & Preview in 5+ Templates
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 3: TEMPLATES & 1-CLICK PDF ================= */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-3 text-xs">
            <button
              onClick={() => setActiveTab('edit')}
              className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl"
            >
              <FileEdit className="w-3.5 h-3.5" />
              Back to Live Editor
            </button>

            <button
              onClick={handleViewAnalysis}
              className="flex items-center gap-1.5 font-bold text-[#ff5656] bg-coral-50 hover:bg-coral-100 px-3.5 py-2 rounded-xl border border-coral-200"
            >
              <Zap className="w-3.5 h-3.5" />
              Audit ATS Score
            </button>
          </div>

          <ResumeTemplateView resumeData={editableResume || currentAnalysis} />
        </div>
      )}
    </div>
  );
}
