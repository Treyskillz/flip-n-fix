// ============================================================
// Freedom One Real Estate Investor Course — 12 Modules, 65 Micro-Lessons
// Optimized for Colossyan AI video generation (5-8 min per lesson)
// ============================================================

export type CourseTier = 'free' | 'pro' | 'elite';

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: CourseLesson[];
  icon: string;
  premium?: boolean;
  /** Minimum subscription tier required to access this module */
  requiredTier: CourseTier;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  /** URL to the video for this lesson (Colossyan-generated) */
  videoUrl?: string;
  /** Colossyan script ID for reference */
  videoId?: string;
  content: string;
}

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 'mod-1',
    number: 1,
    title: 'Investor Mindset & Success Psychology',
    description: 'Develop the mental framework, habits, and negotiation psychology that separate successful investors from everyone else.',
    icon: '🧠',
    requiredTier: 'free',
    lessons: [
      {
        id: 'l-1-1',
        title: 'The Investor Mindset — Why 90% Fail',
        duration: '6 min',
        videoId: 'M1-V01',
        // videoUrl: 'https://your-video-host.com/M1-V01.mp4', // TODO: Add after Colossyan generation
        content: `## The Investor Mindset — Why 90% Fail\n\n**Video ID:** M1-V01 | **Duration:** 6 min\n\n### What You Will Learn\n\nFive mental traps (analysis paralysis, shiny object syndrome, fear of loss, imposter syndrome, lone wolf mentality), abundance vs. scarcity framework, 3-tier goal system, daily discipline framework, bounce-back protocol for handling setbacks.\n\n### Key Takeaways\n\n1. **Five mental traps (analysis paralysis**\n2. **shiny object syndrome**\n3. **fear of loss**\n4. **imposter syndrome**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-1-2',
        title: 'Building Investor Resilience',
        duration: '6 min',
        videoId: 'M1-V02',
        // videoUrl: 'https://your-video-host.com/M1-V02.mp4', // TODO: Add after Colossyan generation
        content: `## Building Investor Resilience\n\n**Video ID:** M1-V02 | **Duration:** 6 min\n\n### What You Will Learn\n\nFive habits of six-figure investors: numbers-first decision making, 100-deal pipeline, continuous education with 1:2 learning-to-action ratio, personal advisory board (5 seats), tracking key metrics. The compound effect in real estate.\n\n### Key Takeaways\n\n1. **Five habits of six-figure investors: numbers-first decision making**\n2. **100-deal pipeline**\n3. **continuous education with 1:2 learning-to-action ratio**\n4. **personal advisory board (5 seats)**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-1-3',
        title: 'The Psychology of Negotiation',
        duration: '7 min',
        videoId: 'M1-V03',
        // videoUrl: 'https://your-video-host.com/M1-V03.mp4', // TODO: Add after Colossyan generation
        content: `## The Psychology of Negotiation\n\n**Video ID:** M1-V03 | **Duration:** 7 min\n\n### What You Will Learn\n\nUnderstanding motivated sellers, the power of silence, anchoring technique, terms vs. price framework, 4-step objection handler, walk-away power. Full negotiation scenario walkthrough.\n\n### Key Takeaways\n\n1. **Understanding motivated sellers**\n2. **the power of silence**\n3. **anchoring technique**\n4. **terms vs. price framework**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
    ],
  },
  {
    id: 'mod-2',
    number: 2,
    title: 'Foundation: Building Your Business',
    description: 'Set up your real estate investment business with the right entity structure, team, and systems.',
    icon: '🏗️',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-2-1',
        title: 'The 2026 Real Estate Opportunity',
        duration: '5 min',
        videoId: 'M2-V01',
        // videoUrl: 'https://your-video-host.com/M2-V01.mp4', // TODO: Add after Colossyan generation
        content: `## The 2026 Real Estate Opportunity\n\n**Video ID:** M2-V01 | **Duration:** 5 min\n\n### What You Will Learn\n\nCurrent market conditions, interest rate environment, housing supply shortage, aging housing stock. Why 2026 is a prime time for real estate investing.\n\n### Key Takeaways\n\n1. **Current market conditions**\n2. **interest rate environment**\n3. **housing supply shortage**\n4. **aging housing stock. Why 2026 is a prime time for real estate investing**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-2-2',
        title: 'Five Exit Strategies Overview',
        duration: '5 min',
        videoId: 'M2-V02',
        // videoUrl: 'https://your-video-host.com/M2-V02.mp4', // TODO: Add after Colossyan generation
        content: `## Five Exit Strategies Overview\n\n**Video ID:** M2-V02 | **Duration:** 5 min\n\n### What You Will Learn\n\nQuick introduction to fix & flip, wholesaling, BRRRR, subject-to, and short-term rentals. How each strategy works and when to use it.\n\n### Key Takeaways\n\n1. **Quick introduction to fix & flip**\n2. **wholesaling**\n3. **BRRRR**\n4. **subject-to**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-2-3',
        title: 'Your First Deal Roadmap',
        duration: '5 min',
        videoId: 'M2-V03',
        // videoUrl: 'https://your-video-host.com/M2-V03.mp4', // TODO: Add after Colossyan generation
        content: `## Your First Deal Roadmap\n\n**Video ID:** M2-V03 | **Duration:** 5 min\n\n### What You Will Learn\n\nStep-by-step getting started guide. From analyzing your first deal to closing. Timeline expectations and common first-deal mistakes to avoid.\n\n### Key Takeaways\n\n1. **Step-by-step getting started guide. From analyzing your first deal to closing. Timeline expectations and common first-deal mistakes to avoid**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-2-4',
        title: 'Why You Need an LLC',
        duration: '5 min',
        videoId: 'M2-V04',
        // videoUrl: 'https://your-video-host.com/M2-V04.mp4', // TODO: Add after Colossyan generation
        content: `## Why You Need an LLC\n\n**Video ID:** M2-V04 | **Duration:** 5 min\n\n### What You Will Learn\n\nLegal protection basics, personal asset protection, pass-through taxation, and why every investor needs an entity before their first deal.\n\n### Key Takeaways\n\n1. **Legal protection basics**\n2. **personal asset protection**\n3. **pass-through taxation**\n4. **and why every investor needs an entity before their first deal**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-2-5',
        title: 'Choosing Your Entity Structure',
        duration: '7 min',
        videoId: 'M2-V05',
        // videoUrl: 'https://your-video-host.com/M2-V05.mp4', // TODO: Add after Colossyan generation
        content: `## Choosing Your Entity Structure\n\n**Video ID:** M2-V05 | **Duration:** 7 min\n\n### What You Will Learn\n\nLLC vs S-Corp vs sole proprietor comparison. Series LLCs, the 2-entity strategy. Which structure fits your investment strategy.\n\n### Key Takeaways\n\n1. **LLC vs S-Corp vs sole proprietor comparison. Series LLCs**\n2. **the 2-entity strategy. Which structure fits your investment strategy**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-2-6',
        title: 'Setting Up Your Business',
        duration: '8 min',
        videoId: 'M2-V06',
        // videoUrl: 'https://your-video-host.com/M2-V06.mp4', // TODO: Add after Colossyan generation
        content: `## Setting Up Your Business\n\n**Video ID:** M2-V06 | **Duration:** 8 min\n\n### What You Will Learn\n\nGetting your EIN, opening business bank accounts, setting up bookkeeping, business insurance, CRM setup, and creating your brand.\n\n### Key Takeaways\n\n1. **Getting your EIN**\n2. **opening business bank accounts**\n3. **setting up bookkeeping**\n4. **business insurance**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-2-7',
        title: 'The 8 People You Need on Your Team',
        duration: '7 min',
        videoId: 'M2-V07',
        // videoUrl: 'https://your-video-host.com/M2-V07.mp4', // TODO: Add after Colossyan generation
        content: `## The 8 People You Need on Your Team\n\n**Video ID:** M2-V07 | **Duration:** 7 min\n\n### What You Will Learn\n\nReal estate attorney, CPA, general contractor, investor-friendly agent, title company, hard money lender, property inspector, insurance agent. What each does and why you need them.\n\n### Key Takeaways\n\n1. **Real estate attorney**\n2. **CPA**\n3. **general contractor**\n4. **investor-friendly agent**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-2-8',
        title: 'Finding and Vetting Your Team',
        duration: '6 min',
        videoId: 'M2-V08',
        // videoUrl: 'https://your-video-host.com/M2-V08.mp4', // TODO: Add after Colossyan generation
        content: `## Finding and Vetting Your Team\n\n**Video ID:** M2-V08 | **Duration:** 6 min\n\n### What You Will Learn\n\nWhere to find team members (REIA, BiggerPockets, Facebook groups, courthouse steps). Interview questions, red flags, and building your B-team backup.\n\n### Key Takeaways\n\n1. **Where to find team members (REIA**\n2. **BiggerPockets**\n3. **Facebook groups**\n4. **courthouse steps). Interview questions**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
    ],
  },
  {
    id: 'mod-3',
    number: 3,
    title: 'Finding Deals: Acquisition Strategies',
    description: 'Master the art of finding profitable properties before anyone else using multiple lead sources.',
    icon: '🔍',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-3-1',
        title: 'MLS and Auction Lead Sources',
        duration: '6 min',
        videoId: 'M3-V01',
        // videoUrl: 'https://your-video-host.com/M3-V01.mp4', // TODO: Add after Colossyan generation
        content: `## MLS and Auction Lead Sources\n\n**Video ID:** M3-V01 | **Duration:** 6 min\n\n### What You Will Learn\n\nTraditional lead sources: MLS listings, foreclosure auctions, HUD homes, bank REOs. How to filter for investment properties and spot hidden deals.\n\n### Key Takeaways\n\n1. **Traditional lead sources: MLS listings**\n2. **foreclosure auctions**\n3. **HUD homes**\n4. **bank REOs. How to filter for investment properties and spot hidden deals**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-3-2',
        title: 'Direct Mail and Driving for Dollars',
        duration: '6 min',
        videoId: 'M3-V02',
        // videoUrl: 'https://your-video-host.com/M3-V02.mp4', // TODO: Add after Colossyan generation
        content: `## Direct Mail and Driving for Dollars\n\n**Video ID:** M3-V02 | **Duration:** 6 min\n\n### What You Will Learn\n\nOutbound marketing strategies: direct mail campaigns, target lists, driving for dollars methodology, tracking response rates, cost per lead analysis.\n\n### Key Takeaways\n\n1. **Outbound marketing strategies: direct mail campaigns**\n2. **target lists**\n3. **driving for dollars methodology**\n4. **tracking response rates**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-3-3',
        title: 'Wholesalers and Networking',
        duration: '6 min',
        videoId: 'M3-V03',
        // videoUrl: 'https://your-video-host.com/M3-V03.mp4', // TODO: Add after Colossyan generation
        content: `## Wholesalers and Networking\n\n**Video ID:** M3-V03 | **Duration:** 6 min\n\n### What You Will Learn\n\nRelationship-based lead sources: working with wholesalers, building your network, REIA meetings, bird dogs, and referral systems.\n\n### Key Takeaways\n\n1. **Relationship-based lead sources: working with wholesalers**\n2. **building your network**\n3. **REIA meetings**\n4. **bird dogs**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-3-4',
        title: 'Online Lead Generation',
        duration: '6 min',
        videoId: 'M3-V04',
        // videoUrl: 'https://your-video-host.com/M3-V04.mp4', // TODO: Add after Colossyan generation
        content: `## Online Lead Generation\n\n**Video ID:** M3-V04 | **Duration:** 6 min\n\n### What You Will Learn\n\nDigital marketing for deal flow: SEO, social media marketing, Facebook ads for motivated sellers, Craigslist, and online lead platforms.\n\n### Key Takeaways\n\n1. **Digital marketing for deal flow: SEO**\n2. **social media marketing**\n3. **Facebook ads for motivated sellers**\n4. **Craigslist**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-3-5',
        title: 'ARV and the 70% Rule',
        duration: '7 min',
        videoId: 'M3-V05',
        // videoUrl: 'https://your-video-host.com/M3-V05.mp4', // TODO: Add after Colossyan generation
        content: `## ARV and the 70% Rule\n\n**Video ID:** M3-V05 | **Duration:** 7 min\n\n### What You Will Learn\n\nCore formulas every investor must know: After Repair Value calculation, the 70% rule, Maximum Allowable Offer formula, and when to adjust the percentages.\n\n### Key Takeaways\n\n1. **Core formulas every investor must know: After Repair Value calculation**\n2. **the 70% rule**\n3. **Maximum Allowable Offer formula**\n4. **and when to adjust the percentages**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-3-6',
        title: 'Running Your Comps',
        duration: '7 min',
        videoId: 'M3-V06',
        // videoUrl: 'https://your-video-host.com/M3-V06.mp4', // TODO: Add after Colossyan generation
        content: `## Running Your Comps\n\n**Video ID:** M3-V06 | **Duration:** 7 min\n\n### What You Will Learn\n\nHow to pull and analyze comparable sales: selecting comps, adjusting for differences, using MLS data, Zillow, Redfin, and county records. Common comp mistakes.\n\n### Key Takeaways\n\n1. **How to pull and analyze comparable sales: selecting comps**\n2. **adjusting for differences**\n3. **using MLS data**\n4. **Zillow**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-3-7',
        title: 'Making Your Offer',
        duration: '6 min',
        videoId: 'M3-V07',
        // videoUrl: 'https://your-video-host.com/M3-V07.mp4', // TODO: Add after Colossyan generation
        content: `## Making Your Offer\n\n**Video ID:** M3-V07 | **Duration:** 6 min\n\n### What You Will Learn\n\nMAO calculation in practice, crafting your offer letter, negotiation basics, contingencies to include, and how to present your offer to sellers.\n\n### Key Takeaways\n\n1. **MAO calculation in practice**\n2. **crafting your offer letter**\n3. **negotiation basics**\n4. **contingencies to include**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
    ],
  },
  {
    id: 'mod-4',
    number: 4,
    title: 'Fix & Flip Mastery',
    description: 'Learn to manage rehabs, control budgets, and sell flips for maximum profit.',
    icon: '🔨',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-4-1',
        title: 'Creating Your Scope of Work',
        duration: '7 min',
        videoId: 'M4-V01',
        // videoUrl: 'https://your-video-host.com/M4-V01.mp4', // TODO: Add after Colossyan generation
        content: `## Creating Your Scope of Work\n\n**Video ID:** M4-V01 | **Duration:** 7 min\n\n### What You Will Learn\n\nRoom-by-room condition assessment, creating detailed SOW documents, material tier selection (rental, standard, luxury), using the Freedom One SOW templates.\n\n### Key Takeaways\n\n1. **Room-by-room condition assessment**\n2. **creating detailed SOW documents**\n3. **material tier selection (rental**\n4. **standard**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-4-2',
        title: 'Hiring and Managing Contractors',
        duration: '7 min',
        videoId: 'M4-V02',
        // videoUrl: 'https://your-video-host.com/M4-V02.mp4', // TODO: Add after Colossyan generation
        content: `## Hiring and Managing Contractors\n\n**Video ID:** M4-V02 | **Duration:** 7 min\n\n### What You Will Learn\n\nGetting competitive bids, contractor contracts, draw schedules, daily oversight, managing subcontractors, and handling contractor disputes.\n\n### Key Takeaways\n\n1. **Getting competitive bids**\n2. **contractor contracts**\n3. **draw schedules**\n4. **daily oversight**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-4-3',
        title: 'Budget Control and Timeline Management',
        duration: '6 min',
        videoId: 'M4-V03',
        // videoUrl: 'https://your-video-host.com/M4-V03.mp4', // TODO: Add after Colossyan generation
        content: `## Budget Control and Timeline Management\n\n**Video ID:** M4-V03 | **Duration:** 6 min\n\n### What You Will Learn\n\nTracking rehab costs in real-time, contingency budgets, timeline milestones, handling change orders, and preventing scope creep.\n\n### Key Takeaways\n\n1. **Tracking rehab costs in real-time**\n2. **contingency budgets**\n3. **timeline milestones**\n4. **handling change orders**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-4-4',
        title: 'Pricing and Listing Strategy',
        duration: '7 min',
        videoId: 'M4-V04',
        // videoUrl: 'https://your-video-host.com/M4-V04.mp4', // TODO: Add after Colossyan generation
        content: `## Pricing and Listing Strategy\n\n**Video ID:** M4-V04 | **Duration:** 7 min\n\n### What You Will Learn\n\nHow to price your flip for maximum profit, staging strategies, professional photography, listing descriptions, and choosing the right listing agent.\n\n### Key Takeaways\n\n1. **How to price your flip for maximum profit**\n2. **staging strategies**\n3. **professional photography**\n4. **listing descriptions**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-4-5',
        title: 'Closing the Sale',
        duration: '6 min',
        videoId: 'M4-V05',
        // videoUrl: 'https://your-video-host.com/M4-V05.mp4', // TODO: Add after Colossyan generation
        content: `## Closing the Sale\n\n**Video ID:** M4-V05 | **Duration:** 6 min\n\n### What You Will Learn\n\nHandling offers, negotiation strategies with buyers, multiple offer situations, closing process, and calculating your final profit.\n\n### Key Takeaways\n\n1. **Handling offers**\n2. **negotiation strategies with buyers**\n3. **multiple offer situations**\n4. **closing process**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-4-6',
        title: 'The Post-Inspection Playbook',
        duration: '7 min',
        videoId: 'M4-V06',
        // videoUrl: 'https://your-video-host.com/M4-V06.mp4', // TODO: Add after Colossyan generation
        content: `## The Post-Inspection Playbook\n\n**Video ID:** M4-V06 | **Duration:** 7 min\n\n### What You Will Learn\n\nCommon inspection findings, how to prepare for inspections, pre-listing inspections, and understanding what buyers will flag.\n\n### Key Takeaways\n\n1. **Common inspection findings**\n2. **how to prepare for inspections**\n3. **pre-listing inspections**\n4. **and understanding what buyers will flag**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-4-7',
        title: 'Negotiating Repair Credits',
        duration: '7 min',
        videoId: 'M4-V07',
        // videoUrl: 'https://your-video-host.com/M4-V07.mp4', // TODO: Add after Colossyan generation
        content: `## Negotiating Repair Credits\n\n**Video ID:** M4-V07 | **Duration:** 7 min\n\n### What You Will Learn\n\nCounter-offer strategies after inspection, repair credit vs. price reduction, which repairs to concede, and protecting your bottom line.\n\n### Key Takeaways\n\n1. **Counter-offer strategies after inspection**\n2. **repair credit vs. price reduction**\n3. **which repairs to concede**\n4. **and protecting your bottom line**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-4-8',
        title: 'Protecting Your Profit Margin',
        duration: '6 min',
        videoId: 'M4-V08',
        // videoUrl: 'https://your-video-host.com/M4-V08.mp4', // TODO: Add after Colossyan generation
        content: `## Protecting Your Profit Margin\n\n**Video ID:** M4-V08 | **Duration:** 6 min\n\n### What You Will Learn\n\nWhen to concede vs. walk away, deal-killing inspection items, renegotiation tactics, and ensuring profitability through the closing table.\n\n### Key Takeaways\n\n1. **When to concede vs. walk away**\n2. **deal-killing inspection items**\n3. **renegotiation tactics**\n4. **and ensuring profitability through the closing table**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
    ],
  },
  {
    id: 'mod-5',
    number: 5,
    title: 'Wholesaling Fundamentals',
    description: 'Learn to wholesale properties for quick profits without ever swinging a hammer.',
    icon: '🤝',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-5-1',
        title: 'How Wholesaling Works',
        duration: '7 min',
        videoId: 'M5-V01',
        // videoUrl: 'https://your-video-host.com/M5-V01.mp4', // TODO: Add after Colossyan generation
        content: `## How Wholesaling Works\n\n**Video ID:** M5-V01 | **Duration:** 7 min\n\n### What You Will Learn\n\nThe assignment process explained, legal requirements, how to get properties under contract, assignment fees, and the difference between assignment and double close.\n\n### Key Takeaways\n\n1. **The assignment process explained**\n2. **legal requirements**\n3. **how to get properties under contract**\n4. **assignment fees**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-5-2',
        title: 'Finding Buyers and Building Your List',
        duration: '7 min',
        videoId: 'M5-V02',
        // videoUrl: 'https://your-video-host.com/M5-V02.mp4', // TODO: Add after Colossyan generation
        content: `## Finding Buyers and Building Your List\n\n**Video ID:** M5-V02 | **Duration:** 7 min\n\n### What You Will Learn\n\nCash buyer strategies: building your buyers list, qualifying buyers, marketing your deals, and creating a reliable disposition system.\n\n### Key Takeaways\n\n1. **Cash buyer strategies: building your buyers list**\n2. **qualifying buyers**\n3. **marketing your deals**\n4. **and creating a reliable disposition system**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-5-3',
        title: 'Contracts and Closing Your First Wholesale Deal',
        duration: '6 min',
        videoId: 'M5-V03',
        // videoUrl: 'https://your-video-host.com/M5-V03.mp4', // TODO: Add after Colossyan generation
        content: `## Contracts and Closing Your First Wholesale Deal\n\n**Video ID:** M5-V03 | **Duration:** 6 min\n\n### What You Will Learn\n\nAssignment contracts, 'and/or assigns' language, double close mechanics, title company coordination, and step-by-step first deal walkthrough.\n\n### Key Takeaways\n\n1. **Assignment contracts**\n2. **'and/or assigns' language**\n3. **double close mechanics**\n4. **title company coordination**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
    ],
  },
  {
    id: 'mod-6',
    number: 6,
    title: 'The BRRRR Strategy',
    description: 'Buy, Rehab, Rent, Refinance, Repeat — build long-term wealth through rental properties.',
    icon: '🔄',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-6-1',
        title: 'Buy, Rehab, Rent — The First Three Steps',
        duration: '7 min',
        videoId: 'M6-V01',
        // videoUrl: 'https://your-video-host.com/M6-V01.mp4', // TODO: Add after Colossyan generation
        content: `## Buy, Rehab, Rent — The First Three Steps\n\n**Video ID:** M6-V01 | **Duration:** 7 min\n\n### What You Will Learn\n\nFinding BRRRR-eligible properties, rehab for rentals vs. flips, tenant screening, setting rental rates, and property management basics.\n\n### Key Takeaways\n\n1. **Finding BRRRR-eligible properties**\n2. **rehab for rentals vs. flips**\n3. **tenant screening**\n4. **setting rental rates**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-6-2',
        title: 'Refinance — Pulling Your Cash Out',
        duration: '6 min',
        videoId: 'M6-V02',
        // videoUrl: 'https://your-video-host.com/M6-V02.mp4', // TODO: Add after Colossyan generation
        content: `## Refinance — Pulling Your Cash Out\n\n**Video ID:** M6-V02 | **Duration:** 6 min\n\n### What You Will Learn\n\nCash-out refinance process, seasoning requirements, LTV ratios, DSCR loans, working with lenders, and maximizing your cash-out amount.\n\n### Key Takeaways\n\n1. **Cash-out refinance process**\n2. **seasoning requirements**\n3. **LTV ratios**\n4. **DSCR loans**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-6-3',
        title: 'Repeat — Scaling Your Portfolio',
        duration: '6 min',
        videoId: 'M6-V03',
        // videoUrl: 'https://your-video-host.com/M6-V03.mp4', // TODO: Add after Colossyan generation
        content: `## Repeat — Scaling Your Portfolio\n\n**Video ID:** M6-V03 | **Duration:** 6 min\n\n### What You Will Learn\n\nReinvesting proceeds, portfolio growth strategies, when to BRRRR vs. flip, building passive income, and the path to financial freedom through rentals.\n\n### Key Takeaways\n\n1. **Reinvesting proceeds**\n2. **portfolio growth strategies**\n3. **when to BRRRR vs. flip**\n4. **building passive income**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
    ],
  },
  {
    id: 'mod-7',
    number: 7,
    title: 'Subject-To Financing',
    description: 'Acquire properties by taking over existing mortgages — one of the most powerful creative strategies.',
    icon: '📋',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-7-1',
        title: 'What Is Subject-To and Why It Works',
        duration: '7 min',
        videoId: 'M7-V01',
        // videoUrl: 'https://your-video-host.com/M7-V01.mp4', // TODO: Add after Colossyan generation
        content: `## What Is Subject-To and Why It Works\n\n**Video ID:** M7-V01 | **Duration:** 7 min\n\n### What You Will Learn\n\nCore concept of subject-to financing, benefits for buyers and sellers, legal framework, and why motivated sellers agree to this structure.\n\n### Key Takeaways\n\n1. **Core concept of subject-to financing**\n2. **benefits for buyers and sellers**\n3. **legal framework**\n4. **and why motivated sellers agree to this structure**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-7-2',
        title: 'Finding Subject-To Deals',
        duration: '7 min',
        videoId: 'M7-V02',
        // videoUrl: 'https://your-video-host.com/M7-V02.mp4', // TODO: Add after Colossyan generation
        content: `## Finding Subject-To Deals\n\n**Video ID:** M7-V02 | **Duration:** 7 min\n\n### What You Will Learn\n\nIdentifying motivated sellers, conversation scripts, pre-foreclosure targeting, marketing for subject-to deals, and qualifying opportunities.\n\n### Key Takeaways\n\n1. **Identifying motivated sellers**\n2. **conversation scripts**\n3. **pre-foreclosure targeting**\n4. **marketing for subject-to deals**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-7-3',
        title: 'Structuring and Closing Subject-To Deals',
        duration: '8 min',
        videoId: 'M7-V03',
        // videoUrl: 'https://your-video-host.com/M7-V03.mp4', // TODO: Add after Colossyan generation
        content: `## Structuring and Closing Subject-To Deals\n\n**Video ID:** M7-V03 | **Duration:** 8 min\n\n### What You Will Learn\n\nLegal documents required, due-on-sale clause risks and mitigation, insurance considerations, closing process, and ongoing management.\n\n### Key Takeaways\n\n1. **Legal documents required**\n2. **due-on-sale clause risks and mitigation**\n3. **insurance considerations**\n4. **closing process**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
    ],
  },
  {
    id: 'mod-8',
    number: 8,
    title: 'Short-Term Rentals (Airbnb/VRBO)',
    description: 'Turn properties into profitable short-term rentals for maximum cash flow.',
    icon: '🏖️',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-8-1',
        title: 'Is Airbnb Right for You? Market Analysis',
        duration: '7 min',
        videoId: 'M8-V01',
        // videoUrl: 'https://your-video-host.com/M8-V01.mp4', // TODO: Add after Colossyan generation
        content: `## Is Airbnb Right for You? Market Analysis\n\n**Video ID:** M8-V01 | **Duration:** 7 min\n\n### What You Will Learn\n\nRevenue potential analysis, local regulations and permits, market research tools (AirDNA, Mashvisor), identifying profitable STR markets, and zoning considerations.\n\n### Key Takeaways\n\n1. **Revenue potential analysis**\n2. **local regulations and permits**\n3. **market research tools (AirDNA**\n4. **Mashvisor)**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-8-2',
        title: 'Setting Up Your STR Property',
        duration: '7 min',
        videoId: 'M8-V02',
        // videoUrl: 'https://your-video-host.com/M8-V02.mp4', // TODO: Add after Colossyan generation
        content: `## Setting Up Your STR Property\n\n**Video ID:** M8-V02 | **Duration:** 7 min\n\n### What You Will Learn\n\nFurnishing and design for maximum bookings, professional photography, writing compelling listings, dynamic pricing strategies, and guest amenities that drive 5-star reviews.\n\n### Key Takeaways\n\n1. **Furnishing and design for maximum bookings**\n2. **professional photography**\n3. **writing compelling listings**\n4. **dynamic pricing strategies**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-8-3',
        title: 'Managing and Scaling Your STR Business',
        duration: '6 min',
        videoId: 'M8-V03',
        // videoUrl: 'https://your-video-host.com/M8-V03.mp4', // TODO: Add after Colossyan generation
        content: `## Managing and Scaling Your STR Business\n\n**Video ID:** M8-V03 | **Duration:** 6 min\n\n### What You Will Learn\n\nAutomation tools (Hospitable, Guesty), cleaning team management, guest communication, review management, scaling to multiple properties, and co-hosting.\n\n### Key Takeaways\n\n1. **Automation tools (Hospitable**\n2. **Guesty)**\n3. **cleaning team management**\n4. **guest communication**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
    ],
  },
  {
    id: 'mod-9',
    number: 9,
    title: 'Financing Your Deals',
    description: 'Understand every financing option available to fund your real estate investments.',
    icon: '💰',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-9-1',
        title: 'Hard Money and Private Money Lending',
        duration: '7 min',
        videoId: 'M9-V01',
        // videoUrl: 'https://your-video-host.com/M9-V01.mp4', // TODO: Add after Colossyan generation
        content: `## Hard Money and Private Money Lending\n\n**Video ID:** M9-V01 | **Duration:** 7 min\n\n### What You Will Learn\n\nHow hard money loans work, typical terms and rates, qualifying for hard money, private money lending, building relationships with private lenders, and structuring private money deals.\n\n### Key Takeaways\n\n1. **How hard money loans work**\n2. **typical terms and rates**\n3. **qualifying for hard money**\n4. **private money lending**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-9-2',
        title: 'Conventional Loans and DSCR Loans',
        duration: '6 min',
        videoId: 'M9-V02',
        // videoUrl: 'https://your-video-host.com/M9-V02.mp4', // TODO: Add after Colossyan generation
        content: `## Conventional Loans and DSCR Loans\n\n**Video ID:** M9-V02 | **Duration:** 6 min\n\n### What You Will Learn\n\nBank financing options for investors, conventional loan requirements, DSCR loan programs, portfolio lenders, and when to use each type of financing.\n\n### Key Takeaways\n\n1. **Bank financing options for investors**\n2. **conventional loan requirements**\n3. **DSCR loan programs**\n4. **portfolio lenders**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-9-3',
        title: 'Creative Financing and OPM',
        duration: '6 min',
        videoId: 'M9-V03',
        // videoUrl: 'https://your-video-host.com/M9-V03.mp4', // TODO: Add after Colossyan generation
        content: `## Creative Financing and OPM\n\n**Video ID:** M9-V03 | **Duration:** 6 min\n\n### What You Will Learn\n\nSeller financing basics, using Other People's Money (OPM), partnership structures, joint ventures, and combining multiple financing sources on a single deal.\n\n### Key Takeaways\n\n1. **Seller financing basics**\n2. **using Other People's Money (OPM)**\n3. **partnership structures**\n4. **joint ventures**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
    ],
  },
  {
    id: 'mod-10',
    number: 10,
    title: 'Freedom One Platform Mastery',
    description: 'Master every tool in the Freedom One platform — from deal analysis to marketing templates.',
    icon: '🖥️',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-10-1',
        title: 'Entering Your First Deal',
        duration: '7 min',
        videoId: 'M10-V01',
        // videoUrl: 'https://your-video-host.com/M10-V01.mp4', // TODO: Add after Colossyan generation
        content: `## Entering Your First Deal\n\n**Video ID:** M10-V01 | **Duration:** 7 min\n\n### What You Will Learn\n\nStep-by-step walkthrough of entering property information, purchase price, and basic deal parameters into the Freedom One Deal Analyzer.\n\n### Key Takeaways\n\n1. **Step-by-step walkthrough of entering property information**\n2. **purchase price**\n3. **and basic deal parameters into the Freedom One Deal Analyzer**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-10-2',
        title: 'Running Comps and Setting ARV',
        duration: '7 min',
        videoId: 'M10-V02',
        // videoUrl: 'https://your-video-host.com/M10-V02.mp4', // TODO: Add after Colossyan generation
        content: `## Running Comps and Setting ARV\n\n**Video ID:** M10-V02 | **Duration:** 7 min\n\n### What You Will Learn\n\nUsing the comp analysis tools within Freedom One, entering comparable sales, adjusting values, and setting your After Repair Value.\n\n### Key Takeaways\n\n1. **Using the comp analysis tools within Freedom One**\n2. **entering comparable sales**\n3. **adjusting values**\n4. **and setting your After Repair Value**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-10-3',
        title: 'Analyzing All 5 Exit Strategies',
        duration: '7 min',
        videoId: 'M10-V03',
        // videoUrl: 'https://your-video-host.com/M10-V03.mp4', // TODO: Add after Colossyan generation
        content: `## Analyzing All 5 Exit Strategies\n\n**Video ID:** M10-V03 | **Duration:** 7 min\n\n### What You Will Learn\n\nRunning flip, wholesale, BRRRR, subject-to, and STR analysis on a single deal. Comparing profitability across all five exit strategies.\n\n### Key Takeaways\n\n1. **Running flip**\n2. **wholesale**\n3. **BRRRR**\n4. **subject-to**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-10-4',
        title: 'Room-by-Room Condition Assessment',
        duration: '7 min',
        videoId: 'M10-V04',
        // videoUrl: 'https://your-video-host.com/M10-V04.mp4', // TODO: Add after Colossyan generation
        content: `## Room-by-Room Condition Assessment\n\n**Video ID:** M10-V04 | **Duration:** 7 min\n\n### What You Will Learn\n\nUsing the rehab estimator to assess each room's condition, selecting material tiers, and generating accurate rehab cost estimates.\n\n### Key Takeaways\n\n1. **Using the rehab estimator to assess each room's condition**\n2. **selecting material tiers**\n3. **and generating accurate rehab cost estimates**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-10-5',
        title: 'Material Tiers and Regional Pricing',
        duration: '6 min',
        videoId: 'M10-V05',
        // videoUrl: 'https://your-video-host.com/M10-V05.mp4', // TODO: Add after Colossyan generation
        content: `## Material Tiers and Regional Pricing\n\n**Video ID:** M10-V05 | **Duration:** 6 min\n\n### What You Will Learn\n\nUnderstanding Rental, Standard, and Luxury material tiers. How regional pricing adjusts costs based on your metro market location.\n\n### Key Takeaways\n\n1. **Understanding Rental**\n2. **Standard**\n3. **and Luxury material tiers. How regional pricing adjusts costs based on your metro market location**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-10-6',
        title: 'Pipeline Kanban Board',
        duration: '6 min',
        videoId: 'M10-V06',
        // videoUrl: 'https://your-video-host.com/M10-V06.mp4', // TODO: Add after Colossyan generation
        content: `## Pipeline Kanban Board\n\n**Video ID:** M10-V06 | **Duration:** 6 min\n\n### What You Will Learn\n\nTracking deals through stages using the Kanban board: Lead, Analyzing, Offer Made, Under Contract, Rehab, Listed, Sold. Managing your deal pipeline.\n\n### Key Takeaways\n\n1. **Tracking deals through stages using the Kanban board: Lead**\n2. **Analyzing**\n3. **Offer Made**\n4. **Under Contract**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-10-7',
        title: 'Portfolio Dashboard and PDF Reports',
        duration: '6 min',
        videoId: 'M10-V07',
        // videoUrl: 'https://your-video-host.com/M10-V07.mp4', // TODO: Add after Colossyan generation
        content: `## Portfolio Dashboard and PDF Reports\n\n**Video ID:** M10-V07 | **Duration:** 6 min\n\n### What You Will Learn\n\nViewing portfolio analytics, generating professional PDF reports for lenders and partners, and tracking your overall investment performance.\n\n### Key Takeaways\n\n1. **Viewing portfolio analytics**\n2. **generating professional PDF reports for lenders and partners**\n3. **and tracking your overall investment performance**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-10-8',
        title: 'Uploading Photos and Property Details',
        duration: '6 min',
        videoId: 'M10-V08',
        // videoUrl: 'https://your-video-host.com/M10-V08.mp4', // TODO: Add after Colossyan generation
        content: `## Uploading Photos and Property Details\n\n**Video ID:** M10-V08 | **Duration:** 6 min\n\n### What You Will Learn\n\nAdding property photos, managing before/after galleries, entering detailed property features, and organizing your deal documentation.\n\n### Key Takeaways\n\n1. **Adding property photos**\n2. **managing before/after galleries**\n3. **entering detailed property features**\n4. **and organizing your deal documentation**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-10-9',
        title: 'Sharing Deals and Exporting Reports',
        duration: '5 min',
        videoId: 'M10-V09',
        // videoUrl: 'https://your-video-host.com/M10-V09.mp4', // TODO: Add after Colossyan generation
        content: `## Sharing Deals and Exporting Reports\n\n**Video ID:** M10-V09 | **Duration:** 5 min\n\n### What You Will Learn\n\nCreating shareable deal links, exporting PDF reports, sharing with partners and lenders, and managing deal visibility settings.\n\n### Key Takeaways\n\n1. **Creating shareable deal links**\n2. **exporting PDF reports**\n3. **sharing with partners and lenders**\n4. **and managing deal visibility settings**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-10-10',
        title: 'Marketing and Contract Templates',
        duration: '7 min',
        videoId: 'M10-V10',
        // videoUrl: 'https://your-video-host.com/M10-V10.mp4', // TODO: Add after Colossyan generation
        content: `## Marketing and Contract Templates\n\n**Video ID:** M10-V10 | **Duration:** 7 min\n\n### What You Will Learn\n\nUsing the built-in marketing templates (direct mail, postcards, emails, cold call scripts) and contract templates (purchase agreements, wholesale contracts).\n\n### Key Takeaways\n\n1. **Using the built-in marketing templates (direct mail**\n2. **postcards**\n3. **emails**\n4. **cold call scripts) and contract templates (purchase agreements**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-10-11',
        title: 'Using the Lender Directory',
        duration: '5 min',
        videoId: 'M10-V11',
        // videoUrl: 'https://your-video-host.com/M10-V11.mp4', // TODO: Add after Colossyan generation
        content: `## Using the Lender Directory\n\n**Video ID:** M10-V11 | **Duration:** 5 min\n\n### What You Will Learn\n\nBrowsing the curated lender directory, comparing rates and terms, filtering by loan type and location, and contacting lenders directly.\n\n### Key Takeaways\n\n1. **Browsing the curated lender directory**\n2. **comparing rates and terms**\n3. **filtering by loan type and location**\n4. **and contacting lenders directly**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-10-12',
        title: 'State Guide and Additional Tools',
        duration: '7 min',
        videoId: 'M10-V12',
        // videoUrl: 'https://your-video-host.com/M10-V12.mp4', // TODO: Add after Colossyan generation
        content: `## State Guide and Additional Tools\n\n**Video ID:** M10-V12 | **Duration:** 7 min\n\n### What You Will Learn\n\nUsing the state-by-state guide, contractor directory, Material Cost Tracker, property listings, and other platform tools.\n\n### Key Takeaways\n\n1. **Using the state-by-state guide**\n2. **contractor directory**\n3. **Material Cost Tracker**\n4. **property listings**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
    ],
  },
  {
    id: 'mod-11',
    number: 11,
    title: 'Asset Protection & Tax Strategy',
    description: 'Protect your wealth with proper entity structures, trusts, and tax-advantaged retirement accounts.',
    icon: '🛡️',
    premium: true,
    requiredTier: 'elite',
    lessons: [
      {
        id: 'l-11-1',
        title: 'LLCs for Real Estate Investors',
        duration: '7 min',
        videoId: 'M11-V01',
        // videoUrl: 'https://your-video-host.com/M11-V01.mp4', // TODO: Add after Colossyan generation
        content: `## LLCs for Real Estate Investors\n\n**Video ID:** M11-V01 | **Duration:** 7 min\n\n### What You Will Learn\n\nSingle-member LLCs, multi-member LLCs, series LLCs, state-specific considerations, and how to structure LLCs for maximum asset protection.\n\n### Key Takeaways\n\n1. **Single-member LLCs**\n2. **multi-member LLCs**\n3. **series LLCs**\n4. **state-specific considerations**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-11-2',
        title: 'Corporations and Holding Companies',
        duration: '7 min',
        videoId: 'M11-V02',
        // videoUrl: 'https://your-video-host.com/M11-V02.mp4', // TODO: Add after Colossyan generation
        content: `## Corporations and Holding Companies\n\n**Video ID:** M11-V02 | **Duration:** 7 min\n\n### What You Will Learn\n\nS-Corp vs C-Corp for real estate, holding company structures, parent-subsidiary relationships, and when corporations make sense for investors.\n\n### Key Takeaways\n\n1. **S-Corp vs C-Corp for real estate**\n2. **holding company structures**\n3. **parent-subsidiary relationships**\n4. **and when corporations make sense for investors**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-11-3',
        title: 'Choosing the Right Entity for Your Strategy',
        duration: '6 min',
        videoId: 'M11-V03',
        // videoUrl: 'https://your-video-host.com/M11-V03.mp4', // TODO: Add after Colossyan generation
        content: `## Choosing the Right Entity for Your Strategy\n\n**Video ID:** M11-V03 | **Duration:** 6 min\n\n### What You Will Learn\n\nDecision framework for entity selection based on your investment strategy, number of properties, income level, and long-term goals.\n\n### Key Takeaways\n\n1. **Decision framework for entity selection based on your investment strategy**\n2. **number of properties**\n3. **income level**\n4. **and long-term goals**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-11-4',
        title: 'Land Trusts for Privacy and Protection',
        duration: '7 min',
        videoId: 'M11-V04',
        // videoUrl: 'https://your-video-host.com/M11-V04.mp4', // TODO: Add after Colossyan generation
        content: `## Land Trusts for Privacy and Protection\n\n**Video ID:** M11-V04 | **Duration:** 7 min\n\n### What You Will Learn\n\nHow land trusts work, privacy benefits, asset protection advantages, setting up a land trust, and combining trusts with LLCs.\n\n### Key Takeaways\n\n1. **How land trusts work**\n2. **privacy benefits**\n3. **asset protection advantages**\n4. **setting up a land trust**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-11-5',
        title: 'Living Trusts and Estate Planning',
        duration: '7 min',
        videoId: 'M11-V05',
        // videoUrl: 'https://your-video-host.com/M11-V05.mp4', // TODO: Add after Colossyan generation
        content: `## Living Trusts and Estate Planning\n\n**Video ID:** M11-V05 | **Duration:** 7 min\n\n### What You Will Learn\n\nRevocable vs irrevocable trusts, estate planning for real estate investors, avoiding probate, and protecting your legacy.\n\n### Key Takeaways\n\n1. **Revocable vs irrevocable trusts**\n2. **estate planning for real estate investors**\n3. **avoiding probate**\n4. **and protecting your legacy**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-11-6',
        title: 'Investing with Your IRA',
        duration: '8 min',
        videoId: 'M11-V06',
        // videoUrl: 'https://your-video-host.com/M11-V06.mp4', // TODO: Add after Colossyan generation
        content: `## Investing with Your IRA\n\n**Video ID:** M11-V06 | **Duration:** 8 min\n\n### What You Will Learn\n\nSelf-Directed IRA rules, prohibited transactions, UBIT considerations, custodian selection, and step-by-step process for buying real estate with your IRA.\n\n### Key Takeaways\n\n1. **Self-Directed IRA rules**\n2. **prohibited transactions**\n3. **UBIT considerations**\n4. **custodian selection**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-11-7',
        title: 'Solo 401(k) and Checkbook Control',
        duration: '7 min',
        videoId: 'M11-V07',
        // videoUrl: 'https://your-video-host.com/M11-V07.mp4', // TODO: Add after Colossyan generation
        content: `## Solo 401(k) and Checkbook Control\n\n**Video ID:** M11-V07 | **Duration:** 7 min\n\n### What You Will Learn\n\nSolo 401(k) advantages over SDIRA, checkbook control, contribution limits, Roth conversions, and advanced retirement investing strategies.\n\n### Key Takeaways\n\n1. **Solo 401(k) advantages over SDIRA**\n2. **checkbook control**\n3. **contribution limits**\n4. **Roth conversions**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
    ],
  },
  {
    id: 'mod-12',
    number: 12,
    title: 'Creative Financing Mastery',
    description: 'Advanced financing techniques including seller financing, lease options, private money, and multi-layer deal structures.',
    icon: '🎯',
    premium: true,
    requiredTier: 'elite',
    lessons: [
      {
        id: 'l-12-1',
        title: 'Structuring Seller Finance Deals',
        duration: '7 min',
        videoId: 'M12-V01',
        // videoUrl: 'https://your-video-host.com/M12-V01.mp4', // TODO: Add after Colossyan generation
        content: `## Structuring Seller Finance Deals\n\n**Video ID:** M12-V01 | **Duration:** 7 min\n\n### What You Will Learn\n\nSeller financing terms, interest rates, balloon payments, amortization schedules, promissory notes, and deed of trust/mortgage documents.\n\n### Key Takeaways\n\n1. **Seller financing terms**\n2. **interest rates**\n3. **balloon payments**\n4. **amortization schedules**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-12-2',
        title: 'Negotiating with Sellers',
        duration: '7 min',
        videoId: 'M12-V02',
        // videoUrl: 'https://your-video-host.com/M12-V02.mp4', // TODO: Add after Colossyan generation
        content: `## Negotiating with Sellers\n\n**Video ID:** M12-V02 | **Duration:** 7 min\n\n### What You Will Learn\n\nScripts for seller financing conversations, handling objections, presenting win-win structures, and closing seller finance deals.\n\n### Key Takeaways\n\n1. **Scripts for seller financing conversations**\n2. **handling objections**\n3. **presenting win-win structures**\n4. **and closing seller finance deals**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-12-3',
        title: 'Lease Options Explained',
        duration: '7 min',
        videoId: 'M12-V03',
        // videoUrl: 'https://your-video-host.com/M12-V03.mp4', // TODO: Add after Colossyan generation
        content: `## Lease Options Explained\n\n**Video ID:** M12-V03 | **Duration:** 7 min\n\n### What You Will Learn\n\nHow lease-options work, option consideration, monthly credits, exercise price, sandwich lease options, and legal considerations.\n\n### Key Takeaways\n\n1. **How lease-options work**\n2. **option consideration**\n3. **monthly credits**\n4. **exercise price**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-12-4',
        title: 'Private Money and Syndication',
        duration: '7 min',
        videoId: 'M12-V04',
        // videoUrl: 'https://your-video-host.com/M12-V04.mp4', // TODO: Add after Colossyan generation
        content: `## Private Money and Syndication\n\n**Video ID:** M12-V04 | **Duration:** 7 min\n\n### What You Will Learn\n\nRaising private capital, SEC regulations, syndication structures, investor presentations, preferred returns, and building a track record.\n\n### Key Takeaways\n\n1. **Raising private capital**\n2. **SEC regulations**\n3. **syndication structures**\n4. **investor presentations**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
      {
        id: 'l-12-5',
        title: 'Stacking Strategies for Maximum Returns',
        duration: '7 min',
        videoId: 'M12-V05',
        // videoUrl: 'https://your-video-host.com/M12-V05.mp4', // TODO: Add after Colossyan generation
        content: `## Stacking Strategies for Maximum Returns\n\n**Video ID:** M12-V05 | **Duration:** 7 min\n\n### What You Will Learn\n\nMulti-layer deal structures, combining financing methods, case studies of creative deals, course wrap-up, and your action plan going forward.\n\n### Key Takeaways\n\n1. **Multi-layer deal structures**\n2. **combining financing methods**\n3. **case studies of creative deals**\n4. **course wrap-up**\n\n### Action Steps\n\nAfter watching this lesson, complete the following before moving on:\n\n1. Review the key concepts covered in this lesson\n2. Apply what you learned to a real or practice scenario\n3. Take the module quiz when you complete all lessons in this module`,
      },
    ],
  },
];
