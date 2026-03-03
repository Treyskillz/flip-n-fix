// ============================================================
// Profit Calculator Engine — Merged from:
//   1. 14.10.12 Profit Calculator (rapid-fire, year-built rehab, 6 scenarios)
//   2. FLIP_CALCULATOR.xlsx (6 financing sheets with resale sensitivity)
// Uses 70% rule (not 65%), updated formulas throughout.
// ============================================================

// ── Configuration Defaults ───────────────────────────────────

export const DEFAULTS = {
  realtorCostRate: 0.04,            // 4% realtor commission (post-NAR settlement 2024, ~3% listing + negotiable buyer agent)
  sellingClosingCostRate: 0.02,     // 2% selling closing costs
  purchaseClosingRate: 0.02,        // 2% purchase closing costs
  annualPropertyTaxRate: 0.0125,    // 1.25% annual property tax
  minProfitPercent: 0.10,           // 10% minimum profit threshold
  minProfitFloor: 20000,            // $20K minimum profit floor
  alwaysItemsBaseline: 25000,       // Base rehab for year-built lookup (updated from $21K for 2026)
  localAreaAdditional: 0,           // Local area additional costs
  perAdditional500Sqft: 3000,       // Per additional 500 sqft above 2000
  level2Multiplier: 0.30,           // Level 2 rehab multiplier
};

// ── Input Types ──────────────────────────────────────────────

export interface PropertyInputs {
  address: string;
  askingPrice: number;
  purchasePrice: number;          // Actual offer / purchase price
  arv: number;
  yearBuilt: number;
  sqft: number;
  rehab: number;                  // Total rehab cost (manual or from analyzer)
  holdingCosts: number;           // Monthly holding costs (insurance, utilities, etc.)
  monthsToHold: number;           // Total months: rehab + DOM + escrow
  hasPool: boolean;
  rehabLevel: 1 | 2 | 3;
  // 2012 Profit Calculator fields
  agentName: string;              // Agent who provided the property lead
  initialOfferDate: string;       // Initial offer date (ISO string or empty)
  resubmittalDate: string;        // Resubmittal date (ISO string or empty)
  notes: string;                  // Property-specific notes
  gapProjectPercent: number;      // Developer's gap funder "Project %" (e.g. 0.15 = 15%)
  gapAnnualizedPercent: number;   // Developer's gap funder "Annualized %" (e.g. 0.12 = 12%)
}

export type InterestType = 'annual' | 'straight' | 'monthly' | 'deferred';

export interface HMLInputs {
  ltvPercent: number;             // LTV % (e.g. 0.65 for ARV, 0.90 for PP)
  loanBasis: 'arv' | 'pp';       // What the HML loans on
  pointsPercent: number;          // Points % (e.g. 0.02 = 2 points)
  interestRate: number;           // Annual rate (e.g. 0.12 = 12%)
  adminFee: number;               // Flat admin/junk fee (default $1000)
}

export interface GapDebtInputs {
  pointsPercent: number;          // Gap funder points % (default 0)
  interestRate: number;           // Gap funder rate (e.g. 0.12 = 12%)
  interestType: InterestType;     // How interest is calculated
}

export interface GapEquityInputs {
  gapEquityPercent: number;       // Gap funder's equity % (e.g. 0.25 = 25%)
}

export interface PrivateLenderDebtInputs {
  ltvPercent: number;             // Usually 1.0 (100%)
  pointsPercent: number;          // PL points %
  interestRate: number;           // PL annual rate
  interestType: InterestType;     // Monthly or Deferred
  adminFee: number;               // PL admin fee
}

export interface PrivateLenderEquityInputs {
  ltvPercent: number;             // Usually 1.0 (100%)
  plEquityPercent: number;        // PL equity split % (e.g. 0.50)
}

// ── Result Types ─────────────────────────────────────────────

export interface ResaleSensitivityRow {
  resalePrice: number;
  netAfterCosts: number;
  totalProfit: number;
  gapShare?: number;              // For equity scenarios
  ourShare?: number;              // For equity scenarios
}

