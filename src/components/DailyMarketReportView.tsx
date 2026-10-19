import React, { useState, useCallback, useMemo } from 'react';
import {
  FileText,
  Calendar,
  Layers,
  MapPin,
  Check,
  Download,
  AlertCircle,
  Radio,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Info,
  CheckCircle2,
  Store,
  Share2,
  Copy
} from 'lucide-react';
import { CommodityId, UserProfile } from '../types';
import { COMMODITIES, MAHARASHTRA_MANDIS, ALL_MANDI_LOCATIONS, cleanMandiString, findMandiForProfile } from '../services/mandiDataService';
import {
  DailyReportConfig,
  DailyMarketReport,
  generateDailyMarketReport,
  normalizeReportDate,
  dmyToIsoDate,
  formatReportPrice,
  formatDailyReportText
} from '../services/dailyReportService';
import { getStoredTraderReports } from '../services/traderReportService';
import { SupportedLanguage } from '../services/i18nService';
import { getTranslation, localizeCommodityName, localizeMandiName, localizeVarietyName } from '../locales';
import { jsPDF } from 'jspdf';
import { sanitizePdfText } from '../services/pdfReportGenerator';
import { ProfileContextBar } from './ProfileContextBar';

interface DailyMarketReportViewProps {
  initialCommodityId?: CommodityId;
  initialMandiId?: string;
  language: SupportedLanguage;
  userProfile?: UserProfile | null;
  onNavigateToEditProfile?: () => void;
  onBack: () => void;
}

