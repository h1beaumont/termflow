/**
 * DEPOSIT PROTECTION REMINDER SYSTEM
 * 
 * This system ensures UK legal compliance with the 30-day deposit protection requirement.
 * 
 * MANUAL USAGE:
 * 1. POST /api/deposit-protection/send-reminders - Send all due reminders
 * 2. POST /api/deposit-protection/check-overdue - Mark overdue contracts
 * 
 * AUTOMATED SCHEDULING (Recommended):
 * Set up daily cron job to call both endpoints:
 * 
 * Example using cron:
 * 0 9 * * * curl -X POST https://termflow.com/api/deposit-protection/send-reminders
 * 0 9 * * * curl -X POST https://termflow.com/api/deposit-protection/check-overdue
 * 
 * Or use a service like:
 * - GitHub Actions (workflows on schedule)
 * - Vercel Cron Jobs
 * - AWS EventBridge
 * - Google Cloud Scheduler
 * 
 * TESTING:
 * - Create a contract and charge deposit
 * - Check depositProtectionDeadline is set (30 days from now)
 * - Call /send-reminders endpoint manually
 * - Check reminder tracking fields update
 */

import { IStorage } from './storage';
import { Contract } from '@shared/schema';
import { emailService } from './emailService';
import { generateDepositReminderEmail } from './emailTemplates';

interface ReminderSchedule {
  day: number;
  subject: string;
  urgency: 'info' | 'warning' | 'urgent' | 'critical' | 'violation';
}

const REMINDER_SCHEDULE: ReminderSchedule[] = [
  { day: 1, subject: 'Deposit received - Protect within 30 days', urgency: 'info' },
  { day: 7, subject: 'Reminder: 23 days to protect deposit', urgency: 'info' },
  { day: 14, subject: 'Reminder: 16 days to protect deposit', urgency: 'warning' },
  { day: 21, subject: '⚠️ URGENT: 9 days to protect deposit', urgency: 'urgent' },
  { day: 28, subject: '🚨 CRITICAL: 2 days to protect deposit', urgency: 'critical' },
  { day: 30, subject: '🚨 FINAL WARNING: Deposit protection deadline TODAY', urgency: 'critical' },
  { day: 31, subject: '⚠️ LEGAL VIOLATION: Deposit protection overdue', urgency: 'violation' },
];

export async function sendDepositProtectionReminders(storage: IStorage) {
  const contracts = await storage.getContractsNeedingProtectionReminders();
  
  let emailsSent = 0;
  
  for (const contract of contracts) {
    const daysElapsed = Math.floor(
      (Date.now() - contract.depositChargedAt!.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const reminder = REMINDER_SCHEDULE.find(r => r.day === daysElapsed);
    
    if (!reminder) continue;
    
    if (contract.depositProtectionLastReminderAt) {
      const lastReminderDay = Math.floor(
        (contract.depositProtectionLastReminderAt.getTime() - contract.depositChargedAt!.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (lastReminderDay === daysElapsed) {
        continue;
      }
    }
    
    await sendReminderEmail(contract, reminder, daysElapsed);
    
    await storage.updateDepositReminderTracking(contract.id, daysElapsed);
    
    emailsSent++;
  }
  
  return { emailsSent, contractsProcessed: contracts.length };
}

async function sendReminderEmail(contract: any, reminder: ReminderSchedule, daysElapsed: number) {
  const daysRemaining = 30 - daysElapsed;
  const depositAmount = parseFloat(contract.depositAmount?.toString() || '0');
  const potentialFine = depositAmount * 3;
  
  // Use real data from database joins
  const landlordEmail = contract.landlordEmail;
  const landlordName = contract.landlordName || 'Landlord';
  const tenantName = contract.tenantName || 'Tenant';
  const propertyName = contract.propertyName || 'Property';
  
  // Validate we have a real email
  if (!landlordEmail || landlordEmail.includes('example.com')) {
    console.error(`Cannot send reminder for contract ${contract.id}: No valid landlord email found`);
    return;
  }
  
  const emailData = {
    landlordName,
    tenantName,
    propertyName,
    depositAmount,
    depositChargedDate: contract.depositChargedAt?.toLocaleDateString('en-GB') || '',
    deadlineDate: contract.depositProtectionDeadline?.toLocaleDateString('en-GB') || '',
    daysRemaining,
    potentialFine,
    contractId: contract.id,
  };
  
  const emailHtml = generateDepositReminderEmail(emailData, reminder.urgency);
  
  await emailService.sendEmail(
    landlordEmail,
    reminder.subject,
    emailHtml
  );
  
  console.log(`[DEPOSIT PROTECTION REMINDER] Contract #${contract.id}`);
  console.log(`To: ${landlordEmail} (${landlordName})`);
  console.log(`Subject: ${reminder.subject}`);
  console.log(`Tenant: ${tenantName}, Property: ${propertyName}`);
  console.log(`Days Remaining: ${daysRemaining}`);
  console.log(`Potential Fine if overdue: £${potentialFine}`);
}
