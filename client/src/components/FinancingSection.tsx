import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CurrencyInput } from './CurrencyInput';
import { formatCurrency } from '@/lib/calculations';
import type { FinancingDetails, HoldingCosts, ClosingCosts } from '@/lib/types';
import { Landmark, Clock, FileText } from 'lucide-react';

interface Props {
  useHardMoney: boolean;
  setUseHardMoney: (v: boolean) => void;
  finParams: { loanToValue: number; interestRate: number; points: number; holdingMonths: number };
  setFinParams: (p: { loanToValue: number; interestRate: number; points: number; holdingMonths: number }) => void;
  financing: FinancingDetails;
  closingParams: { buyClosingPct: number; sellClosingPct: number };
  setClosingParams: (p: { buyClosingPct: number; sellClosingPct: number }) => void;
  closing: ClosingCosts;
  holdingParams: { monthlyPropertyTax: number; monthlyInsurance: number; monthlyUtilities: number; monthlyOther: number };
  setHoldingParams: (p: { monthlyPropertyTax: number; monthlyInsurance: number; monthlyUtilities: number; monthlyOther: number }) => void;
  holding: HoldingCosts;
}

export function FinancingSection({
  useHardMoney, setUseHardMoney,
  finParams, setFinParams, financing,
  closingParams, setClosingParams, closing,
  holdingParams, setHoldingParams, holding,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Financing Card */}
      <Card className="border-l-4 border-l-[oklch(0.55_0.17_155)]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Landmark className="w-5 h-5 text-[oklch(0.55_0.17_155)]" />
            Financing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch checked={useHardMoney} onCheckedChange={setUseHardMoney} />
            <Label className="text-sm font-medium">Hard Money Loan</Label>
            {!useHardMoney && <span className="text-xs text-muted-foreground">(All cash purchase)</span>}
          </div>

          {useHardMoney && (
            <>
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
                  <p className="text-muted-foreground">Total Fin. Cost</p>
                  <p className="font-bold tabular-nums text-destructive">{formatCurrency(financing.totalInterest + financing.totalPoints)}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Holding Costs Card */}
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

      {/* Closing Costs Card */}
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
