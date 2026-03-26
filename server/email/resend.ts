import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

const FROM_EMAIL = "Freedom One <onboarding@resend.dev>";
const REPLY_TO = "contact@freedomoneproperties.com";
const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/MgvhsGurcOgbPgCR.png";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      replyTo: REPLY_TO,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error("[Email] Failed to send:", error);
      return false;
    }

    console.log(`[Email] Sent to ${params.to}: ${params.subject} (id: ${data?.id})`);
    return true;
  } catch (err) {
    console.error("[Email] Error sending email:", err);
    return false;
  }
}

/** Validate the Resend API key by checking the API */
export async function validateResendKey(): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });
    return res.ok || res.status === 200;
  } catch {
    return false;
  }
}

// ─── Email Templates ───────────────────────────────────────────────────────

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background-color: #141414; }
    .header { background: linear-gradient(135deg, #1a1a1a, #0a0a0a); padding: 32px; text-align: center; border-bottom: 2px solid #dc2626; }
    .header img { height: 60px; }
    .content { padding: 32px; color: #e5e5e5; line-height: 1.6; }
    .content h1 { color: #ffffff; font-size: 24px; margin-bottom: 16px; }
    .content h2 { color: #ffffff; font-size: 20px; margin-top: 24px; margin-bottom: 12px; }
    .content p { margin-bottom: 16px; color: #a3a3a3; }
    .content ul { padding-left: 20px; margin-bottom: 16px; }
    .content li { color: #a3a3a3; margin-bottom: 8px; }
    .cta-button { display: inline-block; background-color: #dc2626; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 16px 0; }
    .highlight-box { background-color: #1a1a1a; border: 1px solid #262626; border-radius: 8px; padding: 20px; margin: 16px 0; }
    .footer { padding: 24px 32px; text-align: center; color: #525252; font-size: 12px; border-top: 1px solid #262626; }
    .footer a { color: #dc2626; text-decoration: none; }
    .check { color: #22c55e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${LOGO_URL}" alt="Freedom One" />
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Freedom One | System of Real Estate Investing</p>
      <p>Questions? Email us at <a href="mailto:contact@freedomoneproperties.com">contact@freedomoneproperties.com</a></p>
      <p>&copy; ${new Date().getFullYear()} Freedom One Properties. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

/** Welcome email after Core BIB purchase */
export function bibWelcomeEmail(customerName: string, appUrl: string): SendEmailParams {
  const name = customerName || "Investor";
  return {
    to: "",
    subject: "Welcome to Freedom One! Your Business-in-a-Box is Ready",
    html: emailWrapper(`
      <h1>Welcome to Freedom One, ${name}!</h1>
      <p>Your Business-in-a-Box purchase is confirmed. You now have <strong>lifetime access</strong> to the complete real estate investing system.</p>
      
      <div class="highlight-box">
        <h2>What You Got:</h2>
        <ul>
          <li><span class="check">&#10003;</span> Complete Real Estate Investing Course (12 Modules, 65+ Lessons)</li>
          <li><span class="check">&#10003;</span> All 5 Exit Strategies: Fix & Flip, Wholesale, BRRRR, Subject-To, STR</li>
          <li><span class="check">&#10003;</span> Marketing Templates: Direct Mail, Email, Cold Call Scripts</li>
          <li><span class="check">&#10003;</span> Contract Templates: Purchase Agreements, Wholesale, Assignment</li>
          <li><span class="check">&#10003;</span> SOW Templates for All 14 Room Categories</li>
          <li><span class="check">&#10003;</span> Lender Directory, Checklists, Profit Calculator & More</li>
        </ul>
      </div>

      <h2>Get Started in 3 Steps:</h2>
      <p><strong>Step 1:</strong> Start the course with Module 1 — Investor Mindset & Goals</p>
      <p><strong>Step 2:</strong> Download and print the Due Diligence Checklist</p>
      <p><strong>Step 3:</strong> Review the marketing templates to start generating leads</p>

      <p style="text-align: center;">
        <a href="${appUrl}/course" class="cta-button">Start the Course Now &rarr;</a>
      </p>

      <p>If you have any questions, reply to this email or reach out at <a href="mailto:contact@freedomoneproperties.com" style="color: #dc2626;">contact@freedomoneproperties.com</a>.</p>
      
      <p>Here's to your success,<br><strong>The Freedom One Team</strong></p>
    `),
  };
}

/** Email after OTO1 purchase (Lifetime App Access) */
export function oto1PurchaseEmail(customerName: string, appUrl: string, isLifetime: boolean): SendEmailParams {
  const name = customerName || "Investor";
  const accessType = isLifetime ? "Lifetime" : "1-Year";
  return {
    to: "",
    subject: `Your ${accessType} App Access is Activated!`,
    html: emailWrapper(`
      <h1>${accessType} App Access Activated!</h1>
      <p>Great move, ${name}! Your Freedom One app access is now active. ${isLifetime ? "You'll never pay a monthly subscription — this is yours forever." : "You have full access for the next 12 months."}</p>
      
      <div class="highlight-box">
        <h2>Your App Tools:</h2>
        <ul>
          <li><span class="check">&#10003;</span> Deal Analyzer with Real-Time Profitability Calculations</li>
          <li><span class="check">&#10003;</span> Rehab Estimator with 3 Material Tiers & Home Depot Pricing</li>
          <li><span class="check">&#10003;</span> Pipeline CRM — Track Deals from Lead to Sold</li>
          <li><span class="check">&#10003;</span> Renovation Designer — AI-Powered Room Visualizations</li>
          <li><span class="check">&#10003;</span> Portfolio Dashboard with PDF Export</li>
          <li><span class="check">&#10003;</span> 50+ Metro Market Regional Pricing</li>
          <li><span class="check">&#10003;</span> All Future Updates Included</li>
        </ul>
      </div>

      <h2>Quick Start:</h2>
      <p><strong>1.</strong> Open the Deal Analyzer and enter your first property address</p>
      <p><strong>2.</strong> Add comparable sales to calculate ARV</p>
      <p><strong>3.</strong> Use the Rehab Estimator to estimate renovation costs</p>
      <p><strong>4.</strong> Review your deal score and profitability analysis</p>

      <p style="text-align: center;">
        <a href="${appUrl}/analyzer" class="cta-button">Open the Deal Analyzer &rarr;</a>
      </p>

      <p>Your course + templates are also waiting for you. Combine the education with the tools for maximum results.</p>
      
      <p>To your success,<br><strong>The Freedom One Team</strong></p>
    `),
  };
}

/** Email after OTO2 purchase (Marketing Kit) */
export function oto2PurchaseEmail(customerName: string, appUrl: string, isFullKit: boolean): SendEmailParams {
  const name = customerName || "Investor";
  const kitType = isFullKit ? "Done-For-You Marketing Kit" : "Marketing Starter Pack";
  return {
    to: "",
    subject: `Your ${kitType} is Ready to Deploy!`,
    html: emailWrapper(`
      <h1>Your ${kitType} is Ready!</h1>
      <p>${name}, your marketing materials are ready to go. ${isFullKit ? "You now have 6 months of pre-built marketing campaigns." : "You have the essential marketing templates to get started."}</p>
      
      <div class="highlight-box">
        <h2>What's Included:</h2>
        <ul>
          ${isFullKit ? `
          <li><span class="check">&#10003;</span> 6 Facebook Ad Campaigns with Targeting & Copy</li>
          <li><span class="check">&#10003;</span> 5 Direct Mail Templates (Yellow Letters, Postcards, Professional)</li>
          <li><span class="check">&#10003;</span> 22 Emails Across 3 Sequences (Nurture, Onboarding, Sales)</li>
          <li><span class="check">&#10003;</span> 6-Month Social Media Calendar (130+ Posts)</li>
          <li><span class="check">&#10003;</span> Cold Call Scripts for 4 Lead Types</li>
          <li><span class="check">&#10003;</span> Lead Generation Playbook</li>
          ` : `
          <li><span class="check">&#10003;</span> 2 Facebook Ad Campaigns (Motivated Sellers + Cash Buyers)</li>
          <li><span class="check">&#10003;</span> Direct Mail Yellow Letter Template</li>
          <li><span class="check">&#10003;</span> 7-Day Email Nurture Sequence (7 Emails)</li>
          <li><span class="check">&#10003;</span> 30-Day Social Media Calendar</li>
          <li><span class="check">&#10003;</span> Absentee Owner Cold Call Script</li>
          `}
        </ul>
      </div>

      <h2>Deploy in 3 Steps:</h2>
      <p><strong>1.</strong> Customize the templates with your name, phone number, and market area</p>
      <p><strong>2.</strong> Set up your Facebook ads using the provided targeting and copy</p>
      <p><strong>3.</strong> Schedule your social media posts using the content calendar</p>

      <p style="text-align: center;">
        <a href="${appUrl}/marketing" class="cta-button">View Marketing Templates &rarr;</a>
      </p>

      <p>Pro tip: Start with direct mail to absentee owners — it's the fastest way to generate motivated seller leads.</p>
      
      <p>Let's get those leads flowing,<br><strong>The Freedom One Team</strong></p>
    `),
  };
}

/** Order summary email */
export function orderSummaryEmail(customerName: string, purchases: { name: string; price: number }[], appUrl: string): SendEmailParams {
  const name = customerName || "Investor";
  const total = purchases.reduce((sum, p) => sum + p.price, 0);
  const itemsHtml = purchases
    .map(p => `<li>${p.name} — <strong>$${(p.price / 100).toLocaleString()}</strong></li>`)
    .join("");

  return {
    to: "",
    subject: "Your Freedom One Order Confirmation",
    html: emailWrapper(`
      <h1>Order Confirmed!</h1>
      <p>Thank you for your purchase, ${name}. Here's your order summary:</p>
      
      <div class="highlight-box">
        <h2>Order Details:</h2>
        <ul>${itemsHtml}</ul>
        <p style="border-top: 1px solid #333; padding-top: 12px; margin-top: 12px;">
          <strong style="color: #ffffff; font-size: 18px;">Total: $${(total / 100).toLocaleString()}</strong>
        </p>
      </div>

      <p>All materials are available immediately. Access your course, templates, and tools anytime:</p>

      <p style="text-align: center;">
        <a href="${appUrl}/bib/thank-you" class="cta-button">Access Your Materials &rarr;</a>
      </p>

      <p>A receipt from Stripe has also been sent to your email for your records.</p>
      
      <p>Welcome to the Freedom One family,<br><strong>The Freedom One Team</strong></p>
    `),
  };
}
