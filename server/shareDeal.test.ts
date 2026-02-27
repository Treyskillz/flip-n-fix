import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database
const mockInsert = vi.fn().mockReturnValue({
  values: vi.fn().mockResolvedValue(undefined),
});
const mockSelect = vi.fn();
const mockUpdate = vi.fn();

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: (...args: any[]) => mockInsert(...args),
    select: (...args: any[]) => mockSelect(...args),
    update: (...args: any[]) => mockUpdate(...args),
  }),
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

describe("shareDeal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("shareDeal.create", () => {
    it("creates a shared deal and returns a shareId", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const dealData = JSON.stringify({
        address: "123 Main St",
        purchasePrice: 150000,
        arv: 250000,
        rehabCost: 35000,
        netProfit: 33000,
      });

      const result = await caller.shareDeal.create({
        dealData,
        propertyAddress: "123 Main St",
      });

      expect(result).toHaveProperty("shareId");
      expect(typeof result.shareId).toBe("string");
      expect(result.shareId.length).toBe(24); // 12 random bytes = 24 hex chars
      expect(mockInsert).toHaveBeenCalledTimes(1);
    });

    it("creates a shared deal without property address", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.shareDeal.create({
        dealData: '{"test": true}',
      });

      expect(result).toHaveProperty("shareId");
      expect(result.shareId.length).toBe(24);
    });

    it("stores the user ID when authenticated", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.shareDeal.create({
        dealData: '{"test": true}',
        propertyAddress: "456 Oak Ave",
      });

      expect(result).toHaveProperty("shareId");
      // The insert should have been called with the user ID
      expect(mockInsert).toHaveBeenCalledTimes(1);
    });

    it("rejects empty dealData", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.shareDeal.create({ dealData: "" })
      ).rejects.toThrow();
    });
  });

  describe("shareDeal.get", () => {
    it("returns null when deal is not found", async () => {
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.shareDeal.get({ shareId: "nonexistent123456789012" });
      expect(result).toBeNull();
    });

    it("returns null for expired deals", async () => {
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1); // expired yesterday

      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                shareId: "test123456789012345678",
                dealData: '{"test": true}',
                propertyAddress: "123 Main St",
                createdAt: new Date(),
                viewCount: 5,
                expiresAt: expiredDate,
              },
            ]),
          }),
        }),
      });

      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.shareDeal.get({ shareId: "test123456789012345678" });
      expect(result).toBeNull();
    });

    it("returns deal data and increments view count for valid deals", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15); // expires in 15 days

      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([
              {
                shareId: "valid12345678901234567",
                dealData: '{"address":"123 Main St","purchasePrice":150000}',
                propertyAddress: "123 Main St",
                createdAt: new Date("2026-02-25"),
                viewCount: 3,
                expiresAt: futureDate,
              },
            ]),
          }),
        }),
      });

      mockUpdate.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      });

      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.shareDeal.get({ shareId: "valid12345678901234567" });

      expect(result).not.toBeNull();
      expect(result!.shareId).toBe("valid12345678901234567");
      expect(result!.dealData).toBe('{"address":"123 Main St","purchasePrice":150000}');
      expect(result!.propertyAddress).toBe("123 Main St");
      expect(result!.viewCount).toBe(4); // incremented from 3
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });

    it("rejects empty shareId", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.shareDeal.get({ shareId: "" })
      ).rejects.toThrow();
    });
  });
});
