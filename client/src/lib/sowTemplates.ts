// Freedom One — SOW Project Templates Library
// Organized by room type with multiple variations per room
// Each template represents a real-world renovation scenario
// ============================================================

export interface SOWTemplate {
  id: string;
  roomType: string;
  name: string;
  layoutType: string;
  costLevel: 1 | 2 | 3 | 4; // 1=Budget, 2=Standard, 3=Premium, 4=Luxury
  photo: string;
  propertyType: string;
  beds: number;
  baths: number;
  sqft: number;
  materialCost: number;
  laborCost: number;
  totalCost: number;
  workDescription: string;
  keyMaterials: string[];
}

// Photo CDN URLs
const PHOTOS = {
  kitchen1: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/YvzfDqQNnBJzSMlW.jpg',
  kitchen2: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/BaNgSOrKaGwhDDji.webp',
  kitchen3: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/PjjOgBFnbLqXhpkt.webp',
  kitchen4: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/iPfaDgNLxlOCogQb.jpg',
  kitchen5: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/WTBeKuNTSCrzPCUQ.jpg',
  kitchen6: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/SzTNmcYvVVLdFEHX.jpg',
  kitchen7: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/QYvFXktdWBUFwcuV.jpg',
  kitchen8: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/qHwWOcYvBFlFotTR.jpg',
  masterBath1: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/bCvYWsmlKvRBGkKr.jpg',
  masterBath2: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/yBhSQJGcWPbETnMD.jpg',
  masterBath3: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/ypWwhIWQHbXmEjrL.jpg',
  masterBath4: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/TGClmPeXqWyBaoHo.jpg',
  fullBath1: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/NybVlCaqVwixJZdG.jpg',
  fullBath2: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/ricmpPOThDSbWUch.jpg',
  halfBath1: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/asbFuprfxXdhAfEQ.jpeg',
  halfBath2: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/EvxZDqRrByNTEdLM.jpg',
  livingRoom1: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/XaDjgkDocnPQXJSh.jpg',
  livingRoom2: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/qWRiaHWyVLmRzHsy.jpg',
  livingRoom3: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/hHRvXdwOecXlNzNp.webp',
  bedroom1: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/IeLEpcTSHGoYRGwV.jpg',
  bedroom2: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/uusWTLrmSXzljPuG.jpg',
  bedroom3: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/SCsxOPRvPeJhsHVO.jpg',
  garage1: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/mZZVlPnLKAikZaJR.jpg',
  garage2: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/TRnzgwiTsOALjXWw.jpg',
  landscaping1: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/ECoAhtQWwXTkVmFV.jpg',
  landscaping2: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/wxCftffNtKlHUKUD.jpg',
  landscaping3: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/xFYzKQngScYkVule.jpg',
  roof1: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/jBCgbEwdfZCpWhHH.jpg',
  roof2: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/qddgPCANWwNHsUaK.jpg',
  exterior1: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/egNtjUvXCacqXCRF.jpg',
  exterior2: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/PDUFKZlMvSLeHLsi.jpg',
};

export const SOW_ROOM_TYPES = [
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'master-bath', name: 'Master Bathroom', icon: '🛁' },
  { id: 'full-bath', name: 'Full Bathroom', icon: '🚿' },
  { id: 'half-bath', name: 'Half Bath', icon: '🚽' },
  { id: 'living-room', name: 'Living Room', icon: '🛋️' },
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
  { id: 'garage', name: 'Garage', icon: '🚗' },
  { id: 'landscaping', name: 'Landscaping', icon: '🌿' },
  { id: 'roof', name: 'Roof & Gutter', icon: '🏠' },
  { id: 'exterior', name: 'Exterior', icon: '🏡' },
];

