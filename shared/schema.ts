import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  index,
  decimal,
  serial,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// AUTHENTICATION & USERS (Replit Auth Integration)
// ============================================================================

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table (landlords authenticated via custom auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  
  // Authentication fields
  passwordHash: varchar("password_hash"), // nullable - OAuth users don't have passwords
  emailVerified: boolean("email_verified").default(false).notNull(),
  emailVerificationToken: varchar("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  oauthProvider: varchar("oauth_provider"), // "google", "github", "email", null
  oauthProviderId: varchar("oauth_provider_id"), // ID from OAuth provider
  rememberToken: varchar("remember_token"),
  lastLoginAt: timestamp("last_login_at"),
  
  // Stripe subscription fields
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionPlan: varchar("subscription_plan"),
  subscriptionStatus: varchar("subscription_status"),
  subscriptionInterval: varchar("subscription_interval").default("monthly"),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// ============================================================================
// VIEWING PREFERENCES (Landlord Onboarding)
// ============================================================================

export const viewingPreferences = pgTable("viewing_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  landlordId: varchar("landlord_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  
  // Timezone
  timezone: varchar("timezone", { length: 100 }).notNull().default("Europe/London"),
  
  // Weekly availability
  weeklyAvailability: jsonb("weekly_availability").notNull().default({
    monday: { enabled: false, start: "09:00", end: "17:00" },
    tuesday: { enabled: false, start: "09:00", end: "17:00" },
    wednesday: { enabled: false, start: "09:00", end: "17:00" },
    thursday: { enabled: false, start: "09:00", end: "17:00" },
    friday: { enabled: false, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "10:00", end: "16:00" },
    sunday: { enabled: false, start: "10:00", end: "16:00" },
  }),
  
  // Viewing settings (fixed duration and buffer)
  viewingDuration: integer("viewing_duration").notNull().default(20), // minutes (fixed)
  bufferTime: integer("buffer_time").notNull().default(10), // minutes between viewings (fixed)
  
  // Break windows (not configurable, always empty)
  breakWindows: jsonb("break_windows").notNull().default([]), // [{day: "monday", start: "12:00", end: "13:00"}]
  
  // Staff contact details
  staffEmail: varchar("staff_email", { length: 255 }),
  staffMobile: varchar("staff_mobile", { length: 50 }),
  
  // Shared calendar integration
  googleCalendarConnected: boolean("google_calendar_connected").default(false),
  
  // Onboarding tracking
  onboardingCompleted: boolean("onboarding_completed").default(false),
  completedAt: timestamp("completed_at"),
  
  // Auto-retention messaging
  autoRetentionEnabled: boolean("auto_retention_enabled").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertViewingPreferencesSchema = createInsertSchema(viewingPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertViewingPreferences = z.infer<typeof insertViewingPreferencesSchema>;
export type ViewingPreferences = typeof viewingPreferences.$inferSelect;

// ============================================================================
// DEPOSIT PROTECTIONS (UK Legal Compliance)
// ============================================================================

export const depositProtections = pgTable(
  "deposit_protections",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    
    // References
    leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    depositId: varchar("deposit_id"),
    landlordId: varchar("landlord_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    
    // Deposit details
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    scheme: varchar("scheme", { length: 50 }).notNull(), // 'TDS', 'DPS', 'MyDeposits'
    
    // Registration details
    registrationId: varchar("registration_id", { length: 255 }),
    certificateNumber: varchar("certificate_number", { length: 255 }),
    certificateUrl: text("certificate_url"),
    prescribedInfoUrl: text("prescribed_info_url"),
    
    // Status tracking
    status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending', 'registered', 'failed'
    registeredAt: timestamp("registered_at"),
    protectionDeadline: timestamp("protection_deadline").notNull(), // 30 days from deposit payment
    
    // Tenant details (snapshot at time of registration)
    tenantName: varchar("tenant_name", { length: 255 }).notNull(),
    tenantEmail: varchar("tenant_email", { length: 255 }).notNull(),
    propertyAddress: text("property_address").notNull(),
    tenancyStartDate: timestamp("tenancy_start_date").notNull(),
    tenancyEndDate: timestamp("tenancy_end_date").notNull(),
    
    // Audit
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_deposit_protections_lead").on(table.leadId),
    index("idx_deposit_protections_landlord").on(table.landlordId),
    index("idx_deposit_protections_status").on(table.status),
    index("idx_deposit_protections_deadline").on(table.protectionDeadline),
  ],
);

export const insertDepositProtectionSchema = createInsertSchema(depositProtections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  amount: z.string().regex(/^\d+(\.\d{2})?$/, "Invalid amount format"),
  scheme: z.enum(["TDS", "DPS", "MyDeposits"]),
  status: z.enum(["pending", "registered", "failed"]).optional(),
  tenantEmail: z.string().email("Invalid email format"),
});

export type InsertDepositProtection = z.infer<typeof insertDepositProtectionSchema>;
export type DepositProtection = typeof depositProtections.$inferSelect;

// Deposit Protection Reminders
export const depositProtectionReminders = pgTable(
  "deposit_protection_reminders",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    depositProtectionId: varchar("deposit_protection_id").notNull().references(() => depositProtections.id, { onDelete: "cascade" }),
    reminderType: varchar("reminder_type", { length: 50 }).notNull(), // '7_days', '14_days', '25_days'
    sentAt: timestamp("sent_at"),
    scheduledFor: timestamp("scheduled_for").notNull(),
    status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending', 'sent', 'cancelled'
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_dp_reminders_protection").on(table.depositProtectionId),
    index("idx_dp_reminders_scheduled").on(table.scheduledFor),
    index("idx_dp_reminders_status").on(table.status),
  ],
);

export type DepositProtectionReminder = typeof depositProtectionReminders.$inferSelect;

// ============================================================================
// DEMO BOOKINGS (Marketing - No Auth Required)
// ============================================================================

export const demoBookings = pgTable("demo_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Contact Information
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  
  // Context Information
  numberOfBeds: varchar("number_of_beds", { length: 50 }).notNull(), // "10-50", "51-100", etc.
  preferredDateTime: varchar("preferred_date_time", { length: 255 }), // Flexible text field
  specificInterests: text("specific_interests").array().default([]), // ["clearing_automation", "viewing_management", etc.]
  
  // Optional
  message: text("message"),
  
  // Metadata
  source: varchar("source", { length: 100 }).default("website"), // tracking where they came from
  status: varchar("status", { length: 50 }).default("pending"), // "pending", "contacted", "scheduled", "completed"
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDemoBookingSchema = createInsertSchema(demoBookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  numberOfBeds: z.string().min(1, "Please select number of beds"),
  specificInterests: z.array(z.string()).optional(),
});

export type InsertDemoBooking = z.infer<typeof insertDemoBookingSchema>;
export type DemoBooking = typeof demoBookings.$inferSelect;

// ============================================================================
// CONTRACT TEMPLATES
// ============================================================================

export const contractTemplates = pgTable("contract_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  landlordId: varchar("landlord_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 1000 }).notNull(),
  fields: jsonb("fields").default([]), // Store the field configuration
  isDefault: boolean("is_default").default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const insertContractTemplateSchema = createInsertSchema(contractTemplates).omit({
  id: true,
  uploadedAt: true,
});

export type InsertContractTemplate = z.infer<typeof insertContractTemplateSchema>;
export type ContractTemplate = typeof contractTemplates.$inferSelect;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  
  // User relationship
  landlordId: varchar("landlord_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  
  // Feature identification
  featureKey: varchar("feature_key", { length: 100 }).notNull(),
  // Values: "whatsapp_integration", "incentives_system", "ai_call_scoring"
  
  // Flag status
  enabled: boolean("enabled").notNull().default(false),
  
  // Metadata
  enabledAt: timestamp("enabled_at"),
  enabledBy: varchar("enabled_by").references(() => users.id),
  // For admin/system tracking
  
  disabledAt: timestamp("disabled_at"),
  disabledBy: varchar("disabled_by").references(() => users.id),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  // Unique constraint: one flag per landlord per feature
  uniqueIndex("feature_flags_landlord_feature_idx").on(table.landlordId, table.featureKey),
]);

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type FeatureFlag = typeof featureFlags.$inferSelect;

