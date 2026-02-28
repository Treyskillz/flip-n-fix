// ============================================================
// Renovation Estimator Engine
// Replicates ALL formulas from the 2022 Renovation Estimator
// spreadsheet with boolean-gated per-item calculations.
// ============================================================

import { ESTIMATOR_PRICING } from './estimatorPricing';

// ── Helpers to look up unit costs from pricing table ──────
function findItem(category: string, name: string) {
  const cat = ESTIMATOR_PRICING.find(c => c.category === category);
  if (!cat) return { materialCost: 0, laborCost: 0 };
  const item = cat.items.find(i => i.name === name);
  return item ?? { materialCost: 0, laborCost: 0 };
}

// Coverage constants (from Pricing Structure sheet column D)
const COVERAGE = {
  foundationPaintSqftPerGal: 200,
  extWallPaintSqftPerGal: 200,
  trimPaintSqftPerGal: 150,
  intWallPaintSqftPerGal: 250,
  intTrimPaintSqftPerGal: 300,
  hardfloorSqftPerBox: 32,
  adhesiveSqftPerBox: 150,
  polySqftPerGal: 250,
  subfloorsqftPerSheet: 32,
};

// ── Property Input Types ──────────────────────────────────

export interface PropertyInputs {
  address: string;
  estimationDate: string;
  sqft: number;
  beds: number;
  baths: number;
  floors: number;
  rentableUnits: number;
  marketRent: number;
  yearlyTaxes: number;
  purchasePrice: number;
  arv: number;
}

export interface ExteriorInputs {
  // Building dimensions
  houseLength: number;
  houseWidth: number;
  houseHeight: number;
  garageLength: number;
  garageWidth: number;
  garageHeight: number;
  extDoors: number;
  intDoors: number;
  windowCount: number;

  // Roof
  houseRoofSQ: number;
  garageRoofSQ: number;
  houseTearOff: boolean;
  garageTearOff: boolean;
  houseReshingle: boolean;
  garageReshingle: boolean;
  houseResheet: boolean;
  garageResheet: boolean;

  // Siding
  houseSidingSQ: number;
  garageSidingSQ: number;
  houseReplaceSiding: boolean;
  garageReplaceSiding: boolean;

  // Paint
  housePaintSidingSQ: number;
  garagePaintSidingSQ: number;
  paintHouseSiding: boolean;
  paintGarageSiding: boolean;
  paintHouseTrim: boolean;
  paintGarageTrim: boolean;
  paintHouseFoundation: boolean;
  paintGarageFoundation: boolean;

  // Gutters
  houseReplaceGutters: boolean;
  garageReplaceGutters: boolean;

  // Foundation
  houseFoundationDistFt: number;
  garageFoundationDistFt: number;
  houseStraightenFoundation: boolean;
  garageStraightenFoundation: boolean;
  houseRebuildFoundation: boolean;
  garageRebuildFoundation: boolean;

  // Windows
  windowReplacements: number;
  historicReplacements: number;
  glassReplacements: number;
  screenReplacements: number;

  // Porch
  porchSqft: number;
  redeck: boolean;
  newFootings: boolean;

  // Yard
  lotSqft: number;
  generalLandscape: boolean;
  highGrass: boolean;
  treesToTrim: number;
  treeRemovals: number;
  removeTrash: boolean;
}

export interface KitchenInputs {
  sqft: number;
  ceilingHeight: number;
  countertopFt: number;
  frameNewWallFt: number;
  newDrywallSheets: number;
  // Appliances
  gasStove: boolean;
  electricStove: boolean;
  refrigerator: boolean;
  microwave: boolean;
  dishwasher: boolean;
  washer: boolean;
  gasDryer: boolean;
  electricDryer: boolean;
  // Finishes
  installCabinets: boolean;
  installCountertops: boolean;
  newSink: boolean;
  newFaucet: boolean;
  installSubfloor: boolean;
  installHardfloor: boolean;
  floorAdhesive: boolean;
  sandRefinish: boolean;
  paintWalls: boolean;
  paintTrim: boolean;
}

export interface RoomInputs {
  label: string;
  sqft: number;
  ceilingHeight: number;
  frameNewWallFt: number;
  newDrywallSheets: number;
  installSubfloor: boolean;
  installHardfloorSqft: number;
  installCarpetSqft: number;
  floorAdhesive: boolean;
  sandRefinish: boolean;
  paintWalls: boolean;
  paintTrim: boolean;
}

export interface BathroomInputs {
  label: string;
  sqft: number;
  ceilingHeight: number;
  frameNewWallFt: number;
  newDrywallSheets: number;
  installSubfloor: boolean;
  installHardfloorSqft: number;
  installTileSqft: number;
  floorAdhesive: boolean;
  sandRefinish: boolean;
  paintWalls: boolean;
  paintTrim: boolean;
  // Fixtures
  replaceToilet: boolean;
  replaceFaucet: boolean;
  replaceSinktop: boolean;
  replaceVanity: boolean;
  replaceTubTrimKit: boolean;
  newCurtainRodHardware: boolean;
  replaceSurround: boolean;
}

export interface MechanicalInputs {
  // HVAC
  gasMeters: number;
  furnaceInstalls: number;
  furnaceReplacements: number;
  acInstalls: number;
  acReplacements: number;
  gasPressureTest: boolean;
  gasValveReplace: boolean;
  bathFans: number;
  gasSplitFromUnits: number;
  gasSplitToUnits: number;

