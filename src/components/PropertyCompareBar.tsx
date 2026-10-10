import React from 'react';
import { Property, CompatibilityResult } from '../types';
import { X, ArrowRight, Scale } from 'lucide-react';

interface PropertyCompareBarProps {
  comparedProperties: Property[];
  onOpenModal: () => void;
  onClear: () => void;
  onRemove: (id: string) => void;
}

export const PropertyCompareBar: React.FC<PropertyCompareBarProps> = ({
  comparedProperties,
  onOpenModal,
  onClear,
  onRemove
}) => {
  if (comparedProperties.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-navy-900 text-white rounded-2xl shadow-modal border border-navy-700 px-4 py-3 flex items-center gap-4 max-w-xl w-[92%] sm:w-auto animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2 pr-2 border-r border-navy-700">
        <Scale className="w-5 h-5 text-teal-400" />
        <span className="text-xs font-bold whitespace-nowrap">
          Compare ({comparedProperties.length}/3)
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        {comparedProperties.map((prop) => (
          <div key={prop.id} className="relative group flex-shrink-0">
            <img
              src={prop.images[0]}
              alt={prop.title}
              className="w-10 h-10 rounded-lg object-cover border border-navy-700"
              title={prop.title}
            />
            <button
              onClick={() => onRemove(prop.id)}
              className="absolute -top-1.5 -right-1.5 p-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-[10px]"
              title="Remove"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={onOpenModal}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-500 hover:bg-teal-400 text-navy-950 flex items-center gap-1 shadow-sm transition-colors whitespace-nowrap"
        >
          Compare
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onClear}
          className="text-[11px] text-slate-400 hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
