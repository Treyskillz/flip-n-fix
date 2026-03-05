import { describe, it, expect, vi } from "vitest";

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          title: "5 Tips for Analyzing Fix and Flip Deals",
          slug: "5-tips-analyzing-fix-flip-deals",
          excerpt: "Learn the essential steps to evaluate any fix and flip opportunity.",
          content: "# 5 Tips for Analyzing Fix and Flip Deals\n\nContent here...",
          tags: "fix-and-flip,deal-analysis,investing",
        }),
      },
    }],
  }),
}));

// Mock the database
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
  }),
}));

// Mock Facebook
vi.mock("./facebook", () => ({
  postToFacebook: vi.fn().mockResolvedValue({ success: false, error: "Not configured" }),
  isFacebookConfigured: vi.fn().mockReturnValue(false),
}));

describe("autoBlog", () => {
  it("autoGenerateAndPublishBlogPost generates and publishes a post", async () => {
    const { autoGenerateAndPublishBlogPost } = await import("./autoBlog");
    const result = await autoGenerateAndPublishBlogPost();

    expect(result.success).toBe(true);
    expect(result.title).toBe("5 Tips for Analyzing Fix and Flip Deals");
    expect(result.slug).toContain("5-tips-analyzing-fix-flip-deals");
    expect(result.facebookShared).toBe(false);
  });

  it("registerAutoBlogRoute creates an Express route", async () => {
    const { registerAutoBlogRoute } = await import("./autoBlog");
    const mockApp = {
      post: vi.fn(),
    } as any;

    registerAutoBlogRoute(mockApp);
    expect(mockApp.post).toHaveBeenCalledWith("/api/cron/auto-blog", expect.any(Function));
  });

  it("cron endpoint rejects unauthorized requests", async () => {
    const { registerAutoBlogRoute } = await import("./autoBlog");
    const handlers: Record<string, Function> = {};
    const mockApp = {
      post: vi.fn((path: string, handler: Function) => {
        handlers[path] = handler;
      }),
    } as any;

    registerAutoBlogRoute(mockApp);

    const mockReq = {
      headers: { authorization: "Bearer wrong-secret" },
    };
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    await handlers["/api/cron/auto-blog"](mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });
});
