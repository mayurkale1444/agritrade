import { CommodityId, AvailableLiveMarket } from '../types';
import { COMMODITIES, MAHARASHTRA_MANDIS, ALL_MANDI_LOCATIONS, cleanMandiString } from './mandiDataService';

export interface DailyReportConfig {
  date: string; // 'DD/MM/YYYY' or ISO 'YYYY-MM-DD'
  commodityIds: CommodityId[];
  marketIds: string[];
  includeComparison?: boolean;
  allowCrossStateComparison?: boolean;
  userProfile?: { state?: string; district?: string; mainApmc?: string; primaryCommodity?: CommodityId };
}

export interface ReportMarketItem {
  marketId: string;
  marketName: string;
  commodityId: CommodityId;
  commodityName: string;
  commodityMarathiName: string;
  variety: string;
  grade: string;
  district: string;
  state: string;
  arrivalDate: string; // verified arrival date or empty
  minPrice: number | null;
  modalPrice: number | null;
  maxPrice: number | null;
  priceUnit: string;
  status: 'LIVE VERIFIED DATA' | 'FALLBACK DATA' | 'DEMO DATA' | 'NO VERIFIED DATA TODAY' | 'DATA UNAVAILABLE';
  dataSource: string;
  isLive: boolean;
  hasZeroSpread: boolean;
  dataQuality: 'Verified' | 'Warning' | 'Unavailable';
  dataQualityWarning?: string;
  statusMessage?: string;
}

export interface ComparisonMarketItem {
  marketName: string;
  district: string;
  state: string;
  commodity: string;
  variety: string;
  grade?: string;
  arrivalDate: string;
  minPrice: number | null;
  modalPrice: number | null;
  maxPrice: number | null;
  priceUnit: string;
  status: 'LIVE VERIFIED DATA' | 'FALLBACK DATA' | 'DEMO DATA' | 'NO VERIFIED DATA TODAY' | 'DATA UNAVAILABLE';
  dataSource: string;
  isLive: boolean;
  dataQualityWarning?: string;
}

export interface DailyMarketReport {
  reportTitle: string;
  reportDate: string; // DD/MM/YYYY
  generatedAt: string;
  overallStatus: 'LIVE VERIFIED DATA' | 'PARTIALLY VERIFIED' | 'NO VERIFIED DATA TODAY' | 'FALLBACK DATA' | 'DEMO DATA' | 'DATA UNAVAILABLE';
  officialSource: string;
  selectedMarkets: ReportMarketItem[];
  comparisonMarkets: ComparisonMarketItem[];
  disclaimer: string;
}

/**
 * Standard disclaimer required on all AgriTrade reports
 */
export const DAILY_REPORT_DISCLAIMER =
  'Market prices are quotations from the identified source and date. Verify the latest rate, quality, quantity, transport cost, commission, and other expenses before making a trading decision. AgriTrade does not guarantee profit or future prices.';

/**
 * Normalizes input date to DD/MM/YYYY for AGMARKNET queries
 */
export function normalizeReportDate(rawDate?: string): string {
  if (!rawDate) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  // If already DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)) {
    return rawDate;
  }

  // If ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    const [y, m, d] = rawDate.split('-');
    return `${d}/${m}/${y}`;
  }

  return rawDate;
}

/**
 * Converts DD/MM/YYYY to YYYY-MM-DD for HTML date picker
 */
export function dmyToIsoDate(dmy: string): string {
  if (!dmy) return '';
  const parts = dmy.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return dmy;
}

/**
 * Formats currency amount in INR without inventing values
 */
