import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  FileText,
  Calculator,
  Share2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ShieldAlert,
  Sprout,
  Scale,
  ExternalLink,
  ZoomIn,
  Plus,
  HelpCircle,
  Tag,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { MarketData, CommodityId, TraderReport, UserProfile, MandiLocation } from '../types';
import { COMMODITIES, ALL_MANDI_LOCATIONS } from '../services/mandiDataService';
import { isMatchingTraderReport } from '../services/traderReportService';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation, localizeCommodityName, localizeMandiName } from '../locales';
import { ASSETS } from '../assets/images';
import { PriceChart } from './PriceChart';
import { PosterModal } from './PosterModal';
import { ProfileContextBar } from './ProfileContextBar';

interface PriceDetailsViewProps {
  data: MarketData;
  isLoading: boolean;
  language: SupportedLanguage;
  selectedCommodityId?: CommodityId;
  selectedVariety?: string;
  selectedGrade?: string;
  traderReports?: TraderReport[];
  userProfile?: UserProfile | null;
  onNavigateToEditProfile?: () => void;
  onBack: () => void;
  onGoToCalculator: () => void;
  onGoToCompare: () => void;
  onGenerateReport: () => void;
  onOpenSourceModal?: () => void;
  onOpenAddLocalRate?: () => void;
  onViewTraderProfile?: (traderId: string) => void;
  onSelectCommodity?: (id: CommodityId) => void;
  onSelectMandi?: (mandi: MandiLocation) => void;
}

