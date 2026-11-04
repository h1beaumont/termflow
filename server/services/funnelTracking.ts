// Funnel Event Tracking Service
// Tracks conversion milestones for A/B testing analytics

import { storage } from "../storage";
import type { InsertStrategyEvent } from "@shared/schema";

export type FunnelEvent = 
  | "contact_captured"
  | "viewing_booked"
  | "deposit_paid"
  | "contract_signed"
  | "moved_in";

export interface FunnelEventContext {
  leadId: string;
  funnelStage: FunnelEvent;
  metadata?: Record<string, any>;
}

export class FunnelTrackingService {
  /**
   * Track a funnel event for a lead
   */
  async trackEvent(context: FunnelEventContext): Promise<void> {
    const { leadId, funnelStage, metadata } = context;

    try {
      // Get strategy assignment for this lead
      const assignment = await storage.getStrategyAssignment(leadId);
      
      if (!assignment) {
        console.log(`⚠️ No strategy assignment found for lead ${leadId} - skipping event tracking`);
        return;
      }

      // Check if event already tracked (idempotency)
      const existingEvent = await storage.getStrategyEventByFunnelStage(
        assignment.strategyId,
        leadId,
        funnelStage
      );

      if (existingEvent) {
        console.log(`ℹ️ Event ${funnelStage} already tracked for lead ${leadId}`);
        return;
      }

      // Create strategy event
      const event: InsertStrategyEvent = {
        strategyId: assignment.strategyId,
        leadId,
        funnelStage,
        channel: 'whatsapp', // Default channel, can be overridden in metadata
        metadata,
      };

      await storage.trackStrategyEvent(event);
      console.log(`✅ Tracked funnel event: ${funnelStage} for lead ${leadId} (strategy: ${assignment.strategyId})`);

      // Update strategy performance metrics
      await this.updateStrategyPerformance(assignment.strategyId);
    } catch (error) {
      console.error(`❌ Error tracking funnel event ${funnelStage} for lead ${leadId}:`, error);
    }
  }

  /**
   * Track contact capture milestone
   */
  async trackContactCaptured(leadId: string, metadata?: { 
    hasName?: boolean;
    hasEmail?: boolean;
    hasMobile?: boolean;
    captureMethod?: string; // "whatsapp", "website_form", "phone_call"
  }): Promise<void> {
    await this.trackEvent({
      leadId,
      funnelStage: "contact_captured",
      metadata,
    });
  }

  /**
   * Track viewing booked milestone
   */
  async trackViewingBooked(leadId: string, viewingId: string): Promise<void> {
    await this.trackEvent({
      leadId,
      funnelStage: "viewing_booked",
      metadata: { viewingId },
    });
  }

  /**
   * Track deposit paid milestone
   */
  async trackDepositPaid(leadId: string, metadata?: {
    amount?: number;
    paymentIntentId?: string;
  }): Promise<void> {
    await this.trackEvent({
      leadId,
      funnelStage: "deposit_paid",
      metadata,
    });
  }

  /**
   * Track contract signed milestone
   */
  async trackContractSigned(leadId: string, contractId: string): Promise<void> {
    await this.trackEvent({
      leadId,
      funnelStage: "contract_signed",
      metadata: { contractId },
    });
  }

  /**
   * Update strategy performance metrics from events
   */
  private async updateStrategyPerformance(strategyId: string): Promise<void> {
    try {
      // Get all assignments for this strategy
      const assignments = await storage.getAssignmentsByStrategy(strategyId);
      const totalLeads = assignments.length;

      if (totalLeads === 0) return;

      // Count conversions at each stage
      const contactCaptured = await storage.countStrategyEventsByFunnelStage(strategyId, "contact_captured");
      const viewingsBooked = await storage.countStrategyEventsByFunnelStage(strategyId, "viewing_booked");
      const depositsPaid = await storage.countStrategyEventsByFunnelStage(strategyId, "deposit_paid");
      const contractsSigned = await storage.countStrategyEventsByFunnelStage(strategyId, "contract_signed");

      // Calculate conversion rates
      const contactCaptureRate = ((contactCaptured / totalLeads) * 100).toFixed(2);
      const viewingBookingRate = ((viewingsBooked / totalLeads) * 100).toFixed(2);
      const depositConversionRate = ((depositsPaid / totalLeads) * 100).toFixed(2);
      const contractConversionRate = ((contractsSigned / totalLeads) * 100).toFixed(2);

      // Upsert performance record
      await storage.upsertStrategyPerformanceMetrics({
        strategyId,
        totalLeads,
        contactsCaptured: contactCaptured,
        viewingsBooked,
        depositsPaid,
        contractsSigned,
        contactCaptureRate,
        viewingBookingRate,
        depositConversionRate,
        contractConversionRate,
      });

      console.log(`📊 Updated performance for strategy ${strategyId}: ${totalLeads} leads, ${contactCaptureRate}% contact capture`);
    } catch (error) {
      console.error(`❌ Error updating strategy performance for ${strategyId}:`, error);
    }
  }

  /**
   * Check if contact is complete (name + email + mobile)
   */
  isContactComplete(lead: { name?: string | null; email?: string | null; mobile?: string | null }): boolean {
    return !!(lead.name && lead.email && lead.mobile);
  }
}

export const funnelTrackingService = new FunnelTrackingService();
