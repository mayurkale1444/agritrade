import React, { useState, useMemo } from 'react';
import {
  Search,
  Sprout,
  Globe,
  Bell,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Radio,
  AlertCircle,
  ChevronRight,
  Loader2,
  Mic,
  MicOff,
  FileText,
  Scale,
  Calculator,
  Bookmark,
  MessageSquarePlus,
  Plus,
  Store,
  CheckCircle2,
  Image as ImageIcon,
  Tag,
  Check,
  X,
  Info
} from 'lucide-react';
import { CommodityId, Commodity, MandiLocation, MarketData, TraderSubmittedReport, UserProfile, TraderReport } from '../types';
import { COMMODITIES, MAHARASHTRA_MANDIS, ALL_MANDI_LOCATIONS, cleanMandiString, normalizeDistrict, isProfileIncomplete } from '../services/mandiDataService';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../services/i18nService';
import { getTranslation, localizeCommodityName, localizeMandiName } from '../locales';
import { getStoredTraderReports } from '../services/traderReportService';
import { ASSETS } from '../assets/images';
import { ProfileContextBar } from './ProfileContextBar';
import { PosterModal } from './PosterModal';

interface HomeDashboardProps {
  language: SupportedLanguage;
  selectedCommodityId: CommodityId;
  selectedMandi: MandiLocation;
  currentMarketData: MarketData;
  isLoadingData: boolean;
  traderReports?: TraderSubmittedReport[];
  userProfile?: UserProfile;
  onSelectCommodity: (id: CommodityId) => void;
  onSelectMandi: (mandi: MandiLocation) => void;
  onSelectMarketContext?: (commodityId: CommodityId, mandi: MandiLocation, navigateToDetails?: boolean) => void;
  onNavigateToWizard: (commodityId: CommodityId) => void;
  onNavigateToDetails: () => void;
  onNavigateToMarkets: () => void;
  onNavigateToCompare?: () => void;
  onNavigateToCalculator?: () => void;
  onNavigateToWatchlist?: () => void;
  onNavigateToReport?: () => void;
  onNavigateToTraderReports?: () => void;
  onOpenAddLocalRate?: () => void;
  onViewTraderProfile?: (traderId: string) => void;
  onNavigateToEditProfile?: () => void;
  onOpenLanguageModal: () => void;
  onOpenDiagnosticsModal: () => void;
  onOpenFeedbackModal?: () => void;
  onOpenDisclaimer?: () => void;
}

