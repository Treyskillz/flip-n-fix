// ============================================================
// Excel Export — Generates a multi-sheet .xlsx workbook
// matching all 6 financing scenarios + 2012 Profit Calculator
// sections from the merged Profit Calculator engine
// ============================================================

import * as XLSX from 'xlsx';
import {
  calculateAll,
  getDefaultInputs,
  estimateRehabFromYearBuilt,
  type CalculatorInputs,
  type ProfitCalculatorResult,
  type ScenarioResult,
  DEFAULTS,
} from './profitCalculator';

function addSummarySheet(wb: XLSX.WorkBook, inputs: CalculatorInputs, result: ProfitCalculatorResult) {
  const prop = inputs.property;
  const data: (string | number | null)[][] = [
    ['FREEDOM ONE — Fix & Flip Profit Calculator'],
    [''],
    ['PROPERTY INFORMATION'],
    ['Address', prop.address || 'N/A'],
    ['Asking Price', prop.askingPrice],
    ['Purchase Price (Offer)', prop.purchasePrice],
    ['After Repair Value (ARV)', prop.arv],
    ['Year Built', prop.yearBuilt],
    ['Square Footage', prop.sqft],
    ['Has Pool', prop.hasPool ? 'Yes' : 'No'],
    ['Rehab Level', prop.rehabLevel === 1 ? 'Level 1 (Basic)' : prop.rehabLevel === 2 ? 'Level 2 (Standard)' : 'Level 3 (Luxury)'],
    [''],
    ['DEAL TRACKING'],
    ['Agent / Lead Source', prop.agentName || 'N/A'],
    ['Initial Offer Date', prop.initialOfferDate || 'N/A'],
    ['Resubmittal Date', prop.resubmittalDate || 'N/A'],
    ['Notes', prop.notes || 'N/A'],
    [''],
    ['COST BREAKDOWN'],
    ['Purchase Price', result.tpc.purchase],
    ['Rehab Cost', result.tpc.rehab],
    ['Closing Costs (2%)', result.tpc.closingCosts],
    ['Holding Costs', result.tpc.holdingCosts],
    ['Total Project Cost (TPC)', result.tpc.tpc],
    [''],
    ['70% RULE ANALYSIS'],
    ['MAO (ARV × 70% − Rehab)', result.seventyPercentRule],
    ['Your Offer', prop.purchasePrice],
    ['Meets 70% Rule?', prop.purchasePrice <= result.seventyPercentRule ? 'YES ✓' : 'NO ✗'],
    [''],
    ['YEAR-BUILT REHAB ESTIMATE'],
    ['Base Rehab', result.rehab.baseRehab],
    ['Sqft Adjustment', result.rehab.sqftAdjustment],
    ['Pool Cost', result.rehab.poolCost],
    ['Level Adjustment', result.rehab.levelAdjustment],
    ['Total Estimated Rehab', result.rehab.totalRepairs],
    [''],
    ['ASSUMPTIONS'],
    ['Realtor Commission', `${DEFAULTS.realtorCostRate * 100}%`],
    ['Selling Closing Costs', `${DEFAULTS.sellingClosingCostRate * 100}%`],
    ['Purchase Closing Costs', `${DEFAULTS.purchaseClosingRate * 100}%`],
    ['Monthly Holding Costs', prop.holdingCosts],
    ['Months to Hold', prop.monthsToHold],
    ['Min Profit Threshold', `MAX(ARV×10%, $20,000)`],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 32 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Summary');
}

function addScenarioSheet(wb: XLSX.WorkBook, scenario: ScenarioResult, inputs: CalculatorInputs, sheetName: string) {
  const prop = inputs.property;
  const data: (string | number | null)[][] = [
    [`FREEDOM ONE — ${scenario.name}`],
    [scenario.description],
    [''],
    ['DEAL ANALYSIS'],
    ['Total Project Cost', scenario.overallCost],
    ['Net Resale at ARV', Math.round(prop.arv * (1 - DEFAULTS.realtorCostRate - DEFAULTS.sellingClosingCostRate))],
    ['Projected Profit', scenario.projectedProfit],
    ['Out of Pocket', scenario.outOfPocket],
    ['Min Profit Required', scenario.dealCheck.minProfitRequired],
    ['DEAL or NO DEAL?', scenario.dealCheck.isDeal ? 'YES! — DEAL ✓' : 'NOPE — NO DEAL ✗'],
    [''],
  ];

  if (scenario.hml) {
    data.push(['HARD MONEY LOAN DETAILS']);
    data.push(['Loan Amount', scenario.hml.loanAmount]);
    data.push(['Points', scenario.hml.points]);
    data.push(['Interest', scenario.hml.interest]);
    data.push(['Admin Fee', scenario.hml.adminFee]);
    data.push(['Total HML Costs', scenario.hml.totalHMLCosts]);
    data.push(['']);
  }

  if (scenario.gapDebt) {
    data.push(['GAP FUNDER DETAILS (DEBT)']);
    data.push(['Gap Difference (TPC - HML)', scenario.gapDebt.gapDiff]);
    data.push(['Gap + HML Costs', scenario.gapDebt.gapLoan]);
    data.push(['Gap Points', scenario.gapDebt.gapPoints]);
    data.push(['Gap Interest', scenario.gapDebt.gapInterest]);
    data.push(['Total Gap Costs', scenario.gapDebt.totalGapCosts]);
    data.push(['']);
  }

  if (scenario.gapEquity) {
    data.push(['GAP FUNDER DETAILS (EQUITY)']);
    data.push(['Gap Funder Equity %', `${(scenario.gapEquity.gapPercent * 100).toFixed(0)}%`]);
    data.push(['Your Equity %', `${(scenario.gapEquity.ourPercent * 100).toFixed(0)}%`]);
    data.push(['Gap Funder ROI', `${(scenario.gapEquity.gapROI * 100).toFixed(1)}%`]);
    data.push(['Gap Funder Annualized ROI', `${(scenario.gapEquity.gapAROI * 100).toFixed(1)}%`]);
    data.push(['']);
  }

  if (scenario.plDebt) {
    data.push(['PRIVATE LENDER DETAILS (DEBT)']);
    data.push(['PL Loan Amount', scenario.plDebt.plLoan]);
    data.push(['PL Points', scenario.plDebt.plPoints]);
    data.push(['PL Interest', scenario.plDebt.plInterest]);
    data.push(['Out of Pocket', scenario.plDebt.outOfPocket]);
    data.push(['']);
  }

  if (scenario.plEquity) {
    data.push(['PRIVATE LENDER DETAILS (EQUITY)']);
    data.push(['PL Loan Amount', scenario.plEquity.plLoan]);
    data.push(['PL Equity %', `${(scenario.plEquity.plPercent * 100).toFixed(0)}%`]);
    data.push(['Your Equity %', `${(scenario.plEquity.ourPercent * 100).toFixed(0)}%`]);
    data.push(['PL ROI', `${(scenario.plEquity.plROI * 100).toFixed(1)}%`]);
    data.push(['PL Annualized ROI', `${(scenario.plEquity.plAROI * 100).toFixed(1)}%`]);
    data.push(['']);
  }

  // Resale Sensitivity Table
  data.push(['RESALE SENSITIVITY TABLE']);
  const hasEquity = scenario.resaleTable[0]?.gapShare !== undefined;
  if (hasEquity) {
    data.push(['Resale Price', 'Net After Costs', 'Total Profit', 'Partner Share', 'Your Share']);
  } else {
    data.push(['Resale Price', 'Net After Costs', 'Total Profit']);
  }
  for (const row of scenario.resaleTable) {
    if (hasEquity) {
      data.push([row.resalePrice, row.netAfterCosts, row.totalProfit, row.gapShare ?? 0, row.ourShare ?? 0]);
    } else {
      data.push([row.resalePrice, row.netAfterCosts, row.totalProfit]);
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
}

function addRapidFireSheet(wb: XLSX.WorkBook, result: ProfitCalculatorResult, inputs: CalculatorInputs) {
  const data: (string | number | null)[][] = [
    ['FREEDOM ONE — Rapid-Fire Offer Pricing'],
    [`Property: ${inputs.property.address || 'N/A'} | ARV: $${inputs.property.arv.toLocaleString()} | Rehab: $${inputs.property.rehab.toLocaleString()}`],
    [''],
    ['Target ROI', 'Offer Price', '% of Asking', 'Projected Profit'],
  ];

  for (const row of result.rapidFire) {
    data.push([
      `${(row.roiTarget * 100).toFixed(0)}%`,
      row.offerPrice,
      `${(row.percentOfAsking * 100).toFixed(1)}%`,
      row.projectedProfit,
    ]);
  }

  data.push(['']);
  data.push(['INSTRUCTIONS']);
  data.push(['Use this table to quickly determine your offer price based on your desired ROI target.']);
  data.push(['The 70% Rule offer is typically between the 15-16% ROI rows.']);
  data.push(['Higher ROI targets = lower offers = more profit but harder to get accepted.']);

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Rapid-Fire Offers');
}

function addAllCashSheet(wb: XLSX.WorkBook, result: ProfitCalculatorResult, inputs: CalculatorInputs) {
  const ac = result.allCash;
  const ff = result.fiftyFifty;
  const data: (string | number | null)[][] = [
    ['FREEDOM ONE — All-Cash & 50-50 Split Analysis'],
    [`Property: ${inputs.property.address || 'N/A'}`],
    [''],
    ['ALL-CASH SCENARIO (No Financing)'],
    ['Total Investment (TPC)', ac.totalInvestment],
    ['Net Resale (ARV minus selling costs)', ac.netResale],
    ['Profit', ac.profit],
    ['ROI', `${(ac.roi * 100).toFixed(1)}%`],
    ['Annualized ROI', `${(ac.annualizedROI * 100).toFixed(1)}%`],
    [''],
    ['50-50 PRIVATE LENDER SPLIT'],
    ['Total Investment', ff.totalInvestment],
    ['Trust Deed Amount (PL puts up)', ff.trustDeedAmount],
    ['Your 50% Profit', ff.profit],
    ['ROI (12-month basis)', `${(ff.roi12Month * 100).toFixed(1)}%`],
    ['ROI Annualized', `${(ff.roiAnnualized * 100).toFixed(1)}%`],
    [''],
    ['EXPLANATION'],
    ['All-Cash: You fund the entire project yourself. Maximum profit, maximum risk.'],
    ['50-50 Split: A private lender funds the project via trust deed. You split profit 50/50.'],
    ['The PL earns a return on their money. You earn profit with zero out of pocket.'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 40 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws, 'All-Cash & 50-50');
}

function addDeveloperProfitSheet(wb: XLSX.WorkBook, result: ProfitCalculatorResult, inputs: CalculatorInputs) {
  const dp = result.developerProfit;
  const prop = inputs.property;
  const data: (string | number | null)[][] = [
    ["FREEDOM ONE — Developer's Profit Analysis"],
    [`Property: ${prop.address || 'N/A'}`],
    [''],
    ['DEVELOPER PROFIT WITH PREDETERMINED GAP RATE'],
    ['HML Profit (after HML costs)', dp.hmlProfit],
    ['Gap Funds Needed', dp.gapFundsNeeded],
    [''],
    ['METHOD 1: Project Percentage'],
    ['Gap Funder Project %', `${(prop.gapProjectPercent * 100).toFixed(1)}%`],
    ['Gap Lender Profit', dp.gapLenderProfitProject],
    ['Developer Profit', dp.developerProfitProject],
    ['Gap Lender ROI (Annualized)', `${(dp.gapLenderROIProject * 100).toFixed(1)}%`],
    [''],
    ['METHOD 2: Annualized Percentage'],
    ['Gap Funder Annual %', `${(prop.gapAnnualizedPercent * 100).toFixed(1)}%`],
    ['Gap Lender Profit', dp.gapLenderProfitAnnual],
    ['Developer Profit', dp.developerProfitAnnual],
    [''],
    ['COMPARISON: 50-50 SPLIT vs OWN FUNDS + HML'],
    ['50-50 Split Profit (your half)', result.fiftyFifty.profit],
    ['HML + Gap Profit', dp.hmlProfit],
    ['Effective Interest on Own Funds', `${(dp.interestEarnedOwnFunds * 100).toFixed(1)}%`],
    [''],
    ['EXPLANATION'],
    ['Project %: Gap funder earns a flat percentage of their investment per project.'],
    ['Annualized %: Gap funder earns an annualized return prorated by hold period.'],
    ['Compare both methods to determine which is more favorable for your gap funder pitch.'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 40 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws, "Developer's Profit");
}

function addInstructionsSheet(wb: XLSX.WorkBook) {
  const data: (string | number | null)[][] = [
    ['FREEDOM ONE — Fix & Flip Profit Calculator'],
    ['Instructions & How to Use'],
    [''],
    ['OVERVIEW'],
    ['This spreadsheet contains a complete deal analysis with multiple financing scenarios,'],
    ['rapid-fire offer pricing, all-cash analysis, 50-50 splits, and developer profit calculations.'],
    [''],
    ['SHEETS INCLUDED'],
    ['1. Instructions — This page'],
    ['2. Summary — Property info, cost breakdown, 70% rule, rehab estimate, deal tracking'],
    ['3-8. Financing Scenarios:'],
    ['   • HML ARV Debt — Hard money on ARV + gap funder earning interest'],
    ['   • HML ARV Equity — Hard money on ARV + gap funder earning equity share'],
    ['   • HML PP Debt — Hard money on purchase price + gap funder earning interest'],
    ['   • HML PP Equity — Hard money on purchase price + gap funder earning equity share'],
    ['   • PL Debt — 100% private lender earning interest/points'],
    ['   • PL Equity — 100% private lender earning equity share'],
    ['9. Rapid-Fire Offers — Quick offer pricing at 20% down to 13% ROI targets'],
    ['10. All-Cash & 50-50 — All-cash profit and 50-50 private lender split analysis'],
    ["11. Developer's Profit — Gap funder rate analysis with project % and annualized % methods"],
    [''],
    ['HOW TO USE'],
    ['1. Review the Summary sheet for property details and cost breakdown'],
    ['2. Check the 70% Rule — is your purchase price below the MAO?'],
    ['3. Compare all 6 financing scenarios to find the best structure'],
    ['4. Look at the DEAL or NO DEAL indicator on each scenario'],
    ['5. Use the Resale Sensitivity Table to see profit at different sale prices'],
    ['6. Use Rapid-Fire Offers to determine your initial offer price'],
    ['7. Review All-Cash vs 50-50 to decide on financing structure'],
    ["8. Use Developer's Profit to pitch gap funders with specific returns"],
    [''],
    ['KEY FORMULAS'],
    ['70% Rule: MAO = ARV × 70% − Rehab Cost'],
    ['Min Profit: MAX(ARV × 10%, $20,000)'],
    ['Net Resale: Sale Price − (4% Realtor + 2% Closing)'],
    ['DEAL = Projected Profit ≥ Min Profit Required'],
    ['Rapid-Fire: Solve for offer where profit/investment = target ROI'],
    [''],
    ['2026 DEFAULTS'],
    ['HML LTV: 70% (ARV) / 85% (PP) | Points: 3% | Rate: 12% | Admin Fee: $2,500'],
    ['Realtor Commission: 4% | Selling Closing: 2% | Purchase Closing: 2%'],
    [''],
    ['DISCLAIMER'],
    ['This calculator is for educational and estimation purposes only.'],
    ['Always verify numbers with your lender, CPA, and real estate attorney.'],
    ['Past performance does not guarantee future results.'],
    [''],
    ['© Freedom One Real Estate Investment System'],
    ['www.freedom1realsystem.com'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 80 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Instructions');
}

export function generateProfitCalcExcel(inputs: CalculatorInputs): void {
  const result = calculateAll(inputs);
  const wb = XLSX.utils.book_new();

  // Add Instructions first
  addInstructionsSheet(wb);

  // Add Summary
  addSummarySheet(wb, inputs, result);

  // Add each scenario as its own sheet
  const sheetNames = [
    'HML ARV Debt',
    'HML ARV Equity',
    'HML PP Debt',
    'HML PP Equity',
    'PL Debt',
    'PL Equity',
  ];

  result.scenarios.forEach((scenario, i) => {
    addScenarioSheet(wb, scenario, inputs, sheetNames[i]);
  });

  // Add Rapid-Fire
  addRapidFireSheet(wb, result, inputs);

  // Add 2012 sections
  addAllCashSheet(wb, result, inputs);
  addDeveloperProfitSheet(wb, result, inputs);

  // Generate and download
  const address = inputs.property.address || 'Property';
  const safeName = address.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  XLSX.writeFile(wb, `FreedomOne_ProfitCalc_${safeName}.xlsx`);
}

// Export a blank template with default values
export function generateBlankTemplate(): void {
  const defaults = getDefaultInputs();
  defaults.property.address = 'Enter Property Address';
  defaults.property.askingPrice = 250000;
  defaults.property.purchasePrice = 200000;
  defaults.property.arv = 320000;
  defaults.property.yearBuilt = 1985;
  defaults.property.sqft = 1800;
  defaults.property.rehab = 45000;
  defaults.property.holdingCosts = 2500;
  defaults.property.monthsToHold = 6;
  defaults.property.gapProjectPercent = 0.15;
  defaults.property.gapAnnualizedPercent = 0.12;

  const result = calculateAll(defaults);
  const wb = XLSX.utils.book_new();

  addInstructionsSheet(wb);
  addSummarySheet(wb, defaults, result);

  const sheetNames = [
    'HML ARV Debt',
    'HML ARV Equity',
    'HML PP Debt',
    'HML PP Equity',
    'PL Debt',
    'PL Equity',
  ];

  result.scenarios.forEach((scenario, i) => {
    addScenarioSheet(wb, scenario, defaults, sheetNames[i]);
  });

  addRapidFireSheet(wb, result, defaults);
  addAllCashSheet(wb, result, defaults);
  addDeveloperProfitSheet(wb, result, defaults);

  XLSX.writeFile(wb, 'FreedomOne_ProfitCalc_Template.xlsx');
}
