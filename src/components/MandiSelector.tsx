import React, { useState, useEffect, useMemo } from 'react';
import { MandiMarket, CommodityId, AvailableLiveMarket } from '../types';
import { MANDIS, normalizeMarketName, getLiveMandiId } from '../services/mandiDataService';
import { MapPin, Filter, Tag, ArrowUpDown } from 'lucide-react';

interface MandiSelectorProps {
  commodityId: CommodityId;
  selectedMandiId: string;
  onSelectMandi: (mandiId: string, customMarket?: MandiMarket) => void;
  availableLiveMarkets?: AvailableLiveMarket[];
  onOpenCompare?: () => void;
}

export const MandiSelector: React.FC<MandiSelectorProps> = ({
  commodityId,
  selectedMandiId,
  onSelectMandi,
  availableLiveMarkets = [],
  onOpenCompare
}) => {
  const predefinedMandis = useMemo(() => {
    return MANDIS.filter(m => m.commodityId === commodityId);
  }, [commodityId]);

  // Build a unified dictionary of all selectable markets for this commodity
  interface UnifiedMarketItem {
    id: string;
    name: string;
    district: string;
    state: string;
    variety?: string;
    grade?: string;
    isLive: boolean;
    modalPrice?: number;
    arrivalDate?: string;
    benchmark: boolean;
    customMarket?: MandiMarket;
  }

  const allMarketItems: UnifiedMarketItem[] = useMemo(() => {
    const list: UnifiedMarketItem[] = [];
    const seen = new Set<string>();

    // Add Discovered Live Markets
    for (const lm of availableLiveMarkets) {
      const customId = getLiveMandiId(lm);
      if (seen.has(customId)) continue;
      seen.add(customId);

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

      list.push({
        id: customId,
        name: lm.market.trim(),
        district: lm.district.trim(),
        state: lm.state.trim(),
        variety: lm.variety?.trim(),
        grade: lm.grade?.trim(),
        isLive: true,
        modalPrice: lm.modal_price,
        arrivalDate: lm.arrival_date,
        benchmark: false,
        customMarket
      });
    }

    // Add Predefined Mandis
    for (const m of predefinedMandis) {
      const normM = normalizeMarketName(m.name);
      const liveMatch = availableLiveMarkets.find(lm => {
        const normLm = normalizeMarketName(lm.market);
        return normLm === normM || (normM.length >= 4 && normLm.includes(normM)) || (normLm.length >= 4 && normM.includes(normLm));
      });

      const customMarket: MandiMarket | undefined = liveMatch ? {
        id: m.id,
        name: liveMatch.market.trim(),
        district: liveMatch.district.trim(),
        state: liveMatch.state.trim(),
        commodityId,
        benchmark: m.benchmark,
        arrivalAvgQtl: m.arrivalAvgQtl,
        variety: liveMatch.variety?.trim(),
        grade: liveMatch.grade?.trim()
      } : undefined;

      if (!seen.has(m.id)) {
        seen.add(m.id);
        list.push({
          id: m.id,
          name: liveMatch ? liveMatch.market.trim() : m.name,
          district: liveMatch ? liveMatch.district.trim() : m.district,
          state: liveMatch ? liveMatch.state.trim() : m.state,
          variety: liveMatch ? liveMatch.variety?.trim() : m.variety,
          grade: liveMatch ? liveMatch.grade?.trim() : m.grade,
          isLive: Boolean(liveMatch),
          modalPrice: liveMatch?.modal_price,
          arrivalDate: liveMatch?.arrival_date,
          benchmark: m.benchmark,
          customMarket
        });
      }
    }

    return list;
  }, [availableLiveMarkets, predefinedMandis, commodityId]);

  // Find currently active item
  const currentItem = useMemo(() => {
    return allMarketItems.find(item => item.id === selectedMandiId) || allMarketItems[0];
  }, [allMarketItems, selectedMandiId]);

  // Hierarchical states
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  // Keep state and district in sync when selectedMandiId changes externally
  useEffect(() => {
    if (currentItem) {
      setSelectedState(currentItem.state);
      setSelectedDistrict(currentItem.district);
    }
  }, [currentItem?.id]);

  // Extract unique states
  const availableStates = useMemo(() => {
    const states = Array.from(new Set(allMarketItems.map(i => i.state))).filter(Boolean).sort();
    return states;
  }, [allMarketItems]);

  // Extract districts based on state selection
  const availableDistricts = useMemo(() => {
    const filtered = selectedState === 'ALL'
      ? allMarketItems
      : allMarketItems.filter(i => i.state === selectedState);
    return Array.from(new Set(filtered.map(i => i.district))).filter(Boolean).sort();
  }, [allMarketItems, selectedState]);

  // Extract markets based on state and district
  const filteredMarkets = useMemo(() => {
    return allMarketItems.filter(i => {
      if (selectedState !== 'ALL' && i.state !== selectedState) return false;
      if (selectedDistrict !== 'ALL' && i.district !== selectedDistrict) return false;
      return true;
    });
  }, [allMarketItems, selectedState, selectedDistrict]);

  // Extract available varieties for the selected market from official feed
  const marketVarieties = useMemo(() => {
    if (!currentItem) return [];
    const normName = normalizeMarketName(currentItem.name);
    const matches = availableLiveMarkets.filter(lm => {
      const normLm = normalizeMarketName(lm.market);
      return normLm === normName || (normName.length >= 4 && normLm.includes(normName)) || (normLm.length >= 4 && normName.includes(normLm));
    });
    const vars = Array.from(new Set(matches.map(m => m.variety?.trim()).filter(Boolean))) as string[];
    return vars;
  }, [currentItem, availableLiveMarkets]);

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    if (newState !== 'ALL') {
      const marketsInState = allMarketItems.filter(i => i.state === newState);
      const firstDistrict = marketsInState[0]?.district || 'ALL';
      setSelectedDistrict(firstDistrict);
      const firstInState = marketsInState[0];
      if (firstInState && firstInState.id !== selectedMandiId) {
        onSelectMandi(firstInState.id, firstInState.customMarket);
      }
    } else {
      setSelectedDistrict('ALL');
    }
  };

  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    if (newDistrict !== 'ALL') {
      const firstInDist = allMarketItems.find(i => 
        (selectedState === 'ALL' || i.state === selectedState) && i.district === newDistrict
      );
      if (firstInDist && firstInDist.id !== selectedMandiId) {
        onSelectMandi(firstInDist.id, firstInDist.customMarket);
      }
    }
  };

  const handleMarketChange = (newMandiId: string) => {
    const item = allMarketItems.find(i => i.id === newMandiId);
    if (item) {
      onSelectMandi(item.id, item.customMarket);
    }
  };

  const handleVarietyChange = (newVariety: string) => {
    if (!currentItem) return;
    const normName = normalizeMarketName(currentItem.name);
    const liveMatch = availableLiveMarkets.find(lm => {
      const normLm = normalizeMarketName(lm.market);
      return (normLm === normName || (normName.length >= 4 && normLm.includes(normName))) &&
        lm.variety?.trim() === newVariety;
    });

    if (liveMatch) {
      const customId = getLiveMandiId(liveMatch);
      const customMarket: MandiMarket = {
        id: customId,
        name: liveMatch.market.trim(),
        district: liveMatch.district.trim(),
        state: liveMatch.state.trim(),
        commodityId,
        benchmark: currentItem.benchmark,
        arrivalAvgQtl: 0,
        variety: liveMatch.variety?.trim(),
        grade: liveMatch.grade?.trim()
      };
      onSelectMandi(customId, customMarket);
    }
  };

  return (
    <div className="space-y-4">
      {/* HIERARCHICAL LOCATION SELECTORS: State -> District -> Market -> Variety */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select Mandi by Location</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {allMarketItems.length} mandis available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {/* A. State Selector */}
          <div className="space-y-1">
            <label htmlFor="state-selector" className="text-[11px] font-semibold text-slate-400 block">
              1. State
            </label>
            <select
              id="state-selector"
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All States ({availableStates.length})</option>
              {availableStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* B. District Selector */}
          <div className="space-y-1">
            <label htmlFor="district-selector" className="text-[11px] font-semibold text-slate-400 block">
              2. District
            </label>
            <select
              id="district-selector"
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Districts ({availableDistricts.length})</option>
              {availableDistricts.map(dt => (
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>
          </div>

          {/* C. Market Selector */}
          <div className="space-y-1">
            <label htmlFor="market-selector" className="text-[11px] font-semibold text-slate-400 block">
              3. Mandi Market
            </label>
            <select
              id="market-selector"
              value={selectedMandiId}
              onChange={(e) => handleMarketChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer font-medium"
            >
              {filteredMarkets.map(m => (
                <option key={m.id} value={m.id}>
                  {m.isLive ? '🟢 [LIVE] ' : '⚪ '}
                  {m.name} ({m.district})
                  {m.benchmark ? ' ★ Hub' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* D. Variety Selector - DISPLAYED ONLY WHEN SUPPORTED BY AN ACTUAL OFFICIAL RECORD */}
          {marketVarieties.length > 0 && (
            <div className="space-y-1 sm:col-span-3 lg:col-span-1">
              <label htmlFor="variety-selector" className="text-[11px] font-semibold text-emerald-400 block flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>4. Official Variety</span>
              </label>
              <select
                id="variety-selector"
                value={currentItem?.variety || marketVarieties[0]}
                onChange={(e) => handleVarietyChange(e.target.value)}
                className="w-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer font-medium"
              >
                {marketVarieties.map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected Mandi Summary & Compare Markets link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Active Mandi: <strong className="text-white">{currentItem ? `${currentItem.name} (${currentItem.district}, ${currentItem.state})` : 'Selected Market'}</strong>
            </span>
          </div>
          {onOpenCompare && (
            <button
              type="button"
              id="btn-mandi-selector-compare"
              onClick={onOpenCompare}
              className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto transition-colors"
            >
              <ArrowUpDown className="w-3 h-3" />
              <span>Compare other reporting markets →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
