import React from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { PropertyCard } from '../components/PropertyCard';
import { 
  Sparkles, 
  Heart, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  TrendingUp,
  CreditCard
} from 'lucide-react';

export const TenantDashboard: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const profile = currentUser ? store.getTenantProfile(currentUser.id) : null;

  const matches = currentUser ? store.getMatchesForUser(currentUser.id) : [];
  const mutualMatches = matches.filter(m => m.status === 'mutual_match');
  const pendingMatches = matches.filter(m => m.status === 'interest_expressed_by_tenant');

  const applications = currentUser ? store.getApplicationsForUser(currentUser.id) : [];
  const leases = currentUser ? store.getLeasesForUser(currentUser.id) : [];

  const allProperties = store.getProperties().filter(p => p.status === 'published');
  const savedPropertyIds = store.getSavedPropertyIds();
  const savedProperties = allProperties.filter(p => savedPropertyIds.includes(p.id));

  // Recommended properties sorted by compatibility
  const recommendedProperties = [...allProperties]
    .map(p => ({
      property: p,
      comp: store.calculateCompatibilityForCurrentTenant(p)
    }))
    .sort((a, b) => (b.comp?.overallScore || 0) - (a.comp?.overallScore || 0))
    .slice(0, 3);

  const profileCompleteness = profile?.profileCompleteness || 80;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Profile Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                Welcome back, {currentUser?.name || 'Tenant'}
              </h1>
              {currentUser?.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {profile?.profession || 'Professional'} • Looking in {profile?.preferredLocations.join(', ') || 'Bengaluru'}
            </p>
          </div>
        </div>

        {/* Profile Completeness & Quick Action */}
        <div className="w-full md:w-64 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-navy-900">Profile Completeness</span>
            <span className="font-extrabold text-teal-700">{profileCompleteness}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
          <Link
            to="/onboarding"
            className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 block text-right"
          >
            Update Rental Preferences →
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Mutual Matches</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-teal-700">{mutualMatches.length}</span>
            <Sparkles className="w-5 h-5 text-teal-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Active Applications</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-navy-900">{applications.length}</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Saved Properties</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600">{savedProperties.length}</span>
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Subscription</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800">
              {currentUser?.subscriptionTier.replace('_', ' ') || 'Free'}
            </span>
            <CreditCard className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Active Digital Leases Alert (if any) */}
      {leases.length > 0 && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900">
              <FileText className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-sm">Active Tenancy Agreement Ready</h3>
            </div>
            <Link
              to="/leases"
              className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 underline"
            >
              View Lease Document →
            </Link>
          </div>
          {leases.map((lease) => (
            <div key={lease.id} className="p-4 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <h4 className="font-bold text-navy-900">{lease.propertyTitle}</h4>
                <p className="text-slate-500 mt-0.5">
                  Monthly Rent: ₹{lease.monthlyRent.toLocaleString('en-IN')} • Deposit: ₹{lease.securityDeposit.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 capitalize">
                  {lease.status.replace('_', ' ')}
                </span>
                <Link
                  to="/leases"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Review & Sign
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Section: Recommended Properties (Scored by Explainable Algorithm) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-900">
              Top Compatibility Recommendations
            </h2>
            <p className="text-xs text-slate-500">
              Calculated dynamically from your budget, timeline, and house rules preferences
            </p>
          </div>
          <Link to="/properties" className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1">
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedProperties.map(({ property, comp }) => (
            <PropertyCard
              key={property.id}
              property={property}
              compatibilityResult={comp}
              isSaved={store.isPropertySaved(property.id)}
              onToggleSave={() => store.toggleSaveProperty(property.id)}
            />
          ))}
        </div>
      </div>

      {/* Two Columns: Mutual Matches & Active Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mutual Matches Hub */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Active Mutual Matches ({mutualMatches.length})
            </h3>
            <Link to="/matches" className="text-xs font-semibold text-teal-700">
              View All
            </Link>
          </div>

          {mutualMatches.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <p>No active mutual matches yet.</p>
              <Link to="/properties" className="text-teal-700 font-bold underline">
                Browse verified listings and express interest
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {mutualMatches.map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={m.propertyImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-navy-900">{m.propertyTitle}</h4>
                      <p className="text-slate-500 mt-0.5">Owner: {m.landlordName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/messages"
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold"
                    >
                      Chat
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rental Applications Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Rental Applications ({applications.length})
            </h3>
            <Link to="/applications" className="text-xs font-semibold text-teal-700">
              Track Status
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No formal applications submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-navy-900">{app.propertyTitle}</h4>
                    <p className="text-slate-500 mt-0.5">
                      Proposed: ₹{app.proposedRent.toLocaleString('en-IN')}/mo • Move-in: {app.proposedMoveInDate}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200">
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
