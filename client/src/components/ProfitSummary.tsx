// ============================================================
// ProfitSummary — Floating profit card with deal verdict
// Design: Investor's Workbench (Swiss/Functional Minimalism)
// ============================================================

import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/lib/calculations';
import type { ProfitAnalysis } from '@/lib/types';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  DollarSign,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';

interface Props {
  profit: ProfitAnalysis;
  rehabCost: number;
  rehabDays: number;
  targetROI: number;
  setTargetROI: (val: number) => void;
}

const VERDICT_CONFIG = {
  excellent: {
    label: 'Excellent Deal',
    icon: ShieldCheck,
    bg: 'bg-[oklch(0.92_0.06_145)]',
    border: 'border-[oklch(0.55_0.17_145)]',
    text: 'text-[oklch(0.40_0.17_145)]',
    iconColor: 'text-[oklch(0.50_0.17_145)]',
    badge: 'bg-[oklch(0.50_0.17_145)] text-white',
  },
  good: {
    label: 'Good Deal',
    icon: ShieldCheck,
    bg: 'bg-[oklch(0.94_0.04_145)]',
    border: 'border-[oklch(0.60_0.12_145)]',
    text: 'text-[oklch(0.45_0.14_145)]',
    iconColor: 'text-[oklch(0.55_0.14_145)]',
    badge: 'bg-[oklch(0.55_0.14_145)] text-white',
  },
  marginal: {
    label: 'Marginal Deal',
    icon: ShieldAlert,
    bg: 'bg-[oklch(0.94_0.06_80)]',
    border: 'border-[oklch(0.60_0.15_80)]',
    text: 'text-[oklch(0.45_0.15_70)]',
    iconColor: 'text-[oklch(0.55_0.15_70)]',
    badge: 'bg-[oklch(0.55_0.15_70)] text-white',
  },
  not_recommended: {
    label: 'Not Recommended',
    icon: ShieldX,
    bg: 'bg-[oklch(0.94_0.06_25)]',
    border: 'border-destructive',
    text: 'text-destructive',
    iconColor: 'text-destructive',
    badge: 'bg-destructive text-white',
  },
};

