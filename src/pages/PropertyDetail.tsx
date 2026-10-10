import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { store } from '../services/store';
import { PropertyCard } from '../components/PropertyCard';
import { ExpressInterestModal } from '../components/ExpressInterestModal';
import { ReportModal } from '../components/ReportModal';
import { CompatibilityBreakdownModal } from '../components/CompatibilityBreakdownModal';
import { 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Home, 
  Maximize2, 
  Compass, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Heart, 
  Share2, 
  Sparkles, 
  Building2, 
  Lock, 
  ArrowLeft, 
  Camera, 
  Clock, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const property = store.getPropertyById(id || '');
  const currentUser = store.getCurrentUser();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-900">Property Not Found</h2>
        <p className="text-xs text-slate-500">The listing may have been rented or archived.</p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Discovery
        </Link>
      </div>
    );
  }

  const isSaved = store.isPropertySaved(property.id);
  const compatibilityResult = store.calculateCompatibilityForCurrentTenant(property);
  const isTenant = currentUser?.role === 'tenant';

  // Check if mutual match exists
  const existingMatch = currentUser ? store.getMatchesForUser(currentUser.id).find(m => m.propertyId === property.id) : null;
  const isMutualMatched = existingMatch?.status === 'mutual_match';

  // Similar properties
  const similarProperties = store.getProperties()
    .filter(p => p.id !== property.id && (p.city === property.city || p.locality === property.locality))
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const depositMonths = (property.deposit / property.rent).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Listings
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Share listing"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
          <button
            onClick={() => store.toggleSaveProperty(property.id)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Summary Header */}
      <div className="space-y-4">
        {/* Title & Trust Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {property.verificationStatus === 'verified' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  RentMatch Verified Listing
                </span>
              )}
              {property.c2paAuthentic && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-navy-900 text-teal-300">
                  <Camera className="w-3.5 h-3.5" />
                  C2PA Authentic Imagery
                </span>
              )}
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">
                {property.propertyType.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              {property.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-teal-600" />
              {property.address}, {property.locality}, {property.city} - {property.pincode}
            </p>
          </div>

          {/* Pricing Highlight Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex md:flex-col items-center md:items-end justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                ₹{property.rent.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-medium"> / month</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ₹{(property.deposit / 100000).toFixed(1)} Lakhs Deposit ({depositMonths} mo)
              </span>
            </div>
          </div>
        </div>

        {/* Gallery Component */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3 aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 relative group">
            <img
              src={property.images[activeImageIndex] || property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-all"
            />
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-semibold">
              Photo {activeImageIndex + 1} of {property.images.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 md:grid-cols-1 gap-2">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx ? 'border-teal-600 ring-2 ring-teal-400' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Details Body & Sticky Action Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols): Specs, Compatibility, Amenities, Rules */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Specifications Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
            <h3 className="font-bold text-navy-900 text-sm mb-4">Property Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Configuration</span>
                <span className="font-bold text-navy-900 text-sm">{property.bhk} BHK</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Carpet Area</span>
                <span className="font-bold text-navy-900 text-sm">{property.carpetAreaSqFt} sq.ft</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Furnishing</span>
                <span className="font-bold text-navy-900 capitalize text-sm">{property.furnishing.replace('-', ' ')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Bathrooms</span>
                <span className="font-bold text-navy-900 text-sm">{property.bathrooms} Baths</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Floor Level</span>
                <span className="font-bold text-navy-900 text-sm">{property.floor} of {property.totalFloors}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Facing</span>
                <span className="font-bold text-navy-900 text-sm">{property.facing}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Available From</span>
                <span className="font-bold text-navy-900 text-sm">{property.availableFrom}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Maintenance</span>
                <span className="font-bold text-navy-900 text-sm">₹{property.maintenance.toLocaleString('en-IN')}/mo</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC COMPATIBILITY ENGINE BREAKDOWN (WHEN LOGGED IN AS TENANT) */}
          {compatibilityResult && (
            <div className="bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/40 rounded-2xl border border-teal-200 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-600 text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900 text-sm">
                      Mutual Merit Compatibility Breakdown
                    </h3>
                    <p className="text-xs text-slate-500">
                      Evaluated against your preferences (Budget, Move-in, BHK & House rules)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-teal-700">
                    {compatibilityResult.overallScore}%
                  </span>
                  <p className="text-[11px] font-bold text-teal-800">
                    {compatibilityResult.matchLevel}
                  </p>
                </div>
              </div>

              {/* Factors pill list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {compatibilityResult.factors.map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-navy-900">{f.category}</span>
                      <span className={
                        f.status === 'matched' ? 'text-emerald-700' :
                        f.status === 'partial' ? 'text-amber-700' : 'text-rose-600'
                      }>
                        {f.scorePercent}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{f.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500 italic">
                  Non-discriminatory explainable calculation. Zero demographic proxies.
                </span>
                <button
                  onClick={() => setShowBreakdownModal(true)}
                  className="font-bold text-teal-700 hover:text-teal-800 underline"
                >
                  View Full Formula & Audit
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-3">
            <h3 className="font-bold text-navy-900 text-sm">About the Property</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="font-bold text-navy-900 text-sm">Amenities & Infrastructure</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-navy-900 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules & Tenancy Policies */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="font-bold text-navy-900 text-sm">House Rules & Tenancy Norms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-bold text-navy-900 block mb-1">Dietary Preferences</span>
                <span className="text-slate-600 capitalize">
                  {property.rules.dietaryPreference.replace('_', ' ')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-bold text-navy-900 block mb-1">Pet Policy</span>
                <span className="text-slate-600">
                  {property.rules.petsAllowed
                    ? `Allowed (${property.rules.petDetails || 'Responsible owners'})`
                    : 'No pets permitted'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-bold text-navy-900 block mb-1">Quiet Hours</span>
                <span className="text-slate-600">{property.rules.quietHours}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-bold text-navy-900 block mb-1">Guest Policy</span>
                <span className="text-slate-600 capitalize">{property.rules.guestPolicy.replace('_', ' ')}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-bold text-navy-900 block mb-1">Lock-in Period</span>
                <span className="text-slate-600">{property.rules.lockInPeriodMonths} Months</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-bold text-navy-900 block mb-1">Notice Period</span>
                <span className="text-slate-600">{property.noticePeriodMonths} Month(s)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verified Landlord Card & Action Rail */}
        <div className="space-y-6 lg:sticky lg:top-28">
          {/* Action Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="font-bold text-navy-900 text-sm">Tenancy Actions</h3>

            {isMutualMatched ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Mutual Match Active!
                </span>
                <p className="text-[11px] text-emerald-700">
                  You and {property.landlordName} have approved connection.
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/messages"
                    className="w-full py-2 rounded-xl text-center text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                  >
                    Open Direct Chat
                  </Link>
                  <Link
                    to="/applications"
                    className="w-full py-2 rounded-xl text-center text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-navy-900"
                  >
                    View Rental Application
                  </Link>
                </div>
              </div>
            ) : existingMatch ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Interest Expressed (Pending Review)
                </span>
                <p className="text-[11px] text-amber-800">
                  Awaiting {property.landlordName}'s acceptance. Chat will unlock automatically upon mutual approval.
                </p>
              </div>
            ) : isTenant ? (
              <button
                onClick={() => setShowInterestModal(true)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Express Interest & Match
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                Sign In to Express Interest
              </Link>
            )}

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Zero broker brokerage fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-600" />
                <span>Masked contact credentials until mutual agreement</span>
              </div>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold block pt-1 text-center w-full"
            >
              Report Suspicious Listing or Bidding Request
            </button>
          </div>

          {/* Verified Landlord Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="font-bold text-navy-900 text-sm">Listed by Homeowner</h3>
            <div className="flex items-center gap-3">
              <img
                src={property.landlordAvatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                alt={property.landlordName}
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-navy-900 text-sm">{property.landlordName}</h4>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Property Owner
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block">Response Rate</span>
                <span className="font-bold text-navy-900">98% (within 30m)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Tenancy Pledge</span>
                <span className="font-bold text-teal-700">Signed & Verified</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              "Committed to fair, dignified rental relationships. We return deposits on time and respect tenant privacy."
            </p>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <h3 className="text-xl font-bold text-navy-900">Similar Verified Homes Nearby</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showInterestModal && (
        <ExpressInterestModal
          property={property}
          compatibilityResult={compatibilityResult}
          onClose={() => setShowInterestModal(false)}
          onSuccess={() => setShowInterestModal(false)}
        />
      )}

      {showReportModal && (
        <ReportModal
          property={property}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {showBreakdownModal && compatibilityResult && (
        <CompatibilityBreakdownModal
          property={property}
          result={compatibilityResult}
          onClose={() => setShowBreakdownModal(false)}
          onExpressInterest={() => setShowInterestModal(true)}
          isMutualMatched={isMutualMatched}
        />
      )}
    </div>
  );
};
