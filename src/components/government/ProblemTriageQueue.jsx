import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
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
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      {/* Triage Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Government State Innovation Command</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              {lang === 'hi' ? 'समस्या समीक्षा, सत्यापन एवं संस्थान आवंटन' : 'AI Triage, Validation & Institutional Allocation'}
            </h2>
            <p className="text-xs text-indigo-200/80">
              Review AI-inferred root causes, override priorities, verify ground reports, and allocate to premier Jharkhand HEIs.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-2xl border border-white/10 text-xs">
            <div>
              <span className="text-[10px] text-slate-300 block">Pending Validation</span>
              <strong className="text-amber-300 text-base font-extrabold">
                {problemClusters.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length} Challenges
              </strong>
            </div>
          </div>
        </div>

        {/* Global Allocation Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div>
            <label className="block text-slate-300 text-[11px] font-semibold mb-1">
              Select Destination University / HEI for Quick Allocation:
            </label>
            <select
              value={selectedHeiForAllocation}
              onChange={(e) => setSelectedHeiForAllocation(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              {heis.map(h => (
                <option key={h.id} value={h.id}>{h.name} ({h.location})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-[11px] font-semibold mb-1">
              Assign Responsible Line Department:
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              {govDepartments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {['All', 'Unassigned', 'High Priority'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
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

      {/* Triage Queue List */}
      <div className="space-y-4">
        {filteredClusters.map((cluster) => {
          const isAllocated = cluster.status !== 'Submitted' && cluster.status !== 'Under Review';
          const topMatch = cluster.institutionMatches?.[0] || { name: 'BIT Mesra', matchScore: 94 };

          return (
            <div
              key={cluster.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded">
                      #{cluster.id}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                      {cluster.primaryDomain}
                    </span>
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded ${
                      cluster.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      cluster.severity === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {cluster.severity} ({cluster.aiIntelligence?.prioritizationScore || 90}/100)
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Stage: <strong className="text-slate-900">{cluster.status}</strong>
                    </span>
                  </div>

                  <h3 
                    onClick={() => {
                      setSelectedClusterId(cluster.id);
                      setActiveView('cluster_detail');
                    }}
                    className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-indigo-700 cursor-pointer transition-colors"
                  >
                    {cluster.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
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
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 text-xs min-w-[240px] space-y-1">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">
                    AI Institutional Recommendation
                  </span>
                  <div className="flex items-center justify-between">
                    <strong className="text-purple-950 font-extrabold">{topMatch.name}</strong>
                    <span className="text-purple-800 font-bold bg-purple-100 px-1.5 py-0.5 rounded text-[10px]">
                      {topMatch.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-[10.5px] text-purple-900 leading-tight">
                    {topMatch.matchRationale?.[0] || 'Aligned laboratory & faculty capability'}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-600 text-[11px] italic">
                  <strong>AI Inferred Cause:</strong> {cluster.aiIntelligence?.aiInferredCauses || cluster.aiIntelligence?.rootProblem}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedClusterId(cluster.id);
                      setActiveView('cluster_detail');
                    }}
                    className="text-slate-700 hover:text-slate-900 font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Inspect Full Graph &rarr;
                  </button>

                  {!isAllocated ? (
                    <button
                      onClick={() => handleAllocate(cluster.id)}
                      className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-4 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Validate & Allocate to {heis.find(h => h.id === selectedHeiForAllocation)?.shortName || 'HEI'}</span>
                    </button>
                  ) : (
                    <span className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Allocated & Active ({cluster.project?.leadInstitution || 'BIT Mesra'})</span>
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