export const PriceDetailsView: React.FC<PriceDetailsViewProps> = ({
  data,
  isLoading,
  language,
  selectedCommodityId,
  selectedVariety,
  selectedGrade,
  traderReports = [],
  userProfile,
  onNavigateToEditProfile,
  onBack,
  onGoToCalculator,
  onGoToCompare,
  onGenerateReport,
  onOpenSourceModal,
  onOpenAddLocalRate,
  onViewTraderProfile,
  onSelectCommodity,
  onSelectMandi
}) => {
  const t = getTranslation(language);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '15d' | '30d'>('7d');
  const [selectedPosterReport, setSelectedPosterReport] = useState<TraderReport | null>(null);

  // STRICT COMMODITY RESOLUTION: Ensure user selection is NEVER replaced by Onion
  const effectiveCommodityId = data.commodity?.id || data.commodityId || selectedCommodityId;
  const commodity = data.commodity && data.commodity.id
    ? data.commodity
    : (COMMODITIES.find(c => c.id === effectiveCommodityId) || COMMODITIES[0]);
  const commodityLabel = localizeCommodityName(commodity.id, language, commodity.name, commodity.marathiName);
  const mandiLabel = localizeMandiName(data.mandi, language, true);

  // Strict filtering: Only trader reports matching the EXACT selected APMC + Commodity
  const matchingTraderReports = useMemo(() => {
    return traderReports.filter(tr =>
      isMatchingTraderReport(tr, commodity.id, data.mandi.name, data.mandi.district)
    );
  }, [traderReports, commodity.id, data.mandi.name, data.mandi.district]);

  // Debug logging for destination page
  React.useEffect(() => {
    console.log('[DESTINATION PAGE]', {
      page: 'PriceDetailsView',
      commodity: commodity.id,
      commodityName: commodity.name,
      market: data.mandi?.name,
      district: data.mandi?.district,
      state: data.mandi?.state || 'Maharashtra',
      date: data.arrivalDate || 'Today',
      dataTypeCategory: data.dataTypeCategory,
      modalPrice: data.modalPrice,
      matchingTraderReportsCount: matchingTraderReports.length
    });
  }, [commodity.id, data.mandi?.name, data.arrivalDate, data.dataTypeCategory, data.modalPrice, matchingTraderReports.length]);

  const modalPrice = data.modalPrice || 0;
  const minPrice = data.minPrice || 0;
  const maxPrice = data.maxPrice || 0;

  const isVerified = data.dataTypeCategory === 'LIVE VERIFIED DATA' && modalPrice > 0;

  // Key metrics calculation
  const percentChange = isVerified ? (data.percentageChange ?? null) : null;
  const isTrendUp = isVerified ? ((percentChange ?? 0) >= 0) : null;
  const trendLabel = isVerified ? t.trendLabelActive : t.trendLabelUnavailable;
  const riskLabel = isVerified ? t.riskLabelLow : t.riskLabelUnrecorded;

  const handleShare = async () => {
    const text = `AgriTrade ${commodityLabel} | ${mandiLabel}\nOfficial Modal Rate: ₹${modalPrice.toLocaleString('en-IN')}/qtl\nArrival Date: ${data.arrivalDate || 'Today'}\nhttps://agritrade.app`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `AgriTrade: ${commodityLabel}`, text });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard?.writeText(text);
      alert(t.copiedToClipboard);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 w-full max-w-md mx-auto shadow-2xl flex flex-col font-sans overflow-x-hidden" id="price-details-view">
      {/* 1. TOP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="details-back-btn"
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all cursor-pointer"
              aria-label={t.back}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight leading-tight">
                {mandiLabel}
              </h1>
              <span className="text-[10px] text-slate-500 font-bold">
                {data.mandi.district}, {data.mandi.state || 'Maharashtra'} • {commodityLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenAddLocalRate && (
              <button
                type="button"
                id="details-add-rate-btn"
                onClick={onOpenAddLocalRate}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                title={t.addLocalRateBtn}
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.addRate}</span>
              </button>
            )}
            <button
              type="button"
              id="details-share-btn"
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title={t.share}
              aria-label={t.share}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4 flex-1">
        {/* Profile Context Bar: Clearly displays user's State + District + APMC */}
        <ProfileContextBar
          userProfile={userProfile}
          language={language}
          activeState={data.mandi.state || userProfile?.state}
          activeDistrict={data.mandi.district || userProfile?.district}
          activeApmc={data.mandi.name || userProfile?.mainApmc}
          activeCommodityName={commodityLabel}
          onEditProfile={onNavigateToEditProfile}
        />

        {/* 2. SELECTED APMC CONTEXT & HERO BANNER */}
        <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-emerald-950 relative text-white">
          <div className="relative h-32 w-full">
            <img
              src={ASSETS.mandiYard}
              alt={data.mandi.name}
              className="w-full h-full object-cover opacity-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-transparent" />

            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-900/90 text-emerald-200 border border-emerald-500/50 uppercase tracking-wider">
                {data.mandi.state || 'Maharashtra'}
              </span>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500 text-white shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{t.statusLiveVerified}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-amber-600 text-white shadow-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{t.statusNoVerifiedData}</span>
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-4 right-4 z-10">
              <div className="text-[10px] text-emerald-300 font-extrabold uppercase tracking-wider">
                SELECTED APMC
              </div>
              <h2 className="text-xl font-black text-white leading-tight">
                {mandiLabel}
              </h2>
              <div className="flex items-center gap-2 text-xs text-emerald-200 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{data.mandi.district}, {data.mandi.state || 'Maharashtra'}</span>
                <span>•</span>
                <span className="font-extrabold text-white">{commodityLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🟢 SECTION 1: OFFICIAL APMC MARKET RATE (STRICT GOVERNMENT AGMARKNET DATA) */}
        {/* ========================================================================= */}
        <div className="bg-white border-2 border-emerald-500/40 rounded-3xl p-4 shadow-sm space-y-3" id="official-apmc-market-section">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
              <div>
                <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wider block">
                  🟢 GOVERNMENT APMC REFERENCE RATE
                </span>
                <span className="text-[10px] text-slate-500 font-semibold block">
                  {t.officialSourceLabel}: <strong className="text-emerald-900">AGMARKNET & data.gov.in</strong>
                </span>
              </div>
            </div>

            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold shrink-0 border ${
              isVerified
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              {isVerified ? t.statusLiveVerified : 'UNAVAILABLE TODAY'}
            </span>
          </div>

          {/* Date row */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.arrivalDate}: <strong>{data.arrivalDate || 'Today'}</strong></span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Lot Unit: 100 KG (क्विंटल)
            </span>
          </div>

          {/* 3 Price Columns */}
          {isVerified ? (
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              {/* Min Price */}
              <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                  {t.minPrice}
                </span>
                <div className="text-base font-black text-slate-800 font-mono mt-0.5">
                  ₹{minPrice.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-400 block">
                  ₹{(minPrice / 100).toFixed(1)}/kg
                </span>
              </div>

              {/* Modal Price (Primary Highlight) */}
              <div className="bg-emerald-50 rounded-2xl p-2.5 border-2 border-emerald-400 ring-1 ring-emerald-600/30">
                <span className="text-[10px] font-extrabold text-emerald-900 block uppercase tracking-wider">
                  {t.modalRate}
                </span>
                <div className="text-xl font-black text-emerald-950 font-mono mt-0.5">
                  ₹{modalPrice.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] font-bold text-emerald-800 block">
                  ₹{(modalPrice / 100).toFixed(1)}/kg
                </span>
              </div>

              {/* Max Price */}
              <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                  {t.maxPrice}
                </span>
                <div className="text-base font-black text-slate-800 font-mono mt-0.5">
                  ₹{maxPrice.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-400 block">
                  ₹{(maxPrice / 100).toFixed(1)}/kg
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>OFFICIAL APMC RATE NOT RECORDED TODAY</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                No verified government AGMARKNET auction bulletin published for <strong>{commodityLabel}</strong> at <strong>{mandiLabel}</strong> today.
              </p>
            </div>
          )}

          {/* Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
            <div className="text-center">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">{t.percentChange}</span>
              <div className="flex items-center justify-center gap-0.5 mt-0.5 text-xs font-black">
                {percentChange !== null ? (
                  <>
                    {isTrendUp ? <TrendingUp className="w-3 h-3 text-emerald-700" /> : <TrendingDown className="w-3 h-3 text-rose-700" />}
                    <span className={isTrendUp ? 'text-emerald-700' : 'text-rose-700'}>{percentChange > 0 ? `+${percentChange}%` : `${percentChange}%`}</span>
                  </>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </div>
            </div>

            <div className="text-center border-x border-slate-100">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">{t.marketTrend}</span>
              <span className="text-xs font-extrabold text-emerald-800 block mt-0.5">{trendLabel}</span>
            </div>

            <div className="text-center">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">{t.riskLevel}</span>
              <span className="text-xs font-extrabold text-slate-700 block mt-0.5">{riskLabel}</span>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                {t.priceHistory} (Official Mandi)
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedTimeframe('7d')}
                  className={`px-2 py-0.5 rounded ${selectedTimeframe === '7d' ? 'bg-emerald-700 text-white' : 'text-slate-600'}`}
                >
                  7D
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTimeframe('15d')}
                  className={`px-2 py-0.5 rounded ${selectedTimeframe === '15d' ? 'bg-emerald-700 text-white' : 'text-slate-600'}`}
                >
                  15D
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTimeframe('30d')}
                  className={`px-2 py-0.5 rounded ${selectedTimeframe === '30d' ? 'bg-emerald-700 text-white' : 'text-slate-600'}`}
                >
                  30D
                </button>
              </div>
            </div>

            <PriceChart
              history7d={data.history7d || []}
              history15d={data.history15d || []}
              history30d={data.history30d || []}
              commodityName={commodityLabel}
              mandiName={mandiLabel}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🔵 SECTION 2: LOCAL TRADER REPORTS (QUALITY-WISE RATES + ORIGINAL POSTERS) */}
        {/* ========================================================================= */}
        <div className="bg-white border-2 border-blue-400/40 rounded-3xl p-4 shadow-sm space-y-3.5" id="local-trader-reports-section">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
              <div>
                <span className="text-[11px] font-black text-blue-950 uppercase tracking-wider block">
                  🔵 LOCAL TRADER REPORTS
                </span>
                <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider block">
                  TRADER REPORTED — NOT OFFICIAL GOVERNMENT DATA
                </span>
              </div>
            </div>

            {onOpenAddLocalRate && (
              <button
                type="button"
                id="market-page-add-local-rate-btn"
                onClick={onOpenAddLocalRate}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-black shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addRate}</span>
              </button>
            )}
          </div>

          {/* Strict Separation & Transparency Banner */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-2.5 text-[11px] text-blue-950 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>{t.traderReportedSpotRatesTitle}</strong>{' '}
              {t.traderReportedSpotRatesDesc}
            </div>
          </div>

          {/* List of Matching Trader Reports for this APMC */}
          {matchingTraderReports.length > 0 ? (
            <div className="space-y-4">
              {matchingTraderReports.map((report) => {
                const posterImage = report.posterUrl || report.photoUrl;
                const hasQualityRates = report.qualityRates && report.qualityRates.length > 0;

                return (
                  <div
                    key={report.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    {/* Trader attribution strip */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200/70 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center text-xs font-black shrink-0">
                          {(report.traderName || 'T').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-black text-slate-900">
                              {report.traderName}
                            </span>
                            {report.verificationStatus === 'VERIFIED' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-900 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {report.businessName ? `${report.businessName} • ` : ''}
                            {report.role || 'Trader'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 text-[10px] text-slate-500 font-semibold">
                        <div className="flex items-center gap-1 justify-end">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{report.reportDate || report.date}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[8.5px] font-black bg-blue-100 text-blue-900 inline-block mt-0.5">
                          TRADER REPORTED
                        </span>
                      </div>
                    </div>

                    {/* Original Poster Preview (prominently displayed) */}
                    {posterImage && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold px-0.5">
                          <span className="flex items-center gap-1 text-blue-950 font-black">
                            <FileText className="w-3.5 h-3.5 text-blue-700" />
                            {t.originalRatePoster}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedPosterReport(report)}
                            className="text-xs text-blue-800 hover:text-blue-950 font-bold flex items-center gap-1 cursor-pointer hover:underline"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span>{t.viewFullPoster}</span>
                          </button>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 shadow-inner group">
                          <img
                            src={posterImage}
                            alt="Original Trader Rate Poster"
                            className="w-full max-h-56 object-contain bg-slate-950 p-1"
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedPosterReport(report)}
                            className="absolute bottom-2 right-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-slate-700/80 flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
                          >
                            <ZoomIn className="w-3.5 h-3.5 text-blue-400" />
                            <span>{t.viewFullPoster}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Structured Quality-Wise Rates Table */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-700 font-bold px-0.5">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-emerald-700" />
                          {t.qualityGradeRates}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Unit: {report.originalUnit || '100 KG'}
                        </span>
                      </div>

                      {hasQualityRates ? (
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                          <div className="grid grid-cols-12 bg-slate-100/90 px-3 py-1.5 text-[9.5px] font-black uppercase text-slate-600 tracking-wider">
                            <div className="col-span-7">
                              {t.qualityGradeCol}
                            </div>
                            <div className="col-span-5 text-right">
                              {t.rateCol}
                            </div>
                          </div>

                          <div className="divide-y divide-slate-100 text-xs">
                            {report.qualityRates!.map((qItem, qIdx) => (
                              <div key={qItem.id || qIdx} className="grid grid-cols-12 px-3 py-2 items-center hover:bg-slate-50">
                                <div className="col-span-7 pr-1">
                                  <span className="font-bold text-slate-900 block leading-tight">
                                    {qItem.quality}
                                  </span>
                                  {qItem.sizeDescription && (
                                    <span className="text-[9.5px] text-slate-500 block">
                                      {qItem.sizeDescription}
                                    </span>
                                  )}
                                </div>
                                <div className="col-span-5 text-right">
                                  <span className="font-mono font-black text-xs sm:text-sm text-slate-900 block">
                                    {qItem.rate}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-mono">
                                    /{qItem.unit || report.originalUnit || '100 KG'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block">
                              {report.gradeQuality || report.variety || 'General Lot Rate'}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {t.singleLotReport}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-black text-sm text-slate-900 block">
                              ₹{report.modalPrice ? report.modalPrice.toLocaleString('en-IN') : `${report.minPrice} – ${report.maxPrice}`}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              /{report.originalUnit || '100 KG'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Trader Note */}
                    {(report.note || report.notes) && (
                      <p className="text-[11px] text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200">
                        "{report.note || report.notes}"
                      </p>
                    )}

                    {/* Trader Profile Link */}
                    <div className="pt-1 flex items-center justify-between border-t border-slate-200/60">
                      <span className="text-[10px] text-slate-500 font-medium">
                        {report.marketName || report.apmc}
                      </span>

                      {onViewTraderProfile && (
                        <button
                          type="button"
                          id={`view-trader-profile-${report.id}`}
                          onClick={() => onViewTraderProfile(report.traderId || report.traderName)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>{t.viewProfile}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-800">
                {t.noTraderReportsNotice}
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                {t.traderUploadPrompt}
              </p>
              {onOpenAddLocalRate && (
                <button
                  type="button"
                  onClick={onOpenAddLocalRate}
                  className="mt-1 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.uploadTraderPosterBtn}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 3. AI / MARKET INTELLIGENCE SUMMARY CARD */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
              {t.marketIntelligenceTitle}
            </h3>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed font-medium">
            {t.marketIntelligenceText}
          </p>
        </div>

        {/* 4. ACTION BUTTONS */}
        <div className="space-y-2.5 pt-2">
          {/* Button 1: Profit Calculator */}
          <button
            type="button"
            id="details-goto-calc-btn"
            onClick={onGoToCalculator}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>{t.profitCalculatorShortcut}</span>
          </button>

          {/* Button 2: Compare Markets */}
          <button
            type="button"
            id="details-goto-compare-btn"
            onClick={onGoToCompare}
            className="w-full py-3.5 px-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 active:scale-[0.99] text-slate-900 font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>{t.compareMarketsBtn}</span>
          </button>
        </div>
      </div>

      {/* Full Rate Poster Modal */}
      <PosterModal
        isOpen={Boolean(selectedPosterReport)}
        onClose={() => setSelectedPosterReport(null)}
        report={selectedPosterReport}
        language={language}
        onViewTraderProfile={onViewTraderProfile}
      />
    </div>
  );
};
