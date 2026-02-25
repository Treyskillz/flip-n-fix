import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { PLANS, getPlanByPriceId } from "./stripe/products";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    stripeCustomerId: null,
    subscriptionPlan: "free",
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("subscription.plans", () => {
  it("returns all 4 plans", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const plans = await caller.subscription.plans();

    expect(plans).toHaveLength(4);
    expect(plans.map((p) => p.id)).toEqual(["free", "pro", "elite", "team"]);
  });

  it("free plan has zero price", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const plans = await caller.subscription.plans();
    const freePlan = plans.find((p) => p.id === "free");

    expect(freePlan).toBeDefined();
    expect(freePlan!.priceMonthly).toBe(0);
    expect(freePlan!.priceYearly).toBe(0);
  });

  it("pro plan has correct pricing", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const plans = await caller.subscription.plans();
    const proPlan = plans.find((p) => p.id === "pro");

    expect(proPlan).toBeDefined();
    expect(proPlan!.priceMonthly).toBe(3900);
    expect(proPlan!.priceYearly).toBe(39000);
  });

  it("all paid plans have features", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const plans = await caller.subscription.plans();

    for (const plan of plans) {
      expect(plan.features.length).toBeGreaterThan(0);
    }
  });
});

describe("stripe products", () => {
  it("PLANS has all 4 tiers", () => {
    expect(Object.keys(PLANS)).toEqual(["free", "pro", "elite", "team"]);
  });

  it("getPlanByPriceId returns correct plan", () => {
    expect(getPlanByPriceId("pro_monthly")).toBe("pro");
    expect(getPlanByPriceId("elite_monthly")).toBe("elite");
    expect(getPlanByPriceId("team_monthly")).toBe("team");
    expect(getPlanByPriceId("nonexistent")).toBeNull();
  });

  it("free plan has no priceId", () => {
    expect(PLANS.free.priceId).toBeNull();
  });

  it("paid plans have positive prices", () => {
    expect(PLANS.pro.priceMonthly).toBeGreaterThan(0);
    expect(PLANS.elite.priceMonthly).toBeGreaterThan(0);
    expect(PLANS.team.priceMonthly).toBeGreaterThan(0);
  });

  it("yearly prices are approximately 10x monthly", () => {
    expect(PLANS.pro.priceYearly).toBe(PLANS.pro.priceMonthly * 10);
    expect(PLANS.elite.priceYearly).toBe(PLANS.elite.priceMonthly * 10);
    expect(PLANS.team.priceYearly).toBe(PLANS.team.priceMonthly * 10);
  });
});

describe("subscription.status", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.subscription.status()).rejects.toThrow();
  });
});

describe("subscription.createCheckout", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.subscription.createCheckout({
        plan: "pro",
        interval: "month",
        origin: "https://example.com",
      })
    ).rejects.toThrow();
  });
});

describe("subscription.createPortal", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.subscription.createPortal({
        origin: "https://example.com",
      })
    ).rejects.toThrow();
  });
});
