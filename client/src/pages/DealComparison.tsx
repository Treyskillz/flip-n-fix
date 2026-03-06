import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useBranding, buildBrandedHeaderHtml, buildBrandedFooterHtml } from '@/lib/branding';
import { Link, useSearch } from 'wouter';
import { useState, useMemo } from 'react';
import {
  Lock, Crown, Loader2, Download, ArrowLeft, TrendingUp,
  DollarSign, Target, Home as HomeIcon, BarChart3, CheckCircle2, XCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';

// ─── Types ──────────────────────────────────────────────────
interface CompDeal {
  id: number;
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
  dealScore: number | null;
  dealVerdict: string;
  maxAllowableOffer: number;
  sqft: number;
  beds: number;
  baths: number;
  yearBuilt: number;
  market: string | null;
  status: string;
  cashOnCash?: number;
}

function verdictColor(v: string) {
  if (v === 'excellent' || v === 'good') return 'text-green-600';
  if (v === 'marginal') return 'text-amber-600';
  return 'text-red-600';
}

function verdictBg(v: string) {
  if (v === 'excellent' || v === 'good') return 'bg-green-100 text-green-700';
  if (v === 'marginal') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

function bestValue(deals: CompDeal[], key: keyof CompDeal, higher = true): number | null {
  const vals = deals.map(d => d[key] as number).filter(v => v != null);
  if (vals.length === 0) return null;
  return higher ? Math.max(...vals) : Math.min(...vals);
}

// ─── Comparison Row ─────────────────────────────────────────
function CompRow({ label, deals, accessor, format, highlight }: {
  label: string;
  deals: CompDeal[];
  accessor: (d: CompDeal) => number | string | null | undefined;
  format?: (v: number | string | null | undefined) => string;
  highlight?: 'highest' | 'lowest' | 'none';
}) {
  const values = deals.map(d => accessor(d));
  const numValues = values.filter(v => typeof v === 'number') as number[];
  const best = highlight === 'highest' ? Math.max(...numValues) :
    highlight === 'lowest' ? Math.min(...numValues) : null;

  return (
    <tr className="border-b last:border-0">
      <td className="py-2.5 px-3 font-medium text-sm text-muted-foreground whitespace-nowrap">{label}</td>
      {values.map((v, i) => {
        const isBest = best !== null && typeof v === 'number' && v === best;
        const formatted = format ? format(v) : (v != null ? String(v) : '—');
        return (
          <td key={i} className={`py-2.5 px-3 text-right text-sm font-semibold ${isBest ? 'text-green-600 bg-green-50' : ''}`}>
            {formatted}
            {isBest && highlight !== 'none' && <span className="ml-1 text-green-500 text-xs">★</span>}
          </td>
        );
      })}
    </tr>
  );
}

// ─── PDF Export ──────────────────────────────────────────────
function exportComparisonPdf(deals: CompDeal[], branding: ReturnType<typeof useBranding>['branding']) {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const brandColor = branding.brandColor || '#c53030';

  const rows = [
    { label: 'Purchase Price', key: 'purchasePrice', fmt: (v: number) => formatCurrency(v), hl: 'lowest' },
    { label: 'ARV', key: 'arv', fmt: (v: number) => formatCurrency(v), hl: 'highest' },
    { label: 'Rehab Cost', key: 'rehabCost', fmt: (v: number) => formatCurrency(v), hl: 'lowest' },
    { label: 'Total Investment', key: 'totalInvestment', fmt: (v: number) => formatCurrency(v), hl: 'lowest' },
    { label: 'Net Profit', key: 'netProfit', fmt: (v: number) => formatCurrency(v), hl: 'highest' },
    { label: 'ROI', key: 'roi', fmt: (v: number) => `${v.toFixed(1)}%`, hl: 'highest' },
    { label: 'Deal Score', key: 'dealScore', fmt: (v: number) => v ? String(v) : '—', hl: 'highest' },
    { label: 'Max Allowable Offer', key: 'maxAllowableOffer', fmt: (v: number) => formatCurrency(v), hl: 'none' },
    { label: 'Sq Ft', key: 'sqft', fmt: (v: number) => v.toLocaleString(), hl: 'highest' },
    { label: 'Beds / Baths', key: 'beds', fmt: (_v: number, d: CompDeal) => `${d.beds} / ${d.baths}`, hl: 'none' },
    { label: 'Year Built', key: 'yearBuilt', fmt: (v: number) => String(v), hl: 'none' },
  ];

  const headerHtml = buildBrandedHeaderHtml(branding, {
    title: 'Deal Comparison Report',
    subtitle: `${deals.length} Properties Compared`,
    meta: dateStr,
  });
  const footerHtml = buildBrandedFooterHtml(branding);

  const tableRows = rows.map(r => {
    const vals = deals.map(d => {
      const v = (d as any)[r.key];
      return r.fmt(v, d as any);
    });
    const numVals = deals.map(d => (d as any)[r.key] as number);
    const best = r.hl === 'highest' ? Math.max(...numVals.filter(n => n != null)) :
      r.hl === 'lowest' ? Math.min(...numVals.filter(n => n != null)) : null;

    return `<tr>
      <td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #eee;white-space:nowrap;font-size:12px;color:#666;">${r.label}</td>
      ${vals.map((v, i) => {
      const isBest = best !== null && numVals[i] === best && r.hl !== 'none';
      return `<td style="padding:8px 12px;text-align:right;border-bottom:1px solid #eee;font-weight:600;font-size:13px;${isBest ? `color:#16a34a;background:#f0fdf4;` : ''}">${v}${isBest ? ' ★' : ''}</td>`;
    }).join('')}
    </tr>`;
  }).join('');

  const verdictRow = `<tr style="background:#f9f9f9;">
    <td style="padding:10px 12px;font-weight:700;border-top:2px solid #ddd;font-size:12px;color:#666;">VERDICT</td>
    ${deals.map(d => {
    const c = d.dealVerdict === 'excellent' || d.dealVerdict === 'good' ? '#16a34a' : d.dealVerdict === 'marginal' ? '#ca8a04' : '#dc2626';
    return `<td style="padding:10px 12px;text-align:center;border-top:2px solid #ddd;font-weight:800;font-size:14px;color:${c};text-transform:uppercase;">${d.dealVerdict}</td>`;
  }).join('')}
  </tr>`;

  const html = `<!DOCTYPE html><html><head><title>Deal Comparison Report</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Segoe UI',Arial,sans-serif; color:#1a1a1a; padding:40px; line-height:1.5; max-width:900px; margin:0 auto; }
    @media print { body { padding:20px; } }
  </style></head><body>
  ${headerHtml}
  <h2 style="font-size:16px;color:${brandColor};margin-bottom:16px;text-transform:uppercase;letter-spacing:0.5px;">Property Comparison</h2>
  <table style="width:100%;border-collapse:collapse;">
    <thead>
      <tr style="background:#f5f5f5;">
        <th style="padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;color:#888;letter-spacing:0.5px;">Metric</th>
        ${deals.map(d => `<th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:${brandColor};border-bottom:2px solid ${brandColor};">${d.address}<br/><span style="font-weight:400;color:#888;font-size:10px;">${d.city}, ${d.state}</span></th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${tableRows}
      ${verdictRow}
    </tbody>
  </table>

  <div style="margin-top:24px;padding:16px;background:#f9f9f9;border-radius:8px;border-left:4px solid ${brandColor};">
    <h3 style="font-size:14px;color:${brandColor};margin-bottom:8px;">Recommendation</h3>
    <p style="font-size:13px;color:#555;">
      ${(() => {
      const best = deals.reduce((a, b) => (a.netProfit > b.netProfit ? a : b));
      const bestRoi = deals.reduce((a, b) => (a.roi > b.roi ? a : b));
      return `Based on the analysis, <strong>${best.address}</strong> offers the highest net profit of ${formatCurrency(best.netProfit)}${best.address !== bestRoi.address ? `, while <strong>${bestRoi.address}</strong> offers the best ROI at ${bestRoi.roi.toFixed(1)}%` : ` with an ROI of ${best.roi.toFixed(1)}%`}. All projections are estimates — verify independently before making investment decisions.`;
    })()}
    </p>
  </div>
  ${footerHtml}
  </body></html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 500);
}

// ─── Main Component ──────────────────────────────────────────
export default function DealComparison() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: subStatus } = trpc.subscription.status.useQuery(undefined, { enabled: isAuthenticated });
  const { branding } = useBranding();

  // Parse deal IDs from URL query string
  const searchString = useSearch();
  const dealIds = useMemo(() => {
    const params = new URLSearchParams(searchString);
    const ids = params.get('ids');
    if (!ids) return [];
    return ids.split(',').map(Number).filter(n => !isNaN(n) && n > 0);
  }, [searchString]);

  const isTeamOrAdmin = user?.role === 'admin' || subStatus?.plan === 'team';

  const { data: deals, isLoading, error } = trpc.comparison.getDeals.useQuery(
    { dealIds },
    { enabled: isAuthenticated && dealIds.length >= 2 }
  );

  // ─── Gate: Not Team tier ──────────────────────────────────
  if (!authLoading && !isTeamOrAdmin) {
    return (
      <div className="container py-20 text-center">
        <Lock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Deal Comparison</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Side-by-side deal comparison with PDF export is exclusive to Team tier subscribers.
        </p>
        <Link href="/pricing">
          <Button className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
            <Crown className="w-4 h-4" /> Upgrade to Team
          </Button>
        </Link>
      </div>
    );
  }

  if (dealIds.length < 2) {
    return (
      <div className="container py-20 text-center">
        <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Deal Comparison</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Select 2-6 deals from your Saved Deals page to compare them side-by-side.
        </p>
        <Link href="/saved-deals">
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Go to Saved Deals
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading || authLoading) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
        <p className="text-muted-foreground mt-4">Loading comparison...</p>
      </div>
    );
  }

  if (error || !deals || deals.length < 2) {
    return (
      <div className="container py-20 text-center">
        <XCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Comparison Error</h1>
        <p className="text-muted-foreground mb-6">{error?.message || 'Could not load deals for comparison.'}</p>
        <Link href="/saved-deals">
          <Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Back to Saved Deals</Button>
        </Link>
      </div>
    );
  }

  // Find best values for highlighting
  const bestProfit = bestValue(deals, 'netProfit', true);
  const bestRoi = bestValue(deals, 'roi', true);
  const bestScore = bestValue(deals, 'dealScore', true);

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 className="w-7 h-7 text-[oklch(0.48_0.20_18)]" />
            <h1 className="text-2xl font-bold tracking-tight">Deal Comparison</h1>
            <Badge className="bg-[oklch(0.48_0.20_18)] text-white text-xs">Team</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Comparing {deals.length} properties side-by-side</p>
        </div>
        <div className="flex gap-2">
          <Link href="/saved-deals">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
          </Link>
          <Button
            size="sm"
            className="gap-1.5 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
            onClick={() => exportComparisonPdf(deals, branding)}
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Property Cards */}
      <div className={`grid gap-4 mb-6 ${deals.length <= 3 ? `grid-cols-${deals.length}` : 'grid-cols-2 md:grid-cols-3'}`}>
        {deals.map(d => (
          <Card key={d.id} className="relative">
            {d.netProfit === bestProfit && <div className="absolute top-2 right-2"><Badge className="bg-green-100 text-green-700 text-xs">Best Profit</Badge></div>}
            <CardContent className="pt-5 pb-4">
              <h3 className="font-bold text-sm truncate mb-0.5">{d.address}</h3>
              <p className="text-xs text-muted-foreground mb-3">{d.city}, {d.state} {d.zip}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Profit</p>
                  <p className={`text-sm font-bold ${d.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(d.netProfit)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ROI</p>
                  <p className={`text-sm font-bold ${d.roi >= 15 ? 'text-green-600' : d.roi >= 0 ? 'text-amber-600' : 'text-red-600'}`}>{d.roi.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Verdict</p>
                  <Badge className={`text-xs ${verdictBg(d.dealVerdict)}`}>{d.dealVerdict}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground text-xs uppercase">Metric</th>
                  {deals.map(d => (
                    <th key={d.id} className="text-right py-2.5 px-3 font-semibold text-xs uppercase" style={{ color: '#c53030' }}>
                      {d.address.length > 25 ? d.address.substring(0, 25) + '...' : d.address}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <CompRow label="Purchase Price" deals={deals} accessor={d => d.purchasePrice} format={v => formatCurrency(v as number)} highlight="lowest" />
                <CompRow label="ARV" deals={deals} accessor={d => d.arv} format={v => formatCurrency(v as number)} highlight="highest" />
                <CompRow label="Rehab Cost" deals={deals} accessor={d => d.rehabCost} format={v => formatCurrency(v as number)} highlight="lowest" />
                <CompRow label="Total Investment" deals={deals} accessor={d => d.totalInvestment} format={v => formatCurrency(v as number)} highlight="lowest" />
                <CompRow label="Net Profit" deals={deals} accessor={d => d.netProfit} format={v => formatCurrency(v as number)} highlight="highest" />
                <CompRow label="ROI" deals={deals} accessor={d => d.roi} format={v => `${(v as number).toFixed(1)}%`} highlight="highest" />
                <CompRow label="Deal Score" deals={deals} accessor={d => d.dealScore} format={v => v != null ? String(v) : '—'} highlight="highest" />
                <CompRow label="Cash on Cash" deals={deals} accessor={d => d.cashOnCash} format={v => v != null ? `${(v as number).toFixed(1)}%` : '—'} highlight="highest" />
                <CompRow label="Max Allowable Offer" deals={deals} accessor={d => d.maxAllowableOffer} format={v => formatCurrency(v as number)} highlight="none" />
                <CompRow label="Sq Ft" deals={deals} accessor={d => d.sqft} format={v => (v as number).toLocaleString()} highlight="highest" />
                <CompRow label="Beds" deals={deals} accessor={d => d.beds} format={v => String(v)} highlight="none" />
                <CompRow label="Baths" deals={deals} accessor={d => d.baths} format={v => String(v)} highlight="none" />
                <CompRow label="Year Built" deals={deals} accessor={d => d.yearBuilt} format={v => String(v)} highlight="none" />
                <CompRow label="Market" deals={deals} accessor={d => d.market || `${d.city}, ${d.state}`} highlight="none" />
                <tr className="bg-muted/30">
                  <td className="py-3 px-3 font-bold text-sm uppercase">Verdict</td>
                  {deals.map(d => (
                    <td key={d.id} className={`py-3 px-3 text-right font-bold text-sm uppercase ${verdictColor(d.dealVerdict)}`}>
                      {d.dealVerdict}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Card className="mt-6 border-l-4" style={{ borderLeftColor: '#c53030' }}>
        <CardContent className="pt-5 pb-4">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Analysis Summary
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {(() => {
              const best = deals.reduce((a, b) => (a.netProfit > b.netProfit ? a : b));
              const bestRoiDeal = deals.reduce((a, b) => (a.roi > b.roi ? a : b));
              const lowestCost = deals.reduce((a, b) => (a.totalInvestment < b.totalInvestment ? a : b));
              let text = `Of the ${deals.length} properties compared, **${best.address}** offers the highest net profit at ${formatCurrency(best.netProfit)}.`;
              if (best.address !== bestRoiDeal.address) {
                text += ` However, **${bestRoiDeal.address}** provides the best ROI at ${bestRoiDeal.roi.toFixed(1)}%.`;
              }
              if (lowestCost.address !== best.address) {
                text += ` **${lowestCost.address}** requires the lowest total investment at ${formatCurrency(lowestCost.totalInvestment)}.`;
              }
              return text;
            })()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
