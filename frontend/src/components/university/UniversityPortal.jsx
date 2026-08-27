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
  const [activeTab, setActiveTab] = useState('incoming'); // incoming, active_rd

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

  const currentHei = (heis || []).find(h => h?.id === activeHeiId) || (heis && heis[0]) || { id: 'bit_mesra', name: 'Birla Institute of Technology (BIT) Mesra', shortName: 'BIT Mesra', location: 'Ranchi' };

  // Matched / Assigned problems for this college
  const allCollegeProblems = (problemClusters || []).filter(c => {
    if (!c) return false;
    return c.allocatedHeiId === activeHeiId || 
           c.allocatedHei?.includes(currentHei?.shortName) || 
           c.institutionMatches?.some(m => m?.heiId === activeHeiId) || 
           c.project?.leadInstitution?.includes(currentHei?.shortName);
  });

  // Incoming problems sent by normal citizens needing college approval
  const incomingProblems = allCollegeProblems.filter(c => c?.status === 'Submitted' || c?.status === 'Sent to College R&D' || c?.status === 'Under Review');

  // Active in-progress R&D projects
  const activeProjects = allCollegeProblems.filter(c => c?.status === 'In College R&D' || c?.status === 'Prototype' || c?.status === 'Pilot' || c?.status === 'Proposal Submitted' || c?.status === 'Industry Joined');

  const handleOpenApproveModal = (cluster) => {
    setSelectedClusterForApproval(cluster);
    setIsApproveModalOpen(true);
  };

  const handleConfirmApproval = () => {
    if (!selectedClusterForApproval) return;
    approveAndAcceptProblem(
      selectedClusterForApproval.id || selectedClusterForApproval.ticketId,
      currentHei?.name || 'BIT Mesra',
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
      author: cluster?.project?.leadFaculty || `${currentHei?.shortName || 'HEI'} Project Lead`,
      message: ''
    }));
    setIsUpdateModalOpen(true);
  };

  const handlePostUpdate = () => {
    if (!selectedClusterForUpdate || !updateForm.message.trim()) return;
    addCollegeProgressUpdate(selectedClusterForUpdate.id || selectedClusterForUpdate.ticketId, updateForm);
    setIsUpdateModalOpen(false);
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      
      {/* 1. College Authority Profile Banner (Clean White & Emerald) */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>COLLEGE AUTHORITY &amp; UNIVERSITY R&amp;D COMMAND</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-heading">
              {currentHei?.name || 'Higher Education Institution'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              {formatLocation(currentHei?.location)} • AI-Matched Grassroots Pipeline • Total Active Citizen Challenges: <strong className="text-slate-900 font-bold">{allCollegeProblems.length}</strong>
            </p>
          </div>

          {/* Switch College Profile */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1 self-start md:self-auto">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Switch College Authority:
            </span>
            <select
              value={activeHeiId}
              onChange={(e) => setActiveHeiId(e.target.value)}
              className="bg-white text-slate-900 font-bold text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              {(heis || []).map(h => (
                <option key={h?.id || Math.random()} value={h?.id}>{h?.shortName || h?.name} ({formatLocation(h?.location)})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10.5px] text-slate-500 font-bold uppercase block">New Problems from Citizens</span>
            <span className="text-xl font-black text-amber-600">{incomingProblems.length} Pending Review</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10.5px] text-slate-500 font-bold uppercase block">Accepted in R&amp;D Labs</span>
            <span className="text-xl font-black text-emerald-700">{activeProjects.length} Active Projects</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10.5px] text-slate-500 font-bold uppercase block">Students Assigned</span>
            <span className="text-xl font-black text-slate-900">24 Innovators</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10.5px] text-slate-500 font-bold uppercase block">NEP Credits Awarded</span>
            <span className="text-xl font-black text-emerald-800">18 Credits</span>
          </div>
        </div>
      </div>

      {/* 2. Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center space-x-2 py-3 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'incoming'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/60 rounded-t-xl shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>1. Incoming Problems from Citizens ({incomingProblems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active_rd')}
          className={`flex items-center space-x-2 py-3 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'active_rd'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/60 rounded-t-xl shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span>2. Active College R&amp;D Projects ({activeProjects.length})</span>
        </button>
      </div>

      {/* TAB 1: Incoming Problems Sent by Normal Citizens */}
      {activeTab === 'incoming' && (
        <div className="space-y-4 animate-in fade-in">
          {incomingProblems.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-extrabold text-base text-slate-900 font-heading">All Citizen Problems Reviewed!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Any new challenge submitted by citizens with photo/video &amp; GPS will automatically be matched by AI and arrive here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {incomingProblems.map((cluster) => {
                const latestReport = cluster.reports?.[0] || {};
                const mediaItems = latestReport.media || [];
                const matchInfo = cluster.institutionMatches?.find(m => m.heiId === activeHeiId) || { matchScore: 96 };

                return (
                  <div
                    key={cluster.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500/60 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-black text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                          #{cluster.id}
                        </span>
                        <span className="text-emerald-800 font-extrabold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>AI Match: {matchInfo.matchScore || 96}% Fit</span>
                        </span>
                      </div>

                      {/* Title & Submitter */}
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 font-heading leading-snug">
                          {cluster.title}
                        </h3>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{cluster.block || 'Torpa'}, {cluster.districtName} • Submitted by: <strong className="text-slate-800">{latestReport.submittedBy || 'Concerned Citizen'}</strong></span>
                        </div>
                      </div>

                      {/* Citizen Narrative */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                        <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                          Ground Problem Narrative:
                        </span>
                        <p className="text-slate-700 leading-relaxed text-xs">
                          "{latestReport.narrative || cluster.aiIntelligence?.rootProblem}"
                        </p>
                      </div>

                      {/* Photo / Video Evidence from Citizen */}
                      <div>
                        <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                          Attached Field Evidence ({mediaItems.length} items):
                        </span>
                        {mediaItems.length === 0 ? (
                          <div className="text-xs text-slate-400 italic">No media attached</div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {mediaItems.map((m, idx) => (
                              <div key={idx} className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center space-x-2">
                                <img
                                  src={m.url}
                                  alt={m.caption}
                                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border border-slate-200"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80';
                                  }}
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{m.caption}</p>
                                  <span className="text-[10px] text-emerald-700 font-mono">Geotagged Photo</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setSelectedClusterId(cluster.id);
                          setActiveView('cluster_detail');
                        }}
                        className="text-slate-600 hover:text-emerald-700 font-bold transition-colors cursor-pointer"
                      >
                        Inspect Details &rarr;
                      </button>

                      <button
                        onClick={() => handleOpenApproveModal(cluster)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer flex items-center space-x-1.5 transition-all hover:scale-105"
                      >
                        <Check className="w-4 h-4 text-white" />
                        <span>Approve &amp; Assign Lab Team</span>
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
          <div className="grid grid-cols-1 gap-6">
            {activeProjects.map((cluster) => {
              const project = cluster.project || {};
              const updates = cluster.collegeUpdates || [];

              return (
                <div
                  key={cluster.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-lg">
                          #{cluster.id}
                        </span>
                        <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-0.5 rounded-full font-bold">
                          ✓ R&amp;D Stage: {cluster.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl text-slate-900 font-heading">
                        {cluster.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Lead PI: <strong className="text-slate-800">{project.leadFaculty || 'Dr. Amitava Roy'}</strong> • Students: <strong className="text-emerald-800">{project.studentTeam || 'Rahul Sharma, Priya Kumari'}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenUpdateModal(cluster)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 cursor-pointer transition-all hover:scale-105 self-start sm:self-auto"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Post Progress Update</span>
                    </button>
                  </div>

                  {/* Updates Stream for this Problem */}
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Live College Progress Log ({updates.length} Updates):</span>
                    </h4>

                    <div className="space-y-2.5">
                      {updates.map((upd, idx) => (
                        <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                                {upd.stage}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{upd.date}</span>
                              <span className="text-[10px] text-slate-500 font-semibold">• by {upd.author}</span>
                            </div>
                            <p className="text-slate-700 text-xs leading-relaxed font-medium">
                              {upd.message}
                            </p>
                          </div>

                          {upd.mediaUrl && (
                            <img
                              src={upd.mediaUrl}
                              alt="Update media"
                              className="w-14 h-14 object-cover rounded-lg border border-slate-200 flex-shrink-0"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center space-x-2 text-emerald-800 font-black">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold font-heading">Approve &amp; Accept Problem into College R&amp;D</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Accepting <strong>#{selectedClusterForApproval.id}</strong> ({selectedClusterForApproval.title}) for research, prototype fabrication &amp; field testing under <strong>{currentHei.name}</strong>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lead Faculty / Principal Investigator</label>
                <input
                  type="text"
                  value={approvalForm.facultyLead}
                  onChange={(e) => setApprovalForm({ ...approvalForm, facultyLead: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Student Engineering Team (NEP Credits)</label>
                <textarea
                  rows={2}
                  value={approvalForm.studentTeam}
                  onChange={(e) => setApprovalForm({ ...approvalForm, studentTeam: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Students will receive 8 NEP 2020 Social Innovation Academic Credits upon project milestone completion.</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-900 font-bold cursor-pointer rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer transition-all flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Acceptance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Post Live Progress Update / Milestone */}
      {isUpdateModalOpen && selectedClusterForUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center space-x-2 text-slate-900 font-black">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold font-heading">Post Live Progress Update &amp; Milestone</h3>
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
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Baseline Survey Complete">1. Baseline Survey &amp; Hydro-Data Collected</option>
                  <option value="Hardware Prototype &amp; Lab Assembly">2. Hardware Prototype &amp; Lab Assembly</option>
                  <option value="Field Pilot Deployed">3. Field Pilot Deployed in Village</option>
                  <option value="Telemetry Verified &amp; Calibrated">4. IoT Telemetry Live &amp; Calibrated</option>
                  <option value="Issue Fully Resolved">5. Issue Fully Resolved &amp; Citizen Validated</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Update Message &amp; Technical Details</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Students calibrated the LoRaWAN submersible sensor in lab today and tested telemetry transmission."
                  value={updateForm.message}
                  onChange={(e) => setUpdateForm({ ...updateForm, message: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 placeholder:text-slate-400 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Author / Sign-off Name</label>
                <input
                  type="text"
                  value={updateForm.author}
                  onChange={(e) => setUpdateForm({ ...updateForm, author: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 text-slate-900 bg-slate-50 font-medium rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-900 font-bold cursor-pointer rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePostUpdate}
                disabled={!updateForm.message.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer transition-all flex items-center space-x-1.5"
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
