import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Printer, DollarSign, Clock, Home as HomeIcon, Handshake,
  CheckCircle2, AlertTriangle, FileText, Users, Wrench,
  ArrowRight, Shield, Briefcase, TrendingUp, Zap, Star,
  ChevronDown, ChevronUp, XCircle, Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import { useProfileReplacer } from '@/hooks/useProfileReplacer';
import { Link } from 'wouter';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/RUvFlwFYmtbQizbR.png";

// ─── 5 Rehab Mistakes ──────────────────────────────────────────────────────
const REHAB_MISTAKES = [
  {
    title: 'Not Getting Multiple Bids',
    desc: 'Always get at least 3 written estimates from licensed contractors. The lowest bid isn\'t always the best — look for value, reliability, and references.',
  },
  {
    title: 'Ignoring the Inspection Report',
    desc: 'A professional inspection can reveal hidden issues that cost thousands. Never skip the inspection to save a few hundred dollars.',
  },
  {
    title: 'Over-Improving for the Neighborhood',
    desc: 'Don\'t put $100K in upgrades into a $150K neighborhood. Your renovation should match the top comparable sales in the area — not exceed them.',
  },
  {
    title: 'Skipping Permits & Code Compliance',
    desc: 'Unpermitted work can kill a sale, create liability, and reduce property value. Always pull required permits and pass inspections.',
  },
  {
    title: 'Underestimating the Timeline',
    desc: 'Every month a property sits costs money in carrying costs (insurance, taxes, utilities, loan interest). Build a realistic timeline and add a 20% buffer.',
  },
];

// ─── Editable Fields ─────────────────────────────────────────────────────────
interface BrochureFields {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  website: string;
  marketArea: string;
  yearsExperience: string;
  dealsCompleted: string;
  cashOfferTimeline: string;
  partnershipSplit: string;
  consultingFee: string;
  tagline: string;
  additionalNotes: string;
}

const DEFAULT_FIELDS: BrochureFields = {
  companyName: '',
  contactName: '',
  phone: '',
  email: '',
  website: '',
  marketArea: '',
  yearsExperience: '',
  dealsCompleted: '20+',
  cashOfferTimeline: '14 days',
  partnershipSplit: '50/50',
  consultingFee: '25%',
  tagline: 'We Buy Houses — Any Condition, Any Situation',
  additionalNotes: '',
};

