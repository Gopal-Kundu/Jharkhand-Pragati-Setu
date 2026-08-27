import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import MultiStepSubmissionModal from '../citizen/MultiStepSubmissionModal';
import AIAssistantModal from '../common/AIAssistantModal';
import AuditLogDrawer from '../common/AuditLogDrawer';
import SIHPitchTour from '../common/SIHPitchTour';
import { Toaster } from 'sonner';

export default function MainLayout() {
  const navigate = useNavigate();
  const [isPitchTourOpen, setIsPitchTourOpen] = useState(false);

  const handleJumpFromTour = (role, view) => {
    if (role === 'government') navigate('/dashboard');
    else if (role === 'university') navigate('/university');
    else if (role === 'industry') navigate('/industry');
    else if (role === 'panchayat') navigate('/panchayat');
    else navigate('/citizen');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 bg-grid-slate flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Sonner Toast Notification */}
      <Toaster richColors position="top-right" theme="light" closeButton />

      {/* Top Clean Navbar */}
      <Navbar />

      {/* Main Outlet for Router Pages */}
      <main className="flex-1 pb-16">
        <Outlet />
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

      {/* Modern Light Clean Footer */}
      <footer className="bg-white text-slate-600 border-t border-slate-200 text-xs py-10 px-4 sm:px-6 lg:px-8 mt-auto shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <img src="/jharkhand_logo.svg" alt="Jharkhand Emblem" className="w-8 h-8" />
              <span className="font-black text-slate-900 text-base">Jharkhand Pragati Setu</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Smart India Hackathon 2026: Converting grassroots societal challenges into structured research, multidisciplinary university teams, and corporate CSR deployments across Jharkhand.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 font-mono">Academic Innovation Hubs</h4>
            <ul className="space-y-1.5 text-slate-600 text-xs">
              <li>• BIT Mesra Centre for Water Quality & IoT</li>
              <li>• IIT (ISM) Dhanbad Geosciences & TexMin</li>
              <li>• Birsa Agricultural University (BAU) Kanke</li>
              <li>• NIT Jamshedpur Clean Energy Lab</li>
              <li>• RIMS Ranchi Tribal Health Hub</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 font-mono">Industry & CSR Partners</h4>
            <ul className="space-y-1.5 text-slate-600 text-xs">
              <li>• Tata Steel Foundation (Jamshedpur)</li>
              <li>• Coal India Limited (CIL CSR Wing)</li>
              <li>• SAIL Bokaro Steel Plant</li>
              <li>• JSPL CSR Foundation</li>
              <li>• Jharkhand AgroTech Innovations</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 font-mono">State Innovation Desk</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Toll Free Challenge Helpline: <strong className="text-emerald-700">1800-345-SIH26</strong><br />
              Email: <code className="bg-slate-100 text-emerald-800 px-1 py-0.5 rounded">innovation@jharkhand.gov.in</code><br />
              Secretariat: Project Building, Dhurwa, Ranchi - 834004<br />
              AI Status: <span className="text-emerald-700 font-mono font-bold">AI Engine Active</span>
            </p>
          </div>
        </div>

        
      </footer>
    </div>
  );
}
