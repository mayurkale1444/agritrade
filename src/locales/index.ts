import { en, TranslationKey } from './en';
import { mr } from './mr';
import { hi } from './hi';
import { ta } from './ta';
import { kn } from './kn';
import { MandiLocation } from '../types';
import { SupportedLanguage } from '../services/i18nService';

export type { SupportedLanguage };

export const LOCALES: Record<string, Record<TranslationKey, string>> = {
  en,
  mr,
  hi,
  ta,
  kn
};

export function getTranslation(lang: string = 'mr'): Record<TranslationKey, string> {
  if (LOCALES[lang]) {
    return LOCALES[lang];
  }
  return LOCALES.mr;
}

/**
 * Localize commodity name cleanly without bilingual mixing.
 * Uses native translated commodity names for all 5 languages.
 */
export function localizeCommodityName(
  commodityId: string,
  lang: string = 'mr',
  fallbackEnglish?: string,
  fallbackMarathi?: string
): string {
  const t = getTranslation(lang);
  const key = `commodity_${commodityId.toLowerCase()}` as TranslationKey;
  if (t[key]) {
    return t[key];
  }
  if (lang === 'mr') {
    return fallbackMarathi || fallbackEnglish || commodityId;
  }
  return fallbackEnglish || fallbackMarathi || commodityId;
}

/**
 * Localize APMC Mandi name cleanly without bilingual mixing across all 5 languages.
 */
export function localizeMandiName(
  mandi: MandiLocation | { name: string; marathiName?: string; hindiName?: string },
  lang: string = 'mr',
  includeApmcSuffix: boolean = false
): string {
  let baseName = mandi.name;
  if (lang === 'mr') {
    baseName = mandi.marathiName || mandi.name;
  } else if (lang === 'hi') {
    baseName = (mandi as { hindiName?: string }).hindiName || mandi.marathiName || mandi.name;
  } else {
    baseName = mandi.name;
  }

  if (includeApmcSuffix) {
    if (
      baseName.toLowerCase().includes('apmc') ||
      baseName.includes('बाजार समिती') ||
      baseName.includes('मंडी') ||
      baseName.includes('சந்தை') ||
      baseName.includes('ಮಾರುಕಟ್ಟೆ')
    ) {
      return baseName;
    }
    if (lang === 'mr') return `${baseName} बाजार समिती`;
    if (lang === 'hi') return `${baseName} मंडी`;
    if (lang === 'ta') return `${baseName} சந்தை`;
    if (lang === 'kn') return `${baseName} ಮಾರುಕಟ್ಟೆ`;
    return `${baseName} APMC`;
  }
  return baseName;
}

/**
 * Localize variety cleanly without bilingual mixing across all 5 languages.
 */
export function localizeVarietyName(
  variety: string | undefined,
  lang: string = 'mr'
): string {
  const t = getTranslation(lang);
  if (!variety) return t.variety_faq || 'FAQ / General';

  const vLower = variety.toLowerCase();
  if (vLower.includes('unhali') || vLower.includes('उन्हाळी') || vLower.includes('garva') || vLower.includes('गरवा')) {
    return t.variety_unhali;
  }
  if (vLower.includes('red') || vLower.includes('लाल') || vLower.includes('சிவப்பு') || vLower.includes('ಕೆಂಪು')) {
    return t.variety_red;
  }
  if (vLower.includes('white') || vLower.includes('पांढरा') || vLower.includes('सफेद') || vLower.includes('வெள்ளை') || vLower.includes('ಬಿಳಿ')) {
    return t.variety_white;
  }
  if (vLower.includes('faq') || vLower.includes('सामान्य') || vLower.includes('ಸರಾಸರಿ')) {
    return t.variety_faq;
  }
  if (vLower.includes('yellow') || vLower.includes('पिवळा') || vLower.includes('पीला') || vLower.includes('மஞ்சள்') || vLower.includes('ಹಳದಿ')) {
    return t.variety_yellow;
  }
  if (vLower.includes('shankar') || vLower.includes('शंकर') || vLower.includes('சங்கர்') || vLower.includes('ಶಂಕರ್')) {
    return t.variety_shankar6;
  }
  if (vLower.includes('rajapuri') || vLower.includes('राजापुरी') || vLower.includes('ராஜாபுரி') || vLower.includes('ರಾಜಾಪುರಿ')) {
    return t.variety_rajapuri;
  }

  // If variety has parenthesis like "लाल कांदा (Red Onion)", split based on lang
  if (variety.includes('(') && variety.includes(')')) {
    const parts = variety.split(/[()]/).map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return lang === 'en' ? parts[1] : parts[0];
    }
  }

  return variety;
}

/**
 * Development-time validation check that detects missing translation keys across all 5 languages.
 * Throws console error or warning if any key is missing or empty.
 */
export function validateTranslationCompleteness(): boolean {
  const enKeys = Object.keys(en) as TranslationKey[];
  const langs = ['mr', 'hi', 'ta', 'kn'] as const;

  let allPass = true;
  for (const lang of langs) {
    const dict = LOCALES[lang];
    const missing = enKeys.filter(k => !dict[k]);
    if (missing.length > 0) {
      console.error(`[AgriTrade i18n Validation Error] Missing keys in ${lang}: ${missing.join(', ')}`);
      allPass = false;
    }
  }

  return allPass;
}

// Run validation in development environment
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  validateTranslationCompleteness();
}

export { en } from './en';
export { mr } from './mr';
export { hi } from './hi';
export { ta } from './ta';
export { kn } from './kn';
export type { TranslationKey } from './en';
