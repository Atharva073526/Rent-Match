import React from 'react';
import { Scale, ShieldCheck, AlertTriangle } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs leading-relaxed text-slate-700">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          User Agreement
        </span>
        <h1 className="text-3xl font-black text-navy-900 tracking-tight">Terms of Use & Fair Tenancy Charter</h1>
        <p className="text-slate-500">Effective Date: October 2026 • Version 2.1</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">1. Strict Anti-Bidding Clause</h2>
          <p>
            RentMatch is founded on price certainty. Homeowners and authorized managers agree that the published rent represents the fixed consideration for the premise. Demanding cash tokens prior to physical walkthroughs or inciting bidding escalations ("token races") among applicants is strictly prohibited and constitutes grounds for permanent account suspension.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">2. Fair Housing & Anti-Discrimination Charter</h2>
          <p>
            Users agree not to discriminate against prospective tenants based on religion, caste, regional origin, marital status, gender, or disability. Listing descriptions containing unlawful discriminatory exclusions will be removed by platform moderators without refund.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">3. Nature of Generated Digital Lease Drafts</h2>
          <p>
            Tenancy agreements drafted via the platform are standardized legal templates prepared in alignment with the Model Tenancy Act, 2021. Users acknowledge that state-specific mandatory registration, local sub-registrar e-stamping (e.g., NeSL, SHCIL), and physical execution requirements remain the mutual responsibility of lessor and lessee under state tenancy laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">4. Deposit & RentMatch Escrow Protocol</h2>
          <p>
            Users participating in RentMatch Escrow agree that refundable deposits are held interest-free under independent custody and may be released only following mutual clearance of physical handover inspections and settled utility accounts.
          </p>
        </section>
      </div>
    </div>
  );
};
