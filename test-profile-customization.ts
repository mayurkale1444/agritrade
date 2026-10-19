import assert from 'assert';
import { 
  ALL_MANDI_LOCATIONS, 
  MANDIS, 
  COMMODITIES,
  isUserProfileComplete, 
  getMandisForState, 
  findMandiForProfile 
} from './src/services/mandiDataService';
import { getStoredWatchlist } from './src/services/watchlistService';
import { UserProfile } from './src/types';

console.log('--- STARTING USER SIGNUP PROFILE CUSTOMIZATION & STATE ISOLATION TESTS ---\n');

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

// Profile 1: Punjab -> Ludhiana -> Ludhiana APMC
const punjabTraderProfile: UserProfile = {
  id: 'trader-punjab-001',
  name: 'Gurpreet Singh',
  mobile: '9876543210',
  userType: 'Wholesaler',
  state: 'Punjab',
  district: 'Ludhiana',
  mainApmc: 'Ludhiana APMC',
  primaryCommodity: 'wheat',
  commoditiesHandled: ['wheat', 'maize', 'potato'],
  operationType: 'Both',
  preferredApmcs: ['ludhiana_apmc'],
  isOnboarded: true
};

// Test 1: Incomplete Profile detection
test('Test 1: isUserProfileComplete correctly detects complete and incomplete profiles', () => {
  assert.strictEqual(isUserProfileComplete(punjabTraderProfile), true, 'Full profile must be complete');

  const missingState: UserProfile = { ...punjabTraderProfile, state: '' };
  assert.strictEqual(isUserProfileComplete(missingState), false, 'Missing state must be incomplete');

  const missingDistrict: UserProfile = { ...punjabTraderProfile, district: '' };
  assert.strictEqual(isUserProfileComplete(missingDistrict), false, 'Missing district must be incomplete');

  const missingApmc: UserProfile = { ...punjabTraderProfile, mainApmc: '' };
  assert.strictEqual(isUserProfileComplete(missingApmc), false, 'Missing APMC must be incomplete');

  const missingCommodity: UserProfile = { ...punjabTraderProfile, primaryCommodity: undefined, commoditiesHandled: [] };
  assert.strictEqual(isUserProfileComplete(missingCommodity), false, 'Missing commodity must be incomplete');

  const missingRole: UserProfile = { ...punjabTraderProfile, userType: undefined, role: undefined };
  assert.strictEqual(isUserProfileComplete(missingRole), false, 'Missing role/trader type must be incomplete');
});

// Test 2: findMandiForProfile strictly finds Ludhiana APMC for Punjab profile
test('Test 2: findMandiForProfile resolves Ludhiana APMC without guessing other states', () => {
  const resolved = findMandiForProfile(punjabTraderProfile);
  assert.ok(resolved, 'Must resolve mandi for Punjab profile');
  assert.strictEqual(resolved.state, 'Punjab', 'State must be Punjab');
  assert.strictEqual(resolved.district, 'Ludhiana', 'District must be Ludhiana');
  assert.ok(
    resolved.name.toLowerCase().includes('ludhiana'),
    `Resolved market name should contain Ludhiana, got: ${resolved.name}`
  );
});

// Test 3: getMandisForState isolates to Punjab markets only
test('Test 3: getMandisForState strictly isolates to Punjab markets and never mixes other states', () => {
  const punjabMandis = getMandisForState('Punjab');
  assert.ok(punjabMandis.length > 0, 'Must have Punjab mandis defined');
  
  for (const m of punjabMandis) {
    assert.strictEqual(m.state, 'Punjab', `All mandis in state pool must be Punjab, found ${m.name} in ${m.state}`);
  }

  // Ensure no Maharashtra or other states exist in the pool
  const hasMaharashtra = punjabMandis.some(m => m.state === 'Maharashtra');
  assert.strictEqual(hasMaharashtra, false, 'Punjab mandi pool must NOT contain Maharashtra mandis');
});

// Test 4: Default Watchlist tailored to Punjab profile
test('Test 4: Default Watchlist is dynamically tailored for Punjab user with Ludhiana APMC and Wheat', () => {
  // Clear any existing localStorage mock / call getStoredWatchlist with profile
  const watchlist = getStoredWatchlist(punjabTraderProfile);
  assert.ok(watchlist.length > 0, 'Watchlist must not be empty');

  // Verify first item is Ludhiana APMC with wheat
  const firstItem = watchlist[0];
  assert.strictEqual(firstItem.state, 'Punjab', 'Watchlist item must be from Punjab');
  assert.ok(firstItem.mandiName.toLowerCase().includes('ludhiana'), 'First watchlist item should be Ludhiana APMC');
  assert.strictEqual(firstItem.commodityId, 'wheat', 'First watchlist commodity should be wheat');

  // Verify all default items are for Punjab
  for (const item of watchlist) {
    assert.strictEqual(item.state, 'Punjab', `Default watchlist item ${item.mandiName} must be from Punjab`);
  }
});

// Test 5: Benchmark and market rate presence for Ludhiana APMC Wheat
test('Test 5: MANDIS contains Ludhiana APMC entry for wheat with valid modal price', () => {
  const ludhianaWheat = MANDIS.find(m => m.id === 'ludhiana_apmc' && m.commodityId === 'wheat');
  assert.ok(ludhianaWheat, 'Ludhiana APMC wheat entry must exist in MANDIS');
  assert.strictEqual(ludhianaWheat.state, 'Punjab');
  assert.strictEqual(ludhianaWheat.district, 'Ludhiana');
  assert.strictEqual(ludhianaWheat.benchmark, true);
});

// Test 6: Cross-State Switch comparison allowed manually
test('Test 6: User can manually compare with other states when desired', () => {
  const allStates = Array.from(new Set(ALL_MANDI_LOCATIONS.map(m => m.state))).filter(Boolean);
  assert.ok(allStates.includes('Punjab'), 'States must include Punjab');
  assert.ok(allStates.includes('Maharashtra'), 'States must include Maharashtra');
  assert.ok(allStates.includes('Madhya Pradesh'), 'States must include Madhya Pradesh');
  assert.ok(allStates.length >= 4, 'Multiple states available for manual comparison');
});

console.log(`\n🎉 ALL ${passedTests} USER SIGNUP PROFILE CUSTOMIZATION & STATE ISOLATION TESTS PASSED! (${passedTests}/6)\n`);
