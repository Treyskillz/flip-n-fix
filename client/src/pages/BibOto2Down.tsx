import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { ArrowRight, Check, AlertTriangle, Megaphone, ChevronDown, Shield, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { trackFunnelEvent } from '@/components/TrackingPixels';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/MgvhsGurcOgbPgCR.png";

const FAQ = [
  {
    q: 'What is included in the Marketing Starter Pack?',
    a: 'You get 2 Facebook ad campaigns (Motivated Sellers + Cash Buyers) with complete targeting and copy, a direct mail yellow letter template, a 7-day email nurture sequence with 7 pre-written emails, a 30-day social media calendar with daily posts and captions, and an absentee owner cold call script. Everything is ready to customize and deploy.'
  },
  {
    q: 'How is this different from the full Marketing Kit?',
    a: 'The full Marketing Kit ($497) includes 6 Facebook ad campaigns, 22 emails across 3 sequences, a 6-month social media calendar (130+ posts), 6 direct mail templates, scripts for 4 lead types, and a lead generation playbook. The Starter Pack gives you the essentials to get started — the most impactful pieces at a lower price point.'
  },
  {
    q: 'Can I upgrade to the full kit later?',
    a: 'The full Marketing Kit at $497 was offered on the previous page. If you pass on the Starter Pack, you will not have access to either option after this page. This is the last marketing offer in the checkout process.'
  },
  {
    q: 'Is 30 days of social media content enough?',
    a: 'The 30-day calendar gives you a full month of daily content to build momentum and establish your social media presence. Many investors use the first month to test what resonates with their audience, then create similar content going forward based on what performed best.'
  },
  {
    q: 'Do I still keep my Business-in-a-Box if I skip this?',
    a: 'Absolutely. Your Business-in-a-Box purchase — the complete course, templates, contracts, and all resources — is yours forever regardless. The Marketing Starter Pack is an optional add-on to jumpstart your lead generation.'
  },
];

export default function BibOto2Down() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const createCheckout = trpc.bib.createCheckout.useMutation();

  useEffect(() => {
    trackFunnelEvent('ViewContent', { value: 197, content_name: 'OTO2 Downsell Marketing Starter', content_category: 'BIB' });
  }, []);

  const handleAccept = async () => {
    setIsLoading(true);
    trackFunnelEvent('InitiateCheckout', { value: 197, content_name: 'OTO2 Downsell Marketing Starter', content_category: 'BIB' });
    try {
      const result = await createCheckout.mutateAsync({
        productKey: 'oto2Down',
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
    navigate('/bib/thank-you?skipped=oto2');
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] text-white flex flex-col">
      <header className="border-b border-white/10 bg-[oklch(0.06_0_0)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={LOGO_URL} alt="Freedom One" className="h-10 object-contain" />
          <span className="text-sm text-yellow-400 font-medium">Last Chance — Reduced Offer</span>
        </div>
      </header>

      <section className="flex-1 max-w-3xl mx-auto px-4 py-12 lg:py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            <span>Final Offer — Reduced Marketing Package</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1] mb-5">
            How About Just the<br />
            <span className="text-yellow-400">Marketing Starter Pack?</span>
          </h1>
          <p className="text-lg text-white/65 max-w-xl mx-auto leading-relaxed">
            Get the essential marketing templates to start generating leads immediately — 
            at a fraction of the full kit price. This is the last offer before your order is finalized.
          </p>
        </div>

        {/* Main Offer Card */}
        <div className="p-8 rounded-xl bg-[oklch(0.12_0_0)] border-2 border-yellow-500/30 text-center mb-8">
          <Megaphone className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-2xl font-bold mb-4">Marketing Starter Pack</h3>
          <ul className="text-left max-w-md mx-auto space-y-2 mb-8">
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> 2 Facebook Ad Campaigns (Motivated Sellers + Cash Buyers)</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> Direct Mail Yellow Letter Template</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> 7-Day Email Nurture Sequence (7 Emails)</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> 30-Day Social Media Calendar with Captions</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> Absentee Owner Cold Call Script</li>
          </ul>
          <p className="text-lg text-white/40 line-through mb-1">$497 Full Kit</p>
          <p className="text-5xl font-bold text-yellow-400 mb-2">$197</p>
          <p className="text-sm text-white/50 mb-8">One-time payment. Instant access. Last chance.</p>

          {/* Prominent CTA */}
          <Button
            size="lg"
            onClick={handleAccept}
            disabled={isLoading}
            className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-12 py-7 text-xl shadow-lg shadow-yellow-600/20 w-full sm:w-auto mb-4"
          >
            <Zap className="w-5 h-5" />
            {isLoading ? 'Processing...' : 'Yes! Add the Starter Pack — $197'}
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="flex items-center justify-center gap-4 text-xs text-white/40 mb-4">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure Checkout</span>
            <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Instant Access</span>
          </div>
          <div>
            <button
              onClick={handleDecline}
              className="text-sm text-white/30 hover:text-white/50 underline transition-colors"
            >
              No thanks, take me to my order
            </button>
          </div>
        </div>

        {/* Urgency Note */}
        <div className="p-5 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-center mb-8">
          <p className="text-sm text-yellow-400/80">
            <strong>This is the final offer in the checkout process.</strong> After this page, you will be taken to your order confirmation. 
            The Marketing Starter Pack will not be available at this price again.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[oklch(0.10_0_0)]">
        <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-3">Frequently Asked Questions</h2>
          <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">Common questions about the Marketing Starter Pack</p>
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
        <h3 className="text-xl font-bold mb-3">Last Chance to Add Marketing</h3>
        <p className="text-white/50 text-sm mb-6">Essential marketing templates to start generating leads today.</p>
        <Button
          size="lg"
          onClick={handleAccept}
          disabled={isLoading}
          className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-12 py-7 text-xl shadow-lg shadow-yellow-600/20 mb-4"
        >
          <Zap className="w-5 h-5" />
          {isLoading ? 'Processing...' : 'Add the Starter Pack — $197'}
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div>
          <button
            onClick={handleDecline}
            className="text-sm text-white/30 hover:text-white/50 underline transition-colors"
          >
            No thanks, take me to my order
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[oklch(0.06_0_0)]">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-white/30">
          <p>This is the final offer in the Business-in-a-Box checkout process.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Freedom One Properties. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
