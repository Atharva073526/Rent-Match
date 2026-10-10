import React from 'react';
import { ShieldCheck, Camera, AlertTriangle, Lock, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Safety: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Trust & Verification Architecture
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
          RentMatch Verified & Safety Desk
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          How we safeguard urban renters and homeowners against phantom listings, broker impersonation, manipulated images, and deposit disputes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card space-y-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-navy-900 text-base">Property Deeds & Tax Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every verified listing on RentMatch undergoes validation against registered municipal property tax receipts (BBMP, BMC, GHMC) and electricity utility bills (BESCOM, Adani Electricity, Tata Power) to confirm authentic ownership.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card space-y-4">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl w-fit">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-navy-900 text-base">C2PA Media Authenticity</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To combat deceptive wide-angle distortion, fake catalog renders, and AI-generated synthetic apartments, our ingestion pipeline checks media metadata for provenance and digital integrity before awarding authenticity badges.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card space-y-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-navy-900 text-base">Anti-Bidding & Broker Spam Desk</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            RentMatch actively investigates token bidding demands and broker harassment. Any account reported for demanding upfront visit tokens or attempting to auction rental prices is suspended under our Zero-Exploitation charter.
          </p>
        </div>
      </div>

      {/* Verification Tiers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-navy-900">RentMatch Verification Hierarchy</h3>
        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-mono font-bold text-teal-700 w-16">Level 1</span>
            <div>
              <strong className="text-navy-900 block font-bold">Contact & Phone OTP Verification</strong>
              <span className="text-slate-500">Validation of primary mobile number and authenticated email address.</span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-mono font-bold text-teal-700 w-16">Level 2</span>
            <div>
              <strong className="text-navy-900 block font-bold">Government ID Verification (Masked Aadhaar / PAN)</strong>
              <span className="text-slate-500">UIDAI compliant masked Aadhaar (showing only last 4 digits) or PAN card validation.</span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-mono font-bold text-teal-700 w-16">Level 3</span>
            <div>
              <strong className="text-navy-900 block font-bold">Landlord Property Ownership Verification</strong>
              <span className="text-slate-500">Inspection of property tax payment receipts, registered sale deeds, or society share certificates.</span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="font-mono font-bold text-teal-700 w-16">Level 4</span>
            <div>
              <strong className="text-navy-900 block font-bold">Tenant Professional Credentials Verification</strong>
              <span className="text-slate-500">Corporate work-email domain confirmation or employer credentials for rental reliability.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
