import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/calculations';
import { trpc } from '@/lib/trpc';
import { useParams, Link } from 'wouter';
import { PhotoGalleryReadOnly } from '@/components/PropertyPhotoGallery';
import {
  Building2, TrendingUp, DollarSign, BarChart3, Clock,
  ArrowLeft, Eye, Calendar, Printer, AlertTriangle,
  CheckCircle2, XCircle, MinusCircle
} from 'lucide-react';

const DEFAULT_LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/logo-transparent-black_1d2d479c.png";
const COMPANY_NAME = "Freedom One";

export default function SharedDealView() {
  const params = useParams<{ shareId: string }>();
  const shareId = params.shareId || '';

  const { data, isLoading, error } = trpc.shareDeal.get.useQuery(
    { shareId },
    { enabled: !!shareId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[oklch(0.50_0.18_25)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading deal analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-8 text-center space-y-4">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold">Deal Not Found</h2>
            <p className="text-muted-foreground text-sm">
              This shared deal link may have expired (links are valid for 30 days) or the deal may have been removed.
            </p>
            <Link href="/">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Go to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  let deal: any;
  try {
    deal = JSON.parse(data.dealData);
  } catch {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-8 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold">Invalid Deal Data</h2>
            <p className="text-muted-foreground text-sm">The deal data could not be parsed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { property, profit, financing, closing, holding, effectiveArv, rehabTotals, materialTier, targetROI, comps, regionalLabel, photos: dealPhotos } = deal;

  const verdictIcon = profit.dealVerdict === 'excellent' || profit.dealVerdict === 'good'
    ? <CheckCircle2 className="w-6 h-6 text-green-500" />
    : profit.dealVerdict === 'marginal'
    ? <MinusCircle className="w-6 h-6 text-amber-500" />
    : <XCircle className="w-6 h-6 text-red-500" />;

  const verdictColor = profit.dealVerdict === 'excellent' || profit.dealVerdict === 'good'
    ? 'text-green-600' : profit.dealVerdict === 'marginal' ? 'text-amber-600' : 'text-red-600';

  const verdictBg = profit.dealVerdict === 'excellent' || profit.dealVerdict === 'good'
    ? 'bg-green-500/10 border-green-500/30' : profit.dealVerdict === 'marginal'
    ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30';

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/60 bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={DEFAULT_LOGO_URL} alt={COMPANY_NAME} className="h-8 object-contain" />
            <div>
              <p className="text-xs text-muted-foreground">Shared Deal Analysis</p>
              <h1 className="text-sm font-bold">{data.propertyAddress || 'Investment Analysis'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {data.viewCount} views</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <Button onClick={handlePrint} variant="outline" size="sm" className="gap-1.5 print:hidden">
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-5xl space-y-6">
        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <DollarSign className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Purchase Price</p>
              <p className="text-xl font-bold">{formatCurrency(property.purchasePrice)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <TrendingUp className="w-5 h-5 mx-auto text-[oklch(0.50_0.18_25)] mb-1" />
              <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">After Repair Value</p>
              <p className="text-xl font-bold text-[oklch(0.50_0.18_25)]">{formatCurrency(effectiveArv)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <BarChart3 className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Net Profit</p>
              <p className={`text-xl font-bold ${profit.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(profit.netProfit)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <TrendingUp className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">ROI</p>
              <p className={`text-xl font-bold ${profit.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profit.roi.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Verdict Banner */}
        <div className={`rounded-lg border p-5 text-center ${verdictBg}`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            {verdictIcon}
            <span className={`text-2xl font-extrabold ${verdictColor}`}>
              {profit.dealVerdict.toUpperCase().replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Deal Score: <strong>{profit.dealScore}/100</strong> | 
            70% Rule MAO: <strong>{formatCurrency(profit.maxAllowableOffer)}</strong> | 
            Cash-on-Cash: <strong>{profit.cashOnCash?.toFixed(1) || '—'}%</strong>
          </p>
          {profit.verdictReasons && profit.verdictReasons.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">{profit.verdictReasons.join(' • ')}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Property Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium">{property.address}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">City/State</span><span className="font-medium">{property.city}, {property.state} {property.zip}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{property.propertyType}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Beds / Baths</span><span className="font-medium">{property.beds} BD / {property.baths} BA</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Square Footage</span><span className="font-medium">{property.sqft?.toLocaleString()} sqft</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Year Built</span><span className="font-medium">{property.yearBuilt}</span></div>
                {property.lotSizeSqft > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Lot Size</span><span className="font-medium">{property.lotSizeSqft?.toLocaleString()} sqft</span></div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Investment Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
                Investment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Purchase Price</span><span className="font-medium">{formatCurrency(property.purchasePrice)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Rehab Cost</span><span className="font-medium">{formatCurrency(rehabTotals.totalCost)}</span></div>
                {financing?.useHardMoney && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Financing Costs</span><span className="font-medium">{formatCurrency(profit.financingCosts || 0)}</span></div>
                )}
                <div className="flex justify-between"><span className="text-muted-foreground">Closing Costs</span><span className="font-medium">{formatCurrency((closing?.totalClosingCosts || 0))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Holding Costs</span><span className="font-medium">{formatCurrency(holding?.totalHoldingCosts || 0)}</span></div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-bold">Total Investment</span>
                  <span className="font-bold">{formatCurrency(profit.totalInvestment)}</span>
                </div>
                <div className="flex justify-between bg-[oklch(0.50_0.18_25)]/5 -mx-3 px-3 py-2 rounded">
                  <span className="font-bold text-[oklch(0.50_0.18_25)]">After Repair Value</span>
                  <span className="font-bold text-[oklch(0.50_0.18_25)]">{formatCurrency(effectiveArv)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rehab Breakdown */}
        {rehabTotals && rehabTotals.totalCost > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
                Rehab Summary
                {regionalLabel && regionalLabel !== 'National Average' && (
                  <span className="text-xs font-normal text-muted-foreground ml-2">({regionalLabel} market)</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-secondary/40 rounded-lg">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Materials</p>
                  <p className="text-lg font-bold">{formatCurrency(rehabTotals.totalMaterials)}</p>
                </div>
                <div className="p-3 bg-secondary/40 rounded-lg">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Labor</p>
                  <p className="text-lg font-bold">{formatCurrency(rehabTotals.totalLabor)}</p>
                </div>
                <div className="p-3 bg-[oklch(0.50_0.18_25)]/10 rounded-lg">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Total Rehab</p>
                  <p className="text-lg font-bold text-[oklch(0.50_0.18_25)]">{formatCurrency(rehabTotals.totalCost)}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Estimated Duration: {rehabTotals.totalDurationDays} days ({Math.ceil(rehabTotals.totalDurationDays / 7)} weeks) | 
                Material Tier: {materialTier?.charAt(0).toUpperCase() + materialTier?.slice(1) || 'Standard'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Comparable Sales */}
        {comps && comps.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
                Comparable Sales ({comps.length})
              </CardTitle>
              <p className="text-xs text-muted-foreground">Standard retail (arms-length) sales of renovated properties</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="text-left py-2 font-semibold">Address</th>
                      <th className="text-right py-2 font-semibold">Sale Price</th>
                      <th className="text-right py-2 font-semibold">Sq Ft</th>
                      <th className="text-right py-2 font-semibold">$/Sq Ft</th>
                      <th className="text-right py-2 font-semibold">Bd/Ba</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comps.map((c: any, i: number) => (
                      <tr key={i} className="border-b border-border/40">
                        <td className="py-2">{c.address}</td>
                        <td className="text-right font-medium">{formatCurrency(c.salePrice)}</td>
                        <td className="text-right">{c.sqft ? c.sqft.toLocaleString() : '—'}</td>
                        <td className="text-right">{c.sqft ? '$' + Math.round(c.salePrice / c.sqft).toLocaleString() : '—'}</td>
                        <td className="text-right">{c.beds}/{c.baths}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Property Photos */}
        {dealPhotos && dealPhotos.length > 0 && (
          <PhotoGalleryReadOnly photos={dealPhotos} />
        )}

        {/* Financing Details */}
        {financing?.useHardMoney && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
                Financing Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-secondary/40 rounded-lg">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">LTV</p>
                  <p className="font-bold">{financing.loanToValue}%</p>
                </div>
                <div className="p-3 bg-secondary/40 rounded-lg">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Interest Rate</p>
                  <p className="font-bold">{financing.interestRate}%</p>
                </div>
                <div className="p-3 bg-secondary/40 rounded-lg">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Points</p>
                  <p className="font-bold">{financing.points}</p>
                </div>
                <div className="p-3 bg-secondary/40 rounded-lg">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Loan Amount</p>
                  <p className="font-bold">{formatCurrency(financing.loanAmount)}</p>
                </div>
              </div>
              {financing.gapFunderEnabled && (
                <div className="mt-3 p-3 bg-amber-500/10 rounded-lg">
                  <p className="text-xs font-semibold text-amber-600 mb-1">Gap Funding Active</p>
                  <p className="text-sm">Gap Amount: <strong>{formatCurrency(financing.gapAmount)}</strong> at {financing.gapInterest}% + {financing.gapPoints} pts</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="text-center text-[10px] text-muted-foreground border-t pt-6 mt-8 space-y-1">
          <p><strong>{COMPANY_NAME} Real Estate Investment System</strong></p>
          <p>This report is for informational purposes only. All projections are estimates based on user-provided data and generalized assumptions. Actual results may vary. Always perform independent due diligence and consult with qualified professionals before making investment decisions.</p>
        </div>

        {/* CTA */}
        <div className="text-center pb-8 print:hidden">
          <Link href="/analyzer">
            <Button className="gap-2">
              Analyze Your Own Deal <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
