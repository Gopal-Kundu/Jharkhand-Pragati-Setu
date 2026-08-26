import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { 
  ShieldCheck, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Layers, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Landmark,
  FileText
} from 'lucide-react';

export default function GovernmentCommandCenter() {
  const { 
    problemClusters, 
    districts, 
    govDepartments, 
    setActiveView, 
    setSelectedClusterId,
    setIsAuditDrawerOpen,
    lang 
  } = useAppState();

  const totalSubmitted = problemClusters.length + 520; // state aggregate
  const totalValidated = 485;
  const activePrototypes = 38;
  const totalImpacted = 184000;
  const totalFundsMobilized = '₹27.4 Crores';

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>State Apex Innovation & Governance Command</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'hi' ? 'झारखंड नवाचार एवं अनुसंधान अनुश्रवण डैशबोर्ड' : 'Jharkhand Innovation & Impact Monitoring Command Center'}
          </h1>
          <p className="text-xs text-slate-500">
            Real-time telemetry across 24 districts, 7 departments, 5 state universities, and 4 corporate CSR funds.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveView('gov_triage')}
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow cursor-pointer transition-all flex items-center space-x-1.5"
          >
            <span>Open Problem Triage Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAuditDrawerOpen(true)}
            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Audit Log
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Challenges Submitted', value: '524', change: '+14% this month', icon: FileText, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Validation Rate', value: '92.6%', change: 'Avg 1.8 Days Triage', icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50/50' },
          { label: 'Active R&D Pilots', value: '38', change: '5 Universities', icon: Building2, color: 'text-purple-700', bg: 'bg-purple-50/50' },
          { label: 'Industry & CSR Grants', value: '₹27.4 Cr', change: 'Tata Steel / CCL', icon: Briefcase, color: 'text-amber-700', bg: 'bg-amber-50/50' },
          { label: 'Duplicate Rate Filtered', value: '34.2%', change: 'Prevented redundant grants', icon: Sparkles, color: 'text-blue-700', bg: 'bg-blue-50/50' },
          { label: 'Citizens Impacted', value: '184,000+', change: '24 Districts Reached', icon: TrendingUp, color: 'text-emerald-800', bg: 'bg-emerald-100/50' }
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`${kpi.bg} p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-tight leading-tight">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div>
                <div className={`text-xl font-black ${kpi.color}`}>{kpi.value}</div>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Command Layout: Line Department Allocations & Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Department Ownership & Challenge Allocation */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Line Department Governance & Allocations</h3>
              <p className="text-xs text-slate-500">Monitoring problem resolution performance across Jharkhand state departments</p>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
              7 Active Secretariats
            </span>
          </div>

          <div className="space-y-3">
            {govDepartments.map((dept) => (
              <div key={dept.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 max-w-md">
                  <h4 className="font-extrabold text-slate-900 text-sm">{dept.name}</h4>
                  <span className="text-[11px] text-slate-500 block">{dept.minister}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">Challenges</span>
                    <strong className="text-slate-900 font-bold text-sm">{dept.activeChallenges}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">Allocated Projects</span>
                    <strong className="text-indigo-700 font-bold text-sm">{dept.allocatedProjects}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">Budget Mobilized</span>
                    <strong className="text-emerald-700 font-bold text-sm">{dept.budgetMobilized}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Unresolved Problem Clusters & Hotspots */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900">High-Priority Hotspots</h3>
            <p className="text-xs text-slate-500">Challenges requiring immediate inter-ministerial attention</p>
          </div>

          <div className="space-y-3">
            {problemClusters.slice(0, 3).map((cl) => (
              <div
                key={cl.id}
                onClick={() => {
                  setSelectedClusterId(cl.id);
                  setActiveView('cluster_detail');
                }}
                className="p-3.5 bg-slate-50 hover:bg-indigo-50 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer space-y-1.5 text-xs group"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    #{cl.id}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                    cl.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {cl.severity} Priority
                  </span>
                </div>

                <h5 className="font-bold text-slate-900 group-hover:text-indigo-800 leading-snug">
                  {cl.title}
                </h5>

                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                  <span>{cl.districtName} ({cl.block} Block)</span>
                  <span className="text-indigo-700 font-bold">Inspect &rarr;</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveView('gis_map')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <span>Open Interactive GIS Heatmap</span>
            <MapPin className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