export const DailyMarketReportView: React.FC<DailyMarketReportViewProps> = ({
  initialCommodityId,
  initialMandiId,
  language,
  userProfile,
  onNavigateToEditProfile,
  onBack
}) => {
  const t = getTranslation(language);

  // Configuration state - Strictly SINGLE-SELECT for commodity and market
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });

  // Automatically use user's profile: State -> District -> Primary APMC -> Primary Commodity
  const resolvedProfileMandi = useMemo(() => {
    if (userProfile?.mainApmc) {
      return findMandiForProfile(userProfile);
    }
    const found = ALL_MANDI_LOCATIONS.find(m => m.id === initialMandiId);
    return found || ALL_MANDI_LOCATIONS[0];
  }, [userProfile, initialMandiId]);

  const resolvedInitialCmd: CommodityId = userProfile?.primaryCommodity || initialCommodityId || 'onion';
  const resolvedInitialMandiId = resolvedProfileMandi.id;

  const [selectedCommodityId, setSelectedCommodityId] = useState<CommodityId>(resolvedInitialCmd);
  const [selectedMarketId, setSelectedMarketId] = useState<string>(resolvedInitialMandiId);
  const [includeComparison, setIncludeComparison] = useState<boolean>(true);
  const [allowAllStates, setAllowAllStates] = useState<boolean>(false);
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>(userProfile?.state || resolvedProfileMandi.state || 'Maharashtra');
  const [commoditySearchQuery, setCommoditySearchQuery] = useState<string>('');
  const [mandiSearchQuery, setMandiSearchQuery] = useState<string>('');

  React.useEffect(() => {
    if (userProfile?.primaryCommodity) {
      setSelectedCommodityId(userProfile.primaryCommodity);
    }
    if (userProfile?.state) {
      setSelectedStateFilter(userProfile.state);
    }
    if (userProfile?.mainApmc) {
      const pm = findMandiForProfile(userProfile);
      setSelectedMarketId(pm.id);
    }
  }, [userProfile?.primaryCommodity, userProfile?.state, userProfile?.mainApmc]);

  // Execution & result state
  const [report, setReport] = useState<DailyMarketReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Quick preset dates - clears old report when changed
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    // Requirement 6: Clear old report and reset download state when date changes
    setReport(null);
    setDownloadSuccess(false);
    setError(null);
  };

  const handleSetToday = () => {
    const now = new Date();
    handleDateChange(now.toISOString().split('T')[0]);
  };

  const handleSetYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    handleDateChange(yesterday.toISOString().split('T')[0]);
  };

  // Requirement 4, 5, 6: Single-select commodity. Old report must be removed immediately!
  const handleSelectCommodity = (id: CommodityId) => {
    if (id === selectedCommodityId && report !== null) return;
    console.log('[DAILY REPORT SELECTION] Commodity changed to:', id);
    setSelectedCommodityId(id);
    // Requirement 6: Clear old report and reset download state immediately
    setReport(null);
    setDownloadSuccess(false);
    setError(null);
  };

  // Single-select APMC Mandi. Old report must be removed immediately!
  const handleSelectMarket = (id: string) => {
    if (id === selectedMarketId && report !== null) return;
    console.log('[DAILY REPORT SELECTION] Market changed to:', id);
    setSelectedMarketId(id);
    // Requirement 6: Clear old report and reset download state immediately
    setReport(null);
    setDownloadSuccess(false);
    setError(null);
  };

  // Comparison toggle
  const handleToggleComparison = (checked: boolean) => {
    setIncludeComparison(checked);
    setReport(null);
    setDownloadSuccess(false);
  };

  // Filtered mandis for search - honoring user's profile state by default
  const allMandisCombined = useMemo(() => {
    return ALL_MANDI_LOCATIONS;
  }, []);

  const filteredCommodities = useMemo(() => {
    if (!commoditySearchQuery.trim()) return COMMODITIES;
    const q = commoditySearchQuery.toLowerCase().trim();
    return COMMODITIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.marathiName && c.marathiName.toLowerCase().includes(q)) ||
      c.hindiName.toLowerCase().includes(q) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      c.aliases?.some(a => a.toLowerCase().includes(q))
    );
  }, [commoditySearchQuery]);

  const availableStates = useMemo(() => {
    const set = new Set<string>();
    ALL_MANDI_LOCATIONS.forEach(m => { if (m.state) set.add(m.state.trim()); });
    return Array.from(set).sort();
  }, []);

  const filteredMandis = useMemo(() => {
    let pool = allMandisCombined;
    if (!allowAllStates && selectedStateFilter && selectedStateFilter !== 'ALL') {
      pool = pool.filter(m => (m.state || '').toLowerCase().trim() === selectedStateFilter.toLowerCase().trim());
    }

    if (!mandiSearchQuery.trim()) return pool;
    const q = mandiSearchQuery.toLowerCase().trim();
    return pool.filter(m =>
      m.name.toLowerCase().includes(q) ||
      (m.marathiName && m.marathiName.toLowerCase().includes(q)) ||
      m.district.toLowerCase().includes(q) ||
      (m.state && m.state.toLowerCase().includes(q))
    );
  }, [allMandisCombined, allowAllStates, selectedStateFilter, mandiSearchQuery]);

  // Requirement 8: Retrieve matching trader-reported local market rates for current selection
  const matchingTraderReports = useMemo(() => {
    if (!report) return [];
    const allReports = getStoredTraderReports();
    const mandiObj = ALL_MANDI_LOCATIONS.find(m => m.id === selectedMarketId) || MAHARASHTRA_MANDIS.find(m => m.id === selectedMarketId);
    if (!mandiObj) return [];

    return allReports.filter(tr => {
      // 1. Strict commodity matching
      const trCmd = (tr.commodityId || tr.commodity || '').toLowerCase();
      const isCmdMatch = trCmd.includes(selectedCommodityId) ||
        (selectedCommodityId === 'soybean' && trCmd.includes('soy'));
      if (!isCmdMatch) return false;

      // 2. Market or district matching
      const trMarket = cleanMandiString(tr.marketName || tr.mainAPMC || tr.apmc || '');
      const trDistrict = (tr.district || '').toLowerCase();
      const targetName = cleanMandiString(mandiObj.name);
      const targetDist = mandiObj.district.toLowerCase();

      const matchesMarket = trMarket.includes(targetName) || targetName.includes(trMarket);
      const matchesDistrict = trDistrict === targetDist || trDistrict.includes(targetDist);

      return matchesMarket || matchesDistrict;
    });
  }, [report, selectedCommodityId, selectedMarketId]);

  // Requirement 2: Generate the report for the CURRENT single-select selection
  const handleGenerateReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDownloadSuccess(false);
    try {
      // Format the date to DD/MM/YYYY
      const [year, month, day] = selectedDate.split('-');
      const formattedDate = `${day}/${month}/${year}`;

      console.log('[DAILY REPORT GENERATE]', {
        commodity: selectedCommodityId,
        market: selectedMarketId,
        date: formattedDate,
        includeComparison
      });

      const generated = await generateDailyMarketReport({
        date: formattedDate,
        commodityIds: [selectedCommodityId],
        marketIds: [selectedMarketId],
        includeComparison,
        allowCrossStateComparison: allowAllStates,
        userProfile: userProfile || undefined
      });

      console.log('[DAILY REPORT GENERATED]', {
        title: generated.reportTitle,
        status: generated.overallStatus,
        marketCount: generated.selectedMarkets.length,
        primaryCommodity: generated.selectedMarkets[0]?.commodityName
      });

      setReport(generated);
    } catch (err: any) {
      console.error('Error generating daily market report:', err);
      setError(err?.message || (t.authServiceError || 'Failed to generate report.'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedCommodityId, selectedMarketId, includeComparison, language, t]);

  // Requirement 3: Download PDF representation of the CURRENT report
  const handleDownloadPdf = () => {
    if (!report) return;
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      let currentY = 20;
      const margin = 18;
      const pageWidth = 210;

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('AgriTrade', margin, currentY);
      currentY += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Agricultural Mandi Intelligence & Daily Price Bulletin', margin, currentY);
      currentY += 8;

      // Report Title Bar
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, currentY, pageWidth - margin * 2, 12, 2, 2, 'F');

      const primaryMarket = report.selectedMarkets[0];
      const commodityTitle = primaryMarket ? primaryMarket.commodityName.toUpperCase() : 'COMMODITY';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(5, 150, 105);
      doc.text(`AGRITRADE REPORT - ${commodityTitle}`, margin + 4, currentY + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Date: ${report.reportDate} | Status: ${report.overallStatus}`, margin + 85, currentY + 7);
      currentY += 16;

      // Selected Markets
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('SELECTED MARKET', margin, currentY);
      currentY += 6;

      for (const sm of report.selectedMarkets) {
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFillColor(sm.status === 'LIVE VERIFIED DATA' ? 240 : 254, sm.status === 'LIVE VERIFIED DATA' ? 253 : 243, sm.status === 'LIVE VERIFIED DATA' ? 244 : 199);
        doc.roundedRect(margin, currentY, pageWidth - margin * 2, 24, 2, 2, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(`${sanitizePdfText(sm.marketName)} - ${sanitizePdfText(sm.commodityName)} (${sanitizePdfText(sm.variety)})`, margin + 4, currentY + 6);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(`Location: ${sanitizePdfText(sm.district)}, ${sanitizePdfText(sm.state)} | Arrival Date: ${sm.arrivalDate || 'Unavailable'}`, margin + 4, currentY + 12);

        if (sm.status === 'LIVE VERIFIED DATA' && sm.modalPrice) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(4, 120, 87);
          doc.text(`Modal: Rs. ${sm.modalPrice.toLocaleString('en-IN')}/qtl (Min: Rs. ${sm.minPrice?.toLocaleString('en-IN') || '—'}, Max: Rs. ${sm.maxPrice?.toLocaleString('en-IN') || '—'})`, margin + 4, currentY + 18);
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(180, 83, 9);
          doc.text(`Official Rate: Unavailable for selected date (No verified quote filed)`, margin + 4, currentY + 18);
        }

        currentY += 28;
      }

      // Comparison Markets Section
      if (report.comparisonMarkets.length > 0) {
        if (currentY > 230) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105);
        doc.text('OTHER MARKETS — FOR COMPARISON ONLY', margin, currentY);
        currentY += 6;

        for (const cm of report.comparisonMarkets.slice(0, 5)) {
          if (currentY > 260) {
            doc.addPage();
            currentY = 20;
          }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(15, 23, 42);
          doc.text(`* ${sanitizePdfText(cm.marketName)} (${sanitizePdfText(cm.district)}) - ${sanitizePdfText(cm.commodity)}: Modal Rs. ${cm.modalPrice?.toLocaleString('en-IN') || '—'}/qtl (Min: ${cm.minPrice || '—'}, Max: ${cm.maxPrice || '—'})`, margin, currentY);
          currentY += 5;
        }
      }

      // Disclaimer at bottom
      currentY += 6;
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      const splitDisclaimer = doc.splitTextToSize(report.disclaimer, pageWidth - margin * 2);
      doc.text(splitDisclaimer, margin, currentY);

      // Safe filename with commodity, market, and date
      const cmdPart = primaryMarket ? primaryMarket.commodityName.replace(/\s+/g, '_') : 'Commodity';
      const marketPart = primaryMarket ? primaryMarket.marketName.replace(/\s+/g, '_') : 'Market';
      const safeDate = report.reportDate.replace(/\//g, '-');
      const filename = `AgriTrade_${cmdPart}_${marketPart}_${safeDate}.pdf`;

      doc.save(filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (pdfErr) {
      console.error('PDF generation error:', pdfErr);
    }
  };

  // Copy text representation
  const handleCopyText = async () => {
    if (!report) return;
    try {
      const text = formatDailyReportText(report);
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Copy error:', err);
    }
  };

  // Resolve active commodity and market names
  const activeCommodityObj = COMMODITIES.find(c => c.id === selectedCommodityId) || COMMODITIES[0];
  const activeMandiObj = ALL_MANDI_LOCATIONS.find(m => m.id === selectedMarketId) || MAHARASHTRA_MANDIS.find(m => m.id === selectedMarketId) || ALL_MANDI_LOCATIONS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 w-full max-w-lg mx-auto shadow-2xl overflow-x-hidden">
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer p-1 -ml-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>{t.back}</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 block">
              AgriTrade Intelligence
            </span>
            <span className="text-xs font-bold text-slate-900">
              Daily Market Report V1
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Context Bar: Clearly displays user's State + District + APMC */}
        <ProfileContextBar
          userProfile={userProfile}
          language={language}
          activeState={activeMandiObj.state || userProfile?.state}
          activeDistrict={activeMandiObj.district || userProfile?.district}
          activeApmc={activeMandiObj.name || userProfile?.mainApmc}
          activeCommodityName={activeCommodityObj.name}
          onEditProfile={onNavigateToEditProfile}
        />

        {/* 2. REPORT CONFIGURATION BUILDER CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shrink-0 shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">
                {t.generateDailyReport}
              </h1>
              <p className="text-[11px] text-slate-500">
                {t.generateDailyReportSub}
              </p>
            </div>
          </div>

          {/* A. Single-Select Commodity Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>{t.selectCommodityLabel}</span>
                <span className="text-[10px] font-semibold text-emerald-700">
                  ({localizeCommodityName(activeCommodityObj.id, language)})
                </span>
              </label>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t.singleSelect}
              </span>
            </div>

            {/* Quick search input for commodities */}
            <input
              type="text"
              id="daily-report-commodity-search"
              placeholder={t.searchCommodityPlaceholder}
              value={commoditySearchQuery}
              onChange={(e) => setCommoditySearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />

            <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-200 max-h-36 overflow-y-auto">
              {filteredCommodities.map((c) => {
                const isSelected = selectedCommodityId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    id={`commodity-select-${c.id}`}
                    data-testid={`commodity-select-${c.id}`}
                    onClick={() => handleSelectCommodity(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-600'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span>{localizeCommodityName(c.id, language)}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* B. Single-Select APMC Mandi Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>{t.selectApmcLabel}</span>
                <span className="text-[10px] font-semibold text-slate-700">
                  ({localizeMandiName(activeMandiObj, language)})
                </span>
              </label>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t.singleSelect}
              </span>
            </div>

            {/* State filter row: Defaults to profile state, allows choosing other states */}
            <div className="flex items-center justify-between gap-2 pt-1 pb-1">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{t.state || 'State'}:</span>
                <select
                  value={selectedStateFilter}
                  onChange={(e) => setSelectedStateFilter(e.target.value)}
                  disabled={allowAllStates}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 py-1 px-2 rounded-lg flex-1 truncate focus:outline-hidden focus:ring-1 focus:ring-emerald-600 disabled:opacity-50"
                >
                  {availableStates.map(st => (
                    <option key={st} value={st}>
                      {st} {st === (userProfile?.state || 'Maharashtra') ? '★ (Profile)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setAllowAllStates(!allowAllStates)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer shrink-0 ${
                  allowAllStates
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {allowAllStates
                  ? t.allStatesOption
                  : t.otherStatesOption}
              </button>
            </div>

            {/* Quick search input for APMCs */}
            <input
              type="text"
              placeholder={t.searchApmcPlaceholder}
              value={mandiSearchQuery}
              onChange={(e) => setMandiSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
              {filteredMandis.map((m) => {
                const isSelected = selectedMarketId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    id={`mandi-select-${m.id}`}
                    data-testid={`mandi-select-${m.id}`}
                    onClick={() => handleSelectMarket(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-700'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span>{localizeMandiName(m, language)}</span>
                    <span className="text-[10px] opacity-75">({m.district})</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* C. Date Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                {t.reportDateLabel}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={handleSetToday}
                  className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                >
                  {t.today}
                </button>
                <button
                  type="button"
                  onClick={handleSetYesterday}
                  className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  {t.yesterday}
                </button>
              </div>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* D. Comparison Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 block">
                {t.includeComparisonMandis}
              </span>
              <span className="text-[10px] text-slate-500">
                {t.includeComparisonMandisSub}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeComparison}
                onChange={(e) => handleToggleComparison(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>

          {/* E. Primary Action Flow: GENERATE OR TOP DOWNLOAD BUTTON */}
          {/* Requirement 1, 2, 11: Button changes from Generate to Download Official Report at the TOP */}
          <div className="pt-2">
            {!report ? (
              <button
                type="button"
                id="btn-generate-daily-report"
                data-testid="btn-generate-daily-report"
                onClick={handleGenerateReport}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-60 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{t.generatingReport}</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-white" />
                    <span>{t.generateDailyReport}</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2.5">
                {/* Generated Success Status Banner */}
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="text-xs font-black text-emerald-900">
                      {t.reportGeneratedSuccess}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {report.reportDate}
                  </span>
                </div>

                {/* Requirement 1, 2, 3, 11: PROMINENT DOWNLOAD BUTTON NEAR THE TOP */}
                <button
                  type="button"
                  id="btn-download-official-report"
                  data-testid="btn-download-official-report"
                  onClick={handleDownloadPdf}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {downloadSuccess
                      ? t.reportDownloadedSuccess
                      : t.downloadOfficialReport}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">त्रुटी आढळली</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 3. REPORT CONTENT (Rendered below top CTA) */}
        {report && !isLoading && (
          <div className="space-y-4">
            {/* Report Context Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">AgriTrade</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                      OFFICIAL BULLETIN
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-emerald-900 tracking-tight mt-0.5">
                    {activeCommodityObj.name} — {activeMandiObj.name}
                  </h2>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>तारीख: <strong>{report.reportDate}</strong></span>
                    <span>•</span>
                    <span>वेळ: {report.generatedAt}</span>
                  </div>
                </div>

                {/* Overall Status Badge */}
                <div>
                  {report.overallStatus === 'LIVE VERIFIED DATA' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <Radio className="w-3 h-3 text-emerald-700 animate-pulse" />
                      LIVE VERIFIED
                    </span>
                  ) : report.overallStatus === 'PARTIALLY VERIFIED' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
                      <Radio className="w-3 h-3 text-blue-700" />
                      PARTIALLY VERIFIED
                    </span>
                  ) : report.overallStatus === 'FALLBACK DATA' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                      <ShieldAlert className="w-3 h-3 text-amber-700" />
                      FALLBACK DATA
                    </span>
                  ) : report.overallStatus === 'DEMO DATA' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-300">
                      <ShieldCheck className="w-3 h-3 text-purple-700" />
                      DEMO DATA
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                      <AlertCircle className="w-3 h-3 text-rose-700" />
                      NO VERIFIED DATA
                    </span>
                  )}
                </div>
              </div>

              {/* Source Note */}
              <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <strong>अधिकृत स्रोत:</strong> {report.officialSource}
              </div>
            </div>

            {/* 4. SELECTED MARKET SECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  {t.selectedMarketLabel}
                </span>
                <span className="text-[10px] text-slate-500">
                  {report.selectedMarkets.length} {t.marketCount}
                </span>
              </div>

              {report.selectedMarkets.map((m, idx) => (
                <div
                  key={`${m.marketId}_${m.commodityId}_${idx}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">
                          {m.marketName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {localizeCommodityName(m.commodityId, language)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {m.district}, {m.state}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div>
                      {m.status === 'LIVE VERIFIED DATA' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          LIVE
                        </span>
                      ) : m.status === 'FALLBACK DATA' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          FALLBACK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          {t.unrecorded}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Variety, Grade & Arrival Date */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{t.varietyLabel}</span>
                      <strong className="text-slate-800 block truncate">{localizeVarietyName(m.variety, language)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">{t.gradeLabel}</span>
                      <strong className="text-slate-800 block truncate">{m.grade}</strong>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 block">{t.arrivalDate}</span>
                      <strong className="text-slate-800 font-mono block">
                        {m.arrivalDate ? m.arrivalDate : t.dataUnavailable}
                      </strong>
                    </div>
                  </div>

                  {/* Requirement 8, 10: Official Price vs Unavailable */}
                  {m.modalPrice !== null && m.status === 'LIVE VERIFIED DATA' ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>{t.officialAuctionPrices}</span>
                        <span>{t.priceUnitLabel}: {m.priceUnit}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-medium">{t.minRate}</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-800 block mt-0.5 font-mono">
                            {formatReportPrice(m.minPrice)}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300">
                          <span className="text-[10px] text-emerald-800 block font-extrabold">{t.modalRate} *</span>
                          <span className="text-sm sm:text-base font-black text-emerald-900 block mt-0.5 font-mono">
                            {formatReportPrice(m.modalPrice)}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-medium">{t.maxRate}</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-800 block mt-0.5 font-mono">
                            {formatReportPrice(m.maxPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-black block text-[11px] tracking-wide uppercase text-amber-900">
                              {t.officialRateUnavailableToday}
                            </span>
                            <span className="text-[10px] text-slate-600 block mt-0.5">
                              {m.dataQualityWarning || t.noOfficialRecordReported}
                            </span>
                          </div>
                        </div>
                        <strong className="font-mono text-slate-400 text-sm">—</strong>
                      </div>
                    </div>
                  )}

                  {/* Requirement 8: Matching Trader Reported Local Market Rates (shown separately) */}
                  {matchingTraderReports.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-amber-700" />
                          {t.traderReportedLocalMarket}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                          UNVERIFIED
                        </span>
                      </div>
                      {matchingTraderReports.slice(0, 2).map((tr) => (
                        <div key={tr.id} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                            <span>{tr.traderName} ({tr.businessName || tr.role || 'Trader'})</span>
                            <span className="font-mono text-emerald-800 font-extrabold">₹{tr.modalPrice.toLocaleString('en-IN')}/qtl</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                            <span>{t.minRate}: ₹{tr.minPrice.toLocaleString('en-IN')} | {t.maxRate}: ₹{tr.maxPrice.toLocaleString('en-IN')}</span>
                            <span>{tr.reportDate || tr.date}</span>
                          </div>
                          {tr.note && <p className="text-[10px] text-slate-600 italic">"{tr.note}"</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 5. OTHER MARKETS — FOR COMPARISON ONLY SECTION */}
            {includeComparison && report.comparisonMarkets.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="px-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                    {t.otherMarketsComparisonOnly}
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                  {report.comparisonMarkets.map((c, cIdx) => (
                    <div key={`${c.marketName}_${cIdx}`} className="p-3 sm:p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs sm:text-sm font-black text-slate-900">
                            {c.marketName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {c.district}, {c.state} • {t.varietyLabel}: {localizeVarietyName(c.variety, language)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs sm:text-sm font-mono font-black text-emerald-900">
                            {formatReportPrice(c.modalPrice)}
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium block">
                            {t.perQuintal}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 mt-1 border-t border-slate-50 font-mono">
                        <span>
                          {t.minRate}: {formatReportPrice(c.minPrice)} | {t.maxRate}: {formatReportPrice(c.maxPrice)}
                        </span>
                        <span>{t.arrivals}: {c.arrivalDate || t.today}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. SECONDARY TEXT SHARING & DISCLAIMER */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">
                    {t.copyReportSummary}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyText}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copySuccess ? t.copiedToClipboard : t.copyTextForWhatsapp}</span>
              </button>
            </div>

            {/* 7. MANDATORY DISCLAIMER */}
            <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-[10px] text-slate-500 leading-relaxed space-y-1">
              <strong className="block font-bold text-slate-700 uppercase">
                {t.disclaimerLabel}
              </strong>
              <p>{report.disclaimer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

