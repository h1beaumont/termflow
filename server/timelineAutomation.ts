/**
 * TIMELINE AUTOMATION SERVICE
 * 
 * Provides granular, human-feeling reminders and nudges throughout the tenant journey:
 * - Viewing reminders (24h before, 2h before)
 * - Post-viewing follow-ups (2h after)
 * - Hold expiry nudges (24h before, 1h before)
 * - IDV reminders (12h, 48h after sending)
 * - Contract signing nudges (24h, 72h after sending)
 * 
 * Runs every 60 seconds for precise timing.
 */

import { db } from './db';
import { leads, viewings } from '@shared/schema';
import { eq, and, lt, gt, isNull } from 'drizzle-orm';
import { sendWhatsAppMessage } from './twilioService';
import { safeLog, safeError } from './piiSanitizer';
import { thompsonSamplingService } from './services/thompsonSampling';
import { replaceVariables, extractLeadContext, formatViewingTime } from './utils/templateHelpers';

// Track which leads have been processed for each nudge type
const processedNudges = new Map<string, Set<string>>();

function hasBeenProcessed(nudgeType: string, leadId: string): boolean {
  const processed = processedNudges.get(nudgeType);
  return processed ? processed.has(leadId) : false;
}

function markAsProcessed(nudgeType: string, leadId: string): void {
  if (!processedNudges.has(nudgeType)) {
    processedNudges.set(nudgeType, new Set());
  }
  processedNudges.get(nudgeType)!.add(leadId);
}

