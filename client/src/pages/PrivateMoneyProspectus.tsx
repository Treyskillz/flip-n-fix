import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Printer, Download, DollarSign, Shield, Clock, TrendingUp,
  CheckCircle2, AlertTriangle, FileText, Building2, Users,
  BarChart3, Landmark, ArrowRight, Lock, Briefcase, MapPin,
  ChevronDown, ChevronUp, Info, Copy, Check, Home as HomeIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { useProfileReplacer } from '@/hooks/useProfileReplacer';
import { Link } from 'wouter';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/RUvFlwFYmtbQizbR.png";

// ─── Track Record Data (from original prospectus) ────────────────────────────
const TRACK_RECORD = [
  { address: '1339 Sherborn', sqft: '3,500', beds: 4, baths: 2.5, purchase: 179000, rehab: 53000, sold: 340000, closing: 34000, profit: 74000, turnaround: 123, dom: 3 },
  { address: '4320 Pinehurst', sqft: '2,500', beds: 4, baths: 2.5, purchase: 107500, rehab: 50000, sold: 230000, closing: 24500, profit: 48000, turnaround: 177, dom: 27 },
  { address: '1794 Apple Ridge', sqft: '4,200', beds: 4, baths: 4.5, purchase: 210000, rehab: 65000, sold: 375000, closing: 22000, profit: 78000, turnaround: 180, dom: 104 },
  { address: '533 Park St', sqft: '1,100', beds: 3, baths: 1, purchase: 50000, rehab: 21000, sold: 109000, closing: 9000, profit: 29000, turnaround: 65, dom: 3 },
  { address: '36878 Haverhill', sqft: '1,575', beds: 3, baths: 2, purchase: 66000, rehab: 7408, sold: 124000, closing: 16000, profit: 34592, turnaround: 102, dom: 30 },
  { address: '1421 Stanley', sqft: '1,539', beds: 3, baths: 2, purchase: 115000, rehab: 31000, sold: 215000, closing: 18000, profit: 51000, turnaround: 139, dom: 6 },
  { address: '28731 Somerset', sqft: '1,743', beds: 3, baths: 1.5, purchase: 60000, rehab: 35000, sold: 140000, closing: 12700, profit: 32300, turnaround: 140, dom: 1 },
  { address: '510 N. Edgeworth', sqft: '1,139', beds: 3, baths: 2, purchase: 82000, rehab: 25000, sold: 163900, closing: 16000, profit: 40900, turnaround: 165, dom: 21 },
  { address: '3347 Cummings', sqft: '1,095', beds: 3, baths: 1.5, purchase: 60000, rehab: 30000, sold: 125000, closing: 10000, profit: 25000, turnaround: 143, dom: 17 },
  { address: '788 E. Lincoln', sqft: '1,800', beds: 3, baths: 2, purchase: 110000, rehab: 58000, sold: 234000, closing: 18000, profit: 48000, turnaround: 120, dom: 24 },
  { address: '421 Devillen', sqft: '1,600', beds: 4, baths: 1.5, purchase: 50000, rehab: 40000, sold: 143000, closing: 15500, profit: 37500, turnaround: 140, dom: 16 },
  { address: '3100 Cedar Key', sqft: '1,610', beds: 3, baths: 1.5, purchase: 71000, rehab: 25000, sold: 130000, closing: 10000, profit: 24000, turnaround: 103, dom: 18 },
  { address: '2814 Walsh', sqft: '1,232', beds: 3, baths: 1.5, purchase: 73000, rehab: 15000, sold: 134000, closing: 10000, profit: 36000, turnaround: 114, dom: 10 },
  { address: '1125 N. Vermont', sqft: '1,060', beds: 3, baths: 1, purchase: 62000, rehab: 30000, sold: 140000, closing: 18000, profit: 30000, turnaround: 100, dom: 7 },
  { address: '91 W. Ypsilanti', sqft: '1,000', beds: 3, baths: 1, purchase: 20000, rehab: 25000, sold: 80000, closing: 10000, profit: 25000, turnaround: 125, dom: 45 },
  { address: '691 Harry Paul', sqft: '1,200', beds: 3, baths: 1, purchase: 50000, rehab: 20000, sold: 114900, closing: 16000, profit: 28900, turnaround: 161, dom: 58 },
  { address: '1220 Bauman', sqft: '1,100', beds: 3, baths: 1, purchase: 45000, rehab: 25000, sold: 105000, closing: 11000, profit: 24000, turnaround: 168, dom: 38 },
  { address: '4624 Hillcrest', sqft: '1,300', beds: 3, baths: 1.5, purchase: 58000, rehab: 35000, sold: 146000, closing: 16000, profit: 37000, turnaround: 169, dom: 30 },
  { address: '5879 Raven', sqft: '2,200', beds: 4, baths: 2, purchase: 120000, rehab: 76000, sold: 285000, closing: 16000, profit: 73000, turnaround: 155, dom: 72 },
  { address: '23 Millington', sqft: '2,000', beds: 4, baths: 2, purchase: 120000, rehab: 72000, sold: 262000, closing: 15000, profit: 55000, turnaround: 151, dom: 43 },
];

