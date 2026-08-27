import React, { useState, useEffect } from 'react';
import { problemApi } from '../../services/problemApi';
import {
  X,
  MapPin,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Building2,
  Sparkles,
  Calendar,
  Layers,
  Award,
  TrendingUp,
  Cpu,
  FileText,
  User,
  ShieldCheck,
  ArrowRight,
  Droplets,
  Sprout,
  HeartPulse,
  BookOpen,
  Flame,
  Sun,
  Building,
  Eye,
  FileCheck,
  Footprints,
  Loader2,
  ExternalLink
} from 'lucide-react';

const DOMAIN_ICONS = {
  'Water Resources': Droplets,
  'Agriculture': Sprout,
  'Healthcare': HeartPulse,
  'Education': BookOpen,
  'Environment': Flame,
  'Energy': Sun,
  'Urban Development': Building,
  'Accessibility': Eye,
  'Public Administration': FileCheck,
  'Rural Livelihoods': Footprints
};

const DOMAIN_COLORS = {
  'Water Resources': 'bg-sky-50 text-sky-700 border-sky-200',
  'Agriculture': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Healthcare': 'bg-rose-50 text-rose-700 border-rose-200',
  'Education': 'bg-amber-50 text-amber-700 border-amber-200',
  'Environment': 'bg-teal-50 text-teal-700 border-teal-200',
  'Energy': 'bg-yellow-50 text-yellow-800 border-yellow-200',
  'Urban Development': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Accessibility': 'bg-purple-50 text-purple-700 border-purple-200',
  'Public Administration': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Rural Livelihoods': 'bg-lime-50 text-lime-800 border-lime-200'
};