export interface DealCheck {
  minProfitRequired: number;      // MAX(ARV * 10%, $20,000)
  projectedProfit: number;
  isDeal: boolean;                // YES! or NOPE!
}

export interface TotalProjectCost {
  purchase: number;
  rehab: number;
  closingCosts: number;           // Purchase * closing rate
  holdingCosts: number;           // Monthly * months
  tpc: number;                    // Sum of above
}

export interface HMLCosts {
  loanAmount: number;
  points: number;
  interest: number;
  adminFee: number;
  totalHMLCosts: number;          // points + interest + admin
}

export interface GapDebtCosts {
  gapDiff: number;                // TPC - HML Loan
  gapHMLCosts: number;            // HML points + interest + admin
  gapLoan: number;                // gapDiff + gapHMLCosts
  gapPoints: number;
  gapInterest: number;
  totalGapCosts: number;
}

export interface ScenarioResult {
  name: string;
  description: string;
  overallCost: number;            // Total cost including all loan costs
  projectedProfit: number;        // At ARV
  outOfPocket: number;            // What developer brings to table
  dealCheck: DealCheck;
  resaleTable: ResaleSensitivityRow[];
  // Scenario-specific details
  hml?: HMLCosts;
  gapDebt?: GapDebtCosts;
  gapEquity?: { gapPercent: number; ourPercent: number; gapROI: number; gapAROI: number };
  plDebt?: { plLoan: number; plPoints: number; plInterest: number; outOfPocket: number };
  plEquity?: { plLoan: number; plPercent: number; ourPercent: number; plROI: number; plAROI: number };
}

export interface RapidFireRow {
  roiTarget: number;              // Target ROI (20% down to 13%)
  offerPrice: number;
  percentOfAsking: number;
  projectedProfit: number;
}

export interface RehabBreakdown {
  baseRehab: number;
  sqftAdjustment: number;
  poolCost: number;
  levelAdjustment: number;
  totalRepairs: number;
}

export interface PropertyEvaluation {
  location: number;               // 1-4
  curbAppeal: number;             // 1-4
  layout: number;                 // 1-4
  rearYard: number;               // 1-4
  total: number;
  recommendation: string;
}

// ── 2012 Profit Calculator Additional Results ───────────────

export interface AllCashResult {
  totalInvestment: number;        // TPC (purchase + rehab + closing + holding)
  netResale: number;              // ARV minus selling costs
  profit: number;                 // Net resale - total investment
  roi: number;                    // profit / totalInvestment
  annualizedROI: number;          // (roi / months) * 12
}

export interface FiftyFiftySplitResult {
  totalInvestment: number;
  profit: number;                 // All-cash profit / 2
  trustDeedAmount: number;        // Total investment (what PL puts up)
  roiAnnualized: number;          // (profit / trustDeed) * (12 / months)
  roi12Month: number;             // profit / trustDeed
}

export interface DeveloperProfitResult {
  hmlProfit: number;              // Profit after HML costs
  gapFundsNeeded: number;         // TPC - HML loan + HML costs
  // Project % method
  gapLenderProfitProject: number; // gapProjectPercent * gapFundsNeeded
  developerProfitProject: number; // hmlProfit - gapLenderProfitProject
  gapLenderROIProject: number;    // (gapProjectPercent * 12) / months
  // Annualized % method
  gapLenderProfitAnnual: number;  // gapAnnualizedPercent * gapFundsNeeded * months / 12
  developerProfitAnnual: number;  // hmlProfit - gapLenderProfitAnnual
  // Comparison: 50-50 vs own funds
  interestEarnedOwnFunds: number; // (hmlProfit - allCashProfit/2) / gapFundsNeeded
}

