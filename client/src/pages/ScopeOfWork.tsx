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
  SOW_PROPERTIES, ROOM_TYPE_LABELS, ROOM_TYPE_ICONS, TIER_LABELS as PROP_TIER_LABELS, TIER_COLORS as PROP_TIER_COLORS,
  applyRegionalToProperty, getBeforePhoto,
  type SOWProperty, type SOWRoomTemplate,
} from '@/lib/sowProperties';
import {
  METRO_COST_INDEX,
} from '@/lib/regionalCosts';
import { useMarketSelector, getAdjustmentPercent, type MarketSelection, ALL_MARKETS } from '@/hooks/useMarketSelector';
import { MarketSelector, AdjustmentBadge, RegionalIndicatorBar, ResetToNationalButton } from '@/components/MarketSelector';
import {
  ClipboardList, Download, ExternalLink, ChevronDown, ChevronUp,
  Printer, DollarSign, Wrench, ShoppingCart, X, Home as HomeIcon,
  BedDouble, Bath, Ruler, Grid3X3, List, Search, Filter,
  MapPin, TrendingUp, TrendingDown, Minus, Globe, Building2,
  ArrowLeft, Calendar, Tag, ChevronRight, Eye, Calculator, Mail, Copy, Check, Send, Users
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useBranding, type BrandingConfig } from '@/lib/branding';
import { ProductStatusBadge } from '@/components/ProductStatusBadge';
import { generateSOWExcel } from '@/lib/generateSOWExcel';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { CustomSOWBuilder } from '@/components/CustomSOWBuilder';
import { useProductCatalog } from '@/hooks/useProductCatalog';

// ─── EXISTING CONSTANTS ──────────────────────────────────────

