import React, { useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import PanchayatPortal from '../components/panchayat/PanchayatPortal';
import { Layers } from 'lucide-react';

export default function PanchayatPage() {
  const { loadFullEcosystemData } = useAppState();

  useEffect(() => {
    loadFullEcosystemData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>Panchayati Raj Institutions (PRI) & Urban Local Bodies (ULB)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">Gram Panchayat & Ward Escalation Portal</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Endorse community challenges, prioritize local water/agri crises, and coordinate field trials.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PanchayatPortal />
      </div>
    </div>
  );
}
