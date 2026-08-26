import React, { useState, useRef } from 'react';
import { useAppState } from '../../context/StateContext';
import { analyzeProblemSubmission } from '../../services/aiIntelligenceEngine';
import { 
  X, 
  Sparkles, 
  MapPin, 
  UploadCloud, 
  Mic, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Image as ImageIcon,
  Radio,
  Users,
  Layers,
  Check,
  Trash2,
  Film,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MultiStepSubmissionModal() {
  const { 
    isSubmitModalOpen, 
    setIsSubmitModalOpen, 
    districts, 
    submitCitizenProblem, 
    setSelectedClusterId,
    setActiveView,
    lang 
  } = useAppState();

  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: 'Sombari Devi',
    phone: '+91 94311 55678',
    submitterType: 'Citizen', // Citizen, Community Group, Gram Panchayat, SHG
    title: '',
    narrative: 'The check-dam pond in our village dries up every summer by February. Over 400 households have no water for vegetable farming and livestock. Handpumps yield dirty iron water.',
    frequency: 'Seasonal (Repeats every summer)',
    urgency: 'High',
    duration: 'Existed for over 4 years',
    previousAttempts: 'Villagers dug traditional trench but it silted up.',
    
    // Evidence
    mediaFiles: [
      { type: 'image', caption: 'Silted pond catchment basin', url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80' },
      { type: 'image', caption: 'Defunct irrigation canal', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80' }
    ],

    // Location
    district: 'khunti',
    districtName: 'Khunti',
    block: 'Torpa',
    panchayat: 'Dormba',
    village: 'Dormba',
    gps: { lat: 23.0841, lng: 85.2514 },

    // Impact
    affectedPopulation: '4800',
    economicImpact: 'Farmers lose ₹25,000 per family in rabi crop revenue.',
    healthImpact: 'Water-borne diarrhea outbreaks in hot months.',
    vulnerableGroup: 'Women and children travel 3.5 km daily on foot.'
  });

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newMedia = files.map(file => {
      const isVid = file.type.startsWith('video/');
      const isPdf = file.type === 'application/pdf';
      const fileType = isVid ? 'video' : isPdf ? 'document' : 'image';
      return {
        type: fileType,
        caption: file.name,
        url: URL.createObjectURL(file),
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      };
    });

    setFormData(prev => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...newMedia]
    }));
    // Reset file input so same file can be re-uploaded if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveMedia = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const [aiPreview, setAiPreview] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  if (!isSubmitModalOpen) return null;

  const currentDistrictObj = districts.find(d => d.id === formData.district) || districts[0];

  const handleDistrictChange = (dId) => {
    const dObj = districts.find(d => d.id === dId);
    setFormData(prev => ({
      ...prev,
      district: dId,
      districtName: dObj ? dObj.name : 'Ranchi',
      block: dObj && dObj.blocks ? dObj.blocks[0] : 'Sadar'
    }));
  };

  const handleVoiceSimulation = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setFormData(prev => ({
        ...prev,
        narrative: prev.narrative + ' Also, the local primary school drinking water well has gone completely dry.'
      }));
    }, 2000);
  };

  // Run AI analysis on step 4 transition
  const handleProceedToReview = () => {
    const preview = analyzeProblemSubmission(formData, []);
    setAiPreview(preview);
    setStep(5);
  };

  const handleFinalSubmit = () => {
    const res = submitCitizenProblem(formData);
    setSubmissionResult(res);
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {
      // Confetti fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                {lang === 'hi' ? 'नागरिक समस्या रिपोर्टिंग प्रणाली' : 'Citizen Problem Intake & AI Structuring'}
              </h3>
              <p className="text-xs text-emerald-200/80 font-medium">
                {lang === 'hi' ? 'सरल भाषा में समस्या दर्ज करें - AI इसे अनुसंधान एवं समाधान में बदलेगा' : 'Transform real-world grassroots problems into university innovation projects'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(false)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!submissionResult && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between">
            {[
              { s: 1, label: 'Describe' },
              { s: 2, label: 'Evidence' },
              { s: 3, label: 'Location' },
              { s: 4, label: 'Impact' },
              { s: 5, label: 'AI Review' }
            ].map((st) => (
              <div key={st.s} className="flex items-center space-x-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === st.s
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                    : step > st.s
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > st.s ? <Check className="w-3.5 h-3.5" /> : st.s}
                </div>
                <span className={`text-[11px] font-semibold hidden sm:inline ${
                  step === st.s ? 'text-emerald-900' : 'text-slate-500'
                }`}>
                  {st.label}
                </span>
                {st.s < 5 && <span className="text-slate-300 text-xs mx-1 hidden sm:inline">&rarr;</span>}
              </div>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Submission Success Screen */}
          {submissionResult ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  {lang === 'hi' ? 'समस्या AI द्वारा कॉलेज को भेजी गई!' : 'AI Checked & Auto-Sent to College R&D!'}
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  AI analyzed your photos, videos, and GPS details, identified the root cause, and automatically dispatched the problem directly to the ideal college authority R&D inbox.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Problem ID:</span>
                  <span className="font-mono font-bold text-emerald-800">#{submissionResult.clusterId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Auto-Matched College:</span>
                  <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                    🎓 {submissionResult.matchedHei?.name || 'BIT Mesra'} ({submissionResult.matchedHei?.matchScore || 96}% Fit)
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Sent to College Authority Inbox
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">College Action:</span>
                  <span className="font-semibold text-indigo-700">Professors & Students Reviewing Problem Fix</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedClusterId(submissionResult.clusterId);
                    setActiveView('cluster_detail');
                    setIsSubmitModalOpen(false);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow cursor-pointer transition-all flex items-center space-x-1.5"
                >
                  <span>Track Live Problem Progress</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Describe the Problem */}
              {step === 1 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-900 flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Simple Language Prompt:</strong> Describe what you see in your own words. You do not need technical terms—our AI will translate it into research requirements.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Name / Group</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Stakeholder Category</label>
                      <select
                        value={formData.submitterType}
                        onChange={(e) => setFormData({ ...formData, submitterType: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Citizen">Individual Citizen / Farmer</option>
                        <option value="Community Organization">Community Organization / SHG</option>
                        <option value="Panchayati Raj Institution">Gram Panchayat / Mukhiya</option>
                        <option value="School / Health Official">School Educator / Health Worker</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Problem Title (Short)</label>
                    <input
                      type="text"
                      placeholder="e.g. Village check-dam pond drying up in summer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        What is happening? Describe the problem in detail:
                      </label>
                      <button
                        type="button"
                        onClick={handleVoiceSimulation}
                        className={`flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Mic className="w-3 h-3 text-red-500" />
                        <span>{isRecording ? 'Listening in Hindi...' : 'Voice Assist (बोलकर दर्ज करें)'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.narrative}
                      onChange={(e) => setFormData({ ...formData, narrative: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Urgency</label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 text-slate-900 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Critical">Critical (Immediate Health/Safety Hazard)</option>
                        <option value="High">High (Seasonal Livelihood/Water Threat)</option>
                        <option value="Medium">Medium (Chronic recurring infrastructure need)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">How long has it existed?</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Evidence */}
              {step === 2 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,video/*,application/pdf"
                    multiple
                    className="hidden"
                  />

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleFileSelect({ target: { files: e.dataTransfer.files } });
                      }
                    }}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl p-5 text-center transition-colors bg-emerald-50/20 hover:bg-emerald-50/40 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">Attach Photographs, Short Videos or Documents</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Click to browse or drag & drop files (Supports PNG, JPG, MP4, PDF)
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md"
                    >
                      Browse Device
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Attached Field Evidence ({formData.mediaFiles.length} {formData.mediaFiles.length === 1 ? 'item' : 'items'}):
                      </label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                      >
                        + Add More
                      </button>
                    </div>

                    {formData.mediaFiles.length === 0 ? (
                      <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-400">
                        No files attached yet. Click "Browse Device" above to add photos or videos.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {formData.mediaFiles.map((m, idx) => (
                          <div key={idx} className="bg-slate-50 hover:bg-slate-100/80 rounded-xl p-2.5 flex items-center justify-between border border-slate-200 transition-colors">
                            <div className="flex items-center space-x-2.5 min-w-0">
                              {m.type === 'video' ? (
                                <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                                  <Film className="w-6 h-6" />
                                </div>
                              ) : m.type === 'document' ? (
                                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                                  <FileCheck className="w-6 h-6" />
                                </div>
                              ) : (
                                <img 
                                  src={m.url} 
                                  alt={m.caption} 
                                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border border-slate-200" 
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80';
                                  }}
                                />
                              )}
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-slate-800 truncate" title={m.caption}>
                                  {m.caption}
                                </p>
                                <div className="flex items-center space-x-1 mt-0.5">
                                  <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                    {m.type}
                                  </span>
                                  {m.size && (
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      • {m.size}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveMedia(idx)}
                              title="Remove item"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer ml-1 flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Location */}
              {step === 3 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      <span className="font-semibold text-emerald-950">GPS Auto-Location Detected</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-800">
                      {formData.gps.lat.toFixed(4)}° N, {formData.gps.lng.toFixed(4)}° E
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                      <select
                        value={formData.district}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {districts.map(d => (
                          <option key={d.id} value={d.id}>{d.name} ({d.nameHi})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Block / Taluk</label>
                      <select
                        value={formData.block}
                        onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {(currentDistrictObj.blocks || ['Sadar']).map((b, i) => (
                          <option key={i} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Panchayat / Urban Ward</label>
                      <input
                        type="text"
                        value={formData.panchayat}
                        onChange={(e) => setFormData({ ...formData, panchayat: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Village / Tola</label>
                      <input
                        type="text"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Impact */}
              {step === 4 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Approximate Population Affected
                    </label>
                    <input
                      type="number"
                      value={formData.affectedPopulation}
                      onChange={(e) => setFormData({ ...formData, affectedPopulation: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">e.g. 4800 citizens across 3 villages</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Economic & Livelihood Impact</label>
                    <input
                      type="text"
                      value={formData.economicImpact}
                      onChange={(e) => setFormData({ ...formData, economicImpact: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Health & Vulnerable Groups Impact</label>
                    <input
                      type="text"
                      value={formData.vulnerableGroup}
                      onChange={(e) => setFormData({ ...formData, vulnerableGroup: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: AI Review & Instant Insight Preview */}
              {step === 5 && aiPreview && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                        <span>AI Problem Intelligence Engine</span>
                      </span>
                      <span className="text-[11px] bg-emerald-700 px-2 py-0.5 rounded font-bold">
                        Confidence: {(aiPreview.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-emerald-300 text-[11px] block">Classified Domains:</span>
                        <strong className="text-white">{aiPreview.primaryDomain}</strong>
                        <span className="text-emerald-200 text-[10px] block">
                          + {aiPreview.secondaryDomains.join(', ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-emerald-300 text-[11px] block">Prioritization Score:</span>
                        <strong className="text-amber-300 text-base">{aiPreview.prioritizationScore}/100</strong>
                      </div>
                    </div>
                  </div>

                  {/* Structuring Breakdown */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-800">Root Cause Hypothesis:</h5>
                    <p className="text-slate-700 text-[11px] leading-relaxed">{aiPreview.rootProblem}</p>

                    <h5 className="font-bold text-slate-800 pt-1">Required Academic Disciplines:</h5>
                    <div className="flex flex-wrap gap-1">
                      {aiPreview.requiredDisciplines.map((d, i) => (
                        <span key={i} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Matched Universities preview */}
                  <div className="bg-purple-50 rounded-xl p-3 border border-purple-200 text-xs">
                    <h5 className="font-bold text-purple-900 mb-1">Recommended University Research Matches:</h5>
                    <div className="space-y-1">
                      {aiPreview.universityMatches.slice(0, 2).map((m, i) => (
                        <div key={i} className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded border border-purple-100">
                          <span className="font-semibold text-purple-950">{m.name}</span>
                          <span className="font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-[10px]">
                            {m.matchScore}% Fit
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                {step < 4 && (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {step === 4 && (
                  <button
                    type="button"
                    onClick={handleProceedToReview}
                    className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Run AI Triage & Review</span>
                  </button>
                )}

                {step === 5 && (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Generate Challenge ID</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
