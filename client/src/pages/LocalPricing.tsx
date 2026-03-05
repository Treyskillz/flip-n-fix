import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  MapPin, DollarSign, Save, RotateCcw, Download, Upload, Printer,
  ChevronDown, ChevronUp, Info, CheckCircle2, Wrench, Paintbrush,
  Zap as ZapIcon, Droplets, Flame, Home, TreePine, Hammer
} from 'lucide-react';
import { US_STATES, US_STATE_NAMES, STATE_COST_INDEX, METRO_COST_INDEX, getRegionalCostFactor } from '@/lib/regionalCosts';
import { printDocument } from '@/lib/printDocument';
import { useBranding } from '@/lib/branding';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/RUvFlwFYmtbQizbR.png";

// ── Category Definitions ────────────────────────────────────
interface PriceItem {
  id: string;
  name: string;
  unit: string;
  nationalAvg: number;
  userPrice: number | null; // null = use regional default
  notes: string;
}

interface PriceCategory {
  id: string;
  name: string;
  icon: typeof Home;
  items: PriceItem[];
}

function getDefaultCategories(): PriceCategory[] {
  return [
    {
      id: 'demolition',
      name: 'Demolition & Cleanup',
      icon: Hammer,
      items: [
        { id: 'demo-interior', name: 'Interior Demolition', unit: 'per sqft', nationalAvg: 3.50, userPrice: null, notes: '' },
        { id: 'demo-dumpster', name: 'Dumpster Rental (30-yard)', unit: 'per load', nationalAvg: 550, userPrice: null, notes: '' },
        { id: 'demo-haul', name: 'Debris Hauling', unit: 'per load', nationalAvg: 350, userPrice: null, notes: '' },
        { id: 'demo-asbestos', name: 'Asbestos Testing', unit: 'per sample', nationalAvg: 35, userPrice: null, notes: '' },
      ],
    },
    {
      id: 'roofing',
      name: 'Roofing',
      icon: Home,
      items: [
        { id: 'roof-shingle', name: 'Asphalt Shingles (30-yr)', unit: 'per sqft', nationalAvg: 4.50, userPrice: null, notes: '' },
        { id: 'roof-tear', name: 'Tear-Off & Disposal', unit: 'per sqft', nationalAvg: 1.50, userPrice: null, notes: '' },
        { id: 'roof-underlayment', name: 'Underlayment (synthetic)', unit: 'per sqft', nationalAvg: 0.65, userPrice: null, notes: '' },
        { id: 'roof-flashing', name: 'Flashing & Trim', unit: 'per linear ft', nationalAvg: 8, userPrice: null, notes: '' },
        { id: 'roof-gutter', name: 'Gutters (aluminum)', unit: 'per linear ft', nationalAvg: 12, userPrice: null, notes: '' },
      ],
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: ZapIcon,
      items: [
        { id: 'elec-panel', name: 'Panel Upgrade (200 amp)', unit: 'each', nationalAvg: 2800, userPrice: null, notes: '' },
        { id: 'elec-outlet', name: 'Outlet Install/Replace', unit: 'each', nationalAvg: 175, userPrice: null, notes: '' },
        { id: 'elec-switch', name: 'Light Switch Install', unit: 'each', nationalAvg: 125, userPrice: null, notes: '' },
        { id: 'elec-fixture', name: 'Light Fixture Install', unit: 'each', nationalAvg: 200, userPrice: null, notes: '' },
        { id: 'elec-rewire', name: 'Full Rewire', unit: 'per sqft', nationalAvg: 8, userPrice: null, notes: '' },
        { id: 'elec-gfci', name: 'GFCI Outlet', unit: 'each', nationalAvg: 195, userPrice: null, notes: '' },
      ],
    },
    {
      id: 'plumbing',
      name: 'Plumbing',
      icon: Droplets,
      items: [
        { id: 'plumb-repipe', name: 'Full Re-pipe (PEX)', unit: 'per sqft', nationalAvg: 5.50, userPrice: null, notes: '' },
        { id: 'plumb-toilet', name: 'Toilet Install', unit: 'each', nationalAvg: 350, userPrice: null, notes: '' },
        { id: 'plumb-faucet', name: 'Faucet Install', unit: 'each', nationalAvg: 250, userPrice: null, notes: '' },
        { id: 'plumb-water-heater', name: 'Water Heater (50 gal)', unit: 'each', nationalAvg: 1800, userPrice: null, notes: '' },
        { id: 'plumb-drain', name: 'Drain Line Repair', unit: 'per linear ft', nationalAvg: 85, userPrice: null, notes: '' },
        { id: 'plumb-sewer', name: 'Sewer Line Replacement', unit: 'per linear ft', nationalAvg: 120, userPrice: null, notes: '' },
      ],
    },
    {
      id: 'hvac',
      name: 'HVAC',
      icon: Flame,
      items: [
        { id: 'hvac-furnace', name: 'Furnace Replacement', unit: 'each', nationalAvg: 4500, userPrice: null, notes: '' },
        { id: 'hvac-ac', name: 'AC Condenser Unit', unit: 'each', nationalAvg: 3800, userPrice: null, notes: '' },
        { id: 'hvac-ductwork', name: 'Ductwork Replacement', unit: 'per linear ft', nationalAvg: 35, userPrice: null, notes: '' },
        { id: 'hvac-thermostat', name: 'Smart Thermostat', unit: 'each', nationalAvg: 275, userPrice: null, notes: '' },
        { id: 'hvac-mini-split', name: 'Mini-Split System', unit: 'each', nationalAvg: 3500, userPrice: null, notes: '' },
      ],
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      icon: Home,
      items: [
        { id: 'kit-cabinets-stock', name: 'Cabinets (Stock)', unit: 'per linear ft', nationalAvg: 150, userPrice: null, notes: '' },
        { id: 'kit-cabinets-semi', name: 'Cabinets (Semi-Custom)', unit: 'per linear ft', nationalAvg: 300, userPrice: null, notes: '' },
        { id: 'kit-countertop-lam', name: 'Countertop (Laminate)', unit: 'per sqft', nationalAvg: 35, userPrice: null, notes: '' },
        { id: 'kit-countertop-granite', name: 'Countertop (Granite)', unit: 'per sqft', nationalAvg: 75, userPrice: null, notes: '' },
        { id: 'kit-countertop-quartz', name: 'Countertop (Quartz)', unit: 'per sqft', nationalAvg: 85, userPrice: null, notes: '' },
        { id: 'kit-backsplash', name: 'Backsplash (tile)', unit: 'per sqft', nationalAvg: 18, userPrice: null, notes: '' },
        { id: 'kit-sink', name: 'Kitchen Sink + Install', unit: 'each', nationalAvg: 450, userPrice: null, notes: '' },
        { id: 'kit-appliance-pkg', name: 'Appliance Package (4-pc)', unit: 'set', nationalAvg: 3200, userPrice: null, notes: '' },
      ],
    },
    {
      id: 'bathroom',
      name: 'Bathrooms',
      icon: Droplets,
      items: [
        { id: 'bath-tub-surround', name: 'Tub/Shower Surround', unit: 'each', nationalAvg: 1200, userPrice: null, notes: '' },
        { id: 'bath-tile-floor', name: 'Floor Tile', unit: 'per sqft', nationalAvg: 14, userPrice: null, notes: '' },
        { id: 'bath-tile-wall', name: 'Wall Tile (shower)', unit: 'per sqft', nationalAvg: 16, userPrice: null, notes: '' },
        { id: 'bath-vanity', name: 'Vanity + Top', unit: 'each', nationalAvg: 550, userPrice: null, notes: '' },
        { id: 'bath-mirror', name: 'Mirror', unit: 'each', nationalAvg: 120, userPrice: null, notes: '' },
        { id: 'bath-exhaust', name: 'Exhaust Fan', unit: 'each', nationalAvg: 250, userPrice: null, notes: '' },
      ],
    },
    {
      id: 'flooring',
      name: 'Flooring',
      icon: Home,
      items: [
        { id: 'floor-lvp', name: 'Luxury Vinyl Plank (LVP)', unit: 'per sqft', nationalAvg: 5.50, userPrice: null, notes: '' },
        { id: 'floor-laminate', name: 'Laminate', unit: 'per sqft', nationalAvg: 4, userPrice: null, notes: '' },
        { id: 'floor-hardwood', name: 'Hardwood (engineered)', unit: 'per sqft', nationalAvg: 9, userPrice: null, notes: '' },
        { id: 'floor-tile', name: 'Ceramic Tile', unit: 'per sqft', nationalAvg: 12, userPrice: null, notes: '' },
        { id: 'floor-carpet', name: 'Carpet + Pad', unit: 'per sqft', nationalAvg: 4.50, userPrice: null, notes: '' },
        { id: 'floor-removal', name: 'Old Flooring Removal', unit: 'per sqft', nationalAvg: 2, userPrice: null, notes: '' },
      ],
    },
    {
      id: 'paint',
      name: 'Paint & Drywall',
      icon: Paintbrush,
      items: [
        { id: 'paint-interior', name: 'Interior Paint (2 coats)', unit: 'per sqft', nationalAvg: 2.50, userPrice: null, notes: '' },
        { id: 'paint-exterior', name: 'Exterior Paint', unit: 'per sqft', nationalAvg: 3.50, userPrice: null, notes: '' },
        { id: 'paint-drywall-patch', name: 'Drywall Patch/Repair', unit: 'per sqft', nationalAvg: 6, userPrice: null, notes: '' },
        { id: 'paint-drywall-new', name: 'New Drywall (hang + finish)', unit: 'per sqft', nationalAvg: 3.50, userPrice: null, notes: '' },
        { id: 'paint-texture', name: 'Texture (knockdown/orange peel)', unit: 'per sqft', nationalAvg: 1.50, userPrice: null, notes: '' },
      ],
    },
    {
      id: 'exterior',
      name: 'Exterior & Landscaping',
      icon: TreePine,
      items: [
        { id: 'ext-siding', name: 'Vinyl Siding', unit: 'per sqft', nationalAvg: 7, userPrice: null, notes: '' },
        { id: 'ext-concrete', name: 'Concrete (driveway/walkway)', unit: 'per sqft', nationalAvg: 10, userPrice: null, notes: '' },
        { id: 'ext-fence', name: 'Wood Fence (6ft)', unit: 'per linear ft', nationalAvg: 28, userPrice: null, notes: '' },
        { id: 'ext-deck', name: 'Composite Deck', unit: 'per sqft', nationalAvg: 30, userPrice: null, notes: '' },
        { id: 'ext-sod', name: 'Sod Installation', unit: 'per sqft', nationalAvg: 1.80, userPrice: null, notes: '' },
        { id: 'ext-tree-removal', name: 'Tree Removal', unit: 'each', nationalAvg: 800, userPrice: null, notes: '' },
        { id: 'ext-windows', name: 'Window Replacement (vinyl)', unit: 'each', nationalAvg: 650, userPrice: null, notes: '' },
        { id: 'ext-door-entry', name: 'Entry Door', unit: 'each', nationalAvg: 900, userPrice: null, notes: '' },
      ],
    },
    {
      id: 'labor',
      name: 'Labor Rates',
      icon: Wrench,
      items: [
        { id: 'labor-general', name: 'General Contractor', unit: 'per hour', nationalAvg: 65, userPrice: null, notes: '' },
        { id: 'labor-electrician', name: 'Electrician', unit: 'per hour', nationalAvg: 85, userPrice: null, notes: '' },
        { id: 'labor-plumber', name: 'Plumber', unit: 'per hour', nationalAvg: 90, userPrice: null, notes: '' },
        { id: 'labor-hvac-tech', name: 'HVAC Technician', unit: 'per hour', nationalAvg: 80, userPrice: null, notes: '' },
        { id: 'labor-painter', name: 'Painter', unit: 'per hour', nationalAvg: 45, userPrice: null, notes: '' },
        { id: 'labor-flooring', name: 'Flooring Installer', unit: 'per hour', nationalAvg: 55, userPrice: null, notes: '' },
        { id: 'labor-handyman', name: 'Handyman', unit: 'per hour', nationalAvg: 45, userPrice: null, notes: '' },
        { id: 'labor-roofer', name: 'Roofer', unit: 'per hour', nationalAvg: 70, userPrice: null, notes: '' },
      ],
    },
  ];
}