export function ProfitSummary({ profit, rehabCost, rehabDays, targetROI, setTargetROI }: Props) {
  const scoreColor =
    profit.dealScore >= 70
      ? 'text-[oklch(0.55_0.17_145)]'
      : profit.dealScore >= 40
        ? 'text-[oklch(0.6_0.15_80)]'
        : 'text-destructive';

  const scoreBg =
    profit.dealScore >= 70
      ? 'bg-[oklch(0.92_0.06_145)]'
      : profit.dealScore >= 40
        ? 'bg-[oklch(0.92_0.06_80)]'
        : 'bg-[oklch(0.92_0.06_25)]';

  const vc = VERDICT_CONFIG[profit.dealVerdict];
  const VerdictIcon = vc.icon;

  // Check if ARV is missing (no comps and no override entered)
  const missingArv = profit.arv === 0;

  return (
    <Card className={`border-2 ${vc.border} shadow-lg`}>
      <CardContent className="p-4 space-y-4">
        {/* ── Missing ARV Warning ───────────────────────────── */}
        {missingArv && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Enter Deal Details</p>
              <p className="mt-0.5">Add 3–5 comparable retail sales of recently renovated properties to determine your ARV (After Repair Value). You can also enter an ARV manually using the override field in the Comps section.</p>
            </div>
          </div>
        )}

        {/* ── ARV Method Indicator ───────────────────────────── */}
        {profit.arv > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/20 text-xs">
            <DollarSign className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-muted-foreground">
              <strong className="text-primary">ARV: {formatCurrency(profit.arv)}</strong>
              {' — '}
              {profit.arv === profit.purchasePrice + rehabCost ? 'From Comps' : 'After Repair Value (from comps or override)'}
            </span>
          </div>
        )}

        {/* ── Deal Verdict Banner ────────────────────────────── */}
        <div className={`${vc.bg} rounded-lg p-4`}>
          <div className="flex items-center gap-3 mb-2">
            <VerdictIcon className={`w-7 h-7 ${vc.iconColor} shrink-0`} />
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${vc.badge}`}>
                {vc.label}
              </span>
            </div>
          </div>
          {/* Verdict reasons */}
          <div className="space-y-1.5 mt-3">
            {profit.verdictReasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                {reason.includes('loses money') || reason.includes('over the 70%') || reason.includes('high rehab') || reason.includes('reduction needed') || reason.includes('No ARV') ? (
                  <XCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                ) : reason.includes('Strong ROI') || reason.includes('below the 70%') ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.50_0.17_145)] shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <span className={`${vc.text} leading-snug`}>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Profit Target Slider ───────────────────────── */}
        <div className="p-3 rounded-lg border bg-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Your Profit Target
              </span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                max={100}
                value={targetROI}
                onChange={(e) => setTargetROI(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                className="w-14 h-7 text-center text-sm font-bold border rounded-md bg-background tabular-nums"
              />
              <span className="text-sm font-bold">%</span>
            </div>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={1}
            value={targetROI}
            onChange={(e) => setTargetROI(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>5%</span>
            <span>Conservative</span>
            <span>Aggressive</span>
            <span>50%</span>
          </div>
        </div>

        {/* ── Recommended Max Purchase Price ──────────────────── */}
        {profit.arv > 0 && (
          <div className="p-3 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5">
            <div className="flex items-center gap-2 mb-1.5">
              <DollarSign className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Max Purchase Price for {profit.targetROI}% ROI
              </span>
            </div>
            <p className="text-2xl font-bold tabular-nums text-primary">
              {formatCurrency(profit.recommendedMaxPrice)}
            </p>
            {profit.purchasePrice > 0 && profit.purchasePrice > profit.recommendedMaxPrice && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-destructive font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Your offer is {formatCurrency(profit.purchasePrice - profit.recommendedMaxPrice)} too high
                </span>
              </div>
            )}
            {profit.purchasePrice > 0 && profit.purchasePrice <= profit.recommendedMaxPrice && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-[oklch(0.50_0.17_145)] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Your offer is {formatCurrency(profit.recommendedMaxPrice - profit.purchasePrice)} below max — good entry
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Deal Score ─────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className={`w-5 h-5 ${scoreColor}`} />
            <span className="text-sm font-semibold">Deal Score</span>
          </div>
          <div className={`px-3 py-1 rounded-full ${scoreBg} ${scoreColor} font-bold text-lg tabular-nums`}>
            {profit.dealScore}/100
          </div>
        </div>

        {/* ── Net Profit ─────────────────────────────────────── */}
        <div
          className={`p-3 rounded-lg ${profit.isProfitable ? 'bg-[oklch(0.92_0.06_145)]' : 'bg-[oklch(0.92_0.06_25)]'}`}
        >
          <div className="flex items-center gap-2 mb-1">
            {profit.isProfitable ? (
              <TrendingUp className="w-4 h-4 text-[oklch(0.55_0.17_145)]" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Net Profit
            </span>
          </div>
          <p
            className={`text-2xl font-bold tabular-nums ${profit.isProfitable ? 'text-[oklch(0.45_0.17_145)]' : 'text-destructive'}`}
          >
            {formatCurrency(profit.netProfit)}
          </p>
        </div>

        {/* ── Key Metrics Grid ───────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 rounded-md bg-secondary/60">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">ROI</p>
            <p className="text-sm font-bold tabular-nums">{formatPercent(profit.roi)}</p>
          </div>
          <div className="p-2 rounded-md bg-secondary/60">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Cash-on-Cash</p>
            <p className="text-sm font-bold tabular-nums">{formatPercent(profit.cashOnCash)}</p>
          </div>
          <div className="p-2 rounded-md bg-secondary/60">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Gross Profit</p>
            <p className="text-sm font-bold tabular-nums">{formatCurrency(profit.grossProfit)}</p>
          </div>
          <div className="p-2 rounded-md bg-secondary/60">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Investment</p>
            <p className="text-sm font-bold tabular-nums">{formatCurrency(profit.totalInvestment)}</p>
          </div>
        </div>

        {/* ── 70% Rule ───────────────────────────────────────── */}
        <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
          <Target className="w-4 h-4 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold">70% Rule MAO</p>
            <p className="text-sm font-bold tabular-nums">{formatCurrency(profit.maxAllowableOffer)}</p>
          </div>
          <div className="text-right">
            {profit.purchasePrice > 0 && profit.maxAllowableOffer > 0 ? (
              profit.purchasePrice <= profit.maxAllowableOffer ? (
                <span className="text-xs font-semibold text-[oklch(0.55_0.17_145)]">Below MAO</span>
              ) : (
                <span className="text-xs font-semibold text-destructive">
                  {formatCurrency(profit.purchasePrice - profit.maxAllowableOffer)} over
                </span>
              )
            ) : (
              <span className="text-xs text-muted-foreground">Enter ARV to calculate</span>
            )}
          </div>
        </div>

        {/* ── Cost Breakdown ─────────────────────────────────── */}
        <div className="space-y-1.5 text-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Cost Breakdown</p>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Purchase Price</span>
            <span className="tabular-nums font-medium">{formatCurrency(profit.purchasePrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rehab Cost</span>
            <span className="tabular-nums font-medium">{formatCurrency(profit.rehabCost)}</span>
          </div>
          {/* Financing breakdown: primary + gap */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Financing Costs</span>
            <span className="tabular-nums font-medium">{formatCurrency(profit.financingCosts)}</span>
          </div>
          {profit.primaryLenderCosts > 0 && profit.gapFunderCosts > 0 && (
            <div className="ml-4 space-y-1 text-[11px]">
              <div className="flex justify-between text-muted-foreground">
                <span>Primary Lender</span>
                <span className="tabular-nums">{formatCurrency(profit.primaryLenderCosts)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Gap Funder</span>
                <span className="tabular-nums">{formatCurrency(profit.gapFunderCosts)}</span>
              </div>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Holding Costs</span>
            <span className="tabular-nums font-medium">{formatCurrency(profit.holdingCosts)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Buy Closing</span>
            <span className="tabular-nums font-medium">{formatCurrency(profit.buyClosingCosts)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sell Closing</span>
            <span className="tabular-nums font-medium">{formatCurrency(profit.sellClosingCosts)}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-border">
            <span className="font-semibold">Total Investment</span>
            <span className="tabular-nums font-semibold">{formatCurrency(profit.totalInvestment)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>ARV (Sale Price)</span>
            <span className="tabular-nums">{formatCurrency(profit.arv)}</span>
          </div>
        </div>

        {/* ── Rehab Duration ─────────────────────────────────── */}
        <div className="text-xs text-center text-muted-foreground">
          Est. rehab: {rehabDays} days | Rehab cost: {formatCurrency(rehabCost)}
        </div>

        {/* ── ARV Methodology Note ─────────────────── */}
        {profit.arv > 0 && (
          <div className="p-3 rounded-lg border bg-card space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                How ARV Is Calculated
              </span>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              <strong>ARV (After Repair Value)</strong> is what the property will sell for after all renovations are complete. It is determined by finding 3–5 comparable <strong>standard retail sales</strong> of recently renovated properties, calculating the average <strong>price per square foot ($/sqft)</strong>, and multiplying by your subject property's sqft. The <strong>70% Rule</strong>: (ARV × 0.70) − Estimated Repairs = Maximum Purchase Price. Always use actual sold prices, never listing prices.
            </div>
          </div>
        )}

        {/* ── Disclaimer ────────────────────────────────────── */}
        <div className="text-[10px] text-muted-foreground/70 leading-relaxed border-t border-border pt-3">
          <strong>Disclaimer:</strong> All calculations are estimates for educational purposes only. 
          Actual costs, ARV, and returns may vary based on market conditions, contractor pricing, 
          property condition, and other factors. Always verify numbers with licensed professionals 
          (appraiser, contractor, lender, CPA) before making investment decisions. This tool does 
          not constitute financial, legal, or investment advice.
        </div>
      </CardContent>
    </Card>
  );
}
