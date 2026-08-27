import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, setActiveRole } from '../store/slices/authSlice';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen',
    organization: '',
    department: '',
    district: 'Ranchi'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'login') {
      const result = await dispatch(loginUser({ email: formData.email, password: formData.password }));
      if (loginUser.fulfilled.match(result)) {
        toast.success(`Welcome back, ${result.payload.name}!`);
        const userRole = result.payload.role;
        dispatch(setActiveRole(userRole));
        if (userRole === 'government') navigate('/dashboard');
        else if (userRole === 'university') navigate('/university');
        else if (userRole === 'industry') navigate('/industry');
        else if (userRole === 'panchayat') navigate('/panchayat');
        else navigate('/citizen');
      } else {
        toast.error(result.payload || 'Invalid email or password');
      }
    } else {
      const result = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(result)) {
        toast.success(`Account registered successfully as ${formData.role}!`);
        dispatch(setActiveRole(formData.role));
        navigate('/citizen');
      } else {
        toast.error(result.payload || 'Registration failed');
      }
    }
  };

  const demoAccounts = [
    { role: 'citizen', email: 'citizen@sih2026.gov.in', password: 'Citizen@2026', name: 'Birsa Oraon (Citizen / Farmer)', icon: Users, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { role: 'panchayat', email: 'panchayat@sih2026.gov.in', password: 'Panchayat@2026', name: 'Mukesh Bhagat (Mukhiya, PRI)', icon: ShieldCheck, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    { role: 'government', email: 'govt@sih2026.gov.in', password: 'Govt@2026', name: 'Dr. Manish Ranjan, IAS (Govt)', icon: Building, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { role: 'university', email: 'university@sih2026.gov.in', password: 'Univ@2026', name: 'Dr. Amitava Roy (BIT Mesra)', icon: GraduationCap, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    { role: 'industry', email: 'industry@sih2026.gov.in', password: 'Industry@2026', name: 'Saurav Roy (Tata Steel CSR)', icon: Briefcase, color: 'text-amber-700 bg-amber-50 border-amber-200' }
  ];

  const handleQuickLogin = (demo) => {
    setFormData({
      ...formData,
      email: demo.email,
      password: demo.password,
      role: demo.role
    });
    setMode('login');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
        
        {/* Left Side: Form */}
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono uppercase mb-2">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>HTTP-Only Secure Authentication</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              {mode === 'login' ? 'Access Innovation Portal' : 'Register New Account'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {mode === 'login'
                ? 'Sign in to access your role-based workspace and active proposals.'
                : 'Join the SIH 2026 societal problem-solving network in Jharkhand.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.gov.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="citizen">Concerned Citizen / Resident</option>
                  <option value="panchayat">Gram Panchayat (PRI) / ULB Representative</option>
                  <option value="government">Government Department Officer</option>
                  <option value="university">University Faculty Lead / Student Innovator</option>
                  <option value="industry">Industry CSR / Enterprise / Startup</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={authState.loading}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>{authState.loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
            >
              {mode === 'login'
                ? "Don't have an account? Register here"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Right Side: Quick Demo Accounts */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>1-Click Persona Quick Access (SIH Evaluators)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click any verified role profile below to auto-populate credentials for instant system evaluation:
            </p>

            <div className="space-y-2 pt-2">
              {demoAccounts.map((demo) => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleQuickLogin(demo)}
                    className="w-full p-3 rounded-xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between text-left cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:text-emerald-700 group-hover:bg-emerald-100 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {demo.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{demo.email}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md border border-emerald-200">
                      Use Profile
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 shadow-sm">
            <strong>Pre-seeded password format:</strong> <code className="text-emerald-800 font-mono bg-emerald-50 px-1 py-0.5 rounded">Role@2026</code>
          </div>
        </div>

      </div>
    </div>
  );
}
