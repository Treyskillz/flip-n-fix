import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  subscriptionPlan: mysqlEnum("subscriptionPlan", ["free", "pro", "elite", "team"]).default("free").notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Shared Deals ─────────────────────────────────────────
export const sharedDeals = mysqlTable("shared_deals", {
  id: int("id").autoincrement().primaryKey(),
  shareId: varchar("shareId", { length: 32 }).notNull().unique(),
  userId: int("userId"),
  propertyAddress: text("propertyAddress"),
  dealData: text("dealData").notNull(), // JSON blob of full deal analysis
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"), // optional expiration
  viewCount: int("viewCount").default(0).notNull(),
});

export type SharedDeal = typeof sharedDeals.$inferSelect;
export type InsertSharedDeal = typeof sharedDeals.$inferInsert;

// ─── Saved Deals (server-side) ──────────────────────────────
export const savedDeals = mysqlTable("saved_deals", {
  id: int("id").autoincrement().primaryKey(),
  uniqueId: varchar("uniqueId", { length: 64 }).notNull().unique(), // client-generated UUID
  userId: int("userId"),
  address: varchar("address", { length: 255 }).notNull(),
  city: varchar("city", { length: 128 }).notNull(),
  state: varchar("state", { length: 32 }).notNull(),
  zip: varchar("zip", { length: 16 }).notNull(),
  purchasePrice: int("purchasePrice").notNull(),
  arv: int("arv").notNull(),
  rehabCost: int("rehabCost").notNull(),
  totalInvestment: int("totalInvestment").notNull(),
  netProfit: int("netProfit").notNull(),
  roiBps: int("roiBps").notNull(), // stored as basis points (15.3% = 1530)
  dealVerdict: varchar("dealVerdict", { length: 32 }).notNull(),
  maxAllowableOffer: int("maxAllowableOffer").notNull(),
  recommendedMaxPrice: int("recommendedMaxPrice").notNull(),
  targetROI: int("targetROI").notNull(),
  sqft: int("sqft").notNull(),
  beds: int("beds").notNull(),
  baths: int("baths").notNull(),
  yearBuilt: int("yearBuilt").notNull(),
  market: varchar("market", { length: 128 }),
  dealScore: int("dealScore"),
  cashOnCashBps: int("cashOnCashBps"), // stored as basis points
  status: mysqlEnum("status", ["active", "under_contract", "closed", "passed", "archived"]).default("active").notNull(),
  starred: int("starred").default(0).notNull(), // 0 = false, 1 = true
  notes: text("notes"),
  dealData: text("dealData"), // Full JSON blob for sharing/export
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SavedDealRow = typeof savedDeals.$inferSelect;
export type InsertSavedDeal = typeof savedDeals.$inferInsert;

// ─── Deal Photos ────────────────────────────────────────────
export const dealPhotos = mysqlTable("deal_photos", {
  id: int("id").autoincrement().primaryKey(),
  dealUniqueId: varchar("dealUniqueId", { length: 64 }).notNull(), // references savedDeals.uniqueId
  userId: int("userId"),
  url: text("url").notNull(), // S3 URL
  fileKey: varchar("fileKey", { length: 512 }).notNull(), // S3 key
  filename: varchar("filename", { length: 255 }),
  mimeType: varchar("mimeType", { length: 64 }),
  caption: varchar("caption", { length: 255 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DealPhoto = typeof dealPhotos.$inferSelect;
export type InsertDealPhoto = typeof dealPhotos.$inferInsert;
