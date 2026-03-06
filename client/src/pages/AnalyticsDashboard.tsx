import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Link } from 'wouter';
import {
  BarChart3, TrendingUp, DollarSign, Target, Loader2,
  Lock, Crown, ArrowUpRight, ArrowDownRight, Activity,
  PieChart, MapPin, Kanban, Download
} from 'lucide-react';
import { useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import { formatCurrency } from '@/lib/calculations';

// ─── Chart Component Wrappers ─────────────────────────────────
function LineChart({ data, labels, label, color, yPrefix, yFormat }: {
  data: number[];
  labels: string[];
  label: string;
  color: string;
  yPrefix?: string;
  yFormat?: (v: number) => string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data,
          borderColor: color,
          backgroundColor: color + '20',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: {
            beginAtZero: true,
            ticks: {
              font: { size: 10 },
              callback: (v: string | number) => yFormat ? yFormat(v as number) : (yPrefix || '') + v,
            },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [data, labels, label, color, yPrefix, yFormat]);

  return <canvas ref={canvasRef} />;
}

function BarChartComponent({ data, labels, label, color }: {
  data: number[];
  labels: string[];
  label: string;
  color: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label,
          data,
          backgroundColor: color + '80',
          borderColor: color,
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [data, labels, label, color]);

  return <canvas ref={canvasRef} />;
}

function DoughnutChart({ data, labels, colors }: {
  data: number[];
  labels: string[];
  colors: string[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [data, labels, colors]);

  return <canvas ref={canvasRef} />;
}

// ─── Format Helpers ──────────────────────────────────────────
function fmtMonth(m: string) {
  const [y, mo] = m.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(mo) - 1]} '${y.slice(2)}`;
}

function fmtCurrency(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

// ─── Main Component ──────────────────────────────────────────
export default function AnalyticsDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: subStatus } = trpc.subscription.status.useQuery(undefined, { enabled: isAuthenticated });
  const { data, isLoading, error } = trpc.analytics.dashboard.useQuery(undefined, { enabled: isAuthenticated });

  const isTeamOrAdmin = user?.role === 'admin' || subStatus?.plan === 'team';

  const monthLabels = useMemo(() => data?.roiTrend.map(r => fmtMonth(r.month)) || [], [data]);

  // ─── Gate: Not Team tier ──────────────────────────────────
  if (!authLoading && !isLoading && !isTeamOrAdmin) {
    return (
      <div className="container py-20 text-center">
        <Lock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Advanced Analytics Dashboard</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Portfolio performance charts, ROI trends, deal velocity, and profit tracking are exclusive to Team tier subscribers.
        </p>
        <Link href="/pricing">
          <Button className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
            <Crown className="w-4 h-4" /> Upgrade to Team
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading || authLoading) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
        <p className="text-muted-foreground mt-4">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20 text-center">
        <p className="text-red-600">Error loading analytics: {error.message}</p>
      </div>
    );
  }

  if (!data) return null;

  const { summary, roiTrend, profitTracking, dealVelocity, statusBreakdown, scoreDistribution, pipelineStages, topMarkets } = data;

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 className="w-7 h-7 text-[oklch(0.48_0.20_18)]" />
            <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
            <Badge className="bg-[oklch(0.48_0.20_18)] text-white text-xs">Team</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Portfolio performance, deal velocity, and profit tracking</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Deals</span>
            </div>
            <p className="text-2xl font-bold">{summary.totalDeals}</p>
            <p className="text-xs text-muted-foreground">{summary.activeDeals} active · {summary.closedDeals} closed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Invested</span>
            </div>
            <p className="text-2xl font-bold">{fmtCurrency(summary.totalInvested)}</p>
            <p className="text-xs text-muted-foreground">across active deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Profit</span>
            </div>
            <p className={`text-2xl font-bold ${summary.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {fmtCurrency(summary.totalProfit)}
            </p>
            <p className="text-xs text-muted-foreground">from closed deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Avg ROI</span>
            </div>
            <p className="text-2xl font-bold flex items-center gap-1">
              {summary.avgRoi}%
              {summary.avgRoi > 0 ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
            </p>
            <p className="text-xs text-muted-foreground">avg deal score: {summary.avgDealScore}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1: ROI Trend + Profit Tracking */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
              ROI Trend (12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '260px' }}>
              <LineChart
                data={roiTrend.map(r => r.avgRoi)}
                labels={monthLabels}
                label="Avg ROI %"
                color="#c53030"
                yFormat={(v) => `${v}%`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Cumulative Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '260px' }}>
              <LineChart
                data={profitTracking.map(r => r.cumulative)}
                labels={monthLabels}
                label="Cumulative Profit"
                color="#16a34a"
                yFormat={(v) => fmtCurrency(v)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Deal Velocity + Status Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Deal Velocity (Deals / Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '260px' }}>
              <BarChartComponent
                data={dealVelocity.map(r => r.newDeals)}
                labels={monthLabels}
                label="New Deals"
                color="#3b82f6"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" />
              Deal Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '260px' }}>
              <DoughnutChart
                data={[statusBreakdown.active, statusBreakdown.under_contract, statusBreakdown.closed, statusBreakdown.passed, statusBreakdown.archived]}
                labels={['Active', 'Under Contract', 'Closed', 'Passed', 'Archived']}
                colors={['#3b82f6', '#f59e0b', '#16a34a', '#ef4444', '#6b7280']}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3: Score Distribution + Pipeline Stages */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-600" />
              Deal Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '260px' }}>
              <DoughnutChart
                data={[scoreDistribution.excellent, scoreDistribution.good, scoreDistribution.fair, scoreDistribution.poor]}
                labels={['Excellent (80+)', 'Good (60-79)', 'Fair (40-59)', 'Poor (<40)']}
                colors={['#16a34a', '#3b82f6', '#f59e0b', '#ef4444']}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Kanban className="w-4 h-4 text-indigo-600" />
              Pipeline Stage Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '260px' }}>
              {Object.keys(pipelineStages).length > 0 ? (
                <BarChartComponent
                  data={Object.values(pipelineStages)}
                  labels={Object.keys(pipelineStages).map(s => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))}
                  label="Deals"
                  color="#6366f1"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  <div className="text-center">
                    <Kanban className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No pipeline deals yet</p>
                    <Link href="/pipeline">
                      <Button variant="link" size="sm" className="mt-1">Go to Pipeline →</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Markets Table */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
            Top Markets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topMarkets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground text-xs uppercase">Market</th>
                    <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs uppercase">Deals</th>
                    <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs uppercase">Total Profit</th>
                    <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs uppercase">Avg Profit/Deal</th>
                  </tr>
                </thead>
                <tbody>
                  {topMarkets.map((m, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2.5 px-3 font-medium">{m.market}</td>
                      <td className="py-2.5 px-3 text-right">{m.count}</td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${m.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(m.totalProfit)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-muted-foreground">
                        {formatCurrency(Math.round(m.totalProfit / m.count))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">Save some deals to see market analysis</p>
          )}
        </CardContent>
      </Card>

      {/* Monthly Profit Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            Monthly Profit Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground text-xs uppercase">Month</th>
                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs uppercase">Deals</th>
                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs uppercase">Avg ROI</th>
                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs uppercase">Monthly Profit</th>
                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground text-xs uppercase">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {roiTrend.map((r, i) => (
                  <tr key={r.month} className="border-b last:border-0">
                    <td className="py-2 px-3 font-medium">{fmtMonth(r.month)}</td>
                    <td className="py-2 px-3 text-right">{r.dealCount}</td>
                    <td className="py-2 px-3 text-right">{r.avgRoi > 0 ? `${r.avgRoi}%` : '—'}</td>
                    <td className={`py-2 px-3 text-right font-semibold ${profitTracking[i].profit >= 0 ? (profitTracking[i].profit > 0 ? 'text-green-600' : '') : 'text-red-600'}`}>
                      {profitTracking[i].profit !== 0 ? formatCurrency(profitTracking[i].profit) : '—'}
                    </td>
                    <td className={`py-2 px-3 text-right ${profitTracking[i].cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitTracking[i].cumulative !== 0 ? formatCurrency(profitTracking[i].cumulative) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
