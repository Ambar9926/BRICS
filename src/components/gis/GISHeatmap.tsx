import { useState } from 'react';
import { MapPin, Info, Activity } from 'lucide-react';
import { mockHotspots } from '@/data/mockData';
import { RegionalDrawer } from '@/components/gis/RegionalDrawer';
import { useAppData } from '@/context/AppDataContext';
import { CountryFlag } from '@/components/shared/Badges';
import type { Hotspot } from '@/types';

export function GISHeatmap() {
  const { selectedHotspotId, setSelectedHotspotId } = useAppData();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 85) return 'bg-red-500/80 border-red-400';
    if (intensity >= 70) return 'bg-orange-500/80 border-orange-400';
    if (intensity >= 50) return 'bg-yellow-500/80 border-yellow-400';
    return 'bg-green-500/80 border-green-400';
  };

  const getIntensityGlow = (intensity: number) => {
    if (intensity >= 85) return 'shadow-[0_0_30px_rgba(239,68,68,0.5)]';
    if (intensity >= 70) return 'shadow-[0_0_25px_rgba(249,115,22,0.5)]';
    if (intensity >= 50) return 'shadow-[0_0_20px_rgba(234,179,8,0.4)]';
    return 'shadow-[0_0_15px_rgba(34,197,94,0.4)]';
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Hero */}
      <div className="mb-6">
        <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 mb-3">
          GIS Heatmap & Regional Analytics
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
          Infrastructure Deficiency Hotspots
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          Interactive map showing high-demand infrastructure needs across BRICS nations. Click a hotspot for regional analysis.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" /> Intensity:
        </span>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Low (50-69)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Moderate (70-84)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-orange-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">High (85-89)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Critical (90+)</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 h-[500px] sm:h-[600px]">
        {/* World map SVG background (simplified BRICS region focus) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Simplified continent shapes */}
          <defs>
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-gray-300 dark:text-gray-700" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* South America */}
          <path d="M28,55 Q26,50 30,48 L34,48 Q38,52 36,58 L37,65 Q35,72 33,75 L31,80 Q29,78 29,72 L28,65 Z" fill="currentColor" className="text-gray-200 dark:text-gray-800" opacity="0.6" />
          {/* Africa */}
          <path d="M48,45 L55,43 Q58,48 56,55 L55,65 Q53,75 50,80 L47,78 L46,70 L47,60 Z" fill="currentColor" className="text-gray-200 dark:text-gray-800" opacity="0.6" />
          {/* Europe / Russia */}
          <path d="M48,25 Q52,22 58,24 L62,26 Q60,30 56,32 L50,30 L48,28 Z" fill="currentColor" className="text-gray-200 dark:text-gray-800" opacity="0.6" />
          {/* Asia / China / India */}
          <path d="M60,28 Q70,25 78,30 L82,35 Q80,40 75,42 L70,45 L65,50 L62,48 L60,40 L62,35 Z" fill="currentColor" className="text-gray-200 dark:text-gray-800" opacity="0.6" />
          {/* India subcontinent */}
          <path d="M66,45 L69,45 L70,52 L67,55 L65,52 Z" fill="currentColor" className="text-gray-200 dark:text-gray-800" opacity="0.6" />
        </svg>

        {/* Hotspots */}
        {mockHotspots.map((hotspot: Hotspot) => (
          <button
            key={hotspot.id}
            onClick={() => setSelectedHotspotId(hotspot.id)}
            onMouseEnter={() => setHoveredId(hotspot.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            aria-label={`View ${hotspot.city} hotspot`}
          >
            {/* Pulse ring */}
            <span className={`absolute inset-0 rounded-full ${getIntensityColor(hotspot.intensity).split(' ')[0]} opacity-30 animate-ping`} />

            {/* Dot */}
            <span
              className={`relative block rounded-full border-2 ${getIntensityColor(hotspot.intensity)} ${getIntensityGlow(hotspot.intensity)} transition-all hover:scale-125 ${
                hotspot.intensity >= 85 ? 'h-5 w-5' : hotspot.intensity >= 70 ? 'h-4 w-4' : 'h-3.5 w-3.5'
              }`}
            />

            {/* Tooltip */}
            {hoveredId === hotspot.id && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-20 whitespace-nowrap rounded-lg bg-gray-900 dark:bg-gray-700 px-3 py-1.5 text-xs text-white shadow-lg animate-slide-down">
                <div className="flex items-center gap-1.5">
                  <CountryFlag code={hotspot.countryCode} />
                  <span className="font-semibold">{hotspot.city}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-gray-300">
                  <span className="flex items-center gap-0.5"><Activity className="h-3 w-3" /> {hotspot.intensity}</span>
                  <span>· {hotspot.totalIssues} issues</span>
                </div>
              </div>
            )}
          </button>
        ))}

        {/* Country Labels */}
        <div className="absolute top-[20%] left-[52%] text-xs font-bold text-gray-400 dark:text-gray-600 select-none">RUSSIA</div>
        <div className="absolute top-[40%] left-[74%] text-xs font-bold text-gray-400 dark:text-gray-600 select-none">CHINA</div>
        <div className="absolute top-[47%] left-[66%] text-xs font-bold text-gray-400 dark:text-gray-600 select-none">INDIA</div>
        <div className="absolute top-[64%] left-[33%] text-xs font-bold text-gray-400 dark:text-gray-600 select-none">BRAZIL</div>
        <div className="absolute top-[76%] left-[52%] text-xs font-bold text-gray-400 dark:text-gray-600 select-none">S. AFRICA</div>

        {/* Click hint */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5 text-primary-500" /> Click a hotspot to view regional analysis
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
        {mockHotspots.slice(0, 5).map((h) => (
          <button
            key={h.id}
            onClick={() => setSelectedHotspotId(h.id)}
            className="card p-4 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <CountryFlag code={h.countryCode} />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{h.city}</span>
            </div>
            <p className="font-display text-xl font-bold text-gray-900 dark:text-white">{h.intensity}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">intensity · {h.totalIssues} issues</p>
          </button>
        ))}
      </div>

      {/* Drawer */}
      {selectedHotspotId && <RegionalDrawer />}
    </div>
  );
}
