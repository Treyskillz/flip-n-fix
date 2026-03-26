import { describe, it, expect } from 'vitest';

describe('Tracking Pixels Configuration', () => {
  it('should have VITE_FB_PIXEL_ID set as a numeric string', () => {
    const pixelId = process.env.VITE_FB_PIXEL_ID;
    expect(pixelId).toBeDefined();
    expect(pixelId).not.toBe('');
    // Facebook Pixel IDs are numeric strings
    expect(/^\d+$/.test(pixelId!)).toBe(true);
    // Typically 15-16 digits
    expect(pixelId!.length).toBeGreaterThanOrEqual(10);
  });
});
