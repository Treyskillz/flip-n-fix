import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We test the facebook module's exported functions
// Since they depend on env vars and fetch, we mock those

describe("Facebook Integration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("isFacebookConfigured", () => {
    it("returns false when no env vars set", async () => {
      delete process.env.FACEBOOK_PAGE_ID;
      delete process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
      // Re-import to get fresh module
      const mod = await import("./facebook");
      expect(mod.isFacebookConfigured()).toBe(false);
    });

    it("returns false when only PAGE_ID is set", async () => {
      process.env.FACEBOOK_PAGE_ID = "123456";
      delete process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
      const mod = await import("./facebook");
      expect(mod.isFacebookConfigured()).toBe(false);
    });
  });

  describe("buildFacebookShareUrl", () => {
    it("generates a valid share URL", async () => {
      const mod = await import("./facebook");
      const url = mod.buildFacebookShareUrl("https://example.com/blog/test-post");
      expect(url).toContain("https://www.facebook.com/sharer/sharer.php");
      expect(url).toContain("example.com");
    });

    it("includes quote parameter when provided", async () => {
      const mod = await import("./facebook");
      const url = mod.buildFacebookShareUrl("https://example.com/blog/test", "Check this out!");
      expect(url).toContain("quote=Check");
    });
  });

  describe("postToFacebook", () => {
    it("returns not_configured when credentials are missing", async () => {
      delete process.env.FACEBOOK_PAGE_ID;
      delete process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
      const mod = await import("./facebook");
      const result = await mod.postToFacebook("Hello world");
      expect(result.success).toBe(false);
      expect(result.status).toBe("not_configured");
      expect(result.error).toContain("not configured");
    });
  });

  describe("verifyFacebookConnection", () => {
    it("returns not connected when credentials are missing", async () => {
      delete process.env.FACEBOOK_PAGE_ID;
      delete process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
      const mod = await import("./facebook");
      const result = await mod.verifyFacebookConnection();
      expect(result.connected).toBe(false);
      expect(result.error).toContain("not configured");
    });
  });

  describe("postPhotoToFacebook", () => {
    it("returns not_configured when credentials are missing", async () => {
      delete process.env.FACEBOOK_PAGE_ID;
      delete process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
      const mod = await import("./facebook");
      const result = await mod.postPhotoToFacebook("Hello", "https://example.com/img.jpg");
      expect(result.success).toBe(false);
      expect(result.status).toBe("not_configured");
    });
  });
});
