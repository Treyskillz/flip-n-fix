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
    priceMonthly: 3900, // $39/mo
    priceYearly: 39000, // $390/yr
    priceId: "pro_monthly",
    highlighted: true,
  },
  elite: {
    name: "Elite",
    description: "Complete system with course access",
    features: [
      "Everything in Pro",
      "Full Course Access (8 Modules)",
      "Video Lessons",
      "Property Listings Page",
      "Email Investor Reports",
      "Priority Support",
      "Gantt Chart Export",
    ],
    priceMonthly: 7900, // $79/mo
    priceYearly: 79000, // $790/yr
    priceId: "elite_monthly",
  },
  team: {
    name: "Team",
    description: "For investment groups and teams",
    features: [
      "Everything in Elite",
      "Up to 5 Team Members",
      "Shared Deal Pipeline",
      "Team Analytics Dashboard",
      "White-Label Reports",
      "Dedicated Account Manager",
    ],
    priceMonthly: 14900, // $149/mo
    priceYearly: 149000, // $1490/yr
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
