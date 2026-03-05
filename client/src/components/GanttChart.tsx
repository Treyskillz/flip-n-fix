import type { RehabPhase } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

interface Props {
  phases: RehabPhase[];
  propertyAddress?: string;
}

function buildGanttPdfHtml(enabledPhases: RehabPhase[], maxDay: number, totalWeeks: number, propertyAddress?: string): string {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const totalCost = enabledPhases.reduce((sum, p) => sum + p.materialsCost + p.laborCost, 0);

  const phaseRows = enabledPhases.map(phase => {
    const leftPct = (phase.startDay / maxDay) * 100;
    const widthPct = (phase.durationDays / maxDay) * 100;
    const cost = phase.materialsCost + phase.laborCost;
    const startWeek = Math.floor(phase.startDay / 7) + 1;
    const endWeek = Math.ceil((phase.startDay + phase.durationDays) / 7);

    return `
      <tr>
        <td style="padding:6px 8px;font-weight:600;font-size:11px;white-space:nowrap">${phase.name}</td>
        <td style="padding:6px 4px;position:relative;min-width:400px">
          <div style="position:relative;height:20px;background:#f3f4f6;border-radius:3px">
            <div style="position:absolute;top:2px;bottom:2px;left:${leftPct}%;width:${Math.max(widthPct, 2)}%;background:${phase.color};border-radius:2px;display:flex;align-items:center;justify-content:center">
              <span style="color:#fff;font-size:9px;font-weight:700">${phase.durationDays}d</span>
            </div>
          </div>
        </td>
        <td style="padding:6px 8px;text-align:center;font-size:11px">Day ${phase.startDay + 1}</td>
        <td style="padding:6px 8px;text-align:center;font-size:11px">Day ${phase.startDay + phase.durationDays}</td>
        <td style="padding:6px 8px;text-align:center;font-size:11px">${phase.durationDays}</td>
        <td style="padding:6px 8px;text-align:center;font-size:11px">W${startWeek}${endWeek !== startWeek ? `-W${endWeek}` : ''}</td>
        <td style="padding:6px 8px;text-align:right;font-size:11px;font-weight:600">${formatCurrency(cost)}</td>
      </tr>`;
  }).join('');

  // Week markers for header
  const weekHeaders = Array.from({ length: Math.min(totalWeeks, 20) }, (_, i) =>
    `<div style="position:absolute;left:${((i * 7) / maxDay) * 100}%;font-size:8px;color:#999">W${i + 1}</div>`
  ).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Rehab Timeline — Gantt Chart</title>
<style>
  @page { size: landscape; margin: 0.5in; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; color: #1a1a1a; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #c53030; padding-bottom: 12px; margin-bottom: 20px; }
  .header h1 { font-size: 18px; margin: 0; color: #c53030; }
  .header .meta { text-align: right; font-size: 11px; color: #666; }
  .summary { display: flex; gap: 30px; margin-bottom: 20px; }
  .summary-item { text-align: center; }
  .summary-item .value { font-size: 20px; font-weight: 700; color: #c53030; }
  .summary-item .label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
  table { width: 100%; border-collapse: collapse; }
  thead th { background: #f8f8f8; padding: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; border-bottom: 2px solid #e5e5e5; text-align: left; }
  tbody tr { border-bottom: 1px solid #f0f0f0; }
  tbody tr:hover { background: #fafafa; }
  .footer { margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e5e5; font-size: 9px; color: #999; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Rehab Project Timeline</h1>
      ${propertyAddress ? `<p style="margin:4px 0 0;font-size:12px;color:#444">${propertyAddress}</p>` : ''}
    </div>
    <div class="meta">
      <p style="margin:0">Generated: ${dateStr}</p>
      <p style="margin:2px 0 0">Freedom One Properties</p>
    </div>
  </div>

  <div class="summary">
    <div class="summary-item">
      <div class="value">${enabledPhases.length}</div>
      <div class="label">Phases</div>
    </div>
    <div class="summary-item">
      <div class="value">${maxDay}</div>
      <div class="label">Total Days</div>
    </div>
    <div class="summary-item">
      <div class="value">${totalWeeks}</div>
      <div class="label">Weeks</div>
    </div>
    <div class="summary-item">
      <div class="value">${formatCurrency(totalCost)}</div>
      <div class="label">Total Cost</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:120px">Phase</th>
        <th>Timeline</th>
        <th style="width:70px;text-align:center">Start</th>
        <th style="width:70px;text-align:center">End</th>
        <th style="width:60px;text-align:center">Days</th>
        <th style="width:70px;text-align:center">Weeks</th>
        <th style="width:90px;text-align:right">Cost</th>
      </tr>
    </thead>
    <tbody>
      ${phaseRows}
      <tr style="border-top:2px solid #c53030;font-weight:700">
        <td style="padding:8px" colspan="4">TOTAL</td>
        <td style="padding:8px;text-align:center">${maxDay}</td>
        <td style="padding:8px;text-align:center">W1-W${totalWeeks}</td>
        <td style="padding:8px;text-align:right;color:#c53030">${formatCurrency(totalCost)}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p>This timeline is an estimate based on user-provided data. Actual durations and costs may vary. Always consult with licensed contractors.</p>
    <p>Freedom One Properties — Real Estate Investment System</p>
  </div>
</body>
</html>`;
}

export function GanttChart({ phases, propertyAddress }: Props) {
  const enabledPhases = phases.filter(p => p.enabled && p.durationDays > 0);
  if (enabledPhases.length === 0) return null;

  const maxDay = Math.max(...enabledPhases.map(p => p.startDay + p.durationDays));
  const totalWeeks = Math.ceil(maxDay / 7);

  // Generate week markers
  const weekMarkers = Array.from({ length: totalWeeks + 1 }, (_, i) => i);

  const handleExportPdf = useCallback(() => {
    const html = buildGanttPdfHtml(enabledPhases, maxDay, totalWeeks, propertyAddress);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }, [enabledPhases, maxDay, totalWeeks, propertyAddress]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span>Project Timeline</span>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-foreground">{maxDay} days ({totalWeeks} weeks)</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            className="h-6 text-[10px] gap-1 px-2"
            data-tour="gantt-export"
          >
            <Download className="w-3 h-3" />
            Export PDF
          </Button>
        </div>
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
