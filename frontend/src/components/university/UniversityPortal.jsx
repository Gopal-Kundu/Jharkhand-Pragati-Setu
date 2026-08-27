import React, { useState, useEffect } from 'react';
import { universityApi } from '../../services/universityApi';
import { problemApi } from '../../services/problemApi';
import ProblemDetailsModal from '../common/ProblemDetailsModal';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Award, 
  PlusCircle, 
  MapPin, 
  Send, 
  Check, 
  AlertTriangle, 
  Bell, 
  FileText, 
  Edit3, 
  Briefcase, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  DollarSign,
  Loader2,
  LogIn,
  Search,
  Filter,
  Eye,
  Compass,
  Video,
  Play,
  Image as ImageIcon
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

const formatLocation = (loc) => {
  if (!loc) return 'Jharkhand';
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') {
    const parts = [loc.city, loc.district, loc.state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Jharkhand';
  }
  return String(loc);
};

export default function UniversityPortal() {
  const authState = useSelector((state) => state.auth);
  const authUser = authState?.user;
  const isAuthenticated = authState?.isAuthenticated;

  // Tab State: 'recommended' | 'all'
  const [activeTab, setActiveTab] = useState('recommended');
  
  // Real DB University Profile state
  const [myUniversity, setMyUniversity] = useState(null);
  const [loadingUniv, setLoadingUniv] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  // All State Problems
  const [allProblems, setAllProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');
  
  // Problem Details Modal State
  const [selectedProblemIdForModal, setSelectedProblemIdForModal] = useState(null);

  // University Registration / Edit Form State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [univForm, setUnivForm] = useState({
    name: '',
    shortName: '',
    city: 'Ranchi',
    district: 'Ranchi',
    type: 'State University',
    availableDomains: ['Water Resources', 'Agriculture', 'Environment'],
    academicDisciplines: 'Computer Science, Environmental Engineering, Electrical Engineering, Agronomy',
    researchCentres: 'Hydro-IoT Lab, Smart Grid Centre, Clean Water R&D Cell',
    facultyCount: 85,
    contactEmail: authUser?.email || ''
  });

  // Make Proposal Modal State
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [selectedProblemForProposal, setSelectedProblemForProposal] = useState(null);
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: '',
    problemStatement: '',
    facultyLead: authUser?.name || 'Lead PI',
    facultyDept: 'Applied Engineering & IoT',
    facultyEmail: authUser?.email || '',
    studentTeam: '',
    projectDuration: '6 Months',
    estimatedBudget: 500000,
    industrySupportRequired: ['IoT & Embedded Sensors']
  });

  // Load User's University Profile and problems
  const loadUniversityData = async () => {
    if (!isAuthenticated) {
      setLoadingUniv(false);
      return;
    }
    try {
      setLoadingUniv(true);
      const res = await universityApi.getMyUniversity();
      if (res.university) {
        setMyUniversity(res.university);
        setUnivForm({
          name: res.university.name || '',
          shortName: res.university.shortName || '',
          city: res.university.location?.city || 'Ranchi',
          district: res.university.location?.district || 'Ranchi',
          type: res.university.type || 'State University',
          availableDomains: res.university.availableDomains || ['Water Resources', 'Agriculture'],
          academicDisciplines: (res.university.academicDisciplines || []).join(', '),
          researchCentres: (res.university.researchCentres || []).join(', '),
          facultyCount: res.university.facultyCount || 85,
          contactEmail: res.university.contactEmail || authUser?.email || ''
        });
      } else {
        setMyUniversity(null);
      }

      // Load notifications
      const notifRes = await universityApi.getUniversityNotifications();
      if (notifRes.notifications) {
        setNotifications(notifRes.notifications);
      }

      // Load all problems
      setLoadingProblems(true);
      const problemsRes = await problemApi.getProblems();
      if (problemsRes.problems) {
        setAllProblems(problemsRes.problems);
      }
    } catch (err) {
      console.warn('[Load University Profile Warning]:', err.message);
    } finally {
      setLoadingUniv(false);
      setLoadingProblems(false);
    }
  };

  useEffect(() => {
    loadUniversityData();
  }, [isAuthenticated, authUser]);

  // Handle University Registration
  const handleRegisterUniversity = async (e) => {
    e.preventDefault();
    if (!univForm.name.trim()) {
      toast.error('University institution name is required');
      return;
    }

    try {
      const payload = {
        name: univForm.name,
        shortName: univForm.shortName || univForm.name,
        location: { city: univForm.city, district: univForm.district, state: 'Jharkhand' },
        type: univForm.type,
        availableDomains: univForm.availableDomains,
        academicDisciplines: univForm.academicDisciplines.split(',').map(s => s.trim()).filter(Boolean),
        researchCentres: univForm.researchCentres.split(',').map(s => s.trim()).filter(Boolean),
        facultyCount: Number(univForm.facultyCount) || 50,
        contactEmail: univForm.contactEmail
      };

      const res = await universityApi.registerUniversity(payload);
      setMyUniversity(res.university);
      toast.success('University institution registered successfully!');
      loadUniversityData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register university');
    }
  };

  // Handle University Details Update
  const handleUpdateUniversity = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: univForm.name,
        shortName: univForm.shortName || univForm.name,
        location: { city: univForm.city, district: univForm.district, state: 'Jharkhand' },
        type: univForm.type,
        availableDomains: univForm.availableDomains,
        academicDisciplines: univForm.academicDisciplines.split(',').map(s => s.trim()).filter(Boolean),
        researchCentres: univForm.researchCentres.split(',').map(s => s.trim()).filter(Boolean),
        facultyCount: Number(univForm.facultyCount) || 50,
        contactEmail: univForm.contactEmail
      };

      const res = await universityApi.updateMyUniversity(payload);
      setMyUniversity(res.university);
      setIsEditModalOpen(false);
      toast.success('University profile and domain focus updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update university details');
    }
  };

  // Toggle domain in form
  const toggleDomain = (domain) => {
    setUnivForm(prev => {
      const exists = prev.availableDomains.includes(domain);
      const updated = exists 
        ? prev.availableDomains.filter(d => d !== domain)
        : [...prev.availableDomains, domain];
      return { ...prev, availableDomains: updated };
    });
  };

  // Toggle industry support in proposal form
  const toggleIndustrySupport = (option) => {
    setProposalForm(prev => {
      const exists = prev.industrySupportRequired.includes(option);
      const updated = exists 
        ? prev.industrySupportRequired.filter(o => o !== option)
        : [...prev.industrySupportRequired, option];
      return { ...prev, industrySupportRequired: updated };
    });
  };

  // Open Make Proposal Modal
  const handleOpenProposalModal = (problem) => {
    setSelectedProblemForProposal(problem);
    setProposalForm({
      title: `R&D & Implementation: ${problem.title || 'Grassroots Innovation'}`,
      description: `Multidisciplinary engineering R&D pipeline deploying smart sensors, localized field testing, and prototype fabrication in Jharkhand.`,
      problemStatement: problem.title || problem.message || '',
      facultyLead: authUser?.name || 'Lead PI',
      facultyDept: 'Applied Environmental & IoT Engineering',
      facultyEmail: authUser?.email || '',
      studentTeam: '',
      projectDuration: '6 Months',
      estimatedBudget: 500000,
      industrySupportRequired: ['IoT & Embedded Sensors']
    });
    setIsProposalModalOpen(true);
  };

  // Submit Proposal with AI Industry Matching
  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!proposalForm.title.trim() || !proposalForm.description.trim()) {
      toast.error('Please fill in the proposal title and technical description');
      return;
    }

    try {
      setSubmittingProposal(true);
      const problemId = selectedProblemForProposal._id || selectedProblemForProposal.problemId || selectedProblemForProposal.ticketId || selectedProblemForProposal.id;

      const payload = {
        problemId,
        title: proposalForm.title,
        description: proposalForm.description,
        problemStatement: proposalForm.problemStatement || selectedProblemForProposal.title,
        facultyMembers: [{
          name: proposalForm.facultyLead,
          designation: 'Lead PI & Faculty Lead',
          department: proposalForm.facultyDept,
          email: proposalForm.facultyEmail
        }],
        teamMembers: proposalForm.studentTeam ? proposalForm.studentTeam.split(',').map(s => ({ name: s.trim(), rollNo: '', branch: 'Engineering', year: 'Final Year' })) : [],
        projectDuration: proposalForm.projectDuration,
        estimatedBudget: Number(proposalForm.estimatedBudget) || 500000,
        industrySupportRequired: proposalForm.industrySupportRequired
      };

      const res = await universityApi.createProposal(payload);
      setIsProposalModalOpen(false);
      toast.success(res.message || 'Proposal created and AI matched with Industry Partner!');
      loadUniversityData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setSubmittingProposal(false);
    }
  };

  if (loadingUniv) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <span className="text-xs font-bold text-slate-500 font-mono">Loading university portal...</span>
      </div>
    );
  }

  // 1. Not Logged In Prompt
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">University Innovation &amp; R&amp;D Portal</h2>
        <p className="text-xs text-slate-600">
          Sign in with your University Faculty or Student Innovator account to access assigned citizen challenges, generate research proposals, and connect with CSR sponsors.
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
        >
          <LogIn className="w-4 h-4" />
          <span>Login with University Account</span>
        </Link>
      </div>
    );
  }

  // 2. University Not Registered Yet: Render Dedicated Registration Screen
  if (!myUniversity) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1.5 pb-4 border-b border-slate-100">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Register Your University Institution
            </h1>
          </div>

          <form onSubmit={handleRegisterUniversity} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">University / College Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Birla Institute of Technology (BIT) Mesra"
                  value={univForm.name}
                  onChange={(e) => setUnivForm({ ...univForm, name: e.target.value })}
                  className="w-full p-3 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Name / Acronym *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BIT Mesra"
                  value={univForm.shortName}
                  onChange={(e) => setUnivForm({ ...univForm, shortName: e.target.value })}
                  className="w-full p-3 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={univForm.city}
                  onChange={(e) => setUnivForm({ ...univForm, city: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={univForm.district}
                  onChange={(e) => setUnivForm({ ...univForm, district: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Institution Type</label>
                <select
                  value={univForm.type}
                  onChange={(e) => setUnivForm({ ...univForm, type: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                >
                  <option value="Institute of National Importance">Institute of National Importance</option>
                  <option value="Deemed University & Tech Hub">Deemed University &amp; Tech Hub</option>
                  <option value="State University">State University</option>
                  <option value="Central University">Central University</option>
                  <option value="Autonomous College">Autonomous College</option>
                  <option value="Agricultural University">Agricultural University</option>
                </select>
              </div>
            </div>

            {/* availableDomains Selection */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">
                Specialized Innovation Domains (`availableDomains`) *
              </label>
              <span className="text-[11px] text-slate-500 block">
                Select the domains your university labs and faculty specialize in:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {ALL_DOMAINS.map((domain) => {
                  const isSelected = univForm.availableDomains.includes(domain);
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Academic Disciplines (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, IoT, Environmental Engineering"
                  value={univForm.academicDisciplines}
                  onChange={(e) => setUnivForm({ ...univForm, academicDisciplines: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Contact Email</label>
                <input
                  type="email"
                  value={univForm.contactEmail}
                  onChange={(e) => setUnivForm({ ...univForm, contactEmail: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-2xl shadow-md shadow-emerald-600/20 cursor-pointer transition-all hover:scale-105"
              >
                Register University &amp; Enter Portal &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Handle responding to Industry Offer
  const handleRespondToOffer = async (proposalId, action) => {
    try {
      const res = await universityApi.respondToIndustryOffer(proposalId, { action });
      toast.success(res.message || (action === 'accept' ? 'Industry CSR offer accepted! Forwarded to Government.' : 'Industry offer declined'));
      loadUniversityData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond to offer');
    }
  };

  // Helper to check if a problem is unsolved
  const isUnsolved = (p) => p?.resolutionStatus !== 'solved' && p?.status !== 'validated';

  // 3. Recommended Problems: Matched by availableDomains or live notifications & Unsolved
  const registeredDomains = myUniversity.availableDomains || [];
  
  const recommendedProblems = allProblems.filter(p => {
    if (!isUnsolved(p)) return false;
    if (registeredDomains.length === 0) return true;
    return registeredDomains.includes(p.domain) || notifications.some(n => n.problemId === p._id || n.ticketId === p.ticketId);
  });

  // Filtered All Problems (Excluding solved problems)
  const filteredAllProblems = allProblems.filter(p => {
    if (!isUnsolved(p)) return false;
    const matchesDomain = selectedDomainFilter === 'all' || p.domain === selectedDomainFilter;
    const matchesSearch = !searchQuery.trim() || 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.district?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const totalUnsolvedProblemsCount = allProblems.filter(isUnsolved).length;
  const displayedProblems = activeTab === 'recommended' ? recommendedProblems : filteredAllProblems;

  const myProposals = myUniversity.proposals || [];
  const pendingOffers = myProposals.filter(p => p?.industryOffer?.industry && p?.industryOffer?.responseStatus === 'pending');
  const acceptedOffers = myProposals.filter(p => p?.industryOffer?.responseStatus === 'accepted' || p?.status === 'accepted_by_university' || p?.status === 'approved_by_govt' || p?.status === 'in_progress');

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      
      {/* Dynamic University Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {myUniversity.name}
            </h1>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-xl transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit University Details</span>
            </button>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-600">
            {formatLocation(myUniversity.location)} • {myUniversity.type || 'State University'}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-500 mr-1">Registered Domains:</span>
            {(myUniversity.availableDomains || []).map((dom, i) => (
              <span key={i} className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                ✓ {dom}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Incoming Industry CSR Offers Banner */}
      {pendingOffers && pendingOffers.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-indigo-900 font-black">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold font-heading">
              Incoming Industry CSR Offers ({pendingOffers.length})
            </h2>
          </div>
          <p className="text-xs text-indigo-800">
            Corporate industry partners have committed matching grants and equipment for your R&amp;D proposals. Accept to forward the tripartite package to Government for statutory sanction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {pendingOffers.map((p, pIdx) => {
              const offer = p.industryOffer;
              const ind = offer?.industry || {};

              return (
                <div key={p._id || pIdx} className="bg-white border border-indigo-200 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-900 bg-indigo-100/80 px-2.5 py-0.5 rounded-lg">
                        {ind.name || 'Corporate CSR Sponsor'}
                      </span>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                        ₹{(offer.fundingAmount || 0).toLocaleString()} Grant
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">
                      Proposal: {p.title}
                    </h4>

                    {offer.supportDetails && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {offer.supportDetails}
                      </p>
                    )}

                    {offer.equipmentProvided && offer.equipmentProvided.length > 0 && (
                      <div className="text-[11px] text-slate-500">
                        <strong className="text-slate-700">Committed Equipment:</strong> {offer.equipmentProvided.join(', ')}
                      </div>
                    )}

                    {offer.mentorName && (
                      <div className="text-[11px] text-slate-500">
                        <strong className="text-slate-700">Corporate Mentor:</strong> {offer.mentorName} ({offer.mentorDesignation || 'Technical Lead'})
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleRespondToOffer(p._id, 'reject')}
                      className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-slate-200 cursor-pointer transition-all"
                    >
                      Decline Offer
                    </button>
                    <button
                      onClick={() => handleRespondToOffer(p._id, 'accept')}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-1.5 transition-all hover:scale-105"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept Offer &amp; Forward to Govt</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3 Section Tabs: Recommended Problems, All Problems, & Accepted Offers / Govt Forwarded */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'recommended'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Recommended Problems ({recommendedProblems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>All Problems ({totalUnsolvedProblemsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('accepted')}
            className={`flex items-center space-x-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'accepted'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Accepted Offers &amp; Govt Sanctions ({acceptedOffers.length})</span>
          </button>
        </div>

        {/* Search Input when looking at All Problems */}
        {activeTab === 'all' && (
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search problems, districts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
            />
          </div>
        )}
      </div>

      {/* Domain Filters Grid View */}
      {activeTab === 'all' && (
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
      )}

      {/* Content Grid */}
      <div className="space-y-4 animate-in fade-in">
        {activeTab === 'accepted' ? (
          acceptedOffers.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-indigo-600 mx-auto" />
              <h3 className="font-bold text-base text-slate-900 font-heading">No Accepted Offers Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                When you accept incoming Industry CSR co-sponsorship offers for your R&amp;D proposals, they will appear here along with their live Government statutory sanction status.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {acceptedOffers.map((prop, idx) => {
                const problem = prop.problem || {};
                const offer = prop.industryOffer || {};
                const ind = offer.industry || {};
                const propDomain = prop.domain || problem.domain || 'Innovation';
                const imageUrl = problem.evidence?.[0]?.url || DOMAIN_IMAGES[propDomain] || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
                const isSanctioned = prop.status === 'approved_by_govt' || prop.govtApproval?.status === 'approved';

                return (
                  <div
                    key={prop._id || idx}
                    className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:border-indigo-500/60 hover:shadow-xl transition-all flex flex-col justify-between group"
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
                          CSR Grant: ₹{(offer.fundingAmount || prop.estimatedBudget || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-bold px-2.5 py-0.5 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Accepted &amp; Tripartite Package Forwarded</span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-lg font-heading leading-snug group-hover:text-indigo-800 transition-colors">
                            {prop.title}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Problem: <strong className="text-slate-700">{problem.title || prop.problemStatement}</strong>
                          </p>
                        </div>

                        {/* Industry Sponsor Info */}
                        <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100 text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-indigo-950">
                            <span className="flex items-center space-x-1">
                              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Industry Sponsor: {ind.name || 'Corporate Partner'}</span>
                            </span>
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px]">
                              ₹{(offer.fundingAmount || 0).toLocaleString()} Grant
                            </span>
                          </div>
                          {offer.supportDetails && (
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {offer.supportDetails}
                            </p>
                          )}
                          {offer.equipmentProvided && offer.equipmentProvided.length > 0 && (
                            <div className="text-[10.5px] text-slate-500">
                              <strong className="text-slate-700">Committed Equipment:</strong> {offer.equipmentProvided.join(', ')}
                            </div>
                          )}
                          {offer.mentorName && (
                            <div className="text-[10.5px] text-slate-500">
                              <strong className="text-slate-700">Corporate Mentor:</strong> {offer.mentorName} ({offer.mentorDesignation || 'Lead Technical Architect'})
                            </div>
                          )}
                        </div>

                        {/* Live Government Sanction Status */}
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
                              <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                                {prop.govtApproval.sanctionOrderNumber}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {isSanctioned
                              ? (prop.govtApproval?.remarks || 'Statutory approval granted under Section 135 CSR mandate. R&D implementation active.')
                              : 'The package (Problem Statement + R&D Proposal + Industry CSR Commitment) is awaiting formal administrative sanction order from the nodal department.'}
                          </p>
                        </div>
                      </div>

                      {/* Card Action */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedProblemIdForModal(problem._id || problem.ticketId)}
                          className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Problem &amp; Timeline</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : loadingProblems ? (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading problem statements...</p>
          </div>
        ) : displayedProblems.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base text-slate-900 font-heading">
              {activeTab === 'recommended' ? 'No Recommended Problems' : 'No Problems Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {activeTab === 'recommended'
                ? `When citizens report problems matching your registered domains (${(myUniversity.availableDomains || []).join(', ')}), AI will automatically route them here.`
                : 'Try adjusting your search query or domain filter.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedProblems.map((item, idx) => {
              const isRecommended = registeredDomains.includes(item.domain);
              const districtName = item.location?.district || 'Jharkhand';
              const blockName = item.location?.block || '';
              const panchayatName = item.location?.panchayat || '';
              const imageUrl = item.evidence?.[0]?.url || item.evidenceUrl || DOMAIN_IMAGES[item.domain] || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
              const hasVideo = item.evidence?.some(e => e.type === 'video' || e.url?.endsWith('.mp4') || e.url?.includes('/video/'));

              return (
                <div
                  key={item._id || item.ticketId || idx}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:border-emerald-500/60 hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1"
                >
                  {/* Evidence Photo Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                      {hasVideo && (
                        <span className="flex items-center space-x-1 text-[11px] font-bold text-white bg-indigo-600/90 backdrop-blur-md px-2 py-1 rounded-xl border border-white/20">
                          <Play className="w-3 h-3 fill-current text-white" />
                          <span>Video</span>
                        </span>
                      )}
                      <span className="text-xs font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20">
                        {item.domain || 'Classified'}
                      </span>
                    </div>

                    {/* Location Overlay Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center">
                      <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {panchayatName ? `${panchayatName}, ` : ''}
                          {blockName ? `${blockName}, ` : ''}
                          {districtName}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-bold text-slate-900 text-lg font-heading leading-snug group-hover:text-emerald-800 transition-colors">
                        {item.title}
                      </h3>

                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
                        <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                          Problem Overview:
                        </span>
                        <p className="text-slate-700 leading-relaxed text-xs">
                          {item.description || item.message || 'Grassroots challenge requiring multidisciplinary technological intervention.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedProblemIdForModal(item._id || item.ticketId)}
                        className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => handleOpenProposalModal(item)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-1.5 transition-all hover:scale-105"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>Make Proposal</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit University Details Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900 font-black">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg sm:text-xl font-bold font-heading">Edit University Profile &amp; Domains</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUniversity} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">University Name</label>
                  <input
                    type="text"
                    value={univForm.name}
                    onChange={(e) => setUnivForm({ ...univForm, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Short Name</label>
                  <input
                    type="text"
                    value={univForm.shortName}
                    onChange={(e) => setUnivForm({ ...univForm, shortName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* availableDomains Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Domains Focus</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_DOMAINS.map((domain) => {
                    const isSelected = univForm.availableDomains.includes(domain);
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
                  className="px-4 py-2.5 text-xs text-slate-600 font-bold rounded-xl"
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

      {/* Make Proposal Modal */}
      {isProposalModalOpen && selectedProblemForProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-indigo-900 font-black">
                <Briefcase className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg sm:text-xl font-bold font-heading">Make Innovation Proposal</h3>
              </div>
              <button onClick={() => setIsProposalModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Target Challenge: <strong className="text-slate-900">#{selectedProblemForProposal.ticketId || selectedProblemForProposal.id} - {selectedProblemForProposal.title}</strong>
            </p>

            <form onSubmit={handleSubmitProposal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Proposal Title *</label>
                <input
                  type="text"
                  required
                  value={proposalForm.title}
                  onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Technical Methodology &amp; Implementation Plan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your technological solution, prototype fabrication, sensors, and testing milestones..."
                  value={proposalForm.description}
                  onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Duration</label>
                  <select
                    value={proposalForm.projectDuration}
                    onChange={(e) => setProposalForm({ ...proposalForm, projectDuration: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                  >
                    <option value="3 Months">3 Months (Rapid Prototype)</option>
                    <option value="6 Months">6 Months (Lab to Field Trial)</option>
                    <option value="1 Year">1 Year (Full Scale Deployment)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Budget Required (₹)</label>
                  <input
                    type="number"
                    value={proposalForm.estimatedBudget}
                    onChange={(e) => setProposalForm({ ...proposalForm, estimatedBudget: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Industry Support Required Checkboxes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Industry &amp; Corporate CSR Technical Support Required *
                </label>
                <span className="text-[11px] text-slate-500 block mb-2">
                  AI matches these required capabilities with corporate CSR sponsors (e.g. Tata Steel, CCL, Adani).
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INDUSTRY_SUPPORT_OPTIONS.map((opt) => {
                    const isSelected = proposalForm.industrySupportRequired.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleIndustrySupport(opt)}
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Student Innovators / Team</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma, Priya Kumari"
                  value={proposalForm.studentTeam}
                  onChange={(e) => setProposalForm({ ...proposalForm, studentTeam: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProposalModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-slate-600 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProposal}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {submittingProposal ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI Matchmaking in Progress...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Proposal &amp; Match Industry</span>
                    </>
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
