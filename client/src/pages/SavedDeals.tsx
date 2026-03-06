import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import {
  Save, Trash2, BarChart3, MapPin, DollarSign, TrendingUp,
  ArrowRight, Calculator, AlertTriangle, Search, SortAsc, SortDesc,
  Download, Printer, FileText, Archive, Star, StarOff,
  ChevronDown, ChevronUp, Eye, Filter, LayoutGrid, LayoutList,
  CheckCircle2, Clock, XCircle, Pause, Loader2, StickyNote, Database,
  CheckSquare, Square, X, Sparkles, FileSpreadsheet, Crown, Upload
} from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Streamdown } from 'streamdown';
import { Link } from 'wouter';
import { formatCurrency } from '@/lib/calculations';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';

// ─── Types ───────────────────────────────────────────────────
type DealStatus = 'active' | 'under_contract' | 'closed' | 'passed' | 'archived';
type SortField = 'savedAt' | 'netProfit' | 'roi' | 'dealScore' | 'purchasePrice' | 'arv' | 'rehabCost' | 'address';
type SortDir = 'asc' | 'desc';
type ViewMode = 'grid' | 'table';

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
  market?: string | null;
  dealScore?: number | null;
  cashOnCash?: number;
  status: string;
  starred: boolean;
  notes?: string | null;
  dealData?: string | null;
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
    <div class="summary-card"><div class="label">Purchase Price</div><div class="value">${fmt(deal.purchasePrice)}</div></div>
    <div class="summary-card"><div class="label">After Repair Value</div><div class="value" style="color:#c53030">${fmt(deal.arv)}</div></div>
    <div class="summary-card"><div class="label">Net Profit</div><div class="value ${isProfit ? 'positive' : 'negative'}">${fmt(deal.netProfit)}</div></div>
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

// ─── localStorage Migration Helper ──────────────────────────
const LS_KEY = 'freedom-one-saved-deals';
const LS_MIGRATED_KEY = 'freedom-one-deals-migrated';

