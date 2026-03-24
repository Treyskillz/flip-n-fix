// ============================================================
// Property-Based SOW Template Library
// 10 Properties × 9 Rooms = 90 Room Templates
// Fortune Builders–style property cards with room navigation
// ============================================================

export interface SOWRoomTemplate {
  roomType: string;
  roomLabel: string;
  photo: string;
  condition: 'cosmetic' | 'moderate' | 'full';
  materialCost: number;
  laborCost: number;
  totalCost: number;
  workDescription: string;
  lineItems: SOWLineItem[];
}

export interface SOWLineItem {
  item: string;
  material: string;
  quantity: number;
  unit: string;
  materialCost: number;
  laborCost: number;
  totalCost: number;
}

export interface SOWProperty {
  id: string;
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
  rehabBudget: number;
  tier: 'rental' | 'standard' | 'luxury';
  style: string;
  heroPhoto: string;
  rooms: SOWRoomTemplate[];
}

// ─── CDN IMAGE URLS ──────────────────────────────────────────
const CDN = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY';

const IMG = {
  // Castle Ave (Luxury Victorian)
  castleKitchen: `${CDN}/castle-ave-kitchen_9569cbe6.jpg`,
  castleMasterBath: `${CDN}/castle-ave-master-bath-Hk2Bq5ynXKoLFDqXzGjcKX.webp`,
  castleFullBath: `${CDN}/castle-ave-full-bath-3sMkXfwKKVWR7WsGUwzFQn.webp`,
  castleHalfBath: `${CDN}/castle-ave-half-bath-3bkqxqbxjBTCJqhJBJZJCb.webp`,
  castleLivingRoom: `${CDN}/castle-ave-living-room-FWMkKRqyJHAjp5sPpLHKJn.webp`,
  castleBedroom: `${CDN}/castle-ave-bedroom_8e100b1b.jpg`,
  castleGarage: `${CDN}/castle-ave-garage_6cf46424.jpg`,
  castleLandscaping: `${CDN}/castle-ave-landscaping_d552c5b7.jpg`,
  castleRoof: `${CDN}/castle-ave-roof_caa56f12.jpg`,

  // Magnolia Dr (Standard Colonial)
  magnoliaKitchen: `${CDN}/magnolia-dr-kitchen_2a21a73d.jpg`,
  magnoliaMasterBath: `${CDN}/magnolia-dr-master-bath-bHxPZqJYNjyYRPjgqGMBnX.webp`,
  magnoliaFullBath: `${CDN}/magnolia-dr-full-bath-2xyJf3Yt7Hfqb2E2nxhMPh.webp`,
  magnoliaHalfBath: `${CDN}/magnolia-dr-half-bath-7Rp2rJEBMqPwNxWpBCJMcN.webp`,
  magnoliaLivingRoom: `${CDN}/magnolia-dr-living-room-PZXuWz2yNRhRMCTJZsXjkB.webp`,
  magnoliaBedroom: `${CDN}/magnolia-dr-bedroom-4SqBEUqCxuXpCXKpXJsLYZ.webp`,
  magnoliaGarage: `${CDN}/magnolia-dr-garage_ff8dd581.jpg`,
  magnoliaLandscaping: `${CDN}/magnolia-dr-landscaping_9cf69221.jpg`,
  magnoliaRoof: `${CDN}/magnolia-dr-roof_cdbcd488.jpg`,

  // Riverside Blvd (Luxury Modern)
  riversideKitchen: `${CDN}/riverside-blvd-kitchen_794c7e50.jpg`,
  riversideMasterBath: `${CDN}/riverside-blvd-master-bath_774edb02.jpg`,
  riversideFullBath: `${CDN}/riverside-blvd-full-bath-Jn6Xnhv8Hy5ZjjDVuRrQnK.webp`,
  riversideHalfBath: `${CDN}/riverside-blvd-half-bath-3Ky3Kq8VdXWBCCxjqFkLKR.webp`,
  riversideLivingRoom: `${CDN}/riverside-blvd-living-room-AyWaFjrXkPdNxVb2xJEqCR.webp`,
  riversideBedroom: `${CDN}/riverside-blvd-bedroom-Ky4oQvhJVVjzVmHHfGXPCz.webp`,
  riversideGarage: `${CDN}/riverside-blvd-garage-7ZWuFAKLqhJXJVj9FqpjgU.webp`,
  riversideLandscaping: `${CDN}/riverside-blvd-landscaping-Ld3PcKCCfVzVUWbWUhKxLz.webp`,
  riversideRoof: `${CDN}/riverside-blvd-roof-GVfvNhR3wkVWXCYrGjPwbQ.webp`,

  // Oakwood Ct (Rental Bungalow)
  oakwoodKitchen: `${CDN}/oakwood-ct-kitchen-5fVcLXH6Y8VVXXhLjLyWPB.webp`,
  oakwoodMasterBath: `${CDN}/oakwood-ct-master-bath-Xf8hWVrJcmYzJPpVKxzVBB.webp`,
  oakwoodFullBath: `${CDN}/oakwood-ct-full-bath-7Kkh7NLXHqVhVJFVPfQHPb.webp`,
  oakwoodHalfBath: `${CDN}/oakwood-ct-half-bath-78D5C98CMBEmJXqSuBRS9D.webp`,
  oakwoodLivingRoom: `${CDN}/oakwood-ct-living-room-XsGrQp7diWEDSaEjHC5xq3.webp`,
  oakwoodBedroom: `${CDN}/oakwood-ct-bedroom-78D5C98CMBEmJXqSuBRS9D.webp`,
  oakwoodGarage: `${CDN}/oakwood-ct-garage-oUBLHirMDUngYBTdTyprHx.webp`,
  oakwoodLandscaping: `${CDN}/oakwood-ct-landscaping-9MdYZNA7Q2F9qgE9uCp3xX.webp`,
  oakwoodRoof: `${CDN}/oakwood-ct-roof-WKdAPDKKJbyw4XxiEUnwoY.webp`,

  // Peachtree Way (Standard Craftsman)
  peachtreeKitchen: `${CDN}/peachtree-way-kitchen-8WPnFmKkz6CiGXFeCpR93Y.webp`,
  peachtreeMasterBath: `${CDN}/peachtree-way-master-bath-5Y8TtpavhDNzL2KpcDL9un.webp`,
  peachtreeFullBath: `${CDN}/peachtree-way-full-bath-eRtTFceBjLV4ENSGRiPrR9.webp`,
  peachtreeHalfBath: `${CDN}/peachtree-way-half-bath-nscXojprMFSYaTsab7uJG7.webp`,
  peachtreeLivingRoom: `${CDN}/peachtree-way-living-room-oDnciyy5jrHgR2DVrJ8sgU.webp`,
  peachtreeBedroom: `${CDN}/peachtree-way-bedroom-f3V2kxQ9KCxPegBFQ77Q8H.webp`,
  peachtreeGarage: `${CDN}/peachtree-way-garage-bUbmFxFkt93an8nrvU2qAC.webp`,
  peachtreeLandscaping: `${CDN}/peachtree-way-landscaping-EdRgmVMz3eYXsgoSf95LZV.webp`,
  peachtreeRoof: `${CDN}/peachtree-way-roof-WKL9AoGPNUjh37UebHLSRv.webp`,

  // Harbor View Dr (Luxury Coastal)
  harborKitchen: `${CDN}/harbor-view-kitchen-KrSRv4hqBTnGnsb6GXwyfV.webp`,
  harborMasterBath: `${CDN}/harbor-view-master-bath-WLDDmtwu2CjNVDTaYus7Jk.webp`,
  harborFullBath: `${CDN}/harbor-view-full-bath-8uN77RffFSJtLJC5scAENr.webp`,
  harborHalfBath: `${CDN}/harbor-view-half-bath-ARqjbXzZAgV3f6C6uvA5FX.webp`,
  harborLivingRoom: `${CDN}/harbor-view-living-room-NHXFtAmddbRw6Ym5jwdXwW.webp`,
  harborBedroom: `${CDN}/harbor-view-bedroom-dXKdCUoYv2PpomzjrBrnP4.webp`,
  harborGarage: `${CDN}/harbor-view-garage-7V4QqA2qLqDbTtC6C8P696.webp`,
  harborLandscaping: `${CDN}/harbor-view-landscaping-3MsG8edgPQHc5S2NQqBCGv.webp`,
  harborRoof: `${CDN}/harbor-view-roof-GmpWGRTNfCdd3T3NQKBEGH.webp`,

  // Elm St (Rental Duplex)
  elmKitchen: `${CDN}/elm-st-kitchen-8WPnFmKkz6CiGXFeCpR93Y.webp`,
  elmMasterBath: `${CDN}/elm-st-master-bath-5Y8TtpavhDNzL2KpcDL9un.webp`,
  elmFullBath: `${CDN}/elm-st-full-bath-eRtTFceBjLV4ENSGRiPrR9.webp`,
  elmHalfBath: `${CDN}/elm-st-half-bath-nscXojprMFSYaTsab7uJG7.webp`,
  elmLivingRoom: `${CDN}/elm-st-living-room-oDnciyy5jrHgR2DVrJ8sgU.webp`,
  elmBedroom: `${CDN}/elm-st-bedroom-f3V2kxQ9KCxPegBFQ77Q8H.webp`,
  elmGarage: `${CDN}/elm-st-garage-bUbmFxFkt93an8nrvU2qAC.webp`,
  elmLandscaping: `${CDN}/elm-st-landscaping-EdRgmVMz3eYXsgoSf95LZV.webp`,
  elmRoof: `${CDN}/elm-st-roof-WKL9AoGPNUjh37UebHLSRv.webp`,

  // Summit Ridge (Luxury Mediterranean)
  summitKitchen: `${CDN}/summit-ridge-kitchen-KrSRv4hqBTnGnsb6GXwyfV.webp`,
  summitMasterBath: `${CDN}/summit-ridge-master-bath-WLDDmtwu2CjNVDTaYus7Jk.webp`,
  summitFullBath: `${CDN}/summit-ridge-full-bath-8uN77RffFSJtLJC5scAENr.webp`,
  summitHalfBath: `${CDN}/summit-ridge-half-bath-ARqjbXzZAgV3f6C6uvA5FX.webp`,
  summitLivingRoom: `${CDN}/summit-ridge-living-room-NHXFtAmddbRw6Ym5jwdXwW.webp`,
  summitBedroom: `${CDN}/summit-ridge-bedroom-dXKdCUoYv2PpomzjrBrnP4.webp`,
  summitGarage: `${CDN}/summit-ridge-garage-7V4QqA2qLqDbTtC6C8P696.webp`,
  summitLandscaping: `${CDN}/summit-ridge-landscaping-3MsG8edgPQHc5S2NQqBCGv.webp`,
  summitRoof: `${CDN}/summit-ridge-roof-GmpWGRTNfCdd3T3NQKBEGH.webp`,

  // Birch Ln (Standard Cape Cod)
  birchKitchen: `${CDN}/birch-ln-kitchen-8WPnFmKkz6CiGXFeCpR93Y.webp`,
  birchMasterBath: `${CDN}/birch-ln-master-bath-5Y8TtpavhDNzL2KpcDL9un.webp`,
  birchFullBath: `${CDN}/birch-ln-full-bath-eRtTFceBjLV4ENSGRiPrR9.webp`,
  birchHalfBath: `${CDN}/birch-ln-half-bath-nscXojprMFSYaTsab7uJG7.webp`,
  birchLivingRoom: `${CDN}/birch-ln-living-room-oDnciyy5jrHgR2DVrJ8sgU.webp`,
  birchBedroom: `${CDN}/birch-ln-bedroom-f3V2kxQ9KCxPegBFQ77Q8H.webp`,
  birchGarage: `${CDN}/birch-ln-garage-bUbmFxFkt93an8nrvU2qAC.webp`,
  birchLandscaping: `${CDN}/birch-ln-landscaping-EdRgmVMz3eYXsgoSf95LZV.webp`,
  birchRoof: `${CDN}/birch-ln-roof-WKL9AoGPNUjh37UebHLSRv.webp`,

  // Willow Creek Way (Luxury Farmhouse)
  willowKitchen: `${CDN}/willow-creek-kitchen-8WPnFmKkz6CiGXFeCpR93Y.webp`,
  willowMasterBath: `${CDN}/willow-creek-master-bath-5Y8TtpavhDNzL2KpcDL9un.webp`,
  willowFullBath: `${CDN}/willow-creek-full-bath-eRtTFceBjLV4ENSGRiPrR9.webp`,
  willowHalfBath: `${CDN}/willow-creek-half-bath-nscXojprMFSYaTsab7uJG7.webp`,
  willowLivingRoom: `${CDN}/willow-creek-living-room-oDnciyy5jrHgR2DVrJ8sgU.webp`,
  willowBedroom: `${CDN}/willow-creek-bedroom-f3V2kxQ9KCxPegBFQ77Q8H.webp`,
  willowGarage: `${CDN}/willow-creek-garage-bUbmFxFkt93an8nrvU2qAC.webp`,
  willowLandscaping: `${CDN}/willow-creek-landscaping-EdRgmVMz3eYXsgoSf95LZV.webp`,
  willowRoof: `${CDN}/willow-creek-roof-WKL9AoGPNUjh37UebHLSRv.webp`,

  // Pine Hollow (Rental Ranch)
  pineKitchen: `${CDN}/pine-hollow-kitchen-8WPnFmKkz6CiGXFeCpR93Y.webp`,
  pineMasterBath: `${CDN}/pine-hollow-master-bath-5Y8TtpavhDNzL2KpcDL9un.webp`,
  pineFullBath: `${CDN}/pine-hollow-full-bath-eRtTFceBjLV4ENSGRiPrR9.webp`,
  pineHalfBath: `${CDN}/pine-hollow-half-bath-nscXojprMFSYaTsab7uJG7.webp`,
  pineLivingRoom: `${CDN}/pine-hollow-living-room-oDnciyy5jrHgR2DVrJ8sgU.webp`,
  pineBedroom: `${CDN}/pine-hollow-bedroom-XsGrQp7diWEDSaEjHC5xq3.webp`,
  pineGarage: `${CDN}/pine-hollow-garage-oUBLHirMDUngYBTdTyprHx.webp`,
  pineLandscaping: `${CDN}/pine-hollow-landscaping-9MdYZNA7Q2F9qgE9uCp3xX.webp`,
  pineRoof: `${CDN}/pine-hollow-roof-WKdAPDKKJbyw4XxiEUnwoY.webp`,

  // Copper Canyon (Standard Contemporary)
  copperKitchen: `${CDN}/copper-canyon-kitchen-8WPnFmKkz6CiGXFeCpR93Y.webp`,
  copperMasterBath: `${CDN}/copper-canyon-master-bath-5Y8TtpavhDNzL2KpcDL9un.webp`,
  copperFullBath: `${CDN}/copper-canyon-full-bath-eRtTFceBjLV4ENSGRiPrR9.webp`,
  copperHalfBath: `${CDN}/copper-canyon-half-bath-nscXojprMFSYaTsab7uJG7.webp`,
  copperLivingRoom: `${CDN}/copper-canyon-living-room-oDnciyy5jrHgR2DVrJ8sgU.webp`,
  copperBedroom: `${CDN}/copper-canyon-bedroom-f3V2kxQ9KCxPegBFQ77Q8H.webp`,
  copperGarage: `${CDN}/copper-canyon-garage-bUbmFxFkt93an8nrvU2qAC.webp`,
  copperLandscaping: `${CDN}/copper-canyon-landscaping-EdRgmVMz3eYXsgoSf95LZV.webp`,
  copperRoof: `${CDN}/copper-canyon-roof-WKL9AoGPNUjh37UebHLSRv.webp`,
};

// ─── HELPER: Build room template ─────────────────────────────
function room(
  roomType: string,
  roomLabel: string,
  photo: string,
  condition: 'cosmetic' | 'moderate' | 'full',
  materialCost: number,
  laborCost: number,
  workDescription: string,
  lineItems: SOWLineItem[]
): SOWRoomTemplate {
  return {
    roomType, roomLabel, photo, condition,
    materialCost, laborCost,
    totalCost: materialCost + laborCost,
    workDescription, lineItems,
  };
}

