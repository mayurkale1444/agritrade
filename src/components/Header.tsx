import React from 'react';
import { DataTypeCategory } from '../types';
import { Radio, ShieldAlert, AlertCircle, Globe } from 'lucide-react';
import { AgriTradeLogo } from './AgriTradeLogo';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../services/i18nService';

interface HeaderProps {
  onOpenDataInfo?: () => void;
  isLive?: boolean;
  dataSource?: string;
  dataTypeCategory?: DataTypeCategory;
  currentLanguage?: SupportedLanguage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDataInfo,
  isLive = false,
  dataTypeCategory = 'FALLBACK DATA',
  currentLanguage = 'mr',
  onSelectLanguage
}) => {
  const isVerifiedLive = isLive && dataTypeCategory === 'LIVE VERIFIED DATA';
  const isFallback = dataTypeCategory === 'FALLBACK DATA' || dataTypeCategory === 'DEMO DATA';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 flex items-center justify-center shrink-0">
            <AgriTradeLogo size={34} variant="emblem-only" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight">
              Agri<span className="text-emerald-700">Trade</span>
            </h1>
            <p className="text-[11px] text-emerald-800 font-bold">
              Know Before You Sell.
            </p>
          </div>
        </div>

        {/* Right side: Language Selector + Clean Status Badge */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          {onSelectLanguage && (
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-[11px]">
              {SUPPORTED_LANGUAGES.slice(0, 3).map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  id={`lang-btn-${lang.code}`}
                  onClick={() => onSelectLanguage(lang.code)}
                  className={`px-2 py-0.5 rounded transition-colors font-bold ${
                    currentLanguage === lang.code
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={lang.label}
                >
                  {lang.nativeLabel}
                </button>
              ))}
            </div>
          )}

          {/* Clean Status Badge: Strictly LIVE, UNAVAILABLE, or FALLBACK */}
          {isVerifiedLive ? (
            <button
              type="button"
              id="header-status-badge"
              onClick={onOpenDataInfo}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold hover:bg-emerald-200 transition-colors cursor-pointer"
              title="Official live AGMARKNET auction record verified"
            >
              <Radio className="w-3 h-3 text-emerald-700 animate-pulse" />
              <span>LIVE</span>
            </button>
          ) : isFallback ? (
            <button
              type="button"
              id="header-status-badge"
              onClick={onOpenDataInfo}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-200 transition-colors cursor-pointer"
              title="Fallback baseline data active"
            >
              <ShieldAlert className="w-3 h-3 text-amber-700" />
              <span>FALLBACK</span>
            </button>
          ) : (
            <button
              type="button"
              id="header-status-badge"
              onClick={onOpenDataInfo}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold hover:bg-rose-200 transition-colors cursor-pointer"
              title="No verified government record found"
            >
              <AlertCircle className="w-3 h-3 text-rose-700" />
              <span>UNAVAILABLE</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
