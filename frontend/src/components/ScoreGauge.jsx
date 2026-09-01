import React from 'react';

export default function ScoreGauge({
  score = 0,
  maxScore = 100,
  size = 180,
  strokeWidth = 14,
  label = 'Overall Score',
  sublabel = 'out of 100',
  showGrade = true,
}) {
  const normalizedScore = Math.min(Math.max(score, 0), maxScore);
  const percentage = (normalizedScore / maxScore) * 100;
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color scheme based on score
  let strokeColor = '#10b981'; // green (>=80)
  let grade = 'Excellent';
  let gradeColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';

  if (normalizedScore < 60) {
    strokeColor = '#ef4444'; // red
    grade = 'Needs Work';
    gradeColor = 'text-rose-600 bg-rose-50 border-rose-200';
  } else if (normalizedScore < 75) {
    strokeColor = '#f59e0b'; // amber
    grade = 'Good';
    gradeColor = 'text-amber-600 bg-amber-50 border-amber-200';
  } else if (normalizedScore < 88) {
    strokeColor = '#ff5656'; // coral / brand
    grade = 'Very Good';
    gradeColor = 'text-[#ff5656] bg-coral-50 border-coral-200';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center transition-all duration-1000 ease-out"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center select-none">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            {normalizedScore}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {sublabel}
          </span>
          {showGrade && (
            <span className={`text-[11px] font-bold mt-1 px-2 py-0.5 rounded-full border ${gradeColor}`}>
              {grade}
            </span>
          )}
        </div>
      </div>

      {label && (
        <span className="text-sm font-bold text-slate-800 mt-2 text-center font-heading">
          {label}
        </span>
      )}
    </div>
  );
}
