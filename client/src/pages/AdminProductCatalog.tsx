import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Package, RefreshCw, Database, CheckCircle2, XCircle, AlertTriangle,
  HelpCircle, Search, ExternalLink, TrendingUp, TrendingDown, Minus,
  Loader2, ShieldAlert, ChevronLeft, ChevronRight, Download
} from 'lucide-react';
import { getDefaultRoomScopes, type HomeDepotProduct } from '@/lib/scopeOfWork';

// Extract all products from SOW data for seeding
function extractAllProducts(): Array<{ sku: string; name: string; url: string; price: string; category: string }> {
  const products: Array<{ sku: string; name: string; url: string; price: string; category: string }> = [];
  const seen = new Set<string>();
  const rooms = getDefaultRoomScopes();

  for (const room of rooms) {
    for (const item of room.items) {
      // Each MaterialLineItem has rentalProduct, standardProduct, luxuryProduct
      const tierProducts: Array<{ prod: HomeDepotProduct | undefined; tier: string }> = [
        { prod: item.rentalProduct, tier: 'Rental' },
        { prod: item.standardProduct, tier: 'Standard' },
        { prod: item.luxuryProduct, tier: 'Luxury' },
      ];
      for (const { prod } of tierProducts) {
        if (prod && prod.sku && prod.url && !seen.has(prod.sku)) {
          seen.add(prod.sku);
          products.push({
            sku: prod.sku,
            name: prod.name,
            url: prod.url,
            price: prod.price,
            category: room.name,
          });
        }
      }
    }
  }
  return products;
}

