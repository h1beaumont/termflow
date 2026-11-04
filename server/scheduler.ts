/**
 * AUTOMATED SCHEDULER
 * 
 * Handles all recurring tasks including:
 * - Daily: Deposit protection reminders, dormant follow-ups, retention messages
 * - Weekly: Summary emails to landlords  
 * - Monthly: Invoice generation and delivery
 * 
 * Uses node-cron for scheduling in development/production.
 * Can be disabled via DISABLE_CRON=true environment variable.
 */

import cron from 'node-cron';
import { storage } from './storage';
import { sendDepositProtectionReminders } from './depositProtectionReminders';
import { FollowUpService } from './followUpService';
import { sendRetentionMessage } from './twilioService';
import { db } from './db';
import { leads } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { safeLog, safeError } from './piiSanitizer';
import { startTimelineAutomation } from './timelineAutomation';
import { banditPruner } from './services/banditPruner';

const followUpService = new FollowUpService();

/**
 * Send deposit protection reminders (Daily at 9:00 AM)
 * Note: Check overdue contracts via POST /api/deposit-protection/check-overdue
 */
export function startDepositProtectionScheduler() {
  if (process.env.DISABLE_CRON === 'true') {
    console.log('⏸️  Deposit protection scheduler disabled (DISABLE_CRON=true)');
    return;
  }

  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    safeLog('Running scheduled deposit protection reminders');
    try {
      await sendDepositProtectionReminders(storage);
      safeLog('Deposit protection reminders completed');
    } catch (error) {
      safeError('Deposit protection scheduler failed', error);
    }
  });

  console.log('✅ Deposit protection scheduler started (daily at 9:00 AM)');
  console.log('   Note: Call POST /api/deposit-protection/check-overdue for overdue checks');
}

/**
 * Send follow-ups to dormant leads (Daily at 10:00 AM)
 */
export function startDormantLeadScheduler() {
  if (process.env.DISABLE_CRON === 'true') {
    console.log('⏸️  Dormant lead scheduler disabled (DISABLE_CRON=true)');
    return;
  }

  // Run daily at 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    safeLog('Running scheduled dormant lead follow-ups');
    try {
      const result = await followUpService.sendDormantFollowUps();
      safeLog('Dormant lead follow-ups completed', result);
    } catch (error) {
      safeError('Dormant lead scheduler failed', error);
    }
  });

  console.log('✅ Dormant lead scheduler started (daily at 10:00 AM)');
}

/**
 * Send retention messages on checkout day (Daily at 8:00 AM)
 */
export function startRetentionScheduler() {
  if (process.env.DISABLE_CRON === 'true') {
    console.log('⏸️  Retention scheduler disabled (DISABLE_CRON=true)');
    return;
  }

  // Run daily at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    safeLog('Running scheduled retention messages');
    try {
      const today = new Date().toISOString().split('T')[0];
      const checkoutLeads = await db.select()
        .from(leads)
        .where(eq(leads.stage, 'contract_signed'));

      let sent = 0;
      for (const lead of checkoutLeads) {
        const moveOutDate = lead.moveOutDate?.toISOString().split('T')[0];
        if (moveOutDate === today && lead.whatsappNumber) {
          try {
            await sendRetentionMessage(
              lead.whatsappNumber,
              lead.name || 'Tenant',
              '',  // roomNumber not directly available on lead
              'your accommodation'  // propertyName not directly available on lead
            );
            sent++;
          } catch (error) {
            safeError('Failed to send retention message', error);
          }
        }
      }
      safeLog('Retention messages completed', { sent });
    } catch (error) {
      safeError('Retention scheduler failed', error);
    }
  });

  console.log('✅ Retention scheduler started (daily at 8:00 AM)');
}

/**
 * Auto-prune underperforming message templates (Every 6 hours)
 */
export function startBanditPrunerScheduler() {
  if (process.env.DISABLE_CRON === 'true') {
    console.log('⏸️  Bandit pruner scheduler disabled (DISABLE_CRON=true)');
    return;
  }

  // Run every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    safeLog('Running auto-pruner for message template variants');
    try {
      const result = await banditPruner.pruneOnce();
      safeLog('Auto-pruner completed', result);
    } catch (error) {
      safeError('Bandit pruner scheduler failed', error);
    }
  });

  console.log('✅ Bandit pruner scheduler started (every 6 hours)');
}

/**
 * Initialize all schedulers
 */
export function startAllSchedulers() {
  console.log('\n📅 Initializing automated schedulers...\n');
  
  startDepositProtectionScheduler();
  startDormantLeadScheduler();
  startRetentionScheduler();
  startTimelineAutomation();
  startBanditPrunerScheduler();
  
  console.log('\n✅ All schedulers initialized successfully\n');
  console.log('Note: Weekly/monthly emails handled via external scheduler (n8n/cron jobs)');
  console.log('Endpoints available:');
  console.log('  - POST /api/emails/weekly-summary (weekly)');
  console.log('  - POST /api/invoices/send-monthly (monthly)');
}

/**
 * Stop all schedulers (for graceful shutdown)
 */
export function stopAllSchedulers() {
  cron.getTasks().forEach(task => task.stop());
  console.log('🛑 All schedulers stopped');
}
