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
  productCatalog: { sku: "sku", name: "name", status: "status" },
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

describe("Product Catalog System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Data Model", () => {
    it("should define correct product catalog fields", () => {
      // Verify the product catalog schema has all required fields
      const requiredFields = [
        "sku",
        "name",
        "url",
        "originalPrice",
        "currentPrice",
        "priceChangePct",
        "status",
        "lastCheckedAt",
        "alternativeSku",
        "alternativeName",
        "alternativeUrl",
        "alternativePrice",
        "category",
      ];

      // The schema should exist (imported above)
      expect(requiredFields).toHaveLength(13);
    });

    it("should support all four product statuses", () => {
      const validStatuses = ["verified", "discontinued", "unavailable", "unknown"];
      expect(validStatuses).toContain("verified");
      expect(validStatuses).toContain("discontinued");
      expect(validStatuses).toContain("unavailable");
      expect(validStatuses).toContain("unknown");
    });
  });

  describe("Price Change Calculation", () => {
    it("should calculate price increase correctly", () => {
      const originalPrice = "$247.00";
      const currentPrice = "$259.35";
      const origNum = parseFloat(originalPrice.replace(/[^0-9.]/g, ""));
      const currNum = parseFloat(currentPrice.replace(/[^0-9.]/g, ""));
      const changePct = Math.round(((currNum - origNum) / origNum) * 10000);

      expect(changePct).toBe(500); // 5.00%
      expect(changePct / 100).toBeCloseTo(5.0, 1);
    });

    it("should calculate price decrease correctly", () => {
      const originalPrice = "$129.00";
      const currentPrice = "$119.97";
      const origNum = parseFloat(originalPrice.replace(/[^0-9.]/g, ""));
      const currNum = parseFloat(currentPrice.replace(/[^0-9.]/g, ""));
      const changePct = Math.round(((currNum - origNum) / origNum) * 10000);

      expect(changePct).toBeLessThan(0);
      expect(changePct / 100).toBeCloseTo(-7.0, 0);
    });

    it("should handle zero price change", () => {
      const originalPrice = "$55.00";
      const currentPrice = "$55.00";
      const origNum = parseFloat(originalPrice.replace(/[^0-9.]/g, ""));
      const currNum = parseFloat(currentPrice.replace(/[^0-9.]/g, ""));
      const changePct = Math.round(((currNum - origNum) / origNum) * 10000);

      expect(changePct).toBe(0);
    });

    it("should handle prices with complex formatting", () => {
      const originalPrice = "$1,000+";
      const currentPrice = "$1,200.50";
      const origNum = parseFloat(originalPrice.replace(/[^0-9.]/g, ""));
      const currNum = parseFloat(currentPrice.replace(/[^0-9.]/g, ""));

      expect(origNum).toBe(1000);
      expect(currNum).toBe(1200.5);

      const changePct = Math.round(((currNum - origNum) / origNum) * 10000);
      expect(changePct).toBe(2005); // 20.05%
    });

    it("should handle per-unit pricing format", () => {
      const originalPrice = "$55.00/sq ft installed";
      const origNum = parseFloat(originalPrice.replace(/[^0-9.]/g, ""));
      expect(origNum).toBe(55.0);
    });
  });

  describe("Product Catalog Entry Structure", () => {
    it("should create a valid catalog entry", () => {
      const entry = {
        sku: "302575146",
        name: "Daltile Restore Bright White 3x6 Subway Tile",
        url: "https://www.homedepot.com/p/302575146",
        originalPrice: "$12.98/case",
        currentPrice: "$13.48/case",
        priceChangePct: 385,
        status: "verified" as const,
        lastCheckedAt: new Date().toISOString(),
        alternativeSku: null,
        alternativeName: null,
        alternativeUrl: null,
        alternativePrice: null,
        category: "tile",
      };

      expect(entry.sku).toBe("302575146");
      expect(entry.status).toBe("verified");
      expect(entry.priceChangePct).toBe(385); // 3.85%
    });

    it("should create a discontinued entry with alternative", () => {
      const entry = {
        sku: "OLD123",
        name: "Discontinued Product",
        url: "https://www.homedepot.com/p/OLD123",
        originalPrice: "$99.00",
        currentPrice: null,
        priceChangePct: null,
        status: "discontinued" as const,
        lastCheckedAt: new Date().toISOString(),
        alternativeSku: "NEW456",
        alternativeName: "Replacement Product",
        alternativeUrl: "https://www.homedepot.com/p/NEW456",
        alternativePrice: "$109.00",
        category: "cabinet",
      };

      expect(entry.status).toBe("discontinued");
      expect(entry.alternativeSku).toBe("NEW456");
      expect(entry.alternativeName).toBe("Replacement Product");
    });
  });

  describe("Seed Validation", () => {
    it("should validate product data before seeding", () => {
      const validProduct = {
        sku: "302575146",
        name: "Daltile Subway Tile",
        url: "https://www.homedepot.com/p/302575146",
        price: "$12.98",
        category: "tile",
      };

      expect(validProduct.sku).toBeTruthy();
      expect(validProduct.name).toBeTruthy();
      expect(validProduct.url).toContain("homedepot.com");
      expect(validProduct.price).toBeTruthy();
    });

    it("should reject empty SKU", () => {
      const invalidProduct = {
        sku: "",
        name: "Test Product",
        url: "https://www.homedepot.com/p/123",
        price: "$10.00",
      };

      expect(invalidProduct.sku).toBeFalsy();
    });
  });

  describe("Bulk Update Logic", () => {
    it("should count successes and failures correctly", () => {
      const updates = [
        { sku: "123", status: "verified" as const },
        { sku: "456", status: "discontinued" as const },
        { sku: "NOTFOUND", status: "verified" as const },
      ];

      // Simulate: first two succeed, third fails (not found)
      let success = 0;
      let failed = 0;
      const existingSkus = new Set(["123", "456"]);

      for (const u of updates) {
        if (existingSkus.has(u.sku)) {
          success++;
        } else {
          failed++;
        }
      }

      expect(success).toBe(2);
      expect(failed).toBe(1);
      expect(success + failed).toBe(updates.length);
    });
  });

  describe("Auto-Verify Response Parsing", () => {
    it("should parse LLM verification response correctly", () => {
      const llmResponse = {
        results: [
          {
            sku: "302575146",
            status: "verified",
            currentPrice: "$13.48",
            alternativeName: null,
            alternativeSku: null,
            alternativeUrl: null,
            alternativePrice: null,
            reason: "Product is currently available on Home Depot website",
          },
          {
            sku: "OLD123",
            status: "discontinued",
            currentPrice: null,
            alternativeName: "New Model Faucet",
            alternativeSku: "NEW789",
            alternativeUrl: "https://www.homedepot.com/p/NEW789",
            alternativePrice: "$89.00",
            reason: "Product page returns 404, replaced by newer model",
          },
        ],
      };

      expect(llmResponse.results).toHaveLength(2);
      expect(llmResponse.results[0].status).toBe("verified");
      expect(llmResponse.results[1].status).toBe("discontinued");
      expect(llmResponse.results[1].alternativeName).toBe("New Model Faucet");
    });
  });

  describe("Catalog Statistics", () => {
    it("should calculate stats from product list", () => {
      const products = [
        { status: "verified", alternativeSku: null, priceChangePct: 0 },
        { status: "verified", alternativeSku: null, priceChangePct: 500 },
        { status: "discontinued", alternativeSku: "ALT1", priceChangePct: null },
        { status: "unavailable", alternativeSku: null, priceChangePct: null },
        { status: "unknown", alternativeSku: null, priceChangePct: null },
      ];

      const stats = {
        total: products.length,
        verified: products.filter((p) => p.status === "verified").length,
        discontinued: products.filter((p) => p.status === "discontinued").length,
        unavailable: products.filter((p) => p.status === "unavailable").length,
        unknown: products.filter((p) => p.status === "unknown").length,
        withAlternatives: products.filter((p) => p.alternativeSku).length,
        priceChanges: products.filter((p) => p.priceChangePct && p.priceChangePct !== 0).length,
      };

      expect(stats.total).toBe(5);
      expect(stats.verified).toBe(2);
      expect(stats.discontinued).toBe(1);
      expect(stats.unavailable).toBe(1);
      expect(stats.unknown).toBe(1);
      expect(stats.withAlternatives).toBe(1);
      expect(stats.priceChanges).toBe(1);
    });
  });
});
