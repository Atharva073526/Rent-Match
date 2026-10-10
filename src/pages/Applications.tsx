import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { RentalApplication, ApplicationStatus } from '../types';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Building2, 
  User, 
  Calendar, 
  IndianRupee,
  Sparkles,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Applications: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const userId = currentUser?.id || '';

  const applications = store.getApplicationsForUser(userId);
  const [selectedApp, setSelectedApp] = useState<RentalApplication | null>(null);
  const [moreInfoPrompt, setMoreInfoPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">Accepted</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200">Under Review</span>;
      case 'more_info_requested':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">More Info Needed</span>;
      case 'declined':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-800 border border-rose-200">Declined</span>;
      case 'submitted':
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">Submitted</span>;
    }
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus, note?: string) => {
    store.updateApplicationStatus(appId, newStatus, note);
    if (newStatus === 'accepted') {
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }
    const updated = store.getApplicationById(appId);
    setSelectedApp(updated || null);
  };

  const handleRequestMoreInfo = (appId: string) => {
    if (!moreInfoPrompt.trim()) return;
    store.requestMoreInfoApplication(appId, moreInfoPrompt.trim());
    setMoreInfoPrompt('');
    setShowPromptInput(false);
    const updated = store.getApplicationById(appId);
    setSelectedApp(updated || null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Tenancy Applications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review formalized rental proposals, occupant declarations, and status timelines.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-navy-900 text-base">No Applications Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Formal applications are submitted after mutual matches are established between tenant and homeowner.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">ID: {app.id}</span>
                    <h3 className="font-bold text-navy-900 text-sm mt-0.5 line-clamp-1">
                      {app.propertyTitle}
                    </h3>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Applicant:</span>
                    <span className="font-bold text-navy-900">{app.tenantName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Proposed Rent:</span>
                    <span className="font-extrabold text-navy-900">₹{app.proposedRent.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Proposed Deposit:</span>
                    <span className="font-semibold text-emerald-700">₹{app.proposedDeposit.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Target Move-in:</span>
                    <span className="font-medium text-navy-900">{app.proposedMoveInDate}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 italic">
                  "{app.noteToLandlord}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => setSelectedApp(app)}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  View Details & Actions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* APPLICATION DETAIL MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-modal border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-slate-400">Application #{selectedApp.id}</span>
                <h3 className="font-bold text-navy-900 text-lg">{selectedApp.propertyTitle}</h3>
                <p className="text-xs text-slate-500">
                  Applicant: <strong>{selectedApp.tenantName}</strong> ({selectedApp.tenantEmail})
                </p>
              </div>
              <div>{getStatusBadge(selectedApp.status)}</div>
            </div>

            {/* Application Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Proposed Rent</span>
                <span className="font-black text-navy-900 text-sm">₹{selectedApp.proposedRent.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Proposed Deposit</span>
                <span className="font-black text-emerald-700 text-sm">₹{selectedApp.proposedDeposit.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Move-in Date</span>
                <span className="font-bold text-navy-900 text-sm">{selectedApp.proposedMoveInDate}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Occupants</span>
                <span className="font-bold text-navy-900 text-sm">{selectedApp.occupantsCount} Member(s)</span>
              </div>
            </div>

            {/* Employment & Notes */}
            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-navy-900 block mb-1 font-bold">Employment & Income Credentials</strong>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedApp.employmentDetails}
                </p>
              </div>

              <div>
                <strong className="text-navy-900 block mb-1 font-bold">Applicant's Stated Note</strong>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedApp.noteToLandlord}
                </p>
              </div>

              {selectedApp.moreInfoRequestMessage && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <strong className="text-amber-900 block font-bold mb-0.5">Information Requested by Homeowner:</strong>
                  <p className="text-amber-800">{selectedApp.moreInfoRequestMessage}</p>
                </div>
              )}
            </div>

            {/* Status History Timeline */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-bold text-navy-900 text-xs uppercase tracking-wider">Status History Timeline</h4>
              <div className="space-y-2">
                {selectedApp.statusHistory.map((hist, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-navy-900 capitalize">{hist.status.replace('_', ' ')}</span>
                      <span className="text-slate-400 text-[10px] ml-2">{new Date(hist.timestamp).toLocaleString()}</span>
                      {hist.note && <p className="text-slate-500 text-[11px]">{hist.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Landlord Decision Controls */}
            {currentUser?.role === 'landlord' && selectedApp.status !== 'accepted' && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-navy-900 text-xs">Homeowner Decision</h4>

                {showPromptInput ? (
                  <div className="space-y-2">
                    <textarea
                      value={moreInfoPrompt}
                      onChange={(e) => setMoreInfoPrompt(e.target.value)}
                      placeholder="e.g. Please clarify your anticipated tenancy duration or provide vehicle parking requirements..."
                      rows={3}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRequestMoreInfo(selectedApp.id)}
                        className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold"
                      >
                        Send Query
                      </button>
                      <button
                        onClick={() => setShowPromptInput(false)}
                        className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedApp.id, 'accepted', 'Application accepted by homeowner! Preparing 11-month lease.')}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      Accept & Issue Digital Lease
                    </button>
                    <button
                      onClick={() => setShowPromptInput(true)}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-navy-800 rounded-xl text-xs font-semibold"
                    >
                      Request Clarification
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedApp.id, 'declined', 'Application declined.')}
                      className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedApp.status === 'accepted' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-950 text-xs">Application Accepted 🎉</h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    A Model Tenancy Act compliant draft agreement has been generated for review and signing.
                  </p>
                </div>
                <Link
                  to="/leases"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  View Lease
                </Link>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
