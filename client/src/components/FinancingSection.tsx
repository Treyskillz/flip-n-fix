import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CurrencyInput } from './CurrencyInput';
import { formatCurrency } from '@/lib/calculations';
import type { FinancingDetails, HoldingCosts, ClosingCosts, LenderType } from '@/lib/types';
import { Landmark, Clock, FileText, HandCoins, AlertTriangle, Info } from 'lucide-react';

interface Props {
  useHardMoney: boolean;
  setUseHardMoney: (v: boolean) => void;
  lenderType: LenderType;
  switchLenderType: (type: LenderType) => void;
  finParams: { loanToValue: number; interestRate: number; points: number; holdingMonths: number };
  setFinParams: (p: { loanToValue: number; interestRate: number; points: number; holdingMonths: number }) => void;
  financing: FinancingDetails;
  // Gap Funder
  useGapFunding: boolean;
  setUseGapFunding: (v: boolean) => void;
  gapParams: { coveragePercent: number; interestRate: number; points: number };
  setGapParams: (p: { coveragePercent: number; interestRate: number; points: number }) => void;
  // Closing
  closingParams: { buyClosingPct: number; sellClosingPct: number };
  setClosingParams: (p: { buyClosingPct: number; sellClosingPct: number }) => void;
  closing: ClosingCosts;
  // Holding
  holdingParams: { monthlyPropertyTax: number; monthlyInsurance: number; monthlyUtilities: number; monthlyOther: number };
  setHoldingParams: (p: { monthlyPropertyTax: number; monthlyInsurance: number; monthlyUtilities: number; monthlyOther: number }) => void;
  holding: HoldingCosts;
}

