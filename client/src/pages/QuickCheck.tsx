import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CurrencyInput } from '@/components/CurrencyInput';
import { formatCurrency } from '@/lib/calculations';
import {
  Zap, CheckCircle2, XCircle, AlertTriangle, ArrowRight,
  TrendingUp, DollarSign, Target, Calculator, Shield
} from 'lucide-react';
import { Link } from 'wouter';

interface QuickDealInputs {
  purchasePrice: number;
  arv: number;
  rehabCost: number;
  closingCostPct: number; // combined buy+sell
  holdingMonths: number;
  monthlyHoldingCost: number;
  financingCostPct: number; // simplified: % of total project cost
}

const DEFAULTS: QuickDealInputs = {
  purchasePrice: 0,
  arv: 0,
  rehabCost: 0,
  closingCostPct: 10, // 3% buy + 7% sell is typical
  holdingMonths: 6,
  monthlyHoldingCost: 800,
  financingCostPct: 5, // simplified financing cost
};

function analyzeQuickDeal(inputs: QuickDealInputs) {
  const { purchasePrice, arv, rehabCost, closingCostPct, holdingMonths, monthlyHoldingCost, financingCostPct } = inputs;

  // Guard: need at least ARV and purchase price
  if (arv <= 0 || purchasePrice <= 0) {
    return null;
  }

  const totalProjectCost = purchasePrice + rehabCost;
  const closingCosts = Math.round(purchasePrice * (closingCostPct / 100));
  const holdingCosts = monthlyHoldingCost * holdingMonths;
  const financingCosts = Math.round(totalProjectCost * (financingCostPct / 100));

  const totalInvestment = purchasePrice + rehabCost + closingCosts + holdingCosts + financingCosts;
  const netProfit = arv - totalInvestment;
  const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  // 70% Rule
  const mao = Math.round(arv * 0.70 - rehabCost);

  // Deal Score (simplified 0-100)
  let score = 0;
  if (netProfit > 0 && arv > 0) {
    const roiScore = Math.min(roi / 30 * 50, 50);
    const maoScore = mao > 0
      ? (purchasePrice <= mao ? 30 : Math.max(0, 30 - ((purchasePrice - mao) / Math.max(mao, 1)) * 100))
      : 0;
    const profitScore = Math.min(netProfit / 100000 * 20, 20);
    score = Math.round(Math.min(roiScore + maoScore + profitScore, 100));
  }

  // Verdict
  let verdict: 'go' | 'maybe' | 'no_go';
  let verdictLabel: string;
  let verdictColor: string;
  let verdictIcon: typeof CheckCircle2;
  const reasons: string[] = [];

  if (netProfit <= 0) {
    verdict = 'no_go';
    verdictLabel = 'NO GO';
    verdictColor = 'text-red-600 bg-red-500/10 border-red-500/30';
    verdictIcon = XCircle;
    reasons.push(`This deal loses ${formatCurrency(Math.abs(netProfit))}.`);
  } else if (roi >= 20 && purchasePrice <= mao) {
    verdict = 'go';
    verdictLabel = 'GO';
    verdictColor = 'text-green-600 bg-green-500/10 border-green-500/30';
    verdictIcon = CheckCircle2;
    reasons.push(`Strong ${roi.toFixed(1)}% ROI with ${formatCurrency(netProfit)} profit.`);
    reasons.push(`Purchase price is ${formatCurrency(mao - purchasePrice)} below the 70% Rule MAO.`);
  } else if (roi >= 10 && netProfit > 0) {
    verdict = 'maybe';
    verdictLabel = 'MAYBE';
    verdictColor = 'text-yellow-600 bg-yellow-500/10 border-yellow-500/30';
    verdictIcon = AlertTriangle;
    reasons.push(`Moderate ${roi.toFixed(1)}% ROI — profitable but thin margins.`);
    if (purchasePrice > mao) {
      reasons.push(`Purchase price is ${formatCurrency(purchasePrice - mao)} over the 70% Rule MAO.`);
    }
  } else {
    verdict = 'no_go';
    verdictLabel = 'NO GO';
    verdictColor = 'text-red-600 bg-red-500/10 border-red-500/30';
    verdictIcon = XCircle;
    reasons.push(`Low ${roi.toFixed(1)}% ROI — not enough margin for risk.`);
    if (purchasePrice > mao) {
      reasons.push(`Purchase price is ${formatCurrency(purchasePrice - mao)} over the 70% Rule MAO.`);
    }
  }

  // Rehab-to-ARV ratio warning
  if (arv > 0 && rehabCost > 0) {
    const rehabToArv = (rehabCost / arv) * 100;
    if (rehabToArv > 30) {
      reasons.push(`Rehab is ${rehabToArv.toFixed(0)}% of ARV — high risk.`);
    }
  }

  return {
    totalInvestment,
    closingCosts,
    holdingCosts,
    financingCosts,
    netProfit,
    roi,
    mao,
    score,
    verdict,
    verdictLabel,
    verdictColor,
    verdictIcon,
    reasons,
    equitySpread: arv - (purchasePrice + rehabCost),
  };
}

