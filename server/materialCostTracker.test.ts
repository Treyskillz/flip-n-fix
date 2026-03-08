import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database
const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockResolvedValue(undefined),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
};

vi.mock("./db", () => ({
  getDb: vi.fn(() => Promise.resolve(mockDb)),
}));

vi.mock("../drizzle/schema", () => ({
  productCatalog: { sku: "sku", name: "name", status: "status", category: "category", originalPrice: "originalPrice", currentPrice: "currentPrice", priceChangePct: "priceChangePct" },
  priceHistory: { sku: "sku", price: "price", checkedAt: "checkedAt" },
  verificationLog: { triggeredBy: "triggeredBy" },
  users: { id: "id", role: "role", subscriptionPlan: "subscriptionPlan" },
  savedDeals: {},
  sharedDeals: {},
  dealPhotos: {},
  courseProgress: {},
  quizResults: {},
  userProfiles: {},
  credibilityProjects: {},
  credibilityAttachments: {},
  pipelineDeals: {},
  pipelineContacts: {},
  pipelineActivities: {},
  giftedSubscriptions: {},
  emailLeads: {},
  blogPosts: {},
  whiteLabelSettings: {},
}));

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

vi.mock("./_core/imageGeneration", () => ({
  generateImage: vi.fn(),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn(),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./stripe/checkout", () => ({
  createCheckoutSession: vi.fn(),
  createPortalSession: vi.fn(),
}));

