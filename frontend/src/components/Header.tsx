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
    <header className="relative bg-white/95 border-b border-rose-100 sticky top-0 z-40 backdrop-blur-xl shadow-md">
      
      {/* Lychee Crimson Rainbow Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 opacity-95" />

      <div className="max-w-[1920px] mx-auto px-3 py-2 space-y-2">
        
        {/* ROW 1: Lychee Logo + Light Search Controls + Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Lychee Brand Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-105 transition duration-200">
              <MapPin className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-black tracking-tight flex items-center">
                <span className="text-rose-600">Lychee</span>
                <span className="text-slate-900 font-extrabold">Job</span>
                <span className="text-rose-500 text-xs font-bold font-mono">.com</span>
              </span>
            </div>
          </Link>

          {/* Inline Search Bar */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-4xl flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-rose-200/80 shadow-inner">
            
            {/* Keyword Input */}
            <div className="flex-1 relative min-w-[130px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skill, company..."
                className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs pl-8 pr-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
              />
            </div>

            {/* City Input */}
            <div className="w-32 sm:w-44 relative">
              <MapPin className="w-3.5 h-3.5 text-rose-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (Delhi, etc.)"
                className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs pl-8 pr-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
              />
            </div>

            {/* Radius Dropdown */}
            <div className="w-24 hidden md:block">
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full bg-white text-slate-800 text-xs px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
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
              className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 transition"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-rose-500' : ''}`} />
            </button>

            {/* Search Submit */}
            <button
              type="submit"
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg shadow-md shadow-rose-600/25 transition flex items-center gap-1 shrink-0"
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
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-700 border border-slate-200 font-semibold flex items-center gap-1 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            )}

            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-700 border border-slate-200 font-semibold transition"
              >
                {isSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5 text-rose-600" /> : <PanelLeftOpen className="w-3.5 h-3.5 text-rose-600" />}
                <span>{isSidebarOpen ? 'Hide List' : 'Show List'}</span>
              </button>
            )}

            {onRefreshJobs && (
              <button
                onClick={onRefreshJobs}
                className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-700 border border-slate-200 font-medium transition"
                title="Sync Data"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sync</span>
              </button>
            )}

            <Link
              href="/saved"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-700 border border-slate-200 font-medium transition"
            >
              <Bookmark className="w-3.5 h-3.5 text-rose-600" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-600 text-white shadow-sm">
                  {savedCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-700 border border-slate-200 font-medium transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin</span>
            </Link>
          </div>

        </div>

        {/* ROW 2: Popular City Quick Filter Chips - Lychee Crimson Theme */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] pt-1 border-t border-slate-100">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">Popular Cities:</span>
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
                    ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-extrabold shadow-md shadow-rose-500/30 scale-[1.03]'
                    : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 border border-slate-200/80'
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