// Helper to format time for messages
function formatTime(date: Date): string {
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Helper to check if time is within window
function isWithinWindow(targetTime: Date, windowStart: number, windowEnd: number): boolean {
  const now = Date.now();
  const target = targetTime.getTime();
  const timeDiff = target - now;
  return timeDiff >= windowStart && timeDiff <= windowEnd;
}

/**
 * Main automation loop - runs every 60 seconds
 */
export async function runTimelineAutomation() {
  try {
    await Promise.all([
      processViewingReminders(),
      processPostViewingFollowUps(),
      processHoldNudges(),
      processIDVNudges(),
      processContractNudges(),
    ]);
  } catch (error) {
    safeError('Timeline automation error', error);
  }
}

/**
 * Viewing Reminders
 * - 24h before: Gentle reminder with viewing details
 * - 2h before: Final reminder with option to switch to video
 */
async function processViewingReminders() {
  try {
    const now = new Date();
    
    // Get all upcoming viewings
    const upcomingViewings = await db.select()
      .from(viewings)
      .where(
        and(
          eq(viewings.status, 'booked'),
          gt(viewings.scheduledAt, now)
        )
      );

    for (const viewing of upcomingViewings) {
      if (!viewing.leadId || !viewing.scheduledAt) continue;

      const lead = await db.select()
        .from(leads)
        .where(eq(leads.id, viewing.leadId))
        .then(rows => rows[0]);

      if (!lead || !lead.whatsappNumber || lead.whatsappOptOut) continue;

      const viewingTime = new Date(viewing.scheduledAt);
      const context = extractLeadContext(lead);
      
      // 24h reminder (between 24h and 23h before)
      if (isWithinWindow(viewingTime, 23 * 3600 * 1000, 24 * 3600 * 1000)) {
        const nudgeKey = `viewing-24h-${viewing.id}`;
        if (!hasBeenProcessed(nudgeKey, lead.id)) {
          try {
            // Select template using Thompson Sampling
            const { template, cohortKey } = await thompsonSamplingService.selectTemplate({
              stage: 'viewing_rem_24h',
              channel: 'wa',
              context,
            });

            // Replace variables
            const messageText = replaceVariables(template.textContent, {
              viewingTime: formatViewingTime(viewingTime),
            });

            // Send message and get SID
            const sid = await sendWhatsAppMessage(lead.whatsappNumber, messageText);

            // Record template usage
            await thompsonSamplingService.recordTemplateShown({
              leadId: lead.id,
              templateId: template.id,
              stage: 'viewing_rem_24h',
              channel: 'wa',
              cohortKey,
              messageSid: sid,
            });

            markAsProcessed(nudgeKey, lead.id);
            safeLog('Sent 24h viewing reminder', { viewingId: viewing.id, templateId: template.id });
          } catch (error) {
            safeError('Failed to send 24h viewing reminder with Thompson Sampling', error);
          }
        }
      }

      // 2h reminder (between 2h and 1.5h before)
      if (isWithinWindow(viewingTime, 1.5 * 3600 * 1000, 2 * 3600 * 1000)) {
        const nudgeKey = `viewing-2h-${viewing.id}`;
        if (!hasBeenProcessed(nudgeKey, lead.id)) {
          try {
            // Select template using Thompson Sampling
            const { template, cohortKey } = await thompsonSamplingService.selectTemplate({
              stage: 'viewing_rem_2h',
              channel: 'wa',
              context,
            });

            // Replace variables
            const messageText = replaceVariables(template.textContent, {
              viewingTime: formatViewingTime(viewingTime),
            });

            // Send message and get SID
            const sid = await sendWhatsAppMessage(lead.whatsappNumber, messageText);

            // Record template usage
            await thompsonSamplingService.recordTemplateShown({
              leadId: lead.id,
              templateId: template.id,
              stage: 'viewing_rem_2h',
              channel: 'wa',
              cohortKey,
              messageSid: sid,
            });

            markAsProcessed(nudgeKey, lead.id);
            safeLog('Sent 2h viewing reminder', { viewingId: viewing.id, templateId: template.id });
          } catch (error) {
            safeError('Failed to send 2h viewing reminder with Thompson Sampling', error);
          }
        }
      }
    }
  } catch (error) {
    safeError('Viewing reminders error', error);
  }
}

/**
 * Post-Viewing Follow-Ups
 * - 2h after viewing: Check how it went and next steps
 */
async function processPostViewingFollowUps() {
  try {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 3600 * 1000);
    
    // Get completed viewings from ~2h ago
    const completedViewings = await db.select()
      .from(viewings)
      .where(
        and(
          eq(viewings.status, 'completed'),
          lt(viewings.scheduledAt, twoHoursAgo),
          isNull(viewings.outcome) // Only follow up if outcome not recorded
        )
      );

    for (const viewing of completedViewings) {
      if (!viewing.leadId || !viewing.scheduledAt) continue;

      const viewingTime = new Date(viewing.scheduledAt);
      const timeSinceViewing = now.getTime() - viewingTime.getTime();
      
      // Between 2h and 2.5h after
      if (timeSinceViewing >= 2 * 3600 * 1000 && timeSinceViewing <= 2.5 * 3600 * 1000) {
        const nudgeKey = `post-viewing-${viewing.id}`;
        
        const lead = await db.select()
          .from(leads)
          .where(eq(leads.id, viewing.leadId))
          .then(rows => rows[0]);

        if (!lead || !lead.whatsappNumber || lead.whatsappOptOut) continue;
        
        if (!hasBeenProcessed(nudgeKey, lead.id)) {
          try {
            const context = extractLeadContext(lead);
            
            // Select template using Thompson Sampling
            const { template, cohortKey } = await thompsonSamplingService.selectTemplate({
              stage: 'post_view_follow',
              channel: 'wa',
              context,
            });

            // Replace variables
            const messageText = replaceVariables(template.textContent, {});

            // Send message and get SID
            const sid = await sendWhatsAppMessage(lead.whatsappNumber, messageText);

            // Record template usage
            await thompsonSamplingService.recordTemplateShown({
              leadId: lead.id,
              templateId: template.id,
              stage: 'post_view_follow',
              channel: 'wa',
              cohortKey,
              messageSid: sid,
            });

            markAsProcessed(nudgeKey, lead.id);
            safeLog('Sent post-viewing follow-up', { viewingId: viewing.id, templateId: template.id });
          } catch (error) {
            safeError('Failed to send post-viewing follow-up with Thompson Sampling', error);
          }
        }
      }
    }
  } catch (error) {
    safeError('Post-viewing follow-ups error', error);
  }
}

