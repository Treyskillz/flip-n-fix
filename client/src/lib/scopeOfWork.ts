// ============================================================
// Fix & Flip Analyzer — Scope of Work with Material Tiers
// Three tiers: Rental, Standard, Luxury
// Each room has specific materials with current 2025-2026 pricing
// ============================================================

export type MaterialTier = 'rental' | 'standard' | 'luxury';

export interface MaterialLineItem {
  item: string;
  description: string;
  unit: string; // "per sqft", "each", "per linear ft", "per room"
  rentalCost: number;
  rentalMaterial: string;
  standardCost: number;
  standardMaterial: string;
  luxuryCost: number;
  luxuryMaterial: string;
  laborPerUnit: number; // labor cost per unit (same across tiers, adjusted by regional factor)
  quantity: number; // default quantity, recalculated based on sqft
  quantityBasis: 'sqft' | 'fixed' | 'bathroom_count' | 'bedroom_count';
}

export interface RoomScope {
  id: string;
  name: string;
  icon: string; // emoji
  enabled: boolean;
  items: MaterialLineItem[];
}

// ─── KITCHEN ─────────────────────────────────────────────────
const kitchenItems: MaterialLineItem[] = [
  {
    item: 'Cabinets',
    description: 'Full kitchen cabinet set (base + wall)',
    unit: 'per linear ft',
    rentalCost: 75,
    rentalMaterial: 'Thermofoil / Flat-panel melamine (Hampton Bay)',
    standardCost: 180,
    standardMaterial: 'Shaker-style solid wood (Allen + Roth / Diamond Now)',
    luxuryCost: 450,
    luxuryMaterial: 'Custom inset shaker (KraftMaid / Semi-custom)',
    laborPerUnit: 65,
    quantity: 25,
    quantityBasis: 'fixed',
  },
  {
    item: 'Countertops',
    description: 'Kitchen countertop with edge profile',
    unit: 'per sqft',
    rentalCost: 15,
    rentalMaterial: 'Laminate / Formica (VT Dimensions)',
    standardCost: 55,
    standardMaterial: 'Quartz (Silestone / LG Viatera)',
    luxuryCost: 120,
    luxuryMaterial: 'Quartzite / Marble (Calacatta / Super White)',
    laborPerUnit: 25,
    quantity: 40,
    quantityBasis: 'fixed',
  },
  {
    item: 'Backsplash',
    description: 'Kitchen backsplash tile',
    unit: 'per sqft',
    rentalCost: 3,
    rentalMaterial: 'Peel-and-stick vinyl tile',
    standardCost: 8,
    standardMaterial: 'Ceramic subway tile 3x6 (Daltile / MSI)',
    luxuryCost: 25,
    luxuryMaterial: 'Marble mosaic / Zellige handmade tile',
    laborPerUnit: 10,
    quantity: 30,
    quantityBasis: 'fixed',
  },
  {
    item: 'Sink & Faucet',
    description: 'Kitchen sink with faucet',
    unit: 'each',
    rentalCost: 150,
    rentalMaterial: 'Stainless steel drop-in + basic faucet (Glacier Bay)',
    standardCost: 400,
    standardMaterial: 'Undermount stainless (Kraus) + pull-down faucet (Moen Align)',
    luxuryCost: 1200,
    luxuryMaterial: 'Farmhouse fireclay (Kohler Whitehaven) + touchless faucet (Delta Trinsic)',
    laborPerUnit: 250,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Appliance Package',
    description: 'Range, refrigerator, dishwasher, microwave',
    unit: 'each',
    rentalCost: 2000,
    rentalMaterial: 'White / Black basic (Frigidaire / Amana)',
    standardCost: 4500,
    standardMaterial: 'Stainless steel mid-range (Whirlpool / Samsung)',
    luxuryCost: 12000,
    luxuryMaterial: 'Professional-style (KitchenAid / Bosch / Café)',
    laborPerUnit: 400,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Lighting',
    description: 'Recessed cans + pendant/under-cabinet',
    unit: 'per room',
    rentalCost: 150,
    rentalMaterial: 'Basic LED flush mount + under-cabinet strip',
    standardCost: 500,
    standardMaterial: 'LED recessed (6 cans) + pendant over island (Progress Lighting)',
    luxuryCost: 1500,
    luxuryMaterial: 'Designer pendants (Visual Comfort) + LED recessed + cabinet lighting',
    laborPerUnit: 350,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Hardware',
    description: 'Cabinet pulls and knobs',
    unit: 'each',
    rentalCost: 2,
    rentalMaterial: 'Basic satin nickel pulls (Everbilt)',
    standardCost: 5,
    standardMaterial: 'Brushed brass / matte black bar pulls (Amerock)',
    luxuryCost: 15,
    luxuryMaterial: 'Solid brass knurled pulls (Emtek / Rejuvenation)',
    laborPerUnit: 0,
    quantity: 30,
    quantityBasis: 'fixed',
  },
];