function li(item: string, material: string, qty: number, unit: string, matCost: number, labCost: number): SOWLineItem {
  return { item, material, quantity: qty, unit, materialCost: matCost, laborCost: labCost, totalCost: matCost + labCost };
}

// ============================================================
// PROPERTY 1: 742 Castle Ave — Luxury Victorian
// ============================================================
const castleAveRooms: SOWRoomTemplate[] = [
  room('kitchen', 'Kitchen', IMG.castleKitchen, 'full', 32000, 14000,
    'Full gut luxury kitchen renovation. Remove all existing cabinets, countertops, flooring, and appliances down to studs. Install custom inset shaker cabinetry with soft-close hinges and dovetail drawers. Natural marble countertops with ogee edge profile. Full-height Calacatta marble backsplash. Wide-plank white oak hardwood flooring. Professional-grade 48" dual-fuel range, built-in refrigerator/freezer columns, panel-ready dishwasher, and wine cooler. Farmhouse apron-front sink with commercial-style faucet. Custom range hood with brass accents. Under-cabinet and in-cabinet LED lighting throughout. New dedicated electrical circuits for all appliances.',
    [
      li('Custom Inset Cabinets', 'KraftMaid custom inset shaker, dovetail drawers', 30, 'lin ft', 13500, 4500),
      li('Marble Countertops', 'Calacatta marble, ogee edge, 40 sqft', 1, 'lot', 6800, 2200),
      li('Marble Backsplash', 'Full-height Calacatta marble tile', 35, 'sqft', 2100, 1050),
      li('Hardwood Flooring', 'Wide-plank white oak, 120 sqft', 120, 'sqft', 1800, 960),
      li('Appliance Suite', '48" dual-fuel range, built-in fridge, DW, wine cooler', 1, 'lot', 4800, 800),
      li('Farmhouse Sink & Faucet', 'Fireclay apron-front + commercial faucet', 1, 'ea', 1200, 450),
      li('Custom Range Hood', 'Brass-accent custom hood with liner', 1, 'ea', 1200, 600),
      li('Lighting Package', 'Under-cabinet LED, pendants, recessed cans', 1, 'lot', 600, 440),
    ]
  ),
  room('master_bath', 'Master Bathroom', IMG.castleMasterBath, 'full', 22000, 10000,
    'Complete master bathroom gut renovation. Demo all existing fixtures, tile, and vanity to studs. Install heated porcelain tile floor. Oversized frameless glass walk-in shower with marble walls, rain showerhead, handheld wand, and built-in niche. Freestanding soaking tub with floor-mount faucet. Custom double vanity with marble top and undermount sinks. LED backlit mirrors. Heated towel bar. New exhaust fan with humidity sensor. All new plumbing supply and drain lines.',
    [
      li('Heated Tile Floor', 'Large-format porcelain + radiant heat mat, 80 sqft', 80, 'sqft', 3200, 1600),
      li('Walk-in Shower', 'Frameless glass, marble walls, rain head, niche', 1, 'lot', 6500, 3200),
      li('Freestanding Tub', 'Acrylic soaking tub + floor-mount faucet', 1, 'ea', 2800, 800),
      li('Double Vanity', 'Custom 72" vanity, marble top, undermount sinks', 1, 'ea', 4200, 1200),
      li('LED Mirrors', 'Backlit LED mirrors (2)', 2, 'ea', 1200, 400),
      li('Fixtures & Accessories', 'Heated towel bar, robe hooks, TP holder', 1, 'lot', 800, 300),
      li('Plumbing Rough-in', 'New supply/drain lines, exhaust fan', 1, 'lot', 1800, 1500),
      li('Paint & Trim', 'Premium paint, crown molding, baseboards', 1, 'lot', 1500, 1000),
    ]
  ),
  room('full_bath', 'Full Bathroom', IMG.castleFullBath, 'full', 14000, 6500,
    'Full bathroom renovation. Demo all existing tile, vanity, and fixtures. Install porcelain tile floor and shower surround. New 60" alcove tub with tile surround. Glass shower door. 48" vanity with quartz top. Framed mirror. New toilet. Chrome fixtures throughout. Recessed lighting. Exhaust fan. Fresh paint and trim.',
    [
      li('Tile Floor & Shower', 'Porcelain tile floor + shower surround', 1, 'lot', 3800, 2000),
      li('Alcove Tub', '60" soaking tub + tile surround', 1, 'ea', 1800, 800),
      li('Glass Shower Door', 'Semi-frameless glass door', 1, 'ea', 1200, 400),
      li('Vanity & Top', '48" vanity, quartz top, undermount sink', 1, 'ea', 2400, 600),
      li('Toilet', 'Elongated comfort-height toilet', 1, 'ea', 450, 250),
      li('Fixtures', 'Chrome faucet, showerhead, accessories', 1, 'lot', 800, 300),
      li('Mirror & Lighting', 'Framed mirror + vanity light bar', 1, 'lot', 550, 250),
      li('Paint & Trim', 'Walls, ceiling, baseboards', 1, 'lot', 3000, 1900),
    ]
  ),
  room('half_bath', 'Half Bath / Powder Room', IMG.castleHalfBath, 'full', 8000, 3500,
    'Luxury powder room renovation. Demo existing vanity and flooring. Install floating vanity with vessel sink and wall-mount faucet. Decorative tile accent wall. Patterned tile floor. Framed mirror with sconce lighting. New toilet. Crown molding. Premium wallpaper accent.',
    [
      li('Floating Vanity', 'Custom floating vanity + vessel sink', 1, 'ea', 2200, 600),
      li('Wall-Mount Faucet', 'Brushed gold wall-mount faucet', 1, 'ea', 450, 300),
      li('Accent Tile Wall', 'Decorative marble mosaic accent', 1, 'lot', 1800, 800),
      li('Patterned Floor Tile', 'Encaustic cement tile, 25 sqft', 25, 'sqft', 1250, 500),
      li('Toilet', 'Wall-hung toilet with concealed tank', 1, 'ea', 650, 350),
      li('Mirror & Sconces', 'Ornate mirror + brass sconces', 1, 'lot', 800, 250),
      li('Paint & Trim', 'Premium paint, crown molding', 1, 'lot', 850, 700),
    ]
  ),
  room('living_room', 'Living Room', IMG.castleLivingRoom, 'full', 16000, 7000,
    'Luxury living room renovation. Refinish original hardwood floors. Install custom built-in bookshelves flanking fireplace. Restore and update fireplace with marble surround and custom mantel. Crown molding and wainscoting throughout. New recessed lighting with dimmers. Custom window treatments. Fresh premium paint. Update all electrical outlets and switches to decorative plates.',
    [
      li('Hardwood Refinish', 'Sand, stain, 3-coat poly, 350 sqft', 350, 'sqft', 2800, 2100),
      li('Custom Built-ins', 'Floor-to-ceiling bookshelves, painted', 2, 'units', 4200, 1800),
      li('Fireplace Surround', 'Marble surround + custom wood mantel', 1, 'lot', 3500, 1200),
      li('Crown Molding', 'Multi-piece crown molding, 80 lin ft', 80, 'lin ft', 1600, 800),
      li('Wainscoting', 'Raised-panel wainscoting, 60 lin ft', 60, 'lin ft', 1800, 600),
      li('Lighting', 'Recessed cans + chandelier + dimmers', 1, 'lot', 1200, 300),
      li('Paint & Trim', 'Premium paint, all trim, ceiling', 1, 'lot', 900, 200),
    ]
  ),
  room('bedroom', 'Bedroom (Primary)', IMG.castleBedroom, 'moderate', 10000, 4500,
    'Primary bedroom renovation. Refinish hardwood floors. Install custom closet system with built-in drawers, shelving, and double hang rods. New ceiling fan with light kit. Crown molding. Fresh premium paint. New window treatments. Update electrical outlets.',
    [
      li('Hardwood Refinish', 'Sand, stain, poly, 250 sqft', 250, 'sqft', 2000, 1500),
      li('Custom Closet', 'Built-in closet system with drawers/shelves', 1, 'lot', 3500, 1200),
      li('Ceiling Fan', 'Premium ceiling fan with light kit', 1, 'ea', 450, 200),
      li('Crown Molding', '60 lin ft crown molding', 60, 'lin ft', 1200, 600),
      li('Paint', 'Premium paint, walls + ceiling + trim', 1, 'lot', 800, 400),
      li('Window Treatments', 'Custom blinds + curtain rods', 3, 'ea', 1200, 300),
      li('Electrical', 'New outlets, USB outlets, switch plates', 1, 'lot', 850, 300),
    ]
  ),
  room('garage', 'Garage', IMG.castleGarage, 'moderate', 6000, 3000,
    'Two-car garage renovation. Apply epoxy floor coating. Install wall-mounted storage system with cabinets and pegboard. LED shop lighting. Insulate and drywall ceiling. New insulated garage doors. Smart garage door opener. Weatherstripping and threshold seal.',
    [
      li('Epoxy Floor', 'Professional epoxy coating, 450 sqft', 450, 'sqft', 1800, 900),
      li('Storage System', 'Wall cabinets + pegboard + workbench', 1, 'lot', 1500, 600),
      li('LED Lighting', '4-ft LED shop lights (6)', 6, 'ea', 480, 240),
      li('Ceiling Insulation', 'R-30 batts + drywall', 1, 'lot', 800, 500),
      li('Garage Doors', 'Insulated steel doors (2)', 2, 'ea', 900, 500),
      li('Smart Opener', 'WiFi-enabled garage door opener', 1, 'ea', 320, 160),
      li('Weatherstripping', 'Door seals + threshold', 1, 'lot', 200, 100),
    ]
  ),
  room('landscaping', 'Landscaping & Exterior', IMG.castleLandscaping, 'moderate', 12000, 5000,
    'Luxury exterior and landscaping renovation. Power wash entire exterior. Repaint all trim, shutters, and front door. Install new front walkway with flagstone pavers. Professional landscape design with specimen plantings, ornamental trees, and perennial beds. Landscape lighting package. New mailbox. Repair/replace porch railings. Install new house numbers and exterior fixtures.',
    [
      li('Exterior Paint', 'Trim, shutters, front door', 1, 'lot', 2500, 1500),
      li('Flagstone Walkway', 'Natural flagstone pavers, 150 sqft', 150, 'sqft', 3000, 1200),
      li('Landscape Design', 'Specimen plantings, trees, perennials', 1, 'lot', 3500, 1000),
      li('Landscape Lighting', 'Path lights, uplights, transformer', 1, 'lot', 1500, 500),
      li('Porch Repairs', 'Railing repair/replace, column wraps', 1, 'lot', 800, 400),
      li('Accessories', 'Mailbox, house numbers, fixtures', 1, 'lot', 400, 200),
      li('Power Wash', 'Full exterior + driveway', 1, 'lot', 300, 200),
    ]
  ),
  room('roof', 'Roof & Gutters', IMG.castleRoof, 'full', 18000, 8000,
    'Complete roof replacement. Tear off existing shingles to decking. Inspect and replace damaged decking. Install ice and water shield on eaves and valleys. Synthetic underlayment. GAF Timberline HDZ architectural shingles. New ridge vent system. Replace all flashing. New seamless aluminum gutters with leaf guards. New downspouts routed to underground drains.',
    [
      li('Tear-off & Disposal', 'Remove existing shingles, 2200 sqft', 2200, 'sqft', 1200, 2200),
      li('Decking Repair', 'Replace damaged plywood sections', 1, 'lot', 1500, 800),
      li('Underlayment', 'Ice shield + synthetic felt', 2200, 'sqft', 1800, 800),
      li('Architectural Shingles', 'GAF Timberline HDZ, 2200 sqft', 2200, 'sqft', 7500, 2200),
      li('Ridge Vent', 'Continuous ridge vent system', 1, 'lot', 600, 300),
      li('Flashing', 'Step, valley, chimney, pipe flashing', 1, 'lot', 1200, 500),
      li('Gutters', 'Seamless aluminum + leaf guards', 160, 'lin ft', 2800, 800),
      li('Downspouts', 'Aluminum downspouts + underground drains', 6, 'ea', 1400, 400),
    ]
  ),
];

