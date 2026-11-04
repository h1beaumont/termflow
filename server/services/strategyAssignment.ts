// Strategy Assignment Service
// Assigns conversation strategies to leads based on rules and context

import { storage } from "../storage";
import { STRATEGY_TYPES } from "@shared/schema";
import type { InsertStrategyAssignment } from "@shared/schema";

interface AssignmentContext {
  source: string; // Lead source: "website", "whatsapp", "rightmove", "zoopla", etc.
  isReEngagement?: boolean; // Is this a follow-up to dormant lead?
  manualStrategyId?: string; // Manual override
  leadId: string;
}

export class StrategyAssignmentService {
  /**
   * Assign a conversation strategy to a lead
   */
  async assignStrategy(context: AssignmentContext): Promise<string> {
    const { leadId, source, isReEngagement, manualStrategyId } = context;

    // Check if already assigned
    const existing = await storage.getStrategyAssignment(leadId);
    if (existing) {
      console.log(`Lead ${leadId} already has strategy ${existing.strategyId}`);
      return existing.strategyId;
    }

    let strategyId: string;
    let assignedBy: string;
    let confidenceScore: string | undefined;

    // 1. Manual Override (highest priority)
    if (manualStrategyId) {
      strategyId = manualStrategyId;
      assignedBy = "manual";
      confidenceScore = "1.00";
    }
    // 2. Re-engagement / Dormant Lead
    else if (isReEngagement) {
      strategyId = await this.getConciergeStrategyId();
      assignedBy = "auto_reengagement";
      confidenceScore = "0.95";
    }
    // 3. Source-Based Routing
    else {
      const sourceStrategy = await this.getStrategyBySource(source);
      if (sourceStrategy) {
        strategyId = sourceStrategy.id;
        assignedBy = "auto_source_based";
        confidenceScore = "0.90";
      } else {
        // 4. Weighted Random (fallback)
        strategyId = await this.getWeightedRandomStrategy();
        assignedBy = "auto_weighted_random";
        confidenceScore = "0.70";
      }
    }

    // Store assignment
    const assignment: InsertStrategyAssignment = {
      leadId,
      strategyId,
      source,
      assignedBy,
      confidenceScore,
      isManualOverride: assignedBy === "manual",
      assignmentMetadata: {
        isReEngagement,
        timestamp: new Date().toISOString(),
      },
    };

    await storage.assignStrategy(assignment);
    console.log(`✅ Assigned strategy ${strategyId} (${assignedBy}) to lead ${leadId}`);

    return strategyId;
  }

