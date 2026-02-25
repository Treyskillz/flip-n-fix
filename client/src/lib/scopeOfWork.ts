// ============================================================
// Fix & Flip Analyzer — Scope of Work with Material Tiers
// Three tiers: Rental, Standard, Luxury
// Each room has specific materials with Home Depot SKUs & links
// Condition-driven assessment: None / Cosmetic / Moderate / Full Gut
// ============================================================

export type MaterialTier = 'rental' | 'standard' | 'luxury';
export type RoomCondition = 'none' | 'cosmetic' | 'moderate' | 'full';

export interface HomeDepotProduct {
  name: string;
  sku: string;
  url: string;
  price: string;
}

export interface MaterialLineItem {
  item: string;
  description: string;
  unit: string;
  rentalCost: number;
  rentalMaterial: string;
  rentalProduct?: HomeDepotProduct;
  standardCost: number;
  standardMaterial: string;
  standardProduct?: HomeDepotProduct;
  luxuryCost: number;
  luxuryMaterial: string;
  luxuryProduct?: HomeDepotProduct;
  laborPerUnit: number;
  quantity: number;
  quantityBasis: 'sqft' | 'fixed' | 'bathroom_count' | 'bedroom_count';
  // Condition thresholds: which conditions include this item
  // 'cosmetic' = included in cosmetic, moderate, full
  // 'moderate' = included in moderate and full only
  // 'full' = only included in full gut
  conditionLevel: 'cosmetic' | 'moderate' | 'full';
}

export interface RoomScope {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  condition: RoomCondition;
  items: MaterialLineItem[];
  workDescription: string; // FortuneBuilders-style narrative description
}

// Condition multipliers: what % of items to include
export const CONDITION_MULTIPLIERS: Record<RoomCondition, number> = {
  none: 0,
  cosmetic: 0.4,
  moderate: 0.7,
  full: 1.0,
};

function shouldIncludeItem(itemLevel: 'cosmetic' | 'moderate' | 'full', roomCondition: RoomCondition): boolean {
  if (roomCondition === 'none') return false;
  if (roomCondition === 'full') return true;
  if (roomCondition === 'moderate') return itemLevel === 'cosmetic' || itemLevel === 'moderate';
  if (roomCondition === 'cosmetic') return itemLevel === 'cosmetic';
  return false;
}

