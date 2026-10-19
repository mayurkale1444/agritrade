import React, { useState } from 'react';
import { CommodityId, MandiMarket, AvailableLiveMarket, DataTypeCategory } from '../types';
import { MANDIS, normalizeMarketName, getLiveMandiId, formatINR, findLiveMarketRecord } from '../services/mandiDataService';
import { X, Building2, MapPin, Radio, Check, Search, ArrowRight, ShieldAlert } from 'lucide-react';

interface MarketComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodityId: CommodityId;
  commodityName: string;
  selectedMandiId: string;
  onSelectMandi: (mandiId: string, customMarket?: MandiMarket) => void;
  availableLiveMarkets?: AvailableLiveMarket[];
}

export const MarketComparisonModal: React.FC<MarketComparisonModalProps> = ({
  isOpen,
  onClose,
  commodityId,
  commodityName,
  selectedMandiId,
  onSelectMandi,
  availableLiveMarkets = []
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'live' | 'benchmarks'>('all');

  if (!isOpen) return null;

  const predefinedMandis = MANDIS.filter(m => m.commodityId === commodityId);

  // Combine discovered live markets and predefined mandis into a unified comparison list
  interface CompareItem {
    id: string;
    name: string;
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

  // 2. Add Predefined Benchmarks (matching with live quote if present)
  for (const mandi of predefinedMandis) {
    const liveMatch = findLiveMarketRecord(mandi, availableLiveMarkets);

    const customMarket: MandiMarket | undefined = liveMatch ? {
      id: mandi.id,
      name: liveMatch.market.trim(),
      district: liveMatch.district.trim(),
      state: liveMatch.state.trim(),
      commodityId,
      benchmark: mandi.benchmark,
      arrivalAvgQtl: mandi.arrivalAvgQtl,
      variety: liveMatch.variety?.trim(),
      grade: liveMatch.grade?.trim()
    } : undefined;

    // Only add if not already present from live market list
    if (!seenIds.has(mandi.id)) {
      seenIds.add(mandi.id);
      items.push({
        id: mandi.id,
        name: liveMatch ? liveMatch.market.trim() : mandi.name,
        district: liveMatch ? liveMatch.district.trim() : mandi.district,
        state: liveMatch ? liveMatch.state.trim() : mandi.state,
        isLive: Boolean(liveMatch),
        modalPrice: liveMatch ? liveMatch.modal_price : 0,
        minPrice: liveMatch ? liveMatch.min_price : 0,
        maxPrice: liveMatch ? liveMatch.max_price : 0,
        variety: liveMatch ? (liveMatch.variety?.trim() || 'Local') : 'FAQ / General',
        grade: liveMatch ? (liveMatch.grade?.trim() || 'FAQ') : 'FAQ',
        arrivalDate: liveMatch ? liveMatch.arrival_date : 'No live report',
        benchmark: mandi.benchmark,
        customMarket
      });
    }
  }

  // Filter items
  const filtered = items.filter(item => {
    if (filterMode === 'live' && !item.isLive) return false;
    if (filterMode === 'benchmarks' && !item.benchmark) return false;
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.district.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q) ||
      item.variety.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Mandi Market Comparison
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                  {commodityName}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Compare today’s reporting APMC auction quotes across mandis
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Row */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by market, district, or state..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-800/70 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterMode === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('live')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                filterMode === 'live' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              Live ({items.filter(i => i.isLive).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('benchmarks')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterMode === 'benchmarks' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Benchmarks ({items.filter(i => i.benchmark).length})
            </button>
          </div>
        </div>

        {/* Mandi List Table */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No matching mandis found for "{searchFilter}".
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedMandiId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/70 ring-1 ring-emerald-500/40'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-white">
                        {item.name}
                      </span>
                      {item.isLive ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                          LIVE VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-700/60 text-slate-400 border border-slate-600/40">
                          NO VERIFIED DATA TODAY
                        </span>
                      )}
                      {item.benchmark && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                          Hub
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        {item.district}, {item.state}
                      </span>
                      <span>•</span>
                      <span>Variety: <strong className="text-slate-300">{item.variety}</strong></span>
                      <span>•</span>
                      <span>Grade: <strong className="text-slate-300">{item.grade}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="text-left sm:text-right">
                      {item.isLive ? (
                        <>
                          <div className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">
                            ₹{item.modalPrice.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-400">/qtl</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Range: ₹{item.minPrice} - ₹{item.maxPrice}
                          </div>
                        </>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic">
                          Baseline Reference
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectMandi(item.id, item.customMarket);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-700 hover:bg-emerald-600 text-white hover:text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <span>Select</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-[11px] text-slate-400">
          <span>Rates per Quintal (100 kg) from official AGMARKNET daily bulletin</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
