import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { store } from '../services/store';
import { Property, PropertyFurnishing, PropertyType } from '../types';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  CheckSquare, 
  ShieldCheck, 
  Image as ImageIcon, 
  ArrowRight, 
  ArrowLeft, 
  Save,
  CheckCircle2
} from 'lucide-react';

export const LandlordListingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const currentUser = store.getCurrentUser();

  const isEditing = Boolean(id);
  const existingProp = id ? store.getPropertyById(id) : null;

  // Wizard Step (1 through 6)
  const [step, setStep] = useState(1);

  // Form State
  const [title, setTitle] = useState(existingProp?.title || '');
  const [description, setDescription] = useState(existingProp?.description || '');
  const [city, setCity] = useState(existingProp?.city || 'Bengaluru');
  const [locality, setLocality] = useState(existingProp?.locality || 'Indiranagar');
  const [address, setAddress] = useState(existingProp?.address || '');
  const [pincode, setPincode] = useState(existingProp?.pincode || '560038');
  
  const [rent, setRent] = useState(existingProp?.rent || 45000);
  const [deposit, setDeposit] = useState(existingProp?.deposit || 100000);
  const [maintenance, setMaintenance] = useState(existingProp?.maintenance || 3000);
  const [bhk, setBhk] = useState(existingProp?.bhk || 2);
  const [bathrooms, setBathrooms] = useState(existingProp?.bathrooms || 2);
  const [carpetAreaSqFt, setCarpetAreaSqFt] = useState(existingProp?.carpetAreaSqFt || 1100);
  const [floor, setFloor] = useState(existingProp?.floor || 2);
  const [totalFloors, setTotalFloors] = useState(existingProp?.totalFloors || 4);
  const [facing, setFacing] = useState<Property['facing']>(existingProp?.facing || 'East');
  const [furnishing, setFurnishing] = useState<PropertyFurnishing>(existingProp?.furnishing || 'semi-furnished');
  const [propertyType, setPropertyType] = useState<PropertyType>(existingProp?.propertyType || 'apartment');
  const [availableFrom, setAvailableFrom] = useState(existingProp?.availableFrom || '2026-11-01');
  const [leaseDurationMonths, setLeaseDurationMonths] = useState(existingProp?.leaseDurationMonths || 11);
  const [noticePeriodMonths, setNoticePeriodMonths] = useState(existingProp?.noticePeriodMonths || 1);

  // Amenities
  const allAmenitiesList = [
    'Power Backup (100%)',
    'High-Speed Fiber Ready',
    'Covered Car Parking',
    'Gated 24/7 Security',
    'Balcony',
    'Modular Kitchen',
    'Solar Water Heating',
    'Rainwater Harvesting',
    'Gymnasium',
    'Swimming Pool',
    'EV Charging Point',
    'Piped Gas'
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    existingProp?.amenities || ['Power Backup (100%)', 'High-Speed Fiber Ready', 'Covered Car Parking', 'Gated 24/7 Security', 'Balcony']
  );

  // House Rules
  const [dietaryPreference, setDietaryPreference] = useState(existingProp?.rules.dietaryPreference || 'no_restriction');
  const [petsAllowed, setPetsAllowed] = useState(existingProp?.rules.petsAllowed ?? true);
  const [petDetails, setPetDetails] = useState(existingProp?.rules.petDetails || 'Domestic pets permitted');
  const [quietHours, setQuietHours] = useState(existingProp?.rules.quietHours || '10:30 PM - 06:30 AM');
  const [wfhFriendly, setWfhFriendly] = useState(existingProp?.rules.wfhFriendly ?? true);
  const [guestPolicy, setGuestPolicy] = useState(existingProp?.rules.guestPolicy || 'flexible');
  const [lockInPeriodMonths, setLockInPeriodMonths] = useState(existingProp?.rules.lockInPeriodMonths || 6);

  // Images
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>(
    existingProp?.images || [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ]
  );

  const toggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !address) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload = {
      landlordId: currentUser?.id || 'user_landlord_1',
      landlordName: currentUser?.name || 'Rajesh Mehta',
      landlordPhone: currentUser?.phone || '+91 98201 87654',
      landlordAvatarUrl: currentUser?.avatarUrl,
      title,
      description,
      city,
      locality,
      address,
      pincode,
      rent: Number(rent),
      deposit: Number(deposit),
      maintenance: Number(maintenance),
      bhk: Number(bhk),
      bathrooms: Number(bathrooms),
      carpetAreaSqFt: Number(carpetAreaSqFt),
      floor: Number(floor),
      totalFloors: Number(totalFloors),
      facing,
      furnishing,
      propertyType,
      availableFrom,
      leaseDurationMonths: Number(leaseDurationMonths),
      noticePeriodMonths: Number(noticePeriodMonths),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'],
      amenities: selectedAmenities,
      rules: {
        dietaryPreference: dietaryPreference as any,
        petsAllowed,
        petDetails,
        quietHours,
        wfhFriendly,
        guestPolicy: guestPolicy as any,
        lockInPeriodMonths: Number(lockInPeriodMonths)
      },
      verificationStatus: 'verified' as const,
      verificationBadgeReason: 'Property tax receipts and BESCOM power bill verified.',
      c2paAuthentic: true,
      status: 'published' as const,
    };

    if (isEditing && id) {
      store.updateProperty(id, payload);
    } else {
      store.createProperty(payload);
    }

    navigate('/landlord/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Wizard Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          {isEditing ? 'Edit Property Listing' : 'List a Verified Property'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete property details to attract compatible, respectful tenants. Zero broker spam guaranteed.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between border-y border-slate-200 py-3 text-xs">
        <div className={`flex items-center gap-1.5 font-bold ${step >= 1 ? 'text-teal-700' : 'text-slate-400'}`}>
          <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">1</span>
          <span>Basics</span>
        </div>
        <div className={`flex items-center gap-1.5 font-bold ${step >= 2 ? 'text-teal-700' : 'text-slate-400'}`}>
          <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">2</span>
          <span>Location</span>
        </div>
        <div className={`flex items-center gap-1.5 font-bold ${step >= 3 ? 'text-teal-700' : 'text-slate-400'}`}>
          <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">3</span>
          <span>Terms</span>
        </div>
        <div className={`flex items-center gap-1.5 font-bold ${step >= 4 ? 'text-teal-700' : 'text-slate-400'}`}>
          <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">4</span>
          <span>Amenities</span>
        </div>
        <div className={`flex items-center gap-1.5 font-bold ${step >= 5 ? 'text-teal-700' : 'text-slate-400'}`}>
          <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">5</span>
          <span>Rules</span>
        </div>
        <div className={`flex items-center gap-1.5 font-bold ${step >= 6 ? 'text-teal-700' : 'text-slate-400'}`}>
          <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">6</span>
          <span>Photos</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-navy-900 text-sm">Step 1: Property Layout & Overview</h3>
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Listing Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sunlit 2 BHK with Private Terrace near 12th Main"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe ventilation, recent renovations, neighbourhood advantages..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Configuration</label>
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value={1}>1 BHK / Studio</option>
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Furnishing</label>
                  <select
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value as any)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="fully-furnished">Fully-Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Carpet Area (Sq.Ft)</label>
                  <input
                    type="number"
                    value={carpetAreaSqFt}
                    onChange={(e) => setCarpetAreaSqFt(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-navy-900 text-sm">Step 2: Property Location</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Locality</label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Indiranagar, HSR Sector 2, Powai"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Exact Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 42, 6th Cross, Off 12th Main Road"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Facing</label>
                  <select
                    value={facing}
                    onChange={(e) => setFacing(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="East">East</option>
                    <option value="North">North</option>
                    <option value="North-East">North-East</option>
                    <option value="West">West</option>
                    <option value="South">South</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: RENTAL TERMS */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-navy-900 text-sm">Step 3: Rental Economics & Tenure</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    required
                    value={rent}
                    onChange={(e) => setRent(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    required
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                  <p className="text-[10px] text-teal-700 mt-1 font-medium">
                    Equivalent to {(deposit / (rent || 1)).toFixed(1)} months rent
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Maintenance (₹/mo)</label>
                  <input
                    type="number"
                    value={maintenance}
                    onChange={(e) => setMaintenance(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Available Date</label>
                  <input
                    type="date"
                    required
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Lease Duration</label>
                  <select
                    value={leaseDurationMonths}
                    onChange={(e) => setLeaseDurationMonths(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value={11}>11 Months (Standard India)</option>
                    <option value={24}>24 Months</option>
                    <option value={36}>36 Months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Notice Period</label>
                  <select
                    value={noticePeriodMonths}
                    onChange={(e) => setNoticePeriodMonths(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value={1}>1 Month</option>
                    <option value={2}>2 Months</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AMENITIES */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-navy-900 text-sm">Step 4: Amenities Checklist</h3>
              <p className="text-xs text-slate-500">
                Select all verified amenities available to the tenant.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allAmenitiesList.map((amenity) => (
                  <label
                    key={amenity}
                    className={`p-3 rounded-xl border text-xs font-medium cursor-pointer flex items-center gap-2 transition-all ${
                      selectedAmenities.includes(amenity)
                        ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: RULES */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-bold text-navy-900 text-sm">Step 5: Stated House Rules & Policies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Dietary Policy</label>
                  <select
                    value={dietaryPreference}
                    onChange={(e) => setDietaryPreference(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="no_restriction">Open / No dietary restrictions</option>
                    <option value="veg_only">Vegetarian only in premise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Pet Policy</label>
                  <select
                    value={petsAllowed ? 'yes' : 'no'}
                    onChange={(e) => setPetsAllowed(e.target.value === 'yes')}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="yes">Pets Allowed</option>
                    <option value="no">No Pets Permitted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Community Quiet Hours</label>
                  <input
                    type="text"
                    value={quietHours}
                    onChange={(e) => setQuietHours(e.target.value)}
                    placeholder="e.g. 10:30 PM - 06:30 AM"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Lock-in Period (Months)</label>
                  <input
                    type="number"
                    value={lockInPeriodMonths}
                    onChange={(e) => setLockInPeriodMonths(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PHOTOS & VERIFICATION */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="font-bold text-navy-900 text-sm">Step 6: Photos & Ownership Verification</h3>
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Add Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
                  >
                    Add Photo
                  </button>
                </div>
              </div>

              {/* Photo Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div>
                  <strong className="block font-bold">Ownership Deeds Pre-Verification</strong>
                  RentMatch Trust Desk verifies submitted property tax and BESCOM consumer records to award your listing the verified badge.
                </div>
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-navy-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : <div />}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" /> Publish Verified Listing
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
