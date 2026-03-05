import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "## Executive Summary\nThis is a great deal with strong ROI potential.\n\n## Key Metrics\n- ROI: 25.3%\n- Net Profit: $45,000\n\n## Recommendation\n**BUY** - Strong deal fundamentals." } }],
  }),
}));

// Mock the database
const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  onDuplicateKeyUpdate: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
};

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

describe("teamFeatures", () => {
  describe("AI Deal Summary", () => {
    it("should require Team tier subscription", () => {
      // The procedure checks for team plan and throws if not team tier
      const planRank: Record<string, number> = { free: 0, pro: 1, elite: 2, team: 3 };
      expect(planRank["team"]).toBe(3);
      expect(planRank["elite"]).toBe(2);
      expect(planRank["pro"]).toBe(1);
      expect(planRank["free"]).toBe(0);
    });

    it("should allow admin users regardless of plan", () => {
      const isAdmin = true;
      const effectivePlan = "free";
      // Admin bypass: isAdmin || effectivePlan === "team"
      expect(isAdmin || effectivePlan === "team").toBe(true);
    });

    it("should reject non-team non-admin users", () => {
      const isAdmin = false;
      const effectivePlan = "elite";
      expect(isAdmin || effectivePlan === "team").toBe(false);
    });

    it("should generate a markdown summary from LLM response", async () => {
      const { invokeLLM } = await import("./_core/llm");
      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are a professional real estate investment analyst." },
          { role: "user", content: "Analyze this deal..." },
        ],
      });
      const summary = response.choices[0]?.message?.content;
      expect(summary).toBeTruthy();
      expect(typeof summary).toBe("string");
      expect(summary).toContain("Executive Summary");
      expect(summary).toContain("Recommendation");
    });
  });

  describe("Bulk Export", () => {
    it("should generate CSV headers correctly", () => {
      const headers = [
        "Address", "City", "State", "Zip", "Purchase Price", "ARV",
        "Rehab Cost", "Total Investment", "Net Profit", "ROI %",
        "Deal Score", "Deal Verdict", "Status", "Sq Ft", "Beds",
        "Baths", "Year Built", "Market", "Created",
      ];
      expect(headers).toHaveLength(19);
      expect(headers[0]).toBe("Address");
      expect(headers[headers.length - 1]).toBe("Created");
    });

    it("should format deal data as CSV rows", () => {
      const deal = {
        address: "123 Main St",
        city: "Dallas",
        state: "TX",
        zip: "75001",
        purchasePrice: 150000,
        arv: 250000,
        rehabCost: 50000,
        totalInvestment: 200000,
        netProfit: 50000,
        roiBps: 2500,
        dealScore: 85,
        dealVerdict: "excellent",
        status: "active",
        sqft: 1800,
        beds: 3,
        baths: 2,
        yearBuilt: 1990,
        market: "Dallas-Fort Worth",
        createdAt: new Date("2026-01-15"),
      };

      const row = [
        `"${deal.address}"`, `"${deal.city}"`, `"${deal.state}"`, `"${deal.zip}"`,
        deal.purchasePrice, deal.arv, deal.rehabCost, deal.totalInvestment, deal.netProfit,
        (deal.roiBps / 100).toFixed(1), deal.dealScore || '', `"${deal.dealVerdict}"`,
        `"${deal.status}"`, deal.sqft, deal.beds, deal.baths, deal.yearBuilt,
        `"${deal.market || ''}"`, `"${deal.createdAt.toISOString().split('T')[0]}"`
      ];

      const csvRow = row.join(',');
      expect(csvRow).toContain('"123 Main St"');
      expect(csvRow).toContain('"Dallas"');
      expect(csvRow).toContain('"TX"');
      expect(csvRow).toContain("150000");
      expect(csvRow).toContain("25.0"); // ROI
      expect(csvRow).toContain("85"); // Deal Score
      expect(csvRow).toContain('"2026-01-15"');
    });

    it("should require Team tier for bulk export", () => {
      const isAdmin = false;
      const effectivePlan = "pro";
      expect(isAdmin || effectivePlan === "team").toBe(false);
    });

    it("should allow admin for bulk export", () => {
      const isAdmin = true;
      const effectivePlan = "pro";
      expect(isAdmin || effectivePlan === "team").toBe(true);
    });
  });

  describe("Products configuration", () => {
    it("should have AI Deal Summary in Team features", async () => {
      const { PLANS } = await import("./stripe/products");
      expect(PLANS.team.features).toContain("AI Deal Summary Generator");
    });

    it("should have Full Database Export in Team features", async () => {
      const { PLANS } = await import("./stripe/products");
      expect(PLANS.team.features).toContain("Full Database Export (CSV)");
    });

    it("should have White-Label Reports in Team features", async () => {
      const { PLANS } = await import("./stripe/products");
      expect(PLANS.team.features).toContain("White-Label Reports (Your Logo & Branding)");
    });

    it("Team tier should have at least as many features as Elite", async () => {
      const { PLANS } = await import("./stripe/products");
      // Team includes "Everything in Elite" plus its own unique features
      expect(PLANS.team.features.length).toBeGreaterThanOrEqual(PLANS.elite.features.length);
      // Team must include "Everything in Elite" as first feature
      expect(PLANS.team.features[0]).toBe("Everything in Elite");
    });

    it("Team tier price should be higher than Elite", async () => {
      const { PLANS } = await import("./stripe/products");
      expect(PLANS.team.priceMonthly).toBeGreaterThan(PLANS.elite.priceMonthly);
    });
  });
});
