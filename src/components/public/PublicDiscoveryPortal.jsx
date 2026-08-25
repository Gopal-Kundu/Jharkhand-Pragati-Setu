import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { 
  Globe, 
  Sparkles, 
  Search, 
  MapPin, 
  TrendingUp, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Users,
  Droplets,
  Sprout
} from 'lucide-react';

export default function PublicDiscoveryPortal() {
  const { problemClusters, districts, setSelectedClusterId, setActiveView, lang } = useAppState();

  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  const publicClusters = problemClusters.filter(c => {
    const matchD = selectedDomain === 'All' || c.primaryDomain === selectedDomain;
    const matchS = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.districtName.toLowerCase().includes(search.toLowerCase());
    return matchD && matchS;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      {/* Public Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
            <Globe className="w-3.5 h-3.5" />
            <span>Jharkhand Open Innovation Discovery Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {lang === 'hi'
              ? 'जनता की समस्याएं, अनुसंधान का समाधान, प्रत्यक्ष सामाजिक प्रभाव'
              : 'Grassroots Challenges Transformed into Public Impact'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Explore state-wide university research pilots, industry CSR collaborations, and verified social transformations across all 24 districts of Jharkhand.
          </p>
        </div>

        {/* Public Impact High-Level Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-800/60 text-xs">
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-emerald-200 block font-semibold">Citizens Impacted</span>
            <strong className="text-2xl font-black text-white">184,000+</strong>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-emerald-200 block font-semibold">University Deployments</span>
            <strong className="text-2xl font-black text-amber-300">38 Active</strong>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-emerald-200 block font-semibold">CSR Capital Mobilized</span>
            <strong className="text-2xl font-black text-emerald-400">₹27.4 Cr</strong>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-emerald-200 block font-semibold">Districts Covered</span>
            <strong className="text-2xl font-black text-white">24 / 24</strong>
          </div>
        </div>
      </div>

      {/* Featured Success Case: Torpa Village Pond */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-300 shadow-md space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
              Featured Jharkhand Deployment Story
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
            Stage: Community Field Pilot
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug">
              Torpa Block Smart Pond Hydro-Telemetry & Automated Sluice Gate
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When 17 village reports highlighted severe pre-monsoon drying of the Dormba check-dam, <strong>BIT Mesra</strong> researchers engineered solar IoT hydrostatic sensors backed by a <strong>Tata Steel CSR grant</strong>. Over 2,400 farmers now enjoy round-the-year water security and a 300% expansion in vegetable cultivation.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                Lead: BIT Mesra
              </span>
              <span className="bg-amber-50 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                Partner: Tata Steel Foundation
              </span>
              <span className="bg-emerald-50 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                Location: Khunti District
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Verified Social Impact
            </span>
            <div className="text-2xl font-black text-emerald-800">2,400+</div>
            <span className="text-xs font-semibold text-slate-700 block">Villagers with Assured Water</span>
            <button
              onClick={() => {
                setSelectedClusterId('JH-WTR-1042');
                setActiveView('cluster_detail');
              }}
              className="w-full mt-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
            >
              <span>Explore Complete Case Study</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Public Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by topic, university, or district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Water Resources', 'Agriculture', 'Healthcare', 'Education', 'Environment'].map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedDomain === dom
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicClusters.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setSelectedClusterId(c.id);
                setActiveView('cluster_detail');
              }}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                    #{c.id}
                  </span>
                  <span className="text-slate-600 font-bold bg-slate-100 text-[10px] px-2 py-0.5 rounded-full">
                    Stage: {c.status}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {c.title}
                </h4>

                <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{c.block}, {c.districtName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Impact: <strong className="text-emerald-800">{(c.affectedPopulation || 3500).toLocaleString()}+ People</strong>
                </span>
                <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform">
                  View &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
