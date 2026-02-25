import { ClipboardList, Download, CheckSquare, Home, Wrench, Building2, DollarSign, Search, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type ChecklistCategory = 'acquisition' | 'rehab' | 'rental' | 'sale' | 'wholesale' | 'due-diligence';

interface ChecklistItem {
  text: string;
  detail?: string;
}

interface Checklist {
  id: ChecklistCategory;
  title: string;
  icon: typeof ClipboardList;
  color: string;
  description: string;
  items: ChecklistItem[];
}

const CHECKLISTS: Checklist[] = [
  {
    id: 'acquisition',
    title: 'Property Acquisition',
    icon: Home,
    color: 'oklch(0.48 0.20 18)',
    description: 'Everything you need to evaluate and acquire an investment property.',
    items: [
      { text: 'Identify target market and neighborhoods', detail: 'Research median home values, days on market, and investor activity' },
      { text: 'Set acquisition criteria (price range, property type, condition)', detail: 'Define your buy box before searching' },
      { text: 'Run comparable sales analysis (3-6 comps within 0.5 miles)', detail: 'Use sold comps from last 90 days, same bed/bath count' },
      { text: 'Calculate After Repair Value (ARV)', detail: 'Average of top 3 comparable sales adjusted for differences' },
      { text: 'Estimate rehab costs using room-by-room assessment', detail: 'Walk every room, check roof, HVAC, plumbing, electrical, foundation' },
      { text: 'Apply the 70% Rule: MAO = ARV × 0.70 − Repairs', detail: 'This is your Maximum Allowable Offer' },
      { text: 'Verify property title is clear (no liens, judgments)', detail: 'Order a preliminary title report' },
      { text: 'Check for code violations or open permits', detail: 'Contact local building department' },
      { text: 'Confirm zoning and permitted use', detail: 'Verify the property can be used as intended' },
      { text: 'Review property tax history and current assessment', detail: 'Check county assessor records' },
      { text: 'Inspect for environmental issues (lead paint, asbestos, mold)', detail: 'Required for pre-1978 homes (lead paint disclosure)' },
      { text: 'Verify insurance availability and estimated premiums', detail: 'Get quotes from at least 2 carriers' },
      { text: 'Submit offer with appropriate contingencies', detail: 'Include inspection, financing, and title contingencies' },
      { text: 'Negotiate terms and execute purchase agreement', detail: 'Use assignable contract if wholesaling' },
      { text: 'Open escrow and deposit earnest money', detail: 'Typical EMD is 1-3% of purchase price' },
    ],
  },
  {
    id: 'due-diligence',
    title: 'Due Diligence',
    icon: Search,
    color: 'oklch(0.45 0.15 250)',
    description: 'Thorough investigation steps before closing on any property.',
    items: [
      { text: 'Order professional home inspection', detail: 'Use a licensed inspector; attend the inspection in person' },
      { text: 'Review inspection report and identify major issues', detail: 'Focus on structural, roof, HVAC, plumbing, electrical' },
      { text: 'Get contractor bids for identified repairs', detail: 'Get at least 2-3 bids for major items' },
      { text: 'Order termite/pest inspection', detail: 'Required in many states; check for active infestations and damage' },
      { text: 'Verify property boundaries with survey (if needed)', detail: 'Especially important for land or properties with additions' },
      { text: 'Check flood zone status (FEMA maps)', detail: 'Flood insurance can significantly impact holding costs' },
      { text: 'Research neighborhood crime statistics', detail: 'Check local police department records and online tools' },
      { text: 'Verify school district ratings', detail: 'Impacts resale value and rental demand' },
      { text: 'Check for HOA restrictions and fees', detail: 'Review CC&Rs for renovation restrictions' },
      { text: 'Confirm utility availability and costs', detail: 'Water, sewer, electric, gas, internet' },
      { text: 'Review seller disclosures thoroughly', detail: 'Note any known defects or past repairs' },
      { text: 'Verify rental income potential (if applicable)', detail: 'Check comparable rents in the area' },
    ],
  },
  {
    id: 'rehab',
    title: 'Rehab Management',
    icon: Wrench,
    color: 'oklch(0.50 0.15 145)',
    description: 'Step-by-step checklist for managing a successful renovation project.',
    items: [
      { text: 'Create detailed Scope of Work (SOW) for each room', detail: 'Use our SOW Templates for consistency' },
      { text: 'Get 3+ contractor bids for each major trade', detail: 'Compare pricing, timeline, and references' },
      { text: 'Verify contractor licenses, insurance, and references', detail: 'Check state licensing board and call past clients' },
      { text: 'Execute contractor agreement with payment schedule', detail: 'Never pay more than 10% upfront; tie payments to milestones' },
      { text: 'Pull all required permits before work begins', detail: 'Building, electrical, plumbing, HVAC permits as needed' },
      { text: 'Order materials and confirm delivery dates', detail: 'Long-lead items (cabinets, windows) should be ordered first' },
      { text: 'Demolition and debris removal', detail: 'Rent a dumpster; check local disposal regulations' },
      { text: 'Rough-in work: framing, plumbing, electrical, HVAC', detail: 'Must be inspected before closing walls' },
      { text: 'Schedule and pass rough-in inspections', detail: 'Do not proceed to drywall until inspections pass' },
      { text: 'Insulation and drywall installation', detail: 'Check for proper R-value per local code' },
      { text: 'Interior finishes: paint, flooring, trim, fixtures', detail: 'Choose finishes appropriate to your material tier' },
      { text: 'Kitchen and bathroom installation', detail: 'Cabinets, countertops, tile, fixtures, appliances' },
      { text: 'Exterior work: siding, roof, landscaping, driveway', detail: 'Curb appeal is critical for resale value' },
      { text: 'Final cleaning and staging', detail: 'Professional cleaning and staging increases sale price 5-10%' },
      { text: 'Schedule and pass final inspections', detail: 'Get Certificate of Occupancy if required' },
      { text: 'Document all work with before/after photos', detail: 'Useful for portfolio, marketing, and insurance' },
    ],
  },
  {
    id: 'sale',
    title: 'Property Sale (Flip)',
    icon: DollarSign,
    color: 'oklch(0.55 0.18 80)',
    description: 'Checklist for listing and selling your renovated property.',
    items: [
      { text: 'Complete final walkthrough and punch list', detail: 'Fix any remaining cosmetic issues' },
      { text: 'Professional photography and virtual tour', detail: 'High-quality photos are the #1 factor in online listings' },
      { text: 'Write compelling property description', detail: 'Highlight renovations, features, and neighborhood amenities' },
      { text: 'Set listing price based on updated comps', detail: 'Re-run comps; market may have shifted during rehab' },
      { text: 'List on MLS and major real estate portals', detail: 'Zillow, Realtor.com, Redfin, etc.' },
      { text: 'Install professional yard sign and lockbox', detail: 'Make it easy for agents to show the property' },
      { text: 'Schedule open houses (first 2 weekends)', detail: 'Create urgency with a well-attended open house' },
      { text: 'Review and respond to offers within 24 hours', detail: 'Quick response shows serious seller intent' },
      { text: 'Negotiate terms: price, closing date, contingencies', detail: 'Consider net proceeds, not just sale price' },
      { text: 'Execute purchase agreement and open escrow', detail: 'Ensure all terms are clearly documented' },
      { text: 'Cooperate with buyer inspections and appraisal', detail: 'Be prepared to negotiate repair credits' },
      { text: 'Complete seller disclosures and required paperwork', detail: 'Disclose all known material defects' },
      { text: 'Coordinate with title company for closing', detail: 'Review settlement statement (HUD-1/CD) carefully' },
      { text: 'Close and collect proceeds', detail: 'Wire transfer is standard; verify wiring instructions by phone' },
      { text: 'Calculate actual ROI and document lessons learned', detail: 'Compare projected vs actual for future deal analysis' },
    ],
  },
  {
    id: 'rental',
    title: 'Rental Property',
    icon: Building2,
    color: 'oklch(0.50 0.18 280)',
    description: 'Checklist for acquiring and managing rental investment properties.',
    items: [
      { text: 'Analyze rental market: vacancy rates, median rents, demand', detail: 'Research on Zillow, Rentometer, local MLS' },
      { text: 'Calculate cash-on-cash return and cap rate', detail: 'Target minimum 8% cash-on-cash for single family' },
      { text: 'Estimate operating expenses (50% rule as starting point)', detail: 'Taxes, insurance, maintenance, vacancy, management, CapEx' },
      { text: 'Verify property meets local rental code requirements', detail: 'Some cities require rental licenses or inspections' },
      { text: 'Set up LLC or appropriate entity for asset protection', detail: 'Consult with attorney and CPA' },
      { text: 'Open separate bank account for rental income/expenses', detail: 'Never commingle personal and rental funds' },
      { text: 'Create or update lease agreement (state-specific)', detail: 'Include all required disclosures for your state' },
      { text: 'Set competitive rental price based on comps', detail: 'Price within 5% of comparable rentals in the area' },
      { text: 'Market the property: photos, listing, signage', detail: 'List on Zillow, Apartments.com, Facebook Marketplace' },
      { text: 'Screen tenants: credit, background, income, references', detail: 'Require income of 3x monthly rent minimum' },
      { text: 'Execute lease and collect security deposit + first month', detail: 'Document property condition with move-in checklist and photos' },
      { text: 'Set up rent collection system (online preferred)', detail: 'Use Zelle, Venmo, or property management software' },
      { text: 'Create maintenance request process', detail: 'Provide tenants a clear way to report issues' },
      { text: 'Schedule regular property inspections (quarterly)', detail: 'Document condition and address issues early' },
      { text: 'Track all income and expenses for tax purposes', detail: 'Keep receipts; consult CPA for depreciation strategy' },
    ],
  },
  {
    id: 'wholesale',
    title: 'Wholesale Deal',
    icon: FileText,
    color: 'oklch(0.55 0.12 30)',
    description: 'Step-by-step checklist for wholesaling real estate contracts.',
    items: [
      { text: 'Build buyer list of active cash investors', detail: 'Network at REI meetings, Facebook groups, and auctions' },
      { text: 'Identify motivated seller leads', detail: 'Direct mail, driving for dollars, online marketing, bandit signs' },
      { text: 'Contact seller and determine motivation level', detail: 'Ask about timeline, reason for selling, desired price' },
      { text: 'Inspect property and estimate ARV and repairs', detail: 'Use our Deal Analyzer for quick evaluation' },
      { text: 'Calculate Maximum Allowable Offer minus your fee', detail: 'Typical wholesale fee is $5,000-$15,000' },
      { text: 'Present offer using assignable purchase agreement', detail: 'Include "and/or assigns" language in buyer name' },
      { text: 'Execute contract with seller', detail: 'Include inspection contingency for exit strategy' },
      { text: 'Market deal to buyer list immediately', detail: 'Send property details, photos, ARV, repair estimate, and your price' },
      { text: 'Show property to interested buyers', detail: 'Schedule group showings to create competition' },
      { text: 'Negotiate assignment fee with end buyer', detail: 'Get assignment agreement signed and deposit collected' },
      { text: 'Submit assignment to title company', detail: 'Provide original contract and assignment agreement' },
      { text: 'Coordinate closing between all parties', detail: 'Double close if you prefer to keep your fee private' },
      { text: 'Collect assignment fee at closing', detail: 'Fee is paid through escrow at closing' },
    ],
  },
];

function ChecklistCard({ checklist, onSelect }: { checklist: Checklist; onSelect: () => void }) {
  const Icon = checklist.icon;
  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={onSelect}>
      <CardContent className="p-5">
        <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: `${checklist.color}15` }}>
          <Icon className="w-5 h-5" style={{ color: checklist.color }} />
        </div>
        <h3 className="font-bold text-base mb-1.5 group-hover:text-[oklch(0.48_0.20_18)] transition-colors">
          {checklist.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{checklist.description}</p>
        <p className="text-xs text-muted-foreground">{checklist.items.length} items</p>
      </CardContent>
    </Card>
  );
}

