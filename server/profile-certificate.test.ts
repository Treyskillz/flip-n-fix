import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => {
  // In-memory stores for testing
  const profileStore: Record<number, any> = {};
  const courseProgressStore: Record<number, string[]> = {};
  const quizResultsStore: Record<number, any[]> = {};
  const usersStore: Record<number, any> = {
    1: {
      id: 1,
      openId: "test-user-open-id",
      name: "Test User",
      email: "test@example.com",
      role: "user",
    },
  };

  // Create a mock drizzle-like query builder that returns arrays for all select chains
  const createMockDb = () => {
    const emptyArrayPromise = () => Promise.resolve([]);
    const chainable: any = new Proxy({}, {
      get() {
        return (..._args: any[]) => {
          // Return a thenable that resolves to [] but also has chainable methods
          const result: any = new Proxy(emptyArrayPromise(), {
            get(target: any, prop: string) {
              if (prop === 'then' || prop === 'catch' || prop === 'finally') {
                return target[prop].bind(target);
              }
              // Any further chained call returns the same chainable
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
        values: () => ({
          onDuplicateKeyUpdate: () => Promise.resolve([{ insertId: 1 }]),
        }),
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
    getUserByOpenId: vi.fn().mockResolvedValue(usersStore[1]),
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

describe("profile", () => {
  it("profile.get returns null for user with no profile", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.get();
    // With mock db returning empty array, result should be null
    expect(result).toBeNull();
  });

  it("profile.upsert accepts valid profile data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.upsert({
      fullName: "John Smith",
      companyName: "Smith Properties LLC",
      phone: "(555) 123-4567",
      email: "john@smithproperties.com",
      address: "123 Main St",
      city: "Tampa",
      state: "FL",
      zip: "33601",
      website: "www.smithproperties.com",
      licenseNumber: "RE-123456",
      marketArea: "Greater Tampa Bay",
      yearsExperience: "5",
    });

    expect(result).toEqual({ success: true });
  });

  it("profile.upsert accepts partial profile data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.upsert({
      fullName: "Jane Doe",
      companyName: "Doe Investments",
    });

    expect(result).toEqual({ success: true });
  });

  it("profile.upsert accepts empty profile data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.upsert({});

    expect(result).toEqual({ success: true });
  });

  it("profile.get requires authentication", async () => {
    const { ctx } = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.profile.get()).rejects.toThrow();
  });

  it("profile.upsert requires authentication", async () => {
    const { ctx } = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.profile.upsert({ fullName: "Test" })
    ).rejects.toThrow();
  });
});

describe("certificate", () => {
  it("certificate.eligibility returns data for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.certificate.eligibility();

    expect(result).toHaveProperty("completedLessonCount");
    expect(result).toHaveProperty("quizzesPassed");
    expect(result).toHaveProperty("bestQuizByModule");
    expect(result).toHaveProperty("userName");
    expect(result).toHaveProperty("companyName");
    expect(typeof result.completedLessonCount).toBe("number");
    expect(typeof result.quizzesPassed).toBe("number");
  });

  it("certificate.eligibility requires authentication", async () => {
    const { ctx } = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.certificate.eligibility()).rejects.toThrow();
  });
});
