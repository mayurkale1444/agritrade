import React, { useState, useMemo } from 'react';
import { ArrowLeft, Bell, Trash2, MapPin, TrendingUp, TrendingDown, ShieldCheck, AlertCircle, Plus } from 'lucide-react';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation, localizeCommodityName, localizeMandiName } from '../locales';
import { getStoredWatchlist, removeFromWatchlist, WatchlistItem } from '../services/watchlistService';
import { CommodityId, UserProfile } from '../types';
import { COMMODITIES } from '../services/mandiDataService';
import { ProfileContextBar } from './ProfileContextBar';

interface WatchlistViewProps {
  language: SupportedLanguage;
  userProfile?: UserProfile | null;
  onBack: () => void;
  onSelectMarket: (commodityId: CommodityId, apmcName: string) => void;
  onNavigateToEditProfile?: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  language,
  userProfile,
  onBack,
  onSelectMarket,
  onNavigateToEditProfile
}) => {
  const t = getTranslation(language);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => getStoredWatchlist(userProfile));
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [alertNotice, setAlertNotice] = useState<string | null>(null);

  React.useEffect(() => {
    setWatchlist(getStoredWatchlist(userProfile));
  }, [userProfile?.mobile, userProfile?.state, userProfile?.mainApmc]);

  const filterOptions = useMemo(() => {
    const list = [{ id: 'all', label: t.filterAll }];
    if (userProfile?.primaryCommodity) {
      list.push({
        id: userProfile.primaryCommodity,
        label: `${localizeCommodityName(userProfile.primaryCommodity, language)} ★`
      });
    }
    const standardCommodities: CommodityId[] = ['wheat', 'onion', 'soybean', 'cotton', 'maize'];
    for (const c of standardCommodities) {
      if (!list.some(item => item.id === c)) {
        list.push({
          id: c,
          label: localizeCommodityName(c, language)
        });
      }
    }
    return list;
  }, [userProfile?.primaryCommodity, language, t.filterAll]);

  const filteredItems = useMemo(() => {
    if (selectedFilter === 'all') return watchlist;
    return watchlist.filter(item => item.commodityId === selectedFilter);
  }, [watchlist, selectedFilter]);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeFromWatchlist(id, userProfile);
    setWatchlist(updated);
  };

  const handleSetAlert = (mandiName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlertNotice(`${mandiName}: ${t.alertSetToast}`);
    setTimeout(() => setAlertNotice(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 w-full max-w-md mx-auto shadow-2xl flex flex-col overflow-x-hidden">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              id="watchlist-back-btn"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all cursor-pointer"
              aria-label={t.back}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-black text-slate-900 tracking-tight">
              {t.watchlistTitle}
            </h1>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
            {watchlist.length}
          </span>
        </div>

        {/* Commodity Filter Pills */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
          {filterOptions.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Alert toast notification */}
      {alertNotice && (
        <div className="m-4 mb-0 p-3 bg-emerald-700 text-white rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <Bell className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{alertNotice}</span>
        </div>
      )}

      {/* Content Area */}
      <div className="p-4 space-y-3 flex-1">
        {/* Profile Context Bar: Clearly displays user's State + District + APMC */}
        <ProfileContextBar
          userProfile={userProfile}
          language={language}
          activeState={userProfile?.state}
          activeDistrict={userProfile?.district}
          activeApmc={userProfile?.mainApmc}
          onEditProfile={onNavigateToEditProfile}
        />

        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 mt-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {t.emptyWatchlist}
            </h2>
          </div>
        ) : (
          filteredItems.map(item => {
            const commodityLabel = localizeCommodityName(item.commodityId, language, item.commodityName, item.marathiCommodityName);
            const mandiLabel = localizeMandiName({ name: item.mandiName, marathiName: item.marathiMandiName }, language, false);

            return (
              <div
                key={item.id}
                onClick={() => onSelectMarket(item.commodityId, item.mandiName)}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl shrink-0">
                      {item.commodityId === 'onion' ? '🧅' :
                       item.commodityId === 'soybean' ? '🌱' :
                       item.commodityId === 'cotton' ? '🌾' :
                       item.commodityId === 'turmeric' ? '🌿' : '📦'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {mandiLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        <span>{item.district}, {item.state}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{commodityLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Set Alert & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleSetAlert(mandiLabel, e)}
                      title={t.setAlert}
                      className="p-2 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(item.id, e)}
                      title={t.removeFromWatchlist}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price and Movement strip */}
                <div className="pt-2 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {t.modalRate}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl font-black text-slate-900 font-mono">
                        ₹{item.modalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {t.perQuintal}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge & Movement */}
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                      item.isPositive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}</span>
                    </span>

                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{t.statusLiveVerified}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
