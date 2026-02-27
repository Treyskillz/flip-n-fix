// ============================================================
// Portfolio Summary PDF — HTML Builder
// Generates a branded, print-ready HTML document for all saved deals
// ============================================================

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/MgvhsGurcOgbPgCR.png";

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

interface PortfolioDeal {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  purchasePrice: number;
  arv: number;
  rehabCost: number;
  totalInvestment: number;
  netProfit: number;
  roi: number;
  dealVerdict: string;
  dealScore: number | null;
  status: string;
  starred: boolean;
  createdAt: string;
}

interface PortfolioData {
  totalDeals: number;
  activeDeals: number;
  closedDeals: number;
  underContractDeals: number;
  passedDeals: number;
  totalInvested: number;
  totalProfit: number;
  avgRoi: number;
  avgDealScore: number;
  profitableCount: number;
  totalArv: number;
  totalRehabCost: number;
  deals: PortfolioDeal[];
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  under_contract: 'Under Contract',
  closed: 'Closed',
  passed: 'Passed',
  archived: 'Archived',
};

const STATUS_COLORS: Record<string, string> = {
  active: '#3b82f6',
  under_contract: '#f59e0b',
  closed: '#22c55e',
  passed: '#ef4444',
  archived: '#6b7280',
};

const VERDICT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  excellent: { bg: '#f0fdf4', text: '#16a34a', border: '#16a34a' },
  good: { bg: '#f0fdf4', text: '#16a34a', border: '#16a34a' },
  marginal: { bg: '#fffbeb', text: '#ca8a04', border: '#ca8a04' },
  not_recommended: { bg: '#fef2f2', text: '#dc2626', border: '#dc2626' },
  poor: { bg: '#fef2f2', text: '#dc2626', border: '#dc2626' },
};

function verdictStyle(verdict: string) {
  return VERDICT_COLORS[verdict] || VERDICT_COLORS['poor'];
}

