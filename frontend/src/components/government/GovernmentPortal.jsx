import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { problemApi } from '../../services/problemApi';
import ProblemDetailsModal from '../common/ProblemDetailsModal';
import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Search, 
  Filter, 
  Sparkles, 
  MapPin, 
  Clock, 
  FileText, 
  Check, 
  X, 
  Loader2, 
  ArrowRight,
  Play
} from 'lucide-react';
import { toast } from 'sonner';

const ALL_DOMAINS = [
  'Education',
  'Agriculture',
  'Healthcare',
  'Water Resources',
  'Environment',
  'Energy',
  'Urban Development',
  'Accessibility',
  'Public Administration',
  'Rural Livelihoods'
];

const DOMAIN_IMAGES = {
  'Water Resources': 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
  'Agriculture': 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
  'Healthcare': 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80',
  'Environment': 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
  'Energy': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
  'Urban Development': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  'Education': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  'Accessibility': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  'Public Administration': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  'Rural Livelihoods': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
};

export default function GovernmentPortal() {
  const authState = useSelector((state) => state.auth);
  const authUser = authState?.user;

  // Proposals State
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');

  // Modal States
  const [selectedProblemIdForModal, setSelectedProblemIdForModal] = useState(null);

  // Approve Modal State
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedProposalForApprove, setSelectedProposalForApprove] = useState(null);
  const [sanctionOrderNumber, setSanctionOrderNumber] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [submittingApprove, setSubmittingApprove] = useState(false);

  // Reject Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedProposalForReject, setSelectedProposalForReject] = useState(null);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [submittingReject, setSubmittingReject] = useState(false);

  // Load Tripartite Proposals
  const loadProposals = async () => {
    try {
      setLoading(true);
      const res = await problemApi.getTripartiteProposalsForGovt();
      if (res.proposals) {
        setProposals(res.proposals);
      }
    } catch (err) {
      console.error('[Load Govt Tripartite Proposals Error]:', err);
      toast.error('Failed to load tripartite proposals for government review');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  // Categorize Proposals
  const isPending = (p) => {
    const offerStatus = p.industryOffer?.responseStatus;
    const propStatus = p.status;
    const isApproved = propStatus === 'approved_by_govt' || p.govtApproval?.status === 'approved' || propStatus === 'in_progress';
    const isRejected = propStatus === 'rejected_by_govt' || p.govtApproval?.status === 'rejected';
    
    if (isApproved || isRejected) return false;
    return offerStatus === 'accepted' || propStatus === 'accepted_by_university' || propStatus === 'submitted_to_govt';
  };

  const isApproved = (p) => {
    return p.status === 'approved_by_govt' || p.govtApproval?.status === 'approved' || p.status === 'in_progress';
  };

  const isRejected = (p) => {
    return p.status === 'rejected_by_govt' || p.govtApproval?.status === 'rejected';
  };

  const pendingProposals = proposals.filter(isPending);
  const approvedProposals = proposals.filter(isApproved);
  const rejectedProposals = proposals.filter(isRejected);

  // Filter based on active tab, search, and domain
  const getTabList = () => {
    if (activeTab === 'pending') return pendingProposals;
    if (activeTab === 'approved') return approvedProposals;
    if (activeTab === 'rejected') return rejectedProposals;
    return proposals;
  };

  const filteredProposals = getTabList().filter((p) => {
    const problem = p.problem || {};
    const university = p.university || {};
    const industry = p.industryOffer?.industry || {};
    const propDomain = p.domain || problem.domain;

    const matchesDomain = selectedDomainFilter === 'all' || (propDomain && propDomain.toLowerCase() === selectedDomainFilter.toLowerCase());
    const matchesSearch =
      !searchQuery.trim() ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.location?.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      industry.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDomain && matchesSearch;
  });

  // Open Approve Modal
  const handleOpenApproveModal = (proposal) => {
    setSelectedProposalForApprove(proposal);
    setSanctionOrderNumber(`JH-SANCTION-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setApprovalRemarks('Statutory approval granted under Section 135 CSR mandate. R&D implementation and funding disbursement sanctioned.');
    setIsApproveModalOpen(true);
  };

  // Submit Approval
  const handleConfirmApprove = async (e) => {
    e.preventDefault();
    if (!selectedProposalForApprove) return;
    try {
      setSubmittingApprove(true);
      const res = await problemApi.approveTripartiteProposal(selectedProposalForApprove._id, {
        action: 'approve',
        sanctionOrderNumber: sanctionOrderNumber.trim(),
        remarks: approvalRemarks.trim()
      });
      setIsApproveModalOpen(false);
      setSelectedProposalForApprove(null);
      toast.success(res.message || 'Tripartite proposal sanctioned and approved successfully!');
      loadProposals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve proposal');
    } finally {
      setSubmittingApprove(false);
    }
  };

  // Open Reject Modal
  const handleOpenRejectModal = (proposal) => {
    setSelectedProposalForReject(proposal);
    setRejectionRemarks('Project scope or resource requirement outside current state priority parameters.');
    setIsRejectModalOpen(true);
  };

  // Submit Rejection
  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!selectedProposalForReject) return;
    try {
      setSubmittingReject(true);
      const res = await problemApi.approveTripartiteProposal(selectedProposalForReject._id, {
        action: 'reject',
        remarks: rejectionRemarks.trim() || 'Declined by Government Review Committee'
      });
      setIsRejectModalOpen(false);
      setSelectedProposalForReject(null);
      toast.info(res.message || 'Tripartite proposal declined by Government');
      loadProposals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to decline proposal');
    } finally {
      setSubmittingReject(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider mb-0.5">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Government of Jharkhand &bull; State Innovation Council</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            Project Sanction Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Review and sanction University R&amp;D proposals co-sponsored by Industry CSR partners for grassroots societal challenges across Jharkhand.
          </p>
        </div>
      </div>

      {/* 3 Main Status Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending Govt Sanction ({pendingProposals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Sanctioned &amp; Approved ({approvedProposals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Declined / Rejected ({rejectedProposals.length})</span>
          </button>

        
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search problems, HEIs, industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
          />
        </div>
      </div>

      {/* Domain Filters Grid View */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Filter by Domain:</span>
          </span>
          {selectedDomainFilter !== 'all' && (
            <button
              onClick={() => setSelectedDomainFilter('all')}
              className="text-emerald-700 hover:text-emerald-900 underline text-[11px] cursor-pointer"
            >
              Reset to All Domains
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
          <button
            onClick={() => setSelectedDomainFilter('all')}
            className={`p-2.5 rounded-xl font-bold transition-all text-center border cursor-pointer ${
              selectedDomainFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All Domains
          </button>
          {ALL_DOMAINS.map(d => {
            const isSelected = selectedDomainFilter === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDomainFilter(d)}
                className={`p-2.5 rounded-xl font-bold transition-all text-center border cursor-pointer flex items-center justify-center space-x-1 truncate ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200'
                }`}
              >
                <span className="truncate">{d}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tripartite Proposals List */}
      <div className="space-y-4 animate-in fade-in">
        {loading ? (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500 font-mono">Loading tripartite proposals for government review...</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base text-slate-900 font-heading">No Proposals Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {activeTab === 'pending'
                ? 'There are currently no tripartite proposals awaiting government sanction. As soon as universities accept industry CSR co-sponsorship offers, they will appear here for statutory approval.'
                : 'No proposals match the selected filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProposals.map((prop, idx) => {
              const problem = prop.problem || {};
              const university = prop.university || {};
              const offer = prop.industryOffer || {};
              const industry = offer.industry || {};
              const propDomain = prop.domain || problem.domain || 'Innovation';
              const imageUrl = problem.evidence?.[0]?.url || DOMAIN_IMAGES[propDomain] || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
              const hasVideo = problem.evidence?.some(e => e.type === 'video' || e.url?.endsWith('.mp4') || e.url?.includes('/video/'));

              const propIsPending = isPending(prop);
              const propIsApproved = isApproved(prop);
              const propIsRejected = isRejected(prop);

              return (
                <div
                  key={prop._id || idx}
                  className={`bg-white border rounded-3xl overflow-hidden shadow-md transition-all space-y-0 ${
                    propIsApproved
                      ? 'border-emerald-300 ring-1 ring-emerald-500/20'
                      : propIsRejected
                      ? 'border-rose-200 opacity-90'
                      : 'border-amber-300 ring-1 ring-amber-500/30'
                  }`}
                >
                  {/* Top Status Header Banner */}
                  <div className={`px-6 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b text-xs font-bold ${
                    propIsApproved
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : propIsRejected
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {propIsApproved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : propIsRejected ? (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                      )}
                      <span>
                        {propIsApproved
                          ? '✓ Sanctioned & Approved by Government'
                          : propIsRejected
                          ? 'Declined by Government Review Committee'
                          : '⏳ Awaiting Government Statutory Sanction Order'}
                      </span>
                    </div>

                    {prop.govtApproval?.sanctionOrderNumber && (
                      <span className="font-mono text-[11px] bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300 text-emerald-800 font-bold">
                        Order #{prop.govtApproval.sanctionOrderNumber}
                      </span>
                    )}
                  </div>

                  {/* 3 Pillars Grid: Problem, University R&D, and Industry CSR */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Pillar 1: Problem Statement */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-slate-500">
                            #{problem.ticketId || 'CHALLENGE'}
                          </span>
                          <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-lg text-[11px]">
                            {propDomain}
                          </span>
                        </div>

                        {/* Problem Image Thumbnail */}
                        <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-200">
                          <img
                            src={imageUrl}
                            alt={problem.title}
                            className="w-full h-full object-cover object-center"
                          />
                          <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>{problem.location?.district || 'Jharkhand'}</span>
                          </div>
                          {hasVideo && (
                            <div className="absolute top-2 right-2 flex items-center space-x-1 text-[10px] font-bold text-white bg-indigo-600/90 backdrop-blur-md px-2 py-0.5 rounded-lg">
                              <Play className="w-2.5 h-2.5 fill-current" />
                              <span>Video</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Citizen Problem Statement:
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-0.5 leading-snug">
                            {problem.title || prop.problemStatement}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                            {problem.description || 'Grassroots challenge reported from field location.'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedProblemIdForModal(problem._id || problem.ticketId)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 cursor-pointer pt-2 border-t border-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Full Problem &amp; Audit Trail</span>
                      </button>
                    </div>

                    {/* Pillar 2: University R&D Team */}
                    <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-indigo-900 text-xs font-bold">
                          <GraduationCap className="w-4 h-4 text-indigo-600" />
                          <span>Higher Education R&amp;D Team</span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 text-base font-heading">
                            {university.name || 'University Lab'}
                          </h4>
                          <span className="text-xs text-slate-500">
                            {university.type || 'State University'} &bull; {university.location?.city || 'Jharkhand'}
                          </span>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-indigo-100 text-xs space-y-1.5">
                          <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
                            Proposed Technological Solution:
                          </span>
                          <h5 className="font-bold text-slate-900 text-xs">
                            {prop.title}
                          </h5>
                          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                            {prop.description}
                          </p>
                        </div>

                        <div className="text-xs space-y-1">
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Project Duration:</span>
                            <strong className="text-slate-900">{prop.projectDuration || '6 Months'}</strong>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Estimated Budget:</span>
                            <strong className="text-emerald-700 font-mono">₹{(prop.estimatedBudget || 500000).toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>

                      {prop.facultyMembers && prop.facultyMembers.length > 0 && (
                        <div className="text-[11px] text-slate-500 pt-2 border-t border-indigo-100">
                          <strong className="text-slate-700">Lead PI:</strong> {prop.facultyMembers[0].name} ({prop.facultyMembers[0].department || 'Lead Researcher'})
                        </div>
                      )}
                    </div>

                    {/* Pillar 3: Industry CSR Sponsor */}
                    <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center space-x-1.5 text-emerald-900 font-bold">
                            <Briefcase className="w-4 h-4 text-emerald-600" />
                            <span>Industry CSR Sponsor</span>
                          </span>
                          <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg text-[10px]">
                            Section 135 CSR
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 text-base font-heading">
                            {industry.name || 'Corporate CSR Foundation'}
                          </h4>
                          <span className="text-xs text-slate-500">
                            {industry.type || 'CSR Foundation'} &bull; {industry.hqLocation || 'Jharkhand'}
                          </span>
                        </div>

                        {/* Committed Funding Box */}
                        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 text-xs space-y-1.5">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                            Committed CSR Grant:
                          </span>
                          <div className="text-lg font-black text-emerald-700 font-mono">
                            ₹{(offer.fundingAmount || prop.estimatedBudget || 0).toLocaleString()}
                          </div>
                          {offer.supportDetails && (
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                              {offer.supportDetails}
                            </p>
                          )}
                        </div>

                        {offer.equipmentProvided && offer.equipmentProvided.length > 0 && (
                          <div className="text-[11px] text-slate-600">
                            <strong className="text-slate-700">Provided Equipment:</strong> {offer.equipmentProvided.join(', ')}
                          </div>
                        )}
                      </div>

                      {offer.mentorName && (
                        <div className="text-[11px] text-slate-500 pt-2 border-t border-emerald-100">
                          <strong className="text-slate-700">Corporate Mentor:</strong> {offer.mentorName} ({offer.mentorDesignation || 'Technical Director'})
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Bottom Action Footer Bar */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      {prop.govtApproval?.remarks && (
                        <span><strong className="text-slate-700">Govt Remarks:</strong> {prop.govtApproval.remarks}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {propIsPending && (
                        <>
                          <button
                            onClick={() => handleOpenRejectModal(prop)}
                            className="px-4 py-2 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer transition-all"
                          >
                            Decline / Reject
                          </button>
                          <button
                            onClick={() => handleOpenApproveModal(prop)}
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-1.5 transition-all hover:scale-105"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve &amp; Issue Sanction Order</span>
                          </button>
                        </>
                      )}

                      {propIsApproved && (
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Sanctioned &amp; Implementation Active</span>
                        </span>
                      )}

                      {propIsRejected && (
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-800 bg-rose-100 border border-rose-300 px-3 py-1.5 rounded-xl">
                          <X className="w-4 h-4 text-rose-600" />
                          <span>Declined by Review Committee</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {isApproveModalOpen && selectedProposalForApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold font-heading">Issue Government Sanction Order</h3>
              </div>
              <button onClick={() => setIsApproveModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">
                Proposal: {selectedProposalForApprove.title}
              </div>
              <div className="text-slate-600">
                HEI: <strong>{selectedProposalForApprove.university?.name || 'University Lab'}</strong> &bull; Industry: <strong>{selectedProposalForApprove.industryOffer?.industry?.name || 'CSR Sponsor'}</strong>
              </div>
              <div className="text-emerald-700 font-bold font-mono">
                Sanctioned CSR Grant: ₹{(selectedProposalForApprove.industryOffer?.fundingAmount || selectedProposalForApprove.estimatedBudget || 0).toLocaleString()}
              </div>
            </div>

            <form onSubmit={handleConfirmApprove} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Official Sanction Order Number *
                </label>
                <input
                  type="text"
                  required
                  value={sanctionOrderNumber}
                  onChange={(e) => setSanctionOrderNumber(e.target.value)}
                  className="w-full p-2.5 font-mono border border-slate-200 text-slate-900 bg-slate-50 font-bold rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Administrative Sanction Remarks
                </label>
                <textarea
                  rows={3}
                  value={approvalRemarks}
                  onChange={(e) => setApprovalRemarks(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-[11px] space-y-0.5">
                <p className="font-bold">Automated Notification Dispatch:</p>
                <p>Upon sanction, official notifications and timeline milestones will be sent immediately to the University team and Corporate CSR partner.</p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsApproveModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  {submittingApprove ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Issuing Sanction...</span>
                    </>
                  ) : (
                    <span>Issue Sanction Order &rarr;</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && selectedProposalForReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-rose-700 font-bold">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold font-heading">Decline Tripartite Proposal</h3>
              </div>
              <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">
                {selectedProposalForReject.title}
              </div>
              <div className="text-slate-600 text-[11px]">
                University: <strong>{selectedProposalForReject.university?.name || 'HEI'}</strong> &bull; Industry: <strong>{selectedProposalForReject.industryOffer?.industry?.name || 'Sponsor'}</strong>
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reason for Declining (Sent to HEI &amp; Industry) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionRemarks}
                  onChange={(e) => setRejectionRemarks(e.target.value)}
                  placeholder="e.g. Requires revision in budget allocation or milestone schedule..."
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReject}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-rose-600/20 cursor-pointer flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  {submittingReject ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Declining...</span>
                    </>
                  ) : (
                    <span>Decline &amp; Reject Proposal</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Problem Details Modal */}
      {selectedProblemIdForModal && (
        <ProblemDetailsModal
          problemId={selectedProblemIdForModal}
          isOpen={Boolean(selectedProblemIdForModal)}
          onClose={() => setSelectedProblemIdForModal(null)}
        />
      )}
    </div>
  );
}
