// ============================================================
// Fix & Flip Analyzer — Financial Calculations
// ============================================================

import type {
  FinancingDetails,
  ClosingCosts,
  HoldingCosts,
  ProfitAnalysis,
  RehabPhase,
  CompProperty,
  SubjectProperty,
  CompQualityScore,
} from './types';

// ─── Primary Lender + Gap Funder Calculation ─────────────────

export interface FinancingParams {
  useFinancing: boolean;
  lenderType: 'hard_money' | 'private_money';
  loanToValue: number;
  interestRate: number;
  points: number;
  holdingMonths: number;
  // Gap funder
  useGapFunding: boolean;
  gapCoveragePercent: number; // % of the down payment gap to cover
  gapInterestRate: number;
  gapPoints: number;
}

export function calculateFinancing(
  purchasePrice: number,
  rehabCost: number,
  loanToValue: number,
  interestRate: number,
  points: number,
  holdingMonths: number,
  // Gap funder params (optional, backward compatible)
  useGapFunding: boolean = false,
  gapCoveragePercent: number = 0,
  gapInterestRate: number = 15,
  gapPoints: number = 3
): FinancingDetails {
  // Edge case guards: clamp negative values to 0
  purchasePrice = Math.max(0, purchasePrice || 0);
  rehabCost = Math.max(0, rehabCost || 0);
  loanToValue = Math.max(0, Math.min(100, loanToValue || 0));
  interestRate = Math.max(0, interestRate || 0);
  points = Math.max(0, points || 0);
  holdingMonths = Math.max(0, holdingMonths || 0);
  gapCoveragePercent = Math.max(0, Math.min(100, gapCoveragePercent || 0));
  gapInterestRate = Math.max(0, gapInterestRate || 0);
  gapPoints = Math.max(0, gapPoints || 0);

  const totalProjectCost = purchasePrice + rehabCost;

  // ─── Primary Lender ──────────────────────────────────────
  const loanAmount = Math.round(totalProjectCost * (loanToValue / 100));
  const monthlyRate = interestRate / 100 / 12;
  const monthlyInterest = Math.round(loanAmount * monthlyRate);
  const totalInterest = monthlyInterest * holdingMonths;
  const totalPoints = Math.round(loanAmount * (points / 100));
  const primaryDownPayment = totalProjectCost - loanAmount;
  const primaryLenderCost = totalInterest + totalPoints;

  // ─── Gap Funder ──────────────────────────────────────────
  let gapAmount = 0;
  let gapInterestTotal = 0;
  let gapPointsTotal = 0;
  let gapTotalCost = 0;

  if (useGapFunding && gapCoveragePercent > 0 && primaryDownPayment > 0) {
    gapAmount = Math.round(primaryDownPayment * (gapCoveragePercent / 100));
    const gapMonthlyRate = gapInterestRate / 100 / 12;
    const gapMonthlyInterest = Math.round(gapAmount * gapMonthlyRate);
    gapInterestTotal = gapMonthlyInterest * holdingMonths;
    gapPointsTotal = Math.round(gapAmount * (gapPoints / 100));
    gapTotalCost = gapInterestTotal + gapPointsTotal;
  }

  // ─── Aggregates ──────────────────────────────────────────
  const totalFinancingCosts = primaryLenderCost + gapTotalCost;
  // Cash out of pocket = down payment minus gap funding + buy closing (added later)
  const cashOutOfPocket = primaryDownPayment - gapAmount;

  return {
    useHardMoney: true,
    purchasePrice,
    rehabCost,
    loanToValue,
    interestRate,
    points,
    holdingMonths,
    loanAmount,
    monthlyInterest,
    totalInterest,
    totalPoints,
    downPayment: primaryDownPayment,
    // Gap funding
    gapFunderEnabled: useGapFunding && gapCoveragePercent > 0,
    gapAmount,
    gapInterest: gapInterestTotal,
    gapPoints: gapPointsTotal,
    gapTotalCost,
    // Aggregates
    totalFinancingCosts,
    cashOutOfPocket,
  };
}

