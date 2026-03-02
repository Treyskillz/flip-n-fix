import Stripe from "stripe";
import { PLANS, PlanKey } from "./products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil" as any,
});

export interface CreateCheckoutParams {
  userId: number;
  userEmail: string;
  userName: string;
  plan: PlanKey;
  interval: "month" | "year";
  origin: string;
}

export async function createCheckoutSession(params: CreateCheckoutParams) {
  const { userId, userEmail, userName, plan, interval, origin } = params;

  const planDef = PLANS[plan];
  if (!planDef || plan === "free") {
    throw new Error("Cannot create checkout for free plan");
  }

  const unitAmount = interval === "year" ? planDef.priceYearly : planDef.priceMonthly;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        user_id: userId.toString(),
        plan: plan,
      },
    },
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName,
      plan: plan,
      interval: interval,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Freedom One ${planDef.name} Plan`,
            description: planDef.description,
          },
          unit_amount: unitAmount,
          recurring: {
            interval: interval,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/pricing?success=true&plan=${plan}`,
    cancel_url: `${origin}/pricing?canceled=true`,
  });

  return { url: session.url, sessionId: session.id };
}

export async function createPortalSession(customerId: string, origin: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/pricing`,
  });

  return { url: session.url };
}
