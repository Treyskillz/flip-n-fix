// ============================================================
// Fix & Flip Mastery 2026 — Video Course Scripts
// Complete presenter scripts for recording the video version
// of each lesson. Includes talking points, screen recording
// directions, B-roll suggestions, and presenter cues.
// ============================================================

export interface VideoScript {
  lessonId: string;
  estimatedRuntime: string;
  equipment: string;
  openingHook: string;
  segments: VideoSegment[];
  closingCTA: string;
  bRollSuggestions: string[];
}

export interface VideoSegment {
  title: string;
  type: 'talking-head' | 'screen-recording' | 'slides' | 'b-roll' | 'whiteboard';
  duration: string;
  script: string;
  directions: string;
}

export const VIDEO_SCRIPTS: Record<string, VideoScript> = {
  // ─────────────────────────────────────────────────────────
  // MODULE 1: Foundation
  // ─────────────────────────────────────────────────────────
  'l-1-1': {
    lessonId: 'l-1-1',
    estimatedRuntime: '18:30',
    equipment: 'Camera (talking head), screen recording software, slide deck',
    openingHook: `"If you've been waiting for the 'perfect time' to start investing in real estate — I want to show you why 2026 might be the best opportunity we've seen in a decade. And by the end of this video, you'll understand exactly why."`,
    segments: [
      {
        title: 'Introduction & Hook',
        type: 'talking-head',
        duration: '2:00',
        script: `Welcome to Fix & Flip Mastery 2026. I'm excited to kick off this course with you because we're going to cover everything you need to know to analyze deals, estimate rehabs, and maximize your profit on every property.

But first — why fix and flip in 2026? A lot of people think the market is too hot, too cold, or too uncertain. I'm going to show you the data that tells a very different story.

The investors who are going to win in 2026 are the ones who analyze deals with precision — not gut feeling. And that's exactly what this course and the Freedom One platform are designed to help you do.`,
        directions: 'Presenter on camera, confident and energetic. Use hand gestures when emphasizing key points. Background should be a clean office or property setting.',
      },
      {
        title: 'Current Market Conditions',
        type: 'slides',
        duration: '5:00',
        script: `Let's look at the numbers. After years of elevated interest rates, the market has stabilized. And here's what that means for us as investors.

First — motivated sellers are everywhere. Homeowners who bought at peak prices in 2021 and 2022 are now underwater or unable to sell traditionally. That creates opportunity.

Second — the housing supply shortage. The U.S. still has a deficit of 4 to 6 million homes. That structural shortage supports property values and ensures strong demand for renovated homes.

Third — aging housing stock. Over 50% of U.S. homes were built before 1980. These properties need significant updates to meet modern buyer expectations. That's our inventory.

And fourth — technology. Tools like the Freedom One Analyzer give you a data-driven edge that previous generations of investors never had. You can analyze a deal in minutes, not days.`,
        directions: 'Show slides with market data charts: housing deficit graph, interest rate timeline, housing age distribution. Transition between slides as each point is made.',
      },
      {
        title: 'The 2026 Investor Advantage',
        type: 'talking-head',
        duration: '4:00',
        script: `So who's going to thrive in 2026? It's the investors who do five things consistently.

One — they analyze deals with precision. No more "I think this will work." You run the numbers, every time.

Two — they understand multiple exit strategies. If a flip doesn't work, maybe it's a BRRRR. Maybe it's a wholesale. We'll cover all five exit strategies in this course.

Three — they build systems. Systems for finding deals, analyzing them, managing rehabs, and selling properties. That's what separates a hobby investor from a business owner.

Four — they manage rehabs efficiently. A detailed scope of work with real pricing — not guesswork — is the difference between a profitable flip and a money pit.

And five — they market properties effectively. The best rehab in the world doesn't matter if you can't sell it for top dollar.

Throughout this course, I'm going to show you how to do all five of these things using the Freedom One platform.`,
        directions: 'Presenter on camera. Count off each point on fingers. Maintain eye contact with camera. Consider using a numbered list graphic overlay for each point.',
      },
      {
        title: 'Course Overview',
        type: 'slides',
        duration: '3:00',
        script: `Here's what we're going to cover in this course.

Module 1 — that's this module — covers the foundation. Your mindset, your business entity, and building your power team.

Module 2 is all about finding deals. The seven best lead sources, and how to analyze deals using the numbers that actually matter.

Modules 3 through 7 each cover a different exit strategy: Fix and Flip, Wholesaling, BRRRR, Subject-To, and Short-Term Rentals.

Module 8 covers financing — every option available to you, from hard money to seller financing to self-directed IRAs.

And Module 9 — this is where it all comes together — is a complete hands-on walkthrough of every tool in the Freedom One platform. The Deal Analyzer, SOW Templates, Portfolio Dashboard, Property Photos, Marketing Templates, Contracts, and more.

By the end of this course, you'll have the knowledge AND the tools to analyze, fund, rehab, and sell your first — or your next — investment property.`,
        directions: 'Show course outline slide with all 9 modules listed. Highlight each module as it is mentioned. End with a motivational graphic.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '1:30',
        script: `That's the big picture. In the next lesson, we're going to get practical — I'll walk you through setting up your business entity so you're protected from day one.

If you haven't already, make sure you have access to the Freedom One platform. You're going to need it for the hands-on exercises throughout this course.

Let's get started.`,
        directions: 'Presenter on camera, warm and encouraging tone. Point to camera when saying "you." End with a confident nod.',
      },
    ],
    closingCTA: 'Continue to the next lesson: Setting Up Your Business Entity',
    bRollSuggestions: [
      'Aerial drone footage of residential neighborhoods with mix of renovated and distressed properties',
      'Time-lapse of a property renovation (before/during/after)',
      'Screen recording of the Freedom One Deal Analyzer interface',
      'Stock footage of real estate investors reviewing documents',
      'Charts and graphs showing housing market data',
    ],
  },

  'l-1-2': {
    lessonId: 'l-1-2',
    estimatedRuntime: '22:15',
    equipment: 'Camera (talking head), slide deck, whiteboard or digital whiteboard',
    openingHook: `"Before you buy your first property, there's one thing you absolutely must do — and most new investors skip it. Let me show you how to set up your business the right way from day one."`,
    segments: [
      {
        title: 'Why Entity Structure Matters',
        type: 'talking-head',
        duration: '3:00',
        script: `Welcome back. In this lesson, we're covering something that isn't glamorous but is absolutely critical — setting up your business entity.

I've seen too many new investors skip this step. They buy a property in their personal name, something goes wrong during the rehab, and suddenly their personal assets — their home, their savings, their car — are all at risk.

A proper business entity protects you. It separates your personal life from your business risk. And it gives you tax advantages that can save you thousands of dollars every year.

So let's walk through your options.`,
        directions: 'Presenter on camera, serious but approachable tone. This is important foundational content — convey urgency without being scary.',
      },
      {
        title: 'Entity Types Comparison',
        type: 'whiteboard',
        duration: '8:00',
        script: `There are three main entity types for real estate investors. Let me draw this out for you.

First — the LLC, or Limited Liability Company. This is the most popular choice, and for good reason. It protects your personal assets from business liabilities. It has pass-through taxation, meaning no double taxation. It's flexible in how you manage it. And it's relatively cheap to form — anywhere from 50 to 500 dollars depending on your state.

Second — the Series LLC. This is available in some states like Texas, Delaware, Illinois, and Nevada. The big advantage here is that each property can be in its own "series" within one LLC. So if something goes wrong with Property A, Property B is protected. It's like having multiple LLCs for the cost of one.

Third — the S-Corp. This is sometimes used in conjunction with an LLC, especially for investors doing three or more flips per year. The advantage is it can reduce your self-employment taxes on flip profits. But it comes with more complex tax filing requirements.

For most new investors, I recommend starting with a simple LLC. You can always restructure later as your portfolio grows.`,
        directions: 'Draw a comparison chart on whiteboard showing LLC vs Series LLC vs S-Corp with pros/cons for each. Use different colored markers. Circle LLC as the recommended starting point.',
      },
      {
        title: 'Business Setup Checklist',
        type: 'slides',
        duration: '6:00',
        script: `Now let me give you the step-by-step checklist for setting up your business. I'm going to go through each item, and I want you to treat this as your action plan for this week.

Step 1 — Form your LLC. File with your state's Secretary of State. Most states let you do this online in about 15 minutes.

Step 2 — Get an EIN. That's your Employer Identification Number. It's free from IRS.gov and takes about 5 minutes. You need this to open a business bank account.

Step 3 — Open a business bank account. This is non-negotiable. You must keep personal and business finances completely separate. Any bank will do — just bring your LLC documents and EIN.

Step 4 — Get business insurance. You need general liability insurance, and you'll need property insurance for each project. Talk to an insurance agent who works with real estate investors.

Step 5 — Set up your accounting system. QuickBooks is the most popular choice. Wave is a free alternative. Or hire a bookkeeper — it's worth the investment.

Step 6 — Build your team. We'll cover this in detail in the next lesson, but you need a real estate attorney, a CPA, an insurance agent, and a title company at minimum.

Step 7 — Create your brand. Business name, logo, website, and business cards. This doesn't have to be expensive — you can start simple and upgrade later.

Step 8 — Set up your CRM. A Customer Relationship Management system to track your leads, deals, and contacts. Podio and REI BlackBook are popular in the investing space.`,
        directions: 'Show checklist slide with each item appearing as it is discussed. Add checkmarks as each item is covered. Include estimated cost and time for each step.',
      },
      {
        title: 'Tax Considerations',
        type: 'talking-head',
        duration: '4:00',
        script: `Now I need to talk about taxes, because this catches a lot of new flippers off guard.

Fix and flip profits are typically taxed as ordinary income — not capital gains. That means if you're in the 24% tax bracket, you're paying 24% on your flip profits. Plus, the IRS may classify you as a "dealer" if you flip frequently, which means self-employment tax of 15.3% on top of that.

So on a $50,000 profit, you could be looking at $15,000 to $20,000 in taxes. That's real money.

This is why I said earlier that a CPA who specializes in real estate is not optional — it's mandatory. A good CPA will help you structure your business to minimize your tax burden legally.

One strategy many experienced investors use is the two-entity approach. You have an Acquisition LLC that buys and rehabs properties — that's your flipping business. And you have a separate Holding LLC that holds rental properties for long-term wealth building. This separation provides additional liability protection and tax planning flexibility.

Talk to your CPA about what structure makes sense for your situation.`,
        directions: 'Presenter on camera, serious tone. Show a simple tax calculation example on screen as an overlay graphic. Emphasize the importance of professional tax advice.',
      },
      {
        title: 'Closing & Action Items',
        type: 'talking-head',
        duration: '1:15',
        script: `Here's your homework for this lesson. Before you move on to the next video, I want you to complete at least the first three items on that checklist: form your LLC, get your EIN, and open your business bank account.

These three steps take less than a day and they set the foundation for everything else we're going to build in this course.

In the next lesson, we're going to build your power team — the people you need in your corner to succeed as an investor. I'll see you there.`,
        directions: 'Presenter on camera, motivational tone. Hold up three fingers when listing the three action items.',
      },
    ],
    closingCTA: 'Action items: Form LLC, get EIN, open business bank account. Then continue to next lesson.',
    bRollSuggestions: [
      'Stock footage of someone filing documents online',
      'Business bank account opening process',
      'CPA or accountant reviewing financial documents',
      'Professional office setting with legal documents',
      'Screenshot of state Secretary of State LLC filing page',
    ],
  },

  'l-1-3': {
    lessonId: 'l-1-3',
    estimatedRuntime: '16:00',
    equipment: 'Camera (talking head), slide deck',
    openingHook: `"No successful real estate investor works alone. In this lesson, I'm going to introduce you to the six people you need on your team — and exactly how to find them."`,
    segments: [
      {
        title: 'Why You Need a Team',
        type: 'talking-head',
        duration: '2:00',
        script: `Welcome back. One of the biggest mistakes I see new investors make is trying to do everything themselves. They want to find the deals, analyze the numbers, manage the rehab, do the marketing, handle the closing — everything.

And here's what happens: they burn out, they make mistakes, and they leave money on the table.

The most successful investors I know have a team. Not a huge team — six core people who each bring expertise that you don't have. Let me introduce you to each one.`,
        directions: 'Presenter on camera, conversational tone. This should feel like advice from a mentor.',
      },
      {
        title: 'The Core Six',
        type: 'slides',
        duration: '8:00',
        script: `Number one — your Real Estate Attorney. Budget 300 to 500 dollars per closing. They review and draft contracts, handle title issues and liens, and advise on entity structure. To find one, ask other investors at your local REIA meetings. You want someone who understands investor transactions, not just residential closings.

Number two — your CPA or Tax Strategist. Budget 500 to 2,000 dollars per year. They structure your business for tax efficiency, handle quarterly estimated taxes, and maximize your deductions — mileage, home office, materials, everything. Look for CPAs who specialize in real estate investment. A general CPA won't cut it.

Number three — your General Contractor. They don't cost you anything upfront — they bid on your projects. They manage your rehab, provide accurate bids and timelines, pull permits, and manage subcontractors. Always get three bids on every project. Check references. Verify their license and insurance.

Number four — an Investor-Friendly Real Estate Agent. They pull comps and market data, list your finished flips on the MLS, and may help find off-market deals. Look for agents who also invest or specialize in working with investors.

Number five — your Title Company or Closing Attorney. They handle closings and escrow, provide title insurance, and manage document recording. Ask other investors which title companies are "investor-friendly" — meaning fast and flexible.

Number six — your Hard Money Lender. They finance your purchases and rehabs with fast closings — typically 7 to 14 days. We have a full Lender Directory in the Freedom One platform that you can use to find lenders in your area.`,
        directions: 'Show a slide for each team member with their role, cost, and how to find them. Use professional headshot-style icons for each role.',
      },
      {
        title: 'Where to Network',
        type: 'talking-head',
        duration: '4:00',
        script: `Now, how do you actually find these people? Here are the five best places to network with real estate professionals.

First — your local REIA, or Real Estate Investors Association. Most cities have monthly meetings. This is the single best place to meet other investors, contractors, lenders, and agents who work with investors. Google "REIA" plus your city name.

Second — BiggerPockets.com. This is the largest online community for real estate investors. They have forums, local meetups, and a podcast. Create a free account and start engaging.

Third — Facebook Groups. Search for your city plus "real estate investors." Most cities have active groups where deals, contractors, and advice are shared daily.

Fourth — Meetup.com. Search for real estate investing meetups in your area. These tend to be smaller and more intimate than REIA meetings.

Fifth — the courthouse steps. If your area has foreclosure auctions, show up. You'll meet other investors, wholesalers, and lenders who are actively doing deals.

The key is consistency. Don't go to one meeting and give up. Show up every month, introduce yourself, and tell people what you're looking for. Your network is your net worth in this business.`,
        directions: 'Presenter on camera, enthusiastic tone. Count off networking locations on fingers. Consider showing logos/screenshots of BiggerPockets, Meetup, etc. as overlays.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Your action item for this lesson: attend one networking event this month. Just one. Whether it's a REIA meeting, a BiggerPockets meetup, or a Facebook group event — get out there and start building your team.

That wraps up Module 1 — your foundation. You now understand the market opportunity, you have your business entity set up, and you know who you need on your team.

In Module 2, we're going to get into the exciting stuff — finding deals. I'll show you the seven best lead sources for 2026 and how to analyze deals like a pro. See you there.`,
        directions: 'Presenter on camera, encouraging and forward-looking tone. Smile and nod at the end.',
      },
    ],
    closingCTA: 'Action item: Attend one networking event this month. Then move to Module 2.',
    bRollSuggestions: [
      'Footage of a REIA meeting or real estate networking event',
      'People shaking hands at a professional event',
      'Contractor on a job site reviewing plans',
      'Real estate agent showing a property',
      'Screenshot of BiggerPockets forum',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 2: Finding Deals
  // ─────────────────────────────────────────────────────────
  'l-2-1': {
    lessonId: 'l-2-1',
    estimatedRuntime: '26:00',
    equipment: 'Camera (talking head), slide deck, screen recording software',
    openingHook: `"The number one question I get from new investors is: 'Where do I find deals?' In this lesson, I'm going to give you seven proven lead sources — ranked by cost, response rate, and scalability."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '2:00',
        script: `Welcome to Module 2. This is where things get real. Because the best analysis tools in the world don't matter if you can't find deals to analyze.

In this lesson, I'm going to walk you through the seven best lead sources for finding profitable properties in 2026. For each one, I'll tell you the cost, the expected response rate, and how to get started. Let's dive in.`,
        directions: 'Presenter on camera, energetic opening. This is a high-value lesson — convey excitement.',
      },
      {
        title: 'Lead Sources Deep Dive',
        type: 'slides',
        duration: '18:00',
        script: `Lead source number one — Direct Mail Marketing. Cost is 50 cents to 2 dollars per piece, with a response rate of half a percent to 2 percent. Direct mail is one of the most reliable lead sources in the business. You're targeting absentee owners, properties with tax liens, probate and inherited properties, expired MLS listings, and high-equity homeowners. The key metric: send at least 1,000 pieces per month consistently. Expect 5 to 20 calls per 1,000 mailers. We have direct mail templates ready to use in the Freedom One Marketing section.

Lead source number two — Driving for Dollars. Cost is just gas plus skip tracing at 10 to 25 cents per lead, with a response rate of 3 to 8 percent. Drive through target neighborhoods looking for overgrown lawns, boarded windows, accumulated mail, and vacant properties. Use apps like DealMachine or BatchLeads to capture addresses and skip trace the owners.

Lead source number three — Wholesalers. The cost is built into the purchase price, and this is the fastest path to deals. Build relationships with 5 to 10 active wholesalers in your market. They do the marketing and negotiating — you just analyze and buy the deals that work. How to connect: attend REIA meetings, join Facebook groups, and tell everyone you're a cash buyer.

Lead source number four — MLS and Investor-Friendly Agents. Set up automated alerts for properties listed 60-plus days, REO bank-owned properties, estate sales, and anything with "as-is" or "investor special" keywords.

Lead source number five — Online Marketing. Budget 500 to 3,000 dollars per month. This includes Google Ads targeting "sell my house fast" keywords, Facebook Ads targeting homeowners, an SEO website ranking for "we buy houses" searches, and social media sharing before-and-after photos and market updates.

Lead source number six — Foreclosure and Auction Properties. You can find deals at 10 to 30 percent below market. Target pre-foreclosures by contacting homeowners before auction, courthouse auctions where you buy at the foreclosure sale, REO properties listed on MLS, and online auctions on sites like Auction.com.

Lead source number seven — Networking and Referrals. This costs zero to 500 dollars in referral fees, and produces the highest quality leads. The best deals come from other investors who pass on deals outside their criteria, agents who know distressed sellers, attorneys handling probate or divorce, property managers with tired landlord clients, and contractors who see distressed properties every day.`,
        directions: 'Show a dedicated slide for each lead source with cost, response rate, and key details. Use icons and color coding. Transition between slides as each source is covered.',
      },
      {
        title: 'Implementation Strategy',
        type: 'talking-head',
        duration: '4:00',
        script: `Now, you don't need to use all seven lead sources at once. Here's my recommendation for getting started.

If you have more time than money, start with driving for dollars and networking. These are low-cost, high-touch strategies that work well for beginners.

If you have more money than time, start with direct mail and online marketing. These are scalable systems that generate leads while you sleep.

And regardless of your budget, connect with wholesalers immediately. It costs you nothing, and it's the fastest way to get deals in front of you.

The key is consistency. Pick two or three lead sources and commit to them for at least 90 days before judging results. Marketing is a long game.`,
        directions: 'Presenter on camera, strategic and advisory tone. Use hand gestures to emphasize the two paths (time vs. money).',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Your action items: pick your top two lead sources from this list and take one action on each this week. If it's direct mail, design your first mailer using our templates. If it's driving for dollars, drive one neighborhood this weekend. If it's wholesalers, join one Facebook group and introduce yourself.

In the next lesson, I'm going to show you how to analyze the deals that come in — the exact numbers and formulas that separate profitable deals from money pits. This is where the Freedom One Deal Analyzer really shines. See you there.`,
        directions: 'Presenter on camera, motivational closing. Point to camera when giving action items.',
      },
    ],
    closingCTA: 'Pick 2 lead sources and take action this week. Next: Analyzing Deals.',
    bRollSuggestions: [
      'Mail carrier delivering letters to a mailbox',
      'Person driving through a neighborhood looking at properties',
      'Screenshot of DealMachine or BatchLeads app',
      'Foreclosure auction at a courthouse',
      'Networking event with people exchanging business cards',
      'Screen recording of Freedom One Marketing Templates page',
    ],
  },

  'l-2-2': {
    lessonId: 'l-2-2',
    estimatedRuntime: '30:00',
    equipment: 'Camera (talking head), screen recording of Freedom One Deal Analyzer, whiteboard',
    openingHook: `"Every successful flip starts with one thing — accurate numbers. In this lesson, I'm going to show you the exact formulas and metrics that professional investors use to evaluate every deal. And I'll walk you through a live analysis using the Freedom One Deal Analyzer."`,
    segments: [
      {
        title: 'The Numbers That Matter',
        type: 'whiteboard',
        duration: '8:00',
        script: `Let me draw out the core formula that every investor needs to know. It's called the 70% Rule.

Maximum Allowable Offer equals ARV times 70% minus Rehab Costs.

Let me break that down with an example. Say you find a property with an After Repair Value of $300,000. Multiply that by 0.70 — you get $210,000. Now subtract your estimated rehab costs of $40,000. Your Maximum Allowable Offer is $170,000.

This is your quick screening tool. If a deal doesn't pass the 70% rule, you need to dig deeper before proceeding.

Now, the 70% rule is a starting point, not a hard rule. In hot markets, you might accept 75%. In slower markets, you might need 65%. The key is understanding what that 30% margin covers: your holding costs, closing costs, financing costs, and your profit.

Let me also explain ARV — After Repair Value. This is the most important number in your analysis. It's what the property will sell for on the open market after all renovations are complete. Get the ARV wrong, and everything else falls apart.

How do you determine ARV? You find 3 to 5 comparable properties — recently sold, fully renovated homes in the same neighborhood — calculate their average price per square foot, and multiply by your subject property's square footage.`,
        directions: 'Write the 70% Rule formula on whiteboard. Work through the example with real numbers. Circle the ARV and emphasize its importance. Use different colors for the formula components.',
      },
      {
        title: 'Live Deal Analysis',
        type: 'screen-recording',
        duration: '15:00',
        script: `Now let me show you how this works in practice using the Freedom One Deal Analyzer. I'm going to analyze a real deal from start to finish.

First, I'll enter the property details. This is a 3-bed, 2-bath, 1,400 square foot home built in 1985 in Dallas, Texas. The seller is asking $165,000.

Notice how the app automatically detected the Dallas metro market and is adjusting all costs to local pricing.

Next, I'll set the rehab level. I'm going to use the detailed scope of work mode. I'll click through each room and set the condition. The kitchen needs a full renovation — I'll set it to "Replace" with Standard materials. Bathrooms are Fair condition. Living areas need new flooring and paint.

The rehab estimate is coming in at $42,000. That includes regional cost adjustments for the Dallas market.

Now for comps. I'll add three comparable sales. These are recently sold, fully renovated homes within half a mile. Notice how each comp gets a quality grade — A through F — based on how similar it is to our subject property.

The calculated ARV is $262,500 based on an average of $187.50 per square foot across our comps.

Let's check the 70% rule. ARV of $262,500 times 0.70 equals $183,750, minus $42,000 in rehab equals $141,750. Our purchase price of $165,000 is above the MAO of $141,750 — so this deal does NOT pass the 70% rule at asking price.

But look at the Investor Report. The deal score is 58 — that's Marginal. The projected profit is $18,200 with an ROI of 8.8%. Not great, but not terrible. If we could negotiate the purchase price down to $145,000, the deal score jumps to 74 — that's Good territory.

This is the power of the analyzer. You can model different scenarios instantly.`,
        directions: 'Screen recording of the Freedom One Deal Analyzer. Walk through each section slowly, clicking and entering data in real time. Zoom in on key metrics as they are discussed. Show the deal score changing as you adjust the purchase price.',
      },
      {
        title: 'Key Takeaways',
        type: 'talking-head',
        duration: '5:00',
        script: `Let me summarize the key metrics you need to evaluate on every deal.

ARV — your After Repair Value. This is the ceiling. Get this wrong and nothing else matters.

The 70% Rule — your quick screening filter. Does the deal pass? If not, how close is it?

Net Profit — your bottom line after ALL costs: purchase, rehab, financing, holding, and closing.

ROI — your return on investment. What percentage return are you getting on the money you put in?

Deal Score — the Freedom One platform calculates this automatically on a 0 to 100 scale, factoring in all of these metrics plus risk factors.

The beauty of the Deal Analyzer is that it calculates all of this for you in real time. You just enter the data, and it tells you whether the deal is worth pursuing.

Save every deal you analyze — even the ones you pass on. Over time, you'll build a database of market knowledge that makes you a better investor.`,
        directions: 'Presenter on camera, authoritative tone. This is the core knowledge of the course. Consider showing the key metrics as text overlays.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Your homework: go to the Freedom One Deal Analyzer right now and analyze at least three properties. They can be from Zillow, Realtor.com, or any listing site. Practice entering the data, adding comps, and reading the Investor Report.

The more deals you analyze, the faster your instincts develop. Professional investors can look at a deal and know within 30 seconds whether it's worth pursuing — and that skill comes from practice.

In Module 3, we're diving into our first exit strategy: Fix and Flip. I'll show you how to manage your rehab like a pro and sell your flip for maximum profit. See you there.`,
        directions: 'Presenter on camera, encouraging tone. Emphasize the importance of practice.',
      },
    ],
    closingCTA: 'Analyze 3 properties in the Deal Analyzer this week. Next: Module 3 — Fix & Flip.',
    bRollSuggestions: [
      'Screen recording of Freedom One Deal Analyzer with data entry',
      'Whiteboard with 70% Rule formula',
      'Before/after property renovation photos',
      'Comparable property photos side by side',
      'Calculator and financial documents on a desk',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 3: Fix & Flip
  // ─────────────────────────────────────────────────────────
  'l-3-1': {
    lessonId: 'l-3-1',
    estimatedRuntime: '25:00',
    equipment: 'Camera (talking head), slide deck, screen recording, on-site footage',
    openingHook: `"A rehab that goes over budget or over schedule can turn a profitable deal into a disaster. In this lesson, I'm going to show you how to manage your rehab like a professional — from scope of work to contractor management to the Gantt chart timeline."`,
    segments: [
      {
        title: 'Rehab Management Overview',
        type: 'talking-head',
        duration: '3:00',
        script: `Welcome to Module 3 — Fix and Flip. This is the strategy most people think of when they hear "real estate investing," and for good reason. It's exciting, it's profitable, and it's tangible — you can see the transformation happen.

But here's the reality: the rehab phase is where most new investors lose money. Not because the deal was bad, but because the rehab went over budget, over schedule, or both.

In this lesson, I'm going to show you how to prevent that. We'll cover creating a detailed scope of work, managing contractors, and using the Gantt chart timeline to keep your project on track.`,
        directions: 'Presenter on camera, serious but confident tone. This is a critical lesson — convey that rehab management is the key to profitability.',
      },
      {
        title: 'Creating Your Scope of Work',
        type: 'screen-recording',
        duration: '10:00',
        script: `Let me show you how to create a professional scope of work using the Freedom One SOW Templates.

Navigate to the SOW Templates page. You'll see 104 templates organized by room category — Kitchen, Bathrooms, Living Room, Bedrooms, and all the major systems like Electrical, Plumbing, HVAC, and Structural.

Let's build a scope of work for a typical flip. I'll start with the Kitchen. Click on Kitchen, and you'll see every line item: cabinets, countertops, backsplash, sink and faucet, appliances, lighting, and hardware. Each item has three material tiers — Rental, Standard, and Luxury — with real pricing from Home Depot.

Click any product name and it opens the actual Home Depot product page. You can verify the price, check availability, and even order materials directly.

Now I'll select Standard tier for this neighborhood. The kitchen total comes in at — let me scroll down — $8,450 including labor.

I'll repeat this for each room. Master Bath, Full Bath, Living Room, three Bedrooms, Landscaping, and the major systems.

Notice the regional cost adjustment at the top. I'm in the Dallas market, so costs are adjusted down by about 8% from the national average. If I switch to San Francisco, watch the numbers jump — that's a 35% increase.

When you're done, you have a complete, line-item scope of work with real product links and regional pricing. Print this and hand it to your contractor for bidding. This is how professionals do it.`,
        directions: 'Screen recording of Freedom One SOW Templates page. Click through multiple rooms, show material tiers, click a Home Depot link, show regional adjustment. Move at a pace that viewers can follow.',
      },
      {
        title: 'Contractor Management',
        type: 'talking-head',
        duration: '6:00',
        script: `Now let's talk about managing contractors. This is where most rehabs go off the rails.

Rule number one: always get three bids. Never accept the first bid you receive. Three bids give you a range to evaluate and leverage to negotiate.

Rule number two: pay in draws, not upfront. Structure payments tied to completion milestones. For example: 10% at signing, 30% when demo is complete, 30% when rough-in is done, and 30% at final walkthrough. Never pay 100% upfront — I don't care how much you trust the contractor.

Rule number three: use a written contract. The Freedom One platform has a Contractor Agreement template in the Contracts section. It specifies the scope of work, timeline, payment schedule, and what happens if the contractor doesn't perform.

Rule number four: visit the site regularly. At minimum, visit every other day during active construction. Take photos — use the Property Photos feature in the Deal Analyzer to document progress.

Rule number five: use the Gantt chart. The Freedom One Deal Analyzer includes an interactive Gantt chart that shows your project timeline with phases and dependencies. If the electrical rough-in is delayed, you can see exactly how it affects the drywall, paint, and flooring schedules.

Track your contractors in the Contractor Management section of the app. Rate them after each project, store their license and insurance info, and build a roster of reliable professionals over time.`,
        directions: 'Presenter on camera, authoritative tone. Count off rules on fingers. Consider showing the Gantt chart briefly as a screen overlay.',
      },
      {
        title: 'Budget Management',
        type: 'slides',
        duration: '4:00',
        script: `Let me share some budget management best practices.

Always add a 10 to 15 percent contingency to your rehab budget. No matter how detailed your scope of work is, there will be surprises — hidden water damage, outdated wiring, foundation issues that weren't visible during inspection.

Track every expense in real time. Use a simple spreadsheet or your accounting software. Compare actual costs to your budget weekly.

If you're going over budget, make decisions immediately. Don't wait until the end of the project to realize you're $20,000 over. Adjust material selections, cut non-essential upgrades, or renegotiate with your contractor.

And finally — know your "walk away" number. Before you start the rehab, calculate the maximum you can spend and still make a profit. If costs approach that number, you need to make hard decisions fast.`,
        directions: 'Show slides with budget tracking template, contingency calculation example, and a decision tree for over-budget scenarios.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Your action items: go to the SOW Templates page and build a complete scope of work for a property you're evaluating. Even if you're not ready to buy yet, this exercise teaches you to think like a contractor and estimate costs accurately.

In the next lesson, we'll cover selling your flip for maximum profit — pricing strategy, staging, marketing, and closing the sale. See you there.`,
        directions: 'Presenter on camera, encouraging tone.',
      },
    ],
    closingCTA: 'Build a complete SOW for one property. Next: Selling Your Flip.',
    bRollSuggestions: [
      'Time-lapse of a kitchen renovation',
      'Contractor reviewing blueprints on a job site',
      'Screen recording of Freedom One SOW Templates with Home Depot links',
      'Gantt chart timeline animation',
      'Before/during/after renovation sequence',
    ],
  },

  'l-3-2': {
    lessonId: 'l-3-2',
    estimatedRuntime: '20:00',
    equipment: 'Camera (talking head), slide deck, screen recording',
    openingHook: `"You've found the deal, managed the rehab, and now it's time to sell. In this lesson, I'll show you how to price your flip, stage it for maximum appeal, and close the sale — because the profit isn't real until the check clears."`,
    segments: [
      {
        title: 'Pricing Strategy',
        type: 'talking-head',
        duration: '5:00',
        script: `The biggest mistake I see flippers make at this stage is overpricing. You've put your heart and money into this property, and you want top dollar. I get it. But overpricing costs you more than underpricing ever will.

Here's why. Every month your property sits on the market, you're paying holding costs — mortgage, taxes, insurance, utilities. At $2,000 to $3,000 per month, a 3-month delay costs you $6,000 to $9,000. Plus, properties that sit on the market develop a stigma. Buyers wonder what's wrong with it.

My pricing strategy: list at or slightly below the ARV you calculated using your comps. If your comps say the property is worth $275,000, list at $269,900. This creates urgency, attracts multiple offers, and often results in a sale price at or above your target.

Use the Freedom One Deal Analyzer to model different sale prices. Change the ARV and watch how it affects your net profit and ROI. This helps you set your floor — the minimum price you'll accept.`,
        directions: 'Presenter on camera, experienced and advisory tone. Show a quick screen recording of adjusting the ARV in the Deal Analyzer to demonstrate price modeling.',
      },
      {
        title: 'Staging & Marketing',
        type: 'slides',
        duration: '8:00',
        script: `Staging sells homes. Period. A staged home sells 73% faster and for 5 to 10% more than an unstaged home, according to the National Association of Realtors.

You have three options. Full staging costs $2,000 to $5,000 and uses professional furniture and decor. Virtual staging costs $100 to $300 per photo and digitally adds furniture to empty room photos. Partial staging costs $500 to $1,500 and focuses on key rooms — living room, kitchen, and master bedroom.

For most flips, I recommend partial staging. Focus on the rooms buyers care about most.

For marketing, use professional photography. This costs $200 to $500 and is worth every penny. 95% of buyers start their search online, and photos are the first thing they see.

List on the MLS through your investor-friendly agent. Also post on Zillow, Realtor.com, and social media. Use the Freedom One Property Listings feature to create a professional listing page with photo galleries and property details.

And don't forget the Freedom One Marketing Templates. We have email sequences, social media posts, and flyer templates specifically designed for selling your finished flip.`,
        directions: 'Show before/after staging photos. Display statistics on staging ROI. Show examples of professional vs. amateur property photos.',
      },
      {
        title: 'Closing the Sale',
        type: 'talking-head',
        duration: '5:00',
        script: `Once offers come in, here's how to evaluate them.

Price is important, but it's not everything. Also consider the buyer's financing — cash offers close faster and more reliably than financed offers. Look at contingencies — fewer contingencies means less risk of the deal falling through. And consider the closing timeline — a faster close means less holding costs.

Work with your agent to negotiate the best terms. Don't be afraid to counter-offer.

Once you're under contract, stay on top of the closing process. Make sure inspections happen on time, appraisals come in at value, and all documents are prepared.

After closing, calculate your actual profit versus your projected profit. Compare what the Deal Analyzer predicted to what actually happened. This feedback loop makes you a better investor on every deal.

Save the completed deal in the Freedom One platform and update its status to "Closed." Your Portfolio Dashboard will track your actual performance over time.`,
        directions: 'Presenter on camera, practical and experienced tone. Consider showing a brief screen recording of updating a deal status to "Closed" in the Saved Deals page.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Congratulations — you now know the complete Fix and Flip process from finding the deal to cashing the check.

In Module 4, we're going to cover a strategy that requires zero rehab, zero holding costs, and zero risk — Wholesaling. If you're just getting started or want to build capital for your first flip, wholesaling is the perfect entry point. See you there.`,
        directions: 'Presenter on camera, congratulatory and forward-looking tone.',
      },
    ],
    closingCTA: 'Review your pricing strategy using the Deal Analyzer. Next: Module 4 — Wholesaling.',
    bRollSuggestions: [
      'Beautifully staged home interior',
      'Professional photographer shooting a property',
      'Real estate agent showing a property to buyers',
      'Closing table with documents being signed',
      'Screen recording of Freedom One Listings page',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULES 4-8: Exit Strategies & Financing (condensed)
  // ─────────────────────────────────────────────────────────
  'l-4-1': {
    lessonId: 'l-4-1',
    estimatedRuntime: '24:00',
    equipment: 'Camera (talking head), slide deck, whiteboard, screen recording',
    openingHook: `"What if I told you there's a way to make $5,000 to $20,000 per deal with no money down, no rehab, and no risk? That's wholesaling — and in this lesson, I'm going to show you exactly how it works."`,
    segments: [
      {
        title: 'What Is Wholesaling',
        type: 'whiteboard',
        duration: '6:00',
        script: `Wholesaling is the simplest exit strategy in real estate investing. Here's how it works — let me draw this out.

You find a motivated seller who wants to sell their property below market value. You put the property under contract at that below-market price. Then, instead of closing on the property yourself, you assign that contract to another investor — a cash buyer — for a fee. That fee is your profit.

So the seller gets their property sold. The end buyer gets a deal below market value. And you get paid an assignment fee — typically $5,000 to $20,000 — without ever owning the property.

The key is the "and/or assigns" language in your purchase contract. This gives you the legal right to assign the contract to someone else. We have assignable purchase agreement templates in the Freedom One Contracts section.

There's zero rehab, zero holding costs, and minimal risk because you never actually buy the property. If you can't find a buyer, you simply don't close — though you should always have an exit strategy and never tie up a seller's property without a genuine intent to perform.`,
        directions: 'Draw the wholesaling flow on whiteboard: Seller → You (Contract) → End Buyer (Assignment). Show the money flow with arrows. Use different colors for each party.',
      },
      {
        title: 'Finding and Analyzing Wholesale Deals',
        type: 'screen-recording',
        duration: '8:00',
        script: `The deal-finding strategies from Module 2 all apply to wholesaling. But here's the key difference: your numbers need to work for your end buyer, not just for you.

Let me show you how to analyze a wholesale deal using the Freedom One Deal Analyzer.

I'll enter a property — let's say it's a 3-bed, 1-bath in a $200,000 neighborhood. The seller is willing to sell for $120,000. The property needs about $35,000 in rehab.

Now, I need to make sure this deal works for a flipper. Using the 70% rule: $200,000 ARV times 0.70 equals $140,000, minus $35,000 rehab equals $105,000 maximum purchase price for a flipper.

But I have it under contract at $120,000. That means there's $15,000 of room — but a flipper would want to buy at $105,000 to hit their 70% rule. So my assignment fee would be the difference: $120,000 minus $105,000... that's tight.

Let me adjust. If I can negotiate the seller down to $100,000, now the deal works beautifully. I assign the contract at $115,000, the flipper gets a deal that passes the 70% rule, and I pocket a $15,000 assignment fee.

This is why the Deal Analyzer is so valuable for wholesalers. You can model the numbers from both your perspective and your end buyer's perspective.`,
        directions: 'Screen recording of the Deal Analyzer. Enter a wholesale deal and walk through the numbers. Show how adjusting the purchase price affects the assignment fee opportunity.',
      },
      {
        title: 'Building Your Buyers List',
        type: 'talking-head',
        duration: '5:00',
        script: `The most important asset in wholesaling is your buyers list. Without buyers, you have no business.

Here's how to build your buyers list fast. First, attend every REIA meeting and networking event in your area. Tell everyone you're a wholesaler with deals. Collect contact information.

Second, check the county records for recent cash purchases. These are active investors who are buying right now. Skip trace their contact info and reach out.

Third, post in Facebook groups and BiggerPockets. "I have a deal in [neighborhood] — ARV $200K, needs $35K rehab, asking $105K. Cash buyers only."

Fourth, use the Freedom One Marketing Templates. We have email templates specifically designed for building and maintaining your buyers list.

Aim for 50 to 100 buyers on your list. You only need 2 or 3 serious buyers to close deals consistently, but a larger list gives you more options and faster closings.`,
        directions: 'Presenter on camera, practical and actionable tone. Consider showing a brief screen recording of the Marketing Templates section.',
      },
      {
        title: 'Contracts & Legal',
        type: 'slides',
        duration: '3:00',
        script: `Let's cover the legal side. You need two contracts for every wholesale deal.

First — the Purchase Agreement with the seller. This must include "and/or assigns" language that gives you the right to assign the contract. Use the Assignable Purchase Agreement template in the Freedom One Contracts section.

Second — the Assignment Contract with your end buyer. This specifies the assignment fee and the terms of the assignment. Use the Wholesale Assignment Contract template.

Important legal notes: wholesaling laws vary by state. Some states require a real estate license to wholesale. Some have specific disclosure requirements. Check the Freedom One State Guide for your state's regulations. And always have your contracts reviewed by a real estate attorney.`,
        directions: 'Show slides with the two contract types and key clauses. Mention the State Guide and Contracts sections of the app.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Wholesaling is the perfect entry point for new investors. It requires minimal capital, carries low risk, and teaches you the fundamentals of finding deals and analyzing numbers.

Your action items: download the contract templates from the Freedom One Contracts section, check your state's wholesaling regulations in the State Guide, and start building your buyers list this week.

In Module 5, we'll cover the BRRRR strategy — Buy, Rehab, Rent, Refinance, Repeat. This is how you build long-term wealth through real estate. See you there.`,
        directions: 'Presenter on camera, encouraging and forward-looking.',
      },
    ],
    closingCTA: 'Download contract templates and start building your buyers list. Next: BRRRR Strategy.',
    bRollSuggestions: [
      'Whiteboard diagram of wholesale deal flow',
      'Screen recording of Freedom One Deal Analyzer with wholesale numbers',
      'Contract documents being reviewed',
      'Networking event footage',
      'Screen recording of Freedom One Contracts section',
    ],
  },

  'l-5-1': {
    lessonId: 'l-5-1',
    estimatedRuntime: '26:00',
    equipment: 'Camera (talking head), slide deck, whiteboard, screen recording',
    openingHook: `"The BRRRR strategy is how ordinary investors build extraordinary wealth. Buy, Rehab, Rent, Refinance, Repeat — and in this lesson, I'll show you how to execute each step and use the Freedom One platform to analyze BRRRR deals."`,
    segments: [
      {
        title: 'BRRRR Explained',
        type: 'whiteboard',
        duration: '8:00',
        script: `BRRRR stands for Buy, Rehab, Rent, Refinance, Repeat. Let me walk through each step.

Buy — Purchase a distressed property below market value, just like a flip.

Rehab — Renovate the property to increase its value and make it rent-ready. Use the Freedom One SOW Templates to plan your rehab, but focus on durability and tenant-friendly materials — that's the Rental Grade tier.

Rent — Place a quality tenant and stabilize the property with consistent rental income. The rent needs to cover your mortgage, taxes, insurance, and maintenance with room for profit.

Refinance — Once the property is stabilized with a tenant and seasoned for 6 to 12 months, refinance with a conventional or DSCR loan based on the new appraised value. If you bought at 70% of ARV and the property appraises at full value, you can pull out most or all of your original investment.

Repeat — Take the cash from the refinance and do it again. This is the magic of BRRRR — you recycle your capital into the next deal.

The goal is to end up with a cash-flowing rental property with little to no money left in the deal. Over time, you build a portfolio of properties that generate passive income and appreciate in value.`,
        directions: 'Write B-R-R-R-R vertically on whiteboard with each word. Draw a circular arrow showing how capital recycles. Include a simple numbers example.',
      },
      {
        title: 'Analyzing a BRRRR Deal',
        type: 'screen-recording',
        duration: '10:00',
        script: `Let me show you how to analyze a BRRRR deal using the Freedom One Deal Analyzer.

The analysis starts the same as a flip — enter the property details, set your rehab scope, add comps for the ARV. But instead of looking at flip profit, you're looking at two things: the cash flow after refinance, and how much capital you get back.

Enter the property: a 3-bed, 2-bath in a $180,000 neighborhood. Purchase price $110,000. Rehab budget $25,000 using Rental Grade materials. ARV is $180,000.

Total investment: $135,000. After refinancing at 75% LTV on the $180,000 appraised value, you get a loan of $135,000 — that's 100% of your investment back.

Now check the cash flow. If the property rents for $1,500 per month and your PITI plus maintenance is $1,100, you're cash flowing $400 per month with zero dollars left in the deal.

The Deal Analyzer shows you the complete picture — your ROI is technically infinite because you have no money in the deal, and you're earning $400 per month in passive income.`,
        directions: 'Screen recording of the Deal Analyzer. Walk through a BRRRR analysis step by step. Highlight the refinance calculation and cash flow numbers.',
      },
      {
        title: 'Keys to Success',
        type: 'talking-head',
        duration: '6:00',
        script: `There are four keys to a successful BRRRR.

First — buy right. You need to purchase at a significant discount to ARV. The 70% rule still applies, but you're keeping the property instead of selling it.

Second — rehab smart. Use durable, tenant-friendly materials. Rental Grade in the SOW Templates is designed exactly for this. You don't need granite countertops in a rental — you need materials that last and are easy to maintain.

Third — rent at market rate. Don't underprice to fill the unit fast. A properly renovated property in a good neighborhood should rent at or above market rate. Use Zillow Rental Manager or Rentometer to verify market rents.

Fourth — refinance strategically. Shop multiple lenders. DSCR loans are popular for BRRRR because they qualify based on the property's cash flow, not your personal income. Check the Freedom One Lender Directory for DSCR lenders in your area.

And remember — the BRRRR strategy is a long-term wealth building approach. Each property adds to your portfolio, your cash flow, and your net worth. It's not as flashy as flipping, but it's how generational wealth is built.`,
        directions: 'Presenter on camera, strategic and experienced tone. This is advanced content — speak with authority.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Your action item: analyze one property as a BRRRR deal in the Freedom One Deal Analyzer. Compare the numbers to a flip — same property, two different exit strategies. See which one makes more sense for your goals.

In Module 6, we'll cover Subject-To financing — one of the most creative and powerful acquisition strategies in real estate. See you there.`,
        directions: 'Presenter on camera, encouraging.',
      },
    ],
    closingCTA: 'Analyze one property as both a flip and a BRRRR. Compare the results. Next: Subject-To.',
    bRollSuggestions: [
      'Whiteboard BRRRR diagram with circular arrows',
      'Rental property exterior and interior',
      'Tenant moving into a renovated property',
      'Screen recording of Deal Analyzer BRRRR analysis',
      'Bank refinance documents',
    ],
  },

  'l-6-1': {
    lessonId: 'l-6-1',
    estimatedRuntime: '23:00',
    equipment: 'Camera (talking head), slide deck, whiteboard',
    openingHook: `"Subject-To is one of the most powerful — and most misunderstood — strategies in real estate. In this lesson, I'll demystify it completely and show you when and how to use it."`,
    segments: [
      {
        title: 'What Is Subject-To',
        type: 'whiteboard',
        duration: '8:00',
        script: `Subject-To means buying a property "subject to" the existing mortgage staying in place. The deed transfers to you, but the seller's mortgage stays in their name and you make the payments.

Let me draw this out. The seller has a property worth $250,000 with a mortgage balance of $200,000 at 3.5% interest. They're behind on payments and need to sell fast.

In a traditional sale, they'd need to pay off the $200,000 mortgage at closing. But they have no equity — the property might not even sell for enough to cover the mortgage plus closing costs.

With Subject-To, you take over the deed and start making the mortgage payments. The seller gets out from under the payments. You get a property with a 3.5% interest rate — far below current market rates — and $50,000 in equity.

The key risk is the "due on sale" clause. Most mortgages have a clause that says the lender can call the loan due if the property is sold. In practice, lenders rarely enforce this as long as payments are being made on time. But it's a risk you need to understand and discuss with your attorney.`,
        directions: 'Draw the Subject-To deal structure on whiteboard. Show the seller, buyer, and lender relationships. Highlight the mortgage staying in place with arrows.',
      },
      {
        title: 'When to Use Subject-To',
        type: 'slides',
        duration: '6:00',
        script: `Subject-To works best in specific situations.

Situation one — the seller has a low interest rate. If they locked in at 3 to 4 percent during 2020 or 2021, that mortgage is a valuable asset. Taking it over saves you thousands in interest compared to getting a new loan at current rates.

Situation two — the seller has little or no equity. They can't sell traditionally because closing costs would eat up any proceeds. Subject-To lets them walk away clean.

Situation three — the seller is behind on payments. They're facing foreclosure and need someone to take over the payments immediately. You can cure the arrears and save the property from foreclosure.

Situation four — you want to hold the property as a rental. Subject-To is ideal for building a rental portfolio because you're using the seller's existing financing — no new loan qualification needed.

The Freedom One Deal Analyzer helps you model Subject-To deals by entering the existing mortgage terms in the Financing section. You can see exactly how the seller's rate compares to current market rates and calculate your cash flow.`,
        directions: 'Show slides with each situation and a brief numerical example. Include a comparison of Subject-To vs. new financing costs.',
      },
      {
        title: 'Legal Protections',
        type: 'talking-head',
        duration: '5:00',
        script: `Subject-To requires careful legal documentation. Here's what you need.

A proper purchase agreement that clearly states the transaction is subject to the existing financing. Your attorney should draft or review this.

A deed transferring ownership to you or your LLC. This gets recorded at the county.

An authorization to make payments on the existing mortgage. The seller signs this so you can communicate with their lender.

A land trust — many investors use a land trust to hold the property. This provides an additional layer of protection and can help with the due-on-sale clause.

Insurance — you need to add yourself as the insured party on the property's insurance policy.

I cannot stress this enough: work with a real estate attorney who understands creative financing. Subject-To is perfectly legal, but the documentation must be done correctly.

Check the Freedom One State Guide for your state's specific regulations around Subject-To transactions.`,
        directions: 'Presenter on camera, serious and thorough tone. This is legal content — be precise and emphasize attorney involvement.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Subject-To is an advanced strategy, but it's incredibly powerful when used correctly. It gives you access to below-market interest rates, requires little to no money down, and works beautifully for building a rental portfolio.

Your action item: discuss Subject-To with your real estate attorney. Make sure they understand the strategy and can support you when a deal comes along.

In Module 7, we'll cover our fifth and final exit strategy — Short-Term Rentals. Airbnb and VRBO have created a massive opportunity for investors, and I'll show you how to capitalize on it. See you there.`,
        directions: 'Presenter on camera, confident closing.',
      },
    ],
    closingCTA: 'Discuss Subject-To with your attorney. Next: Short-Term Rentals.',
    bRollSuggestions: [
      'Whiteboard diagram of Subject-To deal structure',
      'Legal documents being signed',
      'Property with a "Sold" sign',
      'Attorney reviewing contracts',
      'Screen recording of Deal Analyzer financing section',
    ],
  },

  'l-7-1': {
    lessonId: 'l-7-1',
    estimatedRuntime: '27:00',
    equipment: 'Camera (talking head), slide deck, screen recording, property footage',
    openingHook: `"Short-term rentals have created more millionaire investors in the last five years than any other strategy. In this lesson, I'll show you how to find, set up, and optimize a short-term rental for maximum revenue."`,
    segments: [
      {
        title: 'The STR Opportunity',
        type: 'talking-head',
        duration: '4:00',
        script: `Welcome to Module 7 — Short-Term Rentals. Platforms like Airbnb and VRBO have fundamentally changed real estate investing. A property that might rent for $1,500 per month as a long-term rental could generate $4,000 to $6,000 per month as a short-term rental in the right market.

But — and this is important — STRs are not passive income. They're a hospitality business. You need to understand the market, the regulations, the setup costs, and the ongoing management before jumping in.

In this lesson, I'll cover market selection, property setup, pricing strategy, and how to use the Freedom One platform to analyze STR deals.`,
        directions: 'Presenter on camera, enthusiastic but realistic. Set expectations that STRs require active management.',
      },
      {
        title: 'Market Selection & Regulations',
        type: 'slides',
        duration: '8:00',
        script: `Not every market works for short-term rentals. Here's how to evaluate a market.

First, check the regulations. Many cities have banned or restricted short-term rentals. Some require permits, some limit the number of days you can rent, and some ban non-owner-occupied STRs entirely. Check the Freedom One State Guide and your local city ordinances before investing.

Second, analyze the demand. Use AirDNA or Mashvisor to see occupancy rates, average daily rates, and revenue projections for your target market. You want markets with 65% or higher occupancy and strong seasonal demand.

Third, consider the competition. How many listings are already in the area? What's the average rating? Can you differentiate with better design, amenities, or location?

The best STR markets typically have tourism, business travel, or event-driven demand. Beach towns, mountain destinations, cities with major employers or universities, and areas near national parks all tend to perform well.`,
        directions: 'Show slides with market evaluation criteria, regulation examples, and AirDNA data screenshots.',
      },
      {
        title: 'Property Setup & Design',
        type: 'talking-head',
        duration: '8:00',
        script: `Setting up an STR is different from a flip or a long-term rental. You're creating a guest experience, not just a place to live.

Furnishing is your biggest upfront cost. Budget $10,000 to $25,000 for a complete furniture and decor package. Focus on comfortable beds, quality linens, a well-equipped kitchen, and Instagram-worthy design touches.

Use the Freedom One Renovation Designer to plan your design aesthetic. Match the style to your market — a beach house should feel different from a mountain cabin or a downtown loft.

Essential amenities that boost bookings: fast WiFi, smart TV with streaming, keyless entry, washer and dryer, a well-stocked kitchen, and outdoor space if possible.

Professional photography is critical. Listings with professional photos get 40% more bookings. Budget $200 to $500 for a photographer.

Create a detailed guest guidebook with local recommendations, house rules, and check-in instructions. This reduces questions and improves reviews.`,
        directions: 'Presenter on camera with enthusiasm. Show examples of well-designed STR interiors as overlays or B-roll.',
      },
      {
        title: 'Pricing & Revenue Optimization',
        type: 'slides',
        duration: '5:00',
        script: `Pricing is where the money is made or lost in STRs.

Use dynamic pricing tools like PriceLabs, Beyond Pricing, or Wheelhouse. These automatically adjust your nightly rate based on demand, seasonality, local events, and competitor pricing. They typically increase revenue by 20 to 40% compared to static pricing.

Set a minimum stay of 2 to 3 nights to reduce turnover costs. Consider weekly discounts of 10 to 15% and monthly discounts of 25 to 35% to fill gaps.

Track your key metrics: occupancy rate, average daily rate, revenue per available night, and guest satisfaction score. The goal is to optimize the balance between occupancy and rate — you want high rates with high occupancy, not one or the other.

Use the Freedom One Deal Analyzer to model your STR numbers. Enter the expected monthly revenue as your rental income, subtract your expenses, and calculate your cash-on-cash return.`,
        directions: 'Show slides with pricing strategy examples, dynamic pricing tool screenshots, and key metrics dashboard.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Short-term rentals can be incredibly profitable, but they require more active management than any other strategy. If you're willing to put in the work — or hire a property manager — the returns can be exceptional.

Your action items: check your target market's STR regulations using the State Guide, and analyze one property as a potential STR using the Deal Analyzer.

In Module 8, we'll cover financing options for every strategy we've discussed — from hard money to DSCR loans to creative financing. See you there.`,
        directions: 'Presenter on camera, balanced and encouraging.',
      },
    ],
    closingCTA: 'Check STR regulations in your market and analyze one potential STR deal. Next: Financing.',
    bRollSuggestions: [
      'Beautiful Airbnb interior with professional staging',
      'Guest checking in with keyless entry',
      'Aerial footage of vacation rental markets',
      'Screen recording of AirDNA market data',
      'Guest leaving a 5-star review on phone',
    ],
  },

  'l-8-1': {
    lessonId: 'l-8-1',
    estimatedRuntime: '19:00',
    equipment: 'Camera (talking head), slide deck, screen recording',
    openingHook: `"The deal is only as good as the financing behind it. In this lesson, I'll walk you through every financing option available to real estate investors — and show you how to use the Freedom One Lender Directory to find the right lender for your strategy."`,
    segments: [
      {
        title: 'Financing Overview',
        type: 'slides',
        duration: '10:00',
        script: `Let me walk you through the six main financing options for real estate investors.

Hard Money Loans — best for fix and flip. LTV of 70 to 90% of purchase plus rehab. Rates of 9 to 13%. Points of 1 to 3. Speed of 7 to 21 days to close. Qualification is based on the deal, not your income.

DSCR Loans — best for rentals and BRRRR. LTV of 75 to 80%. Rates of 7 to 9%. Qualification is based on the property's cash flow — a DSCR of 1.0 to 1.25 or higher. No personal income verification required.

Conventional Loans — best for primary residence or 1 to 4 unit investment. LTV of 75 to 80% for investment, meaning 20 to 25% down. Market rates, currently 6 to 7%. Limit of 10 financed properties per borrower.

Private Money — best for any strategy with flexible terms. Source from friends, family, or self-directed IRA investors. Rates are negotiable, typically 8 to 12%. Terms are fully negotiable. The key is building trust and a track record first.

Seller Financing — best for properties owned free and clear. Down payment of 10 to 20%. Rates of 6 to 10%, negotiable. Terms of 5 to 30 years. No bank qualification needed.

Self-Directed IRA or 401k — best for tax-advantaged investing. Profits grow tax-free in a Roth or tax-deferred in a traditional account. You cannot benefit personally — no living in the property. Custodians include Equity Trust, Directed IRA, and Entrust.

Each strategy pairs best with specific financing. Flips use hard money. Rentals use DSCR or conventional. BRRRR starts with hard money and refinances to DSCR. Wholesaling needs no financing at all. Subject-To uses the seller's existing financing.`,
        directions: 'Show a comparison table slide with all six financing options. Highlight which strategy each pairs with. Use color coding to match financing to exit strategies.',
      },
      {
        title: 'Using the Lender Directory',
        type: 'screen-recording',
        duration: '5:00',
        script: `Let me show you how to use the Freedom One Lender Directory to find the right lender.

Navigate to the Lenders page. You'll see a curated list of hard money lenders, private lenders, and DSCR loan providers. Each listing includes the company name, loan types, rate range, LTV range, points, term length, minimum credit score, geographic coverage, and direct contact information.

You can filter by loan type — if you need a fix and flip loan, filter for hard money. If you need a rental loan, filter for DSCR.

You can also filter by state to find lenders who operate in your market.

My recommendation: contact 2 to 3 lenders and compare terms. Don't just go with the first lender you find. Even a half-point difference in rate can save you thousands over the life of a project.

Once you've selected a lender, use the Freedom One Deal Analyzer's financing section to model their exact terms. Enter their rate, points, LTV, and term to see how it affects your deal's profitability.`,
        directions: 'Screen recording of the Lender Directory page. Show filtering, browsing listings, and clicking through to contact information. Then show the Deal Analyzer financing section with lender terms entered.',
      },
      {
        title: 'Building Your 90-Day Action Plan',
        type: 'talking-head',
        duration: '4:00',
        script: `We've covered a lot of ground in this course. Let me help you put it all together with a 90-day action plan.

Days 1 through 30 — Foundation. Form your LLC, get your EIN, open your business bank account. Attend two networking events. Analyze 20 deals in the Freedom One Deal Analyzer. Get pre-approved with one hard money lender.

Days 31 through 60 — Deal Flow. Launch two lead generation campaigns from the Marketing Templates. Build your buyers list to 25 contacts. Analyze 30 more deals. Make your first three offers.

Days 61 through 90 — Execution. Get your first property under contract. Build your scope of work using the SOW Templates. Line up your contractor and financing. Close on your first deal.

This timeline is aggressive but achievable. The Freedom One platform gives you every tool you need — the Deal Analyzer, SOW Templates, Marketing Templates, Contract Templates, Lender Directory, and Portfolio Dashboard.

Your success depends on one thing: taking action. The knowledge is here. The tools are here. Now it's up to you.`,
        directions: 'Presenter on camera, motivational and empowering tone. Consider showing the 90-day plan as a graphic overlay with milestones.',
      },
    ],
    closingCTA: 'Start your 90-day action plan today. Get pre-approved with a lender this week.',
    bRollSuggestions: [
      'Screen recording of Freedom One Lender Directory',
      'Screen recording of Deal Analyzer financing section',
      'Calendar with 90-day milestones marked',
      'Investor reviewing loan documents',
      'Handshake between investor and lender',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 9: Mastering the Platform
  // ─────────────────────────────────────────────────────────
  'l-9-1': {
    lessonId: 'l-9-1',
    estimatedRuntime: '30:00',
    equipment: 'Screen recording software, camera (talking head for intro/outro)',
    openingHook: `"In this lesson, I'm going to walk you through the entire Freedom One Deal Analyzer — every button, every field, every calculation. By the end, you'll be able to analyze any deal in under 10 minutes."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '2:00',
        script: `Welcome to Module 9 — Mastering the Freedom One Platform. This is the hands-on module where I walk you through every tool in the platform so you can use it with confidence.

We're starting with the Deal Analyzer — the core of the platform. I'm going to do a complete walkthrough, entering real data and explaining every section. Follow along on your own screen if you can.`,
        directions: 'Presenter on camera, instructional tone. Encourage viewers to follow along.',
      },
      {
        title: 'Subject Property Section',
        type: 'screen-recording',
        duration: '5:00',
        script: `Open the Deal Analyzer from the home page or the top navigation bar.

The first section is Subject Property. Enter the full address — street, city, state, and ZIP. I'll use 123 Main Street, Dallas, Texas, 75201.

Below that, enter the property characteristics. Beds — 3. Baths — 2. Square footage — 1,400. Year built — 1985. Lot size — 6,500 square feet. Property type — Single Family. Garage — 2 car.

Now enter your purchase price. This is the price you'll pay or offer. I'll enter $165,000.

Notice the metro market selector at the top. The app detected Dallas, TX automatically. You can see the regional cost adjustment — Dallas is about 8% below national average. If you need to change the market, click the dropdown and select from 50-plus metro areas.`,
        directions: 'Screen recording. Enter each field slowly with the cursor visible. Pause briefly on the market selector to show the regional adjustment.',
      },
      {
        title: 'Rehab Estimator Section',
        type: 'screen-recording',
        duration: '8:00',
        script: `Scroll down to the Rehab Estimator. You have two modes.

Quick Estimate — click Light, Moderate, or Heavy for a fast cost-per-square-foot estimate. For our 1,400 square foot property, a Moderate rehab comes in at about $38,000.

But for a more accurate estimate, switch to Detailed Scope of Work. Now you can set each room individually.

Click Kitchen. Set the condition to Poor — this kitchen needs a full renovation. Select Standard material tier. You can see every line item — cabinets at $3,200, countertops at $1,800, backsplash at $600, and so on. Each item links to the actual Home Depot product. Click any product name to open the Home Depot page and verify pricing.

Move to Master Bathroom — set it to Fair condition, Standard tier. Full Bathroom — Fair, Standard. Living Room — Fair. Three Bedrooms — Good condition, just paint and flooring.

For the major systems: Electrical — Good. Plumbing — Fair, needs a water heater. HVAC — Good. Roof — Good. No structural issues.

The total rehab estimate is $42,350 after regional adjustment. This is a detailed, line-item estimate with real product pricing — not a guess.`,
        directions: 'Screen recording. Click through each room, showing the condition selector and material tier. Click one Home Depot link to demonstrate. Show the running total updating in real time.',
      },
      {
        title: 'Comps, Financing & Report',
        type: 'screen-recording',
        duration: '10:00',
        script: `Now scroll to Comparable Sales. Click Add Comp and enter your first comparable property. Address, sale price of $265,000, sold 45 days ago, 1,350 square feet, 3 beds 2 baths, Renovated condition.

Add two more comps. The app calculates the average price per square foot and multiplies by your subject's 1,400 square feet. Our calculated ARV is $262,500.

Notice the comp quality grades — each comp gets a letter grade based on similarity to your subject. A-grade comps are the most reliable.

Scroll to Financing. Toggle from Cash to Financed. Enter: 80% LTV, 11% interest rate, 12-month term, 2 origination points. The calculator shows your monthly payment, total interest, and total financing cost.

Now scroll to the Investor Report. This is where everything comes together.

Deal Score: 62 — that's Marginal. The 70% Rule shows our purchase price of $165,000 is above the MAO of $141,750. Net profit is projected at $18,200 with an 8.8% ROI.

But watch this — if I go back and change the purchase price to $145,000, the deal score jumps to 78 — Good territory. Net profit increases to $38,200 with a 19.5% ROI. This is the power of real-time modeling.

Finally, the action buttons. Save Deal saves to the cloud database. Share generates a unique URL. Download PDF creates a professional report. Email sends a summary to any address.`,
        directions: 'Screen recording. Walk through comps, financing, and the Investor Report. Demonstrate changing the purchase price and watching metrics update in real time. Click each action button briefly.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `That's the complete Deal Analyzer walkthrough. You now know every section, every field, and every calculation.

Your homework: analyze three properties right now. Use real listings from Zillow or Realtor.com. Practice entering data, adding comps, and reading the Investor Report. The more you practice, the faster and more accurate your analysis becomes.

In the next lesson, I'll walk you through the SOW Templates and Rehab Estimation tools in detail. See you there.`,
        directions: 'Presenter on camera, encouraging.',
      },
    ],
    closingCTA: 'Analyze 3 real properties in the Deal Analyzer. Next: SOW Templates walkthrough.',
    bRollSuggestions: [
      'Full screen recording of Deal Analyzer walkthrough',
      'Close-up of key metrics updating in real time',
      'Home Depot product page opening from SOW link',
      'Comp quality grades display',
    ],
  },

  'l-9-2': {
    lessonId: 'l-9-2',
    estimatedRuntime: '25:00',
    equipment: 'Screen recording software, camera (talking head for intro/outro)',
    openingHook: `"The SOW Templates are one of the most powerful features in the Freedom One platform. In this lesson, I'll show you how to build a complete, professional scope of work that you can hand directly to your contractor."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '2:00',
        script: `In this lesson, we're doing a deep dive into the SOW Templates and Rehab Estimation tools. By the end, you'll be able to build a complete scope of work for any property in about 15 minutes.

A professional scope of work does three things: it gives your contractor a clear picture of what needs to be done, it provides accurate cost estimates for your deal analysis, and it protects you from scope creep and cost overruns.`,
        directions: 'Presenter on camera, instructional tone.',
      },
      {
        title: 'SOW Templates Walkthrough',
        type: 'screen-recording',
        duration: '15:00',
        script: `Navigate to SOW Templates from the top navigation. You'll see all 14 room categories.

Let me walk through a complete scope of work for a typical flip.

Start with the Kitchen — this is usually the most expensive room. Click Kitchen and you'll see every line item organized by category. Cabinets — three options at different price points. Countertops — laminate, quartz, or granite. Backsplash, sink and faucet, appliances, lighting, and hardware.

Select your material tier. For a $250,000 neighborhood, Standard tier is appropriate. Watch the prices update as you switch between Rental, Standard, and Luxury.

Click any product name — see how it opens the actual Home Depot product page? You can verify the price, check if it's in stock, and even add it to your cart. This is real pricing, not estimates.

Now look at the regional adjustment. I'm in the Dallas market, so costs are adjusted down by about 8%. Switch to San Francisco and watch the numbers jump — that's a 35% increase. This ensures your estimates are accurate for your specific market.

Repeat this for each room. Master Bath, Full Bath, Living Room, Bedrooms. Then the major systems — Electrical, Plumbing, HVAC, Roof, and Structural.

At the bottom, you'll see the total scope of work with a complete line-item breakdown. Print this or save it as a PDF to hand to your contractor for bidding.

One more thing — the market selector syncs between the SOW Templates page and the Deal Analyzer. So when you set your market here, it automatically applies to your deal analysis too.`,
        directions: 'Screen recording of SOW Templates page. Click through multiple rooms, show material tier switching, click a Home Depot link, show regional adjustment changing. Move at a pace viewers can follow.',
      },
      {
        title: 'Tips for Accurate Estimation',
        type: 'talking-head',
        duration: '5:00',
        script: `Let me share some pro tips for accurate rehab estimation.

Tip one — always walk the property before finalizing your budget. Photos and descriptions miss things. You need to see the property in person to catch hidden issues.

Tip two — add a 10 to 15 percent contingency. No matter how detailed your scope of work is, there will be surprises. Budget for them upfront.

Tip three — get contractor bids to validate your estimates. The SOW Templates give you a great starting point, but local contractor pricing may vary. Use the templates as a baseline and adjust based on actual bids.

Tip four — use the detailed scope of work, not the quick estimate, for any deal you plan to pursue. The quick estimate is fine for initial screening, but the detailed SOW is what you need for accurate budgeting.

Tip five — match your material tier to the neighborhood. Don't put luxury finishes in a starter home neighborhood, and don't put rental grade in an upscale area. The SOW Templates make this easy with three clear tiers.

And tip six — document everything with photos. Use the Property Photos feature in the Deal Analyzer to photograph each room before, during, and after the rehab. This creates a visual record that's invaluable for future deals and for your credibility packet.`,
        directions: 'Presenter on camera, experienced and advisory tone. Count off tips on fingers.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Your action item: go to the SOW Templates page and build a complete scope of work for a property you're evaluating. Print it out and use it to get contractor bids.

In the next lesson, I'll walk you through the Portfolio Dashboard and Saved Deals management system. See you there.`,
        directions: 'Presenter on camera, encouraging.',
      },
    ],
    closingCTA: 'Build a complete SOW and get contractor bids. Next: Portfolio Dashboard.',
    bRollSuggestions: [
      'Screen recording of SOW Templates with room-by-room walkthrough',
      'Home Depot product pages opening from SOW links',
      'Contractor reviewing a printed scope of work on a job site',
      'Before/after renovation photos',
    ],
  },

  'l-9-3': {
    lessonId: 'l-9-3',
    estimatedRuntime: '20:00',
    equipment: 'Screen recording software, camera (talking head for intro/outro)',
    openingHook: `"Once you start saving deals, you need a system to track them. In this lesson, I'll show you the Portfolio Dashboard and Saved Deals management — your command center for every deal in your pipeline."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '2:00',
        script: `In this lesson, we're covering the Portfolio Dashboard and Saved Deals page. These two tools work together to give you a complete picture of your deal pipeline — from the first analysis to the final closing.

Everything is stored in the cloud, so you can access your deals from any device, any browser, at any time.`,
        directions: 'Presenter on camera, organized and systematic tone.',
      },
      {
        title: 'Saving and Managing Deals',
        type: 'screen-recording',
        duration: '8:00',
        script: `Let me show you the complete workflow.

First, save a deal from the Deal Analyzer. After you've completed your analysis, scroll to the Investor Report and click Save Deal. The deal is saved to the cloud database with all property details, comps, rehab estimates, financing terms, and photos.

Now navigate to Saved Deals from the top navigation. Here are all your saved deals.

You can switch between Card View and Table View using the icons in the toolbar. Card View shows visual cards with property details and metrics. Table View is a compact spreadsheet for comparing many deals at once.

Each deal has a status. Click the status dropdown to change it — Active, Under Contract, Closed, Passed, or Archived. Use these to track your deal pipeline.

Click the star icon to favorite a deal. Starred deals appear first when sorting by favorites.

Now let me show you the inline notes feature. Click the sticky note icon on any deal card. A notes area expands below the card. Type your notes — "Seller motivated, asking $10K below market. Call back Friday." The notes auto-save to the database.

Use the toolbar to sort and filter. Search by address. Sort by ROI, profit, deal score, or date. Filter by status or verdict.

To delete a deal, click the trash icon. A confirmation dialog prevents accidental deletion.`,
        directions: 'Screen recording of Saved Deals page. Demonstrate switching views, changing status, starring, adding notes, sorting, filtering, and deleting. Show each feature clearly.',
      },
      {
        title: 'Portfolio Dashboard',
        type: 'screen-recording',
        duration: '7:00',
        script: `Now navigate to Portfolio from the top navigation. This is your performance dashboard.

At the top, you see four KPI cards: Total Deals, Total Invested, Projected Profit, and Average ROI. These aggregate all your saved deals automatically.

Below that is the date range filter. Click the dropdown to filter by All Time, Last 7 Days, Last 30 Days, Last 90 Days, This Quarter, This Year, or a Custom Range. Watch how all the metrics, charts, and the deal table update instantly when you change the filter.

The Financial Summary grid shows a detailed breakdown — total purchase price, total rehab budget, total ARV, financing costs, holding costs, closing costs, net profit, and average deal score.

Below that are two charts. The ROI Distribution doughnut shows how many deals fall into each ROI bracket. The Profit by Deal bar chart shows net profit for each deal, sorted by profitability.

And at the bottom is the full deal table with sortable columns.

Now let me show you the PDF export. Click Download PDF in the header. A new tab opens with a professionally branded Portfolio Summary Report. Use Ctrl+P or Cmd+P to save as PDF. This report includes all the KPI cards, financial summary, charts, and the complete deal table. It's perfect for investor meetings or lender presentations.`,
        directions: 'Screen recording of Portfolio Dashboard. Show KPI cards, change the date range filter, scroll through charts and table, then demonstrate the PDF export.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `The Portfolio Dashboard and Saved Deals page are your deal management command center. Save every deal you analyze, update statuses as deals progress, and use the Portfolio Dashboard to track your performance over time.

In the next lesson, I'll cover Property Photos, Sharing, and PDF Reports — how to document properties, share analyses with partners, and generate professional reports. See you there.`,
        directions: 'Presenter on camera, encouraging.',
      },
    ],
    closingCTA: 'Save 5 deals and explore the Portfolio Dashboard. Next: Photos & Sharing.',
    bRollSuggestions: [
      'Screen recording of Saved Deals page with full workflow',
      'Screen recording of Portfolio Dashboard with date filtering',
      'Portfolio PDF opening in a new tab',
      'Investor reviewing portfolio on a laptop',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 3 LESSON 3: Price Reduction Strategy
  // ─────────────────────────────────────────────────────────
  'l-3-3': {
    lessonId: 'l-3-3',
    estimatedRuntime: '18:00',
    equipment: 'Camera (talking head), slide deck, screen recording, sample documents',
    openingHook: `"One of the most powerful tools in your negotiation toolkit costs nothing, is completely legal, and can save you $5,000 to $30,000 on every deal. It's the post-inspection price reduction request — and today I'm going to show you exactly how to use it."`,
    segments: [
      {
        title: 'What Is a Price Reduction Request',
        type: 'talking-head',
        duration: '4:00',
        script: `Let me be clear from the start — this is not a trick, not a loophole, and not a bait-and-switch. A price reduction request is a standard, ethical negotiation tool that every professional real estate investor and agent uses.

Here's how it works. When you put a property under contract, your purchase agreement includes an inspection contingency — typically 7 to 14 days. During that period, you hire a licensed inspector to examine the property. If the inspection reveals issues that weren't anticipated when you made your offer, you have the contractual right to request a price reduction.

This is completely normal. It happens in the majority of real estate transactions. The seller can accept your request, counter-offer, reject it, or you can exercise your contingency and walk away.

The key is that your request must be based on REAL findings from a REAL inspection. You're not making things up. You're documenting legitimate issues and asking the seller to account for them in the price.`,
        directions: 'Presenter on camera, professional and authoritative tone. Emphasize the ethical and legal nature of this strategy.',
      },
      {
        title: 'The Step-by-Step Process',
        type: 'slides',
        duration: '6:00',
        script: `Here's the exact process, step by step.

Step 1: Make a strong offer with an inspection contingency. This is standard language in virtually every purchase agreement. Your offer should be competitive enough to get accepted.

Step 2: Hire a licensed home inspector. Budget $300 to $500 for a thorough inspection. This is not the place to cut corners. A good inspector will find things you'd never notice — foundation issues, electrical problems, plumbing concerns, roof damage, HVAC issues.

Step 3: Attend the inspection in person. Walk through with the inspector. Take detailed photos of every issue they find. Document everything — dates, descriptions, locations.

Step 4: Get repair estimates. For significant issues, get written estimates from licensed contractors. A contractor's written bid carries far more weight than your own guess.

Step 5: Prepare your Price Reduction Request letter. Use the Freedom One Price Reduction Form in the Resources section. It auto-fills your business information and creates a professional letter with itemized repair costs.

Step 6: Submit the letter to the seller or their agent within your inspection contingency period. Be professional, factual, and specific.

Step 7: Negotiate. The seller will respond — accept, counter, or reject. Be prepared to negotiate, but know your walk-away number before you start.`,
        directions: 'Show slides with each step numbered. Include sample photos of common inspection findings. Show a brief screen recording of the Freedom One Price Reduction Form.',
      },
      {
        title: 'Ninja Negotiation Tips',
        type: 'talking-head',
        duration: '5:00',
        script: `Now let me share some advanced tips that will make your price reduction requests more effective.

Ninja Tip 1: Take inspection photos immediately. Document issues the moment they're discovered, before any cleanup. This captures the true worst condition and gives you the strongest documentation for your request.

Ninja Tip 2: Get multiple contractor bids. Having 2 to 3 written estimates from licensed contractors is far more persuasive than a single bid. It shows the repair costs are legitimate and market-rate.

Ninja Tip 3: Itemize everything separately. Instead of saying "$15,000 in repairs," list 25 individual items at $600 each. A detailed list of 25 items looks more substantial and is harder for the seller to dismiss.

Ninja Tip 4: Always hire a licensed inspector. A professional inspector's report carries significantly more weight than your own observations. The report becomes an objective third-party document that supports your request.

Ninja Tip 5: Calculate your daily burn rate. Know exactly how much each day costs you in holding costs. This helps you decide how hard to negotiate versus when to accept a counter-offer and move forward.

Remember — the goal is a fair deal for both parties. You're not trying to steal the property. You're asking the seller to account for legitimate repair costs that affect the property's value.`,
        directions: 'Presenter on camera, experienced and advisory tone. Show examples of itemized repair lists versus lump-sum requests.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '3:00',
        script: `The price reduction strategy is one of the most valuable tools in your investing toolkit. Used ethically and professionally, it can save you thousands on every deal.

Your action items: Go to the Freedom One Resources section and review the Price Reduction Form. Familiarize yourself with the letter template. And on your next deal, hire a licensed inspector and use this process.

In Module 4, we'll cover Wholesaling — a strategy that requires zero rehab and zero risk. See you there.`,
        directions: 'Presenter on camera, encouraging tone. Show a quick screen recording of the Price Reduction Form in the Resources section.',
      },
    ],
    closingCTA: 'Review the Price Reduction Form in Resources. Practice this strategy on your next deal.',
    bRollSuggestions: [
      'Home inspector examining a property',
      'Close-up of inspection report with noted issues',
      'Screen recording of Freedom One Price Reduction Form',
      'Contractor writing an estimate',
      'Before photos of common repair issues (roof, plumbing, electrical)',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BONUS MODULE 10: Asset Protection
  // ─────────────────────────────────────────────────────────
  'l-10-1': {
    lessonId: 'l-10-1',
    estimatedRuntime: '22:00',
    equipment: 'Camera (talking head), slide deck, whiteboard',
    openingHook: `"You can make a million dollars in real estate, but if you don't protect it properly, one lawsuit can take it all away. In this bonus module, I'm going to show you exactly how to structure your entities, trusts, and accounts to build an asset protection fortress around your wealth."`,
    segments: [
      {
        title: 'Entity Structures',
        type: 'whiteboard',
        duration: '8:00',
        script: `Let me draw out the entity structures that every serious investor needs to understand.

First, the basic LLC. This is your foundation. An LLC creates a legal wall between your personal assets and your business. If a tenant slips and falls at your rental property and sues, they can only reach the assets inside that LLC — not your personal home, savings, or retirement accounts.

But here's where it gets powerful. A Series LLC — available in Texas, Delaware, Illinois, Nevada, Wyoming, and other states — lets you create separate "series" within a single LLC. Each property goes into its own series. If someone sues over Property A, they can only reach the assets in Series A. Properties B, C, and D are completely protected.

For investors in states without Series LLCs, use the Multi-LLC strategy. Create a Management LLC that owns no property but manages everything. Then create separate Property LLCs for each property or group of properties.

And for active flippers doing 3 or more deals per year, consider an S-Corporation election. This can save you $5,000 to $15,000 per year in self-employment taxes by allowing you to split income between salary and distributions.`,
        directions: 'Draw entity structures on whiteboard. Show the Series LLC with separate series boxes. Draw the Multi-LLC structure with arrows showing management relationships.',
      },
      {
        title: 'Trusts for Real Estate',
        type: 'slides',
        duration: '7:00',
        script: `Trusts are the second layer of your asset protection strategy.

A Land Trust provides privacy. When you hold property in a land trust, your name doesn't appear in public records. The trust name is on the deed. This is especially valuable for subject-to deals where you don't want the lender to easily identify you as the new owner.

A Revocable Living Trust is essential for estate planning. Without one, your heirs face months or years of probate court to access your properties. During that time, properties go unmaintained, tenants stop paying, and value erodes. A living trust lets your properties pass to your heirs immediately, without court involvement.

The most sophisticated investors combine trusts and LLCs. Your Revocable Living Trust owns the membership interests of your LLCs. Your LLCs own the individual properties. This gives you privacy from the trust, liability protection from the LLCs, and estate planning that avoids probate.`,
        directions: 'Show slides with trust structure diagrams. Display the Trust + LLC layering strategy as a visual hierarchy.',
      },
      {
        title: 'Self-Directed IRA Investing',
        type: 'talking-head',
        duration: '5:00',
        script: `Here's something most people don't know — you can use your IRA or 401k to invest in real estate. A Self-Directed IRA allows you to buy properties, fund private loans, and invest in tax liens — all with tax-advantaged dollars.

Imagine buying a property for $100,000 in your Roth IRA, rehabbing it for $30,000, and selling it for $200,000. That's $70,000 in profit — completely tax-free. Forever.

But there are strict rules. You cannot live in or vacation at a property owned by your IRA. You cannot hire yourself or family members to work on it. You cannot use personal funds to pay IRA property expenses. Violating these rules can disqualify your entire IRA.

The Solo 401k is even more powerful for self-employed investors. Higher contribution limits — up to $69,000 per year — plus you can borrow up to $50,000 from your own account for any purpose. And some Solo 401k plans offer checkbook control, so you can write checks directly without custodian delays.`,
        directions: 'Presenter on camera, knowledgeable and advisory tone. Show comparison tables of Traditional vs. Roth IRA tax treatment.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Asset protection isn't optional — it's essential. The time to set up your entity structure is BEFORE you need it, not after a lawsuit is filed.

Your action items: consult with a real estate attorney about the right entity structure for your state, talk to your CPA about the S-Corp election if you're doing 3 or more flips per year, and research Self-Directed IRA custodians if you have retirement funds you want to put to work.

In the next bonus module, we'll cover Creative Financing Mastery — advanced deal structures that let you buy properties with little to no money down.`,
        directions: 'Presenter on camera, serious and professional tone.',
      },
    ],
    closingCTA: 'Consult a real estate attorney about entity structure. Research SDIRA custodians. Next: Creative Financing Mastery.',
    bRollSuggestions: [
      'Whiteboard diagrams of LLC and Series LLC structures',
      'Attorney reviewing documents at a desk',
      'Entity structure hierarchy diagram',
      'IRA account dashboard screenshot',
      'Courthouse exterior (symbolizing legal protection)',
    ],
  },
  'l-10-2': {
    lessonId: 'l-10-2',
    estimatedRuntime: '20:00',
    equipment: 'Camera (talking head), slide deck',
    openingHook: `"Trusts aren't just for the wealthy — they're for the smart. In this lesson, I'll show you how land trusts, living trusts, and irrevocable trusts can protect your real estate portfolio and ensure your wealth passes to your family without the nightmare of probate."`,
    segments: [
      {
        title: 'Land Trusts Deep Dive',
        type: 'slides',
        duration: '8:00',
        script: `A land trust is one of the most underused tools in real estate investing. Let me show you exactly how it works and when to use it.

A land trust has three parties: the grantor (you — the person creating the trust), the trustee (a title company, attorney, or trust company who holds legal title), and the beneficiary (you again — the person who controls and benefits from the property).

The power of a land trust is privacy. When someone searches public records, they see the trust name — not your name. This is valuable for several reasons. First, it prevents tenants from finding your personal address and showing up at your door. Second, it makes it harder for ambulance-chasing attorneys to identify you as a target. Third, for subject-to deals, it provides a layer of separation from the original mortgage.

To create a land trust: draft the trust agreement naming yourself as beneficiary and a third party as trustee, then deed the property into the trust. Record the deed with the county. That's it.

Name your trusts generically — "123 Main Street Trust" or "Oak Avenue Land Trust" — not "John Smith Family Trust." Generic names provide maximum privacy.`,
        directions: 'Show slides explaining the three-party structure of a land trust. Display examples of generic trust names.',
      },
      {
        title: 'Living Trusts and Estate Planning',
        type: 'talking-head',
        duration: '7:00',
        script: `If you own 5 or more properties, a revocable living trust is not optional — it's mandatory.

Here's what happens without one. You pass away. Your family has to go to probate court for EVERY property you own. In some states, probate takes 6 to 18 months. During that time, nobody can sell the properties, refinance them, or make major decisions. Tenants may stop paying rent. Properties may fall into disrepair. And probate costs 3 to 7 percent of the estate value — that's $30,000 to $70,000 on a $1 million portfolio.

With a living trust, your successor trustee takes over immediately. No court involvement. No delays. No public record. Your properties continue to be managed, rents continue to be collected, and your family is protected.

The cost to set up a living trust is $1,500 to $3,000 with an estate planning attorney. That's a one-time cost that saves your family tens of thousands and months of stress.

Review your trust every 3 years as your portfolio grows and laws change.`,
        directions: 'Presenter on camera, serious and caring tone. Show comparison of probate vs. trust administration timelines.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Trusts are the second pillar of your asset protection strategy. Combined with proper LLC structure, they create a comprehensive shield around your wealth.

Your action items: if you own investment property, schedule a consultation with an estate planning attorney this month. Ask specifically about land trusts for privacy and a revocable living trust for estate planning. The cost is minimal compared to the protection you receive.`,
        directions: 'Presenter on camera, advisory and motivational.',
      },
    ],
    closingCTA: 'Schedule a consultation with an estate planning attorney. Set up land trusts for privacy on your properties.',
    bRollSuggestions: [
      'Trust document being signed',
      'Attorney meeting with clients',
      'County recorder office exterior',
      'Family reviewing estate planning documents',
    ],
  },
  'l-10-3': {
    lessonId: 'l-10-3',
    estimatedRuntime: '22:00',
    equipment: 'Camera (talking head), slide deck, screen recording',
    openingHook: `"What if I told you that you could flip a house and keep 100% of the profit — tax-free? That's the power of a Self-Directed Roth IRA. In this lesson, I'll show you exactly how to use your retirement accounts to invest in real estate."`,
    segments: [
      {
        title: 'SDIRA Basics',
        type: 'slides',
        duration: '8:00',
        script: `A Self-Directed IRA is a retirement account that lets you invest in alternative assets — including real estate. Most people don't know this exists because traditional brokerages like Fidelity and Schwab don't offer it. You need a specialized custodian.

Here's how it works. You open a SDIRA with a custodian that allows real estate — Equity Trust, Directed IRA, Entrust, or Alto IRA are popular options. You fund the account via contribution, rollover from an existing IRA or 401k, or transfer.

Then you find a deal using the same strategies you've learned in this course. You direct your custodian to purchase the property on behalf of your IRA. All income and expenses flow through the IRA — rent comes in, expenses go out, all within the account.

The Traditional SDIRA gives you tax-deferred growth — you pay taxes when you withdraw in retirement. But the Roth SDIRA is the real game-changer. With a Roth, all growth is tax-FREE. A $70,000 flip profit in a Roth IRA? Zero taxes. Ever.

The Solo 401k is even better for self-employed investors. Contribution limits up to $69,000 per year, a loan provision that lets you borrow $50,000 from your own account, and some plans offer checkbook control for instant transactions.`,
        directions: 'Show comparison tables of account types, contribution limits, and tax treatment. Display custodian logos and features.',
      },
      {
        title: 'Rules and Strategies',
        type: 'talking-head',
        duration: '8:00',
        script: `The IRS has strict rules about SDIRA investing, and violating them can destroy your entire account. So pay attention.

Prohibited transactions: You cannot live in or vacation at a property owned by your IRA. You cannot hire yourself or family members to work on it. You cannot buy from or sell to yourself or family members. You cannot use personal funds to pay IRA property expenses.

Disqualified persons include you, your spouse, your parents, your children, their spouses, and any entity you own 50% or more of.

The penalty for a prohibited transaction? The entire IRA is treated as distributed. That means income tax on the full balance plus a 10% early withdrawal penalty if you're under 59 and a half.

Now for the strategies. Number one: buy and hold rentals in your IRA. Collect rent tax-free and build long-term wealth. Number two: private lending. Use your IRA to fund hard money loans to other investors at 8 to 12 percent interest. This is actually the easiest way to start — no property management required. Number three: fix and flip inside your IRA. Buy, rehab using IRA funds to pay contractors, and sell for tax-free profit.

One critical tip: keep 6 months of expenses in your IRA as cash. If your IRA property needs a repair and you don't have cash in the account, you cannot use personal funds to cover it. That would be a prohibited transaction.`,
        directions: 'Presenter on camera, serious tone when discussing rules, enthusiastic when discussing strategies. Show the prohibited transaction rules as a clear graphic.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '2:00',
        script: `Self-Directed IRAs and Solo 401ks are powerful tools that most investors never discover. If you have retirement funds sitting in a traditional brokerage earning 7 to 10 percent, imagine putting that money to work in real estate earning 15 to 25 percent — or more — tax-free.

Your action items: research SDIRA custodians, calculate how much you could roll over from existing retirement accounts, and consider starting with private lending to build your IRA balance before buying property directly.`,
        directions: 'Presenter on camera, motivational and forward-looking.',
      },
    ],
    closingCTA: 'Research SDIRA custodians and calculate your rollover potential. Start with private lending to build your IRA balance.',
    bRollSuggestions: [
      'IRA custodian website screenshots',
      'Calculator showing tax-free growth projections',
      'Retirement account statement',
      'Property purchased with IRA funds',
    ],
  },

  // ─────────────────────────────────────────────────────────
  // BONUS MODULE 11: Creative Financing Mastery
  // ─────────────────────────────────────────────────────────
  'l-11-1': {
    lessonId: 'l-11-1',
    estimatedRuntime: '20:00',
    equipment: 'Camera (talking head), slide deck, whiteboard',
    openingHook: `"What if you could buy a $300,000 property with $20,000 down, no bank qualification, and a 5% interest rate? That's seller financing — and in this lesson, I'll show you how to structure these deals so both you and the seller win."`,
    segments: [
      {
        title: 'Seller Financing Structures',
        type: 'whiteboard',
        duration: '8:00',
        script: `Seller financing is when the seller acts as the bank. Instead of getting a mortgage from a traditional lender, you make payments directly to the seller. Let me draw out the three main structures.

First, Full Seller Carry. The seller finances 100 percent of the purchase price. You make monthly payments of principal plus interest directly to the seller. Typical terms are 10 to 30 year amortization with a 5 to 7 year balloon payment.

Second, Partial Seller Carry. A bank finances 70 to 80 percent as the first mortgage. The seller finances 10 to 20 percent as a second mortgage. You bring 5 to 10 percent as a down payment. This dramatically reduces your cash needed.

Third, the Wrap-Around Mortgage. This is the most creative structure. The seller has an existing mortgage at, say, 3.5 percent. You create a new mortgage at 7 percent that wraps around the existing one. You pay the seller at 7 percent. The seller continues paying their 3.5 percent mortgage. The seller profits from the interest rate spread.

Why do sellers agree to this? Higher sale price, monthly income stream, tax benefits from installment sales, and interest income that beats any bank CD.`,
        directions: 'Draw each structure on whiteboard with payment flows and interest rates. Use different colors for each party. Show the wrap-around mortgage with the existing mortgage inside the new one.',
      },
      {
        title: 'Negotiation and Legal Requirements',
        type: 'slides',
        duration: '7:00',
        script: `The key to seller financing is how you approach the conversation. Never lead with "Will you finance the deal?" Instead, ask about their goals.

If they want retirement income, say: "What if I could give you a guaranteed monthly income at a better rate than any bank CD, secured by this property?"

If they want to pay off debt, say: "What if we structured a deal where you get a large down payment to pay off your debts, plus monthly income for the next 10 years?"

Always present it as THEIR benefit.

For the terms negotiation, remember the framework: the seller controls the price, you control the terms. If a seller insists on full asking price, agree — but negotiate 5 percent interest, 30-year amortization, and 10 percent down. The terms determine your actual cost, not the sticker price.

Legal requirements: use a real estate attorney to draft the promissory note and mortgage. Record the mortgage with the county. Use a loan servicing company to handle payments. Comply with Dodd-Frank rules. And always get title insurance.`,
        directions: 'Show slides with negotiation scripts and term comparison tables. Display legal checklist.',
      },
      {
        title: 'Closing',
        type: 'talking-head',
        duration: '3:00',
        script: `Seller financing opens doors that traditional financing keeps locked. It lets you buy properties with less money down, avoid bank qualification, and create terms that work for your investment strategy.

Your action items: identify free-and-clear properties in your target market by searching county records for properties with no recorded liens. These owners have maximum flexibility to offer seller financing. Practice your pitch and be ready to present it on your next deal.

In the next lesson, we'll cover lease options, private money, and advanced deal stacking strategies.`,
        directions: 'Presenter on camera, confident and forward-looking.',
      },
    ],
    closingCTA: 'Search county records for free-and-clear properties. Practice your seller financing pitch.',
    bRollSuggestions: [
      'Whiteboard diagrams of seller financing structures',
      'Seller and buyer shaking hands',
      'Promissory note document',
      'County records search on computer screen',
    ],
  },
  'l-11-2': {
    lessonId: 'l-11-2',
    estimatedRuntime: '24:00',
    equipment: 'Camera (talking head), slide deck, whiteboard, screen recording',
    openingHook: `"In this lesson, I'm going to show you the most advanced creative financing strategies — lease options, private money, and deal stacking. These are the techniques that let experienced investors buy properties with zero money out of pocket."`,
    segments: [
      {
        title: 'Lease Options',
        type: 'whiteboard',
        duration: '8:00',
        script: `A lease option gives you the right — but not the obligation — to purchase a property at a predetermined price within a specified timeframe. Let me draw this out.

You negotiate a lease with the property owner for 1 to 3 years. You pay an option consideration fee — typically $2,000 to $10,000 — for the exclusive right to buy at a set price. You make monthly lease payments, and a portion may credit toward the purchase.

Now here's where it gets powerful — the Sandwich Lease Option. You lease-option a property from the owner at one price. Then you sub-lease-option it to a tenant-buyer at a higher price and higher monthly payment. You profit from both the monthly spread and the price spread.

Example: You lease-option at $200,000 with $1,200 monthly payments. You sub-lease-option to a tenant-buyer at $225,000 with $1,600 monthly payments. You collect a $7,000 option fee from the tenant-buyer after paying $3,000 to the owner. That's $4,000 upfront, $400 per month cash flow, and a $25,000 price spread when the tenant-buyer exercises.

You can also use lease options for flips — lease-option a property that needs work, rehab during the lease period, then exercise the option and sell at full market value.`,
        directions: 'Draw the sandwich lease option on whiteboard showing all three parties and money flows. Use different colors for each party.',
      },
      {
        title: 'Private Money and Deal Stacking',
        type: 'slides',
        duration: '8:00',
        script: `Private money comes from individuals — not institutions — who want better returns on their capital. Your job is to find these people and present them with a compelling opportunity.

Where to find private money: friends and family, fellow investors at REIA meetings, professionals like doctors and lawyers with idle capital, self-directed IRA holders, and online platforms.

The pitch: lead with THEIR return. "I have an opportunity for you to earn 10 percent annually, secured by real property." Show your track record using Freedom One Credibility Packets. Explain the security — first-position lien, title insurance, hazard insurance. Present a specific deal with numbers from the Freedom One Deal Analyzer.

Now, deal stacking. This is where you combine multiple financing sources on a single deal. Example: hard money covers 80 percent of purchase, private money covers the remaining 20 percent, hard money also covers the rehab draw. Total funded: 100 percent. Your cash in: zero.

The most advanced structure combines subject-to plus wrap plus lease option. Buy subject-to the existing mortgage at 3.5 percent. Create a wrap mortgage at 7 percent and sell to a buyer on owner financing. Profit from the rate spread — potentially $700 to $900 per month in cash flow plus a large down payment upfront.`,
        directions: 'Show slides with private money pitch framework, deal stacking examples with funding sources table, and the subject-to + wrap + lease option combo diagram.',
      },
      {
        title: 'Ninja Tips and Closing',
        type: 'talking-head',
        duration: '5:00',
        script: `Let me leave you with the most important creative financing ninja tips.

Always get the deed. In any creative deal — subject-to, seller financing, wrap — make sure you get the deed recorded in your name or your entity's name. Controlling payments without the deed is risky.

Use a loan servicing company. For $15 to $25 per month, they handle payment collection, escrow, tax reporting, and create a professional paper trail. This protects you legally.

Build a capital stack spreadsheet for every deal. List every source of funds, the cost of each source, and the total blended cost of capital. This tells you instantly whether a deal works.

And most importantly — start with one creative strategy and master it. Don't try to learn seller financing, subject-to, wraps, and lease options all at once. Pick one, do 3 to 5 deals, then add the next strategy.

Congratulations on completing the bonus modules. You now have knowledge that 99 percent of investors never access. Use it wisely, use it ethically, and go build your real estate empire.`,
        directions: 'Presenter on camera, experienced and motivational tone. End on a high note as this is the final lesson of the bonus content.',
      },
    ],
    closingCTA: 'Build your credibility packet. Find your first private money partner. Master one creative strategy at a time.',
    bRollSuggestions: [
      'Whiteboard diagram of sandwich lease option',
      'Private money meeting between investor and lender',
      'Deal stacking spreadsheet on screen',
      'Closing table celebration',
      'Freedom One platform montage',
    ],
  },

  'l-2-3': {
    lessonId: 'l-2-3',
    estimatedRuntime: '5:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into your first deal roadmap — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Your First Deal Roadmap. This is part of Module 2: Foundation: Building Your Business. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 2 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '3:00',
        script: `Step-by-step getting started guide. From analyzing your first deal to closing. Timeline expectations and common first-deal mistakes to avoid.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on your first deal roadmap. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-2-4': {
    lessonId: 'l-2-4',
    estimatedRuntime: '5:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into why you need an llc — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Why You Need an LLC. This is part of Module 2: Foundation: Building Your Business. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 2 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '3:00',
        script: `Legal protection basics, personal asset protection, pass-through taxation, and why every investor needs an entity before their first deal.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on why you need an llc. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-2-5': {
    lessonId: 'l-2-5',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into choosing your entity structure — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Choosing Your Entity Structure. This is part of Module 2: Foundation: Building Your Business. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 2 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `LLC vs S-Corp vs sole proprietor comparison. Series LLCs, the 2-entity strategy. Which structure fits your investment strategy.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on choosing your entity structure. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-2-6': {
    lessonId: 'l-2-6',
    estimatedRuntime: '8:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into setting up your business — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Setting Up Your Business. This is part of Module 2: Foundation: Building Your Business. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 2 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '6:00',
        script: `Getting your EIN, opening business bank accounts, setting up bookkeeping, business insurance, CRM setup, and creating your brand.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on setting up your business. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-2-7': {
    lessonId: 'l-2-7',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into the 8 people you need on your team — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering The 8 People You Need on Your Team. This is part of Module 2: Foundation: Building Your Business. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 2 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `Real estate attorney, CPA, general contractor, investor-friendly agent, title company, hard money lender, property inspector, insurance agent. What each does and why you need them.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on the 8 people you need on your team. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-2-8': {
    lessonId: 'l-2-8',
    estimatedRuntime: '6:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into finding and vetting your team — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Finding and Vetting Your Team. This is part of Module 2: Foundation: Building Your Business. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 2 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '4:00',
        script: `Where to find team members (REIA, BiggerPockets, Facebook groups, courthouse steps). Interview questions, red flags, and building your B-team backup.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on finding and vetting your team. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-3-4': {
    lessonId: 'l-3-4',
    estimatedRuntime: '6:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into online lead generation — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Online Lead Generation. This is part of Module 3: Finding Deals: Acquisition Strategies. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 3 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '4:00',
        script: `Digital marketing for deal flow: SEO, social media marketing, Facebook ads for motivated sellers, Craigslist, and online lead platforms.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on online lead generation. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-3-5': {
    lessonId: 'l-3-5',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), whiteboard or digital whiteboard, markers',
    openingHook: `"In this lesson, we're diving into arv and the 70% rule — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'whiteboard',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering ARV and the 70% Rule. This is part of Module 3: Finding Deals: Acquisition Strategies. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 3 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'whiteboard',
        duration: '5:00',
        script: `Core formulas every investor must know: After Repair Value calculation, the 70% rule, Maximum Allowable Offer formula, and when to adjust the percentages.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'whiteboard',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on arv and the 70% rule. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-3-6': {
    lessonId: 'l-3-6',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into running your comps — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Running Your Comps. This is part of Module 3: Finding Deals: Acquisition Strategies. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 3 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `How to pull and analyze comparable sales: selecting comps, adjusting for differences, using MLS data, Zillow, Redfin, and county records. Common comp mistakes.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on running your comps. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-3-7': {
    lessonId: 'l-3-7',
    estimatedRuntime: '6:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into making your offer — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Making Your Offer. This is part of Module 3: Finding Deals: Acquisition Strategies. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 3 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '4:00',
        script: `MAO calculation in practice, crafting your offer letter, negotiation basics, contingencies to include, and how to present your offer to sellers.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on making your offer. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-4-2': {
    lessonId: 'l-4-2',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into hiring and managing contractors — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Hiring and Managing Contractors. This is part of Module 4: Fix & Flip Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 4 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `Getting competitive bids, contractor contracts, draw schedules, daily oversight, managing subcontractors, and handling contractor disputes.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on hiring and managing contractors. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-4-3': {
    lessonId: 'l-4-3',
    estimatedRuntime: '6:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into budget control and timeline management — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Budget Control and Timeline Management. This is part of Module 4: Fix & Flip Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 4 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '4:00',
        script: `Tracking rehab costs in real-time, contingency budgets, timeline milestones, handling change orders, and preventing scope creep.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on budget control and timeline management. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-4-4': {
    lessonId: 'l-4-4',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into pricing and listing strategy — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Pricing and Listing Strategy. This is part of Module 4: Fix & Flip Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 4 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `How to price your flip for maximum profit, staging strategies, professional photography, listing descriptions, and choosing the right listing agent.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on pricing and listing strategy. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-4-5': {
    lessonId: 'l-4-5',
    estimatedRuntime: '6:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into closing the sale — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Closing the Sale. This is part of Module 4: Fix & Flip Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 4 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '4:00',
        script: `Handling offers, negotiation strategies with buyers, multiple offer situations, closing process, and calculating your final profit.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on closing the sale. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-4-6': {
    lessonId: 'l-4-6',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into the post-inspection playbook — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering The Post-Inspection Playbook. This is part of Module 4: Fix & Flip Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 4 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `Common inspection findings, how to prepare for inspections, pre-listing inspections, and understanding what buyers will flag.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on the post-inspection playbook. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-4-7': {
    lessonId: 'l-4-7',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into negotiating repair credits — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Negotiating Repair Credits. This is part of Module 4: Fix & Flip Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 4 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `Counter-offer strategies after inspection, repair credit vs. price reduction, which repairs to concede, and protecting your bottom line.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on negotiating repair credits. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-4-8': {
    lessonId: 'l-4-8',
    estimatedRuntime: '6:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into protecting your profit margin — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Protecting Your Profit Margin. This is part of Module 4: Fix & Flip Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 4 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '4:00',
        script: `When to concede vs. walk away, deal-killing inspection items, renegotiation tactics, and ensuring profitability through the closing table.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on protecting your profit margin. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-5-2': {
    lessonId: 'l-5-2',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into finding buyers and building your list — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Finding Buyers and Building Your List. This is part of Module 5: Wholesaling Fundamentals. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 5 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `Cash buyer strategies: building your buyers list, qualifying buyers, marketing your deals, and creating a reliable disposition system.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on finding buyers and building your list. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-5-3': {
    lessonId: 'l-5-3',
    estimatedRuntime: '6:00',
    equipment: 'Camera (talking head), whiteboard or digital whiteboard, markers',
    openingHook: `"In this lesson, we're diving into contracts and closing your first wholesale deal — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'whiteboard',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Contracts and Closing Your First Wholesale Deal. This is part of Module 5: Wholesaling Fundamentals. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 5 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'whiteboard',
        duration: '4:00',
        script: `Assignment contracts, 'and/or assigns' language, double close mechanics, title company coordination, and step-by-step first deal walkthrough.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'whiteboard',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on contracts and closing your first wholesale deal. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-6-2': {
    lessonId: 'l-6-2',
    estimatedRuntime: '6:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into refinance — pulling your cash out — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Refinance — Pulling Your Cash Out. This is part of Module 6: The BRRRR Strategy. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 6 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '4:00',
        script: `Cash-out refinance process, seasoning requirements, LTV ratios, DSCR loans, working with lenders, and maximizing your cash-out amount.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on refinance — pulling your cash out. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-6-3': {
    lessonId: 'l-6-3',
    estimatedRuntime: '6:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into repeat — scaling your portfolio — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Repeat — Scaling Your Portfolio. This is part of Module 6: The BRRRR Strategy. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 6 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '4:00',
        script: `Reinvesting proceeds, portfolio growth strategies, when to BRRRR vs. flip, building passive income, and the path to financial freedom through rentals.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on repeat — scaling your portfolio. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-7-2': {
    lessonId: 'l-7-2',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), whiteboard or digital whiteboard, markers',
    openingHook: `"In this lesson, we're diving into finding subject-to deals — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'whiteboard',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Finding Subject-To Deals. This is part of Module 7: Subject-To Financing. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 7 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'whiteboard',
        duration: '5:00',
        script: `Identifying motivated sellers, conversation scripts, pre-foreclosure targeting, marketing for subject-to deals, and qualifying opportunities.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'whiteboard',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on finding subject-to deals. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-7-3': {
    lessonId: 'l-7-3',
    estimatedRuntime: '8:00',
    equipment: 'Camera (talking head), whiteboard or digital whiteboard, markers',
    openingHook: `"In this lesson, we're diving into structuring and closing subject-to deals — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'whiteboard',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Structuring and Closing Subject-To Deals. This is part of Module 7: Subject-To Financing. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 7 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'whiteboard',
        duration: '6:00',
        script: `Legal documents required, due-on-sale clause risks and mitigation, insurance considerations, closing process, and ongoing management.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'whiteboard',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on structuring and closing subject-to deals. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-8-2': {
    lessonId: 'l-8-2',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into setting up your str property — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Setting Up Your STR Property. This is part of Module 8: Short-Term Rentals (Airbnb/VRBO). Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 8 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `Furnishing and design for maximum bookings, professional photography, writing compelling listings, dynamic pricing strategies, and guest amenities that drive 5-star reviews.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on setting up your str property. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-8-3': {
    lessonId: 'l-8-3',
    estimatedRuntime: '6:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into managing and scaling your str business — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Managing and Scaling Your STR Business. This is part of Module 8: Short-Term Rentals (Airbnb/VRBO). Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 8 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '4:00',
        script: `Automation tools (Hospitable, Guesty), cleaning team management, guest communication, review management, scaling to multiple properties, and co-hosting.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on managing and scaling your str business. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-10-4': {
    lessonId: 'l-10-4',
    estimatedRuntime: '7:00',
    equipment: 'Screen recording software, microphone, Freedom One platform access',
    openingHook: `"In this lesson, we're diving into room-by-room condition assessment — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'screen-recording',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Room-by-Room Condition Assessment. This is part of Module 10: Freedom One Platform Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 10 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'screen-recording',
        duration: '5:00',
        script: `Using the rehab estimator to assess each room's condition, selecting material tiers, and generating accurate rehab cost estimates.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'screen-recording',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on room-by-room condition assessment. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-10-5': {
    lessonId: 'l-10-5',
    estimatedRuntime: '6:00',
    equipment: 'Screen recording software, microphone, Freedom One platform access',
    openingHook: `"In this lesson, we're diving into material tiers and regional pricing — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'screen-recording',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Material Tiers and Regional Pricing. This is part of Module 10: Freedom One Platform Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 10 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'screen-recording',
        duration: '4:00',
        script: `Understanding Rental, Standard, and Luxury material tiers. How regional pricing adjusts costs based on your metro market location.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'screen-recording',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on material tiers and regional pricing. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-10-6': {
    lessonId: 'l-10-6',
    estimatedRuntime: '6:00',
    equipment: 'Screen recording software, microphone, Freedom One platform access',
    openingHook: `"In this lesson, we're diving into pipeline kanban board — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'screen-recording',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Pipeline Kanban Board. This is part of Module 10: Freedom One Platform Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 10 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'screen-recording',
        duration: '4:00',
        script: `Tracking deals through stages using the Kanban board: Lead, Analyzing, Offer Made, Under Contract, Rehab, Listed, Sold. Managing your deal pipeline.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'screen-recording',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on pipeline kanban board. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-10-7': {
    lessonId: 'l-10-7',
    estimatedRuntime: '6:00',
    equipment: 'Screen recording software, microphone, Freedom One platform access',
    openingHook: `"In this lesson, we're diving into portfolio dashboard and pdf reports — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'screen-recording',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Portfolio Dashboard and PDF Reports. This is part of Module 10: Freedom One Platform Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 10 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'screen-recording',
        duration: '4:00',
        script: `Viewing portfolio analytics, generating professional PDF reports for lenders and partners, and tracking your overall investment performance.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'screen-recording',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on portfolio dashboard and pdf reports. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-10-8': {
    lessonId: 'l-10-8',
    estimatedRuntime: '6:00',
    equipment: 'Screen recording software, microphone, Freedom One platform access',
    openingHook: `"In this lesson, we're diving into uploading photos and property details — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'screen-recording',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Uploading Photos and Property Details. This is part of Module 10: Freedom One Platform Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 10 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'screen-recording',
        duration: '4:00',
        script: `Adding property photos, managing before/after galleries, entering detailed property features, and organizing your deal documentation.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'screen-recording',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on uploading photos and property details. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-10-9': {
    lessonId: 'l-10-9',
    estimatedRuntime: '5:00',
    equipment: 'Screen recording software, microphone, Freedom One platform access',
    openingHook: `"In this lesson, we're diving into sharing deals and exporting reports — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'screen-recording',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Sharing Deals and Exporting Reports. This is part of Module 10: Freedom One Platform Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 10 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'screen-recording',
        duration: '3:00',
        script: `Creating shareable deal links, exporting PDF reports, sharing with partners and lenders, and managing deal visibility settings.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'screen-recording',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on sharing deals and exporting reports. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-10-10': {
    lessonId: 'l-10-10',
    estimatedRuntime: '7:00',
    equipment: 'Screen recording software, microphone, Freedom One platform access',
    openingHook: `"In this lesson, we're diving into marketing and contract templates — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'screen-recording',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Marketing and Contract Templates. This is part of Module 10: Freedom One Platform Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 10 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'screen-recording',
        duration: '5:00',
        script: `Using the built-in marketing templates (direct mail, postcards, emails, cold call scripts) and contract templates (purchase agreements, wholesale contracts).`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'screen-recording',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on marketing and contract templates. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-10-11': {
    lessonId: 'l-10-11',
    estimatedRuntime: '5:00',
    equipment: 'Screen recording software, microphone, Freedom One platform access',
    openingHook: `"In this lesson, we're diving into using the lender directory — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'screen-recording',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Using the Lender Directory. This is part of Module 10: Freedom One Platform Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 10 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'screen-recording',
        duration: '3:00',
        script: `Browsing the curated lender directory, comparing rates and terms, filtering by loan type and location, and contacting lenders directly.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'screen-recording',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on using the lender directory. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-10-12': {
    lessonId: 'l-10-12',
    estimatedRuntime: '7:00',
    equipment: 'Screen recording software, microphone, Freedom One platform access',
    openingHook: `"In this lesson, we're diving into state guide and additional tools — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'screen-recording',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering State Guide and Additional Tools. This is part of Module 10: Freedom One Platform Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 10 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'screen-recording',
        duration: '5:00',
        script: `Using the state-by-state guide, contractor directory, Material Cost Tracker, property listings, and other platform tools.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'screen-recording',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on state guide and additional tools. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-11-3': {
    lessonId: 'l-11-3',
    estimatedRuntime: '6:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into choosing the right entity for your strategy — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Choosing the Right Entity for Your Strategy. This is part of Module 11: Asset Protection & Tax Strategy. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 11 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '4:00',
        script: `Decision framework for entity selection based on your investment strategy, number of properties, income level, and long-term goals.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on choosing the right entity for your strategy. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-11-4': {
    lessonId: 'l-11-4',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into land trusts for privacy and protection — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Land Trusts for Privacy and Protection. This is part of Module 11: Asset Protection & Tax Strategy. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 11 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `How land trusts work, privacy benefits, asset protection advantages, setting up a land trust, and combining trusts with LLCs.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on land trusts for privacy and protection. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-11-5': {
    lessonId: 'l-11-5',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into living trusts and estate planning — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Living Trusts and Estate Planning. This is part of Module 11: Asset Protection & Tax Strategy. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 11 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `Revocable vs irrevocable trusts, estate planning for real estate investors, avoiding probate, and protecting your legacy.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on living trusts and estate planning. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-11-6': {
    lessonId: 'l-11-6',
    estimatedRuntime: '8:00',
    equipment: 'Camera (talking head), whiteboard or digital whiteboard, markers',
    openingHook: `"In this lesson, we're diving into investing with your ira — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'whiteboard',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Investing with Your IRA. This is part of Module 11: Asset Protection & Tax Strategy. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 11 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'whiteboard',
        duration: '6:00',
        script: `Self-Directed IRA rules, prohibited transactions, UBIT considerations, custodian selection, and step-by-step process for buying real estate with your IRA.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'whiteboard',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on investing with your ira. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-11-7': {
    lessonId: 'l-11-7',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into solo 401(k) and checkbook control — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Solo 401(k) and Checkbook Control. This is part of Module 11: Asset Protection & Tax Strategy. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 11 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `Solo 401(k) advantages over SDIRA, checkbook control, contribution limits, Roth conversions, and advanced retirement investing strategies.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on solo 401(k) and checkbook control. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-12-1': {
    lessonId: 'l-12-1',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), whiteboard or digital whiteboard, markers',
    openingHook: `"In this lesson, we're diving into structuring seller finance deals — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'whiteboard',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Structuring Seller Finance Deals. This is part of Module 12: Creative Financing Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 12 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'whiteboard',
        duration: '5:00',
        script: `Seller financing terms, interest rates, balloon payments, amortization schedules, promissory notes, and deed of trust/mortgage documents.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'whiteboard',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on structuring seller finance deals. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-12-2': {
    lessonId: 'l-12-2',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into negotiating with sellers — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Negotiating with Sellers. This is part of Module 12: Creative Financing Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 12 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `Scripts for seller financing conversations, handling objections, presenting win-win structures, and closing seller finance deals.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on negotiating with sellers. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-12-3': {
    lessonId: 'l-12-3',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), whiteboard or digital whiteboard, markers',
    openingHook: `"In this lesson, we're diving into lease options explained — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'whiteboard',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Lease Options Explained. This is part of Module 12: Creative Financing Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 12 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'whiteboard',
        duration: '5:00',
        script: `How lease-options work, option consideration, monthly credits, exercise price, sandwich lease options, and legal considerations.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'whiteboard',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on lease options explained. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-12-4': {
    lessonId: 'l-12-4',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into private money and syndication — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Private Money and Syndication. This is part of Module 12: Creative Financing Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 12 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `Raising private capital, SEC regulations, syndication structures, investor presentations, preferred returns, and building a track record.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on private money and syndication. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },

  'l-12-5': {
    lessonId: 'l-12-5',
    estimatedRuntime: '7:00',
    equipment: 'Camera (talking head), teleprompter, professional backdrop',
    openingHook: `"In this lesson, we're diving into stacking strategies for maximum returns — and by the end, you'll have the practical knowledge to apply this immediately to your investing business."`,
    segments: [
      {
        title: 'Introduction',
        type: 'talking-head',
        duration: '1:30',
        script: `Welcome back to the Freedom One course. In this micro-lesson, we're covering Stacking Strategies for Maximum Returns. This is part of Module 12: Creative Financing Mastery. Let's get right into it.`,
        directions: 'Presenter on camera, energetic and focused. Module 12 branding on screen.',
      },
      {
        title: 'Core Content',
        type: 'talking-head',
        duration: '5:00',
        script: `Multi-layer deal structures, combining financing methods, case studies of creative deals, course wrap-up, and your action plan going forward.`,
        directions: 'Main teaching segment. Use on-screen graphics, bullet points, and examples to illustrate key concepts.',
      },
      {
        title: 'Action Steps & Wrap-Up',
        type: 'talking-head',
        duration: '1:30',
        script: `Let's recap what we covered in this lesson on stacking strategies for maximum returns. Take a moment to review the key concepts, then apply what you learned to a real or practice scenario. When you've completed all lessons in this module, take the quiz to test your knowledge. See you in the next lesson.`,
        directions: 'Presenter on camera for closing. Show action step checklist on screen.',
      },
    ],
    closingCTA: 'Review the key concepts, apply them to your next deal, and continue to the next lesson.',
    bRollSuggestions: [
      'Relevant property footage or renovation clips',
      'Freedom One platform screenshots',
      'On-screen text highlighting key terms',
      'Professional real estate investing imagery',
    ],
  },
};
