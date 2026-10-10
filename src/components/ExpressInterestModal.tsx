import React, { useState } from 'react';
import { Property, CompatibilityResult } from '../types';
import { store } from '../services/store';
import { X, Sparkles, Shield, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExpressInterestModalProps {
  property: Property;
  compatibilityResult: CompatibilityResult | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ExpressInterestModal: React.FC<ExpressInterestModalProps> = ({
  property,
  compatibilityResult,
  onClose,
  onSuccess
}) => {
  const [note, setNote] = useState(
    'Hi! I reviewed your property and love the layout and location. My profile is verified on RentMatch. Looking forward to discussing compatibility!'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      store.expressInterest(property.id, note);
      
      // Celebrate interaction
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore if confetti fails in test environment
      }

      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to express interest');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-sm">Express Interest</h3>
              <p className="text-xs text-slate-500">{property.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-bold text-navy-900 text-base">Interest Expressed!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              We notified {property.landlordName}. Once they accept, direct messaging and viewing coordination will unlock automatically.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {compatibilityResult && (
              <div className="p-3 bg-teal-50/70 border border-teal-200/60 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Mutual Fit</span>
                  <p className="text-xs font-bold text-navy-900">
                    {compatibilityResult.overallScore}% Compatibility ({compatibilityResult.matchLevel})
                  </p>
                </div>
                <div className="text-right text-[11px] text-teal-800">
                  Rent: ₹{property.rent.toLocaleString('en-IN')}/mo
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1">
                Introductory Note to Homeowner
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-navy-900"
                placeholder="Share your move-in timeline and why this home suits you..."
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Polite, transparent introductions receive acceptance within 4-6 hours.
              </p>
            </div>

            {/* Privacy Safeguard Notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
              <Shield className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Protected:</strong> Your direct phone number and Aadhaar details remain strictly masked until both you and {property.landlordName} mutually accept this match.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Sending...' : 'Send Mutual Match Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