export const SOW_TEMPLATES: SOWTemplate[] = [
  // ─── KITCHEN TEMPLATES (20) ──────────────────────────────────
  {
    id: 'kitchen-1', roomType: 'kitchen', name: 'Budget Galley Kitchen Refresh',
    layoutType: 'Galley', costLevel: 1, photo: PHOTOS.kitchen5,
    propertyType: 'Single Family', beds: 2, baths: 1, sqft: 950,
    materialCost: 4200, laborCost: 2800, totalCost: 7000,
    workDescription: 'Cosmetic refresh of galley kitchen. Reface existing cabinet doors and install new hardware. Replace laminate countertops with butcher block. Install new vinyl plank flooring. Replace sink and faucet. Paint walls and ceiling. Install new light fixture. Replace outlet covers and switch plates.',
    keyMaterials: ['Cabinet refacing kit', 'Butcher block countertop', 'Vinyl plank flooring', 'Single-bowl stainless sink', 'Pull-down faucet', 'Pendant light fixture'],
  },
  {
    id: 'kitchen-2', roomType: 'kitchen', name: 'Standard Galley Kitchen Remodel',
    layoutType: 'Galley', costLevel: 2, photo: PHOTOS.kitchen6,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1200,
    materialCost: 8500, laborCost: 4500, totalCost: 13000,
    workDescription: 'Full galley kitchen remodel. Demo existing cabinets, countertops, flooring, and backsplash. Install new shaker-style cabinets with soft-close hinges. Install quartz countertops. Tile backsplash. Install new stainless steel appliances (refrigerator, range, dishwasher, microwave). New LVP flooring. Replace sink with double-bowl undermount. Install new faucet with sprayer. Add under-cabinet LED lighting. Paint walls. Replace all outlets and switches.',
    keyMaterials: ['Shaker cabinets (white)', 'Quartz countertops', 'Subway tile backsplash', 'Stainless appliance package', 'LVP flooring', 'Undermount sink', 'Under-cabinet LED lights'],
  },
  {
    id: 'kitchen-3', roomType: 'kitchen', name: 'Premium Galley Kitchen Renovation',
    layoutType: 'Galley', costLevel: 3, photo: PHOTOS.kitchen1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1400,
    materialCost: 14500, laborCost: 6500, totalCost: 21000,
    workDescription: 'Premium galley kitchen renovation. Complete demo to studs. Install custom shaker cabinets with dovetail drawers and soft-close hardware. Marble-look quartz countertops with waterfall edge. Full-height marble tile backsplash. Hardwood flooring. Premium stainless appliance suite. Farmhouse sink with commercial-style faucet. Recessed LED lighting with dimmer. New electrical for dedicated appliance circuits. Fresh drywall and premium paint.',
    keyMaterials: ['Custom shaker cabinets', 'Marble-look quartz countertops', 'Marble tile backsplash', 'Hardwood flooring', 'Premium appliance suite', 'Farmhouse sink', 'Recessed LED lighting'],
  },
  {
    id: 'kitchen-4', roomType: 'kitchen', name: 'Luxury Galley Kitchen Transformation',
    layoutType: 'Galley', costLevel: 4, photo: PHOTOS.kitchen1,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2200,
    materialCost: 25000, laborCost: 10000, totalCost: 35000,
    workDescription: 'Luxury galley kitchen transformation. Full gut to studs including ceiling. Custom inset cabinetry with furniture-grade finish. Natural marble countertops and full backsplash. Wide-plank engineered hardwood flooring. Professional-grade appliances (48" range, built-in refrigerator, panel-ready dishwasher). Integrated wine cooler. Custom range hood. Pot filler over range. Under-cabinet and in-cabinet LED lighting. New plumbing and electrical throughout.',
    keyMaterials: ['Custom inset cabinetry', 'Natural marble countertops', 'Wide-plank hardwood', 'Professional-grade appliances', 'Custom range hood', 'Pot filler', 'Wine cooler'],
  },
  {
    id: 'kitchen-5', roomType: 'kitchen', name: 'Budget L-Shape Kitchen Update',
    layoutType: 'L-Shape', costLevel: 1, photo: PHOTOS.kitchen8,
    propertyType: 'Single Family', beds: 3, baths: 1, sqft: 1100,
    materialCost: 5500, laborCost: 3200, totalCost: 8700,
    workDescription: 'Budget-friendly L-shape kitchen update. Paint existing cabinets and install new brushed nickel hardware. Replace laminate countertops with granite-look laminate. Install peel-and-stick tile backsplash. New vinyl plank flooring. Replace sink and faucet. New pendant lights over counter. Paint walls and trim. Replace range hood.',
    keyMaterials: ['Cabinet paint kit', 'Granite-look laminate countertop', 'Peel-and-stick backsplash', 'Vinyl plank flooring', 'Pendant lights', 'Range hood'],
  },
  {
    id: 'kitchen-6', roomType: 'kitchen', name: 'Standard L-Shape Kitchen Remodel',
    layoutType: 'L-Shape', costLevel: 2, photo: PHOTOS.kitchen2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1350,
    materialCost: 11000, laborCost: 5500, totalCost: 16500,
    workDescription: 'Standard L-shape kitchen remodel. Remove all cabinets, countertops, and flooring. Install new 42" upper cabinets and full base cabinet run. Granite countertops. Ceramic tile backsplash. LVP flooring. New appliance package (side-by-side fridge, gas range, dishwasher, over-range microwave). Double-bowl undermount sink. New faucet. Recessed lighting. Paint and trim.',
    keyMaterials: ['42" upper cabinets', 'Granite countertops', 'Ceramic tile backsplash', 'LVP flooring', 'Appliance package', 'Recessed lighting'],
  },
  {
    id: 'kitchen-7', roomType: 'kitchen', name: 'Premium L-Shape Kitchen with Island',
    layoutType: 'L-Shape Island', costLevel: 3, photo: PHOTOS.kitchen2,
    propertyType: 'Single Family', beds: 4, baths: 2, sqft: 1800,
    materialCost: 18000, laborCost: 8000, totalCost: 26000,
    workDescription: 'Premium L-shape kitchen with center island. Full demo including removal of non-load-bearing wall to open floor plan. Custom cabinets with soft-close and pull-out organizers. 4x6 island with seating for 3. Quartz countertops throughout. Glass mosaic backsplash. Engineered hardwood flooring. Premium appliance suite. Large undermount sink in island. Pendant lighting over island. Recessed lighting throughout. New electrical panel for kitchen circuits.',
    keyMaterials: ['Custom cabinets with organizers', '4x6 kitchen island', 'Quartz countertops', 'Glass mosaic backsplash', 'Engineered hardwood', 'Premium appliances', 'Pendant island lights'],
  },
  {
    id: 'kitchen-8', roomType: 'kitchen', name: 'Luxury L-Shape Kitchen with Island',
    layoutType: 'L-Shape Island', costLevel: 4, photo: PHOTOS.kitchen3,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2500,
    materialCost: 32000, laborCost: 13000, totalCost: 45000,
    workDescription: 'Luxury L-shape kitchen with oversized island. Complete gut renovation. Custom inset cabinetry with glass-front uppers and built-in pantry. 5x8 waterfall island with prep sink and seating for 5. Natural quartzite countertops. Hand-laid herringbone marble backsplash. Wide-plank white oak flooring. Professional appliance suite (48" dual-fuel range, built-in fridge/freezer columns, two dishwashers). Custom hood with brass accents. Butler pantry with wet bar. Smart home integration.',
    keyMaterials: ['Custom inset cabinetry', '5x8 waterfall island', 'Natural quartzite', 'Herringbone marble backsplash', 'White oak flooring', 'Professional appliances', 'Butler pantry'],
  },
  {
    id: 'kitchen-9', roomType: 'kitchen', name: 'Budget U-Shape Kitchen Refresh',
    layoutType: 'U-Shape', costLevel: 1, photo: PHOTOS.kitchen5,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1250,
    materialCost: 5800, laborCost: 3500, totalCost: 9300,
    workDescription: 'Budget U-shape kitchen refresh. Paint all cabinet boxes and replace doors with new shaker-style doors. New countertops (post-form laminate). Install new backsplash (subway tile). Replace flooring with sheet vinyl. New sink and faucet. Replace dishwasher. New light fixtures. Paint walls and ceiling.',
    keyMaterials: ['Shaker cabinet doors', 'Post-form laminate countertop', 'Subway tile backsplash', 'Sheet vinyl flooring', 'New dishwasher', 'Light fixtures'],
  },
  {
    id: 'kitchen-10', roomType: 'kitchen', name: 'Standard U-Shape Kitchen Remodel',
    layoutType: 'U-Shape', costLevel: 2, photo: PHOTOS.kitchen7,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 13500, laborCost: 6000, totalCost: 19500,
    workDescription: 'Standard U-shape kitchen remodel. Demo all cabinets, countertops, backsplash, and flooring. Install new RTA cabinets with crown molding. Granite countertops with eased edge. Ceramic subway tile backsplash. LVP flooring. Full appliance package. Undermount stainless sink. Pull-down faucet. Garbage disposal. Recessed can lights. New GFCI outlets. Paint and trim.',
    keyMaterials: ['RTA cabinets with crown molding', 'Granite countertops', 'Subway tile backsplash', 'LVP flooring', 'Full appliance package', 'Recessed can lights'],
  },
  {
    id: 'kitchen-11', roomType: 'kitchen', name: 'Premium U-Shape Kitchen Renovation',
    layoutType: 'U-Shape', costLevel: 3, photo: PHOTOS.kitchen4,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2000,
    materialCost: 20000, laborCost: 9000, totalCost: 29000,
    workDescription: 'Premium U-shape kitchen renovation. Full gut to studs. Semi-custom cabinets with dovetail drawers, lazy susans, and pull-out trash. Quartz countertops with ogee edge. Natural stone backsplash. Engineered hardwood flooring. Premium stainless appliance suite with French-door refrigerator. Large single-bowl workstation sink. Commercial-style faucet. Under-cabinet and toe-kick LED lighting. Dimmer switches throughout.',
    keyMaterials: ['Semi-custom cabinets', 'Quartz countertops', 'Natural stone backsplash', 'Engineered hardwood', 'Premium appliance suite', 'Workstation sink', 'LED lighting system'],
  },
  {
    id: 'kitchen-12', roomType: 'kitchen', name: 'Luxury U-Shape Kitchen with Peninsula',
    layoutType: 'U-Shape', costLevel: 4, photo: PHOTOS.kitchen3,
    propertyType: 'Single Family', beds: 5, baths: 4, sqft: 3200,
    materialCost: 38000, laborCost: 15000, totalCost: 53000,
    workDescription: 'Luxury U-shape kitchen with peninsula breakfast bar. Complete gut renovation including ceiling and subfloor. Custom frameless European-style cabinetry with integrated handles. Calacatta marble countertops and full-height backsplash. Wide-plank European oak flooring. Professional-grade appliance suite (60" range, built-in refrigerator, two dishwashers, warming drawer). Integrated coffee system. Custom ventilation hood. Peninsula with waterfall edge and seating. Smart lighting with scenes.',
    keyMaterials: ['European frameless cabinetry', 'Calacatta marble', 'European oak flooring', 'Professional 60" range', 'Integrated coffee system', 'Custom hood', 'Smart lighting'],
  },
  {
    id: 'kitchen-13', roomType: 'kitchen', name: 'Farmhouse Kitchen Renovation',
    layoutType: 'L-Shape', costLevel: 2, photo: PHOTOS.kitchen7,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1600,
    materialCost: 12000, laborCost: 5800, totalCost: 17800,
    workDescription: 'Farmhouse-style kitchen renovation. Demo existing kitchen. Install white shaker cabinets with oil-rubbed bronze hardware. Butcher block countertops on island, granite on perimeter. Shiplap backsplash. Wide-plank LVP flooring in barnwood finish. Farmhouse apron-front sink. Bridge faucet. Open shelving on one wall. Barn-style pendant lights. Beadboard ceiling detail. New appliances in white or black stainless.',
    keyMaterials: ['White shaker cabinets', 'Butcher block island top', 'Granite perimeter counters', 'Shiplap backsplash', 'Barnwood LVP', 'Farmhouse sink', 'Open shelving'],
  },
  {
    id: 'kitchen-14', roomType: 'kitchen', name: 'Modern Minimalist Kitchen',
    layoutType: 'L-Shape Island', costLevel: 3, photo: PHOTOS.kitchen3,
    propertyType: 'Condo/Townhouse', beds: 2, baths: 2, sqft: 1100,
    materialCost: 16000, laborCost: 7500, totalCost: 23500,
    workDescription: 'Modern minimalist kitchen with clean lines. Full demo. Flat-panel (slab) cabinets in matte white with integrated pull handles. Waterfall quartz island. Large-format porcelain tile backsplash. Polished concrete or porcelain tile flooring. Integrated appliances with panel-ready fronts. Undermount sink with matte black faucet. Linear LED lighting. Concealed range hood. Soft-close everything.',
    keyMaterials: ['Slab-front cabinets', 'Waterfall quartz island', 'Large-format porcelain', 'Integrated appliances', 'Matte black fixtures', 'Linear LED lighting'],
  },
  {
    id: 'kitchen-15', roomType: 'kitchen', name: 'Transitional Kitchen Remodel',
    layoutType: 'U-Shape Island', costLevel: 3, photo: PHOTOS.kitchen4,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2200,
    materialCost: 22000, laborCost: 9500, totalCost: 31500,
    workDescription: 'Transitional kitchen blending traditional and modern. Full gut renovation. Raised-panel cabinets in two-tone (white uppers, navy base). Quartz countertops with eased edge. Marble mosaic backsplash. Engineered hardwood flooring. Large island with prep sink and seating. Premium appliance package. Decorative range hood. Glass-front display cabinets. Combination of recessed, pendant, and under-cabinet lighting.',
    keyMaterials: ['Two-tone raised-panel cabinets', 'Quartz countertops', 'Marble mosaic backsplash', 'Engineered hardwood', 'Large island with prep sink', 'Decorative range hood'],
  },
  {
    id: 'kitchen-16', roomType: 'kitchen', name: 'Rental-Grade Kitchen Update',
    layoutType: 'Galley', costLevel: 1, photo: PHOTOS.kitchen5,
    propertyType: 'Multi-Family', beds: 2, baths: 1, sqft: 800,
    materialCost: 3200, laborCost: 2200, totalCost: 5400,
    workDescription: 'Rental-grade kitchen update for maximum ROI. Paint existing cabinets white. New chrome hardware. Replace countertops with post-form laminate. Paint over existing backsplash. New vinyl flooring. Replace faucet. New light fixture. Paint walls. Replace outlet covers. Clean and service existing appliances or replace with basic models.',
    keyMaterials: ['Cabinet paint (white)', 'Chrome hardware', 'Post-form laminate countertop', 'Vinyl flooring', 'Basic faucet', 'Ceiling light fixture'],
  },
  {
    id: 'kitchen-17', roomType: 'kitchen', name: 'Open Concept Kitchen Conversion',
    layoutType: 'L-Shape Island', costLevel: 3, photo: PHOTOS.kitchen2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1700,
    materialCost: 19000, laborCost: 11000, totalCost: 30000,
    workDescription: 'Open concept kitchen conversion. Remove wall between kitchen and living room (structural engineer required, install beam). Full kitchen demo and rebuild. New cabinet layout to maximize open feel. Large island as room divider with seating. Quartz countertops. Tile backsplash. Matching flooring to connect kitchen and living spaces. New electrical for island. Pendant lighting. Premium appliance package.',
    keyMaterials: ['Structural beam installation', 'New cabinet layout', 'Large divider island', 'Quartz countertops', 'Matching flooring', 'Pendant lighting', 'Premium appliances'],
  },
  {
    id: 'kitchen-18', roomType: 'kitchen', name: 'Cottage Style Kitchen',
    layoutType: 'L-Shape', costLevel: 2, photo: PHOTOS.kitchen8,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1300,
    materialCost: 10500, laborCost: 5200, totalCost: 15700,
    workDescription: 'Charming cottage-style kitchen. Demo existing kitchen. Install sage green shaker cabinets with brass hardware. Butcher block countertops. White subway tile backsplash with dark grout. Hardwood-look LVP flooring. Farmhouse sink with brass bridge faucet. Open shelving with brackets. Vintage-style pendant lights. Beadboard wainscoting. New appliances in white.',
    keyMaterials: ['Sage green shaker cabinets', 'Butcher block countertops', 'Subway tile (dark grout)', 'Hardwood-look LVP', 'Farmhouse sink', 'Brass bridge faucet', 'Open shelving'],
  },
  {
    id: 'kitchen-19', roomType: 'kitchen', name: 'Industrial Loft Kitchen',
    layoutType: 'U-Shape', costLevel: 3, photo: PHOTOS.kitchen3,
    propertyType: 'Condo/Loft', beds: 1, baths: 1, sqft: 900,
    materialCost: 15000, laborCost: 7000, totalCost: 22000,
    workDescription: 'Industrial loft kitchen design. Demo existing kitchen. Install flat-panel cabinets in charcoal with matte black hardware. Concrete-look quartz countertops. Exposed brick backsplash (or brick veneer). Polished concrete flooring. Stainless steel open shelving. Commercial-style faucet. Stainless appliances. Edison bulb pendant lighting. Exposed ductwork painted matte black. Metal bar stools.',
    keyMaterials: ['Charcoal flat-panel cabinets', 'Concrete-look quartz', 'Brick veneer backsplash', 'Polished concrete floor', 'Stainless open shelving', 'Commercial faucet', 'Edison pendants'],
  },
  {
    id: 'kitchen-20', roomType: 'kitchen', name: 'Mediterranean Kitchen',
    layoutType: 'U-Shape Island', costLevel: 4, photo: PHOTOS.kitchen7,
    propertyType: 'Single Family', beds: 5, baths: 4, sqft: 3500,
    materialCost: 35000, laborCost: 14000, totalCost: 49000,
    workDescription: 'Mediterranean-inspired luxury kitchen. Full gut renovation. Custom raised-panel cabinets with antiqued finish and decorative corbels. Natural travertine countertops. Hand-painted ceramic tile backsplash. Terracotta-look porcelain tile flooring. Arched range alcove with custom stone hood. Professional-grade appliances. Copper farmhouse sink. Pot filler. Wine storage. Iron pendant chandeliers. Decorative ceiling beams.',
    keyMaterials: ['Antiqued raised-panel cabinets', 'Travertine countertops', 'Hand-painted tile backsplash', 'Terracotta porcelain', 'Custom stone hood', 'Copper farmhouse sink', 'Decorative beams'],
  },

  // ─── MASTER BATHROOM TEMPLATES (12) ──────────────────────────
  {
    id: 'master-bath-1', roomType: 'master-bath', name: 'Budget Master Bath Refresh',
    layoutType: 'Standard', costLevel: 1, photo: PHOTOS.masterBath1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1200,
    materialCost: 2800, laborCost: 2200, totalCost: 5000,
    workDescription: 'Budget master bath refresh. Reglaze existing bathtub. Install new tub/shower surround panels. Replace toilet. New vanity with top and faucet. New mirror. Replace light fixture. Paint walls and ceiling. New vinyl flooring. Replace towel bars and accessories. Caulk and grout touch-up.',
    keyMaterials: ['Tub reglazing kit', 'Tub surround panels', 'New toilet', '36" vanity with top', 'Mirror', 'Light fixture', 'Vinyl flooring'],
  },
  {
    id: 'master-bath-2', roomType: 'master-bath', name: 'Standard Master Bath Remodel',
    layoutType: 'Standard', costLevel: 2, photo: PHOTOS.masterBath2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 6500, laborCost: 4500, totalCost: 11000,
    workDescription: 'Standard master bath remodel. Demo existing tub, vanity, toilet, and flooring. Install new acrylic tub with tile surround. New 48" double vanity with granite top. New elongated toilet. Ceramic tile flooring. New exhaust fan. Recessed lighting. New mirror and light bar. Chrome fixtures throughout. Fresh paint.',
    keyMaterials: ['Acrylic bathtub', 'Tile tub surround', '48" double vanity', 'Granite vanity top', 'Elongated toilet', 'Ceramic tile flooring', 'Exhaust fan'],
  },
  {
    id: 'master-bath-3', roomType: 'master-bath', name: 'Premium Master Bath with Walk-in Shower',
    layoutType: 'Walk-in Shower', costLevel: 3, photo: PHOTOS.masterBath3,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2000,
    materialCost: 12000, laborCost: 7000, totalCost: 19000,
    workDescription: 'Premium master bath with walk-in shower conversion. Remove existing tub and build curbless walk-in shower with linear drain. Floor-to-ceiling porcelain tile in shower. Glass shower enclosure. Rain showerhead with handheld. 60" double vanity with quartz top. Freestanding mirror. Wall sconces. Porcelain tile flooring with radiant heat mat. New toilet with soft-close seat. Linen tower.',
    keyMaterials: ['Curbless shower pan', 'Linear drain', 'Porcelain tile', 'Glass shower enclosure', 'Rain showerhead', '60" double vanity', 'Radiant heat mat'],
  },
  {
    id: 'master-bath-4', roomType: 'master-bath', name: 'Luxury Spa Master Bath',
    layoutType: 'Spa', costLevel: 4, photo: PHOTOS.masterBath4,
    propertyType: 'Single Family', beds: 5, baths: 4, sqft: 3000,
    materialCost: 22000, laborCost: 12000, totalCost: 34000,
    workDescription: 'Luxury spa-inspired master bath. Full gut to studs. Freestanding soaking tub as centerpiece. Oversized walk-in shower with body jets, rain head, and steam generator. Floor-to-ceiling natural marble tile. Custom double vanity with vessel sinks. Heated marble flooring. Frameless glass shower enclosure. Chandelier. Built-in niche shelving. Heated towel rack. Smart toilet with bidet. Custom linen closet.',
    keyMaterials: ['Freestanding soaking tub', 'Steam shower system', 'Natural marble tile', 'Custom double vanity', 'Vessel sinks', 'Heated flooring', 'Smart toilet', 'Heated towel rack'],
  },
  {
    id: 'master-bath-5', roomType: 'master-bath', name: 'Rental-Grade Master Bath',
    layoutType: 'Standard', costLevel: 1, photo: PHOTOS.masterBath1,
    propertyType: 'Multi-Family', beds: 2, baths: 1, sqft: 900,
    materialCost: 2000, laborCost: 1800, totalCost: 3800,
    workDescription: 'Rental-grade master bath update. Reglaze tub. New tub surround. Replace toilet with builder-grade model. New 30" vanity with cultured marble top. Basic mirror and light bar. Paint walls. New vinyl flooring. Replace faucet and shower valve. New towel bar and toilet paper holder.',
    keyMaterials: ['Tub reglazing', 'Tub surround', 'Builder-grade toilet', '30" vanity', 'Cultured marble top', 'Vinyl flooring'],
  },
  {
    id: 'master-bath-6', roomType: 'master-bath', name: 'Modern Master Bath',
    layoutType: 'Walk-in Shower', costLevel: 3, photo: PHOTOS.masterBath2,
    propertyType: 'Single Family', beds: 4, baths: 2, sqft: 1800,
    materialCost: 14000, laborCost: 8000, totalCost: 22000,
    workDescription: 'Modern master bath renovation. Full demo. Large-format porcelain tile throughout (walls and floor). Floating double vanity with integrated sinks. Wall-mounted faucets. Frameless glass walk-in shower with bench. Matte black fixtures throughout. LED backlit mirror. Niche shelving in shower. Curbless entry. Linear drain. Wall-hung toilet. Heated floors.',
    keyMaterials: ['Large-format porcelain tile', 'Floating double vanity', 'Wall-mounted faucets', 'Frameless glass shower', 'Matte black fixtures', 'LED backlit mirror', 'Wall-hung toilet'],
  },
  {
    id: 'master-bath-7', roomType: 'master-bath', name: 'Traditional Master Bath',
    layoutType: 'Tub & Shower', costLevel: 2, photo: PHOTOS.masterBath1,
    propertyType: 'Single Family', beds: 4, baths: 2, sqft: 1600,
    materialCost: 8500, laborCost: 5500, totalCost: 14000,
    workDescription: 'Traditional master bath remodel. Demo and rebuild. New alcove soaking tub with subway tile surround. Separate shower stall with glass door. 48" furniture-style vanity with marble top. Framed mirror. Traditional sconce lighting. Ceramic tile flooring in classic pattern. Wainscoting on lower walls. Chrome fixtures. New toilet. Linen cabinet.',
    keyMaterials: ['Alcove soaking tub', 'Subway tile surround', 'Glass shower door', '48" furniture vanity', 'Marble vanity top', 'Wainscoting', 'Chrome fixtures'],
  },
  {
    id: 'master-bath-8', roomType: 'master-bath', name: 'Coastal Master Bath',
    layoutType: 'Walk-in Shower', costLevel: 2, photo: PHOTOS.masterBath3,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1400,
    materialCost: 9000, laborCost: 5000, totalCost: 14000,
    workDescription: 'Coastal-inspired master bath. Demo existing bath. Install walk-in shower with pebble floor and blue glass tile accent. White shaker vanity with marble top. Rope-frame mirror. Nautical sconce lights. White subway tile wainscoting. LVP flooring in driftwood finish. Brushed nickel fixtures. New toilet. Beadboard ceiling.',
    keyMaterials: ['Pebble shower floor', 'Blue glass accent tile', 'White shaker vanity', 'Marble top', 'Rope-frame mirror', 'Driftwood LVP', 'Beadboard ceiling'],
  },
  {
    id: 'master-bath-9', roomType: 'master-bath', name: 'ADA-Accessible Master Bath',
    layoutType: 'Accessible', costLevel: 2, photo: PHOTOS.masterBath2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 10000, laborCost: 6000, totalCost: 16000,
    workDescription: 'ADA-accessible master bath renovation. Remove tub and install roll-in shower with fold-down bench and grab bars. Non-slip tile flooring throughout. Comfort-height toilet with grab bars. ADA-compliant vanity with knee clearance. Lever-handle faucets. Handheld showerhead on slide bar. Wider doorway (36"). Anti-scald valve. Motion-sensor lighting.',
    keyMaterials: ['Roll-in shower pan', 'Fold-down bench', 'Grab bars (multiple)', 'Non-slip tile', 'ADA vanity', 'Lever faucets', 'Handheld showerhead'],
  },
  {
    id: 'master-bath-10', roomType: 'master-bath', name: 'Farmhouse Master Bath',
    layoutType: 'Tub & Shower', costLevel: 3, photo: PHOTOS.masterBath4,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2200,
    materialCost: 13000, laborCost: 7500, totalCost: 20500,
    workDescription: 'Farmhouse-style master bath. Full demo. Clawfoot tub as centerpiece. Separate walk-in shower with white subway tile and dark grout. Reclaimed wood vanity with vessel sink. Shiplap accent wall. Wide-plank LVP flooring. Industrial-style lighting. Oil-rubbed bronze fixtures. Barn door for linen closet. Freestanding mirror. Vintage-style accessories.',
    keyMaterials: ['Clawfoot tub', 'Subway tile (dark grout)', 'Reclaimed wood vanity', 'Vessel sink', 'Shiplap accent wall', 'Wide-plank LVP', 'Barn door'],
  },
  {
    id: 'master-bath-11', roomType: 'master-bath', name: 'His & Hers Master Bath',
    layoutType: 'Double Vanity', costLevel: 3, photo: PHOTOS.masterBath2,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2400,
    materialCost: 16000, laborCost: 8500, totalCost: 24500,
    workDescription: 'His and hers master bath with separate vanity areas. Full gut renovation. Two individual vanity stations with mirrors and lighting. Walk-in shower with dual showerheads. Freestanding tub between vanities. Porcelain tile flooring with decorative border. Private toilet room with pocket door. Linen tower. Heated floors. Premium fixtures in brushed gold.',
    keyMaterials: ['Two separate vanities', 'Dual showerheads', 'Freestanding tub', 'Porcelain tile with border', 'Pocket door', 'Heated floors', 'Brushed gold fixtures'],
  },
  {
    id: 'master-bath-12', roomType: 'master-bath', name: 'Compact Master Bath Maximize',
    layoutType: 'Compact', costLevel: 2, photo: PHOTOS.masterBath3,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1100,
    materialCost: 7000, laborCost: 4000, totalCost: 11000,
    workDescription: 'Compact master bath maximization. Demo and rebuild for efficiency. Corner shower with curved glass door. Wall-mounted vanity to save floor space. Large mirror to create illusion of space. Recessed medicine cabinet. Pocket door entry. Light colors throughout. Large-format tile to minimize grout lines. Wall-mounted toilet. Towel warmer on wall.',
    keyMaterials: ['Corner shower with curved glass', 'Wall-mounted vanity', 'Recessed medicine cabinet', 'Pocket door', 'Large-format tile', 'Wall-mounted toilet', 'Towel warmer'],
  },

  // ─── FULL BATHROOM TEMPLATES (10) ────────────────────────────
  {
    id: 'full-bath-1', roomType: 'full-bath', name: 'Budget Full Bath Update',
    layoutType: 'Standard', costLevel: 1, photo: PHOTOS.fullBath1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1200,
    materialCost: 2200, laborCost: 1800, totalCost: 4000,
    workDescription: 'Budget full bath update. Reglaze tub. New shower curtain rod and curtain. Replace toilet. New 30" vanity with top. Basic mirror and light bar. Paint walls. New vinyl flooring. Replace faucet and showerhead. New accessories (towel bar, TP holder, robe hook).',
    keyMaterials: ['Tub reglazing', '30" vanity with top', 'New toilet', 'Vinyl flooring', 'Light bar', 'Accessories set'],
  },
  {
    id: 'full-bath-2', roomType: 'full-bath', name: 'Standard Full Bath Remodel',
    layoutType: 'Standard', costLevel: 2, photo: PHOTOS.fullBath2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1400,
    materialCost: 5000, laborCost: 3500, totalCost: 8500,
    workDescription: 'Standard full bath remodel. Demo tub, vanity, toilet, and flooring. New tub with tile surround (3 walls). 36" vanity with granite top. New toilet. Ceramic tile flooring. New exhaust fan. Recessed light and vanity light. Chrome fixtures. Fresh paint. New mirror.',
    keyMaterials: ['New bathtub', 'Tile tub surround', '36" vanity', 'Granite top', 'Ceramic tile floor', 'Exhaust fan'],
  },
  {
    id: 'full-bath-3', roomType: 'full-bath', name: 'Premium Full Bath Renovation',
    layoutType: 'Tub & Shower Combo', costLevel: 3, photo: PHOTOS.fullBath1,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2000,
    materialCost: 9000, laborCost: 5500, totalCost: 14500,
    workDescription: 'Premium full bath renovation. Full demo. New deep soaking tub with floor-to-ceiling tile surround. Glass tub screen instead of curtain. 42" vanity with quartz top and undermount sink. Porcelain tile flooring. Niche shelving in shower. Brushed nickel fixtures. Decorative mirror. Wall sconces. Heated floor mat.',
    keyMaterials: ['Deep soaking tub', 'Floor-to-ceiling tile', 'Glass tub screen', '42" vanity with quartz', 'Porcelain tile floor', 'Heated floor mat'],
  },
  {
    id: 'full-bath-4', roomType: 'full-bath', name: 'Kids Bathroom Fun Remodel',
    layoutType: 'Standard', costLevel: 2, photo: PHOTOS.fullBath2,
    propertyType: 'Single Family', beds: 4, baths: 2, sqft: 1800,
    materialCost: 5500, laborCost: 3800, totalCost: 9300,
    workDescription: 'Kid-friendly full bath remodel. New tub with colorful tile surround. Durable 36" vanity with solid surface top. Step stool built into vanity base. Slip-resistant tile flooring. Fun tile accent wall. Bright paint colors. New toilet. Good ventilation fan. Durable chrome fixtures. Anti-scald valve.',
    keyMaterials: ['New bathtub', 'Colorful tile surround', '36" durable vanity', 'Slip-resistant tile', 'Accent tile wall', 'Anti-scald valve'],
  },
  {
    id: 'full-bath-5', roomType: 'full-bath', name: 'Rental Full Bath Quick Flip',
    layoutType: 'Standard', costLevel: 1, photo: PHOTOS.fullBath2,
    propertyType: 'Multi-Family', beds: 2, baths: 1, sqft: 850,
    materialCost: 1800, laborCost: 1500, totalCost: 3300,
    workDescription: 'Rental-grade full bath quick flip. Reglaze tub. Paint walls white. New toilet seat. New faucet. New showerhead. New mirror. New light fixture. Replace vinyl flooring. New towel bar and TP holder. Caulk all joints. Clean grout.',
    keyMaterials: ['Tub reglazing', 'Toilet seat', 'Faucet', 'Showerhead', 'Vinyl flooring', 'Mirror'],
  },
  {
    id: 'full-bath-6', roomType: 'full-bath', name: 'Tub-to-Shower Conversion',
    layoutType: 'Walk-in Shower', costLevel: 2, photo: PHOTOS.fullBath1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1300,
    materialCost: 6000, laborCost: 4000, totalCost: 10000,
    workDescription: 'Convert tub to walk-in shower. Remove existing tub. Install shower pan with curb. Tile walls floor-to-ceiling. Glass shower door. Built-in corner shelf. New vanity with countertop. New toilet. Tile flooring. New exhaust fan. Updated lighting.',
    keyMaterials: ['Shower pan', 'Wall tile', 'Glass shower door', 'Corner shelf', 'New vanity', 'Tile flooring'],
  },
  {
    id: 'full-bath-7', roomType: 'full-bath', name: 'Vintage Full Bath Restoration',
    layoutType: 'Vintage', costLevel: 3, photo: PHOTOS.fullBath2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 8500, laborCost: 5000, totalCost: 13500,
    workDescription: 'Vintage-style full bath restoration. Refinish or replace with period-appropriate clawfoot tub. Hex tile flooring in classic black and white. Subway tile wainscoting. Pedestal sink or console vanity. Cross-handle faucets in polished chrome. Medicine cabinet with mirror. Vintage-style sconces. Bead board upper walls. Period-appropriate accessories.',
    keyMaterials: ['Clawfoot tub', 'Hex tile flooring', 'Subway tile wainscoting', 'Console vanity', 'Cross-handle faucets', 'Medicine cabinet', 'Beadboard'],
  },
  {
    id: 'full-bath-8', roomType: 'full-bath', name: 'Luxury Guest Bath',
    layoutType: 'Standard', costLevel: 4, photo: PHOTOS.fullBath1,
    propertyType: 'Single Family', beds: 5, baths: 4, sqft: 3000,
    materialCost: 14000, laborCost: 7000, totalCost: 21000,
    workDescription: 'Luxury guest bath. Full gut renovation. Freestanding tub with floor-mounted filler. Separate glass-enclosed shower with rain head. Natural stone tile throughout. Custom vanity with marble top. Decorative mirror with built-in lighting. Heated floors. Premium fixtures in brushed gold. Art niche in wall. Linen closet with custom shelving.',
    keyMaterials: ['Freestanding tub', 'Floor-mounted tub filler', 'Natural stone tile', 'Custom vanity', 'Marble top', 'Heated floors', 'Brushed gold fixtures'],
  },
  {
    id: 'full-bath-9', roomType: 'full-bath', name: 'Jack-and-Jill Bathroom',
    layoutType: 'Jack-and-Jill', costLevel: 2, photo: PHOTOS.fullBath2,
    propertyType: 'Single Family', beds: 4, baths: 2, sqft: 1800,
    materialCost: 7000, laborCost: 4500, totalCost: 11500,
    workDescription: 'Jack-and-Jill bathroom connecting two bedrooms. New tub/shower combo with tile surround. Double vanity with two sinks. Privacy locks on both doors. Durable tile flooring. Good ventilation. Neutral color scheme. Two mirrors and two light fixtures. Ample storage. New toilet in separate water closet area.',
    keyMaterials: ['Tub/shower combo', 'Tile surround', 'Double vanity', 'Two sinks', 'Privacy locks', 'Tile flooring', 'Separate water closet'],
  },
  {
    id: 'full-bath-10', roomType: 'full-bath', name: 'Basement Full Bath Addition',
    layoutType: 'New Construction', costLevel: 3, photo: PHOTOS.fullBath1,
    propertyType: 'Single Family', beds: 3, baths: 1, sqft: 1400,
    materialCost: 12000, laborCost: 8000, totalCost: 20000,
    workDescription: 'New basement full bath addition. Break concrete for drain lines. Install ejector pump if below sewer line. Frame walls and install moisture barrier. Tub/shower combo with tile surround. 36" vanity. Toilet. Tile flooring with waterproofing membrane. Exhaust fan vented to exterior. Recessed lighting. GFCI outlets. Moisture-resistant drywall.',
    keyMaterials: ['Ejector pump', 'Drain line rough-in', 'Moisture barrier', 'Tub/shower combo', 'Waterproofing membrane', 'Moisture-resistant drywall', 'Exhaust fan'],
  },

  // ─── HALF BATH TEMPLATES (8) ─────────────────────────────────
  {
    id: 'half-bath-1', roomType: 'half-bath', name: 'Budget Half Bath Refresh',
    layoutType: 'Standard', costLevel: 1, photo: PHOTOS.halfBath1,
    propertyType: 'Single Family', beds: 3, baths: 1.5, sqft: 1200,
    materialCost: 1200, laborCost: 1000, totalCost: 2200,
    workDescription: 'Budget half bath refresh. Paint walls and ceiling. New toilet seat. Replace faucet. New mirror. New light fixture. Replace vinyl flooring. New accessories. Caulk and touch up.',
    keyMaterials: ['Paint', 'Toilet seat', 'Faucet', 'Mirror', 'Light fixture', 'Vinyl flooring'],
  },
  {
    id: 'half-bath-2', roomType: 'half-bath', name: 'Standard Powder Room Remodel',
    layoutType: 'Standard', costLevel: 2, photo: PHOTOS.halfBath2,
    propertyType: 'Single Family', beds: 3, baths: 2.5, sqft: 1600,
    materialCost: 3000, laborCost: 2000, totalCost: 5000,
    workDescription: 'Standard powder room remodel. Replace toilet with elongated model. New 24" vanity with granite top. Vessel or undermount sink. New faucet. Framed mirror. Sconce lighting. Tile flooring. Accent wall (wallpaper or tile). Fresh paint.',
    keyMaterials: ['Elongated toilet', '24" vanity', 'Granite top', 'Tile flooring', 'Accent wall treatment', 'Sconce lighting'],
  },
  {
    id: 'half-bath-3', roomType: 'half-bath', name: 'Premium Powder Room',
    layoutType: 'Designer', costLevel: 3, photo: PHOTOS.halfBath1,
    propertyType: 'Single Family', beds: 4, baths: 3.5, sqft: 2200,
    materialCost: 5500, laborCost: 3000, totalCost: 8500,
    workDescription: 'Premium designer powder room. Full demo. Statement wallpaper on all walls. Floating vanity with vessel sink. Wall-mounted faucet. Decorative mirror (oversized or ornate). Designer pendant or chandelier. Porcelain tile flooring. Comfort-height toilet. Premium accessories in brass or matte black.',
    keyMaterials: ['Statement wallpaper', 'Floating vanity', 'Vessel sink', 'Wall-mounted faucet', 'Decorative mirror', 'Designer pendant', 'Porcelain tile'],
  },
  {
    id: 'half-bath-4', roomType: 'half-bath', name: 'Luxury Powder Room',
    layoutType: 'Luxury', costLevel: 4, photo: PHOTOS.halfBath2,
    propertyType: 'Single Family', beds: 5, baths: 4.5, sqft: 3500,
    materialCost: 9000, laborCost: 4500, totalCost: 13500,
    workDescription: 'Luxury powder room showpiece. Full gut. Natural stone accent wall. Custom vanity with natural stone top. Integrated LED mirror. Designer wall sconces. Heated natural stone flooring. Wall-hung toilet with concealed tank. Custom millwork. Decorative ceiling treatment. Premium fixtures in unlacquered brass.',
    keyMaterials: ['Natural stone accent wall', 'Custom vanity', 'Natural stone top', 'Integrated LED mirror', 'Heated stone floor', 'Wall-hung toilet', 'Unlacquered brass fixtures'],
  },
  {
    id: 'half-bath-5', roomType: 'half-bath', name: 'Under-Stairs Half Bath',
    layoutType: 'Compact', costLevel: 2, photo: PHOTOS.halfBath1,
    propertyType: 'Single Family', beds: 3, baths: 1, sqft: 1300,
    materialCost: 4500, laborCost: 3500, totalCost: 8000,
    workDescription: 'New half bath under stairs. Frame walls and install door. Run water supply and drain lines. Install compact toilet. Wall-mounted sink or small vanity. Tile flooring. Exhaust fan. GFCI outlet. Light fixture. Mirror. Paint. Pocket door to save space.',
    keyMaterials: ['Plumbing rough-in', 'Compact toilet', 'Wall-mounted sink', 'Tile flooring', 'Exhaust fan', 'Pocket door'],
  },
  {
    id: 'half-bath-6', roomType: 'half-bath', name: 'Rental Half Bath Quick Fix',
    layoutType: 'Standard', costLevel: 1, photo: PHOTOS.halfBath2,
    propertyType: 'Multi-Family', beds: 2, baths: 1.5, sqft: 900,
    materialCost: 800, laborCost: 600, totalCost: 1400,
    workDescription: 'Rental half bath quick fix. Replace toilet seat and wax ring. New faucet aerator. Paint walls white. New mirror. Replace light bulb/fixture. Clean or replace vinyl flooring. New towel ring and TP holder. Caulk around sink and toilet base.',
    keyMaterials: ['Toilet seat', 'Wax ring', 'Faucet aerator', 'Paint', 'Mirror', 'Vinyl flooring'],
  },
  {
    id: 'half-bath-7', roomType: 'half-bath', name: 'Modern Half Bath',
    layoutType: 'Modern', costLevel: 3, photo: PHOTOS.halfBath1,
    propertyType: 'Condo/Townhouse', beds: 2, baths: 1.5, sqft: 1100,
    materialCost: 4800, laborCost: 2800, totalCost: 7600,
    workDescription: 'Modern half bath renovation. Floating vanity with integrated sink. Wall-mounted faucet in matte black. Backlit LED mirror. Large-format tile on floor and accent wall. Wall-hung toilet. Matte black accessories. Recessed lighting. Clean, minimal design.',
    keyMaterials: ['Floating vanity', 'Integrated sink', 'Wall-mounted faucet', 'Backlit LED mirror', 'Large-format tile', 'Wall-hung toilet'],
  },
  {
    id: 'half-bath-8', roomType: 'half-bath', name: 'Rustic Half Bath',
    layoutType: 'Rustic', costLevel: 2, photo: PHOTOS.halfBath2,
    propertyType: 'Single Family', beds: 3, baths: 2.5, sqft: 1500,
    materialCost: 3500, laborCost: 2200, totalCost: 5700,
    workDescription: 'Rustic half bath renovation. Reclaimed wood accent wall. Vessel sink on reclaimed wood vanity. Oil-rubbed bronze faucet. Rustic-frame mirror. Mason jar sconce lights. Stone-look tile flooring. New toilet. Barn wood shelving. Wrought iron accessories.',
    keyMaterials: ['Reclaimed wood accent wall', 'Reclaimed wood vanity', 'Vessel sink', 'Oil-rubbed bronze faucet', 'Stone-look tile', 'Mason jar sconces'],
  },

  // ─── LIVING ROOM TEMPLATES (10) ──────────────────────────────
  {
    id: 'living-room-1', roomType: 'living-room', name: 'Budget Living Room Refresh',
    layoutType: 'Standard', costLevel: 1, photo: PHOTOS.livingRoom1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1200,
    materialCost: 1800, laborCost: 1200, totalCost: 3000,
    workDescription: 'Budget living room refresh. Paint walls and ceiling. Replace carpet with LVP flooring. New baseboards. Replace light fixture. New outlet covers and switch plates. Clean or replace window blinds. Patch any drywall damage.',
    keyMaterials: ['Interior paint', 'LVP flooring', 'Baseboards', 'Light fixture', 'Window blinds'],
  },
  {
    id: 'living-room-2', roomType: 'living-room', name: 'Standard Living Room Remodel',
    layoutType: 'Standard', costLevel: 2, photo: PHOTOS.livingRoom2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 4500, laborCost: 3000, totalCost: 7500,
    workDescription: 'Standard living room remodel. Remove carpet and install engineered hardwood. New baseboards and crown molding. Paint walls with accent wall. Replace all light fixtures. Install ceiling fan. New window treatments. Repair or replace drywall as needed. Add built-in shelving on one wall.',
    keyMaterials: ['Engineered hardwood', 'Crown molding', 'Baseboards', 'Ceiling fan', 'Window treatments', 'Built-in shelving'],
  },
  {
    id: 'living-room-3', roomType: 'living-room', name: 'Premium Living Room with Fireplace',
    layoutType: 'Fireplace', costLevel: 3, photo: PHOTOS.livingRoom2,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2000,
    materialCost: 8000, laborCost: 5000, totalCost: 13000,
    workDescription: 'Premium living room with fireplace renovation. Install electric or gas fireplace insert with stone surround and custom mantel. Wide-plank hardwood flooring. Built-in entertainment center flanking fireplace. Crown molding and wainscoting. Recessed lighting with dimmers. Premium paint. New windows or window trim.',
    keyMaterials: ['Fireplace insert', 'Stone surround', 'Custom mantel', 'Wide-plank hardwood', 'Built-in entertainment center', 'Wainscoting', 'Recessed lighting'],
  },
  {
    id: 'living-room-4', roomType: 'living-room', name: 'Luxury Great Room',
    layoutType: 'Great Room', costLevel: 4, photo: PHOTOS.livingRoom3,
    propertyType: 'Single Family', beds: 5, baths: 4, sqft: 3500,
    materialCost: 18000, laborCost: 10000, totalCost: 28000,
    workDescription: 'Luxury great room transformation. Floor-to-ceiling stone fireplace with custom wood mantel. Wide-plank white oak flooring. Coffered ceiling with decorative beams. Custom built-in cabinetry and bookshelves. Architectural columns or arches. Premium window treatments with motorized shades. Layered lighting (recessed, sconces, chandelier). Custom millwork throughout.',
    keyMaterials: ['Floor-to-ceiling stone fireplace', 'White oak flooring', 'Coffered ceiling', 'Decorative beams', 'Custom built-ins', 'Motorized shades', 'Chandelier'],
  },
  {
    id: 'living-room-5', roomType: 'living-room', name: 'Open Floor Plan Conversion',
    layoutType: 'Open Concept', costLevel: 3, photo: PHOTOS.livingRoom3,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1600,
    materialCost: 7000, laborCost: 8000, totalCost: 15000,
    workDescription: 'Open floor plan conversion. Remove wall between living room and dining room or kitchen (structural engineer required). Install support beam. Match flooring throughout connected spaces. Repaint entire open area. Update lighting for new open layout. Add architectural details to define zones without walls.',
    keyMaterials: ['Structural beam', 'Matching flooring', 'Paint', 'Updated lighting', 'Architectural details'],
  },
  {
    id: 'living-room-6', roomType: 'living-room', name: 'Rental Living Room Update',
    layoutType: 'Standard', costLevel: 1, photo: PHOTOS.livingRoom1,
    propertyType: 'Multi-Family', beds: 2, baths: 1, sqft: 850,
    materialCost: 1200, laborCost: 800, totalCost: 2000,
    workDescription: 'Rental living room update. Paint walls and ceiling white. Replace carpet with vinyl plank. New baseboards. Replace broken blinds. New light fixture. Patch drywall holes. Replace outlet covers.',
    keyMaterials: ['White paint', 'Vinyl plank flooring', 'Baseboards', 'Blinds', 'Light fixture'],
  },
  {
    id: 'living-room-7', roomType: 'living-room', name: 'Modern Living Room',
    layoutType: 'Modern', costLevel: 3, photo: PHOTOS.livingRoom1,
    propertyType: 'Condo/Townhouse', beds: 2, baths: 2, sqft: 1200,
    materialCost: 6500, laborCost: 4000, totalCost: 10500,
    workDescription: 'Modern living room renovation. Polished concrete or large-format tile flooring. Linear electric fireplace. Floating media wall with integrated storage. Floor-to-ceiling windows (if applicable). Recessed lighting with smart controls. Minimalist baseboards. Feature wall with textured panels. Motorized roller shades.',
    keyMaterials: ['Large-format tile', 'Linear electric fireplace', 'Floating media wall', 'Smart lighting', 'Textured wall panels', 'Motorized shades'],
  },
  {
    id: 'living-room-8', roomType: 'living-room', name: 'Traditional Living Room',
    layoutType: 'Traditional', costLevel: 2, photo: PHOTOS.livingRoom2,
    propertyType: 'Single Family', beds: 4, baths: 2, sqft: 1800,
    materialCost: 5000, laborCost: 3500, totalCost: 8500,
    workDescription: 'Traditional living room renovation. Hardwood flooring refinish or new installation. Crown molding and chair rail. Wainscoting on lower walls. Fireplace mantel update. Traditional chandelier. Window seat or bay window trim. Built-in bookshelves. Classic paint colors.',
    keyMaterials: ['Hardwood flooring', 'Crown molding', 'Chair rail', 'Wainscoting', 'Fireplace mantel', 'Chandelier', 'Built-in bookshelves'],
  },
  {
    id: 'living-room-9', roomType: 'living-room', name: 'Entertainment Room Conversion',
    layoutType: 'Entertainment', costLevel: 3, photo: PHOTOS.livingRoom2,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2200,
    materialCost: 10000, laborCost: 6000, totalCost: 16000,
    workDescription: 'Entertainment room conversion. Soundproofing insulation in walls. Dark paint or fabric wall panels. Tiered flooring for theater seating. Built-in media wall with 75"+ TV mount. Surround sound wiring. Dimmable recessed lighting. Blackout window treatments. Mini bar area with countertop and mini fridge. Carpet or luxury vinyl in dark tones.',
    keyMaterials: ['Soundproofing insulation', 'Fabric wall panels', 'Tiered flooring', 'Media wall', 'Surround sound wiring', 'Blackout treatments', 'Mini bar'],
  },
  {
    id: 'living-room-10', roomType: 'living-room', name: 'Sunroom/Florida Room Addition',
    layoutType: 'Sunroom', costLevel: 3, photo: PHOTOS.livingRoom3,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 15000, laborCost: 10000, totalCost: 25000,
    workDescription: 'Sunroom/Florida room addition or conversion. Enclose existing porch or patio. Install windows on three walls. Insulate ceiling and walls. Tile or LVP flooring. Ceiling fan. Recessed lighting. Mini-split HVAC for climate control. Electrical outlets. Blinds or shades for sun control.',
    keyMaterials: ['Window installation', 'Insulation', 'Tile flooring', 'Ceiling fan', 'Mini-split HVAC', 'Blinds/shades'],
  },

  // ─── BEDROOM TEMPLATES (10) ──────────────────────────────────
  {
    id: 'bedroom-1', roomType: 'bedroom', name: 'Budget Bedroom Refresh',
    layoutType: 'Standard', costLevel: 1, photo: PHOTOS.bedroom1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1200,
    materialCost: 1200, laborCost: 800, totalCost: 2000,
    workDescription: 'Budget bedroom refresh. Paint walls and ceiling. Replace carpet with LVP. New baseboards. Replace light fixture. New outlet covers. Replace closet door hardware. Clean or replace window blinds.',
    keyMaterials: ['Paint', 'LVP flooring', 'Baseboards', 'Light fixture', 'Blinds'],
  },
  {
    id: 'bedroom-2', roomType: 'bedroom', name: 'Standard Bedroom Remodel',
    layoutType: 'Standard', costLevel: 2, photo: PHOTOS.bedroom2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 3000, laborCost: 2000, totalCost: 5000,
    workDescription: 'Standard bedroom remodel. New carpet or LVP flooring. Paint with accent wall. New baseboards and door trim. Replace hollow-core door with solid. New ceiling fan with light. Closet organizer system. New window treatments. Replace all hardware.',
    keyMaterials: ['Carpet or LVP', 'Paint', 'Solid-core door', 'Ceiling fan', 'Closet organizer', 'Window treatments'],
  },
  {
    id: 'bedroom-3', roomType: 'bedroom', name: 'Premium Master Bedroom Suite',
    layoutType: 'Master Suite', costLevel: 3, photo: PHOTOS.bedroom3,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2200,
    materialCost: 7000, laborCost: 4500, totalCost: 11500,
    workDescription: 'Premium master bedroom suite. Hardwood flooring. Accent wall with shiplap or board-and-batten. Tray ceiling with crown molding. Walk-in closet with custom organizer system. Recessed lighting with dimmers. Ceiling fan. Premium window treatments. New solid-core door. Fresh paint throughout.',
    keyMaterials: ['Hardwood flooring', 'Shiplap accent wall', 'Tray ceiling', 'Custom closet system', 'Recessed lighting', 'Premium window treatments'],
  },
  {
    id: 'bedroom-4', roomType: 'bedroom', name: 'Luxury Master Retreat',
    layoutType: 'Luxury Suite', costLevel: 4, photo: PHOTOS.bedroom3,
    propertyType: 'Single Family', beds: 5, baths: 4, sqft: 3500,
    materialCost: 15000, laborCost: 8000, totalCost: 23000,
    workDescription: 'Luxury master retreat. Wide-plank white oak flooring. Custom accent wall with integrated LED lighting. Coffered ceiling. Walk-in closet with custom cabinetry, island, and lighting. Sitting area with built-in window seat. Motorized blackout shades. Layered lighting (recessed, sconces, pendants). Sound system wiring. Custom millwork throughout.',
    keyMaterials: ['White oak flooring', 'Custom accent wall', 'Coffered ceiling', 'Custom closet cabinetry', 'Window seat', 'Motorized shades', 'Sound system wiring'],
  },
  {
    id: 'bedroom-5', roomType: 'bedroom', name: 'Rental Bedroom Quick Flip',
    layoutType: 'Standard', costLevel: 1, photo: PHOTOS.bedroom1,
    propertyType: 'Multi-Family', beds: 2, baths: 1, sqft: 850,
    materialCost: 800, laborCost: 600, totalCost: 1400,
    workDescription: 'Rental bedroom quick flip. Paint walls white. Clean or replace carpet. Patch drywall. Replace broken blinds. New light fixture. New outlet covers. Clean closet.',
    keyMaterials: ['White paint', 'Carpet cleaning/replacement', 'Drywall patch', 'Blinds', 'Light fixture'],
  },
  {
    id: 'bedroom-6', roomType: 'bedroom', name: 'Guest Bedroom with Murphy Bed',
    layoutType: 'Multi-Function', costLevel: 2, photo: PHOTOS.bedroom2,
    propertyType: 'Single Family', beds: 2, baths: 1, sqft: 1100,
    materialCost: 4500, laborCost: 2500, totalCost: 7000,
    workDescription: 'Guest bedroom/office with Murphy bed. Install wall-mounted Murphy bed system with side cabinets. Built-in desk area. LVP flooring. Fresh paint. Ceiling fan. Closet organizer. USB outlet installation. Good lighting for work and sleep.',
    keyMaterials: ['Murphy bed system', 'Side cabinets', 'Built-in desk', 'LVP flooring', 'Ceiling fan', 'USB outlets'],
  },
  {
    id: 'bedroom-7', roomType: 'bedroom', name: 'Attic Bedroom Conversion',
    layoutType: 'Conversion', costLevel: 3, photo: PHOTOS.bedroom2,
    propertyType: 'Single Family', beds: 2, baths: 1, sqft: 1200,
    materialCost: 12000, laborCost: 10000, totalCost: 22000,
    workDescription: 'Attic bedroom conversion. Install dormer windows for headroom and light. Insulate walls and ceiling. Install HVAC ductwork or mini-split. Frame and drywall. LVP or carpet flooring. Electrical wiring for outlets, lights, and smoke detectors. Egress window (code required). Built-in storage under eaves. Paint and trim.',
    keyMaterials: ['Dormer windows', 'Insulation', 'Mini-split HVAC', 'Drywall', 'Egress window', 'Built-in storage', 'Electrical wiring'],
  },
  {
    id: 'bedroom-8', roomType: 'bedroom', name: 'Nursery/Kids Room',
    layoutType: 'Kids', costLevel: 2, photo: PHOTOS.bedroom1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 3500, laborCost: 2000, totalCost: 5500,
    workDescription: 'Nursery/kids room renovation. Carpet flooring (soft, stain-resistant). Fun accent wall (wallpaper or paint). Built-in bookshelf and toy storage. Ceiling fan with light. Blackout curtains. Child-safe outlet covers. Closet organizer. Crown molding. Dimmable lighting.',
    keyMaterials: ['Stain-resistant carpet', 'Accent wallpaper', 'Built-in bookshelf', 'Toy storage', 'Blackout curtains', 'Child-safe outlets'],
  },
  {
    id: 'bedroom-9', roomType: 'bedroom', name: 'Basement Bedroom Addition',
    layoutType: 'New Construction', costLevel: 3, photo: PHOTOS.bedroom2,
    propertyType: 'Single Family', beds: 2, baths: 1, sqft: 1300,
    materialCost: 10000, laborCost: 8000, totalCost: 18000,
    workDescription: 'Basement bedroom addition. Frame walls. Install egress window (code required). Insulate exterior walls. Moisture barrier. Drywall with moisture-resistant backing. LVP flooring over subfloor. Closet framing and shelving. HVAC extension or mini-split. Electrical for outlets, lights, smoke/CO detectors. Paint and trim.',
    keyMaterials: ['Egress window', 'Framing lumber', 'Insulation', 'Moisture barrier', 'Moisture-resistant drywall', 'LVP flooring', 'Mini-split HVAC'],
  },
  {
    id: 'bedroom-10', roomType: 'bedroom', name: 'ADU/In-Law Suite Bedroom',
    layoutType: 'ADU', costLevel: 3, photo: PHOTOS.bedroom3,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1800,
    materialCost: 8000, laborCost: 5000, totalCost: 13000,
    workDescription: 'ADU/in-law suite bedroom. Separate entrance if possible. Full bedroom with walk-in closet. Kitchenette area (mini fridge, microwave, sink). LVP flooring. Separate HVAC zone. Soundproofing between units. ADA-friendly features. Smoke/CO detectors. Separate electrical panel or sub-panel.',
    keyMaterials: ['Separate entrance', 'Walk-in closet', 'Kitchenette fixtures', 'LVP flooring', 'Separate HVAC', 'Soundproofing', 'Sub-panel'],
  },

  // ─── GARAGE TEMPLATES (8) ────────────────────────────────────
  {
    id: 'garage-1', roomType: 'garage', name: 'Budget Garage Cleanup',
    layoutType: 'Standard', costLevel: 1, photo: PHOTOS.garage1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 1500, laborCost: 1000, totalCost: 2500,
    workDescription: 'Budget garage cleanup and organization. Epoxy floor coating. Wall-mounted pegboard and hooks. Overhead storage rack. New LED shop lights. Weather stripping on garage door. Paint walls white. Organize and label storage areas.',
    keyMaterials: ['Epoxy floor kit', 'Pegboard system', 'Overhead storage rack', 'LED shop lights', 'Weather stripping', 'White paint'],
  },
  {
    id: 'garage-2', roomType: 'garage', name: 'Standard Garage Renovation',
    layoutType: 'Standard', costLevel: 2, photo: PHOTOS.garage2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1600,
    materialCost: 4000, laborCost: 2500, totalCost: 6500,
    workDescription: 'Standard garage renovation. Professional epoxy floor with flake finish. Slatwall storage system. Workbench with pegboard. Overhead storage platforms. LED lighting throughout. New garage door opener with smart features. Insulate garage door. New entry door to house. Paint walls.',
    keyMaterials: ['Professional epoxy floor', 'Slatwall system', 'Workbench', 'Overhead platforms', 'LED lighting', 'Smart garage opener', 'Garage door insulation'],
  },
  {
    id: 'garage-3', roomType: 'garage', name: 'Premium Workshop Garage',
    layoutType: 'Workshop', costLevel: 3, photo: PHOTOS.garage1,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2200,
    materialCost: 8000, laborCost: 5000, totalCost: 13000,
    workDescription: 'Premium workshop garage. Polyurea floor coating. Custom cabinet system along walls. Built-in workbench with electrical. Dedicated 220V circuit for power tools. Air compressor line system. LED task lighting. Exhaust fan. Insulated walls and ceiling. Mini-split for climate control. Tool organization system.',
    keyMaterials: ['Polyurea floor coating', 'Custom cabinets', 'Built-in workbench', '220V circuit', 'Air compressor lines', 'Mini-split HVAC', 'Insulation'],
  },
  {
    id: 'garage-4', roomType: 'garage', name: 'Garage ADU Conversion',
    layoutType: 'ADU Conversion', costLevel: 4, photo: PHOTOS.garage2,
    propertyType: 'Single Family', beds: 2, baths: 1, sqft: 1200,
    materialCost: 25000, laborCost: 20000, totalCost: 45000,
    workDescription: 'Full garage-to-ADU conversion. Permits and plans. Frame interior walls. Install windows and entry door. Plumbing for bathroom and kitchenette. Electrical panel and wiring. Insulation and drywall. LVP flooring. Mini-split HVAC. Kitchen area with cabinets, sink, and appliances. Full bathroom. Closet. Fire separation from main house.',
    keyMaterials: ['Permits/plans', 'Windows and doors', 'Full plumbing', 'Electrical panel', 'Insulation/drywall', 'Mini-split HVAC', 'Kitchen fixtures', 'Bathroom fixtures'],
  },
  {
    id: 'garage-5', roomType: 'garage', name: 'Rental Garage Basic',
    layoutType: 'Standard', costLevel: 1, photo: PHOTOS.garage1,
    propertyType: 'Multi-Family', beds: 2, baths: 1, sqft: 900,
    materialCost: 800, laborCost: 500, totalCost: 1300,
    workDescription: 'Rental garage basic update. Patch and seal concrete floor. New light fixtures. Replace garage door springs/opener if needed. Weather stripping. Paint walls. Clean out debris.',
    keyMaterials: ['Concrete sealer', 'Light fixtures', 'Weather stripping', 'Paint'],
  },
  {
    id: 'garage-6', roomType: 'garage', name: 'Home Gym Garage',
    layoutType: 'Gym', costLevel: 2, photo: PHOTOS.garage2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 5000, laborCost: 3000, totalCost: 8000,
    workDescription: 'Home gym garage conversion. Rubber flooring over concrete. Mirror wall. Wall-mounted TV. Ceiling fan. LED lighting. Insulated garage door. Mini-split for climate control. Dedicated electrical circuits. Wall-mounted equipment storage. Bluetooth speaker system.',
    keyMaterials: ['Rubber flooring', 'Wall mirrors', 'Ceiling fan', 'Mini-split HVAC', 'Insulated garage door', 'Equipment storage'],
  },
  {
    id: 'garage-7', roomType: 'garage', name: 'New Garage Door & Exterior',
    layoutType: 'Exterior', costLevel: 2, photo: PHOTOS.garage1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1400,
    materialCost: 3500, laborCost: 1500, totalCost: 5000,
    workDescription: 'New garage door and exterior update. Remove old garage door. Install new insulated steel garage door with windows. New smart garage door opener. Paint garage door trim. New exterior light fixtures. New house numbers. Driveway pressure wash.',
    keyMaterials: ['Insulated steel garage door', 'Smart opener', 'Exterior paint', 'Light fixtures', 'House numbers'],
  },
  {
    id: 'garage-8', roomType: 'garage', name: 'Detached Garage Build',
    layoutType: 'New Construction', costLevel: 4, photo: PHOTOS.garage2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1600,
    materialCost: 20000, laborCost: 18000, totalCost: 38000,
    workDescription: 'Detached garage new construction (2-car). Foundation and slab. Framing. Roofing to match house. Siding to match house. Two garage doors with openers. Service door. Windows. Electrical with subpanel. LED lighting. Concrete driveway extension.',
    keyMaterials: ['Foundation/slab', 'Framing lumber', 'Roofing', 'Matching siding', 'Two garage doors', 'Electrical subpanel', 'Driveway concrete'],
  },

  // ─── LANDSCAPING TEMPLATES (10) ──────────────────────────────
  {
    id: 'landscaping-1', roomType: 'landscaping', name: 'Budget Curb Appeal',
    layoutType: 'Front Yard', costLevel: 1, photo: PHOTOS.landscaping1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1200,
    materialCost: 1500, laborCost: 1000, totalCost: 2500,
    workDescription: 'Budget curb appeal landscaping. Clean up existing beds. Fresh mulch (3" depth). Trim overgrown shrubs. Plant 5-6 foundation shrubs. Edge lawn borders. Seed or sod bare patches. Clean walkway. Basic flower bed at entry.',
    keyMaterials: ['Mulch (bulk)', 'Foundation shrubs', 'Grass seed/sod', 'Edging', 'Annual flowers', 'Topsoil'],
  },
  {
    id: 'landscaping-2', roomType: 'landscaping', name: 'Standard Front Yard Makeover',
    layoutType: 'Front Yard', costLevel: 2, photo: PHOTOS.landscaping2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 4000, laborCost: 3000, totalCost: 7000,
    workDescription: 'Standard front yard makeover. Remove old landscaping. Grade and level yard. Install landscape fabric and river rock borders. Plant mix of evergreen and flowering shrubs. Ornamental tree. New sod lawn. Landscape lighting (solar path lights). Mulch all beds. Edge all borders.',
    keyMaterials: ['Landscape fabric', 'River rock', 'Evergreen shrubs', 'Flowering shrubs', 'Ornamental tree', 'Sod', 'Solar path lights', 'Mulch'],
  },
  {
    id: 'landscaping-3', roomType: 'landscaping', name: 'Premium Landscape Design',
    layoutType: 'Full Property', costLevel: 3, photo: PHOTOS.landscaping3,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2200,
    materialCost: 10000, laborCost: 7000, totalCost: 17000,
    workDescription: 'Premium landscape design front and back. Professional landscape plan. Irrigation system installation. Specimen trees and layered plantings. Stone walkway or paver path. Retaining wall if needed. Outdoor lighting (low-voltage LED). Decorative rock features. Privacy hedge along property line. Raised flower beds.',
    keyMaterials: ['Irrigation system', 'Specimen trees', 'Layered plantings', 'Stone/paver walkway', 'Low-voltage LED lighting', 'Retaining wall materials', 'Privacy hedge'],
  },
  {
    id: 'landscaping-4', roomType: 'landscaping', name: 'Luxury Outdoor Living',
    layoutType: 'Outdoor Living', costLevel: 4, photo: PHOTOS.landscaping2,
    propertyType: 'Single Family', beds: 5, baths: 4, sqft: 3500,
    materialCost: 25000, laborCost: 15000, totalCost: 40000,
    workDescription: 'Luxury outdoor living space. Paver patio with fire pit. Outdoor kitchen with built-in grill, sink, and counter. Pergola or covered structure. Professional landscape design with mature plantings. Irrigation system. Low-voltage landscape lighting. Water feature. Privacy screening. Outdoor electrical for lighting and appliances.',
    keyMaterials: ['Paver patio', 'Fire pit', 'Outdoor kitchen', 'Pergola', 'Mature plantings', 'Irrigation', 'Water feature', 'Landscape lighting'],
  },
  {
    id: 'landscaping-5', roomType: 'landscaping', name: 'Rental Yard Cleanup',
    layoutType: 'Basic', costLevel: 1, photo: PHOTOS.landscaping1,
    propertyType: 'Multi-Family', beds: 2, baths: 1, sqft: 900,
    materialCost: 600, laborCost: 400, totalCost: 1000,
    workDescription: 'Rental yard basic cleanup. Mow and edge lawn. Trim bushes. Remove dead plants. Fresh mulch in beds. Clean walkway. Basic weed control.',
    keyMaterials: ['Mulch', 'Weed control', 'Grass seed'],
  },
  {
    id: 'landscaping-6', roomType: 'landscaping', name: 'Backyard Patio Installation',
    layoutType: 'Backyard', costLevel: 2, photo: PHOTOS.landscaping3,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1400,
    materialCost: 5000, laborCost: 4000, totalCost: 9000,
    workDescription: 'Backyard patio installation. Excavate and grade area. Compact base material. Install paver patio (12x16). Border edging. Basic landscaping around patio. String light posts. Gravel border. Sod remaining yard areas.',
    keyMaterials: ['Pavers', 'Base material', 'Border edging', 'Gravel', 'String light posts', 'Sod', 'Landscaping plants'],
  },
  {
    id: 'landscaping-7', roomType: 'landscaping', name: 'Fence Installation',
    layoutType: 'Fencing', costLevel: 2, photo: PHOTOS.landscaping1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 4500, laborCost: 3000, totalCost: 7500,
    workDescription: 'Privacy fence installation (150 linear feet). Remove old fence if existing. Set posts in concrete. Install 6-foot privacy fence (wood or vinyl). Gate with hardware. Stain or seal if wood. Clean up and haul away old materials.',
    keyMaterials: ['Fence panels (6-foot)', 'Posts', 'Concrete', 'Gate with hardware', 'Stain/sealer', 'Post caps'],
  },
  {
    id: 'landscaping-8', roomType: 'landscaping', name: 'Driveway Replacement',
    layoutType: 'Hardscape', costLevel: 3, photo: PHOTOS.landscaping2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1600,
    materialCost: 6000, laborCost: 5000, totalCost: 11000,
    workDescription: 'Driveway replacement. Remove and haul away old concrete or asphalt. Grade and compact subbase. Pour new concrete driveway with expansion joints. Broom finish. Optional stamped concrete border. Seal coat after curing.',
    keyMaterials: ['Concrete', 'Rebar/mesh', 'Expansion joints', 'Subbase gravel', 'Seal coat', 'Forms'],
  },
  {
    id: 'landscaping-9', roomType: 'landscaping', name: 'Deck Construction',
    layoutType: 'Deck', costLevel: 3, photo: PHOTOS.landscaping3,
    propertyType: 'Single Family', beds: 4, baths: 2, sqft: 1800,
    materialCost: 8000, laborCost: 6000, totalCost: 14000,
    workDescription: 'New deck construction (16x20). Permits. Concrete footings. Pressure-treated frame. Composite decking. Aluminum railing system. Built-in stairs. Post caps with solar lights. Ledger board attachment to house with proper flashing.',
    keyMaterials: ['Concrete footings', 'Pressure-treated lumber', 'Composite decking', 'Aluminum railing', 'Stairs', 'Solar post caps', 'Ledger flashing'],
  },
  {
    id: 'landscaping-10', roomType: 'landscaping', name: 'Xeriscaping / Low-Water',
    layoutType: 'Xeriscape', costLevel: 2, photo: PHOTOS.landscaping1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1400,
    materialCost: 5000, laborCost: 3500, totalCost: 8500,
    workDescription: 'Xeriscaping / low-water landscape. Remove existing lawn. Install landscape fabric. Decorative gravel and river rock. Drought-tolerant native plants. Drip irrigation system. Accent boulders. Decomposed granite pathways. Succulent garden. Minimal maintenance design.',
    keyMaterials: ['Landscape fabric', 'Decorative gravel', 'River rock', 'Drought-tolerant plants', 'Drip irrigation', 'Accent boulders', 'Decomposed granite'],
  },

  // ─── ROOF & GUTTER TEMPLATES (8) ────────────────────────────
  {
    id: 'roof-1', roomType: 'roof', name: 'Budget Roof Repair',
    layoutType: 'Repair', costLevel: 1, photo: PHOTOS.roof1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1200,
    materialCost: 1500, laborCost: 1500, totalCost: 3000,
    workDescription: 'Budget roof repair. Replace damaged/missing shingles (up to 2 squares). Repair flashing around vents and chimney. Seal any leaks. Clean gutters. Replace damaged gutter sections. Check and repair soffit and fascia.',
    keyMaterials: ['Asphalt shingles (matching)', 'Roofing nails', 'Flashing', 'Roofing cement', 'Gutter sections', 'Caulk'],
  },
  {
    id: 'roof-2', roomType: 'roof', name: 'Standard Roof Replacement',
    layoutType: 'Full Replacement', costLevel: 2, photo: PHOTOS.roof2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 6000, laborCost: 5000, totalCost: 11000,
    workDescription: 'Standard roof replacement (25 squares). Tear off existing shingles. Inspect and replace damaged decking. Install ice and water shield in valleys and eaves. New synthetic underlayment. Install 30-year architectural shingles. New flashing at all penetrations. Ridge vent for ventilation. Clean up and haul away old materials.',
    keyMaterials: ['30-year architectural shingles', 'Synthetic underlayment', 'Ice and water shield', 'Flashing', 'Ridge vent', 'Decking (if needed)', 'Roofing nails'],
  },
  {
    id: 'roof-3', roomType: 'roof', name: 'Premium Roof with Gutters',
    layoutType: 'Full Replacement', costLevel: 3, photo: PHOTOS.roof1,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2200,
    materialCost: 12000, laborCost: 8000, totalCost: 20000,
    workDescription: 'Premium roof replacement with new gutter system (30 squares). Complete tear-off. Replace damaged decking. Ice and water shield on all eaves and valleys. Premium synthetic underlayment. 50-year dimensional shingles. All new flashing. Ridge vent and soffit vents. New seamless aluminum gutters with gutter guards. Downspouts with extensions.',
    keyMaterials: ['50-year dimensional shingles', 'Premium underlayment', 'Ice and water shield', 'Seamless aluminum gutters', 'Gutter guards', 'Downspouts', 'Ridge and soffit vents'],
  },
  {
    id: 'roof-4', roomType: 'roof', name: 'Luxury Standing Seam Metal Roof',
    layoutType: 'Metal Roof', costLevel: 4, photo: PHOTOS.roof2,
    propertyType: 'Single Family', beds: 5, baths: 4, sqft: 3500,
    materialCost: 22000, laborCost: 12000, totalCost: 34000,
    workDescription: 'Luxury standing seam metal roof (35 squares). Complete tear-off to decking. Repair/replace decking as needed. Synthetic underlayment. Standing seam metal panels in architectural color. Custom flashing at all penetrations. Snow guards if applicable. New copper or aluminum gutters. Soffit and fascia replacement. 50-year warranty.',
    keyMaterials: ['Standing seam metal panels', 'Synthetic underlayment', 'Custom flashing', 'Snow guards', 'Copper/aluminum gutters', 'New soffit and fascia'],
  },
  {
    id: 'roof-5', roomType: 'roof', name: 'Gutter Replacement Only',
    layoutType: 'Gutters', costLevel: 1, photo: PHOTOS.roof1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1400,
    materialCost: 1200, laborCost: 800, totalCost: 2000,
    workDescription: 'Gutter replacement only. Remove old gutters and downspouts. Install new seamless aluminum gutters (150 linear feet). New downspouts with splash blocks. Gutter hangers every 2 feet. Seal all joints. Test for proper drainage.',
    keyMaterials: ['Seamless aluminum gutters', 'Downspouts', 'Splash blocks', 'Gutter hangers', 'Sealant'],
  },
  {
    id: 'roof-6', roomType: 'roof', name: 'Flat Roof Replacement',
    layoutType: 'Flat Roof', costLevel: 2, photo: PHOTOS.roof2,
    propertyType: 'Multi-Family', beds: 4, baths: 2, sqft: 1800,
    materialCost: 5000, laborCost: 4000, totalCost: 9000,
    workDescription: 'Flat roof replacement (15 squares). Remove existing membrane. Inspect and repair decking. Install new insulation board. TPO or EPDM membrane installation. Flash all penetrations and edges. Install new drains. Seal all seams. 20-year warranty.',
    keyMaterials: ['TPO/EPDM membrane', 'Insulation board', 'Flashing', 'Drains', 'Adhesive/fasteners', 'Edge metal'],
  },
  {
    id: 'roof-7', roomType: 'roof', name: 'Soffit and Fascia Replacement',
    layoutType: 'Trim', costLevel: 2, photo: PHOTOS.roof1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 3000, laborCost: 2500, totalCost: 5500,
    workDescription: 'Soffit and fascia replacement. Remove damaged/rotted soffit and fascia boards. Replace with aluminum or vinyl soffit panels. New aluminum fascia covers. Ensure proper ventilation through vented soffit panels. Paint to match house. Repair any underlying wood damage.',
    keyMaterials: ['Aluminum soffit panels', 'Vented soffit panels', 'Aluminum fascia', 'J-channel', 'Paint', 'Replacement wood'],
  },
  {
    id: 'roof-8', roomType: 'roof', name: 'Chimney Repair & Reflash',
    layoutType: 'Chimney', costLevel: 2, photo: PHOTOS.roof2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1400,
    materialCost: 2500, laborCost: 2000, totalCost: 4500,
    workDescription: 'Chimney repair and reflashing. Tuckpoint deteriorated mortar joints. Replace chimney cap. Install new cricket/saddle flashing. Step flashing along chimney sides. Counter flashing into mortar joints. Seal crown with elastomeric coating. Waterproof chimney exterior.',
    keyMaterials: ['Mortar mix', 'Chimney cap', 'Step flashing', 'Counter flashing', 'Cricket/saddle', 'Elastomeric sealant', 'Waterproofing'],
  },

  // ─── EXTERIOR TEMPLATES (8) ──────────────────────────────────
  {
    id: 'exterior-1', roomType: 'exterior', name: 'Budget Exterior Paint',
    layoutType: 'Paint', costLevel: 1, photo: PHOTOS.exterior1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1200,
    materialCost: 2000, laborCost: 3000, totalCost: 5000,
    workDescription: 'Budget exterior paint job. Power wash entire exterior. Scrape and sand peeling areas. Prime bare wood. Caulk gaps and cracks. Two coats of exterior paint on body. Contrasting trim color. Paint front door accent color. Touch up shutters.',
    keyMaterials: ['Exterior paint (body)', 'Trim paint', 'Accent door paint', 'Primer', 'Caulk', 'Sandpaper'],
  },
  {
    id: 'exterior-2', roomType: 'exterior', name: 'Standard Exterior Renovation',
    layoutType: 'Full Exterior', costLevel: 2, photo: PHOTOS.exterior2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 8000, laborCost: 6000, totalCost: 14000,
    workDescription: 'Standard exterior renovation. Power wash. Replace damaged siding sections. New exterior paint (body, trim, accents). Replace front door. New exterior light fixtures. New house numbers. Replace damaged shutters. Repair/replace porch railings. New mailbox.',
    keyMaterials: ['Siding sections', 'Exterior paint', 'Front door', 'Exterior lights', 'House numbers', 'Shutters', 'Porch railings'],
  },
  {
    id: 'exterior-3', roomType: 'exterior', name: 'Premium Siding Replacement',
    layoutType: 'Siding', costLevel: 3, photo: PHOTOS.exterior2,
    propertyType: 'Single Family', beds: 4, baths: 3, sqft: 2200,
    materialCost: 15000, laborCost: 10000, totalCost: 25000,
    workDescription: 'Premium siding replacement. Remove old siding. Install house wrap. New fiber cement siding (HardiePlank). New trim boards. New window trim and sills. Paint entire exterior. New soffit and fascia if needed. Seal all penetrations.',
    keyMaterials: ['Fiber cement siding', 'House wrap', 'Trim boards', 'Window trim', 'Exterior paint', 'Soffit/fascia', 'Sealant'],
  },
  {
    id: 'exterior-4', roomType: 'exterior', name: 'Luxury Exterior Transformation',
    layoutType: 'Full Exterior', costLevel: 4, photo: PHOTOS.exterior1,
    propertyType: 'Single Family', beds: 5, baths: 4, sqft: 3500,
    materialCost: 30000, laborCost: 18000, totalCost: 48000,
    workDescription: 'Luxury exterior transformation. New fiber cement siding with stone veneer accents. Architectural window trim with headers. New entry door with sidelights and transom. Covered front porch with columns. New windows throughout. Exterior lighting package. New garage doors. Professional landscaping integration.',
    keyMaterials: ['Fiber cement siding', 'Stone veneer', 'Architectural trim', 'Entry door with sidelights', 'Porch columns', 'New windows', 'Exterior lighting'],
  },
  {
    id: 'exterior-5', roomType: 'exterior', name: 'Rental Exterior Quick Fix',
    layoutType: 'Basic', costLevel: 1, photo: PHOTOS.exterior2,
    propertyType: 'Multi-Family', beds: 2, baths: 1, sqft: 900,
    materialCost: 1000, laborCost: 1500, totalCost: 2500,
    workDescription: 'Rental exterior quick fix. Power wash siding and walkways. Touch up paint on trim and doors. Replace damaged siding pieces. Caulk windows and doors. Replace broken light fixtures. Clean gutters. Basic yard cleanup.',
    keyMaterials: ['Touch-up paint', 'Siding pieces', 'Caulk', 'Light fixtures'],
  },
  {
    id: 'exterior-6', roomType: 'exterior', name: 'Window Replacement Package',
    layoutType: 'Windows', costLevel: 3, photo: PHOTOS.exterior1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 8000, laborCost: 4000, totalCost: 12000,
    workDescription: 'Window replacement package (10 windows). Remove old windows. Install new double-pane vinyl windows. Insulate around frames. New interior and exterior trim. Caulk and seal. Low-E glass for energy efficiency.',
    keyMaterials: ['Double-pane vinyl windows (10)', 'Insulation', 'Interior trim', 'Exterior trim', 'Caulk', 'Low-E glass'],
  },
  {
    id: 'exterior-7', roomType: 'exterior', name: 'Front Porch Addition',
    layoutType: 'Porch', costLevel: 3, photo: PHOTOS.exterior2,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1400,
    materialCost: 10000, laborCost: 8000, totalCost: 18000,
    workDescription: 'Front porch addition. Concrete foundation/footings. Framing. Composite decking. Porch roof tied into existing roof. Columns. Railing system. Ceiling with fan. Exterior lighting. Steps with railing. Paint/stain to match house.',
    keyMaterials: ['Concrete footings', 'Framing lumber', 'Composite decking', 'Roofing', 'Columns', 'Railing system', 'Ceiling fan', 'Exterior lighting'],
  },
  {
    id: 'exterior-8', roomType: 'exterior', name: 'Foundation Repair & Waterproofing',
    layoutType: 'Foundation', costLevel: 3, photo: PHOTOS.exterior1,
    propertyType: 'Single Family', beds: 3, baths: 2, sqft: 1500,
    materialCost: 6000, laborCost: 8000, totalCost: 14000,
    workDescription: 'Foundation repair and waterproofing. Excavate around foundation. Repair cracks with hydraulic cement and epoxy injection. Apply waterproofing membrane. Install drain tile system. Backfill with gravel. Grade soil away from foundation. Interior crack repair. Sump pump installation if needed.',
    keyMaterials: ['Hydraulic cement', 'Epoxy injection', 'Waterproofing membrane', 'Drain tile', 'Gravel', 'Sump pump', 'Soil/grading'],
  },
];

// Helper functions
export function getTemplatesByRoom(roomType: string): SOWTemplate[] {
  return SOW_TEMPLATES.filter(t => t.roomType === roomType);
}

export function getTemplateById(id: string): SOWTemplate | undefined {
  return SOW_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByRoomAndCost(roomType: string, costLevel: number): SOWTemplate[] {
  return SOW_TEMPLATES.filter(t => t.roomType === roomType && t.costLevel === costLevel);
}

export function getCostLevelLabel(level: number): string {
  switch (level) {
    case 1: return 'Budget';
    case 2: return 'Standard';
    case 3: return 'Premium';
    case 4: return 'Luxury';
    default: return 'Unknown';
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

/**
 * Apply regional cost adjustment to a SOW template.
 * Returns a new template with adjusted costs.
 */
export function applyRegionalToTemplate(
  template: SOWTemplate,
  materialsFactor: number,
  laborFactor: number
): SOWTemplate {
  const adjustedMaterial = Math.round(template.materialCost * materialsFactor);
  const adjustedLabor = Math.round(template.laborCost * laborFactor);
  return {
    ...template,
    materialCost: adjustedMaterial,
    laborCost: adjustedLabor,
    totalCost: adjustedMaterial + adjustedLabor,
  };
}