// ─── Closing Costs ───────────────────────────────────────────

export function calculateClosingCosts(
  purchasePrice: number,
  arv: number,
  buyPct: number,
  sellPct: number
): ClosingCosts {
  // Edge case guards
  purchasePrice = Math.max(0, purchasePrice || 0);
  arv = Math.max(0, arv || 0);
  buyPct = Math.max(0, buyPct || 0);
  sellPct = Math.max(0, sellPct || 0);

  const buyClosingAmount = Math.round(purchasePrice * (buyPct / 100));
  const sellClosingAmount = Math.round(arv * (sellPct / 100));
  return {
    buyClosingPct: buyPct,
    sellClosingPct: sellPct,
    buyClosingAmount,
    sellClosingAmount,
    totalClosingCosts: buyClosingAmount + sellClosingAmount,
  };
}

// ─── Holding Costs ───────────────────────────────────────────

export function calculateHoldingCosts(
  monthlyPropertyTax: number,
  monthlyInsurance: number,
  monthlyUtilities: number,
  monthlyOther: number,
  holdingMonths: number
): HoldingCosts {
  // Edge case guards
  monthlyPropertyTax = Math.max(0, monthlyPropertyTax || 0);
  monthlyInsurance = Math.max(0, monthlyInsurance || 0);
  monthlyUtilities = Math.max(0, monthlyUtilities || 0);
  monthlyOther = Math.max(0, monthlyOther || 0);
  holdingMonths = Math.max(0, holdingMonths || 0);

  const monthlyTotal = monthlyPropertyTax + monthlyInsurance + monthlyUtilities + monthlyOther;
  return {
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyUtilities,
    monthlyOther,
    holdingMonths,
    totalHoldingCosts: monthlyTotal * holdingMonths,
  };
}

// ─── Rehab Totals ────────────────────────────────────────────

export function calculateRehabTotals(phases: RehabPhase[]) {
  const enabled = phases.filter((p) => p.enabled);
  const totalMaterials = enabled.reduce((s, p) => s + p.materialsCost, 0);
  const totalLabor = enabled.reduce((s, p) => s + p.laborCost, 0);
  const totalCost = totalMaterials + totalLabor;
  const maxEnd = enabled.reduce((m, p) => Math.max(m, p.startDay + p.durationDays), 0);
  return { totalMaterials, totalLabor, totalCost, totalDurationDays: maxEnd };
}

// ─── Comp Quality Scoring ────────────────────────────────────

