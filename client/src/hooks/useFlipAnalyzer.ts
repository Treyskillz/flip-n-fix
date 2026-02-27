import { useState, useMemo, useCallback } from 'react';
import type { SubjectProperty, CompProperty, RehabPhase, FinancingDetails, ClosingCosts, HoldingCosts, ProfitAnalysis, LenderType } from '@/lib/types';
import type { MaterialTier, RoomScope, RoomCondition, HomeDepotProduct } from '@/lib/scopeOfWork';
import { getDefaultRoomScopes, calculateRoomCost } from '@/lib/scopeOfWork';
import { getRegionalCostFactor, type RegionalCostFactor } from '@/lib/regionalCosts';
import { buildRehabPhases, schedulePhases, getPresetForLevel, DEFAULT_FINANCING, DEFAULT_PRIVATE_MONEY, DEFAULT_GAP_FUNDING, DEFAULT_CLOSING, DEFAULT_HOLDING } from '@/lib/defaults';
import { calculateFinancing, calculateClosingCosts, calculateHoldingCosts, calculateRehabTotals, calculateProfitability, scoreComp, scoreCompSet } from '@/lib/calculations';
import { useMarketSelector } from '@/hooks/useMarketSelector';
import { nanoid } from 'nanoid';

export type RehabMode = 'preset' | 'scope';