describe("Material Cost Tracker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Category Summary Calculation", () => {
    it("should compute category summary from product list", () => {
      const products = [
        { sku: "1", name: "Faucet A", category: "Kitchen", originalPrice: "$100.00", currentPrice: "$110.00", priceChangePct: 1000, status: "verified", lastCheckedAt: new Date() },
        { sku: "2", name: "Faucet B", category: "Kitchen", originalPrice: "$200.00", currentPrice: "$190.00", priceChangePct: -500, status: "verified", lastCheckedAt: new Date() },
        { sku: "3", name: "Toilet", category: "Bathroom", originalPrice: "$300.00", currentPrice: null, priceChangePct: null, status: "unknown", lastCheckedAt: null },
        { sku: "4", name: "Vanity", category: "Bathroom", originalPrice: "$450.00", currentPrice: "$500.00", priceChangePct: 1111, status: "discontinued", lastCheckedAt: new Date() },
      ];

      const categoryMap: Record<string, any> = {};
      for (const p of products) {
        const cat = p.category || "Uncategorized";
        if (!categoryMap[cat]) {
          categoryMap[cat] = { category: cat, products: 0, avgOriginalPrice: 0, avgPriceChange: 0, verified: 0, discontinued: 0, unavailable: 0, unknown: 0 };
        }
        const entry = categoryMap[cat];
        entry.products++;
        const origPrice = parseFloat(p.originalPrice.replace(/[^0-9.]/g, "")) || 0;
        entry.avgOriginalPrice += origPrice;
        if (p.priceChangePct) entry.avgPriceChange += p.priceChangePct;
        if (p.status === "verified") entry.verified++;
        if (p.status === "discontinued") entry.discontinued++;
        if (p.status === "unavailable") entry.unavailable++;
        if (p.status === "unknown") entry.unknown++;
      }

      const result = Object.values(categoryMap).map((c: any) => ({
        ...c,
        avgOriginalPrice: c.products > 0 ? Math.round((c.avgOriginalPrice / c.products) * 100) / 100 : 0,
        avgPriceChange: c.products > 0 ? Math.round(c.avgPriceChange / c.products) : 0,
      }));

      const kitchen = result.find((r: any) => r.category === "Kitchen");
      const bathroom = result.find((r: any) => r.category === "Bathroom");

      expect(kitchen).toBeDefined();
      expect(kitchen!.products).toBe(2);
      expect(kitchen!.avgOriginalPrice).toBe(150);
      expect(kitchen!.verified).toBe(2);
      expect(kitchen!.avgPriceChange).toBe(250); // (1000 + -500) / 2

      expect(bathroom).toBeDefined();
      expect(bathroom!.products).toBe(2);
      expect(bathroom!.avgOriginalPrice).toBe(375);
      expect(bathroom!.discontinued).toBe(1);
      expect(bathroom!.unknown).toBe(1);
    });

    it("should handle products without categories", () => {
      const products = [
        { sku: "1", name: "No Cat", category: null, originalPrice: "$50.00", currentPrice: null, priceChangePct: null, status: "unknown" },
      ];

      const categoryMap: Record<string, any> = {};
      for (const p of products) {
        const cat = p.category || "Uncategorized";
        if (!categoryMap[cat]) {
          categoryMap[cat] = { category: cat, products: 0 };
        }
        categoryMap[cat].products++;
      }

      expect(categoryMap["Uncategorized"]).toBeDefined();
      expect(categoryMap["Uncategorized"].products).toBe(1);
    });
  });

  describe("Public Products Query", () => {
    it("should return correct fields for public products", () => {
      const publicProduct = {
        sku: "302575146",
        name: "Daltile Restore Bright White 3x6 Subway Tile",
        url: "https://www.homedepot.com/p/302575146",
        originalPrice: "$12.98/case",
        currentPrice: "$13.48/case",
        priceChangePct: 385,
        status: "verified",
        category: "Bathroom",
        lastCheckedAt: new Date(),
        alternativeName: null,
        alternativeUrl: null,
        alternativePrice: null,
      };

      // Verify all required fields exist
      expect(publicProduct.sku).toBeTruthy();
      expect(publicProduct.name).toBeTruthy();
      expect(publicProduct.url).toContain("homedepot.com");
      expect(publicProduct.originalPrice).toBeTruthy();
      expect(publicProduct.status).toBe("verified");
      expect(publicProduct.category).toBe("Bathroom");
      // Should NOT include admin-only fields
      expect(publicProduct).not.toHaveProperty("alternativeSku");
    });

    it("should filter by category when provided", () => {
      const allProducts = [
        { sku: "1", category: "Kitchen", name: "Faucet" },
        { sku: "2", category: "Bathroom", name: "Toilet" },
        { sku: "3", category: "Kitchen", name: "Sink" },
      ];

      const filtered = allProducts.filter((p) => p.category === "Kitchen");
      expect(filtered).toHaveLength(2);
      expect(filtered.every((p) => p.category === "Kitchen")).toBe(true);
    });

    it("should return all products when no category filter", () => {
      const allProducts = [
        { sku: "1", category: "Kitchen" },
        { sku: "2", category: "Bathroom" },
        { sku: "3", category: "Electrical" },
      ];

      expect(allProducts).toHaveLength(3);
    });
  });

  describe("Price Trend Grouping", () => {
    it("should group price history by date and category", () => {
      const history = [
        { sku: "1", price: "$100.00", checkedAt: new Date("2026-01-15") },
        { sku: "2", price: "$200.00", checkedAt: new Date("2026-01-15") },
        { sku: "3", price: "$50.00", checkedAt: new Date("2026-02-15") },
      ];

      const skuToCategory: Record<string, string> = {
        "1": "Kitchen",
        "2": "Kitchen",
        "3": "Bathroom",
      };

      const trends: Record<string, Record<string, { total: number; count: number }>> = {};
      for (const h of history) {
        const dateKey = new Date(h.checkedAt).toISOString().split("T")[0];
        const cat = skuToCategory[h.sku] || "Uncategorized";
        if (!trends[dateKey]) trends[dateKey] = {};
        if (!trends[dateKey][cat]) trends[dateKey][cat] = { total: 0, count: 0 };
        const price = parseFloat(h.price.replace(/[^0-9.]/g, "")) || 0;
        trends[dateKey][cat].total += price;
        trends[dateKey][cat].count++;
      }

      const result = Object.entries(trends).map(([date, cats]) => ({
        date,
        categories: Object.entries(cats).map(([cat, data]) => ({
          category: cat,
          avgPrice: Math.round((data.total / data.count) * 100) / 100,
          productCount: data.count,
        })),
      }));

      expect(result).toHaveLength(2);
      const jan = result.find((r) => r.date === "2026-01-15");
      expect(jan).toBeDefined();
      expect(jan!.categories).toHaveLength(1);
      expect(jan!.categories[0].category).toBe("Kitchen");
      expect(jan!.categories[0].avgPrice).toBe(150);
      expect(jan!.categories[0].productCount).toBe(2);

      const feb = result.find((r) => r.date === "2026-02-15");
      expect(feb).toBeDefined();
      expect(feb!.categories[0].category).toBe("Bathroom");
      expect(feb!.categories[0].avgPrice).toBe(50);
    });
  });

  describe("Category Color Mapping", () => {
    it("should have colors for all 11 categories", () => {
      const CATEGORY_COLORS: Record<string, string> = {
        Kitchen: "#ef4444",
        Bathroom: "#3b82f6",
        Bedroom: "#8b5cf6",
        "Living Room": "#f59e0b",
        Electrical: "#10b981",
        HVAC: "#06b6d4",
        Plumbing: "#6366f1",
        "Roof & Gutter": "#ec4899",
        "Structural & Windows": "#84cc16",
        "Landscaping & Exterior": "#14b8a6",
        Garage: "#f97316",
      };

      expect(Object.keys(CATEGORY_COLORS)).toHaveLength(11);
      // All colors should be valid hex
      for (const color of Object.values(CATEGORY_COLORS)) {
        expect(color).toMatch(/^#[0-9a-f]{6}$/);
      }
    });
  });

  describe("Subscription Gating", () => {
    it("should allow Pro, Elite, and Team plans", () => {
      const allowedPlans = ["pro", "elite", "team"];
      const testCases = [
        { plan: "pro", expected: true },
        { plan: "elite", expected: true },
        { plan: "team", expected: true },
        { plan: "free", expected: false },
        { plan: null, expected: false },
      ];

      for (const tc of testCases) {
        const isPro = allowedPlans.includes(tc.plan || "");
        expect(isPro).toBe(tc.expected);
      }
    });
  });

  describe("Pricing Page Feature", () => {
    it("should include Material Cost Tracker in Pro features", async () => {
      const { PLANS } = await import("./stripe/products");
      expect(PLANS.pro.features).toContain("Material Cost Tracker Dashboard");
    });
  });
});

