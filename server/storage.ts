// Storage layer for AI lettings automation platform
import {
  users,
  properties,
  rooms,
  leads,
  conversations,
  messages,
  viewings,
  deposits,
  followUps,
  contracts,
  webhookLogs,
  webhookEvents,
  tenantApplications,
  applicationDocuments,
  viewingPreferences,
  contractTemplates,
  callLogs,
  featureFlags,
  type User,
  type UpsertUser,
  type Property,
  type InsertProperty,
  type Room,
  type InsertRoom,
  type Lead,
  type InsertLead,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Viewing,
  type InsertViewing,
  type Deposit,
  type InsertDeposit,
  type FollowUp,
  type InsertFollowUp,
  type Contract,
  type InsertContract,
  type WebhookLog,
  type InsertWebhookLog,
  type WebhookEvent,
  type InsertWebhookEvent,
  type TenantApplication,
  type InsertTenantApplication,
  type ApplicationDocument,
  type InsertApplicationDocument,
  type ViewingPreferences,
  type InsertViewingPreferences,
  type ContractTemplate,
  type InsertContractTemplate,
  type CallLog,
  type InsertCallLog,
  type FeatureFlag,
  type InsertFeatureFlag,
  leadProfileInsights,
  aiLearningMetrics,
  type LeadProfileInsight,
  type InsertLeadProfileInsight,
  type AILearningMetric,
  type InsertAILearningMetric,
  onboardingSessionsNew,
  onboardingSectionResponses,
  onboardingAttachments,
  landlordProfiles,
  contractDynamicSections,
  onboardingFloorPlanZones,
  onboardingTaskDelegations,
  type OnboardingSessionNew,
  type InsertOnboardingSessionNew,
  type SectionResponse,
  type InsertSectionResponse,
  type OnboardingAttachment,
  type InsertOnboardingAttachment,
  type LandlordProfile,
  type InsertLandlordProfile,
  type ContractDynamicSection,
  type InsertContractDynamicSection,
  type OnboardingFloorPlanZone,
  type InsertOnboardingFloorPlanZone,
  type OnboardingTaskDelegation,
  type InsertOnboardingTaskDelegation,
  conversationStrategies,
  strategyAssignments,
  demoBookings,
  type DemoBooking,
  type InsertDemoBooking,
  strategyEvents,
  strategyPerformance,
  type ConversationStrategy,
  type InsertConversationStrategy,
  type StrategyAssignment,
  type InsertStrategyAssignment,
  type StrategyEvent,
  type InsertStrategyEvent,
  type StrategyPerformance,
  type InsertStrategyPerformance,
  blogPosts,
  type BlogPost,
  type InsertBlogPost,
  rightToRentChecks,
  type RightToRentCheck,
  type InsertRightToRentCheck,
  depositProtections,
  type DepositProtection,
  type InsertDepositProtection,
  depositProtectionReminders,
  type DepositProtectionReminder,
  moveInCoordination,
  type MoveInCoordination,
  type InsertMoveInCoordination,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, inArray, isNotNull, gte, lt, lte } from "drizzle-orm";
import { startOfWeek, subWeeks, startOfMonth, subMonths, startOfQuarter } from 'date-fns';
import { metrics } from "./metrics";

