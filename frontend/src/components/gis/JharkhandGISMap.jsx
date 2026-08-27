import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import ReactGISMap from './ReactGISMap';
import { 
  MapPin, 
  Layers, 
  Filter, 
  Sparkles, 
  Building2, 
  ArrowRight, 
  TrendingUp,
  Droplets,
  Sprout,
  HeartPulse,
  Sun,
  GraduationCap,
  Globe,
  Compass
} from 'lucide-react';

export default function JharkhandGISMap() {
  const { 
    districts, 
    problemClusters, 
    activeDistrictId, 
    setActiveDistrictId, 
    setSelectedClusterId, 
    setActiveView,
    lang 
  } = useAppState();

  const [mapMode, setMapMode] = useState('leaflet'); // 'leaflet' | 'schematic'
  const [activeLayer, setActiveLayer] = useState('All'); // All, Water, Agri, Health, Energy
  const activeDistrict = (districts || []).find(d => d?.id === activeDistrictId) || (districts && districts[0]) || {
    id: 'khunti',
    name: 'Khunti',
    nameHi: 'खूंटी',
    tier: 'Aspirational District',
    totalProblems: 1,
    activeProjects: 1,
    impactCount: 12400,
    blocks: ['Torpa', 'Murhu', 'Karra', 'Rania', 'Khunti']
  };
  const districtProblems = (problemClusters || []).filter(c => c?.district === activeDistrictId || c?.districtName?.toLowerCase() === activeDistrictId);

  // Approximate relative 2D positions of Jharkhand 24 districts for SVG grid representation
  const districtPositions = {
    garhwa: { x: 80, y: 70, w: 75, h: 55 },
    palamu: { x: 160, y: 80, w: 85, h: 65 },
    chatra: { x: 250, y: 90, w: 75, h: 60 },
    hazaribagh: { x: 330, y: 100, w: 80, h: 65 },
    koderma: { x: 360, y: 50, w: 65, h: 45 },
    giridih: { x: 445, y: 95, w: 85, h: 65 },
    deoghar: { x: 535, y: 80, w: 75, h: 55 },
    dumka: { x: 615, y: 105, w: 80, h: 65 },
    godda: { x: 615, y: 45, w: 70, h: 55 },
    sahibganj: { x: 690, y: 40, w: 65, h: 55 },
    pakur: { x: 700, y: 100, w: 60, h: 50 },
    jamtara: { x: 535, y: 145, w: 65, h: 45 },
    bokaro: { x: 420, y: 165, w: 75, h: 55 },
    dhanbad: { x: 500, y: 165, w: 70, h: 55 },
    ramgarh: { x: 345, y: 170, w: 65, h: 45 },
    ranchi: { x: 290, y: 220, w: 95, h: 70 },
    lohardaga: { x: 215, y: 195, w: 65, h: 50 },
    latehar: { x: 190, y: 135, w: 75, h: 55 },
    gumla: { x: 185, y: 255, w: 90, h: 70 },
    simdega: { x: 180, y: 330, w: 85, h: 65 },
    khunti: { x: 285, y: 295, w: 80, h: 60 },
    west_singhbhum: { x: 320, y: 360, w: 100, h: 80 },
    saraikela_kharsawan: { x: 380, y: 300, w: 85, h: 60 },
    east_singhbhum: { x: 470, y: 320, w: 85, h: 70 }
  };

  const layers = [
    { id: 'All', label: 'All Domains', icon: Layers, color: 'bg-slate-900 text-white' },
    { id: 'Water', label: 'Water Security', icon: Droplets, color: 'bg-blue-600 text-white' },
    { id: 'Agri', label: 'Agriculture & Cold Chain', icon: Sprout, color: 'bg-emerald-600 text-white' },
    { id: 'Health', label: 'Fluorosis & Health', icon: HeartPulse, color: 'bg-rose-600 text-white' },
    { id: 'Energy', label: 'Solar Microgrids & STEM', icon: Sun, color: 'bg-amber-600 text-white' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      {/* Top Title & Thematic Layer Controller */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Jharkhand State Geographic Intelligence System (GIS)</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'hi' ? 'झारखंड जिलावार नवाचार मानचित्र एवं प्रभाव' : 'District-Wise Societal Innovation & Deployment Map'}
          </h2>
          <p className="text-xs text-slate-500">
            Interactive drilldown: State ➔ 24 Districts ➔ Blocks ➔ Panchayats ➔ Active Research Pilots
          </p>
        </div>

        {/* Thematic Filter Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          {layers.map((lay) => {
            const Icon = lay.icon;
            const isActive = activeLayer === lay.id;
            return (
              <button
                key={lay.id}
                onClick={() => setActiveLayer(lay.id)}
                className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? `${lay.color} shadow-sm ring-2 ring-emerald-400/50`
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lay.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Mode Toggle: Interactive React GIS Map vs Schematic Matrix */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMapMode('leaflet')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mapMode === 'leaflet'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>🛰️ Interactive React GIS Map (GPS Pins & Telemetry)</span>
          </button>
          <button
            onClick={() => setMapMode('schematic')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mapMode === 'schematic'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>🗺️ 24-District Region Matrix</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">
          Centroid: 23.6102° N, 85.2799° E (Jharkhand)
        </span>
      </div>

      {mapMode === 'leaflet' ? (
        <ReactGISMap />
      ) : (
        /* Main Grid: Interactive Map + District Sidebar Drilldown */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SVG Interactive 24-District Map */}
          <div className="lg:col-span-2 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-5 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Click any district polygon to inspect local challenges & pilots</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Scale: 1:250,000</span>
            </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[4/3] max-h-[500px] flex items-center justify-center">
            <svg viewBox="0 0 800 480" className="w-full h-full select-none">
              {/* Background ambient grid */}
              <defs>
                <pattern id="gis-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="selectedDist" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>
              <rect width="800" height="480" fill="url(#gis-grid)" />

              {/* District Blocks */}
              {districts.map((d) => {
                const pos = districtPositions[d.id] || { x: 300, y: 200, w: 70, h: 50 };
                const isSelected = activeDistrictId === d.id;
                const isHovered = hoveredDistrict === d.id;
                const isKhuntiRef = d.id === 'khunti';

                let fillColor = isSelected ? 'url(#selectedDist)' : isHovered ? '#334155' : '#1e293b';
                let strokeColor = isSelected ? '#34d399' : isKhuntiRef ? '#f59e0b' : '#475569';
                let strokeW = isSelected ? 3 : isKhuntiRef ? 2 : 1;

                return (
                  <g
                    key={d.id}
                    onClick={() => setActiveDistrictId(d.id)}
                    onMouseEnter={() => setHoveredDistrict(d.id)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    <rect
                      x={pos.x}
                      y={pos.y}
                      width={pos.w}
                      height={pos.h}
                      rx={10}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeW}
                      className="transition-all hover:scale-[1.02] filter drop-shadow-md"
                    />

                    {/* District Name Label */}
                    <text
                      x={pos.x + pos.w / 2}
                      y={pos.y + pos.h / 2 - 4}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#e2e8f0'}
                      fontSize={pos.w > 75 ? "10" : "8.5"}
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {d.name.split(' ')[0]}
                    </text>

                    {/* Problem / Project Count Badge */}
                    <text
                      x={pos.x + pos.w / 2}
                      y={pos.y + pos.h / 2 + 10}
                      textAnchor="middle"
                      fill={isSelected ? '#a7f3d0' : '#94a3b8'}
                      fontSize="8"
                      fontFamily="sans-serif"
                    >
                      {d.totalProblems} Ch | {d.activeProjects} Prj
                    </text>

                    {/* Special Marker for Khunti Reference Case */}
                    {isKhuntiRef && (
                      <circle
                        cx={pos.x + pos.w - 10}
                        cy={pos.y + 10}
                        r={4}
                        fill="#f59e0b"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Float Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 backdrop-blur-md p-2.5 rounded-xl text-[10px] text-slate-300 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded bg-emerald-600 border border-emerald-400" />
                <span>Selected District ({activeDistrict.name})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded bg-slate-800 border border-amber-400" />
                <span>Active Innovation Pilot Anchor (Khunti)</span>
              </div>
            </div>
          </div>

          {/* Map Footer Stats */}
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">State Total Problems</span>
              <strong className="text-white text-sm">524 Submitted</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Active University Pilots</span>
              <strong className="text-emerald-400 text-sm">38 Deployed</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Total Citizens Benefited</span>
              <strong className="text-amber-400 text-sm">184,000+</strong>
            </div>
          </div>
        </div>

        {/* Selected District Drilldown Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  District Profile
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">{activeDistrict.name}</h3>
                <span className="text-xs text-emerald-800 font-semibold">{activeDistrict.nameHi} • {activeDistrict.tier}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {activeDistrict.activeProjects} Active Pilots
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Total Challenges</span>
                <strong className="text-slate-900 text-sm font-extrabold">{activeDistrict.totalProblems}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Impact Reach</span>
                <strong className="text-emerald-700 text-sm font-extrabold">{(activeDistrict.impactCount || 8900).toLocaleString()}+</strong>
              </div>
            </div>

            {/* Block Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-1.5">Administrative Blocks ({activeDistrict.blocks?.length || 6}):</h4>
              <div className="flex flex-wrap gap-1.5">
                {activeDistrict.blocks?.map((b, i) => (
                  <span
                    key={i}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                      b === 'Torpa' || b === 'Patan' ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {b} {b === 'Torpa' && '★'}
                  </span>
                ))}
              </div>
            </div>

            {/* District Challenges List */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-extrabold text-slate-900">
                Live Challenges in {activeDistrict.name} ({districtProblems.length}):
              </h4>

              {districtProblems.length > 0 ? (
                districtProblems.map((prob) => (
                  <div
                    key={prob.id}
                    onClick={() => {
                      setSelectedClusterId(prob.id);
                      setActiveView('cluster_detail');
                    }}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer group space-y-1 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] font-bold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                        #{prob.id}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded">
                        Stage: {prob.status}
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-900 group-hover:text-emerald-800 leading-snug line-clamp-2">
                      {prob.title}
                    </h5>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                      <span>{prob.block} Block</span>
                      <span className="text-emerald-700 font-bold flex items-center space-x-0.5">
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3 inline" />
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl text-center text-xs text-slate-500">
                  No active problems in this filter for {activeDistrict.name}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
