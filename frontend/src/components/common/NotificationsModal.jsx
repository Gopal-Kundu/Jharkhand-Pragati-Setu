import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  GraduationCap,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function NotificationsModal({ isOpen, onClose, notifications = [], onViewProblem }) {
  if (!isOpen) return null;

  const displayNotifications = Array.isArray(notifications) ? notifications : [];

  const getTimeAgo = (dateStr) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 5) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Bell className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                All Notifications
              </h2>
              <p className="text-xs text-slate-500">
                Live research milestones, university lab allocations, and grant updates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {displayNotifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-sm text-slate-700">No Notifications</p>
              <p className="text-xs text-slate-500">You're all caught up! Updates on your reported challenges will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayNotifications.map((notif, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      <h4 className="font-bold text-sm text-slate-900 font-heading">
                        {notif.title}
                      </h4>
                      {notif.schemaName && (
                        <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {notif.schemaName}
                        </span>
                      )}
                      {notif.ticketId && (
                        <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-slate-200/80 text-slate-800">
                          #{notif.ticketId}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 pl-4 leading-relaxed">
                      {notif.description || notif.message}
                    </p>

                    <div className="text-[11px] text-slate-400 pl-4 pt-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(notif.createdAt)}</span>
                    </div>
                  </div>

                  {notif.ticketId && onViewProblem && (
                    <button
                      onClick={() => {
                        onClose();
                        onViewProblem(notif.ticketId);
                      }}
                      className="self-center p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer whitespace-nowrap"
                      title="View problem details"
                    >
                      <span className="hidden sm:inline">Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
          <span>Notifications are synchronized with live state pipeline</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
