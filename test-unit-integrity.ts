import { fetchLiveMarketData, getMarketData, getDemoMarketData, cleanMandiString, normalizeVariety, isVarietyMatch } from './src/services/mandiDataService';
import { CommodityId, MandiMarket } from './src/types';

async function runUnitTests() {
  console.log('\n================================================================');
  console.log('UNIT TEST SUITE: CLIENT SERVICE & DATA INTEGRITY');
  console.log('================================================================\n');

  const unitResults: { id: string; name: string; passed: boolean; error?: string }[] = [];

  function record(id: string, name: string, condition: boolean, error?: string) {
    unitResults.push({ id, name, passed: condition, error });
    console.log(`[${condition ? 'PASS' : 'FAIL'}] ${id}: ${name}`);
    if (!condition && error) {
      console.log(`       Error: ${error}`);
    }
  }

  // 1. Test fetchLiveMarketData when API returns LIVE VERIFIED DATA for Lasalgaon
  try {
    const customLasalgaon: MandiMarket = {
      id: 'lasalgaon',
      name: 'Lasalgaon',
      district: 'Nashik',
      state: 'Maharashtra',
      commodityId: 'onion',
      benchmark: true,
      arrivalAvgQtl: 10000,
      distanceKm: 22,
      isMajorAPMC: true
    };

    const resLive = await fetchLiveMarketData('onion', 'lasalgaon', customLasalgaon);
    record('U1', 'fetchLiveMarketData retrieves verified Lasalgaon Onion record',
      resLive.isLive === true &&
      resLive.dataTypeCategory === 'LIVE VERIFIED DATA' &&
      resLive.modalPrice > 0 &&
      resLive.minPrice > 0 &&
      resLive.maxPrice >= resLive.modalPrice &&
      resLive.sourceMarket.includes('Lasalgaon'),
      `Got: modal=${resLive.modalPrice}, status=${resLive.dataTypeCategory}, market=${resLive.sourceMarket}`
    );

    record('U2', 'No comparison prices inserted into Lasalgaon object',
      resLive.mandi.name === 'Lasalgaon' &&
      !resLive.sourceMarket.includes('Akola') &&
      !resLive.sourceMarket.includes('Pune') &&
      !resLive.sourceMarket.includes('Mangal'),
      `sourceMarket was: ${resLive.sourceMarket}`
    );

    record('U3', 'Trade signals and artificial trend disabled on single-day official record',
      resLive.tradeSignal === 'Insufficient Data' &&
      resLive.trend === 'Unavailable' &&
      resLive.hasVerifiedHistoricalData === false,
      `trend=${resLive.trend}, signal=${resLive.tradeSignal}`
    );
  } catch (e: any) {
    record('U1', 'fetchLiveMarketData exception', false, e.message);
  }

  // 2. Test fetchLiveMarketData for a market with NO verified record (e.g. Baramati for Onion)
  try {
    const customBaramati: MandiMarket = {
      id: 'baramati',
      name: 'Baramati',
      district: 'Pune',
      state: 'Maharashtra',
      commodityId: 'onion',
      benchmark: false,
      arrivalAvgQtl: 1000,
      distanceKm: 120,
      isMajorAPMC: false
    };

    const resNoData = await fetchLiveMarketData('onion', 'baramati', customBaramati);
    record('U4', 'Market with no official report returns NO VERIFIED DATA TODAY',
      resNoData.isLive === false &&
      resNoData.dataTypeCategory === 'NO VERIFIED DATA TODAY' &&
      resNoData.modalPrice === 0 &&
      resNoData.minPrice === 0 &&
      resNoData.maxPrice === 0,
      `Expected modal=0, status=NO VERIFIED DATA TODAY; got modal=${resNoData.modalPrice}, status=${resNoData.dataTypeCategory}`
    );

    record('U5', 'Market with no record does not invent estimated or average price',
      resNoData.currentPrice === 0 &&
      resNoData.rawGovRecord === null,
      `currentPrice=${resNoData.currentPrice}, rawGovRecord=${resNoData.rawGovRecord}`
    );
  } catch (e: any) {
    record('U4', 'No-data test exception', false, e.message);
  }

  // 3. Test getMarketData fallback labeling
  const fallback = getMarketData('onion', 'lasalgaon');
  record('U6', 'getMarketData fallback is explicitly labeled FALLBACK DATA',
    fallback.dataTypeCategory === 'FALLBACK DATA' &&
    fallback.isLive === false &&
    fallback.marketsMatch === false,
    `Category: ${fallback.dataTypeCategory}, isLive: ${fallback.isLive}`
  );

  // 4. Test getDemoMarketData simulation labeling
  const demo = getDemoMarketData('onion', 'lasalgaon');
  record('U7', 'getDemoMarketData is explicitly labeled DEMO DATA',
    demo.dataTypeCategory === 'DEMO DATA' &&
    demo.dataSource.includes('Simulation') &&
    demo.isLive === false,
    `Category: ${demo.dataTypeCategory}, dataSource: ${demo.dataSource}`
  );

  // 5. Test cleanMandiString matching logic
  record('U8', 'cleanMandiString strips noise words and normalizes properly',
    cleanMandiString('APMC Lasalgaon Market Yard') === 'lasalgaon' &&
    cleanMandiString('Pune(Moshi) ') === 'punemoshi' &&
    cleanMandiString('Krishi Mandi Akola') === 'akola',
    `clean results: ${cleanMandiString('APMC Lasalgaon Market Yard')}`
  );

  // 6. Test comparison filtering separation
  const mockAvailableMarkets = [
    { market: 'Lasalgaon(Vinchur)', district: 'Nashik', state: 'Maharashtra', commodity: 'Onion', variety: 'Unhali', grade: 'Local', arrival_date: '15/09/2026', min_price: 1200, modal_price: 4300, max_price: 4660 },
    { market: 'APMC Akola', district: 'Akola', state: 'Maharashtra', commodity: 'Onion', variety: 'Other', grade: 'Local', arrival_date: '15/09/2026', min_price: 2000, modal_price: 3600, max_price: 5000 },
    { market: 'Pune(Pimpri)', district: 'Pune', state: 'Maharashtra', commodity: 'Onion', variety: 'Local', grade: 'Local', arrival_date: '15/09/2026', min_price: 3500, modal_price: 4000, max_price: 4500 }
  ];

  const currentClean = cleanMandiString('Lasalgaon');
  const separatedComparison = mockAvailableMarkets.filter(m => {
    if (m.state !== 'Maharashtra') return false;
    const mClean = cleanMandiString(m.market);
    const isCurrent =
      mClean === currentClean ||
      (currentClean.length >= 5 && mClean.includes(currentClean)) ||
      (mClean.length >= 5 && currentClean.includes(mClean));
    return !isCurrent;
  });

  record('U9', 'Separated comparison strictly filters out Lasalgaon',
    separatedComparison.length === 2 &&
    !separatedComparison.some(m => m.market.includes('Lasalgaon')),
    `Separated comparison length: ${separatedComparison.length}`
  );

  // 7. Test variety alias normalization
  record('U10', 'Variety alias: Unhali matches Garva / उन्हाळी / Summer Onion',
    isVarietyMatch('Unhali', 'Garva', 'onion') &&
    isVarietyMatch('Unhali', 'उन्हाळी / गरवा कांदा (Garva Onion)', 'onion') &&
    isVarietyMatch('Unhali', 'Summer Onion', 'onion') &&
    isVarietyMatch('Unhali', 'Unhali', 'onion') &&
    isVarietyMatch('Garva', 'Unhali', 'onion'),
    `Unhali matching Garva: ${isVarietyMatch('Unhali', 'Garva', 'onion')}`
  );

  record('U11', 'Variety alias: Red Onion matches Devanagari / English red aliases',
    isVarietyMatch('Red', 'लाल कांदा (Red Onion)', 'onion') &&
    isVarietyMatch('Red', 'Lal', 'onion') &&
    isVarietyMatch('Lal', 'Red', 'onion'),
    `Red match failed`
  );

  record('U12', 'Variety alias: White Onion matches Devanagari / English white aliases',
    isVarietyMatch('White', 'पांढरा कांदा (White Onion)', 'onion') &&
    isVarietyMatch('White', 'Safed', 'onion'),
    `White match failed`
  );

  // 8. Strict rejection of incompatible variety combinations
  record('U13', 'Invalid variety rejection: Unhali strictly rejects Red, White, and Onion Green',
    !isVarietyMatch('Unhali', 'Red', 'onion') &&
    !isVarietyMatch('Unhali', 'लाल कांदा (Red Onion)', 'onion') &&
    !isVarietyMatch('Unhali', 'White', 'onion') &&
    !isVarietyMatch('Unhali', 'पांढरा कांदा (White Onion)', 'onion') &&
    !isVarietyMatch('Unhali', 'Onion Green', 'onion') &&
    !isVarietyMatch('Red', 'Unhali', 'onion') &&
    !isVarietyMatch('White', 'Unhali', 'onion'),
    `Unhali rejected check failed`
  );

  record('U14', 'Invalid variety rejection: Red strictly rejects White and vice versa',
    !isVarietyMatch('Red', 'White', 'onion') &&
    !isVarietyMatch('White', 'Red', 'onion'),
    `Red/White rejection failed`
  );

  // 9. Test arrivalDate safety on unverified / missing responses
  try {
    const unrecordedMarket: MandiMarket = {
      id: 'mangal_wedha',
      name: 'Mangal Wedha',
      district: 'Solapur',
      state: 'Maharashtra',
      commodityId: 'onion',
      benchmark: false,
      arrivalAvgQtl: 500,
      distanceKm: 320,
      isMajorAPMC: false
    };
    const unrecordedResult = await fetchLiveMarketData('onion', 'mangal_wedha', unrecordedMarket);
    record('U15', 'Unrecorded market returns empty arrivalDate (no hardcoded fallback)',
      unrecordedResult.dataTypeCategory === 'NO VERIFIED DATA TODAY' &&
      unrecordedResult.arrivalDate === '',
      `arrivalDate was: "${unrecordedResult.arrivalDate}", category: ${unrecordedResult.dataTypeCategory}`
    );
  } catch (err: any) {
    record('U15', 'Unrecorded market returns empty arrivalDate', false, err?.message);
  }

  console.log('\n================================================================');
  console.log(`UNIT TEST RUN SUMMARY: ${unitResults.filter(r => r.passed).length} / ${unitResults.length} PASSED`);
  console.log('================================================================\n');
}

runUnitTests().catch(console.error);
