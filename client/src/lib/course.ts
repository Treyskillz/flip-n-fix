// ============================================================
// Fix & Flip Mastery 2026 — Course Content
// Comprehensive course on fix & flip with all exit strategies
// ============================================================

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: CourseLesson[];
  icon: string;
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
- Market properties effectively for maximum sale price`,
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

This separation provides additional liability protection and tax planning flexibility.`,
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
5. **Courthouse Steps** — Meet other investors at foreclosure auctions`,
      },
    ],
  },
  {
    id: 'mod-2',
    number: 2,
    title: 'Finding Deals: Acquisition Strategies',
    description: 'Master the art of finding profitable properties before anyone else.',
    icon: '🔍',
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
- Contractors who see distressed properties daily`,
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
| Profit Margin | 10%+ of ARV |`,
      },
    ],
  },
  {
    id: 'mod-3',
    number: 3,
    title: 'Exit Strategy #1: Fix & Flip',
    description: 'The classic strategy — buy, renovate, and sell for profit.',
    icon: '🔨',
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
7. **Ignoring the timeline** — Every extra month costs you $2,000-4,000 in holding costs`,
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
- Be willing to negotiate on terms (closing date, inspections) to hold firm on price`,
      },
    ],
  },
  {
    id: 'mod-4',
    number: 4,
    title: 'Exit Strategy #2: Wholesaling',
    description: 'Profit from deals without ever owning the property. The lowest-risk entry into real estate investing.',
    icon: '🤝',
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
- Consult a real estate attorney in your state`,
      },
    ],
  },
  {
    id: 'mod-5',
    number: 5,
    title: 'Exit Strategy #3: Fix & Rent (BRRRR)',
    description: 'Buy, Rehab, Rent, Refinance, Repeat — build long-term wealth through rental properties.',
    icon: '🏘️',
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
- See our Lender Directory for DSCR lender options`,
      },
    ],
  },
  {
    id: 'mod-6',
    number: 6,
    title: 'Exit Strategy #4: Subject-To',
    description: 'Take over existing mortgages for creative, low-money-down acquisitions.',
    icon: '📋',
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
- Document everything — the seller should sign extensive disclosures`,
      },
    ],
  },
  {
    id: 'mod-7',
    number: 7,
    title: 'Exit Strategy #5: Short-Term Rentals (Airbnb/VRBO)',
    description: 'Maximize cash flow with vacation and short-term rental properties.',
    icon: '🏖️',
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
- Interview multiple managers and check reviews`,
      },
    ],
  },
  {
    id: 'mod-8',
    number: 8,
    title: 'Financing Your Deals',
    description: 'Master every financing option available to real estate investors in 2026.',
    icon: '💰',
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
- **Custodians:** Equity Trust, Directed IRA, Entrust`,
      },
    ],
  },
];
