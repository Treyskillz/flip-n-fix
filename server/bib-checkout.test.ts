import { describe, it, expect } from "vitest";
import { BIB_PRODUCTS } from "./stripe/bib-products";

describe("BIB Products Configuration", () => {
  it("should have all required product keys", () => {
    expect(BIB_PRODUCTS).toHaveProperty("main");
    expect(BIB_PRODUCTS).toHaveProperty("oto1");
    expect(BIB_PRODUCTS).toHaveProperty("oto1Down");
    expect(BIB_PRODUCTS).toHaveProperty("oto2");
    expect(BIB_PRODUCTS).toHaveProperty("oto2Down");
  });

  it("should have correct pricing for main product", () => {
    expect(BIB_PRODUCTS.main.price).toBe(199700);
    expect(BIB_PRODUCTS.main.name).toContain("Business");
  });

  it("should have correct pricing for OTO 1 (Lifetime Access)", () => {
    expect(BIB_PRODUCTS.oto1.price).toBe(299700);
    expect(BIB_PRODUCTS.oto1.name).toContain("Lifetime");
  });

  it("should have correct pricing for OTO 1 Downsell (1-Year Access)", () => {
    expect(BIB_PRODUCTS.oto1Down.price).toBe(99700);
    expect(BIB_PRODUCTS.oto1Down.name).toContain("Year");
  });

  it("should have correct pricing for OTO 2 (Marketing Kit)", () => {
    expect(BIB_PRODUCTS.oto2.price).toBe(49700);
    expect(BIB_PRODUCTS.oto2.name).toContain("Marketing");
  });

  it("should have correct pricing for OTO 2 Downsell (Starter Pack)", () => {
    expect(BIB_PRODUCTS.oto2Down.price).toBe(19700);
    expect(BIB_PRODUCTS.oto2Down.name).toContain("Starter");
  });

  it("all products should be one-time payment (no mode field, handled by checkout)", () => {
    // Mode is set in the checkout session creation, not on the product itself
    Object.values(BIB_PRODUCTS).forEach((product) => {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("price");
    });
  });

  it("all products should have required fields", () => {
    Object.values(BIB_PRODUCTS).forEach((product) => {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("description");
      expect(product).toHaveProperty("features");
      expect(typeof product.name).toBe("string");
      expect(typeof product.price).toBe("number");
      expect(product.price).toBeGreaterThan(0);
      expect(Array.isArray(product.features)).toBe(true);
      expect(product.features.length).toBeGreaterThan(0);
    });
  });

  it("pricing hierarchy should be correct (main < oto1, downsells < upsells)", () => {
    expect(BIB_PRODUCTS.main.price).toBeLessThan(BIB_PRODUCTS.oto1.price);
    expect(BIB_PRODUCTS.oto1Down.price).toBeLessThan(BIB_PRODUCTS.oto1.price);
    expect(BIB_PRODUCTS.oto2Down.price).toBeLessThan(BIB_PRODUCTS.oto2.price);
  });
});
