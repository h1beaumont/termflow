import { db } from '../db';
import { usageRecords } from '@shared/schema';

// Twilio costs (example rates in GBP)
const TWILIO_COSTS = {
  whatsapp_message: 0.005, // £0.005 per message
  sms_message: 0.04, // £0.04 per SMS
};

const OPENAI_COSTS = {
  'gpt-4': 0.03, // £0.03 per 1K tokens (simplified)
  'gpt-3.5-turbo': 0.001, // £0.001 per 1K tokens
};

const JUSTCALL_COSTS = {
  call_minute: 0.02, // £0.02 per minute
};

export async function recordWhatsAppUsage(landlordId: string, messageCount: number = 1) {
  const unitCost = TWILIO_COSTS.whatsapp_message;
  const totalCost = unitCost * messageCount;
  
  await db.insert(usageRecords).values({
    landlordId,
    serviceType: 'whatsapp',
    usageType: 'message',
    quantity: messageCount,
    unitCost: unitCost.toFixed(4),
    totalCost: totalCost.toFixed(2),
  });
}

export async function recordSMSUsage(landlordId: string, messageCount: number = 1) {
  const unitCost = TWILIO_COSTS.sms_message;
  const totalCost = unitCost * messageCount;
  
  await db.insert(usageRecords).values({
    landlordId,
    serviceType: 'sms',
    usageType: 'message',
    quantity: messageCount,
    unitCost: unitCost.toFixed(4),
    totalCost: totalCost.toFixed(2),
  });
}

export async function recordOpenAIUsage(
  landlordId: string,
  model: string,
  tokens: number
) {
  const unitCost = OPENAI_COSTS[model as keyof typeof OPENAI_COSTS] || 0.001;
  const totalCost = (unitCost * tokens) / 1000; // Cost per 1K tokens
  
  await db.insert(usageRecords).values({
    landlordId,
    serviceType: 'openai',
    usageType: 'api_call',
    quantity: tokens,
    unitCost: (unitCost / 1000).toFixed(4), // Per token
    totalCost: totalCost.toFixed(2),
    metadata: { model, tokens },
  });
}

export async function recordCallUsage(
  landlordId: string,
  durationMinutes: number
) {
  const unitCost = JUSTCALL_COSTS.call_minute;
  const totalCost = unitCost * durationMinutes;
  
  await db.insert(usageRecords).values({
    landlordId,
    serviceType: 'justcall',
    usageType: 'call_minutes',
    quantity: durationMinutes,
    unitCost: unitCost.toFixed(4),
    totalCost: totalCost.toFixed(2),
  });
}
