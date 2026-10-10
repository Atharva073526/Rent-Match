import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { store } from '../services/store';
import { Property, CompatibilityResult } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyCompareBar } from '../components/PropertyCompareBar';
import { PropertyCompareModal } from '../components/PropertyCompareModal';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  LayoutGrid, 
  LayoutList, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  X,
  ChevronDown
} from 'lucide-react';

export const Properties: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State from URL or defaults
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [minRent, setMinRent] = useState(searchParams.get('minRent') || '');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '');
  const [bhk, setBhk] = useState(searchParams.get('bhk') || '');
  const [furnishing, setFurnishing] = useState(searchParams.get('furnishing') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '');
  const [onlyVerified, setOnlyVerified] = useState(searchParams.get('verified') === 'true');
  const [petFriendly, setPetFriendly] = useState(false);
  const [wfhFriendly, setWfhFriendly] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // View & Sort State
  const [sortBy, setSortBy] = useState<'relevance' | 'rent_asc' | 'rent_desc' | 'newest' | 'compatibility'>('compatibility');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Compare State
  const [comparedPropertyIds, setComparedPropertyIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const currentUser = store.getCurrentUser();
  const allProperties = store.getProperties().filter(p => p.status === 'published');

  // Available amenities for checklist
  const commonAmenities = [
    'Power Backup (100%)',
    'High-Speed Fiber Ready',
    'Covered Car Parking',
    'Gated 24/7 Security',
    'Balcony',
    'Modular Kitchen',
    'Gymnasium',
    'Swimming Pool',
    'EV Charging Point'
  ];

  // Filtering Logic
  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      // City filter
      if (city && property.city.toLowerCase() !== city.toLowerCase()) {
        return false;
      }

      // Search query (title, locality, description)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          property.title.toLowerCase().includes(q) ||
          property.locality.toLowerCase().includes(q) ||
          property.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Rent limits
      if (minRent && property.rent < parseInt(minRent)) return false;
      if (maxRent && property.rent > parseInt(maxRent)) return false;

      // BHK
      if (bhk && property.bhk !== parseInt(bhk)) return false;

      // Furnishing
      if (furnishing && property.furnishing !== furnishing) return false;

      // Property Type
      if (propertyType && property.propertyType !== propertyType) return false;

      // Verified only
      if (onlyVerified && property.verificationStatus !== 'verified') return false;

      // Pet policy
      if (petFriendly && !property.rules.petsAllowed) return false;

      // WFH friendly
      if (wfhFriendly && !property.rules.wfhFriendly) return false;

      // Amenities checklist
      if (selectedAmenities.length > 0) {
        const hasAllSelected = selectedAmenities.every(a => 
          property.amenities.some(propA => propA.toLowerCase().includes(a.toLowerCase()))
        );
        if (!hasAllSelected) return false;
      }

      return true;
    });
  }, [allProperties, city, searchQuery, minRent, maxRent, bhk, furnishing, propertyType, onlyVerified, petFriendly, wfhFriendly, selectedAmenities]);

  // Compute Compatibility Map for current user
  const compatibilityMap = useMemo(() => {
    const map: Record<string, CompatibilityResult | null> = {};
    allProperties.forEach(p => {
      map[p.id] = store.calculateCompatibilityForCurrentTenant(p);
    });
    return map;
  }, [allProperties, currentUser]);

  // Sorting Logic
  const sortedProperties = useMemo(() => {
    const list = [...filteredProperties];
    switch (sortBy) {
      case 'rent_asc':
        return list.sort((a, b) => a.rent - b.rent);
      case 'rent_desc':
        return list.sort((a, b) => b.rent - a.rent);
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'compatibility':
        return list.sort((a, b) => {
          const scoreA = compatibilityMap[a.id]?.overallScore || 0;
          const scoreB = compatibilityMap[b.id]?.overallScore || 0;
          return scoreB - scoreA;
        });
      default:
        return list;
    }
  }, [filteredProperties, sortBy, compatibilityMap]);

  const handleClearFilters = () => {
    setCity('');
    setSearchQuery('');
    setMinRent('');
    setMaxRent('');
    setBhk('');
    setFurnishing('');
    setPropertyType('');
    setOnlyVerified(false);
    setPetFriendly(false);
    setWfhFriendly(false);
    setSelectedAmenities([]);
    setSearchParams({});
  };

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const handleToggleCompare = (id: string) => {
    if (comparedPropertyIds.includes(id)) {
      setComparedPropertyIds(comparedPropertyIds.filter(pid => pid !== id));
    } else {
      if (comparedPropertyIds.length >= 3) {
        alert('You can compare up to 3 properties at a time.');
        return;
      }
      setComparedPropertyIds([...comparedPropertyIds, id]);
    }
  };

  const comparedProperties = allProperties.filter(p => comparedPropertyIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            Discover Verified Homes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified listings in Bengaluru, Mumbai, Pune, and Hyderabad with explainable compatibility.
          </p>
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-xl px-3 py-1.5 shadow-xs">
            <span className="font-semibold text-navy-900">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-navy-900 font-bold focus:outline-none cursor-pointer text-xs"
            >
              {currentUser?.role === 'tenant' && (
                <option value="compatibility">Mutual Compatibility Score</option>
              )}
              <option value="relevance">Relevance</option>
              <option value="rent_asc">Rent: Low to High</option>
              <option value="rent_desc">Rent: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-navy-900' : 'text-slate-500 hover:text-navy-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-xs text-navy-900' : 'text-slate-500 hover:text-navy-900'
              }`}
              title="List View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-navy-900 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Property Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside
          className={`bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-6 md:sticky md:top-28 ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-navy-900 text-sm">Filters</h3>
            </div>
            <button
              onClick={handleClearFilters}
              className="text-[11px] text-teal-700 hover:text-teal-900 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              Clear All
            </button>
          </div>

          {/* Search Keywords */}
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">Locality or Landmark</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Indiranagar, ITPL, Bandra"
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Cities</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Delhi NCR">Delhi NCR</option>
            </select>
          </div>

          {/* Rent Range (INR) */}
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">Monthly Rent (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minRent}
                onChange={(e) => setMinRent(e.target.value)}
                className="text-xs p-2 border border-slate-300 rounded-xl outline-none"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                className="text-xs p-2 border border-slate-300 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* BHK Chips */}
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">Bedrooms (BHK)</label>
            <div className="flex flex-wrap gap-1.5">
              {['1', '2', '3', '4'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setBhk(bhk === num ? '' : num)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    bhk === num
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num} BHK
                </button>
              ))}
            </div>
          </div>

          {/* Furnishing */}
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">Furnishing</label>
            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Any Furnishing</option>
              <option value="fully-furnished">Fully Furnished</option>
              <option value="semi-furnished">Semi Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Verification & Policies Checkboxes */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-navy-900">
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                RentMatch Verified Only
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={petFriendly}
                onChange={(e) => setPetFriendly(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>Pet Friendly Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={wfhFriendly}
                onChange={(e) => setWfhFriendly(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>WFH Friendly (High-Speed Fiber)</span>
            </label>
          </div>

          {/* Amenities Checklist */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-navy-900 mb-2">Key Amenities</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
              {commonAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-slate-700 cursor-pointer">
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
        </aside>

        {/* Listings Catalog */}
        <main className="md:col-span-3 space-y-6">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-navy-900">{sortedProperties.length}</strong> matching verified homes
            </span>
            {currentUser?.role === 'tenant' && (
              <span className="flex items-center gap-1 text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                <Sparkles className="w-3.5 h-3.5" />
                Compatibility scores computed from your tenant profile
              </span>
            )}
          </div>

          {/* Empty State */}
          {sortedProperties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base">No Matching Properties Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your budget range, clearing locality filters, or adjusting your amenity checklist.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm hover:bg-teal-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6'
                  : 'space-y-4'
              }
            >
              {sortedProperties.map((property) => {
                const comp = compatibilityMap[property.id];
                const isSaved = store.isPropertySaved(property.id);
                const isCompared = comparedPropertyIds.includes(property.id);

                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    compatibilityResult={comp}
                    isSaved={isSaved}
                    onToggleSave={() => store.toggleSaveProperty(property.id)}
                    isCompared={isCompared}
                    onToggleCompare={() => handleToggleCompare(property.id)}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Floating Property Comparison Bar */}
      <PropertyCompareBar
        comparedProperties={comparedProperties}
        onOpenModal={() => setCompareModalOpen(true)}
        onClear={() => setComparedPropertyIds([])}
        onRemove={(id) => setComparedPropertyIds(comparedPropertyIds.filter(pid => pid !== id))}
      />

      {/* Comparison Modal */}
      {compareModalOpen && (
        <PropertyCompareModal
          properties={comparedProperties}
          compatibilityResults={compatibilityMap}
          onClose={() => setCompareModalOpen(false)}
          onRemove={(id) => setComparedPropertyIds(comparedPropertyIds.filter(pid => pid !== id))}
        />
      )}
    </div>
  );
};
