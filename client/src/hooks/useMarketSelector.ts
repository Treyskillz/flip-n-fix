import { useState, useMemo, useCallback, useEffect } from 'react';
import { METRO_COST_INDEX, STATE_COST_INDEX } from '@/lib/regionalCosts';

// ─── SHARED CONSTANTS ────────────────────────────────────────
export const MARKET_STORAGE_KEY = 'sow-selected-market';

export interface MarketSelection {
  key: string;
  label: string;
  materialsFactor: number;
  laborFactor: number;
}

// Build sorted list of all available markets for the dropdown
export const ALL_MARKETS: MarketSelection[] = (() => {
  const markets: MarketSelection[] = [
    { key: 'national', label: 'National Average', materialsFactor: 1.0, laborFactor: 1.0 },
  ];
  // Add metro markets
  Object.entries(METRO_COST_INDEX).forEach(([key, val]) => {
    markets.push({ key: `metro:${key}`, label: val.label, materialsFactor: val.materialsFactor, laborFactor: val.laborFactor });
  });
  // Add state-level markets
  Object.entries(STATE_COST_INDEX).forEach(([stateCode, val]) => {
    markets.push({ key: `state:${stateCode}`, label: `${val.label} (State Avg)`, materialsFactor: val.materialsFactor, laborFactor: val.laborFactor });
  });
  // Sort alphabetically (national first, then metros, then states)
  return [markets[0], ...markets.slice(1).sort((a, b) => a.label.localeCompare(b.label))];
})();

export function loadSavedMarket(): MarketSelection {
  try {
    const saved = localStorage.getItem(MARKET_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const found = ALL_MARKETS.find(m => m.key === parsed.key);
      if (found) return found;
    }
  } catch { /* ignore */ }
  return ALL_MARKETS[0]; // National Average
}

export function getAdjustmentPercent(factor: number): number {
  return Math.round((factor - 1) * 100);
}

/**
 * Find the best matching market for a given city + state combination.
 * Returns the matching market or null if no specific match found.
 */
export function findMarketForLocation(city: string, state: string): MarketSelection | null {
  if (!city && !state) return null;
  
  const cityUpper = city.trim().toUpperCase();
  const stateUpper = state.trim().toUpperCase();
  
  // Try exact metro match
  const metroKey = `${cityUpper}, ${stateUpper}`;
  const exactMetro = ALL_MARKETS.find(m => m.key === `metro:${metroKey}`);
  if (exactMetro) return exactMetro;
  
  // Try partial metro match
  for (const m of ALL_MARKETS) {
    if (!m.key.startsWith('metro:')) continue;
    const metroCity = m.key.replace('metro:', '').split(', ')[0];
    if (cityUpper && (cityUpper.includes(metroCity) || metroCity.includes(cityUpper))) {
      return m;
    }
  }
  
  // Try state match
  if (stateUpper) {
    const stateMarket = ALL_MARKETS.find(m => m.key === `state:${stateUpper}`);
    if (stateMarket) return stateMarket;
  }
  
  return null;
}

/**
 * Shared hook for market selection that syncs across pages via localStorage.
 * Supports optional auto-detection from city/state and manual override.
 */
export function useMarketSelector(options?: {
  autoDetectCity?: string;
  autoDetectState?: string;
}) {
  const [market, setMarketState] = useState<MarketSelection>(loadSavedMarket);
  const [manualOverride, setManualOverride] = useState<boolean>(() => {
    // If there's a saved market that isn't national, user has manually selected
    const saved = loadSavedMarket();
    return saved.key !== 'national';
  });

  // Auto-detect market from city/state when no manual override
  const autoDetectedMarket = useMemo(() => {
    if (options?.autoDetectCity || options?.autoDetectState) {
      return findMarketForLocation(
        options.autoDetectCity || '',
        options.autoDetectState || ''
      );
    }
    return null;
  }, [options?.autoDetectCity, options?.autoDetectState]);

  // The effective market: manual selection takes priority, then auto-detection, then national
  const effectiveMarket = useMemo(() => {
    if (manualOverride && market.key !== 'national') return market;
    if (autoDetectedMarket) return autoDetectedMarket;
    return market;
  }, [market, manualOverride, autoDetectedMarket]);

  // Listen for storage changes from other pages/tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === MARKET_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const found = ALL_MARKETS.find(m => m.key === parsed.key);
          if (found) {
            setMarketState(found);
            setManualOverride(found.key !== 'national');
          }
        } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const selectMarket = useCallback((m: MarketSelection) => {
    setMarketState(m);
    setManualOverride(m.key !== 'national');
    localStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify({ key: m.key }));
  }, []);

  const resetToNational = useCallback(() => {
    const national = ALL_MARKETS[0];
    setMarketState(national);
    setManualOverride(false);
    localStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify({ key: 'national' }));
  }, []);

  return {
    market: effectiveMarket,
    rawSelectedMarket: market,
    autoDetectedMarket,
    manualOverride,
    selectMarket,
    resetToNational,
    isNational: effectiveMarket.key === 'national',
  };
}
