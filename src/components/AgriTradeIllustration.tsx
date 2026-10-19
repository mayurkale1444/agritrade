import React, { useState } from 'react';
import { ShieldCheck, Sprout } from 'lucide-react';
import { ASSETS } from '../assets/images';
import { getTranslation } from '../locales';

interface AgriTradeIllustrationProps {
  language: 'mr' | 'en' | 'hi' | 'ta' | 'kn';
  className?: string;
}

export const AgriTradeIllustration: React.FC<AgriTradeIllustrationProps> = ({
  language,
  className = ''
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const t = getTranslation(language);

  return (
    <div
      className={`relative w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-2xl overflow-hidden border border-emerald-100/90 shadow-xs bg-emerald-950 flex items-center justify-center select-none ${className}`}
      style={{ minHeight: '120px' }}
    >
      {/* 1. Bundled Static Asset (if available and loaded) */}
      {!imageFailed && (
        <img
          src={ASSETS.profileBanner || '/images/agri_profile_banner_1789747623554.jpg'}
          alt="AgriTrade Mandi Agriculture"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageFailed(true)}
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager"
        />
      )}

      {/* 2. Guaranteed Instant Inline Vector Art (Always active until image loads, or permanently if image fails) */}
      {(!imageLoaded || imageFailed) && (
        <div className="absolute inset-0 w-full h-full">
          <svg
            className="w-full h-full block"
            viewBox="0 0 400 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="atSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="55%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#d9f99d" />
              </linearGradient>
              <linearGradient id="atHillFar" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#166534" />
              </linearGradient>
              <linearGradient id="atHillNear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#14532d" />
              </linearGradient>
              <linearGradient id="atMandiRoof" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#9a3412" />
              </linearGradient>
            </defs>

            {/* Morning Sky */}
            <rect width="400" height="160" fill="url(#atSky)" />

            {/* Radiant Sun */}
            <circle cx="330" cy="42" r="24" fill="#fde047" opacity="0.9" />
            <circle cx="330" cy="42" r="34" fill="#fef08a" opacity="0.35" />

            {/* Distant Mountain Range */}
            <path
              d="M0,110 Q90,65 180,95 T360,80 Q385,85 400,90 L400,160 L0,160 Z"
              fill="url(#atHillFar)"
              opacity="0.75"
            />

            {/* Rolling Lush Agricultural Farmlands */}
            <path
              d="M0,118 Q100,92 210,114 T400,105 L400,160 L0,160 Z"
              fill="url(#atHillNear)"
            />

            {/* Farmland Crop Furrows */}
            <path
              d="M30,160 Q120,135 240,155"
              stroke="#86efac"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              opacity="0.8"
            />
            <path
              d="M0,145 Q80,128 170,145"
              stroke="#4ade80"
              strokeWidth="2"
              strokeDasharray="5 3"
              opacity="0.7"
            />
            <path
              d="M210,160 Q280,142 380,158"
              stroke="#86efac"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.8"
            />

            {/* APMC Mandi Shed / Trading Platform */}
            <g transform="translate(45, 78)">
              {/* Roof */}
              <polygon points="0,22 45,6 90,22 85,25 45,11 5,25" fill="url(#atMandiRoof)" />
              {/* Support Pillars */}
              <rect x="8" y="24" width="4" height="38" fill="#e2e8f0" />
              <rect x="43" y="22" width="4" height="40" fill="#cbd5e1" />
              <rect x="78" y="24" width="4" height="38" fill="#e2e8f0" />
              {/* Floor Base */}
              <rect x="4" y="58" width="82" height="6" rx="2" fill="#64748b" />
              {/* Mandi Produce Sacks (कांदा / धान्य पोती) */}
              <ellipse cx="22" cy="54" rx="8" ry="6" fill="#fcd34d" />
              <ellipse cx="34" cy="53" rx="7" ry="5.5" fill="#fbbf24" />
              <ellipse cx="28" cy="47" rx="6" ry="5" fill="#f59e0b" />
              <ellipse cx="62" cy="54" rx="8" ry="6" fill="#f87171" />
              <ellipse cx="72" cy="54" rx="7" ry="5.5" fill="#ef4444" />
              <ellipse cx="67" cy="47" rx="6" ry="5" fill="#dc2626" />
            </g>

            {/* Tractor in Farmland */}
            <g transform="translate(265, 96)">
              {/* Body */}
              <rect x="18" y="10" width="22" height="14" rx="3" fill="#16a34a" />
              <rect x="30" y="2" width="10" height="12" rx="2" fill="#15803d" />
              {/* Exhaust pipe */}
              <rect x="22" y="3" width="2" height="8" fill="#334155" />
              {/* Wheels */}
              <circle cx="36" cy="24" r="8" fill="#1e293b" />
              <circle cx="36" cy="24" r="4" fill="#94a3b8" />
              <circle cx="16" cy="26" r="5" fill="#1e293b" />
              <circle cx="16" cy="26" r="2.5" fill="#94a3b8" />
            </g>

            {/* Tree Silhouette */}
            <g transform="translate(165, 88)">
              <rect x="11" y="24" width="4" height="18" fill="#78350f" />
              <circle cx="13" cy="18" r="16" fill="#15803d" />
              <circle cx="6" cy="14" r="12" fill="#16a34a" />
              <circle cx="20" cy="15" r="11" fill="#22c55e" />
            </g>
          </svg>
        </div>
      )}

      {/* Subtle Bottom Gradient & Live Security Badge */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent pointer-events-none" />

      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold pointer-events-none">
        <span className="flex items-center gap-1.5 drop-shadow-md">
          <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
          <span className="truncate">
            {t.officialAuctionPrices}
          </span>
        </span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-800/85 backdrop-blur-xs text-[10px] font-mono border border-emerald-400/30 shrink-0">
          AGMARKNET
        </span>
      </div>
    </div>
  );
};
