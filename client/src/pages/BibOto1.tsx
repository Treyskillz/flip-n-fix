import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import {
  Calculator, Wrench, MapPin, BarChart3, TrendingUp, ArrowRight, Check, Zap,
  Layers, Building2, PieChart, Clock, Shield, Infinity, ChevronDown, Megaphone
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { trackFunnelEvent } from '@/components/TrackingPixels';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/MgvhsGurcOgbPgCR.png";

const APP_FEATURES = [
  { icon: Calculator, title: 'Deal Analyzer', desc: 'Real-time profitability calculations with deal scoring, 70% rule, and adjustable ROI targets' },
  { icon: Wrench, title: 'Rehab Estimator', desc: 'Room-by-room condition assessment with 3 material tiers (Rental, Standard, Luxury) and Home Depot pricing' },
  { icon: MapPin, title: '50+ Metro Markets', desc: 'Regional labor and material pricing auto-adjusts based on your market location' },
  { icon: BarChart3, title: 'Pipeline CRM', desc: 'Track every deal from lead to close with contacts, activities, and status management' },
  { icon: Building2, title: 'Renovation Designer', desc: 'AI-powered before/after renovation visualizations for your properties' },
  { icon: PieChart, title: 'Portfolio Dashboard', desc: 'Track all your investments, returns, and portfolio performance in one view' },
  { icon: Layers, title: 'SOW Generator', desc: 'Generate professional scope of work documents with contractor assignments and bid tracking' },
  { icon: TrendingUp, title: 'Profit Calculator', desc: 'Six investment scenarios — flip, wholesale, BRRRR, subject-to, rental, and STR — all in one tool' },
];

export default function BibOto1() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const createCheckout = trpc.bib.createCheckout.useMutation();

  useEffect(() => {
    trackFunnelEvent('ViewContent', { value: 2997, content_name: 'OTO1 Lifetime App Access', content_category: 'BIB' });
  }, []);

  const handleAccept = async () => {
    setIsLoading(true);
    trackFunnelEvent('InitiateCheckout', { value: 2997, content_name: 'OTO1 Lifetime App Access', content_category: 'BIB' });
    try {
      const result = await createCheckout.mutateAsync({
        productKey: 'oto1',
        origin: window.location.origin,
        email: user?.email || undefined,
        name: user?.name || undefined,
      });
      if (result.url) {
        toast.info('Redirecting to secure checkout...');
        window.open(result.url, '_blank');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create checkout session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = () => {
    navigate('/bib/oto1-down?declined=oto1');
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[oklch(0.06_0_0)]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={LOGO_URL} alt="Freedom One" className="h-10 object-contain" />
          <span className="text-sm text-green-400 font-medium">Order Confirmed — Special Offer Below</span>
        </div>
      </header>

      {/* Confirmation Banner */}
      <section className="bg-green-900/20 border-b border-green-500/20">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center">
          <p className="text-green-400 font-semibold flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            Your Business-in-a-Box order is confirmed! Before you go, check out this exclusive upgrade...
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 py-12 lg:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.48_0.20_18)]/15 border border-[oklch(0.48_0.20_18)]/30 text-[oklch(0.70_0.18_18)] text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>One-Time Exclusive Upgrade</span>
          </div>
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
            Get the Freedom One App —<br />
            <span className="text-[oklch(0.70_0.18_18)]">Lifetime Access, One Payment</span>
          </h1>
          <p className="text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
            Your Business-in-a-Box gives you the knowledge and templates. The Freedom One app gives you the 
            <strong className="text-white"> digital tools</strong> to execute faster — Deal Analyzer, Rehab Estimator, 
            Pipeline CRM, and more. Lock in lifetime access today with no monthly fees.
          </p>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-[oklch(0.12_0_0)] border border-white/8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-white/40" />
              <h3 className="font-bold">Monthly Subscription</h3>
            </div>
            <p className="text-3xl font-bold text-white/40 mb-2">$99 – $349<span className="text-base font-normal">/month</span></p>
            <p className="text-sm text-white/40">$1,188 – $4,188 per year, every year</p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-white/40 flex items-center gap-2"><span className="text-red-400">✕</span> Recurring monthly charges</li>
              <li className="text-sm text-white/40 flex items-center gap-2"><span className="text-red-400">✕</span> Lose access if you cancel</li>
              <li className="text-sm text-white/40 flex items-center gap-2"><span className="text-red-400">✕</span> Price increases over time</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-[oklch(0.14_0_0)] border-2 border-[oklch(0.48_0.20_18)]/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[oklch(0.48_0.20_18)] text-white text-xs font-bold">
              BEST VALUE
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Infinity className="w-5 h-5 text-[oklch(0.65_0.18_18)]" />
              <h3 className="font-bold text-[oklch(0.70_0.18_18)]">Lifetime Access</h3>
            </div>
            <p className="text-3xl font-bold mb-2">$2,997<span className="text-base font-normal text-white/50"> one-time</span></p>
            <p className="text-sm text-white/50">Pay once, use forever</p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Never pay monthly again</li>
              <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> All future updates included</li>
              <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Pays for itself in 8 months</li>
            </ul>
          </div>
        </div>

        {/* App Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">What You Get in the App</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {APP_FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="p-4 rounded-lg bg-[oklch(0.12_0_0)] border border-white/6">
                  <Icon className="w-6 h-6 text-[oklch(0.65_0.18_18)] mb-2" />
                  <h4 className="font-semibold text-sm mb-1">{feat.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prominent CTA */}
        <div className="text-center p-10 rounded-xl bg-[oklch(0.12_0_0)] border-2 border-[oklch(0.48_0.20_18)]/40">
          <h3 className="text-2xl font-bold mb-2">Add Lifetime App Access</h3>
          <p className="text-white/50 mb-8">One payment. No monthly fees. All future updates included.</p>
          <Button
            size="lg"
            onClick={handleAccept}
            disabled={isLoading}
            className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white font-bold px-12 py-7 text-xl shadow-lg shadow-[oklch(0.48_0.20_18)]/20 w-full sm:w-auto mb-4"
          >
            <Zap className="w-5 h-5" />
            {isLoading ? 'Processing...' : 'Yes! Add Lifetime Access — $2,997'}
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="flex items-center justify-center gap-4 text-xs text-white/40 mb-4">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure Checkout</span>
            <span className="flex items-center gap-1"><Check className="w-3 h-3" /> 30-Day Guarantee</span>
          </div>
          <div>
            <button
              onClick={handleDecline}
              className="text-sm text-white/30 hover:text-white/50 underline transition-colors"
            >
              No thanks, show me the next offer
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-3">Frequently Asked Questions</h2>
        <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">Common questions about lifetime app access</p>
        <div className="space-y-3 max-w-3xl mx-auto">
          {[
            {
              q: 'What is the difference between the Business-in-a-Box and the app?',
              a: 'The Business-in-a-Box gives you the education — the complete investing course (65+ video lessons), downloadable templates, contracts, checklists, and reference guides. The Freedom One app is the live software platform with interactive tools like the Deal Analyzer, Rehab Estimator, Pipeline CRM, Renovation Designer, and Portfolio Dashboard. Think of it this way: the BIB teaches you what to do, the app does the heavy lifting for you.'
            },
            {
              q: 'What does "lifetime access" actually mean?',
              a: 'It means exactly what it says — you pay once and you have access to the Freedom One app forever. No monthly fees, no annual renewals, no surprise charges. You also get every future update, new feature, and improvement at no additional cost. Your account never expires.'
            },
            {
              q: 'How much would I spend on a monthly subscription instead?',
              a: 'Monthly subscriptions range from $99/month (Starter) to $349/month (Elite). That is $1,188 to $4,188 per year. Lifetime access at $2,997 pays for itself in as little as 8 months on the Pro plan — and then you never pay again. Over 3 years, you save between $567 and $9,567 compared to monthly billing.'
            },
            {
              q: 'Can I use the Business-in-a-Box without the app?',
              a: 'Absolutely. The Business-in-a-Box is a complete, standalone product. You get the full course, all templates, contracts, and resources as downloadable files. The app is an optional upgrade that adds interactive digital tools to make your investing workflow faster and more efficient.'
            },
            {
              q: 'What tools are included in the app?',
              a: 'The app includes the Deal Analyzer (real-time profitability calculations with deal scoring and 70% rule analysis), Rehab Estimator (room-by-room assessment with 3 material tiers and Home Depot pricing), Pipeline CRM (track deals from lead to close), Renovation Designer (AI-powered before/after visualizations), Portfolio Dashboard, SOW Generator, Profit Calculator (6 investment scenarios), Contractor Management, Property Listings, and more. All tools work across 50+ metro markets with regional pricing adjustments.'
            },
            {
              q: 'What if I decide I want the app later?',
              a: 'This lifetime pricing is only available right now as a one-time offer immediately after your Business-in-a-Box purchase. If you pass on this offer, you can still subscribe to the app later — but you will pay the standard monthly rate of $99 to $349 per month with no lifetime option available. This is the only opportunity to lock in lifetime access at a one-time price.'
            },
            {
              q: 'Do I get all subscription tiers with lifetime access?',
              a: 'Yes. Lifetime access includes every feature across all subscription tiers — Starter, Pro, and Elite. You get the complete platform with no restrictions. That includes white-label reports, AI deal summaries, CSV import/export, deal comparison tools, analytics dashboard, and everything else.'
            },
            {
              q: 'Is there a refund policy?',
              a: 'We stand behind our product. If you are not satisfied with the app within 30 days of purchase, contact us at contact@freedomoneproperties.com and we will work with you to make it right. We want every investor to succeed with our tools.'
            },
          ].map((faq, i) => (
            <details key={i} className="group rounded-lg bg-[oklch(0.12_0_0)] border border-white/8 overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer p-5 text-left font-semibold text-sm lg:text-base hover:bg-white/[0.02] transition-colors list-none">
                {faq.q}
                <ChevronDown className="w-4 h-4 text-white/40 shrink-0 ml-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 text-sm text-white/60 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h3 className="text-xl font-bold mb-3">Lock In Lifetime Access Now</h3>
        <p className="text-white/50 text-sm mb-6">This offer is only available right now, immediately after your BIB purchase.</p>
        <Button
          size="lg"
          onClick={handleAccept}
          disabled={isLoading}
          className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white font-bold px-12 py-7 text-xl shadow-lg shadow-[oklch(0.48_0.20_18)]/20 mb-4"
        >
          <Zap className="w-5 h-5" />
          {isLoading ? 'Processing...' : 'Add Lifetime Access — $2,997'}
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div>
          <button
            onClick={handleDecline}
            className="text-sm text-white/30 hover:text-white/50 underline transition-colors"
          >
            No thanks, show me the next offer
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[oklch(0.06_0_0)]">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-xs text-white/30">
          <p>This is a one-time exclusive offer available only after your Business-in-a-Box purchase.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Freedom One Properties. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
