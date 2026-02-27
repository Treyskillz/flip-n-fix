import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { PLANS, PlanKey } from "./stripe/products";
import { createCheckoutSession, createPortalSession } from "./stripe/checkout";
import { getDb } from "./db";
import { users, sharedDeals, savedDeals, dealPhotos, courseProgress, quizResults } from "../drizzle/schema";
import { eq, sql, desc, and, ne, inArray } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";
import crypto from "crypto";

export const appRouter = router({
  system: systemRouter,

  // ─── Quiz Results ──────────────────────────────────────────
  quiz: router({
    /** Get all quiz results for the current user */
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = (await getDb())!;
      const results = await db.select().from(quizResults).where(eq(quizResults.userId, ctx.user.id)).orderBy(desc(quizResults.completedAt));
      return results;
    }),

    /** Get the best result for a specific module */
    getModuleBest: protectedProcedure
      .input(z.object({ moduleId: z.string() }))
      .query(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const results = await db.select().from(quizResults)
          .where(and(eq(quizResults.userId, ctx.user.id), eq(quizResults.moduleId, input.moduleId)))
          .orderBy(desc(quizResults.score));
        return results[0] || null;
      }),

    /** Submit quiz answers and save the result */
    submit: protectedProcedure
      .input(z.object({
        moduleId: z.string(),
        score: z.number().int().min(0),
        totalQuestions: z.number().int().min(1),
        answers: z.string(), // JSON string
      }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const [result] = await db.insert(quizResults).values({
          userId: ctx.user.id,
          moduleId: input.moduleId,
          score: input.score,
          totalQuestions: input.totalQuestions,
          answers: input.answers,
        });
        return { id: result.insertId, score: input.score, totalQuestions: input.totalQuestions };
      }),
  }),

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

  // ─── Saved Deals (Server-side) ────────────────────────────────
  deals: router({
    // Save or update a deal
    save: publicProcedure
      .input(
        z.object({
          uniqueId: z.string().min(1),
          address: z.string().min(1),
          city: z.string().min(1),
          state: z.string().min(1),
          zip: z.string().min(1),
          purchasePrice: z.number(),
          arv: z.number(),
          rehabCost: z.number(),
          totalInvestment: z.number(),
          netProfit: z.number(),
          roi: z.number(), // as percentage (e.g. 15.3)
          dealVerdict: z.string(),
          maxAllowableOffer: z.number(),
          recommendedMaxPrice: z.number(),
          targetROI: z.number(),
          sqft: z.number(),
          beds: z.number(),
          baths: z.number(),
          yearBuilt: z.number(),
          market: z.string().optional(),
          dealScore: z.number().optional(),
          cashOnCash: z.number().optional(),
          status: z.enum(["active", "under_contract", "closed", "passed", "archived"]).optional(),
          starred: z.boolean().optional(),
          notes: z.string().optional(),
          dealData: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const values: any = {
          uniqueId: input.uniqueId,
          userId: ctx.user?.id || null,
          address: input.address,
          city: input.city,
          state: input.state,
          zip: input.zip,
          purchasePrice: Math.round(input.purchasePrice),
          arv: Math.round(input.arv),
          rehabCost: Math.round(input.rehabCost),
          totalInvestment: Math.round(input.totalInvestment),
          netProfit: Math.round(input.netProfit),
          roiBps: Math.round(input.roi * 100), // 15.3% → 1530
          dealVerdict: input.dealVerdict,
          maxAllowableOffer: Math.round(input.maxAllowableOffer),
          recommendedMaxPrice: Math.round(input.recommendedMaxPrice),
          targetROI: Math.round(input.targetROI),
          sqft: Math.round(input.sqft),
          beds: Math.round(input.beds),
          baths: Math.round(input.baths),
          yearBuilt: Math.round(input.yearBuilt),
          market: input.market || null,
          dealScore: input.dealScore != null ? Math.round(input.dealScore) : null,
          cashOnCashBps: input.cashOnCash != null ? Math.round(input.cashOnCash * 100) : null,
          status: input.status || "active",
          starred: input.starred ? 1 : 0,
          notes: input.notes || null,
          dealData: input.dealData || null,
        };

        // Upsert: insert or update on duplicate uniqueId
        await db.insert(savedDeals).values(values).onDuplicateKeyUpdate({
          set: {
            address: values.address,
            city: values.city,
            state: values.state,
            zip: values.zip,
            purchasePrice: values.purchasePrice,
            arv: values.arv,
            rehabCost: values.rehabCost,
            totalInvestment: values.totalInvestment,
            netProfit: values.netProfit,
            roiBps: values.roiBps,
            dealVerdict: values.dealVerdict,
            maxAllowableOffer: values.maxAllowableOffer,
            recommendedMaxPrice: values.recommendedMaxPrice,
            targetROI: values.targetROI,
            sqft: values.sqft,
            beds: values.beds,
            baths: values.baths,
            yearBuilt: values.yearBuilt,
            market: values.market,
            dealScore: values.dealScore,
            cashOnCashBps: values.cashOnCashBps,
            status: values.status,
            starred: values.starred,
            notes: values.notes,
            dealData: values.dealData,
          },
        });

        return { success: true, uniqueId: input.uniqueId };
      }),

    // List all saved deals
    list: publicProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const rows = await db
        .select()
        .from(savedDeals)
        .orderBy(desc(savedDeals.createdAt));

      return rows.map((r) => ({
        id: r.uniqueId,
        savedAt: r.createdAt.toISOString(),
        address: r.address,
        city: r.city,
        state: r.state,
        zip: r.zip,
        purchasePrice: r.purchasePrice,
        arv: r.arv,
        rehabCost: r.rehabCost,
        totalInvestment: r.totalInvestment,
        netProfit: r.netProfit,
        roi: r.roiBps / 100, // 1530 → 15.3
        dealVerdict: r.dealVerdict,
        maxAllowableOffer: r.maxAllowableOffer,
        recommendedMaxPrice: r.recommendedMaxPrice,
        targetROI: r.targetROI,
        sqft: r.sqft,
        beds: r.beds,
        baths: r.baths,
        yearBuilt: r.yearBuilt,
        market: r.market,
        dealScore: r.dealScore,
        cashOnCash: r.cashOnCashBps != null ? r.cashOnCashBps / 100 : undefined,
        status: r.status,
        starred: r.starred === 1,
        notes: r.notes,
        dealData: r.dealData,
      }));
    }),

    // Update a deal (status, starred, notes)
    update: publicProcedure
      .input(
        z.object({
          uniqueId: z.string().min(1),
          status: z.enum(["active", "under_contract", "closed", "passed", "archived"]).optional(),
          starred: z.boolean().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const updates: Record<string, any> = {};
        if (input.status !== undefined) updates.status = input.status;
        if (input.starred !== undefined) updates.starred = input.starred ? 1 : 0;
        if (input.notes !== undefined) updates.notes = input.notes;

        if (Object.keys(updates).length > 0) {
          await db
            .update(savedDeals)
            .set(updates)
            .where(eq(savedDeals.uniqueId, input.uniqueId));
        }

        return { success: true };
      }),

    // Delete a deal
    delete: publicProcedure
      .input(z.object({ uniqueId: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Also delete associated photos
        await db.delete(dealPhotos).where(eq(dealPhotos.dealUniqueId, input.uniqueId));
        await db.delete(savedDeals).where(eq(savedDeals.uniqueId, input.uniqueId));

        return { success: true };
      }),

    // Bulk update status
    bulkUpdateStatus: publicProcedure
      .input(z.object({
        uniqueIds: z.array(z.string().min(1)).min(1),
        status: z.enum(["active", "under_contract", "closed", "passed", "archived"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db
          .update(savedDeals)
          .set({ status: input.status })
          .where(inArray(savedDeals.uniqueId, input.uniqueIds));

        return { success: true, count: input.uniqueIds.length };
      }),

    // Bulk delete
    bulkDelete: publicProcedure
      .input(z.object({
        uniqueIds: z.array(z.string().min(1)).min(1),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Delete associated photos first
        await db.delete(dealPhotos).where(inArray(dealPhotos.dealUniqueId, input.uniqueIds));
        await db.delete(savedDeals).where(inArray(savedDeals.uniqueId, input.uniqueIds));

        return { success: true, count: input.uniqueIds.length };
      }),

    // Portfolio aggregation
    portfolio: publicProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        return {
          totalDeals: 0,
          activeDeals: 0,
          closedDeals: 0,
          underContractDeals: 0,
          passedDeals: 0,
          totalInvested: 0,
          totalProfit: 0,
          avgRoi: 0,
          avgDealScore: 0,
          profitableCount: 0,
          totalArv: 0,
          totalRehabCost: 0,
          deals: [],
        };
      }

      const rows = await db
        .select()
        .from(savedDeals)
        .where(ne(savedDeals.status, "archived"))
        .orderBy(desc(savedDeals.createdAt));

      const deals = rows.map((r) => ({
        id: r.uniqueId,
        address: r.address,
        city: r.city,
        state: r.state,
        zip: r.zip,
        purchasePrice: r.purchasePrice,
        arv: r.arv,
        rehabCost: r.rehabCost,
        totalInvestment: r.totalInvestment,
        netProfit: r.netProfit,
        roi: r.roiBps / 100,
        dealVerdict: r.dealVerdict,
        dealScore: r.dealScore,
        status: r.status,
        starred: r.starred === 1,
        createdAt: r.createdAt.toISOString(),
      }));

      const totalDeals = deals.length;
      const activeDeals = deals.filter((d) => d.status === "active").length;
      const closedDeals = deals.filter((d) => d.status === "closed").length;
      const underContractDeals = deals.filter((d) => d.status === "under_contract").length;
      const passedDeals = deals.filter((d) => d.status === "passed").length;
      const totalInvested = deals.reduce((s, d) => s + d.totalInvestment, 0);
      const totalProfit = deals.reduce((s, d) => s + d.netProfit, 0);
      const avgRoi = totalDeals > 0 ? deals.reduce((s, d) => s + d.roi, 0) / totalDeals : 0;
      const avgDealScore = totalDeals > 0
        ? deals.reduce((s, d) => s + (d.dealScore || 0), 0) / totalDeals
        : 0;
      const profitableCount = deals.filter((d) => d.netProfit > 0).length;
      const totalArv = deals.reduce((s, d) => s + d.arv, 0);
      const totalRehabCost = deals.reduce((s, d) => s + d.rehabCost, 0);

      return {
        totalDeals,
        activeDeals,
        closedDeals,
        underContractDeals,
        passedDeals,
        totalInvested,
        totalProfit,
        avgRoi,
        avgDealScore,
        profitableCount,
        totalArv,
        totalRehabCost,
        deals,
      };
    }),
  }),

  // ─── Deal Photos ──────────────────────────────────────────────
  photos: router({
    // Upload a photo for a deal
    upload: publicProcedure
      .input(
        z.object({
          dealUniqueId: z.string().min(1),
          base64: z.string().min(1),
          filename: z.string().min(1),
          mimeType: z.string().min(1),
          caption: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const buffer = Buffer.from(input.base64, "base64");
        const suffix = crypto.randomBytes(4).toString("hex");
        const key = `deal-photos/${input.dealUniqueId}/${Date.now()}-${suffix}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.mimeType);

        // Get current max sortOrder
        const existing = await db
          .select({ maxSort: sql<number>`COALESCE(MAX(${dealPhotos.sortOrder}), -1)` })
          .from(dealPhotos)
          .where(eq(dealPhotos.dealUniqueId, input.dealUniqueId));

        const nextSort = (existing[0]?.maxSort ?? -1) + 1;

        await db.insert(dealPhotos).values({
          dealUniqueId: input.dealUniqueId,
          userId: ctx.user?.id || null,
          url,
          fileKey: key,
          filename: input.filename,
          mimeType: input.mimeType,
          caption: input.caption || null,
          sortOrder: nextSort,
        });

        return { url, fileKey: key, id: nextSort };
      }),

    // List photos for a deal
    list: publicProcedure
      .input(z.object({ dealUniqueId: z.string().min(1) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const rows = await db
          .select()
          .from(dealPhotos)
          .where(eq(dealPhotos.dealUniqueId, input.dealUniqueId))
          .orderBy(dealPhotos.sortOrder);

        return rows.map((r) => ({
          id: r.id,
          url: r.url,
          fileKey: r.fileKey,
          filename: r.filename,
          mimeType: r.mimeType,
          caption: r.caption,
          sortOrder: r.sortOrder,
        }));
      }),

    // Delete a photo
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.delete(dealPhotos).where(eq(dealPhotos.id, input.id));
        return { success: true };
      }),

    // Update caption
    updateCaption: publicProcedure
      .input(
        z.object({
          id: z.number(),
          caption: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db
          .update(dealPhotos)
          .set({ caption: input.caption })
          .where(eq(dealPhotos.id, input.id));

        return { success: true };
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

  // ─── Course Progress ──────────────────────────────────────────
  courseProgress: router({
    // Get all completed lesson IDs for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const rows = await db
        .select({
          lessonId: courseProgress.lessonId,
          completedAt: courseProgress.completedAt,
        })
        .from(courseProgress)
        .where(eq(courseProgress.userId, ctx.user.id));

      return rows;
    }),

    // Toggle a lesson complete/incomplete
    toggle: protectedProcedure
      .input(z.object({ lessonId: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Check if already completed
        const existing = await db
          .select()
          .from(courseProgress)
          .where(
            and(
              eq(courseProgress.userId, ctx.user.id),
              eq(courseProgress.lessonId, input.lessonId)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          // Remove completion
          await db
            .delete(courseProgress)
            .where(
              and(
                eq(courseProgress.userId, ctx.user.id),
                eq(courseProgress.lessonId, input.lessonId)
              )
            );
          return { completed: false, lessonId: input.lessonId };
        } else {
          // Mark complete
          await db.insert(courseProgress).values({
            userId: ctx.user.id,
            lessonId: input.lessonId,
          });
          return { completed: true, lessonId: input.lessonId };
        }
      }),

    // Mark all lessons in a module as complete
    completeModule: protectedProcedure
      .input(z.object({ lessonIds: z.array(z.string().min(1)) }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Get already completed lessons
        const existing = await db
          .select({ lessonId: courseProgress.lessonId })
          .from(courseProgress)
          .where(eq(courseProgress.userId, ctx.user.id));

        const completedSet = new Set(existing.map((e) => e.lessonId));
        const toInsert = input.lessonIds.filter((id) => !completedSet.has(id));

        if (toInsert.length > 0) {
          await db.insert(courseProgress).values(
            toInsert.map((lessonId) => ({
              userId: ctx.user.id,
              lessonId,
            }))
          );
        }

        return { completed: input.lessonIds.length, added: toInsert.length };
      }),

    // Reset all progress
    reset: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(courseProgress)
        .where(eq(courseProgress.userId, ctx.user.id));

      return { success: true };
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