/**
 * Hold Expiry Nudges
 * - 24h before expiry: Gentle reminder to complete ID check
 * - 1h before expiry: Urgent nudge to secure the room
 */
async function processHoldNudges() {
  try {
    const now = new Date();
    
    // Get all active holds
    const activeHolds = await db.select()
      .from(leads)
      .where(
        and(
          eq(leads.holdActive, true),
          gt(leads.holdExpiresAt, now)
        )
      );

    for (const lead of activeHolds) {
      if (!lead.whatsappNumber || lead.whatsappOptOut || !lead.holdExpiresAt) continue;

      const expiryTime = new Date(lead.holdExpiresAt);
      const context = extractLeadContext(lead);
      
      // 24h nudge (between 24h and 23h before)
      if (!lead.hold24hNudgeSent && isWithinWindow(expiryTime, 23 * 3600 * 1000, 24 * 3600 * 1000)) {
        try {
          // Select template using Thompson Sampling
          const { template, cohortKey } = await thompsonSamplingService.selectTemplate({
            stage: 'hold_nudge_24h',
            channel: 'wa',
            context,
          });

          // Replace variables
          const messageText = replaceVariables(template.textContent, {
            expiryTime: formatViewingTime(expiryTime),
          });

          // Send message and get SID
          const sid = await sendWhatsAppMessage(lead.whatsappNumber, messageText);

          // Record template usage
          await thompsonSamplingService.recordTemplateShown({
            leadId: lead.id,
            templateId: template.id,
            stage: 'hold_nudge_24h',
            channel: 'wa',
            cohortKey,
            messageSid: sid,
          });

          await db.update(leads)
            .set({ hold24hNudgeSent: true })
            .where(eq(leads.id, lead.id));
          safeLog('Sent 24h hold nudge', { leadId: lead.id, templateId: template.id });
        } catch (error) {
          safeError('Failed to send 24h hold nudge with Thompson Sampling', error);
        }
      }

      // 1h nudge (between 1h and 30min before) - using hold_nudge_47h stage (near expiry)
      if (!lead.hold1hNudgeSent && isWithinWindow(expiryTime, 0.5 * 3600 * 1000, 1 * 3600 * 1000)) {
        try {
          // Select template using Thompson Sampling
          const { template, cohortKey } = await thompsonSamplingService.selectTemplate({
            stage: 'hold_nudge_47h',
            channel: 'wa',
            context,
          });

          // Replace variables
          const messageText = replaceVariables(template.textContent, {
            expiryTime: formatViewingTime(expiryTime),
          });

          // Send message and get SID
          const sid = await sendWhatsAppMessage(lead.whatsappNumber, messageText);

          // Record template usage
          await thompsonSamplingService.recordTemplateShown({
            leadId: lead.id,
            templateId: template.id,
            stage: 'hold_nudge_47h',
            channel: 'wa',
            cohortKey,
            messageSid: sid,
          });

          await db.update(leads)
            .set({ hold1hNudgeSent: true })
            .where(eq(leads.id, lead.id));
          safeLog('Sent 1h hold nudge', { leadId: lead.id, templateId: template.id });
        } catch (error) {
          safeError('Failed to send 1h hold nudge with Thompson Sampling', error);
        }
      }
    }

    // Release expired holds and notify students
    const expiredHolds = await db.select()
      .from(leads)
      .where(
        and(
          eq(leads.holdActive, true),
          lt(leads.holdExpiresAt, now)
        )
      );

    for (const lead of expiredHolds) {
      // Update hold status
      await db.update(leads)
        .set({ holdActive: false })
        .where(eq(leads.id, lead.id));
      
      // Send expiry notification
      if (lead.whatsappNumber && !lead.whatsappOptOut) {
        await sendWhatsAppMessage(
          lead.whatsappNumber,
          `Hold expired. Still interested? Let me know and I can book you in again.`
        );
        safeLog('Sent hold expiry notification', { leadId: lead.id });
      } else {
        safeLog('Hold expired (no WhatsApp notification)', { leadId: lead.id });
      }
    }
  } catch (error) {
    safeError('Hold nudges error', error);
  }
}

