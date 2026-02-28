import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText, Download, Printer, Copy, Check, AlertTriangle, Info,
  ChevronDown, ChevronUp, BookOpen, Scale, Shield, DollarSign,
  ClipboardList, CheckCircle2, XCircle, ArrowRight, Lightbulb, Zap, Camera
} from 'lucide-react';
import { toast } from 'sonner';
import { printDocument } from '@/lib/printDocument';
import { useProfileReplacer } from '@/hooks/useProfileReplacer';
import { Link } from 'wouter';

// ─── Training Content ────────────────────────────────────────────────────────

const TRAINING_SECTIONS = [
  {
    id: 'what-is',
    title: 'What Is a Price Reduction Request?',
    icon: Info,
    content: `A Price Reduction Request is a formal, written request submitted to the seller (or their listing agent) after a property inspection reveals repair issues that were not anticipated at the time of the original offer. This is a standard, widely-used practice in real estate transactions — both residential and commercial.

Every purchase contract includes an inspection contingency period (typically 7–14 days) during which the buyer has the right to inspect the property and negotiate based on findings. The Price Reduction Form formalizes this negotiation in a professional, documented manner.

This is NOT a bait-and-switch tactic. This is a legitimate, ethical negotiation tool that protects both the buyer and the seller by ensuring the purchase price accurately reflects the true condition of the property.`,
  },
  {
    id: 'when-to-use',
    title: 'When to Use This Form',
    icon: CheckCircle2,
    content: `Use the Price Reduction Form when ALL of the following conditions are met:

1. You have a signed purchase agreement with an inspection contingency
2. A licensed, professional inspector has completed a thorough inspection
3. The inspection revealed material defects or repair needs that were NOT visible or disclosed before your offer
4. The cost of these newly-discovered repairs significantly impacts the deal economics
5. You are negotiating in good faith — you genuinely want to complete the purchase

Examples of legitimate price reduction triggers:
• Foundation issues discovered during inspection (cracks, settling, water intrusion)
• Roof damage not visible from ground level (detected by drone or attic inspection)
• Outdated or unsafe electrical wiring (knob-and-tube, aluminum wiring, no GFCI)
• Plumbing problems (galvanized pipes, polybutylene, sewer line issues)
• HVAC system at end of life or non-functional
• Mold, asbestos, or lead paint remediation needs
• Structural issues (termite damage, load-bearing wall problems, sagging floors)
• Code violations that must be corrected before sale`,
  },
  {
    id: 'when-not-to-use',
    title: 'When NOT to Use This Form',
    icon: XCircle,
    content: `Do NOT use this form in the following situations:

• To renegotiate a price you already agreed to without legitimate new findings
• For cosmetic issues that were visible during your initial walkthrough (peeling paint, worn carpet, dated fixtures)
• To pressure a seller into accepting a lowball offer after getting them under contract
• When the inspection findings are minor and do not materially affect property value
• When you never intended to pay the original offer price (this is unethical and will damage your reputation)
• For issues that were already disclosed by the seller in the property disclosure statement

Remember: Your reputation is your most valuable asset in real estate investing. Agents, wholesalers, and sellers talk. If you develop a reputation for using inspections as a tool to renegotiate every deal, agents will stop presenting your offers and sellers will refuse to work with you.

The goal is a fair deal for both parties — not to squeeze every last dollar out of the seller.`,
  },
  {
    id: 'how-to-calculate',
    title: 'How to Calculate Your Revised Offer',
    icon: DollarSign,
    content: `Follow these steps to calculate a fair, defensible revised offer:

Step 1: Start with your original MAO (Maximum Allowable Offer)
Your original offer was based on: MAO = (ARV × 70%) − Estimated Repairs

Step 2: Get actual repair estimates
Hire licensed contractors to provide written estimates for each issue found during inspection. Get at least 2 estimates for major items.

Step 3: Calculate the additional repair cost
Additional Repairs = New Total Repair Estimate − Original Repair Estimate

Step 4: Calculate your revised MAO
Revised MAO = (ARV × 70%) − New Total Repair Estimate

Step 5: Determine your revised offer
Your revised offer should be at or below the Revised MAO. You may offer slightly above the Revised MAO if the deal is still profitable and you want to maintain the relationship.

Example:
• ARV: $300,000
• Original repair estimate: $40,000
• Original MAO: ($300,000 × 0.70) − $40,000 = $170,000
• Original offer: $165,000
• Inspection reveals additional $15,000 in repairs (foundation + HVAC)
• New total repairs: $55,000
• Revised MAO: ($300,000 × 0.70) − $55,000 = $155,000
• Revised offer: $150,000 − $155,000 range

Always attach the inspection report and contractor estimates to support your request.`,
  },
  {
    id: 'best-practices',
    title: 'Best Practices for Ethical Negotiation',
    icon: Scale,
    content: `Follow these principles to negotiate effectively while maintaining your integrity:

1. Be Transparent
Share the full inspection report with the seller. Highlight the specific items driving your price reduction request. Don't cherry-pick or exaggerate findings.

2. Use Professional Documentation
Always use written contractor estimates from licensed professionals. Verbal estimates or your own guesses are not credible and will not be taken seriously.

3. Be Reasonable
Don't ask for a dollar-for-dollar reduction for every item. Some items are expected in older homes. Focus on material defects that genuinely change the deal economics.

4. Offer Solutions, Not Just Problems
Instead of just demanding a lower price, offer alternatives:
• Seller credits at closing for specific repairs
• Seller completes repairs before closing (with re-inspection)
• Split the difference on repair costs
• Extend the closing timeline to accommodate repairs

5. Maintain the Relationship
Even if the seller rejects your request, remain professional. You may do business with this agent or seller again. A reputation for fairness is worth more than any single deal.

6. Know Your Walk-Away Number
Before submitting your request, know the maximum price you will pay. If the seller won't negotiate to a price that works, be prepared to exercise your inspection contingency and walk away.

7. Respond Promptly
Submit your price reduction request within the inspection contingency period. Late requests may not be honored and can create legal complications.`,
  },
  {
    id: 'ninja-tips',
    title: 'Ninja Negotiation Tips (Advanced)',
    icon: Zap,
    content: `These advanced tactics are 100% legal and ethical — they simply maximize the impact of your legitimate inspection findings.

Ninja Tip #1: Document Immediately — Before Any Cleanup
When your inspector finds issues, take photos RIGHT THEN — before anything gets cleaned up, dried out, or temporarily patched. A photo of active water intrusion during inspection is far more compelling than a dry stain photographed a week later. This is honest documentation of the property's true condition at the time of inspection. Bring a high-quality camera or smartphone with a good flash.

Ninja Tip #2: Get Multiple Contractor Bids (and Use the Highest)
Always get 2-3 written estimates from licensed, insured contractors for every major repair item. Present ALL of them to the seller. The highest bid is often the most thorough — it accounts for permits, code compliance, and proper materials. Sellers can't argue with documented professional estimates from licensed contractors.

Ninja Tip #3: Itemize Everything Separately
Never lump repairs into one number. Instead of saying "$15,000 in repairs needed," break it into 20-30 individual line items: "Replace 47 linear feet of galvanized pipe — $2,800. Install GFCI outlets in kitchen and bathrooms — $1,200. Remediate mold in crawl space — $3,500..." A detailed list of 25 items creates a much stronger psychological impact than a single number, even if the total is the same.

Ninja Tip #4: Use the Inspector's Language
Quote directly from the professional inspection report. Phrases like "safety hazard," "code violation," "structural concern," "end of useful life," and "recommended immediate repair" carry enormous weight. These are the inspector's professional opinions — not yours — which makes them far more credible.

Ninja Tip #5: Present Repair Costs as a Percentage of the Deal
Frame the additional repairs as a percentage of the purchase price. "The inspection revealed an additional $18,000 in repairs, which represents 10.5% of the purchase price" sounds more significant than just the dollar amount. This helps the seller understand the proportional impact on your investment.

Ninja Tip #6: Offer a Quick Close as Incentive
When requesting a price reduction, sweeten the deal by offering to close faster. "If we can agree on the revised price, we're prepared to close in 14 days instead of 30." Sellers love certainty and speed — it costs you nothing but gives them a reason to accept your terms.

Ninja Tip #7: Time Your Request Strategically
Submit your price reduction request early in the inspection contingency period — not at the last minute. This gives the seller time to consider, get their own estimates if they want, and negotiate. A last-minute request feels like pressure; an early request feels like good faith.`,
  },
  {
    id: 'legal-considerations',
    title: 'Legal & Ethical Considerations',
    icon: Shield,
    content: `Important legal and ethical points to understand:

Inspection Contingency Rights
Most standard purchase agreements include an inspection contingency that gives the buyer the legal right to:
• Inspect the property within a specified timeframe
• Request repairs or a price reduction based on findings
• Cancel the contract if the parties cannot agree on terms

This is a contractual right, not a loophole. Exercise it honestly and in good faith.

State-Specific Rules
Inspection contingency procedures vary by state. Some states have specific forms, timelines, and procedures. Always consult with your real estate attorney or agent about your state's requirements.

Good Faith Requirement
All parties to a real estate transaction have an implied duty of good faith and fair dealing. This means:
• You cannot use the inspection contingency as a pretext to renegotiate for reasons unrelated to inspection findings
• Your price reduction request must be based on actual, documented findings
• You should not intentionally delay or obstruct the transaction

Disclosure Obligations
If you are aware of defects before making your offer, you cannot later claim those defects as grounds for a price reduction. Only newly-discovered issues qualify.

Professional Advice
This form and training are for educational purposes only. Always consult with a licensed real estate attorney in your state before submitting a price reduction request. Laws vary significantly by jurisdiction.`,
  },
];

