import React, { useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import CitizenPortal from '../components/citizen/CitizenPortal';
import { Sparkles, Plus } from 'lucide-react';

export default function CitizenPage() {
  const { setIsSubmitModalOpen, loadFullEcosystemData } = useAppState();

  useEffect(() => {
    loadFullEcosystemData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold font-mono uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Citizen & Community Action Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">Grassroots Societal Challenges</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Submit real-world problems from your village or town with photographic/video proof.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Challenge</span>
          </button>
        </div>
      </div>

      {/* Main Citizen Portal Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CitizenPortal />
      </div>
    </div>
  );
}
