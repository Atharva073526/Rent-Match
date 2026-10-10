import React, { useState } from 'react';
import { store } from '../services/store';
import { Check, ShieldCheck, Sparkles, HelpCircle, CreditCard, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Pricing: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const [selectedPlan, setSelectedPlan] = useState<'tenant_premium' | 'landlord_premium' | null>(null);
  const [simulatedModalOpen, setSimulatedModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleOpenSimulatedPay = (plan: 'tenant_premium' | 'landlord_premium') => {
    setSelectedPlan(plan);
    setPaymentSuccess(false);
    setSimulatedModalOpen(true);
  };

  const handleSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setIsProcessing(true);

    setTimeout(() => {
      const mockPayId = 'pay_' + Math.random().toString(36).substring(2, 10);
      store.upgradeSubscription(selectedPlan, mockPayId);
      setIsProcessing(false);
      setPaymentSuccess(true);
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Transparent Pricing
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
          Fair, Predictable Economics
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Traditional brokers demand 1 month of rent (₹30,000–₹80,000+). RentMatch charges zero commission, offering simple subscriptions that prioritize trust and compatibility.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
        {/* Tier 1: Free */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Free Tier</span>
            <div>
              <span className="text-4xl font-black text-navy-900">₹0</span>
              <span className="text-xs text-slate-500"> / forever</span>
            </div>
            <p className="text-xs text-slate-500">Ideal for exploring verified properties in Indian metros.</p>

            <ul className="space-y-3 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Create personal profile</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Browse verified properties</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> View compatibility breakdown</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> 2 mutual inquiries</li>
              <li className="flex items-center gap-2 text-slate-400">✕ Standard search filters only</li>
            </ul>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-500 font-semibold">
            Included with every registered account
          </div>
        </div>

        {/* Tier 2: Tenant Premium */}
        <div className="bg-white rounded-3xl border-2 border-teal-600 p-8 shadow-modal flex flex-col justify-between space-y-6 relative">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[11px] font-extrabold uppercase px-4 py-0.5 rounded-full shadow-xs">
            Most Popular for Tenants
          </span>

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Tenant Premium</span>
            <div>
              <span className="text-4xl font-black text-navy-900">₹99</span>
              <span className="text-xs text-slate-500"> / month</span>
            </div>
            <p className="text-xs text-slate-500">Everything needed to secure a verified home quickly and safely.</p>

            <ul className="space-y-3 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> <strong>Unlimited landlord enquiries</strong></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Advanced lifestyle & rule filters</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Save and compare up to 10 properties</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Verified Tenant Trust Badge</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Priority notifications for new listings</li>
            </ul>
          </div>

          <button
            onClick={() => handleOpenSimulatedPay('tenant_premium')}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
          >
            {currentUser?.subscriptionTier === 'tenant_premium' ? 'Current Plan Active' : 'Upgrade to Tenant Premium (₹99)'}
          </button>
        </div>

        {/* Tier 3: Landlord Premium */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-card flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Landlord Premium</span>
            <div>
              <span className="text-4xl font-black text-navy-900">₹149</span>
              <span className="text-xs text-slate-500"> / month</span>
            </div>
            <p className="text-xs text-slate-500">For homeowners who want verified, respectful long-term tenants.</p>

            <ul className="space-y-3 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Keep property listings active indefinitely</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Priority placement in tenant discovery</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Automated tenant verification checks</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Digital 11-Month Model Tenancy Lease</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600" /> Listing analytics & view insights</li>
            </ul>
          </div>

          <button
            onClick={() => handleOpenSimulatedPay('landlord_premium')}
            className="w-full py-3 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-extrabold transition-all"
          >
            {currentUser?.subscriptionTier === 'landlord_premium' ? 'Current Plan Active' : 'Subscribe to Landlord Plan (₹149)'}
          </button>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto space-y-6 pt-10 border-t border-slate-200">
        <h3 className="text-xl font-bold text-navy-900 text-center">Frequently Asked Pricing Questions</h3>

        <div className="space-y-4 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <strong className="text-navy-900 block font-bold text-sm">Do you charge broker commission when a lease is signed?</strong>
            <p className="text-slate-600 leading-relaxed">
              Never. Unlike traditional brokers who charge 15 days or 1 month rent from both tenant and owner, RentMatch charges ₹0 commission.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <strong className="text-navy-900 block font-bold text-sm">Can I cancel my subscription anytime?</strong>
            <p className="text-slate-600 leading-relaxed">
              Yes, subscriptions are on a monthly basis and can be cancelled with one click without any lock-in or cancellation penalty.
            </p>
          </div>
        </div>
      </div>

      {/* SIMULATED PAYMENT MODAL */}
      {simulatedModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-modal border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-navy-900">
                <CreditCard className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm">Simulated Payment Gateway</h3>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                Test Sandbox
              </span>
            </div>

            {paymentSuccess ? (
              <div className="py-6 text-center space-y-3">
                <Sparkles className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-bold text-navy-900 text-base">Subscription Activated!</h4>
                <p className="text-xs text-slate-600">
                  You now have active access to {selectedPlan?.replace('_', ' ').toUpperCase()} features.
                </p>
                <button
                  onClick={() => setSimulatedModalOpen(false)}
                  className="mt-2 px-5 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
                >
                  Return to Platform
                </button>
              </div>
            ) : (
              <form onSubmit={handleSimulatedPayment} className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Plan:</span>
                    <strong className="text-navy-900 capitalize">{selectedPlan?.replace('_', ' ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount:</span>
                    <strong className="text-teal-700 text-sm">
                      {selectedPlan === 'tenant_premium' ? '₹99 / month' : '₹149 / month'}
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-[11px] text-teal-900 leading-relaxed">
                  <strong>Notice:</strong> This is an interactive sandbox demonstration. No real money will be charged or bank details collected.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSimulatedModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    {isProcessing ? 'Processing...' : 'Complete Simulated Upgrade'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
