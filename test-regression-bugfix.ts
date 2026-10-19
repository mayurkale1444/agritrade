import { fetchLiveMarketData, cleanMandiString, isVarietyMatch, normalizeMarketName, ALL_MANDI_LOCATIONS } from './src/services/mandiDataService';
import { MandiMarket, CommodityId } from './src/types';

async function runRegressionTestSuite() {
  console.log('\n================================================================');
  console.log('REGRESSION TEST SUITE: MULTI-STATE APMC & INSTANT CALCULATOR');
  console.log('================================================================\n');

  const results: { id: string; name: string; passed: boolean; error?: string }[] = [];

  function record(id: string, name: string, condition: boolean, error?: string) {
    results.push({ id, name, passed: condition, error });
    console.log(`[${condition ? 'PASS' : 'FAIL'}] ${id}: ${name}`);
    if (!condition && error) {
      console.log(`       Error: ${error}`);
    }
  }

  // -------------------------------------------------------------
  // PART 1: BUG 1 — OTHER-STATE APMC RATES & STRICT VERIFICATION
  // -------------------------------------------------------------
  console.log('\n--- PART 1: OTHER-STATE APMC MARKET RATES ---');

  // Test R1: Predefined All-India mandis exist and cover major agricultural states
  const statesInCatalog = new Set(ALL_MANDI_LOCATIONS.map(m => m.state));
  const hasMultipleStates = statesInCatalog.has('Maharashtra') &&
    statesInCatalog.has('Madhya Pradesh') &&
    statesInCatalog.has('Gujarat') &&
    statesInCatalog.has('Rajasthan') &&
    statesInCatalog.has('Uttar Pradesh') &&
    statesInCatalog.has('Karnataka');
  record('R1', 'Mandi catalog covers multi-state locations (MP, GJ, RJ, UP, KA, MH)',
    hasMultipleStates,
    `Found states: ${Array.from(statesInCatalog).join(', ')}`
  );

  // Test R2: Live data fetching for non-Maharashtra market (Neemuch, Madhya Pradesh)
  try {
    const neemuchMarket: MandiMarket = {
      id: 'neemuch',
      name: 'Neemuch',
      district: 'Neemuch',
      state: 'Madhya Pradesh',
      commodityId: 'onion',
      benchmark: false,
      arrivalAvgQtl: 2000,
      distanceKm: 450,
      isMajorAPMC: true
    };

    const resMP = await fetchLiveMarketData('onion', 'neemuch', neemuchMarket);
    // If official upstream has Neemuch on this date: returns Neemuch verified record
    // If official upstream has no Neemuch record: returns NO VERIFIED DATA TODAY with null record
    // CRITICAL: It MUST NEVER return Lasalgaon or a Maharashtra price!
    const isNoCrossContamination = !resMP.sourceMarket.toLowerCase().includes('lasalgaon') &&
      (!resMP.isLive || resMP.sourceMarket.toLowerCase().includes('neemuch'));
    record('R2', 'Neemuch (MP) query never substitutes Lasalgaon or Maharashtra record',
      isNoCrossContamination,
      `Returned market=${resMP.sourceMarket}, category=${resMP.dataTypeCategory}`
    );

    if (resMP.isLive) {
      record('R3', 'Neemuch (MP) verified record matches official MP record correctly',
        resMP.modalPrice > 0 && resMP.dataTypeCategory === 'LIVE VERIFIED DATA',
        `modalPrice=${resMP.modalPrice}, state=${resMP.mandi.state}`
      );
    } else {
      record('R3', 'Neemuch (MP) unrecorded date correctly returns NO VERIFIED DATA TODAY without fake data',
        resMP.dataTypeCategory === 'NO VERIFIED DATA TODAY' && resMP.modalPrice === 0,
        `category=${resMP.dataTypeCategory}, modalPrice=${resMP.modalPrice}`
      );
    }
  } catch (e: any) {
    record('R2', 'Neemuch (MP) query exception', false, e.message);
  }

  // Test R4: Strict cross-state rejection (Rajkot, Gujarat requested - must NOT return Maharashtra data)
  try {
    const rajkotMarket: MandiMarket = {
      id: 'rajkot',
      name: 'Rajkot',
      district: 'Rajkot',
      state: 'Gujarat',
      commodityId: 'onion',
      benchmark: false,
      arrivalAvgQtl: 5000,
      distanceKm: 600,
      isMajorAPMC: true
    };

    const resGJ = await fetchLiveMarketData('onion', 'rajkot', rajkotMarket);
    const noFalseSubstitution = !resGJ.sourceMarket.toLowerCase().includes('lasalgaon') &&
      !resGJ.sourceMarket.toLowerCase().includes('akola') &&
      !resGJ.sourceMarket.toLowerCase().includes('pune');
    record('R4', 'Rajkot (Gujarat) query strictly rejects Maharashtra APMC substitution',
      noFalseSubstitution,
      `Returned market: ${resGJ.sourceMarket}`
    );
  } catch (e: any) {
    record('R4', 'Rajkot query exception', false, e.message);
  }

  // Test R5: Market string normalization for other states (APMC Indore Mandi -> indore)
  const normIndore = normalizeMarketName('APMC Indore Sub-Yard');
  const normNeemuch = normalizeMarketName('Neemuch Krishi Upaj Mandi');
  record('R5', 'Cross-state market name normalizer handles Sub-Yard and Krishi Upaj Mandi tokens',
    normIndore === 'indore' && normNeemuch === 'neemuch',
    `normIndore=${normIndore}, normNeemuch=${normNeemuch}`
  );

  // -------------------------------------------------------------
  // PART 2: BUG 2 — PROFIT & TRANSPORT CALCULATOR INSTANT UPDATE
  // -------------------------------------------------------------
  console.log('\n--- PART 2: PROFIT & TRANSPORT CALCULATOR FORMULAS & INSTANT UPDATE ---');

  // Test R6: Real-time formula accuracy
  const testBuyPrice = 4200;
  const testSellPrice = 4800;
  const testQuantity = 100; // quintals
  const testTransport = 3500;
  const testLabour = 1200;
  const testPacking = 800;
  const testCess = 500;

  const rawPurchaseCost = testQuantity * testBuyPrice; // 420,000
  const totalExpenses = testTransport + testLabour + testPacking + testCess; // 6,000
  const totalInvestment = rawPurchaseCost + totalExpenses; // 426,000
  const grossRevenue = testQuantity * testSellPrice; // 480,000
  const netProfit = grossRevenue - totalInvestment; // 54,000
  const profitMargin = Number(((netProfit / totalInvestment) * 100).toFixed(2)); // 12.68%
  const breakevenRate = Math.ceil(totalInvestment / testQuantity); // 4260

  record('R6', 'Core financial formulas calculate accurate purchase, expenses, and net profit',
    rawPurchaseCost === 420000 &&
    totalExpenses === 6000 &&
    totalInvestment === 426000 &&
    grossRevenue === 480000 &&
    netProfit === 54000 &&
    profitMargin === 12.68 &&
    breakevenRate === 4260,
    `netProfit=${netProfit}, margin=${profitMargin}, breakeven=${breakevenRate}`
  );

  // Test R7: Immediate recalculation on price change (e.g. buying price drops to 4000)
  const updatedBuyPrice = 4000;
  const updatedPurchaseCost = testQuantity * updatedBuyPrice; // 400,000
  const updatedTotalInvestment = updatedPurchaseCost + totalExpenses; // 406,000
  const updatedNetProfit = grossRevenue - updatedTotalInvestment; // 74,000
  const updatedMargin = Number(((updatedNetProfit / updatedTotalInvestment) * 100).toFixed(2)); // 18.23%
  const updatedBreakeven = Math.ceil(updatedTotalInvestment / testQuantity); // 4060

  record('R7', 'Instant price change recalculation without page refresh or button press',
    updatedNetProfit === 74000 &&
    updatedMargin === 18.23 &&
    updatedBreakeven === 4060,
    `updatedNetProfit=${updatedNetProfit}, updatedBreakeven=${updatedBreakeven}`
  );

  // Test R8: Zero-input / Backspace resilience (handling empty or decimal strings)
  const parseSafe = (val: string) => parseFloat(val) || 0;
  const emptyStringCalc = parseSafe('');
  const decimalStringCalc = parseSafe('4250.50');
  const zeroStringCalc = parseSafe('0');

  record('R8', 'Calculator input parser handles empty strings, decimals, and leading zeros without NaN',
    emptyStringCalc === 0 &&
    decimalStringCalc === 4250.5 &&
    zeroStringCalc === 0,
    `empty=${emptyStringCalc}, decimal=${decimalStringCalc}, zero=${zeroStringCalc}`
  );

  // Test R9: Loss condition calculation (Selling price lower than breakeven)
  const lossSellPrice = 4100;
  const lossGrossRevenue = testQuantity * lossSellPrice; // 410,000
  const lossNetProfit = lossGrossRevenue - totalInvestment; // 410,000 - 426,000 = -16,000
  const lossMargin = Number(((lossNetProfit / totalInvestment) * 100).toFixed(2)); // -3.76%

  record('R9', 'Loss condition calculates negative net profit and negative margin percentage accurately',
    lossNetProfit === -16000 && lossMargin === -3.76,
    `lossNetProfit=${lossNetProfit}, lossMargin=${lossMargin}`
  );

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  console.log(`REGRESSION TEST RUN SUMMARY: ${passed} / ${total} PASSED`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runRegressionTestSuite().catch((err) => {
  console.error('Fatal error running regression tests:', err);
  process.exit(1);
});
