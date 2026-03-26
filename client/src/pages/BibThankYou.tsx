import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  CheckCircle, Download, GraduationCap, BookOpen, ArrowRight,
  Mail, Headphones, Calculator, ChevronDown, Wrench, BarChart3
} from 'lucide-react';
import { useEffect } from 'react';
import { trackFunnelEvent } from '@/components/TrackingPixels';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/MgvhsGurcOgbPgCR.png";

const FAQ = [
  {
    q: 'How do I access my course materials?',
    a: 'Your course is available immediately. Click the "Start the Course" button above to begin with Module 1. All 65+ video lessons are organized by module and available on-demand. You can watch at your own pace and revisit any lesson at any time.'
  },
  {
    q: 'Where do I download my templates and contracts?',
    a: 'Check your email for a confirmation message with download links to all templates, contracts, SOW documents, checklists, and resource files. If you do not see the email within 15 minutes, check your spam folder or contact us at contact@freedomoneproperties.com.'
  },
  {
    q: 'What should I do first?',
    a: 'We recommend starting with Module 1 (Investor Mindset and Goals) to set your foundation. Then download and print the Due Diligence Checklist and the Deal Analysis Checklist. Once you complete Module 3 (Fix and Flip Strategy) or Module 4 (Wholesale Strategy), you will be ready to start analyzing your first deal.'
  },
  {
    q: 'How do I use the Deal Analyzer?',
    a: 'If you purchased app access (OTO1), click "Open Deal Analyzer" above. Enter a property address, add comparable sales, estimate rehab costs using the built-in Rehab Estimator, and the tool will calculate your projected profit, ROI, and deal score automatically. The course covers how to use these tools in detail in Modules 8 and 9.'
  },
  {
    q: 'Can I access the course on my phone?',
    a: 'Yes. The Freedom One platform is fully responsive and works on any device — desktop, tablet, or smartphone. Watch lessons, review templates, and even use the Deal Analyzer from your phone while visiting properties.'
  },
  {
    q: 'How do I get help if I have questions?',
    a: 'Contact our support team at contact@freedomoneproperties.com. We typically respond within 24 business hours. For course-related questions, check the lesson notes and resources first — most common questions are addressed in the course materials.'
  },
  {
    q: 'Will there be updates to the course?',
    a: 'Yes. Your purchase includes all future course updates at no additional cost. As market conditions change and new strategies emerge, we update the course content and add new lessons. You will be notified by email when new content is available.'
  },
];

export default function BibThankYou() {
  useEffect(() => {
    trackFunnelEvent('Purchase', { value: 1997, content_name: 'Business-in-a-Box', content_category: 'BIB' });
  }, []);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[oklch(0.06_0_0)]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-center">
          <img src={LOGO_URL} alt="Freedom One" className="h-10 object-contain" />
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 max-w-3xl mx-auto px-4 py-16 lg:py-20 text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-400" />
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          Welcome to Freedom One!
        </h1>
        <p className="text-lg text-white/65 max-w-xl mx-auto leading-relaxed mb-10">
          Your purchase is confirmed. You now have access to the complete Business-in-a-Box system. 
          Here is how to get started right away.
        </p>

        {/* Next Steps */}
        <div className="grid sm:grid-cols-2 gap-5 mb-12 text-left">
          <div className="p-6 rounded-xl bg-[oklch(0.12_0_0)] border border-white/8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/15">
                <Download className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-bold">Step 1: Download Templates</h3>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">
              Check your email for download links to all contract templates, SOW templates, 
              marketing materials, and resource documents.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[oklch(0.12_0_0)] border border-white/8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)]/15">
                <GraduationCap className="w-5 h-5 text-[oklch(0.65_0.18_18)]" />
              </div>
              <h3 className="font-bold">Step 2: Start the Course</h3>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">
              Begin with Module 1 — Investor Mindset and Goals. Each module builds on the previous one 
              and includes practical exercises.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[oklch(0.12_0_0)] border border-white/8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/15">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-bold">Step 3: Review Checklists</h3>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">
              Print the due diligence and deal analysis checklists. Keep them handy as you 
              start evaluating your first properties.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[oklch(0.12_0_0)] border border-white/8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/15">
                <Mail className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-bold">Step 4: Launch Marketing</h3>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">
              Use the marketing templates to start generating leads. Begin with direct mail 
              to absentee owners in your target market.
            </p>
          </div>
        </div>

        {/* Prominent CTAs to App */}
        <div className="p-8 rounded-xl bg-[oklch(0.12_0_0)] border-2 border-[oklch(0.48_0.20_18)]/40 mb-10">
          <h3 className="text-2xl font-bold mb-3">Ready to Analyze Your First Deal?</h3>
          <p className="text-white/55 text-sm mb-8 max-w-md mx-auto">
            Use the Freedom One platform to analyze deals, estimate rehab costs, and track your pipeline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/course">
              <Button size="lg" className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white font-bold px-8 py-6 text-lg shadow-lg shadow-[oklch(0.48_0.20_18)]/20">
                <GraduationCap className="w-5 h-5" /> Start the Course
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/analyzer">
              <Button size="lg" variant="outline" className="gap-2 border-white/25 text-white hover:bg-white/10 font-bold px-8 py-6 text-lg">
                <Calculator className="w-5 h-5" /> Open Deal Analyzer
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-white/40">
            <Link href="/scope-of-work" className="flex items-center gap-1 hover:text-white/60 transition-colors">
              <Wrench className="w-3 h-3" /> SOW Templates
            </Link>
            <Link href="/pipeline" className="flex items-center gap-1 hover:text-white/60 transition-colors">
              <BarChart3 className="w-3 h-3" /> Pipeline CRM
            </Link>
            <Link href="/marketing" className="flex items-center gap-1 hover:text-white/60 transition-colors">
              <Mail className="w-3 h-3" /> Marketing
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="flex items-center justify-center gap-2 text-sm text-white/40">
          <Headphones className="w-4 h-4" />
          <span>Need help? Contact us at <a href="mailto:contact@freedomoneproperties.com" className="text-[oklch(0.65_0.18_18)] hover:underline">contact@freedomoneproperties.com</a></span>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[oklch(0.10_0_0)]">
        <div className="max-w-3xl mx-auto px-4 py-12 lg:py-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-3">Getting Started — FAQ</h2>
          <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">Everything you need to know to hit the ground running</p>
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

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[oklch(0.06_0_0)]">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-xs text-white/30">
          <p>Thank you for choosing Freedom One. Your investing journey starts now.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Freedom One Properties. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
