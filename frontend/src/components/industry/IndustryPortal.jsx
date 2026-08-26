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

  const currentPartner = industryPartners.find(p => p.id === activePartnerId) || industryPartners[0];

  // Active projects seeking industry collaboration
  const projectsSeekingIndustry = problemClusters.filter(c => c.project);

  const handlePledgeSubmit = (clusterId) => {
    pledgeIndustryPartner(clusterId, activePartnerId, pledgeDetails);
    setSelectedProjectForPledge(null);
    try {
      confetti({ particleCount: 90, spread: 70 });
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      {/* Industry Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold px-3 py-1 rounded-full">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Corporate CSR, Startup & Industry Innovation Exchange</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              {currentPartner.name}
            </h1>
            <p className="text-xs text-amber-200/80">
              {currentPartner.category} • HQ: {currentPartner.hq} • Committed CSR Pool: <strong>{currentPartner.pledgeCapacity}</strong>
            </p>
          </div>

          {/* Switch Industry Partner Profile */}
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-xs space-y-1">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
              Active Industry / CSR Profile:
            </span>
            <select
              value={activePartnerId}
              onChange={(e) => setActivePartnerId(e.target.value)}
              className="bg-amber-900/90 text-white font-bold text-xs p-2 rounded-xl border border-amber-400 focus:outline-none"
            >
              {industryPartners.map(p => (
                <option key={p.id} value={p.id}>{p.shortName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Corporate Resources Offered */}
        <div className="pt-3 border-t border-amber-800/60">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1.5">
            CSR Mandate & Resources Available for Deployment:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {currentPartner.offeredResources.map((res, i) => (
              <div key={i} className="bg-amber-950/60 border border-amber-800/60 p-2.5 rounded-xl text-amber-100 font-medium">
                {res}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Seeking Industry Co-creation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">
              Active University Projects Seeking Industry / CSR Partners
            </h3>
            <p className="text-xs text-slate-500">
              All co-creations receive Section 135 CSR tax exemption & verified digital impact audit certificates.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
            {projectsSeekingIndustry.length} Active R&D Projects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectsSeekingIndustry.map((cluster) => {
            const prj = cluster.project;
            const hasJoined = prj.industryPartners?.some(p => p.partnerId === activePartnerId);

            return (
              <div
                key={cluster.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {prj.projectId} • #{cluster.id}
                    </span>
                    <span className="text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs">
                      Stage: {cluster.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                    {prj.title}
                  </h4>

                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Lead: <strong>{prj.leadInstitution}</strong> • {cluster.districtName}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Budget:</span>
                      <strong className="text-slate-900">{prj.budget.totalRequested}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Govt Grant Backing:</span>
                      <strong className="text-emerald-700">{prj.budget.govtGrantApproved}</strong>
                    </div>
                  </div>

                  {prj.industryPartners && prj.industryPartners.length > 0 && (
                    <div className="text-[11px] text-slate-600">
                      <strong>Current Collaborators:</strong> {prj.industryPartners.map(p => p.name).join(', ')}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setSelectedClusterId(cluster.id);
                      setActiveView('cluster_detail');
                    }}
                    className="text-amber-800 hover:text-amber-950 font-bold hover:underline"
                  >
                    View Project Workspace &rarr;
                  </button>

                  {!hasJoined ? (
                    <button
                      onClick={() => setSelectedProjectForPledge(cluster.id)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg shadow-xs cursor-pointer flex items-center space-x-1"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Pledge Support / Grant</span>
                    </button>
                  ) : (
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Support Pledged</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Pledge Modal */}
      {selectedProjectForPledge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              Pledge Support as {currentPartner.name}
            </h3>
            <p className="text-xs text-slate-500">
              Confirm your corporate commitment for project #{selectedProjectForPledge}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Collaboration Type</label>
                <select
                  value={pledgeDetails.type}
                  onChange={(e) => setPledgeDetails({ ...pledgeDetails, type: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="CSR Innovation Grant & Field Vehicle">CSR Innovation Grant & Field Vehicle</option>
                  <option value="Sensors, Telemetry Hardware & Gateways">Sensors, Telemetry Hardware & Gateways</option>
                  <option value="Rapid Tooling & Fabrication">Rapid Tooling & Fabrication</option>
                  <option value="Pilot Testing Site & Distribution">Pilot Testing Site & Distribution</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource / Financial Commitment</label>
                <input
                  type="text"
                  value={pledgeDetails.contribution}
                  onChange={(e) => setPledgeDetails({ ...pledgeDetails, contribution: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedProjectForPledge(null)}
                className="px-3 py-1.5 text-xs text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePledgeSubmit(selectedProjectForPledge)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg shadow cursor-pointer"
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
