/**
 * Freedom One subscription plans.
 * Prices are defined here for Stripe Checkout.
 */

export const PLANS = {
  free: {
    name: "Free",
    description: "Basic deal analysis tools",
    features: [
      "Basic Deal Analyzer (3/month)",
      "70% Rule Calculator",
      "Blog & Educational Content",
      "Marketing Templates (View Only)",
    ],
    priceMonthly: 0, // cents
    priceYearly: 0,
    priceId: null,
  },
  pro: {
    name: "Pro",
    description: "Full analysis suite for active investors",
    features: [
      "Everything in Free",
      "Unlimited Saved Deals",
      "Full Rehab Estimator with Home Depot SKUs",
      "SOW Templates (All 14 Rooms)",
      "Investor Presentation Reports",
      "Contract Templates (Download)",
      "Marketing Templates (Download)",
      "Lender Directory",
      "Regional Cost Adjustments",
    ],
    priceMonthly: 9900, // $99/mo
    priceYearly: 99000, // $990/yr
    priceId: "pro_monthly",
    highlighted: true,
  },
  elite: {
    name: "Elite",
    description: "Complete system with course & Profit Calculator",
    features: [
      "Everything in Pro",
      "Profit Calculator (All 6 Scenarios)",
      "Full Course Access (8 Modules + Bonus)",
      "Video Lesson Scripts & Guides",
      "Property Listings Page",
      "Email Investor Reports",
      "Priority Support",
      "Gantt Chart Export (PDF)",
    ],
    priceMonthly: 17900, // $179/mo
    priceYearly: 179000, // $1790/yr
    priceId: "elite_monthly",
  },
  team: {
    name: "Team",
    description: "White-label branding & AI-powered tools for your investment business",
    features: [
      "Everything in Elite",
      "White-Label Reports (Your Logo & Branding)",
      "Custom Branded Investor Reports",
      "Custom Branded Portfolio PDFs",
      "AI Deal Summary Generator",
      "Full Database Export (CSV)",
      "Branded Shared Deal Links",
      "Dedicated Onboarding Support",
    ],
    priceMonthly: 28900, // $289/mo
    priceYearly: 289000, // $2890/yr
    priceId: "team_monthly",
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanByPriceId(priceId: string): PlanKey | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) return key as PlanKey;
  }
  return null;
}
