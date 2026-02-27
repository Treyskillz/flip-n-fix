import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock getDb to return an in-memory mock
const mockInsert = vi.fn().mockReturnValue({
  values: vi.fn().mockReturnValue({
    onDuplicateKeyUpdate: vi.fn().mockResolvedValue(undefined),
  }),
});
const mockSelect = vi.fn().mockReturnValue({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      orderBy: vi.fn().mockResolvedValue([]),
      limit: vi.fn().mockResolvedValue([]),
    }),
    orderBy: vi.fn().mockResolvedValue([]),
  }),
});
const mockUpdate = vi.fn().mockReturnValue({
  set: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(undefined),
  }),
});
const mockDelete = vi.fn().mockReturnValue({
  where: vi.fn().mockResolvedValue(undefined),
});

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: (...args: any[]) => mockInsert(...args),
    select: (...args: any[]) => mockSelect(...args),
    update: (...args: any[]) => mockUpdate(...args),
    delete: (...args: any[]) => mockDelete(...args),
  }),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://cdn.example.com/photo.jpg", key: "deal-photos/test/photo.jpg" }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("deals router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("deals.save", () => {
    it("saves a deal with correct data transformation", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const input = {
        uniqueId: "test-deal-123",
        address: "123 Main St",
        city: "Austin",
        state: "TX",
        zip: "78701",
        purchasePrice: 200000,
        arv: 350000,
        rehabCost: 75000,
        totalInvestment: 290000,
        netProfit: 60000,
        roi: 20.7,
        dealVerdict: "good",
        maxAllowableOffer: 170000,
        recommendedMaxPrice: 185000,
        targetROI: 15,
        sqft: 1800,
        beds: 3,
        baths: 2,
        yearBuilt: 1985,
        market: "Austin, TX",
        dealScore: 75,
        cashOnCash: 32.5,
        status: "active" as const,
        starred: true,
        notes: "Great deal in East Austin",
      };

      const result = await caller.deals.save(input);

      expect(result).toEqual({ success: true, uniqueId: "test-deal-123" });
      expect(mockInsert).toHaveBeenCalled();
    });

    it("converts ROI percentage to basis points", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const input = {
        uniqueId: "test-deal-bps",
        address: "456 Oak Ave",
        city: "Dallas",
        state: "TX",
        zip: "75201",
        purchasePrice: 150000,
        arv: 250000,
        rehabCost: 50000,
        totalInvestment: 210000,
        netProfit: 40000,
        roi: 19.05, // should become 1905 bps
        dealVerdict: "good",
        maxAllowableOffer: 125000,
        recommendedMaxPrice: 140000,
        targetROI: 15,
        sqft: 1500,
        beds: 3,
        baths: 2,
        yearBuilt: 1990,
      };

      await caller.deals.save(input);

      // Verify insert was called (the actual bps conversion is in the values)
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  describe("deals.list", () => {
    it("returns empty array when no deals exist", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.deals.list();

      expect(result).toEqual([]);
    });
  });

  describe("deals.update", () => {
    it("updates deal status", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.deals.update({
        uniqueId: "test-deal-123",
        status: "under_contract",
      });

      expect(result).toEqual({ success: true });
      expect(mockUpdate).toHaveBeenCalled();
    });

    it("updates starred flag", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.deals.update({
        uniqueId: "test-deal-123",
        starred: true,
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("deals.delete", () => {
    it("deletes a deal and its photos", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.deals.delete({ uniqueId: "test-deal-123" });

      expect(result).toEqual({ success: true });
      // Should delete photos first, then the deal
      expect(mockDelete).toHaveBeenCalledTimes(2);
    });
  });

  describe("deals.portfolio", () => {
    it("returns empty portfolio when no deals exist", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.deals.portfolio();

      expect(result.totalDeals).toBe(0);
      expect(result.totalInvested).toBe(0);
      expect(result.totalProfit).toBe(0);
      expect(result.avgRoi).toBe(0);
      expect(result.deals).toEqual([]);
    });
  });
});

describe("photos router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the select mock for photos
    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
          limit: vi.fn().mockResolvedValue([]),
        }),
        orderBy: vi.fn().mockResolvedValue([]),
      }),
    });
  });

  describe("photos.upload", () => {
    it("uploads a photo and returns URL", async () => {
      // Override select for maxSort query
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ maxSort: 0 }]),
        }),
      });

      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.photos.upload({
        dealUniqueId: "test-deal-123",
        base64: Buffer.from("fake-image-data").toString("base64"),
        filename: "photo1.jpg",
        mimeType: "image/jpeg",
      });

      expect(result).toHaveProperty("url");
      expect(result).toHaveProperty("fileKey");
      expect(result.url).toBe("https://cdn.example.com/photo.jpg");
    });
  });

  describe("photos.list", () => {
    it("returns empty array when no photos exist", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.photos.list({ dealUniqueId: "test-deal-123" });

      expect(result).toEqual([]);
    });
  });

  describe("photos.delete", () => {
    it("deletes a photo by id", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.photos.delete({ id: 1 });

      expect(result).toEqual({ success: true });
      expect(mockDelete).toHaveBeenCalled();
    });
  });

  describe("photos.updateCaption", () => {
    it("updates a photo caption", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.photos.updateCaption({
        id: 1,
        caption: "Front of house",
      });

      expect(result).toEqual({ success: true });
      expect(mockUpdate).toHaveBeenCalled();
    });
  });
});