// ─── BATHROOM ────────────────────────────────────────────────
const bathroomItems: MaterialLineItem[] = [
  {
    item: 'Vanity + Top',
    description: 'Bathroom vanity with countertop and sink',
    unit: 'each',
    rentalCost: 200,
    rentalMaterial: '30" white melamine vanity + cultured marble top (Glacier Bay)',
    standardCost: 600,
    standardMaterial: '36" shaker vanity + quartz top (Home Decorators / Allen + Roth)',
    luxuryCost: 2000,
    luxuryMaterial: '48"+ floating vanity + marble top (Restoration Hardware / custom)',
    laborPerUnit: 300,
    quantity: 2,
    quantityBasis: 'bathroom_count',
  },
  {
    item: 'Toilet',
    description: 'Toilet replacement',
    unit: 'each',
    rentalCost: 120,
    rentalMaterial: 'Round-front basic (Glacier Bay / American Standard Cadet)',
    standardCost: 250,
    standardMaterial: 'Elongated comfort height (Kohler Cimarron / TOTO Drake)',
    luxuryCost: 800,
    luxuryMaterial: 'One-piece skirted (TOTO Ultramax II / Kohler Veil)',
    laborPerUnit: 200,
    quantity: 2,
    quantityBasis: 'bathroom_count',
  },
  {
    item: 'Tub / Shower',
    description: 'Tub or shower surround/tile',
    unit: 'each',
    rentalCost: 350,
    rentalMaterial: 'Fiberglass tub/shower combo surround (Sterling / Delta)',
    standardCost: 1200,
    standardMaterial: 'Tile surround with niche (ceramic 12x24) + acrylic tub (Kohler Bellwether)',
    luxuryCost: 4000,
    luxuryMaterial: 'Frameless glass shower + porcelain tile + freestanding tub',
    laborPerUnit: 800,
    quantity: 2,
    quantityBasis: 'bathroom_count',
  },
  {
    item: 'Faucets & Fixtures',
    description: 'Faucet, showerhead, towel bars, TP holder',
    unit: 'each',
    rentalCost: 80,
    rentalMaterial: 'Chrome basic set (Glacier Bay)',
    standardCost: 250,
    standardMaterial: 'Brushed nickel / matte black set (Moen Align / Delta Trinsic)',
    luxuryCost: 800,
    luxuryMaterial: 'Unlacquered brass / polished nickel (Kohler Purist / Brizo Litze)',
    laborPerUnit: 200,
    quantity: 2,
    quantityBasis: 'bathroom_count',
  },
  {
    item: 'Floor Tile',
    description: 'Bathroom floor tile',
    unit: 'per sqft',
    rentalCost: 2,
    rentalMaterial: 'Vinyl peel-and-stick tile',
    standardCost: 6,
    standardMaterial: 'Porcelain tile 12x24 (Daltile / MSI)',
    luxuryCost: 18,
    luxuryMaterial: 'Marble mosaic / large-format porcelain (Emser / Ann Sacks)',
    laborPerUnit: 8,
    quantity: 50,
    quantityBasis: 'fixed',
  },
  {
    item: 'Mirror + Medicine Cabinet',
    description: 'Vanity mirror or medicine cabinet',
    unit: 'each',
    rentalCost: 40,
    rentalMaterial: 'Basic frameless mirror (Glacier Bay)',
    standardCost: 150,
    standardMaterial: 'Framed mirror or recessed medicine cabinet (Pegasus)',
    luxuryCost: 500,
    luxuryMaterial: 'Backlit LED mirror or custom framed (Pottery Barn / Restoration Hardware)',
    laborPerUnit: 50,
    quantity: 2,
    quantityBasis: 'bathroom_count',
  },
  {
    item: 'Lighting',
    description: 'Vanity light fixture',
    unit: 'each',
    rentalCost: 30,
    rentalMaterial: 'Basic 2-light chrome bar (Hampton Bay)',
    standardCost: 100,
    standardMaterial: '3-light sconce matte black (Progress / Sea Gull)',
    luxuryCost: 400,
    luxuryMaterial: 'Designer sconces (Visual Comfort / Schoolhouse)',
    laborPerUnit: 75,
    quantity: 2,
    quantityBasis: 'bathroom_count',
  },
];

