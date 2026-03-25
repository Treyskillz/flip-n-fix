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
- **Determine ARV from comps** — Add 3–5 comparable retail sales of renovated properties to calculate your After Repair Value
- **Cost basis analysis** — See your total investment (purchase + rehab) vs. ARV to evaluate deal profitability
- **Estimate rehab costs** — Use preset levels or detailed room-by-room scope of work with real material pricing
- **Regional cost adjustments** — Costs automatically adjust based on 50+ metro markets
- **Material tier selection** — Choose Rental, Standard, or Luxury grade materials
- **Visualize the rehab timeline** — Interactive Gantt chart shows project phases and dependencies
- **Calculate financing costs** — Hard money loan calculator with customizable terms
- **Track all costs** — Holding costs, closing costs, and financing all factored in
- **Profitability dashboard** — Real-time deal score, ROI, cash-on-cash return, and 70% rule analysis
- **Save and compare deals** — Save unlimited deals and compare them side by side
- **Import deals from CSV** — Bulk-import deals from spreadsheets (Team tier)
- **My Shared Links** — Track all your shared deal links with view counts and expiration dates
- **Pipeline Deal Tracker** — Kanban-style deal pipeline from lead to closing
- **Deal Comparison** — Side-by-side comparison of 2–6 deals (Team tier)
- **Analytics Dashboard** — Advanced portfolio performance metrics (Team tier)
- **Profit Calculator** — Six exit strategy scenarios (Elite & Team tiers)
- **SOW System** — 12 complete property SOWs, 104 room templates, line-item estimator, and custom SOW builder with database persistence
- **Before/After Comparisons** — Interactive drag sliders showing property and room-level renovation transformations
- **Excel SOW Export** — Multi-sheet workbooks with property summary, room costs, and material specs for contractor bidding
- **Contractor Bid Requests** — Pre-filled bid request forms with email, clipboard, and Excel download options
- **Custom SOW Builder** — Build, save, edit, and duplicate your own property SOWs with full database persistence
- **Lender Directory** — Curated hard money and private lender contacts
- **Marketing Templates** — Direct mail, postcards, email sequences, and cold call scripts
- **Contract Templates** — Assignable purchase agreements and wholesale contracts
- **Investor Course** — Complete education on 5 exit strategies
- **Property Listings** — List your properties for sale with photo galleries
- **Checklists** — Due diligence, closing, and rehab checklists
- **Credibility Packets** — Professional investor credibility materials
- **State Guide** — State-by-state real estate investing regulations
- **Contractor Management** — Trade categories, vetting checklists, payment schedules, 6 critical documents, and contractor rolodex
- **Renovation Designer** — Visualize room designs and material choices
- **Product Verification** — Verified Home Depot product links with price tracking and discontinued product alerts
- **Alternative Product Suggestions** — Automatic replacement recommendations for discontinued materials
- **Material Cost Tracker** — Subscriber dashboard showing pricing trends across 11 rehab material categories with automated monthly updates
- **White-Label Branding** — Custom logo and branding on all reports (Team tier)
- **Blog & Auto-Publishing** — Content management with AI generation and Facebook auto-posting
- **Free Guide & Lead Capture** — Lead generation with downloadable guide

### Quick Start Guide

1. Navigate to the **Deal Analyzer** from the home page
2. Enter the property address and details in the Subject Property section
3. Select a rehab level or use the detailed scope of work (this sets your rehab budget)
4. Add 3–5 comparable retail sales of recently renovated properties to determine your ARV
5. Or enter your ARV manually using the override field if you already know it
6. Configure financing terms and holding costs
7. Review the profitability dashboard for your deal score
8. Save the deal for future reference`,
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
    content: `## ARV Methodology & Comparable Sales

### What Is ARV?

**ARV (After Repair Value)** is what the property will **sell for on the open market after all renovations are complete**. It is NOT what you paid or what you spent on rehab — it is the expected **sale price** of the finished product.

### How to Calculate ARV

1. **Find 3–5 comparable properties ("comps")** — recently sold, fully renovated homes in the same neighborhood that are similar in size, age, and style
2. **Calculate the average price per square foot ($/sqft)** of those sold, renovated comps
3. **Multiply the average $/sqft by your subject property's square footage** to get your ARV baseline
4. **Adjust for differences** — more bedrooms, better finishes, superior location, etc.

> **ARV = Average $/sqft of Renovated Comps × Subject Property Sqft**

**Example:** 4 renovated comps average $175/sqft. Your subject is 1,500 sqft. ARV = $175 × 1,500 = **$262,500**

### The 70% Rule

A common rule of thumb to determine your maximum purchase price:

> **(ARV × 0.70) − Estimated Repairs = Maximum Purchase Price**

**Example:** ARV $262,500 × 0.70 = $183,750 − $50,000 repairs = **$133,750 max purchase price**

### Cost Basis vs. ARV

Your **cost basis** (Purchase Price + Rehab Budget) is what you have INTO the deal. The **ARV** is what you expect to sell it for. The difference between ARV and your total costs (including financing, holding, and closing) is your **profit**. The system shows your cost basis alongside the ARV so you can see the equity spread at a glance.

### ⛔ CRITICAL: Retail Sales Only

**Comps must ALWAYS be standard retail (arms-length) sales.** Never use:
- Foreclosures
- Short sales
- REO / Bank-owned properties
- Auction sales
- Estate sales under duress

These are **distressed transactions** where the seller is under financial pressure. They sell below true market value and will give you a false, understated ARV. The app will warn you and block you from adding distressed comps.

### Adding Comps
Click "Add Comp" and enter:
- **Address** — The comp property address
- **Sale Price** — What it actually sold for (retail price)
- **Sale Date** — When it closed
- **Days on Market** — How long it took to sell
- **Square Footage** — For price-per-sqft calculation
- **Condition** — Must be Renovated or Updated for best results
- **Beds/Baths** — For comparison
- **Year Built** — For age comparison

### ARV Override
If you have your own ARV estimate (from an appraiser, agent, or your own analysis), you can enter it manually using the Override field. This is useful when you have insider market knowledge, a professional appraisal, or a BPO (Broker Price Opinion).

### Tips for Selecting Good Comps
- **Sale Type** — Standard retail sale ONLY (arms-length transaction)
- **Condition** — Renovated or updated, matching your planned rehab level
- **Location** — Within 1 mile of the subject property
- **Recency** — Sold within the last 6 months from when you pull comps
- **Days on Market** — On market 90 days or less (DOM ≤ 90)
- **Size** — Within 200 sq ft of the subject property
- **Bed/Bath** — Similar bed/bath count (±1 bedroom, ±1 bathroom)
- **Age** — Within 10 years of the subject property's year built
- **Use 3-6 comps** for the most reliable market validation

