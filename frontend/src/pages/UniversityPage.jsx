import React from 'react';
import UniversityPortal from '../components/university/UniversityPortal';
import { GraduationCap } from 'lucide-react';

export default function UniversityPage() {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
            <span>Higher Education & Student Innovation Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">University R&D & Incubation Hub</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Formulate multidisciplinary student-faculty teams, prepare solution proposals, and build prototypes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UniversityPortal />
      </div>
    </div>
  );
}