// ─── FLOORING ────────────────────────────────────────────────
const flooringItems: MaterialLineItem[] = [
  {
    item: 'Main Living Areas',
    description: 'Flooring for living room, dining, hallways',
    unit: 'per sqft',
    rentalCost: 1.50,
    rentalMaterial: 'Sheet vinyl / basic LVP (TrafficMaster)',
    standardCost: 3.50,
    standardMaterial: 'Luxury Vinyl Plank waterproof (LifeProof / COREtec)',
    luxuryCost: 9.00,
    luxuryMaterial: 'Engineered hardwood oak (Shaw / Bruce / Bella Cera)',
    laborPerUnit: 3.00,
    quantity: 800,
    quantityBasis: 'sqft',
  },
  {
    item: 'Bedroom Flooring',
    description: 'Flooring for bedrooms',
    unit: 'per sqft',
    rentalCost: 1.00,
    rentalMaterial: 'Builder-grade carpet (Shaw / Mohawk)',
    standardCost: 3.50,
    standardMaterial: 'LVP continuous from main areas (LifeProof / COREtec)',
    luxuryCost: 9.00,
    luxuryMaterial: 'Engineered hardwood continuous (Shaw / Bella Cera)',
    laborPerUnit: 2.50,
    quantity: 400,
    quantityBasis: 'sqft',
  },
  {
    item: 'Baseboards & Trim',
    description: 'Baseboard molding throughout',
    unit: 'per linear ft',
    rentalCost: 0.80,
    rentalMaterial: '3.25" MDF primed baseboard',
    standardCost: 1.50,
    standardMaterial: '5.25" MDF shaker-style baseboard',
    luxuryCost: 3.50,
    luxuryMaterial: '7.25" solid wood baseboard + shoe molding',
    laborPerUnit: 2.00,
    quantity: 300,
    quantityBasis: 'fixed',
  },
];

// ─── PAINTING ────────────────────────────────────────────────
const paintingItems: MaterialLineItem[] = [
  {
    item: 'Interior Walls',
    description: 'Full interior paint (walls + ceilings)',
    unit: 'per sqft',
    rentalCost: 0.35,
    rentalMaterial: 'Flat/eggshell basic (Glidden / Valspar)',
    standardCost: 0.55,
    standardMaterial: 'Eggshell premium (Benjamin Moore Regal / Sherwin-Williams Duration)',
    luxuryCost: 0.85,
    luxuryMaterial: 'Matte premium (Farrow & Ball / Benjamin Moore Aura)',
    laborPerUnit: 1.50,
    quantity: 1200,
    quantityBasis: 'sqft',
  },
  {
    item: 'Trim & Doors',
    description: 'Paint all trim, doors, and casings',
    unit: 'per door/window',
    rentalCost: 15,
    rentalMaterial: 'Semi-gloss basic white (Glidden)',
    standardCost: 25,
    standardMaterial: 'Semi-gloss (Benjamin Moore Advance)',
    luxuryCost: 45,
    luxuryMaterial: 'High-gloss lacquer finish (Fine Paints of Europe)',
    laborPerUnit: 60,
    quantity: 20,
    quantityBasis: 'fixed',
  },
  {
    item: 'Exterior Paint',
    description: 'Exterior paint (if needed)',
    unit: 'per sqft',
    rentalCost: 0.40,
    rentalMaterial: 'Flat exterior (Behr / Valspar)',
    standardCost: 0.65,
    standardMaterial: 'Satin exterior (Sherwin-Williams SuperPaint)',
    luxuryCost: 1.00,
    luxuryMaterial: 'Premium satin (Benjamin Moore Aura Exterior)',
    laborPerUnit: 2.00,
    quantity: 1500,
    quantityBasis: 'sqft',
  },
];