export function scoreComp(
  comp: CompProperty,
  subject: SubjectProperty
): CompQualityScore {
  const warnings: string[] = [];
  let recency = 0;
  let sizeSimilarity = 0;
  let bedBathMatch = 0;
  let completeness = 0;

  // ── Hard-fail criteria (generate warnings for violations) ──

  // DOM check: must be 90 days or less
  if (comp.daysOnMarket > 90) {
    warnings.push(`\u26d4 DOM is ${comp.daysOnMarket} days — comps must be on market 90 days or less. This comp does not meet criteria.`);
  }

  // Sold within 6 months check
  if (comp.saleDate) {
    const saleDate = new Date(comp.saleDate);
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    if (saleDate < sixMonthsAgo) {
      const monthsAgo = Math.round((now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      warnings.push(`\u26d4 Sold ${monthsAgo} months ago — comps must have sold within the last 6 months.`);
    }
  }

  // Sqft within 200 check
  if (comp.sqft > 0 && subject.sqft > 0) {
    const sqftDiff = Math.abs(comp.sqft - subject.sqft);
    if (sqftDiff > 200) {
      warnings.push(`\u26d4 Sq ft differs by ${sqftDiff} — comps must be within 200 sq ft of the subject (${subject.sqft} sq ft).`);
    }
  }

  // Bed/bath within ±1 check
  const bedDiff = Math.abs(comp.beds - subject.beds);
  const bathDiff = Math.abs(comp.baths - subject.baths);
  if (bedDiff > 1) {
    warnings.push(`\u26d4 Bedrooms differ by ${bedDiff} — comps must be within \u00b11 bedroom of the subject (${subject.beds} beds).`);
  }
  if (bathDiff > 1) {
    warnings.push(`\u26d4 Bathrooms differ by ${bathDiff} — comps must be within \u00b11 bathroom of the subject (${subject.baths} baths).`);
  }

  // Age within 10 years check
  if (comp.yearBuilt > 0 && subject.yearBuilt > 0) {
    const ageDiff = Math.abs(comp.yearBuilt - subject.yearBuilt);
    if (ageDiff > 10) {
      warnings.push(`\u26d4 Year built differs by ${ageDiff} years — comps must be within 10 years of the subject (built ${subject.yearBuilt}).`);
    }
  }

  // ── Scoring categories ──

  // 1. Recency (0-25): how recently the comp sold
  if (comp.saleDate) {
    const saleDate = new Date(comp.saleDate);
    const now = new Date();
    const monthsAgo = (now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsAgo <= 3) {
      recency = 25;
    } else if (monthsAgo <= 6) {
      recency = 20;
    } else {
      recency = 5;
      // Warning already added above for >6 months
    }
  } else {
    recency = 5;
    warnings.push('No sale date provided — cannot assess recency.');
  }

  // 2. Size Similarity (0-25): sqft closeness to subject (within 200 sq ft)
  if (comp.sqft > 0 && subject.sqft > 0) {
    const sqftDiff = Math.abs(comp.sqft - subject.sqft);
    if (sqftDiff <= 100) {
      sizeSimilarity = 25;
    } else if (sqftDiff <= 200) {
      sizeSimilarity = 20;
    } else if (sqftDiff <= 300) {
      sizeSimilarity = 10;
    } else {
      sizeSimilarity = 5;
    }
  } else if (comp.sqft <= 0) {
    sizeSimilarity = 0;
    warnings.push('No square footage — $/sqft calculation will be inaccurate.');
  }

  // 3. Bed/Bath Match (0-25)
  if (bedDiff === 0 && bathDiff === 0) {
    bedBathMatch = 25;
  } else if (bedDiff <= 1 && bathDiff <= 1) {
    bedBathMatch = 18;
  } else {
    bedBathMatch = 5;
  }

  // 4. Data Completeness & DOM (0-25)
  let fields = 0;
  if (comp.address) fields++;
  if (comp.salePrice > 0) fields++;
  if (comp.saleDate) fields++;
  if (comp.sqft > 0) fields++;
  if (comp.beds > 0) fields++;
  if (comp.baths > 0) fields++;
  if (comp.yearBuilt > 0) fields++;
  if (comp.daysOnMarket > 0 && comp.daysOnMarket <= 90) fields++;
  // 8 fields total
  completeness = Math.round((fields / 8) * 25);
  if (fields < 5) {
    warnings.push('Incomplete comp data — fill in all fields for better accuracy.');
  }

  const total = recency + sizeSimilarity + bedBathMatch + completeness;
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (total >= 85) grade = 'A';
  else if (total >= 70) grade = 'B';
  else if (total >= 55) grade = 'C';
  else if (total >= 40) grade = 'D';
  else grade = 'F';

  return { total, recency, sizeSimilarity, bedBathMatch, completeness, warnings, grade };
}

/** Score the overall comp set quality */
export function scoreCompSet(
  comps: CompProperty[],
  subject: SubjectProperty
): { avgScore: number; warnings: string[]; recommendation: string } {
  if (comps.length === 0) {
    return {
      avgScore: 0,
      warnings: ['No comparable sales entered. Add at least 3 comps for a reliable ARV estimate.'],
      recommendation: 'Add comparable sales to calculate ARV.',
    };
  }

  const scores = comps.map((c) => scoreComp(c, subject));
  const avgScore = Math.round(scores.reduce((s, sc) => s + sc.total, 0) / scores.length);
  const warnings: string[] = [];

  if (comps.length === 1) {
    warnings.push('Only 1 comp entered. Minimum 3 comps recommended for a reliable ARV.');
  } else if (comps.length === 2) {
    warnings.push('Only 2 comps entered. 3+ comps recommended for a reliable ARV.');
  }

  // Check for outliers — if any comp's $/sqft is >40% different from the average
  const validComps = comps.filter((c) => c.pricePerSqft > 0);
  if (validComps.length >= 2) {
    const avgPpsf = validComps.reduce((s, c) => s + c.pricePerSqft, 0) / validComps.length;
    for (const c of validComps) {
      const pctDiff = Math.abs(c.pricePerSqft - avgPpsf) / avgPpsf;
      if (pctDiff > 0.40) {
        warnings.push(`"${c.address || 'Unnamed comp'}" has $/sqft of $${c.pricePerSqft} — ${(pctDiff * 100).toFixed(0)}% different from average ($${Math.round(avgPpsf)}). Potential outlier.`);
      }
    }
  }

  let recommendation: string;
  if (avgScore >= 80 && comps.length >= 3) {
    recommendation = 'Strong comp set — ARV estimate is well-supported.';
  } else if (avgScore >= 60 && comps.length >= 2) {
    recommendation = 'Adequate comp set — consider adding more recent, similar comps.';
  } else {
    recommendation = 'Weak comp set — ARV estimate may be unreliable. Add better comps.';
  }

  return { avgScore, warnings, recommendation };
}

// ─── Max Purchase Price (Binary Search) ──────────────────────

function calculateMaxPurchasePrice(
  arv: number,
  rehabCost: number,
  holdingCosts: number,
  sellClosingPct: number,
  buyClosingPct: number,
  loanToValue: number,
  interestRate: number,
  points: number,
  holdingMonths: number,
  useHardMoney: boolean,
  targetROIPct: number,
  // Gap funder params
  useGapFunding: boolean = false,
  gapCoveragePercent: number = 0,
  gapInterestRate: number = 15,
  gapPoints: number = 3
): number {
  let lo = 0;
  let hi = arv;

  for (let i = 0; i < 100; i++) {
    const pp = (lo + hi) / 2;

    let financingCosts = 0;
    if (useHardMoney) {
      const totalProjectCost = pp + rehabCost;
      const loanAmount = totalProjectCost * (loanToValue / 100);
      const monthlyInterest = loanAmount * (interestRate / 100 / 12);
      const totalInterest = monthlyInterest * holdingMonths;
      const totalPts = loanAmount * (points / 100);
      financingCosts = totalInterest + totalPts;

      // Gap funder costs
      if (useGapFunding && gapCoveragePercent > 0) {
        const downPayment = totalProjectCost - loanAmount;
        if (downPayment > 0) {
          const gapAmount = downPayment * (gapCoveragePercent / 100);
          const gapMonthlyInterest = gapAmount * (gapInterestRate / 100 / 12);
          const gapInterestTotal = gapMonthlyInterest * holdingMonths;
          const gapPtsTotal = gapAmount * (gapPoints / 100);
          financingCosts += gapInterestTotal + gapPtsTotal;
        }
      }
    }

    const buyClosing = pp * (buyClosingPct / 100);
    const sellClosing = arv * (sellClosingPct / 100);

    const totalInvestment = pp + rehabCost + financingCosts + holdingCosts + buyClosing + sellClosing;
    const netProfit = arv - totalInvestment;
    const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

    if (roi > targetROIPct) {
      lo = pp;
    } else {
      hi = pp;
    }
  }

  return Math.round(lo);
}

// ─── Deal Verdict ────────────────────────────────────────────

function getDealVerdict(
  arv: number,
  purchasePrice: number,
  netProfit: number,
  roi: number,
  maxAllowableOffer: number,
  recommendedMaxPrice: number,
  rehabCost: number,
  targetROI: number = 20
): { verdict: 'excellent' | 'good' | 'marginal' | 'not_recommended'; reasons: string[] } {
  if (arv <= 0) {
    return { verdict: 'not_recommended', reasons: ['No ARV data — add comparable sales to evaluate this deal.'] };
  }

  const reasons: string[] = [];
  let verdict: 'excellent' | 'good' | 'marginal' | 'not_recommended';

  const halfTarget = targetROI / 2;
  if (netProfit <= 0) {
    reasons.push(`This deal loses money. Net loss of ${formatCurrency(Math.abs(netProfit))}.`);
  } else if (roi >= targetROI) {
    reasons.push(`Strong ROI of ${formatPercent(roi)} meets or exceeds your ${formatPercent(targetROI)} target.`);
  } else if (roi >= halfTarget) {
    reasons.push(`Moderate ROI of ${formatPercent(roi)} — below your ${formatPercent(targetROI)} target but still profitable.`);
  } else {
    reasons.push(`Low ROI of ${formatPercent(roi)} — well below your ${formatPercent(targetROI)} target.`);
  }

  // Check 70% rule — guard against negative MAO
  if (maxAllowableOffer > 0) {
    if (purchasePrice <= maxAllowableOffer) {
      reasons.push(`Purchase price is ${formatCurrency(maxAllowableOffer - purchasePrice)} below the 70% Rule MAO — good entry point.`);
    } else {
      reasons.push(`Purchase price is ${formatCurrency(purchasePrice - maxAllowableOffer)} over the 70% Rule MAO of ${formatCurrency(maxAllowableOffer)}.`);
    }
  } else {
    reasons.push(`70% Rule MAO is negative (${formatCurrency(maxAllowableOffer)}) — rehab costs exceed 70% of ARV.`);
  }

  // Check rehab-to-ARV ratio — guard against division by zero
  const rehabToArv = arv > 0 ? (rehabCost / arv) * 100 : 0;
  if (rehabToArv > 30) {
    reasons.push(`Rehab cost is ${rehabToArv.toFixed(0)}% of ARV — high rehab risk.`);
  } else if (rehabToArv > 20) {
    reasons.push(`Rehab cost is ${rehabToArv.toFixed(0)}% of ARV — moderate rehab scope.`);
  }

  // Recommend max price
  if (purchasePrice > recommendedMaxPrice && recommendedMaxPrice > 0) {
    reasons.push(`To achieve ${formatPercent(targetROI)} ROI, offer no more than ${formatCurrency(recommendedMaxPrice)} (${formatCurrency(purchasePrice - recommendedMaxPrice)} reduction needed).`);
  }

  // Determine verdict
  const goodThreshold = targetROI * 0.75;
  if (roi >= targetROI && purchasePrice <= maxAllowableOffer) {
    verdict = 'excellent';
  } else if (roi >= targetROI || (roi >= goodThreshold && maxAllowableOffer > 0 && purchasePrice <= maxAllowableOffer)) {
    verdict = 'good';
  } else if (roi >= halfTarget && netProfit > 0) {
    verdict = 'marginal';
  } else {
    verdict = 'not_recommended';
  }

  return { verdict, reasons };
}

// ─── Main Profitability Calculation ──────────────────────────

export function calculateProfitability(
  purchasePrice: number,
  rehabCost: number,
  arv: number,
  financing: FinancingDetails,
  closing: ClosingCosts,
  holding: HoldingCosts,
  targetROI: number = 20
): ProfitAnalysis {
  // Primary lender costs
  const primaryLenderCosts = financing.useHardMoney
    ? financing.totalInterest + financing.totalPoints
    : 0;

  // Gap funder costs
  const gapFunderCosts = financing.gapFunderEnabled
    ? financing.gapTotalCost
    : 0;

  // Total financing = primary + gap
  const financingCosts = primaryLenderCosts + gapFunderCosts;

  const totalInvestment =
    purchasePrice +
    rehabCost +
    financingCosts +
    holding.totalHoldingCosts +
    closing.buyClosingAmount +
    closing.sellClosingAmount;

  const grossProfit = arv - purchasePrice - rehabCost;
  const netProfit = arv - totalInvestment;

  // Cash out of pocket:
  // With financing: down payment - gap funding + buy closing costs + primary points + gap points
  // Without financing: purchase price + rehab + buy closing
  let cashOutOfPocket: number;
  if (financing.useHardMoney) {
    const netDownPayment = financing.downPayment - (financing.gapFunderEnabled ? financing.gapAmount : 0);
    cashOutOfPocket = Math.max(0, netDownPayment) + closing.buyClosingAmount;
  } else {
    cashOutOfPocket = purchasePrice + rehabCost + closing.buyClosingAmount;
  }

  // Edge case: prevent division by zero and NaN
  const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
  const cashOnCash = cashOutOfPocket > 0 ? (netProfit / cashOutOfPocket) * 100 : 0;

  // 70% Rule: MAO = ARV × 0.70 − Rehab Cost
  // Edge case: if ARV is 0, MAO is meaningless
  const maxAllowableOffer = arv > 0 ? Math.round(arv * 0.7 - rehabCost) : 0;

  // Deal Score: 0-100
  // Edge case: score is 0 when no profit or no ARV
  let dealScore = 0;
  if (netProfit > 0 && arv > 0) {
    const roiScore = Math.min(Math.max(0, roi) / 30 * 50, 50);
    // Guard against negative or zero MAO
    const maoScore = maxAllowableOffer > 0
      ? (purchasePrice <= maxAllowableOffer ? 30 : Math.max(0, 30 - ((purchasePrice - maxAllowableOffer) / Math.max(maxAllowableOffer, 1)) * 100))
      : 0;
    const profitScore = Math.min(Math.max(0, netProfit) / 100000 * 20, 20);
    dealScore = Math.round(Math.max(0, Math.min(roiScore + maoScore + profitScore, 100)));
  }

  // Recommended Max Purchase Price for target ROI
  // Edge case: only calculate when ARV is positive and meaningful
  const recommendedMaxPrice = arv > 0 && rehabCost >= 0
    ? calculateMaxPurchasePrice(
        arv, rehabCost, holding.totalHoldingCosts,
        closing.sellClosingPct, closing.buyClosingPct,
        financing.loanToValue, financing.interestRate,
        financing.points, financing.holdingMonths,
        financing.useHardMoney, targetROI,
        financing.gapFunderEnabled, 
        financing.gapFunderEnabled ? (financing.gapAmount / Math.max(financing.downPayment, 1)) * 100 : 0,
        financing.gapFunderEnabled ? 15 : 0, // use stored gap rate
        financing.gapFunderEnabled ? 3 : 0   // use stored gap points
      )
    : 0;

  // Deal Verdict
  const { verdict: dealVerdict, reasons: verdictReasons } = getDealVerdict(
    arv, purchasePrice, netProfit, roi, maxAllowableOffer, recommendedMaxPrice, rehabCost, targetROI
  );

  return {
    purchasePrice,
    rehabCost,
    financingCosts,
    holdingCosts: holding.totalHoldingCosts,
    buyClosingCosts: closing.buyClosingAmount,
    sellClosingCosts: closing.sellClosingAmount,
    totalInvestment,
    arv,
    grossProfit,
    netProfit,
    roi,
    cashOnCash,
    maxAllowableOffer,
    dealScore,
    isProfitable: netProfit > 0,
    recommendedMaxPrice,
    targetROI,
    dealVerdict,
    verdictReasons,
    primaryLenderCosts,
    gapFunderCosts,
  };
}

// ─── Formatting Helpers ──────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
