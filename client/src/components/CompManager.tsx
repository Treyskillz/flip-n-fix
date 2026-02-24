import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from './CurrencyInput';
import { Badge } from '@/components/ui/badge';
import type { CompProperty } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { BarChart3, Plus, Trash2, TrendingUp } from 'lucide-react';
import { useState, useCallback } from 'react';

interface Props {
  comps: CompProperty[];
  addComp: (comp: Omit<CompProperty, 'id' | 'pricePerSqft'>) => void;
  removeComp: (id: string) => void;
  arv: number;
  arvOverride: number | null;
  setArvOverride: (v: number | null) => void;
  effectiveArv: number;
  subjectSqft: number;
}

const emptyComp = {
  address: '', salePrice: 0, saleDate: '', daysOnMarket: 0,
  sqft: 0, beds: 0, baths: 0, lotSizeSqft: 0, yearBuilt: 0,
  neighborhood: '', notableFeatures: '', source: 'manual' as const,
};

export function CompManager({ comps, addComp, removeComp, arv, arvOverride, setArvOverride, effectiveArv, subjectSqft }: Props) {
  const [newComp, setNewComp] = useState(emptyComp);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = useCallback(() => {
    if (newComp.address && newComp.salePrice > 0) {
      addComp(newComp);
      setNewComp(emptyComp);
      setShowForm(false);
    }
  }, [newComp, addComp]);

  const avgPpsf = comps.length > 0
    ? Math.round(comps.reduce((s, c) => s + c.pricePerSqft, 0) / comps.length)
    : 0;

  return (
    <Card className="border-l-4 border-l-[oklch(0.5_0.12_250)]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-[oklch(0.5_0.12_250)]" />
            Comparable Sales
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-1" /> Add Comp
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ARV Summary */}
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-secondary/60">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Estimated ARV:</span>
            <span className="text-lg font-bold tabular-nums">{formatCurrency(effectiveArv)}</span>
          </div>
          {comps.length > 0 && (
            <>
              <span className="text-muted-foreground">|</span>
              <span className="text-xs text-muted-foreground">
                Avg $/sqft: <span className="font-semibold text-foreground">${avgPpsf}</span>
                {' × '}{subjectSqft.toLocaleString()} sqft
              </span>
            </>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Override:</Label>
            <CurrencyInput
              value={arvOverride ?? 0}
              onChange={(v) => setArvOverride(v > 0 ? v : null)}
              placeholder="Auto"
              className="w-32 h-8 text-sm"
            />
          </div>
        </div>

        {/* Comp List */}
        {comps.length > 0 && (
          <div className="space-y-2">
            {comps.map((comp) => (
              <div key={comp.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{comp.address}</span>
                    <Badge variant="secondary" className="text-xs shrink-0">{comp.daysOnMarket} DOM</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground tabular-nums">{formatCurrency(comp.salePrice)}</span>
                    <span>{comp.beds}bd / {comp.baths}ba</span>
                    <span>{comp.sqft.toLocaleString()} sqft</span>
                    <span className="tabular-nums">${comp.pricePerSqft}/sqft</span>
                    {comp.saleDate && <span>Sold: {comp.saleDate}</span>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeComp(comp.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {comps.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground text-center py-4">No comps added yet. Click "Add Comp" to enter comparable sales data.</p>
        )}

        {/* Add Comp Form */}
        {showForm && (
          <div className="p-4 rounded-lg border-2 border-dashed border-primary/30 space-y-3 bg-primary/5">
            <h4 className="font-semibold text-sm">Add Comparable Sale</h4>
            <div className="space-y-1">
              <Label className="text-xs">Address</Label>
              <Input value={newComp.address} onChange={(e) => setNewComp(p => ({ ...p, address: e.target.value }))} placeholder="123 Main St" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Sale Price</Label>
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
                <Label className="text-xs">Sq Ft</Label>
                <Input type="number" min={0} value={newComp.sqft || ''} onChange={(e) => setNewComp(p => ({ ...p, sqft: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleAdd} disabled={!newComp.address || newComp.salePrice <= 0}>
                <Plus className="w-4 h-4 mr-1" /> Add Comp
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