// ============================================================
// PROPERTY 2: 1847 Magnolia Dr — Standard Colonial
// ============================================================
const magnoliaDrRooms: SOWRoomTemplate[] = [
  room('kitchen', 'Kitchen', IMG.magnoliaKitchen, 'full', 14000, 6500,
    'Standard kitchen remodel. Demo existing cabinets, countertops, and flooring. Install white shaker cabinets with soft-close hardware. Granite countertops with eased edge. Subway tile backsplash. LVP flooring throughout. New stainless steel appliance package (refrigerator, range, dishwasher, microwave). Double-bowl undermount sink with pull-down faucet. Under-cabinet LED lighting. Recessed can lights. Paint walls and ceiling.',
    [
      li('Shaker Cabinets', 'White shaker, soft-close, 24 lin ft', 24, 'lin ft', 4800, 1800),
      li('Granite Countertops', 'Level 2 granite, eased edge, 35 sqft', 35, 'sqft', 2800, 1200),
      li('Subway Backsplash', 'White 3x6 subway tile', 30, 'sqft', 600, 450),
      li('LVP Flooring', 'Luxury vinyl plank, 100 sqft', 100, 'sqft', 500, 400),
      li('Appliance Package', 'SS fridge, range, DW, microwave', 1, 'lot', 3200, 400),
      li('Sink & Faucet', 'Double-bowl undermount + pull-down faucet', 1, 'ea', 450, 250),
      li('Lighting', 'Under-cabinet LED + recessed cans (6)', 1, 'lot', 650, 400),
      li('Paint & Trim', 'Walls, ceiling, baseboards', 1, 'lot', 1000, 1600),
    ]
  ),
  room('master_bath', 'Master Bathroom', IMG.magnoliaMasterBath, 'full', 10000, 5000,
    'Standard master bathroom remodel. Demo existing tile, vanity, and fixtures. Install porcelain tile floor. Tiled walk-in shower with glass door and built-in niche. 60" double vanity with granite top. Framed mirrors. New toilet. Brushed nickel fixtures. Exhaust fan. Recessed lighting. Fresh paint.',
    [
      li('Tile Floor', 'Porcelain tile, 65 sqft', 65, 'sqft', 1300, 975),
      li('Walk-in Shower', 'Tiled shower, glass door, niche', 1, 'lot', 3200, 1600),
      li('Double Vanity', '60" vanity, granite top, 2 sinks', 1, 'ea', 2200, 700),
      li('Toilet', 'Elongated comfort-height', 1, 'ea', 350, 200),
      li('Fixtures', 'Brushed nickel faucets, showerhead, accessories', 1, 'lot', 650, 300),
      li('Mirrors & Lighting', 'Framed mirrors (2) + vanity lights', 1, 'lot', 500, 250),
      li('Exhaust Fan', 'Quiet exhaust fan with light', 1, 'ea', 180, 150),
      li('Paint & Trim', 'Walls, ceiling, baseboards', 1, 'lot', 1620, 825),
    ]
  ),
  room('full_bath', 'Full Bathroom', IMG.magnoliaFullBath, 'full', 7500, 3800,
    'Standard full bathroom remodel. Demo existing fixtures and tile. Install ceramic tile floor and tub surround. New 60" alcove tub. Shower curtain rod. 36" vanity with granite top. New toilet. Chrome fixtures. Medicine cabinet. Exhaust fan. Paint.',
    [
      li('Tile Floor', 'Ceramic tile, 45 sqft', 45, 'sqft', 675, 450),
      li('Tub & Surround', '60" alcove tub + tile surround', 1, 'lot', 2200, 1200),
      li('Vanity & Top', '36" vanity, granite top, sink', 1, 'ea', 1200, 400),
      li('Toilet', 'Standard elongated toilet', 1, 'ea', 280, 180),
      li('Fixtures', 'Chrome faucet, showerhead, rod', 1, 'lot', 350, 200),
      li('Medicine Cabinet', 'Recessed medicine cabinet + light', 1, 'ea', 250, 150),
      li('Exhaust Fan', 'Standard exhaust fan', 1, 'ea', 120, 100),
      li('Paint & Trim', 'Walls, ceiling, baseboards', 1, 'lot', 2425, 1120),
    ]
  ),
  room('half_bath', 'Half Bath / Powder Room', IMG.magnoliaHalfBath, 'moderate', 4000, 2000,
    'Standard powder room update. Replace vanity with new 24" vanity and granite top. New faucet. Replace toilet. Install new mirror and light fixture. New vinyl plank flooring. Fresh paint. New accessories (towel bar, TP holder).',
    [
      li('Vanity & Top', '24" vanity, granite top, sink', 1, 'ea', 800, 350),
      li('Faucet', 'Chrome single-handle faucet', 1, 'ea', 120, 100),
      li('Toilet', 'Standard toilet', 1, 'ea', 250, 150),
      li('Mirror & Light', 'Framed mirror + vanity light', 1, 'lot', 300, 150),
      li('Flooring', 'Vinyl plank, 20 sqft', 20, 'sqft', 160, 120),
      li('Accessories', 'Towel bar, TP holder, robe hook', 1, 'lot', 80, 50),
      li('Paint', 'Walls, ceiling, trim', 1, 'lot', 2290, 1080),
    ]
  ),
  room('living_room', 'Living Room', IMG.magnoliaLivingRoom, 'moderate', 6000, 3000,
    'Standard living room renovation. Install new LVP flooring. Paint walls and ceiling. Install crown molding. New ceiling fan with light. Update electrical outlets. New baseboards. Window treatments.',
    [
      li('LVP Flooring', 'Luxury vinyl plank, 300 sqft', 300, 'sqft', 1800, 1200),
      li('Crown Molding', 'MDF crown molding, 65 lin ft', 65, 'lin ft', 650, 390),
      li('Ceiling Fan', 'Standard ceiling fan with light', 1, 'ea', 250, 150),
      li('Baseboards', 'MDF baseboards, 65 lin ft', 65, 'lin ft', 390, 260),
      li('Paint', 'Walls, ceiling, trim, 300 sqft', 1, 'lot', 600, 400),
      li('Electrical', 'Update outlets, switches, plates', 1, 'lot', 400, 200),
      li('Window Treatments', 'Blinds + curtain rods (4 windows)', 4, 'ea', 1910, 400),
    ]
  ),
  room('bedroom', 'Bedroom (Primary)', IMG.magnoliaBedroom, 'moderate', 4500, 2200,
    'Standard primary bedroom update. Install new LVP flooring. Paint walls and ceiling. New ceiling fan. Closet organizer system. New baseboards. Window treatments. Update outlets.',
    [
      li('LVP Flooring', 'Luxury vinyl plank, 200 sqft', 200, 'sqft', 1200, 800),
      li('Closet Organizer', 'Wire closet system with shelves/rods', 1, 'lot', 600, 300),
      li('Ceiling Fan', 'Standard ceiling fan with light', 1, 'ea', 200, 150),
      li('Paint', 'Walls, ceiling, trim', 1, 'lot', 500, 300),
      li('Baseboards', 'MDF baseboards, 55 lin ft', 55, 'lin ft', 330, 220),
      li('Window Treatments', 'Blinds + curtain rods (2)', 2, 'ea', 320, 130),
      li('Electrical', 'Outlets, USB outlets, plates', 1, 'lot', 1350, 300),
    ]
  ),
  room('garage', 'Garage', IMG.magnoliaGarage, 'moderate', 3500, 1800,
    'Standard two-car garage update. Paint concrete floor with garage floor paint. Install wall-mounted shelving. New LED shop lights. Insulate garage door. New weatherstripping. Organize with pegboard tool wall.',
    [
      li('Floor Paint', 'Epoxy-style garage floor paint, 400 sqft', 400, 'sqft', 800, 400),
      li('Wall Shelving', 'Heavy-duty wall shelves (3 units)', 3, 'ea', 450, 225),
      li('LED Lighting', '4-ft LED shop lights (4)', 4, 'ea', 320, 160),
      li('Door Insulation', 'Garage door insulation kit', 2, 'ea', 200, 100),
      li('Weatherstripping', 'Door seals + threshold', 1, 'lot', 150, 75),
      li('Pegboard', 'Pegboard tool wall + hooks', 1, 'lot', 180, 90),
      li('Paint', 'Walls, trim', 1, 'lot', 1400, 750),
    ]
  ),
  room('landscaping', 'Landscaping & Exterior', IMG.magnoliaLandscaping, 'moderate', 5500, 2500,
    'Standard exterior and landscaping update. Power wash siding, walkways, and driveway. Paint front door and shutters. Mulch all beds. Plant foundation shrubs and seasonal flowers. Edge all beds and walkways. New porch light fixtures. New house numbers. Basic landscape lighting.',
    [
      li('Power Wash', 'Siding, walkways, driveway', 1, 'lot', 250, 200),
      li('Exterior Paint', 'Front door + shutters', 1, 'lot', 400, 300),
      li('Mulch & Edging', 'Mulch (15 yards) + bed edging', 1, 'lot', 600, 400),
      li('Plantings', 'Foundation shrubs + seasonal flowers', 1, 'lot', 1800, 600),
      li('Porch Fixtures', 'New light fixtures + house numbers', 1, 'lot', 350, 150),
      li('Landscape Lighting', 'Path lights (8) + transformer', 1, 'lot', 800, 350),
      li('Lawn Repair', 'Overseed, fertilize, edge', 1, 'lot', 1300, 500),
    ]
  ),
  room('roof', 'Roof & Gutters', IMG.magnoliaRoof, 'full', 12000, 5500,
    'Standard roof replacement. Tear off existing shingles. Inspect decking and replace damaged sections. Install synthetic underlayment. GAF Timberline architectural shingles. Ridge vent. Replace all flashing. New seamless aluminum gutters and downspouts.',
    [
      li('Tear-off', 'Remove existing shingles, 1800 sqft', 1800, 'sqft', 900, 1600),
      li('Decking Repair', 'Replace damaged plywood', 1, 'lot', 800, 500),
      li('Underlayment', 'Synthetic felt, 1800 sqft', 1800, 'sqft', 1200, 600),
      li('Shingles', 'GAF Timberline, 1800 sqft', 1800, 'sqft', 5400, 1600),
      li('Ridge Vent', 'Ridge vent system', 1, 'lot', 400, 200),
      li('Flashing', 'Step, valley, pipe flashing', 1, 'lot', 800, 400),
      li('Gutters', 'Seamless aluminum, 120 lin ft', 120, 'lin ft', 1500, 400),
      li('Downspouts', 'Aluminum downspouts (4)', 4, 'ea', 1000, 200),
    ]
  ),
];

// ============================================================
// PROPERTY 3: 2100 Riverside Blvd — Luxury Modern
// ============================================================
const riversideBlvdRooms: SOWRoomTemplate[] = [
  room('kitchen', 'Kitchen', IMG.riversideKitchen, 'full', 35000, 15000,
    'Ultra-luxury modern kitchen. Full gut to studs. European frameless cabinetry with integrated handles and push-to-open drawers. Porcelain slab countertops (Dekton). Full-height slab backsplash. Polished concrete flooring. Professional-grade appliances: 48" induction range, built-in column fridge/freezer, steam oven, speed oven, panel-ready dishwasher. Integrated sink with matte black fixtures. Linear LED lighting. Smart home integration.',
    [
      li('European Cabinets', 'Frameless, push-to-open, 32 lin ft', 32, 'lin ft', 14400, 4800),
      li('Porcelain Slab Counters', 'Dekton slab, 45 sqft', 45, 'sqft', 5400, 2000),
      li('Slab Backsplash', 'Full-height porcelain slab', 40, 'sqft', 2400, 1200),
      li('Polished Concrete Floor', 'Polished concrete, 130 sqft', 130, 'sqft', 2600, 1300),
      li('Pro Appliances', 'Induction range, column fridge, steam oven, DW', 1, 'lot', 6200, 1000),
      li('Integrated Sink', 'Stainless integrated sink + matte black faucet', 1, 'ea', 1200, 400),
      li('Linear LED Lighting', 'Continuous LED channels + pendants', 1, 'lot', 1400, 600),
      li('Smart Controls', 'Smart switches, outlets, hub', 1, 'lot', 1400, 2700),
    ]
  ),
  room('master_bath', 'Master Bathroom', IMG.riversideMasterBath, 'full', 25000, 11000,
    'Ultra-luxury modern master bath. Full gut. Large-format porcelain tile floor and walls (curbless shower). Linear drain. Frameless glass shower enclosure with dual rain heads and body jets. Freestanding sculptural tub. Floating double vanity with integrated sinks. Backlit LED mirrors. Heated floors. Towel warmer. Smart toilet with bidet. Motorized skylight.',
    [
      li('Large-Format Tile', 'Floor + walls, 120 sqft', 120, 'sqft', 4800, 2400),
      li('Curbless Shower', 'Linear drain, frameless glass, dual rain heads, body jets', 1, 'lot', 7500, 3500),
      li('Freestanding Tub', 'Sculptural stone-resin tub', 1, 'ea', 3200, 800),
      li('Floating Vanity', '72" floating vanity, integrated sinks', 1, 'ea', 4500, 1200),
      li('LED Mirrors', 'Backlit LED mirrors (2)', 2, 'ea', 1400, 400),
      li('Heated Floor', 'Radiant heat system', 1, 'lot', 1200, 600),
      li('Smart Toilet', 'Bidet toilet with heated seat', 1, 'ea', 1500, 400),
      li('Finishes', 'Towel warmer, accessories, paint', 1, 'lot', 900, 1700),
    ]
  ),
  room('full_bath', 'Full Bathroom', IMG.riversideFullBath, 'full', 15000, 7000,
    'Luxury modern full bathroom. Large-format tile floor and shower. Frameless glass shower door. Wall-hung vanity with quartz top. Wall-hung toilet. Matte black fixtures. LED mirror. Recessed lighting.',
    [
      li('Tile Floor & Shower', 'Large-format porcelain, 70 sqft', 70, 'sqft', 3500, 1750),
      li('Frameless Glass Door', 'Custom frameless glass', 1, 'ea', 1800, 600),
      li('Wall-Hung Vanity', '48" floating vanity + quartz top', 1, 'ea', 2800, 800),
      li('Wall-Hung Toilet', 'Concealed tank wall-hung toilet', 1, 'ea', 800, 400),
      li('Fixtures', 'Matte black faucet, shower, accessories', 1, 'lot', 900, 350),
      li('LED Mirror', 'Backlit LED mirror', 1, 'ea', 600, 200),
      li('Lighting & Fan', 'Recessed lights + exhaust', 1, 'lot', 400, 200),
      li('Paint & Trim', 'Walls, ceiling', 1, 'lot', 4200, 2700),
    ]
  ),
  room('half_bath', 'Half Bath / Powder Room', IMG.riversideHalfBath, 'full', 9000, 4000,
    'Modern luxury powder room. Floating concrete vanity with vessel sink. Wall-mount faucet in matte black. Feature wall with textured tile. Large-format floor tile. Round LED mirror. Wall-hung toilet. Designer sconce lighting.',
    [
      li('Concrete Vanity', 'Custom floating concrete vanity + vessel sink', 1, 'ea', 2500, 800),
      li('Wall-Mount Faucet', 'Matte black wall-mount', 1, 'ea', 500, 350),
      li('Feature Wall', 'Textured 3D tile accent wall', 1, 'lot', 2000, 900),
      li('Floor Tile', 'Large-format porcelain, 25 sqft', 25, 'sqft', 750, 375),
      li('Wall-Hung Toilet', 'Concealed tank toilet', 1, 'ea', 700, 350),
      li('LED Mirror & Sconces', 'Round LED mirror + designer sconces', 1, 'lot', 900, 300),
      li('Paint & Trim', 'Walls, ceiling', 1, 'lot', 1650, 925),
    ]
  ),
  room('living_room', 'Living Room', IMG.riversideLivingRoom, 'full', 18000, 8000,
    'Luxury modern living room. Install wide-plank engineered hardwood. Linear gas fireplace with floor-to-ceiling tile surround. Built-in entertainment center with floating shelves. Floor-to-ceiling windows (if structural). Automated motorized shades. Recessed LED lighting with smart controls. Premium paint.',
    [
      li('Engineered Hardwood', 'Wide-plank oak, 400 sqft', 400, 'sqft', 4800, 2400),
      li('Linear Fireplace', '60" linear gas fireplace + tile surround', 1, 'lot', 5500, 2000),
      li('Built-in Entertainment', 'Floating shelves + media center', 1, 'lot', 3200, 1200),
      li('Motorized Shades', 'Automated roller shades (6 windows)', 6, 'ea', 2400, 600),
      li('Smart Lighting', 'Recessed LED + smart switches + scenes', 1, 'lot', 1200, 500),
      li('Paint', 'Premium paint, walls + ceiling', 1, 'lot', 900, 1300),
    ]
  ),
  room('bedroom', 'Bedroom (Primary)', IMG.riversideBedroom, 'moderate', 12000, 5000,
    'Luxury primary bedroom. Engineered hardwood flooring. Custom walk-in closet with built-in cabinetry, drawers, and LED lighting. Accent wall with wood slat paneling. Premium ceiling fan. Motorized blackout shades. Recessed lighting with dimmers.',
    [
      li('Engineered Hardwood', 'Wide-plank oak, 280 sqft', 280, 'sqft', 3360, 1680),
      li('Custom Closet', 'Built-in cabinetry, drawers, LED', 1, 'lot', 4500, 1500),
      li('Accent Wall', 'Wood slat paneling', 1, 'lot', 1800, 600),
      li('Ceiling Fan', 'Premium modern ceiling fan', 1, 'ea', 500, 200),
      li('Motorized Shades', 'Blackout roller shades (3)', 3, 'ea', 1200, 300),
      li('Paint & Lighting', 'Paint, recessed cans, dimmers', 1, 'lot', 640, 720),
    ]
  ),
  room('garage', 'Garage', IMG.riversideGarage, 'moderate', 8000, 4000,
    'Luxury three-car garage. Professional polyaspartic floor coating. Custom wall storage system with cabinets and slat wall. LED recessed lighting. Insulated and finished walls. Smart garage door openers (3). EV charger pre-wire. Climate control.',
    [
      li('Polyaspartic Floor', 'Professional coating, 700 sqft', 700, 'sqft', 2800, 1400),
      li('Custom Storage', 'Cabinets + slat wall system', 1, 'lot', 2000, 800),
      li('LED Lighting', 'Recessed LED cans (12)', 12, 'ea', 720, 480),
      li('Finished Walls', 'Insulation + drywall + paint', 1, 'lot', 1200, 600),
      li('Smart Openers', 'WiFi garage openers (3)', 3, 'ea', 750, 300),
      li('EV Pre-wire', '240V outlet for EV charger', 1, 'ea', 350, 250),
      li('Climate Control', 'Mini-split AC unit', 1, 'ea', 180, 170),
    ]
  ),
  room('landscaping', 'Landscaping & Exterior', IMG.riversideLandscaping, 'moderate', 15000, 6000,
    'Luxury modern landscaping. Professional landscape design with drought-tolerant plantings. Concrete paver driveway extension. Modern steel-and-cable railing. Landscape lighting with smart controls. Irrigation system. Outdoor living area prep. New modern front door.',
    [
      li('Landscape Design', 'Drought-tolerant plantings + hardscape', 1, 'lot', 5000, 2000),
      li('Paver Driveway', 'Concrete pavers, 200 sqft extension', 200, 'sqft', 3000, 1200),
      li('Modern Railing', 'Steel + cable railing system', 1, 'lot', 2500, 800),
      li('Smart Lighting', 'LED landscape lights + smart controller', 1, 'lot', 1800, 600),
      li('Irrigation', 'Smart irrigation system', 1, 'lot', 1500, 600),
      li('Front Door', 'Modern pivot or steel door', 1, 'ea', 1200, 800),
    ]
  ),
  room('roof', 'Roof & Gutters', IMG.riversideRoof, 'full', 22000, 10000,
    'Premium roof system. Tear off existing. Standing seam metal roof on visible slopes. TPO membrane on flat sections. New skylights (2). Seamless copper gutters. Concealed downspouts. Snow guards where needed.',
    [
      li('Tear-off', 'Remove existing roofing, 2800 sqft', 2800, 'sqft', 1400, 2800),
      li('Standing Seam Metal', 'Metal roof on slopes, 2000 sqft', 2000, 'sqft', 10000, 3000),
      li('TPO Membrane', 'Flat roof sections, 800 sqft', 800, 'sqft', 2400, 1200),
      li('Skylights', 'Velux skylights (2)', 2, 'ea', 2400, 800),
      li('Copper Gutters', 'Seamless copper, 180 lin ft', 180, 'lin ft', 3600, 1200),
      li('Downspouts', 'Concealed copper downspouts (6)', 6, 'ea', 1200, 400),
      li('Snow Guards', 'Metal snow guard system', 1, 'lot', 1000, 600),
    ]
  ),
];

