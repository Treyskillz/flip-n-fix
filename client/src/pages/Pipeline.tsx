import { useState, useRef, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Plus, GripVertical, MapPin, DollarSign, TrendingUp,
  Clock, ArrowRight, Trash2, Edit, Eye, ChevronDown,
  ChevronUp, BarChart3, Users, FileText, Target,
  Building2, AlertCircle, CheckCircle2, XCircle,
  Layers, Import, Search, Upload
} from 'lucide-react';
import CsvImportDialog from '@/components/CsvImport';

// ─── Stage Configuration ──────────────────────────────────
const STAGES = [
  { id: 'lead', label: 'Lead', color: 'oklch(0.65 0.15 250)', bgColor: 'oklch(0.65 0.15 250 / 0.12)', icon: Target },
  { id: 'analyzing', label: 'Analyzing', color: 'oklch(0.65 0.15 60)', bgColor: 'oklch(0.65 0.15 60 / 0.12)', icon: Search },
  { id: 'offer_submitted', label: 'Offer Sent', color: 'oklch(0.65 0.18 40)', bgColor: 'oklch(0.65 0.18 40 / 0.12)', icon: FileText },
  { id: 'under_contract', label: 'Under Contract', color: 'oklch(0.65 0.18 18)', bgColor: 'oklch(0.65 0.18 18 / 0.12)', icon: CheckCircle2 },
  { id: 'closing', label: 'Closing', color: 'oklch(0.65 0.15 310)', bgColor: 'oklch(0.65 0.15 310 / 0.12)', icon: Building2 },
  { id: 'rehab', label: 'Rehab', color: 'oklch(0.65 0.18 80)', bgColor: 'oklch(0.65 0.18 80 / 0.12)', icon: Layers },
  { id: 'listed', label: 'Listed', color: 'oklch(0.65 0.15 180)', bgColor: 'oklch(0.65 0.15 180 / 0.12)', icon: Building2 },
  { id: 'sold', label: 'Sold', color: 'oklch(0.65 0.18 145)', bgColor: 'oklch(0.65 0.18 145 / 0.12)', icon: CheckCircle2 },
  { id: 'dead', label: 'Dead', color: 'oklch(0.50 0 0)', bgColor: 'oklch(0.50 0 0 / 0.12)', icon: XCircle },
] as const;

type StageId = typeof STAGES[number]['id'];

const fmt = (n: number | null | undefined) => {
  if (n == null) return '—';
  return '$' + n.toLocaleString();
};

const daysSince = (date: Date | string | null | undefined) => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
};

// ─── Deal Card ────────────────────────────────────────────
interface DealCardProps {
  deal: any;
  onView: (deal: any) => void;
  onDragStart: (e: React.DragEvent, dealId: number) => void;
}

