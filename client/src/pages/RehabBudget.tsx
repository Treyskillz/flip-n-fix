import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Hammer, DollarSign, Printer, Download, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle2, Plus, Trash2, FileSpreadsheet
} from 'lucide-react';
import { printDocument } from '@/lib/printDocument';
import * as XLSX from 'xlsx';

// ── Budget Category Data ─────────────────────────────────────

interface BudgetLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  laborCost: number;
  actual?: number;
  notes: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  expanded: boolean;
  items: BudgetLineItem[];
}

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  {
    id: 'demo', name: 'Demolition & Cleanup', icon: '🔨', expanded: true,
    items: [
      { id: 'demo-1', description: 'Dumpster rental (30-yard)', quantity: 1, unit: 'each', unitCost: 450, laborCost: 0, notes: '' },
      { id: 'demo-2', description: 'Interior demolition labor', quantity: 1, unit: 'lump sum', unitCost: 0, laborCost: 2500, notes: '' },
      { id: 'demo-3', description: 'Debris hauling', quantity: 1, unit: 'load', unitCost: 350, laborCost: 0, notes: '' },
      { id: 'demo-4', description: 'Post-construction cleaning', quantity: 1, unit: 'lump sum', unitCost: 200, laborCost: 300, notes: '' },
    ],
  },
  {
    id: 'exterior', name: 'Exterior & Curb Appeal', icon: '🏠', expanded: false,
    items: [
      { id: 'ext-1', description: 'Exterior paint (labor + materials)', quantity: 1, unit: 'lump sum', unitCost: 1500, laborCost: 3000, notes: '' },
      { id: 'ext-2', description: 'Front door replacement', quantity: 1, unit: 'each', unitCost: 400, laborCost: 250, notes: '' },
      { id: 'ext-3', description: 'Landscaping (mulch, plants, edging)', quantity: 1, unit: 'lump sum', unitCost: 800, laborCost: 600, notes: '' },
      { id: 'ext-4', description: 'Driveway / walkway repair', quantity: 1, unit: 'lump sum', unitCost: 500, laborCost: 500, notes: '' },
      { id: 'ext-5', description: 'Fencing repair/replacement', quantity: 0, unit: 'linear ft', unitCost: 25, laborCost: 15, notes: '' },
      { id: 'ext-6', description: 'Garage door replacement', quantity: 0, unit: 'each', unitCost: 900, laborCost: 350, notes: '' },
    ],
  },
  {
    id: 'roofing', name: 'Roofing', icon: '🏗️', expanded: false,
    items: [
      { id: 'roof-1', description: 'Tear-off existing roof', quantity: 0, unit: 'sq (100 sqft)', unitCost: 0, laborCost: 75, notes: '' },
      { id: 'roof-2', description: 'New shingles (architectural)', quantity: 0, unit: 'sq (100 sqft)', unitCost: 120, laborCost: 100, notes: '' },
      { id: 'roof-3', description: 'Underlayment & flashing', quantity: 0, unit: 'sq (100 sqft)', unitCost: 30, laborCost: 25, notes: '' },
      { id: 'roof-4', description: 'Gutters & downspouts', quantity: 0, unit: 'linear ft', unitCost: 8, laborCost: 5, notes: '' },
    ],
  },
  {
    id: 'kitchen', name: 'Kitchen', icon: '🍳', expanded: false,
    items: [
      { id: 'kit-1', description: 'Cabinets (base + wall)', quantity: 20, unit: 'linear ft', unitCost: 150, laborCost: 75, notes: '' },
      { id: 'kit-2', description: 'Countertops', quantity: 30, unit: 'sqft', unitCost: 45, laborCost: 25, notes: '' },
      { id: 'kit-3', description: 'Backsplash tile', quantity: 30, unit: 'sqft', unitCost: 8, laborCost: 12, notes: '' },
      { id: 'kit-4', description: 'Sink + faucet', quantity: 1, unit: 'each', unitCost: 350, laborCost: 200, notes: '' },
      { id: 'kit-5', description: 'Refrigerator', quantity: 1, unit: 'each', unitCost: 1200, laborCost: 0, notes: '' },
      { id: 'kit-6', description: 'Range/Oven', quantity: 1, unit: 'each', unitCost: 700, laborCost: 0, notes: '' },
      { id: 'kit-7', description: 'Dishwasher', quantity: 1, unit: 'each', unitCost: 500, laborCost: 150, notes: '' },
      { id: 'kit-8', description: 'Microwave (over-range)', quantity: 1, unit: 'each', unitCost: 300, laborCost: 100, notes: '' },
      { id: 'kit-9', description: 'Kitchen flooring', quantity: 120, unit: 'sqft', unitCost: 3, laborCost: 3, notes: '' },
      { id: 'kit-10', description: 'Light fixtures', quantity: 3, unit: 'each', unitCost: 75, laborCost: 50, notes: '' },
    ],
  },
  {
    id: 'bathrooms', name: 'Bathrooms', icon: '🛁', expanded: false,
    items: [
      { id: 'bath-1', description: 'Vanity + countertop', quantity: 2, unit: 'each', unitCost: 450, laborCost: 200, notes: '' },
      { id: 'bath-2', description: 'Toilet', quantity: 2, unit: 'each', unitCost: 200, laborCost: 150, notes: '' },
      { id: 'bath-3', description: 'Tub/shower surround or tile', quantity: 2, unit: 'each', unitCost: 600, laborCost: 500, notes: '' },
      { id: 'bath-4', description: 'Faucets (sink + tub)', quantity: 4, unit: 'each', unitCost: 120, laborCost: 75, notes: '' },
      { id: 'bath-5', description: 'Floor tile', quantity: 80, unit: 'sqft', unitCost: 4, laborCost: 6, notes: '' },
      { id: 'bath-6', description: 'Mirrors + lighting', quantity: 2, unit: 'set', unitCost: 150, laborCost: 75, notes: '' },
      { id: 'bath-7', description: 'Accessories (towel bars, TP holder)', quantity: 2, unit: 'set', unitCost: 50, laborCost: 30, notes: '' },
    ],
  },
  {
    id: 'flooring', name: 'Flooring', icon: '🪵', expanded: false,
    items: [
      { id: 'floor-1', description: 'Remove existing flooring', quantity: 0, unit: 'sqft', unitCost: 0, laborCost: 1.50, notes: '' },
      { id: 'floor-2', description: 'LVP / Laminate flooring', quantity: 0, unit: 'sqft', unitCost: 3.50, laborCost: 2.50, notes: '' },
      { id: 'floor-3', description: 'Carpet (bedrooms)', quantity: 0, unit: 'sqft', unitCost: 2.50, laborCost: 1.50, notes: '' },
      { id: 'floor-4', description: 'Tile flooring', quantity: 0, unit: 'sqft', unitCost: 4.00, laborCost: 5.00, notes: '' },
      { id: 'floor-5', description: 'Baseboards & trim', quantity: 0, unit: 'linear ft', unitCost: 1.50, laborCost: 2.00, notes: '' },
    ],
  },
  {
    id: 'painting', name: 'Interior Painting', icon: '🎨', expanded: false,
    items: [
      { id: 'paint-1', description: 'Interior paint (walls + ceiling)', quantity: 0, unit: 'sqft', unitCost: 0.50, laborCost: 1.50, notes: '' },
      { id: 'paint-2', description: 'Primer (if needed)', quantity: 0, unit: 'sqft', unitCost: 0.25, laborCost: 0.50, notes: '' },
      { id: 'paint-3', description: 'Trim & door painting', quantity: 0, unit: 'each', unitCost: 15, laborCost: 35, notes: '' },
      { id: 'paint-4', description: 'Cabinet painting/refinishing', quantity: 0, unit: 'lump sum', unitCost: 300, laborCost: 700, notes: '' },
    ],
  },
  {
    id: 'electrical', name: 'Electrical', icon: '⚡', expanded: false,
    items: [
      { id: 'elec-1', description: 'Panel upgrade (100A to 200A)', quantity: 0, unit: 'each', unitCost: 800, laborCost: 1500, notes: '' },
      { id: 'elec-2', description: 'Replace outlets & switches', quantity: 30, unit: 'each', unitCost: 3, laborCost: 15, notes: '' },
      { id: 'elec-3', description: 'New circuits / wiring', quantity: 0, unit: 'each', unitCost: 50, laborCost: 200, notes: '' },
      { id: 'elec-4', description: 'Light fixtures (interior)', quantity: 10, unit: 'each', unitCost: 60, laborCost: 50, notes: '' },
      { id: 'elec-5', description: 'GFCI outlets (kitchen/bath)', quantity: 6, unit: 'each', unitCost: 15, laborCost: 25, notes: '' },
      { id: 'elec-6', description: 'Smoke/CO detectors', quantity: 6, unit: 'each', unitCost: 25, laborCost: 10, notes: '' },
    ],
  },
  {
    id: 'plumbing', name: 'Plumbing', icon: '🔧', expanded: false,
    items: [
      { id: 'plumb-1', description: 'Water heater replacement', quantity: 0, unit: 'each', unitCost: 800, laborCost: 600, notes: '' },
      { id: 'plumb-2', description: 'Supply line replacement', quantity: 0, unit: 'fixture', unitCost: 50, laborCost: 200, notes: '' },
      { id: 'plumb-3', description: 'Drain line repair/replacement', quantity: 0, unit: 'lump sum', unitCost: 200, laborCost: 800, notes: '' },
      { id: 'plumb-4', description: 'Sewer line scope & repair', quantity: 0, unit: 'lump sum', unitCost: 100, laborCost: 500, notes: '' },
      { id: 'plumb-5', description: 'Hose bibs / exterior faucets', quantity: 0, unit: 'each', unitCost: 25, laborCost: 100, notes: '' },
    ],
  },
  {
    id: 'hvac', name: 'HVAC', icon: '❄️', expanded: false,
    items: [
      { id: 'hvac-1', description: 'Furnace replacement', quantity: 0, unit: 'each', unitCost: 2000, laborCost: 1500, notes: '' },
      { id: 'hvac-2', description: 'AC condenser replacement', quantity: 0, unit: 'each', unitCost: 1800, laborCost: 1200, notes: '' },
      { id: 'hvac-3', description: 'Thermostat (smart)', quantity: 1, unit: 'each', unitCost: 150, laborCost: 75, notes: '' },
      { id: 'hvac-4', description: 'Ductwork repair/sealing', quantity: 0, unit: 'lump sum', unitCost: 200, laborCost: 600, notes: '' },
      { id: 'hvac-5', description: 'Duct cleaning', quantity: 0, unit: 'lump sum', unitCost: 0, laborCost: 400, notes: '' },
    ],
  },
  {
    id: 'structural', name: 'Structural & Windows', icon: '🪟', expanded: false,
    items: [
      { id: 'struct-1', description: 'Foundation repair', quantity: 0, unit: 'lump sum', unitCost: 1000, laborCost: 4000, notes: '' },
      { id: 'struct-2', description: 'Window replacement', quantity: 0, unit: 'each', unitCost: 350, laborCost: 150, notes: '' },
      { id: 'struct-3', description: 'Framing repair', quantity: 0, unit: 'lump sum', unitCost: 500, laborCost: 1500, notes: '' },
      { id: 'struct-4', description: 'Drywall repair/replacement', quantity: 0, unit: 'sheet (4x8)', unitCost: 15, laborCost: 45, notes: '' },
      { id: 'struct-5', description: 'Insulation (blown-in)', quantity: 0, unit: 'sqft', unitCost: 1.50, laborCost: 1.00, notes: '' },
    ],
  },
  {
    id: 'staging', name: 'Staging & Miscellaneous', icon: '🛋️', expanded: false,
    items: [
      { id: 'stage-1', description: 'Professional staging', quantity: 0, unit: 'month', unitCost: 1500, laborCost: 0, notes: '' },
      { id: 'stage-2', description: 'Permits & inspections', quantity: 1, unit: 'lump sum', unitCost: 500, laborCost: 0, notes: '' },
      { id: 'stage-3', description: 'Contingency / unexpected (10%)', quantity: 1, unit: 'lump sum', unitCost: 0, laborCost: 0, notes: 'Auto-calculated at bottom' },
      { id: 'stage-4', description: 'Pest treatment / termite', quantity: 0, unit: 'lump sum', unitCost: 0, laborCost: 500, notes: '' },
      { id: 'stage-5', description: 'Locksmith / re-key', quantity: 1, unit: 'lump sum', unitCost: 0, laborCost: 150, notes: '' },
    ],
  },
];

