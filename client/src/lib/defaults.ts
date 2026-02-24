// ============================================================
// Fix & Flip Analyzer — Default Values & Rehab Presets
// ============================================================

import type { RehabPhase } from './types';
import type { RegionalCostFactor } from './regionalCosts';

// Rehab phase templates with materials + labor breakdown
// Costs are per-square-foot estimates that get multiplied by property sqft
// Duration is in calendar days

export const REHAB_PHASE_TEMPLATES: Omit<RehabPhase, 'startDay'>[] = [
  {
    id: 'demo',
    name: 'Demolition & Cleanup',
    enabled: true,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 5,
    dependencies: [],
    color: '#78716c',
  },
  {
    id: 'structural',
    name: 'Structural / Framing',
    enabled: false,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 10,
    dependencies: ['demo'],
    color: '#92400e',
  },
  {
    id: 'roofing',
    name: 'Roofing',
    enabled: false,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 5,
    dependencies: ['structural'],
    color: '#b45309',
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    enabled: true,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 7,
    dependencies: ['demo'],
    color: '#0369a1',
  },
  {
    id: 'electrical',
    name: 'Electrical',
    enabled: true,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 7,
    dependencies: ['demo'],
    color: '#ca8a04',
  },
  {
    id: 'hvac',
    name: 'HVAC',
    enabled: false,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 5,
    dependencies: ['demo'],
    color: '#0891b2',
  },
  {
    id: 'insulation',
    name: 'Insulation & Drywall',
    enabled: true,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 8,
    dependencies: ['plumbing', 'electrical'],
    color: '#6d28d9',
  },
  {
    id: 'flooring',
    name: 'Flooring',
    enabled: true,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 5,
    dependencies: ['insulation'],
    color: '#a16207',
  },
  {
    id: 'kitchen',
    name: 'Kitchen Remodel',
    enabled: true,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 10,
    dependencies: ['insulation'],
    color: '#15803d',
  },
  {
    id: 'bathrooms',
    name: 'Bathroom Remodel',
    enabled: true,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 8,
    dependencies: ['insulation'],
    color: '#0e7490',
  },
  {
    id: 'painting',
    name: 'Interior Painting',
    enabled: true,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 5,
    dependencies: ['flooring', 'kitchen', 'bathrooms'],
    color: '#7c3aed',
  },
  {
    id: 'exterior',
    name: 'Exterior / Landscaping',
    enabled: true,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 7,
    dependencies: ['demo'],
    color: '#16a34a',
  },
  {
    id: 'cleanup',
    name: 'Final Cleanup & Staging',
    enabled: true,
    materialsCost: 0,
    laborCost: 0,
    durationDays: 3,
    dependencies: ['painting', 'exterior'],
    color: '#dc2626',
  },
];

// Cost presets per rehab level (total cost per sqft, split materials/labor)
export interface LevelPreset {
  [phaseId: string]: { materials: number; labor: number; enabled: boolean; duration: number };
}

export const LIGHT_REHAB: LevelPreset = {
  demo: { materials: 0.25, labor: 0.75, enabled: true, duration: 3 },
  structural: { materials: 0, labor: 0, enabled: false, duration: 0 },
  roofing: { materials: 0, labor: 0, enabled: false, duration: 0 },
  plumbing: { materials: 0.5, labor: 1.0, enabled: true, duration: 5 },
  electrical: { materials: 0.5, labor: 1.0, enabled: true, duration: 5 },
  hvac: { materials: 0, labor: 0, enabled: false, duration: 0 },
  insulation: { materials: 0.75, labor: 1.25, enabled: true, duration: 5 },
  flooring: { materials: 2.0, labor: 1.5, enabled: true, duration: 4 },
  kitchen: { materials: 4.0, labor: 3.0, enabled: true, duration: 7 },
  bathrooms: { materials: 2.5, labor: 2.0, enabled: true, duration: 5 },
  painting: { materials: 0.75, labor: 1.25, enabled: true, duration: 4 },
  exterior: { materials: 1.0, labor: 1.5, enabled: true, duration: 5 },
  cleanup: { materials: 0.25, labor: 0.5, enabled: true, duration: 2 },
};

