import React from 'react';
import { useAppState } from '../../context/StateContext';
import { 
  Sparkles, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Radio,
  FileCheck,
  Award,
  UploadCloud,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function InteractiveFlowBanner() {
  const { lang, activeRole, setActiveRole, setActiveView, activeView } = useAppState();

  const lifecyclePhases = [
    {
      step: '01',
      title: 'Citizen Media + AI Match',
      titleHi: 'नागरिक समस्या एवं AI मिलान',
      subflow: '[Citizen Uploads Media + GPS] ➔ [AI Matches] ➔ [College Receives]',
      desc: 'Ground problem reported with GPS/photos; AI structures & maps to top university labs.',
      role: 'citizen',
      view: 'citizen_home',
      icon: UploadCloud,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/50 text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      activeBorder: 'ring-2 ring-emerald-400 border-emerald-400 bg-emerald-950/40'
    },
    {
      step: '02',
      title: 'College R&D & Prototype',
      titleHi: 'कॉलेज R&D एवं प्रोटोटाइप',
      subflow: '[Students & Professors Build Working Prototype]',
      desc: 'Multidisciplinary faculty & student research teams design IoT sensors & hardware fixes.',
      role: 'university',
      view: 'uni_dashboard',
      icon: Cpu,
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/50 text-purple-400',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      activeBorder: 'ring-2 ring-purple-400 border-purple-400 bg-purple-950/40'
    },
    {
      step: '03',
      title: 'Industry / CSR Sponsor',
      titleHi: 'उद्योग एवं CSR अनुदान',
      subflow: '[Corporate CSR Grants & Industrial Fabrication]',
      desc: 'Tata Steel, CCL & Startups sponsor ₹12.5L grants, heavy sluices, and sensor hardware.',
      role: 'industry',
      view: 'ind_dashboard',
      icon: Briefcase,
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/50 text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      activeBorder: 'ring-2 ring-amber-400 border-amber-400 bg-amber-950/40'
    },
    {
      step: '04',
      title: 'Deploy, Validate & NEP Credits',
      titleHi: 'फील्ड परीक्षण, सत्यापन एवं NEP क्रेडिट',
      subflow: '[Field Deploy] ➔ [Citizen/Govt Validate] ➔ [NEP Credits & IP]',
      desc: 'Village pilot testing, IoT live telemetry verification, citizen validation & academic IP credits.',
      role: 'citizen',
      view: 'cluster_detail',
      icon: Award,
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/50 text-cyan-400',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      activeBorder: 'ring-2 ring-cyan-400 border-cyan-400 bg-cyan-950/40'
    }
  ];

  return (
    <div className="bg-slate-950 text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-xl relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <span>{lang === 'hi' ? 'संपूर्ण सामाजिक नवाचार जीवनचक्र' : 'The Societal Innovation & R&D Lifecycle'}</span>
            </h2>
            <span className="text-slate-500 text-xs hidden md:inline">
              • Click any phase to enter that workspace
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
            <span className="text-slate-400">Pipeline:</span>
            <span className="text-emerald-400 font-semibold">Problem</span>
            <span>&rarr;</span>
            <span className="text-purple-400 font-semibold">R&D Prototype</span>
            <span>&rarr;</span>
            <span className="text-amber-400 font-semibold">CSR Funding</span>
            <span>&rarr;</span>
            <span className="text-cyan-400 font-semibold">NEP Impact</span>
          </div>
        </div>

        {/* 4-Phase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {lifecyclePhases.map((phase, idx) => {
            const Icon = phase.icon;
            const isPhaseActive = 
              (phase.role === activeRole && phase.view === activeView) ||
              (phase.step === '04' && activeView === 'cluster_detail') ||
              (phase.step === '01' && activeRole === 'citizen' && activeView === 'citizen_home');

            return (
              <div
                key={phase.step}
                onClick={() => {
                  setActiveRole(phase.role);
                  setActiveView(phase.view);
                }}
                className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden bg-slate-900/90 hover:bg-slate-900 ${
                  isPhaseActive 
                    ? phase.activeBorder 
                    : 'border-slate-800 hover:border-slate-700 hover:scale-[1.02]'
                }`}
              >
                <div>
                  {/* Top Row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-black text-slate-400 group-hover:text-white transition-colors">
                        Phase {phase.step}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${phase.badge}`}>
                        {phase.role.toUpperCase()}
                      </span>
                    </div>
                    <div className={`p-1.5 rounded-xl bg-slate-800 text-slate-300 group-hover:scale-110 transition-transform ${phase.color.split(' ')[2]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Flow */}
                  <h3 className="font-black text-sm text-white group-hover:text-emerald-300 transition-colors leading-tight">
                    {lang === 'hi' ? phase.titleHi : phase.title}
                  </h3>

                  <div className="mt-1.5 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[10px] font-mono text-slate-300 leading-snug">
                    {phase.subflow}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mt-2 line-clamp-2">
                    {phase.desc}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-400 group-hover:text-emerald-400 transition-colors flex items-center space-x-1">
                    <span>Open Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  {idx < 3 && (
                    <span className="text-slate-600 text-xs font-mono hidden lg:inline">&rarr;</span>
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
