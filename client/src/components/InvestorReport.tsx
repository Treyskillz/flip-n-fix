import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/calculations';
import type { SubjectProperty, CompProperty, ProfitAnalysis, FinancingDetails, ClosingCosts, HoldingCosts } from '@/lib/types';
import { calculateRoomCost, type RoomScope, type MaterialTier } from '@/lib/scopeOfWork';
import { FileText, Mail, Download, Printer, Building2, TrendingUp, DollarSign, Clock, Share2, Link2, Check, Copy } from 'lucide-react';
import { useState, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useBranding, type BrandingConfig, buildBrandedFooterHtml } from '@/lib/branding';

interface Props {
  property: SubjectProperty;
  profit: ProfitAnalysis;
  financing: FinancingDetails;
  closing: ClosingCosts;
  holding: HoldingCosts;
  effectiveArv: number;
  rehabTotals: { totalMaterials: number; totalLabor: number; totalCost: number; totalDurationDays: number };
  materialTier: string;
  targetROI: number;
  comps?: CompProperty[];
  roomScopes?: RoomScope[];
  regionalLabel?: string;
  materialTierKey?: MaterialTier;
  materialsFactor?: number;
  laborFactor?: number;
  photos?: { url: string; caption?: string | null }[];
  branding?: BrandingConfig;
}

