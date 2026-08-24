'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Briefcase, Phone, Mail, Calendar, ExternalLink, X } from 'lucide-react';
import { Job } from '../types';

interface JobInfoWindowProps {
  job: Job;
  allCompanyJobs?: Job[];
  onClose: () => void;
  onSelectJob?: (job: Job) => void;
}

export const JobInfoWindow: React.FC<JobInfoWindowProps> = ({
  job,
  allCompanyJobs = [],
  onClose,
  onSelectJob
}) => {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

  const citySlug = (job.city || 'india').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const titleSlug = job.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const detailsUrl = `/jobs/${citySlug}/${titleSlug}/${job.id}`;

  return (
    <div className="w-80 max-w-full bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border border-rose-200 relative text-xs z-50 font-sans">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1 rounded-full hover:bg-rose-50 transition"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header with Company Logo */}
      <div className="flex items-center gap-3 pr-6 pb-3 border-b border-slate-100">
        <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden shadow-sm">
          {job.company.logoUrl ? (
            <img
              src={job.company.logoUrl}
              alt={job.company.name}
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          ) : (
            <span className="text-rose-600 font-extrabold text-xs">
              {getInitials(job.company.name)}
            </span>
          )}
        </div>
        <div>
          <h4 className="font-bold text-slate-600 text-xs">{job.company.name}</h4>
          <h3 className="font-extrabold text-rose-600 text-sm leading-snug">{job.title}</h3>
        </div>
      </div>

      {/* Multiple jobs from same company list */}
      {allCompanyJobs.length > 1 && (
        <div className="my-2 p-2 bg-rose-50/60 rounded-xl border border-rose-200/80">
          <div className="text-[11px] font-bold text-rose-700 mb-1">
            🏢 {allCompanyJobs.length} Jobs Available at this location:
          </div>
          <div className="max-h-24 overflow-y-auto space-y-1 scrollbar-thin">
            {allCompanyJobs.map((j) => (
              <button
                key={j.id}
                onClick={() => onSelectJob && onSelectJob(j)}
                className={`w-full text-left px-2 py-1 rounded text-[11px] transition ${
                  j.id === job.id
                    ? 'bg-rose-600 text-white font-bold'
                    : 'text-slate-700 hover:bg-rose-100 hover:text-rose-900'
                }`}
              >
                • {j.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Badges Grid */}
      <div className="my-3 space-y-1.5 text-slate-700">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="truncate font-semibold">{job.address || job.city || 'India'}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-extrabold text-emerald-600">
            {job.salaryMin && job.salaryMax
              ? `₹${(job.salaryMin / 100000).toFixed(1)} - ₹${(job.salaryMax / 100000).toFixed(1)} LPA`
              : 'Salary Not Disclosed'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-medium">{job.workMode === 'OnSite' ? 'On-site' : job.workMode} • {job.experienceMin || 0}-{job.experienceMax || 5} Yrs</span>
        </div>
      </div>

      {/* Legitimate Contact Details if available */}
      {(job.contactPhone || job.contactEmail || job.contactName) && (
        <div className="my-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
          <div className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">Contact Recruiter</div>
          {job.contactName && <div className="text-slate-900 font-bold">{job.contactName}</div>}
          {job.contactPhone && (
            <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
              <Phone className="w-3 h-3" />
              <a href={`tel:${job.contactPhone}`} className="hover:underline">{job.contactPhone}</a>
            </div>
          )}
          {job.contactEmail && (
            <div className="flex items-center gap-1.5 text-rose-600 font-semibold truncate">
              <Mail className="w-3 h-3 shrink-0" />
              <a href={`mailto:${job.contactEmail}`} className="hover:underline truncate">{job.contactEmail}</a>
            </div>
          )}
        </div>
      )}

      {/* Legitimate Interview Info if available */}
      {job.interviewDate && (
        <div className="my-2.5 p-2 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 space-y-1">
          <div className="flex items-center gap-1 font-bold text-rose-700">
            <Calendar className="w-3.5 h-3.5 text-rose-600" />
            <span>Interview Date</span>
          </div>
          <div className="font-semibold">{new Date(job.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          {job.interviewStartTime && <div className="text-[11px] text-slate-600">{job.interviewStartTime} {job.interviewEndTime && `- ${job.interviewEndTime}`}</div>}
          {job.interviewLocation && <div className="text-[11px] text-rose-800">📍 {job.interviewLocation}</div>}
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          href={detailsUrl}
          className="flex-1 py-2 px-3 text-center bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold border border-rose-200 transition"
        >
          View Job Details
        </Link>
        
        <a
          href={job.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-3 text-center bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-1 shadow-md shadow-rose-600/25"
        >
          <span>Apply Now</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
};
