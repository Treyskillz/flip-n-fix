// ============================================================
// Fix & Flip Analyzer — Regional Construction Cost Index
// Based on RSMeans Construction Cost Index data (national avg = 1.00)
// Materials index and Labor index are separate multipliers
// ============================================================

export interface RegionalCostFactor {
  materialsFactor: number;
  laborFactor: number;
  label: string;
}

// State-level defaults (used when no metro match found)
// Source basis: RSMeans City Cost Index, normalized to national average = 1.00
export const STATE_COST_INDEX: Record<string, RegionalCostFactor> = {
  AL: { materialsFactor: 0.92, laborFactor: 0.72, label: 'Alabama' },
  AK: { materialsFactor: 1.25, laborFactor: 1.28, label: 'Alaska' },
  AZ: { materialsFactor: 0.98, laborFactor: 0.84, label: 'Arizona' },
  AR: { materialsFactor: 0.91, laborFactor: 0.70, label: 'Arkansas' },
  CA: { materialsFactor: 1.08, laborFactor: 1.30, label: 'California' },
  CO: { materialsFactor: 1.02, laborFactor: 0.92, label: 'Colorado' },
  CT: { materialsFactor: 1.06, laborFactor: 1.15, label: 'Connecticut' },
  DE: { materialsFactor: 1.02, laborFactor: 1.05, label: 'Delaware' },
  FL: { materialsFactor: 0.98, laborFactor: 0.82, label: 'Florida' },
  GA: { materialsFactor: 0.95, laborFactor: 0.78, label: 'Georgia' },
  HI: { materialsFactor: 1.22, laborFactor: 1.25, label: 'Hawaii' },
  ID: { materialsFactor: 0.97, laborFactor: 0.78, label: 'Idaho' },
  IL: { materialsFactor: 1.02, laborFactor: 1.12, label: 'Illinois' },
  IN: { materialsFactor: 0.97, laborFactor: 0.88, label: 'Indiana' },
  IA: { materialsFactor: 0.95, laborFactor: 0.85, label: 'Iowa' },
  KS: { materialsFactor: 0.96, laborFactor: 0.82, label: 'Kansas' },
  KY: { materialsFactor: 0.93, laborFactor: 0.80, label: 'Kentucky' },
  LA: { materialsFactor: 0.95, laborFactor: 0.76, label: 'Louisiana' },
  ME: { materialsFactor: 1.01, laborFactor: 0.88, label: 'Maine' },
  MD: { materialsFactor: 1.01, laborFactor: 0.95, label: 'Maryland' },
  MA: { materialsFactor: 1.08, laborFactor: 1.22, label: 'Massachusetts' },
  MI: { materialsFactor: 0.99, laborFactor: 0.95, label: 'Michigan' },
  MN: { materialsFactor: 1.02, laborFactor: 1.05, label: 'Minnesota' },
  MS: { materialsFactor: 0.90, laborFactor: 0.68, label: 'Mississippi' },
  MO: { materialsFactor: 0.98, laborFactor: 0.92, label: 'Missouri' },
  MT: { materialsFactor: 1.00, laborFactor: 0.80, label: 'Montana' },
  NE: { materialsFactor: 0.96, laborFactor: 0.82, label: 'Nebraska' },
  NV: { materialsFactor: 1.02, laborFactor: 1.05, label: 'Nevada' },
  NH: { materialsFactor: 1.02, laborFactor: 0.95, label: 'New Hampshire' },
  NJ: { materialsFactor: 1.06, laborFactor: 1.20, label: 'New Jersey' },
  NM: { materialsFactor: 0.97, laborFactor: 0.78, label: 'New Mexico' },
  NY: { materialsFactor: 1.08, laborFactor: 1.35, label: 'New York' },
  NC: { materialsFactor: 0.94, laborFactor: 0.76, label: 'North Carolina' },
  ND: { materialsFactor: 0.97, laborFactor: 0.78, label: 'North Dakota' },
  OH: { materialsFactor: 0.98, laborFactor: 0.90, label: 'Ohio' },
  OK: { materialsFactor: 0.93, laborFactor: 0.74, label: 'Oklahoma' },
  OR: { materialsFactor: 1.04, laborFactor: 1.02, label: 'Oregon' },
  PA: { materialsFactor: 1.02, laborFactor: 1.05, label: 'Pennsylvania' },
  RI: { materialsFactor: 1.05, laborFactor: 1.10, label: 'Rhode Island' },
  SC: { materialsFactor: 0.92, laborFactor: 0.72, label: 'South Carolina' },
  SD: { materialsFactor: 0.94, laborFactor: 0.72, label: 'South Dakota' },
  TN: { materialsFactor: 0.94, laborFactor: 0.78, label: 'Tennessee' },
  TX: { materialsFactor: 0.95, laborFactor: 0.78, label: 'Texas' },
  UT: { materialsFactor: 0.99, laborFactor: 0.84, label: 'Utah' },
  VT: { materialsFactor: 1.00, laborFactor: 0.88, label: 'Vermont' },
  VA: { materialsFactor: 0.98, laborFactor: 0.85, label: 'Virginia' },
  WA: { materialsFactor: 1.06, laborFactor: 1.08, label: 'Washington' },
  WV: { materialsFactor: 0.97, laborFactor: 0.85, label: 'West Virginia' },
  WI: { materialsFactor: 1.00, laborFactor: 0.95, label: 'Wisconsin' },
  WY: { materialsFactor: 0.98, laborFactor: 0.78, label: 'Wyoming' },
  DC: { materialsFactor: 1.04, laborFactor: 1.00, label: 'Washington DC' },
};

