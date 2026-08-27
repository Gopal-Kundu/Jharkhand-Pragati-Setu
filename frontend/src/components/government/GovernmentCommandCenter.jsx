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
    <div className="space-y-6 max-w-7xl mx-auto py-2 animate-in fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>State Apex Innovation &amp; Governance Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
            {lang === 'hi' ? 'झारखंड नवाचार एवं अनुसंधान अनुश्रवण डैशबोर्ड' : 'Jharkhand Innovation & Impact Monitoring Command Center'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time telemetry across 24 districts, 7 departments, 5 state universities, and 4 corporate CSR funds.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start md:self-auto">
          <button
            onClick={() => setActiveView('gov_triage')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer transition-all hover:scale-105 flex items-center space-x-1.5"
          >
            <span>Open Problem Triage Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAuditDrawerOpen(true)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Audit Log
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          { label: 'Total Challenges Submitted', value: '524', change: '+14% this month', icon: FileText, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Validation Rate', value: '92.6%', change: 'Avg 1.8 Days Triage', icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-white' },
          { label: 'Active R&D Pilots', value: '38', change: '5 Universities', icon: Building2, color: 'text-emerald-800', bg: 'bg-white' },
          { label: 'Industry & CSR Grants', value: '₹27.4 Cr', change: 'Tata Steel / CCL', icon: Briefcase, color: 'text-amber-700', bg: 'bg-white' },
          { label: 'Duplicate Rate Filtered', value: '34.2%', change: 'Prevented redundant grants', icon: Sparkles, color: 'text-slate-800', bg: 'bg-white' },
          { label: 'Citizens Impacted', value: '184,000+', change: '24 Districts Reached', icon: TrendingUp, color: 'text-emerald-700', bg: 'bg-white' }
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`${kpi.bg} p-4 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between`}>
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
              <h3 className="font-bold text-lg text-slate-900 font-heading">Line Department Governance &amp; Allocations</h3>
              <p className="text-xs text-slate-500">Monitoring problem resolution performance across Jharkhand state departments</p>
            </div>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
              7 Active Secretariats
            </span>
          </div>

          <div className="space-y-3">
            {(govDepartments || []).map((dept) => (
              <div key={dept?.id || Math.random()} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 max-w-md">
                  <h4 className="font-bold text-slate-900 text-sm font-heading">{dept?.name || 'Department'}</h4>
                  <span className="text-[11px] text-slate-500 block">{dept?.minister || 'Secretariat Lead'}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block font-medium">Challenges</span>
                    <strong className="text-slate-900 font-bold text-sm">{dept?.activeChallenges ?? 0}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block font-medium">Allocated Projects</span>
                    <strong className="text-emerald-700 font-bold text-sm">{dept?.allocatedProjects ?? 0}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block font-medium">Budget Mobilized</span>
                    <strong className="text-emerald-800 font-bold text-sm">{dept?.budgetMobilized || '₹0'}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Unresolved Problem Clusters & Hotspots */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-lg text-slate-900 font-heading">High-Priority Hotspots</h3>
            <p className="text-xs text-slate-500">Challenges requiring immediate inter-ministerial attention</p>
          </div>

          <div className="space-y-3">
            {(problemClusters || []).slice(0, 3).map((cl) => {
              const clusterId = cl?.ticketId || cl?.id || 'CL-01';
              return (
                <div
                  key={clusterId}
                  onClick={() => {
                    setSelectedClusterId(clusterId);
                    setActiveView('cluster_detail');
                  }}
                  className="p-4 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer space-y-2 text-xs group"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] font-black text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      #{clusterId}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      cl?.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cl?.severity || 'High'} Priority
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-900 group-hover:text-emerald-800 leading-snug">
                    {cl?.title || 'Societal Problem Statement'}
                  </h5>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                    <span>{cl?.districtName || cl?.location?.district || 'Jharkhand'} ({cl?.block || cl?.location?.block || 'Sadar'} Block)</span>
                    <span className="text-emerald-700 font-bold">Inspect &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveView('gis_map')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <span>Open Interactive GIS Heatmap</span>
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
