import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, FileText, Lock, Users, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          The Mutual Merit Process
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
          How Mutual Matching Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Discover a fairer rental workflow designed to replace chaotic WhatsApp broker groups with structured compatibility and digital leasing.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Step 1 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 font-black text-lg flex items-center justify-center flex-shrink-0 border border-teal-200">
            01
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-navy-900">Define Your Living & Financial Preferences</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tenants configure practical rental parameters: monthly budget ceiling, maximum deposit capacity, target move-in dates, work-from-home bandwidth requirements, and domestic pet status. No invasive interrogations.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 font-black text-lg flex items-center justify-center flex-shrink-0 border border-teal-200">
            02
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-navy-900">Explainable Compatibility Evaluation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our transparent scoring engine evaluates preferences against stored property attributes, scoring from 0 to 100. Every score features an auditable breakdown across Budget, Timing, Location, Layout, Amenities, and Stated Rules. Zero black-box bias.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 font-black text-lg flex items-center justify-center flex-shrink-0 border border-teal-200">
            03
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-navy-900">Private Interest Expression</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tenants browse verified listings and express interest with a personal note. To prevent contact harvesting and spam, personal phone numbers and official ID documents remain masked until mutual consent.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 font-black text-lg flex items-center justify-center flex-shrink-0 border border-teal-200">
            04
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-navy-900">Two-Party Mutual Approval (Mutual Match)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The homeowner reviews the tenant's verified credentials and compatibility breakdown. Once the homeowner accepts, a Mutual Match is established. Direct encrypted messaging and physical walkthrough coordination are unlocked.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-lg flex items-center justify-center flex-shrink-0 border border-emerald-200">
            05
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-navy-900">Digital Tenancy Agreement & Handover</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Once an application is approved, RentMatch generates an 11-month agreement aligned with the Model Tenancy Act. Both parties review, execute through simulated Aadhaar eSign, and track security deposits safely.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          Start Exploring Homes <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
