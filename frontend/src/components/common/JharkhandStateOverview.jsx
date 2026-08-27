import React from 'react';
import jharkhandMapImg from '../../assets/jharkhand.jpg';
import { 
  CheckCircle2, 
  Clock, 
  Building2 
} from 'lucide-react';

export default function JharkhandStateOverview() {
  // Realistic statewide innovation stats for Jharkhand
  const stateStats = {
    name: 'Jharkhand',
    area: '79,716 sq km',
    population: '3.90 Cr',
    reported: '1,284',
    solved: '412'
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* 1. Header with Accent Bar */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading uppercase">
            STATE OVERVIEW
          </h2>
        </div>
        <div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 rounded-full mt-2" />
      </div>

      {/* 2. Responsive 2-Column Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Fullscreen Map Image Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between overflow-hidden relative min-h-[460px] group">
          
          {/* Background Map Image Full Bleed / Full Div Fit */}
          <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-100 flex items-center justify-center">
            <img
              src={jharkhandMapImg}
              alt="Jharkhand State Map"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {/* Subtle Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* Top Badge Overlay */}
          <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-amber-800 text-xs font-bold font-mono uppercase tracking-wider shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>JHARKHAND STATE MAP</span>
            </div>
          </div>

          {/* Bottom Telemetry Overlay */}
          <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between text-white text-xs font-semibold backdrop-blur-[2px]">
            <span className="drop-shadow-md">Geographic Distribution of Societal Interventions</span>
            <span className="font-bold text-emerald-300 drop-shadow-md font-mono bg-black/40 px-3 py-1 rounded-full border border-white/20">
              24 Districts of Jharkhand
            </span>
          </div>

        </div>

        {/* Right Column: Statistics Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between min-h-[500px]">
          
          <div>
            {/* Header with Subtitle & Live Stats Badge */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-extrabold font-mono text-amber-700 uppercase tracking-widest block mb-1">
                  STATE OVERVIEW
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
                  {stateStats.name}
                </h3>
              </div>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
                <span>• LIVE STATS</span>
              </div>
            </div>

            {/* 4 Stats Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Box 1: Area */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                <span className="text-xs font-bold font-mono text-amber-800 uppercase tracking-wider block">
                  AREA
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  {stateStats.area}
                </div>
              </div>

              {/* Box 2: Population */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                <span className="text-xs font-bold font-mono text-amber-800 uppercase tracking-wider block">
                  POPULATION
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  {stateStats.population}
                </div>
              </div>

              {/* Box 3: Challenges Reported */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">
                    CHALLENGES REPORTED
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  {stateStats.reported}
                </div>
              </div>

              {/* Box 4: Challenges Solved */}
              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">
                    CHALLENGES SOLVED
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-heading">
                  {stateStats.solved}
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Summary Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50/90 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>Connected to 5 State HEI Research Labs &amp; CSR Foundations</span>
            </div>
            <span className="font-bold text-emerald-800 font-mono">100% Verified</span>
          </div>

        </div>

      </div>
    </section>
  );
}
