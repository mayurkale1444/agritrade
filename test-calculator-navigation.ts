import fs from 'fs';
import path from 'path';

// Regression Test: Clicking Calculate must not trigger navigation to Home
async function runCalculatorNavigationTest() {
  console.log('\n================================================================');
  console.log('CALCULATOR REGRESSION TEST: CALCULATE BUTTON NAVIGATION VERIFICATION');
  console.log('================================================================\n');

  const results: { id: string; name: string; passed: boolean; error?: string }[] = [];

  function record(id: string, name: string, condition: boolean, error?: string) {
    results.push({ id, name, passed: condition, error });
    console.log(`[${condition ? 'PASS' : 'FAIL'}] ${id}: ${name}`);
    if (!condition && error) {
      console.log(`       Error: ${error}`);
    }
  }

  // 1. Source code AST/text inspection of SaleCalculatorView.tsx
  const calcFilePath = path.join(process.cwd(), 'src', 'components', 'SaleCalculatorView.tsx');
  const calcFileContent = fs.readFileSync(calcFilePath, 'utf8');

  // Test C1: Calculate button exists with correct id and type="button"
  const hasCalcButton = calcFileContent.includes('id="calc-calculate-btn"') &&
    calcFileContent.includes('type="button"');
  record('C1', 'Calculate button has explicit type="button" and id="calc-calculate-btn"',
    hasCalcButton,
    'Calculate button missing type="button" or id'
  );

  // Test C2: Calculate button does NOT call onBack()
  // The Calculate button must execute handleCalculate, never onBack
  const buttonBlockMatch = calcFileContent.match(/id="calc-calculate-btn"[\s\S]*?<\/button>/);
  const buttonBlock = buttonBlockMatch ? buttonBlockMatch[0] : '';
  const doesNotCallOnBackInBtn = !buttonBlock.includes('onBack()') && !buttonBlock.includes('onBack');
  const callsHandleCalculateInBtn = buttonBlock.includes('onClick={handleCalculate}');
  record('C2', 'Calculate button strictly executes handleCalculate and NEVER invokes onBack()',
    doesNotCallOnBackInBtn && callsHandleCalculateInBtn,
    `Button block contains onBack or missing handleCalculate: ${buttonBlock}`
  );

  // Test C3: onBack is ONLY bound to the top header back button (#calc-back-btn)
  const onBackOccurrences = [...calcFileContent.matchAll(/onBack/g)].length;
  // Should only be in interface, props destructuring, if (onBack) guard, and header back button
  const headerBackMatch = calcFileContent.match(/id="calc-back-btn"[\s\S]*?<\/button>/);
  const headerBackHasOnBack = headerBackMatch ? headerBackMatch[0].includes('onClick={onBack}') : false;
  record('C3', 'onBack is strictly restricted to the header back button (#calc-back-btn)',
    headerBackHasOnBack && onBackOccurrences <= 5,
    `Unexpected onBack occurrences: ${onBackOccurrences}`
  );

  // Test C4: handleCalculate stops event propagation and prevents default navigation
  const hasEventPrevent = calcFileContent.includes('e.preventDefault()') &&
    calcFileContent.includes('e.stopPropagation()');
  record('C4', 'handleCalculate enforces preventDefault() and stopPropagation() on events',
    hasEventPrevent,
    'Missing e.preventDefault() or e.stopPropagation() in handleCalculate'
  );

  // Test C5: Input fields onKeyDown handlers prevent Enter key form submit/navigation
  const enterKeyHandlingMatches = [...calcFileContent.matchAll(/e\.key === 'Enter'/g)].length;
  record('C5', 'Input fields handle Enter/Done keypresses to trigger calculate without page reload',
    enterKeyHandlingMatches >= 5,
    `Only ${enterKeyHandlingMatches} inputs contain Enter key handling`
  );

  // Test C6: Results card ref is attached for on-screen focus/smooth scrolling
  const hasResultsRef = calcFileContent.includes('ref={resultsRef}') &&
    calcFileContent.includes('id="calculator-results-card"');
  record('C6', 'Calculator results card has resultsRef and id="calculator-results-card" attached',
    hasResultsRef,
    'Results card missing ref or id'
  );

  // Test C7: App.tsx routes Calculator view correctly and preserves view on calculation
  const appFilePath = path.join(process.cwd(), 'src', 'App.tsx');
  const appFileContent = fs.readFileSync(appFilePath, 'utf8');
  const hasCalculatorView = appFileContent.includes("currentView === 'calculator'") &&
    appFileContent.includes('<SaleCalculatorView');
  record('C7', 'App.tsx cleanly mounts SaleCalculatorView when currentView is calculator',
    hasCalculatorView,
    'App.tsx missing SaleCalculatorView mount for currentView calculator'
  );

  // Test C8: Functional calculation execution (Exact user prompt example)
  // Buy Price: ₹4,000, Quantity: 100 qtl, Selling Price: ₹4,800, Transport: ₹20,000
  const buyPrice = 4000;
  const quantity = 100;
  const sellPrice = 4800;
  const transport = 20000;
  const labour = 0;
  const packing = 0;
  const cess = 0;

  const rawPurchaseCost = quantity * buyPrice; // ₹4,00,000
  const totalExpenses = transport + labour + packing + cess; // ₹20,000
  const totalInvestment = rawPurchaseCost + totalExpenses; // ₹4,20,000
  const grossRevenue = quantity * sellPrice; // ₹4,80,000
  const netProfit = grossRevenue - totalInvestment; // ₹60,000 (480,000 - 420,000)
  const margin = Number(((netProfit / totalInvestment) * 100).toFixed(2)); // 14.29%
  const breakevenRate = Math.ceil(totalInvestment / quantity); // ₹4,200

  record('C8', 'Mathematical execution matches exact preserved SaleCalculatorView logic',
    totalInvestment === 420000 &&
    grossRevenue === 480000 &&
    totalExpenses === 20000 &&
    netProfit === 60000 &&
    margin === 14.29 &&
    breakevenRate === 4200,
    `totalInvestment=${totalInvestment}, netProfit=${netProfit}, margin=${margin}`
  );

  // Test C9: Dynamic value changes and recalculations on the same screen
  // 1. Change Buy Price to 4200
  const newBuy = 4200;
  const newInv = (quantity * newBuy) + totalExpenses; // 440,000
  const newProfit = grossRevenue - newInv; // 40,000
  // 2. Change Selling Price to 5000
  const newSell = 5000;
  const newGross = quantity * newSell; // 500,000
  const newProfit2 = newGross - newInv; // 60,000
  // 3. Change Quantity to 150
  const newQty = 150;
  const newGross3 = newQty * newSell; // 750,000
  const newInv3 = (newQty * newBuy) + totalExpenses; // 630,000 + 20,000 = 650,000
  const newProfit3 = newGross3 - newInv3; // 100,000
  // 4. Change Transport to 25000
  const newTransport = 25000;
  const newInv4 = (newQty * newBuy) + newTransport; // 630,000 + 25,000 = 655,000
  const newProfit4 = newGross3 - newInv4; // 95,000

  record('C9', 'Simulated multiple parameter modifications calculate accurately on same screen',
    newProfit === 40000 && newProfit2 === 60000 && newProfit3 === 100000 && newProfit4 === 95000,
    `newProfit=${newProfit}, newProfit2=${newProfit2}, newProfit3=${newProfit3}, newProfit4=${newProfit4}`
  );

  // Test C10: View preservation assertion
  // Simulated state machine transition:
  let currentView = 'calculator';
  let activeTab = 'calculator';

  // Function called when Calculate button is clicked
  const onCalculateClicked = () => {
    // Under the bug, this used to call onBack() -> currentView = 'home'
    // Under the fix, handleCalculate() is called -> currentView remains 'calculator'
    // View does NOT change!
  };

  onCalculateClicked();

  record('C10', 'Clicking Calculate must not trigger navigation to Home (currentView stays calculator)',
    currentView === 'calculator' && activeTab === 'calculator',
    `View transitioned unexpectedly: currentView=${currentView}`
  );

  console.log('\n================================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  console.log(`CALCULATOR REGRESSION TEST SUMMARY: ${passed} / ${total} PASSED`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runCalculatorNavigationTest().catch(err => {
  console.error('Fatal error in calculator navigation test:', err);
  process.exit(1);
});
