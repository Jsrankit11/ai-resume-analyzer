import React from 'react';

export default function ScoreCard({
  title,
  score = 0,
  maxScore = 100,
  icon: Icon,
  description,
}) {
  const percentage = Math.min(Math.max(score, 0), maxScore);

  let barColor = 'bg-[#ff5656]';
  let badgeBg = 'bg-coral-50 text-[#ff5656] border-coral-200';

  if (percentage >= 85) {
    barColor = 'bg-emerald-500';
    badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (percentage >= 70) {
    barColor = 'bg-[#ff5656]';
    badgeBg = 'bg-coral-50 text-[#ff5656] border-coral-200';
  } else if (percentage >= 55) {
    barColor = 'bg-amber-500';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  } else {
    barColor = 'bg-rose-500';
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-slate-200 shadow-sm hover:border-[#ff5656]/40 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[#ff5656]">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-heading">{title}</h4>
            {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
          </div>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${badgeBg}`}>
          {score} / {maxScore}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-2">
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