function DealCard({ deal, onView, onDragStart }: DealCardProps) {
  const daysInStage = daysSince(deal.stageEnteredAt);
  const tags = deal.tags ? JSON.parse(deal.tags) : [];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      className="bg-[oklch(0.18_0_0)] border border-[oklch(0.28_0_0)] rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-[oklch(0.4_0_0)] transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{deal.propertyAddress}</p>
          {deal.city && (
            <p className="text-xs text-[oklch(0.5_0_0)] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {deal.city}{deal.state ? `, ${deal.state}` : ''} {deal.zip || ''}
            </p>
          )}
        </div>
        <button
          onClick={() => onView(deal)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all"
        >
          <Eye className="w-3.5 h-3.5 text-[oklch(0.6_0_0)]" />
        </button>
      </div>

      {/* Financial summary */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-2">
        {deal.purchasePrice && (
          <div>
            <span className="text-[oklch(0.45_0_0)]">Price: </span>
            <span className="text-[oklch(0.7_0_0)]">{fmt(deal.purchasePrice)}</span>
          </div>
        )}
        {deal.arv && (
          <div>
            <span className="text-[oklch(0.45_0_0)]">ARV: </span>
            <span className="text-[oklch(0.7_0_0)]">{fmt(deal.arv)}</span>
          </div>
        )}
        {deal.estimatedProfit != null && (
          <div className="col-span-2">
            <span className="text-[oklch(0.45_0_0)]">Est. Profit: </span>
            <span className={`font-medium ${deal.estimatedProfit > 0 ? 'text-[oklch(0.65_0.18_145)]' : 'text-[oklch(0.65_0.18_18)]'}`}>
              {fmt(deal.estimatedProfit)}
            </span>
          </div>
        )}
      </div>

      {/* Tags and days */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {tags.slice(0, 2).map((tag: string) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[oklch(0.25_0_0)] text-[oklch(0.6_0_0)]">
              {tag}
            </span>
          ))}
          {deal.dealScore && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
              deal.dealScore >= 80 ? 'bg-[oklch(0.65_0.18_145/0.15)] text-[oklch(0.65_0.18_145)]' :
              deal.dealScore >= 60 ? 'bg-[oklch(0.65_0.15_60/0.15)] text-[oklch(0.65_0.15_60)]' :
              'bg-[oklch(0.65_0.18_18/0.15)] text-[oklch(0.65_0.18_18)]'
            }`}>
              Score: {deal.dealScore}
            </span>
          )}
        </div>
        {daysInStage != null && (
          <span className={`text-[10px] flex items-center gap-0.5 ${
            daysInStage > 30 ? 'text-[oklch(0.65_0.18_18)]' :
            daysInStage > 14 ? 'text-[oklch(0.65_0.15_60)]' :
            'text-[oklch(0.5_0_0)]'
          }`}>
            <Clock className="w-3 h-3" /> {daysInStage}d
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Stage Column ─────────────────────────────────────────
interface StageColumnProps {
  stage: typeof STAGES[number];
  deals: any[];
  onView: (deal: any) => void;
  onDragStart: (e: React.DragEvent, dealId: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, stageId: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

function StageColumn({ stage, deals, onView, onDragStart, onDragOver, onDrop, collapsed, onToggle }: StageColumnProps) {
  const Icon = stage.icon;
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`flex flex-col rounded-lg border transition-colors ${
        dragOver ? 'border-[oklch(0.48_0.20_18)] bg-[oklch(0.48_0.20_18/0.05)]' : 'border-[oklch(0.25_0_0)] bg-[oklch(0.13_0_0)]'
      } ${collapsed ? 'w-12' : 'min-w-[260px] w-[260px]'}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); onDragOver(e); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { setDragOver(false); onDrop(e, stage.id); }}
    >
      {/* Column header */}
      <div
        className={`flex items-center gap-2 p-3 border-b border-[oklch(0.25_0_0)] cursor-pointer ${collapsed ? 'justify-center' : ''}`}
        onClick={onToggle}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-1">
            <Icon className="w-4 h-4" style={{ color: stage.color }} />
            <span className="text-[10px] font-medium text-[oklch(0.6_0_0)] [writing-mode:vertical-lr]">{stage.label}</span>
            <span className="text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ backgroundColor: stage.bgColor, color: stage.color }}>
              {deals.length}
            </span>
          </div>
        ) : (
          <>
            <Icon className="w-4 h-4 shrink-0" style={{ color: stage.color }} />
            <span className="text-xs font-semibold text-white flex-1">{stage.label}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: stage.bgColor, color: stage.color }}>
              {deals.length}
            </span>
          </>
        )}
      </div>

      {/* Cards */}
      {!collapsed && (
        <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
          {deals.length === 0 && (
            <p className="text-xs text-[oklch(0.4_0_0)] text-center py-6">
              Drop deals here
            </p>
          )}
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} onView={onView} onDragStart={onDragStart} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Add Deal Dialog ──────────────────────────────────────
function AddDealDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    propertyAddress: '',
    city: '',
    state: '',
    zip: '',
    stage: 'lead' as StageId,
    purchasePrice: '',
    arv: '',
    rehabCost: '',
    estimatedProfit: '',
    tags: '',
    notes: '',
  });

  const createDeal = trpc.pipeline.createDeal.useMutation({
    onSuccess: () => {
      toast.success('Deal added to pipeline');
      onCreated();
      onClose();
      setForm({ propertyAddress: '', city: '', state: '', zip: '', stage: 'lead', purchasePrice: '', arv: '', rehabCost: '', estimatedProfit: '', tags: '', notes: '' });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = () => {
    if (!form.propertyAddress.trim()) { toast.error('Property address is required'); return; }
    createDeal.mutate({
      propertyAddress: form.propertyAddress,
      city: form.city || undefined,
      state: form.state || undefined,
      zip: form.zip || undefined,
      stage: form.stage,
      purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : undefined,
      arv: form.arv ? Number(form.arv) : undefined,
      rehabCost: form.rehabCost ? Number(form.rehabCost) : undefined,
      estimatedProfit: form.estimatedProfit ? Number(form.estimatedProfit) : undefined,
      tags: form.tags ? JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)) : undefined,
      notes: form.notes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[oklch(0.16_0_0)] border-[oklch(0.3_0_0)] text-white">
        <DialogHeader>
          <DialogTitle>Add Deal to Pipeline</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Property Address *</Label>
            <Input value={form.propertyAddress} onChange={e => setForm(f => ({ ...f, propertyAddress: e.target.value }))} placeholder="123 Main St" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-[oklch(0.6_0_0)]">City</Label>
              <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
            </div>
            <div>
              <Label className="text-xs text-[oklch(0.6_0_0)]">State</Label>
              <Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="CA" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
            </div>
            <div>
              <Label className="text-xs text-[oklch(0.6_0_0)]">ZIP</Label>
              <Input value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} placeholder="90210" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Stage</Label>
            <Select value={form.stage} onValueChange={v => setForm(f => ({ ...f, stage: v as StageId }))}>
              <SelectTrigger className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-[oklch(0.6_0_0)]">Purchase Price</Label>
              <Input type="number" value={form.purchasePrice} onChange={e => setForm(f => ({ ...f, purchasePrice: e.target.value }))} placeholder="250000" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
            </div>
            <div>
              <Label className="text-xs text-[oklch(0.6_0_0)]">ARV</Label>
              <Input type="number" value={form.arv} onChange={e => setForm(f => ({ ...f, arv: e.target.value }))} placeholder="350000" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
            </div>
            <div>
              <Label className="text-xs text-[oklch(0.6_0_0)]">Rehab Cost</Label>
              <Input type="number" value={form.rehabCost} onChange={e => setForm(f => ({ ...f, rehabCost: e.target.value }))} placeholder="50000" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
            </div>
            <div>
              <Label className="text-xs text-[oklch(0.6_0_0)]">Est. Profit</Label>
              <Input type="number" value={form.estimatedProfit} onChange={e => setForm(f => ({ ...f, estimatedProfit: e.target.value }))} placeholder="40000" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Tags (comma-separated)</Label>
            <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="flip, wholesale, BRRRR" className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
          </div>
          <div>
            <Label className="text-xs text-[oklch(0.6_0_0)]">Notes</Label>
            <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional notes..." rows={2} className="bg-[oklch(0.12_0_0)] border-[oklch(0.3_0_0)] text-white" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)]">Cancel</Button>
          <Button onClick={handleSubmit} disabled={createDeal.isPending} className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
            {createDeal.isPending ? 'Adding...' : 'Add Deal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Import from Saved Deals Dialog ───────────────────────
function ImportDialog({ open, onClose, onImported }: { open: boolean; onClose: () => void; onImported: () => void }) {
  const savedDeals = trpc.deals.list.useQuery(undefined, { enabled: open });
  const importDeal = trpc.pipeline.importFromSavedDeal.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Deal imported to pipeline');
        onImported();
      } else {
        toast.error('Failed to import deal');
      }
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[oklch(0.16_0_0)] border-[oklch(0.3_0_0)] text-white">
        <DialogHeader>
          <DialogTitle>Import from Saved Deals</DialogTitle>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto space-y-2">
          {savedDeals.isLoading && <p className="text-sm text-[oklch(0.5_0_0)] text-center py-4">Loading saved deals...</p>}
          {savedDeals.data?.length === 0 && <p className="text-sm text-[oklch(0.5_0_0)] text-center py-4">No saved deals found. Analyze a deal first.</p>}
          {savedDeals.data?.map((deal: any) => (
            <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg bg-[oklch(0.12_0_0)] border border-[oklch(0.25_0_0)] hover:border-[oklch(0.35_0_0)] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{deal.address}</p>
                <p className="text-xs text-[oklch(0.5_0_0)]">
                  {deal.city}, {deal.state} | {fmt(deal.purchasePrice)} | Profit: {fmt(deal.netProfit)}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => importDeal.mutate({ savedDealId: deal.id })}
                disabled={importDeal.isPending}
                className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white text-xs ml-2"
              >
                <Import className="w-3 h-3 mr-1" /> Import
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Pipeline Metrics Bar ─────────────────────────────────
function MetricsBar({ metrics }: { metrics: any }) {
  if (!metrics) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
      {[
        { label: 'Active Deals', value: metrics.totalActive, icon: Target, color: 'oklch(0.65 0.15 250)' },
        { label: 'Pipeline Value', value: fmt(metrics.totalPipelineValue), icon: DollarSign, color: 'oklch(0.65 0.18 145)' },
        { label: 'Closed Deals', value: metrics.totalClosed, icon: CheckCircle2, color: 'oklch(0.65 0.18 145)' },
        { label: 'Win Rate', value: `${metrics.winRate}%`, icon: TrendingUp, color: 'oklch(0.65 0.15 60)' },
        { label: 'Avg Days/Stage', value: metrics.avgDaysInStage, icon: Clock, color: 'oklch(0.65 0.18 40)' },
      ].map((m, i) => {
        const Icon = m.icon;
        return (
          <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-[oklch(0.13_0_0)] border border-[oklch(0.25_0_0)]">
            <div className="p-1.5 rounded-md" style={{ backgroundColor: `${m.color.replace(')', ' / 0.12)')}` }}>
              <Icon className="w-4 h-4" style={{ color: m.color }} />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">{m.value}</p>
              <p className="text-[10px] text-[oklch(0.5_0_0)] mt-0.5">{m.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Pipeline Page ───────────────────────────────────
export default function Pipeline() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [csvImportOpen, setCsvImportOpen] = useState(false);
  const [viewDeal, setViewDeal] = useState<any>(null);
  const [collapsedStages, setCollapsedStages] = useState<Set<string>>(new Set());
  const [draggedDealId, setDraggedDealId] = useState<number | null>(null);
  const [, navigate] = useLocation();

  const utils = trpc.useUtils();
  const dealsQuery = trpc.pipeline.listDeals.useQuery(undefined, { enabled: isAuthenticated });
  const metricsQuery = trpc.pipeline.metrics.useQuery(undefined, { enabled: isAuthenticated });
  const moveStage = trpc.pipeline.moveStage.useMutation({
    onSuccess: () => {
      utils.pipeline.listDeals.invalidate();
      utils.pipeline.metrics.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteDeal = trpc.pipeline.deleteDeal.useMutation({
    onSuccess: () => {
      toast.success('Deal removed from pipeline');
      utils.pipeline.listDeals.invalidate();
      utils.pipeline.metrics.invalidate();
      setViewDeal(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const dealsByStage = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const s of STAGES) map[s.id] = [];
    for (const deal of (dealsQuery.data || [])) {
      if (map[deal.stage]) map[deal.stage].push(deal);
    }
    return map;
  }, [dealsQuery.data]);

  const handleDragStart = useCallback((e: React.DragEvent, dealId: number) => {
    setDraggedDealId(dealId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedDealId == null) return;
    moveStage.mutate({ id: draggedDealId, stage: stageId as StageId });
    setDraggedDealId(null);
  }, [draggedDealId, moveStage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const toggleCollapse = useCallback((stageId: string) => {
    setCollapsedStages(prev => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      return next;
    });
  }, []);

  const handleRefresh = useCallback(() => {
    utils.pipeline.listDeals.invalidate();
    utils.pipeline.metrics.invalidate();
  }, [utils]);

  const handleViewDeal = useCallback((deal: any) => {
    navigate(`/pipeline/${deal.id}`);
  }, [navigate]);

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[oklch(0.48_0.20_18)]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-[oklch(0.48_0.20_18)]" />
          <h2 className="text-2xl font-bold mb-2">Deal Pipeline</h2>
          <p className="text-muted-foreground mb-4">Sign in to track your deals through every stage — from lead to sold.</p>
          <Button asChild className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-[oklch(0.25_0_0)] bg-[oklch(0.12_0_0)]">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
                Deal Pipeline
              </h1>
              <p className="text-xs text-[oklch(0.5_0_0)] mt-0.5">
                Track deals from lead to close. Drag cards between stages.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCsvImportOpen(true)} className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)] hover:bg-white/5 text-xs">
                <Upload className="w-3.5 h-3.5 mr-1" /> CSV Import
              </Button>
              <Button variant="outline" size="sm" onClick={() => setImportOpen(true)} className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)] hover:bg-white/5 text-xs">
                <Import className="w-3.5 h-3.5 mr-1" /> Import Deal
              </Button>
              <Button size="sm" onClick={() => setAddOpen(true)} className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Deal
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <MetricsBar metrics={metricsQuery.data} />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <div className="flex gap-3 p-4 min-w-max">
          {STAGES.map(stage => (
            <StageColumn
              key={stage.id}
              stage={stage}
              deals={dealsByStage[stage.id] || []}
              onView={handleViewDeal}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              collapsed={collapsedStages.has(stage.id)}
              onToggle={() => toggleCollapse(stage.id)}
            />
          ))}
        </div>
      </div>

      {/* Add Deal Dialog */}
      <AddDealDialog open={addOpen} onClose={() => setAddOpen(false)} onCreated={handleRefresh} />

      {/* Import Dialog */}
      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} onImported={handleRefresh} />

      {/* CSV Import Dialog */}
      <CsvImportDialog open={csvImportOpen} onClose={() => setCsvImportOpen(false)} onImported={handleRefresh} />

      {/* Quick View Dialog */}
      {viewDeal && (
        <Dialog open={!!viewDeal} onOpenChange={() => setViewDeal(null)}>
          <DialogContent className="max-w-lg bg-[oklch(0.16_0_0)] border-[oklch(0.3_0_0)] text-white">
            <DialogHeader>
              <DialogTitle className="text-base">{viewDeal.propertyAddress}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-[oklch(0.5_0_0)]">Stage:</span> <span className="font-medium capitalize">{viewDeal.stage.replace('_', ' ')}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Score:</span> <span className="font-medium">{viewDeal.dealScore || '—'}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Purchase:</span> <span className="font-medium">{fmt(viewDeal.purchasePrice)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">ARV:</span> <span className="font-medium">{fmt(viewDeal.arv)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Rehab:</span> <span className="font-medium">{fmt(viewDeal.rehabCost)}</span></div>
                <div><span className="text-[oklch(0.5_0_0)]">Est. Profit:</span> <span className={`font-medium ${(viewDeal.estimatedProfit || 0) > 0 ? 'text-[oklch(0.65_0.18_145)]' : 'text-[oklch(0.65_0.18_18)]'}`}>{fmt(viewDeal.estimatedProfit)}</span></div>
              </div>
              {viewDeal.notes && (
                <div>
                  <p className="text-xs text-[oklch(0.5_0_0)] mb-1">Notes</p>
                  <p className="text-sm text-[oklch(0.7_0_0)] bg-[oklch(0.12_0_0)] p-2 rounded">{viewDeal.notes}</p>
                </div>
              )}
              {viewDeal.deadReason && (
                <div>
                  <p className="text-xs text-[oklch(0.5_0_0)] mb-1">Dead Reason</p>
                  <p className="text-sm text-[oklch(0.65_0.18_18)] bg-[oklch(0.12_0_0)] p-2 rounded">{viewDeal.deadReason}</p>
                </div>
              )}
              <div className="text-xs text-[oklch(0.4_0_0)]">
                Added {new Date(viewDeal.createdAt).toLocaleDateString()} | Days in stage: {daysSince(viewDeal.stageEnteredAt) ?? '—'}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { deleteDeal.mutate({ id: viewDeal.id }); }}
                disabled={deleteDeal.isPending}
                className="border-[oklch(0.65_0.18_18/0.3)] text-[oklch(0.65_0.18_18)] hover:bg-[oklch(0.65_0.18_18/0.1)]"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>
              <Button size="sm" onClick={() => setViewDeal(null)} className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
