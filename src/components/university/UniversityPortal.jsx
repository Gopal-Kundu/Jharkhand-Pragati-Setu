import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { 
  GraduationCap, 
  Building2, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Award, 
  PlusCircle,
  MapPin,
  Image as ImageIcon,
  Send,
  Check,
  AlertTriangle,
  UploadCloud,
  Film,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function UniversityPortal() {
  const { 
    problemClusters, 
    heis, 
    setSelectedClusterId, 
    setActiveView, 
    approveAndAcceptProblem,
    addCollegeProgressUpdate,
    lang 
  } = useAppState();

  const [activeHeiId, setActiveHeiId] = useState('bit_mesra');
  const [activeTab, setActiveTab] = useState('incoming'); // incoming, active_rd, completed

  // Approval modal state
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedClusterForApproval, setSelectedClusterForApproval] = useState(null);
  const [approvalForm, setApprovalForm] = useState({
    facultyLead: 'Dr. Amitava Roy (Prof. & Head, Hydro-IoT Lab)',
    studentTeam: 'Rahul Sharma (M.Tech Final Year), Priya Kumari (B.Tech 3rd Year), Ankit Minz (PhD Scholar)'
  });

  // Post Update modal state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedClusterForUpdate, setSelectedClusterForUpdate] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    author: 'Dr. Amitava Roy (Lead PI, BIT Mesra)',
    stage: 'Hardware Prototype & Lab Assembly',
    message: '',
    mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  });

  const currentHei = heis.find(h => h.id === activeHeiId) || heis[0];

  // Matched / Assigned problems for this college
  const allCollegeProblems = problemClusters.filter(c => {
    return c.allocatedHeiId === activeHeiId || 
           c.allocatedHei?.includes(currentHei.shortName) || 
           c.institutionMatches?.some(m => m.heiId === activeHeiId) || 
           c.project?.leadInstitution?.includes(currentHei.shortName);
  });

  // Incoming problems sent by normal citizens needing college approval
  const incomingProblems = allCollegeProblems.filter(c => c.status === 'Submitted' || c.status === 'Sent to College R&D' || c.status === 'Under Review');

  // Active in-progress R&D projects
  const activeProjects = allCollegeProblems.filter(c => c.status === 'In College R&D' || c.status === 'Prototype' || c.status === 'Pilot' || c.status === 'Proposal Submitted' || c.status === 'Industry Joined');

  const handleOpenApproveModal = (cluster) => {
    setSelectedClusterForApproval(cluster);
    setIsApproveModalOpen(true);
  };

  const handleConfirmApproval = () => {
    if (!selectedClusterForApproval) return;
    approveAndAcceptProblem(
      selectedClusterForApproval.id,
      currentHei.name,
      approvalForm.facultyLead,
      approvalForm.studentTeam
    );
    setIsApproveModalOpen(false);
    try {
      confetti({ particleCount: 90, spread: 70 });
    } catch {}
  };

  const handleOpenUpdateModal = (cluster) => {
    setSelectedClusterForUpdate(cluster);
    setUpdateForm(prev => ({
      ...prev,
      author: cluster.project?.leadFaculty || `${currentHei.shortName} Project Lead`,
      message: ''
    }));
    setIsUpdateModalOpen(true);
  };

  const handlePostUpdate = () => {
    if (!selectedClusterForUpdate || !updateForm.message.trim()) return;
    addCollegeProgressUpdate(selectedClusterForUpdate.id, updateForm);
    setIsUpdateModalOpen(false);
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      {/* College Authority Profile Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/50 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-black px-3 py-1 rounded-full">
              <GraduationCap className="w-4 h-4" />
              <span>COLLEGE AUTHORITY & UNIVERSITY R&D COMMAND</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {currentHei.name}
            </h1>
            <p className="text-xs text-purple-200/90 max-w-2xl">
              {currentHei.location} • AI-Matched Grassroots Pipeline • Total Active Citizen Challenges: <strong>{allCollegeProblems.length}</strong>
            </p>
          </div>

          {/* Switch College Profile */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-purple-800/60 text-xs space-y-1">
            <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">
              Switch College Authority:
            </span>
            <select
              value={activeHeiId}
              onChange={(e) => setActiveHeiId(e.target.value)}
              className="bg-purple-900/90 text-white font-bold text-xs p-2 rounded-xl border border-purple-400 focus:outline-none cursor-pointer"
            >
              {heis.map(h => (
                <option key={h.id} value={h.id}>{h.shortName} ({h.location})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-purple-800/60 text-xs">
          <div className="bg-purple-900/40 p-2.5 rounded-xl border border-purple-700/50">
            <span className="text-[10px] text-purple-300 font-bold uppercase block">New Problems from Citizens</span>
            <span className="text-xl font-black text-amber-300">{incomingProblems.length} Pending Review</span>
          </div>
          <div className="bg-purple-900/40 p-2.5 rounded-xl border border-purple-700/50">
            <span className="text-[10px] text-purple-300 font-bold uppercase block">Accepted in R&D Labs</span>
            <span className="text-xl font-black text-emerald-300">{activeProjects.length} Active Projects</span>
          </div>
          <div className="bg-purple-900/40 p-2.5 rounded-xl border border-purple-700/50">
            <span className="text-[10px] text-purple-300 font-bold uppercase block">Students Assigned</span>
            <span className="text-xl font-black text-white">24 Innovators</span>
          </div>
          <div className="bg-purple-900/40 p-2.5 rounded-xl border border-purple-700/50">
            <span className="text-[10px] text-purple-300 font-bold uppercase block">NEP Credits Awarded</span>
            <span className="text-xl font-black text-cyan-300">18 Credits</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center space-x-2 py-3 px-4 text-xs font-black border-b-2 transition-all cursor-pointer ${
            activeTab === 'incoming'
              ? 'border-amber-400 text-amber-300 bg-amber-950/30 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>1. Incoming Problems Sent by Normal People ({incomingProblems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active_rd')}
          className={`flex items-center space-x-2 py-3 px-4 text-xs font-black border-b-2 transition-all cursor-pointer ${
            activeTab === 'active_rd'
              ? 'border-purple-400 text-purple-300 bg-purple-950/30 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>2. Accepted College R&D Projects & Updates ({activeProjects.length})</span>
        </button>
      </div>

      {/* TAB 1: Incoming Problems Sent by Normal Citizens */}
      {activeTab === 'incoming' && (
        <div className="space-y-4 animate-in fade-in">
          {incomingProblems.length === 0 ? (
            <div className="bg-slate-900/80 rounded-2xl p-8 text-center border border-slate-800 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-extrabold text-base text-white">All Citizen Problems Reviewed!</h3>
              <p className="text-xs text-slate-400">
                Any new challenge submitted by normal citizens with photo/video & GPS will automatically be matched by AI and arrive here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingProblems.map((cluster) => {
                const latestReport = cluster.reports?.[0] || {};
                const mediaItems = latestReport.media || [];
                const matchInfo = cluster.institutionMatches?.find(m => m.heiId === activeHeiId) || { matchScore: 96 };

                return (
                  <div
                    key={cluster.id}
                    className="bg-slate-900/90 rounded-2xl p-5 border border-amber-500/40 hover:border-amber-400 shadow-xl transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-md">
                          #{cluster.id}
                        </span>
                        <span className="text-amber-300 font-extrabold bg-amber-950/80 border border-amber-700/80 px-2.5 py-1 rounded-full text-xs flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Match: {matchInfo.matchScore || 96}% Fit</span>
                        </span>
                      </div>

                      {/* Title & Submitter */}
                      <div>
                        <h3 className="font-black text-base text-white leading-snug">
                          {cluster.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{cluster.block || 'Torpa'}, {cluster.districtName} • Submitted by: <strong className="text-white">{latestReport.submittedBy || 'Citizen'}</strong></span>
                        </div>
                      </div>

                      {/* Citizen Narrative */}
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                          Citizen Problem Description:
                        </span>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                          "{latestReport.narrative || cluster.aiIntelligence?.rootProblem}"
                        </p>
                      </div>

                      {/* Photo / Video Evidence from Citizen */}
                      <div>
                        <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Attached Citizen Evidence ({mediaItems.length} items):
                        </span>
                        {mediaItems.length === 0 ? (
                          <div className="text-[11px] text-slate-500 italic">No media attached</div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {mediaItems.map((m, idx) => (
                              <div key={idx} className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center space-x-2">
                                <img
                                  src={m.url}
                                  alt={m.caption}
                                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border border-slate-700"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80';
                                  }}
                                />
                                <div className="min-w-0">
                                  <p className="text-[11px] font-bold text-white truncate">{m.caption}</p>
                                  <span className="text-[9.5px] text-emerald-400 font-mono">Geotagged Photo</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setSelectedClusterId(cluster.id);
                          setActiveView('cluster_detail');
                        }}
                        className="text-purple-400 hover:text-purple-300 font-bold hover:underline cursor-pointer"
                      >
                        Inspect Details & Telemetry &rarr;
                      </button>

                      <button
                        onClick={() => handleOpenApproveModal(cluster)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center space-x-1.5 transition-all hover:scale-105"
                      >
                        <Check className="w-4 h-4 text-slate-950" />
                        <span>Approve & Assign Lab Team</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Accepted College R&D Projects & Live Updates */}
      {activeTab === 'active_rd' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 gap-4">
            {activeProjects.map((cluster) => {
              const project = cluster.project || {};
              const updates = cluster.collegeUpdates || [];

              return (
                <div
                  key={cluster.id}
                  className="bg-slate-900/90 rounded-2xl p-6 border border-purple-500/40 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-purple-400 bg-purple-950/60 border border-purple-800 px-2 py-0.5 rounded">
                          #{cluster.id}
                        </span>
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                          ✓ R&D Stage: {cluster.status}
                        </span>
                      </div>
                      <h3 className="font-black text-lg text-white">
                        {cluster.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Lead PI: <strong className="text-white">{project.leadFaculty || 'Dr. Amitava Roy'}</strong> • Students: <strong className="text-purple-300">{project.studentTeam || 'Rahul Sharma, Priya Kumari'}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenUpdateModal(cluster)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 flex items-center space-x-1.5 cursor-pointer transition-all hover:scale-105"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-300" />
                      <span>Post Live Update & Milestone</span>
                    </button>
                  </div>

                  {/* Updates Stream for this Problem */}
                  <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>Live College Progress Log ({updates.length} Updates):</span>
                    </h4>

                    <div className="space-y-2.5">
                      {updates.map((upd, idx) => (
                        <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-bold bg-purple-900/60 text-purple-300 border border-purple-700 px-2 py-0.5 rounded">
                                {upd.stage}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">{upd.date}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">• by {upd.author}</span>
                            </div>
                            <p className="text-slate-200 text-xs leading-relaxed font-medium">
                              {upd.message}
                            </p>
                          </div>

                          {upd.mediaUrl && (
                            <img
                              src={upd.mediaUrl}
                              alt="Update media"
                              className="w-14 h-14 object-cover rounded-lg border border-slate-700 flex-shrink-0"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: College Authority Approves Problem */}
      {isApproveModalOpen && selectedClusterForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center space-x-2 text-emerald-800 font-black">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-black">Approve & Accept Problem into College R&D</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Accepting <strong>#{selectedClusterForApproval.id}</strong> ({selectedClusterForApproval.title}) for research, prototype fabrication & field testing under <strong>{currentHei.name}</strong>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lead Faculty / Principal Investigator</label>
                <input
                  type="text"
                  value={approvalForm.facultyLead}
                  onChange={(e) => setApprovalForm({ ...approvalForm, facultyLead: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 text-slate-900 bg-white font-medium rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Student Engineering Team (NEP Credits)</label>
                <textarea
                  rows={2}
                  value={approvalForm.studentTeam}
                  onChange={(e) => setApprovalForm({ ...approvalForm, studentTeam: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 text-slate-900 bg-white font-medium rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Students will receive 8 NEP 2020 Social Innovation Academic Credits upon project milestone completion.</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Acceptance & Notify Citizen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Post Live Progress Update / Milestone */}
      {isUpdateModalOpen && selectedClusterForUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center space-x-2 text-purple-900 font-black">
              <PlusCircle className="w-5 h-5 text-purple-700" />
              <h3 className="text-base font-black">Post Live Progress Update & Milestone</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Posting updates for <strong>#{selectedClusterForUpdate.id}</strong>. This update will be published live to the citizen, panchayat, and state telemetry map.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Update Milestone Stage</label>
                <select
                  value={updateForm.stage}
                  onChange={(e) => setUpdateForm({ ...updateForm, stage: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 text-slate-900 bg-white font-medium rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="Baseline Survey Complete">1. Baseline Survey & Hydro-Data Collected</option>
                  <option value="Hardware Prototype & Lab Assembly">2. Hardware Prototype & Lab Assembly</option>
                  <option value="Field Pilot Deployed">3. Field Pilot Deployed in Village</option>
                  <option value="Telemetry Verified & Calibrated">4. IoT Telemetry Live & Calibrated</option>
                  <option value="Issue Fully Resolved">5. Issue Fully Resolved & Citizen Validated</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Update Message & Technical Details</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Students calibrated the LoRaWAN submersible sensor in lab today and tested telemetry transmission."
                  value={updateForm.message}
                  onChange={(e) => setUpdateForm({ ...updateForm, message: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 font-medium rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Author / Sign-off Name</label>
                <input
                  type="text"
                  value={updateForm.author}
                  onChange={(e) => setUpdateForm({ ...updateForm, author: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 text-slate-900 bg-white font-medium rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePostUpdate}
                disabled={!updateForm.message.trim()}
                className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center space-x-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Publish Update Live</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
