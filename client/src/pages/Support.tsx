import { Mail, Phone, Clock, MessageCircle, HelpCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: 'How do I get started with the Deal Analyzer?',
    a: 'Navigate to the Analyzer page from the top menu. Enter a property address, add comparable sales, estimate rehab costs using our room-by-room estimator, and the system will calculate your projected profit, ROI, and deal score automatically.',
  },
  {
    q: 'What subscription plans are available?',
    a: 'We offer four tiers: Free (basic deal analysis), Pro ($99/mo - unlimited deals, full rehab estimator, SOW templates, pipeline tracker, and more), Elite ($179/mo - everything in Pro plus Profit Calculator, full course access, property listings, and priority support), and Team ($289/mo - everything in Elite plus white-label branding, AI deal summaries, CSV import/export, deal comparison, and analytics dashboard). All paid plans include a 7-day free trial.',
  },
  {
    q: 'How accurate are the rehab cost estimates?',
    a: 'Our estimates are based on real Home Depot SKU pricing and regional labor cost data across 50+ metro markets. We offer three material tiers (Rental Grade, Standard, and Luxury) so you can match estimates to your project scope. Always verify with local contractors for final bids.',
  },
  {
    q: 'Can I cancel my subscription at any time?',
    a: 'Yes. All subscriptions are month-to-month (or annual) and can be cancelled at any time through your account billing portal. There are no long-term contracts or cancellation fees.',
  },
  {
    q: 'What is the 70% Rule in deal analysis?',
    a: 'The 70% Rule is a guideline used by fix-and-flip investors. It states that you should pay no more than 70% of the After Repair Value (ARV) minus repair costs. Our analyzer calculates this automatically and shows you the maximum allowable offer.',
  },
  {
    q: 'How do I access the Scope of Work templates?',
    a: 'Go to the SOW Templates page from the navigation menu. You can browse templates by room type (kitchen, bathroom, bedroom, etc.) and customize them for your specific project. Templates include detailed line items with material and labor breakdowns.',
  },
  {
    q: 'Are the contract templates legally binding?',
    a: 'Our contract templates are provided as starting points and educational resources. They include standard "and/or assigns" language for wholesale deals. However, we strongly recommend having all contracts reviewed by a licensed real estate attorney in your state before use.',
  },
  {
    q: 'How do I list a property for sale?',
    a: 'Navigate to the Listings page and click "Add Listing." Upload photos, enter property details, features, and your asking price. You can update the status (Active, Under Contract, Sold) at any time.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="font-medium text-sm">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function Support() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-14 text-center">
          <HelpCircle className="w-10 h-10 mx-auto mb-4 text-[oklch(0.65_0.18_18)]" />
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">Support Center</h1>
          <p className="text-[oklch(0.6_0_0)] max-w-lg mx-auto">
            Have questions about the platform, your subscription, or real estate investing tools?
            We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="p-3 rounded-full bg-[oklch(0.48_0.20_18)]/10 w-fit mx-auto mb-4">
                <Mail className="w-6 h-6 text-[oklch(0.48_0.20_18)]" />
              </div>
              <h3 className="font-bold mb-1">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-3">For general questions and technical issues</p>
              <a href="mailto:support@freedomoneproperties.com" className="text-sm font-medium text-[oklch(0.48_0.20_18)] hover:underline">
                support@freedomoneproperties.com
              </a>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="p-3 rounded-full bg-[oklch(0.48_0.20_18)]/10 w-fit mx-auto mb-4">
                <Clock className="w-6 h-6 text-[oklch(0.48_0.20_18)]" />
              </div>
              <h3 className="font-bold mb-1">Office Hours</h3>
              <p className="text-sm text-muted-foreground mb-3">Our team is available during business hours</p>
              <p className="text-sm font-medium">Monday – Friday</p>
              <p className="text-sm text-muted-foreground">9:00 AM – 5:00 PM (Eastern)</p>
            </CardContent>
          </Card>

          <Card className="text-center sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6">
              <div className="p-3 rounded-full bg-[oklch(0.48_0.20_18)]/10 w-fit mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-[oklch(0.48_0.20_18)]" />
              </div>
              <h3 className="font-bold mb-1">Response Time</h3>
              <p className="text-sm text-muted-foreground mb-3">We aim to respond to all inquiries within</p>
              <p className="text-sm font-medium">24 Business Hours</p>
              <p className="text-sm text-muted-foreground">Elite & Team plans get priority support</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="p-6">
              {FAQ_ITEMS.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-10">
          <h2 className="text-xl font-bold mb-6 text-center">Quick Links</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Deal Analyzer', href: '/analyzer' },
              { label: 'Investor Course', href: '/course' },
              { label: 'Pricing Plans', href: '/pricing' },
              { label: 'Legal Disclaimers', href: '/disclaimers' },
            ].map(link => (
              <a key={link.href} href={link.href} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm">
                <ExternalLink className="w-3.5 h-3.5" /> {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
