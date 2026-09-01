import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Cpu, Code2, Database, Layout } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand & Project Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#ff5656] text-white flex items-center justify-center font-bold text-xs">
                JSR
              </div>
              <span className="text-xl font-bold font-heading text-slate-900">
                jsr<span className="text-[#ff5656]">resume</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              AI Resume Parser & ATS Score Analyzer with One-Click PDF Template Export.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-coral-50 text-[#ff5656] border border-coral-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5656] animate-pulse"></span>
              Developed by Ankit Dev
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 font-heading">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/upload" className="hover:text-[#ff5656] transition-colors">
                  Upload & Parse Resume
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-[#ff5656] transition-colors">
                  Resume Templates & PDF Export
                </Link>
              </li>
              <li>
                <Link to="/analysis" className="hover:text-[#ff5656] transition-colors">
                  ATS Score Analysis
                </Link>
              </li>
              <li>
                <Link to="/job-match" className="hover:text-[#ff5656] transition-colors">
                  Job Description Matcher
                </Link>
              </li>
              <li>
                <Link to="/interview" className="hover:text-[#ff5656] transition-colors">
                  AI Interview Prep
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 font-heading">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                React 18 + Vite
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                Tailwind CSS
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                Node.js & Express
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                MongoDB
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                jsPDF & html2canvas
              </span>
            </div>
          </div>

          {/* Core Capabilities */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 font-heading">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-[#ff5656]" />
                Multi-Template 1-Click Download
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                ATS Scanner Compliance
              </li>
              <li className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#ff5656]" />
                Automatic Skill Taxonomy
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-500" />
                STAR Bullet Point Rewriter
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright with Ankit Dev */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JSR Resume. Developed with pride by <strong className="text-slate-800">Ankit Dev</strong>.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-[#ff5656] inline fill-[#ff5656]" /> by <strong className="text-slate-800">Ankit Dev</strong> for College Minor Project.
          </p>
        </div>
      </div>
    </footer>
  );
}
