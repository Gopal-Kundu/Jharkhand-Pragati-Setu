import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Users, 
  Building2, 
  Briefcase, 
  Cpu, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Radio,
  Zap,
  Layers,
  UploadCloud,
  FileCheck,
  Check
} from 'lucide-react';

export default function ProblemNetworkGraph({ cluster, onNodeClick }) {
  const [activeNode, setActiveNode] = useState('prototype');

  const nodes = [
    {
      id: 'citizen_input',
      stepNum: '01',
      title: 'Problem Media + GPS',
      subtitle: 'Citizen uploads photo/video & GPS',
      tag: '1. Citizen Report',
      icon: UploadCloud,
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-cyan-500',
      glow: 'shadow-cyan-500/30',
      x: 180,
      y: 95,
      metrics: '4,800 affected citizens • Geotagged photos & video evidence captured'
    },
    {
      id: 'ai_review',
      stepNum: '02',
      title: 'AI Reviews & Matches',
      subtitle: 'Instant root-cause & college match',
      tag: '2. AI Engine',
      icon: Sparkles,
      color: 'from-purple-600 to-indigo-600',
      borderColor: 'border-purple-500',
      glow: 'shadow-purple-500/30',
      x: 500,
      y: 95,
      metrics: 'Prioritization score 91/100 • Categorized Water/Agri • Auto-matched to BIT Mesra'
    },
    {
      id: 'college_inbox',
      stepNum: '03',
      title: 'College R&D Inbox',
      subtitle: 'Sent to college lab directory',
      tag: '3. College Inbox',
      icon: Building2,
      color: 'from-indigo-600 to-blue-600',
      borderColor: 'border-indigo-500',
      glow: 'shadow-indigo-500/30',
      x: 820,
      y: 95,
      metrics: 'BIT Mesra Hydro-IoT Lab received challenge package with evidence'
    },
    {
      id: 'college_review_budget',
      stepNum: '04',
      title: 'Review & Budget / Govt',
      subtitle: 'Accepts issue & sanctions grant',
      tag: '4. Review & Budget',
      icon: ShieldCheck,
      color: 'from-amber-600 to-orange-600',
      borderColor: 'border-amber-500',
      glow: 'shadow-amber-500/30',
      x: 820,
      y: 285,
      metrics: 'Approved by Lead PI • ₹12.5L Grant sanctioned with State Water Resources Dept'
    },
    {
      id: 'prototype',
      stepNum: '05',
      title: 'Prototype & Live Updates',
      subtitle: 'Builds IoT fix & updates citizens',
      tag: '5. Prototype & Updates',
      icon: Cpu,
      color: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-400',
      glow: 'shadow-emerald-500/40',
      x: 500,
      y: 285,
      metrics: 'Solar IoT Hydro-Buoy & Automated Sluice built • Live progress shared with villagers'
    },
    {
      id: 'end_project',
      stepNum: '06',
      title: 'Validated & End Project',
      subtitle: 'Field tested & NEP credits',
      tag: '6. End Project',
      icon: CheckCircle2,
      color: 'from-emerald-600 to-green-500',
      borderColor: 'border-green-400',
      glow: 'shadow-green-500/40',
      x: 180,
      y: 285,
      metrics: '2,400+ villagers assured water • 8 Academic NEP Credits awarded • Problem Solved!'
    }
  ];

  const selectedNodeData = nodes.find(n => n.id === activeNode) || nodes[4];

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-5">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Interactive Living Flowchart</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Problem Intake ➔ AI Matching ➔ College R&D ➔ Live Updates ➔ End Project
          </h3>
          <p className="text-xs text-slate-400">
            Click any active node to inspect real-time telemetry, citizen data, budget allocation, and college progress.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-mono">Status:</span>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Flowchart Synchronized</span>
          </span>
        </div>
      </div>

      {/* Interactive Visual Flowchart Canvas Area */}
      <div className="relative w-full aspect-[16/7] min-h-[300px] max-h-[420px] bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
        {/* SVG Flowchart Vectors with animated laser pulses & arrows */}
        <svg viewBox="0 0 1000 380" className="w-full h-full absolute inset-0 pointer-events-none">
          <defs>
            <linearGradient id="laser-top-row" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="laser-curve-down" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="laser-bottom-row" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
            </linearGradient>

            {/* Arrow Markers */}
            <marker id="arrow-right" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#8b5cf6" />
            </marker>
            <marker id="arrow-left" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 8 1 L 0 5 L 8 9 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Top Row: 1 ➔ 2 ➔ 3 */}
          <path d="M 285 95 L 395 95" stroke="url(#laser-top-row)" strokeWidth="3" markerEnd="url(#arrow-right)" fill="none" className="opacity-90" />
          <path d="M 605 95 L 715 95" stroke="url(#laser-top-row)" strokeWidth="3" markerEnd="url(#arrow-right)" fill="none" className="opacity-90" />

          {/* Smooth U-Curve from Step 3 to Step 4 on the right */}
          <path d="M 820 140 C 930 140, 930 240, 820 240" stroke="url(#laser-curve-down)" strokeWidth="3.5" fill="none" strokeDasharray="6,4" className="opacity-80" />

          {/* Bottom Row: 4 ➔ 5 ➔ 6 (flowing right to left towards solution) */}
          <path d="M 715 285 L 605 285" stroke="url(#laser-bottom-row)" strokeWidth="3" markerEnd="url(#arrow-left)" fill="none" className="opacity-90" />
          <path d="M 395 285 L 285 285" stroke="url(#laser-bottom-row)" strokeWidth="3" markerEnd="url(#arrow-left)" fill="none" className="opacity-90" />

          {/* Animated Pulsing Signal Beacons Traveling on paths */}
          <circle cx="340" cy="95" r="4" fill="#06b6d4">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="660" cy="95" r="4" fill="#8b5cf6">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="900" cy="190" r="4.5" fill="#f59e0b">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="660" cy="285" r="4.5" fill="#10b981">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="340" cy="285" r="5" fill="#34d399">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="r" values="4;7;4" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Clickable Node Badges with Full Visible Content & Halos */}
        <div className="relative w-full h-full">
          {nodes.map((node) => {
            const Icon = node.icon;
            const isSelected = activeNode === node.id;
            return (
              <div
                key={node.id}
                onClick={() => {
                  setActiveNode(node.id);
                  if (onNodeClick) onNodeClick(node.id);
                }}
                style={{
                  left: `${(node.x / 1000) * 100}%`,
                  top: `${(node.y / 380) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute cursor-pointer transition-all duration-300 group z-20 ${
                  isSelected ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <div className={`px-4 py-3 rounded-2xl bg-slate-900/95 border ${
                  isSelected ? `${node.borderColor} shadow-2xl ${node.glow} ring-2 ring-emerald-400/60` : 'border-slate-700 hover:border-slate-500'
                } flex items-center space-x-3 min-w-[185px] max-w-[220px] backdrop-blur-md`}>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${node.color} text-white flex items-center justify-center shadow-lg flex-shrink-0 group-hover:rotate-6 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono text-[9.5px] font-black text-emerald-400">
                        STEP {node.stepNum}
                      </span>
                    </div>
                    <h5 className="font-extrabold text-xs text-white leading-snug group-hover:text-emerald-300 transition-colors">
                      {node.title}
                    </h5>
                    <span className="text-[9.5px] text-slate-400 block mt-0.5 leading-tight">
                      {node.subtitle}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Telemetry Bar */}
      <div className="bg-slate-950/90 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3.5">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedNodeData.color} text-white flex items-center justify-center flex-shrink-0 shadow-md`}>
            {React.createElement(selectedNodeData.icon, { className: 'w-5 h-5' })}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                STEP {selectedNodeData.stepNum}
              </span>
              <h4 className="font-black text-sm text-white">{selectedNodeData.title}</h4>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                {selectedNodeData.tag}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {selectedNodeData.metrics}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl">
            Live Stream: 24.8 kb/s
          </span>
        </div>
      </div>
    </div>
  );
}



