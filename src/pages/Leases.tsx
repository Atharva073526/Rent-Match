import React, { useState } from 'react';
import { store } from '../services/store';
import { LeaseAgreement } from '../types';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Download, 
  Printer, 
  Lock, 
  AlertCircle, 
  IndianRupee, 
  FileCheck2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Leases: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const userId = currentUser?.id || '';

  const leases = store.getLeasesForUser(userId);
  const [selectedLeaseId, setSelectedLeaseId] = useState<string>(leases[0]?.id || '');
  const [signingModalOpen, setSigningModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  const activeLease = leases.find(l => l.id === selectedLeaseId) || leases[0];

  const isTenant = currentUser?.role === 'tenant';
  const isLandlord = currentUser?.role === 'landlord';

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLease) return;
    setIsSigning(true);

    setTimeout(() => {
      if (isTenant) {
        store.signLeaseAsTenant(activeLease.id);
      } else {
        store.signLeaseAsLandlord(activeLease.id);
      }

      setIsSigning(false);
      setSigningModalOpen(false);
      setOtpValue('');

      try {
        confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 } });
      } catch {}
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              Digital Leasing & Agreement Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Structured 11-month drafts aligned with India's Model Tenancy Act principles.
            </p>
          </div>
        </div>
      </div>

      {leases.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-navy-900 text-base">No Lease Agreements Generated Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once a rental application is accepted by the homeowner, a draft agreement will appear here automatically for bilateral review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Lease Selector & Escrow Status */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-4">
              <h3 className="font-bold text-navy-900 text-sm">Your Agreements ({leases.length})</h3>
              <div className="space-y-2">
                {leases.map((lease) => (
                  <button
                    key={lease.id}
                    onClick={() => setSelectedLeaseId(lease.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                      lease.id === activeLease?.id
                        ? 'bg-teal-50/70 border-teal-500 ring-1 ring-teal-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-navy-900 line-clamp-1">{lease.propertyTitle}</span>
                      <span className="text-[10px] uppercase font-bold text-teal-800">
                        {lease.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      ₹{lease.monthlyRent.toLocaleString('en-IN')}/mo • Deposit ₹{lease.securityDeposit.toLocaleString('en-IN')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* RentMatch Escrow Sandbox Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-navy-900 text-xs flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-teal-600" />
                  RentMatch Escrow Safeguard
                </h4>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Sandbox Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Deposit amount of ₹{activeLease?.securityDeposit.toLocaleString('en-IN')} is safeguarded under the tripartite protocol. Released only upon mutual digital handover inspection clearance.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-[11px] space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Escrow Account:</span>
                  <span className="font-mono font-bold">YESB-RENTMATCH-TRIPARTITE</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-teal-700 capitalize">{activeLease?.escrowStatus.replace('_', ' ')}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                * Note: Live banking escrow transfers require partner bank account aggregator authentication.
              </p>
            </div>
          </div>

          {/* Right Column: Full Agreement Viewer & Dual Signature Workflow */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agreement Status Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400">Lease Reference: #{activeLease.id}</span>
                <h3 className="font-bold text-navy-900 text-base">
                  {activeLease.propertyTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
                  <span className="flex items-center gap-1 text-slate-600">
                    Tenant Signature: 
                    {activeLease.tenantSignatureStatus === 'signed' ? (
                      <strong className="text-emerald-700 font-bold flex items-center gap-0.5"><CheckCircle2 className="w-3.5 h-3.5" /> Signed</strong>
                    ) : (
                      <span className="text-amber-700 font-medium">Pending</span>
                    )}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    Homeowner Signature: 
                    {activeLease.landlordSignatureStatus === 'signed' ? (
                      <strong className="text-emerald-700 font-bold flex items-center gap-0.5"><CheckCircle2 className="w-3.5 h-3.5" /> Signed</strong>
                    ) : (
                      <span className="text-amber-700 font-medium">Pending</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
                  title="Print Draft Agreement"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>

                {/* Sign Action Button */}
                {((isTenant && activeLease.tenantSignatureStatus === 'pending') ||
                  (isLandlord && activeLease.landlordSignatureStatus === 'pending')) && (
                  <button
                    onClick={() => setSigningModalOpen(true)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    E-Sign Agreement
                  </button>
                )}
              </div>
            </div>

            {/* Document Viewer */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap overflow-x-auto max-h-[600px] overflow-y-auto">
              {activeLease.agreementText}
            </div>

            {/* Legal Notice Footer */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-navy-900">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Legal Transparency & State Tenancy Acts Notice:
              </div>
              <p className="text-[11px] leading-relaxed">
                This document is a standardized draft based on the Model Tenancy Act provisions. Residential leases in India with tenure exceeding 11 months, or leases where state laws mandate local sub-registrar e-stamping (e.g. Karnataka, Maharashtra), require formal state stamp duty clearance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED AADHAAR E-SIGN MODAL */}
      {signingModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-modal border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 text-navy-900">
              <FileCheck2 className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="font-bold text-sm">Simulated Aadhaar eSign Review</h3>
                <p className="text-[11px] text-slate-500">UIDAI Electronic Signature Sandbox</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              By confirming, you digitally execute the 11-month Residential Tenancy Agreement for{' '}
              <strong>{activeLease?.propertyTitle}</strong>.
            </p>

            <form onSubmit={handleSign} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">
                  Enter 6-Digit OTP (Simulated Sandbox OTP: 123456)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest font-mono text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-900">
                Signer: <strong>{currentUser?.name}</strong> ({currentUser?.role?.toUpperCase()})
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSigningModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSigning}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm disabled:opacity-50"
                >
                  {isSigning ? 'Verifying & Signing...' : 'Digitally Execute Agreement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
