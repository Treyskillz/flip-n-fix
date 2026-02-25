import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { PLANS, PlanKey } from "./stripe/products";
import { createCheckoutSession, createPortalSession } from "./stripe/checkout";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  subscription: router({
    // Get available plans
    plans: publicProcedure.query(() => {
      return Object.entries(PLANS).map(([key, plan]) => ({
        id: key as PlanKey,
        ...plan,
      }));
    }),

    // Get current user's subscription status
    status: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { plan: "free" as PlanKey, stripeCustomerId: null };

      const result = await db
        .select({
          subscriptionPlan: users.subscriptionPlan,
          stripeCustomerId: users.stripeCustomerId,
        })
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      return {
        plan: (result[0]?.subscriptionPlan || "free") as PlanKey,
        stripeCustomerId: result[0]?.stripeCustomerId || null,
      };
    }),

    // Create a checkout session
    createCheckout: protectedProcedure
      .input(
        z.object({
          plan: z.enum(["pro", "elite", "team"]),
          interval: z.enum(["month", "year"]).default("month"),
          origin: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const result = await createCheckoutSession({
          userId: ctx.user.id,
          userEmail: ctx.user.email || "",
          userName: ctx.user.name || "",
          plan: input.plan,
          interval: input.interval,
          origin: input.origin,
        });
        return result;
      }),

    // Create a billing portal session (for managing existing subscription)
    createPortal: protectedProcedure
      .input(
        z.object({
          origin: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db
          .select({ stripeCustomerId: users.stripeCustomerId })
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1);

        const customerId = result[0]?.stripeCustomerId;
        if (!customerId) {
          throw new Error("No Stripe customer found. Please subscribe first.");
        }

        return createPortalSession(customerId, input.origin);
      }),
  }),
});

export type AppRouter = typeof appRouter;
