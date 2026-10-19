import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  ChevronRight, 
  Search, 
  ArrowLeft, 
  RefreshCw,
  Calendar,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  CommodityId, 
  MandiLocation, 
  AvailableLiveMarket,
  UserProfile
} from '../types';
import { 
  MAHARASHTRA_MANDIS, 
  ALL_MANDI_LOCATIONS,
  COMMODITIES, 
  findLiveMarketRecord,
  normalizeMarketName
} from '../services/mandiDataService';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation, localizeCommodityName, localizeMandiName } from '../locales';
import { getStoredWatchlist, addToWatchlist, removeFromWatchlist } from '../services/watchlistService';
import { ProfileContextBar } from './ProfileContextBar';

interface MarketDirectoryViewProps {
  language: SupportedLanguage;
  selectedCommodityId: CommodityId;
  availableLiveMarkets?: AvailableLiveMarket[];
  isLoading: boolean;
  userProfile?: UserProfile | null;
  onSelectCommodity: (commodityId: CommodityId) => void;
  onSelectMandi: (mandi: MandiLocation) => void;
  onBackToHome: () => void;
  onRefreshData?: () => void;
  onOpenCompare?: () => void;
  onOpenWatchlist?: () => void;
  onNavigateToEditProfile?: () => void;
}

