import React, { useState, useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

/**
 * Functional fallback component with 10-second countdown and redirect to '/'
 */
export function ErrorFallback({
  error,
  onReset,
  title,
  subtitle
}) {
  const [countdown, setCountdown] = useState(10);
  const [showDetails, setShowDetails] = useState(false);

  const displayTitle = title || (error ? 'Something went unexpectedly wrong' : '404 - Page Not Found');
  const displaySubtitle = subtitle || (error
    ? 'An unexpected error occurred in Jharkhand Pragati Setu portal. We are automatically taking you back to safety.'
    : 'The requested page or resource could not be found. We are automatically taking you back to the home portal.');

  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = '/';
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReload = () => {
    if (onReset) onReset();
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-50 via-emerald-50/30 to-slate-100 text-slate-900 relative overflow-hidden select-none">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-grid-slate opacity-40 pointer-events-none" />

      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-3xl p-6 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Jharkhand Emblem Logo & Warning Indicator */}
        <div className="relative flex items-center justify-center mx-auto">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-2 shadow-lg border border-slate-200 flex items-center justify-center">
            <img
              src="/jharkhand_logo.svg"
              alt="Jharkhand Govt Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-rose-500 text-white shadow-md border-2 border-white">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        {/* Brand & Error Title */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold font-mono uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>System Notice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
            {displayTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {displaySubtitle}
          </p>
        </div>

        {/* 10s Countdown Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
            <span>Auto-Redirecting to Home</span>
            <span className="text-emerald-700 font-black">{countdown}s</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleGoHome}
            className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-102 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home Now</span>
          </button>

          <button
            onClick={handleReload}
            className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-sm transition-all hover:scale-102 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reload Portal</span>
          </button>
        </div>

        {/* Collapsible Technical Error Details for debugging */}
        {error && (
          <div className="pt-2 border-t border-slate-100 text-left">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
            >
              <span>Technical Diagnostics</span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showDetails && (
              <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-36 border border-slate-800">
                <p className="text-rose-400 font-bold">{error.toString()}</p>
                {error.componentStack && (
                  <pre className="mt-1 text-[10px] text-slate-400 whitespace-pre-wrap">{error.componentStack}</pre>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}
