'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Calendar, Bookmark, Sparkles, ExternalLink } from 'lucide-react';
import { Job } from '../types';
import { getExactCompanyLogoUrl, getBackupGoogleFaviconUrl } from '../utils/companyLogos';

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
  const [imgSrc, setImgSrc] = useState<string>(
    getExactCompanyLogoUrl(job.company.name, job.company.website, job.company.logoUrl)
  );
  const [imgFailed, setImgFailed] = useState<boolean>(false);

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
    if (src.includes('linkedin')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (src.includes('google')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (src.includes('naukri')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (src.includes('indeed')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (src.includes('jobhai') || src.includes('apna')) return 'bg-amber-50 text-amber-800 border-amber-200';
    if (src.includes('facebook') || src.includes('meta')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (src.includes('glassdoor')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (src.includes('foundit') || src.includes('monster')) return 'bg-pink-50 text-pink-700 border-pink-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const handleImgError = () => {
    const backup = getBackupGoogleFaviconUrl(job.company.name, job.company.website);
    if (imgSrc !== backup) {
      setImgSrc(backup);
    } else {
      setImgFailed(true);
    }
  };

  const salaryTag = formatSalaryShort();
  const badgeStyle = getSourceBadgeStyle(job.sourceName);

  return (
    <div
      onClick={() => onSelect && onSelect(job)}
      className={`group relative rounded-xl p-2.5 sm:p-3 border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-gradient-to-r from-rose-50/90 via-white to-pink-50/90 border-rose-500 ring-2 ring-rose-500/30 shadow-md scale-[1.01]'
          : 'bg-white border-slate-200/90 hover:border-rose-300 hover:bg-rose-50/40 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between gap-2.5">
        
        {/* Left: Company Logo + Job Name & Vibrant Metadata */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          
          {/* Logo / Initials Badge */}
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 border border-slate-200 shadow-sm overflow-hidden group-hover:scale-105 transition duration-200">
            {!imgFailed && imgSrc ? (
              <img
                src={imgSrc}
                alt={job.company.name}
                className="w-full h-full object-contain"
                onError={handleImgError}
              />
            ) : (
              <span className="text-rose-600 font-extrabold text-[11px]">
                {getCompanyInitials(job.company.name)}
              </span>
            )}
          </div>

          {/* Job Title & Subtitle */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-600 transition truncate leading-tight flex items-center gap-1.5">
              <span>{job.title}</span>
              {isSelected && <Sparkles className="w-3 h-3 text-rose-500 shrink-0 animate-pulse" />}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium truncate mt-0.5">
              <span className="text-slate-900 font-bold truncate max-w-[110px]">{job.company.name}</span>
              <span className="text-slate-400">•</span>
              <span className="text-rose-600 flex items-center gap-0.5 font-bold">
                <MapPin className="w-3 h-3" />
                {job.city || 'India'}
              </span>
              <span className="text-slate-400">•</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${badgeStyle}`}>
                {job.sourceName}
              </span>
            </div>
          </div>

        </div>

        {/* Right Action Badges */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {salaryTag && (
            <span className="hidden sm:inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-200 shadow-xs">
              <DollarSign className="w-3 h-3 text-emerald-600" />
              <span>{salaryTag}</span>
            </span>
          )}

          {job.interviewDate && (
            <span className="bg-rose-50 text-rose-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-rose-200 flex items-center gap-1 shadow-xs" title="Walk-in Available">
              <Calendar className="w-3 h-3 text-rose-600" />
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
                ? 'bg-rose-100 text-rose-600 border border-rose-300'
                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
            }`}
            title={isSaved ? 'Saved' : 'Save Job'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
