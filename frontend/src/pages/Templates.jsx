import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, UploadCloud, ArrowLeft } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import ResumeTemplateView from '../components/ResumeTemplateView';

export default function Templates() {
  const { currentAnalysis, loadSample } = useResume();

  const handleLoadSample = async () => {
    try {
      await loadSample('sample-fullstack');
    } catch (e) {}
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-coral-50 text-[#ff5656] border border-coral-200">
          <Layout className="w-3.5 h-3.5" />
          <span>Resume Templates & 1-Click PDF Export</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">
          Resume Templates & Downloader
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Transform your parsed resume into professional templates (Kickresume 2-Column, Executive Minimalist, Tech Lead Navy, Editorial Serif, Creative Coral).
        </p>
      </div>

      {currentAnalysis ? (
        <ResumeTemplateView resumeData={currentAnalysis} />
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-coral-50 text-[#ff5656] flex items-center justify-center">
            <Layout className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            No Active Resume Loaded
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload your resume or load a sample resume to preview and download across multiple templates.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleLoadSample}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ff5656] text-white hover:bg-[#ff4242] shadow-sm transition-all"
            >
              Load Sample Resume
            </button>
            <Link
              to="/upload"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all border border-slate-200"
            >
              Upload Document
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