// ─── Form Fields ─────────────────────────────────────────────────────────────

interface FormFields {
  sellerName: string;
  propertyAddress: string;
  originalOffer: string;
  originalRepairEstimate: string;
  arv: string;
  additionalRepairAmount: string;
  newTotalRepairs: string;
  revisedOffer: string;
  additionalNotes: string;
}

const DEFAULT_FIELDS: FormFields = {
  sellerName: '',
  propertyAddress: '',
  originalOffer: '',
  originalRepairEstimate: '',
  arv: '',
  additionalRepairAmount: '',
  newTotalRepairs: '',
  revisedOffer: '',
  additionalNotes: '',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function PriceReductionForm() {
  const [fields, setFields] = useState<FormFields>(DEFAULT_FIELDS);
  const [expandedTraining, setExpandedTraining] = useState<string | null>('what-is');
  const [copied, setCopied] = useState(false);
  const [showTraining, setShowTraining] = useState(true);
  const { profile, hasProfile, replaceInText } = useProfileReplacer();

  const updateField = useCallback((key: keyof FormFields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  }, []);

  // Auto-calculate revised MAO when inputs change
  const calculatedRevisedMAO = useMemo(() => {
    const arv = parseFloat(fields.arv) || 0;
    const newRepairs = parseFloat(fields.newTotalRepairs) || 0;
    if (arv <= 0) return null;
    return Math.round(arv * 0.70 - newRepairs);
  }, [fields.arv, fields.newTotalRepairs]);

  // Auto-calculate new total repairs
  const calculatedNewTotal = useMemo(() => {
    const original = parseFloat(fields.originalRepairEstimate) || 0;
    const additional = parseFloat(fields.additionalRepairAmount) || 0;
    return original + additional;
  }, [fields.originalRepairEstimate, fields.additionalRepairAmount]);

  // Build the letter text
  const letterText = useMemo(() => {
    const sellerLine = fields.sellerName || '[Seller\'s Name or Listing Agent]';
    const propertyLine = fields.propertyAddress || '[Property Address]';
    const originalOfferLine = fields.originalOffer ? `$${Number(fields.originalOffer).toLocaleString()}` : '[Original Offer Amount]';
    const originalRepairLine = fields.originalRepairEstimate ? `$${Number(fields.originalRepairEstimate).toLocaleString()}` : '[Original Repair Estimate]';
    const arvLine = fields.arv ? `$${Number(fields.arv).toLocaleString()}` : '[ARV]';
    const additionalLine = fields.additionalRepairAmount ? `$${Number(fields.additionalRepairAmount).toLocaleString()}` : '[Additional Repair Amount]';
    const newTotalLine = (calculatedNewTotal > 0) ? `$${calculatedNewTotal.toLocaleString()}` : '[New Total Repairs]';
    const revisedOfferLine = fields.revisedOffer ? `$${Number(fields.revisedOffer).toLocaleString()}` : '[Revised Offer Amount]';
    const revisedMAOLine = calculatedRevisedMAO !== null ? `$${calculatedRevisedMAO.toLocaleString()}` : '[Revised MAO]';

    const yourName = hasProfile && profile?.fullName ? profile.fullName : '[Your Name]';
    const yourCompany = hasProfile && profile?.companyName ? profile.companyName : '[Your Company Name]';
    const yourPhone = hasProfile && profile?.phone ? profile.phone : '[Your Phone Number]';
    const yourEmail = hasProfile && profile?.email ? profile.email : '[Your Email Address]';

    return `Dear ${sellerLine},

Thank you for your cooperation during the inspection process for ${propertyLine}.

After a thorough review of the property by a licensed professional inspector, the inspection uncovered additional repair issues that were not initially anticipated. These findings have resulted in an increased cost for repairs beyond our original estimates.

Based on our updated analysis, we respectfully request a price reduction to help offset the increased repair costs. Our initial offer was based on a Maximum Allowable Offer (MAO) of ${originalOfferLine}, calculated using a 70% ARV framework with an After Repair Value of ${arvLine} and an estimated repair cost of ${originalRepairLine}. With these new findings, our revised numbers indicate a need to adjust our offer accordingly.

Key Points of Our Revised Analysis:

• After Repair Value (ARV): ${arvLine}
• Original Offer: ${originalOfferLine}
• Original Estimated Repair Costs: ${originalRepairLine}
• Additional Repair Costs Identified During Inspection: ${additionalLine}
• New Total Estimated Repair Costs: ${newTotalLine}
• Revised MAO (ARV × 70% − New Repairs): ${revisedMAOLine}

In light of the above, we propose a revised purchase price of ${revisedOfferLine} for the property. We believe this figure more accurately reflects the current condition of the property and the associated costs required to bring it up to market standards.

We have attached the full inspection report and contractor repair estimates for your review. We remain very interested in moving forward with this transaction and are committed to a timely closing. We kindly request your review of our revised offer and look forward to discussing how we might best reach a mutually beneficial agreement.

Thank you for your understanding. Please feel free to contact me directly at ${yourPhone} or ${yourEmail} to discuss this further.

Sincerely,

${yourName}
${yourCompany}${fields.additionalNotes ? `\n\nAdditional Notes:\n${fields.additionalNotes}` : ''}`;
  }, [fields, calculatedNewTotal, calculatedRevisedMAO, profile, hasProfile]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(letterText).then(() => {
      setCopied(true);
      toast.success('Price reduction letter copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  }, [letterText]);

  const handlePrint = useCallback(() => {
    printDocument({
      title: 'Price Reduction Request',
      subtitle: fields.propertyAddress || 'Property Address',
      sections: [
        { heading: '', body: letterText },
      ],
      footer: 'This document was prepared using the Freedom One Real Estate Investment System. For educational purposes only. Consult a licensed real estate attorney before submitting.',
    });
  }, [letterText, fields.propertyAddress]);

  const fmt = (n: string) => {
    const num = parseFloat(n);
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[oklch(0.15_0_0)] border-b border-[oklch(0.3_0_0)]">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)]/15">
              <FileText className="w-6 h-6 text-[oklch(0.65_0.18_18)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Price Reduction Request Form</h1>
              <p className="text-sm text-[oklch(0.55_0_0)]">
                Ethical post-inspection negotiation tool with training
              </p>
            </div>
          </div>
          {!hasProfile && (
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Set up your <Link href="/profile" className="underline font-medium">Business Profile</Link> to auto-fill your name, company, phone, and email in the form.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Training */}
          <div>
            <button
              onClick={() => setShowTraining(!showTraining)}
              className="flex items-center gap-2 text-lg font-bold text-white mb-4"
            >
              <BookOpen className="w-5 h-5 text-[oklch(0.65_0.18_18)]" />
              Training: How to Use This Form Ethically
              {showTraining ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTraining && (
              <div className="space-y-2">
                {TRAINING_SECTIONS.map(section => {
                  const Icon = section.icon;
                  const isExpanded = expandedTraining === section.id;
                  return (
                    <div key={section.id} className="border border-[oklch(0.3_0_0)] rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedTraining(isExpanded ? null : section.id)}
                        className="w-full flex items-center gap-3 p-3 bg-[oklch(0.15_0_0)] hover:bg-[oklch(0.17_0_0)] transition-colors text-left"
                      >
                        <Icon className="w-4 h-4 text-[oklch(0.65_0.18_18)] shrink-0" />
                        <span className="text-sm font-semibold text-white flex-1">{section.title}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[oklch(0.5_0_0)]" /> : <ChevronDown className="w-4 h-4 text-[oklch(0.5_0_0)]" />}
                      </button>
                      {isExpanded && (
                        <div className="p-4 bg-[oklch(0.12_0_0)] text-sm text-[oklch(0.7_0_0)] leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Quick Reference Card */}
                <div className="mt-4 border border-[oklch(0.48_0.20_18)]/30 rounded-lg p-4 bg-[oklch(0.48_0.20_18)]/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-[oklch(0.65_0.18_18)]" />
                    <span className="text-sm font-bold text-white">Quick Reference: The 70% Rule</span>
                  </div>
                  <div className="text-xs text-[oklch(0.65_0_0)] space-y-2">
                    <p><strong className="text-white">MAO = (ARV × 70%) − Total Repair Costs</strong></p>
                    <p>When inspection reveals additional repairs, recalculate your MAO with the new total repair estimate. Your revised offer should be at or below the revised MAO.</p>
                    <p className="text-amber-400">Always attach the inspection report and contractor estimates to your request.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Form */}
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
              <ClipboardList className="w-5 h-5 text-[oklch(0.65_0.18_18)]" />
              Fill Out Your Price Reduction Request
            </h2>

            <div className="space-y-4">
              {/* Property & Seller Info */}
              <div className="border border-[oklch(0.3_0_0)] rounded-lg p-4 bg-[oklch(0.15_0_0)]">
                <h3 className="text-sm font-semibold text-white mb-3">Property & Seller Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Seller / Listing Agent Name</Label>
                    <Input
                      value={fields.sellerName}
                      onChange={e => updateField('sellerName', e.target.value)}
                      placeholder="John Smith or ABC Realty"
                      className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Property Address</Label>
                    <Input
                      value={fields.propertyAddress}
                      onChange={e => updateField('propertyAddress', e.target.value)}
                      placeholder="123 Main St, City, State 12345"
                      className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="border border-[oklch(0.3_0_0)] rounded-lg p-4 bg-[oklch(0.15_0_0)]">
                <h3 className="text-sm font-semibold text-white mb-3">Deal Numbers</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">After Repair Value (ARV)</Label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[oklch(0.5_0_0)]">$</span>
                      <Input
                        type="number"
                        value={fields.arv}
                        onChange={e => updateField('arv', e.target.value)}
                        placeholder="300,000"
                        className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white pl-5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Original Offer</Label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[oklch(0.5_0_0)]">$</span>
                      <Input
                        type="number"
                        value={fields.originalOffer}
                        onChange={e => updateField('originalOffer', e.target.value)}
                        placeholder="165,000"
                        className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white pl-5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Original Repair Estimate</Label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[oklch(0.5_0_0)]">$</span>
                      <Input
                        type="number"
                        value={fields.originalRepairEstimate}
                        onChange={e => updateField('originalRepairEstimate', e.target.value)}
                        placeholder="40,000"
                        className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white pl-5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Additional Repairs (from inspection)</Label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[oklch(0.5_0_0)]">$</span>
                      <Input
                        type="number"
                        value={fields.additionalRepairAmount}
                        onChange={e => updateField('additionalRepairAmount', e.target.value)}
                        placeholder="15,000"
                        className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white pl-5"
                      />
                    </div>
                  </div>
                </div>

                {/* Auto-calculated fields */}
                <div className="mt-3 pt-3 border-t border-[oklch(0.25_0_0)] grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">New Total Repairs (auto-calculated)</Label>
                    <div className="h-8 flex items-center px-3 rounded-md bg-[oklch(0.12_0_0)] border border-[oklch(0.25_0_0)] text-xs text-emerald-400 font-mono">
                      {calculatedNewTotal > 0 ? `$${calculatedNewTotal.toLocaleString()}` : '—'}
                    </div>

                  </div>
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Revised MAO (auto-calculated)</Label>
                    <div className={`h-8 flex items-center px-3 rounded-md bg-[oklch(0.12_0_0)] border border-[oklch(0.25_0_0)] text-xs font-mono ${
                      calculatedRevisedMAO !== null && calculatedRevisedMAO > 0 ? 'text-emerald-400' : 'text-[oklch(0.5_0_0)]'
                    }`}>
                      {calculatedRevisedMAO !== null ? `$${calculatedRevisedMAO.toLocaleString()}` : '—'}
                    </div>
                  </div>
                </div>


              </div>

              {/* Revised Offer */}
              <div className="border border-[oklch(0.3_0_0)] rounded-lg p-4 bg-[oklch(0.15_0_0)]">
                <h3 className="text-sm font-semibold text-white mb-3">Your Revised Offer</h3>
                <div>
                  <Label className="text-xs text-[oklch(0.6_0_0)]">Revised Purchase Price</Label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[oklch(0.5_0_0)]">$</span>
                    <Input
                      type="number"
                      value={fields.revisedOffer}
                      onChange={e => updateField('revisedOffer', e.target.value)}
                      placeholder="150,000"
                      className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white pl-5"
                    />
                  </div>
                  {calculatedRevisedMAO !== null && fields.revisedOffer && (
                    <p className={`text-xs mt-1 ${
                      Number(fields.revisedOffer) <= calculatedRevisedMAO
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}>
                      {Number(fields.revisedOffer) <= calculatedRevisedMAO
                        ? '✓ Offer is at or below revised MAO — good position'
                        : '⚠ Offer is above revised MAO — reduced profit margin'}
                    </p>
                  )}
                </div>
                <div className="mt-3">
                  <Label className="text-xs text-[oklch(0.6_0_0)]">Additional Notes (optional)</Label>
                  <Textarea
                    value={fields.additionalNotes}
                    onChange={e => updateField('additionalNotes', e.target.value)}
                    placeholder="Any additional context, specific inspection findings, or terms you'd like to include..."
                    className="text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white min-h-[60px]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleCopy}
                  className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Letter'}
                </Button>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="gap-2 border-[oklch(0.3_0_0)] text-white hover:bg-white/5"
                >
                  <Printer className="w-4 h-4" /> Print / PDF
                </Button>
              </div>

              {/* Letter Preview */}
              <div className="border border-[oklch(0.3_0_0)] rounded-lg overflow-hidden">
                <div className="p-3 bg-[oklch(0.15_0_0)] border-b border-[oklch(0.25_0_0)]">
                  <h3 className="text-sm font-semibold text-white">Letter Preview</h3>
                </div>
                <div className="p-4 bg-[oklch(0.12_0_0)] text-xs text-[oklch(0.7_0_0)] leading-relaxed whitespace-pre-line font-mono">
                  {letterText}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 text-xs text-[oklch(0.5_0_0)] bg-[oklch(0.15_0_0)] border border-[oklch(0.25_0_0)] rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <p>
                  This form is for educational purposes only and does not constitute legal advice.
                  Always consult with a licensed real estate attorney in your state before submitting
                  a price reduction request. Laws and procedures vary by jurisdiction. Use this tool
                  ethically and in good faith.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
