import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ShieldCheck, HeartHandshake, Eye, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Our Mission & Philosophy
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight leading-tight">
          Restoring Fairness and Dignity to Urban Rental Living
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          RentMatch was conceived to end the predatory dynamics of urban renting in India: rental bidding escalations, broker harassment, 10-month deposit locks, and blind discrimination.
        </p>
      </div>

      {/* Brand Archetype: The Fair Arbiter & Guardian */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-card grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl w-fit">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">
            The Fair Arbiter / Sage
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In traditional portals, algorithms maximize bidding and leads for intermediaries. As <em>The Fair Arbiter</em>, RentMatch is committed to evidence-based compatibility: matching tenants and homeowners based on practical truth—budget realities, move-in timelines, and agreed house rules.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Supported by <em>The Guardian / Caregiver</em> archetype, we safeguard tenant security deposits, protect personal contact information from broker syndicates, and verify property ownership deeds before transactions occur.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 text-xs">
          <h3 className="font-bold text-navy-900 text-sm">Our Core Ethical Commitments</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span><strong>Zero Algorithmic Discrimination:</strong> Compatibility scores are strictly calculated from practical preferences. Zero demographic, religion, or caste proxies.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span><strong>Zero Rental Bidding:</strong> Listed rents are locked. Landlords and brokers are strictly prohibited from demanding bidding wars or token auctions.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span><strong>Model Tenancy Act Alignment:</strong> Advocating 2–3 month deposit caps and standardized 11-month digital agreements with transparent handover inspections.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-3xl font-black text-teal-700">₹0</span>
          <p className="text-xs text-slate-500 font-semibold mt-1">Broker Commissions</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-3xl font-black text-navy-900">100%</span>
          <p className="text-xs text-slate-500 font-semibold mt-1">Deed Verified Listings</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-3xl font-black text-emerald-600">2-Party</span>
          <p className="text-xs text-slate-500 font-semibold mt-1">Consented Approvals</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-3xl font-black text-navy-900">5 Metros</span>
          <p className="text-xs text-slate-500 font-semibold mt-1">Bengaluru, Mumbai, Pune, Hyd, NCR</p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          Explore Verified Homes <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
