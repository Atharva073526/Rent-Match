import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { store } from '../services/store';
import { KeyRound, Shield, User, ArrowRight, UserCheck, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = store.getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      store.switchUser(existing.id);
      if (existing.role === 'admin') navigate('/admin');
      else if (existing.role === 'landlord') navigate('/landlord/dashboard');
      else navigate('/tenant/dashboard');
    } else {
      alert('Account not found. Please try one of the instant demo logins below or create a new account.');
    }
  };

  const handleQuickDemo = (userId: string) => {
    store.switchUser(userId);
    const user = store.getCurrentUser();
    if (user?.role === 'admin') navigate('/admin');
    else if (user?.role === 'landlord') navigate('/landlord/dashboard');
    else navigate('/tenant/dashboard');
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSuccess(true);
    setTimeout(() => {
      setResetModalOpen(false);
      setResetSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-navy-900 tracking-tight">Sign In to RentMatch</h1>
        <p className="text-xs text-slate-500">
          Access your verified tenancy dashboard, active mutual matches, and messages.
        </p>
      </div>

      {/* Manual Login Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card space-y-6">
        <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-navy-800 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ananya.sharma@example.com"
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-navy-800">Password</label>
              <button
                type="button"
                onClick={() => setResetModalOpen(true)}
                className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-sm transition-all"
          >
            Sign In
          </button>
        </form>

        {/* Instant Demo Persona Switcher */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Instant Demo Evaluation Logins
          </span>

          <div className="space-y-1.5">
            <button
              onClick={() => handleQuickDemo('user_tenant_1')}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 flex items-center justify-between text-xs text-left transition-all"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <div>
                  <strong className="text-navy-900 block">Ananya Sharma (Tenant)</strong>
                  <span className="text-[10px] text-slate-500">Verified Tech Professional • Indiranagar seeker</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleQuickDemo('user_landlord_1')}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 flex items-center justify-between text-xs text-left transition-all"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <div>
                  <strong className="text-navy-900 block">Rajesh Mehta (Landlord)</strong>
                  <span className="text-[10px] text-slate-500">Verified Homeowner • 3 listings in Bengaluru</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleQuickDemo('user_admin_1')}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 flex items-center justify-between text-xs text-left transition-all"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <div>
                  <strong className="text-navy-900 block">Vikram Adiga (Admin)</strong>
                  <span className="text-[10px] text-slate-500">Platform Trust Desk & Verification Officer</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-1">
          Don't have an account?{' '}
          <Link to="/signup" className="text-teal-700 font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>

      {/* PASSWORD RESET MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-xs">
            <h3 className="font-bold text-navy-900 text-sm">Reset Account Password</h3>
            {resetSuccess ? (
              <p className="text-emerald-700 font-medium">
                Password reset instructions dispatched to your email address!
              </p>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <p className="text-slate-500">
                  Enter your registered email address to receive a secure password recovery link.
                </p>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="px-3 py-1.5 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-teal-600 text-white font-bold rounded-lg"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
