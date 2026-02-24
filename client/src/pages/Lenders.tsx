import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HARD_MONEY_LENDERS } from '@/lib/lenders';
import { ExternalLink, Landmark, Globe, DollarSign, Clock, Percent } from 'lucide-react';
import { useState } from 'react';

export default function Lenders() {
  const [filter, setFilter] = useState<'all' | 'national' | 'regional'>('all');
  const filtered = filter === 'all' ? HARD_MONEY_LENDERS : HARD_MONEY_LENDERS.filter(l => l.type === filter);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Landmark className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Hard Money Lender Directory</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            A curated list of reputable hard money and private lenders for fix & flip, bridge, and rental loans. 
            Rates and terms are approximate and subject to change — always verify directly with the lender.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'national', 'regional'] as const).map(f => (
            <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All Lenders' : f === 'national' ? 'National' : 'Regional'}
            </Button>
          ))}
          <span className="text-sm text-muted-foreground self-center ml-2">{filtered.length} lenders</span>
        </div>

        {/* Lender Cards */}
        <div className="grid gap-4">
          {filtered.map((lender, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Left: Name and info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold">{lender.name}</h3>
                      <Badge variant={lender.type === 'national' ? 'default' : 'secondary'} className="text-xs">
                        {lender.type}
                      </Badge>
                      {lender.loanTypes.map(lt => (
                        <Badge key={lt} variant="outline" className="text-xs">{lt}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{lender.states}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{lender.notes}</p>
                  </div>

                  {/* Right: Key metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:w-[400px] shrink-0">
                    <div className="p-2 rounded-md bg-secondary/60">
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                        <Percent className="w-3 h-3" /> Rate
                      </div>
                      <p className="text-sm font-bold tabular-nums">{lender.rateRange}</p>
                    </div>
                    <div className="p-2 rounded-md bg-secondary/60">
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                        <DollarSign className="w-3 h-3" /> Points
                      </div>
                      <p className="text-sm font-bold tabular-nums">{lender.pointsRange}</p>
                    </div>
                    <div className="p-2 rounded-md bg-secondary/60">
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                        <Clock className="w-3 h-3" /> Close
                      </div>
                      <p className="text-sm font-bold tabular-nums">{lender.closingSpeed}</p>
                    </div>
                    <div className="p-2 rounded-md bg-secondary/60">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">LTV Max</p>
                      <p className="text-sm font-bold tabular-nums">{lender.ltvMax}</p>
                    </div>
                    <div className="p-2 rounded-md bg-secondary/60">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Min Loan</p>
                      <p className="text-sm font-bold tabular-nums">{lender.minLoan}</p>
                    </div>
                    <div className="p-2 rounded-md bg-secondary/60">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Max Loan</p>
                      <p className="text-sm font-bold tabular-nums">{lender.maxLoan}</p>
                    </div>
                  </div>
                </div>

                {/* Visit Website */}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <a href={lender.website} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> Visit Website
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          <p className="font-semibold mb-1">Disclaimer</p>
          <p>
            This directory is provided for informational purposes only. Rates, terms, and availability are subject to change. 
            We do not endorse any specific lender. Always perform your own due diligence and compare multiple lenders before committing to a loan. 
            Consult with a financial advisor or attorney before making financing decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