  /**
   * Get strategy based on lead source
   */
  private async getStrategyBySource(source: string): Promise<{ id: string } | null> {
    const strategies = await storage.getActiveStrategies();

    // Guard against missing/undefined source
    if (!source || typeof source !== 'string') {
      console.warn('⚠️ Missing or invalid source - using default WhatsApp strategy pool');
      // Default to WhatsApp strategies as safest fallback for unknown sources
      source = 'whatsapp';
    }

    // Normalize source (trim + lowercase) to avoid mismatches
    const normalizedSource = source.trim().toLowerCase();

    // Define strategy pools for each channel
    const emailStrategies = [
      STRATEGY_TYPES.EMAIL_DETAILED_RESPONSE,
      STRATEGY_TYPES.EMAIL_BRIEF_CTA,
      STRATEGY_TYPES.EMAIL_STORYTELLING,
      STRATEGY_TYPES.EMAIL_FAQ_PREEMPTIVE,
      STRATEGY_TYPES.EMAIL_SOCIAL_PROOF,
      STRATEGY_TYPES.EMAIL_PERSONALIZED_RECOMMENDATION,
      STRATEGY_TYPES.EMAIL_MULTI_TOUCH_SEQUENCE,
      STRATEGY_TYPES.EMAIL_DIRECT_BOOKING,
    ];

    const whatsappStrategies = [
      STRATEGY_TYPES.RAPPORT_FIRST,
      STRATEGY_TYPES.WHATSAPP_ULTRA_CASUAL,
      STRATEGY_TYPES.WHATSAPP_PROFESSIONAL,
      STRATEGY_TYPES.WHATSAPP_QUESTION_SEQUENCE,
      STRATEGY_TYPES.WHATSAPP_BENEFIT_LED,
      STRATEGY_TYPES.WHATSAPP_URGENCY_DRIVER,
      STRATEGY_TYPES.WHATSAPP_CONSULTATION,
      STRATEGY_TYPES.WHATSAPP_MICRO_COMMITMENTS,
    ];

    const webStrategies = [
      STRATEGY_TYPES.PORTAL_FAST_TRACK,
      STRATEGY_TYPES.WEB_INSTANT_GRATIFICATION,
      STRATEGY_TYPES.WEB_COMPARISON_HELPER,
      STRATEGY_TYPES.WEB_VIRTUAL_TOUR_PUSHER,
      STRATEGY_TYPES.WEB_CALENDAR_FIRST,
    ];

    const phoneStrategies = [
      STRATEGY_TYPES.CONCIERGE_FOLLOW_UP,
      STRATEGY_TYPES.PHONE_CALLBACK_BOOKING,
      STRATEGY_TYPES.PHONE_TRANSCRIPT_FRIENDLY,
      STRATEGY_TYPES.VIP_WHITE_GLOVE,
    ];

    // Source-to-strategy-pool mapping
    const sourcePoolMap: Record<string, string[]> = {
      // Email sources → Email strategies
      email: emailStrategies,
      'email_parser': emailStrategies,
      'email_enquiry': emailStrategies,
      gmail: emailStrategies,
      outlook: emailStrategies,
      
      // WhatsApp/SMS sources → WhatsApp strategies
      whatsapp: whatsappStrategies,
      sms: whatsappStrategies,
      messenger: whatsappStrategies,
      
      // Web/Portal sources → Web strategies
      website: webStrategies,
      web: webStrategies,
      rightmove: webStrategies,
      zoopla: webStrategies,
      'student.com': webStrategies,
      'accommodation for students': webStrategies,
      uniplaces: webStrategies,
      openrent: webStrategies,
      live_chat: webStrategies,
      
      // Phone sources → Phone strategies
      phone: phoneStrategies,
      call: phoneStrategies,
      justcall: phoneStrategies,
    };

    // Get the strategy pool for this source
    const strategyPool = sourcePoolMap[normalizedSource];
    if (!strategyPool || strategyPool.length === 0) {
      console.warn(`⚠️ Unknown source '${normalizedSource}' - defaulting to WhatsApp strategy pool`);
      // Default to WhatsApp strategies instead of weighted random across ALL strategies
      // This prevents email-specific prompts being used for WhatsApp leads, etc.
      const whatsappPool = sourcePoolMap['whatsapp'];
      const whatsappStrategies = strategies.filter(s => 
        whatsappPool.includes(s.strategyType as any) && s.isActive
      );
      
      if (whatsappStrategies.length === 0) {
        return null; // Final fallback to weighted random if no WhatsApp strategies available
      }
      
      const randomIndex = Math.floor(Math.random() * whatsappStrategies.length);
      return { id: whatsappStrategies[randomIndex].id };
    }

    // Filter active strategies from this pool
    const availableStrategies = strategies.filter(s => 
      strategyPool.includes(s.strategyType as any) && s.isActive
    );

    if (availableStrategies.length === 0) {
      return null; // No active strategies in this pool
    }

    // Randomly select from the pool for A/B testing
    const randomIndex = Math.floor(Math.random() * availableStrategies.length);
    return { id: availableStrategies[randomIndex].id };
  }

  /**
   * Get Concierge strategy for re-engagement
   */
  private async getConciergeStrategyId(): Promise<string> {
    const strategies = await storage.getActiveStrategies();
    const concierge = strategies.find(s => s.strategyType === STRATEGY_TYPES.CONCIERGE_FOLLOW_UP);
    
    if (!concierge) {
      // Fallback to rapport-first
      const rapportFirst = strategies.find(s => s.strategyType === STRATEGY_TYPES.RAPPORT_FIRST);
      return rapportFirst?.id || strategies[0].id;
    }
    
    return concierge.id;
  }

  /**
   * Get strategy using weighted random selection
   */
  private async getWeightedRandomStrategy(): Promise<string> {
    const strategies = await storage.getActiveStrategies();
    
    if (strategies.length === 0) {
      throw new Error('No active strategies available');
    }

    // Calculate total weight
    const totalWeight = strategies.reduce((sum, s) => sum + (s.priority || 0), 0);

    // If all priorities are 0 or equal, use simple random
    if (totalWeight === 0) {
      const randomIndex = Math.floor(Math.random() * strategies.length);
      return strategies[randomIndex].id;
    }

    // Weighted random selection
    let random = Math.random() * totalWeight;
    
    for (const strategy of strategies) {
      random -= (strategy.priority || 0);
      if (random <= 0) {
        return strategy.id;
      }
    }

    // Fallback (shouldn't reach here)
    return strategies[0].id;
  }

  /**
   * Get strategy assignment for a lead
   */
  async getAssignment(leadId: string) {
    return await storage.getStrategyAssignment(leadId);
  }

  /**
   * Manually override strategy for a lead
   */
  async overrideStrategy(leadId: string, strategyId: string): Promise<void> {
    const lead = await storage.getLead(leadId);
    if (!lead) {
      throw new Error('Lead not found');
    }

    // Create new assignment with manual override
    const assignment: InsertStrategyAssignment = {
      leadId,
      strategyId,
      source: lead.source || 'unknown',
      assignedBy: "manual",
      confidenceScore: "1.00",
      isManualOverride: true,
      assignmentMetadata: {
        overriddenAt: new Date().toISOString(),
      },
    };

    await storage.assignStrategy(assignment);
    console.log(`✅ Manually overridden strategy for lead ${leadId} to ${strategyId}`);
  }
}

export const strategyAssignmentService = new StrategyAssignmentService();