// ============================================================
// PROPERTIES 4-10: Abbreviated but complete
// ============================================================

// Property 4: 456 Oakwood Ct — Rental Bungalow
const oakwoodCtRooms: SOWRoomTemplate[] = [
  room('kitchen', 'Kitchen', IMG.oakwoodKitchen, 'moderate', 5400, 3200,
    'Rental-grade kitchen update. Paint existing cabinets white with new chrome hardware. Replace laminate countertops with post-form laminate in granite pattern. New vinyl plank flooring. Replace faucet and sink. New light fixture. Paint walls. Replace outlet covers. Service or replace range and dishwasher with basic models.',
    [
      li('Cabinet Paint & Hardware', 'Paint white + chrome pulls', 1, 'lot', 600, 800),
      li('Laminate Countertops', 'Post-form laminate, 25 lin ft', 25, 'lin ft', 750, 500),
      li('Vinyl Plank Floor', 'Basic LVP, 80 sqft', 80, 'sqft', 320, 320),
      li('Sink & Faucet', 'SS single-bowl + basic faucet', 1, 'ea', 250, 200),
      li('Appliances', 'Basic range + dishwasher', 1, 'lot', 1200, 200),
      li('Lighting & Paint', 'Ceiling light + wall paint', 1, 'lot', 400, 300),
      li('Electrical', 'Outlet covers, GFCI', 1, 'lot', 1880, 880),
    ]
  ),
  room('master_bath', 'Master Bathroom', IMG.oakwoodMasterBath, 'moderate', 3800, 2200,
    'Rental-grade master bath update. Reglaze existing tub. Install tub surround kit. New vanity with cultured marble top. New toilet. Chrome fixtures. Basic exhaust fan. Vinyl flooring. Paint.',
    [
      li('Tub Reglaze', 'Professional tub reglazing', 1, 'ea', 400, 350),
      li('Tub Surround', 'Acrylic tub surround kit', 1, 'ea', 350, 300),
      li('Vanity', '30" vanity + cultured marble top', 1, 'ea', 450, 250),
      li('Toilet', 'Basic round-front toilet', 1, 'ea', 180, 150),
      li('Fixtures', 'Chrome faucet, showerhead', 1, 'lot', 150, 120),
      li('Vinyl Floor', 'Sheet vinyl, 40 sqft', 40, 'sqft', 160, 120),
      li('Paint & Fan', 'Paint + basic exhaust fan', 1, 'lot', 2110, 910),
    ]
  ),
  room('full_bath', 'Full Bathroom', IMG.oakwoodFullBath, 'moderate', 3200, 1800,
    'Rental-grade full bath update. Reglaze tub. New shower curtain rod. Basic vanity replacement. New toilet. Chrome fixtures. Vinyl flooring. Paint. New mirror and light.',
    [
      li('Tub Reglaze', 'Professional reglazing', 1, 'ea', 400, 300),
      li('Vanity', '24" vanity + top', 1, 'ea', 350, 200),
      li('Toilet', 'Basic toilet', 1, 'ea', 150, 130),
      li('Fixtures', 'Chrome faucet, showerhead', 1, 'lot', 120, 100),
      li('Vinyl Floor', 'Sheet vinyl, 35 sqft', 35, 'sqft', 140, 105),
      li('Mirror & Light', 'Basic mirror + light bar', 1, 'lot', 120, 80),
      li('Paint', 'Walls, ceiling', 1, 'lot', 1920, 885),
    ]
  ),
  room('half_bath', 'Half Bath / Powder Room', IMG.oakwoodHalfBath, 'cosmetic', 1500, 900,
    'Rental-grade powder room refresh. Replace faucet. New mirror. Paint. New light fixture. Replace toilet seat. New accessories.',
    [
      li('Faucet', 'Basic chrome faucet', 1, 'ea', 80, 80),
      li('Mirror & Light', 'Basic mirror + light', 1, 'lot', 100, 80),
      li('Toilet Seat', 'New toilet seat', 1, 'ea', 30, 20),
      li('Accessories', 'Towel bar, TP holder', 1, 'lot', 40, 30),
      li('Paint', 'Walls, ceiling', 1, 'lot', 1250, 690),
    ]
  ),
  room('living_room', 'Living Room', IMG.oakwoodLivingRoom, 'moderate', 2800, 1500,
    'Rental-grade living room update. New vinyl plank flooring. Paint walls and ceiling. New ceiling fan. New baseboards. Replace outlet covers.',
    [
      li('Vinyl Plank', 'Basic LVP, 200 sqft', 200, 'sqft', 800, 600),
      li('Ceiling Fan', 'Basic ceiling fan with light', 1, 'ea', 120, 100),
      li('Baseboards', 'MDF baseboards, 50 lin ft', 50, 'lin ft', 200, 150),
      li('Paint', 'Walls + ceiling', 1, 'lot', 400, 250),
      li('Electrical', 'Outlet covers, switch plates', 1, 'lot', 1280, 400),
    ]
  ),
  room('bedroom', 'Bedroom (Primary)', IMG.oakwoodBedroom, 'moderate', 2000, 1100,
    'Rental-grade bedroom update. New vinyl plank flooring. Paint. New ceiling fan. Basic closet shelf and rod. New baseboards.',
    [
      li('Vinyl Plank', 'Basic LVP, 150 sqft', 150, 'sqft', 600, 450),
      li('Ceiling Fan', 'Basic ceiling fan', 1, 'ea', 100, 80),
      li('Closet', 'Wire shelf + rod', 1, 'lot', 80, 60),
      li('Paint', 'Walls + ceiling', 1, 'lot', 350, 200),
      li('Baseboards', 'MDF baseboards, 45 lin ft', 45, 'lin ft', 870, 310),
    ]
  ),
  room('garage', 'Garage', IMG.oakwoodGarage, 'cosmetic', 1200, 700,
    'Rental-grade garage cleanup. Sweep and seal concrete floor. Basic lighting. Weatherstripping. Paint walls if needed.',
    [
      li('Floor Seal', 'Concrete sealer, 300 sqft', 300, 'sqft', 300, 200),
      li('Lighting', 'LED shop light (2)', 2, 'ea', 80, 60),
      li('Weatherstripping', 'Door seals', 1, 'lot', 80, 50),
      li('Paint', 'Walls if needed', 1, 'lot', 740, 390),
    ]
  ),
  room('landscaping', 'Landscaping & Exterior', IMG.oakwoodLandscaping, 'moderate', 2500, 1200,
    'Rental-grade exterior update. Power wash siding and walkways. Paint front door. Basic mulch and edging. Trim overgrown shrubs. New porch light. Basic lawn care.',
    [
      li('Power Wash', 'Siding + walkways', 1, 'lot', 200, 150),
      li('Front Door Paint', 'Paint front door', 1, 'lot', 80, 60),
      li('Mulch & Edging', 'Mulch (5 yards) + edging', 1, 'lot', 300, 200),
      li('Shrub Trimming', 'Trim and shape existing shrubs', 1, 'lot', 100, 150),
      li('Porch Light', 'New exterior light fixture', 1, 'ea', 60, 40),
      li('Lawn Care', 'Mow, edge, fertilize', 1, 'lot', 1760, 600),
    ]
  ),
  room('roof', 'Roof & Gutters', IMG.oakwoodRoof, 'full', 7500, 3500,
    'Rental-grade roof replacement. Tear off existing 3-tab shingles. Install new 3-tab asphalt shingles. Basic underlayment. Replace damaged flashing. Clean and repair gutters. New downspout extensions.',
    [
      li('Tear-off', 'Remove shingles, 1200 sqft', 1200, 'sqft', 600, 1000),
      li('Underlayment', 'Standard felt, 1200 sqft', 1200, 'sqft', 600, 400),
      li('3-Tab Shingles', 'Basic asphalt, 1200 sqft', 1200, 'sqft', 3600, 1200),
      li('Flashing', 'Replace damaged flashing', 1, 'lot', 400, 250),
      li('Gutters', 'Clean + repair existing', 1, 'lot', 200, 200),
      li('Downspouts', 'Extensions + splash blocks', 4, 'ea', 2100, 450),
    ]
  ),
];

// Property 5: 3200 Peachtree Way — Standard Craftsman
const peachtreeWayRooms: SOWRoomTemplate[] = [
  room('kitchen', 'Kitchen', IMG.peachtreeKitchen, 'full', 15000, 7000,
    'Standard craftsman kitchen remodel. Demo all existing. Install shaker cabinets in warm gray with brushed brass hardware. Quartz countertops. Handmade-look subway tile backsplash. Engineered hardwood flooring. Stainless appliance package. Farmhouse sink with bridge faucet. Pendant lighting. Recessed cans.',
    [
      li('Shaker Cabinets', 'Warm gray shaker, 26 lin ft', 26, 'lin ft', 5200, 2080),
      li('Quartz Counters', 'White quartz, 38 sqft', 38, 'sqft', 3040, 1520),
      li('Subway Backsplash', 'Handmade-look subway tile', 32, 'sqft', 800, 480),
      li('Hardwood Floor', 'Engineered hardwood, 110 sqft', 110, 'sqft', 880, 550),
      li('Appliances', 'SS fridge, range, DW, microwave', 1, 'lot', 3000, 400),
      li('Farmhouse Sink', 'Fireclay + bridge faucet', 1, 'ea', 650, 300),
      li('Lighting', 'Pendants + recessed cans', 1, 'lot', 1430, 1670),
    ]
  ),
  room('master_bath', 'Master Bathroom', IMG.peachtreeMasterBath, 'full', 11000, 5500,
    'Standard craftsman master bath. Porcelain tile floor. Walk-in shower with subway tile and glass door. 60" double vanity with quartz top. Framed mirrors. New toilet. Brushed brass fixtures. Wainscoting.',
    [
      li('Tile Floor', 'Porcelain tile, 60 sqft', 60, 'sqft', 1200, 900),
      li('Walk-in Shower', 'Subway tile, glass door, niche', 1, 'lot', 3500, 1800),
      li('Double Vanity', '60" vanity, quartz top', 1, 'ea', 2400, 800),
      li('Toilet', 'Comfort-height elongated', 1, 'ea', 380, 200),
      li('Fixtures', 'Brushed brass faucets, shower, accessories', 1, 'lot', 750, 350),
      li('Mirrors & Lighting', 'Framed mirrors + sconces', 1, 'lot', 550, 250),
      li('Wainscoting', 'Board-and-batten wainscoting', 1, 'lot', 2220, 1200),
    ]
  ),
  room('full_bath', 'Full Bathroom', IMG.peachtreeFullBath, 'full', 8000, 4000,
    'Standard craftsman full bath. Tile floor and tub surround. New alcove tub. Glass shower door. 36" vanity with quartz top. New toilet. Brushed brass fixtures. Wainscoting.',
    [
      li('Tile Floor', 'Porcelain, 45 sqft', 45, 'sqft', 900, 600),
      li('Tub & Surround', 'Alcove tub + tile surround', 1, 'lot', 2400, 1200),
      li('Glass Door', 'Semi-frameless glass', 1, 'ea', 800, 300),
      li('Vanity', '36" vanity, quartz top', 1, 'ea', 1300, 450),
      li('Toilet', 'Standard elongated', 1, 'ea', 300, 180),
      li('Fixtures', 'Brushed brass faucet, shower', 1, 'lot', 400, 200),
      li('Wainscoting & Paint', 'Board-and-batten + paint', 1, 'lot', 1900, 1070),
    ]
  ),
  room('half_bath', 'Half Bath / Powder Room', IMG.peachtreeHalfBath, 'moderate', 4500, 2200,
    'Standard craftsman powder room. New pedestal sink. New toilet. Beadboard wainscoting. Tile floor. Framed mirror. Sconce lighting. Paint.',
    [
      li('Pedestal Sink', 'Craftsman-style pedestal + faucet', 1, 'ea', 600, 350),
      li('Toilet', 'Standard toilet', 1, 'ea', 280, 150),
      li('Beadboard', 'Beadboard wainscoting', 1, 'lot', 800, 400),
      li('Tile Floor', 'Hex tile, 20 sqft', 20, 'sqft', 400, 250),
      li('Mirror & Sconces', 'Framed mirror + sconces', 1, 'lot', 350, 200),
      li('Paint', 'Walls, ceiling', 1, 'lot', 2070, 850),
    ]
  ),
  room('living_room', 'Living Room', IMG.peachtreeLivingRoom, 'moderate', 7000, 3500,
    'Standard craftsman living room. Refinish existing hardwood floors. Install craftsman-style crown molding and trim. Update fireplace surround with tile and wood mantel. New ceiling fan. Paint. New lighting.',
    [
      li('Hardwood Refinish', 'Sand, stain, poly, 280 sqft', 280, 'sqft', 2240, 1400),
      li('Crown Molding', 'Craftsman crown, 60 lin ft', 60, 'lin ft', 720, 420),
      li('Fireplace Update', 'Tile surround + wood mantel', 1, 'lot', 1800, 700),
      li('Ceiling Fan', 'Craftsman-style fan', 1, 'ea', 280, 150),
      li('Paint & Trim', 'Walls, ceiling, all trim', 1, 'lot', 1960, 830),
    ]
  ),
  room('bedroom', 'Bedroom (Primary)', IMG.peachtreeBedroom, 'moderate', 5000, 2500,
    'Standard craftsman primary bedroom. Refinish hardwood floors. Closet organizer system. New ceiling fan. Crown molding. Paint. Window treatments.',
    [
      li('Hardwood Refinish', 'Sand, stain, poly, 220 sqft', 220, 'sqft', 1760, 1100),
      li('Closet Organizer', 'Wire system with shelves/rods', 1, 'lot', 500, 250),
      li('Ceiling Fan', 'Craftsman-style fan', 1, 'ea', 250, 150),
      li('Crown Molding', '50 lin ft', 50, 'lin ft', 500, 300),
      li('Paint & Trim', 'Walls, ceiling, trim', 1, 'lot', 1990, 700),
    ]
  ),
  room('garage', 'Garage', IMG.peachtreeGarage, 'moderate', 3800, 2000,
    'Standard two-car garage. Epoxy floor coating. Wall shelving. LED shop lights. Insulate garage door. New weatherstripping. Pegboard tool wall.',
    [
      li('Epoxy Floor', 'Epoxy coating, 400 sqft', 400, 'sqft', 1200, 600),
      li('Shelving', 'Heavy-duty shelves (3)', 3, 'ea', 450, 225),
      li('LED Lights', 'LED shop lights (4)', 4, 'ea', 280, 160),
      li('Insulation', 'Garage door insulation kit', 1, 'ea', 200, 100),
      li('Weatherstripping', 'Door seals', 1, 'lot', 120, 75),
      li('Pegboard', 'Tool wall + hooks', 1, 'lot', 1550, 840),
    ]
  ),
  room('landscaping', 'Landscaping & Exterior', IMG.peachtreeLandscaping, 'moderate', 6000, 2800,
    'Standard craftsman exterior. Power wash. Paint front door and trim. Mulch beds. Foundation plantings. Craftsman-style porch light. House numbers. Path lighting. Lawn repair.',
    [
      li('Power Wash', 'Full exterior', 1, 'lot', 250, 200),
      li('Exterior Paint', 'Door, trim, shutters', 1, 'lot', 600, 400),
      li('Mulch & Plants', 'Mulch + foundation shrubs + flowers', 1, 'lot', 2200, 800),
      li('Porch Light', 'Craftsman-style fixture', 1, 'ea', 180, 80),
      li('Path Lighting', 'Solar path lights (8)', 8, 'ea', 320, 120),
      li('Lawn', 'Overseed + fertilize', 1, 'lot', 2450, 1200),
    ]
  ),
  room('roof', 'Roof & Gutters', IMG.peachtreeRoof, 'full', 13000, 6000,
    'Standard roof replacement. Tear off. Architectural shingles. Synthetic underlayment. Ridge vent. New flashing. Seamless gutters and downspouts.',
    [
      li('Tear-off', 'Remove existing, 1900 sqft', 1900, 'sqft', 950, 1700),
      li('Underlayment', 'Synthetic felt', 1900, 'sqft', 1330, 665),
      li('Architectural Shingles', 'GAF Timberline, 1900 sqft', 1900, 'sqft', 5700, 1900),
      li('Ridge Vent', 'Continuous ridge vent', 1, 'lot', 450, 225),
      li('Flashing', 'All flashing', 1, 'lot', 900, 450),
      li('Gutters & Downspouts', 'Seamless aluminum, 140 lin ft', 140, 'lin ft', 3670, 1060),
    ]
  ),
];

