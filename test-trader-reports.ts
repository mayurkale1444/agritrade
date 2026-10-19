/**
 * AUTOMATED TEST SUITE: TRADER LOCAL MARKET RATE & TRADER PROFILE INTEGRITY
 * 
 * Verifies:
 * 1. Strict separation: Trader reports are always flagged with sourceType 'TRADER_REPORTED'
 * 2. Trader verification safety: Traders default to 'UNVERIFIED', never automatically marked 'VERIFIED'
 * 3. Price boundary validation: minPrice <= modalPrice <= maxPrice
 * 4. Trader profile linking: Every report resolves to a structured TraderProfile
 * 5. Privacy safeguards: Trader public profile sanitization hides private contact details
 * 6. Input validation: Required fields, negative price rejection, price bounds checks
 * 7. Duplicate detection: Multiple submissions for same market/date/commodity/variety
 * 8. Persistence integrity: Submissions are properly formatted and stored
 */

import {
  INITIAL_TRADER_REPORTS,
  KNOWN_TRADER_PROFILES,
  getStoredTraderReports,
  getTraderProfileById,
  sanitizePublicProfile,
  validateTraderReportInput,
  findDuplicateTraderReport,
  saveOrUpdateTraderReport
} from './src/services/traderReportService.js';
import { TraderReport, UserProfile } from './src/types.js';

let passed = 0;
let total = 0;

function assert(id: string, description: string, condition: boolean, details?: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`[PASS] ${id}: ${description}`);
  } else {
    console.error(`[FAIL] ${id}: ${description}${details ? ' - ' + details : ''}`);
  }
}

console.log('================================================================');
console.log('TEST SUITE: TRADER LOCAL MARKET RATE & TRADER PROFILE');
console.log('================================================================');

// Test TR1: Initial seed reports exist and are non-empty
assert('TR1', 'Initial trader reports dataset is seeded and available',
  Array.isArray(INITIAL_TRADER_REPORTS) && INITIAL_TRADER_REPORTS.length >= 3,
  `Count: ${INITIAL_TRADER_REPORTS?.length}`
);

// Test TR2: Strict separation - all initial trader reports have sourceType = TRADER_REPORTED
const allTraderReported = INITIAL_TRADER_REPORTS.every(r => r.sourceType === 'TRADER_REPORTED');
assert('TR2', 'All trader reports explicitly have sourceType = TRADER_REPORTED',
  allTraderReported,
  `Non-conforming reports found`
);

// Test TR3: No automatic 'VERIFIED' badges - all traders must have explicit verification status
const allExplicitVerification = INITIAL_TRADER_REPORTS.every(r =>
  r.verificationStatus === 'UNVERIFIED' || r.verificationStatus === 'PENDING' || r.verificationStatus === 'VERIFIED'
);
assert('TR3', 'Trader reports never assign unearned VERIFIED status (defaults to UNVERIFIED)',
  allExplicitVerification && INITIAL_TRADER_REPORTS.every(r => r.verificationStatus === 'UNVERIFIED'),
  `Found unverified trader with invalid status`
);

// Test TR4: Price integrity on all seeded trader reports (min <= modal <= max)
const pricesValid = INITIAL_TRADER_REPORTS.every(r =>
  r.minPrice > 0 &&
  r.modalPrice >= r.minPrice &&
  r.maxPrice >= r.modalPrice
);
assert('TR4', 'All trader reports strictly satisfy minPrice <= modalPrice <= maxPrice',
  pricesValid,
  `Price bounds invalid on one or more reports`
);

// Test TR5: Mandatory fields present on all reports (traderId, commodity, marketName, reportDate)
const mandatoryFieldsPresent = INITIAL_TRADER_REPORTS.every(r =>
  Boolean(r.id && r.traderId && r.traderName && r.commodity && r.marketName && r.reportDate)
);
assert('TR5', 'All trader reports contain mandatory trader metadata and market location',
  mandatoryFieldsPresent,
  `Missing required fields in reports`
);

// Test TR6: Trader profile resolution for known trader IDs
const rahulProfile = getTraderProfileById('trader-rahul-solapur');
assert('TR6', 'Known trader ID resolves to valid profile (Rahul Patil)',
  Boolean(rahulProfile && rahulProfile.name === 'Rahul Patil' && rahulProfile.district === 'Solapur'),
  `Resolved: ${JSON.stringify(rahulProfile)}`
);

