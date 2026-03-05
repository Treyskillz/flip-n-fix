import { COURSE_MODULES } from './course';
import type { BrandingConfig } from '@/lib/branding';

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/RUvFlwFYmtbQizbR.png";

/**
 * Generates a comprehensive ebook PDF from all course content.
 * Opens a print-ready window with professional book formatting.
 */
export function generateCourseEbook(options?: { includePremium?: boolean; branding?: BrandingConfig }) {
  const { includePremium = false, branding: b } = options || {};
  const logoUrl = b?.logoUrl || LOGO_URL;
  const companyName = b?.companyName || 'Freedom One';

  const modules = includePremium
    ? COURSE_MODULES
    : COURSE_MODULES.filter(m => !m.premium);

  const totalModules = modules.length;
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const year = new Date().getFullYear();

  // Build chapters HTML
  const chaptersHtml = modules.map((mod, modIdx) => {
    const chapterNum = modIdx + 1;
    const lessonsHtml = mod.lessons.map((lesson, lesIdx) => {
      const contentHtml = markdownToHtml(lesson.content);
      return `
        <div class="lesson">
          <h3 class="lesson-title">Lesson ${lesIdx + 1}: ${lesson.title}</h3>
          <div class="lesson-content">${contentHtml}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="chapter" ${modIdx > 0 ? 'style="page-break-before: always;"' : ''}>
        <div class="chapter-header">
          <div class="chapter-number">Chapter ${chapterNum}</div>
          <h2 class="chapter-title">${mod.title}</h2>
          <p class="chapter-desc">${mod.description}</p>
          ${mod.premium ? '<div class="premium-badge">BONUS MODULE</div>' : ''}
        </div>
        ${lessonsHtml}
      </div>
    `;
  }).join('');

  // Build table of contents
  const tocHtml = modules.map((mod, modIdx) => {
    const chapterNum = modIdx + 1;
    const lessonsItems = mod.lessons.map((lesson, lesIdx) => {
      return `<li class="toc-lesson">Lesson ${lesIdx + 1}: ${lesson.title}</li>`;
    }).join('');
    return `
      <div class="toc-chapter">
        <div class="toc-chapter-title">
          <span class="toc-num">Chapter ${chapterNum}</span>
          <span class="toc-name">${mod.title}</span>
          ${mod.premium ? '<span class="toc-premium">BONUS</span>' : ''}
        </div>
        <ul class="toc-lessons">${lessonsItems}</ul>
      </div>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Fix & Flip Mastery ${year} — ${companyName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: letter;
      margin: 0.85in 0.9in 1in 0.9in;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 10.5pt;
      line-height: 1.7;
      color: #1a1a1a;
      background: #fff;
    }

    /* ── Cover Page ── */
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      text-align: center;
      page-break-after: always;
      padding: 2in 0.5in;
    }
    .cover img.logo {
      height: 80px;
      object-fit: contain;
      margin-bottom: 40px;
    }
    .cover .cover-title {
      font-family: 'Playfair Display', serif;
      font-size: 36pt;
      font-weight: 800;
      color: #b91c1c;
      line-height: 1.15;
      margin-bottom: 12px;
    }
    .cover .cover-subtitle {
      font-size: 14pt;
      font-weight: 300;
      color: #555;
      margin-bottom: 8px;
    }
    .cover .cover-edition {
      font-size: 11pt;
      color: #888;
      margin-bottom: 40px;
    }
    .cover .cover-stats {
      display: flex;
      gap: 40px;
      justify-content: center;
      margin-bottom: 40px;
    }
    .cover .cover-stat {
      text-align: center;
    }
    .cover .cover-stat .stat-num {
      font-family: 'Playfair Display', serif;
      font-size: 28pt;
      font-weight: 700;
      color: #b91c1c;
    }
    .cover .cover-stat .stat-label {
      font-size: 9pt;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .cover .cover-tagline {
      font-size: 10pt;
      color: #999;
      border-top: 1px solid #ddd;
      padding-top: 20px;
      max-width: 400px;
    }

    /* ── Copyright Page ── */
    .copyright-page {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      min-height: 100vh;
      page-break-after: always;
      padding-bottom: 2in;
    }
    .copyright-page p {
      font-size: 8.5pt;
      color: #888;
      line-height: 1.8;
      margin-bottom: 6px;
    }
    .copyright-page .copyright-title {
      font-size: 10pt;
      font-weight: 600;
      color: #555;
      margin-bottom: 12px;
    }

    /* ── Table of Contents ── */
    .toc-page {
      page-break-after: always;
    }
    .toc-page h2 {
      font-family: 'Playfair Display', serif;
      font-size: 22pt;
      font-weight: 700;
      color: #b91c1c;
      margin-bottom: 24px;
      padding-bottom: 8px;
      border-bottom: 3px solid #b91c1c;
    }
    .toc-chapter {
      margin-bottom: 16px;
    }
    .toc-chapter-title {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 4px;
    }
    .toc-num {
      font-weight: 700;
      font-size: 10pt;
      color: #b91c1c;
      min-width: 70px;
    }
    .toc-name {
      font-weight: 600;
      font-size: 11pt;
      color: #1a1a1a;
    }
    .toc-premium {
      font-size: 7pt;
      font-weight: 700;
      color: #b91c1c;
      background: #fef2f2;
      padding: 1px 6px;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .toc-lessons {
      list-style: none;
      padding-left: 78px;
    }
    .toc-lesson {
      font-size: 9pt;
      color: #666;
      line-height: 1.8;
    }

    /* ── Chapter Headers ── */
    .chapter-header {
      margin-bottom: 28px;
      padding-bottom: 16px;
      border-bottom: 2px solid #b91c1c;
    }
    .chapter-number {
      font-size: 11pt;
      font-weight: 700;
      color: #b91c1c;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 4px;
    }
    .chapter-title {
      font-family: 'Playfair Display', serif;
      font-size: 22pt;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1.2;
      margin-bottom: 8px;
    }
    .chapter-desc {
      font-size: 10pt;
      color: #666;
      line-height: 1.5;
    }
    .premium-badge {
      display: inline-block;
      margin-top: 8px;
      font-size: 8pt;
      font-weight: 700;
      color: #b91c1c;
      background: #fef2f2;
      padding: 3px 10px;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* ── Lessons ── */
    .lesson {
      margin-bottom: 28px;
      page-break-inside: avoid;
    }
    .lesson-title {
      font-size: 14pt;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e5e5e5;
    }
    .lesson-content {
      font-size: 10.5pt;
      line-height: 1.7;
      color: #333;
    }
    .lesson-content h2 {
      font-family: 'Playfair Display', serif;
      font-size: 15pt;
      font-weight: 700;
      color: #b91c1c;
      margin: 20px 0 10px 0;
    }
    .lesson-content h3 {
      font-size: 12pt;
      font-weight: 700;
      color: #1a1a1a;
      margin: 16px 0 8px 0;
    }
    .lesson-content h4 {
      font-size: 11pt;
      font-weight: 600;
      color: #444;
      margin: 12px 0 6px 0;
    }
    .lesson-content p {
      margin-bottom: 10px;
    }
    .lesson-content strong {
      font-weight: 600;
      color: #1a1a1a;
    }
    .lesson-content em {
      font-style: italic;
    }
    .lesson-content ul, .lesson-content ol {
      margin: 8px 0 12px 22px;
      padding: 0;
    }
    .lesson-content li {
      margin-bottom: 5px;
    }
    .lesson-content blockquote {
      border-left: 3px solid #b91c1c;
      padding: 10px 16px;
      margin: 12px 0;
      background: #fafafa;
      font-style: italic;
      color: #555;
    }
    .lesson-content hr {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 16px 0;
    }
    .lesson-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 9.5pt;
    }
    .lesson-content table th {
      background: #f5f5f5;
      font-weight: 600;
      text-align: left;
      padding: 6px 10px;
      border: 1px solid #ddd;
    }
    .lesson-content table td {
      padding: 5px 10px;
      border: 1px solid #ddd;
    }
    .lesson-content code {
      font-family: 'Courier New', monospace;
      font-size: 9pt;
      background: #f5f5f5;
      padding: 1px 4px;
      border-radius: 2px;
    }

    /* Ninja Tips Box */
    .ninja-box {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-left: 4px solid #b91c1c;
      padding: 12px 16px;
      margin: 14px 0;
      border-radius: 0 4px 4px 0;
    }
    .ninja-box strong {
      color: #b91c1c;
    }

    /* ── Page Footer ── */
    .page-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 8pt;
      color: #bbb;
      padding: 8px 0;
    }

    /* ── Print ── */
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .chapter { page-break-before: always; }
      .lesson { page-break-inside: avoid; }
      .no-print { display: none !important; }
    }

    /* ── Screen preview ── */
    @media screen {
      body { max-width: 8.5in; margin: 0 auto; padding: 40px 50px; }
      .chapter { border-top: 3px solid #b91c1c; padding-top: 30px; margin-top: 40px; }
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="cover">
    <img class="logo" src="${logoUrl}" alt="${companyName}" />
    <div class="cover-title">Fix & Flip Mastery</div>
    <div class="cover-subtitle">The Complete Real Estate Investor's Guide</div>
    <div class="cover-edition">${year} Edition</div>
    <div class="cover-stats">
      <div class="cover-stat">
        <div class="stat-num">${totalModules}</div>
        <div class="stat-label">Chapters</div>
      </div>
      <div class="cover-stat">
        <div class="stat-num">${totalLessons}</div>
        <div class="stat-label">Lessons</div>
      </div>
      <div class="cover-stat">
        <div class="stat-num">5</div>
        <div class="stat-label">Exit Strategies</div>
      </div>
    </div>
    <div class="cover-tagline">
      From deal analysis and rehab estimation to marketing, contracts, financing, and every exit strategy.
      Built for investors who run on data, not guesswork.
    </div>
  </div>

  <!-- Copyright Page -->
  <div class="copyright-page">
    <p class="copyright-title">Fix & Flip Mastery — ${year} Edition</p>
    <p>Published by ${companyName} Real Estate Investment System</p>
    <p>&copy; ${year} ${companyName}. All rights reserved.</p>
    <p>No part of this publication may be reproduced, distributed, or transmitted in any form without prior written permission of the publisher.</p>
    <p style="margin-top: 16px;"><strong>Disclaimer:</strong> This book is for educational purposes only. The information contained herein does not constitute legal, financial, tax, or investment advice. Real estate investing involves substantial risk, including the potential loss of capital. Always consult with qualified professionals before making investment decisions. Past performance does not guarantee future results. The author and publisher assume no liability for actions taken based on the information in this book.</p>
    <p style="margin-top: 16px;">ISBN: 979-8-XXXX-XXXX-X (placeholder — assign before distribution)</p>
    <p>Printed in the United States of America</p>
    <p>First Edition: ${year}</p>
  </div>

  <!-- Table of Contents -->
  <div class="toc-page">
    <h2>Table of Contents</h2>
    ${tocHtml}
  </div>

  <!-- Chapters -->
  ${chaptersHtml}

  <!-- Back Page -->
  <div class="chapter" style="page-break-before: always;">
    <div class="chapter-header">
      <div class="chapter-number">About ${companyName}</div>
      <h2 class="chapter-title">Your Real Estate Investment System</h2>
    </div>
    <div class="lesson-content">
      <p>${companyName} is a comprehensive real estate investment platform designed to give investors every tool they need to analyze deals, estimate rehab costs, manage their portfolio, and grow their business.</p>
      <h3>What's Included in the Platform</h3>
      <ul>
        <li><strong>Deal Analyzer</strong> — Full property analysis with comp search, rehab estimation, and deal scoring</li>
        <li><strong>Profit Calculator</strong> — 6 financing scenarios with resale sensitivity and rapid-fire offer pricing</li>
        <li><strong>SOW Templates</strong> — 104 scope of work templates with Home Depot SKUs and regional pricing</li>
        <li><strong>Pipeline CRM</strong> — Kanban deal tracking with contacts, activities, and document delivery</li>
        <li><strong>Portfolio Dashboard</strong> — Aggregate metrics, charts, and PDF reports for investor presentations</li>
        <li><strong>Marketing Templates</strong> — Direct mail, email sequences, cold call scripts, and bandit signs</li>
        <li><strong>Contract Templates</strong> — 11 investor contracts with auto-fill from your business profile</li>
        <li><strong>Lender Directory</strong> — Hard money and private lender contacts with rates and terms</li>
        <li><strong>Credibility Packets</strong> — Professional documents for agents, buyers, sellers, and contractors</li>
        <li><strong>State Reference Guide</strong> — Fees, taxes, and procedures for all 50 states</li>
        <li><strong>This Course</strong> — Complete education with video scripts, quizzes, and completion certificate</li>
      </ul>
      <p style="margin-top: 20px; text-align: center; font-weight: 600; color: #b91c1c;">
        Visit freedomone.manus.space to get started.
      </p>
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) {
    alert('Please allow popups to download the ebook.');
    return;
  }
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 800);
}

/**
 * Converts markdown-ish course content to clean HTML for the ebook.
 */
function markdownToHtml(md: string): string {
  let html = md;

  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />');

  // Ninja Tips special formatting
  html = html.replace(
    /(<h[234]>.*?Ninja Tips?.*?<\/h[234]>)([\s\S]*?)(?=<h[234]|$)/gi,
    (match, heading, content) => {
      return `${heading}<div class="ninja-box">${content}</div>`;
    }
  );

  // Tables
  html = html.replace(/\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g, (match, headerRow, bodyRows) => {
    const headers = headerRow.split('|').map((h: string) => h.trim()).filter(Boolean);
    const rows = bodyRows.trim().split('\n').map((row: string) =>
      row.split('|').map((c: string) => c.trim()).filter(Boolean)
    );
    const thHtml = headers.map((h: string) => `<th>${h}</th>`).join('');
    const tbHtml = rows.map((row: string[]) =>
      `<tr>${row.map((c: string) => `<td>${c}</td>`).join('')}</tr>`
    ).join('');
    return `<table><thead><tr>${thHtml}</tr></thead><tbody>${tbHtml}</tbody></table>`;
  });

  // Unordered lists
  const lines = html.split('\n');
  const output: string[] = [];
  let inUl = false;
  let inOl = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      if (inUl) { output.push('</ul>'); inUl = false; }
      if (inOl) { output.push('</ol>'); inOl = false; }
      output.push('');
      continue;
    }

    // Already processed HTML tags
    if (trimmed.startsWith('<h') || trimmed.startsWith('<table') || trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<hr') || trimmed.startsWith('<div') || trimmed.startsWith('</')) {
      if (inUl) { output.push('</ul>'); inUl = false; }
      if (inOl) { output.push('</ol>'); inOl = false; }
      output.push(trimmed);
      continue;
    }

    // Bullet points
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/);
    if (bulletMatch) {
      if (inOl) { output.push('</ol>'); inOl = false; }
      if (!inUl) { output.push('<ul>'); inUl = true; }
      output.push(`<li>${bulletMatch[1]}</li>`);
      continue;
    }

    // Numbered lists
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      if (inUl) { output.push('</ul>'); inUl = false; }
      if (!inOl) { output.push('<ol>'); inOl = true; }
      output.push(`<li>${numMatch[2]}</li>`);
      continue;
    }

    // Regular paragraph
    if (inUl) { output.push('</ul>'); inUl = false; }
    if (inOl) { output.push('</ol>'); inOl = false; }
    if (!trimmed.startsWith('<')) {
      output.push(`<p>${trimmed}</p>`);
    } else {
      output.push(trimmed);
    }
  }

  if (inUl) output.push('</ul>');
  if (inOl) output.push('</ol>');

  return output.join('\n');
}