export interface ProfitCalculatorResult {
  tpc: TotalProjectCost;
  rehab: RehabBreakdown;
  seventyPercentRule: number;     // (ARV * 0.70) - rehab
  scenarios: ScenarioResult[];
  rapidFire: RapidFireRow[];
  evaluation?: PropertyEvaluation;
  // 2012 Profit Calculator sections
  allCash: AllCashResult;
  fiftyFifty: FiftyFiftySplitResult;
  developerProfit: DeveloperProfitResult;
}

// ── Helper Functions ─────────────────────────────────────────

function calcTPC(prop: PropertyInputs): TotalProjectCost {
  const closingCosts = Math.round(prop.purchasePrice * DEFAULTS.purchaseClosingRate);
  const holdingCosts = Math.round(prop.holdingCosts * prop.monthsToHold);
  const tpc = prop.purchasePrice + prop.rehab + closingCosts + holdingCosts;
  return { purchase: prop.purchasePrice, rehab: prop.rehab, closingCosts, holdingCosts, tpc };
}

function calcNetResale(resalePrice: number): number {
  const totalSellRate = DEFAULTS.realtorCostRate + DEFAULTS.sellingClosingCostRate;
  return Math.round(resalePrice - (resalePrice * totalSellRate));
}

function calcDealCheck(arv: number, projectedProfit: number): DealCheck {
  const minProfitRequired = Math.max(arv * DEFAULTS.minProfitPercent, DEFAULTS.minProfitFloor);
  return {
    minProfitRequired: Math.round(minProfitRequired),
    projectedProfit: Math.round(projectedProfit),
    isDeal: projectedProfit >= minProfitRequired,
  };
}

function buildResaleTable(arv: number, overallCost: number, gapEquityPercent?: number): ResaleSensitivityRow[] {
  const rows: ResaleSensitivityRow[] = [];
  for (let delta = -20000; delta <= 20000; delta += 5000) {
    const resalePrice = arv + delta;
    const net = calcNetResale(resalePrice);
    const totalProfit = net - overallCost;
    const row: ResaleSensitivityRow = { resalePrice, netAfterCosts: net, totalProfit: Math.round(totalProfit) };
    if (gapEquityPercent !== undefined) {
      row.gapShare = Math.round(totalProfit * gapEquityPercent);
      row.ourShare = Math.round(totalProfit * (1 - gapEquityPercent));
    }
    rows.push(row);
  }
  return rows;
}

function calcInterest(principal: number, rate: number, months: number, type: InterestType): number {
  switch (type) {
    case 'straight':
      return Math.round(principal * rate);
    case 'annual':
    case 'monthly':
      return Math.round((principal * rate / 12) * months);
    case 'deferred':
      return Math.round((principal * rate / 12) * months); // Same calc, but paid at end
    default:
      return Math.round((principal * rate / 12) * months);
  }
}

function calcHML(prop: PropertyInputs, hml: HMLInputs): HMLCosts {
  const loanAmount = Math.round(
    hml.loanBasis === 'arv' ? prop.arv * hml.ltvPercent : prop.purchasePrice * hml.ltvPercent
  );
  const points = Math.round(loanAmount * hml.pointsPercent);
  const interest = Math.round((loanAmount * hml.interestRate / 12) * prop.monthsToHold);
  return {
    loanAmount,
    points,
    interest,
    adminFee: hml.adminFee,
    totalHMLCosts: points + interest + hml.adminFee,
  };
}

// ── Year-Built Rehab Lookup ──────────────────────────────────

function getYearBuiltRehabFactor(yearBuilt: number): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - yearBuilt;
  if (age <= 5) return 0.3;
  if (age <= 10) return 0.4;
  if (age <= 15) return 0.5;
  if (age <= 20) return 0.6;
  if (age <= 30) return 0.7;
  if (age <= 40) return 0.8;
  if (age <= 50) return 0.9;
  if (age <= 60) return 1.0;
  if (age <= 70) return 1.1;
  if (age <= 80) return 1.2;
  return 1.3;
}

