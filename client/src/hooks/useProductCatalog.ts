import { trpc } from '@/lib/trpc';
import { useMemo } from 'react';
import type { ProductCatalogEntry } from '@/components/ProductStatusBadge';

/**
 * Hook to fetch product catalog verification data.
 * Returns a lookup map by SKU for quick access in UI components.
 */
export function useProductCatalog() {
  const { data: catalogList, isLoading, refetch } = trpc.productCatalog.list.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  const catalogMap = useMemo(() => {
    const map = new Map<string, ProductCatalogEntry>();
    if (catalogList) {
      for (const entry of catalogList) {
        map.set(entry.sku, {
          ...entry,
          lastCheckedAt: entry.lastCheckedAt ? new Date(entry.lastCheckedAt).toISOString() : null,
        } as ProductCatalogEntry);
      }
    }
    return map;
  }, [catalogList]);

  return {
    catalogMap,
    isLoading,
    refetch,
    totalProducts: catalogList?.length || 0,
    verifiedCount: catalogList?.filter(p => p.status === 'verified').length || 0,
    discontinuedCount: catalogList?.filter(p => p.status === 'discontinued').length || 0,
  };
}

export default useProductCatalog;
