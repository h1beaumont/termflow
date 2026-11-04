// Follow-up Service for Automated Dormant Lead Re-engagement
import { storage } from "./storage";
import { aiService } from "./aiService";
import { sendWhatsAppMessage } from "./twilioService";
import { db } from "./db";
import { leads, conversations, messages, followUps } from "@shared/schema";
import { safeLog, safeError, hashPII } from './piiSanitizer';
import { eq, desc, and, sql, lt } from "drizzle-orm";

interface DormantLead {
  lead: any;
  lastActivity: Date;
  daysSinceActivity: number;
  property?: any;
  room?: any;
}

const DORMANT_THRESHOLDS = {
  new_enquiry: 2, // 2 days
  viewing_booked: 3, // 3 days
  viewed_awaiting_application: 4, // 4 days
};

const FOLLOW_UP_COOLDOWN_DAYS = 7; // Don't send follow-ups within 7 days of last one

export class FollowUpService {
  /**
   * Get dormant leads that need follow-up
   */
  async getDormantLeads(propertyId?: string): Promise<DormantLead[]> {
    const now = new Date();
    const dormantLeads: DormantLead[] = [];

    // Get all leads in follow-up eligible stages
    const eligibleStages = Object.keys(DORMANT_THRESHOLDS);
    const allLeads = await db
      .select()
      .from(leads)
      .where(
        propertyId 
          ? and(
              eq(leads.propertyId, propertyId),
              sql`${leads.stage} IN (${sql.join(eligibleStages.map(s => sql`${s}`), sql`, `)})`
            )
          : sql`${leads.stage} IN (${sql.join(eligibleStages.map(s => sql`${s}`), sql`, `)})`
      );

    for (const lead of allLeads) {
      // Skip if no WhatsApp number
      if (!lead.whatsappNumber) continue;

      // Check for recent follow-up (within 7 days)
      const latestFollowUp = await storage.getLatestFollowUp(lead.id);
      if (latestFollowUp) {
        const daysSinceFollowUp = Math.floor(
          (now.getTime() - new Date(latestFollowUp.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceFollowUp < FOLLOW_UP_COOLDOWN_DAYS) {
          continue; // Skip, too soon since last follow-up
        }
      }

      // Get last message timestamp for this lead
      let lastMessageDate: Date | null = null;
      const leadConversations = await storage.getConversationsByLead(lead.id);
      
      if (leadConversations.length > 0) {
        for (const conv of leadConversations) {
          const convMessages = await storage.getMessagesByConversation(conv.id, 1);
          if (convMessages.length > 0) {
            const msgDate = new Date(convMessages[0].createdAt);
            if (!lastMessageDate || msgDate > lastMessageDate) {
              lastMessageDate = msgDate;
            }
          }
        }
      }

      // Determine last activity (max of lead.updatedAt and last message)
      const leadUpdatedAt = new Date(lead.updatedAt);
      const lastActivity = lastMessageDate && lastMessageDate > leadUpdatedAt 
        ? lastMessageDate 
        : leadUpdatedAt;

      // Calculate days since last activity
      const daysSinceActivity = Math.floor(
        (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Check if dormant based on stage threshold
      const threshold = DORMANT_THRESHOLDS[lead.stage as keyof typeof DORMANT_THRESHOLDS];
      if (threshold && daysSinceActivity >= threshold) {
        // Get property and room details if available
        let property = undefined;
        let room = undefined;
        
        if (lead.propertyId) {
          property = await storage.getProperty(lead.propertyId);
        }
        if (lead.roomId) {
          room = await storage.getRoom(lead.roomId);
        }

        dormantLeads.push({
          lead,
          lastActivity,
          daysSinceActivity,
          property,
          room,
        });
      }
    }

    return dormantLeads;
  }

  /**
   * Send automated follow-up to a specific lead
   */
  async sendFollowUp(leadId: string): Promise<void> {
    const lead = await storage.getLead(leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }

    if (!lead.whatsappNumber) {
      throw new Error("Lead has no WhatsApp number");
    }

    // Get property and room details
    let property = undefined;
    let room = undefined;
    
    if (lead.propertyId) {
      property = await storage.getProperty(lead.propertyId);
    }
    if (lead.roomId) {
      room = await storage.getRoom(lead.roomId);
    }

    // Get last few messages for context
    const leadConversations = await storage.getConversationsByLead(leadId);
    let lastMessages: any[] = [];
    
    if (leadConversations.length > 0) {
      const whatsappConv = leadConversations.find(c => c.channel === 'whatsapp') || leadConversations[0];
      const convMessages = await storage.getMessagesByConversation(whatsappConv.id, 5);
      lastMessages = convMessages.reverse();
    }

    // Generate AI follow-up message
    const followUpMessage = await aiService.generateFollowUpMessage(
      lead,
      property,
      room,
      lastMessages
    );

    // Persist follow-up to database
    await storage.createFollowUp({
      leadId: lead.id,
      type: 'dormant_lead',
      message: followUpMessage,
      channel: 'whatsapp',
      status: 'sent',
    });

    // Send via WhatsApp
    await sendWhatsAppMessage(lead.whatsappNumber, followUpMessage);

    safeLog('Follow-up sent', { 
      leadId: lead.id,
      nameHash: hashPII(lead.name || ''),
      whatsappHash: hashPII(lead.whatsappNumber || '')
    });
  }

  /**
   * Send follow-ups to all dormant leads (for scheduled job)
   */
  async sendDormantFollowUps(propertyId?: string): Promise<{ sent: number; errors: number }> {
    const dormantLeads = await this.getDormantLeads(propertyId);
    
    let sent = 0;
    let errors = 0;

    for (const { lead } of dormantLeads) {
      try {
        await this.sendFollowUp(lead.id);
        sent++;
      } catch (error) {
        safeError('Failed to send follow-up', error);
        errors++;
      }
    }

    return { sent, errors };
  }
}

export const followUpService = new FollowUpService();
