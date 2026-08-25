import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  Globe, 
  Sparkles, 
  Bell, 
  FileText, 
  PlusCircle, 
  Search, 
  RotateCcw,
  Landmark,
  Radio,
  Award,
  Zap,
  Activity
} from 'lucide-react';

export default function Navbar({ onOpenPitchTour }) {
  const {
    lang,
    setLang,
    activeRole,
    setActiveRole,
    activeView,
    setActiveView,
    setIsSubmitModalOpen,
    setIsAssistantOpen,
    setIsAuditDrawerOpen,
    notifications,
    resetToDefaultData
  } = useAppState();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const roles = [
    { id: 'citizen', label: 'Citizen / Community', labelHi: 'नागरिक / समुदाय', icon: Users, defaultView: 'citizen_home', color: 'from-emerald-500 to-teal-600', activeGlow: 'shadow-emerald-500/30 text-emerald-400' },
    { id: 'panchayat', label: 'Panchayati Raj / ULB', labelHi: 'पंचायती राज / निकाय', icon: Landmark, defaultView: 'panchayat_portal', color: 'from-teal-500 to-cyan-600', activeGlow: 'shadow-teal-500/30 text-teal-400' },
    { id: 'government', label: 'Govt Apex Command', labelHi: 'सरकारी कमांड', icon: ShieldCheck, defaultView: 'gov_dashboard', color: 'from-indigo-500 to-blue-600', activeGlow: 'shadow-indigo-500/30 text-indigo-400' },
    { id: 'university', label: 'University / HEI Hub', labelHi: 'विश्वविद्यालय R&D', icon: GraduationCap, defaultView: 'uni_dashboard', color: 'from-purple-500 to-indigo-600', activeGlow: 'shadow-purple-500/30 text-purple-400' },
    { id: 'industry', label: 'Industry & CSR Partner', labelHi: 'उद्योग एवं CSR', icon: Briefcase, defaultView: 'ind_dashboard', color: 'from-amber-500 to-yellow-600', activeGlow: 'shadow-amber-500/30 text-amber-400' },
    { id: 'public', label: 'Public Innovation Map', labelHi: 'सार्वजनिक नवाचार', icon: Globe, defaultView: 'public_portal', color: 'from-cyan-500 to-blue-600', activeGlow: 'shadow-cyan-500/30 text-cyan-400' }
  ];

  const handleRoleChange = (roleId) => {
    setActiveRole(roleId);
    const targetRole = roles.find(r => r.id === roleId);
    if (targetRole) {
      setActiveView(targetRole.defaultView);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl transition-all">
      {/* Top Cyber Telemetry & State Utility Bar */}
      <div className="bg-slate-900/95 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <span className="font-extrabold text-emerald-400 tracking-tight flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Govt of Jharkhand • State Innovation & R&D Network</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden md:inline text-slate-400 font-mono text-[11px]">
            Node: RANCHI-APEX-01 • Telemetry: <strong className="text-cyan-400">ACTIVE</strong>
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* SIH Hackathon Pitch Tour CTA */}
          <button 
            onClick={onOpenPitchTour}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-3 py-0.5 rounded-full text-[11px] shadow-md shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-slate-950" />
            <span>🚀 SIH Pitch Tour</span>
          </button>

          <span className="text-slate-700">|</span>

          {/* Reset Demo Data Button */}
          <button 
            onClick={resetToDefaultData}
            title="Reset to default reference demo scenario"
            className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
          >
            <RotateCcw className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <span className="text-slate-700">|</span>

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 text-xs font-semibold border border-slate-800">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-md cursor-pointer transition-all ${lang === 'en' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2 py-0.5 rounded-md cursor-pointer transition-all ${lang === 'hi' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Portal Identity */}
          <div 
            onClick={() => { setActiveRole('public'); setActiveView('public_portal'); }}
            className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
          >
            <div className="relative">
              <img 
                src="/jharkhand_logo.svg" 
                alt="Jharkhand Govt Emblem" 
                className="w-10 h-10 transition-transform group-hover:scale-105" 
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg text-white tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
                  Jharkhand Pragati Setu
                </span>
                <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  v2.0 DeepTech
                </span>
              </div>
              <p className="text-[10.5px] font-medium text-slate-400 leading-tight">
                {lang === 'hi' ? 'झारखंड सामाजिक नवाचार एवं अनुसंधान सहभागिता नेटवर्क' : 'Societal Innovation & University-Industry Collab Platform'}
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'hi' ? 'समस्या या अनुसंधान खोजें...' : 'Search challenges, HEIs, SDGs...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 text-white text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500 transition-all font-medium"
            />
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Sangi AI Assistant Trigger */}
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg shadow-purple-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span>Sangi AI Copilot</span>
            </button>

            {/* Report Problem CTA */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>{lang === 'hi' ? 'समस्या दर्ज करें' : 'Report Challenge'}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors relative cursor-pointer"
                title="Live Events"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Live System Events</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold">{notifications.length} events</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-slate-800/50 text-xs transition-colors">
                        <p className="font-semibold text-slate-200">{n.title}</p>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Governance Audit Log Button */}
            <button
              onClick={() => setIsAuditDrawerOpen(true)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors cursor-pointer"
              title="View Public Governance Audit Trail"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Two Primary Login / Perspective Options */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold hidden sm:inline">
              SELECT PORTAL MODE:
            </span>

            {/* Option 1: Normal Person */}
            <button
              onClick={() => handleRoleChange('citizen')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md ${
                activeRole === 'citizen'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 ring-2 ring-emerald-400/50 shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Users className={`w-4 h-4 ${activeRole === 'citizen' ? 'text-slate-950' : 'text-emerald-400'}`} />
              <span>👤 1. Normal Citizen (Upload Media + GPS)</span>
            </button>

            {/* Option 2: College Authority */}
            <button
              onClick={() => handleRoleChange('university')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md ${
                activeRole === 'university'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white ring-2 ring-purple-400/50 shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${activeRole === 'university' ? 'text-white' : 'text-purple-400'}`} />
              <span>🎓 2. College Authority (Review, Approve & Updates)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => {
                setActiveRole('citizen');
                setActiveView('cluster_detail');
              }}
              className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold px-3 py-1.5 rounded-xl border border-emerald-500/40 text-[11px] transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Torpa Water R&D (#JH-WTR-1042)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gov Tricolor Accent Bar */}
      <div className="gov-tricolor-bar" />
    </header>
  );
}
