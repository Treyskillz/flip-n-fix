import type { RehabPhase } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';

interface Props {
  phases: RehabPhase[];
}

export function GanttChart({ phases }: Props) {
  const enabledPhases = phases.filter(p => p.enabled && p.durationDays > 0);
  if (enabledPhases.length === 0) return null;

  const maxDay = Math.max(...enabledPhases.map(p => p.startDay + p.durationDays));
  const totalWeeks = Math.ceil(maxDay / 7);

  // Generate week markers
  const weekMarkers = Array.from({ length: totalWeeks + 1 }, (_, i) => i);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span>Project Timeline</span>
        <span className="font-semibold text-foreground">{maxDay} days ({totalWeeks} weeks)</span>
      </div>

      <div className="relative overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Week header */}
          <div className="flex items-center h-6 mb-1 border-b border-border/50">
            <div className="w-40 shrink-0 text-xs font-medium text-muted-foreground px-1">Phase</div>
            <div className="flex-1 relative">
              {weekMarkers.map(w => (
                <div
                  key={w}
                  className="absolute top-0 text-[10px] text-muted-foreground"
                  style={{ left: `${(w * 7 / maxDay) * 100}%` }}
                >
                  W{w + 1}
                </div>
              ))}
            </div>
            <div className="w-24 shrink-0 text-xs font-medium text-muted-foreground text-right px-1">Cost</div>
          </div>

          {/* Phase bars */}
          {enabledPhases.map((phase) => {
            const leftPct = (phase.startDay / maxDay) * 100;
            const widthPct = (phase.durationDays / maxDay) * 100;
            const totalCost = phase.materialsCost + phase.laborCost;

            return (
              <div key={phase.id} className="flex items-center h-8 group hover:bg-secondary/40 rounded transition-colors">
                <div className="w-40 shrink-0 text-xs font-medium truncate px-1" title={phase.name}>
                  {phase.name}
                </div>
                <div className="flex-1 relative h-5">
                  {/* Grid lines */}
                  {weekMarkers.map(w => (
                    <div
                      key={w}
                      className="absolute top-0 bottom-0 border-l border-border/20"
                      style={{ left: `${(w * 7 / maxDay) * 100}%` }}
                    />
                  ))}
                  {/* Bar */}
                  <div
                    className="absolute top-0.5 bottom-0.5 rounded-sm flex items-center justify-center text-[10px] font-semibold text-white shadow-sm transition-all group-hover:shadow-md"
                    style={{
                      left: `${leftPct}%`,
                      width: `${Math.max(widthPct, 2)}%`,
                      backgroundColor: phase.color,
                    }}
                  >
                    {phase.durationDays > 3 && <span className="drop-shadow-sm">{phase.durationDays}d</span>}
                  </div>
                </div>
                <div className="w-24 shrink-0 text-xs tabular-nums text-right px-1 text-muted-foreground">
                  {formatCurrency(totalCost)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
