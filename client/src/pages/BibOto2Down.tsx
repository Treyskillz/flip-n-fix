import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { ArrowRight, Check, AlertTriangle, Megaphone } from 'lucide-react';
import { useState } from 'react';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/MgvhsGurcOgbPgCR.png";

export default function BibOto2Down() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const createCheckout = trpc.bib.createCheckout.useMutation();

  const handleAccept = async () => {
    setIsLoading(true);
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
            <span>Reduced Marketing Package</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1] mb-5">
            How About Just the<br />
            <span className="text-yellow-400">Marketing Starter Pack?</span>
          </h1>
          <p className="text-lg text-white/65 max-w-xl mx-auto leading-relaxed">
            Get the essential marketing templates to start generating leads immediately — 
            at a fraction of the full kit price.
          </p>
        </div>

        <div className="p-8 rounded-xl bg-[oklch(0.12_0_0)] border-2 border-yellow-500/30 text-center mb-8">
          <Megaphone className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-2xl font-bold mb-4">Marketing Starter Pack</h3>
          <ul className="text-left max-w-md mx-auto space-y-2 mb-8">
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> 2 Facebook Ad Campaigns (Motivated Sellers + Cash Buyers)</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> Direct Mail Yellow Letter Template</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> 7-Day Email Nurture Sequence</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> 30-Day Social Media Calendar</li>
            <li className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /> Absentee Owner Cold Call Script</li>
          </ul>
          <p className="text-lg text-white/40 line-through mb-1">$497 Full Kit</p>
          <p className="text-5xl font-bold text-yellow-400 mb-2">$197</p>
          <p className="text-sm text-white/50 mb-6">One-time payment. Instant access.</p>
          <Button
            size="lg"
            onClick={handleAccept}
            disabled={isLoading}
            className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-10 py-6 text-lg mb-4"
          >
            {isLoading ? 'Processing...' : 'Yes! Add the Starter Pack — $197'}
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
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[oklch(0.06_0_0)]">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} Freedom One Properties. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
