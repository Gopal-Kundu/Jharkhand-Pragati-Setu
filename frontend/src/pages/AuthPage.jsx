import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, setActiveRole } from '../store/slices/authSlice';
import { toast } from 'sonner';
import {
  Lock,
  Mail,
  User,
  ArrowRight
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
        const firstName = result.payload.name?.split(' ')[0] || result.payload.name || 'User';
        toast.success(`Welcome back, ${firstName}!`);
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

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {mode === 'login' ? 'Login into Account' : 'Create an Account'}
          </h2>
        </div>

        {/* Form */}
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

        <div className="text-center pt-2">
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
    </div>
  );
}
