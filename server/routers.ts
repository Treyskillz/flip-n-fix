import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { PLANS, PlanKey } from "./stripe/products";
import { createCheckoutSession, createPortalSession } from "./stripe/checkout";
import { getDb } from "./db";
import { users, sharedDeals, savedDeals, dealPhotos, courseProgress, quizResults, userProfiles, credibilityProjects, credibilityAttachments, pipelineDeals, pipelineContacts, pipelineActivities, giftedSubscriptions, emailLeads, blogPosts } from "../drizzle/schema";
import { eq, sql, desc, and, ne, inArray, asc, isNull } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";
import crypto from "crypto";

export const appRouter = router({
  system: systemRouter,

  // ─── User Profile ──────────────────────────────────────────
  profile: router({
    /** Get the current user's profile */
    get: protectedProcedure.query(async ({ ctx }) => {
      const db = (await getDb())!;
      const rows = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
      return rows[0] || null;
    }),

    /** Create or update the current user's profile */
    upsert: protectedProcedure
      .input(z.object({
        fullName: z.string().optional(),
        companyName: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        website: z.string().optional(),
        licenseNumber: z.string().optional(),
        marketArea: z.string().optional(),
        yearsExperience: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const existing = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);

        const data = {
          fullName: input.fullName || null,
          companyName: input.companyName || null,
          phone: input.phone || null,
          email: input.email || null,
          address: input.address || null,
          city: input.city || null,
          state: input.state || null,
          zip: input.zip || null,
          website: input.website || null,
          licenseNumber: input.licenseNumber || null,
          marketArea: input.marketArea || null,
          yearsExperience: input.yearsExperience || null,
        };

        if (existing.length > 0) {
          await db.update(userProfiles).set(data).where(eq(userProfiles.userId, ctx.user.id));
        } else {
          await db.insert(userProfiles).values({ userId: ctx.user.id, ...data });
        }

        return { success: true };
      }),
  }),

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
- Comps MUST be within 1 mile of the subject address
- Comps MUST have sold within the last 6 months from today's date
- Comps MUST have been on market 90 days or less (Days On Market / DOM ≤ 90)
- Comps MUST be within 200 sq ft of the subject property's square footage
- Comps MUST have similar bed/bath counts (±1 bedroom, ±1 bathroom)
- Comps MUST be within 10 years of the subject property's year built
- Use realistic addresses near the subject property (real street names in that area)
- Use realistic sale prices based on the local market
- All prices should reflect AFTER-RENOVATION values
- The daysOnMarket field MUST reflect how many days the property was listed before it sold (DOM)

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
Today's Date: ${new Date().toISOString().split('T')[0]}

Provide 3-5 comparable RENOVATED properties that meet ALL of these criteria:
1. Within 1 mile of the subject address
2. On market 90 days or less (DOM ≤ 90)
3. Sold within the last 6 months from today's date
4. Standard retail sales only (no distressed sales)
5. Within 200 sq ft of the subject's ${input.sqft} sq ft
6. Similar bed/bath count (±1 bed, ±1 bath)
7. Built within 10 years of ${input.yearBuilt || 'the subject'} (year built ±10 years)`,
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
                        distanceMiles: { type: "number", description: "Approximate distance in miles from the subject property (must be ≤ 1.0)" },
                      },
                      required: ["address", "salePrice", "saleDate", "daysOnMarket", "sqft", "beds", "baths", "yearBuilt", "condition", "neighborhood", "distanceMiles"],
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
          const rawComps = parsed.comps || [];

          // Post-process: enforce comp criteria
          const now = new Date();
          const sixMonthsAgo = new Date(now);
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

          const subjectSqft = input.sqft;
          const subjectBeds = input.beds;
          const subjectBaths = input.baths;
          const subjectYearBuilt = input.yearBuilt || 0;

          const filteredComps = rawComps.filter((c: any) => {
            // Filter: DOM must be 90 days or less
            if (c.daysOnMarket > 90) return false;
            // Filter: sold within last 6 months
            if (c.saleDate) {
              const saleDate = new Date(c.saleDate);
              if (saleDate < sixMonthsAgo) return false;
            }
            // Filter: within 1 mile
            if (c.distanceMiles > 1.0) return false;
            // Filter: within 200 sq ft of subject
            if (Math.abs(c.sqft - subjectSqft) > 200) return false;
            // Filter: similar bed/bath (±1)
            if (Math.abs(c.beds - subjectBeds) > 1) return false;
            if (Math.abs(c.baths - subjectBaths) > 1) return false;
            // Filter: within 10 years of subject year built
            if (subjectYearBuilt > 0 && c.yearBuilt > 0) {
              if (Math.abs(c.yearBuilt - subjectYearBuilt) > 10) return false;
            }
            return true;
          });

          return {
            comps: filteredComps,
            marketNotes: parsed.marketNotes || "",
            disclaimer: "AI-generated estimates based on market analysis. All comps are filtered to: within 1 mile, sold in the last 6 months, on market \u226490 days, within 200 sq ft, similar bed/bath (\u00b11), and within 10 years of age. Verify all data with MLS, county records, or your real estate agent.",
            criteria: {
              maxDistanceMiles: 1.0,
              maxDaysOnMarket: 90,
              maxMonthsAgo: 6,
              maxSqftDiff: 200,
              maxBedDiff: 1,
              maxBathDiff: 1,
              maxAgeDiff: 10,
            },
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

  // ─── Certificate ──────────────────────────────────────────────
  certificate: router({
    /** Check if the user has completed all lessons and passed all quizzes */
    eligibility: protectedProcedure.query(async ({ ctx }) => {
      const db = (await getDb())!;

      // Get completed lessons
      const completedRows = await db
        .select({ lessonId: courseProgress.lessonId })
        .from(courseProgress)
        .where(eq(courseProgress.userId, ctx.user.id));
      const completedLessonIds = new Set(completedRows.map(r => r.lessonId));

      // Get quiz results (best per module)
      const quizRows = await db
        .select()
        .from(quizResults)
        .where(eq(quizResults.userId, ctx.user.id))
        .orderBy(desc(quizResults.score));

      // Group best quiz per module
      const bestQuizByModule = new Map<string, { score: number; totalQuestions: number }>();
      for (const row of quizRows) {
        if (!bestQuizByModule.has(row.moduleId)) {
          bestQuizByModule.set(row.moduleId, { score: row.score, totalQuestions: row.totalQuestions });
        }
      }

      // Get user profile for name
      const profileRows = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
      const profile = profileRows[0] || null;

      // Get user info
      const userRows = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
      const userData = userRows[0] || null;

      return {
        completedLessonCount: completedLessonIds.size,
        quizzesPassed: bestQuizByModule.size,
        bestQuizByModule: Object.fromEntries(bestQuizByModule),
        userName: profile?.fullName || userData?.name || null,
        companyName: profile?.companyName || null,
      };
    }),
  }),

  // ─── Credibility Packet Projects ───────────────────────────
  credibility: router({
    // List all projects for the current user
    listProjects: protectedProcedure.query(async ({ ctx }) => {
      const db = (await getDb())!;
      const rows = await db
        .select()
        .from(credibilityProjects)
        .where(eq(credibilityProjects.userId, ctx.user.id))
        .orderBy(credibilityProjects.sortOrder);
      return rows;
    }),

    // Create a new project
    createProject: protectedProcedure
      .input(z.object({
        projectName: z.string().min(1),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        purchasePrice: z.number().optional(),
        rehabCost: z.number().optional(),
        salePrice: z.number().optional(),
        profit: z.number().optional(),
        purchaseDate: z.string().optional(),
        saleDate: z.string().optional(),
        daysToComplete: z.number().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        // Get next sort order
        const existing = await db
          .select({ maxSort: sql<number>`COALESCE(MAX(${credibilityProjects.sortOrder}), -1)` })
          .from(credibilityProjects)
          .where(eq(credibilityProjects.userId, ctx.user.id));
        const nextSort = (existing[0]?.maxSort ?? -1) + 1;

        const result = await db.insert(credibilityProjects).values({
          userId: ctx.user.id,
          projectName: input.projectName,
          address: input.address || null,
          city: input.city || null,
          state: input.state || null,
          purchasePrice: input.purchasePrice || null,
          rehabCost: input.rehabCost || null,
          salePrice: input.salePrice || null,
          profit: input.profit || null,
          purchaseDate: input.purchaseDate || null,
          saleDate: input.saleDate || null,
          daysToComplete: input.daysToComplete || null,
          description: input.description || null,
          sortOrder: nextSort,
        });
        return { id: Number(result[0].insertId), sortOrder: nextSort };
      }),

    // Update a project
    updateProject: protectedProcedure
      .input(z.object({
        id: z.number(),
        projectName: z.string().min(1).optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        purchasePrice: z.number().nullable().optional(),
        rehabCost: z.number().nullable().optional(),
        salePrice: z.number().nullable().optional(),
        profit: z.number().nullable().optional(),
        purchaseDate: z.string().nullable().optional(),
        saleDate: z.string().nullable().optional(),
        daysToComplete: z.number().nullable().optional(),
        description: z.string().nullable().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const { id, ...data } = input;
        await db.update(credibilityProjects)
          .set(data as any)
          .where(and(eq(credibilityProjects.id, id), eq(credibilityProjects.userId, ctx.user.id)));
        return { success: true };
      }),

    // Delete a project and its attachments
    deleteProject: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        await db.delete(credibilityAttachments).where(eq(credibilityAttachments.projectId, input.id));
        await db.delete(credibilityProjects)
          .where(and(eq(credibilityProjects.id, input.id), eq(credibilityProjects.userId, ctx.user.id)));
        return { success: true };
      }),

    // Upload an attachment (photo or document)
    uploadAttachment: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        type: z.enum(["before_photo", "after_photo", "closing_statement", "bill_of_sale", "other_document"]),
        base64: z.string().min(1),
        filename: z.string().min(1),
        mimeType: z.string().min(1),
        caption: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const buffer = Buffer.from(input.base64, "base64");
        const suffix = crypto.randomBytes(4).toString("hex");
        const key = `credibility/${ctx.user.id}/${input.projectId}/${input.type}/${Date.now()}-${suffix}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.mimeType);

        const existing = await db
          .select({ maxSort: sql<number>`COALESCE(MAX(${credibilityAttachments.sortOrder}), -1)` })
          .from(credibilityAttachments)
          .where(and(
            eq(credibilityAttachments.projectId, input.projectId),
            eq(credibilityAttachments.type, input.type),
          ));
        const nextSort = (existing[0]?.maxSort ?? -1) + 1;

        await db.insert(credibilityAttachments).values({
          projectId: input.projectId,
          userId: ctx.user.id,
          type: input.type,
          url,
          fileKey: key,
          filename: input.filename,
          mimeType: input.mimeType,
          caption: input.caption || null,
          sortOrder: nextSort,
        });

        return { url, fileKey: key };
      }),

    // List attachments for a project
    listAttachments: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const rows = await db
          .select()
          .from(credibilityAttachments)
          .where(and(
            eq(credibilityAttachments.projectId, input.projectId),
            eq(credibilityAttachments.userId, ctx.user.id),
          ))
          .orderBy(credibilityAttachments.type, credibilityAttachments.sortOrder);
        return rows;
      }),

    // Delete an attachment
    deleteAttachment: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        await db.delete(credibilityAttachments)
          .where(and(eq(credibilityAttachments.id, input.id), eq(credibilityAttachments.userId, ctx.user.id)));
        return { success: true };
      }),
  }),

  // ─── Deal Pipeline (CRM) ───────────────────────────────────
  pipeline: router({
    // List all pipeline deals for the current user
    listDeals: protectedProcedure.query(async ({ ctx }) => {
      const db = (await getDb())!;
      const rows = await db.select().from(pipelineDeals)
        .where(eq(pipelineDeals.userId, ctx.user.id))
        .orderBy(asc(pipelineDeals.sortOrder), desc(pipelineDeals.updatedAt));
      return rows;
    }),

    // Create a new pipeline deal
    createDeal: protectedProcedure
      .input(z.object({
        propertyAddress: z.string().min(1),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        stage: z.enum(["lead", "analyzing", "offer_submitted", "under_contract", "closing", "rehab", "listed", "sold", "dead"]).default("lead"),
        purchasePrice: z.number().optional(),
        arv: z.number().optional(),
        rehabCost: z.number().optional(),
        estimatedProfit: z.number().optional(),
        dealScore: z.number().optional(),
        tags: z.string().optional(),
        notes: z.string().optional(),
        savedDealId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const result = await db.insert(pipelineDeals).values({
          userId: ctx.user.id,
          propertyAddress: input.propertyAddress,
          city: input.city || null,
          state: input.state || null,
          zip: input.zip || null,
          stage: input.stage,
          purchasePrice: input.purchasePrice || null,
          arv: input.arv || null,
          rehabCost: input.rehabCost || null,
          estimatedProfit: input.estimatedProfit || null,
          dealScore: input.dealScore || null,
          tags: input.tags || null,
          notes: input.notes || null,
          savedDealId: input.savedDealId || null,
        });
        const dealId = Number(result[0].insertId);
        // Auto-create activity
        await db.insert(pipelineActivities).values({
          userId: ctx.user.id,
          dealId,
          type: "note",
          title: "Deal added to pipeline",
          description: `${input.propertyAddress} added as ${input.stage}`,
        });
        return { id: dealId };
      }),

    // Update a pipeline deal
    updateDeal: protectedProcedure
      .input(z.object({
        id: z.number(),
        propertyAddress: z.string().min(1).optional(),
        city: z.string().nullable().optional(),
        state: z.string().nullable().optional(),
        zip: z.string().nullable().optional(),
        stage: z.enum(["lead", "analyzing", "offer_submitted", "under_contract", "closing", "rehab", "listed", "sold", "dead"]).optional(),
        purchasePrice: z.number().nullable().optional(),
        arv: z.number().nullable().optional(),
        rehabCost: z.number().nullable().optional(),
        estimatedProfit: z.number().nullable().optional(),
        dealScore: z.number().nullable().optional(),
        tags: z.string().nullable().optional(),
        notes: z.string().nullable().optional(),
        deadReason: z.string().nullable().optional(),
        offerDate: z.string().nullable().optional(),
        contractDate: z.string().nullable().optional(),
        closingDate: z.string().nullable().optional(),
        rehabStartDate: z.string().nullable().optional(),
        rehabEndDate: z.string().nullable().optional(),
        listDate: z.string().nullable().optional(),
        soldDate: z.string().nullable().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const { id, ...updates } = input;
        // Check for stage change to log activity
        if (updates.stage) {
          const existing = await db.select({ stage: pipelineDeals.stage })
            .from(pipelineDeals)
            .where(and(eq(pipelineDeals.id, id), eq(pipelineDeals.userId, ctx.user.id)))
            .limit(1);
          if (existing[0] && existing[0].stage !== updates.stage) {
            await db.insert(pipelineActivities).values({
              userId: ctx.user.id,
              dealId: id,
              type: "stage_change",
              title: `Stage changed: ${existing[0].stage} → ${updates.stage}`,
              metadata: JSON.stringify({ from: existing[0].stage, to: updates.stage }),
            });
            (updates as any).stageEnteredAt = new Date();
          }
        }
        // Convert date strings to Date objects
        const dateFields = ['offerDate', 'contractDate', 'closingDate', 'rehabStartDate', 'rehabEndDate', 'listDate', 'soldDate'] as const;
        const processedUpdates: any = { ...updates };
        for (const field of dateFields) {
          if (processedUpdates[field] !== undefined) {
            processedUpdates[field] = processedUpdates[field] ? new Date(processedUpdates[field]) : null;
          }
        }
        await db.update(pipelineDeals).set(processedUpdates)
          .where(and(eq(pipelineDeals.id, id), eq(pipelineDeals.userId, ctx.user.id)));
        return { success: true };
      }),

    // Move deal to a new stage (shortcut for drag-and-drop)
    moveStage: protectedProcedure
      .input(z.object({
        id: z.number(),
        stage: z.enum(["lead", "analyzing", "offer_submitted", "under_contract", "closing", "rehab", "listed", "sold", "dead"]),
        deadReason: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const existing = await db.select({ stage: pipelineDeals.stage, propertyAddress: pipelineDeals.propertyAddress })
          .from(pipelineDeals)
          .where(and(eq(pipelineDeals.id, input.id), eq(pipelineDeals.userId, ctx.user.id)))
          .limit(1);
        if (!existing[0]) return { success: false };
        const oldStage = existing[0].stage;
        await db.update(pipelineDeals).set({
          stage: input.stage,
          stageEnteredAt: new Date(),
          deadReason: input.stage === 'dead' ? (input.deadReason || null) : undefined,
        }).where(and(eq(pipelineDeals.id, input.id), eq(pipelineDeals.userId, ctx.user.id)));
        // Log stage change
        await db.insert(pipelineActivities).values({
          userId: ctx.user.id,
          dealId: input.id,
          type: "stage_change",
          title: `Stage changed: ${oldStage} → ${input.stage}`,
          metadata: JSON.stringify({ from: oldStage, to: input.stage }),
        });
        return { success: true };
      }),

    // Delete a pipeline deal
    deleteDeal: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        // Delete related contacts and activities
        await db.delete(pipelineActivities).where(and(eq(pipelineActivities.dealId, input.id), eq(pipelineActivities.userId, ctx.user.id)));
        await db.delete(pipelineContacts).where(and(eq(pipelineContacts.dealId, input.id), eq(pipelineContacts.userId, ctx.user.id)));
        await db.delete(pipelineDeals).where(and(eq(pipelineDeals.id, input.id), eq(pipelineDeals.userId, ctx.user.id)));
        return { success: true };
      }),

    // ─── Contacts ─────────────────────────────────
    listContacts: protectedProcedure
      .input(z.object({ dealId: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const db = (await getDb())!;
        if (input?.dealId) {
          return db.select().from(pipelineContacts)
            .where(and(eq(pipelineContacts.userId, ctx.user.id), eq(pipelineContacts.dealId, input.dealId)))
            .orderBy(asc(pipelineContacts.name));
        }
        // All contacts for user
        return db.select().from(pipelineContacts)
          .where(eq(pipelineContacts.userId, ctx.user.id))
          .orderBy(asc(pipelineContacts.name));
      }),

    createContact: protectedProcedure
      .input(z.object({
        dealId: z.number().optional(),
        name: z.string().min(1),
        role: z.enum(["seller", "buyer", "listing_agent", "buyers_agent", "title_company", "attorney", "contractor", "lender", "wholesaler", "partner", "other"]).default("other"),
        phone: z.string().optional(),
        email: z.string().optional(),
        company: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const result = await db.insert(pipelineContacts).values({
          userId: ctx.user.id,
          dealId: input.dealId || null,
          name: input.name,
          role: input.role,
          phone: input.phone || null,
          email: input.email || null,
          company: input.company || null,
          notes: input.notes || null,
        });
        const contactId = Number(result[0].insertId);
        // Log activity if linked to a deal
        if (input.dealId) {
          await db.insert(pipelineActivities).values({
            userId: ctx.user.id,
            dealId: input.dealId,
            type: "contact_added",
            title: `Contact added: ${input.name} (${input.role.replace('_', ' ')})`,
          });
        }
        return { id: contactId };
      }),

    updateContact: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        role: z.enum(["seller", "buyer", "listing_agent", "buyers_agent", "title_company", "attorney", "contractor", "lender", "wholesaler", "partner", "other"]).optional(),
        phone: z.string().nullable().optional(),
        email: z.string().nullable().optional(),
        company: z.string().nullable().optional(),
        notes: z.string().nullable().optional(),
        dealId: z.number().nullable().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const { id, ...updates } = input;
        await db.update(pipelineContacts).set(updates)
          .where(and(eq(pipelineContacts.id, id), eq(pipelineContacts.userId, ctx.user.id)));
        return { success: true };
      }),

    deleteContact: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        await db.delete(pipelineContacts)
          .where(and(eq(pipelineContacts.id, input.id), eq(pipelineContacts.userId, ctx.user.id)));
        return { success: true };
      }),

    // ─── Activities ───────────────────────────────
    listActivities: protectedProcedure
      .input(z.object({ dealId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = (await getDb())!;
        return db.select().from(pipelineActivities)
          .where(and(eq(pipelineActivities.dealId, input.dealId), eq(pipelineActivities.userId, ctx.user.id)))
          .orderBy(desc(pipelineActivities.createdAt));
      }),

    addActivity: protectedProcedure
      .input(z.object({
        dealId: z.number(),
        type: z.enum(["note", "stage_change", "contact_added", "document_sent", "offer_made", "counter_received", "inspection", "appraisal", "closing_scheduled", "rehab_update", "listing_update", "other"]).default("note"),
        title: z.string().min(1),
        description: z.string().optional(),
        metadata: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const result = await db.insert(pipelineActivities).values({
          userId: ctx.user.id,
          dealId: input.dealId,
          type: input.type,
          title: input.title,
          description: input.description || null,
          metadata: input.metadata || null,
        });
        return { id: Number(result[0].insertId) };
      }),

    // ─── Dashboard Metrics ────────────────────────
    metrics: protectedProcedure.query(async ({ ctx }) => {
      const db = (await getDb())!;
      const deals = await db.select().from(pipelineDeals)
        .where(eq(pipelineDeals.userId, ctx.user.id));

      const stages = ["lead", "analyzing", "offer_submitted", "under_contract", "closing", "rehab", "listed", "sold", "dead"] as const;
      const byStage: Record<string, number> = {};
      for (const s of stages) byStage[s] = 0;
      let totalPipelineValue = 0;
      let totalClosed = 0;
      let totalDead = 0;
      let totalActive = 0;
      let totalDaysInStage = 0;
      let activeCount = 0;

      for (const deal of deals) {
        byStage[deal.stage] = (byStage[deal.stage] || 0) + 1;
        if (deal.stage === 'sold') {
          totalClosed++;
          if (deal.estimatedProfit) totalPipelineValue += deal.estimatedProfit;
        } else if (deal.stage === 'dead') {
          totalDead++;
        } else {
          totalActive++;
          if (deal.estimatedProfit) totalPipelineValue += deal.estimatedProfit;
          if (deal.stageEnteredAt) {
            const days = Math.floor((Date.now() - new Date(deal.stageEnteredAt).getTime()) / (1000 * 60 * 60 * 24));
            totalDaysInStage += days;
            activeCount++;
          }
        }
      }

      return {
        totalDeals: deals.length,
        byStage,
        totalPipelineValue,
        totalClosed,
        totalDead,
        totalActive,
        avgDaysInStage: activeCount > 0 ? Math.round(totalDaysInStage / activeCount) : 0,
        winRate: (totalClosed + totalDead) > 0 ? Math.round((totalClosed / (totalClosed + totalDead)) * 100) : 0,
      };
    }),

    // ─── Import from Saved Deals ──────────────────
    importFromSavedDeal: protectedProcedure
      .input(z.object({ savedDealId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        const deal = await db.select().from(savedDeals)
          .where(and(eq(savedDeals.id, input.savedDealId), eq(savedDeals.userId, ctx.user.id)))
          .limit(1);
        if (!deal[0]) return { success: false, error: "Deal not found" };
        const d = deal[0];
        const result = await db.insert(pipelineDeals).values({
          userId: ctx.user.id,
          savedDealId: d.id,
          propertyAddress: d.address,
          city: d.city || null,
          state: d.state || null,
          zip: d.zip || null,
          stage: "analyzing",
          purchasePrice: d.purchasePrice,
          arv: d.arv,
          rehabCost: d.rehabCost,
          estimatedProfit: d.netProfit,
          dealScore: d.dealScore,
        });
        const dealId = Number(result[0].insertId);
        await db.insert(pipelineActivities).values({
          userId: ctx.user.id,
          dealId,
          type: "note",
          title: "Imported from Saved Deals",
          description: `Deal imported from saved analysis: ${d.address}`,
        });
        return { success: true, id: dealId };
      }),

    // Bulk import deals from CSV data
    bulkImport: protectedProcedure
      .input(z.object({
        deals: z.array(z.object({
          propertyAddress: z.string().min(1),
          city: z.string().optional(),
          state: z.string().optional(),
          zip: z.string().optional(),
          stage: z.enum(["lead", "analyzing", "offer_submitted", "under_contract", "closing", "rehab", "listed", "sold", "dead"]).default("lead"),
          purchasePrice: z.number().nullable().optional(),
          arv: z.number().nullable().optional(),
          rehabCost: z.number().nullable().optional(),
          estimatedProfit: z.number().nullable().optional(),
          tags: z.string().optional(),
          notes: z.string().optional(),
        })).min(1).max(500),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = (await getDb())!;
        let imported = 0;
        let skipped = 0;
        const errors: { row: number; address: string; error: string }[] = [];

        for (let i = 0; i < input.deals.length; i++) {
          const deal = input.deals[i];
          try {
            const result = await db.insert(pipelineDeals).values({
              userId: ctx.user.id,
              propertyAddress: deal.propertyAddress,
              city: deal.city || null,
              state: deal.state || null,
              zip: deal.zip || null,
              stage: deal.stage,
              purchasePrice: deal.purchasePrice || null,
              arv: deal.arv || null,
              rehabCost: deal.rehabCost || null,
              estimatedProfit: deal.estimatedProfit || null,
              tags: deal.tags || null,
              notes: deal.notes || null,
            });
            const dealId = Number(result[0].insertId);
            await db.insert(pipelineActivities).values({
              userId: ctx.user.id,
              dealId,
              type: "note",
              title: "Imported from CSV",
              description: `Bulk imported: ${deal.propertyAddress}`,
            });
            imported++;
          } catch (err: any) {
            skipped++;
            errors.push({
              row: i + 1,
              address: deal.propertyAddress,
              error: err?.message || "Unknown error",
            });
          }
        }

        return { imported, skipped, total: input.deals.length, errors };
      }),
  }),

  // ─── Subscription & Billing ────────────────────────────────
  subscription: router({
    // Get available plans
    plans: publicProcedure.query(() => {
      return Object.entries(PLANS).map(([key, plan]) => ({
        id: key as PlanKey,
        ...plan,
      }));
    }),

    // Get current user's subscription status (checks gifted subs too)
    status: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { plan: "free" as PlanKey, stripeCustomerId: null, isGifted: false };

      const result = await db
        .select({
          subscriptionPlan: users.subscriptionPlan,
          stripeCustomerId: users.stripeCustomerId,
        })
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      const stripePlan = (result[0]?.subscriptionPlan || "free") as PlanKey;

      // Check for active gifted subscription
      const now = new Date();
      const giftedRows = await db
        .select()
        .from(giftedSubscriptions)
        .where(
          and(
            eq(giftedSubscriptions.userId, ctx.user.id),
            isNull(giftedSubscriptions.revokedAt)
          )
        )
        .orderBy(desc(giftedSubscriptions.createdAt))
        .limit(1);

      const activeGift = giftedRows[0] && (!giftedRows[0].expiresAt || giftedRows[0].expiresAt > now)
        ? giftedRows[0]
        : null;

      // Use the higher tier between Stripe and gifted
      const planRank: Record<string, number> = { free: 0, pro: 1, elite: 2, team: 3 };
      let effectivePlan = stripePlan;
      let isGifted = false;

      if (activeGift && (planRank[activeGift.plan] || 0) > (planRank[stripePlan] || 0)) {
        effectivePlan = activeGift.plan as PlanKey;
        isGifted = true;
      }

      return {
        plan: effectivePlan,
        stripeCustomerId: result[0]?.stripeCustomerId || null,
        isGifted,
        giftedPlan: activeGift?.plan || null,
        giftExpiresAt: activeGift?.expiresAt || null,
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

  // ─── Admin: Gifted Subscriptions ─────────────────────────────
  giftedSubs: router({
    /** List all gifted subscriptions (admin only) */
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];

      const rows = await db
        .select({
          id: giftedSubscriptions.id,
          userId: giftedSubscriptions.userId,
          plan: giftedSubscriptions.plan,
          grantedBy: giftedSubscriptions.grantedBy,
          reason: giftedSubscriptions.reason,
          expiresAt: giftedSubscriptions.expiresAt,
          revokedAt: giftedSubscriptions.revokedAt,
          createdAt: giftedSubscriptions.createdAt,
          userName: users.name,
          userEmail: users.email,
        })
        .from(giftedSubscriptions)
        .leftJoin(users, eq(giftedSubscriptions.userId, users.id))
        .orderBy(desc(giftedSubscriptions.createdAt));

      return rows;
    }),

    /** Grant a gifted subscription to a user (admin only) */
    grant: adminProcedure
      .input(z.object({
        userEmail: z.string().email(),
        plan: z.enum(["pro", "elite", "team"]),
        reason: z.string().optional(),
        durationDays: z.number().optional(), // null = permanent
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Find user by email
        const userRows = await db
          .select({ id: users.id, name: users.name, email: users.email })
          .from(users)
          .where(eq(users.email, input.userEmail))
          .limit(1);

        if (!userRows[0]) {
          throw new Error(`No user found with email: ${input.userEmail}`);
        }

        const targetUser = userRows[0];
        const expiresAt = input.durationDays
          ? new Date(Date.now() + input.durationDays * 24 * 60 * 60 * 1000)
          : null;

        await db.insert(giftedSubscriptions).values({
          userId: targetUser.id,
          plan: input.plan,
          grantedBy: ctx.user.id,
          reason: input.reason || null,
          expiresAt,
        });

        return {
          success: true,
          userName: targetUser.name,
          userEmail: targetUser.email,
          plan: input.plan,
          expiresAt,
        };
      }),

    /** Revoke a gifted subscription (admin only) */
    revoke: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db
          .update(giftedSubscriptions)
          .set({ revokedAt: new Date() })
          .where(eq(giftedSubscriptions.id, input.id));

        return { success: true };
      }),

    /** Extend a gifted subscription (admin only) */
    extend: adminProcedure
      .input(z.object({
        id: z.number(),
        additionalDays: z.number(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const rows = await db
          .select()
          .from(giftedSubscriptions)
          .where(eq(giftedSubscriptions.id, input.id))
          .limit(1);

        if (!rows[0]) throw new Error("Gifted subscription not found");

        const currentExpiry = rows[0].expiresAt || new Date();
        const newExpiry = new Date(currentExpiry.getTime() + input.additionalDays * 24 * 60 * 60 * 1000);

        await db
          .update(giftedSubscriptions)
          .set({ expiresAt: newExpiry })
          .where(eq(giftedSubscriptions.id, input.id));

        return { success: true, newExpiresAt: newExpiry };
      }),

    /** Search users by email for the gift form (admin only) */
    searchUsers: adminProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const rows = await db
          .select({ id: users.id, name: users.name, email: users.email, subscriptionPlan: users.subscriptionPlan })
          .from(users)
          .where(sql`${users.email} LIKE ${`%${input.query}%`} OR ${users.name} LIKE ${`%${input.query}%`}`)
          .limit(10);

        return rows;
      }),
   }),

  // ─── Lead Capture ───────────────────────────────────────────
  leads: router({
    /** Capture an email lead (public - no auth required) */
    capture: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
        source: z.string().default("homepage"),
        leadMagnet: z.string().default("5-mistakes"),
      }))
      .mutation(async ({ input }) => {
        const db = (await getDb())!;
        // Check if email already exists
        const existing = await db.select().from(emailLeads).where(eq(emailLeads.email, input.email)).limit(1);
        if (existing.length > 0) {
          // Already captured, just return success with download URL
          return { success: true, alreadySubscribed: true, downloadUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/Freedom-One-Top-5-Rehabbing-Mistakes_c11078c9.pdf" };
        }
        await db.insert(emailLeads).values({
          email: input.email,
          name: input.name || null,
          source: input.source,
          leadMagnet: input.leadMagnet,
        });
        return { success: true, alreadySubscribed: false, downloadUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030273730/c3pk6dbyVkhix88pdfEyoY/Freedom-One-Top-5-Rehabbing-Mistakes_c11078c9.pdf" };
      }),

    /** List all leads (admin only) */
    list: adminProcedure.query(async () => {
      const db = (await getDb())!;
      const rows = await db.select().from(emailLeads).orderBy(desc(emailLeads.createdAt)).limit(500);
      return rows;
    }),

    /** Get lead count (admin only) */
    count: adminProcedure.query(async () => {
      const db = (await getDb())!;
      const result = await db.select({ count: sql<number>`count(*)` }).from(emailLeads);
      return { count: result[0]?.count || 0 };
    }),
  }),

  // ─── Blog ──────────────────────────────────────────────────
  blog: router({
    /** Get published posts (public) */
    list: publicProcedure.input(z.object({
      limit: z.number().min(1).max(50).default(12),
      offset: z.number().min(0).default(0),
      category: z.string().optional(),
    })).query(async ({ input }) => {
      const db = (await getDb())!;
      const conditions = [eq(blogPosts.status, "published")];
      if (input.category) conditions.push(eq(blogPosts.category, input.category));
      const posts = await db.select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        category: blogPosts.category,
        tags: blogPosts.tags,
        coverImageUrl: blogPosts.coverImageUrl,
        publishedAt: blogPosts.publishedAt,
        viewCount: blogPosts.viewCount,
      }).from(blogPosts).where(and(...conditions)).orderBy(desc(blogPosts.publishedAt)).limit(input.limit).offset(input.offset);
      const countResult = await db.select({ count: sql<number>`count(*)` }).from(blogPosts).where(and(...conditions));
      return { posts, total: countResult[0]?.count || 0 };
    }),

    /** Get single post by slug (public) */
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const db = (await getDb())!;
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, input.slug)).limit(1);
      if (!post) return null;
      // Increment view count
      await db.update(blogPosts).set({ viewCount: sql`${blogPosts.viewCount} + 1` }).where(eq(blogPosts.id, post.id));
      return post;
    }),

    /** Admin: list all posts (any status) */
    adminList: adminProcedure.input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
      status: z.enum(["draft", "scheduled", "published", "rejected"]).optional(),
    })).query(async ({ input }) => {
      const db = (await getDb())!;
      const conditions = input.status ? [eq(blogPosts.status, input.status)] : [];
      const posts = await db.select().from(blogPosts)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(blogPosts.createdAt)).limit(input.limit).offset(input.offset);
      const countResult = await db.select({ count: sql<number>`count(*)` }).from(blogPosts)
        .where(conditions.length ? and(...conditions) : undefined);
      return { posts, total: countResult[0]?.count || 0 };
    }),

    /** Admin: create or update a blog post */
    upsert: adminProcedure.input(z.object({
      id: z.number().optional(),
      title: z.string().min(1),
      slug: z.string().min(1),
      excerpt: z.string().optional(),
      content: z.string().min(1),
      category: z.string().default("general"),
      tags: z.string().optional(),
      coverImageUrl: z.string().optional(),
      status: z.enum(["draft", "scheduled", "published", "rejected"]).default("draft"),
      scheduledAt: z.date().optional(),
      aiGenerated: z.number().default(0),
    })).mutation(async ({ input, ctx }) => {
      const db = (await getDb())!;
      const publishedAt = input.status === "published" ? new Date() : undefined;
      if (input.id) {
        await db.update(blogPosts).set({
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          content: input.content,
          category: input.category,
          tags: input.tags,
          coverImageUrl: input.coverImageUrl,
          status: input.status,
          scheduledAt: input.scheduledAt,
          ...(publishedAt ? { publishedAt } : {}),
        }).where(eq(blogPosts.id, input.id));
        return { id: input.id };
      } else {
        const [result] = await db.insert(blogPosts).values({
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          content: input.content,
          category: input.category,
          tags: input.tags,
          coverImageUrl: input.coverImageUrl,
          status: input.status,
          scheduledAt: input.scheduledAt,
          publishedAt,
          aiGenerated: input.aiGenerated,
          authorId: ctx.user.id,
        });
        return { id: result.insertId };
      }
    }),

    /** Admin: delete a blog post */
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = (await getDb())!;
      await db.delete(blogPosts).where(eq(blogPosts.id, input.id));
      return { success: true };
    }),

    /** Admin: generate a blog post using AI */
    generate: adminProcedure.input(z.object({
      topic: z.string().optional(),
      category: z.enum(["market-tips", "rehab-strategies", "deal-analysis", "financing", "wholesaling", "brrrr", "general"]).default("general"),
    })).mutation(async ({ ctx, input }) => {
      const categories = ["market-tips", "rehab-strategies", "deal-analysis", "financing", "wholesaling", "brrrr"];
      const category = input.category || categories[Math.floor(Math.random() * categories.length)];
      const topicHint = input.topic || "";

      const prompt = `You are a real estate investing content writer for Freedom One Real Estate System, run by Trey Hill. Write a blog post about ${category.replace("-", " ")}${topicHint ? " focusing on: " + topicHint : ""}.

The audience is real estate investors interested in fix & flip, wholesaling, BRRRR, and private money lending.

Return a JSON object with these fields:
- title: compelling blog post title (60-80 chars)
- slug: URL-friendly slug (lowercase, hyphens)
- excerpt: 1-2 sentence summary for preview cards (under 160 chars)
- content: full article in Markdown format (800-1200 words), with headers, practical tips, and a call to action mentioning Freedom One Real Estate System
- tags: comma-separated relevant tags

Make it actionable, data-driven where possible, and written in a confident but approachable tone.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are an expert real estate investing content writer. Always return valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "blog_post",
            strict: true,
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                slug: { type: "string" },
                excerpt: { type: "string" },
                content: { type: "string" },
                tags: { type: "string" },
              },
              required: ["title", "slug", "excerpt", "content", "tags"],
              additionalProperties: false,
            },
          },
        },
      });

      const msgContent = response.choices[0].message.content;
      const parsed = JSON.parse(typeof msgContent === 'string' ? msgContent : '{}');
      const db = (await getDb())!;
      // Ensure unique slug
      const uniqueSlug = parsed.slug + "-" + Date.now().toString(36);
      const [result] = await db.insert(blogPosts).values({
        title: parsed.title,
        slug: uniqueSlug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        category,
        tags: parsed.tags,
        status: "draft",
        aiGenerated: 1,
        authorId: ctx.user.id,
      });
      return { id: result.insertId, title: parsed.title, slug: uniqueSlug };
    }),

    /** Admin: publish scheduled posts (called by cron or manually) */
    publishScheduled: adminProcedure.mutation(async () => {
      const db = (await getDb())!;
      const now = new Date();
      const scheduled = await db.select().from(blogPosts)
        .where(and(eq(blogPosts.status, "scheduled"), sql`${blogPosts.scheduledAt} <= ${now}`));
      for (const post of scheduled) {
        await db.update(blogPosts).set({ status: "published", publishedAt: now }).where(eq(blogPosts.id, post.id));
      }
      return { published: scheduled.length };
    }),

    /** Public: get categories with post counts */
    categories: publicProcedure.query(async () => {
      const db = (await getDb())!;
      const results = await db.select({
        category: blogPosts.category,
        count: sql<number>`count(*)`,
      }).from(blogPosts).where(eq(blogPosts.status, "published")).groupBy(blogPosts.category);
      return results;
    }),
  }),
});
export type AppRouter = typeof appRouter;
