// ============================================================
// Fix & Flip Analyzer — Marketing Templates
// Direct mail letters, postcards, and acquisition materials
// ============================================================

export interface MarketingTemplate {
  id: string;
  title: string;
  category: 'letter' | 'postcard' | 'email' | 'script' | 'bandit_sign';
  target: string;
  description: string;
  body: string;
  tips: string[];
}

export const MARKETING_TEMPLATES: MarketingTemplate[] = [
  // ─── DIRECT MAIL LETTERS ───────────────────────────────────
  {
    id: 'letter-distressed',
    title: 'Distressed Property Owner Letter',
    category: 'letter',
    target: 'Owners of properties with code violations, deferred maintenance, or pre-foreclosure',
    description: 'A warm, empathetic letter to homeowners facing property challenges. Positions you as a helpful solution, not a predator.',
    body: `[Your Name]
[Your Company Name]
[Your Address]
[City, State ZIP]
[Phone Number]
[Email]

[Date]

[Homeowner Name]
[Property Address]
[City, State ZIP]

Dear [Homeowner Name],

I hope this letter finds you well. My name is [Your Name], and I'm a local real estate investor here in [City/Area]. I'm reaching out because I noticed your property at [Property Address] and wanted to see if I might be able to help.

I understand that life can throw unexpected challenges our way — whether it's a job change, family situation, health issue, or simply a property that's become more of a burden than a blessing. Whatever your situation may be, I want you to know that you have options.

I buy homes in any condition — as-is, no repairs needed. Here's what I can offer:

• A fair, no-obligation cash offer within 24 hours
• You choose the closing date that works for you
• No real estate agent commissions or fees
• No inspections or appraisals required
• I handle all the paperwork and closing costs

There's absolutely no pressure and no obligation. I simply want to have a conversation to see if I can help.

If you're even slightly curious, please give me a call at [Phone Number] or send me a text. You can also email me at [Email]. I'm happy to answer any questions you might have.

Wishing you all the best,

[Your Name]
[Your Company Name]

P.S. — Even if you're not interested in selling right now, feel free to keep my information. You never know when it might come in handy, and I'm always happy to chat about your options.`,
    tips: [
      'Use yellow or cream-colored paper for higher open rates',
      'Handwrite the envelope address for a personal touch',
      'Use a live stamp instead of metered postage',
      'Follow up with a second letter 2-3 weeks later',
      'Include a business card in the envelope',
    ],
  },
  {
    id: 'letter-absentee',
    title: 'Absentee Owner Letter',
    category: 'letter',
    target: 'Property owners who live at a different address than the property (landlords, inherited properties)',
    description: 'Targets absentee owners who may be tired of managing a rental property from a distance.',
    body: `[Your Name]
[Your Company Name]
[Your Address]
[City, State ZIP]
[Phone Number]

[Date]

[Owner Name]
[Owner Mailing Address]
[City, State ZIP]

RE: Your property at [Property Address]

Dear [Owner Name],

I'm writing to you regarding your property located at [Property Address]. As a local real estate investor, I work with property owners who may be interested in selling their investment properties — especially those who manage them from out of the area.

Managing a property from a distance can be challenging. Between finding reliable tenants, handling maintenance calls, dealing with property managers, and keeping up with local regulations, it can sometimes feel like more trouble than it's worth.

If you've ever thought about cashing out of your investment, I'd love to make you a fair offer. Here's what makes working with me different:

• Cash offer — no financing contingencies
• Close on your timeline — as fast as 7 days or whenever works for you
• No agent commissions (save 5-6% of the sale price)
• Buy as-is — no repairs, no cleaning, no staging
• I can work around existing tenants

Even if you're not ready to sell today, I'd be happy to provide a free, no-obligation property valuation so you know what your options are.

Give me a call or text at [Phone Number], or reply to this letter. I look forward to hearing from you.

Best regards,

[Your Name]
[Your Company Name]`,
    tips: [
      'Pull absentee owner lists from your county assessor or a data provider like PropStream',
      'Highlight the "no agent commission" savings prominently',
      'Send to both the property address and the mailing address',
      'Follow up with a postcard 10 days later',
    ],
  },
  {
    id: 'letter-probate',
    title: 'Probate / Inherited Property Letter',
    category: 'letter',
    target: 'Heirs and executors of estates going through probate',
    description: 'A sensitive, respectful letter to families who have inherited a property and may not want the burden of managing or selling it traditionally.',
    body: `[Your Name]
[Your Company Name]
[Your Address]
[City, State ZIP]
[Phone Number]

[Date]

[Heir/Executor Name]
[Mailing Address]
[City, State ZIP]

Dear [Heir/Executor Name],

First and foremost, I want to extend my sincere condolences for your loss. I understand this is a difficult time, and the last thing you need is additional stress.

My name is [Your Name], and I help families in [City/Area] who have inherited properties and need a simple, hassle-free way to handle them. I understand that dealing with an inherited property can be overwhelming — especially when you're also navigating the probate process.

I specialize in purchasing inherited properties, and I can make the process as easy as possible for you:

• I buy properties in any condition — no need to clean out, repair, or renovate
• I can work with your probate attorney to ensure everything is handled properly
• Cash offer with a flexible closing timeline
• No real estate commissions or hidden fees
• I handle all the details so you don't have to

There is absolutely no obligation, and I'm happy to simply answer questions about your options — even if you decide not to sell.

Please feel free to reach out at your convenience:
Phone/Text: [Phone Number]
Email: [Email]

I'm here to help in whatever way I can.

With warm regards,

[Your Name]
[Your Company Name]`,
    tips: [
      'Be extremely respectful and empathetic in tone',
      'Wait at least 30-60 days after the death before sending',
      'Use a plain white envelope with a handwritten address',
      'Never use aggressive or urgent language',
      'Consider including a small sympathy card',
    ],
  },
  {
    id: 'letter-expired',
    title: 'Expired Listing Letter',
    category: 'letter',
    target: 'Homeowners whose MLS listing expired without selling',
    description: 'Targets frustrated sellers whose property failed to sell through traditional channels.',
    body: `[Your Name]
[Your Company Name]
[Your Address]
[City, State ZIP]
[Phone Number]

[Date]

[Homeowner Name]
[Property Address]
[City, State ZIP]

Dear [Homeowner Name],

I noticed that your home at [Property Address] was recently listed for sale but didn't sell. I know that can be frustrating — especially after all the time spent keeping the house show-ready, dealing with showings, and waiting for offers that never came.

I'm a local real estate investor, and I buy homes directly from homeowners. I wanted to reach out because I may be able to offer you an alternative that's faster and simpler than going back on the market.

Here's how I'm different from a traditional sale:

• I make a cash offer within 24 hours — no waiting for buyer financing
• No open houses, no showings, no strangers walking through your home
• No repairs or updates needed — I buy as-is
• No agent commissions on my side
• I can close in as little as 7-14 days, or on your schedule

I understand my offer may be different from what you were hoping to get on the open market. But for many homeowners, the certainty of a guaranteed cash sale — without months of uncertainty — is worth it.

Would you be open to a quick, no-obligation conversation? Call or text me at [Phone Number].

Sincerely,

[Your Name]
[Your Company Name]`,
    tips: [
      'Send within 1-2 weeks of the listing expiring',
      'Acknowledge their frustration without criticizing their previous agent',
      'Pull expired listing data from your MLS or a service like REDX',
    ],
  },

  // ─── POSTCARDS ─────────────────────────────────────────────
  {
    id: 'postcard-cash-buyer',
    title: 'Cash Buyer Postcard',
    category: 'postcard',
    target: 'General homeowners in target neighborhoods',
    description: 'A bold, attention-grabbing postcard for mass mailing to target neighborhoods.',
    body: `═══════════════════════════════════════
         FRONT OF POSTCARD
═══════════════════════════════════════

🏠  WE BUY HOUSES — CASH!

Sell Your Home Fast. No Repairs. No Hassle.

✓ Any Condition    ✓ Close in 7 Days
✓ No Commissions   ✓ Cash Offer in 24 Hrs

CALL NOW: [Phone Number]
[Your Website]

═══════════════════════════════════════
         BACK OF POSTCARD
═══════════════════════════════════════

Dear Homeowner,

Are you thinking about selling your home? We're local investors looking to buy properties in [City/Area].

We buy houses in ANY condition:
• Behind on payments? We can help.
• Need repairs you can't afford? No problem.
• Inherited a property? We make it easy.
• Tired of being a landlord? We'll take it off your hands.
• Going through divorce? We can close quickly and discreetly.

Get a FREE, no-obligation cash offer today!

📞 Call/Text: [Phone Number]
📧 Email: [Email]
🌐 Visit: [Your Website]

[Your Name] | [Your Company Name]
[Your Address]`,
    tips: [
      'Use bright yellow or orange card stock for maximum visibility',
      'Keep the front bold and simple — it should be readable in 3 seconds',
      'Include a clear call-to-action phone number in large font',
      'Mail consistently — send to the same list every 4-6 weeks',
      'Track responses with a unique phone number or URL per campaign',
    ],
  },
  {
    id: 'postcard-just-sold',
    title: '"Just Sold" Investor Postcard',
    category: 'postcard',
    target: 'Neighbors of a property you recently purchased or sold',
    description: 'Leverage social proof by mailing neighbors of a recent deal to generate new leads.',
    body: `═══════════════════════════════════════
         FRONT OF POSTCARD
═══════════════════════════════════════

🏡  JUST SOLD!
    [Property Address]

We recently purchased this home in your neighborhood — and we're looking to buy more!

Do you know anyone thinking about selling?

═══════════════════════════════════════
         BACK OF POSTCARD
═══════════════════════════════════════

Dear Neighbor,

We just purchased a home right in your neighborhood at [Property Address], and we'd love to buy another one nearby!

If you or anyone you know is thinking about selling — for any reason — we'd love to chat. We pay cash, close fast, and buy homes in any condition.

🎁 REFERRAL BONUS: Know someone who sells to us? We'll send you a $500 thank-you check at closing!

📞 [Phone Number]
🌐 [Your Website]

[Your Name] | [Your Company Name]`,
    tips: [
      'Include a photo of the actual property on the front if possible',
      'The referral bonus is a powerful motivator — honor it every time',
      'Mail to 100-200 nearest neighbors within a 0.5 mile radius',
      'Send within 1-2 weeks of closing',
    ],
  },
  {
    id: 'postcard-landlord',
    title: 'Tired Landlord Postcard',
    category: 'postcard',
    target: 'Landlords and rental property owners',
    description: 'Targets landlords who may be burned out from property management.',
    body: `═══════════════════════════════════════
         FRONT OF POSTCARD
═══════════════════════════════════════

😩  TIRED OF BEING A LANDLORD?

Late rent. Maintenance calls. Problem tenants.
We get it. Let us take it off your hands.

WE BUY RENTAL PROPERTIES — CASH
Even with tenants in place!

═══════════════════════════════════════
         BACK OF POSTCARD
═══════════════════════════════════════

Dear Property Owner,

If you're tired of dealing with:
❌ Late or missing rent payments
❌ Expensive repairs and maintenance
❌ Difficult tenants
❌ Property management headaches
❌ Rising insurance and tax costs

...then let's talk. We buy rental properties for CASH — even with tenants still living there. No need to evict, no need to repair, no need to clean.

• Cash offer in 24 hours
• Close on your schedule
• No commissions or fees
• We handle the tenants

📞 Call/Text: [Phone Number]
📧 [Email]

[Your Name] | [Your Company Name]`,
    tips: [
      'Pull landlord lists from tax records (owner address differs from property address)',
      'Emphasize that you can close with tenants in place — this is a huge selling point',
      'Consider targeting owners of properties with recent code violations',
    ],
  },

  // ─── EMAIL TEMPLATES ───────────────────────────────────────
  {
    id: 'email-followup',
    title: 'Lead Follow-Up Email Sequence',
    category: 'email',
    target: 'Leads who have responded to marketing but haven\'t committed',
    description: 'A 5-email drip sequence for nurturing leads who showed initial interest.',
    body: `EMAIL 1 — Sent immediately after first contact
Subject: Quick follow-up about your property at [Address]
─────────────────────────────────────────────

Hi [Name],

Thanks for reaching out about your property at [Address]. I wanted to follow up and let you know I'm very interested.

I'd love to schedule a quick 10-minute call to learn more about your situation and see how I can help. What time works best for you this week?

In the meantime, here's a bit about how I work:
• I buy homes as-is — no repairs needed
• Cash offers, typically within 24 hours
• You pick the closing date
• No commissions or hidden fees

Looking forward to connecting!

[Your Name]
[Phone Number]


EMAIL 2 — Sent 3 days later
Subject: Still thinking about selling [Address]?
─────────────────────────────────────────────

Hi [Name],

I wanted to check in and see if you've had a chance to think about selling your property at [Address].

I know it's a big decision, and there's no rush. I just want to make sure you know I'm here whenever you're ready to explore your options.

Would it help if I sent over a free, no-obligation estimate of what I could offer? No strings attached.

Just reply to this email or call me at [Phone Number].

Best,
[Your Name]


EMAIL 3 — Sent 7 days later
Subject: A quick question about [Address]
─────────────────────────────────────────────

Hi [Name],

I have a quick question — what would need to happen for you to feel comfortable moving forward with selling [Address]?

I ask because every homeowner's situation is different, and I want to make sure I can tailor my offer to work for you. Whether it's:

• A higher price
• A longer closing timeline
• Help with moving
• Paying off liens or back taxes

...I'm flexible and creative. Let's find a solution that works for both of us.

[Your Name]
[Phone Number]


EMAIL 4 — Sent 14 days later
Subject: Market update for [Neighborhood/City]
─────────────────────────────────────────────

Hi [Name],

I wanted to share a quick market update: properties in [Area] have been [selling quickly / appreciating / etc.]. This could be a great time to explore your options.

I recently purchased a property nearby at [Recent Purchase Address] and I'm actively looking for my next project in the area.

If you're still considering selling [Address], I'd love to make you an offer. No pressure — just a conversation.

[Your Name]
[Phone Number]


EMAIL 5 — Sent 30 days later
Subject: Last check-in about [Address]
─────────────────────────────────────────────

Hi [Name],

I don't want to be a pest, so this will be my last email for a while. I just wanted to let you know that my offer to purchase your property at [Address] still stands.

If your situation changes in the future — whether it's next month or next year — please don't hesitate to reach out. I'll be here.

Wishing you all the best,

[Your Name]
[Phone Number]
[Email]

P.S. — If you know anyone else who might be looking to sell a property, I'd be happy to help them too. I pay $500 referral bonuses for any deal that closes!`,
    tips: [
      'Use a CRM to automate this sequence (Podio, REI BlackBook, InvestorFuse)',
      'Personalize each email with the actual property address',
      'Space emails further apart after the first week to avoid being annoying',
      'Always include a way to unsubscribe or opt out',
    ],
  },

  // ─── PHONE SCRIPTS ─────────────────────────────────────────
  {
    id: 'script-cold-call',
    title: 'Cold Call Script for Motivated Sellers',
    category: 'script',
    target: 'Property owners from purchased lead lists',
    description: 'A conversational cold call script designed to build rapport and identify motivation.',
    body: `COLD CALL SCRIPT — MOTIVATED SELLER
═════════════════════════════════════

[OPENING]
"Hi, is this [Owner Name]? Great! My name is [Your Name], and I'm a local real estate investor here in [City]. I'm reaching out because I'm looking to buy a property in your area, and I noticed you own [Property Address]. I was wondering — have you ever considered selling that property?"

[IF YES / MAYBE]
"That's great to hear! I'd love to learn more. Can I ask you a few quick questions?"

1. "How long have you owned the property?"
2. "Is anyone currently living there?"
3. "What condition would you say the property is in on a scale of 1-10?"
4. "Is there a mortgage on the property? Do you know roughly what you owe?"
5. "If we could come to a fair agreement, how quickly would you want to close?"
6. "What price did you have in mind?" (Let them answer first!)

[IF NO]
"No problem at all! I totally understand. Would it be okay if I checked back with you in a few months? Sometimes situations change, and I want to make sure you know you have options. Also — if you know anyone who might be looking to sell, I pay referral bonuses!"

[CLOSING — IF INTERESTED]
"Based on what you've told me, I'd love to take a closer look and put together a fair offer for you. I can usually have something ready within 24 hours. What's the best way to reach you — is this number good? And what's your email? Great, I'll be in touch very soon. Thanks so much for your time, [Name]!"

[KEY REMINDERS]
• Be conversational, not scripted-sounding
• Listen more than you talk (80/20 rule)
• Never pressure — you're offering a solution
• Take detailed notes for your CRM
• Follow up within 24 hours with an offer or next steps`,
    tips: [
      'Practice the script until it sounds natural, not robotic',
      'Call between 10am-12pm and 4pm-6pm for best contact rates',
      'Use a dialer system like Mojo or BatchDialer for efficiency',
      'Track your metrics: calls, contacts, appointments, contracts',
    ],
  },

  // ─── BANDIT SIGNS ──────────────────────────────────────────
  {
    id: 'bandit-sign',
    title: 'Bandit Sign Templates',
    category: 'bandit_sign',
    target: 'Drive-by traffic in target neighborhoods',
    description: 'Simple, high-visibility corrugated sign designs for street-level marketing.',
    body: `DESIGN 1 — Classic Cash Buyer
═══════════════════════════════
┌─────────────────────────────┐
│                             │
│    WE BUY HOUSES            │
│         CASH!               │
│                             │
│    Any Condition             │
│    Close in 7 Days          │
│                             │
│    📞 (555) 123-4567        │
│                             │
└─────────────────────────────┘
Colors: Yellow background, Black text
Size: 18" x 24"


DESIGN 2 — Handwritten Style
═══════════════════════════════
┌─────────────────────────────┐
│                             │
│   I Buy Houses              │
│   CASH - Fast Close         │
│                             │
│   Call [Name]               │
│   (555) 123-4567            │
│                             │
└─────────────────────────────┘
Colors: White background, Red & Blue text
Style: Handwritten font for personal feel


DESIGN 3 — Problem Solver
═══════════════════════════════
┌─────────────────────────────┐
│                             │
│   BEHIND ON PAYMENTS?       │
│   FACING FORECLOSURE?       │
│                             │
│   We Can Help!              │
│   We Buy Houses AS-IS       │
│                             │
│   📞 (555) 123-4567        │
│                             │
└─────────────────────────────┘
Colors: Red background, White text


DESIGN 4 — Landlord Focused
═══════════════════════════════
┌─────────────────────────────┐
│                             │
│   TIRED LANDLORD?           │
│                             │
│   I'll Buy Your Rental      │
│   Property for CASH         │
│   Even With Tenants!        │
│                             │
│   📞 (555) 123-4567        │
│                             │
└─────────────────────────────┘
Colors: Orange background, Black text`,
    tips: [
      'Check local ordinances — bandit signs are illegal in many cities',
      'Place at busy intersections on Friday evenings for weekend calls',
      'Use a dedicated Google Voice number to track sign responses',
      'Replace damaged or missing signs weekly',
      'Order in bulk from BuildASign.com or Amazon (100+ for best pricing)',
    ],
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: 'letter', label: 'Direct Mail Letters', icon: '✉️' },
  { id: 'postcard', label: 'Postcards', icon: '📬' },
  { id: 'email', label: 'Email Sequences', icon: '📧' },
  { id: 'script', label: 'Phone Scripts', icon: '📞' },
  { id: 'bandit_sign', label: 'Bandit Signs', icon: '🪧' },
] as const;
