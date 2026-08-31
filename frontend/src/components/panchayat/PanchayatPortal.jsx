import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { 
  Landmark, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  PlusCircle, 
  ArrowRight,
  FileCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PanchayatPortal() {
  const { 
    problemClusters, 
    setSelectedClusterId, 
    setActiveView, 
    setIsSubmitModalOpen, 
    lang 
  } = useAppState();

  const [verifiedList, setVerifiedList] = useState(['REP-1042-01', 'REP-1042-02']);

  const handleVerifyReport = (repId) => {
    setVerifiedList(prev => [...prev, repId]);
    try {
      confetti({ particleCount: 50, spread: 50 });
    } catch {}
  };

  const torpaCluster = (problemClusters || []).find(c => c?._id === '6a8f979344a88f09289b5633' || c?.domain === 'Water Resources') || (problemClusters && problemClusters[0]) || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      {/* Panchayat Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-teal-500/30 border border-teal-400/40 text-teal-200 text-xs font-bold px-3 py-1 rounded-full">
              <Landmark className="w-3.5 h-3.5" />
              <span>Panchayati Raj Institutions & Urban Local Bodies (ULB) Portal</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Gram Panchayat Dormba & Torpa Block Command
            </h1>
            <p className="text-xs text-teal-200/80">
              Khunti District • Mukhiya: Sri Birsa Munda • Block Development Office (BDO) Linkage
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow cursor-pointer transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Official Gram Sabha Challenge</span>
          </button>
        </div>
      </div>

      {/* Verification Inbox & Active Village Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Citizen Submissions Verification Queue */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Panchayat Field Verification Queue
              </h3>
              <p className="text-xs text-slate-500">
                Verify citizen reported photographs, population numbers, and urgency for government allocation.
              </p>
            </div>
            <span className="text-xs text-teal-800 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">
              Jurisdiction: Torpa Block
            </span>
          </div>

          <div className="space-y-3">
            {torpaCluster.reports?.map((rep) => {
              const isDone = verifiedList.includes(rep.id);
              return (
                <div key={rep.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {rep.id}
                      </span>
                      <strong className="text-slate-900 text-sm">{rep.submittedBy}</strong>
                      <span className="text-[10px] bg-teal-100 text-teal-900 font-semibold px-2 py-0.5 rounded-full">
                        {rep.role}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px]">{rep.village}</span>
                  </div>

                  <p className="text-slate-700 text-xs leading-relaxed italic">
                    "{rep.narrative}"
                  </p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      Phone: <strong className="text-slate-800">{rep.phone}</strong>
                    </span>

                    {isDone ? (
                      <span className="text-emerald-700 font-bold flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded">
                        <Check className="w-3.5 h-3.5" />
                        <span>Panchayat Verified</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVerifyReport(rep.id)}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-1 rounded-lg shadow-xs cursor-pointer"
                      >
                        Confirm Panchayat Verification
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Village Pilots Track */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900">Active Village Pilots</h3>
            <p className="text-xs text-slate-500">Track implementation teams working in your Panchayat</p>
          </div>

          <div
            onClick={() => {
              setSelectedClusterId('JH-WTR-1042');
              setActiveView('cluster_detail');
            }}
            className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 hover:border-emerald-500 transition-all cursor-pointer space-y-2 text-xs"
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                #JH-WTR-1042
              </span>
              <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                Stage: Community Pilot
              </span>
            </div>

            <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
              Dormba Village Pond Solar Telemetry & Gate Automation
            </h4>

            <p className="text-slate-700 text-[11.5px] leading-relaxed">
              BIT Mesra research team & Tata Steel Foundation are currently testing automated solar water release valves.
            </p>

            <div className="pt-2 flex justify-between items-center text-[11px] text-emerald-900 font-bold">
              <span>2,400 Beneficiaries</span>
              <span>Open Pilot Dashboard &rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
