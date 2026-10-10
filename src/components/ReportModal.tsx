import React, { useState } from 'react';
import { Property, UserReport } from '../types';
import { store } from '../services/store';
import { X, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  property: Property;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ property, onClose }) => {
  const [reason, setReason] = useState<UserReport['reason']>('rental_bidding_demand');
  const [description, setDescription] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const rep = store.submitReport({
      reportedPropertyId: property.id,
      reportedUserId: property.landlordId,
      reason,
      description
    });

    setSubmittedId(rep.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-modal max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-navy-900 text-sm">Report Listing or Conflict</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-navy-900 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedId ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-navy-900 text-sm">Report Registered Successfully</h4>
            <p className="text-xs text-slate-600">
              Reference ID: <strong className="font-mono text-navy-900">{submittedId}</strong>
            </p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Our Trust & Platform Integrity Arbiter reviews all reports within 24 hours. Action will be taken in accordance with RentMatch Fair Housing guidelines.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 text-xs font-semibold bg-navy-900 text-white rounded-lg hover:bg-navy-800"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1">
                Violation Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as UserReport['reason'])}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-navy-900 focus:ring-2 focus:ring-rose-500"
              >
                <option value="rental_bidding_demand">Rental Bidding Demand (Auctioning rent / broker token)</option>
                <option value="suspicious_listing">Suspicious / Fake Listing</option>
                <option value="misleading_images">Misleading or Manipulated Images</option>
                <option value="impersonation">Impersonation / Broker Masquerading as Owner</option>
                <option value="harassment">Harassment or Inappropriate Conduct</option>
                <option value="incorrect_details">Incorrect Rent, Address or Availability</option>
                <option value="dispute_review">Tenancy Dispute Requiring Human Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1">
                Details & Evidence Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-navy-900"
                placeholder="Please describe what occurred, including dates and any messages..."
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>
                RentMatch operates on a Zero-Bidding Charter. Landlords or brokers demanding rental bidding or cash tokens without physical verification face immediate suspension.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
              >
                Submit Report to Trust Desk
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
