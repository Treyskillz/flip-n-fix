import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/lib/calculations';
import type { ProfitAnalysis } from '@/lib/types';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

interface Props {
  profit: ProfitAnalysis;
  rehabCost: number;
  rehabDays: number;
}

export function ProfitSummary({ profit, rehabCost, rehabDays }: Props) {
  const scoreColor = profit.dealScore >= 70
    ? 'text-[oklch(0.55_0.17_155)]'
    : profit.dealScore >= 40
    ? 'text-[oklch(0.6_0.15_80)]'
    : 'text-destructive';

  const scoreBg = profit.dealScore >= 70
    ? 'bg-[oklch(0.92_0.06_155)]'
    : profit.dealScore >= 40
    ? 'bg-[oklch(0.92_0.06_80)]'
    : 'bg-[oklch(0.92_0.06_25)]';

  return (
    <Card className={`border-2 ${profit.isProfitable ? 'border-[oklch(0.55_0.17_155)]' : 'border-destructive'} shadow-lg`}>
      <CardContent className="p-4 space-y-4">
        {/* Deal Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className={`w-5 h-5 ${scoreColor}`} />
            <span className="text-sm font-semibold">Deal Score</span>
          </div>
          <div className={`px-3 py-1 rounded-full ${scoreBg} ${scoreColor} font-bold text-lg tabular-nums`}>
            {profit.dealScore}/100
          </div>
        </div>

        {/* Net Profit */}
        <div className={`p-3 rounded-lg ${profit.isProfitable ? 'bg-[oklch(0.92_0.06_155)]' : 'bg-[oklch(0.92_0.06_25)]'}`}>
          <div className="flex items-center gap-2 mb-1">
            {profit.isProfitable ? <TrendingUp className="w-4 h-4 text-[oklch(0.55_0.17_155)]" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Net Profit</span>
          </div>
          <p className={`text-2xl font-bold tabular-nums ${profit.isProfitable ? 'text-[oklch(0.45_0.17_155)]' : 'text-destructive'}`}>
            {formatCurrency(profit.netProfit)}
          </p>
        </div>

        {/* Key Metrics Grid */}
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

        {/* 70% Rule */}
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

        {/* Cost Breakdown */}
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

        {/* Rehab Duration */}
        <div className="text-xs text-center text-muted-foreground">
          Est. rehab: {rehabDays} days | Total cost/sqft: ${rehabCost > 0 ? Math.round(rehabCost / 1) : 0}
        </div>
      </CardContent>
    </Card>
  );
}
