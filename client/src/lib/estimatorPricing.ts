// ============================================================
// Renovation Estimator — Item-Level Pricing Reference
// Source: 2022 Renovation Estimator Spreadsheet (updated 2026)
// These unit costs complement the existing SOW templates by
// providing granular trade-specific pricing for individual items.
// ============================================================

export interface PricingItem {
  name: string;
  materialCost: number;
  laborCost: number;
  unit: string;
  miscNote?: string;
}

export interface PricingCategory {
  category: string;
  section: 'exterior' | 'interior';
  items: PricingItem[];
}

export const ESTIMATOR_PRICING: PricingCategory[] = [
  // ── EXTERIOR ──────────────────────────────────────────
  {
    category: 'Exterior Paint',
    section: 'exterior',
    items: [
      { name: 'Foundation Paint', materialCost: 17, laborCost: 150, unit: 'per gallon', miscNote: 'Covers ~200 sqft/gal' },
      { name: 'Exterior Wall Paint', materialCost: 17, laborCost: 200, unit: 'per gallon', miscNote: 'Covers ~200 sqft/gal' },
      { name: 'Porch Paint', materialCost: 17, laborCost: 200, unit: 'per gallon', miscNote: 'Covers ~200 sqft/gal' },
      { name: 'Trim Paint', materialCost: 17, laborCost: 150, unit: 'per gallon', miscNote: 'Covers ~150 sqft/gal' },
    ],
  },
  {
    category: 'Roofing',
    section: 'exterior',
    items: [
      { name: 'Gutters', materialCost: 0.50, laborCost: 4.50, unit: 'per linear ft' },
      { name: 'Tear Off', materialCost: 0, laborCost: 150, unit: 'per 100 sqft (1 square)' },
      { name: 'Shingles', materialCost: 100, laborCost: 100, unit: 'per 100 sqft (1 square)' },
      { name: 'Sheeting / Decking', materialCost: 50, laborCost: 30, unit: 'per 100 sqft (1 square)' },
    ],
  },
  {
    category: 'Landscaping',
    section: 'exterior',
    items: [
      { name: 'Yard Brush Clearing', materialCost: 0, laborCost: 0.03, unit: 'per sqft' },
      { name: 'General Landscaping', materialCost: 0, laborCost: 300, unit: 'per house (avg)' },
      { name: 'Remove Yard Trash', materialCost: 0, laborCost: 200, unit: 'per house (avg)' },
      { name: 'Trim Tree', materialCost: 0, laborCost: 150, unit: 'per tree' },
      { name: 'Remove Tree', materialCost: 0, laborCost: 700, unit: 'per tree' },
    ],
  },
  {
    category: 'Siding',
    section: 'exterior',
    items: [
      { name: 'Siding (vinyl/fiber cement)', materialCost: 50, laborCost: 400, unit: 'per 100 sqft (1 square)' },
    ],
  },
  {
    category: 'Foundation',
    section: 'exterior',
    items: [
      { name: 'Foundation Straighten', materialCost: 0, laborCost: 180, unit: 'per linear ft' },
      { name: 'Foundation Rebuild', materialCost: 2, laborCost: 260, unit: 'per linear ft' },
    ],
  },
  {
    category: 'Porches & Decks',
    section: 'exterior',
    items: [
      { name: 'Redeck', materialCost: 6, laborCost: 30, unit: 'per sqft' },
      { name: 'New Footings', materialCost: 2, laborCost: 3, unit: 'per sqft' },
    ],
  },
  {
    category: 'Windows',
    section: 'exterior',
    items: [
      { name: 'Window Glass Repair', materialCost: 60, laborCost: 40, unit: 'per window' },
      { name: 'Window Replacement', materialCost: 160, laborCost: 100, unit: 'per window' },
      { name: 'Historic Window Replacement', materialCost: 400, laborCost: 400, unit: 'per window' },
      { name: 'Screen Replacement', materialCost: 20, laborCost: 10, unit: 'per window' },
    ],
  },

  // ── INTERIOR ──────────────────────────────────────────
  {
    category: 'HVAC',
    section: 'interior',
    items: [
      { name: 'Gas Meter Install', materialCost: 0, laborCost: 250, unit: 'each' },
      { name: 'Cost To Split Gas (multi-unit)', materialCost: 0, laborCost: 2000, unit: 'per unit' },
      { name: 'Furnace Replacement', materialCost: 1200, laborCost: 1250, unit: 'each' },
      { name: 'AC Replacement', materialCost: 1200, laborCost: 1000, unit: 'each' },
      { name: 'Furnace New Install', materialCost: 1200, laborCost: 3000, unit: 'each' },
      { name: 'AC New Install', materialCost: 1200, laborCost: 2000, unit: 'each' },
      { name: 'Gas Pressure Test', materialCost: 0, laborCost: 300, unit: 'each' },
      { name: 'Gas Valve Replacement', materialCost: 6, laborCost: 20, unit: 'each' },
      { name: 'New Bath Fan Install', materialCost: 89, laborCost: 160, unit: 'each' },
    ],
  },
  {
    category: 'Electrical',
    section: 'interior',
    items: [
      { name: 'Electric Meter Install', materialCost: 500, laborCost: 2400, unit: 'each' },
      { name: 'Panel Replacement', materialCost: 300, laborCost: 900, unit: 'each' },
      { name: 'Bath Vanity Light', materialCost: 18, laborCost: 10, unit: 'per fixture' },
      { name: 'Ceiling Light', materialCost: 10, laborCost: 10, unit: 'per fixture' },
      { name: 'Wall Sconce', materialCost: 10, laborCost: 10, unit: 'per fixture' },
      { name: 'Motion Flood Light', materialCost: 15, laborCost: 10, unit: 'per fixture' },
      { name: 'Ceiling Fan', materialCost: 60, laborCost: 20, unit: 'per fixture' },
      { name: 'Closet Light', materialCost: 10, laborCost: 10, unit: 'per fixture' },
      { name: 'Smoke Detector', materialCost: 11, laborCost: 10, unit: 'per fixture' },
      { name: 'CO Detector', materialCost: 19, laborCost: 10, unit: 'per fixture' },
      { name: 'New Electric Stove Rough-In', materialCost: 80, laborCost: 250, unit: 'each' },
      { name: 'New Electric Laundry Rough-In', materialCost: 100, laborCost: 300, unit: 'each' },
      { name: 'New AC Electric Rough-In', materialCost: 100, laborCost: 250, unit: 'each' },
      { name: 'New Water Heater Rough-In', materialCost: 60, laborCost: 200, unit: 'each' },
      { name: 'House Rewire', materialCost: 1, laborCost: 2, unit: 'per sqft' },
    ],
  },
  {
    category: 'Plumbing',
    section: 'interior',
    items: [
      { name: 'Water Meter Install', materialCost: 0, laborCost: 150, unit: 'each' },
      { name: 'Electric Water Heater (new install)', materialCost: 700, laborCost: 750, unit: 'each' },
      { name: 'Electric Water Heater (replacement)', materialCost: 700, laborCost: 500, unit: 'each' },
      { name: 'Gas Water Heater (new install)', materialCost: 500, laborCost: 750, unit: 'each' },
      { name: 'Gas Water Heater (replacement)', materialCost: 500, laborCost: 500, unit: 'each' },
      { name: 'Kitchen Faucet & Lines', materialCost: 50, laborCost: 20, unit: 'per fixture' },
      { name: 'Kitchen Sink', materialCost: 80, laborCost: 80, unit: 'per fixture' },
      { name: 'Bath Faucet & Lines', materialCost: 50, laborCost: 40, unit: 'per fixture' },
      { name: 'Bath Sink Top', materialCost: 60, laborCost: 30, unit: 'per fixture' },
      { name: 'Bath Vanity', materialCost: 110, laborCost: 180, unit: 'per fixture' },
      { name: 'Toilet, Seal & Lines', materialCost: 90, laborCost: 50, unit: 'per fixture' },
      { name: 'Tub/Shower Replacement', materialCost: 600, laborCost: 500, unit: 'each' },
      { name: 'Tub/Shower Trim Kit', materialCost: 110, laborCost: 100, unit: 'each' },
      { name: 'New Sink Rough-In', materialCost: 200, laborCost: 800, unit: 'each' },
      { name: 'New Toilet Rough-In', materialCost: 350, laborCost: 2500, unit: 'each' },
      { name: 'New Tub/Shower Rough-In', materialCost: 1000, laborCost: 2500, unit: 'each' },
      { name: 'House PEX Repipe', materialCost: 1, laborCost: 1, unit: 'per sqft' },
    ],
  },
  {
    category: 'Appliances',
    section: 'interior',
    items: [
      { name: 'Gas Stove + Hookups', materialCost: 410, laborCost: 50, unit: 'each' },
      { name: 'Electric Stove + Hookups', materialCost: 450, laborCost: 50, unit: 'each' },
      { name: 'Refrigerator', materialCost: 580, laborCost: 50, unit: 'each' },
      { name: 'Microwave', materialCost: 120, laborCost: 10, unit: 'each' },
      { name: 'Dishwasher', materialCost: 300, laborCost: 50, unit: 'each' },
      { name: 'Washer + Hookups', materialCost: 380, laborCost: 50, unit: 'each' },
      { name: 'Gas Dryer + Hookups', materialCost: 400, laborCost: 50, unit: 'each' },
      { name: 'Electric Dryer + Hookups', materialCost: 380, laborCost: 50, unit: 'each' },
    ],
  },
  {
    category: 'Hardware & Finishes',
    section: 'interior',
    items: [
      { name: 'Passage Knob', materialCost: 9, laborCost: 5, unit: 'each' },
      { name: 'Privacy Knob', materialCost: 9, laborCost: 5, unit: 'each' },
      { name: 'Deadbolt', materialCost: 4, laborCost: 5, unit: 'each' },
      { name: 'Bath Curtain/Rod Set', materialCost: 19, laborCost: 5, unit: 'per set' },
      { name: 'Bath Towel Bar/Hardware Set', materialCost: 94, laborCost: 50, unit: 'per set' },
      { name: 'Doorstops', materialCost: 2, laborCost: 4, unit: 'each' },
      { name: 'Kitchen Countertop', materialCost: 35, laborCost: 20, unit: 'per linear ft' },
      { name: 'Kitchen Cabinet Set', materialCost: 1800, laborCost: 500, unit: 'per kitchen (avg)' },
    ],
  },
  {
    category: 'Flooring & Rough Materials',
    section: 'interior',
    items: [
      { name: 'Subfloor (per 4x8 sheet)', materialCost: 17, laborCost: 48, unit: 'per 32 sqft sheet' },
      { name: 'Carpet + Pad + Tack Strip', materialCost: 0.88, laborCost: 1.50, unit: 'per sqft' },
      { name: 'Hard Floor (LVP/Laminate)', materialCost: 0.91, laborCost: 1.00, unit: 'per sqft', miscNote: '$29/box covers 32 sqft' },
      { name: 'Hard Floor Adhesive', materialCost: 0.08, laborCost: 0.33, unit: 'per sqft', miscNote: '$12/box covers 150 sqft' },
      { name: 'Floor Polyurethane', materialCost: 0.19, laborCost: 1.00, unit: 'per sqft', miscNote: '$47/gal covers 250 sqft' },
      { name: 'Interior Wall Paint', materialCost: 0.07, laborCost: 1.00, unit: 'per sqft', miscNote: '$17/gal covers 250 sqft' },
      { name: 'Interior Trim Paint', materialCost: 0.06, laborCost: 0.83, unit: 'per sqft', miscNote: '$17/gal covers 300 sqft' },
      { name: '2x4x10 Stud', materialCost: 3.17, laborCost: 4.00, unit: 'each' },
      { name: 'Drywall 4x8 Sheet', materialCost: 12, laborCost: 44, unit: 'each (32 sqft)' },
      { name: 'Bath Floor Tile', materialCost: 3, laborCost: 5, unit: 'per sqft' },
    ],
  },
];

