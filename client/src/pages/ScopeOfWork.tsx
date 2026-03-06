import { useState, useMemo } from 'react';
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
  SOW_TEMPLATES, SOW_ROOM_TYPES,
  getTemplatesByRoom, getCostLevelLabel, formatCurrency,
  applyRegionalToTemplate,
  type SOWTemplate,
} from '@/lib/sowTemplates';
import {
  METRO_COST_INDEX,
} from '@/lib/regionalCosts';
import { useMarketSelector, getAdjustmentPercent, type MarketSelection, ALL_MARKETS } from '@/hooks/useMarketSelector';
import { MarketSelector, AdjustmentBadge, RegionalIndicatorBar, ResetToNationalButton } from '@/components/MarketSelector';
import {
  ClipboardList, Download, ExternalLink, ChevronDown, ChevronUp,
  Printer, DollarSign, Wrench, ShoppingCart, X, Home as HomeIcon,
  BedDouble, Bath, Ruler, Grid3X3, List, Search, Filter,
  MapPin, TrendingUp, TrendingDown, Minus, Globe
} from 'lucide-react';
import { useBranding, type BrandingConfig } from '@/lib/branding';
import { ProductStatusBadge } from '@/components/ProductStatusBadge';
import { useProductCatalog } from '@/hooks/useProductCatalog';

// ─── REGIONAL MARKET SELECTOR ─────────────────────────────────
// Now uses shared hook and components from @/hooks/useMarketSelector and @/components/MarketSelector

// AdjustmentBadge is now imported from @/components/MarketSelector

// MarketSelector, AdjustmentBadge, and RegionalIndicatorBar are now imported from @/components/MarketSelector

// ─── EXISTING LINE-ITEM ESTIMATOR COMPONENTS ───────────────────

const ROOM_PHOTOS: Record<string, string> = {
  kitchen: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/XjptCWlDNzqbLcAP.jpg',
  master_bath: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/znMMrZzfhlGUiJip.jpg',
  full_bath: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/qchUwTpQIGFVloON.jpg',
  half_bath: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/QaBEfplLodnsScxp.jpg',
  living_room: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/HGwUrMfbxwBDiCPf.jpg',
  bedroom: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/SzvmqQjopyJPODmH.jpg',
  landscaping: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/TTVHZLiSqaVusTbA.jpg',
  roof_gutter: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/sHtCFAWYgjXHCgMN.webp',
  garage: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/jqqHWEsKXKxMEzCu.jpg',
};

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

const COST_LEVEL_COLORS: Record<number, string> = {
  1: 'bg-emerald-100 text-emerald-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-amber-100 text-amber-700',
  4: 'bg-purple-100 text-purple-700',
};

function shouldIncludeItem(itemLevel: 'cosmetic' | 'moderate' | 'full', roomCondition: RoomCondition): boolean {
  if (roomCondition === 'none') return false;
  if (roomCondition === 'full') return true;
  if (roomCondition === 'moderate') return itemLevel === 'cosmetic' || itemLevel === 'moderate';
  if (roomCondition === 'cosmetic') return itemLevel === 'cosmetic';
  return false;
}