// Metro-level overrides for major markets (higher granularity)
// Key format: "CITY, ST" (uppercase)
export const METRO_COST_INDEX: Record<string, RegionalCostFactor> = {
  // California
  'SAN FRANCISCO, CA': { materialsFactor: 1.15, laborFactor: 1.55, label: 'San Francisco, CA' },
  'SAN JOSE, CA': { materialsFactor: 1.12, laborFactor: 1.48, label: 'San Jose, CA' },
  'LOS ANGELES, CA': { materialsFactor: 1.10, laborFactor: 1.32, label: 'Los Angeles, CA' },
  'SAN DIEGO, CA': { materialsFactor: 1.08, laborFactor: 1.22, label: 'San Diego, CA' },
  'SACRAMENTO, CA': { materialsFactor: 1.06, laborFactor: 1.25, label: 'Sacramento, CA' },
  'OAKLAND, CA': { materialsFactor: 1.14, laborFactor: 1.50, label: 'Oakland, CA' },
  'FRESNO, CA': { materialsFactor: 1.04, laborFactor: 1.18, label: 'Fresno, CA' },
  'SALINAS, CA': { materialsFactor: 1.06, laborFactor: 1.28, label: 'Salinas, CA' },
  'BAKERSFIELD, CA': { materialsFactor: 1.04, laborFactor: 1.18, label: 'Bakersfield, CA' },
  'RIVERSIDE, CA': { materialsFactor: 1.06, laborFactor: 1.20, label: 'Riverside, CA' },
  'STOCKTON, CA': { materialsFactor: 1.05, laborFactor: 1.22, label: 'Stockton, CA' },
  // New York
  'NEW YORK, NY': { materialsFactor: 1.15, laborFactor: 1.65, label: 'New York City, NY' },
  'MANHATTAN, NY': { materialsFactor: 1.18, laborFactor: 1.72, label: 'Manhattan, NY' },
  'BROOKLYN, NY': { materialsFactor: 1.15, laborFactor: 1.60, label: 'Brooklyn, NY' },
  'BUFFALO, NY': { materialsFactor: 1.02, laborFactor: 1.08, label: 'Buffalo, NY' },
  // Texas
  'HOUSTON, TX': { materialsFactor: 0.97, laborFactor: 0.82, label: 'Houston, TX' },
  'DALLAS, TX': { materialsFactor: 0.96, laborFactor: 0.80, label: 'Dallas, TX' },
  'AUSTIN, TX': { materialsFactor: 0.98, laborFactor: 0.85, label: 'Austin, TX' },
  'SAN ANTONIO, TX': { materialsFactor: 0.94, laborFactor: 0.76, label: 'San Antonio, TX' },
  // Florida
  'MIAMI, FL': { materialsFactor: 1.02, laborFactor: 0.88, label: 'Miami, FL' },
  'ORLANDO, FL': { materialsFactor: 0.98, laborFactor: 0.82, label: 'Orlando, FL' },
  'TAMPA, FL': { materialsFactor: 0.97, laborFactor: 0.80, label: 'Tampa, FL' },
  'JACKSONVILLE, FL': { materialsFactor: 0.96, laborFactor: 0.78, label: 'Jacksonville, FL' },
  // Illinois
  'CHICAGO, IL': { materialsFactor: 1.06, laborFactor: 1.28, label: 'Chicago, IL' },
  // Washington
  'SEATTLE, WA': { materialsFactor: 1.10, laborFactor: 1.18, label: 'Seattle, WA' },
  // Colorado
  'DENVER, CO': { materialsFactor: 1.04, laborFactor: 0.96, label: 'Denver, CO' },
  // Massachusetts
  'BOSTON, MA': { materialsFactor: 1.12, laborFactor: 1.35, label: 'Boston, MA' },
  // Georgia
  'ATLANTA, GA': { materialsFactor: 0.97, laborFactor: 0.82, label: 'Atlanta, GA' },
  // Arizona
  'PHOENIX, AZ': { materialsFactor: 0.99, laborFactor: 0.86, label: 'Phoenix, AZ' },
  'TUCSON, AZ': { materialsFactor: 0.96, laborFactor: 0.80, label: 'Tucson, AZ' },
  // Nevada
  'LAS VEGAS, NV': { materialsFactor: 1.04, laborFactor: 1.08, label: 'Las Vegas, NV' },
  // Oregon
  'PORTLAND, OR': { materialsFactor: 1.06, laborFactor: 1.08, label: 'Portland, OR' },
  // Michigan
  'DETROIT, MI': { materialsFactor: 1.00, laborFactor: 1.02, label: 'Detroit, MI' },
  // Pennsylvania
  'PHILADELPHIA, PA': { materialsFactor: 1.06, laborFactor: 1.22, label: 'Philadelphia, PA' },
  'PITTSBURGH, PA': { materialsFactor: 1.02, laborFactor: 1.05, label: 'Pittsburgh, PA' },
  // Ohio
  'COLUMBUS, OH': { materialsFactor: 0.99, laborFactor: 0.90, label: 'Columbus, OH' },
  'CLEVELAND, OH': { materialsFactor: 1.00, laborFactor: 0.95, label: 'Cleveland, OH' },
  // North Carolina
  'CHARLOTTE, NC': { materialsFactor: 0.95, laborFactor: 0.78, label: 'Charlotte, NC' },
  'RALEIGH, NC': { materialsFactor: 0.95, laborFactor: 0.78, label: 'Raleigh, NC' },
  // Tennessee
  'NASHVILLE, TN': { materialsFactor: 0.96, laborFactor: 0.82, label: 'Nashville, TN' },
  'MEMPHIS, TN': { materialsFactor: 0.93, laborFactor: 0.76, label: 'Memphis, TN' },
  // Maryland
  'BALTIMORE, MD': { materialsFactor: 1.02, laborFactor: 0.98, label: 'Baltimore, MD' },
  // DC
  'WASHINGTON, DC': { materialsFactor: 1.04, laborFactor: 1.00, label: 'Washington, DC' },
  // Minnesota
  'MINNEAPOLIS, MN': { materialsFactor: 1.04, laborFactor: 1.10, label: 'Minneapolis, MN' },
  // Missouri
  'ST LOUIS, MO': { materialsFactor: 1.00, laborFactor: 0.98, label: 'St. Louis, MO' },
  'KANSAS CITY, MO': { materialsFactor: 0.98, laborFactor: 0.92, label: 'Kansas City, MO' },
  // Indiana
  'INDIANAPOLIS, IN': { materialsFactor: 0.98, laborFactor: 0.90, label: 'Indianapolis, IN' },
  // Louisiana
  'NEW ORLEANS, LA': { materialsFactor: 0.97, laborFactor: 0.80, label: 'New Orleans, LA' },
  // Hawaii
  'HONOLULU, HI': { materialsFactor: 1.25, laborFactor: 1.30, label: 'Honolulu, HI' },
};

