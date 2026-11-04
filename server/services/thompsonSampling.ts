import { db } from "../db";
import {
  messageTemplateVariants,
  templateBanditStats,
  templateShowEvents,
  templateFlags,
  type MessageTemplateVariant,
  type InsertTemplateBanditStats,
  type InsertTemplateShowEvent,
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface CohortContext {
  source: string;
  nationality: string;
  groupSize: number;
  hour: number;
}

export interface SelectTemplateParams {
  stage: string;
  channel: string;
  context: CohortContext;
  epsilon?: number;
}

export interface RecordTemplateShownParams {
  leadId: string;
  templateId: string;
  stage: string;
  channel: string;
  cohortKey: string;
  messageSid?: string;
  emailMessageId?: string;
}

export interface UpdateRewardParams {
  showEventId: string;
  outcome: 'clicked' | 'converted' | 'ignored' | 'bounced';
  partialReward: number;
}

class ThompsonSamplingService {
  /**
   * Sample from Gamma distribution using Marsaglia and Tsang's method
   * Reference: "A Simple Method for Generating Gamma Variables" (2000)
   */
  private sampleGamma(k: number, theta: number): number {
    if (k < 1) {
      // For k < 1, use transformation method: Gamma(k) = Gamma(k+1) * U^(1/k)
      const gammaKPlus1 = this.sampleGamma(k + 1, theta);
      const u = Math.random();
      return gammaKPlus1 * Math.pow(u, 1 / k);
    }

    // Marsaglia and Tsang's method for k >= 1
    const d = k - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);

    while (true) {
      let x: number;
      let v: number;

      // Generate x from standard normal and v
      do {
        x = this.sampleNormal(0, 1);
        v = 1 + c * x;
      } while (v <= 0);

      v = v * v * v;
      const u = Math.random();
      const x2 = x * x;

      // Accept/reject
      if (u < 1 - 0.0331 * x2 * x2) {
        return d * v * theta;
      }

      if (Math.log(u) < 0.5 * x2 + d * (1 - v + Math.log(v))) {
        return d * v * theta;
      }
    }
  }

  /**
   * Sample from standard normal distribution using Box-Muller transform
   */
  private sampleNormal(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }

  /**
   * Sample from Beta distribution using ratio of gammas
   * Beta(a,b) = Gamma(a,1) / (Gamma(a,1) + Gamma(b,1))
   */
  private sampleBeta(alpha: number, beta: number): number {
    const x = this.sampleGamma(alpha, 1);
    const y = this.sampleGamma(beta, 1);
    return x / (x + y);
  }

  /**
   * Generate cohort key from context
   * Format: "source|nationality|groupType|timeOfDay"
   * Example: "whatsapp|uk|solo|day" or "portal|intl|group|night"
   */
  generateCohortKey(context: CohortContext): string {
    const groupType = context.groupSize > 1 ? 'group' : 'solo';
    const timeOfDay = (context.hour >= 20 || context.hour < 7) ? 'night' : 'day';
    
    // Normalize nationality to "uk" or "intl"
    const nationalityKey = context.nationality.toLowerCase() === 'uk' ? 'uk' : 'intl';
    
    return `${context.source}|${nationalityKey}|${groupType}|${timeOfDay}`;
  }

  /**
   * Check if template is eligible based on context and eligibility flags
   */
  private isEligible(template: MessageTemplateVariant, context: CohortContext): boolean {
    const flags = template.eligibilityFlags || [];
    
    if (flags.length === 0) {
      return true;
    }

    // If template has "intl" flag, require international nationality
    if (flags.includes('intl') && context.nationality.toLowerCase() === 'uk') {
      return false;
    }
    
    // If template has "uk" flag, require UK nationality
    if (flags.includes('uk') && context.nationality.toLowerCase() !== 'uk') {
      return false;
    }
    
    // If template has "portal" flag, require portal source
    if (flags.includes('portal') && context.source !== 'portal') {
      return false;
    }
    
    // If template has "day" flag, require daytime (7am-8pm)
    if (flags.includes('day') && !(context.hour >= 7 && context.hour < 20)) {
      return false;
    }
    
    // If template has "night" flag, require nighttime (8pm-7am)
    if (flags.includes('night') && !(context.hour >= 20 || context.hour < 7)) {
      return false;
    }
    
    // If template has "group" flag, require groupSize > 1
    if (flags.includes('group') && !(context.groupSize > 1)) {
      return false;
    }
    
    // If template has "solo" flag, require groupSize <= 1
    if (flags.includes('solo') && !(context.groupSize <= 1)) {
      return false;
    }
    
    return true;
  }

  /**
   * Select template using Thompson Sampling with eligibility filtering
   */
  async selectTemplate(params: SelectTemplateParams): Promise<{
    template: MessageTemplateVariant;
    cohortKey: string;
  }> {
    const { stage, channel, context, epsilon = 0.15 } = params;
    
    // Generate cohort key
    const cohortKey = this.generateCohortKey(context);

    // 1. Get all templates for this stage/channel (excluding disabled ones)
    const result = await db.execute(sql`
      SELECT t.*
      FROM message_template_variants t
      LEFT JOIN template_flags f
        ON f.channel = t.channel AND f.template_id = t.id
      WHERE t.stage = ${stage}
        AND t.channel = ${channel}
        AND t.is_active = true
        AND COALESCE(f.disabled, FALSE) = FALSE
    `);
    
    const allTemplates = result.rows as MessageTemplateVariant[];

    if (allTemplates.length === 0) {
      throw new Error(`No active templates found for stage=${stage}, channel=${channel}`);
    }

    // 2. Filter by eligibility
    const eligibleTemplates = allTemplates.filter(t => this.isEligible(t, context));

    if (eligibleTemplates.length === 0) {
      console.warn(`No eligible templates found for cohort ${cohortKey}, falling back to all templates`);
      // Fallback to all templates if no eligible ones
      return {
        template: allTemplates[Math.floor(Math.random() * allTemplates.length)],
        cohortKey,
      };
    }

    // 3. Epsilon-greedy exploration
    if (Math.random() < epsilon) {
      // Random exploration
      const randomTemplate = eligibleTemplates[Math.floor(Math.random() * eligibleTemplates.length)];
      console.log(`🎲 Exploration: Randomly selected template ${randomTemplate.templateKey}`);
      return {
        template: randomTemplate,
        cohortKey,
      };
    }

    // 4. Thompson Sampling exploitation
    // Get bandit stats for each template in this cohort
    const templateIds = eligibleTemplates.map(t => t.id);
    const banditStats = await db
      .select()
      .from(templateBanditStats)
      .where(
        and(
          sql`${templateBanditStats.templateId} = ANY(${templateIds})`,
          eq(templateBanditStats.cohortKey, cohortKey)
        )
      );

    // Create a map for quick lookup
    const statsMap = new Map(banditStats.map(s => [s.templateId, s]));

    // Sample from Beta distribution for each template
    const sampledValues = eligibleTemplates.map(template => {
      const stats = statsMap.get(template.id);
      
      // Default prior: Beta(1, 1) - uniform distribution
      const alpha = stats ? parseFloat(stats.alpha as string) : 1.0;
      const beta = stats ? parseFloat(stats.beta as string) : 1.0;
      
      const sampledValue = this.sampleBeta(alpha, beta);
      
      return {
        template,
        sampledValue,
        alpha,
        beta,
      };
    });

    // Select template with highest sampled value
    const selected = sampledValues.reduce((best, current) => 
      current.sampledValue > best.sampledValue ? current : best
    );

    console.log(`🎯 Thompson Sampling: Selected template ${selected.template.templateKey} (sampled=${selected.sampledValue.toFixed(4)}, α=${selected.alpha}, β=${selected.beta})`);

    return {
      template: selected.template,
      cohortKey,
    };
  }

  /**
   * Record that a template was shown to a lead
   */
  async recordTemplateShown(params: RecordTemplateShownParams): Promise<string> {
    const { leadId, templateId, stage, channel, cohortKey, messageSid, emailMessageId } = params;

    // 1. Create show event record
    const [showEvent] = await db
      .insert(templateShowEvents)
      .values({
        leadId,
        templateId,
        stage,
        channel,
        cohortKey,
        messageSid,
        emailMessageId,
      })
      .returning();

    // 2. Upsert bandit stats
    const now = new Date();
    
    await db
      .insert(templateBanditStats)
      .values({
        templateId,
        cohortKey,
        alpha: "1.0",
        beta: "1.0",
        shownCount: 1,
        totalReward: "0.0",
        lastShownAt: now,
        lastUpdatedAt: now,
      })
      .onConflictDoUpdate({
        target: [templateBanditStats.templateId, templateBanditStats.cohortKey],
        set: {
          shownCount: sql`${templateBanditStats.shownCount} + 1`,
          lastShownAt: now,
          lastUpdatedAt: now,
        },
      });

    console.log(`✅ Recorded template show: templateId=${templateId}, cohortKey=${cohortKey}, showEventId=${showEvent.id}`);

    return showEvent.id;
  }

  /**
   * Update reward based on template outcome
   */
  async updateReward(params: UpdateRewardParams): Promise<void> {
    const { showEventId, outcome, partialReward } = params;

    // Validate partial reward
    if (partialReward < 0 || partialReward > 1) {
      throw new Error(`partialReward must be between 0 and 1, got ${partialReward}`);
    }

    // 1. Update show event with outcome
    const [updatedEvent] = await db
      .update(templateShowEvents)
      .set({
        outcome,
        partialReward: partialReward.toFixed(2),
        outcomeAt: new Date(),
      })
      .where(eq(templateShowEvents.id, showEventId))
      .returning();

    if (!updatedEvent) {
      throw new Error(`Show event ${showEventId} not found`);
    }

    // 2. Find corresponding bandit stats
    const [stats] = await db
      .select()
      .from(templateBanditStats)
      .where(
        and(
          eq(templateBanditStats.templateId, updatedEvent.templateId),
          eq(templateBanditStats.cohortKey, updatedEvent.cohortKey)
        )
      );

    if (!stats) {
      console.error(`Bandit stats not found for templateId=${updatedEvent.templateId}, cohortKey=${updatedEvent.cohortKey}`);
      return;
    }

    // 3. Update alpha and beta using Bayesian update
    // Alpha represents "successes" (weighted by reward)
    // Beta represents "failures" (weighted by 1 - reward)
    const currentAlpha = parseFloat(stats.alpha as string);
    const currentBeta = parseFloat(stats.beta as string);
    const currentTotalReward = parseFloat(stats.totalReward as string);

    const newAlpha = currentAlpha + partialReward;
    const newBeta = currentBeta + (1 - partialReward);
    const newTotalReward = currentTotalReward + partialReward;

    await db
      .update(templateBanditStats)
      .set({
        alpha: newAlpha.toFixed(4),
        beta: newBeta.toFixed(4),
        totalReward: newTotalReward.toFixed(4),
        lastUpdatedAt: new Date(),
      })
      .where(eq(templateBanditStats.id, stats.id));

    console.log(`📊 Updated bandit stats: templateId=${updatedEvent.templateId}, cohortKey=${updatedEvent.cohortKey}, α=${newAlpha.toFixed(4)}, β=${newBeta.toFixed(4)}, outcome=${outcome}, reward=${partialReward}`);
  }

  /**
   * Get bandit stats for a specific template and cohort
   */
  async getBanditStats(templateId: string, cohortKey: string) {
    const [stats] = await db
      .select()
      .from(templateBanditStats)
      .where(
        and(
          eq(templateBanditStats.templateId, templateId),
          eq(templateBanditStats.cohortKey, cohortKey)
        )
      );

    return stats;
  }

  /**
   * Get all show events for a lead
   */
  async getLeadShowEvents(leadId: string) {
    return await db
      .select()
      .from(templateShowEvents)
      .where(eq(templateShowEvents.leadId, leadId));
  }

  /**
   * Get performance summary for a template across all cohorts
   */
  async getTemplatePerformance(templateId: string) {
    const stats = await db
      .select()
      .from(templateBanditStats)
      .where(eq(templateBanditStats.templateId, templateId));

    return stats.map(s => ({
      cohortKey: s.cohortKey,
      alpha: parseFloat(s.alpha as string),
      beta: parseFloat(s.beta as string),
      shownCount: s.shownCount,
      totalReward: parseFloat(s.totalReward as string),
      averageReward: s.shownCount > 0 
        ? (parseFloat(s.totalReward as string) / s.shownCount).toFixed(4)
        : "0.0000",
      estimatedCTR: (() => {
        const alpha = parseFloat(s.alpha as string);
        const beta = parseFloat(s.beta as string);
        return (alpha / (alpha + beta)).toFixed(4);
      })(),
      lastShownAt: s.lastShownAt,
    }));
  }
}

export const thompsonSamplingService = new ThompsonSamplingService();
