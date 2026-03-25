import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import {
  ArrowRight, Check, Zap, Megaphone, Mail, Phone, Calendar,
  Facebook, FileText, Palette, Target, Users
} from 'lucide-react';
import { useState } from 'react';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/MgvhsGurcOgbPgCR.png";

const KIT_ITEMS = [
  { icon: Facebook, title: 'Facebook Ad Campaigns', desc: '5 complete ad campaigns with copy, targeting, budgets, and creative briefs for motivated sellers, cash buyers, and private lenders' },
  { icon: Mail, title: 'Direct Mail Pieces', desc: 'Pre-written yellow letters, postcards, and professional letters ready to print and send to absentee owners and distressed properties' },
  { icon: FileText, title: 'Email Sequences', desc: '3 complete email sequences — 7-day nurture, 5-email onboarding, and 10-email sales sequence with subject lines and CTAs' },
  { icon: Calendar, title: '6-Month Social Media Calendar', desc: '130+ posts with captions, hashtags, and post types for Instagram, Facebook, LinkedIn, and TikTok — 26 weeks of daily content' },
  { icon: Phone, title: 'Cold Call Scripts', desc: 'Proven scripts for calling absentee owners, expired listings, FSBO sellers, and pre-foreclosure leads' },
  { icon: Target, title: 'Lead Generation Playbook', desc: 'Step-by-step guide to generating motivated seller leads through online and offline channels' },
];

export default function BibOto2() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const createCheckout = trpc.bib.createCheckout.useMutation();

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const result = await createCheckout.mutateAsync({
        productKey: 'oto2',
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
    navigate('/bib/oto2-down?declined=oto2');
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[oklch(0.06_0_0)]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={LOGO_URL} alt="Freedom One" className="h-10 object-contain" />
          <span className="text-sm text-green-400 font-medium">One More Upgrade Available</span>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 max-w-5xl mx-auto px-4 py-12 lg:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.48_0.20_18)]/15 border border-[oklch(0.48_0.20_18)]/30 text-[oklch(0.70_0.18_18)] text-sm font-medium mb-6">
            <Megaphone className="w-4 h-4" />
            <span>Done-For-You Marketing</span>
          </div>
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
            Skip the Marketing Learning Curve —<br />
            <span className="text-[oklch(0.70_0.18_18)]">Get 6 Months of Ready-to-Use Content</span>
          </h1>
          <p className="text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
            Most investors struggle to create marketing materials. This kit gives you <strong className="text-white">6 months of 
            pre-written, ready-to-deploy</strong> Facebook ads, direct mail, email sequences, social media posts, 
            and cold call scripts. Just customize your name and start marketing today.
          </p>
        </div>

        {/* Kit Items */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {KIT_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-5 rounded-lg bg-[oklch(0.12_0_0)] border border-white/8">
                <Icon className="w-6 h-6 text-[oklch(0.65_0.18_18)] mb-3" />
                <h3 className="font-bold text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-white/55 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Value Stack */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="space-y-2 mb-6">
            {[
              { item: '5 Facebook Ad Campaigns with Targeting & Copy', value: '$297' },
              { item: 'Direct Mail Templates (Letters, Postcards, Yellow Letters)', value: '$147' },
              { item: '3 Complete Email Sequences (22 Emails)', value: '$197' },
              { item: '6-Month Social Media Calendar (130+ Posts)', value: '$297' },
              { item: 'Cold Call Scripts for 4 Lead Types', value: '$97' },
              { item: 'Lead Generation Playbook', value: '$147' },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-[oklch(0.12_0_0)]">
                <span className="text-sm flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400 shrink-0" />
                  {row.item}
                </span>
                <span className="text-sm font-semibold text-white/30 line-through">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 rounded-xl bg-[oklch(0.12_0_0)] border border-[oklch(0.48_0.20_18)]/30 max-w-2xl mx-auto">
          <Palette className="w-10 h-10 mx-auto mb-4 text-[oklch(0.65_0.18_18)]" />
          <p className="text-white/40 text-sm mb-1">Total Value: <span className="line-through">$1,182</span></p>
          <p className="text-4xl font-bold text-[oklch(0.70_0.18_18)] mb-2">$497</p>
          <p className="text-sm text-white/50 mb-6">One-time payment. 6 months of marketing content.</p>
          <Button
            size="lg"
            onClick={handleAccept}
            disabled={isLoading}
            className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white font-bold px-10 py-6 text-lg mb-4"
          >
            {isLoading ? 'Processing...' : 'Yes! Add the Marketing Kit — $497'}
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div>
            <button
              onClick={handleDecline}
              className="text-sm text-white/30 hover:text-white/50 underline transition-colors"
            >
              No thanks, I will handle marketing myself
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[oklch(0.06_0_0)] mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} Freedom One Properties. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
