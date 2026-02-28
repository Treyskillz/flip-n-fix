import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Calculator, DollarSign, TrendingUp, ChevronDown, ChevronUp, Info,
  Download, Zap, CheckCircle2, XCircle, ArrowRight, HelpCircle, Printer
} from 'lucide-react';
import {
  calculateAll, getDefaultInputs, estimateRehabFromYearBuilt,
  type CalculatorInputs, type ScenarioResult, type InterestType
} from '@/lib/profitCalculator';
import { generateProfitCalcExcel, generateBlankTemplate } from '@/lib/generateExcel';

const fmt = (n: number) => n < 0
  ? `-$${Math.abs(n).toLocaleString()}`
  : `$${n.toLocaleString()}`;

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

function SectionHeader({ title, icon: Icon, children }: { title: string; icon: typeof Calculator; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="flex items-center gap-2 text-lg font-bold text-white">
        <Icon className="w-5 h-5 text-[oklch(0.65_0.18_18)]" /> {title}
      </h2>
      {children}
    </div>
  );
}

function FieldRow({ label, value, onChange, prefix = '$', type = 'number', min, max, step }: {
  label: string; value: number | string; onChange: (v: string) => void;
  prefix?: string; type?: string; min?: number; max?: number; step?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-xs text-[oklch(0.6_0_0)] w-32 shrink-0">{label}</Label>
      <div className="relative flex-1">
        {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[oklch(0.5_0_0)]">{prefix}</span>}
        <Input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white pl-6"
          min={min}
          max={max}
          step={step}
        />
      </div>
    </div>
  );
}

function ScenarioCard({ scenario, index }: { scenario: ScenarioResult; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isDeal = scenario.dealCheck.isDeal;

  return (
    <div className="border border-[oklch(0.3_0_0)] rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-[oklch(0.15_0_0)] hover:bg-[oklch(0.17_0_0)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[oklch(0.5_0_0)]">#{index + 1}</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">{scenario.name}</p>
            <p className="text-xs text-[oklch(0.5_0_0)]">{scenario.description.substring(0, 80)}...</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`text-sm font-bold ${scenario.projectedProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {fmt(scenario.projectedProfit)}
            </p>
            <p className="text-[10px] text-[oklch(0.5_0_0)]">projected profit</p>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
            isDeal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isDeal ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {isDeal ? 'DEAL!' : 'NOPE'}
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-[oklch(0.5_0_0)]" /> : <ChevronDown className="w-4 h-4 text-[oklch(0.5_0_0)]" />}
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-4 bg-[oklch(0.12_0_0)]">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-2 rounded bg-[oklch(0.18_0_0)]">
              <p className="text-[10px] text-[oklch(0.5_0_0)]">Overall Cost</p>
              <p className="text-sm font-bold text-white">{fmt(scenario.overallCost)}</p>
            </div>
            <div className="p-2 rounded bg-[oklch(0.18_0_0)]">
              <p className="text-[10px] text-[oklch(0.5_0_0)]">Out of Pocket</p>
              <p className="text-sm font-bold text-amber-400">{fmt(scenario.outOfPocket)}</p>
            </div>
            <div className="p-2 rounded bg-[oklch(0.18_0_0)]">
              <p className="text-[10px] text-[oklch(0.5_0_0)]">Min Profit Required</p>
              <p className="text-sm font-bold text-white">{fmt(scenario.dealCheck.minProfitRequired)}</p>
            </div>
            <div className="p-2 rounded bg-[oklch(0.18_0_0)]">
              <p className="text-[10px] text-[oklch(0.5_0_0)]">Projected Profit</p>
              <p className={`text-sm font-bold ${scenario.projectedProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {fmt(scenario.projectedProfit)}
              </p>
            </div>
          </div>

          {/* HML Details */}
          {scenario.hml && (
            <div>
              <p className="text-xs font-semibold text-[oklch(0.65_0.18_18)] mb-2">Hard Money Loan</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div><span className="text-[oklch(0.5_0_0)]">Loan Amount:</span> <span className="text-white font-medium">{fmt(scenario.hml.loanAmount)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Points:</span> <span className="text-white font-medium">{fmt(scenario.hml.points)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Interest:</span> <span className="text-white font-medium">{fmt(scenario.hml.interest)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Admin Fee:</span> <span className="text-white font-medium">{fmt(scenario.hml.adminFee)}</span></div>
              </div>
            </div>
          )}

          {/* Gap Funder Debt Details */}
          {scenario.gapDebt && (
            <div>
              <p className="text-xs font-semibold text-[oklch(0.65_0.18_18)] mb-2">Gap Funder (Debt)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div><span className="text-[oklch(0.5_0_0)]">Gap Diff:</span> <span className="text-white font-medium">{fmt(scenario.gapDebt.gapDiff)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Gap Loan:</span> <span className="text-white font-medium">{fmt(scenario.gapDebt.gapLoan)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Gap Points:</span> <span className="text-white font-medium">{fmt(scenario.gapDebt.gapPoints)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Gap Interest:</span> <span className="text-white font-medium">{fmt(scenario.gapDebt.gapInterest)}</span></div>
              </div>
            </div>
          )}

          {/* Gap Funder Equity Details */}
          {scenario.gapEquity && (
            <div>
              <p className="text-xs font-semibold text-[oklch(0.65_0.18_18)] mb-2">Gap Funder (Equity Split)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div><span className="text-[oklch(0.5_0_0)]">Gap Equity:</span> <span className="text-white font-medium">{pct(scenario.gapEquity.gapPercent)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Our Equity:</span> <span className="text-white font-medium">{pct(scenario.gapEquity.ourPercent)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Gap ROI:</span> <span className="text-white font-medium">{pct(scenario.gapEquity.gapROI)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Gap AROI:</span> <span className="text-white font-medium">{pct(scenario.gapEquity.gapAROI)}</span></div>
              </div>
            </div>
          )}

          {/* PL Debt Details */}
          {scenario.plDebt && (
            <div>
              <p className="text-xs font-semibold text-[oklch(0.65_0.18_18)] mb-2">Private Lender (Debt)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div><span className="text-[oklch(0.5_0_0)]">PL Loan:</span> <span className="text-white font-medium">{fmt(scenario.plDebt.plLoan)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">PL Points:</span> <span className="text-white font-medium">{fmt(scenario.plDebt.plPoints)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">PL Interest:</span> <span className="text-white font-medium">{fmt(scenario.plDebt.plInterest)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Out of Pocket:</span> <span className="text-white font-medium">{fmt(scenario.plDebt.outOfPocket)}</span></div>
              </div>
            </div>
          )}

          {/* PL Equity Details */}
          {scenario.plEquity && (
            <div>
              <p className="text-xs font-semibold text-[oklch(0.65_0.18_18)] mb-2">Private Lender (Equity Split)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div><span className="text-[oklch(0.5_0_0)]">PL Loan:</span> <span className="text-white font-medium">{fmt(scenario.plEquity.plLoan)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">PL Equity:</span> <span className="text-white font-medium">{pct(scenario.plEquity.plPercent)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">PL ROI:</span> <span className="text-white font-medium">{pct(scenario.plEquity.plROI)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">PL AROI:</span> <span className="text-white font-medium">{pct(scenario.plEquity.plAROI)}</span></div>
              </div>
            </div>
          )}

          {/* Resale Sensitivity Table */}
          <div>
            <p className="text-xs font-semibold text-[oklch(0.65_0.18_18)] mb-2">Resale Sensitivity (ARV -$20K to +$20K)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[oklch(0.3_0_0)]">
                    <th className="text-left py-1.5 px-2 text-[oklch(0.5_0_0)]">Resale Price</th>
                    <th className="text-right py-1.5 px-2 text-[oklch(0.5_0_0)]">Net After Costs</th>
                    <th className="text-right py-1.5 px-2 text-[oklch(0.5_0_0)]">Total Profit</th>
                    {scenario.resaleTable[0]?.gapShare !== undefined && (
                      <>
                        <th className="text-right py-1.5 px-2 text-[oklch(0.5_0_0)]">Gap Share</th>
                        <th className="text-right py-1.5 px-2 text-[oklch(0.5_0_0)]">Our Share</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {scenario.resaleTable.map((row, i) => {
                    const isARV = row.resalePrice === scenario.resaleTable[4]?.resalePrice; // Middle row = ARV
                    return (
                      <tr key={i} className={`border-b border-[oklch(0.25_0_0)] ${isARV ? 'bg-[oklch(0.48_0.20_18)]/10' : ''}`}>
                        <td className="py-1.5 px-2 text-white">{fmt(row.resalePrice)} {isARV && <span className="text-[oklch(0.65_0.18_18)] text-[10px]">ARV</span>}</td>
                        <td className="py-1.5 px-2 text-right text-white">{fmt(row.netAfterCosts)}</td>
                        <td className={`py-1.5 px-2 text-right font-medium ${row.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {fmt(row.totalProfit)}
                        </td>
                        {row.gapShare !== undefined && (
                          <>
                            <td className="py-1.5 px-2 text-right text-amber-400">{fmt(row.gapShare!)}</td>
                            <td className={`py-1.5 px-2 text-right font-medium ${row.ourShare! >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {fmt(row.ourShare!)}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfitCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(getDefaultInputs);
  const [showGuide, setShowGuide] = useState(false);

  const updateProp = (field: string, value: number | string | boolean) => {
    setInputs(prev => ({
      ...prev,
      property: { ...prev.property, [field]: value },
    }));
  };

  const updateHMLARV = (field: string, value: number) => {
    setInputs(prev => ({ ...prev, hmlARV: { ...prev.hmlARV, [field]: value } }));
  };
  const updateHMLPP = (field: string, value: number) => {
    setInputs(prev => ({ ...prev, hmlPP: { ...prev.hmlPP, [field]: value } }));
  };
  const updateGapDebt = (field: string, value: number | string) => {
    setInputs(prev => ({ ...prev, gapDebt: { ...prev.gapDebt, [field]: value } }));
  };
  const updateGapEquity = (field: string, value: number) => {
    setInputs(prev => ({ ...prev, gapEquity: { ...prev.gapEquity, [field]: value } }));
  };
  const updatePLDebt = (field: string, value: number | string) => {
    setInputs(prev => ({ ...prev, plDebt: { ...prev.plDebt, [field]: value } }));
  };
  const updatePLEquity = (field: string, value: number) => {
    setInputs(prev => ({ ...prev, plEquity: { ...prev.plEquity, [field]: value } }));
  };

  // Auto-estimate rehab from year built
  const autoRehab = useMemo(() => estimateRehabFromYearBuilt(inputs.property), [
    inputs.property.yearBuilt, inputs.property.sqft, inputs.property.hasPool, inputs.property.rehabLevel
  ]);

  const results = useMemo(() => calculateAll(inputs), [inputs]);

  const handleAutoRehab = () => {
    updateProp('rehab', autoRehab.totalRepairs);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[oklch(0.12_0_0)] border-b border-[oklch(0.25_0_0)]">
        <div className="container py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.48_0.20_18)]/15 text-[oklch(0.65_0.18_18)] text-xs mb-3">
                <Calculator className="w-3.5 h-3.5" /> Profit Calculator
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Deal Profit Calculator
              </h1>
              <p className="text-sm text-[oklch(0.55_0_0)] max-w-xl">
                Analyze any deal across 6 financing scenarios. See profit projections, resale sensitivity, 
                rapid-fire offer prices, and deal/no-deal indicators — all in one place.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGuide(!showGuide)}
                className="gap-1.5 border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)] hover:text-white"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {showGuide ? 'Hide Guide' : 'How to Use'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)] hover:text-white"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateProfitCalcExcel(inputs)}
                className="gap-1.5 border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)] hover:text-white"
              >
                <Download className="w-3.5 h-3.5" /> Export Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateBlankTemplate()}
                className="gap-1.5 border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)] hover:text-white"
              >
                <Download className="w-3.5 h-3.5" /> Blank Template
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Panel */}
      {showGuide && (
        <section className="bg-[oklch(0.14_0_0)] border-b border-[oklch(0.25_0_0)]">
          <div className="container py-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-[oklch(0.65_0.18_18)] mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" /> How This Tool Works
                </h3>
                <div className="space-y-2 text-xs text-[oklch(0.6_0_0)]">
                  <p><strong className="text-white">Step 1:</strong> Enter the property details — address, asking price, your offer price, ARV, year built, and square footage.</p>
                  <p><strong className="text-white">Step 2:</strong> Set your rehab cost manually or click "Auto-Estimate" to use the year-built lookup table.</p>
                  <p><strong className="text-white">Step 3:</strong> Adjust the financing terms for each scenario — HML rates, gap funder terms, private lender terms.</p>
                  <p><strong className="text-white">Step 4:</strong> Review all 6 scenarios side-by-side. Each shows projected profit, deal/no-deal indicator, and a resale sensitivity table.</p>
                  <p><strong className="text-white">Step 5:</strong> Use the Rapid-Fire section to generate offer prices at different ROI targets (18% down to 13%).</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[oklch(0.65_0.18_18)] mb-3">The 6 Financing Scenarios</h3>
                <div className="space-y-1.5 text-xs text-[oklch(0.6_0_0)]">
                  <p><strong className="text-white">1. HML (ARV) + Gap Debt:</strong> Hard money lender loans on ARV (65% LTV). Gap funder covers the rest and earns interest.</p>
                  <p><strong className="text-white">2. HML (ARV) + Gap Equity:</strong> Same HML, but gap funder gets a % of profit instead of interest.</p>
                  <p><strong className="text-white">3. HML (PP) + Gap Debt:</strong> HML loans on purchase price (90% LTV). Gap covers the rest with interest.</p>
                  <p><strong className="text-white">4. HML (PP) + Gap Equity:</strong> Same HML on PP, but gap funder gets equity split.</p>
                  <p><strong className="text-white">5. 100% PL Debt:</strong> Private lender funds everything. They earn interest/points. Zero out of pocket.</p>
                  <p><strong className="text-white">6. 100% PL Equity:</strong> Private lender funds everything and gets a profit split. Zero out of pocket.</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded bg-[oklch(0.48_0.20_18)]/10 border border-[oklch(0.48_0.20_18)]/20">
              <p className="text-xs text-[oklch(0.65_0.18_18)]">
                <strong>70% Rule:</strong> Maximum offer = (ARV × 70%) − Rehab Cost. Your current 70% rule max offer is <strong>{fmt(results.seventyPercentRule)}</strong>.
                A deal is considered viable when projected profit exceeds the greater of 10% of ARV or $20,000.
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="container py-8 space-y-8">
        {/* Property Inputs */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-lg bg-[oklch(0.15_0_0)] border border-[oklch(0.25_0_0)]">
            <SectionHeader title="Property Details" icon={DollarSign} />
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-[oklch(0.6_0_0)] w-32 shrink-0">Address</Label>
                <Input
                  value={inputs.property.address}
                  onChange={e => updateProp('address', e.target.value)}
                  placeholder="123 Main St, City, ST"
                  className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white"
                />
              </div>
              <FieldRow label="Asking Price" value={inputs.property.askingPrice} onChange={v => updateProp('askingPrice', Number(v))} />
              <FieldRow label="Purchase Price" value={inputs.property.purchasePrice} onChange={v => updateProp('purchasePrice', Number(v))} />
              <FieldRow label="ARV" value={inputs.property.arv} onChange={v => updateProp('arv', Number(v))} />
              <FieldRow label="Year Built" value={inputs.property.yearBuilt} onChange={v => updateProp('yearBuilt', Number(v))} prefix="" min={1900} max={2026} />
              <FieldRow label="Sq Ft" value={inputs.property.sqft} onChange={v => updateProp('sqft', Number(v))} prefix="" />
              <FieldRow label="Rehab Cost" value={inputs.property.rehab} onChange={v => updateProp('rehab', Number(v))} />
              <FieldRow label="Monthly Holding" value={inputs.property.holdingCosts} onChange={v => updateProp('holdingCosts', Number(v))} />
              <FieldRow label="Months to Hold" value={inputs.property.monthsToHold} onChange={v => updateProp('monthsToHold', Number(v))} prefix="" min={1} max={24} />
              <div className="flex items-center gap-2">
                <Label className="text-xs text-[oklch(0.6_0_0)] w-32 shrink-0">Has Pool</Label>
                <Switch checked={inputs.property.hasPool} onCheckedChange={v => updateProp('hasPool', v)} />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-[oklch(0.6_0_0)] w-32 shrink-0">Rehab Level</Label>
                <Select value={String(inputs.property.rehabLevel)} onValueChange={v => updateProp('rehabLevel', Number(v))}>
                  <SelectTrigger className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1 — Cosmetic</SelectItem>
                    <SelectItem value="2">Level 2 — Moderate</SelectItem>
                    <SelectItem value="3">Level 3 — Full Gut</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Auto Rehab Estimate */}
              <div className="mt-3 p-3 rounded bg-[oklch(0.18_0_0)] border border-[oklch(0.25_0_0)]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-[oklch(0.65_0.18_18)]">Year-Built Auto Estimate</p>
                  <Button size="sm" variant="outline" onClick={handleAutoRehab} className="h-6 text-[10px] gap-1 border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)]">
                    <Zap className="w-3 h-3" /> Apply Estimate
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div><span className="text-[oklch(0.5_0_0)]">Base:</span> <span className="text-white">{fmt(autoRehab.baseRehab)}</span></div>
                  <div><span className="text-[oklch(0.5_0_0)]">Sqft Adj:</span> <span className="text-white">{fmt(autoRehab.sqftAdjustment)}</span></div>
                  <div><span className="text-[oklch(0.5_0_0)]">Pool:</span> <span className="text-white">{fmt(autoRehab.poolCost)}</span></div>
                  <div><span className="text-[oklch(0.5_0_0)]">Level Adj:</span> <span className="text-white">{fmt(autoRehab.levelAdjustment)}</span></div>
                  <div className="col-span-2"><span className="text-[oklch(0.5_0_0)]">Total Estimate:</span> <span className="text-white font-bold">{fmt(autoRehab.totalRepairs)}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Financing Terms */}
          <div className="space-y-4">
            {/* HML ARV Terms */}
            <div className="p-4 rounded-lg bg-[oklch(0.15_0_0)] border border-[oklch(0.25_0_0)]">
              <p className="text-xs font-bold text-white mb-2">HML Terms (ARV-based)</p>
              <div className="grid grid-cols-2 gap-2">
                <FieldRow label="LTV %" value={inputs.hmlARV.ltvPercent} onChange={v => updateHMLARV('ltvPercent', Number(v))} prefix="" step={0.05} />
                <FieldRow label="Points %" value={inputs.hmlARV.pointsPercent} onChange={v => updateHMLARV('pointsPercent', Number(v))} prefix="" step={0.005} />
                <FieldRow label="Rate %" value={inputs.hmlARV.interestRate} onChange={v => updateHMLARV('interestRate', Number(v))} prefix="" step={0.01} />
                <FieldRow label="Admin Fee" value={inputs.hmlARV.adminFee} onChange={v => updateHMLARV('adminFee', Number(v))} />
              </div>
            </div>

            {/* HML PP Terms */}
            <div className="p-4 rounded-lg bg-[oklch(0.15_0_0)] border border-[oklch(0.25_0_0)]">
              <p className="text-xs font-bold text-white mb-2">HML Terms (Purchase Price-based)</p>
              <div className="grid grid-cols-2 gap-2">
                <FieldRow label="LTV %" value={inputs.hmlPP.ltvPercent} onChange={v => updateHMLPP('ltvPercent', Number(v))} prefix="" step={0.05} />
                <FieldRow label="Points %" value={inputs.hmlPP.pointsPercent} onChange={v => updateHMLPP('pointsPercent', Number(v))} prefix="" step={0.005} />
                <FieldRow label="Rate %" value={inputs.hmlPP.interestRate} onChange={v => updateHMLPP('interestRate', Number(v))} prefix="" step={0.01} />
                <FieldRow label="Admin Fee" value={inputs.hmlPP.adminFee} onChange={v => updateHMLPP('adminFee', Number(v))} />
              </div>
            </div>

            {/* Gap Funder Terms */}
            <div className="p-4 rounded-lg bg-[oklch(0.15_0_0)] border border-[oklch(0.25_0_0)]">
              <p className="text-xs font-bold text-white mb-2">Gap Funder Terms</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-[oklch(0.5_0_0)] mb-1">Debt Structure</p>
                  <FieldRow label="Points %" value={inputs.gapDebt.pointsPercent} onChange={v => updateGapDebt('pointsPercent', Number(v))} prefix="" step={0.005} />
                  <div className="mt-1">
                    <FieldRow label="Rate %" value={inputs.gapDebt.interestRate} onChange={v => updateGapDebt('interestRate', Number(v))} prefix="" step={0.01} />
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Label className="text-xs text-[oklch(0.6_0_0)] w-32 shrink-0">Interest Type</Label>
                    <Select value={inputs.gapDebt.interestType} onValueChange={v => updateGapDebt('interestType', v)}>
                      <SelectTrigger className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="straight">Straight</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="deferred">Deferred</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-[oklch(0.5_0_0)] mb-1">Equity Structure</p>
                  <FieldRow label="Gap Equity %" value={inputs.gapEquity.gapEquityPercent} onChange={v => updateGapEquity('gapEquityPercent', Number(v))} prefix="" step={0.05} />
                </div>
              </div>
            </div>

            {/* Private Lender Terms */}
            <div className="p-4 rounded-lg bg-[oklch(0.15_0_0)] border border-[oklch(0.25_0_0)]">
              <p className="text-xs font-bold text-white mb-2">Private Lender Terms</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-[oklch(0.5_0_0)] mb-1">Debt Structure</p>
                  <FieldRow label="Points %" value={inputs.plDebt.pointsPercent} onChange={v => updatePLDebt('pointsPercent', Number(v))} prefix="" step={0.005} />
                  <div className="mt-1">
                    <FieldRow label="Rate %" value={inputs.plDebt.interestRate} onChange={v => updatePLDebt('interestRate', Number(v))} prefix="" step={0.01} />
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Label className="text-xs text-[oklch(0.6_0_0)] w-32 shrink-0">Interest Type</Label>
                    <Select value={inputs.plDebt.interestType} onValueChange={v => updatePLDebt('interestType', v as InterestType)}>
                      <SelectTrigger className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="deferred">Deferred</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="straight">Straight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-[oklch(0.5_0_0)] mb-1">Equity Structure</p>
                  <FieldRow label="PL Equity %" value={inputs.plEquity.plEquityPercent} onChange={v => updatePLEquity('plEquityPercent', Number(v))} prefix="" step={0.05} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="p-4 rounded-lg bg-[oklch(0.12_0_0)] border border-[oklch(0.25_0_0)]">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-[10px] text-[oklch(0.5_0_0)]">Total Project Cost</p>
              <p className="text-lg font-bold text-white">{fmt(results.tpc.tpc)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[oklch(0.5_0_0)]">70% Rule Max Offer</p>
              <p className="text-lg font-bold text-[oklch(0.65_0.18_18)]">{fmt(results.seventyPercentRule)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[oklch(0.5_0_0)]">Purchase Price</p>
              <p className="text-lg font-bold text-white">{fmt(inputs.property.purchasePrice)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[oklch(0.5_0_0)]">ARV</p>
              <p className="text-lg font-bold text-white">{fmt(inputs.property.arv)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[oklch(0.5_0_0)]">Rehab</p>
              <p className="text-lg font-bold text-white">{fmt(inputs.property.rehab)}</p>
            </div>
          </div>
        </div>

        {/* Scenarios */}
        <div>
          <SectionHeader title="Financing Scenarios" icon={TrendingUp}>
            <p className="text-xs text-[oklch(0.5_0_0)]">Click to expand details and resale sensitivity</p>
          </SectionHeader>
          <div className="space-y-2">
            {results.scenarios.map((scenario, i) => (
              <ScenarioCard key={i} scenario={scenario} index={i} />
            ))}
          </div>
        </div>

        {/* Rapid-Fire Offers */}
        <div className="p-5 rounded-lg bg-[oklch(0.15_0_0)] border border-[oklch(0.25_0_0)]">
          <SectionHeader title="Rapid-Fire Offer Prices" icon={Zap}>
            <p className="text-xs text-[oklch(0.5_0_0)]">Based on ROI targets from 18% to 13%</p>
          </SectionHeader>
          <p className="text-xs text-[oklch(0.55_0_0)] mb-4">
            Submit multiple offers at different price points. Start with the lowest offer and work up. 
            The goal is to find the sweet spot where the seller accepts and you still hit your target ROI.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[oklch(0.3_0_0)]">
                  <th className="text-left py-2 px-3 text-[oklch(0.5_0_0)]">ROI Target</th>
                  <th className="text-right py-2 px-3 text-[oklch(0.5_0_0)]">Offer Price</th>
                  <th className="text-right py-2 px-3 text-[oklch(0.5_0_0)]">% of Asking</th>
                  <th className="text-right py-2 px-3 text-[oklch(0.5_0_0)]">Projected Profit</th>
                  <th className="text-center py-2 px-3 text-[oklch(0.5_0_0)]">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.rapidFire.map((row, i) => (
                  <tr key={i} className="border-b border-[oklch(0.25_0_0)] hover:bg-[oklch(0.18_0_0)]">
                    <td className="py-2 px-3 text-white font-medium">{(row.roiTarget * 100).toFixed(0)}%</td>
                    <td className="py-2 px-3 text-right text-white font-bold">{fmt(row.offerPrice)}</td>
                    <td className="py-2 px-3 text-right text-[oklch(0.6_0_0)]">
                      {inputs.property.askingPrice > 0 ? `${(row.percentOfAsking * 100).toFixed(1)}%` : '—'}
                    </td>
                    <td className={`py-2 px-3 text-right font-medium ${row.projectedProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {fmt(row.projectedProfit)}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[10px] text-[oklch(0.65_0.18_18)]"
                        onClick={() => updateProp('purchasePrice', row.offerPrice)}
                      >
                        Use <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
