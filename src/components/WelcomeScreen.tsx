import React from 'react';
import { ArrowRight, Globe, TrendingUp, ShieldCheck } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../services/i18nService';

export interface WelcomeScreenProps {
  language: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onGetStarted: () => void;
  onContinueWithoutLogin: () => void;
  onOpenLanguageModal?: () => void;
}

/**
 * AgriTrade Official Brand Emblem (Compact Vector Logo)
 * - Dark forest green circle ring (#165b2a)
 * - Central golden wheat stalk with symmetrical grain pairs (#f59e0b / #d97706)
 * - Base forest green cupping leaves
 */
export const AgriTradeReferenceLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 56,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
        aria-label="AgriTrade Emblem"
      >
        <defs>
          <linearGradient id="wheatGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="wheatLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Outer Dark Green Circle Ring */}
        <circle cx="100" cy="100" r="92" stroke="#165b2a" strokeWidth="10" fill="#ffffff" />

        {/* Central Golden Wheat Spine */}
        <line x1="100" y1="46" x2="100" y2="150" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />

        {/* Top Tip Grain */}
        <path d="M100 38 C94 48 94 62 100 70 C106 62 106 48 100 38Z" fill="url(#wheatGold)" stroke="#ca8a04" strokeWidth="0.8" />
        <path d="M100 38 C97 48 97 60 100 70 Z" fill="url(#wheatLight)" />

        {/* Grain Pair 1 */}
        <path d="M96 58 C84 64 78 76 87 86 C97 84 100 72 96 58Z" fill="url(#wheatGold)" stroke="#ca8a04" strokeWidth="0.8" />
        <path d="M104 58 C116 64 122 76 113 86 C103 84 100 72 104 58Z" fill="url(#wheatGold)" stroke="#ca8a04" strokeWidth="0.8" />

        {/* Grain Pair 2 */}
        <path d="M95 76 C80 83 74 97 85 108 C96 105 100 91 95 76Z" fill="url(#wheatGold)" stroke="#ca8a04" strokeWidth="0.8" />
        <path d="M105 76 C120 83 126 97 115 108 C104 105 100 91 105 76Z" fill="url(#wheatGold)" stroke="#ca8a04" strokeWidth="0.8" />

        {/* Grain Pair 3 */}
        <path d="M95 96 C78 104 72 119 84 131 C96 127 100 112 95 96Z" fill="url(#wheatGold)" stroke="#ca8a04" strokeWidth="0.8" />
        <path d="M105 96 C122 104 128 119 116 131 C104 127 100 112 105 96Z" fill="url(#wheatGold)" stroke="#ca8a04" strokeWidth="0.8" />

        {/* Grain Pair 4 */}
        <path d="M96 116 C80 124 75 138 87 148 C97 144 101 131 96 116Z" fill="url(#wheatGold)" stroke="#ca8a04" strokeWidth="0.8" />
        <path d="M104 116 C120 124 125 138 113 148 C103 144 99 131 104 116Z" fill="url(#wheatGold)" stroke="#ca8a04" strokeWidth="0.8" />

        {/* Cupping Leaves */}
        <path d="M97 154 C66 150 48 132 50 96 C68 122 86 140 97 154Z" fill="#165b2a" />
        <path d="M103 154 C134 150 152 132 150 96 C132 122 114 140 103 154Z" fill="#165b2a" />
      </svg>
    </div>
  );
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  language,
  onGetStarted,
  onContinueWithoutLogin,
  onOpenLanguageModal
}) => {
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="w-full min-w-0 max-w-full box-border h-[100dvh] max-h-[100dvh] bg-[#f8fafc] text-slate-900 flex flex-col justify-between relative overflow-x-hidden font-sans px-4 py-3 sm:px-5 sm:py-4 select-none">
      
      {/* 1. TOP UTILITY HEADER */}
      <header className="w-full box-border flex items-center justify-between z-20 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>AgriTrade • Mandi Intel</span>
        </div>

        {onOpenLanguageModal && (
          <button
            type="button"
            id="welcome-lang-toggle"
            onClick={onOpenLanguageModal}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            aria-label="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="max-w-[84px] truncate">{currentLangObj.nativeLabel}</span>
            <span className="text-[10px] text-slate-400 shrink-0">▾</span>
          </button>
        )}
      </header>

      {/* 2. CENTER CONTENT SECTION (Cohesive, Compact & 100% Fluid Width) */}
      <main className="w-full box-border flex-1 flex flex-col justify-center items-center my-auto py-2 space-y-3.5 text-center">
        
        {/* Brand Emblem + Title */}
        <div className="flex flex-col items-center w-full box-border">
          <AgriTradeReferenceLogo size={56} />
          
          <h2 className="text-2xl sm:text-[26px] font-black tracking-tight text-[#165b2a] leading-none mt-2">
            AgriTrade
          </h2>

          <div className="flex items-center justify-center gap-2 mt-1 w-full max-w-xs px-4">
            <div className="flex-1 h-[1.5px] bg-[#d97706]" />
            <span className="text-[9px] font-extrabold tracking-[0.16em] text-[#b45309] uppercase shrink-0">
              KNOW TODAY, SELL BETTER
            </span>
            <div className="flex-1 h-[1.5px] bg-[#d97706]" />
          </div>
        </div>

        {/* Main Headline & Subtitle */}
        <div className="space-y-1 w-full box-border px-2">
          <h1 className="text-[21px] sm:text-[23px] font-black tracking-tight text-slate-900 leading-tight">
            Know Before You Sell
          </h1>
          <p className="text-slate-500 text-xs leading-relaxed font-medium w-full max-w-xs mx-auto">
            Official mandi rates and agricultural market intelligence made simple.
          </p>
        </div>

        {/* Fully Responsive Market Rate Preview Card */}
        <div className="w-full box-border bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs space-y-2 text-left box-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-700 font-black text-xs shrink-0">
                🌾
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-500 block leading-tight truncate">
                  Wheat • गहू
                </span>
                <span className="text-base font-black text-slate-900 leading-tight block truncate">
                  ₹ 2,125 <span className="text-[10px] font-semibold text-slate-400">/ Quintal</span>
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold shrink-0">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>+0.5% Live</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1 text-emerald-800 truncate">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              AGMARKNET Data
            </span>
            <span className="shrink-0">•</span>
            <span className="truncate">30+ APMC Mandis</span>
            <span className="shrink-0">•</span>
            <span className="text-slate-700 shrink-0">100% Free</span>
          </div>
        </div>

      </main>

      {/* 3. BOTTOM ACTION FOOTER */}
      <footer className="w-full box-border shrink-0 space-y-2 pt-1 text-center">
        {/* Primary Action Button: "Get Started" */}
        <button
          type="button"
          id="welcome-get-started-btn"
          onClick={onGetStarted}
          className="w-full py-3.5 box-border px-4 rounded-2xl bg-[#134e27] hover:bg-[#0f3d1e] active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>

        {/* Secondary Action Link: "Continue without login" */}
        <div>
          <button
            type="button"
            id="welcome-continue-without-login-btn"
            onClick={onContinueWithoutLogin}
            className="text-xs font-semibold text-[#134e27] hover:text-[#0a2e16] underline underline-offset-4 cursor-pointer py-1 transition-colors"
          >
            Continue without login
          </button>
        </div>

        {/* Trust Footnote & Independent Platform Disclaimer */}
        <p className="text-[10px] text-slate-400 font-medium pt-0.5 break-words">
          Independent App • Records sourced from AGMARKNET (Govt. of India) & data.gov.in • Not affiliated with govt
        </p>
      </footer>

    </div>
  );
};
