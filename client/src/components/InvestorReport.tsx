import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/calculations';
import type { SubjectProperty, ProfitAnalysis, FinancingDetails, ClosingCosts, HoldingCosts } from '@/lib/types';
import { FileText, Mail, Download, Printer, Building2, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useState, useRef } from 'react';

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
}

export function InvestorReport({
  property, profit, financing, closing, holding,
  effectiveArv, rehabTotals, materialTier, targetROI,
}: Props) {
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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
• Rehab Duration: ${rehabTotals.totalDurationDays} days

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

  const handleSendEmail = () => {
    const mailtoLink = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handlePrint = () => {
    const printContent = reportRef.current;
    if (!printContent) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Investor Report — ${property.address}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 40px; line-height: 1.5; }
          .report-header { text-align: center; border-bottom: 3px solid #c53030; padding-bottom: 20px; margin-bottom: 30px; }
          .report-header h1 { font-size: 28px; color: #c53030; margin-bottom: 4px; }
          .report-header p { color: #666; font-size: 14px; }
          .section { margin-bottom: 24px; }
          .section h2 { font-size: 18px; color: #c53030; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; margin-bottom: 12px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .stat { padding: 12px; background: #f9f9f9; border-radius: 6px; }
          .stat-label { font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; }
          .stat-value { font-size: 20px; font-weight: 700; margin-top: 2px; }
          .profit-positive { color: #16a34a; }
          .profit-negative { color: #dc2626; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #eee; }
          th { background: #f5f5f5; font-weight: 600; text-transform: uppercase; font-size: 11px; color: #666; }
          .verdict-box { padding: 16px; border-radius: 8px; text-align: center; margin-top: 20px; }
          .verdict-excellent, .verdict-good { background: #f0fdf4; border: 2px solid #16a34a; }
          .verdict-marginal { background: #fffbeb; border: 2px solid #ca8a04; }
          .verdict-poor, .verdict-avoid { background: #fef2f2; border: 2px solid #dc2626; }
          .verdict-label { font-size: 22px; font-weight: 800; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 16px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>INVESTMENT ANALYSIS REPORT</h1>
          <p>${property.address}, ${property.city}, ${property.state} ${property.zip}</p>
          <p style="font-size:12px; margin-top:4px;">Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div class="section">
          <h2>Property Details</h2>
          <div class="grid">
            <div class="stat"><div class="stat-label">Property Type</div><div class="stat-value" style="font-size:16px">${property.propertyType}</div></div>
            <div class="stat"><div class="stat-label">Year Built</div><div class="stat-value" style="font-size:16px">${property.yearBuilt}</div></div>
            <div class="stat"><div class="stat-label">Beds / Baths</div><div class="stat-value" style="font-size:16px">${property.beds} BD / ${property.baths} BA</div></div>
            <div class="stat"><div class="stat-label">Square Footage</div><div class="stat-value" style="font-size:16px">${property.sqft.toLocaleString()} sqft</div></div>
          </div>
        </div>

        <div class="section">
          <h2>Financial Summary</h2>
          <table>
            <tr><td>Purchase Price</td><td style="text-align:right; font-weight:600">${formatCurrency(property.purchasePrice)}</td></tr>
            <tr><td>Rehab Cost (Materials)</td><td style="text-align:right">${formatCurrency(rehabTotals.totalMaterials)}</td></tr>
            <tr><td>Rehab Cost (Labor)</td><td style="text-align:right">${formatCurrency(rehabTotals.totalLabor)}</td></tr>
            <tr><td>Total Rehab</td><td style="text-align:right; font-weight:600">${formatCurrency(rehabTotals.totalCost)}</td></tr>
            <tr><td>Financing Costs</td><td style="text-align:right">${formatCurrency(financingCost)}</td></tr>
            <tr><td>Closing Costs (Buy + Sell)</td><td style="text-align:right">${formatCurrency(closing.totalClosingCosts)}</td></tr>
            <tr><td>Holding Costs</td><td style="text-align:right">${formatCurrency(holding.totalHoldingCosts)}</td></tr>
            <tr style="background:#f5f5f5"><td style="font-weight:700">Total Investment</td><td style="text-align:right; font-weight:700">${formatCurrency(totalInvestment)}</td></tr>
            <tr><td>After Repair Value (ARV)</td><td style="text-align:right; font-weight:700; color:#c53030">${formatCurrency(effectiveArv)}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Profitability Analysis</h2>
          <div class="grid">
            <div class="stat"><div class="stat-label">Net Profit</div><div class="stat-value ${profit.netProfit >= 0 ? 'profit-positive' : 'profit-negative'}">${formatCurrency(profit.netProfit)}</div></div>
            <div class="stat"><div class="stat-label">Return on Investment</div><div class="stat-value ${profit.roi >= 0 ? 'profit-positive' : 'profit-negative'}">${profit.roi.toFixed(1)}%</div></div>
            <div class="stat"><div class="stat-label">70% Rule MAO</div><div class="stat-value" style="font-size:16px">${formatCurrency(profit.maxAllowableOffer)}</div></div>
            <div class="stat"><div class="stat-label">Max Purchase for ${targetROI}% ROI</div><div class="stat-value" style="font-size:16px">${formatCurrency(profit.recommendedMaxPrice)}</div></div>
          </div>
        </div>

        <div class="section">
          <h2>Timeline</h2>
          <div class="grid">
            <div class="stat"><div class="stat-label">Rehab Duration</div><div class="stat-value" style="font-size:16px">${rehabTotals.totalDurationDays} days</div></div>
            <div class="stat"><div class="stat-label">Material Tier</div><div class="stat-value" style="font-size:16px">${materialTier.charAt(0).toUpperCase() + materialTier.slice(1)} Grade</div></div>
          </div>
        </div>

        <div class="verdict-box verdict-${profit.dealVerdict}">
          <div class="verdict-label">${profit.dealVerdict.toUpperCase().replace('_', ' ')}</div>
          <p style="margin-top:6px; font-size:14px">${profit.verdictReasons[0] || ''}</p>
        </div>

        <div class="footer">
          <p>This report is for informational purposes only. All projections are estimates and actual results may vary.</p>
          <p>Generated by FlipAnalyzer Pro</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
          <div className={`text-center text-sm font-bold ${verdictColor} pt-2 border-t border-border/50`}>
            VERDICT: {profit.dealVerdict.toUpperCase().replace('_', ' ')} — ROI: {profit.roi.toFixed(1)}%
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

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