// Property 6: 890 Harbor View Dr — Luxury Coastal
const harborViewRooms: SOWRoomTemplate[] = [
  room('kitchen', 'Kitchen', IMG.harborKitchen, 'full', 30000, 13000,
    'Luxury coastal kitchen. Full gut. White shaker cabinets with brass hardware. Quartzite countertops. Herringbone marble backsplash. Wide-plank white oak floors. Professional appliance suite. Large island with waterfall edge. Pot filler. Under-cabinet lighting.',
    [
      li('White Shaker Cabinets', 'Custom white shaker, 28 lin ft', 28, 'lin ft', 11200, 4200),
      li('Quartzite Counters', 'Natural quartzite, 42 sqft', 42, 'sqft', 5880, 2100),
      li('Herringbone Backsplash', 'Marble herringbone', 35, 'sqft', 2450, 1050),
      li('White Oak Floor', 'Wide-plank, 120 sqft', 120, 'sqft', 1680, 840),
      li('Pro Appliances', '48" range, built-in fridge, DW', 1, 'lot', 5200, 800),
      li('Waterfall Island', 'Quartzite waterfall edge island', 1, 'lot', 2200, 800),
      li('Pot Filler & Sink', 'Pot filler + farmhouse sink + faucet', 1, 'lot', 1000, 500),
      li('Lighting', 'Under-cabinet + pendants + recessed', 1, 'lot', 388, 2710),
    ]
  ),
  room('master_bath', 'Master Bathroom', IMG.harborMasterBath, 'full', 20000, 9000,
    'Luxury coastal master bath. Full gut. Heated marble tile floor. Oversized walk-in shower with marble walls and rain head. Freestanding tub. Custom double vanity. LED mirrors. Heated towel bar.',
    [
      li('Heated Marble Floor', 'Marble + radiant heat, 75 sqft', 75, 'sqft', 3000, 1500),
      li('Walk-in Shower', 'Marble walls, frameless glass, rain head', 1, 'lot', 6000, 3000),
      li('Freestanding Tub', 'Acrylic soaking tub + faucet', 1, 'ea', 2500, 700),
      li('Custom Vanity', '72" double vanity, marble top', 1, 'ea', 4000, 1200),
      li('LED Mirrors', 'Backlit mirrors (2)', 2, 'ea', 1200, 400),
      li('Accessories', 'Heated towel bar, hooks, TP holder', 1, 'lot', 700, 300),
      li('Plumbing & Paint', 'New lines, exhaust, paint', 1, 'lot', 2600, 1900),
    ]
  ),
  room('full_bath', 'Full Bathroom', IMG.harborFullBath, 'full', 13000, 6000,
    'Luxury coastal full bath. Porcelain tile floor and shower. Frameless glass door. 48" vanity with quartz top. New toilet. Brushed gold fixtures. LED mirror.',
    [
      li('Tile Floor & Shower', 'Porcelain tile, 65 sqft', 65, 'sqft', 3250, 1625),
      li('Frameless Glass', 'Custom frameless door', 1, 'ea', 1500, 500),
      li('Vanity', '48" vanity, quartz top', 1, 'ea', 2200, 600),
      li('Toilet', 'Elongated comfort-height', 1, 'ea', 400, 220),
      li('Fixtures', 'Brushed gold faucet, shower, accessories', 1, 'lot', 800, 300),
      li('LED Mirror', 'Backlit LED mirror', 1, 'ea', 550, 200),
      li('Paint & Trim', 'Walls, ceiling, baseboards', 1, 'lot', 4300, 2555),
    ]
  ),
  room('half_bath', 'Half Bath / Powder Room', IMG.harborHalfBath, 'full', 7500, 3200,
    'Luxury coastal powder room. Floating vanity with vessel sink. Wall-mount faucet. Shell-inspired accent tile. Patterned floor tile. Round mirror. Designer sconces.',
    [
      li('Floating Vanity', 'Teak floating vanity + vessel sink', 1, 'ea', 2000, 600),
      li('Wall-Mount Faucet', 'Brushed gold wall-mount', 1, 'ea', 400, 300),
      li('Accent Tile', 'Shell-inspired mosaic accent wall', 1, 'lot', 1600, 700),
      li('Floor Tile', 'Patterned cement tile, 22 sqft', 22, 'sqft', 1100, 440),
      li('Toilet', 'Wall-hung toilet', 1, 'ea', 600, 300),
      li('Mirror & Sconces', 'Round mirror + brass sconces', 1, 'lot', 700, 250),
      li('Paint', 'Walls, ceiling', 1, 'lot', 1100, 610),
    ]
  ),
  room('living_room', 'Living Room', IMG.harborLivingRoom, 'full', 15000, 6500,
    'Luxury coastal living room. Wide-plank white oak floors. Shiplap accent wall. Linear gas fireplace. Built-in shelving. Coffered ceiling detail. Premium paint. Motorized shades.',
    [
      li('White Oak Floor', 'Wide-plank, 380 sqft', 380, 'sqft', 4560, 2280),
      li('Shiplap Wall', 'Shiplap accent wall', 1, 'lot', 1500, 600),
      li('Linear Fireplace', '48" linear gas fireplace', 1, 'lot', 4000, 1500),
      li('Built-in Shelving', 'Custom built-in shelves', 1, 'lot', 2200, 800),
      li('Coffered Ceiling', 'Coffered ceiling detail', 1, 'lot', 1500, 700),
      li('Paint & Shades', 'Premium paint + motorized shades', 1, 'lot', 1240, 620),
    ]
  ),
  room('bedroom', 'Bedroom (Primary)', IMG.harborBedroom, 'moderate', 10000, 4200,
    'Luxury coastal primary bedroom. White oak hardwood. Custom walk-in closet. Shiplap accent wall. Premium ceiling fan. Motorized blackout shades. Crown molding.',
    [
      li('White Oak Floor', 'Wide-plank, 260 sqft', 260, 'sqft', 3120, 1560),
      li('Custom Closet', 'Built-in closet system', 1, 'lot', 3500, 1200),
      li('Shiplap Wall', 'Accent wall', 1, 'lot', 1200, 400),
      li('Ceiling Fan', 'Premium coastal fan', 1, 'ea', 450, 200),
      li('Motorized Shades', 'Blackout shades (3)', 3, 'ea', 900, 240),
      li('Crown & Paint', 'Crown molding + paint', 1, 'lot', 830, 600),
    ]
  ),
  room('garage', 'Garage', IMG.harborGarage, 'moderate', 6500, 3200,
    'Luxury two-car garage. Polyaspartic floor coating. Custom cabinet storage. LED recessed lighting. Smart garage openers. Finished walls.',
    [
      li('Polyaspartic Floor', 'Professional coating, 500 sqft', 500, 'sqft', 2000, 1000),
      li('Custom Cabinets', 'Wall cabinets + workbench', 1, 'lot', 1800, 700),
      li('LED Lighting', 'Recessed cans (8)', 8, 'ea', 480, 320),
      li('Smart Openers', 'WiFi openers (2)', 2, 'ea', 500, 200),
      li('Finished Walls', 'Drywall + paint', 1, 'lot', 1720, 980),
    ]
  ),
  room('landscaping', 'Landscaping & Exterior', IMG.harborLandscaping, 'moderate', 12000, 5000,
    'Luxury coastal landscaping. Professional design with coastal plantings. Paver walkway. Landscape lighting. Irrigation. New front door. Exterior paint touch-up.',
    [
      li('Landscape Design', 'Coastal plantings + hardscape', 1, 'lot', 4500, 1800),
      li('Paver Walkway', 'Travertine pavers, 120 sqft', 120, 'sqft', 2400, 960),
      li('Landscape Lighting', 'LED path + accent lights', 1, 'lot', 1500, 500),
      li('Irrigation', 'Smart irrigation system', 1, 'lot', 1200, 500),
      li('Front Door', 'Coastal-style entry door', 1, 'ea', 1000, 500),
      li('Paint Touch-up', 'Exterior trim + touch-up', 1, 'lot', 1400, 740),
    ]
  ),
  room('roof', 'Roof & Gutters', IMG.harborRoof, 'full', 20000, 9000,
    'Premium coastal roof. Tear off. Impact-resistant architectural shingles. Enhanced underlayment for coastal weather. All new flashing. Seamless gutters with leaf guards. Hurricane clips.',
    [
      li('Tear-off', 'Remove existing, 2400 sqft', 2400, 'sqft', 1200, 2400),
      li('Enhanced Underlayment', 'Peel-and-stick + synthetic', 2400, 'sqft', 2400, 1200),
      li('Impact Shingles', 'Impact-resistant architectural, 2400 sqft', 2400, 'sqft', 8400, 2400),
      li('Hurricane Clips', 'Simpson hurricane ties', 1, 'lot', 1200, 600),
      li('Flashing', 'All new flashing', 1, 'lot', 1000, 500),
      li('Gutters', 'Seamless + leaf guards, 160 lin ft', 160, 'lin ft', 3200, 1000),
      li('Downspouts', 'Aluminum (6)', 6, 'ea', 2600, 900),
    ]
  ),
];

// Property 7: 1122 Elm St — Rental Duplex
const elmStRooms: SOWRoomTemplate[] = [
  room('kitchen', 'Kitchen', IMG.elmKitchen, 'moderate', 4800, 2800,
    'Rental duplex kitchen (per unit). Paint cabinets. New laminate countertops. Vinyl plank flooring. Replace faucet and sink. Basic appliances. New light fixture. Paint.',
    [
      li('Cabinet Paint', 'Paint existing cabinets white', 1, 'lot', 500, 600),
      li('Laminate Counters', 'Post-form laminate, 20 lin ft', 20, 'lin ft', 600, 400),
      li('Vinyl Plank', 'Basic LVP, 70 sqft', 70, 'sqft', 280, 280),
      li('Sink & Faucet', 'SS single-bowl + faucet', 1, 'ea', 220, 180),
      li('Appliances', 'Basic range + fridge', 1, 'lot', 1400, 200),
      li('Lighting & Paint', 'Light fixture + wall paint', 1, 'lot', 1800, 1140),
    ]
  ),
  room('master_bath', 'Master Bathroom', IMG.elmMasterBath, 'moderate', 3500, 2000,
    'Rental duplex master bath (per unit). Reglaze tub. Tub surround kit. New vanity. New toilet. Chrome fixtures. Vinyl floor. Paint.',
    [
      li('Tub Reglaze', 'Professional reglazing', 1, 'ea', 400, 300),
      li('Tub Surround', 'Acrylic surround kit', 1, 'ea', 300, 250),
      li('Vanity', '30" vanity + top', 1, 'ea', 400, 220),
      li('Toilet', 'Basic toilet', 1, 'ea', 160, 130),
      li('Fixtures', 'Chrome faucet, showerhead', 1, 'lot', 130, 100),
      li('Floor & Paint', 'Vinyl floor + paint', 1, 'lot', 2110, 1000),
    ]
  ),
  room('full_bath', 'Full Bathroom', IMG.elmFullBath, 'moderate', 3000, 1700,
    'Rental duplex full bath. Reglaze tub. New vanity. New toilet. Chrome fixtures. Vinyl floor. Paint.',
    [
      li('Tub Reglaze', 'Reglazing', 1, 'ea', 380, 280),
      li('Vanity', '24" vanity + top', 1, 'ea', 320, 180),
      li('Toilet', 'Basic toilet', 1, 'ea', 140, 120),
      li('Fixtures', 'Chrome faucet, showerhead', 1, 'lot', 110, 80),
      li('Floor & Paint', 'Vinyl + paint', 1, 'lot', 2050, 1040),
    ]
  ),
  room('half_bath', 'Half Bath / Powder Room', IMG.elmHalfBath, 'cosmetic', 1200, 700,
    'Rental duplex powder room. New faucet. Paint. New mirror. Light fixture. Accessories.',
    [
      li('Faucet', 'Chrome faucet', 1, 'ea', 70, 70),
      li('Mirror & Light', 'Basic mirror + light', 1, 'lot', 90, 70),
      li('Accessories', 'Towel bar, TP holder', 1, 'lot', 40, 25),
      li('Paint', 'Walls, ceiling', 1, 'lot', 1000, 535),
    ]
  ),
  room('living_room', 'Living Room', IMG.elmLivingRoom, 'moderate', 2500, 1400,
    'Rental duplex living room (per unit). Vinyl plank flooring. Paint. Ceiling fan. Baseboards. Outlet covers.',
    [
      li('Vinyl Plank', 'Basic LVP, 180 sqft', 180, 'sqft', 720, 540),
      li('Ceiling Fan', 'Basic fan with light', 1, 'ea', 100, 80),
      li('Baseboards', 'MDF, 45 lin ft', 45, 'lin ft', 180, 135),
      li('Paint & Electrical', 'Paint + outlet covers', 1, 'lot', 1500, 645),
    ]
  ),
  room('bedroom', 'Bedroom (Primary)', IMG.elmBedroom, 'moderate', 1800, 1000,
    'Rental duplex bedroom (per unit). Vinyl plank flooring. Paint. Ceiling fan. Closet shelf/rod. Baseboards.',
    [
      li('Vinyl Plank', 'Basic LVP, 130 sqft', 130, 'sqft', 520, 390),
      li('Ceiling Fan', 'Basic fan', 1, 'ea', 90, 70),
      li('Closet', 'Wire shelf + rod', 1, 'lot', 70, 50),
      li('Paint & Baseboards', 'Paint + MDF baseboards', 1, 'lot', 1120, 490),
    ]
  ),
  room('garage', 'Garage', IMG.elmGarage, 'cosmetic', 1000, 600,
    'Rental duplex garage. Sweep and seal floor. Basic lighting. Weatherstripping.',
    [
      li('Floor Seal', 'Concrete sealer', 1, 'lot', 250, 150),
      li('Lighting', 'LED shop light (2)', 2, 'ea', 70, 50),
      li('Weatherstripping', 'Door seals', 1, 'lot', 680, 400),
    ]
  ),
  room('landscaping', 'Landscaping & Exterior', IMG.elmLandscaping, 'moderate', 2200, 1100,
    'Rental duplex exterior. Power wash. Paint front doors. Mulch. Trim shrubs. Porch lights. Basic lawn care.',
    [
      li('Power Wash', 'Siding + walkways', 1, 'lot', 200, 150),
      li('Paint Doors', 'Paint both front doors', 1, 'lot', 120, 100),
      li('Mulch & Trim', 'Mulch + shrub trimming', 1, 'lot', 400, 250),
      li('Porch Lights', 'New fixtures (2)', 2, 'ea', 100, 60),
      li('Lawn', 'Mow, edge, fertilize', 1, 'lot', 1380, 540),
    ]
  ),
  room('roof', 'Roof & Gutters', IMG.elmRoof, 'full', 8000, 3800,
    'Rental duplex roof. Tear off. 3-tab shingles. Basic underlayment. Flashing. Clean gutters. Downspout extensions.',
    [
      li('Tear-off', 'Remove shingles, 1400 sqft', 1400, 'sqft', 700, 1200),
      li('Underlayment', 'Standard felt', 1400, 'sqft', 700, 450),
      li('3-Tab Shingles', 'Basic asphalt, 1400 sqft', 1400, 'sqft', 4200, 1400),
      li('Flashing', 'Replace flashing', 1, 'lot', 450, 250),
      li('Gutters', 'Clean + repair', 1, 'lot', 200, 150),
      li('Downspouts', 'Extensions (4)', 4, 'ea', 1750, 350),
    ]
  ),
];

