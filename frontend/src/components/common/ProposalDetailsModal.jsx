import React from 'react';
import {
  X,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  MapPin,
  FileText,
  Layers,
  Sparkles,
  ExternalLink,
  Cpu,
  Mail,
  User,
  Award,
  AlertCircle,
  Eye
} from 'lucide-react';

const DOMAIN_COLORS = {
  'Education': 'bg-blue-50 text-blue-700 border-blue-200',
  'Agriculture': 'bg-amber-50 text-amber-700 border-amber-200',
  'Healthcare': 'bg-rose-50 text-rose-700 border-rose-200',
  'Water Resources': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Environment': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Energy': 'bg-yellow-50 text-yellow-800 border-yellow-200',
  'Urban Development': 'bg-purple-50 text-purple-700 border-purple-200',
  'Accessibility': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Public Administration': 'bg-slate-50 text-slate-700 border-slate-200',
  'Rural Livelihoods': 'bg-lime-50 text-lime-800 border-lime-200',
  'Others': 'bg-zinc-50 text-zinc-700 border-zinc-200'
};

export default function ProposalDetailsModal({
  isOpen,
  onClose,
  proposal,
  onMakeOffer,
  onViewProblem,
  hasOfferedByMe = false
}) {
  if (!isOpen || !proposal) return null;

  const problem = proposal.problem || {};
  const university = proposal.university || {};
  const domain = proposal.domain || problem.domain || 'Innovation & R&D';
  const colorScheme = DOMAIN_COLORS[domain] || 'bg-indigo-50 text-indigo-700 border-indigo-200';

  const facultyLead = proposal.facultyMembers?.[0] || {
    name: typeof university.facultyLead === 'string' ? university.facultyLead : university.facultyLead?.name || 'Dr. Amitava Roy',
    designation: 'Professor & Lead PI',
    department: 'Engineering & Applied Sciences',
    email: university.contactEmail || ''
  };

  const studentLead = proposal.teamMembers?.[0] || {
    name: proposal.teamLead || 'Lead Student Researcher',
    rollNo: '',
    branch: 'Applied Technology',
    year: 'Final Year'
  };

  const isSanctioned = proposal.status === 'approved_by_govt' || proposal.govtApproval?.status === 'approved';
  const offer = proposal.industryOffer;
  const industryPartner = proposal.assignedIndustry || offer?.industry;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${colorScheme}`}>
                {domain}
              </span>

              {isSanctioned ? (
                <span className="flex items-center space-x-1 font-mono text-xs font-black px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>GOVT SANCTIONED</span>
                </span>
              ) : hasOfferedByMe ? (
                <span className="flex items-center space-x-1 font-mono text-xs font-black px-3 py-1 rounded-xl bg-purple-100 text-purple-800 border border-purple-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
                  <span>OFFER COMMITTED</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 font-mono text-xs font-bold px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>OPEN FOR CSR SPONSORSHIP</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-heading leading-snug">
              {proposal.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center space-x-1 text-indigo-700 font-bold">
                <GraduationCap className="w-4 h-4" />
                <span>{university.name || 'Higher Education Lab'}</span>
              </span>
              {problem.location?.district && (
                <span className="flex items-center space-x-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Target: {problem.location.district} District</span>
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
            title="Close proposal modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          
          {/* Key Metrics Quick Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estimated Budget</div>
              <div className="text-lg sm:text-xl font-black text-slate-900 font-heading mt-1">
                ₹{((offer?.fundingAmount || proposal.estimatedBudget || 0) / 100000).toFixed(1)} Lakhs
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">₹{(offer?.fundingAmount || proposal.estimatedBudget || 0).toLocaleString()} Total</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project Timeline</div>
              <div className="text-lg sm:text-xl font-black text-slate-900 font-heading mt-1 flex items-center space-x-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{proposal.projectDuration || '6 Months'}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Rapid Prototyping</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">People Impacted</div>
              <div className="text-lg sm:text-xl font-black text-slate-900 font-heading mt-1 flex items-center space-x-1">
                <Users className="w-4 h-4 text-purple-600" />
                <span>{(proposal.peopleImpacted || problem.peopleImpacted || 1000).toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Citizens Benefited</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</div>
              <div className="text-sm sm:text-base font-black text-emerald-700 font-heading mt-1 capitalize">
                {isSanctioned ? 'Sanctioned' : proposal.status?.replace(/_/g, ' ') || 'Under Review'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Tripartite R&amp;D</div>
            </div>
          </div>

          {/* Technical Abstract & Methodology */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold font-mono text-slate-600 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Technical Methodology &amp; Implementation Strategy</span>
            </div>
            <p className="text-slate-800 text-sm leading-relaxed font-normal whitespace-pre-line">
              {proposal.description || 'Comprehensive multidisciplinary research, field prototyping, and societal deployment strategy.'}
            </p>
          </div>

          {/* Targeted Problem Context */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold font-mono text-emerald-800 uppercase tracking-wider">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Addressing Ground Problem Statement</span>
              </div>
              {onViewProblem && problem._id && (
                <button
                  onClick={() => onViewProblem(problem._id)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 cursor-pointer hover:underline"
                >
                  <span>View Full Problem &amp; Evidence</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-1">
              <h4 className="font-bold text-emerald-950 text-sm">{problem.title || proposal.problemStatement}</h4>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {problem.description || proposal.problemStatement}
              </p>
              {problem.location && (
                <div className="text-[11px] text-emerald-800 font-mono pt-1">
                  Location: {problem.location.panchayat ? `${problem.location.panchayat}, ` : ''}
                  {problem.location.block ? `${problem.location.block}, ` : ''}
                  {problem.location.district || 'Jharkhand'}
                </div>
              )}
            </div>
          </div>

          {/* Multidisciplinary Team: University & Faculty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* University & Faculty Investigator */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold font-mono text-purple-800 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>Lead Higher Education Institution</span>
              </div>

              <div>
                <h4 className="font-extrabold text-base text-slate-900 font-heading">
                  {university.name || 'Birla Institute of Technology (BIT) Mesra'}
                </h4>
                <p className="text-xs text-slate-500">{university.type || 'Institute of National Importance'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs space-y-1">
                <div className="font-bold text-purple-950 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-purple-700" />
                  <span>Principal Investigator: {facultyLead.name}</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  {facultyLead.designation} &bull; {facultyLead.department}
                </div>
                {facultyLead.email && (
                  <div className="text-[11px] text-purple-900 font-mono flex items-center space-x-1 pt-0.5">
                    <Mail className="w-3 h-3 text-purple-600" />
                    <span>{facultyLead.email}</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-700">Student Innovation Team:</div>
                <p className="text-[11px] font-mono text-slate-500">
                  {studentLead.name} {studentLead.branch ? `(${studentLead.branch})` : ''} {studentLead.rollNo ? `[${studentLead.rollNo}]` : ''}
                </p>
              </div>
            </div>

            {/* Industry CSR Sponsor / Support Requirements */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold font-mono text-amber-800 uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>Industry CSR &amp; Resource Matching</span>
              </div>

              {industryPartner || offer?.industry ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 font-heading">
                      {industryPartner?.name || offer?.industry?.name || 'Committed CSR Partner'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Mentor: <strong>{offer?.mentorName || industryPartner?.leadMentors?.[0]?.name || 'Corporate Lead Mentor'}</strong>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">CSR Grant Committed</div>
                      <div className="text-lg font-black text-amber-900 font-heading">
                        ₹{(offer?.fundingAmount || proposal.estimatedBudget || 0).toLocaleString()}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-amber-200 text-amber-900 font-bold text-[10px] uppercase">
                      {offer?.responseStatus || 'Active'}
                    </span>
                  </div>

                  {offer?.supportDetails && (
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong>Support Provision:</strong> {offer.supportDetails}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-amber-900 space-y-1">
                    <div className="font-bold flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Sponsorship Opportunity Available</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      This research proposal is actively seeking CSR co-sponsorship, prototyping grants, and hardware testing assistance from registered industrial enterprises.
                    </p>
                  </div>
                </div>
              )}

              {/* Industry Support Required Tags */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Support &amp; Equipment Required:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(proposal.industrySupportRequired || ['IoT & Embedded Sensors', 'Field Trial Logistics']).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200 flex items-center space-x-1"
                    >
                      <Cpu className="w-3 h-3 text-slate-500" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Government Statutory Sanction Order (if approved) */}
          {isSanctioned && (
            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold font-mono text-emerald-900 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Statutory Government Sanction Order</span>
                </div>
                {proposal.govtApproval?.sanctionOrderNumber && (
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-xl bg-white text-emerald-800 border border-emerald-300 shadow-sm">
                    {proposal.govtApproval.sanctionOrderNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {proposal.govtApproval?.remarks || 'Statutory approval granted by the State Directorate under Section 135 CSR mandate. Tripartite execution is officially registered.'}
              </p>
              {proposal.govtApproval?.approvedAt && (
                <div className="text-[10.5px] text-emerald-800 font-mono pt-1">
                  Sanctioned on: {new Date(proposal.govtApproval.approvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Action Bar */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onViewProblem && problem._id && (
              <button
                onClick={() => onViewProblem(problem._id)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span>View Problem Details</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!hasOfferedByMe && onMakeOffer && (
              <button
                onClick={() => {
                  onClose();
                  onMakeOffer(proposal);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer hover:scale-105"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Accept &amp; Make CSR Offer</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