export function buildPortfolioPdfHtml(portfolio: PortfolioData): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const totalPurchase = portfolio.deals.reduce((s, d) => s + d.purchasePrice, 0);
  const avgProfitPerDeal = portfolio.totalDeals > 0
    ? portfolio.totalProfit / portfolio.totalDeals : 0;

  // Build status summary
  const statusCounts = [
    { label: 'Active', count: portfolio.activeDeals, color: '#3b82f6' },
    { label: 'Under Contract', count: portfolio.underContractDeals, color: '#f59e0b' },
    { label: 'Closed', count: portfolio.closedDeals, color: '#22c55e' },
    { label: 'Passed', count: portfolio.passedDeals, color: '#ef4444' },
  ].filter(s => s.count > 0);

  // Build deal rows sorted by ROI descending
  const sortedDeals = [...portfolio.deals].sort((a, b) => b.roi - a.roi);

  const dealRows = sortedDeals.map((d, i) => {
    const profitClass = d.netProfit >= 0 ? 'profit-positive' : 'profit-negative';
    const vs = verdictStyle(d.dealVerdict);
    const statusColor = STATUS_COLORS[d.status] || '#6b7280';
    return `
      <tr${i % 2 === 1 ? ' class="alt-row"' : ''}>
        <td style="font-weight:600;">
          ${d.starred ? '★ ' : ''}${d.address}
          <div style="font-size:10px;color:#888;margin-top:1px;">${d.city}, ${d.state} ${d.zip}</div>
        </td>
        <td class="num">${fmt(d.purchasePrice)}</td>
        <td class="num" style="color:#c53030;font-weight:600;">${fmt(d.arv)}</td>
        <td class="num">${fmt(d.rehabCost)}</td>
        <td class="num ${profitClass}" style="font-weight:700;">${fmt(d.netProfit)}</td>
        <td class="num ${profitClass}" style="font-weight:700;">${d.roi.toFixed(1)}%</td>
        <td class="num">${d.dealScore != null ? d.dealScore + '/100' : '—'}</td>
        <td style="text-align:center;">
          <span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;color:white;background:${statusColor};">
            ${STATUS_LABELS[d.status] || d.status}
          </span>
        </td>
        <td style="text-align:center;">
          <span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;color:${vs.text};background:${vs.bg};border:1px solid ${vs.border};">
            ${d.dealVerdict.replace('_', ' ').toUpperCase()}
          </span>
        </td>
      </tr>`;
  }).join('');

  // Build SVG bar chart for ROI by deal (top 15)
  const chartDeals = sortedDeals.slice(0, 15);
  const maxRoi = Math.max(...chartDeals.map(d => Math.abs(d.roi)), 1);
  const barHeight = 22;
  const chartHeight = chartDeals.length * (barHeight + 6) + 40;
  const chartWidth = 700;
  const labelWidth = 140;
  const barAreaWidth = chartWidth - labelWidth - 80;

  const barsSvg = chartDeals.map((d, i) => {
    const y = 30 + i * (barHeight + 6);
    const barW = Math.max((Math.abs(d.roi) / maxRoi) * barAreaWidth, 4);
    const color = d.roi >= 20 ? '#22c55e' : d.roi >= 10 ? '#3b82f6' : d.roi >= 0 ? '#f59e0b' : '#ef4444';
    const truncAddr = d.address.length > 20 ? d.address.substring(0, 20) + '…' : d.address;
    return `
      <text x="${labelWidth - 8}" y="${y + 15}" text-anchor="end" font-size="10" fill="#555">${truncAddr}</text>
      <rect x="${labelWidth}" y="${y}" width="${barW}" height="${barHeight}" rx="3" fill="${color}" />
      <text x="${labelWidth + barW + 6}" y="${y + 15}" font-size="11" font-weight="600" fill="${color}">${d.roi.toFixed(1)}%</text>
    `;
  }).join('');

  // Status distribution mini-chart
  const statusBarWidth = 500;
  const totalForBar = portfolio.totalDeals || 1;
  let statusOffset = 0;
  const statusBarSvg = statusCounts.map(s => {
    const w = Math.max((s.count / totalForBar) * statusBarWidth, 2);
    const x = statusOffset;
    statusOffset += w;
    return `<rect x="${x}" y="0" width="${w}" height="28" fill="${s.color}" rx="0" />
            <text x="${x + w / 2}" y="18" text-anchor="middle" font-size="10" font-weight="600" fill="white">${s.label} (${s.count})</text>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Portfolio Summary — Freedom One</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; padding: 32px; max-width: 1100px; margin: 0 auto; }
    .report-header { display: flex; align-items: center; gap: 16px; padding-bottom: 16px; border-bottom: 3px solid #c53030; margin-bottom: 24px; }
    .logo { height: 48px; width: auto; }
    .header-text h1 { font-size: 22px; font-weight: 800; letter-spacing: 1px; color: #1a1a1a; }
    .header-text .subtitle { font-size: 13px; color: #666; margin-top: 2px; }
    .header-text .meta { font-size: 11px; color: #999; margin-top: 2px; }
    .section { margin-bottom: 24px; page-break-inside: avoid; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #c53030; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #eee; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .kpi-card { padding: 14px; background: #f9f9f9; border-radius: 8px; text-align: center; border: 1px solid #e5e5e5; }
    .kpi-label { font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: 0.5px; font-weight: 600; }
    .kpi-value { font-size: 24px; font-weight: 800; margin-top: 4px; }
    .kpi-sub { font-size: 10px; color: #999; margin-top: 2px; }
    .summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .summary-item { padding: 10px; background: #f5f5f5; border-radius: 6px; border-left: 3px solid #e5e5e5; }
    .summary-item.accent { border-left-color: #c53030; }
    .summary-item.green { border-left-color: #16a34a; }
    .summary-item.blue { border-left-color: #3b82f6; }
    .summary-item .label { font-size: 10px; text-transform: uppercase; color: #888; font-weight: 600; }
    .summary-item .value { font-size: 16px; font-weight: 700; margin-top: 2px; }
    .profit-positive { color: #16a34a; }
    .profit-negative { color: #dc2626; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { padding: 8px 6px; text-align: left; background: #f5f5f5; font-weight: 700; text-transform: uppercase; font-size: 9px; color: #666; letter-spacing: 0.5px; border-bottom: 2px solid #ddd; }
    td { padding: 7px 6px; border-bottom: 1px solid #eee; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .alt-row { background: #fafafa; }
    .chart-container { background: #fafafa; border-radius: 8px; padding: 16px; border: 1px solid #eee; }
    .footer { margin-top: 32px; text-align: center; font-size: 10px; color: #999; border-top: 2px solid #e5e5e5; padding-top: 16px; }
    @media print {
      body { padding: 16px; }
      .section { page-break-inside: avoid; }
      .deal-table { page-break-before: auto; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="report-header">
    <img src="${LOGO_URL}" alt="Freedom One" class="logo" onerror="this.style.display='none'" />
    <div class="header-text">
      <h1>PORTFOLIO SUMMARY REPORT</h1>
      <div class="subtitle">${portfolio.totalDeals} Deal${portfolio.totalDeals !== 1 ? 's' : ''} — Complete Investment Overview</div>
      <div class="meta">Generated ${dateStr} | Freedom One Real Estate Investment System</div>
    </div>
  </div>

  <!-- KPI Cards -->
  <div class="section">
    <div class="section-title">Key Performance Indicators</div>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Total Deals</div>
        <div class="kpi-value">${portfolio.totalDeals}</div>
        <div class="kpi-sub">${portfolio.profitableCount} profitable</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Total Invested</div>
        <div class="kpi-value">${fmt(portfolio.totalInvested)}</div>
        <div class="kpi-sub">Across all deals</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Projected Profit</div>
        <div class="kpi-value ${portfolio.totalProfit >= 0 ? 'profit-positive' : 'profit-negative'}">${fmt(portfolio.totalProfit)}</div>
        <div class="kpi-sub">${fmt(avgProfitPerDeal)} avg/deal</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Average ROI</div>
        <div class="kpi-value ${portfolio.avgRoi >= 0 ? 'profit-positive' : 'profit-negative'}">${portfolio.avgRoi.toFixed(1)}%</div>
        <div class="kpi-sub">Avg score: ${Math.round(portfolio.avgDealScore)}/100</div>
      </div>
    </div>
  </div>

  <!-- Financial Summary -->
  <div class="section">
    <div class="section-title">Financial Summary</div>
    <div class="summary-row">
      <div class="summary-item accent">
        <div class="label">Total Purchase Prices</div>
        <div class="value">${fmt(totalPurchase)}</div>
      </div>
      <div class="summary-item blue">
        <div class="label">Total Rehab Costs</div>
        <div class="value">${fmt(portfolio.totalRehabCost)}</div>
      </div>
      <div class="summary-item accent">
        <div class="label">Total ARV</div>
        <div class="value" style="color:#c53030;">${fmt(portfolio.totalArv)}</div>
      </div>
      <div class="summary-item green">
        <div class="label">Profitable Deals</div>
        <div class="value profit-positive">${portfolio.profitableCount} of ${portfolio.totalDeals}</div>
      </div>
    </div>
  </div>

  <!-- Deal Status Distribution -->
  <div class="section">
    <div class="section-title">Deal Status Distribution</div>
    <div class="chart-container" style="padding:16px 20px;">
      <svg width="${statusBarWidth}" height="28" style="border-radius:4px;overflow:hidden;">
        ${statusBarSvg}
      </svg>
      <div style="display:flex;gap:16px;margin-top:10px;">
        ${statusCounts.map(s => `
          <div style="display:flex;align-items:center;gap:4px;font-size:11px;">
            <div style="width:10px;height:10px;border-radius:2px;background:${s.color};"></div>
            <span style="color:#666;">${s.label}: <strong>${s.count}</strong></span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- ROI by Deal Chart -->
  <div class="section">
    <div class="section-title">ROI by Deal (Top ${chartDeals.length})</div>
    <div class="chart-container">
      <svg width="${chartWidth}" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}">
        <text x="${chartWidth / 2}" y="18" text-anchor="middle" font-size="11" fill="#888" font-weight="600">Return on Investment (%)</text>
        ${barsSvg}
      </svg>
    </div>
  </div>

  <!-- Deal Table -->
  <div class="section deal-table">
    <div class="section-title">All Deals (${sortedDeals.length})</div>
    <table>
      <thead>
        <tr>
          <th style="text-align:left;">Property</th>
          <th class="num">Purchase</th>
          <th class="num">ARV</th>
          <th class="num">Rehab</th>
          <th class="num">Net Profit</th>
          <th class="num">ROI</th>
          <th class="num">Score</th>
          <th style="text-align:center;">Status</th>
          <th style="text-align:center;">Verdict</th>
        </tr>
      </thead>
      <tbody>
        ${dealRows}
      </tbody>
      <tfoot>
        <tr style="border-top:2px solid #ccc;font-weight:700;background:#f5f5f5;">
          <td>TOTALS (${sortedDeals.length} deals)</td>
          <td class="num">${fmt(totalPurchase)}</td>
          <td class="num" style="color:#c53030;">${fmt(portfolio.totalArv)}</td>
          <td class="num">${fmt(portfolio.totalRehabCost)}</td>
          <td class="num ${portfolio.totalProfit >= 0 ? 'profit-positive' : 'profit-negative'}">${fmt(portfolio.totalProfit)}</td>
          <td class="num ${portfolio.avgRoi >= 0 ? 'profit-positive' : 'profit-negative'}">${portfolio.avgRoi.toFixed(1)}%</td>
          <td class="num">${Math.round(portfolio.avgDealScore)}/100</td>
          <td></td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p><strong>Freedom One Real Estate Investment System</strong></p>
    <p style="margin-top:4px;">Portfolio metrics are projections based on user-provided data. Actual results may vary significantly based on market conditions, property condition, contractor pricing, and other factors.</p>
    <p style="margin-top:4px;">Always perform independent due diligence and consult with licensed professionals before making investment decisions.</p>
    <p style="margin-top:8px;color:#bbb;">Report generated ${dateStr}</p>
  </div>
</body>
</html>`;
}

export function downloadPortfolioPdf(portfolio: PortfolioData): void {
  const html = buildPortfolioPdfHtml(portfolio);
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  // Auto-trigger print dialog for PDF save
  setTimeout(() => printWindow.print(), 500);
}
