import React from 'react';
import IndustryPortal from '../components/industry/IndustryPortal';
import { Briefcase } from 'lucide-react';

export default function IndustryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-1">
            <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
            <span>Corporate Social Responsibility & Startup Ecosystem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">Industry CSR & MSME Marketplace</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Co-sponsor university prototypes, disburse CSR matching grants, and deploy corporate mentors.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IndustryPortal />
      </div>
    </div>
  );
}
