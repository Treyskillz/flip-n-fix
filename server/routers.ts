import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { PLANS, PlanKey } from "./stripe/products";
import { createCheckoutSession, createPortalSession } from "./stripe/checkout";
import { getDb } from "./db";
import { users, sharedDeals } from "../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";
import crypto from "crypto";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── AI Comp Search ──────────────────────────────────────────
  compSearch: router({
    findComps: publicProcedure
      .input(
        z.object({
          address: z.string().min(1),
          city: z.string().min(1),
          state: z.string().min(1),
          zip: z.string().optional(),
          sqft: z.number().min(0),
          beds: z.number().min(0),
          baths: z.number().min(0),
          yearBuilt: z.number().optional(),
          propertyType: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a real estate comparable sales research assistant. Given a subject property, provide 3-5 realistic comparable sales (comps) that an investor would find on the MLS or Zillow/Redfin.

RULES:
- Comps MUST be STANDARD RETAIL SALES ONLY (arms-length transactions)
- NEVER include foreclosures, short sales, REO, bank-owned, or auction sales
- Comps should be RENOVATED or UPDATED properties (matching what the subject will look like after rehab)
- Comps should be within 0.5 miles of the subject address
- Comps should have sold within the last 6 months
- Comps should be within 20% of the subject square footage
- Comps should have similar bed/bath counts (±1)
- Use realistic addresses near the subject property (real street names in that area)
- Use realistic sale prices based on the local market
- All prices should reflect AFTER-RENOVATION values

Return ONLY valid JSON matching the schema. Do not include any explanation.`,
            },
            {
              role: "user",
              content: `Find comparable retail sales for this subject property:

Address: ${input.address}, ${input.city}, ${input.state} ${input.zip || ""}
Square Footage: ${input.sqft}
Bedrooms: ${input.beds}
Bathrooms: ${input.baths}
Year Built: ${input.yearBuilt || "Unknown"}
Property Type: ${input.propertyType || "Single Family"}

Provide 3-5 comparable RENOVATED properties that recently sold as standard retail sales near this address.`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "comp_results",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  comps: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        address: { type: "string", description: "Full street address" },
                        salePrice: { type: "number", description: "Sale price in dollars" },
                        saleDate: { type: "string", description: "Sale date in YYYY-MM-DD format" },
                        daysOnMarket: { type: "number", description: "Days on market before sale" },
                        sqft: { type: "number", description: "Square footage" },
                        beds: { type: "number", description: "Number of bedrooms" },
                        baths: { type: "number", description: "Number of bathrooms" },
                        yearBuilt: { type: "number", description: "Year the property was built" },
                        condition: { type: "string", enum: ["renovated", "updated"], description: "Property condition" },
                        neighborhood: { type: "string", description: "Neighborhood or subdivision name" },
                      },
                      required: ["address", "salePrice", "saleDate", "daysOnMarket", "sqft", "beds", "baths", "yearBuilt", "condition", "neighborhood"],
                      additionalProperties: false,
                    },
                  },
                  marketNotes: { type: "string", description: "Brief note about the local market conditions" },
                },
                required: ["comps", "marketNotes"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new Error("Failed to get comp suggestions from AI");
        }

        try {
          const parsed = JSON.parse(content);
          return {
            comps: parsed.comps || [],
            marketNotes: parsed.marketNotes || "",
            disclaimer: "AI-generated estimates based on market analysis. Verify all data with MLS, county records, or your real estate agent before making investment decisions.",
          };
        } catch {
          throw new Error("Failed to parse AI comp results");
        }
      }),
  }),

  // ─── Shared Deals ──────────────────────────────────────────────
  shareDeal: router({
    create: publicProcedure
      .input(
        z.object({
          dealData: z.string().min(1), // JSON string of full deal analysis
          propertyAddress: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const shareId = crypto.randomBytes(12).toString("hex"); // 24-char unique ID
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // expires in 30 days

        await db.insert(sharedDeals).values({
          shareId,
          userId: ctx.user?.id || null,
          propertyAddress: input.propertyAddress || null,
          dealData: input.dealData,
          expiresAt,
        });

        return { shareId };
      }),

    get: publicProcedure
      .input(z.object({ shareId: z.string().min(1) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db
          .select()
          .from(sharedDeals)
          .where(eq(sharedDeals.shareId, input.shareId))
          .limit(1);

        if (!result[0]) return null;

        const deal = result[0];

        // Check expiration
        if (deal.expiresAt && new Date(deal.expiresAt) < new Date()) {
          return null; // expired
        }

        // Increment view count
        await db
          .update(sharedDeals)
          .set({ viewCount: sql`${sharedDeals.viewCount} + 1` })
          .where(eq(sharedDeals.shareId, input.shareId));

        return {
          shareId: deal.shareId,
          dealData: deal.dealData,
          propertyAddress: deal.propertyAddress,
          createdAt: deal.createdAt,
          viewCount: deal.viewCount + 1,
        };
      }),
  }),

  // ─── Room Renovation Designer ─────────────────────────────────
  renovation: router({
    generateDesign: publicProcedure
      .input(
        z.object({
          roomType: z.string().min(1),
          tier: z.enum(["rental", "standard", "luxury"]),
          imageUrl: z.string().url(),
          propertyStyle: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const tierDescriptions: Record<string, string> = {
          rental: "Budget rental-grade renovation: basic laminate countertops, stock white cabinets, vinyl plank flooring, basic lighting fixtures, standard white appliances. Clean and functional but minimal upgrades. Builder-grade materials throughout.",
          standard: "Mid-range standard renovation: quartz countertops, shaker-style cabinets in white or gray, hardwood or luxury vinyl plank flooring, stainless steel appliances, subway tile backsplash, modern pendant lighting, brushed nickel or matte black hardware. Popular with homebuyers.",
          luxury: "High-end luxury renovation: natural stone or premium quartz countertops with waterfall edge, custom inset cabinets, wide-plank hardwood floors, professional-grade stainless appliances, designer tile backsplash, statement lighting fixtures, solid brass hardware, crown molding. Magazine-worthy finishes.",
        };

        const prompt = `Renovate this ${input.roomType} with a ${input.tier}-grade renovation. ${tierDescriptions[input.tier]} Keep the same room layout, dimensions, and window/door positions. Professional real estate photography style, bright natural lighting, wide angle. ${input.propertyStyle ? `Home style: ${input.propertyStyle}.` : ''} Photorealistic, high quality.`;

        const result = await generateImage({
          prompt,
          originalImages: [{ url: input.imageUrl, mimeType: "image/jpeg" }],
        });

        return {
          imageUrl: result.url || "",
          tier: input.tier,
          roomType: input.roomType,
        };
      }),

    uploadRoomPhoto: publicProcedure
      .input(
        z.object({
          base64: z.string().min(1),
          filename: z.string().min(1),
          mimeType: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64, "base64");
        const suffix = crypto.randomBytes(4).toString("hex");
        const key = `room-photos/${Date.now()}-${suffix}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        return { url };
      }),
  }),

  // ─── Subscription & Billing ────────────────────────────────────
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