export function FinancingSection({
  useHardMoney, setUseHardMoney,
  lenderType, switchLenderType,
  finParams, setFinParams, financing,
  useGapFunding, setUseGapFunding,
  gapParams, setGapParams,
  closingParams, setClosingParams, closing,
  holdingParams, setHoldingParams, holding,
}: Props) {
  return (
    <div className="space-y-4">
      {/* ─── Primary Lender Card ──────────────────────────────── */}
      <Card className="border-l-4 border-l-[oklch(0.55_0.20_25)]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Landmark className="w-5 h-5 text-[oklch(0.55_0.20_25)]" />
            Primary Lender
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toggle: Financing vs All Cash */}
          <div className="flex items-center gap-3">
            <Switch checked={useHardMoney} onCheckedChange={setUseHardMoney} />
            <Label className="text-sm font-medium">Use Financing</Label>
            {!useHardMoney && <span className="text-xs text-muted-foreground">(All cash purchase — no financing costs)</span>}
          </div>

          {useHardMoney && (
            <>
              {/* Lender Type Selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => switchLenderType('hard_money')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    lenderType === 'hard_money'
                      ? 'bg-[oklch(0.55_0.20_25)] text-white border-[oklch(0.55_0.20_25)]'
                      : 'bg-secondary/40 text-muted-foreground border-border hover:bg-secondary/60'
                  }`}
                >
                  Hard Money Lender
                </button>
                <button
                  onClick={() => switchLenderType('private_money')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    lenderType === 'private_money'
                      ? 'bg-[oklch(0.55_0.15_250)] text-white border-[oklch(0.55_0.15_250)]'
                      : 'bg-secondary/40 text-muted-foreground border-border hover:bg-secondary/60'
                  }`}
                >
                  Private Money Lender
                </button>
              </div>

              {/* Lender Info Tooltip */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/40 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {lenderType === 'hard_money' ? (
                  <span>
                    <strong>Hard Money:</strong> Asset-based loan from institutional lender. Typical terms: 65-80% LTV, 10-15% interest, 1-3 points, 6-12 month term. Faster approval but higher cost.
                  </span>
                ) : (
                  <span>
                    <strong>Private Money:</strong> Loan from individual investor or relationship-based lender. Typical terms: 70-90% LTV, 7-12% interest, 0-2 points, flexible terms. Often negotiable.
                  </span>
                )}
              </div>

              {/* Loan Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">LTV %</Label>
                  <Input type="number" min={0} max={100} value={finParams.loanToValue} onChange={(e) => setFinParams({ ...finParams, loanToValue: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Interest Rate %</Label>
                  <Input type="number" min={0} max={30} step={0.5} value={finParams.interestRate} onChange={(e) => setFinParams({ ...finParams, interestRate: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Points</Label>
                  <Input type="number" min={0} max={10} step={0.5} value={finParams.points} onChange={(e) => setFinParams({ ...finParams, points: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Hold (months)</Label>
                  <Input type="number" min={1} max={24} value={finParams.holdingMonths} onChange={(e) => setFinParams({ ...finParams, holdingMonths: parseInt(e.target.value) || 1 })} />
                </div>
              </div>

              {/* Primary Lender Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-secondary/60 text-xs">
                <div>
                  <p className="text-muted-foreground">Loan Amount</p>
                  <p className="font-bold tabular-nums">{formatCurrency(financing.loanAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Down Payment</p>
                  <p className="font-bold tabular-nums">{formatCurrency(financing.downPayment)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Monthly Interest</p>
                  <p className="font-bold tabular-nums">{formatCurrency(financing.monthlyInterest)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Primary Lender Cost</p>
                  <p className="font-bold tabular-nums text-destructive">{formatCurrency(financing.totalInterest + financing.totalPoints)}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ─── Gap Funder Card ──────────────────────────────────── */}
      {useHardMoney && financing.downPayment > 0 && (
        <Card className="border-l-4 border-l-[oklch(0.60_0.18_280)]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HandCoins className="w-5 h-5 text-[oklch(0.60_0.18_280)]" />
              Gap Funder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch checked={useGapFunding} onCheckedChange={setUseGapFunding} />
              <Label className="text-sm font-medium">Use Gap Funding</Label>
              {!useGapFunding && <span className="text-xs text-muted-foreground">(Cover down payment gap yourself)</span>}
            </div>

            {/* Gap Funder Info */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/40 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                <strong>Gap Funding:</strong> A second-position loan that covers part or all of your down payment gap. 
                Your primary lender covers {finParams.loanToValue}% LTV, leaving a gap of {formatCurrency(financing.downPayment)}. 
                A gap funder can cover some or all of this amount, reducing your out-of-pocket cash — but at a higher cost.
              </span>
            </div>

            {useGapFunding && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Coverage % of Gap</Label>
                    <Input type="number" min={0} max={100} value={gapParams.coveragePercent} onChange={(e) => setGapParams({ ...gapParams, coveragePercent: parseFloat(e.target.value) || 0 })} />
                    <p className="text-xs text-muted-foreground tabular-nums">= {formatCurrency(financing.gapAmount)} of {formatCurrency(financing.downPayment)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Interest Rate %</Label>
                    <Input type="number" min={0} max={30} step={0.5} value={gapParams.interestRate} onChange={(e) => setGapParams({ ...gapParams, interestRate: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Points</Label>
                    <Input type="number" min={0} max={10} step={0.5} value={gapParams.points} onChange={(e) => setGapParams({ ...gapParams, points: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>

                {/* Gap Funder Summary */}
                <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-secondary/60 text-xs">
                  <div>
                    <p className="text-muted-foreground">Gap Amount</p>
                    <p className="font-bold tabular-nums">{formatCurrency(financing.gapAmount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gap Interest ({finParams.holdingMonths} mo)</p>
                    <p className="font-bold tabular-nums">{formatCurrency(financing.gapInterest)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gap Total Cost</p>
                    <p className="font-bold tabular-nums text-destructive">{formatCurrency(financing.gapTotalCost)}</p>
                  </div>
                </div>

                {/* Warning if gap funding is expensive */}
                {financing.gapTotalCost > 0 && financing.gapTotalCost > financing.gapAmount * 0.15 && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>
                      Gap funding cost is {((financing.gapTotalCost / financing.gapAmount) * 100).toFixed(1)}% of the gap amount. 
                      Consider whether the reduced out-of-pocket justifies the additional cost.
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Capital Stack Summary */}
            {useGapFunding && financing.gapFunderEnabled && (
              <div className="p-3 rounded-lg bg-[oklch(0.60_0.18_280)]/10 border border-[oklch(0.60_0.18_280)]/20">
                <p className="text-xs font-semibold mb-2 text-[oklch(0.60_0.18_280)]">Capital Stack Summary</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Primary Lender ({lenderType === 'hard_money' ? 'Hard Money' : 'Private Money'})</span>
                    <span className="font-bold tabular-nums">{formatCurrency(financing.loanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gap Funder</span>
                    <span className="font-bold tabular-nums">{formatCurrency(financing.gapAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Cash (Out of Pocket)</span>
                    <span className="font-bold tabular-nums">{formatCurrency(financing.cashOutOfPocket)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1 mt-1">
                    <span className="text-muted-foreground font-medium">Total Financing Cost</span>
                    <span className="font-bold tabular-nums text-destructive">{formatCurrency(financing.totalFinancingCosts)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ─── Holding Costs Card ───────────────────────────────── */}
      <Card className="border-l-4 border-l-[oklch(0.65_0.1_200)]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-[oklch(0.65_0.1_200)]" />
            Monthly Holding Costs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Property Tax</Label>
              <CurrencyInput value={holdingParams.monthlyPropertyTax} onChange={(v) => setHoldingParams({ ...holdingParams, monthlyPropertyTax: v })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Insurance</Label>
              <CurrencyInput value={holdingParams.monthlyInsurance} onChange={(v) => setHoldingParams({ ...holdingParams, monthlyInsurance: v })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Utilities</Label>
              <CurrencyInput value={holdingParams.monthlyUtilities} onChange={(v) => setHoldingParams({ ...holdingParams, monthlyUtilities: v })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Other</Label>
              <CurrencyInput value={holdingParams.monthlyOther} onChange={(v) => setHoldingParams({ ...holdingParams, monthlyOther: v })} />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/60 text-sm">
            <span className="text-muted-foreground">Total Holding ({finParams.holdingMonths} months):</span>
            <span className="font-bold tabular-nums">{formatCurrency(holding.totalHoldingCosts)}</span>
          </div>
        </CardContent>
      </Card>

      {/* ─── Closing Costs Card ───────────────────────────────── */}
      <Card className="border-l-4 border-l-[oklch(0.5_0.15_30)]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-[oklch(0.5_0.15_30)]" />
            Closing Costs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Buy-Side Closing %</Label>
              <Input type="number" min={0} max={10} step={0.5} value={closingParams.buyClosingPct} onChange={(e) => setClosingParams({ ...closingParams, buyClosingPct: parseFloat(e.target.value) || 0 })} />
              <p className="text-xs text-muted-foreground tabular-nums">{formatCurrency(closing.buyClosingAmount)}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Sell-Side Closing % (incl. agent)</Label>
              <Input type="number" min={0} max={15} step={0.5} value={closingParams.sellClosingPct} onChange={(e) => setClosingParams({ ...closingParams, sellClosingPct: parseFloat(e.target.value) || 0 })} />
              <p className="text-xs text-muted-foreground tabular-nums">{formatCurrency(closing.sellClosingAmount)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/60 text-sm">
            <span className="text-muted-foreground">Total Closing Costs:</span>
            <span className="font-bold tabular-nums">{formatCurrency(closing.totalClosingCosts)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
