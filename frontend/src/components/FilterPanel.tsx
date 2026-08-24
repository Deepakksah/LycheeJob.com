'use client';

import React from 'react';
import { Filter, X, Calendar, DollarSign, Briefcase, Building2, Clock } from 'lucide-react';
import { JobSearchFilters } from '../types';

interface FilterPanelProps {
  filters: JobSearchFilters;
  onChange: (filters: JobSearchFilters) => void;
  onClear: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const JOB_TYPES = ['FullTime', 'PartTime', 'Contract', 'Internship', 'Freelance'];
const WORK_MODES = ['Remote', 'Hybrid', 'OnSite'];
const SOURCES = [
  'Google Jobs',
  'JobHai',
  'Facebook Jobs',
  'LinkedIn',
  'Naukri',
  'Indeed',
  'Foundit',
  'Apna App',
  'Glassdoor',
  'Internshala',
  'Shine',
  'GovernmentJobs'
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onClear,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const handleJobTypeChange = (type: string) => {
    const current = filters.jobTypes || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onChange({ ...filters, jobTypes: updated });
  };

  const handleWorkModeChange = (mode: string) => {
    const current = filters.workModes || [];
    const updated = current.includes(mode)
      ? current.filter((m) => m !== mode)
      : [...current, mode];
    onChange({ ...filters, workModes: updated });
  };

  const handleSourceChange = (source: string) => {
    const current = filters.sources || [];
    const updated = current.includes(source)
      ? current.filter((s) => s !== source)
      : [...current, source];
    onChange({ ...filters, sources: updated });
  };

  if (!isOpenMobile) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity" 
        onClick={onCloseMobile} 
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-80 sm:w-96 max-w-full bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto h-full shadow-2xl z-10 flex flex-col space-y-6 text-sm text-slate-200 scrollbar-thin">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-white text-lg">
            <Filter className="w-5 h-5 text-blue-400" />
            <span>Advanced Filters</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClear}
              className="text-xs text-blue-400 hover:text-blue-300 transition font-bold uppercase tracking-wider"
            >
              Reset All
            </button>
            <button
              onClick={onCloseMobile}
              className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Job Type */}
        <div>
          <h4 className="font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5 text-xs tracking-wider uppercase">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            Job Type
          </h4>
          <div className="space-y-2">
            {JOB_TYPES.map((t) => {
              const isChecked = (filters.jobTypes || []).includes(t);
              return (
                <label key={t} className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white transition text-xs">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleJobTypeChange(t)}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>{t === 'FullTime' ? 'Full Time' : t === 'PartTime' ? 'Part Time' : t}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Work Mode */}
        <div>
          <h4 className="font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5 text-xs tracking-wider uppercase">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            Work Mode
          </h4>
          <div className="space-y-2">
            {WORK_MODES.map((m) => {
              const isChecked = (filters.workModes || []).includes(m);
              return (
                <label key={m} className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white transition text-xs">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleWorkModeChange(m)}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>{m === 'OnSite' ? 'On-site' : m}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Experience */}
        <div>
          <h4 className="font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5 text-xs tracking-wider uppercase">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Experience Level
          </h4>
          <select
            value={filters.experience || ''}
            onChange={(e) => onChange({ ...filters, experience: e.target.value || undefined })}
            className="w-full bg-slate-950 text-white border border-slate-700 rounded-xl p-2.5 text-xs focus:border-blue-500 focus:outline-none"
          >
            <option value="">Any Experience</option>
            <option value="0-1">0-1 Years (Fresher)</option>
            <option value="1-3">1-3 Years</option>
            <option value="3-5">3-5 Years</option>
            <option value="5-10">5-10 Years</option>
            <option value="10+">10+ Years</option>
          </select>
        </div>

        {/* Minimum Salary Range Slider */}
        <div>
          <h4 className="font-semibold text-slate-300 mb-2.5 flex items-center justify-between text-xs tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
              Min Salary (LPA)
            </span>
            <span className="text-blue-400 font-bold">
              {filters.minSalary ? `₹${(filters.minSalary / 100000).toFixed(0)} LPA+` : 'Any'}
            </span>
          </h4>
          <input
            type="range"
            min="0"
            max="5000000"
            step="100000"
            value={filters.minSalary || 0}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChange({ ...filters, minSalary: val > 0 ? val : undefined });
            }}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>₹0 LPA</span>
            <span>₹25 LPA</span>
            <span>₹50 LPA+</span>
          </div>
        </div>

        {/* Date Posted */}
        <div>
          <h4 className="font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5 text-xs tracking-wider uppercase">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            Date Posted
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Anytime', days: undefined },
              { label: 'Today', days: 1 },
              { label: 'Last 3 Days', days: 3 },
              { label: 'Last 7 Days', days: 7 },
              { label: 'Last 30 Days', days: 30 },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onChange({ ...filters, postedWithinDays: item.days })}
                className={`px-2.5 py-2 rounded-xl text-xs font-medium text-left transition ${
                  filters.postedWithinDays === item.days
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div>
          <h4 className="font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5 text-xs tracking-wider uppercase">
            Job Sources
          </h4>
          <div className="space-y-2">
            {SOURCES.map((s) => {
              const isChecked = (filters.sources || []).includes(s);
              return (
                <label key={s} className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white transition text-xs">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleSourceChange(s)}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>{s}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Interview Availability */}
        <div>
          <label className="flex items-center gap-2.5 cursor-pointer text-slate-200 hover:text-white font-medium transition text-xs">
            <input
              type="checkbox"
              checked={!!filters.hasInterviewDate}
              onChange={(e) => onChange({ ...filters, hasInterviewDate: e.target.checked ? true : undefined })}
              className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span>📅 Interview / Walk-in Available</span>
          </label>
        </div>

        {/* Apply Filters Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onCloseMobile}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
};
