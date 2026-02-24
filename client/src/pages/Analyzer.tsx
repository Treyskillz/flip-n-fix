import { PropertyInput } from '@/components/PropertyInput';
import { CompManager } from '@/components/CompManager';
import { RehabEstimator } from '@/components/RehabEstimator';
import { FinancingSection } from '@/components/FinancingSection';
import { ProfitSummary } from '@/components/ProfitSummary';
import { useFlipAnalyzer } from '@/hooks/useFlipAnalyzer';
import { Calculator } from 'lucide-react';

export default function Analyzer() {
  const analyzer = useFlipAnalyzer();

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-[oklch(0.45_0.12_155)] text-white">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Fix & Flip Analyzer</h1>
              <p className="text-sm text-muted-foreground">Analyze any property for profitability in real-time</p>
            </div>
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
              scopeTotals={analyzer.scopeTotals}
              activePhases={analyzer.activePhases}
              rehabTotals={analyzer.rehabTotals}
              regionalLabel={analyzer.regionalFactor.label}
            />

            {/* 4. Financing & Costs */}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
