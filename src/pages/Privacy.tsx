import React from 'react';
import { ShieldCheck, Lock, EyeOff, UserCheck } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs leading-relaxed text-slate-700">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          DPDP Act 2023 Compliant Policy
        </span>
        <h1 className="text-3xl font-black text-navy-900 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500">Effective Date: October 2026 • Version 2.1</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">1. Data Minimisation Philosophy</h2>
          <p>
            RentMatch Technologies India Pvt. Ltd. collects only the data strictly necessary to determine practical tenancy compatibility and verify ownership legitimacy. We reject invasive background probing and do not collect bank login credentials or unsolicited lifestyle tracking.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">2. Masked Contact Credentials Prior to Mutual Consent</h2>
          <p>
            Your direct telephone number, email, and identity documentation remain strictly confidential and encrypted in our database. Neither landlords nor tenants can access raw contact numbers until both parties independently inspect compatibility indicators and approve a Mutual Match.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">3. UIDAI & Government ID Handling</h2>
          <p>
            Where identity verification is performed, users upload masked copies where the first 8 digits of Aadhaar are permanently redacted. We do not store biometric fingerprints, iris scans, or unredacted copies on platform servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">4. Zero Selling of Data to Broker Syndicates</h2>
          <p>
            We strictly enforce a contractual and technical barrier prohibiting the sale, sharing, or broadcast of user leads to third-party commercial real estate brokers or advertising aggregators.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">5. Right to Erasure & Data Portability</h2>
          <p>
            Under India's Digital Personal Data Protection Act, 2023, you retain the legal right to inspect stored records, download your RentMatch Pass verification history, and request permanent deletion of your profile upon conclusion of tenancy.
          </p>
        </section>
      </div>
    </div>
  );
};