function ChecklistDetail({ checklist, onBack }: { checklist: Checklist; onBack: () => void }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const Icon = checklist.icon;

  const toggleItem = (index: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1">
        ← Back to all checklists
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${checklist.color}15` }}>
            <Icon className="w-6 h-6" style={{ color: checklist.color }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{checklist.title}</h2>
            <p className="text-sm text-muted-foreground">{checklist.description}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handlePrint} className="shrink-0 gap-1.5">
          <Download className="w-3.5 h-3.5" /> Print / Save PDF
        </Button>
      </div>

      <div className="text-xs text-muted-foreground mb-4">
        {checked.size} of {checklist.items.length} completed
      </div>
      <div className="w-full bg-muted rounded-full h-1.5 mb-6">
        <div
          className="h-1.5 rounded-full transition-all"
          style={{
            width: `${(checked.size / checklist.items.length) * 100}%`,
            backgroundColor: checklist.color,
          }}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {checklist.items.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 px-5 py-3.5 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                checked.has(i) ? 'bg-muted/30' : ''
              }`}
              onClick={() => toggleItem(i)}
            >
              <div className="pt-0.5">
                <CheckSquare
                  className={`w-4.5 h-4.5 transition-colors ${
                    checked.has(i) ? 'text-[oklch(0.50_0.15_145)]' : 'text-muted-foreground/40'
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${checked.has(i) ? 'line-through text-muted-foreground' : ''}`}>
                  {item.text}
                </p>
                {item.detail && (
                  <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Checklists() {
  const [selected, setSelected] = useState<ChecklistCategory | null>(null);
  const selectedChecklist = CHECKLISTS.find(c => c.id === selected);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-14 text-center">
          <ClipboardList className="w-10 h-10 mx-auto mb-4 text-[oklch(0.65_0.18_18)]" />
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">Investor Checklists</h1>
          <p className="text-[oklch(0.6_0_0)] max-w-lg mx-auto">
            Comprehensive, printable checklists for every phase of real estate investing —
            from acquisition and due diligence to rehab, sale, rental, and wholesale deals.
          </p>
        </div>
      </section>

      <section className="container py-12">
        {selectedChecklist ? (
          <ChecklistDetail checklist={selectedChecklist} onBack={() => setSelected(null)} />
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Choose a Checklist</h2>
              <p className="text-muted-foreground text-sm">Click any checklist to view, use interactively, or print for offline use.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CHECKLISTS.map(cl => (
                <ChecklistCard key={cl.id} checklist={cl} onSelect={() => setSelected(cl.id)} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
