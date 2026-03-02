import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Calculator, DollarSign, TrendingUp, ArrowRight, ChevronDown, ChevronUp,
  BookOpen, Zap, Target, BarChart3, HelpCircle, CheckCircle2, AlertTriangle,
  Lightbulb, ArrowLeft, Play, Download
} from 'lucide-react';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/RUvFlwFYmtbQizbR.png";

function Section({ id, title, icon: Icon, children, defaultOpen = false }: {
  id: string; title: string; icon: typeof Calculator; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} className="border border-[oklch(0.25_0_0)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 bg-[oklch(0.15_0_0)] hover:bg-[oklch(0.17_0_0)] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)]/15">
            <Icon className="w-5 h-5 text-[oklch(0.65_0.18_18)]" />
          </div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-[oklch(0.5_0_0)]" /> : <ChevronDown className="w-5 h-5 text-[oklch(0.5_0_0)]" />}
      </button>
      {open && <div className="p-6 bg-[oklch(0.12_0_0)] space-y-4">{children}</div>}
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-[oklch(0.55_0.18_145)]/10 border border-[oklch(0.55_0.18_145)]/20">
      <Lightbulb className="w-5 h-5 text-[oklch(0.65_0.15_145)] shrink-0 mt-0.5" />
      <div className="text-sm text-[oklch(0.75_0.08_145)]">{children}</div>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-[oklch(0.55_0.18_60)]/10 border border-[oklch(0.55_0.18_60)]/20">
      <AlertTriangle className="w-5 h-5 text-[oklch(0.70_0.15_60)] shrink-0 mt-0.5" />
      <div className="text-sm text-[oklch(0.75_0.08_60)]">{children}</div>
    </div>
  );
}

function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-[oklch(0.48_0.20_18)] flex items-center justify-center text-white font-bold text-sm">
        {num}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-white mb-2">{title}</h4>
        <div className="text-sm text-[oklch(0.65_0_0)] space-y-2">{children}</div>
      </div>
    </div>
  );
}

function FormulaBox({ label, formula, explanation }: { label: string; formula: string; explanation: string }) {
  return (
    <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
      <p className="text-xs text-[oklch(0.5_0_0)] uppercase tracking-wider mb-1">{label}</p>
      <p className="font-mono text-sm text-[oklch(0.65_0.18_18)] font-bold mb-2">{formula}</p>
      <p className="text-xs text-[oklch(0.55_0_0)]">{explanation}</p>
    </div>
  );
}

