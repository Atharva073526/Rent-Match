import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property, CompatibilityResult } from '../types';
import { store } from '../services/store';
import { CompatibilityBreakdownModal } from './CompatibilityBreakdownModal';
import { ExpressInterestModal } from './ExpressInterestModal';
import { 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Maximize2, 
  Sparkles, 
  Camera, 
  Check, 
  ArrowRight
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  compatibilityResult?: CompatibilityResult | null;
  isSaved?: boolean;
  onToggleSave?: () => void;
  isCompared?: boolean;
  onToggleCompare?: () => void;
  showCompatibility?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  compatibilityResult,
  isSaved = false,
  onToggleSave,
  isCompared = false,
  onToggleCompare,
  showCompatibility = true,
}) => {
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);

  const currentUser = store.getCurrentUser();
  const isTenant = currentUser?.role === 'tenant';

  // Format INR rent
  const formattedRent = property.rent.toLocaleString('en-IN');
  const depositMonths = (property.deposit / property.rent).toFixed(1);

  const getScoreBadgeClass = (score: number) => {
    if (score >= 85) return 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/40';
    if (score >= 70) return 'bg-teal-50 text-teal-800 border-teal-300 ring-1 ring-teal-400/40';
    if (score >= 50) return 'bg-amber-50 text-amber-800 border-amber-300';
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5 items-start">
            {property.verificationStatus === 'verified' && (
              <span 
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-navy-900 shadow-sm backdrop-blur-md border border-emerald-200"
                title={property.verificationBadgeReason || 'RentMatch Verified Listing'}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Listing</span>
              </span>
            )}
            
            {property.c2paAuthentic && (
              <span 
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-navy-900/80 text-teal-300 backdrop-blur-md"
                title="C2PA Authenticity Verified: Media metadata verified original (unmodified)"
              >
                <Camera className="w-3 h-3" />
                <span>C2PA Authentic</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Save / Favorite Button */}
            {onToggleSave && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleSave();
                }}
                className={`p-2 rounded-full backdrop-blur-md transition-all ${
                  isSaved
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-white/80 text-navy-800 hover:bg-white hover:text-rose-500'
                }`}
                aria-label={isSaved ? 'Remove from saved' : 'Save property'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Property Specs Overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="font-semibold px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm">
            {property.bhk} BHK • {property.furnishing.replace('-', ' ')}
          </span>
          <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm">
            {property.carpetAreaSqFt} sq.ft
          </span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality & City */}
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="font-medium text-navy-700 truncate">
              {property.locality}, {property.city}
            </span>
          </div>

          {/* Title */}
          <Link to={`/properties/${property.id}`} className="block group-hover:text-teal-700 transition-colors">
            <h3 className="font-bold text-navy-900 text-sm sm:text-base leading-snug line-clamp-1 mb-2">
              {property.title}
            </h3>
          </Link>

          {/* Rent & Deposit Metric */}
          <div className="flex items-baseline justify-between py-2 border-y border-slate-100 my-2">
            <div>
              <span className="text-xl font-extrabold text-navy-900 tracking-tight">
                ₹{formattedRent}
              </span>
              <span className="text-xs text-slate-500 font-medium"> / month</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ₹{(property.deposit / 100000).toFixed(1)}L Deposit ({depositMonths} mo)
              </span>
            </div>
          </div>

          {/* Amenities pill preview */}
          <div className="flex flex-wrap gap-1.5 my-2">
            {property.amenities.slice(0, 3).map((amenity, i) => (
              <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Compatibility & Actions Footer */}
        <div className="pt-3 border-t border-slate-100 mt-2 space-y-3">
          {/* Compatibility Pill */}
          {showCompatibility && compatibilityResult && (
            <button
              onClick={() => setShowBreakdownModal(true)}
              className={`w-full py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all hover:scale-[1.01] active:scale-[0.99] ${getScoreBadgeClass(
                compatibilityResult.overallScore
              )}`}
              title="Click to view explainable compatibility analysis"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                <span>Mutual Merit Match</span>
              </div>
              <span className="font-extrabold flex items-center gap-1">
                {compatibilityResult.overallScore}% ({compatibilityResult.matchLevel.split(' ')[0]})
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Compare checkbox */}
            {onToggleCompare && (
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isCompared}
                  onChange={onToggleCompare}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Compare</span>
              </label>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <Link
                to={`/properties/${property.id}`}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-navy-800 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Details
              </Link>

              {isTenant && (
                <button
                  onClick={() => setShowInterestModal(true)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
                >
                  Match
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBreakdownModal && (
        <CompatibilityBreakdownModal
          property={property}
          result={compatibilityResult || null}
          onClose={() => setShowBreakdownModal(false)}
          onExpressInterest={() => setShowInterestModal(true)}
        />
      )}

      {showInterestModal && (
        <ExpressInterestModal
          property={property}
          compatibilityResult={compatibilityResult || null}
          onClose={() => setShowInterestModal(false)}
          onSuccess={() => setShowInterestModal(false)}
        />
      )}
    </div>
  );
};
