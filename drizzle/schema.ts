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

// ─── Course Progress ──────────────────────────────────────────
export const courseProgress = mysqlTable("course_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: varchar("lessonId", { length: 64 }).notNull(), // matches lesson id from course.ts
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type CourseProgressRow = typeof courseProgress.$inferSelect;
export type InsertCourseProgress = typeof courseProgress.$inferInsert;

// ─── Quiz Results ─────────────────────────────────────────────
export const quizResults = mysqlTable("quiz_results", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: varchar("moduleId", { length: 64 }).notNull(), // matches module id from course.ts
  score: int("score").notNull(), // number of correct answers
  totalQuestions: int("totalQuestions").notNull(),
  answers: text("answers").notNull(), // JSON string of user answers
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = typeof quizResults.$inferInsert;

// ─── User Profiles (Business Info) ───────────────────────────
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(), // references users.id
  fullName: varchar("fullName", { length: 255 }),
  companyName: varchar("companyName", { length: 255 }),
  phone: varchar("phone", { length: 64 }),
  email: varchar("email", { length: 320 }),
  address: varchar("address", { length: 512 }),
  city: varchar("city", { length: 128 }),
  state: varchar("state", { length: 64 }),
  zip: varchar("zip", { length: 16 }),
  website: varchar("website", { length: 512 }),
  licenseNumber: varchar("licenseNumber", { length: 128 }),
  marketArea: varchar("marketArea", { length: 255 }),
  yearsExperience: varchar("yearsExperience", { length: 32 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

// ─── Credibility Packet Projects (Track Record) ─────────────
export const credibilityProjects = mysqlTable("credibility_projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectName: varchar("projectName", { length: 255 }).notNull(), // e.g. "123 Main St Flip"
  address: varchar("address", { length: 512 }),
  city: varchar("city", { length: 128 }),
  state: varchar("state", { length: 64 }),
  purchasePrice: int("purchasePrice"),
  rehabCost: int("rehabCost"),
  salePrice: int("salePrice"),
  profit: int("profit"),
  purchaseDate: varchar("purchaseDate", { length: 32 }),
  saleDate: varchar("saleDate", { length: 32 }),
  daysToComplete: int("daysToComplete"),
  description: text("description"), // project narrative
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CredibilityProject = typeof credibilityProjects.$inferSelect;
export type InsertCredibilityProject = typeof credibilityProjects.$inferInsert;

// ─── Credibility Packet Attachments (Photos + Documents) ─────
export const credibilityAttachments = mysqlTable("credibility_attachments", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(), // references credibilityProjects.id
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["before_photo", "after_photo", "closing_statement", "bill_of_sale", "other_document"]).notNull(),
  url: text("url").notNull(), // S3 URL
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  filename: varchar("filename", { length: 255 }),
  mimeType: varchar("mimeType", { length: 64 }),
  caption: varchar("caption", { length: 255 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CredibilityAttachment = typeof credibilityAttachments.$inferSelect;
export type InsertCredibilityAttachment = typeof credibilityAttachments.$inferInsert;

// ─── Pipeline Deals (CRM) ─────────────────────────────────────
export const pipelineDeals = mysqlTable("pipeline_deals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  savedDealId: int("savedDealId"), // optional link to saved_deals.id
  propertyAddress: varchar("propertyAddress", { length: 512 }).notNull(),
  city: varchar("city", { length: 128 }),
  state: varchar("state", { length: 64 }),
  zip: varchar("zip", { length: 16 }),
  stage: mysqlEnum("stage", [
    "lead", "analyzing", "offer_submitted", "under_contract",
    "closing", "rehab", "listed", "sold", "dead"
  ]).default("lead").notNull(),
  purchasePrice: int("purchasePrice"),
  arv: int("arv"),
  rehabCost: int("rehabCost"),
  estimatedProfit: int("estimatedProfit"),
  dealScore: int("dealScore"),
  tags: text("tags"), // JSON array of tags e.g. ["flip", "wholesale", "BRRRR"]
  offerDate: timestamp("offerDate"),
  contractDate: timestamp("contractDate"),
  closingDate: timestamp("closingDate"),
  rehabStartDate: timestamp("rehabStartDate"),
  rehabEndDate: timestamp("rehabEndDate"),
  listDate: timestamp("listDate"),
  soldDate: timestamp("soldDate"),
  deadReason: varchar("deadReason", { length: 255 }),
  notes: text("notes"),
  sortOrder: int("sortOrder").default(0).notNull(),
  stageEnteredAt: timestamp("stageEnteredAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PipelineDeal = typeof pipelineDeals.$inferSelect;
export type InsertPipelineDeal = typeof pipelineDeals.$inferInsert;

// ─── Pipeline Contacts ────────────────────────────────────────
export const pipelineContacts = mysqlTable("pipeline_contacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dealId: int("dealId"), // optional link to pipeline_deals.id (null = global contact)
  name: varchar("name", { length: 255 }).notNull(),
  role: mysqlEnum("role", [
    "seller", "buyer", "listing_agent", "buyers_agent",
    "title_company", "attorney", "contractor", "lender",
    "wholesaler", "partner", "other"
  ]).default("other").notNull(),
  phone: varchar("phone", { length: 64 }),
  email: varchar("email", { length: 320 }),
  company: varchar("company", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PipelineContact = typeof pipelineContacts.$inferSelect;
export type InsertPipelineContact = typeof pipelineContacts.$inferInsert;

// ─── Pipeline Activities (Timeline) ──────────────────────────
export const pipelineActivities = mysqlTable("pipeline_activities", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dealId: int("dealId").notNull(), // references pipeline_deals.id
  type: mysqlEnum("type", [
    "note", "stage_change", "contact_added", "document_sent",
    "offer_made", "counter_received", "inspection", "appraisal",
    "closing_scheduled", "rehab_update", "listing_update", "other"
  ]).default("note").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  metadata: text("metadata"), // JSON blob for extra data (e.g. old/new stage, document name, contact info)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PipelineActivity = typeof pipelineActivities.$inferSelect;
export type InsertPipelineActivity = typeof pipelineActivities.$inferInsert;

// ─── Gifted Subscriptions ────────────────────────────────────
export const giftedSubscriptions = mysqlTable("gifted_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // references users.id — the recipient
  plan: mysqlEnum("plan", ["pro", "elite", "team"]).notNull(),
  grantedBy: int("grantedBy").notNull(), // admin user who granted it
  reason: varchar("reason", { length: 512 }), // e.g. "Referral bonus", "Contest winner"
  expiresAt: timestamp("expiresAt"), // null = permanent / never expires
  revokedAt: timestamp("revokedAt"), // null = active; set when revoked
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GiftedSubscription = typeof giftedSubscriptions.$inferSelect;
export type InsertGiftedSubscription = typeof giftedSubscriptions.$inferInsert;

// ─── Email Leads (Lead Magnet Captures) ─────────────────────
export const emailLeads = mysqlTable("email_leads", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }),
  source: varchar("source", { length: 128 }).default("homepage").notNull(), // homepage, landing-page, etc.
  leadMagnet: varchar("leadMagnet", { length: 128 }).default("5-mistakes").notNull(),
  convertedToUser: int("convertedToUser").default(0).notNull(), // 0=no, 1=yes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailLead = typeof emailLeads.$inferSelect;
export type InsertEmailLead = typeof emailLeads.$inferInsert;

// ─── Blog Posts (AI-Generated Content) ──────────────────────
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt"), // Short summary for cards/SEO
  content: text("content").notNull(), // Full markdown content
  category: varchar("category", { length: 128 }).default("general").notNull(),
  tags: text("tags"), // JSON array of tags
  coverImageUrl: text("coverImageUrl"), // Optional cover image
  status: mysqlEnum("status", ["draft", "scheduled", "published", "rejected"]).default("draft").notNull(),
  scheduledAt: timestamp("scheduledAt"), // When to auto-publish
  publishedAt: timestamp("publishedAt"), // When actually published
  facebookShared: int("facebookShared").default(0).notNull(), // 0=no, 1=yes
  facebookPostId: varchar("facebookPostId", { length: 255 }), // FB post ID if shared
  aiGenerated: int("aiGenerated").default(1).notNull(), // 1=AI, 0=manual
  authorId: int("authorId"), // null for AI-generated
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
