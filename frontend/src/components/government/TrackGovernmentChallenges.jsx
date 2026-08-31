import React, { useState, useEffect } from 'react';
import { problemApi } from '../../services/problemApi';
import ProblemDetailsModal from '../common/ProblemDetailsModal';
import {
  Search,
  MapPin,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Briefcase,
  AlertCircle,
  Loader2,
  Building,
  Droplets,
  Sprout,
  HeartPulse,
  BookOpen,
  Flame,
  Sun,
  Eye,
  FileCheck,
  Footprints
} from 'lucide-react';

const DOMAINS = [
  'Water Resources',
  'Agriculture',
  'Healthcare',
  'Education',
  'Environment',
  'Energy',
  'Urban Development',
  'Accessibility',
  'Public Administration',
  'Rural Livelihoods',
  'Others'
];

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
  'Rural Livelihoods': Footprints,
  'Others': Eye
};

export default function TrackGovernmentChallenges() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const loadAllProblems = async () => {
    try {
      setLoading(true);
      const data = await problemApi.getProblems({ limit: 100 });
      setProblems(data.problems || []);
    } catch (err) {
      console.error('Error loading government tracking problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllProblems();
  }, []);

  const filteredProblems = problems.filter(p => {
    const matchesSearch =
      !searchQuery.trim() ||
      p._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.block?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.panchayat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.submitter?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = selectedDomain === 'All' || p.domain === selectedDomain;

    let matchesStatus = true;
    if (selectedStatus === 'Solved') {
      matchesStatus = p.resolutionStatus === 'solved' || p.status === 'validated';
    } else if (selectedStatus === 'In Progress') {
      matchesStatus = p.status === 'in_progress' || p.status === 'allocated' || p.status === 'funded';
    } else if (selectedStatus === 'AI Triage') {
      matchesStatus = p.status === 'submitted' || p.status === 'ai_triage';
    }

    return matchesSearch && matchesDomain && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Bar */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Track Submitted Challenges
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Monitor real-time progress from submission and AI triage through university R&D to field deployment.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Ticket ID (e.g. JH-WTR-1042), keyword, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Domain Selector */}
        <div className="md:col-span-3">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="All">All Domains</option>
            {DOMAINS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div className="md:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="All">All Statuses</option>
            <option value="AI Triage">AI Triage / Submitted</option>
            <option value="In Progress">Allocated &amp; In Progress</option>
            <option value="Solved">Field Tested &amp; Solved</option>
          </select>
        </div>

      </div>

      {/* Problem Cards List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-xs font-bold text-slate-600 font-mono">Loading challenge telemetry...</span>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-bold text-sm text-slate-700">No challenge statements matched your filter</p>
          <p className="text-xs text-slate-500">Try adjusting your keyword or domain filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((p) => {
            const ticket = p.ticketId || p.id;
            const isSolved = p.resolutionStatus === 'solved' || p.status === 'validated';
            const isInProgress = p.status === 'in_progress' || p.status === 'allocated' || p.status === 'funded';
            const Icon = DOMAIN_ICONS[p.domain] || Droplets;

            return (
              <div
                key={ticket}
                onClick={() => setSelectedProblemId(ticket)}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/10 transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-0.5"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                    #{ticket}
                  </span>
                  
                  <span className="flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <Icon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{p.domain}</span>
                  </span>
                </div>

                {/* Title & Location */}
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-bold text-slate-900 text-base font-heading line-clamp-2 leading-snug">
                    {p.title}
                  </h3>
                  
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">
                      {p.location?.panchayat ? `${p.location.panchayat}, ` : ''}
                      {p.location?.block ? `${p.location.block}, ` : ''}
                      {p.location?.district || 'Jharkhand'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Resolution Status & Stepper */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium text-[11px]">Resolution Stage</span>
                    <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                      isSolved 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isInProgress 
                          ? 'bg-indigo-100 text-indigo-800' 
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isSolved ? '✓ Solved & Deployed' : isInProgress ? '🔬 College R&D Active' : '🤖 AI Triage & Review'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        isSolved ? 'w-full bg-emerald-600' : isInProgress ? 'w-2/3 bg-indigo-600' : 'w-1/3 bg-amber-500'
                      }`} 
                    />
                  </div>

                  {/* Footer Row */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-600 truncate max-w-[170px] text-[11px] font-medium flex items-center space-x-1">
                      <GraduationCap className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                      <span className="truncate">{p.allocatedUniversity?.name || 'In Allocation'}</span>
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>View Status</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* On-Demand Problem Details Modal */}
      {selectedProblemId && (
        <ProblemDetailsModal
          problemId={selectedProblemId}
          onClose={() => setSelectedProblemId(null)}
        />
      )}

    </div>
  );
}
