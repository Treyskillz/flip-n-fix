import { getDb } from "./db";
import { blogPosts } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";
import { postToFacebook, isFacebookConfigured } from "./facebook";
import { eq, sql } from "drizzle-orm";
import type { Express } from "express";

const CATEGORIES = [
  "market-tips",
  "rehab-strategies",
  "deal-analysis",
  "financing",
  "wholesaling",
  "brrrr",
] as const;

const TOPIC_POOL = [
  "How to analyze a fix and flip deal in under 5 minutes",
  "Top 5 rehab mistakes that kill your profit margin",
  "Finding off-market deals: direct mail vs driving for dollars",
  "Hard money vs private money: which is right for your deal?",
  "The BRRRR method explained: build wealth through rentals",
  "Wholesaling 101: how to assign contracts for profit",
  "Understanding ARV and how to calculate it accurately",
  "How to build a reliable contractor team for your flips",
  "Subject-to financing: creative deals without bank loans",
  "Market analysis: how to pick the right neighborhoods to invest in",
  "How to estimate rehab costs room by room",
  "Exit strategies every real estate investor should know",
  "Building credibility with private money lenders",
  "The 70% rule and when to break it",
  "Short-term rental investing: Airbnb vs traditional rentals",
  "How to create a scope of work that contractors respect",
  "Negotiation tactics for buying distressed properties",
  "Tax strategies for fix and flip investors",
  "How to scale from 1 flip to 10 flips per year",
  "Due diligence checklist before buying any investment property",
  "Understanding cap rates and cash-on-cash returns",
  "How to find and vet private money lenders",
  "The real cost of holding a property too long",
  "Marketing strategies for selling your flipped property fast",
  "How to use comps to determine the right offer price",
];

/**
 * Generate and publish a blog post automatically.
 * Called by the scheduled cron endpoint.
 */
export async function autoGenerateAndPublishBlogPost(): Promise<{
  success: boolean;
  title?: string;
  slug?: string;
  facebookShared?: boolean;
  error?: string;
}> {
  try {
    const db = (await getDb())!;

    // Pick a random category and topic
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const topic = TOPIC_POOL[Math.floor(Math.random() * TOPIC_POOL.length)];

    const prompt = `You are a real estate investing content writer for Freedom One Real Estate System, run by Trey Hill. Write a blog post about ${category.replace(/-/g, " ")} focusing on: ${topic}.

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
    const parsed = JSON.parse(typeof msgContent === "string" ? msgContent : "{}");

    // Ensure unique slug
    const uniqueSlug = parsed.slug + "-" + Date.now().toString(36);

    // Insert as published
    const [result] = await db.insert(blogPosts).values({
      title: parsed.title,
      slug: uniqueSlug,
      excerpt: parsed.excerpt,
      content: parsed.content,
      category,
      tags: parsed.tags,
      status: "published",
      publishedAt: new Date(),
      aiGenerated: 1,
      authorId: null,
    });

    // Auto-post to Facebook if configured
    let facebookShared = false;
    if (isFacebookConfigured()) {
      const postUrl = `https://www.freedomoneproperties.com/blog/${uniqueSlug}`;
      const message = `📰 New Article: ${parsed.title}\n\n${parsed.excerpt || "Read the full article on Freedom One Real Estate System."}\n\n#RealEstateInvesting #FixAndFlip #FreedomOne`;
      const fbResult = await postToFacebook(message, postUrl);
      if (fbResult.success) {
        await db.update(blogPosts).set({
          facebookShared: 1,
          facebookPostId: fbResult.postId || null,
        }).where(eq(blogPosts.id, Number(result.insertId)));
        facebookShared = true;
      }
    }

    // Also publish any scheduled posts that are due
    const now = new Date();
    const scheduled = await db.select().from(blogPosts)
      .where(sql`${blogPosts.status} = 'scheduled' AND ${blogPosts.scheduledAt} <= ${now}`);
    for (const post of scheduled) {
      await db.update(blogPosts).set({ status: "published", publishedAt: now }).where(eq(blogPosts.id, post.id));
    }

    console.log(`[AutoBlog] Published: "${parsed.title}" (${uniqueSlug}), FB: ${facebookShared}, Scheduled published: ${scheduled.length}`);

    return {
      success: true,
      title: parsed.title,
      slug: uniqueSlug,
      facebookShared,
    };
  } catch (error: any) {
    console.error("[AutoBlog] Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Register the auto-blog cron endpoint on the Express app.
 * Protected by a simple secret token check.
 */
export function registerAutoBlogRoute(app: Express) {
  app.post("/api/cron/auto-blog", async (req, res) => {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET || process.env.JWT_SECRET || "";

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await autoGenerateAndPublishBlogPost();
    return res.json(result);
  });
}