// ============================================================================
// PROPERTY MANAGEMENT
// ============================================================================

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  landlordId: varchar("landlord_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Basic info
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postcode: text("postcode").notNull(),
  
  // Property details
  description: text("description"),
  propertyType: varchar("property_type", { length: 50 }).notNull(), // "student_accommodation", "house_share", etc.
  totalBedrooms: integer("total_bedrooms").notNull(),
  numberOfBathrooms: integer("number_of_bathrooms"),
  parkingSpaces: integer("parking_spaces"),
  gardenOutdoorSpace: boolean("garden_outdoor_space").default(false),
  furnishingStatus: varchar("furnishing_status", { length: 50 }), // "fully_furnished", "part_furnished", "unfurnished"
  accessibilityFeatures: text("accessibility_features").array(), // ["wheelchair_access", "lift", "ground_floor_rooms"]
  
  // Amenities
  amenities: text("amenities").array(), // ["wifi", "gym", "laundry", "bike_storage", "study_rooms", "cinema_room", "games_room"]
  
  // Policies & Rules
  petPolicy: text("pet_policy"), // "no_pets", "cats_allowed", "small_pets_allowed"
  smokingPolicy: text("smoking_policy"), // "no_smoking", "outdoor_only"
  guestPolicy: text("guest_policy"), // Description of guest rules
  noisePolicy: text("noise_policy"), // Quiet hours, etc.
  cleaningSchedule: text("cleaning_schedule"), // Communal area cleaning info
  
  // Utilities & Bills
  utilitiesIncluded: boolean("utilities_included").default(false),
  utilityDetails: text("utility_details"), // What's included/excluded
  councilTaxIncluded: boolean("council_tax_included").default(false),
  tvLicenseIncluded: boolean("tv_license_included").default(false),
  internetSpeed: text("internet_speed"), // "100Mbps", "Gigabit"
  
  // FAQs & Key Info
  frequentQuestions: jsonb("frequent_questions"), // [{question: string, answer: string}]
  keyFeatures: text("key_features").array(), // Unique selling points
  nearbyUniversities: text("nearby_universities").array(), // ["University of Nottingham", "Nottingham Trent"]
  transportLinks: text("transport_links"), // Bus routes, tram stops, distances
  
  // Data Enrichment (WhatsApp & Website Scraping)
  websiteDomain: text("website_domain"), // URL to scrape property data from
  whatsappHistoryUrl: text("whatsapp_history_url"), // Uploaded WhatsApp export file URL
  aiExtractedInsights: jsonb("ai_extracted_insights"), // AI-parsed insights from WhatsApp/website
  dataEnrichmentStatus: varchar("data_enrichment_status", { length: 20 }).default("pending"), // "pending", "processing", "completed", "failed"
  enrichmentProcessedAt: timestamp("enrichment_processed_at"),
  
  // Media
  floorPlanUrl: text("floor_plan_url"), // Object storage URL
  floorPlanData: jsonb("floor_plan_data"), // SVG zones and room mappings
  heroImageUrl: text("hero_image_url"),
  imageUrls: text("image_urls").array(),
  
  // Availability
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

// ============================================================================
// ROOMS
// ============================================================================

export const rooms = pgTable("rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  
  // Room details
  roomNumber: text("room_number").notNull(),
  roomType: varchar("room_type", { length: 100 }).notNull(), 
  // Stanley: "en_suite", "premium_studio", "premium_plus_studio", "deluxe_studio", "super_deluxe_studio"
  // Broadgate: "cluster_3bed", "cluster_4bed", "cluster_5bed", "cluster_6bed", "studio"
  
  // Pricing (per week, as per UK student accommodation standard)
  rentPerWeek: decimal("rent_per_week", { precision: 10, scale: 2 }).notNull(),
  rentPerWeekDual: decimal("rent_per_week_dual", { precision: 10, scale: 2 }), // Per person for dual occupancy
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Features
  size: integer("size"), // square meters
  features: text("features").array(), // ["wifi", "ensuite", "kitchen", "43_inch_tv"]
  isDualOccupancy: boolean("is_dual_occupancy").default(false),
  
  // Media
  videoUrls: text("video_urls").array(),
  imageUrls: text("image_urls").array(),
  
  // Availability
  status: varchar("status", { length: 20 }).notNull().default("available"), // "available", "reserved", "occupied"
  availableFrom: timestamp("available_from"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

// ============================================================================
// LEADS & TENANT PIPELINE
// ============================================================================

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").references(() => properties.id, { onDelete: "set null" }),
  roomId: varchar("room_id").references(() => rooms.id, { onDelete: "set null" }),
  
  // Contact info
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  whatsappNumber: text("whatsapp_number"),
  company: text("company"), // Company name for lead capture forms
  
  // Language preference (detected from first message)
  preferredLanguage: varchar("preferred_language", { length: 5 }), // 'en', 'es', 'fr', 'zh', 'hi', 'ar'
  
  // Source tracking
  source: varchar("source", { length: 50 }).notNull(), // "whatsapp", "email", "web", "rightmove", "zoopla"
  sourceDetails: jsonb("source_details"), // Portal reference, campaign ID, etc.
  
  // Pipeline stage
  stage: varchar("stage", { length: 50 }).notNull().default("new_enquiry"),
  // Stages: new_enquiry, viewing_booked, viewed_awaiting_application, 
  // application_submitted, deposit_paid, contract_sent, contract_signed, moved_in
  
  // Key dates
  enquiryDate: timestamp("enquiry_date").defaultNow(),
  viewingDate: timestamp("viewing_date"),
  applicationDate: timestamp("application_date"),
  contractSignedDate: timestamp("contract_signed_date"),
  moveInDate: timestamp("move_in_date"),
  moveOutDate: timestamp("move_out_date"),
  
  // Metadata
  tags: text("tags").array(),
  notes: text("notes"),
  
  // Payment tracking
  depositPaid: boolean("deposit_paid").default(false),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  
  // Application/Booking fields
  universityName: text("university_name"),
  courseName: text("course_name"),
  yearOfStudy: varchar("year_of_study", { length: 50 }), // "first_year", "second_year", "postgraduate"
  paymentOption: text("payment_option"), // "full_payment" or "instalments"
  needsGuarantor: boolean("needs_guarantor").default(false),
  
  // Enhanced Demographics (for marketing insights)
  ageRange: varchar("age_range", { length: 20 }), // "18-21", "22-25", "26-30", "30+"
  gender: varchar("gender", { length: 20 }), // "male", "female", "other", "prefer_not_to_say"
  homeCountry: varchar("home_country", { length: 100 }), // Specific country for targeting
  visaStatus: varchar("visa_status", { length: 50 }), // "student_visa", "uk_resident", "eu_settled", "other"
  englishProficiency: varchar("english_proficiency", { length: 20 }), // "native", "fluent", "intermediate", "basic"
  
  // Marketing & Behavioral Insights
  marketingPersona: varchar("marketing_persona", { length: 100 }), // AI-classified persona (e.g., "Budget-Conscious Chinese Postgrad")
  painPoints: text("pain_points").array(), // ["location", "price", "facilities", "contract_flexibility"]
  parentInvolved: boolean("parent_involved").default(false), // Family decision-making indicator
  decisionTimeline: varchar("decision_timeline", { length: 50 }), // "urgent", "1-2_weeks", "1_month", "flexible"
  referralSource: text("referral_source"), // "friend", "agent", "university", "social_media"
  
  // Guarantor fields
  guarantorName: text("guarantor_name"),
  guarantorAddress: text("guarantor_address"),
  guarantorPhone: text("guarantor_phone"),
  guarantorMobile: text("guarantor_mobile"),
  guarantorEmail: text("guarantor_email"),
  guarantorDob: text("guarantor_dob"),
  guarantorNi: text("guarantor_ni"),
  
  // Tenant access control (token for unauthenticated tenant actions like application submission)
  accessToken: text("access_token").default(sql`gen_random_uuid()`),
  
  // Workflow automation & archival
  archived: boolean("archived").default(false),
  completedAt: timestamp("completed_at"),
  rtrStatus: varchar("rtr_status", { length: 20 }).default("not_started"), // "not_started", "pending", "passed", "failed"
  rtrCheckedAt: timestamp("rtr_checked_at"),
  
  // Hold/reservation system
  holdActive: boolean("hold_active").default(false),
  holdExpiresAt: timestamp("hold_expires_at"),
  holdCreatedAt: timestamp("hold_created_at"),
  hold24hNudgeSent: boolean("hold_24h_nudge_sent").default(false),
  hold1hNudgeSent: boolean("hold_1h_nudge_sent").default(false),
  
  // Communication preferences
  whatsappOptOut: boolean("whatsapp_opt_out").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Simple lead capture schema for forms (exit intent, PBSA guide, newsletter, etc.)
export const leadCaptureSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required").optional(),
  company: z.string().optional(),
  source: z.enum(['exit_intent', 'pbsa_guide', 'newsletter', 'web', 'other']).default('web'),
  notes: z.string().optional(),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type LeadCapture = z.infer<typeof leadCaptureSchema>;

// ============================================================================
// AI CONVERSATIONS
// ============================================================================

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  
  // Channel
  channel: varchar("channel", { length: 20 }).notNull(), // "whatsapp", "email", "web"
  channelIdentifier: text("channel_identifier"), // Phone number, email address, session ID
  
  // Conversation metadata
  status: varchar("status", { length: 20 }).default("active"), // "active", "archived"
  summary: text("summary"), // AI-generated conversation summary
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// ============================================================================
// MESSAGES
// ============================================================================

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  
  // Message details
  role: varchar("role", { length: 20 }).notNull(), // "user", "assistant", "system"
  content: text("content").notNull(),
  
  // Metadata
  metadata: jsonb("metadata"), // Attachments, quick replies, etc.
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// ============================================================================
// CONVERSATION STRATEGIES (A/B Testing System)
// ============================================================================

// Strategy Types
export const STRATEGY_TYPES = {
  // WhatsApp/SMS Strategies (8)
  RAPPORT_FIRST: 'rapport_first',
  WHATSAPP_ULTRA_CASUAL: 'whatsapp_ultra_casual',
  WHATSAPP_PROFESSIONAL: 'whatsapp_professional',
  WHATSAPP_QUESTION_SEQUENCE: 'whatsapp_question_sequence',
  WHATSAPP_BENEFIT_LED: 'whatsapp_benefit_led',
  WHATSAPP_URGENCY_DRIVER: 'whatsapp_urgency_driver',
  WHATSAPP_CONSULTATION: 'whatsapp_consultation',
  WHATSAPP_MICRO_COMMITMENTS: 'whatsapp_micro_commitments',
  
  // Email Strategies (8)
  EMAIL_DETAILED_RESPONSE: 'email_detailed_response',
  EMAIL_BRIEF_CTA: 'email_brief_cta',
  EMAIL_STORYTELLING: 'email_storytelling',
  EMAIL_FAQ_PREEMPTIVE: 'email_faq_preemptive',
  EMAIL_SOCIAL_PROOF: 'email_social_proof',
  EMAIL_PERSONALIZED_RECOMMENDATION: 'email_personalized_recommendation',
  EMAIL_MULTI_TOUCH_SEQUENCE: 'email_multi_touch_sequence',
  EMAIL_DIRECT_BOOKING: 'email_direct_booking',
  
  // Portal/Web Strategies (5)
  PORTAL_FAST_TRACK: 'portal_fast_track',
  WEB_INSTANT_GRATIFICATION: 'web_instant_gratification',
  WEB_COMPARISON_HELPER: 'web_comparison_helper',
  WEB_VIRTUAL_TOUR_PUSHER: 'web_virtual_tour_pusher',
  WEB_CALENDAR_FIRST: 'web_calendar_first',
  
  // Phone/High-Touch Strategies (4)
  CONCIERGE_FOLLOW_UP: 'concierge_follow_up',
  PHONE_CALLBACK_BOOKING: 'phone_callback_booking',
  PHONE_TRANSCRIPT_FRIENDLY: 'phone_transcript_friendly',
  VIP_WHITE_GLOVE: 'vip_white_glove',
  
  // Legacy/General (keeping for backward compatibility)
  DIRECT_CAPTURE: 'direct_capture',
  HYBRID: 'hybrid',
} as const;

// Funnel Stages for Conversion Tracking
export const FUNNEL_STAGES = {
  CONTACT_INFO_CAPTURED: 'contact_info_captured',
  VIEWING_BOOKED: 'viewing_booked',
  VIEWING_ATTENDED: 'viewing_attended',
  APPLICATION_SUBMITTED: 'application_submitted',
  DEPOSIT_PAID: 'deposit_paid',
  CONTRACT_SENT: 'contract_sent',
  CONTRACT_SIGNED: 'contract_signed',
} as const;

// Strategy Definitions Table
export const conversationStrategies = pgTable("conversation_strategies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Strategy metadata
  strategyType: varchar("strategy_type", { length: 50 }).notNull(), // "rapport_first", "direct_capture", etc.
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  
  // System prompt template
  systemPromptTemplate: text("system_prompt_template").notNull(),
  
  // Strategy configuration
  config: jsonb("config"), // Guardrails, fallback rules, escalation triggers
  
  // Performance tracking
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0), // Higher = more traffic in weighted random
  
  // Versioning
  version: varchar("version", { length: 20 }).default("1.0"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertConversationStrategySchema = createInsertSchema(conversationStrategies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertConversationStrategy = z.infer<typeof insertConversationStrategySchema>;
export type ConversationStrategy = typeof conversationStrategies.$inferSelect;

// Strategy Assignments Table (which lead got which strategy)
export const strategyAssignments = pgTable("strategy_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  leadId: varchar("lead_id").notNull().unique().references(() => leads.id, { onDelete: "cascade" }), // Unique for upsert support
  strategyId: varchar("strategy_id").notNull().references(() => conversationStrategies.id, { onDelete: "cascade" }),
  
  // Assignment context
  source: varchar("source", { length: 50 }).notNull(), // "website", "whatsapp", "rightmove", "zoopla", etc.
  assignedBy: varchar("assigned_by", { length: 50 }).default("auto"), // "auto", "manual", "ml_optimization"
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }), // 0.00-1.00 for ML-based assignments
  
  // Manual override flag
  isManualOverride: boolean("is_manual_override").default(false),
  
  // Metadata
  assignmentMetadata: jsonb("assignment_metadata"), // Context signals used for assignment
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStrategyAssignmentSchema = createInsertSchema(strategyAssignments).omit({
  id: true,
  createdAt: true,
});

export type InsertStrategyAssignment = z.infer<typeof insertStrategyAssignmentSchema>;
export type StrategyAssignment = typeof strategyAssignments.$inferSelect;

// Strategy Events Table (funnel milestone tracking)
export const strategyEvents = pgTable("strategy_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  strategyId: varchar("strategy_id").notNull().references(() => conversationStrategies.id, { onDelete: "cascade" }),
  
  // Event details
  funnelStage: varchar("funnel_stage", { length: 50 }).notNull(), // From FUNNEL_STAGES enum
  channel: varchar("channel", { length: 20 }).notNull(), // "whatsapp", "email", "web", "call"
  
  // Event metadata
  metadata: jsonb("metadata"), // Additional context (message count, time to conversion, etc.)
  
  // Rapport quality signals (for trade-off analysis)
  messageCount: integer("message_count"), // How many messages to reach this stage
  avgMessageLength: decimal("avg_message_length", { precision: 6, scale: 2 }), // Avg chars per message
  emojiCount: integer("emoji_count"), // Total emojis used (rapport indicator)
  avgResponseTime: integer("avg_response_time"), // Avg seconds between messages
  
  occurredAt: timestamp("occurred_at").defaultNow(),
});

export const insertStrategyEventSchema = createInsertSchema(strategyEvents).omit({
  id: true,
  occurredAt: true,
});

export type InsertStrategyEvent = z.infer<typeof insertStrategyEventSchema>;
export type StrategyEvent = typeof strategyEvents.$inferSelect;

// Strategy Performance Table (aggregated analytics)
export const strategyPerformance = pgTable("strategy_performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  strategyId: varchar("strategy_id").notNull().references(() => conversationStrategies.id, { onDelete: "cascade" }),
  
  // Time period
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  // Funnel metrics (denormalized for fast queries)
  totalLeads: integer("total_leads").default(0),
  contactInfoCaptured: integer("contact_info_captured").default(0),
  viewingsBooked: integer("viewings_booked").default(0),
  viewingsAttended: integer("viewings_attended").default(0),
  depositsRecorded: integer("deposits_recorded").default(0),
  contractsSigned: integer("contracts_signed").default(0),
  
  // Conversion rates (calculated)
  contactCaptureRate: decimal("contact_capture_rate", { precision: 5, scale: 2 }), // %
  viewingBookRate: decimal("viewing_book_rate", { precision: 5, scale: 2 }), // %
  viewingAttendRate: decimal("viewing_attend_rate", { precision: 5, scale: 2 }), // %
  depositConversionRate: decimal("deposit_conversion_rate", { precision: 5, scale: 2 }), // %
  contractSignRate: decimal("contract_sign_rate", { precision: 5, scale: 2 }), // %
  
  // Rapport quality averages
  avgRapportScore: decimal("avg_rapport_score", { precision: 5, scale: 2 }), // Calculated from message metrics
  avgTimeToViewing: integer("avg_time_to_viewing"), // Seconds from first contact to viewing booked
  
  // Statistical significance
  sampleSize: integer("sample_size"),
  isSignificant: boolean("is_significant").default(false), // z-test vs baseline
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStrategyPerformanceSchema = createInsertSchema(strategyPerformance).omit({
  id: true,
  createdAt: true,
});

export type InsertStrategyPerformance = z.infer<typeof insertStrategyPerformanceSchema>;
export type StrategyPerformance = typeof strategyPerformance.$inferSelect;

// ============================================================================
// MESSAGE TEMPLATE A/B TESTING (Thompson Sampling)
// ============================================================================

// Message Template Variants Table - Store the 53 templates from CSVs
export const messageTemplateVariants = pgTable("message_template_variants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Template metadata
  templateKey: varchar("template_key", { length: 50 }).notNull().unique(), // e.g., "vw_short", "e_push_wa_link"
  stage: varchar("stage", { length: 50 }).notNull(), // e.g., "viewing_offer", "reactivate_email", "idv_prompt"
  channel: varchar("channel", { length: 20 }).notNull(), // "wa" or "email"
  
  // Content
  toneOrSubject: varchar("tone_or_subject", { length: 200 }).notNull(), // For WhatsApp: tone (e.g., "short", "reassure"). For Email: subject line
  textContent: text("text_content").notNull(), // Message template with {variable} placeholders
  variables: text("variables").array().default(sql`ARRAY[]::text[]`), // e.g., ["s1", "s2", "link", "waNumber"]
  
  // Eligibility flags (for cohort filtering)
  eligibilityFlags: text("eligibility_flags").array().default(sql`ARRAY[]::text[]`), // e.g., ["intl", "portal", "day", "night"]
  
  // Status
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMessageTemplateVariantSchema = createInsertSchema(messageTemplateVariants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMessageTemplateVariant = z.infer<typeof insertMessageTemplateVariantSchema>;
export type MessageTemplateVariant = typeof messageTemplateVariants.$inferSelect;

// Template Bandit Stats Table - Thompson sampling statistics per template per cohort
export const templateBanditStats = pgTable("template_bandit_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  templateId: varchar("template_id").notNull().references(() => messageTemplateVariants.id, { onDelete: "cascade" }),
  
  // Cohort segmentation (creates separate bandit arms per segment)
  cohortKey: varchar("cohort_key", { length: 200 }).notNull(), // e.g., "whatsapp|uk|solo|day" or "portal|intl|group|night"
  
  // Thompson sampling parameters (Beta distribution)
  alpha: decimal("alpha", { precision: 10, scale: 4 }).default("1.0"), // Successes + 1 (prior)
  beta: decimal("beta", { precision: 10, scale: 4 }).default("1.0"), // Failures + 1 (prior)
  
  // Performance tracking
  shownCount: integer("shown_count").default(0), // How many times shown
  totalReward: decimal("total_reward", { precision: 10, scale: 4 }).default("0.0"), // Sum of partial rewards (0.0-1.0 each)
  
  // Metadata
  lastShownAt: timestamp("last_shown_at"),
  lastUpdatedAt: timestamp("last_updated_at").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueCohort: uniqueIndex("template_cohort_idx").on(table.templateId, table.cohortKey)
}));

export const insertTemplateBanditStatsSchema = createInsertSchema(templateBanditStats).omit({
  id: true,
  createdAt: true,
});

export type InsertTemplateBanditStats = z.infer<typeof insertTemplateBanditStatsSchema>;
export type TemplateBanditStats = typeof templateBanditStats.$inferSelect;

// Template Show Events Table - Track template usage and outcomes
export const templateShowEvents = pgTable("template_show_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  templateId: varchar("template_id").notNull().references(() => messageTemplateVariants.id, { onDelete: "cascade" }),
  
  // Context
  stage: varchar("stage", { length: 50 }).notNull(),
  channel: varchar("channel", { length: 20 }).notNull(),
  cohortKey: varchar("cohort_key", { length: 200 }).notNull(),
  
  // Outcome tracking
  outcome: varchar("outcome", { length: 50 }), // "clicked", "converted", "ignored", "bounced"
  partialReward: decimal("partial_reward", { precision: 3, scale: 2 }), // 0.00-1.00 for Thompson sampling update
  
  // Metadata
  messageSid: varchar("message_sid"), // Twilio SID if WhatsApp
  emailMessageId: varchar("email_message_id"), // Nodemailer message ID if email
  
  shownAt: timestamp("shown_at").defaultNow(),
  outcomeAt: timestamp("outcome_at"),
});

export const insertTemplateShowEventSchema = createInsertSchema(templateShowEvents).omit({
  id: true,
  shownAt: true,
});

export type InsertTemplateShowEvent = z.infer<typeof insertTemplateShowEventSchema>;
export type TemplateShowEvent = typeof templateShowEvents.$inferSelect;

// Template Flags Table - Control which templates are active/disabled (for auto-pruning)
export const templateFlags = pgTable("template_flags", {
  id: serial("id").primaryKey(),
  channel: varchar("channel", { length: 20 }).notNull(), // "wa" or "email"
  templateId: varchar("template_id").notNull().references(() => messageTemplateVariants.id, { onDelete: "cascade" }),
  disabled: boolean("disabled").notNull().default(true),
  reason: text("reason"), // e.g., "auto-pruner", "duplicate-pruned", "manual"
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueChannelTemplate: uniqueIndex("template_flags_channel_template_idx").on(table.channel, table.templateId)
}));

export const insertTemplateFlagsSchema = createInsertSchema(templateFlags).omit({
  id: true,
  createdAt: true,
});

export type InsertTemplateFlags = z.infer<typeof insertTemplateFlagsSchema>;
export type TemplateFlags = typeof templateFlags.$inferSelect;

// Arm Limits Table - Define how many active variants allowed per stage
export const armLimits = pgTable("arm_limits", {
  id: serial("id").primaryKey(),
  stage: varchar("stage", { length: 50 }).notNull().unique(),
  limit: integer("limit").notNull().default(3),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertArmLimitsSchema = createInsertSchema(armLimits).omit({
  id: true,
  updatedAt: true,
});

export type InsertArmLimits = z.infer<typeof insertArmLimitsSchema>;
export type ArmLimits = typeof armLimits.$inferSelect;

// ============================================================================
// VIEWINGS
// ============================================================================

export const viewings = pgTable("viewings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  propertyId: varchar("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  
  // Viewing details
  viewingType: varchar("viewing_type", { length: 20 }).notNull(), // "in_person", "video_call", "self_guided"
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(30), // minutes
  
  // Status
  status: varchar("status", { length: 20 }).default("scheduled"), // "scheduled", "completed", "cancelled", "no_show"
  
  // Shared calendar integration
  googleCalendarEventId: text("google_calendar_event_id"),
  googleMeetLink: text("google_meet_link"),
  
  // Viewing outcome (captured after viewing)
  outcome: varchar("outcome", { length: 20 }), // "interested", "needs_time", "not_interested"
  outcomeReason: text("outcome_reason"), // Reason if not interested or needs time
  
  // Feedback
  attended: boolean("attended"),
  feedbackNotes: text("feedback_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertViewingSchema = createInsertSchema(viewings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertViewing = z.infer<typeof insertViewingSchema>;
export type Viewing = typeof viewings.$inferSelect;

// ============================================================================
// DEPOSITS TABLE
// ============================================================================

export const deposits = pgTable("deposits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  propertyId: varchar("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  roomId: varchar("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  
  // Amount and status
  amount: integer("amount").notNull(), // Amount in pence (e.g., 50000 = £500)
  status: varchar("status", { length: 20 }).default("pending"), // "pending", "paid", "refunded", "failed"
  
  // Stripe details
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeClientSecret: text("stripe_client_secret"),
  
  // Payment metadata
  paidAt: timestamp("paid_at"),
  refundedAt: timestamp("refunded_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDeposit = z.infer<typeof insertDepositSchema>;
export type Deposit = typeof deposits.$inferSelect;

// ============================================================================
// FOLLOW-UPS (Automated WhatsApp Follow-up System)
// ============================================================================

export const followUps = pgTable("follow_ups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  
  // Follow-up details
  type: varchar("type", { length: 50 }).notNull(), // "dormant_lead", "viewing_reminder", "application_nudge", "manual"
  message: text("message").notNull(), // AI-generated or manual message sent
  
  // Delivery tracking
  channel: varchar("channel", { length: 20 }).notNull().default("whatsapp"), // "whatsapp", "email"
  status: varchar("status", { length: 20 }).default("sent"), // "sent", "delivered", "failed"
  
  // Response tracking
  responded: boolean("responded").default(false),
  responseDate: timestamp("response_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFollowUpSchema = createInsertSchema(followUps).omit({
  id: true,
  createdAt: true,
});

export type InsertFollowUp = z.infer<typeof insertFollowUpSchema>;
export type FollowUp = typeof followUps.$inferSelect;

// ============================================================================
// CONTRACTS
// ============================================================================

export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  roomId: varchar("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  
  // Contract details
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  contractLengthWeeks: integer("contract_length_weeks").notNull(), // 48, 49, 50, 51, or 52 weeks
  weeklyRent: decimal("weekly_rent", { precision: 10, scale: 2 }).notNull(),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }).notNull(),
  isDualOccupancy: boolean("is_dual_occupancy").default(false),
  
  // Document
  contractUrl: text("contract_url"), // Object storage URL
  
  // Status
  status: varchar("status", { length: 20 }).default("draft"), // "draft", "sent", "signed", "active", "expired"
  sentAt: timestamp("sent_at"),
  signedAt: timestamp("signed_at"),
  
  // RTR Compliance Sequence Fields
  approvalStatus: varchar("approval_status").notNull().default("pending"), // "pending", "approved", "rejected"
  
  rightToRentStatus: varchar("right_to_rent_status").notNull().default("not_started"), // "not_started", "pending", "passed", "failed"
  rightToRentCheckedAt: timestamp("right_to_rent_checked_at"),
  rightToRentCheckerId: varchar("right_to_rent_checker_id"), // Staff member who performed check
  rightToRentDocumentUrl: text("right_to_rent_document_url"), // Link to RTR evidence
  
  depositChargeStatus: varchar("deposit_charge_status").notNull().default("not_charged"), // "not_charged", "pending", "charged", "failed", "refunded"
  depositChargeId: varchar("deposit_charge_id"), // Stripe Payment Intent ID
  depositChargedAt: timestamp("deposit_charged_at"),
  
  tenantSignatureStatus: varchar("tenant_signature_status").notNull().default("not_signed"), // "not_signed", "pending", "signed"
  tenantSignedAt: timestamp("tenant_signed_at"),
  
  landlordSignatureStatus: varchar("landlord_signature_status").notNull().default("not_signed"), // "not_signed", "pending", "signed"
  landlordSignedAt: timestamp("landlord_signed_at"),
  
  sequenceCompletedAt: timestamp("sequence_completed_at"), // When all steps completed
  
  // Deposit Protection Compliance (UK Housing Act 2004)
  depositProtectionStatus: varchar("deposit_protection_status").notNull().default("not_protected"), // "not_protected", "protected", "exempt", "overdue"
  depositProtectionScheme: varchar("deposit_protection_scheme"), // "DPS", "MyDeposits", "TDS"
  depositProtectionCertificateNumber: varchar("deposit_protection_certificate_number"),
  depositProtectionDate: timestamp("deposit_protection_date"), // When landlord marked as protected
  depositProtectionDeadline: timestamp("deposit_protection_deadline"), // depositChargedAt + 30 days
  depositProtectionRemindersSent: integer("deposit_protection_reminders_sent").default(0),
  depositProtectionLastReminderAt: timestamp("deposit_protection_last_reminder_at"),
  
  // Signable E-Signature Fields
  signableEnvelopeId: varchar("signable_envelope_id"), // Signable document ID
  tenantSigningUrl: text("tenant_signing_url"), // Embedded signing URL for tenant
  landlordSigningUrl: text("landlord_signing_url"), // Embedded signing URL for landlord
  guarantorSigningUrl: text("guarantor_signing_url"), // Embedded signing URL for guarantor (if needed)
  signedDocumentUrl: text("signed_document_url"), // Final signed PDF location in object storage
  fullyExecutedAt: timestamp("fully_executed_at"), // When all parties have signed
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;

// ============================================================================
// WEBHOOK LOGS (for debugging)
// ============================================================================

export const webhookLogs = pgTable("webhook_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  source: varchar("source", { length: 50 }).notNull(), // "twilio", "email", "portal"
  eventType: varchar("event_type", { length: 100 }),
  payload: jsonb("payload").notNull(),
  processed: boolean("processed").default(false),
  error: text("error"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWebhookLogSchema = createInsertSchema(webhookLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertWebhookLog = z.infer<typeof insertWebhookLogSchema>;
export type WebhookLog = typeof webhookLogs.$inferSelect;

// ============================================================================
// WEBHOOK EVENTS (Idempotent Webhook Processing)
// ============================================================================

export const webhookEvents = pgTable("webhook_events", {
  id: serial("id").primaryKey(),
  
  // Event identification
  provider: varchar("provider", { length: 50 }).notNull(),
  eventId: varchar("event_id", { length: 255 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  
  // Payload storage
  rawPayload: jsonb("raw_payload").notNull(),
  headers: jsonb("headers"),
  
  // Processing status
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  processedAt: timestamp("processed_at"),
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").notNull().default(0),
  
  // Relationships
  landlordId: varchar("landlord_id").references(() => users.id, { onDelete: "set null" }),
  relatedContractId: varchar("related_contract_id").references(() => contracts.id, { onDelete: "set null" }),
  relatedLeadId: varchar("related_lead_id").references(() => leads.id, { onDelete: "set null" }),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueProviderEventId: uniqueIndex("webhook_events_provider_event_id_idx").on(table.provider, table.eventId),
}));

export const insertWebhookEventSchema = createInsertSchema(webhookEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWebhookEvent = z.infer<typeof insertWebhookEventSchema>;
export type WebhookEvent = typeof webhookEvents.$inferSelect;

// ============================================================================
// ROOM VOIDS (Vacancy Tracking)
// ============================================================================

export const roomVoids = pgTable("room_voids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  propertyId: varchar("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  
  // Void period
  voidStartDate: timestamp("void_start_date").notNull(),
  voidEndDate: timestamp("void_end_date"),
  
  // Financial tracking
  weeklyRateAtVoid: decimal("weekly_rate_at_void", { precision: 10, scale: 2 }).notNull(),
  estimatedLostRevenue: decimal("estimated_lost_revenue", { precision: 10, scale: 2 }),
  
  // Metadata
  voidReason: text("void_reason"),
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRoomVoidSchema = createInsertSchema(roomVoids).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRoomVoid = z.infer<typeof insertRoomVoidSchema>;
export type RoomVoid = typeof roomVoids.$inferSelect;

// ============================================================================
// EMAIL EVENTS (Audit Trail)
// ============================================================================

export const emailEvents = pgTable("email_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Email details
  eventType: varchar("event_type", { length: 50 }).notNull(), // "welcome", "onboarding_confirmation", "staff_created", "deal_approval"
  recipientEmail: varchar("recipient_email", { length: 255 }).notNull(),
  recipientName: varchar("recipient_name", { length: 255 }),
  subject: text("subject").notNull(),
  
  // Status tracking
  status: varchar("status", { length: 20 }).notNull().default("queued"), // "queued", "sent", "failed"
  
  // Related entities (flexible linking)
  relatedEntityType: varchar("related_entity_type", { length: 50 }), // "user", "lead", "property", "contract"
  relatedEntityId: varchar("related_entity_id"),
  
  // Audit data
  metadata: jsonb("metadata"), // Store template variables, extra context
  renderedHtml: text("rendered_html"), // Store full email HTML for audit
  errorMessage: text("error_message"),
  
  // Tracking
  triggeredByUserId: varchar("triggered_by_user_id").references(() => users.id, { onDelete: "set null" }),
  sentAt: timestamp("sent_at").defaultNow(),
  attemptedAt: timestamp("attempted_at").array(), // Array for retry tracking
  lastErrorAt: timestamp("last_error_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEmailEventSchema = createInsertSchema(emailEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertEmailEvent = z.infer<typeof insertEmailEventSchema>;
export type EmailEvent = typeof emailEvents.$inferSelect;

// ============================================================================
// APPROVALS (Deal Approval Manual Gate)
// ============================================================================

export const approvals = pgTable("approvals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  
  // Approval token (secure, unique)
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  
  // Status
  status: varchar("status", { length: 30 }).notNull().default("pending"), // "pending", "approved", "changes_requested"
  
  // Decision tracking
  decidedBy: varchar("decided_by").references(() => users.id, { onDelete: "set null" }),
  decidedAt: timestamp("decided_at"),
  
  // Extra context
  metadata: jsonb("metadata"), // Store deal details, requested changes
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertApprovalSchema = createInsertSchema(approvals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertApproval = z.infer<typeof insertApprovalSchema>;
export type Approval = typeof approvals.$inferSelect;

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  landlord: one(users, {
    fields: [properties.landlordId],
    references: [users.id],
  }),
  rooms: many(rooms),
  leads: many(leads),
  viewings: many(viewings),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  property: one(properties, {
    fields: [rooms.propertyId],
    references: [properties.id],
  }),
  leads: many(leads),
  contracts: many(contracts),
  voids: many(roomVoids),
}));

export const roomVoidsRelations = relations(roomVoids, ({ one }) => ({
  room: one(rooms, {
    fields: [roomVoids.roomId],
    references: [rooms.id],
  }),
  property: one(properties, {
    fields: [roomVoids.propertyId],
    references: [properties.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  property: one(properties, {
    fields: [leads.propertyId],
    references: [properties.id],
  }),
  room: one(rooms, {
    fields: [leads.roomId],
    references: [rooms.id],
  }),
  conversations: many(conversations),
  viewings: many(viewings),
  contracts: many(contracts),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  lead: one(leads, {
    fields: [conversations.leadId],
    references: [leads.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const viewingsRelations = relations(viewings, ({ one }) => ({
  lead: one(leads, {
    fields: [viewings.leadId],
    references: [leads.id],
  }),
  property: one(properties, {
    fields: [viewings.propertyId],
    references: [properties.id],
  }),
}));

export const contractsRelations = relations(contracts, ({ one }) => ({
  lead: one(leads, {
    fields: [contracts.leadId],
    references: [leads.id],
  }),
  room: one(rooms, {
    fields: [contracts.roomId],
    references: [rooms.id],
  }),
}));

// ============================================================================
// TENANT APPLICATIONS
// ============================================================================

export const tenantApplications = pgTable("tenant_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  propertyId: varchar("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  roomId: varchar("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  
  // Student information
  dateOfBirth: timestamp("date_of_birth"),
  nationality: text("nationality"),
  studentId: text("student_id"),
  
  // University details
  institution: text("institution"),
  course: text("course"),
  yearOfStudy: integer("year_of_study"),
  expectedGraduation: timestamp("expected_graduation"),
  
  // Guarantor details
  guarantorName: text("guarantor_name"),
  guarantorEmail: text("guarantor_email"),
  guarantorPhone: text("guarantor_phone"),
  guarantorAddress: text("guarantor_address"),
  guarantorRelationship: text("guarantor_relationship"),
  
  // Status
  status: varchar("status", { length: 20 }).default("draft"), // "draft", "submitted", "approved", "rejected"
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  submittedAt: timestamp("submitted_at"),
});

export const insertTenantApplicationSchema = createInsertSchema(tenantApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTenantApplication = z.infer<typeof insertTenantApplicationSchema>;
export type TenantApplication = typeof tenantApplications.$inferSelect;

// ============================================================================
// APPLICATION DOCUMENTS
// ============================================================================

export const applicationDocuments = pgTable("application_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => tenantApplications.id, { onDelete: "cascade" }),
  
  // Document details
  documentType: varchar("document_type", { length: 50 }).notNull(), // "photo_id", "proof_of_enrollment", "guarantor_letter"
  fileUrl: text("file_url").notNull(), // Object storage URL
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"), // Size in bytes
  mimeType: text("mime_type"),
  
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertApplicationDocumentSchema = createInsertSchema(applicationDocuments).omit({
  id: true,
  uploadedAt: true,
});

export type InsertApplicationDocument = z.infer<typeof insertApplicationDocumentSchema>;
export type ApplicationDocument = typeof applicationDocuments.$inferSelect;

// ============================================================================
// APPLICATION RELATIONS
// ============================================================================

export const tenantApplicationsRelations = relations(tenantApplications, ({ one, many }) => ({
  lead: one(leads, {
    fields: [tenantApplications.leadId],
    references: [leads.id],
  }),
  property: one(properties, {
    fields: [tenantApplications.propertyId],
    references: [properties.id],
  }),
  room: one(rooms, {
    fields: [tenantApplications.roomId],
    references: [rooms.id],
  }),
  documents: many(applicationDocuments),
}));

export const applicationDocumentsRelations = relations(applicationDocuments, ({ one }) => ({
  application: one(tenantApplications, {
    fields: [applicationDocuments.applicationId],
    references: [tenantApplications.id],
  }),
}));

// ============================================================================
// AI CALL LOGS (JustCall Integration)
// ============================================================================

export const callLogs = pgTable("call_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  landlordId: varchar("landlord_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  leadId: varchar("lead_id").references(() => leads.id, { onDelete: "set null" }),
  conversationId: varchar("conversation_id").references(() => conversations.id, { onDelete: "set null" }),
  
  // Call metadata
  callId: text("call_id").notNull(), // JustCall call_id
  callSid: text("call_sid"), // JustCall call_sid
  callerNumber: text("caller_number").notNull(),
  clientNumber: text("client_number"), // Property contact number
  callDuration: integer("call_duration"), // seconds
  callTimestamp: timestamp("call_timestamp").defaultNow(),
  
  // AI Performance Metrics
  callScore: integer("call_score"), // 0-100 score from JustCall AI
  customerSentiment: varchar("customer_sentiment", { length: 50 }), // "positive", "neutral", "negative"
  
  // AI Insights
  callSummary: text("call_summary"),
  actionItems: text("action_items"),
  callTranscription: jsonb("call_transcription"), // Array of {speaker_id, sentence}
  
  // Staff Review
  staffReviewed: boolean("staff_reviewed").default(false),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  
  // Lead Updates Applied
  leadInfoUpdated: boolean("lead_info_updated").default(false),
  updatedFields: jsonb("updated_fields"), // Track which fields were updated from this call
  
  // AI Sales Trainer Fields
  aiCoachSummary: text("ai_coach_summary"), // Overall coaching feedback from AI
  conversionOpportunities: jsonb("conversion_opportunities"), // [{opportunity: string, confidence: number, suggestion: string}]
  missedTalkingPoints: jsonb("missed_talking_points"), // [string]
  skillFocusAreas: jsonb("skill_focus_areas"), // [string]
  improvementScore: integer("improvement_score"), // Score delta vs baseline (0-100)
  viewingId: varchar("viewing_id").references(() => viewings.id, { onDelete: "set null" }), // Link to viewing if mentioned
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  // PERFORMANCE FIX: Index for landlord-scoped queries (Bug #6)
  // Enables fast filtering of call logs by landlord for AI Sales Trainer and weekly metrics
  index("call_logs_landlord_id_idx").on(table.landlordId),
]);

export const insertCallLogSchema = createInsertSchema(callLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertCallLog = z.infer<typeof insertCallLogSchema>;
export type CallLog = typeof callLogs.$inferSelect;

// ============================================================================
// USAGE TRACKING & INVOICING
// ============================================================================

export const usageRecords = pgTable("usage_records", {
  id: serial("id").primaryKey(),
  landlordId: varchar("landlord_id").notNull().references(() => users.id),
  serviceType: varchar("service_type").notNull(), // 'whatsapp', 'sms', 'openai', 'justcall'
  usageType: varchar("usage_type").notNull(), // 'message', 'api_call', 'call_minutes'
  quantity: integer("quantity").notNull().default(1),
  unitCost: decimal("unit_cost", { precision: 10, scale: 4 }).notNull(), // Cost per unit in GBP
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(), // Total cost in GBP
  metadata: jsonb("metadata"), // Additional details (e.g., phone number, model, duration)
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
});

export const insertUsageRecordSchema = createInsertSchema(usageRecords).omit({
  id: true,
  recordedAt: true,
});

export type UsageRecord = typeof usageRecords.$inferSelect;
export type InsertUsageRecord = z.infer<typeof insertUsageRecordSchema>;

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  landlordId: varchar("landlord_id").notNull().references(() => users.id),
  invoiceNumber: varchar("invoice_number").notNull().unique(),
  billingPeriodStart: timestamp("billing_period_start").notNull(),
  billingPeriodEnd: timestamp("billing_period_end").notNull(),
  subscriptionFee: decimal("subscription_fee", { precision: 10, scale: 2 }).notNull(),
  passThroughCosts: decimal("pass_through_costs", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").notNull().default('draft'), // 'draft', 'sent', 'paid', 'overdue'
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  stripeInvoiceId: varchar("stripe_invoice_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

// ============================================================================
// BLOG POSTS (SEO Content Marketing)
// ============================================================================

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // SEO fields
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  metaDescription: varchar("meta_description", { length: 160 }).notNull(),
  keywords: text("keywords").notNull(),
  
  // Content
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImageUrl: varchar("cover_image_url", { length: 1000 }),
  
  // Author
  authorId: varchar("author_id").references(() => users.id),
  authorName: varchar("author_name", { length: 255 }).notNull().default("TermFlow Team"),
  
  // Categories & tags
  category: varchar("category", { length: 100 }).notNull(),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  
  // Publishing
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  
  // Engagement metrics
  viewCount: integer("view_count").notNull().default(0),
  
  // Reading time (auto-calculated)
  readingTimeMinutes: integer("reading_time_minutes").notNull().default(5),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("blog_posts_slug_idx").on(table.slug),
  index("blog_posts_status_idx").on(table.status),
  index("blog_posts_published_at_idx").on(table.publishedAt),
  index("blog_posts_category_idx").on(table.category),
]);

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Call Logs Relations
export const callLogsRelations = relations(callLogs, ({ one }) => ({
  landlord: one(users, {
    fields: [callLogs.landlordId],
    references: [users.id],
  }),
  lead: one(leads, {
    fields: [callLogs.leadId],
    references: [leads.id],
  }),
  conversation: one(conversations, {
    fields: [callLogs.conversationId],
    references: [conversations.id],
  }),
}));

export const emailEventsRelations = relations(emailEvents, ({ one }) => ({
  triggeredBy: one(users, {
    fields: [emailEvents.triggeredByUserId],
    references: [users.id],
  }),
}));

export const approvalsRelations = relations(approvals, ({ one }) => ({
  lead: one(leads, {
    fields: [approvals.leadId],
    references: [leads.id],
  }),
  decidedByUser: one(users, {
    fields: [approvals.decidedBy],
    references: [users.id],
  }),
}));

// ============================================================================
// WHATSAPP MESSAGE TEMPLATES
// ============================================================================

export const whatsappTemplates = pgTable("whatsapp_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  landlordId: varchar("landlord_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Template identification
  templateKey: varchar("template_key", { length: 100 }).notNull(), // e.g., "welcome_message", "viewing_confirmation"
  name: varchar("name", { length: 255 }).notNull(), // Human-readable name
  description: text("description"), // What this template is used for
  
  // Template content
  content: text("content").notNull(), // Message with {{variables}}
  variables: text("variables").array(), // ["studentName", "propertyName", "viewingDate"]
  
  // Usage context
  category: varchar("category", { length: 50 }).notNull().default("general"), // "welcome", "viewing", "application", "retention", "follow_up"
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWhatsappTemplateSchema = createInsertSchema(whatsappTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type WhatsappTemplate = typeof whatsappTemplates.$inferSelect;
export type InsertWhatsappTemplate = z.infer<typeof insertWhatsappTemplateSchema>;

// ============================================================================
// AI CHATBOT ONBOARDING
// ============================================================================

// Main onboarding session tracking
export const onboardingSessionsNew = pgTable("onboarding_sessions_new", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  landlordId: varchar("landlord_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Progress tracking
  currentSection: varchar("current_section", { length: 100 }).notNull().default("company_info"), 
  // Sections: company_info, buildings, units, pricing, eligibility, deposits, contracts, operations, marketing, integrations, reporting, legal, golive
  completedSections: text("completed_sections").array().default([]),
  
  // Session state
  isComplete: boolean("is_complete").default(false),
  completedAt: timestamp("completed_at"),
  
  // Conversation metadata
  messageCount: integer("message_count").default(0),
  
  // Payment tracking (Stripe)
  paymentIntentId: varchar("payment_intent_id"),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"), // "pending", "processing", "succeeded", "failed"
  paymentCompletedAt: timestamp("payment_completed_at"),
  
  // Delegation tracking
  hasDelegatedTasks: boolean("has_delegated_tasks").default(false),
  allTasksCompleted: boolean("all_tasks_completed").default(false),
  
  // Website & Integration Data
  websiteUrls: text("website_urls").array().default([]), // Company website URLs for scraping
  scrapedWebsiteData: jsonb("scraped_website_data"), // { url, title, description, content, images, etc. }
  websiteScrapedAt: timestamp("website_scraped_at"),
  
  // IT/Hosting Contact (for code integration)
  itContactName: varchar("it_contact_name", { length: 255 }),
  itContactEmail: varchar("it_contact_email", { length: 255 }),
  itContactPhone: varchar("it_contact_phone", { length: 50 }),
  itContactCompany: varchar("it_contact_company", { length: 255 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Q&A pairs by section
export const onboardingSectionResponses = pgTable("onboarding_section_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => onboardingSessionsNew.id, { onDelete: "cascade" }),
  
  section: varchar("section", { length: 100 }).notNull(),
  questionKey: varchar("question_key", { length: 200 }).notNull(), // e.g., "company_name", "building_address"
  question: text("question").notNull(), // What the AI asked
  answer: text("answer").notNull(), // User's response
  
  createdAt: timestamp("created_at").defaultNow(),
});

// File uploads during onboarding
export const onboardingAttachments = pgTable("onboarding_attachments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => onboardingSessionsNew.id, { onDelete: "cascade" }),
  
  section: varchar("section", { length: 100 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(), // "contract", "floorplan", "photo", "logo", "certificate"
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 1000 }).notNull(),
  fileSize: integer("file_size"), // bytes
  
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Structured landlord profile (summary of onboarding)
export const landlordProfiles = pgTable("landlord_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  landlordId: varchar("landlord_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id").references(() => onboardingSessionsNew.id),
  
  // Company info
  companyName: varchar("company_name", { length: 255 }),
  legalName: varchar("legal_name", { length: 255 }),
  registrationNumber: varchar("registration_number", { length: 100 }),
  operatingCities: text("operating_cities").array(),
  
  // Contacts
  primaryContactName: varchar("primary_contact_name", { length: 255 }),
  primaryContactEmail: varchar("primary_contact_email", { length: 255 }),
  primaryContactPhone: varchar("primary_contact_phone", { length: 50 }),
  supportEmail: varchar("support_email", { length: 255 }),
  
  // Branding
  logoUrl: varchar("logo_url", { length: 1000 }),
  brandColors: jsonb("brand_colors"), // {primary: "#...", secondary: "#..."}
  
  // Full onboarding data (JSON backup)
  fullData: jsonb("full_data"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOnboardingSessionSchema = createInsertSchema(onboardingSessionsNew).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSectionResponseSchema = createInsertSchema(onboardingSectionResponses).omit({
  id: true,
  createdAt: true,
});

export const insertAttachmentSchema = createInsertSchema(onboardingAttachments).omit({
  id: true,
  uploadedAt: true,
});

export const insertLandlordProfileSchema = createInsertSchema(landlordProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type OnboardingSessionNew = typeof onboardingSessionsNew.$inferSelect;
export type InsertOnboardingSessionNew = z.infer<typeof insertOnboardingSessionSchema>;
export type SectionResponse = typeof onboardingSectionResponses.$inferSelect;
export type InsertSectionResponse = z.infer<typeof insertSectionResponseSchema>;
export type OnboardingAttachment = typeof onboardingAttachments.$inferSelect;
export type InsertOnboardingAttachment = z.infer<typeof insertAttachmentSchema>;
export type LandlordProfile = typeof landlordProfiles.$inferSelect;
export type InsertLandlordProfile = z.infer<typeof insertLandlordProfileSchema>;

// ============================================================================
// MOVE-IN COORDINATION
// ============================================================================

export const moveInCoordination = pgTable(
  "move_in_coordination",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    
    // References
    leadId: varchar("lead_id").notNull().unique().references(() => leads.id, { onDelete: "cascade" }),
    landlordId: varchar("landlord_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    contractId: varchar("contract_id").references(() => contracts.id, { onDelete: "set null" }),
    propertyId: varchar("property_id").references(() => properties.id, { onDelete: "set null" }),
    roomId: varchar("room_id").references(() => rooms.id, { onDelete: "set null" }),
    
    // Move-in details
    moveInDate: timestamp("move_in_date").notNull(),
    keyCollectionMethod: varchar("key_collection_method", { length: 50 }).notNull().default("office"), // 'office', 'lockbox', 'agent'
    keyCollectionDetails: text("key_collection_details"), // Location, code, agent contact
    keyCollectionTime: varchar("key_collection_time", { length: 50 }), // e.g., "09:00-17:00"
    
    // Status tracking
    checklistSent: boolean("checklist_sent").default(false),
    checklistSentAt: timestamp("checklist_sent_at"),
    welcomePackSent: boolean("welcome_pack_sent").default(false),
    welcomePackSentAt: timestamp("welcome_pack_sent_at"),
    keyDetailsSet: boolean("key_details_sent").default(false),
    keyDetailsSentAt: timestamp("key_details_sent_at"),
    inventorySent: boolean("inventory_sent").default(false),
    inventorySentAt: timestamp("inventory_sent_at"),
    inventoryCompleted: boolean("inventory_completed").default(false),
    inventoryCompletedAt: timestamp("inventory_completed_at"),
    moveInCompleted: boolean("move_in_completed").default(false),
    moveInCompletedAt: timestamp("move_in_completed_at"),
    
    // Checklist tracking (JSON array of checklist items with completion status)
    checklistItems: jsonb("checklist_items").default([]), // [{task, completed, dueDate}]
    
    // Welcome pack URL
    welcomePackUrl: text("welcome_pack_url"),
    
    // Notes and feedback
    notes: text("notes"),
    tenantFeedback: text("tenant_feedback"),
    feedbackRating: integer("feedback_rating"), // 1-5 stars
    
    // Audit
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_move_in_lead").on(table.leadId),
    index("idx_move_in_landlord").on(table.landlordId),
    index("idx_move_in_date").on(table.moveInDate),
    index("idx_move_in_completed").on(table.moveInCompleted),
  ],
);

export const insertMoveInCoordinationSchema = createInsertSchema(moveInCoordination).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  keyCollectionMethod: z.enum(["office", "lockbox", "agent"]).optional(),
  feedbackRating: z.number().min(1).max(5).optional(),
  checklistItems: z.array(z.object({
    task: z.string(),
    completed: z.boolean(),
    dueDate: z.date().optional(),
  })).optional(),
});

export type InsertMoveInCoordination = z.infer<typeof insertMoveInCoordinationSchema>;
export type MoveInCoordination = typeof moveInCoordination.$inferSelect;

// ============================================================================
// AI SALES TRAINER - LEAD PROFILE INSIGHTS
// ============================================================================

export const leadProfileInsights = pgTable("lead_profile_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  callLogId: varchar("call_log_id").references(() => callLogs.id, { onDelete: "set null" }),
  
  // Source tracking
  source: varchar("source", { length: 50 }).notNull(), // 'call', 'whatsapp', 'email', 'webform'
  
  // Insight details
  insightType: varchar("insight_type", { length: 100 }).notNull(), // 'budget', 'preferences', 'move_in_date', 'nationality', 'university', 'course', etc
  insightValue: jsonb("insight_value").notNull(), // The extracted data (flexible structure)
  confidence: decimal("confidence", { precision: 3, scale: 2 }).notNull(), // 0-1 confidence score
  
  // Application status
  appliedToProfile: boolean("applied_to_profile").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadProfileInsightSchema = createInsertSchema(leadProfileInsights).omit({
  id: true,
  createdAt: true,
});

export type LeadProfileInsight = typeof leadProfileInsights.$inferSelect;
export type InsertLeadProfileInsight = z.infer<typeof insertLeadProfileInsightSchema>;

// ============================================================================
// AI SALES TRAINER - LEARNING METRICS
// ============================================================================

export const aiLearningMetrics = pgTable("ai_learning_metrics", {
  id: serial("id").primaryKey(),
  landlordId: varchar("landlord_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Metric details
  metricType: varchar("metric_type", { length: 100 }).notNull(), // 'avg_call_score', 'conversion_rate', 'profile_coverage', etc
  
  // Time period
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  // Values
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  previousValue: decimal("previous_value", { precision: 10, scale: 2 }),
  
  // Trend analysis
  trend: varchar("trend", { length: 20 }), // 'improving', 'declining', 'stable'
  dataPoints: integer("data_points").notNull(), // Number of calls/data used for this metric
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAILearningMetricSchema = createInsertSchema(aiLearningMetrics).omit({
  id: true,
  createdAt: true,
});

export type AILearningMetric = typeof aiLearningMetrics.$inferSelect;
export type InsertAILearningMetric = z.infer<typeof insertAILearningMetricSchema>;

// AI Sales Trainer Relations
export const leadProfileInsightsRelations = relations(leadProfileInsights, ({ one }) => ({
  lead: one(leads, {
    fields: [leadProfileInsights.leadId],
    references: [leads.id],
  }),
  callLog: one(callLogs, {
    fields: [leadProfileInsights.callLogId],
    references: [callLogs.id],
  }),
}));

export const aiLearningMetricsRelations = relations(aiLearningMetrics, ({ one }) => ({
  landlord: one(users, {
    fields: [aiLearningMetrics.landlordId],
    references: [users.id],
  }),
}));

// ============================================================================
// ENHANCED ONBOARDING - CONTRACT DYNAMIC SECTIONS
// ============================================================================

export const contractDynamicSections = pgTable("contract_dynamic_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => onboardingSessionsNew.id, { onDelete: "cascade" }),
  contractAttachmentId: varchar("contract_attachment_id").references(() => onboardingAttachments.id, { onDelete: "cascade" }),
  
  // Section identification
  sectionName: varchar("section_name", { length: 255 }).notNull(), // e.g., "Tenant Name", "Property Address", "Rent Amount"
  sectionKey: varchar("section_key", { length: 100 }).notNull(), // e.g., "tenant_name", "property_address"
  sectionType: varchar("section_type", { length: 50 }).notNull(), // "text", "date", "currency", "address"
  
  // Position in contract (for highlighting/replacement)
  pageNumber: integer("page_number"),
  coordinates: jsonb("coordinates"), // {x, y, width, height} for PDF highlighting
  
  // Sample/placeholder text
  placeholderText: text("placeholder_text"), // What currently appears in template
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContractDynamicSectionSchema = createInsertSchema(contractDynamicSections).omit({
  id: true,
  createdAt: true,
});

export type ContractDynamicSection = typeof contractDynamicSections.$inferSelect;
export type InsertContractDynamicSection = z.infer<typeof insertContractDynamicSectionSchema>;

// ============================================================================
// ENHANCED ONBOARDING - FLOOR PLAN ZONES
// ============================================================================

export const onboardingFloorPlanZones = pgTable("onboarding_floor_plan_zones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => onboardingSessionsNew.id, { onDelete: "cascade" }),
  floorPlanAttachmentId: varchar("floor_plan_attachment_id").references(() => onboardingAttachments.id, { onDelete: "cascade" }),
  
  // Zone details
  zoneName: varchar("zone_name", { length: 255 }).notNull(), // e.g., "Room 101", "Studio A"
  roomType: varchar("room_type", { length: 100 }), // "single", "ensuite", "studio"
  
  // Coordinates (percentage-based for responsive display)
  coordinates: jsonb("coordinates").notNull(), // {x, y, width, height} in percentages
  
  // Linked room (if already created)
  linkedRoomId: varchar("linked_room_id").references(() => rooms.id, { onDelete: "set null" }),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOnboardingFloorPlanZoneSchema = createInsertSchema(onboardingFloorPlanZones).omit({
  id: true,
  createdAt: true,
});

export type OnboardingFloorPlanZone = typeof onboardingFloorPlanZones.$inferSelect;
export type InsertOnboardingFloorPlanZone = z.infer<typeof insertOnboardingFloorPlanZoneSchema>;

// ============================================================================
// ENHANCED ONBOARDING - TASK DELEGATION
// ============================================================================

export const onboardingTaskDelegations = pgTable("onboarding_task_delegations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => onboardingSessionsNew.id, { onDelete: "cascade" }),
  landlordId: varchar("landlord_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Delegation details
  taskType: varchar("task_type", { length: 100 }).notNull(), // "contract_mapping", "floor_plan_mapping", "property_details", etc.
  taskSection: varchar("task_section", { length: 100 }).notNull(), // The onboarding section being delegated
  taskDescription: text("task_description").notNull(),
  
  // Delegated to
  delegatedToEmail: varchar("delegated_to_email", { length: 255 }).notNull(),
  delegatedToName: varchar("delegated_to_name", { length: 255 }),
  
  // Status tracking
  status: varchar("status", { length: 50 }).notNull().default("pending"), // "pending", "in_progress", "completed"
  completedAt: timestamp("completed_at"),
  completedBy: varchar("completed_by", { length: 255 }), // Email of person who completed it
  
  // Access token for delegated staff (secure link)
  accessToken: varchar("access_token", { length: 100 }).unique(),
  accessTokenExpiry: timestamp("access_token_expiry"),
  
  // Email tracking
  inviteEmailSent: boolean("invite_email_sent").default(false),
  completionEmailSent: boolean("completion_email_sent").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOnboardingTaskDelegationSchema = createInsertSchema(onboardingTaskDelegations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type OnboardingTaskDelegation = typeof onboardingTaskDelegations.$inferSelect;
export type InsertOnboardingTaskDelegation = z.infer<typeof insertOnboardingTaskDelegationSchema>;

// ============================================================================
// RIGHT TO RENT CHECKS (UK Legal Requirement)
// ============================================================================

export const rightToRentChecks = pgTable("right_to_rent_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  
  // Check status and type
  status: varchar("status", { length: 50 }).notNull().default("pending"), // "pending", "reviewing", "approved", "rejected", "expired"
  checkType: varchar("check_type", { length: 50 }).notNull().default("document"), // "manual", "share_code", "document"
  
  // Document storage
  documents: jsonb("documents").default([]), // Array of {type: string, fileUrl: string, uploadedAt: Date}
  
  // Share code verification (for digital RTR)
  shareCode: varchar("share_code", { length: 100 }),
  shareCodeDateOfBirth: varchar("share_code_date_of_birth", { length: 20 }), // Format: DD/MM/YYYY
  shareCodeVerificationResult: jsonb("share_code_verification_result"), // Store Home Office API response (simulated)
  
  // Document type tracking (UK specific)
  documentCategory: varchar("document_category", { length: 50 }), // "list_a" (permanent), "list_b" (time-limited)
  
  // Manual review details
  reviewedBy: varchar("reviewed_by").references(() => users.id, { onDelete: "set null" }), // Staff member who reviewed
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  rejectionReason: text("rejection_reason"),
  
  // Expiry tracking (for time-limited permissions)
  expiryDate: timestamp("expiry_date"), // When RTR expires (for List B documents)
  expiryReminderSent: boolean("expiry_reminder_sent").default(false),
  
  // Upload tracking
  uploadUrl: text("upload_url"), // Temporary upload URL for documents
  uploadExpiresAt: timestamp("upload_expires_at"),
  
  // Compliance audit trail
  checkInitiatedBy: varchar("check_initiated_by"), // "system" or user ID
  remindersSent: integer("reminders_sent").default(0),
  lastReminderAt: timestamp("last_reminder_at"),
  
  // Metadata
  tenantNationality: varchar("tenant_nationality", { length: 100 }),
  documentRetentionDate: timestamp("document_retention_date"), // When documents can be deleted (6 years after tenancy ends)
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_rtr_checks_lead_id").on(table.leadId),
  index("idx_rtr_checks_status").on(table.status),
  index("idx_rtr_checks_expiry").on(table.expiryDate),
]);

export const insertRightToRentCheckSchema = createInsertSchema(rightToRentChecks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type RightToRentCheck = typeof rightToRentChecks.$inferSelect;
export type InsertRightToRentCheck = z.infer<typeof insertRightToRentCheckSchema>;

// ============================================================================
// ENHANCED ONBOARDING - PAYMENT & COMPLETION
// ============================================================================

// Add to onboardingSessionsNew (we'll update this with edit)
// New fields needed:
// - paymentIntentId: varchar("payment_intent_id")
// - paymentStatus: varchar("payment_status") // "pending", "succeeded", "failed"
// - paymentCompletedAt: timestamp("payment_completed_at")
// - hasDelegatedTasks: boolean("has_delegated_tasks").default(false)
// - allTasksCompleted: boolean("all_tasks_completed").default(false)