// ─── ELECTRICAL ──────────────────────────────────────────────
const electricalItems: MaterialLineItem[] = [
  {
    item: 'Outlets & Switches',
    description: 'Replace outlets, switches, and covers',
    unit: 'each',
    rentalCost: 3,
    rentalMaterial: 'Standard white (Leviton Decora)',
    standardCost: 5,
    standardMaterial: 'Decora rocker + screwless plate (Leviton)',
    luxuryCost: 15,
    luxuryMaterial: 'Adorne collection / smart switches (Legrand / Lutron Caseta)',
    laborPerUnit: 15,
    quantity: 40,
    quantityBasis: 'fixed',
  },
  {
    item: 'Panel Upgrade',
    description: 'Electrical panel upgrade (if needed)',
    unit: 'each',
    rentalCost: 800,
    rentalMaterial: '100-amp panel (Square D)',
    standardCost: 1500,
    standardMaterial: '200-amp panel (Square D Homeline)',
    luxuryCost: 2500,
    luxuryMaterial: '200-amp panel + whole-home surge + smart panel (Span)',
    laborPerUnit: 1500,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Light Fixtures (General)',
    description: 'Replace light fixtures throughout',
    unit: 'each',
    rentalCost: 25,
    rentalMaterial: 'Basic LED flush mount (Hampton Bay)',
    standardCost: 75,
    standardMaterial: 'Semi-flush / pendant (Progress Lighting / Kichler)',
    luxuryCost: 300,
    luxuryMaterial: 'Designer fixtures (Visual Comfort / Schoolhouse / West Elm)',
    laborPerUnit: 75,
    quantity: 10,
    quantityBasis: 'fixed',
  },
];

// ─── PLUMBING ────────────────────────────────────────────────
const plumbingItems: MaterialLineItem[] = [
  {
    item: 'Water Heater',
    description: 'Water heater replacement',
    unit: 'each',
    rentalCost: 500,
    rentalMaterial: '40-gal standard tank (Rheem / AO Smith)',
    standardCost: 900,
    standardMaterial: '50-gal high-efficiency tank (Rheem ProTerra)',
    luxuryCost: 2500,
    luxuryMaterial: 'Tankless on-demand (Rinnai / Navien)',
    laborPerUnit: 600,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Supply Line Repair',
    description: 'Repair/replace supply lines as needed',
    unit: 'per fixture',
    rentalCost: 30,
    rentalMaterial: 'Braided stainless supply lines',
    standardCost: 30,
    standardMaterial: 'Braided stainless supply lines',
    luxuryCost: 50,
    luxuryMaterial: 'PEX repipe to fixtures',
    laborPerUnit: 150,
    quantity: 6,
    quantityBasis: 'fixed',
  },
  {
    item: 'Drain Cleaning / Repair',
    description: 'Drain line cleaning or repair',
    unit: 'each',
    rentalCost: 200,
    rentalMaterial: 'Hydro-jet main line',
    standardCost: 200,
    standardMaterial: 'Hydro-jet main line',
    luxuryCost: 500,
    luxuryMaterial: 'Hydro-jet + camera inspection + spot repair',
    laborPerUnit: 300,
    quantity: 1,
    quantityBasis: 'fixed',
  },
];