export interface IStorage {
  // ============================================================================
  // USER OPERATIONS (Custom Auth)
  // ============================================================================
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // ============================================================================
  // PROPERTY OPERATIONS
  // ============================================================================
  createProperty(property: InsertProperty): Promise<Property>;
  getProperty(id: string): Promise<Property | undefined>;
  getPropertiesByLandlord(landlordId: string): Promise<Property[]>;
  updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: string): Promise<void>;

  // ============================================================================
  // ROOM OPERATIONS
  // ============================================================================
  createRoom(room: InsertRoom): Promise<Room>;
  getRoom(id: string): Promise<Room | undefined>;
  getRoomsByProperty(propertyId: string): Promise<Room[]>;
  updateRoom(id: string, updates: Partial<InsertRoom>): Promise<Room>;
  deleteRoom(id: string): Promise<void>;

  // ============================================================================
  // LEAD OPERATIONS
  // ============================================================================
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: string): Promise<Lead | undefined>;
  getLeadsByProperty(propertyId: string): Promise<Lead[]>;
  getLeadsByLandlord(landlordId: string): Promise<Lead[]>;
  getLeadsByStage(stage: string): Promise<Lead[]>;
  findLeadByContact(email?: string, phone?: string, whatsappNumber?: string): Promise<Lead | undefined>;
  findLeadByPhone(phone: string): Promise<Lead | null>;
  updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead>;
  updateLeadStage(id: string, stage: string): Promise<Lead>;
  updateLeadLanguage(leadId: string, language: string): Promise<void>;

  // ============================================================================
  // CONVERSATION OPERATIONS
  // ============================================================================
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationsByLead(leadId: string): Promise<Conversation[]>;
  findConversationByChannel(leadId: string, channel: string): Promise<Conversation | undefined>;
  updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation>;

  // ============================================================================
  // MESSAGE OPERATIONS
  // ============================================================================
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByConversation(conversationId: string, limit?: number): Promise<Message[]>;

  // ============================================================================
  // VIEWING OPERATIONS
  // ============================================================================
  createViewing(viewing: InsertViewing): Promise<Viewing>;
  getViewing(id: string): Promise<Viewing | undefined>;
  getViewingsByLead(leadId: string): Promise<Viewing[]>;
  getUpcomingViewings(landlordId: string, propertyId?: string): Promise<Viewing[]>;
  updateViewing(id: string, updates: Partial<InsertViewing>): Promise<Viewing>;

  // ============================================================================
  // DEPOSIT OPERATIONS
  // ============================================================================
  createDeposit(deposit: InsertDeposit): Promise<Deposit>;
  getDeposit(id: string): Promise<Deposit | undefined>;
  getDepositByLead(leadId: string): Promise<Deposit | undefined>;
  updateDeposit(id: string, updates: Partial<InsertDeposit>): Promise<Deposit>;

  // ============================================================================
  // CONTRACT OPERATIONS
  // ============================================================================
  createContract(contract: InsertContract): Promise<Contract>;
  getContract(id: string): Promise<Contract | undefined>;
  getContractsByLead(leadId: string): Promise<Contract[]>;
  getContractsByLandlord(landlordId: string): Promise<Contract[]>;
  updateContract(id: string, updates: Partial<InsertContract>): Promise<Contract>;
  updateContractDocument(contractId: string, contractUrl: string): Promise<Contract>;
  getContractByLead(leadId: string): Promise<Contract | undefined>;
  getContractByEnvelopeId(envelopeId: string): Promise<Contract | undefined>;

  // RTR Sequence Management
  approveApplication(contractId: string, landlordId: string): Promise<Contract>;
  updateRightToRentStatus(contractId: string, status: string, checkerId: string, documentUrl?: string): Promise<Contract>;
  chargeDeposit(contractId: string, stripePaymentIntentId: string): Promise<Contract>;
  recordTenantSignature(contractId: string): Promise<Contract>;
  recordLandlordSignature(contractId: string, landlordId: string): Promise<Contract>;
  getContractSequenceStatus(contractId: string): Promise<{
    canApprove: boolean;
    canCheckRTR: boolean;
    canChargeDeposit: boolean;
    canTenantSign: boolean;
    canLandlordSign: boolean;
    currentStep: string;
    nextStep: string;
    blockers: string[];
  }>;

  // Deposit Protection Management (UK Housing Act 2004 Compliance)
  markDepositProtected(
    contractId: string, 
    scheme: string, 
    certificateNumber: string, 
    protectionDate: Date
  ): Promise<Contract>;
  
  getDepositProtectionStatus(contractId: string): Promise<{
    isProtected: boolean;
    daysRemaining: number | null;
    isOverdue: boolean;
    deadline: Date | null;
    remindersSent: number;
  }>;
  
  getContractsNeedingProtectionReminders(): Promise<any[]>;
  updateDepositReminderTracking(contractId: string, dayNumber: number): Promise<Contract>;

  // ============================================================================
  // FOLLOW-UP OPERATIONS
  // ============================================================================
  createFollowUp(followUp: InsertFollowUp): Promise<FollowUp>;
  getFollowUpsByLead(leadId: string): Promise<FollowUp[]>;
  getLatestFollowUp(leadId: string): Promise<FollowUp | undefined>;
  markFollowUpResponded(id: string): Promise<FollowUp>;

  // ============================================================================
  // WEBHOOK LOG OPERATIONS
  // ============================================================================
  createWebhookLog(log: InsertWebhookLog): Promise<WebhookLog>;
  getUnprocessedWebhookLogs(): Promise<WebhookLog[]>;
  markWebhookLogProcessed(id: string): Promise<void>;

  // ============================================================================
  // TENANT APPLICATION OPERATIONS
  // ============================================================================
  createApplication(application: InsertTenantApplication): Promise<TenantApplication>;
  getApplication(id: string): Promise<TenantApplication | undefined>;
  getApplicationByLead(leadId: string): Promise<TenantApplication | undefined>;
  updateApplication(id: string, updates: Partial<InsertTenantApplication>): Promise<TenantApplication>;

  // ============================================================================
  // APPLICATION DOCUMENT OPERATIONS
  // ============================================================================
  createApplicationDocument(document: InsertApplicationDocument): Promise<ApplicationDocument>;
  getApplicationDocuments(applicationId: string): Promise<ApplicationDocument[]>;

  // ============================================================================
  // VIEWING PREFERENCES OPERATIONS
  // ============================================================================
  createViewingPreferences(preferences: InsertViewingPreferences): Promise<ViewingPreferences>;
  getViewingPreferences(id: string): Promise<ViewingPreferences | undefined>;
  getViewingPreferencesByLandlord(landlordId: string): Promise<ViewingPreferences | undefined>;
  updateViewingPreferences(id: string, updates: Partial<InsertViewingPreferences>): Promise<ViewingPreferences>;

  // ============================================================================
  // CONTRACT TEMPLATE OPERATIONS
  // ============================================================================
  createContractTemplate(template: InsertContractTemplate): Promise<ContractTemplate>;
  getContractTemplate(id: string): Promise<ContractTemplate | undefined>;
  getContractTemplatesByLandlord(landlordId: string): Promise<ContractTemplate[]>;
  updateContractTemplate(id: string, updates: Partial<InsertContractTemplate>): Promise<ContractTemplate>;
  deleteContractTemplate(id: string): Promise<void>;

  // ============================================================================
  // CALL LOG OPERATIONS
  // ============================================================================
  createCallLog(callLog: InsertCallLog): Promise<CallLog>;
  getCallLog(id: string): Promise<CallLog | undefined>;
  getCallLogsByLandlord(landlordId: string): Promise<CallLog[]>;
  updateCallLog(id: string, updates: Partial<InsertCallLog>): Promise<CallLog>;
  markCallReviewed(id: string, reviewNotes?: string): Promise<CallLog>;
  
  // AI Sales Trainer methods
  getCallLogWithAnalysis(id: string): Promise<CallLog | undefined>;
  saveAICoachingInsights(callLogId: string, insights: any): Promise<CallLog>;
  linkCallToViewing(callLogId: string, viewingId: string): Promise<CallLog>;
  
  // ============================================================================
  // LEAD PROFILE INSIGHTS OPERATIONS
  // ============================================================================
  saveProfileInsight(insight: any): Promise<any>;
  getProfileInsightsByLead(leadId: string): Promise<any[]>;
  markInsightAsApplied(insightId: string): Promise<void>;
  
  // ============================================================================
  // AI LEARNING METRICS OPERATIONS
  // ============================================================================
  getLearningMetrics(landlordId: string, period: string): Promise<any[]>;
  saveLearningMetric(metric: any): Promise<any>;

  // ============================================================================
  // WEBHOOK EVENT OPERATIONS (Idempotent Processing)
  // ============================================================================
  recordWebhookEvent(data: {
    provider: string;
    eventId: string;
    eventType: string;
    rawPayload: any;
    headers?: any;
    landlordId?: string;
    relatedContractId?: string;
    relatedLeadId?: string;
  }): Promise<{ event: any; isNew: boolean }>;
  
  markWebhookProcessed(eventId: number): Promise<void>;
  markWebhookFailed(eventId: number, error: string): Promise<void>;
  getWebhookEvent(id: number): Promise<any | undefined>;
  getWebhookEvents(filters?: { provider?: string; status?: string; limit?: number }): Promise<any[]>;
  retryFailedWebhooks(): Promise<any[]>;

  // ============================================================================
  // FEATURE FLAG OPERATIONS
  // ============================================================================
  getFeatureFlag(landlordId: string, featureKey: string): Promise<boolean>;
  getAllFeatureFlags(landlordId: string): Promise<FeatureFlag[]>;
  setFeatureFlag(
    landlordId: string,
    featureKey: string,
    enabled: boolean,
    setBy: string
  ): Promise<FeatureFlag>;
  isFeatureEnabled(landlordId: string, featureKey: string): Promise<boolean>;

  // ============================================================================
  // AI CHATBOT ONBOARDING OPERATIONS
  // ============================================================================
  createOnboardingSession(session: InsertOnboardingSessionNew): Promise<OnboardingSessionNew>;
  getOnboardingSession(id: string): Promise<OnboardingSessionNew | undefined>;
  getOnboardingSessionByLandlord(landlordId: string): Promise<OnboardingSessionNew | undefined>;
  updateOnboardingSession(id: string, updates: Partial<InsertOnboardingSessionNew>): Promise<OnboardingSessionNew>;
  
  createSectionResponse(response: InsertSectionResponse): Promise<SectionResponse>;
  getSectionResponses(sessionId: string): Promise<SectionResponse[]>;
  getSectionResponsesBySection(sessionId: string, section: string): Promise<SectionResponse[]>;
  
  createOnboardingAttachment(attachment: InsertOnboardingAttachment): Promise<OnboardingAttachment>;
  getOnboardingAttachments(sessionId: string): Promise<OnboardingAttachment[]>;
  
  createLandlordProfile(profile: InsertLandlordProfile): Promise<LandlordProfile>;
  getLandlordProfile(landlordId: string): Promise<LandlordProfile | undefined>;
  updateLandlordProfile(landlordId: string, updates: Partial<InsertLandlordProfile>): Promise<LandlordProfile>;

  // ============================================================================
  // CONTRACT DYNAMIC SECTIONS OPERATIONS
  // ============================================================================
  saveContractDynamicSections(sessionId: string, sections: InsertContractDynamicSection[]): Promise<void>;
  getContractDynamicSections(sessionId: string): Promise<ContractDynamicSection[]>;

  // ============================================================================
  // FLOOR PLAN ZONES OPERATIONS
  // ============================================================================
  saveFloorPlanZones(sessionId: string, zones: InsertOnboardingFloorPlanZone[]): Promise<void>;
  getFloorPlanZones(sessionId: string): Promise<OnboardingFloorPlanZone[]>;

  // ============================================================================
  // TASK DELEGATION OPERATIONS
  // ============================================================================
  createTaskDelegation(delegation: InsertOnboardingTaskDelegation): Promise<OnboardingTaskDelegation>;
  getTaskDelegations(sessionId: string): Promise<OnboardingTaskDelegation[]>;
  getTaskDelegationById(id: string): Promise<OnboardingTaskDelegation | null>;
  getTaskDelegationByToken(accessToken: string): Promise<OnboardingTaskDelegation | null>;
  updateTaskDelegation(id: string, data: Partial<InsertOnboardingTaskDelegation>): Promise<void>;

  // ============================================================================
  // CONVERSATION STRATEGIES (A/B Testing)
  // ============================================================================
  createStrategy(strategy: InsertConversationStrategy): Promise<ConversationStrategy>;
  getStrategy(id: string): Promise<ConversationStrategy | undefined>;
  getAllStrategies(): Promise<ConversationStrategy[]>;
  getActiveStrategies(): Promise<ConversationStrategy[]>;
  updateStrategy(id: string, updates: Partial<InsertConversationStrategy>): Promise<ConversationStrategy>;
  
  assignStrategy(assignment: InsertStrategyAssignment): Promise<StrategyAssignment>;
  getStrategyAssignment(leadId: string): Promise<StrategyAssignment | undefined>;
  
  trackStrategyEvent(event: InsertStrategyEvent): Promise<StrategyEvent>;
  getStrategyEvents(leadId: string): Promise<StrategyEvent[]>;
  
  getStrategyPerformance(strategyId: string, periodStart: Date, periodEnd: Date): Promise<StrategyPerformance | undefined>;
  saveStrategyPerformance(performance: InsertStrategyPerformance): Promise<StrategyPerformance>;

  // ============================================================================
  // BLOG POST OPERATIONS (SEO Content)
  // ============================================================================
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost>;
  incrementBlogPostViews(id: string): Promise<void>;
  deleteBlogPost(id: string): Promise<void>;

  // ============================================================================
  // DEMO BOOKING OPERATIONS (Marketing - No Auth Required)
  // ============================================================================
  createDemoBooking(booking: InsertDemoBooking): Promise<DemoBooking>;
  getDemoBooking(id: string): Promise<DemoBooking | undefined>;
  getAllDemoBookings(): Promise<DemoBooking[]>;
  updateDemoBookingStatus(id: string, status: string): Promise<DemoBooking>;

  // ============================================================================
  // RIGHT TO RENT CHECK OPERATIONS (UK Legal Requirement)
  // ============================================================================
  createRightToRentCheck(check: InsertRightToRentCheck): Promise<RightToRentCheck>;
  getRightToRentCheck(id: string): Promise<RightToRentCheck | undefined>;
  getRightToRentCheckByLead(leadId: string): Promise<RightToRentCheck | undefined>;
  getRightToRentChecksByStatus(status: string, landlordId?: string): Promise<RightToRentCheck[]>;
  getRightToRentChecksExpiringSoon(beforeDate: Date): Promise<RightToRentCheck[]>;
  updateRightToRentCheck(id: string, updates: Partial<InsertRightToRentCheck>): Promise<RightToRentCheck>;

  // ============================================================================
  // DEPOSIT PROTECTION OPERATIONS (UK Housing Act 2004 Compliance)
  // ============================================================================
  createDepositProtection(protection: InsertDepositProtection): Promise<DepositProtection>;
  getDepositProtection(id: string): Promise<DepositProtection | undefined>;
  getDepositProtectionByLead(leadId: string): Promise<DepositProtection | undefined>;
  getDepositProtectionByRegistrationId(registrationId: string): Promise<DepositProtection | undefined>;
  getDepositProtectionsByLandlord(landlordId: string): Promise<DepositProtection[]>;
  getOverdueDepositProtections(): Promise<DepositProtection[]>;
  getDepositProtectionsNeedingReminders(): Promise<DepositProtection[]>;
  updateDepositProtection(id: string, updates: Partial<InsertDepositProtection>): Promise<DepositProtection>;
  
  // Deposit Protection Reminders
  createDepositProtectionReminder(reminder: {
    depositProtectionId: string;
    reminderType: string;
    scheduledFor: Date;
    status?: string;
  }): Promise<DepositProtectionReminder>;
  getPendingDepositProtectionReminders(): Promise<DepositProtectionReminder[]>;
  markDepositProtectionReminderSent(id: string): Promise<void>;
  
  // ============================================================================
  // MOVE-IN COORDINATION OPERATIONS
  // ============================================================================
  createMoveIn(moveIn: InsertMoveInCoordination): Promise<MoveInCoordination>;
  getMoveIn(id: string): Promise<MoveInCoordination | undefined>;
  getMoveInByLead(leadId: string): Promise<MoveInCoordination | undefined>;
  updateMoveIn(id: string, updates: Partial<InsertMoveInCoordination>): Promise<MoveInCoordination>;
  getUpcomingMoveIns(landlordId: string, days: number): Promise<MoveInCoordination[]>;
  getPendingMoveIns(): Promise<MoveInCoordination[]>;
}

