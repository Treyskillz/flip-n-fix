import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => {
  const createMockDb = () => {
    const emptyArrayPromise = () => Promise.resolve([]);
    const chainable: any = new Proxy({}, {
      get() {
        return (..._args: any[]) => {
          const result: any = new Proxy(emptyArrayPromise(), {
            get(target: any, prop: string) {
              if (prop === 'then' || prop === 'catch' || prop === 'finally') {
                return target[prop].bind(target);
              }
              return (..._a: any[]) => result;
            },
          });
          return result;
        };
      },
    });

    return {
      select: (..._args: any[]) => chainable,
      insert: () => ({
        values: (..._args: any[]) => {
          const insertResult = Promise.resolve([{ insertId: 1 }]);
          // Also make it chainable for .onDuplicateKeyUpdate
          (insertResult as any).onDuplicateKeyUpdate = () => Promise.resolve([{ insertId: 1 }]);
          return insertResult;
        },
      }),
      update: () => ({
        set: () => ({
          where: () => Promise.resolve(),
        }),
      }),
      delete: () => ({
        where: () => Promise.resolve(),
      }),
    };
  };

  return {
    getDb: vi.fn().mockResolvedValue(createMockDb()),
    upsertUser: vi.fn().mockResolvedValue(undefined),
    getUserByOpenId: vi.fn().mockResolvedValue({
      id: 1,
      openId: "test-user-open-id",
      name: "Test User",
      email: "test@example.com",
      role: "user",
    }),
  };
});

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "test-user-open-id",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return { ctx };
}

function createUnauthContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return { ctx };
}

const caller = appRouter.createCaller;

