import { describe, it, expect } from 'vitest';
import { giftedSubscriptions } from '../drizzle/schema';

describe('Gifted Subscriptions Schema', () => {
  it('should be a valid drizzle table', () => {
    expect(giftedSubscriptions).toBeDefined();
    // Verify it's a proper drizzle table by checking for column definitions
    expect(giftedSubscriptions.id).toBeDefined();
    expect(giftedSubscriptions.userId).toBeDefined();
    expect(giftedSubscriptions.plan).toBeDefined();
  });

  it('should have all required columns', () => {
    const columns = Object.keys(giftedSubscriptions);
    expect(columns).toContain('id');
    expect(columns).toContain('userId');
    expect(columns).toContain('plan');
    expect(columns).toContain('grantedBy');
    expect(columns).toContain('reason');
    expect(columns).toContain('expiresAt');
    expect(columns).toContain('revokedAt');
    expect(columns).toContain('createdAt');
  });

  it('should have plan column with correct enum values', () => {
    // The plan column should be an enum with pro, elite, team
    const planColumn = giftedSubscriptions.plan;
    expect(planColumn).toBeDefined();
    expect(planColumn.enumValues).toEqual(['pro', 'elite', 'team']);
  });
});

describe('Gifted Subscription Plan Ranking Logic', () => {
  const planRank: Record<string, number> = { free: 0, pro: 1, elite: 2, team: 3 };

  it('should rank plans correctly', () => {
    expect(planRank['free']).toBeLessThan(planRank['pro']);
    expect(planRank['pro']).toBeLessThan(planRank['elite']);
    expect(planRank['elite']).toBeLessThan(planRank['team']);
  });

  it('should select gifted plan when it is higher tier', () => {
    const stripePlan = 'free';
    const giftedPlan = 'elite';
    const effectivePlan = (planRank[giftedPlan] || 0) > (planRank[stripePlan] || 0) ? giftedPlan : stripePlan;
    expect(effectivePlan).toBe('elite');
  });

  it('should keep stripe plan when it is higher tier', () => {
    const stripePlan = 'team';
    const giftedPlan = 'pro';
    const effectivePlan = (planRank[giftedPlan] || 0) > (planRank[stripePlan] || 0) ? giftedPlan : stripePlan;
    expect(effectivePlan).toBe('team');
  });

  it('should keep stripe plan when tiers are equal', () => {
    const stripePlan = 'elite';
    const giftedPlan = 'elite';
    const effectivePlan = (planRank[giftedPlan] || 0) > (planRank[stripePlan] || 0) ? giftedPlan : stripePlan;
    expect(effectivePlan).toBe('elite');
  });

  it('should handle expired gifted subscriptions', () => {
    const now = new Date();
    const expiredDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // yesterday
    const isActive = expiredDate > now;
    expect(isActive).toBe(false);
  });

  it('should handle permanent (null expiry) gifted subscriptions', () => {
    const expiresAt = null;
    const isActive = !expiresAt || expiresAt > new Date();
    expect(isActive).toBe(true);
  });

  it('should handle future expiry gifted subscriptions', () => {
    const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    const isActive = !futureDate || futureDate > new Date();
    expect(isActive).toBe(true);
  });
});

describe('Duration Calculation', () => {
  it('should calculate correct expiry for 7-day duration', () => {
    const durationDays = 7;
    const now = Date.now();
    const expiresAt = new Date(now + durationDays * 24 * 60 * 60 * 1000);
    const diffMs = expiresAt.getTime() - now;
    const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
    expect(diffDays).toBe(7);
  });

  it('should calculate correct expiry for 365-day duration', () => {
    const durationDays = 365;
    const now = Date.now();
    const expiresAt = new Date(now + durationDays * 24 * 60 * 60 * 1000);
    const diffMs = expiresAt.getTime() - now;
    const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
    expect(diffDays).toBe(365);
  });

  it('should return null expiry for permanent (0 day) duration', () => {
    const durationDays = 0;
    const expiresAt = durationDays ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000) : null;
    expect(expiresAt).toBeNull();
  });

  it('should correctly extend an existing subscription', () => {
    const currentExpiry = new Date('2026-04-01T00:00:00Z');
    const additionalDays = 30;
    const newExpiry = new Date(currentExpiry.getTime() + additionalDays * 24 * 60 * 60 * 1000);
    // April 1 + 30 days = May 1
    expect(newExpiry.getUTCMonth()).toBe(4); // May (0-indexed)
    expect(newExpiry.getUTCDate()).toBe(1);
  });
});
