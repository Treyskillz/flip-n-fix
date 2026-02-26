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
  condition: 'renovated' | 'updated' | 'average' | 'distressed' | '';
}

/** Quality score for a single comp relative to the subject property */
export interface CompQualityScore {
  total: number;         // 0-100 overall score
  recency: number;       // 0-25 — how recently it sold
  sizeSimilarity: number; // 0-25 — sqft similarity to subject
  bedBathMatch: number;  // 0-25 — bed/bath match to subject
  completeness: number;  // 0-25 — data completeness
  warnings: string[];    // specific issues
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
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

// ─── Financing Types ─────────────────────────────────────────

export type LenderType = 'hard_money' | 'private_money';

export interface PrimaryLender {
  enabled: boolean;
  type: LenderType;
  loanToValue: number;    // % of total project cost (purchase + rehab)
  interestRate: number;    // annual %
  points: number;          // origination points %
  holdingMonths: number;   // term length
  // Calculated fields
  loanAmount: number;
  monthlyInterest: number;
  totalInterest: number;
  totalPoints: number;
  downPayment: number;     // total project cost - loan amount
}

export interface GapFunder {
  enabled: boolean;
  coveragePercent: number; // % of the gap (down payment) to cover, 0-100
  interestRate: number;    // annual %
  points: number;          // origination points %
  // Calculated fields
  gapAmount: number;       // actual dollar amount funded
  monthlyInterest: number;
  totalInterest: number;
  totalPoints: number;
}

/** Full capital stack for a deal */
export interface CapitalStack {
  primaryLender: PrimaryLender;
  gapFunder: GapFunder;
  holdingMonths: number;
  // Aggregated calculated fields
  totalLoanAmount: number;       // primary + gap
  totalFinancingCosts: number;   // all interest + all points
  cashOutOfPocket: number;       // what the investor actually brings
}

// Keep backward compat — FinancingDetails is now derived from CapitalStack
export interface FinancingDetails {
  useHardMoney: boolean;
  purchasePrice: number;
  rehabCost: number;
  loanToValue: number;
  interestRate: number;
  points: number;
  holdingMonths: number;
  loanAmount: number;
  monthlyInterest: number;
  totalInterest: number;
  totalPoints: number;
  downPayment: number;
  // New: gap funding fields
  gapFunderEnabled: boolean;
  gapAmount: number;
  gapInterest: number;
  gapPoints: number;
  gapTotalCost: number;
  // Aggregate
  totalFinancingCosts: number;
  cashOutOfPocket: number;
}

export interface ClosingCosts {
  buyClosingPct: number;
  sellClosingPct: number;
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
  arv: number;
  grossProfit: number;
  netProfit: number;
  roi: number;
  cashOnCash: number;
  maxAllowableOffer: number;
  dealScore: number;
  isProfitable: boolean;
  recommendedMaxPrice: number;
  targetROI: number;
  dealVerdict: 'excellent' | 'good' | 'marginal' | 'not_recommended';
  verdictReasons: string[];
  // New: financing breakdown for display
  primaryLenderCosts: number;
  gapFunderCosts: number;
}