export function estimateRehabFromYearBuilt(prop: PropertyInputs): RehabBreakdown {
  const yearFactor = getYearBuiltRehabFactor(prop.yearBuilt);
  const baseRehab = Math.round(DEFAULTS.alwaysItemsBaseline * yearFactor + DEFAULTS.localAreaAdditional);
  const sqftAdj = prop.sqft > 2000 ? Math.ceil((prop.sqft - 2000) / 500) * DEFAULTS.perAdditional500Sqft : 0;
  const poolCost = prop.hasPool ? 4000 : 0;
  let levelAdj = 0;
  if (prop.rehabLevel === 2) levelAdj = Math.round(baseRehab * DEFAULTS.level2Multiplier);
  if (prop.rehabLevel === 3) levelAdj = Math.round(baseRehab * DEFAULTS.level2Multiplier * 2);
  const totalRepairs = baseRehab + sqftAdj + poolCost + levelAdj;
  return { baseRehab, sqftAdjustment: sqftAdj, poolCost, levelAdjustment: levelAdj, totalRepairs };
}

// ── Scenario Builders ────────────────────────────────────────

function buildHMLGapDebt(
  prop: PropertyInputs, tpc: TotalProjectCost,
  hml: HMLInputs, gap: GapDebtInputs, label: string, desc: string
): ScenarioResult {
  const h = calcHML(prop, hml);
  const gapDiff = Math.max(0, tpc.tpc - h.loanAmount);
  const gapHMLCosts = h.totalHMLCosts;
  const gapLoan = gapDiff + gapHMLCosts;
  const gapPoints = Math.round(gapLoan * gap.pointsPercent);
  const gapInterest = calcInterest(gapLoan, gap.interestRate, prop.monthsToHold, gap.interestType);
  const totalGapCosts = gapPoints + gapInterest;
  const overallCost = tpc.tpc + h.totalHMLCosts + totalGapCosts;
  const netAtARV = calcNetResale(prop.arv);
  const profit = netAtARV - overallCost;
  const outOfPocket = gap.interestType === 'monthly' ? gapPoints : 0;

  return {
    name: label,
    description: desc,
    overallCost,
    projectedProfit: Math.round(profit),
    outOfPocket,
    dealCheck: calcDealCheck(prop.arv, profit),
    resaleTable: buildResaleTable(prop.arv, overallCost),
    hml: h,
    gapDebt: { gapDiff, gapHMLCosts, gapLoan, gapPoints, gapInterest, totalGapCosts },
  };
}

function buildHMLGapEquity(
  prop: PropertyInputs, tpc: TotalProjectCost,
  hml: HMLInputs, gapEq: GapEquityInputs, label: string, desc: string
): ScenarioResult {
  const h = calcHML(prop, hml);
  const gapDiff = Math.max(0, tpc.tpc - h.loanAmount);
  const secondLoan = gapDiff + h.totalHMLCosts;
  const overallCost = tpc.tpc + h.totalHMLCosts;
  const netAtARV = calcNetResale(prop.arv);
  const totalProfit = netAtARV - overallCost;
  const ourShare = Math.round(totalProfit * (1 - gapEq.gapEquityPercent));
  const gapShare = Math.round(totalProfit * gapEq.gapEquityPercent);
  const gapROI = secondLoan > 0 ? gapShare / secondLoan : 0;
  const gapAROI = prop.monthsToHold > 0 ? (gapROI / prop.monthsToHold) * 12 : 0;

  return {
    name: label,
    description: desc,
    overallCost,
    projectedProfit: ourShare,
    outOfPocket: 0,
    dealCheck: calcDealCheck(prop.arv, ourShare),
    resaleTable: buildResaleTable(prop.arv, overallCost, gapEq.gapEquityPercent),
    hml: h,
    gapEquity: {
      gapPercent: gapEq.gapEquityPercent,
      ourPercent: 1 - gapEq.gapEquityPercent,
      gapROI,
      gapAROI,
    },
  };
}

