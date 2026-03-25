import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Plus, Minus, Trash2, Download, Grid3X3, Save, ChevronDown, ChevronUp,
  DollarSign, Wrench, ShoppingCart, Home, Send, Copy, Check, Mail,
  Calculator, MapPin, BedDouble, Bath, Ruler, Calendar, Building2,
  FolderOpen, FileText, Edit, ArrowLeft, Loader2, Clock, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import {
  ROOM_TYPE_LABELS, ROOM_TYPE_ICONS, TIER_LABELS,
  type SOWProperty, type SOWRoomTemplate, type SOWLineItem,
  getBeforePhoto,
} from '@/lib/sowProperties';
import { type MarketSelection, getAdjustmentPercent } from '@/hooks/useMarketSelector';
import { type BrandingConfig } from '@/lib/branding';
import { generateSOWExcel } from '@/lib/generateSOWExcel';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';

// ─── TYPES ──────────────────────────────────────────────────
interface CustomRoom {
  id: string;
  roomType: string;
  roomLabel: string;
  condition: 'cosmetic' | 'moderate' | 'full';
  lineItems: CustomLineItem[];
  notes: string;
}

interface CustomLineItem {
  id: string;
  item: string;
  material: string;
  quantity: number;
  unit: string;
  materialCost: number;
  laborCost: number;
}

interface CustomSOWData {
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  purchasePrice: number;
  arv: number;
  tier: 'rental' | 'standard' | 'luxury';
  rooms: CustomRoom[];
  budgetTarget: number;
  notes: string;
}

// ─── DEFAULT LINE ITEMS PER ROOM ────────────────────────────
const DEFAULT_LINE_ITEMS: Record<string, CustomLineItem[]> = {
  kitchen: [
    { id: '1', item: 'Cabinets', material: 'Shaker-style cabinets', quantity: 20, unit: 'lin ft', materialCost: 4000, laborCost: 2000 },
    { id: '2', item: 'Countertops', material: 'Granite or quartz', quantity: 35, unit: 'sqft', materialCost: 2100, laborCost: 700 },
    { id: '3', item: 'Backsplash', material: 'Subway tile', quantity: 30, unit: 'sqft', materialCost: 450, laborCost: 450 },
    { id: '4', item: 'Flooring', material: 'LVP or tile', quantity: 120, unit: 'sqft', materialCost: 720, laborCost: 480 },
    { id: '5', item: 'Appliances', material: 'Range, fridge, dishwasher, microwave', quantity: 1, unit: 'lot', materialCost: 2800, laborCost: 400 },
    { id: '6', item: 'Sink & Faucet', material: 'Stainless steel sink + faucet', quantity: 1, unit: 'ea', materialCost: 350, laborCost: 250 },
  ],
  'master-bath': [
    { id: '1', item: 'Vanity', material: 'Double vanity with stone top', quantity: 1, unit: 'ea', materialCost: 1200, laborCost: 400 },
    { id: '2', item: 'Shower/Tub', material: 'Tile shower or tub surround', quantity: 1, unit: 'ea', materialCost: 1800, laborCost: 1200 },
    { id: '3', item: 'Tile Flooring', material: 'Porcelain tile', quantity: 60, unit: 'sqft', materialCost: 480, laborCost: 360 },
    { id: '4', item: 'Toilet', material: 'Elongated comfort height', quantity: 1, unit: 'ea', materialCost: 250, laborCost: 150 },
    { id: '5', item: 'Fixtures', material: 'Faucets, showerhead, accessories', quantity: 1, unit: 'lot', materialCost: 400, laborCost: 200 },
  ],
  'full-bath': [
    { id: '1', item: 'Vanity', material: 'Single vanity with top', quantity: 1, unit: 'ea', materialCost: 600, laborCost: 300 },
    { id: '2', item: 'Tub/Shower', material: 'Tub surround or tile', quantity: 1, unit: 'ea', materialCost: 800, laborCost: 600 },
    { id: '3', item: 'Tile Flooring', material: 'Ceramic tile', quantity: 40, unit: 'sqft', materialCost: 280, laborCost: 240 },
    { id: '4', item: 'Toilet', material: 'Standard', quantity: 1, unit: 'ea', materialCost: 180, laborCost: 120 },
    { id: '5', item: 'Fixtures', material: 'Faucet, showerhead, accessories', quantity: 1, unit: 'lot', materialCost: 250, laborCost: 150 },
  ],
  'half-bath': [
    { id: '1', item: 'Vanity', material: 'Pedestal or small vanity', quantity: 1, unit: 'ea', materialCost: 350, laborCost: 200 },
    { id: '2', item: 'Toilet', material: 'Standard', quantity: 1, unit: 'ea', materialCost: 180, laborCost: 120 },
    { id: '3', item: 'Flooring', material: 'Tile or LVP', quantity: 25, unit: 'sqft', materialCost: 175, laborCost: 125 },
    { id: '4', item: 'Fixtures', material: 'Faucet, mirror, accessories', quantity: 1, unit: 'lot', materialCost: 150, laborCost: 100 },
  ],
  'living-room': [
    { id: '1', item: 'Flooring', material: 'LVP or hardwood', quantity: 200, unit: 'sqft', materialCost: 1200, laborCost: 800 },
    { id: '2', item: 'Paint', material: 'Walls and ceiling', quantity: 1, unit: 'lot', materialCost: 200, laborCost: 400 },
    { id: '3', item: 'Trim & Baseboards', material: 'New baseboards and trim', quantity: 80, unit: 'lin ft', materialCost: 320, laborCost: 400 },
    { id: '4', item: 'Lighting', material: 'Ceiling fixture + recessed lights', quantity: 1, unit: 'lot', materialCost: 300, laborCost: 250 },
  ],
  bedroom: [
    { id: '1', item: 'Flooring', material: 'Carpet or LVP', quantity: 150, unit: 'sqft', materialCost: 600, laborCost: 375 },
    { id: '2', item: 'Paint', material: 'Walls and ceiling', quantity: 1, unit: 'lot', materialCost: 150, laborCost: 300 },
    { id: '3', item: 'Closet', material: 'Closet system or organizer', quantity: 1, unit: 'ea', materialCost: 250, laborCost: 150 },
    { id: '4', item: 'Lighting', material: 'Ceiling fan/light', quantity: 1, unit: 'ea', materialCost: 120, laborCost: 80 },
  ],
  garage: [
    { id: '1', item: 'Epoxy Floor', material: 'Epoxy coating', quantity: 400, unit: 'sqft', materialCost: 800, laborCost: 600 },
    { id: '2', item: 'Garage Door', material: 'Insulated steel door', quantity: 1, unit: 'ea', materialCost: 800, laborCost: 400 },
    { id: '3', item: 'Drywall & Paint', material: 'Patch and paint walls', quantity: 1, unit: 'lot', materialCost: 300, laborCost: 400 },
    { id: '4', item: 'Lighting', material: 'LED shop lights', quantity: 2, unit: 'ea', materialCost: 100, laborCost: 100 },
  ],
  landscaping: [
    { id: '1', item: 'Lawn & Sod', material: 'New sod or seed', quantity: 1, unit: 'lot', materialCost: 800, laborCost: 600 },
    { id: '2', item: 'Shrubs & Plants', material: 'Foundation plantings', quantity: 1, unit: 'lot', materialCost: 500, laborCost: 300 },
    { id: '3', item: 'Mulch & Edging', material: 'Mulch beds with edging', quantity: 1, unit: 'lot', materialCost: 300, laborCost: 200 },
    { id: '4', item: 'Walkway', material: 'Concrete or paver walkway', quantity: 1, unit: 'lot', materialCost: 600, laborCost: 400 },
  ],
  roof: [
    { id: '1', item: 'Shingles', material: 'Architectural shingles', quantity: 20, unit: 'squares', materialCost: 2400, laborCost: 2000 },
    { id: '2', item: 'Underlayment', material: 'Synthetic underlayment', quantity: 20, unit: 'squares', materialCost: 400, laborCost: 0 },
    { id: '3', item: 'Gutters', material: 'Seamless aluminum gutters', quantity: 120, unit: 'lin ft', materialCost: 720, laborCost: 480 },
    { id: '4', item: 'Flashing & Vents', material: 'Roof flashing and vents', quantity: 1, unit: 'lot', materialCost: 300, laborCost: 200 },
  ],
};

