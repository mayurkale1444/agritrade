import React, { useState } from 'react';
import { Check, ArrowLeft, ArrowRight, Globe } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS, saveLanguage } from '../services/i18nService';

interface LanguageScreenProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onBack?: () => void;
  isModal?: boolean;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({
  currentLanguage,
  onSelectLanguage,
  onBack,
  isModal = false
}) => {
  const [selected, setSelected] = useState<SupportedLanguage>(currentLanguage);
  const t = TRANSLATIONS[selected] || TRANSLATIONS.mr;

  const handleConfirm = () => {
    saveLanguage(selected);
    onSelectLanguage(selected);
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto shadow-2xl ${isModal ? 'pb-6' : ''}`}>
      {/* Top Header */}
      <div className="pt-6 px-6 pb-2 border-b border-slate-200/80 bg-white">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>Language Settings</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 leading-tight">
              {t.selectLanguage}
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1 pl-1">
          तुमच्या पसंतीची भाषा निवडा. सर्व बाजारभाव आणि माहिती त्याच भाषेत दिसेल.
        </p>
      </div>

      {/* Language Options List */}
      <div className="p-6 flex-1 overflow-y-auto space-y-2.5">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selected === lang.code;
          const isMarathi = lang.code === 'mr';

          return (
            <div
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-600 shadow-sm ring-1 ring-emerald-600'
                  : 'bg-white border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">
                      {lang.nativeLabel}
                    </span>
                    {isMarathi && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200 text-emerald-900">
                        महाराष्ट्र विशेष
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {lang.label}
                  </span>
                </div>
              </div>

              {isSelected && (
                <span className="text-xs font-bold text-emerald-700">
                  सक्रिय
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Continue CTA Button */}
      <div className="p-6 bg-white border-t border-slate-200/80 rounded-t-3xl shadow-lg">
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{t.continueText}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
