import { db } from '../db';
import { usageRecords, invoices } from '@shared/schema';
import type { Invoice } from '@shared/schema';
import { eq, gte, lte, and, sql } from 'drizzle-orm';
import { startOfMonth, endOfMonth, format, addDays } from 'date-fns';

interface UsageBreakdown {
  service: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export async function calculateMonthlyUsage(
  landlordId: string,
  month: Date
): Promise<{
  passThroughCosts: UsageBreakdown[];
  subtotalPassThrough: number;
}> {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  
  // Aggregate usage by service type
  const usageData = await db.select({
    serviceType: usageRecords.serviceType,
    usageType: usageRecords.usageType,
    totalQuantity: sql<number>`sum(${usageRecords.quantity})`,
    avgUnitCost: sql<number>`avg(${usageRecords.unitCost})`,
    totalCost: sql<number>`sum(${usageRecords.totalCost})`,
  })
    .from(usageRecords)
    .where(and(
      eq(usageRecords.landlordId, landlordId),
      gte(usageRecords.recordedAt, monthStart),
      lte(usageRecords.recordedAt, monthEnd)
    ))
    .groupBy(usageRecords.serviceType, usageRecords.usageType);
  
  const passThroughCosts: UsageBreakdown[] = usageData.map(item => {
    let service = '';
    let description = '';
    
    switch (item.serviceType) {
      case 'whatsapp':
        service = 'WhatsApp';
        description = 'Messaging via Twilio';
        break;
      case 'sms':
        service = 'SMS';
        description = 'Text messages via Twilio';
        break;
      case 'openai':
        service = 'AI Assistant';
        description = 'OpenAI API calls';
        break;
      case 'justcall':
        service = 'Phone Calls';
        description = 'JustCall call minutes';
        break;
      default:
        service = item.serviceType;
        description = item.usageType;
    }
    
    return {
      service,
      description,
      quantity: Number(item.totalQuantity || 0),
      unitCost: Number(item.avgUnitCost || 0),
      totalCost: Number(item.totalCost || 0),
    };
  });
  
  const subtotalPassThrough = passThroughCosts.reduce((sum, item) => sum + item.totalCost, 0);
  
  return {
    passThroughCosts,
    subtotalPassThrough,
  };
}

export async function generateMonthlyInvoice(
  landlordId: string,
  month: Date,
  subscriptionFee: number = 99.00
): Promise<Invoice> {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  
  // Calculate usage
  const { passThroughCosts, subtotalPassThrough } = await calculateMonthlyUsage(landlordId, month);
  
  // Generate invoice number (format: INV-YYYYMM-XXXXX)
  const monthStr = format(month, 'yyyyMM');
  const lastInvoice = await db.select()
    .from(invoices)
    .where(sql`${invoices.invoiceNumber} LIKE ${`INV-${monthStr}-%`}`)
    .orderBy(sql`${invoices.invoiceNumber} DESC`)
    .limit(1);
  
  let invoiceNum = 1;
  if (lastInvoice.length > 0) {
    const lastNum = parseInt(lastInvoice[0].invoiceNumber.split('-')[2]);
    invoiceNum = lastNum + 1;
  }
  
  const invoiceNumber = `INV-${monthStr}-${invoiceNum.toString().padStart(5, '0')}`;
  
  // Create invoice
  const totalAmount = subscriptionFee + subtotalPassThrough;
  const dueDate = addDays(monthEnd, 7); // Due 7 days after month end
  
  const [invoice] = await db.insert(invoices).values({
    landlordId,
    invoiceNumber,
    billingPeriodStart: monthStart,
    billingPeriodEnd: monthEnd,
    subscriptionFee: subscriptionFee.toFixed(2),
    passThroughCosts: subtotalPassThrough.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
    status: 'draft',
    dueDate,
  }).returning();
  
  return invoice;
}
