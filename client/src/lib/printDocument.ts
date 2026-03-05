import type { BrandingConfig } from '@/lib/branding';

const DEFAULT_LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/RUvFlwFYmtbQizbR.png";

interface PrintDocumentOptions {
  title: string;
  subtitle?: string;
  date?: string;
  sections: { heading: string; body: string }[];
  footer?: string;
  accentColor?: string;
  branding?: BrandingConfig;
}

/**
 * Opens a clean, branded print window with a full document layout.
 * No UI chrome, no copy buttons, no card borders — just a professional document.
 * Uses the centralized branding system:
 *   - Admin: Freedom One logo + full contact info
 *   - Subscribers: Freedom One logo, no contact info
 *   - Team tier with white-label: Custom logo + custom contact info
 */
export function printDocument(opts: PrintDocumentOptions) {
  const {
    title,
    subtitle,
    date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    sections,
    footer,
    accentColor: rawAccent,
    branding: b,
  } = opts;

  const accentColor = b?.brandColor || rawAccent || '#b91c1c';
  const logoUrl = b?.logoUrl || DEFAULT_LOGO_URL;
  const companyName = b?.companyName || 'Freedom One';
  const footerText = b?.footerText || 'Freedom One Real Estate Investment System';
  const contactLine = b && (b.phone || b.email || b.website)
    ? `<div style="font-size:9pt;color:#888;margin-top:2px">${[b.phone, b.email, b.website].filter(Boolean).join(' | ')}</div>`
    : '';

  const sectionsHtml = sections
    .map(
      (s) => `
      <div class="section">
        <h2>${s.heading}</h2>
        <div class="body">${formatBody(s.body)}</div>
      </div>`
    )
    .join('');

  const footerHtml = footer
    ? `<div class="doc-footer">${footer}</div>`
    : `<div class="doc-footer">This document was prepared using the ${footerText}.<br/>All information should be verified independently. This is not legal, financial, or investment advice.</div>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title} — ${companyName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: letter;
      margin: 0.75in 0.85in;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      background: #fff;
    }

    /* ── Header ── */
    .doc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 16px;
      border-bottom: 3px solid ${accentColor};
      margin-bottom: 24px;
    }
    .doc-header .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .doc-header img {
      height: 52px;
      object-fit: contain;
    }
    .doc-header .header-right {
      text-align: right;
    }
    .doc-header .header-right .doc-title {
      font-size: 18pt;
      font-weight: 700;
      color: ${accentColor};
      line-height: 1.2;
    }
    .doc-header .header-right .doc-subtitle {
      font-size: 10pt;
      color: #555;
      margin-top: 2px;
    }
    .doc-header .header-right .doc-date {
      font-size: 9pt;
      color: #888;
      margin-top: 4px;
    }

    /* ── Sections ── */
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .section h2 {
      font-size: 13pt;
      font-weight: 700;
      color: ${accentColor};
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e5e5e5;
    }
    .section .body {
      font-size: 11pt;
      line-height: 1.65;
      color: #333;
    }
    .section .body p {
      margin-bottom: 10px;
    }
    .section .body ul {
      margin: 8px 0 12px 20px;
      padding: 0;
    }
    .section .body ul li {
      margin-bottom: 5px;
    }
    .section .body ol {
      margin: 8px 0 12px 20px;
      padding: 0;
    }
    .section .body ol li {
      margin-bottom: 5px;
    }
    .section .body .quote {
      border-left: 3px solid ${accentColor};
      padding: 8px 14px;
      margin: 10px 0;
      background: #fafafa;
      font-style: italic;
      color: #555;
    }
    .section .body hr {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 14px 0;
    }

    /* ── Footer ── */
    .doc-footer {
      margin-top: 30px;
      padding-top: 14px;
      border-top: 2px solid ${accentColor};
      font-size: 8.5pt;
      color: #888;
      text-align: center;
      line-height: 1.5;
    }

    /* ── Print-specific ── */
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .section { page-break-inside: avoid; }
      .doc-footer { position: fixed; bottom: 0; left: 0; right: 0; }
    }

    /* ── Screen preview (before print dialog) ── */
    @media screen {
      body { max-width: 8.5in; margin: 0 auto; padding: 40px 50px; }
    }
  </style>
</head>
<body>
  <div class="doc-header">
    <div class="header-left">
      ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" onerror="this.style.display='none'" />` : ''}
    </div>
    <div class="header-right">
      <div class="doc-title">${title}</div>
      ${subtitle ? `<div class="doc-subtitle">${subtitle}</div>` : ''}
      <div class="doc-date">${date}</div>
      ${contactLine}
    </div>
  </div>

  ${sectionsHtml}

  ${footerHtml}
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 400);
}

/**
 * Converts plain-text section body into clean HTML.
 * Handles bullet points (•, -, *), numbered lists (1., 2.), paragraphs, and quoted blocks.
 */
function formatBody(raw: string): string {
  const lines = raw.split('\n');
  const out: string[] = [];
  let inUl = false;
  let inOl = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line → close any open list, add paragraph break
    if (!trimmed) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      continue;
    }

    // Bullet points: •, -, *
    const bulletMatch = trimmed.match(/^[•\-\*]\s+(.+)/);
    if (bulletMatch) {
      if (inOl) { out.push('</ol>'); inOl = false; }
      if (!inUl) { out.push('<ul>'); inUl = true; }
      out.push(`<li>${bulletMatch[1]}</li>`);
      continue;
    }

    // Numbered list: 1., 2., etc.
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (!inOl) { out.push('<ol>'); inOl = true; }
      out.push(`<li>${numMatch[2]}</li>`);
      continue;
    }

    // Quoted text (starts with ")
    if (trimmed.startsWith('"') || trimmed.startsWith('\u201c')) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<div class="quote">${trimmed}</div>`);
      continue;
    }

    // Regular paragraph
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
    out.push(`<p>${trimmed}</p>`);
  }

  if (inUl) out.push('</ul>');
  if (inOl) out.push('</ol>');

  return out.join('\n');
}
