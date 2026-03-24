import { useState, useMemo, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  LineChart, TrendingUp, TrendingDown, Search, ExternalLink,
  ArrowUpRight, ArrowDownRight, Minus, Package, AlertTriangle,
  CheckCircle, XCircle, HelpCircle, Filter, DollarSign, BarChart3,
  Lock, Activity
} from 'lucide-react';
import { Link } from 'wouter';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const STATUS_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  verified: { icon: CheckCircle, color: 'text-emerald-500', label: 'Verified' },
  discontinued: { icon: XCircle, color: 'text-red-500', label: 'Discontinued' },
  unavailable: { icon: AlertTriangle, color: 'text-amber-500', label: 'Unavailable' },
  unknown: { icon: HelpCircle, color: 'text-gray-400', label: 'Not Verified' },
};

const CATEGORY_COLORS: Record<string, string> = {
  'Kitchen': '#ef4444',
  'Bathroom': '#3b82f6',
  'Bedroom': '#8b5cf6',
  'Living Room': '#f59e0b',
  'Electrical': '#10b981',
  'HVAC': '#06b6d4',
  'Plumbing': '#6366f1',
  'Roof & Gutter': '#ec4899',
  'Structural & Windows': '#84cc16',
  'Landscaping & Exterior': '#14b8a6',
  'Garage': '#f97316',
};

function PriceChangeIndicator({ pct }: { pct: number | null }) {
  if (!pct || pct === 0) return <span className="text-gray-400 text-sm flex items-center gap-1"><Minus className="w-3 h-3" /> No change</span>;
  const realPct = pct / 100;
  if (realPct > 0) return <span className="text-red-500 text-sm font-medium flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5" /> +{realPct.toFixed(1)}%</span>;
  return <span className="text-emerald-500 text-sm font-medium flex items-center gap-1"><ArrowDownRight className="w-3.5 h-3.5" /> {realPct.toFixed(1)}%</span>;
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [data, color]);

  if (data.length < 2) return <span className="text-xs text-gray-400">No history</span>;
  return <canvas ref={canvasRef} width={80} height={24} className="inline-block" />;
}