// ─── HVAC ────────────────────────────────────────────────────
const hvacItems: MaterialLineItem[] = [
  {
    item: 'Furnace / AC Unit',
    description: 'HVAC system replacement',
    unit: 'each',
    rentalCost: 2500,
    rentalMaterial: '80% AFUE furnace + 14 SEER AC (Goodman)',
    standardCost: 5000,
    standardMaterial: '96% AFUE furnace + 16 SEER AC (Carrier / Trane)',
    luxuryCost: 10000,
    luxuryMaterial: 'Variable-speed heat pump + smart thermostat (Carrier Infinity / Daikin)',
    laborPerUnit: 3000,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Thermostat',
    description: 'Thermostat replacement',
    unit: 'each',
    rentalCost: 25,
    rentalMaterial: 'Basic programmable (Honeywell Home)',
    standardCost: 130,
    standardMaterial: 'Smart thermostat (Google Nest / Ecobee)',
    luxuryCost: 250,
    luxuryMaterial: 'Premium smart (Ecobee Premium / Nest Learning)',
    laborPerUnit: 75,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Ductwork',
    description: 'Duct cleaning, sealing, or partial replacement',
    unit: 'per linear ft',
    rentalCost: 5,
    rentalMaterial: 'Duct sealing + cleaning',
    standardCost: 12,
    standardMaterial: 'Partial duct replacement (flex duct)',
    luxuryCost: 25,
    luxuryMaterial: 'Full rigid duct replacement + insulation',
    laborPerUnit: 10,
    quantity: 100,
    quantityBasis: 'fixed',
  },
];

// ─── EXTERIOR / LANDSCAPING ──────────────────────────────────
const exteriorItems: MaterialLineItem[] = [
  {
    item: 'Front Door',
    description: 'Entry door replacement',
    unit: 'each',
    rentalCost: 200,
    rentalMaterial: 'Steel 6-panel (Masonite / ReliaBilt)',
    standardCost: 600,
    standardMaterial: 'Fiberglass craftsman (Therma-Tru / Masonite)',
    luxuryCost: 2000,
    luxuryMaterial: 'Custom wood or iron + glass (Plastpro / Simpson)',
    laborPerUnit: 350,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Garage Door',
    description: 'Garage door replacement',
    unit: 'each',
    rentalCost: 600,
    rentalMaterial: 'Steel raised panel (Clopay Classic)',
    standardCost: 1200,
    standardMaterial: 'Insulated steel carriage style (Clopay Gallery)',
    luxuryCost: 3500,
    luxuryMaterial: 'Wood-look composite / real wood (Clopay Canyon Ridge / custom)',
    laborPerUnit: 400,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Landscaping',
    description: 'Front yard cleanup, mulch, plants',
    unit: 'per project',
    rentalCost: 500,
    rentalMaterial: 'Basic cleanup, mulch, trim existing',
    standardCost: 2000,
    standardMaterial: 'New mulch beds, drought-tolerant plants, edging',
    luxuryCost: 6000,
    luxuryMaterial: 'Professional landscape design, sod, irrigation, lighting',
    laborPerUnit: 1000,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Exterior Hardware',
    description: 'House numbers, mailbox, porch light',
    unit: 'per set',
    rentalCost: 50,
    rentalMaterial: 'Basic black set (Everbilt)',
    standardCost: 150,
    standardMaterial: 'Modern matte black set (Architectural Mailboxes)',
    luxuryCost: 500,
    luxuryMaterial: 'Designer set (Rejuvenation / Schoolhouse)',
    laborPerUnit: 100,
    quantity: 1,
    quantityBasis: 'fixed',
  },
];

// ─── ROOFING ─────────────────────────────────────────────────
const roofingItems: MaterialLineItem[] = [
  {
    item: 'Roof Replacement',
    description: 'Full roof tear-off and replacement',
    unit: 'per sqft (roof)',
    rentalCost: 2.50,
    rentalMaterial: '3-tab asphalt shingles (Owens Corning Supreme)',
    standardCost: 4.00,
    standardMaterial: 'Architectural shingles (Owens Corning Duration / GAF Timberline)',
    luxuryCost: 8.00,
    luxuryMaterial: 'Premium architectural / tile / metal (Boral / Standing seam)',
    laborPerUnit: 3.50,
    quantity: 1500,
    quantityBasis: 'fixed',
  },
  {
    item: 'Gutters',
    description: 'Gutter replacement',
    unit: 'per linear ft',
    rentalCost: 4,
    rentalMaterial: '5" aluminum K-style',
    standardCost: 7,
    standardMaterial: '6" seamless aluminum',
    luxuryCost: 15,
    luxuryMaterial: '6" copper or half-round aluminum',
    laborPerUnit: 5,
    quantity: 150,
    quantityBasis: 'fixed',
  },
];