function buildPLDebt(
  prop: PropertyInputs, tpc: TotalProjectCost, pl: PrivateLenderDebtInputs,
  label: string, desc: string
): ScenarioResult {
  const plLoan = Math.round(tpc.tpc * pl.ltvPercent);
  const plPoints = Math.round(plLoan * pl.pointsPercent);
  const plInterest = calcInterest(plLoan, pl.interestRate, prop.monthsToHold, pl.interestType);
  const totalPLCosts = plPoints + plInterest + pl.adminFee;
  const overallCost = tpc.tpc + totalPLCosts;
  const netAtARV = calcNetResale(prop.arv);
  const profit = netAtARV - overallCost;
  const outOfPocket = pl.interestType === 'monthly' ? plPoints + pl.adminFee : 0;

  return {
    name: label,
    description: desc,
    overallCost,
    projectedProfit: Math.round(profit),
    outOfPocket,
    dealCheck: calcDealCheck(prop.arv, profit),
    resaleTable: buildResaleTable(prop.arv, overallCost),
    plDebt: { plLoan, plPoints, plInterest, outOfPocket },
  };
}

function buildPLEquity(
  prop: PropertyInputs, tpc: TotalProjectCost, plEq: PrivateLenderEquityInputs,
  label: string, desc: string
): ScenarioResult {
  const plLoan = Math.round(tpc.tpc * plEq.ltvPercent);
  const overallCost = plLoan; // PL covers everything
  const netAtARV = calcNetResale(prop.arv);
  const totalProfit = netAtARV - overallCost;
  const ourShare = Math.round(totalProfit * (1 - plEq.plEquityPercent));
  const plShare = Math.round(totalProfit * plEq.plEquityPercent);
  const plROI = plLoan > 0 ? plShare / plLoan : 0;
  const plAROI = prop.monthsToHold > 0 ? (plROI / prop.monthsToHold) * 12 : 0;
  const outOfPocket = Math.max(0, tpc.tpc - plLoan);

  return {
    name: label,
    description: desc,
    overallCost,
    projectedProfit: ourShare,
    outOfPocket,
    dealCheck: calcDealCheck(prop.arv, ourShare),
    resaleTable: buildResaleTable(prop.arv, overallCost, plEq.plEquityPercent),
    plEquity: {
      plLoan,
      plPercent: plEq.plEquityPercent,
      ourPercent: 1 - plEq.plEquityPercent,
      plROI,
      plAROI,
    },
  };
}

// ── Rapid-Fire Offer Pricing ─────────────────────────────────

function buildRapidFire(prop: PropertyInputs): RapidFireRow[] {
  const rows: RapidFireRow[] = [];
  const totalSellRate = DEFAULTS.realtorCostRate + DEFAULTS.sellingClosingCostRate;

  for (let roiTarget = 0.20; roiTarget >= 0.125; roiTarget -= 0.01) {
    // Solve for offer price where:
    // profit / totalInvestment = roiTarget
    // profit = ARV*(1-sellRate) - (offer + rehab + offer*closingRate + holdingCosts*months)
    // totalInvestment = offer + rehab + offer*closingRate + holdingCosts*months
    // Let TI = offer*(1+closingRate) + rehab + holdingCosts*months
    // profit = ARV*(1-sellRate) - TI
    // TI * roiTarget = ARV*(1-sellRate) - TI
    // TI * (1 + roiTarget) = ARV*(1-sellRate)
    // TI = ARV*(1-sellRate) / (1+roiTarget)
    // offer*(1+closingRate) = TI - rehab - holdingCosts*months
    // offer = (TI - rehab - holdingCosts*months) / (1+closingRate)

    const netARV = prop.arv * (1 - totalSellRate);
    const targetTI = netARV / (1 + roiTarget);
    const holdTotal = prop.holdingCosts * prop.monthsToHold;
    const offer = Math.round((targetTI - prop.rehab - holdTotal) / (1 + DEFAULTS.purchaseClosingRate));

    if (offer <= 0) continue;

    const closingCost = Math.round(offer * DEFAULTS.purchaseClosingRate);
    const ti = offer + prop.rehab + closingCost + holdTotal;
    const profit = Math.round(netARV - ti);
    const percentOfAsking = prop.askingPrice > 0 ? offer / prop.askingPrice : 0;

    rows.push({
      roiTarget: Math.round(roiTarget * 100) / 100,
      offerPrice: offer,
      percentOfAsking,
      projectedProfit: profit,
    });
  }

  return rows;
}