  // Electrical
  elecMeters: number;
  elecPanels: number;
  vanityLights: number;
  ceilingLights: number;
  wallSconces: number;
  floodLights: number;
  ceilingFans: number;
  closetLights: number;
  smokeDetectors: number;
  coDetectors: number;
  elecStoveRoughIns: number;
  elecLaundryRoughIns: number;
  acElecRoughIns: number;
  whElecRoughIns: number;
  rewireEntireHouse: boolean;
  houseSqft: number; // for rewire calc

  // Plumbing
  waterMeters: number;
  gasWaterHeaterNew: number;
  gasWaterHeaterReplace: number;
  elecWaterHeaterNew: number;
  elecWaterHeaterReplace: number;
  newSinkRoughIns: number;
  newToiletRoughIns: number;
  newTubShowerRoughIns: number;
  repipeEntireHouse: boolean;
}

// ── Result Types ──────────────────────────────────────────

export interface CostLine {
  name: string;
  material: number;
  labor: number;
  total: number;
}

export interface SectionResult {
  label: string;
  lines: CostLine[];
  totalMaterial: number;
  totalLabor: number;
  total: number;
}

export interface EstimatorResult {
  sections: SectionResult[];
  grandTotalMaterial: number;
  grandTotalLabor: number;
  grandTotal: number;
  // Profitability
  profit: number;
  profitPercent: number;
  dealRating: string;
}

// ── Calculation Functions ─────────────────────────────────

function line(name: string, material: number, labor: number): CostLine {
  return { name, material: Math.round(material), labor: Math.round(labor), total: Math.round(material + labor) };
}

function sumSection(label: string, lines: CostLine[]): SectionResult {
  const totalMaterial = lines.reduce((s, l) => s + l.material, 0);
  const totalLabor = lines.reduce((s, l) => s + l.labor, 0);
  return { label, lines, totalMaterial, totalLabor, total: totalMaterial + totalLabor };
}

// ── Exterior Calculations ─────────────────────────────────

