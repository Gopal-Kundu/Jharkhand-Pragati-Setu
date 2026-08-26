import React from 'react';
import { useAppState } from '../../context/StateContext';
import { FileText, X, ShieldCheck, Clock, UserCheck, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function AuditLogDrawer() {
  const { isAuditDrawerOpen, setIsAuditDrawerOpen, auditLogs, setSelectedClusterId, setActiveView } = useAppState();

  if (!isAuditDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight">Government Audit & Integrity Trail</h3>
                <p className="text-[11px] text-slate-400 font-medium">Tamper-evident log of validations, merges & overrides</p>
              </div>
            </div>
            <button
              onClick={() => setIsAuditDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Total Recorded Events: <strong className="text-slate-900">{auditLogs.length}</strong></span>
            <span className="flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1" />
              Live Governance Ledger
            </span>
          </div>

          {/* Log Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{log.timestamp}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
                  {log.note}
                </p>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center space-x-1">
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    <span>{log.officer}</span>
                  </div>

                  {log.target && (
                    <button
                      onClick={() => {
                        setSelectedClusterId(log.target);
                        setActiveView('cluster_detail');
                        setIsAuditDrawerOpen(false);
                      }}
                      className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center space-x-0.5 hover:underline cursor-pointer"
                    >
                      <span>#{log.target}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
            Secured under Government of Jharkhand Open Governance & RTPS Framework
          </div>
        </div>
      </div>
    </div>
  );
}
