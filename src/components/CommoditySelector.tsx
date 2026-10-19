import React, { useState, useMemo } from 'react';
import { Commodity, CommodityId } from '../types';
import { COMMODITIES } from '../services/mandiDataService';
import { Search, X, Check, Sparkles, ChevronDown } from 'lucide-react';

interface CommoditySelectorProps {
  selectedId: CommodityId;
  onSelect: (id: CommodityId) => void;
  recentCommodityIds?: CommodityId[];
}

export const CommoditySelector: React.FC<CommoditySelectorProps> = ({
  selectedId,
  onSelect,
  recentCommodityIds = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);

  const selectedCommodity = useMemo(() => {
    return COMMODITIES.find(c => c.id === selectedId) || {
      id: selectedId,
      name: selectedId.charAt(0).toUpperCase() + selectedId.slice(1),
      hindiName: '',
      category: 'Other' as const,
      unit: '₹/quintal',
      standardLotSizeQtl: 50,
      description: 'Selected commodity'
    };
  }, [selectedId]);

  // Search logic matching English, Hindi, Marathi, and phonetic aliases
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return COMMODITIES.filter(c => {
      const matchName = c.name.toLowerCase().includes(q);
      const matchHindi = c.hindiName.toLowerCase().includes(q);
      const matchMarathi = c.marathiName?.toLowerCase().includes(q);
      const matchAliases = c.aliases?.some(alias => alias.toLowerCase().includes(q));
      const matchCategory = c.category.toLowerCase().includes(q);
      return matchName || matchHindi || matchMarathi || matchAliases || matchCategory;
    });
  }, [searchQuery]);

  // Popular quick commodities
  const popularCommodities = useMemo(() => {
    return COMMODITIES.filter(c => c.isPopular);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between">
        <label htmlFor="search-commodity-input" className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Search commodity
        </label>
        <span className="text-[11px] text-emerald-400 font-semibold">
          {selectedCommodity.name} selected
        </span>
      </div>

      {/* Prominent Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id="search-commodity-input"
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpenSuggestions(true);
          }}
          onFocus={() => setIsOpenSuggestions(true)}
          placeholder="Search commodity (e.g. Onion, Kanda, Soybean, Tomato, Wheat)..."
          className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm rounded-xl pl-9.5 pr-8 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setIsOpenSuggestions(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Dropdown Suggestions List */}
        {isOpenSuggestions && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-800/80">
            {searchResults.length > 0 ? (
              searchResults.map((c) => {
                const isSelected = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelect(c.id);
                      setSearchQuery('');
                      setIsOpenSuggestions(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-slate-800/80 transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-950/40 text-emerald-300' : 'text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-white">
                          {c.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({c.hindiName})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {c.category} • {c.unit}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">
                No matching official commodity found for "{searchQuery}".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Commodity Display Pill */}
      <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/90 rounded-xl px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            Selected
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-white">
            {selectedCommodity.name}
          </span>
          {selectedCommodity.hindiName && (
            <span className="text-[11px] text-slate-400">
              ({selectedCommodity.hindiName})
            </span>
          )}
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
          {selectedCommodity.category}
        </span>
      </div>

      {/* Popular Quick Suggestions */}
      <div className="space-y-1.5 pt-0.5">
        <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
          Popular Commodities
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {popularCommodities.map((c) => {
            const isSelected = c.id === selectedId;
            return (
              <button
                key={c.id}
                type="button"
                id={`btn-pop-commodity-${c.id}`}
                onClick={() => {
                  onSelect(c.id);
                  if (searchQuery) setSearchQuery('');
                  setIsOpenSuggestions(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/50'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