const STORAGE_KEY = 'freedom-one-local-pricing';

function loadSavedPricing(): PriceCategory[] | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return null;
}

function savePricing(categories: PriceCategory[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

const fmt = (n: number) => n < 1 ? `$${n.toFixed(2)}` : n >= 1000 ? `$${n.toLocaleString()}` : `$${n.toFixed(2)}`;

function CategorySection({ category, onUpdate }: { category: PriceCategory; onUpdate: (items: PriceItem[]) => void }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = category.icon;
  const customCount = category.items.filter(i => i.userPrice !== null).length;

  return (
    <div className="border border-[oklch(0.25_0_0)] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-[oklch(0.15_0_0)] hover:bg-[oklch(0.17_0_0)] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)]/15">
            <Icon className="w-4 h-4 text-[oklch(0.65_0.18_18)]" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{category.name}</h3>
            <p className="text-xs text-[oklch(0.5_0_0)]">{category.items.length} items {customCount > 0 && <span className="text-[oklch(0.65_0.18_18)]">• {customCount} customized</span>}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-[oklch(0.5_0_0)]" /> : <ChevronDown className="w-4 h-4 text-[oklch(0.5_0_0)]" />}
      </button>
      {expanded && (
        <div className="bg-[oklch(0.12_0_0)] p-4">
          <div className="grid grid-cols-[1fr_80px_100px_100px_1fr] gap-2 mb-2 text-xs text-[oklch(0.5_0_0)] uppercase tracking-wider px-1">
            <span>Item</span>
            <span>Unit</span>
            <span>Nat'l Avg</span>
            <span>Your Price</span>
            <span>Notes</span>
          </div>
          <div className="space-y-1.5">
            {category.items.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-[1fr_80px_100px_100px_1fr] gap-2 items-center">
                <span className="text-sm text-[oklch(0.7_0_0)]">{item.name}</span>
                <span className="text-xs text-[oklch(0.5_0_0)]">{item.unit}</span>
                <span className="text-xs text-[oklch(0.5_0_0)] font-mono">{fmt(item.nationalAvg)}</span>
                <Input
                  type="number"
                  placeholder={fmt(item.nationalAvg)}
                  value={item.userPrice ?? ''}
                  onChange={e => {
                    const val = e.target.value === '' ? null : parseFloat(e.target.value);
                    const newItems = [...category.items];
                    newItems[idx] = { ...item, userPrice: val };
                    onUpdate(newItems);
                  }}
                  className="h-7 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white"
                />
                <Input
                  type="text"
                  placeholder="Notes..."
                  value={item.notes}
                  onChange={e => {
                    const newItems = [...category.items];
                    newItems[idx] = { ...item, notes: e.target.value };
                    onUpdate(newItems);
                  }}
                  className="h-7 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LocalPricing() {
  const { branding } = useBranding();
  const [categories, setCategories] = useState<PriceCategory[]>(() => loadSavedPricing() || getDefaultCategories());
  const [selectedState, setSelectedState] = useState('TX');
  const [selectedMetro, setSelectedMetro] = useState('');
  const [saved, setSaved] = useState(false);

  // Get regional factor for display
  const regionalFactor = useMemo(() => {
    if (selectedMetro) {
      const parts = selectedMetro.split(', ');
      return getRegionalCostFactor(parts[0], parts[1]);
    }
    return getRegionalCostFactor('', selectedState);
  }, [selectedState, selectedMetro]);

  // Get metros for selected state
  const stateMetros = useMemo(() => {
    return Object.entries(METRO_COST_INDEX)
      .filter(([key]) => key.endsWith(`, ${selectedState}`))
      .map(([key, val]) => ({ key, label: val.label }));
  }, [selectedState]);

  const totalCustomized = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.items.filter(i => i.userPrice !== null).length, 0);
  }, [categories]);

  const totalItems = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.items.length, 0);
  }, [categories]);

  const handleSave = () => {
    savePricing(categories);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Reset all prices to national averages? Your custom prices will be lost.')) {
      setCategories(getDefaultCategories());
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExport = () => {
    const data = {
      version: 1,
      exportDate: new Date().toISOString(),
      region: selectedMetro || selectedState,
      regionalFactor,
      categories,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `local-pricing-${(selectedMetro || selectedState).toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
          savePricing(data.categories);
        }
      } catch {
        alert('Invalid pricing file. Please select a valid JSON export.');
      }
    };
    input.click();
  };

  const handlePrint = () => {
    const sections = categories.map(cat => {
      const tableRows = cat.items.map(item =>
        `• ${item.name} (${item.unit}): National Avg ${fmt(item.nationalAvg)} → Your Price: ${item.userPrice !== null ? fmt(item.userPrice) : 'Using default'}${item.notes ? ' — ' + item.notes : ''}`
      ).join('\n');
      return {
        heading: cat.name,
        body: tableRows,
      };
    });

    printDocument({
      title: 'Local Area Pricing Template',
      subtitle: `Region: ${selectedMetro ? METRO_COST_INDEX[selectedMetro]?.label : US_STATE_NAMES[selectedState]} | Material Factor: ${regionalFactor.materialsFactor}× | Labor Factor: ${regionalFactor.laborFactor}×`,
      sections,
      branding,
    });
  };

  const updateCategory = (catId: string, items: PriceItem[]) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, items } : c));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[oklch(0.15_0_0)] text-white border-b border-[oklch(0.25_0_0)]">
        <div className="container py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.48_0.20_18)]/15 text-[oklch(0.65_0.18_18)] text-xs mb-3">
                <MapPin className="w-3.5 h-3.5" /> Local Market Pricing
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
                Local Area Pricing Template
              </h1>
              <p className="text-sm text-[oklch(0.55_0_0)] max-w-xl">
                Customize material and labor prices for your local market. These prices are saved to your browser
                and can be exported/imported for backup. Use them to create more accurate rehab estimates.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="gap-1.5 border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)] hover:text-white"
              >
                {saved ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Save className="w-3.5 h-3.5" />}
                {saved ? 'Saved!' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)] hover:text-white">
                <Printer className="w-3.5 h-3.5" /> Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5 border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)] hover:text-white">
                <Download className="w-3.5 h-3.5" /> Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleImport} className="gap-1.5 border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)] hover:text-white">
                <Upload className="w-3.5 h-3.5" /> Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 border-[oklch(0.3_0_0)] text-[oklch(0.6_0_0)] hover:text-white">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Region Selector + Stats */}
      <section className="bg-[oklch(0.13_0_0)] border-b border-[oklch(0.25_0_0)]">
        <div className="container py-5">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-[oklch(0.5_0_0)] mb-1 block">State</Label>
                <Select value={selectedState} onValueChange={v => { setSelectedState(v); setSelectedMetro(''); }}>
                  <SelectTrigger className="h-9 bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map(st => (
                      <SelectItem key={st} value={st}>{US_STATE_NAMES[st]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-[oklch(0.5_0_0)] mb-1 block">Metro Area (optional)</Label>
                <Select value={selectedMetro} onValueChange={setSelectedMetro}>
                  <SelectTrigger className="h-9 bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white text-sm">
                    <SelectValue placeholder="State average" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">State Average</SelectItem>
                    {stateMetros.map(m => (
                      <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-xs text-[oklch(0.5_0_0)]">Material Factor</p>
                <p className="text-xl font-bold text-white">{regionalFactor.materialsFactor}×</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[oklch(0.5_0_0)]">Labor Factor</p>
                <p className="text-xl font-bold text-white">{regionalFactor.laborFactor}×</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[oklch(0.5_0_0)]">Customized</p>
                <p className="text-xl font-bold text-[oklch(0.65_0.18_18)]">{totalCustomized}/{totalItems}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="container py-4">
        <div className="flex gap-3 p-4 rounded-lg bg-[oklch(0.48_0.20_18)]/10 border border-[oklch(0.48_0.20_18)]/20">
          <Info className="w-5 h-5 text-[oklch(0.65_0.18_18)] shrink-0 mt-0.5" />
          <div className="text-sm text-[oklch(0.65_0.18_18)]">
            <strong>How to use:</strong> Select your state/metro to see regional cost factors. Then customize individual prices
            by entering your local rates in the "Your Price" column. Leave blank to use the national average. Click "Save" to
            persist your prices across sessions. Use "Export" to back up your pricing data or share with team members.
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-4 pb-16">
        <div className="space-y-3 max-w-5xl">
          {categories.map(cat => (
            <CategorySection
              key={cat.id}
              category={cat}
              onUpdate={(items) => updateCategory(cat.id, items)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
