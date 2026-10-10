import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { store } from '../services/store';
import { PropertyCard } from '../components/PropertyCard';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Home as HomeIcon, 
  ShieldCheck, 
  Scale, 
  HeartHandshake, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Lock, 
  FileCheck, 
  AlertCircle, 
  Building2,
  TrendingDown,
  Eye,
  Check
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('Bengaluru');
  const [searchBhk, setSearchBhk] = useState('');
  const [searchMaxRent, setSearchMaxRent] = useState('');
  const [searchMoveIn, setSearchMoveIn] = useState('');
  const [benefitTab, setBenefitTab] = useState<'tenant' | 'landlord'>('tenant');

  const properties = store.getProperties().filter(p => p.status === 'published');
  const featuredProperties = properties.slice(0, 3);
  const blogArticles = store.getBlogArticles().slice(0, 3);
  const currentUser = store.getCurrentUser();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchBhk) params.set('bhk', searchBhk);
    if (searchMaxRent) params.set('maxRent', searchMaxRent);
    if (searchMoveIn) params.set('moveIn', searchMoveIn);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-teal-100/50 via-emerald-50/40 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-teal-600 animate-pulse"></span>
            <span>Zero Broker Exploitation • India's 1st Mutual Merit Rental Network</span>
          </div>

          {/* Headline & Subhead */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-900 tracking-tight leading-[1.12]">
              Your Next Home Should Be the <span className="text-teal-600">Right Match</span>.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Traditional rental portals trigger bidding wars and endless broker spam. RentMatch uses explainable compatibility, verified deeds, and mutual consent to match great tenants with trusted homeowners.
            </p>
          </div>

          {/* Search Box Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-card border border-slate-200/90 p-4 sm:p-5 text-left">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  City / Metro
                </label>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-slate-300 rounded-xl bg-white text-navy-900 focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="Bengaluru">Bengaluru (All Corridors)</option>
                  <option value="Mumbai">Mumbai (Suburbs & South)</option>
                  <option value="Pune">Pune (Kalyani Nagar / Hinjawadi)</option>
                  <option value="Hyderabad">Hyderabad (Financial District / Hitec)</option>
                  <option value="Delhi NCR">Delhi NCR (Gurgaon & Noida)</option>
                </select>
              </div>

              {/* Property Type / BHK */}
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1 flex items-center gap-1">
                  <HomeIcon className="w-3.5 h-3.5 text-teal-600" />
                  Configuration
                </label>
                <select
                  value={searchBhk}
                  onChange={(e) => setSearchBhk(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-slate-300 rounded-xl bg-white text-navy-900 focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="">Any Layout</option>
                  <option value="1">1 BHK / Studio</option>
                  <option value="2">2 BHK Apartment</option>
                  <option value="3">3 BHK Apartment</option>
                  <option value="4">4+ BHK / Villa</option>
                </select>
              </div>

              {/* Max Budget (INR) */}
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  Max Monthly Budget (₹)
                </label>
                <select
                  value={searchMaxRent}
                  onChange={(e) => setSearchMaxRent(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-slate-300 rounded-xl bg-white text-navy-900 focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="">No Budget Limit</option>
                  <option value="30000">Up to ₹30,000 / mo</option>
                  <option value="50000">Up to ₹50,000 / mo</option>
                  <option value="75000">Up to ₹75,000 / mo</option>
                  <option value="100000">Up to ₹1,00,000 / mo</option>
                </select>
              </div>

              {/* Move-in Date */}
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  Target Move-in
                </label>
                <input
                  type="date"
                  value={searchMoveIn}
                  onChange={(e) => setSearchMoveIn(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-slate-300 rounded-xl bg-white text-navy-900 focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>All properties pre-verified for ownership deeds & C2PA authentic media</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Search className="w-4 h-4" />
                    Find My Home
                  </button>
                  <Link
                    to={currentUser?.role === 'landlord' ? '/landlord/new-property' : '/signup?role=landlord'}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-semibold text-xs text-center transition-colors"
                  >
                    List Your Property
                  </Link>
                </div>
              </div>
            </form>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
            <div className="p-3 bg-white/60 rounded-xl border border-slate-200/60">
              <span className="text-xl font-black text-navy-900">0%</span>
              <p className="text-[11px] text-slate-500 font-medium">Broker Commission</p>
            </div>
            <div className="p-3 bg-white/60 rounded-xl border border-slate-200/60">
              <span className="text-xl font-black text-teal-600">2.5 Mo</span>
              <p className="text-[11px] text-slate-500 font-medium">Avg Deposit (vs 10 Mo Trad)</p>
            </div>
            <div className="p-3 bg-white/60 rounded-xl border border-slate-200/60">
              <span className="text-xl font-black text-navy-900">100%</span>
              <p className="text-[11px] text-slate-500 font-medium">Model Tenancy Act Compliant</p>
            </div>
            <div className="p-3 bg-white/60 rounded-xl border border-slate-200/60">
              <span className="text-xl font-black text-emerald-600">4.8 / 5</span>
              <p className="text-[11px] text-slate-500 font-medium">Mutual Trust Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RENTAL MARKET PAIN POINTS VS RENTMATCH ARBITER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
            The Problem We Solve
          </span>
          <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Why Urban Renting in India is Broken — And How We Fix It
          </h2>
          <p className="text-sm text-slate-600">
            RentMatch acts as The Fair Arbiter, eliminating the exploitation, friction, and anxiety of finding a home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Rental Bidding */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 w-fit">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-base">Rental Bidding Wars</h3>
              <p className="text-xs text-rose-600 font-medium mt-0.5">The Traditional Horror</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Brokers artificially pit multiple techies against each other to escalate monthly rents by 25% through urgent token demands.
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-teal-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span><strong>RentMatch Solution:</strong> Hard price locks with zero bidding allowed. Selection is based purely on mutual compatibility.</span>
            </div>
          </div>

          {/* Card 2: 10-Month Deposit Trap */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 w-fit">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-base">10-Month Deposit Lockdown</h3>
              <p className="text-xs text-amber-600 font-medium mt-0.5">The Traditional Horror</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Homeowners demand ₹3L to ₹6L upfront security deposits, which often face arbitrary deductions and months of withheld refunds.
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-teal-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span><strong>RentMatch Solution:</strong> Model Tenancy Act aligned deposits (capped around 2-3 months) with RentMatch Escrow protection.</span>
            </div>
          </div>

          {/* Card 3: Blind Rejections & Identity Profiling */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 w-fit">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-base">Blind Rejections & Broker Spam</h3>
              <p className="text-xs text-blue-600 font-medium mt-0.5">The Traditional Horror</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Phone numbers leaked across unregulated WhatsApp groups, leading to hundreds of spam calls and invasive personal interrogations.
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-teal-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span><strong>RentMatch Solution:</strong> Private profiles with contact masking until both parties examine compatibility and mutually agree.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STEP-BY-STEP HOW IT WORKS */}
      <section className="bg-surface-subtle py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
              The 5-Step Mutual Journey
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
              How RentMatch Works
            </h2>
            <p className="text-sm text-slate-600">
              From preference configuration to digital leasing in 5 respectful, transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between">
              <div className="space-y-3">
                <span className="w-8 h-8 rounded-full bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-navy-900 text-sm">State Practical Preferences</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Specify budget ceiling, target move-in date, work-from-home needs, and pet policies.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between">
              <div className="space-y-3">
                <span className="w-8 h-8 rounded-full bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-navy-900 text-sm">Explainable Compatibility</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our algorithm calculates a 0–100 match score with transparent factor breakdowns. Zero hidden bias.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between">
              <div className="space-y-3">
                <span className="w-8 h-8 rounded-full bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="font-bold text-navy-900 text-sm">Express Interest Privately</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Request to connect without exposing private phone numbers or documents to third-party brokers.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between">
              <div className="space-y-3">
                <span className="w-8 h-8 rounded-full bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">
                  4
                </span>
                <h4 className="font-bold text-navy-900 text-sm">Two-Party Mutual Approval</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A mutual match is unlocked only when both parties agree. Direct chat & walkthrough unlocked.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between">
              <div className="space-y-3">
                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                  5
                </span>
                <h4 className="font-bold text-navy-900 text-sm">Digital Lease & Handover</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate draft 11-month agreement, e-sign with dual verification, and track deposit safely.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              Learn more about the Mutual Merit framework
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED VERIFIED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
              Curated Database
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight mt-2">
              Featured Verified Homes
            </h2>
            <p className="text-sm text-slate-600">
              Pre-inspected ownership deeds, electricity bills, and transparent deposit policies.
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            Explore all properties
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => {
            const comp = store.calculateCompatibilityForCurrentTenant(property);
            const isSaved = store.isPropertySaved(property.id);

            return (
              <PropertyCard
                key={property.id}
                property={property}
                compatibilityResult={comp}
                isSaved={isSaved}
                onToggleSave={() => store.toggleSaveProperty(property.id)}
              />
            );
          })}
        </div>
      </section>

      {/* 5. DUAL AUDIENCE VALUE TABS (TENANTS VS LANDLORDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-card">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Designed with Mutual Respect for Both Parties
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Tenants deserve dignity and reasonable deposits. Homeowners deserve reliable caretakers who respect property.
            </p>

            {/* Toggle Tabs */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl mt-2">
              <button
                onClick={() => setBenefitTab('tenant')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  benefitTab === 'tenant'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                For Tenants
              </button>
              <button
                onClick={() => setBenefitTab('landlord')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  benefitTab === 'landlord'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                For Homeowners / Landlords
              </button>
            </div>
          </div>

          {benefitTab === 'tenant' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 w-fit">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-navy-900 text-sm">Capped Security Deposits</h4>
                <p className="text-slate-600 leading-relaxed">
                  Move into prime Bengaluru or Mumbai homes with 2 to 3 months deposit, freeing up lakhs of rupees in personal savings.
                </p>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 w-fit">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-navy-900 text-sm">Verified Real Landlords</h4>
                <p className="text-slate-600 leading-relaxed">
                  Zero phantom listings. Every property verified through municipal tax receipts and BESCOM / electricity account credentials.
                </p>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 w-fit">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-navy-900 text-sm">Protected Identity</h4>
                <p className="text-slate-600 leading-relaxed">
                  Your phone number is never broadcast to call centers or real estate brokers. You communicate only when you approve.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-navy-900 text-sm">Verified Quality Applicants</h4>
                <p className="text-slate-600 leading-relaxed">
                  Review candidates with confirmed employment credentials (e.g. corporate email validation) and verified identity.
                </p>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-navy-900 text-sm">Lifestyle & House Rule Alignment</h4>
                <p className="text-slate-600 leading-relaxed">
                  Filter out mismatches before viewings. Ensure alignment on quiet hours, WFH habits, and pet expectations upfront.
                </p>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-navy-900 text-sm">Digital 11-Month Leases</h4>
                <p className="text-slate-600 leading-relaxed">
                  Generate legally formatted draft leases with standard lock-in clauses and mutual signature tracking in 2 clicks.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
            Honest Economics
          </span>
          <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Fair Pricing. Zero Surprises.
          </h2>
          <p className="text-sm text-slate-600">
            No broker commissions of 15 days or 1 month rent. Simple, affordable platform tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Tier</span>
              <div>
                <span className="text-3xl font-black text-navy-900">₹0</span>
                <span className="text-xs text-slate-500"> / forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Create verified profile</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Browse verified properties</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> View compatibility breakdown</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> 2 mutual inquiries</li>
              </ul>
            </div>
            <Link
              to="/signup"
              className="mt-6 w-full py-2 text-center text-xs font-bold bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-xl"
            >
              Get Started Free
            </Link>
          </div>

          {/* Tenant Premium */}
          <div className="bg-white rounded-2xl p-6 border-2 border-teal-600 shadow-modal flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-bold uppercase px-3 py-0.5 rounded-full">
              Most Popular for Renters
            </span>
            <div className="space-y-4">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Tenant Premium</span>
              <div>
                <span className="text-3xl font-black text-navy-900">₹99</span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Unlimited mutual inquiries</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Advanced filtering & alerts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Save & compare up to 10 homes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Verified Tenant Trust Badge</li>
              </ul>
            </div>
            <Link
              to="/pricing"
              className="mt-6 w-full py-2 text-center text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm"
            >
              Upgrade to Tenant Premium
            </Link>
          </div>

          {/* Landlord Premium */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Landlord Premium</span>
              <div>
                <span className="text-3xl font-black text-navy-900">₹149</span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Keep listings active indefinitely</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Priority placement in discovery</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Automated tenant verification</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> 11-month Model Lease generator</li>
              </ul>
            </div>
            <Link
              to="/pricing"
              className="mt-6 w-full py-2 text-center text-xs font-bold bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-xl"
            >
              View Landlord Plans
            </Link>
          </div>
        </div>
      </section>

      {/* 7. KNOWLEDGE HUB ARTICLES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
              Thought Leadership
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight mt-2">
              Rental Guides & Legal Clarity
            </h2>
          </div>
          <Link to="/blog" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            View all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogArticles.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover overflow-hidden flex flex-col transition-all"
            >
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded">
                    {article.category}
                  </span>
                  <h3 className="font-bold text-navy-900 text-sm group-hover:text-teal-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {article.summary}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{article.author}</span>
                  <span>{article.readTimeMinutes} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. FINAL CTA STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 relative overflow-hidden shadow-modal">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Ready for a Rental Experience Based on Mutual Trust?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of verified tenants and homeowners across Bengaluru, Mumbai, Pune, and Hyderabad who have left rental bidding behind.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/properties"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-extrabold text-xs shadow-sm transition-all"
            >
              Explore Verified Homes
            </Link>
            <Link
              to="/signup?role=landlord"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs border border-navy-700 transition-colors"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