export function calcExterior(ext: ExteriorInputs, prop: PropertyInputs): SectionResult {
  const lines: CostLine[] = [];
  const p = (cat: string, name: string) => findItem(cat, name);

  // ── Roof ──
  const tearOff = p('Roofing', 'Tear Off');
  const shingles = p('Roofing', 'Shingles');
  const sheeting = p('Roofing', 'Sheeting / Decking');

  if (ext.houseTearOff) lines.push(line('House Roof Tear Off', 0, tearOff.laborCost * ext.houseRoofSQ));
  if (ext.garageTearOff) lines.push(line('Garage Roof Tear Off', 0, tearOff.laborCost * ext.garageRoofSQ));
  if (ext.houseReshingle) lines.push(line('House Roof Reshingle', shingles.materialCost * ext.houseRoofSQ, shingles.laborCost * ext.houseRoofSQ));
  if (ext.garageReshingle) lines.push(line('Garage Roof Reshingle', shingles.materialCost * ext.garageRoofSQ, shingles.laborCost * ext.garageRoofSQ));
  if (ext.houseResheet) lines.push(line('House Roof Resheet', sheeting.materialCost * ext.houseRoofSQ, sheeting.laborCost * ext.houseRoofSQ));
  if (ext.garageResheet) lines.push(line('Garage Roof Resheet', sheeting.materialCost * ext.garageRoofSQ, sheeting.laborCost * ext.garageRoofSQ));

  // ── Siding ──
  const siding = p('Siding', 'Siding (vinyl/fiber cement)');
  if (ext.houseReplaceSiding) lines.push(line('House Siding Replacement', siding.materialCost * ext.houseSidingSQ, siding.laborCost * ext.houseSidingSQ));
  if (ext.garageReplaceSiding) lines.push(line('Garage Siding Replacement', siding.materialCost * ext.garageSidingSQ, siding.laborCost * ext.garageSidingSQ));

  // ── Exterior Paint ──
  const wallPaint = p('Exterior Paint', 'Exterior Wall Paint');
  const trimPaint = p('Exterior Paint', 'Trim Paint');
  const foundPaint = p('Exterior Paint', 'Foundation Paint');

  if (ext.paintHouseSiding) {
    const gals = (ext.housePaintSidingSQ * 100) / COVERAGE.extWallPaintSqftPerGal;
    lines.push(line('House Siding Paint', gals * wallPaint.materialCost, gals * wallPaint.laborCost));
  }
  if (ext.paintGarageSiding) {
    const gals = (ext.garagePaintSidingSQ * 100) / COVERAGE.extWallPaintSqftPerGal;
    lines.push(line('Garage Siding Paint', gals * wallPaint.materialCost, gals * wallPaint.laborCost));
  }
  if (ext.paintHouseTrim) {
    // Trim area: doors × 21sqft + windows × 16sqft
    const trimSqft = (ext.extDoors * 21) + (ext.windowCount * 16);
    const gals = trimSqft / COVERAGE.trimPaintSqftPerGal;
    lines.push(line('House Trim Paint', gals * trimPaint.materialCost, gals * trimPaint.laborCost));
  }
  if (ext.paintGarageTrim) {
    const trimSqft = ext.garageLength * ext.garageWidth; // simplified for garage
    const gals = trimSqft / COVERAGE.trimPaintSqftPerGal;
    lines.push(line('Garage Trim Paint', gals * trimPaint.materialCost, gals * trimPaint.laborCost));
  }
  if (ext.paintHouseFoundation) {
    const foundSqft = ext.houseLength * ext.houseWidth;
    const gals = foundSqft / COVERAGE.foundationPaintSqftPerGal;
    lines.push(line('House Foundation Paint', gals * foundPaint.materialCost, gals * foundPaint.laborCost));
  }
  if (ext.paintGarageFoundation) {
    const foundSqft = ext.garageLength * ext.garageWidth;
    const gals = foundSqft / COVERAGE.foundationPaintSqftPerGal;
    lines.push(line('Garage Foundation Paint', gals * foundPaint.materialCost, gals * foundPaint.laborCost));
  }

  // ── Gutters ──
  const gutter = p('Roofing', 'Gutters');
  if (ext.houseReplaceGutters) {
    const perim = (ext.houseLength + ext.houseWidth + ext.houseHeight) * 2 + ext.houseHeight * 2;
    lines.push(line('House Gutters', perim * gutter.materialCost, perim * gutter.laborCost));
  }
  if (ext.garageReplaceGutters) {
    const perim = (ext.garageLength + ext.garageWidth + ext.garageHeight) * 2 + ext.garageHeight * 2;
    lines.push(line('Garage Gutters', perim * gutter.materialCost, perim * gutter.laborCost));
  }

  // ── Foundation ──
  const fStraighten = p('Foundation', 'Foundation Straighten');
  const fRebuild = p('Foundation', 'Foundation Rebuild');
  if (ext.houseStraightenFoundation) lines.push(line('House Foundation Straighten', fStraighten.materialCost * ext.houseFoundationDistFt, fStraighten.laborCost * ext.houseFoundationDistFt));
  if (ext.garageStraightenFoundation) lines.push(line('Garage Foundation Straighten', fStraighten.materialCost * ext.garageFoundationDistFt, fStraighten.laborCost * ext.garageFoundationDistFt));
  if (ext.houseRebuildFoundation) lines.push(line('House Foundation Rebuild', fRebuild.materialCost * ext.houseFoundationDistFt, fRebuild.laborCost * ext.houseFoundationDistFt));
  if (ext.garageRebuildFoundation) lines.push(line('Garage Foundation Rebuild', fRebuild.materialCost * ext.garageFoundationDistFt, fRebuild.laborCost * ext.garageFoundationDistFt));

  // ── Windows ──
  const winReplace = p('Windows', 'Window Replacement');
  const winHistoric = p('Windows', 'Historic Window Replacement');
  const winGlass = p('Windows', 'Window Glass Repair');
  const winScreen = p('Windows', 'Screen Replacement');
  if (ext.windowReplacements > 0) lines.push(line('Window Replacements', winReplace.materialCost * ext.windowReplacements, winReplace.laborCost * ext.windowReplacements));
  if (ext.historicReplacements > 0) lines.push(line('Historic Window Replacements', winHistoric.materialCost * ext.historicReplacements, winHistoric.laborCost * ext.historicReplacements));
  if (ext.glassReplacements > 0) lines.push(line('Glass Replacements', winGlass.materialCost * ext.glassReplacements, winGlass.laborCost * ext.glassReplacements));
  if (ext.screenReplacements > 0) lines.push(line('Screen Replacements', winScreen.materialCost * ext.screenReplacements, winScreen.laborCost * ext.screenReplacements));

  // ── Porch ──
  const redeck = p('Porches & Decks', 'Redeck');
  const footings = p('Porches & Decks', 'New Footings');
  if (ext.redeck) lines.push(line('Porch Redeck', redeck.materialCost * ext.porchSqft, redeck.laborCost * ext.porchSqft));
  if (ext.newFootings) lines.push(line('New Porch Footings', footings.materialCost * ext.porchSqft, footings.laborCost * ext.porchSqft));

  // ── Yard ──
  if (ext.highGrass) lines.push(line('High Grass Clearing', 0, findItem('Landscaping', 'Yard Brush Clearing').laborCost * ext.lotSqft));
  if (ext.generalLandscape) lines.push(line('General Landscaping', 0, findItem('Landscaping', 'General Landscaping').laborCost));
  if (ext.removeTrash) lines.push(line('Remove Yard Trash', 0, findItem('Landscaping', 'Remove Yard Trash').laborCost));
  if (ext.treesToTrim > 0) lines.push(line('Trim Trees', 0, findItem('Landscaping', 'Trim Tree').laborCost * ext.treesToTrim));
  if (ext.treeRemovals > 0) lines.push(line('Remove Trees', 0, findItem('Landscaping', 'Remove Tree').laborCost * ext.treeRemovals));

  return sumSection('Exterior', lines);
}

// ── Kitchen Calculations ──────────────────────────────────

