import React from 'react';

export default function LoadingSkeleton({ type = 'card' }) {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800/60 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-72 bg-slate-900/80 rounded-2xl border border-slate-800" />
          <div className="lg:col-span-2 h-72 bg-slate-900/80 rounded-2xl border border-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-slate-800 rounded-lg w-1/4" />
      <div className="h-24 bg-slate-900 rounded-2xl border border-slate-800" />
      <div className="h-24 bg-slate-900 rounded-2xl border border-slate-800" />
    </div>
  );
}
