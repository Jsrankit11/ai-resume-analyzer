import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, RefreshCw } from 'lucide-react';
import { improveBulletText } from '../services/api';

export default function ImprovementCard({
  item,
  onUpdateSuggestion,
}) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(item.suggestion);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSuggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      const res = await improveBulletText(item.original, item.category);
      if (res?.suggestion) {
        setCurrentSuggestion(res.suggestion);
        if (onUpdateSuggestion) {
          onUpdateSuggestion(item.id, res.suggestion);
        }
      }
    } catch (e) {
      console.error('Failed to regenerate suggestion:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
          {item.category || 'Bullet Point Optimization'}
        </span>
        {item.impact && (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {item.impact}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Original */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-2 font-heading">
              <span>Original Bullet</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              "{item.original}"
            </p>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 font-medium">
            ⚠ Lacks measurable impact & action verbs
          </span>
        </div>

        {/* AI Suggestion */}
        <div className="bg-coral-50/50 rounded-2xl p-4 border border-coral-200 flex flex-col justify-between relative">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff5656] uppercase tracking-wider mb-2 font-heading">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>JSR AI Optimized (STAR Method)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed">
              "{currentSuggestion}"
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-coral-200/60">
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all border border-slate-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Regenerating...' : 'Regenerate'}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#ff5656] hover:bg-[#ff4242] transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
