import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { Property, MutualMatch } from '../types';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Sparkles, 
  FileText, 
  MessageSquare, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  PauseCircle, 
  PlayCircle, 
  Edit, 
  ShieldCheck, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const LandlordDashboard: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const landlordId = currentUser?.id || 'user_landlord_1';

  const myProperties = store.getLandlordProperties(landlordId);
  const matches = store.getMatchesForUser(landlordId);
  const pendingApprovals = matches.filter(m => m.status === 'interest_expressed_by_tenant');
  const activeMutualMatches = matches.filter(m => m.status === 'mutual_match');
  const applications = store.getApplicationsForUser(landlordId);
  const leases = store.getLeasesForUser(landlordId);

  const [landlordNote, setLandlordNote] = useState('');
  const [selectedMatchForApproval, setSelectedMatchForApproval] = useState<MutualMatch | null>(null);

  const totalViews = myProperties.reduce((sum, p) => sum + p.viewsCount, 0);
  const totalInquiries = myProperties.reduce((sum, p) => sum + p.inquiriesCount, 0);

  const handleToggleStatus = (id: string) => {
    store.togglePropertyStatus(id);
  };

  const handleAcceptMatch = (matchId: string) => {
    store.acceptMutualMatch(matchId, landlordNote || 'Welcome! Profile verified. Excited to connect.');
    setSelectedMatchForApproval(null);
    setLandlordNote('');
  };

  const handleDeclineMatch = (matchId: string) => {
    store.declineMatch(matchId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Listing CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              Homeowner Control Desk
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Owner
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your verified listings, review tenant inquiries, and issue digital lease agreements.
          </p>
        </div>

        <Link
          to="/landlord/new-property"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          List New Property
        </Link>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Total Properties</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-navy-900">{myProperties.length}</span>
            <Building2 className="w-5 h-5 text-teal-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Mutual Inquiries</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-teal-700">{totalInquiries}</span>
            <Users className="w-5 h-5 text-teal-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Listing Views</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-navy-900">{totalViews}</span>
            <Eye className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs font-semibold block mb-1">Pending Match Approvals</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600">{pendingApprovals.length}</span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
        </div>
      </div>

      {/* PENDING MUTUAL MATCH APPROVALS QUEUE */}
      {pendingApprovals.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-navy-900 text-sm">
                Mutual Match Requests Awaiting Your Approval ({pendingApprovals.length})
              </h3>
            </div>
            <span className="text-xs text-amber-800 font-semibold">
              Review compatibility before unlocking contact details
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApprovals.map((match) => (
              <div key={match.id} className="bg-white rounded-xl p-4 border border-amber-200/80 shadow-xs space-y-3 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={match.tenantAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-navy-900">{match.tenantName}</h4>
                      <p className="text-[11px] text-slate-500">{match.tenantProfession || 'Verified Professional'}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200">
                    {match.compatibilityScore}% Match
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-slate-700 italic text-[11px]">
                  "{match.tenantNote}"
                </div>

                <p className="text-[11px] text-slate-500">
                  Target property: <strong className="text-navy-900">{match.propertyTitle}</strong>
                </p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleDeclineMatch(match.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => setSelectedMatchForApproval(match)}
                    className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold"
                  >
                    Accept Match & Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROPERTY PORTFOLIO LISTING TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-navy-900 text-base">Your Properties ({myProperties.length})</h3>
          <Link
            to="/landlord/new-property"
            className="text-xs font-bold text-teal-700 hover:text-teal-900"
          >
            + Add Another Listing
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Rent & Deposit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Inquiries</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-navy-900">
              {myProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={prop.images[0]} alt="" className="w-12 h-10 rounded-lg object-cover" />
                      <div>
                        <Link to={`/properties/${prop.id}`} className="font-bold text-navy-900 hover:text-teal-700">
                          {prop.title}
                        </Link>
                        <p className="text-[11px] text-slate-500">{prop.locality}, {prop.city} • {prop.bhk} BHK</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold">₹{prop.rent.toLocaleString('en-IN')}/mo</div>
                    <div className="text-[11px] text-slate-500">Deposit: ₹{(prop.deposit / 100000).toFixed(1)}L</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      prop.status === 'published' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">
                    {prop.inquiriesCount} Inquiries
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(prop.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                        title={prop.status === 'published' ? 'Pause Listing' : 'Publish Listing'}
                      >
                        {prop.status === 'published' ? <PauseCircle className="w-4 h-4 text-amber-600" /> : <PlayCircle className="w-4 h-4 text-emerald-600" />}
                      </button>
                      <Link
                        to={`/landlord/edit-property/${prop.id}`}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                        title="Edit Listing"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVAL MODAL */}
      {selectedMatchForApproval && (
        <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-modal border border-slate-200 space-y-4">
            <h3 className="font-bold text-navy-900 text-base">
              Accept Mutual Match with {selectedMatchForApproval.tenantName}
            </h3>
            <p className="text-xs text-slate-600">
              Upon approval, direct chat and property walkthrough coordination will unlock.
            </p>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1">
                Custom Acceptance Note to Tenant
              </label>
              <textarea
                value={landlordNote}
                onChange={(e) => setLandlordNote(e.target.value)}
                placeholder="e.g. Welcome! Let's arrange a viewing this weekend."
                rows={3}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedMatchForApproval(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAcceptMatch(selectedMatchForApproval.id)}
                className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm"
              >
                Confirm Mutual Match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
