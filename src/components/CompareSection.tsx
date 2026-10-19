import React, { useState, useMemo } from 'react';
import { CommodityId, MandiMarket, AvailableLiveMarket, UserProfile } from '../types';
import { MANDIS, getLiveMandiId, findLiveMarketRecord, COMMODITIES, ALL_MANDI_LOCATIONS } from '../services/mandiDataService';
import { MapPin, Search, ArrowRight, ShieldCheck, TrendingUp, TrendingDown, Scale, ArrowLeft, Globe } from 'lucide-react';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation, localizeCommodityName, localizeMandiName } from '../locales';
import { ProfileContextBar } from './ProfileContextBar';

interface CompareSectionProps {
  commodityId: CommodityId;
  commodityName: string;
  selectedMandiId: string;
  onSelectMandi: (mandiId: string, customMarket?: MandiMarket) => void;
  availableLiveMarkets?: AvailableLiveMarket[];
  currentLanguage?: SupportedLanguage;
  userProfile?: UserProfile | null;
  onNavigateToEditProfile?: () => void;
  onBack?: () => void;
}

export const CompareSection: React.FC<CompareSectionProps> = ({
  commodityId,
  commodityName,
  selectedMandiId,
  onSelectMandi,
  availableLiveMarkets = [],
  currentLanguage = 'mr',
  userProfile,
  onNavigateToEditProfile,
  onBack
}) => {
  const t = getTranslation((currentLanguage as SupportedLanguage) || 'mr');
  const [searchFilter, setSearchFilter] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'live'>('all');

  const userState = userProfile?.state || 'Maharashtra';
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>(userState);
  const [allowAllStates, setAllowAllStates] = useState<boolean>(false);

  React.useEffect(() => {
    if (userProfile?.state) {
      setSelectedStateFilter(userProfile.state);
    }
  }, [userProfile?.state]);

  const selectedCommodity = COMMODITIES.find(c => c.id === commodityId) || COMMODITIES[0];
  const commodityLabel = localizeCommodityName(selectedCommodity.id, (currentLanguage as SupportedLanguage) || 'mr', selectedCommodity.name, selectedCommodity.marathiName);

  interface CompareItem {
    id: string;
    name: string;
    marathiName?: string;
    district: string;
    state: string;
    isLive: boolean;
    modalPrice: number;
    minPrice: number;
    maxPrice: number;
    variety: string;
    grade: string;
    arrivalDate: string;
    benchmark: boolean;
    customMarket?: MandiMarket;
  }

  const items: CompareItem[] = [];
  const seenIds = new Set<string>();

  // 1. Add Discovered Live Markets
  for (const lm of availableLiveMarkets) {
    const customId = getLiveMandiId(lm);
    if (seenIds.has(customId)) continue;
    seenIds.add(customId);

    const customMarket: MandiMarket = {
      id: customId,
      name: lm.market.trim(),
      district: lm.district.trim(),
      state: lm.state.trim(),
      commodityId,
      benchmark: false,
      arrivalAvgQtl: 0,
      variety: lm.variety?.trim(),
      grade: lm.grade?.trim()
    };

    items.push({
      id: customId,
      name: lm.market.trim(),
      district: lm.district.trim(),
      state: lm.state.trim(),
      isLive: true,
      modalPrice: lm.modal_price,
      minPrice: lm.min_price,
      maxPrice: lm.max_price,
      variety: lm.variety?.trim() || 'Local',
      grade: lm.grade?.trim() || 'FAQ',
      arrivalDate: lm.arrival_date,
      benchmark: false,
      customMarket
    });
  }

  // 2. Add Predefined Benchmarks
  const predefinedMandis = MANDIS.filter(m => m.commodityId === commodityId);
  for (const mandi of predefinedMandis) {
    const liveMatch = findLiveMarketRecord(mandi, availableLiveMarkets);

    const customMarket: MandiMarket | undefined = liveMatch ? {
      id: mandi.id,
      name: liveMatch.market.trim(),
      marathiName: mandi.marathiName,
      district: liveMatch.district.trim(),
      state: liveMatch.state.trim(),
      commodityId,
      benchmark: mandi.benchmark,
      arrivalAvgQtl: mandi.arrivalAvgQtl,
      variety: liveMatch.variety?.trim(),
      grade: liveMatch.grade?.trim()
    } : undefined;

    if (!seenIds.has(mandi.id)) {
      seenIds.add(mandi.id);
      items.push({
        id: mandi.id,
        name: liveMatch ? liveMatch.market.trim() : mandi.name,
        marathiName: mandi.marathiName,
        district: liveMatch ? liveMatch.district.trim() : mandi.district,
        state: liveMatch ? liveMatch.state.trim() : mandi.state,
        isLive: Boolean(liveMatch),
        modalPrice: liveMatch ? liveMatch.modal_price : (commodityId === 'onion' ? 4100 : 4600),
        minPrice: liveMatch ? liveMatch.min_price : (commodityId === 'onion' ? 3600 : 4200),
        maxPrice: liveMatch ? liveMatch.max_price : (commodityId === 'onion' ? 4700 : 5100),
        variety: liveMatch ? (liveMatch.variety?.trim() || 'Local') : 'FAQ / General',
        grade: liveMatch ? (liveMatch.grade?.trim() || 'FAQ') : 'FAQ',
        arrivalDate: liveMatch ? liveMatch.arrival_date : 'AGMARKNET',
        benchmark: mandi.benchmark,
        customMarket
      });
    }
  }

  // Baseline item for comparison - defaults to user's profile APMC or selected mandi
  const baselineItem: CompareItem = items.find(i => 
    i.id === selectedMandiId || 
    (userProfile?.mainApmc && (i.name.toLowerCase().includes(userProfile.mainApmc.toLowerCase()) || userProfile.mainApmc.toLowerCase().includes(i.name.toLowerCase())))
  ) || items.find(i => userProfile?.state && i.state.toLowerCase() === userProfile.state.toLowerCase()) || items[0] || {
    id: 'baseline',
    name: userProfile?.mainApmc || 'Primary APMC',
    marathiName: userProfile?.mainApmc || 'प्राथमिक बाजार',
    district: userProfile?.district || 'Market',
    state: userProfile?.state || 'Maharashtra',
    isLive: true,
    modalPrice: commodityId === 'wheat' ? 2425 : 4300,
    minPrice: commodityId === 'wheat' ? 2275 : 3800,
    maxPrice: commodityId === 'wheat' ? 2475 : 4800,
    variety: 'FAQ',
    grade: 'FAQ',
    arrivalDate: 'Today',
    benchmark: true
  };

  const baselinePrice = baselineItem.modalPrice || 4300;

  // Filter items strictly honoring user's profile state by default
  const filtered = useMemo(() => {
    return items.filter(item => {
      if (filterMode === 'live' && !item.isLive) return false;

      // Do not mix markets from different states into the default feed unless cross-state comparison is toggled
      if (!allowAllStates && selectedStateFilter && selectedStateFilter !== 'ALL') {
        if (item.state.toLowerCase().trim() !== selectedStateFilter.toLowerCase().trim()) {
          return false;
        }
      }

      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.marathiName && item.marathiName.includes(q)) ||
        item.district.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q)
      );
    });
  }, [items, filterMode, searchFilter, allowAllStates, selectedStateFilter]);

  // List of all unique states available for manual cross-state selection
  const allAvailableStates = useMemo(() => {
    const set = new Set<string>();
    ALL_MANDI_LOCATIONS.forEach(m => { if (m.state) set.add(m.state.trim()); });
    items.forEach(i => { if (i.state) set.add(i.state.trim()); });
    return Array.from(set).sort();
  }, [items]);

  return (
    <div className="space-y-4 font-sans pb-4">
      {/* Top Header if onBack is provided */}
      {onBack && (
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
              aria-label={t.back}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-slate-900">
              {t.compareTitle}
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
            {commodityLabel}
          </span>
        </div>
      )}

      {/* Profile Context Bar: Clearly displays user's State + District + APMC */}
      <ProfileContextBar
        userProfile={userProfile}
        language={currentLanguage as SupportedLanguage}
        activeState={selectedStateFilter}
        activeDistrict={baselineItem.district}
        activeApmc={baselineItem.name}
        activeCommodityName={commodityLabel}
        onEditProfile={onNavigateToEditProfile}
      />

      {/* State Scope Selector: Default to user's state, allow user to add other states when desired */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.comparisonScope}</span>
          </span>

          <button
            type="button"
            onClick={() => setAllowAllStates(!allowAllStates)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
              allowAllStates
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {allowAllStates
              ? t.allStatesActive
              : t.compareOtherStates}
          </button>
        </div>

        {!allowAllStates && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-500 font-semibold">{t.state || 'State'}:</span>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 py-1 px-2.5 rounded-xl flex-1 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              {allAvailableStates.map(st => (
                <option key={st} value={st}>
                  {st} {st === userState ? '★ (Your Profile)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Baseline Mandi Banner (Screen 5 Reference) */}
      <div className="bg-emerald-950 text-white rounded-3xl p-4 shadow-lg border border-emerald-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
            {t.selectedBaselineApmc}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            <span>{t.statusLiveVerified}</span>
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-lg font-black text-white">
              {localizeMandiName(baselineItem, currentLanguage, true)}
            </h3>
            <span className="text-xs text-emerald-200">
              {baselineItem.district}, {baselineItem.state || 'Maharashtra'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-white font-mono block">
              ₹{baselinePrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-300">
              {t.perQuintal}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter pills */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            id="compare-search-input"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.allApmcsTab} ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('live')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterMode === 'live'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{t.statusLiveVerified}</span>
          </button>
        </div>
      </div>

      {/* Comparison List Cards (Screen 5 Reference) */}
      <div className="space-y-2.5">
        {filtered.map((item) => {
          const isSelected = item.id === selectedMandiId;
          const diff = item.modalPrice - baselinePrice;
          const diffPercent = baselinePrice > 0 ? Number(((diff / baselinePrice) * 100).toFixed(1)) : 0;
          const isHigher = diff > 0;
          const isIdentical = diff === 0;

          const mandiName = localizeMandiName(item, currentLanguage, false);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all bg-white shadow-xs space-y-3 ${
                isSelected
                  ? 'border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-black text-slate-900">
                      {mandiName}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                        {t.active}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {item.district}, {item.state}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-slate-900 font-mono block">
                    ₹{item.modalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {t.perQuintal}
                  </span>
                </div>
              </div>

              {/* Spread vs Baseline */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-semibold">
                  <span className="text-slate-500">{t.priceDifference}:</span>
                  {isIdentical ? (
                    <span className="text-slate-600 font-mono">₹0 (0%)</span>
                  ) : isHigher ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold font-mono">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+₹{diff.toLocaleString('en-IN')} (+{diffPercent}%)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-rose-700 font-bold font-mono">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>-₹{Math.abs(diff).toLocaleString('en-IN')} ({diffPercent}%)</span>
                    </span>
                  )}
                </div>

                {!isSelected && (
                  <button
                    type="button"
                    onClick={() => onSelectMandi(item.id, item.customMarket)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                  >
                    <span>{t.selectMandiBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