export function formatReportPrice(amount: number | null): string {
  if (amount === null || amount === undefined || isNaN(amount) || amount <= 0) {
    return '—';
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Generates a full Daily Market Report by querying the official data pipeline
 */
export async function generateDailyMarketReport(
  config: DailyReportConfig
): Promise<DailyMarketReport> {
  const formattedDate = normalizeReportDate(config.date);
  const selectedCommodityIds = config.commodityIds.length > 0 ? config.commodityIds : ['onion' as CommodityId];
  const selectedMarketIds = config.marketIds.length > 0 ? config.marketIds : ['lasalgaon'];

  const selectedMarketItems: ReportMarketItem[] = [];
  const rawComparisonMarkets: AvailableLiveMarket[] = [];
  const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000';

  // Track statuses to determine overall status
  let hasLive = false;
  let hasFallback = false;
  let hasDemo = false;
  let hasNoData = false;
  let hasError = false;

  for (const commodityId of selectedCommodityIds) {
    const commodityObj = COMMODITIES.find(c => c.id === commodityId) || COMMODITIES[0];

    for (const marketId of selectedMarketIds) {
      const mandiObj = ALL_MANDI_LOCATIONS.find(m => 
        m.id === marketId || 
        m.name.toLowerCase() === marketId.toLowerCase() ||
        cleanMandiString(m.name) === cleanMandiString(marketId)
      ) || MAHARASHTRA_MANDIS.find(m => m.id === marketId) || {
        id: marketId,
        name: marketId,
        marathiName: marketId,
        district: config.userProfile?.district || 'Market',
        state: config.userProfile?.state || 'Maharashtra',
        isMajorAPMC: true,
        distanceKm: 0,
        isSpecializedFor: commodityObj.name
      };

      try {
        const queryParams = new URLSearchParams({
          commodity: commodityId,
          market: mandiObj.name,
          district: mandiObj.district,
          state: mandiObj.state,
          date: formattedDate
        });

        const res = await fetch(`${baseUrl}/api/mandi-prices?${queryParams.toString()}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const payload = await res.json();

        // Collect comparison market candidates from the official bulletin
        if (Array.isArray(payload.availableLiveMarkets)) {
          rawComparisonMarkets.push(...payload.availableLiveMarkets);
        }

        if (payload.dataTypeCategory === 'LIVE VERIFIED DATA' && payload.record) {
          hasLive = true;
          const rec = payload.record;
          const hasZeroSpread = Boolean(payload.hasZeroSpread || (rec.min_price === rec.modal_price && rec.modal_price === rec.max_price));

          selectedMarketItems.push({
            marketId: mandiObj.id,
            marketName: rec.market || mandiObj.name,
            commodityId: commodityId,
            commodityName: commodityObj.name,
            commodityMarathiName: commodityObj.marathiName || commodityObj.name,
            variety: rec.variety ? rec.variety.trim() : 'FAQ / Local',
            grade: rec.grade ? rec.grade.trim() : 'Local / FAQ',
            district: rec.district || mandiObj.district,
            state: rec.state || mandiObj.state,
            arrivalDate: rec.arrival_date || formattedDate,
            minPrice: typeof rec.min_price === 'number' && rec.min_price > 0 ? rec.min_price : null,
            modalPrice: typeof rec.modal_price === 'number' && rec.modal_price > 0 ? rec.modal_price : null,
            maxPrice: typeof rec.max_price === 'number' && rec.max_price > 0 ? rec.max_price : null,
            priceUnit: '₹ per quintal',
            status: 'LIVE VERIFIED DATA',
            dataSource: payload.dataSource || 'AGMARKNET (data.gov.in - Govt. of India)',
            isLive: true,
            hasZeroSpread,
            dataQuality: hasZeroSpread ? 'Warning' : 'Verified',
            dataQualityWarning: hasZeroSpread
              ? 'Warning: Zero price spread reported by APMC (Min = Modal = Max)'
              : undefined,
            statusMessage: payload.statusMessage || `Verified official AGMARKNET quotation for ${rec.market}.`
          });
        } else if (payload.dataTypeCategory === 'FALLBACK DATA') {
          hasFallback = true;
          selectedMarketItems.push({
            marketId: mandiObj.id,
            marketName: mandiObj.name,
            commodityId: commodityId,
            commodityName: commodityObj.name,
            commodityMarathiName: commodityObj.marathiName || commodityObj.name,
            variety: 'Baseline Reference',
            grade: 'FAQ',
            district: mandiObj.district,
            state: mandiObj.state,
            arrivalDate: '',
            minPrice: null,
            modalPrice: null,
            maxPrice: null,
            priceUnit: '₹ per quintal',
            status: 'FALLBACK DATA',
            dataSource: 'Calibrated historical baseline (Not an official quote today)',
            isLive: false,
            hasZeroSpread: false,
            dataQuality: 'Unavailable',
            dataQualityWarning: 'Historical baseline reference. Live quotation unrecorded.',
            statusMessage: 'No verified government record found for this selection/date.'
          });
        } else if (payload.dataTypeCategory === 'DEMO DATA') {
          hasDemo = true;
          selectedMarketItems.push({
            marketId: mandiObj.id,
            marketName: mandiObj.name,
            commodityId: commodityId,
            commodityName: commodityObj.name,
            commodityMarathiName: commodityObj.marathiName || commodityObj.name,
            variety: 'Simulation Sample',
            grade: 'FAQ',
            district: mandiObj.district,
            state: mandiObj.state,
            arrivalDate: '',
            minPrice: null,
            modalPrice: null,
            maxPrice: null,
            priceUnit: '₹ per quintal',
            status: 'DEMO DATA',
            dataSource: 'Simulation sample (Not an official quote)',
            isLive: false,
            hasZeroSpread: false,
            dataQuality: 'Unavailable',
            dataQualityWarning: 'Demo simulation data. Not an official AGMARKNET record.',
            statusMessage: 'Demo data mode active.'
          });
        } else {
          // NO VERIFIED DATA TODAY or unrecorded
          hasNoData = true;
          selectedMarketItems.push({
            marketId: mandiObj.id,
            marketName: mandiObj.name,
            commodityId: commodityId,
            commodityName: commodityObj.name,
            commodityMarathiName: commodityObj.marathiName || commodityObj.name,
            variety: 'Standard / Local',
            grade: 'FAQ',
            district: mandiObj.district,
            state: mandiObj.state,
            arrivalDate: '',
            minPrice: null,
            modalPrice: null,
            maxPrice: null,
            priceUnit: '₹ per quintal',
            status: 'NO VERIFIED DATA TODAY',
            dataSource: 'AGMARKNET (data.gov.in - Directorate of Marketing & Inspection)',
            isLive: false,
            hasZeroSpread: false,
            dataQuality: 'Unavailable',
            dataQualityWarning: `No official auction record reported by ${mandiObj.name} for ${commodityObj.name} on ${formattedDate}.`,
            statusMessage: 'No verified government record found for this selection/date.'
          });
        }
      } catch (err: any) {
        hasError = true;
        selectedMarketItems.push({
          marketId: mandiObj.id,
          marketName: mandiObj.name,
          commodityId: commodityId,
          commodityName: commodityObj.name,
          commodityMarathiName: commodityObj.marathiName || commodityObj.name,
          variety: 'Standard / Local',
          grade: 'FAQ',
          district: mandiObj.district,
          state: mandiObj.state,
          arrivalDate: '',
          minPrice: null,
          modalPrice: null,
          maxPrice: null,
          priceUnit: '₹ per quintal',
          status: 'DATA UNAVAILABLE',
          dataSource: 'AGMARKNET (data.gov.in)',
          isLive: false,
          hasZeroSpread: false,
          dataQuality: 'Unavailable',
          dataQualityWarning: 'Government market data pipeline error or unreachable.',
          statusMessage: 'Failed to retrieve data from government server.'
        });
      }
    }
  }

  // Build clean comparison markets list
  // CRITICAL MANDATE: Selected-market and comparison-market data are separated.
  // Comparison-market data must never be inserted into the selected-market card,
  // and selected markets must never appear in the comparison list.
  const selectedCleanNames = new Set<string>();
  for (const item of selectedMarketItems) {
    selectedCleanNames.add(cleanMandiString(item.marketName));
    // Also extract base market name before any parentheses e.g. "Lasalgaon(Niphad)" -> "Lasalgaon"
    const baseName = item.marketName.replace(/\(.*?\)/g, '').trim();
    if (baseName) {
      selectedCleanNames.add(cleanMandiString(baseName));
    }
  }
  for (const mid of selectedMarketIds) {
    selectedCleanNames.add(cleanMandiString(mid));
    const mandiObj = MAHARASHTRA_MANDIS.find(m => m.id === mid);
    if (mandiObj) {
      selectedCleanNames.add(cleanMandiString(mandiObj.name));
      const baseName = mandiObj.name.replace(/\(.*?\)/g, '').trim();
      if (baseName) {
        selectedCleanNames.add(cleanMandiString(baseName));
      }
    }
  }

  const comparisonMarkets: ComparisonMarketItem[] = [];
  const seenComparisonKeys = new Set<string>();

  if (config.includeComparison !== false) {
    const targetState = selectedMarketItems[0]?.state || config.userProfile?.state || 'Maharashtra';

    for (const raw of rawComparisonMarkets) {
      if (!raw || !raw.market) continue;

      // Do not mix markets from different states into the default feed unless cross-state comparison is explicitly allowed
      if (!config.allowCrossStateComparison) {
        const rawStateClean = cleanMandiString(raw.state);
        const targetStateClean = cleanMandiString(targetState);
        if (rawStateClean && targetStateClean && !rawStateClean.includes(targetStateClean) && !targetStateClean.includes(rawStateClean)) {
          continue;
        }
      }

      const rawClean = cleanMandiString(raw.market);
      const rawBase = cleanMandiString(raw.market.replace(/\(.*?\)/g, '').trim());

      // Skip if it matches any selected market
      let isSelected = false;
      for (const selClean of selectedCleanNames) {
        if (!selClean) continue;
        if (
          rawClean === selClean ||
          rawBase === selClean ||
          (selClean.length >= 4 && rawClean.includes(selClean)) ||
          (selClean.length >= 4 && rawBase.includes(selClean)) ||
          (rawClean.length >= 4 && selClean.includes(rawClean)) ||
          (rawBase.length >= 4 && selClean.includes(rawBase))
        ) {
          isSelected = true;
          break;
        }
      }

      if (isSelected) continue;

      const key = `${cleanMandiString(raw.market)}_${cleanMandiString(raw.commodity)}_${cleanMandiString(raw.variety)}`;
      if (seenComparisonKeys.has(key)) continue;
      seenComparisonKeys.add(key);

      const hasZeroSpread = Boolean(
        raw.min_price && raw.modal_price && raw.max_price &&
        raw.min_price === raw.modal_price && raw.modal_price === raw.max_price
      );

      comparisonMarkets.push({
        marketName: raw.market.trim(),
        district: raw.district ? raw.district.trim() : (selectedMarketItems[0]?.district || targetState),
        state: raw.state ? raw.state.trim() : targetState,
        commodity: raw.commodity ? raw.commodity.trim() : (selectedMarketItems[0]?.commodityName || 'Commodity'),
        variety: raw.variety ? raw.variety.trim() : 'FAQ / Local',
        grade: raw.grade ? raw.grade.trim() : 'FAQ',
        arrivalDate: raw.arrival_date || formattedDate,
        minPrice: typeof raw.min_price === 'number' && raw.min_price > 0 ? raw.min_price : null,
        modalPrice: typeof raw.modal_price === 'number' && raw.modal_price > 0 ? raw.modal_price : null,
        maxPrice: typeof raw.max_price === 'number' && raw.max_price > 0 ? raw.max_price : null,
        priceUnit: '₹ per quintal',
        status: 'LIVE VERIFIED DATA',
        dataSource: 'AGMARKNET (data.gov.in - Directorate of Marketing & Inspection)',
        isLive: true,
        dataQualityWarning: hasZeroSpread
          ? 'Notice: Zero price spread reported by APMC (Min = Modal = Max)'
          : undefined
      });
    }
  }

  // Determine overall status
  let overallStatus: DailyMarketReport['overallStatus'] = 'LIVE VERIFIED DATA';
  if (hasError && !hasLive) {
    overallStatus = 'DATA UNAVAILABLE';
  } else if (hasDemo) {
    overallStatus = 'DEMO DATA';
  } else if (hasFallback) {
    overallStatus = 'FALLBACK DATA';
  } else if (!hasLive && hasNoData) {
    overallStatus = 'NO VERIFIED DATA TODAY';
  } else if (hasLive && (hasNoData || hasFallback || hasError)) {
    overallStatus = 'PARTIALLY VERIFIED';
  }

  return {
    reportTitle: 'AgriTrade Daily Market Report',
    reportDate: formattedDate,
    generatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    overallStatus,
    officialSource: 'AGMARKNET (Directorate of Marketing & Inspection, Ministry of Agriculture, Govt. of India)',
    selectedMarkets: selectedMarketItems,
    comparisonMarkets,
    disclaimer: DAILY_REPORT_DISCLAIMER
  };
}

/**
 * Formats the daily report into a clean, scannable text version
 * Strictly conforming to the user's requested WhatsApp-compatible structure
 */
export function formatDailyReportText(report: DailyMarketReport): string {
  const lines: string[] = [];

  lines.push('AGRITRADE DAILY MARKET REPORT');
  lines.push('');
  lines.push(`Date: ${report.reportDate}`);
  lines.push(`Source: ${report.officialSource}`);
  lines.push(`Report Status: ${report.overallStatus}`);
  lines.push('');

  // SELECTED MARKET(S) SECTION
  lines.push('SELECTED MARKET');
  lines.push('====================');

  if (report.selectedMarkets.length === 0) {
    lines.push('No markets selected.');
    lines.push('');
  } else {
    report.selectedMarkets.forEach((m, idx) => {
      if (idx > 0) {
        lines.push('--------------------');
      }
      lines.push(`Commodity: ${m.commodityName} (${m.commodityMarathiName})`);
      lines.push(`Variety: ${m.variety}${m.grade ? ` (Grade: ${m.grade})` : ''}`);
      lines.push(`Market: ${m.marketName}`);
      lines.push(`Location: ${m.district}, ${m.state}`);
      lines.push(`Arrival date: ${m.arrivalDate || 'Unavailable (उपलब्ध नाही)'}`);

      if (m.modalPrice !== null && m.status === 'LIVE VERIFIED DATA') {
        lines.push(`Min: ${formatReportPrice(m.minPrice)} / quintal`);
        lines.push(`Modal: ${formatReportPrice(m.modalPrice)} / quintal`);
        lines.push(`Max: ${formatReportPrice(m.maxPrice)} / quintal`);
      } else {
        lines.push('Min: —');
        lines.push(`Modal: ${m.status === 'FALLBACK DATA' ? 'Baseline Reference Only (Not Official Today)' : 'Unavailable (दर उपलब्ध नाही)'}`);
        lines.push('Max: —');
      }

      lines.push(`Status: ${m.status}`);
      lines.push(`Source: ${m.dataSource}`);
      if (m.dataQualityWarning) {
        lines.push(`Warning: ${m.dataQualityWarning}`);
      }
      lines.push('');
    });
  }

  // OTHER MARKETS — FOR COMPARISON ONLY SECTION
  lines.push('OTHER MARKETS — FOR COMPARISON ONLY');
  lines.push('इतर बाजार समित्यांचे दर — फक्त तुलनेसाठी');
  lines.push('====================');

  if (report.comparisonMarkets.length === 0) {
    lines.push('No additional comparison markets reported in today\'s bulletin.');
    lines.push('');
  } else {
    report.comparisonMarkets.forEach((c) => {
      lines.push(`[${c.marketName}]`);
      lines.push(`Commodity/Variety: ${c.commodity} / ${c.variety}`);
      lines.push(`Location: ${c.district}, ${c.state}`);
      lines.push(`Arrival date: ${c.arrivalDate || 'Unavailable'}`);
      if (c.modalPrice !== null) {
        lines.push(`Min / Modal / Max: ${formatReportPrice(c.minPrice)} / ${formatReportPrice(c.modalPrice)} / ${formatReportPrice(c.maxPrice)} per quintal`);
      } else {
        lines.push('Min / Modal / Max: —');
      }
      lines.push(`Status: ${c.status}`);
      lines.push(`Source: ${c.dataSource}`);
      if (c.dataQualityWarning) {
        lines.push(`Notice: ${c.dataQualityWarning}`);
      }
      lines.push('');
    });
  }

  // DISCLAIMER
  lines.push('DISCLAIMER:');
  lines.push(report.disclaimer);

  return lines.join('\n');
}

/**
 * Encodes text into a WhatsApp click-to-chat URL
 */
export function getReportWhatsAppUrl(messageText: string): string {
  return `https://wa.me/?text=${encodeURIComponent(messageText)}`;
}
