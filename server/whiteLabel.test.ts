import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "test-key", url: "https://example.com/logo.png" }),
}));

// Mock facebook
vi.mock("./facebook", () => ({
  postToFacebook: vi.fn(),
  postPhotoToFacebook: vi.fn(),
  verifyFacebookConnection: vi.fn(),
  isFacebookConfigured: vi.fn().mockReturnValue(false),
  buildFacebookShareUrl: vi.fn(),
}));

import { getDb } from "./db";

describe("White-Label Settings", () => {
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getDb as any).mockResolvedValue(mockDb);
  });

  it("should have white_label_settings table in schema", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.whiteLabelSettings).toBeDefined();
  });

  it("should have required columns in white_label_settings", async () => {
    const schema = await import("../drizzle/schema");
    const table = schema.whiteLabelSettings;
    // Check that the table exists and has the expected structure
    expect(table).toBeDefined();
    // The table should be a mysqlTable with expected column names
    const columnNames = Object.keys(table);
    expect(columnNames).toContain("companyName");
    expect(columnNames).toContain("logoUrl");
    expect(columnNames).toContain("brandColor");
    expect(columnNames).toContain("phone");
    expect(columnNames).toContain("email");
    expect(columnNames).toContain("enabled");
    expect(columnNames).toContain("userId");
  });

  it("should have Team tier plan defined in products", async () => {
    const { PLANS } = await import("./stripe/products");
    expect(PLANS.team).toBeDefined();
    expect(PLANS.team.name).toBe("Team");
    // Team features should include white-label
    const hasWhiteLabel = PLANS.team.features.some(f => f.toLowerCase().includes("white-label"));
    expect(hasWhiteLabel).toBe(true);
  }, 15000);

  it("should have white-label features in Team plan only", async () => {
    const { PLANS } = await import("./stripe/products");
    // Free, Pro, Elite should NOT have white-label
    const freeFeat = PLANS.free.features.join(" ").toLowerCase();
    const proFeat = PLANS.pro.features.join(" ").toLowerCase();
    const eliteFeat = PLANS.elite.features.join(" ").toLowerCase();
    expect(freeFeat).not.toContain("white-label");
    expect(proFeat).not.toContain("white-label");
    expect(eliteFeat).not.toContain("white-label");
  });

  it("should have correct pricing for all tiers", async () => {
    const { PLANS } = await import("./stripe/products");
    expect(PLANS.free.priceMonthly).toBe(0);
    expect(PLANS.pro.priceMonthly).toBe(9900); // $99
    expect(PLANS.elite.priceMonthly).toBe(19900); // $199
    expect(PLANS.team.priceMonthly).toBe(34900); // $349
  });

  it("should have email investor reports in Elite tier", async () => {
    const { PLANS } = await import("./stripe/products");
    const eliteFeatures = PLANS.elite.features.join(" ").toLowerCase();
    expect(eliteFeatures).toContain("email");
    expect(eliteFeatures).toContain("investor");
  });

  it("should have Gantt chart export in Elite tier", async () => {
    const { PLANS } = await import("./stripe/products");
    const eliteFeatures = PLANS.elite.features.join(" ").toLowerCase();
    expect(eliteFeatures).toContain("gantt");
    expect(eliteFeatures).toContain("export");
  });

  it("should have Profit Calculator in Elite tier", async () => {
    const { PLANS } = await import("./stripe/products");
    const eliteFeatures = PLANS.elite.features.join(" ").toLowerCase();
    expect(eliteFeatures).toContain("profit calculator");
  });
});