function buildPdfHtml(props: Props): string {
  const b = props.branding;
  const { property, profit, financing, closing, holding, effectiveArv, rehabTotals, materialTier, targetROI, comps, roomScopes, regionalLabel, materialTierKey, materialsFactor, laborFactor } = props;

  const financingCost = financing.useHardMoney ? (financing.totalInterest + financing.totalPoints) : 0;
  const totalInvestment = property.purchasePrice + rehabTotals.totalCost +
    financingCost + closing.buyClosingAmount + holding.totalHoldingCosts;
  const addr = `${property.address}, ${property.city}, ${property.state} ${property.zip}`;
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const verdictClass = profit.dealVerdict === 'excellent' || profit.dealVerdict === 'good'
    ? 'verdict-good' : profit.dealVerdict === 'marginal' ? 'verdict-marginal' : 'verdict-poor';
  const verdictColor = profit.dealVerdict === 'excellent' || profit.dealVerdict === 'good'
    ? '#16a34a' : profit.dealVerdict === 'marginal' ? '#ca8a04' : '#dc2626';

  // Build comp rows
  let compTableHtml = '';
  if (comps && comps.length > 0) {
    const compRows = comps.map(c => `
      <tr>
        <td>${c.address}</td>
        <td style="text-align:right">${formatCurrency(c.salePrice)}</td>
        <td style="text-align:right">${c.sqft ? c.sqft.toLocaleString() : '—'}</td>
        <td style="text-align:right">${c.sqft ? '$' + Math.round(c.salePrice / c.sqft).toLocaleString() : '—'}</td>
        <td style="text-align:right">${c.beds}/${c.baths}</td>
        <td style="text-align:right">${c.daysOnMarket || '—'} DOM</td>
      </tr>
    `).join('');

    const avgPsf = comps.filter(c => c.sqft > 0).reduce((s, c) => s + c.salePrice / c.sqft, 0) / comps.filter(c => c.sqft > 0).length;

    compTableHtml = `
      <div class="section">
        <h2>Market Validation — Comparable Retail Sales (${comps.length} Comp${comps.length > 1 ? 's' : ''})</h2>
        <p style="font-size:12px; color:#666; margin-bottom:8px;">Standard retail (arms-length) sales only — no foreclosures, short sales, REO, or auction properties.</p>
        <table>
          <thead>
            <tr><th>Address</th><th style="text-align:right">Sale Price</th><th style="text-align:right">Sq Ft</th><th style="text-align:right">$/Sq Ft</th><th style="text-align:right">Bd/Ba</th><th style="text-align:right">DOM</th></tr>
          </thead>
          <tbody>${compRows}</tbody>
        </table>
        <div style="margin-top:8px; padding:10px; background:#f0f9ff; border-radius:6px; display:flex; justify-content:space-between; font-size:13px;">
          <span><strong>Avg $/Sq Ft:</strong> $${Math.round(avgPsf).toLocaleString()}</span>
          <span><strong>Subject Sq Ft:</strong> ${property.sqft.toLocaleString()}</span>
          <span><strong>Market Validation ARV:</strong> <span style="color:#c53030; font-weight:700">${formatCurrency(Math.round(avgPsf * property.sqft))}</span></span>
        </div>
      </div>
    `;
  }

  // Build rehab breakdown
  let rehabTableHtml = '';
  if (roomScopes && roomScopes.length > 0) {
    const activeRooms = roomScopes.filter(r => r.condition !== 'none');
    if (activeRooms.length > 0) {
      const tier = materialTierKey || 'standard';
      const mFactor = materialsFactor || 1;
      const lFactor = laborFactor || 1;
      const rehabRows = activeRooms.map(r => {
        const roomCost = calculateRoomCost(r, tier, property.sqft, property.baths, property.beds, mFactor, lFactor);
        const mat = roomCost.totalMaterials;
        const lab = roomCost.totalLabor;
        return `
          <tr>
            <td>${r.icon} ${r.name}</td>
            <td style="text-align:center"><span class="condition-badge condition-${r.condition}">${r.condition}</span></td>
            <td style="text-align:right">${formatCurrency(mat)}</td>
            <td style="text-align:right">${formatCurrency(lab)}</td>
            <td style="text-align:right; font-weight:600">${formatCurrency(mat + lab)}</td>
          </tr>
        `;
      }).join('');

      rehabTableHtml = `
        <div class="section">
          <h2>Room-by-Room Rehab Breakdown</h2>
          ${regionalLabel && regionalLabel !== 'National Average' ? `<p style="font-size:12px; color:#666; margin-bottom:8px;">📍 Costs adjusted for <strong>${regionalLabel}</strong> market</p>` : ''}
          <table>
            <thead>
              <tr><th>Room / Area</th><th style="text-align:center">Condition</th><th style="text-align:right">Materials</th><th style="text-align:right">Labor</th><th style="text-align:right">Total</th></tr>
            </thead>
            <tbody>${rehabRows}</tbody>
            <tfoot>
              <tr style="background:#f5f5f5; font-weight:700">
                <td colspan="2">TOTAL REHAB</td>
                <td style="text-align:right">${formatCurrency(rehabTotals.totalMaterials)}</td>
                <td style="text-align:right">${formatCurrency(rehabTotals.totalLabor)}</td>
                <td style="text-align:right; color:#c53030">${formatCurrency(rehabTotals.totalCost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
    }
  }

  // Financing section
  let financingHtml = '';
  if (financing.useHardMoney) {
    financingHtml = `
      <div class="section">
        <h2>Financing Details</h2>
        <div class="grid">
          <div class="stat"><div class="stat-label">Loan Type</div><div class="stat-value" style="font-size:16px">Hard Money</div></div>
          <div class="stat"><div class="stat-label">LTV</div><div class="stat-value" style="font-size:16px">${financing.loanToValue}%</div></div>
          <div class="stat"><div class="stat-label">Interest Rate</div><div class="stat-value" style="font-size:16px">${financing.interestRate}%</div></div>
          <div class="stat"><div class="stat-label">Points</div><div class="stat-value" style="font-size:16px">${financing.points}</div></div>
        </div>
        <table style="margin-top:12px">
          <tr><td>Loan Amount</td><td style="text-align:right">${formatCurrency(financing.loanAmount)}</td></tr>
          <tr><td>Down Payment</td><td style="text-align:right">${formatCurrency(financing.downPayment)}</td></tr>
          <tr><td>Monthly Interest</td><td style="text-align:right">${formatCurrency(financing.monthlyInterest)}</td></tr>
          <tr><td>Total Interest (${financing.holdingMonths} mo)</td><td style="text-align:right">${formatCurrency(financing.totalInterest)}</td></tr>
          <tr><td>Points Cost</td><td style="text-align:right">${formatCurrency(financing.totalPoints)}</td></tr>
          <tr style="background:#f5f5f5"><td style="font-weight:700">Total Financing Cost</td><td style="text-align:right; font-weight:700">${formatCurrency(financingCost)}</td></tr>
        </table>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <title>Investment Analysis — ${addr}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 40px; line-height: 1.5; max-width: 900px; margin: 0 auto; }
    .report-header { display: flex; align-items: center; gap: 20px; border-bottom: 3px solid ${b?.brandColor || '#c53030'}; padding-bottom: 20px; margin-bottom: 30px; }
    .report-header .logo { height: 50px; }
    .report-header .header-text { flex: 1; }
    .report-header h1 { font-size: 24px; color: ${b?.brandColor || '#c53030'}; margin-bottom: 2px; letter-spacing: 1px; }
    .report-header .subtitle { font-size: 16px; font-weight: 600; color: #333; }
    .report-header .meta { font-size: 12px; color: #888; margin-top: 4px; }
    .section { margin-bottom: 28px; page-break-inside: avoid; }
    .section h2 { font-size: 16px; color: ${b?.brandColor || '#c53030'}; border-bottom: 2px solid #e5e5e5; padding-bottom: 6px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; }
    .stat { padding: 12px; background: #f9f9f9; border-radius: 6px; border-left: 3px solid #e5e5e5; }
    .stat-accent { border-left-color: ${b?.brandColor || '#c53030'}; }
    .stat-green { border-left-color: #16a34a; }
    .stat-label { font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; font-weight: 600; }
    .stat-value { font-size: 18px; font-weight: 700; margin-top: 2px; }
    .profit-positive { color: #16a34a; }
    .profit-negative { color: #dc2626; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f5f5f5; font-weight: 600; text-transform: uppercase; font-size: 10px; color: #666; letter-spacing: 0.5px; }
    .condition-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
    .condition-cosmetic { background: #dbeafe; color: #1e40af; }
    .condition-moderate { background: #fef3c7; color: #92400e; }
    .condition-full { background: #fee2e2; color: #991b1b; }
    .condition-gut { background: #fecaca; color: #7f1d1d; }
    .verdict-box { padding: 20px; border-radius: 8px; text-align: center; margin-top: 20px; page-break-inside: avoid; }
    .verdict-good { background: #f0fdf4; border: 2px solid #16a34a; }
    .verdict-marginal { background: #fffbeb; border: 2px solid #ca8a04; }
    .verdict-poor { background: #fef2f2; border: 2px solid #dc2626; }
    .verdict-label { font-size: 22px; font-weight: 800; }
    .highlight-row { background: #fff7ed; }
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .summary-card { padding: 16px; background: #f9f9f9; border-radius: 8px; text-align: center; border: 1px solid #e5e5e5; }
    .summary-card .big-num { font-size: 28px; font-weight: 800; }
    .summary-card .label { font-size: 11px; text-transform: uppercase; color: #888; margin-bottom: 4px; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 2px solid #e5e5e5; padding-top: 16px; }
    @media print { body { padding: 20px; } .section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="report-header">
    ${b?.logoUrl ? `<img src="${b.logoUrl}" alt="${b.companyName}" class="logo" onerror="this.style.display='none'" />` : ''}
    <div class="header-text">
      <h1>INVESTMENT ANALYSIS REPORT</h1>
      <div class="subtitle">${addr}</div>
      <div class="meta">Generated ${dateStr} | Material Tier: ${materialTier.charAt(0).toUpperCase() + materialTier.slice(1)} Grade${regionalLabel && regionalLabel !== 'National Average' ? ` | Market: ${regionalLabel}` : ''}</div>
    </div>
    ${b && (b.phone || b.email || b.website) ? `<div style="text-align:right;font-size:10px;color:#888;line-height:1.6;">${[b.phone, b.email, b.website].filter(Boolean).join('<br/>')}</div>` : ''}
  </div>

  <!-- Executive Summary -->
  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">Purchase Price</div>
      <div class="big-num">${formatCurrency(property.purchasePrice)}</div>
    </div>
    <div class="summary-card">
      <div class="label">After Repair Value</div>
      <div class="big-num" style="color:#c53030">${formatCurrency(effectiveArv)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Net Profit</div>
      <div class="big-num ${profit.netProfit >= 0 ? 'profit-positive' : 'profit-negative'}">${formatCurrency(profit.netProfit)}</div>
    </div>
  </div>

  <!-- Property Details -->
  <div class="section">
    <h2>Property Details</h2>
    <div class="grid-4">
      <div class="stat"><div class="stat-label">Property Type</div><div class="stat-value" style="font-size:15px">${property.propertyType}</div></div>
      <div class="stat"><div class="stat-label">Beds / Baths</div><div class="stat-value" style="font-size:15px">${property.beds} BD / ${property.baths} BA</div></div>
      <div class="stat"><div class="stat-label">Square Footage</div><div class="stat-value" style="font-size:15px">${property.sqft.toLocaleString()} sqft</div></div>
      <div class="stat"><div class="stat-label">Year Built</div><div class="stat-value" style="font-size:15px">${property.yearBuilt}</div></div>
    </div>
    ${property.lotSizeSqft ? `<div style="margin-top:8px; font-size:12px; color:#666;">Lot Size: ${property.lotSizeSqft.toLocaleString()} sqft | Garage: ${property.garage}</div>` : ''}
  </div>

  <!-- Comparable Sales -->
  ${compTableHtml}

  <!-- Rehab Breakdown -->
  ${rehabTableHtml || `
    <div class="section">
      <h2>Rehab Summary</h2>
      <div class="grid">
        <div class="stat stat-accent"><div class="stat-label">Materials</div><div class="stat-value">${formatCurrency(rehabTotals.totalMaterials)}</div></div>
        <div class="stat stat-accent"><div class="stat-label">Labor</div><div class="stat-value">${formatCurrency(rehabTotals.totalLabor)}</div></div>
      </div>
      <div style="margin-top:10px; padding:12px; background:#fff7ed; border-radius:6px; text-align:center;">
        <span style="font-size:12px; color:#888;">Total Rehab Cost</span><br/>
        <span style="font-size:24px; font-weight:800; color:#c53030;">${formatCurrency(rehabTotals.totalCost)}</span>
        <span style="font-size:13px; color:#666; margin-left:12px;">(${rehabTotals.totalDurationDays} days)</span>
      </div>
    </div>
  `}

  <!-- Financial Summary -->
  <div class="section">
    <h2>Investment Summary</h2>
    <table>
      <tr><td>Purchase Price</td><td style="text-align:right; font-weight:600">${formatCurrency(property.purchasePrice)}</td></tr>
      <tr><td>Rehab Cost (Materials + Labor)</td><td style="text-align:right; font-weight:600">${formatCurrency(rehabTotals.totalCost)}</td></tr>
      <tr><td>Financing Costs</td><td style="text-align:right">${formatCurrency(financingCost)}</td></tr>
      <tr><td>Closing Costs (Buy ${closing.buyClosingPct}% + Sell ${closing.sellClosingPct}%)</td><td style="text-align:right">${formatCurrency(closing.totalClosingCosts)}</td></tr>
      <tr><td>Holding Costs (${financing.holdingMonths} months)</td><td style="text-align:right">${formatCurrency(holding.totalHoldingCosts)}</td></tr>
      <tr style="background:#f5f5f5"><td style="font-weight:700; font-size:14px">Total Investment</td><td style="text-align:right; font-weight:700; font-size:14px">${formatCurrency(totalInvestment)}</td></tr>
      <tr class="highlight-row"><td style="font-weight:700; font-size:14px">After Repair Value (ARV)</td><td style="text-align:right; font-weight:700; font-size:14px; color:#c53030">${formatCurrency(effectiveArv)}</td></tr>
    </table>
  </div>

  ${financingHtml}

  <!-- Profitability Analysis -->
  <div class="section">
    <h2>Profitability Analysis</h2>
    <div class="grid">
      <div class="stat stat-accent"><div class="stat-label">Net Profit</div><div class="stat-value ${profit.netProfit >= 0 ? 'profit-positive' : 'profit-negative'}">${formatCurrency(profit.netProfit)}</div></div>
      <div class="stat stat-accent"><div class="stat-label">Return on Investment</div><div class="stat-value ${profit.roi >= 0 ? 'profit-positive' : 'profit-negative'}">${profit.roi.toFixed(1)}%</div></div>
      <div class="stat"><div class="stat-label">Cash-on-Cash Return</div><div class="stat-value ${profit.cashOnCash >= 0 ? 'profit-positive' : 'profit-negative'}" style="font-size:16px">${profit.cashOnCash.toFixed(1)}%</div></div>
      <div class="stat"><div class="stat-label">Deal Score</div><div class="stat-value" style="font-size:16px">${profit.dealScore}/100</div></div>
      <div class="stat"><div class="stat-label">70% Rule MAO</div><div class="stat-value" style="font-size:16px">${formatCurrency(profit.maxAllowableOffer)}</div></div>
      <div class="stat"><div class="stat-label">Max Price for ${targetROI}% ROI</div><div class="stat-value" style="font-size:16px">${formatCurrency(profit.recommendedMaxPrice)}</div></div>
    </div>
  </div>

  <!-- Timeline -->
  <div class="section">
    <h2>Project Timeline</h2>
    <div class="grid">
      <div class="stat stat-green"><div class="stat-label">Rehab Duration</div><div class="stat-value" style="font-size:16px">${rehabTotals.totalDurationDays} days (${Math.ceil(rehabTotals.totalDurationDays / 7)} weeks)</div></div>
      <div class="stat"><div class="stat-label">Hold Period</div><div class="stat-value" style="font-size:16px">${financing.holdingMonths} months</div></div>
    </div>
  </div>

  <!-- Property Photos -->
  ${props.photos && props.photos.length > 0 ? `
  <div class="section">
    <h2>Property Photos</h2>
    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px;">
      ${props.photos.map(p => `
        <div style="text-align:center;">
          <img src="${p.url}" style="width:100%; max-height:200px; object-fit:cover; border-radius:6px; border:1px solid #e5e7eb;" />
          ${p.caption ? `<p style="font-size:11px; color:#666; margin-top:4px;">${p.caption}</p>` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- Verdict -->
  <div class="verdict-box ${verdictClass}">
    <div class="verdict-label" style="color:${verdictColor}">${profit.dealVerdict.toUpperCase().replace('_', ' ')}</div>
    <p style="margin-top:8px; font-size:14px; color:#333">${profit.verdictReasons[0] || ''}</p>
    ${profit.verdictReasons.length > 1 ? `<p style="margin-top:4px; font-size:12px; color:#666">${profit.verdictReasons.slice(1).join(' • ')}</p>` : ''}
  </div>

  <div class="footer">
    <p><strong>${b?.footerText || 'Real Estate Investment Analysis'}</strong></p>
    <p style="margin-top:4px">${b?.disclaimerText || 'This report is for informational purposes only. All projections are estimates based on user-provided data and generalized assumptions. Actual results may vary. Always perform independent due diligence and consult with qualified professionals before making investment decisions.'}</p>
  </div>
</body>
</html>`;
}

export function InvestorReport(props: Props) {
  const {
    property, profit, financing, closing, holding,
    effectiveArv, rehabTotals, materialTier, targetROI,
    comps, roomScopes, regionalLabel,
  } = props;

  const { branding } = useBranding();

  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const shareMutation = trpc.shareDeal.create.useMutation({
    onSuccess: (data) => {
      const url = `${window.location.origin}/shared/${data.shareId}`;
      setShareUrl(url);
      setShowShareDialog(true);
    },
    onError: () => {
      toast.error('Failed to create shareable link. Please try again.');
    },
  });

  const handleShare = () => {
    const dealData = JSON.stringify({
      property,
      profit,
      financing,
      closing,
      holding,
      effectiveArv,
      rehabTotals,
      materialTier,
      targetROI,
      comps: comps || [],
      roomScopes: roomScopes?.filter(r => r.condition !== 'none') || [],
      regionalLabel,
      photos: props.photos || [],
    });
    const addr = `${property.address}, ${property.city}, ${property.state} ${property.zip}`;
    shareMutation.mutate({ dealData, propertyAddress: addr });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const financingCost = financing.useHardMoney ? (financing.totalInterest + financing.totalPoints) : 0;
  const totalInvestment = property.purchasePrice + rehabTotals.totalCost +
    financingCost + closing.buyClosingAmount + holding.totalHoldingCosts;

  const generateEmailContent = () => {
    const addr = `${property.address}, ${property.city}, ${property.state} ${property.zip}`;
    setEmailSubject(`Investment Opportunity: ${addr}`);
    setEmailBody(
`Dear Investor,

I am presenting an investment opportunity for your review:

PROPERTY: ${addr}
TYPE: ${property.propertyType} | ${property.beds} BD / ${property.baths} BA | ${property.sqft.toLocaleString()} sqft | Built ${property.yearBuilt}

FINANCIAL SUMMARY:
• Purchase Price: ${formatCurrency(property.purchasePrice)}
• Rehab Budget: ${formatCurrency(rehabTotals.totalCost)} (Materials: ${formatCurrency(rehabTotals.totalMaterials)} + Labor: ${formatCurrency(rehabTotals.totalLabor)})
• After Repair Value (ARV): ${formatCurrency(effectiveArv)}
• Total Investment: ${formatCurrency(totalInvestment)}
• Projected Net Profit: ${formatCurrency(profit.netProfit)}
• Return on Investment: ${profit.roi.toFixed(1)}%
• Deal Score: ${profit.dealScore}/100
• Rehab Duration: ${rehabTotals.totalDurationDays} days
${comps && comps.length > 0 ? `\nCOMPARABLE SALES (${comps.length}):\n${comps.map(c => `• ${c.address}: ${formatCurrency(c.salePrice)} (${c.sqft ? '$' + Math.round(c.salePrice / c.sqft) + '/sqft' : 'N/A'})`).join('\n')}` : ''}

DEAL ANALYSIS:
• 70% Rule MAO: ${formatCurrency(profit.maxAllowableOffer)}
• Material Tier: ${materialTier.charAt(0).toUpperCase() + materialTier.slice(1)}
• Deal Verdict: ${profit.dealVerdict.toUpperCase().replace('_', ' ')}
• Notes: ${profit.verdictReasons.join('; ')}

I would welcome the opportunity to discuss this deal further and answer any questions you may have.

Best regards`
    );
    setShowEmailDialog(true);
  };

  const handlePrint = () => {
    const html = buildPdfHtml({ ...props, branding });
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const html = buildPdfHtml({ ...props, branding });
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    // Auto-trigger print for PDF save
    setTimeout(() => printWindow.print(), 500);
  };

  const handleSendEmail = () => {
    const mailtoLink = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const verdictColor = profit.dealVerdict === 'excellent' || profit.dealVerdict === 'good'
    ? 'text-green-600' : profit.dealVerdict === 'marginal' ? 'text-amber-600' : 'text-red-600';

  return (
    <Card className="border-l-4 border-l-[oklch(0.50_0.18_25)]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-[oklch(0.50_0.18_25)]" />
          Investor Presentation Report
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Professional PDF with property details, comp analysis, rehab breakdown, financing, and deal scoring
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Preview */}
        <div ref={reportRef} className="space-y-3 p-4 rounded-lg bg-secondary/40">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Building2 className="w-4 h-4" />
            {property.address || 'Enter property address'}, {property.city} {property.state} {property.zip}
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Purchase</p>
                <p className="font-bold">{formatCurrency(property.purchasePrice)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">ARV</p>
                <p className="font-bold">{formatCurrency(effectiveArv)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Net Profit</p>
                <p className={`font-bold ${profit.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(profit.netProfit)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Rehab</p>
                <p className="font-bold">{rehabTotals.totalDurationDays} days</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-border/50">
            <div className="text-center">
              <p className="text-muted-foreground">Score</p>
              <p className="font-bold">{profit.dealScore}/100</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">ROI</p>
              <p className={`font-bold ${profit.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>{profit.roi.toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Comps</p>
              <p className="font-bold">{comps?.length || 0}</p>
            </div>
          </div>
          <div className={`text-center text-sm font-bold ${verdictColor} pt-2 border-t border-border/50`}>
            VERDICT: {profit.dealVerdict.toUpperCase().replace('_', ' ')} — ROI: {profit.roi.toFixed(1)}%
          </div>
        </div>

        {/* PDF includes note */}
        <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg">
          <strong>PDF Report includes:</strong> Executive summary, property details, {comps && comps.length > 0 ? `${comps.length} comparable sales, ` : ''}
          {roomScopes && roomScopes.filter(r => r.condition !== 'none').length > 0 ? 'room-by-room rehab breakdown, ' : 'rehab summary, '}
          {financing.useHardMoney ? 'financing details, ' : ''}
          investment summary, profitability analysis, deal scoring, and verdict.
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Print PDF
          </Button>
          <Button onClick={handleDownload} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button onClick={handleShare} variant="outline" className="gap-2" disabled={shareMutation.isPending}>
            <Share2 className="w-4 h-4" />
            {shareMutation.isPending ? 'Creating...' : 'Share Link'}
          </Button>
        </div>

        {/* Share Link Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-[oklch(0.50_0.18_25)]" />
                Shareable Deal Link
              </DialogTitle>
              <DialogDescription>
                Anyone with this link can view the deal analysis. Link expires in 30 days.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="text-xs font-mono" />
                <Button onClick={handleCopyLink} variant="outline" size="icon" className="shrink-0">
                  {shareCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                This link includes the full deal analysis: property details, comps, rehab breakdown, financing, and profit projections.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Email Dialog */}
        <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
          <DialogTrigger asChild>
            <Button onClick={generateEmailContent} className="w-full gap-2">
              <Mail className="w-4 h-4" />
              Email to Investor / Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Email Investor Report</DialogTitle>
              <DialogDescription>
                Send this deal analysis to a potential investor or gap funding partner.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">To (Email Address)</Label>
                <Input
                  type="email"
                  placeholder="investor@example.com"
                  value={emailTo}
                  onChange={e => setEmailTo(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Subject</Label>
                <Input
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Message</Label>
                <Textarea
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  rows={12}
                  className="text-xs font-mono"
                />
              </div>
              <Button onClick={handleSendEmail} className="w-full gap-2" disabled={!emailTo}>
                <Mail className="w-4 h-4" />
                {emailSent ? 'Opening Email Client...' : 'Send via Email Client'}
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">
                This will open your default email client with the report pre-filled.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
