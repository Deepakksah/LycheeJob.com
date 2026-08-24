'use client';

import React, { useState } from 'react';
import { Search, MapPin, Navigation, Crosshair } from 'lucide-react';

interface SearchBarProps {
  initialKeyword?: string;
  initialCity?: string;
  initialRadius?: number;
  onSearch: (keyword: string, city: string, userLat?: number, userLng?: number, radiusKm?: number) => void;
}

const POPULAR_CITIES = ['Delhi', 'Noida', 'Gurgaon', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Jaipur'];

export const SearchBar: React.FC<SearchBarProps> = ({
  initialKeyword = '',
  initialCity = '',
  initialRadius = 25,
  onSearch
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

    // Smart detection: e.g. "React Developer Delhi"
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

    onSearch(cleanKeyword, cleanCity, userCoords.lat, userCoords.lng, radiusKm);
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
        onSearch(keyword, city, lat, lng, radiusKm);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not retrieve location: ' + err.message);
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-slate-900/90 p-2.5 sm:p-3.5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
        
        {/* Keyword Search */}
        <div className="flex-1 relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title, skill, or company..."
            className="w-full bg-slate-950 text-white placeholder-slate-400 text-xs sm:text-sm pl-10 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* City Location Search */}
        <div className="w-full lg:w-64 relative">
          <MapPin className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (Delhi, Noida, etc.)"
            className="w-full bg-slate-950 text-white placeholder-slate-400 text-xs sm:text-sm pl-10 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Radius Selector */}
        <div className="w-full lg:w-36 relative">
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-full bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 transition cursor-pointer"
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
          </select>
        </div>

        {/* Search & Location Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            title="Use current location"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition flex items-center justify-center border border-slate-700"
          >
            <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Quick City Chips */}
      <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap text-[11px]">Cities:</span>
        {POPULAR_CITIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCity(c);
              onSearch(keyword, c, userCoords.lat, userCoords.lng, radiusKm);
            }}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition whitespace-nowrap ${
              city.toLowerCase() === c.toLowerCase()
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            📍 {c}
          </button>
        ))}
      </div>
    </form>
  );
};
