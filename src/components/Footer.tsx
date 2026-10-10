import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, Scale, CheckCircle2, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-navy-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Value Pillars Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-navy-800 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-950/80 text-teal-400 border border-teal-800/50">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">The Fair Arbiter</h4>
              <p className="text-slate-400 mt-1">Zero rental bidding escalation. Transparent pricing without broker pressure.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-950/80 text-teal-400 border border-teal-800/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">RentMatch Verified</h4>
              <p className="text-slate-400 mt-1">Authentic deeds, electricity bills, and identity verification before mutual approval.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-950/80 text-teal-400 border border-teal-800/50">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Mutual Merit</h4>
              <p className="text-slate-400 mt-1">Explainable matching on practical preferences: budget, timeline, and house rules.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-950/80 text-teal-400 border border-teal-800/50">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Model Tenancy Aligned</h4>
              <p className="text-slate-400 mt-1">2-month deposit safeguards, structured digital agreements, zero surprise evictions.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Logo size="md" className="[&_span]:text-white [&_span.text-teal-600]:text-teal-400" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              RentMatch is an AI-driven tenant–landlord mutual merit matching platform for urban India. Bringing dignity, fairness, and trust to residential tenancy in Bengaluru, Mumbai, Pune, Hyderabad, and Delhi NCR.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              Platform Status: Fully Operational (v2.4 LTS)
            </div>
          </div>

          {/* Column: Discover Rentals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Cities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/properties?city=Bengaluru" className="hover:text-teal-400 transition-colors">Bengaluru Rentals</Link></li>
              <li><Link to="/properties?city=Mumbai" className="hover:text-teal-400 transition-colors">Mumbai Rentals</Link></li>
              <li><Link to="/properties?city=Hyderabad" className="hover:text-teal-400 transition-colors">Hyderabad Rentals</Link></li>
              <li><Link to="/properties?city=Pune" className="hover:text-teal-400 transition-colors">Pune Rentals</Link></li>
              <li><Link to="/properties" className="hover:text-teal-400 transition-colors">All Verified Homes</Link></li>
            </ul>
          </div>

          {/* Column: Platform & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Platform & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/how-it-works" className="hover:text-teal-400 transition-colors">Mutual Matching Process</Link></li>
              <li><Link to="/safety" className="hover:text-teal-400 transition-colors">Verification Framework</Link></li>
              <li><Link to="/pricing" className="hover:text-teal-400 transition-colors">Transparent Pricing</Link></li>
              <li><Link to="/leases" className="hover:text-teal-400 transition-colors">Digital Model Leases</Link></li>
              <li><Link to="/blog" className="hover:text-teal-400 transition-colors">Fair Housing Articles</Link></li>
            </ul>
          </div>

          {/* Column: Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Ethics & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/about" className="hover:text-teal-400 transition-colors">About RentMatch</Link></li>
              <li><Link to="/privacy" className="hover:text-teal-400 transition-colors">Privacy & DPDP Act</Link></li>
              <li><Link to="/terms" className="hover:text-teal-400 transition-colors">Terms of Use & Anti-Bidding</Link></li>
              <li><Link to="/help" className="hover:text-teal-400 transition-colors">Help Centre & FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition-colors">Grievance Officer</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-navy-800 text-xs text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Regulatory Disclaimer:</strong> RentMatch (Mutual Merit Platform) operates as an independent peer-to-peer matching, verification coordination, and leasing technology platform. Draft tenancy agreements generated on the platform are structured templates aligned with the Model Tenancy Act principles and require state-specific registration, appropriate e-stamping, and physical or digital execution as required under local jurisdiction laws. RentMatch does not act as an unlicensed real estate broker or financial deposit depository.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p>© {new Date().getFullYear()} RentMatch Technologies India Pvt. Ltd. All rights reserved.</p>
            <p className="text-[11px] text-slate-400">
              Designed with fairness, dignity, and zero exploitation for Indian urban renters and homeowners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
