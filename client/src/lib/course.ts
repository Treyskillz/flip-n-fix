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
  {
    id: 'mod-9',
    number: 9,
    title: 'Mastering the Freedom One Platform',
    description: 'Complete hands-on tutorials for every tool in the Freedom One Fix & Flip Analyzer — from deal analysis to portfolio management.',
    icon: '💻',
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
8. **Stay current** — Check the Blog for market updates and new strategies`,
      },
    ],
  },
];