function RoomTemplate({ room, tier, market, branding, catalogMap }: { room: RoomScope; tier: MaterialTier; market: MarketSelection; branding?: BrandingConfig; catalogMap?: Map<string, any> }) {
  const photoUrl = ROOM_PHOTOS[room.id];
  const [expanded, setExpanded] = useState(false);
  const [condition, setCondition] = useState<RoomCondition>('moderate');

  const activeItems = room.items.filter(item => shouldIncludeItem(item.conditionLevel, condition));

  const totalMaterial = activeItems.reduce((sum, item) => {
    const cost = tier === 'rental' ? item.rentalCost : tier === 'standard' ? item.standardCost : item.luxuryCost;
    return sum + Math.round(cost * item.quantity * market.materialsFactor);
  }, 0);

  const totalLabor = activeItems.reduce((sum, item) => {
    return sum + Math.round(item.laborPerUnit * item.quantity * market.laborFactor);
  }, 0);

  const handlePrint = () => {
    const regionNote = market.key !== 'national' ? `<p><strong>Market:</strong> ${market.label} (Materials ${getAdjustmentPercent(market.materialsFactor) >= 0 ? '+' : ''}${getAdjustmentPercent(market.materialsFactor)}%, Labor ${getAdjustmentPercent(market.laborFactor) >= 0 ? '+' : ''}${getAdjustmentPercent(market.laborFactor)}%)</p>` : '';
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
      ${regionNote}
      <h2>Work Description</h2>
      <p class="desc">${room.workDescription}</p>
      <h2>Material & Labor Breakdown</h2>
      <table>
        <tr><th>Item</th><th>Material</th><th>Qty</th><th>Material Cost</th><th>Labor Cost</th><th>Total</th></tr>
        ${activeItems.map(item => {
          const cost = tier === 'rental' ? item.rentalCost : tier === 'standard' ? item.standardCost : item.luxuryCost;
          const mat = tier === 'rental' ? item.rentalMaterial : tier === 'standard' ? item.standardMaterial : item.luxuryMaterial;
          const matTotal = Math.round(cost * item.quantity * market.materialsFactor);
          const labTotal = Math.round(item.laborPerUnit * item.quantity * market.laborFactor);
          return `<tr><td>${item.item}</td><td>${mat}</td><td>${item.quantity}</td><td>$${matTotal.toLocaleString()}</td><td>$${labTotal.toLocaleString()}</td><td>$${(matTotal + labTotal).toLocaleString()}</td></tr>`;
        }).join('')}
        <tr class="total"><td colspan="3">TOTALS</td><td>$${totalMaterial.toLocaleString()}</td><td>$${totalLabor.toLocaleString()}</td><td>$${(totalMaterial + totalLabor).toLocaleString()}</td></tr>
      </table>
      <div class="footer">
        <p>${branding?.footerText || 'Freedom One Real Estate Investment System'}</p>
        ${branding?.logoUrl ? `<div style="margin-bottom:4px"><img src="${branding.logoUrl}" alt="${branding.companyName}" style="height:30px;object-fit:contain" onerror="this.style.display='none'" /></div>` : ''}
        ${branding && (branding.phone || branding.email) ? `<p>${[branding.phone, branding.email].filter(Boolean).join(' | ')}</p>` : ''}
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
          {photoUrl ? (
            <img src={photoUrl} alt={room.name} className="w-16 h-12 rounded-md object-cover" />
          ) : (
            <span className="text-2xl">{room.icon}</span>
          )}
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
          <div className="bg-secondary/40 rounded-lg p-3 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Work Description</p>
            <p className="text-sm leading-relaxed">{room.workDescription}</p>
          </div>

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

          {/* Regional indicator inside expanded room */}
          {market.key !== 'national' && (
            <div className="mb-4">
              <RegionalIndicatorBar market={market} />
            </div>
          )}

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
                  const product = tier === 'rental' ? item.rentalProduct : tier === 'standard' ? item.standardProduct : tier === 'luxury' ? item.luxuryProduct : null;
                  const matTotal = Math.round(cost * item.quantity * market.materialsFactor);
                  const labTotal = Math.round(item.laborPerUnit * item.quantity * market.laborFactor);
                  return (
                    <tr key={i} className="border-b border-border/30 hover:bg-secondary/20">
                      <td className="p-2">
                        <p className="font-medium text-xs">{item.item}</p>
                        <p className="text-[10px] text-muted-foreground">{item.description}</p>
                      </td>
                      <td className="p-2 text-xs">{material}</td>
                      <td className="p-2 hidden md:table-cell">
                        {product && (
                          <ProductStatusBadge
                            product={product}
                            catalogEntry={catalogMap?.get(product.sku)}
                            compact
                          />
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

          <p className="text-[10px] text-muted-foreground mt-3 italic">
            Costs are estimates{market.key !== 'national' ? ` adjusted for ${market.label}` : ' based on national averages'}. Actual costs vary by contractor and property condition. 
            Home Depot prices are subject to change. Always get multiple contractor bids before starting work.
          </p>
        </CardContent>
      )}
    </Card>
  );
}

// ─── TEMPLATE DETAIL MODAL ────────────────────────────────────

function TemplateDetailModal({ template, market, onClose, branding }: { template: SOWTemplate; market: MarketSelection; onClose: () => void; branding?: BrandingConfig }) {
  // Apply regional adjustment
  const adjusted = useMemo(() => applyRegionalToTemplate(template, market.materialsFactor, market.laborFactor), [template, market]);
  const isAdjusted = market.key !== 'national';

  const handlePrint = () => {
    const regionNote = isAdjusted ? `<p style="color: #C41E3A; font-size: 12px; margin-top: 4px;">📍 Adjusted for ${market.label} (Materials ${getAdjustmentPercent(market.materialsFactor) >= 0 ? '+' : ''}${getAdjustmentPercent(market.materialsFactor)}%, Labor ${getAdjustmentPercent(market.laborFactor) >= 0 ? '+' : ''}${getAdjustmentPercent(market.laborFactor)}%)</p>` : '';
    const printContent = `
      <html><head><title>SOW - ${adjusted.name}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 22px; border-bottom: 3px solid #C41E3A; padding-bottom: 8px; margin-bottom: 4px; }
        .subtitle { color: #666; font-size: 13px; margin-bottom: 20px; }
        .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0; }
        .info-box { background: #f5f5f5; padding: 10px; border-radius: 4px; text-align: center; }
        .info-box .label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-box .value { font-size: 16px; font-weight: bold; margin-top: 2px; }
        .cost-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0; }
        .cost-box { padding: 12px; border-radius: 4px; text-align: center; border: 1px solid #ddd; }
        .cost-box.materials { background: #fef2f2; border-color: #fecaca; }
        .cost-box.labor { background: #f0f9ff; border-color: #bae6fd; }
        .cost-box.total { background: #f0fdf4; border-color: #bbf7d0; }
        .cost-box .label { font-size: 10px; color: #666; text-transform: uppercase; }
        .cost-box .value { font-size: 20px; font-weight: bold; }
        h2 { font-size: 15px; color: #333; margin-top: 24px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
        .desc { color: #444; font-size: 13px; line-height: 1.7; margin: 10px 0; }
        .materials-list { list-style: none; padding: 0; margin: 10px 0; }
        .materials-list li { padding: 6px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
        .materials-list li:before { content: "✓ "; color: #C41E3A; font-weight: bold; }
        .footer { margin-top: 30px; font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 10px; }
      </style></head><body>
      <h1>${adjusted.name}</h1>
      <p class="subtitle">${getCostLevelLabel(adjusted.costLevel)} Level | ${adjusted.layoutType} Layout | ${SOW_ROOM_TYPES.find(r => r.id === adjusted.roomType)?.name || adjusted.roomType}</p>
      ${regionNote}
      <div class="info-grid">
        <div class="info-box"><div class="label">Property</div><div class="value">${adjusted.propertyType}</div></div>
        <div class="info-box"><div class="label">Beds</div><div class="value">${adjusted.beds}</div></div>
        <div class="info-box"><div class="label">Baths</div><div class="value">${adjusted.baths}</div></div>
        <div class="info-box"><div class="label">Sq Ft</div><div class="value">${adjusted.sqft.toLocaleString()}</div></div>
      </div>
      <div class="cost-grid">
        <div class="cost-box materials"><div class="label">Materials</div><div class="value">${formatCurrency(adjusted.materialCost)}</div></div>
        <div class="cost-box labor"><div class="label">Labor</div><div class="value">${formatCurrency(adjusted.laborCost)}</div></div>
        <div class="cost-box total"><div class="label">Total Cost</div><div class="value">${formatCurrency(adjusted.totalCost)}</div></div>
      </div>
      <h2>Scope of Work</h2>
      <p class="desc">${adjusted.workDescription}</p>
      <h2>Key Materials</h2>
      <ul class="materials-list">
        ${adjusted.keyMaterials.map(m => `<li>${m}</li>`).join('')}
      </ul>
      <div class="footer">
        ${branding?.logoUrl ? `<div style="margin-bottom:4px"><img src="${branding.logoUrl}" alt="${branding.companyName}" style="height:30px;object-fit:contain" onerror="this.style.display='none'" /></div>` : ''}
        <p><strong>${branding?.footerText || 'Freedom One Real Estate Investment System'}</strong></p>
        ${branding && (branding.phone || branding.email) ? `<p>${[branding.phone, branding.email].filter(Boolean).join(' | ')}</p>` : ''}
        <p>This scope of work is for estimation purposes only. Actual costs may vary based on market conditions, property condition, and contractor pricing. Always obtain multiple bids from licensed contractors.</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-background rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56 sm:h-64">
          <img src={adjusted.photo} alt={adjusted.name} className="w-full h-full object-cover rounded-t-xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-t-xl" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-xs ${COST_LEVEL_COLORS[adjusted.costLevel]}`}>
                {getCostLevelLabel(adjusted.costLevel)}
              </Badge>
              <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                {adjusted.layoutType}
              </Badge>
              {isAdjusted && (
                <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                  <MapPin className="w-3 h-3 mr-1" /> {market.label}
                </Badge>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{adjusted.name}</h2>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Regional Indicator */}
          {isAdjusted && (
            <div className="mb-4">
              <RegionalIndicatorBar market={market} />
            </div>
          )}

          {/* Property Info */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <HomeIcon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs font-bold">{adjusted.propertyType}</p>
              <p className="text-[10px] text-muted-foreground">Type</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <BedDouble className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs font-bold">{adjusted.beds}</p>
              <p className="text-[10px] text-muted-foreground">Beds</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <Bath className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs font-bold">{adjusted.baths}</p>
              <p className="text-[10px] text-muted-foreground">Baths</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <Ruler className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs font-bold">{adjusted.sqft.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Sq Ft</p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-[oklch(0.48_0.20_18)]/8 rounded-lg p-3 text-center">
              <ShoppingCart className="w-4 h-4 mx-auto mb-1 text-[oklch(0.48_0.20_18)]" />
              <p className="text-lg font-bold">{formatCurrency(adjusted.materialCost)}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Materials</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <Wrench className="w-4 h-4 mx-auto mb-1 text-blue-600" />
              <p className="text-lg font-bold">{formatCurrency(adjusted.laborCost)}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Labor</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <DollarSign className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              <p className="text-lg font-bold">{formatCurrency(adjusted.totalCost)}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Total</p>
            </div>
          </div>

          {/* Work Description */}
          <div className="mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Scope of Work</h3>
            <p className="text-sm leading-relaxed">{adjusted.workDescription}</p>
          </div>

          {/* Key Materials */}
          <div className="mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Key Materials</h3>
            <div className="grid sm:grid-cols-2 gap-1.5">
              {adjusted.keyMaterials.map((mat, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.48_0.20_18)] shrink-0" />
                  {mat}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-border/50">
            <Button className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white" onClick={handlePrint}>
              <Download className="w-4 h-4" /> Download SOW
            </Button>
            <Button variant="outline" className="gap-2" onClick={handlePrint}>
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>
        </div>

        <div className="px-5 pb-4">
          <p className="text-[10px] text-muted-foreground italic">
            Costs are estimates{isAdjusted ? ` adjusted for ${market.label}` : ' based on national averages'}. Actual costs vary by contractor and property condition. 
            Always get multiple contractor bids before starting work.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── TEMPLATE CARD ────────────────────────────────────────────

function TemplateCard({ template, market, onClick }: { template: SOWTemplate; market: MarketSelection; onClick: () => void }) {
  const adjusted = useMemo(() => applyRegionalToTemplate(template, market.materialsFactor, market.laborFactor), [template, market]);
  const isAdjusted = market.key !== 'national';

  return (
    <Card
      className="border-border/60 overflow-hidden cursor-pointer hover:shadow-lg transition-all group hover:border-[oklch(0.48_0.20_18)]/30"
      onClick={onClick}
    >
      <div className="relative h-40">
        <img
          src={adjusted.photo}
          alt={adjusted.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge className={`text-[10px] ${COST_LEVEL_COLORS[adjusted.costLevel]}`}>
            {getCostLevelLabel(adjusted.costLevel)}
          </Badge>
        </div>
        {isAdjusted && (
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="text-[10px] bg-black/40 text-white border-white/20">
              <MapPin className="w-2.5 h-2.5 mr-0.5" /> Adjusted
            </Badge>
          </div>
        )}
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-white font-bold text-sm leading-tight line-clamp-2">{adjusted.name}</p>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> {adjusted.beds}</span>
            <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {adjusted.baths}</span>
            <span className="flex items-center gap-1"><Ruler className="w-3 h-3" /> {adjusted.sqft.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{adjusted.layoutType}</p>
          </div>
          <p className="text-base font-bold text-[oklch(0.48_0.20_18)]">{formatCurrency(adjusted.totalCost)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────

export default function ScopeOfWork() {
  const rooms = getDefaultRoomScopes();
  const { branding } = useBranding();
  const { catalogMap } = useProductCatalog();
  const [tier, setTier] = useState<MaterialTier>('standard');
  const [activeTab, setActiveTab] = useState<'library' | 'estimator'>('library');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedCostLevel, setSelectedCostLevel] = useState<number>(0); // 0 = all
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<SOWTemplate | null>(null);
  const { market, selectMarket: setMarket, resetToNational } = useMarketSelector();

  const filteredTemplates = useMemo(() => {
    let filtered = SOW_TEMPLATES;
    if (selectedRoom !== 'all') {
      filtered = filtered.filter(t => t.roomType === selectedRoom);
    }
    if (selectedCostLevel > 0) {
      filtered = filtered.filter(t => t.costLevel === selectedCostLevel);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.workDescription.toLowerCase().includes(q) ||
        t.layoutType.toLowerCase().includes(q) ||
        t.keyMaterials.some(m => m.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [selectedRoom, selectedCostLevel, searchQuery]);

  const roomCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SOW_TEMPLATES.length };
    SOW_ROOM_TYPES.forEach(room => {
      counts[room.id] = getTemplatesByRoom(room.id).length;
    });
    return counts;
  }, []);

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
              <p className="text-sm text-[oklch(0.55_0_0)]">
                {SOW_TEMPLATES.length}+ professional templates across {SOW_ROOM_TYPES.length} room categories
              </p>
            </div>
          </div>
          <p className="text-[oklch(0.6_0_0)] text-sm max-w-2xl mt-3 leading-relaxed">
            Browse our comprehensive library of renovation scope of work templates with photos, property details, 
            cost breakdowns, and downloadable SOW documents. Select your metro market below to automatically adjust 
            all costs for your local area.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.48_0.20_18)]/20 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-[oklch(0.65_0.18_18)]" />
              </div>
              <div>
                <p className="text-lg font-bold">{SOW_TEMPLATES.length}</p>
                <p className="text-[10px] text-[oklch(0.5_0_0)]">Templates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.48_0.20_18)]/20 flex items-center justify-center">
                <Grid3X3 className="w-4 h-4 text-[oklch(0.65_0.18_18)]" />
              </div>
              <div>
                <p className="text-lg font-bold">{SOW_ROOM_TYPES.length}</p>
                <p className="text-[10px] text-[oklch(0.5_0_0)]">Room Types</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.48_0.20_18)]/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[oklch(0.65_0.18_18)]" />
              </div>
              <div>
                <p className="text-lg font-bold">{Object.keys(METRO_COST_INDEX).length}+</p>
                <p className="text-[10px] text-[oklch(0.5_0_0)]">Metro Markets</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.48_0.20_18)]/20 flex items-center justify-center">
                <Download className="w-4 h-4 text-[oklch(0.65_0.18_18)]" />
              </div>
              <div>
                <p className="text-lg font-bold">Free</p>
                <p className="text-[10px] text-[oklch(0.5_0_0)]">Downloads</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Selector + Tab Selector */}
      <section className="border-b border-border/50 bg-secondary/20 sticky top-0 z-30">
        <div className="container py-0">
          {/* Market Selector Row */}
          <div className="flex flex-wrap items-center gap-3 py-3 border-b border-border/30">
            <span className="text-sm font-medium flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
              Your Market:
            </span>
            <MarketSelector market={market} onSelect={setMarket} />
            {market.key !== 'national' && (
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <AdjustmentBadge factor={market.materialsFactor} label="materials" />
                <span className="text-muted-foreground text-xs">·</span>
                <AdjustmentBadge factor={market.laborFactor} label="labor" />
              </div>
            )}
            {market.key !== 'national' && (
              <ResetToNationalButton onClick={resetToNational} />
            )}
          </div>

          {/* Tab Row */}
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'library'
                  ? 'border-[oklch(0.48_0.20_18)] text-[oklch(0.48_0.20_18)]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid3X3 className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              Template Library ({SOW_TEMPLATES.length})
            </button>
            <button
              onClick={() => setActiveTab('estimator')}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'estimator'
                  ? 'border-[oklch(0.48_0.20_18)] text-[oklch(0.48_0.20_18)]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              Line-Item Estimator (14 Rooms)
            </button>
          </div>
        </div>
      </section>

      {/* ─── TEMPLATE LIBRARY TAB ──────────────────────────────── */}
      {activeTab === 'library' && (
        <>
          {/* Filters */}
          <section className="border-b border-border/30 bg-background">
            <div className="container py-4">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search templates by name, layout, materials..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.20_18)]/30 focus:border-[oklch(0.48_0.20_18)]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              {/* Room Type Filter */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => setSelectedRoom('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedRoom === 'all'
                      ? 'bg-[oklch(0.48_0.20_18)] text-white'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  All Rooms ({roomCounts.all})
                </button>
                {SOW_ROOM_TYPES.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedRoom === room.id
                        ? 'bg-[oklch(0.48_0.20_18)] text-white'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {room.icon} {room.name} ({roomCounts[room.id]})
                  </button>
                ))}
              </div>

              {/* Cost Level Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mr-1">Cost Level:</span>
                <button
                  onClick={() => setSelectedCostLevel(0)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedCostLevel === 0
                      ? 'bg-[oklch(0.15_0_0)] text-white'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  All
                </button>
                {[1, 2, 3, 4].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedCostLevel(level)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      selectedCostLevel === level
                        ? COST_LEVEL_COLORS[level]
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {getCostLevelLabel(level)}
                  </button>
                ))}
                <span className="text-xs text-muted-foreground ml-2">
                  Showing {filteredTemplates.length} of {SOW_TEMPLATES.length} templates
                </span>
              </div>
            </div>
          </section>

          {/* Template Grid */}
          <section className="container py-6">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-16">
                <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-lg font-medium text-muted-foreground">No templates match your filters</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your search or filter criteria</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSelectedRoom('all'); setSelectedCostLevel(0); setSearchQuery(''); }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTemplates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    market={market}
                    onClick={() => setSelectedTemplate(template)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* ─── LINE-ITEM ESTIMATOR TAB ───────────────────────────── */}
      {activeTab === 'estimator' && (
        <>
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
                <RoomTemplate key={room.id} room={room} tier={tier} market={market} branding={branding} catalogMap={catalogMap} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Disclaimer */}
      <section className="bg-secondary/30 border-t border-border/50">
        <div className="container py-6">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            <strong>Disclaimer:</strong> All costs, materials, and labor estimates provided in these scope of work templates 
            are for informational and estimation purposes only. {market.key !== 'national' && `Costs shown are adjusted for the ${market.label} market using RSMeans Construction Cost Index data. `}
            Freedom One System of Real Estate Investing does not guarantee 
            the accuracy of pricing, availability of materials, or contractor labor rates. Actual costs will vary based on 
            geographic location, property condition, market conditions, and contractor pricing. Always obtain multiple bids 
            from licensed contractors before beginning any renovation work. Home Depot product links and prices are subject 
            to change without notice. This is not professional construction advice — consult with licensed professionals 
            for your specific project needs.
          </p>
        </div>
      </section>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <TemplateDetailModal
          template={selectedTemplate}
          market={market}
          onClose={() => setSelectedTemplate(null)}
          branding={branding}
        />
      )}
    </div>
  );
}
