import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';
import { formatCurrency } from '@/lib/calculations';
import { Link } from 'wouter';
import {
  DollarSign, TrendingUp, BarChart3, PieChart, Building2,
  ArrowRight, Calculator, Target, Award, CheckCircle2,
  Clock, XCircle, FileText, Archive, Star, Loader2
} from 'lucide-react';

type DealStatus = 'active' | 'under_contract' | 'closed' | 'passed' | 'archived';

const STATUS_CONFIG: Record<DealStatus, { label: string; color: string; bg: string; chartColor: string }> = {
  active: { label: 'Active', color: 'text-blue-600', bg: 'bg-blue-100', chartColor: '#3b82f6' },
  under_contract: { label: 'Under Contract', color: 'text-amber-600', bg: 'bg-amber-100', chartColor: '#f59e0b' },
  closed: { label: 'Closed', color: 'text-green-600', bg: 'bg-green-100', chartColor: '#22c55e' },
  passed: { label: 'Passed', color: 'text-red-600', bg: 'bg-red-100', chartColor: '#ef4444' },
  archived: { label: 'Archived', color: 'text-gray-500', bg: 'bg-gray-100', chartColor: '#6b7280' },
};

function fmt(n: number): string {
  return formatCurrency(n);
}

// Simple bar chart using divs
function BarChartSimple({ data, label, valueFormatter }: {
  data: { name: string; value: number; color?: string }[];
  label: string;
  valueFormatter?: (v: number) => string;
}) {
  const maxVal = Math.max(...data.map(d => Math.abs(d.value)), 1);
  const format = valueFormatter || ((v: number) => v.toFixed(1));

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-24 text-xs text-right truncate text-muted-foreground" title={d.name}>{d.name}</div>
          <div className="flex-1 h-6 bg-secondary/40 rounded overflow-hidden relative">
            <div
              className="h-full rounded transition-all duration-500"
              style={{
                width: `${Math.max((Math.abs(d.value) / maxVal) * 100, 2)}%`,
                backgroundColor: d.color || (d.value >= 0 ? '#22c55e' : '#ef4444'),
              }}
            />
            <span className="absolute inset-0 flex items-center px-2 text-[10px] font-bold">
              {format(d.value)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Donut chart using SVG
function DonutChart({ segments, centerLabel, centerValue }: {
  segments: { label: string; value: number; color: string }[];
  centerLabel: string;
  centerValue: string;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        No data
      </div>
    );
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {segments.filter(s => s.value > 0).map((seg, i) => {
          const pct = seg.value / total;
          const dashLength = pct * circumference;
          const dashOffset = -offset * circumference;
          offset += pct;
          return (
            <circle
              key={i}
              cx="80" cy="80" r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="20"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 80 80)"
            />
          );
        })}
        <text x="80" y="74" textAnchor="middle" className="fill-foreground text-xl font-bold">{centerValue}</text>
        <text x="80" y="92" textAnchor="middle" className="fill-muted-foreground text-[10px]">{centerLabel}</text>
      </svg>
      <div className="space-y-1.5">
        {segments.filter(s => s.value > 0).map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }} />
            <span className="text-muted-foreground">{seg.label}</span>
            <span className="font-bold ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const { data: portfolio, isLoading } = trpc.deals.portfolio.useQuery();

  const [sortBy, setSortBy] = useState<'roi' | 'netProfit' | 'dealScore' | 'purchasePrice'>('roi');

  const sortedDeals = useMemo(() => {
    if (!portfolio?.deals) return [];
    return [...portfolio.deals].sort((a, b) => {
      switch (sortBy) {
        case 'roi': return b.roi - a.roi;
        case 'netProfit': return b.netProfit - a.netProfit;
        case 'dealScore': return (b.dealScore || 0) - (a.dealScore || 0);
        case 'purchasePrice': return b.purchasePrice - a.purchasePrice;
        default: return 0;
      }
    });
  }, [portfolio?.deals, sortBy]);

  const profitByStatus = useMemo(() => {
    if (!portfolio?.deals) return [];
    const grouped: Record<string, number> = {};
    portfolio.deals.forEach(d => {
      const status = d.status || 'active';
      grouped[status] = (grouped[status] || 0) + d.netProfit;
    });
    return Object.entries(grouped).map(([status, profit]) => ({
      name: STATUS_CONFIG[status as DealStatus]?.label || status,
      value: profit,
      color: STATUS_CONFIG[status as DealStatus]?.chartColor || '#6b7280',
    }));
  }, [portfolio?.deals]);

  const roiDistribution = useMemo(() => {
    if (!portfolio?.deals) return [];
    return sortedDeals.slice(0, 10).map(d => ({
      name: d.address.length > 15 ? d.address.substring(0, 15) + '...' : d.address,
      value: d.roi,
      color: d.roi >= 20 ? '#22c55e' : d.roi >= 10 ? '#3b82f6' : d.roi >= 0 ? '#f59e0b' : '#ef4444',
    }));
  }, [sortedDeals]);

  const statusSegments = useMemo(() => {
    if (!portfolio) return [];
    return [
      { label: 'Active', value: portfolio.activeDeals, color: '#3b82f6' },
      { label: 'Under Contract', value: portfolio.underContractDeals, color: '#f59e0b' },
      { label: 'Closed', value: portfolio.closedDeals, color: '#22c55e' },
      { label: 'Passed', value: portfolio.passedDeals, color: '#ef4444' },
    ];
  }, [portfolio]);

  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[oklch(0.50_0.18_25)]" />
        <p className="text-muted-foreground mt-4">Loading portfolio data...</p>
      </div>
    );
  }

  if (!portfolio || portfolio.totalDeals === 0) {
    return (
      <div className="container py-20 text-center max-w-lg mx-auto">
        <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
        <h1 className="text-2xl font-bold mb-3">Portfolio Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          You haven't saved any deals yet. Analyze a property and save it to start building your portfolio.
        </p>
        <Link href="/analyzer">
          <Button className="gap-2">
            <Calculator className="w-4 h-4" /> Analyze Your First Deal
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[oklch(0.50_0.18_25)]" />
            Portfolio Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aggregate performance across {portfolio.totalDeals} saved deal{portfolio.totalDeals !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/saved-deals">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> View All Deals
            </Button>
          </Link>
          <Link href="/analyzer">
            <Button size="sm" className="gap-1.5">
              <Calculator className="w-3.5 h-3.5" /> New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Building2 className="w-5 h-5 mx-auto text-blue-500 mb-1" />
            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Total Deals</p>
            <p className="text-2xl font-bold tabular-nums">{portfolio.totalDeals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <DollarSign className="w-5 h-5 mx-auto text-[oklch(0.50_0.18_25)] mb-1" />
            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Total Invested</p>
            <p className="text-2xl font-bold tabular-nums">{fmt(portfolio.totalInvested)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto text-green-500 mb-1" />
            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Projected Profit</p>
            <p className={`text-2xl font-bold tabular-nums ${portfolio.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {fmt(portfolio.totalProfit)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Target className="w-5 h-5 mx-auto text-purple-500 mb-1" />
            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Average ROI</p>
            <p className={`text-2xl font-bold tabular-nums ${portfolio.avgRoi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolio.avgRoi.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Award className="w-5 h-5 mx-auto text-amber-500 mb-1" />
            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Avg Deal Score</p>
            <p className="text-2xl font-bold tabular-nums">{Math.round(portfolio.avgDealScore)}/100</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <CheckCircle2 className="w-5 h-5 mx-auto text-green-500 mb-1" />
            <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Profitable</p>
            <p className="text-2xl font-bold tabular-nums text-green-600">
              {portfolio.profitableCount}/{portfolio.totalDeals}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Deal Status Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
              Deal Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              segments={statusSegments}
              centerLabel="Total Deals"
              centerValue={String(portfolio.totalDeals)}
            />
          </CardContent>
        </Card>

        {/* Profit by Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
              Profit by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartSimple
              data={profitByStatus}
              label="Net Profit"
              valueFormatter={(v) => fmt(v)}
            />
          </CardContent>
        </Card>
      </div>

      {/* ROI Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
              ROI by Deal
            </CardTitle>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roi">Sort by ROI</SelectItem>
                <SelectItem value="netProfit">Sort by Profit</SelectItem>
                <SelectItem value="dealScore">Sort by Score</SelectItem>
                <SelectItem value="purchasePrice">Sort by Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <BarChartSimple
            data={roiDistribution}
            label="Return on Investment (%)"
            valueFormatter={(v) => `${v.toFixed(1)}%`}
          />
        </CardContent>
      </Card>

      {/* Financial Summary Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-secondary/40 rounded-lg">
              <p className="text-[10px] uppercase text-muted-foreground font-semibold">Total Purchase Prices</p>
              <p className="text-lg font-bold tabular-nums">{fmt(portfolio.deals.reduce((s, d) => s + d.purchasePrice, 0))}</p>
            </div>
            <div className="p-3 bg-secondary/40 rounded-lg">
              <p className="text-[10px] uppercase text-muted-foreground font-semibold">Total Rehab Costs</p>
              <p className="text-lg font-bold tabular-nums">{fmt(portfolio.totalRehabCost)}</p>
            </div>
            <div className="p-3 bg-secondary/40 rounded-lg">
              <p className="text-[10px] uppercase text-muted-foreground font-semibold">Total ARV</p>
              <p className="text-lg font-bold tabular-nums text-[oklch(0.50_0.18_25)]">{fmt(portfolio.totalArv)}</p>
            </div>
            <div className="p-3 bg-secondary/40 rounded-lg">
              <p className="text-[10px] uppercase text-muted-foreground font-semibold">Avg Profit/Deal</p>
              <p className={`text-lg font-bold tabular-nums ${portfolio.totalProfit / portfolio.totalDeals >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {fmt(portfolio.totalProfit / portfolio.totalDeals)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deal List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
            All Deals ({sortedDeals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2 font-semibold">Property</th>
                  <th className="text-right py-2 font-semibold">Purchase</th>
                  <th className="text-right py-2 font-semibold">ARV</th>
                  <th className="text-right py-2 font-semibold">Rehab</th>
                  <th className="text-right py-2 font-semibold">Net Profit</th>
                  <th className="text-right py-2 font-semibold">ROI</th>
                  <th className="text-right py-2 font-semibold">Score</th>
                  <th className="text-center py-2 font-semibold">Status</th>
                  <th className="text-center py-2 font-semibold">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {sortedDeals.map((deal) => {
                  const status = (deal.status || 'active') as DealStatus;
                  const isProfit = deal.netProfit > 0;
                  return (
                    <tr key={deal.id} className="border-b border-border/40 hover:bg-secondary/20">
                      <td className="py-2">
                        <div className="flex items-center gap-1.5">
                          {deal.starred && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                          <div>
                            <p className="font-medium text-xs">{deal.address}</p>
                            <p className="text-[10px] text-muted-foreground">{deal.city}, {deal.state}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right tabular-nums">{fmt(deal.purchasePrice)}</td>
                      <td className="text-right tabular-nums font-medium text-[oklch(0.50_0.18_25)]">{fmt(deal.arv)}</td>
                      <td className="text-right tabular-nums">{fmt(deal.rehabCost)}</td>
                      <td className={`text-right tabular-nums font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        {fmt(deal.netProfit)}
                      </td>
                      <td className={`text-right tabular-nums font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        {deal.roi.toFixed(1)}%
                      </td>
                      <td className="text-right tabular-nums">
                        {deal.dealScore != null ? (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            deal.dealScore >= 80 ? 'bg-green-100 text-green-700' :
                            deal.dealScore >= 60 ? 'bg-blue-100 text-blue-700' :
                            deal.dealScore >= 40 ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>{deal.dealScore}</span>
                        ) : '—'}
                      </td>
                      <td className="text-center">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${STATUS_CONFIG[status].bg} ${STATUS_CONFIG[status].color}`}>
                          {STATUS_CONFIG[status].label}
                        </span>
                      </td>
                      <td className="text-center">
                        <Badge className={`text-[10px] ${
                          deal.dealVerdict === 'excellent' || deal.dealVerdict === 'good'
                            ? 'bg-green-100 text-green-700'
                            : deal.dealVerdict === 'marginal'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {deal.dealVerdict.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="text-center text-[10px] text-muted-foreground border-t pt-6 space-y-1">
        <p><strong>Freedom One Real Estate Investment System</strong></p>
        <p>Portfolio metrics are projections based on user-provided data. Actual results may vary. Always perform independent due diligence.</p>
      </div>
    </div>
  );
}