function getLocalStorageDeals(): any[] {
  try {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
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

// ─── Inline Notes Editor ────────────────────────────────────
function InlineNotes({ notes, onSave, isUpdating }: {
  notes: string | null | undefined;
  onSave: (notes: string) => void;
  isUpdating: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(notes || '');
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync draft when notes prop changes externally
  useEffect(() => {
    setDraft(notes || '');
  }, [notes]);

  const handleChange = (val: string) => {
    setDraft(val);
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSave(val);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const hasNotes = !!(notes && notes.trim());

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <StickyNote className="w-3 h-3" />
        {hasNotes ? 'View/Edit Notes' : 'Add Notes'}
        {open ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
      </button>
      {open && (
        <div className="mt-1.5 relative">
          <Textarea
            value={draft}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Add notes about this deal... (e.g., seller motivation, contractor quotes, inspection findings)"
            className="text-xs min-h-[60px] max-h-[120px] resize-y"
            disabled={isUpdating}
          />
          <div className="flex items-center justify-end mt-1 h-4">
            {saved && (
              <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> Saved
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Deal Card (Grid View) ───────────────────────────────────
function DealCard({ deal, onDelete, onUpdate, selected, onToggle, isUpdating, onAiSummary, isTeamTier }: {
  deal: SavedDeal;
  onDelete: () => void;
  onUpdate: (updates: Partial<{ status: DealStatus; starred: boolean; notes: string }>) => void;
  selected: boolean;
  onToggle: () => void;
  isUpdating: boolean;
  onAiSummary?: (deal: SavedDeal) => void;
  isTeamTier?: boolean;
}) {
  const isProfit = deal.netProfit > 0;
  const status = (deal.status || 'active') as DealStatus;
  const StatusIcon = STATUS_CONFIG[status].icon;

  return (
    <Card className={`border transition-all ${selected ? 'border-[oklch(0.48_0.20_18)] shadow-md ring-1 ring-[oklch(0.48_0.20_18)]/30' : 'border-border/60 hover:border-border'}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <button onClick={() => onUpdate({ starred: !deal.starred })} className="shrink-0" disabled={isUpdating}>
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
          {isTeamTier && onAiSummary && (
            <Button variant="outline" size="sm" className="text-xs gap-1 h-7 border-purple-500/30 text-purple-400 hover:bg-purple-500/10" onClick={() => onAiSummary(deal)} title="AI Deal Summary (Team)">
              <Sparkles className="w-3 h-3" />
            </Button>
          )}
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
          <Button variant="outline" size="sm" className="text-xs gap-1 h-7 text-destructive hover:text-destructive" onClick={onDelete} disabled={isUpdating}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        {/* Inline Notes */}
        <InlineNotes
          notes={deal.notes}
          onSave={(notes) => onUpdate({ notes })}
          isUpdating={isUpdating}
        />
      </CardContent>
    </Card>
  );
}

// ─── Table Notes (compact inline editor) ──────────────────
function TableNotes({ notes, onSave, isUpdating }: {
  notes: string | null | undefined;
  onSave: (notes: string) => void;
  isUpdating: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(notes || '');
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setDraft(notes || ''); }, [notes]);
  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  const handleChange = (val: string) => {
    setDraft(val);
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSave(val);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const hasNotes = !!(notes && notes.trim());

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className={`flex items-center gap-1 text-[10px] mx-auto ${
          hasNotes ? 'text-amber-600 hover:text-amber-700' : 'text-muted-foreground/50 hover:text-muted-foreground'
        }`}
        title={hasNotes ? notes! : 'Add notes'}
      >
        <StickyNote className="w-3 h-3" />
        {hasNotes ? 'Edit' : 'Add'}
      </button>
    );
  }

  return (
    <div className="min-w-[180px]">
      <Textarea
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Add notes..."
        className="text-[10px] min-h-[40px] max-h-[80px] resize-y"
        disabled={isUpdating}
        autoFocus
        onBlur={() => setTimeout(() => setEditing(false), 200)}
      />
      <div className="flex items-center justify-between mt-0.5">
        <button onClick={() => setEditing(false)} className="text-[9px] text-muted-foreground hover:text-foreground">Close</button>
        {saved && <span className="text-[9px] text-green-600 flex items-center gap-0.5"><CheckCircle2 className="w-2 h-2" /> Saved</span>}
      </div>
    </div>
  );
}

// ─── Table View ──────────────────────────────────────────────
function DealTable({ deals, onDelete, onUpdate, selectedIds, onToggle, sortField, sortDir, onSort, isUpdating }: {
  deals: SavedDeal[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<{ status: DealStatus; starred: boolean; notes: string }>) => void;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
  isUpdating: boolean;
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
            {sortHeader('Purchase', 'purchasePrice', 'right')}
            {sortHeader('ARV', 'arv', 'right')}
            {sortHeader('Rehab', 'rehabCost', 'right')}
            {sortHeader('Profit', 'netProfit', 'right')}
            {sortHeader('ROI', 'roi', 'right')}
            {sortHeader('Score', 'dealScore', 'right')}
            <th className="p-2.5 font-semibold text-xs text-center">Status</th>
            <th className="p-2.5 font-semibold text-xs text-center">Notes</th>
            <th className="p-2.5 font-semibold text-xs text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deals.map(deal => {
            const isProfit = deal.netProfit > 0;
            const status = (deal.status || 'active') as DealStatus;
            const StatusIcon = STATUS_CONFIG[status].icon;
            const isSelected = selectedIds.has(deal.id);

            return (
              <tr key={deal.id} className={`border-b border-border/30 hover:bg-secondary/20 ${isSelected ? 'bg-[oklch(0.48_0.20_18)]/5' : ''}`}>
                <td className="p-2">
                  <button onClick={() => onUpdate(deal.id, { starred: !deal.starred })} disabled={isUpdating}>
                    {deal.starred
                      ? <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      : <StarOff className="w-3.5 h-3.5 text-muted-foreground/30 hover:text-amber-400" />
                    }
                  </button>
                </td>
                <td className="p-2">
                  <div className="font-semibold text-xs">{deal.address}</div>
                  <div className="text-[10px] text-muted-foreground">{deal.city}, {deal.state} {deal.zip}</div>
                </td>
                <td className="p-2 text-right tabular-nums text-xs">{fmt(deal.purchasePrice)}</td>
                <td className="p-2 text-right tabular-nums text-xs font-semibold" style={{ color: '#c53030' }}>{fmt(deal.arv)}</td>
                <td className="p-2 text-right tabular-nums text-xs">{fmt(deal.rehabCost)}</td>
                <td className={`p-2 text-right tabular-nums text-xs font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>{fmt(deal.netProfit)}</td>
                <td className={`p-2 text-right tabular-nums text-xs font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>{deal.roi.toFixed(1)}%</td>
                <td className="p-2 text-right">{deal.dealScore != null && <ScoreBadge score={deal.dealScore} />}</td>
                <td className="p-2 text-center">
                  <Select value={status} onValueChange={(v) => onUpdate(deal.id, { status: v as DealStatus })}>
                    <SelectTrigger className="h-6 text-[10px] w-auto min-w-[80px]">
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
                </td>
                <td className="p-2">
                  <TableNotes
                    notes={deal.notes}
                    onSave={(notes) => onUpdate(deal.id, { notes })}
                    isUpdating={isUpdating}
                  />
                </td>
                <td className="p-2">
                  <div className="flex gap-1 justify-center">
                    <Button variant={isSelected ? "default" : "outline"} size="sm" className="h-6 w-6 p-0" onClick={() => onToggle(deal.id)}>
                      <BarChart3 className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => exportDealPdf(deal)}>
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive" onClick={() => onDelete(deal.id)} disabled={isUpdating}>
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
  const rows: { label: string; key: keyof SavedDeal; format?: string }[] = [
    { label: 'Location', key: 'city' },
    { label: 'Purchase Price', key: 'purchasePrice', format: 'currency' },
    { label: 'ARV', key: 'arv', format: 'currency' },
    { label: 'Rehab Cost', key: 'rehabCost', format: 'currency' },
    { label: 'Total Investment', key: 'totalInvestment', format: 'currency' },
    { label: 'Net Profit', key: 'netProfit', format: 'currency' },
    { label: 'ROI', key: 'roi', format: 'percent' },
    { label: 'Deal Score', key: 'dealScore', format: 'score' },
    { label: 'Beds / Baths', key: 'beds' },
    { label: 'Sqft', key: 'sqft', format: 'number' },
    { label: 'Year Built', key: 'yearBuilt', format: 'number' },
    { label: '70% MAO', key: 'maxAllowableOffer', format: 'currency' },
  ];

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
  const utils = trpc.useUtils();
  const { user, isAuthenticated } = useAuth();
  const { data: deals = [], isLoading, error } = trpc.deals.list.useQuery();
  const { data: subStatus } = trpc.subscription.status.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [aiSummaryDeal, setAiSummaryDeal] = useState<SavedDeal | null>(null);
  const [aiSummaryText, setAiSummaryText] = useState<string>('');

  const isAdmin = user?.role === 'admin';
  const isTeamTier = isAdmin || subStatus?.plan === 'team';

  const aiSummary = trpc.teamFeatures.aiDealSummary.useMutation({
    onSuccess: (data) => {
      setAiSummaryText(data.summary);
    },
    onError: (err) => toast.error(err.message),
  });

  const bulkExport = trpc.teamFeatures.bulkExport.useMutation({
    onSuccess: (data) => {
      const blob = new Blob([data.csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `freedom-one-deals-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${data.count} deals to CSV.`);
    },
    onError: (err) => toast.error(err.message),
  });

  // ─── CSV Import (Team Tier) ─────────────────────────────────
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importCsvContent, setImportCsvContent] = useState('');
  const [importPreview, setImportPreview] = useState<string[][]>([]);
  const [importFileName, setImportFileName] = useState('');
  const csvFileRef = useRef<HTMLInputElement>(null);

  const csvImport = trpc.teamFeatures.csvImport.useMutation({
    onSuccess: (data) => {
      utils.deals.list.invalidate();
      utils.deals.portfolio.invalidate();
      setShowImportDialog(false);
      setImportCsvContent('');
      setImportPreview([]);
      setImportFileName('');
      const failed = data.results.filter(r => !r.success);
      if (failed.length > 0) {
        toast.success(`Imported ${data.imported} of ${data.total} deals. ${failed.length} failed.`);
      } else {
        toast.success(`Successfully imported ${data.imported} deals!`);
      }
    },
    onError: (err) => toast.error(`Import failed: ${err.message}`),
  });

  const csvTemplate = trpc.teamFeatures.csvTemplate.useQuery(undefined, {
    enabled: showImportDialog,
  });

  const handleCsvFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast.error('Please select a CSV file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum 5MB.');
      return;
    }
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setImportCsvContent(text);
      // Parse preview (first 6 rows)
      const lines = text.split('\n').filter(l => l.trim()).slice(0, 6);
      const preview = lines.map(line => {
        const cols: string[] = [];
        let current = '';
        let inQ = false;
        for (const ch of line) {
          if (inQ) {
            if (ch === '"') inQ = false;
            else current += ch;
          } else {
            if (ch === '"') inQ = true;
            else if (ch === ',') { cols.push(current.trim()); current = ''; }
            else current += ch;
          }
        }
        cols.push(current.trim());
        return cols;
      });
      setImportPreview(preview);
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    if (!csvTemplate.data) return;
    const blob = new Blob([csvTemplate.data.csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'freedom-one-deal-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('savedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verdictFilter, setVerdictFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [migrating, setMigrating] = useState(false);

  // ─── Mutations ─────────────────────────────────────────────
  const updateDeal = trpc.deals.update.useMutation({
    onSuccess: () => {
      utils.deals.list.invalidate();
      utils.deals.portfolio.invalidate();
    },
    onError: (err) => toast.error(`Update failed: ${err.message}`),
  });

  const deleteDeal = trpc.deals.delete.useMutation({
    onSuccess: () => {
      utils.deals.list.invalidate();
      utils.deals.portfolio.invalidate();
      toast.success('Deal deleted.');
    },
    onError: (err) => toast.error(`Delete failed: ${err.message}`),
  });

  const bulkUpdateStatus = trpc.deals.bulkUpdateStatus.useMutation({
    onSuccess: (data) => {
      utils.deals.list.invalidate();
      utils.deals.portfolio.invalidate();
      setSelectedIds(new Set());
      toast.success(`Updated ${data.count} deal${data.count !== 1 ? 's' : ''}.`);
    },
    onError: (err) => toast.error(`Bulk update failed: ${err.message}`),
  });

  const bulkDelete = trpc.deals.bulkDelete.useMutation({
    onSuccess: (data) => {
      utils.deals.list.invalidate();
      utils.deals.portfolio.invalidate();
      setSelectedIds(new Set());
      toast.success(`Deleted ${data.count} deal${data.count !== 1 ? 's' : ''}.`);
    },
    onError: (err) => toast.error(`Bulk delete failed: ${err.message}`),
  });

  const saveDeal = trpc.deals.save.useMutation({
    onError: (err) => toast.error(`Migration failed for a deal: ${err.message}`),
  });

  // ─── localStorage Migration ────────────────────────────────
  const migrateLocalStorage = async () => {
    const localDeals = getLocalStorageDeals();
    if (localDeals.length === 0) {
      toast.info('No local deals to migrate.');
      return;
    }

    setMigrating(true);
    let migrated = 0;
    let failed = 0;

    for (const deal of localDeals) {
      try {
        await saveDeal.mutateAsync({
          uniqueId: deal.id || nanoid(),
          address: deal.address || 'Unknown Address',
          city: deal.city || 'Unknown',
          state: deal.state || 'XX',
          zip: deal.zip || '00000',
          purchasePrice: deal.purchasePrice || 0,
          arv: deal.arv || 0,
          rehabCost: deal.rehabCost || 0,
          totalInvestment: deal.totalInvestment || 0,
          netProfit: deal.netProfit || 0,
          roi: deal.roi || 0,
          dealVerdict: deal.dealVerdict || 'poor',
          maxAllowableOffer: deal.maxAllowableOffer || 0,
          recommendedMaxPrice: deal.recommendedMaxPrice || 0,
          targetROI: deal.targetROI || 15,
          sqft: deal.sqft || 0,
          beds: deal.beds || 0,
          baths: deal.baths || 0,
          yearBuilt: deal.yearBuilt || 0,
          market: deal.market || undefined,
          dealScore: deal.dealScore || undefined,
          cashOnCash: deal.cashOnCash || undefined,
          status: deal.status || 'active',
          starred: deal.starred || false,
          notes: deal.notes || '',
        });
        migrated++;
      } catch {
        failed++;
      }
    }

    await utils.deals.list.invalidate();
    await utils.deals.portfolio.invalidate();
    setMigrating(false);

    if (failed === 0) {
      // All succeeded — clear localStorage
      localStorage.setItem(LS_MIGRATED_KEY, 'true');
      localStorage.removeItem(LS_KEY);
      toast.success(`Successfully migrated ${migrated} deal${migrated !== 1 ? 's' : ''} to the cloud database!`);
    } else if (migrated > 0) {
      toast.warning(`Migrated ${migrated} deals, ${failed} failed. Retry to migrate remaining deals.`);
    } else {
      toast.error(`Migration failed for all ${failed} deals. Please try again.`);
    }
  };

  // Check if there are local deals to migrate
  const hasLocalDeals = useMemo(() => {
    const migrated = localStorage.getItem(LS_MIGRATED_KEY);
    if (migrated === 'true') return false;
    return getLocalStorageDeals().length > 0;
  }, []);
  const localDealCount = useMemo(() => getLocalStorageDeals().length, []);

  // ─── Handlers ──────────────────────────────────────────────
  const handleDelete = (id: string) => {
    deleteDeal.mutate({ uniqueId: id });
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleUpdate = (id: string, updates: Partial<{ status: DealStatus; starred: boolean; notes: string }>) => {
    updateDeal.mutate({ uniqueId: id, ...updates });
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

  // ─── Bulk Actions ─────────────────────────────────────────
  const handleSelectAll = () => {
    if (selectedIds.size === filteredDeals.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDeals.map(d => d.id)));
    }
  };

  const handleBulkStatusChange = (status: DealStatus) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    bulkUpdateStatus.mutate({ uniqueIds: ids, status });
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${ids.length} deal${ids.length !== 1 ? 's' : ''}? This cannot be undone.`)) return;
    bulkDelete.mutate({ uniqueIds: ids });
  };

  const handleCsvExport = () => {
    const dealsToExport = selectedIds.size > 0
      ? filteredDeals.filter(d => selectedIds.has(d.id))
      : filteredDeals;

    if (dealsToExport.length === 0) {
      toast.error('No deals to export.');
      return;
    }

    const headers = [
      'Address', 'City', 'State', 'Zip', 'Purchase Price', 'ARV', 'Rehab Cost',
      'Total Investment', 'Net Profit', 'ROI %', 'Deal Score', 'Verdict',
      'Status', 'Starred', 'Sqft', 'Beds', 'Baths', 'Year Built', 'Market',
      'Cash-on-Cash %', 'MAO', 'Recommended Max Price', 'Target ROI %', 'Saved Date', 'Notes'
    ];

    const rows = dealsToExport.map(d => [
      d.address, d.city, d.state, d.zip,
      d.purchasePrice, d.arv, d.rehabCost, d.totalInvestment,
      d.netProfit, d.roi.toFixed(2), d.dealScore || '', d.dealVerdict,
      d.status, d.starred ? 'Yes' : 'No',
      d.sqft, d.beds, d.baths, d.yearBuilt, d.market || '',
      d.cashOnCash?.toFixed(2) || '', d.maxAllowableOffer, d.recommendedMaxPrice,
      d.targetROI, new Date(d.savedAt).toLocaleDateString(),
      (d.notes || '').replace(/[\n\r,]/g, ' ')
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saved-deals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${dealsToExport.length} deal${dealsToExport.length !== 1 ? 's' : ''} to CSV.`);
  };

  // ─── Filter and Sort ──────────────────────────────────────
  const filteredDeals = useMemo(() => {
    let result = [...deals] as SavedDeal[];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.address.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.zip.includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(d => (d.status || 'active') === statusFilter);
    }

    if (verdictFilter !== 'all') {
      result = result.filter(d => d.dealVerdict === verdictFilter);
    }

    if (showStarredOnly) {
      result = result.filter(d => d.starred);
    }

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

  const selectedDeals = (deals as SavedDeal[]).filter(d => selectedIds.has(d.id));
  const isUpdating = updateDeal.isPending || deleteDeal.isPending;

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
              <p className="text-sm text-[oklch(0.55_0_0)]">
                {isLoading ? 'Loading...' : `${deals.length} deal${deals.length !== 1 ? 's' : ''} in portfolio`}
              </p>
            </div>
          </div>
          <p className="text-[oklch(0.6_0_0)] text-sm max-w-2xl mt-3 leading-relaxed">
            Track, compare, and manage your property analyses. Sort by any metric, filter by status or verdict, 
            star your favorites, and export professional PDF reports for lenders and partners. 
            All deals are stored securely in the cloud — accessible from any device.
          </p>
        </div>
      </section>

      <section className="container py-8">
        {/* Migration Banner */}
        {hasLocalDeals && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
            <Database className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                {localDealCount} deal{localDealCount !== 1 ? 's' : ''} found in local browser storage
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Migrate them to the cloud database so they appear in your Portfolio Dashboard, are backed up, and accessible from any device.
              </p>
            </div>
            <Button
              onClick={migrateLocalStorage}
              disabled={migrating}
              className="gap-2 bg-amber-600 hover:bg-amber-700 text-white shrink-0"
              size="sm"
            >
              {migrating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
              {migrating ? 'Migrating...' : 'Migrate to Cloud'}
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading your saved deals...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-red-500" />
            <p className="text-sm text-red-600">Failed to load deals: {error.message}</p>
          </div>
        ) : deals.length === 0 ? (
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
            <PortfolioStats deals={deals as SavedDeal[]} />

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
              <div className="mb-3 p-3 bg-[oklch(0.48_0.20_18)]/10 border border-[oklch(0.48_0.20_18)]/30 rounded-lg flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 mr-2">
                  <CheckSquare className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
                  <span className="text-sm font-semibold text-[oklch(0.48_0.20_18)]">
                    {selectedIds.size} deal{selectedIds.size !== 1 ? 's' : ''} selected
                  </span>
                </div>

                <div className="h-5 w-px bg-border" />

                {/* Bulk Status Change */}
                <Select onValueChange={(v) => handleBulkStatusChange(v as DealStatus)}>
                  <SelectTrigger className="h-7 text-xs w-auto min-w-[140px] bg-background">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Set Active</SelectItem>
                    <SelectItem value="under_contract">Set Under Contract</SelectItem>
                    <SelectItem value="closed">Set Closed</SelectItem>
                    <SelectItem value="passed">Set Passed</SelectItem>
                    <SelectItem value="archived">Set Archived</SelectItem>
                  </SelectContent>
                </Select>

                {/* Compare Selected (Team tier) */}
                {isTeamTier && selectedIds.size >= 2 && selectedIds.size <= 6 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 bg-background text-[oklch(0.48_0.20_18)] border-[oklch(0.48_0.20_18)]/40 hover:bg-[oklch(0.48_0.20_18)]/10"
                    onClick={() => {
                      const ids = Array.from(selectedIds).join(',');
                      window.location.href = `/compare?ids=${ids}`;
                    }}
                  >
                    <BarChart3 className="w-3 h-3" /> Compare ({selectedIds.size})
                  </Button>
                )}
                {/* CSV Export */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1 bg-background"
                  onClick={handleCsvExport}
                >
                  <Download className="w-3 h-3" /> Export CSV
                </Button>

                {/* Bulk Delete */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1 bg-background text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleBulkDelete}
                  disabled={bulkDelete.isPending}
                >
                  {bulkDelete.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  Delete Selected
                </Button>

                {/* Clear Selection */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1 ml-auto"
                  onClick={() => setSelectedIds(new Set())}
                >
                  <X className="w-3 h-3" /> Clear
                </Button>
              </div>
            )}

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

              {/* Select All */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={handleSelectAll}
              >
                {selectedIds.size === filteredDeals.length && filteredDeals.length > 0
                  ? <CheckSquare className="w-3 h-3" />
                  : <Square className="w-3 h-3" />}
                {selectedIds.size === filteredDeals.length && filteredDeals.length > 0 ? 'Deselect All' : 'Select All'}
              </Button>

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

              {/* CSV Export */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={handleCsvExport}
              >
                <Download className="w-3 h-3" /> Export CSV
              </Button>

              {/* Team Tier: Full Database Export */}
              {isTeamTier && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => bulkExport.mutate()}
                  disabled={bulkExport.isPending}
                >
                  {bulkExport.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileSpreadsheet className="w-3 h-3" />}
                  Full DB Export
                  <Crown className="w-2.5 h-2.5 text-amber-400" />
                </Button>
              )}

              {/* Team Tier: CSV Import */}
              {isTeamTier && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => setShowImportDialog(true)}
                >
                  <Upload className="w-3 h-3" />
                  Import CSV
                  <Crown className="w-2.5 h-2.5 text-amber-400" />
                </Button>
              )}

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
                    onUpdate={(updates) => handleUpdate(deal.id, updates as any)}
                    selected={selectedIds.has(deal.id)}
                    onToggle={() => toggleSelect(deal.id)}
                    isUpdating={isUpdating}
                    isTeamTier={isTeamTier}
                    onAiSummary={(d) => {
                      setAiSummaryDeal(d);
                      setAiSummaryText('');
                      aiSummary.mutate({
                        address: d.address,
                        city: d.city,
                        state: d.state,
                        purchasePrice: d.purchasePrice,
                        arv: d.arv,
                        rehabCost: d.rehabCost,
                        netProfit: d.netProfit,
                        roi: d.roi,
                        dealScore: d.dealScore ?? undefined,
                        sqft: d.sqft,
                        beds: d.beds,
                        baths: d.baths,
                        yearBuilt: d.yearBuilt,
                        market: d.market ?? undefined,
                      });
                    }}
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
                isUpdating={isUpdating}
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
            <strong>Disclaimer:</strong> All deals are stored securely in the cloud database and are accessible from any device. 
            All calculations are estimates and should not be relied upon 
            as the sole basis for investment decisions. Always perform your own due diligence and consult with qualified professionals.
          </p>
        </div>
      </section>

      {/* AI Deal Summary Dialog (Team Tier) */}
      <Dialog open={!!aiSummaryDeal} onOpenChange={(open) => { if (!open) setAiSummaryDeal(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Deal Summary
              <Badge className="bg-purple-100 text-purple-700 text-[10px]">Team Exclusive</Badge>
            </DialogTitle>
            <DialogDescription>
              {aiSummaryDeal ? `${aiSummaryDeal.address}, ${aiSummaryDeal.city}, ${aiSummaryDeal.state}` : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            {aiSummary.isPending ? (
              <div className="flex items-center justify-center py-12 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                <span className="text-sm text-muted-foreground">Generating AI analysis...</span>
              </div>
            ) : aiSummaryText ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <Streamdown>{aiSummaryText}</Streamdown>
              </div>
            ) : null}
          </div>
          {aiSummaryText && (
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => {
                  navigator.clipboard.writeText(aiSummaryText);
                  toast.success('Summary copied to clipboard');
                }}
              >
                <FileText className="w-3.5 h-3.5" /> Copy to Clipboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => {
                  const blob = new Blob([aiSummaryText], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `deal-summary-${aiSummaryDeal?.address?.replace(/\s+/g, '-').toLowerCase() || 'deal'}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success('Summary downloaded');
                }}
              >
                <Download className="w-3.5 h-3.5" /> Download
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-500" />
              Import Deals from CSV
              <Crown className="w-4 h-4 text-amber-400" />
            </DialogTitle>
            <DialogDescription>
              Upload a CSV file to bulk-import deals into your portfolio. Each row becomes a saved deal with automatic profit calculations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Template Download */}
            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <p className="text-sm font-medium mb-1">Need a template?</p>
              <p className="text-xs text-muted-foreground mb-2">
                Download our CSV template with the correct column headers and sample data.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
                onClick={handleDownloadTemplate}
                disabled={!csvTemplate.data}
              >
                <Download className="w-3 h-3" /> Download Template
              </Button>
            </div>

            {/* Required Columns Info */}
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="text-xs font-semibold mb-1">Required Columns</p>
              <p className="text-xs text-muted-foreground">
                Address, City, State, Zip, Purchase Price, ARV, Rehab Cost
              </p>
              <p className="text-xs font-semibold mt-2 mb-1">Optional Columns</p>
              <p className="text-xs text-muted-foreground">
                Sqft, Beds, Baths, Year Built, Market, Status, Notes
              </p>
            </div>

            {/* File Upload */}
            <div>
              <input
                ref={csvFileRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleCsvFileSelect}
              />
              <Button
                variant="outline"
                className="w-full h-24 border-dashed border-2 gap-2 text-muted-foreground hover:text-foreground hover:border-emerald-500/50"
                onClick={() => csvFileRef.current?.click()}
              >
                <Upload className="w-5 h-5" />
                <div className="text-center">
                  <p className="font-medium">{importFileName || 'Click to select CSV file'}</p>
                  <p className="text-xs">Maximum 5MB, .csv or .txt format</p>
                </div>
              </Button>
            </div>

            {/* Preview Table */}
            {importPreview.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">Preview (first {Math.min(importPreview.length - 1, 5)} rows)</p>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-secondary/50">
                        {importPreview[0]?.map((h, i) => (
                          <th key={i} className="px-2 py-1.5 text-left font-semibold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.slice(1).map((row, ri) => (
                        <tr key={ri} className="border-t border-border/50">
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-2 py-1 whitespace-nowrap max-w-[150px] truncate">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {importCsvContent.split('\n').filter(l => l.trim()).length - 1} total data rows detected
                </p>
              </div>
            )}

            {/* Import Button */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImportDialog(false);
                  setImportCsvContent('');
                  setImportPreview([]);
                  setImportFileName('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!importCsvContent || csvImport.isPending}
                onClick={() => csvImport.mutate({ csvContent: importCsvContent })}
              >
                {csvImport.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Importing...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Import Deals</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