export const MarketDirectoryView: React.FC<MarketDirectoryViewProps> = ({
  language,
  selectedCommodityId,
  availableLiveMarkets = [],
  isLoading,
  userProfile,
  onSelectCommodity,
  onSelectMandi,
  onBackToHome,
  onRefreshData,
  onOpenCompare,
  onOpenWatchlist,
  onNavigateToEditProfile
}) => {
  const t = getTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'favorites' | 'compare'>('all');
  const [watchlist, setWatchlist] = useState(() => getStoredWatchlist(userProfile));
  const [selectedState, setSelectedState] = useState<string>(() => userProfile?.state || 'Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => userProfile?.district || 'ALL');

  // Synchronize state and district when userProfile changes
  React.useEffect(() => {
    if (userProfile?.state) {
      setSelectedState(userProfile.state);
    }
    if (userProfile?.district) {
      setSelectedDistrict(userProfile.district);
    }
    setWatchlist(getStoredWatchlist(userProfile));
  }, [userProfile?.state, userProfile?.district, userProfile?.mobile]);

  const selectedCommodity = useMemo(() => {
    return COMMODITIES.find(c => c.id === selectedCommodityId) || COMMODITIES[0];
  }, [selectedCommodityId]);

  const commodityLabel = localizeCommodityName(selectedCommodity.id, language, selectedCommodity.name, selectedCommodity.marathiName);

  React.useEffect(() => {
    console.log('[DESTINATION PAGE]', {
      page: 'MarketDirectoryView',
      commodity: selectedCommodity.id,
      commodityName: selectedCommodity.name,
      state: selectedState,
      district: selectedDistrict,
      date: 'Today'
    });
  }, [selectedCommodity.id, selectedState, selectedDistrict]);

  // Formatted date string
  const formattedDate = useMemo(() => {
    const d = new Date();
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return d.toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', options);
  }, [language]);

  // Dynamically compute all unique states available from predefined mandis and live reporting feed
  const availableStates = useMemo(() => {
    const set = new Set<string>();
    set.add('ALL');
    ALL_MANDI_LOCATIONS.forEach(m => {
      if (m.state) set.add(m.state.trim());
    });
    availableLiveMarkets.forEach(lm => {
      if (lm.state) set.add(lm.state.trim());
    });
    return Array.from(set).sort((a, b) => {
      if (a === 'ALL') return -1;
      if (b === 'ALL') return 1;
      if (a === 'Maharashtra') return -1;
      if (b === 'Maharashtra') return 1;
      return a.localeCompare(b);
    });
  }, [availableLiveMarkets]);

  // Compute available districts based on selected state
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    set.add('ALL');
    ALL_MANDI_LOCATIONS.forEach(m => {
      if ((selectedState === 'ALL' || m.state === selectedState) && m.district) {
        set.add(m.district.trim());
      }
    });
    availableLiveMarkets.forEach(lm => {
      if ((selectedState === 'ALL' || lm.state === selectedState) && lm.district) {
        set.add(lm.district.trim());
      }
    });
    return Array.from(set).sort((a, b) => (a === 'ALL' ? -1 : b === 'ALL' ? 1 : a.localeCompare(b)));
  }, [selectedState, availableLiveMarkets]);

  // Evaluated mandis across selected state and district
  const evaluatedMarkets = useMemo(() => {
    const pool: MandiLocation[] = ALL_MANDI_LOCATIONS.filter(m => {
      if (selectedState !== 'ALL' && m.state && m.state !== selectedState) return false;
      if (selectedDistrict !== 'ALL' && m.district && m.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
      return true;
    });

    // Add any dynamic live reporting markets not already in pool
    for (const lm of availableLiveMarkets) {
      if (selectedState !== 'ALL' && lm.state && lm.state !== selectedState) continue;
      if (selectedDistrict !== 'ALL' && lm.district && lm.district.toLowerCase() !== selectedDistrict.toLowerCase()) continue;
      const normLm = normalizeMarketName(lm.market);
      const exists = pool.some(m => {
        const normM = normalizeMarketName(m.name);
        return normM === normLm || (normM.length >= 4 && normLm.includes(normM)) || (normLm.length >= 4 && normM.includes(normLm));
      });
      if (!exists) {
        pool.push({
          id: `live-${(lm.state || 'st').toLowerCase()}-${lm.market.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: lm.market.trim(),
          marathiName: lm.market.trim(),
          district: lm.district.trim(),
          state: lm.state.trim(),
          isMajorAPMC: true,
          distanceKm: 0
        });
      }
    }

    // Ensure user profile's main APMC is in the pool if state matches
    if (userProfile?.mainApmc && (selectedState === 'ALL' || (userProfile.state && userProfile.state === selectedState))) {
      const cleanMain = userProfile.mainApmc.toLowerCase().trim();
      const hasMain = pool.some(m => m.name.toLowerCase().includes(cleanMain) || cleanMain.includes(m.name.toLowerCase()));
      if (!hasMain) {
        pool.unshift({
          id: `profile-${cleanMain.replace(/[^a-z0-9]/g, '_')}`,
          name: userProfile.mainApmc,
          marathiName: userProfile.mainApmc,
          district: userProfile.district || (userProfile.state || 'Local District'),
          state: userProfile.state || 'State',
          isMajorAPMC: true,
          distanceKm: 0
        });
      }
    }

    const list = pool.map(mandi => {
      const liveRecord = findLiveMarketRecord(mandi, availableLiveMarkets, selectedCommodityId);
      const isVerified = Boolean(liveRecord && liveRecord.modal_price > 0);
      const isFavorite = watchlist.some(w => w.mandiName.toLowerCase() === mandi.name.toLowerCase() && w.commodityId === selectedCommodityId);

      return {
        mandi,
        liveRecord,
        isVerified,
        isFavorite
      };
    });

    if (userProfile?.mainApmc) {
      const cleanMain = userProfile.mainApmc.toLowerCase().trim();
      list.sort((a, b) => {
        const aMatch = a.mandi.name.toLowerCase().includes(cleanMain) || cleanMain.includes(a.mandi.name.toLowerCase());
        const bMatch = b.mandi.name.toLowerCase().includes(cleanMain) || cleanMain.includes(b.mandi.name.toLowerCase());
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }

    return list;
  }, [availableLiveMarkets, watchlist, selectedCommodityId, selectedState, selectedDistrict, userProfile?.mainApmc]);

  // Filtered by search & tabs
  const filteredMarkets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return evaluatedMarkets.filter(item => {
      if (activeSubTab === 'favorites' && !item.isFavorite) {
        return false;
      }
      if (!q) return true;

      const nameMatch = item.mandi.name.toLowerCase().includes(q);
      const marathiNameMatch = item.mandi.marathiName?.includes(q) || false;
      const distMatch = item.mandi.district.toLowerCase().includes(q);
      const stateMatch = item.mandi.state?.toLowerCase().includes(q) || false;

      return nameMatch || marathiNameMatch || distMatch || stateMatch;
    });
  }, [evaluatedMarkets, searchQuery, activeSubTab]);

  const toggleFavorite = (item: typeof evaluatedMarkets[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.isFavorite) {
      const match = watchlist.find(w => w.mandiName.toLowerCase() === item.mandi.name.toLowerCase() && w.commodityId === selectedCommodityId);
      if (match) {
        const updated = removeFromWatchlist(match.id);
        setWatchlist(updated);
      }
    } else {
      const price = item.liveRecord?.modal_price || 4000;
      const updated = addToWatchlist({
        id: `wl-${item.mandi.id}-${selectedCommodityId}`,
        mandiName: item.mandi.name,
        marathiMandiName: item.mandi.marathiName,
        district: item.mandi.district,
        state: item.mandi.state || 'Maharashtra',
        commodityId: selectedCommodityId,
        commodityName: selectedCommodity.name,
        marathiCommodityName: selectedCommodity.marathiName,
        modalPrice: price,
        minPrice: item.liveRecord?.min_price || Math.round(price * 0.88),
        maxPrice: item.liveRecord?.max_price || Math.round(price * 1.12),
        changePercent: item.isVerified ? -1.2 : 0,
        isPositive: false,
        statusCategory: item.isVerified ? 'LIVE VERIFIED DATA' : 'FALLBACK DATA',
        addedAt: new Date().toISOString()
      });
      setWatchlist(updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 w-full max-w-md mx-auto shadow-2xl flex flex-col font-sans overflow-x-hidden" id="market-directory-view">
      {/* 1. TOP HEADER (Screen 3 Reference) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="market-rates-back-btn"
              onClick={onBackToHome}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all cursor-pointer"
              aria-label={t.back}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-black text-slate-900 tracking-tight">
              {t.marketRatesTitle}
            </h1>
          </div>

          <button
            type="button"
            onClick={onRefreshData}
            disabled={isLoading}
            className="p-2 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
            title={t.refresh}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>

        {/* 2. FILTER ROW: Commodity, State, District, Date (State + District + Commodity + APMC) */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          {/* Commodity Dropdown */}
          <div className="relative">
            <select
              id="rates-commodity-select"
              value={selectedCommodityId}
              onChange={(e) => onSelectCommodity(e.target.value as CommodityId)}
              className="w-full bg-slate-100 border border-slate-200 text-slate-900 font-bold py-1.5 px-2 rounded-xl appearance-none pr-6 truncate focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              {COMMODITIES.map(c => (
                <option key={c.id} value={c.id}>
                  {localizeCommodityName(c.id, language, c.name, c.marathiName)}
                </option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 pointer-events-none">▼</span>
          </div>

          {/* State selector */}
          <div className="relative">
            <select
              id="rates-state-select"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('ALL');
              }}
              className="w-full bg-slate-100 border border-slate-200 text-slate-900 font-bold py-1.5 px-2 rounded-xl appearance-none pr-6 truncate focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              {availableStates.map(st => (
                <option key={st} value={st}>
                  {st === 'ALL' ? (language === 'mr' ? 'सर्व राज्ये (All States)' : 'All States') : st}
                </option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 pointer-events-none">▼</span>
          </div>

          {/* District selector */}
          <div className="relative">
            <select
              id="rates-district-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 text-slate-900 font-bold py-1.5 px-2 rounded-xl appearance-none pr-6 truncate focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              {availableDistricts.map(dist => (
                <option key={dist} value={dist}>
                  {dist === 'ALL' ? (language === 'mr' ? 'सर्व जिल्हे (All Districts)' : 'All Districts') : dist}
                </option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 pointer-events-none">▼</span>
          </div>

          {/* Date pill */}
          <div className="bg-slate-100 border border-slate-200 text-slate-600 font-medium py-1.5 px-2 rounded-xl flex items-center justify-center gap-1 text-[11px] truncate">
            <Calendar className="w-3 h-3 text-emerald-700 shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
        </div>

        {/* 3. SECONDARY TABS: All APMCs | My Favorites | Compare (Screen 3) */}
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            id="tab-all-apmcs"
            onClick={() => setActiveSubTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.allApmcsTab}
          </button>

          <button
            type="button"
            id="tab-my-favorites"
            onClick={() => {
              setActiveSubTab('favorites');
              if (onOpenWatchlist && activeSubTab === 'favorites') {
                onOpenWatchlist();
              }
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'favorites'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.myFavoritesTab}
          </button>

          <button
            type="button"
            id="tab-compare"
            onClick={() => {
              if (onOpenCompare) onOpenCompare();
            }}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer ml-auto"
          >
            {t.compareTab}
          </button>
        </div>
      </header>

      <div className="p-4 space-y-3 flex-1">
        {/* Profile Context Bar: Clearly displays user's State + District + APMC */}
        <ProfileContextBar
          userProfile={userProfile}
          language={language}
          activeState={selectedState !== 'ALL' ? selectedState : userProfile?.state}
          activeDistrict={selectedDistrict !== 'ALL' ? selectedDistrict : userProfile?.district}
          activeApmc={userProfile?.mainApmc}
          activeCommodityName={commodityLabel}
          onEditProfile={onNavigateToEditProfile}
        />

        {/* Search filter input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            id="market-rates-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-600 shadow-xs placeholder:text-slate-400"
          />
        </div>

        {/* Mandis List Cards (Screen 3 layout) */}
        {filteredMarkets.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2 mt-4">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              {t.noMarketsFound}
            </h3>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredMarkets.map((item) => {
              const mandiNameLocalized = localizeMandiName(item.mandi, language, true);
              const modalPrice = item.liveRecord?.modal_price;

              return (
                <div
                  key={item.mandi.id}
                  onClick={() => onSelectMandi(item.mandi)}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                            {mandiNameLocalized}
                          </span>
                          {userProfile?.mainApmc && (
                            item.mandi.name.toLowerCase().includes(userProfile.mainApmc.toLowerCase()) ||
                            userProfile.mainApmc.toLowerCase().includes(item.mandi.name.toLowerCase())
                          ) && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                              ⭐ {language === 'mr' ? 'प्राथमिक बाजार' : 'YOUR PRIMARY APMC'}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          {item.mandi.district}, {item.mandi.state}
                        </span>
                      </div>
                    </div>

                    {/* Bookmark action */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(item, e)}
                      title={item.isFavorite ? t.removeFromWatchlist : t.myFavoritesTab}
                      className={`p-1.5 rounded-xl transition-colors ${
                        item.isFavorite
                          ? 'text-amber-500 bg-amber-50'
                          : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item.isFavorite ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Verification Status & Price Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-end justify-between">
                    {/* Status Badge */}
                    <div>
                      {item.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          <span>{t.statusLiveVerified}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>{t.statusNoVerifiedData}</span>
                        </span>
                      )}
                    </div>

                    {/* Price & Movement */}
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="text-base font-black text-slate-900 font-mono">
                          {modalPrice ? `₹ ${modalPrice.toLocaleString('en-IN')}/qtl` : t.dataUnavailable}
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