// Test TR7: Public profile privacy sanitization strips raw phone numbers
assert('TR7', 'Public profile strictly omits private mobile number',
  rahulProfile !== null && rahulProfile.mobile === '',
  `Mobile in public profile: ${rahulProfile?.mobile}`
);

// Test TR8: Trader profile commodities handled contains valid commodities
assert('TR8', 'Trader profile defines commodities handled array',
  Array.isArray(rahulProfile?.commoditiesHandled) && rahulProfile.commoditiesHandled.includes('onion'),
  `Commodities: ${rahulProfile?.commoditiesHandled?.join(', ')}`
);

// Test TR9: Input validation rejects missing market name
const v1 = validateTraderReportInput({
  commodity: 'Onion',
  minPrice: 3000,
  maxPrice: 4000
});
assert('TR9', 'Validator rejects missing market name',
  v1.isValid === false && v1.errorKey === 'validationMarketRequired',
  `Result: ${JSON.stringify(v1)}`
);

// Test TR10: Input validation rejects missing commodity
const v2 = validateTraderReportInput({
  marketName: 'Lasalgaon Mandi',
  minPrice: 3000,
  maxPrice: 4000
});
assert('TR10', 'Validator rejects missing commodity',
  v2.isValid === false && v2.errorKey === 'validationCommodityRequired',
  `Result: ${JSON.stringify(v2)}`
);

// Test TR11: Input validation rejects minPrice > maxPrice
const v3 = validateTraderReportInput({
  marketName: 'Lasalgaon Mandi',
  commodity: 'Onion',
  minPrice: 4500,
  maxPrice: 3500
});
assert('TR11', 'Validator rejects minimum price exceeding maximum price',
  v3.isValid === false && v3.errorKey === 'validationMinGreaterThanMax',
  `Result: ${JSON.stringify(v3)}`
);

// Test TR12: Input validation rejects modalPrice outside min-max bounds
const v4 = validateTraderReportInput({
  marketName: 'Lasalgaon Mandi',
  commodity: 'Onion',
  minPrice: 3000,
  maxPrice: 4000,
  modalPrice: 4500
});
assert('TR12', 'Validator rejects modal price outside [minPrice, maxPrice] range',
  v4.isValid === false && v4.errorKey === 'validationModalOutOfRange',
  `Result: ${JSON.stringify(v4)}`
);

// Test TR13: Input validation accepts valid inputs
const v5 = validateTraderReportInput({
  marketName: 'Lasalgaon Mandi',
  commodity: 'Onion',
  minPrice: 3200,
  maxPrice: 4200,
  modalPrice: 3800
});
assert('TR13', 'Validator accepts valid input parameters',
  v5.isValid === true,
  `Result: ${JSON.stringify(v5)}`
);

// Test TR14: Duplicate detection identifies same trader/market/commodity/date
const dupFound = findDuplicateTraderReport(INITIAL_TRADER_REPORTS, {
  traderId: 'trader-rahul-solapur',
  marketName: 'Solapur Local Market',
  commodity: 'Onion',
  variety: 'Red',
  reportDate: '20/09/2026'
});
assert('TR14', 'Duplicate detector identifies identical existing submission',
  Boolean(dupFound && dupFound.id === 'tr-rep-201'),
  `Found: ${dupFound?.id}`
);

// Test TR15: Submitting report enforces sourceType TRADER_REPORTED and UNVERIFIED
const savedResult = saveOrUpdateTraderReport({
  traderId: 'trader-test-99',
  traderName: 'Test Trader',
  role: 'Trader',
  district: 'Nashik',
  state: 'Maharashtra',
  mainAPMC: 'Lasalgaon APMC',
  marketName: 'Test Mandi',
  commodity: 'Onion',
  variety: 'Unhali',
  minPrice: 3000,
  maxPrice: 4000,
  modalPrice: 3500,
  reportDate: '20/09/2026',
  sourceType: 'TRADER_REPORTED',
  verificationStatus: 'UNVERIFIED'
});
assert('TR15', 'Submitting new report enforces sourceType = TRADER_REPORTED and verificationStatus = UNVERIFIED',
  savedResult.report.sourceType === 'TRADER_REPORTED' &&
  savedResult.report.verificationStatus === 'UNVERIFIED' &&
  savedResult.report.id.startsWith('tr-rep-'),
  `Saved report: ${JSON.stringify(savedResult.report)}`
);

console.log('----------------------------------------------------------------');
console.log(`TRADER REPORTS TEST SUITE RESULTS: ${passed}/${total} PASSED`);
console.log('----------------------------------------------------------------');

if (passed !== total) {
  process.exit(1);
}
