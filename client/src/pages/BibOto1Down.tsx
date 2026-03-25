import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { ArrowRight, Check, Clock, AlertTriangle, ChevronDown, Shield, Zap } from 'lucide-react';
import { useState } from 'react';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/MgvhsGurcOgbPgCR.png";

const FAQ = [
  {
    q: 'What do I get with 1-year app access?',
    a: 'You get full, unrestricted access to every feature in the Freedom One app for 12 months — Deal Analyzer, Rehab Estimator, Pipeline CRM, Renovation Designer, Portfolio Dashboard, SOW Generator, and all 50+ metro market pricing. No feature limitations whatsoever.'
  },
  {
    q: 'How is this different from the monthly subscription?',
    a: 'Instead of paying $99–$349 per month, you pay one flat fee of $997 for the entire year. That saves you between $191 and $3,191 compared to 12 months of monthly billing. Plus, you lock in your price — no increases during your year.'
  },
  {
    q: 'What happens after the 12 months?',
    a: 'After your year ends, you can renew at the then-current annual rate, switch to a monthly subscription, or simply stop using the app. Your Business-in-a-Box course and templates remain yours forever regardless.'
  },
  {
    q: 'Can I upgrade to lifetime later?',
    a: 'The lifetime pricing at $2,997 was a one-time offer on the previous page. If you choose the 1-year plan now, you may have the option to upgrade to lifetime in the future, but it will be at the standard rate which may be higher.'
  },
  {
    q: 'Do I still keep my Business-in-a-Box if I skip this?',
    a: 'Absolutely. Your Business-in-a-Box purchase — the complete course, templates, contracts, and all resources — is yours forever regardless of whether you add app access. The app is an optional upgrade.'
  },
  {
    q: 'Is there a refund policy?',
    a: 'Yes. If you are not satisfied within 30 days of purchase, contact us at contact@freedomoneproperties.com and we will work with you to make it right.'
  },
];

export default function BibOto1Down() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const createCheckout = trpc.bib.createCheckout.useMutation();

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const result = await createCheckout.mutateAsync({
        productKey: 'oto1Down',
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
    navigate('/bib/oto2?skipped=oto1');
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[oklch(0.06_0_0)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={LOGO_URL} alt="Freedom One" className="h-10 object-contain" />
          <span className="text-sm text-yellow-400 font-medium">Wait — Special Downsell Offer</span>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 max-w-3xl mx-auto px-4 py-12 lg:py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            <span>Before You Go — Reduced Offer</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1] mb-5">
            Not Ready for Lifetime?<br />
            <span className="text-yellow-400">Try 1 Year of App Access Instead</span>
          </h1>
          <p className="text-lg text-white/65 max-w-xl mx-auto leading-relaxed">
            We understand lifetime is a big commitment. Get full access to every feature in the Freedom One app 
            for 12 months at a fraction of the cost. No monthly fees during your year.
          </p>
        </div>

        {/* Main Offer Card */}
        <div className="p-8 rounded-xl bg-[oklch(0.12_0_0)] border-2 border-yellow-500/30 text-center mb-8">
          <Clock className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-2xl font-bold mb-2">1-Year Full App Access</h3>
          <p className="text-white/50 text-sm mb-4">Everything in the app. 12 months. One payment.</p>
          <p className="text-lg text-white/40 line-through mb-1">$2,997 Lifetime</p>
          <p className="text-5xl font-bold text-yellow-400 mb-2">$997</p>
          <p className="text-sm text-white/50 mb-6">One-time payment for 12 months of access</p>

          <ul className="text-left max-w-sm mx-auto space-y-2 mb-8">
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> Deal Analyzer with deal scoring</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> Rehab Estimator with 3 material tiers</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> Pipeline CRM for deal tracking</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> 50+ metro market pricing</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> All app features for 12 months</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> Option to upgrade to lifetime later</li>
          </ul>

          {/* Prominent CTA */}
          <Button
            size="lg"
            onClick={handleAccept}
            disabled={isLoading}
            className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-12 py-7 text-xl shadow-lg shadow-yellow-600/20 w-full sm:w-auto mb-4"
          >
            <Zap className="w-5 h-5" />
            {isLoading ? 'Processing...' : 'Yes! Add 1-Year Access — $997'}
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

        {/* Savings Comparison */}
        <div className="p-6 rounded-xl bg-[oklch(0.10_0_0)] border border-white/8 mb-12">
          <h3 className="font-bold text-center mb-4">How Much You Save vs. Monthly</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-white/40 mb-1">Starter Monthly</p>
              <p className="text-sm text-white/50">$99/mo × 12</p>
              <p className="text-lg font-bold text-white/40">$1,188</p>
              <p className="text-xs text-green-400 mt-1">Save $191</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Pro Monthly</p>
              <p className="text-sm text-white/50">$199/mo × 12</p>
              <p className="text-lg font-bold text-white/40">$2,388</p>
              <p className="text-xs text-green-400 mt-1">Save $1,391</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Elite Monthly</p>
              <p className="text-sm text-white/50">$349/mo × 12</p>
              <p className="text-lg font-bold text-white/40">$4,188</p>
              <p className="text-xs text-green-400 mt-1">Save $3,191</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[oklch(0.10_0_0)]">
        <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-3">Frequently Asked Questions</h2>
          <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">Common questions about the 1-year access plan</p>
          <div className="space-y-3">
            {FAQ.map((faq, i) => (
              <details key={i} className="group rounded-lg bg-[oklch(0.14_0_0)] border border-white/8 overflow-hidden">
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
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h3 className="text-xl font-bold mb-3">Ready to Get Started?</h3>
        <p className="text-white/50 text-sm mb-6">12 months of full app access. One payment. No monthly fees.</p>
        <Button
          size="lg"
          onClick={handleAccept}
          disabled={isLoading}
          className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-12 py-7 text-xl shadow-lg shadow-yellow-600/20 mb-4"
        >
          <Zap className="w-5 h-5" />
          {isLoading ? 'Processing...' : 'Add 1-Year Access — $997'}
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
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-white/30">
          <p>This is a one-time offer available only during the Business-in-a-Box checkout process.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Freedom One Properties. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
