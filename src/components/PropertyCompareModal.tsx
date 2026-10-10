import React from 'react';
import { Property, CompatibilityResult } from '../types';
import { X, Check, Minus, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PropertyCompareModalProps {
  properties: Property[];
  compatibilityResults: Record<string, CompatibilityResult | null>;
  onClose: () => void;
  onRemove: (id: string) => void;
}

export const PropertyCompareModal: React.FC<PropertyCompareModalProps> = ({
  properties,
  compatibilityResults,
  onClose,
  onRemove
}) => {
  if (properties.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-modal max-w-5xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-navy-900 text-base">
              Side-by-Side Property Comparison ({properties.length} properties)
            </h3>
            <p className="text-xs text-slate-500">
              Evaluating financial terms, verified attributes, and compatibility factors
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-navy-900 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-x-auto overflow-y-auto">
          <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(220px,1fr))] min-w-[700px] divide-x divide-slate-100 text-xs">
            {/* Headers / Labels Column */}
            <div className="space-y-4 pr-4 font-semibold text-slate-500">
              <div className="h-44 flex items-end pb-2">Property Overview</div>
              <div className="py-2 border-t border-slate-100">Monthly Rent</div>
              <div className="py-2 border-t border-slate-100">Security Deposit</div>
              <div className="py-2 border-t border-slate-100">Maintenance</div>
              <div className="py-2 border-t border-slate-100">Layout & Size</div>
              <div className="py-2 border-t border-slate-100">Furnishing</div>
              <div className="py-2 border-t border-slate-100">Available Date</div>
              <div className="py-2 border-t border-slate-100">Pet Policy</div>
              <div className="py-2 border-t border-slate-100">Dietary Policy</div>
              <div className="py-2 border-t border-slate-100">WFH Friendly</div>
              <div className="py-2 border-t border-slate-100">Verification</div>
              <div className="py-2 border-t border-slate-100">Compatibility Match</div>
              <div className="py-2 border-t border-slate-100">Actions</div>
            </div>

            {/* Property Columns */}
            {properties.map((prop) => {
              const comp = compatibilityResults[prop.id];

              return (
                <div key={prop.id} className="px-4 space-y-4">
                  {/* Overview Card */}
                  <div className="h-44 flex flex-col justify-between">
                    <div className="relative">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-24 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => onRemove(prop.id)}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full"
                        title="Remove from compare"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 text-xs line-clamp-1">{prop.title}</h4>
                      <p className="text-[11px] text-slate-500">{prop.locality}, {prop.city}</p>
                    </div>
                  </div>

                  <div className="py-2 border-t border-slate-100 font-bold text-navy-900 text-sm">
                    ₹{prop.rent.toLocaleString('en-IN')}/mo
                  </div>

                  <div className="py-2 border-t border-slate-100 font-semibold text-emerald-700">
                    ₹{(prop.deposit / 100000).toFixed(1)} Lakhs
                  </div>

                  <div className="py-2 border-t border-slate-100 text-slate-700">
                    ₹{prop.maintenance.toLocaleString('en-IN')}/mo
                  </div>

                  <div className="py-2 border-t border-slate-100 font-medium text-navy-900">
                    {prop.bhk} BHK • {prop.carpetAreaSqFt} sq.ft
                  </div>

                  <div className="py-2 border-t border-slate-100 capitalize text-slate-700">
                    {prop.furnishing.replace('-', ' ')}
                  </div>

                  <div className="py-2 border-t border-slate-100 text-slate-700">
                    {prop.availableFrom}
                  </div>

                  <div className="py-2 border-t border-slate-100">
                    {prop.rules.petsAllowed ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Allowed
                      </span>
                    ) : (
                      <span className="text-rose-600 font-medium flex items-center gap-1">
                        <Minus className="w-3.5 h-3.5" /> No pets
                      </span>
                    )}
                  </div>

                  <div className="py-2 border-t border-slate-100 text-slate-700 capitalize">
                    {prop.rules.dietaryPreference.replace('_', ' ')}
                  </div>

                  <div className="py-2 border-t border-slate-100">
                    {prop.rules.wfhFriendly ? (
                      <span className="text-emerald-700 font-medium">Yes (High-speed fiber)</span>
                    ) : (
                      <span className="text-slate-500">Standard</span>
                    )}
                  </div>

                  <div className="py-2 border-t border-slate-100">
                    {prop.verificationStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-slate-400">Standard</span>
                    )}
                  </div>

                  <div className="py-2 border-t border-slate-100">
                    {comp ? (
                      <span className="font-extrabold text-teal-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> {comp.overallScore}% ({comp.matchLevel.split(' ')[0]})
                      </span>
                    ) : (
                      <span className="text-slate-400">Login to compute</span>
                    )}
                  </div>

                  <div className="py-2 border-t border-slate-100">
                    <Link
                      to={`/properties/${prop.id}`}
                      onClick={onClose}
                      className="inline-block w-full text-center py-1.5 px-3 rounded-lg text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-navy-800 rounded-lg hover:bg-slate-100"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
