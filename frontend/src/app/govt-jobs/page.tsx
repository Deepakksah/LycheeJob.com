'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { JobMap } from '@/components/JobMap';
import { jobApi, GOVT_JOBS_DATASET } from '@/services/api';
import { Job } from '@/types';
import { getExactCompanyLogoUrl, getBackupGoogleFaviconUrl } from '@/utils/companyLogos';
import {
  Search,
  Bookmark,
  ExternalLink,
  FileText,
  MapPin,
  Clock,
  Briefcase,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Filter,
  Sparkles
} from 'lucide-react';

function GovtOrgLogo({ name, website, logoUrl, className = "w-12 h-12" }: { name: string; website?: string; logoUrl?: string; className?: string }) {
  const primaryUrl = getExactCompanyLogoUrl(name, website, logoUrl);
  const backupUrl = getBackupGoogleFaviconUrl(name, website);
  const [src, setSrc] = useState(primaryUrl);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setSrc(getExactCompanyLogoUrl(name, website, logoUrl));
    setHasFailed(false);
  }, [name, website, logoUrl]);

  if (hasFailed) {
    return (
      <div className={`${className} rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-xl shrink-0 p-1 shadow-2xs`}>
        🏛️
      </div>
    );
  }

  return (
    <div className={`${className} rounded-xl bg-white border border-slate-200/90 flex items-center justify-center shrink-0 p-1.5 shadow-2xs overflow-hidden`}>
      <img
        src={src}
        alt={name}
        className="w-full h-full object-contain"
        onError={() => {
          if (src !== backupUrl) {
            setSrc(backupUrl);
          } else {
            setHasFailed(true);
          }
        }}
      />
    </div>
  );
}

const GOVT_CATEGORIES = [
  { id: 'all', label: 'All Sarkari Jobs', icon: '🏛️' },
  { id: 'delhi', label: '📍 Delhi Govt (DSSSB/DTL/MCD)', icon: '🏛️' },
  { id: 'defense', label: 'ISRO, DRDO & Defense', icon: '🚀' },
  { id: 'banking', label: 'SBI, RBI & PSU Banks', icon: '🏦' },
  { id: 'energy', label: 'Maharatna PSUs (ONGC/BHEL)', icon: '⚡' },
  { id: 'railways', label: 'Railways (RRB) & SSC', icon: '🚆' },
  { id: 'civil', label: 'UPSC & Civil Services', icon: '📚' },
  { id: 'teaching', label: 'KVS & School Teachers', icon: '🎓' },
  { id: 'medical', label: 'AIIMS & Healthcare', icon: '🏥' },
  { id: 'it', label: 'NIC & C-DAC Informatics', icon: '💻' },
  { id: 'state', label: 'State PSCs (UP/Bihar/MH)', icon: '📍' }
];