export const MODERATE_REHAB: LevelPreset = {
  demo: { materials: 0.5, labor: 1.5, enabled: true, duration: 5 },
  structural: { materials: 1.5, labor: 2.5, enabled: true, duration: 8 },
  roofing: { materials: 2.0, labor: 2.0, enabled: false, duration: 0 },
  plumbing: { materials: 1.5, labor: 2.5, enabled: true, duration: 7 },
  electrical: { materials: 1.5, labor: 2.5, enabled: true, duration: 7 },
  hvac: { materials: 1.5, labor: 2.0, enabled: true, duration: 5 },
  insulation: { materials: 1.5, labor: 2.0, enabled: true, duration: 8 },
  flooring: { materials: 3.5, labor: 2.5, enabled: true, duration: 5 },
  kitchen: { materials: 7.0, labor: 5.0, enabled: true, duration: 10 },
  bathrooms: { materials: 5.0, labor: 4.0, enabled: true, duration: 8 },
  painting: { materials: 1.0, labor: 2.0, enabled: true, duration: 5 },
  exterior: { materials: 2.0, labor: 3.0, enabled: true, duration: 7 },
  cleanup: { materials: 0.5, labor: 1.0, enabled: true, duration: 3 },
};

export const HEAVY_REHAB: LevelPreset = {
  demo: { materials: 1.0, labor: 3.0, enabled: true, duration: 7 },
  structural: { materials: 4.0, labor: 6.0, enabled: true, duration: 14 },
  roofing: { materials: 4.0, labor: 4.0, enabled: true, duration: 7 },
  plumbing: { materials: 3.0, labor: 5.0, enabled: true, duration: 10 },
  electrical: { materials: 3.0, labor: 5.0, enabled: true, duration: 10 },
  hvac: { materials: 3.0, labor: 4.0, enabled: true, duration: 7 },
  insulation: { materials: 2.5, labor: 3.5, enabled: true, duration: 10 },
  flooring: { materials: 5.0, labor: 4.0, enabled: true, duration: 7 },
  kitchen: { materials: 12.0, labor: 8.0, enabled: true, duration: 14 },
  bathrooms: { materials: 8.0, labor: 6.0, enabled: true, duration: 10 },
  painting: { materials: 1.5, labor: 3.0, enabled: true, duration: 7 },
  exterior: { materials: 4.0, labor: 5.0, enabled: true, duration: 10 },
  cleanup: { materials: 0.75, labor: 1.5, enabled: true, duration: 4 },
};

export function getPresetForLevel(level: 'light' | 'moderate' | 'heavy'): LevelPreset {
  switch (level) {
    case 'light': return LIGHT_REHAB;
    case 'moderate': return MODERATE_REHAB;
    case 'heavy': return HEAVY_REHAB;
  }
}

export function buildRehabPhases(
  sqft: number,
  preset: LevelPreset,
  regionalFactor?: RegionalCostFactor
): RehabPhase[] {
  const matFactor = regionalFactor?.materialsFactor ?? 1.0;
  const labFactor = regionalFactor?.laborFactor ?? 1.0;
  return REHAB_PHASE_TEMPLATES.map((t) => {
    const p = preset[t.id] || { materials: 0, labor: 0, enabled: false, duration: 0 };
    return {
      ...t,
      enabled: p.enabled,
      materialsCost: Math.round(p.materials * sqft * matFactor),
      laborCost: Math.round(p.labor * sqft * labFactor),
      durationDays: p.duration,
      startDay: 0,
    };
  });
}

// Calculate start days based on dependencies (topological scheduling)
export function schedulePhases(phases: RehabPhase[]): RehabPhase[] {
  const phaseMap = new Map(phases.map((p) => [p.id, p]));
  const scheduled = phases.map((p) => ({ ...p }));

  // Simple forward-pass scheduling
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 50) {
    changed = false;
    iterations++;
    for (const phase of scheduled) {
      if (!phase.enabled) continue;
      let earliestStart = 0;
      for (const depId of phase.dependencies) {
        const dep = scheduled.find((p) => p.id === depId);
        if (dep && dep.enabled) {
          const depEnd = dep.startDay + dep.durationDays;
          if (depEnd > earliestStart) earliestStart = depEnd;
        }
      }
      if (phase.startDay !== earliestStart) {
        phase.startDay = earliestStart;
        changed = true;
      }
    }
  }
  return scheduled;
}

export const DEFAULT_FINANCING = {
  loanToValue: 70,
  interestRate: 12,
  points: 2,
  holdingMonths: 6,
};

export const DEFAULT_CLOSING = {
  buyClosingPct: 2,
  sellClosingPct: 6,
};

export const DEFAULT_HOLDING = {
  monthlyPropertyTax: 500,
  monthlyInsurance: 150,
  monthlyUtilities: 200,
  monthlyOther: 100,
};
