import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Save, Trash2, BarChart3, MapPin, DollarSign, TrendingUp,
  TrendingDown, ArrowRight, Calculator, AlertTriangle
} from 'lucide-react';
import { Link } from 'wouter';

interface SavedDeal {
  id: string;
  savedAt: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  purchasePrice: number;
  arv: number;
  rehabCost: number;
  totalInvestment: number;
  netProfit: number;
  roi: number;
  dealVerdict: string;
  maxAllowableOffer: number;
  recommendedMaxPrice: number;
  targetROI: number;
  sqft: number;
  beds: number;
  baths: number;
  yearBuilt: number;
}

const STORAGE_KEY = 'freedom-one-saved-deals';

function getSavedDeals(): SavedDeal[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function deleteDeal(id: string): SavedDeal[] {
  const deals = getSavedDeals().filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  return deals;
}

function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function DealCard({ deal, onDelete, selected, onToggle }: {
  deal: SavedDeal;
  onDelete: () => void;
  selected: boolean;
  onToggle: () => void;
}) {
  const isProfit = deal.netProfit > 0;
  return (
    <Card className={`border transition-all ${selected ? 'border-[oklch(0.48_0.20_18)] shadow-md' : 'border-border/60 hover:border-border'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-sm">{deal.address}</h3>
            <p className="text-xs text-muted-foreground">{deal.city}, {deal.state} {deal.zip}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Saved {new Date(deal.savedAt).toLocaleDateString()} | {deal.beds}bd / {deal.baths}ba / {deal.sqft.toLocaleString()} sqft
            </p>
          </div>
          <Badge className={isProfit
            ? 'bg-[oklch(0.55_0.18_145)]/10 text-[oklch(0.45_0.18_145)]'
            : 'bg-[oklch(0.48_0.20_18)]/10 text-[oklch(0.48_0.20_18)]'
          }>
            {deal.dealVerdict}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-secondary/40 rounded p-2 text-center">
            <p className="text-xs text-muted-foreground">Purchase</p>
            <p className="text-sm font-bold tabular-nums">{fmt(deal.purchasePrice)}</p>
          </div>
          <div className="bg-secondary/40 rounded p-2 text-center">
            <p className="text-xs text-muted-foreground">ARV</p>
            <p className="text-sm font-bold tabular-nums">{fmt(deal.arv)}</p>
          </div>
          <div className={`rounded p-2 text-center ${isProfit ? 'bg-[oklch(0.55_0.18_145)]/10' : 'bg-[oklch(0.48_0.20_18)]/10'}`}>
            <p className="text-xs text-muted-foreground">Profit</p>
            <p className={`text-sm font-bold tabular-nums ${isProfit ? 'text-[oklch(0.45_0.18_145)]' : 'text-[oklch(0.48_0.20_18)]'}`}>
              {fmt(deal.netProfit)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span>ROI: <strong className={isProfit ? 'text-[oklch(0.45_0.18_145)]' : 'text-[oklch(0.48_0.20_18)]'}>{deal.roi.toFixed(1)}%</strong></span>
          <span>|</span>
          <span>Rehab: <strong>{fmt(deal.rehabCost)}</strong></span>
          <span>|</span>
          <span>MAO: <strong>{fmt(deal.maxAllowableOffer)}</strong></span>
        </div>

        <div className="flex gap-2">
          <Button
            variant={selected ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs gap-1"
            onClick={onToggle}
          >
            <BarChart3 className="w-3 h-3" /> {selected ? 'Selected' : 'Compare'}
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1 text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonTable({ deals }: { deals: SavedDeal[] }) {
  if (deals.length < 2) return null;

  const rows: { label: string; key: keyof SavedDeal; format?: 'currency' | 'percent' | 'number' | 'text' }[] = [
    { label: 'Address', key: 'address', format: 'text' },
    { label: 'City/State', key: 'city', format: 'text' },
    { label: 'Sq Ft', key: 'sqft', format: 'number' },
    { label: 'Beds / Baths', key: 'beds', format: 'text' },
    { label: 'Purchase Price', key: 'purchasePrice', format: 'currency' },
    { label: 'ARV', key: 'arv', format: 'currency' },
    { label: 'Rehab Cost', key: 'rehabCost', format: 'currency' },
    { label: 'Total Investment', key: 'totalInvestment', format: 'currency' },
    { label: 'Net Profit', key: 'netProfit', format: 'currency' },
    { label: 'ROI', key: 'roi', format: 'percent' },
    { label: '70% Rule MAO', key: 'maxAllowableOffer', format: 'currency' },
    { label: 'Max Price (Target ROI)', key: 'recommendedMaxPrice', format: 'currency' },
    { label: 'Deal Verdict', key: 'dealVerdict', format: 'text' },
  ];

  return (
    <Card className="mt-6 border-[oklch(0.48_0.20_18)]/20">
      <CardContent className="p-4">
        <h3 className="font-bold text-base mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
          Side-by-Side Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-2 font-semibold text-xs min-w-[140px]">Metric</th>
                {deals.map(d => (
                  <th key={d.id} className="text-right p-2 font-semibold text-xs min-w-[120px]">
                    {d.address.split(',')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/20">
                  <td className="p-2 text-xs font-medium">{row.label}</td>
                  {deals.map(d => {
                    let value: string;
                    if (row.key === 'city') {
                      value = `${d.city}, ${d.state}`;
                    } else if (row.key === 'beds') {
                      value = `${d.beds} / ${d.baths}`;
                    } else if (row.format === 'currency') {
                      value = fmt(d[row.key] as number);
                    } else if (row.format === 'percent') {
                      value = `${(d[row.key] as number).toFixed(1)}%`;
                    } else if (row.format === 'number') {
                      value = (d[row.key] as number).toLocaleString();
                    } else {
                      value = String(d[row.key]);
                    }

                    const isProfit = row.key === 'netProfit' && (d[row.key] as number) > 0;
                    const isLoss = row.key === 'netProfit' && (d[row.key] as number) <= 0;
                    const isGoodROI = row.key === 'roi' && (d[row.key] as number) > 0;
                    const isBadROI = row.key === 'roi' && (d[row.key] as number) <= 0;

                    return (
                      <td key={d.id} className={`p-2 text-right text-xs tabular-nums ${
                        isProfit || isGoodROI ? 'text-[oklch(0.45_0.18_145)] font-bold' :
                        isLoss || isBadROI ? 'text-[oklch(0.48_0.20_18)] font-bold' : ''
                      }`}>
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SavedDeals() {
  const [deals, setDeals] = useState<SavedDeal[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setDeals(getSavedDeals());
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteDeal(id);
    setDeals(updated);
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedDeals = deals.filter(d => selectedIds.has(d.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-[oklch(0.48_0.20_18)]/20">
              <Save className="w-6 h-6 text-[oklch(0.65_0.18_18)]" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Saved Deals</h1>
              <p className="text-sm text-[oklch(0.55_0_0)]">{deals.length} deal{deals.length !== 1 ? 's' : ''} saved</p>
            </div>
          </div>
          <p className="text-[oklch(0.6_0_0)] text-sm max-w-2xl mt-3 leading-relaxed">
            View and compare your saved property analyses side-by-side. Select two or more deals 
            to see a detailed comparison table with all key metrics.
          </p>
        </div>
      </section>

      <section className="container py-8">
        {deals.length === 0 ? (
          <Card className="border-dashed border-2 border-border/60">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-muted-foreground/40" />
              <h3 className="font-bold text-lg mb-2">No Saved Deals Yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                Use the Deal Analyzer to analyze a property, then click "Save Deal" to store it here 
                for future reference and comparison.
              </p>
              <Link href="/analyzer">
                <Button className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
                  <Calculator className="w-4 h-4" /> Go to Analyzer
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {selectedIds.size >= 2 && (
              <div className="mb-4 p-3 bg-[oklch(0.48_0.20_18)]/5 border border-[oklch(0.48_0.20_18)]/20 rounded-lg flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
                <span className="text-sm font-medium">{selectedIds.size} deals selected for comparison</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map(deal => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onDelete={() => handleDelete(deal.id)}
                  selected={selectedIds.has(deal.id)}
                  onToggle={() => toggleSelect(deal.id)}
                />
              ))}
            </div>

            {selectedDeals.length >= 2 && (
              <ComparisonTable deals={selectedDeals} />
            )}
          </>
        )}
      </section>

      {/* Disclaimer */}
      <section className="bg-secondary/30 border-t border-border/50">
        <div className="container py-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> Saved deal data is stored locally in your browser and is not backed up to any server. 
            Clearing your browser data will delete all saved deals. All calculations are estimates and should not be relied upon 
            as the sole basis for investment decisions. Always perform your own due diligence and consult with qualified professionals.
          </p>
        </div>
      </section>
    </div>
  );
}