// US state abbreviations for validation
export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
];

export const US_STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'Washington DC',
};

/**
 * Look up regional cost factors for a given city + state.
 * First tries metro-level match, then falls back to state-level.
 * Returns national average (1.00/1.00) if no match found.
 */
export function getRegionalCostFactor(city: string, state: string): RegionalCostFactor & { matchLevel: 'metro' | 'state' | 'national' } {
  const stateUpper = state.trim().toUpperCase();
  const cityUpper = city.trim().toUpperCase();

  // Try metro match
  const metroKey = `${cityUpper}, ${stateUpper}`;
  if (METRO_COST_INDEX[metroKey]) {
    return { ...METRO_COST_INDEX[metroKey], matchLevel: 'metro' };
  }

  // Try partial metro match (city name contained in a metro key)
  for (const [key, val] of Object.entries(METRO_COST_INDEX)) {
    const [metroCity] = key.split(', ');
    if (cityUpper.includes(metroCity) || metroCity.includes(cityUpper)) {
      return { ...val, matchLevel: 'metro' };
    }
  }

  // Fall back to state
  if (STATE_COST_INDEX[stateUpper]) {
    return { ...STATE_COST_INDEX[stateUpper], matchLevel: 'state' };
  }

  // National average fallback
  return { materialsFactor: 1.00, laborFactor: 1.00, label: 'National Average', matchLevel: 'national' };
}

/**
 * Apply regional cost factors to rehab phase costs.
 * Materials and labor are adjusted independently.
 */
export function applyRegionalAdjustment(
  baseMaterials: number,
  baseLabor: number,
  factor: RegionalCostFactor
): { materials: number; labor: number } {
  return {
    materials: Math.round(baseMaterials * factor.materialsFactor),
    labor: Math.round(baseLabor * factor.laborFactor),
  };
}
