import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Save, Trash2, BarChart3, MapPin, DollarSign, TrendingUp,
  ArrowRight, Calculator, AlertTriangle, Search, SortAsc, SortDesc,
  Download, Printer, FileText, Archive, Star, StarOff,
  ChevronDown, ChevronUp, Eye, Filter, LayoutGrid, LayoutList,
  CheckCircle2, Clock, XCircle, Pause
} from 'lucide-react';
import { Link } from 'wouter';
import { formatCurrency } from '@/lib/calculations';

// ─── Types ───────────────────────────────────────────────────
type DealStatus = 'active' | 'under_contract' | 'closed' | 'passed' | 'archived';

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
  market?: string;
  dealScore?: number;
  cashOnCash?: number;
  status?: DealStatus;
  starred?: boolean;
  notes?: string;
}

type SortField = 'savedAt' | 'netProfit' | 'roi' | 'dealScore' | 'purchasePrice' | 'arv' | 'rehabCost' | 'address';
type SortDir = 'asc' | 'desc';
type ViewMode = 'grid' | 'table';

// ─── Storage Helpers ─────────────────────────────────────────
const STORAGE_KEY = 'freedom-one-saved-deals';

function getSavedDeals(): SavedDeal[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveDeals(deals: SavedDeal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
}

function deleteDeal(id: string): SavedDeal[] {
  const deals = getSavedDeals().filter(d => d.id !== id);
  saveDeals(deals);
  return deals;
}

function updateDeal(id: string, updates: Partial<SavedDeal>): SavedDeal[] {
  const deals = getSavedDeals().map(d => d.id === id ? { ...d, ...updates } : d);
  saveDeals(deals);
  return deals;
}

function fmt(n: number): string {
  return formatCurrency(n);
}

// ─── Status Config ───────────────────────────────────────────
const STATUS_CONFIG: Record<DealStatus, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  active: { label: 'Active', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  under_contract: { label: 'Under Contract', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
  closed: { label: 'Closed', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  passed: { label: 'Passed', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  archived: { label: 'Archived', icon: Archive, color: 'text-gray-500', bg: 'bg-gray-100' },
};

// ─── Deal Score Badge ────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-100 text-green-700' :
    score >= 60 ? 'bg-blue-100 text-blue-700' :
    score >= 40 ? 'bg-amber-100 text-amber-700' :
    'bg-red-100 text-red-700';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>{score}</span>;
}

// ─── PDF Export for Saved Deal ───────────────────────────────
function exportDealPdf(deal: SavedDeal) {
  const addr = `${deal.address}, ${deal.city}, ${deal.state} ${deal.zip}`;
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const isProfit = deal.netProfit > 0;
  const verdictClass = deal.dealVerdict === 'excellent' || deal.dealVerdict === 'good' ? 'verdict-good' : deal.dealVerdict === 'marginal' ? 'verdict-marginal' : 'verdict-poor';
  const verdictColor = deal.dealVerdict === 'excellent' || deal.dealVerdict === 'good' ? '#16a34a' : deal.dealVerdict === 'marginal' ? '#ca8a04' : '#dc2626';

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Deal Summary — ${addr}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 40px; line-height: 1.5; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px solid #c53030; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { font-size: 24px; color: #c53030; letter-spacing: 1px; }
    .header .addr { font-size: 16px; font-weight: 600; margin-top: 4px; }
    .header .meta { font-size: 12px; color: #888; margin-top: 4px; }
    .summary { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .summary-card { padding: 16px; background: #f9f9f9; border-radius: 8px; text-align: center; border: 1px solid #e5e5e5; }
    .summary-card .label { font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; }
    .summary-card .value { font-size: 24px; font-weight: 800; margin-top: 4px; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 16px; color: #c53030; border-bottom: 2px solid #e5e5e5; padding-bottom: 6px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f5f5f5; font-weight: 600; text-transform: uppercase; font-size: 10px; color: #666; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .stat { padding: 12px; background: #f9f9f9; border-radius: 6px; border-left: 3px solid #e5e5e5; }
    .stat-label { font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; }
    .stat-value { font-size: 18px; font-weight: 700; margin-top: 2px; }
    .positive { color: #16a34a; }
    .negative { color: #dc2626; }
    .verdict-box { padding: 20px; border-radius: 8px; text-align: center; margin-top: 20px; }
    .verdict-good { background: #f0fdf4; border: 2px solid #16a34a; }
    .verdict-marginal { background: #fffbeb; border: 2px solid #ca8a04; }
    .verdict-poor { background: #fef2f2; border: 2px solid #dc2626; }
    .verdict-label { font-size: 22px; font-weight: 800; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 2px solid #e5e5e5; padding-top: 16px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>DEAL SUMMARY REPORT</h1>
    <div class="addr">${addr}</div>
    <div class="meta">Generated ${dateStr} | Saved ${new Date(deal.savedAt).toLocaleDateString()}${deal.market ? ` | Market: ${deal.market}` : ''}</div>
  </div>

  <div class="summary">
    <div class="summary-card">
      <div class="label">Purchase Price</div>
      <div class="value">${fmt(deal.purchasePrice)}</div>
    </div>
    <div class="summary-card">
      <div class="label">After Repair Value</div>
      <div class="value" style="color:#c53030">${fmt(deal.arv)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Net Profit</div>
      <div class="value ${isProfit ? 'positive' : 'negative'}">${fmt(deal.netProfit)}</div>
    </div>
  </div>

  <div class="section">
    <h2>Property Details</h2>
    <div class="grid">
      <div class="stat"><div class="stat-label">Beds / Baths</div><div class="stat-value" style="font-size:15px">${deal.beds} BD / ${deal.baths} BA</div></div>
      <div class="stat"><div class="stat-label">Square Footage</div><div class="stat-value" style="font-size:15px">${deal.sqft.toLocaleString()} sqft</div></div>
      <div class="stat"><div class="stat-label">Year Built</div><div class="stat-value" style="font-size:15px">${deal.yearBuilt}</div></div>
      <div class="stat"><div class="stat-label">Deal Score</div><div class="stat-value" style="font-size:15px">${deal.dealScore || '—'}/100</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Financial Analysis</h2>
    <table>
      <tr><td>Purchase Price</td><td style="text-align:right; font-weight:600">${fmt(deal.purchasePrice)}</td></tr>
      <tr><td>Rehab Cost</td><td style="text-align:right">${fmt(deal.rehabCost)}</td></tr>
      <tr style="background:#f5f5f5"><td style="font-weight:700">Total Investment</td><td style="text-align:right; font-weight:700">${fmt(deal.totalInvestment)}</td></tr>
      <tr><td>After Repair Value (ARV)</td><td style="text-align:right; font-weight:700; color:#c53030">${fmt(deal.arv)}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Profitability</h2>
    <div class="grid">
      <div class="stat"><div class="stat-label">Net Profit</div><div class="stat-value ${isProfit ? 'positive' : 'negative'}">${fmt(deal.netProfit)}</div></div>
      <div class="stat"><div class="stat-label">ROI</div><div class="stat-value ${isProfit ? 'positive' : 'negative'}">${deal.roi.toFixed(1)}%</div></div>
      <div class="stat"><div class="stat-label">70% Rule MAO</div><div class="stat-value" style="font-size:15px">${fmt(deal.maxAllowableOffer)}</div></div>
      <div class="stat"><div class="stat-label">Max Price for ${deal.targetROI}% ROI</div><div class="stat-value" style="font-size:15px">${fmt(deal.recommendedMaxPrice)}</div></div>
    </div>
  </div>

  <div class="verdict-box ${verdictClass}">
    <div class="verdict-label" style="color:${verdictColor}">${deal.dealVerdict.toUpperCase().replace('_', ' ')}</div>
  </div>

  ${deal.notes ? `<div class="section" style="margin-top:24px"><h2>Notes</h2><p style="font-size:13px; color:#333">${deal.notes}</p></div>` : ''}

  <div class="footer">
    <p><strong>Freedom One Real Estate Investment System</strong></p>
    <p style="margin-top:4px">This report is for informational purposes only. All projections are estimates.</p>
  </div>
</body>
</html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.print();
}

// ─── Portfolio Stats ─────────────────────────────────────────
function PortfolioStats({ deals }: { deals: SavedDeal[] }) {
  const activeDeals = deals.filter(d => (d.status || 'active') !== 'archived');
  const totalInvested = activeDeals.reduce((s, d) => s + d.totalInvestment, 0);
  const totalProfit = activeDeals.reduce((s, d) => s + d.netProfit, 0);
  const avgROI = activeDeals.length > 0 ? activeDeals.reduce((s, d) => s + d.roi, 0) / activeDeals.length : 0;
  const avgScore = activeDeals.length > 0 ? activeDeals.reduce((s, d) => s + (d.dealScore || 0), 0) / activeDeals.length : 0;
  const profitable = activeDeals.filter(d => d.netProfit > 0).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <div className="bg-secondary/50 rounded-lg p-3 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Deals</p>
        <p className="text-xl font-bold tabular-nums">{activeDeals.length}</p>
      </div>
      <div className="bg-secondary/50 rounded-lg p-3 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Invested</p>
        <p className="text-xl font-bold tabular-nums">{fmt(totalInvested)}</p>
      </div>
      <div className="bg-secondary/50 rounded-lg p-3 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Profit</p>
        <p className={`text-xl font-bold tabular-nums ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(totalProfit)}</p>
      </div>
      <div className="bg-secondary/50 rounded-lg p-3 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Avg ROI</p>
        <p className={`text-xl font-bold tabular-nums ${avgROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>{avgROI.toFixed(1)}%</p>
      </div>
      <div className="bg-secondary/50 rounded-lg p-3 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Profitable</p>
        <p className="text-xl font-bold tabular-nums text-green-600">{profitable}/{activeDeals.length}</p>
      </div>
    </div>
  );
}

// ─── Deal Card (Grid View) ───────────────────────────────────
function DealCard({ deal, onDelete, onUpdate, selected, onToggle }: {
  deal: SavedDeal;
  onDelete: () => void;
  onUpdate: (updates: Partial<SavedDeal>) => void;
  selected: boolean;
  onToggle: () => void;
}) {
  const isProfit = deal.netProfit > 0;
  const status = deal.status || 'active';
  const StatusIcon = STATUS_CONFIG[status].icon;

  return (
    <Card className={`border transition-all ${selected ? 'border-[oklch(0.48_0.20_18)] shadow-md ring-1 ring-[oklch(0.48_0.20_18)]/30' : 'border-border/60 hover:border-border'}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <button onClick={() => onUpdate({ starred: !deal.starred })} className="shrink-0">
                {deal.starred
                  ? <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  : <StarOff className="w-3.5 h-3.5 text-muted-foreground/40 hover:text-amber-400" />
                }
              </button>
              <h3 className="font-bold text-sm truncate">{deal.address}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{deal.city}, {deal.state} {deal.zip}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {deal.dealScore != null && <ScoreBadge score={deal.dealScore} />}
            <Badge className={isProfit
              ? 'bg-green-100 text-green-700 text-[10px]'
              : 'bg-red-100 text-red-700 text-[10px]'
            }>
              {deal.dealVerdict.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Status & Date */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-3">
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${STATUS_CONFIG[status].bg} ${STATUS_CONFIG[status].color}`}>
            <StatusIcon className="w-2.5 h-2.5" />
            {STATUS_CONFIG[status].label}
          </span>
          <span>Saved {new Date(deal.savedAt).toLocaleDateString()}</span>
          <span>{deal.beds}bd / {deal.baths}ba / {deal.sqft.toLocaleString()} sqft</span>
        </div>

        {/* Financial Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-secondary/40 rounded p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Purchase</p>
            <p className="text-sm font-bold tabular-nums">{fmt(deal.purchasePrice)}</p>
          </div>
          <div className="bg-secondary/40 rounded p-2 text-center">
            <p className="text-[10px] text-muted-foreground">ARV</p>
            <p className="text-sm font-bold tabular-nums">{fmt(deal.arv)}</p>
          </div>
          <div className={`rounded p-2 text-center ${isProfit ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-[10px] text-muted-foreground">Profit</p>
            <p className={`text-sm font-bold tabular-nums ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {fmt(deal.netProfit)}
            </p>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 flex-wrap">
          <span>ROI: <strong className={isProfit ? 'text-green-600' : 'text-red-600'}>{deal.roi.toFixed(1)}%</strong></span>
          <span className="text-border">|</span>
          <span>Rehab: <strong>{fmt(deal.rehabCost)}</strong></span>
          <span className="text-border">|</span>
          <span>MAO: <strong>{fmt(deal.maxAllowableOffer)}</strong></span>
          {deal.market && (
            <>
              <span className="text-border">|</span>
              <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{deal.market}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <Button
            variant={selected ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs gap-1 h-7"
            onClick={onToggle}
          >
            <BarChart3 className="w-3 h-3" /> {selected ? 'Selected' : 'Compare'}
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1 h-7" onClick={() => exportDealPdf(deal)}>
            <Download className="w-3 h-3" />
          </Button>
          <Select value={status} onValueChange={(v) => onUpdate({ status: v as DealStatus })}>
            <SelectTrigger className="h-7 text-xs w-auto min-w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="under_contract">Under Contract</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="text-xs gap-1 h-7 text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Table View ──────────────────────────────────────────────
function DealTable({ deals, onDelete, onUpdate, selectedIds, onToggle, sortField, sortDir, onSort }: {
  deals: SavedDeal[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SavedDeal>) => void;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}) {
  const SortIcon = sortDir === 'asc' ? SortAsc : SortDesc;

  const sortHeader = (label: string, field: SortField, align: 'left' | 'right' = 'left') => (
    <th
      className={`p-2.5 font-semibold text-xs cursor-pointer hover:bg-secondary/60 select-none ${align === 'right' ? 'text-right' : 'text-left'}`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortField === field && <SortIcon className="w-3 h-3 text-[oklch(0.48_0.20_18)]" />}
      </span>
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-secondary/30 border-b border-border">
            <th className="p-2.5 w-8"></th>
            {sortHeader('Property', 'address')}
            {sortHeader('Score', 'dealScore', 'right')}
            {sortHeader('Purchase', 'purchasePrice', 'right')}
            {sortHeader('ARV', 'arv', 'right')}
            {sortHeader('Rehab', 'rehabCost', 'right')}
            {sortHeader('Profit', 'netProfit', 'right')}
            {sortHeader('ROI', 'roi', 'right')}
            <th className="p-2.5 text-xs font-semibold text-center">Status</th>
            {sortHeader('Saved', 'savedAt', 'right')}
            <th className="p-2.5 text-xs font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deals.map(deal => {
            const isProfit = deal.netProfit > 0;
            const status = deal.status || 'active';
            const StatusIcon = STATUS_CONFIG[status].icon;
            const isSelected = selectedIds.has(deal.id);

            return (
              <tr key={deal.id} className={`border-b border-border/30 hover:bg-secondary/20 ${isSelected ? 'bg-[oklch(0.48_0.20_18)]/5' : ''}`}>
                <td className="p-2.5 text-center">
                  <button onClick={() => onUpdate(deal.id, { starred: !deal.starred })}>
                    {deal.starred
                      ? <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      : <StarOff className="w-3.5 h-3.5 text-muted-foreground/30 hover:text-amber-400" />
                    }
                  </button>
                </td>
                <td className="p-2.5">
                  <div className="font-semibold text-xs">{deal.address}</div>
                  <div className="text-[10px] text-muted-foreground">{deal.city}, {deal.state} | {deal.beds}bd/{deal.baths}ba/{deal.sqft.toLocaleString()}sf</div>
                </td>
                <td className="p-2.5 text-right">{deal.dealScore != null ? <ScoreBadge score={deal.dealScore} /> : '—'}</td>
                <td className="p-2.5 text-right text-xs tabular-nums font-medium">{fmt(deal.purchasePrice)}</td>
                <td className="p-2.5 text-right text-xs tabular-nums font-medium">{fmt(deal.arv)}</td>
                <td className="p-2.5 text-right text-xs tabular-nums">{fmt(deal.rehabCost)}</td>
                <td className={`p-2.5 text-right text-xs tabular-nums font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>{fmt(deal.netProfit)}</td>
                <td className={`p-2.5 text-right text-xs tabular-nums font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>{deal.roi.toFixed(1)}%</td>
                <td className="p-2.5 text-center">
                  <Select value={status} onValueChange={(v) => onUpdate(deal.id, { status: v as DealStatus })}>
                    <SelectTrigger className="h-6 text-[10px] w-auto min-w-[80px] border-0 bg-transparent">
                      <span className={`inline-flex items-center gap-1 ${STATUS_CONFIG[status].color}`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {STATUS_CONFIG[status].label}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="under_contract">Under Contract</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2.5 text-right text-[10px] text-muted-foreground tabular-nums">{new Date(deal.savedAt).toLocaleDateString()}</td>
                <td className="p-2.5">
                  <div className="flex items-center gap-1 justify-center">
                    <Button variant={isSelected ? "default" : "ghost"} size="sm" className="h-6 w-6 p-0" onClick={() => onToggle(deal.id)}>
                      <BarChart3 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => exportDealPdf(deal)}>
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive" onClick={() => onDelete(deal.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Comparison Table ────────────────────────────────────────
function ComparisonTable({ deals }: { deals: SavedDeal[] }) {
  if (deals.length < 2) return null;

  const rows: { label: string; key: keyof SavedDeal; format?: 'currency' | 'percent' | 'number' | 'text' | 'score' }[] = [
    { label: 'Address', key: 'address', format: 'text' },
    { label: 'City/State', key: 'city', format: 'text' },
    { label: 'Sq Ft', key: 'sqft', format: 'number' },
    { label: 'Beds / Baths', key: 'beds', format: 'text' },
    { label: 'Deal Score', key: 'dealScore', format: 'score' },
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

  // Find best values for highlighting
  const bestProfit = Math.max(...deals.map(d => d.netProfit));
  const bestROI = Math.max(...deals.map(d => d.roi));

  return (
    <Card className="mt-6 border-[oklch(0.48_0.20_18)]/20">
      <CardContent className="p-4">
        <h3 className="font-bold text-base mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
          Side-by-Side Comparison ({deals.length} deals)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-2 font-semibold text-xs min-w-[140px]">Metric</th>
                {deals.map(d => (
                  <th key={d.id} className="text-right p-2 font-semibold text-xs min-w-[120px]">
                    {d.address.length > 20 ? d.address.slice(0, 20) + '...' : d.address}
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
                    } else if (row.format === 'score') {
                      value = d.dealScore != null ? `${d.dealScore}/100` : '—';
                    } else {
                      value = String(d[row.key] || '—');
                    }

                    const isBestProfit = row.key === 'netProfit' && d.netProfit === bestProfit && bestProfit > 0;
                    const isBestROI = row.key === 'roi' && d.roi === bestROI && bestROI > 0;
                    const isProfit = row.key === 'netProfit' && (d[row.key] as number) > 0;
                    const isLoss = row.key === 'netProfit' && (d[row.key] as number) <= 0;
                    const isGoodROI = row.key === 'roi' && (d[row.key] as number) > 0;
                    const isBadROI = row.key === 'roi' && (d[row.key] as number) <= 0;

                    return (
                      <td key={d.id} className={`p-2 text-right text-xs tabular-nums ${
                        isBestProfit || isBestROI ? 'text-green-600 font-bold bg-green-50' :
                        isProfit || isGoodROI ? 'text-green-600 font-bold' :
                        isLoss || isBadROI ? 'text-red-600 font-bold' : ''
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

// ─── Main Component ──────────────────────────────────────────
export default function SavedDeals() {
  const [deals, setDeals] = useState<SavedDeal[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('savedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verdictFilter, setVerdictFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showStarredOnly, setShowStarredOnly] = useState(false);

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

  const handleUpdate = (id: string, updates: Partial<SavedDeal>) => {
    const updated = updateDeal(id, updates);
    setDeals(updated);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // Filter and sort
  const filteredDeals = useMemo(() => {
    let result = [...deals];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.address.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.zip.includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(d => (d.status || 'active') === statusFilter);
    }

    // Verdict filter
    if (verdictFilter !== 'all') {
      result = result.filter(d => d.dealVerdict === verdictFilter);
    }

    // Starred only
    if (showStarredOnly) {
      result = result.filter(d => d.starred);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: number | string, bVal: number | string;
      switch (sortField) {
        case 'savedAt': aVal = a.savedAt; bVal = b.savedAt; break;
        case 'netProfit': aVal = a.netProfit; bVal = b.netProfit; break;
        case 'roi': aVal = a.roi; bVal = b.roi; break;
        case 'dealScore': aVal = a.dealScore || 0; bVal = b.dealScore || 0; break;
        case 'purchasePrice': aVal = a.purchasePrice; bVal = b.purchasePrice; break;
        case 'arv': aVal = a.arv; bVal = b.arv; break;
        case 'rehabCost': aVal = a.rehabCost; bVal = b.rehabCost; break;
        case 'address': aVal = a.address.toLowerCase(); bVal = b.address.toLowerCase(); break;
        default: aVal = a.savedAt; bVal = b.savedAt;
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [deals, search, statusFilter, verdictFilter, showStarredOnly, sortField, sortDir]);

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
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Saved Deals Dashboard</h1>
              <p className="text-sm text-[oklch(0.55_0_0)]">{deals.length} deal{deals.length !== 1 ? 's' : ''} in portfolio</p>
            </div>
          </div>
          <p className="text-[oklch(0.6_0_0)] text-sm max-w-2xl mt-3 leading-relaxed">
            Track, compare, and manage your property analyses. Sort by any metric, filter by status or verdict, 
            star your favorites, and export professional PDF reports for lenders and partners.
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
            {/* Portfolio Stats */}
            <PortfolioStats deals={deals} />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search by address, city, state, zip..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs w-auto min-w-[120px]">
                  <Filter className="w-3 h-3 mr-1" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under_contract">Under Contract</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              {/* Verdict Filter */}
              <Select value={verdictFilter} onValueChange={setVerdictFilter}>
                <SelectTrigger className="h-8 text-xs w-auto min-w-[120px]">
                  <SelectValue placeholder="Verdict" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verdicts</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="marginal">Marginal</SelectItem>
                  <SelectItem value="not_recommended">Not Recommended</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort (grid mode) */}
              {viewMode === 'grid' && (
                <Select value={`${sortField}-${sortDir}`} onValueChange={v => {
                  const [f, d] = v.split('-') as [SortField, SortDir];
                  setSortField(f);
                  setSortDir(d);
                }}>
                  <SelectTrigger className="h-8 text-xs w-auto min-w-[140px]">
                    <SortAsc className="w-3 h-3 mr-1" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savedAt-desc">Newest First</SelectItem>
                    <SelectItem value="savedAt-asc">Oldest First</SelectItem>
                    <SelectItem value="netProfit-desc">Highest Profit</SelectItem>
                    <SelectItem value="netProfit-asc">Lowest Profit</SelectItem>
                    <SelectItem value="roi-desc">Highest ROI</SelectItem>
                    <SelectItem value="roi-asc">Lowest ROI</SelectItem>
                    <SelectItem value="dealScore-desc">Best Score</SelectItem>
                    <SelectItem value="purchasePrice-asc">Lowest Price</SelectItem>
                    <SelectItem value="purchasePrice-desc">Highest Price</SelectItem>
                    <SelectItem value="address-asc">Address A-Z</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Starred Toggle */}
              <Button
                variant={showStarredOnly ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={() => setShowStarredOnly(!showStarredOnly)}
              >
                <Star className={`w-3 h-3 ${showStarredOnly ? 'fill-current' : ''}`} />
                Starred
              </Button>

              {/* View Toggle */}
              <div className="flex border border-border rounded-md overflow-hidden ml-auto">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 rounded-none px-2"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 rounded-none px-2"
                  onClick={() => setViewMode('table')}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Results count */}
            <p className="text-xs text-muted-foreground mb-3">
              Showing {filteredDeals.length} of {deals.length} deals
              {selectedIds.size > 0 && <span className="ml-2 text-[oklch(0.48_0.20_18)] font-medium">• {selectedIds.size} selected for comparison</span>}
            </p>

            {/* Grid or Table View */}
            {viewMode === 'grid' ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDeals.map(deal => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onDelete={() => handleDelete(deal.id)}
                    onUpdate={(updates) => handleUpdate(deal.id, updates)}
                    selected={selectedIds.has(deal.id)}
                    onToggle={() => toggleSelect(deal.id)}
                  />
                ))}
              </div>
            ) : (
              <DealTable
                deals={filteredDeals}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                selectedIds={selectedIds}
                onToggle={toggleSelect}
                sortField={sortField}
                sortDir={sortDir}
                onSort={handleSort}
              />
            )}

            {/* Comparison Table */}
            {selectedDeals.length >= 2 && (
              <ComparisonTable deals={selectedDeals} />
            )}

            {filteredDeals.length === 0 && deals.length > 0 && (
              <div className="text-center py-12">
                <Search className="w-8 h-8 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No deals match your current filters.</p>
                <Button variant="link" size="sm" className="mt-2" onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setVerdictFilter('all');
                  setShowStarredOnly(false);
                }}>
                  Clear all filters
                </Button>
              </div>
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
