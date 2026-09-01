import React from 'react';
import ResumeUploader from '../components/ResumeUploader';
import { Shield, Zap, FileCheck } from 'lucide-react';

export default function Upload() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-coral-50 text-[#ff5656] border border-coral-200">
          <Zap className="w-3.5 h-3.5" />
          <span>JSR AI Parser & ATS Scorer</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-heading">
          Upload Your Resume
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
          Upload your resume in PDF or DOCX format. Get an instant ATS compatibility score, extracted skills, and Before/After bullet point enhancements.
        </p>
      </div>

      {/* Uploader Component */}
      <ResumeUploader />

      {/* Upload Guidelines */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-50 text-[#ff5656] shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 font-heading">Standard Formats</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Supports PDF and DOCX files up to 10MB with instant text extraction.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-50 text-emerald-600 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 font-heading">Private & Secure</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Processed safely in-memory and stored privately in your browser session.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-50 text-amber-500 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 font-heading">Instant Analysis</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Complete ATS scores, skill taxonomy, and role matching ready in seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
