const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/RUvFlwFYmtbQizbR.png";

interface CertificateOptions {
  recipientName: string;
  completionDate: string;
  totalLessons: number;
  totalModules: number;
  quizzesPassed: number;
}

/**
 * Generates a branded course completion certificate as a downloadable PDF
 * using a print-ready HTML document.
 */
export function generateCertificate(opts: CertificateOptions) {
  const {
    recipientName,
    completionDate,
    totalLessons,
    totalModules,
    quizzesPassed,
  } = opts;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Certificate of Completion — Freedom One</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: landscape;
      margin: 0;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 0;
    }

    .certificate {
      width: 11in;
      height: 8.5in;
      position: relative;
      background: #0a0a0a;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    /* Decorative border */
    .certificate::before {
      content: '';
      position: absolute;
      inset: 18px;
      border: 2px solid rgba(185, 28, 28, 0.4);
    }

    .certificate::after {
      content: '';
      position: absolute;
      inset: 24px;
      border: 1px solid rgba(185, 28, 28, 0.15);
    }

    /* Corner accents */
    .corner {
      position: absolute;
      width: 60px;
      height: 60px;
      border-color: #b91c1c;
      border-style: solid;
    }
    .corner-tl { top: 12px; left: 12px; border-width: 3px 0 0 3px; }
    .corner-tr { top: 12px; right: 12px; border-width: 3px 3px 0 0; }
    .corner-bl { bottom: 12px; left: 12px; border-width: 0 0 3px 3px; }
    .corner-br { bottom: 12px; right: 12px; border-width: 0 3px 3px 0; }

    .content {
      text-align: center;
      position: relative;
      z-index: 1;
      padding: 0 80px;
      max-width: 100%;
    }

    .logo {
      height: 56px;
      object-fit: contain;
      margin-bottom: 20px;
    }

    .divider {
      width: 80px;
      height: 2px;
      background: #b91c1c;
      margin: 0 auto;
    }

    .pre-title {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 5px;
      text-transform: uppercase;
      color: #b91c1c;
      margin-bottom: 8px;
    }

    .title {
      font-family: 'Playfair Display', serif;
      font-size: 40px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 1px;
      margin-bottom: 24px;
    }

    .presented-to {
      font-size: 11px;
      font-weight: 400;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
      margin-bottom: 12px;
    }

    .recipient-name {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 600;
      color: #ffffff;
      border-bottom: 2px solid rgba(185, 28, 28, 0.5);
      padding-bottom: 8px;
      display: inline-block;
      margin-bottom: 24px;
      min-width: 400px;
    }

    .description {
      font-size: 13px;
      font-weight: 400;
      color: rgba(255,255,255,0.6);
      line-height: 1.7;
      max-width: 600px;
      margin: 0 auto 28px;
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      margin-bottom: 32px;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: #b91c1c;
    }

    .stat-label {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
      margin-top: 2px;
    }

    .footer-row {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 80px;
    }

    .footer-item {
      text-align: center;
    }

    .footer-value {
      font-size: 13px;
      font-weight: 500;
      color: rgba(255,255,255,0.7);
      margin-bottom: 4px;
    }

    .footer-label {
      font-size: 9px;
      font-weight: 500;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.3);
      border-top: 1px solid rgba(255,255,255,0.15);
      padding-top: 6px;
      min-width: 160px;
    }

    /* Subtle background texture */
    .bg-texture {
      position: absolute;
      inset: 0;
      opacity: 0.03;
      background-image: radial-gradient(circle at 25% 25%, #b91c1c 1px, transparent 1px),
                         radial-gradient(circle at 75% 75%, #b91c1c 1px, transparent 1px);
      background-size: 40px 40px;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 0; margin: 0; }
      .certificate { page-break-inside: avoid; }
    }

    @media screen {
      body { background: #333; padding: 20px; }
      .certificate { margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="bg-texture"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="content">
      <img src="${LOGO_URL}" alt="Freedom One" class="logo" />
      <div class="divider" style="margin-bottom: 20px;"></div>

      <p class="pre-title">Certificate of Completion</p>
      <h1 class="title">Fix & Flip Mastery 2026</h1>

      <p class="presented-to">This is presented to</p>
      <p class="recipient-name">${escapeHtml(recipientName)}</p>

      <p class="description">
        For successfully completing the comprehensive Fix & Flip Mastery 2026 course,
        demonstrating proficiency in real estate deal analysis, rehab estimation,
        and all five major exit strategies.
      </p>

      <div class="stats">
        <div class="stat">
          <div class="stat-value">${totalModules}</div>
          <div class="stat-label">Modules</div>
        </div>
        <div class="stat">
          <div class="stat-value">${totalLessons}</div>
          <div class="stat-label">Lessons</div>
        </div>
        <div class="stat">
          <div class="stat-value">${quizzesPassed}</div>
          <div class="stat-label">Quizzes Passed</div>
        </div>
      </div>

      <div class="footer-row">
        <div class="footer-item">
          <div class="footer-value">${completionDate}</div>
          <div class="footer-label">Date of Completion</div>
        </div>
        <div class="footer-item">
          <div class="footer-value">Freedom One</div>
          <div class="footer-label">Real Estate Investment System</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 600);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
