import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  FileText,
  Calendar,
  ArrowLeft,
  Search,
  User,
  ExternalLink,
  Edit3,
  Filter,
  HelpCircle,
  Plus
} from 'lucide-react';
import { 
  CommodityId, 
  TraderReport, 
  UserProfile 
} from '../types';
import { COMMODITIES } from '../services/mandiDataService';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation } from '../locales';
import { ProfileContextBar } from './ProfileContextBar';

interface TraderReportsViewProps {
  language: SupportedLanguage;
  userProfile?: UserProfile | null;
  reports: TraderReport[];
  onRefreshReports: () => void;
  onBack: () => void;
  onOpenAddLocalRate?: () => void;
  onViewTraderProfile?: (traderId: string) => void;
  onEditReport?: (report: TraderReport) => void;
  onNavigateToEditProfile?: () => void;
}

export const TraderReportsView: React.FC<TraderReportsViewProps> = ({
  language,
  userProfile,
  reports,
  onRefreshReports,
  onBack,
  onOpenAddLocalRate,
  onViewTraderProfile,
  onEditReport,
  onNavigateToEditProfile
}) => {
  const t = getTranslation(language);

  const [searchMarket, setSearchMarket] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState<string>(() => userProfile?.primaryCommodity || 'ALL');
  const [selectedState, setSelectedState] = useState<string>(() => userProfile?.state || 'ALL');

  React.useEffect(() => {
    if (userProfile?.state) {
      setSelectedState(userProfile.state);
    }
    if (userProfile?.primaryCommodity) {
      setSelectedCommodity(userProfile.primaryCommodity);
    }
  }, [userProfile?.state, userProfile?.primaryCommodity]);

  const availableStates = useMemo(() => {
    const set = new Set<string>();
    set.add('ALL');
    reports.forEach(r => {
      if (r.state) set.add(r.state.trim());
    });
    return Array.from(set);
  }, [reports]);

  // Filter reports strictly honoring user profile state by default
  const filteredReports = useMemo(() => {
    const list = reports.filter(r => {
      // State isolation: If not searching and not set to ALL, isolate to selected state
      if (selectedState !== 'ALL' && !searchMarket.trim()) {
        const rState = (r.state || '').toLowerCase().trim();
        const targetState = selectedState.toLowerCase().trim();
        if (rState !== targetState && !rState.includes(targetState)) {
          return false;
        }
      }

      // Market search
      const marketMatch = !searchMarket.trim() || 
        (r.marketName && r.marketName.toLowerCase().includes(searchMarket.toLowerCase())) ||
        (r.apmc && r.apmc.toLowerCase().includes(searchMarket.toLowerCase())) ||
        (r.district && r.district.toLowerCase().includes(searchMarket.toLowerCase())) ||
        (r.state && r.state.toLowerCase().includes(searchMarket.toLowerCase()));

      // Commodity filter
      const commMatch = selectedCommodity === 'ALL' ||
        (r.commodityId && r.commodityId === selectedCommodity) ||
        (r.commodity && r.commodity.toLowerCase() === selectedCommodity.toLowerCase());

      return marketMatch && commMatch;
    });

    // Prioritize user's State and APMC at the top
    if (userProfile?.mainApmc || userProfile?.district || userProfile?.state) {
      const cleanMain = (userProfile.mainApmc || '').toLowerCase().trim();
      const cleanState = (userProfile.state || '').toLowerCase().trim();
      const cleanDist = (userProfile.district || '').toLowerCase().trim();

      list.sort((a, b) => {
        const aMkt = (a.marketName || a.mainAPMC || a.apmc || '').toLowerCase();
        const bMkt = (b.marketName || b.mainAPMC || b.apmc || '').toLowerCase();
        const aDist = (a.district || '').toLowerCase();
        const bDist = (b.district || '').toLowerCase();
        const aState = (a.state || '').toLowerCase();
        const bState = (b.state || '').toLowerCase();

        // 1. Direct APMC match
        const aApmcMatch = cleanMain && (aMkt.includes(cleanMain) || cleanMain.includes(aMkt));
        const bApmcMatch = cleanMain && (bMkt.includes(cleanMain) || cleanMain.includes(bMkt));
        if (aApmcMatch && !bApmcMatch) return -1;
        if (!aApmcMatch && bApmcMatch) return 1;

        // 2. District match
        const aDistMatch = cleanDist && (aDist.includes(cleanDist) || cleanDist.includes(aDist));
        const bDistMatch = cleanDist && (bDist.includes(cleanDist) || cleanDist.includes(bDist));
        if (aDistMatch && !bDistMatch) return -1;
        if (!aDistMatch && bDistMatch) return 1;

        // 3. State match
        const aStateMatch = cleanState && aState === cleanState;
        const bStateMatch = cleanState && bState === cleanState;
        if (aStateMatch && !bStateMatch) return -1;
        if (!aStateMatch && bStateMatch) return 1;

        return 0;
      });
    }

    return list;
  }, [reports, searchMarket, selectedCommodity, selectedState, userProfile?.mainApmc, userProfile?.district, userProfile?.state]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 w-full max-w-md mx-auto shadow-2xl flex flex-col font-sans overflow-x-hidden" id="trader-reports-view">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="trader-reports-back-btn"
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all cursor-pointer"
              aria-label={t.back}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-black text-slate-900 tracking-tight">
                  {t.localMarketRates}
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                  LOCAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t.localMarketRatesDesc}
              </p>
            </div>
          </div>

          {onOpenAddLocalRate && (
            <button
              type="button"
              id="add-local-rate-header-btn"
              onClick={onOpenAddLocalRate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addLocalRateBtn}</span>
            </button>
          )}
        </div>
      </header>

      <div className="p-4 space-y-3.5 flex-1">
        {/* Profile Context Bar: Clearly displays user's State + District + APMC */}
        <ProfileContextBar
          userProfile={userProfile}
          language={language}
          activeState={userProfile?.state}
          activeDistrict={userProfile?.district}
          activeApmc={userProfile?.mainApmc}
          activeCommodityName={selectedCommodity !== 'ALL' ? selectedCommodity : undefined}
          onEditProfile={onNavigateToEditProfile}
        />

        {/* Strict Distinction Rule Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 space-y-1 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-black text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{t.traderReportedLocalMarket}</span>
          </div>
          <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
            {language === 'mr'
              ? 'हे दर स्थानिक बाजारातील नोंदणीकृत व्यापाऱ्यांनी स्वतःच्या फलकावरून नोंदवलेले असून ते अपुष्ट असू शकतात. हे दर अधिकृत सरकारी आकडेवारी किंवा APMC बेंचमार्क नव्हेत. अधिकृत शासकीय AGMARKNET डेटा स्वतंत्रपणे दर्शविला जातो.'
              : 'These rates are reported directly by registered traders in local markets and may be unverified. They do not represent official government statistics or APMC benchmark rates. Official Government AGMARKNET data is kept strictly separate.'}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          {/* Market Search */}
          <div className="relative">
            <input
              type="text"
              id="search-local-markets-input"
              value={searchMarket}
              onChange={(e) => setSearchMarket(e.target.value)}
              placeholder={t.searchByMarket}
              className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchMarket && (
              <button
                type="button"
                onClick={() => setSearchMarket('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Commodity Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCommodity('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCommodity === 'ALL'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.allCommodities}
            </button>
            {COMMODITIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCommodity(c.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCommodity === c.id
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {language === 'mr' ? (c.marathiName || c.name) : c.name}
              </button>
            ))}
          </div>

          {/* State Scope Chips: Isolates to user profile state by default */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-100 scrollbar-none text-[11px]">
            <span className="text-slate-400 font-bold shrink-0">
              {language === 'mr' ? 'राज्य:' : 'State:'}
            </span>
            {availableStates.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedState(st)}
                className={`px-2 py-0.5 rounded-md font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedState === st
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? (language === 'mr' ? 'सर्व राज्ये' : 'All States') : st}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header with Count */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            {filteredReports.length} {language === 'mr' ? 'स्थानिक अहवाल' : 'Local Reports'}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {t.ratesDisclaimer}
          </span>
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {t.emptyTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                {language === 'mr' 
                  ? 'या निकषांसाठी कोणताही स्थानिक अहवाल आढळला नाही.' 
                  : 'No local trader reports found matching your criteria.'}
              </p>
            </div>
            {onOpenAddLocalRate && (
              <button
                type="button"
                onClick={onOpenAddLocalRate}
                className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addLocalRateBtn}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredReports.map((item) => {
              const isCurrentUserReport = userProfile?.id && item.traderId === userProfile.id;
              const isVerifiedTrader = item.verificationStatus === 'VERIFIED';

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3"
                >
                  {/* Card Header: Badge & Date */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300">
                        {t.traderReportedLocalMarket}
                      </span>
                      {isVerifiedTrader && (
                        <span className="ml-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-900">
                          {t.verifiedTrader}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.reportDate || item.date}</span>
                    </div>
                  </div>

                  {/* Commodity & Market Details */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-slate-900">
                          {item.commodity || item.commodityName}
                        </span>
                        {(item.variety || item.gradeQuality) && (
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                            {item.variety || item.gradeQuality}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {item.marketName || item.apmc}, {item.district} ({item.state || 'Maharashtra'})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Banner */}
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-900 font-extrabold uppercase block tracking-wide">
                        {t.modalAuctionPrice} (₹/qtl)
                      </span>
                      <span className="text-base font-black text-slate-900">
                        ₹{item.minPrice.toLocaleString('en-IN')} – ₹{item.maxPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {item.modalPrice ? (
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-800 font-extrabold uppercase block">
                          {t.modalPriceShort}
                        </span>
                        <span className="text-base font-black text-emerald-800">
                          ₹{item.modalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Optional Short Note */}
                  {(item.note || item.notes) && (
                    <p className="text-xs text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                      "{item.note || item.notes}"
                    </p>
                  )}

                  {/* Optional Photo Preview */}
                  {item.photoUrl && (
                    <div>
                      <img
                        src={item.photoUrl}
                        alt="Local Rate Poster"
                        className="max-h-48 w-full object-cover rounded-xl border border-slate-200"
                      />
                    </div>
                  )}

                  {/* Trader Attribution & Profile Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black">
                        {(item.traderName || item.submittedBy?.name || 'T').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block leading-tight">
                          {item.traderName || item.submittedBy?.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold block">
                          {item.businessName ? `${item.businessName} • ` : ''}
                          {item.role || item.submittedBy?.userType || 'Trader'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCurrentUserReport && onEditReport && (
                        <button
                          type="button"
                          onClick={() => onEditReport(item)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{t.editRate}</span>
                        </button>
                      )}

                      {onViewTraderProfile && (
                        <button
                          type="button"
                          onClick={() => onViewTraderProfile(item.traderId || item.traderName || item.submittedBy?.name || '')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>{t.viewProfile}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Disclaimer strip */}
                  <div className="text-[10px] text-slate-400 font-medium italic flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 shrink-0" />
                    <span>{t.ratesDisclaimer}</span>
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
