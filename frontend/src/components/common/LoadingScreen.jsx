import React from 'react';

/**
 * LoadingScreen Component
 * Displays a premium splash & loading screen with Jharkhand Pragati Setu branding,
 * animated glow effects, and modern civic-tech design.
 */
export default function LoadingScreen({ message = 'Loading Jharkhand Pragati Setu...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-emerald-50/40 to-slate-100 text-slate-900 overflow-hidden select-none animate-in fade-in duration-300">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-grid-slate opacity-40 pointer-events-none" />

      {/* Ambient Gradient Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center max-w-md mx-auto">
        
        {/* Animated Emblem / Logo Holder */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Pulsing Outer Aura */}
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-amber-500/30 rounded-full blur-xl animate-pulse" />

          {/* Orbiting Spinner Ring */}
          <div className="absolute -inset-2.5 rounded-full border-2 border-dashed border-emerald-500/40 animate-spin [animation-duration:8s]" />
          <div className="absolute -inset-1 rounded-full border border-amber-500/50 animate-spin [animation-duration:12s] [animation-direction:reverse]" />

          {/* Emblem Card */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-2.5 shadow-xl shadow-emerald-950/10 border border-slate-200/80 flex items-center justify-center transition-transform hover:scale-105">
            <img
              src="/jharkhand_logo.svg"
              alt="Jharkhand Pragati Setu Logo"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight mb-1.5 bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 bg-clip-text">
          Jharkhand Pragati Setu
        </h1>

        {/* Subtitle / Civic Motto */}
        <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-6 max-w-xs sm:max-w-sm leading-relaxed">
          Bridging Citizens, Administration, Academia &amp; Industry
        </p>

        {/* Animated Progress Bar Container */}
        <div className="w-56 sm:w-64 space-y-2.5">
          <div className="relative h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden shadow-inner">
            <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
          </div>

          {/* Dynamic Status Text */}
          <div className="flex items-center justify-center space-x-2 text-xs font-mono font-medium text-slate-500">
            <span>{message}</span>
          </div>
        </div>

        

      </div>

      {/* CSS Keyframes for custom indeterminate animation if tailwind class isn't predefined */}
      <style>{`
        @keyframes loading {
          0% {
            left: -50%;
            width: 30%;
          }
          50% {
            left: 25%;
            width: 60%;
          }
          100% {
            left: 100%;
            width: 30%;
          }
        }
      `}</style>
    </div>
  );
}