const fmt = (n: number) => n < 0
  ? `-$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  : `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

function CategorySection({
  category,
  onToggle,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
}: {
  category: BudgetCategory;
  onToggle: () => void;
  onUpdateItem: (itemId: string, field: string, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => void;
}) {
  const catTotal = category.items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitCost) + (item.quantity * item.laborCost);
  }, 0);
  const catActual = category.items.reduce((sum, item) => sum + (item.actual || 0), 0);
  const catMaterials = category.items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
  const catLabor = category.items.reduce((sum, item) => sum + (item.quantity * item.laborCost), 0);

  return (
    <div className="border border-[oklch(0.25_0_0)] rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-[oklch(0.15_0_0)] hover:bg-[oklch(0.18_0_0)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{category.icon}</span>
          <span className="font-semibold text-white">{category.name}</span>
          <Badge variant="outline" className="text-xs border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)]">
            {category.items.filter(i => i.quantity > 0).length} items
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono text-[oklch(0.65_0.18_18)]">{fmt(catTotal)}</span>
          {catActual > 0 && (
            <span className={`text-sm font-mono ${catActual > catTotal ? 'text-red-400' : 'text-green-400'}`}>
              Actual: {fmt(catActual)}
            </span>
          )}
          {category.expanded ? <ChevronUp className="w-4 h-4 text-[oklch(0.5_0_0)]" /> : <ChevronDown className="w-4 h-4 text-[oklch(0.5_0_0)]" />}
        </div>
      </button>

      {category.expanded && (
        <div className="p-3 space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-[10px] uppercase tracking-wider text-[oklch(0.5_0_0)] px-1 pb-1 border-b border-[oklch(0.2_0_0)]">
            <div className="col-span-3">Description</div>
            <div className="col-span-1 text-right">Qty</div>
            <div className="col-span-1">Unit</div>
            <div className="col-span-1 text-right">Mat $/unit</div>
            <div className="col-span-1 text-right">Lab $/unit</div>
            <div className="col-span-1 text-right">Line Total</div>
            <div className="col-span-1 text-right">Actual</div>
            <div className="col-span-2">Notes</div>
          </div>

          {category.items.map((item) => {
            const lineTotal = (item.quantity * item.unitCost) + (item.quantity * item.laborCost);
            const overBudget = item.actual !== undefined && item.actual > lineTotal && lineTotal > 0;
            return (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center group">
                <div className="col-span-3">
                  <Input
                    value={item.description}
                    onChange={e => onUpdateItem(item.id, 'description', e.target.value)}
                    className="h-7 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.28_0_0)] text-white"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={e => onUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="h-7 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.28_0_0)] text-white text-right"
                    min={0}
                  />
                </div>
                <div className="col-span-1">
                  <span className="text-[10px] text-[oklch(0.5_0_0)]">{item.unit}</span>
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.unitCost}
                    onChange={e => onUpdateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                    className="h-7 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.28_0_0)] text-white text-right"
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.laborCost}
                    onChange={e => onUpdateItem(item.id, 'laborCost', parseFloat(e.target.value) || 0)}
                    className="h-7 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.28_0_0)] text-white text-right"
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-xs font-mono text-white">{fmt(lineTotal)}</span>
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.actual ?? ''}
                    onChange={e => onUpdateItem(item.id, 'actual', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className={`h-7 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.28_0_0)] text-right ${overBudget ? 'text-red-400 border-red-500/50' : 'text-white'}`}
                    min={0}
                    placeholder="—"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-1">
                  <Input
                    value={item.notes}
                    onChange={e => onUpdateItem(item.id, 'notes', e.target.value)}
                    className="h-7 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.28_0_0)] text-white flex-1"
                    placeholder="Notes..."
                  />
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Category Subtotal */}
          <div className="flex items-center justify-between pt-2 border-t border-[oklch(0.2_0_0)]">
            <Button variant="ghost" size="sm" onClick={onAddItem} className="text-xs text-[oklch(0.5_0_0)] hover:text-white gap-1">
              <Plus className="w-3 h-3" /> Add Line Item
            </Button>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-[oklch(0.5_0_0)]">Materials: <span className="text-white font-mono">{fmt(catMaterials)}</span></span>
              <span className="text-[oklch(0.5_0_0)]">Labor: <span className="text-white font-mono">{fmt(catLabor)}</span></span>
              <span className="text-[oklch(0.5_0_0)]">Subtotal: <span className="text-[oklch(0.65_0.18_18)] font-mono font-semibold">{fmt(catTotal)}</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RehabBudget() {
  const [propertyAddress, setPropertyAddress] = useState('');
  const [categories, setCategories] = useState<BudgetCategory[]>(DEFAULT_CATEGORIES);
  const [contingencyPct, setContingencyPct] = useState(10);
  const [showActuals, setShowActuals] = useState(false);

  const toggleCategory = useCallback((catId: string) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, expanded: !c.expanded } : c));
  }, []);

  const updateItem = useCallback((catId: string, itemId: string, field: string, value: any) => {
    setCategories(prev => prev.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        items: c.items.map(item => item.id === itemId ? { ...item, [field]: value } : item),
      };
    }));
  }, []);

  const addItem = useCallback((catId: string) => {
    setCategories(prev => prev.map(c => {
      if (c.id !== catId) return c;
      const newId = `${catId}-${Date.now()}`;
      return {
        ...c,
        items: [...c.items, { id: newId, description: '', quantity: 1, unit: 'each', unitCost: 0, laborCost: 0, notes: '' }],
      };
    }));
  }, []);

  const removeItem = useCallback((catId: string, itemId: string) => {
    setCategories(prev => prev.map(c => {
      if (c.id !== catId) return c;
      return { ...c, items: c.items.filter(item => item.id !== itemId) };
    }));
  }, []);

  const totals = useMemo(() => {
    let totalMaterials = 0;
    let totalLabor = 0;
    let totalActual = 0;
    const categoryTotals: { name: string; materials: number; labor: number; total: number; actual: number }[] = [];

    categories.forEach(cat => {
      let catMat = 0;
      let catLab = 0;
      let catActual = 0;
      cat.items.forEach(item => {
        catMat += item.quantity * item.unitCost;
        catLab += item.quantity * item.laborCost;
        catActual += item.actual || 0;
      });
      totalMaterials += catMat;
      totalLabor += catLab;
      totalActual += catActual;
      categoryTotals.push({ name: cat.name, materials: catMat, labor: catLab, total: catMat + catLab, actual: catActual });
    });

    const subtotal = totalMaterials + totalLabor;
    const contingency = Math.round(subtotal * contingencyPct / 100);
    const grandTotal = subtotal + contingency;

    return { totalMaterials, totalLabor, subtotal, contingency, grandTotal, totalActual, categoryTotals };
  }, [categories, contingencyPct]);

  const handlePrint = () => {
    printDocument({
      title: 'Rehab Budget Worksheet',
      subtitle: propertyAddress || 'Property Address Not Specified',
      sections: categories.filter(cat => cat.items.some(i => i.quantity > 0)).map(cat => {
        const catTotal = cat.items.reduce((s, i) => s + (i.quantity * i.unitCost) + (i.quantity * i.laborCost), 0);
        const lines = cat.items.filter(i => i.quantity > 0).map(item => {
          const lt = (item.quantity * item.unitCost) + (item.quantity * item.laborCost);
          return `• ${item.description} — Qty: ${item.quantity} ${item.unit} — Materials: ${fmt(item.quantity * item.unitCost)} — Labor: ${fmt(item.quantity * item.laborCost)} — Total: ${fmt(lt)}${item.notes ? ` (${item.notes})` : ''}`;
        });
        return {
          heading: `${cat.icon} ${cat.name} — ${fmt(catTotal)}`,
          body: lines.join('\n'),
        };
      }).concat([
        {
          heading: 'Budget Totals',
          body: `• Materials Total: ${fmt(totals.totalMaterials)}\n• Labor Total: ${fmt(totals.totalLabor)}\n• Subtotal: ${fmt(totals.subtotal)}\n• Contingency (${contingencyPct}%): ${fmt(totals.contingency)}\n• GRAND TOTAL: ${fmt(totals.grandTotal)}`,
        },
      ]),
    });
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData: (string | number | null)[][] = [
      ['FREEDOM ONE — Rehab Budget Worksheet'],
      [`Property: ${propertyAddress || 'N/A'}`],
      [`Date: ${new Date().toLocaleDateString()}`],
      [''],
      ['BUDGET SUMMARY'],
      ['Category', 'Materials', 'Labor', 'Total', 'Actual', 'Variance'],
    ];

    totals.categoryTotals.forEach(ct => {
      summaryData.push([ct.name, ct.materials, ct.labor, ct.total, ct.actual, ct.actual > 0 ? ct.total - ct.actual : 0]);
    });

    summaryData.push(['']);
    summaryData.push(['', 'Materials Total', totals.totalMaterials]);
    summaryData.push(['', 'Labor Total', totals.totalLabor]);
    summaryData.push(['', 'Subtotal', totals.subtotal]);
    summaryData.push(['', `Contingency (${contingencyPct}%)`, totals.contingency]);
    summaryData.push(['', 'GRAND TOTAL', totals.grandTotal]);

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWs['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Detail sheet
    const detailData: (string | number | null)[][] = [
      ['FREEDOM ONE — Rehab Budget Detail'],
      [''],
      ['Category', 'Description', 'Qty', 'Unit', 'Mat $/unit', 'Lab $/unit', 'Materials', 'Labor', 'Line Total', 'Actual', 'Notes'],
    ];

    categories.forEach(cat => {
      cat.items.forEach(item => {
        if (item.quantity > 0 || item.description) {
          detailData.push([
            cat.name,
            item.description,
            item.quantity,
            item.unit,
            item.unitCost,
            item.laborCost,
            item.quantity * item.unitCost,
            item.quantity * item.laborCost,
            (item.quantity * item.unitCost) + (item.quantity * item.laborCost),
            item.actual || 0,
            item.notes,
          ]);
        }
      });
    });

    const detailWs = XLSX.utils.aoa_to_sheet(detailData);
    detailWs['!cols'] = [
      { wch: 22 }, { wch: 30 }, { wch: 8 }, { wch: 12 },
      { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 },
      { wch: 14 }, { wch: 14 }, { wch: 25 },
    ];
    XLSX.utils.book_append_sheet(wb, detailWs, 'Detail');

    const safeName = (propertyAddress || 'Property').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    XLSX.writeFile(wb, `FreedomOne_RehabBudget_${safeName}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[oklch(0.12_0_0)] border-b border-[oklch(0.25_0_0)]">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
                <Hammer className="w-6 h-6 text-[oklch(0.65_0.18_18)]" />
                Rehab Budget Worksheet
              </h1>
              <p className="text-sm text-[oklch(0.55_0_0)] mt-1">
                Detailed line-item budgeting with materials, labor, actuals tracking, and export
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)] hover:text-white">
                <Printer className="w-3.5 h-3.5" /> Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-1.5 border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)] hover:text-white">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-6 space-y-6">
        {/* Property Info & Settings */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label className="text-xs text-[oklch(0.5_0_0)] mb-1 block">Property Address</Label>
            <Input
              value={propertyAddress}
              onChange={e => setPropertyAddress(e.target.value)}
              placeholder="Enter property address..."
              className="bg-[oklch(0.15_0_0)] border-[oklch(0.3_0_0)] text-white"
            />
          </div>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label className="text-xs text-[oklch(0.5_0_0)] mb-1 block">Contingency %</Label>
              <Select value={String(contingencyPct)} onValueChange={v => setContingencyPct(parseInt(v))}>
                <SelectTrigger className="bg-[oklch(0.15_0_0)] border-[oklch(0.3_0_0)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="15">15%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch checked={showActuals} onCheckedChange={setShowActuals} />
              <Label className="text-xs text-[oklch(0.5_0_0)]">Track Actuals</Label>
            </div>
          </div>
        </div>

        {/* Grand Total Summary Bar */}
        <div className="bg-[oklch(0.14_0_0)] border border-[oklch(0.25_0_0)] rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[oklch(0.5_0_0)]">Materials</p>
              <p className="text-lg font-bold font-mono text-white">{fmt(totals.totalMaterials)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[oklch(0.5_0_0)]">Labor</p>
              <p className="text-lg font-bold font-mono text-white">{fmt(totals.totalLabor)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[oklch(0.5_0_0)]">Subtotal</p>
              <p className="text-lg font-bold font-mono text-white">{fmt(totals.subtotal)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[oklch(0.5_0_0)]">Contingency ({contingencyPct}%)</p>
              <p className="text-lg font-bold font-mono text-amber-400">{fmt(totals.contingency)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[oklch(0.5_0_0)]">Grand Total</p>
              <p className="text-xl font-bold font-mono text-[oklch(0.65_0.18_18)]">{fmt(totals.grandTotal)}</p>
            </div>
          </div>
          {showActuals && totals.totalActual > 0 && (
            <div className="mt-3 pt-3 border-t border-[oklch(0.25_0_0)] flex items-center gap-4">
              <div className="flex items-center gap-2">
                {totals.totalActual <= totals.grandTotal ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm text-[oklch(0.6_0_0)]">Actual Spent:</span>
                <span className={`text-sm font-mono font-bold ${totals.totalActual <= totals.grandTotal ? 'text-green-400' : 'text-red-400'}`}>
                  {fmt(totals.totalActual)}
                </span>
              </div>
              <span className="text-sm text-[oklch(0.5_0_0)]">
                Remaining: <span className="font-mono text-white">{fmt(totals.grandTotal - totals.totalActual)}</span>
              </span>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          {categories.map(cat => (
            <CategorySection
              key={cat.id}
              category={cat}
              onToggle={() => toggleCategory(cat.id)}
              onUpdateItem={(itemId, field, value) => updateItem(cat.id, itemId, field, value)}
              onAddItem={() => addItem(cat.id)}
              onRemoveItem={(itemId) => removeItem(cat.id, itemId)}
            />
          ))}
        </div>

        {/* Category Summary Table */}
        <div className="bg-[oklch(0.14_0_0)] border border-[oklch(0.25_0_0)] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[oklch(0.65_0.18_18)]" />
            Budget Summary by Category
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[oklch(0.25_0_0)]">
                  <th className="text-left py-2 px-3 text-[oklch(0.5_0_0)]">Category</th>
                  <th className="text-right py-2 px-3 text-[oklch(0.5_0_0)]">Materials</th>
                  <th className="text-right py-2 px-3 text-[oklch(0.5_0_0)]">Labor</th>
                  <th className="text-right py-2 px-3 text-[oklch(0.5_0_0)]">Total</th>
                  <th className="text-right py-2 px-3 text-[oklch(0.5_0_0)]">% of Budget</th>
                </tr>
              </thead>
              <tbody>
                {totals.categoryTotals.filter(ct => ct.total > 0).map((ct, i) => (
                  <tr key={i} className="border-b border-[oklch(0.2_0_0)]">
                    <td className="py-2 px-3 text-white">{ct.name}</td>
                    <td className="py-2 px-3 text-right font-mono text-[oklch(0.6_0_0)]">{fmt(ct.materials)}</td>
                    <td className="py-2 px-3 text-right font-mono text-[oklch(0.6_0_0)]">{fmt(ct.labor)}</td>
                    <td className="py-2 px-3 text-right font-mono text-white font-semibold">{fmt(ct.total)}</td>
                    <td className="py-2 px-3 text-right font-mono text-[oklch(0.5_0_0)]">
                      {totals.subtotal > 0 ? `${((ct.total / totals.subtotal) * 100).toFixed(1)}%` : '—'}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[oklch(0.3_0_0)]">
                  <td className="py-2 px-3 text-white font-bold">Subtotal</td>
                  <td className="py-2 px-3 text-right font-mono text-white">{fmt(totals.totalMaterials)}</td>
                  <td className="py-2 px-3 text-right font-mono text-white">{fmt(totals.totalLabor)}</td>
                  <td className="py-2 px-3 text-right font-mono text-white font-bold">{fmt(totals.subtotal)}</td>
                  <td className="py-2 px-3 text-right font-mono text-white">100%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-amber-400">Contingency ({contingencyPct}%)</td>
                  <td colSpan={2}></td>
                  <td className="py-2 px-3 text-right font-mono text-amber-400">{fmt(totals.contingency)}</td>
                  <td></td>
                </tr>
                <tr className="border-t-2 border-[oklch(0.3_0_0)]">
                  <td className="py-2 px-3 text-[oklch(0.65_0.18_18)] font-bold text-sm">GRAND TOTAL</td>
                  <td colSpan={2}></td>
                  <td className="py-2 px-3 text-right font-mono text-[oklch(0.65_0.18_18)] font-bold text-sm">{fmt(totals.grandTotal)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