// ─── STRUCTURAL ──────────────────────────────────────────────
const structuralItems: MaterialLineItem[] = [
  {
    item: 'Foundation Repair',
    description: 'Minor foundation crack repair / leveling',
    unit: 'per project',
    rentalCost: 1500,
    rentalMaterial: 'Epoxy injection + sealant',
    standardCost: 3500,
    standardMaterial: 'Pier underpinning (2-4 piers)',
    luxuryCost: 8000,
    luxuryMaterial: 'Helical pier system + waterproofing',
    laborPerUnit: 3000,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Framing Repair',
    description: 'Wall framing / load-bearing modifications',
    unit: 'per project',
    rentalCost: 500,
    rentalMaterial: 'Patch framing + sistering',
    standardCost: 2000,
    standardMaterial: 'Wall removal with LVL beam',
    luxuryCost: 5000,
    luxuryMaterial: 'Open-concept conversion with steel beam',
    laborPerUnit: 2500,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Window Replacement',
    description: 'Window replacement',
    unit: 'each',
    rentalCost: 150,
    rentalMaterial: 'Single-pane vinyl (ReliaBilt)',
    standardCost: 350,
    standardMaterial: 'Double-pane vinyl Low-E (Pella / Milgard)',
    luxuryCost: 800,
    luxuryMaterial: 'Fiberglass / wood-clad (Andersen / Marvin)',
    laborPerUnit: 200,
    quantity: 10,
    quantityBasis: 'fixed',
  },
];

// ─── DEMO & CLEANUP ─────────────────────────────────────────
const demoItems: MaterialLineItem[] = [
  {
    item: 'Dumpster Rental',
    description: 'Roll-off dumpster for demo debris',
    unit: 'each',
    rentalCost: 350,
    rentalMaterial: '10-yard dumpster',
    standardCost: 500,
    standardMaterial: '20-yard dumpster',
    luxuryCost: 700,
    luxuryMaterial: '30-yard dumpster',
    laborPerUnit: 0,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Demo Labor',
    description: 'Interior demolition labor',
    unit: 'per sqft',
    rentalCost: 0,
    rentalMaterial: 'Light demo (fixtures, flooring)',
    standardCost: 0,
    standardMaterial: 'Moderate demo (cabinets, tile, drywall)',
    luxuryCost: 0,
    luxuryMaterial: 'Full gut demo',
    laborPerUnit: 2.50,
    quantity: 500,
    quantityBasis: 'sqft',
  },
];

// ─── INSULATION & DRYWALL ────────────────────────────────────
const insulationItems: MaterialLineItem[] = [
  {
    item: 'Drywall',
    description: 'Drywall repair / replacement',
    unit: 'per sqft',
    rentalCost: 0.50,
    rentalMaterial: '1/2" standard drywall (patch only)',
    standardCost: 0.75,
    standardMaterial: '1/2" standard drywall (full rooms)',
    luxuryCost: 1.00,
    luxuryMaterial: '5/8" moisture-resistant + soundproof (QuietRock)',
    laborPerUnit: 2.00,
    quantity: 800,
    quantityBasis: 'sqft',
  },
  {
    item: 'Insulation',
    description: 'Wall / attic insulation',
    unit: 'per sqft',
    rentalCost: 0.50,
    rentalMaterial: 'R-13 fiberglass batt (Owens Corning)',
    standardCost: 1.00,
    standardMaterial: 'R-19 blown-in fiberglass (Owens Corning)',
    luxuryCost: 2.00,
    luxuryMaterial: 'Closed-cell spray foam (Icynene / Lapolla)',
    laborPerUnit: 1.50,
    quantity: 800,
    quantityBasis: 'sqft',
  },
];

// ─── FINAL CLEANUP & STAGING ─────────────────────────────────
const cleanupItems: MaterialLineItem[] = [
  {
    item: 'Deep Clean',
    description: 'Professional post-construction cleaning',
    unit: 'per project',
    rentalCost: 300,
    rentalMaterial: 'Basic clean (DIY or basic crew)',
    standardCost: 600,
    standardMaterial: 'Professional post-construction clean',
    luxuryCost: 1200,
    luxuryMaterial: 'Premium detail clean + window washing',
    laborPerUnit: 0,
    quantity: 1,
    quantityBasis: 'fixed',
  },
  {
    item: 'Staging',
    description: 'Home staging for listing',
    unit: 'per project',
    rentalCost: 0,
    rentalMaterial: 'No staging (vacant)',
    standardCost: 2000,
    standardMaterial: 'Partial staging (living, dining, master)',
    luxuryCost: 5000,
    luxuryMaterial: 'Full professional staging (3-month rental)',
    laborPerUnit: 0,
    quantity: 1,
    quantityBasis: 'fixed',
  },
];

