// ============================================================
// Fix & Flip Analyzer — User Manual
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

The Fix & Flip Analyzer is a comprehensive real estate investment analysis tool designed for investors, wholesalers, and flippers. It helps you evaluate potential deals by calculating profitability, estimating rehab costs, managing comparable sales, and determining the best exit strategy for each property.

### What You Can Do

- **Analyze any property** — Enter property details and get instant profitability calculations
- **Manage comparable sales** — Add comps manually to determine accurate ARV
- **Estimate rehab costs** — Use preset levels or detailed room-by-room scope of work with real material pricing
- **Regional cost adjustments** — Costs automatically adjust based on the property's market location
- **Material tier selection** — Choose Rental, Standard, or Luxury grade materials based on the neighborhood
- **Visualize the rehab timeline** — Interactive Gantt chart shows project phases and dependencies
- **Calculate financing costs** — Hard money loan calculator with customizable terms
- **Track all costs** — Holding costs, closing costs, and financing all factored in
- **Profitability dashboard** — Real-time deal score, ROI, cash-on-cash return, and 70% rule analysis
- **Generate contracts** — Assignable purchase agreements and wholesale contracts
- **Access marketing templates** — Direct mail letters, postcards, email sequences, and more
- **Learn from the course** — Comprehensive fix & flip education with all exit strategies`,
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

### Regional Cost Indicator
Once you enter a city and state, the app displays the regional cost adjustment factors. For example, if you enter San Francisco, CA, you will see materials and labor factors above 100% of the national average. If you enter a rural Midwest city, you will see factors below 100%.`,
  },
  {
    id: 'comps',
    title: 'Comparable Sales',
    icon: '📊',
    content: `## Managing Comparable Sales

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
- **DOM** — Comps that sold in 90 days or less indicate strong demand`,
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
This is the more powerful mode. It breaks down the rehab into individual rooms/phases:

- **Demolition** — Tear-out and disposal
- **Structural** — Foundation, framing, load-bearing walls
- **Roofing** — Roof repair or replacement
- **Plumbing** — Pipes, fixtures, water heater
- **Electrical** — Wiring, panel, outlets, lighting
- **HVAC** — Heating, cooling, ductwork
- **Insulation & Drywall** — Walls and ceilings
- **Flooring** — All floor coverings
- **Kitchen** — Cabinets, counters, appliances, backsplash
- **Bathrooms** — Vanities, toilets, tubs/showers, tile
- **Painting** — Interior and exterior
- **Exterior** — Siding, landscaping, driveway, fencing
- **Final Cleanup** — Cleaning, staging prep, punch list

### Material Tiers
Choose the tier that matches the neighborhood:
- **Rental Grade** — Builder-grade materials for investment/rental properties
- **Standard** — Mid-range materials for typical homebuyer neighborhoods
- **Luxury** — High-end finishes for upscale neighborhoods

### Expanding Room Details
Click on any room to expand and see the detailed material breakdown including specific products, quantities, material costs, and labor costs.

### The Gantt Chart
The timeline visualization shows:
- Each phase as a colored bar
- Phase dependencies (e.g., painting cannot start until flooring is done)
- Duration in days
- Total project timeline in weeks
- Cost per phase`,
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
    id: 'contracts',
    title: 'Contracts & Documents',
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
];
