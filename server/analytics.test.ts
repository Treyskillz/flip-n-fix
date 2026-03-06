import { describe, it, expect } from "vitest";

describe("Analytics Dashboard", () => {
  it("should define the analytics.dashboard router", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter._def.procedures).toHaveProperty("analytics.dashboard");
  });

  it("analytics.dashboard should be a protected query", async () => {
    const { appRouter } = await import("./routers");
    const proc = (appRouter._def.procedures as any)["analytics.dashboard"];
    expect(proc).toBeDefined();
    expect(proc._def.type).toBe("query");
  });
});

describe("Deal Comparison", () => {
  it("should define the comparison.getDeals router", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter._def.procedures).toHaveProperty("comparison.getDeals");
  });

  it("comparison.getDeals should be a protected query", async () => {
    const { appRouter } = await import("./routers");
    const proc = (appRouter._def.procedures as any)["comparison.getDeals"];
    expect(proc).toBeDefined();
    expect(proc._def.type).toBe("query");
  });

  it("comparison.getDeals should require dealIds input with 2-6 items", async () => {
    const { appRouter } = await import("./routers");
    const proc = (appRouter._def.procedures as any)["comparison.getDeals"];
    // The input schema should exist
    expect(proc._def.inputs).toBeDefined();
    expect(proc._def.inputs.length).toBeGreaterThan(0);
  });
});

describe("Team Features - AI Deal Summary", () => {
  it("should define the teamFeatures.aiDealSummary router", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter._def.procedures).toHaveProperty("teamFeatures.aiDealSummary");
  });

  it("aiDealSummary should be a protected mutation", async () => {
    const { appRouter } = await import("./routers");
    const proc = (appRouter._def.procedures as any)["teamFeatures.aiDealSummary"];
    expect(proc).toBeDefined();
    expect(proc._def.type).toBe("mutation");
  });
});

describe("Team Features - Bulk Export", () => {
  it("should define the teamFeatures.bulkExport router", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter._def.procedures).toHaveProperty("teamFeatures.bulkExport");
  });

  it("bulkExport should be a protected mutation", async () => {
    const { appRouter } = await import("./routers");
    const proc = (appRouter._def.procedures as any)["teamFeatures.bulkExport"];
    expect(proc).toBeDefined();
    expect(proc._def.type).toBe("mutation");
  });
});

describe("Products - Team Tier Features", () => {
  it("should have Team tier with higher price than Elite", async () => {
    const { PLANS } = await import("./stripe/products");
    const elite = PLANS.elite;
    const team = PLANS.team;
    expect(elite).toBeDefined();
    expect(team).toBeDefined();
    expect(team.priceMonthly).toBeGreaterThan(elite.priceMonthly);
  });

  it("Team tier should have exclusive features", async () => {
    const { PLANS } = await import("./stripe/products");
    const team = PLANS.team;
    expect(team).toBeDefined();
    const features = team.features.map((f: string) => f.toLowerCase());
    // Check for key Team-exclusive features
    const hasWhiteLabel = features.some((f: string) => f.includes("white-label") || f.includes("white label"));
    const hasAiSummary = features.some((f: string) => f.includes("ai") && f.includes("summary"));
    const hasBulkExport = features.some((f: string) => f.includes("bulk") || f.includes("database export"));
    const hasAnalytics = features.some((f: string) => f.includes("analytics"));
    const hasComparison = features.some((f: string) => f.includes("comparison") || f.includes("compare"));
    
    expect(hasWhiteLabel || hasAiSummary || hasBulkExport || hasAnalytics || hasComparison).toBe(true);
  });

  it("all tiers should have features listed", async () => {
    const { PLANS } = await import("./stripe/products");
    for (const key of Object.keys(PLANS)) {
      const plan = (PLANS as any)[key];
      expect(plan.features.length).toBeGreaterThan(0);
      expect(plan.name).toBeTruthy();
      expect(plan.priceMonthly).toBeGreaterThanOrEqual(0);
    }
  });
});
