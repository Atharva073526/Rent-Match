import React, { useState } from 'react';
import { store } from '../services/store';
import { 
  ShieldCheck, 
  Upload, 
  User, 
  FileText, 
  CreditCard, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const Settings: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'verification' | 'pass' | 'subscription'>('verification');

  // Profile Edit State
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [savedNote, setSavedNote] = useState(false);

  // Verification Upload State
  const [docType, setDocType] = useState<'aadhaar_masked' | 'pan_card' | 'property_tax_receipt' | 'electricity_bill' | 'employment_id'>('aadhaar_masked');
  const [docName, setDocName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const verifications = store.getVerifications().filter(v => v.userId === currentUser?.id);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateCurrentUser({ name, phone, bio });
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 2000);
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    store.submitVerification({
      verificationType: currentUser?.role === 'landlord' ? 'property_ownership' : 'identity',
      docName: docName.trim(),
      docType,
    });

    setUploadSuccess(true);
    setDocName('');
    setTimeout(() => setUploadSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Account & Trust Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your verified credentials, RentMatch Pass, and active subscription.
        </p>

        {/* Tab Switcher */}
        <div className="flex gap-2 pt-6 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('verification')}
            className={`pb-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'verification'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verification Status</span>
          </button>

          <button
            onClick={() => setActiveTab('pass')}
            className={`pb-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'pass'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>RentMatch Pass</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`pb-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'subscription'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscription</span>
          </button>
        </div>
      </div>

      {/* TAB 1: VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-navy-900 text-base">Current Verification Standing</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified users receive priority placement and trust badges in search discovery.
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                currentUser?.isVerified
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {currentUser?.verificationStatus?.replace('_', ' ') || 'Pending'}
              </span>
            </div>

            {currentUser?.isVerified && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Trust Badge Verified</strong>
                  {currentUser.verificationBadgeReason || 'Identity verified by RentMatch Trust Desk.'}
                </div>
              </div>
            )}
          </div>

          {/* Upload Documents Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4">
            <h3 className="font-bold text-navy-900 text-sm">Upload Credentials for Verification</h3>
            <p className="text-xs text-slate-500">
              Submit proof of identity, municipal ownership receipts, or corporate credentials for validation.
            </p>

            {uploadSuccess && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 font-medium">
                Document submitted to Trust Desk for inspection!
              </div>
            )}

            <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-navy-800">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="aadhaar_masked">Masked Aadhaar (Last 4 Digits only)</option>
                    <option value="pan_card">PAN Card</option>
                    <option value="employment_id">Corporate Email / Work Badge</option>
                    <option value="property_tax_receipt">BBMP / BMC Property Tax Receipt (Landlord)</option>
                    <option value="electricity_bill">BESCOM / Tata Power Bill (Landlord)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-navy-800">File Name / Label</label>
                  <input
                    type="text"
                    required
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="e.g. Aadhaar_Masked_XXXX.pdf"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
                Under the DPDP Act 2023, documents are stored encrypted and accessed solely by authorized Level-3 staff.
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-sm flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Submit for Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: RENTMATCH PASS */}
      {activeTab === 'pass' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-teal-950 text-white rounded-3xl p-8 shadow-modal space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-teal-400" />
                <span className="font-extrabold text-sm uppercase tracking-wider text-teal-300">
                  RentMatch Pass
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Portable Rental Passport
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black">{currentUser?.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verified Resident • Bengaluru / Mumbai Corridor
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-navy-700 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">On-Time Rent Record</span>
                <span className="text-lg font-black text-emerald-400">100%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Tenancy Milestone</span>
                <span className="text-lg font-black text-teal-300">Level 2 Trust</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Security Handover</span>
                <span className="text-lg font-black text-white">Full Refund</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-navy-900 text-sm">About Your Portable Rental Passport</h4>
            <p>
              RentMatch Pass records verified milestones—such as timely rent clearance and amicable deposit settlements—allowing you to move between apartments without repeating heavy documentation screening.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4">
          <h3 className="font-bold text-navy-900 text-base">Edit Account Details</h3>
          {savedNote && (
            <div className="p-3 bg-emerald-50 text-emerald-900 text-xs rounded-xl font-medium">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-navy-800">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-navy-800">Mobile Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-navy-800">Short Bio / Overview</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a brief introduction..."
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-sm"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: SUBSCRIPTION */}
      {activeTab === 'subscription' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4 text-xs">
          <h3 className="font-bold text-navy-900 text-base">Current Subscription Tier</h3>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-navy-900 capitalize text-sm">
                {currentUser?.subscriptionTier.replace('_', ' ') || 'Free'}
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Active
              </span>
            </div>
            <p className="text-slate-500">
              Renews on {currentUser?.subscriptionExpiresAt ? new Date(currentUser.subscriptionExpiresAt).toLocaleDateString() : 'Active indefinitely'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