describe("Pipeline CRM Router", () => {
  describe("pipeline.listDeals", () => {
    it("should return an array for authenticated users", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.listDeals();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should throw for unauthenticated users", async () => {
      const { ctx } = createUnauthContext();
      await expect(caller(ctx).pipeline.listDeals()).rejects.toThrow();
    });
  });

  describe("pipeline.createDeal", () => {
    it("should create a deal with required fields", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.createDeal({
        propertyAddress: "123 Main St",
        stage: "lead",
      });
      expect(result).toBeDefined();
    });

    it("should create a deal with all optional fields", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.createDeal({
        propertyAddress: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zip: "90210",
        stage: "analyzing",
        purchasePrice: 250000,
        arv: 350000,
        rehabCost: 50000,
        estimatedProfit: 40000,
        tags: '["flip","wholesale"]',
        notes: "Great deal opportunity",
      });
      expect(result).toBeDefined();
    });

    it("should reject empty property address", async () => {
      const { ctx } = createAuthContext();
      await expect(
        caller(ctx).pipeline.createDeal({
          propertyAddress: "",
          stage: "lead",
        })
      ).rejects.toThrow();
    });
  });

  describe("pipeline.moveStage", () => {
    it("should accept valid stage transitions", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.moveStage({
        id: 1,
        stage: "under_contract",
      });
      expect(result).toBeDefined();
    });
  });

  describe("pipeline.updateDeal", () => {
    it("should update deal fields", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.updateDeal({
        id: 1,
        propertyAddress: "789 Updated St",
        stage: "rehab",
        purchasePrice: 300000,
      });
      expect(result).toBeDefined();
    });
  });

  describe("pipeline.deleteDeal", () => {
    it("should delete a deal", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.deleteDeal({ id: 1 });
      expect(result).toEqual({ success: true });
    });
  });

  describe("pipeline.createContact", () => {
    it("should create a contact with required fields", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.createContact({
        dealId: 1,
        name: "John Seller",
        role: "seller",
      });
      expect(result).toBeDefined();
    });

    it("should create a contact with all fields", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.createContact({
        dealId: 1,
        name: "Jane Agent",
        role: "listing_agent",
        phone: "(555) 123-4567",
        email: "jane@realty.com",
        company: "ABC Realty",
        notes: "Very responsive",
      });
      expect(result).toBeDefined();
    });
  });

  describe("pipeline.listContacts", () => {
    it("should return contacts for a deal", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.listContacts({ dealId: 1 });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("pipeline.deleteContact", () => {
    it("should delete a contact", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.deleteContact({ id: 1 });
      expect(result).toEqual({ success: true });
    });
  });

  describe("pipeline.addActivity", () => {
    it("should add a note activity", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.addActivity({
        dealId: 1,
        type: "note",
        title: "Seller countered at $185K",
        description: "They want $185K, we offered $170K",
      });
      expect(result).toBeDefined();
    });

    it("should add a document_sent activity", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.addActivity({
        dealId: 1,
        type: "document_sent",
        title: "Purchase Agreement sent to John Smith",
        description: "Sent via email",
        metadata: JSON.stringify({ templateId: "purchase-agreement" }),
      });
      expect(result).toBeDefined();
    });
  });

  describe("pipeline.listActivities", () => {
    it("should return activities for a deal", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.listActivities({ dealId: 1 });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("pipeline.metrics", () => {
    it("should return metrics for authenticated user", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.metrics();
      expect(result).toBeDefined();
      expect(typeof result.totalActive).toBe("number");
      expect(typeof result.totalClosed).toBe("number");
      expect(typeof result.winRate).toBe("number");
    });
  });

  describe("pipeline.bulkImport", () => {
    it("should import multiple deals from CSV data", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.bulkImport({
        deals: [
          { propertyAddress: "123 Main St", city: "Dallas", state: "TX", zip: "75201", stage: "lead" },
          { propertyAddress: "456 Oak Ave", city: "Houston", state: "TX", purchasePrice: 180000, arv: 280000 },
          { propertyAddress: "789 Elm Dr", stage: "analyzing", tags: '["flip"]', notes: "Owner motivated" },
        ],
      });
      expect(result).toBeDefined();
      expect(result.imported).toBe(3);
      expect(result.skipped).toBe(0);
      expect(result.total).toBe(3);
      expect(result.errors).toHaveLength(0);
    });

    it("should import a single deal with minimal fields", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.bulkImport({
        deals: [
          { propertyAddress: "100 Simple St" },
        ],
      });
      expect(result.imported).toBe(1);
      expect(result.total).toBe(1);
    });

    it("should reject empty deals array", async () => {
      const { ctx } = createAuthContext();
      await expect(
        caller(ctx).pipeline.bulkImport({ deals: [] })
      ).rejects.toThrow();
    });

    it("should reject deals without property address", async () => {
      const { ctx } = createAuthContext();
      await expect(
        caller(ctx).pipeline.bulkImport({
          deals: [{ propertyAddress: "" }],
        })
      ).rejects.toThrow();
    });

    it("should reject invalid stage values", async () => {
      const { ctx } = createAuthContext();
      await expect(
        caller(ctx).pipeline.bulkImport({
          deals: [{ propertyAddress: "123 Main St", stage: "invalid_stage" as any }],
        })
      ).rejects.toThrow();
    });

    it("should throw for unauthenticated users", async () => {
      const { ctx } = createUnauthContext();
      await expect(
        caller(ctx).pipeline.bulkImport({
          deals: [{ propertyAddress: "123 Main St" }],
        })
      ).rejects.toThrow();
    });

    it("should handle deals with all optional fields", async () => {
      const { ctx } = createAuthContext();
      const result = await caller(ctx).pipeline.bulkImport({
        deals: [{
          propertyAddress: "999 Full St",
          city: "Austin",
          state: "TX",
          zip: "78701",
          stage: "under_contract",
          purchasePrice: 200000,
          arv: 310000,
          rehabCost: 60000,
          estimatedProfit: 40000,
          tags: '["BRRRR","flip"]',
          notes: "Great neighborhood, motivated seller",
        }],
      });
      expect(result.imported).toBe(1);
      expect(result.skipped).toBe(0);
    });
  });
});
