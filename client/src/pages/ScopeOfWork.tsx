import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getDefaultRoomScopes,
  type RoomScope,
  type MaterialTier,
  type RoomCondition,
} from '@/lib/scopeOfWork';
import {
  ClipboardList, Download, ExternalLink, ChevronDown, ChevronUp,
  Printer, DollarSign, Wrench, ShoppingCart
} from 'lucide-react';

const TIER_LABELS: Record<MaterialTier, string> = {
  rental: 'Rental Grade',
  standard: 'Standard Grade',
  luxury: 'Luxury Grade',
};

const TIER_COLORS: Record<MaterialTier, string> = {
  rental: 'bg-[oklch(0.45_0_0)]/10 text-[oklch(0.35_0_0)]',
  standard: 'bg-[oklch(0.48_0.20_18)]/10 text-[oklch(0.48_0.20_18)]',
  luxury: 'bg-[oklch(0.55_0.15_50)]/10 text-[oklch(0.45_0.12_50)]',
};

const CONDITION_LABELS: Record<RoomCondition, string> = {
  none: 'Not Needed',
  cosmetic: 'Cosmetic',
  moderate: 'Moderate',
  full: 'Full Gut',
};

function shouldIncludeItem(itemLevel: 'cosmetic' | 'moderate' | 'full', roomCondition: RoomCondition): boolean {
  if (roomCondition === 'none') return false;
  if (roomCondition === 'full') return true;
  if (roomCondition === 'moderate') return itemLevel === 'cosmetic' || itemLevel === 'moderate';
  if (roomCondition === 'cosmetic') return itemLevel === 'cosmetic';
  return false;
}