const ROOM_PHOTOS: Record<string, string> = {
  kitchen: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/kitchen-renovation-VAScJqpabjMKMBmWt2kLWx.webp',
  master_bath: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/master-bath-renovation-kf4vnpPZaPYbHEZxqJZ4zC.webp',
  full_bath: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/full-bath-renovation-6VV4mWiuMNQbCghGAJP5Ha.webp',
  half_bath: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/half-bath-renovation-o2wdNp3cbyex7BUEWQK3Ab.webp',
  living_room: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/living-room-renovation-9n6q3m5FtMNgnZX3nCfBUX.webp',
  bedroom: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/bedroom-renovation-oGGRFNkYesZ8uh8n9mYGHi.webp',
  landscaping: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/landscaping-renovation-GxzA9vQjDiVrCkCHYx6ggZ.webp',
  roof_gutter: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/roof-gutter-renovation-eXFtmbdA8Xzs9XmwsgALpe.webp',
  garage: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/garage-renovation-dDfnnqzhvXQ5VjnGW5Jcv8.webp',
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

// ─── PROPERTY CARD COMPONENT ─────────────────────────────────

function PropertyCard({ property, market, onClick }: { property: SOWProperty; market: MarketSelection; onClick: () => void }) {
  const adjusted = useMemo(() => applyRegionalToProperty(property, market.materialsFactor, market.laborFactor), [property, market]);
  const totalRehab = adjusted.rooms.reduce((sum, r) => sum + r.totalCost, 0);
  const tierColor = property.tier === 'luxury' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
    property.tier === 'standard' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

  return (
    <Card
      className="border-border/60 overflow-hidden cursor-pointer hover:shadow-xl transition-all group hover:border-[oklch(0.48_0.20_18)]/40"
      onClick={onClick}
    >
      <div className="relative h-48">
        <img
          src={property.heroPhoto}
          alt={property.address}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge className={`text-[10px] border ${tierColor}`}>
            {PROP_TIER_LABELS[property.tier]}
          </Badge>
          <Badge variant="outline" className="text-[10px] bg-black/40 text-white border-white/20">
            {property.style}
          </Badge>
        </div>
        {market.key !== 'national' && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="text-[10px] bg-black/40 text-white border-white/20">
              <MapPin className="w-2.5 h-2.5 mr-0.5" /> Adjusted
            </Badge>
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-bold text-lg leading-tight">{property.address}</p>
          <p className="text-white/70 text-xs">{property.city}, {property.state} {property.zip}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {property.beds} Beds</span>
          <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.baths} Baths</span>
          <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {property.sqft.toLocaleString()} sqft</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Purchase</p>
            <p className="text-sm font-bold">${(adjusted.purchasePrice / 1000).toFixed(0)}K</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Rehab</p>
            <p className="text-sm font-bold text-[oklch(0.48_0.20_18)]">${(totalRehab / 1000).toFixed(0)}K</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase">ARV</p>
            <p className="text-sm font-bold text-emerald-500">${(adjusted.arv / 1000).toFixed(0)}K</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <span className="text-xs text-muted-foreground">{property.rooms.length} Room SOWs</span>
          <span className="text-xs text-[oklch(0.48_0.20_18)] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            View Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── PROPERTY DETAIL VIEW ────────────────────────────────────

function PropertyDetail({ property, market, onBack, branding }: {
  property: SOWProperty;
  market: MarketSelection;
  onBack: () => void;
  branding?: BrandingConfig;
}) {
  const adjusted = useMemo(() => applyRegionalToProperty(property, market.materialsFactor, market.laborFactor), [property, market]);
  const totalRehab = adjusted.rooms.reduce((sum, r) => sum + r.totalCost, 0);
  const totalMaterials = adjusted.rooms.reduce((sum, r) => sum + r.materialCost, 0);
  const totalLabor = adjusted.rooms.reduce((sum, r) => sum + r.laborCost, 0);
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidEmails, setBidEmails] = useState('');
  const [bidNote, setBidNote] = useState('');
  const [copied, setCopied] = useState(false);
  const isAdjusted = market.key !== 'national';

  const generateBidText = () => {
    const companyName = branding?.companyName || 'Freedom One Properties';
    const contactEmail = branding?.email || 'contact@freedomoneproperties.com';
    const contactPhone = branding?.phone || '';
    return `CONTRACTOR BID REQUEST\n${'='.repeat(50)}\n\nFrom: ${companyName}\nDate: ${new Date().toLocaleDateString()}\n${contactEmail ? `Email: ${contactEmail}` : ''}\n${contactPhone ? `Phone: ${contactPhone}` : ''}\n\nPROPERTY DETAILS\n${'-'.repeat(30)}\nAddress: ${adjusted.address}\nCity/State: ${adjusted.city}, ${adjusted.state} ${adjusted.zip}\nProperty Type: ${adjusted.propertyType} (${adjusted.style})\nBeds: ${adjusted.beds} | Baths: ${adjusted.baths} | Sq Ft: ${adjusted.sqft.toLocaleString()} | Year Built: ${adjusted.yearBuilt}\nRehab Tier: ${PROP_TIER_LABELS[property.tier]}\n${isAdjusted ? `Market Adjustment: ${market.label}\n` : ''}\nBUDGET SUMMARY\n${'-'.repeat(30)}\nTotal Materials Budget: $${totalMaterials.toLocaleString()}\nTotal Labor Budget: $${totalLabor.toLocaleString()}\nTotal Rehab Budget: $${totalRehab.toLocaleString()}\n\nROOM-BY-ROOM SCOPE OF WORK\n${'-'.repeat(30)}\n${adjusted.rooms.map(room => {
      return `\n${room.roomLabel} (${room.condition === 'full' ? 'Full Renovation' : room.condition === 'moderate' ? 'Moderate Renovation' : 'Cosmetic Update'})\nMaterials: $${room.materialCost.toLocaleString()} | Labor: $${room.laborCost.toLocaleString()} | Total: $${room.totalCost.toLocaleString()}\n${room.workDescription}\n\nLine Items:\n${room.lineItems.map(li => `  - ${li.item}: ${li.material} (${li.quantity} ${li.unit}) — $${li.totalCost.toLocaleString()}`).join('\n')}`;
    }).join('\n\n')}\n\n${'-'.repeat(50)}\nBID INSTRUCTIONS\n${'-'.repeat(50)}\n1. Please provide itemized bids for each room listed above\n2. Include timeline estimates for each phase of work\n3. Provide proof of insurance and licensing\n4. Include warranty information for materials and labor\n5. Bids should be valid for 30 days from submission\n\n${bidNote ? `ADDITIONAL NOTES:\n${bidNote}\n\n` : ''}Please submit your bid to: ${contactEmail}\n\nThank you for your time and consideration.\n${companyName}`;
  };

  const handleCopyBid = () => {
    navigator.clipboard.writeText(generateBidText());
    setCopied(true);
    toast.success('Bid request copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailBid = () => {
    const emails = bidEmails.split(',').map(e => e.trim()).filter(Boolean);
    const subject = encodeURIComponent(`Bid Request: ${adjusted.address} — ${PROP_TIER_LABELS[property.tier]} Renovation`);
    const body = encodeURIComponent(generateBidText());
    const mailto = `mailto:${emails.join(',')}?subject=${subject}&body=${body}`;
    window.open(mailto, '_blank');
    toast.success('Opening email client with bid request');
    // Also download Excel SOW
    generateSOWExcel({ property: adjusted, branding, marketLabel: isAdjusted ? market.label : undefined, materialsFactor: market.materialsFactor, laborFactor: market.laborFactor });
    toast.info('Excel SOW downloaded — attach it to your email');
  };

  const handleAnalyzeDeal = () => {
    // Map SOW room types to analyzer room IDs and conditions
    const roomConditionMap: Record<string, string> = {};
    const roomTypeToId: Record<string, string> = {
      kitchen: 'kitchen', master_bath: 'master_bath', full_bath: 'full_bath',
      half_bath: 'half_bath', living_room: 'living_room', bedroom: 'bedroom',
      landscaping: 'landscaping', roof_gutter: 'roof_gutter', garage: 'garage',
    };
    for (const room of property.rooms) {
      const id = roomTypeToId[room.roomType];
      if (id) {
        const condMap: Record<string, string> = { cosmetic: 'light', moderate: 'moderate', full: 'full' };
        roomConditionMap[id] = condMap[room.condition] || 'moderate';
      }
    }
    localStorage.setItem('sow-to-analyzer', JSON.stringify({
      timestamp: Date.now(),
      property: {
        address: property.address,
        city: property.city,
        state: property.state,
        zip: property.zip,
        beds: property.beds,
        baths: property.baths,
        sqft: property.sqft,
        yearBuilt: property.yearBuilt,
        propertyType: property.propertyType,
        purchasePrice: property.purchasePrice,
      },
      arv: property.arv,
      tier: property.tier,
      roomConditions: roomConditionMap,
      roomCount: property.rooms.length,
    }));
    window.location.href = '/analyzer';
  };

  const handlePrintFullSOW = () => {
    const regionNote = isAdjusted ? `<p style="color: #C41E3A; font-size: 12px;">Adjusted for ${market.label} (Materials ${getAdjustmentPercent(market.materialsFactor) >= 0 ? '+' : ''}${getAdjustmentPercent(market.materialsFactor)}%, Labor ${getAdjustmentPercent(market.laborFactor) >= 0 ? '+' : ''}${getAdjustmentPercent(market.laborFactor)}%)</p>` : '';
    const printContent = `
      <html><head><title>SOW - ${adjusted.address}</title>
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
        .room-section { page-break-inside: avoid; margin-bottom: 20px; }
        .room-header { background: #f8f8f8; padding: 10px 14px; border-radius: 4px; margin-bottom: 8px; }
        .room-header h3 { margin: 0; font-size: 15px; }
        .room-header .costs { font-size: 13px; color: #666; }
        .desc { color: #444; font-size: 12px; line-height: 1.6; margin: 8px 0; font-style: italic; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 8px 0; }
        th { background: #f0f0f0; padding: 6px 8px; text-align: left; border: 1px solid #ddd; font-size: 11px; }
        td { padding: 6px 8px; border: 1px solid #ddd; }
        .total-row { font-weight: bold; background: #f9f9f9; }
        .footer { margin-top: 30px; font-size: 11px; color: #888; border-top: 2px solid #ddd; padding-top: 12px; }
        .photo-placeholder { width: 100%; height: 200px; background: #f0f0f0; border-radius: 6px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; color: #999; }
      </style></head><body>
      <h1>Scope of Work: ${adjusted.address}</h1>
      <p style="color: #666; font-size: 13px;">${adjusted.city}, ${adjusted.state} ${adjusted.zip} | ${adjusted.propertyType} | ${adjusted.style}</p>
      ${regionNote}
      <div class="info-grid">
        <div class="info-box"><div class="label">Beds</div><div class="value">${adjusted.beds}</div></div>
        <div class="info-box"><div class="label">Baths</div><div class="value">${adjusted.baths}</div></div>
        <div class="info-box"><div class="label">Sq Ft</div><div class="value">${adjusted.sqft.toLocaleString()}</div></div>
        <div class="info-box"><div class="label">Year Built</div><div class="value">${adjusted.yearBuilt}</div></div>
      </div>
      <div class="cost-summary">
        <div class="cost-box mat"><div class="label">Total Materials</div><div class="value">$${totalMaterials.toLocaleString()}</div></div>
        <div class="cost-box lab"><div class="label">Total Labor</div><div class="value">$${totalLabor.toLocaleString()}</div></div>
        <div class="cost-box tot"><div class="label">Total Rehab</div><div class="value">$${totalRehab.toLocaleString()}</div></div>
      </div>
      ${adjusted.rooms.map(room => `
        <div class="room-section">
          <h2>${ROOM_TYPE_ICONS[room.roomType] || ''} ${room.roomLabel}</h2>
          <div class="room-header">
            <div class="costs">Materials: $${room.materialCost.toLocaleString()} | Labor: $${room.laborCost.toLocaleString()} | <strong>Total: $${room.totalCost.toLocaleString()}</strong></div>
          </div>
          <p class="desc">${room.workDescription}</p>
          <table>
            <tr><th>Item</th><th>Material/Description</th><th>Qty</th><th>Unit</th><th>Material</th><th>Labor</th><th>Total</th></tr>
            ${room.lineItems.map(li => `
              <tr>
                <td>${li.item}</td>
                <td>${li.material}</td>
                <td style="text-align:right">${li.quantity}</td>
                <td>${li.unit}</td>
                <td style="text-align:right">$${li.materialCost.toLocaleString()}</td>
                <td style="text-align:right">$${li.laborCost.toLocaleString()}</td>
                <td style="text-align:right"><strong>$${li.totalCost.toLocaleString()}</strong></td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="4">Room Total</td>
              <td style="text-align:right">$${room.materialCost.toLocaleString()}</td>
              <td style="text-align:right">$${room.laborCost.toLocaleString()}</td>
              <td style="text-align:right">$${room.totalCost.toLocaleString()}</td>
            </tr>
          </table>
        </div>
      `).join('')}
      <div class="footer">
        ${branding?.logoUrl ? `<div style="margin-bottom:4px"><img src="${branding.logoUrl}" alt="${branding?.companyName}" style="height:30px;object-fit:contain" onerror="this.style.display='none'" /></div>` : ''}
        <p><strong>${branding?.footerText || 'Freedom One Real Estate Investment System'}</strong></p>
        ${branding && (branding.phone || branding.email) ? `<p>${[branding.phone, branding.email].filter(Boolean).join(' | ')}</p>` : ''}
        <p>This scope of work is for estimation purposes only. Actual costs may vary based on market conditions, property condition, and contractor pricing. Always obtain multiple bids from licensed contractors before beginning any renovation work.</p>
      </div>
      </body></html>
    `;
    const w = window.open('', '_blank');
    if (w) { w.document.write(printContent); w.document.close(); w.print(); }
  };

  const selectedRoom = adjusted.rooms[selectedRoomIdx];

  return (
    <div className="min-h-screen bg-background">
      {/* Property Header */}
      <section className="bg-[oklch(0.12_0_0)] text-white">
        <div className="container py-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Properties
          </button>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Property Photo */}
            <div className="lg:w-2/5">
              <img
                src={selectedRoom.photo}
                alt={selectedRoom.roomLabel}
                className="w-full h-64 lg:h-72 object-cover rounded-xl"
              />
            </div>
            {/* Property Info */}
            <div className="lg:w-3/5">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`text-xs ${property.tier === 'luxury' ? 'bg-amber-500/20 text-amber-300' : property.tier === 'standard' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                  {PROP_TIER_LABELS[property.tier]}
                </Badge>
                <Badge variant="outline" className="text-xs border-white/20 text-white/70">{property.style}</Badge>
                <Badge variant="outline" className="text-xs border-white/20 text-white/70">{property.propertyType}</Badge>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-1">{adjusted.address}</h1>
              <p className="text-white/60 text-sm mb-4">{adjusted.city}, {adjusted.state} {adjusted.zip}</p>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-2.5 text-center border border-white/10">
                  <BedDouble className="w-4 h-4 mx-auto mb-1 text-white/50" />
                  <p className="text-sm font-bold">{adjusted.beds}</p>
                  <p className="text-[10px] text-white/40">Beds</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5 text-center border border-white/10">
                  <Bath className="w-4 h-4 mx-auto mb-1 text-white/50" />
                  <p className="text-sm font-bold">{adjusted.baths}</p>
                  <p className="text-[10px] text-white/40">Baths</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5 text-center border border-white/10">
                  <Ruler className="w-4 h-4 mx-auto mb-1 text-white/50" />
                  <p className="text-sm font-bold">{adjusted.sqft.toLocaleString()}</p>
                  <p className="text-[10px] text-white/40">Sq Ft</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5 text-center border border-white/10">
                  <Calendar className="w-4 h-4 mx-auto mb-1 text-white/50" />
                  <p className="text-sm font-bold">{adjusted.yearBuilt}</p>
                  <p className="text-[10px] text-white/40">Built</p>
                </div>
              </div>

              {/* Deal Numbers */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                  <p className="text-[10px] text-white/40 uppercase mb-0.5">Purchase Price</p>
                  <p className="text-lg font-bold">${adjusted.purchasePrice.toLocaleString()}</p>
                </div>
                <div className="bg-[oklch(0.48_0.20_18)]/15 rounded-lg p-3 text-center border border-[oklch(0.48_0.20_18)]/30">
                  <p className="text-[10px] text-[oklch(0.65_0.18_18)] uppercase mb-0.5">Total Rehab</p>
                  <p className="text-lg font-bold text-[oklch(0.70_0.18_18)]">${totalRehab.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-500/10 rounded-lg p-3 text-center border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-400 uppercase mb-0.5">ARV</p>
                  <p className="text-lg font-bold text-emerald-400">${adjusted.arv.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button size="sm" className="gap-1.5 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white" onClick={handlePrintFullSOW}>
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </Button>
                <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => generateSOWExcel({ property: adjusted, branding, marketLabel: isAdjusted ? market.label : undefined, materialsFactor: market.materialsFactor, laborFactor: market.laborFactor })}>
                  <Grid3X3 className="w-3.5 h-3.5" /> Download Excel
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 border-white/20 text-white hover:bg-white/10" onClick={handlePrintFullSOW}>
                  <Printer className="w-3.5 h-3.5" /> Print
                </Button>
                <Button size="sm" className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white" onClick={handleAnalyzeDeal}>
                  <Calculator className="w-3.5 h-3.5" /> Analyze This Deal
                </Button>
                <Button size="sm" className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => setShowBidModal(true)}>
                  <Send className="w-3.5 h-3.5" /> Send to Contractor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Indicator */}
      {isAdjusted && (
        <div className="container pt-3">
          <RegionalIndicatorBar market={market} />
        </div>
      )}

      {/* Room Navigation Tabs */}
      <section className="border-b border-border/50 bg-secondary/20 sticky top-0 z-30">
        <div className="container">
          <div className="flex overflow-x-auto gap-0 -mb-px scrollbar-hide">
            {adjusted.rooms.map((room, idx) => (
              <button
                key={room.roomType}
                onClick={() => setSelectedRoomIdx(idx)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  selectedRoomIdx === idx
                    ? 'border-[oklch(0.48_0.20_18)] text-[oklch(0.48_0.20_18)]'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="text-base">{ROOM_TYPE_ICONS[room.roomType]}</span>
                <span className="hidden sm:inline">{room.roomLabel}</span>
                <span className="sm:hidden text-xs">{room.roomLabel.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Room Detail */}
      <section className="container py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Room Photo & Before/After */}
          <div className="lg:col-span-2">
            {getBeforePhoto(property.tier, selectedRoom.roomType) ? (
              <div className="mb-4">
                <BeforeAfterSlider
                  beforeImage={getBeforePhoto(property.tier, selectedRoom.roomType)}
                  afterImage={selectedRoom.photo}
                  beforeLabel="Before"
                  afterLabel="After"
                  className="h-56 lg:h-64"
                />
                <p className="text-[10px] text-center text-muted-foreground mt-1">Drag slider to compare before &amp; after</p>
              </div>
            ) : (
              <img
                src={selectedRoom.photo}
                alt={selectedRoom.roomLabel}
                className="w-full h-56 lg:h-64 object-cover rounded-xl mb-4"
              />
            )}
            <h2 className="text-xl font-bold mb-2">{selectedRoom.roomLabel}</h2>
            <Badge variant="outline" className="text-xs mb-3">
              {selectedRoom.condition === 'full' ? 'Full Renovation' : selectedRoom.condition === 'moderate' ? 'Moderate Renovation' : 'Cosmetic Update'}
            </Badge>
            <p className="text-sm text-muted-foreground leading-relaxed">{selectedRoom.workDescription}</p>
          </div>

          {/* Line Items Table */}
          <div className="lg:col-span-3">
            {/* Cost Summary */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-[oklch(0.48_0.20_18)]/8 rounded-lg p-3 text-center">
                <ShoppingCart className="w-4 h-4 mx-auto mb-1 text-[oklch(0.48_0.20_18)]" />
                <p className="text-lg font-bold">${selectedRoom.materialCost.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Materials</p>
              </div>
              <div className="bg-blue-500/8 rounded-lg p-3 text-center">
                <Wrench className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                <p className="text-lg font-bold">${selectedRoom.laborCost.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Labor</p>
              </div>
              <div className="bg-emerald-500/8 rounded-lg p-3 text-center">
                <DollarSign className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                <p className="text-lg font-bold">${selectedRoom.totalCost.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Total</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left p-3 font-semibold text-xs">Item</th>
                    <th className="text-left p-3 font-semibold text-xs">Material / Description</th>
                    <th className="text-right p-3 font-semibold text-xs">Qty</th>
                    <th className="text-right p-3 font-semibold text-xs">Material</th>
                    <th className="text-right p-3 font-semibold text-xs">Labor</th>
                    <th className="text-right p-3 font-semibold text-xs">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRoom.lineItems.map((item, i) => (
                    <tr key={i} className="border-t border-border/30 hover:bg-secondary/20">
                      <td className="p-3 font-medium text-xs">{item.item}</td>
                      <td className="p-3 text-xs text-muted-foreground">{item.material}</td>
                      <td className="p-3 text-right text-xs tabular-nums">{item.quantity} {item.unit}</td>
                      <td className="p-3 text-right text-xs tabular-nums">${item.materialCost.toLocaleString()}</td>
                      <td className="p-3 text-right text-xs tabular-nums">${item.laborCost.toLocaleString()}</td>
                      <td className="p-3 text-right text-xs font-medium tabular-nums">${item.totalCost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-secondary/40 font-bold border-t border-border">
                    <td colSpan={3} className="p-3 text-xs">ROOM TOTAL</td>
                    <td className="p-3 text-right text-xs tabular-nums">${selectedRoom.materialCost.toLocaleString()}</td>
                    <td className="p-3 text-right text-xs tabular-nums">${selectedRoom.laborCost.toLocaleString()}</td>
                    <td className="p-3 text-right text-xs tabular-nums">${selectedRoom.totalCost.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className="text-[10px] text-muted-foreground mt-3 italic">
              Costs are estimates{isAdjusted ? ` adjusted for ${market.label}` : ' based on national averages'}. Actual costs vary by contractor and property condition.
            </p>
          </div>
        </div>
      </section>

      {/* All Rooms Summary Table */}
      <section className="bg-secondary/20 border-t border-border/50">
        <div className="container py-6">
          <h3 className="text-lg font-bold mb-4">Complete Rehab Budget Summary</h3>
          <div className="overflow-x-auto rounded-lg border border-border/50 bg-background">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left p-3 font-semibold text-xs">Room</th>
                  <th className="text-left p-3 font-semibold text-xs">Condition</th>
                  <th className="text-right p-3 font-semibold text-xs">Materials</th>
                  <th className="text-right p-3 font-semibold text-xs">Labor</th>
                  <th className="text-right p-3 font-semibold text-xs">Total</th>
                  <th className="text-right p-3 font-semibold text-xs">% of Budget</th>
                </tr>
              </thead>
              <tbody>
                {adjusted.rooms.map((room, idx) => (
                  <tr
                    key={room.roomType}
                    className={`border-t border-border/30 cursor-pointer hover:bg-secondary/30 transition-colors ${selectedRoomIdx === idx ? 'bg-[oklch(0.48_0.20_18)]/5' : ''}`}
                    onClick={() => { setSelectedRoomIdx(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    <td className="p-3">
                      <span className="flex items-center gap-2">
                        <span>{ROOM_TYPE_ICONS[room.roomType]}</span>
                        <span className="font-medium text-xs">{room.roomLabel}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px]">
                        {room.condition === 'full' ? 'Full' : room.condition === 'moderate' ? 'Moderate' : 'Cosmetic'}
                      </Badge>
                    </td>
                    <td className="p-3 text-right text-xs tabular-nums">${room.materialCost.toLocaleString()}</td>
                    <td className="p-3 text-right text-xs tabular-nums">${room.laborCost.toLocaleString()}</td>
                    <td className="p-3 text-right text-xs font-medium tabular-nums">${room.totalCost.toLocaleString()}</td>
                    <td className="p-3 text-right text-xs tabular-nums">{totalRehab > 0 ? ((room.totalCost / totalRehab) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[oklch(0.48_0.20_18)]/10 font-bold border-t-2 border-[oklch(0.48_0.20_18)]/30">
                  <td colSpan={2} className="p-3 text-xs">TOTAL REHAB BUDGET</td>
                  <td className="p-3 text-right text-xs tabular-nums">${totalMaterials.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs tabular-nums">${totalLabor.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs tabular-nums">${totalRehab.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="border-t border-border/50">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">Before & After Transformation</h3>
              <p className="text-sm text-muted-foreground">Drag the slider to compare the property before and after renovation</p>
            </div>
            <Badge className={`text-xs ${property.tier === 'luxury' ? 'bg-amber-500/20 text-amber-600' : property.tier === 'standard' ? 'bg-blue-500/20 text-blue-600' : 'bg-emerald-500/20 text-emerald-600'}`}>
              {PROP_TIER_LABELS[property.tier]} Renovation
            </Badge>
          </div>
          <BeforeAfterSlider
            beforeImage={property.beforePhoto}
            afterImage={property.afterPhoto}
            beforeLabel="Before"
            afterLabel="After"
            className="h-64 sm:h-80 lg:h-96"
          />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase">Purchase Price</p>
              <p className="text-sm font-bold">${adjusted.purchasePrice.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[oklch(0.48_0.20_18)] uppercase">Rehab Investment</p>
              <p className="text-sm font-bold text-[oklch(0.48_0.20_18)]">${totalRehab.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-emerald-600 uppercase">After Repair Value</p>
              <p className="text-sm font-bold text-emerald-600">${adjusted.arv.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-secondary/30 border-t border-border/50">
        <div className="container py-6">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            <strong>Disclaimer:</strong> All costs, materials, and labor estimates provided in this scope of work
            are for informational and estimation purposes only. {isAdjusted && `Costs shown are adjusted for the ${market.label} market. `}
            Freedom One System of Real Estate Investing does not guarantee
            the accuracy of pricing, availability of materials, or contractor labor rates. Actual costs will vary based on
            geographic location, property condition, market conditions, and contractor pricing. Always obtain multiple bids
            from licensed contractors before beginning any renovation work.
          </p>
        </div>
      </section>

      {/* Contractor Bid Request Modal */}
      <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-violet-500" />
              Send Bid Request to Contractors
            </DialogTitle>
            <DialogDescription>
              Send the complete scope of work for {adjusted.address} to contractors for bidding.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Property Summary */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{adjusted.address}</h4>
                <Badge className={`text-xs ${property.tier === 'luxury' ? 'bg-amber-500/20 text-amber-600' : property.tier === 'standard' ? 'bg-blue-500/20 text-blue-600' : 'bg-emerald-500/20 text-emerald-600'}`}>
                  {PROP_TIER_LABELS[property.tier]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{adjusted.city}, {adjusted.state} {adjusted.zip} | {adjusted.beds}bd/{adjusted.baths}ba | {adjusted.sqft.toLocaleString()} sqft</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center bg-background rounded p-2">
                  <p className="text-[10px] text-muted-foreground uppercase">Materials</p>
                  <p className="text-sm font-bold">${totalMaterials.toLocaleString()}</p>
                </div>
                <div className="text-center bg-background rounded p-2">
                  <p className="text-[10px] text-muted-foreground uppercase">Labor</p>
                  <p className="text-sm font-bold">${totalLabor.toLocaleString()}</p>
                </div>
                <div className="text-center bg-background rounded p-2">
                  <p className="text-[10px] text-muted-foreground uppercase">Total Rehab</p>
                  <p className="text-sm font-bold text-[oklch(0.48_0.20_18)]">${totalRehab.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">{adjusted.rooms.length} rooms included in scope</p>
            </div>

            {/* Contractor Email(s) */}
            <div>
              <Label htmlFor="bid-emails" className="text-sm font-medium">Contractor Email(s)</Label>
              <Input
                id="bid-emails"
                placeholder="contractor@email.com, another@email.com"
                value={bidEmails}
                onChange={(e) => setBidEmails(e.target.value)}
                className="mt-1"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Separate multiple emails with commas</p>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="bid-note" className="text-sm font-medium">Additional Notes (Optional)</Label>
              <Textarea
                id="bid-note"
                placeholder="Timeline requirements, special instructions, access details..."
                value={bidNote}
                onChange={(e) => setBidNote(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                className="flex-1 gap-2 bg-violet-600 hover:bg-violet-700 text-white"
                onClick={handleEmailBid}
                disabled={!bidEmails.trim()}
              >
                <Mail className="w-4 h-4" /> Open Email Client
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleCopyBid}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Bid Text'}
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => {
                  generateSOWExcel({ property: adjusted, branding, marketLabel: isAdjusted ? market.label : undefined, materialsFactor: market.materialsFactor, laborFactor: market.laborFactor });
                  toast.success('Excel SOW downloaded');
                }}
              >
                <Grid3X3 className="w-4 h-4" /> Download Excel SOW
              </Button>
            </div>

            <p className="text-[10px] text-muted-foreground leading-relaxed">
              <strong>Tip:</strong> Click "Open Email Client" to compose an email with the full bid request text pre-filled.
              The Excel SOW will also download automatically — attach it to your email for a professional bid package.
              Alternatively, use "Copy Bid Text" to paste the request into any messaging platform.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── EXISTING LINE-ITEM ESTIMATOR COMPONENTS ───────────────────

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
    if (w) { w.document.write(printContent); w.document.close(); w.print(); }
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
  const adjusted = useMemo(() => applyRegionalToTemplate(template, market.materialsFactor, market.laborFactor), [template, market]);
  const isAdjusted = market.key !== 'national';

  const handlePrint = () => {
    const regionNote = isAdjusted ? `<p style="color: #C41E3A; font-size: 12px; margin-top: 4px;">Adjusted for ${market.label} (Materials ${getAdjustmentPercent(market.materialsFactor) >= 0 ? '+' : ''}${getAdjustmentPercent(market.materialsFactor)}%, Labor ${getAdjustmentPercent(market.laborFactor) >= 0 ? '+' : ''}${getAdjustmentPercent(market.laborFactor)}%)</p>` : '';
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
        .materials-list li:before { content: "OK "; color: #C41E3A; font-weight: bold; }
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
    if (w) { w.document.write(printContent); w.document.close(); w.print(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-background rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="relative h-56 sm:h-64">
          <img src={adjusted.photo} alt={adjusted.name} className="w-full h-full object-cover rounded-t-xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-t-xl" />
          <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-xs ${COST_LEVEL_COLORS[adjusted.costLevel]}`}>{getCostLevelLabel(adjusted.costLevel)}</Badge>
              <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">{adjusted.layoutType}</Badge>
              {isAdjusted && <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30"><MapPin className="w-3 h-3 mr-1" /> {market.label}</Badge>}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{adjusted.name}</h2>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          {isAdjusted && <div className="mb-4"><RegionalIndicatorBar market={market} /></div>}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className="bg-secondary/50 rounded-lg p-3 text-center"><HomeIcon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" /><p className="text-xs font-bold">{adjusted.propertyType}</p><p className="text-[10px] text-muted-foreground">Type</p></div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center"><BedDouble className="w-4 h-4 mx-auto mb-1 text-muted-foreground" /><p className="text-xs font-bold">{adjusted.beds}</p><p className="text-[10px] text-muted-foreground">Beds</p></div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center"><Bath className="w-4 h-4 mx-auto mb-1 text-muted-foreground" /><p className="text-xs font-bold">{adjusted.baths}</p><p className="text-[10px] text-muted-foreground">Baths</p></div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center"><Ruler className="w-4 h-4 mx-auto mb-1 text-muted-foreground" /><p className="text-xs font-bold">{adjusted.sqft.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">Sq Ft</p></div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-[oklch(0.48_0.20_18)]/8 rounded-lg p-3 text-center"><ShoppingCart className="w-4 h-4 mx-auto mb-1 text-[oklch(0.48_0.20_18)]" /><p className="text-lg font-bold">{formatCurrency(adjusted.materialCost)}</p><p className="text-[10px] text-muted-foreground uppercase">Materials</p></div>
            <div className="bg-blue-50 rounded-lg p-3 text-center"><Wrench className="w-4 h-4 mx-auto mb-1 text-blue-600" /><p className="text-lg font-bold">{formatCurrency(adjusted.laborCost)}</p><p className="text-[10px] text-muted-foreground uppercase">Labor</p></div>
            <div className="bg-emerald-50 rounded-lg p-3 text-center"><DollarSign className="w-4 h-4 mx-auto mb-1 text-emerald-600" /><p className="text-lg font-bold">{formatCurrency(adjusted.totalCost)}</p><p className="text-[10px] text-muted-foreground uppercase">Total</p></div>
          </div>
          <div className="mb-5"><h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Scope of Work</h3><p className="text-sm leading-relaxed">{adjusted.workDescription}</p></div>
          <div className="mb-5"><h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Key Materials</h3><div className="grid sm:grid-cols-2 gap-1.5">{adjusted.keyMaterials.map((mat, i) => (<div key={i} className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.48_0.20_18)] shrink-0" />{mat}</div>))}</div></div>
          <div className="flex gap-3 pt-3 border-t border-border/50">
            <Button className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white" onClick={handlePrint}><Download className="w-4 h-4" /> Download SOW</Button>
            <Button variant="outline" className="gap-2" onClick={handlePrint}><Printer className="w-4 h-4" /> Print</Button>
          </div>
        </div>
        <div className="px-5 pb-4">
          <p className="text-[10px] text-muted-foreground italic">
            Costs are estimates{isAdjusted ? ` adjusted for ${market.label}` : ' based on national averages'}. Actual costs vary by contractor and property condition.
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
    <Card className="border-border/60 overflow-hidden cursor-pointer hover:shadow-lg transition-all group hover:border-[oklch(0.48_0.20_18)]/30" onClick={onClick}>
      <div className="relative h-40">
        <img src={adjusted.photo} alt={adjusted.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 right-2 flex gap-1"><Badge className={`text-[10px] ${COST_LEVEL_COLORS[adjusted.costLevel]}`}>{getCostLevelLabel(adjusted.costLevel)}</Badge></div>
        {isAdjusted && <div className="absolute top-2 left-2"><Badge variant="outline" className="text-[10px] bg-black/40 text-white border-white/20"><MapPin className="w-2.5 h-2.5 mr-0.5" /> Adjusted</Badge></div>}
        <div className="absolute bottom-2 left-3 right-3"><p className="text-white font-bold text-sm leading-tight line-clamp-2">{adjusted.name}</p></div>
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
          <p className="text-xs text-muted-foreground">{adjusted.layoutType}</p>
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
  const [activeTab, setActiveTab] = useState<'properties' | 'library' | 'estimator' | 'builder'>('properties');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedCostLevel, setSelectedCostLevel] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<SOWTemplate | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<SOWProperty | null>(null);
  const [propertyTierFilter, setPropertyTierFilter] = useState<string>('all');
  const { market, selectMarket: setMarket, resetToNational } = useMarketSelector();

  const filteredTemplates = useMemo(() => {
    let filtered = SOW_TEMPLATES;
    if (selectedRoom !== 'all') filtered = filtered.filter(t => t.roomType === selectedRoom);
    if (selectedCostLevel > 0) filtered = filtered.filter(t => t.costLevel === selectedCostLevel);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(q) || t.workDescription.toLowerCase().includes(q) ||
        t.layoutType.toLowerCase().includes(q) || t.keyMaterials.some(m => m.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [selectedRoom, selectedCostLevel, searchQuery]);

  const filteredProperties = useMemo(() => {
    if (propertyTierFilter === 'all') return SOW_PROPERTIES;
    return SOW_PROPERTIES.filter(p => p.tier === propertyTierFilter);
  }, [propertyTierFilter]);

  const roomCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SOW_TEMPLATES.length };
    SOW_ROOM_TYPES.forEach(room => { counts[room.id] = getTemplatesByRoom(room.id).length; });
    return counts;
  }, []);

  // If a property is selected, show its detail view
  if (selectedProperty) {
    return (
      <PropertyDetail
        property={selectedProperty}
        market={market}
        onBack={() => setSelectedProperty(null)}
        branding={branding}
      />
    );
  }

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
                {SOW_PROPERTIES.length} property SOWs + {SOW_TEMPLATES.length} room templates across {SOW_ROOM_TYPES.length} categories
              </p>
            </div>
          </div>
          <p className="text-[oklch(0.6_0_0)] text-sm max-w-2xl mt-3 leading-relaxed">
            Browse complete property-based scope of work packages with room-by-room photos, line-item cost breakdowns,
            and downloadable SOW documents. Select your metro market below to automatically adjust all costs for your local area.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.48_0.20_18)]/20 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-[oklch(0.65_0.18_18)]" />
              </div>
              <div>
                <p className="text-lg font-bold">{SOW_PROPERTIES.length}</p>
                <p className="text-[10px] text-[oklch(0.5_0_0)]">Properties</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.48_0.20_18)]/20 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-[oklch(0.65_0.18_18)]" />
              </div>
              <div>
                <p className="text-lg font-bold">{SOW_PROPERTIES.length * 9}</p>
                <p className="text-[10px] text-[oklch(0.5_0_0)]">Room SOWs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.48_0.20_18)]/20 flex items-center justify-center">
                <Grid3X3 className="w-4 h-4 text-[oklch(0.65_0.18_18)]" />
              </div>
              <div>
                <p className="text-lg font-bold">{SOW_TEMPLATES.length}</p>
                <p className="text-[10px] text-[oklch(0.5_0_0)]">Room Templates</p>
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
                <span className="text-muted-foreground text-xs">&middot;</span>
                <AdjustmentBadge factor={market.laborFactor} label="labor" />
              </div>
            )}
            {market.key !== 'national' && <ResetToNationalButton onClick={resetToNational} />}
          </div>

          {/* Tab Row */}
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'properties'
                  ? 'border-[oklch(0.48_0.20_18)] text-[oklch(0.48_0.20_18)]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Building2 className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              Property SOWs ({SOW_PROPERTIES.length})
            </button>
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
              Line-Item Estimator
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'builder'
                  ? 'border-[oklch(0.48_0.20_18)] text-[oklch(0.48_0.20_18)]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Wrench className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              Custom Builder
            </button>
          </div>
        </div>
      </section>

      {/* ─── PROPERTY SOWs TAB ────────────────────────────────── */}
      {activeTab === 'properties' && (
        <>
          {/* Tier Filter */}
          <section className="border-b border-border/30 bg-background">
            <div className="container py-4">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mr-1">Renovation Tier:</span>
                {['all', 'rental', 'standard', 'luxury'].map(t => (
                  <button
                    key={t}
                    onClick={() => setPropertyTierFilter(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      propertyTierFilter === t
                        ? 'bg-[oklch(0.48_0.20_18)] text-white'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {t === 'all' ? `All (${SOW_PROPERTIES.length})` : `${PROP_TIER_LABELS[t]} (${SOW_PROPERTIES.filter(p => p.tier === t).length})`}
                  </button>
                ))}
                <span className="text-xs text-muted-foreground ml-2">
                  Showing {filteredProperties.length} of {SOW_PROPERTIES.length} properties
                </span>
              </div>
            </div>
          </section>

          {/* Property Grid */}
          <section className="container py-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  market={market}
                  onClick={() => setSelectedProperty(property)}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ─── TEMPLATE LIBRARY TAB ──────────────────────────────── */}
      {activeTab === 'library' && (
        <>
          <section className="border-b border-border/30 bg-background">
            <div className="container py-4">
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
              <div className="flex flex-wrap gap-2 mb-3">
                <button onClick={() => setSelectedRoom('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedRoom === 'all' ? 'bg-[oklch(0.48_0.20_18)] text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
                  All Rooms ({roomCounts.all})
                </button>
                {SOW_ROOM_TYPES.map(room => (
                  <button key={room.id} onClick={() => setSelectedRoom(room.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedRoom === room.id ? 'bg-[oklch(0.48_0.20_18)] text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
                    {room.icon} {room.name} ({roomCounts[room.id]})
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mr-1">Cost Level:</span>
                <button onClick={() => setSelectedCostLevel(0)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${selectedCostLevel === 0 ? 'bg-[oklch(0.15_0_0)] text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>All</button>
                {[1, 2, 3, 4].map(level => (
                  <button key={level} onClick={() => setSelectedCostLevel(level)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${selectedCostLevel === level ? COST_LEVEL_COLORS[level] : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
                    {getCostLevelLabel(level)}
                  </button>
                ))}
                <span className="text-xs text-muted-foreground ml-2">Showing {filteredTemplates.length} of {SOW_TEMPLATES.length} templates</span>
              </div>
            </div>
          </section>
          <section className="container py-6">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-16">
                <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-lg font-medium text-muted-foreground">No templates match your filters</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSelectedRoom('all'); setSelectedCostLevel(0); setSearchQuery(''); }}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTemplates.map(template => (
                  <TemplateCard key={template.id} template={template} market={market} onClick={() => setSelectedTemplate(template)} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* ─── LINE-ITEM ESTIMATOR TAB ───────────────────────────── */}
      {activeTab === 'estimator' && (
        <>
          <section className="border-b border-border/50 bg-secondary/20">
            <div className="container py-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">Material Tier:</span>
              {(['rental', 'standard', 'luxury'] as MaterialTier[]).map(t => (
                <button key={t} onClick={() => setTier(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tier === t ? 'bg-[oklch(0.48_0.20_18)] text-white shadow-sm' : 'bg-background border border-border text-muted-foreground hover:border-[oklch(0.48_0.20_18)]/30'}`}>
                  {TIER_LABELS[t]}
                </button>
              ))}
              <Badge variant="outline" className={`ml-2 ${TIER_COLORS[tier]}`}>
                {tier === 'rental' ? 'Builder-grade materials for investment properties' : tier === 'standard' ? 'Mid-range popular materials for owner-occupied homes' : 'High-end finishes for luxury flips and premium markets'}
              </Badge>
            </div>
          </section>
          <section className="container py-8">
            <div className="space-y-3">
              {rooms.map(room => (
                <RoomTemplate key={room.id} room={room} tier={tier} market={market} branding={branding} catalogMap={catalogMap} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ─── CUSTOM BUILDER TAB ──────────────────────────────── */}
      {activeTab === 'builder' && (
        <CustomSOWBuilder market={market} branding={branding} />
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
