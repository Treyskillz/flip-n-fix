// ============================================================
// Fix & Flip Analyzer — Core Types
// Design: Investor's Workbench (Swiss/Functional Minimalism)
// ============================================================

export interface SubjectProperty {
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  lotSizeSqft: number;
  yearBuilt: number;
  propertyType: string;
  garage: string;
  purchasePrice: number;
}

export interface CompProperty {
  id: string;
  address: string;
  salePrice: number;
  saleDate: string;
  daysOnMarket: number;
  sqft: number;
  beds: number;
  baths: number;
  lotSizeSqft: number;
  yearBuilt: number;
  pricePerSqft: number;
  neighborhood: string;
  notableFeatures: string;
  source: 'manual' | 'auto';
}

export type RehabLevel = 'light' | 'moderate' | 'heavy' | 'custom';

export interface RehabPhase {
  id: string;
  name: string;
  enabled: boolean;
  materialsCost: number;
  laborCost: number;
  durationDays: number;
  startDay: number; // calculated from dependencies
  dependencies: string[]; // ids of phases that must complete first
  color: string;
}

export interface RehabEstimate {
  level: RehabLevel;
  phases: RehabPhase[];
  totalMaterials: number;
  totalLabor: number;
  totalCost: number;
  totalDurationDays: number;
}

export interface FinancingDetails {
  useHardMoney: boolean;
  purchasePrice: number;
  rehabCost: number;
  loanToValue: number; // percentage, e.g. 70
  interestRate: number; // annual, e.g. 12
  points: number; // e.g. 2
  holdingMonths: number;
  loanAmount: number; // calculated
  monthlyInterest: number; // calculated
  totalInterest: number; // calculated
  totalPoints: number; // calculated
  downPayment: number; // calculated
}

export interface ClosingCosts {
  buyClosingPct: number; // e.g. 2
  sellClosingPct: number; // e.g. 6 (includes agent commissions)
  buyClosingAmount: number;
  sellClosingAmount: number;
  totalClosingCosts: number;
}

export interface HoldingCosts {
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyUtilities: number;
  monthlyOther: number;
  holdingMonths: number;
  totalHoldingCosts: number;
}

export interface ProfitAnalysis {
  purchasePrice: number;
  rehabCost: number;
  financingCosts: number;
  holdingCosts: number;
  buyClosingCosts: number;
  sellClosingCosts: number;
  totalInvestment: number;
  arv: number; // After Repair Value
  grossProfit: number;
  netProfit: number;
  roi: number; // percentage
  cashOnCash: number; // percentage
  maxAllowableOffer: number; // 70% rule
  dealScore: number; // 0-100
  isProfitable: boolean;
}