const ROOM_TYPES = [
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'master-bath', label: 'Master Bathroom' },
  { id: 'full-bath', label: 'Full Bathroom' },
  { id: 'half-bath', label: 'Half Bathroom' },
  { id: 'living-room', label: 'Living Room' },
  { id: 'bedroom', label: 'Bedroom (Primary)' },
  { id: 'garage', label: 'Garage' },
  { id: 'landscaping', label: 'Landscaping & Exterior' },
  { id: 'roof', label: 'Roof & Gutters' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: 'Draft', color: 'text-muted-foreground', icon: Edit },
  sent: { label: 'Sent to Contractor', color: 'text-blue-500', icon: Send },
  in_progress: { label: 'In Progress', color: 'text-amber-500', icon: Clock },
  completed: { label: 'Completed', color: 'text-emerald-500', icon: CheckCircle2 },
};

let nextId = 1;
function uid() { return `item-${nextId++}-${Date.now()}`; }

// ─── COMPONENT ──────────────────────────────────────────────
export function CustomSOWBuilder({ market, branding }: { market: MarketSelection; branding?: BrandingConfig }) {
  const { isAuthenticated } = useAuth();
  const isAdjusted = market.key !== 'national';

  // ─── VIEW STATE ─────────────────────────────────────────────
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // ─── FORM STATE ─────────────────────────────────────────────
  const [data, setData] = useState<CustomSOWData>({
    address: '', city: '', state: '', zip: '',
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500, yearBuilt: 1990,
    purchasePrice: 0, arv: 0, tier: 'standard', rooms: [], budgetTarget: 0, notes: '',
  });

  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidEmails, setBidEmails] = useState('');
  const [bidNote, setBidNote] = useState('');
  const [copied, setCopied] = useState(false);

  // ─── tRPC QUERIES ───────────────────────────────────────────
  const savedSows = trpc.customSows.list.useQuery(undefined, { enabled: isAuthenticated });
  const saveMutation = trpc.customSows.save.useMutation({
    onSuccess: () => { savedSows.refetch(); toast.success(editingId ? 'SOW updated' : 'SOW saved'); setSaving(false); },
    onError: (e) => { toast.error(`Save failed: ${e.message}`); setSaving(false); },
  });
  const deleteMutation = trpc.customSows.delete.useMutation({
    onSuccess: () => { savedSows.refetch(); toast.success('SOW deleted'); },
  });
  const duplicateMutation = trpc.customSows.duplicate.useMutation({
    onSuccess: () => { savedSows.refetch(); toast.success('SOW duplicated'); },
  });

  // Apply regional adjustments
  const matFactor = market.materialsFactor;
  const labFactor = market.laborFactor;

  const adjustCost = useCallback((cost: number, type: 'material' | 'labor') => {
    return Math.round(cost * (type === 'material' ? matFactor : labFactor));
  }, [matFactor, labFactor]);

  // Totals
  const totals = useMemo(() => {
    let materials = 0, labor = 0;
    for (const room of data.rooms) {
      for (const li of room.lineItems) {
        materials += adjustCost(li.materialCost, 'material');
        labor += adjustCost(li.laborCost, 'labor');
      }
    }
    return { materials, labor, total: materials + labor };
  }, [data.rooms, adjustCost]);

  const budgetDiff = data.budgetTarget > 0 ? data.budgetTarget - totals.total : 0;
  const budgetPct = data.budgetTarget > 0 ? Math.round((totals.total / data.budgetTarget) * 100) : 0;

  // ─── HANDLERS ───────────────────────────────────────────────
  const updateField = <K extends keyof CustomSOWData>(key: K, value: CustomSOWData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const addRoom = (roomTypeId: string) => {
    const rt = ROOM_TYPES.find(r => r.id === roomTypeId);
    if (!rt) return;
    const id = uid();
    const defaultItems = (DEFAULT_LINE_ITEMS[roomTypeId] || []).map(li => ({ ...li, id: uid() }));
    const newRoom: CustomRoom = {
      id, roomType: roomTypeId, roomLabel: rt.label,
      condition: 'moderate', lineItems: defaultItems, notes: '',
    };
    setData(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
    setExpandedRooms(prev => new Set([...Array.from(prev), id]));
    toast.success(`Added ${rt.label}`);
  };

  const removeRoom = (roomId: string) => {
    setData(prev => ({ ...prev, rooms: prev.rooms.filter(r => r.id !== roomId) }));
    toast.info('Room removed');
  };

  const updateRoom = (roomId: string, updates: Partial<CustomRoom>) => {
    setData(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === roomId ? { ...r, ...updates } : r),
    }));
  };

  const addLineItem = (roomId: string) => {
    const newItem: CustomLineItem = { id: uid(), item: '', material: '', quantity: 1, unit: 'ea', materialCost: 0, laborCost: 0 };
    updateRoom(roomId, {
      lineItems: [...(data.rooms.find(r => r.id === roomId)?.lineItems || []), newItem],
    });
  };

  const removeLineItem = (roomId: string, itemId: string) => {
    const room = data.rooms.find(r => r.id === roomId);
    if (!room) return;
    updateRoom(roomId, { lineItems: room.lineItems.filter(li => li.id !== itemId) });
  };

  const updateLineItem = (roomId: string, itemId: string, updates: Partial<CustomLineItem>) => {
    const room = data.rooms.find(r => r.id === roomId);
    if (!room) return;
    updateRoom(roomId, {
      lineItems: room.lineItems.map(li => li.id === itemId ? { ...li, ...updates } : li),
    });
  };

  const toggleRoom = (roomId: string) => {
    setExpandedRooms(prev => {
      const next = new Set(prev);
      next.has(roomId) ? next.delete(roomId) : next.add(roomId);
      return next;
    });
  };

  // ─── SAVE / LOAD ───────────────────────────────────────────
  const handleSave = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (!data.address.trim() && data.rooms.length === 0) { toast.error('Add an address or rooms first'); return; }
    setSaving(true);
    const name = data.address || `Custom SOW ${new Date().toLocaleDateString()}`;
    saveMutation.mutate({
      id: editingId || undefined,
      name,
      propertyAddress: data.address || undefined,
      propertyCity: data.city || undefined,
      propertyState: data.state || undefined,
      propertyZip: data.zip || undefined,
      sqft: data.sqft || undefined,
      beds: data.beds || undefined,
      baths: String(data.baths) || undefined,
      yearBuilt: data.yearBuilt || undefined,
      purchasePrice: data.purchasePrice || undefined,
      arv: data.arv || undefined,
      budgetTarget: data.budgetTarget || undefined,
      totalMaterials: totals.materials,
      totalLabor: totals.labor,
      totalCost: totals.total,
      roomsData: JSON.stringify(data.rooms),
      notes: data.notes || undefined,
      status: 'draft',
    });
  };

  const handleLoadSow = (sow: any) => {
    setEditingId(sow.id);
    let rooms: CustomRoom[] = [];
    try { rooms = JSON.parse(sow.roomsData || '[]'); } catch {}
    setData({
      address: sow.propertyAddress || sow.name || '',
      city: sow.propertyCity || '',
      state: sow.propertyState || '',
      zip: sow.propertyZip || '',
      propertyType: 'Single Family',
      beds: sow.beds || 3,
      baths: Number(sow.baths) || 2,
      sqft: sow.sqft || 1500,
      yearBuilt: sow.yearBuilt || 1990,
      purchasePrice: sow.purchasePrice || 0,
      arv: sow.arv || 0,
      tier: 'standard',
      rooms,
      budgetTarget: sow.budgetTarget || 0,
      notes: sow.notes || '',
    });
    setView('editor');
  };

  const handleNewSow = () => {
    setEditingId(null);
    setData({
      address: '', city: '', state: '', zip: '',
      propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500, yearBuilt: 1990,
      purchasePrice: 0, arv: 0, tier: 'standard', rooms: [], budgetTarget: 0, notes: '',
    });
    setExpandedRooms(new Set());
    setView('editor');
  };

  const handleDeleteSow = (id: number) => {
    if (!confirm('Delete this SOW? This cannot be undone.')) return;
    deleteMutation.mutate({ id });
  };

  // ─── EXPORT HELPERS ─────────────────────────────────────────
  const buildSOWProperty = (): SOWProperty => {
    const rooms: SOWRoomTemplate[] = data.rooms.map(r => {
      const matTotal = r.lineItems.reduce((s, li) => s + adjustCost(li.materialCost, 'material'), 0);
      const labTotal = r.lineItems.reduce((s, li) => s + adjustCost(li.laborCost, 'labor'), 0);
      return {
        roomType: r.roomType,
        roomLabel: r.roomLabel,
        photo: '',
        beforePhoto: getBeforePhoto(data.tier, r.roomType),
        condition: r.condition,
        materialCost: matTotal,
        laborCost: labTotal,
        totalCost: matTotal + labTotal,
        workDescription: r.notes || `${r.condition === 'full' ? 'Full renovation' : r.condition === 'moderate' ? 'Moderate renovation' : 'Cosmetic update'} of ${r.roomLabel.toLowerCase()}.`,
        lineItems: r.lineItems.map(li => ({
          item: li.item,
          material: li.material,
          quantity: li.quantity,
          unit: li.unit,
          materialCost: adjustCost(li.materialCost, 'material'),
          laborCost: adjustCost(li.laborCost, 'labor'),
          totalCost: adjustCost(li.materialCost, 'material') + adjustCost(li.laborCost, 'labor'),
        })),
      };
    });

    return {
      id: 'custom',
      address: data.address || '(Custom Property)',
      city: data.city || '',
      state: data.state || '',
      zip: data.zip || '',
      propertyType: data.propertyType,
      beds: data.beds,
      baths: data.baths,
      sqft: data.sqft,
      yearBuilt: data.yearBuilt,
      purchasePrice: data.purchasePrice,
      arv: data.arv,
      rehabBudget: totals.total,
      tier: data.tier,
      style: 'Custom',
      heroPhoto: '',
      beforePhoto: '',
      afterPhoto: '',
      rooms,
    };
  };

  const handleDownloadExcel = () => {
    if (data.rooms.length === 0) { toast.error('Add at least one room first'); return; }
    const prop = buildSOWProperty();
    generateSOWExcel({ property: prop, branding, marketLabel: isAdjusted ? market.label : undefined, materialsFactor: matFactor, laborFactor: labFactor });
    toast.success('Excel SOW downloaded');
  };

  const handlePrintSOW = () => {
    if (data.rooms.length === 0) { toast.error('Add at least one room first'); return; }
    const prop = buildSOWProperty();
    const regionNote = isAdjusted ? `<p style="color: #C41E3A; font-size: 12px;">Adjusted for ${market.label}</p>` : '';
    const printContent = `
      <html><head><title>Custom SOW - ${prop.address}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #1a1a1a; max-width: 900px; margin: 0 auto; }
        h1 { font-size: 24px; border-bottom: 3px solid #C41E3A; padding-bottom: 8px; }
        h2 { font-size: 18px; color: #C41E3A; margin-top: 28px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
        .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 16px 0; }
        .info-box { background: #f5f5f5; padding: 10px; border-radius: 4px; text-align: center; }
        .info-box .label { font-size: 10px; color: #888; text-transform: uppercase; }
        .info-box .value { font-size: 16px; font-weight: bold; }
        .cost-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0; }
        .cost-box { padding: 14px; border-radius: 6px; text-align: center; border: 2px solid; }
        .cost-box.mat { background: #fef2f2; border-color: #fecaca; }
        .cost-box.lab { background: #f0f9ff; border-color: #bae6fd; }
        .cost-box.tot { background: #f0fdf4; border-color: #bbf7d0; }
        .cost-box .label { font-size: 10px; color: #666; text-transform: uppercase; }
        .cost-box .value { font-size: 22px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 8px 0; }
        th { background: #f0f0f0; padding: 6px 8px; text-align: left; border: 1px solid #ddd; font-size: 11px; }
        td { padding: 6px 8px; border: 1px solid #ddd; }
        .footer { margin-top: 30px; font-size: 11px; color: #888; border-top: 2px solid #ddd; padding-top: 12px; }
      </style></head><body>
      <h1>Scope of Work: ${prop.address}</h1>
      <p style="color: #666; font-size: 13px;">${prop.city}, ${prop.state} ${prop.zip} | ${prop.propertyType}</p>
      ${regionNote}
      <div class="info-grid">
        <div class="info-box"><div class="label">Beds</div><div class="value">${prop.beds}</div></div>
        <div class="info-box"><div class="label">Baths</div><div class="value">${prop.baths}</div></div>
        <div class="info-box"><div class="label">Sq Ft</div><div class="value">${prop.sqft.toLocaleString()}</div></div>
        <div class="info-box"><div class="label">Year Built</div><div class="value">${prop.yearBuilt}</div></div>
      </div>
      ${data.budgetTarget > 0 ? `<p style="font-size:14px;"><strong>Budget Target:</strong> $${data.budgetTarget.toLocaleString()} | <strong>Estimated:</strong> $${totals.total.toLocaleString()} (${budgetPct}%)</p>` : ''}
      <div class="cost-summary">
        <div class="cost-box mat"><div class="label">Total Materials</div><div class="value">$${totals.materials.toLocaleString()}</div></div>
        <div class="cost-box lab"><div class="label">Total Labor</div><div class="value">$${totals.labor.toLocaleString()}</div></div>
        <div class="cost-box tot"><div class="label">Total Rehab</div><div class="value">$${totals.total.toLocaleString()}</div></div>
      </div>
      ${prop.rooms.map(room => `
        <div style="page-break-inside: avoid; margin-bottom: 20px;">
          <h2>${room.roomLabel}</h2>
          <p style="color: #444; font-size: 12px; font-style: italic;">${room.workDescription}</p>
          <table>
            <tr><th>Item</th><th>Material</th><th style="text-align:right">Qty</th><th style="text-align:right">Material</th><th style="text-align:right">Labor</th><th style="text-align:right">Total</th></tr>
            ${room.lineItems.map(li => `<tr><td>${li.item}</td><td>${li.material}</td><td style="text-align:right">${li.quantity} ${li.unit}</td><td style="text-align:right">$${li.materialCost.toLocaleString()}</td><td style="text-align:right">$${li.laborCost.toLocaleString()}</td><td style="text-align:right">$${li.totalCost.toLocaleString()}</td></tr>`).join('')}
            <tr style="font-weight:bold; background:#f9f9f9;"><td colspan="3">ROOM TOTAL</td><td style="text-align:right">$${room.materialCost.toLocaleString()}</td><td style="text-align:right">$${room.laborCost.toLocaleString()}</td><td style="text-align:right">$${room.totalCost.toLocaleString()}</td></tr>
          </table>
        </div>
      `).join('')}
      <div class="footer">
        ${branding?.logoUrl ? `<img src="${branding.logoUrl}" style="height:30px;object-fit:contain;margin-bottom:4px" onerror="this.style.display='none'" />` : ''}
        <p><strong>${branding?.companyName || 'Freedom One Real Estate Investment System'}</strong></p>
        <p>This scope of work is for estimation purposes only. Contact: ${branding?.email || 'contact@freedomoneproperties.com'}</p>
      </div>
      </body></html>
    `;
    const w = window.open('', '_blank');
    if (w) { w.document.write(printContent); w.document.close(); w.print(); }
  };

  const generateBidText = () => {
    const companyName = branding?.companyName || 'Freedom One Properties';
    const contactEmail = branding?.email || 'contact@freedomoneproperties.com';
    const prop = buildSOWProperty();
    return `CONTRACTOR BID REQUEST\n${'='.repeat(50)}\n\nFrom: ${companyName}\nDate: ${new Date().toLocaleDateString()}\nEmail: ${contactEmail}\n\nPROPERTY: ${prop.address}, ${prop.city}, ${prop.state} ${prop.zip}\nType: ${prop.propertyType} | ${prop.beds}bd/${prop.baths}ba | ${prop.sqft.toLocaleString()} sqft\n${data.budgetTarget > 0 ? `Budget Target: $${data.budgetTarget.toLocaleString()}\n` : ''}\nTotal Rehab Budget: $${totals.total.toLocaleString()}\n\nROOM-BY-ROOM SCOPE:\n${prop.rooms.map(room => `\n${room.roomLabel} — $${room.totalCost.toLocaleString()}\n${room.workDescription}\n${room.lineItems.map(li => `  - ${li.item}: ${li.material} (${li.quantity} ${li.unit}) — $${li.totalCost.toLocaleString()}`).join('\n')}`).join('\n\n')}\n\n${bidNote ? `NOTES: ${bidNote}\n\n` : ''}Please submit bids to: ${contactEmail}\n${companyName}`;
  };

  const handleCopyBid = () => {
    navigator.clipboard.writeText(generateBidText());
    setCopied(true);
    toast.success('Bid request copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailBid = () => {
    const emails = bidEmails.split(',').map(e => e.trim()).filter(Boolean);
    const subject = encodeURIComponent(`Bid Request: ${data.address || 'Custom Property'}`);
    const body = encodeURIComponent(generateBidText());
    window.open(`mailto:${emails.join(',')}?subject=${subject}&body=${body}`, '_blank');
    handleDownloadExcel();
    toast.info('Excel SOW downloaded — attach it to your email');
  };

  const handleSendToAnalyzer = () => {
    localStorage.setItem('sow-to-analyzer', JSON.stringify({
      timestamp: Date.now(),
      property: {
        address: data.address, city: data.city, state: data.state, zip: data.zip,
        beds: data.beds, baths: data.baths, sqft: data.sqft, yearBuilt: data.yearBuilt,
        propertyType: data.propertyType, purchasePrice: data.purchasePrice,
      },
      arv: data.arv,
      tier: data.tier,
      roomConditions: Object.fromEntries(data.rooms.map(r => [r.roomType.replace('-', '_'), r.condition === 'cosmetic' ? 'light' : r.condition])),
      roomCount: data.rooms.length,
    }));
    window.location.href = '/analyzer';
  };

  // ─── LIST VIEW ─────────────────────────────────────────────
  if (view === 'list') {
    const sows = savedSows.data || [];
    return (
      <div className="space-y-6">
        <section className="container pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
              <h2 className="text-lg font-bold">My Custom SOWs</h2>
              {sows.length > 0 && <Badge variant="outline" className="text-xs">{sows.length}</Badge>}
            </div>
            <Button className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white" onClick={handleNewSow}>
              <Plus className="w-4 h-4" /> New SOW
            </Button>
          </div>

          {!isAuthenticated && (
            <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-border">
              <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
              <h3 className="text-lg font-semibold mb-1">Sign In to Save SOWs</h3>
              <p className="text-sm text-muted-foreground mb-4">Create an account to save, edit, and manage your custom scopes of work</p>
              <Button onClick={() => window.location.href = getLoginUrl()} className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
                Sign In
              </Button>
            </div>
          )}

          {isAuthenticated && savedSows.isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Loading your SOWs...</p>
            </div>
          )}

          {isAuthenticated && !savedSows.isLoading && sows.length === 0 && (
            <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-border">
              <Home className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
              <h3 className="text-lg font-semibold mb-1">No Custom SOWs Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first custom scope of work for a property</p>
              <Button onClick={handleNewSow} className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
                <Plus className="w-4 h-4" /> Create First SOW
              </Button>
            </div>
          )}

          {isAuthenticated && sows.length > 0 && (
            <div className="grid gap-3">
              {sows.map((sow: any) => {
                const statusCfg = STATUS_CONFIG[sow.status] || STATUS_CONFIG.draft;
                const StatusIcon = statusCfg.icon;
                return (
                  <Card key={sow.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleLoadSow(sow)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)]/10 shrink-0">
                            <FileText className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm truncate">{sow.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              {sow.propertyCity && <span>{sow.propertyCity}, {sow.propertyState}</span>}
                              <span className={`flex items-center gap-1 ${statusCfg.color}`}>
                                <StatusIcon className="w-3 h-3" /> {statusCfg.label}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-sm font-bold">${(sow.totalCost || 0).toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {JSON.parse(sow.roomsData || '[]').length} rooms
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); duplicateMutation.mutate({ id: sow.id }); }}>
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteSow(sow.id); }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  // ─── EDITOR VIEW ───────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header with Back + Save */}
      <section className="container pt-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2 text-sm" onClick={() => setView('list')}>
            <ArrowLeft className="w-4 h-4" /> Back to My SOWs
          </Button>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {editingId ? 'Update SOW' : 'Save SOW'}
            </Button>
          </div>
        </div>
      </section>

      {/* Property Details Form */}
      <section className="container">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
          <h2 className="text-lg font-bold">{editingId ? 'Edit Property Details' : 'Property Details'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2">
            <Label className="text-xs">Street Address</Label>
            <Input value={data.address} onChange={e => updateField('address', e.target.value)} placeholder="123 Main St" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">City</Label>
            <Input value={data.city} onChange={e => updateField('city', e.target.value)} placeholder="City" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">State</Label>
              <Input value={data.state} onChange={e => updateField('state', e.target.value)} placeholder="TX" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">ZIP</Label>
              <Input value={data.zip} onChange={e => updateField('zip', e.target.value)} placeholder="75001" className="mt-1" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mt-3">
          <div>
            <Label className="text-xs">Beds</Label>
            <Input type="number" value={data.beds} onChange={e => updateField('beds', +e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Baths</Label>
            <Input type="number" value={data.baths} onChange={e => updateField('baths', +e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Sq Ft</Label>
            <Input type="number" value={data.sqft} onChange={e => updateField('sqft', +e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Year Built</Label>
            <Input type="number" value={data.yearBuilt} onChange={e => updateField('yearBuilt', +e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Purchase $</Label>
            <Input type="number" value={data.purchasePrice || ''} onChange={e => updateField('purchasePrice', +e.target.value)} placeholder="0" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">ARV $</Label>
            <Input type="number" value={data.arv || ''} onChange={e => updateField('arv', +e.target.value)} placeholder="0" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Budget Target $</Label>
            <Input type="number" value={data.budgetTarget || ''} onChange={e => updateField('budgetTarget', +e.target.value)} placeholder="0" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Tier</Label>
            <select
              value={data.tier}
              onChange={e => updateField('tier', e.target.value as 'rental' | 'standard' | 'luxury')}
              className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="rental">Rental</option>
              <option value="standard">Standard</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>
      </section>

      {/* Budget Tracker */}
      {data.budgetTarget > 0 && (
        <section className="container">
          <div className={`rounded-lg p-4 border ${budgetDiff >= 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Budget Tracker</span>
              <span className={`text-sm font-bold ${budgetDiff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {budgetDiff >= 0 ? `$${budgetDiff.toLocaleString()} under budget` : `$${Math.abs(budgetDiff).toLocaleString()} over budget`}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${budgetPct <= 100 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(budgetPct, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">$0</span>
              <span className="text-[10px] text-muted-foreground font-medium">{budgetPct}% of ${data.budgetTarget.toLocaleString()}</span>
            </div>
          </div>
        </section>
      )}

      {/* Add Rooms */}
      <section className="container">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
            <h2 className="text-lg font-bold">Add Rooms</h2>
          </div>
          <Badge variant="outline" className="text-xs">{data.rooms.length} rooms added</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map(rt => (
            <Button
              key={rt.id}
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => addRoom(rt.id)}
            >
              <span>{ROOM_TYPE_ICONS[rt.id] || '🏠'}</span>
              {rt.label}
              <Plus className="w-3 h-3" />
            </Button>
          ))}
        </div>
      </section>

      {/* Room Cards */}
      {data.rooms.length > 0 && (
        <section className="container space-y-3">
          {data.rooms.map((room, idx) => {
            const roomMat = room.lineItems.reduce((s, li) => s + adjustCost(li.materialCost, 'material'), 0);
            const roomLab = room.lineItems.reduce((s, li) => s + adjustCost(li.laborCost, 'labor'), 0);
            const roomTotal = roomMat + roomLab;
            const isExpanded = expandedRooms.has(room.id);

            return (
              <Card key={room.id} className="overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                  onClick={() => toggleRoom(room.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{ROOM_TYPE_ICONS[room.roomType] || '🏠'}</span>
                    <div>
                      <h3 className="font-semibold text-sm">{room.roomLabel}</h3>
                      <p className="text-xs text-muted-foreground">{room.lineItems.length} items | {room.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold">${roomTotal.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Mat: ${roomMat.toLocaleString()} | Lab: ${roomLab.toLocaleString()}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500" onClick={(e) => { e.stopPropagation(); removeRoom(room.id); }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <CardContent className="pt-0 pb-4 px-4 space-y-3">
                    {/* Condition Selector */}
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Condition:</Label>
                      {(['cosmetic', 'moderate', 'full'] as const).map(c => (
                        <button
                          key={c}
                          onClick={() => updateRoom(room.id, { condition: c })}
                          className={`px-3 py-1 rounded text-xs font-medium transition-all ${room.condition === c ? 'bg-[oklch(0.48_0.20_18)] text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
                        >
                          {c === 'cosmetic' ? 'Cosmetic' : c === 'moderate' ? 'Moderate' : 'Full'}
                        </button>
                      ))}
                    </div>

                    {/* Notes */}
                    <div>
                      <Label className="text-xs">Work Description / Notes</Label>
                      <Textarea
                        value={room.notes}
                        onChange={e => updateRoom(room.id, { notes: e.target.value })}
                        placeholder="Describe the scope of work for this room..."
                        rows={2}
                        className="mt-1 text-xs"
                      />
                    </div>

                    {/* Line Items Table */}
                    <div className="overflow-x-auto rounded border border-border/50">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-secondary/50">
                            <th className="text-left p-2 font-semibold">Item</th>
                            <th className="text-left p-2 font-semibold">Material / Description</th>
                            <th className="text-right p-2 font-semibold w-16">Qty</th>
                            <th className="text-left p-2 font-semibold w-14">Unit</th>
                            <th className="text-right p-2 font-semibold w-24">Material $</th>
                            <th className="text-right p-2 font-semibold w-24">Labor $</th>
                            <th className="text-right p-2 font-semibold w-24">Total</th>
                            <th className="w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {room.lineItems.map(li => (
                            <tr key={li.id} className="border-t border-border/30">
                              <td className="p-2">
                                <Input value={li.item} onChange={e => updateLineItem(room.id, li.id, { item: e.target.value })} className="h-7 text-xs" placeholder="Item name" />
                              </td>
                              <td className="p-2">
                                <Input value={li.material} onChange={e => updateLineItem(room.id, li.id, { material: e.target.value })} className="h-7 text-xs" placeholder="Material description" />
                              </td>
                              <td className="p-2">
                                <Input type="number" value={li.quantity} onChange={e => updateLineItem(room.id, li.id, { quantity: +e.target.value })} className="h-7 text-xs text-right" />
                              </td>
                              <td className="p-2">
                                <Input value={li.unit} onChange={e => updateLineItem(room.id, li.id, { unit: e.target.value })} className="h-7 text-xs" />
                              </td>
                              <td className="p-2">
                                <Input type="number" value={li.materialCost} onChange={e => updateLineItem(room.id, li.id, { materialCost: +e.target.value })} className="h-7 text-xs text-right" />
                              </td>
                              <td className="p-2">
                                <Input type="number" value={li.laborCost} onChange={e => updateLineItem(room.id, li.id, { laborCost: +e.target.value })} className="h-7 text-xs text-right" />
                              </td>
                              <td className="p-2 text-right font-medium tabular-nums">
                                ${(adjustCost(li.materialCost, 'material') + adjustCost(li.laborCost, 'labor')).toLocaleString()}
                              </td>
                              <td className="p-2">
                                <button onClick={() => removeLineItem(room.id, li.id)} className="text-red-400 hover:text-red-600">
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-secondary/40 font-bold border-t border-border">
                            <td colSpan={4} className="p-2">ROOM TOTAL</td>
                            <td className="p-2 text-right tabular-nums">${roomMat.toLocaleString()}</td>
                            <td className="p-2 text-right tabular-nums">${roomLab.toLocaleString()}</td>
                            <td className="p-2 text-right tabular-nums">${roomTotal.toLocaleString()}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => addLineItem(room.id)}>
                      <Plus className="w-3 h-3" /> Add Line Item
                    </Button>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </section>
      )}

      {/* Summary & Actions */}
      {data.rooms.length > 0 && (
        <section className="container pb-8">
          <div className="bg-[oklch(0.12_0_0)] text-white rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Custom SOW Summary</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <ShoppingCart className="w-5 h-5 mx-auto mb-1 text-[oklch(0.65_0.18_18)]" />
                <p className="text-xl font-bold">${totals.materials.toLocaleString()}</p>
                <p className="text-[10px] text-white/50 uppercase">Materials</p>
              </div>
              <div className="text-center">
                <Wrench className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                <p className="text-xl font-bold">${totals.labor.toLocaleString()}</p>
                <p className="text-[10px] text-white/50 uppercase">Labor</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <p className="text-xl font-bold text-emerald-400">${totals.total.toLocaleString()}</p>
                <p className="text-[10px] text-white/50 uppercase">Total Rehab</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="gap-1.5 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button size="sm" className="gap-1.5 bg-white/10 hover:bg-white/20 text-white" onClick={handlePrintSOW}>
                <Download className="w-3.5 h-3.5" /> Download PDF
              </Button>
              <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleDownloadExcel}>
                <Grid3X3 className="w-3.5 h-3.5" /> Download Excel
              </Button>
              <Button size="sm" className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => setShowBidModal(true)}>
                <Send className="w-3.5 h-3.5" /> Send to Contractor
              </Button>
              <Button size="sm" className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white" onClick={handleSendToAnalyzer}>
                <Calculator className="w-3.5 h-3.5" /> Analyze This Deal
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {data.rooms.length === 0 && (
        <section className="container pb-8">
          <div className="text-center py-16 bg-secondary/20 rounded-xl border border-dashed border-border">
            <Home className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold mb-1">No Rooms Added Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Click the room buttons above to start building your custom scope of work</p>
          </div>
        </section>
      )}

      {/* Bid Request Modal */}
      <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-violet-500" /> Send Bid Request
            </DialogTitle>
            <DialogDescription>
              Send the custom SOW for {data.address || 'your property'} to contractors.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div>
              <Label className="text-sm">Contractor Email(s)</Label>
              <Input placeholder="contractor@email.com" value={bidEmails} onChange={e => setBidEmails(e.target.value)} className="mt-1" />
              <p className="text-[10px] text-muted-foreground mt-1">Separate multiple with commas</p>
            </div>
            <div>
              <Label className="text-sm">Additional Notes</Label>
              <Textarea placeholder="Timeline, access details..." value={bidNote} onChange={e => setBidNote(e.target.value)} rows={2} className="mt-1" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1 gap-2 bg-violet-600 hover:bg-violet-700 text-white" onClick={handleEmailBid} disabled={!bidEmails.trim()}>
                <Mail className="w-4 h-4" /> Email
              </Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={handleCopyBid}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
