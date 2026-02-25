import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { GanttChart } from './GanttChart';
import { formatCurrency } from '@/lib/calculations';
import type { RehabPhase } from '@/lib/types';
import type { MaterialTier, RoomScope, RoomCondition, HomeDepotProduct } from '@/lib/scopeOfWork';
import type { RehabMode } from '@/hooks/useFlipAnalyzer';
import { Hammer, ChevronDown, ChevronRight, Package, Wrench, ExternalLink, FileText } from 'lucide-react';
import { useState } from 'react';

interface Props {
  rehabMode: RehabMode;
  setRehabMode: (m: RehabMode) => void;
  rehabLevel: 'light' | 'moderate' | 'heavy';
  setRehabLevel: (l: 'light' | 'moderate' | 'heavy') => void;
  materialTier: MaterialTier;
  setMaterialTier: (t: MaterialTier) => void;
  roomScopes: RoomScope[];
  toggleRoom: (id: string) => void;
  setRoomCondition: (id: string, condition: RoomCondition) => void;
  scopeTotals: { totalMaterials: number; totalLabor: number; totalCost: number; roomBreakdowns: Array<{ roomId: string; roomName: string; materials: number; labor: number; total: number; items: Array<{ item: string; material: string; materialCost: number; laborCost: number; qty: number; product?: HomeDepotProduct }> }> };
  activePhases: RehabPhase[];
  rehabTotals: { totalMaterials: number; totalLabor: number; totalCost: number; totalDurationDays: number };
  regionalLabel: string;
}

