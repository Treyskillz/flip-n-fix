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
}

const VERDICT_CONFIG = {
  excellent: {
    label: 'Excellent Deal',
    icon: ShieldCheck,
    bg: 'bg-[oklch(0.92_0.06_155)]',
    border: 'border-[oklch(0.55_0.17_155)]',
    text: 'text-[oklch(0.40_0.17_155)]',
    iconColor: 'text-[oklch(0.50_0.17_155)]',
    badge: 'bg-[oklch(0.50_0.17_155)] text-white',
  },
  good: {
    label: 'Good Deal',
    icon: ShieldCheck,
    bg: 'bg-[oklch(0.94_0.04_155)]',
    border: 'border-[oklch(0.60_0.12_155)]',
    text: 'text-[oklch(0.45_0.14_155)]',
    iconColor: 'text-[oklch(0.55_0.14_155)]',
    badge: 'bg-[oklch(0.55_0.14_155)] text-white',
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

export function ProfitSummary({ profit, rehabCost, rehabDays }: Props) {
  const scoreColor =
    profit.dealScore >= 70
      ? 'text-[oklch(0.55_0.17_155)]'
      : profit.dealScore >= 40
        ? 'text-[oklch(0.6_0.15_80)]'
        : 'text-destructive';

  const scoreBg =
    profit.dealScore >= 70
      ? 'bg-[oklch(0.92_0.06_155)]'
      : profit.dealScore >= 40
        ? 'bg-[oklch(0.92_0.06_80)]'
        : 'bg-[oklch(0.92_0.06_25)]';

  const vc = VERDICT_CONFIG[profit.dealVerdict];
  const VerdictIcon = vc.icon;

  return (
    <Card className={`border-2 ${vc.border} shadow-lg`}>
      <CardContent className="p-4 space-y-4">
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
                {reason.includes('loses money') || reason.includes('over the 70%') || reason.includes('high rehab') || reason.includes('reduction needed') ? (
                  <XCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                ) : reason.includes('Strong ROI') || reason.includes('below the 70%') ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.50_0.17_155)] shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <span className={`${vc.text} leading-snug`}>{reason}</span>
              </div>
            ))}
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
              <div className="flex items-center gap-1.5 mt-2 text-xs text-[oklch(0.50_0.17_155)] font-semibold">
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
          className={`p-3 rounded-lg ${profit.isProfitable ? 'bg-[oklch(0.92_0.06_155)]' : 'bg-[oklch(0.92_0.06_25)]'}`}
        >
          <div className="flex items-center gap-2 mb-1">
            {profit.isProfitable ? (
              <TrendingUp className="w-4 h-4 text-[oklch(0.55_0.17_155)]" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Net Profit
            </span>
          </div>
          <p
            className={`text-2xl font-bold tabular-nums ${profit.isProfitable ? 'text-[oklch(0.45_0.17_155)]' : 'text-destructive'}`}
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
            {profit.purchasePrice <= profit.maxAllowableOffer ? (
              <span className="text-xs font-semibold text-[oklch(0.55_0.17_155)]">Below MAO</span>
            ) : (
              <span className="text-xs font-semibold text-destructive">
                {formatCurrency(profit.purchasePrice - profit.maxAllowableOffer)} over
              </span>
            )}
          </div>
        </div>

        {/* ── Cost Breakdown ─────────────────────────────────── */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Purchase Price</span>
            <span className="tabular-nums font-medium">{formatCurrency(profit.purchasePrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rehab Cost</span>
            <span className="tabular-nums font-medium">{formatCurrency(profit.rehabCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Financing Costs</span>
            <span className="tabular-nums font-medium">{formatCurrency(profit.financingCosts)}</span>
          </div>
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
          <div className="flex justify-between pt-1.5 border-t border-border font-semibold">
            <span>ARV (Sale Price)</span>
            <span className="tabular-nums">{formatCurrency(profit.arv)}</span>
          </div>
        </div>

        {/* ── Rehab Duration ─────────────────────────────────── */}
        <div className="text-xs text-center text-muted-foreground">
          Est. rehab: {rehabDays} days | Rehab cost: {formatCurrency(rehabCost)}
        </div>
      </CardContent>
    </Card>
  );
}