// ── Quick-calc helpers ──────────────────────────────────

/** Calculate roofing cost from house dimensions */
export function calcRoofingCost(
  lengthFt: number,
  widthFt: number,
  pitch: number = 1.15, // typical gable roof multiplier
  needsTearOff: boolean = true,
  needsSheeting: boolean = false
) {
  const roofSqft = lengthFt * widthFt * pitch;
  const squares = roofSqft / 100;
  const roofCat = ESTIMATOR_PRICING.find(c => c.category === 'Roofing')!;
  const shingles = roofCat.items.find(i => i.name === 'Shingles')!;
  const tearOff = roofCat.items.find(i => i.name === 'Tear Off')!;
  const sheeting = roofCat.items.find(i => i.name === 'Sheeting / Decking')!;

  let material = squares * shingles.materialCost;
  let labor = squares * shingles.laborCost;

  if (needsTearOff) {
    material += squares * tearOff.materialCost;
    labor += squares * tearOff.laborCost;
  }
  if (needsSheeting) {
    material += squares * sheeting.materialCost;
    labor += squares * sheeting.laborCost;
  }

  return { squares: Math.round(squares * 10) / 10, material: Math.round(material), labor: Math.round(labor), total: Math.round(material + labor) };
}

/** Calculate siding cost from wall dimensions */
export function calcSidingCost(
  perimeterFt: number,
  wallHeightFt: number = 9,
  windowCount: number = 8,
  avgWindowSqft: number = 15
) {
  const grossWallSqft = perimeterFt * wallHeightFt;
  const netWallSqft = grossWallSqft - (windowCount * avgWindowSqft);
  const squares = netWallSqft / 100;
  const sidingItem = ESTIMATOR_PRICING.find(c => c.category === 'Siding')!.items[0];

  const material = Math.round(squares * sidingItem.materialCost);
  const labor = Math.round(squares * sidingItem.laborCost);
  return { squares: Math.round(squares * 10) / 10, material, labor, total: material + labor };
}

