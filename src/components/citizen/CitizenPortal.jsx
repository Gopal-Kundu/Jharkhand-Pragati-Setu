import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import ProblemNetworkGraph from '../common/ProblemNetworkGraph';
import LiveTelemetryDashboard from '../common/LiveTelemetryDashboard';
import { 
  PlusCircle, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  Activity, 
  Eye,
  AlertTriangle,
  Building,
  HelpCircle,
  Radio,
  Zap,
  Award
} from 'lucide-react';

export default function CitizenPortal() {
  const { 
    problemClusters, 
    setSelectedClusterId, 
    setActiveView, 
    setIsSubmitModalOpen, 
    setIsAssistantOpen,
    lang 
  } = useAppState();

  const [filterDomain, setFilterDomain] = useState('All');
  const [trackQuery, setTrackQuery] = useState('');

  const domains = ['All', 'Water Resources', 'Agriculture', 'Healthcare', 'Education', 'Environment'];

  const filteredClusters = problemClusters.filter(c => {
    if (filterDomain === 'All') return true;
    return c.primaryDomain === filterDomain || (c.secondaryDomains && c.secondaryDomains.includes(filterDomain));
  });

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    const clean = trackQuery.trim().toUpperCase().replace('#', '');
    const found = problemClusters.find(c => c.id.includes(clean) || (c.reports && c.reports.some(r => r.phone && r.phone.includes(clean))));
    if (found) {
      setSelectedClusterId(found.id);
      setActiveView('cluster_detail');
    } else {
      setSelectedClusterId('JH-WTR-1042');
      setActiveView('cluster_detail');
    }
  };

  const torpaCluster = problemClusters.find(c => c.id === 'JH-WTR-1042') || problemClusters[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      {/* Modern DeepTech Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl text-white p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>State Societal Innovation & University Matching Pipeline</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Turning Grassroots Problems into <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Deployable DeepTech Solutions</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {lang === 'hi'
              ? 'यह केवल शिकायत निवारण पोर्टल नहीं है। यहाँ हर ग्रामीण व शहरी समस्या को AI द्वारा विश्लेषित कर BIT मेसरा, IIT धनबाद और टाटा स्टील के शोधकर्ताओं से जोड़कर स्थायी समाधान में बदला जाता है।'
              : 'Every problem submitted is structured by AI, validated by District Authorities, matched to multidisciplinary University Labs (BIT Mesra, IIT ISM), and powered by Industry CSR grants.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नयी समस्या दर्ज करें' : 'Submit Grassroots Challenge'}</span>
            </button>

            <button
              onClick={() => setIsAssistantOpen(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all flex items-center space-x-2 cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Ask Sangi AI</span>
            </button>
          </div>
        </div>

        {/* Quick Track Input Bar */}
        <div className="pt-4 border-t border-slate-800/80 max-w-xl relative z-10">
          <form onSubmit={handleTrackSubmit} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder={lang === 'hi' ? 'समस्या आईडी या मोबाइल दर्ज करें (उदा. JH-WTR-1042)...' : 'Track by Problem ID or Mobile (e.g. JH-WTR-1042)...'}
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="w-full text-xs bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 pl-9 pr-3 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md"
            >
              Track Status
            </button>
          </form>
        </div>
      </div>

      {/* SHOWSTOPPER 1: Interactive Living Problem-to-Impact Graph */}
      <ProblemNetworkGraph 
        cluster={torpaCluster} 
        onNodeClick={(nodeId) => {
          setSelectedClusterId('JH-WTR-1042');
          setActiveView('cluster_detail');
        }}
      />

      {/* SHOWSTOPPER 2: Live IoT Sensor Telemetry Stream */}
      <LiveTelemetryDashboard />

      {/* Filter and Problem List Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-xl text-white">
              {lang === 'hi' ? 'सक्रिय सामाजिक नवाचार चुनौतियाँ' : 'Active Community Innovation Challenges in Jharkhand'}
            </h3>
            <p className="text-xs text-slate-400">
              {filteredClusters.length} verified societal problems currently linked with university research & corporate CSR
            </p>
          </div>

          {/* Domain Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setFilterDomain(d)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterDomain === d
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClusters.map((cluster) => {
            const isTorpa = cluster.id === 'JH-WTR-1042';
            return (
              <div
                key={cluster.id}
                onClick={() => {
                  setSelectedClusterId(cluster.id);
                  setActiveView('cluster_detail');
                }}
                className={`bg-slate-900/80 backdrop-blur-md rounded-3xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.02] group relative overflow-hidden ${
                  isTorpa ? 'border-emerald-500/80 ring-2 ring-emerald-500/30 shadow-xl shadow-emerald-500/10' : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                {isTorpa && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950 text-[9.5px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-md">
                    ★ Featured Showcase
                  </div>
                )}

                <div className="space-y-2.5">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                      #{cluster.id}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      cluster.severity === 'Critical' ? 'bg-red-950/80 text-red-300 border border-red-800' :
                      cluster.severity === 'High' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'bg-blue-950/80 text-blue-300 border border-blue-800'
                    }`}>
                      {cluster.severity} ({cluster.aiIntelligence?.prioritizationScore || 85}/100)
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                    {lang === 'hi' && cluster.titleHi ? cluster.titleHi : cluster.title}
                  </h4>

                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{cluster.block || 'Sadar'}, {cluster.districtName}</span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {cluster.aiIntelligence?.citizenObserved || cluster.aiIntelligence?.rootProblem}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Reports Clustered: <strong className="text-white font-mono">{cluster.reportCount || 1}</strong>
                    </span>
                    <span className="font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                      Stage: {cluster.status}
                    </span>
                  </div>

                  {cluster.project ? (
                    <div className="bg-slate-950/90 p-2.5 rounded-xl text-[11px] text-slate-300 flex items-center justify-between border border-slate-800">
                      <span className="truncate font-semibold text-emerald-300">{cluster.project.leadInstitution}</span>
                      <span className="text-[10px] text-cyan-400 font-bold">Active Team &rarr;</span>
                    </div>
                  ) : (
                    <div className="bg-purple-950/40 p-2.5 rounded-xl text-[11px] text-purple-300 flex items-center justify-between border border-purple-800/40">
                      <span>Top Match: <strong>{cluster.institutionMatches?.[0]?.name || 'BIT Mesra'}</strong></span>
                      <span className="text-[10px] font-bold text-amber-400">{cluster.institutionMatches?.[0]?.matchScore || 92}% Fit</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
