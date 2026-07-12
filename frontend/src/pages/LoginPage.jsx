import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, AlertTriangle, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Get role from localStorage to determine routing
      const role = localStorage.getItem('role');
      if (role === 'student') navigate('/student-dashboard');
      else if (role === 'mentor') navigate('/mentor-dashboard');
      else if (role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Incorrect email credentials or password.');
    } finally {
      setLoading(false);
    }
  };

  // Helper autofills for demonstration evaluation
  const setDemoRole = (role) => {
    if (role === 'admin') {
      setEmail('admin@antigravity.com');
      setPassword('admin123');
    } else if (role === 'mentor') {
      setEmail('mentor1@antigravity.com');
      setPassword('mentor123');
    } else if (role === 'student') {
      setEmail('alex@antigravity.com');
      setPassword('student123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-6 py-12">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="glass-panel max-w-md w-full p-8 rounded-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
            <LogIn size={24} />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to access your internship workspace</p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-3 mb-6">
            <AlertTriangle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-slate-200 outline-none transition"
                placeholder="intern@antigravity.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-slate-200 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-xs">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Demo Helper Panel */}
        <div className="mt-8 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            <UserCheck size={14} /> Quick Demo Logins
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setDemoRole('student')}
              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[10px] font-bold rounded text-slate-300"
            >
              Student
            </button>
            <button
              onClick={() => setDemoRole('mentor')}
              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[10px] font-bold rounded text-slate-300"
            >
              Mentor
            </button>
            <button
              onClick={() => setDemoRole('admin')}
              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[10px] font-bold rounded text-slate-300"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
