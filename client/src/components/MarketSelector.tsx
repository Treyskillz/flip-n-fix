import { useState, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, ChevronDown, Search, Globe, TrendingUp, TrendingDown, Minus, RotateCcw } from 'lucide-react';
import { ALL_MARKETS, getAdjustmentPercent, type MarketSelection } from '@/hooks/useMarketSelector';

// ─── ADJUSTMENT BADGE ────────────────────────────────────────

export function AdjustmentBadge({ factor, label }: { factor: number; label: string }) {
  const pct = getAdjustmentPercent(factor);
  if (pct === 0) return (
    <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
      <Minus className="w-3 h-3" /> {label} avg
    </span>
  );
  const isUp = pct > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${isUp ? 'text-amber-600' : 'text-emerald-600'}`}>
      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isUp ? '+' : ''}{pct}% {label}
    </span>
  );
}

// ─── MARKET SELECTOR DROPDOWN ────────────────────────────────

interface MarketSelectorProps {
  market: MarketSelection;
  onSelect: (m: MarketSelection) => void;
  compact?: boolean;
}

export function MarketSelector({ market, onSelect, compact = false }: MarketSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_MARKETS;
    const q = search.toLowerCase();
    return ALL_MARKETS.filter(m => m.label.toLowerCase().includes(q));
  }, [search]);

  const handleSelect = useCallback((m: MarketSelection) => {
    onSelect(m);
    setOpen(false);
    setSearch('');
  }, [onSelect]);

  const isNational = market.key === 'national';
  const combinedFactor = ((market.materialsFactor + market.laborFactor) / 2);
  const combinedPct = getAdjustmentPercent(combinedFactor);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-lg border border-border bg-background hover:border-[oklch(0.48_0.20_18)]/40 transition-colors text-sm ${compact ? 'px-2 py-1.5' : 'px-3 py-2'}`}
      >
        <MapPin className={`text-[oklch(0.48_0.20_18)] ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
        <span className="font-medium">{market.label}</span>
        {!isNational && (
          <Badge variant="outline" className={`text-[10px] ml-1 ${combinedPct > 0 ? 'text-amber-600 border-amber-300' : combinedPct < 0 ? 'text-emerald-600 border-emerald-300' : 'text-muted-foreground'}`}>
            {combinedPct > 0 ? '+' : ''}{combinedPct}%
          </Badge>
        )}
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch(''); }} />
          <div className="absolute top-full left-0 mt-1 w-80 max-h-80 bg-background border border-border rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search markets..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-border bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-[oklch(0.48_0.20_18)]/30"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-60">
              {filtered.map(m => {
                const isSelected = m.key === market.key;
                const mPct = getAdjustmentPercent((m.materialsFactor + m.laborFactor) / 2);
                return (
                  <button
                    key={m.key}
                    onClick={() => handleSelect(m)}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-secondary/50 transition-colors ${isSelected ? 'bg-[oklch(0.48_0.20_18)]/5 font-medium' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      {m.key === 'national' ? <Globe className="w-3.5 h-3.5 text-muted-foreground" /> : <MapPin className="w-3.5 h-3.5 text-muted-foreground" />}
                      {m.label}
                    </span>
                    {m.key !== 'national' && (
                      <span className={`text-[10px] font-medium ${mPct > 0 ? 'text-amber-600' : mPct < 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                        {mPct > 0 ? '+' : ''}{mPct}%
                      </span>
                    )}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No markets found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── REGIONAL INDICATOR BAR ──────────────────────────────────

export function RegionalIndicatorBar({ market }: { market: MarketSelection }) {
  if (market.key === 'national') return null;
  return (
    <div className="flex flex-wrap items-center gap-3 px-3 py-2 rounded-lg bg-[oklch(0.48_0.20_18)]/5 border border-[oklch(0.48_0.20_18)]/15">
      <MapPin className="w-3.5 h-3.5 text-[oklch(0.48_0.20_18)]" />
      <span className="text-xs font-medium">{market.label}</span>
      <span className="text-[10px] text-muted-foreground">|</span>
      <AdjustmentBadge factor={market.materialsFactor} label="materials" />
      <span className="text-[10px] text-muted-foreground">|</span>
      <AdjustmentBadge factor={market.laborFactor} label="labor" />
    </div>
  );
}

// ─── RESET BUTTON ────────────────────────────────────────────

export function ResetToNationalButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <RotateCcw className="w-3 h-3" />
      Reset to National
    </button>
  );
}
