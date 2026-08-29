import React, { useState, useEffect } from 'react';
import { industryApi } from '../../services/industryApi';
import ProblemDetailsModal from '../common/ProblemDetailsModal';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
  Check, 
  X, 
  Edit3, 
  Loader2, 
  LogIn, 
  GraduationCap, 
  Play, 
  Eye, 
  Filter, 
  Send, 
  Award, 
  AlertCircle,
  Compass,
  Search
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


const INDUSTRY_SUPPORT_OPTIONS = [
  'IoT & Embedded Sensors',
  'Water Supply & Sluice Gate Fabrication',
  'Solar & Microgrid Hardware',
  'Drone & Aerial Survey',
  'Chemical & Water Quality Testing Kit',
  'Cloud & AI Compute Infrastructure',
  'Field Trial Vehicles & Logistics',
  'Rapid Prototyping & Metal 3D Printing',
  'Civil & Concrete Encapsulation',
  'Agritech Sensor Nodes',
  'Other Industry Support'
];

export default function IndustryPortal() {
  const authState = useSelector((state) => state.auth);
  const authUser = authState?.user;
  const isAuthenticated = authState?.isAuthenticated;

  // Real Database Industry Profile State
  const [myIndustry, setMyIndustry] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Proposals list
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [activeTab, setActiveTab] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');

  // Modal States
  const [selectedProblemIdForModal, setSelectedProblemIdForModal] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedProposalForOffer, setSelectedProposalForOffer] = useState(null);
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedProposalForReject, setSelectedProposalForReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submittingReject, setSubmittingReject] = useState(false);

  // Industry Registration Form State
  const [industryForm, setIndustryForm] = useState({
    name: '',
    type: 'CSR Foundation',
    hqLocation: '',
    availableDomains: [],
    supportCapabilities: [],
    csrAnnualBudgetInr: '',
    contactEmail: authUser?.email || '',
    mentorName: authUser?.name || '',
    mentorDesignation: ''
  });

  // CSR Offer Form State
  const [offerForm, setOfferForm] = useState({
    fundingAmount: '',
    supportDetails: '',
    equipmentProvided: [],
    mentorName: authUser?.name || '',
    mentorDesignation: '',
    mentorEmail: authUser?.email || ''
  });

  // Load Industry Profile & Domain Proposals
  const loadIndustryData = async (showLoading = false) => {
    if (!isAuthenticated) {
      setLoadingProfile(false);
      return;
    }
    try {
      if (showLoading) {
        setLoadingProfile(true);
        setLoadingProposals(true);
      }
      const res = await industryApi.getMyIndustry();
      if (res.industry) {
        setMyIndustry(res.industry);
        setIndustryForm({
          name: res.industry.name || '',
          type: res.industry.type || 'CSR Foundation',
          hqLocation: res.industry.hqLocation || 'Ranchi, Jharkhand',
          availableDomains: res.industry.availableDomains || res.industry.focusDomains || ['Water Resources', 'Agriculture'],
          supportCapabilities: res.industry.supportCapabilities || ['IoT & Embedded Sensors'],
          csrAnnualBudgetInr: res.industry.csrAnnualBudgetInr || 5000000,
          contactEmail: res.industry.contactEmail || authUser?.email || '',
          mentorName: res.industry.leadMentors?.[0]?.name || authUser?.name || 'Corporate Lead',
          mentorDesignation: res.industry.leadMentors?.[0]?.designation || 'Technical Director'
        });

        // Load proposals
        const propRes = await industryApi.getDomainProposals();
        if (propRes.proposals) {
          setProposals(propRes.proposals);
        }
      } else {
        setMyIndustry(null);
      }
    } catch (err) {
      console.warn('[Load Industry Error]:', err.message);
    } finally {
      if (showLoading) {
        setLoadingProfile(false);
        setLoadingProposals(false);
      }
    }
  };

  useEffect(() => {
    loadIndustryData(true);
  }, [isAuthenticated, authUser]);

  // Handle Industry Registration
  const handleRegisterIndustry = async (e) => {
    e.preventDefault();
    if (!industryForm.name.trim()) {
      toast.error('Company / Organization name is required');
      return;
    }

    try {
      const payload = {
        name: industryForm.name.trim(),
        type: industryForm.type,
        hqLocation: industryForm.hqLocation,
        availableDomains: industryForm.availableDomains,
        focusDomains: industryForm.availableDomains,
        supportCapabilities: industryForm.supportCapabilities,
        csrAnnualBudgetInr: Number(industryForm.csrAnnualBudgetInr) || 5000000,
        contactEmail: industryForm.contactEmail,
        leadMentors: [{
          name: industryForm.mentorName,
          designation: industryForm.mentorDesignation,
          domain: industryForm.availableDomains[0] || 'Water Resources'
        }]
      };

      const res = await industryApi.registerIndustry(payload);
      setMyIndustry(res.industry);
      toast.success('Industry partner registered successfully!');
      loadIndustryData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register industry partner');
    }
  };

  // Handle Industry Profile Update
  const handleUpdateIndustry = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: industryForm.name.trim(),
        type: industryForm.type,
        hqLocation: industryForm.hqLocation,
        availableDomains: industryForm.availableDomains,
        focusDomains: industryForm.availableDomains,
        supportCapabilities: industryForm.supportCapabilities,
        csrAnnualBudgetInr: Number(industryForm.csrAnnualBudgetInr) || 5000000,
        contactEmail: industryForm.contactEmail,
        leadMentors: [{
          name: industryForm.mentorName,
          designation: industryForm.mentorDesignation,
          domain: industryForm.availableDomains[0] || 'Water Resources'
        }]
      };

      const res = await industryApi.updateMyIndustry(payload);
      setMyIndustry(res.industry);
      setIsEditModalOpen(false);
      toast.success('Industry profile updated successfully!');
      loadIndustryData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update industry details');
    }
  };

  // Toggle domain in form
  const toggleDomain = (domain) => {
    setIndustryForm(prev => {
      const exists = prev.availableDomains.includes(domain);
      const updated = exists 
        ? prev.availableDomains.filter(d => d !== domain)
        : [...prev.availableDomains, domain];
      return { ...prev, availableDomains: updated };
    });
  };

  // Toggle support capability in form
  const toggleSupport = (option) => {
    setIndustryForm(prev => {
      const exists = prev.supportCapabilities.includes(option);
      const updated = exists 
        ? prev.supportCapabilities.filter(o => o !== option)
        : [...prev.supportCapabilities, option];
      return { ...prev, supportCapabilities: updated };
    });
  };

  // Toggle equipment in offer modal
  const toggleOfferEquipment = (option) => {
    setOfferForm(prev => {
      const exists = prev.equipmentProvided.includes(option);
      const updated = exists 
        ? prev.equipmentProvided.filter(o => o !== option)
        : [...prev.equipmentProvided, option];
      return { ...prev, equipmentProvided: updated };
    });
  };

  // Open Offer Modal
  const handleOpenOfferModal = (proposal) => {
    setSelectedProposalForOffer(proposal);
    setOfferForm({
      fundingAmount: proposal.estimatedBudget || 500000,
      supportDetails: `CSR Matching Grant and equipment fabrication support deployed by ${myIndustry?.name || 'Corporate Sponsor'}.`,
      equipmentProvided: proposal.industrySupportRequired || ['IoT & Embedded Sensors'],
      mentorName: myIndustry?.leadMentors?.[0]?.name || authUser?.name || 'Corporate Mentor',
      mentorDesignation: myIndustry?.leadMentors?.[0]?.designation || 'Lead Technical Architect',
      mentorEmail: myIndustry?.contactEmail || authUser?.email || ''
    });
    setIsOfferModalOpen(true);
  };

  // Submit CSR Offer
  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (!selectedProposalForOffer) return;

    try {
      setSubmittingOffer(true);
      const payload = {
        action: 'offer',
        fundingAmount: Number(offerForm.fundingAmount) || 500000,
        supportDetails: offerForm.supportDetails,
        equipmentProvided: offerForm.equipmentProvided,
        mentorName: offerForm.mentorName,
        mentorDesignation: offerForm.mentorDesignation,
        mentorEmail: offerForm.mentorEmail
      };

      const res = await industryApi.makeProposalOffer(selectedProposalForOffer._id, payload);
      setIsOfferModalOpen(false);
      toast.success(res.message || 'CSR funding offer submitted to university team!');

      // Optimistic update of local state without refresh
      const offerProposalId = selectedProposalForOffer._id;
      setMyIndustry(prev => {
        if (!prev) return prev;
        const currentSended = Array.isArray(prev.sendedProposal) ? prev.sendedProposal : [];
        const currentAccepted = Array.isArray(prev.acceptedProposals) ? prev.acceptedProposals : [];
        return {
          ...prev,
          sendedProposal: [...currentSended, offerProposalId],
          acceptedProposals: [...currentAccepted, offerProposalId],
          activeGrantsCount: (prev.activeGrantsCount || 0) + 1
        };
      });

      setProposals(prev =>
        prev.map(p => {
          if (p._id === offerProposalId) {
            return {
              ...p,
              status: 'offered_by_industry',
              assignedIndustry: myIndustry?._id,
              industryOffer: {
                industry: myIndustry,
                fundingAmount: payload.fundingAmount,
                supportDetails: payload.supportDetails,
                equipmentProvided: payload.equipmentProvided,
                mentorName: payload.mentorName,
                mentorDesignation: payload.mentorDesignation,
                mentorEmail: payload.mentorEmail,
                offeredAt: new Date(),
                responseStatus: 'pending'
              }
            };
          }
          return p;
        })
      );

      // Background silent sync
      loadIndustryData(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit CSR offer');
    } finally {
      setSubmittingOffer(false);
    }
  };

  // Open Reject Proposal Modal
  const handleOpenRejectModal = (proposal) => {
    setSelectedProposalForReject(proposal);
    setRejectionReason('Domain/budget mandate outside current quarter scope.');
    setIsRejectModalOpen(true);
  };

  // Confirm Reject Proposal via Modal
  const handleConfirmRejectProposal = async (e) => {
    if (e) e.preventDefault();
    if (!selectedProposalForReject) return;
    try {
      setSubmittingReject(true);
      const res = await industryApi.makeProposalOffer(selectedProposalForReject._id, {
        action: 'reject',
        rejectionReason: rejectionReason || 'Domain/budget mandate outside current quarter scope.'
      });
      setIsRejectModalOpen(false);
      setSelectedProposalForReject(null);
      toast.info(res.message || 'Proposal co-sponsorship declined');
      loadIndustryData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to decline proposal');
    } finally {
      setSubmittingReject(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <span className="text-xs font-bold text-slate-500 font-mono">Loading industry CSR portal...</span>
      </div>
    );
  }

  // 1. Not Logged In View
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Industry &amp; Corporate CSR Exchange</h2>
        <p className="text-xs text-slate-600">
          Sign in with your Industry Partner or CSR Sponsor account to review university research proposals, pledge matching grants, and deploy corporate technical mentors.
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
        >
          <LogIn className="w-4 h-4" />
          <span>Login with Industry Account</span>
        </Link>
      </div>
    );
  }

  // 2. Unregistered Industry View: Show Clean Registration Screen
  if (!myIndustry) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1.5 pb-4 border-b border-slate-100">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Register Industry &amp; Corporate CSR Entity
            </h1>
            <p className="text-xs text-slate-600">
              Register your enterprise, CSR foundation, startup, or MSME to review university proposals matching your technical capabilities.
            </p>
          </div>

          <form onSubmit={handleRegisterIndustry} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Steel Foundation / Adani Green CSR"
                  value={industryForm.name}
                  onChange={(e) => setIndustryForm({ ...industryForm, name: e.target.value })}
                  className="w-full p-3 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Entity Type</label>
                <select
                  value={industryForm.type}
                  onChange={(e) => setIndustryForm({ ...industryForm, type: e.target.value })}
                  className="w-full p-3 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                >
                  <option value="CSR Foundation">CSR Foundation</option>
                  <option value="Enterprise & PSU">Enterprise &amp; PSU</option>
                  <option value="Startup / MSME">Startup / MSME</option>
                  <option value="Research Laboratory">Research Laboratory</option>
                  <option value="Technology Accelerator">Technology Accelerator</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">HQ / Operating Location</label>
                <input
                  type="text"
                  placeholder="e.g. Ranchi, Jharkhand"
                  value={industryForm.hqLocation}
                  onChange={(e) => setIndustryForm({ ...industryForm, hqLocation: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Annual Committed CSR Pool (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000000"
                  value={industryForm.csrAnnualBudgetInr}
                  onChange={(e) => setIndustryForm({ ...industryForm, csrAnnualBudgetInr: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                />
              </div>
            </div>

            {/* availableDomains Selection */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">
                Specialized Innovation Domains (`availableDomains`) *
              </label>
              <span className="text-[11px] text-slate-500 block">
                Select the domains your organization provides CSR grants and technical mentorship for:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {ALL_DOMAINS.map((domain) => {
                  const isSelected = industryForm.availableDomains.includes(domain);
                  return (
                    <button
                      type="button"
                      key={domain}
                      onClick={() => toggleDomain(domain)}
                      className={`p-3 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{domain}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technical Support Capabilities */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">
                Technical Support &amp; Equipment Offerings
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INDUSTRY_SUPPORT_OPTIONS.map((opt) => {
                  const isSelected = industryForm.supportCapabilities.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleSupport(opt)}
                      className={`p-2 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{opt}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lead Representative / Mentor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Corporate Technical Lead"
                  value={industryForm.mentorName}
                  onChange={(e) => setIndustryForm({ ...industryForm, mentorName: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Contact Email</label>
                <input
                  type="email"
                  placeholder="e.g. csr.lead@company.com"
                  value={industryForm.contactEmail}
                  onChange={(e) => setIndustryForm({ ...industryForm, contactEmail: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-2xl shadow-md shadow-emerald-600/20 cursor-pointer transition-all hover:scale-105"
              >
                Register Entity &amp; Enter CSR Exchange &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. Active Dashboard View
  const registeredDomains = myIndustry.availableDomains || myIndustry.focusDomains || [];

  const recommendedProposals = proposals.filter(p => {
    const propDomain = p.domain || p.problem?.domain;
    if (registeredDomains.length === 0) return true;
    return propDomain && registeredDomains.some(d => d.toLowerCase() === propDomain.toLowerCase());
  });

  const currentIndId = (myIndustry?._id || '').toString();
  const sendedList = Array.isArray(myIndustry?.sendedProposal) ? myIndustry.sendedProposal : [];
  const acceptedList = Array.isArray(myIndustry?.acceptedProposals) ? myIndustry.acceptedProposals : [];

  const acceptedOffers = proposals.filter((p) => {
    const offer = p.industryOffer;
    const isMine =
      Boolean(currentIndId && offer && ((offer.industry?._id || offer.industry)?.toString() === currentIndId)) ||
      sendedList.some(item => ((item?._id || item)?.toString() === (p._id || '').toString())) ||
      acceptedList.some(item => ((item?._id || item)?.toString() === (p._id || '').toString()));

    return isMine;
  });

  const filteredAllProposals = proposals.filter(p => {
    const propDomain = p.domain || p.problem?.domain;
    const matchesDomain = selectedDomainFilter === 'all' || (propDomain && propDomain.toLowerCase() === selectedDomainFilter.toLowerCase());
    const matchesSearch = !searchQuery.trim() ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.problemStatement?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.university?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.problem?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.problem?.location?.district?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const displayedProposals = activeTab === 'recommended'
    ? (selectedDomainFilter === 'all' ? recommendedProposals : recommendedProposals.filter(p => (p.domain || p.problem?.domain) === selectedDomainFilter))
    : activeTab === 'accepted'
    ? (selectedDomainFilter === 'all' ? acceptedOffers : acceptedOffers.filter(p => (p.domain || p.problem?.domain) === selectedDomainFilter))
    : filteredAllProposals;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      
      {/* Industry Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {myIndustry.name}
            </h1>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-xl transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit CSR Profile</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-500 mr-1">Registered Focus Domains:</span>
            {registeredDomains.map((dom, i) => (
              <span key={i} className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                ✓ {dom}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Section Tabs: Recommended Proposals, All Proposals & Accepted Offers & Govt Sanctions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`flex items-center space-x-2 py-2.5 px-5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'recommended'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Recommended Proposals ({recommendedProposals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center space-x-2 py-2.5 px-5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>All Proposals ({proposals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('accepted')}
            className={`flex items-center space-x-2 py-2.5 px-5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'accepted'
                ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
                : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span>Accepted Offers &amp; Govt Sanctions ({acceptedOffers.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search proposals, universities, districts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Domain Filters Grid View */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Filter Proposals by Domain:</span>
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

      {/* Proposals Grid */}
      <div className="space-y-4 animate-in fade-in">
        <div className="flex items-center justify-between pt-2 pb-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            {activeTab === 'recommended'
              ? 'Recommended Proposals'
              : activeTab === 'accepted'
              ? 'Accepted Offers & Live Govt Sanctions'
              : 'All University Proposals'} ({displayedProposals.length})
          </h2>
        </div>

        {loadingProposals ? (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading university proposals...</p>
          </div>
        ) : displayedProposals.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base text-slate-900 font-heading">
              {activeTab === 'accepted' ? 'No Accepted Offers or Sanctions Found' : 'No Proposals Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {activeTab === 'accepted'
                ? 'When your company submits CSR grants and equipment offers for university proposals, they will be listed here alongside real-time Government statutory sanction approvals.'
                : activeTab === 'recommended'
                ? `No proposals matching your registered domains (${registeredDomains.join(', ')}). Switch to "All Proposals" tab to browse state-wide research initiatives.`
                : 'No university research proposals found matching your filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedProposals.map((prop, idx) => {
              const problem = prop.problem || {};
              const university = prop.university || {};
              const propDomain = prop.domain || problem.domain || 'Innovation';
              const imageUrl = problem.evidence?.[0]?.url || problem.evidenceUrl || '';
              const hasVideo = problem.evidence?.some(e => e.type === 'video' || e.url?.endsWith('.mp4') || e.url?.includes('/video/'));
              
              const offer = prop.industryOffer;
              const sendedList = Array.isArray(myIndustry?.sendedProposal) ? myIndustry.sendedProposal : [];
              const acceptedList = Array.isArray(myIndustry?.acceptedProposals) ? myIndustry.acceptedProposals : [];
              const currentIndId = (myIndustry?._id || '').toString();

              const hasOfferedByMe = 
                Boolean(currentIndId && offer && ((offer.industry?._id || offer.industry)?.toString() === currentIndId)) ||
                sendedList.some(p => ((p?._id || p)?.toString() === (prop._id || '').toString())) ||
                acceptedList.some(p => ((p?._id || p)?.toString() === (prop._id || '').toString()));

              const isSanctioned = prop.status === 'approved_by_govt' || prop.govtApproval?.status === 'approved';

              return (
                <div
                  key={prop._id || idx}
                  className={`bg-white border rounded-3xl overflow-hidden shadow-sm transition-all flex flex-col justify-between group hover:-translate-y-1 ${
                    isSanctioned 
                      ? 'border-emerald-300 shadow-md ring-1 ring-emerald-500/20' 
                      : hasOfferedByMe 
                      ? 'border-purple-200 hover:border-purple-400' 
                      : 'border-slate-200 hover:border-emerald-500/60 hover:shadow-xl'
                  }`}
                >
                  {/* Target Problem Banner */}
                  {imageUrl ? (
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={imageUrl}
                        alt={prop.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                        {hasOfferedByMe && (
                          <span className="flex items-center space-x-1 text-[11px] font-bold text-purple-900 bg-purple-100/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-purple-300 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
                            <span>Offer Made</span>
                          </span>
                        )}
                        {hasVideo && (
                          <span className="flex items-center space-x-1 text-[11px] font-bold text-white bg-indigo-600/90 backdrop-blur-md px-2 py-1 rounded-xl border border-white/20">
                            <Play className="w-3 h-3 fill-current text-white" />
                            <span>Video</span>
                          </span>
                        )}
                        <span className="text-xs font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20">
                          {propDomain}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="flex items-center space-x-1 font-medium bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{problem.location?.district || 'Jharkhand'}</span>
                        </span>
                        <span className="font-bold text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-emerald-500/30">
                          CSR Grant: ₹{(offer?.fundingAmount || prop.estimatedBudget || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-32 w-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-indigo-300 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
                            {propDomain}
                          </span>
                          {hasOfferedByMe && (
                            <span className="flex items-center space-x-1 text-[11px] font-bold text-purple-900 bg-purple-100/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-purple-300 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
                              <span>Offer Made</span>
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs border border-emerald-500/30">
                          CSR Grant: ₹{(offer?.fundingAmount || prop.estimatedBudget || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-300 text-xs font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{problem.location?.district || 'Jharkhand'}</span>
                      </div>
                    </div>
                  )}

                  {/* Proposal & University Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center space-x-2 text-[11px] font-bold text-indigo-700 mb-1">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>{university.name || 'Higher Education Lab'}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg font-heading leading-snug group-hover:text-emerald-800 transition-colors">
                          {prop.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Problem: <strong className="text-slate-700">{problem.title || prop.problemStatement}</strong>
                        </p>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
                        <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                          Technical Methodology &amp; Implementation:
                        </span>
                        <p className="text-slate-700 leading-relaxed text-xs">
                          {prop.description}
                        </p>
                      </div>

                      {/* Live Government Sanction Status (for offered proposals) */}
                      {hasOfferedByMe && (
                        <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                          isSanctioned
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                            : 'bg-amber-50 border-amber-200 text-amber-950'
                        }`}>
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center space-x-1.5">
                              <ShieldCheck className={`w-4 h-4 ${isSanctioned ? 'text-emerald-600' : 'text-amber-600'}`} />
                              <span>{isSanctioned ? 'Approved & Sanctioned by Government' : 'Forwarded to Government (Under Sanction Review)'}</span>
                            </span>
                            {prop.govtApproval?.sanctionOrderNumber && (
                              <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800 font-bold">
                                {prop.govtApproval.sanctionOrderNumber}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {isSanctioned
                              ? (prop.govtApproval?.remarks || 'Statutory approval granted under Section 135 CSR mandate. R&D implementation active.')
                              : 'Tripartite package forwarded to Government Directorate. Awaiting formal sanction order & gazette notification.'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedProblemIdForModal(problem._id || problem.ticketId)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 flex items-center space-x-1.5 cursor-pointer transition-all hover:scale-105 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Check Proposal</span>
                      </button>

                      <div>
                        {hasOfferedByMe ? (
                          <div className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-100 text-purple-900 text-xs font-bold border border-purple-300 shadow-sm">
                            <CheckCircle2 className="w-4 h-4 text-purple-700" />
                            <span>Offer Made</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenOfferModal(prop)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-1.5 transition-all hover:scale-105"
                          >
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Accept &amp; Make Offer</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Make CSR Offer Modal */}
      {isOfferModalOpen && selectedProposalForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-indigo-900 font-black">
                <Briefcase className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg sm:text-xl font-bold font-heading">Submit CSR Grant &amp; Equipment Offer</h3>
              </div>
              <button onClick={() => setIsOfferModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">
                Target Proposal: {selectedProposalForOffer.title}
              </div>
              <div className="text-slate-500">
                Lead University: <strong>{selectedProposalForOffer.university?.name || 'Higher Education Lab'}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Committed CSR Funding Grant (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 500000"
                    value={offerForm.fundingAmount}
                    onChange={(e) => setOfferForm({ ...offerForm, fundingAmount: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lead Technical Mentor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Corporate Technical Mentor"
                    value={offerForm.mentorName}
                    onChange={(e) => setOfferForm({ ...offerForm, mentorName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource &amp; Technical Support Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail how your company will assist: prototype testing facilities, sensor hardware, site visits, mentoring..."
                  value={offerForm.supportDetails}
                  onChange={(e) => setOfferForm({ ...offerForm, supportDetails: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Equipment Offer Checkboxes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Hardware &amp; Equipment Support Provided:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INDUSTRY_SUPPORT_OPTIONS.map((opt) => {
                    const isSelected = offerForm.equipmentProvided.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleOfferEquipment(opt)}
                        className={`p-2 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{opt}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mentor Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Principal Engineer"
                    value={offerForm.mentorDesignation}
                    onChange={(e) => setOfferForm({ ...offerForm, mentorDesignation: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mentor Official Email</label>
                  <input
                    type="email"
                    placeholder="e.g. mentor@company.com"
                    value={offerForm.mentorEmail}
                    onChange={(e) => setOfferForm({ ...offerForm, mentorEmail: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-slate-600 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOffer}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {submittingOffer ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Offer...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit CSR Offer to University</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Industry Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900 font-black">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg sm:text-xl font-bold font-heading">Edit Industry &amp; CSR Profile</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateIndustry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company / Organization Name</label>
                  <input
                    type="text"
                    value={industryForm.name}
                    onChange={(e) => setIndustryForm({ ...industryForm, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">HQ Location</label>
                  <input
                    type="text"
                    value={industryForm.hqLocation}
                    onChange={(e) => setIndustryForm({ ...industryForm, hqLocation: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* availableDomains Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Focus Domains</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_DOMAINS.map((domain) => {
                    const isSelected = industryForm.availableDomains.includes(domain);
                    return (
                      <button
                        type="button"
                        key={domain}
                        onClick={() => toggleDomain(domain)}
                        className={`p-2.5 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{domain}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-slate-600 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject / Decline Proposal Modal */}
      {isRejectModalOpen && selectedProposalForReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-rose-700 font-bold">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold font-heading">Decline Proposal Co-Sponsorship</h3>
              </div>
              <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900 line-clamp-1">
                {selectedProposalForReject.title}
              </div>
              <div className="text-slate-500 text-[11px]">
                University: <strong>{selectedProposalForReject.university?.name || 'Higher Education Lab'}</strong>
              </div>
            </div>

            <form onSubmit={handleConfirmRejectProposal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reason for Declining (Optional feedback for HEI):
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. CSR allocation filled for this domain, hardware requirements outside current capability..."
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReject}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md shadow-rose-600/20 cursor-pointer flex items-center space-x-1.5 transition-all disabled:opacity-50"
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