// Property 8: 5500 Summit Ridge — Luxury Mediterranean
const summitRidgeRooms: SOWRoomTemplate[] = [
  room('kitchen', 'Kitchen', IMG.summitKitchen, 'full', 38000, 16000,
    'Luxury Mediterranean kitchen. Full gut. Custom glazed cabinets with ornate hardware. Natural stone countertops. Tumbled travertine backsplash. Terracotta-look porcelain floor. Professional appliance suite with 60" range. Copper farmhouse sink. Custom tile range hood. Wine storage.',
    [
      li('Custom Glazed Cabinets', 'Ornate glazed, 30 lin ft', 30, 'lin ft', 15000, 5000),
      li('Stone Countertops', 'Natural granite/travertine, 45 sqft', 45, 'sqft', 5850, 2250),
      li('Travertine Backsplash', 'Tumbled travertine', 38, 'sqft', 1900, 950),
      li('Porcelain Floor', 'Terracotta-look, 140 sqft', 140, 'sqft', 2100, 1120),
      li('Pro Appliances', '60" range, built-in fridge, 2 DW', 1, 'lot', 7000, 1200),
      li('Copper Sink', 'Copper farmhouse + faucet', 1, 'ea', 1500, 500),
      li('Tile Range Hood', 'Custom tile hood', 1, 'ea', 2500, 1000),
      li('Wine Storage & Lighting', 'Built-in wine rack + lighting', 1, 'lot', 2150, 3980),
    ]
  ),
  room('master_bath', 'Master Bathroom', IMG.summitMasterBath, 'full', 24000, 10500,
    'Luxury Mediterranean master bath. Full gut. Travertine floor with radiant heat. Walk-in shower with natural stone walls. Soaking tub with stone surround. Custom arched vanity. Wrought iron mirrors. Bronze fixtures.',
    [
      li('Travertine Floor', 'Heated travertine, 85 sqft', 85, 'sqft', 4250, 2125),
      li('Stone Shower', 'Natural stone walls, frameless glass', 1, 'lot', 7000, 3500),
      li('Soaking Tub', 'Stone surround soaking tub', 1, 'ea', 3500, 1000),
      li('Custom Vanity', 'Arched double vanity, stone top', 1, 'ea', 4500, 1200),
      li('Mirrors', 'Wrought iron framed mirrors (2)', 2, 'ea', 1200, 350),
      li('Bronze Fixtures', 'Oil-rubbed bronze throughout', 1, 'lot', 1000, 400),
      li('Plumbing & Paint', 'New lines, exhaust, paint', 1, 'lot', 2550, 1925),
    ]
  ),
  room('full_bath', 'Full Bathroom', IMG.summitFullBath, 'full', 15000, 7000,
    'Luxury Mediterranean full bath. Travertine floor and shower. Arched shower entry. Custom vanity. Bronze fixtures. Decorative tile accents.',
    [
      li('Travertine Floor & Shower', 'Travertine, 70 sqft', 70, 'sqft', 4200, 2100),
      li('Arched Entry', 'Arched shower opening + glass', 1, 'lot', 2500, 1200),
      li('Custom Vanity', '42" vanity, stone top', 1, 'ea', 2800, 800),
      li('Toilet', 'Elongated comfort-height', 1, 'ea', 400, 220),
      li('Bronze Fixtures', 'Faucet, shower, accessories', 1, 'lot', 800, 350),
      li('Tile Accents & Paint', 'Decorative tile + paint', 1, 'lot', 4300, 2330),
    ]
  ),
  room('half_bath', 'Half Bath / Powder Room', IMG.summitHalfBath, 'full', 8500, 3800,
    'Luxury Mediterranean powder room. Vessel sink on wrought iron stand. Wall-mount faucet. Mosaic tile accent. Terracotta floor tile. Ornate mirror. Sconce lighting.',
    [
      li('Vessel Sink Stand', 'Wrought iron + copper vessel', 1, 'ea', 2200, 700),
      li('Wall-Mount Faucet', 'Oil-rubbed bronze', 1, 'ea', 450, 300),
      li('Mosaic Accent', 'Mediterranean mosaic tile', 1, 'lot', 1800, 800),
      li('Terracotta Floor', 'Terracotta tile, 22 sqft', 22, 'sqft', 880, 440),
      li('Mirror & Sconces', 'Ornate mirror + iron sconces', 1, 'lot', 900, 300),
      li('Toilet & Paint', 'Toilet + paint', 1, 'lot', 2270, 1260),
    ]
  ),
  room('living_room', 'Living Room', IMG.summitLivingRoom, 'full', 20000, 8500,
    'Luxury Mediterranean living room. Hardwood floors with inlay borders. Stone fireplace with arched opening. Coffered ceiling with exposed beams. Built-in arched bookcases. Iron chandelier. Crown molding.',
    [
      li('Hardwood with Inlay', 'Oak + walnut inlay, 420 sqft', 420, 'sqft', 5880, 3360),
      li('Stone Fireplace', 'Natural stone + arched opening', 1, 'lot', 5500, 2000),
      li('Coffered Ceiling', 'Coffered + exposed beams', 1, 'lot', 3500, 1500),
      li('Arched Bookcases', 'Built-in arched shelving (2)', 2, 'units', 2500, 800),
      li('Iron Chandelier', 'Wrought iron chandelier', 1, 'ea', 1200, 200),
      li('Crown & Paint', 'Crown molding + premium paint', 1, 'lot', 1420, 640),
    ]
  ),
  room('bedroom', 'Bedroom (Primary)', IMG.summitBedroom, 'moderate', 12000, 5000,
    'Luxury Mediterranean primary bedroom. Hardwood floors. Custom walk-in closet. Accent wall with Venetian plaster. Premium ceiling fan. Crown molding. Motorized shades.',
    [
      li('Hardwood Floor', 'Oak hardwood, 280 sqft', 280, 'sqft', 3360, 1960),
      li('Custom Closet', 'Built-in closet system', 1, 'lot', 4000, 1400),
      li('Venetian Plaster', 'Accent wall', 1, 'lot', 2000, 600),
      li('Ceiling Fan', 'Mediterranean-style fan', 1, 'ea', 500, 200),
      li('Crown & Paint', 'Crown molding + paint', 1, 'lot', 1200, 500),
      li('Motorized Shades', 'Blackout shades (4)', 4, 'ea', 940, 340),
    ]
  ),
  room('garage', 'Garage', IMG.summitGarage, 'moderate', 7000, 3500,
    'Luxury three-car garage. Polyaspartic floor. Custom cabinet system. LED recessed lighting. Smart openers (3). Finished walls. EV charger.',
    [
      li('Polyaspartic Floor', 'Professional, 750 sqft', 750, 'sqft', 3000, 1500),
      li('Custom Cabinets', 'Full cabinet system', 1, 'lot', 1800, 700),
      li('LED Lighting', 'Recessed cans (10)', 10, 'ea', 600, 400),
      li('Smart Openers', 'WiFi openers (3)', 3, 'ea', 750, 300),
      li('EV Charger', '240V outlet + charger', 1, 'ea', 500, 300),
      li('Finished Walls', 'Drywall + paint', 1, 'lot', 350, 300),
    ]
  ),
  room('landscaping', 'Landscaping & Exterior', IMG.summitLandscaping, 'moderate', 14000, 6000,
    'Luxury Mediterranean landscaping. Professional design with Mediterranean plantings. Flagstone walkway. Wrought iron gate. Landscape lighting. Irrigation. Stucco repair. Tile roof touch-up.',
    [
      li('Landscape Design', 'Mediterranean plantings + olive trees', 1, 'lot', 5000, 2000),
      li('Flagstone Walkway', 'Natural flagstone, 180 sqft', 180, 'sqft', 3600, 1440),
      li('Iron Gate', 'Wrought iron entry gate', 1, 'ea', 1800, 600),
      li('Landscape Lighting', 'LED accent + path lights', 1, 'lot', 1500, 500),
      li('Irrigation', 'Drip irrigation system', 1, 'lot', 1200, 500),
      li('Stucco & Roof', 'Stucco repair + tile touch-up', 1, 'lot', 900, 960),
    ]
  ),
  room('roof', 'Roof & Gutters', IMG.summitRoof, 'full', 25000, 11000,
    'Premium Mediterranean roof. Tear off. Clay tile roofing. Enhanced underlayment. All new copper flashing. Half-round copper gutters. Decorative downspouts.',
    [
      li('Tear-off', 'Remove existing, 3000 sqft', 3000, 'sqft', 1500, 3000),
      li('Underlayment', 'Enhanced peel-and-stick', 3000, 'sqft', 3000, 1500),
      li('Clay Tile', 'Authentic clay tile, 3000 sqft', 3000, 'sqft', 12000, 3600),
      li('Copper Flashing', 'All copper flashing', 1, 'lot', 2000, 800),
      li('Copper Gutters', 'Half-round copper, 200 lin ft', 200, 'lin ft', 4000, 1200),
      li('Decorative Downspouts', 'Copper (8)', 8, 'ea', 2500, 900),
    ]
  ),
];

// Property 9: 234 Birch Ln — Standard Cape Cod
const birchLnRooms: SOWRoomTemplate[] = [
  room('kitchen', 'Kitchen', IMG.birchKitchen, 'full', 13000, 6000,
    'Standard Cape Cod kitchen. Demo existing. White shaker cabinets. Granite countertops. Subway tile backsplash. LVP flooring. Stainless appliance package. Undermount sink. Pendant lights.',
    [
      li('White Shaker Cabinets', '22 lin ft', 22, 'lin ft', 4400, 1760),
      li('Granite Counters', 'Level 2, 32 sqft', 32, 'sqft', 2560, 1120),
      li('Subway Backsplash', 'White subway, 28 sqft', 28, 'sqft', 560, 336),
      li('LVP Floor', '90 sqft', 90, 'sqft', 450, 360),
      li('Appliances', 'SS package', 1, 'lot', 2800, 350),
      li('Sink & Faucet', 'Undermount + pull-down', 1, 'ea', 400, 220),
      li('Lighting & Paint', 'Pendants + recessed + paint', 1, 'lot', 1830, 1854),
    ]
  ),
  room('master_bath', 'Master Bathroom', IMG.birchMasterBath, 'full', 9500, 4800,
    'Standard Cape Cod master bath. Porcelain tile floor. Tiled shower with glass door. 48" vanity with granite top. New toilet. Chrome fixtures. Beadboard wainscoting.',
    [
      li('Tile Floor', 'Porcelain, 55 sqft', 55, 'sqft', 1100, 825),
      li('Tiled Shower', 'Tile + glass door + niche', 1, 'lot', 3000, 1500),
      li('Vanity', '48" vanity, granite top', 1, 'ea', 1800, 600),
      li('Toilet', 'Elongated', 1, 'ea', 320, 180),
      li('Fixtures', 'Chrome faucet, shower, accessories', 1, 'lot', 500, 250),
      li('Beadboard & Paint', 'Beadboard wainscoting + paint', 1, 'lot', 2780, 1445),
    ]
  ),
  room('full_bath', 'Full Bathroom', IMG.birchFullBath, 'full', 7000, 3500,
    'Standard Cape Cod full bath. Tile floor and tub surround. New alcove tub. 30" vanity. New toilet. Chrome fixtures. Beadboard.',
    [
      li('Tile Floor & Surround', 'Ceramic tile', 1, 'lot', 2000, 1100),
      li('Alcove Tub', '60" tub', 1, 'ea', 800, 400),
      li('Vanity', '30" vanity, granite top', 1, 'ea', 1000, 350),
      li('Toilet', 'Standard', 1, 'ea', 260, 160),
      li('Fixtures', 'Chrome faucet, shower', 1, 'lot', 300, 180),
      li('Beadboard & Paint', 'Wainscoting + paint', 1, 'lot', 2640, 1310),
    ]
  ),
  room('half_bath', 'Half Bath / Powder Room', IMG.birchHalfBath, 'moderate', 3800, 1900,
    'Standard Cape Cod powder room. New pedestal sink. New toilet. Beadboard wainscoting. Tile floor. Mirror and light.',
    [
      li('Pedestal Sink', 'Pedestal + faucet', 1, 'ea', 500, 300),
      li('Toilet', 'Standard', 1, 'ea', 240, 140),
      li('Beadboard', 'Wainscoting', 1, 'lot', 600, 300),
      li('Tile Floor', 'Hex tile, 18 sqft', 18, 'sqft', 360, 216),
      li('Mirror & Light', 'Framed mirror + sconce', 1, 'lot', 280, 150),
      li('Paint', 'Walls, ceiling', 1, 'lot', 1820, 794),
    ]
  ),
  room('living_room', 'Living Room', IMG.birchLivingRoom, 'moderate', 5500, 2800,
    'Standard Cape Cod living room. Refinish hardwood floors. Crown molding. Ceiling fan. Fireplace mantel update. Paint.',
    [
      li('Hardwood Refinish', '260 sqft', 260, 'sqft', 2080, 1300),
      li('Crown Molding', '55 lin ft', 55, 'lin ft', 550, 330),
      li('Ceiling Fan', 'Standard fan', 1, 'ea', 220, 130),
      li('Fireplace Mantel', 'New wood mantel', 1, 'ea', 600, 250),
      li('Paint & Trim', 'Walls, ceiling, trim', 1, 'lot', 2050, 790),
    ]
  ),
  room('bedroom', 'Bedroom (Primary)', IMG.birchBedroom, 'moderate', 4200, 2100,
    'Standard Cape Cod primary bedroom. Refinish hardwood. Closet organizer. Ceiling fan. Crown molding. Paint. Window treatments.',
    [
      li('Hardwood Refinish', '200 sqft', 200, 'sqft', 1600, 1000),
      li('Closet Organizer', 'Wire system', 1, 'lot', 450, 225),
      li('Ceiling Fan', 'Standard fan', 1, 'ea', 200, 130),
      li('Crown Molding', '45 lin ft', 45, 'lin ft', 450, 270),
      li('Paint & Treatments', 'Paint + blinds', 1, 'lot', 1500, 475),
    ]
  ),
  room('garage', 'Garage', IMG.birchGarage, 'moderate', 3200, 1700,
    'Standard one-car garage. Epoxy floor. Shelving. LED lights. Insulate door. Weatherstripping.',
    [
      li('Epoxy Floor', '250 sqft', 250, 'sqft', 750, 375),
      li('Shelving', 'Wall shelves (2)', 2, 'ea', 300, 150),
      li('LED Lights', 'Shop lights (2)', 2, 'ea', 140, 80),
      li('Insulation', 'Door insulation kit', 1, 'ea', 150, 75),
      li('Weatherstripping', 'Seals', 1, 'lot', 1860, 1020),
    ]
  ),
  room('landscaping', 'Landscaping & Exterior', IMG.birchLandscaping, 'moderate', 5000, 2400,
    'Standard Cape Cod exterior. Power wash. Paint shutters and door. Mulch beds. Foundation plantings. Path lights. Lawn repair.',
    [
      li('Power Wash', 'Full exterior', 1, 'lot', 250, 200),
      li('Exterior Paint', 'Shutters + door', 1, 'lot', 400, 300),
      li('Mulch & Plants', 'Mulch + shrubs + flowers', 1, 'lot', 1800, 700),
      li('Path Lights', 'Solar lights (6)', 6, 'ea', 240, 100),
      li('Lawn', 'Overseed + fertilize', 1, 'lot', 2310, 1100),
    ]
  ),
  room('roof', 'Roof & Gutters', IMG.birchRoof, 'full', 11000, 5000,
    'Standard roof replacement. Tear off. Architectural shingles. Underlayment. Ridge vent. Flashing. Gutters and downspouts.',
    [
      li('Tear-off', '1600 sqft', 1600, 'sqft', 800, 1440),
      li('Underlayment', 'Synthetic felt', 1600, 'sqft', 1120, 560),
      li('Architectural Shingles', 'GAF Timberline, 1600 sqft', 1600, 'sqft', 4800, 1600),
      li('Ridge Vent', 'Continuous', 1, 'lot', 380, 190),
      li('Flashing', 'All flashing', 1, 'lot', 750, 375),
      li('Gutters & Downspouts', 'Seamless aluminum, 110 lin ft', 110, 'lin ft', 3150, 835),
    ]
  ),
];

