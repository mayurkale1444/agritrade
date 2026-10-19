import React from 'react';
import {
  Layers,
  FileText,
  Globe,
  ShieldCheck,
  ChevronRight,
  Sprout,
  Send,
  MessageSquarePlus,
  UserCheck,
  Bookmark,
  LogOut,
  AlertTriangle,
  Trash2,
  User
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../services/i18nService';
import { getTranslation } from '../locales';
import { UserProfile } from '../types';

interface MoreViewProps {
  language: SupportedLanguage;
  userProfile?: UserProfile | null;
  onOpenLanguageModal: () => void;
  onOpenWelcomeScreen: () => void;
  onOpenDiagnostics: () => void;
  onNavigateToCompare: () => void;
  onNavigateToWatchlist?: () => void;
  onNavigateToHistory: () => void;
  onNavigateToGuide: () => void;
  onNavigateToBulletins: () => void;
  onNavigateToReport?: () => void;
  onNavigateToTraderReports?: () => void;
  onViewTraderProfile?: (traderId: string) => void;
  onOpenAddLocalRate?: () => void;
  onOpenFeedbackModal?: () => void;
  onOpenEditProfile?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenDeleteAccount?: () => void;
  onOpenDisclaimer?: () => void;
  onLogout?: () => void;
}

export const MoreView: React.FC<MoreViewProps> = ({
  language,
  userProfile,
  onOpenLanguageModal,
  onOpenDiagnostics,
  onNavigateToCompare,
  onNavigateToWatchlist,
  onNavigateToReport,
  onNavigateToTraderReports,
  onOpenAddLocalRate,
  onOpenFeedbackModal,
  onOpenEditProfile,
  onOpenPrivacyPolicy,
  onOpenDeleteAccount,
  onOpenDisclaimer,
  onLogout
}) => {
  const t = getTranslation(language);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const isMr = language === 'mr';

  return (
    <div className="min-h-screen bg-slate-50 pb-28 w-full max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden" id="more-view">
      {/* 1. TOP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-tight">
                {t.settings}
              </h1>
              <span className="text-[10px] text-slate-500 font-medium">
                {t.aboutAgriTradeText}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenLanguageModal}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentLangObj.nativeLabel}</span>
          </button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* 1. MY PROFILE CARD (Inside More screen) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs" id="more-my-profile-card">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                {userProfile?.name ? userProfile.name.trim().charAt(0).toUpperCase() : <User className="w-6 h-6 text-white" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-slate-900 truncate">
                    {userProfile?.name || (isMr ? 'माझी प्रोफाइल' : 'My Profile')}
                  </span>
                  {userProfile?.role && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold uppercase shrink-0">
                      {userProfile.role}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {userProfile?.age && (
                    <span>{isMr ? `वय: ${userProfile.age}` : `Age: ${userProfile.age}`} •</span>
                  )}
                  <span className="text-emerald-800 font-semibold">{userProfile?.mainApmc || 'Nashik APMC'}</span>
                  <span>• {userProfile?.state || 'Maharashtra'}</span>
                </div>
              </div>
            </div>

            {onOpenEditProfile && (
              <button
                type="button"
                id="more-my-profile-btn"
                onClick={onOpenEditProfile}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span>{isMr ? 'माझी प्रोफाइल' : 'My Profile'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. SETTINGS LIST (Material 3 Card) */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider px-1">
            {t.coreSettings}
          </span>

          <div className="bg-white border border-slate-200 rounded-3xl divide-y divide-slate-100 overflow-hidden shadow-xs">
            {/* 1. My Profile / Edit Preferences */}
            <button
              type="button"
              id="more-edit-preferences-btn"
              onClick={onOpenEditProfile}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block leading-tight">
                    {isMr ? 'माझी प्रोफाइल व प्राधान्ये' : 'My Profile & Preferences'}
                  </span>
                  <span className="text-xs text-slate-500 block pt-0.5">
                    {isMr ? 'नाव, वय, भूमिका, मुख्य बाजार व शेतमाल बदला' : 'View & edit name, age, role, primary APMC & commodities'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 2. भाषा बदला */}
            <button
              type="button"
              id="more-language-btn"
              onClick={onOpenLanguageModal}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block leading-tight">
                    {t.changeLanguage}
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold block pt-0.5">
                    {currentLangObj.nativeLabel} ({currentLangObj.code.toUpperCase()})
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 3. माहिती स्रोत आणि अस्वीकरण (Data Sources & Legal Disclaimer) */}
            <button
              type="button"
              id="more-disclaimer-btn"
              onClick={onOpenDisclaimer || onOpenDiagnostics}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block leading-tight">
                    {isMr ? 'माहिती स्रोत व कायदेशीर अस्वीकरण' : 'Data Sources & Disclaimer'}
                  </span>
                  <span className="text-xs text-slate-500 block pt-0.5">
                    {isMr
                      ? 'AGMARKNET व data.gov.in स्रोत • शासकीय संलग्नता नाही • व्यापारी दर प्रकटीकरण'
                      : 'AGMARKNET & data.gov.in sources • Independent platform notice • Trader rates'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 4. AgriTrade ला अभिप्राय द्या */}
            {onOpenFeedbackModal && (
              <button
                type="button"
                id="more-feedback-btn"
                onClick={onOpenFeedbackModal}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                    <MessageSquarePlus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">
                      {t.helpAndFeedback}
                    </span>
                    <span className="text-xs text-slate-500 block pt-0.5">
                      {t.helpAndFeedbackSubtitle}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {/* 5. गोपनीयता धोरण (Privacy Policy) */}
            <button
              type="button"
              id="more-privacy-btn"
              onClick={onOpenPrivacyPolicy}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block leading-tight">
                    {t.privacyAndSafeguards}
                  </span>
                  <span className="text-xs text-slate-500 block pt-0.5">
                    {t.privacyAndSafeguardsSubtitle}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* 3. ADDITIONAL FEATURES SECTION */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider px-1">
            {isMr ? 'अधिक वैशिष्ट्ये' : 'Explore Features'}
          </span>

          <div className="bg-white border border-slate-200 rounded-3xl divide-y divide-slate-100 overflow-hidden shadow-xs">
            {/* 1. Daily Market Report shortcut */}
            {onNavigateToReport && (
              <button
                type="button"
                id="more-daily-report-btn"
                onClick={onNavigateToReport}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">
                      {t.dailyReportTitle}
                    </span>
                    <span className="text-xs text-slate-500 block pt-0.5">
                      {isMr ? 'दैनिक बाजार भाव अहवाल आणि विश्लेषण' : 'Mandi arrivals & modal rates summary'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {/* 2. Trader Local Market Rates */}
            {onNavigateToTraderReports && (
              <button
                type="button"
                id="more-trader-rates-btn"
                onClick={onNavigateToTraderReports}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">
                      {isMr ? 'स्थानिक व्यापारी दर' : 'Local Trader Rates'}
                    </span>
                    <span className="text-xs text-slate-500 block pt-0.5">
                      {isMr ? 'स्थानिक व्यापारी आणि खरेदीदार दर' : 'View quality-wise trader rates & posters'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {/* 3. My Watchlist shortcut */}
            {onNavigateToWatchlist && (
              <button
                type="button"
                id="more-watchlist-btn"
                onClick={onNavigateToWatchlist}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">
                      {t.watchlistTitle || t.myFavoritesTab}
                    </span>
                    <span className="text-xs text-slate-500 block pt-0.5">
                      {isMr ? 'तुमचे जतन केलेले आवडते बाजार भाव' : 'Track your saved APMC bookmarks'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {/* 4. Compare Markets shortcut */}
            <button
              type="button"
              id="more-compare-btn"
              onClick={onNavigateToCompare}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block leading-tight">
                    {t.compareTab || t.compareMarketsTitle}
                  </span>
                  <span className="text-xs text-slate-500 block pt-0.5">
                    {isMr ? 'इतर बाजारांमधील दरांची तुलना करा' : 'Compare rates across major APMCs'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* 4. ACCOUNT ACTIONS (Log Out & Delete Profile) */}
        <div className="pt-2 space-y-2">
          {/* Log Out Button */}
          {onLogout && (
            <button
              type="button"
              id="more-logout-btn"
              onClick={() => setShowLogoutModal(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-200"
            >
              <LogOut className="w-4 h-4 text-slate-600" />
              <span>{isMr ? 'लॉग आउट (Log Out)' : 'Log Out'}</span>
            </button>
          )}

          {/* Delete Profile Button */}
          {onOpenDeleteAccount && (
            <button
              type="button"
              id="more-delete-account-btn"
              onClick={onOpenDeleteAccount}
              className="w-full py-3 px-4 rounded-2xl text-rose-700 hover:text-rose-900 hover:bg-rose-50/80 active:scale-[0.99] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-200/60"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{isMr ? 'प्रोफाइल हटवा (Delete Profile)' : 'Delete Profile'}</span>
            </button>
          )}

          <div className="text-center pt-2">
            <span className="text-[11px] text-slate-400 font-semibold block">
              AgriTrade v1.0.2 • Play Store Release
            </span>
            <span className="text-[10px] text-slate-400 block pt-0.5">
              100% Private, Zero-Login & Ad-Free
            </span>
          </div>
        </div>
      </div>

      {/* CONFIRM LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">
                {isMr ? 'लॉग आउट करायचे आहे का?' : 'Confirm Log Out?'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isMr
                  ? 'तुमचा स्थानिक प्रोफाइल डेटा आणि सेव्ह केलेले बाजार भाव डिव्हाइसवर सुरक्षित राहतील.'
                  : 'Your local preferences and favorite mandi bookmarks will remain saved on this device.'}
              </p>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                id="confirm-logout-btn"
                onClick={() => {
                  setShowLogoutModal(false);
                  if (onLogout) onLogout();
                }}
                className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black cursor-pointer transition-colors shadow-xs"
              >
                {isMr ? 'लॉग आउट करा' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
