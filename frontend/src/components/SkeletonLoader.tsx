import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 animate-pulse space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-700 rounded-xl" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-700 rounded w-2/3" />
              <div className="h-3 bg-slate-700 rounded w-1/3" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-2">
            <div className="h-6 bg-slate-700 rounded" />
            <div className="h-6 bg-slate-700 rounded" />
            <div className="h-6 bg-slate-700 rounded" />
            <div className="h-6 bg-slate-700 rounded" />
          </div>
          <div className="h-10 bg-slate-700/50 rounded-xl" />
        </div>
      ))}
    </div>
  );
};
