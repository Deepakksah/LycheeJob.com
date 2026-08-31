'use client';

import React from 'react';
import { ArrowUpDown, Briefcase, SlidersHorizontal } from 'lucide-react';
import { Job, Pagination as PaginationType } from '../types';
import { JobCard } from './JobCard';
import { Pagination } from './Pagination';
import { SkeletonLoader } from './SkeletonLoader';

interface JobListProps {
  jobs: Job[];
  totalJobs: number;
  isLoading: boolean;
  selectedJob?: Job | null;
  savedJobIds: number[];
  pagination: PaginationType;
  sortBy: string;
  onSelectJob: (job: Job) => void;
  onToggleSaveJob: (jobId: number) => void;
  onSortChange: (sort: string) => void;
  onPageChange: (page: number) => void;
  onOpenMobileFilters?: () => void;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  totalJobs,
  isLoading,
  selectedJob,
  savedJobIds,
  pagination,
  sortBy,
  onSelectJob,
  onToggleSaveJob,
  onSortChange,
  onPageChange,
  onOpenMobileFilters
}) => {
  return (
    <div className="flex flex-col h-full max-h-full min-h-0 space-y-2 overflow-hidden">
      
      {/* Top Header: Total Count + Mobile Filter Toggle + Sorting Dropdown */}
      <div className="shrink-0 flex items-center justify-between pb-2 border-b border-rose-100 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold text-slate-900">
            <span className="text-rose-600 font-black">{totalJobs}</span> Jobs
          </span>
          <span className="text-xs text-slate-500 font-semibold">Found</span>
        </div>

        <div className="flex items-center gap-2">
          
          {/* Mobile Filters Toggle */}
          {onOpenMobileFilters && (
            <button
              onClick={onOpenMobileFilters}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:text-rose-600 border border-slate-200 text-xs font-semibold shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
              <span>Filters</span>
            </button>
          )}

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="relevance" className="bg-white text-slate-900">Sort: Relevance</option>
              <option value="newest" className="bg-white text-slate-900">Sort: Newest</option>
              <option value="oldest" className="bg-white text-slate-900">Sort: Oldest</option>
              <option value="salary_high" className="bg-white text-slate-900">Salary: High to Low</option>
              <option value="salary_low" className="bg-white text-slate-900">Salary: Low to High</option>
              <option value="distance" className="bg-white text-slate-900">Distance from Me</option>
              <option value="company" className="bg-white text-slate-900">Company Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="flex-1 overflow-y-auto min-h-0">
          <SkeletonLoader />
        </div>
      ) : jobs.length === 0 ? (
        
        /* Empty State */
        <div className="bg-rose-50/60 rounded-2xl p-6 border border-rose-100 text-center space-y-3 my-auto">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No matching jobs found</h3>
          <div className="text-xs text-slate-500 max-w-xs mx-auto space-y-1 text-left">
            <p className="font-semibold text-slate-700 text-center mb-1">Try tweaking your search:</p>
            <p>• Changing your keyword search term</p>
            <p>• Selecting another city (e.g. Delhi, Noida, Gurgaon)</p>
            <p>• Removing or resetting active filters</p>
            <p>• Increasing search radius</p>
          </div>
        </div>
      ) : (
        
        /* Job Cards Scrollable List with Always-Visible Scrollbar */
        <div className="flex-1 min-h-0 space-y-3 overflow-y-scroll overflow-x-hidden pr-2 custom-job-scrollbar">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedJob?.id === job.id}
              isSaved={savedJobIds.includes(job.id)}
              onSelect={onSelectJob}
              onToggleSave={onToggleSaveJob}
            />
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {!isLoading && jobs.length > 0 && (
        <div className="shrink-0 pt-1 border-t border-rose-100">
          <Pagination pagination={pagination} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};
