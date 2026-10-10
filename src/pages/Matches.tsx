import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { MutualMatch } from '../types';
import { 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  User, 
  MapPin,
  ShieldCheck
} from 'lucide-react';

export const Matches: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const userId = currentUser?.id || '';

  const allMatches = store.getMatchesForUser(userId);
  const mutualMatches = allMatches.filter(m => m.status === 'mutual_match');
  const pendingSent = allMatches.filter(m => 
    (m.initiatedBy === 'tenant' && currentUser?.role === 'tenant' && m.status === 'interest_expressed_by_tenant')
  );
  const pendingReceived = allMatches.filter(m => 
    (m.initiatedBy === 'tenant' && currentUser?.role === 'landlord' && m.status === 'interest_expressed_by_tenant')
  );

  const [activeTab, setActiveTab] = useState<'mutual' | 'pending'>('mutual');

  const handleAccept = (matchId: string) => {
    store.acceptMutualMatch(matchId, 'Mutual match confirmed! Excited to connect.');
  };

  const handleDecline = (matchId: string) => {
    store.declineMatch(matchId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              Mutual Matches Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Connections unlocked through two-party verified agreement. Zero uninvited broker spam.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 pt-6 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('mutual')}
            className={`pb-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'mutual'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            <span>Active Mutual Matches</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-teal-50 text-teal-800">
              {mutualMatches.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            <span>Pending Approvals</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {pendingSent.length + pendingReceived.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab: Mutual Matches */}
      {activeTab === 'mutual' && (
        <div className="space-y-4">
          {mutualMatches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-navy-900 text-base">No Mutual Matches Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Mutual matches happen when both tenant and homeowner review compatibility and approve connection.
              </p>
              <Link
                to="/properties"
                className="inline-block mt-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
              >
                Find Compatible Homes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mutualMatches.map((match) => (
                <div key={match.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={match.propertyImage} alt="" className="w-14 h-14 rounded-xl object-cover" />
                        <div>
                          <Link to={`/properties/${match.propertyId}`} className="font-bold text-navy-900 text-sm hover:text-teal-700">
                            {match.propertyTitle}
                          </Link>
                          <p className="text-xs text-slate-500">{match.propertyLocality}, {match.propertyCity}</p>
                          <p className="text-xs font-black text-navy-900 mt-0.5">
                            ₹{match.propertyRent.toLocaleString('en-IN')}/mo
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {match.compatibilityScore}% Match
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-navy-900">
                          {currentUser?.role === 'tenant' ? `Landlord: ${match.landlordName}` : `Tenant: ${match.tenantName}`}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Matched on {match.matchedAt ? new Date(match.matchedAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      {match.landlordNote && (
                        <p className="italic text-[11px] text-teal-800">"{match.landlordNote}"</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to="/messages"
                      className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" /> Direct Chat
                    </Link>

                    {currentUser?.role === 'tenant' ? (
                      <Link
                        to={`/properties/${match.propertyId}`}
                        className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-semibold text-center"
                      >
                        Apply / View
                      </Link>
                    ) : (
                      <Link
                        to="/applications"
                        className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-semibold text-center"
                      >
                        Manage Lease
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Pending Approvals */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          {/* Incoming requests (if Landlord) */}
          {pendingReceived.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-navy-900 text-sm">Requests Awaiting Your Acceptance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingReceived.map((match) => (
                  <div key={match.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={match.tenantAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <h4 className="font-bold text-navy-900">{match.tenantName}</h4>
                          <span className="text-[11px] text-slate-500">{match.tenantProfession}</span>
                        </div>
                      </div>
                      <span className="font-bold text-teal-700">{match.compatibilityScore}% Compatibility</span>
                    </div>

                    <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-xl">"{match.tenantNote}"</p>
                    <p className="text-slate-500">Property: <strong>{match.propertyTitle}</strong></p>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleDecline(match.id)}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 font-semibold"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(match.id)}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold"
                      >
                        Accept Match
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outgoing sent requests */}
          <div className="space-y-3">
            <h3 className="font-bold text-navy-900 text-sm">Requests Sent by You</h3>
            {pendingSent.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
                No pending requests sent.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingSent.map((match) => (
                  <div key={match.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-navy-900">{match.propertyTitle}</h4>
                        <p className="text-slate-500">Owner: {match.landlordName}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                        Awaiting Landlord
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Sent on {new Date(match.createdAt).toLocaleDateString()}. Contact info remains private until owner accepts.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
