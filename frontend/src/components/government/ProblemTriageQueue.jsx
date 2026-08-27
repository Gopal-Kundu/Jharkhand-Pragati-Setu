import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import MarkdownRenderer from '../common/MarkdownRenderer';
import { 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Clock, 
  Users, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  Layers,
  Filter,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProblemTriageQueue() {
  const { 
    problemClusters, 
    validateAndAllocate, 
    overridePriority, 
    setSelectedClusterId, 
    setActiveView,
    heis,
    govDepartments,
    lang 
  } = useAppState();

  const [selectedHeiForAllocation, setSelectedHeiForAllocation] = useState('bit_mesra');
  const [selectedDept, setSelectedDept] = useState('dept_water');
  const [activeFilter, setActiveFilter] = useState('All'); // All, Unassigned, High Priority

  const filteredClusters = problemClusters.filter(c => {
    if (activeFilter === 'Unassigned') return c.status === 'Submitted' || c.status === 'Under Review';
    if (activeFilter === 'High Priority') return c.severity === 'High' || c.severity === 'Critical';
    return true;
  });

  const handleAllocate = (clusterId) => {
    validateAndAllocate(clusterId, selectedHeiForAllocation, selectedDept);
    try {
      confetti({ particleCount: 80, spread: 70 });
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 animate-in fade-in">
      
      {/* 1. Triage Banner (Clean White & Emerald) */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Government State Innovation Command</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-heading">
              {lang === 'hi' ? 'समस्या समीक्षा, सत्यापन एवं संस्थान आवंटन' : 'AI Triage, Validation & Institutional Allocation'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Review AI-inferred root causes, override priorities, verify ground reports, and allocate to premier Jharkhand HEIs.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs self-start sm:self-auto">
            <div>
              <span className="text-[10.5px] text-slate-500 font-medium block">Pending Validation</span>
              <strong className="text-amber-600 text-lg font-black block">
                {problemClusters.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length} Challenges
              </strong>
            </div>
          </div>
        </div>

        {/* Global Allocation Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-slate-700 text-xs font-bold mb-1.5">
              Select Destination University / HEI for Quick Allocation:
            </label>
            <select
              value={selectedHeiForAllocation}
              onChange={(e) => setSelectedHeiForAllocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            >
              {(heis || []).map(h => {
                const locText = typeof h?.location === 'object' ? (h.location.city || h.location.district || 'Jharkhand') : (h?.location || 'Jharkhand');
                return (
                  <option key={h?.id || Math.random()} value={h?.id}>{h?.name || 'HEI'} ({locText})</option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-bold mb-1.5">
              Assign Responsible Line Department:
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            >
              {(govDepartments || []).map(d => (
                <option key={d?.id || Math.random()} value={d?.id}>{d?.name || 'Department'}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {['All', 'Unassigned', 'High Priority'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {f} ({
                f === 'All' ? problemClusters.length :
                f === 'Unassigned' ? problemClusters.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length :
                problemClusters.filter(c => c.severity === 'High' || c.severity === 'Critical').length
              })
            </button>
          ))}
        </div>
      </div>

      {/* 3. Triage Queue List */}
      <div className="space-y-4">
        {filteredClusters.map((cluster) => {
          const isAllocated = cluster.status !== 'Submitted' && cluster.status !== 'Under Review';
          const topMatch = cluster.institutionMatches?.[0] || { name: 'BIT Mesra', matchScore: 94 };

          return (
            <div
              key={cluster.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-emerald-500/60 hover:shadow-xl transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                      #{cluster.id}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                      {cluster.primaryDomain}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                      cluster.severity === 'Critical' ? 'bg-rose-100 text-rose-800' :
                      cluster.severity === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {cluster.severity} ({cluster.aiIntelligence?.prioritizationScore || 90}/100)
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Stage: <strong className="text-slate-800">{cluster.status}</strong>
                    </span>
                  </div>

                  <h3 
                    onClick={() => {
                      setSelectedClusterId(cluster.id);
                      setActiveView('cluster_detail');
                    }}
                    className="text-lg sm:text-xl font-bold text-slate-900 font-heading hover:text-emerald-700 cursor-pointer transition-colors"
                  >
                    {cluster.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{cluster.block || 'Sadar'}, {cluster.districtName}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span><strong>{(cluster.affectedPopulation || 3500).toLocaleString()}</strong> Affected</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cluster.reportCount || 1} Clustered Submissions</span>
                    </span>
                  </div>
                </div>

                {/* AI Recommendation Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs min-w-[260px] space-y-1.5">
                  <span className="text-[10.5px] font-bold text-emerald-800 uppercase tracking-wider block">
                    AI Institutional Recommendation
                  </span>
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">{topMatch.name}</strong>
                    <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      {topMatch.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    {topMatch.matchRationale?.[0] || 'Aligned laboratory & faculty capability'}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-600 text-xs max-w-xl">
                  <span className="font-bold text-slate-800">AI Inferred Cause: </span>
                  <MarkdownRenderer content={cluster.aiIntelligence?.aiInferredCauses || cluster.aiIntelligence?.rootProblem} className="inline text-slate-600" />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedClusterId(cluster.id);
                      setActiveView('cluster_detail');
                    }}
                    className="text-slate-600 hover:text-slate-900 font-bold px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Inspect Full Graph &rarr;
                  </button>

                  {!isAllocated ? (
                    <button
                      onClick={() => handleAllocate(cluster.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Validate &amp; Allocate to {heis.find(h => h.id === selectedHeiForAllocation)?.shortName || 'HEI'}</span>
                    </button>
                  ) : (
                    <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl font-bold flex items-center space-x-1">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Allocated &amp; Active ({cluster.project?.leadInstitution || 'BIT Mesra'})</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