### Comp Analysis Features
- Each comp is scored for quality (A-F grade) based on similarity to your subject
- Cost basis comparison shows equity spread (ARV minus what you have into the deal)
- Green = positive equity spread, Red = negative equity (you'd lose money)
- Distressed comps are flagged and blocked from being added`,
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

### Home Depot Product Links & Product Verification
Every line item includes direct links to Home Depot products with real SKU numbers and pricing. Click any product link to open the Home Depot product page in a new tab.

**Product Verification Badges** — Each product displays a status badge:
- ✅ **Verified** — Product confirmed available on Home Depot with current pricing
- ❌ **Discontinued** — Product no longer available; an alternative is suggested when possible
- ⚠️ **Unavailable** — Product temporarily out of stock or region-restricted
- ❓ **Unverified** — Product has not yet been checked

**Price Change Indicators** — When a product's price has changed since it was originally listed:
- 📈 Red arrow with percentage = price increased
- 📉 Green arrow with percentage = price decreased

**Alternative Product Suggestions** — When a product is discontinued, the system suggests a comparable replacement with a direct link and updated pricing. Look for the arrow (→) indicator below the product badge.

Hover over any product badge to see detailed information including the last verification date, original vs. current price, and alternative product details.

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
    content: `## Scope of Work (SOW) System

The SOW page is a comprehensive renovation planning system with **four tabs**: Property SOWs, Template Library, Line-Item Estimator, and Custom Builder. Together they provide everything you need to plan, estimate, and communicate renovation work to contractors.

### Tab 1: Property SOWs (12 Properties)

This tab features **12 complete property renovation packages** across 3 material tiers, each with 9 rooms fully scoped out with photos, line items, and cost breakdowns.

#### Property Grid
- **12 properties** across 10 U.S. metro markets (Phoenix, Atlanta, Dallas, Portland, Nashville, San Diego, Memphis, Denver, Charlotte, Austin)
- Each property card shows: address, tier badge, beds/baths/sqft, purchase price, rehab budget, ARV, and room count
- **Tier filter** — Filter by Rental Grade (4 properties), Standard (4 properties), or Luxury (4 properties)

#### Property Detail View
Click any property card to see the full renovation scope:
- **Property header** with address, tier, beds/baths/sqft, and style description
- **Room navigation tabs** — Click through all 9 rooms: Kitchen, Master Bath, Full Bath, Half Bath, Living Room, Bedroom, Garage, Landscaping, Roof
- **Room-level before/after slider** — Interactive drag slider comparing the distressed "before" condition photo with the renovated "after" photo for each room
- **Line-item cost table** — Every room shows individual line items with material costs, labor costs, and totals
- **Budget summary table** — Complete breakdown of all 9 rooms with materials, labor, and grand total

#### Property Actions
Each property detail view has 5 action buttons:
1. **Download Full SOW** — Opens a print-ready scope of work document with all rooms and costs
2. **Export to Excel** — Downloads a multi-sheet Excel workbook with property summary, room-by-room costs, material specs, and labor breakdowns — perfect for contractor bidding
3. **Print SOW** — Sends the scope of work directly to your printer
4. **Analyze This Deal** — Pre-fills the Deal Analyzer with the property's purchase price, ARV, address, and total rehab costs so you can instantly evaluate profitability
5. **Send to Contractor** — Opens a bid request form with pre-filled property summary, cost breakdown, and room count. You can enter a contractor's email, add notes, then:
   - **Open Email Client** — Opens your default email app with the bid request pre-filled
   - **Copy Bid Text** — Copies the formatted bid request to your clipboard
   - **Download Excel SOW** — Downloads the Excel workbook to attach to your email

#### Before/After Comparison
At the bottom of each property detail, an **exterior before/after comparison** shows the full property transformation with a drag slider. The comparison includes purchase price, total rehab cost, and ARV below the photos.

### Tab 2: Template Library (104 Templates)

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

### Tab 3: Line-Item Estimator

The detailed room-by-room line-item estimator with:
- **14 room categories** with expandable line-item breakdowns
- **Home Depot SKU links** — Every material links directly to the Home Depot product page
- **Condition selectors** — Set each room's condition level (Cosmetic, Moderate, Full)
- **Material tier toggle** — Switch between Rental, Standard, and Luxury grades
- **Printable SOW** — Generate a professional scope of work document for contractors

### Tab 4: Custom Builder

Build your own property SOW from scratch with full database persistence:

#### My Saved SOWs
- View all your saved custom SOWs in a grid with property name, address, room count, total cost, and last updated date
- **Edit** — Re-open any saved SOW to modify rooms, line items, or costs
- **Duplicate** — Clone an existing SOW as a starting point for a similar property
- **Delete** — Remove SOWs you no longer need
- **Create New SOW** — Start a fresh custom scope of work

#### Building a Custom SOW
1. **Property Details** — Enter property name, address, beds, baths, square footage, and notes
2. **Add Rooms** — Click room type buttons (Kitchen, Master Bath, Full Bath, Half Bath, Living Room, Bedroom, Garage, Landscaping, Roof) to add them to your scope
3. **Room Condition** — Toggle each room between Good, Fair, and Poor condition (affects default costs)
4. **Edit Line Items** — Each room comes with pre-populated line items. You can:
   - Edit item names, material costs, and labor costs
   - Delete items you don't need
   - Add custom line items with the "+ Add Item" button
5. **Budget Target** — Set a target budget and track your progress with a visual progress bar
6. **Running Totals** — See materials, labor, and grand total update in real-time as you make changes

#### Custom SOW Actions
- **Save SOW** — Persists your custom SOW to the database so you can access it from any device
- **Export to Excel** — Download a professional Excel workbook with all your custom rooms and line items
- **Send to Contractor** — Open the bid request form with your custom property details pre-filled
- **Analyze This Deal** — Send your custom SOW data directly to the Deal Analyzer

### Tips for Using SOW Effectively
- Start with a **Property SOW** that matches your deal's tier and style, then use it as a reference
- Use the **Custom Builder** to create a tailored SOW for your specific property
- Export to Excel and share with **3+ contractors** to get competitive bids
- Use the **Analyze This Deal** button to instantly see if the rehab costs make the deal profitable
- The **before/after photos** help contractors understand the scope of transformation expected`,
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

All saved deals are stored securely in the cloud database, so you can access them from any device, any browser, at any time.

### Saving a Deal
After analyzing a property in the Deal Analyzer, click the **Save Deal** button (floppy disk icon) in the Investor Report section. The app saves all property details, comps, rehab estimates, financing terms, profitability metrics, and any uploaded photos to the cloud database.

### Viewing Saved Deals
Navigate to **Saved Deals** from the top navigation bar. You will see all your saved analyses displayed as cards (grid view) or rows (table view). Toggle between views using the grid/list icons in the toolbar.

Each deal card shows:
- Property address and location
- Purchase price, ARV, and rehab cost
- Net profit and ROI percentage
- Deal score badge with color-coded verdict
- Status indicator and star rating
- Date saved

### Deal Status Management
Every deal has a **status** that tracks where it is in your pipeline:
- **Active** (blue) — Currently evaluating this deal
- **Under Contract** (amber) — You have a signed contract
- **Closed** (green) — Deal is completed
- **Passed** (red) — You decided not to pursue this deal
- **Archived** (gray) — Stored for reference but hidden from Portfolio

To change a deal's status, click the **status dropdown** on the deal card or in the table view and select the new status.

### Star / Favorite Deals
Click the **star icon** on any deal card to mark it as a favorite. Starred deals appear at the top when sorting by favorites and are easy to find in a large portfolio.

### Inline Notes
Each deal has a **notes section** for tracking important details:
- On the **card view**, click the **sticky note icon** to expand the notes area below the card
- On the **table view**, click the **notes icon** in the Notes column
- Type your notes (e.g., "Seller motivated, call back Friday" or "Needs new roof — get contractor quote")
- Notes **auto-save** when you click outside the text area or after a brief pause
- A small indicator shows the note was saved successfully

### Sorting and Filtering
Use the toolbar to organize your deals:
- **Search** — Type an address to filter deals instantly
- **Sort by** — ROI, Net Profit, Deal Score, Purchase Price, or Date Saved
- **Sort direction** — Ascending or descending (click the arrow icon)
- **Filter by Status** — Show only Active, Under Contract, Closed, etc.
- **Filter by Verdict** — Show only Excellent, Good, Marginal, or Poor deals

### Deleting Deals
Click the **trash icon** on any deal card or in the table actions column. A confirmation dialog will appear before the deal is permanently removed.

### Migrating from Browser Storage
If you previously saved deals before the cloud database was added, you will see a yellow **migration banner** at the top of the Saved Deals page. Click **Migrate to Cloud** to move all your local deals to the database. After migration, your deals are accessible from any device.

### Bulk Actions (Team Tier)
When you have a Team subscription, you can select multiple deals using the checkboxes and perform bulk operations:
- **Compare Deals** — Select 2–6 deals and click "Compare Selected" to open a side-by-side comparison view
- **Full Database Export** — Export all your saved deals as a CSV file for spreadsheet analysis
- **AI Deal Summary** — Click the sparkle icon on any deal card to generate an AI-powered analysis summary

### Import Deals from CSV (Team Tier)
Team subscribers can bulk-import deals from a CSV file:
1. Click the **Import CSV** button in the toolbar (upload icon)
2. Download the **sample template** to see the expected column format
3. Upload your CSV file — the app previews the first 5 rows for verification
4. Click **Import Deals** to process the file
5. The app maps columns automatically (supports 30+ header name variants like "Street Address", "Purchase Price", "After Repair Value", etc.)
6. Each row is validated, profit/ROI/deal score are calculated automatically, and deals are saved to your database

Supported columns: Address, City, State, Zip, Purchase Price, ARV, Rehab Cost, Sqft, Beds, Baths, Year Built, Market, Status, Notes.

### My Shared Links
Below the deal grid on the Saved Deals page, you will find the **My Shared Links** section (click to expand). This shows every deal link you have shared:
- **Property address** and active/expired status badge
- **View count** — how many times the link has been opened
- **Created date** and **days remaining** before expiration (links expire after 30 days)
- **Copy** — copy the share URL to your clipboard
- **Open** — open the shared link in a new tab
- **Revoke** — permanently delete the shared link so it can no longer be viewed

You also receive a notification when someone views your shared link for the first time, and again every 5 views.

### Tips for Deal Management
- Save every deal you analyze, even the ones you pass on — this builds your market knowledge over time
- Use statuses to track your deal pipeline from analysis through closing
- Add notes immediately after property visits or phone calls while details are fresh
- Star your top 3-5 deals to keep them visible
- Use the Portfolio Dashboard to see aggregate performance across all saved deals
- Import deals from spreadsheets when transitioning from another system`,
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

The course provides comprehensive education on real estate investing with **12 modules and 65 micro-lessons** covering investor mindset, five exit strategies, deal sourcing, financing, platform mastery, and bonus advanced content. Each lesson is a focused 5\u20138 minute video designed for maximum retention. Course access is bundled with your subscription tier.

### Course Access by Subscription Tier

| Tier | Course Access |
|------|---------------|
| **Free** | Module 1: Investor Mindset (3 lessons) |
| **Pro** | Modules 1\u201310 (53 lessons \u2014 all core content + platform mastery) |
| **Elite** | All 12 Modules (65 lessons \u2014 includes bonus advanced modules) |
| **Team** | All 12 Modules (65 lessons \u2014 includes bonus advanced modules) |

### Course Modules

#### Module 1: Investor Mindset & Success Psychology (Free \u2014 3 lessons)
- The Investor Mindset \u2014 Why 90% Fail
- Building Investor Resilience
- The Psychology of Negotiation & Deal-Making

#### Module 2: Foundation \u2014 Building Your Business (Pro \u2014 8 lessons)
- Why Fix & Flip in 2026
- The Housing Deficit Opportunity
- Setting Up Your Business Entity
- Building Your Power Team (Part 1)
- Building Your Power Team (Part 2)
- Investment Criteria & Business Plan (Part 1)
- Investment Criteria & Business Plan (Part 2)
- Your First 30 Days Action Plan

#### Module 3: Finding Deals \u2014 Acquisition Strategies (Pro \u2014 7 lessons)
- The 7 Best Lead Sources for 2026 (Part 1)
- The 7 Best Lead Sources for 2026 (Part 2)
- Driving for Dollars & Direct Mail
- Analyzing Deals: Running the Numbers (Part 1)
- Analyzing Deals: Running the Numbers (Part 2)
- Comp Analysis & ARV Calculation
- Making Offers & Negotiation Tactics

#### Module 4: Fix & Flip Mastery (Pro \u2014 8 lessons)
- Managing Your Rehab Like a Pro (Part 1)
- Managing Your Rehab Like a Pro (Part 2)
- Contractor Management & Scheduling
- Estimating Costs: Room-by-Room Breakdown
- Material Tiers & Regional Pricing
- The 70% Rule & Deal Scoring
- Selling for Maximum Profit
- Price Reduction Requests & Ninja Negotiation

#### Module 5: Wholesaling Fundamentals (Pro \u2014 3 lessons)
- What Is Wholesaling & How It Works
- Finding Deals & Building a Buyers List
- Assignment Contracts & Closing the Deal

#### Module 6: The BRRRR Strategy (Pro \u2014 3 lessons)
- BRRRR Explained: Buy, Renovate, Rent, Refinance, Repeat
- Running BRRRR Numbers & Seasoning Periods
- Scaling with BRRRR: Building a Portfolio

#### Module 7: Subject-To Financing (Pro \u2014 3 lessons)
- What Is Subject-To & When to Use It
- Due-on-Sale Clause & Risk Management
- Structuring Subject-To Deals Step by Step

#### Module 8: Short-Term Rentals (Pro \u2014 3 lessons)
- The Short-Term Rental Opportunity
- Regulations, Permits & Market Research
- Rental Arbitrage & Scaling STR Income

#### Module 9: Financing Your Deals (Pro \u2014 3 lessons)
- Hard Money Lenders: Terms, Rates & How to Qualify
- Private Money & Gap Funding Strategies
- Blended Financing & Creative Stacking

#### Module 10: Freedom One Platform Mastery (Pro \u2014 12 lessons)
- Deal Analyzer: Property Setup & Comps
- Deal Analyzer: Rehab Estimation & Deal Scoring
- SOW Templates: Library & Line-Item Estimator
- SOW Templates: Regional Pricing & PDF Export
- Lender Directory: Searching & Filtering
- Lender Directory: Comparing Terms & Contacting
- Marketing Templates: Direct Mail & Postcards
- Marketing Templates: Email Sequences & Cold Calls
- Contract Templates: Purchase Agreements
- Contract Templates: Wholesale & Assignment
- Property Listings: Creating & Managing
- Property Listings: Photo Gallery & Status Tracking

#### Module 11: Bonus \u2014 Asset Protection & Tax Strategy (Elite \u2014 7 lessons)
- Entity Structures: LLCs & Series LLCs
- Land Trusts & Privacy Protection
- Insurance Strategies for Investors
- Self-Directed IRAs for Real Estate
- Tax Strategy: Deductions & Depreciation
- 1031 Exchanges & Tax Deferral
- Building Your Asset Protection Plan

#### Module 12: Bonus \u2014 Creative Financing Mastery (Elite \u2014 5 lessons)
- Seller Financing: Structuring Win-Win Deals
- Wrap-Around Mortgages Explained
- Lease Options & Zero-Down Techniques
- Sandwich Lease Options & Advanced Structures
- Multi-Layer Strategies & Course Graduation

### Course Features
- **65 Micro-Lessons** \u2014 Focused 5\u20138 minute videos designed for short attention spans and maximum retention
- **Colossyan AI Videos** \u2014 Professional AI-generated video lessons with on-screen text and visual aids
- **Progress Tracking** \u2014 Mark lessons complete and track your progress per module
- **Module Quizzes** \u2014 Test your knowledge after each module (12 quizzes total)
- **Completion Certificate** \u2014 Downloadable PDF certificate when you finish all modules
- **Course Ebook** \u2014 Download the complete course as a professional PDF book
- **Chart.js Trend Charts** \u2014 Material Cost Tracker with visual price trend analysis (Pro+)

### How to Use the Course
- Work through modules sequentially for the best learning experience
- Each micro-lesson is 5\u20138 minutes \u2014 designed to fit into any schedule
- Apply concepts immediately using the Deal Analyzer and other platform tools
- Complete quizzes to test your understanding before moving on
- Mark lessons and modules complete to track your progress
- Download your completion certificate from the course page when finished`,
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

The Contractors page is a comprehensive contractor management system with trade categories, vetting checklists, payment schedules, critical documents, and a contractor rolodex.

### Trade Categories
Browse contractors organized by trade specialty:
- **General Contractors** — Full project management and coordination
- **Electricians** — Wiring, panels, fixtures, code compliance
- **Plumbers** — Pipes, fixtures, water heaters, sewer lines
- **HVAC Technicians** — Heating, cooling, ductwork, ventilation
- **Roofers** — Shingles, flashing, gutters, repairs
- **Painters** — Interior/exterior painting, staining, texturing
- **Flooring Specialists** — Tile, hardwood, LVP, carpet installation
- **Landscapers** — Grading, sod, irrigation, hardscaping

Each trade category includes typical hourly rates, common project costs, and what to look for when hiring.

### Contractor Vetting Checklist
A step-by-step checklist for evaluating new contractors:
- License verification and status
- Insurance certificates (general liability + workers' comp)
- References from recent projects
- Better Business Bureau rating
- Online reviews and portfolio
- Written estimate with detailed line items
- Timeline commitment and availability

### Payment Schedule Guide
Recommended draw schedule for rehab projects:
- **10% deposit** — Upon signing contract
- **25% first draw** — After demolition and rough-in complete
- **25% second draw** — After mechanical inspections pass
- **25% third draw** — After finish work complete
- **15% final payment** — After punch list and final walkthrough

### 6 Critical Contractor Documents
Downloadable templates for professional contractor relationships:
1. **Independent Contractor Agreement** — Scope, timeline, payment terms, and liability
2. **Change Order Form** — Document scope changes with cost and timeline impact
3. **Lien Waiver** — Protect your property from mechanic's liens
4. **Certificate of Insurance Request** — Verify contractor insurance coverage
5. **Punch List Template** — Track deficiencies and completion items
6. **Final Completion Certificate** — Document project completion and warranty start

### Contractor Rolodex (Database-Backed)
Your personal contractor database is stored securely in the cloud — accessible from any device, never lost:
- **Add contractors** with name, company, phone, email, trade specialty, city/state, and notes
- **Edit contractors** — Click the edit icon on any contractor card to update their information
- **Rate contractors** on a 5-star scale based on your experience
- **Filter by specialty** — Use the trade filter dropdown to find the right contractor for each job (shows count per trade)
- **Quick contact** — Click to call or email directly from the rolodex
- **Delete contractors** — Remove contractors you no longer work with
- **18 trade categories** — General Contractor, Plumber, Electrician, HVAC, Roofer, Painter, Flooring, Drywall, Framing/Carpentry, Landscaping, Concrete/Masonry, Windows/Doors, Kitchen/Bath, Demolition, Pest Control, Foundation, Handyman, and Other
- **Cloud persistence** — All contractor data is saved to the database (not localStorage) and syncs across devices. Requires login.

### SOW Integration
The SOW system connects directly to your contractor workflow:
- From any **Property SOW** or **Custom SOW**, click "Send to Contractor" to generate a professional bid request
- The bid request includes property details, room count, cost breakdown, and your notes
- **Open Email Client** pre-fills an email with the bid request text
- **Copy Bid Text** copies the formatted request to your clipboard
- **Download Excel SOW** generates a professional spreadsheet to attach to your bid request
- Always send SOWs to **3+ contractors** to get competitive bids

### Tips for Working with Contractors
- Always get at least 3 bids for major work
- Verify license and insurance before hiring
- Use the SOW Templates to provide clear scope of work
- Set up a draw schedule tied to milestones
- Inspect work at each phase before releasing payment
- Build relationships with reliable contractors — they are your most valuable asset
- Pay on time to maintain priority scheduling
- Document everything in writing — use the Change Order Form for any scope changes
- Never pay the full amount upfront — follow the draw schedule`,
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

The app offers four subscription tiers to match your investing activity level. All paid plans include a **7-day free trial** — no charge until day 8.

### Free Tier
Get started at no cost:
- Basic Deal Analyzer (3 analyses per month)
- 70% Rule Calculator
- **Course Module 1: Investor Mindset** (3 micro-lessons)
- Blog & Educational Content
- Marketing Templates (View Only)

### Pro Tier ($99/month or $990/year — 2 months free)
Full analysis suite for active investors:
- Everything in Free
- Unlimited Saved Deals
- Full Rehab Estimator with Home Depot SKUs
- SOW Templates (All 14 Rooms)
- Investor Presentation Reports
- Contract Templates (Download)
- Marketing Templates (Download)
- Lender Directory
- Regional Cost Adjustments
- Pipeline Deal Tracker
- Renovation Designer
- Quick Check Tool
- Product Verification Badges & Price Tracking
- Alternative Product Suggestions for Discontinued Items
- **Full Course Access: Modules 1\u201310** (53 micro-lessons covering investor mindset, all 5 exit strategies, deal sourcing, financing, and platform mastery)
- Video Lesson Scripts & Study Guides
- Material Cost Tracker Dashboard with Chart.js Trend Charts

### Elite Tier ($199/month or $1,990/year — 2 months free)
Complete system with all course modules & advanced tools:
- Everything in Pro
- Profit Calculator (All 6 Scenarios)
- **All 12 Course Modules** (65 micro-lessons \u2014 everything in Pro plus bonus modules)
- **Bonus Module 11:** Asset Protection & Tax Strategy for Real Estate Investors (7 lessons)
- **Bonus Module 12:** Creative Financing Mastery (seller financing, lease options, zero-down techniques) (5 lessons)
- Property Listings Page
- Email Investor Reports
- Priority Support
- Gantt Chart Export (PDF)
- Portfolio Dashboard & PDF Export
- State Reference Guide

### Team Tier ($349/month or $3,490/year — 2 months free)
White-label branding & AI-powered tools:
- Everything in Elite
- White-Label Reports (Your Logo & Branding)
- Custom Branded Investor Reports & Portfolio PDFs
- AI Deal Summary Generator
- Full Database Export (CSV)
- Import Deals from CSV
- Deal Comparison (Side-by-Side)
- Analytics Dashboard
- Branded Shared Deal Links
- Shared Link View Notifications
- Dedicated Onboarding Support

### How Subscriptions Work
1. Navigate to the **Pricing** page from the navigation menu
2. Review the available plans and features
3. Click **Start 7-Day Free Trial** on your preferred plan
4. Complete payment through the secure Stripe checkout
5. Your account is upgraded immediately with full access
6. You are not charged until day 8

### Managing Your Subscription
- View your current plan on the **Profile** page
- Upgrade or downgrade at any time from the Pricing page
- Cancel anytime — your access continues through the billing period
- View payment history and download invoices
- Use the **Replay Feature Tour** button on your Profile page to see the subscription features walkthrough again

### Gifted Subscriptions
The site owner can gift subscription access to specific users through the Admin panel. Gifted subscriptions provide full plan access without requiring payment.

### Testing Payments
For testing purposes, use the card number **4242 4242 4242 4242** with any future expiration date and any CVC.`,
  },
  {
    id: 'portfolio',
    title: 'Portfolio Dashboard',
    icon: '📊',
    content: `## Portfolio Dashboard

The Portfolio Dashboard gives you a bird's-eye view of your entire deal pipeline with aggregate financial metrics, charts, and performance tracking.

### Accessing the Portfolio
Click **Portfolio** in the top navigation bar. The dashboard loads all your saved deals from the cloud database and calculates aggregate metrics in real time.

### KPI Cards
Four key performance indicators are displayed at the top:
- **Total Deals** — The number of deals in your portfolio (filtered by date range if active)
- **Total Invested** — Sum of all purchase prices across your deals
- **Projected Profit** — Sum of all net profit estimates
- **Average ROI** — Weighted average return on investment across all deals

### Date Range Filtering
Use the **date range dropdown** in the header to filter all metrics, charts, and the deal table by time period:
- **All Time** — Shows every deal you have ever saved
- **Last 7 Days** — Deals saved in the past week
- **Last 30 Days** — Deals saved in the past month
- **Last 90 Days** — Deals saved in the past quarter
- **This Quarter** — Current calendar quarter (Q1, Q2, Q3, or Q4)
- **This Year** — Current calendar year
- **Custom Range** — Pick specific start and end dates using the date pickers

When a filter is active, all KPI cards, charts, the financial summary, and the deal table update to reflect only deals within that date range.

### Financial Summary
A detailed breakdown grid shows:
- Total Purchase Price, Total Rehab Budget, Total ARV
- Total Financing Costs, Total Holding Costs, Total Closing Costs
- Total Net Profit and Average Deal Score

### Charts
- **ROI Distribution** (Doughnut) — Shows how many deals fall into each ROI bracket (Negative, 0–10%, 10–20%, 20–30%, 30%+)
- **Profit by Deal** (Bar) — Horizontal bar chart showing net profit for each deal, sorted by profitability

### Deal Table
A sortable table lists every deal with columns for Address, Status, Purchase Price, ARV, Rehab, Net Profit, ROI, and Deal Score. Click column headers to sort. Click the star icon to favorite a deal.

### Download Portfolio Summary PDF
Click the **Download PDF** button in the header (visible when you have at least one deal). This opens a branded Portfolio Summary Report in a new browser tab with the print dialog. The PDF includes:
- All KPI cards and financial summary
- Deal status distribution chart
- ROI-by-deal bar chart (top 15 deals)
- Full deal table with totals row
- Freedom One branding and disclaimer

Save as PDF using your browser's print dialog (Ctrl+P / Cmd+P, then select "Save as PDF").

### Tips
- Use date range filtering to compare quarterly or monthly performance
- Download the PDF before investor meetings to present your track record
- Star your best deals so they stand out in the table
- Update deal statuses as they progress through your pipeline`,
  },
  {
    id: 'photos',
    title: 'Property Photos',
    icon: '📷',
    content: `## Property Photo Gallery

Upload and manage multiple photos for each deal to document property condition, share with partners, and include in investor reports.

### Uploading Photos
1. Open the **Deal Analyzer** and scroll down to the **Property Photos** section (below the Investor Report)
2. Click the **upload area** or drag and drop image files into it
3. Supported formats: JPEG, PNG, WebP (max 10 MB per file)
4. You can upload multiple photos at once — they upload in parallel
5. A progress indicator shows upload status for each file

### Managing Photos
- **Add Captions** — Click the pencil icon below any photo to add or edit a caption (e.g., "Kitchen — before renovation", "Master bath water damage")
- **Delete Photos** — Click the trash icon to remove a photo. A confirmation dialog prevents accidental deletion.
- **Lightbox View** — Click any photo thumbnail to open a full-screen lightbox. Use arrow keys or click the navigation arrows to browse through all photos.

### Photos in Shared Deal Links
When you share a deal using the **Share Deal** button in the Investor Report, all uploaded photos are included in the shared link. Recipients see a photo gallery section with thumbnails and lightbox viewing.

### Photos in PDF Reports
When you download the **Investor Report PDF**, all uploaded photos are included in a dedicated "Property Photos" section at the end of the report. Photos are displayed in a grid layout with captions.

### Photo Storage
All photos are stored securely in the cloud (S3). They are associated with the deal's unique ID and persist across devices and sessions. Photos are not stored in your browser — they are always available from any device.

### Tips
- Upload photos immediately after property visits while details are fresh
- Use descriptive captions to document specific issues or features
- Include before/after photos for completed rehabs to build your credibility packet
- Photos make shared deal links much more compelling for partners and lenders`,
  },
  {
    id: 'sharing',
    title: 'Sharing & Reports',
    icon: '📤',
    content: `## Sharing Deals & Generating Reports

The app provides multiple ways to share your deal analysis with partners, lenders, and investors.

### Sharing a Deal Link
1. In the Deal Analyzer, scroll to the **Investor Report** section
2. Click the **Share** button (share icon)
3. The app generates a unique shareable URL and copies it to your clipboard
4. Send the link to anyone — they can view the full deal analysis without logging in

The shared link includes:
- Complete property details and address
- All comparable sales with pricing
- Rehab cost breakdown
- Financing terms and costs
- Profitability metrics (ROI, net profit, deal score)
- Property photos (if uploaded)
- Professional Freedom One branding

### Downloading a PDF Report
1. In the Deal Analyzer, scroll to the **Investor Report** section
2. Click the **Download PDF** button
3. A new browser tab opens with a professionally formatted report
4. Use your browser's print dialog (Ctrl+P / Cmd+P) to save as PDF

The PDF report includes:
- Property overview with address and key metrics
- Financial summary (purchase, rehab, ARV, profit)
- Comparable sales table
- Rehab cost breakdown
- Financing details
- Property photos with captions
- Deal score and verdict
- Freedom One branding and disclaimer

### Emailing a Report
1. In the Investor Report section, click the **Email** button (envelope icon)
2. Enter the recipient's email address
3. The app sends a professionally formatted email with the deal summary
4. The recipient receives a branded email with key metrics and a link to the full analysis

### Portfolio Summary PDF
From the **Portfolio Dashboard**, click **Download PDF** to generate a summary of all your deals. See the Portfolio Dashboard section for details.

### Shared Link View Notifications
When someone opens your shared deal link, you receive a notification:
- **First view** — Notified immediately when the link is first opened
- **Every 5th view** — Notified at 5, 10, 15, 20 views, etc.
- Notifications include the property address, total view count, and share ID
- View all your shared links and their view counts in the **My Shared Links** section on the Saved Deals page

### Tips
- Share deal links with your lender when applying for financing — it shows you do thorough analysis
- Include the PDF in your credibility packet when meeting new partners
- Email reports to your CPA for tax planning discussions
- Use shared links to collaborate with partners on deal evaluation
- Check your shared link view counts to gauge investor interest`,
  },
  {
    id: 'quick-check',
    title: 'Quick Check',
    icon: '⚡',
    content: `## Quick Check Tool

The Quick Check tool provides a fast, simplified deal screening before you commit to a full analysis.

### How to Use Quick Check
1. Navigate to **Quick Check** from the navigation menu
2. Enter the basic property details: address, purchase price, estimated ARV, and estimated rehab cost
3. The tool instantly calculates key metrics:
   - **70% Rule** — Whether the deal passes the standard investor screening formula
   - **Maximum Allowable Offer (MAO)** — The highest price you should pay
   - **Estimated Profit** — Quick profit projection
   - **ROI Estimate** — Approximate return on investment
4. If the deal looks promising, click **Full Analysis** to open it in the Deal Analyzer with all details pre-filled

### When to Use Quick Check vs. Full Analyzer
- **Quick Check** — Use when you receive a new lead and need a 30-second screening. Great for driving for dollars, reviewing wholesaler emails, or scanning MLS listings.
- **Full Analyzer** — Use when a deal passes the quick screen and you want detailed analysis with comps, scope of work, financing, and profitability metrics.

### Tips
- Screen 10–20 deals per day with Quick Check to build deal flow
- Only move deals that pass the 70% rule to full analysis
- Keep your ARV and rehab estimates conservative during quick screening`,
  },
  {
    id: 'renovation-designer',
    title: 'Renovation Designer',
    icon: '🎨',
    content: `## Renovation Designer

The Renovation Designer helps you visualize and plan your rehab by selecting design styles, material finishes, and layout options for each room.

### How to Use
1. Navigate to **Renovation Designer** from the navigation menu or the Deal Analyzer
2. Select a room type (Kitchen, Bathroom, Living Room, Bedroom, etc.)
3. Browse design style options for that room
4. Select material tiers and finishes to see how they affect the budget
5. View estimated costs for each design choice

### Design Categories
- **Kitchen** — Cabinet styles, countertop materials, backsplash options, appliance packages
- **Bathroom** — Vanity styles, tile options, fixture finishes, shower/tub configurations
- **Living Areas** — Flooring types, paint palettes, trim and molding options
- **Exterior** — Siding, landscaping, curb appeal improvements

### Product Verification
All materials in the Renovation Designer display product verification badges showing whether each Home Depot product is verified, discontinued, or unavailable. Price change indicators show if costs have gone up or down since the original listing. Discontinued products display suggested alternatives with links and pricing.

### Integration with Deal Analyzer
Design selections in the Renovation Designer can inform your rehab budget in the Deal Analyzer. Use the designer to explore options and costs before committing to a material tier in your scope of work.

### Tips
- Match your design choices to the neighborhood — don't over-improve for the area
- Use Rental Grade for investment properties, Standard for typical neighborhoods, Luxury for upscale areas
- Check product verification badges before ordering materials — discontinued items may need substitution
- Take screenshots of your design selections to share with contractors`,
  },
  {
    id: 'pipeline',
    title: 'Pipeline / Deal Tracker',
    icon: '📊',
    content: `## Pipeline / Deal Tracker

The Pipeline is a Kanban-style deal tracker that lets you manage your deals through every stage of the investment process.

### Accessing the Pipeline
Click **Pipeline** in the top navigation bar. The Pipeline requires you to be logged in.

### Pipeline Stages
Deals move through these stages (columns):
- **Lead** — New opportunities you are evaluating
- **Analyzing** — Running numbers in the Deal Analyzer
- **Offer Made** — You have submitted an offer
- **Under Contract** — Offer accepted, in due diligence
- **Rehab** — Renovation in progress
- **Listed** — Property is on the market
- **Closed** — Deal is complete
- **Dead** — Deal fell through or you passed

### Managing Deals
- **Add a deal** — Click the "+" button in any column to create a new pipeline deal
- **Move deals** — Drag and drop deals between columns, or use the stage dropdown
- **Deal details** — Click any deal card to open the detail view with full property info, timeline, notes, documents, and contacts
- **Timeline** — Every stage change and note is logged in the deal timeline
- **Contacts** — Add contacts (agent, seller, contractor, lender) to each deal
- **Documents** — Track documents sent and received

### Deal Detail Page
Click any deal in the Pipeline to open its detail page (/pipeline/:id). This page shows:
- Property information and financial summary
- Stage history timeline with dates
- Notes and activity log
- Associated contacts
- Quick actions (change stage, add note, add contact)

### Tips
- Move deals to the correct stage as soon as status changes — this keeps your pipeline accurate
- Add notes after every phone call or property visit
- Use the Pipeline alongside the Deal Analyzer for a complete workflow`,
  },
  {
    id: 'deal-comparison',
    title: 'Deal Comparison',
    icon: '⚖️',
    content: `## Deal Comparison (Team Tier)

The Deal Comparison tool lets you view 2–6 saved deals side by side to compare key metrics and make informed decisions.

### How to Access
1. Go to **Saved Deals**
2. Select 2–6 deals using the checkboxes (Team tier required)
3. Click **Compare Selected** in the bulk actions bar
4. The app opens the comparison view at /compare

### What’s Compared
The comparison table shows these metrics for each deal:
- Property address and location
- Purchase price, ARV, and rehab cost
- Net profit and ROI percentage
- Deal score and verdict
- Financing costs and holding costs
- Square footage, beds, baths
- Status and market area

### Tips
- Compare deals in the same market to identify the best opportunity
- Use comparison before making final offer decisions
- Export or screenshot the comparison for partner discussions`,
  },
  {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    icon: '📈',
    content: `## Analytics Dashboard (Team Tier)

The Analytics Dashboard provides advanced performance metrics and visualizations for your deal portfolio.

### Accessing the Dashboard
Navigate to **Analytics** from the navigation menu or your Profile page. Requires Team subscription or Admin access.

### Dashboard Metrics
- **Total deals** and deals by status
- **Average ROI** and average deal score across your portfolio
- **Profit trends** over time
- **Market distribution** — see which markets you are most active in
- **Performance charts** — visual breakdowns of your investment activity

### Tips
- Review the dashboard monthly to track your investing progress
- Use the data to identify which markets and deal types perform best for you
- Share dashboard insights with partners and lenders to demonstrate your track record`,
  },
  {
    id: 'profit-calculator',
    title: 'Profit Calculator',
    icon: '💰',
    content: `## Profit Calculator (Elite & Team Tiers)

The Profit Calculator is an advanced tool that models six different exit strategy scenarios for any property.

### Accessing the Calculator
Click **Profit Calc** in the top navigation bar. Requires Elite or Team subscription.

### Six Scenarios
1. **Fix & Flip** — Buy, renovate, and sell for profit
2. **Wholesale** — Assign the contract to another investor for a fee
3. **BRRRR** — Buy, Rehab, Rent, Refinance, Repeat
4. **Buy & Hold** — Long-term rental income analysis
5. **Subject-To** — Take over existing financing
6. **Short-Term Rental** — Airbnb/VRBO income projections

### How to Use
1. Enter the property details (address, purchase price, ARV, rehab cost)
2. Configure scenario-specific inputs (rental income, refinance terms, wholesale fee, etc.)
3. View the profitability analysis for each scenario
4. Compare scenarios to determine the best exit strategy

### Tips
- Run all six scenarios on every deal to find the most profitable exit
- The BRRRR calculator includes cash-out refinance modeling
- Use the Profit Calc Guide page for detailed instructions on each scenario`,
  },
  {
    id: 'profile-settings',
    title: 'Profile & Settings',
    icon: '⚙️',
    content: `## Profile & Settings

Your Profile page is your account hub for managing personal information, subscription status, and app preferences.

### Accessing Your Profile
Click your avatar or name in the top-right corner of the navigation bar, or navigate to **/profile**.

### Profile Information
- **Name and email** — Displayed on your account and used for certificates
- **Current subscription plan** — Shows your active tier (Free, Pro, Elite, or Team)
- **Subscription management** — Links to upgrade, manage, or cancel your plan

### Replay Feature Tour
If you want to see the subscription features walkthrough again:
1. Go to your **Profile** page
2. Click the **Replay Feature Tour** button
3. The guided tour will restart, highlighting key features based on your subscription tier

### White-Label Branding (Team Tier)
Team subscribers can access **White-Label Settings** from their Profile to customize:
- Company logo and name on all reports
- Custom branding on investor presentations
- Branded portfolio PDFs and shared deal links

### Tips
- Set up your name before completing the course — it appears on your completion certificate
- Check your Profile page to verify your subscription status
- Use the Replay Tour after upgrading to discover new features`,
  },
  {
    id: 'free-guide',
    title: 'Free Guide & Lead Capture',
    icon: '📖',
    content: `## Free Guide & Lead Capture

The Free Guide page is a lead generation tool that offers visitors a downloadable guide in exchange for their email address.

### How It Works
1. Visitors land on the **/free-guide** page
2. They see "5 Costly Mistakes Every New Flipper Makes" with compelling descriptions
3. They enter their email address and click Download
4. The guide is delivered and their email is captured for follow-up

### For Site Owners
- The Free Guide page is linked from the home page and can be shared on social media
- Email addresses collected can be used for email marketing campaigns
- The guide content establishes credibility and drives signups`,
  },
  {
    id: 'blog-admin',
    title: 'Blog & Auto-Publishing',
    icon: '✍️',
    content: `## Blog & Auto-Publishing (Admin)

The Blog system includes a public-facing blog and an admin panel for content management.

### Public Blog
Accessible at **/blog**, the blog displays published articles with:
- Featured images and excerpts
- Full article view with markdown rendering
- Category and tag organization

### Admin Blog Panel
Accessible at **/admin/blog** (admin only):
- **Create posts** — Write articles with a rich markdown editor
- **Schedule posts** — Set a future publish date for automatic publishing
- **Draft management** — Save drafts and publish when ready
- **AI Auto-Generate** — Generate blog posts automatically using AI
- **Facebook Auto-Posting** — Connect your Facebook page to automatically share new blog posts

### Facebook Integration
In the Admin Blog panel, you can connect a Facebook page:
1. Enter your Facebook Page ID and Access Token
2. Test the connection
3. When enabled, new blog posts are automatically shared to your Facebook page

### Tips
- Use scheduled posts to maintain a consistent publishing cadence
- The AI auto-generate feature creates SEO-friendly real estate content
- Blog posts help drive organic traffic to your site`,
  },
  {
    id: 'product-catalog',
    title: 'Product Catalog & Verification',
    icon: '📦',
    content: `## Product Catalog & Verification System

The Product Catalog system tracks the availability and pricing of all 100+ Home Depot products referenced throughout the app (Rehab Estimator, SOW Templates, Renovation Designer). It ensures you always have accurate, up-to-date product information.

### How It Works
Every product in the system is tracked with:
- **Verification Status** — Whether the product is currently available on Home Depot
- **Current Price** — The latest verified price (compared to the original listed price)
- **Price Change Tracking** — Percentage increase or decrease since original listing
- **Alternative Suggestions** — Replacement products for discontinued items

### Status Badges
You'll see status badges next to every Home Depot product link:
- **Verified** (green checkmark) — Product confirmed available with current pricing
- **Discontinued** (red X) — Product no longer available; check for suggested alternative below
- **Unavailable** (yellow warning) — Temporarily out of stock or region-restricted
- **Unverified** (gray question mark) — Not yet checked

### Price Change Indicators
When a product's price has changed:
- **Red up arrow** with percentage — Price has increased (e.g., +5.3%)
- **Green down arrow** with percentage — Price has decreased (e.g., -2.1%)

This helps you adjust your rehab budgets to reflect current market pricing.

### Alternative Products
When a product is discontinued, the system suggests a comparable replacement:
- The alternative appears below the discontinued badge with an arrow (→)
- Click the alternative name to open its Home Depot product page
- The alternative price is shown for budget comparison

### Where You'll See It
Product verification badges appear in:
1. **Rehab Estimator** — In the detailed scope of work line items
2. **SOW Templates** — In the room template product columns
3. **Renovation Designer** — In the material cost breakdown tables

### Admin: Product Catalog Dashboard
Admins have a dedicated **Admin Product Catalog** page (accessible from the Admin dropdown in the navigation bar) with full management capabilities:

**Dashboard Stats** — Seven summary cards showing total products, verified count, discontinued count, unavailable count, unverified count, products with price alerts (>10% change), and products with alternatives assigned.

**Product Table** — Full searchable, filterable table of all 151+ products with:
- Status badge, product name, SKU, category, original price, current price, price change %, and last checked date
- Filter by status (Verified, Discontinued, Unavailable, Unknown)
- Filter by category (Kitchen, Bathroom, Flooring, etc.)
- Search by product name or SKU number
- Pagination (25 products per page)

**Management Actions:**
- **Seed Catalog** — One-click button to populate the database from the scope of work product data (151 products)
- **Auto-Verify Unknown** — Triggers AI-powered verification of all unverified products, checking availability, current pricing, and suggesting alternatives for discontinued items
- **Full Verify All** — Runs a complete scheduled verification of every product in the catalog (not just unknowns), records results in the verification log, and sends price alert notifications
- **Verify Individual** — Verify a single product on demand by clicking the refresh icon
- **Edit Product** — Update status, current price, and alternative product for any item
- **Set Alternative** — Assign a replacement product (SKU, name, URL, price) for discontinued items
- **Bulk Replace** — For discontinued products, replace the product across all saved deals in one click (arrow icon). This updates the dealData JSON in every saved deal that references the old SKU
- **Price History** — Click the chart icon or sparkline to view the full price history for any product, showing every recorded price point with dates and percentage changes
- **Export CSV** — Download the full catalog as a CSV file for offline analysis

### Price History Tracking
Every time a product is verified, its price is recorded in the price history database. This creates a timeline of price changes for each product:
- **Sparkline Charts** — The Trend column in the product table shows a mini sparkline chart of recent prices. Red = price increasing, green = price decreasing, gray = stable
- **Detailed History** — Click any sparkline or the chart icon to open the full price history dialog showing every recorded price point with date, price, change percentage, and verification status
- **Trend Analysis** — Spot pricing trends across your rehab materials to anticipate budget impacts

### Verification History
The **Verification History** tab in the Admin Product Catalog shows a log of all verification runs:
- Date and time of each run
- Whether it was triggered manually or by scheduled automation
- Total products scanned, verified count, discontinued count, unavailable count
- Number of price alerts triggered
- Duration of the verification run

### Price Alert Notifications
When the auto-verify system detects a price change greater than 10%, the site owner receives an automatic notification with:
- The product name and SKU
- The original price and new price
- The percentage change
- A direct link to the Home Depot product page

This ensures rehab budgets stay accurate without manual price checking.

### Bulk Product Replacement
When a product is discontinued, admins can bulk-replace it across all saved deals:
1. Find the discontinued product in the catalog table
2. Click the swap icon (↔) in the Actions column
3. Enter the replacement product details (name, SKU, URL, price) — these auto-fill from the alternative if one is set
4. Click "Replace in All Deals" to update every saved deal that references the old SKU
5. The owner receives a notification confirming how many deals were updated

This prevents stale product references in saved deal analyses.

### Admin Navigation
The Admin dropdown menu (gold crown icon) appears in the navigation bar only for users with the admin role. It provides quick access to:
- **Product Catalog** — Product verification and management dashboard
- **Blog Manager** — Blog post creation and management
- **Gifted Subscriptions** — Gift subscription management

### Tips
- Products are cached for 5 minutes to minimize API calls
- Hover over any status badge for detailed information
- When a product shows as discontinued, always check the suggested alternative before sourcing materials
- Price changes are calculated as basis points for precision (530 = 5.30%)
- Run Auto-Verify periodically (monthly recommended) to keep the catalog current
- Seed the catalog first before running Auto-Verify — seeding creates the database entries that verification checks`,
  },
  {
    id: 'material-cost-tracker',
    title: 'Material Cost Tracker',
    icon: '📈',
    content: `## Material Cost Tracker

The Material Cost Tracker is a subscriber-facing dashboard that displays real-time pricing trends for rehab materials across 11 categories. It helps investors anticipate budget changes by monitoring Home Depot product prices over time.

### Accessing the Tracker
Navigate to **Material Cost Tracker** from the main navigation bar (the chart icon). This feature is available on **Pro**, **Elite**, and **Team** subscription plans.

### Dashboard Overview
The top of the page shows four summary cards:
- **Total Products** — Number of products tracked in the catalog
- **Categories** — Number of material categories (11 total)
- **Avg Price Change** — Average price change across all products (green = decrease, red = increase)
- **Price Alerts** — Number of categories with significant price movements

### Interactive Charts
The dashboard includes four interactive Chart.js visualizations:

1. **Average Product Price by Category** — Vertical bar chart showing the average product price across all 11 categories, sorted from highest to lowest. Hover over any bar to see the exact dollar amount.

2. **Price Change by Category (%)** — Horizontal bar chart showing the average price change percentage for each category. Red bars indicate price increases, green bars indicate decreases.

3. **Price Trends Over Time** — Multi-line chart tracking average prices across verification runs. When viewing all categories, the top 6 are shown for readability. Click a category card to filter the chart to a single category.

4. **Verification Status Distribution** — Horizontal progress bar showing the breakdown of product statuses (Verified, Discontinued, Unavailable, Unverified) with color-coded segments and percentage labels.

### Category Breakdown
Below the charts, you'll find a grid of category cards covering:
- Kitchen, Bathroom, Bedroom, Living Room
- Electrical, HVAC, Plumbing
- Roof & Gutter, Structural & Windows
- Landscaping & Exterior, Garage

Each card shows:
- Number of products in the category
- Average product price
- Average price change percentage
- Verification status counts (verified, discontinued, unavailable)

**Click any category card** to filter the product table below to show only products in that category.

### Product Table
The full product table displays:
- **Product Name** and SKU number
- **Category** with color-coded indicator
- **Original Price** — The price when the product was first cataloged
- **Current Price** — The latest verified price
- **Change** — Price change indicator (red up arrow for increases, green down arrow for decreases)
- **Status** — Verification status badge (Verified, Discontinued, Unavailable, Not Verified)
- **Link** — Direct link to the Home Depot product page

Use the **search bar** to find specific products by name or SKU, and the **sort dropdown** to sort by name, price change, or price.

### Discontinued Product Alternatives
When products are discontinued, the tracker shows a dedicated section at the bottom with:
- The original product name (with strikethrough)
- The suggested alternative product with name, price, and a direct link

### Automated Monthly Verification
The product catalog is automatically verified on the 1st of every month at 3:00 AM. This scheduled process:
1. Checks all 100+ products for availability
2. Updates current prices
3. Flags discontinued or unavailable items
4. Records price history for trend tracking
5. Sends notifications for price changes greater than 10%

### Tips
- Check the tracker before creating rehab budgets to use the most current pricing
- Watch for red price increase indicators — they may signal supply chain issues or seasonal demand
- Green price decreases can indicate good buying opportunities
- Discontinued products will have suggested alternatives — click through to verify the replacement fits your project
- The tracker updates automatically each month, but admins can trigger manual verification at any time from the Admin Product Catalog page`,
  },
  {
    id: 'business-in-a-box',
    title: 'Business-in-a-Box',
    icon: '📦',
    content: `## Business-in-a-Box (BIB)

The Business-in-a-Box is a **standalone, one-time purchase product** separate from the Freedom One subscription app. It is a complete real estate investing education and resource package designed for investors who want everything they need to start or scale their business in one package.

### What Is the Business-in-a-Box?

The BIB is a **$1,997 one-time payment** product that includes:
- **Complete Investing Course** — 12 Modules, 65+ Micro-Lessons covering Fix & Flip, Wholesale, BRRRR, Subject-To, and Short-Term Rentals
- **Marketing Templates** — Direct mail letters, postcards, email sequences, and cold call scripts
- **Contract Templates** — Assignable purchase agreements, wholesale contracts, and assignment contracts
- **SOW Templates** — Professional scope of work templates for all 14 room categories
- **Lender Directory** — Curated hard money and private lender contacts
- **Investor Checklists** — Due diligence, closing, rehab, and property inspection checklists
- **Credibility Packet Builder** — Track record templates and project summary formats
- **Profit Calculator Spreadsheet** — Excel-based calculator covering 6 investment scenarios
- **Private Money Prospectus** — Template to attract private money lenders
- **3-Option Seller Brochure** — Present sellers with cash, terms, and creative financing options
- **Rehab Budget Worksheet** — Detailed budget tracking template
- **State Reference Guide** — State-by-state investing regulations
- **Lead Magnet PDF** — Ready-to-use lead capture document
- **Course Completion Certificate** — Professional certificate template
- **Lifetime Access** — All future course updates included at no extra cost

### BIB vs. App Subscription

The BIB and the app subscription are **different products** that serve different purposes:

| Feature | Business-in-a-Box ($1,997) | App Subscription ($99\u2013$349/mo) |
|---------|---------------------------|-----------------------------------|
| Course Videos | \u2713 All 65+ lessons | \u2713 Based on tier |
| Templates (Download) | \u2713 All included | \u2713 Based on tier |
| Deal Analyzer Tool | \u2717 | \u2713 Interactive tool |
| Rehab Estimator Tool | \u2717 | \u2713 With Home Depot pricing |
| Pipeline CRM | \u2717 | \u2713 Deal tracking |
| Renovation Designer | \u2717 | \u2713 AI-powered |
| Portfolio Dashboard | \u2717 | \u2713 With PDF export |
| White-Label Reports | \u2717 | \u2713 Team tier |
| Payment Type | One-time $1,997 | Monthly or annual |
| Access Duration | Lifetime | Active subscription |

**In simple terms:** The BIB gives you the **education and static resources** (course + templates as downloadable files). The app gives you the **live digital tools** (Deal Analyzer, Rehab Estimator, Pipeline CRM, etc.).

### BIB Sales Funnel

The BIB is sold through a **sequential sales funnel** with two optional upsells:

1. **BIB Landing Page** (\`/business-in-a-box\`) — Main sales page for the core BIB product at $1,997
2. **OTO1: Lifetime App Access** (\`/bib/oto1\`) — After purchasing the BIB, buyers are offered lifetime access to the Freedom One app for $2,997 (one-time, replaces monthly subscription forever). A downsell of 1-year access at $997 is offered if they decline.
3. **OTO2: Done-For-You Marketing Kit** (\`/bib/oto2\`) — 6 Facebook ad campaigns, 22 pre-written emails, 6-month social media calendar, direct mail templates, and cold call scripts for $497. A downsell Marketing Starter Pack at $197 is offered if they decline.
4. **Thank You Page** (\`/bib/thank-you\`) — Order confirmation with next steps and access instructions.

### BIB Pricing Summary

| Product | Price | Type |
|---------|-------|------|
| Core Business-in-a-Box | $1,997 | One-time |
| OTO1: Lifetime App Access | $2,997 | One-time |
| OTO1 Downsell: 1-Year App Access | $997 | One-time |
| OTO2: Done-For-You Marketing Kit | $497 | One-time |
| OTO2 Downsell: Marketing Starter Pack | $197 | One-time |

### How the BIB Is Accessed

The BIB landing page is **not linked from the main app navigation**. It is a standalone sales funnel accessed via direct URL. Customers arrive through:
- Facebook and Instagram ad campaigns
- Email marketing sequences
- Direct mail campaigns
- Social media posts
- Personal outreach and networking

This separation is intentional — the BIB is a one-time purchase product and should not compete with the recurring subscription model in the main app.

### Stripe Checkout Integration

All BIB payments are processed through Stripe. After purchase:
1. The buyer is redirected to the OTO1 upsell page
2. Each Accept/Decline choice moves them through the funnel sequentially
3. After the final offer, they land on the Thank You page with access instructions
4. Confirmation emails are sent with download links and login credentials

### Contact

For BIB-related questions: **contact@freedomoneproperties.com**`,
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
