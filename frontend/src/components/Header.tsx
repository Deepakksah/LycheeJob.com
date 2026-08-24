'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Search, Navigation, Crosshair, Bookmark, ShieldCheck, RefreshCw, SlidersHorizontal, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface UnifiedHeaderProps {
  savedCount?: number;
  initialKeyword?: string;
  initialCity?: string;
  initialRadius?: number;
  isSidebarOpen?: boolean;
  totalJobs?: number;
  onSearch?: (keyword: string, city: string, userLat?: number, userLng?: number, radiusKm?: number) => void;
  onRefreshJobs?: () => void;
  onOpenFilters?: () => void;
  onToggleSidebar?: () => void;
}

const POPULAR_CITIES = [
  'Delhi', 'Noida', 'Gurgaon', 'Mumbai', 'Bangalore', 'Hyderabad',
  'Pune', 'Chennai', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Chandigarh',
  'Indore', 'Kochi', 'Lucknow', 'Surat', 'Coimbatore', 'Bhopal',
  'Nagpur', 'Dehradun', 'Visakhapatnam', 'Patna'
];

export const Header: React.FC<UnifiedHeaderProps> = ({
  savedCount = 0,
  initialKeyword = '',
  initialCity = 'Delhi',
  initialRadius = 25,
  isSidebarOpen = true,
  totalJobs = 0,
  onSearch,
  onRefreshJobs,
  onOpenFilters,
  onToggleSidebar
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [city, setCity] = useState(initialCity);
  const [radiusKm, setRadiusKm] = useState(initialRadius);
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat?: number; lng?: number }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let cleanKeyword = keyword.trim();
    let cleanCity = city.trim();

    if (!cleanCity && cleanKeyword) {
      for (const popularCity of POPULAR_CITIES) {
        const regex = new RegExp(`\\b${popularCity}\\b`, 'i');
        if (regex.test(cleanKeyword)) {
          cleanCity = popularCity;
          cleanKeyword = cleanKeyword.replace(regex, '').trim();
          break;
        }
      }
    }

    if (onSearch) {
      onSearch(cleanKeyword, cleanCity, userCoords.lat, userCoords.lng, radiusKm);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });
        if (onSearch) {
          onSearch(keyword, city, lat, lng, radiusKm);
        }
      },
      (err) => {
        setIsLocating(false);
        alert('Could not retrieve location: ' + err.message);
      }
    );
  };

  return (
    <header className="relative bg-slate-950/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-xl shadow-2xl">
      
      {/* Vibrant Top Rainbow Glow Bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-500 opacity-90" />

      <div className="max-w-[1920px] mx-auto px-3 py-2 space-y-2">
        
        {/* ROW 1: Brand Logo + Search Controls + Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition duration-200">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-1">
                MapJob<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Hub</span>
              </span>
            </div>
          </Link>

          {/* Inline Search Bar */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-4xl flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/80 shadow-inner">
            
            {/* Keyword Input */}
            <div className="flex-1 relative min-w-[130px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skill, company..."
                className="w-full bg-slate-950/80 text-white placeholder-slate-400 text-xs pl-8 pr-2 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* City Input */}
            <div className="w-32 sm:w-44 relative">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (Delhi, etc.)"
                className="w-full bg-slate-950/80 text-white placeholder-slate-400 text-xs pl-8 pr-2 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Radius Dropdown */}
            <div className="w-24 hidden md:block">
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full bg-slate-950/80 text-white text-xs px-2 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
              </select>
            </div>

            {/* Locate Me */}
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              title="Locate me"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* Search Submit */}
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-lg shadow-indigo-600/30 transition flex items-center gap-1 shrink-0"
            >
              <Navigation className="w-3 h-3" />
              <span>Search</span>
            </button>
          </form>

          {/* Action Links & Controls */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            
            {onOpenFilters && (
              <button
                onClick={onOpenFilters}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold flex items-center gap-1 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            )}

            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold transition"
              >
                {isSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5 text-cyan-400" /> : <PanelLeftOpen className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{isSidebarOpen ? 'Hide List' : 'Show List'}</span>
              </button>
            )}

            {onRefreshJobs && (
              <button
                onClick={onRefreshJobs}
                className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-medium transition"
                title="Sync Data"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sync</span>
              </button>
            )}

            <Link
              href="/saved"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-medium transition"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                  {savedCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-medium transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin</span>
            </Link>
          </div>

        </div>

        {/* ROW 2: Popular City Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] pt-1 border-t border-slate-900">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">Popular Cities:</span>
          {POPULAR_CITIES.map((c) => {
            const isActive = city.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCity(c);
                  if (onSearch) {
                    onSearch(keyword, c, userCoords.lat, userCoords.lng, radiusKm);
                  }
                }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition whitespace-nowrap flex items-center gap-1 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white font-bold shadow-md shadow-indigo-500/30 ring-1 ring-white/30 scale-[1.03]'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <span>📍</span>
                <span>{c}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
