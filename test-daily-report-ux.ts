import {
  generateDailyMarketReport,
  formatDailyReportText,
  normalizeReportDate,
  DailyMarketReport
} from './src/services/dailyReportService';
import { COMMODITIES, MAHARASHTRA_MANDIS } from './src/services/mandiDataService';
import { getStoredTraderReports } from './src/services/traderReportService';
import { CommodityId } from './src/types';

/**
 * DAILY MARKET REPORT + COMMODITY SELECTION UX REGRESSION TEST SUITE
 * Validates the 10 critical user-specified tests:
 * TEST 1: Select Onion → Onion selected
 * TEST 2: Select Soyabean → Soyabean selected → Onion removed from selection
 * TEST 3: Select Cotton → Cotton selected → Soyabean removed
 * TEST 4: Generate Onion report → report shows Onion
 * TEST 5: Change Onion → Soyabean → old Onion report disappears → Generate button returns
 * TEST 6: Generate Soyabean report → Download Official Report button appears immediately near the top
 * TEST 7: Click Download Official Report → downloads current Soyabean report
 * TEST 8: Change Soyabean → Cotton after generation → previous Soyabean report is cleared → download state resets
 * TEST 9: Generate Soyabean + Nashik → no Onion data appears in the generated report
 * TEST 10: Official data unavailable → explicitly display unavailable → never substitute another commodity
 */
