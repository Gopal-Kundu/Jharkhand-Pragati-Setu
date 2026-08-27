import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/StateContext';
import JharkhandStateOverview from '../components/common/JharkhandStateOverview';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Users,
  Briefcase,
  Layers,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ChevronRight,
  Play,
  Award,
  Globe,
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
  Clock,
  DollarSign,
  BarChart3,
  Workflow,
  Network,
  FileText,
  ChevronDown,
  Search
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

export default function LandingPage() {
  const navigate = useNavigate();
  const {
    problems,
    problemClusters,
    setIsSubmitModalOpen,
    setIsAssistantOpen,
    setActiveRole,
    setSelectedClusterId
  } = useAppState();

  const [selectedDomain, setSelectedDomain] = useState('all');

  const allProblemsList = (problems && problems.length > 0) ? problems : (problemClusters || []);
  
  // Filter for solved challenges primarily, with fallback
  const solvedChallenges = allProblemsList.filter(p => p.resolutionStatus === 'solved' || p.status === 'validated');
  const displayList = solvedChallenges.length > 0 ? solvedChallenges : allProblemsList;

  const filteredProblems = selectedDomain === 'all'
    ? displayList
    : displayList.filter(p => p.domain === selectedDomain || p.primaryDomain === selectedDomain);

  const handleOpenProblem = (id) => {
    setSelectedClusterId(id);
    navigate('/dashboard');
  };

  return (
    <div className="space-y-16 pb-16 bg-grid-slate">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/90 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50/50">
        
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
          
          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.1] font-heading">
              Community Problems Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800">Real-World Solutions</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
              A collaborative platform connecting citizens, universities, industries, and government to identify local challenges and build solutions that create measurable social impact across Jharkhand.
            </p>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/25 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Submit a Societal Challenge</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                document.getElementById('challenges-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm sm:text-base border border-slate-300 shadow-md shadow-slate-200/50 transition-all hover:scale-105 cursor-pointer"
            >
              <Search className="w-5 h-5 text-emerald-600" />
              <span>Explore Solved Challenges</span>
            </button>
          </div>

          {/* Live Platform KPI Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">8+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Reported Challenges</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-heading">6 Solved</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Field Tested & Deployed</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-heading">₹1.85 Cr</div>
              <div className="text-xs text-slate-500 font-medium mt-1">CSR Grants Disbursed</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-600 font-heading">65,000+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Citizens Impacted</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Jharkhand State Overview Map & Live Telemetry Section */}
      <JharkhandStateOverview />

      {/* 3. Solved Challenges Grid with Problem Images */}
      <section id="challenges-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="mb-8">
          <span className="inline-flex items-center space-x-1.5 text-xs font-bold font-mono uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Field Tested & Deployed in Jharkhand</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-heading">
            Solved Challenges
          </h2>
        </div>

        {/* Solved Problem Cards Grid with Evidence Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((p) => {
            const domainKey = p.domain || p.primaryDomain || 'Water Resources';
            const ticket = p.ticketId || p.id;
            const imageUrl = p.evidence?.[0]?.url || DOMAIN_IMAGES[domainKey] || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={ticket}
                onClick={() => handleOpenProblem(ticket)}
                className="group rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/10 transition-all cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1"
              >
                {/* 1. Problem Image with Location Overlay */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                  {/* Location Badge Only */}
                  <div className="absolute bottom-3 left-3 flex items-center">
                    <span className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{p.location?.district || p.districtName || 'Jharkhand'}</span>
                    </span>
                  </div>
                </div>

                {/* 2. Card Body Description */}
                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors line-clamp-2 font-heading leading-snug">
                      {p.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {p.description || p.narrative || 'Grassroots societal challenge resolved via multidisciplinary engineering and CSR grant.'}
                    </p>
                  </div>

                  {/* Key Social Impact Metric Highlight */}
                  {p.socialImpact && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">{p.socialImpact.metricName || 'Key Social Impact'}:</span>
                      <strong className="text-emerald-800 font-black">{p.socialImpact.metricValue || 'Verified'}</strong>
                    </div>
                  )}

                  {/* Institution & Action Row */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center space-x-1 truncate max-w-[170px]">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">
                          {p.allocatedUniversity?.name || 'HEI Lab'}
                        </span>
                      </span>
                      <span className="font-bold text-emerald-800">
                        {p.industryPartners?.[0]?.grantAmount ? `₹${(p.industryPartners[0].grantAmount / 100000).toFixed(1)}L Grant` : 'CSR Funded'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400 font-medium text-[11px]">Lifecycle Complete</span>
                      <span className="text-emerald-700 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                        <span>View Solution</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