export default function QuickCheck() {
  const [inputs, setInputs] = useState<QuickDealInputs>(DEFAULTS);

  const update = (key: keyof QuickDealInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const result = useMemo(() => analyzeQuickDeal(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)] text-white">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quick Deal Check</h1>
              <p className="text-sm text-muted-foreground">Instant go/no-go verdict — enter 3 numbers and get your answer</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* Left: Inputs */}
          <div className="space-y-6">
            {/* Core 3 Numbers */}
            <Card className="border-l-4 border-l-[oklch(0.48_0.20_18)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
                  The 3 Numbers That Matter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Purchase Price *</Label>
                    <CurrencyInput
                      value={inputs.purchasePrice}
                      onChange={(v) => update('purchasePrice', v)}
                      placeholder="What you're paying"
                      className="text-lg font-bold"
                    />
                    <p className="text-[11px] text-muted-foreground">Contract price or offer amount</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">ARV (After Repair Value) *</Label>
                    <CurrencyInput
                      value={inputs.arv}
                      onChange={(v) => update('arv', v)}
                      placeholder="What it'll sell for"
                      className="text-lg font-bold"
                    />
                    <p className="text-[11px] text-muted-foreground">From comps of renovated retail sales</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Rehab Cost *</Label>
                    <CurrencyInput
                      value={inputs.rehabCost}
                      onChange={(v) => update('rehabCost', v)}
                      placeholder="Total renovation cost"
                      className="text-lg font-bold"
                    />
                    <p className="text-[11px] text-muted-foreground">Materials + labor estimate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adjustable Assumptions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Adjustable Assumptions (optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Closing Costs %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={20}
                      step={0.5}
                      value={inputs.closingCostPct}
                      onChange={(e) => update('closingCostPct', parseFloat(e.target.value) || 0)}
                      className="h-9"
                    />
                    <p className="text-[10px] text-muted-foreground">Buy + sell combined</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Holding Months</Label>
                    <Input
                      type="number"
                      min={1}
                      max={24}
                      value={inputs.holdingMonths}
                      onChange={(e) => update('holdingMonths', parseInt(e.target.value) || 6)}
                      className="h-9"
                    />
                    <p className="text-[10px] text-muted-foreground">Rehab + sale time</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Monthly Holding $</Label>
                    <CurrencyInput
                      value={inputs.monthlyHoldingCost}
                      onChange={(v) => update('monthlyHoldingCost', v)}
                      className="h-9"
                    />
                    <p className="text-[10px] text-muted-foreground">Taxes, insurance, utils</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Financing Cost %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={20}
                      step={0.5}
                      value={inputs.financingCostPct}
                      onChange={(e) => update('financingCostPct', parseFloat(e.target.value) || 0)}
                      className="h-9"
                    />
                    <p className="text-[10px] text-muted-foreground">Points + interest</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Link to full analyzer */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Need more detail?</span>
              <Link href="/analyzer">
                <Button variant="outline" size="sm" className="gap-1.5">
                  Open Full Analyzer <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Verdict Panel */}
          <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
            {result ? (
              <>
                {/* Verdict Card */}
                <Card className={`border-2 ${result.verdictColor}`}>
                  <CardContent className="pt-6 pb-5 text-center space-y-3">
                    <result.verdictIcon className={`w-12 h-12 mx-auto ${result.verdict === 'go' ? 'text-green-600' : result.verdict === 'maybe' ? 'text-yellow-600' : 'text-red-600'}`} />
                    <div>
                      <h2 className={`text-4xl font-black tracking-tight ${result.verdict === 'go' ? 'text-green-600' : result.verdict === 'maybe' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {result.verdictLabel}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">Deal Score: {result.score}/100</p>
                    </div>
                    <div className="space-y-1.5 text-left">
                      {result.reasons.map((r, i) => (
                        <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="mt-0.5">•</span>
                          <span>{r}</span>
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Numbers Breakdown */}
                <Card>
                  <CardContent className="pt-5 space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" /> ARV (Sale Price)
                        </span>
                        <span className="font-bold tabular-nums">{formatCurrency(inputs.arv)}</span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Purchase Price</span>
                        <span className="font-semibold tabular-nums text-red-500">-{formatCurrency(inputs.purchasePrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rehab Cost</span>
                        <span className="font-semibold tabular-nums text-red-500">-{formatCurrency(inputs.rehabCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Closing Costs</span>
                        <span className="font-semibold tabular-nums text-red-500">-{formatCurrency(result.closingCosts)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Holding Costs</span>
                        <span className="font-semibold tabular-nums text-red-500">-{formatCurrency(result.holdingCosts)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Financing Costs</span>
                        <span className="font-semibold tabular-nums text-red-500">-{formatCurrency(result.financingCosts)}</span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex justify-between text-sm font-bold">
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" /> Net Profit
                        </span>
                        <span className={`tabular-nums ${result.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(result.netProfit)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">ROI</span>
                        <span className={`font-bold tabular-nums ${result.roi >= 20 ? 'text-green-600' : result.roi >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {result.roi.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 70% Rule */}
                <Card>
                  <CardContent className="pt-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
                      <span className="text-sm font-bold">70% Rule</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Max Allowable Offer = (ARV × 70%) − Repairs
                    </div>
                    <div className="text-lg font-bold tabular-nums">
                      {formatCurrency(result.mao)}
                    </div>
                    <div className={`text-xs font-medium ${inputs.purchasePrice <= result.mao ? 'text-green-600' : 'text-red-600'}`}>
                      {inputs.purchasePrice <= result.mao
                        ? `✓ Purchase price is ${formatCurrency(result.mao - inputs.purchasePrice)} below MAO`
                        : `✗ Purchase price is ${formatCurrency(inputs.purchasePrice - result.mao)} over MAO`
                      }
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-2 border-dashed border-border">
                <CardContent className="pt-6 pb-5 text-center space-y-3">
                  <Zap className="w-10 h-10 mx-auto text-muted-foreground/40" />
                  <div>
                    <h3 className="font-semibold text-muted-foreground">Enter Your Numbers</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fill in Purchase Price, ARV, and Rehab Cost to get an instant go/no-go verdict.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-secondary/40 border border-border/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[oklch(0.48_0.20_18)] shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <p>
                <strong>Quick Check Disclaimer:</strong> This is a simplified analysis using estimated percentages for closing, holding, and financing costs. 
                For a detailed breakdown with actual lender terms, room-by-room rehab estimates, and regional pricing, use the{' '}
                <Link href="/analyzer" className="text-[oklch(0.48_0.20_18)] hover:underline font-medium">Full Deal Analyzer</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