export default function GovtJobsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [govtJobs, setGovtJobs] = useState<Job[]>(GOVT_JOBS_DATASET);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGovt = async () => {
      setIsLoading(true);
      try {
        const data = await jobApi.getGovtJobs(activeCategory, searchQuery);
        setGovtJobs(data);
      } catch (err) {
        console.error('Failed to fetch govt jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGovt();
  }, [activeCategory, searchQuery]);

  const handleToggleSave = (id: number) => {
    setSavedJobIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 font-sans">
      
      {/* ─── 1. SINGLE UNIFIED SLEEK TOP HEADER ──────────────────────────── */}
      <header className="bg-white border-b border-slate-200/80 px-4 py-2.5 shadow-xs shrink-0 z-30">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Brand Logo & Sarkari Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center text-white font-black text-base shadow-sm group-hover:scale-105 transition">
                LJ
              </div>
              <div className="leading-none">
                <span className="text-base font-black tracking-tight text-slate-900">
                  Lychee<span className="text-rose-600">Job</span>
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black shadow-2xs">
              <span>🏛️</span>
              <span>Sarkari & PSU Portal</span>
              <span className="hidden md:inline text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-extrabold uppercase ml-0.5">
                7th CPC
              </span>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-xl mx-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ISRO, DRDO, SBI PO, ONGC, Level 10, GATE, CSE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition shadow-2xs"
              />
            </div>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            <Link
              href="/"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition"
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Private Jobs</span>
            </Link>

            <Link
              href="/saved"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition"
            >
              <Bookmark className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Saved</span>
              {savedJobIds.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-600 text-white">
                  {savedJobIds.length}
                </span>
              )}
            </Link>

            <Link
              href="/admin"
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin</span>
            </Link>
          </div>

        </div>

        {/* ─── Category Tabs Bar ────────────────────────────────────────── */}
        <div className="max-w-[1920px] mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2 mt-1.5 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Sectors:</span>
          </span>

          {GOVT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition flex items-center gap-1.5 text-xs shadow-2xs ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm font-extrabold ring-1 ring-amber-700'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ─── 2. MAIN SPLIT VIEW (LEFT: SARKARI CARDS | RIGHT: MAP) ────────── */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">

        {/* LEFT COLUMN: SARKARI JOBS LIST */}
        <div className="w-full lg:w-[480px] xl:w-[520px] h-full max-h-full bg-slate-50 border-r border-slate-200/80 flex flex-col shadow-sm shrink-0 min-h-0">
          
          {/* Subheader status */}
          <div className="px-4 py-2.5 bg-white border-b border-slate-200/70 flex items-center justify-between text-xs font-bold shrink-0">
            <span className="flex items-center gap-1.5 text-slate-800">
              <span className="text-amber-600 font-extrabold text-sm">●</span>
              <span>{govtJobs.length} Notifications • 2,15,000+ Active Vacancies</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Official Gazette</span>
            </span>
          </div>

          {/* Scrollable Job Cards List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-job-scrollbar min-h-0">
            {govtJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              const isSaved = savedJobIds.includes(job.id);

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative bg-white flex flex-col gap-2.5 ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md bg-amber-50/10'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {/* Top: Department info + Bookmark */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-3">
                      <GovtOrgLogo name={job.company.name} website={job.company.website} logoUrl={job.company.logoUrl} />
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 leading-snug hover:text-amber-700 transition">
                          {job.title}
                        </h3>
                        <p className="text-xs font-bold text-slate-600 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{job.company.name}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSave(job.id);
                      }}
                      className={`p-1.5 rounded-lg border transition shrink-0 ${
                        isSaved
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-600'
                      }`}
                      title={isSaved ? 'Remove Bookmark' : 'Save Job'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
                    </button>
                  </div>

                  {/* Location & Pay Scale Chips */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{job.city}, {job.state}</span>
                    </span>

                    <span className="font-black text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <span>💰</span>
                      <span>₹{(job.salaryMin! / 100000).toFixed(1)} - ₹{(job.salaryMax! / 100000).toFixed(1)} LPA (7th CPC)</span>
                    </span>
                  </div>

                  {/* Skills / Eligibility Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Brief description snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Footer Dates & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 border-t border-slate-100 text-xs gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-rose-600 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/70 text-[11px]">
                        <Clock className="w-3 h-3 text-rose-600" />
                        <span>Last Date: 20 Days Left</span>
                      </span>

                      {job.interviewMode && (
                        <span className="text-slate-500 font-medium text-[11px] hidden sm:inline">
                          • {job.interviewMode}
                        </span>
                      )}
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {job.originalUrl && (
                        <a
                          href={job.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold transition flex items-center gap-1 border border-slate-200 text-xs shadow-2xs"
                          title="View Official Notification PDF"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-600" />
                          <span>Official PDF</span>
                        </a>
                      )}

                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold transition flex items-center gap-1 shadow-xs text-xs"
                      >
                        <span>Apply Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: FULL-HEIGHT MAP */}
        <div className="flex-1 h-full relative">
          <JobMap
            jobs={govtJobs}
            selectedJob={selectedJob}
            onSelectJob={(j) => setSelectedJob(j)}
          />
        </div>

      </div>
    </div>
  );
}
