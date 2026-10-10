import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDescriptor?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showDescriptor = true 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group transition-transform active:scale-[0.99] ${className}`}>
      {/* Interlocking Keys Icon */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 bg-navy-900 rounded-xl p-1.5 shadow-sm group-hover:bg-navy-800 transition-colors`}>
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          {/* Key 1: Tenant Loop (Teal) */}
          <circle cx="15" cy="20" r="6" stroke="#0D9488" strokeWidth="3" fill="none"/>
          <path d="M21 20H29M26 20V23M29 20V22.5" stroke="#0D9488" strokeWidth="3" strokeLinecap="round"/>
          
          {/* Key 2: Landlord Loop (Mint / Emerald interlocking) */}
          <circle cx="25" cy="20" r="6" stroke="#2DD4BF" strokeWidth="2.5" strokeDasharray="24 6" fill="none"/>
          <circle cx="15" cy="20" r="2" fill="#0D9488"/>
          <circle cx="25" cy="20" r="2" fill="#2DD4BF"/>
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight text-navy-900 ${textSizes[size]}`}>
            Rent<span className="text-teal-600">Match</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200/60">
            India
          </span>
        </div>
        {showDescriptor && (
          <span className="text-[10px] font-medium tracking-wide text-navy-600 uppercase mt-0.5">
            Mutual Merit Platform
          </span>
        )}
      </div>
    </Link>
  );
};
