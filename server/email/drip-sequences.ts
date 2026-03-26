/**
 * Email Drip Sequence Definitions
 * 
 * Each sequence has a key, name, and array of steps.
 * Each step defines the delay (in hours from trigger), subject, and HTML generator.
 */

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030273730/MgvhsGurcOgbPgCR.png";
const CONTACT_EMAIL = "contact@freedomoneproperties.com";

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
    .tip-box { background-color: #1a1a0a; border-left: 3px solid #eab308; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
    .number-circle { display: inline-block; width: 28px; height: 28px; background-color: #dc2626; color: white; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold; font-size: 14px; margin-right: 8px; }
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
      <p>Questions? Email us at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
      <p>&copy; ${new Date().getFullYear()} Freedom One Properties. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export interface DripStep {
  delayHours: number; // hours from trigger event
  stepName: string;
  subject: string;
  generateHtml: (name: string, appUrl: string, metadata?: Record<string, any>) => string;
}

export interface DripSequence {
  key: string;
  name: string;
  description: string;
  steps: DripStep[];
}

// ═══════════════════════════════════════════════════════════════
// BIB PURCHASE DRIP SEQUENCE
// Triggered when someone buys the Core Business-in-a-Box
// ═══════════════════════════════════════════════════════════════
export const BIB_PURCHASE_DRIP: DripSequence = {
  key: "bib_purchase",
  name: "BIB Purchase Sequence",
  description: "Automated emails after Business-in-a-Box purchase",
  steps: [
    {
      delayHours: 0, // Immediate
      stepName: "Welcome & Access",
      subject: "Welcome to Freedom One! Your Business-in-a-Box is Ready",
      generateHtml: (name, appUrl) => emailWrapper(`
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
        <p><span class="number-circle">1</span> Start the course with Module 1 &mdash; Investor Mindset & Goals</p>
        <p><span class="number-circle">2</span> Download and print the Due Diligence Checklist</p>
        <p><span class="number-circle">3</span> Review the marketing templates to start generating leads</p>

        <p style="text-align: center;">
          <a href="${appUrl}/course" class="cta-button">Start the Course Now &rarr;</a>
        </p>

        <p>If you have any questions, reply to this email or reach out at <a href="mailto:${CONTACT_EMAIL}" style="color: #dc2626;">${CONTACT_EMAIL}</a>.</p>
        
        <p>Here's to your success,<br><strong>The Freedom One Team</strong></p>
      `),
    },
    {
      delayHours: 48, // Day 2
      stepName: "Getting Started Guide",
      subject: `${"\u{1F3E0}"} Your 7-Day Quick Start Plan`,
      generateHtml: (name, appUrl) => emailWrapper(`
        <h1>Your 7-Day Quick Start Plan</h1>
        <p>Hey ${name},</p>
        <p>You've got the tools. Now let's put them to work. Here's exactly what to do in your first week:</p>

        <div class="highlight-box">
          <p><strong>Day 1-2: Foundation</strong></p>
          <ul>
            <li>Complete Module 1: Investor Mindset & Goals</li>
            <li>Complete Module 2: Understanding Real Estate Markets</li>
            <li>Print the Due Diligence Checklist</li>
          </ul>

          <p><strong>Day 3-4: Choose Your Strategy</strong></p>
          <ul>
            <li>Watch the exit strategy overview in Module 3</li>
            <li>Pick ONE strategy to focus on first (we recommend wholesaling for beginners)</li>
            <li>Review the contracts for your chosen strategy</li>
          </ul>

          <p><strong>Day 5-6: Marketing Setup</strong></p>
          <ul>
            <li>Customize 1 direct mail template with your info</li>
            <li>Set up a simple tracking spreadsheet</li>
            <li>Identify your target market area</li>
          </ul>

          <p><strong>Day 7: Take Action</strong></p>
          <ul>
            <li>Send your first batch of direct mail (even just 25 letters)</li>
            <li>Make 10 cold calls using the scripts provided</li>
            <li>Post your first social media content</li>
          </ul>
        </div>

        <div class="tip-box">
          <p style="color: #eab308; margin-bottom: 8px;"><strong>Pro Tip:</strong></p>
          <p style="color: #a3a3a3;">The #1 mistake new investors make is trying to learn everything before taking action. You don't need to finish the entire course before making your first offer. Module 1-3 gives you enough to start.</p>
        </div>

        <p style="text-align: center;">
          <a href="${appUrl}/course" class="cta-button">Continue the Course &rarr;</a>
        </p>

        <p>Remember, every successful investor started with their first deal. Yours is closer than you think.</p>
        <p>Let's go,<br><strong>The Freedom One Team</strong></p>
      `),
    },
    {
      delayHours: 120, // Day 5
      stepName: "Strategy Deep Dive",
      subject: "The fastest path to your first deal (real numbers inside)",
      generateHtml: (name, appUrl) => emailWrapper(`
        <h1>The Fastest Path to Your First Deal</h1>
        <p>Hey ${name},</p>
        <p>By now you should be a few modules into the course. Let's talk about the fastest way to close your first deal.</p>

        <h2>Wholesaling: The Lowest-Risk Entry Point</h2>
        <p>Here's why most successful investors start with wholesaling:</p>
        <ul>
          <li><strong>No money needed</strong> &mdash; You're assigning contracts, not buying properties</li>
          <li><strong>No credit checks</strong> &mdash; You're not getting a mortgage</li>
          <li><strong>Fast returns</strong> &mdash; Typical wholesale deals close in 2-4 weeks</li>
          <li><strong>Low risk</strong> &mdash; Your earnest money deposit is usually $10-$100</li>
        </ul>

        <div class="highlight-box">
          <h2>Real Numbers on a Wholesale Deal:</h2>
          <ul>
            <li>Property ARV: $200,000</li>
            <li>Your contract price: $120,000 (60% of ARV)</li>
            <li>Assign to cash buyer at: $135,000</li>
            <li><strong style="color: #22c55e;">Your assignment fee: $15,000</strong></li>
            <li>Time invested: ~20 hours over 3 weeks</li>
          </ul>
        </div>

        <h2>Your Action Items:</h2>
        <p><span class="number-circle">1</span> Complete Module 5: Wholesaling Deep Dive</p>
        <p><span class="number-circle">2</span> Download the Assignment Contract template</p>
        <p><span class="number-circle">3</span> Start building your cash buyer list (Module 5, Lesson 4)</p>

        <p style="text-align: center;">
          <a href="${appUrl}/course" class="cta-button">Go to Module 5 &rarr;</a>
        </p>

        <p>Your first deal is out there waiting. Go find it.</p>
        <p>Rooting for you,<br><strong>The Freedom One Team</strong></p>
      `),
    },
    {
      delayHours: 336, // Day 14
      stepName: "Check-in & Progress",
      subject: `How's it going, ${"\u{1F4CA}"}? (Quick check-in)`,
      generateHtml: (name, appUrl) => emailWrapper(`
        <h1>Two Weeks In &mdash; How's It Going?</h1>
        <p>Hey ${name},</p>
        <p>It's been two weeks since you got your Business-in-a-Box. Let's check in.</p>

        <h2>Where You Should Be:</h2>
        <ul>
          <li><span class="check">&#10003;</span> Completed Modules 1-5 of the course</li>
          <li><span class="check">&#10003;</span> Chosen your primary exit strategy</li>
          <li><span class="check">&#10003;</span> Sent your first marketing (direct mail, social posts, or cold calls)</li>
          <li><span class="check">&#10003;</span> Started building your buyer/lender network</li>
        </ul>

        <div class="tip-box">
          <p style="color: #eab308; margin-bottom: 8px;"><strong>Not there yet? That's OK.</strong></p>
          <p style="color: #a3a3a3;">Life gets busy. The important thing is that you keep moving forward, even if it's just 30 minutes a day. Consistency beats intensity in this business.</p>
        </div>

        <h2>Level Up Your Game:</h2>
        <p>If you haven't already, consider adding the <strong>Freedom One App</strong> to your toolkit. The Deal Analyzer alone can save you from a bad deal that costs tens of thousands.</p>
        <ul>
          <li><strong>Deal Analyzer</strong> &mdash; Run the numbers in 60 seconds instead of 60 minutes</li>
          <li><strong>Rehab Estimator</strong> &mdash; Get accurate renovation costs by room</li>
          <li><strong>Pipeline CRM</strong> &mdash; Track every lead and deal in one place</li>
        </ul>

        <p style="text-align: center;">
          <a href="${appUrl}/pricing" class="cta-button">Explore App Plans &rarr;</a>
        </p>

        <p>Keep pushing forward. Every "no" gets you closer to a "yes."</p>
        <p>In your corner,<br><strong>The Freedom One Team</strong></p>
      `),
    },
    {
      delayHours: 720, // Day 30
      stepName: "30-Day Milestone",
      subject: "30 days in — time to scale up",
      generateHtml: (name, appUrl) => emailWrapper(`
        <h1>30 Days In &mdash; Time to Scale</h1>
        <p>Hey ${name},</p>
        <p>You've had the Business-in-a-Box for a full month now. Whether you've closed a deal or you're still building your pipeline, here's what to focus on next.</p>

        <h2>Month 2 Game Plan:</h2>
        <div class="highlight-box">
          <p><span class="number-circle">1</span> <strong>Double your marketing volume</strong><br>
          If you sent 50 letters last month, send 100 this month. Marketing is a numbers game.</p>
          
          <p><span class="number-circle">2</span> <strong>Add a second marketing channel</strong><br>
          If you've been doing direct mail, add cold calling. If you've been calling, add Facebook ads.</p>
          
          <p><span class="number-circle">3</span> <strong>Build your team</strong><br>
          Start connecting with title companies, contractors, and real estate attorneys in your market.</p>
          
          <p><span class="number-circle">4</span> <strong>Analyze 5 deals this week</strong><br>
          Practice makes perfect. The more deals you analyze, the faster you'll spot the winners.</p>
        </div>

        <h2>Resources to Review:</h2>
        <ul>
          <li>Module 8: Marketing & Lead Generation (advanced strategies)</li>
          <li>Module 10: Building Your Team</li>
          <li>The Lender Directory &mdash; start building lender relationships now</li>
        </ul>

        <p style="text-align: center;">
          <a href="${appUrl}/course" class="cta-button">Continue Learning &rarr;</a>
        </p>

        <p>The difference between successful investors and everyone else? They didn't quit in month 2.</p>
        <p>Keep going,<br><strong>The Freedom One Team</strong></p>
      `),
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// APP WELCOME DRIP SEQUENCE
// Triggered when someone subscribes to the app (Pro/Elite/Team)
// ═══════════════════════════════════════════════════════════════
export const APP_WELCOME_DRIP: DripSequence = {
  key: "app_welcome",
  name: "App Subscriber Welcome",
  description: "Onboarding emails for new app subscribers",
  steps: [
    {
      delayHours: 0, // Immediate
      stepName: "Welcome to the App",
      subject: "Your Freedom One app is ready — here's where to start",
      generateHtml: (name, appUrl) => emailWrapper(`
        <h1>Welcome to Freedom One, ${name}!</h1>
        <p>Your subscription is active and all tools are unlocked. Here's a quick tour of what you can do:</p>

        <div class="highlight-box">
          <h2>Your Toolkit:</h2>
          <ul>
            <li><span class="check">&#10003;</span> <strong>Deal Analyzer</strong> &mdash; Enter any property and get instant profitability analysis</li>
            <li><span class="check">&#10003;</span> <strong>Rehab Estimator</strong> &mdash; Room-by-room cost estimates with 3 material tiers</li>
            <li><span class="check">&#10003;</span> <strong>Quick Check</strong> &mdash; 60-second deal screening before deep analysis</li>
            <li><span class="check">&#10003;</span> <strong>Pipeline CRM</strong> &mdash; Track deals from lead to closing</li>
            <li><span class="check">&#10003;</span> <strong>SOW Generator</strong> &mdash; Professional scope of work documents</li>
            <li><span class="check">&#10003;</span> <strong>Portfolio Dashboard</strong> &mdash; Track your entire portfolio</li>
            <li><span class="check">&#10003;</span> <strong>Renovation Designer</strong> &mdash; AI-powered room visualizations</li>
          </ul>
        </div>

        <h2>Start Here:</h2>
        <p><span class="number-circle">1</span> Open the <strong>Deal Analyzer</strong> and enter a property you're considering</p>
        <p><span class="number-circle">2</span> Add comparable sales to calculate the After Repair Value (ARV)</p>
        <p><span class="number-circle">3</span> Use the <strong>Rehab Estimator</strong> to estimate renovation costs</p>

        <p style="text-align: center;">
          <a href="${appUrl}/analyzer" class="cta-button">Open the Deal Analyzer &rarr;</a>
        </p>

        <p>Welcome aboard,<br><strong>The Freedom One Team</strong></p>
      `),
    },
    {
      delayHours: 72, // Day 3
      stepName: "Feature Spotlight: Deal Analyzer",
      subject: "How to analyze a deal in under 2 minutes",
      generateHtml: (name, appUrl) => emailWrapper(`
        <h1>Analyze Any Deal in Under 2 Minutes</h1>
        <p>Hey ${name},</p>
        <p>The Deal Analyzer is the most powerful tool in your Freedom One toolkit. Here's how to use it like a pro:</p>

        <div class="highlight-box">
          <h2>Step-by-Step:</h2>
          <p><span class="number-circle">1</span> <strong>Enter the property address</strong> &mdash; The system auto-fills available data</p>
          <p><span class="number-circle">2</span> <strong>Set your purchase price</strong> &mdash; What you'd offer for the property</p>
          <p><span class="number-circle">3</span> <strong>Add 3-5 comparable sales</strong> &mdash; This determines your ARV</p>
          <p><span class="number-circle">4</span> <strong>Estimate rehab costs</strong> &mdash; Use the built-in Rehab Estimator or enter manually</p>
          <p><span class="number-circle">5</span> <strong>Review your deal score</strong> &mdash; The system calculates ROI, profit, and 70% rule compliance</p>
        </div>

        <div class="tip-box">
          <p style="color: #eab308; margin-bottom: 8px;"><strong>Pro Tip: The 70% Rule</strong></p>
          <p style="color: #a3a3a3;">Never pay more than 70% of ARV minus repair costs. If ARV is $200,000 and repairs are $30,000, your max offer is $110,000 (200K x 70% - 30K). The analyzer calculates this automatically.</p>
        </div>

        <p style="text-align: center;">
          <a href="${appUrl}/analyzer" class="cta-button">Try It Now &rarr;</a>
        </p>

        <p>The more deals you analyze, the better your instincts get.</p>
        <p>Happy analyzing,<br><strong>The Freedom One Team</strong></p>
      `),
    },
    {
      delayHours: 168, // Day 7
      stepName: "Feature Spotlight: Pipeline & SOW",
      subject: "Track every deal and create pro-level SOWs",
      generateHtml: (name, appUrl) => emailWrapper(`
        <h1>Your Deal Pipeline + Professional SOWs</h1>
        <p>Hey ${name},</p>
        <p>Two features that separate amateur investors from professionals: deal tracking and scope of work documents.</p>

        <h2>Pipeline CRM</h2>
        <p>Stop tracking deals on sticky notes. Your Pipeline lets you:</p>
        <ul>
          <li>Track deals through every stage: Lead &rarr; Contacted &rarr; Under Contract &rarr; Closed</li>
          <li>Store property details, notes, and financials in one place</li>
          <li>Never lose track of a follow-up again</li>
        </ul>

        <h2>SOW Generator</h2>
        <p>When you're ready to renovate, the SOW Generator creates professional scope of work documents that:</p>
        <ul>
          <li>Cover all 14 room categories with detailed line items</li>
          <li>Include material specifications and quantities</li>
          <li>Give contractors clear expectations (fewer change orders = more profit)</li>
        </ul>

        <p style="text-align: center;">
          <a href="${appUrl}/pipeline" class="cta-button">Open Your Pipeline &rarr;</a>
        </p>

        <p>Organization is profit. The more organized you are, the more deals you can handle.</p>
        <p>Stay sharp,<br><strong>The Freedom One Team</strong></p>
      `),
    },
    {
      delayHours: 336, // Day 14
      stepName: "Engagement Check-in",
      subject: "Are you getting the most out of Freedom One?",
      generateHtml: (name, appUrl) => emailWrapper(`
        <h1>Quick Check-In</h1>
        <p>Hey ${name},</p>
        <p>You've had the Freedom One app for two weeks. Here's a quick checklist to make sure you're getting full value:</p>

        <div class="highlight-box">
          <h2>Have You Tried:</h2>
          <ul>
            <li>&#9744; Analyzed at least 3 deals in the Deal Analyzer?</li>
            <li>&#9744; Created a rehab estimate with the Rehab Estimator?</li>
            <li>&#9744; Added a deal to your Pipeline?</li>
            <li>&#9744; Generated a Scope of Work document?</li>
            <li>&#9744; Used Quick Check for rapid deal screening?</li>
            <li>&#9744; Explored the Marketing Templates?</li>
            <li>&#9744; Checked out the Lender Directory?</li>
          </ul>
        </div>

        <p>If you haven't tried all of these yet, pick one and spend 10 minutes with it today. Each tool is designed to save you hours of work and thousands in mistakes.</p>

        <div class="tip-box">
          <p style="color: #eab308; margin-bottom: 8px;"><strong>Need Help?</strong></p>
          <p style="color: #a3a3a3;">Check the User Manual in the app (Resources &rarr; Manual) for step-by-step guides on every feature. Or email us at ${CONTACT_EMAIL} &mdash; we're here to help.</p>
        </div>

        <p style="text-align: center;">
          <a href="${appUrl}" class="cta-button">Open Freedom One &rarr;</a>
        </p>

        <p>Your success is our success,<br><strong>The Freedom One Team</strong></p>
      `),
    },
    {
      delayHours: 720, // Day 30
      stepName: "30-Day Value Reminder",
      subject: "You've had Freedom One for 30 days — here's what's new",
      generateHtml: (name, appUrl) => emailWrapper(`
        <h1>30 Days of Freedom One</h1>
        <p>Hey ${name},</p>
        <p>A full month with the platform! Here's what you might have missed and what's coming:</p>

        <h2>Features You Might Not Know About:</h2>
        <ul>
          <li><strong>Renovation Designer</strong> &mdash; Upload a room photo and see AI-generated renovation visualizations</li>
          <li><strong>Profit Calculator</strong> &mdash; Model 6 different scenarios for any deal</li>
          <li><strong>Portfolio Dashboard</strong> &mdash; Track your entire portfolio with PDF export</li>
          <li><strong>White-Label Reports</strong> &mdash; Generate branded reports for lenders and partners</li>
          <li><strong>Regional Pricing</strong> &mdash; Auto-adjusted costs for 50+ metro markets</li>
        </ul>

        <h2>Coming Soon:</h2>
        <ul>
          <li>Enhanced AI deal scoring</li>
          <li>Automated comp analysis</li>
          <li>Contractor management tools</li>
        </ul>

        <p>Your subscription includes all future updates at no extra cost.</p>

        <p style="text-align: center;">
          <a href="${appUrl}" class="cta-button">Explore New Features &rarr;</a>
        </p>

        <p>Thanks for being part of the Freedom One family,<br><strong>The Freedom One Team</strong></p>
      `),
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// APP ENGAGEMENT / RE-ENGAGEMENT DRIP
// Triggered for users who haven't logged in for 14+ days
// ═══════════════════════════════════════════════════════════════
export const APP_REENGAGEMENT_DRIP: DripSequence = {
  key: "app_reengagement",
  name: "App Re-engagement",
  description: "Win back inactive subscribers",
  steps: [
    {
      delayHours: 0, // Immediate (triggered by inactivity detection)
      stepName: "We Miss You",
      subject: "Your Freedom One tools are waiting for you",
      generateHtml: (name, appUrl) => emailWrapper(`
        <h1>We Haven't Seen You in a While</h1>
        <p>Hey ${name},</p>
        <p>It's been a bit since you logged into Freedom One. Your tools are still here, ready to help you find and close your next deal.</p>

        <h2>Quick Wins You Can Do in 5 Minutes:</h2>
        <ul>
          <li><strong>Quick Check a property</strong> &mdash; Enter any address for a 60-second deal screening</li>
          <li><strong>Browse the Lender Directory</strong> &mdash; Find hard money lenders in your area</li>
          <li><strong>Review a marketing template</strong> &mdash; Grab a direct mail letter and customize it</li>
        </ul>

        <p style="text-align: center;">
          <a href="${appUrl}" class="cta-button">Log Back In &rarr;</a>
        </p>

        <p>The best time to start was yesterday. The second best time is now.</p>
        <p>We're here when you're ready,<br><strong>The Freedom One Team</strong></p>
      `),
    },
    {
      delayHours: 168, // 7 days after first re-engagement
      stepName: "Success Story",
      subject: "How investors are using Freedom One to close deals",
      generateHtml: (name, appUrl) => emailWrapper(`
        <h1>Real Investors. Real Results.</h1>
        <p>Hey ${name},</p>
        <p>Here's how investors like you are using Freedom One every day:</p>

        <div class="highlight-box">
          <p><strong>Morning Routine (15 min):</strong></p>
          <ul>
            <li>Check pipeline for follow-ups due today</li>
            <li>Quick Check 2-3 new properties from overnight leads</li>
            <li>Review any new comps in target neighborhoods</li>
          </ul>
        </div>

        <div class="highlight-box">
          <p><strong>When a Lead Comes In (5 min):</strong></p>
          <ul>
            <li>Run Quick Check for instant go/no-go</li>
            <li>If promising, run full Deal Analysis</li>
            <li>Add to Pipeline with notes and next steps</li>
          </ul>
        </div>

        <div class="highlight-box">
          <p><strong>Before Making an Offer (20 min):</strong></p>
          <ul>
            <li>Full Deal Analysis with 3-5 comps</li>
            <li>Rehab Estimate by room</li>
            <li>Generate SOW for contractor bids</li>
            <li>Review deal score and 70% rule compliance</li>
          </ul>
        </div>

        <p style="text-align: center;">
          <a href="${appUrl}/analyzer" class="cta-button">Analyze a Deal Now &rarr;</a>
        </p>

        <p>Even 15 minutes a day with the tools keeps your investing momentum going.</p>
        <p>Let's get back to it,<br><strong>The Freedom One Team</strong></p>
      `),
    },
  ],
};

// Export all sequences
export const ALL_DRIP_SEQUENCES: DripSequence[] = [
  BIB_PURCHASE_DRIP,
  APP_WELCOME_DRIP,
  APP_REENGAGEMENT_DRIP,
];

export function getSequenceByKey(key: string): DripSequence | undefined {
  return ALL_DRIP_SEQUENCES.find((s) => s.key === key);
}
