import assert from 'assert';
import { cleanMandiString, normalizeDistrict, isVarietyMatch, findLiveMarketRecord, COMMODITIES, MAHARASHTRA_MANDIS } from './src/services/mandiDataService';
import { isMatchingTraderReport } from './src/services/traderReportService';
import { TraderSubmittedReport, AvailableLiveMarket } from './src/types';

console.log('--- STARTING 12 CRITICAL FILTERING & SEARCH INTEGRITY REGRESSION TESTS ---\n');

let passedTests = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err: any) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

// 1. Never mix commodities: Soybean + Nashik APMC must NEVER match an Onion record
test('Test 1: isMarketMatch / findLiveMarketRecord never matches Onion for Soybean selection', () => {
  const onionLiveRecord: AvailableLiveMarket = {
    market: 'Nashik APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    commodity: 'Onion',
    variety: 'Red',
    modal_price: 3200,
    min_price: 2500,
    max_price: 3800,
    arrival_date: '15/09/2026'
  };

  const matched = findLiveMarketRecord(
    { name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', commodity: 'Soybean' },
    [onionLiveRecord],
    'soybean'
  );

  assert.strictEqual(matched, undefined, 'Soybean query MUST NOT match an Onion market record!');
});

// 2. Soybean + Nashik APMC strictly matches Soybean record
test('Test 2: Soybean + Nashik APMC matches verified Soybean record', () => {
  const soybeanLiveRecord: AvailableLiveMarket = {
    market: 'Nashik APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    commodity: 'Soybean',
    variety: 'Yellow',
    modal_price: 4950,
    min_price: 4600,
    max_price: 5200,
    arrival_date: '15/09/2026'
  };

  const matched = findLiveMarketRecord(
    { name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', commodity: 'Soybean' },
    [soybeanLiveRecord],
    'soybean'
  );

  assert.ok(matched, 'Must find matching Soybean record');
  assert.strictEqual(matched?.commodity, 'Soybean');
  assert.strictEqual(matched?.modal_price, 4950);
});

// 3. Onion + Nashik APMC strictly matches Onion, not Soybean
test('Test 3: Onion + Nashik APMC matches Onion, never Soybean', () => {
  const records: AvailableLiveMarket[] = [
    {
      market: 'Nashik APMC',
      district: 'Nashik',
      state: 'Maharashtra',
      commodity: 'Soybean',
      variety: 'Yellow',
      modal_price: 4950,
      min_price: 4600,
      max_price: 5200,
      arrival_date: '15/09/2026'
    },
    {
      market: 'Nashik APMC',
      district: 'Nashik',
      state: 'Maharashtra',
      commodity: 'Onion',
      variety: 'Red',
      modal_price: 3100,
      min_price: 2400,
      max_price: 3600,
      arrival_date: '15/09/2026'
    }
  ];

  const matched = findLiveMarketRecord(
    { name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', commodity: 'Onion' },
    records,
    'onion'
  );

  assert.ok(matched, 'Must find Onion record');
  assert.strictEqual(matched?.commodity, 'Onion');
  assert.strictEqual(matched?.modal_price, 3100);
});

// 4. Trader report filter: Soybean + Nashik APMC matches Soybean Nashik trader report
test('Test 4: Trader report for Soybean Nashik APMC matches Soybean + Nashik selection', () => {
  const report: TraderSubmittedReport = {
    id: 'tr-soy-nashik-1',
    traderId: 'tr-101',
    traderName: 'Ramesh Patil',
    role: 'Trader',
    mainAPMC: 'Nashik APMC',
    commodity: 'Soybean',
    commodityName: 'Soybean',
    marketName: 'Nashik APMC',
    apmc: 'Nashik APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    modalPrice: 5200,
    minPrice: 5000,
    maxPrice: 5350,
    verificationStatus: 'VERIFIED',
    sourceType: 'TRADER_REPORTED',
    reportDate: '15/09/2026',
    submittedAt: '15/09/2026'
  };

  const matches = isMatchingTraderReport(report, 'soybean', 'Nashik APMC', 'Nashik');
  assert.strictEqual(matches, true, 'Trader report must match Soybean + Nashik APMC');
});

// 5. Trader report filter: Onion + Nashik APMC DOES NOT match Soybean Nashik trader report
test('Test 5: Trader report for Soybean Nashik APMC rejected when Onion is selected', () => {
  const report: TraderSubmittedReport = {
    id: 'tr-soy-nashik-1',
    traderId: 'tr-101',
    traderName: 'Ramesh Patil',
    role: 'Trader',
    mainAPMC: 'Nashik APMC',
    commodity: 'Soybean',
    commodityName: 'Soybean',
    marketName: 'Nashik APMC',
    apmc: 'Nashik APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    modalPrice: 5200,
    minPrice: 5000,
    maxPrice: 5350,
    verificationStatus: 'VERIFIED',
    sourceType: 'TRADER_REPORTED',
    reportDate: '15/09/2026',
    submittedAt: '15/09/2026'
  };

  const matches = isMatchingTraderReport(report, 'onion', 'Nashik APMC', 'Nashik');
  assert.strictEqual(matches, false, 'Trader report for Soybean MUST NOT match Onion selection!');
});

// 6. Trader report filter: Soybean + Pune APMC DOES NOT match Soybean Nashik trader report
test('Test 6: Trader report for Soybean Nashik APMC rejected when Pune APMC is selected', () => {
  const report: TraderSubmittedReport = {
    id: 'tr-soy-nashik-1',
    traderId: 'tr-101',
    traderName: 'Ramesh Patil',
    role: 'Trader',
    mainAPMC: 'Nashik APMC',
    commodity: 'Soybean',
    commodityName: 'Soybean',
    marketName: 'Nashik APMC',
    apmc: 'Nashik APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    modalPrice: 5200,
    minPrice: 5000,
    maxPrice: 5350,
    verificationStatus: 'VERIFIED',
    sourceType: 'TRADER_REPORTED',
    reportDate: '15/09/2026',
    submittedAt: '15/09/2026'
  };

  const matches = isMatchingTraderReport(report, 'soybean', 'Pune APMC', 'Pune');
  assert.strictEqual(matches, false, 'Trader report for Nashik MUST NOT match Pune selection!');
});

// 7. No verified record returns undefined, never a substitute commodity
test('Test 7: No official record for Cotton at Nashik returns undefined (never substitute)', () => {
  const records: AvailableLiveMarket[] = [
    {
      market: 'Nashik APMC',
      district: 'Nashik',
      state: 'Maharashtra',
      commodity: 'Onion',
      variety: 'Red',
      modal_price: 3100,
      min_price: 2400,
      max_price: 3600,
      arrival_date: '15/09/2026'
    }
  ];

  const matched = findLiveMarketRecord(
    { name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', commodity: 'Cotton' },
    records,
    'cotton'
  );

  assert.strictEqual(matched, undefined, 'Must not return Onion when Cotton is requested!');
});

// 8. Variety matching preserves distinct variety boundaries (e.g. Red vs White Onion)
test('Test 8: Red onion does not match White onion variety', () => {
  const match = isVarietyMatch('Red', 'White', 'onion');
  assert.strictEqual(match, false, 'Red onion must not match White onion');
});

// 9. Variety matching permits aliases within the same cluster (e.g. Unhali and Garva)
test('Test 9: Unhali matches Garva / Summer onion variety alias', () => {
  const match = isVarietyMatch('Unhali', 'Garva', 'onion');
  assert.strictEqual(match, true, 'Unhali and Garva must match as valid aliases');
});

// 10. Nashik APMC is present in mandis list
test('Test 10: Nashik APMC exists in MAHARASHTRA_MANDIS with district Nashik', () => {
  const nashik = MAHARASHTRA_MANDIS.find(m => cleanMandiString(m.name) === 'nashik');
  assert.ok(nashik, 'Nashik APMC must exist in MAHARASHTRA_MANDIS');
  assert.strictEqual(normalizeDistrict(nashik?.district), 'nashik');
});

// 11. Search query logic supports APMC search
test('Test 11: Mandi search supports APMC names like Nashik APMC', () => {
  const q = 'nashik apmc';
  const matched = MAHARASHTRA_MANDIS.filter(m => {
    const mName = m.name.toLowerCase();
    const mDist = m.district.toLowerCase();
    return mName.includes('nashik') || mDist.includes('nashik');
  });
  assert.ok(matched.length > 0, 'Must match Nashik APMC in search');
});

// 12. Combined commodity and mandi search logic
test('Test 12: Combined search tokens "Soybean Nashik" matches both commodity and mandi', () => {
  const query = 'soybean nashik';
  const tokens = query.toLowerCase().split(/\s+/);
  const cmd = COMMODITIES.find(c => tokens.some(t => c.name.toLowerCase().includes(t)));
  const mandi = MAHARASHTRA_MANDIS.find(m => tokens.some(t => m.name.toLowerCase().includes(t)));

  assert.ok(cmd, 'Must identify commodity Soybean');
  assert.strictEqual(cmd?.id, 'soybean');
  assert.ok(mandi, 'Must identify mandi Nashik');
  assert.strictEqual(mandi?.district, 'Nashik');
});

console.log(`\n🎉 ALL 12 FILTERING & SEARCH INTEGRITY REGRESSION TESTS PASSED! (${passedTests}/12)\n`);
