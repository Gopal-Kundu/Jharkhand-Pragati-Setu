import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import LiveTelemetryDashboard from '../common/LiveTelemetryDashboard';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ArrowLeft, 
  ChevronRight, 
  MessageSquare, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Edit3, 
  Radio,
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProjectWorkspace() {
  const { 
    selectedCluster, 
    activeRole, 
    setActiveView, 
    setActiveRole,
    overridePriority, 
    updateMilestone, 
    pledgeIndustryPartner,
    industryPartners,
    lang 
  } = useAppState();

  const [activeTab, setActiveTab] = useState('overview');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Dr. Amitava Roy (BIT Mesra)', role: 'Lead PI', time: 'Yesterday 4:15 PM', text: 'Submersible hydrostatic level transducers calibrated at BIT Mesra Hydro-sensing lab. Field LoRaWAN telemetry to Torpa active.' },
    { id: 2, author: 'Mr. Sourav Roy (Tata Steel CSR)', role: 'Industry Partner', time: '2 days ago', text: 'Second batch of heavy galvanized motorized sluice plates dispatched to Torpa for civil fitting.' },
    { id: 3, author: 'Birsa Munda (Gram Pradhan, Dormba)', role: 'Panchayat Rep', time: '4 days ago', text: 'Villagers cleared earthen trench. Ready for automated gate test.' }
  ]);

  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideForm, setOverrideForm] = useState({
    severity: selectedCluster.severity || 'High',
    score: selectedCluster.aiIntelligence?.prioritizationScore || 90,
    officer: 'Sri Manoj Jha, IAS (Secretary, Water Resources)',
    reason: 'Elevated due to acute pre-monsoon distress and high multi-panchayat farmer dependency.'
  });

  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);
  const [pledgeForm, setPledgeForm] = useState({
    partnerId: 'tata_steel_csr',
    type: 'CSR Funding & Heavy Hardware',
    contribution: '₹12,50,000 Grant + Galvanized Sluice Assembly'
  });

  const c = selectedCluster;
  if (!c) {
    return (
      <div className="p-8 text-center text-white">
        <p className="text-sm text-slate-400">No challenge selected.</p>
        <button onClick={() => setActiveView('citizen_home')} className="mt-2 text-emerald-400 font-bold text-xs">
          Return to Portal
        </button>
      </div>
    );
  }

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newC = {
      id: Date.now(),
      author: activeRole === 'university' ? 'Dr. Priya Toppo (Faculty)' : activeRole === 'government' ? 'Director of Innovation (Govt)' : 'Concerned Stakeholder',
      role: activeRole.toUpperCase(),
      time: 'Just now',
      text: commentText
    };
    setComments(prev => [newC, ...prev]);
    setCommentText('');
  };

  const handleSaveOverride = () => {
    overridePriority(c.id, overrideForm.severity, overrideForm.score, overrideForm.reason, overrideForm.officer);
    setIsOverrideModalOpen(false);
  };

  const handleAdvanceMilestone = (mId) => {
    updateMilestone(c.id, mId, 'Completed', 100);
    try { confetti({ particleCount: 80, spread: 70 }); } catch {}
  };

  const handleSavePledge = () => {
    pledgeIndustryPartner(c.id, pledgeForm.partnerId, pledgeForm);
    setIsPledgeModalOpen(false);
    try { confetti({ particleCount: 90, spread: 80 }); } catch {}
  };

  const lifecycleStages = [
    'Submitted',
    'Validated',
    'Institution Matched',
    'Proposal Submitted',
    'Industry Joined',
    'Prototype',
    'Pilot',
    'Deployed',
    'Completed'
  ];

  const currentStageIndex = lifecycleStages.indexOf(c.status) !== -1 ? lifecycleStages.indexOf(c.status) : 6;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in text-white">
      {/* Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setActiveView(activeRole === 'government' ? 'gov_dashboard' : activeRole === 'university' ? 'uni_dashboard' : 'citizen_home')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Stakeholder Portal</span>
        </button>

        <div className="flex items-center space-x-2">
          {activeRole === 'government' && (
            <button
              onClick={() => setIsOverrideModalOpen(true)}
              className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Override AI Priority</span>
            </button>
          )}

          {activeRole === 'industry' && (
            <button
              onClick={() => setIsPledgeModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Pledge CSR Grant / Hardware</span>
            </button>
          )}

          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl">
            District: <strong className="text-white">{c.districtName}</strong>
          </span>
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Info Banner */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
                #{c.id}
              </span>
              <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                {c.primaryDomain}
              </span>
              {c.secondaryDomains?.map((sd, i) => (
                <span key={i} className="bg-slate-950 text-slate-400 text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-800">
                  + {sd}
                </span>
              ))}
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                c.severity === 'Critical' ? 'bg-red-950/80 text-red-300 border border-red-800' :
                c.severity === 'High' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'bg-blue-950/80 text-blue-300 border border-blue-800'
              }`}>
                {c.severity} Priority ({c.aiIntelligence?.prioritizationScore || 91}/100)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {lang === 'hi' && c.titleHi ? c.titleHi : c.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{c.block || 'Torpa'} Block, {c.districtName}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span><strong>{(c.affectedPopulation || 4800).toLocaleString()}</strong> Citizens Affected</span>
              </span>
              <span className="flex items-center space-x-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Intake: {c.reportedDate || '2026-03-12'}</span>
              </span>
            </div>
          </div>

          {/* Lead HEI Card */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 min-w-[250px] text-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Assigned Research Institution:
            </span>
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-900/60 text-purple-300 border border-purple-700/60 flex items-center justify-center font-bold text-xs">
                BIT
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">{c.project?.leadInstitution || 'BIT Mesra'}</h4>
                <span className="text-[10.5px] text-emerald-400 font-bold font-mono">Match Fit: 94%</span>
              </div>
            </div>

            {c.project?.industryPartners && c.project.industryPartners.length > 0 && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  Industry / CSR Backing:
                </span>
                <span className="font-bold text-amber-300 text-xs">
                  {c.project.industryPartners[0].name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 10-Stage Horizontal Lifecycle Stepper */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Project Innovation Lifecycle Progression:</span>
            <span className="text-emerald-300 font-mono font-extrabold bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
              Current Stage: {c.status}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 text-center">
            {lifecycleStages.map((st, idx) => {
              const isPast = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={st}
                  className={`p-2 rounded-xl text-[10px] font-bold transition-all border ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/50 font-black'
                      : isPast
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-center mb-0.5">
                    {isPast ? <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" /> : <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />}
                  </div>
                  <span className="leading-tight block">{st}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Telemetry Sensor Feed if Water Project */}
        {c.id === 'JH-WTR-1042' && (
          <LiveTelemetryDashboard />
        )}

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Story', icon: Layers },
            { id: 'ai_intel', label: 'AI Intelligence & Deduplication', icon: Sparkles },
            { id: 'reports', label: `Citizen Reports (${c.reportCount || 1})`, icon: FileText },
            { id: 'team_proposal', label: 'University Team & Proposal', icon: Users },
            { id: 'industry', label: 'Industry & CSR Pledges', icon: Briefcase },
            { id: 'milestones', label: 'Milestone Tracking', icon: CheckCircle2 },
            { id: 'impact', label: 'Measurable Impact KPIs', icon: TrendingUp },
            { id: 'discussions', label: `Discussion (${comments.length})`, icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 py-3 px-4 border-b-2 font-bold text-xs whitespace-nowrap cursor-pointer transition-all ${
                  isActive
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40 rounded-t-xl'
                    : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in text-xs">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-white">Problem Summary & Citizen Narrative</h4>
                <p className="text-slate-300 leading-relaxed italic">
                  "{c.aiIntelligence?.citizenObserved || 'Citizen reported societal constraint.'}"
                </p>
                <div className="pt-2 border-t border-slate-800 text-slate-300">
                  <strong className="text-emerald-400">AI Root Cause Analysis:</strong> {c.aiIntelligence?.rootProblem}
                </div>
              </div>

              {/* Active Project Card */}
              {c.project && (
                <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-2xl p-5 border border-indigo-800/60 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                      Active Innovation Project • {c.project.projectId}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                      Stage: {c.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white">
                    {c.project.title}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Lead Institution</span>
                      <strong className="text-white">{c.project.leadInstitution}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Govt Grant</span>
                      <strong className="text-emerald-400">{c.project.budget.govtGrantApproved}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">CSR Funding</span>
                      <strong className="text-amber-400">{c.project.budget.industryCSRContribution}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Team Members</span>
                      <strong className="text-white">{c.project.teamMembers.length} Specialists</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Impact Banner */}
              {c.project?.impactMetrics && (
                <div className="bg-emerald-950/40 rounded-2xl p-4 border border-emerald-800/60 space-y-3">
                  <h4 className="font-extrabold text-xs text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Real-World Social Impact Achieved in Khunti</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {c.project.impactMetrics.map((m, i) => (
                      <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-semibold text-slate-400 block leading-tight">{m.indicator}</span>
                        <div className="mt-1 flex items-baseline justify-between">
                          <span className="text-base font-black text-emerald-400 font-mono">{m.achieved}</span>
                        </div>
                        <span className="text-[9.5px] text-slate-500 font-mono">Target: {m.target}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-white">Aligned UN SDGs & State Priorities</h4>
                <div className="space-y-1.5">
                  {(c.sdgGoals || ['SDG 6: Clean Water & Sanitation', 'SDG 1: No Poverty']).map((sdg, i) => (
                    <div key={i} className="bg-slate-900 p-2 rounded-lg font-bold text-slate-200 border border-slate-800">
                      {sdg}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-white">Field Evidence Photographs</h4>
                <div className="grid grid-cols-2 gap-2">
                  {c.reports?.[0]?.media?.map((m, idx) => (
                    <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-800">
                      <img src={m.url} alt={m.caption} className="w-full h-24 object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-950/90 text-white text-[9px] p-1 truncate font-mono">
                        {m.caption}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MILESTONE TRACKING */}
        {activeTab === 'milestones' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white">Project Milestone Execution Tracker</h4>
                <p className="text-slate-400 text-[11px]">Verify progress deliverables from laboratory testing to community deployment.</p>
              </div>
              <span className="text-emerald-400 font-mono font-bold">
                {c.project?.milestones?.filter(m => m.status === 'Completed').length || 0} of {c.project?.milestones?.length || 6} Completed
              </span>
            </div>

            <div className="space-y-3">
              {c.project?.milestones?.map((m) => (
                <div key={m.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        m.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                        m.status === 'In-Progress' ? 'bg-blue-950 text-blue-300 border border-blue-700' : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        {m.id} • {m.status}
                      </span>
                      <h5 className="font-extrabold text-white text-xs">{m.title}</h5>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500 font-mono text-[11px]">Due: {m.dueDate}</span>
                      {m.status !== 'Completed' && (
                        <button
                          onClick={() => handleAdvanceMilestone(m.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[11px] px-3 py-1 rounded-lg transition-all cursor-pointer shadow-md"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-300 text-[11.5px] leading-relaxed">
                    <strong>Deliverables:</strong> {m.deliverables}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: DISCUSSIONS */}
        {activeTab === 'discussions' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <form onSubmit={handleAddComment} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Post update or request clarification as ${activeRole}...`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Post Note
              </button>
            </form>

            <div className="space-y-3">
              {comments.map((cm) => (
                <div key={cm.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <strong className="text-white font-bold">{cm.author}</strong>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {cm.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">{cm.time}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{cm.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