// ── Property Evaluation ──────────────────────────────────────

export function evaluateProperty(scores: {
  location: number; curbAppeal: number; layout: number; rearYard: number;
}): PropertyEvaluation {
  const total = scores.location + scores.curbAppeal + scores.layout + scores.rearYard;
  let recommendation = '';
  if (total >= 14) recommendation = 'Excellent property — strong candidate for flip';
  else if (total >= 11) recommendation = 'Good property — monitor for resubmittal if offer rejected';
  else if (total >= 8) recommendation = 'Average property — proceed with caution';
  else recommendation = 'Below average — consider passing unless price is exceptional';
  return { ...scores, total, recommendation };
}

// ── Main Calculator ──────────────────────────────────────────

export interface CalculatorInputs {
  property: PropertyInputs;
  hmlARV: HMLInputs;
  hmlPP: HMLInputs;
  gapDebt: GapDebtInputs;
  gapEquity: GapEquityInputs;
  plDebt: PrivateLenderDebtInputs;
  plEquity: PrivateLenderEquityInputs;
}

export function getDefaultInputs(): CalculatorInputs {
  return {
    property: {
      address: '',
      askingPrice: 0,
      purchasePrice: 0,
      arv: 0,
      yearBuilt: 1990,
      sqft: 1500,
      rehab: 35000,
      holdingCosts: 2500,
      monthsToHold: 6,
      hasPool: false,
      rehabLevel: 1,
      agentName: '',
      initialOfferDate: '',
      resubmittalDate: '',
      notes: '',
      gapProjectPercent: 0,
      gapAnnualizedPercent: 0,
    },
    hmlARV: {
      ltvPercent: 0.70,             // Updated from 65% to 70% for 2026
      loanBasis: 'arv',
      pointsPercent: 0.03,          // Updated from 2% to 3% (2026 typical)
      interestRate: 0.12,
      adminFee: 2500,               // Updated from $1,000 to $2,500 (2026 junk fees)
    },
    hmlPP: {
      ltvPercent: 0.85,             // Updated from 90% to 85% for 2026
      loanBasis: 'pp',
      pointsPercent: 0.03,          // Updated from 2% to 3% (2026 typical)
      interestRate: 0.12,
      adminFee: 2500,               // Updated from $1,000 to $2,500 (2026 junk fees)
    },
    gapDebt: {
      pointsPercent: 0,
      interestRate: 0.12,
      interestType: 'annual',
    },
    gapEquity: {
      gapEquityPercent: 0.25,
    },
    plDebt: {
      ltvPercent: 1.0,
      pointsPercent: 0,
      interestRate: 0.12,
      interestType: 'monthly',
      adminFee: 0,
    },
    plEquity: {
      ltvPercent: 1.0,
      plEquityPercent: 0.50,
    },
  };
}

