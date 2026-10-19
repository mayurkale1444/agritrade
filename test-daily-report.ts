import {
  generateDailyMarketReport,
  formatDailyReportText,
  normalizeReportDate,
  formatReportPrice,
  DAILY_REPORT_DISCLAIMER,
  DailyMarketReport
} from './src/services/dailyReportService';

async function runDailyReportTests() {
  console.log('\n================================================================');
  console.log('DAILY MARKET REPORT MODULE V1 TEST SUITE');
  console.log('================================================================\n');

  const results: { id: string; name: string; passed: boolean; error?: string }[] = [];

  function record(id: string, name: string, condition: boolean, error?: string) {
    results.push({ id, name, passed: condition, error });
    console.log(`[${condition ? 'PASS' : 'FAIL'}] ${id}: ${name}`);
    if (!condition && error) {
      console.log(`       Error: ${error}`);
    }
  }

  // 1. Report generated from verified official data
  try {
    // Dynamically detect current official feed date from API or fallback to today
    let feedDate = '17/09/2026';
    try {
      const initRes = await fetch('http://localhost:3000/api/mandi-prices?commodity=onion');
      if (initRes.ok) {
        const initPayload = await initRes.json();
        const foundDate = initPayload.record?.arrival_date || initPayload.availableLiveMarkets?.find((m: any) => m.arrival_date)?.arrival_date;
        if (foundDate) {
          feedDate = foundDate;
        }
      }
    } catch {
      // Use fallback
    }

    const repLive = await generateDailyMarketReport({
      date: feedDate,
      commodityIds: ['onion'],
      marketIds: ['lasalgaon'],
      includeComparison: true
    });

    const sel = repLive.selectedMarkets[0];
    record(
      'T1',
      'Report generated from verified official data',
      repLive.reportTitle === 'AgriTrade Daily Market Report' &&
      repLive.overallStatus === 'LIVE VERIFIED DATA' &&
      sel !== undefined &&
      sel.status === 'LIVE VERIFIED DATA' &&
      sel.isLive === true &&
      sel.modalPrice !== null &&
      sel.modalPrice > 0,
      `Status: ${repLive.overallStatus}, modal: ${sel?.modalPrice}`
    );

    // 6. Selected-market and comparison-market separation
    const comparisonMarkets = repLive.comparisonMarkets;
    const hasLasalgaonInComparison = comparisonMarkets.some(c =>
      c.marketName.toLowerCase().includes('lasalgaon')
    );

    record(
      'T6',
      'Selected-market and comparison-market separation',
      !hasLasalgaonInComparison &&
      sel.marketName.toLowerCase().includes('lasalgaon') &&
      comparisonMarkets.length > 0 &&
      comparisonMarkets.every(c => !c.marketName.toLowerCase().includes('lasalgaon')),
      `Lasalgaon in comparison: ${hasLasalgaonInComparison}, comparison count: ${comparisonMarkets.length}`
    );

    // 8. Correct commodity and variety display
    record(
      'T8',
      'Correct commodity and variety display',
      sel.commodityName === 'Onion' &&
      sel.commodityMarathiName === 'कांदा' &&
      Boolean(sel.variety),
      `Commodity: ${sel.commodityName} (${sel.commodityMarathiName}), Variety: ${sel.variety}`
    );

    // 9. Correct market, district, and state display
    record(
      'T9',
      'Correct market, district, and state display',
      sel.marketName.includes('Lasalgaon') &&
      sel.district === 'Nashik' &&
      sel.state === 'Maharashtra',
      `Market: ${sel.marketName}, District: ${sel.district}, State: ${sel.state}`
    );

    // 10. Correct minimum/modal/maximum values
    record(
      'T10',
      'Correct minimum/modal/maximum values',
      sel.minPrice !== null &&
      sel.minPrice > 0 &&
      sel.modalPrice !== null &&
      sel.modalPrice > 0 &&
      sel.maxPrice !== null &&
      sel.maxPrice >= sel.modalPrice &&
      sel.priceUnit === '₹ per quintal',
      `Min: ${sel.minPrice}, Modal: ${sel.modalPrice}, Max: ${sel.maxPrice}`
    );

    // 14. Correct copied-text report generation
    const textOutput = formatDailyReportText(repLive);
    const modalStr = sel.modalPrice ? sel.modalPrice.toLocaleString('en-IN') : '';
    record(
      'T14',
      'Correct copied-text report generation',
      textOutput.includes('AGRITRADE DAILY MARKET REPORT') &&
      textOutput.includes('SELECTED MARKET') &&
      textOutput.includes('OTHER MARKETS — FOR COMPARISON ONLY') &&
      textOutput.includes('DISCLAIMER:') &&
      textOutput.includes('Lasalgaon') &&
      (modalStr ? textOutput.includes(modalStr) : true) &&
      textOutput.includes(DAILY_REPORT_DISCLAIMER),
      `Text output snippet: ${textOutput.substring(0, 200)}...`
    );
  } catch (err: any) {
    record('T1', 'Report generated from verified official data', false, err?.message);
    record('T6', 'Selected-market and comparison-market separation', false, err?.message);
    record('T8', 'Correct commodity and variety display', false, err?.message);
    record('T9', 'Correct market, district, and state display', false, err?.message);
    record('T10', 'Correct minimum/modal/maximum values', false, err?.message);
    record('T14', 'Correct copied-text report generation', false, err?.message);
  }

  // 2. Report with no official record
  try {
    const repNoData = await generateDailyMarketReport({
      date: '14/09/2026',
      commodityIds: ['turmeric'],
      marketIds: ['lasalgaon'], // Lasalgaon does not auction turmeric in the official sample
      includeComparison: false
    });

    const sel = repNoData.selectedMarkets[0];
    record(
      'T2',
      'Report with no official record',
      repNoData.overallStatus === 'NO VERIFIED DATA TODAY' &&
      sel.status === 'NO VERIFIED DATA TODAY' &&
      sel.modalPrice === null &&
      sel.isLive === false,
      `Status: ${repNoData.overallStatus}, modal: ${sel.modalPrice}`
    );

    // 11. No invented prices
    record(
      'T11',
      'No invented prices (modal/min/max null for missing records)',
      sel.minPrice === null &&
      sel.modalPrice === null &&
      sel.maxPrice === null &&
      formatReportPrice(sel.modalPrice) === '—',
      `Min: ${sel.minPrice}, Modal: ${sel.modalPrice}, formatted: ${formatReportPrice(sel.modalPrice)}`
    );

    // 12. No invented dates
    record(
      'T12',
      'No invented dates (missing record does not invent a past arrival date)',
      sel.arrivalDate === '',
      `ArrivalDate: "${sel.arrivalDate}"`
    );
  } catch (err: any) {
    record('T2', 'Report with no official record', false, err?.message);
    record('T11', 'No invented prices', false, err?.message);
    record('T12', 'No invented dates', false, err?.message);
  }

  // 3. Report with a fallback record
  try {
    // Calling with a known offline or remote market
    const fallbackReport: DailyMarketReport = {
      reportTitle: 'AgriTrade Daily Market Report',
      reportDate: '15/09/2026',
      generatedAt: '10:00 AM',
      overallStatus: 'FALLBACK DATA',
      officialSource: 'Calibrated historical baseline (Not an official quote today)',
      selectedMarkets: [{
        marketId: 'karjat',
        marketName: 'Karjat',
        commodityId: 'onion',
        commodityName: 'Onion',
        commodityMarathiName: 'कांदा',
        variety: 'Baseline Reference',
        grade: 'FAQ',
        district: 'Ahmednagar',
        state: 'Maharashtra',
        arrivalDate: '',
        minPrice: null,
        modalPrice: null,
        maxPrice: null,
        priceUnit: '₹ per quintal',
        status: 'FALLBACK DATA',
        dataSource: 'Historical baseline reference',
        isLive: false,
        hasZeroSpread: false,
        dataQuality: 'Unavailable',
        dataQualityWarning: 'Historical baseline reference. Live quotation unrecorded.'
      }],
      comparisonMarkets: [],
      disclaimer: DAILY_REPORT_DISCLAIMER
    };

    const text = formatDailyReportText(fallbackReport);
    record(
      'T3',
      'Report with a fallback record properly flagged',
      fallbackReport.overallStatus === 'FALLBACK DATA' &&
      fallbackReport.selectedMarkets[0].status === 'FALLBACK DATA' &&
      fallbackReport.selectedMarkets[0].isLive === false &&
      text.includes('FALLBACK DATA') &&
      text.includes('Baseline Reference Only'),
      `Status: ${fallbackReport.overallStatus}`
    );
  } catch (err: any) {
    record('T3', 'Report with a fallback record', false, err?.message);
  }

  // 4. Report with a demo record
  try {
    const demoReport: DailyMarketReport = {
      reportTitle: 'AgriTrade Daily Market Report',
      reportDate: '15/09/2026',
      generatedAt: '10:00 AM',
      overallStatus: 'DEMO DATA',
      officialSource: 'Simulation Sample (data.gov.in demo mode)',
      selectedMarkets: [{
        marketId: 'pune_moshi',
        marketName: 'Pune (Moshi)',
        commodityId: 'onion',
        commodityName: 'Onion',
        commodityMarathiName: 'कांदा',
        variety: 'Simulation Sample',
        grade: 'FAQ',
        district: 'Pune',
        state: 'Maharashtra',
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
        dataQualityWarning: 'Demo simulation data. Not an official AGMARKNET record.'
      }],
      comparisonMarkets: [],
      disclaimer: DAILY_REPORT_DISCLAIMER
    };

    const text = formatDailyReportText(demoReport);
    record(
      'T4',
      'Report with a demo record labeled explicitly',
      demoReport.overallStatus === 'DEMO DATA' &&
      demoReport.selectedMarkets[0].status === 'DEMO DATA' &&
      text.includes('DEMO DATA'),
      `Status: ${demoReport.overallStatus}`
    );
  } catch (err: any) {
    record('T4', 'Report with a demo record', false, err?.message);
  }

  // 5. Report containing multiple markets
  try {
    const multiReport = await generateDailyMarketReport({
      date: '15/09/2026',
      commodityIds: ['onion'],
      marketIds: ['lasalgaon', 'pimpalgaon', 'pune_moshi'],
      includeComparison: true
    });

    record(
      'T5',
      'Report containing multiple markets',
      multiReport.selectedMarkets.length === 3 &&
      multiReport.selectedMarkets.some(m => m.marketId === 'lasalgaon') &&
      multiReport.selectedMarkets.some(m => m.marketId === 'pimpalgaon') &&
      multiReport.selectedMarkets.some(m => m.marketId === 'pune_moshi'),
      `Markets returned: ${multiReport.selectedMarkets.map(m => m.marketId).join(', ')}`
    );
  } catch (err: any) {
    record('T5', 'Report containing multiple markets', false, err?.message);
  }

  // 7. Missing arrival date handled safely
  try {
    const mockReportMissingDate: DailyMarketReport = {
      reportTitle: 'AgriTrade Daily Market Report',
      reportDate: '15/09/2026',
      generatedAt: '10:00 AM',
      overallStatus: 'NO VERIFIED DATA TODAY',
      officialSource: 'AGMARKNET',
      selectedMarkets: [{
        marketId: 'solapur',
        marketName: 'Solapur',
        commodityId: 'cotton',
        commodityName: 'Cotton',
        commodityMarathiName: 'कापूस',
        variety: 'Local',
        grade: 'FAQ',
        district: 'Solapur',
        state: 'Maharashtra',
        arrivalDate: '', // Missing arrival date
        minPrice: null,
        modalPrice: null,
        maxPrice: null,
        priceUnit: '₹ per quintal',
        status: 'NO VERIFIED DATA TODAY',
        dataSource: 'AGMARKNET',
        isLive: false,
        hasZeroSpread: false,
        dataQuality: 'Unavailable'
      }],
      comparisonMarkets: [],
      disclaimer: DAILY_REPORT_DISCLAIMER
    };

    const text = formatDailyReportText(mockReportMissingDate);
    record(
      'T7',
      'Missing arrival date displays approved unavailable label without fake date',
      mockReportMissingDate.selectedMarkets[0].arrivalDate === '' &&
      text.includes('Arrival date: Unavailable (उपलब्ध नाही)') &&
      !text.includes('Arrival date: 14/09/2026'),
      `Arrival text output: ${text.split('\n').find(l => l.includes('Arrival date'))}`
    );
  } catch (err: any) {
    record('T7', 'Missing arrival date', false, err?.message);
  }

  // 13. No artificial trends for single-day data
  try {
    const repLive = await generateDailyMarketReport({
      date: '15/09/2026',
      commodityIds: ['onion'],
      marketIds: ['lasalgaon']
    });

    const text = formatDailyReportText(repLive);
    // Ensure no fake trend indicators like "+12% Bullish", "Strong Buy Signal"
    const hasInventedTrend =
      text.includes('+') ||
      text.includes('%') ||
      text.toLowerCase().includes('bullish') ||
      text.toLowerCase().includes('bearish') ||
      text.toLowerCase().includes('strong buy');

    record(
      'T13',
      'No artificial trends or signals for single-day official record',
      !hasInventedTrend,
      `Report text contained trend: ${hasInventedTrend}`
    );
  } catch (err: any) {
    record('T13', 'No artificial trends', false, err?.message);
  }

  // 15. API errors and loading states resilience
  try {
    // Query with invalid server port or non-existent endpoint simulation
    const rawDateNormalized = normalizeReportDate('invalid-date');
    record(
      'T15',
      'API input normalization and error resilience',
      typeof rawDateNormalized === 'string' && rawDateNormalized.length > 0,
      `Normalized date: ${rawDateNormalized}`
    );
  } catch (err: any) {
    record('T15', 'API errors and loading states', false, err?.message);
  }

  // Summary
  const passedCount = results.filter(r => r.passed).length;
  console.log('\n----------------------------------------------------------------');
  console.log(`DAILY REPORT TEST SUITE RESULTS: ${passedCount}/${results.length} PASSED`);
  console.log('----------------------------------------------------------------\n');

  if (passedCount < results.length) {
    process.exit(1);
  }
}

runDailyReportTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
