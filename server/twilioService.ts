// Twilio WhatsApp Integration Service
import twilio from 'twilio';
import { safeLog, safeError, hashPII } from './piiSanitizer';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=twilio',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.account_sid || !connectionSettings.settings.api_key || !connectionSettings.settings.api_key_secret)) {
    throw new Error('Twilio not connected');
  }
  
  return {
    accountSid: connectionSettings.settings.account_sid,
    apiKey: connectionSettings.settings.api_key,
    apiKeySecret: connectionSettings.settings.api_key_secret,
    authToken: connectionSettings.settings.auth_token,
    phoneNumber: connectionSettings.settings.phone_number
  };
}

export async function getTwilioClient() {
  const { accountSid, apiKey, apiKeySecret } = await getCredentials();
  return twilio(apiKey, apiKeySecret, {
    accountSid: accountSid
  });
}

export async function getTwilioFromPhoneNumber() {
  const { phoneNumber } = await getCredentials();
  return phoneNumber;
}

/**
 * Send WhatsApp message via Twilio
 * @returns Message SID for tracking
 */
export async function sendWhatsAppMessage(to: string, message: string): Promise<string> {
  try {
    const client = await getTwilioClient();
    const fromNumber = await getTwilioFromPhoneNumber();
    
    // Format phone number for WhatsApp (must include 'whatsapp:' prefix)
    const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const whatsappFrom = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`;
    
    const messageResponse = await client.messages.create({
      from: whatsappFrom,
      to: whatsappTo,
      body: message
    });
    
    safeLog('WhatsApp message sent', { 
      toHash: hashPII(whatsappTo),
      messageSid: messageResponse.sid
    });
    
    return messageResponse.sid;
  } catch (error) {
    safeError('Failed to send WhatsApp message', error);
    throw error;
  }
}

/**
 * Get Auth Token for signature validation
 */
export async function getTwilioAuthToken(): Promise<string> {
  const { authToken } = await getCredentials();
  if (!authToken) {
    throw new Error('Twilio Auth Token not available');
  }
  return authToken;
}

/**
 * Validate Twilio webhook signature (security)
 */
export async function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, any>
): Promise<boolean> {
  try {
    const authToken = await getTwilioAuthToken();
    return twilio.validateRequest(authToken, signature, url, params);
  } catch (error) {
    safeError('Signature validation error', error);
    throw new Error('Failed to validate Twilio signature');
  }
}

/**
 * Generate conversation summary from messages
 */
function generateConversationSummary(messages: any[]): string {
  if (!messages || messages.length === 0) {
    return "No prior conversation";
  }

  // Extract user messages (potential questions/concerns)
  const userMessages = messages
    .filter(m => m.role === 'user')
    .slice(-3) // Last 3 user messages
    .map(m => m.content);

  if (userMessages.length === 0) {
    return "No questions yet";
  }

  return userMessages.join('. ');
}

/**
 * Send viewing reminder SMS to staff member
 */
export async function sendViewingReminderToStaff(
  staffMobile: string,
  studentName: string,
  viewingTime: Date,
  conversationMessages: any[]
): Promise<void> {
  try {
    const summary = generateConversationSummary(conversationMessages);
    const formattedTime = viewingTime.toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const message = `Viewing reminder: ${studentName} at ${formattedTime}. Potential questions: ${summary}`;

    await sendWhatsAppMessage(staffMobile, message);
    safeLog('Viewing reminder sent', { 
      staffMobileHash: hashPII(staffMobile),
      studentNameHash: hashPII(studentName)
    });
  } catch (error) {
    safeError('Failed to send viewing reminder', error);
    throw error;
  }
}

/**
 * Send automated retention message to tenant on checkout day
 * 
 * This function should be called by a scheduled job/cron task that runs daily.
 * The job should:
 * 1. Query all leads with stage 'contract_signed' or 'deposit_paid'
 * 2. Filter leads where moveOutDate = today
 * 3. Call this function for each tenant
 * 
 * Implementation options:
 * - Node.js cron package (node-cron)
 * - Server-side scheduler (e.g., Replit Scheduled Tasks)
 * - External cron service (e.g., GitHub Actions, cron-job.org)
 * 
 * Example cron setup:
 * ```
 * import cron from 'node-cron';
 * import { storage } from './storage';
 * import { sendRetentionMessage } from './twilioService';
 * 
 * // Run daily at 9:00 AM
 * cron.schedule('0 9 * * *', async () => {
 *   const leads = await storage.getLeadsByStage('contract_signed');
 *   const today = new Date().toISOString().split('T')[0];
 *   
 *   for (const lead of leads) {
 *     const moveOutDate = lead.moveOutDate?.toISOString().split('T')[0];
 *     if (moveOutDate === today && lead.whatsappNumber) {
 *       await sendRetentionMessage(
 *         lead.whatsappNumber,
 *         lead.name || 'Tenant',
 *         roomNumber,
 *         propertyName
 *       );
 *     }
 *   }
 * });
 * ```
 */
export async function sendRetentionMessage(
  whatsappNumber: string,
  tenantName: string,
  roomNumber: string,
  propertyName: string
): Promise<void> {
  try {
    const message = `Hi ${tenantName}, your tenancy at ${propertyName} Room ${roomNumber} ends today. Want to secure the same room for next year? Reply YES to rebook instantly!`;
    
    await sendWhatsAppMessage(whatsappNumber, message);
    safeLog('Retention message sent', { 
      tenantNameHash: hashPII(tenantName),
      whatsappNumberHash: hashPII(whatsappNumber)
    });
  } catch (error) {
    safeError('Failed to send retention message', error);
    throw error;
  }
}
