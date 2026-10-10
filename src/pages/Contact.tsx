import React from 'react';
import { Mail, Phone, MapPin, Shield, Building2 } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
          Contact RentMatch
        </h1>
        <p className="text-sm text-slate-600">
          Reach our platform operations team, partnership desk, or official grievance officer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Office 1: Bengaluru */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card space-y-3 text-xs">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl w-fit">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-navy-900 text-sm">Bengaluru Operations HQ</h3>
          <p className="text-slate-600 leading-relaxed">
            42, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038
          </p>
          <p className="text-slate-500 pt-2 border-t border-slate-100">
            Email: <strong className="text-navy-900">bangalore@rentmatch.in</strong>
          </p>
        </div>

        {/* Office 2: Mumbai */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card space-y-3 text-xs">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl w-fit">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-navy-900 text-sm">Mumbai Regional Desk</h3>
          <p className="text-slate-600 leading-relaxed">
            One BKC, G-Block, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051
          </p>
          <p className="text-slate-500 pt-2 border-t border-slate-100">
            Email: <strong className="text-navy-900">mumbai@rentmatch.in</strong>
          </p>
        </div>

        {/* Grievance Officer */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card space-y-3 text-xs">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl w-fit">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-navy-900 text-sm">Official Grievance Officer</h3>
          <p className="text-slate-600 leading-relaxed">
            Designated under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021:
          </p>
          <div className="p-2.5 bg-slate-50 rounded-xl space-y-0.5 text-[11px]">
            <span className="font-bold text-navy-900 block">Vikram Adiga</span>
            <span className="text-slate-500">Chief Ethics & Verification Officer</span>
            <span className="text-teal-700 font-semibold block">grievances@rentmatch.in</span>
          </div>
        </div>
      </div>
    </div>
  );
};