interface SearchResultItem {
  id: string;
  type: 'commodity' | 'mandi' | 'combined';
  title: string;
  subtitle: string;
  badgeText: string;
  commodityId?: CommodityId;
  mandi?: MandiLocation;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  language,
  selectedCommodityId,
  selectedMandi,
  currentMarketData,
  isLoadingData,
  traderReports = [],
  userProfile,
  onSelectCommodity,
  onSelectMandi,
  onSelectMarketContext,
  onNavigateToWizard,
  onNavigateToDetails,
  onNavigateToMarkets,
  onNavigateToCompare,
  onNavigateToCalculator,
  onNavigateToWatchlist,
  onNavigateToReport,
  onNavigateToTraderReports,
  onOpenAddLocalRate,
  onViewTraderProfile,
  onNavigateToEditProfile,
  onOpenLanguageModal,
  onOpenDiagnosticsModal,
  onOpenFeedbackModal,
  onOpenDisclaimer
}) => {
  const t = getTranslation(language);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('Maharashtra');
  const [commodityBarSearch, setCommodityBarSearch] = useState('');
  const [activePosterReport, setActivePosterReport] = useState<TraderReport | null>(null);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  // Date formatting for the sub-bar (e.g. "15 Sep 2026")
  const formattedToday = useMemo(() => {
    const d = new Date();
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return d.toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', options);
  }, [language]);

  // Voice Search handler
  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceNotice(t.voiceSearchError);
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'mr' ? 'mr-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice(t.voiceSearchListening);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setSearchQuery(transcript);
          setVoiceNotice(null);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice(t.voiceSearchError);
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Comprehensive Search: Commodities + APMCs / Mandis + Combined
  const searchResults = useMemo<SearchResultItem[]>(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    // 1. Check if user typed both commodity and mandi, e.g. "Soybean Nashik" or "Nashik Soybean"
    const matchedCommodities = COMMODITIES.filter(c => {
      const mName = c.name.toLowerCase();
      const mHindi = c.hindiName?.toLowerCase() || '';
      const mMarathi = c.marathiName?.toLowerCase() || '';
      const mAliases = c.aliases?.some(a => a.toLowerCase().includes(q)) || false;
      return mName.includes(q) || q.includes(mName) || mHindi.includes(q) || mMarathi.includes(q) || mAliases;
    });

    const allMandisCombined: MandiLocation[] = [
      ...MAHARASHTRA_MANDIS,
      ...ALL_MANDI_LOCATIONS.filter(al => !MAHARASHTRA_MANDIS.some(mm => mm.id === al.id))
    ];

    const matchedMandis = allMandisCombined.filter(m => {
      const mName = m.name.toLowerCase();
      const mDist = m.district.toLowerCase();
      const mState = (m.state || '').toLowerCase();
      const mMarathi = (m.marathiName || '').toLowerCase();
      return mName.includes(q) || mDist.includes(q) || mState.includes(q) || mMarathi.includes(q);
    });

    // Check for combined match if space exists in query
    if (q.includes(' ')) {
      const tokens = q.split(/\s+/).filter(Boolean);
      for (const cmd of COMMODITIES) {
        const cmdName = cmd.name.toLowerCase();
        const cmdMarathi = (cmd.marathiName || '').toLowerCase();
        const cmdMatchToken = tokens.some(t => cmdName.includes(t) || cmdMarathi.includes(t) || t.includes('soy') || t.includes('कांदा'));
        if (cmdMatchToken) {
          for (const mnd of allMandisCombined) {
            const mndName = mnd.name.toLowerCase();
            const mndDist = mnd.district.toLowerCase();
            const mndMarathi = (mnd.marathiName || '').toLowerCase();
            const mndMatchToken = tokens.some(t => mndName.includes(t) || mndDist.includes(t) || mndMarathi.includes(t));
            if (mndMatchToken) {
              results.push({
                id: `combined-${cmd.id}-${mnd.id}`,
                type: 'combined',
                title: `${localizeCommodityName(cmd.id, language, cmd.name, cmd.marathiName)} • ${mnd.name}`,
                subtitle: `${mnd.district}, ${mnd.state || 'Maharashtra'}`,
                badgeText: 'COMMODITY + APMC',
                commodityId: cmd.id,
                mandi: mnd
              });
            }
          }
        }
      }
    }

    // Add matched commodities and top mandis for direct 1-tap APMC selection
    for (const c of matchedCommodities) {
      if (!results.some(r => r.commodityId === c.id && r.type === 'commodity')) {
        results.push({
          id: `cmd-${c.id}`,
          type: 'commodity',
          title: localizeCommodityName(c.id, language, c.name, c.marathiName),
          subtitle: `${c.category} • Select variety & APMC`,
          badgeText: 'COMMODITY',
          commodityId: c.id
        });
      }

      // Also provide direct access to key APMCs matching user profile state
      const userStateClean = (userProfile?.state || displayMandi.state || 'Maharashtra').toLowerCase().trim();
      const priorityMandis = allMandisCombined.filter(m => {
        const mStateClean = (m.state || '').toLowerCase().trim();
        if (mStateClean !== userStateClean) return false;
        if (userProfile?.mainApmc && m.name.toLowerCase().includes(userProfile.mainApmc.toLowerCase())) return true;
        if (userProfile?.district && m.district.toLowerCase().includes(userProfile.district.toLowerCase())) return true;
        return m.isMajorAPMC;
      }).slice(0, 3);

      for (const pm of priorityMandis) {
        if (!results.some(r => r.id === `combined-${c.id}-${pm.id}`)) {
          results.push({
            id: `combined-${c.id}-${pm.id}`,
            type: 'combined',
            title: `${localizeCommodityName(c.id, language, c.name, c.marathiName)} • ${pm.name}`,
            subtitle: `${pm.district}, ${pm.state || 'Maharashtra'} • Official Rate`,
            badgeText: 'COMMODITY + APMC',
            commodityId: c.id,
            mandi: pm
          });
        }
      }
    }

    // Add matched mandis / APMCs
    for (const m of matchedMandis) {
      if (!results.some(r => r.mandi?.id === m.id && r.type === 'mandi')) {
        results.push({
          id: `mandi-${m.id}`,
          type: 'mandi',
          title: m.name,
          subtitle: `${m.district}, ${m.state || 'Maharashtra'} • Current: ${localizeCommodityName(selectedCommodityId, language, COMMODITIES.find(c => c.id === selectedCommodityId)?.name || 'Commodity')}`,
          badgeText: 'APMC MANDI',
          mandi: m
        });
      }
    }

    return results.slice(0, 8);
  }, [searchQuery, language, selectedCommodityId]);

  // Displayed commodity and mandi (strictly synced with selection)
  const displayCommodity = currentMarketData.commodity || COMMODITIES.find(c => c.id === selectedCommodityId) || COMMODITIES[0];
  const displayMandi = currentMarketData.mandi || selectedMandi;

  const displayArrivalDate = useMemo(() => {
    if (isLoadingData) return '...';
    if (currentMarketData.dataTypeCategory === 'LIVE VERIFIED DATA' && currentMarketData.arrivalDate) {
      return currentMarketData.arrivalDate;
    }
    return t.noVerifiedDataToday;
  }, [isLoadingData, currentMarketData.dataTypeCategory, currentMarketData.arrivalDate, t.noVerifiedDataToday]);

  const commodityLabel = localizeCommodityName(displayCommodity.id, language, displayCommodity.name, displayCommodity.marathiName);
  const mandiLabel = localizeMandiName(displayMandi, language, true);

  const isOfficialDataAvailable = currentMarketData.dataTypeCategory === 'LIVE VERIFIED DATA' && (currentMarketData.modalPrice || 0) > 0;

  // Filtered commodities list for horizontal scroll / search selector
  const filteredCommoditiesList = useMemo(() => {
    if (!commodityBarSearch.trim()) return COMMODITIES;
    const q = commodityBarSearch.toLowerCase().trim();
    return COMMODITIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.marathiName && c.marathiName.toLowerCase().includes(q)) ||
      c.hindiName.toLowerCase().includes(q) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      c.aliases?.some(a => a.toLowerCase().includes(q))
    );
  }, [commodityBarSearch]);

  // Find matching trader report strictly for selected commodity and selected mandi / district / state
  const matchingTraderReport = useMemo<TraderReport | null>(() => {
    const rawPool = (traderReports && traderReports.length > 0) ? traderReports : getStoredTraderReports();
    const targetCmd = selectedCommodityId.toLowerCase().trim();
    const targetMandi = cleanMandiString(displayMandi.name);
    const targetDist = normalizeDistrict(displayMandi.district);
    const targetState = cleanMandiString(displayMandi.state || userProfile?.state || 'Maharashtra');

    const found = rawPool.find((r: any) => {
      // 1. Strict commodity match - NEVER substitute another commodity
      const rCmd = (r.commodityId || r.commodity || '').toLowerCase().trim();
      const isCmdMatch = rCmd === targetCmd || rCmd.includes(targetCmd) || targetCmd.includes(rCmd) ||
        (targetCmd === 'soybean' && rCmd.includes('soy')) ||
        (targetCmd === 'cotton' && (rCmd.includes('cotton') || rCmd.includes('kapas')));
      if (!isCmdMatch) return false;

      // 2. Strict location match: APMC or district within matching state
      const rMkt = cleanMandiString(r.marketName || r.mainAPMC || r.apmc || '');
      const rDist = normalizeDistrict(r.district || '');
      const rState = cleanMandiString(r.state || 'Maharashtra');

      if (targetState && rState && !targetState.includes(rState) && !rState.includes(targetState)) {
        return false;
      }

      const matchesMarket = rMkt && targetMandi && (rMkt === targetMandi || rMkt.includes(targetMandi) || targetMandi.includes(rMkt));
      const matchesDistrict = rDist && targetDist && (rDist === targetDist || rDist.includes(targetDist) || targetDist.includes(rDist));

      return matchesMarket || matchesDistrict;
    });

    return (found as TraderReport) || null;
  }, [traderReports, selectedCommodityId, displayMandi, userProfile?.state]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 w-full max-w-md mx-auto shadow-2xl flex flex-col font-sans overflow-x-hidden">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xs w-full">
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20 shrink-0">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-lg sm:text-xl font-black text-emerald-950 tracking-tight leading-none block truncate">
                {t.appName}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 leading-none mt-0.5 block truncate">
                {language === 'mr' ? 'विकण्यापूर्वी माहिती घ्या' : 'Know Before You Sell'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Language toggle button */}
            <button
              type="button"
              id="home-lang-toggle"
              onClick={onOpenLanguageModal}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              aria-label={t.changeLanguage}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentLangObj.nativeLabel}</span>
            </button>

            {/* Notification & Bulletin Bell */}
            <button
              type="button"
              id="home-bell-btn"
              onClick={onOpenDiagnosticsModal}
              className="p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors relative cursor-pointer shrink-0"
              title={t.officialSourceLabel}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </button>
          </div>
        </div>

        {/* 1B. SUB-BAR: State & District Indicator */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-lg text-slate-800 text-[11px] truncate max-w-[210px]">
            <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
            <span className="truncate font-bold">{displayMandi.state || userProfile?.state || selectedStateFilter}</span>
            <span className="text-slate-400">•</span>
            <span className="truncate text-slate-600">{displayMandi.district || userProfile?.district || 'Market'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium shrink-0">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>{formattedToday}</span>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4 flex-1">
        {/* Profile Context Bar: Clearly displays State + District + APMC + Trader Type */}
        <ProfileContextBar
          userProfile={userProfile}
          language={language}
          activeState={displayMandi.state || userProfile?.state}
          activeDistrict={displayMandi.district || userProfile?.district}
          activeApmc={displayMandi.name || userProfile?.mainApmc}
          activeCommodityName={commodityLabel}
          onEditProfile={onNavigateToEditProfile}
        />

        {/* POLICY TRANSPARENCY BANNER: Independent App & Data Sources (Google Play Compliance) */}
        <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-xs border border-slate-800 flex items-center justify-between gap-2.5" id="home-policy-banner">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Info className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-white block leading-tight truncate">
                {language === 'mr' ? 'स्वतंत्र कृषी माहिती मंच • AGMARKNET स्रोत' : 'Independent Mandi App • AGMARKNET & data.gov.in'}
              </span>
              <span className="text-[9.5px] text-slate-300 block truncate">
                {language === 'mr' ? 'शासकीय संलग्नता नाही • अधिकृत नोंदी व व्यापारी दर' : 'Not affiliated with govt • Official records & trader rates'}
              </span>
            </div>
          </div>
          {onOpenDisclaimer && (
            <button
              type="button"
              onClick={onOpenDisclaimer}
              id="home-open-disclaimer-banner-btn"
              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[10.5px] font-extrabold shrink-0 cursor-pointer shadow-2xs transition-colors"
            >
              {language === 'mr' ? 'स्रोत व नियम' : 'Disclaimer'} →
            </button>
          )}
        </div>

        {/* 2. SEARCH BAR: COMMODITY + APMC / MANDI */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="home-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isListening ? t.voiceSearchListening : "Search Commodity or APMC / Mandi (e.g. Soybean, Nashik APMC)…"}
              className={`w-full bg-white border text-slate-900 text-xs sm:text-sm rounded-2xl pl-10 pr-12 py-3 focus:outline-none shadow-xs placeholder:text-slate-400 transition-all ${
                isListening
                  ? 'border-red-500 ring-2 ring-red-400/30'
                  : 'border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
              }`}
            />
            {/* Mic button */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              id="home-voice-btn"
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
              title={t.voiceSearchTitle}
              aria-label={t.voiceSearchTitle}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {voiceNotice && (
            <div className="mt-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{voiceNotice}</span>
            </div>
          )}

          {/* Search Dropdown Results: Commodities, Mandis, and Combined */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto divide-y divide-slate-100">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.type === 'commodity') {
                        console.log('[SEARCH SELECTION]', {
                          type: 'commodity',
                          commodity: item.commodityId,
                          date: 'Today'
                        });
                        onSelectCommodity(item.commodityId!);
                        onNavigateToWizard(item.commodityId!);
                      } else if (item.type === 'mandi') {
                        console.log('[SEARCH SELECTION]', {
                          type: 'mandi',
                          commodity: selectedCommodityId,
                          market: item.mandi!.name,
                          district: item.mandi!.district,
                          state: item.mandi!.state || 'Maharashtra',
                          date: 'Today'
                        });
                        if (onSelectMarketContext) {
                          onSelectMarketContext(selectedCommodityId, item.mandi!, true);
                        } else {
                          onSelectMandi(item.mandi!);
                          onNavigateToDetails();
                        }
                      } else if (item.type === 'combined') {
                        const targetCmd = item.commodityId || selectedCommodityId;
                        console.log('[SEARCH SELECTION]', {
                          type: 'combined',
                          commodity: targetCmd,
                          market: item.mandi!.name,
                          district: item.mandi!.district,
                          state: item.mandi!.state || 'Maharashtra',
                          date: 'Today'
                        });
                        if (onSelectMarketContext) {
                          onSelectMarketContext(targetCmd, item.mandi!, true);
                        } else {
                          onSelectCommodity(targetCmd);
                          onSelectMandi(item.mandi!);
                          onNavigateToDetails();
                        }
                      }
                      setSearchQuery('');
                    }}
                    className="w-full p-3 text-left flex items-center justify-between hover:bg-emerald-50/70 transition-colors"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                          item.type === 'commodity'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.type === 'mandi'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {item.badgeText}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  {t.noMarketsFound}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. HERO GREEN BANNER CARD */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-900 text-white p-4 sm:p-5 shadow-xl shadow-emerald-950/20 relative overflow-hidden flex items-center justify-between gap-2.5">
          <div className="relative z-10 flex-1 min-w-0 space-y-2 sm:space-y-2.5">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-[10px] font-bold text-emerald-200 border border-emerald-600/40 uppercase tracking-wider">
              {t.statusLiveVerified}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white leading-tight">
              {t.todayMarketRatesBanner}
            </h2>
            <button
              type="button"
              id="home-view-daily-report-btn"
              onClick={() => {
                if (onNavigateToReport) {
                  onNavigateToReport();
                } else {
                  onNavigateToMarkets();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white text-emerald-900 rounded-xl text-[11px] sm:text-xs font-bold hover:bg-emerald-50 active:scale-95 shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.viewDailyReportBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
            </button>
          </div>

          {/* Right Produce Visual */}
          <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-500/30 shrink-0 bg-emerald-950">
            <img
              src={ASSETS.onionHarvest}
              alt="Harvest produce"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
        </div>

        {/* 4. FOUR QUICK ACTION CARDS (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Action 1: Market Rates */}
          <button
            type="button"
            id="shortcut-market-rates"
            onClick={onNavigateToMarkets}
            className="p-2.5 sm:p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 shadow-xs transition-all flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer active:scale-[0.98] min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] sm:text-xs font-black text-slate-900 block leading-tight truncate">
                {t.marketRatesShortcut}
              </span>
              <span className="text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5 block truncate">
                {t.allApmcsTab}
              </span>
            </div>
          </button>

          {/* Action 2: Compare Markets */}
          <button
            type="button"
            id="shortcut-compare-markets"
            onClick={() => {
              if (onNavigateToCompare) onNavigateToCompare();
            }}
            className="p-2.5 sm:p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 shadow-xs transition-all flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer active:scale-[0.98] min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] sm:text-xs font-black text-slate-900 block leading-tight truncate">
                {t.compareMarketsShortcut}
              </span>
              <span className="text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5 block truncate">
                {t.compareTab}
              </span>
            </div>
          </button>

          {/* Action 3: Profit Calculator */}
          <button
            type="button"
            id="shortcut-profit-calculator"
            onClick={() => {
              if (onNavigateToCalculator) onNavigateToCalculator();
            }}
            className="p-2.5 sm:p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 shadow-xs transition-all flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer active:scale-[0.98] min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] sm:text-xs font-black text-slate-900 block leading-tight truncate">
                {t.profitCalculatorShortcut}
              </span>
              <span className="text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5 block truncate">
                {t.calcModeBuy}
              </span>
            </div>
          </button>

          {/* Action 4: My Watchlist */}
          <button
            type="button"
            id="shortcut-my-watchlist"
            onClick={() => {
              if (onNavigateToWatchlist) onNavigateToWatchlist();
            }}
            className="p-2.5 sm:p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 shadow-xs transition-all flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer active:scale-[0.98] min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] sm:text-xs font-black text-slate-900 block leading-tight truncate">
                {t.myWatchlistShortcut}
              </span>
              <span className="text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5 block truncate">
                {t.myFavoritesTab}
              </span>
            </div>
          </button>
        </div>

        {/* 6. PRIMARY RATE CARD: LOCAL TRADER RATES */}
        <div className="bg-white border-2 border-amber-300/80 rounded-3xl p-4 shadow-sm space-y-3 relative overflow-hidden" id="home-primary-trader-rates-card">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
                <Store className="w-3.5 h-3.5 text-amber-700" />
                {language === 'mr' ? 'व्यापारी नोंद — अधिकृत शासकीय डेटा नव्हे' : 'TRADER REPORTED — NOT OFFICIAL GOVERNMENT DATA'}
              </span>
              <h3 className="text-base font-black text-slate-900 truncate">
                {mandiLabel}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 truncate">
                {displayMandi.district}, {displayMandi.state || 'Maharashtra'} • <strong className="text-amber-950 font-bold">{commodityLabel}</strong>
              </p>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border shrink-0 ${
              matchingTraderReport
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {matchingTraderReport ? (language === 'mr' ? 'व्यापारी नोंद (अपुष्ट)' : 'TRADER REPORTED — NOT OFFICIAL GOVT DATA') : (language === 'mr' ? 'स्थानिक नोंद नाही' : 'NO TRADER DATA')}
            </span>
          </div>

          {/* Policy Disclosure: Trader rates may be unverified */}
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-2.5 text-[10.5px] text-amber-950 flex items-start justify-between gap-2">
            <div className="flex items-start gap-1.5 min-w-0">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-snug">
                {language === 'mr'
                  ? 'व्यापाऱ्यांनी नोंदवलेले दर अपुष्ट असू शकतात. हे अधिकृत सरकारी दर किंवा APMC बेंचमार्क नव्हेत.'
                  : 'Trader-reported rates are crowdsourced and may be unverified. They do not constitute official APMC benchmarks or government data.'}
              </p>
            </div>
            {onOpenDisclaimer && (
              <button
                type="button"
                onClick={onOpenDisclaimer}
                className="text-[10px] font-bold text-amber-900 underline shrink-0 cursor-pointer pt-0.5"
              >
                {language === 'mr' ? 'माहिती' : 'Disclaimer'}
              </button>
            )}
          </div>

          {matchingTraderReport ? (
            /* A. Active Local Trader Rate Display */
            <div className="space-y-2.5">
              {/* Trader details header */}
              <div className="flex items-center justify-between bg-amber-50/70 p-2.5 rounded-2xl border border-amber-200/70 text-xs">
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-slate-900 truncate">
                      {matchingTraderReport.businessName || matchingTraderReport.traderName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-950 text-[9.5px] font-bold shrink-0">
                      {matchingTraderReport.role || 'Trader'}
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-500 block truncate">
                    {matchingTraderReport.marketName || matchingTraderReport.mainAPMC || mandiLabel} • {matchingTraderReport.reportDate || matchingTraderReport.date || 'Today'}
                  </span>
                </div>

                {matchingTraderReport.hasPoster && matchingTraderReport.posterUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePosterReport(matchingTraderReport);
                      setIsPosterModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{language === 'mr' ? 'तक्ता पहा' : 'View Poster'}</span>
                  </button>
                )}
              </div>

              {/* 3 Price Metrics for Local Trader Rates */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {t.minRate}
                  </span>
                  <span className="text-sm font-bold text-slate-700 font-mono">
                    ₹{matchingTraderReport.minPrice?.toLocaleString('en-IN') || '—'}
                  </span>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] font-extrabold text-amber-900 block">
                    {t.modalRate}
                  </span>
                  <span className="text-base font-black text-amber-950 font-mono">
                    ₹{matchingTraderReport.modalPrice?.toLocaleString('en-IN') || '—'}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-medium">
                    /{matchingTraderReport.originalUnit || '100 KG'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {t.maxRate}
                  </span>
                  <span className="text-sm font-bold text-slate-700 font-mono">
                    ₹{matchingTraderReport.maxPrice?.toLocaleString('en-IN') || '—'}
                  </span>
                </div>
              </div>

              {/* Quality rates preview if available */}
              {matchingTraderReport.qualityRates && matchingTraderReport.qualityRates.length > 0 && (
                <div className="space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-100 text-[11px]">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    {language === 'mr' ? 'प्रतवारीनुसार दर (Quality-Wise Rates):' : 'Quality-Wise Breakdown:'}
                  </span>
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-0.5">
                    {matchingTraderReport.qualityRates.slice(0, 3).map((qr) => (
                      <div key={qr.id} className="flex items-center justify-between text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-100">
                        <span className="font-medium truncate pr-1 text-[10.5px]">{qr.quality}</span>
                        <strong className="text-slate-900 font-mono shrink-0 text-[11px]">{qr.rate}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  id="home-view-all-trader-rates-btn"
                  onClick={() => {
                    if (onNavigateToTraderReports) onNavigateToTraderReports();
                  }}
                  className="text-amber-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.localMarketRates} ({language === 'mr' ? 'सर्व पहा' : 'View All'})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {onOpenAddLocalRate && (
                  <button
                    type="button"
                    onClick={onOpenAddLocalRate}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addLocalRateBtn}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* B. No Local Trader Data Safeguard - Never substitute unrelated data */
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{language === 'mr' ? 'स्थानिक व्यापारी दर अद्याप नोंदवलेले नाहीत' : 'No Local Trader Rates Reported Yet'}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {language === 'mr'
                  ? `आज ${mandiLabel} येथे ${commodityLabel} साठी कोणत्याही स्थानिक व्यापाऱ्याने दर नोंदवलेले नाहीत.`
                  : `No verified local trader rates submitted yet for ${commodityLabel} at ${mandiLabel} today.`}
              </p>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {onOpenAddLocalRate && (
                  <button
                    type="button"
                    id="home-report-local-rate-empty-btn"
                    onClick={onOpenAddLocalRate}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addLocalRateBtn}</span>
                  </button>
                )}
                {onNavigateToTraderReports && (
                  <button
                    type="button"
                    onClick={onNavigateToTraderReports}
                    className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-50 cursor-pointer"
                  >
                    {t.localMarketRates}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 7. OFFICIAL APMC REFERENCE DATA (Kept clearly separate as reference data) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3" id="home-official-market-card">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                {language === 'mr' ? 'शासकीय संदर्भ दर • AGMARKNET व data.gov.in' : 'GOVERNMENT APMC REFERENCE DATA • AGMARKNET & data.gov.in'}
              </span>
              <h3 className="text-base font-black text-slate-900 truncate">
                {mandiLabel}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {displayMandi.district}, {displayMandi.state || 'Maharashtra'} • <strong className="text-slate-800">{commodityLabel}</strong>
              </p>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border shrink-0 ${
              isLoadingData
                ? 'bg-slate-100 text-slate-600 border-slate-200'
                : isOfficialDataAvailable
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              {isLoadingData
                ? 'LOADING…'
                : isOfficialDataAvailable
                ? t.statusLiveVerified
                : 'FALLBACK / REFERENCE BASELINE'}
            </span>
          </div>

          <div className="text-[10.5px] text-slate-500 leading-snug bg-slate-50 p-2 rounded-xl border border-slate-100">
            {language === 'mr'
              ? 'संदर्भ माहिती: भारत सरकारच्या AGMARKNET व data.gov.in द्वारे प्राप्त अधिकृत दैनिक लिलाव बुलेटिन.'
              : 'Reference records sourced from AGMARKNET & data.gov.in (Govt. of India daily bulletins).'}
          </div>

          {/* Loading State: Immediate clear of previous stale data */}
          {isLoadingData ? (
            <div className="py-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-100">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-700 mx-auto" />
              <div className="text-xs font-bold text-slate-800">
                Loading {commodityLabel} — {mandiLabel}…
              </div>
              <div className="text-[11px] text-slate-500">
                Connecting to AGMARKNET daily bulletin pipeline…
              </div>
            </div>
          ) : isOfficialDataAvailable ? (
            /* 3 Price Metrics for Verified Official Data */
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-500 font-medium block">
                  {t.minRate}
                </span>
                <span className="text-sm font-bold text-slate-700 font-mono">
                  ₹{currentMarketData.minPrice?.toLocaleString('en-IN') || '—'}
                </span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] font-bold text-emerald-800 block">
                  {t.modalRate}
                </span>
                <span className="text-base font-black text-emerald-900 font-mono">
                  ₹{currentMarketData.modalPrice?.toLocaleString('en-IN') || '—'}
                </span>
                <span className="text-[9px] text-slate-400 block font-medium">
                  /{t.quintalUnit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-medium block">
                  {t.maxRate}
                </span>
                <span className="text-sm font-bold text-slate-700 font-mono">
                  ₹{currentMarketData.maxPrice?.toLocaleString('en-IN') || '—'}
                </span>
              </div>
            </div>
          ) : (
            /* NO VERIFIED DATA TODAY — No APMC substitution */
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>NO VERIFIED DATA TODAY</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                No verified government AGMARKNET market record found for <strong>{commodityLabel}</strong> at <strong>{mandiLabel}</strong> today.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.arrivalDate}: {displayArrivalDate}</span>
            </span>
            <button
              type="button"
              id="home-market-overview-details-btn"
              onClick={onNavigateToDetails}
              className="text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t.viewDetails}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 7. FEEDBACK BANNER */}
        {onOpenFeedbackModal && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <MessageSquarePlus className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {t.feedbackTitle}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {t.helpAndFeedback}
                </span>
              </div>
            </div>
            <button
              type="button"
              id="home-feedback-btn"
              onClick={onOpenFeedbackModal}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 active:scale-95 transition-all cursor-pointer"
            >
              {t.feedbackBtn}
            </button>
          </div>
        )}

        {/* POLICY TRANSPARENCY FOOTER: Data Sources & Disclaimer */}
        <div className="text-center pt-2 pb-6 space-y-1.5" id="home-footer-disclaimer-section">
          {onOpenDisclaimer && (
            <button
              type="button"
              onClick={onOpenDisclaimer}
              id="home-footer-disclaimer-btn"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-800 font-bold underline underline-offset-4 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'mr' ? 'माहिती स्रोत व कायदेशीर अस्वीकरण' : 'Data Sources & Legal Disclaimer'}</span>
            </button>
          )}
          <p className="text-[10px] text-slate-400">
            {language === 'mr'
              ? 'AgriTrade हे स्वतंत्र अ‍ॅप आहे • कोणत्याही सरकारी संस्थेशी संलग्न नाही.'
              : 'AgriTrade is an independent platform • Not affiliated with any government entity.'}
          </p>
        </div>
      </div>

      {/* Poster Modal */}
      <PosterModal
        isOpen={isPosterModalOpen}
        onClose={() => {
          setIsPosterModalOpen(false);
          setActivePosterReport(null);
        }}
        report={activePosterReport}
        language={language}
        onViewTraderProfile={onViewTraderProfile}
      />
    </div>
  );
};
