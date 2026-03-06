import type { Express } from "express";
import { getDb } from "./db";
import { productCatalog, priceHistory, verificationLog } from "../drizzle/schema";
import { eq, asc } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

/**
 * Run a full product catalog verification.
 * Verifies all products via LLM, updates statuses, records price history,
 * logs the run, and sends a summary notification to the owner.
 */
export async function runProductVerification(): Promise<{
  total: number;
  verified: number;
  discontinued: number;
  unavailable: number;
  priceAlerts: number;
  duration: number;
}> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startTime = Date.now();
  const allProducts = await db.select().from(productCatalog);
  if (allProducts.length === 0) {
    return { total: 0, verified: 0, discontinued: 0, unavailable: 0, priceAlerts: 0, duration: 0 };
  }

  let priceAlertCount = 0;
  let discontinuedCount = 0;
  let verifiedCount = 0;
  let unavailableCount = 0;

  // Process in batches of 10
  for (let i = 0; i < allProducts.length; i += 10) {
    const batch = allProducts.slice(i, i + 10);
    const productList = batch
      .map((p) => `SKU: ${p.sku}, Name: ${p.name}, Price: ${p.originalPrice}, URL: ${p.url}`)
      .join("\n");

    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are a Home Depot product verification assistant. For each product, determine if it is likely still available based on the SKU and product name. Return JSON only.",
          },
          {
            role: "user",
            content: `Verify these Home Depot products:\n\n${productList}\n\nReturn JSON: { "results": [{ "sku": string, "status": "verified"|"discontinued"|"unavailable", "currentPrice": string|null, "alternativeName": string|null, "alternativeSku": string|null, "alternativeUrl": string|null, "alternativePrice": string|null, "reason": string }] }`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "product_verification",
            strict: true,
            schema: {
              type: "object",
              properties: {
                results: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      sku: { type: "string" },
                      status: { type: "string", enum: ["verified", "discontinued", "unavailable"] },
                      currentPrice: { type: ["string", "null"] },
                      alternativeName: { type: ["string", "null"] },
                      alternativeSku: { type: ["string", "null"] },
                      alternativeUrl: { type: ["string", "null"] },
                      alternativePrice: { type: ["string", "null"] },
                      reason: { type: "string" },
                    },
                    required: [
                      "sku",
                      "status",
                      "currentPrice",
                      "alternativeName",
                      "alternativeSku",
                      "alternativeUrl",
                      "alternativePrice",
                      "reason",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: ["results"],
              additionalProperties: false,
            },
          },
        },
      });

      const parsed = JSON.parse((response.choices[0].message.content as string) || "{}");
      for (const r of parsed.results || []) {
        const updates: Record<string, any> = { status: r.status, lastCheckedAt: new Date() };
        if (r.currentPrice) updates.currentPrice = r.currentPrice;
        if (r.alternativeName) updates.alternativeName = r.alternativeName;
        if (r.alternativeSku) updates.alternativeSku = r.alternativeSku;
        if (r.alternativeUrl) updates.alternativeUrl = r.alternativeUrl;
        if (r.alternativePrice) updates.alternativePrice = r.alternativePrice;

        if (r.currentPrice) {
          const existing = batch.find((p) => p.sku === r.sku);
          if (existing) {
            const origNum = parseFloat(existing.originalPrice.replace(/[^0-9.]/g, ""));
            const currNum = parseFloat(r.currentPrice.replace(/[^0-9.]/g, ""));
            if (!isNaN(origNum) && !isNaN(currNum) && origNum > 0) {
              updates.priceChangePct = Math.round(((currNum - origNum) / origNum) * 10000);
              if (Math.abs(((currNum - origNum) / origNum) * 100) >= 10) priceAlertCount++;
            }
          }
        }

        await db.update(productCatalog).set(updates).where(eq(productCatalog.sku, r.sku));
        await db.insert(priceHistory).values({
          sku: r.sku,
          price: r.currentPrice || batch.find((p) => p.sku === r.sku)?.originalPrice || "0",
          priceChangePct: updates.priceChangePct || null,
          status: r.status,
        });

        if (r.status === "verified") verifiedCount++;
        if (r.status === "discontinued") discontinuedCount++;
        if (r.status === "unavailable") unavailableCount++;
      }
    } catch (err) {
      console.error(`[ProductVerifyCron] Batch ${i}-${i + 10} failed:`, err);
    }
  }

  const duration = Date.now() - startTime;

  // Log the verification run
  await db.insert(verificationLog).values({
    triggeredBy: "cron",
    totalProducts: allProducts.length,
    verified: verifiedCount,
    discontinued: discontinuedCount,
    unavailable: unavailableCount,
    priceAlerts: priceAlertCount,
    duration,
  });

  // Notify owner with summary
  await notifyOwner({
    title: "Monthly Product Verification Complete",
    content: `Verified ${allProducts.length} products in ${Math.round(duration / 1000)}s.\n\nVerified: ${verifiedCount}\nDiscontinued: ${discontinuedCount}\nUnavailable: ${unavailableCount}\nPrice Alerts (>10%): ${priceAlertCount}\n\nReview the Product Catalog admin page for details.`,
  });

  console.log(
    `[ProductVerifyCron] Complete: ${allProducts.length} products, ${verifiedCount} verified, ${discontinuedCount} discontinued, ${unavailableCount} unavailable, ${priceAlertCount} price alerts, ${Math.round(duration / 1000)}s`
  );

  return {
    total: allProducts.length,
    verified: verifiedCount,
    discontinued: discontinuedCount,
    unavailable: unavailableCount,
    priceAlerts: priceAlertCount,
    duration,
  };
}

/**
 * Register the product verification cron endpoint on the Express app.
 * Protected by a simple secret token check (same as auto-blog).
 */
export function registerProductVerifyRoute(app: Express) {
  app.post("/api/cron/product-verify", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET || process.env.JWT_SECRET || "";
    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const result = await runProductVerification();
      return res.json({ success: true, ...result });
    } catch (err: any) {
      console.error("[ProductVerifyCron] Error:", err);
      return res.status(500).json({ error: err.message || "Verification failed" });
    }
  });
}
