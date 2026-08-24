'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, Maximize2 } from 'lucide-react';
import { Job } from '../types';
import { JobInfoWindow } from './JobInfoWindow';
import { getExactCompanyLogoUrl, getBackupGoogleFaviconUrl } from '../utils/companyLogos';

interface JobMapProps {
  jobs: Job[];
  selectedJob?: Job | null;
  onSelectJob: (job: Job) => void;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export const JobMap: React.FC<JobMapProps> = ({
  jobs,
  selectedJob,
  onSelectJob,
  onBoundsChange,
  center = { lat: 28.6139, lng: 77.2090 },
  zoom = 11
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const isInitializedRef = useRef(false);
  const [activeInfoWindowJob, setActiveInfoWindowJob] = useState<Job | null>(null);
  const [showSearchThisArea, setShowSearchThisArea] = useState(false);

  // ─── Helper: destroy existing Leaflet map safely ───────────────────────────
  const destroyMap = () => {
    if (leafletMapRef.current) {
      try {
        leafletMapRef.current.off();
        leafletMapRef.current.remove();
      } catch (_) {}
      leafletMapRef.current = null;
    }
    markersGroupRef.current = null;
    isInitializedRef.current = false;
    // Wipe any leftover Leaflet DOM state from the container
    if (mapContainerRef.current) {
      (mapContainerRef.current as any)._leaflet_id = undefined;
      // Remove all child nodes Leaflet may have injected
      while (mapContainerRef.current.firstChild) {
        mapContainerRef.current.removeChild(mapContainerRef.current.firstChild);
      }
    }
  };

  // ─── Initialize Map ──────────────────────────────────────────────────────
  useEffect(() => {
    // Dynamic import to avoid SSR issues
    let cancelled = false;
    const initMap = async () => {
      if (!mapContainerRef.current || cancelled) return;

      // Always destroy cleanly before creating
      destroyMap();

      try {
        const L = (await import('leaflet')).default;

        if (!mapContainerRef.current || cancelled) return;

        const map = L.map(mapContainerRef.current, {
          center: [center.lat, center.lng],
          zoom,
          zoomControl: false,
          preferCanvas: true, // Better performance, avoids SVG memory leaks
        });

        L.tileLayer(
          'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
          {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri',
          }
        ).addTo(map);

        L.control.zoom({ position: 'topright' }).addTo(map);

        const markersGroup = L.layerGroup().addTo(map);
        markersGroupRef.current = markersGroup;

        map.on('moveend', () => {
          if (!cancelled) setShowSearchThisArea(true);
        });

        leafletMapRef.current = map;
        isInitializedRef.current = true;
      } catch (err) {
        console.error('Leaflet map init error:', err);
      }
    };

    initMap();

    return () => {
      cancelled = true;
      destroyMap();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Render Markers ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isInitializedRef.current || !leafletMapRef.current || !markersGroupRef.current) return;

    const markersGroup = markersGroupRef.current;
    const L = (window as any).L;

    // Dynamically import L only if needed
    const renderMarkers = async () => {
      const Leaflet = (await import('leaflet')).default;
      markersGroup.clearLayers();
      if (jobs.length === 0) return;

      const companyGroupMap = new Map<string, Job[]>();
      jobs.forEach((j) => {
        if (j.latitude && j.longitude) {
          const key = `${j.latitude.toFixed(3)}_${j.longitude.toFixed(3)}`;
          if (!companyGroupMap.has(key)) companyGroupMap.set(key, []);
          companyGroupMap.get(key)!.push(j);
        }
      });

      jobs.forEach((job) => {
        if (!job.latitude || !job.longitude) return;

        const key = `${job.latitude.toFixed(3)}_${job.longitude.toFixed(3)}`;
        const companyJobs = companyGroupMap.get(key) || [job];
        const count = companyJobs.length;
        const isSelected = selectedJob?.id === job.id;
        const sizePx = isSelected ? 48 : 38;

        const companyLogo = getExactCompanyLogoUrl(job.company.name, job.company.website, job.company.logoUrl);
        const backupLogo = getBackupGoogleFaviconUrl(job.company.name, job.company.website);
        const initials = job.company.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();

        const customHtml = `
          <div class="company-map-marker-container ${isSelected ? 'selected' : ''}">
            <div class="company-map-marker-bubble" style="width:${sizePx}px;height:${sizePx}px;background:#fff;">
              ${
                companyLogo
                  ? `<img src="${companyLogo}" alt="${job.company.name}" style="width:100%;height:100%;object-fit:contain;padding:2px;border-radius:50%;" onError="this.onerror=null;this.src='${backupLogo}';" />`
                  : `<span style="font-weight:800;font-size:11px;color:#e11d48;">${initials}</span>`
              }
            </div>
            ${count > 1 ? `<div class="company-map-marker-badge">${count}</div>` : ''}
            <div class="company-map-marker-pointer"></div>
          </div>
        `;

        const customIcon = Leaflet.divIcon({
          html: customHtml,
          className: 'custom-leaflet-marker',
          iconSize: [sizePx, sizePx + 10],
          iconAnchor: [sizePx / 2, sizePx + 10],
        });

        const marker = Leaflet.marker([job.latitude, job.longitude], { icon: customIcon });
        marker.on('click', (e: any) => {
          Leaflet.DomEvent.stopPropagation(e);
          onSelectJob(job);
          setActiveInfoWindowJob(job);
        });
        markersGroup.addLayer(marker);
      });
    };

    renderMarkers();
  }, [jobs, selectedJob?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Pan to selected job ──────────────────────────────────────────────────
  const prevSelectedIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (!leafletMapRef.current || !selectedJob?.latitude || !selectedJob?.longitude) return;
    if (prevSelectedIdRef.current !== selectedJob.id) {
      prevSelectedIdRef.current = selectedJob.id;
      try {
        leafletMapRef.current.panTo([selectedJob.latitude, selectedJob.longitude], { animate: true });
        setActiveInfoWindowJob(selectedJob);
      } catch (_) {}
    }
  }, [selectedJob?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchThisArea = () => {
    if (!leafletMapRef.current || !onBoundsChange) return;
    try {
      const bounds = leafletMapRef.current.getBounds();
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    } catch (_) {}
    setShowSearchThisArea(false);
  };

  const handleFitAllJobs = async () => {
    if (!leafletMapRef.current || jobs.length === 0) return;
    try {
      const L = (await import('leaflet')).default;
      const validJobs = jobs.filter((j) => j.latitude && j.longitude);
      if (validJobs.length === 0) return;
      const bounds = L.latLngBounds(validJobs.map((j) => [j.latitude!, j.longitude!]));
      if (bounds.isValid()) {
        leafletMapRef.current.fitBounds(bounds, { padding: [40, 40] });
      }
    } catch (_) {}
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      {/* ArcGIS Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Search this area */}
      {showSearchThisArea && (
        <button
          onClick={handleSearchThisArea}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 text-white hover:bg-blue-600 text-xs font-bold px-4 py-2 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 backdrop-blur-md transition duration-200"
        >
          <Search className="w-3.5 h-3.5 text-blue-400" />
          <span>Search this area</span>
        </button>
      )}

      {/* Fit All Markers */}
      <div className="absolute top-16 right-3 z-20">
        <button
          onClick={handleFitAllJobs}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md transition"
          title="Fit all job markers in view"
        >
          <Maximize2 className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {/* InfoWindow Overlay */}
      {activeInfoWindowJob && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
          <JobInfoWindow
            job={activeInfoWindowJob}
            allCompanyJobs={jobs.filter(
              (j) => j.company.name === activeInfoWindowJob.company.name && j.city === activeInfoWindowJob.city
            )}
            onClose={() => setActiveInfoWindowJob(null)}
            onSelectJob={(j) => {
              onSelectJob(j);
              setActiveInfoWindowJob(j);
            }}
          />
        </div>
      )}
    </div>
  );
};
