import React from 'react';
import { 
  X, 
  Bell, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  ArrowRight, 
  AlertCircle,
  TrendingUp,
  Clock,
  ExternalLink,
  Edit3,
  Server
} from 'lucide-react';
import { UserProfile, CommodityId, MarketData } from '../types';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation, localizeCommodityName, localizeMandiName } from '../locales';
import { isProfileIncomplete, COMMODITIES } from '../services/mandiDataService';

interface MarketAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  userProfile?: UserProfile | null;
  currentMarketData?: MarketData;
  onNavigateToEditProfile?: () => void;
  onNavigateToMarkets?: () => void;
  onOpenDiagnostics?: () => void;
}

export const MarketAlertsModal: React.FC<MarketAlertsModalProps> = ({
  isOpen,
  onClose,
  language,
  userProfile,
  currentMarketData,
  onNavigateToEditProfile,
  onNavigateToMarkets,
  onOpenDiagnostics
}) => {
  if (!isOpen) return null;

  const isMr = language === 'mr';
  const t = getTranslation(language);

  const profileIncomplete = isProfileIncomplete(userProfile);
  const userState = userProfile?.state || currentMarketData?.sourceState || currentMarketData?.mandi.state || 'Maharashtra';
  const userDistrict = userProfile?.district || currentMarketData?.sourceDistrict || currentMarketData?.mandi.district || 'Market';
  const userApmc = userProfile?.mainApmc || currentMarketData?.sourceMarket || currentMarketData?.mandi.name || 'Primary APMC';
  const userCommodityId = userProfile?.primaryCommodity || currentMarketData?.commodityId || 'onion';
  const traderType = userProfile?.role || userProfile?.userType || 'Trader';

  const commodityObj = COMMODITIES.find(c => c.id === userCommodityId) || COMMODITIES[0];
  const commodityLabel = localizeCommodityName(commodityObj.id, language, commodityObj.name, commodityObj.marathiName);

  const isOfficialDataAvailable = currentMarketData?.dataTypeCategory === 'LIVE VERIFIED DATA' && (currentMarketData?.modalPrice || 0) > 0;

  const todayStr = new Date().toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-sans text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {isMr ? 'बाजार सूचना व अलर्ट्स' : 'Market Notifications & Alerts'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isMr ? 'तुमच्या प्रोफाइलनुसार वैयक्तिकृत' : 'Personalized to your trader profile'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Context Banner */}
        <div className="bg-emerald-950 text-white rounded-2xl p-3 border border-emerald-800/60 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {isMr ? 'तुमचे अलर्ट प्रोफाइल' : 'YOUR ALERT PROFILE'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 text-[10px] font-bold flex items-center gap-1">
              <Briefcase className="w-2.5 h-2.5 text-emerald-400" />
              <span>{traderType}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-white flex-wrap">
            <span className="text-emerald-200">{userState}</span>
            <span className="text-emerald-500 font-mono text-[10px]">→</span>
            <span className="text-emerald-200">{userDistrict}</span>
            <span className="text-emerald-500 font-mono text-[10px]">→</span>
            <span className="text-white font-extrabold underline decoration-emerald-400 underline-offset-2">
              {userApmc}
            </span>
            <span className="ml-auto px-2 py-0.5 rounded-md bg-emerald-800 text-emerald-100 text-[10px] font-extrabold">
              {commodityLabel}
            </span>
          </div>
        </div>

        {/* Missing Profile Warning */}
        {profileIncomplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-amber-950 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-black text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{isMr ? 'प्रोफाइल अपूर्ण आहे' : 'Profile Incomplete'}</span>
              </div>
              {onNavigateToEditProfile && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToEditProfile();
                  }}
                  className="px-2.5 py-1 rounded-xl bg-amber-700 text-white text-[10px] font-bold hover:bg-amber-800 cursor-pointer"
                >
                  {isMr ? 'पूर्ण करा' : 'Complete Profile'}
                </button>
              )}
            </div>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              {isMr
                ? 'तुमच्या स्थानिक बाजार समिती व शेतमालाचे अचूक अलर्ट मिळवण्यासाठी तुमचे प्रोफाइल पूर्ण करा.'
                : 'Complete your signup profile with State, District, Primary APMC and Commodities to receive localized rate alerts.'}
            </p>
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-2.5">
          {/* Alert 1: Primary APMC Daily Rate Alert */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                {todayStr} • {isMr ? 'दैनिक बुलेटिन अलर्ट' : 'DAILY BULLETIN ALERT'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                isOfficialDataAvailable
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {isOfficialDataAvailable ? 'LIVE VERIFIED' : 'NO VERIFIED DATA TODAY'}
              </span>
            </div>

            <div className="text-xs font-bold text-slate-900">
              {userApmc} ({userDistrict}, {userState}) — {commodityLabel}
            </div>

            {isOfficialDataAvailable ? (
              <p className="text-[11px] text-slate-600 leading-snug">
                {isMr
                  ? `अधिकृत शासकिय भाव: सरासरी ₹${currentMarketData?.modalPrice?.toLocaleString('en-IN')}/क्विंटल (किमान ₹${currentMarketData?.minPrice?.toLocaleString('en-IN')}, कमाल ₹${currentMarketData?.maxPrice?.toLocaleString('en-IN')}).`
                  : `Official AGMARKNET quote published: Modal ₹${currentMarketData?.modalPrice?.toLocaleString('en-IN')}/qtl (Min: ₹${currentMarketData?.minPrice?.toLocaleString('en-IN')}, Max: ₹${currentMarketData?.maxPrice?.toLocaleString('en-IN')}).`}
              </p>
            ) : (
              <p className="text-[11px] text-amber-800 leading-snug">
                {isMr
                  ? `आज ${userApmc} साठी अधिकृत शासकीय AGMARKNET दर बुलेटिन उपलब्ध नाही.`
                  : `No verified AGMARKNET auction bulletin filed for ${commodityLabel} at ${userApmc} today.`}
              </p>
            )}
          </div>

          {/* Alert 2: State Market Scope Notice */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {isMr ? 'प्रादेशिक व्याप्ती' : 'REGIONAL SCOPE'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold">
                {userState}
              </span>
            </div>

            <div className="text-xs font-bold text-slate-900">
              {isMr ? `${userState} राज्यासाठी डेटा फिल्टर सक्रिय` : `Data Filter Active for ${userState}`}
            </div>

            <p className="text-[11px] text-slate-600 leading-snug">
              {isMr
                ? `तुमच्या प्रोफाइलनुसार इतर राज्यांचे असंबद्ध बाजार लपवण्यात आले आहेत. तुलना विभागात तुम्ही इतर राज्ये जोडू शकता.`
                : `By default, unrelated markets from other states are excluded from your feed. You can compare other states on the Compare page.`}
            </p>
          </div>

          {/* Alert 3: Official Verification Guarantee */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{isMr ? 'शासकीय पडताळणी धोरण' : 'Official Verification Guarantee'}</span>
            </div>
            <p className="text-[11px] text-emerald-950/80 leading-relaxed">
              {isMr
                ? 'AgriTrade मध्ये केवळ प्रत्यक्ष शासकिय AGMARKNET डेटा अथवा स्थानिक नोंदणीकृत व्यापाऱ्यांचे दर स्पष्ट लेबलसह दाखवले जातात.'
                : 'All displayed rates are verified against official AGMARKNET bulletins. Unverified rates are never substituted.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          {onOpenDiagnostics && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDiagnostics();
              }}
              className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <Server className="w-3.5 h-3.5" />
              <span>{isMr ? 'डेटा पाइपलाइन' : 'Data Policy'}</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {onNavigateToEditProfile && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToEditProfile();
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isMr ? 'प्रोफाइल बदला' : 'Edit Profile'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {isMr ? 'समजले' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