export function calculateAll(inputs: CalculatorInputs): ProfitCalculatorResult {
  const { property, hmlARV, hmlPP, gapDebt, gapEquity, plDebt, plEquity } = inputs;
  const tpc = calcTPC(property);
  const rehab = estimateRehabFromYearBuilt(property);
  const seventyPercentRule = Math.round(property.arv * 0.70 - property.rehab);

  const scenarios: ScenarioResult[] = [
    buildHMLGapDebt(property, tpc, hmlARV, gapDebt,
      'HML (ARV) + Gap Funder — Debt',
      'Hard money loan based on ARV. Gap funder covers the difference and earns interest/points.'
    ),
    buildHMLGapEquity(property, tpc, hmlARV, gapEquity,
      'HML (ARV) + Gap Funder — Equity',
      'Hard money loan based on ARV. Gap funder covers the difference and earns an equity share of profit.'
    ),
    buildHMLGapDebt(property, tpc, hmlPP, gapDebt,
      'HML (Purchase Price) + Gap Funder — Debt',
      'Hard money loan based on purchase price (higher LTV). Gap funder covers the difference and earns interest/points.'
    ),
    buildHMLGapEquity(property, tpc, hmlPP, gapEquity,
      'HML (Purchase Price) + Gap Funder — Equity',
      'Hard money loan based on purchase price. Gap funder covers the difference and earns an equity share of profit.'
    ),
    buildPLDebt(property, tpc, plDebt,
      '100% Private Lender — Debt',
      'Private lender funds the entire project. Lender earns interest/points. No money out of your pocket.'
    ),
    buildPLEquity(property, tpc, plEquity,
      '100% Private Lender — Equity',
      'Private lender funds the entire project and earns an equity share of profit. No money out of your pocket.'
    ),
  ];

  const rapidFire = buildRapidFire(property);

  // ── 2012 Profit Calculator: All-Cash Scenario ──
  const netResale = calcNetResale(property.arv);
  const allCashProfit = netResale - tpc.tpc;
  const allCashROI = tpc.tpc > 0 ? allCashProfit / tpc.tpc : 0;
  const allCashAROI = property.monthsToHold > 0 ? (allCashROI / property.monthsToHold) * 12 : 0;
  const allCash: AllCashResult = {
    totalInvestment: tpc.tpc,
    netResale,
    profit: Math.round(allCashProfit),
    roi: allCashROI,
    annualizedROI: allCashAROI,
  };

  // ── 2012 Profit Calculator: 50-50 Private Lender Split ──
  const fiftyFiftyProfit = Math.round(allCashProfit / 2);
  const fiftyFifty: FiftyFiftySplitResult = {
    totalInvestment: tpc.tpc,
    profit: fiftyFiftyProfit,
    trustDeedAmount: tpc.tpc,
    roiAnnualized: tpc.tpc > 0 && property.monthsToHold > 0
      ? (fiftyFiftyProfit / tpc.tpc) * (12 / property.monthsToHold) : 0,
    roi12Month: tpc.tpc > 0 ? fiftyFiftyProfit / tpc.tpc : 0,
  };

  // ── 2012 Profit Calculator: Developer's Profit with Predetermined Gap Rate ──
  // Uses the HML ARV scenario as the base (matching the 2012 file)
  const hmlCalc = scenarios[0]; // HML ARV + Gap Debt
  const hmlProfit = hmlCalc ? (netResale - tpc.tpc - (hmlCalc.hml?.totalHMLCosts || 0)) : 0;
  const gapFundsNeeded = hmlCalc?.gapDebt?.gapLoan || 0;
  const gapProjPct = property.gapProjectPercent;
  const gapAnnPct = property.gapAnnualizedPercent;
  const gapLenderProfitProject = Math.round(gapProjPct * gapFundsNeeded);
  const gapLenderProfitAnnual = Math.round(gapAnnPct * gapFundsNeeded * property.monthsToHold / 12);
  const developerProfit: DeveloperProfitResult = {
    hmlProfit: Math.round(hmlProfit),
    gapFundsNeeded,
    gapLenderProfitProject,
    developerProfitProject: Math.round(hmlProfit - gapLenderProfitProject),
    gapLenderROIProject: property.monthsToHold > 0 ? (gapProjPct * 12) / property.monthsToHold : 0,
    gapLenderProfitAnnual,
    developerProfitAnnual: Math.round(hmlProfit - gapLenderProfitAnnual),
    interestEarnedOwnFunds: gapFundsNeeded > 0 ? (hmlProfit - fiftyFiftyProfit) / gapFundsNeeded : 0,
  };

  return { tpc, rehab, seventyPercentRule, scenarios, rapidFire, allCash, fiftyFifty, developerProfit };
}
