import { PropertyInput } from '@/components/PropertyInput';
import { CompManager } from '@/components/CompManager';
import { RehabEstimator } from '@/components/RehabEstimator';
import { FinancingSection } from '@/components/FinancingSection';
import { ProfitSummary } from '@/components/ProfitSummary';
import { InvestorReport } from '@/components/InvestorReport';
import { useFlipAnalyzer } from '@/hooks/useFlipAnalyzer';
import { Calculator, Save, AlertTriangle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'freedom-one-saved-deals';

export default function Analyzer() {
  const analyzer = useFlipAnalyzer();

  const handleSaveDeal = () => {
    const { property, profit, effectiveArv, rehabTotals, targetROI } = analyzer;
    if (!property.address || !property.purchasePrice) {
      toast.error('Please enter at least an address and purchase price before saving.');
      return;
    }

    const deal = {
      id: nanoid(),
      savedAt: new Date().toISOString(),
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
    };

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      existing.push(deal);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      toast.success('Deal saved! View it in Saved Deals.', {
        action: {
          label: 'View',
          onClick: () => window.location.href = '/saved-deals',
        },
      });
    } catch {
      toast.error('Failed to save deal. Storage may be full.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
            <Button
              onClick={handleSaveDeal}
              className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
            >
              <Save className="w-4 h-4" /> Save Deal
            </Button>
          </div>
        </div>

        <div className="grid xl:grid-cols-[1fr_360px] gap-6">
          {/* Left Column: Input Sections */}
          <div className="space-y-6">
            {/* 1. Subject Property */}
            <PropertyInput
              property={analyzer.property}
              onChange={analyzer.setProperty}
              regionalFactor={analyzer.regionalFactor}
              marketSelector={analyzer.marketSelector}
            />

            {/* 2. Comparable Sales */}
            <CompManager
              comps={analyzer.comps}
              addComp={analyzer.addComp}
              removeComp={analyzer.removeComp}
              arv={analyzer.arv}
              arvOverride={analyzer.arvOverride}
              setArvOverride={analyzer.setArvOverride}
              effectiveArv={analyzer.effectiveArv}
              subjectSqft={analyzer.property.sqft}
            />

            {/* 3. Rehab Estimator */}
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

            {/* 4. Investor Presentation Report */}
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
            />

            {/* 5. Financing & Costs */}
            <FinancingSection
              useHardMoney={analyzer.useHardMoney}
              setUseHardMoney={analyzer.setUseHardMoney}
              finParams={analyzer.finParams}
              setFinParams={analyzer.setFinParams}
              financing={analyzer.financing}
              closingParams={analyzer.closingParams}
              setClosingParams={analyzer.setClosingParams}
              closing={analyzer.closing}
              holdingParams={analyzer.holdingParams}
              setHoldingParams={analyzer.setHoldingParams}
              holding={analyzer.holding}
            />
          </div>

          {/* Right Column: Floating Profit Summary */}
          <div className="xl:sticky xl:top-20 xl:self-start">
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
