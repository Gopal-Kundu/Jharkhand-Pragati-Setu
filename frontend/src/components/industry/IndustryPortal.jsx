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
    hqLocation: 'Ranchi, Jharkhand',
    availableDomains: ['Water Resources', 'Agriculture', 'Environment'],
    supportCapabilities: ['IoT & Embedded Sensors', 'Rapid Prototyping & Metal 3D Printing'],
    csrAnnualBudgetInr: 5000000,
    contactEmail: authUser?.email || '',
    mentorName: authUser?.name || 'Corporate Technical Lead',
    mentorDesignation: 'Director of CSR & Technology'
  });

  // CSR Offer Form State
  const [offerForm, setOfferForm] = useState({
    fundingAmount: 500000,
    supportDetails: '',
    equipmentProvided: ['IoT & Embedded Sensors'],
    mentorName: authUser?.name || 'Corporate Technical Mentor',
    mentorDesignation: 'Senior Principal Engineer',
    mentorEmail: authUser?.email || ''
  });

  // Load Industry Profile & Domain Proposals
  const loadIndustryData = async () => {
    if (!isAuthenticated) {
      setLoadingProfile(false);
      return;
    }
    try {
      setLoadingProfile(true);
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
        setLoadingProposals(true);
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
      setLoadingProfile(false);
      setLoadingProposals(false);
    }
  };

  useEffect(() => {
    loadIndustryData();
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
      loadIndustryData();
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
                  value={industryForm.hqLocation}
                  onChange={(e) => setIndustryForm({ ...industryForm, hqLocation: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Annual Committed CSR Pool (₹)</label>
                <input
                  type="number"
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
                  value={industryForm.mentorName}
                  onChange={(e) => setIndustryForm({ ...industryForm, mentorName: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Contact Email</label>
                <input
                  type="email"
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

      {/* 2 Section Tabs: Recommended Proposals & All Proposals */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-2">
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
            {activeTab === 'recommended' ? 'Recommended Proposals' : 'All University Proposals'} ({displayedProposals.length})
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
            <h3 className="font-bold text-base text-slate-900 font-heading">No Proposals Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {activeTab === 'recommended'
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
              const imageUrl = problem.evidence?.[0]?.url || DOMAIN_IMAGES[propDomain] || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
              const hasVideo = problem.evidence?.some(e => e.type === 'video' || e.url?.endsWith('.mp4') || e.url?.includes('/video/'));
              
              const offer = prop.industryOffer;
              const hasOfferedByMe = offer && (offer.industry?._id === myIndustry._id || offer.industry === myIndustry._id);

              return (
                <div
                  key={prop._id || idx}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:border-emerald-500/60 hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1"
                >
                  {/* Target Problem Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={imageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-3 right-3 flex items-center space-x-1.5">
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

                      <span className="bg-emerald-950/80 backdrop-blur-md text-emerald-300 px-2.5 py-1 rounded-xl font-bold border border-emerald-500/30">
                        Est. ₹{(prop.estimatedBudget || 500000).toLocaleString()}
                      </span>
                    </div>
                  </div>

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

                      

                      
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedProblemIdForModal(problem._id || problem.ticketId)}
                        className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Details</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenRejectModal(prop)}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => handleOpenOfferModal(prop)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-1.5 transition-all hover:scale-105"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>{hasOfferedByMe ? 'Update CSR Offer' : 'Accept & Make Offer'}</span>
                        </button>
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
                    value={offerForm.fundingAmount}
                    onChange={(e) => setOfferForm({ ...offerForm, fundingAmount: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lead Technical Mentor Name</label>
                  <input
                    type="text"
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
                    value={offerForm.mentorDesignation}
                    onChange={(e) => setOfferForm({ ...offerForm, mentorDesignation: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mentor Official Email</label>
                  <input
                    type="email"
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
