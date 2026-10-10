import React from 'react';
import { CompatibilityResult, Property } from '../types';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Shield, Scale, Info } from 'lucide-react';

interface CompatibilityBreakdownModalProps {
  property: Property;
  result: CompatibilityResult | null;
  onClose: () => void;
  onExpressInterest?: () => void;
  isMutualMatched?: boolean;
}

export const CompatibilityBreakdownModal: React.FC<CompatibilityBreakdownModalProps> = ({
  property,
  result,
  onClose,
  onExpressInterest,
  isMutualMatched
}) => {
  if (!result) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 70) return 'text-teal-700 bg-teal-50 border-teal-300';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  const getStatusIcon = (status: 'matched' | 'partial' | 'conflict') => {
    switch (status) {
      case 'matched':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case 'conflict':
        return <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-modal max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">
                Mutual Merit Compatibility Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Transparent breakdown for {property.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Score Banner */}
          <div className={`p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${getScoreColor(result.overallScore)}`}>
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider">
                Compatibility Rating
              </span>
              <h4 className="text-2xl font-black tracking-tight mt-0.5">
                {result.overallScore}% — {result.matchLevel}
              </h4>
              <p className="text-xs mt-1 max-w-md leading-relaxed opacity-90">
                {result.summaryNote}
              </p>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-current flex items-center justify-center font-extrabold text-xl">
                {result.overallScore}
              </div>
            </div>
          </div>

          {/* Transparent Scoring Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-700 mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              Factor Breakdown (Transparent Mathematical Weights)
            </h4>

            <div className="space-y-3">
              {result.factors.map((factor, index) => (
                <div key={index} className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(factor.status)}
                      <span className="text-xs font-bold text-navy-900">
                        {factor.category}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 font-medium">
                        Weight: {factor.weightPercent}%
                      </span>
                    </div>
                    <span className="text-xs font-bold text-navy-800">
                      {factor.scorePercent}% matched
                    </span>
                  </div>

                  {/* Factor Progress Bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        factor.scorePercent >= 80 ? 'bg-emerald-500' :
                        factor.scorePercent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${factor.scorePercent}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {factor.explanation}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/50 text-[11px]">
                    <div>
                      <span className="text-slate-600 block">Your Stated Preference:</span>
                      <span className="font-semibold text-navy-900">{factor.tenantRequirement}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Property Details:</span>
                      <span className="font-semibold text-navy-900">{factor.propertyOffering}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          {result.clarificationPoints.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Recommended Discussion Topics for Viewing:
              </h5>
              <ul className="mt-2 space-y-1 text-xs text-amber-800 list-disc list-inside">
                {result.clarificationPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Ethical AI Guarantee Note */}
          <div className="p-4 rounded-xl bg-slate-100 text-slate-600 text-xs flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-navy-900 font-semibold block">Fairness & Non-Discrimination Charter</strong>
              RentMatch compatibility scoring is strictly based on practical requirements: budgets, move-in schedules, square footage, amenities, and community house rules. We strictly prohibit scoring based on caste, religion, marital status, gender, or state of origin.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Close
          </button>

          {!isMutualMatched && onExpressInterest && (
            <button
              onClick={() => {
                onClose();
                onExpressInterest();
              }}
              className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm transition-all"
            >
              Express Interest (Initiate Match)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
