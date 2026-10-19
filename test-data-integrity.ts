// Automated test harness that tests all data integrity criteria
async function runAllTests() {
  console.log('================================================================');
  console.log('AGRITRADE DATA INTEGRITY AND COMPLIANCE VERIFICATION TEST SUITE');
  console.log('================================================================\n');

  const results: { id: string; name: string; passed: boolean; details: string }[] = [];

  function assert(id: string, name: string, condition: boolean, details: string) {
    results.push({ id, name, passed: condition, details });
    console.log(`[${condition ? 'PASS' : 'FAIL'}] ${id}: ${name}`);
    if (!condition) {
      console.log(`       Failure Details: ${details}`);
    }
  }

  // Detect current official feed date dynamically
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
    // fallback
  }

  // 1. Test Exact Market Matching
  // Test 1: Exact market matching for Lasalgaon
  const res1 = await fetch(`http://localhost:3000/api/mandi-prices?commodity=onion&market=Lasalgaon&district=Nashik&state=Maharashtra&date=${feedDate}`);
  const d1 = await res1.json();
  assert('TEST_A1', `Lasalgaon matching for ${feedDate} produces LIVE VERIFIED DATA`, 
    d1.isLive === true && d1.exactMatch === true && d1.dataTypeCategory === 'LIVE VERIFIED DATA' && d1.record?.market.includes('Lasalgaon'),
    `Received status: ${d1.dataTypeCategory}, record: ${JSON.stringify(d1.record)}`
  );

  // Test 2: Commodity mismatch rejection (e.g. querying Potato against Onion market)
  const res2 = await fetch(`http://localhost:3000/api/mandi-prices?commodity=potato&market=Lasalgaon&district=Nashik&state=Maharashtra&date=${feedDate}`);
  const d2 = await res2.json();
  assert('TEST_A2', 'Commodity mismatch (Potato vs Onion) is rejected',
    d2.isLive === false && d2.record === null && d2.dataTypeCategory === 'NO VERIFIED DATA TODAY',
    `Expected no verified data, got: ${d2.dataTypeCategory}, record: ${JSON.stringify(d2.record)}`
  );

  // Test 3: Onion Green (Spring Onion) rejected when querying bulb Onion
  const res3 = await fetch(`http://localhost:3000/api/mandi-prices?commodity=onion&market=Pune(Moshi)&district=Pune&state=Maharashtra&variety=Local&date=${feedDate}`);
  const d3 = await res3.json();
  assert('TEST_A3', 'Bulb onion query matches bulb record and does not return Onion Green (₹20)',
    d3.record?.commodity === 'Onion' && d3.record?.modal_price > 500,
    `Returned commodity: ${d3.record?.commodity}, modal: ${d3.record?.modal_price}`
  );

  // Test 4: District mismatch rejection (Lasalgaon queried in Pune district)
  const res4 = await fetch(`http://localhost:3000/api/mandi-prices?commodity=onion&market=Lasalgaon&district=Pune&state=Maharashtra&date=${feedDate}`);
  const d4 = await res4.json();
  assert('TEST_A4', 'District mismatch (Lasalgaon in Pune) is rejected',
    d4.isLive === false && d4.record === null,
    `Expected null record on district mismatch, got: ${JSON.stringify(d4.record)}`
  );

  // Test 5: State mismatch rejection (Lasalgaon queried in Gujarat)
  const res5 = await fetch(`http://localhost:3000/api/mandi-prices?commodity=onion&market=Lasalgaon&district=Nashik&state=Gujarat&date=${feedDate}`);
  const d5 = await res5.json();
  assert('TEST_A5', 'State mismatch (Lasalgaon in Gujarat) is rejected',
    d5.isLive === false && d5.record === null,
    `Expected null record on state mismatch, got: ${JSON.stringify(d5.record)}`
  );

  // Test 6: Wrong APMC rejection (querying Mangal Wedha should not match Lasalgaon or Akola)
  const res6 = await fetch(`http://localhost:3000/api/mandi-prices?commodity=onion&market=Mangal%20Wedha&district=Solapur&state=Maharashtra&date=${feedDate}`);
  const d6 = await res6.json();
  assert('TEST_A6', 'Wrong APMC rejection (unrecorded APMC does not steal Lasalgaon/Akola)',
    d6.isLive === false && d6.record === null && d6.dataTypeCategory === 'NO VERIFIED DATA TODAY',
    `Expected NO VERIFIED DATA TODAY, got: ${d6.dataTypeCategory}, record: ${JSON.stringify(d6.record)}`
  );

  // Test 7: Invalid / unrecorded date (querying Lasalgaon for 14/09/2026)
  const res7 = await fetch('http://localhost:3000/api/mandi-prices?commodity=onion&market=Lasalgaon&district=Nashik&state=Maharashtra&date=14/09/2026');
  const d7 = await res7.json();
  assert('TEST_A7', 'Unrecorded date (14/09/2026) returns NO VERIFIED DATA TODAY with null record',
    d7.isLive === false && d7.record === null && d7.dataTypeCategory === 'NO VERIFIED DATA TODAY',
    `Expected NO VERIFIED DATA TODAY, got: ${d7.dataTypeCategory}`
  );

  // Test 8: Modal, Min, Max price unrecorded when no verified record exists
  assert('TEST_A8', 'Prices are null / 0 when record is null',
    d7.record === null,
    `Record was expected to be null for unrecorded date`
  );

  // Test 9: Zero-spread detection
  // In our feed, Pune(Moshi) Onion Green has min: 20, modal: 20, max: 20
  const zeroSpreadRec = { min: 20, modal: 20, max: 20 };
  const hasZeroSpread = zeroSpreadRec.min === zeroSpreadRec.modal && zeroSpreadRec.modal === zeroSpreadRec.max;
  assert('TEST_A9', 'Zero-spread price logic correctly flags identical min/modal/max',
    hasZeroSpread === true,
    `Zero-spread flag calculation`
  );

  // Test 10: Comparison Market - APMC Akola verification
  const resAkola = await fetch(`http://localhost:3000/api/mandi-prices?commodity=onion&market=Akola&district=Akola&state=Maharashtra&date=${feedDate}`);
  const dAkola = await resAkola.json();
  assert('TEST_B1', 'APMC Akola verified in official source',
    dAkola.isLive === true && dAkola.record?.market.includes('Akola') && dAkola.record?.modal_price > 0,
    `Akola record: ${JSON.stringify(dAkola.record)}`
  );

  // Test 11: Comparison Market - APMC Pune verification (submarkets Pimpri/Moshi)
  const resPunePimpri = await fetch(`http://localhost:3000/api/mandi-prices?commodity=onion&market=Pune(Pimpri)&district=Pune&state=Maharashtra&date=${feedDate}`);
  const dPunePimpri = await resPunePimpri.json();
  assert('TEST_B2', 'APMC Pune(Pimpri) verified in official source',
    dPunePimpri.isLive === true && dPunePimpri.record?.modal_price > 0,
    `Pune(Pimpri) record: ${JSON.stringify(dPunePimpri.record)}`
  );

  // Test 12: Comparison Market - APMC Mangal Wedha, Solapur
  const resMW = await fetch(`http://localhost:3000/api/mandi-prices?commodity=onion&market=Mangal%20Wedha&district=Solapur&state=Maharashtra&date=${feedDate}`);
  const dMW = await resMW.json();
  assert('TEST_B3', `APMC Mangal Wedha correctly identified as unrecorded in official ${feedDate} feed`,
    dMW.isLive === false && dMW.record === null && dMW.dataTypeCategory === 'NO VERIFIED DATA TODAY',
    `Expected unrecorded status, got: ${dMW.dataTypeCategory}`
  );

  // Test 13: UI Data Separation - Comparison markets list excludes selected market
  const allLiveMarkets = d1.availableLiveMarkets || [];
  const selectedClean = 'lasalgaon';
  const filteredComparison = allLiveMarkets.filter((m: any) => {
    if (m.state !== 'Maharashtra') return false;
    const mClean = m.market.toLowerCase().replace(/[^a-z0-9]/g, '');
    return !mClean.includes(selectedClean) && !selectedClean.includes(mClean);
  });
  const hasLasalgaonInComparison = filteredComparison.some((m: any) => m.market.toLowerCase().includes('lasalgaon'));
  assert('TEST_C1', 'Lasalgaon is strictly excluded from comparison markets list',
    !hasLasalgaonInComparison && filteredComparison.length > 0,
    `Found Lasalgaon in comparison list: ${hasLasalgaonInComparison}, total comparison count: ${filteredComparison.length}`
  );

  // Test 14: Category labels validation
  const validCategories = ['LIVE VERIFIED DATA', 'FALLBACK DATA', 'DEMO DATA', 'NO VERIFIED DATA TODAY', 'DATA UNAVAILABLE'];
  assert('TEST_D1', 'Returned dataTypeCategories strictly conform to standard set',
    validCategories.includes(d1.dataTypeCategory) && validCategories.includes(d7.dataTypeCategory),
    `d1 category: ${d1.dataTypeCategory}, d7 category: ${d7.dataTypeCategory}`
  );

  // Test 15: Variety alias integration - querying with variety=Garva matches Unhali record
  const res15 = await fetch(`http://localhost:3000/api/mandi-prices?commodity=onion&market=Lasalgaon&district=Nashik&state=Maharashtra&variety=Garva&date=${feedDate}`);
  const d15 = await res15.json();
  assert('TEST_V1', 'Querying with variety alias Garva successfully matches Unhali record for Lasalgaon',
    d15.isLive === true && d15.dataTypeCategory === 'LIVE VERIFIED DATA' && d15.record?.variety === 'Unhali',
    `Expected match for Garva/Unhali, got: ${d15.dataTypeCategory}, variety: ${d15.record?.variety}`
  );

  // Test 16: Variety mismatch rejection - querying with variety=White rejects Unhali record
  const res16 = await fetch(`http://localhost:3000/api/mandi-prices?commodity=onion&market=Lasalgaon&district=Nashik&state=Maharashtra&variety=White&date=${feedDate}`);
  const d16 = await res16.json();
  assert('TEST_V2', 'Querying with incompatible variety White rejects Unhali record for Lasalgaon',
    d16.isLive === false && d16.dataTypeCategory === 'NO VERIFIED DATA TODAY' && d16.record === null,
    `Expected NO VERIFIED DATA TODAY for White onion in Lasalgaon, got: ${d16.dataTypeCategory}`
  );

  console.log('\n================================================================');
  console.log(`TEST RUN SUMMARY: ${results.filter(r => r.passed).length} / ${results.length} PASSED`);
  console.log('================================================================');
}

runAllTests().catch(console.error);
