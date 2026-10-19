/**
 * Test Suite: Google Play Misleading Claims Policy & Data Sources Verification
 * 
 * Verifies:
 * 1. DataSourcesDisclaimerModal exists, has AGMARKNET & data.gov.in links with https://
 * 2. Independent app declaration ("not affiliated with, authorized by, or endorsed by any government entity")
 * 3. Trader Reported rates labeled as "Trader Reported — Not Official Government Data"
 * 4. Trader Reported rates explained as "may be unverified"
 * 5. Fallback/demo data never labeled as live official data
 * 6. Store descriptions (PLAY_STORE_LISTING.md, metadata.json, index.html) updated and accurate
 * 7. HomeDashboard and MoreView have clear access points to Data Sources & Disclaimer
 */

import fs from 'fs';
import path from 'path';
import { en } from './src/locales/en';
import { mr } from './src/locales/mr';
import { hi } from './src/locales/hi';
import { kn } from './src/locales/kn';
import { ta } from './src/locales/ta';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ Passed: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAILED: ${testName}`);
    if (detail) console.error(`    Detail: ${detail}`);
    failed++;
  }
}

console.log('========================================================================');
console.log('GOOGLE PLAY MISLEADING CLAIMS POLICY COMPLIANCE TEST SUITE');
console.log('========================================================================\n');

// 1. DataSourcesDisclaimerModal checks
const disclaimerModalPath = path.resolve(process.cwd(), 'src/components/DataSourcesDisclaimerModal.tsx');
assert(fs.existsSync(disclaimerModalPath), 'DataSourcesDisclaimerModal component exists');

const disclaimerContent = fs.readFileSync(disclaimerModalPath, 'utf-8');

assert(
  disclaimerContent.includes('https://agmarknet.gov.in') && disclaimerContent.includes('Visit agmarknet.gov.in'),
  'AGMARKNET link (https://agmarknet.gov.in) is present and clickable in disclaimer modal'
);

assert(
  disclaimerContent.includes('https://data.gov.in') && disclaimerContent.includes('Visit data.gov.in'),
  'data.gov.in link (https://data.gov.in) is present and clickable in disclaimer modal'
);

assert(
  disclaimerContent.includes('NOT affiliated with, authorized by, endorsed by, or in any way officially connected to any government entity'),
  'Clear independent app disclaimer explicitly disclaiming government affiliation'
);

assert(
  disclaimerContent.includes('Trader Reported — Not Official Government Data') && disclaimerContent.includes('May Be Unverified'),
  'Trader rates explicitly labeled as Trader Reported — Not Official Government Data (May Be Unverified)'
);

assert(
  disclaimerContent.includes('AgriTrade never labels fallback, simulated, or demo data as live official data'),
  'Strict transparency stating fallback/demo data is never labeled as live official data'
);

// 2. Accessibility from Home and More
const homeDashboardContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/HomeDashboard.tsx'), 'utf-8');
assert(
  homeDashboardContent.includes('home-policy-banner') && homeDashboardContent.includes('onOpenDisclaimer'),
  'HomeDashboard has a prominent policy banner accessing Data Sources & Disclaimer'
);

assert(
  homeDashboardContent.includes('home-footer-disclaimer-btn'),
  'HomeDashboard has a permanent footer button accessing Data Sources & Disclaimer'
);

assert(
  homeDashboardContent.includes('TRADER REPORTED — NOT OFFICIAL GOVERNMENT DATA'),
  'HomeDashboard labels trader rates card as TRADER REPORTED — NOT OFFICIAL GOVERNMENT DATA'
);

const moreViewContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/MoreView.tsx'), 'utf-8');
assert(
  moreViewContent.includes('more-disclaimer-btn') && moreViewContent.includes('onOpenDisclaimer'),
  'MoreView has a dedicated Settings item for Data Sources & Legal Disclaimer'
);

// 3. Locales validation across all 5 supported languages
assert(
  en.traderReportedLocalMarket.includes('NOT OFFICIAL GOVERNMENT DATA'),
  'en.ts traderReportedLocalMarket includes NOT OFFICIAL GOVERNMENT DATA'
);

assert(
  mr.traderReportedLocalMarket.includes('अधिकृत शासकीय डेटा नव्हे'),
  'mr.ts traderReportedLocalMarket includes अधिकृत शासकीय डेटा नव्हे'
);

assert(
  hi.traderReportedLocalMarket.includes('आधिकारिक सरकारी डेटा नहीं'),
  'hi.ts traderReportedLocalMarket includes आधिकारिक सरकारी डेटा नहीं'
);

assert(
  kn.traderReportedLocalMarket.includes('ಅಧಿಕೃತ ಸರ್ಕಾರಿ ದತ್ತಾಂಶವಲ್ಲ'),
  'kn.ts traderReportedLocalMarket includes ಅಧಿಕೃತ ಸರ್ಕಾರಿ ದತ್ತಾಂಶವಲ್ಲ'
);

assert(
  ta.traderReportedLocalMarket.includes('அதிகாரப்பூர்வ அரசு தரவு அல்ல'),
  'ta.ts traderReportedLocalMarket includes அதிகாரப்பூர்வ அரசு தரவு அல்ல'
);

// 4. Store Description and Metadata Audits
const storeListingContent = fs.readFileSync(path.resolve(process.cwd(), 'PLAY_STORE_LISTING.md'), 'utf-8');
assert(
  storeListingContent.includes('IMPORTANT DISCLAIMER (GOVERNMENT ENTITY AFFILIATION):') &&
  storeListingContent.includes('https://agmarknet.gov.in') &&
  storeListingContent.includes('https://data.gov.in'),
  'PLAY_STORE_LISTING.md includes prominent Government Entity Disclaimer & source links'
);

const metadataContent = fs.readFileSync(path.resolve(process.cwd(), 'metadata.json'), 'utf-8');
assert(
  !metadataContent.includes('Official Indian agricultural mandi prices') &&
  metadataContent.includes('Independent agricultural mandi intelligence'),
  'metadata.json is updated and free of misleading claims'
);

const indexHtmlContent = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
assert(
  indexHtmlContent.includes('Independent agricultural mandi intelligence with records sourced from AGMARKNET'),
  'index.html meta tags declare independent status and source attribution'
);

console.log('\n========================================================================');
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================================');

if (failed > 0) {
  process.exit(1);
}
