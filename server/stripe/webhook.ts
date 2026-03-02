import express, { Request, Response } from "express";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil" as any,
});

export function registerStripeWebhook(app: express.Express) {
  // MUST be registered BEFORE express.json() middleware
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error("[Webhook] Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.user_id;
            const customerId = session.customer as string;

            if (userId) {
              const db = await getDb();
              if (db) {
                await db
                  .update(users)
                  .set({
                    stripeCustomerId: customerId,
                    subscriptionPlan: (session.metadata?.plan as "free" | "pro" | "elite" | "team") || "pro",
                  })
                  .where(eq(users.id, parseInt(userId)));
                console.log(`[Webhook] Updated user ${userId} with plan ${session.metadata?.plan}`);
              }
            }
            break;
          }

          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;
            const status = subscription.status;

            const db = await getDb();
            if (db) {
              if (status === "active" || status === "trialing") {
                // Subscription is active or in trial — grant full plan access
                const plan = subscription.metadata?.plan as "pro" | "elite" | "team" | undefined;
                if (plan) {
                  await db
                    .update(users)
                    .set({ subscriptionPlan: plan })
                    .where(eq(users.stripeCustomerId, customerId));
                }
                console.log(`[Webhook] Subscription ${status} for customer ${customerId} (plan: ${plan || 'unchanged'})`);
              } else if (status === "canceled" || status === "unpaid" || status === "past_due") {
                // Downgrade to free
                await db
                  .update(users)
                  .set({ subscriptionPlan: "free" })
                  .where(eq(users.stripeCustomerId, customerId));
                console.log(`[Webhook] Downgraded customer ${customerId} to free (status: ${status})`);
              }
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            const db = await getDb();
            if (db) {
              await db
                .update(users)
                .set({ subscriptionPlan: "free" })
                .where(eq(users.stripeCustomerId, customerId));
              console.log(`[Webhook] Subscription deleted for customer ${customerId}, downgraded to free`);
            }
            break;
          }

          default:
            console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err) {
        console.error(`[Webhook] Error processing ${event.type}:`, err);
      }

      res.json({ received: true });
    }
  );
}
