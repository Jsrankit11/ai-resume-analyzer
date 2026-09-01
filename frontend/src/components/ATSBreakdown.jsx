import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import ScoreGauge from './ScoreGauge';

export default function ATSBreakdown({ atsScore = 85, passed = [], issues = [] }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              ATS Scanner Compatibility Checker
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Evaluates resume structure, standard headings, keyword density, and formatting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              ATS Score
            </span>
            <p className="text-2xl font-black text-emerald-600 font-heading">{atsScore} / 100</p>
          </div>
          <ScoreGauge score={atsScore} size={90} strokeWidth={8} showGrade={false} label="" sublabel="" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passed Checks */}
        <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider font-heading">
              Passed Checks ({passed.length})
            </h4>
          </div>
          {passed.length > 0 ? (
            <ul className="space-y-2.5">
              {passed.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No passed checks detected.</p>
          )}
        </div>

        {/* Needs Improvement */}
        <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider font-heading">
              Needs Improvement ({issues.length})
            </h4>
          </div>
          {issues.length > 0 ? (
            <ul className="space-y-2.5">
              {issues.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="text-amber-600 font-bold mt-0.5">⚠</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs sm:text-sm text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Perfect! No major formatting issues found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
