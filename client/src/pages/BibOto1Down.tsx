import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { ArrowRight, Check, Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/MgvhsGurcOgbPgCR.png";

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

          <Button
            size="lg"
            onClick={handleAccept}
            disabled={isLoading}
            className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-10 py-6 text-lg mb-4"
          >
            {isLoading ? 'Processing...' : 'Yes! Add 1-Year Access — $997'}
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div>
            <button
              onClick={handleDecline}
              className="text-sm text-white/30 hover:text-white/50 underline transition-colors"
            >
              No thanks, skip this offer
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[oklch(0.06_0_0)]">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} Freedom One Properties. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