/**
 * IDV (Identity Verification) Nudges
 * - 12h after IDV pending: First reminder
 * - 48h after IDV pending: Second reminder
 */
async function processIDVNudges() {
  try {
    const now = new Date();
    
    // Get leads with pending IDV
    const pendingIDV = await db.select()
      .from(leads)
      .where(eq(leads.rtrStatus, 'pending'));

    for (const lead of pendingIDV) {
      if (!lead.whatsappNumber || lead.whatsappOptOut || !lead.updatedAt) continue;

      const timeSinceUpdate = now.getTime() - new Date(lead.updatedAt).getTime();
      const hours = timeSinceUpdate / (1000 * 3600);
      const context = extractLeadContext(lead);

      // 12h nudge (between 12h and 13h)
      if (hours >= 12 && hours <= 13) {
        const nudgeKey = `idv-12h-${lead.id}`;
        if (!hasBeenProcessed(nudgeKey, lead.id)) {
          try {
            const baseUrl = process.env.BASE_URL || 'https://termflow.com';
            const link = `${baseUrl}/apply/${lead.accessToken}`;
            
            // Select template using Thompson Sampling
            const { template, cohortKey } = await thompsonSamplingService.selectTemplate({
              stage: 'idv_nudge_12h',
              channel: 'wa',
              context,
            });

            // Replace variables
            const messageText = replaceVariables(template.textContent, {
              link,
            });

            // Send message and get SID
            const sid = await sendWhatsAppMessage(lead.whatsappNumber, messageText);

            // Record template usage
            await thompsonSamplingService.recordTemplateShown({
              leadId: lead.id,
              templateId: template.id,
              stage: 'idv_nudge_12h',
              channel: 'wa',
              cohortKey,
              messageSid: sid,
            });

            markAsProcessed(nudgeKey, lead.id);
            safeLog('Sent 12h IDV nudge', { leadId: lead.id, templateId: template.id });
          } catch (error) {
            safeError('Failed to send 12h IDV nudge with Thompson Sampling', error);
          }
        }
      }

      // 48h nudge (between 48h and 49h)
      if (hours >= 48 && hours <= 49) {
        const nudgeKey = `idv-48h-${lead.id}`;
        if (!hasBeenProcessed(nudgeKey, lead.id)) {
          try {
            const baseUrl = process.env.BASE_URL || 'https://termflow.com';
            const link = `${baseUrl}/apply/${lead.accessToken}`;
            
            // Select template using Thompson Sampling
            const { template, cohortKey } = await thompsonSamplingService.selectTemplate({
              stage: 'idv_nudge_48h',
              channel: 'wa',
              context,
            });

            // Replace variables
            const messageText = replaceVariables(template.textContent, {
              link,
            });

            // Send message and get SID
            const sid = await sendWhatsAppMessage(lead.whatsappNumber, messageText);

            // Record template usage
            await thompsonSamplingService.recordTemplateShown({
              leadId: lead.id,
              templateId: template.id,
              stage: 'idv_nudge_48h',
              channel: 'wa',
              cohortKey,
              messageSid: sid,
            });

            markAsProcessed(nudgeKey, lead.id);
            safeLog('Sent 48h IDV nudge', { leadId: lead.id, templateId: template.id });
          } catch (error) {
            safeError('Failed to send 48h IDV nudge with Thompson Sampling', error);
          }
        }
      }
    }
  } catch (error) {
    safeError('IDV nudges error', error);
  }
}

/**
 * Contract Signing Nudges
 * - 24h after contract sent: First reminder
 * - 72h after contract sent: Second reminder
 */