export function calcKitchen(k: KitchenInputs): SectionResult {
  const lines: CostLine[] = [];
  const p = (cat: string, name: string) => findItem(cat, name);

  // Appliances
  if (k.gasStove) { const i = p('Appliances', 'Gas Stove + Hookups'); lines.push(line('Gas Stove', i.materialCost, i.laborCost)); }
  if (k.electricStove) { const i = p('Appliances', 'Electric Stove + Hookups'); lines.push(line('Electric Stove', i.materialCost, i.laborCost)); }
  if (k.refrigerator) { const i = p('Appliances', 'Refrigerator'); lines.push(line('Refrigerator', i.materialCost, i.laborCost)); }
  if (k.microwave) { const i = p('Appliances', 'Microwave'); lines.push(line('Microwave', i.materialCost, i.laborCost)); }
  if (k.dishwasher) { const i = p('Appliances', 'Dishwasher'); lines.push(line('Dishwasher', i.materialCost, i.laborCost)); }
  if (k.washer) { const i = p('Appliances', 'Washer + Hookups'); lines.push(line('Washer', i.materialCost, i.laborCost)); }
  if (k.gasDryer) { const i = p('Appliances', 'Gas Dryer + Hookups'); lines.push(line('Gas Dryer', i.materialCost, i.laborCost)); }
  if (k.electricDryer) { const i = p('Appliances', 'Electric Dryer + Hookups'); lines.push(line('Electric Dryer', i.materialCost, i.laborCost)); }

  // Cabinets & Countertops
  if (k.installCabinets) { const i = p('Hardware & Finishes', 'Kitchen Cabinet Set'); lines.push(line('Kitchen Cabinets', i.materialCost, i.laborCost)); }
  if (k.installCountertops && k.countertopFt > 0) { const i = p('Hardware & Finishes', 'Kitchen Countertop'); lines.push(line('Countertops', i.materialCost * k.countertopFt, i.laborCost * k.countertopFt)); }
  if (k.newSink) { const i = p('Plumbing', 'Kitchen Sink'); lines.push(line('Kitchen Sink', i.materialCost, i.laborCost)); }
  if (k.newFaucet) { const i = p('Plumbing', 'Kitchen Faucet & Lines'); lines.push(line('Kitchen Faucet', i.materialCost, i.laborCost)); }

  // Framing & Drywall
  if (k.frameNewWallFt > 0) {
    const studs = k.frameNewWallFt / 1.333; // 16" OC
    const stud = p('Flooring & Rough Materials', '2x4x10 Stud');
    lines.push(line('Wall Framing', studs * stud.materialCost, studs * k.ceilingHeight * stud.laborCost));
  }
  if (k.newDrywallSheets > 0) {
    const dw = p('Flooring & Rough Materials', 'Drywall 4x8 Sheet');
    lines.push(line('Drywall', dw.materialCost * k.newDrywallSheets, dw.laborCost * k.newDrywallSheets));
  }

  // Flooring
  if (k.installSubfloor) {
    const sheets = k.sqft / COVERAGE.subfloorsqftPerSheet;
    const sf = p('Flooring & Rough Materials', 'Subfloor (per 4x8 sheet)');
    lines.push(line('Subfloor', sf.materialCost * sheets, sf.laborCost * sheets));
  }
  if (k.installHardfloor) {
    const hf = p('Flooring & Rough Materials', 'Hard Floor (LVP/Laminate)');
    lines.push(line('Hard Floor', hf.materialCost * k.sqft, hf.laborCost * k.sqft));
  }
  if (k.floorAdhesive) {
    const ad = p('Flooring & Rough Materials', 'Hard Floor Adhesive');
    lines.push(line('Floor Adhesive', ad.materialCost * k.sqft, ad.laborCost * k.sqft));
  }
  if (k.sandRefinish) {
    const poly = p('Flooring & Rough Materials', 'Floor Polyurethane');
    lines.push(line('Sand & Refinish Floor', poly.materialCost * k.sqft, poly.laborCost * k.sqft));
  }

  // Paint
  if (k.paintWalls) {
    const wallArea = Math.sqrt(k.sqft) * 4 * k.ceilingHeight;
    const gals = wallArea / COVERAGE.intWallPaintSqftPerGal;
    const wp = p('Flooring & Rough Materials', 'Interior Wall Paint');
    lines.push(line('Wall Paint', wallArea * wp.materialCost, wallArea * wp.laborCost));
  }
  if (k.paintTrim) {
    const trimArea = Math.sqrt(k.sqft) * 4 * 0.8;
    const tp = p('Flooring & Rough Materials', 'Interior Trim Paint');
    lines.push(line('Trim Paint', trimArea * tp.materialCost, trimArea * tp.laborCost));
  }

  return sumSection('Kitchen', lines);
}

// ── Room Calculations (Living Area / Bedroom) ─────────────

