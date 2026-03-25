/**
 * Business-in-a-Box product definitions.
 * One-time payment products for the BIB sales funnel.
 */

export const BIB_PRODUCTS = {
  /** Main Offer: Business-in-a-Box */
  main: {
    id: "bib_main",
    name: "Freedom One Business-in-a-Box",
    description: "The complete real estate investing business system — course, templates, contracts, tools, and resources.",
    price: 199700, // $1,997
    features: [
      "Complete Real Estate Investing Course (12 Modules, 65+ Micro-Lessons)",
      "All 5 Exit Strategies: Fix & Flip, Wholesale, BRRRR, Subject-To, Short-Term Rentals",
      "Marketing Templates: Direct Mail, Email Sequences, Cold Call Scripts, Postcards",
      "Contract Templates: Assignable Purchase Agreements, Wholesale Contracts, Assignment Contracts",
      "SOW Templates for All 14 Room Categories",
      "Lender Directory: Hard Money & Private Lenders with Rates and Terms",
      "Investor Checklists: Due Diligence, Closing, Rehab, Property Inspection",
      "Credibility Packet Builder: Track Record, Before/After Photos, Project Summaries",
      "Profit Calculator Excel Spreadsheet (6 Scenarios)",
      "Private Money Prospectus Template",
      "3-Option Seller Brochure Template",
      "Price Reduction Request Form",
      "Rehab Budget Worksheet",
      "State-by-State Reference Guide",
      "Lead Magnet: 5 Biggest Mistakes PDF",
      "Course Completion Certificate",
      "Lifetime Access to All Course Materials",
      "All Future Course Updates Included",
    ],
  },

  /** OTO 1: Freedom One Pro App — Lifetime Access */
  oto1: {
    id: "bib_oto1_lifetime",
    name: "Freedom One Pro App — Lifetime Access",
    description: "Full access to the Freedom One app forever. No monthly fees. Every tool, every feature, every future update.",
    price: 299700, // $2,997
    features: [
      "Deal Analyzer with Real-Time Profitability Calculations",
      "Rehab Estimator with 3 Material Tiers & Home Depot Pricing",
      "50+ Metro Market Regional Cost Adjustments",
      "Deal Scoring & 70% Rule Analysis",
      "Pipeline CRM: Track Deals from Lead to Sold",
      "Renovation Designer: AI-Powered Room Visualizations",
      "Portfolio Dashboard with PDF Export",
      "Quick Check Tool: Instant Deal Screening",
      "Contractor Management System",
      "Property Listings Page",
      "White-Label Reports with Your Branding",
      "AI Deal Summary Generator",
      "Material Cost Tracker Dashboard",
      "Share Deal Links with Investors & Partners",
      "CSV Import/Export for Bulk Operations",
      "Deal Comparison (Side-by-Side Analysis)",
      "Analytics Dashboard",
      "All Future App Updates — Forever",
      "Replaces $99–$349/month Subscription",
    ],
  },

  /** OTO 1 Downsell: 1-Year App Access */
  oto1Down: {
    id: "bib_oto1_yearly",
    name: "Freedom One Pro App — 1-Year Access",
    description: "Full app access for 12 months at a fraction of the subscription cost.",
    price: 99700, // $997
    features: [
      "Full App Access for 12 Months",
      "All Pro + Elite Features Included",
      "Deal Analyzer, Rehab Estimator, Pipeline CRM",
      "Renovation Designer & Portfolio Dashboard",
      "All Tools & Features Available During Access Period",
      "Option to Renew at Discounted Rate",
      "Saves Over $1,000 vs. Monthly Subscription",
    ],
  },

  /** OTO 2: Done-For-You Marketing Kit */
  oto2: {
    id: "bib_oto2_marketing",
    name: "Done-For-You Marketing Kit",
    description: "6 months of pre-built marketing campaigns ready to deploy — Facebook ads, direct mail, email sequences, and social media content.",
    price: 49700, // $497
    features: [
      "6 Facebook Ad Campaigns (Motivated Sellers, Absentee Owners, Pre-Foreclosure, Probate, Wholesale Buyers, Brand Awareness)",
      "Complete Ad Copy, Headlines, and Creative Briefs for Each Campaign",
      "Audience Targeting Specifications for Each Campaign",
      "5 Direct Mail Templates: Yellow Letter, Professional Letter, Postcard, Handwritten, Follow-Up Sequence",
      "3 Email Sequences: 7-Day Seller Nurture, 5-Email Buyer Onboarding, 10-Email Sales Funnel",
      "6-Month Social Media Content Calendar (130 Posts with Captions & Hashtags)",
      "Content Pillars: Education, Behind the Scenes, Social Proof, Engagement",
      "Platform-Specific Formatting for Instagram, Facebook, TikTok, LinkedIn",
      "Scheduling Tool Recommendations & Setup Guide",
    ],
  },

  /** OTO 2 Downsell: Marketing Starter Pack */
  oto2Down: {
    id: "bib_oto2_starter",
    name: "Marketing Starter Pack",
    description: "Essential marketing templates to get started — 2 Facebook ads, 2 direct mail pieces, and 30 days of social media content.",
    price: 19700, // $197
    features: [
      "2 Facebook Ad Campaigns (Motivated Sellers + Brand Awareness)",
      "2 Direct Mail Templates (Yellow Letter + Professional Letter)",
      "1 Email Sequence (7-Day Seller Nurture)",
      "30-Day Social Media Content Calendar (20 Posts)",
      "Basic Audience Targeting Guide",
    ],
  },
} as const;

export type BibProductKey = keyof typeof BIB_PRODUCTS;