// ─── FAQ Data ────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'How much is the mortgage amount?',
    a: 'The mortgage is for the total capital amount including purchase, rehab, and closing costs. Even though the rehab is given in draws, we allow the private investor to lien the entire capital amount up front. However, interest is only paid on the outstanding balance each month.',
  },
  {
    q: 'How is my money secured?',
    a: 'The mortgage is in the full capital amount invested and is recorded with the county. This puts a first or second lien position on the property, which must be paid off when the property is sold. This means the private investor has collateral for the capital loaned. Although we are confident in our model to fix and flip properties, there is no 100% guarantee that a profit will be made on any real estate transaction.',
  },
  {
    q: 'How do I make sure I have a strong equity position on my loan?',
    a: 'We only buy property that is at 65% of after repair value less repairs. In other words, if a property has an ARV of $200,000 and needs $40,000 in work, we will buy it for $90,000. Once repairs are made, we will be into the property for 65% of ARV. This allows us to make a high profit on the deal and gives our private investors a strong equity position. We provide a list of comps on each deal that justify the ARV.',
  },
  {
    q: 'How much time do I have to fund a deal?',
    a: 'Typically, when we get a deal under contract to purchase, the closing is scheduled 2–4 weeks later. The private investor must have funds available by closing.',
  },
  {
    q: 'What is the typical return for a private investor?',
    a: 'Returns vary by deal structure, but private investors typically earn 8–12% annualized interest on their capital, secured by a recorded mortgage on real property. The short turnaround time (120–150 days) means your capital is not tied up for years.',
  },
  {
    q: 'What happens if the property doesn\'t sell?',
    a: 'Your investment is secured by a recorded mortgage on the property. In the unlikely event that the property does not sell within the projected timeframe, you continue to earn interest on your outstanding balance. The property itself serves as your collateral, and we work aggressively to market and sell every property.',
  },
];

// ─── Editable Fields ─────────────────────────────────────────────────────────
interface ProspectusFields {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  website: string;
  marketArea: string;
  salesPriceRange: string;
  turnaroundDays: string;
  avgDom: string;
  avgProfit: string;
  interestRate: string;
  ltvMax: string;
  additionalNotes: string;
}

const DEFAULT_FIELDS: ProspectusFields = {
  companyName: '',
  contactName: '',
  phone: '',
  email: '',
  website: '',
  marketArea: '',
  salesPriceRange: '$100,000 – $500,000',
  turnaroundDays: '120–150',
  avgDom: 'Less than 30',
  avgProfit: '$30,000 – $50,000',
  interestRate: '8–12%',
  ltvMax: '65%',
  additionalNotes: '',
};

function fmt(n: number) {
  return `$${n.toLocaleString()}`;
}