export function calcRoom(r: RoomInputs): SectionResult {
  const lines: CostLine[] = [];
  const p = (cat: string, name: string) => findItem(cat, name);

  // Framing & Drywall
  if (r.frameNewWallFt > 0) {
    const studs = r.frameNewWallFt / 1.333;
    const stud = p('Flooring & Rough Materials', '2x4x10 Stud');
    lines.push(line('Wall Framing', studs * stud.materialCost, studs * r.ceilingHeight * stud.laborCost));
  }
  if (r.newDrywallSheets > 0) {
    const dw = p('Flooring & Rough Materials', 'Drywall 4x8 Sheet');
    lines.push(line('Drywall', dw.materialCost * r.newDrywallSheets, dw.laborCost * r.newDrywallSheets));
  }

  // Flooring
  if (r.installSubfloor) {
    const sheets = r.sqft / COVERAGE.subfloorsqftPerSheet;
    const sf = p('Flooring & Rough Materials', 'Subfloor (per 4x8 sheet)');
    lines.push(line('Subfloor', sf.materialCost * sheets, sf.laborCost * sheets));
  }
  if (r.installHardfloorSqft > 0) {
    const hf = p('Flooring & Rough Materials', 'Hard Floor (LVP/Laminate)');
    lines.push(line('Hard Floor', hf.materialCost * r.installHardfloorSqft, hf.laborCost * r.installHardfloorSqft));
  }
  if (r.installCarpetSqft > 0) {
    const cp = p('Flooring & Rough Materials', 'Carpet + Pad + Tack Strip');
    lines.push(line('Carpet', cp.materialCost * r.installCarpetSqft, cp.laborCost * r.installCarpetSqft));
  }
  if (r.floorAdhesive && r.installHardfloorSqft > 0) {
    const ad = p('Flooring & Rough Materials', 'Hard Floor Adhesive');
    lines.push(line('Floor Adhesive', ad.materialCost * r.installHardfloorSqft, ad.laborCost * r.installHardfloorSqft));
  }
  if (r.sandRefinish) {
    const poly = p('Flooring & Rough Materials', 'Floor Polyurethane');
    lines.push(line('Sand & Refinish', poly.materialCost * r.sqft, poly.laborCost * r.sqft));
  }

  // Paint
  if (r.paintWalls) {
    const wallArea = Math.sqrt(r.sqft) * 4 * r.ceilingHeight;
    const wp = p('Flooring & Rough Materials', 'Interior Wall Paint');
    lines.push(line('Wall Paint', wallArea * wp.materialCost, wallArea * wp.laborCost));
  }
  if (r.paintTrim) {
    const trimArea = Math.sqrt(r.sqft) * 4 * 0.8;
    const tp = p('Flooring & Rough Materials', 'Interior Trim Paint');
    lines.push(line('Trim Paint', trimArea * tp.materialCost, trimArea * tp.laborCost));
  }

  return sumSection(r.label, lines);
}

// ── Bathroom Calculations ─────────────────────────────────

export function calcBathroom(b: BathroomInputs): SectionResult {
  const lines: CostLine[] = [];
  const p = (cat: string, name: string) => findItem(cat, name);

  // Framing & Drywall
  if (b.frameNewWallFt > 0) {
    const studs = b.frameNewWallFt / 1.333;
    const stud = p('Flooring & Rough Materials', '2x4x10 Stud');
    lines.push(line('Wall Framing', studs * stud.materialCost, studs * b.ceilingHeight * stud.laborCost));
  }
  if (b.newDrywallSheets > 0) {
    const dw = p('Flooring & Rough Materials', 'Drywall 4x8 Sheet');
    lines.push(line('Drywall', dw.materialCost * b.newDrywallSheets, dw.laborCost * b.newDrywallSheets));
  }

  // Flooring
  if (b.installSubfloor) {
    const sheets = b.sqft / COVERAGE.subfloorsqftPerSheet;
    const sf = p('Flooring & Rough Materials', 'Subfloor (per 4x8 sheet)');
    lines.push(line('Subfloor', sf.materialCost * sheets, sf.laborCost * sheets));
  }
  if (b.installHardfloorSqft > 0) {
    const hf = p('Flooring & Rough Materials', 'Hard Floor (LVP/Laminate)');
    lines.push(line('Hard Floor', hf.materialCost * b.installHardfloorSqft, hf.laborCost * b.installHardfloorSqft));
  }
  if (b.installTileSqft > 0) {
    const tile = p('Flooring & Rough Materials', 'Bath Floor Tile');
    lines.push(line('Floor Tile', tile.materialCost * b.installTileSqft, tile.laborCost * b.installTileSqft));
  }
  if (b.floorAdhesive && (b.installHardfloorSqft > 0 || b.installTileSqft > 0)) {
    const ad = p('Flooring & Rough Materials', 'Hard Floor Adhesive');
    const sqft = b.installHardfloorSqft || b.installTileSqft;
    lines.push(line('Floor Adhesive', ad.materialCost * sqft, ad.laborCost * sqft));
  }
  if (b.sandRefinish) {
    const poly = p('Flooring & Rough Materials', 'Floor Polyurethane');
    lines.push(line('Sand & Refinish', poly.materialCost * b.sqft, poly.laborCost * b.sqft));
  }

  // Fixtures
  if (b.replaceToilet) { const i = p('Plumbing', 'Toilet, Seal & Lines'); lines.push(line('Toilet', i.materialCost, i.laborCost)); }
  if (b.replaceFaucet) { const i = p('Plumbing', 'Bath Faucet & Lines'); lines.push(line('Faucet', i.materialCost, i.laborCost)); }
  if (b.replaceSinktop) { const i = p('Plumbing', 'Bath Sink Top'); lines.push(line('Sink Top', i.materialCost, i.laborCost)); }
  if (b.replaceVanity) { const i = p('Plumbing', 'Bath Vanity'); lines.push(line('Vanity', i.materialCost, i.laborCost)); }
  if (b.replaceTubTrimKit) { const i = p('Plumbing', 'Tub/Shower Trim Kit'); lines.push(line('Tub Trim Kit', i.materialCost, i.laborCost)); }
  if (b.newCurtainRodHardware) {
    const curtain = p('Hardware & Finishes', 'Bath Curtain/Rod Set');
    const towel = p('Hardware & Finishes', 'Bath Towel Bar/Hardware Set');
    lines.push(line('Curtain/Rod/Hardware', curtain.materialCost + towel.materialCost, curtain.laborCost + towel.laborCost));
  }
  if (b.replaceSurround) { const i = p('Plumbing', 'Tub/Shower Replacement'); lines.push(line('Tub/Shower Surround', i.materialCost, i.laborCost)); }

  // Paint
  if (b.paintWalls) {
    const wallArea = Math.sqrt(b.sqft) * 4 * b.ceilingHeight;
    const wp = p('Flooring & Rough Materials', 'Interior Wall Paint');
    lines.push(line('Wall Paint', wallArea * wp.materialCost, wallArea * wp.laborCost));
  }
  if (b.paintTrim) {
    const trimArea = Math.sqrt(b.sqft) * 4 * 0.8;
    const tp = p('Flooring & Rough Materials', 'Interior Trim Paint');
    lines.push(line('Trim Paint', trimArea * tp.materialCost, trimArea * tp.laborCost));
  }

  return sumSection(b.label, lines);
}

