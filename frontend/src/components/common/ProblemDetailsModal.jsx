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
  ExternalLink,
  Play,
  Video,
  Film,
  Image as ImageIcon,
  Clock
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

// Helper to safely extract string values from strings or objects
const getSafeString = (val, fallback = '') => {
  if (!val) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val.name || val.title || val.label || fallback;
  }
  return String(val);
};

export default function ProblemDetailsModal({ problemId, onClose }) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Helper to detect if an evidence object/URL is a video
  const isVideoMedia = (ev) => {
    if (!ev) return false;
    const url = typeof ev === 'string' ? ev : ev.url || '';
    const type = typeof ev === 'object' ? ev.type || ev.resource_type || '' : '';
    const format = typeof ev === 'object' ? ev.format || '' : '';
    return (
      type === 'video' ||
      format === 'mp4' ||
      format === 'webm' ||
      format === 'mov' ||
      format === 'mkv' ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.mov') ||
      url.endsWith('.mkv') ||
      url.includes('/video/') ||
      url.includes('.mp4') ||
      url.startsWith('blob:')
    );
  };

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

  const facultyLeadName = getSafeString(problem?.allocatedUniversity?.facultyLead, 'pending');
  const facultyLeadDept = problem?.allocatedUniversity?.facultyLead?.department
    ? ` (${problem.allocatedUniversity.facultyLead.department})`
    : '';

  const submitterName = getSafeString(problem?.submitter?.name, 'Concerned Citizen');
  const mentorName = getSafeString(industryPartner?.mentorName, 'Pending');
  const studentLeadName = getSafeString(proposal?.team?.studentLead, 'Student Lead');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            {!loading && (
              <>
                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${colorScheme}`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{domain}</span>
                </div>
                {isSolved && (
                  <span className="flex items-center space-x-1 font-mono text-xs font-black px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>SOLVED</span>
                  </span>
                )}
              </>
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
                Loading...
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

                  {problem.submitter && (
                    <span className="flex items-center space-x-1 text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reported by <strong>{submitterName}</strong></span>
                    </span>
                  )}

                  {problem.location?.coordinates && (
                    <span className="font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      GPS: {problem.location.coordinates.lat?.toFixed(4)}, {problem.location.coordinates.lng?.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>

              {/* Evidence Media Showcase (Photo & Full Video Player Support) */}
              {problem.evidence && problem.evidence.length > 0 && (() => {
                const currentEvidence = problem.evidence[activeMediaIndex] || problem.evidence[0];
                const currentUrl = typeof currentEvidence === 'string' ? currentEvidence : currentEvidence?.url;
                const isVideo = isVideoMedia(currentEvidence);

                return (
                  <div className="space-y-3">
                    <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 relative">
                      {isVideo ? (
                        <div className="w-full bg-black flex flex-col items-center justify-center">
                          <video
                            key={currentUrl}
                            src={currentUrl}
                            controls
                            playsInline
                            preload="metadata"
                            className="w-full max-h-[440px] object-contain bg-black"
                          >
                            Your browser does not support HTML5 video streaming.
                          </video>
                          <div className="w-full px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between text-xs border-t border-slate-800">
                            <div className="flex items-center space-x-2">
                              <span className="bg-indigo-600 px-2 py-0.5 rounded font-bold uppercase text-[10px] flex items-center space-x-1">
                                <Play className="w-2.5 h-2.5 fill-current text-white" />
                                <span>Video Evidence</span>
                              </span>
                              <span className="font-medium text-slate-300">
                                {currentEvidence.caption || currentEvidence.name || `Ground Site Video Recording #${activeMediaIndex + 1}`}
                              </span>
                            </div>
                            <a
                              href={currentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-400 hover:text-indigo-200 flex items-center space-x-1 underline font-medium"
                            >
                              <span>Open in New Tab</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={currentUrl}
                            alt={problem.title}
                            className="w-full h-72 sm:h-96 object-cover object-center"
                          />
                          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white text-xs font-semibold border border-white/20">
                            {currentEvidence.caption || `Ground Site Photo #${activeMediaIndex + 1}`}
                          </div>
                          <a
                            href={currentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 backdrop-blur-md text-white p-2 rounded-xl text-xs border border-white/20 transition-all cursor-pointer"
                            title="View Full Resolution"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Multi-Evidence Thumbnail Selector Strip */}
                    {problem.evidence.length > 1 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          All Uploaded Evidence Media ({problem.evidence.length} files):
                        </span>
                        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                          {problem.evidence.map((evItem, idx) => {
                            const evItemUrl = typeof evItem === 'string' ? evItem : evItem?.url;
                            const evIsVideo = isVideoMedia(evItem);
                            const isSelected = idx === activeMediaIndex;

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveMediaIndex(idx)}
                                className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border-emerald-600 ring-2 ring-emerald-500/30 scale-105'
                                    : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                                }`}
                              >
                                {evIsVideo ? (
                                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                                    <Play className="w-5 h-5 fill-current text-white" />
                                  </div>
                                ) : (
                                  <img
                                    src={evItemUrl}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] font-bold px-1 rounded">
                                  {evIsVideo ? 'VIDEO' : 'PHOTO'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Problem Description & Context */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Problem Statement</span>
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
                      {getSafeString(problem.allocatedUniversity?.name, 'Higher Education Lab')}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Faculty Lead: <strong>{facultyLeadName}{facultyLeadDept}</strong>
                    </p>
                  </div>

                  {proposal && (
                    <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs space-y-1.5">
                      <div className="font-bold text-purple-950">Prototype Proposal: {proposal.title}</div>
                      <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3">{proposal.abstract}</p>
                      {proposal.team && (
                        <div className="text-[11px] text-purple-900 pt-1 font-mono">
                          Team: {studentLeadName} {proposal.team.department ? `(${proposal.team.department})` : ''}
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
                      {getSafeString(industryPartner?.companyName, 'State CSR Foundation')}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Mentor: <strong>{mentorName}</strong>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">CSR Grant Disbursed</div>
                      <div className="text-xl font-black text-amber-900 font-heading">
                        {industryPartner?.grantAmount ? `₹${(industryPartner.grantAmount / 100000).toFixed(1)} Lakhs` : 'Pending'}
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Problem Audit & Innovation Tracking Timeline */}
              {problem.timeline && problem.timeline.length > 0 && (
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
                  <div className="flex items-center space-x-2 text-xs font-bold font-mono text-slate-600 uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Milestone &amp; Partnership Timeline ({problem.timeline.length} events)</span>
                  </div>

                  <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 ml-2">
                    {problem.timeline.map((event, tIdx) => (
                      <div key={tIdx} className="relative space-y-1">
                        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                          <span className="font-bold text-slate-900">{event.action}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {event.timestamp ? new Date(event.timestamp).toLocaleDateString() : 'Active'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{event.note}</p>
                        {event.officer && (
                          <span className="text-[10.5px] font-medium text-slate-500 block">
                            Logged by: <strong>{event.officer}</strong> {event.role ? `(${event.role.toUpperCase()})` : ''}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
          <span> </span>
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
