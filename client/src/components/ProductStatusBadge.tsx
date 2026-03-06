import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, XCircle, AlertTriangle, HelpCircle, ExternalLink, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import type { HomeDepotProduct } from '@/lib/scopeOfWork';

export interface ProductCatalogEntry {
  sku: string;
  name: string;
  url: string;
  originalPrice: string;
  currentPrice: string | null;
  priceChangePct: number | null;
  status: 'verified' | 'discontinued' | 'unavailable' | 'unknown';
  lastCheckedAt: string | null;
  alternativeSku: string | null;
  alternativeName: string | null;
  alternativeUrl: string | null;
  alternativePrice: string | null;
  category: string | null;
}

interface ProductStatusBadgeProps {
  product: HomeDepotProduct;
  catalogEntry?: ProductCatalogEntry | null;
  compact?: boolean;
}

const STATUS_CONFIG = {
  verified: { icon: CheckCircle, label: 'Verified', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  discontinued: { icon: XCircle, label: 'Discontinued', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
  unavailable: { icon: AlertTriangle, label: 'Unavailable', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
  unknown: { icon: HelpCircle, label: 'Unverified', color: 'text-muted-foreground', bg: 'bg-muted/50 border-border' },
};

export function ProductStatusBadge({ product, catalogEntry, compact = false }: ProductStatusBadgeProps) {
  const status = catalogEntry?.status || 'unknown';
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const priceChanged = catalogEntry?.priceChangePct && catalogEntry.priceChangePct !== 0;
  const priceUp = (catalogEntry?.priceChangePct || 0) > 0;
  const displayPrice = catalogEntry?.currentPrice || product.price;

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-1">
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
              >
                <ExternalLink className="w-2.5 h-2.5" />
                HD #{product.sku} — {displayPrice}
              </a>
              <Icon className={`w-3 h-3 ${config.color} shrink-0`} />
              {priceChanged && (
                priceUp
                  ? <TrendingUp className="w-2.5 h-2.5 text-red-400" />
                  : <TrendingDown className="w-2.5 h-2.5 text-emerald-400" />
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <ProductTooltipContent product={product} catalogEntry={catalogEntry} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <a
          href={status === 'discontinued' && catalogEntry?.alternativeUrl ? catalogEntry.alternativeUrl : product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
        >
          <ExternalLink className="w-2.5 h-2.5" />
          HD #{product.sku} — {displayPrice}
        </a>
        <Badge variant="outline" className={`text-[9px] px-1 py-0 h-4 ${config.bg} ${config.color} border`}>
          <Icon className="w-2.5 h-2.5 mr-0.5" />
          {config.label}
        </Badge>
        {priceChanged && (
          <span className={`text-[9px] font-medium ${priceUp ? 'text-red-400' : 'text-emerald-400'}`}>
            {priceUp ? '+' : ''}{(catalogEntry!.priceChangePct! / 100).toFixed(1)}%
          </span>
        )}
      </div>
      {status === 'discontinued' && catalogEntry?.alternativeName && (
        <div className="flex items-center gap-1 text-[9px] text-amber-400/80 pl-0.5">
          <ArrowRight className="w-2.5 h-2.5 shrink-0" />
          <span>Alternative: </span>
          <a
            href={catalogEntry.alternativeUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline truncate max-w-[180px]"
          >
            {catalogEntry.alternativeName}
          </a>
          {catalogEntry.alternativePrice && (
            <span className="text-muted-foreground">({catalogEntry.alternativePrice})</span>
          )}
        </div>
      )}
    </div>
  );
}

function ProductTooltipContent({ product, catalogEntry }: { product: HomeDepotProduct; catalogEntry?: ProductCatalogEntry | null }) {
  const status = catalogEntry?.status || 'unknown';
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
        <span className="font-semibold">{config.label}</span>
      </div>
      <div className="text-muted-foreground">{product.name}</div>
      {catalogEntry?.currentPrice && catalogEntry.currentPrice !== product.price && (
        <div className="flex items-center gap-1">
          <span className="line-through text-muted-foreground">{product.price}</span>
          <ArrowRight className="w-3 h-3" />
          <span className="font-medium">{catalogEntry.currentPrice}</span>
        </div>
      )}
      {catalogEntry?.lastCheckedAt && (
        <div className="text-muted-foreground/70">
          Last checked: {new Date(catalogEntry.lastCheckedAt).toLocaleDateString()}
        </div>
      )}
      {status === 'discontinued' && catalogEntry?.alternativeName && (
        <div className="pt-1 border-t border-border">
          <div className="text-amber-400 font-medium">Suggested Alternative:</div>
          <div>{catalogEntry.alternativeName}</div>
          {catalogEntry.alternativePrice && <div className="text-muted-foreground">{catalogEntry.alternativePrice}</div>}
        </div>
      )}
    </div>
  );
}

export default ProductStatusBadge;
