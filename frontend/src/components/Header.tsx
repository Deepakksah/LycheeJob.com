'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Search, Navigation, Crosshair, Bookmark, ShieldCheck, RefreshCw, SlidersHorizontal, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface UnifiedHeaderProps {
  savedCount?: number;
  initialKeyword?: string;
  initialCity?: string;
  initialRadius?: number;
  selectedCities?: string[];
  isSidebarOpen?: boolean;
  totalJobs?: number;
  onSearch?: (keyword: string, city: string, userLat?: number, userLng?: number, radiusKm?: number) => void;
  onToggleCity?: (city: string) => void;
  onClearCities?: () => void;
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
  initialCity = '',
  initialRadius = 25,
  selectedCities = [],
  isSidebarOpen = true,
  totalJobs = 0,
  onSearch,
  onToggleCity,
  onClearCities,
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
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 py-2 flex flex-col gap-1.5">

        {/* ROW 1: Logo + Unified Search Bar + Actions */}
        <div className="flex items-center justify-between gap-2 lg:gap-4">

          {/* Left: Sidebar Toggle + Brand Logo */}
          <div className="flex items-center gap-2 shrink-0">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
                title={isSidebarOpen ? "Collapse Left Panel" : "Expand Left Panel"}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4 text-rose-600" />
                )}
              </button>
            )}

            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-rose-500/25 group-hover:scale-105 transition">
                <span>🍒</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                  Lychee<span className="text-rose-600">Job</span>
                </div>
                <div className="text-[10px] text-slate-600 font-semibold tracking-wider uppercase">
                  Map Portal
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Search & Location Form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 max-w-3xl flex items-center bg-slate-50 border border-slate-200/90 rounded-xl shadow-inner focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/20 transition p-1 gap-1 text-xs"
          >
            {/* Keyword Input */}
            <div className="flex-1 flex items-center gap-1.5 px-2">
              <Search className="w-4 h-4 text-slate-600 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skill, company (e.g. React, Java, TCS, SDE)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent border-none text-slate-900 placeholder:text-slate-600 focus:outline-none text-xs font-medium"
              />
            </div>

            <div className="h-5 w-[1px] bg-slate-200 shrink-0" />

            {/* City / Location Input */}
            <div className="flex-1 flex items-center gap-1.5 px-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <input
                type="text"
                placeholder="City, State, or Area..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent border-none text-slate-900 placeholder:text-slate-600 focus:outline-none text-xs font-medium"
              />
            </div>

            {/* Locate Me GPS Button */}
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="px-2 py-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
              title="Use Current GPS Location"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-rose-600' : ''}`} />
            </button>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold px-3 py-1.5 rounded-lg transition shrink-0 shadow-sm flex items-center gap-1"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Right: Actions (Filters, Sync, Saved, Admin) */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            {onOpenFilters && (
              <button
                onClick={onOpenFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200/80 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Filters</span>
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

            {/* Govt / Sarkari Jobs Tab */}
            <Link
              href="/govt-jobs"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 font-bold transition shadow-xs group"
            >
              <span className="text-xs group-hover:scale-110 transition">🏛️</span>
              <span className="hidden xs:inline">Govt Jobs</span>
              <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs">
                Sarkari
              </span>
            </Link>

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

        {/* ROW 2: Multi-City Quick Selection Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] pt-1 border-t border-slate-100">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
            Multi-City Filter:
          </span>

          {/* All India Reset Chip */}
          <button
            type="button"
            onClick={() => {
              if (onClearCities) onClearCities();
              if (onSearch) onSearch(keyword, '', userCoords.lat, userCoords.lng, radiusKm);
            }}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition whitespace-nowrap flex items-center gap-1 ${
              selectedCities.length === 0 && !city
                ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-extrabold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 border border-slate-200/80'
            }`}
          >
            <span>🇮🇳</span>
            <span>All India</span>
          </button>

          {POPULAR_CITIES.map((c) => {
            const isSelected = selectedCities.map(x => x.toLowerCase()).includes(c.toLowerCase()) || city.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  if (onToggleCity) {
                    onToggleCity(c);
                  } else if (onSearch) {
                    setCity(c);
                    onSearch(keyword, c, userCoords.lat, userCoords.lng, radiusKm);
                  }
                }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition whitespace-nowrap flex items-center gap-1 ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-extrabold shadow-md shadow-rose-500/30 scale-[1.03]'
                    : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 border border-slate-200/80'
                }`}
              >
                <span>📍</span>
                <span>{c}</span>
                {isSelected && <span className="text-[10px] ml-0.5 font-bold">✓</span>}
              </button>
            );
          })}

          {selectedCities.length > 0 && onClearCities && (
            <button
              type="button"
              onClick={onClearCities}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition shrink-0"
            >
              Clear ({selectedCities.length})
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