// ── Mechanical Calculations ───────────────────────────────

export function calcMechanical(m: MechanicalInputs): SectionResult {
  const lines: CostLine[] = [];
  const p = (cat: string, name: string) => findItem(cat, name);

  // HVAC
  if (m.gasMeters > 0) { const i = p('HVAC', 'Gas Meter Install'); lines.push(line('Gas Meter Install', i.materialCost * m.gasMeters, i.laborCost * m.gasMeters)); }
  if (m.furnaceInstalls > 0) { const i = p('HVAC', 'Furnace New Install'); lines.push(line('Furnace New Install', i.materialCost * m.furnaceInstalls, i.laborCost * m.furnaceInstalls)); }
  if (m.furnaceReplacements > 0) { const i = p('HVAC', 'Furnace Replacement'); lines.push(line('Furnace Replacement', i.materialCost * m.furnaceReplacements, i.laborCost * m.furnaceReplacements)); }
  if (m.acInstalls > 0) { const i = p('HVAC', 'AC New Install'); lines.push(line('AC New Install', i.materialCost * m.acInstalls, i.laborCost * m.acInstalls)); }
  if (m.acReplacements > 0) { const i = p('HVAC', 'AC Replacement'); lines.push(line('AC Replacement', i.materialCost * m.acReplacements, i.laborCost * m.acReplacements)); }
  if (m.gasPressureTest) { const i = p('HVAC', 'Gas Pressure Test'); lines.push(line('Gas Pressure Test', i.materialCost, i.laborCost)); }
  if (m.gasValveReplace) {
    const totalValves = m.gasMeters + (m.furnaceInstalls + m.furnaceReplacements); // simplified
    const i = p('HVAC', 'Gas Valve Replacement');
    lines.push(line('Gas Valve Replacement', i.materialCost * Math.max(totalValves, 1), i.laborCost * Math.max(totalValves, 1)));
  }
  if (m.bathFans > 0) { const i = p('HVAC', 'New Bath Fan Install'); lines.push(line('Bath Fan Install', i.materialCost * m.bathFans, i.laborCost * m.bathFans)); }
  if (m.gasSplitToUnits > m.gasSplitFromUnits) {
    const netUnits = m.gasSplitToUnits - m.gasSplitFromUnits;
    const i = p('HVAC', 'Cost To Split Gas (multi-unit)');
    lines.push(line('Gas Split', i.materialCost * netUnits, i.laborCost * netUnits));
  }

  // Electrical
  if (m.elecMeters > 0) { const i = p('Electrical', 'Electric Meter Install'); lines.push(line('Electric Meter Install', i.materialCost * m.elecMeters, i.laborCost * m.elecMeters)); }
  if (m.elecPanels > 0) { const i = p('Electrical', 'Panel Replacement'); lines.push(line('Panel Replacement', i.materialCost * m.elecPanels, i.laborCost * m.elecPanels)); }
  if (m.vanityLights > 0) { const i = p('Electrical', 'Bath Vanity Light'); lines.push(line('Vanity Lights', i.materialCost * m.vanityLights, i.laborCost * m.vanityLights)); }
  if (m.ceilingLights > 0) { const i = p('Electrical', 'Ceiling Light'); lines.push(line('Ceiling Lights', i.materialCost * m.ceilingLights, i.laborCost * m.ceilingLights)); }
  if (m.wallSconces > 0) { const i = p('Electrical', 'Wall Sconce'); lines.push(line('Wall Sconces', i.materialCost * m.wallSconces, i.laborCost * m.wallSconces)); }
  if (m.floodLights > 0) { const i = p('Electrical', 'Motion Flood Light'); lines.push(line('Flood Lights', i.materialCost * m.floodLights, i.laborCost * m.floodLights)); }
  if (m.ceilingFans > 0) { const i = p('Electrical', 'Ceiling Fan'); lines.push(line('Ceiling Fans', i.materialCost * m.ceilingFans, i.laborCost * m.ceilingFans)); }
  if (m.closetLights > 0) { const i = p('Electrical', 'Closet Light'); lines.push(line('Closet Lights', i.materialCost * m.closetLights, i.laborCost * m.closetLights)); }
  if (m.smokeDetectors > 0) { const i = p('Electrical', 'Smoke Detector'); lines.push(line('Smoke Detectors', i.materialCost * m.smokeDetectors, i.laborCost * m.smokeDetectors)); }
  if (m.coDetectors > 0) { const i = p('Electrical', 'CO Detector'); lines.push(line('CO Detectors', i.materialCost * m.coDetectors, i.laborCost * m.coDetectors)); }
  if (m.elecStoveRoughIns > 0) { const i = p('Electrical', 'New Electric Stove Rough-In'); lines.push(line('Stove Rough-In', i.materialCost * m.elecStoveRoughIns, i.laborCost * m.elecStoveRoughIns)); }
  if (m.elecLaundryRoughIns > 0) { const i = p('Electrical', 'New Electric Laundry Rough-In'); lines.push(line('Laundry Rough-In', i.materialCost * m.elecLaundryRoughIns, i.laborCost * m.elecLaundryRoughIns)); }
  if (m.acElecRoughIns > 0) { const i = p('Electrical', 'New AC Electric Rough-In'); lines.push(line('AC Rough-In', i.materialCost * m.acElecRoughIns, i.laborCost * m.acElecRoughIns)); }
  if (m.whElecRoughIns > 0) { const i = p('Electrical', 'New Water Heater Rough-In'); lines.push(line('Water Heater Rough-In', i.materialCost * m.whElecRoughIns, i.laborCost * m.whElecRoughIns)); }
  if (m.rewireEntireHouse) {
    const i = p('Electrical', 'House Rewire');
    lines.push(line('Whole House Rewire', i.materialCost * m.houseSqft, i.laborCost * m.houseSqft));
  }

  // Plumbing
  if (m.waterMeters > 0) { const i = p('Plumbing', 'Water Meter Install'); lines.push(line('Water Meter Install', i.materialCost * m.waterMeters, i.laborCost * m.waterMeters)); }
  if (m.gasWaterHeaterNew > 0) { const i = p('Plumbing', 'Gas Water Heater (new install)'); lines.push(line('Gas Water Heater (New)', i.materialCost * m.gasWaterHeaterNew, i.laborCost * m.gasWaterHeaterNew)); }
  if (m.gasWaterHeaterReplace > 0) { const i = p('Plumbing', 'Gas Water Heater (replacement)'); lines.push(line('Gas Water Heater (Replace)', i.materialCost * m.gasWaterHeaterReplace, i.laborCost * m.gasWaterHeaterReplace)); }
  if (m.elecWaterHeaterNew > 0) { const i = p('Plumbing', 'Electric Water Heater (new install)'); lines.push(line('Electric Water Heater (New)', i.materialCost * m.elecWaterHeaterNew, i.laborCost * m.elecWaterHeaterNew)); }
  if (m.elecWaterHeaterReplace > 0) { const i = p('Plumbing', 'Electric Water Heater (replacement)'); lines.push(line('Electric Water Heater (Replace)', i.materialCost * m.elecWaterHeaterReplace, i.laborCost * m.elecWaterHeaterReplace)); }
  if (m.newSinkRoughIns > 0) { const i = p('Plumbing', 'New Sink Rough-In'); lines.push(line('Sink Rough-In', i.materialCost * m.newSinkRoughIns, i.laborCost * m.newSinkRoughIns)); }
  if (m.newToiletRoughIns > 0) { const i = p('Plumbing', 'New Toilet Rough-In'); lines.push(line('Toilet Rough-In', i.materialCost * m.newToiletRoughIns, i.laborCost * m.newToiletRoughIns)); }
  if (m.newTubShowerRoughIns > 0) { const i = p('Plumbing', 'New Tub/Shower Rough-In'); lines.push(line('Tub/Shower Rough-In', i.materialCost * m.newTubShowerRoughIns, i.laborCost * m.newTubShowerRoughIns)); }
  if (m.repipeEntireHouse) {
    const i = p('Plumbing', 'House PEX Repipe');
    lines.push(line('Whole House Repipe', i.materialCost * m.houseSqft, i.laborCost * m.houseSqft));
  }

  return sumSection('Mechanicals', lines);
}