export function useFlipAnalyzer() {
  // ─── Subject Property ───────────────────────────────────────
  const [property, setProperty] = useState<SubjectProperty>({
    address: '', city: '', state: '', zip: '',
    beds: 3, baths: 2, sqft: 1500, lotSizeSqft: 5000,
    yearBuilt: 1990, propertyType: 'Single Family', garage: '2-car',
    purchasePrice: 0,
  });

  // ─── Shared Market Selector ────────────────────────────────
  const marketSelector = useMarketSelector({
    autoDetectCity: property.city,
    autoDetectState: property.state,
  });

  // ─── Regional Cost Factor ──────────────────────────────────
  const regionalFactor = useMemo<RegionalCostFactor & { matchLevel: string }>(() => {
    const m = marketSelector.market;
    if (m.key === 'national') {
      if (property.city && property.state) {
        return getRegionalCostFactor(property.city, property.state);
      }
      return { materialsFactor: 1, laborFactor: 1, label: 'National Average', matchLevel: 'national' };
    }
    return {
      materialsFactor: m.materialsFactor,
      laborFactor: m.laborFactor,
      label: m.label,
      matchLevel: m.key.startsWith('metro:') ? 'metro' : m.key.startsWith('state:') ? 'state' : 'national',
    };
  }, [marketSelector.market, property.city, property.state]);

  // ─── Comps (Retail Sales Only — for market validation) ─────
  const [comps, setComps] = useState<CompProperty[]>([]);

  const addComp = useCallback((comp: Omit<CompProperty, 'id' | 'pricePerSqft'>) => {
    const pricePerSqft = comp.sqft > 0 ? Math.round(comp.salePrice / comp.sqft) : 0;
    setComps(prev => [...prev, { ...comp, id: nanoid(), pricePerSqft }]);
  }, []);

  const removeComp = useCallback((id: string) => {
    setComps(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateComp = useCallback((id: string, updates: Partial<CompProperty>) => {
    setComps(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, ...updates };
      updated.pricePerSqft = updated.sqft > 0 ? Math.round(updated.salePrice / updated.sqft) : 0;
      return updated;
    }));
  }, []);

  // Comp quality scoring
  const compScores = useMemo(() => {
    return comps.map(c => ({ comp: c, score: scoreComp(c, property) }));
  }, [comps, property]);

  const compSetQuality = useMemo(() => {
    return scoreCompSet(comps, property);
  }, [comps, property]);

  // ─── Material Tier ─────────────────────────────────────────
  const [materialTier, setMaterialTier] = useState<MaterialTier>('standard');

  // ─── Rehab Mode ────────────────────────────────────────────
  const [rehabMode, setRehabMode] = useState<RehabMode>('scope');

  // ─── Preset Rehab (simple mode) ────────────────────────────
  const [rehabLevel, setRehabLevel] = useState<'light' | 'moderate' | 'heavy'>('moderate');
  const presetPhases = useMemo(() => {
    const preset = getPresetForLevel(rehabLevel);
    const raw = buildRehabPhases(property.sqft, preset, regionalFactor);
    return schedulePhases(raw);
  }, [rehabLevel, property.sqft, regionalFactor]);

  // ─── Scope of Work (detailed mode) ─────────────────────────
  const [roomScopes, setRoomScopes] = useState<RoomScope[]>(getDefaultRoomScopes);

  const toggleRoom = useCallback((roomId: string) => {
    setRoomScopes(prev => prev.map(r => r.id === roomId ? { ...r, enabled: !r.enabled, condition: !r.enabled ? 'moderate' : 'none' } : r));
  }, []);

  const setRoomCondition = useCallback((roomId: string, condition: RoomCondition) => {
    setRoomScopes(prev => prev.map(r => r.id === roomId ? { ...r, condition, enabled: condition !== 'none' } : r));
  }, []);

  const scopeTotals = useMemo(() => {
    let totalMaterials = 0;
    let totalLabor = 0;
    const roomBreakdowns: Array<{ roomId: string; roomName: string; materials: number; labor: number; total: number; items: Array<{ item: string; material: string; materialCost: number; laborCost: number; qty: number; product?: HomeDepotProduct }> }> = [];

    for (const room of roomScopes) {
      if (!room.enabled) continue;
      const result = calculateRoomCost(
        room, materialTier, property.sqft,
        property.baths, property.beds,
        regionalFactor.materialsFactor, regionalFactor.laborFactor
      );
      totalMaterials += result.totalMaterials;
      totalLabor += result.totalLabor;
      roomBreakdowns.push({
        roomId: room.id,
        roomName: room.name,
        materials: result.totalMaterials,
        labor: result.totalLabor,
        total: result.totalCost,
        items: result.itemBreakdown,
      });
    }

    return { totalMaterials, totalLabor, totalCost: totalMaterials + totalLabor, roomBreakdowns };
  }, [roomScopes, materialTier, property.sqft, property.baths, property.beds, regionalFactor]);

  // Build Gantt phases from scope of work
  const scopeGanttPhases = useMemo<RehabPhase[]>(() => {
    const phases: RehabPhase[] = roomScopes
      .filter(r => r.enabled)
      .map(r => {
        const bd = scopeTotals.roomBreakdowns.find(b => b.roomId === r.id);
        const templateMap: Record<string, { deps: string[]; color: string; duration: number }> = {
          demo: { deps: [], color: '#78716c', duration: 5 },
          structural: { deps: ['demo'], color: '#92400e', duration: 10 },
          roofing: { deps: ['structural'], color: '#b45309', duration: 5 },
          plumbing: { deps: ['demo'], color: '#0369a1', duration: 7 },
          electrical: { deps: ['demo'], color: '#ca8a04', duration: 7 },
          hvac: { deps: ['demo'], color: '#0891b2', duration: 5 },
          insulation: { deps: ['plumbing', 'electrical'], color: '#6d28d9', duration: 8 },
          flooring: { deps: ['insulation'], color: '#a16207', duration: 5 },
          kitchen: { deps: ['insulation'], color: '#15803d', duration: 10 },
          bathrooms: { deps: ['insulation'], color: '#0e7490', duration: 8 },
          painting: { deps: ['flooring', 'kitchen', 'bathrooms'], color: '#7c3aed', duration: 5 },
          exterior: { deps: ['demo'], color: '#16a34a', duration: 7 },
          cleanup: { deps: ['painting', 'exterior'], color: '#dc2626', duration: 3 },
        };
        const tmpl = templateMap[r.id] || { deps: [], color: '#6b7280', duration: 7 };
        return {
          id: r.id,
          name: r.name,
          enabled: true,
          materialsCost: bd?.materials || 0,
          laborCost: bd?.labor || 0,
          durationDays: tmpl.duration,
          startDay: 0,
          dependencies: tmpl.deps.filter(d => roomScopes.find(rs => rs.id === d)?.enabled),
          color: tmpl.color,
        };
      });
    return schedulePhases(phases);
  }, [roomScopes, scopeTotals]);

  // ─── Active rehab data based on mode ───────────────────────
  const activePhases = rehabMode === 'preset' ? presetPhases : scopeGanttPhases;
  const rehabTotals = rehabMode === 'preset'
    ? calculateRehabTotals(presetPhases)
    : { totalMaterials: scopeTotals.totalMaterials, totalLabor: scopeTotals.totalLabor, totalCost: scopeTotals.totalCost, totalDurationDays: scopeGanttPhases.reduce((m, p) => Math.max(m, p.startDay + p.durationDays), 0) };

  // ─── ARV Calculation ────────────────────────────────────────
  // ARV = After Repair Value = what the property will SELL for after rehab
  // Determined by comparable RETAIL sales of similar renovated properties
  // Rehab budget is a COST input, NOT part of the ARV

  // Comp-based ARV (PRIMARY — from standard retail sales)
  // Comps MUST be standard retail sales, NOT distressed
  const compBasedArv = useMemo(() => {
    if (comps.length === 0) return 0;
    const validComps = comps.filter(c => c.pricePerSqft > 0);
    if (validComps.length === 0) return 0;
    const avgPpsf = validComps.reduce((s, c) => s + c.pricePerSqft, 0) / validComps.length;
    return Math.round(avgPpsf * property.sqft);
  }, [comps, property.sqft]);

  // ARV Override (manual user entry — e.g. from appraiser or agent)
  const [arvOverride, setArvOverride] = useState<number | null>(null);

  // Effective ARV priority: Override > Comp-based
  // If no comps and no override, ARV is 0 (user must provide data)
  const effectiveArv = arvOverride ?? compBasedArv;

  // Cost Basis (what you have INTO the deal — for analysis, NOT the ARV)
  const costBasis = useMemo(() => {
    return (property.purchasePrice || 0) + (rehabTotals.totalCost || 0);
  }, [property.purchasePrice, rehabTotals.totalCost]);

  // ─── Financing ─────────────────────────────────────────────
  const [useHardMoney, setUseHardMoney] = useState(true);
  const [lenderType, setLenderType] = useState<LenderType>('hard_money');
  const [finParams, setFinParams] = useState(DEFAULT_FINANCING);

  // Gap Funder
  const [useGapFunding, setUseGapFunding] = useState(false);
  const [gapParams, setGapParams] = useState(DEFAULT_GAP_FUNDING);

  // Switch lender type and update defaults
  const switchLenderType = useCallback((type: LenderType) => {
    setLenderType(type);
    if (type === 'hard_money') {
      setFinParams(DEFAULT_FINANCING);
    } else {
      setFinParams(DEFAULT_PRIVATE_MONEY);
    }
  }, []);

  const financing = useMemo<FinancingDetails>(() => {
    const f = calculateFinancing(
      property.purchasePrice, rehabTotals.totalCost,
      finParams.loanToValue, finParams.interestRate,
      finParams.points, finParams.holdingMonths,
      // Gap funder params
      useGapFunding,
      gapParams.coveragePercent,
      gapParams.interestRate,
      gapParams.points
    );
    return { ...f, useHardMoney };
  }, [property.purchasePrice, rehabTotals.totalCost, finParams, useHardMoney, useGapFunding, gapParams]);

  // ─── Closing Costs ─────────────────────────────────────────
  const [closingParams, setClosingParams] = useState(DEFAULT_CLOSING);

  const closing = useMemo<ClosingCosts>(() => {
    return calculateClosingCosts(property.purchasePrice, effectiveArv, closingParams.buyClosingPct, closingParams.sellClosingPct);
  }, [property.purchasePrice, effectiveArv, closingParams]);

  // ─── Holding Costs ─────────────────────────────────────────
  const [holdingParams, setHoldingParams] = useState(DEFAULT_HOLDING);

  const holding = useMemo<HoldingCosts>(() => {
    return calculateHoldingCosts(
      holdingParams.monthlyPropertyTax, holdingParams.monthlyInsurance,
      holdingParams.monthlyUtilities, holdingParams.monthlyOther,
      finParams.holdingMonths
    );
  }, [holdingParams, finParams.holdingMonths]);

  // ─── Target ROI ────────────────────────────────────────────
  const [targetROI, setTargetROI] = useState(20);

  // ─── Profitability ─────────────────────────────────────────
  const profit = useMemo<ProfitAnalysis>(() => {
    return calculateProfitability(
      property.purchasePrice, rehabTotals.totalCost,
      effectiveArv, financing, closing, holding, targetROI
    );
  }, [property.purchasePrice, rehabTotals.totalCost, effectiveArv, financing, closing, holding, targetROI]);

  return {
    // Property
    property, setProperty,
    // Regional / Market
    regionalFactor,
    marketSelector,
    // Comps (retail sales only — for market validation)
    comps, addComp, removeComp, updateComp,
    compScores, compSetQuality,
    // ARV: Comps are primary, override is manual entry
    compBasedArv, costBasis,
    arvOverride, setArvOverride, effectiveArv,
    // Material tier
    materialTier, setMaterialTier,
    // Rehab
    rehabMode, setRehabMode,
    rehabLevel, setRehabLevel,
    presetPhases,
    roomScopes, setRoomScopes, toggleRoom, setRoomCondition,
    scopeTotals, scopeGanttPhases,
    activePhases, rehabTotals,
    // Financing
    useHardMoney, setUseHardMoney,
    lenderType, switchLenderType,
    finParams, setFinParams,
    useGapFunding, setUseGapFunding,
    gapParams, setGapParams,
    financing,
    // Closing
    closingParams, setClosingParams, closing,
    // Holding
    holdingParams, setHoldingParams, holding,
    // Profit
    profit,
    targetROI, setTargetROI,
  };
}
