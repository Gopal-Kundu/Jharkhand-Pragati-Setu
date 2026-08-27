import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import GovernmentCommandCenter from '../components/government/GovernmentCommandCenter';
import ProblemTriageQueue from '../components/government/ProblemTriageQueue';
import { Building2, ShieldCheck, BarChart3 } from 'lucide-react';

export default function GovernmentPage() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'triage'
  const { loadFullEcosystemData } = useAppState();

  useEffect(() => {
    loadFullEcosystemData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Government of Jharkhand & State Innovation Council</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">Executive Command Center</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Monitor incoming challenges, AI triage accuracy, HEI allocations, and statewide social outcomes.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 p-1.5 rounded-2xl shadow-inner">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Executive Telemetry</span>
            </button>
            <button
              onClick={() => setActiveTab('triage')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'triage'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Triage & Allocation Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Government Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' ? <GovernmentCommandCenter /> : <ProblemTriageQueue />}
      </div>
    </div>
  );
}