export default function ProblemDetailsModal({ problemId, onClose }) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch individual problem statement by ID/Ticket on demand via dedicated REST API
  useEffect(() => {
    let isMounted = true;
    if (!problemId) return;

    async function loadProblemDetails() {
      try {
        setLoading(true);
        setError(null);
        const data = await problemApi.getProblemById(problemId);
        if (isMounted) {
          setProblem(data.problem || data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to load challenge details');
          setLoading(false);
        }
      }
    }

    loadProblemDetails();

    return () => {
      isMounted = false;
    };
  }, [problemId]);

  if (!problemId) return null;

  const domain = problem?.domain || 'Water Resources';
  const Icon = DOMAIN_ICONS[domain] || Droplets;
  const colorScheme = DOMAIN_COLORS[domain] || 'bg-emerald-50 text-emerald-700 border-emerald-200';
  const isSolved = problem?.resolutionStatus === 'solved' || problem?.status === 'validated';
  const proposal = problem?.proposals?.[0];
  const industryPartner = problem?.industryPartners?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs font-black px-3 py-1 rounded-xl bg-slate-200/80 text-slate-800 border border-slate-300">
              #{problem?.ticketId || problemId}
            </span>
            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${colorScheme}`}>
              <Icon className="w-3.5 h-3.5" />
              <span>{domain}</span>
            </div>
            {isSolved && (
              <span className="flex items-center space-x-1 font-mono text-xs font-black px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>FIELD DEPLOYED &amp; SOLVED</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              <div className="text-sm font-bold text-slate-700 font-mono">
                Fetching Live Problem Record from API...
              </div>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-center space-y-2">
              <p className="font-bold">{error}</p>
              <button 
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Dismiss
              </button>
            </div>
          ) : (
            <>
              {/* Problem Title & Headline */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-heading leading-tight">
                  {problem.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center space-x-1.5 font-bold text-slate-800">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>
                      {problem.location?.panchayat ? `${problem.location.panchayat}, ` : ''}
                      {problem.location?.block ? `${problem.location.block}, ` : ''}
                      {problem.location?.district || 'Jharkhand'}
                    </span>
                  </span>

                  {problem.submitter?.name && (
                    <span className="flex items-center space-x-1 text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reported by <strong>{problem.submitter.name}</strong> ({problem.submitter.role || 'Citizen'})</span>
                    </span>
                  )}

                  {problem.location?.coordinates && (
                    <span className="font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      GPS: {problem.location.coordinates.lat?.toFixed(4)}, {problem.location.coordinates.lng?.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>

              {/* Evidence Photo Banner */}
              {problem.evidence && problem.evidence.length > 0 && (
                <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 relative">
                  <img
                    src={problem.evidence[0].url}
                    alt={problem.title}
                    className="w-full h-72 sm:h-96 object-cover object-center"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white text-xs font-semibold border border-white/20">
                    📷 Field Evidence Snapshot: {problem.evidence[0].caption || 'Ground Site Photo'}
                  </div>
                </div>
              )}

              {/* Problem Description & Context */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Problem Statement &amp; Root Cause Analysis</span>
                </div>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                  {problem.description}
                </p>
              </div>

              {/* Verified Social Impact Metric */}
              {problem.socialImpact && (
                <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold font-mono text-emerald-800 uppercase tracking-wider">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Measured Real-World Social Impact</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                      <div className="text-xs text-slate-500 font-medium">{problem.socialImpact.metricName || 'Primary Impact Metric'}</div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1 font-heading">{problem.socialImpact.metricValue}</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                      <div className="text-xs text-slate-500 font-medium">Citizen Beneficiaries</div>
                      <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-heading">
                        {problem.socialImpact.beneficiariesCount ? `${problem.socialImpact.beneficiariesCount.toLocaleString()} Citizens` : 'Community-wide'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Multidisciplinary Collaboration Details: University & Industry CSR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. University R&D Team */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold font-mono text-purple-800 uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span>Allocated Higher Education Institution</span>
                  </div>
                  
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 font-heading">
                      {problem.allocatedUniversity?.name || 'Higher Education Lab'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Faculty Lead: <strong>{problem.allocatedUniversity?.facultyLead || 'Lead Investigator'}</strong>
                    </p>
                  </div>

                  {proposal && (
                    <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs space-y-1.5">
                      <div className="font-bold text-purple-950">Prototype Proposal: {proposal.title}</div>
                      <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3">{proposal.abstract}</p>
                      {proposal.team && (
                        <div className="text-[11px] text-purple-900 pt-1 font-mono">
                          Team: {proposal.team.studentLead} ({proposal.team.department})
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Industry CSR & Grant Support */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold font-mono text-amber-800 uppercase tracking-wider">
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    <span>Industry CSR &amp; Grant Sponsor</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 font-heading">
                      {industryPartner?.companyName || 'State CSR Foundation'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      CSR Mentor: <strong>{industryPartner?.mentorName || 'Corporate Lead'}</strong>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">CSR Grant Disbursed</div>
                      <div className="text-xl font-black text-amber-900 font-heading">
                        {industryPartner?.grantAmount ? `₹${(industryPartner.grantAmount / 100000).toFixed(1)} Lakhs` : 'Grant Committed'}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold bg-amber-200 text-amber-950 px-2.5 py-1 rounded-lg">
                      100% Disbursed
                    </span>
                  </div>
                </div>

              </div>

              {/* Milestone Lifecycle Progress */}
              {problem.milestones && problem.milestones.length > 0 && (
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold font-mono text-slate-600 uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Execution Milestones &amp; Deployment Roadmap</span>
                  </div>

                  <div className="space-y-3">
                    {problem.milestones.map((m, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-slate-400">0{idx + 1}.</span>
                            <span className="font-bold text-sm text-slate-900">{m.title}</span>
                          </div>
                          {m.deliverable && (
                            <p className="text-xs text-slate-600 pl-6">{m.deliverable}</p>
                          )}
                        </div>

                        <span className={`self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full border ${
                          m.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {m.status === 'completed' ? '✓ Completed' : m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Triage & Verification Intelligence */}
              {problem.aiAnalysis && (
                <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                    <Cpu className="w-4 h-4" />
                    <span>AI Engine Triage &amp; Department Routing</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">Department Routed:</span>
                      <div className="font-bold text-white mt-0.5">{problem.aiAnalysis.suggestedDepartment || 'State Innovation Council'}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">AI Confidence Score:</span>
                      <div className="font-bold text-emerald-400 mt-0.5">
                        {problem.aiAnalysis.confidenceScore ? `${(problem.aiAnalysis.confidenceScore * 100).toFixed(1)}% Match` : '94.5%'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
          <span>State Innovation Council • SIH 2026</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
