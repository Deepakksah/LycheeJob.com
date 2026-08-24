'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { jobApi } from '../../services/api';
import { AdminStats, JobSource, SyncLog } from '../../types';
import { ShieldCheck, RefreshCw, Briefcase, Building2, AlertTriangle, CheckCircle2, XCircle, ArrowLeft, ToggleLeft, ToggleRight, Layers, Database } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [sources, setSources] = useState<JobSource[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, sourcesData, logsData] = await Promise.all([
        jobApi.getAdminStats(),
        jobApi.getSources(),
        jobApi.getSyncLogs(30)
      ]);
      setStats(statsData);
      setSources(sourcesData);
      setSyncLogs(logsData);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSource = async (id: number, currentStatus: boolean) => {
    try {
      await jobApi.toggleSource(id, !currentStatus);
      loadData();
    } catch (err) {
      console.error('Failed to toggle source status:', err);
    }
  };

  const handleSyncSource = async (id: number = 0) => {
    setIsSyncing(true);
    try {
      await jobApi.syncSource(id);
      loadData();
    } catch (err) {
      console.error('Manual sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Job Search</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>Admin Management Dashboard</span>
            </h1>
            <p className="text-xs text-slate-400">
              Monitor multi-source job synchronization, EF Core database deduplication, and system status.
            </p>
          </div>

          <button
            onClick={() => handleSyncSource(0)}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing All...' : 'Sync All Sources Now'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-xs font-medium">Total Jobs</div>
              <div className="text-2xl font-extrabold text-white">{stats.totalJobs}</div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-xs font-medium">Active Listings</div>
              <div className="text-2xl font-extrabold text-blue-400">{stats.activeJobs}</div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-xs font-medium">New Today</div>
              <div className="text-2xl font-extrabold text-emerald-400">+{stats.newJobsToday}</div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-xs font-medium">Companies</div>
              <div className="text-2xl font-extrabold text-purple-400">{stats.totalCompanies}</div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-xs font-medium">Job Sources</div>
              <div className="text-2xl font-extrabold text-amber-400">{stats.totalSources}</div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-slate-400 text-xs font-medium">Failed Syncs</div>
              <div className="text-2xl font-extrabold text-rose-400">{stats.failedSyncs}</div>
            </div>
          </div>
        )}

        {/* Analytics Breakdown Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Jobs by City */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-400" />
                Jobs by City
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin text-xs">
                {Object.entries(stats.jobsByCity).map(([city, count]) => (
                  <div key={city} className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-200 font-medium">📍 {city}</span>
                    <span className="font-extrabold text-blue-400 bg-blue-950 px-2 py-0.5 rounded">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs by Source */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                Jobs by Aggregated Source
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin text-xs">
                {Object.entries(stats.jobsBySource).map(([src, count]) => (
                  <div key={src} className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-200 font-medium">{src}</span>
                    <span className="font-extrabold text-purple-400 bg-purple-950 px-2 py-0.5 rounded">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs by Work Mode */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                Jobs by Work Mode
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin text-xs">
                {Object.entries(stats.jobsByWorkMode).map(([mode, count]) => (
                  <div key={mode} className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-200 font-medium">{mode === 'OnSite' ? 'On-site' : mode}</span>
                    <span className="font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">{count}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Source Management Section */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Job Source Provider Architecture</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {sources.map((src) => (
              <div key={src.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{src.name}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Type: {src.sourceType}</div>
                  <div className="text-slate-400 text-[11px]">
                    Last Sync: {src.lastSyncAt ? new Date(src.lastSyncAt).toLocaleTimeString() : 'Never'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSource(src.id, src.isActive)}
                    className={`p-1.5 rounded-xl transition ${
                      src.isActive ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-500 bg-slate-800'
                    }`}
                    title={src.isActive ? 'Disable Source' : 'Enable Source'}
                  >
                    {src.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={() => handleSyncSource(src.id)}
                    disabled={isSyncing}
                    className="p-2 rounded-xl bg-blue-600/30 text-blue-400 hover:bg-blue-600 hover:text-white transition"
                    title="Sync Now"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Sync Logs Table */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" />
            <span>Background Sync History & Audit Logs</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Source</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Started At</th>
                  <th className="p-3">Completed At</th>
                  <th className="p-3">Fetched</th>
                  <th className="p-3">Inserted</th>
                  <th className="p-3">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{log.source?.name || `Source #${log.sourceId}`}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        log.status === 'Success'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {log.status === 'Success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(log.startedAt).toLocaleString()}</td>
                    <td className="p-3">{log.completedAt ? new Date(log.completedAt).toLocaleString() : '-'}</td>
                    <td className="p-3 font-mono font-bold">{log.jobsFetched}</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{log.jobsInserted}</td>
                    <td className="p-3 font-mono text-blue-400 font-bold">{log.jobsUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
