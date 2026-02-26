import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from './CurrencyInput';
import { Badge } from '@/components/ui/badge';
import type { CompProperty, CompQualityScore } from '@/lib/types';
import { formatCurrency, scoreComp } from '@/lib/calculations';
import { BarChart3, Plus, Trash2, TrendingUp, AlertTriangle, Info, ShieldCheck, ShieldAlert, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';

interface Props {
  comps: CompProperty[];
  addComp: (comp: Omit<CompProperty, 'id' | 'pricePerSqft'>) => void;
  removeComp: (id: string) => void;
  costApproachArv: number;
  compBasedArv: number;
  arvOverride: number | null;
  setArvOverride: (v: number | null) => void;
  effectiveArv: number;
  subjectSqft: number;
  subjectBeds: number;
  subjectBaths: number;
  purchasePrice: number;
  rehabCost: number;
}

const emptyComp = {
  address: '', salePrice: 0, saleDate: '', daysOnMarket: 0,
  sqft: 0, beds: 0, baths: 0, lotSizeSqft: 0, yearBuilt: 0,
  neighborhood: '', notableFeatures: '', source: 'manual' as const,
  condition: '' as '' | 'renovated' | 'updated' | 'average' | 'distressed',
};

const GRADE_COLORS: Record<string, string> = {
  A: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30',
  B: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  C: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  D: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
  F: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
};

function CompQualityBadge({ score }: { score: CompQualityScore }) {
  return (
    <Badge variant="outline" className={`text-xs font-bold ${GRADE_COLORS[score.grade] || ''}`}>
      {score.grade} ({score.total})
    </Badge>
  );
}

export function CompManager({
  comps, addComp, removeComp, costApproachArv, compBasedArv,
  arvOverride, setArvOverride, effectiveArv,
  subjectSqft, subjectBeds, subjectBaths, purchasePrice, rehabCost,
}: Props) {
  const [newComp, setNewComp] = useState(emptyComp);
  const [showForm, setShowForm] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);

  const handleAdd = useCallback(() => {
    if (newComp.address && newComp.salePrice > 0) {
      addComp(newComp);
      setNewComp(emptyComp);
      setShowForm(false);
    }
  }, [newComp, addComp]);

  const avgPpsf = comps.length > 0
    ? Math.round(comps.filter(c => c.pricePerSqft > 0).reduce((s, c) => s + c.pricePerSqft, 0) / Math.max(comps.filter(c => c.pricePerSqft > 0).length, 1))
    : 0;

  // Score each comp
  const subjectForScoring = useMemo(() => ({
    address: '', city: '', state: '', zip: '', propertyType: '', garage: '',
    purchasePrice: 0, lotSizeSqft: 0, yearBuilt: 0,
    sqft: subjectSqft, beds: subjectBeds, baths: subjectBaths,
  }), [subjectSqft, subjectBeds, subjectBaths]);

  const compScores = useMemo(() => {
    return comps.map(comp => scoreComp(comp, subjectForScoring));
  }, [comps, subjectForScoring]);

  const overallScore = useMemo(() => {
    if (compScores.length === 0) return null;
    return Math.round(compScores.reduce((s, c) => s + c.total, 0) / compScores.length);
  }, [compScores]);

  // Comp vs Cost Approach comparison
  const arvDifference = compBasedArv > 0 ? compBasedArv - costApproachArv : 0;
  const arvDiffPct = costApproachArv > 0 && compBasedArv > 0 ? ((arvDifference / costApproachArv) * 100) : 0;

  // Collect all warnings
  const allWarnings = useMemo(() => {
    const warnings: string[] = [];
    // Check for non-retail comps
    const distressedComps = comps.filter(c => c.condition === 'distressed');
    if (distressedComps.length > 0) {
      warnings.push(`⛔ ${distressedComps.length} comp${distressedComps.length > 1 ? 's are' : ' is'} marked "Distressed." REMOVE these — comps must be standard retail sales only. Distressed sales (foreclosures, short sales, REO, auction) do NOT reflect market value and will give you a false ARV.`);
    }
    const avgConditionComps = comps.filter(c => c.condition === 'average');
    if (avgConditionComps.length > 0) {
      warnings.push(`⚠️ ${avgConditionComps.length} comp${avgConditionComps.length > 1 ? 's are' : ' is'} "Average Condition." For best results, use renovated or updated comps that match your planned rehab level. Average-condition comps may understate what the market will pay for a renovated property.`);
    }
    if (comps.length > 0 && subjectSqft === 0) {
      warnings.push('Subject property square footage is 0 — comp-based validation will be inaccurate. Enter the subject sqft above.');
    }
    // Check for wide price spread
    if (comps.length >= 2) {
      const prices = comps.map(c => c.pricePerSqft).filter(p => p > 0);
      if (prices.length >= 2) {
        const max = Math.max(...prices);
        const min = Math.min(...prices);
        if (max > min * 1.5) {
          warnings.push(`Wide $/sqft spread ($${min} – $${max}). This may indicate comps are not truly comparable. Consider removing outliers.`);
        }
      }
    }
    return warnings;
  }, [comps, subjectSqft]);

  return (
    <Card className="border-l-4 border-l-[oklch(0.5_0.12_250)]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-[oklch(0.5_0.12_250)]" />
            Comparable Sales (Comps)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowGuidance(!showGuidance)} className="text-xs">
              <Info className="w-3.5 h-3.5 mr-1" /> How to Find Comps
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-1" /> Add Comp
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comp Guidance Panel */}
        {showGuidance && (
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-sm space-y-3">
            <h4 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> How to Find Reliable Comps
            </h4>
            <div className="p-2.5 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold">
              ⛔ RETAIL SALES ONLY — Never use foreclosures, short sales, REO, bank-owned, or auction sales as comps. These are distressed transactions that do NOT reflect true market value.
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground mb-1">What Makes a Good Comp:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Standard retail sale</strong> (arms-length transaction)</li>
                  <li><strong>Sold within 6 months</strong> (3 months is ideal)</li>
                  <li><strong>Within 0.5 miles</strong> of subject property</li>
                  <li><strong>Similar size</strong> (within 20% of sqft)</li>
                  <li><strong>Same bed/bath count</strong> (±1 bed, ±1 bath)</li>
                  <li><strong>Renovated/updated condition</strong> (matching your rehab level)</li>
                  <li><strong>Similar property type</strong> (SFR vs. condo vs. townhouse)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Where to Find Comps:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>MLS</strong> — Most accurate (ask your agent)</li>
                  <li><strong>Zillow/Redfin</strong> — Filter by "Recently Sold"</li>
                  <li><strong>Realtor.com</strong> — Sold listings with details</li>
                  <li><strong>PropStream</strong> — Investor-focused comp tool</li>
                  <li><strong>County records</strong> — Official sale prices</li>
                </ul>
                <p className="mt-2 font-semibold text-foreground">Tip: Use 3-6 retail comps to validate your Cost Approach ARV. Remove outliers that skew the average.</p>
              </div>
            </div>
          </div>
        )}

        {/* Warnings */}
        {allWarnings.length > 0 && (
          <div className="space-y-2">
            {allWarnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── ARV Summary — Cost Approach is Primary ──────────── */}
        <div className="p-3 rounded-lg bg-secondary/60 space-y-3">
          {/* Cost Approach ARV (Primary) */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Cost Approach ARV (Primary)
              </span>
              <Badge variant="default" className="text-[10px] h-5">DEFAULT</Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold tabular-nums">{formatCurrency(costApproachArv)}</span>
              <span className="text-xs text-muted-foreground">
                = Purchase ({formatCurrency(purchasePrice)}) + Rehab ({formatCurrency(rehabCost)})
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              The Cost Approach determines ARV based on what you have into the deal. The property must be worth at least your total investment (purchase + rehab) for the deal to make sense. This is the investor's method.
            </p>
          </div>

          {/* Comp-Based Market Validation */}
          {compBasedArv > 0 && (
            <div className="pt-2 border-t border-border/50 space-y-1.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[oklch(0.5_0.12_250)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Market Validation (Comps)
                </span>
                <Badge variant="outline" className="text-[10px] h-5">SECONDARY</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold tabular-nums">{formatCurrency(compBasedArv)}</span>
                <span className="text-xs text-muted-foreground">
                  Avg $/sqft: <span className="font-semibold">${avgPpsf}</span> × {subjectSqft.toLocaleString()} sqft
                </span>
                {overallScore !== null && (
                  <span className="text-xs text-muted-foreground">
                    Quality: <span className="font-semibold">{overallScore}/100</span>
                  </span>
                )}
              </div>
              {/* Comp vs Cost Approach comparison */}
              {costApproachArv > 0 && (
                <div className={`flex items-start gap-2 text-xs p-2 rounded-md ${
                  arvDifference >= 0
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}>
                  {arvDifference >= 0 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  )}
                  <span>
                    {arvDifference >= 0 ? (
                      <>
                        <strong>Market supports your deal:</strong> Retail comps show the market value ({formatCurrency(compBasedArv)}) is {formatCurrency(arvDifference)} ({arvDiffPct.toFixed(1)}%) ABOVE your cost basis. This means the market will pay more than what you have into the deal.
                      </>
                    ) : (
                      <>
                        <strong>Market may not support this deal:</strong> Retail comps show the market value ({formatCurrency(compBasedArv)}) is {formatCurrency(Math.abs(arvDifference))} ({Math.abs(arvDiffPct).toFixed(1)}%) BELOW your cost basis. You may be overpaying or over-rehabbing. Verify your comps are renovated properties and reconsider the deal.
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ARV Override */}
          <div className="pt-2 border-t border-border/50 space-y-1">
            <Label className="text-xs text-muted-foreground">ARV Override (optional):</Label>
            <div className="flex items-center gap-2">
              <CurrencyInput
                value={arvOverride ?? 0}
                onChange={(v) => setArvOverride(v > 0 ? v : null)}
                placeholder="Leave blank to use Cost Approach ARV"
                className="w-48 h-8 text-sm"
              />
              {arvOverride && arvOverride > 0 && (
                <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setArvOverride(null)}>
                  Clear
                </Button>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {arvOverride && arvOverride > 0
                  ? 'Using your manual ARV override'
                  : 'Enter a value to override the Cost Approach ARV'}
              </span>
            </div>
          </div>

          {/* Effective ARV display */}
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Active ARV:</span>
              <span className="text-lg font-bold tabular-nums text-primary">{formatCurrency(effectiveArv)}</span>
              <Badge variant="outline" className="text-[10px]">
                {arvOverride && arvOverride > 0 ? 'Manual Override' : 'Cost Approach'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Comp List with Quality Scores */}
        {comps.length > 0 && (
          <div className="space-y-2">
            {comps.map((comp, idx) => {
              const score = compScores[idx];
              return (
                <div key={comp.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">{comp.address}</span>
                        {score && <CompQualityBadge score={score} />}
                        {comp.condition && (
                          <Badge variant="outline" className={`text-xs ${
                            comp.condition === 'renovated' ? 'bg-green-500/10 text-green-600 border-green-500/30' :
                            comp.condition === 'updated' ? 'bg-blue-500/10 text-blue-600 border-blue-500/30' :
                            comp.condition === 'average' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' :
                            'bg-red-500/10 text-red-600 border-red-500/30'
                          }`}>
                            {comp.condition === 'renovated' ? '✓ Renovated' : comp.condition === 'updated' ? '✓ Updated' : comp.condition === 'average' ? '⚠ Average' : '⛔ Distressed'}
                          </Badge>
                        )}
                        {comp.condition === 'distressed' && (
                          <Badge variant="destructive" className="text-[10px]">NOT A RETAIL SALE — REMOVE</Badge>
                        )}
                        <Badge variant="secondary" className="text-xs shrink-0">{comp.daysOnMarket} DOM</Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground tabular-nums">{formatCurrency(comp.salePrice)}</span>
                        <span>{comp.beds}bd / {comp.baths}ba</span>
                        <span>{comp.sqft.toLocaleString()} sqft</span>
                        <span className="tabular-nums">${comp.pricePerSqft}/sqft</span>
                        {comp.saleDate && <span>Sold: {comp.saleDate}</span>}
                      </div>
                      {/* Quality Warnings */}
                      {score && score.warnings.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {score.warnings.map((w, wi) => (
                            <span key={wi} className="inline-flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                              <ShieldAlert className="w-3 h-3" /> {w}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeComp(comp.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {comps.length === 0 && !showForm && (
          <div className="text-center py-6 space-y-2">
            <p className="text-sm text-muted-foreground">No comps added yet.</p>
            <p className="text-xs text-muted-foreground">
              Your ARV is currently calculated using the <strong>Cost Approach</strong> (Purchase Price + Rehab Budget = {formatCurrency(costApproachArv)}).
              Add <strong>standard retail sale</strong> comps to validate this against market data.
            </p>
          </div>
        )}

        {/* Add Comp Form */}
        {showForm && (
          <div className="p-4 rounded-lg border-2 border-dashed border-primary/30 space-y-3 bg-primary/5">
            <h4 className="font-semibold text-sm">Add Comparable Sale</h4>
            <div className="p-2.5 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold">
              ⛔ STANDARD RETAIL SALES ONLY — Do NOT enter foreclosures, short sales, REO, bank-owned, or auction properties. These are distressed transactions and do not reflect true market value.
            </div>
            <p className="text-xs text-muted-foreground">
              Enter a recently sold, <strong>renovated</strong> property similar to your subject. Comps should be standard retail (arms-length) sales within 0.5 miles, sold within 6 months, and similar in size/beds/baths.
            </p>
            <div className="space-y-1">
              <Label className="text-xs">Address *</Label>
              <Input value={newComp.address} onChange={(e) => setNewComp(p => ({ ...p, address: e.target.value }))} placeholder="123 Main St, City, State" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Sale Price *</Label>
                <CurrencyInput value={newComp.salePrice} onChange={(v) => setNewComp(p => ({ ...p, salePrice: v }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sale Date</Label>
                <Input type="date" value={newComp.saleDate} onChange={(e) => setNewComp(p => ({ ...p, saleDate: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Days on Market</Label>
                <Input type="number" min={0} value={newComp.daysOnMarket || ''} onChange={(e) => setNewComp(p => ({ ...p, daysOnMarket: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sq Ft *</Label>
                <Input type="number" min={0} value={newComp.sqft || ''} onChange={(e) => setNewComp(p => ({ ...p, sqft: parseInt(e.target.value) || 0 }))} placeholder="Required" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Condition *</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={newComp.condition}
                  onChange={(e) => setNewComp(p => ({ ...p, condition: e.target.value as any }))}
                >
                  <option value="">Select...</option>
                  <option value="renovated">✓ Renovated / Flipped (Best)</option>
                  <option value="updated">✓ Updated / Move-in Ready</option>
                  <option value="average">⚠ Average Condition</option>
                  <option value="distressed">⛔ Distressed / As-Is (DO NOT USE)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Beds</Label>
                <Input type="number" min={0} value={newComp.beds || ''} onChange={(e) => setNewComp(p => ({ ...p, beds: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Baths</Label>
                <Input type="number" min={0} step={0.5} value={newComp.baths || ''} onChange={(e) => setNewComp(p => ({ ...p, baths: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Year Built</Label>
                <Input type="number" value={newComp.yearBuilt || ''} onChange={(e) => setNewComp(p => ({ ...p, yearBuilt: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Neighborhood</Label>
                <Input value={newComp.neighborhood} onChange={(e) => setNewComp(p => ({ ...p, neighborhood: e.target.value }))} placeholder="Optional" />
              </div>
            </div>
            {/* Condition warning */}
            {newComp.condition === 'distressed' && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
                <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  <strong>DO NOT ADD THIS COMP.</strong> Distressed sales (foreclosures, short sales, REO, auction) are NOT standard retail transactions. They sell below market value due to the seller's financial distress, not because of the property's worth. Using distressed comps will give you a false, understated ARV. Only use standard retail sales where buyer and seller are acting at arms-length.
                </span>
              </div>
            )}
            {newComp.condition === 'average' && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs text-orange-600 dark:text-orange-400">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  <strong>Caution:</strong> Average-condition comps may understate your ARV if you plan a full renovation. Ideally, use renovated/updated comps that match your planned rehab level. If this is the best comp available, it can still provide useful data.
                </span>
              </div>
            )}
            {/* Validation hints */}
            {newComp.salePrice > 0 && newComp.sqft > 0 && (
              <div className="text-xs text-muted-foreground p-2 rounded bg-secondary/40">
                Preview: <strong>${Math.round(newComp.salePrice / newComp.sqft)}/sqft</strong>
                {subjectSqft > 0 && (
                  <> — Market validation value: ~<strong>{formatCurrency(Math.round(newComp.salePrice / newComp.sqft) * subjectSqft)}</strong> for your {subjectSqft.toLocaleString()} sqft subject</>
                )}
              </div>
            )}
            {newComp.salePrice > 0 && newComp.sqft === 0 && (
              <div className="flex items-start gap-2 text-xs text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>Square footage is required for accurate $/sqft calculation. Without it, this comp will have $0/sqft.</span>
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleAdd} disabled={!newComp.address || newComp.salePrice <= 0 || newComp.condition === 'distressed'}>
                <Plus className="w-4 h-4 mr-1" /> Add Comp
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              {newComp.condition === 'distressed' && (
                <span className="text-xs text-red-500 font-semibold self-center">Cannot add distressed comps</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