function ScenarioExplainer({ num, name, description, whenToUse, example }: {
  num: number; name: string; description: string; whenToUse: string; example: string;
}) {
  return (
    <div className="bg-[oklch(0.15_0_0)] rounded-lg p-5 border border-[oklch(0.25_0_0)]">
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 rounded bg-[oklch(0.48_0.20_18)]/20 text-[oklch(0.65_0.18_18)] text-xs font-bold">
          Scenario {num}
        </span>
        <h4 className="font-bold text-white">{name}</h4>
      </div>
      <p className="text-sm text-[oklch(0.65_0_0)] mb-3">{description}</p>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-[oklch(0.5_0_0)] uppercase tracking-wider mb-1">When to Use</p>
          <p className="text-sm text-[oklch(0.6_0_0)]">{whenToUse}</p>
        </div>
        <div>
          <p className="text-xs text-[oklch(0.5_0_0)] uppercase tracking-wider mb-1">Example</p>
          <p className="text-sm text-[oklch(0.6_0_0)]">{example}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfitCalcGuide() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[oklch(0.15_0_0)] text-white border-b border-[oklch(0.25_0_0)]">
        <div className="container py-12">
          <Link href="/profit-calculator">
            <Button variant="ghost" size="sm" className="mb-4 text-[oklch(0.5_0_0)] hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Profit Calculator
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[oklch(0.48_0.20_18)]/15">
              <BookOpen className="w-8 h-8 text-[oklch(0.65_0.18_18)]" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                Profit Calculator <span className="text-[oklch(0.65_0.18_18)]">Training Guide</span>
              </h1>
              <p className="text-[oklch(0.5_0_0)] text-sm">Master every feature of the Freedom One Profit Calculator</p>
            </div>
          </div>
          <p className="text-[oklch(0.6_0_0)] max-w-2xl leading-relaxed">
            This comprehensive guide walks you through every section of the Profit Calculator — from entering
            property details to understanding all 6 financing scenarios, the rapid-fire offer system, year-built
            rehab estimator, resale sensitivity analysis, and deal/no-deal indicators. By the end, you'll be
            able to analyze any deal in under 5 minutes.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="container py-8">
        <div className="bg-[oklch(0.15_0_0)] rounded-xl p-6 border border-[oklch(0.25_0_0)] mb-8">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-[oklch(0.65_0.18_18)]" /> Table of Contents
          </h3>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              { id: 'overview', label: '1. Overview & Quick Start' },
              { id: 'property-inputs', label: '2. Property Inputs' },
              { id: 'year-built', label: '3. Year-Built Rehab Estimator' },
              { id: 'financing', label: '4. Financing Parameters' },
              { id: 'scenarios', label: '5. The 6 Financing Scenarios' },
              { id: 'deal-check', label: '6. Deal / No Deal Indicator' },
              { id: 'rapid-fire', label: '7. Rapid-Fire Offer Pricing' },
              { id: 'resale', label: '8. Resale Sensitivity Table' },
              { id: 'evaluation', label: '9. Property Evaluation Scoring' },
              { id: 'excel', label: '10. Excel Export & Templates' },
              { id: 'workflow', label: '11. Complete Workflow Example' },
              { id: 'ninja', label: '12. Ninja Tips & Advanced Strategies' },
            ].map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-2 text-sm text-[oklch(0.6_0_0)] hover:text-[oklch(0.65_0.18_18)] transition-colors py-1"
              >
                <ArrowRight className="w-3 h-3" /> {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4 max-w-4xl">
          {/* 1. Overview */}
          <Section id="overview" title="1. Overview & Quick Start" icon={Play} defaultOpen={true}>
            <p className="text-sm text-[oklch(0.65_0_0)]">
              The Freedom One Profit Calculator is a comprehensive deal analysis tool that evaluates any fix-and-flip
              property across <strong className="text-white">6 different financing scenarios</strong> simultaneously. Unlike simple
              calculators that only show one financing structure, this tool lets you compare how the same deal performs
              with different lending arrangements — so you can choose the most profitable path forward.
            </p>

            <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
              <h4 className="font-bold text-white text-sm mb-3">What the Calculator Does:</h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-[oklch(0.6_0_0)]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[oklch(0.55_0.18_145)] shrink-0 mt-0.5" />
                  <span>Calculates Total Project Cost (purchase + rehab + closing + holding)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[oklch(0.55_0.18_145)] shrink-0 mt-0.5" />
                  <span>Runs all 6 financing scenarios with profit projections</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[oklch(0.55_0.18_145)] shrink-0 mt-0.5" />
                  <span>Shows Deal/No Deal verdict for each scenario</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[oklch(0.55_0.18_145)] shrink-0 mt-0.5" />
                  <span>Generates rapid-fire offer prices at different ROI targets</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[oklch(0.55_0.18_145)] shrink-0 mt-0.5" />
                  <span>Estimates rehab costs from year built and square footage</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[oklch(0.55_0.18_145)] shrink-0 mt-0.5" />
                  <span>Shows resale sensitivity (what if ARV is $10K higher or lower?)</span>
                </div>
              </div>
            </div>

            <h4 className="font-bold text-white text-sm">Quick Start (5 Steps):</h4>
            <div className="space-y-4">
              <Step num={1} title="Enter Property Details">
                <p>Fill in the address, asking price, your offer price, ARV (After Repair Value), year built, and square footage.</p>
              </Step>
              <Step num={2} title="Set Rehab Costs">
                <p>Enter your rehab estimate manually, or use the Year-Built Rehab Estimator to get a baseline. Adjust the rehab level (1, 2, or 3) for light, medium, or heavy renovations.</p>
              </Step>
              <Step num={3} title="Review Financing Parameters">
                <p>The default financing terms are pre-filled with industry-standard rates. Adjust if your lender offers different terms.</p>
              </Step>
              <Step num={4} title="Analyze the 6 Scenarios">
                <p>Expand each scenario card to see the full breakdown — loan amounts, points, interest, gap funding, out-of-pocket costs, and projected profit.</p>
              </Step>
              <Step num={5} title="Make Your Decision">
                <p>Look at the Deal/No Deal indicator, compare scenarios, and use the rapid-fire offer table to find your maximum purchase price at different ROI targets.</p>
              </Step>
            </div>
          </Section>

          {/* 2. Property Inputs */}
          <Section id="property-inputs" title="2. Property Inputs" icon={Calculator}>
            <p className="text-sm text-[oklch(0.65_0_0)] mb-4">
              The property inputs section is where you enter the basic deal information. Every number here flows
              into all 6 financing scenarios, so accuracy matters.
            </p>

            <div className="space-y-3">
              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Address</h4>
                <p className="text-sm text-[oklch(0.6_0_0)]">The property address. Used for identification and appears on exported reports.</p>
              </div>

              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Asking Price</h4>
                <p className="text-sm text-[oklch(0.6_0_0)]">The seller's listed price. Used in the Rapid-Fire Offer table to show what percentage of asking your offers represent. Does NOT affect profit calculations — only Purchase Price does.</p>
              </div>

              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Purchase Price (Your Offer)</h4>
                <p className="text-sm text-[oklch(0.6_0_0)]">What you plan to actually pay for the property. This is the number that drives all profit calculations. Always negotiate below asking — the profit is made at purchase.</p>
              </div>

              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">ARV (After Repair Value)</h4>
                <p className="text-sm text-[oklch(0.6_0_0)]">The expected sale price after renovations are complete. Determined by comparable sales (comps) of recently renovated homes in the area. This is the most important number — if your ARV is wrong, everything else is wrong.</p>
              </div>

              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Year Built & Square Footage</h4>
                <p className="text-sm text-[oklch(0.6_0_0)]">Used by the Year-Built Rehab Estimator to calculate a baseline rehab cost. Older homes need more work; larger homes cost more to renovate.</p>
              </div>

              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Rehab Cost</h4>
                <p className="text-sm text-[oklch(0.6_0_0)]">Total renovation budget. Enter manually from your contractor bids, or use the Year-Built Estimator as a starting point. This includes all materials, labor, permits, and contingency.</p>
              </div>

              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Monthly Holding Costs</h4>
                <p className="text-sm text-[oklch(0.6_0_0)]">Monthly expenses while you own the property — insurance, utilities, property taxes, HOA, lawn care, etc. Default is $2,500/month. Adjust based on your market.</p>
              </div>

              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Months to Hold</h4>
                <p className="text-sm text-[oklch(0.6_0_0)]">Total project timeline: rehab time + time on market + escrow/closing. Default is 6 months. For a typical flip: 3 months rehab + 2 months on market + 1 month escrow = 6 months.</p>
              </div>
            </div>

            <Tip>
              <strong>Pro Tip:</strong> Always overestimate rehab costs by 10-15% and add 1-2 extra months to your hold time.
              Unexpected issues always come up. It's better to be pleasantly surprised by extra profit than to lose money
              because you underestimated.
            </Tip>
          </Section>

          {/* 3. Year-Built Rehab Estimator */}
          <Section id="year-built" title="3. Year-Built Rehab Estimator" icon={Zap}>
            <p className="text-sm text-[oklch(0.65_0_0)] mb-4">
              The Year-Built Rehab Estimator provides a quick baseline rehab cost based on the property's age,
              size, and condition level. It's not a replacement for a detailed scope of work — it's a rapid
              screening tool for when you're evaluating multiple properties quickly.
            </p>

            <h4 className="font-bold text-white text-sm mb-3">How It Works:</h4>
            <FormulaBox
              label="Base Rehab Formula"
              formula="Base = $21,000 × Year Factor + Local Area Additional"
              explanation="The $21,000 baseline represents 'always items' — things every flip needs regardless of condition (paint, flooring, fixtures, appliances, landscaping). The Year Factor scales this based on age."
            />

            <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
              <h4 className="font-bold text-white text-sm mb-3">Year-Built Factors:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {[
                  { age: '0-5 years', factor: '0.30' },
                  { age: '6-10 years', factor: '0.40' },
                  { age: '11-15 years', factor: '0.50' },
                  { age: '16-20 years', factor: '0.60' },
                  { age: '21-30 years', factor: '0.70' },
                  { age: '31-40 years', factor: '0.80' },
                  { age: '41-50 years', factor: '0.90' },
                  { age: '51-60 years', factor: '1.00' },
                  { age: '61-70 years', factor: '1.10' },
                  { age: '71-80 years', factor: '1.20' },
                  { age: '80+ years', factor: '1.30' },
                ].map(row => (
                  <div key={row.age} className="flex justify-between p-2 rounded bg-[oklch(0.14_0_0)]">
                    <span className="text-[oklch(0.6_0_0)]">{row.age}</span>
                    <span className="text-white font-mono">{row.factor}×</span>
                  </div>
                ))}
              </div>
            </div>

            <FormulaBox
              label="Square Footage Adjustment"
              formula="SqFt Adj = ceil((SqFt - 2000) / 500) × $3,000"
              explanation="For homes over 2,000 sqft, add $3,000 for every additional 500 sqft. A 3,000 sqft home adds $6,000 to the base."
            />

            <FormulaBox
              label="Rehab Levels"
              formula="Level 1 = Base | Level 2 = Base + 30% | Level 3 = Base + 60%"
              explanation="Level 1 is cosmetic (paint, flooring, fixtures). Level 2 adds structural updates (kitchen, baths, HVAC). Level 3 is a full gut renovation."
            />

            <FormulaBox
              label="Pool Adjustment"
              formula="Pool = +$4,000"
              explanation="If the property has a pool, add $4,000 for resurfacing, equipment, and compliance."
            />

            <Warning>
              <strong>Important:</strong> The Year-Built Estimator is a screening tool, not a bid. Always get actual
              contractor bids and do a detailed scope of work before making a final offer. Use this to quickly filter
              properties worth investigating further.
            </Warning>
          </Section>

          {/* 4. Financing Parameters */}
          <Section id="financing" title="4. Financing Parameters" icon={DollarSign}>
            <p className="text-sm text-[oklch(0.65_0_0)] mb-4">
              The financing section lets you customize the terms for each type of lender. The calculator comes
              pre-loaded with industry-standard defaults, but you should adjust these to match your actual lender terms.
            </p>

            <div className="space-y-3">
              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Hard Money Lender (HML) — ARV Based</h4>
                <p className="text-sm text-[oklch(0.6_0_0)] mb-2">Loans based on the After Repair Value. Typically 60-70% LTV.</p>
                <div className="text-xs text-[oklch(0.5_0_0)] space-y-1">
                  <p><strong className="text-[oklch(0.6_0_0)]">LTV:</strong> 65% (default) — the lender loans 65% of the ARV</p>
                  <p><strong className="text-[oklch(0.6_0_0)]">Points:</strong> 2% — origination fee charged upfront</p>
                  <p><strong className="text-[oklch(0.6_0_0)]">Interest Rate:</strong> 12% annual — typical HML rate</p>
                  <p><strong className="text-[oklch(0.6_0_0)]">Admin Fee:</strong> $1,000 — junk fees, processing, etc.</p>
                </div>
              </div>

              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Hard Money Lender (HML) — Purchase Price Based</h4>
                <p className="text-sm text-[oklch(0.6_0_0)] mb-2">Loans based on the purchase price. Higher LTV (85-95%) but doesn't account for rehab.</p>
                <div className="text-xs text-[oklch(0.5_0_0)] space-y-1">
                  <p><strong className="text-[oklch(0.6_0_0)]">LTV:</strong> 90% (default) — the lender loans 90% of purchase price</p>
                  <p><strong className="text-[oklch(0.6_0_0)]">Points:</strong> 2% — same origination structure</p>
                  <p><strong className="text-[oklch(0.6_0_0)]">Interest Rate:</strong> 12% annual</p>
                  <p><strong className="text-[oklch(0.6_0_0)]">Admin Fee:</strong> $1,000</p>
                </div>
              </div>

              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Gap Funder (Debt)</h4>
                <p className="text-sm text-[oklch(0.6_0_0)] mb-2">A second lender who covers the gap between the HML loan and total project cost. Earns interest and points.</p>
                <div className="text-xs text-[oklch(0.5_0_0)] space-y-1">
                  <p><strong className="text-[oklch(0.6_0_0)]">Points:</strong> 0% (default) — often negotiable</p>
                  <p><strong className="text-[oklch(0.6_0_0)]">Interest Rate:</strong> 12% annual</p>
                  <p><strong className="text-[oklch(0.6_0_0)]">Interest Type:</strong> Annual, Straight, Monthly, or Deferred</p>
                </div>
              </div>

              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Gap Funder (Equity)</h4>
                <p className="text-sm text-[oklch(0.6_0_0)] mb-2">Instead of interest, the gap funder gets a percentage of the profit. No monthly payments — they get paid at closing.</p>
                <div className="text-xs text-[oklch(0.5_0_0)]">
                  <p><strong className="text-[oklch(0.6_0_0)]">Equity Split:</strong> 25% (default) — gap funder gets 25% of profit</p>
                </div>
              </div>

              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">100% Private Lender (Debt)</h4>
                <p className="text-sm text-[oklch(0.6_0_0)] mb-2">One lender funds the entire project. You bring $0 to the table. Lender earns interest and points.</p>
                <div className="text-xs text-[oklch(0.5_0_0)] space-y-1">
                  <p><strong className="text-[oklch(0.6_0_0)]">LTV:</strong> 100% — covers everything</p>
                  <p><strong className="text-[oklch(0.6_0_0)]">Interest Rate:</strong> 12% annual</p>
                  <p><strong className="text-[oklch(0.6_0_0)]">Interest Type:</strong> Monthly (default) — or Deferred to closing</p>
                </div>
              </div>

              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">100% Private Lender (Equity)</h4>
                <p className="text-sm text-[oklch(0.6_0_0)] mb-2">One lender funds everything and gets a profit split instead of interest. True partnership deal.</p>
                <div className="text-xs text-[oklch(0.5_0_0)]">
                  <p><strong className="text-[oklch(0.6_0_0)]">Equity Split:</strong> 50% (default) — lender gets half the profit</p>
                </div>
              </div>
            </div>

            <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
              <h4 className="font-bold text-white text-sm mb-2">Interest Type Explained:</h4>
              <div className="space-y-2 text-sm text-[oklch(0.6_0_0)]">
                <p><strong className="text-white">Annual:</strong> (Rate / 12) × Months — standard monthly accrual</p>
                <p><strong className="text-white">Straight:</strong> Principal × Rate — flat percentage regardless of time</p>
                <p><strong className="text-white">Monthly:</strong> Same as Annual — paid monthly during the project</p>
                <p><strong className="text-white">Deferred:</strong> Same calculation as Annual — but paid at closing, not monthly</p>
              </div>
            </div>

            <Tip>
              <strong>Ninja Tip:</strong> When comparing debt vs. equity gap funding, debt is better when you expect high profit
              (you keep more), while equity is better when profit is uncertain (you share the risk). Run both scenarios
              and see which gives you a better deal check.
            </Tip>
          </Section>

          {/* 5. The 6 Financing Scenarios */}
          <Section id="scenarios" title="5. The 6 Financing Scenarios" icon={BarChart3}>
            <p className="text-sm text-[oklch(0.65_0_0)] mb-4">
              The calculator runs your deal through 6 different financing structures simultaneously. Each scenario
              shows the total cost, projected profit, out-of-pocket requirement, and a Deal/No Deal verdict.
            </p>

            <div className="space-y-3">
              <ScenarioExplainer
                num={1}
                name="HML (ARV) + Gap Funder — Debt"
                description="Hard money lender loans based on ARV (65% LTV). A gap funder covers the remaining project costs and earns interest/points on their loan."
                whenToUse="When you have a gap funder willing to lend at a fixed rate. Good when you're confident in the ARV and want predictable costs."
                example="ARV = $300K → HML loans $195K (65%). TPC = $250K → Gap funder covers $55K + HML costs. You bring $0."
              />
              <ScenarioExplainer
                num={2}
                name="HML (ARV) + Gap Funder — Equity"
                description="Same HML structure, but the gap funder gets a percentage of profit instead of interest. No monthly payments to the gap funder."
                whenToUse="When your gap funder prefers upside potential over fixed returns. Great for deals with high profit margins."
                example="Same deal, but gap funder gets 25% of profit instead of 12% interest. If profit is $60K, they get $15K."
              />
              <ScenarioExplainer
                num={3}
                name="HML (Purchase Price) + Gap Funder — Debt"
                description="Hard money lender loans based on purchase price (90% LTV). Higher LTV means a smaller gap, but the loan doesn't cover rehab."
                whenToUse="When your HML lends on purchase price rather than ARV. Common with newer investors or properties that need heavy rehab."
                example="Purchase = $180K → HML loans $162K (90%). TPC = $250K → Gap funder covers $88K + HML costs."
              />
              <ScenarioExplainer
                num={4}
                name="HML (Purchase Price) + Gap Funder — Equity"
                description="Purchase price HML with an equity-based gap funder. The gap is larger since the HML doesn't account for ARV."
                whenToUse="When you need a larger gap covered and your funder wants profit participation rather than fixed returns."
                example="Same structure, but gap funder gets 25% of profit. Larger gap = more risk for the funder = they may want a bigger split."
              />
              <ScenarioExplainer
                num={5}
                name="100% Private Lender — Debt"
                description="One private lender funds the entire project (100% LTV). They earn interest and points. You bring zero dollars to the table."
                whenToUse="When you have a private money partner (friend, family, self-directed IRA investor) willing to fund the whole deal. Best for beginners with no capital."
                example="TPC = $250K → PL loans $250K at 12% interest. Your out-of-pocket = $0. They earn ~$15K in interest over 6 months."
              />
              <ScenarioExplainer
                num={6}
                name="100% Private Lender — Equity"
                description="One private lender funds everything and gets a profit split. True 50/50 (or custom) partnership. No interest payments."
                whenToUse="When your lender wants to be a true partner. Best for high-profit deals where splitting 50/50 still leaves you with strong returns."
                example="TPC = $250K → PL funds everything. Profit = $60K → You get $30K, they get $30K. Their ROI on $250K = 12%."
              />
            </div>

            <Tip>
              <strong>Which scenario is best?</strong> There's no single answer — it depends on your capital, your lender relationships,
              and the deal itself. Generally: Scenarios 5-6 (100% PL) are best for beginners with no money. Scenarios 1-2 (HML on ARV)
              are best for experienced investors with established HML relationships. Scenarios 3-4 (HML on PP) are the middle ground.
            </Tip>
          </Section>

          {/* 6. Deal/No Deal */}
          <Section id="deal-check" title="6. Deal / No Deal Indicator" icon={Target}>
            <p className="text-sm text-[oklch(0.65_0_0)] mb-4">
              Every scenario includes a Deal/No Deal verdict based on a minimum profit threshold. This is your
              go/no-go signal.
            </p>

            <FormulaBox
              label="Minimum Profit Required"
              formula="MIN_PROFIT = MAX(ARV × 10%, $20,000)"
              explanation="Your projected profit must exceed either 10% of ARV or $20,000, whichever is greater. This ensures you have enough margin to absorb unexpected costs."
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[oklch(0.55_0.18_145)]/10 rounded-lg p-4 border border-[oklch(0.55_0.18_145)]/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[oklch(0.55_0.18_145)]" />
                  <h4 className="font-bold text-[oklch(0.75_0.12_145)]">YES! — It's a Deal</h4>
                </div>
                <p className="text-sm text-[oklch(0.65_0.08_145)]">Projected profit meets or exceeds the minimum threshold. Proceed with due diligence, inspections, and contractor bids.</p>
              </div>
              <div className="bg-[oklch(0.55_0.18_18)]/10 rounded-lg p-4 border border-[oklch(0.55_0.18_18)]/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-[oklch(0.65_0.18_18)]" />
                  <h4 className="font-bold text-[oklch(0.75_0.12_18)]">NOPE! — Not a Deal</h4>
                </div>
                <p className="text-sm text-[oklch(0.65_0.08_18)]">Projected profit is below the minimum threshold. Either negotiate a lower purchase price, reduce rehab scope, or walk away.</p>
              </div>
            </div>

            <Warning>
              <strong>Remember:</strong> A "Deal" verdict doesn't mean you should buy blindly. It means the numbers work
              on paper. You still need to verify the ARV with real comps, get actual contractor bids, and inspect the property.
              The calculator is a screening tool, not a crystal ball.
            </Warning>
          </Section>

          {/* 7. Rapid-Fire Offer Pricing */}
          <Section id="rapid-fire" title="7. Rapid-Fire Offer Pricing" icon={Zap}>
            <p className="text-sm text-[oklch(0.65_0_0)] mb-4">
              The Rapid-Fire Offer table shows you the maximum purchase price at different ROI targets (18% down to 13%).
              This is incredibly useful when you're making multiple offers and need to know your ceiling quickly.
            </p>

            <FormulaBox
              label="Rapid-Fire Formula"
              formula="Offer = (ARV × 0.93 / (1 + ROI)) - Rehab - Holding) / 1.02"
              explanation="Solves backwards from your target ROI to find the maximum offer price. The 0.93 accounts for 7% selling costs (5% realtor + 2% closing). The 1.02 accounts for 2% purchase closing costs."
            />

            <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
              <h4 className="font-bold text-white text-sm mb-3">How to Read the Table:</h4>
              <div className="space-y-2 text-sm text-[oklch(0.6_0_0)]">
                <p><strong className="text-white">ROI Target:</strong> Your desired return on investment (18% is aggressive, 13% is conservative)</p>
                <p><strong className="text-white">Offer Price:</strong> The maximum you should pay to achieve that ROI</p>
                <p><strong className="text-white">% of Asking:</strong> What percentage of the seller's asking price your offer represents</p>
                <p><strong className="text-white">Projected Profit:</strong> Expected profit at that offer price</p>
              </div>
            </div>

            <Tip>
              <strong>Ninja Tip:</strong> Start your offer at the 18% ROI row. If rejected, move down to 16%, then 15%.
              Never go below 13% — that's your walk-away point. The rapid-fire table gives you a negotiation ladder
              with pre-calculated steps.
            </Tip>
          </Section>

          {/* 8. Resale Sensitivity */}
          <Section id="resale" title="8. Resale Sensitivity Table" icon={TrendingUp}>
            <p className="text-sm text-[oklch(0.65_0_0)] mb-4">
              The Resale Sensitivity Table shows how your profit changes if the actual sale price differs from your
              ARV estimate. It runs scenarios from ARV - $20,000 to ARV + $20,000 in $5,000 increments.
            </p>

            <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
              <h4 className="font-bold text-white text-sm mb-3">What Each Column Shows:</h4>
              <div className="space-y-2 text-sm text-[oklch(0.6_0_0)]">
                <p><strong className="text-white">Resale Price:</strong> The hypothetical sale price (ARV ± adjustment)</p>
                <p><strong className="text-white">Net After Costs:</strong> Sale price minus 7% selling costs (realtor + closing)</p>
                <p><strong className="text-white">Total Profit:</strong> Net after costs minus total project cost (including all financing)</p>
                <p><strong className="text-white">Gap/PL Share:</strong> (Equity scenarios only) What the equity partner receives</p>
                <p><strong className="text-white">Your Share:</strong> (Equity scenarios only) What you keep after the split</p>
              </div>
            </div>

            <Tip>
              <strong>Key Insight:</strong> Look at the ARV - $10,000 row. If you're still profitable at $10K below your ARV estimate,
              you have a solid deal with margin for error. If you go negative at ARV - $5,000, the deal is too tight.
            </Tip>
          </Section>

          {/* 9. Property Evaluation */}
          <Section id="evaluation" title="9. Property Evaluation Scoring" icon={Target}>
            <p className="text-sm text-[oklch(0.65_0_0)] mb-4">
              The Property Evaluation section lets you score a property on 4 key factors (1-4 scale each).
              This helps you objectively compare properties beyond just the numbers.
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              {[
                { name: 'Location', desc: '1 = Bad area, 2 = Okay, 3 = Good neighborhood, 4 = Prime location' },
                { name: 'Curb Appeal', desc: '1 = Eyesore, 2 = Needs work, 3 = Decent, 4 = Great street presence' },
                { name: 'Layout', desc: '1 = Awkward/small, 2 = Functional, 3 = Good flow, 4 = Open/desirable' },
                { name: 'Rear Yard', desc: '1 = No yard, 2 = Small, 3 = Good size, 4 = Large/private' },
              ].map(item => (
                <div key={item.name} className="bg-[oklch(0.18_0_0)] rounded-lg p-3 border border-[oklch(0.3_0_0)]">
                  <h4 className="font-bold text-white text-sm mb-1">{item.name}</h4>
                  <p className="text-xs text-[oklch(0.55_0_0)]">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
              <h4 className="font-bold text-white text-sm mb-2">Score Interpretation:</h4>
              <div className="space-y-1 text-sm text-[oklch(0.6_0_0)]">
                <p><strong className="text-[oklch(0.55_0.18_145)]">14-16:</strong> Excellent — strong candidate for a flip</p>
                <p><strong className="text-[oklch(0.65_0.15_90)]">11-13:</strong> Good — monitor for resubmittal if offer rejected</p>
                <p><strong className="text-[oklch(0.65_0.15_60)]">8-10:</strong> Average — proceed with caution</p>
                <p><strong className="text-[oklch(0.65_0.18_18)]">4-7:</strong> Below average — consider passing unless price is exceptional</p>
              </div>
            </div>
          </Section>

          {/* 10. Excel Export */}
          <Section id="excel" title="10. Excel Export & Templates" icon={Download}>
            <p className="text-sm text-[oklch(0.65_0_0)] mb-4">
              The Profit Calculator includes two Excel export options:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Export Current Analysis</h4>
                <p className="text-sm text-[oklch(0.6_0_0)]">Downloads an Excel file with all your current inputs, all 6 scenario results, the rapid-fire table, and resale sensitivity data. Great for sharing with partners, lenders, or keeping records.</p>
              </div>
              <div className="bg-[oklch(0.18_0_0)] rounded-lg p-4 border border-[oklch(0.3_0_0)]">
                <h4 className="font-bold text-white text-sm mb-2">Download Blank Template</h4>
                <p className="text-sm text-[oklch(0.6_0_0)]">Downloads a blank Excel template with all the formulas built in. Use this offline when you don't have internet access, or share it as a lead magnet for your business.</p>
              </div>
            </div>
          </Section>

          {/* 11. Complete Workflow */}
          <Section id="workflow" title="11. Complete Workflow Example" icon={ArrowRight}>
            <p className="text-sm text-[oklch(0.65_0_0)] mb-4">
              Here's a complete example of analyzing a deal from start to finish:
            </p>

            <div className="space-y-5">
              <Step num={1} title="You find a property: 123 Main St, built 1985, 1,800 sqft">
                <p>Listed at $200,000. Your comps show ARV of $310,000 after renovation.</p>
              </Step>
              <Step num={2} title="Enter the basics">
                <p>Asking: $200,000 | Purchase Price (your offer): $175,000 | ARV: $310,000 | Year: 1985 | SqFt: 1,800</p>
              </Step>
              <Step num={3} title="Estimate rehab">
                <p>Click "Estimate from Year Built" — the calculator shows ~$18,900 base (40-year-old home, 0.9× factor). You know the kitchen and baths need full renovation, so you set Level 2 (+30%) = ~$24,570. You round up to $35,000 based on your walkthrough.</p>
              </Step>
              <Step num={4} title="Check the 70% Rule">
                <p>70% Rule: ($310,000 × 0.70) - $35,000 = $182,000. Your offer of $175,000 is BELOW the 70% rule — good sign.</p>
              </Step>
              <Step num={5} title="Review the 6 scenarios">
                <p>Scenario 1 (HML ARV + Gap Debt): Profit = $42,000 — DEAL! | Scenario 5 (100% PL Debt): Profit = $38,000 — DEAL! | Scenario 6 (100% PL Equity at 50/50): Your share = $22,500 — still a DEAL but tighter.</p>
              </Step>
              <Step num={6} title="Check resale sensitivity">
                <p>At ARV - $10,000 ($300K), Scenario 1 still shows $32,700 profit. At ARV - $20,000 ($290K), profit drops to $23,400 — still above the $20K floor. This deal has good margin.</p>
              </Step>
              <Step num={7} title="Make your decision">
                <p>The deal works across all scenarios with comfortable margins. Submit your offer at $175,000 with an inspection contingency. Use the rapid-fire table to know you can go up to $182,000 and still hit 15% ROI.</p>
              </Step>
            </div>
          </Section>

          {/* 12. Ninja Tips */}
          <Section id="ninja" title="12. Ninja Tips & Advanced Strategies" icon={Zap}>
            <div className="space-y-3">
              <Tip>
                <strong>Run all 6 scenarios before choosing a lender.</strong> Many investors default to one financing structure.
                By comparing all 6, you might discover that a 100% private lender equity deal gives you $0 out-of-pocket
                and still clears $25K profit — better than putting $30K down with an HML for $40K profit.
              </Tip>

              <Tip>
                <strong>Use the Rapid-Fire table as your negotiation playbook.</strong> Print it out before making calls.
                When a seller counters, you can instantly see if the new price still works at your minimum ROI target.
              </Tip>

              <Tip>
                <strong>Always check the resale sensitivity at ARV - $15,000.</strong> Markets shift. If your deal goes
                negative at just $15K below ARV, you're one bad comp away from losing money. Look for deals that stay
                profitable even at ARV - $20,000.
              </Tip>

              <Tip>
                <strong>Stack your financing.</strong> The best investors don't use just one lender. They use an HML for
                the purchase, a gap funder for the rehab, and negotiate deferred interest so they have $0 monthly payments
                during construction. The calculator shows you exactly how this works in Scenarios 1-4.
              </Tip>

              <Tip>
                <strong>Export to Excel for your lender package.</strong> When presenting a deal to a private lender,
                export the analysis to Excel and include it in your pitch. Professional-looking numbers build confidence
                and close funding faster.
              </Tip>

              <Tip>
                <strong>Use the Property Evaluation to break ties.</strong> When two deals have similar profit projections,
                the property with the higher evaluation score (better location, layout, curb appeal) will sell faster
                and closer to ARV. Speed = less holding costs = more profit.
              </Tip>
            </div>
          </Section>

          {/* CTA */}
          <div className="bg-[oklch(0.15_0_0)] rounded-xl p-8 border border-[oklch(0.25_0_0)] text-center">
            <Calculator className="w-10 h-10 mx-auto mb-4 text-[oklch(0.65_0.18_18)]" />
            <h3 className="text-xl font-bold text-white mb-2">Ready to Analyze a Deal?</h3>
            <p className="text-sm text-[oklch(0.6_0_0)] mb-6 max-w-md mx-auto">
              Now that you understand every feature, open the Profit Calculator and run your first analysis.
            </p>
            <Link href="/profit-calculator">
              <Button className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white font-semibold px-8">
                <Calculator className="w-4 h-4" /> Open Profit Calculator
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
