// ============================================================
// Fix & Flip Analyzer — Comprehensive User Manual
// ============================================================

export interface ManualSection {
  id: string;
  title: string;
  icon: string;
  content: string;
}

export const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: 'overview',
    title: 'Getting Started',
    icon: '🚀',
    content: `## Welcome to the Fix & Flip Analyzer

The Fix & Flip Analyzer is a comprehensive real estate investment analysis system designed for investors, wholesalers, and flippers. It helps you evaluate potential deals by calculating profitability, estimating rehab costs, managing comparable sales, and determining the best exit strategy for each property.

### What You Can Do

- **Analyze any property** — Enter property details and get instant profitability calculations
- **Pull comparable sales** — Add comps manually to determine accurate ARV
- **Estimate rehab costs** — Use preset levels or detailed room-by-room scope of work with real material pricing
- **Regional cost adjustments** — Costs automatically adjust based on 50+ metro markets
- **Material tier selection** — Choose Rental, Standard, or Luxury grade materials
- **Visualize the rehab timeline** — Interactive Gantt chart shows project phases and dependencies
- **Calculate financing costs** — Hard money loan calculator with customizable terms
- **Track all costs** — Holding costs, closing costs, and financing all factored in
- **Profitability dashboard** — Real-time deal score, ROI, cash-on-cash return, and 70% rule analysis
- **Save and compare deals** — Save unlimited deals and compare them side by side
- **SOW Templates** — 104 professional renovation templates with photos and cost breakdowns
- **Lender Directory** — Curated hard money and private lender contacts
- **Marketing Templates** — Direct mail, postcards, email sequences, and cold call scripts
- **Contract Templates** — Assignable purchase agreements and wholesale contracts
- **Investor Course** — Complete education on 5 exit strategies
- **Property Listings** — List your properties for sale with photo galleries
- **Checklists** — Due diligence, closing, and rehab checklists
- **Credibility Packets** — Professional investor credibility materials
- **State Guide** — State-by-state real estate investing regulations
- **Contractor Management** — Track and manage your contractor relationships

### Quick Start Guide

1. Navigate to the **Deal Analyzer** from the home page
2. Enter the property address and details in the Subject Property section
3. Add comparable sales to determine the ARV
4. Select a rehab level or use the detailed scope of work
5. Configure financing terms and holding costs
6. Review the profitability dashboard for your deal score
7. Save the deal for future reference`,
  },
  {
    id: 'property',
    title: 'Subject Property',
    icon: '🏠',
    content: `## Entering Property Details

### Step 1: Address Information
Enter the complete property address including street, city, state, and ZIP code. The state and city are used to automatically determine regional cost adjustments for your rehab estimate.

### Step 2: Property Characteristics
- **Beds/Baths** — Affects scope of work calculations (bathroom count determines bathroom rehab costs)
- **Square Footage** — Critical for rehab cost calculations and ARV determination
- **Year Built** — Older homes typically need more extensive rehab
- **Lot Size** — Affects exterior/landscaping scope
- **Property Type** — Single Family, Townhouse, Condo, or Multi-Family
- **Garage** — Affects overall property value comparison

### Step 3: Purchase Price
Enter your actual or proposed purchase price. This is the price you will pay (or offer) for the property. All profitability calculations are based on this number.

### Regional Market Selector
The Deal Analyzer includes a **metro market selector** that syncs with the SOW Templates page. You can:
- **Auto-detect** — Enter a city and state, and the app automatically matches the closest metro market
- **Manual select** — Click the market dropdown to choose from 50+ metro areas and all 50 states + DC
- **View adjustments** — The regional indicator bar shows separate material and labor cost multipliers (e.g., "+15% materials | +55% labor" for San Francisco)
- **Sync across pages** — Your selected market persists in localStorage and automatically applies to both the Deal Analyzer and SOW Templates page

### Regional Cost Indicator
Once a market is selected, the app displays the regional cost adjustment factors. For example:
- **San Francisco, CA** — +35% overall (+15% materials, +55% labor)
- **Miami, FL** — -5% overall (+2% materials, -12% labor)
- **Dallas, TX** — -8% overall (-5% materials, -10% labor)
- **New York, NY** — +30% overall (+10% materials, +50% labor)`,
  },
  {
    id: 'comps',
    title: 'Comparable Sales',
    icon: '📊',
    content: `## Managing Comparable Sales (Comps)

Comparable sales (comps) are recently sold properties similar to your subject property. They are the foundation for determining your After Repair Value (ARV).

### Adding Comps Manually
Click "Add Comp" and enter:
- **Address** — The comp property address
- **Sale Price** — What it actually sold for
- **Sale Date** — When it closed
- **Days on Market** — How long it took to sell
- **Square Footage** — For price-per-sqft calculation
- **Beds/Baths** — For comparison
- **Year Built** — For age comparison
- **Neighborhood** — Optional, for context

### How ARV Is Calculated
The app calculates ARV by:
1. Computing the average price per square foot across all comps
2. Multiplying by your subject property's square footage

**Example:** If your 3 comps average $350/sqft and your property is 1,500 sqft:
ARV = $350 × 1,500 = **$525,000**

### ARV Override
If you have your own ARV estimate (from an appraiser, agent, or your own analysis), you can override the calculated ARV using the Override field. This is useful when comps are limited or when you have insider market knowledge.

### Tips for Selecting Good Comps
- **Location** — Within 0.5 miles, same neighborhood preferred
- **Recency** — Sold within the last 6 months
- **Size** — Within 20% of your property's square footage
- **Condition** — Should reflect post-rehab condition (not distressed sales)
- **DOM** — Comps that sold in 90 days or less indicate strong demand

### Comp Analysis Features
- Each comp shows price per square foot for easy comparison
- The comp summary displays average $/sqft, median sale price, and average DOM
- Comps are color-coded by how closely they match your subject property
- You can delete individual comps to see how it affects the ARV`,
  },
  {
    id: 'rehab',
    title: 'Rehab Estimator',
    icon: '🔨',
    content: `## Using the Rehab Estimator

The Rehab Estimator offers two modes: Quick Estimate and Detailed Scope of Work.

### Quick Estimate Mode
Select a rehab level (Light, Moderate, or Heavy) for a fast cost-per-square-foot estimate. Costs are automatically adjusted for your regional market.

### Detailed Scope of Work Mode
This is the more powerful mode. It breaks down the rehab into 14 individual rooms/phases:

1. **Kitchen** — Cabinets, countertops, backsplash, sink & faucet, appliances, lighting, hardware
2. **Master Bathroom** — Vanity, toilet, tub/shower, faucets, floor tile, mirror, lighting
3. **Full Bathroom** — Vanity, toilet, tub/shower, faucets, floor tile, mirror & lighting
4. **Half Bathroom** — Vanity, toilet, faucet & fixtures, floor tile
5. **Living Room** — Flooring, paint, baseboards, light fixtures
6. **Bedroom** — Flooring, paint, baseboards, closet system, light fixture
7. **Landscaping** — Front yard cleanup, fence/deck, exterior hardware
8. **Roof & Gutter** — Roof replacement, gutters
9. **Garage** — Garage door, floor coating, paint
10. **Electrical** — Outlets & switches, panel upgrade
11. **Plumbing** — Water heater, supply line repair
12. **HVAC** — Furnace/AC, thermostat, ductwork
13. **Structural** — Foundation, framing, windows, drywall, insulation
14. **Demo & Cleanup** — Dumpster, demo labor, deep clean, staging

### Material Tiers
Choose the tier that matches the neighborhood:
- **Rental Grade** — Builder-grade materials for investment/rental properties
- **Standard** — Mid-range materials for typical homebuyer neighborhoods
- **Luxury** — High-end finishes for upscale neighborhoods

### Home Depot Product Links
Every line item includes direct links to Home Depot products with real SKU numbers and current pricing. Click any product name to open the Home Depot product page in a new tab. This makes it easy to verify pricing and order materials.

### Regional Cost Adjustments
All rehab costs automatically adjust based on your selected metro market. The regional indicator bar shows the specific material and labor multipliers being applied. For example, in San Francisco, a $10,000 kitchen rehab becomes approximately $13,500 after regional adjustments.

### The Gantt Chart
The timeline visualization shows:
- Each phase as a colored bar
- Phase dependencies (e.g., painting cannot start until flooring is done)
- Duration in days
- Total project timeline in weeks
- Cost per phase`,
  },
  {
    id: 'sow-templates',
    title: 'SOW Templates',
    icon: '📋',
    content: `## SOW Templates Library

The SOW Templates page provides **104 professional renovation templates** organized across 10 room categories with photos, cost breakdowns, and downloadable scope of work documents.

### Template Library Tab

#### Browsing Templates
- **104 templates** across 10 categories: Kitchen (20), Master Bath (12), Full Bath (10), Half Bath (8), Living Room (10), Bedroom (10), Garage (8), Landscaping (10), Roof & Gutter (8), Exterior (8)
- Each template card shows a photo, cost level badge, property info (beds/baths/sqft), layout type, and total cost
- Templates are tagged by cost level: **Budget**, **Mid-Range**, or **High-End**

#### Filtering Templates
- **Room Type** — Filter by any of the 10 room categories
- **Cost Level** — Filter by Budget, Mid-Range, or High-End
- **Search** — Type keywords to search template names and descriptions

#### Template Detail Modal
Click any template card to open the detail view showing:
- Large photo header with cost level and layout type badges
- Property info (Type, Beds, Baths, Sq Ft)
- **Cost breakdown** — Materials, Labor, and Total (adjusted for your selected market)
- **Detailed Scope of Work** — Full description of renovation work
- **Key Materials** — List of specific materials used in the renovation
- **Download SOW** — Generate a downloadable scope of work document
- **Print** — Print the scope of work directly

#### Regional Pricing
The market selector at the top of the page syncs with the Deal Analyzer. All template costs automatically adjust based on your selected metro market. An "Adjusted" badge appears on each card when a non-national market is selected.

### Line-Item Estimator Tab

The second tab provides the detailed room-by-room line-item estimator with:
- **14 room categories** with expandable line-item breakdowns
- **Home Depot SKU links** — Every material links directly to the Home Depot product page
- **Condition selectors** — Set each room's condition level (Cosmetic, Moderate, Full)
- **Material tier toggle** — Switch between Rental, Standard, and Luxury grades
- **Printable SOW** — Generate a professional scope of work document for contractors`,
  },
  {
    id: 'financing',
    title: 'Financing & Costs',
    icon: '💰',
    content: `## Financing, Holding Costs, and Closing Costs

### Hard Money Financing
Toggle hard money on/off. When enabled, configure:
- **LTV %** — Loan-to-value ratio (typically 70-90%)
- **Interest Rate** — Annual rate (typically 9-13%)
- **Points** — Origination fee as percentage (typically 1-3)
- **Holding Months** — How long you expect to hold the property

The calculator shows: loan amount, down payment, monthly interest, and total financing cost.

When hard money is toggled off, the app assumes an all-cash purchase.

### Monthly Holding Costs
Enter your estimated monthly costs:
- **Property Tax** — Monthly property tax amount
- **Insurance** — Builder's risk or homeowner's insurance
- **Utilities** — Electric, gas, water, trash during rehab
- **Other** — HOA, lawn care, security, etc.

Total holding costs = monthly total × holding months.

### Closing Costs
- **Buy-Side Closing %** — Typically 1-2% of purchase price (title, escrow, recording)
- **Sell-Side Closing %** — Typically 5-6% of sale price (agent commissions, title, escrow)

All of these costs feed into the profitability analysis in real-time.`,
  },
  {
    id: 'profit',
    title: 'Profitability Analysis',
    icon: '📈',
    content: `## Understanding the Profitability Dashboard

The floating Profit Summary card updates in real-time as you enter data.

### Deal Score (0-100)
A composite score based on:
- Net profit margin
- ROI percentage
- Relationship to the 70% rule MAO
- Cash-on-cash return

**70-100:** Strong deal — proceed with confidence
**40-69:** Marginal deal — review assumptions carefully
**0-39:** Weak deal — likely not worth pursuing

### Key Metrics Explained

**Net Profit** — Your bottom-line profit after ALL costs:
Net Profit = ARV - Purchase - Rehab - Financing - Holding - Buy Closing - Sell Closing

**ROI (Return on Investment)** — Net profit as a percentage of total investment:
ROI = Net Profit ÷ Total Investment × 100

**Cash-on-Cash Return** — Net profit as a percentage of your actual cash invested (not including borrowed money):
Cash-on-Cash = Net Profit ÷ Cash Out of Pocket × 100

**Gross Profit** — ARV minus purchase price (before expenses)

**70% Rule MAO** — Maximum Allowable Offer using the 70% rule:
MAO = (ARV × 70%) - Rehab Cost

If your purchase price is below the MAO, the deal passes the 70% rule.

### Cost Breakdown
The detailed breakdown shows every cost category so you can see exactly where your money goes and identify areas to optimize.`,
  },
  {
    id: 'saved-deals',
    title: 'Saved Deals',
    icon: '💾',
    content: `## Saving and Managing Deals

### Saving a Deal
After analyzing a property, click the **Save Deal** button in the Deal Analyzer. The app saves all property details, comps, rehab estimates, financing terms, and profitability metrics.

### Viewing Saved Deals
Navigate to the **Saved Deals** page from the navigation menu. You will see a list of all your saved analyses with:
- Property address and photo
- Purchase price and ARV
- Net profit and ROI
- Deal score badge
- Date saved

### Managing Saved Deals
- **Open** — Click any saved deal to reload it in the Deal Analyzer with all data intact
- **Delete** — Remove deals you no longer need
- **Compare** — View multiple deals side by side to identify the best opportunity

### Tips for Deal Management
- Save every deal you analyze, even the ones you pass on — this builds your market knowledge
- Use the deal score to quickly sort and prioritize opportunities
- Revisit saved deals periodically as market conditions change`,
  },
  {
    id: 'lenders',
    title: 'Lender Directory',
    icon: '🏦',
    content: `## Hard Money & Private Lender Directory

The Lender Directory provides a curated list of hard money lenders, private lenders, and financing sources for real estate investors.

### Lender Information
Each lender listing includes:
- **Company name** and website
- **Loan types** — Fix & flip, bridge, rental, construction
- **Rate range** — Typical interest rates
- **LTV range** — Maximum loan-to-value ratios
- **Points** — Origination fee range
- **Term length** — Typical loan duration
- **Minimum credit score** — If applicable
- **Geographic coverage** — States where they lend
- **Contact information** — Phone, email, website

### How to Use the Directory
1. Browse the full list or filter by loan type, state, or rate range
2. Compare terms across multiple lenders
3. Contact lenders directly using the provided information
4. Use the financing calculator in the Deal Analyzer to model their terms

### Tips for Working with Hard Money Lenders
- Always get pre-approved before making offers
- Provide a detailed scope of work (use the SOW Templates)
- Show your deal analysis with clear profitability metrics
- Build relationships with 2-3 lenders for competitive terms
- Ask about draw schedules for rehab funding`,
  },
  {
    id: 'marketing',
    title: 'Marketing Templates',
    icon: '📢',
    content: `## Marketing Templates for Deal Acquisition

The Marketing page provides ready-to-use templates for finding motivated sellers and acquiring properties below market value.

### Template Categories

#### Direct Mail Letters
- **Absentee Owner Letter** — Target out-of-state landlords
- **Pre-Foreclosure Letter** — Reach homeowners facing foreclosure
- **Probate Letter** — Contact estate executors
- **Tired Landlord Letter** — Appeal to burned-out landlords
- **Tax Delinquent Letter** — Reach owners behind on taxes

#### Postcards
- **Yellow Letter Style** — Handwritten-look postcards
- **Professional Investor Postcard** — Branded investor marketing
- **We Buy Houses Postcard** — Classic direct response design

#### Email Sequences
- **Initial Outreach** — First contact with property owners
- **Follow-Up Series** — 5-email drip sequence
- **Offer Presentation** — How to present your offer via email

#### Cold Call Scripts
- **Absentee Owner Script** — Opening and qualifying questions
- **FSBO Script** — For sale by owner approach
- **Expired Listing Script** — Reach agents with expired listings

### How to Use
1. Select a template category
2. Choose a specific template
3. Copy the text and customize with your information
4. Replace bracketed fields [Your Name], [Company], etc.
5. Test with a small batch before scaling`,
  },
  {
    id: 'contracts',
    title: 'Contract Templates',
    icon: '📄',
    content: `## Using the Contract Templates

The app includes three essential contract templates:

### 1. Assignable Purchase & Sale Agreement
A standard real estate purchase contract with assignment language built in. Key features:
- "Buyer and/or assigns" language throughout
- Inspection contingency period
- Financing contingency (optional)
- Earnest money provisions
- Clear closing timeline

### 2. Assignment of Contract
Used when you are wholesaling — this document transfers your purchase rights to an end buyer. Includes:
- Original contract reference
- Assignment fee amount
- Buyer's acknowledgment
- Closing instructions

### 3. Wholesale Agreement
A simplified agreement specifically designed for wholesale transactions. Includes:
- Property description
- Purchase price and assignment fee
- Proof of funds requirement
- Closing timeline
- Cancellation provisions

### How to Use
1. Click on any contract template to view the full text
2. Copy the text to your word processor
3. Fill in the bracketed fields with your specific deal information
4. Have a real estate attorney review before using

**Important:** These templates are starting points. Always have a licensed real estate attorney in your state review and customize them for your specific situation and local laws.`,
  },
  {
    id: 'course',
    title: 'Investor Course',
    icon: '🎓',
    content: `## Real Estate Investor Course

The course provides comprehensive education on real estate investing with a focus on five exit strategies.

### Course Modules

#### Module 1: Fix & Flip Fundamentals
- Finding deals below market value
- Analyzing properties for profit potential
- Managing rehab projects
- Selling for maximum profit
- Common mistakes and how to avoid them

#### Module 2: Wholesaling
- Understanding the wholesale process
- Finding motivated sellers
- Negotiating purchase contracts
- Building a buyer's list
- Assignment vs. double close

#### Module 3: BRRRR Strategy
- Buy, Rehab, Rent, Refinance, Repeat
- Finding properties that cash flow
- Managing the rehab for rental quality
- Refinancing to pull out capital
- Scaling your rental portfolio

#### Module 4: Subject-To Financing
- What is subject-to investing
- Finding subject-to opportunities
- Structuring the deal
- Managing the existing mortgage
- Legal considerations by state

#### Module 5: Short-Term Rentals (Airbnb/VRBO)
- Market analysis for STR profitability
- Property selection criteria
- Furnishing and setup
- Listing optimization
- Management and automation

### How to Use the Course
- Work through modules sequentially for the best learning experience
- Each module includes practical exercises
- Apply concepts immediately using the Deal Analyzer
- Revisit modules as you encounter real-world situations`,
  },
  {
    id: 'listings',
    title: 'Property Listings',
    icon: '🏘️',
    content: `## Property Listings

The Listings page allows you to list properties for sale with professional photo galleries and detailed property information.

### Creating a Listing
1. Click **Add Listing** to create a new property listing
2. Enter property details: address, price, beds, baths, sqft, year built
3. Upload photos to create a gallery
4. Add a property description highlighting key features
5. Set the listing status (Active, Under Contract, Sold)

### Listing Features
- **Photo Gallery** — Multiple photos with lightbox viewer
- **Property Details** — Complete property information
- **Status Tracking** — Active, Under Contract, Sold, Off Market
- **Share Links** — Generate shareable links for buyers
- **Contact Form** — Interested buyers can reach out directly

### Tips for Effective Listings
- Use high-quality photos (at least 10-15 per property)
- Lead with the best exterior and kitchen photos
- Include before/after photos for renovated properties
- Write compelling descriptions focusing on buyer benefits
- Price competitively based on your comp analysis`,
  },
  {
    id: 'checklists',
    title: 'Checklists',
    icon: '✅',
    content: `## Investor Checklists

The Checklists page provides comprehensive checklists for every phase of a real estate investment.

### Available Checklists

#### Due Diligence Checklist
- Title search and title insurance
- Property inspection
- Zoning and permits verification
- Environmental assessment
- HOA document review
- Tax lien search
- Insurance quotes
- Contractor bids

#### Closing Checklist (Buy Side)
- Earnest money deposit
- Proof of funds or pre-approval
- Title commitment review
- Inspection contingency resolution
- Insurance binder
- Closing disclosure review
- Wire transfer instructions
- Key exchange

#### Rehab Project Checklist
- Permits pulled
- Contractor agreements signed
- Material orders placed
- Utility setup
- Dumpster delivery
- Phase inspections
- Punch list completion
- Final walkthrough

#### Listing Preparation Checklist
- Professional cleaning
- Staging (if applicable)
- Professional photography
- Listing description written
- MLS listing live
- Sign in yard
- Lockbox installed
- Open house scheduled

### How to Use
- Print checklists for each project
- Check off items as you complete them
- Use as a training tool for team members
- Customize for your specific market and process`,
  },
  {
    id: 'credibility',
    title: 'Credibility Packets',
    icon: '🏆',
    content: `## Credibility Packets

Professional credibility materials help you stand out when making offers, working with sellers, and building lender relationships.

### What Is a Credibility Packet?
A credibility packet is a professional document that showcases your experience, track record, and capabilities as a real estate investor. It builds trust with sellers, agents, and lenders.

### Packet Contents
- **Company Overview** — Your business name, mission, and values
- **Track Record** — Properties purchased, renovated, and sold
- **Before/After Photos** — Visual proof of your renovation quality
- **Testimonials** — Reviews from sellers, buyers, and partners
- **Proof of Funds** — Bank statements or lender pre-approval letters
- **References** — Title companies, contractors, agents you work with
- **Process Overview** — How you work with sellers (timeline, terms)
- **FAQ** — Common questions sellers ask, answered professionally

### When to Use
- **Making offers** — Include with every written offer
- **Meeting sellers** — Bring printed copies to appointments
- **Lender applications** — Attach to loan applications
- **Networking events** — Hand out at REIA meetings
- **Agent relationships** — Share with listing agents

### Tips
- Keep it to 2-4 pages maximum
- Update quarterly with new projects
- Include high-quality photos
- Use professional design and branding
- Tailor the packet to your audience (seller vs. lender)`,
  },
  {
    id: 'state-guide',
    title: 'State Guide',
    icon: '🗺️',
    content: `## State-by-State Investing Guide

The State Guide provides state-specific information for real estate investors, including regulations, tax implications, and market characteristics.

### Information Covered Per State
- **Foreclosure process** — Judicial vs. non-judicial, timeline
- **Wholesaling legality** — State-specific regulations and requirements
- **Transfer taxes** — Documentary stamp taxes and recording fees
- **Property tax rates** — Average effective tax rates
- **Landlord-tenant laws** — Key regulations for rental properties
- **License requirements** — Whether a real estate license is needed for certain activities
- **Contract requirements** — State-specific contract provisions
- **Disclosure requirements** — What sellers must disclose

### How to Use
1. Select your target state from the dropdown or map
2. Review the state-specific regulations
3. Pay special attention to wholesaling rules and disclosure requirements
4. Consult with a local attorney for specific legal questions

### Key Considerations by State
- Some states require a real estate license for wholesaling
- Foreclosure timelines vary from 30 days to 18+ months
- Transfer taxes can significantly impact closing costs
- Landlord-tenant laws affect your rental exit strategy
- Some states have specific assignment contract requirements`,
  },
  {
    id: 'contractors',
    title: 'Contractor Management',
    icon: '👷',
    content: `## Contractor Management

The Contractors page helps you organize and manage your contractor relationships for rehab projects.

### Adding Contractors
Track key information for each contractor:
- **Company name** and contact person
- **Phone, email, website**
- **Specialty** — General, electrical, plumbing, HVAC, roofing, etc.
- **License number** and insurance status
- **Service area** — Cities/counties they cover
- **Rating** — Your personal rating based on experience
- **Notes** — Project history, pricing notes, reliability

### Managing Your Contractor List
- **Filter by specialty** — Find the right contractor for each job
- **Sort by rating** — Prioritize your best contractors
- **Track availability** — Note when contractors are booked
- **Compare bids** — Store multiple bids for the same scope

### Tips for Working with Contractors
- Always get at least 3 bids for major work
- Verify license and insurance before hiring
- Use the SOW Templates to provide clear scope of work
- Set up a draw schedule tied to milestones
- Inspect work at each phase before releasing payment
- Build relationships with reliable contractors — they are your most valuable asset
- Pay on time to maintain priority scheduling`,
  },
  {
    id: 'blog',
    title: 'Blog & Resources',
    icon: '📰',
    content: `## Blog & Resources

The Blog page provides educational articles, market updates, and investing tips to help you stay informed and improve your investing skills.

### Content Categories
- **Market Analysis** — Local and national market trends
- **Deal Breakdowns** — Step-by-step analysis of real deals
- **Rehab Tips** — Construction and renovation best practices
- **Financing Strategies** — Creative financing and lender tips
- **Legal Updates** — Regulatory changes affecting investors
- **Success Stories** — Case studies from successful investors

### How to Use
- Browse articles by category
- Search for specific topics
- Bookmark articles for future reference
- Share articles with your investing network`,
  },
  {
    id: 'pricing',
    title: 'Pricing & Subscription',
    icon: '💳',
    content: `## Pricing & Subscription Plans

The app offers tiered subscription plans to match your investing activity level.

### How Subscriptions Work
1. Navigate to the **Pricing** page from the navigation menu
2. Review the available plans and features
3. Click **Subscribe** on your preferred plan
4. Complete payment through the secure Stripe checkout
5. Your account is upgraded immediately

### Managing Your Subscription
- View your current plan in your account settings
- Upgrade or downgrade at any time
- Cancel anytime — your access continues through the billing period
- View payment history and download invoices

### Testing Payments
For testing purposes, use the card number **4242 4242 4242 4242** with any future expiration date and any CVC.`,
  },
  {
    id: 'support',
    title: 'Support & Help',
    icon: '🆘',
    content: `## Getting Help

### Support Page
The Support page provides:
- **FAQ** — Answers to the most common questions
- **Contact Form** — Submit questions or report issues
- **Feature Requests** — Suggest new features or improvements

### Disclaimers
The Disclaimers page contains important legal information:
- **Not Financial Advice** — The app provides analysis tools, not investment advice
- **Data Accuracy** — Cost estimates are approximations based on national averages and regional adjustments
- **Contract Templates** — Must be reviewed by a licensed attorney before use
- **No Guarantee** — Past performance and projections do not guarantee future results

### Tips for Getting the Most Out of the App
1. **Start with the course** — Build your knowledge foundation
2. **Practice with the analyzer** — Analyze 10+ deals before making your first offer
3. **Use the SOW templates** — Present professional scope of work to contractors
4. **Build your team** — Use the contractor management and lender directory
5. **Save every deal** — Build your market knowledge database
6. **Stay current** — Read the blog and check for app updates`,
  },
];
