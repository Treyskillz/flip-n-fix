import { describe, it, expect } from 'vitest';

// We'll test the calculation logic by replicating it server-side
// This mirrors the client-side profitCalculator.ts logic

const DEFAULTS = {
  realtorCostRate: 0.04,
  sellingClosingCostRate: 0.02,
  purchaseClosingRate: 0.02,
  annualPropertyTaxRate: 0.0125,
  minProfitPercent: 0.10,
  minProfitFloor: 20000,
  alwaysItemsBaseline: 25000,
  localAreaAdditional: 0,
  perAdditional500Sqft: 3000,
  level2Multiplier: 0.30,
};

function calcTPC(purchasePrice: number, rehab: number, holdingCosts: number, months: number) {
  const closingCosts = Math.round(purchasePrice * DEFAULTS.purchaseClosingRate);
  const holdTotal = Math.round(holdingCosts * months);
  const tpc = purchasePrice + rehab + closingCosts + holdTotal;
  return { purchase: purchasePrice, rehab, closingCosts, holdingCosts: holdTotal, tpc };
}

function calcNetResale(resalePrice: number) {
  const totalSellRate = DEFAULTS.realtorCostRate + DEFAULTS.sellingClosingCostRate;
  return Math.round(resalePrice - (resalePrice * totalSellRate));
}

function calcDealCheck(arv: number, profit: number) {
  const min = Math.max(arv * DEFAULTS.minProfitPercent, DEFAULTS.minProfitFloor);
  return { minProfitRequired: Math.round(min), projectedProfit: Math.round(profit), isDeal: profit >= min };
}

describe('Profit Calculator — Real Deal Test: 123 Main St, Houston TX', () => {
  // Real deal scenario:
  // Asking: $150,000 | Purchase: $120,000 | ARV: $200,000
  // Rehab: $35,000 | Holding: $2,500/mo | 6 months
  const purchase = 120000;
  const rehab = 35000;
  const arv = 200000;
  const asking = 150000;
  const holdingPerMonth = 2500;
  const months = 6;

  const tpc = calcTPC(purchase, rehab, holdingPerMonth, months);

  it('calculates Total Project Cost correctly', () => {
    // Purchase: $120,000
    // Rehab: $35,000
    // Closing: $120,000 * 2% = $2,400
    // Holding: $2,500 * 6 = $15,000
    // TPC: $120,000 + $35,000 + $2,400 + $15,000 = $172,400
    expect(tpc.purchase).toBe(120000);
    expect(tpc.rehab).toBe(35000);
    expect(tpc.closingCosts).toBe(2400);
    expect(tpc.holdingCosts).toBe(15000);
    expect(tpc.tpc).toBe(172400);
  });

  it('calculates Net Resale (at ARV) correctly', () => {
    // Net = $200,000 - ($200,000 * 6%) = $200,000 - $12,000 = $188,000
    const net = calcNetResale(arv);
    expect(net).toBe(188000);
  });

  it('calculates 70% Rule correctly', () => {
    // 70% Rule = ARV * 0.70 - Rehab = $200,000 * 0.70 - $35,000 = $140,000 - $35,000 = $105,000
    const seventyPctRule = Math.round(arv * 0.70 - rehab);
    expect(seventyPctRule).toBe(105000);
  });

  it('calculates All-Cash Profit correctly', () => {
    const net = calcNetResale(arv); // $188,000
    const profit = net - tpc.tpc;   // $188,000 - $172,400 = $15,600
    const roi = profit / tpc.tpc;   // $15,600 / $172,400 = 9.05%
    const aroi = (roi / months) * 12; // 18.09%

    expect(profit).toBe(15600);
    expect(roi).toBeCloseTo(0.0905, 3);
    expect(aroi).toBeCloseTo(0.1809, 3);
  });

  it('calculates Deal Check correctly', () => {
    const net = calcNetResale(arv);
    const profit = net - tpc.tpc; // $15,600
    const check = calcDealCheck(arv, profit);
    // MIN profit = MAX($200K * 10%, $20K) = MAX($20K, $20K) = $20,000
    expect(check.minProfitRequired).toBe(20000);
    expect(check.projectedProfit).toBe(15600);
    // $15,600 < $20,000 → NOPE!
    expect(check.isDeal).toBe(false);
  });

  it('calculates 50-50 Private Lender Split correctly', () => {
    const net = calcNetResale(arv);
    const allCashProfit = net - tpc.tpc; // $15,600
    const fiftyFiftyProfit = Math.round(allCashProfit / 2); // $7,800
    const trustDeed = tpc.tpc; // $172,400
    const roi12 = fiftyFiftyProfit / trustDeed; // 4.52%
    const roiAnn = (fiftyFiftyProfit / trustDeed) * (12 / months); // 9.05%

    expect(fiftyFiftyProfit).toBe(7800);
    expect(trustDeed).toBe(172400);
    expect(roi12).toBeCloseTo(0.0452, 3);
    expect(roiAnn).toBeCloseTo(0.0905, 3);
  });

  it('calculates HML on ARV + Gap Funder (Debt) correctly', () => {
    // HML: 70% of ARV = $200,000 * 0.70 = $140,000
    const hmlLoan = Math.round(arv * 0.70);
    expect(hmlLoan).toBe(140000);

    // Points: $140,000 * 3% = $4,200
    const points = Math.round(hmlLoan * 0.03);
    expect(points).toBe(4200);

    // Interest: ($140,000 * 12% / 12) * 6 = $8,400
    const interest = Math.round((hmlLoan * 0.12 / 12) * months);
    expect(interest).toBe(8400);

    // Admin fee: $2,500
    const admin = 2500;
    const totalHML = points + interest + admin; // $15,100
    expect(totalHML).toBe(15100);

    // Gap: TPC - HML Loan = $172,400 - $140,000 = $32,400
    const gapDiff = tpc.tpc - hmlLoan;
    expect(gapDiff).toBe(32400);

    // Gap loan = gapDiff + HML costs = $32,400 + $15,100 = $47,500
    const gapLoan = gapDiff + totalHML;
    expect(gapLoan).toBe(47500);

    // Gap interest (annual type): ($47,500 * 12% / 12) * 6 = $2,850
    const gapInterest = Math.round((gapLoan * 0.12 / 12) * months);
    expect(gapInterest).toBe(2850);

    // Overall cost = TPC + HML costs + gap costs = $172,400 + $15,100 + $2,850 = $190,350
    const overallCost = tpc.tpc + totalHML + gapInterest;
    expect(overallCost).toBe(190350);

    // Profit = Net resale - overall cost = $188,000 - $190,350 = -$2,350
    const net = calcNetResale(arv);
    const profit = net - overallCost;
    expect(profit).toBe(-2350);

    // This deal is NOT profitable with HML + Gap Debt at these numbers
    expect(profit).toBeLessThan(0);
  });

  it('calculates Rapid-Fire offer prices correctly', () => {
    // At 18% ROI target:
    // netARV = $200,000 * 0.94 = $188,000
    // targetTI = $188,000 / 1.18 = $159,322
    // offer = ($159,322 - $35,000 - $15,000) / 1.02 = $109,322 / 1.02 = $107,178
    const netARV = arv * (1 - 0.06);
    const targetTI = netARV / 1.18;
    const holdTotal = holdingPerMonth * months;
    const offer = Math.round((targetTI - rehab - holdTotal) / 1.02);

    expect(netARV).toBe(188000);
    expect(offer).toBeGreaterThan(100000);
    expect(offer).toBeLessThan(115000);

    // Verify profit at this offer
    const closingCost = Math.round(offer * 0.02);
    const ti = offer + rehab + closingCost + holdTotal;
    const profit = Math.round(netARV - ti);
    const roi = profit / ti;
    expect(roi).toBeCloseTo(0.18, 1);
  });

  it('calculates Year-Built Rehab estimate correctly', () => {
    // Year built: 1990, current year: 2026, age: 36 years
    // Age 36 → factor 0.8 (31-40 range)
    const age = 2026 - 1990;
    expect(age).toBe(36);

    let factor: number;
    if (age <= 5) factor = 0.3;
    else if (age <= 10) factor = 0.4;
    else if (age <= 15) factor = 0.5;
    else if (age <= 20) factor = 0.6;
    else if (age <= 30) factor = 0.7;
    else if (age <= 40) factor = 0.8;
    else if (age <= 50) factor = 0.9;
    else factor = 1.0;

    expect(factor).toBe(0.8);

    // Base rehab = $25,000 * 0.8 = $20,000
    const baseRehab = Math.round(25000 * factor);
    expect(baseRehab).toBe(20000);

    // 1500 sqft → no sqft adjustment (under 2000)
    const sqftAdj = 0;

    // No pool, Level 1
    const total = baseRehab + sqftAdj;
    expect(total).toBe(20000);
  });

  it('validates resale sensitivity table structure', () => {
    // Should have 9 rows: -$20K to +$20K in $5K steps
    const rows = [];
    for (let delta = -20000; delta <= 20000; delta += 5000) {
      const resale = arv + delta;
      const net = calcNetResale(resale);
      const overallCost = 190350; // From HML ARV Gap Debt scenario
      rows.push({ resale, net, profit: net - overallCost });
    }
    expect(rows.length).toBe(9);
    expect(rows[0].resale).toBe(180000); // ARV - $20K
    expect(rows[4].resale).toBe(200000); // ARV
    expect(rows[8].resale).toBe(220000); // ARV + $20K
  });
});

