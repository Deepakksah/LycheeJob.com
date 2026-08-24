'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Calendar, Bookmark, Sparkles, ExternalLink } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
  isSaved?: boolean;
  onSelect?: (job: Job) => void;
  onToggleSave?: (jobId: number) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSelected = false,
  isSaved = false,
  onSelect,
  onToggleSave
}) => {
  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formatSalaryShort = () => {
    if (!job.salaryMin && !job.salaryMax) return null;
    const minLpa = job.salaryMin ? (job.salaryMin / 100000).toFixed(0) : null;
    const maxLpa = job.salaryMax ? (job.salaryMax / 100000).toFixed(0) : null;
    if (minLpa && maxLpa) return `₹${minLpa}-${maxLpa}L`;
    if (minLpa) return `₹${minLpa}L+`;
    return `₹${maxLpa}L`;
  };

  const getSourceBadgeStyle = (sourceName: string) => {
    const src = sourceName.toLowerCase();
    if (src.includes('linkedin')) return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    if (src.includes('google')) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    if (src.includes('naukri')) return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    if (src.includes('indeed')) return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    if (src.includes('jobhai') || src.includes('apna')) return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    if (src.includes('facebook') || src.includes('meta')) return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    if (src.includes('glassdoor')) return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    if (src.includes('foundit') || src.includes('monster')) return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const citySlug = (job.city || 'india').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const titleSlug = job.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const detailsUrl = `/jobs/${citySlug}/${titleSlug}/${job.id}`;

  const salaryTag = formatSalaryShort();
  const badgeStyle = getSourceBadgeStyle(job.sourceName);

  return (
    <div
      onClick={() => onSelect && onSelect(job)}
      className={`group relative rounded-xl p-2.5 sm:p-3 border transition-all duration-200 cursor-pointer backdrop-blur-md ${
        isSelected
          ? 'bg-gradient-to-r from-indigo-950/90 via-slate-900 to-blue-950/90 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10 scale-[1.01]'
          : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700/80 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between gap-2.5">
        
        {/* Left: Company Logo + Job Name & Vibrant Metadata */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          
          {/* Logo / Initials Badge */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-slate-100 p-0.5 flex items-center justify-center shrink-0 border border-white/20 shadow-sm overflow-hidden group-hover:scale-105 transition duration-200">
            {job.company.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-slate-900 font-extrabold text-[11px]">
                {getCompanyInitials(job.company.name)}
              </span>
            )}
          </div>

          {/* Job Title & Subtitle */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-400 transition truncate leading-tight flex items-center gap-1.5">
              <span>{job.title}</span>
              {isSelected && <Sparkles className="w-3 h-3 text-amber-400 shrink-0 animate-pulse" />}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium truncate mt-0.5">
              <span className="text-slate-200 font-semibold truncate max-w-[110px]">{job.company.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 flex items-center gap-0.5 font-semibold">
                <MapPin className="w-3 h-3" />
                {job.city || 'India'}
              </span>
              <span className="text-slate-600">•</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${badgeStyle}`}>
                {job.sourceName}
              </span>
            </div>
          </div>

        </div>

        {/* Right Action Badges */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {salaryTag && (
            <span className="hidden sm:inline-flex items-center gap-0.5 bg-gradient-to-r from-emerald-950 to-teal-950 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-700/60 shadow-sm">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>{salaryTag}</span>
            </span>
          )}

          {job.interviewDate && (
            <span className="bg-gradient-to-r from-amber-950 to-orange-950 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-700/60 flex items-center gap-1 shadow-sm" title="Walk-in Available">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">Walk-in</span>
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave && onToggleSave(job.id);
            }}
            className={`p-1.5 rounded-lg transition ${
              isSaved
                ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                : 'text-slate-500 hover:text-white hover:bg-slate-800'
            }`}
            title={isSaved ? 'Saved' : 'Save Job'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-400 text-indigo-400' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
