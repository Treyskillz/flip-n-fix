// ============================================================
// Fix & Flip Mastery 2026 — Course Content
// Comprehensive course on fix & flip with all exit strategies
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
  content: string;
}

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 'mod-1',
    number: 1,
    title: 'Foundation: The Real Estate Investor Mindset',
    description: 'Build the mental framework and business foundation for successful real estate investing in 2026.',
    icon: '🧠',
    requiredTier: 'free',
    lessons: [
      {
        id: 'l-1-1',
        title: 'Why Fix & Flip in 2026? Market Overview',
        duration: '15 min',
        content: `## Why Fix & Flip in 2026?

The fix and flip market in 2026 presents unique opportunities for investors who understand the current landscape.

### Current Market Conditions

**Interest Rate Environment:** After years of elevated rates, the market has begun to stabilize. While mortgage rates remain higher than the historic lows of 2020-2021, they have created a significant opportunity: many homeowners who bought at peak prices are now underwater or unable to sell traditionally, creating motivated seller opportunities.

**Housing Supply Shortage:** The U.S. continues to face a housing deficit of approximately 4-6 million homes. This structural shortage supports property values and ensures strong demand for renovated homes.

**Aging Housing Stock:** Over 50% of U.S. homes were built before 1980. These aging properties need significant updates to meet modern buyer expectations — creating the perfect inventory for fix and flip investors.

### Why This Matters For You

1. **Motivated sellers are everywhere** — Homeowners who bought at peak prices, inherited properties, or face life changes need solutions
2. **Renovated homes command premiums** — Buyers will pay significantly more for move-in ready homes vs. fixer-uppers
3. **Multiple exit strategies** — Unlike previous cycles, today's investor has more ways to profit from a single deal
4. **Technology advantage** — Tools like this analyzer give you a data-driven edge that previous generations of investors never had

### The 2026 Investor Advantage

The investors who will thrive in 2026 are those who:
- Analyze deals with precision (not gut feeling)
- Understand multiple exit strategies
- Build systems for finding and closing deals
- Manage rehabs efficiently with detailed scopes of work
- Market properties effectively for maximum sale price

### 🥷 Ninja Tips: Investor Mindset

1. **Analyze 100 deals before buying one** — Most new investors jump on the first deal they find. Train your eye by running 100 deals through the Freedom One Analyzer first. By deal #50, you'll spot winners and losers in seconds.

2. **Track your "cost per lead"** — Know exactly how much you spend on marketing per deal closed. If direct mail costs $2,000 and produces 1 deal, your cost per lead is $2,000. Compare channels and double down on what works.

3. **Set a "walk-away" alarm** — Before analyzing any deal, write down your maximum purchase price. If the numbers don't work, walk away immediately. Emotional attachment to a property is the #1 profit killer.`,
      },
      {
        id: 'l-1-2',
        title: 'Setting Up Your Business Entity',
        duration: '20 min',
        content: `## Setting Up Your Real Estate Investment Business

Before you buy your first property, you need a proper business structure.

### Choosing Your Entity Type

**LLC (Limited Liability Company)** — The most popular choice for real estate investors.
- Protects personal assets from business liabilities
- Pass-through taxation (no double taxation)
- Flexible management structure
- Relatively inexpensive to form ($50-$500 depending on state)

**Series LLC** — Available in some states (TX, DE, IL, NV, and others).
- Each property can be in its own "series" within one LLC
- Liability isolation between properties
- Lower cost than forming multiple LLCs
- Not recognized in all states

**S-Corp** — Sometimes used in conjunction with an LLC.
- Can reduce self-employment taxes on flip profits
- More complex tax filing requirements
- Best for investors doing 3+ flips per year

### Essential Business Setup Checklist

1. **Form your LLC** — File with your state's Secretary of State
2. **Get an EIN** — Free from IRS.gov, takes 5 minutes
3. **Open a business bank account** — Keep personal and business finances separate
4. **Get business insurance** — General liability + property insurance for each project
5. **Set up your accounting system** — QuickBooks, Wave, or hire a bookkeeper
6. **Build your team** — Real estate attorney, CPA, insurance agent, title company
7. **Create your brand** — Business name, logo, website, business cards
8. **Set up your CRM** — Track leads, deals, and contacts (Podio, REI BlackBook, etc.)

### Tax Considerations for Flippers

**Important:** Fix and flip profits are typically taxed as **ordinary income**, not capital gains. This means:
- Short-term flips (held < 12 months) are taxed at your regular income tax rate
- The IRS may classify you as a "dealer" if you flip frequently
- Self-employment tax (15.3%) may apply
- **Consult a CPA who specializes in real estate** — this is not optional

### Pro Tip: The "2-Entity Strategy"
Many experienced investors use two entities:
1. **Acquisition LLC** — Buys and rehabs properties
2. **Holding LLC** — Holds rental properties for long-term wealth building

This separation provides additional liability protection and tax planning flexibility.

### 🥷 Ninja Tips: Business Setup

1. **Get your EIN before your LLC** — You can apply for an EIN on IRS.gov in 5 minutes, even before your LLC is approved. This lets you open a business bank account faster.

2. **Use a registered agent service ($50-$150/year)** — Don't use your home address for your LLC. A registered agent keeps your personal address off public records and looks more professional.

3. **Create a "deal folder" template** — Set up a Google Drive or Dropbox folder template with subfolders: Contracts, Inspection, Photos, Estimates, Closing Docs. Clone it for every deal. Organization prevents costly mistakes.

4. **Open TWO business bank accounts** — One for operating expenses (marketing, gas, software) and one for deal funds (earnest money, rehab draws, closing costs). This makes bookkeeping dramatically easier at tax time.`,
      },
      {
        id: 'l-1-3',
        title: 'Building Your Power Team',
        duration: '15 min',
        content: `## Building Your Real Estate Power Team

No successful investor works alone. Here's who you need on your team and how to find them.

### Your Core Team

**1. Real Estate Attorney ($300-$500/closing)**
- Reviews and drafts contracts
- Handles title issues and liens
- Advises on entity structure
- **How to find:** Ask other investors, attend local REIA meetings

**2. CPA / Tax Strategist ($500-$2,000/year)**
- Structures your business for tax efficiency
- Handles quarterly estimated taxes
- Maximizes deductions (mileage, home office, materials, etc.)
- **How to find:** Look for CPAs who specialize in real estate investment

**3. General Contractor ($0 — they bid on your projects)**
- Manages your rehab projects
- Provides accurate bids and timelines
- Pulls permits and manages subcontractors
- **How to find:** Get 3 bids on every project, check references, verify license and insurance

**4. Real Estate Agent (Investor-Friendly)**
- Pulls comps and market data
- Lists your finished flips on MLS
- May help find off-market deals
- **How to find:** Look for agents who also invest or specialize in working with investors

**5. Title Company / Closing Attorney**
- Handles closings and escrow
- Provides title insurance
- Manages document recording
- **How to find:** Ask other investors which title companies are "investor-friendly" (fast, flexible)

**6. Hard Money Lender**
- Finances your purchases and rehabs
- Provides fast closings (7-14 days)
- **How to find:** See our Hard Money Lender Directory in this app

### Your Extended Team

- **Property Inspector** — Pre-purchase inspections ($300-$500)
- **Insurance Agent** — Builder's risk and liability coverage
- **Wholesalers** — Source of off-market deals
- **Property Manager** — If using the rent exit strategy
- **Handyman** — For small repairs and punch list items

### Networking: Where to Find Your Team

1. **Local REIA (Real Estate Investors Association)** — Monthly meetings in most cities
2. **BiggerPockets.com** — Online forums and local meetups
3. **Facebook Groups** — Search "[Your City] Real Estate Investors"
4. **REI Meetups** — Check Meetup.com for local groups
5. **Courthouse Steps** — Meet other investors at foreclosure auctions

### 🥷 Ninja Tips: Building Your Team

1. **Take your contractor to lunch, not just to job sites** — Relationships matter. The contractors who give you priority scheduling and honest bids are the ones who like working with you. A $30 lunch saves you $3,000 in overcharges.

2. **Ask your title company for a "net sheet" on every deal** — Before you make an offer, ask your title company to run a preliminary net sheet showing all closing costs. This prevents surprises and gives you exact numbers for your analysis.

3. **Build a "B-team" for every position** — Your main contractor gets sick, your agent goes on vacation, your lender runs out of funds. Always have a backup for every key team member. One phone call shouldn't be able to kill your deal.`,
      },
    ],
  },
  {
    id: 'mod-2',
    number: 2,
    title: 'Finding Deals: Acquisition Strategies',
    description: 'Master the art of finding profitable properties before anyone else.',
    icon: '🔍',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-2-1',
        title: 'The 7 Best Lead Sources for 2026',
        duration: '25 min',
        content: `## The 7 Best Lead Sources for Finding Deals in 2026

### 1. Direct Mail Marketing
**Cost:** $0.50-$2.00 per piece | **Response Rate:** 0.5-2%

Direct mail remains one of the most reliable lead sources. Target:
- Absentee owners (landlords who live elsewhere)
- Properties with tax liens or code violations
- Probate/inherited properties
- Expired MLS listings
- High-equity homeowners (65%+ equity)

**Key Metrics:** Send at least 1,000 pieces per month consistently. Expect 5-20 calls per 1,000 mailers.

### 2. Driving for Dollars
**Cost:** Gas + time + skip tracing ($0.10-$0.25/lead) | **Response Rate:** 3-8%

Drive through target neighborhoods looking for:
- Overgrown lawns and neglected landscaping
- Boarded windows or visible damage
- Accumulated mail/newspapers
- Vacant properties
- Properties with code violation notices

**Tools:** DealMachine app, BatchLeads, PropStream Mobile

### 3. Wholesalers
**Cost:** Built into purchase price | **Speed:** Fastest path to deals

Build relationships with 5-10 active wholesalers in your market. They do the marketing and negotiating — you just analyze and buy the deals that work.

**How to connect:** Attend REIA meetings, join Facebook groups, tell everyone you're a cash buyer.

### 4. MLS & Investor-Friendly Agents
**Cost:** Agent commission on purchase | **Volume:** High

Set up automated MLS alerts for:
- Properties listed 60+ days (price reductions coming)
- REO/bank-owned properties
- Estate sales
- Properties priced below market value
- "As-is" or "investor special" keywords

### 5. Online Marketing
**Cost:** $500-$3,000/month | **Scalability:** Highest

- **Google Ads** — Target "sell my house fast [city]" keywords
- **Facebook Ads** — Target homeowners by demographics and interests
- **SEO Website** — Rank for "we buy houses [city]" searches
- **Social Media** — Share before/after photos, testimonials, market updates

### 6. Foreclosure & Auction Properties
**Cost:** Varies | **Discount:** 10-30% below market

- **Pre-foreclosure (Lis Pendens)** — Contact homeowners before auction
- **Courthouse Auctions** — Buy at the foreclosure sale (cash required)
- **REO Properties** — Bank-owned properties listed on MLS
- **Online Auctions** — Auction.com, Hubzu, Xome

### 7. Networking & Referrals
**Cost:** $0-$500 referral fees | **Quality:** Highest

The best deals often come from:
- Other investors who pass on deals outside their criteria
- Real estate agents who know distressed sellers
- Attorneys (probate, divorce, bankruptcy)
- Property managers with tired landlord clients
- Contractors who see distressed properties daily

### 🥷 Ninja Tips: Finding Deals

1. **The "Yellow Letter" hack** — Handwritten yellow letters get 3-5x the response rate of printed postcards. You don't have to write them yourself — services like Yellow Letters Complete or Ballpoint Marketing print letters that look handwritten. Cost: $1.50-$2.50 each, but the response rate makes it worth it.

2. **Drive for dollars on trash day** — The best time to spot distressed properties is on trash/recycling day. Overflowing bins, no bins out at all, or bins that haven't been moved in weeks are all signs of vacancy or distress.

3. **Befriend code enforcement officers** — They know every problem property in town before anyone else. Attend city council meetings and introduce yourself. They can't give you owner info directly, but they can point you to public records.

4. **Set up "stalker alerts" on Zillow and Redfin** — Create saved searches for price reductions, back-on-market listings, and properties listed 60+ days. These automated alerts do your deal-finding while you sleep.

5. **The "2-touch" follow-up rule** — 80% of deals close after the 5th contact. Most investors give up after 1-2 attempts. Set up a 6-touch follow-up sequence (mail, call, text, mail, call, mail) over 90 days. Persistence wins.`,
      },
      {
        id: 'l-2-2',
        title: 'Analyzing Deals: The Numbers That Matter',
        duration: '30 min',
        content: `## Analyzing Deals: The Numbers That Matter

Every successful flip starts with accurate analysis. Here are the key metrics and formulas you need to know.

### The 70% Rule (Quick Filter)

**Maximum Allowable Offer = (ARV × 70%) - Rehab Costs**

This is your quick screening tool. If a deal doesn't pass the 70% rule, dig deeper before proceeding.

**Example:**
- ARV: $300,000
- Rehab: $40,000
- MAO: ($300,000 × 0.70) - $40,000 = **$170,000**

### After Repair Value (ARV)

The ARV is the most important number in your analysis. Get it wrong, and everything else falls apart.

**How to determine ARV:**
1. Find 3-5 comparable sales (comps) within 0.5 miles
2. Comps should be sold within the last 6 months
3. Similar size (within 20% of square footage)
4. Similar bed/bath count
5. Similar age and condition (after your rehab)
6. Calculate average price per square foot
7. Multiply by your subject property's square footage

**Pro Tip:** Always use SOLD comps, never active listings. The market determines value, not asking prices.

### Rehab Cost Estimation

Use the scope of work approach in this app for accurate estimates:
1. Walk the property room by room
2. List every item that needs work
3. Get contractor bids for each item
4. Add 10-15% contingency buffer

**Cost per square foot guidelines (2026):**
| Rehab Level | Cost/SqFt | Description |
|-------------|-----------|-------------|
| Light | $20-35 | Paint, flooring, fixtures, landscaping |
| Moderate | $35-55 | Kitchen/bath updates, some structural |
| Heavy | $55-85 | Full gut rehab, layout changes, systems |

### All-In Cost Analysis

**Total Investment = Purchase + Rehab + Financing + Holding + Closing**

| Cost Category | Typical Range |
|---------------|---------------|
| Purchase Price | Your negotiated price |
| Rehab Costs | $20-85/sqft |
| Buy Closing | 1-2% of purchase |
| Sell Closing | 5-6% of ARV (agent + title) |
| Hard Money Interest | 9-13% annual |
| Hard Money Points | 1-3 points |
| Holding Costs | $1,500-3,000/month |
| Contingency | 10-15% of rehab |

### Profit Targets

| Metric | Minimum Target |
|--------|---------------|
| Net Profit | $25,000+ per flip |
| ROI | 15%+ |
| Cash-on-Cash Return | 30%+ |
| Profit Margin | 10%+ of ARV |

### 🥷 Ninja Tips: Deal Analysis

1. **Always verify comps in person** — Online photos can be deceiving. Drive by your top 3 comps to verify condition, neighborhood quality, and street appeal. A comp that looks great online might be next to a junkyard.

2. **Use the "3-ARV" method** — Calculate three ARVs: Conservative (lowest comp), Realistic (average), and Optimistic (highest comp). Only buy deals that work at the Conservative ARV. If it works at conservative and you hit realistic, that's bonus profit.

3. **Add $5,000 to every rehab estimate** — No matter how detailed your scope of work, something unexpected will come up. Plumbing behind walls, electrical issues, permit delays. The $5,000 buffer has saved more deals than any other single habit.

4. **Calculate your "daily burn rate"** — Add up all monthly holding costs (mortgage, taxes, insurance, utilities, lawn care) and divide by 30. This is how much every single day costs you. When your contractor says "we need one more week," you'll know exactly what that means in dollars.`,
      },
    ],
  },
  {
    id: 'mod-3',
    number: 3,
    title: 'Exit Strategy #1: Fix & Flip',
    description: 'The classic strategy — buy, renovate, and sell for profit.',
    icon: '🔨',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-3-1',
        title: 'Managing Your Rehab Like a Pro',
        duration: '25 min',
        content: `## Managing Your Rehab Like a Pro

The rehab phase is where most new investors lose money. Here's how to manage it effectively.

### The Rehab Management System

**1. Detailed Scope of Work (SOW)**
Before any work begins, create a written SOW that includes:
- Every item to be repaired/replaced
- Specific materials and brands
- Quantities and measurements
- Labor expectations
- Timeline for each phase

Use the Scope of Work feature in this app to generate a professional SOW automatically.

**2. Getting Contractor Bids**
- Always get at least 3 bids
- Provide the same SOW to each contractor
- Compare line by line, not just totals
- Check references (call 3 previous clients)
- Verify license, insurance, and bond

**3. The Draw Schedule**
Never pay a contractor 100% upfront. Use a draw schedule:

| Milestone | Payment |
|-----------|---------|
| Contract signed | 10% deposit |
| Demo complete | 15% |
| Rough-in complete (plumbing, electrical, HVAC) | 20% |
| Drywall and flooring complete | 20% |
| Kitchen and bathrooms complete | 20% |
| Final punch list and inspection | 15% |

**4. Daily/Weekly Site Visits**
- Visit the property at least 2-3 times per week
- Take photos of progress
- Compare actual progress to your Gantt chart timeline
- Address issues immediately — delays compound quickly

### Common Rehab Mistakes to Avoid

1. **Over-improving for the neighborhood** — Don't put $80K in upgrades in a $200K neighborhood
2. **Skipping permits** — Can kill your deal at closing or create liability
3. **Paying too much upfront** — Use the draw schedule above
4. **Not having a contingency budget** — Always add 10-15% for surprises
5. **Choosing the cheapest contractor** — The cheapest bid often costs the most in delays and rework
6. **Scope creep** — Stick to your SOW unless the change clearly adds value
7. **Ignoring the timeline** — Every extra month costs you $2,000-4,000 in holding costs

### 🥷 Ninja Tips: Rehab Management

1. **The "morning photo" rule** — Every morning before work starts, take a photo of each room from the same angle. This documents progress for lenders, catches mistakes early, and creates incredible before/after content for marketing.

2. **Pay for materials yourself, labor only to contractors** — Buy materials directly from Home Depot or Lowe's with your own account. This prevents contractor markup (typically 15-30%) and ensures you get the exact materials specified in your SOW.

3. **The "punch list walk" trick** — Do your final walk with a roll of blue painter's tape. Stick tape next to every defect — paint drips, uneven caulk, scratched fixtures. Hand the contractor the list AND leave the tape in place. Nothing gets "forgotten."

4. **Schedule inspections on Fridays** — Contractors rush to finish before weekends. Schedule your inspections for Friday afternoons. You'll get more work done in the 48 hours before a Friday inspection than in any other week.

5. **Keep a "change order log"** — Every change from the original SOW gets written down with the cost impact BEFORE the work is done. No verbal agreements. This single habit prevents 90% of contractor disputes.`,
      },
      {
        id: 'l-3-2',
        title: 'Selling Your Flip for Maximum Profit',
        duration: '20 min',
        content: `## Selling Your Flip for Maximum Profit

The sale is where you realize your profit. Here's how to maximize it.

### Pre-Listing Preparation

**Professional Staging ($2,000-$5,000)**
Staged homes sell 73% faster and for 5-10% more than unstaged homes. Options:
- Full professional staging (best for higher-end flips)
- Virtual staging for online photos ($200-$500)
- DIY staging with rented furniture

**Professional Photography ($200-$500)**
- Wide-angle interior shots
- Drone/aerial photography
- Twilight exterior shots
- Video walkthrough tour

**Pre-Listing Inspection ($300-$500)**
Get your own inspection before listing to:
- Fix issues before buyers find them
- Provide the report to buyers (builds trust)
- Avoid surprises during buyer's inspection

### Pricing Strategy

**Price slightly below the highest comp** to generate multiple offers and create urgency.

| Strategy | When to Use |
|----------|-------------|
| Price at ARV | Strong seller's market, unique features |
| Price 2-3% below ARV | Balanced market, generate multiple offers |
| Price 5% below ARV | Slow market, need to sell quickly |

### Marketing Your Flip

1. **MLS Listing** — Maximum exposure through your agent
2. **Social Media** — Before/after photos on Instagram, Facebook, TikTok
3. **Open Houses** — Weekend open houses for the first 2 weeks
4. **Broker Open** — Invite local agents to preview
5. **Online Portals** — Zillow, Redfin, Realtor.com (automatic from MLS)

### Negotiation Tips

- Respond to all offers within 24 hours
- Counter-offer rather than reject
- Consider net proceeds, not just price (closing cost credits, etc.)
- Set an offer deadline to create urgency
- Be willing to negotiate on terms (closing date, inspections) to hold firm on price

### 🥷 Ninja Tips: Selling Your Flip

1. **List on Thursday, not Monday** — Properties listed Thursday get maximum weekend showing traffic. Buyers browse Thursday night, schedule showings Friday, and visit Saturday/Sunday.

2. **Price at $X99,900 not $X00,000** — List at $299,900 instead of $300,000. This puts your property in the "under $300K" search filter that most buyers use. You lose $100 but gain thousands of additional eyeballs.

3. **Offer a home warranty ($400-$600)** — A 1-year home warranty removes buyer fear about rehab quality. It costs $400-$600 but can be the difference between getting an offer and not.

4. **The "fresh cookie" open house** — Bake cookies or use a cookie-scented candle during open houses. The smell of fresh baking triggers feelings of home and comfort and increases perceived property value.

5. **Create a property website** — Use the Freedom One Listings feature to create a dedicated page for your flip with photos, features, and contact info. Share the link on social media for professional lead capture.`,
      },
      {
        id: 'l-3-3',
        title: 'The Price Reduction Strategy: Post-Inspection Negotiation',
        duration: '25 min',
        content: `## The Price Reduction Strategy: Post-Inspection Negotiation

One of the most powerful — and completely legal — tools in a real estate investor's toolkit is the **post-inspection price reduction request**. This lesson teaches you how to use the inspection contingency in your purchase contract to negotiate a better price based on legitimate findings.

### What Is a Price Reduction Request?

A Price Reduction Request is a formal, written letter submitted to the seller (or their listing agent) after a professional property inspection reveals repair issues that were not anticipated at the time of your original offer.

This is a **standard practice** in real estate — not a trick or loophole. Every standard purchase agreement includes an inspection contingency period (typically 7–14 days) that gives you the contractual right to:
- Inspect the property
- Request repairs or a price reduction based on findings
- Cancel the contract if you cannot reach agreement

### When to Use It

Use the Price Reduction Request when **all** of these conditions are met:
1. You have a signed purchase agreement with an inspection contingency
2. A licensed inspector has completed a thorough inspection
3. The inspection revealed **material defects** not visible or disclosed before your offer
4. The repair costs significantly impact deal economics
5. You are negotiating in **good faith** — you genuinely want to buy the property

**Legitimate triggers:** Foundation issues, roof damage, outdated electrical, plumbing problems, HVAC failure, mold/asbestos, structural damage, code violations.

### When NOT to Use It

- For cosmetic issues visible during your initial walkthrough
- For items already disclosed by the seller
- As a pretext to renegotiate a price you never intended to pay
- For minor issues that don't materially affect value

**Your reputation is your most valuable asset.** If you develop a reputation for using inspections to renegotiate every deal, agents will stop presenting your offers.

### How to Calculate Your Revised Offer

**Step 1:** Start with your original MAO
MAO = (ARV × 70%) − Estimated Repairs

**Step 2:** Get written contractor estimates for each new issue (at least 2 bids per major item)

**Step 3:** Calculate additional repair costs
Additional Repairs = New Total Estimate − Original Estimate

**Step 4:** Calculate revised MAO
Revised MAO = (ARV × 70%) − New Total Repairs

**Step 5:** Set your revised offer at or below the Revised MAO

**Example:**
| Item | Amount |
|------|--------|
| ARV | $300,000 |
| Original repair estimate | $40,000 |
| Original MAO | $170,000 |
| Original offer | $165,000 |
| Additional repairs found | $15,000 |
| New total repairs | $55,000 |
| Revised MAO | $155,000 |
| Revised offer | $150,000–$155,000 |

### Ninja Negotiation Tips

These advanced tactics are 100% legal and ethical:

1. **Document immediately** — Take photos during the inspection before anything gets cleaned up. Active water intrusion is more compelling than a dry stain photographed later.

2. **Get multiple contractor bids** — Present 2-3 written estimates from licensed contractors. The highest bid is often the most thorough and hardest to argue against.

3. **Itemize everything separately** — A list of 25 line items at $600 each creates stronger impact than one line saying "$15,000 in repairs."

4. **Use the inspector's language** — Quote phrases like "safety hazard," "code violation," "end of useful life," and "recommended immediate repair" directly from the report.

5. **Present costs as a percentage** — "$18,000 in additional repairs represents 10.5% of the purchase price" sounds more significant than just the dollar amount.

6. **Offer a quick close as incentive** — "If we agree on the revised price, we'll close in 14 days instead of 30." Speed costs you nothing but motivates the seller.

7. **Time it strategically** — Submit early in the contingency period, not at the last minute. Early feels like good faith; last-minute feels like pressure.

### Using the Freedom One Price Reduction Form

The Freedom One platform includes a **Price Reduction Form** tool (under Resources) that:
- Auto-fills your business information from your profile
- Calculates revised MAO automatically
- Generates a professional letter ready to print or email
- Includes all the training content from this lesson

Navigate to **Resources → Price Reduction Form** to access it.

### Legal & Ethical Reminders

- This is a contractual right, not a loophole — exercise it honestly
- Your request must be based on actual, documented inspection findings
- State laws vary — always consult a real estate attorney in your jurisdiction
- All parties have an implied duty of good faith and fair dealing
- If you knew about defects before your offer, they don't qualify as new findings`,
      },
    ],
  },
  {
    id: 'mod-4',
    number: 4,
    title: 'Exit Strategy #2: Wholesaling',
    description: 'Profit from deals without ever owning the property. The lowest-risk entry into real estate investing.',
    icon: '🤝',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-4-1',
        title: 'Wholesaling Fundamentals',
        duration: '25 min',
        content: `## Wholesaling: Profit Without Owning Property

Wholesaling is the art of finding deeply discounted properties, getting them under contract, and assigning that contract to another investor for a fee.

### How Wholesaling Works

1. **Find a motivated seller** with a property below market value
2. **Negotiate and sign a purchase contract** (with an assignment clause)
3. **Find a cash buyer** willing to pay more than your contract price
4. **Assign the contract** to the buyer for an assignment fee
5. **Collect your fee at closing** — typically $5,000-$25,000+

### The Assignment Clause

Your purchase contract MUST include language that allows assignment. Key phrases:

> "Buyer, **and/or assigns**, agrees to purchase the property..."

> "This contract may be assigned by Buyer to any third party without the consent of Seller."

Use the contract templates in this app — they already include proper assignment language.

### Finding Buyers for Your Deals

**Build a Cash Buyers List:**
1. Attend local REIA meetings and collect business cards
2. Search county records for recent cash purchases
3. Post deals on Facebook investor groups
4. Use Craigslist and Facebook Marketplace
5. Network with other wholesalers (they have buyers too)
6. Create a simple website or landing page for buyer sign-ups

**Qualifying Your Buyers:**
- Ask for proof of funds (bank statement or hard money pre-approval)
- Ask about their buying criteria (location, price range, property type)
- Ask how quickly they can close
- Start with buyers who have closed deals before

### Wholesaling Numbers Example

| Item | Amount |
|------|--------|
| ARV | $250,000 |
| Rehab estimate | $35,000 |
| Investor's MAO (70% rule) | $140,000 |
| Your contract price with seller | $120,000 |
| Your assignment fee | **$20,000** |
| Buyer's purchase price | $140,000 |

### Double Close vs. Assignment

**Assignment** — Simpler, cheaper, but seller and buyer see your fee
- Cost: $0-$500
- Timeline: Same day as original closing

**Double Close** — You actually buy and immediately resell
- Cost: $1,000-$3,000 (two sets of closing costs)
- Timeline: Same day or back-to-back closings
- Advantage: Neither party sees your profit margin
- Use transactional funding if needed (short-term loan for hours/days)

### Legal Considerations

- Wholesaling laws vary by state — some require a real estate license
- Always use a proper purchase contract (not just a letter of intent)
- Disclose your role as an investor, not a licensed agent
- Never misrepresent the property condition
- Consult a real estate attorney in your state

### 🥷 Ninja Tips: Wholesaling

1. **The "reverse wholesale" method** — Instead of finding a deal first, find your buyer first. Ask cash buyers exactly what they want (location, price range, bed/bath, condition). Then go find that exact property. You already have a buyer before you even make an offer.

2. **Use the "3-offer" strategy** — When talking to a motivated seller, present three offers: (1) All cash, lowest price, fast close; (2) Slightly higher price with seller financing terms; (3) Highest price with a lease-option. This gives the seller choices and makes you look professional, not predatory.

3. **Build a "deal sheet" template** — Create a one-page PDF with property photos, address, ARV, rehab estimate, and your asking price. Email this to your entire buyers list within 2 hours of getting a property under contract. Speed is everything — the first wholesaler to send a deal sheet gets the buyer.

4. **Never say "I'm a wholesaler"** — Say "I'm a real estate investor and I buy properties in this area." The word "wholesaler" has negative connotations with some sellers and agents. You ARE an investor — you just happen to use the assignment exit strategy.

5. **The "earnest money" power move** — Offer $1,000-$2,500 in earnest money (not $100). A larger earnest money deposit signals you're serious and makes your offer stand out. You get it back if you exercise your inspection contingency.`,
      },
    ],
  },
  {
    id: 'mod-5',
    number: 5,
    title: 'Exit Strategy #3: Fix & Rent (BRRRR)',
    description: 'Buy, Rehab, Rent, Refinance, Repeat — build long-term wealth through rental properties.',
    icon: '🏘️',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-5-1',
        title: 'The BRRRR Strategy Explained',
        duration: '25 min',
        content: `## The BRRRR Strategy: Build Wealth Through Rentals

BRRRR stands for **Buy, Rehab, Rent, Refinance, Repeat**. It's the most powerful wealth-building strategy in real estate.

### How BRRRR Works

**1. Buy** — Purchase a distressed property below market value (same as a flip)

**2. Rehab** — Renovate to rental-ready condition (not flip-quality — more durable, less cosmetic)

**3. Rent** — Place a qualified tenant and stabilize cash flow

**4. Refinance** — Get a conventional or DSCR loan based on the new appraised value, pulling out most or all of your invested capital

**5. Repeat** — Use the refinanced cash to buy your next property

### BRRRR Numbers Example

| Step | Amount |
|------|--------|
| Purchase price | $120,000 |
| Rehab cost | $30,000 |
| Total invested | $150,000 |
| After-repair value | $200,000 |
| Refinance at 75% LTV | $150,000 |
| Cash pulled out | **$150,000** |
| Cash left in deal | **$0** |
| Monthly rent | $1,800 |
| Monthly expenses (PITI + reserves) | $1,200 |
| Monthly cash flow | **$600** |

**Result:** You own a $200K property with $600/month cash flow and $0 of your own money left in the deal. Now repeat.

### Rental Rehab vs. Flip Rehab

| Feature | Flip Rehab | Rental Rehab |
|---------|-----------|--------------|
| Flooring | LVP or hardwood | Commercial-grade LVP |
| Countertops | Quartz | Granite or laminate |
| Fixtures | Trendy/modern | Durable/classic |
| Paint | Designer colors | Neutral (gray/beige) |
| Appliances | Stainless steel | Black or white |
| Goal | Maximize sale price | Maximize durability |

### Key Metrics for Rentals

- **Cash-on-Cash Return:** Annual cash flow ÷ Cash invested (target: 8%+)
- **Cap Rate:** NOI ÷ Property value (target: 6%+)
- **DSCR:** Rental income ÷ Debt service (target: 1.25+)
- **1% Rule:** Monthly rent should be ~1% of purchase price
- **50% Rule:** Assume 50% of rent goes to expenses (quick estimate)

### Finding DSCR Lenders for Refinance

DSCR (Debt Service Coverage Ratio) loans qualify based on rental income, not your personal income. Key features:
- No personal income verification
- Based on property cash flow
- 30-year fixed rates available
- 75-80% LTV typical
- See our Lender Directory for DSCR lender options

### 🥷 Ninja Tips: BRRRR Strategy

1. **Rehab for rent, not for sale** — BRRRR rehabs should prioritize durability over aesthetics. Use commercial-grade LVP flooring (not hardwood), semi-gloss paint (wipes clean), and lever-style door handles (tenants break knobs). Every material choice should answer: "Will this survive 5 years of tenants?"

2. **Get your refinance appraisal BEFORE placing a tenant** — An empty, freshly renovated property appraises higher than one with a tenant's furniture and personal items. Schedule the appraisal during the 2-week window between rehab completion and tenant move-in.

3. **The "rent-ready" photo trick** — Take professional photos of every room immediately after rehab, before any tenant moves in. Use these photos for every future tenant listing. You'll never need to photograph the property again.

4. **Screen tenants like you screen deals** — Require credit score 620+, income 3x rent, 2 years employment history, and landlord references. One bad tenant costs more than 6 months of vacancy. Never skip screening to fill a unit faster.

5. **Build your "refinance packet" during rehab** — Keep a folder with before/after photos, receipts for all improvements, the SOW, and a list of comparable rents. Hand this to your appraiser. Appraisers appreciate organized investors and it helps justify a higher value.`,
      },
    ],
  },
  {
    id: 'mod-6',
    number: 6,
    title: 'Exit Strategy #4: Subject-To',
    description: 'Take over existing mortgages for creative, low-money-down acquisitions.',
    icon: '📋',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-6-1',
        title: 'Subject-To Financing Explained',
        duration: '30 min',
        content: `## Subject-To: Creative Financing for Smart Investors

"Subject-To" means purchasing a property **subject to the existing mortgage** remaining in place. You take over the payments without formally assuming the loan.

### How Subject-To Works

1. Seller deeds the property to you (you become the owner)
2. The existing mortgage stays in the seller's name
3. You make the mortgage payments going forward
4. You control the property and all equity

### Why Sellers Agree to Subject-To

- They're behind on payments and facing foreclosure
- They need to relocate quickly
- They're underwater (owe more than the home is worth)
- Divorce situations requiring a quick resolution
- They can't sell traditionally due to condition or market

### Subject-To Numbers Example

| Item | Amount |
|------|--------|
| Property value | $250,000 |
| Existing mortgage balance | $200,000 |
| Existing mortgage rate | 3.5% (locked in from 2021!) |
| Monthly payment (PITI) | $1,100 |
| Current market rent | $2,000 |
| Monthly cash flow | **$900** |
| Your cash to close | **$2,000-$5,000** (back payments + closing costs) |

**The Power:** You're getting a $250K property with a 3.5% interest rate (when current rates are 6-7%) for almost no money down.

### The Due-on-Sale Clause

**The Risk:** Most mortgages contain a "due-on-sale" clause that allows the lender to call the loan due if the property is transferred.

**The Reality:**
- Lenders rarely enforce this if payments are being made on time
- They make money from the interest — they don't want the property back
- It has happened, but it's uncommon
- Mitigate by keeping payments current and maintaining insurance

**Risk Mitigation Strategies:**
1. Use a land trust to take title (adds a layer of privacy)
2. Keep the seller's insurance active initially, then add your own
3. Set up automatic payments so the mortgage is never late
4. Have a refinance exit plan ready if the loan is called

### Subject-To Exit Strategies

1. **Rent the property** — Cash flow from day one with a low-rate mortgage
2. **Lease-option** — Rent to a tenant-buyer who will purchase in 1-3 years
3. **Rehab and sell** — Fix up and sell for full market value
4. **Refinance** — Eventually refinance into your own loan
5. **Wrap mortgage** — Sell with owner financing at a higher rate (advanced)

### Legal Protections

- Always use a real estate attorney experienced in creative financing
- Record the deed transfer with the county
- Get a signed authorization from the seller to communicate with their lender
- Set up a loan servicing company to handle payments (creates paper trail)
- Document everything — the seller should sign extensive disclosures

### 🥷 Ninja Tips: Subject-To Deals

1. **The "payment relief" pitch** — Never lead with "I want to take over your mortgage." Instead say: "What if I could take over your monthly payments so you never have to worry about them again, AND you can walk away clean?" Frame it as solving their problem, not as your investment strategy.

2. **Set up auto-pay on DAY ONE** — The moment you close a subject-to deal, set up automatic payments from your business account to the mortgage servicer. A single late payment can trigger the due-on-sale clause. Automate it and forget it.

3. **Get a "letter of authorization" signed at closing** — Have the seller sign a letter authorizing you to communicate with their mortgage company. This lets you verify payment posting, request payoff amounts, and handle any issues without needing the seller involved.

4. **Use a land trust for privacy** — Transfer the property into a land trust with you as beneficiary. This adds a layer of privacy that makes it less likely the lender will notice the transfer and trigger the due-on-sale clause. It's legal and commonly used.

5. **Always have an exit plan** — Before closing any subject-to deal, know your three exits: (1) Rent it for cash flow, (2) Refinance into your own loan within 12-24 months, (3) Sell with owner financing at a higher rate. Never enter a deal with only one way out.`,
      },
    ],
  },
  {
    id: 'mod-7',
    number: 7,
    title: 'Exit Strategy #5: Short-Term Rentals (Airbnb/VRBO)',
    description: 'Maximize cash flow with vacation and short-term rental properties.',
    icon: '🏖️',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-7-1',
        title: 'The Short-Term Rental Opportunity',
        duration: '25 min',
        content: `## Short-Term Rentals: Maximum Cash Flow Strategy

Short-term rentals (STR) through platforms like Airbnb and VRBO can generate 2-3x the income of traditional long-term rentals.

### When to Choose the STR Exit Strategy

**Ideal Markets:**
- Tourist destinations and vacation areas
- Near major hospitals (traveling nurses)
- Near universities (parents visiting, graduation)
- Business travel hubs
- Event venues and convention centers
- Near military bases (PCS moves, temporary duty)

**Ideal Properties:**
- 2-4 bedrooms (sweet spot for families)
- Unique features (views, pool, hot tub, waterfront)
- Close to attractions or downtown
- Properties that photograph well

### STR Numbers Example

| Metric | Long-Term Rental | Short-Term Rental |
|--------|-----------------|-------------------|
| Monthly revenue | $1,800 | $4,500 |
| Occupancy | 95% | 65-75% |
| Annual revenue | $21,600 | $54,000 |
| Expenses (% of revenue) | 40-50% | 25-35% |
| Annual expenses | $9,720 | $16,200 |
| Annual net income | **$11,880** | **$37,800** |

### Setting Up Your STR

**1. Check Local Regulations**
- Many cities require STR permits or licenses
- Some HOAs prohibit short-term rentals
- Zoning laws may restrict STR in certain areas
- Tax obligations (occupancy tax, sales tax)

**2. Furnishing & Design ($5,000-$15,000)**
- Invest in quality furniture (it takes a beating)
- Professional photos are essential
- Create a cohesive design theme
- Stock with essentials (linens, kitchen items, toiletries)

**3. Technology Stack**
- **PriceLabs or Wheelhouse** — Dynamic pricing
- **Hospitable or Guesty** — Automated messaging
- **Turno or Properly** — Cleaning management
- **Noise Aware** — Noise monitoring
- **Smart locks** — Keyless entry (August, Schlage)

**4. Listing Optimization**
- Professional photos (20-30 images minimum)
- Compelling title with key features
- Detailed description with local tips
- Competitive initial pricing to get reviews
- Respond to all inquiries within 1 hour

### STR Financial Analysis

**Key Metrics:**
- **ADR (Average Daily Rate):** Target market rate for your property type
- **Occupancy Rate:** 65-80% is healthy for most markets
- **RevPAR (Revenue Per Available Room):** ADR × Occupancy Rate
- **Cash-on-Cash Return:** Target 15%+ for STR investments

**Research Tools:**
- AirDNA — Market data and comp analysis
- Mashvisor — Investment property analysis
- AllTheRooms — Market analytics
- Rabbu — STR investment analysis

### Managing Your STR

**Self-Manage** — Higher profit, more time commitment
- Best for 1-3 properties
- Use automation tools to reduce workload
- Build a reliable cleaning team

**Property Manager** — 15-25% of revenue
- Best for 4+ properties or remote investors
- They handle everything: guests, cleaning, maintenance
- Interview multiple managers and check reviews

### 🥷 Ninja Tips: Short-Term Rentals

1. **The "Superhost fast-track"** — Price your first 5 bookings 20-30% below market rate to get reviews fast. Airbnb's algorithm heavily favors listings with 5+ reviews. Once you hit Superhost status, raise your prices to market rate. The initial discount pays for itself 10x over.

2. **Create a "local guide" binder** — Put a physical binder in the property with your favorite restaurants, attractions, grocery stores, and emergency contacts. Guests love this personal touch and mention it in reviews. It costs $10 and generates 5-star reviews consistently.

3. **Install a smart lock + noise monitor** — A smart lock (August or Schlage, $200-$300) eliminates key handoff logistics and lets you change codes between guests automatically. A noise monitor (NoiseAware, $150 + $10/month) alerts you to parties before neighbors complain. These two devices prevent 90% of STR headaches.

4. **The "gap night" discount** — If you have a 1-2 night gap between bookings, offer a steep discount (40-50% off) for those nights. An empty night earns $0. Even a heavily discounted night earns something and keeps your occupancy rate high.

5. **Photograph for the thumbnail** — Your listing's main photo is everything. It needs to look stunning at thumbnail size on a phone screen. Hire a professional photographer ($200-$400) and make the hero image a wide-angle shot of the most impressive room with natural light.`,
      },
    ],
  },
  {
    id: 'mod-8',
    number: 8,
    title: 'Financing Your Deals',
    description: 'Master every financing option available to real estate investors in 2026.',
    icon: '💰',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-8-1',
        title: 'Financing Options for Every Strategy',
        duration: '20 min',
        content: `## Financing Options for Real Estate Investors

### Hard Money Loans (Fix & Flip)
- **Best for:** Short-term projects (6-18 months)
- **LTV:** 70-90% of purchase + rehab
- **Rates:** 9-13%
- **Points:** 1-3
- **Speed:** 7-21 days to close
- **Qualification:** Based on deal, not borrower income

### DSCR Loans (Rentals)
- **Best for:** Long-term rental holds
- **LTV:** 75-80%
- **Rates:** 7-9%
- **Qualification:** Based on property cash flow (DSCR 1.0-1.25+)
- **No personal income verification required**

### Conventional Loans
- **Best for:** Primary residence or 1-4 unit investment
- **LTV:** 75-80% for investment (20-25% down)
- **Rates:** Market rates (currently 6-7%)
- **Limit:** 10 financed properties per borrower

### Private Money
- **Best for:** Any strategy, flexible terms
- **Source:** Friends, family, self-directed IRA investors
- **Rates:** Negotiable (8-12% typical)
- **Terms:** Fully negotiable
- **Key:** Build trust and track record first

### Seller Financing
- **Best for:** Properties owned free and clear
- **Down payment:** 10-20% typical
- **Rates:** Negotiable (6-10%)
- **Terms:** 5-30 years
- **Advantage:** No bank qualification needed

### Home Equity (HELOC/HEL)
- **Best for:** Funding down payments or rehab costs
- **LTV:** Up to 80-90% of your primary home equity
- **Rates:** Variable (HELOC) or fixed (HEL)
- **Advantage:** Low rates, flexible draws

### Self-Directed IRA/401(k)
- **Best for:** Tax-advantaged investing
- **Types:** Self-directed IRA, Solo 401(k), SDIRA LLC
- **Advantage:** Profits grow tax-free (Roth) or tax-deferred
- **Rules:** Cannot benefit personally (no living in the property)
- **Custodians:** Equity Trust, Directed IRA, Entrust

### 🥷 Ninja Tips: Financing

1. **Get pre-approved with 3 hard money lenders BEFORE you find a deal** — When a great deal hits, you need to move in hours, not days. Having pre-approval letters ready means you can make offers with confidence and close fast. Sellers and wholesalers prioritize buyers who can prove they can close.

2. **The "points negotiation" trick** — Hard money lenders will often reduce origination points if you ask. "I'll pay your full rate, but can we do 1 point instead of 2?" On a $200K loan, that saves you $2,000. Most investors never negotiate points — the lender expects you to ask.

3. **Build a "credibility packet" for private money** — Create a professional packet with your bio, track record (even if it's just 1-2 deals), your business plan, and a sample deal analysis from Freedom One. This transforms you from "someone asking for money" to "a professional seeking investment partners." Use the Freedom One Credibility Packets feature.

4. **Stack financing creatively** — Use hard money for 70-80% of purchase + rehab, then use a private money second position or a HELOC for the remaining 20-30%. This lets you do deals with little to no money out of pocket. Always disclose all liens to all lenders.

5. **Refinance at 6 months, not 12** — Many DSCR lenders will refinance at 6 months seasoning (not 12). This cuts your hard money holding costs in half on BRRRR deals. Ask specifically about "delayed financing" or "6-month seasoning" programs.`,
      },
    ],
  },
  {
    id: 'mod-9',
    number: 9,
    title: 'Mastering the Freedom One Platform',
    description: 'Complete hands-on tutorials for every tool in the Freedom One Fix & Flip Analyzer — from deal analysis to portfolio management.',
    icon: '💻',
    requiredTier: 'pro',
    lessons: [
      {
        id: 'l-9-1',
        title: 'Deal Analyzer: Complete Walkthrough',
        duration: '30 min',
        content: `## Deal Analyzer: Complete Walkthrough

The Deal Analyzer is the core of the Freedom One platform. This lesson walks you through every section, step by step.

### Step 1: Enter the Subject Property
1. Navigate to the **Deal Analyzer** from the home page or top navigation
2. In the **Subject Property** section, enter:
   - Full property address (street, city, state, ZIP)
   - Property details: beds, baths, square footage, year built, lot size, property type, garage
   - **Purchase price** — the price you will pay or offer for the property
3. The app automatically detects your **metro market** based on the city and state, adjusting all rehab costs to local pricing

### Step 2: Select Your Rehab Level
In the **Rehab Estimator** section, choose one of two modes:
- **Quick Estimate** — Select Light, Moderate, or Heavy rehab for a fast cost-per-sqft estimate
- **Detailed Scope of Work** — Click each room to set condition (Good, Fair, Poor, Replace) and material tier (Rental, Standard, Luxury). Every line item links to real Home Depot products with current pricing.

The rehab budget updates in real time as you make selections.

### Step 3: Add Comparable Sales
In the **Comparable Sales** section:
1. Click **Add Comp** to add a comparable property
2. Enter the comp's address, sale price, sale date, square footage, beds/baths, and condition
3. Add 3–5 comps for the most reliable ARV
4. The app calculates the average price per square foot and multiplies by your subject property's square footage
5. Each comp is graded (A–F) based on similarity to your subject

> **Important:** Only use standard retail (arms-length) sales. Never use foreclosures, short sales, or auction sales as comps.

Alternatively, use the **ARV Override** field if you already have an appraiser's value or BPO.

### Step 4: Configure Financing
In the **Financing** section:
- Toggle between **Cash** and **Financed** purchase
- For financed deals, enter: loan amount (or LTV percentage), interest rate, loan term, and origination points
- The calculator shows monthly payment, total interest, and total financing cost

### Step 5: Review Holding & Closing Costs
- **Holding costs** — Monthly expenses during the rehab period (taxes, insurance, utilities, loan payments)
- **Closing costs** — Buyer and seller closing costs, agent commissions, transfer taxes
- All costs are factored into the profitability calculation automatically

### Step 6: Read the Investor Report
The **Investor Report** section shows your complete deal analysis:
- **Deal Score** (0–100) with color-coded verdict (Excellent, Good, Marginal, Poor)
- **70% Rule** analysis — does the deal pass?
- **Net Profit** and **ROI** calculations
- **Cash-on-Cash Return** for financed deals
- **Cost basis vs. ARV** comparison

### Step 7: Save, Share, or Download
- **Save Deal** — Saves to the cloud database for access from any device
- **Share** — Generates a unique URL to share the full analysis with partners or lenders
- **Download PDF** — Creates a professional investor report in PDF format
- **Email** — Sends the report summary to any email address`,
      },
      {
        id: 'l-9-2',
        title: 'SOW Templates & Rehab Estimation',
        duration: '25 min',
        content: `## SOW Templates & Rehab Estimation

Accurate rehab estimation is the difference between a profitable flip and a money pit. This lesson covers the Scope of Work (SOW) Templates and how to use them effectively.

### Accessing SOW Templates
Navigate to **SOW Templates** from the top navigation. You'll find 104 professional renovation templates organized by room category.

### Room Categories
The templates cover 14 room/phase categories:
1. **Kitchen** — Cabinets, countertops, backsplash, appliances, lighting
2. **Master Bathroom** — Vanity, toilet, tub/shower, tile, fixtures
3. **Full Bathroom** — Complete bathroom renovation scope
4. **Half Bathroom** — Powder room updates
5. **Living Room** — Flooring, paint, baseboards, lighting
6. **Bedroom** — Flooring, paint, closet systems
7. **Landscaping** — Curb appeal, fencing, exterior
8. **Roof & Gutter** — Roof replacement, gutter systems
9. **Garage** — Door, floor coating, paint
10. **Electrical** — Panel upgrades, outlets, switches
11. **Plumbing** — Water heater, supply lines
12. **HVAC** — Furnace, AC, ductwork, thermostat
13. **Structural** — Foundation, framing, windows, insulation
14. **Demo & Cleanup** — Dumpsters, demolition, staging

### Material Tiers
Each template offers three material tiers:
- **Rental Grade** — Builder-grade materials for investment/rental properties. Lowest cost, functional but basic.
- **Standard** — Mid-range materials for typical homebuyer neighborhoods. Best value for most flips.
- **Luxury** — High-end finishes for upscale neighborhoods. Highest cost, premium appearance.

> **Rule of thumb:** Match your material tier to the neighborhood. Don't put luxury finishes in a $150K neighborhood, and don't put rental grade in a $500K neighborhood.

### Home Depot Product Links
Every line item includes a direct link to the actual Home Depot product with real SKU numbers and current pricing. Click any product name to open the product page and verify pricing or order materials.

### Regional Cost Adjustments
All costs automatically adjust based on your selected metro market. The regional indicator shows separate material and labor multipliers. For example, San Francisco adds +15% to materials and +55% to labor, while Dallas subtracts -5% from materials and -10% from labor.

### Using SOW Templates with the Deal Analyzer
The SOW Templates page and the Deal Analyzer share the same market selector. When you select a market on either page, it syncs automatically. Use the SOW Templates to build detailed cost estimates, then apply those estimates in the Deal Analyzer.

### Tips for Accurate Rehab Estimation
- Always walk the property before finalizing your rehab budget
- Add a 10–15% contingency for unexpected issues
- Get contractor bids to validate your estimates
- Use the detailed SOW (not quick estimate) for deals you plan to pursue
- Print the SOW to hand to contractors for accurate bidding`,
      },
      {
        id: 'l-9-3',
        title: 'Portfolio Dashboard & Deal Management',
        duration: '20 min',
        content: `## Portfolio Dashboard & Deal Management

Once you start saving deals, the Portfolio Dashboard and Saved Deals page become your command center for tracking and managing your entire deal pipeline.

### Saving Deals to the Cloud
After analyzing a property in the Deal Analyzer, click the **Save Deal** button in the Investor Report section. Your deal is saved to the cloud database with all property details, comps, rehab estimates, financing terms, and photos. You can access saved deals from any device.

### The Saved Deals Page
Navigate to **Saved Deals** from the top navigation. Here you can:

**View Modes:**
- **Card View** — Visual cards showing property details, metrics, and status badges
- **Table View** — Compact spreadsheet-style view for comparing many deals at once

**Deal Status Pipeline:**
Track each deal through your pipeline by setting its status:
- **Active** — Currently evaluating
- **Under Contract** — Signed purchase agreement
- **Closed** — Deal completed
- **Passed** — Decided not to pursue
- **Archived** — Stored for reference

**Inline Notes:**
Click the sticky note icon on any deal card to expand a notes area. Type your notes and they auto-save to the database. Use notes to track:
- Seller contact information and motivation
- Contractor bid amounts
- Inspection findings
- Next steps and follow-up dates

**Sorting & Filtering:**
- Search by address
- Sort by ROI, profit, deal score, price, or date
- Filter by status (Active, Under Contract, etc.)
- Filter by verdict (Excellent, Good, Marginal, Poor)

### The Portfolio Dashboard
Navigate to **Portfolio** from the top navigation. The dashboard shows:

**KPI Cards:** Total Deals, Total Invested, Projected Profit, Average ROI

**Date Range Filtering:** Filter everything by All Time, Last 7/30/90 Days, This Quarter, This Year, or a custom date range. All metrics, charts, and the deal table update instantly.

**Charts:**
- ROI Distribution doughnut chart
- Profit by Deal bar chart

**Financial Summary Grid:** Detailed breakdown of total purchase, rehab, ARV, financing costs, holding costs, closing costs, net profit, and average deal score.

**Portfolio Summary PDF:** Click Download PDF to generate a branded report with all metrics, charts, and a full deal table. Use this for investor meetings, lender presentations, or personal record-keeping.

### Tips
- Save every deal you analyze — even passes. This builds your market knowledge database.
- Update statuses as deals progress through your pipeline
- Use date range filtering to track monthly or quarterly performance
- Download the Portfolio PDF before meeting with lenders or partners`,
      },
      {
        id: 'l-9-4',
        title: 'Property Photos, Sharing & PDF Reports',
        duration: '20 min',
        content: `## Property Photos, Sharing & PDF Reports

This lesson covers how to document properties with photos, share deal analyses with partners and lenders, and generate professional PDF reports.

### Uploading Property Photos
1. In the Deal Analyzer, scroll to the **Property Photos** section (below the Investor Report)
2. Click the upload area or drag and drop image files
3. Supported formats: JPEG, PNG, WebP (max 10 MB per file)
4. Upload multiple photos at once — they process in parallel
5. Add captions by clicking the pencil icon below each photo
6. Click any photo to open the full-screen lightbox viewer

### Sharing a Deal
1. In the Investor Report section, click the **Share** button
2. The app generates a unique shareable URL and copies it to your clipboard
3. Send the link to anyone — they can view the full analysis without logging in
4. The shared link includes all property details, comps, rehab costs, financing, profitability metrics, and photos

### Downloading a PDF Report
1. Click **Download PDF** in the Investor Report section
2. A new tab opens with a professionally formatted report
3. Use Ctrl+P (Windows) or Cmd+P (Mac) to save as PDF
4. The PDF includes property overview, financial summary, comps, rehab breakdown, photos, and deal score

### Emailing a Report
1. Click the **Email** button in the Investor Report section
2. Enter the recipient's email address
3. The app sends a branded email with key metrics and a link to the full analysis

### When to Use Each Sharing Method

| Method | Best For | Recipient Gets |
|--------|----------|----------------|
| **Share Link** | Partners, co-investors | Interactive web page with all details |
| **PDF Download** | Lenders, formal presentations | Professional document for printing or emailing |
| **Email** | Quick updates to team members | Summary email with link to full analysis |
| **Portfolio PDF** | Investor meetings, track record | Aggregate performance across all deals |

### Tips
- Upload photos immediately after property visits
- Use descriptive captions ("Kitchen — water damage behind dishwasher")
- Share deal links with your lender when applying for financing
- Include PDFs in your credibility packet
- Before/after photos are powerful for building your investing reputation`,
      },
      {
        id: 'l-9-5',
        title: 'Marketing, Contracts & Lender Tools',
        duration: '25 min',
        content: `## Marketing, Contracts & Lender Tools

The Freedom One platform includes a complete suite of business tools beyond deal analysis. This lesson covers the marketing templates, contract templates, and lender directory.

### Marketing Templates
Navigate to **Marketing** from the top navigation. You'll find ready-to-use templates for:

**Direct Mail:**
- Handwritten-style letters for absentee owners
- Postcards for probate, pre-foreclosure, and high-equity leads
- Yellow letters and professional investor letters

**Email Sequences:**
- 5-email drip campaigns for cold leads
- Follow-up sequences for warm leads
- Seller nurture campaigns

**Cold Call Scripts:**
- Initial contact scripts for different seller situations
- Objection handling responses
- Follow-up call frameworks

**How to use:** Browse templates by category, customize with your business name and contact info, then deploy through your preferred marketing channel.

### Contract Templates
Navigate to **Contracts** from the top navigation. Available templates include:

- **Assignable Purchase Agreement** — Standard purchase contract with "and/or assigns" language for wholesaling
- **Wholesale Assignment Contract** — Contract to assign your purchase rights to an end buyer
- **Joint Venture Agreement** — Partnership structure for co-investing on deals
- **Contractor Agreement** — Scope of work contract for hiring contractors

> **Important:** All contract templates must be reviewed by a licensed real estate attorney in your state before use. Laws vary by state and these templates are starting points, not legal advice.

### Lender Directory
Navigate to **Lenders** from the top navigation. The directory includes:

- Hard money lenders with rates, LTV ranges, and terms
- Private lenders and portfolio lenders
- DSCR loan providers for rental properties
- Geographic coverage (which states each lender serves)
- Direct contact information (phone, email, website)

**How to use:** Browse the full list or filter by loan type, state, or rate range. Contact 2–3 lenders to compare terms before committing.

### Credibility Packets
Navigate to **Credibility Packets** from the navigation. These are professional documents you can customize and present to:
- Lenders (to get approved for financing)
- Sellers (to prove you're a serious buyer)
- Partners (to attract co-investors)

### Checklists
Navigate to **Checklists** from the navigation. Available checklists:
- **Due Diligence Checklist** — Everything to verify before buying
- **Closing Checklist** — Steps from contract to closing table
- **Rehab Checklist** — Room-by-room renovation tracking
- **Selling Checklist** — Preparing and listing your finished flip

### Tips
- Customize marketing templates with your business branding before sending
- Always have an attorney review contracts before use
- Build relationships with 2–3 lenders for competitive terms
- Use credibility packets when meeting new partners or lenders for the first time
- Print checklists and bring them to property walkthroughs`,
      },
      {
        id: 'l-9-6',
        title: 'State Guide, Contractors & Additional Tools',
        duration: '20 min',
        content: `## State Guide, Contractors & Additional Tools

This final lesson covers the remaining tools in the Freedom One platform that help you invest smarter and more efficiently.

### State Guide
Navigate to **State Guide** from the navigation. This tool provides state-by-state information on:
- Real estate investing regulations and requirements
- Licensing requirements for wholesaling and flipping
- Disclosure requirements when selling
- Foreclosure process (judicial vs. non-judicial)
- Transfer taxes and closing customs
- Landlord-tenant laws (for rental exit strategies)

**How to use:** Select your state from the dropdown to view all relevant regulations. If you invest in multiple states, compare the rules side by side.

### Contractor Management
Navigate to **Contractors** from the navigation. This tool helps you:
- **Add contractors** with name, specialty, phone, email, and notes
- **Track performance** — rate contractors after each project
- **Organize by trade** — General contractors, electricians, plumbers, HVAC, roofers, etc.
- **Store documents** — Keep license numbers, insurance certificates, and W-9s on file

**Tips for managing contractors:**
- Always get 3 bids for every project
- Verify license and insurance before hiring
- Use the SOW Templates to provide clear scope of work for bidding
- Pay in draws tied to completion milestones, never upfront
- Document everything with photos (use the Property Photos feature)

### Quick Check Tool
Navigate to **Quick Check** from the navigation. This is your rapid deal screening tool:
1. Enter basic property details: address, purchase price, estimated ARV, estimated rehab
2. Get instant 70% Rule analysis, MAO calculation, and estimated profit/ROI
3. If the deal passes, click **Full Analysis** to open it in the Deal Analyzer

**When to use:** Screen 10–20 leads per day from wholesaler emails, MLS alerts, or driving for dollars. Only move promising deals to the full analyzer.

### Renovation Designer
Navigate to **Renovation Designer** from the navigation. This visual tool helps you:
- Browse design styles for each room type
- Compare material finishes and their costs
- Plan your rehab aesthetic before starting construction
- Ensure your design choices match the neighborhood price point

### Property Listings
Navigate to **Listings** from the navigation. List your properties for sale with:
- Photo galleries with multiple images
- Property features and specifications
- Pricing and status tracking (Active, Pending, Sold)
- Contact information for interested buyers

### Blog & Resources
Navigate to **Blog** from the navigation for:
- Market analysis articles and trends
- Deal breakdown case studies
- Rehab tips and construction best practices
- Financing strategy guides
- Legal updates affecting investors

### Getting the Most Out of Freedom One
1. **Start with the course** — Complete all 9 modules to build your knowledge foundation
2. **Practice with Quick Check** — Screen 50+ deals to develop your analysis instincts
3. **Deep-dive with the Analyzer** — Do full analysis on your top 5–10 deals
4. **Save everything** — Build your market knowledge database in the cloud
5. **Use the Portfolio Dashboard** — Track your performance over time
6. **Share with confidence** — Use professional reports and shared links to build credibility
7. **Read the User Manual** — The Manual page has detailed instructions for every feature
8. **Stay current** — Check the Blog for market updates and new strategies

### 🥷 Ninja Tips: Platform Mastery

1. **Run Quick Check on every lead within 60 seconds** — The moment you get a lead (wholesaler email, MLS alert, driving for dollars), open Quick Check and punch in the numbers. If it doesn't pass the 70% rule in 60 seconds, move on. Speed-screening prevents analysis paralysis.

2. **Save EVERY deal you analyze** — Even deals you pass on. In 6 months, you'll have a database of 50-100 analyzed deals in your market. This becomes your personal comp database and market intelligence system. You'll spot trends before anyone else.

3. **Share your analysis with your lender** — Before asking for money, send your lender a Freedom One deal analysis PDF. It shows you're professional, data-driven, and serious. Lenders fund investors who do their homework, not investors who say "trust me, it's a good deal."

4. **Use the Pipeline for accountability** — Move every deal through the pipeline stages: Lead → Analyzing → Offer Made → Under Contract → Rehab → Listed → Closed. This visual workflow prevents deals from falling through the cracks and shows you exactly where your bottleneck is.

5. **Review your Portfolio Dashboard monthly** — Set a calendar reminder to review your portfolio on the 1st of every month. Track your average profit per deal, average days to close, and total ROI. These numbers tell you if you're improving or stagnating.`,
      },
    ],
  },
  {
    id: 'mod-10',
    number: 10,
    title: 'Bonus: Asset Protection for Real Estate Investors',
    description: 'Protect your wealth with proper entity structures, trusts, and tax-advantaged accounts. Elite exclusive content.',
    icon: '🛡️',
    premium: true,
    requiredTier: 'elite',
    lessons: [
      {
        id: 'l-10-1',
        title: 'Entity Structures: LLCs, Series LLCs & Corporations',
        duration: '30 min',
        content: `## Entity Structures for Real Estate Investors

Proper entity structure is the foundation of asset protection. Without it, a single lawsuit from a slip-and-fall at one of your properties could wipe out everything you own.

### Why Entity Structure Matters

As a real estate investor, you face unique liability risks:
- Tenant injuries on your properties
- Contractor disputes and mechanic's liens
- Environmental issues (lead paint, mold, asbestos)
- Fair housing violations
- Construction defects on flips you've sold

Without proper entity structure, your personal assets (home, savings, retirement accounts) are exposed to all of these risks.

### LLC (Limited Liability Company)

The LLC is the most popular entity for real estate investors.

**Key Benefits:**
- Separates personal assets from business liabilities
- Pass-through taxation (no double taxation)
- Flexible management structure
- Relatively inexpensive to form ($50-$500 per state)
- Can be single-member or multi-member

**Best Practices:**
- Maintain a separate bank account for each LLC
- Never co-mingle personal and business funds
- Keep proper records (operating agreement, meeting minutes)
- File annual reports and pay franchise taxes on time
- Maintain adequate insurance in addition to the LLC

### Series LLC

Available in select states (TX, DE, IL, NV, WY, and others), the Series LLC allows you to create separate "series" within a single LLC.

**How It Works:**
- Each property goes into its own series
- Each series has its own assets, liabilities, and members
- Liability in one series does NOT affect other series
- One filing fee, one annual report, one tax return

**Example Structure:**
| Series | Property | Value |
|--------|----------|-------|
| Series A | 123 Main St (Rental) | $200,000 |
| Series B | 456 Oak Ave (Flip) | $175,000 |
| Series C | 789 Pine Dr (STR) | $250,000 |

If a tenant sues over Series A, they can only reach the assets in Series A. Series B and C are protected.

**Limitations:**
- Not recognized in all states
- Some lenders won't lend to a Series LLC
- Court precedent is still developing
- May need a separate LLC in states that don't recognize Series LLCs

### The Multi-LLC Strategy

For investors in states without Series LLCs, use multiple LLCs:

**Recommended Structure:**
1. **Management LLC** — Owns no property. Manages all other LLCs. Collects management fees.
2. **Property LLC #1** — Owns Property A
3. **Property LLC #2** — Owns Property B
4. **Holding LLC** — Owns long-term rental properties
5. **Flipping LLC** — Buys and sells flip properties

**Cost:** $500-$1,500 per LLC to form + $100-$800/year per LLC for annual filings. Worth every penny when you have $500K+ in real estate assets.

### S-Corporation Election

For active flippers doing 3+ deals per year, an S-Corp election can save significant taxes:

- Pay yourself a "reasonable salary" (subject to payroll taxes)
- Take remaining profits as distributions (NOT subject to self-employment tax)
- Potential savings: $5,000-$15,000+ per year on self-employment taxes
- Requires more complex tax filing (Form 1120-S)

**Example:**
| Without S-Corp | With S-Corp |
|----------------|-------------|
| Flip profit: $100,000 | Flip profit: $100,000 |
| SE tax (15.3%): $15,300 | Salary: $50,000 |
| | Payroll tax: $7,650 |
| | Distribution: $50,000 |
| | Distribution tax: $0 |
| **Total tax on SE: $15,300** | **Total tax on SE: $7,650** |
| | **Savings: $7,650** |

### 🥷 Ninja Tips: Entity Structure

1. **Form your LLC in your home state, not Delaware or Wyoming** — Unless you have a specific reason, forming in your home state is cheaper and simpler. You'd need a registered agent AND a foreign LLC filing in your home state anyway if you form elsewhere.

2. **Get an Operating Agreement even for single-member LLCs** — Without one, courts may "pierce the corporate veil" and treat your LLC as if it doesn't exist. A $200 attorney-drafted operating agreement protects your entire portfolio.

3. **Use a separate EIN for each LLC** — Never use your SSN for business accounts. Each LLC should have its own EIN (free from IRS.gov) and its own bank account.`,
      },
      {
        id: 'l-10-2',
        title: 'Trusts for Real Estate: Land Trusts, Living Trusts & More',
        duration: '25 min',
        content: `## Trusts for Real Estate Investors

Trusts are powerful tools for privacy, asset protection, estate planning, and creative deal structuring.

### Land Trusts

A land trust holds title to real property with a trustee (often a title company or attorney) as the legal owner, while you (the beneficiary) control and benefit from the property.

**Key Benefits:**
- **Privacy** — Your name doesn't appear in public records. The trust name is on the deed.
- **Avoids due-on-sale triggers** — Transferring property into a land trust generally does not trigger the due-on-sale clause (protected by the Garn-St. Germain Act)
- **Easy transfers** — Change beneficiaries without recording a new deed
- **Avoids probate** — Property in a trust passes outside of probate

**How to Use Land Trusts:**
1. Create the trust document naming yourself as beneficiary and a trustee
2. Deed the property into the trust
3. Record the deed with the county
4. The trust holds title; you control and benefit from the property

**Best For:**
- Subject-to deals (privacy from lenders)
- Properties in your personal name that you want to protect
- Multi-property portfolios where you want privacy

### Revocable Living Trust

A revocable living trust is primarily an estate planning tool, but it has real benefits for investors.

**Key Benefits:**
- **Avoids probate** — Properties pass to heirs without court involvement
- **Privacy** — Unlike a will, trusts are not public record
- **Incapacity planning** — If you become incapacitated, your successor trustee manages your properties
- **Control** — You maintain full control during your lifetime

**For Investors With 5+ Properties:**
A living trust is essential. Without one, your heirs face months or years of probate court to access your properties. During that time, properties may go unmaintained, tenants may stop paying, and value erodes.

### Irrevocable Trust

An irrevocable trust removes assets from your estate permanently.

**Key Benefits:**
- **Lawsuit protection** — Assets in an irrevocable trust are generally beyond the reach of creditors
- **Estate tax reduction** — Removes assets from your taxable estate
- **Medicaid planning** — Assets transferred 5+ years before application may be protected

**Drawbacks:**
- You give up control of the assets
- Cannot easily be changed or revoked
- Complex and expensive to set up ($2,000-$5,000+)

**Best For:** Investors with $1M+ in real estate assets who want maximum protection.

### Trust + LLC Layering Strategy

The most sophisticated investors combine trusts and LLCs:

**Structure:**
1. **Revocable Living Trust** — Owns the membership interests of your LLCs
2. **Management LLC** — Manages all property LLCs
3. **Property LLCs** — Each owns individual properties

**Result:** Privacy (trust), liability protection (LLCs), estate planning (trust avoids probate), and operational efficiency (management LLC).

### 🥷 Ninja Tips: Trusts

1. **Name your land trusts generically** — Use names like "123 Main Street Trust" or "Oak Avenue Trust" instead of "John Smith Family Trust." Generic names provide maximum privacy.

2. **Use a corporate trustee for land trusts** — Using yourself as trustee defeats the privacy purpose. Use your attorney, a title company, or a trust company as trustee.

3. **Review your trust every 3 years** — Laws change, your portfolio grows, and your estate plan needs to keep up. Schedule a review with your estate planning attorney every 3 years.`,
      },
      {
        id: 'l-10-3',
        title: 'Self-Directed IRA & 401(k) Real Estate Investing',
        duration: '30 min',
        content: `## Investing in Real Estate with Your IRA & 401(k)

Most people don't know that you can use your retirement accounts to invest in real estate. Self-directed accounts allow you to buy properties, fund loans, and participate in real estate deals — all with tax-advantaged dollars.

### What Is a Self-Directed IRA (SDIRA)?

A Self-Directed IRA is a retirement account that allows you to invest in alternative assets, including real estate, private loans, tax liens, and more.

**Types of SDIRAs:**
| Type | Tax Treatment | Contribution Limit (2026) |
|------|--------------|---------------------------|
| Traditional SDIRA | Tax-deductible contributions, taxed on withdrawal | $7,000 ($8,000 if 50+) |
| Roth SDIRA | After-tax contributions, TAX-FREE withdrawals | $7,000 ($8,000 if 50+) |
| SEP SDIRA | Employer contributions, taxed on withdrawal | Up to $69,000 |
| Solo 401(k) | Both employee + employer contributions | Up to $69,000 ($76,500 if 50+) |

### How SDIRA Real Estate Investing Works

1. **Open a SDIRA** with a custodian that allows real estate (Equity Trust, Directed IRA, Entrust, Alto IRA)
2. **Fund the account** via contribution, rollover from existing IRA/401(k), or transfer
3. **Find a deal** using the same strategies you've learned in this course
4. **Direct your custodian** to purchase the property on behalf of your IRA
5. **All income and expenses flow through the IRA** — rent comes in, expenses go out, all within the account
6. **When you sell**, profits stay in the IRA (tax-deferred or tax-free for Roth)

### The Power of a Roth SDIRA

Imagine buying a property for $100,000 in your Roth SDIRA, rehabbing it for $30,000, and selling it for $200,000. That's $70,000 in profit — **completely tax-free.** Forever. No capital gains tax, no income tax, nothing.

**Example:**
| Scenario | Traditional IRA | Roth IRA |
|----------|----------------|----------|
| Purchase price | $100,000 | $100,000 |
| Rehab cost | $30,000 | $30,000 |
| Sale price | $200,000 | $200,000 |
| Profit | $70,000 | $70,000 |
| Tax on withdrawal (25%) | $17,500 | **$0** |
| Net profit | $52,500 | **$70,000** |

### Solo 401(k) Advantage

If you're self-employed (which most active investors are), a Solo 401(k) offers:
- **Higher contribution limits** ($69,000+ per year vs. $7,000 for IRA)
- **Loan provision** — Borrow up to $50,000 from your own account for any purpose
- **Roth option** — Designate contributions as Roth for tax-free growth
- **Checkbook control** — Some Solo 401(k) plans allow you to write checks directly from the account, eliminating custodian delays

### Critical Rules (Prohibited Transactions)

The IRS has strict rules about SDIRA real estate investing. Violating them can disqualify your entire IRA:

**You CANNOT:**
- Live in or vacation at a property owned by your IRA
- Use the property for personal benefit in any way
- Hire yourself or family members to work on the property
- Buy property from or sell property to yourself or family members ("disqualified persons")
- Use personal funds to pay IRA property expenses (or vice versa)
- Provide personal guarantees on IRA property loans

**Disqualified Persons Include:**
- You, your spouse, your parents, your children, and their spouses
- Any entity you own 50%+ of
- Your IRA custodian or administrator

**Penalty for Violation:** The entire IRA is treated as distributed, triggering income tax + 10% early withdrawal penalty on the full balance.

### SDIRA Real Estate Strategies

1. **Buy and hold rentals** — Purchase rental properties, collect rent into your IRA, and build tax-free wealth
2. **Fix and flip** — Buy, rehab, and sell properties within your IRA (note: may trigger UBIT tax)
3. **Private lending** — Use your IRA to fund hard money loans to other investors at 8-12% interest
4. **Tax lien investing** — Buy tax liens and earn 8-36% returns depending on the state
5. **Wholesale** — Use your IRA to fund earnest money deposits and collect assignment fees

### UBIT (Unrelated Business Income Tax)

If your IRA uses debt financing (mortgage) to buy property, a portion of the income may be subject to UBIT. This applies to:
- Rental income from leveraged properties
- Capital gains from selling leveraged properties

**Workaround:** Buy properties with all cash in your IRA, or use a Solo 401(k) (which is exempt from UBIT on leveraged real estate).

### 🥷 Ninja Tips: IRA Investing

1. **Start a Roth conversion ladder NOW** — Even if your Roth IRA is small, start converting Traditional IRA funds to Roth each year (pay the tax now). In 5-10 years, you'll have a substantial Roth balance to invest in real estate completely tax-free.

2. **Use your SDIRA for private lending first** — Before buying property in your IRA, start by lending money to other investors at 8-12% interest. This builds your IRA balance without the complexity of property management. Once you have $100K+, buy your first IRA property.

3. **Partner your IRA with your personal funds** — Your IRA can co-invest with you on a deal. Example: IRA puts up 60% of the purchase price, you put up 40%. Profits split proportionally. This lets you do bigger deals than either account could handle alone. (Consult your custodian for proper structuring.)

4. **Keep 6 months of expenses in your IRA as cash** — IRA properties need repairs, vacancies happen, and taxes come due. If your IRA doesn't have cash to cover expenses, you can't use personal funds (prohibited transaction). Always maintain a cash buffer.`,
      },
    ],
  },
  {
    id: 'mod-11',
    number: 11,
    title: 'Bonus: Creative Financing Mastery',
    description: 'Advanced deal structures that let you buy properties with little to no money down. Elite exclusive content.',
    icon: '🎯',
    premium: true,
    requiredTier: 'elite',
    lessons: [
      {
        id: 'l-11-1',
        title: 'Seller Financing: Structuring Win-Win Deals',
        duration: '25 min',
        content: `## Seller Financing: The Ultimate Creative Tool

Seller financing (also called "owner financing" or "owner carry") is when the seller acts as the bank. Instead of getting a traditional mortgage, you make payments directly to the seller.

### Why Sellers Agree to Finance

Sellers agree to finance for several reasons:
- **Higher sale price** — Sellers can often get a higher price by offering financing
- **Monthly income stream** — Retirees love predictable monthly payments
- **Tax benefits** — Installment sale spreads capital gains over multiple years
- **Faster sale** — No bank approval means faster closing
- **Interest income** — Sellers earn 6-10% interest vs. 1-2% in a savings account

### Seller Financing Structures

**1. Full Seller Carry**
- Seller finances 100% of the purchase price
- You make monthly payments (principal + interest) to the seller
- Typical terms: 10-30 year amortization, 5-7 year balloon

**2. Partial Seller Carry (Second Position)**
- Bank finances 70-80% (first mortgage)
- Seller finances 10-20% (second mortgage)
- You bring 5-10% down payment
- Reduces your out-of-pocket cash significantly

**3. Wrap-Around Mortgage ("Wrap")**
- Seller has an existing mortgage at 3.5%
- You create a new mortgage at 7% that "wraps around" the existing one
- You pay the seller at 7%; seller continues paying their 3.5% mortgage
- Seller profits from the interest rate spread

**Example:**
| Item | Amount |
|------|--------|
| Property value | $300,000 |
| Existing mortgage | $200,000 at 3.5% |
| Your wrap mortgage | $280,000 at 7% |
| Your monthly payment to seller | $1,863 |
| Seller's existing payment | $898 |
| Seller's monthly profit | $965 |
| Your down payment | $20,000 |

### Key Terms to Negotiate

| Term | Investor-Friendly | Seller-Friendly |
|------|-------------------|------------------|
| Interest rate | 4-6% | 8-10% |
| Down payment | 0-5% | 15-20% |
| Amortization | 30 years | 15 years |
| Balloon | 7-10 years | 3-5 years |
| Prepayment penalty | None | 1-3% |

### How to Approach Sellers About Financing

Never lead with "Will you finance the deal?" Instead:

1. **Ask about their goals** — "What are you planning to do with the proceeds from the sale?"
2. **If they say retirement/income** — "What if I could give you a guaranteed monthly income at a better rate than any bank CD, secured by this property?"
3. **If they say pay off debt** — "What if we structured a deal where you get a large down payment to pay off your debts, plus monthly income for the next 10 years?"
4. **Present it as THEIR benefit** — Tax advantages, higher price, guaranteed income, no maintenance headaches

### Legal Requirements

- Use a real estate attorney to draft the promissory note and mortgage/deed of trust
- Record the mortgage with the county
- Use a loan servicing company to handle payments (creates a paper trail)
- Comply with Dodd-Frank rules (may require a Residential Mortgage Loan Originator for owner-occupied properties)
- Title insurance is still required

### 🥷 Ninja Tips: Seller Financing

1. **Target free-and-clear properties** — Sellers with no mortgage have maximum flexibility. Search county records for properties with no recorded liens. These owners can finance 100% of the deal.

2. **Offer a higher price for better terms** — "I'll pay your full asking price of $250,000 if you'll finance it at 5% with 10% down." Sellers focus on price; you focus on terms. A higher price with great terms often beats a lower price with cash.

3. **Use a "substitution of collateral" clause** — This allows you to swap the property securing the loan with a different property. Useful when you want to refinance or sell the original property but keep the seller financing in place.`,
      },
      {
        id: 'l-11-2',
        title: 'Lease Options, Private Money & Advanced Structures',
        duration: '30 min',
        content: `## Advanced Creative Financing Structures

### Lease Options (Rent-to-Own)

A lease option gives you the right (but not the obligation) to purchase a property at a predetermined price within a specified timeframe.

**Two Components:**
1. **Lease Agreement** — Standard rental agreement with monthly payments
2. **Option Agreement** — Gives you the exclusive right to buy at a set price

**How It Works:**
1. Negotiate a lease with the property owner (1-3 year term)
2. Pay an "option consideration" fee ($2,000-$10,000) for the right to buy
3. Agree on a future purchase price (typically today's market value or slightly above)
4. Make monthly lease payments (portion may credit toward purchase)
5. Exercise your option to buy before expiration, or walk away

**Lease Option Strategies:**

**Strategy 1: Sandwich Lease Option**
- Lease-option a property from the owner
- Sub-lease-option it to a tenant-buyer at a higher price and higher monthly payment
- Profit from the monthly spread AND the price spread when the tenant-buyer exercises

**Example:**
| Your Lease Option | Tenant-Buyer's Lease Option |
|-------------------|-----------------------------|
| Purchase price: $200,000 | Purchase price: $225,000 |
| Monthly payment: $1,200 | Monthly payment: $1,600 |
| Option fee paid: $3,000 | Option fee received: $7,000 |
| | Monthly spread: $400 |
| | Price spread: $25,000 |

**Strategy 2: Lease Option for Flips**
- Lease-option a property that needs work
- Rehab during the lease period
- Exercise the option and sell at full market value
- Advantage: You control the property without owning it during rehab

### Private Money Lending

Private money comes from individuals (not institutions) who want to earn better returns on their capital.

**Where to Find Private Money:**
- Friends and family (start here)
- Fellow investors at REIA meetings
- Professionals (doctors, lawyers, business owners) with idle capital
- Self-directed IRA holders looking for returns
- Online platforms (Fund That Flip, PeerStreet)

**Structuring Private Money Deals:**

| Structure | Description | Typical Terms |
|-----------|-------------|---------------|
| Straight loan | Lender provides capital, you pay interest + principal | 8-12% interest, 6-24 months |
| Equity partnership | Lender provides capital, shares in profits | 50/50 or 60/40 split |
| Preferred return | Lender gets fixed return first, then profit split | 8-10% preferred + 50% of remaining |
| Joint venture | Both parties contribute (capital + expertise) | Negotiable split |

**The Private Money Pitch:**
1. Lead with THEIR return: "I have an opportunity for you to earn 10% annually, secured by real property"
2. Show your track record (use Freedom One Credibility Packets)
3. Explain the security: first-position lien on the property, title insurance, hazard insurance
4. Present a specific deal with numbers (use Freedom One Deal Analyzer PDF)
5. Offer references from previous lenders or partners

### Deal Stacking: Combining Multiple Financing Sources

The most creative investors combine multiple financing sources on a single deal:

**Example: Zero-Down Flip**
| Source | Amount | Terms |
|--------|--------|-------|
| Hard money (1st position) | $120,000 (80% of purchase) | 11%, 12 months |
| Private money (2nd position) | $30,000 (20% of purchase) | 10%, 12 months |
| Hard money rehab draw | $40,000 | Included in 1st |
| **Total funded** | **$190,000** | |
| **Your cash in** | **$0** | |

**Result:** You control a $150K property with $40K in rehab, sell for $250K, and your only cost is interest payments. All financing is repaid at closing.

### Subject-To + Wrap + Lease Option Combo

The most advanced creative financing structure:

1. **Buy subject-to** the existing mortgage (3.5% rate)
2. **Create a wrap mortgage** at 7% and sell to a buyer on owner financing
3. **Or lease-option** to a tenant-buyer at a higher monthly payment
4. **Profit from the spread** between what you pay (3.5%) and what you receive (7%)

**Example:**
| Layer | Payment | Rate |
|-------|---------|------|
| Existing mortgage (you pay) | $898/month | 3.5% |
| Wrap mortgage (buyer pays you) | $1,663/month | 7.0% |
| **Monthly cash flow** | **$765/month** | |
| **Annual cash flow** | **$9,180** | |

Plus you receive a down payment of $20,000-$40,000 upfront.

### 🥷 Ninja Tips: Creative Financing

1. **Always get the deed** — In any creative deal (subject-to, seller financing, wrap), make sure you get the deed recorded in your name (or your entity's name). Controlling payments without the deed is risky. The deed is your security.

2. **Use a loan servicing company** — For $15-$25/month, a loan servicing company (e.g., FCI Lender Services) handles payment collection, escrow, tax reporting, and creates a professional paper trail. This protects you legally and makes your operation look institutional.

3. **The "terms" vs. "price" framework** — In every negotiation, remember: the seller controls the price, you control the terms. If a seller insists on full price, agree — but negotiate 0% interest, 30-year amortization, and no down payment. The terms determine your actual cost, not the sticker price.

4. **Build a "capital stack" spreadsheet** — For every deal, create a simple spreadsheet showing every source of funds, the cost of each source, and the total blended cost of capital. This tells you instantly whether a deal works and which financing source to optimize.

5. **Start with one creative strategy and master it** — Don't try to learn seller financing, subject-to, wraps, and lease options all at once. Pick one, do 3-5 deals with it, then add the next strategy. Mastery beats variety every time.`,
      },
    ],
  },
];