describe('Profit Calculator — Profitable Deal Test: 456 Oak Ave, Dallas TX', () => {
  // A more profitable scenario to verify "YES" deal checks
  const purchase = 85000;
  const rehab = 30000;
  const arv = 180000;
  const holdingPerMonth = 2000;
  const months = 5;

  const tpc = calcTPC(purchase, rehab, holdingPerMonth, months);

  it('calculates TPC for profitable deal', () => {
    // Purchase: $85,000
    // Rehab: $30,000
    // Closing: $85,000 * 2% = $1,700
    // Holding: $2,000 * 5 = $10,000
    // TPC: $85,000 + $30,000 + $1,700 + $10,000 = $126,700
    expect(tpc.tpc).toBe(126700);
  });

  it('calculates All-Cash profit as a deal', () => {
    const net = calcNetResale(arv); // $180,000 * 0.94 = $169,200
    const profit = net - tpc.tpc;   // $169,200 - $126,700 = $42,500
    const check = calcDealCheck(arv, profit);

    expect(net).toBe(169200);
    expect(profit).toBe(42500);
    expect(check.minProfitRequired).toBe(20000); // MAX($18K, $20K) = $20K
    expect(check.isDeal).toBe(true); // $42,500 > $20,000 → YES!
  });

  it('calculates 70% rule shows good buy', () => {
    const rule = Math.round(arv * 0.70 - rehab);
    // $180,000 * 0.70 - $30,000 = $126,000 - $30,000 = $96,000
    expect(rule).toBe(96000);
    // Purchase at $85,000 < $96,000 → good buy
    expect(purchase).toBeLessThan(rule);
  });
});