function RoomTemplate({ room, tier }: { room: RoomScope; tier: MaterialTier }) {
  const [expanded, setExpanded] = useState(false);
  const [condition, setCondition] = useState<RoomCondition>('moderate');

  const activeItems = room.items.filter(item => shouldIncludeItem(item.conditionLevel, condition));

  const totalMaterial = activeItems.reduce((sum, item) => {
    const cost = tier === 'rental' ? item.rentalCost : tier === 'standard' ? item.standardCost : item.luxuryCost;
    return sum + cost * item.quantity;
  }, 0);

  const totalLabor = activeItems.reduce((sum, item) => sum + item.laborPerUnit * item.quantity, 0);

  const handlePrint = () => {
    const printContent = `
      <html><head><title>SOW - ${room.name}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }
        h1 { font-size: 24px; border-bottom: 2px solid #C41E3A; padding-bottom: 8px; }
        h2 { font-size: 16px; color: #3d3d3d; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
        th { background: #f5f5f5; padding: 8px; text-align: left; border: 1px solid #ddd; }
        td { padding: 8px; border: 1px solid #ddd; }
        .total { font-weight: bold; background: #f9f9f9; }
        .desc { color: #555; font-style: italic; margin: 12px 0; line-height: 1.6; }
        .footer { margin-top: 30px; font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 10px; }
      </style></head><body>
      <h1>Scope of Work: ${room.name}</h1>
      <p><strong>Tier:</strong> ${TIER_LABELS[tier]} | <strong>Condition:</strong> ${CONDITION_LABELS[condition]}</p>
      <h2>Work Description</h2>
      <p class="desc">${room.workDescription}</p>
      <h2>Material & Labor Breakdown</h2>
      <table>
        <tr><th>Item</th><th>Material</th><th>Qty</th><th>Material Cost</th><th>Labor Cost</th><th>Total</th></tr>
        ${activeItems.map(item => {
          const cost = tier === 'rental' ? item.rentalCost : tier === 'standard' ? item.standardCost : item.luxuryCost;
          const mat = tier === 'rental' ? item.rentalMaterial : tier === 'standard' ? item.standardMaterial : item.luxuryMaterial;
          const matTotal = cost * item.quantity;
          const labTotal = item.laborPerUnit * item.quantity;
          return `<tr><td>${item.item}</td><td>${mat}</td><td>${item.quantity}</td><td>$${matTotal.toLocaleString()}</td><td>$${labTotal.toLocaleString()}</td><td>$${(matTotal + labTotal).toLocaleString()}</td></tr>`;
        }).join('')}
        <tr class="total"><td colspan="3">TOTALS</td><td>$${totalMaterial.toLocaleString()}</td><td>$${totalLabor.toLocaleString()}</td><td>$${(totalMaterial + totalLabor).toLocaleString()}</td></tr>
      </table>
      <div class="footer">
        <p>Freedom One System of Real Estate Investing</p>
        <p>This scope of work is for estimation purposes only. Actual costs may vary based on market conditions, property condition, and contractor pricing.</p>
      </div>
      </body></html>
    `;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(printContent);
      w.document.close();
      w.print();
    }
  };

  return (
    <Card className="border-border/60 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{room.icon}</span>
          <div>
            <h3 className="font-bold text-base">{room.name}</h3>
            <p className="text-xs text-muted-foreground">{room.items.length} line items</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">${(totalMaterial + totalLabor).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{CONDITION_LABELS[condition]}</p>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <CardContent className="p-4 pt-0 border-t border-border/50">
          {/* Work Description */}
          <div className="bg-secondary/40 rounded-lg p-3 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Work Description</p>
            <p className="text-sm leading-relaxed">{room.workDescription}</p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Condition:</span>
              {(['cosmetic', 'moderate', 'full'] as RoomCondition[]).map(c => (
                <button
                  key={c}
                  onClick={() => setCondition(c)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    condition === c
                      ? 'bg-[oklch(0.48_0.20_18)] text-white font-medium'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  {CONDITION_LABELS[c]}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePrint}>
                <Printer className="w-3.5 h-3.5" /> Print SOW
              </Button>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[oklch(0.48_0.20_18)]/5 rounded-lg p-3 text-center">
              <ShoppingCart className="w-4 h-4 mx-auto mb-1 text-[oklch(0.48_0.20_18)]" />
              <p className="text-lg font-bold">${totalMaterial.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Materials</p>
            </div>
            <div className="bg-[oklch(0.32_0_0)]/5 rounded-lg p-3 text-center">
              <Wrench className="w-4 h-4 mx-auto mb-1 text-[oklch(0.32_0_0)]" />
              <p className="text-lg font-bold">${totalLabor.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Labor</p>
            </div>
            <div className="bg-[oklch(0.15_0_0)]/5 rounded-lg p-3 text-center">
              <DollarSign className="w-4 h-4 mx-auto mb-1 text-[oklch(0.15_0_0)]" />
              <p className="text-lg font-bold">${(totalMaterial + totalLabor).toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Total</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-2 font-semibold text-xs">Item</th>
                  <th className="text-left p-2 font-semibold text-xs">Material ({TIER_LABELS[tier]})</th>
                  <th className="text-left p-2 font-semibold text-xs hidden md:table-cell">Home Depot Link</th>
                  <th className="text-right p-2 font-semibold text-xs">Qty</th>
                  <th className="text-right p-2 font-semibold text-xs">Mat. Cost</th>
                  <th className="text-right p-2 font-semibold text-xs">Labor</th>
                  <th className="text-right p-2 font-semibold text-xs">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {activeItems.map((item, i) => {
                  const cost = tier === 'rental' ? item.rentalCost : tier === 'standard' ? item.standardCost : item.luxuryCost;
                  const material = tier === 'rental' ? item.rentalMaterial : tier === 'standard' ? item.standardMaterial : item.luxuryMaterial;
                  const product = tier === 'rental' ? item.rentalProduct : tier === 'standard' ? item.standardProduct : item.luxuryProduct;
                  const matTotal = cost * item.quantity;
                  const labTotal = item.laborPerUnit * item.quantity;
                  return (
                    <tr key={i} className="border-b border-border/30 hover:bg-secondary/20">
                      <td className="p-2">
                        <p className="font-medium text-xs">{item.item}</p>
                        <p className="text-[10px] text-muted-foreground">{item.description}</p>
                      </td>
                      <td className="p-2 text-xs">{material}</td>
                      <td className="p-2 hidden md:table-cell">
                        {product && (
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-[oklch(0.48_0.20_18)] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            SKU: {product.sku} ({product.price})
                          </a>
                        )}
                      </td>
                      <td className="p-2 text-right text-xs tabular-nums">{item.quantity} {item.unit}</td>
                      <td className="p-2 text-right text-xs tabular-nums">${matTotal.toLocaleString()}</td>
                      <td className="p-2 text-right text-xs tabular-nums">${labTotal.toLocaleString()}</td>
                      <td className="p-2 text-right text-xs font-medium tabular-nums">${(matTotal + labTotal).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-secondary/40 font-bold">
                  <td colSpan={4} className="p-2 text-xs">TOTALS</td>
                  <td className="p-2 text-right text-xs tabular-nums">${totalMaterial.toLocaleString()}</td>
                  <td className="p-2 text-right text-xs tabular-nums">${totalLabor.toLocaleString()}</td>
                  <td className="p-2 text-right text-xs tabular-nums">${(totalMaterial + totalLabor).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-muted-foreground mt-3 italic">
            Costs are estimates based on national averages. Actual costs vary by market, contractor, and property condition. 
            Home Depot prices are subject to change. Always get multiple contractor bids before starting work.
          </p>
        </CardContent>
      )}
    </Card>
  );
}

export default function ScopeOfWork() {
  const rooms = getDefaultRoomScopes();
  const [tier, setTier] = useState<MaterialTier>('standard');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-[oklch(0.48_0.20_18)]/20">
              <ClipboardList className="w-6 h-6 text-[oklch(0.65_0.18_18)]" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Scope of Work Templates</h1>
              <p className="text-sm text-[oklch(0.55_0_0)]">Professional SOW templates for every room — 14 categories, 3 material tiers</p>
            </div>
          </div>
          <p className="text-[oklch(0.6_0_0)] text-sm max-w-2xl mt-3 leading-relaxed">
            Each template includes a detailed work description, line-by-line material and labor breakdowns, 
            Home Depot product links with SKU numbers, and printable SOW documents. Select a material tier 
            and condition level to customize costs for your project.
          </p>
        </div>
      </section>

      {/* Tier Selector */}
      <section className="border-b border-border/50 bg-secondary/20">
        <div className="container py-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">Material Tier:</span>
          {(['rental', 'standard', 'luxury'] as MaterialTier[]).map(t => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tier === t
                  ? 'bg-[oklch(0.48_0.20_18)] text-white shadow-sm'
                  : 'bg-background border border-border text-muted-foreground hover:border-[oklch(0.48_0.20_18)]/30'
              }`}
            >
              {TIER_LABELS[t]}
            </button>
          ))}
          <Badge variant="outline" className={`ml-2 ${TIER_COLORS[tier]}`}>
            {tier === 'rental' ? 'Builder-grade materials for investment properties' :
             tier === 'standard' ? 'Mid-range popular materials for owner-occupied homes' :
             'High-end finishes for luxury flips and premium markets'}
          </Badge>
        </div>
      </section>

      {/* Room Templates */}
      <section className="container py-8">
        <div className="space-y-3">
          {rooms.map(room => (
            <RoomTemplate key={room.id} room={room} tier={tier} />
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-secondary/30 border-t border-border/50">
        <div className="container py-6">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            <strong>Disclaimer:</strong> All costs, materials, and labor estimates provided in these scope of work templates 
            are for informational and estimation purposes only. Freedom One System of Real Estate Investing does not guarantee 
            the accuracy of pricing, availability of materials, or contractor labor rates. Actual costs will vary based on 
            geographic location, property condition, market conditions, and contractor pricing. Always obtain multiple bids 
            from licensed contractors before beginning any renovation work. Home Depot product links and prices are subject 
            to change without notice. This is not professional construction advice — consult with licensed professionals 
            for your specific project needs.
          </p>
        </div>
      </section>
    </div>
  );
}
