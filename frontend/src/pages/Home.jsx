import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  ShieldCheck, 
  Target, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Bot, 
  Layers, 
  Award,
  Check,
  Star,
  FileText
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'ATS Compatibility Audit',
    desc: 'Instant check for ATS parsing errors, missing standard headings, and keyword densities.',
    badge: 'Real-time Audit'
  },
  {
    icon: Layers,
    title: 'AI Skill Taxonomy',
    desc: 'Extracts over 200+ technical, database, cloud, and soft skills into interactive badges.',
    badge: 'Taxonomy Engine'
  },
  {
    icon: FileText,
    title: 'Before & After Bullet Rewriter',
    desc: 'Transforms plain tasks into high-impact STAR-method statements with quantifiable metrics.',
    badge: 'AI Rewriter'
  },
  {
    icon: Target,
    title: 'Job Description Matcher',
    desc: 'Paste any job posting to calculate match percentage, missing skills, and keywords.',
    badge: 'Role Alignment'
  },
  {
    icon: HelpCircle,
    title: 'AI Interview Preparation',
    desc: 'Generates role-tailored technical, behavioral, and project questions with model answers.',
    badge: 'Viva & Prep'
  },
  {
    icon: Bot,
    title: 'JSR AI Career Coach',
    desc: 'Interactive 24/7 assistant providing personalized resume improvement strategies.',
    badge: 'AI Assistant'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { loadSample } = useResume();

  const handleQuickDemo = async () => {
    try {
      const res = await loadSample('sample-fullstack');
      navigate(`/analysis/${res.id}`);
    } catch (e) {
      navigate('/upload');
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 pt-6 sm:pt-10 pb-16">
      {/* Hero Section (Kickresume Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide text-slate-800 uppercase font-heading">
              <span>Best AI Resume Parser & Analyzer</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-heading leading-[1.12]">
              Your success story <br className="hidden sm:inline" />
              begins with a <span className="underline decoration-[#ff5656] decoration-4 underline-offset-4">resume.</span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
              Extract, score, and supercharge your resume quickly with the help of artificial intelligence. Impress future employers and bypass ATS filters with verified real-time insights.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/upload"
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-8 rounded-2xl text-base font-bold bg-[#ff5656] hover:bg-[#ff4242] text-white shadow-xl shadow-[#ff5656]/25 hover:shadow-[#ff5656]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Analyze My Resume
              </Link>

              <button
                onClick={handleQuickDemo}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-7 rounded-2xl text-base font-bold bg-white text-[#ff5656] border-2 border-[#ff5656] hover:bg-coral-50 transition-all shadow-sm"
              >
                See Examples
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t border-slate-200/80 space-y-3">
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Trusted by successful job seekers and students worldwide.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 opacity-75 grayscale hover:grayscale-0 transition-all text-slate-800 font-black text-sm tracking-wider">
                <span>Google</span>
                <span>Microsoft</span>
                <span>Amazon</span>
                <span>Meta</span>
                <span>TCS</span>
                <span>Infosys</span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic Kickresume Card Preview */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Subtle glow backdrop */}
            <div className="absolute -inset-4 bg-gradient-to-r from-coral-200/50 to-orange-100/50 rounded-3xl blur-2xl -z-10" />

            {/* Resume Sheet */}
            <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-900 transition-transform duration-300 hover:scale-[1.01]">
              {/* Floating ATS Badge */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 animate-bounce">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>94% ATS Passed</span>
              </div>

              {/* Two-Column Mockup (Kickresume style) */}
              <div className="grid grid-cols-12 min-h-[520px] text-[11px]">
                {/* Dark Sidebar */}
                <div className="col-span-4 bg-[#1e232f] text-slate-300 p-4 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Candidate Photo */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#ff5656] mx-auto shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                        alt="Candidate Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1 text-center">
                      <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider block">
                        PROFILE
                      </span>
                      <p className="text-[10px] text-slate-300 leading-tight">
                        Results-driven engineer with 2+ yrs expertise building scalable applications.
                      </p>
                    </div>

                    <div className="space-y-1 text-center">
                      <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider block">
                        EXPERIENCE
                      </span>
                      <p className="text-[10px] text-slate-400">
                        Senior Developer at TechLab Inc.
                      </p>
                    </div>
                  </div>

                  {/* Circular Skill Indicators */}
                  <div className="space-y-2 pt-2 border-t border-slate-700 text-center">
                    <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider block">
                      SKILLS
                    </span>
                    <div className="flex justify-around items-center">
                      <div className="text-center">
                        <div className="w-8 h-8 rounded-full border-2 border-amber-400 flex items-center justify-center text-[9px] font-bold text-white mx-auto">
                          100
                        </div>
                        <span className="text-[8px] text-slate-400 block mt-0.5">React</span>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 rounded-full border-2 border-amber-400 flex items-center justify-center text-[9px] font-bold text-white mx-auto">
                          95
                        </div>
                        <span className="text-[8px] text-slate-400 block mt-0.5">Node.js</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main White Content Sheet */}
                <div className="col-span-8 p-5 space-y-4 bg-white text-slate-800">
                  {/* Name & Title */}
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900 font-heading">
                      Michelle D'Aquino
                    </h3>
                    <p className="text-[10px] text-[#ff5656] font-semibold">
                      Full Stack & Automation Specialist
                    </p>
                    <div className="text-[9px] text-slate-500 mt-1 space-y-0.5">
                      <p>Email: michelle.dev@example.com</p>
                      <p>Location: Bangalore, India</p>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-600 leading-relaxed italic">
                      "Passionate, customer-focused developer with a demonstrated track record of improving cloud system performance by 35%."
                    </p>
                  </div>

                  {/* Work Experience */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 font-heading">
                      Work Experience
                    </h4>

                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-[10px]">
                          Digital Business Automation Specialist
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 font-medium">
                        InnovateX Labs • 2023 – Present
                      </p>
                      <ul className="space-y-1 text-[9px] text-slate-600 pl-3 list-disc">
                        <li>Developed responsive web portals using React & Tailwind CSS.</li>
                        <li>Automated CI/CD pipelines reducing deployment time by 40%.</li>
                        <li>Implemented secure RESTful APIs with MongoDB and Express.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Interactive CTA overlay tag */}
                  <div className="pt-2">
                    <button
                      onClick={handleQuickDemo}
                      className="w-full py-2 rounded-xl bg-coral-50 hover:bg-coral-100 text-[#ff5656] font-bold text-xs transition-colors border border-coral-200 flex items-center justify-center gap-1.5"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      View Full Live Analysis
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Everything You Need for Career Success
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Comprehensive AI tools built to parse, score, format, and match resumes against real industry jobs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="kick-card rounded-2xl p-7 flex flex-col justify-between kick-card-hover group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-coral-50 text-[#ff5656] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-heading group-hover:text-[#ff5656] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* College Minor Project Highlights Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="kick-card rounded-3xl p-8 sm:p-12 text-center space-y-6 bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-xl">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#ff5656] text-white flex items-center justify-center shadow-lg shadow-[#ff5656]/20 font-bold text-sm">
            JSR
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              College Minor Project • Full-Stack AI Resume Intelligence
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Engineered with React, Vite, Node.js, Express, MongoDB, and intelligent NLP parsing for seamless viva presentation and real-world utility.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 py-3.5 px-8 rounded-2xl text-sm font-bold bg-[#ff5656] hover:bg-[#ff4242] text-white shadow-lg shadow-[#ff5656]/25 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              Start Resume Analysis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
