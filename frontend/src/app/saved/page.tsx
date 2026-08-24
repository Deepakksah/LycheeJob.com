'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { JobCard } from '@/components/JobCard';
import { jobApi } from '@/services/api';
import { Job } from '@/types';
import { Bookmark, ArrowLeft, Briefcase } from 'lucide-react';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSavedJobs = async () => {
    setIsLoading(true);
    try {
      const data = await jobApi.getSavedJobs('default-user');
      setSavedJobs(data);
    } catch (err) {
      console.error('Failed to load saved jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const handleToggleSaveJob = async (jobId: number) => {
    try {
      await jobApi.toggleSaveJob(jobId, 'default-user');
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      console.error('Failed to unsave job:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header savedCount={savedJobs.length} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Job Search</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-blue-400 fill-blue-400" />
              <span>Your Saved & Bookmarked Jobs</span>
            </h1>
          </div>
          <span className="text-xs text-slate-400 font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            {savedJobs.length} Bookmarks
          </span>
        </div>

        {isLoading ? (
          <div className="text-center text-slate-400 py-12 text-sm">Loading saved jobs...</div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800 text-center space-y-3">
            <Briefcase className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No saved jobs yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click the bookmark icon on any job card on the map or job list to save jobs for later review.
            </p>
            <Link
              href="/"
              className="inline-block mt-3 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition"
            >
              Explore Jobs on Map
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={true}
                onToggleSave={handleToggleSaveJob}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
