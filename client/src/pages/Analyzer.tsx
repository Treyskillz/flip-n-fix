import { PropertyInput } from '@/components/PropertyInput';
import { CompManager } from '@/components/CompManager';
import { RehabEstimator } from '@/components/RehabEstimator';
import { FinancingSection } from '@/components/FinancingSection';
import { ProfitSummary } from '@/components/ProfitSummary';
import { InvestorReport } from '@/components/InvestorReport';
import { PropertyPhotoGallery } from '@/components/PropertyPhotoGallery';
import { OnboardingTour, ReplayTourButton } from '@/components/OnboardingTour';
import { useFlipAnalyzer } from '@/hooks/useFlipAnalyzer';
import { useEffect, useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Calculator, Save, AlertTriangle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { nanoid } from 'nanoid';

export default function Analyzer() {
  const analyzer = useFlipAnalyzer();
  const [dealUniqueId] = useState(() => {
    // Use a stable unique ID per analyzer session for photo uploads
    const stored = sessionStorage.getItem('analyzer-deal-uid');
    if (stored) return stored;
    const uid = nanoid();
    sessionStorage.setItem('analyzer-deal-uid', uid);
    return uid;
  });

  const saveDealMutation = trpc.deals.save.useMutation({
    onSuccess: () => {
      toast.success('Deal saved to your portfolio!', {
        action: {
          label: 'View',
          onClick: () => window.location.href = '/saved-deals',
        },
      });
    },
    onError: (err) => {
      toast.error(`Failed to save deal: ${err.message}`);
    },
  });

  // Fetch photos for this deal to pass to InvestorReport
  const { data: dealPhotos = [] } = trpc.photos.list.useQuery(
    { dealUniqueId },
    { enabled: !!dealUniqueId }
  );
  const photosList = useMemo(() => dealPhotos.map(p => ({ url: p.url, caption: p.caption })), [dealPhotos]);

  // Receive renovation design data from Renovation Designer page
  useEffect(() => {
    try {
      const raw = localStorage.getItem('renovation-to-analyzer');
      if (!raw) return;
      const data = JSON.parse(raw);
      // Only apply if data is fresh (less than 30 seconds old)
      if (Date.now() - data.timestamp > 30000) {
        localStorage.removeItem('renovation-to-analyzer');
        return;
      }
      // Apply the material tier
      if (data.tier) {
        analyzer.setMaterialTier(data.tier);
      }
      // Enable the room and set condition to heavy (full renovation)
      if (data.roomId) {
        analyzer.setRoomCondition(data.roomId, 'full');
      }
      // Switch to scope mode so the user sees the room-by-room breakdown
      analyzer.setRehabMode('scope');
      // Clean up
      localStorage.removeItem('renovation-to-analyzer');
      toast.success(`Renovation design applied to Rehab Estimator — ${data.tier} tier, ${data.roomId} room enabled.`);
    } catch {
      // Silently ignore parse errors
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveDeal = () => {
    const { property, profit, effectiveArv, rehabTotals, targetROI } = analyzer;
    if (!property.address || !property.purchasePrice) {
      toast.error('Please enter at least an address and purchase price before saving.');
      return;
    }

    saveDealMutation.mutate({
      uniqueId: dealUniqueId,
      address: property.address,
      city: property.city,
      state: property.state,
      zip: property.zip,
      purchasePrice: property.purchasePrice,
      arv: effectiveArv,
      rehabCost: rehabTotals.totalCost,
      totalInvestment: profit.totalInvestment,
      netProfit: profit.netProfit,
      roi: profit.roi,
      dealVerdict: profit.dealVerdict,
      maxAllowableOffer: profit.maxAllowableOffer,
      recommendedMaxPrice: profit.recommendedMaxPrice,
      targetROI,
      sqft: property.sqft,
      beds: property.beds,
      baths: property.baths,
      yearBuilt: property.yearBuilt,
      market: analyzer.marketSelector.market.label,
      dealScore: profit.dealScore,
      cashOnCash: profit.cashOnCash,
      status: 'active',
      starred: false,
      notes: '',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <OnboardingTour />
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)] text-white">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Freedom One Deal Analyzer</h1>
                <p className="text-sm text-muted-foreground">Analyze any property for profitability in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-2" data-tour="save-deal">
              <ReplayTourButton />
              <Button
                onClick={handleSaveDeal}
                disabled={saveDealMutation.isPending}
                className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
              >
                <Save className="w-4 h-4" /> {saveDealMutation.isPending ? 'Saving...' : 'Save Deal'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-[1fr_360px] gap-6">
          {/* Left Column: Input Sections */}
          <div className="space-y-6">
            {/* 1. Subject Property */}
            <div data-tour="property-input">
            <PropertyInput
              property={analyzer.property}
              onChange={analyzer.setProperty}
              regionalFactor={analyzer.regionalFactor}
              marketSelector={analyzer.marketSelector}
            />
            </div>

            {/* 2. Comparable Sales */}
            <div data-tour="comp-manager">
            <CompManager
              comps={analyzer.comps}
              addComp={analyzer.addComp}
              removeComp={analyzer.removeComp}
              costBasis={analyzer.costBasis}
              compBasedArv={analyzer.compBasedArv}
              arvOverride={analyzer.arvOverride}
              setArvOverride={analyzer.setArvOverride}
              effectiveArv={analyzer.effectiveArv}
              subjectSqft={analyzer.property.sqft}
              subjectBeds={analyzer.property.beds}
              subjectBaths={analyzer.property.baths}
              purchasePrice={analyzer.property.purchasePrice}
              rehabCost={analyzer.rehabTotals.totalCost}
              subjectAddress={analyzer.property.address}
              subjectCity={analyzer.property.city}
              subjectState={analyzer.property.state}
              subjectZip={analyzer.property.zip}
              subjectYearBuilt={analyzer.property.yearBuilt}
              subjectPropertyType={analyzer.property.propertyType}
            />
            </div>

            {/* 3. Rehab Estimator */}
            <div data-tour="rehab-estimator">
            <RehabEstimator
              rehabMode={analyzer.rehabMode}
              setRehabMode={analyzer.setRehabMode}
              rehabLevel={analyzer.rehabLevel}
              setRehabLevel={analyzer.setRehabLevel}
              materialTier={analyzer.materialTier}
              setMaterialTier={analyzer.setMaterialTier}
              roomScopes={analyzer.roomScopes}
              toggleRoom={analyzer.toggleRoom}
              setRoomCondition={analyzer.setRoomCondition}
              scopeTotals={analyzer.scopeTotals}
              activePhases={analyzer.activePhases}
              rehabTotals={analyzer.rehabTotals}
              regionalLabel={analyzer.regionalFactor.label}
            />
            </div>

            {/* 4. Property Photos */}
            <PropertyPhotoGallery dealUniqueId={dealUniqueId} />

            {/* 5. Investor Presentation Report */}
            <div data-tour="investor-report">
            <InvestorReport
              property={analyzer.property}
              profit={analyzer.profit}
              financing={analyzer.financing}
              closing={analyzer.closing}
              holding={analyzer.holding}
              effectiveArv={analyzer.effectiveArv}
              rehabTotals={analyzer.rehabTotals}
              materialTier={analyzer.materialTier}
              targetROI={analyzer.targetROI}
              comps={analyzer.comps}
              roomScopes={analyzer.roomScopes}
              regionalLabel={analyzer.regionalFactor.label}
              materialTierKey={analyzer.materialTier as any}
              materialsFactor={analyzer.regionalFactor.materialsFactor}
              laborFactor={analyzer.regionalFactor.laborFactor}
              photos={photosList}
            />
            </div>

            {/* 5. Financing & Costs */}
            <FinancingSection
              useHardMoney={analyzer.useHardMoney}
              setUseHardMoney={analyzer.setUseHardMoney}
              lenderType={analyzer.lenderType}
              switchLenderType={analyzer.switchLenderType}
              finParams={analyzer.finParams}
              setFinParams={analyzer.setFinParams}
              financing={analyzer.financing}
              useGapFunding={analyzer.useGapFunding}
              setUseGapFunding={analyzer.setUseGapFunding}
              gapParams={analyzer.gapParams}
              setGapParams={analyzer.setGapParams}
              closingParams={analyzer.closingParams}
              setClosingParams={analyzer.setClosingParams}
              closing={analyzer.closing}
              holdingParams={analyzer.holdingParams}
              setHoldingParams={analyzer.setHoldingParams}
              holding={analyzer.holding}
            />
          </div>

          {/* Right Column: Floating Profit Summary */}
          <div className="xl:sticky xl:top-20 xl:self-start" data-tour="profit-summary">
            <ProfitSummary
              profit={analyzer.profit}
              rehabCost={analyzer.rehabTotals.totalCost}
              rehabDays={analyzer.rehabTotals.totalDurationDays}
              targetROI={analyzer.targetROI}
              setTargetROI={analyzer.setTargetROI}
            />
          </div>
        </div>

        {/* Contextual Disclaimer */}
        <div className="mt-8 p-4 bg-secondary/40 border border-border/50 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[oklch(0.48_0.20_18)] shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
              <p>
                <strong>Important Disclaimer:</strong> This analyzer provides rough estimates based on generalized assumptions 
                and the data you input. All calculations, projections, and deal verdicts are for informational purposes only 
                and should not be relied upon as the sole basis for any investment decision.
              </p>
              <p>
                Actual costs, property values, and returns will vary based on property condition, market conditions, contractor 
                pricing, and many other factors. Always perform your own due diligence, get professional inspections, obtain 
                multiple contractor bids, and consult with a licensed real estate attorney, CPA, and financial advisor before 
                making any investment.
              </p>
              <p className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <Link href="/disclaimers" className="text-[oklch(0.48_0.20_18)] hover:underline font-medium">
                  Read our full Legal Disclaimers & Terms of Use
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