const tierLabels: Record<MaterialTier, { label: string; desc: string; color: string }> = {
  rental: { label: 'Rental Grade', desc: 'Builder-grade, cost-effective', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  standard: { label: 'Standard', desc: 'Mid-range popular materials', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  luxury: { label: 'Luxury', desc: 'High-end premium finishes', color: 'bg-purple-100 text-purple-800 border-purple-300' },
};

const conditionLabels: Record<RoomCondition, { label: string; desc: string; color: string }> = {
  none: { label: 'No Work', desc: 'Skip this area', color: 'text-muted-foreground' },
  cosmetic: { label: 'Cosmetic', desc: 'Paint, fixtures, hardware', color: 'text-blue-600' },
  moderate: { label: 'Moderate', desc: 'Cabinets, counters, flooring', color: 'text-amber-600' },
  full: { label: 'Full Gut', desc: 'Complete tear-out & rebuild', color: 'text-red-600' },
};

export function RehabEstimator({
  rehabMode, setRehabMode,
  rehabLevel, setRehabLevel,
  materialTier, setMaterialTier,
  roomScopes, toggleRoom, setRoomCondition,
  scopeTotals, activePhases, rehabTotals,
  regionalLabel,
}: Props) {
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedRooms(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <Card className="border-l-4 border-l-[oklch(0.6_0.15_80)]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Hammer className="w-5 h-5 text-[oklch(0.6_0.15_80)]" />
          Rehab Estimator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={rehabMode === 'preset' ? 'default' : 'outline'}
            onClick={() => setRehabMode('preset')}
          >
            Quick Estimate
          </Button>
          <Button
            size="sm"
            variant={rehabMode === 'scope' ? 'default' : 'outline'}
            onClick={() => setRehabMode('scope')}
          >
            Detailed Scope of Work
          </Button>
        </div>

        {/* Material Tier Selector */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Neighborhood / Material Tier
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {(['rental', 'standard', 'luxury'] as MaterialTier[]).map(tier => (
              <button
                key={tier}
                onClick={() => setMaterialTier(tier)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  materialTier === tier
                    ? 'border-primary shadow-sm'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <Badge className={`${tierLabels[tier].color} mb-1`}>{tierLabels[tier].label}</Badge>
                <p className="text-[11px] text-muted-foreground mt-1">{tierLabels[tier].desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Estimate Mode */}
        {rehabMode === 'preset' && (
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rehab Level</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['light', 'moderate', 'heavy'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setRehabLevel(level)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    rehabLevel === level ? 'border-primary shadow-sm bg-primary/5' : 'border-border hover:border-primary/30'
                  }`}
                >
                  <span className="font-semibold text-sm capitalize">{level}</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {level === 'light' ? '$20-30/sqft' : level === 'moderate' ? '$30-50/sqft' : '$50-80/sqft'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Scope of Work Mode */}
        {rehabMode === 'scope' && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Room-by-Room Condition Assessment & Scope of Work
            </Label>
            <p className="text-xs text-muted-foreground">
              Costs adjusted for <span className="font-semibold">{regionalLabel}</span> market. Set the condition for each area to determine what work is needed.
            </p>

            {roomScopes.map(room => {
              const bd = scopeTotals.roomBreakdowns.find(b => b.roomId === room.id);
              const isExpanded = expandedRooms.has(room.id);

              return (
                <Collapsible key={room.id} open={isExpanded && room.condition !== 'none'}>
                  <div className={`rounded-lg border transition-all ${room.condition !== 'none' ? 'bg-card' : 'bg-muted/30 opacity-60'}`}>
                    <div className="flex items-center gap-3 p-3">
                      {/* Condition Selector */}
                      <Select
                        value={room.condition}
                        onValueChange={(val: string) => setRoomCondition(room.id, val as RoomCondition)}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(conditionLabels) as RoomCondition[]).map(cond => (
                            <SelectItem key={cond} value={cond}>
                              <span className={`font-medium ${conditionLabels[cond].color}`}>
                                {conditionLabels[cond].label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <CollapsibleTrigger
                        onClick={() => room.condition !== 'none' && toggleExpand(room.id)}
                        className="flex items-center gap-2 flex-1 text-left"
                        disabled={room.condition === 'none'}
                      >
                        <span className="text-lg">{room.icon}</span>
                        <div className="flex-1">
                          <span className="font-medium text-sm">{room.name}</span>
                          {room.condition !== 'none' && (
                            <span className={`ml-2 text-[10px] ${conditionLabels[room.condition].color}`}>
                              ({conditionLabels[room.condition].desc})
                            </span>
                          )}
                        </div>
                        {room.condition !== 'none' && (
                          isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </CollapsibleTrigger>
                      {room.condition !== 'none' && bd && (
                        <div className="flex items-center gap-3 text-xs tabular-nums">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Package className="w-3 h-3" /> {formatCurrency(bd.materials)}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Wrench className="w-3 h-3" /> {formatCurrency(bd.labor)}
                          </span>
                          <span className="font-semibold">{formatCurrency(bd.total)}</span>
                        </div>
                      )}
                    </div>

                    <CollapsibleContent>
                      {bd && (
                        <div className="px-3 pb-3 space-y-3">
                          {/* Work Description */}
                          <div className="flex items-start gap-2 p-2 rounded bg-secondary/40 text-xs text-muted-foreground">
                            <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <p>{room.workDescription}</p>
                          </div>

                          {/* Material Breakdown Table */}
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-border/50">
                                <th className="text-left py-1.5 font-semibold text-muted-foreground">Item</th>
                                <th className="text-left py-1.5 font-semibold text-muted-foreground">Material Selection</th>
                                <th className="text-right py-1.5 font-semibold text-muted-foreground">Qty</th>
                                <th className="text-right py-1.5 font-semibold text-muted-foreground">Materials</th>
                                <th className="text-right py-1.5 font-semibold text-muted-foreground">Labor</th>
                                <th className="text-right py-1.5 font-semibold text-muted-foreground">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bd.items.map((item, i) => (
                                <tr key={i} className="border-b border-border/20 hover:bg-secondary/30">
                                  <td className="py-1.5 font-medium">{item.item}</td>
                                  <td className="py-1.5 max-w-[220px]">
                                    <div className="truncate text-muted-foreground" title={item.material}>{item.material}</div>
                                    {item.product && (
                                      <a
                                        href={item.product.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-0.5"
                                      >
                                        <ExternalLink className="w-2.5 h-2.5" />
                                        HD #{item.product.sku} — {item.product.price}
                                      </a>
                                    )}
                                  </td>
                                  <td className="py-1.5 text-right tabular-nums">{item.qty}</td>
                                  <td className="py-1.5 text-right tabular-nums">{formatCurrency(item.materialCost)}</td>
                                  <td className="py-1.5 text-right tabular-nums">{formatCurrency(item.laborCost)}</td>
                                  <td className="py-1.5 text-right tabular-nums font-medium">{formatCurrency(item.materialCost + item.laborCost)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        )}

        {/* Totals Summary */}
        <div className="grid grid-cols-4 gap-3 p-3 rounded-lg bg-secondary/60">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Materials</p>
            <p className="text-sm font-bold tabular-nums">{formatCurrency(rehabTotals.totalMaterials)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Labor</p>
            <p className="text-sm font-bold tabular-nums">{formatCurrency(rehabTotals.totalLabor)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Rehab</p>
            <p className="text-sm font-bold tabular-nums text-primary">{formatCurrency(rehabTotals.totalCost)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration</p>
            <p className="text-sm font-bold tabular-nums">{rehabTotals.totalDurationDays} days</p>
          </div>
        </div>

        {/* Gantt Chart */}
        <GanttChart phases={activePhases} />
      </CardContent>
    </Card>
  );
}
