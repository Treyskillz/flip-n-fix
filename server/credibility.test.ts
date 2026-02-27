import { describe, expect, it, vi } from "vitest";
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
        values: () => {
          const insertResult = Promise.resolve([{ insertId: 1 }]);
          // Make it also chainable for onDuplicateKeyUpdate
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
      id: 1, openId: "test-open-id", name: "Test User", email: "test@example.com", role: "user",
    }),
  };
});

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://example.com/file.png", key: "test-key" }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "test-open-id",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    ctx: {
      user,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
    },
  };
}

function createUnauthContext(): { ctx: TrpcContext } {
  return {
    ctx: {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
    },
  };
}

describe("credibility", () => {
  it("credibility.listProjects returns empty array for new user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.credibility.listProjects();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it("credibility.createProject accepts valid project data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.credibility.createProject({
      projectName: "123 Main St Flip",
      address: "123 Main St",
      city: "Tampa",
      state: "FL",
      purchasePrice: 150000,
      rehabCost: 45000,
      salePrice: 265000,
      profit: 35000,
      purchaseDate: "01/2025",
      saleDate: "06/2025",
      daysToComplete: 120,
      description: "Full gut renovation with new kitchen, baths, roof, and HVAC.",
    });
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("sortOrder");
  });

  it("credibility.createProject accepts minimal data (only projectName)", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.credibility.createProject({
      projectName: "Quick Flip",
    });
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("sortOrder");
  });

  it("credibility.createProject requires projectName", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.credibility.createProject({ projectName: "" })
    ).rejects.toThrow();
  });

  it("credibility.updateProject accepts valid update", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.credibility.updateProject({
      id: 1,
      projectName: "Updated Project Name",
      profit: 50000,
    });
    expect(result).toEqual({ success: true });
  });

  it("credibility.deleteProject deletes by id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.credibility.deleteProject({ id: 1 });
    expect(result).toEqual({ success: true });
  });

  it("credibility.listAttachments returns empty array", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.credibility.listAttachments({ projectId: 1 });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it("credibility.uploadAttachment accepts valid upload data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    // Create a small base64 encoded 1x1 pixel PNG
    const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const result = await caller.credibility.uploadAttachment({
      projectId: 1,
      type: "before_photo",
      base64,
      filename: "before.png",
      mimeType: "image/png",
    });
    expect(result).toHaveProperty("url");
    expect(result).toHaveProperty("fileKey");
  });

  it("credibility.uploadAttachment validates type enum", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.credibility.uploadAttachment({
        projectId: 1,
        type: "invalid_type" as any,
        base64: "abc",
        filename: "test.png",
        mimeType: "image/png",
      })
    ).rejects.toThrow();
  });

  it("credibility.deleteAttachment deletes by id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.credibility.deleteAttachment({ id: 1 });
    expect(result).toEqual({ success: true });
  });

  it("credibility.listProjects requires authentication", async () => {
    const { ctx } = createUnauthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.credibility.listProjects()).rejects.toThrow();
  });

  it("credibility.createProject requires authentication", async () => {
    const { ctx } = createUnauthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.credibility.createProject({ projectName: "Test" })
    ).rejects.toThrow();
  });
});