/** Calculate exterior paint cost from wall sqft */
export function calcExteriorPaintCost(wallSqft: number) {
  const paintCat = ESTIMATOR_PRICING.find(c => c.category === 'Exterior Paint')!;
  const wallPaint = paintCat.items.find(i => i.name === 'Exterior Wall Paint')!;
  const gallons = Math.ceil(wallSqft / 200); // 200 sqft per gallon
  const material = gallons * wallPaint.materialCost;
  const labor = gallons * wallPaint.laborCost;
  return { gallons, material: Math.round(material), labor: Math.round(labor), total: Math.round(material + labor) };
}

/** Get total cost for a list of items with quantities */
export function calcItemizedCost(
  selections: Array<{ categoryName: string; itemName: string; qty: number }>
): { material: number; labor: number; total: number; breakdown: Array<{ name: string; qty: number; material: number; labor: number; total: number }> } {
  let totalMaterial = 0;
  let totalLabor = 0;
  const breakdown: Array<{ name: string; qty: number; material: number; labor: number; total: number }> = [];

  for (const sel of selections) {
    const cat = ESTIMATOR_PRICING.find(c => c.category === sel.categoryName);
    if (!cat) continue;
    const item = cat.items.find(i => i.name === sel.itemName);
    if (!item) continue;

    const mat = Math.round(item.materialCost * sel.qty);
    const lab = Math.round(item.laborCost * sel.qty);
    totalMaterial += mat;
    totalLabor += lab;
    breakdown.push({ name: item.name, qty: sel.qty, material: mat, labor: lab, total: mat + lab });
  }

  return { material: totalMaterial, labor: totalLabor, total: totalMaterial + totalLabor, breakdown };
}
