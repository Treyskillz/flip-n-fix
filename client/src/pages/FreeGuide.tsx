import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  AlertTriangle, CheckCircle2, Download, ArrowRight,
  DollarSign, Wrench, Users, BarChart3, BookOpen
} from 'lucide-react';

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/logo-transparent-black_1d2d479c.png";

const MISTAKES = [
  { num: 1, title: 'Not Having Enough Patience', icon: AlertTriangle, desc: 'Rushing through renovations leads to cut corners and lower sale prices.' },
  { num: 2, title: 'Not Having an Experienced Advocate', icon: Users, desc: 'Without guidance, costly mistakes compound quickly.' },
  { num: 3, title: 'Miscalculating Costs', icon: DollarSign, desc: 'Forgetting carrying costs, financing, and closing fees kills profit.' },
  { num: 4, title: 'Overdoing It', icon: Wrench, desc: 'Over-improving for the neighborhood eats into your margins.' },
  { num: 5, title: 'Not Managing Contractors Correctly', icon: BarChart3, desc: 'Poor contractor management blows budgets and timelines.' },
];

export default function FreeGuide() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const captureLead = trpc.leads.capture.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setDownloadUrl(data.downloadUrl);
      toast.success('Check your download — the guide is ready!');
      // Auto-open the PDF
      window.open(data.downloadUrl, '_blank');
    },
    onError: (err) => {
      toast.error(err.message || 'Something went wrong. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    captureLead.mutate({ email, name: name || undefined, source: 'landing-page', leadMagnet: '5-mistakes' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[oklch(0.12_0_0)] text-white py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img src={LOGO_URL} alt="Freedom One" className="h-16 object-contain mb-6" />
              <p className="text-[oklch(0.65_0.18_18)] font-semibold text-sm uppercase tracking-wider mb-3">Free Guide</p>
              <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-5">
                The Top 5 Rehabbing Mistakes
                <span className="text-[oklch(0.65_0.18_18)]"> That Cost Investors Thousands</span>
              </h1>
              <p className="text-lg text-white/70 leading-relaxed mb-6">
                With over 20 years of real estate investing experience, Trey Hill reveals the 5 critical errors
                that separate profitable flips from money pits — and exactly how to avoid each one.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> 7-Page Guide</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Actionable Tips</span>
                <span className="flex items-center gap-1.5"><Download className="w-4 h-4" /> Instant Download</span>
              </div>
            </div>

            {/* Lead Capture Form */}
            <div className="bg-white rounded-xl p-8 shadow-2xl">
              {!submitted ? (
                <>
                  <h2 className="text-xl font-bold text-[oklch(0.15_0_0)] mb-2">Get Your Free Copy</h2>
                  <p className="text-sm text-gray-500 mb-6">Enter your email and we'll send you the guide instantly.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Name (optional)</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="bg-gray-50 border-gray-200 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address *</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="bg-gray-50 border-gray-200 text-gray-900"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white font-semibold"
                      disabled={captureLead.isPending}
                    >
                      {captureLead.isPending ? 'Sending...' : (
                        <>
                          <Download className="w-4.5 h-4.5" />
                          Download Free Guide
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-400 text-center">No spam. Unsubscribe anytime.</p>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h2 className="text-xl font-bold text-[oklch(0.15_0_0)] mb-2">Your Guide is Ready!</h2>
                  <p className="text-sm text-gray-500 mb-6">The download should have started automatically. If not, click below.</p>
                  <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white font-semibold">
                      <Download className="w-4.5 h-4.5" /> Download Again
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="container py-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-3">What You'll Learn Inside</h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Each mistake includes real-world examples, cost breakdowns, and step-by-step solutions you can apply to your next deal.
        </p>
        <div className="space-y-4 max-w-3xl mx-auto">
          {MISTAKES.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.num} className="flex items-start gap-4 p-5 border border-border/60 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[oklch(0.48_0.20_18)]/10 flex items-center justify-center">
                  <span className="text-[oklch(0.48_0.20_18)] font-bold text-sm">#{m.num}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">{m.title}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Trey */}
      <section className="bg-[oklch(0.97_0_0)] py-16">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4">About the Author</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Trey Hill is the founder of Freedom One Real Estate System and has been investing in real estate for over 20 years.
            He's completed hundreds of fix-and-flip projects, wholesale deals, and rental acquisitions across multiple states.
            His mission is to give every investor the tools and knowledge to make data-driven decisions and maximize profit on every deal.
          </p>
          <p className="text-sm text-muted-foreground">
            Freedom One Real Estate System | www.freedom1realsystem.com | (800) 557-9809
          </p>
        </div>
      </section>
    </div>
  );
}