export class DatabaseStorage implements IStorage {
  // ============================================================================
  // USER OPERATIONS
  // ============================================================================

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        email: userData.email?.toLowerCase(),
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // ============================================================================
  // PROPERTY OPERATIONS
  // ============================================================================

  async createProperty(property: InsertProperty): Promise<Property> {
    const [result] = await db.insert(properties).values(property).returning();
    return result;
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async getPropertiesByLandlord(landlordId: string): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.landlordId, landlordId));
  }

  async updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property> {
    const [property] = await db
      .update(properties)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return property;
  }

  async deleteProperty(id: string): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  // ============================================================================
  // ROOM OPERATIONS
  // ============================================================================

  async createRoom(room: InsertRoom): Promise<Room> {
    const [result] = await db.insert(rooms).values(room).returning();
    return result;
  }

  async getRoom(id: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room;
  }

  async getRoomsByProperty(propertyId: string): Promise<Room[]> {
    return await db.select().from(rooms).where(eq(rooms.propertyId, propertyId));
  }

  async updateRoom(id: string, updates: Partial<InsertRoom>): Promise<Room> {
    const [room] = await db
      .update(rooms)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(rooms.id, id))
      .returning();
    return room;
  }

  async deleteRoom(id: string): Promise<void> {
    await db.delete(rooms).where(eq(rooms.id, id));
  }

  // ============================================================================
  // LEAD OPERATIONS
  // ============================================================================

  async createLead(lead: InsertLead): Promise<Lead> {
    const [result] = await db.insert(leads).values(lead).returning();
    return result;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async getLeadsByProperty(propertyId: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.propertyId, propertyId));
  }

  async getLeadsByLandlord(landlordId: string): Promise<Lead[]> {
    const landlordProperties = await db
      .select({ id: properties.id })
      .from(properties)
      .where(eq(properties.landlordId, landlordId));
    
    const propertyIds = landlordProperties.map(p => p.id);
    
    if (propertyIds.length === 0) {
      return await db.select().from(leads).where(sql`${leads.propertyId} IS NULL`);
    }
    
    return await db
      .select()
      .from(leads)
      .where(
        or(
          inArray(leads.propertyId, propertyIds),
          sql`${leads.propertyId} IS NULL`
        )
      );
  }

  async getLeadsByStage(stage: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.stage, stage));
  }

  async findLeadByContact(email?: string, phone?: string, whatsappNumber?: string): Promise<Lead | undefined> {
    const conditions = [];
    if (email) conditions.push(eq(leads.email, email));
    if (phone) conditions.push(eq(leads.phone, phone));
    if (whatsappNumber) conditions.push(eq(leads.whatsappNumber, whatsappNumber));
    
    if (conditions.length === 0) return undefined;
    
    const [lead] = await db.select().from(leads).where(or(...conditions));
    return lead;
  }

  async findLeadByPhone(phone: string): Promise<Lead | null> {
    const normalized = phone.replace(/[^0-9+]/g, ''); // Remove spaces, dashes
    
    const [lead] = await db
      .select()
      .from(leads)
      .where(
        or(
          eq(leads.phone, phone),
          eq(leads.phone, normalized),
          eq(leads.whatsappNumber, phone),
          eq(leads.whatsappNumber, normalized)
        )
      )
      .limit(1);
      
    return lead || null;
  }

  async updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead> {
    const [lead] = await db
      .update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  async updateLeadStage(id: string, stage: string): Promise<Lead> {
    const [lead] = await db
      .update(leads)
      .set({ stage, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  async updateLeadLanguage(leadId: string, language: string): Promise<void> {
    await db
      .update(leads)
      .set({ preferredLanguage: language, updatedAt: new Date() })
      .where(eq(leads.id, leadId));
  }

  // ============================================================================
  // CONVERSATION OPERATIONS
  // ============================================================================

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [result] = await db.insert(conversations).values(conversation).returning();
    return result;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async getConversationsByLead(leadId: string): Promise<Conversation[]> {
    return await db.select().from(conversations).where(eq(conversations.leadId, leadId));
  }

  async findConversationByChannel(leadId: string, channel: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.leadId, leadId),
          eq(conversations.channel, channel)
        )
      );
    return conversation;
  }

  async updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation> {
    const [conversation] = await db
      .update(conversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return conversation;
  }

  // ============================================================================
  // MESSAGE OPERATIONS
  // ============================================================================

  async createMessage(message: InsertMessage): Promise<Message> {
    const [result] = await db.insert(messages).values(message).returning();
    return result;
  }

  async getMessagesByConversation(conversationId: string, limit: number = 100): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  // ============================================================================
  // VIEWING OPERATIONS
  // ============================================================================

  async createViewing(viewing: InsertViewing): Promise<Viewing> {
    const [result] = await db.insert(viewings).values(viewing).returning();
    return result;
  }

  async getViewing(id: string): Promise<Viewing | undefined> {
    const [viewing] = await db.select().from(viewings).where(eq(viewings.id, id));
    return viewing;
  }

  async getViewingsByLead(leadId: string): Promise<Viewing[]> {
    return await db.select().from(viewings).where(eq(viewings.leadId, leadId));
  }

  async getUpcomingViewings(landlordId: string, propertyId?: string): Promise<any[]> {
    const now = new Date();
    
    const conditions = [
      sql`${viewings.scheduledAt} > ${now}`,
      eq(viewings.status, 'scheduled'),
      eq(properties.landlordId, landlordId) // CRITICAL: Filter by landlord to prevent data leakage
    ];
    
    if (propertyId) {
      conditions.push(eq(viewings.propertyId, propertyId));
    }
    
    return await db
      .select({
        id: viewings.id,
        leadId: viewings.leadId,
        propertyId: viewings.propertyId,
        viewingType: viewings.viewingType,
        scheduledAt: viewings.scheduledAt,
        duration: viewings.duration,
        status: viewings.status,
        googleCalendarEventId: viewings.googleCalendarEventId,
        googleMeetLink: viewings.googleMeetLink,
        outcome: viewings.outcome,
        outcomeReason: viewings.outcomeReason,
        attended: viewings.attended,
        feedbackNotes: viewings.feedbackNotes,
        createdAt: viewings.createdAt,
        updatedAt: viewings.updatedAt,
        
        leadName: leads.name,
        leadEmail: leads.email,
        leadPhone: leads.phone,
        leadWhatsappNumber: leads.whatsappNumber,
        leadUniversityName: leads.universityName,
        leadCourseName: leads.courseName,
        leadSource: leads.source,
        leadTags: leads.tags,
        leadNotes: leads.notes,
        
        propertyName: properties.name,
      })
      .from(viewings)
      .leftJoin(leads, eq(viewings.leadId, leads.id))
      .innerJoin(properties, eq(viewings.propertyId, properties.id)) // Changed to innerJoin to ensure property exists
      .where(and(...conditions))
      .orderBy(viewings.scheduledAt);
  }

  async updateViewing(id: string, updates: Partial<InsertViewing>): Promise<Viewing> {
    const [viewing] = await db
      .update(viewings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(viewings.id, id))
      .returning();
    return viewing;
  }

  // ============================================================================
  // DEPOSIT OPERATIONS
  // ============================================================================

  async createDeposit(deposit: InsertDeposit): Promise<Deposit> {
    const [result] = await db.insert(deposits).values(deposit).returning();
    return result;
  }

  async getDeposit(id: string): Promise<Deposit | undefined> {
    const [deposit] = await db.select().from(deposits).where(eq(deposits.id, id));
    return deposit;
  }

  async getDepositByLead(leadId: string): Promise<Deposit | undefined> {
    const [deposit] = await db.select().from(deposits).where(eq(deposits.leadId, leadId));
    return deposit;
  }

  async updateDeposit(id: string, updates: Partial<InsertDeposit>): Promise<Deposit> {
    const [deposit] = await db
      .update(deposits)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(deposits.id, id))
      .returning();
    return deposit;
  }

  // ============================================================================
  // CONTRACT OPERATIONS
  // ============================================================================

  async createContract(contract: InsertContract): Promise<Contract> {
    const [result] = await db.insert(contracts).values(contract).returning();
    return result;
  }

  async getContract(id: string): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract;
  }

  async getContractsByLead(leadId: string): Promise<Contract[]> {
    return await db.select().from(contracts).where(eq(contracts.leadId, leadId));
  }

  async getContractsByLandlord(landlordId: string): Promise<Contract[]> {
    // Get all properties for this landlord
    const landlordProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.landlordId, landlordId));
    
    if (landlordProperties.length === 0) {
      return [];
    }

    const propertyIds = landlordProperties.map(p => p.id);

    // Get all rooms for these properties
    const propertyRooms = await db
      .select()
      .from(rooms)
      .where(inArray(rooms.propertyId, propertyIds));
    
    if (propertyRooms.length === 0) {
      return [];
    }

    const roomIds = propertyRooms.map(r => r.id);

    // Get all contracts for these rooms
    return await db
      .select()
      .from(contracts)
      .where(inArray(contracts.roomId, roomIds));
  }

  async updateContract(id: string, updates: Partial<InsertContract>): Promise<Contract> {
    const [contract] = await db
      .update(contracts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(contracts.id, id))
      .returning();
    return contract;
  }

  async updateContractDocument(contractId: string, contractUrl: string): Promise<Contract> {
    const [contract] = await db
      .update(contracts)
      .set({
        contractUrl,
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, contractId))
      .returning();
    return contract;
  }

  async getContractByLead(leadId: string): Promise<Contract | undefined> {
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.leadId, leadId))
      .limit(1);
    
    return contract;
  }

  async getContractByEnvelopeId(envelopeId: string): Promise<Contract | undefined> {
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.signableEnvelopeId, envelopeId))
      .limit(1);
    
    return contract;
  }

  // RTR Sequence Management
  async approveApplication(contractId: string, landlordId: string): Promise<Contract> {
    const [contract] = await db
      .update(contracts)
      .set({
        approvalStatus: "approved",
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, contractId))
      .returning();
    return contract;
  }

  async updateRightToRentStatus(
    contractId: string,
    status: string,
    checkerId: string,
    documentUrl?: string
  ): Promise<Contract> {
    const [contract] = await db
      .update(contracts)
      .set({
        rightToRentStatus: status,
        rightToRentCheckedAt: new Date(),
        rightToRentCheckerId: checkerId,
        rightToRentDocumentUrl: documentUrl,
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, contractId))
      .returning();
    return contract;
  }

  async chargeDeposit(contractId: string, stripePaymentIntentId: string): Promise<Contract> {
    const chargedAt = new Date();
    const deadline = new Date(chargedAt);
    deadline.setDate(deadline.getDate() + 30); // UK law: 30 days to protect deposit

    const [contract] = await db
      .update(contracts)
      .set({
        depositChargeStatus: "charged",
        depositChargeId: stripePaymentIntentId,
        depositChargedAt: chargedAt,
        depositProtectionDeadline: deadline,
        depositProtectionStatus: "not_protected",
        depositProtectionRemindersSent: 0,
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, contractId))
      .returning();
    return contract;
  }

  async recordTenantSignature(contractId: string): Promise<Contract> {
    const [contract] = await db
      .update(contracts)
      .set({
        tenantSignatureStatus: "signed",
        tenantSignedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, contractId))
      .returning();
    return contract;
  }

  async recordLandlordSignature(contractId: string, landlordId: string): Promise<Contract> {
    const [contract] = await db
      .update(contracts)
      .set({
        landlordSignatureStatus: "signed",
        landlordSignedAt: new Date(),
        sequenceCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, contractId))
      .returning();
    return contract;
  }

  async getContractSequenceStatus(contractId: string): Promise<{
    canApprove: boolean;
    canCheckRTR: boolean;
    canChargeDeposit: boolean;
    canTenantSign: boolean;
    canLandlordSign: boolean;
    currentStep: string;
    nextStep: string;
    blockers: string[];
  }> {
    const contract = await this.getContract(contractId);
    if (!contract) {
      throw new Error("Contract not found");
    }

    const blockers: string[] = [];
    let currentStep = "";
    let nextStep = "";

    // Step 1: Approval
    const canApprove = contract.approvalStatus === "pending";
    const isApproved = contract.approvalStatus === "approved";

    // Step 2: RTR Check
    const canCheckRTR = isApproved;
    const isRTRPassed = contract.rightToRentStatus === "passed";
    if (!canCheckRTR && contract.rightToRentStatus === "not_started") {
      blockers.push("Application must be approved before RTR check");
    }

    // Step 3: Deposit Charge
    const canChargeDeposit = isRTRPassed;
    const isDepositCharged = contract.depositChargeStatus === "charged";
    if (!canChargeDeposit && contract.depositChargeStatus === "not_charged") {
      blockers.push("Right-to-Rent check must pass before charging deposit");
    }

    // Step 4: Tenant Signature
    const canTenantSign = isDepositCharged;
    const isTenantSigned = contract.tenantSignatureStatus === "signed";
    if (!canTenantSign && contract.tenantSignatureStatus === "not_signed") {
      blockers.push("Deposit must be charged before tenant can sign");
    }

    // Step 5: Landlord Signature
    const canLandlordSign = isTenantSigned;
    const isLandlordSigned = contract.landlordSignatureStatus === "signed";
    if (!canLandlordSign && contract.landlordSignatureStatus === "not_signed") {
      blockers.push("Tenant must sign before landlord can countersign");
    }

    // Determine current step
    if (!isApproved) {
      currentStep = "Awaiting Approval";
      nextStep = "Approve Application";
    } else if (!isRTRPassed) {
      currentStep = "RTR Check Required";
      nextStep = "Complete RTR Check";
    } else if (!isDepositCharged) {
      currentStep = "Ready for Deposit";
      nextStep = "Charge Deposit";
    } else if (!isTenantSigned) {
      currentStep = "Awaiting Tenant Signature";
      nextStep = "Tenant to Sign";
    } else if (!isLandlordSigned) {
      currentStep = "Awaiting Landlord Signature";
      nextStep = "Landlord to Countersign";
    } else {
      currentStep = "Fully Executed";
      nextStep = "Complete";
    }

    return {
      canApprove,
      canCheckRTR,
      canChargeDeposit,
      canTenantSign,
      canLandlordSign,
      currentStep,
      nextStep,
      blockers,
    };
  }

  // ============================================================================
  // DEPOSIT PROTECTION OPERATIONS (UK Housing Act 2004 Compliance)
  // ============================================================================

  async markDepositProtected(
    contractId: string,
    scheme: string,
    certificateNumber: string,
    protectionDate: Date
  ): Promise<Contract> {
    const [contract] = await db
      .update(contracts)
      .set({
        depositProtectionStatus: "protected",
        depositProtectionScheme: scheme,
        depositProtectionCertificateNumber: certificateNumber,
        depositProtectionDate: protectionDate,
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, contractId))
      .returning();
    return contract;
  }

  async getDepositProtectionStatus(contractId: string): Promise<{
    isProtected: boolean;
    daysRemaining: number | null;
    isOverdue: boolean;
    deadline: Date | null;
    remindersSent: number;
  }> {
    const contract = await this.getContract(contractId);
    if (!contract) {
      throw new Error("Contract not found");
    }

    const isProtected = contract.depositProtectionStatus === "protected";
    const deadline = contract.depositProtectionDeadline;
    const remindersSent = contract.depositProtectionRemindersSent || 0;

    let daysRemaining: number | null = null;
    let isOverdue = false;

    if (deadline && !isProtected) {
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      isOverdue = daysRemaining < 0;
    }

    return {
      isProtected,
      daysRemaining,
      isOverdue,
      deadline,
      remindersSent,
    };
  }

  async getContractsNeedingProtectionReminders(): Promise<any[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 31);
    
    const result = await db
      .select({
        // Contract fields
        id: contracts.id,
        leadId: contracts.leadId,
        roomId: contracts.roomId,
        depositAmount: contracts.depositAmount,
        depositChargedAt: contracts.depositChargedAt,
        depositProtectionDeadline: contracts.depositProtectionDeadline,
        depositProtectionStatus: contracts.depositProtectionStatus,
        depositProtectionRemindersSent: contracts.depositProtectionRemindersSent,
        depositProtectionLastReminderAt: contracts.depositProtectionLastReminderAt,
        
        // Property and landlord data (from joined tables)
        propertyId: properties.id,
        landlordId: properties.landlordId,
        landlordEmail: users.email,
        landlordName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
        
        // Tenant data (from leads table)
        tenantName: leads.name,
        tenantEmail: leads.email,
        
        // Property data (from properties table)
        propertyName: properties.name,
      })
      .from(contracts)
      .leftJoin(rooms, eq(contracts.roomId, rooms.id))
      .leftJoin(properties, eq(rooms.propertyId, properties.id))
      .leftJoin(users, eq(properties.landlordId, users.id))
      .leftJoin(leads, eq(contracts.leadId, leads.id))
      .where(
        and(
          eq(contracts.depositChargeStatus, 'charged'),
          eq(contracts.depositProtectionStatus, 'not_protected'),
          isNotNull(contracts.depositChargedAt),
          gte(contracts.depositChargedAt, thirtyDaysAgo)
        )
      );
    
    return result;
  }

  async updateDepositReminderTracking(contractId: string, dayNumber: number): Promise<Contract> {
    const [updated] = await db
      .update(contracts)
      .set({
        depositProtectionRemindersSent: sql`${contracts.depositProtectionRemindersSent} + 1`,
        depositProtectionLastReminderAt: new Date(),
      })
      .where(eq(contracts.id, contractId))
      .returning();
    return updated;
  }

  // ============================================================================
  // FOLLOW-UP OPERATIONS
  // ============================================================================

  async createFollowUp(followUp: InsertFollowUp): Promise<FollowUp> {
    const [result] = await db.insert(followUps).values(followUp).returning();
    return result;
  }

  async getFollowUpsByLead(leadId: string): Promise<FollowUp[]> {
    return await db
      .select()
      .from(followUps)
      .where(eq(followUps.leadId, leadId))
      .orderBy(desc(followUps.createdAt));
  }

  async getLatestFollowUp(leadId: string): Promise<FollowUp | undefined> {
    const [followUp] = await db
      .select()
      .from(followUps)
      .where(eq(followUps.leadId, leadId))
      .orderBy(desc(followUps.createdAt))
      .limit(1);
    return followUp;
  }

  async markFollowUpResponded(id: string): Promise<FollowUp> {
    const [followUp] = await db
      .update(followUps)
      .set({ 
        responded: true, 
        responseDate: new Date() 
      })
      .where(eq(followUps.id, id))
      .returning();
    return followUp;
  }

  // ============================================================================
  // WEBHOOK LOG OPERATIONS
  // ============================================================================

  async createWebhookLog(log: InsertWebhookLog): Promise<WebhookLog> {
    const [result] = await db.insert(webhookLogs).values(log).returning();
    return result;
  }

  async getUnprocessedWebhookLogs(): Promise<WebhookLog[]> {
    return await db
      .select()
      .from(webhookLogs)
      .where(eq(webhookLogs.processed, false))
      .orderBy(desc(webhookLogs.createdAt));
  }

  async markWebhookLogProcessed(id: string): Promise<void> {
    await db
      .update(webhookLogs)
      .set({ processed: true })
      .where(eq(webhookLogs.id, id));
  }

  async getAllWebhookLogs(source?: string, limit = 50): Promise<WebhookLog[]> {
    let query = db
      .select()
      .from(webhookLogs)
      .orderBy(desc(webhookLogs.createdAt))
      .limit(limit);
    
    if (source) {
      query = query.where(eq(webhookLogs.source, source)) as any;
    }
    
    return await query;
  }

  // ============================================================================
  // TENANT APPLICATION OPERATIONS
  // ============================================================================

  async createApplication(application: InsertTenantApplication): Promise<TenantApplication> {
    const [result] = await db.insert(tenantApplications).values(application).returning();
    return result;
  }

  async getApplication(id: string): Promise<TenantApplication | undefined> {
    const [application] = await db.select().from(tenantApplications).where(eq(tenantApplications.id, id));
    return application;
  }

  async getApplicationByLead(leadId: string): Promise<TenantApplication | undefined> {
    const [application] = await db
      .select()
      .from(tenantApplications)
      .where(eq(tenantApplications.leadId, leadId))
      .orderBy(desc(tenantApplications.createdAt))
      .limit(1);
    return application;
  }

  async updateApplication(id: string, updates: Partial<InsertTenantApplication>): Promise<TenantApplication> {
    const [application] = await db
      .update(tenantApplications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tenantApplications.id, id))
      .returning();
    return application;
  }

  // ============================================================================
  // APPLICATION DOCUMENT OPERATIONS
  // ============================================================================

  async createApplicationDocument(document: InsertApplicationDocument): Promise<ApplicationDocument> {
    const [result] = await db.insert(applicationDocuments).values(document).returning();
    return result;
  }

  async getApplicationDocuments(applicationId: string): Promise<ApplicationDocument[]> {
    return await db
      .select()
      .from(applicationDocuments)
      .where(eq(applicationDocuments.applicationId, applicationId))
      .orderBy(desc(applicationDocuments.uploadedAt));
  }

  // ============================================================================
  // VIEWING PREFERENCES OPERATIONS
  // ============================================================================

  async createViewingPreferences(preferences: InsertViewingPreferences): Promise<ViewingPreferences> {
    const [result] = await db.insert(viewingPreferences).values(preferences).returning();
    return result;
  }

  async getViewingPreferences(id: string): Promise<ViewingPreferences | undefined> {
    const [preferences] = await db.select().from(viewingPreferences).where(eq(viewingPreferences.id, id));
    return preferences;
  }

  async getViewingPreferencesByLandlord(landlordId: string): Promise<ViewingPreferences | undefined> {
    const [preferences] = await db.select().from(viewingPreferences).where(eq(viewingPreferences.landlordId, landlordId));
    return preferences;
  }

  async updateViewingPreferences(id: string, updates: Partial<InsertViewingPreferences>): Promise<ViewingPreferences> {
    const [preferences] = await db
      .update(viewingPreferences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(viewingPreferences.id, id))
      .returning();
    return preferences;
  }

  // ============================================================================
  // CONTRACT TEMPLATE OPERATIONS
  // ============================================================================

  async createContractTemplate(template: InsertContractTemplate): Promise<ContractTemplate> {
    const [result] = await db.insert(contractTemplates).values(template).returning();
    return result;
  }

  async getContractTemplate(id: string): Promise<ContractTemplate | undefined> {
    const [template] = await db.select().from(contractTemplates).where(eq(contractTemplates.id, id));
    return template;
  }

  async getContractTemplatesByLandlord(landlordId: string): Promise<ContractTemplate[]> {
    return await db
      .select()
      .from(contractTemplates)
      .where(eq(contractTemplates.landlordId, landlordId))
      .orderBy(desc(contractTemplates.uploadedAt));
  }

  async updateContractTemplate(id: string, updates: Partial<InsertContractTemplate>): Promise<ContractTemplate> {
    const [template] = await db
      .update(contractTemplates)
      .set(updates)
      .where(eq(contractTemplates.id, id))
      .returning();
    return template;
  }

  async deleteContractTemplate(id: string): Promise<void> {
    await db.delete(contractTemplates).where(eq(contractTemplates.id, id));
  }

  // ============================================================================
  // CALL LOG OPERATIONS
  // ============================================================================

  async createCallLog(callLog: InsertCallLog): Promise<CallLog> {
    const [result] = await db.insert(callLogs).values(callLog).returning();
    return result;
  }

  async getCallLog(id: string): Promise<CallLog | undefined> {
    const [callLog] = await db.select().from(callLogs).where(eq(callLogs.id, id));
    return callLog;
  }

  async getCallLogsByLandlord(landlordId: string): Promise<CallLog[]> {
    return await db
      .select()
      .from(callLogs)
      .where(eq(callLogs.landlordId, landlordId))
      .orderBy(desc(callLogs.callTimestamp));
  }

  async updateCallLog(id: string, updates: Partial<InsertCallLog>): Promise<CallLog> {
    const [callLog] = await db
      .update(callLogs)
      .set(updates)
      .where(eq(callLogs.id, id))
      .returning();
    return callLog;
  }

  async markCallReviewed(id: string, reviewNotes?: string): Promise<CallLog> {
    const [callLog] = await db
      .update(callLogs)
      .set({ 
        staffReviewed: true, 
        reviewedAt: new Date(),
        reviewNotes: reviewNotes || null
      })
      .where(eq(callLogs.id, id))
      .returning();
    return callLog;
  }

  // AI Sales Trainer methods
  async getCallLogWithAnalysis(id: string): Promise<CallLog | undefined> {
    const [callLog] = await db.select().from(callLogs).where(eq(callLogs.id, id));
    return callLog;
  }

  async saveAICoachingInsights(callLogId: string, insights: any): Promise<CallLog> {
    const [callLog] = await db
      .update(callLogs)
      .set({
        aiCoachSummary: insights.aiCoachSummary,
        conversionOpportunities: insights.conversionOpportunities,
        missedTalkingPoints: insights.missedTalkingPoints,
        skillFocusAreas: insights.skillFocusAreas,
        improvementScore: insights.improvementScore,
      })
      .where(eq(callLogs.id, callLogId))
      .returning();
    return callLog;
  }

  async linkCallToViewing(callLogId: string, viewingId: string): Promise<CallLog> {
    const [callLog] = await db
      .update(callLogs)
      .set({ viewingId })
      .where(eq(callLogs.id, callLogId))
      .returning();
    return callLog;
  }

  // ============================================================================
  // LEAD PROFILE INSIGHTS OPERATIONS
  // ============================================================================

  async saveProfileInsight(insight: InsertLeadProfileInsight): Promise<LeadProfileInsight> {
    const [result] = await db.insert(leadProfileInsights).values(insight).returning();
    return result;
  }

  async getProfileInsightsByLead(leadId: string): Promise<LeadProfileInsight[]> {
    return await db
      .select()
      .from(leadProfileInsights)
      .where(eq(leadProfileInsights.leadId, leadId))
      .orderBy(desc(leadProfileInsights.createdAt));
  }

  async markInsightAsApplied(insightId: string): Promise<void> {
    await db
      .update(leadProfileInsights)
      .set({ appliedToProfile: true })
      .where(eq(leadProfileInsights.id, insightId));
  }

  // ============================================================================
  // AI LEARNING METRICS OPERATIONS
  // ============================================================================

  async getLearningMetrics(landlordId: string, period: string): Promise<AILearningMetric[]> {
    // TIMEZONE FIX (Bug #8): Use proper date-fns functions for timezone-aware period calculations
    // Previous implementation used simple millisecond arithmetic which doesn't handle:
    // - Calendar month boundaries (months have 28-31 days, not always 30)
    // - Calendar week boundaries (week starts on different days)
    // - Daylight Saving Time transitions
    // - Timezone-specific boundaries
    
    let periodStart: Date;
    const now = new Date();

    switch (period) {
      case 'week':
        // Use startOfWeek from date-fns to get proper calendar week boundary
        // This respects timezone and always starts at midnight on the week start day
        periodStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }); // Week starts on Monday
        break;
      case 'month':
        // Use startOfMonth to get proper calendar month boundary (handles 28-31 day months)
        periodStart = startOfMonth(subMonths(now, 1));
        break;
      case 'quarter':
        // Use startOfQuarter to get proper calendar quarter boundary (handles varying quarter lengths)
        periodStart = startOfQuarter(subMonths(now, 3));
        break;
      default:
        // Default to one month ago using proper calendar month calculation
        periodStart = startOfMonth(subMonths(now, 1));
    }

    return await db
      .select()
      .from(aiLearningMetrics)
      .where(
        and(
          eq(aiLearningMetrics.landlordId, landlordId),
          gte(aiLearningMetrics.periodStart, periodStart)
        )
      )
      .orderBy(desc(aiLearningMetrics.createdAt));
  }

  async saveLearningMetric(metric: InsertAILearningMetric): Promise<AILearningMetric> {
    const [result] = await db.insert(aiLearningMetrics).values(metric).returning();
    return result;
  }

  // ============================================================================
  // WEBHOOK EVENT OPERATIONS (Idempotent Processing)
  // ============================================================================

  async recordWebhookEvent(data: {
    provider: string;
    eventId: string;
    eventType: string;
    rawPayload: any;
    headers?: any;
    landlordId?: string;
    relatedContractId?: string;
    relatedLeadId?: string;
  }): Promise<{ event: WebhookEvent; isNew: boolean }> {
    // WEBHOOK DUPLICATE DETECTION FIX: Enhanced error handling with retry logic
    // Handles race conditions where multiple webhook deliveries arrive simultaneously
    const maxRetries = 3;
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // First, check for existing event (idempotency check)
        const [existingEvent] = await db
          .select()
          .from(webhookEvents)
          .where(
            and(
              eq(webhookEvents.provider, data.provider),
              eq(webhookEvents.eventId, data.eventId)
            )
          )
          .limit(1);

        if (existingEvent) {
          console.log(`[${data.provider}] Duplicate webhook event detected: ${data.eventId} (Status: ${existingEvent.status})`);
          return { event: existingEvent, isNew: false };
        }

        // No existing event, insert new one
        const [newEvent] = await db
          .insert(webhookEvents)
          .values({
            provider: data.provider,
            eventId: data.eventId,
            eventType: data.eventType,
            rawPayload: data.rawPayload,
            headers: data.headers || null,
            landlordId: data.landlordId || null,
            relatedContractId: data.relatedContractId || null,
            relatedLeadId: data.relatedLeadId || null,
            status: 'pending',
            retryCount: 0,
          })
          .returning();

        console.log(`[${data.provider}] Recorded new webhook event: ${data.eventId} (Type: ${data.eventType})`);
        return { event: newEvent, isNew: true };
      } catch (error: any) {
        lastError = error;
        
        // Handle unique constraint violation (duplicate event ID)
        if (error.code === '23505') {
          console.warn(`[${data.provider}] Unique constraint violation for webhook ${data.eventId}, fetching existing event`);
          
          try {
            const [existingEvent] = await db
              .select()
              .from(webhookEvents)
              .where(
                and(
                  eq(webhookEvents.provider, data.provider),
                  eq(webhookEvents.eventId, data.eventId)
                )
              )
              .limit(1);
            
            if (existingEvent) {
              console.log(`[${data.provider}] Found existing event after constraint violation: ${data.eventId}`);
              return { event: existingEvent, isNew: false };
            } else {
              // This should never happen, but handle it gracefully
              console.error(`[${data.provider}] Constraint violation but event not found: ${data.eventId}`);
              throw new Error(`Webhook event ${data.eventId} not found after unique constraint violation`);
            }
          } catch (fetchError: any) {
            console.error(`[${data.provider}] Error fetching existing webhook event:`, fetchError);
            throw fetchError;
          }
        }
        
        // Handle deadlock or serialization errors with retry
        const isRetryableError = 
          error.code === '40P01' || // deadlock_detected
          error.code === '40001' ||  // serialization_failure
          error.code === '08006' ||  // connection_failure
          error.code === '57P03';    // cannot_connect_now
        
        if (isRetryableError && attempt < maxRetries - 1) {
          console.warn(`[${data.provider}] Retrying webhook insert after error (attempt ${attempt + 1}/${maxRetries}):`, error.message);
          // MONITORING: Track webhook retry attempts for operational metrics
          metrics.recordWebhookRetry(data.provider, data.eventId);
          // Exponential backoff: 50ms, 100ms, 200ms
          await new Promise(resolve => setTimeout(resolve, 50 * Math.pow(2, attempt)));
          continue;
        }
        
        // Non-retryable error or max retries exceeded
        console.error(`[${data.provider}] Failed to record webhook event ${data.eventId}:`, {
          error: error.message,
          code: error.code,
          eventType: data.eventType,
          attempt: attempt + 1,
        });
        throw error;
      }
    }
    
    // Max retries exceeded
    console.error(`[${data.provider}] Max retries (${maxRetries}) exceeded for webhook ${data.eventId}`);
    throw lastError || new Error(`Failed to record webhook event after ${maxRetries} retries`);
  }

  async markWebhookProcessed(eventId: number): Promise<void> {
    await db
      .update(webhookEvents)
      .set({
        status: 'completed',
        processedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(webhookEvents.id, eventId));
  }

  async markWebhookFailed(eventId: number, error: string): Promise<void> {
    await db
      .update(webhookEvents)
      .set({
        status: 'failed',
        errorMessage: error,
        retryCount: sql`${webhookEvents.retryCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(webhookEvents.id, eventId));
  }

  async getWebhookEvent(id: number): Promise<WebhookEvent | undefined> {
    const [event] = await db
      .select()
      .from(webhookEvents)
      .where(eq(webhookEvents.id, id))
      .limit(1);
    return event;
  }

  async getWebhookEvents(filters?: { 
    provider?: string; 
    status?: string; 
    limit?: number;
  }): Promise<WebhookEvent[]> {
    let query = db.select().from(webhookEvents);

    const conditions = [];
    if (filters?.provider) {
      conditions.push(eq(webhookEvents.provider, filters.provider));
    }
    if (filters?.status) {
      conditions.push(eq(webhookEvents.status, filters.status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const limit = filters?.limit || 100;
    return await query
      .orderBy(desc(webhookEvents.createdAt))
      .limit(limit);
  }

  async retryFailedWebhooks(): Promise<WebhookEvent[]> {
    return await db
      .select()
      .from(webhookEvents)
      .where(
        and(
          eq(webhookEvents.status, 'failed'),
          sql`${webhookEvents.retryCount} < 3`
        )
      )
      .orderBy(desc(webhookEvents.createdAt));
  }

  // ============================================================================
  // FEATURE FLAG OPERATIONS
  // ============================================================================

  async getFeatureFlag(landlordId: string, featureKey: string): Promise<boolean> {
    const flag = await db
      .select()
      .from(featureFlags)
      .where(
        and(
          eq(featureFlags.landlordId, landlordId),
          eq(featureFlags.featureKey, featureKey)
        )
      )
      .limit(1);
    
    return flag[0]?.enabled || false;
  }

  async getAllFeatureFlags(landlordId: string): Promise<FeatureFlag[]> {
    const flags = await db
      .select()
      .from(featureFlags)
      .where(eq(featureFlags.landlordId, landlordId));
    
    return flags;
  }

  async setFeatureFlag(
    landlordId: string,
    featureKey: string,
    enabled: boolean,
    setBy: string
  ): Promise<FeatureFlag> {
    // RACE CONDITION FIX: Wrap in transaction with retry logic for concurrent updates
    // Multiple requests updating the same flag could cause deadlocks or lost updates
    const maxRetries = 3;
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await db.transaction(async (tx) => {
          const now = new Date();
          
          // Use INSERT ... ON CONFLICT for atomic upsert
          // This is atomic at the database level and handles concurrent updates safely
          const [flag] = await tx
            .insert(featureFlags)
            .values({
              landlordId,
              featureKey,
              enabled,
              enabledAt: enabled ? now : null,
              enabledBy: enabled ? setBy : null,
              disabledAt: enabled ? null : now,
              disabledBy: enabled ? null : setBy,
            })
            .onConflictDoUpdate({
              target: [featureFlags.landlordId, featureFlags.featureKey],
              set: {
                enabled,
                enabledAt: enabled ? now : sql`${featureFlags.enabledAt}`,
                enabledBy: enabled ? setBy : sql`${featureFlags.enabledBy}`,
                disabledAt: enabled ? sql`${featureFlags.disabledAt}` : now,
                disabledBy: enabled ? sql`${featureFlags.disabledBy}` : setBy,
                updatedAt: now,
              }
            })
            .returning();
          
          return flag;
        });
        
        console.log(`Feature flag ${featureKey} set to ${enabled} for landlord ${landlordId}`);
        return result;
      } catch (error: any) {
        lastError = error;
        
        // Retry on deadlock or serialization errors (PostgreSQL error codes)
        const isRetryableError = 
          error.code === '40P01' || // deadlock_detected
          error.code === '40001';    // serialization_failure
        
        if (isRetryableError && attempt < maxRetries - 1) {
          console.warn(`Retrying feature flag update after error (attempt ${attempt + 1}/${maxRetries}):`, error.message);
          // MONITORING: Track feature flag retry attempts for operational metrics
          metrics.recordFeatureFlagRetry(landlordId, featureKey);
          // Exponential backoff: 10ms, 20ms, 40ms
          await new Promise(resolve => setTimeout(resolve, 10 * Math.pow(2, attempt)));
          continue;
        }
        
        // Non-retryable error or max retries exceeded
        console.error(`Failed to set feature flag ${featureKey}:`, error);
        throw error;
      }
    }
    
    // This should never be reached due to the throw above, but TypeScript needs it
    throw lastError || new Error('Failed to set feature flag after retries');
  }

  async isFeatureEnabled(landlordId: string, featureKey: string): Promise<boolean> {
    return this.getFeatureFlag(landlordId, featureKey);
  }

  // ============================================================================
  // AI CHATBOT ONBOARDING OPERATIONS
  // ============================================================================

  async createOnboardingSession(session: InsertOnboardingSessionNew): Promise<OnboardingSessionNew> {
    const result = await db
      .insert(onboardingSessionsNew)
      .values(session)
      .returning();
    return result[0];
  }

  async getOnboardingSession(id: string): Promise<OnboardingSessionNew | undefined> {
    const result = await db
      .select()
      .from(onboardingSessionsNew)
      .where(eq(onboardingSessionsNew.id, id))
      .limit(1);
    return result[0];
  }

  async getOnboardingSessionByLandlord(landlordId: string): Promise<OnboardingSessionNew | undefined> {
    const result = await db
      .select()
      .from(onboardingSessionsNew)
      .where(eq(onboardingSessionsNew.landlordId, landlordId))
      .orderBy(desc(onboardingSessionsNew.createdAt))
      .limit(1);
    return result[0];
  }

  async updateOnboardingSession(id: string, updates: Partial<InsertOnboardingSessionNew>): Promise<OnboardingSessionNew> {
    const result = await db
      .update(onboardingSessionsNew)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(onboardingSessionsNew.id, id))
      .returning();
    return result[0];
  }

  async createSectionResponse(response: InsertSectionResponse): Promise<SectionResponse> {
    const result = await db
      .insert(onboardingSectionResponses)
      .values(response)
      .returning();
    return result[0];
  }

  async getSectionResponses(sessionId: string): Promise<SectionResponse[]> {
    return db
      .select()
      .from(onboardingSectionResponses)
      .where(eq(onboardingSectionResponses.sessionId, sessionId))
      .orderBy(onboardingSectionResponses.createdAt);
  }

  async getSectionResponsesBySection(sessionId: string, section: string): Promise<SectionResponse[]> {
    return db
      .select()
      .from(onboardingSectionResponses)
      .where(
        and(
          eq(onboardingSectionResponses.sessionId, sessionId),
          eq(onboardingSectionResponses.section, section)
        )
      )
      .orderBy(onboardingSectionResponses.createdAt);
  }

  async createOnboardingAttachment(attachment: InsertOnboardingAttachment): Promise<OnboardingAttachment> {
    const result = await db
      .insert(onboardingAttachments)
      .values(attachment)
      .returning();
    return result[0];
  }

  async getOnboardingAttachments(sessionId: string): Promise<OnboardingAttachment[]> {
    return db
      .select()
      .from(onboardingAttachments)
      .where(eq(onboardingAttachments.sessionId, sessionId))
      .orderBy(onboardingAttachments.uploadedAt);
  }

  async createLandlordProfile(profile: InsertLandlordProfile): Promise<LandlordProfile> {
    const result = await db
      .insert(landlordProfiles)
      .values(profile)
      .returning();
    return result[0];
  }

  async getLandlordProfile(landlordId: string): Promise<LandlordProfile | undefined> {
    const result = await db
      .select()
      .from(landlordProfiles)
      .where(eq(landlordProfiles.landlordId, landlordId))
      .limit(1);
    return result[0];
  }

  async updateLandlordProfile(landlordId: string, updates: Partial<InsertLandlordProfile>): Promise<LandlordProfile> {
    const result = await db
      .update(landlordProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(landlordProfiles.landlordId, landlordId))
      .returning();
    return result[0];
  }

  // ============================================================================
  // CONTRACT DYNAMIC SECTIONS OPERATIONS
  // ============================================================================

  async saveContractDynamicSections(sessionId: string, sections: InsertContractDynamicSection[]): Promise<void> {
    // Clear existing sections for this session first
    await db
      .delete(contractDynamicSections)
      .where(eq(contractDynamicSections.sessionId, sessionId));

    // Insert new sections if any
    if (sections.length > 0) {
      await db.insert(contractDynamicSections).values(sections);
    }
  }

  async getContractDynamicSections(sessionId: string): Promise<ContractDynamicSection[]> {
    return db
      .select()
      .from(contractDynamicSections)
      .where(eq(contractDynamicSections.sessionId, sessionId))
      .orderBy(contractDynamicSections.createdAt);
  }

  // ============================================================================
  // FLOOR PLAN ZONES OPERATIONS
  // ============================================================================

  async saveFloorPlanZones(sessionId: string, zones: InsertOnboardingFloorPlanZone[]): Promise<void> {
    // Clear existing zones for this session first
    await db
      .delete(onboardingFloorPlanZones)
      .where(eq(onboardingFloorPlanZones.sessionId, sessionId));

    // Insert new zones if any
    if (zones.length > 0) {
      await db.insert(onboardingFloorPlanZones).values(zones);
    }
  }

  async getFloorPlanZones(sessionId: string): Promise<OnboardingFloorPlanZone[]> {
    return db
      .select()
      .from(onboardingFloorPlanZones)
      .where(eq(onboardingFloorPlanZones.sessionId, sessionId))
      .orderBy(onboardingFloorPlanZones.createdAt);
  }

  // ============================================================================
  // TASK DELEGATION OPERATIONS
  // ============================================================================

  async createTaskDelegation(delegation: InsertOnboardingTaskDelegation): Promise<OnboardingTaskDelegation> {
    const result = await db
      .insert(onboardingTaskDelegations)
      .values(delegation)
      .returning();
    return result[0];
  }

  async getTaskDelegations(sessionId: string): Promise<OnboardingTaskDelegation[]> {
    return db
      .select()
      .from(onboardingTaskDelegations)
      .where(eq(onboardingTaskDelegations.sessionId, sessionId))
      .orderBy(onboardingTaskDelegations.createdAt);
  }

  async getTaskDelegationById(id: string): Promise<OnboardingTaskDelegation | null> {
    const [delegation] = await db
      .select()
      .from(onboardingTaskDelegations)
      .where(eq(onboardingTaskDelegations.id, id));
    return delegation || null;
  }

  async getTaskDelegationByToken(accessToken: string): Promise<OnboardingTaskDelegation | null> {
    const [delegation] = await db
      .select()
      .from(onboardingTaskDelegations)
      .where(eq(onboardingTaskDelegations.accessToken, accessToken));
    return delegation || null;
  }

  async updateTaskDelegation(id: string, data: Partial<InsertOnboardingTaskDelegation>): Promise<void> {
    await db
      .update(onboardingTaskDelegations)
      .set(data)
      .where(eq(onboardingTaskDelegations.id, id));
  }

  // ============================================================================
  // CONVERSATION STRATEGIES (A/B Testing)
  // ============================================================================

  async createStrategy(strategy: InsertConversationStrategy): Promise<ConversationStrategy> {
    const [result] = await db
      .insert(conversationStrategies)
      .values(strategy)
      .returning();
    return result;
  }

  async getStrategy(id: string): Promise<ConversationStrategy | undefined> {
    const [strategy] = await db
      .select()
      .from(conversationStrategies)
      .where(eq(conversationStrategies.id, id));
    return strategy;
  }

  async getAllStrategies(): Promise<ConversationStrategy[]> {
    return db
      .select()
      .from(conversationStrategies)
      .orderBy(conversationStrategies.priority);
  }

  async getActiveStrategies(): Promise<ConversationStrategy[]> {
    return db
      .select()
      .from(conversationStrategies)
      .where(eq(conversationStrategies.isActive, true))
      .orderBy(conversationStrategies.priority);
  }

  async updateStrategy(id: string, updates: Partial<InsertConversationStrategy>): Promise<ConversationStrategy> {
    const [strategy] = await db
      .update(conversationStrategies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversationStrategies.id, id))
      .returning();
    return strategy;
  }

  async assignStrategy(assignment: InsertStrategyAssignment): Promise<StrategyAssignment> {
    // Upsert by leadId to support reassignments (manual overrides)
    const [result] = await db
      .insert(strategyAssignments)
      .values(assignment)
      .onConflictDoUpdate({
        target: strategyAssignments.leadId,
        set: {
          strategyId: assignment.strategyId,
          assignedBy: assignment.assignedBy,
          confidenceScore: assignment.confidenceScore,
          isManualOverride: assignment.isManualOverride,
          assignmentMetadata: assignment.assignmentMetadata,
          createdAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  async getStrategyAssignment(leadId: string): Promise<StrategyAssignment | undefined> {
    const [assignment] = await db
      .select()
      .from(strategyAssignments)
      .where(eq(strategyAssignments.leadId, leadId))
      .orderBy(desc(strategyAssignments.createdAt))
      .limit(1);
    return assignment;
  }

  async trackStrategyEvent(event: InsertStrategyEvent): Promise<StrategyEvent> {
    const [result] = await db
      .insert(strategyEvents)
      .values(event)
      .returning();
    return result;
  }

  async getStrategyEvents(leadId: string): Promise<StrategyEvent[]> {
    return db
      .select()
      .from(strategyEvents)
      .where(eq(strategyEvents.leadId, leadId))
      .orderBy(strategyEvents.occurredAt);
  }

  async getStrategyPerformance(
    strategyId: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<StrategyPerformance | undefined> {
    const [performance] = await db
      .select()
      .from(strategyPerformance)
      .where(
        and(
          eq(strategyPerformance.strategyId, strategyId),
          eq(strategyPerformance.periodStart, periodStart),
          eq(strategyPerformance.periodEnd, periodEnd)
        )
      );
    return performance;
  }

  async saveStrategyPerformance(performance: InsertStrategyPerformance): Promise<StrategyPerformance> {
    const [result] = await db
      .insert(strategyPerformance)
      .values(performance)
      .returning();
    return result;
  }

  async getAssignmentsByStrategy(strategyId: string): Promise<StrategyAssignment[]> {
    return await db
      .select()
      .from(strategyAssignments)
      .where(eq(strategyAssignments.strategyId, strategyId));
  }

  async getStrategyEventByFunnelStage(strategyId: string, leadId: string, funnelStage: string): Promise<StrategyEvent | undefined> {
    const [event] = await db
      .select()
      .from(strategyEvents)
      .where(
        and(
          eq(strategyEvents.strategyId, strategyId),
          eq(strategyEvents.leadId, leadId),
          eq(strategyEvents.funnelStage, funnelStage)
        )
      )
      .limit(1);
    return event;
  }

  async countStrategyEventsByFunnelStage(strategyId: string, funnelStage: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(strategyEvents)
      .where(
        and(
          eq(strategyEvents.strategyId, strategyId),
          eq(strategyEvents.funnelStage, funnelStage)
        )
      );
    return Number(result[0]?.count || 0);
  }

  async upsertStrategyPerformanceMetrics(metrics: {
    strategyId: string;
    totalLeads: number;
    contactsCaptured: number;
    viewingsBooked: number;
    depositsPaid: number;
    contractsSigned: number;
    contactCaptureRate: string;
    viewingBookingRate: string;
    depositConversionRate: string;
    contractConversionRate: string;
  }): Promise<StrategyPerformance> {
    // Use current period (last 30 days)
    const periodEnd = new Date();
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - 30);

    const performance: InsertStrategyPerformance = {
      strategyId: metrics.strategyId,
      periodStart,
      periodEnd,
      totalLeads: metrics.totalLeads,
      contactInfoCaptured: metrics.contactsCaptured,
      viewingsBooked: metrics.viewingsBooked,
      depositsPaid: metrics.depositsPaid,
      contractsSigned: metrics.contractsSigned,
      contactCaptureRate: metrics.contactCaptureRate,
      viewingBookingRate: metrics.viewingBookingRate,
      depositConversionRate: metrics.depositConversionRate,
      contractConversionRate: metrics.contractConversionRate,
    };

    // Check if exists
    const existing = await this.getStrategyPerformance(metrics.strategyId, periodStart, periodEnd);
    
    if (existing) {
      // Update existing
      await db
        .update(strategyPerformance)
        .set({
          totalLeads: metrics.totalLeads,
          contactInfoCaptured: metrics.contactsCaptured,
          viewingsBooked: metrics.viewingsBooked,
          depositsPaid: metrics.depositsPaid,
          contractsSigned: metrics.contractsSigned,
          contactCaptureRate: metrics.contactCaptureRate,
          viewingBookingRate: metrics.viewingBookingRate,
          depositConversionRate: metrics.depositConversionRate,
          contractConversionRate: metrics.contractConversionRate,
        })
        .where(eq(strategyPerformance.id, existing.id));
      
      return { ...existing, ...metrics };
    } else {
      // Insert new
      return await this.saveStrategyPerformance(performance);
    }
  }

  async getAllStrategyPerformanceLatest(): Promise<StrategyPerformance[]> {
    // Get latest performance record for each strategy
    const latestPerformance = await db
      .select()
      .from(strategyPerformance)
      .orderBy(desc(strategyPerformance.periodEnd));
    
    // Group by strategyId and take most recent
    const grouped = new Map<string, StrategyPerformance>();
    for (const perf of latestPerformance) {
      if (!grouped.has(perf.strategyId)) {
        grouped.set(perf.strategyId, perf);
      }
    }
    
    return Array.from(grouped.values());
  }

  // ============================================================================
  // BLOG POST OPERATIONS (SEO Content)
  // ============================================================================

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [result] = await db.insert(blogPosts).values(post).returning();
    return result;
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getAllPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.category, category), eq(blogPosts.status, "published")))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [post] = await db
      .update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async incrementBlogPostViews(id: string): Promise<void> {
    await db
      .update(blogPosts)
      .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
      .where(eq(blogPosts.id, id));
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // ============================================================================
  // DEMO BOOKING OPERATIONS (Marketing - No Auth Required)
  // ============================================================================

  async createDemoBooking(booking: InsertDemoBooking): Promise<DemoBooking> {
    const [result] = await db.insert(demoBookings).values(booking).returning();
    return result;
  }

  async getDemoBooking(id: string): Promise<DemoBooking | undefined> {
    const [booking] = await db.select().from(demoBookings).where(eq(demoBookings.id, id));
    return booking;
  }

  async getAllDemoBookings(): Promise<DemoBooking[]> {
    return await db.select().from(demoBookings).orderBy(desc(demoBookings.createdAt));
  }

  async updateDemoBookingStatus(id: string, status: string): Promise<DemoBooking> {
    const [booking] = await db
      .update(demoBookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(demoBookings.id, id))
      .returning();
    return booking;
  }

  // ============================================================================
  // RIGHT TO RENT CHECK OPERATIONS (UK Legal Requirement)
  // ============================================================================

  async createRightToRentCheck(check: InsertRightToRentCheck): Promise<RightToRentCheck> {
    const [result] = await db.insert(rightToRentChecks).values(check).returning();
    return result;
  }

  async getRightToRentCheck(id: string): Promise<RightToRentCheck | undefined> {
    const [check] = await db.select().from(rightToRentChecks).where(eq(rightToRentChecks.id, id));
    return check;
  }

  async getRightToRentCheckByLead(leadId: string): Promise<RightToRentCheck | undefined> {
    const [check] = await db
      .select()
      .from(rightToRentChecks)
      .where(eq(rightToRentChecks.leadId, leadId))
      .orderBy(desc(rightToRentChecks.createdAt));
    return check;
  }

  async getRightToRentChecksByStatus(status: string, landlordId?: string): Promise<RightToRentCheck[]> {
    if (landlordId) {
      // Join with leads to filter by landlord
      const checks = await db
        .select({
          check: rightToRentChecks,
        })
        .from(rightToRentChecks)
        .innerJoin(leads, eq(rightToRentChecks.leadId, leads.id))
        .where(
          and(
            eq(rightToRentChecks.status, status),
            eq(leads.landlordId, landlordId)
          )
        )
        .orderBy(desc(rightToRentChecks.createdAt));
      
      return checks.map(row => row.check);
    } else {
      return await db
        .select()
        .from(rightToRentChecks)
        .where(eq(rightToRentChecks.status, status))
        .orderBy(desc(rightToRentChecks.createdAt));
    }
  }

  async getRightToRentChecksExpiringSoon(beforeDate: Date): Promise<RightToRentCheck[]> {
    return await db
      .select()
      .from(rightToRentChecks)
      .where(
        and(
          eq(rightToRentChecks.status, 'approved'),
          isNotNull(rightToRentChecks.expiryDate),
          lte(rightToRentChecks.expiryDate, beforeDate),
          eq(rightToRentChecks.expiryReminderSent, false)
        )
      )
      .orderBy(rightToRentChecks.expiryDate);
  }

  async updateRightToRentCheck(id: string, updates: Partial<InsertRightToRentCheck>): Promise<RightToRentCheck> {
    const [check] = await db
      .update(rightToRentChecks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(rightToRentChecks.id, id))
      .returning();
    return check;
  }

  // ============================================================================
  // DEPOSIT PROTECTION OPERATIONS (UK Housing Act 2004 Compliance)
  // ============================================================================
  
  async createDepositProtection(protection: InsertDepositProtection): Promise<DepositProtection> {
    const [result] = await db.insert(depositProtections).values(protection).returning();
    return result;
  }

  async getDepositProtection(id: string): Promise<DepositProtection | undefined> {
    const [result] = await db
      .select()
      .from(depositProtections)
      .where(eq(depositProtections.id, id));
    return result;
  }

  async getDepositProtectionByLead(leadId: string): Promise<DepositProtection | undefined> {
    const [result] = await db
      .select()
      .from(depositProtections)
      .where(eq(depositProtections.leadId, leadId))
      .orderBy(desc(depositProtections.createdAt));
    return result;
  }

  async getDepositProtectionByRegistrationId(registrationId: string): Promise<DepositProtection | undefined> {
    const [result] = await db
      .select()
      .from(depositProtections)
      .where(eq(depositProtections.registrationId, registrationId));
    return result;
  }

  async getDepositProtectionsByLandlord(landlordId: string): Promise<DepositProtection[]> {
    return await db
      .select()
      .from(depositProtections)
      .where(eq(depositProtections.landlordId, landlordId))
      .orderBy(desc(depositProtections.protectionDeadline));
  }

  async getOverdueDepositProtections(): Promise<DepositProtection[]> {
    const now = new Date();
    return await db
      .select()
      .from(depositProtections)
      .where(
        and(
          eq(depositProtections.status, 'pending'),
          lt(depositProtections.protectionDeadline, now)
        )
      )
      .orderBy(depositProtections.protectionDeadline);
  }

  async getDepositProtectionsNeedingReminders(): Promise<DepositProtection[]> {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return await db
      .select()
      .from(depositProtections)
      .where(
        and(
          eq(depositProtections.status, 'pending'),
          gte(depositProtections.protectionDeadline, now),
          lte(depositProtections.protectionDeadline, sevenDaysFromNow)
        )
      )
      .orderBy(depositProtections.protectionDeadline);
  }

  async updateDepositProtection(id: string, updates: Partial<InsertDepositProtection>): Promise<DepositProtection> {
    const [result] = await db
      .update(depositProtections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(depositProtections.id, id))
      .returning();
    return result;
  }

  // Deposit Protection Reminders
  async createDepositProtectionReminder(reminder: {
    depositProtectionId: string;
    reminderType: string;
    scheduledFor: Date;
    status?: string;
  }): Promise<DepositProtectionReminder> {
    const [result] = await db
      .insert(depositProtectionReminders)
      .values({
        depositProtectionId: reminder.depositProtectionId,
        reminderType: reminder.reminderType,
        scheduledFor: reminder.scheduledFor,
        status: reminder.status || 'pending',
      })
      .returning();
    return result;
  }

  async getPendingDepositProtectionReminders(): Promise<DepositProtectionReminder[]> {
    const now = new Date();
    return await db
      .select()
      .from(depositProtectionReminders)
      .where(
        and(
          eq(depositProtectionReminders.status, 'pending'),
          lte(depositProtectionReminders.scheduledFor, now)
        )
      )
      .orderBy(depositProtectionReminders.scheduledFor);
  }

  async markDepositProtectionReminderSent(id: string): Promise<void> {
    await db
      .update(depositProtectionReminders)
      .set({
        status: 'sent',
        sentAt: new Date(),
      })
      .where(eq(depositProtectionReminders.id, id));
  }

  // ============================================================================
  // MOVE-IN COORDINATION OPERATIONS
  // ============================================================================
  
  async createMoveIn(moveIn: InsertMoveInCoordination): Promise<MoveInCoordination> {
    const [result] = await db
      .insert(moveInCoordination)
      .values(moveIn)
      .returning();
    return result;
  }
  
  async getMoveIn(id: string): Promise<MoveInCoordination | undefined> {
    const [result] = await db
      .select()
      .from(moveInCoordination)
      .where(eq(moveInCoordination.id, id));
    return result;
  }
  
  async getMoveInByLead(leadId: string): Promise<MoveInCoordination | undefined> {
    const [result] = await db
      .select()
      .from(moveInCoordination)
      .where(eq(moveInCoordination.leadId, leadId));
    return result;
  }
  
  async updateMoveIn(id: string, updates: Partial<InsertMoveInCoordination>): Promise<MoveInCoordination> {
    const [result] = await db
      .update(moveInCoordination)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(moveInCoordination.id, id))
      .returning();
    return result;
  }
  
  async getUpcomingMoveIns(landlordId: string, days: number): Promise<MoveInCoordination[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return await db
      .select()
      .from(moveInCoordination)
      .where(
        and(
          eq(moveInCoordination.landlordId, landlordId),
          gte(moveInCoordination.moveInDate, now),
          lte(moveInCoordination.moveInDate, futureDate),
          eq(moveInCoordination.moveInCompleted, false)
        )
      )
      .orderBy(moveInCoordination.moveInDate);
  }
  
  async getPendingMoveIns(): Promise<MoveInCoordination[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // Next 30 days
    
    return await db
      .select()
      .from(moveInCoordination)
      .where(
        and(
          gte(moveInCoordination.moveInDate, now),
          lte(moveInCoordination.moveInDate, futureDate),
          eq(moveInCoordination.moveInCompleted, false)
        )
      )
      .orderBy(moveInCoordination.moveInDate);
  }
}

export const storage = new DatabaseStorage();
