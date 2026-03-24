// ============================================================
// SOW Excel Export — Generates a multi-sheet .xlsx workbook
// for a property-based Scope of Work with room-by-room breakdown
// ============================================================

import * as XLSX from 'xlsx';
import type { BrandingConfig } from '@/lib/branding';
import type { SOWProperty, SOWRoomTemplate } from '@/lib/sowProperties';

interface ExportOptions {
  property: SOWProperty;
  branding?: BrandingConfig;
  marketLabel?: string;
  materialsFactor?: number;
  laborFactor?: number;
}

function fmt(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

function addSummarySheet(wb: XLSX.WorkBook, opts: ExportOptions) {
  const { property: p, branding, marketLabel, materialsFactor = 1, laborFactor = 1 } = opts;
  const companyName = branding?.companyName || 'Freedom One Properties';

  const totalMaterials = p.rooms.reduce((s, r) => s + Math.round(r.materialCost * materialsFactor), 0);
  const totalLabor = p.rooms.reduce((s, r) => s + Math.round(r.laborCost * laborFactor), 0);
  const totalRehab = totalMaterials + totalLabor;

  const data: (string | number | null)[][] = [
    [`${companyName} — Scope of Work`],
    [''],
    ['PROPERTY INFORMATION'],
    ['Address', p.address],
    ['City / State / Zip', `${p.city}, ${p.state} ${p.zip}`],
    ['Property Type', p.propertyType],
    ['Style', p.style],
    ['Beds', p.beds],
    ['Baths', p.baths],
    ['Square Footage', p.sqft],
    ['Year Built', p.yearBuilt],
    ['Material Tier', p.tier.charAt(0).toUpperCase() + p.tier.slice(1) + ' Grade'],
    [''],
    ['FINANCIAL OVERVIEW'],
    ['Purchase Price', p.purchasePrice],
    ['After Repair Value (ARV)', p.arv],
    ['Total Rehab Budget', totalRehab],
    ['Potential Profit', p.arv - p.purchasePrice - totalRehab],
    [''],
    ...(marketLabel ? [['REGIONAL ADJUSTMENT', marketLabel] as (string | number | null)[]] : []),
    ...(materialsFactor !== 1 ? [['Materials Factor', `${materialsFactor > 1 ? '+' : ''}${Math.round((materialsFactor - 1) * 100)}%`] as (string | number | null)[]] : []),
    ...(laborFactor !== 1 ? [['Labor Factor', `${laborFactor > 1 ? '+' : ''}${Math.round((laborFactor - 1) * 100)}%`] as (string | number | null)[]] : []),
    [''],
    ['ROOM COST SUMMARY'],
    ['Room', 'Condition', 'Materials', 'Labor', 'Total', 'Line Items'],
    ...p.rooms.map(r => [
      r.roomLabel,
      r.condition,
      Math.round(r.materialCost * materialsFactor),
      Math.round(r.laborCost * laborFactor),
      Math.round(r.materialCost * materialsFactor) + Math.round(r.laborCost * laborFactor),
      r.lineItems.length,
    ] as (string | number | null)[]),
    [''],
    ['TOTALS', '', totalMaterials, totalLabor, totalRehab, p.rooms.reduce((s, r) => s + r.lineItems.length, 0)],
    [''],
    [''],
    [branding?.footerText || 'Freedom One Real Estate Investment System'],
    [branding?.email || 'contact@freedomoneproperties.com'],
    ['This scope of work is for estimation purposes only. Actual costs may vary.'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Summary');
}

function addRoomSheet(wb: XLSX.WorkBook, room: SOWRoomTemplate, opts: ExportOptions) {
  const { materialsFactor = 1, laborFactor = 1 } = opts;

  const data: (string | number | null)[][] = [
    [`${room.roomLabel} — Scope of Work`],
    [''],
    ['Condition', room.condition],
    ['Work Description', room.workDescription],
    [''],
    ['LINE ITEMS'],
    ['Item', 'Material/Description', 'Qty', 'Unit', 'Material Cost', 'Labor Cost', 'Total Cost'],
    ...room.lineItems.map(li => [
      li.item,
      li.material,
      li.quantity,
      li.unit,
      Math.round(li.materialCost * materialsFactor),
      Math.round(li.laborCost * laborFactor),
      Math.round(li.materialCost * materialsFactor) + Math.round(li.laborCost * laborFactor),
    ] as (string | number | null)[]),
    [''],
    [
      'ROOM TOTAL', '', '', '',
      Math.round(room.materialCost * materialsFactor),
      Math.round(room.laborCost * laborFactor),
      Math.round(room.materialCost * materialsFactor) + Math.round(room.laborCost * laborFactor),
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [
    { wch: 24 }, { wch: 32 }, { wch: 8 }, { wch: 10 },
    { wch: 14 }, { wch: 14 }, { wch: 14 },
  ];

  // Truncate sheet name to 31 chars (Excel limit)
  const sheetName = room.roomLabel.substring(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
}

function addAllLineItemsSheet(wb: XLSX.WorkBook, opts: ExportOptions) {
  const { property: p, materialsFactor = 1, laborFactor = 1 } = opts;

  const data: (string | number | null)[][] = [
    ['ALL LINE ITEMS — CONTRACTOR BID SHEET'],
    ['Property', p.address],
    [''],
    ['Room', 'Item', 'Material/Description', 'Qty', 'Unit', 'Material Cost', 'Labor Cost', 'Total Cost'],
  ];

  let grandMaterial = 0;
  let grandLabor = 0;

  for (const room of p.rooms) {
    for (const li of room.lineItems) {
      const mat = Math.round(li.materialCost * materialsFactor);
      const lab = Math.round(li.laborCost * laborFactor);
      grandMaterial += mat;
      grandLabor += lab;
      data.push([
        room.roomLabel, li.item, li.material, li.quantity, li.unit,
        mat, lab, mat + lab,
      ]);
    }
  }

  data.push(['']);
  data.push(['GRAND TOTAL', '', '', '', '', grandMaterial, grandLabor, grandMaterial + grandLabor]);

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [
    { wch: 20 }, { wch: 24 }, { wch: 32 }, { wch: 8 }, { wch: 10 },
    { wch: 14 }, { wch: 14 }, { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'All Line Items');
}

export function generateSOWExcel(opts: ExportOptions): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  addSummarySheet(wb, opts);

  // Sheet 2: All Line Items (contractor bid sheet)
  addAllLineItemsSheet(wb, opts);

  // Sheets 3-11: Individual room sheets
  for (const room of opts.property.rooms) {
    addRoomSheet(wb, room, opts);
  }

  // Generate filename
  const addr = opts.property.address.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  const filename = `SOW-${addr}.xlsx`;

  XLSX.writeFile(wb, filename);
}
