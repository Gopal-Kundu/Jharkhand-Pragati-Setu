import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { queryAIAssistant } from '../../services/aiIntelligenceEngine';
import { Sparkles, X, Send, Bot, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AIAssistantModal() {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    activeRole,
    lang,
    problemClusters,
    projects,
    setSelectedClusterId,
    setActiveView,
    setActiveRole
  } = useAppState();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: lang === 'hi'
        ? `जोहार! मैं **संगी (Sangi)**, झारखंड नवाचार सह-पायलट हूँ। आप मुझसे समस्या ट्रैकिंग, विश्वविद्यालय मिलान, अथवा सीएसआर अनुदान के बारे में पूछ सकते हैं।`
        : `Johar! I am **Sangi**, your Jharkhand Societal Innovation AI Copilot. How can I assist you today?`,
      timestamp: 'Just now'
    }
  ]);

  if (!isAssistantOpen) return null;

  const quickPrompts = {
    citizen: [
      'What happened to the Torpa pond water problem?',
      'How does my problem get assigned to a university?',
      'Has anyone reported high water shortage in Khunti before?'
    ],
    panchayat: [
      'Show unresolved problems in Torpa block',
      'How to verify citizen water evidence?',
      'Can our Panchayat request a field pilot?'
    ],
    government: [
      'Show high-priority water problems in Ranchi & Khunti',
      'Which districts have the highest unresolved challenges?',
      'Give me a summary of CSR funding mobilized this quarter'
    ],
    university: [
      'Find challenges related to IoT, water, and agriculture',
      'Which faculty members at BIT Mesra can lead #JH-WTR-1042?',
      'How do we submit an interdisciplinary proposal?'
    ],
    industry: [
      'Show active projects seeking IoT hardware & CSR grants',
      'Which projects align with clean water in tribal areas?',
      'How do we pledge CSR funding under Section 135?'
    ],
    public: [
      'Show all completed societal deployments in Jharkhand',
      'How many citizens have been impacted so far?'
    ]
  };

  const currentPrompts = quickPrompts[activeRole] || quickPrompts.public;

  const handleSend = (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    const userMsg = {
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Query Engine
    setTimeout(() => {
      const response = queryAIAssistant(queryText, activeRole, { problemClusters, projects });
      const aiMsg = {
        sender: 'ai',
        text: response.reply,
        action: response.actionType,
        targetId: response.targetId,
        targetView: response.targetView,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 400);
  };

  const handleAction = (msg) => {
    if (msg.targetId) {
      setSelectedClusterId(msg.targetId);
      setActiveView('cluster_detail');
      setIsAssistantOpen(false);
    } else if (msg.targetView) {
      if (msg.targetView.startsWith('gov_')) setActiveRole('government');
      if (msg.targetView.startsWith('uni_')) setActiveRole('university');
      if (msg.targetView.startsWith('ind_')) setActiveRole('industry');
      if (msg.targetView.startsWith('citizen_')) setActiveRole('citizen');
      setActiveView(msg.targetView);
      setIsAssistantOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base tracking-tight">Sangi AI Copilot (संगी)</h3>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 font-bold px-2 py-0.5 rounded-full uppercase">
                  Role: {activeRole}
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 font-medium">
                Jharkhand Societal Innovation Intelligence Assistant
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAssistantOpen(false)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt chips */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
            Suggested:
          </span>
          {currentPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex-shrink-0 cursor-pointer shadow-2xs font-medium"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                m.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-amber-300 shadow-sm'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-none shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
              }`}>
                <div className="whitespace-pre-line prose-sm font-normal">
                  {m.text}
                </div>

                {m.action && (m.targetId || m.targetView) && (
                  <button
                    onClick={() => handleAction(m)}
                    className="mt-3 inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer"
                  >
                    <span>Inspect Challenge Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className={`text-[9px] mt-1.5 ${m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            placeholder={lang === 'hi' ? 'संगी से प्रश्न पूछें...' : `Ask Sangi anything as ${activeRole}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 text-xs text-slate-900 bg-slate-100 focus:bg-white placeholder:text-slate-500 border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
          />
          <button
            onClick={() => handleSend()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
