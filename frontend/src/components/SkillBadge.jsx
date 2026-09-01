import React from 'react';
import { Check, X } from 'lucide-react';

export default function SkillBadge({
  skill,
  category = 'general',
  isMissing = false,
  isMatching = false,
}) {
  if (isMatching) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
        {skill}
      </span>
    );
  }

  if (isMissing) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-sm">
        <X className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />
        {skill}
      </span>
    );
  }

  const cat = (category || '').toLowerCase();
  let colorStyle = 'bg-slate-50 text-slate-700 border-slate-200';

  if (cat.includes('prog') || cat.includes('lang')) {
    colorStyle = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (cat.includes('front')) {
    colorStyle = 'bg-cyan-50 text-cyan-800 border-cyan-200';
  } else if (cat.includes('back')) {
    colorStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (cat.includes('data')) {
    colorStyle = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (cat.includes('cloud') || cat.includes('devops')) {
    colorStyle = 'bg-purple-50 text-purple-800 border-purple-200';
  } else if (cat.includes('soft')) {
    colorStyle = 'bg-pink-50 text-pink-800 border-pink-200';
  } else {
    colorStyle = 'bg-coral-50 text-coral-800 border-coral-200';
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold border ${colorStyle} transition-transform hover:scale-105 select-none`}
    >
      {skill}
    </span>
  );
}
