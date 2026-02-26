import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyInput } from './CurrencyInput';
import { Badge } from '@/components/ui/badge';
import { MarketSelector, RegionalIndicatorBar, ResetToNationalButton, AdjustmentBadge } from '@/components/MarketSelector';
import type { SubjectProperty } from '@/lib/types';
import type { RegionalCostFactor } from '@/lib/regionalCosts';
import { US_STATES, US_STATE_NAMES } from '@/lib/regionalCosts';
import type { MarketSelection } from '@/hooks/useMarketSelector';
import { MapPin, Home, DollarSign, Info } from 'lucide-react';

interface Props {
  property: SubjectProperty;
  onChange: (p: SubjectProperty) => void;
  regionalFactor: RegionalCostFactor & { matchLevel: string };
  marketSelector: {
    market: MarketSelection;
    rawSelectedMarket: MarketSelection;
    autoDetectedMarket: MarketSelection | null;
    manualOverride: boolean;
    selectMarket: (m: MarketSelection) => void;
    resetToNational: () => void;
    isNational: boolean;
  };
}

export function PropertyInput({ property, onChange, regionalFactor, marketSelector }: Props) {
  const update = (key: keyof SubjectProperty, value: string | number) => {
    onChange({ ...property, [key]: value });
  };

  const { market, autoDetectedMarket, manualOverride, selectMarket, resetToNational, isNational } = marketSelector;

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Home className="w-5 h-5 text-primary" />
          Subject Property
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Address Row */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" /> Property Address
          </Label>
          <Input
            value={property.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder="1648 Georgetown Way"
          />
          <div className="grid grid-cols-3 gap-2">
            <Input
              value={property.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="City"
            />
            <Select value={property.state} onValueChange={(v) => update('state', v)}>
              <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
              <SelectContent>
                {US_STATES.map(st => (
                  <SelectItem key={st} value={st}>{st} — {US_STATE_NAMES[st]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={property.zip}
              onChange={(e) => update('zip', e.target.value)}
              placeholder="ZIP"
            />
          </div>
        </div>

        {/* Market Selector Section */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" /> Market / Regional Pricing
          </Label>
          <div className="flex items-center gap-3 flex-wrap">
            <MarketSelector market={market} onSelect={selectMarket} />
            {!isNational && (
              <ResetToNationalButton onClick={resetToNational} />
            )}
          </div>

          {/* Auto-detection hint */}
          {property.city && property.state && autoDetectedMarket && !manualOverride && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                Auto-detected <span className="font-medium text-foreground">{autoDetectedMarket.label}</span> from property location. 
                Select a different market above to override.
              </span>
            </div>
          )}

          {/* Manual override hint */}
          {manualOverride && autoDetectedMarket && autoDetectedMarket.key !== market.key && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                Using manually selected market. Property location suggests <span className="font-medium text-foreground">{autoDetectedMarket.label}</span>.
              </span>
            </div>
          )}

          {/* Regional Cost Indicator */}
          <RegionalIndicatorBar market={market} />
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Beds</Label>
            <Input type="number" min={1} value={property.beds} onChange={(e) => update('beds', parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Baths</Label>
            <Input type="number" min={1} step={0.5} value={property.baths} onChange={(e) => update('baths', parseFloat(e.target.value) || 0)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Sq Ft</Label>
            <Input type="number" min={100} value={property.sqft} onChange={(e) => update('sqft', parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Year Built</Label>
            <Input type="number" min={1800} max={2026} value={property.yearBuilt} onChange={(e) => update('yearBuilt', parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Lot Size (sqft)</Label>
            <Input type="number" min={0} value={property.lotSizeSqft} onChange={(e) => update('lotSizeSqft', parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Property Type</Label>
            <Select value={property.propertyType} onValueChange={(v) => update('propertyType', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Single Family">Single Family</SelectItem>
                <SelectItem value="Townhouse">Townhouse</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
                <SelectItem value="Multi-Family">Multi-Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Garage</Label>
            <Select value={property.garage} onValueChange={(v) => update('garage', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="1-car">1-car</SelectItem>
                <SelectItem value="2-car">2-car</SelectItem>
                <SelectItem value="3-car">3-car</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Purchase Price */}
        <div className="space-y-1">
          <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5" /> Purchase Price
          </Label>
          <CurrencyInput
            value={property.purchasePrice}
            onChange={(v) => update('purchasePrice', v)}
            placeholder="250,000"
          />
        </div>
      </CardContent>
    </Card>
  );
}