export default function PrivateMoneyProspectus() {
  const [fields, setFields] = useState<ProspectusFields>(DEFAULT_FIELDS);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const { profile, hasProfile, replaceInText } = useProfileReplacer();

  const updateField = useCallback((key: keyof ProspectusFields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  }, []);

  // Auto-fill from profile
  const effectiveFields = useMemo(() => {
    const f = { ...fields };
    if (hasProfile && profile) {
      if (!f.companyName && profile.companyName) f.companyName = profile.companyName;
      if (!f.contactName && profile.fullName) f.contactName = profile.fullName;
      if (!f.phone && profile.phone) f.phone = profile.phone;
      if (!f.email && profile.email) f.email = profile.email;
      if (!f.website && profile.website) f.website = profile.website;
      if (!f.marketArea && profile.marketArea) f.marketArea = profile.marketArea;
    }
    return f;
  }, [fields, profile, hasProfile]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalProfit = TRACK_RECORD.reduce((s, d) => s + d.profit, 0);
    const avgProfit = Math.round(totalProfit / TRACK_RECORD.length);
    const avgTurnaround = Math.round(TRACK_RECORD.reduce((s, d) => s + d.turnaround, 0) / TRACK_RECORD.length);
    const avgDom = Math.round(TRACK_RECORD.reduce((s, d) => s + d.dom, 0) / TRACK_RECORD.length);
    const totalVolume = TRACK_RECORD.reduce((s, d) => s + d.sold, 0);
    return { totalProfit, avgProfit, avgTurnaround, avgDom, totalVolume, dealCount: TRACK_RECORD.length };
  }, []);

  // ─── Print Multi-Page Brochure ─────────────────────────────────────────────
  const handlePrint = useCallback(() => {
    const ef = effectiveFields;
    const companyDisplay = ef.companyName || '[Your Company Name]';
    const contactDisplay = ef.contactName || '[Your Name]';
    const phoneDisplay = ef.phone || '[Phone]';
    const emailDisplay = ef.email || '[Email]';
    const websiteDisplay = ef.website || '[Website]';
    const marketDisplay = ef.marketArea || '[Your Market Area]';

    const trackRecordRows = TRACK_RECORD.map(d =>
      `<tr>
        <td>${d.address}</td>
        <td class="num">${fmt(d.purchase)}</td>
        <td class="num">${fmt(d.rehab)}</td>
        <td class="num">${fmt(d.sold)}</td>
        <td class="num">${fmt(d.profit)}</td>
        <td class="num">${d.turnaround}d</td>
        <td class="num">${d.dom}d</td>
      </tr>`
    ).join('');

    const faqHtml = FAQ_ITEMS.map(f =>
      `<div class="faq-item">
        <div class="faq-q">Q: ${f.q}</div>
        <div class="faq-a">${f.a}</div>
      </div>`
    ).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Private Money Prospectus — ${companyDisplay}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: letter; margin: 0.6in 0.7in; }
    body { font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.55; color: #1a1a1a; background: #fff; }

    /* ── Cover Page ── */
    .cover { page-break-after: always; text-align: center; padding-top: 2.5in; }
    .cover img { height: 80px; margin-bottom: 24px; }
    .cover h1 { font-size: 28pt; font-weight: 800; color: #b91c1c; line-height: 1.15; margin-bottom: 8px; }
    .cover .subtitle { font-size: 14pt; color: #555; font-weight: 400; margin-bottom: 32px; }
    .cover .company-info { font-size: 11pt; color: #333; line-height: 1.8; }
    .cover .divider { width: 80px; height: 3px; background: #b91c1c; margin: 24px auto; }
    .cover .confidential { margin-top: 40px; font-size: 8pt; color: #999; text-transform: uppercase; letter-spacing: 2px; }

    /* ── Page Header ── */
    .page-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; border-bottom: 2px solid #b91c1c; margin-bottom: 20px; }
    .page-header img { height: 36px; }
    .page-header .page-title { font-size: 14pt; font-weight: 700; color: #b91c1c; }

    /* ── Sections ── */
    h2 { font-size: 13pt; font-weight: 700; color: #b91c1c; margin: 20px 0 10px; padding-bottom: 4px; border-bottom: 1px solid #e5e5e5; }
    h3 { font-size: 11pt; font-weight: 600; color: #333; margin: 14px 0 6px; }
    p { margin-bottom: 8px; color: #333; }
    .highlight-box { background: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #b91c1c; padding: 12px 16px; margin: 12px 0; border-radius: 4px; }
    .highlight-box strong { color: #b91c1c; }

    /* ── Stats Grid ── */
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0; }
    .stat-card { text-align: center; padding: 14px 8px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 6px; }
    .stat-card .stat-value { font-size: 18pt; font-weight: 800; color: #b91c1c; }
    .stat-card .stat-label { font-size: 8pt; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

    /* ── Formula Box ── */
    .formula { background: #1a1a1a; color: #fff; padding: 16px 20px; border-radius: 6px; margin: 14px 0; font-family: 'Courier New', monospace; font-size: 10pt; line-height: 1.8; }
    .formula .label { color: #fca5a5; }

    /* ── Track Record Table ── */
    .track-table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin: 12px 0; }
    .track-table th { background: #b91c1c; color: #fff; padding: 6px 8px; text-align: left; font-weight: 600; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.3px; }
    .track-table td { padding: 5px 8px; border-bottom: 1px solid #e5e5e5; }
    .track-table tr:nth-child(even) td { background: #fafafa; }
    .track-table .num { text-align: right; font-family: 'Courier New', monospace; }

    /* ── Process Steps ── */
    .step { display: flex; gap: 12px; margin: 10px 0; align-items: flex-start; }
    .step-num { width: 28px; height: 28px; background: #b91c1c; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11pt; flex-shrink: 0; }
    .step-content { flex: 1; }
    .step-content strong { display: block; margin-bottom: 2px; }

    /* ── FAQ ── */
    .faq-item { margin-bottom: 14px; }
    .faq-q { font-weight: 700; color: #b91c1c; margin-bottom: 3px; }
    .faq-a { color: #444; padding-left: 16px; border-left: 2px solid #e5e5e5; }

    /* ── Footer ── */
    .doc-footer { margin-top: 24px; padding-top: 12px; border-top: 2px solid #b91c1c; font-size: 7.5pt; color: #999; text-align: center; line-height: 1.5; }

    /* ── Print ── */
    .page-break { page-break-before: always; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    @media screen { body { max-width: 8.5in; margin: 0 auto; padding: 30px 40px; } }
    ul { margin: 6px 0 10px 20px; }
    ul li { margin-bottom: 4px; color: #444; }
  </style>
</head>
<body>

  <!-- ═══════════ COVER PAGE ═══════════ -->
  <div class="cover">
    <img src="${LOGO_URL}" alt="Freedom One" />
    <h1>Private Money<br/>Investment Prospectus</h1>
    <p class="subtitle">Secured Real Estate Investment Opportunities</p>
    <div class="divider"></div>
    <div class="company-info">
      <strong>${companyDisplay}</strong><br/>
      ${contactDisplay}<br/>
      ${phoneDisplay} &nbsp;|&nbsp; ${emailDisplay}<br/>
      ${websiteDisplay ? websiteDisplay : ''}
    </div>
    <p class="confidential">Confidential — For Qualified Investors Only</p>
  </div>

  <!-- ═══════════ PAGE 2: INVESTMENT SUMMARY ═══════════ -->
  <div class="page-break">
    <div class="page-header">
      <img src="${LOGO_URL}" alt="Freedom One" />
      <span class="page-title">Investment Summary</span>
    </div>

    <p><strong>${companyDisplay}</strong> specializes in acquiring distressed residential properties, completely renovating them to modern standards, and re-selling to local homeowners for a profit. We have developed and perfected a system that enables us to consistently find, fix, and flip residential properties for high returns.</p>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.dealCount}</div>
        <div class="stat-label">Completed Deals</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${fmt(stats.totalVolume)}</div>
        <div class="stat-label">Total Sales Volume</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${fmt(stats.totalProfit)}</div>
        <div class="stat-label">Total Net Profit</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${fmt(stats.avgProfit)}</div>
        <div class="stat-label">Avg Profit Per Deal</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.avgTurnaround} days</div>
        <div class="stat-label">Avg Turnaround</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.avgDom} days</div>
        <div class="stat-label">Avg Days on Market</div>
      </div>
    </div>

    <h2>Key Investment Parameters</h2>
    <ul>
      <li><strong>Market Area:</strong> ${marketDisplay} — we only invest in specific cities and neighborhoods where we understand the market and re-sale values</li>
      <li><strong>Sales Price Range:</strong> ${ef.salesPriceRange}</li>
      <li><strong>Average Turnaround:</strong> ${ef.turnaroundDays} days from acquisition to sale</li>
      <li><strong>Average Days on Market:</strong> ${ef.avgDom} days</li>
      <li><strong>Average Net Profit:</strong> ${ef.avgProfit} per deal (~20% of ARV)</li>
      <li><strong>Investor Interest Rate:</strong> ${ef.interestRate} annualized</li>
      <li><strong>Maximum LTV:</strong> ${ef.ltvMax} of After Repair Value</li>
    </ul>

    <h2>Buy Price Formula</h2>
    <div class="formula">
      <span class="label">After Repair Value (ARV)</span><br/>
      − Profit (20%)<br/>
      − Closing Costs (9%)<br/>
      − Carrying Costs (6%)<br/>
      − Repairs<br/>
      ────────────────────<br/>
      = <strong>Maximum Purchase Price</strong>
    </div>
    <p>This formula ensures every deal has built-in profit margins and gives our private investors a strong equity position with significant downside protection.</p>
  </div>

  <!-- ═══════════ PAGE 3: RENOVATIONS & SYSTEMS ═══════════ -->
  <div class="page-break">
    <div class="page-header">
      <img src="${LOGO_URL}" alt="Freedom One" />
      <span class="page-title">Our Process & Standards</span>
    </div>

    <h2>Renovation Standards</h2>
    <p>We specialize in mid-level and high-end remodeled homes. We provide completely renovated, "new construction" style remodeled houses. Each features updated electrical, plumbing, mechanical, roofing, and windows. We market to buyers looking for a totally modern and updated remodel, including:</p>
    <ul>
      <li>New kitchens with granite countertops and stainless steel appliances</li>
      <li>New bathrooms with ceramic tile and modern fixtures</li>
      <li>Updated HVAC, electrical, and plumbing systems</li>
      <li>New flooring, paint, and finishes throughout</li>
      <li>Landscaping and curb appeal improvements</li>
    </ul>
    <p>All renovations are managed daily to ensure quality standards are adhered to and schedules are consistently met. We closely follow market trends to provide the most modern and desirable home on the market.</p>

    <h2>Systems & Procedures</h2>
    <p>What separates our company from other enterprises is the use of proven systems for fixing and flipping residential properties. These systems are used to locate properties, make offers, manage acquisitions, oversee renovations, and handle sales and marketing. By utilizing systems, the company can easily manage 10–15 projects at a time.</p>

    <h2>Safe Investment</h2>
    <div class="highlight-box">
      <strong>Your Capital is Secured by Real Property</strong><br/>
      Each investor holds a 1st or 2nd lien position in the property in which they invest, thus securing the investment with collateral. We provide investors with weekly progress reports, financial updates, and frequently updated photographs of the renovation progress.
    </div>

    <h2>Purchasing Strategy</h2>
    <p>We specialize in buying distressed, REO, and short-sale properties at a discount. Once renovations are completed, the property is listed for sale and marketed on the MLS through our network of licensed real estate agents.</p>
  </div>

  <!-- ═══════════ PAGE 4: INVESTOR PROGRAM ═══════════ -->
  <div class="page-break">
    <div class="page-header">
      <img src="${LOGO_URL}" alt="Freedom One" />
      <span class="page-title">Private Investor Program</span>
    </div>

    <p>We work with dozens of private investors and have raised millions of dollars in short-term private money to fund our fix and flip business. Here is exactly how the process works:</p>

    <div class="step">
      <div class="step-num">1</div>
      <div class="step-content">
        <strong>Deal Presentation</strong>
        Once we secure a property under contract, we present the investor with a complete breakdown: purchase price, renovation cost, expected sales price, expected turnaround time, comparable sold comps to justify the ARV, and as-is before pictures.
      </div>
    </div>

    <div class="step">
      <div class="step-num">2</div>
      <div class="step-content">
        <strong>Legal Documentation</strong>
        Once the investor agrees, we draft: Promissory Note, Mortgage, Personal Guarantee, Business Affidavit, and Agreement to Change. All documents are reviewed, signed, notarized, and originals sent to the investor.
      </div>
    </div>

    <div class="step">
      <div class="step-num">3</div>
      <div class="step-content">
        <strong>Closing & Funding</strong>
        At closing, the investor receives a copy of the closing statement, wiring instructions, and insurance certificate. Funds are wired directly to the title company. The mortgage is recorded with the county, and the recorded copy is sent to the investor.
      </div>
    </div>

    <div class="step">
      <div class="step-num">4</div>
      <div class="step-content">
        <strong>Renovation & Draw Requests</strong>
        Renovations begin immediately. Draw requests include a breakdown of money spent, pictures of completed work, and the amount requested. The investor overnights draw checks as needed.
      </div>
    </div>

    <div class="step">
      <div class="step-num">5</div>
      <div class="step-content">
        <strong>Monthly Interest Payments</strong>
        Each month, we mail interest-only payments to the investor based on the pro-rated outstanding balance (purchase amount plus draws).
      </div>
    </div>

    <div class="step">
      <div class="step-num">6</div>
      <div class="step-content">
        <strong>Sale & Payoff</strong>
        Once renovations are complete and a buyer is secured, the investor provides a payoff letter with principal and any outstanding pro-rated interest. The title company sends proceeds directly to the investor at closing — the investor is made whole.
      </div>
    </div>
  </div>

  <!-- ═══════════ PAGE 5: TRACK RECORD ═══════════ -->
  <div class="page-break">
    <div class="page-header">
      <img src="${LOGO_URL}" alt="Freedom One" />
      <span class="page-title">Completed Projects — Track Record</span>
    </div>

    <p>Below is a summary of our completed fix and flip projects. Every property was purchased at a discount, fully renovated, and sold at or near market value.</p>

    <table class="track-table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Purchase</th>
          <th>Rehab</th>
          <th>Sold</th>
          <th>Net Profit</th>
          <th>Turn</th>
          <th>DOM</th>
        </tr>
      </thead>
      <tbody>
        ${trackRecordRows}
        <tr style="font-weight:700; background:#fef2f2;">
          <td><strong>TOTALS / AVG</strong></td>
          <td class="num">${fmt(TRACK_RECORD.reduce((s,d)=>s+d.purchase,0))}</td>
          <td class="num">${fmt(TRACK_RECORD.reduce((s,d)=>s+d.rehab,0))}</td>
          <td class="num">${fmt(TRACK_RECORD.reduce((s,d)=>s+d.sold,0))}</td>
          <td class="num" style="color:#b91c1c;">${fmt(stats.totalProfit)}</td>
          <td class="num">${stats.avgTurnaround}d</td>
          <td class="num">${stats.avgDom}d</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ═══════════ PAGE 6: FAQ ═══════════ -->
  <div class="page-break">
    <div class="page-header">
      <img src="${LOGO_URL}" alt="Freedom One" />
      <span class="page-title">Frequently Asked Questions</span>
    </div>
    ${faqHtml}
  </div>

  <!-- ═══════════ PAGE 7: CONTACT & LEGAL ═══════════ -->
  <div class="page-break">
    <div class="page-header">
      <img src="${LOGO_URL}" alt="Freedom One" />
      <span class="page-title">Next Steps</span>
    </div>

    <div class="highlight-box" style="text-align:center; padding: 24px;">
      <strong style="font-size: 14pt;">Ready to Earn Secured Returns on Real Estate?</strong><br/><br/>
      <p style="font-size: 11pt; margin-bottom: 16px;">Contact us today to discuss current investment opportunities.</p>
      <p style="font-size: 12pt; font-weight: 600;">${contactDisplay}</p>
      <p>${companyDisplay}</p>
      <p>${phoneDisplay} &nbsp;|&nbsp; ${emailDisplay}</p>
      ${websiteDisplay ? `<p>${websiteDisplay}</p>` : ''}
    </div>

    ${ef.additionalNotes ? `<h2>Additional Information</h2><p>${ef.additionalNotes}</p>` : ''}

    <div class="doc-footer" style="margin-top: 40px;">
      <strong>Legal Notice</strong><br/>
      This material is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any security. All investments involve risk, including the potential loss of principal. Past performance is not indicative of future results. This publication is not intended as legal, tax, or investment advice. Consult with qualified professionals before making any investment decisions. Each investor should conduct their own due diligence and consult with their own legal, tax, and financial advisors.<br/><br/>
      © ${new Date().getFullYear()} ${companyDisplay}. All rights reserved.<br/>
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
  }, [effectiveFields, stats]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[oklch(0.92_0.06_25)]">
              <Landmark className="w-6 h-6 text-[oklch(0.50_0.18_25)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Private Money Prospectus</h1>
              <p className="text-sm text-muted-foreground">
                Professional investment brochure for private money lenders
              </p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Generate a professional, multi-page investment prospectus to present to potential private money lenders. 
            Customize with your company information and print as a branded brochure. Your profile information is auto-filled.
          </p>
          {!hasProfile && (
            <div className="mt-3 flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                <Link href="/profile" className="underline font-medium">Set up your profile</Link> to auto-fill your company information into the prospectus.
              </span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Main Content Preview */}
          <div className="space-y-6">
            <Tabs defaultValue="overview">
              <TabsList className="bg-[oklch(0.15_0_0)] border border-[oklch(0.3_0_0)]">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="track-record">Track Record</TabsTrigger>
                <TabsTrigger value="program">Investor Program</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              {/* ── Overview Tab ── */}
              <TabsContent value="overview" className="space-y-4 mt-4">
                <Card className="border-[oklch(0.3_0_0)] bg-[oklch(0.13_0_0)]">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-bold text-white mb-3">Investment Summary</h2>
                    <p className="text-sm text-[oklch(0.7_0_0)] leading-relaxed mb-4">
                      {effectiveFields.companyName || '[Your Company]'} specializes in acquiring distressed residential properties, 
                      completely renovating them to modern standards, and re-selling to local homeowners for a profit. 
                      We have developed and perfected a system that enables us to consistently find, fix, and flip 
                      residential properties for high returns.
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Completed Deals', value: stats.dealCount.toString(), icon: Building2 },
                        { label: 'Total Volume', value: fmt(stats.totalVolume), icon: DollarSign },
                        { label: 'Total Profit', value: fmt(stats.totalProfit), icon: TrendingUp },
                        { label: 'Avg Profit/Deal', value: fmt(stats.avgProfit), icon: BarChart3 },
                        { label: 'Avg Turnaround', value: `${stats.avgTurnaround} days`, icon: Clock },
                        { label: 'Avg DOM', value: `${stats.avgDom} days`, icon: MapPin },
                      ].map((s, i) => {
                        const Icon = s.icon;
                        return (
                          <div key={i} className="bg-[oklch(0.18_0_0)] border border-[oklch(0.25_0_0)] rounded-lg p-3 text-center">
                            <Icon className="w-4 h-4 mx-auto mb-1 text-[oklch(0.48_0.20_18)]" />
                            <p className="text-lg font-bold text-white">{s.value}</p>
                            <p className="text-[10px] text-[oklch(0.5_0_0)] uppercase tracking-wide">{s.label}</p>
                          </div>
                        );
                      })}
                    </div>

                    <h3 className="text-sm font-semibold text-white mb-2">Buy Price Formula</h3>
                    <div className="bg-[oklch(0.08_0_0)] rounded-lg p-4 font-mono text-xs text-[oklch(0.7_0_0)] leading-relaxed">
                      <span className="text-[oklch(0.65_0.18_18)]">After Repair Value (ARV)</span><br/>
                      − Profit (20%)<br/>
                      − Closing Costs (9%)<br/>
                      − Carrying Costs (6%)<br/>
                      − Repairs<br/>
                      ─────────────────────<br/>
                      = <span className="text-white font-bold">Maximum Purchase Price</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[oklch(0.3_0_0)] bg-[oklch(0.13_0_0)]">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-bold text-white mb-3">Renovation Standards</h2>
                    <p className="text-sm text-[oklch(0.7_0_0)] leading-relaxed mb-3">
                      We specialize in mid-level and high-end remodeled homes — "new construction" style remodels 
                      with updated electrical, plumbing, mechanical, roofing, and windows.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'New kitchens with granite & stainless steel',
                        'New bathrooms with ceramic tile',
                        'Updated HVAC, electrical & plumbing',
                        'New flooring & paint throughout',
                        'Landscaping & curb appeal',
                        'Modern fixtures & finishes',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[oklch(0.65_0_0)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[oklch(0.3_0_0)] bg-[oklch(0.13_0_0)]">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-[oklch(0.48_0.20_18)]" />
                      <h2 className="text-lg font-bold text-white">Investment Security</h2>
                    </div>
                    <div className="bg-[oklch(0.48_0.20_18)]/10 border border-[oklch(0.48_0.20_18)]/20 rounded-lg p-4">
                      <p className="text-sm text-[oklch(0.75_0_0)] leading-relaxed">
                        <strong className="text-white">Your capital is secured by real property.</strong> Each investor holds a 
                        1st or 2nd lien position in the property, recorded with the county. We provide weekly progress reports, 
                        financial updates, and renovation photographs. The property itself serves as your collateral.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Track Record Tab ── */}
              <TabsContent value="track-record" className="mt-4">
                <Card className="border-[oklch(0.3_0_0)] bg-[oklch(0.13_0_0)]">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-bold text-white mb-3">Completed Projects</h2>
                    <p className="text-sm text-[oklch(0.6_0_0)] mb-4">
                      Every property below was purchased at a discount, fully renovated, and sold at or near market value.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-[oklch(0.3_0_0)]">
                            <th className="text-left py-2 px-2 text-[oklch(0.5_0_0)] font-semibold uppercase text-[10px]">Property</th>
                            <th className="text-right py-2 px-2 text-[oklch(0.5_0_0)] font-semibold uppercase text-[10px]">Purchase</th>
                            <th className="text-right py-2 px-2 text-[oklch(0.5_0_0)] font-semibold uppercase text-[10px]">Rehab</th>
                            <th className="text-right py-2 px-2 text-[oklch(0.5_0_0)] font-semibold uppercase text-[10px]">Sold</th>
                            <th className="text-right py-2 px-2 text-[oklch(0.5_0_0)] font-semibold uppercase text-[10px]">Profit</th>
                            <th className="text-right py-2 px-2 text-[oklch(0.5_0_0)] font-semibold uppercase text-[10px]">Turn</th>
                            <th className="text-right py-2 px-2 text-[oklch(0.5_0_0)] font-semibold uppercase text-[10px]">DOM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {TRACK_RECORD.map((d, i) => (
                            <tr key={i} className="border-b border-[oklch(0.2_0_0)] hover:bg-[oklch(0.18_0_0)]">
                              <td className="py-1.5 px-2 text-white font-medium">{d.address}</td>
                              <td className="py-1.5 px-2 text-right text-[oklch(0.65_0_0)] font-mono">{fmt(d.purchase)}</td>
                              <td className="py-1.5 px-2 text-right text-[oklch(0.65_0_0)] font-mono">{fmt(d.rehab)}</td>
                              <td className="py-1.5 px-2 text-right text-[oklch(0.65_0_0)] font-mono">{fmt(d.sold)}</td>
                              <td className="py-1.5 px-2 text-right text-emerald-400 font-mono font-semibold">{fmt(d.profit)}</td>
                              <td className="py-1.5 px-2 text-right text-[oklch(0.55_0_0)]">{d.turnaround}d</td>
                              <td className="py-1.5 px-2 text-right text-[oklch(0.55_0_0)]">{d.dom}d</td>
                            </tr>
                          ))}
                          <tr className="bg-[oklch(0.48_0.20_18)]/10 font-bold">
                            <td className="py-2 px-2 text-white">TOTALS / AVG</td>
                            <td className="py-2 px-2 text-right text-white font-mono">{fmt(TRACK_RECORD.reduce((s,d)=>s+d.purchase,0))}</td>
                            <td className="py-2 px-2 text-right text-white font-mono">{fmt(TRACK_RECORD.reduce((s,d)=>s+d.rehab,0))}</td>
                            <td className="py-2 px-2 text-right text-white font-mono">{fmt(TRACK_RECORD.reduce((s,d)=>s+d.sold,0))}</td>
                            <td className="py-2 px-2 text-right text-[oklch(0.65_0.18_18)] font-mono">{fmt(stats.totalProfit)}</td>
                            <td className="py-2 px-2 text-right text-white">{stats.avgTurnaround}d</td>
                            <td className="py-2 px-2 text-right text-white">{stats.avgDom}d</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Investor Program Tab ── */}
              <TabsContent value="program" className="mt-4 space-y-4">
                <Card className="border-[oklch(0.3_0_0)] bg-[oklch(0.13_0_0)]">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-bold text-white mb-4">Private Investor Program — 6-Step Process</h2>
                    <div className="space-y-4">
                      {[
                        { num: 1, title: 'Deal Presentation', desc: 'We present the investor with a complete breakdown: purchase price, renovation cost, expected sales price, turnaround time, comparable sold comps, and as-is photos.' },
                        { num: 2, title: 'Legal Documentation', desc: 'Promissory Note, Mortgage, Personal Guarantee, Business Affidavit, and Agreement to Change — all reviewed, signed, notarized, and originals sent to the investor.' },
                        { num: 3, title: 'Closing & Funding', desc: 'Investor receives closing statement, wiring instructions, and insurance certificate. Funds wire to title company. Mortgage recorded with county.' },
                        { num: 4, title: 'Renovation & Draw Requests', desc: 'Renovations begin immediately. Draw requests include breakdown of money spent, photos of completed work, and amount requested.' },
                        { num: 5, title: 'Monthly Interest Payments', desc: 'Interest-only payments mailed monthly based on pro-rated outstanding balance (purchase amount plus draws).' },
                        { num: 6, title: 'Sale & Payoff', desc: 'Investor provides payoff letter. Title company sends proceeds directly to investor at closing — investor is made whole.' },
                      ].map(step => (
                        <div key={step.num} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-[oklch(0.48_0.20_18)] text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {step.num}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                            <p className="text-xs text-[oklch(0.6_0_0)] leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── FAQ Tab ── */}
              <TabsContent value="faq" className="mt-4">
                <Card className="border-[oklch(0.3_0_0)] bg-[oklch(0.13_0_0)]">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-2">
                      {FAQ_ITEMS.map((faq, i) => (
                        <div key={i} className="border border-[oklch(0.25_0_0)] rounded-lg overflow-hidden">
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                            className="w-full text-left p-3 flex items-center justify-between hover:bg-[oklch(0.18_0_0)] transition-colors"
                          >
                            <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                            {expandedFaq === i ? (
                              <ChevronUp className="w-4 h-4 text-[oklch(0.5_0_0)] shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[oklch(0.5_0_0)] shrink-0" />
                            )}
                          </button>
                          {expandedFaq === i && (
                            <div className="px-3 pb-3 text-sm text-[oklch(0.65_0_0)] leading-relaxed border-t border-[oklch(0.2_0_0)] pt-2">
                              {faq.a}
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
                  Customize Your Prospectus
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
                    <Input value={effectiveFields.companyName} onChange={e => updateField('companyName', e.target.value)} placeholder="Freedom One Investments" className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                  </div>
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Contact Name</Label>
                    <Input value={effectiveFields.contactName} onChange={e => updateField('contactName', e.target.value)} placeholder="Your Name" className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-[oklch(0.6_0_0)]">Phone</Label>
                      <Input value={effectiveFields.phone} onChange={e => updateField('phone', e.target.value)} placeholder="(555) 123-4567" className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                    </div>
                    <div>
                      <Label className="text-xs text-[oklch(0.6_0_0)]">Email</Label>
                      <Input value={effectiveFields.email} onChange={e => updateField('email', e.target.value)} placeholder="you@company.com" className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Website</Label>
                    <Input value={effectiveFields.website} onChange={e => updateField('website', e.target.value)} placeholder="www.yourcompany.com" className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                  </div>
                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Market Area</Label>
                    <Input value={effectiveFields.marketArea} onChange={e => updateField('marketArea', e.target.value)} placeholder="Metro Detroit, MI" className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                  </div>

                  <div className="pt-2 border-t border-[oklch(0.25_0_0)]">
                    <p className="text-[10px] text-[oklch(0.5_0_0)] uppercase tracking-wide mb-2">Investment Terms</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-[oklch(0.6_0_0)]">Interest Rate</Label>
                        <Input value={fields.interestRate} onChange={e => updateField('interestRate', e.target.value)} className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                      </div>
                      <div>
                        <Label className="text-xs text-[oklch(0.6_0_0)]">Max LTV</Label>
                        <Input value={fields.ltvMax} onChange={e => updateField('ltvMax', e.target.value)} className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <Label className="text-xs text-[oklch(0.6_0_0)]">Turnaround (days)</Label>
                        <Input value={fields.turnaroundDays} onChange={e => updateField('turnaroundDays', e.target.value)} className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                      </div>
                      <div>
                        <Label className="text-xs text-[oklch(0.6_0_0)]">Avg Profit</Label>
                        <Input value={fields.avgProfit} onChange={e => updateField('avgProfit', e.target.value)} className="h-8 text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-[oklch(0.6_0_0)]">Additional Notes</Label>
                    <Textarea value={fields.additionalNotes} onChange={e => updateField('additionalNotes', e.target.value)} placeholder="Any additional information for investors..." className="text-xs bg-[oklch(0.18_0_0)] border-[oklch(0.3_0_0)] text-white min-h-[60px]" />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Button onClick={handlePrint} className="w-full gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
                    <Printer className="w-4 h-4" /> Print Brochure (7 pages)
                  </Button>
                  <p className="text-[10px] text-[oklch(0.45_0_0)] text-center">
                    Opens a print-ready multi-page brochure. Use "Save as PDF" in the print dialog to create a PDF file.
                  </p>
                </div>

                <div className="mt-3 flex items-start gap-2 text-xs text-[oklch(0.5_0_0)] bg-[oklch(0.15_0_0)] border border-[oklch(0.25_0_0)] rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <p>
                    This prospectus is for informational purposes only and does not constitute a securities offering. 
                    Consult with a securities attorney before soliciting investments. Laws vary by jurisdiction.
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