/** Category Average Price Bar Chart */
function CategoryPriceChart({ categories }: { categories: any[] }) {
  const sortedCats = useMemo(() => [...categories].sort((a, b) => b.avgOriginalPrice - a.avgOriginalPrice), [categories]);

  const data = {
    labels: sortedCats.map(c => c.category),
    datasets: [
      {
        label: 'Avg Product Price',
        data: sortedCats.map(c => c.avgOriginalPrice),
        backgroundColor: sortedCats.map(c => {
          const hex = CATEGORY_COLORS[c.category] || '#6b7280';
          return hex + '99'; // add alpha
        }),
        borderColor: sortedCats.map(c => CATEGORY_COLORS[c.category] || '#6b7280'),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        titleColor: '#fff',
        bodyColor: '#ccc',
        padding: 12,
        callbacks: {
          label: (ctx: any) => `$${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#888', font: { size: 10 }, maxRotation: 45, minRotation: 30 },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: '#888',
          callback: (value: any) => `$${value}`,
        },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
    },
  };

  return (
    <div style={{ height: '280px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

/** Price Change by Category Chart */
function PriceChangeChart({ categories }: { categories: any[] }) {
  const sortedCats = useMemo(() => [...categories].sort((a, b) => b.avgPriceChange - a.avgPriceChange), [categories]);

  const data = {
    labels: sortedCats.map(c => c.category),
    datasets: [
      {
        label: 'Avg Price Change (%)',
        data: sortedCats.map(c => c.avgPriceChange / 100),
        backgroundColor: sortedCats.map(c => {
          const change = c.avgPriceChange / 100;
          if (change > 0) return 'rgba(239, 68, 68, 0.6)';
          if (change < 0) return 'rgba(16, 185, 129, 0.6)';
          return 'rgba(107, 114, 128, 0.4)';
        }),
        borderColor: sortedCats.map(c => {
          const change = c.avgPriceChange / 100;
          if (change > 0) return '#ef4444';
          if (change < 0) return '#10b981';
          return '#6b7280';
        }),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        titleColor: '#fff',
        bodyColor: '#ccc',
        padding: 12,
        callbacks: {
          label: (ctx: any) => {
            const val = ctx.parsed.x;
            return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#888',
          callback: (value: any) => `${value > 0 ? '+' : ''}${value}%`,
        },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
      y: {
        ticks: { color: '#888', font: { size: 11 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div style={{ height: '320px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

/** Category Price Trend Line Chart (over time) */
function PriceTrendLineChart({ trendData, selectedCategory }: { trendData: any[]; selectedCategory: string }) {
  const chartData = useMemo(() => {
    if (!trendData || trendData.length === 0) return null;

    const dates = trendData.map(t => t.date);
    const allCategories = new Set<string>();
    trendData.forEach(t => t.categories.forEach((c: any) => allCategories.add(c.category)));

    const categoriesToShow = selectedCategory !== 'all'
      ? [selectedCategory]
      : Array.from(allCategories).slice(0, 6); // Show top 6 for readability

    const datasets = categoriesToShow.map(cat => {
      const color = CATEGORY_COLORS[cat] || '#6b7280';
      return {
        label: cat,
        data: dates.map(d => {
          const entry = trendData.find(t => t.date === d);
          const catEntry = entry?.categories.find((c: any) => c.category === cat);
          return catEntry?.avgPrice || null;
        }),
        borderColor: color,
        backgroundColor: color + '20',
        tension: 0.3,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        borderWidth: 2,
        spanGaps: true,
      };
    });

    return {
      labels: dates.map(d => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets,
    };
  }, [trendData, selectedCategory]);

  if (!chartData || chartData.datasets.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
        <div className="text-center">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Price trend data will appear after multiple verification runs.</p>
          <p className="text-xs mt-1">Trends are tracked each time the catalog is verified.</p>
        </div>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#888',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        titleColor: '#fff',
        bodyColor: '#ccc',
        padding: 12,
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: $${ctx.parsed.y?.toFixed(2) || 'N/A'}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#888', font: { size: 10 } },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
      y: {
        ticks: {
          color: '#888',
          callback: (value: any) => `$${value}`,
        },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
    },
  };

  return (
    <div style={{ height: '320px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

/** Status Distribution Doughnut-like horizontal bar */
function StatusDistributionBar({ categories }: { categories: any[] }) {
  const totals = useMemo(() => {
    const t = { verified: 0, discontinued: 0, unavailable: 0, unknown: 0 };
    categories.forEach(c => {
      t.verified += c.verified;
      t.discontinued += c.discontinued;
      t.unavailable += c.unavailable;
      t.unknown += c.unknown;
    });
    return t;
  }, [categories]);

  const total = totals.verified + totals.discontinued + totals.unavailable + totals.unknown;
  if (total === 0) return null;

  const segments = [
    { label: 'Verified', count: totals.verified, color: '#10b981', pct: (totals.verified / total * 100) },
    { label: 'Discontinued', count: totals.discontinued, color: '#ef4444', pct: (totals.discontinued / total * 100) },
    { label: 'Unavailable', count: totals.unavailable, color: '#f59e0b', pct: (totals.unavailable / total * 100) },
    { label: 'Unverified', count: totals.unknown, color: '#6b7280', pct: (totals.unknown / total * 100) },
  ].filter(s => s.count > 0);

  return (
    <div>
      <div className="flex rounded-full overflow-hidden h-4 mb-3">
        {segments.map(s => (
          <div
            key={s.label}
            style={{ width: `${s.pct}%`, backgroundColor: s.color }}
            className="transition-all"
            title={`${s.label}: ${s.count} (${s.pct.toFixed(1)}%)`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-muted-foreground">{s.label}: <span className="font-medium text-foreground">{s.count}</span> ({s.pct.toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MaterialCostTracker() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'priceChange' | 'price'>('name');

  // Check subscription
  const { data: subStatus } = trpc.subscription.status.useQuery(undefined, { enabled: isAuthenticated });
  const isPro = user?.role === 'admin' || subStatus?.plan === 'pro' || subStatus?.plan === 'elite' || subStatus?.plan === 'team';

  // Fetch data
  const { data: categorySummary, isLoading: catLoading } = trpc.productCatalog.categorySummary.useQuery();
  const { data: products, isLoading: prodLoading } = trpc.productCatalog.publicProducts.useQuery(
    selectedCategory !== 'all' ? { category: selectedCategory } : undefined
  );
  const { data: trendData, isLoading: trendLoading } = trpc.productCatalog.categoryPriceTrends.useQuery();

  const categories = useMemo(() => {
    if (!categorySummary) return [];
    return categorySummary;
  }, [categorySummary]);

  const totalProducts = useMemo(() => categories.reduce((sum, c) => sum + c.products, 0), [categories]);
  const avgPriceChange = useMemo(() => {
    if (!categories.length) return 0;
    const total = categories.reduce((sum, c) => sum + c.avgPriceChange, 0);
    return Math.round(total / categories.length) / 100;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'priceChange') filtered.sort((a, b) => Math.abs(b.priceChangePct || 0) - Math.abs(a.priceChangePct || 0));
    else if (sortBy === 'price') {
      filtered.sort((a, b) => {
        const aP = parseFloat(a.originalPrice.replace(/[^0-9.]/g, '')) || 0;
        const bP = parseFloat(b.originalPrice.replace(/[^0-9.]/g, '')) || 0;
        return bP - aP;
      });
    }
    return filtered;
  }, [products, searchQuery, sortBy]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[oklch(0.48_0.20_18)]" />
      </div>
    );
  }

  // Gate behind Pro+ subscription
  if (!isAuthenticated) {
    return (
      <div className="container py-20 text-center">
        <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Material Cost Tracker</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Track real-time material pricing trends across 11 categories. Sign in to access this feature.
        </p>
        <a href={getLoginUrl()}>
          <Button className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">Sign In</Button>
        </a>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="container py-20 text-center">
        <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Material Cost Tracker</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Track real-time material pricing trends across 11 categories. This feature is available on Pro, Elite, and Team plans.
        </p>
        <Link href="/pricing">
          <Button className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">View Plans</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[oklch(0.15_0_0)] to-background border-b border-border/40">
        <div className="container py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)]/15">
              <LineChart className="w-6 h-6 text-[oklch(0.65_0.18_18)]" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Material Cost Tracker</h1>
          </div>
          <p className="text-[oklch(0.55_0_0)] max-w-2xl">
            Track pricing trends across 100+ Home Depot products used in rehab projects. Monitor price changes, 
            identify cost-saving opportunities, and stay ahead of material cost fluctuations.
          </p>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="container py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Total Products</span>
              </div>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Categories</span>
              </div>
              <p className="text-2xl font-bold">{categories.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                {avgPriceChange >= 0 ? <TrendingUp className="w-4 h-4 text-red-500" /> : <TrendingDown className="w-4 h-4 text-emerald-500" />}
                <span className="text-xs text-muted-foreground">Avg Price Change</span>
              </div>
              <p className={`text-2xl font-bold ${avgPriceChange > 0 ? 'text-red-500' : avgPriceChange < 0 ? 'text-emerald-500' : ''}`}>
                {avgPriceChange > 0 ? '+' : ''}{avgPriceChange.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Price Alerts</span>
              </div>
              <p className="text-2xl font-bold text-amber-500">
                {categories.reduce((sum, c) => sum + (Math.abs(c.avgPriceChange) > 1000 ? 1 : 0), 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts Section */}
      <section className="container pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Average Price by Category */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                Average Product Price by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {catLoading ? (
                <div className="h-[280px] bg-muted/30 rounded animate-pulse" />
              ) : categories.length > 0 ? (
                <CategoryPriceChart categories={categories} />
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">No data available</div>
              )}
            </CardContent>
          </Card>

          {/* Price Change by Category */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                Price Change by Category (%)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {catLoading ? (
                <div className="h-[320px] bg-muted/30 rounded animate-pulse" />
              ) : categories.length > 0 ? (
                <PriceChangeChart categories={categories} />
              ) : (
                <div className="h-[320px] flex items-center justify-center text-muted-foreground text-sm">No data available</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Price Trend Over Time */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              Price Trends Over Time
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="text-xs ml-2">{selectedCategory}</Badge>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Average product prices tracked across verification runs. {selectedCategory === 'all' ? 'Showing top 6 categories.' : `Filtered to ${selectedCategory}.`}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            {trendLoading ? (
              <div className="h-[320px] bg-muted/30 rounded animate-pulse" />
            ) : (
              <PriceTrendLineChart trendData={trendData || []} selectedCategory={selectedCategory} />
            )}
          </CardContent>
        </Card>

        {/* Verification Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
              Verification Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {catLoading ? (
              <div className="h-12 bg-muted/30 rounded animate-pulse" />
            ) : (
              <StatusDistributionBar categories={categories} />
            )}
          </CardContent>
        </Card>
      </section>

      {/* Category Breakdown */}
      <section className="container pb-6">
        <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
        {catLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map(cat => {
              const color = CATEGORY_COLORS[cat.category] || '#6b7280';
              const pctChange = cat.avgPriceChange / 100;
              return (
                <Card
                  key={cat.category}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedCategory === cat.category ? 'ring-2 ring-[oklch(0.48_0.20_18)]' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === cat.category ? 'all' : cat.category)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-medium text-sm">{cat.category}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">{cat.products} items</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground">Avg Price: </span>
                        <span className="text-sm font-semibold">${cat.avgOriginalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {pctChange > 0 ? (
                          <span className="text-xs text-red-500 font-medium flex items-center gap-0.5">
                            <ArrowUpRight className="w-3 h-3" /> +{pctChange.toFixed(1)}%
                          </span>
                        ) : pctChange < 0 ? (
                          <span className="text-xs text-emerald-500 font-medium flex items-center gap-0.5">
                            <ArrowDownRight className="w-3 h-3" /> {pctChange.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs text-emerald-500">{cat.verified} verified</span>
                      {cat.discontinued > 0 && <span className="text-xs text-red-500">{cat.discontinued} discontinued</span>}
                      {cat.unavailable > 0 && <span className="text-xs text-amber-500">{cat.unavailable} unavailable</span>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Product Table */}
      <section className="container pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold">
            {selectedCategory !== 'all' ? `${selectedCategory} Products` : 'All Products'}
            {selectedCategory !== 'all' && (
              <Button variant="ghost" size="sm" className="ml-2 text-xs" onClick={() => setSelectedCategory('all')}>
                Clear filter
              </Button>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="name">Sort: Name</option>
              <option value="priceChange">Sort: Price Change</option>
              <option value="price">Sort: Price (High→Low)</option>
            </select>
          </div>
        </div>

        {prodLoading ? (
          <div className="space-y-2">
            {[1,2,3,4,5].map(i => <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No products found. {searchQuery ? 'Try a different search term.' : 'Products will appear after the catalog is seeded.'}</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left px-4 py-3 font-medium">Product</th>
                    <th className="text-left px-4 py-3 font-medium">Category</th>
                    <th className="text-right px-4 py-3 font-medium">Original Price</th>
                    <th className="text-right px-4 py-3 font-medium">Current Price</th>
                    <th className="text-right px-4 py-3 font-medium">Change</th>
                    <th className="text-center px-4 py-3 font-medium">Status</th>
                    <th className="text-center px-4 py-3 font-medium">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const statusCfg = STATUS_CONFIG[product.status] || STATUS_CONFIG.unknown;
                    const StatusIcon = statusCfg.icon;
                    return (
                      <tr key={product.sku} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-sm leading-tight">{product.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: CATEGORY_COLORS[product.category || ''] || '#6b7280' }}
                            />
                            <span className="text-xs">{product.category}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm">{product.originalPrice}</td>
                        <td className="px-4 py-3 text-right font-mono text-sm">
                          {product.currentPrice || '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <PriceChangeIndicator pct={product.priceChangePct} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <StatusIcon className={`w-3.5 h-3.5 ${statusCfg.color}`} />
                            <span className={`text-xs ${statusCfg.color}`}>{statusCfg.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[oklch(0.48_0.20_18)] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> View
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Alternatives section for discontinued products */}
        {filteredProducts.some(p => p.status === 'discontinued' && p.alternativeName) && (
          <div className="mt-6">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Discontinued Products with Alternatives
            </h3>
            <div className="grid gap-3">
              {filteredProducts
                .filter(p => p.status === 'discontinued' && p.alternativeName)
                .map(p => (
                  <Card key={p.sku} className="border-amber-500/20">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-sm line-through text-muted-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground">SKU: {p.sku} · {p.originalPrice}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">→</span>
                          <div>
                            <p className="text-sm font-medium text-emerald-600">{p.alternativeName}</p>
                            {p.alternativePrice && <p className="text-xs text-muted-foreground">{p.alternativePrice}</p>}
                          </div>
                          {p.alternativeUrl && (
                            <a href={p.alternativeUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="text-xs gap-1">
                                <ExternalLink className="w-3 h-3" /> View
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </section>

      {/* Disclaimer */}
      <section className="container pb-8">
        <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
          Prices are sourced from Home Depot and verified periodically. Actual prices may vary by location and availability.
          Last verification data is shown per product. Price changes are calculated from the original catalog price.
        </p>
      </section>
    </div>
  );
}