const STATUS_CONFIG = {
  verified: { label: 'Verified', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
  discontinued: { label: 'Discontinued', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
  unavailable: { label: 'Unavailable', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  unknown: { label: 'Unknown', icon: HelpCircle, color: 'text-[oklch(0.5_0_0)]', bg: 'bg-[oklch(0.2_0_0)] border-[oklch(0.3_0_0)]' },
} as const;

const PAGE_SIZE = 25;

export default function AdminProductCatalog() {
  const { user, loading: authLoading } = useAuth();

  // State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [altName, setAltName] = useState('');
  const [altSku, setAltSku] = useState('');
  const [altUrl, setAltUrl] = useState('');
  const [altPrice, setAltPrice] = useState('');
  const [verifyingSkus, setVerifyingSkus] = useState<string[]>([]);
  const [verifyAllRunning, setVerifyAllRunning] = useState(false);

  // Queries
  const catalogQuery = trpc.productCatalog.list.useQuery(undefined, { staleTime: 30_000 });
  const statsQuery = trpc.productCatalog.stats.useQuery(undefined, { staleTime: 30_000 });

  // Mutations
  const seedMutation = trpc.productCatalog.seedFromScopeOfWork.useMutation({
    onSuccess: (data: { inserted: number; updated: number; total: number }) => {
      toast.success(`Catalog seeded: ${data.inserted} inserted, ${data.updated} updated (${data.total} total)`);
      catalogQuery.refetch();
      statsQuery.refetch();
    },
    onError: (err: any) => toast.error(`Seed failed: ${err.message}`),
  });

  const updateMutation = trpc.productCatalog.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Product updated');
      catalogQuery.refetch();
      statsQuery.refetch();
      setEditProduct(null);
    },
    onError: (err: any) => toast.error(`Update failed: ${err.message}`),
  });

  const autoVerifyMutation = trpc.productCatalog.autoVerify.useMutation({
    onSuccess: (data: { results: Array<{ sku: string; status: string; reason: string }> }) => {
      const disc = data.results.filter((r: any) => r.status === 'discontinued').length;
      const verified = data.results.filter((r: any) => r.status === 'verified').length;
      toast.success(`Verification: ${verified} verified, ${disc} discontinued, ${data.results.length - verified - disc} other`);
      catalogQuery.refetch();
      statsQuery.refetch();
    },
    onError: (err: any) => toast.error(`Verification failed: ${err.message}`),
  });

  const setAltMutation = trpc.productCatalog.setAlternative.useMutation({
    onSuccess: () => {
      toast.success('Alternative set');
      catalogQuery.refetch();
      setEditProduct(null);
    },
    onError: (err: any) => toast.error(`Failed: ${err.message}`),
  });

  // Filter and paginate
  const allProducts = catalogQuery.data || [];
  const categories = useMemo(() => {
    const cats = new Set(allProducts.map((p: any) => p.category).filter(Boolean));
    return Array.from(cats).sort() as string[];
  }, [allProducts]);

  const filtered = useMemo(() => {
    return allProducts.filter((p: any) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      }
      return true;
    });
  }, [allProducts, statusFilter, categoryFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Seed handler
  const handleSeed = () => {
    const products = extractAllProducts();
    seedMutation.mutate({ products });
  };

  // Auto-verify all (batch of 10 at a time)
  const handleVerifyAll = async () => {
    const unknownProducts = allProducts.filter((p: any) => p.status === 'unknown');
    if (unknownProducts.length === 0) {
      toast.info('All products already have a status.');
      return;
    }
    setVerifyAllRunning(true);
    const batches: string[][] = [];
    for (let i = 0; i < unknownProducts.length; i += 10) {
      batches.push(unknownProducts.slice(i, i + 10).map((p: any) => p.sku));
    }
    let completed = 0;
    for (const batch of batches) {
      try {
        setVerifyingSkus(batch);
        await autoVerifyMutation.mutateAsync({ skus: batch });
        completed += batch.length;
      } catch {
        break;
      }
    }
    setVerifyingSkus([]);
    setVerifyAllRunning(false);
    toast.success(`Verify All complete: processed ${completed} of ${unknownProducts.length} products`);
  };

  // Verify single product
  const handleVerifySingle = async (sku: string) => {
    setVerifyingSkus(prev => [...prev, sku]);
    try {
      await autoVerifyMutation.mutateAsync({ skus: [sku] });
    } finally {
      setVerifyingSkus(prev => prev.filter(s => s !== sku));
    }
  };

  // Export catalog as CSV
  const handleExportCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'Status', 'Original Price', 'Current Price', 'Price Change %', 'URL', 'Alternative Name', 'Alternative SKU', 'Alternative URL', 'Last Checked'];
    const rows = allProducts.map((p: any) => [
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category || '',
      p.status,
      p.originalPrice,
      p.currentPrice || '',
      p.priceChangePct ? (p.priceChangePct / 100).toFixed(1) + '%' : '',
      p.url,
      p.alternativeName || '',
      p.alternativeSku || '',
      p.alternativeUrl || '',
      p.lastCheckedAt ? new Date(p.lastCheckedAt).toLocaleDateString() : 'Never',
    ]);
    const csv = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-catalog-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Open edit dialog
  const openEdit = (product: any) => {
    setEditProduct(product);
    setEditStatus(product.status);
    setEditPrice(product.currentPrice || product.originalPrice);
    setAltName(product.alternativeName || '');
    setAltSku(product.alternativeSku || '');
    setAltUrl(product.alternativeUrl || '');
    setAltPrice(product.alternativePrice || '');
  };

  // Save edit
  const handleSaveEdit = () => {
    if (!editProduct) return;
    updateMutation.mutate({
      sku: editProduct.sku,
      status: editStatus as any,
      currentPrice: editPrice || undefined,
    });
    if (altSku && altName && altUrl && altPrice) {
      setAltMutation.mutate({
        sku: editProduct.sku,
        alternativeSku: altSku,
        alternativeName: altName,
        alternativeUrl: altUrl,
        alternativePrice: altPrice,
      });
    }
  };

  // Auth guard
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground">This page is only accessible to administrators.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = statsQuery.data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[oklch(0.15_0_0)] border-b border-[oklch(0.25_0_0)]">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-amber-500/15">
                  <Package className="w-6 h-6 text-amber-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">Product Catalog</h1>
                <Badge variant="outline" className="text-amber-400 border-amber-500/30">Admin</Badge>
              </div>
              <p className="text-[oklch(0.55_0_0)] text-sm">
                Manage Home Depot product verification, pricing, and alternatives for rehab estimates.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-[oklch(0.3_0_0)] text-white hover:bg-white/10"
                onClick={handleSeed}
                disabled={seedMutation.isPending}
              >
                {seedMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                Seed Catalog
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-[oklch(0.3_0_0)] text-white hover:bg-white/10"
                onClick={handleVerifyAll}
                disabled={verifyAllRunning}
              >
                {verifyAllRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Auto-Verify All
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-[oklch(0.3_0_0)] text-white hover:bg-white/10"
                onClick={handleExportCSV}
                disabled={allProducts.length === 0}
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="container py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Total', value: stats?.total || 0, color: 'text-white' },
            { label: 'Verified', value: stats?.verified || 0, color: 'text-emerald-400' },
            { label: 'Discontinued', value: stats?.discontinued || 0, color: 'text-red-400' },
            { label: 'Unavailable', value: stats?.unavailable || 0, color: 'text-amber-400' },
            { label: 'Unknown', value: stats?.unknown || 0, color: 'text-[oklch(0.5_0_0)]' },
            { label: 'Has Alternatives', value: stats?.withAlternatives || 0, color: 'text-blue-400' },
            { label: 'Price Changes', value: stats?.priceChanges || 0, color: 'text-purple-400' },
          ].map(stat => (
            <Card key={stat.label} className="bg-[oklch(0.15_0_0)] border-[oklch(0.25_0_0)]">
              <CardContent className="p-3 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-[oklch(0.45_0_0)]">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="container pb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Showing {filtered.length} of {allProducts.length} products
          {allProducts.length === 0 && ' — Click "Seed Catalog" to populate from SOW data'}
        </p>
      </section>

      {/* Product Table */}
      <section className="container pb-8">
        <Card className="bg-[oklch(0.15_0_0)] border-[oklch(0.25_0_0)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[oklch(0.25_0_0)] text-[oklch(0.5_0_0)]">
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium">SKU</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Original</th>
                  <th className="text-right px-4 py-3 font-medium">Current</th>
                  <th className="text-right px-4 py-3 font-medium">Change</th>
                  <th className="text-left px-4 py-3 font-medium">Alternative</th>
                  <th className="text-left px-4 py-3 font-medium">Last Checked</th>
                  <th className="text-center px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">
                      {allProducts.length === 0
                        ? 'No products in catalog. Click "Seed Catalog" to populate.'
                        : 'No products match your filters.'}
                    </td>
                  </tr>
                ) : paginated.map((product: any) => {
                  const statusConf = STATUS_CONFIG[product.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.unknown;
                  const StatusIcon = statusConf.icon;
                  const isVerifying = verifyingSkus.includes(product.sku);
                  const pctChange = product.priceChangePct ? product.priceChangePct / 100 : null;

                  return (
                    <tr key={product.sku} className="border-b border-[oklch(0.2_0_0)] hover:bg-[oklch(0.18_0_0)] transition-colors">
                      <td className="px-4 py-3">
                        <div className="max-w-[220px]">
                          <p className="text-white font-medium text-xs leading-tight truncate" title={product.name}>{product.name}</p>
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-400 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                          >
                            View on HD <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[oklch(0.55_0_0)]">{product.sku}</td>
                      <td className="px-4 py-3 text-xs text-[oklch(0.55_0_0)]">{product.category || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusConf.bg} ${statusConf.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-white font-mono">{product.originalPrice}</td>
                      <td className="px-4 py-3 text-right text-xs font-mono">
                        {product.currentPrice ? (
                          <span className="text-white">{product.currentPrice}</span>
                        ) : (
                          <span className="text-[oklch(0.4_0_0)]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-mono">
                        {pctChange !== null ? (
                          <span className={`inline-flex items-center gap-0.5 ${pctChange > 0 ? 'text-red-400' : pctChange < 0 ? 'text-emerald-400' : 'text-[oklch(0.5_0_0)]'}`}>
                            {pctChange > 0 ? <TrendingUp className="w-3 h-3" /> : pctChange < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                            {pctChange > 0 ? '+' : ''}{pctChange.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-[oklch(0.4_0_0)]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {product.alternativeName ? (
                          <div className="max-w-[160px]">
                            <p className="text-xs text-emerald-400 truncate" title={product.alternativeName}>{product.alternativeName}</p>
                            {product.alternativeUrl && (
                              <a href={product.alternativeUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline inline-flex items-center gap-0.5">
                                View <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-[oklch(0.4_0_0)] text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[oklch(0.45_0_0)]">
                        {product.lastCheckedAt ? new Date(product.lastCheckedAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-[oklch(0.5_0_0)] hover:text-white"
                            onClick={() => handleVerifySingle(product.sku)}
                            disabled={isVerifying}
                            title="Auto-verify this product"
                          >
                            {isVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-[oklch(0.5_0_0)] hover:text-white text-xs"
                            onClick={() => openEdit(product)}
                          >
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[oklch(0.25_0_0)]">
              <p className="text-xs text-[oklch(0.45_0_0)]">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Edit Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => { if (!open) setEditProduct(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription className="text-xs truncate">{editProduct?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Current Price</Label>
                <Input className="mt-1" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="$0.00" />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Alternative Product</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input className="mt-1" value={altName} onChange={(e) => setAltName(e.target.value)} placeholder="Alternative product name" />
                </div>
                <div>
                  <Label className="text-xs">SKU</Label>
                  <Input className="mt-1" value={altSku} onChange={(e) => setAltSku(e.target.value)} placeholder="SKU number" />
                </div>
                <div>
                  <Label className="text-xs">URL</Label>
                  <Input className="mt-1" value={altUrl} onChange={(e) => setAltUrl(e.target.value)} placeholder="https://homedepot.com/p/..." />
                </div>
                <div>
                  <Label className="text-xs">Price</Label>
                  <Input className="mt-1" value={altPrice} onChange={(e) => setAltPrice(e.target.value)} placeholder="$0.00" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
