import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/StateContext';
import JharkhandStateOverview from '../components/common/JharkhandStateOverview';
import ProblemDetailsModal from '../components/common/ProblemDetailsModal';
import AnimatedCounter from '../components/common/AnimatedCounter';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Search,
  Droplets,
  Sprout,
  HeartPulse,
  BookOpen,
  Flame,
  Sun,
  Building,
  Eye,
  FileCheck,
  Footprints
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const {
    problems,
    problemClusters,
  } = useAppState();

  const [activeDetailProblemId, setActiveDetailProblemId] = useState(null);

  const allProblemsList = (problems && problems.length > 0) ? problems : (problemClusters || []);
  
  // Filter for solved challenges primarily, with fallback
  const solvedChallenges = allProblemsList.filter(p => p.resolutionStatus === 'solved' || p.status === 'validated');
  const displayList = solvedChallenges.length > 0 ? solvedChallenges : allProblemsList;

  const handleOpenProblem = (id) => {
    // Open on-demand details modal which calls separate API GET /api/problems/:id
    setActiveDetailProblemId(id);
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
              onClick={() => navigate('/auth')}
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

          {/* Live Platform KPI Stats Ribbon with Animated Running Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                <AnimatedCounter start={0} end={1284} duration={1800} />
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Reported Challenges</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-heading">
                <AnimatedCounter start={0} end={400} duration={1800} suffix="+" />
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Challenges Solved</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-heading">
                <AnimatedCounter start={1.0} end={10.85} decimals={2} duration={2000} prefix="₹" suffix=" Cr" />
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Grants Disbursed</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-600 font-heading">
                <AnimatedCounter start={0} end={65000} duration={2200} suffix="+" />
              </div>
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Solved Challenges
          </h2>
        </div>

        {/* Solved Problem Cards Grid with Evidence Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((p) => {
            const domainKey = p.domain || p.primaryDomain || 'Water Resources';
            const ticket = p.ticketId || p.id;
            const imageUrl = p.evidence?.[0]?.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';

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

                 

                  {/* Institution & Action Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span>
                      
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform whitespace-nowrap">
                      <span>View Solution</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* On-Demand Individual Problem Details Modal */}
      {activeDetailProblemId && (
        <ProblemDetailsModal
          problemId={activeDetailProblemId}
          onClose={() => setActiveDetailProblemId(null)}
        />
      )}

    </div>
  );
}
