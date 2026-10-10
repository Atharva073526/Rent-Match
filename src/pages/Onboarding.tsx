import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/store';
import { TenantProfile } from '../types';
import { 
  UserCheck, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = store.getCurrentUser();
  const existingProfile = currentUser ? store.getTenantProfile(currentUser.id) : null;

  const [step, setStep] = useState(1);

  // Tenant state
  const [profession, setProfession] = useState(existingProfile?.profession || 'Software Engineer');
  const [employer, setEmployer] = useState(existingProfile?.employerOrCollege || '');
  const [preferredLocations, setPreferredLocations] = useState<string[]>(
    existingProfile?.preferredLocations || ['Indiranagar', 'Koramangala']
  );
  const [locationInput, setLocationInput] = useState('');
  const [minRent, setMinRent] = useState(existingProfile?.minRent || 30000);
  const [maxRent, setMaxRent] = useState(existingProfile?.maxRent || 55000);
  const [maxDeposit, setMaxDeposit] = useState(existingProfile?.maxDeposit || 150000);
  const [targetMoveInDate, setTargetMoveInDate] = useState(existingProfile?.targetMoveInDate || '2026-11-01');
  const [preferredBhk, setPreferredBhk] = useState<number[]>(existingProfile?.preferredBhk || [2]);
  const [preferredFurnishing, setPreferredFurnishing] = useState<TenantProfile['preferredFurnishing']>(
    existingProfile?.preferredFurnishing || ['semi-furnished', 'fully-furnished']
  );
  const [workMode, setWorkMode] = useState<TenantProfile['workMode']>(existingProfile?.workMode || 'hybrid');
  const [petStatus, setPetStatus] = useState<TenantProfile['petStatus']>(existingProfile?.petStatus || 'no_pets');
  const [dietaryPreference, setDietaryPreference] = useState<TenantProfile['dietaryPreference']>(
    existingProfile?.dietaryPreference || 'no_restriction'
  );
  const [commutePriority, setCommutePriority] = useState<TenantProfile['commutePriority']>(
    existingProfile?.commutePriority || 'close_to_metro'
  );

  const handleAddLocation = () => {
    if (locationInput.trim() && !preferredLocations.includes(locationInput.trim())) {
      setPreferredLocations([...preferredLocations, locationInput.trim()]);
      setLocationInput('');
    }
  };

  const handleRemoveLocation = (loc: string) => {
    setPreferredLocations(preferredLocations.filter(l => l !== loc));
  };

  const toggleBhk = (val: number) => {
    if (preferredBhk.includes(val)) {
      if (preferredBhk.length > 1) setPreferredBhk(preferredBhk.filter(b => b !== val));
    } else {
      setPreferredBhk([...preferredBhk, val]);
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    store.updateTenantProfile(currentUser.id, {
      profession,
      employerOrCollege: employer,
      preferredLocations,
      minRent: Number(minRent),
      maxRent: Number(maxRent),
      maxDeposit: Number(maxDeposit),
      targetMoveInDate,
      preferredBhk,
      preferredFurnishing,
      workMode,
      petStatus,
      dietaryPreference,
      commutePriority,
      profileCompleteness: 95,
    });

    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch {}

    navigate('/tenant/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          Step {step} of 4 • Tenant Preferences Setup
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Help Us Match Your Ideal Home
        </h1>
        <p className="text-xs text-slate-500">
          Our explainable matching engine evaluates these preferences to recommend verified homes.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-teal-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card">
        {/* STEP 1: Professional & Employment */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-navy-900 text-sm">Professional Profile</h3>
            <p className="text-slate-500">
              Helps homeowners understand your employment stability without invasive interrogation.
            </p>

            <div>
              <label className="block font-semibold mb-1 text-navy-800">Profession / Designation</label>
              <input
                type="text"
                required
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Senior Software Engineer / Product Designer"
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-navy-800">Employer or University (Optional)</label>
              <input
                type="text"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                placeholder="e.g. Atlassian / Microsoft / Startup"
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-navy-800">Primary Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="hybrid">Hybrid (2-3 days office)</option>
                <option value="remote">Full-time Remote (WFH)</option>
                <option value="office">Work from Office</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: Locations & Timeline */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-navy-900 text-sm">Target Localities & Timeline</h3>

            <div>
              <label className="block font-semibold mb-1 text-navy-800">Preferred Localities</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="e.g. Indiranagar, Koramangala, HSR Layout"
                  className="flex-1 p-2.5 border border-slate-300 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="px-4 py-2 bg-navy-900 text-white rounded-xl font-bold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {preferredLocations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 font-semibold"
                  >
                    <span>{loc}</span>
                    <button type="button" onClick={() => handleRemoveLocation(loc)}>✕</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-navy-800">Target Move-in Date</label>
              <input
                type="date"
                required
                value={targetMoveInDate}
                onChange={(e) => setTargetMoveInDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-navy-800">Transit Priority</label>
              <select
                value={commutePriority}
                onChange={(e) => setCommutePriority(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="close_to_metro">Walking distance to Namma Metro / Suburban transit</option>
                <option value="close_to_techpark">Proximity to Tech Park / ORR / IT corridor</option>
                <option value="flexible">Flexible / Personal vehicle</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: Financial Ceiling */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-navy-900 text-sm">Budget & Deposit Parameters</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-navy-800">Min Rent (₹/mo)</label>
                <input
                  type="number"
                  value={minRent}
                  onChange={(e) => setMinRent(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-navy-800">Max Rent Ceiling (₹/mo)</label>
                <input
                  type="number"
                  value={maxRent}
                  onChange={(e) => setMaxRent(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-navy-800">Maximum Security Deposit Budget (₹)</label>
              <input
                type="number"
                value={maxDeposit}
                onChange={(e) => setMaxDeposit(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
              <p className="text-[11px] text-teal-700 mt-1">
                Under RentMatch Fair Deposit policy, landlords agree to 2–3 months deposit rather than traditional 10-month lockups.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Lifestyle & House Rules Alignment */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-navy-900 text-sm">Living Habits & House Rules Alignment</h3>

            <div>
              <label className="block font-semibold mb-1 text-navy-800">Preferred BHK</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => toggleBhk(num)}
                    className={`px-4 py-2 rounded-xl font-bold border transition-all ${
                      preferredBhk.includes(num)
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {num} BHK
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-navy-800">Domestic Pets</label>
              <select
                value={petStatus}
                onChange={(e) => setPetStatus(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="no_pets">No domestic pets</option>
                <option value="dog">Have dog(s)</option>
                <option value="cat">Have cat(s)</option>
                <option value="plans_to_adopt">Plans to adopt later</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-navy-800">Dietary Habits</label>
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
              >
                <option value="no_restriction">Open / Non-vegetarian & Vegetarian</option>
                <option value="veg_only">Strictly Vegetarian</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
              Matching these attributes prevents uncomfortable mid-tenancy conflicts and ensures peaceful community co-existence.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-navy-800 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> Complete & View Matches
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