// ─── KITCHEN ─────────────────────────────────────────────────
const kitchenItems: MaterialLineItem[] = [
  {
    item: 'Cabinets',
    description: 'Full kitchen cabinet set (base + wall)',
    unit: 'per linear ft',
    rentalCost: 75,
    rentalMaterial: 'Hampton Bay Shaker Assembled Base Cabinet, Satin White',
    rentalProduct: { name: 'Hampton Bay Shaker Base Cabinet', sku: '280041', url: 'https://www.homedepot.com/p/Hampton-Bay-Shaker-Assembled-36x34-5x24-in-Sink-Base-Kitchen-Cabinet-in-Satin-White-KSB36-SSW/280041', price: '$247.00' },
    standardCost: 180,
    standardMaterial: 'Hampton Bay Avondale Shaker Alpine White Plywood',
    standardProduct: { name: 'Hampton Bay Avondale Shaker', sku: 'B12', url: 'https://www.homedepot.com/s/hampton%20bay%20avondale%20shaker', price: '$199.95' },
    luxuryCost: 450,
    luxuryMaterial: 'KraftMaid Custom Inset Shaker Cabinets',
    luxuryProduct: { name: 'KraftMaid Custom Kitchen', sku: 'Custom', url: 'https://www.homedepot.com/b/Kitchen-Kitchen-Cabinets/KraftMaid/N-5yc1vZas87Zc1q', price: '$1,000+' },
    laborPerUnit: 65,
    quantity: 25,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
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
    luxuryMaterial: 'Quartzite / Marble (Daltile Natural Stone)',
    luxuryProduct: { name: 'Daltile Natural Stone Mongolian Spring', sku: '202646841', url: 'https://www.homedepot.com/p/Daltile-Natural-Stone-Collection-Mongolian-Spring-12-in-x-24-in-Slate-Flagstone-Floor-and-Wall-Tile-13-5-sq-ft-case-S781PATTNFLAG1P/202646841', price: '$126.59/case' },
    laborPerUnit: 25,
    quantity: 40,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Backsplash',
    description: 'Kitchen backsplash tile',
    unit: 'per sqft',
    rentalCost: 3,
    rentalMaterial: 'Peel-and-stick vinyl tile',
    rentalProduct: { name: 'Art3d Grey Marble Peel and Stick Backsplash', sku: '306251378', url: 'https://www.homedepot.com/p/Art3d-12-in-x-12-in-Grey-Marble-Vinyl-Peel-and-Stick-Wall-Tile-Backsplash-for-Kitchen-10-Pack-A17042P10/306251378', price: '$25.51/case' },
    standardCost: 8,
    standardMaterial: 'Daltile Restore Bright White Ceramic Subway 3x6',
    standardProduct: { name: 'Daltile Restore Bright White Subway Tile', sku: '1002671564', url: 'https://www.homedepot.com/p/Daltile-Restore-Bright-White-3-in-x-6-in-Glossy-Ceramic-Subway-Wall-Tile-12-5-sq-ft-case-RE1536MODHD1P4/302575146', price: '$14.98/case' },
    luxuryCost: 25,
    luxuryMaterial: 'MSI Marbella Lynx Polished Marble Mosaic',
    luxuryProduct: { name: 'MSI Marbella Lynx Marble Mosaic', sku: '304954264', url: 'https://www.homedepot.com/p/MSI-Marbella-Lynx-12-in-x-12-in-Polished-Marble-Mesh-Mounted-Mosaic-Floor-and-Wall-Tile-10-sq-ft-Case-MARBLYNX-POL10M/304954264', price: '$115.70/case' },
    laborPerUnit: 10,
    quantity: 30,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
  {
    item: 'Sink & Faucet',
    description: 'Kitchen sink with faucet',
    unit: 'each',
    rentalCost: 150,
    rentalMaterial: 'Glacier Bay Stainless Drop-In + McKenna Faucet',
    rentalProduct: { name: 'Glacier Bay McKenna Pull Down Faucet', sku: '1007991862', url: 'https://www.homedepot.com/p/Glacier-Bay-McKenna-Single-Handle-Pull-Down-Sprayer-Kitchen-Faucet-in-Stainless-Steel-with-TurboSpray-and-FastMount-HD67726W-1208D2/321132042', price: '$99.00' },
    standardCost: 400,
    standardMaterial: 'Kraus Standart PRO Undermount + Moen Align Faucet',
    standardProduct: { name: 'Kraus Standart PRO 32" Undermount Sink', sku: '203058417', url: 'https://www.homedepot.com/p/KRAUS-Standart-PRO-32-in-Undermount-Single-Bowl-16-Gauge-Stainless-Steel-Kitchen-Sink-with-Accessories-KHU100-32/203058417', price: '$319.95' },
    luxuryCost: 1200,
    luxuryMaterial: 'Kohler Whitehaven Farmhouse + Delta Trinsic Touch',
    luxuryProduct: { name: 'Kohler Whitehaven 36" Farmhouse Sink', sku: '202872452', url: 'https://www.homedepot.com/p/KOHLER-Whitehaven-36-in-Farmhouse-Apron-Front-Single-Bowl-No-Gauge-Applicable-White-Cast-Iron-Kitchen-Sink-Only-K-6489-0/202872452', price: '$1,266.86' },
    laborPerUnit: 250,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Appliance Package',
    description: 'Range, refrigerator, dishwasher, microwave',
    unit: 'each',
    rentalCost: 2000,
    rentalMaterial: 'White / Black basic (Frigidaire / Amana)',
    standardCost: 4500,
    standardMaterial: 'Samsung Stainless Steel 4-Piece Package',
    standardProduct: { name: 'Samsung Stainless Steel Package', sku: 'N1995173127', url: 'https://www.homedepot.com/p/sets/appliances/package/Stainless-Steel-Package-with-4-Door-Food-Showcase-Refrigerator/package_N1995173127', price: '$1,577.00' },
    luxuryCost: 12000,
    luxuryMaterial: 'KitchenAid Premium 4-Piece Package',
    luxuryProduct: { name: 'KitchenAid 30 cu ft Package', sku: '341564262', url: 'https://www.homedepot.com/p/sets/KitchenAid-30-cu-ft-Standard-Depth-Refrigerator-with-5-Element-Slide-In-Gas-Range-and-Dishwasher-with-3rd-Rack/341564262', price: '$5,285.00' },
    laborPerUnit: 400,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Lighting',
    description: 'Recessed cans + pendant/under-cabinet',
    unit: 'per room',
    rentalCost: 150,
    rentalMaterial: 'Hampton Bay LED Flush Mount',
    rentalProduct: { name: 'Hampton Bay LED Flush Mount', sku: '1000640737', url: 'https://www.homedepot.com/p/Hampton-Bay-10-5-in-1-Light-Black-Weather-Resistant-Integrated-LED-Outdoor-Ceiling-Light-Flush-Mount-with-Frosted-Glass-Shade-HB7072LED-05/205299597', price: '$49.97' },
    standardCost: 500,
    standardMaterial: 'Progress Lighting Semi-Flush + Recessed',
    standardProduct: { name: 'Progress Lighting Alexa Semi-Flush', sku: '206578177', url: 'https://www.homedepot.com/p/Progress-Lighting-Alexa-Collection-2-Light-Antique-Bronze-Semi-Flush-Mount-P2851-20/206578177', price: '$112.30' },
    luxuryCost: 1500,
    luxuryMaterial: 'Home Decorators Weyburn Chandelier + Recessed',
    luxuryProduct: { name: 'Home Decorators Weyburn 5-Light Chandelier', sku: '1003821834', url: 'https://www.homedepot.com/p/Home-Decorators-Collection-Weyburn-36-in-5-Light-Bronze-Farmhouse-Linear-Chandelier-Light-Fixture-with-Caged-Metal-Shade-5-76201/308058160', price: '$279.00' },
    laborPerUnit: 350,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
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
    conditionLevel: 'cosmetic',
  },
];

// ─── MASTER BATHROOM ────────────────────────────────────────
const masterBathroomItems: MaterialLineItem[] = [
  {
    item: 'Vanity + Top',
    description: 'Master bathroom vanity with countertop and sink',
    unit: 'each',
    rentalCost: 200,
    rentalMaterial: 'Glacier Bay Huckleberry 30" White Vanity',
    rentalProduct: { name: 'Glacier Bay Huckleberry 30" Vanity', sku: '332067766', url: 'https://www.homedepot.com/p/Glacier-Bay-Huckleberry-30-in-Single-Sink-White-Bath-Vanity-with-White-Engineered-Marble-Top-Assembled-Huckleberry-30W/332067766', price: '$379.00' },
    standardCost: 600,
    standardMaterial: 'Home Decorators Sonoma 36" White Vanity',
    standardProduct: { name: 'Home Decorators Sonoma 36" Vanity', sku: '205866619', url: 'https://www.homedepot.com/p/Home-Decorators-Collection-Sonoma-36-in-Single-Sink-Freestanding-White-Bath-Vanity-with-Carrara-Marble-Top-Assembled-Sonoma-36W/205866619', price: '$809.00' },
    luxuryCost: 2000,
    luxuryMaterial: '48"+ floating vanity + marble top (custom)',
    laborPerUnit: 300,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Toilet',
    description: 'Toilet replacement',
    unit: 'each',
    rentalCost: 120,
    rentalMaterial: 'Glacier Bay Round Front 1.28 GPF',
    rentalProduct: { name: 'Glacier Bay Round Front Toilet', sku: '202634188', url: 'https://www.homedepot.com/p/Glacier-Bay-12-in-Rough-In-Two-Piece-1-28-GPF-Single-Flush-Round-Toilet-in-White-Seat-Included-N2428RB-N2428T/202634188', price: '$99.00' },
    standardCost: 250,
    standardMaterial: 'Kohler Cimarron Elongated Comfort Height',
    standardProduct: { name: 'Kohler Cimarron Elongated Toilet', sku: '313789704', url: 'https://www.homedepot.com/p/KOHLER-Cimarron-12-in-Rough-In-2-Piece-1-28-GFP-Single-Flush-Elongated-Toilet-in-White-with-Soft-Close-Seat-K-31648-0/313789704', price: '$259.00' },
    luxuryCost: 800,
    luxuryMaterial: 'TOTO UltraMax II One-Piece Elongated',
    luxuryProduct: { name: 'TOTO UltraMax II One-Piece', sku: '315742492', url: 'https://www.homedepot.com/p/TOTO-UltraMax-II-12-in-Rough-In-One-Piece-1-28-GPF-Single-Flush-Elongated-Toilet-in-Cotton-White-SoftClose-Seat-Included-MS604124CEFG-01/315742492', price: '$656.42' },
    laborPerUnit: 200,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Tub / Shower',
    description: 'Tub or shower surround/tile',
    unit: 'each',
    rentalCost: 350,
    rentalMaterial: 'Delta Classic 500 Tub/Shower Surround',
    rentalProduct: { name: 'Delta Classic 500 Tub/Shower Surround', sku: '1008011265', url: 'https://www.homedepot.com/p/Delta-Classic-500-60-in-W-x-61-25-in-H-x-32-in-D-3-Piece-Direct-to-Stud-Alcove-Bathtub-Shower-Surrounds-in-High-Gloss-White-B23205-6032-WH/321014279', price: '$379.00' },
    standardCost: 1200,
    standardMaterial: 'Kohler Bellwether Tub + Daltile Subway Tile Surround',
    standardProduct: { name: 'Kohler Bellwether 60" Soaking Tub', sku: '203309982', url: 'https://www.homedepot.com/p/KOHLER-Bellwether-60-in-x-30-in-Soaking-Bathtub-with-Left-Hand-Drain-in-White-K-837-0/203309982', price: '$889.38' },
    luxuryCost: 4000,
    luxuryMaterial: 'DreamLine Unidoor Frameless Glass + Porcelain Tile',
    luxuryProduct: { name: 'DreamLine Unidoor Frameless Shower Door', sku: '1000487138', url: 'https://www.homedepot.com/p/DreamLine-Unidoor-30-in-x-72-in-Frameless-Hinged-Shower-Door-in-Brushed-Nickel-SHDR-20307210F-04/204331751', price: '$619.99' },
    laborPerUnit: 800,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'full',
  },
  {
    item: 'Faucets & Fixtures',
    description: 'Faucet, showerhead, towel bars, TP holder',
    unit: 'each',
    rentalCost: 80,
    rentalMaterial: 'Glacier Bay Builders Chrome Faucet Set',
    rentalProduct: { name: 'Glacier Bay Builders 4" Centerset Faucet', sku: '505838', url: 'https://www.homedepot.com/p/Glacier-Bay-Builders-4-in-Centerset-Double-Handle-Low-Arc-Bathroom-Faucet-in-Chrome-HD67091W-6B01/309237986', price: '$34.98' },
    standardCost: 250,
    standardMaterial: 'Moen Align Matte Black Bathroom Faucet',
    standardProduct: { name: 'Moen Align Single Hole Matte Black', sku: '301882637', url: 'https://www.homedepot.com/p/MOEN-Align-Single-Hole-Single-Handle-Bathroom-Faucet-in-Matte-Black-6190BL/301882637', price: '$314.92' },
    luxuryCost: 800,
    luxuryMaterial: 'Kohler Purist Widespread Brushed Bronze',
    luxuryProduct: { name: 'Kohler Purist 8" Widespread Faucet', sku: '100421033', url: 'https://www.homedepot.com/p/KOHLER-Purist-8-in-Widespread-2-Handle-Low-Arc-Water-Saving-Bathroom-Faucet-in-Vibrant-Brushed-Bronze-with-Low-Gooseneck-Spout-K-14406-4-BV/100421033', price: '$880.87' },
    laborPerUnit: 200,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
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
    luxuryMaterial: 'Marble mosaic / large-format porcelain',
    laborPerUnit: 8,
    quantity: 60,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Mirror + Medicine Cabinet',
    description: 'Vanity mirror or medicine cabinet',
    unit: 'each',
    rentalCost: 40,
    rentalMaterial: 'Basic frameless mirror (Glacier Bay)',
    standardCost: 150,
    standardMaterial: 'Framed mirror or recessed medicine cabinet',
    luxuryCost: 500,
    luxuryMaterial: 'Backlit LED mirror or custom framed',
    laborPerUnit: 50,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
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
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
];

// ─── FULL BATHROOM ──────────────────────────────────────────
const fullBathroomItems: MaterialLineItem[] = [
  {
    item: 'Vanity + Top',
    description: 'Full bathroom vanity with countertop and sink',
    unit: 'each',
    rentalCost: 200,
    rentalMaterial: 'Glacier Bay Huckleberry 30" White Vanity',
    rentalProduct: { name: 'Glacier Bay Huckleberry 30" Vanity', sku: '332067766', url: 'https://www.homedepot.com/p/Glacier-Bay-Huckleberry-30-in-Single-Sink-White-Bath-Vanity-with-White-Engineered-Marble-Top-Assembled-Huckleberry-30W/332067766', price: '$379.00' },
    standardCost: 600,
    standardMaterial: 'Home Decorators Sonoma 36" White Vanity',
    standardProduct: { name: 'Home Decorators Sonoma 36" Vanity', sku: '205866619', url: 'https://www.homedepot.com/p/Home-Decorators-Collection-Sonoma-36-in-Single-Sink-Freestanding-White-Bath-Vanity-with-Carrara-Marble-Top-Assembled-Sonoma-36W/205866619', price: '$809.00' },
    luxuryCost: 1500,
    luxuryMaterial: '36"+ floating vanity + quartz top',
    laborPerUnit: 300,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Toilet',
    description: 'Toilet replacement',
    unit: 'each',
    rentalCost: 120,
    rentalMaterial: 'Glacier Bay Round Front 1.28 GPF',
    rentalProduct: { name: 'Glacier Bay Round Front Toilet', sku: '202634188', url: 'https://www.homedepot.com/p/Glacier-Bay-12-in-Rough-In-Two-Piece-1-28-GPF-Single-Flush-Round-Toilet-in-White-Seat-Included-N2428RB-N2428T/202634188', price: '$99.00' },
    standardCost: 250,
    standardMaterial: 'TOTO Drake Elongated',
    standardProduct: { name: 'TOTO Drake Elongated Toilet', sku: '317577233', url: 'https://www.homedepot.com/p/TOTO-Drake-12-in-Rough-In-Two-Piece-1-6-GPF-Single-Flush-Elongated-Toilet-in-Cotton-White-SoftClose-Seat-Included-MS776124CSFG-01/317577233', price: '$335.00' },
    luxuryCost: 650,
    luxuryMaterial: 'TOTO UltraMax II One-Piece',
    luxuryProduct: { name: 'TOTO UltraMax II', sku: '315742492', url: 'https://www.homedepot.com/p/TOTO-UltraMax-II-12-in-Rough-In-One-Piece-1-28-GPF-Single-Flush-Elongated-Toilet-in-Cotton-White-SoftClose-Seat-Included-MS604124CEFG-01/315742492', price: '$656.42' },
    laborPerUnit: 200,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Tub / Shower',
    description: 'Tub or shower surround',
    unit: 'each',
    rentalCost: 350,
    rentalMaterial: 'Delta Classic 500 Tub/Shower Surround',
    rentalProduct: { name: 'Delta Classic 500', sku: '1008011265', url: 'https://www.homedepot.com/p/Delta-Classic-500-60-in-W-x-61-25-in-H-x-32-in-D-3-Piece-Direct-to-Stud-Alcove-Bathtub-Shower-Surrounds-in-High-Gloss-White-B23205-6032-WH/321014279', price: '$379.00' },
    standardCost: 1200,
    standardMaterial: 'Kohler Bellwether + Tile Surround',
    luxuryCost: 3000,
    luxuryMaterial: 'Frameless glass shower + porcelain tile',
    laborPerUnit: 800,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'full',
  },
  {
    item: 'Faucets & Fixtures',
    description: 'Faucet, showerhead, towel bars',
    unit: 'each',
    rentalCost: 80,
    rentalMaterial: 'Glacier Bay Chrome Faucet Set',
    rentalProduct: { name: 'Glacier Bay Builders Faucet', sku: '505838', url: 'https://www.homedepot.com/p/Glacier-Bay-Builders-4-in-Centerset-Double-Handle-Low-Arc-Bathroom-Faucet-in-Chrome-HD67091W-6B01/309237986', price: '$34.98' },
    standardCost: 250,
    standardMaterial: 'Delta Trinsic Matte Black Faucet',
    standardProduct: { name: 'Delta Trinsic Bathroom Faucet', sku: '320324032', url: 'https://www.homedepot.com/p/Delta-Trinsic-Single-Hole-Single-Handle-Bathroom-Faucet-with-Metal-Pop-Up-Assembly-in-Matte-Black-558-BLMPU-DST/320324032', price: '$389.00' },
    luxuryCost: 600,
    luxuryMaterial: 'Kohler Purist Widespread Faucet',
    laborPerUnit: 200,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
  {
    item: 'Floor Tile',
    description: 'Bathroom floor tile',
    unit: 'per sqft',
    rentalCost: 2,
    rentalMaterial: 'Vinyl peel-and-stick tile',
    standardCost: 6,
    standardMaterial: 'Porcelain tile 12x24',
    luxuryCost: 15,
    luxuryMaterial: 'Large-format porcelain',
    laborPerUnit: 8,
    quantity: 40,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Mirror & Lighting',
    description: 'Mirror + vanity light fixture',
    unit: 'each',
    rentalCost: 60,
    rentalMaterial: 'Frameless mirror + 2-light bar',
    standardCost: 200,
    standardMaterial: 'Framed mirror + 3-light sconce',
    luxuryCost: 600,
    luxuryMaterial: 'LED backlit mirror + designer sconces',
    laborPerUnit: 100,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
];

// ─── HALF BATH ──────────────────────────────────────────────
const halfBathItems: MaterialLineItem[] = [
  {
    item: 'Vanity + Top',
    description: 'Small vanity with countertop and sink',
    unit: 'each',
    rentalCost: 150,
    rentalMaterial: 'Glacier Bay 24" White Vanity',
    standardCost: 400,
    standardMaterial: 'Home Decorators 30" Shaker Vanity',
    luxuryCost: 1200,
    luxuryMaterial: 'Floating vanity + vessel sink',
    laborPerUnit: 250,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Toilet',
    description: 'Toilet replacement',
    unit: 'each',
    rentalCost: 99,
    rentalMaterial: 'Glacier Bay Round Front',
    rentalProduct: { name: 'Glacier Bay Round Front Toilet', sku: '202634188', url: 'https://www.homedepot.com/p/Glacier-Bay-12-in-Rough-In-Two-Piece-1-28-GPF-Single-Flush-Round-Toilet-in-White-Seat-Included-N2428RB-N2428T/202634188', price: '$99.00' },
    standardCost: 250,
    standardMaterial: 'Kohler Cimarron Elongated',
    standardProduct: { name: 'Kohler Cimarron', sku: '313789704', url: 'https://www.homedepot.com/p/KOHLER-Cimarron-12-in-Rough-In-2-Piece-1-28-GFP-Single-Flush-Elongated-Toilet-in-White-with-Soft-Close-Seat-K-31648-0/313789704', price: '$259.00' },
    luxuryCost: 650,
    luxuryMaterial: 'TOTO UltraMax II',
    laborPerUnit: 200,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Faucet & Fixtures',
    description: 'Faucet, mirror, light, towel bar',
    unit: 'each',
    rentalCost: 100,
    rentalMaterial: 'Chrome basic set + frameless mirror',
    standardCost: 300,
    standardMaterial: 'Matte black faucet + framed mirror + sconce',
    luxuryCost: 800,
    luxuryMaterial: 'Designer faucet + LED mirror + sconces',
    laborPerUnit: 150,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
  {
    item: 'Floor Tile',
    description: 'Half bath floor tile',
    unit: 'per sqft',
    rentalCost: 2,
    rentalMaterial: 'Vinyl peel-and-stick',
    standardCost: 6,
    standardMaterial: 'Porcelain tile',
    luxuryCost: 18,
    luxuryMaterial: 'Marble or premium porcelain',
    laborPerUnit: 8,
    quantity: 25,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
];

// ─── LIVING ROOM ────────────────────────────────────────────
const livingRoomItems: MaterialLineItem[] = [
  {
    item: 'Flooring',
    description: 'Living room flooring',
    unit: 'per sqft',
    rentalCost: 1.50,
    rentalMaterial: 'TrafficMaster Vinyl Plank',
    rentalProduct: { name: 'TrafficMaster Hickman Coast LVP', sku: '1009837121', url: 'https://www.homedepot.com/p/TrafficMaster-Hickman-Coast-6-MIL-x-6-in-x-36-in-Waterproof-Click-Lock-Vinyl-Plank-Flooring-23-95-sq-ft-Case-VTRHDHICCOA6X36/326037084', price: '$1.69/sq ft' },
    standardCost: 3.50,
    standardMaterial: 'LifeProof Sterling Oak LVP',
    standardProduct: { name: 'LifeProof Sterling Oak LVP', sku: '1006712135', url: 'https://www.homedepot.com/p/Lifeproof-Sterling-Oak-22-MIL-x-8-7-in-W-x-48-in-L-Click-Lock-Waterproof-Luxury-Vinyl-Plank-Flooring-20-1-sqft-case-I966106LP/309083456', price: '$2.98/sq ft' },
    luxuryCost: 9.00,
    luxuryMaterial: 'Shaw Richmond Engineered Hardwood',
    luxuryProduct: { name: 'Shaw Richmond White Oak Hardwood', sku: '317862508', url: 'https://www.homedepot.com/p/Shaw-Richmond-Winchester-White-Oak-9-16-in-T-X-7-5-in-W-Tongue-and-Groove-Engineered-Hardwood-Flooring-31-09-sq-ft-case-DH85400533/317862508', price: '$6.19/sq ft' },
    laborPerUnit: 3.00,
    quantity: 300,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Baseboards & Trim',
    description: 'Baseboard molding',
    unit: 'per linear ft',
    rentalCost: 0.80,
    rentalMaterial: '3.25" MDF Primed Baseboard',
    rentalProduct: { name: 'Woodgrain 3.25" MDF Baseboard', sku: '203209370', url: 'https://www.homedepot.com/p/Woodgrain-Millwork-623-1-2-in-x-3-1-4-in-x-96-in-Primed-MDF-Baseboard-Moulding-1-Piece-8-Total-Linear-Feet-10001007/203209370', price: '$0.81/ln ft' },
    standardCost: 1.50,
    standardMaterial: '5.25" Colonial MDF Baseboard',
    standardProduct: { name: 'House of Fara 5.25" MDF Baseboard', sku: '205426942', url: 'https://www.homedepot.com/p/HOUSE-OF-FARA-8829-1-2-in-x-5-1-4-in-x-96-in-Colonial-Primed-MDF-Baseboard-Moulding-1-Piece-8-Total-Linear-Feet-8829/205426942', price: '$2.83/ln ft' },
    luxuryCost: 3.50,
    luxuryMaterial: '7.25" Pine Wood Baseboard',
    luxuryProduct: { name: 'Alexandria 7.25" Pine Baseboard', sku: '331519621', url: 'https://www.homedepot.com/p/Alexandria-Moulding-Pro-Pack-9-16-in-x-7-1-4-in-x-96-in-Pine-Wood-Finger-Joint-Baseboard-Moulding-4-Pack-32-Total-Linear-Feet-P163B-93096PK/331519621', price: '$3.87/ln ft' },
    laborPerUnit: 2.00,
    quantity: 80,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Paint',
    description: 'Interior paint for living room',
    unit: 'per sqft (wall area)',
    rentalCost: 0.35,
    rentalMaterial: 'Glidden Premium Satin Interior',
    rentalProduct: { name: 'Glidden Premium 1 gal Satin Interior', sku: '643180', url: 'https://www.homedepot.com/p/Glidden-Premium-1-gal-Pure-White-Base-1-Satin-Interior-Paint-GLN6211N-01/206755798', price: '$29.98/gal' },
    standardCost: 0.55,
    standardMaterial: 'Behr Ultra Satin Enamel Interior',
    standardProduct: { name: 'Behr Ultra 1 gal Satin Interior', sku: '436165', url: 'https://www.homedepot.com/p/BEHR-ULTRA-1-gal-Ultra-Pure-White-Extra-Durable-Satin-Enamel-Interior-Paint-Primer-775001/203202361', price: '$45.98/gal' },
    luxuryCost: 0.85,
    luxuryMaterial: 'Behr Dynasty Satin Interior',
    luxuryProduct: { name: 'Behr Dynasty 1 gal Satin Interior', sku: '1007602739', url: 'https://www.homedepot.com/p/BEHR-DYNASTY-1-gal-Ultra-Pure-White-Satin-Enamel-Interior-Stain-Blocking-Paint-and-Primer-765001/315702311', price: '$67.98/gal' },
    laborPerUnit: 1.50,
    quantity: 500,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
  {
    item: 'Light Fixtures',
    description: 'Living room light fixtures',
    unit: 'each',
    rentalCost: 25,
    rentalMaterial: 'Hampton Bay LED Flush Mount',
    standardCost: 75,
    standardMaterial: 'Progress Lighting Semi-Flush',
    luxuryCost: 300,
    luxuryMaterial: 'Designer chandelier / pendant',
    laborPerUnit: 75,
    quantity: 2,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
];

// ─── BEDROOM ────────────────────────────────────────────────
const bedroomItems: MaterialLineItem[] = [
  {
    item: 'Flooring',
    description: 'Bedroom flooring',
    unit: 'per sqft',
    rentalCost: 1.00,
    rentalMaterial: 'Builder-grade carpet (Shaw / Mohawk)',
    standardCost: 3.50,
    standardMaterial: 'LifeProof LVP continuous from main areas',
    luxuryCost: 9.00,
    luxuryMaterial: 'Engineered hardwood continuous',
    laborPerUnit: 2.50,
    quantity: 150,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Paint',
    description: 'Bedroom walls and ceiling paint',
    unit: 'per sqft (wall area)',
    rentalCost: 0.35,
    rentalMaterial: 'Glidden Premium Satin',
    standardCost: 0.55,
    standardMaterial: 'Behr Ultra Satin',
    luxuryCost: 0.85,
    luxuryMaterial: 'Behr Dynasty Satin',
    laborPerUnit: 1.50,
    quantity: 350,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
  {
    item: 'Baseboards',
    description: 'Baseboard molding',
    unit: 'per linear ft',
    rentalCost: 0.80,
    rentalMaterial: '3.25" MDF baseboard',
    standardCost: 1.50,
    standardMaterial: '5.25" MDF shaker baseboard',
    luxuryCost: 3.50,
    luxuryMaterial: '7.25" solid wood baseboard',
    laborPerUnit: 2.00,
    quantity: 50,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Closet System',
    description: 'Closet shelving / organizer',
    unit: 'each',
    rentalCost: 30,
    rentalMaterial: 'Wire shelf kit (ClosetMaid)',
    standardCost: 150,
    standardMaterial: 'Laminate closet organizer (ClosetMaid Impressions)',
    luxuryCost: 500,
    luxuryMaterial: 'Custom wood closet system',
    laborPerUnit: 75,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
  {
    item: 'Light Fixture',
    description: 'Ceiling light fixture',
    unit: 'each',
    rentalCost: 20,
    rentalMaterial: 'Basic LED flush mount',
    standardCost: 60,
    standardMaterial: 'Semi-flush mount',
    luxuryCost: 200,
    luxuryMaterial: 'Designer pendant / chandelier',
    laborPerUnit: 75,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
];

// ─── LANDSCAPING ────────────────────────────────────────────
const landscapingItems: MaterialLineItem[] = [
  {
    item: 'Front Yard Cleanup',
    description: 'Cleanup, mulch, trim existing plants',
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
    conditionLevel: 'cosmetic',
  },
  {
    item: 'Front Door',
    description: 'Entry door replacement',
    unit: 'each',
    rentalCost: 200,
    rentalMaterial: 'Masonite Steel 6-Panel Entry Door',
    rentalProduct: { name: 'Masonite 36" Steel 6-Panel Door', sku: '826296', url: 'https://www.homedepot.com/p/Masonite-36-in-x-80-in-Premium-6-Panel-Right-Hand-Inswing-Primed-Steel-Prehung-Front-Exterior-Door-with-Brickmold-27105/100053184', price: '$274.00' },
    standardCost: 600,
    standardMaterial: 'Masonite Fiberglass 6-Panel Door',
    standardProduct: { name: 'Masonite 36" Fiberglass Door', sku: '741836', url: 'https://www.homedepot.com/p/Masonite-36-in-x-80-in-6-Panel-Left-Hand-Inswing-Primed-White-Smooth-Fiberglass-Prehung-Front-Exterior-Door-84796/202336732', price: '$368.00' },
    luxuryCost: 2000,
    luxuryMaterial: 'Masonite Premium 9-Lite Glass Door',
    luxuryProduct: { name: 'Masonite 36" Premium 9-Lite Door', sku: '826349', url: 'https://www.homedepot.com/p/Masonite-36-in-x-80-in-Premium-9-Lite-Primed-White-Left-Hand-Inswing-Steel-Prehung-Front-Exterior-Door-with-Brickmold-28379/100062666', price: '$339.00' },
    laborPerUnit: 350,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Exterior Hardware',
    description: 'House numbers, mailbox, porch light',
    unit: 'per set',
    rentalCost: 50,
    rentalMaterial: 'Basic black set (Everbilt)',
    standardCost: 150,
    standardMaterial: 'Modern matte black set',
    luxuryCost: 500,
    luxuryMaterial: 'Designer set (Rejuvenation / Schoolhouse)',
    laborPerUnit: 100,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
  {
    item: 'Exterior Paint',
    description: 'Exterior paint (if needed)',
    unit: 'per sqft',
    rentalCost: 0.40,
    rentalMaterial: 'Behr Premium Plus Flat Exterior',
    rentalProduct: { name: 'Behr Premium Plus Flat Exterior', sku: '154121', url: 'https://www.homedepot.com/p/BEHR-PREMIUM-PLUS-1-gal-Ultra-Pure-White-Flat-Exterior-Paint-Primer-405001/100164033', price: '$44.98/gal' },
    standardCost: 0.65,
    standardMaterial: 'Behr Ultra Satin Exterior',
    standardProduct: { name: 'Behr Ultra Satin Exterior', sku: '288118', url: 'https://www.homedepot.com/p/BEHR-ULTRA-1-gal-Ultra-Pure-White-Satin-Enamel-Exterior-Paint-Primer-985001/100566042', price: '$57.98/gal' },
    luxuryCost: 1.00,
    luxuryMaterial: 'Behr Dynasty Satin Exterior',
    luxuryProduct: { name: 'Behr Dynasty Satin Exterior', sku: '1009057939', url: 'https://www.homedepot.com/p/BEHR-DYNASTY-1-gal-Ultra-Pure-White-Satin-Exterior-Stain-Blocking-Paint-Primer-965001/319845963', price: '$78.98/gal' },
    laborPerUnit: 2.00,
    quantity: 1500,
    quantityBasis: 'sqft',
    conditionLevel: 'moderate',
  },
];

// ─── ROOF & GUTTER ──────────────────────────────────────────
const roofGutterItems: MaterialLineItem[] = [
  {
    item: 'Roof Replacement',
    description: 'Full roof tear-off and replacement',
    unit: 'per sqft (roof)',
    rentalCost: 2.50,
    rentalMaterial: 'Owens Corning Supreme 3-Tab Shingles',
    rentalProduct: { name: 'Owens Corning Supreme 3-Tab', sku: '1001187947', url: 'https://www.homedepot.com/p/Owens-Corning-Supreme-Estate-Gray-Algae-Resistant-3-Tab-Roofing-Shingles-33-3-sq-ft-Per-Bundle-PM20/205655938', price: '$38.47/bundle' },
    standardCost: 4.00,
    standardMaterial: 'Owens Corning Duration Architectural',
    standardProduct: { name: 'Owens Corning Duration Architectural', sku: '1001189424', url: 'https://www.homedepot.com/p/Owens-Corning-TruDefinition-Duration-Driftwood-Algae-Resistant-Laminate-Architectural-Roofing-Shingles-32-8-sq-ft-Per-Bundle-TD30/205655963', price: '$40.97/bundle' },
    luxuryCost: 8.00,
    luxuryMaterial: 'Premium architectural / tile / metal standing seam',
    laborPerUnit: 3.50,
    quantity: 1500,
    quantityBasis: 'fixed',
    conditionLevel: 'full',
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
    conditionLevel: 'moderate',
  },
];

// ─── GARAGE ─────────────────────────────────────────────────
const garageItems: MaterialLineItem[] = [
  {
    item: 'Garage Door',
    description: 'Garage door replacement',
    unit: 'each',
    rentalCost: 418,
    rentalMaterial: 'Clopay Classic Steel Short Panel',
    rentalProduct: { name: 'Clopay Classic Steel 8x7 Garage Door', sku: '804408', url: 'https://www.homedepot.com/p/Clopay-Classic-Steel-Short-Panel-8-ft-x-7-ft-Non-Insulated-White-Garage-Door-without-Windows-HDB/100045413', price: '$418.00' },
    standardCost: 1200,
    standardMaterial: 'Insulated steel carriage style (Clopay Gallery)',
    luxuryCost: 3500,
    luxuryMaterial: 'Wood-look composite / real wood (Clopay Canyon Ridge)',
    laborPerUnit: 400,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Garage Floor',
    description: 'Garage floor coating / epoxy',
    unit: 'per sqft',
    rentalCost: 0,
    rentalMaterial: 'No coating (clean only)',
    standardCost: 2,
    standardMaterial: 'Epoxy floor coating kit (Rust-Oleum)',
    luxuryCost: 5,
    luxuryMaterial: 'Professional polyurea floor coating',
    laborPerUnit: 2,
    quantity: 400,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
  {
    item: 'Paint',
    description: 'Garage walls paint',
    unit: 'per sqft',
    rentalCost: 0.30,
    rentalMaterial: 'Basic flat white',
    standardCost: 0.40,
    standardMaterial: 'Satin white',
    luxuryCost: 0.55,
    luxuryMaterial: 'Semi-gloss white',
    laborPerUnit: 1.00,
    quantity: 600,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
];

// ─── ELECTRICAL ─────────────────────────────────────────────
const electricalItems: MaterialLineItem[] = [
  {
    item: 'Outlets & Switches',
    description: 'Replace outlets, switches, and covers',
    unit: 'each',
    rentalCost: 3,
    rentalMaterial: 'Leviton Decora White Outlet (10-Pack)',
    rentalProduct: { name: 'Leviton Decora Outlet 10-Pack', sku: '697901', url: 'https://www.homedepot.com/p/Leviton-Decora-15-Amp-125-V-Duplex-Outlet-Receptacle-White-10-Pack-5325-WMP-M24-05325-WMP/100357041', price: '$15.98' },
    standardCost: 5,
    standardMaterial: 'Leviton Decora + Screwless Wall Plate',
    standardProduct: { name: 'Leviton Screwless Wall Plate', sku: '639567', url: 'https://www.homedepot.com/p/Leviton-1-Gang-White-Decora-Rocker-Polycarbonate-Standard-Screwless-Wall-Plate-1-Pack-80301-W-R72-80301-00W/100199643', price: '$4.50' },
    luxuryCost: 15,
    luxuryMaterial: 'Lutron Caseta Smart Dimmer Switch',
    luxuryProduct: { name: 'Lutron Caseta Smart Dimmer Kit', sku: '1000027680', url: 'https://www.homedepot.com/p/Lutron-Caseta-Smart-Dimmer-Switch-and-Remote-Kit-for-Wall-and-Ceiling-Lights-150-Watt-LED-Bulbs-P-PKG1W-WH-R-P-PKG1W-WH-R/206754146', price: '$74.95' },
    laborPerUnit: 15,
    quantity: 40,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
  },
  {
    item: 'Panel Upgrade',
    description: 'Electrical panel upgrade (if needed)',
    unit: 'each',
    rentalCost: 800,
    rentalMaterial: '100-amp panel (Square D)',
    standardCost: 1500,
    standardMaterial: 'Square D Homeline 200-Amp Panel',
    standardProduct: { name: 'Square D Homeline 200A Panel', sku: '1000040008', url: 'https://www.homedepot.com/p/Square-D-Homeline-200-Amp-40-Space-80-Circuit-Panel-w-3-20-Amp-Single-Pole-2-30-Amp-Double-Pole-Breakers-Cover-Value-Pack-HOM4080M200PCVP/204836379', price: '$268.00' },
    luxuryCost: 2500,
    luxuryMaterial: '200-amp panel + whole-home surge + smart panel',
    laborPerUnit: 1500,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'full',
  },
];

// ─── PLUMBING ───────────────────────────────────────────────
const plumbingItems: MaterialLineItem[] = [
  {
    item: 'Water Heater',
    description: 'Water heater replacement',
    unit: 'each',
    rentalCost: 500,
    rentalMaterial: 'Rheem Performance 40-Gal Tank',
    rentalProduct: { name: 'Rheem Performance 40 Gal Gas', sku: '1001300147', url: 'https://www.homedepot.com/p/Rheem-Performance-40-Gal-Tall-36-000-BTU-Natural-Gas-Water-Heater-with-6-Year-Warranty-XG40T06EC36U1/326590302', price: '$579.00' },
    standardCost: 900,
    standardMaterial: 'Rheem ProTerra 50-Gal Hybrid',
    standardProduct: { name: 'Rheem ProTerra 50 Gal Hybrid', sku: '312741462', url: 'https://www.homedepot.com/p/Rheem-ProTerra-50-Gal-10-Year-Hybrid-High-Efficiency-Smart-Tank-Electric-Water-Heater-with-Leak-Detection-Auto-Shutoff-XE50T10HS45U0/312741462', price: '$1,550.00' },
    luxuryCost: 2500,
    luxuryMaterial: 'Rinnai Sensei Tankless Water Heater',
    luxuryProduct: { name: 'Rinnai Sensei 10 GPM Tankless', sku: '329104959', url: 'https://www.homedepot.com/p/Rinnai-Sensei-Super-High-Efficiency-Plus-10-GPM-180-000-BTU-Natural-Gas-Propane-Indoor-Outdoor-Tankless-Water-Heater-RX180iN/329104959', price: '$1,409.94' },
    laborPerUnit: 600,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'full',
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
    conditionLevel: 'moderate',
  },
];

// ─── HVAC ───────────────────────────────────────────────────
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
    luxuryMaterial: 'Variable-speed heat pump + smart thermostat',
    laborPerUnit: 3000,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'full',
  },
  {
    item: 'Thermostat',
    description: 'Thermostat replacement',
    unit: 'each',
    rentalCost: 25,
    rentalMaterial: 'Honeywell Home 5-2 Day Programmable',
    rentalProduct: { name: 'Honeywell Home Programmable Thermostat', sku: '514261', url: 'https://www.homedepot.com/p/Honeywell-Home-5-2-Day-Programmable-Thermostat-with-Digital-Backlit-Display-RTH2300B/203539496', price: '$24.13' },
    standardCost: 130,
    standardMaterial: 'Google Nest Smart Thermostat',
    standardProduct: { name: 'Google Nest Thermostat Snow', sku: '1005742664', url: 'https://www.homedepot.com/p/Google-Nest-Thermostat-Smart-Programmable-Wi-Fi-Thermostat-Snow-GA01334-US/314573006', price: '$129.99' },
    luxuryCost: 250,
    luxuryMaterial: 'Ecobee Smart Thermostat Premium',
    luxuryProduct: { name: 'Ecobee Smart Thermostat Premium', sku: '1007427424', url: 'https://www.homedepot.com/p/ecobee-Smart-Thermostat-Premium-with-Smart-Sensor-and-Air-Quality-Monitor-Wifi-Works-with-Siri-Alexa-Google-Assistant-EB-STATE6-01/319478899', price: '$259.99' },
    laborPerUnit: 75,
    quantity: 1,
    quantityBasis: 'fixed',
    conditionLevel: 'cosmetic',
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
    conditionLevel: 'full',
  },
];

// ─── STRUCTURAL ─────────────────────────────────────────────
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
    conditionLevel: 'full',
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
    conditionLevel: 'full',
  },
  {
    item: 'Window Replacement',
    description: 'Window replacement',
    unit: 'each',
    rentalCost: 150,
    rentalMaterial: 'Ply Gem Classic Vinyl Single Hung',
    rentalProduct: { name: 'Ply Gem Classic Vinyl Window', sku: '923827', url: 'https://www.homedepot.com/p/Ply-Gem-23-5-in-x-35-5-in-Classic-Series-White-Vinyl-Insulated-Single-Hung-Window-with-HPSC-Glass-Screen-Included-CLASSIC-SH/300393939', price: '$154.00' },
    standardCost: 350,
    standardMaterial: 'American Craftsman 70 Series Double Hung Low-E',
    standardProduct: { name: 'American Craftsman 70 Series Window', sku: '541392', url: 'https://www.homedepot.com/p/American-Craftsman-37-75-in-x-56-75-in-70-Series-White-Double-Hung-Low-E-Argon-Glass-Vinyl-Fin-with-J-Window-with-Grids-Screen-Incl-3046730G/203157346', price: '$298.00' },
    luxuryCost: 800,
    luxuryMaterial: 'Andersen 400 Series Clad Wood Double-Hung',
    luxuryProduct: { name: 'Andersen 400 Series Window', sku: '1001758391', url: 'https://www.homedepot.com/p/Andersen-400-Series-37-5-8-in-x-56-7-8-in-Clad-Wood-Double-Hung-Window-w-Low-E-Glass-White-Ext-Int-White-Hardware-9142360/206922015', price: '$715.00' },
    laborPerUnit: 200,
    quantity: 10,
    quantityBasis: 'fixed',
    conditionLevel: 'moderate',
  },
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
    conditionLevel: 'moderate',
  },
  {
    item: 'Insulation',
    description: 'Wall / attic insulation',
    unit: 'per sqft',
    rentalCost: 0.50,
    rentalMaterial: 'R-13 fiberglass batt (Owens Corning)',
    standardCost: 1.00,
    standardMaterial: 'R-19 blown-in fiberglass',
    luxuryCost: 2.00,
    luxuryMaterial: 'Closed-cell spray foam',
    laborPerUnit: 1.50,
    quantity: 800,
    quantityBasis: 'sqft',
    conditionLevel: 'full',
  },
];

// ─── DEMO & CLEANUP ────────────────────────────────────────
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
    conditionLevel: 'moderate',
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
    conditionLevel: 'moderate',
  },
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
    conditionLevel: 'cosmetic',
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
    conditionLevel: 'cosmetic',
  },
];

// ─── ASSEMBLE ALL ROOM SCOPES ──────────────────────────────
export function getDefaultRoomScopes(): RoomScope[] {
  return [
    { id: 'kitchen', name: 'Kitchen', icon: '🍳', enabled: true, condition: 'moderate', items: kitchenItems, workDescription: 'Remove kitchen appliances, flooring, light fixtures, outlets and switches. Demo kitchen as needed. Install new kitchen cabinets and appliances: refrigerator, dishwasher, range and microwave. Install new flooring throughout the entire kitchen. Install new countertop and backsplash. Install new sink with faucet and garbage disposal. Install lighting. Paint according to the color scheme and replace switches and outlets.' },
    { id: 'master_bath', name: 'Master Bathroom', icon: '🛁', enabled: true, condition: 'moderate', items: masterBathroomItems, workDescription: 'Remove existing vanity, toilet, tub/shower, flooring, light fixtures, and mirrors. Install new vanity with countertop and sink. Install new toilet. Refinish or replace tub/shower surround with tile. Install new faucets, showerhead, towel bars, and accessories. Install new floor tile. Install new mirror and vanity lighting. Paint walls and ceiling.' },
    { id: 'full_bath', name: 'Full Bathroom', icon: '🚿', enabled: true, condition: 'moderate', items: fullBathroomItems, workDescription: 'Remove existing vanity, toilet, fixtures, and flooring. Install new vanity with countertop. Install new toilet. Update tub/shower surround as needed. Install new faucets and fixtures. Install new floor tile. Install new mirror and lighting. Paint walls and ceiling.' },
    { id: 'half_bath', name: 'Half Bath', icon: '🚽', enabled: false, condition: 'none', items: halfBathItems, workDescription: 'Remove existing vanity, toilet, and fixtures. Install new small vanity with countertop and sink. Install new toilet. Install new faucet, mirror, and light fixture. Install new floor tile. Paint walls and ceiling.' },
    { id: 'living_room', name: 'Living Room', icon: '🛋️', enabled: true, condition: 'cosmetic', items: livingRoomItems, workDescription: 'Remove existing flooring and baseboards. Install new flooring throughout living area. Install new baseboards and trim. Paint walls and ceiling. Install new light fixtures. Replace outlets and switch covers.' },
    { id: 'bedroom', name: 'Bedrooms', icon: '🛏️', enabled: true, condition: 'cosmetic', items: bedroomItems, workDescription: 'Remove existing flooring and baseboards. Install new flooring or carpet. Install new baseboards. Paint walls and ceiling. Update closet system. Install new light fixtures. Replace outlets and switch covers.' },
    { id: 'landscaping', name: 'Landscaping & Exterior', icon: '🌿', enabled: true, condition: 'cosmetic', items: landscapingItems, workDescription: 'Clean up front and back yard. Trim or remove overgrown plants. Install new mulch, plants, and edging. Replace front door if needed. Update exterior hardware (house numbers, mailbox, porch light). Paint exterior as needed.' },
    { id: 'roof_gutter', name: 'Roof & Gutter', icon: '🏠', enabled: false, condition: 'none', items: roofGutterItems, workDescription: 'Tear off existing roofing materials. Inspect and repair sheathing as needed. Install new underlayment and shingles. Replace or install new gutters and downspouts. Ensure proper flashing at all penetrations.' },
    { id: 'garage', name: 'Garage', icon: '🚗', enabled: false, condition: 'none', items: garageItems, workDescription: 'Replace garage door if needed. Clean and coat garage floor with epoxy. Paint garage walls. Update lighting and electrical as needed.' },
    { id: 'electrical', name: 'Electrical', icon: '⚡', enabled: true, condition: 'cosmetic', items: electricalItems, workDescription: 'Replace all outlets, switches, and cover plates throughout the home. Upgrade electrical panel if needed. Install new light fixtures in all rooms. Ensure all circuits are properly grounded and up to code.' },
    { id: 'plumbing', name: 'Plumbing', icon: '🔧', enabled: false, condition: 'none', items: plumbingItems, workDescription: 'Replace water heater if needed. Repair or replace supply lines to all fixtures. Clean or repair drain lines. Inspect for leaks and repair as needed.' },
    { id: 'hvac', name: 'HVAC', icon: '❄️', enabled: false, condition: 'none', items: hvacItems, workDescription: 'Replace furnace and AC unit if needed. Install new thermostat. Clean, seal, or replace ductwork as needed. Ensure system is properly sized for the home.' },
    { id: 'structural', name: 'Structural / Windows', icon: '🏗️', enabled: false, condition: 'none', items: structuralItems, workDescription: 'Repair foundation cracks or leveling issues. Repair or modify framing as needed. Replace windows throughout the home. Repair or replace drywall. Add or upgrade insulation.' },
    { id: 'demo_cleanup', name: 'Demo & Staging', icon: '🔨', enabled: true, condition: 'moderate', items: demoItems, workDescription: 'Rent dumpster for demolition debris. Perform interior demolition as needed. Professional post-construction deep cleaning. Stage home for listing photos and showings.' },
  ];
}

/**
 * Calculate the total cost for a room scope given the material tier, condition, and regional factors.
 */
export function calculateRoomCost(
  room: RoomScope,
  tier: MaterialTier,
  sqft: number,
  bathroomCount: number,
  bedroomCount: number,
  materialsFactor: number,
  laborFactor: number,
): { totalMaterials: number; totalLabor: number; totalCost: number; itemBreakdown: Array<{ item: string; material: string; materialCost: number; laborCost: number; qty: number; product?: HomeDepotProduct }> } {
  if (room.condition === 'none' || !room.enabled) {
    return { totalMaterials: 0, totalLabor: 0, totalCost: 0, itemBreakdown: [] };
  }

  let totalMaterials = 0;
  let totalLabor = 0;
  const itemBreakdown: Array<{ item: string; material: string; materialCost: number; laborCost: number; qty: number; product?: HomeDepotProduct }> = [];

  for (const lineItem of room.items) {
    // Check if this item should be included based on room condition
    if (!shouldIncludeItem(lineItem.conditionLevel, room.condition)) continue;

    let qty = lineItem.quantity;
    if (lineItem.quantityBasis === 'sqft') {
      qty = Math.round(sqft * (lineItem.quantity / 1500));
    } else if (lineItem.quantityBasis === 'bathroom_count') {
      qty = bathroomCount;
    } else if (lineItem.quantityBasis === 'bedroom_count') {
      qty = bedroomCount;
    }

    let unitMaterialCost: number;
    let materialName: string;
    let product: HomeDepotProduct | undefined;
    switch (tier) {
      case 'rental':
        unitMaterialCost = lineItem.rentalCost;
        materialName = lineItem.rentalMaterial;
        product = lineItem.rentalProduct;
        break;
      case 'standard':
        unitMaterialCost = lineItem.standardCost;
        materialName = lineItem.standardMaterial;
        product = lineItem.standardProduct;
        break;
      case 'luxury':
        unitMaterialCost = lineItem.luxuryCost;
        materialName = lineItem.luxuryMaterial;
        product = lineItem.luxuryProduct;
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
      product,
    });
  }

  return { totalMaterials, totalLabor, totalCost: totalMaterials + totalLabor, itemBreakdown };
}
