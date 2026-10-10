import React from 'react';
import { store } from '../services/store';
import { User } from '../types';
import { Shield, UserCheck, RefreshCw, KeyRound } from 'lucide-react';

interface DemoBannerProps {
  currentUser: User | null;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ currentUser }) => {
  const handleSwitch = (userId: string) => {
    store.switchUser(userId);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo listings, applications, and chat messages to original state?')) {
      store.resetToSeeds();
    }
  };

  const handleLogout = () => {
    store.logout();
  };

  return (
    <aside aria-label="Demo environment notification" className="bg-navy-900 text-slate-200 text-xs border-b border-navy-800 py-1.5 px-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="font-semibold text-slate-100 flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-teal-400" />
            Interactive Demo Mode:
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Switch persona to test real-time matching, approval & leasing:
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          {/* Tenant Switcher */}
          <button
            onClick={() => handleSwitch('user_tenant_1')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              currentUser?.id === 'user_tenant_1'
                ? 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-400'
                : 'bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white'
            }`}
            title="Senior Engineer looking for 2 BHK in Indiranagar/Koramangala"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Tenant (Ananya)</span>
          </button>

          {/* Landlord Switcher */}
          <button
            onClick={() => handleSwitch('user_landlord_1')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              currentUser?.id === 'user_landlord_1'
                ? 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-400'
                : 'bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white'
            }`}
            title="Verified homeowner with 3 listings in Bengaluru"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Landlord (Rajesh)</span>
          </button>

          {/* Admin Switcher */}
          <button
            onClick={() => handleSwitch('user_admin_1')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              currentUser?.id === 'user_admin_1'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                : 'bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white'
            }`}
            title="RentMatch Platform Ethics & Verification Officer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin (Vikram)</span>
          </button>

          {currentUser ? (
            <button
              onClick={handleLogout}
              className="px-2 py-1 rounded-md bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Test logged out experience"
            >
              Sign Out
            </button>
          ) : (
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 italic">
              Viewing as Guest
            </span>
          )}

          <div className="h-3 w-px bg-navy-700 mx-1 hidden md:block"></div>

          <button
            onClick={handleReset}
            className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1 text-[11px] ml-1"
            title="Reset mock data to factory seed"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden lg:inline">Reset Seeds</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
