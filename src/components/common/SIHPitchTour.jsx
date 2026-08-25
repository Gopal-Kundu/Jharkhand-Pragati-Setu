import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  Cpu, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SIHPitchTour({ isOpen, onClose, onJumpToView }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const pitchSteps = [
    {
      stepNum: '01',
      badge: 'Grassroots Reality',
      title: 'Real-World Problem: Seasonal Pond Drying in Khunti',
      highlight: '17 Independent Citizen & Panchayat Reports',
      desc: 'In Dormba village (Torpa block), the main earthen pond dries up by February. 4,800 villagers across 3 Panchayats lose their rabi crop water supply, and women walk 3.8 km daily for drinking water.',
      stat: '4,800 Citizens Affected',
      statSub: '17 Reports Clustered by AI',
      role: 'citizen',
      targetView: 'cluster_detail',
      icon: Users,
      accentColor: 'from-blue-600 to-cyan-600'
    },
    {
      stepNum: '02',
      badge: 'AI Problem Intelligence Engine',
      title: 'Semantic Deduplication & Root-Cause Structuring',
      highlight: 'Separates Citizen Symptoms from Underlying Causes',
      desc: 'Instead of treating 17 reports as separate tickets, AI clusters them into Challenge #JH-WTR-1042. It diagnoses catchment siltation & lack of recharge telemetry, and scores priority at 91/100.',
      stat: '96% AI Confidence',
      statSub: 'Priority Score 91/100',
      role: 'government',
      targetView: 'gov_triage',
      icon: Sparkles,
      accentColor: 'from-purple-600 to-indigo-600'
    },
    {
      stepNum: '03',
      badge: 'Government Command',
      title: 'Official Validation & Fast-Track Allocation',
      highlight: 'Audited Priority Override & Inter-Departmental Ownership',
      desc: 'State Water Resources Secretariat reviews the AI triage factor breakdown, issues a recorded Priority Override under the South Chotanagpur Drought Plan, and allocates to premier universities.',
      stat: '1.8 Days Triage Speed',
      statSub: 'Tamper-Evident Audit Log',
      role: 'government',
      targetView: 'gov_dashboard',
      icon: ShieldCheck,
      accentColor: 'from-amber-600 to-orange-600'
    },
    {
      stepNum: '04',
      badge: 'University R&D Network',
      title: 'BIT Mesra & BAU Multidisciplinary Team Assembled',
      highlight: '94% Institutional Capability Fit',
      desc: 'BIT Mesra Centre for Water & IoT accepts the challenge. Dr. Amitava Roy (Hydrology) and Dr. Priya Toppo (IoT) partner with BAU Agronomists and the local Mukhiya to charter PRJ-JH-2026-004.',
      stat: '6-Faculty Cross Team',
      statSub: 'BIT Mesra + BAU + Mukhiya',
      role: 'university',
      targetView: 'uni_dashboard',
      icon: Building2,
      accentColor: 'from-indigo-600 to-purple-600'
    },
    {
      stepNum: '05',
      badge: 'Corporate CSR & DeepTech Startup',
      title: 'Tata Steel CSR & JalDrishti IoT Co-Creation',
      highlight: '₹12.5L Grant + Galvanized Sluice Hardware Pledged',
      desc: 'Tata Steel Foundation joins with ₹12.5 Lakhs CSR grant and heavy gate tooling. JalDrishti IoT Labs provides submersible hydrostatic level transducers over LoRaWAN.',
      stat: '₹12.5L CSR Funding',
      statSub: '15 LoRaWAN Probes Pledged',
      role: 'industry',
      targetView: 'ind_dashboard',
      icon: Briefcase,
      accentColor: 'from-amber-500 to-yellow-600'
    },
    {
      stepNum: '06',
      badge: 'Community Pilot Deployed',
      title: 'Solar Hydro-Telemetry & Automated Gate Deployed',
      highlight: 'Stage 5 of 6 Milestone Active at Dormba Pond',
      desc: 'Field installation completed at Dormba pond. 2 solar hydro-buoys transmit water depth & pH every 15 minutes, controlling motorized micro-sluice gates configured for vegetable irrigation.',
      stat: 'Live Telemetry Active',
      statSub: '90% Pilot Milestone Complete',
      role: 'citizen',
      targetView: 'cluster_detail',
      icon: Cpu,
      accentColor: 'from-emerald-500 to-teal-600'
    },
    {
      stepNum: '07',
      badge: 'Measurable Social Outcome',
      title: 'Real-World Human Impact & State-Wide Scaling',
      highlight: 'Proven Impact Across 24 Districts',
      desc: 'Over 2,400 villagers currently have assured drinking water, 300% expansion in vegetable crop revenue, 3.1 km walking distance saved, and zero summer diarrhea cases reported at the local PHC.',
      stat: '2,400+ Citizens Transformed',
      statSub: 'Scale-out to 14 Panchayats',
      role: 'public',
      targetView: 'public_portal',
      icon: TrendingUp,
      accentColor: 'from-emerald-600 to-green-500'
    }
  ];

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (isPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < pitchSteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            try { confetti({ particleCount: 120, spread: 90 }); } catch {}
            return prev;
          }
        });
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isOpen]);

  if (!isOpen) return null;

  const current = pitchSteps[currentStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStep < pitchSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try { confetti({ particleCount: 100, spread: 80 }); } catch {}
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleJump = () => {
    onJumpToView(current.role, current.targetView);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 w-full max-w-3xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative text-white">
        {/* Top ambient glow bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-600" />

        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Award className="w-5 h-5 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base tracking-tight">
                  SIH 2026 Live Pitch Tour • Jharkhand Pragati Setu
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono px-2 py-0.5 rounded-full font-bold">
                  Stage {current.stepNum} / 07
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-End Innovation Story: From Grassroots Pond Crisis to AI, University R&D, CSR & Deployment
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Auto-Play' : 'Auto-Play Tour'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-7 gap-1 bg-slate-950 px-4 py-2 border-b border-slate-800">
          {pitchSteps.map((st, i) => (
            <div
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-1.5 rounded-full cursor-pointer transition-all ${
                i === currentStep
                  ? 'bg-emerald-400 shadow-md shadow-emerald-400/50'
                  : i < currentStep
                  ? 'bg-emerald-700'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Main Content Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
              {current.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Stakeholder: <strong className="text-white capitalize">{current.role}</strong>
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {current.title}
            </h2>
            <p className="text-sm font-semibold text-emerald-300">
              ★ {current.highlight}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {current.desc}
            </p>
          </div>

          {/* Key Metric Card */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10.5px] text-slate-400 block font-mono uppercase">Key Innovation Metric:</span>
              <strong className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">{current.stat}</strong>
            </div>
            <div>
              <span className="text-[10.5px] text-slate-400 block font-mono uppercase">System Signal:</span>
              <strong className="text-sm font-bold text-slate-200 mt-1 block">{current.statSub}</strong>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleJump}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs px-4 py-2 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
            >
              <span>Inspect Live Screen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center space-x-1"
            >
              <span>{currentStep === pitchSteps.length - 1 ? 'Finish Tour 🎉' : 'Next Stage'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