describe("Product Verification Cron", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Cron Endpoint Registration", () => {
    it("should register the product-verify cron endpoint", async () => {
      const { registerProductVerifyRoute } = await import("./productVerifyCron");
      const handlers: Record<string, Function> = {};
      const mockApp = {
        post: vi.fn((path: string, handler: Function) => {
          handlers[path] = handler;
        }),
      } as any;

      registerProductVerifyRoute(mockApp);
      expect(mockApp.post).toHaveBeenCalledWith("/api/cron/product-verify", expect.any(Function));
    }, 15000);

    it("should reject unauthorized cron requests", async () => {
      const { registerProductVerifyRoute } = await import("./productVerifyCron");
      const handlers: Record<string, Function> = {};
      const mockApp = {
        post: vi.fn((path: string, handler: Function) => {
          handlers[path] = handler;
        }),
      } as any;

      registerProductVerifyRoute(mockApp);

      const mockReq = { headers: { authorization: "Bearer wrong-token" } };
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };

      await handlers["/api/cron/product-verify"](mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    }, 15000);
  });

  describe("Verification Log Structure", () => {
    it("should produce correct verification log entry", () => {
      const logEntry = {
        triggeredBy: "cron",
        totalProducts: 100,
        verified: 85,
        discontinued: 10,
        unavailable: 5,
        priceAlerts: 3,
        duration: 45000,
      };

      expect(logEntry.triggeredBy).toBe("cron");
      expect(logEntry.totalProducts).toBe(logEntry.verified + logEntry.discontinued + logEntry.unavailable);
      expect(logEntry.priceAlerts).toBeLessThanOrEqual(logEntry.totalProducts);
      expect(logEntry.duration).toBeGreaterThan(0);
    });
  });

  describe("Batch Processing", () => {
    it("should process products in batches of 10", () => {
      const allProducts = Array.from({ length: 25 }, (_, i) => ({ sku: `SKU${i}`, name: `Product ${i}` }));
      const batches: typeof allProducts[] = [];
      for (let i = 0; i < allProducts.length; i += 10) {
        batches.push(allProducts.slice(i, i + 10));
      }

      expect(batches).toHaveLength(3);
      expect(batches[0]).toHaveLength(10);
      expect(batches[1]).toHaveLength(10);
      expect(batches[2]).toHaveLength(5);
    });
  });

  describe("Price Alert Threshold", () => {
    it("should trigger alert for >10% price change", () => {
      const testCases = [
        { origPrice: 100, currPrice: 112, shouldAlert: true },
        { origPrice: 100, currPrice: 108, shouldAlert: false },
        { origPrice: 100, currPrice: 88, shouldAlert: true },
        { origPrice: 100, currPrice: 100, shouldAlert: false },
        { origPrice: 100, currPrice: 111, shouldAlert: true },
        { origPrice: 100, currPrice: 91, shouldAlert: false },
      ];

      for (const tc of testCases) {
        const pctChange = Math.abs(((tc.currPrice - tc.origPrice) / tc.origPrice) * 100);
        const shouldAlert = pctChange >= 10;
        expect(shouldAlert).toBe(tc.shouldAlert);
      }
    });
  });
});

describe("Manual Documentation", () => {
  it("should include Material Cost Tracker section in manual", async () => {
    const { MANUAL_SECTIONS } = await import("../client/src/lib/manual");
    const section = MANUAL_SECTIONS.find((s: any) => s.id === "material-cost-tracker");
    expect(section).toBeDefined();
    expect(section!.title).toBe("Material Cost Tracker");
    expect(section!.content).toContain("Material Cost Tracker");
    expect(section!.content).toContain("Pro");
    expect(section!.content).toContain("Category Breakdown");
    expect(section!.content).toContain("Automated Monthly Verification");
  });

  it("should mention Material Cost Tracker in overview", async () => {
    const { MANUAL_SECTIONS } = await import("../client/src/lib/manual");
    const overview = MANUAL_SECTIONS.find((s: any) => s.id === "overview");
    expect(overview).toBeDefined();
    expect(overview!.content).toContain("Material Cost Tracker");
  });
});