// ─── ASSEMBLE ALL ROOM SCOPES ────────────────────────────────
export function getDefaultRoomScopes(): RoomScope[] {
  return [
    { id: 'demo', name: 'Demolition & Cleanup', icon: '🔨', enabled: true, items: demoItems },
    { id: 'structural', name: 'Structural / Framing', icon: '🏗️', enabled: false, items: structuralItems },
    { id: 'roofing', name: 'Roofing', icon: '🏠', enabled: false, items: roofingItems },
    { id: 'plumbing', name: 'Plumbing', icon: '🔧', enabled: true, items: plumbingItems },
    { id: 'electrical', name: 'Electrical', icon: '⚡', enabled: true, items: electricalItems },
    { id: 'hvac', name: 'HVAC', icon: '❄️', enabled: false, items: hvacItems },
    { id: 'insulation', name: 'Insulation & Drywall', icon: '🧱', enabled: true, items: insulationItems },
    { id: 'flooring', name: 'Flooring', icon: '🪵', enabled: true, items: flooringItems },
    { id: 'kitchen', name: 'Kitchen Remodel', icon: '🍳', enabled: true, items: kitchenItems },
    { id: 'bathrooms', name: 'Bathroom Remodel', icon: '🚿', enabled: true, items: bathroomItems },
    { id: 'painting', name: 'Interior Painting', icon: '🎨', enabled: true, items: paintingItems },
    { id: 'exterior', name: 'Exterior / Landscaping', icon: '🌿', enabled: true, items: exteriorItems },
    { id: 'cleanup', name: 'Final Cleanup & Staging', icon: '✨', enabled: true, items: cleanupItems },
  ];
}

/**
 * Calculate the total cost for a room scope given the material tier and regional factors.
 */
export function calculateRoomCost(
  room: RoomScope,
  tier: MaterialTier,
  sqft: number,
  bathroomCount: number,
  bedroomCount: number,
  materialsFactor: number,
  laborFactor: number,
): { totalMaterials: number; totalLabor: number; totalCost: number; itemBreakdown: Array<{ item: string; material: string; materialCost: number; laborCost: number; qty: number }> } {
  let totalMaterials = 0;
  let totalLabor = 0;
  const itemBreakdown: Array<{ item: string; material: string; materialCost: number; laborCost: number; qty: number }> = [];

  for (const lineItem of room.items) {
    let qty = lineItem.quantity;
    // Adjust quantity based on basis
    if (lineItem.quantityBasis === 'sqft') {
      qty = Math.round(sqft * (lineItem.quantity / 1500)); // normalize to 1500 sqft base
    } else if (lineItem.quantityBasis === 'bathroom_count') {
      qty = bathroomCount;
    } else if (lineItem.quantityBasis === 'bedroom_count') {
      qty = bedroomCount;
    }

    let unitMaterialCost: number;
    let materialName: string;
    switch (tier) {
      case 'rental':
        unitMaterialCost = lineItem.rentalCost;
        materialName = lineItem.rentalMaterial;
        break;
      case 'standard':
        unitMaterialCost = lineItem.standardCost;
        materialName = lineItem.standardMaterial;
        break;
      case 'luxury':
        unitMaterialCost = lineItem.luxuryCost;
        materialName = lineItem.luxuryMaterial;
        break;
    }

    const matCost = Math.round(unitMaterialCost * qty * materialsFactor);
    const labCost = Math.round(lineItem.laborPerUnit * qty * laborFactor);

    totalMaterials += matCost;
    totalLabor += labCost;

    itemBreakdown.push({
      item: lineItem.item,
      material: materialName,
      materialCost: matCost,
      laborCost: labCost,
      qty,
    });
  }

  return { totalMaterials, totalLabor, totalCost: totalMaterials + totalLabor, itemBreakdown };
}
