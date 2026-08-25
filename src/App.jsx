import React, { useState } from 'react';
import { StateProvider, useAppState } from './context/StateContext';
import Navbar from './components/common/Navbar';
import InteractiveFlowBanner from './components/common/InteractiveFlowBanner';
import AIAssistantModal from './components/common/AIAssistantModal';
import AuditLogDrawer from './components/common/AuditLogDrawer';
import SIHPitchTour from './components/common/SIHPitchTour';
import MultiStepSubmissionModal from './components/citizen/MultiStepSubmissionModal';
import CitizenPortal from './components/citizen/CitizenPortal';
import PanchayatPortal from './components/panchayat/PanchayatPortal';
import GovernmentCommandCenter from './components/government/GovernmentCommandCenter';
import ProblemTriageQueue from './components/government/ProblemTriageQueue';
import UniversityPortal from './components/university/UniversityPortal';
import IndustryPortal from './components/industry/IndustryPortal';
import JharkhandGISMap from './components/gis/JharkhandGISMap';
import ProjectWorkspace from './components/projects/ProjectWorkspace';
import PublicDiscoveryPortal from './components/public/PublicDiscoveryPortal';
import { ShieldCheck, Sparkles, MapPin, Globe, Award, Radio } from 'lucide-react';

function MainAppContent() {
  const { activeView, activeRole, setActiveView, setActiveRole, lang } = useAppState();
  const [isPitchTourOpen, setIsPitchTourOpen] = useState(false);

  const handleJumpFromTour = (role, view) => {
    setActiveRole(role);
    setActiveView(view);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'citizen_home':
        return <CitizenPortal />;
      case 'panchayat_portal':
        return <PanchayatPortal />;
      case 'gov_dashboard':
        return <GovernmentCommandCenter />;
      case 'gov_triage':
        return <ProblemTriageQueue />;
      case 'gov_analytics':
        return <GovernmentCommandCenter />;
      case 'uni_dashboard':
      case 'uni_challenges':
      case 'uni_team':
        return <UniversityPortal />;
      case 'ind_dashboard':
      case 'ind_projects':
        return <IndustryPortal />;
      case 'gis_map':
        return <JharkhandGISMap />;
      case 'public_portal':
        return <PublicDiscoveryPortal />;
      case 'cluster_detail':
        return <ProjectWorkspace />;
      default:
        return <CitizenPortal />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar onOpenPitchTour={() => setIsPitchTourOpen(true)} />

      {/* Interactive 10-Stage Pipeline Banner */}
      <InteractiveFlowBanner />

      {/* Modern Sub-Nav Strip */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-2 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-bold">
            <button
              onClick={() => setActiveView(activeRole === 'government' ? 'gov_dashboard' : activeRole === 'university' ? 'uni_dashboard' : activeRole === 'industry' ? 'ind_dashboard' : activeRole === 'panchayat' ? 'panchayat_portal' : 'citizen_home')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView !== 'gis_map' && activeView !== 'public_portal' && activeView !== 'cluster_detail' && activeView !== 'gov_triage'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              Perspective Home
            </button>

            <button
              onClick={() => setActiveView('gis_map')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'gis_map'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Jharkhand 24-District GIS Map</span>
            </button>

            {activeRole === 'government' && (
              <button
                onClick={() => setActiveView('gov_triage')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeView === 'gov_triage'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AI Problem Triage Inbox</span>
              </button>
            )}

            <button
              onClick={() => setActiveView('public_portal')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'public_portal'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Discovery & Impact</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden md:flex items-center space-x-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Active Perspective:</span>
            <strong className="text-emerald-300 uppercase">{activeRole} Workspace</strong>
          </div>
        </div>
      </div>

      {/* Main Body View */}
      <main className="flex-1 pb-12">
        {renderActiveView()}
      </main>

      {/* Modals & Slide-outs */}
      <MultiStepSubmissionModal />
      <AIAssistantModal />
      <AuditLogDrawer />
      <SIHPitchTour 
        isOpen={isPitchTourOpen} 
        onClose={() => setIsPitchTourOpen(false)} 
        onJumpToView={handleJumpFromTour} 
      />

      {/* Modern Dark Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <img src="/jharkhand_logo.svg" alt="Jharkhand Emblem" className="w-8 h-8" />
              <span className="font-black text-white text-sm">Jharkhand Pragati Setu</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Smart India Hackathon 2026 Innovation Portal: Converting grassroots societal problems into structured research, multidisciplinary university teams, and corporate CSR deployments.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-2 font-mono">Academic Hubs</h4>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>• BIT Mesra Centre for Water & IoT</li>
              <li>• IIT (ISM) Dhanbad Geosciences</li>
              <li>• Birsa Agricultural University (BAU)</li>
              <li>• NIT Jamshedpur Clean Energy Lab</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-2 font-mono">CSR Partners</h4>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>• Tata Steel Foundation (Jamshedpur)</li>
              <li>• Central Coalfields Limited (CCL CSR)</li>
              <li>• Adani Solar & Decarbonization</li>
              <li>• JalDrishti Telemetry Labs (Startup)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-2 font-mono">State Helpline</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Grievance & Innovation Desk: <strong>1800-345-XXXX</strong><br />
              Email: <code>innovation@jharkhand.gov.in</code><br />
              Secretariat: Project Building, Dhurwa, Ranchi - 834004
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 font-mono">
          <span>© 2026 Government of Jharkhand • SIH 2026 Special Edition</span>
          <span>Engineered for Real-World Societal Impact.</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <StateProvider>
      <MainAppContent />
    </StateProvider>
  );
}