// Property 10: 4100 Willow Creek Way — Luxury Farmhouse
const willowCreekRooms: SOWRoomTemplate[] = [
  room('kitchen', 'Kitchen', IMG.willowKitchen, 'full', 28000, 12000,
    'Luxury modern farmhouse kitchen. Full gut. Two-tone cabinets (white uppers, navy base) with brass hardware. Honed marble countertops. Shiplap backsplash. Wide-plank reclaimed-look hardwood. Professional appliances. Farmhouse sink. Open shelving. Barn-style pendants.',
    [
      li('Two-Tone Cabinets', 'White + navy, brass hardware, 28 lin ft', 28, 'lin ft', 11200, 4200),
      li('Honed Marble Counters', 'Honed marble, 40 sqft', 40, 'sqft', 4800, 1600),
      li('Shiplap Backsplash', 'Painted shiplap', 30, 'sqft', 600, 450),
      li('Reclaimed Hardwood', 'Wide-plank, 115 sqft', 115, 'sqft', 1725, 920),
      li('Pro Appliances', '48" range, French-door fridge, DW', 1, 'lot', 5200, 800),
      li('Farmhouse Sink', 'Fireclay + bridge faucet', 1, 'ea', 900, 400),
      li('Open Shelving', 'Reclaimed wood shelves (2)', 2, 'ea', 600, 200),
      li('Barn Pendants & Lighting', 'Barn pendants + recessed', 1, 'lot', 2975, 3430),
    ]
  ),
  room('master_bath', 'Master Bathroom', IMG.willowMasterBath, 'full', 18000, 8000,
    'Luxury farmhouse master bath. Full gut. Heated tile floor. Walk-in shower with shiplap-look tile. Clawfoot tub. Custom double vanity with marble top. Round mirrors. Brass fixtures. Board-and-batten walls.',
    [
      li('Heated Tile Floor', 'Porcelain + radiant heat, 70 sqft', 70, 'sqft', 2800, 1400),
      li('Walk-in Shower', 'Shiplap-look tile, glass door', 1, 'lot', 5000, 2500),
      li('Clawfoot Tub', 'Cast iron clawfoot + faucet', 1, 'ea', 2500, 700),
      li('Custom Vanity', '66" double vanity, marble top', 1, 'ea', 3500, 1000),
      li('Round Mirrors', 'Brass-frame round mirrors (2)', 2, 'ea', 800, 250),
      li('Brass Fixtures', 'Faucets, shower, accessories', 1, 'lot', 900, 350),
      li('Board-and-Batten & Paint', 'Walls + paint', 1, 'lot', 2500, 1800),
    ]
  ),
  room('full_bath', 'Full Bathroom', IMG.willowFullBath, 'full', 11000, 5000,
    'Luxury farmhouse full bath. Tile floor. Tub/shower combo with subway tile. 42" vanity with marble top. New toilet. Brass fixtures. Board-and-batten.',
    [
      li('Tile Floor', 'Porcelain, 50 sqft', 50, 'sqft', 1500, 750),
      li('Tub & Subway Tile', 'Alcove tub + subway surround', 1, 'lot', 2800, 1400),
      li('Vanity', '42" vanity, marble top', 1, 'ea', 2000, 650),
      li('Toilet', 'Elongated', 1, 'ea', 380, 200),
      li('Brass Fixtures', 'Faucet, shower, accessories', 1, 'lot', 600, 250),
      li('Board-and-Batten & Paint', 'Walls + paint', 1, 'lot', 3720, 1750),
    ]
  ),
  room('half_bath', 'Half Bath / Powder Room', IMG.willowHalfBath, 'full', 6500, 3000,
    'Luxury farmhouse powder room. Reclaimed wood vanity with vessel sink. Bridge faucet. Shiplap walls. Hex tile floor. Barn-style mirror. Sconce lighting.',
    [
      li('Reclaimed Vanity', 'Reclaimed wood + vessel sink', 1, 'ea', 1800, 600),
      li('Bridge Faucet', 'Brass bridge faucet', 1, 'ea', 350, 200),
      li('Shiplap Walls', 'Full shiplap', 1, 'lot', 1200, 500),
      li('Hex Tile Floor', 'Marble hex, 20 sqft', 20, 'sqft', 800, 400),
      li('Toilet', 'Standard', 1, 'ea', 300, 160),
      li('Mirror & Sconces', 'Barn mirror + sconces', 1, 'lot', 600, 250),
      li('Paint', 'Ceiling + trim', 1, 'lot', 1450, 890),
    ]
  ),
  room('living_room', 'Living Room', IMG.willowLivingRoom, 'full', 14000, 6000,
    'Luxury farmhouse living room. Wide-plank reclaimed-look hardwood. Stone fireplace with reclaimed beam mantel. Shiplap accent wall. Exposed ceiling beams. Barn-style chandelier. Crown molding.',
    [
      li('Reclaimed Hardwood', 'Wide-plank, 360 sqft', 360, 'sqft', 4320, 2160),
      li('Stone Fireplace', 'Natural stone + reclaimed beam mantel', 1, 'lot', 4500, 1500),
      li('Shiplap Wall', 'Accent wall', 1, 'lot', 1200, 500),
      li('Exposed Beams', 'Decorative ceiling beams', 1, 'lot', 2000, 800),
      li('Barn Chandelier', 'Wrought iron barn chandelier', 1, 'ea', 800, 200),
      li('Crown & Paint', 'Crown molding + paint', 1, 'lot', 1180, 840),
    ]
  ),
  room('bedroom', 'Bedroom (Primary)', IMG.willowBedroom, 'moderate', 10000, 4200,
    'Luxury farmhouse primary bedroom. Reclaimed-look hardwood. Custom walk-in closet. Shiplap accent wall. Barn-style ceiling fan. Board-and-batten wainscoting. Motorized shades.',
    [
      li('Hardwood Floor', 'Reclaimed-look, 260 sqft', 260, 'sqft', 3120, 1560),
      li('Custom Closet', 'Built-in system', 1, 'lot', 3500, 1200),
      li('Shiplap Wall', 'Accent wall', 1, 'lot', 1000, 400),
      li('Ceiling Fan', 'Barn-style fan', 1, 'ea', 400, 180),
      li('Board-and-Batten', 'Wainscoting', 1, 'lot', 800, 350),
      li('Paint & Shades', 'Paint + motorized shades', 1, 'lot', 1180, 510),
    ]
  ),
  room('garage', 'Garage', IMG.willowGarage, 'moderate', 6000, 3000,
    'Luxury farmhouse garage. Polyaspartic floor. Custom storage. LED lighting. Smart openers (2). Finished walls with board-and-batten.',
    [
      li('Polyaspartic Floor', '500 sqft', 500, 'sqft', 2000, 1000),
      li('Custom Storage', 'Cabinets + workbench', 1, 'lot', 1500, 600),
      li('LED Lighting', 'Recessed (8)', 8, 'ea', 480, 320),
      li('Smart Openers', 'WiFi openers (2)', 2, 'ea', 500, 200),
      li('Board-and-Batten & Paint', 'Finished walls', 1, 'lot', 1520, 880),
    ]
  ),
  room('landscaping', 'Landscaping & Exterior', IMG.willowLandscaping, 'moderate', 11000, 4800,
    'Luxury farmhouse landscaping. Professional design with cottage garden plantings. Stone walkway. Picket fence section. Landscape lighting. Irrigation. Barn-style exterior fixtures.',
    [
      li('Landscape Design', 'Cottage garden + native plantings', 1, 'lot', 4000, 1600),
      li('Stone Walkway', 'Natural stone, 140 sqft', 140, 'sqft', 2800, 1120),
      li('Picket Fence', 'Cedar picket fence section', 1, 'lot', 1500, 500),
      li('Landscape Lighting', 'LED path + accent', 1, 'lot', 1200, 500),
      li('Irrigation', 'Smart system', 1, 'lot', 1000, 400),
      li('Exterior Fixtures', 'Barn-style lights + accessories', 1, 'lot', 500, 680),
    ]
  ),
  room('roof', 'Roof & Gutters', IMG.willowRoof, 'full', 18000, 8000,
    'Premium farmhouse roof. Tear off. Architectural shingles in weathered wood. Enhanced underlayment. Ridge vent. Copper flashing accents. Half-round gutters. Decorative downspouts.',
    [
      li('Tear-off', '2200 sqft', 2200, 'sqft', 1100, 2200),
      li('Underlayment', 'Enhanced synthetic', 2200, 'sqft', 1540, 770),
      li('Architectural Shingles', 'Weathered wood, 2200 sqft', 2200, 'sqft', 7700, 2200),
      li('Ridge Vent', 'Continuous', 1, 'lot', 500, 250),
      li('Copper Flashing', 'Accent copper flashing', 1, 'lot', 1500, 600),
      li('Half-Round Gutters', '160 lin ft', 160, 'lin ft', 3200, 1000),
      li('Decorative Downspouts', '(6)', 6, 'ea', 2460, 980),
    ]
  ),
];

// ============================================================
// PROPERTY 11: 789 Pine Hollow Rd — Rental Ranch
// ============================================================
const pineHollowRooms: SOWRoomTemplate[] = [
  room('kitchen', 'Kitchen', IMG.pineKitchen, 'moderate', 5000, 3000,
    'Rental ranch kitchen update. Paint existing cabinets white with new chrome hardware. New laminate countertops. Vinyl plank flooring. Replace faucet. New light fixture. Paint walls. Basic appliance replacement.',
    [
      li('Cabinet Paint & Hardware', 'Paint white + chrome pulls', 1, 'lot', 550, 750),
      li('Laminate Counters', 'Post-form laminate, 22 lin ft', 22, 'lin ft', 660, 440),
      li('Vinyl Plank', 'Basic LVP, 85 sqft', 85, 'sqft', 340, 340),
      li('Sink & Faucet', 'SS sink + basic faucet', 1, 'ea', 230, 180),
      li('Appliances', 'Basic range + dishwasher', 1, 'lot', 1100, 200),
      li('Lighting & Paint', 'Light fixture + paint', 1, 'lot', 1120, 1090),
    ]
  ),
  room('master_bath', 'Master Bathroom', IMG.pineMasterBath, 'moderate', 3500, 2000,
    'Rental ranch master bath. Reglaze tub. Tub surround kit. New vanity with top. New toilet. Chrome fixtures. Vinyl floor. Paint.',
    [
      li('Tub Reglaze', 'Professional reglazing', 1, 'ea', 380, 320),
      li('Tub Surround', 'Acrylic kit', 1, 'ea', 320, 280),
      li('Vanity', '30" vanity + top', 1, 'ea', 420, 230),
      li('Toilet', 'Basic toilet', 1, 'ea', 170, 140),
      li('Fixtures', 'Chrome faucet, showerhead', 1, 'lot', 140, 110),
      li('Floor & Paint', 'Vinyl + paint', 1, 'lot', 2070, 920),
    ]
  ),
  room('full_bath', 'Full Bathroom', IMG.pineFullBath, 'moderate', 3000, 1700,
    'Rental ranch full bath. Reglaze tub. New vanity. New toilet. Chrome fixtures. Vinyl floor. Paint.',
    [
      li('Tub Reglaze', 'Reglazing', 1, 'ea', 370, 280),
      li('Vanity', '24" vanity + top', 1, 'ea', 330, 190),
      li('Toilet', 'Basic toilet', 1, 'ea', 150, 120),
      li('Fixtures', 'Chrome faucet, showerhead', 1, 'lot', 120, 90),
      li('Floor & Paint', 'Vinyl + paint', 1, 'lot', 2030, 1020),
    ]
  ),
  room('half_bath', 'Half Bath / Powder Room', IMG.pineHalfBath, 'cosmetic', 1400, 850,
    'Rental ranch powder room. New faucet. Paint. New mirror. Light fixture. Accessories.',
    [
      li('Faucet', 'Chrome faucet', 1, 'ea', 75, 75),
      li('Mirror & Light', 'Basic mirror + light', 1, 'lot', 95, 75),
      li('Accessories', 'Towel bar, TP holder', 1, 'lot', 40, 25),
      li('Paint', 'Walls, ceiling', 1, 'lot', 1190, 675),
    ]
  ),
  room('living_room', 'Living Room', IMG.pineLivingRoom, 'moderate', 2600, 1400,
    'Rental ranch living room. Vinyl plank flooring. Paint. Ceiling fan. Baseboards. Outlet covers.',
    [
      li('Vinyl Plank', 'Basic LVP, 190 sqft', 190, 'sqft', 760, 570),
      li('Ceiling Fan', 'Basic fan', 1, 'ea', 110, 90),
      li('Baseboards', 'MDF, 48 lin ft', 48, 'lin ft', 192, 144),
      li('Paint & Electrical', 'Paint + outlet covers', 1, 'lot', 1538, 596),
    ]
  ),
  room('bedroom', 'Bedroom (Primary)', IMG.pineBedroom, 'moderate', 1900, 1050,
    'Rental ranch bedroom. Vinyl plank flooring. Paint. Ceiling fan. Closet shelf/rod. Baseboards.',
    [
      li('Vinyl Plank', 'Basic LVP, 140 sqft', 140, 'sqft', 560, 420),
      li('Ceiling Fan', 'Basic fan', 1, 'ea', 95, 75),
      li('Closet', 'Wire shelf + rod', 1, 'lot', 75, 55),
      li('Paint & Baseboards', 'Paint + MDF baseboards', 1, 'lot', 1170, 500),
    ]
  ),
  room('garage', 'Garage', IMG.pineGarage, 'cosmetic', 1100, 650,
    'Rental ranch garage. Sweep and seal floor. Basic lighting. Weatherstripping.',
    [
      li('Floor Seal', 'Concrete sealer', 1, 'lot', 280, 180),
      li('Lighting', 'LED shop light (2)', 2, 'ea', 75, 55),
      li('Weatherstripping', 'Door seals', 1, 'lot', 745, 415),
    ]
  ),
  room('landscaping', 'Landscaping & Exterior', IMG.pineLandscaping, 'moderate', 2300, 1100,
    'Rental ranch exterior. Power wash. Paint front door. Mulch and edging. Trim shrubs. Porch light. Lawn care.',
    [
      li('Power Wash', 'Siding + walkways', 1, 'lot', 190, 140),
      li('Front Door Paint', 'Paint door', 1, 'lot', 75, 55),
      li('Mulch & Trim', 'Mulch + shrub trimming', 1, 'lot', 280, 190),
      li('Porch Light', 'New fixture', 1, 'ea', 55, 35),
      li('Lawn', 'Mow, edge, fertilize', 1, 'lot', 1700, 680),
    ]
  ),
  room('roof', 'Roof & Gutters', IMG.pineRoof, 'full', 7000, 3300,
    'Rental ranch roof. Tear off. 3-tab shingles. Basic underlayment. Flashing. Clean gutters.',
    [
      li('Tear-off', '1100 sqft', 1100, 'sqft', 550, 950),
      li('Underlayment', 'Standard felt', 1100, 'sqft', 550, 350),
      li('3-Tab Shingles', 'Basic asphalt, 1100 sqft', 1100, 'sqft', 3300, 1100),
      li('Flashing', 'Replace flashing', 1, 'lot', 380, 220),
      li('Gutters', 'Clean + repair', 1, 'lot', 2220, 680),
    ]
  ),
];

