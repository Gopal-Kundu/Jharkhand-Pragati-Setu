import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { 
  Briefcase, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  FileText,
  MapPin,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function IndustryPortal() {
  const { 
    problemClusters, 
    industryPartners, 
    pledgeIndustryPartner, 
    setSelectedClusterId, 
    setActiveView,
    lang 
  } = useAppState();

  const [activePartnerId, setActivePartnerId] = useState('tata_steel_csr');
  const [selectedProjectForPledge, setSelectedProjectForPledge] = useState(null);
  const [pledgeDetails, setPledgeDetails] = useState({
    type: 'CSR Innovation Grant & Field Vehicle',
    contribution: '₹12,50,000 Direct Grant + Galvanized Sluice Fabrication'
  });

  const currentPartner = (industryPartners || []).find(p => p?.id === activePartnerId) || (industryPartners && industryPartners[0]) || {
    id: 'tata_steel_csr',
    name: 'Tata Steel Foundation CSR Wing',
    shortName: 'Tata Steel CSR',
    category: 'Enterprise CSR Foundation',
    hq: 'Jamshedpur',
    pledgeCapacity: '₹12.5 Cr',
    offeredResources: ['Rapid Prototype Fabrication', 'Matching CSR Grants', 'Corporate Mentors', 'Field Trial Vehicles']
  };

  // Active projects seeking industry collaboration
  const projectsSeekingIndustry = (problemClusters || []).filter(c => c?.project);

  const handlePledgeSubmit = (clusterId) => {
    if (pledgeIndustryPartner) {
      pledgeIndustryPartner(clusterId, currentPartner?.name || 'Tata Steel Foundation', 1250000);
    }
    setSelectedProjectForPledge(null);
    try {
      confetti({ particleCount: 90, spread: 70 });
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      
      {/* 1. Industry / CSR Header Banner (Clean White & Emerald) */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Corporate CSR, Startup &amp; Industry Innovation Exchange</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-heading">
              {currentPartner?.name || 'Corporate CSR Partner'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {currentPartner?.category || 'CSR Foundation'} • HQ: {currentPartner?.hq || 'Jharkhand'} • Committed CSR Pool: <strong className="text-emerald-700 font-bold">{currentPartner?.pledgeCapacity || '₹10 Cr'}</strong>
            </p>
          </div>

          {/* Switch Industry Partner Profile */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1 self-start md:self-auto">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Active Industry / CSR Profile:
            </span>
            <select
              value={activePartnerId}
              onChange={(e) => setActivePartnerId(e.target.value)}
              className="bg-white text-slate-900 font-bold text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              {(industryPartners || []).map(p => (
                <option key={p?.id || Math.random()} value={p?.id}>{p?.shortName || p?.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Corporate Resources Offered */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            CSR Mandate &amp; Resources Available for Deployment:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
            {(currentPartner?.offeredResources || []).map((res, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-800 font-medium shadow-2xs">
                {res}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Projects Seeking Industry Co-creation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-xl text-slate-900 font-heading">
              Active University Projects Seeking Industry / CSR Partners
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              All co-creations receive Section 135 CSR tax exemption &amp; verified digital impact audit certificates.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
            {projectsSeekingIndustry.length} Active R&amp;D Projects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsSeekingIndustry.map((cluster) => {
            const prj = cluster.project;
            const hasJoined = prj.industryPartners?.some(p => p.partnerId === activePartnerId);

            return (
              <div
                key={cluster.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500/60 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl">
                      {prj.projectId} • #{cluster.id}
                    </span>
                    <span className="text-emerald-800 font-extrabold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs">
                      Stage: {cluster.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-lg text-slate-900 font-heading leading-snug">
                    {prj.title}
                  </h4>

                  <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lead: <strong className="text-slate-800">{prj.leadInstitution}</strong> • {cluster.districtName}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10.5px] text-slate-500 font-medium block">Total Budget:</span>
                      <strong className="text-slate-900 text-sm font-bold">{prj.budget.totalRequested}</strong>
                    </div>
                    <div>
                      <span className="text-[10.5px] text-slate-500 font-medium block">Govt Grant Backing:</span>
                      <strong className="text-emerald-700 text-sm font-bold">{prj.budget.govtGrantApproved}</strong>
                    </div>
                  </div>

                  {prj.industryPartners && prj.industryPartners.length > 0 && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <strong className="text-slate-800">Current Collaborators:</strong> {prj.industryPartners.map(p => p.name).join(', ')}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setSelectedClusterId(cluster.id);
                      setActiveView('cluster_detail');
                    }}
                    className="text-slate-600 hover:text-emerald-700 font-bold transition-colors cursor-pointer"
                  >
                    View Project Workspace &rarr;
                  </button>

                  {!hasJoined ? (
                    <button
                      onClick={() => setSelectedProjectForPledge(cluster.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-1.5 transition-all hover:scale-105"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Pledge Support / Grant</span>
                    </button>
                  ) : (
                    <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Support Pledged</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Pledge Modal */}
      {selectedProjectForPledge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 font-heading">
              Pledge Support as {currentPartner.name}
            </h3>
            <p className="text-xs text-slate-600">
              Confirm your corporate commitment for project #{selectedProjectForPledge}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Collaboration Type</label>
                <select
                  value={pledgeDetails.type}
                  onChange={(e) => setPledgeDetails({ ...pledgeDetails, type: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="CSR Innovation Grant & Field Vehicle">CSR Innovation Grant &amp; Field Vehicle</option>
                  <option value="Sensors, Telemetry Hardware & Gateways">Sensors, Telemetry Hardware &amp; Gateways</option>
                  <option value="Rapid Tooling & Fabrication">Rapid Tooling &amp; Fabrication</option>
                  <option value="Pilot Testing Site & Distribution">Pilot Testing Site &amp; Distribution</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource / Financial Commitment</label>
                <input
                  type="text"
                  value={pledgeDetails.contribution}
                  onChange={(e) => setPledgeDetails({ ...pledgeDetails, contribution: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedProjectForPledge(null)}
                className="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-900 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePledgeSubmit(selectedProjectForPledge)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer transition-all hover:scale-105"
              >
                Sign Partnership Memorandum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
