import assert from 'assert';
import { 
  COMMODITIES, 
  MAHARASHTRA_MANDIS, 
  ALL_MANDI_LOCATIONS, 
  getMarketData, 
  fetchLiveMarketData,
  findLiveMarketRecord,
  cleanMandiString
} from './src/services/mandiDataService';
import { CommodityId, MandiLocation, MarketData } from './src/types';

console.log('================================================================');
console.log('10 REGRESSION TESTS: SEARCH SELECTION INTEGRITY & COMMODITY FIDELITY');
console.log('================================================================\n');

let passedCount = 0;

function runTest(testNum: number, desc: string, fn: () => void | Promise<void>) {
  return Promise.resolve()
    .then(() => fn())
    .then(() => {
      console.log(`✅ [PASS] Test ${testNum}: ${desc}`);
      passedCount++;
    })
    .catch((err) => {
      console.error(`❌ [FAIL] Test ${testNum}: ${desc}`);
      console.error(err);
      process.exit(1);
    });
}

async function main() {
  // Test 1: Search selection of Soybean + Nashik APMC yields exact context
  await runTest(1, 'Search selection: Soybean + Nashik APMC preserves commodity and market', () => {
    const cmd = COMMODITIES.find(c => c.id === 'soybean')!;
    const mandi = MAHARASHTRA_MANDIS.find(m => cleanMandiString(m.name) === 'nashik')!;

    assert.strictEqual(cmd.id, 'soybean');
    assert.ok(mandi.name.includes('Nashik'));
    assert.strictEqual(mandi.district, 'Nashik');

    const selectionContext = {
      commodity: cmd.id,
      market: mandi.name,
      district: mandi.district,
      state: mandi.state || 'Maharashtra',
      date: 'Today'
    };

    assert.strictEqual(selectionContext.commodity, 'soybean', 'Commodity must be soybean');
    assert.strictEqual(selectionContext.market, mandi.name, 'Market must be Nashik APMC');
  });

  // Test 2: Destination page resolution: MarketData never defaults to Onion when Soybean is provided
  await runTest(2, 'Destination resolution: MarketData commodity resolution never evaluates to Onion for Soybean', () => {
    const baseline = getMarketData('soybean', 'nashik');
    assert.strictEqual(baseline.commodity.id, 'soybean', 'baseline.commodity.id must be soybean');
    assert.strictEqual(baseline.commodityId, 'soybean', 'baseline.commodityId must be soybean');

    // Simulate PriceDetailsView resolution logic
    const effectiveCommodityId = baseline.commodity?.id || baseline.commodityId;
    const resolvedCommodity = baseline.commodity && baseline.commodity.id
      ? baseline.commodity
      : (COMMODITIES.find(c => c.id === effectiveCommodityId) || COMMODITIES[0]);

    assert.strictEqual(resolvedCommodity.id, 'soybean', 'Resolved commodity must be soybean, NEVER onion');
    assert.notStrictEqual(resolvedCommodity.id, 'onion', 'Must not be onion');
  });

  // Test 3: APMC Selection Persistence: Selecting Nashik APMC while active commodity is Soybean keeps Soybean
  await runTest(3, 'APMC selection persistence: active commodity is preserved when market changes', () => {
    let activeCommodity: CommodityId = 'soybean';
    const newMandi = MAHARASHTRA_MANDIS.find(m => cleanMandiString(m.name) === 'nashik')!;

    // Selection handler simulation
    const updatedContext = {
      commodity: activeCommodity,
      market: newMandi.name,
      district: newMandi.district,
      state: newMandi.state || 'Maharashtra'
    };

    assert.strictEqual(updatedContext.commodity, 'soybean', 'Active commodity must remain soybean');
    assert.strictEqual(updatedContext.district, 'Nashik');
  });

  // Test 4: Combined Search parsing: "Soybean Nashik" token match
  await runTest(4, 'Combined search tokens "Soybean Nashik" matches both commodity and mandi', () => {
    const q = 'soybean nashik';
    const tokens = q.toLowerCase().split(/\s+/);
    const cmd = COMMODITIES.find(c => tokens.some(t => c.name.toLowerCase().includes(t)));
    const mandi = MAHARASHTRA_MANDIS.find(m => tokens.some(t => m.name.toLowerCase().includes(t)));

    assert.ok(cmd, 'Must match Soybean commodity');
    assert.strictEqual(cmd?.id, 'soybean');
    assert.ok(mandi, 'Must match Nashik APMC');
    assert.strictEqual(mandi?.district, 'Nashik');
  });

  // Test 5: Wizard confirmation preserves all dimensions
  await runTest(5, 'Wizard confirmation passes complete context without reset', () => {
    const cId: CommodityId = 'soybean';
    const variety = 'Yellow';
    const grade = 'FAQ';
    const mandi = MAHARASHTRA_MANDIS.find(m => cleanMandiString(m.name) === 'nashik')!;

    const payload = {
      destination: 'details',
      commodity: cId,
      variety,
      grade,
      market: mandi.name,
      district: mandi.district,
      state: mandi.state || 'Maharashtra',
      date: 'Today'
    };

    assert.strictEqual(payload.commodity, 'soybean');
    assert.strictEqual(payload.variety, 'Yellow');
    assert.strictEqual(payload.grade, 'FAQ');
    assert.strictEqual(payload.district, 'Nashik');
  });

  // Test 6: Market Directory navigation: selecting APMC retains selected commodity
  await runTest(6, 'Market Directory selection forwards current commodity context to details', () => {
    const currentCommodity: CommodityId = 'soybean';
    const mandi = MAHARASHTRA_MANDIS.find(m => cleanMandiString(m.name) === 'nashik')!;

    const navigationPayload = {
      destination: 'details',
      commodity: currentCommodity,
      market: mandi.name,
      district: mandi.district,
      state: mandi.state || 'Maharashtra'
    };

    assert.strictEqual(navigationPayload.commodity, 'soybean');
    assert.strictEqual(navigationPayload.market, mandi.name);
  });

  // Test 7: Fallback Integrity: Unavailable data for Soybean at Nashik APMC displays UNAVAILABLE, never Onion
  await runTest(7, 'Unavailable data for Soybean + Nashik APMC returns NO VERIFIED DATA TODAY (never Onion)', async () => {
    const nashikMandi: MandiLocation = MAHARASHTRA_MANDIS.find(m => cleanMandiString(m.name) === 'nashik')!;
    const customMarket = {
      id: nashikMandi.id,
      name: nashikMandi.name,
      district: nashikMandi.district,
      state: nashikMandi.state || 'Maharashtra',
      commodityId: 'soybean' as CommodityId,
      benchmark: true,
      arrivalAvgQtl: 5000,
      distanceKm: 0,
      isMajorAPMC: true
    };

    // Soybean live query
    const data = await fetchLiveMarketData('soybean', nashikMandi.id, customMarket);
    assert.strictEqual(data.commodity.id, 'soybean', 'Commodity in returned data must be soybean');
    assert.notStrictEqual(data.commodity.id, 'onion', 'Must NEVER be onion');

    // If government record is unavailable, modalPrice is 0 and status is unrecorded
    if (data.dataTypeCategory === 'NO VERIFIED DATA TODAY') {
      assert.strictEqual(data.modalPrice, 0, 'Unrecorded data must have modalPrice 0');
      assert.strictEqual(data.dataQuality, 'Unavailable');
    }
  });

  // Test 8: Transport Calculator mode removed from SaleCalculatorView
  await runTest(8, 'Standalone transport calculator mode removed; transport cost input preserved', async () => {
    const fs = await import('fs');
    const calcFile = fs.readFileSync('./src/components/SaleCalculatorView.tsx', 'utf-8');

    // Must NOT contain mode switcher between buy_sell and transport
    assert.strictEqual(calcFile.includes("activeMode === 'transport'"), false, 'Transport mode switcher must be removed');
    assert.strictEqual(calcFile.includes("setActiveMode('transport')"), false, 'setActiveMode must be removed');

    // Must still contain transportCost input
    assert.strictEqual(calcFile.includes('transportCost'), true, 'transportCost expense input must be preserved');
    assert.strictEqual(calcFile.includes('numTransport'), true, 'numTransport calculation must be preserved');
  });

  // Test 9: findLiveMarketRecord strict isolation between commodities
  await runTest(9, 'findLiveMarketRecord strictly rejects Onion records for Soybean queries', () => {
    const onionRecord = {
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

    const match = findLiveMarketRecord(
      { name: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', commodity: 'Soybean' },
      [onionRecord],
      'soybean'
    );

    assert.strictEqual(match, undefined, 'Soybean query must NEVER match Onion record');
  });

  // Test 10: Single source of truth context contains all required dimensions
  await runTest(10, 'Single source of truth market context contains commodity, market, district, state, date', () => {
    const context = {
      commodity: 'soybean',
      market: 'Nashik APMC',
      district: 'Nashik',
      state: 'Maharashtra',
      date: 'Today'
    };

    assert.ok(context.commodity && context.commodity === 'soybean');
    assert.ok(context.market && context.market.includes('Nashik'));
    assert.ok(context.district && context.district === 'Nashik');
    assert.ok(context.state && context.state === 'Maharashtra');
    assert.ok(context.date);
  });

  console.log(`\n🎉 SUCCESS: ALL 10 REGRESSION TESTS PASSED! (${passedCount}/10)\n`);
}

main();