export default function ThreeOptionBrochure() {
  const [fields, setFields] = useState<BrochureFields>(DEFAULT_FIELDS);
  const [expandedMistake, setExpandedMistake] = useState<number | null>(null);
  const { profile, hasProfile } = useProfileReplacer();

  const updateField = useCallback((key: keyof BrochureFields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  }, []);

  // Auto-fill from profile
  const ef = useMemo(() => {
    const f = { ...fields };
    if (hasProfile && profile) {
      if (!f.companyName && profile.companyName) f.companyName = profile.companyName;
      if (!f.contactName && profile.fullName) f.contactName = profile.fullName;
      if (!f.phone && profile.phone) f.phone = profile.phone;
      if (!f.email && profile.email) f.email = profile.email;
      if (!f.website && profile.website) f.website = profile.website;
      if (!f.marketArea && profile.marketArea) f.marketArea = profile.marketArea;
      if (!f.yearsExperience && profile.yearsExperience) f.yearsExperience = profile.yearsExperience;
    }
    return f;
  }, [fields, profile, hasProfile]);

  // ─── Print Multi-Page Brochure ─────────────────────────────────────────────
  const handlePrint = useCallback(() => {
    const companyDisplay = ef.companyName || '[Your Company Name]';
    const contactDisplay = ef.contactName || '[Your Name]';
    const phoneDisplay = ef.phone || '[Phone]';
    const emailDisplay = ef.email || '[Email]';
    const websiteDisplay = ef.website || '';
    const marketDisplay = ef.marketArea || '[Your Market Area]';
    const experienceDisplay = ef.yearsExperience || '[X]';
    const dealsDisplay = ef.dealsCompleted || '20+';

    const mistakesHtml = REHAB_MISTAKES.map((m, i) =>
      `<div class="mistake">
        <div class="mistake-num">${i + 1}</div>
        <div>
          <strong>${m.title}</strong>
          <p>${m.desc}</p>
        </div>
      </div>`
    ).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>3-Option Brochure — ${companyDisplay}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: letter; margin: 0.55in 0.65in; }
    body { font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.5; color: #1a1a1a; background: #fff; }

    /* ── Cover Page ── */
    .cover { page-break-after: always; text-align: center; padding-top: 1.8in; }
    .cover img { height: 80px; margin-bottom: 20px; }
    .cover h1 { font-size: 32pt; font-weight: 900; color: #b91c1c; line-height: 1.1; margin-bottom: 6px; }
    .cover .tagline { font-size: 14pt; color: #555; font-weight: 400; margin-bottom: 28px; font-style: italic; }
    .cover .divider { width: 100px; height: 4px; background: #b91c1c; margin: 20px auto; }
    .cover .intro { font-size: 11pt; color: #333; max-width: 480px; margin: 0 auto 24px; line-height: 1.7; }
    .cover .company-info { font-size: 11pt; color: #333; line-height: 1.8; margin-top: 16px; }
    .cover .cta-box { background: #b91c1c; color: #fff; display: inline-block; padding: 12px 32px; border-radius: 6px; font-size: 13pt; font-weight: 700; margin-top: 24px; }

    /* ── Page Header ── */
    .page-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 2px solid #b91c1c; margin-bottom: 18px; }
    .page-header img { height: 32px; }
    .page-header .page-title { font-size: 13pt; font-weight: 700; color: #b91c1c; }

    /* ── Sections ── */
    h2 { font-size: 14pt; font-weight: 800; color: #b91c1c; margin: 16px 0 8px; }
    h3 { font-size: 11pt; font-weight: 600; color: #333; margin: 10px 0 4px; }
    p { margin-bottom: 6px; color: #333; font-size: 10pt; }

    /* ── Option Cards ── */
    .option-card { border: 2px solid #e5e5e5; border-radius: 8px; padding: 20px; margin-bottom: 16px; page-break-inside: avoid; }
    .option-card.featured { border-color: #b91c1c; background: #fef2f2; }
    .option-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .option-num { width: 36px; height: 36px; border-radius: 50%; background: #b91c1c; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14pt; flex-shrink: 0; }
    .option-title { font-size: 14pt; font-weight: 800; color: #1a1a1a; }
    .option-subtitle { font-size: 9pt; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .option-badge { display: inline-block; background: #b91c1c; color: #fff; font-size: 8pt; font-weight: 700; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .pros-cons { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px; }
    .pros-cons h4 { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .pros-cons ul { margin: 0; padding-left: 16px; }
    .pros-cons li { font-size: 9pt; margin-bottom: 3px; color: #444; }
    .pros h4 { color: #16a34a; }
    .cons h4 { color: #dc2626; }

    /* ── Highlight Box ── */
    .highlight-box { background: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #b91c1c; padding: 12px 16px; margin: 12px 0; border-radius: 4px; }
    .highlight-box strong { color: #b91c1c; }

    /* ── Comparison Table ── */
    .compare-table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 9pt; }
    .compare-table th { background: #b91c1c; color: #fff; padding: 8px 10px; text-align: left; font-weight: 600; }
    .compare-table td { padding: 7px 10px; border-bottom: 1px solid #e5e5e5; }
    .compare-table tr:nth-child(even) td { background: #fafafa; }
    .compare-table .check { color: #16a34a; font-weight: 700; }
    .compare-table .x { color: #dc2626; font-weight: 700; }

    /* ── Mistakes ── */
    .mistake { display: flex; gap: 10px; margin: 10px 0; align-items: flex-start; }
    .mistake-num { width: 24px; height: 24px; background: #1a1a1a; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 10pt; flex-shrink: 0; }
    .mistake strong { display: block; color: #b91c1c; margin-bottom: 2px; }
    .mistake p { font-size: 9pt; color: #555; margin: 0; }

    /* ── Testimonial ── */
    .testimonial { background: #f8f8f8; border-left: 4px solid #b91c1c; padding: 14px 18px; margin: 14px 0; font-style: italic; color: #444; border-radius: 0 6px 6px 0; }
    .testimonial .author { font-style: normal; font-weight: 600; color: #333; margin-top: 6px; font-size: 9pt; }

    /* ── Footer ── */
    .doc-footer { margin-top: 20px; padding-top: 10px; border-top: 2px solid #b91c1c; font-size: 7.5pt; color: #999; text-align: center; line-height: 1.5; }

    .page-break { page-break-before: always; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    @media screen { body { max-width: 8.5in; margin: 0 auto; padding: 24px 36px; } }
    ul { margin: 4px 0 8px 18px; }
    ul li { margin-bottom: 3px; color: #444; font-size: 10pt; }
  </style>
</head>
<body>

  <!-- ═══════════ COVER PAGE ═══════════ -->
  <div class="cover">
    <img src="${LOGO_URL}" alt="Freedom One" />
    <h1>3 Ways We Can<br/>Help You Today</h1>
    <p class="tagline">${ef.tagline}</p>
    <div class="divider"></div>
    <p class="intro">
      Whether you need to sell fast for cash, want to maximize your profit through a partnership, 
      or prefer to stay involved and earn the most — we have a solution that fits your situation.
    </p>
    <div class="company-info">
      <strong>${companyDisplay}</strong><br/>
      ${contactDisplay} &nbsp;|&nbsp; ${phoneDisplay}<br/>
      ${emailDisplay}${websiteDisplay ? ` | ${websiteDisplay}` : ''}
    </div>
    <div class="cta-box">Call Today for a Free Consultation</div>
  </div>

  <!-- ═══════════ PAGE 2: THE 3 OPTIONS ═══════════ -->
  <div class="page-break">
    <div class="page-header">
      <img src="${LOGO_URL}" alt="Freedom One" />
      <span class="page-title">Your Three Options</span>
    </div>

    <p style="margin-bottom: 14px;">Every property and every homeowner's situation is different. That's why we offer three distinct options so you can choose the path that works best for <em>you</em>.</p>

    <!-- Option 1 -->
    <div class="option-card featured">
      <div class="option-header">
        <div class="option-num">1</div>
        <div>
          <div class="option-title">Sell for Quick Cash</div>
          <div class="option-subtitle">Fastest &amp; Easiest — Close in as little as ${ef.cashOfferTimeline}</div>
        </div>
        <span class="option-badge">Most Popular</span>
      </div>
      <p>We purchase your property <strong>as-is</strong> for cash. No repairs needed, no showings, no agent commissions, no closing costs to you. We handle everything — you just pick your closing date and walk away with cash in hand.</p>
      <div class="pros-cons">
        <div class="pros">
          <h4>✓ Benefits</h4>
          <ul>
            <li>Close in as little as ${ef.cashOfferTimeline}</li>
            <li>No repairs or cleanup needed</li>
            <li>No agent commissions (save 5–6%)</li>
            <li>No closing costs to you</li>
            <li>Certainty — no financing contingencies</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Trade-offs</h4>
          <ul>
            <li>Lower price than full market value</li>
            <li>No upside if property appreciates</li>
          </ul>
        </div>
      </div>
      <p style="margin-top: 8px; font-size: 9pt; color: #888;"><strong>Best for:</strong> Inherited properties, relocations, divorce, foreclosure prevention, tired landlords, properties needing major repairs.</p>
    </div>

    <!-- Option 2 -->
    <div class="option-card">
      <div class="option-header">
        <div class="option-num">2</div>
        <div>
          <div class="option-title">Partnership Renovation</div>
          <div class="option-subtitle">We Do the Work — You Share the Upside</div>
        </div>
      </div>
      <p>We invest our own capital to fully renovate your property to modern standards, then sell it on the open market for top dollar. You receive your base price <strong>plus a ${ef.partnershipSplit} split</strong> of the profit above that base. Timeline: 6–18 months.</p>
      <div class="pros-cons">
        <div class="pros">
          <h4>✓ Benefits</h4>
          <ul>
            <li>Higher total payout than cash offer</li>
            <li>Zero out-of-pocket cost to you</li>
            <li>Professional renovation management</li>
            <li>Property sold at full market value</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Trade-offs</h4>
          <ul>
            <li>Longer timeline (6–18 months)</li>
            <li>Profit is split, not 100% yours</li>
            <li>Market risk during renovation period</li>
          </ul>
        </div>
      </div>
      <p style="margin-top: 8px; font-size: 9pt; color: #888;"><strong>Best for:</strong> Homeowners who want more money but don't have the capital or expertise to renovate themselves.</p>
    </div>

    <!-- Option 3 -->
    <div class="option-card">
      <div class="option-header">
        <div class="option-num">3</div>
        <div>
          <div class="option-title">Active Participation</div>
          <div class="option-subtitle">You Finance — We Consult — You Keep the Most</div>
        </div>
      </div>
      <p>You fund the renovation and we serve as your project consultant for a fee of <strong>${ef.consultingFee} of construction costs</strong>. We manage contractors, timelines, and quality — you keep the lion's share of the profit.</p>
      <div class="pros-cons">
        <div class="pros">
          <h4>✓ Benefits</h4>
          <ul>
            <li>Highest potential profit</li>
            <li>Expert guidance throughout</li>
            <li>You maintain full ownership</li>
            <li>Learn the renovation process</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Trade-offs</h4>
          <ul>
            <li>You fund the renovation</li>
            <li>More involvement required</li>
            <li>You bear the market risk</li>
            <li>Longest timeline</li>
          </ul>
        </div>
      </div>
      <p style="margin-top: 8px; font-size: 9pt; color: #888;"><strong>Best for:</strong> Homeowners with capital who want maximum profit and are willing to be more involved.</p>
    </div>
  </div>

  <!-- ═══════════ PAGE 3: COMPARISON TABLE ═══════════ -->
  <div class="page-break">
    <div class="page-header">
      <img src="${LOGO_URL}" alt="Freedom One" />
      <span class="page-title">Side-by-Side Comparison</span>
    </div>

    <table class="compare-table">
      <thead>
        <tr>
          <th style="width: 30%;">Feature</th>
          <th style="width: 23%;">Option 1: Cash</th>
          <th style="width: 23%;">Option 2: Partnership</th>
          <th style="width: 24%;">Option 3: Active</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Timeline</strong></td><td>${ef.cashOfferTimeline}</td><td>6–18 months</td><td>6–18 months</td></tr>
        <tr><td><strong>Your Out-of-Pocket Cost</strong></td><td>$0</td><td>$0</td><td>Renovation costs</td></tr>
        <tr><td><strong>Repairs Needed?</strong></td><td>None — we buy as-is</td><td>We handle all repairs</td><td>We manage, you fund</td></tr>
        <tr><td><strong>Agent Commissions</strong></td><td>None</td><td>Split from proceeds</td><td>Standard (5–6%)</td></tr>
        <tr><td><strong>Closing Costs to You</strong></td><td>$0</td><td>Split from proceeds</td><td>Standard</td></tr>
        <tr><td><strong>Profit Potential</strong></td><td>Lowest (but guaranteed)</td><td>Medium (${ef.partnershipSplit} split)</td><td>Highest (minus consulting fee)</td></tr>
        <tr><td><strong>Your Involvement</strong></td><td>Minimal</td><td>Low</td><td>Moderate</td></tr>
        <tr><td><strong>Risk Level</strong></td><td>Lowest</td><td>Low–Medium</td><td>Medium</td></tr>
        <tr><td><strong>Certainty of Close</strong></td><td class="check">✓ Highest</td><td>Good</td><td>Depends on market</td></tr>
        <tr><td><strong>Best For</strong></td><td>Speed & certainty</td><td>More money, no work</td><td>Maximum profit</td></tr>
      </tbody>
    </table>

    <div class="highlight-box">
      <strong>Not sure which option is right for you?</strong> Call us for a free, no-obligation consultation. We'll walk through your specific situation and help you determine which option makes the most sense for your goals and timeline.
    </div>

    <h2>Who We Work With</h2>
    <p>We specialize in helping homeowners in difficult or unique situations, including:</p>
    <ul>
      <li><strong>Inherited Properties</strong> — Don't want to deal with a property you inherited? We make it easy.</li>
      <li><strong>Out-of-State Owners</strong> — Managing a property from far away is stressful. Let us take it off your hands.</li>
      <li><strong>Tired Landlords</strong> — Done dealing with tenants, repairs, and headaches? We'll buy it as-is.</li>
      <li><strong>Pre-Foreclosure</strong> — Facing foreclosure? We can close fast and help you avoid the credit damage.</li>
      <li><strong>Divorce Situations</strong> — Need to sell quickly as part of a divorce settlement? We can help.</li>
      <li><strong>Major Repairs Needed</strong> — Can't afford the repairs? We buy properties in any condition.</li>
      <li><strong>Vacant Properties</strong> — Sitting vacant and costing you money? Let's solve that today.</li>
    </ul>
  </div>

  <!-- ═══════════ PAGE 4: 5 REHAB MISTAKES ═══════════ -->
  <div class="page-break">
    <div class="page-header">
      <img src="${LOGO_URL}" alt="Freedom One" />
      <span class="page-title">5 Costly Renovation Mistakes to Avoid</span>
    </div>

    <p style="margin-bottom: 14px;">Whether you choose to partner with us or go it alone, avoid these common mistakes that cost homeowners and investors thousands of dollars:</p>

    ${mistakesHtml}

    <div class="highlight-box" style="margin-top: 20px;">
      <strong>The Bottom Line:</strong> Renovating a property is a business — not a hobby. It requires systems, experience, and market knowledge. That's exactly what ${companyDisplay} brings to the table. With ${dealsDisplay} completed projects and ${experienceDisplay} years of experience in the ${marketDisplay} market, we've seen it all and know how to avoid costly mistakes.
    </div>

    <div class="testimonial">
      "I inherited my mother's house and had no idea what to do with it. ${companyDisplay} gave me three clear options, explained the pros and cons of each, and never pressured me. I chose Option 1 and closed in 12 days. The process was seamless."
      <div class="author">— Satisfied Homeowner, ${marketDisplay}</div>
    </div>
  </div>

  <!-- ═══════════ PAGE 5: ABOUT US & CONTACT ═══════════ -->
  <div class="page-break">
    <div class="page-header">
      <img src="${LOGO_URL}" alt="Freedom One" />
      <span class="page-title">About Us & Next Steps</span>
    </div>

    <h2>About ${companyDisplay}</h2>
    <p>${companyDisplay} is a professional real estate investment company based in ${marketDisplay}. With ${experienceDisplay} years of experience and ${dealsDisplay} completed transactions, we specialize in providing creative solutions for homeowners who need to sell their properties quickly or want to maximize their return through our partnership programs.</p>
    <p>We are committed to ethical, transparent business practices. Every transaction is handled with professionalism, and we always ensure our sellers understand all of their options before making a decision.</p>

    <h2>Our Commitment to You</h2>
    <ul>
      <li><strong>No Pressure</strong> — We present options and let you decide. No high-pressure sales tactics.</li>
      <li><strong>Full Transparency</strong> — We show you exactly how we calculate our offers and what the numbers look like.</li>
      <li><strong>Professional Service</strong> — Licensed, insured, and experienced. We treat every homeowner with respect.</li>
      <li><strong>Flexible Solutions</strong> — Three options means there's always a path that works for your situation.</li>
    </ul>

    ${ef.additionalNotes ? `<h2>Additional Information</h2><p>${ef.additionalNotes}</p>` : ''}

    <div style="text-align: center; margin-top: 30px; padding: 24px; background: #fef2f2; border-radius: 8px; border: 2px solid #b91c1c;">
      <h2 style="margin: 0 0 8px; font-size: 18pt;">Ready to Explore Your Options?</h2>
      <p style="font-size: 12pt; color: #555; margin-bottom: 16px;">Contact us today for a free, no-obligation consultation.</p>
      <p style="font-size: 14pt; font-weight: 700; color: #b91c1c; margin-bottom: 4px;">${contactDisplay}</p>
      <p style="font-size: 12pt;">${companyDisplay}</p>
      <p style="font-size: 12pt;">${phoneDisplay} &nbsp;|&nbsp; ${emailDisplay}</p>
      ${websiteDisplay ? `<p style="font-size: 11pt; color: #555;">${websiteDisplay}</p>` : ''}
    </div>

    <div class="doc-footer" style="margin-top: 30px;">
      © ${new Date().getFullYear()} ${companyDisplay}. All rights reserved.<br/>
      This brochure is for informational purposes only. All offers are subject to property inspection and verification. 
      Consult with your own legal and financial advisors before making any real estate decisions.<br/>
      Prepared using the Freedom One Real Estate Investment System.
    </div>
  </div>

</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) { toast.error('Pop-up blocked — please allow pop-ups'); return; }
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }, [ef]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[oklch(0.92_0.06_25)]">
              <Briefcase className="w-6 h-6 text-[oklch(0.50_0.18_25)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">3-Option Seller Brochure</h1>
              <p className="text-sm text-muted-foreground">
                Professional leave-behind brochure for seller appointments
              </p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Generate a professional, multi-page seller brochure presenting three options: Cash Offer, Partnership Renovation, 
            and Active Participation. Customize with your company details and print as a branded brochure to leave with sellers.
          </p>
          {!hasProfile && (
            <div className="mt-3 flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                <Link href="/profile" className="underline font-medium">Set up your profile</Link> to auto-fill your company information.
              </span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Main Content Preview */}
          <div className="space-y-6">
            <Tabs defaultValue="options">
              <TabsList className="bg-[oklch(0.15_0_0)] border border-[oklch(0.3_0_0)]">
                <TabsTrigger value="options">The 3 Options</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="mistakes">5 Mistakes</TabsTrigger>
              </TabsList>

              {/* ── Options Tab ── */}
              <TabsContent value="options" className="space-y-4 mt-4">
                {/* Option 1 */}
                <Card className="border-[oklch(0.48_0.20_18)]/30 bg-[oklch(0.13_0_0)]">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[oklch(0.48_0.20_18)] text-white flex items-center justify-center font-bold text-lg">1</div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Sell for Quick Cash</h2>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-[oklch(0.5_0_0)]">Close in as little as {ef.cashOfferTimeline}</p>
                          <span className="text-[9px] bg-[oklch(0.48_0.20_18)] text-white px-2 py-0.5 rounded-full font-semibold uppercase">Most Popular</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[oklch(0.7_0_0)] leading-relaxed mb-3">
                      We purchase your property <strong className="text-white">as-is</strong> for cash. No repairs, no showings, no commissions, no closing costs to you. Pick your closing date and walk away with cash.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-emerald-400 font-semibold uppercase mb-1">Benefits</p>
                        {['Close in 14 days', 'No repairs needed', 'No commissions', 'No closing costs', 'Guaranteed close'].map((b, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-[oklch(0.65_0_0)]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> {b}
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] text-red-400 font-semibold uppercase mb-1">Trade-offs</p>
                        {['Lower than market value', 'No upside potential'].map((t, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-[oklch(0.65_0_0)]">
                            <XCircle className="w-3 h-3 text-red-400 shrink-0" /> {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Option 2 */}
                <Card className="border-[oklch(0.3_0_0)] bg-[oklch(0.13_0_0)]">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[oklch(0.35_0_0)] text-white flex items-center justify-center font-bold text-lg">2</div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Partnership Renovation</h2>
                        <p className="text-xs text-[oklch(0.5_0_0)]">We do the work — you share the upside ({ef.partnershipSplit} split)</p>
                      </div>
                    </div>
                    <p className="text-sm text-[oklch(0.7_0_0)] leading-relaxed mb-3">
                      We invest our capital to fully renovate your property, then sell on the open market. You get your base price plus a <strong className="text-white">{ef.partnershipSplit} split</strong> of the profit above that base.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-emerald-400 font-semibold uppercase mb-1">Benefits</p>
                        {['Higher total payout', 'Zero out-of-pocket', 'Professional management', 'Full market value'].map((b, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-[oklch(0.65_0_0)]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> {b}
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] text-red-400 font-semibold uppercase mb-1">Trade-offs</p>
                        {['6–18 month timeline', 'Profit is split', 'Market risk'].map((t, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-[oklch(0.65_0_0)]">
                            <XCircle className="w-3 h-3 text-red-400 shrink-0" /> {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Option 3 */}
                <Card className="border-[oklch(0.3_0_0)] bg-[oklch(0.13_0_0)]">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[oklch(0.35_0_0)] text-white flex items-center justify-center font-bold text-lg">3</div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Active Participation</h2>
                        <p className="text-xs text-[oklch(0.5_0_0)]">You finance — we consult ({ef.consultingFee} of construction)</p>
                      </div>
                    </div>
                    <p className="text-sm text-[oklch(0.7_0_0)] leading-relaxed mb-3">
                      You fund the renovation and we serve as your project consultant for <strong className="text-white">{ef.consultingFee} of construction costs</strong>. We manage contractors, timelines, and quality — you keep the lion's share.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-emerald-400 font-semibold uppercase mb-1">Benefits</p>
                        {['Highest profit potential', 'Expert guidance', 'Full ownership', 'Learn the process'].map((b, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-[oklch(0.65_0_0)]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> {b}
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] text-red-400 font-semibold uppercase mb-1">Trade-offs</p>
                        {['You fund renovation', 'More involvement', 'You bear market risk', 'Longest timeline'].map((t, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-[oklch(0.65_0_0)]">
                            <XCircle className="w-3 h-3 text-red-400 shrink-0" /> {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Comparison Tab ── */}
              <TabsContent value="comparison" className="mt-4">
                <Card className="border-[oklch(0.3_0_0)] bg-[oklch(0.13_0_0)]">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-bold text-white mb-4">Side-by-Side Comparison</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-[oklch(0.3_0_0)]">
                            <th className="text-left py-2 px-2 text-[oklch(0.5_0_0)] font-semibold">Feature</th>
                            <th className="text-left py-2 px-2 text-[oklch(0.48_0.20_18)] font-semibold">Cash</th>
                            <th className="text-left py-2 px-2 text-[oklch(0.5_0_0)] font-semibold">Partnership</th>
                            <th className="text-left py-2 px-2 text-[oklch(0.5_0_0)] font-semibold">Active</th>
                          </tr>
                        </thead>
                        <tbody className="text-[oklch(0.65_0_0)]">
                          {[
                            ['Timeline', ef.cashOfferTimeline, '6–18 months', '6–18 months'],
                            ['Your Cost', '$0', '$0', 'Renovation $'],
                            ['Repairs', 'None — as-is', 'We handle', 'We manage, you fund'],
                            ['Commissions', 'None', 'From proceeds', '5–6%'],
                            ['Closing Costs', '$0', 'From proceeds', 'Standard'],
                            ['Profit Potential', 'Lowest (guaranteed)', `Medium (${ef.partnershipSplit})`, 'Highest'],
                            ['Your Involvement', 'Minimal', 'Low', 'Moderate'],
                            ['Risk', 'Lowest', 'Low–Medium', 'Medium'],
                          ].map((row, i) => (
                            <tr key={i} className="border-b border-[oklch(0.2_0_0)]">
                              <td className="py-2 px-2 text-white font-medium">{row[0]}</td>
                              <td className="py-2 px-2">{row[1]}</td>
                              <td className="py-2 px-2">{row[2]}</td>
                              <td className="py-2 px-2">{row[3]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── 5 Mistakes Tab ── */}
              <TabsContent value="mistakes" className="mt-4">
                <Card className="border-[oklch(0.3_0_0)] bg-[oklch(0.13_0_0)]">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-bold text-white mb-4">5 Costly Renovation Mistakes to Avoid</h2>
                    <div className="space-y-3">
                      {REHAB_MISTAKES.map((m, i) => (
                        <div key={i} className="border border-[oklch(0.25_0_0)] rounded-lg overflow-hidden">
                          <button
                            onClick={() => setExpandedMistake(expandedMistake === i ? null : i)}
                            className="w-full text-left p-3 flex items-center gap-3 hover:bg-[oklch(0.18_0_0)] transition-colors"
                          >
                            <div className="w-6 h-6 rounded-full bg-[oklch(0.25_0_0)] text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {i + 1}
                            </div>
                            <span className="text-sm font-medium text-white flex-1">{m.title}</span>
                            {expandedMistake === i ? (
                              <ChevronUp className="w-4 h-4 text-[oklch(0.5_0_0)]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[oklch(0.5_0_0)]" />
                            )}
                          </button>
                          {expandedMistake === i && (
                            <div className="px-3 pb-3 text-sm text-[oklch(0.65_0_0)] leading-relaxed border-t border-[oklch(0.2_0_0)] pt-2 ml-9">
                              {m.desc}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar: Customization & Actions */}
          <div className="space-y-4">
            <Card className="border-[oklch(0.3_0_0)] bg-[oklch(0.13_0_0)] sticky top-20">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[oklch(0.48_0.20_18)]" />
                  Customize Your Brochure
                </h3>
                {hasProfile && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-3 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Profile auto-filled
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Company Name</Label>
                    <Input value={ef.companyName} onChange={e => updateField('companyName', e.target.value)} placeholder="Freedom One Investments" className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                  </div>
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Contact Name</Label>
                    <Input value={ef.contactName} onChange={e => updateField('contactName', e.target.value)} placeholder="Your Name" className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-[oklch(0.6_0_0)]">Phone</Label>
                      <Input value={ef.phone} onChange={e => updateField('phone', e.target.value)} placeholder="(555) 123-4567" className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                    </div>
                    <div>
                      <Label className="text-xs text-[oklch(0.6_0_0)]">Email</Label>
                      <Input value={ef.email} onChange={e => updateField('email', e.target.value)} placeholder="you@company.com" className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-[oklch(0.6_0_0)]">Website</Label>
                      <Input value={ef.website} onChange={e => updateField('website', e.target.value)} placeholder="www.company.com" className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                    </div>
                    <div>
                      <Label className="text-xs text-[oklch(0.6_0_0)]">Market Area</Label>
                      <Input value={ef.marketArea} onChange={e => updateField('marketArea', e.target.value)} placeholder="Metro Detroit" className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[oklch(0.25_0_0)]">
                    <p className="text-[10px] text-[oklch(0.5_0_0)] uppercase tracking-wide mb-2">Deal Terms</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-[oklch(0.6_0_0)]">Cash Close Timeline</Label>
                        <Input value={fields.cashOfferTimeline} onChange={e => updateField('cashOfferTimeline', e.target.value)} className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                      </div>
                      <div>
                        <Label className="text-xs text-[oklch(0.6_0_0)]">Partnership Split</Label>
                        <Input value={fields.partnershipSplit} onChange={e => updateField('partnershipSplit', e.target.value)} className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <Label className="text-xs text-[oklch(0.6_0_0)]">Consulting Fee</Label>
                        <Input value={fields.consultingFee} onChange={e => updateField('consultingFee', e.target.value)} className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                      </div>
                      <div>
                        <Label className="text-xs text-[oklch(0.6_0_0)]">Deals Completed</Label>
                        <Input value={fields.dealsCompleted} onChange={e => updateField('dealsCompleted', e.target.value)} className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Tagline</Label>
                    <Input value={fields.tagline} onChange={e => updateField('tagline', e.target.value)} className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                  </div>

                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Additional Notes</Label>
                    <Textarea value={fields.additionalNotes} onChange={e => updateField('additionalNotes', e.target.value)} placeholder="Any additional info for sellers..." className="text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white min-h-[50px]" />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Button onClick={handlePrint} className="w-full gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
                    <Printer className="w-4 h-4" /> Print Brochure (5 pages)
                  </Button>
                  <p className="text-[10px] text-[oklch(0.45_0_0)] text-center">
                    Opens a print-ready multi-page brochure. Use "Save as PDF" in the print dialog.
                  </p>
                </div>

                <div className="mt-3 flex items-start gap-2 text-xs text-[oklch(0.5_0_0)] bg-[oklch(0.15_0_0)] border border-[oklch(0.25_0_0)] rounded-lg p-3">
                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <p>
                    Print this brochure and bring it to every seller appointment. Leave it behind so the seller 
                    can review all three options with their family. It builds credibility and keeps you top-of-mind.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