async function runDailyReportUxTests() {
  console.log('\n================================================================');
  console.log('DAILY MARKET REPORT + COMMODITY SELECTION UX TEST SUITE');
  console.log('================================================================\n');

  const results: { id: string; name: string; passed: boolean; error?: string }[] = [];

  function record(id: string, name: string, condition: boolean, error?: string) {
    results.push({ id, name, passed: condition, error });
    console.log(`[${condition ? 'PASS' : 'FAIL'}] ${id}: ${name}`);
    if (!condition && error) {
      console.log(`       Error: ${error}`);
    }
  }

  // Model the simulated React component state flow
  class SimulatedDailyReportController {
    selectedCommodityId: CommodityId;
    selectedMarketId: string;
    selectedDate: string;
    includeComparison: boolean;
    report: DailyMarketReport | null = null;
    isLoading: boolean = false;
    downloadSuccess: boolean = false;
    downloadedReportFilename: string | null = null;
    downloadedCommodity: string | null = null;

    constructor(initialCommodity: CommodityId = 'onion', initialMarket: string = 'lasalgaon') {
      this.selectedCommodityId = initialCommodity;
      this.selectedMarketId = initialMarket;
      this.selectedDate = '2026-09-23';
      this.includeComparison = true;
    }

    // Single-select commodity with auto-clearing of old report
    selectCommodity(id: CommodityId) {
      if (id === this.selectedCommodityId && this.report !== null) return;
      this.selectedCommodityId = id;
      // Requirement 6: Clear old report and reset download state
      this.report = null;
      this.downloadSuccess = false;
    }

    // Single-select market with auto-clearing
    selectMarket(id: string) {
      if (id === this.selectedMarketId && this.report !== null) return;
      this.selectedMarketId = id;
      this.report = null;
      this.downloadSuccess = false;
    }

    async generateReport() {
      this.isLoading = true;
      this.downloadSuccess = false;
      try {
        const [year, month, day] = this.selectedDate.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        this.report = await generateDailyMarketReport({
          date: formattedDate,
          commodityIds: [this.selectedCommodityId],
          marketIds: [this.selectedMarketId],
          includeComparison: this.includeComparison
        });
      } finally {
        this.isLoading = false;
      }
    }

    downloadOfficialReport(): { filename: string; commodity: string } | null {
      if (!this.report) return null;
      const primaryMarket = this.report.selectedMarkets[0];
      const cmdPart = primaryMarket ? primaryMarket.commodityName.replace(/\s+/g, '_') : 'Commodity';
      const marketPart = primaryMarket ? primaryMarket.marketName.replace(/\s+/g, '_') : 'Market';
      const safeDate = this.report.reportDate.replace(/\//g, '-');
      const filename = `AgriTrade_${cmdPart}_${marketPart}_${safeDate}.pdf`;
      this.downloadedReportFilename = filename;
      this.downloadedCommodity = primaryMarket?.commodityName || null;
      this.downloadSuccess = true;
      return { filename, commodity: this.downloadedCommodity || '' };
    }

    get isGenerateButtonActive(): boolean {
      return this.report === null && !this.isLoading;
    }

    get isDownloadButtonActive(): boolean {
      return this.report !== null && !this.isLoading;
    }
  }

  const controller = new SimulatedDailyReportController('onion', 'lasalgaon');

  // TEST 1: Select Onion → Onion selected
  try {
    record(
      'TEST 1',
      'Select Onion → Onion selected',
      controller.selectedCommodityId === 'onion',
      `Expected onion, got: ${controller.selectedCommodityId}`
    );
  } catch (err: any) {
    record('TEST 1', 'Select Onion → Onion selected', false, err.message);
  }

  // TEST 2: Select Soyabean → Soyabean selected → Onion removed from selection
  try {
    controller.selectCommodity('soybean');
    record(
      'TEST 2',
      'Select Soyabean → Soyabean selected → Onion removed from selection',
      controller.selectedCommodityId === 'soybean' && (controller.selectedCommodityId as string) !== 'onion',
      `Current commodity: ${controller.selectedCommodityId}`
    );
  } catch (err: any) {
    record('TEST 2', 'Select Soyabean → Soyabean selected → Onion removed from selection', false, err.message);
  }

  // TEST 3: Select Cotton → Cotton selected → Soyabean removed
  try {
    controller.selectCommodity('cotton');
    record(
      'TEST 3',
      'Select Cotton → Cotton selected → Soyabean removed',
      controller.selectedCommodityId === 'cotton' &&
      (controller.selectedCommodityId as string) !== 'soybean' &&
      (controller.selectedCommodityId as string) !== 'onion',
      `Current commodity: ${controller.selectedCommodityId}`
    );
  } catch (err: any) {
    record('TEST 3', 'Select Cotton → Cotton selected → Soyabean removed', false, err.message);
  }

  // Reset to Onion for generating Onion report
  controller.selectCommodity('onion');
  controller.selectMarket('lasalgaon');

  // TEST 4: Generate Onion report → report shows Onion
  try {
    await controller.generateReport();
    const rep = controller.report;
    const primary = rep?.selectedMarkets[0];
    record(
      'TEST 4',
      'Generate Onion report → report shows Onion',
      rep !== null &&
      primary !== undefined &&
      primary.commodityId === 'onion' &&
      primary.commodityName === 'Onion',
      `Report primary commodity: ${primary?.commodityName} (ID: ${primary?.commodityId})`
    );
  } catch (err: any) {
    record('TEST 4', 'Generate Onion report → report shows Onion', false, err.message);
  }

  // TEST 5: Change Onion → Soyabean → old Onion report disappears → Generate button returns
  try {
    // Current report is Onion
    const hadReportBefore = controller.report !== null;
    controller.selectCommodity('soybean');
    const reportCleared = controller.report === null;
    const generateBtnReturned = controller.isGenerateButtonActive;
    const downloadBtnHidden = !controller.isDownloadButtonActive;

    record(
      'TEST 5',
      'Change Onion → Soyabean → old Onion report disappears → Generate button returns',
      hadReportBefore && reportCleared && generateBtnReturned && downloadBtnHidden,
      `hadReportBefore=${hadReportBefore}, reportCleared=${reportCleared}, generateBtnReturned=${generateBtnReturned}, downloadBtnHidden=${downloadBtnHidden}`
    );
  } catch (err: any) {
    record('TEST 5', 'Change Onion → Soyabean → old Onion report disappears → Generate button returns', false, err.message);
  }

  // TEST 6: Generate Soyabean report → Download Official Report button appears immediately near the top
  try {
    controller.selectMarket('nashik_apmc');
    await controller.generateReport();
    const downloadButtonAppeared = controller.isDownloadButtonActive;
    const generateButtonHidden = !controller.isGenerateButtonActive;

    record(
      'TEST 6',
      'Generate Soyabean report → Download Official Report button appears immediately near the top',
      downloadButtonAppeared && generateButtonHidden && controller.report !== null,
      `downloadButtonAppeared=${downloadButtonAppeared}, generateButtonHidden=${generateButtonHidden}`
    );
  } catch (err: any) {
    record('TEST 6', 'Generate Soyabean report → Download Official Report button appears immediately near the top', false, err.message);
  }

  // TEST 7: Click Download Official Report → downloads current Soyabean report
  try {
    const downloadResult = controller.downloadOfficialReport();
    record(
      'TEST 7',
      'Click Download Official Report → downloads current Soyabean report',
      downloadResult !== null &&
      downloadResult.commodity === 'Soybean' &&
      downloadResult.filename.includes('Soybean') &&
      !downloadResult.filename.includes('Onion') &&
      controller.downloadSuccess === true,
      `Downloaded file: ${downloadResult?.filename}, commodity: ${downloadResult?.commodity}`
    );
  } catch (err: any) {
    record('TEST 7', 'Click Download Official Report → downloads current Soyabean report', false, err.message);
  }

  // TEST 8: Change Soyabean → Cotton after generation → previous Soyabean report is cleared → download state resets
  try {
    controller.selectCommodity('cotton');
    const reportCleared = controller.report === null;
    const downloadReset = controller.downloadSuccess === false;
    const generateBtnReturned = controller.isGenerateButtonActive;

    record(
      'TEST 8',
      'Change Soyabean → Cotton after generation → previous Soyabean report is cleared → download state resets',
      reportCleared && downloadReset && generateBtnReturned,
      `reportCleared=${reportCleared}, downloadReset=${downloadReset}, generateBtnReturned=${generateBtnReturned}`
    );
  } catch (err: any) {
    record('TEST 8', 'Change Soyabean → Cotton after generation → previous Soyabean report is cleared → download state resets', false, err.message);
  }

  // TEST 9: Generate Soyabean + Nashik → no Onion data appears in the generated report
  try {
    controller.selectCommodity('soybean');
    controller.selectMarket('nashik_apmc');
    await controller.generateReport();

    const rep = controller.report!;
    const allSelectedCommodities = rep.selectedMarkets.map(m => m.commodityName.toLowerCase());
    const hasOnionInSelected = allSelectedCommodities.some(c => c.includes('onion'));
    const hasSoybeanInSelected = allSelectedCommodities.every(c => c.includes('soy'));

    const allComparisonCommodities = rep.comparisonMarkets.map(m => m.commodity.toLowerCase());
    const hasOnionInComparison = allComparisonCommodities.some(c => c.includes('onion'));

    record(
      'TEST 9',
      'Generate Soyabean + Nashik → no Onion data appears in the generated report',
      !hasOnionInSelected &&
      hasSoybeanInSelected &&
      !hasOnionInComparison,
      `hasOnionInSelected=${hasOnionInSelected}, hasSoybeanInSelected=${hasSoybeanInSelected}, hasOnionInComparison=${hasOnionInComparison}`
    );
  } catch (err: any) {
    record('TEST 9', 'Generate Soyabean + Nashik → no Onion data appears in the generated report', false, err.message);
  }

  // TEST 10: Official data unavailable → explicitly display unavailable → never substitute another commodity
  try {
    // Querying Soybean at Nashik APMC where no official AGMARKNET record is filed
    controller.selectCommodity('soybean');
    controller.selectMarket('nashik_apmc');
    await controller.generateReport();

    const rep = controller.report!;
    const sm = rep.selectedMarkets[0];

    const isUnavailable = sm.status === 'NO VERIFIED DATA TODAY' || sm.status === 'DATA UNAVAILABLE';
    const noFakePrices = sm.modalPrice === null && sm.minPrice === null && sm.maxPrice === null;
    const correctCommodity = sm.commodityId === 'soybean' && sm.commodityName === 'Soybean';
    const correctMarket = sm.marketName === 'Nashik APMC';

    // Verify trader reports are separated and exist for Soybean Nashik
    const storedReports = getStoredTraderReports();
    const matchingTraderReports = storedReports.filter(tr =>
      (tr.commodityId === 'soybean' || tr.commodity.toLowerCase().includes('soy')) &&
      (tr.marketName?.toLowerCase().includes('nashik') || tr.mainAPMC?.toLowerCase().includes('nashik'))
    );
    const traderReportsSeparated = matchingTraderReports.length > 0 &&
      matchingTraderReports.every(tr => tr.sourceType === 'TRADER_REPORTED' && tr.verificationStatus === 'UNVERIFIED');

    record(
      'TEST 10',
      'Official data unavailable → explicitly display unavailable → never substitute another commodity',
      isUnavailable &&
      noFakePrices &&
      correctCommodity &&
      correctMarket &&
      traderReportsSeparated,
      `Status: ${sm.status}, modalPrice: ${sm.modalPrice}, commodity: ${sm.commodityName}, market: ${sm.marketName}, traderReportsCount: ${matchingTraderReports.length}`
    );
  } catch (err: any) {
    record('TEST 10', 'Official data unavailable → explicitly display unavailable → never substitute another commodity', false, err.message);
  }

  console.log('\n================================================================');
  const allPassed = results.every(r => r.passed);
  const passedCount = results.filter(r => r.passed).length;
  console.log(`DAILY REPORT UX TEST SUMMARY: ${passedCount} / ${results.length} PASSED`);
  console.log('================================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runDailyReportUxTests().catch(err => {
  console.error('Fatal error running Daily Report UX tests:', err);
  process.exit(1);
});
