import React, { useState, useRef } from 'react';
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
  AlertCircle,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { generateResumeFromPrompt } from '../services/api';
import { useResume } from '../context/ResumeContext';
import ResumeTemplateView, { PRESET_AVATARS } from '../components/ResumeTemplateView';

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
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

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
    photo: PRESET_AVATARS[0].url,
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

  const handlePromptPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData((prev) => ({ ...prev, photo: event.target.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        handleUpdateCandidate('photo', event.target.result);
      }
    };
    reader.readAsDataURL(file);
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

      // Preserve uploaded photo in candidate data
      if (formData.photo && generated?.candidate) {
        generated.candidate.photo = formData.photo;
      }

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
    setEditableResume((prev) => {
      const updated = {
        ...prev,
        candidate: { ...prev?.candidate, [field]: value }
      };
      setCurrentAnalysis(updated);
      return updated;
    });
  };

  const handleUpdateSummary = (value) => {
    setEditableResume((prev) => {
      const updated = { ...prev, summary: value };
      setCurrentAnalysis(updated);
      return updated;
    });
  };

  const handleAddSkill = (skillText) => {
    if (!skillText.trim()) return;
    setEditableResume((prev) => {
      const curTech = prev?.skills?.technical || [];
      if (curTech.includes(skillText.trim())) return prev;
      const updated = {
        ...prev,
        skills: {
          ...prev?.skills,
          technical: [...curTech, skillText.trim()]
        }
      };
      setCurrentAnalysis(updated);
      return updated;
    });
  };

  const handleRemoveSkill = (skillText) => {
    setEditableResume((prev) => {
      const updated = {
        ...prev,
        skills: {
          ...prev?.skills,
          technical: (prev?.skills?.technical || []).filter((s) => s !== skillText)
        }
      };
      setCurrentAnalysis(updated);
      return updated;
    });
  };

  const handleUpdateExperience = (idx, field, value) => {
    setEditableResume((prev) => {
      const exps = [...(prev?.experience || [])];
      exps[idx] = { ...exps[idx], [field]: value };
      const updated = { ...prev, experience: exps };
      setCurrentAnalysis(updated);
      return updated;
    });
  };

  const handleAddExperience = () => {
    setEditableResume((prev) => {
      const newExp = {
        role: 'Software Engineer',
        company: 'Company / Project',
        duration: '2023 - Present',
        location: 'Remote',
        responsibilities: [
          'Developed robust responsive user interfaces with high performance.',
          'Optimized database operations and API response times by 30%.'
        ]
      };
      const updated = {
        ...prev,
        experience: [...(prev?.experience || []), newExp]
      };
      setCurrentAnalysis(updated);
      return updated;
    });
  };

  const handleRemoveExperience = (idx) => {
    setEditableResume((prev) => {
      const updated = {
        ...prev,
        experience: (prev?.experience || []).filter((_, i) => i !== idx)
      };
      setCurrentAnalysis(updated);
      return updated;
    });
  };

  const handleUpdateProject = (idx, field, value) => {
    setEditableResume((prev) => {
      const projs = [...(prev?.projects || [])];
      projs[idx] = { ...projs[idx], [field]: value };
      const updated = { ...prev, projects: projs };
      setCurrentAnalysis(updated);
      return updated;
    });
  };

  const handleAddProject = () => {
    setEditableResume((prev) => {
      const newProj = {
        title: 'New AI/Web Application',
        description: 'Built a full stack application with authentication, real-time updates and seamless UX.',
        techStack: ['React', 'Node.js', 'Tailwind CSS']
      };
      const updated = {
        ...prev,
        projects: [...(prev?.projects || []), newProj]
      };
      setCurrentAnalysis(updated);
      return updated;
    });
  };

  const handleRemoveProject = (idx) => {
    setEditableResume((prev) => {
      const updated = {
        ...prev,
        projects: (prev?.projects || []).filter((_, i) => i !== idx)
      };
      setCurrentAnalysis(updated);
      return updated;
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
          <span>AI Resume Builder • Photo Customizer • 8+ Pro Templates</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">
          AI Resume Generator & Custom Studio
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Generate an ATS-optimized professional resume from a prompt, upload your headshot photo, customize in real-time, and download across 8 modern templates.
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
          3. 8+ Templates & PDF
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
              Enter your bio, target role, upload your headshot, and key skills or pick a preset prompt below.
            </p>
          </div>

          {/* Quick Preset Samples */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-heading">
              Choose a Sample Role Prompt:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplySamplePrompt(sample)}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#ff5656] hover:bg-coral-50/50 text-left transition-all space-y-1"
                >
                  <span className="text-xs font-bold text-slate-900 block">
                    {sample.title}
                  </span>
                  <span className="text-[11px] text-slate-500 line-clamp-2">
                    {sample.prompt}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Your Bio / Background Prompt</label>
            <textarea
              rows={3}
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              placeholder="e.g. I am a Computer Science graduate with experience in React and Node.js. Built a fullstack e-commerce project with Redux and MongoDB..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#ff5656] focus:bg-white transition-all"
            />
          </div>

          {/* Profile Photo Upload in Prompt Form */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-heading">
                <Camera className="w-3.5 h-3.5 text-[#ff5656]" />
                Profile Photo (Optional)
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePromptPhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm"
              >
                <Upload className="w-3.5 h-3.5 text-[#ff5656]" />
                Upload Photo File
              </button>
            </div>

            <div className="flex items-center gap-3">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Profile Preview"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#ff5656] shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, photo: av.url })}
                    className={`flex items-center gap-1.5 p-1 rounded-xl border transition-all ${
                      formData.photo === av.url ? 'border-[#ff5656] bg-coral-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <img src={av.url} alt={av.label} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-[10px] font-semibold text-slate-700 pr-1">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>
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
                Preview in 8+ Templates & Download
              </button>
            </div>
          </div>

          {/* Section 1: Personal Details & Photo */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <User className="w-4 h-4 text-[#ff5656]" />
                Personal & Contact Information
              </h3>
            </div>

            {/* Photo In Editor */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleEditPhotoUpload}
                  className="hidden"
                />
                {editableResume.candidate?.photo ? (
                  <img
                    src={editableResume.candidate.photo}
                    alt="Candidate Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#ff5656] shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                    <User className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Profile Photo</h5>
                  <p className="text-[10px] text-slate-500">Appears on supported resume templates</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ff5656] text-white hover:bg-[#ff4242] shadow-sm"
                >
                  Change Photo
                </button>
                {editableResume.candidate?.photo && (
                  <button
                    type="button"
                    onClick={() => handleUpdateCandidate('photo', '')}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

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
                <label className="font-bold text-slate-700">GitHub Profile</label>
                <input
                  type="text"
                  value={editableResume.candidate?.github || ''}
                  onChange={(e) => handleUpdateCandidate('github', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-[#ff5656] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#ff5656]" />
              Professional Summary
            </h3>
            <textarea
              rows={4}
              value={editableResume.summary || ''}
              onChange={(e) => handleUpdateSummary(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 leading-relaxed focus:border-[#ff5656] outline-none"
            />
          </div>

          {/* Section 3: Technical & Soft Skills */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ff5656]" />
              Technical Skills Matrix
            </h3>

            <div className="flex flex-wrap gap-2">
              {editableResume.skills?.technical?.map((sk, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {sk}
                  <button
                    onClick={() => handleRemoveSkill(sk)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                id="new-skill-input"
                placeholder="Add skill (e.g. GraphQL, AWS, Next.js)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSkill(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-[#ff5656] outline-none w-64"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('new-skill-input');
                  if (input) {
                    handleAddSkill(input.value);
                    input.value = '';
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Section 4: Work Experience */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#ff5656]" />
                Work Experience ({editableResume.experience?.length || 0})
              </h3>
              <button
                onClick={handleAddExperience}
                className="flex items-center gap-1 text-xs font-bold text-[#ff5656] hover:text-[#ff4242]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {editableResume.experience?.map((exp, expIdx) => (
                <div key={expIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Experience #{expIdx + 1}</span>
                    <button
                      onClick={() => handleRemoveExperience(expIdx)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={exp.role || ''}
                      onChange={(e) => handleUpdateExperience(expIdx, 'role', e.target.value)}
                      placeholder="Role (e.g. Software Engineer)"
                      className="bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
                    />
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => handleUpdateExperience(expIdx, 'company', e.target.value)}
                      placeholder="Company Name"
                      className="bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
                    />
                    <input
                      type="text"
                      value={exp.duration || ''}
                      onChange={(e) => handleUpdateExperience(expIdx, 'duration', e.target.value)}
                      placeholder="Duration (e.g. 2022 - Present)"
                      className="bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Bullet Points (one per line)</label>
                    <textarea
                      rows={3}
                      value={exp.responsibilities?.join('\n') || ''}
                      onChange={(e) => handleUpdateExperience(expIdx, 'responsibilities', e.target.value.split('\n'))}
                      placeholder="Bullet points..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 leading-relaxed outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Projects */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#ff5656]" />
                Projects ({editableResume.projects?.length || 0})
              </h3>
              <button
                onClick={handleAddProject}
                className="flex items-center gap-1 text-xs font-bold text-[#ff5656] hover:text-[#ff4242]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
            </div>

            <div className="space-y-4">
              {editableResume.projects?.map((proj, projIdx) => (
                <div key={projIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Project #{projIdx + 1}</span>
                    <button
                      onClick={() => handleRemoveProject(projIdx)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={proj.title || ''}
                      onChange={(e) => handleUpdateProject(projIdx, 'title', e.target.value)}
                      placeholder="Project Title"
                      className="bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
                    />
                    <input
                      type="text"
                      value={proj.techStack?.join(', ') || ''}
                      onChange={(e) => handleUpdateProject(projIdx, 'techStack', e.target.value.split(',').map(s => s.trim()))}
                      placeholder="Tech Stack (comma separated)"
                      className="bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none"
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
              Save & Preview in 8+ Templates
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

          <ResumeTemplateView 
            resumeData={editableResume || currentAnalysis} 
            onUpdateResume={(updated) => {
              setEditableResume(updated);
              setCurrentAnalysis(updated);
            }}
          />
        </div>
      )}
    </div>
  );
}
