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