// ── Deal Rating ───────────────────────────────────────────

export function getDealRating(profitPercent: number): string {
  if (profitPercent < 0) return 'Renegotiate Deal';
  if (profitPercent < 0.05) return 'Less than 5% Profit';
  if (profitPercent < 0.10) return '5-10% Profit';
  if (profitPercent < 0.20) return '10-20% Profit';
  if (profitPercent < 0.30) return '20-30% Profit';
  return 'Great Deal!';
}

export function getDealRatingColor(profitPercent: number): string {
  if (profitPercent < 0) return 'text-red-500';
  if (profitPercent < 0.05) return 'text-orange-500';
  if (profitPercent < 0.10) return 'text-yellow-500';
  if (profitPercent < 0.20) return 'text-blue-500';
  return 'text-green-500';
}

// ── Full Estimate ─────────────────────────────────────────

export function calculateFullEstimate(
  property: PropertyInputs,
  exterior: ExteriorInputs,
  kitchen: KitchenInputs,
  rooms: RoomInputs[],
  bathrooms: BathroomInputs[],
  mechanical: MechanicalInputs
): EstimatorResult {
  const sections: SectionResult[] = [];

  const extResult = calcExterior(exterior, property);
  if (extResult.lines.length > 0) sections.push(extResult);

  const kitchenResult = calcKitchen(kitchen);
  if (kitchenResult.lines.length > 0) sections.push(kitchenResult);

  for (const room of rooms) {
    const roomResult = calcRoom(room);
    if (roomResult.lines.length > 0) sections.push(roomResult);
  }

  for (const bath of bathrooms) {
    const bathResult = calcBathroom(bath);
    if (bathResult.lines.length > 0) sections.push(bathResult);
  }

  const mechResult = calcMechanical(mechanical);
  if (mechResult.lines.length > 0) sections.push(mechResult);

  const grandTotalMaterial = sections.reduce((s, sec) => s + sec.totalMaterial, 0);
  const grandTotalLabor = sections.reduce((s, sec) => s + sec.totalLabor, 0);
  const grandTotal = grandTotalMaterial + grandTotalLabor;

  const profit = property.arv - (property.purchasePrice + grandTotal);
  const profitPercent = property.arv > 0 ? profit / property.arv : 0;
  const dealRating = getDealRating(profitPercent);

  return {
    sections,
    grandTotalMaterial,
    grandTotalLabor,
    grandTotal,
    profit,
    profitPercent,
    dealRating,
  };
}

