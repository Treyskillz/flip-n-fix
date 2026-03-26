import { describe, it, expect } from "vitest";

describe("Resend Email Integration", () => {
  it("should have RESEND_API_KEY configured", () => {
    const key = process.env.RESEND_API_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    expect(key?.startsWith("re_")).toBe(true);
  });

  it("should validate Resend API key is functional", async () => {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("Skipping Resend API validation — no key configured");
      return;
    }

    // For restricted keys (send-only), test by checking the API responds
    // 401 with "restricted_api_key" means the key is valid but limited to sending
    // 403 means invalid key entirely
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
    });

    if (res.status === 401) {
      const body = await res.json();
      // "restricted_api_key" means the key is valid but only for sending — that's fine
      expect(body.name).toBe("restricted_api_key");
    } else {
      // Full access key — should return 200
      expect(res.status).toBe(200);
    }
  });

  it("should export email template functions with correct content", async () => {
    const { bibWelcomeEmail, oto1PurchaseEmail, oto2PurchaseEmail, orderSummaryEmail } = await import("./resend");
    
    const welcome = bibWelcomeEmail("Test User", "https://example.com");
    expect(welcome.subject).toContain("Welcome");
    expect(welcome.html).toContain("Test User");
    expect(welcome.html).toContain("Business-in-a-Box");
    expect(welcome.html).toContain("contact@freedomoneproperties.com");

    const oto1 = oto1PurchaseEmail("Test User", "https://example.com", true);
    expect(oto1.subject).toContain("Lifetime");
    expect(oto1.html).toContain("Deal Analyzer");

    const oto1Down = oto1PurchaseEmail("Test User", "https://example.com", false);
    expect(oto1Down.subject).toContain("1-Year");

    const oto2 = oto2PurchaseEmail("Test User", "https://example.com", true);
    expect(oto2.subject).toContain("Marketing Kit");
    expect(oto2.html).toContain("6 Facebook Ad Campaigns");

    const oto2Down = oto2PurchaseEmail("Test User", "https://example.com", false);
    expect(oto2Down.subject).toContain("Marketing Starter Pack");

    const summary = orderSummaryEmail("Test User", [{ name: "BIB", price: 199700 }], "https://example.com");
    expect(summary.subject).toContain("Order Confirmation");
    expect(summary.html).toContain("$1,997");
  });
});
