// ============================================================
// Fix & Flip Analyzer — Financial Calculations
// ============================================================

import type {
  FinancingDetails,
  ClosingCosts,
  HoldingCosts,
  ProfitAnalysis,
  RehabPhase,
} from './types';

export function calculateFinancing(
  purchasePrice: number,
  rehabCost: number,
  loanToValue: number,
  interestRate: number,
  points: number,
  holdingMonths: number
): FinancingDetails {
  const totalProjectCost = purchasePrice + rehabCost;
  const loanAmount = Math.round(totalProjectCost * (loanToValue / 100));
  const monthlyRate = interestRate / 100 / 12;
  const monthlyInterest = Math.round(loanAmount * monthlyRate);
  const totalInterest = monthlyInterest * holdingMonths;
  const totalPoints = Math.round(loanAmount * (points / 100));
  const downPayment = totalProjectCost - loanAmount;

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
    downPayment,
  };
}

export function calculateClosingCosts(
  purchasePrice: number,
  arv: number,
  buyPct: number,
  sellPct: number
): ClosingCosts {
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

export function calculateHoldingCosts(
  monthlyPropertyTax: number,
  monthlyInsurance: number,
  monthlyUtilities: number,
  monthlyOther: number,
  holdingMonths: number
): HoldingCosts {
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

export function calculateRehabTotals(phases: RehabPhase[]) {
  const enabled = phases.filter((p) => p.enabled);
  const totalMaterials = enabled.reduce((s, p) => s + p.materialsCost, 0);
  const totalLabor = enabled.reduce((s, p) => s + p.laborCost, 0);
  const totalCost = totalMaterials + totalLabor;
  const maxEnd = enabled.reduce((m, p) => Math.max(m, p.startDay + p.durationDays), 0);
  return { totalMaterials, totalLabor, totalCost, totalDurationDays: maxEnd };
}

/**
 * Binary search to find the maximum purchase price that achieves a target ROI.
 * Accounts for the fact that financing and buy-closing costs scale with purchase price.
 */
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
  targetROIPct: number
): number {
  const targetMultiplier = 1 + targetROIPct / 100; // e.g. 1.20 for 20%
  let lo = 0;
  let hi = arv;

  for (let i = 0; i < 100; i++) {
    const pp = (lo + hi) / 2;

    // Financing costs at this purchase price
    let financingCosts = 0;
    if (useHardMoney) {
      const totalProjectCost = pp + rehabCost;
      const loanAmount = totalProjectCost * (loanToValue / 100);
      const monthlyInterest = loanAmount * (interestRate / 100 / 12);
      const totalInterest = monthlyInterest * holdingMonths;
      const totalPoints = loanAmount * (points / 100);
      financingCosts = totalInterest + totalPoints;
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

/**
 * Determines a clear deal verdict with specific reasons.
 */
function getDealVerdict(
  arv: number,
  purchasePrice: number,
  netProfit: number,
  roi: number,
  maxAllowableOffer: number,
  recommendedMaxPrice: number,
  rehabCost: number
): { verdict: 'excellent' | 'good' | 'marginal' | 'not_recommended'; reasons: string[] } {
  if (arv <= 0) {
    return { verdict: 'not_recommended', reasons: ['No ARV data — add comparable sales to evaluate this deal.'] };
  }

  const reasons: string[] = [];
  let verdict: 'excellent' | 'good' | 'marginal' | 'not_recommended';

  // Check profitability
  if (netProfit <= 0) {
    reasons.push(`This deal loses money. Net loss of ${formatCurrency(Math.abs(netProfit))}.`);
  } else if (roi >= 20) {
    reasons.push(`Strong ROI of ${formatPercent(roi)} exceeds the 20% target.`);
  } else if (roi >= 10) {
    reasons.push(`Moderate ROI of ${formatPercent(roi)} — below the 20% target but still profitable.`);
  } else {
    reasons.push(`Low ROI of ${formatPercent(roi)} — thin margin leaves little room for error.`);
  }

  // Check 70% rule
  if (purchasePrice <= maxAllowableOffer) {
    reasons.push(`Purchase price is ${formatCurrency(maxAllowableOffer - purchasePrice)} below the 70% Rule MAO — good entry point.`);
  } else {
    reasons.push(`Purchase price is ${formatCurrency(purchasePrice - maxAllowableOffer)} over the 70% Rule MAO of ${formatCurrency(maxAllowableOffer)}.`);
  }

  // Check rehab-to-ARV ratio
  const rehabToArv = (rehabCost / arv) * 100;
  if (rehabToArv > 30) {
    reasons.push(`Rehab cost is ${rehabToArv.toFixed(0)}% of ARV — high rehab risk.`);
  } else if (rehabToArv > 20) {
    reasons.push(`Rehab cost is ${rehabToArv.toFixed(0)}% of ARV — moderate rehab scope.`);
  }

  // Recommend max price
  if (purchasePrice > recommendedMaxPrice && recommendedMaxPrice > 0) {
    reasons.push(`To achieve 20% ROI, offer no more than ${formatCurrency(recommendedMaxPrice)} (${formatCurrency(purchasePrice - recommendedMaxPrice)} reduction needed).`);
  }

  // Determine verdict
  if (roi >= 20 && purchasePrice <= maxAllowableOffer) {
    verdict = 'excellent';
  } else if (roi >= 20 || (roi >= 15 && purchasePrice <= maxAllowableOffer)) {
    verdict = 'good';
  } else if (roi >= 5 && netProfit > 0) {
    verdict = 'marginal';
  } else {
    verdict = 'not_recommended';
  }

  return { verdict, reasons };
}

export function calculateProfitability(
  purchasePrice: number,
  rehabCost: number,
  arv: number,
  financing: FinancingDetails,
  closing: ClosingCosts,
  holding: HoldingCosts
): ProfitAnalysis {
  const financingCosts = financing.useHardMoney
    ? financing.totalInterest + financing.totalPoints
    : 0;

  const totalInvestment =
    purchasePrice +
    rehabCost +
    financingCosts +
    holding.totalHoldingCosts +
    closing.buyClosingAmount +
    closing.sellClosingAmount;

  const grossProfit = arv - purchasePrice - rehabCost;
  const netProfit = arv - totalInvestment;

  const cashOutOfPocket = financing.useHardMoney
    ? financing.downPayment + closing.buyClosingAmount
    : purchasePrice + closing.buyClosingAmount;

  const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
  const cashOnCash = cashOutOfPocket > 0 ? (netProfit / cashOutOfPocket) * 100 : 0;

  // 70% Rule: MAO = ARV × 0.70 − Rehab Cost
  const maxAllowableOffer = Math.round(arv * 0.7 - rehabCost);

  // Deal Score: 0-100 based on ROI and 70% rule compliance
  let dealScore = 0;
  if (netProfit > 0) {
    const roiScore = Math.min(roi / 30 * 50, 50); // up to 50 points for ROI
    const maoScore = purchasePrice <= maxAllowableOffer ? 30 : Math.max(0, 30 - ((purchasePrice - maxAllowableOffer) / maxAllowableOffer) * 100);
    const profitScore = Math.min(netProfit / 100000 * 20, 20); // up to 20 points for absolute profit
    dealScore = Math.round(Math.min(roiScore + maoScore + profitScore, 100));
  }

  // ─── Recommended Max Purchase Price for 20% ROI ──────────
  const targetROI = 20;
  const recommendedMaxPrice = arv > 0
    ? calculateMaxPurchasePrice(
        arv, rehabCost, holding.totalHoldingCosts,
        closing.sellClosingPct, closing.buyClosingPct,
        financing.loanToValue, financing.interestRate,
        financing.points, financing.holdingMonths,
        financing.useHardMoney, targetROI
      )
    : 0;

  // ─── Deal Verdict ──────────────────────────────────────────
  const { verdict: dealVerdict, reasons: verdictReasons } = getDealVerdict(
    arv, purchasePrice, netProfit, roi, maxAllowableOffer, recommendedMaxPrice, rehabCost
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
  };
}

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