// ============================================================
// PROPERTY 12: 6700 Copper Canyon Dr — Standard Contemporary
// ============================================================
const copperCanyonRooms: SOWRoomTemplate[] = [
  room('kitchen', 'Kitchen', IMG.copperKitchen, 'full', 16000, 7500,
    'Standard contemporary kitchen. Demo existing. Flat-panel cabinets in warm gray. Quartz countertops. Large-format tile backsplash. LVP flooring. Stainless appliance package. Undermount sink with matte black faucet. Linear pendant lighting.',
    [
      li('Flat-Panel Cabinets', 'Warm gray slab-front, 26 lin ft', 26, 'lin ft', 5720, 2340),
      li('Quartz Counters', 'White quartz, 38 sqft', 38, 'sqft', 3040, 1520),
      li('Large-Format Backsplash', 'Porcelain tile', 30, 'sqft', 900, 480),
      li('LVP Floor', '105 sqft', 105, 'sqft', 525, 420),
      li('Appliances', 'SS package', 1, 'lot', 3200, 400),
      li('Sink & Faucet', 'Undermount + matte black faucet', 1, 'ea', 480, 250),
      li('Linear Pendant & Lighting', 'Linear pendant + recessed', 1, 'lot', 2135, 2090),
    ]
  ),
  room('master_bath', 'Master Bathroom', IMG.copperMasterBath, 'full', 12000, 5800,
    'Standard contemporary master bath. Large-format porcelain floor. Walk-in shower with linear drain. Floating vanity with quartz top. LED mirror. Matte black fixtures. Exhaust fan.',
    [
      li('Large-Format Floor', 'Porcelain, 65 sqft', 65, 'sqft', 1625, 975),
      li('Walk-in Shower', 'Large tile, linear drain, glass door', 1, 'lot', 4000, 2000),
      li('Floating Vanity', '60" floating, quartz top', 1, 'ea', 2800, 900),
      li('Toilet', 'Elongated', 1, 'ea', 380, 200),
      li('Matte Black Fixtures', 'Faucets, shower, accessories', 1, 'lot', 750, 350),
      li('LED Mirror', 'Backlit LED mirror', 1, 'ea', 500, 200),
      li('Fan & Paint', 'Exhaust fan + paint', 1, 'lot', 1945, 1175),
    ]
  ),
  room('full_bath', 'Full Bathroom', IMG.copperFullBath, 'full', 8500, 4200,
    'Standard contemporary full bath. Porcelain tile floor and shower. Frameless glass door. Floating vanity. Matte black fixtures. LED mirror.',
    [
      li('Tile Floor & Shower', 'Porcelain, 55 sqft', 55, 'sqft', 1650, 825),
      li('Frameless Glass', 'Semi-frameless door', 1, 'ea', 1000, 350),
      li('Floating Vanity', '36" floating, quartz top', 1, 'ea', 1500, 500),
      li('Toilet', 'Standard elongated', 1, 'ea', 320, 180),
      li('Matte Black Fixtures', 'Faucet, shower, accessories', 1, 'lot', 450, 220),
      li('LED Mirror', 'LED mirror', 1, 'ea', 400, 150),
      li('Paint & Fan', 'Paint + exhaust', 1, 'lot', 3180, 1975),
    ]
  ),
  room('half_bath', 'Half Bath / Powder Room', IMG.copperHalfBath, 'moderate', 4800, 2400,
    'Standard contemporary powder room. Wall-hung vanity with vessel sink. Matte black wall-mount faucet. Feature tile wall. Large-format floor tile. Round mirror.',
    [
      li('Wall-Hung Vanity', 'Floating vanity + vessel sink', 1, 'ea', 1200, 450),
      li('Wall-Mount Faucet', 'Matte black', 1, 'ea', 300, 250),
      li('Feature Wall', 'Textured tile accent', 1, 'lot', 1200, 550),
      li('Floor Tile', 'Large-format, 22 sqft', 22, 'sqft', 440, 264),
      li('Toilet', 'Standard', 1, 'ea', 280, 150),
      li('Mirror & Paint', 'Round mirror + paint', 1, 'lot', 1380, 736),
    ]
  ),
  room('living_room', 'Living Room', IMG.copperLivingRoom, 'moderate', 7500, 3500,
    'Standard contemporary living room. LVP flooring. Linear gas fireplace. Floating shelves. Modern ceiling fan. Recessed lighting. Paint.',
    [
      li('LVP Flooring', '320 sqft', 320, 'sqft', 1920, 1280),
      li('Linear Fireplace', '42" linear gas fireplace', 1, 'lot', 3000, 1000),
      li('Floating Shelves', 'Modern floating shelves', 1, 'lot', 600, 250),
      li('Ceiling Fan', 'Modern fan', 1, 'ea', 300, 150),
      li('Lighting & Paint', 'Recessed + paint', 1, 'lot', 1680, 820),
    ]
  ),
  room('bedroom', 'Bedroom (Primary)', IMG.copperBedroom, 'moderate', 5200, 2600,
    'Standard contemporary primary bedroom. LVP flooring. Closet organizer. Modern ceiling fan. Accent wall. Paint. Window treatments.',
    [
      li('LVP Flooring', '230 sqft', 230, 'sqft', 1380, 920),
      li('Closet Organizer', 'Modular system', 1, 'lot', 650, 300),
      li('Ceiling Fan', 'Modern fan', 1, 'ea', 280, 150),
      li('Accent Wall', 'Wood slat or paint accent', 1, 'lot', 800, 350),
      li('Paint & Treatments', 'Paint + blinds', 1, 'lot', 2090, 880),
    ]
  ),
  room('garage', 'Garage', IMG.copperGarage, 'moderate', 4000, 2000,
    'Standard contemporary two-car garage. Epoxy floor. Wall storage system. LED lighting. Smart opener. Weatherstripping.',
    [
      li('Epoxy Floor', '420 sqft', 420, 'sqft', 1260, 630),
      li('Wall Storage', 'Slat wall + shelves', 1, 'lot', 800, 350),
      li('LED Lighting', 'LED shop lights (4)', 4, 'ea', 300, 160),
      li('Smart Opener', 'WiFi opener', 1, 'ea', 280, 140),
      li('Weatherstripping', 'Seals + threshold', 1, 'lot', 1360, 720),
    ]
  ),
  room('landscaping', 'Landscaping & Exterior', IMG.copperLandscaping, 'moderate', 6500, 3000,
    'Standard contemporary exterior. Power wash. Modern exterior paint. Drought-tolerant plantings. Concrete walkway. Modern house numbers. Path lighting. Lawn repair.',
    [
      li('Power Wash', 'Full exterior', 1, 'lot', 250, 200),
      li('Exterior Paint', 'Modern color scheme', 1, 'lot', 800, 500),
      li('Plantings', 'Drought-tolerant + ornamental grasses', 1, 'lot', 2200, 800),
      li('Concrete Walkway', 'Brushed concrete, 80 sqft', 80, 'sqft', 1200, 480),
      li('House Numbers & Lights', 'Modern numbers + path lights', 1, 'lot', 400, 180),
      li('Lawn', 'Repair + fertilize', 1, 'lot', 1650, 840),
    ]
  ),
  room('roof', 'Roof & Gutters', IMG.copperRoof, 'full', 14000, 6500,
    'Standard contemporary roof. Tear off. Architectural shingles. Synthetic underlayment. Ridge vent. Flashing. Seamless gutters with leaf guards.',
    [
      li('Tear-off', '2000 sqft', 2000, 'sqft', 1000, 1800),
      li('Underlayment', 'Synthetic felt', 2000, 'sqft', 1400, 700),
      li('Architectural Shingles', 'GAF Timberline, 2000 sqft', 2000, 'sqft', 6000, 2000),
      li('Ridge Vent', 'Continuous', 1, 'lot', 450, 225),
      li('Flashing', 'All flashing', 1, 'lot', 900, 450),
      li('Gutters & Downspouts', 'Seamless + leaf guards, 150 lin ft', 150, 'lin ft', 4250, 1325),
    ]
  ),
];

// ============================================================
// MASTER PROPERTY LIST
// ============================================================
export const SOW_PROPERTIES: SOWProperty[] = [
  {
    id: 'castle-ave',
    address: '742 Castle Ave',
    city: 'Nashville',
    state: 'TN',
    zip: '37206',
    propertyType: 'Single Family',
    beds: 4,
    baths: 3.5,
    sqft: 2800,
    yearBuilt: 1920,
    purchasePrice: 285000,
    arv: 525000,
    rehabBudget: 138000,
    tier: 'luxury',
    style: 'Victorian',
    heroPhoto: IMG.castleKitchen,
    rooms: castleAveRooms,
  },
  {
    id: 'magnolia-dr',
    address: '1847 Magnolia Dr',
    city: 'Charlotte',
    state: 'NC',
    zip: '28205',
    propertyType: 'Single Family',
    beds: 3,
    baths: 2.5,
    sqft: 1800,
    yearBuilt: 1985,
    purchasePrice: 195000,
    arv: 340000,
    rehabBudget: 70300,
    tier: 'standard',
    style: 'Colonial',
    heroPhoto: IMG.magnoliaKitchen,
    rooms: magnoliaDrRooms,
  },
  {
    id: 'riverside-blvd',
    address: '2100 Riverside Blvd',
    city: 'Austin',
    state: 'TX',
    zip: '78702',
    propertyType: 'Single Family',
    beds: 4,
    baths: 3.5,
    sqft: 3200,
    yearBuilt: 1975,
    purchasePrice: 380000,
    arv: 720000,
    rehabBudget: 179000,
    tier: 'luxury',
    style: 'Modern',
    heroPhoto: IMG.riversideKitchen,
    rooms: riversideBlvdRooms,
  },
  {
    id: 'oakwood-ct',
    address: '456 Oakwood Ct',
    city: 'Memphis',
    state: 'TN',
    zip: '38104',
    propertyType: 'Single Family',
    beds: 2,
    baths: 1.5,
    sqft: 1100,
    yearBuilt: 1955,
    purchasePrice: 72000,
    arv: 135000,
    rehabBudget: 29900,
    tier: 'rental',
    style: 'Bungalow',
    heroPhoto: IMG.oakwoodKitchen,
    rooms: oakwoodCtRooms,
  },
  {
    id: 'peachtree-way',
    address: '3200 Peachtree Way',
    city: 'Atlanta',
    state: 'GA',
    zip: '30312',
    propertyType: 'Single Family',
    beds: 3,
    baths: 2.5,
    sqft: 1900,
    yearBuilt: 1940,
    purchasePrice: 210000,
    arv: 385000,
    rehabBudget: 83300,
    tier: 'standard',
    style: 'Craftsman',
    heroPhoto: IMG.peachtreeKitchen,
    rooms: peachtreeWayRooms,
  },
  {
    id: 'harbor-view',
    address: '890 Harbor View Dr',
    city: 'Charleston',
    state: 'SC',
    zip: '29401',
    propertyType: 'Single Family',
    beds: 4,
    baths: 3.5,
    sqft: 2600,
    yearBuilt: 1960,
    purchasePrice: 320000,
    arv: 595000,
    rehabBudget: 140200,
    tier: 'luxury',
    style: 'Coastal',
    heroPhoto: IMG.harborKitchen,
    rooms: harborViewRooms,
  },
  {
    id: 'elm-st',
    address: '1122 Elm St',
    city: 'Indianapolis',
    state: 'IN',
    zip: '46201',
    propertyType: 'Multi-Family (Duplex)',
    beds: 4,
    baths: 3,
    sqft: 2000,
    yearBuilt: 1948,
    purchasePrice: 95000,
    arv: 175000,
    rehabBudget: 28000,
    tier: 'rental',
    style: 'Duplex',
    heroPhoto: IMG.elmKitchen,
    rooms: elmStRooms,
  },
  {
    id: 'summit-ridge',
    address: '5500 Summit Ridge',
    city: 'Scottsdale',
    state: 'AZ',
    zip: '85251',
    propertyType: 'Single Family',
    beds: 5,
    baths: 4.5,
    sqft: 4200,
    yearBuilt: 1998,
    purchasePrice: 520000,
    arv: 950000,
    rehabBudget: 189500,
    tier: 'luxury',
    style: 'Mediterranean',
    heroPhoto: IMG.summitKitchen,
    rooms: summitRidgeRooms,
  },
  {
    id: 'birch-ln',
    address: '234 Birch Ln',
    city: 'Raleigh',
    state: 'NC',
    zip: '27601',
    propertyType: 'Single Family',
    beds: 3,
    baths: 2,
    sqft: 1600,
    yearBuilt: 1965,
    purchasePrice: 175000,
    arv: 310000,
    rehabBudget: 62200,
    tier: 'standard',
    style: 'Cape Cod',
    heroPhoto: IMG.birchKitchen,
    rooms: birchLnRooms,
  },
  {
    id: 'willow-creek',
    address: '4100 Willow Creek Way',
    city: 'Franklin',
    state: 'TN',
    zip: '37064',
    propertyType: 'Single Family',
    beds: 4,
    baths: 3.5,
    sqft: 2800,
    yearBuilt: 1990,
    purchasePrice: 350000,
    arv: 625000,
    rehabBudget: 141500,
    tier: 'luxury',
    style: 'Modern Farmhouse',
    heroPhoto: IMG.willowKitchen,
    rooms: willowCreekRooms,
  },
  {
    id: 'pine-hollow',
    address: '789 Pine Hollow Rd',
    city: 'Birmingham',
    state: 'AL',
    zip: '35205',
    propertyType: 'Single Family',
    beds: 3,
    baths: 2,
    sqft: 1300,
    yearBuilt: 1960,
    purchasePrice: 82000,
    arv: 155000,
    rehabBudget: 27800,
    tier: 'rental',
    style: 'Ranch',
    heroPhoto: IMG.pineKitchen,
    rooms: pineHollowRooms,
  },
  {
    id: 'copper-canyon',
    address: '6700 Copper Canyon Dr',
    city: 'Denver',
    state: 'CO',
    zip: '80203',
    propertyType: 'Single Family',
    beds: 3,
    baths: 2.5,
    sqft: 2000,
    yearBuilt: 2005,
    purchasePrice: 285000,
    arv: 465000,
    rehabBudget: 88500,
    tier: 'standard',
    style: 'Contemporary',
    heroPhoto: IMG.copperKitchen,
    rooms: copperCanyonRooms,
  },
];

// ─── HELPER FUNCTIONS ────────────────────────────────────────
export function getPropertyById(id: string): SOWProperty | undefined {
  return SOW_PROPERTIES.find(p => p.id === id);
}

export function getPropertiesByTier(tier: 'rental' | 'standard' | 'luxury'): SOWProperty[] {
  return SOW_PROPERTIES.filter(p => p.tier === tier);
}

export function getPropertyTotalRehabCost(property: SOWProperty): number {
  return property.rooms.reduce((sum, r) => sum + r.totalCost, 0);
}

export function applyRegionalToProperty(
  property: SOWProperty,
  materialsFactor: number,
  laborFactor: number
): SOWProperty {
  return {
    ...property,
    rooms: property.rooms.map(r => ({
      ...r,
      materialCost: Math.round(r.materialCost * materialsFactor),
      laborCost: Math.round(r.laborCost * laborFactor),
      totalCost: Math.round(r.materialCost * materialsFactor) + Math.round(r.laborCost * laborFactor),
      lineItems: r.lineItems.map(item => ({
        ...item,
        materialCost: Math.round(item.materialCost * materialsFactor),
        laborCost: Math.round(item.laborCost * laborFactor),
        totalCost: Math.round(item.materialCost * materialsFactor) + Math.round(item.laborCost * laborFactor),
      })),
    })),
    rehabBudget: Math.round(
      property.rooms.reduce((sum, r) => sum + Math.round(r.materialCost * materialsFactor) + Math.round(r.laborCost * laborFactor), 0)
    ),
  };
}

export const ROOM_TYPE_LABELS: Record<string, string> = {
  kitchen: 'Kitchen',
  master_bath: 'Master Bath',
  full_bath: 'Full Bath',
  half_bath: 'Half Bath',
  living_room: 'Living Room',
  bedroom: 'Bedroom',
  garage: 'Garage',
  landscaping: 'Landscaping',
  roof: 'Roof & Gutters',
};

export const ROOM_TYPE_ICONS: Record<string, string> = {
  kitchen: '🍳',
  master_bath: '🛁',
  full_bath: '🚿',
  half_bath: '🚽',
  living_room: '🛋️',
  bedroom: '🛏️',
  garage: '🚗',
  landscaping: '🌳',
  roof: '🏠',
};

export const TIER_LABELS: Record<string, string> = {
  rental: 'Rental Grade',
  standard: 'Standard',
  luxury: 'Luxury',
};

export const TIER_COLORS: Record<string, string> = {
  rental: 'text-emerald-400',
  standard: 'text-blue-400',
  luxury: 'text-amber-400',
};