async function processContractNudges() {
  try {
    const now = new Date();
    
    // Get leads with contract sent but not signed
    const pendingContracts = await db.select()
      .from(leads)
      .where(eq(leads.stage, 'contract_sent'));

    for (const lead of pendingContracts) {
      if (!lead.whatsappNumber || lead.whatsappOptOut || !lead.updatedAt) continue;

      const timeSinceUpdate = now.getTime() - new Date(lead.updatedAt).getTime();
      const hours = timeSinceUpdate / (1000 * 3600);
      const context = extractLeadContext(lead);

      // 24h nudge (between 24h and 25h)
      if (hours >= 24 && hours <= 25) {
        const nudgeKey = `contract-24h-${lead.id}`;
        if (!hasBeenProcessed(nudgeKey, lead.id)) {
          try {
            const baseUrl = process.env.BASE_URL || 'https://termflow.com';
            const link = `${baseUrl}/contract/${lead.accessToken}`;
            
            // Select template using Thompson Sampling
            const { template, cohortKey } = await thompsonSamplingService.selectTemplate({
              stage: 'contract_nudge_24h',
              channel: 'wa',
              context,
            });

            // Replace variables
            const messageText = replaceVariables(template.textContent, {
              link,
            });

            // Send message and get SID
            const sid = await sendWhatsAppMessage(lead.whatsappNumber, messageText);

            // Record template usage
            await thompsonSamplingService.recordTemplateShown({
              leadId: lead.id,
              templateId: template.id,
              stage: 'contract_nudge_24h',
              channel: 'wa',
              cohortKey,
              messageSid: sid,
            });

            markAsProcessed(nudgeKey, lead.id);
            safeLog('Sent 24h contract nudge', { leadId: lead.id, templateId: template.id });
          } catch (error) {
            safeError('Failed to send 24h contract nudge with Thompson Sampling', error);
          }
        }
      }

      // 72h nudge (between 72h and 73h)
      if (hours >= 72 && hours <= 73) {
        const nudgeKey = `contract-72h-${lead.id}`;
        if (!hasBeenProcessed(nudgeKey, lead.id)) {
          try {
            const baseUrl = process.env.BASE_URL || 'https://termflow.com';
            const link = `${baseUrl}/contract/${lead.accessToken}`;
            
            // Select template using Thompson Sampling
            const { template, cohortKey } = await thompsonSamplingService.selectTemplate({
              stage: 'contract_nudge_72h',
              channel: 'wa',
              context,
            });

            // Replace variables
            const messageText = replaceVariables(template.textContent, {
              link,
            });

            // Send message and get SID
            const sid = await sendWhatsAppMessage(lead.whatsappNumber, messageText);

            // Record template usage
            await thompsonSamplingService.recordTemplateShown({
              leadId: lead.id,
              templateId: template.id,
              stage: 'contract_nudge_72h',
              channel: 'wa',
              cohortKey,
              messageSid: sid,
            });

            markAsProcessed(nudgeKey, lead.id);
            safeLog('Sent 72h contract nudge', { leadId: lead.id, templateId: template.id });
          } catch (error) {
            safeError('Failed to send 72h contract nudge with Thompson Sampling', error);
          }
        }
      }
    }
  } catch (error) {
    safeError('Contract nudges error', error);
  }
}

/**
 * Start the timeline automation interval
 */
export function startTimelineAutomation() {
  if (process.env.DISABLE_TIMELINE === 'true') {
    console.log('⏸️  Timeline automation disabled (DISABLE_TIMELINE=true)');
    return;
  }

  // Run every 60 seconds
  const interval = setInterval(runTimelineAutomation, 60 * 1000);

  console.log('✅ Timeline automation started (runs every 60 seconds)');
  console.log('   - Viewing reminders (24h, 2h before)');
  console.log('   - Post-viewing follow-ups');
  console.log('   - Hold expiry nudges (24h, 1h before)');
  console.log('   - IDV reminders (12h, 48h)');
  console.log('   - Contract signing nudges (24h, 72h)');

  return interval;
}
