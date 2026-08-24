'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { FilterPanel } from '../components/FilterPanel';
import { JobList } from '../components/JobList';
import dynamic from 'next/dynamic';
import { jobApi } from '../services/api';
import { Job, JobSearchFilters, Pagination } from '../types';
import { Map, ListFilter, PanelLeftOpen } from 'lucide-react';

const JobMap = dynamic(() => import('../components/JobMap').then((mod) => mod.JobMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-semibold animate-pulse">
      Loading Interactive ArcGIS Map...
    </div>
  )
});

export default function AppLayoutPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  
  // Layout states
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('map');

  const [filters, setFilters] = useState<JobSearchFilters>({
    keyword: '',
    city: 'Delhi',
    page: 1,
    pageSize: 25,
    sortBy: 'relevance'
  });

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 1
  });

  const fetchJobs = useCallback(async (currentFilters: JobSearchFilters) => {
    setIsLoading(true);
    try {
      const res = await jobApi.searchJobs(currentFilters);
      if (res.success) {
        setJobs(res.data);
        setTotalJobs(res.pagination.total);
        setPagination(res.pagination);
        if (res.data.length > 0 && !selectedJob) {
          setSelectedJob(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSavedJobs = async () => {
    try {
      const saved = await jobApi.getSavedJobs('default-user');
      setSavedJobIds(saved.map((j) => j.id));
    } catch (err) {
      console.error('Failed to load saved jobs', err);
    }
  };

  useEffect(() => {
    fetchJobs(filters);
    loadSavedJobs();
  }, [filters, fetchJobs]);

  const handleSearch = (
    keyword: string,
    city: string,
    userLat?: number,
    userLng?: number,
    radiusKm?: number
  ) => {
    setFilters((prev) => ({
      ...prev,
      keyword,
      city,
      userLat,
      userLng,
      radiusKm,
      page: 1
    }));
  };

  const handleFilterChange = (newFilters: JobSearchFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      keyword: '',
      city: '',
      page: 1,
      pageSize: 25,
      sortBy: 'relevance'
    });
  };

  const handleToggleSaveJob = async (jobId: number) => {
    try {
      const isSaved = await jobApi.toggleSaveJob(jobId, 'default-user');
      if (isSaved) {
        setSavedJobIds((prev) => [...prev, jobId]);
      } else {
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
      }
    } catch (err) {
      console.error('Failed to toggle save job:', err);
    }
  };

  const handleSyncData = async () => {
    setIsLoading(true);
    try {
      await jobApi.syncSource(0);
      fetchJobs(filters);
    } catch (err) {
      console.error('Failed to trigger manual sync:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      
      {/* 1. SINGLE UNIFIED COMPACT TOP HEADER */}
      <Header
        savedCount={savedJobIds.length}
        initialKeyword={filters.keyword}
        initialCity={filters.city}
        initialRadius={filters.radiusKm}
        isSidebarOpen={isSidebarOpen}
        totalJobs={totalJobs}
        onSearch={handleSearch}
        onRefreshJobs={handleSyncData}
        onOpenFilters={() => setIsFilterPanelOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* 2. MAIN LARGE AREA MAP & JOB LIST CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT PANEL: JOB LIST CARDS */}
        <div
          className={`h-full bg-slate-900/90 border-r border-slate-800 transition-all duration-300 flex flex-col ${
            isSidebarOpen ? 'w-full lg:w-[380px] shrink-0' : 'w-0 overflow-hidden border-none'
          } ${mobileView === 'list' ? 'block' : 'hidden lg:block'}`}
        >
          <div className="p-3 flex-1 overflow-y-auto scrollbar-thin">
            <JobList
              jobs={jobs}
              totalJobs={totalJobs}
              isLoading={isLoading}
              selectedJob={selectedJob}
              savedJobIds={savedJobIds}
              pagination={pagination}
              sortBy={filters.sortBy || 'relevance'}
              onSelectJob={(j) => setSelectedJob(j)}
              onToggleSaveJob={handleToggleSaveJob}
              onSortChange={(s) => setFilters((prev) => ({ ...prev, sortBy: s, page: 1 }))}
              onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
            />
          </div>
        </div>

        {/* RIGHT PANEL: LARGE AREA INTERACTIVE ARCGIS MAP */}
        <div
          className={`flex-1 h-full relative ${
            mobileView === 'map' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Floating Expand Sidebar Button when collapsed */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-4 left-4 z-20 bg-slate-900/90 hover:bg-blue-600 text-white p-2.5 rounded-xl shadow-2xl border border-slate-700 hidden lg:flex items-center gap-2 text-xs font-bold transition backdrop-blur-md"
              title="Expand Job List"
            >
              <PanelLeftOpen className="w-4 h-4 text-blue-400" />
              <span>Show Job Cards ({totalJobs})</span>
            </button>
          )}

          {/* Floating Mobile View Switcher */}
          <div className="absolute top-4 left-4 z-20 flex lg:hidden items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md text-xs font-bold">
            <button
              onClick={() => setMobileView('list')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1 transition ${
                mobileView === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List ({totalJobs})</span>
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1 transition ${
                mobileView === 'map' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>

          <JobMap
            jobs={jobs}
            selectedJob={selectedJob}
            onSelectJob={(j) => setSelectedJob(j)}
            onBoundsChange={(b) =>
              setFilters((prev) => ({
                ...prev,
                north: b.north,
                south: b.south,
                east: b.east,
                west: b.west,
                page: 1
              }))
            }
          />
        </div>

      </div>

      {/* SLIDE-OVER ADVANCED FILTERS MODAL DRAWER */}
      <FilterPanel
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        isOpenMobile={isFilterPanelOpen}
        onCloseMobile={() => setIsFilterPanelOpen(false)}
      />

    </div>
  );
}