// ── Default Initializers ──────────────────────────────────

export function defaultPropertyInputs(): PropertyInputs {
  return {
    address: '',
    estimationDate: new Date().toISOString().split('T')[0],
    sqft: 0,
    beds: 0,
    baths: 0,
    floors: 1,
    rentableUnits: 0,
    marketRent: 0,
    yearlyTaxes: 0,
    purchasePrice: 0,
    arv: 0,
  };
}

export function defaultExteriorInputs(): ExteriorInputs {
  return {
    houseLength: 0, houseWidth: 0, houseHeight: 9,
    garageLength: 0, garageWidth: 0, garageHeight: 9,
    extDoors: 2, intDoors: 1, windowCount: 0,
    houseRoofSQ: 0, garageRoofSQ: 0,
    houseTearOff: false, garageTearOff: false,
    houseReshingle: false, garageReshingle: false,
    houseResheet: false, garageResheet: false,
    houseSidingSQ: 0, garageSidingSQ: 0,
    houseReplaceSiding: false, garageReplaceSiding: false,
    housePaintSidingSQ: 0, garagePaintSidingSQ: 0,
    paintHouseSiding: false, paintGarageSiding: false,
    paintHouseTrim: false, paintGarageTrim: false,
    paintHouseFoundation: false, paintGarageFoundation: false,
    houseReplaceGutters: false, garageReplaceGutters: false,
    houseFoundationDistFt: 0, garageFoundationDistFt: 0,
    houseStraightenFoundation: false, garageStraightenFoundation: false,
    houseRebuildFoundation: false, garageRebuildFoundation: false,
    windowReplacements: 0, historicReplacements: 0, glassReplacements: 0, screenReplacements: 0,
    porchSqft: 0, redeck: false, newFootings: false,
    lotSqft: 0, generalLandscape: false, highGrass: false,
    treesToTrim: 0, treeRemovals: 0, removeTrash: false,
  };
}

export function defaultKitchenInputs(): KitchenInputs {
  return {
    sqft: 100, ceilingHeight: 9, countertopFt: 0,
    frameNewWallFt: 0, newDrywallSheets: 0,
    gasStove: false, electricStove: false, refrigerator: false,
    microwave: false, dishwasher: false, washer: false,
    gasDryer: false, electricDryer: false,
    installCabinets: false, installCountertops: false,
    newSink: false, newFaucet: false,
    installSubfloor: false, installHardfloor: false,
    floorAdhesive: false, sandRefinish: false,
    paintWalls: false, paintTrim: false,
  };
}

export function defaultRoomInputs(label: string): RoomInputs {
  return {
    label, sqft: 0, ceilingHeight: 9,
    frameNewWallFt: 0, newDrywallSheets: 0,
    installSubfloor: false, installHardfloorSqft: 0, installCarpetSqft: 0,
    floorAdhesive: false, sandRefinish: false,
    paintWalls: false, paintTrim: false,
  };
}

export function defaultBathroomInputs(label: string): BathroomInputs {
  return {
    label, sqft: 0, ceilingHeight: 9,
    frameNewWallFt: 0, newDrywallSheets: 0,
    installSubfloor: false, installHardfloorSqft: 0, installTileSqft: 0,
    floorAdhesive: false, sandRefinish: false,
    paintWalls: false, paintTrim: false,
    replaceToilet: false, replaceFaucet: false, replaceSinktop: false,
    replaceVanity: false, replaceTubTrimKit: false,
    newCurtainRodHardware: false, replaceSurround: false,
  };
}

export function defaultMechanicalInputs(houseSqft: number): MechanicalInputs {
  return {
    gasMeters: 0, furnaceInstalls: 0, furnaceReplacements: 0,
    acInstalls: 0, acReplacements: 0,
    gasPressureTest: false, gasValveReplace: false,
    bathFans: 0, gasSplitFromUnits: 0, gasSplitToUnits: 0,
    elecMeters: 0, elecPanels: 0,
    vanityLights: 0, ceilingLights: 0, wallSconces: 0,
    floodLights: 0, ceilingFans: 0, closetLights: 0,
    smokeDetectors: 0, coDetectors: 0,
    elecStoveRoughIns: 0, elecLaundryRoughIns: 0,
    acElecRoughIns: 0, whElecRoughIns: 0,
    rewireEntireHouse: false, houseSqft,
    waterMeters: 0, gasWaterHeaterNew: 0, gasWaterHeaterReplace: 0,
    elecWaterHeaterNew: 0, elecWaterHeaterReplace: 0,
    newSinkRoughIns: 0, newToiletRoughIns: 0, newTubShowerRoughIns: 0,
    repipeEntireHouse: false,
  };
}
