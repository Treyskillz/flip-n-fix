import {
  Wrench, Search, Star, Phone, Mail, MapPin, Shield, AlertTriangle,
  CheckCircle2, FileText, Users, ClipboardList, DollarSign, Clock,
  ChevronDown, ChevronUp, Plus, Trash2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

/* ─── Types ─── */
interface Contractor {
  id: string;
  name: string;
  company: string;
  trade: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  rating: number;
  notes: string;
}

type TradeCategory = typeof TRADE_CATEGORIES[number];

/* ─── Static Data ─── */
const TRADE_CATEGORIES = [
  'General Contractor',
  'Plumber',
  'Electrician',
  'HVAC',
  'Roofer',
  'Painter',
  'Flooring',
  'Drywall',
  'Framing / Carpentry',
  'Landscaping',
  'Concrete / Masonry',
  'Windows / Doors',
  'Kitchen / Bath',
  'Demolition',
  'Pest Control',
  'Foundation',
  'Handyman',
  'Other',
] as const;

const VETTING_CHECKLIST = [
  { text: 'Verify state contractor license (check licensing board website)', icon: Shield },
  { text: 'Confirm General Liability insurance ($1M+ recommended)', icon: Shield },
  { text: 'Confirm Workers\' Compensation insurance', icon: Shield },
  { text: 'Request 3+ references from recent projects', icon: Users },
  { text: 'Check Better Business Bureau (BBB) rating', icon: Star },
  { text: 'Search for complaints on state AG consumer protection site', icon: AlertTriangle },
  { text: 'Verify business registration with Secretary of State', icon: FileText },
  { text: 'Review online reviews (Google, Yelp, Angi, HomeAdvisor)', icon: Star },
  { text: 'Request detailed written bid (not just verbal estimate)', icon: ClipboardList },
  { text: 'Confirm they pull permits for required work', icon: CheckCircle2 },
  { text: 'Ask about warranty on workmanship (1 year minimum)', icon: Shield },
  { text: 'Discuss payment terms (never more than 10% upfront)', icon: DollarSign },
  { text: 'Confirm timeline and availability for your project', icon: Clock },
  { text: 'Visit a current or recent job site to assess quality', icon: Wrench },
];

const FINDING_TIPS = [
  {
    title: 'Supply Houses',
    desc: 'Visit Home Depot Pro Desk, Lowe\'s Pro, and local lumber yards. Contractors shop there daily. Ask the staff who their best customers are.',
  },
  {
    title: 'REI Meetups & Networking',
    desc: 'Attend local Real Estate Investor Association (REIA) meetings. Other investors are your best source for contractor referrals.',
  },
  {
    title: 'Drive Job Sites',
    desc: 'When you see active renovation projects in your target neighborhoods, stop and introduce yourself. Exchange cards with the crew lead.',
  },
  {
    title: 'Facebook Groups',
    desc: 'Join local contractor and real estate investor Facebook groups. Post that you\'re looking for specific trades. Referrals come fast.',
  },
  {
    title: 'Subcontractor Referrals',
    desc: 'Once you find one good contractor, ask them who they recommend for other trades. Good contractors know other good contractors.',
  },
  {
    title: 'Online Platforms',
    desc: 'Use Angi (formerly Angie\'s List), HomeAdvisor, Thumbtack, and BuildZoom to find licensed contractors with reviews.',
  },
];

const PAYMENT_SCHEDULE = [
  { milestone: 'Contract Signing', percent: '10%', note: 'Maximum upfront deposit. Never pay more.' },
  { milestone: 'Demolition Complete', percent: '15%', note: 'After demo and debris removal verified.' },
  { milestone: 'Rough-In Complete', percent: '25%', note: 'After framing, plumbing, electrical rough-in and inspections pass.' },
  { milestone: 'Drywall & Paint', percent: '20%', note: 'After drywall hung, mudded, sanded, and painted.' },
  { milestone: 'Finishes Installed', percent: '20%', note: 'After flooring, cabinets, fixtures, trim installed.' },
  { milestone: 'Final Walkthrough', percent: '10%', note: 'After punch list complete and final inspection passed.' },
];

/* ─── Components ─── */
function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          onClick={() => onChange?.(i)}
          className={`${onChange ? 'cursor-pointer' : 'cursor-default'}`}
          type="button"
        >
          <Star
            className={`w-4 h-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
          />
        </button>
      ))}
    </div>
  );
}

function VettingSection() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-bold text-base mb-1">Contractor Vetting Checklist</h3>
        <p className="text-xs text-muted-foreground mb-4">Complete this checklist before hiring any contractor. Click items to mark as verified.</p>
        <div className="text-xs text-muted-foreground mb-3">{checked.size} of {VETTING_CHECKLIST.length} verified</div>
        <div className="w-full bg-muted rounded-full h-1.5 mb-4">
          <div className="h-1.5 rounded-full bg-[oklch(0.50_0.15_145)] transition-all" style={{ width: `${(checked.size / VETTING_CHECKLIST.length) * 100}%` }} />
        </div>
        <div className="space-y-1">
          {VETTING_CHECKLIST.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                onClick={() => toggle(i)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${checked.has(i) ? 'bg-[oklch(0.50_0.15_145)]/10' : 'hover:bg-muted/50'}`}
              >
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${checked.has(i) ? 'text-[oklch(0.50_0.15_145)]' : 'text-muted-foreground/30'}`} />
                <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className={`text-sm ${checked.has(i) ? 'line-through text-muted-foreground' : ''}`}>{item.text}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ContractorRolodex() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterTrade, setFilterTrade] = useState('');
  const [form, setForm] = useState({ name: '', company: '', trade: 'General Contractor', phone: '', email: '', city: '', state: '', rating: 3, notes: '' });

  const filtered = useMemo(() => {
    if (!filterTrade) return contractors;
    return contractors.filter(c => c.trade === filterTrade);
  }, [contractors, filterTrade]);

  const addContractor = () => {
    if (!form.name || !form.phone) {
      toast.error('Name and phone are required');
      return;
    }
    setContractors(prev => [...prev, { ...form, id: Date.now().toString() }]);
    setForm({ name: '', company: '', trade: 'General Contractor', phone: '', email: '', city: '', state: '', rating: 3, notes: '' });
    setShowForm(false);
    toast.success('Contractor added to your rolodex');
  };

  const removeContractor = (id: string) => {
    setContractors(prev => prev.filter(c => c.id !== id));
    toast.success('Contractor removed');
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base">Contractor Rolodex</h3>
            <p className="text-xs text-muted-foreground">Track and organize your contractor contacts</p>
          </div>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>

        {showForm && (
          <div className="border border-border rounded-lg p-4 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Contact Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
              <input placeholder="Company Name" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
              <select value={form.trade} onChange={e => setForm(f => ({ ...f, trade: e.target.value }))} className="px-3 py-2 rounded-md border border-border bg-background text-sm">
                {TRADE_CATEGORIES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input placeholder="Phone *" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
              <input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="px-3 py-2 rounded-md border border-border bg-background text-sm" />
              <div className="flex gap-2">
                <input placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                <input placeholder="ST" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className="w-16 px-3 py-2 rounded-md border border-border bg-background text-sm" maxLength={2} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Rating:</span>
              <StarRating rating={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
            </div>
            <textarea placeholder="Notes (specialties, pricing, reliability...)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm" rows={2} />
            <div className="flex gap-2">
              <Button size="sm" onClick={addContractor} className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">Save Contractor</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {contractors.length > 0 && (
          <div className="mb-3">
            <select value={filterTrade} onChange={e => setFilterTrade(e.target.value)} className="px-3 py-1.5 rounded-md border border-border bg-background text-xs">
              <option value="">All Trades ({contractors.length})</option>
              {TRADE_CATEGORIES.map(t => {
                const count = contractors.filter(c => c.trade === t).length;
                return count > 0 ? <option key={t} value={t}>{t} ({count})</option> : null;
              })}
            </select>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No contractors yet. Click "Add" to start building your rolodex.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(c => (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                <div className="w-9 h-9 rounded-full bg-[oklch(0.48_0.20_18)]/10 flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{c.name}</span>
                    {c.company && <span className="text-xs text-muted-foreground">— {c.company}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="px-1.5 py-0.5 rounded bg-muted">{c.trade}</span>
                    {c.city && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{c.city}{c.state ? `, ${c.state}` : ''}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {c.phone && <a href={`tel:${c.phone}`} className="text-xs text-[oklch(0.48_0.20_18)] flex items-center gap-0.5"><Phone className="w-3 h-3" />{c.phone}</a>}
                    {c.email && <a href={`mailto:${c.email}`} className="text-xs text-[oklch(0.48_0.20_18)] flex items-center gap-0.5"><Mail className="w-3 h-3" />{c.email}</a>}
                  </div>
                  <StarRating rating={c.rating} />
                  {c.notes && <p className="text-xs text-muted-foreground mt-1">{c.notes}</p>}
                </div>
                <button onClick={() => removeContractor(c.id)} className="text-muted-foreground/40 hover:text-destructive transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          Note: Contractor data is stored locally in your browser. For persistent storage, upgrade to a paid plan.
        </p>
      </CardContent>
    </Card>
  );
}

/* ─── Main Page ─── */
export default function Contractors() {
  const [activeTab, setActiveTab] = useState<'rolodex' | 'vetting' | 'finding' | 'payment'>('rolodex');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-14 text-center">
          <Wrench className="w-10 h-10 mx-auto mb-4 text-[oklch(0.65_0.18_18)]" />
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">Contractor Lead System</h1>
          <p className="text-[oklch(0.6_0_0)] max-w-lg mx-auto">
            Find, vet, and manage contractors for your renovation projects.
            Build your trusted contractor rolodex and never scramble for help again.
          </p>
        </div>
      </section>

      <section className="container py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {[
            { id: 'rolodex' as const, label: 'Contractor Rolodex', icon: Users },
            { id: 'vetting' as const, label: 'Vetting Checklist', icon: Shield },
            { id: 'finding' as const, label: 'Finding Contractors', icon: Search },
            { id: 'payment' as const, label: 'Payment Schedule', icon: DollarSign },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[oklch(0.48_0.20_18)] text-white font-medium'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'rolodex' && <ContractorRolodex />}

        {activeTab === 'vetting' && <VettingSection />}

        {activeTab === 'finding' && (
          <div>
            <h2 className="text-xl font-bold tracking-tight mb-4">How to Find Quality Contractors</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FINDING_TIPS.map((tip, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardContent className="p-5">
                <h3 className="font-bold text-base mb-3">Online Resources for Finding Contractors</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Angi (Angie\'s List)', url: 'https://www.angi.com', desc: 'Verified reviews and background checks' },
                    { name: 'HomeAdvisor', url: 'https://www.homeadvisor.com', desc: 'Pre-screened contractors with cost guides' },
                    { name: 'Thumbtack', url: 'https://www.thumbtack.com', desc: 'Get quotes from local professionals' },
                    { name: 'BuildZoom', url: 'https://www.buildzoom.com', desc: 'License verification and permit history' },
                    { name: 'Houzz', url: 'https://www.houzz.com', desc: 'Portfolio-based contractor search' },
                    { name: 'Nextdoor', url: 'https://www.nextdoor.com', desc: 'Neighborhood recommendations' },
                  ].map(resource => (
                    <a key={resource.name} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 p-3 rounded-lg border border-border hover:border-[oklch(0.48_0.20_18)]/30 transition-colors">
                      <Search className="w-4 h-4 text-[oklch(0.48_0.20_18)] mt-0.5 shrink-0" />
                      <div>
                        <span className="text-sm font-medium">{resource.name}</span>
                        <p className="text-xs text-muted-foreground">{resource.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'payment' && (
          <Card>
            <CardContent className="p-5">
              <h3 className="font-bold text-base mb-1">Recommended Payment Schedule</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Never pay contractors 100% upfront. Tie payments to completed milestones to protect your investment.
              </p>
              <div className="space-y-0">
                {PAYMENT_SCHEDULE.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 py-3 border-b border-border last:border-0">
                    <div className="w-16 text-center shrink-0">
                      <span className="text-lg font-bold text-[oklch(0.48_0.20_18)]">{item.percent}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.milestone}</p>
                      <p className="text-xs text-muted-foreground">{item.note}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-[oklch(0.48_0.20_18)]/5 border border-[oklch(0.48_0.20_18)]/10">
                <p className="text-xs font-medium text-[oklch(0.48_0.20_18)] mb-1">Important Tips:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Always get a signed contract before any work begins</li>
                  <li>• Document each milestone with photos before releasing payment</li>
                  <li>• Hold 10% retainage until final walkthrough and punch list completion</li>
                  <li>• Pay with check or bank transfer for a paper trail — never cash</li>
                  <li>• Get lien waivers with each progress payment</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
