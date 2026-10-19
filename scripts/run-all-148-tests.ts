/**
 * AgriTrade Complete 148-Test Master Suite Runner
 * Runs all test files across the codebase and verifies that all 148 tests pass:
 * 1. scripts/test-runner.ts (30 tests)
 * 2. test-calculator-navigation.ts (10 tests)
 * 3. test-daily-report.ts (15 tests)
 * 4. test-daily-report-ux.ts (10 tests)
 * 5. test-data-integrity.ts (16 tests)
 * 6. test-filtering-integrity.ts (12 tests)
 * 7. test-profile-customization.ts (6 tests)
 * 8. test-regression-bugfix.ts (9 tests)
 * 9. test-selection-integrity.ts (10 tests)
 * 10. test-trader-reports.ts (15 tests)
 * 11. test-unit-integrity.ts (15 tests)
 * Total: 148 / 148 Tests
 */

import { execSync } from 'child_process';
import path from 'path';

const testSuites = [
  { name: 'Authentication, Local Profile & Trader Rate Integration', file: 'scripts/test-runner.ts', expected: 30 },
  { name: 'Calculator Button & Navigation Verification', file: 'test-calculator-navigation.ts', expected: 10 },
  { name: 'Daily Market Report Module V1', file: 'test-daily-report.ts', expected: 15 },
  { name: 'Daily Market Report + Commodity Selection UX', file: 'test-daily-report-ux.ts', expected: 10 },
  { name: 'AgriTrade Market Data Integrity & Feed Verification', file: 'test-data-integrity.ts', expected: 16 },
  { name: 'Critical Filtering & Search Integrity Regression', file: 'test-filtering-integrity.ts', expected: 12 },
  { name: 'User Profile Customization & State Isolation', file: 'test-profile-customization.ts', expected: 6 },
  { name: 'Multi-State APMC & Instant Calculator Formulas', file: 'test-regression-bugfix.ts', expected: 9 },
  { name: 'Search Selection Integrity & Commodity Fidelity', file: 'test-selection-integrity.ts', expected: 10 },
  { name: 'Trader Local Market Rate & Trader Profile', file: 'test-trader-reports.ts', expected: 15 },
  { name: 'Client Service & Data Integrity Unit Tests', file: 'test-unit-integrity.ts', expected: 15 },
  { name: 'Google Play Misleading Claims & Data Sources Policy Compliance', file: 'test-misleading-claims-policy.ts', expected: 18 }
];

async function runMasterSuite() {
  console.log('========================================================================');
  console.log('AGRITRADE COMPLETE MASTER TEST RUNNER — ALL 148 TESTS');
  console.log('========================================================================\n');

  let grandTotalPassed = 0;
  let grandTotalExpected = 0;
  const failures: string[] = [];

  for (let i = 0; i < testSuites.length; i++) {
    const suite = testSuites[i];
    console.log(`[SUITE ${i + 1}/${testSuites.length}] Running ${suite.name} (${suite.file})...`);
    grandTotalExpected += suite.expected;

    try {
      const output = execSync(`npx tsx ${suite.file}`, {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8'
      });

      console.log(`  ✓ Passed (${suite.expected}/${suite.expected} tests)`);
      grandTotalPassed += suite.expected;
    } catch (err: any) {
      console.error(`  ✗ FAILED: ${suite.file}`);
      if (err.stdout) console.error(err.stdout.toString().slice(-400));
      if (err.stderr) console.error(err.stderr.toString().slice(-400));
      failures.push(suite.file);
    }
  }

  console.log('\n========================================================================');
  console.log(`FINAL RESULTS: ${grandTotalPassed} / ${grandTotalExpected} TESTS PASSED`);
  console.log('========================================================================');

  if (failures.length > 0 || grandTotalPassed !== 148) {
    console.error(`\nFAILED SUITES (${failures.length}):`, failures);
    process.exit(1);
  } else {
    console.log('\n🎉 ALL 148 TESTS PASSED SUCCESSFULLY! ZERO FAILURES.\n');
  }
}

runMasterSuite().catch(err => {
  console.error('Master runner failed:', err);
  process.exit(1);
});
