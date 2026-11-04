// API Routes for AI Lettings Automation Platform
import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, hashPassword, generateToken, generateTokenExpiry, loginRateLimiter, signupRateLimiter, passwordResetRateLimiter } from "./auth";
import passport from "passport";
import { aiService } from "./aiService";
import { sendWhatsAppMessage, validateTwilioSignature, sendViewingReminderToStaff } from "./twilioService";
import { createIdempotentWebhookHandler, markWebhookComplete, markWebhookFailed } from "./webhookMiddleware";
import { safeLog, safeError, sanitizePII, hashPII } from "./piiSanitizer";
import { banditAdminRoutes } from "./routes/banditAdmin";
import { metrics } from "./metrics";
import Stripe from "stripe";
import { z } from "zod";
import { insertLeadSchema, insertPropertySchema, insertRoomSchema, insertViewingSchema, insertContractSchema, insertTenantApplicationSchema, insertViewingPreferencesSchema, insertDemoBookingSchema, demoBookings, contracts, viewings, leads, emailEvents, approvals, invoices, whatsappTemplates, insertWhatsappTemplateSchema, messageTemplateVariants, templateBanditStats, templateShowEvents, rooms, rightToRentChecks } from "@shared/schema";
import { and, eq, lt, isNotNull, desc } from "drizzle-orm";
import multer from "multer";
import { addWeeks, format, parseISO, differenceInWeeks } from "date-fns";
import { applicationService } from "./applicationService";
import { imageImportService } from "./imageImportService";
import { createDefaultProperties, createDefaultCallLogs } from "./propertyDefaults";
import { generateContract } from "./contractTemplate";
import { db } from "./db";
import { users } from "@shared/schema";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import * as pdfParse from "pdf-parse";
import crypto from 'crypto';
import { emailService } from './emailService';
import { 
  generateWelcomeEmail, 
  generateOnboardingConfirmationEmail,
  generateStaffAccountCreatedEmail,
  generateDealApprovalEmail,
  generateWeeklySummaryEmail,
  generateMonthlyInvoiceEmail 
} from './emailTemplates';
import { calculateMonthlyUsage, generateMonthlyInvoice } from './services/invoiceService';
import { generateSignedLink } from './utils/signedLinks';
import { generateLeadsCSV, generateICS } from './utils/exports';
import { calculateWeeklyMetrics } from './services/weeklyMetrics';
import { properties } from '@shared/schema';
import { gte, lte, sql, inArray } from 'drizzle-orm';
import { startOfWeek, endOfWeek, startOfMonth } from 'date-fns';

export async function registerRoutes(app: Express): Promise<Server> {
  
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY not found. Stripe payment features will not be available.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
}) : null;

// Helper to get authenticated user from request
async function getAuthenticatedUser(req: any): Promise<any> {
  if (!req.user) {
    throw new Error("Not authenticated");
  }
  return req.user; // req.user is now the full User object from passport deserialize
}

// ============================================================================
// DEMO SESSION MANAGEMENT (In-Memory Store)
// ============================================================================

interface DemoMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface DemoSession {
  sessionId: string;
  messages: DemoMessage[];
  lastActivity: Date;
}

const demoSessions = new Map<string, DemoSession>();

// Clean up expired sessions (older than 1 hour)
setInterval(() => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  for (const [sessionId, session] of Array.from(demoSessions.entries())) {
    if (session.lastActivity < oneHourAgo) {
      demoSessions.delete(sessionId);
      safeLog('Cleaned up expired demo session', { sessionId });
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

function generateSessionId(): string {
  return `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Remove all emojis and decorative Unicode symbols from text
function removeEmojis(text: string): string {
  // Using traditional regex without Unicode flag for compatibility
  return text
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '') // Surrogate pairs (emojis)
    .replace(/[\u2600-\u26FF]/g, '')   // Misc symbols
    .replace(/[\u2700-\u27BF]/g, '')   // Dingbats
    .replace(/[\u25A0-\u25FF]/g, '')   // Geometric shapes
    .replace(/[\u2300-\u23FF]/g, '')   // Misc Technical
    .replace(/[\uFE00-\uFE0F]/g, '')   // Variation Selectors
    .replace(/[\u200D]/g, '')          // Zero Width Joiner
    .trim()
    .replace(/\s+/g, ' '); // Clean up extra whitespace
}

// Quick pattern-based response function for instant replies (<100ms)
function getQuickResponse(message: string): string | null {
  const msg = message.toLowerCase();
  
  // Availability patterns
  if (msg.match(/available|availability|what.*rooms|what.*have|what.*you.*got|options|rooms/i)) {
    return "We've got en-suites (£175-250/wk) at Stanley House (city, NTU) and clusters/studios (£175-250/wk) at Broadgate (Beeston, UoN). Fancy a viewing?";
  }
  
  // Deposit patterns
  if (msg.match(/deposit|upfront|initial.*cost|security|how much.*pay/i)) {
    return "Deposit's £1,000 for all rooms, paid instantly via Stripe. Dead easy!";
  }
  
  // Viewing patterns
  if (msg.match(/viewing|view|visit|see.*place|tour|look.*around/i)) {
    return "Brilliant! I can book you a viewing Mon-Sat. Which property interests you - Stanley House or Broadgate?";
  }
  
  // Price patterns
  if (msg.match(/price|cost|how much|rent|per week|weekly|expensive/i)) {
    return "Prices are £175-250/week depending on room type. Stanley (city, NTU) or Broadgate (Beeston, UoN)?";
  }
  
  // Studio patterns
  if (msg.match(/studio|en.?suite|ensuite/i)) {
    return "Studios at £195-250/week (both properties). En-suites at £175-185/week (Stanley House). Want to book a viewing?";
  }
  
  // Location patterns
  if (msg.match(/where|address|location|how.*get|find.*you/i)) {
    return "Stanley House: Talbot St, city centre (2min from NTU). Broadgate: Beeston (near UoN). Both in Nottingham!";
  }
  
  return null; // No match, use AI
}

interface ExtractedInfo {
  name?: string;
  email?: string;
  phone?: string;
  university?: string;
  course?: string;
  moveInDate?: string;
  budget?: string;
  roomPreference?: string;
  tags?: string[];
}

function extractStudentInfo(messages: DemoMessage[]): ExtractedInfo {
  const info: ExtractedInfo = {
    tags: [],
  };
  
  const fullConversation = messages
    .filter(m => m.role !== "system")
    .map(m => m.content)
    .join(" ");
  
  const namePatternsInMessage = [
    /(?:i'?m|name'?s?|call me|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)(?:\s+here|,|\.|$)/i,
  ];
  for (const pattern of namePatternsInMessage) {
    const match = fullConversation.match(pattern);
    if (match && match[1]) {
      info.name = match[1].trim();
      break;
    }
  }
  
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const emailMatch = fullConversation.match(emailPattern);
  if (emailMatch) {
    info.email = emailMatch[1];
  }
  
  const phonePatterns = [
    /(?:phone|mobile|number|contact)[\s:]+(\+?[\d\s()-]{10,})/i,
    /(\+44\s?\d{10}|\d{11})/,
  ];
  for (const pattern of phonePatterns) {
    const match = fullConversation.match(pattern);
    if (match && match[1]) {
      info.phone = match[1].replace(/[^\d+]/g, '');
      if (info.phone.length >= 10) {
        break;
      }
    }
  }
  
  if (fullConversation.match(/\b(?:nottingham trent|NTU)\b/i)) {
    info.university = "Nottingham Trent University";
  } else if (fullConversation.match(/\b(?:university of nottingham|UoN)\b/i)) {
    info.university = "University of Nottingham";
  }
  
  const coursePatternsWithKeywords = [
    /(?:studying|study|course|doing|degree in)\s+(engineering|business|medicine|law|computer science|accounting|marketing|psychology|economics|nursing|architecture|biology|chemistry|physics)/i,
  ];
  for (const pattern of coursePatternsWithKeywords) {
    const match = fullConversation.match(pattern);
    if (match && match[1]) {
      info.course = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      break;
    }
  }
  
  const moveInPatterns = [
    /(?:september|sept|sep)\s+(?:20)?26/i,
    /(?:january|jan)\s+(?:20)?27/i,
    /(?:moving in|move in|start)\s+(?:in\s+)?(?:september|sept|jan|january)\s+(?:20)?2[0-9]/i,
  ];
  for (const pattern of moveInPatterns) {
    const match = fullConversation.match(pattern);
    if (match) {
      info.moveInDate = match[0];
      break;
    }
  }
  
  const budgetPattern = /£?(\d{2,3})(?:\s*(?:per week|\/week|pw|weekly|a week))/i;
  const budgetMatch = fullConversation.match(budgetPattern);
  if (budgetMatch) {
    info.budget = `£${budgetMatch[1]}/week`;
  }
  
  if (fullConversation.match(/\b(?:en-?suite|ensuite)\b/i)) {
    info.roomPreference = "en-suite";
    info.tags?.push("en-suite");
  } else if (fullConversation.match(/\bstudio\b/i)) {
    info.roomPreference = "studio";
    info.tags?.push("studio");
  } else if (fullConversation.match(/\b(?:shared|cluster)\b/i)) {
    info.roomPreference = "shared";
    info.tags?.push("cluster");
  }
  
  if (fullConversation.match(/\b(?:first year|1st year|fresher)\b/i)) {
    info.tags?.push("first-year");
  } else if (fullConversation.match(/\b(?:second year|2nd year)\b/i)) {
    info.tags?.push("second-year");
  } else if (fullConversation.match(/\b(?:final year|third year|3rd year)\b/i)) {
    info.tags?.push("final-year");
  } else if (fullConversation.match(/\b(?:postgrad|masters|msc|phd|master's)\b/i)) {
    info.tags?.push("postgrad");
  }
  
  if (fullConversation.match(/\b(?:international|overseas|abroad)\b/i)) {
    info.tags?.push("international");
  } else if (fullConversation.match(/\b(?:uk student|british|home student)\b/i)) {
    info.tags?.push("uk-student");
  }
  
  if (fullConversation.match(/\b(?:group|friends|together|flatmates)\b/i)) {
    info.tags?.push("group-booking");
  }
  
  return info;
}

interface DemoSessionData {
  leadId: string;
  conversationId: string;
}

const demoSessionData = new Map<string, DemoSessionData>();

async function getOrCreateDemoLead(sessionId: string): Promise<{ leadId: string; conversationId: string; propertyId: string }> {
  const existing = demoSessionData.get(sessionId);
  if (existing) {
    const lead = await storage.getLead(existing.leadId);
    if (lead) {
      return { ...existing, propertyId: lead.propertyId || "" };
    }
  }
  
  try {
    const landlordId = "48549083";
    
    let properties = await storage.getPropertiesByLandlord(landlordId);
    
    if (properties.length === 0) {
      const landlordCheck = await storage.getUser(landlordId);
      if (!landlordCheck) {
        const fallbackUsers = await db.select().from(users).limit(1);
        if (fallbackUsers.length > 0) {
          properties = await storage.getPropertiesByLandlord(fallbackUsers[0].id);
        }
      }
    }
    
    const propertyId = properties[0]?.id;
    
    const lead = await storage.createLead({
      propertyId: propertyId || undefined,
      source: "demo_whatsapp",
      stage: "new_enquiry",
      notes: `Demo conversation started at ${new Date().toISOString()}`,
    });
    
    const conversation = await storage.createConversation({
      leadId: lead.id,
      channel: "demo_whatsapp",
      channelIdentifier: sessionId,
      status: "active",
    });
    
    const data = {
      leadId: lead.id,
      conversationId: conversation.id,
    };
    
    demoSessionData.set(sessionId, data);
    
    safeLog('Created demo lead and conversation', {
      leadId: lead.id,
      conversationId: conversation.id,
      sessionId,
    });
    
    return { ...data, propertyId: propertyId || "" };
  } catch (error) {
    safeError('Failed to create demo lead', error);
    throw error;
  }
}

async function saveDemoMessagesToDB(sessionId: string, userMessage: string, aiResponse: string): Promise<void> {
  try {
    const sessionData = demoSessionData.get(sessionId);
    if (!sessionData) {
      safeLog('No session data found, skipping DB save', { sessionId });
      return;
    }
    
    await storage.createMessage({
      conversationId: sessionData.conversationId,
      role: "user",
      content: userMessage,
    });
    
    await storage.createMessage({
      conversationId: sessionData.conversationId,
      role: "assistant",
      content: aiResponse,
    });
    
    safeLog('Saved messages to DB', { sessionId });
  } catch (error) {
    safeError('Failed to save messages to DB', error);
  }
}

async function updateDemoLeadWithExtractedInfo(sessionId: string, session: DemoSession): Promise<void> {
  try {
    const sessionData = demoSessionData.get(sessionId);
    if (!sessionData) {
      return;
    }
    
    const extractedInfo = extractStudentInfo(session.messages);
    
    const updates: any = {};
    
    if (extractedInfo.name) updates.name = extractedInfo.name;
    if (extractedInfo.email) updates.email = extractedInfo.email;
    if (extractedInfo.phone) updates.phone = extractedInfo.phone;
    if (extractedInfo.university) updates.universityName = extractedInfo.university;
    if (extractedInfo.course) updates.courseName = extractedInfo.course;
    if (extractedInfo.tags && extractedInfo.tags.length > 0) updates.tags = extractedInfo.tags;
    
    if (extractedInfo.moveInDate) {
      updates.notes = `Move-in: ${extractedInfo.moveInDate}`;
    }
    if (extractedInfo.budget) {
      const currentNotes = updates.notes || "";
      updates.notes = currentNotes ? `${currentNotes} | Budget: ${extractedInfo.budget}` : `Budget: ${extractedInfo.budget}`;
    }
    if (extractedInfo.roomPreference) {
      const currentNotes = updates.notes || "";
      updates.notes = currentNotes ? `${currentNotes} | Room: ${extractedInfo.roomPreference}` : `Room: ${extractedInfo.roomPreference}`;
    }
    
    if (Object.keys(updates).length > 0) {
      await storage.updateLead(sessionData.leadId, updates);
      safeLog('Updated lead with extracted info', { 
        leadId: sessionData.leadId, 
        fields: Object.keys(updates) 
      });
    }
  } catch (error) {
    safeError('Failed to update lead with extracted info', error);
  }
}

  // ============================================================================
  // PUBLIC DEMO ENDPOINT (No Authentication Required)
  // ============================================================================
  
  app.post('/api/demo/chat', express.json(), async (req, res) => {
    try {
      const { message, sessionId: providedSessionId } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Get or create session
      let sessionId = providedSessionId;
      let session = sessionId ? demoSessions.get(sessionId) : undefined;
      let isNewSession = false;
      
      if (!session) {
        sessionId = generateSessionId();
        isNewSession = true;
        session = {
          sessionId,
          messages: [
            {
              role: "system",
              content: `You're Ava, a friendly AI lettings assistant helping students find accommodation. You work 24/7/365 exclusively for this landlord.

**CRITICAL: Never use emojis or decorative symbols in your responses. Use plain text only.**

**Core Instructions:**
- Be conversational and natural (NO signatures, NO "- Ava" at the end)
- Gather information naturally throughout conversation (not like a form)
- Ask 1-2 questions at a time maximum
- Use information already provided to personalize responses
- Keep responses concise (1-2 sentences, max 40 words)

**Essential Information to Collect:**
- Name, email, mobile number
- Year of study (first year, second year, final year, postgrad, etc.)
- Course/degree program
- University/Institution (crucial! - Nottingham Trent University or University of Nottingham)
- Move-in date (which academic year/month)
- Budget/price range per week
- Room type preference (ensuite, studio, shared bathroom)
- Location preference (city centre, Beeston, etc.)
- Group booking? (bringing friends/housemates)
- Lifestyle preference (party vs quiet)
- UK or international student
- UK guarantor availability (for international students)

**Conversation Flow:**
1. Start with property questions naturally
2. When they show interest, gather essentials (name, university, move-in date)
3. Then collect preferences (budget, room type, location)
4. Finally practical details (guarantor, group booking)
5. Offer viewing when you have enough info

**Properties Info:**
- Stanley House: City centre (Talbot St), 2min from NTU, £175-250/wk
- Broadgate House: Beeston (near UoN), £175-250/wk
- Deposit: £1,000 via Stripe
- Viewings: Mon-Sat via calendar booking

Remember: Be natural, conversational, helpful. NO signatures!`,
              timestamp: new Date(),
            },
          ],
          lastActivity: new Date(),
        };
        demoSessions.set(sessionId, session);
        safeLog('Created new demo session', { sessionId });
        
        try {
          await getOrCreateDemoLead(sessionId);
        } catch (dbError) {
          safeError('Failed to create demo lead, but continuing with session', dbError);
        }
      }

      // Add user message to session
      session.messages.push({
        role: "user",
        content: message,
        timestamp: new Date(),
      });
      session.lastActivity = new Date();

      // Check for quick pattern-based response first (instant <100ms)
      const quickResponse = getQuickResponse(message);
      if (quickResponse) {
        // Remove emojis from quick response
        const cleanedQuickResponse = removeEmojis(quickResponse);
        
        // Add cleaned quick response to session
        session.messages.push({
          role: "assistant",
          content: cleanedQuickResponse,
          timestamp: new Date(),
        });
        session.lastActivity = new Date();
        demoSessions.set(sessionId, session);
        
        safeLog('Quick response sent', { 
          sessionId, 
          messageLength: message.length,
          responseLength: cleanedQuickResponse.length
        });
        
        saveDemoMessagesToDB(sessionId, message, cleanedQuickResponse).catch(err => {
          safeError('DB save failed (non-blocking)', err);
        });
        
        updateDemoLeadWithExtractedInfo(sessionId, session).catch(err => {
          safeError('Lead update failed (non-blocking)', err);
        });
        
        return res.json({
          response: cleanedQuickResponse,
          sessionId,
        });
      }

      // No pattern match - use AI for complex questions
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Fast and cost-effective for chat
        messages: session.messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: 80, // Ultra-short WhatsApp responses
        temperature: 0.5, // More focused, less creative = faster
      });

      const aiResponse = response.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error("No response from OpenAI");
      }

      // Remove emojis from AI response
      const cleanedResponse = removeEmojis(aiResponse);

      // Add cleaned AI response to session
      session.messages.push({
        role: "assistant",
        content: cleanedResponse,
        timestamp: new Date(),
      });
      session.lastActivity = new Date();

      // Update session in map
      demoSessions.set(sessionId, session);

      safeLog('AI response sent', { 
        sessionId, 
        messageLength: message.length,
        responseLength: cleanedResponse.length
      });

      saveDemoMessagesToDB(sessionId, message, cleanedResponse).catch(err => {
        safeError('DB save failed (non-blocking)', err);
      });
      
      updateDemoLeadWithExtractedInfo(sessionId, session).catch(err => {
        safeError('Lead update failed (non-blocking)', err);
      });

      res.json({
        response: cleanedResponse,
        sessionId,
      });
    } catch (error: any) {
      safeError('Demo chat error', error);
      
      // Return proper error message
      let userMessage = "Sorry, I'm having trouble connecting right now. Please try again!";
      
      // Provide more specific messages for common errors
      if (error.code === 'insufficient_quota') {
        userMessage = "The demo is temporarily unavailable. Please contact support.";
      } else if (error.code === 'rate_limit_exceeded') {
        userMessage = "Too many requests. Please wait a moment and try again.";
      } else if (error.message?.includes('timeout')) {
        userMessage = "The request timed out. Please try again.";
      }
      
      res.status(500).json({ 
        error: "Failed to generate response",
        response: userMessage,
      });
    }
  });

  // Get available demo booking slots
  app.get('/api/demo/available-slots', async (req, res) => {
    try {
      const { getAvailableSlots } = await import('./googleCalendar');
      const slots = await getAvailableSlots(14); // Next 14 days
      res.json({ slots });
    } catch (error: any) {
      safeError('Error fetching available slots', error);
      
      // Provide user-friendly error messages
      const isCalendarNotConnected = error.message?.includes('Calendar not connected');
      const statusCode = isCalendarNotConnected ? 503 : 502;
      const userMessage = isCalendarNotConnected 
        ? "Calendar integration not configured. Please contact support."
        : "Unable to fetch available times. Please try again or contact support.";
      
      res.status(statusCode).json({ message: userMessage });
    }
  });

  // Book a demo call (simplified 3-field form - uses Calendly embed for actual booking)
  app.post('/api/demo/book', async (req, res) => {
    try {
      const { name, email, company } = req.body;
      
      // Validate required fields (only 3 fields for simplified form)
      if (!name || !email || !company) {
        return res.status(400).json({ 
          message: "Name, email, and company are required" 
        });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          message: "Invalid email address" 
        });
      }
      
      // Log the demo booking (actual calendar booking happens via Calendly embed on frontend)
      safeLog('Demo booking form submitted', { 
        name, 
        email: hashPII(email), 
        company 
      });
      
      // Return success - frontend will show Calendly embed
      res.json({ 
        success: true,
        message: "Thank you! Please select a time from the calendar below."
      });
    } catch (error: any) {
      safeError('Error processing demo booking', error);
      res.status(500).json({ 
        message: "Unable to process booking. Please try again or contact support." 
      });
    }
  });

  // POST /api/demo-bookings - Full demo booking with context (no auth required)
  app.post('/api/demo-bookings', async (req, res) => {
    try {
      // Validate request body against schema
      const bookingData = insertDemoBookingSchema.parse(req.body);
      
      // Store in database
      const booking = await storage.createDemoBooking(bookingData);
      
      safeLog('Demo booking created', { 
        id: booking.id, 
        email: hashPII(booking.email), 
        company: booking.company,
        numberOfBeds: booking.numberOfBeds 
      });

      // Send confirmation email (if email service is configured)
      if (emailService) {
        try {
          await emailService.sendDemoBookingConfirmation({
            to: booking.email,
            name: booking.fullName,
            company: booking.company,
            numberOfBeds: booking.numberOfBeds,
            preferredDateTime: booking.preferredDateTime || 'To be scheduled',
          });
          safeLog('Demo booking confirmation email sent', { 
            email: hashPII(booking.email) 
          });
        } catch (emailError: any) {
          safeError('Failed to send demo booking confirmation email', emailError);
        }
      }

      res.json({ 
        success: true, 
        message: 'Demo booking submitted successfully! Check your email for confirmation.',
        bookingId: booking.id
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        safeError('Demo booking validation error', error);
        return res.status(400).json({ 
          message: 'Invalid booking data', 
          errors: error.errors 
        });
      }
      
      safeError('Error creating demo booking', error);
      res.status(500).json({ message: 'Failed to submit demo booking' });
    }
  });

  // GET /api/demo-bookings - List demo bookings (for testing/admin purposes)
  app.get('/api/demo-bookings', async (req, res) => {
    try {
      // Fetch recent demo bookings from database (limit to 50 most recent)
      const bookings = await db.select().from(demoBookings).orderBy(desc(demoBookings.createdAt)).limit(50);
      
      safeLog('Fetched demo bookings', { count: bookings.length });
      
      // Return as JSON
      res.json(bookings);
    } catch (error) {
      safeError('Error fetching demo bookings', error);
      res.status(500).json({ error: 'Failed to fetch demo bookings' });
    }
  });

  // ============================================================================
  // CONTACT FORM
  // ============================================================================
  
  const contactFormSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    message: z.string().min(10),
    preferredContact: z.enum(["email", "phone", "whatsapp"]),
  });

  app.post('/api/contact', express.json(), async (req, res) => {
    try {
      const validationResult = contactFormSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: validationResult.error.errors 
        });
      }

      const { name, email, phone, company, message, preferredContact } = validationResult.data;
      
      // Send notification email to sales team
      const emailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        <p><strong>Preferred Contact Method:</strong> ${preferredContact}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `;
      
      await emailService.sendEmail(
        'sales@termflow.ai',
        `New Contact Form: ${name} - ${company || 'Individual'}`,
        emailHtml
      );
      
      safeLog('Contact form submitted', { 
        name, 
        email, 
        company,
        preferredContact 
      });
      
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error: any) {
      safeError('Error processing contact form', error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // ============================================================================
  // CUSTOM AUTHENTICATION ROUTES
  // ============================================================================
  
  await setupAuth(app);

  // Signup - Email/password registration
  app.post('/api/auth/signup', signupRateLimiter, async (req, res) => {
    try {
      const signupSchema = z.object({
        email: z.string().email().toLowerCase(),
        password: z.string().min(8, "Password must be at least 8 characters"),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
      });

      const { email, password, firstName, lastName } = signupSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Generate email verification token
      const emailVerificationToken = generateToken();
      const emailVerificationExpires = generateTokenExpiry(24); // 24 hours

      // Create user
      const user = await storage.createUser({
        email,
        passwordHash,
        firstName,
        lastName,
        emailVerified: false,
        emailVerificationToken,
        emailVerificationExpires,
      });

      // Send verification email
      const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email?token=${emailVerificationToken}`;
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes celebrate {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
            @keyframes shimmer {
              0% { background-position: -1000px 0; }
              100% { background-position: 1000px 0; }
            }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #1f2937; 
              margin: 0; 
              padding: 0;
              background: linear-gradient(135deg, #14213D 0%, #1a2b4a 100%);
            }
            .container { 
              max-width: 600px; 
              margin: 40px auto; 
              background: white; 
              border-radius: 12px; 
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .header { 
              background: linear-gradient(135deg, #14213D 0%, #1a2b4a 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: linear-gradient(45deg, transparent 30%, rgba(158, 240, 26, 0.1) 50%, transparent 70%);
              animation: shimmer 3s infinite;
            }
            .celebration {
              font-size: 60px;
              margin-bottom: 10px;
              animation: celebrate 1s ease-in-out infinite;
              display: inline-block;
            }
            .header h1 { 
              margin: 0; 
              font-size: 32px; 
              font-weight: 700;
              position: relative;
              z-index: 1;
            }
            .content { 
              padding: 40px 30px;
              animation: fadeIn 0.8s ease-out;
            }
            .highlight-box {
              background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
              border-left: 4px solid #9EF01A;
              padding: 20px;
              margin: 25px 0;
              border-radius: 8px;
            }
            .highlight-box h3 {
              margin: 0 0 10px 0;
              color: #14213D;
              font-size: 18px;
            }
            .checklist {
              list-style: none;
              padding: 0;
              margin: 15px 0;
            }
            .checklist li {
              padding: 8px 0;
              padding-left: 30px;
              position: relative;
            }
            .checklist li::before {
              content: '✓';
              position: absolute;
              left: 0;
              color: #9EF01A;
              font-weight: bold;
              font-size: 18px;
            }
            .cta { 
              background: linear-gradient(135deg, #9EF01A 0%, #8fd617 100%);
              color: #14213D; 
              padding: 16px 40px; 
              text-decoration: none; 
              border-radius: 8px; 
              display: inline-block; 
              margin: 25px 0; 
              font-weight: 700;
              font-size: 16px;
              box-shadow: 0 4px 15px rgba(158, 240, 26, 0.3);
              transition: all 0.3s ease;
            }
            .footer { 
              text-align: center; 
              color: #6b7280; 
              font-size: 13px; 
              padding: 30px;
              background: #f9fafb;
            }
            .timer {
              background: #fef3c7;
              border: 2px solid #fbbf24;
              padding: 12px;
              border-radius: 6px;
              margin: 20px 0;
              text-align: center;
              font-size: 14px;
              color: #92400e;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to TermFlow!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">You're about to revolutionise your lettings</p>
            </div>
            <div class="content">
              <p style="font-size: 18px; font-weight: 600; color: #14213D;">Hi ${firstName || 'there'},</p>
              
              <p style="font-size: 16px;"><strong>Congratulations on joining TermFlow!</strong></p>
              
              <p>You've just taken the first step towards fully automated student lettings. No more chasing emails, no more manual follow-ups—just intelligent AI handling everything whilst you focus on growing your business.</p>
              
              <div class="highlight-box">
                <h3>What Happens Next?</h3>
                <ul class="checklist">
                  <li>Verify your email (click below)</li>
                  <li>Set up your properties and rooms</li>
                  <li>Configure Ava, your AI assistant</li>
                  <li>Start accepting bookings automatically!</li>
                </ul>
              </div>
              
              <p style="font-size: 16px; font-weight: 600; margin-top: 30px;">Let's verify your email and get started:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="cta">Verify Email Address</a>
              </div>
              
              <div class="timer">
                <strong>Verification link expires in 24 hours</strong>
              </div>
              
              <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #9ca3af; background: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 12px; font-family: monospace;">${verificationUrl}</p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="font-size: 14px; color: #6b7280;">If you didn't create an account with TermFlow, please ignore this email.</p>
            </div>
            <div class="footer">
              <p style="font-weight: 600; color: #14213D; margin-bottom: 5px;">TermFlow</p>
              <p style="margin: 5px 0;">AI-powered automation for student lettings (PBSA)</p>
              <p style="margin-top: 15px; font-size: 12px;">Questions? Reply to this email or visit our website</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await emailService.sendEmail(
        email,
        'Verify Your TermFlow Account',
        emailHtml
      );

      res.status(201).json({ 
        message: "Account created successfully. Please check your email to verify your account.",
        userId: user.id,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      safeError('Signup error', error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Login - Local strategy email/password
  app.post('/api/auth/login', loginRateLimiter, (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        safeError('Login error', err);
        return res.status(500).json({ message: "An error occurred during login" });
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }

      req.logIn(user, (err) => {
        if (err) {
          safeError('Session error', err);
          return res.status(500).json({ message: "Failed to create session" });
        }
        
        res.json({ 
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
      });
    })(req, res, next);
  });

  // Logout - Clear session
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        safeError('Logout error', err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Google OAuth - Initiate
  app.get('/api/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // Google OAuth - Callback
  app.get('/api/auth/google/callback',
    passport.authenticate('google', { 
      failureRedirect: '/login',
      failureMessage: true,
    }),
    (req, res) => {
      // Successful authentication, redirect to dashboard
      res.redirect('/dashboard');
    }
  );

  // Get current authenticated user
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user;
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        emailVerified: user.emailVerified,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
      });
    } catch (error) {
      safeError('Error fetching user', error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Verify email with token
  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: "Verification token is required" });
      }

      // Find user with this verification token
      const allUsers = await db.select().from(users).where(eq(users.emailVerificationToken, token));
      const user = allUsers[0];

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }

      // Check if token is expired
      if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
        return res.status(400).json({ message: "Verification token has expired. Please request a new one." });
      }

      // Mark email as verified
      await storage.updateUser(user.id, {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      });

      res.json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
      safeError('Email verification error', error);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });

  // Resend verification email
  app.post('/api/auth/resend-verification', signupRateLimiter, async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email.toLowerCase());

      if (!user) {
        // Don't reveal if email exists - return generic success
        return res.json({ message: "If an account exists with this email, a verification link has been sent." });
      }

      if (user.emailVerified) {
        return res.status(400).json({ message: "This email is already verified. Please try signing in." });
      }

      // Generate new verification token
      const token = generateToken();
      const expires = generateTokenExpiry(EMAIL_VERIFICATION_EXPIRY_HOURS);

      await storage.updateUser(user.id, {
        emailVerificationToken: token,
        emailVerificationExpires: expires,
      });

      // Send verification email
      const verificationLink = `${req.protocol}://${req.get('host')}/verify-email?token=${token}`;
      
      await emailService.sendEmail({
        to: user.email,
        subject: "Verify Your TermFlow Account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #14213D 0%, #1A2B4A 100%); padding: 40px; text-align: center;">
              <h1 style="color: #9EF01A; margin: 0; font-size: 32px;">TermFlow</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">AI-Powered Student Lettings Automation</p>
            </div>
            <div style="padding: 40px; background-color: #f5f5f5;">
              <h2 style="color: #14213D; margin-top: 0;">Verify Your Email</h2>
              <p style="color: #333; line-height: 1.6; margin-bottom: 30px;">
                Click the button below to verify your email address and activate your TermFlow account:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" style="background-color: #9EF01A; color: #14213D; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Verify Email
                </a>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                This link will expire in 24 hours. If you didn't create a TermFlow account, you can safely ignore this email.
              </p>
              <p style="color: #666; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationLink}" style="color: #14213D; word-break: break-all;">${verificationLink}</a>
              </p>
            </div>
            <div style="background-color: #14213D; padding: 20px; text-align: center;">
              <p style="color: #9EF01A; margin: 0; font-size: 14px;">© 2025 TermFlow. All rights reserved.</p>
            </div>
          </div>
        `,
        text: `Verify your TermFlow account by clicking this link: ${verificationLink}\n\nThis link will expire in 24 hours.`,
      });

      res.json({ message: "If an account exists with this email, a verification link has been sent." });
    } catch (error) {
      safeError('Resend verification error', error);
      res.status(500).json({ message: "Failed to resend verification email" });
    }
  });

  // Forgot password - Request reset
  app.post('/api/auth/forgot-password', passwordResetRateLimiter, async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email.toLowerCase());

      // Don't reveal if user exists - always return success
      if (!user) {
        return res.json({ 
          message: "If an account exists with this email, you will receive password reset instructions." 
        });
      }

      // Don't allow password reset for OAuth-only users
      if (user.oauthProvider && !user.passwordHash) {
        return res.json({ 
          message: "If an account exists with this email, you will receive password reset instructions." 
        });
      }

      // Generate reset token
      const passwordResetToken = generateToken();
      const passwordResetExpires = generateTokenExpiry(1); // 1 hour

      await storage.updateUser(user.id, {
        passwordResetToken,
        passwordResetExpires,
      });

      // Send reset email
      const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${passwordResetToken}`;
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #14213D; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .cta { background-color: #9EF01A; color: #14213D; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; font-weight: bold; }
            .footer { text-align: center; color: #64748B; font-size: 14px; margin-top: 30px; padding: 20px; }
            .warning { background-color: #FFF4E6; border-left: 4px solid #FF8B00; padding: 12px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi ${user.firstName || 'there'},</p>
              
              <p>We received a request to reset your TermFlow account password.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <a href="${resetUrl}" class="cta">Reset Password</a>
              
              <p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #64748B;">${resetUrl}</p>
              
              <div class="warning">
                <strong>Important:</strong> This link will expire in 1 hour for security reasons.
              </div>
              
              <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>TermFlow - AI automation for student lettings (PBSA)</p>
              <p>Questions? Reply to this email or visit our website</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await emailService.sendEmail(
        email,
        'Reset Your TermFlow Password',
        emailHtml
      );

      res.json({ 
        message: "If an account exists with this email, you will receive password reset instructions." 
      });
    } catch (error) {
      safeError('Password reset request error', error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // Reset password with token
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const resetSchema = z.object({
        token: z.string(),
        password: z.string().min(8, "Password must be at least 8 characters"),
      });

      const { token, password } = resetSchema.parse(req.body);

      // Find user with this reset token
      const allUsers = await db.select().from(users).where(eq(users.passwordResetToken, token));
      const user = allUsers[0];

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Check if token is expired
      if (user.passwordResetExpires && new Date() > user.passwordResetExpires) {
        return res.status(400).json({ message: "Reset token has expired. Please request a new one." });
      }

      // Hash new password
      const passwordHash = await hashPassword(password);

      // Update password and clear reset token
      await storage.updateUser(user.id, {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      });

      res.json({ message: "Password reset successfully. You can now log in with your new password." });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      safeError('Password reset error', error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // ============================================================================
  // BANDIT AUTO-PRUNER & TEMPLATE MANAGEMENT
  // ============================================================================
  app.use('/api/bandit', isAuthenticated, banditAdminRoutes);

  // ============================================================================
  // ONBOARDING & VIEWING PREFERENCES
  // ============================================================================

  // Get landlord's viewing preferences
  app.get('/api/viewing-preferences', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const preferences = await storage.getViewingPreferencesByLandlord(user.id);
      res.json(preferences);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create or update viewing preferences
  app.post('/api/viewing-preferences', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      // Check if preferences already exist
      const existing = await storage.getViewingPreferencesByLandlord(landlordId);
      
      if (existing) {
        // Update existing preferences
        const updated = await storage.updateViewingPreferences(existing.id, req.body);
        return res.json(updated);
      }
      
      // Create new preferences
      const preferencesData = insertViewingPreferencesSchema.parse({
        ...req.body,
        landlordId,
      });
      const preferences = await storage.createViewingPreferences(preferencesData);
      res.json(preferences);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Check onboarding status
  app.get('/api/onboarding/status', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      // Check NEW onboarding system first
      const session = await storage.getOnboardingSessionByLandlord(landlordId);
      
      if (session) {
        res.json({
          completed: session.isComplete || false,
          completedAt: session.completedAt || null,
        });
      } else {
        // For users without a new session, check old system for backwards compatibility
        const preferences = await storage.getViewingPreferencesByLandlord(landlordId);
        res.json({
          completed: preferences?.onboardingCompleted || false,
          completedAt: preferences?.completedAt || null,
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Mark onboarding as complete
  app.patch('/api/onboarding/complete', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req); const landlordId = user.id;
      
      // CRITICAL FIX: Update onboarding session if it exists
      // This ensures /api/onboarding/status returns completed: true
      const session = await storage.getOnboardingSessionByLandlord(landlordId);
      if (session && !session.isComplete) {
        await storage.updateOnboardingSession(session.id, {
          isComplete: true,
          completedAt: new Date(),
        });
      }
      
      const preferences = await storage.getViewingPreferencesByLandlord(landlordId);
      
      if (!preferences) {
        return res.status(404).json({ message: "Viewing preferences not found" });
      }
      
      const updated = await storage.updateViewingPreferences(preferences.id, {
        onboardingCompleted: true,
        completedAt: new Date(),
      });
      
      // Create default properties (Stanley House and Broadgate House)
      // Handle errors gracefully - log but don't fail onboarding
      try {
        const propertyResult = await createDefaultProperties(landlordId);
        safeLog('Default properties created', { landlordId });
        
        // Create default call logs for AI Sales Trainer demo
        if (propertyResult.leadIds && propertyResult.leadIds.length > 0) {
          await createDefaultCallLogs(landlordId, propertyResult.leadIds);
          safeLog('Default call logs created for AI Sales Trainer', { landlordId });
        }
      } catch (propertyError: any) {
        safeError('Failed to create default properties', propertyError);
        // Continue - onboarding is still complete even if property creation fails
      }
      
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ============================================================================
  // AI CHATBOT ONBOARDING (NEW)
  // ============================================================================

  // 13 Onboarding Sections Structure
  const ONBOARDING_SECTIONS = [
    { key: 'company_info', name: 'Company & Contacts', order: 1 },
    { key: 'buildings', name: 'Building Profiles', order: 2 },
    { key: 'units', name: 'Unit/Room Setup', order: 3 },
    { key: 'pricing', name: 'Pricing & Offers', order: 4 },
    { key: 'eligibility', name: 'Eligibility & Screening', order: 5 },
    { key: 'deposits', name: 'Deposits, Fees & Payments', order: 6 },
    { key: 'contracts', name: 'Contracts & Signatures', order: 7 },
    { key: 'operations', name: 'Operations & Maintenance', order: 8 },
    { key: 'marketing', name: 'Marketing & Communications', order: 9 },
    { key: 'integrations', name: 'Integrations', order: 10 },
    { key: 'reporting', name: 'Reporting & KPIs', order: 11 },
    { key: 'legal', name: 'Legal & Consents', order: 12 },
    { key: 'golive', name: 'Go-Live Checklist', order: 13 },
  ];

  // OpenAI System Prompt for Onboarding
  const ONBOARDING_SYSTEM_PROMPT = `You are an onboarding assistant helping property owners/operators get their student accommodation business set up on TermFlow. You need to collect comprehensive information about their properties through a friendly, conversational approach.

Your Personality:
- Friendly, professional, and efficient
- Conversational but focused on gathering accurate information
- Patient and encouraging
- Clear about what information is needed and why

How You Work:
- Guide users through 13 sections of onboarding sequentially
- Ask 1-3 questions at a time (never overwhelm with too many questions)
- Extract structured data from conversational responses
- Acknowledge answers and confirm understanding before moving forward
- Identify when file uploads are needed (contracts, floor plans, logos, certificates)
- Transition smoothly between sections

🔑 CRITICAL: Using Scraped Website Data
WHEN you see "Website Information (scraped)" in your context with 🔑 PRICING FOUND, ROOM TYPES FOUND, or AMENITIES FOUND:
- DO NOT ask users to provide this information again - that's frustrating!
- INSTEAD: Present what you found and ask them to CONFIRM or CORRECT it
- Example: "I found these prices on your website: £230/week for studios, £175/week for shared rooms. Is this accurate for 2024/25?"
- Example: "I see you offer studio apartments, en-suite rooms, and shared flats. Are these still your current room types?"
- Example: "Your website mentions gym, cinema room, and 24/7 security. What other amenities should I know about?"
- ONLY ask for details if the scraped data is missing or incomplete
- Always acknowledge: "Based on your website..." or "I found on your site..."

13 Onboarding Sections (in order):
1. Company & Contacts - Company details, contacts, branding, website URLs (IMPORTANT: collect website URLs to scrape and use for intelligent setup assistance)
2. Buildings - Building profiles, addresses, amenities (USE scraped data to confirm building names/locations if available)
3. Units - Room/unit setup, specifications (USE scraped room types to confirm, don't ask from scratch)
4. Pricing - Rent, deposits, offers, payment terms (CRITICAL: USE scraped pricing to CONFIRM rates, don't ask users to provide again!)
5. Eligibility - Tenant criteria, screening requirements
6. Deposits - Deposit protection, fee structure (USE scraped deposit amounts if found)
7. Contracts - Contract templates, e-signatures (FILE UPLOAD)
8. Operations - Move-in/out, maintenance, procedures
9. Marketing - Tone, messaging, property highlights (USE scraped amenities/features to confirm)
10. Integrations - CRM, calendar, payment systems, IT/hosting contact (IMPORTANT: collect IT person/hosting provider contact for code integration onboarding)
11. Reporting - Dashboard KPIs, report recipients
12. Legal & Compliance - UK lettings compliance confirmations + platform terms acceptance (see detailed requirements below)
13. Go-Live - Final checklist, launch date

Current Section Context:
- You always know which section you're currently in
- Complete all questions for a section before moving to the next
- Mark sections as complete when all information is gathered
- For Contracts section, request file upload of tenancy agreement template

Response Format:
- Keep responses concise and friendly
- Acknowledge the user's answer first
- Then ask the next relevant question
- When a section is complete, summarize what was collected and transition to the next section
- If files are needed, clearly request them

Section Completion:
- When you have collected all required information for the current section, call the complete_section function with readyToAdvance: true
- Provide a brief summary of what was collected
- The system will automatically advance you to the next section
- Example: After collecting company name, contacts, and branding details for Company Info, call complete_section to move to Buildings

Examples:
User: "We're called Stanley Estates, operating in Nottingham"
You: "Perfect! Stanley Estates in Nottingham. What's your legal company name and registration number?"

User: "Stanley Student Lettings Ltd, company number 12345678"
You: "Great! And who should I put down as the primary contact? I'll need their name, role, email, and phone number."

When to Request Files:
- Contracts section: "Please upload your tenancy agreement template (PDF or Word format)"
- Buildings section: "Do you have floor plans or photos you'd like to upload?"
- Company section: "Please upload your logo for branding"

IMPORTANT - Website URL Collection (Section 1: Company & Contacts):
- CRITICAL: When you are in company_info section, ask for the company website URL(s) EARLY
- Explain: "I'll scrape your website to learn about your properties and services, which will help me provide better setup assistance"
- Accept multiple URLs if they have separate property websites
- WHEN USER PROVIDES ANY URL (starting with http://, https://, www., or ending in .com, .co.uk, .org, etc.):
  * IMMEDIATELY EXTRACT all URLs from their message into an array
  * IMMEDIATELY CALL save_website_urls function with the URLs array - DO NOT just acknowledge, you MUST call the function
  * The function will trigger automatic scraping and section advancement
  * Example: If user says "https://example.com" or "our website is example.com", extract ["https://example.com"] and call save_website_urls
- If you don't call save_website_urls when a URL is provided, the onboarding will be stuck
- The system will automatically scrape and advance the section after you call the function

IMPORTANT - IT/Hosting Contact Collection (Section 10: Integrations):
- Ask for IT person or website hosting provider contact information
- Explain: "We'll need to work with your IT team or hosting provider to integrate our code and ensure everything works optimally"
- Collect: Name, Email, Phone, Company/Role
- Example: "Who handles your website and IT? I'll need their contact details so our technical team can coordinate the code integration with them."
- When user provides IT contact details, CALL the save_it_contact function with the extracted information

⚖️ IMPORTANT - Legal & Compliance Confirmations (Section 12):
This section collects TWO types of confirmations:

**PART A: UK Lettings Legal Compliance Confirmations**
Explain: "Quick compliance check! I need to confirm you have the required UK lettings certifications and registrations in place."

Ask them to confirm YES/NO for each (be conversational, not robotic):
1. **HMO License**: "If your property houses 5+ unrelated tenants, do you have a valid HMO license?" (if applicable)
2. **Gas Safety Certificate**: "Do you have a current, valid Gas Safety Certificate? (Required annually - we may request proof later)"
3. **Electrical Safety (EICR)**: "Is your Electrical Installation Condition Report current and valid? (Required every 5 years - we may request proof later)"
4. **Fire Safety Compliance**: "Are you compliant with the Fire Safety Order 2005?"
5. **Energy Performance Certificate (EPC)**: "Do you have a valid EPC with rating E or above?"
6. **Deposit Protection Scheme**: "Are you registered with a deposit protection scheme? (TDS, MyDeposits, or DPS)"
7. **ICO Data Protection Registration**: "Are you registered with the Information Commissioner's Office (ICO) for data protection? (Required when processing tenant data)"
8. **Right to Rent**: "Do you understand your obligation to conduct Right-to-Rent checks for all tenants, including international students?"
9. **Valid Tenancy Agreements**: "Do you use compliant tenancy agreements (AST or fixed-term contracts)?"

NOTE: We're NOT verifying or requesting proof NOW - just confirming they have these in place. Evidence may be requested later. If they say NO to anything critical, note it but don't block onboarding. Simply say: "No problem - we recommend getting this sorted before going live. I'll flag this for your attention."

**PART B: TermFlow Platform Terms & Data Consent**
Explain: "Now I need you to accept our platform terms and data processing agreements."

Collect explicit acceptance for:
1. **Terms of Service**: "Do you accept TermFlow's Terms of Service? You can read them here: [https://termflow.co.uk/terms]"
2. **Privacy Policy**: "Do you accept our Privacy Policy? You can read it here: [https://termflow.co.uk/privacy]"
3. **Data Processing Agreement (GDPR)**: "We process tenant data on your behalf in compliance with UK GDPR and Data Protection Act 2018. All data stays in UK/EU. Do you agree to our Data Processing Agreement? Full details: [https://termflow.co.uk/dpa]"
4. **Automated Communications Consent**: "TermFlow will send WhatsApp messages, SMS, and emails to your tenants on your behalf as part of the lettings automation. Do you consent to us sending these automated communications?"
5. **Tenant Data Storage Consent**: "We'll store and process tenant personal data (names, emails, phone numbers, passport/visa scans, documents) securely to manage the entire lettings process. Do you consent to this data processing?"

For all Part B items, they MUST say YES. If they refuse any platform terms, explain: "I'm afraid you'll need to accept these terms to use TermFlow. Would you like me to explain what each one means in plain English?"

When all confirmations collected, summarize:
"Perfect! You've confirmed your legal compliance and accepted our platform terms. Almost there!"

📊 IMPORTANT - KPIs Already Being Tracked (Section 11: Reporting):
When you reach the Reporting section, FIRST show the landlord what metrics TermFlow is ALREADY tracking automatically, then ask if they want to track anything additional.

Present this list conversationally:
"Great news! TermFlow automatically tracks comprehensive KPIs across your entire operation. Here's what we're already measuring for you:

**Financial Performance:**
• Revenue Generated (total contract value)
• Total Income Secured (rent roll + deposits)
• Deposits Taken & Total Deposit Value
• Average Weekly Rent
• Rent Collection Rate
• Average Days in Arrears
• Deposit Deduction Disputes

**Pipeline & Conversion:**
• Total Leads & New Enquiries
• Conversion Rate (enquiry to contract signed)
• Contracts Signed
• Viewings Booked & No-Shows
• Applications Started
• Contact Capture Rate
• Viewing-to-Application Conversion
• Application-to-Contract Conversion

**Occupancy Metrics:**
• Current Occupancy Percentage
• Weekly Occupancy Trends
• Void Weeks per Room
• Room-Type Vacancy Rates
• Lost Revenue from Void Days

**Operational Efficiency:**
• Median Response Time (first reply)
• Staff Time Saved (AI automation hours)
• Enquiry Response Time
• Maintenance Response Time
• Tenant Query Response Time
• Complaint Resolution Time
• Days to Let (listing to signed contract)

**AI Performance & Quality:**
• Call Scores (AI-generated ratings)
• Sentiment Analysis (positive/neutral/negative)
• Conversion Opportunities Identified
• Missed Talking Points
• Skill Focus Areas for Improvement

**Tenant Insights:**
• Renewal Rate
• Tenant Satisfaction Score
• Referral Rate
• Demographics (nationality, age, year of study, visa status)

**Weekly Summary Metrics:**
• Top Lead Source & Performance
• Slowest Pipeline Stage
• Payment Failures & RTR Failures
• Week-over-Week Improvements

All these metrics are available on your dashboard, can be filtered by property, and are included in automated weekly summary emails.

Now, are there any ADDITIONAL custom metrics or KPIs specific to your business that you'd like us to track?"

THEN collect:
- Any custom KPIs they want tracked
- Who should receive automated reports (email addresses)
- Preferred report frequency (daily/weekly/monthly)
- Any specific dashboard views or filters they need

Remember: Be conversational, efficient, and ensure you capture all necessary information before moving forward.`;

  // Get or create onboarding session
  app.get('/api/onboarding/session-new', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;

      let session = await storage.getOnboardingSessionByLandlord(landlordId);

      if (!session) {
        session = await storage.createOnboardingSession({
          landlordId,
          currentSection: 'company_info',
          completedSections: [],
          isComplete: false,
          messageCount: 0,
        });
      }

      const responses = await storage.getSectionResponses(session.id);
      const attachments = await storage.getOnboardingAttachments(session.id);

      res.json({
        session,
        responses,
        attachments,
        sections: ONBOARDING_SECTIONS,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Main chat endpoint
  app.post('/api/onboarding/chat-new', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { message: userMessage } = req.body;

      if (!userMessage) {
        return res.status(400).json({ message: 'Message is required' });
      }

      let session = await storage.getOnboardingSessionByLandlord(landlordId);

      if (!session) {
        session = await storage.createOnboardingSession({
          landlordId,
          currentSection: 'company_info',
          completedSections: [],
          isComplete: false,
          messageCount: 0,
        });
      }

      if (session.isComplete) {
        return res.json({
          message: "Your onboarding is already complete! If you need to make changes, please contact support.",
          section: session.currentSection,
          progress: 100,
          isComplete: true,
        });
      }

      const currentSection = ONBOARDING_SECTIONS.find(s => s.key === session.currentSection);
      const sectionResponses = await storage.getSectionResponses(session.id);
      const attachments = await storage.getOnboardingAttachments(session.id);

      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      // Generate website context if available
      let websiteContext = '';
      if (session.scrapedWebsiteData && Array.isArray(session.scrapedWebsiteData)) {
        const { generateWebsiteSummary } = await import('./websiteScraper');
        websiteContext = '\n\nWebsite Information (scraped):\n' + generateWebsiteSummary(session.scrapedWebsiteData as any[]);
      }

      const conversationHistory: any[] = [
        { role: 'system', content: ONBOARDING_SYSTEM_PROMPT },
        {
          role: 'system',
          content: `Current Section: ${currentSection?.name} (${currentSection?.order}/13)
Completed Sections: ${(session.completedSections || []).join(', ') || 'None'}
Previous Q&A in this section:
${sectionResponses
  .filter(r => r.section === session.currentSection)
  .map(r => `Q: ${r.question}\nA: ${r.answer}`)
  .join('\n\n') || 'No previous questions in this section'}

Uploaded Files: ${attachments.length > 0 ? attachments.map(a => a.fileType).join(', ') : 'None'}${websiteContext}`,
        },
      ];

      sectionResponses.slice(-10).forEach(r => {
        conversationHistory.push({ role: 'assistant', content: r.question });
        conversationHistory.push({ role: 'user', content: r.answer });
      });

      conversationHistory.push({ role: 'user', content: userMessage });

      const tools = [
        {
          type: 'function' as const,
          function: {
            name: 'complete_section',
            description: 'Mark the current onboarding section as complete and move to the next section',
            parameters: {
              type: 'object',
              properties: {
                summary: {
                  type: 'string',
                  description: 'Brief summary of information collected in this section'
                },
                readyToAdvance: {
                  type: 'boolean',
                  description: 'Whether all required information for this section has been collected'
                }
              },
              required: ['summary', 'readyToAdvance']
            }
          }
        },
        {
          type: 'function' as const,
          function: {
            name: 'save_website_urls',
            description: 'Save company website URLs to be scraped for context. Call this when user provides website URLs in company_info section.',
            parameters: {
              type: 'object',
              properties: {
                urls: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Array of website URLs provided by the user'
                }
              },
              required: ['urls']
            }
          }
        },
        {
          type: 'function' as const,
          function: {
            name: 'save_it_contact',
            description: 'Save IT person or hosting provider contact information. Call this when user provides IT/technical contact details in integrations section.',
            parameters: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'IT contact person name'
                },
                email: {
                  type: 'string',
                  description: 'IT contact email address'
                },
                phone: {
                  type: 'string',
                  description: 'IT contact phone number'
                },
                company: {
                  type: 'string',
                  description: 'IT contact company/role'
                }
              },
              required: ['name']
            }
          }
        }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: conversationHistory,
        temperature: 0.7,
        max_completion_tokens: 500,
        tools,
      });

      const assistantMessage = completion.choices[0].message;
      let aiResponse = assistantMessage.content || '';
      
      // If AI made a tool call without text, provide a default transition message
      if ((!aiResponse || aiResponse.trim() === '') && assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        const toolCall = assistantMessage.tool_calls[0];
        if ('function' in toolCall && toolCall.function.name === 'complete_section') {
          aiResponse = "Great! I've got everything I need for this section. Let's move on to the next one.";
        } else if ('function' in toolCall && toolCall.function.name === 'save_website_urls') {
          const urlArgs = JSON.parse(toolCall.function.arguments);
          const { estimateScrapingTime } = await import('./websiteScraper');
          const estimate = estimateScrapingTime(urlArgs.urls.length);
          const urlText = urlArgs.urls.length === 1 ? 'website' : `${urlArgs.urls.length} websites`;
          
          // Check if we're in company_info section (will auto-advance after scraping)
          if (session.currentSection === 'company_info') {
            aiResponse = `Perfect! I've saved your website URL(s) and finished analyzing ${urlText}. The scraping took approximately ${estimate.display}.\n\nGreat! That completes the Company & Contacts section. Now let's move on to setting up your building profiles...`;
          } else {
            aiResponse = `Perfect! I've saved your website URL(s).\n\nI'm now scraping ${urlText} to learn about your business. This will take approximately **${estimate.display}**.\n\nPlease wait while I analyze your website content - this helps me provide much better setup assistance...`;
          }
        } else if ('function' in toolCall && toolCall.function.name === 'save_it_contact') {
          aiResponse = "Excellent! I've saved your IT contact details. Our technical team will coordinate with them for the code integration.";
        }
      }
      
      // Final fallback
      if (!aiResponse || aiResponse.trim() === '') {
        aiResponse = 'I apologize, I encountered an issue. Could you please repeat that?';
      }
      
      console.log('[Onboarding Chat] User:', userMessage);
      console.log('[Onboarding Chat] AI Response:', aiResponse);
      console.log('[Onboarding Chat] Tool Calls:', assistantMessage.tool_calls);

      await storage.createSectionResponse({
        sessionId: session.id,
        section: session.currentSection,
        questionKey: `${session.currentSection}_q${sectionResponses.filter(r => r.section === session.currentSection).length + 1}`,
        question: aiResponse,
        answer: userMessage,
      });

      let updatedSession = session;
      let sectionChanged = false;
      let sessionUpdated = false; // Track if session was updated by any tool

      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        const toolCall = assistantMessage.tool_calls[0];
        const args = 'function' in toolCall ? JSON.parse(toolCall.function.arguments) : {};
        
        if ('function' in toolCall && toolCall.function.name === 'complete_section') {
          if (args.readyToAdvance) {
            const currentSectionIndex = ONBOARDING_SECTIONS.findIndex(s => s.key === session.currentSection);
            const nextSection = ONBOARDING_SECTIONS[currentSectionIndex + 1];
            
            if (nextSection) {
              const newCompletedSections = [...(session.completedSections || []), session.currentSection];
              updatedSession = await storage.updateOnboardingSession(session.id, {
                currentSection: nextSection.key,
                completedSections: newCompletedSections,
                messageCount: (session.messageCount || 0) + 1,
              });
              sectionChanged = true;
              sessionUpdated = true;
              console.log('[Onboarding Chat] Section completed:', session.currentSection);
              console.log('[Onboarding Chat] Advancing to:', nextSection.key);
              
              // CRITICAL FIX: Generate a fresh AI response for the NEW section
              // This prevents the loop where AI says "let's move on" but doesn't actually start the new section
              console.log('[Onboarding Chat] Generating opening message for new section:', nextSection.name);
              
              try {
                // Generate website context if available for the new section
                let newWebsiteContext = '';
                if (updatedSession.scrapedWebsiteData && Array.isArray(updatedSession.scrapedWebsiteData)) {
                  const { generateWebsiteSummary } = await import('./websiteScraper');
                  newWebsiteContext = '\n\nWebsite Information (scraped):\n' + generateWebsiteSummary(updatedSession.scrapedWebsiteData as any[]);
                }
                
                const newSectionMessages: any[] = [
                  { role: 'system', content: ONBOARDING_SYSTEM_PROMPT },
                  {
                    role: 'system',
                    content: `Current Section: ${nextSection.name} (${nextSection.order}/13)
Completed Sections: ${newCompletedSections.join(', ')}
Previous Q&A in this section: None (this is the start of a new section)

Uploaded Files: ${attachments.length > 0 ? attachments.map(a => a.fileType).join(', ') : 'None'}${newWebsiteContext}

IMPORTANT: You are NOW in the ${nextSection.name} section. Start by introducing this section and asking the first relevant question. Do NOT say "let's move to the next section" - you're ALREADY in the new section!`
                  },
                  { role: 'user', content: `I'm ready to move forward. Please start the ${nextSection.name} section.` }
                ];
                
                const newSectionCompletion = await openai.chat.completions.create({
                  model: 'gpt-4o',
                  messages: newSectionMessages,
                  temperature: 0.7,
                  max_completion_tokens: 500,
                });
                
                const newSectionMessage = newSectionCompletion.choices[0].message.content || '';
                aiResponse = `${args.summary ? args.summary + '\n\n' : ''}${newSectionMessage}`;
                
                console.log('[Onboarding Chat] New section opening message generated successfully');
              } catch (newSectionError: any) {
                // Defensive fallback: if the new section opening call fails, use a generic transition message
                console.error('[Onboarding Chat] Failed to generate new section opening:', newSectionError);
                aiResponse = `${args.summary ? args.summary + '\n\n' : ''}Great! Now let's move on to ${nextSection.name}. What would you like to tell me about this?`;
              }
            } else {
              updatedSession = await storage.updateOnboardingSession(session.id, {
                isComplete: true,
                completedSections: [...(session.completedSections || []), session.currentSection],
                messageCount: (session.messageCount || 0) + 1,
              });
              sessionUpdated = true;
              console.log('[Onboarding Chat] All sections completed!');
            }
          }
        } else if ('function' in toolCall && toolCall.function.name === 'save_website_urls') {
          console.log('[Onboarding Chat] Saving website URLs:', args.urls);
          
          // Save URLs and trigger scraping
          const { scrapeMultipleWebsites, generateWebsiteSummary } = await import('./websiteScraper');
          
          // Scrape with progress logging
          const scrapedData = await scrapeMultipleWebsites(args.urls, (current, total, url) => {
            console.log(`[Website Scraper] Progress: ${current}/${total} - Scraping ${url}`);
          });
          
          updatedSession = await storage.updateOnboardingSession(session.id, {
            websiteUrls: args.urls,
            scrapedWebsiteData: scrapedData,
            websiteScrapedAt: new Date(),
            messageCount: (session.messageCount || 0) + 1,
          });
          sessionUpdated = true;
          
          const successCount = scrapedData.filter(d => d.success).length;
          console.log(`[Onboarding Chat] Website scraping complete: ${successCount}/${args.urls.length} successful`);
          
          // AUTOMATIC SECTION PROGRESSION: After saving website URLs in company_info section,
          // automatically move to next section to prevent onboarding from stalling
          if (updatedSession.currentSection === 'company_info') {
            const currentSectionIndex = ONBOARDING_SECTIONS.findIndex(s => s.key === updatedSession.currentSection);
            const nextSection = ONBOARDING_SECTIONS[currentSectionIndex + 1];
            
            if (nextSection) {
              console.log('[Onboarding Chat] Auto-advancing from company_info to', nextSection.key, 'after website scraping');
              
              updatedSession = await storage.updateOnboardingSession(session.id, {
                currentSection: nextSection.key,
                completedSections: [...(updatedSession.completedSections || []), updatedSession.currentSection],
                messageCount: (updatedSession.messageCount || 0) + 1,
              });
              sectionChanged = true;
              sessionUpdated = true;
              
              console.log('[Onboarding Chat] Section auto-advanced to:', nextSection.key);
            }
          }
        } else if ('function' in toolCall && toolCall.function.name === 'save_it_contact') {
          console.log('[Onboarding Chat] ===== SAVING IT CONTACT =====');
          console.log('[Onboarding Chat] IT Contact Args:', JSON.stringify(args));
          console.log('[Onboarding Chat] Session ID:', session.id);
          
          updatedSession = await storage.updateOnboardingSession(session.id, {
            itContactName: args.name,
            itContactEmail: args.email || null,
            itContactPhone: args.phone || null,
            itContactCompany: args.company || null,
            messageCount: (session.messageCount || 0) + 1,
          });
          sessionUpdated = true;
          
          console.log('[Onboarding Chat] ===== IT CONTACT SAVED SUCCESSFULLY =====');
          console.log('[Onboarding Chat] Updated Session:', JSON.stringify({
            id: updatedSession.id,
            itContactName: updatedSession.itContactName,
            itContactEmail: updatedSession.itContactEmail,
            itContactPhone: updatedSession.itContactPhone,
            itContactCompany: updatedSession.itContactCompany
          }));
        }
      }

      // Only update messageCount if no tool updated the session
      if (!sessionUpdated) {
        await storage.updateOnboardingSession(session.id, {
          messageCount: (session.messageCount || 0) + 1,
        });
      }

      const needsFile = aiResponse.toLowerCase().includes('upload') || 
                       updatedSession.currentSection === 'contracts';

      const sectionProgress = ONBOARDING_SECTIONS.findIndex(s => s.key === updatedSession.currentSection);
      const progressPercentage = updatedSession.isComplete ? 100 : Math.round(((sectionProgress + 1) / ONBOARDING_SECTIONS.length) * 100);
      const updatedSectionInfo = ONBOARDING_SECTIONS.find(s => s.key === updatedSession.currentSection);

      console.log('[Onboarding Chat] Current section:', updatedSession.currentSection);
      console.log('[Onboarding Chat] Progress:', progressPercentage + '%');
      console.log('[Onboarding Chat] Response being sent:', { message: aiResponse, section: updatedSession.currentSection, sectionName: updatedSectionInfo?.name, progress: progressPercentage });

      res.json({
        message: aiResponse,
        section: updatedSession.currentSection,
        sectionName: updatedSectionInfo?.name,
        progress: progressPercentage,
        needsFile,
        isComplete: updatedSession.isComplete || false,
      });
    } catch (error: any) {
      console.error('Onboarding chat error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // File upload endpoint
  app.post('/api/onboarding/upload-new', isAuthenticated, multer({ storage: multer.memoryStorage() }).single('file'), async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const file = req.file;
      const { fileType, section } = req.body;

      if (!file) {
        return res.status(400).json({ message: 'No file provided' });
      }

      const session = await storage.getOnboardingSessionByLandlord(landlordId);
      if (!session) {
        return res.status(404).json({ message: 'Onboarding session not found' });
      }

      const { objectStorageClient, parseObjectPath } = await import('./objectStorage');
      const privateDir = process.env.PRIVATE_OBJECT_DIR || '.private';
      const objectPath = `${privateDir}/onboarding/${landlordId}/${Date.now()}_${file.originalname}`;
      const { bucketName, objectName } = parseObjectPath(objectPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const fileObj = bucket.file(objectName);

      await fileObj.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      const fileUrl = objectPath;

      const attachment = await storage.createOnboardingAttachment({
        sessionId: session.id,
        section: section || session.currentSection,
        fileType: fileType || 'document',
        fileName: file.originalname,
        fileUrl,
        fileSize: file.size,
      });

      res.json({
        success: true,
        attachment,
        message: `${file.originalname} uploaded successfully!`,
      });
    } catch (error: any) {
      console.error('File upload error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Scrape website URLs
  app.post('/api/onboarding/scrape-website', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { urls } = req.body;

      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ message: 'URLs array is required' });
      }

      const session = await storage.getOnboardingSessionByLandlord(landlordId);
      if (!session) {
        return res.status(404).json({ message: 'Onboarding session not found' });
      }

      console.log(`[Website Scraper] Starting scrape for ${urls.length} URLs for landlord ${landlordId}`);

      const { scrapeMultipleWebsites, generateWebsiteSummary } = await import('./websiteScraper');
      const scrapedData = await scrapeMultipleWebsites(urls);
      const summary = generateWebsiteSummary(scrapedData);

      await storage.updateOnboardingSession(session.id, {
        websiteUrls: urls,
        scrapedWebsiteData: scrapedData,
        websiteScrapedAt: new Date(),
      });

      console.log(`[Website Scraper] Successfully scraped and stored data for session ${session.id}`);

      res.json({
        success: true,
        scrapedData,
        summary,
        message: 'Website(s) scraped successfully!',
      });
    } catch (error: any) {
      console.error('Website scraping error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get progress
  app.get('/api/onboarding/progress-new', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;

      const session = await storage.getOnboardingSessionByLandlord(landlordId);
      if (!session) {
        return res.json({
          progress: 0,
          currentSection: 'company_info',
          completedSections: [],
          isComplete: false,
        });
      }

      const sectionIndex = ONBOARDING_SECTIONS.findIndex(s => s.key === session.currentSection);
      const progressPercentage = Math.round(((sectionIndex + 1) / ONBOARDING_SECTIONS.length) * 100);

      res.json({
        progress: progressPercentage,
        currentSection: session.currentSection,
        completedSections: session.completedSections,
        isComplete: session.isComplete,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Complete onboarding
  app.patch('/api/onboarding/complete-new', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;

      const session = await storage.getOnboardingSessionByLandlord(landlordId);
      if (!session) {
        return res.status(404).json({ message: 'Onboarding session not found' });
      }

      await storage.updateOnboardingSession(session.id, {
        isComplete: true,
        completedAt: new Date(),
      });

      const responses = await storage.getSectionResponses(session.id);
      const fullData: any = {};
      responses.forEach(r => {
        if (!fullData[r.section]) fullData[r.section] = [];
        fullData[r.section].push({ question: r.question, answer: r.answer });
      });

      const companyResponses = responses.filter(r => r.section === 'company_info');
      const companyName = companyResponses.find(r => r.questionKey.includes('company_name'))?.answer;
      const primaryEmail = companyResponses.find(r => r.questionKey.includes('email'))?.answer;

      await storage.createLandlordProfile({
        landlordId,
        sessionId: session.id,
        companyName: companyName || undefined,
        primaryContactEmail: primaryEmail || undefined,
        fullData,
      });

      // Update viewing preferences to mark onboarding as complete
      // This is critical - the status check endpoint looks for this flag
      let preferences = await storage.getViewingPreferencesByLandlord(landlordId);
      
      if (!preferences) {
        // Create viewing preferences with full defaults to prevent validation errors
        preferences = await storage.createViewingPreferences({
          landlordId,
          timezone: "Europe/London",
          weeklyAvailability: {
            monday: { enabled: false, start: "09:00", end: "17:00" },
            tuesday: { enabled: false, start: "09:00", end: "17:00" },
            wednesday: { enabled: false, start: "09:00", end: "17:00" },
            thursday: { enabled: false, start: "09:00", end: "17:00" },
            friday: { enabled: false, start: "09:00", end: "17:00" },
            saturday: { enabled: false, start: "10:00", end: "16:00" },
            sunday: { enabled: false, start: "10:00", end: "16:00" },
          },
          viewingDuration: 20,
          bufferTime: 10,
          breakWindows: [],
          googleCalendarConnected: false,
          onboardingCompleted: true,
          completedAt: new Date(),
          autoRetentionEnabled: false,
        });
      } else {
        await storage.updateViewingPreferences(preferences.id, {
          onboardingCompleted: true,
          completedAt: new Date(),
        });
      }

      // Create default properties (Stanley House and Broadgate House)
      // Handle errors gracefully - log but don't fail onboarding
      try {
        const propertyResult = await createDefaultProperties(landlordId);
        safeLog('Default properties created', { landlordId });
        
        // Create default call logs for AI Sales Trainer demo
        if (propertyResult.leadIds && propertyResult.leadIds.length > 0) {
          await createDefaultCallLogs(landlordId, propertyResult.leadIds);
          safeLog('Default call logs created for AI Sales Trainer', { landlordId });
        }
      } catch (propertyError: any) {
        safeError('Failed to create default properties', propertyError);
        // Continue - onboarding is still complete even if property creation fails
      }

      res.json({
        success: true,
        message: 'Onboarding completed successfully!',
      });
    } catch (error: any) {
      console.error('Complete onboarding error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // ENHANCED ONBOARDING - CONTRACT DYNAMIC SECTIONS
  // ============================================================================

  // Save contract dynamic sections
  app.post('/api/onboarding/save-contract-sections', isAuthenticated, async (req: any, res) => {
    try {
      const { sessionId, contractAttachmentId, sections } = req.body;

      if (!sessionId || !Array.isArray(sections)) {
        return res.status(400).json({ message: 'sessionId and sections array are required' });
      }

      // Prepare sections with sessionId and contractAttachmentId
      const sectionsToSave = sections.map(s => ({
        ...s,
        sessionId,
        contractAttachmentId: contractAttachmentId || undefined,
      }));

      await storage.saveContractDynamicSections(sessionId, sectionsToSave);

      res.json({
        success: true,
        message: 'Contract sections saved successfully',
        count: sections.length,
      });
    } catch (error: any) {
      safeError('Error saving contract sections', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get contract dynamic sections
  app.get('/api/onboarding/contract-sections/:sessionId', isAuthenticated, async (req: any, res) => {
    try {
      const { sessionId } = req.params;

      const sections = await storage.getContractDynamicSections(sessionId);

      res.json({
        sections,
      });
    } catch (error: any) {
      safeError('Error getting contract sections', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // ENHANCED ONBOARDING - FLOOR PLAN ZONES
  // ============================================================================

  // Save floor plan zones
  app.post('/api/onboarding/save-floor-plan-zones', isAuthenticated, async (req: any, res) => {
    try {
      const { sessionId, floorPlanAttachmentId, zones } = req.body;

      if (!sessionId || !Array.isArray(zones)) {
        return res.status(400).json({ message: 'sessionId and zones array are required' });
      }

      // Prepare zones with sessionId and floorPlanAttachmentId
      const zonesToSave = zones.map(z => ({
        ...z,
        sessionId,
        floorPlanAttachmentId: floorPlanAttachmentId || undefined,
      }));

      await storage.saveFloorPlanZones(sessionId, zonesToSave);

      res.json({
        success: true,
        message: 'Floor plan zones saved successfully',
        count: zones.length,
      });
    } catch (error: any) {
      safeError('Error saving floor plan zones', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get floor plan zones
  app.get('/api/onboarding/floor-plan-zones/:sessionId', isAuthenticated, async (req: any, res) => {
    try {
      const { sessionId } = req.params;

      const zones = await storage.getFloorPlanZones(sessionId);

      res.json({
        zones,
      });
    } catch (error: any) {
      safeError('Error getting floor plan zones', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // ENHANCED ONBOARDING - TASK DELEGATION
  // ============================================================================

  // Delegate onboarding session to staff
  app.post('/api/onboarding/delegate-session', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;

      const { sessionId, delegatedToEmail, delegatedToName } = req.body;

      if (!sessionId || !delegatedToEmail) {
        return res.status(400).json({ 
          message: 'sessionId and delegatedToEmail are required' 
        });
      }

      // Get current session to know what sections remain
      const session = await storage.getOnboardingSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      // Verify session belongs to the authenticated landlord
      if (session.landlordId !== landlordId) {
        return res.status(403).json({ message: 'Unauthorized: session does not belong to you' });
      }

      const currentSectionIndex = ONBOARDING_SECTIONS.findIndex((s: any) => s.key === session.currentSection);
      const remainingSections = ONBOARDING_SECTIONS.slice(currentSectionIndex).map((s: any) => s.name).join(', ');

      // Create single delegation for the entire remaining onboarding
      const accessToken = crypto.randomBytes(32).toString('hex');
      const accessTokenExpiry = new Date();
      accessTokenExpiry.setDate(accessTokenExpiry.getDate() + 7); // 7 days from now

      const delegation = await storage.createTaskDelegation({
        sessionId,
        landlordId,
        taskType: 'onboarding_completion',
        taskSection: session.currentSection,
        taskDescription: `Complete remaining onboarding sections: ${remainingSections}`,
        delegatedToEmail,
        delegatedToName: delegatedToName || undefined,
        accessToken,
        accessTokenExpiry,
        status: 'pending',
        inviteEmailSent: false,
        completionEmailSent: false,
      });

      // Update session to track delegation
      await storage.updateOnboardingSession(sessionId, {
        hasDelegatedTasks: true,
      });

      // Send delegation email immediately
      const emailService = (await import('./emailService')).emailService;
      const { generateTaskDelegationEmail } = await import('./emailTemplates');
      
      const emailHtml = generateTaskDelegationEmail({
        delegatedToName: delegatedToName || undefined,
        landlordName: user.name || undefined,
        companyName: user.companyName || undefined,
        tasks: [{
          taskType: 'onboarding_completion',
          taskSection: session.currentSection,
          taskDescription: `Complete remaining onboarding sections: ${remainingSections}`
        }],
        accessToken,
        expiresAt: accessTokenExpiry
      });

      const emailSent = await emailService.sendEmail(
        delegatedToEmail,
        `${user.companyName || user.name} has delegated onboarding tasks to you`,
        emailHtml
      );

      if (emailSent) {
        await storage.updateTaskDelegation(delegation.id, { inviteEmailSent: true });
      }

      res.json({
        success: true,
        message: 'Onboarding delegated successfully',
        delegation,
        emailSent,
      });
    } catch (error: any) {
      safeError('Error delegating onboarding session', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Create task delegations (legacy endpoint for task-based delegation)
  app.post('/api/onboarding/delegate-tasks', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;

      const { sessionId, tasks, delegatedToEmail, delegatedToName } = req.body;

      if (!sessionId || !Array.isArray(tasks) || !delegatedToEmail) {
        return res.status(400).json({ 
          message: 'sessionId, tasks array, and delegatedToEmail are required' 
        });
      }

      // Create delegations
      const delegations = [];
      for (const task of tasks) {
        const accessToken = crypto.randomBytes(32).toString('hex');
        const accessTokenExpiry = new Date();
        accessTokenExpiry.setDate(accessTokenExpiry.getDate() + 7); // 7 days from now

        const delegation = await storage.createTaskDelegation({
          sessionId,
          landlordId,
          taskType: task.taskType,
          taskSection: task.taskSection,
          taskDescription: task.taskDescription,
          delegatedToEmail,
          delegatedToName: delegatedToName || undefined,
          accessToken,
          accessTokenExpiry,
          status: 'pending',
          inviteEmailSent: false,
          completionEmailSent: false,
        });

        delegations.push(delegation);
      }

      // Update session to track delegation
      await storage.updateOnboardingSession(sessionId, {
        hasDelegatedTasks: true,
      });

      res.json({
        success: true,
        message: 'Tasks delegated successfully',
        delegations,
      });
    } catch (error: any) {
      safeError('Error creating task delegations', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Staff access to delegated onboarding session (no auth required, uses access token)
  app.get('/api/onboarding/delegated-session/:accessToken', async (req, res) => {
    try {
      const { accessToken } = req.params;

      // Find delegation by access token
      const delegation = await storage.getTaskDelegationByToken(accessToken);

      if (!delegation) {
        return res.status(404).json({ message: 'Delegation not found or expired' });
      }

      // Check if token is expired
      if (delegation.accessTokenExpiry && new Date(delegation.accessTokenExpiry) < new Date()) {
        return res.status(403).json({ message: 'Access token has expired' });
      }

      // Get the onboarding session
      const session = await storage.getOnboardingSession(delegation.sessionId);
      const responses = await storage.getSectionResponses(delegation.sessionId);

      // Update delegation status to in_progress if it's pending
      if (delegation.status === 'pending') {
        await storage.updateTaskDelegation(delegation.id, { status: 'in_progress' });
      }

      res.json({
        success: true,
        delegation,
        session,
        sections: ONBOARDING_SECTIONS,
        responses,
      });
    } catch (error: any) {
      safeError('Error accessing delegated session', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Send delegation emails
  app.post('/api/onboarding/send-delegation-emails', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { delegationIds } = req.body;

      if (!delegationIds || !Array.isArray(delegationIds)) {
        return res.status(400).json({ message: 'delegationIds array is required' });
      }

      const emailService = (await import('./emailService')).emailService;
      const { generateTaskDelegationEmail } = await import('./emailTemplates');
      
      const results = [];
      
      for (const delegationId of delegationIds) {
        const delegation = await storage.getTaskDelegationById(delegationId);
        
        if (!delegation) {
          results.push({ delegationId, success: false, error: 'Delegation not found' });
          continue;
        }

        const emailHtml = generateTaskDelegationEmail({
          delegatedToName: delegation.delegatedToName || undefined,
          landlordName: user.name || undefined,
          companyName: user.companyName || undefined,
          tasks: [{
            taskType: delegation.taskType,
            taskSection: delegation.taskSection,
            taskDescription: delegation.taskDescription
          }],
          accessToken: delegation.accessToken || '',
          expiresAt: delegation.accessTokenExpiry || new Date()
        });

        const sent = await emailService.sendEmail(
          delegation.delegatedToEmail,
          `Tasks Delegated to You - ${delegation.taskSection}`,
          emailHtml
        );

        if (sent) {
          // Fix property name - it should be emailSent not emailSentAt
          await storage.updateTaskDelegation(delegationId, { completionEmailSent: true });
        }

        results.push({ 
          delegationId, 
          success: sent,
          email: delegation.delegatedToEmail 
        });
      }

      res.json({ results });
    } catch (error: any) {
      console.error('Send delegation emails error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Send completion email
  app.post('/api/onboarding/send-completion-email', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { sessionId } = req.body;

      const session = await storage.getOnboardingSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      const delegations = await storage.getTaskDelegations(sessionId);
      
      const emailService = (await import('./emailService')).emailService;
      const { generateOnboardingCompletionEmail } = await import('./emailTemplates');

      const emailHtml = generateOnboardingCompletionEmail({
        landlordName: user.name || undefined,
        companyName: user.companyName || undefined,
        completedSections: session.completedSections?.length || 0,
        totalSections: 13,
        delegatedTasks: delegations.length,
        paymentCompleted: session.paymentStatus === 'succeeded',
        subscriptionPlan: undefined // session doesn't have selectedPlan
      });

      const sent = await emailService.sendEmail(
        user.email,
        'Onboarding Complete - Welcome to TermFlow! 🎉',
        emailHtml
      );

      if (sent) {
        // Fix property name
        await storage.updateOnboardingSession(sessionId, { 
          completedAt: new Date() 
        });
      }

      res.json({ success: sent });
    } catch (error: any) {
      console.error('Send completion email error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get task delegations
  app.get('/api/onboarding/delegations/:sessionId', isAuthenticated, async (req: any, res) => {
    try {
      const { sessionId } = req.params;

      const delegations = await storage.getTaskDelegations(sessionId);

      res.json({
        delegations,
      });
    } catch (error: any) {
      safeError('Error getting task delegations', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // ENHANCED ONBOARDING - SUBSCRIPTION PAYMENT
  // ============================================================================

  // Create subscription with 14-day free trial (card verification only, no charge)
  app.post('/api/onboarding/create-subscription-payment', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { amount, planName, sessionId } = req.body;

      if (!amount || !planName || !sessionId) {
        return res.status(400).json({ 
          message: 'amount, planName, and sessionId are required' 
        });
      }

      // ============================================================================
      // TEST MODE BYPASS - Skip payment for test users
      // ============================================================================
      // SECURITY: Strict pattern matching to prevent accidental/malicious bypass
      // Only exact domain matches, case-insensitive
      const isTestUser = user.email && /@(test\.com|example\.com|termflow\.test)$/i.test(user.email);

      if (isTestUser) {
        console.log(`🧪 [TEST MODE] Bypassing payment for test user: ${user.email}`);
        
        // Grant immediate access - mark as test account
        await db.update(users)
          .set({
            subscriptionStatus: 'test_mode',
            subscriptionPlan: planName,
            subscriptionInterval: 'monthly',
            subscriptionStartDate: new Date(),
            // Give them 1 year of test access
            subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          })
          .where(eq(users.id, user.id));

        // Mark onboarding as complete
        await storage.updateOnboardingSession(sessionId, {
          paymentStatus: 'test_mode_bypass',
          completedAt: new Date(),
        });

        console.log(`✅ [TEST MODE] Access granted to: ${user.email} for ${planName} plan`);

        return res.json({
          success: true,
          testMode: true,
          message: 'Test mode activated - payment bypassed',
          planName,
          accessGranted: true,
        });
      }

      // ============================================================================
      // PRODUCTION MODE - Normal Stripe flow
      // ============================================================================
      
      if (!stripe) {
        return res.status(500).json({ 
          message: 'Stripe is not configured. Please contact support.' 
        });
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        if (!stripe) throw new Error('Stripe not configured');
        const customer = await stripe.customers.create({
          email: user.email!,
          name: `${user.firstName} ${user.lastName}`,
          metadata: {
            userId: user.id,
            sessionId,
          },
        });
        customerId = customer.id;

        // Update user with customer ID
        await db.update(users)
          .set({ stripeCustomerId: customerId })
          .where(eq(users.id, user.id));
      }

      // Create subscription with 14-day free trial (no immediate charge)
      if (!stripe) throw new Error('Stripe not configured');
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `TermFlow ${planName} Plan`,
              description: `AI-powered lettings automation for PBSA landlords`,
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: Math.round(amount * 100), // Convert to pence
          },
        }],
        trial_period_days: 14, // 14-day free trial
        payment_behavior: 'default_incomplete',
        payment_settings: { 
          save_default_payment_method: 'on_subscription',
          payment_method_types: ['card'],
        },
        expand: ['pending_setup_intent'], // For trial subscriptions, setup intent is here
        metadata: {
          landlordId: user.id,
          sessionId,
          planName,
        },
      });

      // For trial subscriptions, setup intent is in pending_setup_intent (not latest_invoice.payment_intent)
      const setupIntent = subscription.pending_setup_intent as any;

      if (!setupIntent || !setupIntent.client_secret) {
        throw new Error('Failed to create setup intent for trial subscription');
      }

      // Update onboarding session with pending subscription details
      // NOTE: User status NOT updated yet - waiting for card verification (setup_intent.succeeded)
      await storage.updateOnboardingSession(sessionId, {
        paymentIntentId: setupIntent.id,
        paymentStatus: 'awaiting_verification', // Card not verified yet
      });

      // Store subscription ID for later (when card is verified)
      await db.update(users)
        .set({
          stripeCustomerId: customerId, // Already set but just to be sure
          stripeSubscriptionId: subscription.id,
        })
        .where(eq(users.id, user.id));

      const trialEnd = new Date(subscription.trial_end! * 1000);

      res.json({
        success: true,
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id,
        subscriptionId: subscription.id,
        trialEnd: trialEnd.toISOString(),
      });
    } catch (error: any) {
      safeError('Error creating subscription with trial', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Populate demo leads (one-time endpoint for existing accounts)
  app.post('/api/demo/populate-leads', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      // Get existing properties for this landlord
      const properties = await storage.getPropertiesByLandlord(landlordId);
      
      if (properties.length === 0) {
        return res.status(404).json({ success: false, message: "No properties found. Please complete onboarding first." });
      }

      // Find Stanley House and Broadgate House
      const stanleyHouse = properties.find(p => p.name === "Stanley House");
      const broadgateHouse = properties.find(p => p.name === "Broadgate House");

      if (!stanleyHouse || !broadgateHouse) {
        return res.status(404).json({ success: false, message: "Default properties not found" });
      }

      // Get all rooms for these properties
      const stanleyRooms = await storage.getRoomsByProperty(stanleyHouse.id);
      const broadgateRooms = await storage.getRoomsByProperty(broadgateHouse.id);
      const allRooms = [...stanleyRooms, ...broadgateRooms];

      // Create demo leads
      const { leads: leadsTable, viewings: viewingsTable, deposits: depositsTable, contracts: contractsTable } = await import("@shared/schema");
      const { db } = await import("./db");

      const leadsData = [
        // NEW ENQUIRY (3 leads)
        {
          propertyId: stanleyHouse.id,
          roomId: allRooms[0]?.id,
          name: "Emily Williams",
          email: "emily.williams@ntu.ac.uk",
          phone: "+447700123001",
          whatsappNumber: "+447700123001",
          source: "whatsapp",
          stage: "new_enquiry",
          enquiryDate: new Date("2025-10-10T14:30:00"),
        },
        {
          propertyId: broadgateHouse.id,
          roomId: allRooms[86]?.id,
          name: "Lucas Anderson",
          email: "lucas.anderson@nottingham.ac.uk",
          phone: "+447700123002",
          whatsappNumber: "+447700123002",
          source: "web",
          stage: "new_enquiry",
          enquiryDate: new Date("2025-10-11T09:15:00"),
        },
        {
          propertyId: stanleyHouse.id,
          roomId: allRooms[10]?.id,
          name: "Ava Johnson",
          email: "ava.johnson@student.ac.uk",
          phone: "+447700123003",
          whatsappNumber: "+447700123003",
          source: "rightmove",
          stage: "new_enquiry",
          enquiryDate: new Date("2025-10-12T16:45:00"),
        },
        // VIEWING BOOKED (3 leads)
        {
          propertyId: stanleyHouse.id,
          roomId: allRooms[20]?.id,
          name: "James Thompson",
          email: "james.t@nottingham.ac.uk",
          phone: "+447700123004",
          whatsappNumber: "+447700123004",
          source: "web",
          stage: "viewing_booked",
          enquiryDate: new Date("2025-10-08T10:15:00"),
          viewingDate: new Date("2025-10-15T14:00:00"),
        },
        {
          propertyId: broadgateHouse.id,
          roomId: allRooms[95]?.id,
          name: "Isabella Rodriguez",
          email: "isabella.r@ntu.ac.uk",
          phone: "+447700123005",
          whatsappNumber: "+447700123005",
          source: "whatsapp",
          stage: "viewing_booked",
          enquiryDate: new Date("2025-10-09T13:20:00"),
          viewingDate: new Date("2025-10-16T10:30:00"),
        },
        {
          propertyId: stanleyHouse.id,
          roomId: allRooms[30]?.id,
          name: "Noah Davis",
          email: "noah.davis@student.ac.uk",
          phone: "+447700123006",
          whatsappNumber: "+447700123006",
          source: "zoopla",
          stage: "viewing_booked",
          enquiryDate: new Date("2025-10-10T11:00:00"),
          viewingDate: new Date("2025-10-17T15:30:00"),
        },
        // VIEWED AWAITING APPLICATION (2 leads)
        {
          propertyId: broadgateHouse.id,
          roomId: allRooms[100]?.id,
          name: "Oliver Martinez",
          email: "oliver.m@ntu.ac.uk",
          phone: "+447700123007",
          whatsappNumber: "+447700123007",
          source: "whatsapp",
          stage: "viewed_awaiting_application",
          enquiryDate: new Date("2025-10-01T11:00:00"),
          viewingDate: new Date("2025-10-07T15:00:00"),
        },
        {
          propertyId: stanleyHouse.id,
          roomId: allRooms[40]?.id,
          name: "Mia Wilson",
          email: "mia.wilson@nottingham.ac.uk",
          phone: "+447700123008",
          whatsappNumber: "+447700123008",
          source: "web",
          stage: "viewed_awaiting_application",
          enquiryDate: new Date("2025-10-03T14:30:00"),
          viewingDate: new Date("2025-10-08T11:00:00"),
        },
        // APPLICATION SUBMITTED (2 leads)
        {
          propertyId: broadgateHouse.id,
          roomId: allRooms[110]?.id,
          name: "Sophie Chen",
          email: "sophie.chen@student.ac.uk",
          phone: "+447700123009",
          whatsappNumber: "+447700123009",
          source: "email",
          stage: "application_submitted",
          enquiryDate: new Date("2025-09-28T09:00:00"),
          applicationDate: new Date("2025-10-05T16:30:00"),
        },
        {
          propertyId: stanleyHouse.id,
          roomId: allRooms[50]?.id,
          name: "Ethan Brown",
          email: "ethan.brown@ntu.ac.uk",
          phone: "+447700123010",
          whatsappNumber: "+447700123010",
          source: "whatsapp",
          stage: "application_submitted",
          enquiryDate: new Date("2025-09-30T10:15:00"),
          applicationDate: new Date("2025-10-06T14:00:00"),
        },
        // DEPOSIT PAID (2 leads)
        {
          propertyId: stanleyHouse.id,
          roomId: allRooms[60]?.id,
          name: "Charlotte Taylor",
          email: "charlotte.taylor@nottingham.ac.uk",
          phone: "+447700123011",
          whatsappNumber: "+447700123011",
          source: "web",
          stage: "deposit_paid",
          enquiryDate: new Date("2025-09-20T13:00:00"),
          depositPaid: true,
          depositAmount: "1000.00",
        },
        {
          propertyId: broadgateHouse.id,
          roomId: allRooms[120]?.id,
          name: "Benjamin Lee",
          email: "benjamin.lee@student.ac.uk",
          phone: "+447700123012",
          whatsappNumber: "+447700123012",
          source: "rightmove",
          stage: "deposit_paid",
          enquiryDate: new Date("2025-09-22T15:30:00"),
          depositPaid: true,
          depositAmount: "1000.00",
        },
        // CONTRACT SENT (2 leads)
        {
          propertyId: stanleyHouse.id,
          roomId: allRooms[70]?.id,
          name: "Amelia Patel",
          email: "amelia.patel@nottingham.ac.uk",
          phone: "+447700123013",
          whatsappNumber: "+447700123013",
          source: "web",
          stage: "contract_sent",
          enquiryDate: new Date("2025-09-15T13:00:00"),
          contractSignedDate: null,
        },
        {
          propertyId: broadgateHouse.id,
          roomId: allRooms[130]?.id,
          name: "Harper White",
          email: "harper.white@ntu.ac.uk",
          phone: "+447700123014",
          whatsappNumber: "+447700123014",
          source: "zoopla",
          stage: "contract_sent",
          enquiryDate: new Date("2025-09-18T10:00:00"),
          contractSignedDate: null,
        },
        // CONTRACT SIGNED (1 lead)
        {
          propertyId: stanleyHouse.id,
          roomId: allRooms[80]?.id,
          name: "William Garcia",
          email: "william.garcia@student.ac.uk",
          phone: "+447700123015",
          whatsappNumber: "+447700123015",
          source: "web",
          stage: "contract_signed",
          enquiryDate: new Date("2025-09-10T09:00:00"),
          contractSignedDate: new Date("2025-09-25T14:30:00"),
        },
      ];

      const insertedLeads = await db.insert(leadsTable).values(leadsData).returning();

      // Create viewings
      await db.insert(viewingsTable).values([
        {
          leadId: insertedLeads[3].id,
          propertyId: stanleyHouse.id,
          viewingType: "in_person",
          scheduledAt: new Date("2025-10-15T14:00:00"),
          duration: 20,
          status: "scheduled",
        },
        {
          leadId: insertedLeads[4].id,
          propertyId: broadgateHouse.id,
          viewingType: "in_person",
          scheduledAt: new Date("2025-10-16T10:30:00"),
          duration: 20,
          status: "scheduled",
        },
        {
          leadId: insertedLeads[5].id,
          propertyId: stanleyHouse.id,
          viewingType: "video",
          scheduledAt: new Date("2025-10-17T15:30:00"),
          duration: 15,
          status: "scheduled",
        },
      ]);

      // Create deposits
      await db.insert(depositsTable).values([
        {
          leadId: insertedLeads[10].id,
          propertyId: stanleyHouse.id,
          roomId: allRooms[70]?.id || allRooms[0].id,
          amount: "1000.00",
          status: "paid",
          stripePaymentIntentId: "pi_demo_charlotte_" + Date.now(),
          paidAt: new Date("2025-09-25T10:30:00"),
        },
        {
          leadId: insertedLeads[11].id,
          propertyId: broadgateHouse.id,
          roomId: allRooms[130]?.id || allRooms[0].id,
          amount: "1000.00",
          status: "paid",
          stripePaymentIntentId: "pi_demo_benjamin_" + Date.now(),
          paidAt: new Date("2025-09-27T14:15:00"),
        },
      ]);

      // Create contracts
      await db.insert(contractsTable).values([
        {
          leadId: insertedLeads[12].id,
          propertyId: stanleyHouse.id,
          roomId: allRooms[70]?.id,
          startDate: new Date("2026-09-01"),
          endDate: new Date("2027-08-31"),
          rentAmount: "225.00",
          depositAmount: "1000.00",
          contractUrl: "https://example.com/contracts/amelia-patel.pdf",
          status: "sent",
        },
        {
          leadId: insertedLeads[13].id,
          propertyId: broadgateHouse.id,
          roomId: allRooms[130]?.id,
          startDate: new Date("2026-09-01"),
          endDate: new Date("2027-08-31"),
          rentAmount: "250.00",
          depositAmount: "1000.00",
          contractUrl: "https://example.com/contracts/harper-white.pdf",
          status: "sent",
        },
        {
          leadId: insertedLeads[14].id,
          propertyId: stanleyHouse.id,
          roomId: allRooms[80]?.id,
          startDate: new Date("2026-09-01"),
          endDate: new Date("2027-08-31"),
          rentAmount: "250.00",
          depositAmount: "1000.00",
          contractUrl: "https://example.com/contracts/william-garcia.pdf",
          status: "signed",
          signedAt: new Date("2025-09-25T14:30:00"),
        },
      ]);

      res.json({ 
        success: true, 
        message: "Demo leads populated successfully",
        totalLeads: insertedLeads.length,
        viewings: 3,
        deposits: 2,
        contracts: 3
      });
    } catch (error: any) {
      safeError('Error populating demo leads', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Populate demo contracts (one-time endpoint for existing accounts without contracts)
  app.post('/api/demo/populate-contracts', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      // Get existing properties, leads, and rooms for this landlord
      const properties = await storage.getPropertiesByLandlord(landlordId);
      
      if (properties.length === 0) {
        return res.status(404).json({ success: false, message: "No properties found. Please complete onboarding first." });
      }

      const leads = await storage.getLeadsByLandlord(landlordId);
      
      if (leads.length === 0) {
        return res.status(404).json({ success: false, message: "No leads found. Cannot create contracts." });
      }

      // Get rooms from first property
      const rooms = await storage.getRoomsByProperty(properties[0].id);
      
      if (rooms.length === 0) {
        return res.status(404).json({ success: false, message: "No rooms found. Cannot create contracts." });
      }

      // Import schema
      const { contracts: contractsTable } = await import("@shared/schema");
      const { db } = await import("./db");

      // Check if contracts already exist for these leads
      const existingContracts = await storage.getContractsByLandlord(landlordId);
      if (existingContracts.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Contracts already exist for this landlord. This endpoint is only for initial population." 
        });
      }

      // Select leads for contracts (use first 5 leads or available leads)
      const leadsForContracts = leads.slice(0, Math.min(5, leads.length));
      
      if (leadsForContracts.length < 5) {
        return res.status(400).json({ 
          success: false, 
          message: `Only ${leadsForContracts.length} leads available. Need at least 5 leads to create demo contracts.` 
        });
      }

      // Create 5 contracts following the pattern from propertyDefaults.ts
      const contractsData = [
        // Contract 1 - Draft status, NO contractUrl (for upload testing)
        {
          leadId: leadsForContracts[0].id,
          roomId: rooms[0].id,
          startDate: new Date("2026-09-01"),
          endDate: new Date("2027-06-30"),
          contractLengthWeeks: 43,
          weeklyRent: rooms[0].rentPerWeek,
          depositAmount: rooms[0].depositAmount,
          isDualOccupancy: false,
          status: "draft",
          approvalStatus: "pending",
          rightToRentStatus: "not_started",
          depositChargeStatus: "not_charged",
          tenantSignatureStatus: "not_signed",
          landlordSignatureStatus: "not_signed",
          // No contractUrl - needs upload
        },
        // Contract 2 - Draft status, NO contractUrl (for upload testing)
        {
          leadId: leadsForContracts[1].id,
          roomId: rooms[Math.min(1, rooms.length - 1)].id,
          startDate: new Date("2026-09-01"),
          endDate: new Date("2027-07-31"),
          contractLengthWeeks: 48,
          weeklyRent: rooms[Math.min(1, rooms.length - 1)].rentPerWeek,
          depositAmount: rooms[Math.min(1, rooms.length - 1)].depositAmount,
          isDualOccupancy: false,
          status: "draft",
          approvalStatus: "pending",
          rightToRentStatus: "not_started",
          depositChargeStatus: "not_charged",
          tenantSignatureStatus: "not_signed",
          landlordSignatureStatus: "not_signed",
          // No contractUrl - needs upload
        },
        // Contract 3 - Signed status, HAS contractUrl (existing document)
        {
          leadId: leadsForContracts[2].id,
          roomId: rooms[Math.min(2, rooms.length - 1)].id,
          startDate: new Date("2026-09-01"),
          endDate: new Date("2027-08-31"),
          contractLengthWeeks: 52,
          weeklyRent: rooms[Math.min(2, rooms.length - 1)].rentPerWeek,
          depositAmount: rooms[Math.min(2, rooms.length - 1)].depositAmount,
          isDualOccupancy: false,
          status: "signed",
          approvalStatus: "approved",
          rightToRentStatus: "passed",
          rightToRentCheckedAt: new Date("2025-09-16T10:00:00"),
          depositChargeStatus: "charged",
          depositChargedAt: new Date("2025-09-20T14:30:00"),
          tenantSignatureStatus: "signed",
          tenantSignedAt: new Date("2025-09-18T16:45:00"),
          landlordSignatureStatus: "signed",
          landlordSignedAt: new Date("2025-09-19T09:20:00"),
          contractUrl: "https://example.com/contracts/demo-contract-3.pdf",
          sentAt: new Date("2025-09-15T13:00:00"),
          signedAt: new Date("2025-09-19T09:20:00"),
        },
        // Contract 4 - Active status, HAS contractUrl (dual occupancy)
        {
          leadId: leadsForContracts[3].id,
          roomId: rooms[Math.min(3, rooms.length - 1)].id,
          startDate: new Date("2026-09-01"),
          endDate: new Date("2027-08-31"),
          contractLengthWeeks: 52,
          weeklyRent: rooms[Math.min(3, rooms.length - 1)].rentPerWeek,
          depositAmount: rooms[Math.min(3, rooms.length - 1)].depositAmount,
          isDualOccupancy: true,
          status: "active",
          approvalStatus: "approved",
          rightToRentStatus: "passed",
          rightToRentCheckedAt: new Date("2025-09-19T11:30:00"),
          depositChargeStatus: "charged",
          depositChargedAt: new Date("2025-09-22T10:00:00"),
          tenantSignatureStatus: "signed",
          tenantSignedAt: new Date("2025-09-20T14:15:00"),
          landlordSignatureStatus: "signed",
          landlordSignedAt: new Date("2025-09-21T10:00:00"),
          contractUrl: "https://example.com/contracts/demo-contract-4.pdf",
          sentAt: new Date("2025-09-18T10:00:00"),
          signedAt: new Date("2025-09-21T10:00:00"),
          sequenceCompletedAt: new Date("2025-09-22T10:00:00"),
        },
        // Contract 5 - Signed status, HAS contractUrl
        {
          leadId: leadsForContracts[4].id,
          roomId: rooms[Math.min(4, rooms.length - 1)].id,
          startDate: new Date("2026-09-01"),
          endDate: new Date("2027-08-31"),
          contractLengthWeeks: 52,
          weeklyRent: rooms[Math.min(4, rooms.length - 1)].rentPerWeek,
          depositAmount: rooms[Math.min(4, rooms.length - 1)].depositAmount,
          isDualOccupancy: false,
          status: "signed",
          approvalStatus: "approved",
          rightToRentStatus: "passed",
          rightToRentCheckedAt: new Date("2025-09-23T15:00:00"),
          depositChargeStatus: "charged",
          depositChargedAt: new Date("2025-09-26T11:00:00"),
          tenantSignatureStatus: "signed",
          tenantSignedAt: new Date("2025-09-25T14:30:00"),
          landlordSignatureStatus: "signed",
          landlordSignedAt: new Date("2025-09-26T09:00:00"),
          contractUrl: "https://example.com/contracts/demo-contract-5.pdf",
          sentAt: new Date("2025-09-22T09:00:00"),
          signedAt: new Date("2025-09-26T09:00:00"),
        },
      ];

      const insertedContracts = await db.insert(contractsTable).values(contractsData).returning();

      safeLog('Demo contracts populated', { 
        landlordId, 
        contractCount: insertedContracts.length 
      });

      res.json({
        success: true,
        message: "5 contracts created successfully",
        contractIds: insertedContracts.map(c => c.id),
      });
    } catch (error: any) {
      safeError('Error populating demo contracts', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // ============================================================================
  // CALENDAR & TENANCY MANAGEMENT
  // ============================================================================

  // Get tenancies for calendar view
  app.get('/api/calendar/tenancies', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { propertyId } = req.query;

      // Get all properties for the landlord or filter by specific property
      let properties;
      if (propertyId) {
        const property = await storage.getProperty(propertyId);
        if (!property || property.landlordId !== landlordId) {
          return res.status(403).json({ message: "Unauthorized" });
        }
        properties = [property];
      } else {
        properties = await storage.getPropertiesByLandlord(landlordId);
      }

      // Get all tenancies (leads with contract_signed or deposit_paid stage)
      const tenancies = [];
      
      for (const property of properties) {
        const propertyLeads = await storage.getLeadsByProperty(property.id);
        
        // Filter for confirmed tenancies only
        const confirmedLeads = propertyLeads.filter(lead => 
          lead.stage === 'contract_signed' || lead.stage === 'deposit_paid'
        );

        for (const lead of confirmedLeads) {
          // Get room details if roomId exists
          let roomNumber = 'N/A';
          if (lead.roomId) {
            const room = await storage.getRoom(lead.roomId);
            if (room) {
              roomNumber = room.roomNumber;
            }
          }

          tenancies.push({
            leadId: lead.id,
            tenantName: lead.name || 'Unknown',
            roomNumber,
            moveInDate: lead.moveInDate,
            moveOutDate: lead.moveOutDate,
            roomId: lead.roomId,
            propertyId: property.id,
            propertyName: property.name,
          });
        }
      }

      // Sort by moveInDate ascending
      tenancies.sort((a, b) => {
        if (!a.moveInDate) return 1;
        if (!b.moveInDate) return -1;
        return new Date(a.moveInDate).getTime() - new Date(b.moveInDate).getTime();
      });

      res.json(tenancies);
    } catch (error: any) {
      safeError('Error fetching tenancies', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Update calendar settings (auto-retention toggle)
  app.put('/api/calendar/settings', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { autoRetentionEnabled } = req.body;

      // Get existing preferences
      const preferences = await storage.getViewingPreferencesByLandlord(landlordId);
      
      if (!preferences) {
        return res.status(404).json({ message: "Viewing preferences not found" });
      }

      // Update auto-retention setting
      const updated = await storage.updateViewingPreferences(preferences.id, {
        autoRetentionEnabled: autoRetentionEnabled === true,
      });

      res.json(updated);
    } catch (error: any) {
      safeError('Error updating calendar settings', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Configure multer for contract uploads
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    },
  });

  // Delegated chat endpoint - continue chat in delegated session
  app.post('/api/onboarding/delegated-chat/:token', async (req: any, res) => {
    try {
      const { token } = req.params;
      const { message: userMessage } = req.body;

      if (!token || !userMessage) {
        return res.status(400).json({ message: 'Token and message are required' });
      }

      // Validate token and get delegation
      const delegation = await storage.getTaskDelegationByToken(token);
      
      if (!delegation) {
        return res.status(404).json({ message: 'Invalid or expired access link' });
      }

      // Check if token is expired
      if (delegation.accessTokenExpiry && new Date(delegation.accessTokenExpiry) < new Date()) {
        return res.status(403).json({ message: 'Access token has expired' });
      }

      // Get the onboarding session
      const session = await storage.getOnboardingSession(delegation.sessionId);
      
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      if (session.isComplete) {
        return res.json({
          message: "This onboarding is already complete! If you need to make changes, please contact the landlord.",
          section: session.currentSection,
          progress: 100,
          isComplete: true,
        });
      }

      const currentSection = ONBOARDING_SECTIONS.find(s => s.key === session.currentSection);
      const sectionResponses = await storage.getSectionResponses(session.id);
      const attachments = await storage.getOnboardingAttachments(session.id);

      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      // Generate website context if available
      let websiteContext = '';
      if (session.scrapedWebsiteData && Array.isArray(session.scrapedWebsiteData)) {
        const { generateWebsiteSummary } = await import('./websiteScraper');
        websiteContext = '\n\nWebsite Information (scraped):\n' + generateWebsiteSummary(session.scrapedWebsiteData as any[]);
      }

      const conversationHistory: any[] = [
        { role: 'system', content: ONBOARDING_SYSTEM_PROMPT },
        {
          role: 'system',
          content: `Current Section: ${currentSection?.name} (${currentSection?.order}/13)
Completed Sections: ${(session.completedSections || []).join(', ') || 'None'}
Previous Q&A in this section:
${sectionResponses
  .filter(r => r.section === session.currentSection)
  .map(r => `Q: ${r.question}\nA: ${r.answer}`)
  .join('\n\n') || 'No previous questions in this section'}

Uploaded Files: ${attachments.length > 0 ? attachments.map(a => a.fileType).join(', ') : 'None'}${websiteContext}`,
        },
      ];

      sectionResponses.slice(-10).forEach(r => {
        conversationHistory.push({ role: 'assistant', content: r.question });
        conversationHistory.push({ role: 'user', content: r.answer });
      });

      conversationHistory.push({ role: 'user', content: userMessage });

      const tools = [
        {
          type: 'function' as const,
          function: {
            name: 'complete_section',
            description: 'Mark the current onboarding section as complete and move to the next section',
            parameters: {
              type: 'object',
              properties: {
                summary: { type: 'string', description: 'Brief summary of information collected in this section' },
                readyToAdvance: { type: 'boolean', description: 'Whether all required information for this section has been collected' }
              },
              required: ['summary', 'readyToAdvance']
            }
          }
        }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: conversationHistory,
        temperature: 0.7,
        max_completion_tokens: 500,
        tools,
      });

      const assistantMessage = completion.choices[0].message;
      let aiResponse = assistantMessage.content || '';
      
      // If AI made a tool call without text, provide a default transition message
      if ((!aiResponse || aiResponse.trim() === '') && assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        const toolCall = assistantMessage.tool_calls[0];
        if ('function' in toolCall && toolCall.function.name === 'complete_section') {
          aiResponse = "Great! I've got everything I need for this section. Let's move on to the next one.";
        }
      }
      
      // Final fallback
      if (!aiResponse || aiResponse.trim() === '') {
        aiResponse = 'I apologize, I encountered an issue. Could you please repeat that?';
      }

      await storage.createSectionResponse({
        sessionId: session.id,
        section: session.currentSection,
        questionKey: `${session.currentSection}_q${sectionResponses.filter(r => r.section === session.currentSection).length + 1}`,
        question: aiResponse,
        answer: userMessage,
      });

      let updatedSession = session;

      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        const toolCall = assistantMessage.tool_calls[0];
        const args = 'function' in toolCall ? JSON.parse(toolCall.function.arguments) : {};
        
        if ('function' in toolCall && toolCall.function.name === 'complete_section') {
          if (args.readyToAdvance) {
            const currentSectionIndex = ONBOARDING_SECTIONS.findIndex(s => s.key === session.currentSection);
            const nextSection = ONBOARDING_SECTIONS[currentSectionIndex + 1];
            
            if (nextSection) {
              const newCompletedSections = [...(session.completedSections || []), session.currentSection];
              updatedSession = await storage.updateOnboardingSession(session.id, {
                currentSection: nextSection.key,
                completedSections: newCompletedSections,
                messageCount: (session.messageCount || 0) + 1,
              });
              
              // Generate opening message for new section
              try {
                let newWebsiteContext = '';
                if (updatedSession.scrapedWebsiteData && Array.isArray(updatedSession.scrapedWebsiteData)) {
                  const { generateWebsiteSummary } = await import('./websiteScraper');
                  newWebsiteContext = '\n\nWebsite Information (scraped):\n' + generateWebsiteSummary(updatedSession.scrapedWebsiteData as any[]);
                }
                
                const newSectionMessages: any[] = [
                  { role: 'system', content: ONBOARDING_SYSTEM_PROMPT },
                  {
                    role: 'system',
                    content: `Current Section: ${nextSection.name} (${nextSection.order}/13)
Completed Sections: ${newCompletedSections.join(', ')}
Previous Q&A in this section: None (this is the start of a new section)

Uploaded Files: ${attachments.length > 0 ? attachments.map(a => a.fileType).join(', ') : 'None'}${newWebsiteContext}

IMPORTANT: You are NOW in the ${nextSection.name} section. Start by introducing this section and asking the first relevant question.`
                  },
                  { role: 'user', content: `I'm ready to move forward. Please start the ${nextSection.name} section.` }
                ];
                
                const newSectionCompletion = await openai.chat.completions.create({
                  model: 'gpt-4o',
                  messages: newSectionMessages,
                  temperature: 0.7,
                  max_completion_tokens: 500,
                });
                
                const newSectionMessage = newSectionCompletion.choices[0].message.content || '';
                aiResponse = `${args.summary ? args.summary + '\n\n' : ''}${newSectionMessage}`;
              } catch (newSectionError: any) {
                safeError('Failed to generate new section opening', newSectionError);
                aiResponse = `${args.summary ? args.summary + '\n\n' : ''}Great! Now let's move on to ${nextSection.name}.`;
              }
            } else {
              updatedSession = await storage.updateOnboardingSession(session.id, {
                isComplete: true,
                completedSections: [...(session.completedSections || []), session.currentSection],
                messageCount: (session.messageCount || 0) + 1,
              });
              
              // Mark delegation as completed when onboarding finishes
              await storage.updateTaskDelegation(delegation.id, { 
                status: 'completed',
                completedAt: new Date()
              });
            }
          }
        }
      }

      res.json({
        success: true,
        message: aiResponse,
        isComplete: updatedSession.isComplete,
        currentSection: updatedSession.currentSection,
      });
    } catch (error: any) {
      safeError('Error in delegated chat', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Delegated file upload endpoint
  app.post('/api/onboarding/upload-delegated/:token', upload.single('file'), async (req: any, res) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }

      // Validate token and get delegation
      const delegation = await storage.getTaskDelegationByToken(token);
      
      if (!delegation) {
        return res.status(404).json({ message: 'Invalid or expired access link' });
      }

      // Check if token is expired
      if (delegation.accessTokenExpiry && new Date(delegation.accessTokenExpiry) < new Date()) {
        return res.status(403).json({ message: 'Access token has expired' });
      }

      // Get the onboarding session
      const session = await storage.getOnboardingSession(delegation.sessionId);
      
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Upload to cloud storage
      const { uploadToCloudStorage } = await import('./cloudStorage');
      const uploadedUrl = await uploadToCloudStorage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Store attachment in database
      const attachment = await storage.createOnboardingAttachment({
        sessionId: delegation.sessionId,
        fileName: req.file.originalname,
        fileUrl: uploadedUrl,
        fileType: req.file.mimetype,
      });

      res.json({
        success: true,
        message: 'File uploaded successfully! I\'ll review this now.',
        attachmentId: attachment.id,
      });
    } catch (error: any) {
      safeError('Error uploading file for delegated session', error);
      res.status(500).json({ message: error.message || 'File upload failed' });
    }
  });

  // Upload and process contract for tenancy calendar
  app.post('/api/tenancy-calendar/upload-contract', isAuthenticated, upload.single('file'), async (req: any, res) => {
    let tempFilePath: string | null = null;
    
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate file type
      const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ 
          message: "Invalid file type. Please upload a PDF or DOCX file" 
        });
      }

      safeLog('Processing contract upload', { 
        mimeType: req.file.mimetype,
        size: req.file.size
      });

      // Write file to temporary location
      const tempDir = os.tmpdir();
      const tempFileName = `contract_${Date.now()}_${Math.random().toString(36).substring(7)}.${req.file.mimetype.includes('pdf') ? 'pdf' : 'docx'}`;
      tempFilePath = path.join(tempDir, tempFileName);
      
      await fs.writeFile(tempFilePath, req.file.buffer);
      safeLog('Written temp file', { fileSize: req.file.size });

      // Extract text from file
      let extractedText = '';
      
      if (req.file.mimetype === 'application/pdf') {
        // Extract text from PDF
        const dataBuffer = await fs.readFile(tempFilePath);
        // @ts-ignore - pdf-parse doesn't have proper ESM types
        const pdfData = await pdfParse.default(dataBuffer);
        extractedText = pdfData.text;
        safeLog('Extracted text from PDF', { textLength: extractedText.length });
      } else {
        // For DOCX, we'll send the file directly to OpenAI (they can handle it)
        // For now, return an error for DOCX as we need additional library
        return res.status(400).json({ 
          message: "DOCX support coming soon. Please use PDF for now" 
        });
      }

      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error("Could not extract sufficient text from contract");
      }

      // Use OpenAI to extract structured data
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const extractionPrompt = `You are extracting information from a student tenancy agreement. 
Extract the following information in JSON format:
- tenantName: Full name of the tenant
- propertyAddress: Full property address
- roomNumber: Room number or apartment number
- startDate: Tenancy start date (ISO format YYYY-MM-DD)
- endDate: Tenancy end date (ISO format YYYY-MM-DD)
- weeklyRent: Weekly rent amount (number only, no currency symbol)
- depositAmount: Deposit amount (number only, no currency symbol)
- contractLengthWeeks: Number of weeks

Return only valid JSON. If a field cannot be found, use null.`;

      safeLog('Sending to OpenAI for extraction', {});
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: extractionPrompt },
          { role: "user", content: `Extract contract data from this text:\n\n${extractedText.substring(0, 8000)}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const extractedData = JSON.parse(completion.choices[0].message.content || "{}");
      safeLog('Extracted contract data', { 
        hasPropertyAddress: !!extractedData.propertyAddress,
        hasRoomNumber: !!extractedData.roomNumber,
        hasDates: !!(extractedData.startDate && extractedData.endDate)
      });

      // Match property by address
      const properties = await storage.getPropertiesByLandlord(landlordId);
      let matchedProperty = null;
      let matchedRoom = null;

      if (extractedData.propertyAddress && properties.length > 0) {
        // Simple fuzzy matching on address
        const searchAddress = extractedData.propertyAddress.toLowerCase();
        matchedProperty = properties.find(p => 
          searchAddress.includes(p.address.toLowerCase()) || 
          searchAddress.includes(p.name.toLowerCase()) ||
          p.address.toLowerCase().includes(searchAddress)
        );

        // If property matched, try to match room
        if (matchedProperty && extractedData.roomNumber) {
          const rooms = await storage.getRoomsByProperty(matchedProperty.id);
          matchedRoom = rooms.find(r => 
            r.roomNumber.toLowerCase().includes(extractedData.roomNumber.toLowerCase()) ||
            extractedData.roomNumber.toLowerCase().includes(r.roomNumber.toLowerCase())
          );
        }
      }

      safeLog('Contract property matching', { 
        propertyMatched: !!matchedProperty,
        roomMatched: !!matchedRoom
      });

      // Calculate contract length in weeks if dates are available
      let contractLengthWeeks = extractedData.contractLengthWeeks;
      if (!contractLengthWeeks && extractedData.startDate && extractedData.endDate) {
        try {
          const start = parseISO(extractedData.startDate);
          const end = parseISO(extractedData.endDate);
          contractLengthWeeks = differenceInWeeks(end, start);
        } catch (e) {
          safeError('Error calculating contract length', e);
        }
      }

      // Create lead record
      const lead = await storage.createLead({
        propertyId: matchedProperty?.id,
        roomId: matchedRoom?.id,
        name: extractedData.tenantName,
        source: 'contract_upload',
        stage: 'contract_signed',
        moveInDate: extractedData.startDate ? new Date(extractedData.startDate) : undefined,
        moveOutDate: extractedData.endDate ? new Date(extractedData.endDate) : undefined,
        depositAmount: extractedData.depositAmount?.toString(),
        notes: `Contract uploaded: ${req.file.originalname}. Weekly rent: £${extractedData.weeklyRent || 'N/A'}. Contract length: ${contractLengthWeeks || 'N/A'} weeks`,
      });

      safeLog('Created lead from contract', { leadId: lead.id });

      // Delete the temporary file immediately
      try {
        await fs.unlink(tempFilePath);
        safeLog('Deleted temp file', {});
      } catch (deleteError) {
        safeError('Failed to delete temp file', deleteError);
      }

      // Prepare response message
      const tenantName = extractedData.tenantName || 'Tenant';
      const dateRange = extractedData.startDate && extractedData.endDate
        ? `${format(parseISO(extractedData.startDate), 'MMM yyyy')} - ${format(parseISO(extractedData.endDate), 'MMM yyyy')}`
        : 'dates not extracted';

      res.json({
        success: true,
        extractedData: {
          ...extractedData,
          propertyMatched: matchedProperty?.name || null,
          roomMatched: matchedRoom?.roomNumber || null,
        },
        leadId: lead.id,
        message: `Added ${tenantName} to calendar (${dateRange})${matchedProperty ? ` at ${matchedProperty.name}` : ''}`,
      });

    } catch (error: any) {
      safeError('Contract upload error', error);
      
      // Always try to delete temp file even on error
      if (tempFilePath) {
        try {
          await fs.unlink(tempFilePath);
          safeLog('Deleted temp file after error', {});
        } catch (deleteError) {
          safeError('Failed to delete temp file after error', deleteError);
        }
      }

      res.status(500).json({ 
        message: error.message || "Could not extract contract data - please enter manually" 
      });
    }
  });

  // ============================================================================
  // BILLING & SUBSCRIPTION MANAGEMENT
  // ============================================================================

  // Get subscription details
  app.get('/api/billing/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      
      // If user has a Stripe subscription ID, fetch latest from Stripe
      if (user.stripeSubscriptionId) {
        if (!stripe) throw new Error('Stripe not configured');
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        const product = stripe ? await stripe.products.retrieve(subscription.items.data[0].price.product as string) : null;
        
        return res.json({
          plan: user.subscriptionPlan,
          status: subscription.status,
          interval: subscription.items.data[0].price.recurring?.interval,
          amount: subscription.items.data[0].price.unit_amount! / 100,
          currency: subscription.items.data[0].price.currency,
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        });
      }
      
      // Return database subscription info if available
      res.json({
        plan: user.subscriptionPlan,
        status: user.subscriptionStatus,
        interval: user.subscriptionInterval,
        amount: null,
        currentPeriodStart: user.subscriptionStartDate,
        currentPeriodEnd: user.subscriptionEndDate,
        cancelAtPeriodEnd: false,
      });
    } catch (error: any) {
      safeError('Error fetching subscription', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Create Stripe Customer Portal session
  app.post('/api/billing/create-customer-portal-session', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      
      if (!user.stripeCustomerId) {
        return res.status(400).json({ message: "No Stripe customer found" });
      }

      if (!stripe) throw new Error('Stripe not configured');
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${req.protocol}://${req.get('host')}/billing`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      safeError('Error creating customer portal session', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Create new subscription
  app.post('/api/billing/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { plan, interval } = req.body;

      // Validate input
      if (!['starter', 'professional'].includes(plan)) {
        return res.status(400).json({ message: "Invalid plan" });
      }
      if (!['monthly', 'annual'].includes(interval)) {
        return res.status(400).json({ message: "Invalid interval" });
      }

      // Determine price based on plan and interval
      const prices: Record<string, Record<string, number>> = {
        starter: { monthly: 9900, annual: 99000 }, // £99/month or £990/year
        professional: { monthly: 19900, annual: 199000 }, // £199/month or £1990/year
      };

      const amount = prices[plan][interval];

      // Create or retrieve Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        if (!stripe) throw new Error('Stripe not configured');
        const customer = await stripe.customers.create({
          email: user.email!,
          name: `${user.firstName} ${user.lastName}`,
        });
        customerId = customer.id;
        
        // Update user with Stripe customer ID
        await storage.upsertUser({
          ...user,
          stripeCustomerId: customerId,
        });
      }

      // Create subscription
      if (!stripe) throw new Error('Stripe not configured');
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
            },
            recurring: {
              interval: interval === 'annual' ? 'year' : 'month',
            },
            unit_amount: amount,
          },
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription details
      await storage.upsertUser({
        ...user,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        subscriptionPlan: plan,
        subscriptionStatus: subscription.status,
        subscriptionInterval: interval,
        subscriptionStartDate: new Date((subscription as any).current_period_start * 1000),
        subscriptionEndDate: new Date((subscription as any).current_period_end * 1000),
      });

      const invoice = subscription.latest_invoice as any;
      const paymentIntent = invoice.payment_intent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      safeError('Error creating subscription', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Update subscription
  app.post('/api/billing/update-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { plan, interval } = req.body;

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription" });
      }

      // Validate input
      if (!['starter', 'professional'].includes(plan)) {
        return res.status(400).json({ message: "Invalid plan" });
      }
      if (!['monthly', 'annual'].includes(interval)) {
        return res.status(400).json({ message: "Invalid interval" });
      }

      // Determine price based on plan and interval
      const prices: Record<string, Record<string, number>> = {
        starter: { monthly: 9900, annual: 99000 },
        professional: { monthly: 19900, annual: 199000 },
      };

      const amount = prices[plan][interval];

      // Update subscription
      if (!stripe) throw new Error('Stripe not configured');
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      const updatedSubscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
            },
            recurring: {
              interval: interval === 'annual' ? 'year' : 'month',
            },
            unit_amount: amount,
          },
        }],
      });

      // Update user
      await storage.upsertUser({
        ...user,
        subscriptionPlan: plan,
        subscriptionInterval: interval,
        subscriptionStatus: updatedSubscription.status,
        subscriptionEndDate: new Date((updatedSubscription as any).current_period_end * 1000),
      });

      res.json({ success: true, subscription: updatedSubscription });
    } catch (error: any) {
      safeError('Error updating subscription', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Cancel subscription
  app.post('/api/billing/cancel-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription" });
      }

      // Cancel at period end
      if (!stripe) throw new Error('Stripe not configured');
      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Update user status
      await storage.upsertUser({
        ...user,
        subscriptionStatus: 'cancelled',
      });

      res.json({ 
        success: true, 
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        periodEnd: new Date((subscription as any).current_period_end * 1000),
      });
    } catch (error: any) {
      safeError('Error cancelling subscription', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get invoices
  app.get('/api/billing/invoices', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);

      if (!user.stripeCustomerId) {
        return res.json([]);
      }

      if (!stripe) throw new Error('Stripe not configured');
      const invoices = await stripe.invoices.list({
        customer: user.stripeCustomerId,
        limit: 12,
      });

      const formattedInvoices = invoices.data.map(invoice => ({
        id: invoice.id,
        date: new Date(invoice.created * 1000),
        amount: invoice.total / 100,
        currency: invoice.currency,
        status: invoice.status,
        invoicePdf: invoice.invoice_pdf,
        hostedInvoiceUrl: invoice.hosted_invoice_url,
      }));

      res.json(formattedInvoices);
    } catch (error: any) {
      safeError('Error fetching invoices', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // PROPERTY MANAGEMENT (Landlord Portal)
  // ============================================================================

  // Get all properties for authenticated landlord
  app.get('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const properties = await storage.getPropertiesByLandlord(landlordId);
      res.json(properties);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create new property
  app.post('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req); const landlordId = user.id;
      const propertyData = insertPropertySchema.parse({ ...req.body, landlordId });
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get single property
  app.get('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Verify ownership
      if (property.landlordId !== landlordId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(property);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update property
  app.patch('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Verify ownership
      if (property.landlordId !== landlordId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedProperty = await storage.updateProperty(req.params.id, req.body);
      res.json(updatedProperty);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete property
  app.delete('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Verify ownership
      if (property.landlordId !== landlordId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteProperty(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Room Type Analytics - Average weekly rate, void days, void cost per room type
  app.get("/api/properties/:propertyId/room-analytics", isAuthenticated, async (req, res) => {
    try {
      const { propertyId } = req.params;
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;

      // Verify property ownership
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, propertyId),
      });

      if (!property || property.landlordId !== landlordId) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Get all rooms for this property with their voids
      const roomsData = await db.query.rooms.findMany({
        where: eq(rooms.propertyId, propertyId),
        with: {
          voids: true,
        },
      });

      // Calculate analytics per room type
      const roomTypeMap = new Map<string, {
        roomType: string;
        count: number;
        totalWeeklyRate: number;
        avgWeeklyRate: number;
        totalVoidDays: number;
        totalVoidCost: number;
        voidCount: number;
        currentVacancies: number;
      }>();

      for (const room of roomsData) {
        const roomType = room.roomType;
        
        if (!roomTypeMap.has(roomType)) {
          roomTypeMap.set(roomType, {
            roomType,
            count: 0,
            totalWeeklyRate: 0,
            avgWeeklyRate: 0,
            totalVoidDays: 0,
            totalVoidCost: 0,
            voidCount: 0,
            currentVacancies: 0,
          });
        }

        const stats = roomTypeMap.get(roomType)!;
        stats.count += 1;
        stats.totalWeeklyRate += parseFloat(room.rentPerWeek);

        // Count current vacancies
        if (room.status === 'available') {
          stats.currentVacancies += 1;
        }

        // Calculate void days and costs
        for (const voidRecord of room.voids || []) {
          const startDate = new Date(voidRecord.voidStartDate);
          const endDate = voidRecord.voidEndDate 
            ? new Date(voidRecord.voidEndDate)
            : new Date(); // If still vacant, use today

          const voidDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          const weeklyRate = parseFloat(voidRecord.weeklyRateAtVoid);
          const voidCost = (voidDays / 7) * weeklyRate;

          stats.totalVoidDays += voidDays;
          stats.totalVoidCost += voidCost;
          stats.voidCount += 1;
        }
      }

      // Calculate averages
      const analytics = Array.from(roomTypeMap.values()).map(stats => ({
        ...stats,
        avgWeeklyRate: parseFloat((stats.totalWeeklyRate / stats.count).toFixed(2)),
        avgVoidDays: stats.voidCount > 0 
          ? parseFloat((stats.totalVoidDays / stats.voidCount).toFixed(1))
          : 0,
        avgVoidCost: stats.voidCount > 0 
          ? parseFloat((stats.totalVoidCost / stats.voidCount).toFixed(2))
          : 0,
      }));

      res.json(analytics);
    } catch (error) {
      console.error('Error fetching room analytics:', error);
      res.status(500).json({ message: "Failed to fetch room analytics" });
    }
  });

  // ============================================================================
  // ROOM MANAGEMENT
  // ============================================================================

  // Get rooms for a property
  app.get('/api/properties/:propertyId/rooms', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      const property = await storage.getProperty(req.params.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Verify ownership
      if (property.landlordId !== landlordId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const rooms = await storage.getRoomsByProperty(req.params.propertyId);
      res.json(rooms);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create room
  app.post('/api/properties/:propertyId/rooms', isAuthenticated, async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse({ 
        ...req.body, 
        propertyId: req.params.propertyId 
      });
      const room = await storage.createRoom(roomData);
      res.json(room);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update room
  app.patch('/api/rooms/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      const room = await storage.getRoom(req.params.id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      // Verify ownership through property
      const property = await storage.getProperty(room.propertyId);
      if (!property || property.landlordId !== landlordId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedRoom = await storage.updateRoom(req.params.id, req.body);
      res.json(updatedRoom);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ============================================================================
  // IMAGE IMPORT (Admin Tool)
  // ============================================================================

  // Import images for a property
  app.post('/api/properties/:id/import-images', isAuthenticated, async (req, res) => {
    try {
      const { heroImageUrl, floorPlanUrl, imageUrls } = req.body;
      const property = await storage.getProperty(req.params.id);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const results: any = {
        success: true,
        imported: [],
        failed: [],
      };

      const updates: any = {};

      if (heroImageUrl) {
        try {
          const ext = imageImportService.getFileExtension(heroImageUrl);
          const objectPath = imageImportService.generateObjectPath('property', property.id, `hero.${ext}`);
          const storedUrl = await imageImportService.downloadAndUploadImage(heroImageUrl, objectPath);
          updates.heroImageUrl = storedUrl;
          results.imported.push({ type: 'hero', sourceUrl: heroImageUrl, storedUrl });
        } catch (error: any) {
          results.failed.push({ type: 'hero', sourceUrl: heroImageUrl, error: error.message });
        }
      }

      if (floorPlanUrl) {
        try {
          const ext = imageImportService.getFileExtension(floorPlanUrl);
          const objectPath = imageImportService.generateObjectPath('property', property.id, `floor-plan.${ext}`);
          const storedUrl = await imageImportService.downloadAndUploadImage(floorPlanUrl, objectPath);
          updates.floorPlanUrl = storedUrl;
          results.imported.push({ type: 'floorPlan', sourceUrl: floorPlanUrl, storedUrl });
        } catch (error: any) {
          results.failed.push({ type: 'floorPlan', sourceUrl: floorPlanUrl, error: error.message });
        }
      }

      if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
        const storedImageUrls: string[] = [];
        
        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          try {
            const ext = imageImportService.getFileExtension(imageUrl);
            const objectPath = imageImportService.generateObjectPath('property', property.id, `image-${i + 1}.${ext}`);
            const storedUrl = await imageImportService.downloadAndUploadImage(imageUrl, objectPath);
            storedImageUrls.push(storedUrl);
            results.imported.push({ type: 'gallery', index: i, sourceUrl: imageUrl, storedUrl });
          } catch (error: any) {
            results.failed.push({ type: 'gallery', index: i, sourceUrl: imageUrl, error: error.message });
          }
        }
        
        if (storedImageUrls.length > 0) {
          updates.imageUrls = storedImageUrls;
        }
      }

      if (Object.keys(updates).length > 0) {
        await storage.updateProperty(req.params.id, updates);
      }

      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Import images for a room
  app.post('/api/rooms/:id/import-images', isAuthenticated, async (req, res) => {
    try {
      const { imageUrls, videoUrls } = req.body;
      const room = await storage.getRoom(req.params.id);
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const results: any = {
        success: true,
        imported: [],
        failed: [],
      };

      const updates: any = {};

      if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
        const storedImageUrls: string[] = [];
        
        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          try {
            const ext = imageImportService.getFileExtension(imageUrl);
            const objectPath = imageImportService.generateObjectPath('room', room.id, `image-${i + 1}.${ext}`);
            const storedUrl = await imageImportService.downloadAndUploadImage(imageUrl, objectPath);
            storedImageUrls.push(storedUrl);
            results.imported.push({ type: 'image', index: i, sourceUrl: imageUrl, storedUrl });
          } catch (error: any) {
            results.failed.push({ type: 'image', index: i, sourceUrl: imageUrl, error: error.message });
          }
        }
        
        if (storedImageUrls.length > 0) {
          updates.imageUrls = storedImageUrls;
        }
      }

      if (videoUrls && Array.isArray(videoUrls) && videoUrls.length > 0) {
        const storedVideoUrls: string[] = [];
        
        for (let i = 0; i < videoUrls.length; i++) {
          const videoUrl = videoUrls[i];
          try {
            const ext = imageImportService.getFileExtension(videoUrl);
            const objectPath = imageImportService.generateObjectPath('room', room.id, `video-${i + 1}.${ext}`);
            const storedUrl = await imageImportService.downloadAndUploadVideo(videoUrl, objectPath);
            storedVideoUrls.push(storedUrl);
            results.imported.push({ type: 'video', index: i, sourceUrl: videoUrl, storedUrl });
          } catch (error: any) {
            results.failed.push({ type: 'video', index: i, sourceUrl: videoUrl, error: error.message });
          }
        }
        
        if (storedVideoUrls.length > 0) {
          updates.videoUrls = storedVideoUrls;
        }
      }

      if (Object.keys(updates).length > 0) {
        await storage.updateRoom(req.params.id, updates);
      }

      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // AI DATA ENRICHMENT (WhatsApp Upload & Website Scraping)
  // ============================================================================

  // WhatsApp history upload and AI extraction
  app.post('/api/properties/whatsapp-upload', isAuthenticated, multer({ storage: multer.memoryStorage() }).single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await getAuthenticatedUser(req);
      let textContent = '';

      // Handle .txt files
      if (req.file.originalname.endsWith('.txt')) {
        textContent = req.file.buffer.toString('utf-8');
      } 
      // Handle .zip files
      else if (req.file.originalname.endsWith('.zip')) {
        const AdmZip = (await import('adm-zip')).default;
        const zip = new AdmZip(req.file.buffer);
        const zipEntries = zip.getEntries();
        
        // Find the .txt file in the zip
        const txtEntry = zipEntries.find(entry => entry.entryName.endsWith('.txt'));
        if (!txtEntry) {
          return res.status(400).json({ message: "No .txt file found in zip" });
        }
        
        textContent = txtEntry.getData().toString('utf-8');
      } else {
        return res.status(400).json({ message: "Invalid file type. Please upload .txt or .zip" });
      }

      // Save the WhatsApp history to object storage
      const uploadResponse = await fetch(`${req.protocol}://${req.get('host')}/api/objects/upload`, {
        method: 'POST',
        headers: {
          'Cookie': req.headers.cookie || '',
        },
      });
      const uploadData = await uploadResponse.json();

      // Upload the file content
      await fetch(uploadData.uploadURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: textContent,
      });

      // Normalize the object path
      const { ObjectStorageService } = await import('./objectStorage');
      const objectStorageService = new ObjectStorageService();
      const whatsappHistoryUrl = objectStorageService.normalizeObjectEntityPath(uploadData.uploadURL);

      // Use OpenAI to extract insights
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `Analyze this WhatsApp conversation history between a landlord and prospective tenants. Extract the following information:

1. Common Questions: What do tenants frequently ask about?
2. Property Highlights: What features/amenities are mentioned positively?
3. Policies: Any rules about pets, guests, smoking, noise?
4. Pricing: Rent amounts, deposits, included bills?
5. Location: Nearby universities, transport links mentioned?
6. Amenities: WiFi, gym, parking, etc.
7. FAQs: Create question-answer pairs from common exchanges

Return a JSON object with the following structure:
{
  "commonQuestions": ["question1", "question2"],
  "highlights": ["highlight1", "highlight2"],
  "policies": {
    "pets": "description",
    "guests": "description",
    "smoking": "description",
    "noise": "description"
  },
  "pricing": {
    "rent": "amount",
    "deposit": "amount",
    "billsIncluded": true/false
  },
  "location": {
    "universities": ["uni1", "uni2"],
    "transportLinks": "description"
  },
  "amenities": ["amenity1", "amenity2"],
  "faqs": [
    {"question": "q1", "answer": "a1"},
    {"question": "q2", "answer": "a2"}
  ]
}

WhatsApp conversation:
${textContent.substring(0, 10000)}`;

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an AI assistant that extracts property information from WhatsApp conversations. Always return valid JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const insights = JSON.parse(aiResponse.choices[0]?.message?.content || "{}");

      // Map insights to property fields
      const suggestedFields: any = {};

      if (insights.highlights && insights.highlights.length > 0) {
        suggestedFields.keyFeatures = insights.highlights;
      }

      if (insights.policies?.pets) {
        suggestedFields.petPolicy = insights.policies.pets;
      }

      if (insights.policies?.guests) {
        suggestedFields.guestPolicy = insights.policies.guests;
      }

      if (insights.policies?.smoking) {
        suggestedFields.smokingPolicy = insights.policies.smoking;
      }

      if (insights.policies?.noise) {
        suggestedFields.noisePolicy = insights.policies.noise;
      }

      if (insights.location?.universities) {
        suggestedFields.nearbyUniversities = insights.location.universities;
      }

      if (insights.location?.transportLinks) {
        suggestedFields.transportLinks = insights.location.transportLinks;
      }

      if (insights.amenities && insights.amenities.length > 0) {
        suggestedFields.amenities = insights.amenities;
      }

      if (insights.faqs && insights.faqs.length > 0) {
        suggestedFields.frequentQuestions = insights.faqs;
      }

      if (insights.pricing?.billsIncluded !== undefined) {
        suggestedFields.utilitiesIncluded = insights.pricing.billsIncluded;
      }

      res.json({
        insights,
        whatsappHistoryUrl,
        suggestedFields,
      });
    } catch (error: any) {
      safeError('WhatsApp upload error', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Website scraping and AI extraction
  app.post('/api/properties/scrape-website', isAuthenticated, async (req: any, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: "URL is required" });
      }

      // Validate URL
      let websiteUrl: URL;
      try {
        websiteUrl = new URL(url);
      } catch {
        return res.status(400).json({ message: "Invalid URL format" });
      }

      // Fetch the website HTML
      const response = await fetch(websiteUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PropertyBot/1.0)',
        },
      });

      if (!response.ok) {
        return res.status(400).json({ message: `Failed to fetch website: ${response.statusText}` });
      }

      const html = await response.text();

      // Extract text content (simple approach - remove HTML tags)
      const textContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Use OpenAI to extract property information
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `Extract property information from this website content. Identify:

1. Property description
2. Amenities and facilities
3. Room types and pricing
4. Policies (pets, smoking, guests)
5. Location details (universities, transport)
6. FAQs if present
7. Contact information

Return a JSON object with the following structure:
{
  "description": "property description",
  "amenities": ["amenity1", "amenity2"],
  "roomTypes": [{"type": "type", "price": "price"}],
  "policies": {
    "pets": "description",
    "smoking": "description",
    "guests": "description"
  },
  "location": {
    "universities": ["uni1", "uni2"],
    "transportLinks": "description"
  },
  "faqs": [
    {"question": "q1", "answer": "a1"}
  ],
  "keyFeatures": ["feature1", "feature2"],
  "utilitiesIncluded": true/false,
  "utilityDetails": "what's included"
}

Website content:
${textContent.substring(0, 10000)}`;

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an AI assistant that extracts property information from websites. Always return valid JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const insights = JSON.parse(aiResponse.choices[0]?.message?.content || "{}");

      // Map insights to property fields
      const suggestedFields: any = {};

      if (insights.description) {
        suggestedFields.description = insights.description;
      }

      if (insights.amenities && insights.amenities.length > 0) {
        suggestedFields.amenities = insights.amenities;
      }

      if (insights.keyFeatures && insights.keyFeatures.length > 0) {
        suggestedFields.keyFeatures = insights.keyFeatures;
      }

      if (insights.policies?.pets) {
        suggestedFields.petPolicy = insights.policies.pets;
      }

      if (insights.policies?.smoking) {
        suggestedFields.smokingPolicy = insights.policies.smoking;
      }

      if (insights.policies?.guests) {
        suggestedFields.guestPolicy = insights.policies.guests;
      }

      if (insights.location?.universities) {
        suggestedFields.nearbyUniversities = insights.location.universities;
      }

      if (insights.location?.transportLinks) {
        suggestedFields.transportLinks = insights.location.transportLinks;
      }

      if (insights.faqs && insights.faqs.length > 0) {
        suggestedFields.frequentQuestions = insights.faqs;
      }

      if (insights.utilitiesIncluded !== undefined) {
        suggestedFields.utilitiesIncluded = insights.utilitiesIncluded;
      }

      if (insights.utilityDetails) {
        suggestedFields.utilityDetails = insights.utilityDetails;
      }

      res.json({
        insights,
        suggestedFields,
      });
    } catch (error: any) {
      safeError('Website scraping error', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Apply AI insights to a property
  app.patch('/api/properties/:id/apply-insights', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { fields } = req.body;

      if (!fields || typeof fields !== 'object') {
        return res.status(400).json({ message: "Fields object is required" });
      }

      // Update property with suggested fields
      const updatedProperty = await storage.updateProperty(req.params.id, {
        ...fields,
        dataEnrichmentStatus: 'completed',
        enrichmentProcessedAt: new Date(),
      });

      res.json(updatedProperty);
    } catch (error: any) {
      safeError('Apply insights error', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // LEAD MANAGEMENT
  // ============================================================================

  // Get all leads (for landlord dashboard)
  app.get('/api/leads', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req); const landlordId = user.id;
      const properties = await storage.getPropertiesByLandlord(landlordId);
      
      // Get all leads for landlord's properties
      const allLeads = await Promise.all(
        properties.map(p => storage.getLeadsByProperty(p.id))
      );
      
      // Filter out archived/completed leads by default
      const leads = allLeads.flat().filter(lead => !lead.archived);
      
      res.json(leads);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get leads by stage
  app.get('/api/leads/stage/:stage', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const properties = await storage.getPropertiesByLandlord(landlordId);
      
      // Get all leads for landlord's properties
      const allLeads = await Promise.all(
        properties.map(p => storage.getLeadsByProperty(p.id))
      );
      
      // Filter by stage and exclude archived leads
      const leads = allLeads.flat().filter(lead => 
        lead.stage === req.params.stage && !lead.archived
      );
      
      res.json(leads);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update lead stage
  app.patch('/api/leads/:id/stage', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      // Verify ownership through property
      if (!lead.propertyId) {
        return res.status(400).json({ message: "Lead has no property assigned" });
      }
      const property = await storage.getProperty(lead.propertyId);
      if (!property || property.landlordId !== landlordId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { stage } = req.body;
      const updatedLead = await storage.updateLeadStage(req.params.id, stage);
      res.json(updatedLead);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update lead
  app.patch('/api/leads/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      // Verify ownership through property
      if (!lead.propertyId) {
        return res.status(400).json({ message: "Lead has no property assigned" });
      }
      const property = await storage.getProperty(lead.propertyId);
      if (!property || property.landlordId !== landlordId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedLead = await storage.updateLead(req.params.id, req.body);
      res.json(updatedLead);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Public lead capture form (no authentication required)
  app.post('/api/leads/public-form', async (req, res) => {
    try {
      const { name, email, phone, propertyName, roomType } = req.body;

      // Create lead from public form
      const lead = await storage.createLead({
        name,
        email,
        phone,
        whatsappNumber: phone, // Use same number for WhatsApp
        source: 'web_form',
        sourceDetails: { propertyName, roomType },
        stage: 'new_enquiry',
      });

      // Send WhatsApp template message if phone provided
      if (phone) {
        try {
          const whatsappMessage = `Hi ${name || 'there'}! 👋

Thanks for your enquiry about ${propertyName}${roomType !== 'Any' ? ` - ${roomType}` : ''}.

I'm Ava from TermFlow. I can help you with:
📅 Viewing slots (in-person, video, or self-guided)
🏠 Room availability and pricing
📝 Application and booking

What would you like to know?`;

          await sendWhatsAppMessage(phone, whatsappMessage);
          
          safeLog('WhatsApp welcome sent to form lead', { 
            leadId: lead.id,
            phoneHash: hashPII(phone)
          });
        } catch (whatsappError: any) {
          safeError('Failed to send WhatsApp to form lead', whatsappError);
          // Don't fail the whole request if WhatsApp fails
        }
      }

      res.json({ 
        success: true, 
        leadId: lead.id,
        message: 'Enquiry received. Check your WhatsApp for next steps!' 
      });
    } catch (error: any) {
      safeError('Public form submission error', error);
      res.status(400).json({ message: error.message });
    }
  });

  // ============================================================================
  // HOLD/RESERVATION MANAGEMENT
  // ============================================================================

  // Create or extend hold (48h by default)
  app.post('/api/holds/create', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { leadId, hours = 48 } = req.body;

      const lead = await storage.getLead(leadId);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Verify ownership through property
      if (lead.propertyId) {
        const property = await storage.getProperty(lead.propertyId);
        if (!property || property.landlordId !== landlordId) {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      // Calculate expiry time
      const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

      // Update lead with hold
      const updatedLead = await storage.updateLead(leadId, {
        holdActive: true,
        holdExpiresAt: expiresAt,
        holdCreatedAt: new Date(),
        hold24hNudgeSent: false,
        hold1hNudgeSent: false,
      });

      // Send WhatsApp confirmation if phone available
      if (lead.whatsappNumber && !lead.whatsappOptOut) {
        const roomType = lead.roomId ? 'your selected room' : 'the room';
        const deadline = expiresAt.toLocaleString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        });
        await sendWhatsAppMessage(
          lead.whatsappNumber,
          `I'm holding ${roomType} until ${deadline}. A quick ID check will keep it secure.`
        );
      }

      res.json({ 
        success: true, 
        expiresAt, 
        lead: updatedLead 
      });
    } catch (error: any) {
      safeError('Create hold error', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Extend existing hold
  app.post('/api/holds/extend', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { leadId, hours = 24 } = req.body;

      const lead = await storage.getLead(leadId);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Verify ownership
      if (lead.propertyId) {
        const property = await storage.getProperty(lead.propertyId);
        if (!property || property.landlordId !== landlordId) {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      // Extend from current expiry or now
      const baseTime = lead.holdExpiresAt && lead.holdActive 
        ? new Date(lead.holdExpiresAt).getTime()
        : Date.now();
      const newExpiresAt = new Date(baseTime + hours * 60 * 60 * 1000);

      const updatedLead = await storage.updateLead(leadId, {
        holdExpiresAt: newExpiresAt,
        holdActive: true,
      });

      res.json({ 
        success: true, 
        expiresAt: newExpiresAt, 
        lead: updatedLead 
      });
    } catch (error: any) {
      safeError('Extend hold error', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Release hold manually
  app.post('/api/holds/release', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { leadId } = req.body;

      const lead = await storage.getLead(leadId);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Verify ownership
      if (lead.propertyId) {
        const property = await storage.getProperty(lead.propertyId);
        if (!property || property.landlordId !== landlordId) {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      const updatedLead = await storage.updateLead(leadId, {
        holdActive: false,
      });

      res.json({ 
        success: true, 
        lead: updatedLead 
      });
    } catch (error: any) {
      safeError('Release hold error', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // AI CONVERSATION SYSTEM
  // ============================================================================

  // Chat with AI (web interface)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, leadId, conversationId, propertyId } = req.body;
      
      let conversation;
      
      if (conversationId) {
        conversation = await storage.getConversation(conversationId);
      } else if (leadId) {
        // Find or create conversation
        conversation = await storage.findConversationByChannel(leadId, 'web');
        if (!conversation) {
          conversation = await storage.createConversation({
            leadId,
            channel: 'web',
            channelIdentifier: 'web-session',
          });
        }
      } else {
        return res.status(400).json({ message: "leadId or conversationId required" });
      }

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Get additional context if property provided
      let additionalContext: any = {};
      if (propertyId) {
        const property = await storage.getProperty(propertyId);
        const rooms = await storage.getRoomsByProperty(propertyId);
        additionalContext.propertyInfo = property;
        additionalContext.roomInfo = rooms;
      }

      const response = await aiService.generateResponse(
        conversation.id,
        message,
        additionalContext
      );

      res.json({ 
        response, 
        conversationId: conversation.id 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get conversation history
  app.get('/api/conversations/:id/messages', async (req, res) => {
    try {
      const messages = await storage.getMessagesByConversation(req.params.id);
      res.json(messages.reverse());
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all conversations for a lead
  app.get('/api/leads/:leadId/conversations', isAuthenticated, async (req, res) => {
    try {
      const conversations = await storage.getConversationsByLead(req.params.leadId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // WEBHOOK HANDLERS (Multi-channel lead capture)
  // ============================================================================

  // WhatsApp webhook (Twilio) with idempotent processing
  app.post(
    '/api/webhooks/whatsapp',
    createIdempotentWebhookHandler({
      provider: 'twilio',
      getEventId: (req) => req.body.MessageSid || req.body.SmsSid,
      getEventType: (req) => 'message.received',
      verifySignature: async (req) => {
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        
        if (!authToken) {
          safeLog('TWILIO_AUTH_TOKEN not set - skipping signature verification', {});
          return true; // In dev, allow without signature
        }
        
        const twilioSignature = req.headers['x-twilio-signature'] as string;
        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        
        try {
          const isValid = await validateTwilioSignature(twilioSignature, url, req.body);
          
          if (!isValid) {
            safeError('Twilio signature verification failed', new Error('Invalid signature'));
          }
          
          return isValid;
        } catch (validationError) {
          safeError('Twilio signature verification error', validationError);
          return false;
        }
      }
    }, storage),
    async (req, res) => {
    try {
      const { From, Body, MessageSid } = req.body;
      const webhookEvent = req.webhookEvent;
      
      safeLog('WhatsApp message received', {
        from: hashPII(From),
        messageId: MessageSid,
        bodyLength: Body?.length,
      });

      // Find or create lead
      let lead = await storage.findLeadByContact(undefined, undefined, From);
      
      if (!lead) {
        safeLog('Creating new lead for WhatsApp', { 
          fromHash: hashPII(From)
        });
        lead = await storage.createLead({
          whatsappNumber: From,
          source: 'whatsapp',
          stage: 'new_enquiry',
        });
      }

      // Find or create conversation
      let conversation = await storage.findConversationByChannel(lead.id, 'whatsapp');
      
      if (!conversation) {
        safeLog('Creating new WhatsApp conversation', { 
          leadId: lead.id
        });
        conversation = await storage.createConversation({
          leadId: lead.id,
          channel: 'whatsapp',
          channelIdentifier: From,
        });
      }

      // Check if this is a response to a pending follow-up
      const latestFollowUp = await storage.getLatestFollowUp(lead.id);
      if (latestFollowUp && !latestFollowUp.responded) {
        await storage.markFollowUpResponded(latestFollowUp.id);
        safeLog('Follow-up marked as responded', { 
          followUpId: latestFollowUp.id
        });
      }

      // Pattern-based quick responses for common queries
      const messageBody = (Body || '').trim();
      let quickResponse: string | null = null;

      // HELP command
      if (/^help$/i.test(messageBody)) {
        quickResponse = "You're chatting with TermFlow. I can book viewings, reserve rooms, or answer questions about our properties.";
      }
      // STOP/unsubscribe
      else if (/^(stop|unsubscribe)$/i.test(messageBody)) {
        quickResponse = "No problem. I'll pause messages. Reply START to resume.";
        await storage.updateLead(lead.id, { 
          whatsappOptOut: true,
          notes: `${lead.notes || ''}\nWhatsApp opt-out: ${new Date().toISOString()}`
        });
      }
      // START to resume
      else if (/^start$/i.test(messageBody)) {
        await storage.updateLead(lead.id, { 
          whatsappOptOut: false,
          notes: `${lead.notes || ''}\nWhatsApp opt-in: ${new Date().toISOString()}`
        });
        quickResponse = "Thanks, I'm here to help!";
      }

      let aiResponse: string;

      if (quickResponse) {
        // Use pattern-based response and save to conversation
        aiResponse = quickResponse;
        await storage.createMessage({
          conversationId: conversation.id,
          role: 'user',
          content: messageBody,
        });
        await storage.createMessage({
          conversationId: conversation.id,
          role: 'assistant',
          content: aiResponse,
        });
        
        safeLog('Quick response sent', { 
          pattern: messageBody,
          responseLength: aiResponse.length
        });
      } else {
        // Generate AI response with Ava's personality
        aiResponse = await aiService.generateResponse(conversation.id, Body);
        
        safeLog('AI response generated', { 
          responseLength: aiResponse.length
        });
      }

      // Send response back via WhatsApp
      try {
        await sendWhatsAppMessage(From, aiResponse);
        safeLog('WhatsApp response sent', { 
          toHash: hashPII(From)
        });
        
        // Mark webhook as processed
        await markWebhookComplete(storage, webhookEvent.id);
        
        // Respond to Twilio webhook (200 OK)
        res.status(200).send('OK');
      } catch (twilioError: any) {
        safeError('Failed to send WhatsApp response', twilioError);
        
        // Mark webhook as failed
        await markWebhookFailed(storage, webhookEvent.id, twilioError.message);
        
        // Return error to Twilio so they retry
        return res.status(500).json({ 
          message: 'Failed to send WhatsApp message',
          error: twilioError.message 
        });
      }
    } catch (error: any) {
      safeError('WhatsApp webhook error', error);
      if (req.webhookEvent) {
        await markWebhookFailed(storage, req.webhookEvent.id, error.message);
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Email webhook (from portals or direct) with idempotent processing
  app.post(
    '/api/webhooks/email',
    createIdempotentWebhookHandler({
      provider: 'email',
      getEventId: (req) => req.body.messageId || `${req.body.from}-${Date.now()}`,
      getEventType: (req) => 'email.received',
    }, storage),
    async (req, res) => {
    try {
      const { from, subject, body, propertyRef } = req.body;
      const webhookEvent = req.webhookEvent;

      // Find or create lead
      let lead = await storage.findLeadByContact(from);
      
      if (!lead) {
        lead = await storage.createLead({
          email: from,
          source: 'email',
          sourceDetails: { subject, propertyRef },
          stage: 'new_enquiry',
        });
      }

      // Find or create conversation
      let conversation = await storage.findConversationByChannel(lead.id, 'email');
      
      if (!conversation) {
        conversation = await storage.createConversation({
          leadId: lead.id,
          channel: 'email',
          channelIdentifier: from,
        });
      }

      // Store incoming message
      await storage.createMessage({
        conversationId: conversation.id,
        role: 'user',
        content: body,
      });

      // Send auto-reply email with WhatsApp/form links
      const baseUrl = process.env.BASE_URL || 'https://termflow.com';
      const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER ?? '+447700900000';
      const propertyName = propertyRef || subject?.replace(/enquiry|interest|inquiry/gi, '').trim() || 'our properties';
      
      // Generate WhatsApp deep link
      const whatsappMessage = encodeURIComponent(`Hi, I'm interested in ${propertyName}`);
      const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${whatsappMessage}`;
      const formLink = `${baseUrl}/form`;
      
      const { generateEmailAutoReply } = await import('./emailTemplates');
      const autoReplyHtml = generateEmailAutoReply({
        studentName: lead.name,
        propertyName,
        whatsappLink,
        formLink,
      });

      // Send auto-reply
      await emailService.sendEmail(
        from,
        `Re: ${subject || 'Your Property Enquiry'}`,
        autoReplyHtml
      );

      safeLog('Email auto-reply sent to portal enquiry', {
        leadId: lead.id,
        emailHash: hashPII(from),
        property: propertyName,
      });

      // Mark webhook as processed
      await markWebhookComplete(storage, webhookEvent.id);

      res.json({ 
        success: true, 
        leadId: lead.id,
        autoReplySent: true 
      });
    } catch (error: any) {
      safeError('Email webhook error', error);
      if (req.webhookEvent) {
        await markWebhookFailed(storage, req.webhookEvent.id, error.message);
      }
      res.status(500).json({ message: error.message });
    }
  });

  // JustCall webhook (call transcription and AI insights) with idempotent processing
  app.post(
    '/api/webhooks/justcall',
    createIdempotentWebhookHandler({
      provider: 'justcall',
      getEventId: (req) => req.body.call_id || req.body.call_sid || req.body.id,
      getEventType: (req) => req.body.event_type || 'call.completed',
      verifySignature: async (req) => {
        const apiKey = process.env.JUSTCALL_API_KEY;
        
        if (!apiKey) {
          safeLog('JUSTCALL_API_KEY not set - skipping signature verification', {});
          return true; // In dev, allow without signature
        }
        
        // JustCall uses API key in header or HMAC signature
        const providedKey = req.headers['x-api-key'] as string;
        
        if (providedKey !== apiKey) {
          safeError('JustCall API key verification failed', new Error('Invalid API key'));
          return false;
        }
        
        return true;
      }
    }, storage),
    async (req, res) => {
    try {
      const {
        call_id,
        call_sid,
        caller_number,
        client_number,
        call_transcription,
        call_summary,
        action_items,
        customer_sentiment,
        call_duration,
        call_score
      } = req.body;
      const webhookEvent = req.webhookEvent;

      // Match caller to existing lead (try multiple formats)
      const phoneNumbers = [caller_number, client_number].filter(Boolean);
      let lead = null;
      
      for (const phone of phoneNumbers) {
        lead = await storage.findLeadByPhone(phone);
        if (lead) break;
      }

      if (!lead) {
        // Create new lead if not found
        lead = await storage.createLead({
          phone: caller_number,
          source: 'justcall',
          sourceDetails: { call_id, call_sid },
          stage: 'new_enquiry',
        });
      }

      // Find or create conversation
      let conversation = await storage.findConversationByChannel(lead.id, 'phone');
      
      if (!conversation) {
        conversation = await storage.createConversation({
          leadId: lead.id,
          channel: 'phone',
          channelIdentifier: caller_number,
        });
      }

      // Store call transcription as conversation context
      const transcriptText = call_transcription
        ?.map((segment: any) => `Speaker ${segment.speaker_id}: ${segment.sentence}`)
        .join('\n') || '';

      // Create call context message
      const callContext = `
CALL SUMMARY (${Math.floor(call_duration / 60)}min ${call_duration % 60}sec):
Sentiment: ${customer_sentiment || 'Unknown'}
Summary: ${call_summary || 'No summary'}
Action Items: ${action_items || 'None'}

TRANSCRIPT:
${transcriptText}
    `.trim();

      // Save as system message for AI context
      await storage.createMessage({
        conversationId: conversation.id,
        role: 'system',
        content: callContext,
      });

      // Get landlord ID from lead's property
      const property = lead.propertyId ? await storage.getProperty(lead.propertyId) : null;
      const landlordId = property?.landlordId;

      // Create call log entry for performance tracking
      if (landlordId) {
        await storage.createCallLog({
          landlordId,
          leadId: lead.id,
          conversationId: conversation.id,
          callId: call_id,
          callSid: call_sid,
          callerNumber: caller_number,
          clientNumber: client_number,
          callDuration: call_duration,
          callScore: call_score,
          customerSentiment: customer_sentiment,
          callSummary: call_summary,
          actionItems: action_items,
          callTranscription: call_transcription,
          staffReviewed: false,
          leadInfoUpdated: false,
        });
      }

      safeLog('JustCall call saved', { 
        callId: call_id,
        leadId: lead.id
      });

      // Mark webhook as processed
      await markWebhookComplete(storage, webhookEvent.id);

      res.json({ success: true, leadId: lead.id });
    } catch (error: any) {
      safeError('JustCall webhook error', error);
      if (req.webhookEvent) {
        await markWebhookFailed(storage, req.webhookEvent.id, error.message);
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Web form submission (create lead + start conversation)
  app.post('/api/leads', async (req, res) => {
    try {
      // Import lead capture schema
      const { leadCaptureSchema } = await import("@shared/schema");
      
      // Validate and sanitize input using simple schema
      const validated = leadCaptureSchema.parse(req.body);
      
      // XSS Sanitization - escape HTML characters
      const sanitize = (str: string | undefined): string | undefined => {
        if (!str) return str;
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      };
      
      const sanitizedEmail = validated.email.toLowerCase().trim();
      const sanitizedName = sanitize(validated.name);
      const sanitizedCompany = sanitize(validated.company);
      const sanitizedNotes = sanitize(validated.notes);
      
      // Rate limiting: Check if this email was submitted in the last hour
      if (sanitizedEmail) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentLeads = await db
          .select()
          .from(leads)
          .where(
            and(
              eq(leads.email, sanitizedEmail),
              gte(leads.createdAt, oneHourAgo)
            )
          )
          .limit(1);
        
        if (recentLeads.length > 0) {
          safeLog('Rate limit triggered for email', { 
            emailHash: hashPII(sanitizedEmail),
            source: validated.source 
          });
          
          // Return success to prevent revealing rate limiting to potential abusers
          return res.json({ 
            success: true,
            message: 'Thank you for your interest. We\'ll be in touch soon.' 
          });
        }
      }
      
      // Check for existing lead by email
      const existingLead = await storage.findLeadByContact(
        sanitizedEmail,
        undefined,
        undefined
      );

      if (existingLead) {
        safeLog('Existing lead found, returning existing', { 
          leadId: existingLead.id,
          emailHash: hashPII(sanitizedEmail)
        });
        return res.json({ 
          success: true,
          leadId: existingLead.id,
          message: 'Thank you for your interest. We\'ll be in touch soon.' 
        });
      }

      // Create new lead with sanitized data
      const lead = await storage.createLead({
        email: sanitizedEmail,
        name: sanitizedName,
        company: sanitizedCompany,
        source: validated.source,
        notes: sanitizedNotes,
        stage: 'new_enquiry',
      });
      
      safeLog('New lead created from form', { 
        leadId: lead.id,
        source: validated.source,
        emailHash: hashPII(sanitizedEmail)
      });
      
      // Assign conversation strategy based on source
      const { strategyAssignmentService } = await import("./services/strategyAssignment");
      try {
        await strategyAssignmentService.assignStrategy({
          leadId: lead.id,
          source: validated.source,
        });
      } catch (strategyError) {
        // Log error but don't fail the request
        safeError('Failed to assign strategy', strategyError);
      }

      res.json({ 
        success: true,
        leadId: lead.id,
        message: 'Thank you for your interest. We\'ll be in touch soon.' 
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          success: false,
          message: 'Please check your input and try again.',
          errors: error.errors 
        });
      }
      
      safeError('Lead creation error', error);
      res.status(500).json({ 
        success: false,
        message: 'Something went wrong. Please try again later.' 
      });
    }
  });

  // ============================================================================
  // TEST WEBHOOKS (No signature validation for internal testing)
  // ============================================================================

  // Test WhatsApp webhook (bypasses Twilio signature validation)
  app.post('/api/test/whatsapp-webhook', isAuthenticated, async (req, res) => {
    try {
      const { From, Body } = req.body;
      
      safeLog('TEST: WhatsApp message received', { 
        fromHash: hashPII(From),
        bodyLength: Body?.length || 0
      });
      
      // Log webhook for debugging
      await storage.createWebhookLog({
        source: 'twilio_test',
        eventType: 'whatsapp_message',
        payload: req.body,
      });

      // Find or create lead
      let lead = await storage.findLeadByContact(undefined, undefined, From);
      
      if (!lead) {
        safeLog('TEST: Creating new lead', { 
          fromHash: hashPII(From)
        });
        lead = await storage.createLead({
          whatsappNumber: From,
          source: 'whatsapp',
          stage: 'new_enquiry',
        });
      }

      // Find or create conversation
      let conversation = await storage.findConversationByChannel(lead.id, 'whatsapp');
      
      if (!conversation) {
        safeLog('TEST: Creating new WhatsApp conversation', { 
          leadId: lead.id
        });
        conversation = await storage.createConversation({
          leadId: lead.id,
          channel: 'whatsapp',
          channelIdentifier: From,
        });
      }

      // Create message record for incoming tenant message
      await storage.createMessage({
        conversationId: conversation.id,
        role: 'user',
        content: Body,
      });
      safeLog('TEST: Saved user message', { 
        conversationId: conversation.id
      });

      // Generate AI response (skip auto-persistence since we persist manually)
      const aiResponse = await aiService.generateResponse(conversation.id, Body, undefined, true);
      safeLog('TEST: Generated AI response', { 
        responseLength: aiResponse.length
      });

      // Create message record for AI response
      await storage.createMessage({
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
      });
      safeLog('TEST: Saved assistant message', { 
        conversationId: conversation.id
      });

      // Send WhatsApp message (simulate production behavior)
      try {
        await sendWhatsAppMessage(From, aiResponse);
        safeLog('TEST: WhatsApp response sent', { 
          toHash: hashPII(From)
        });
      } catch (twilioError: any) {
        safeError('TEST: Failed to send WhatsApp response', twilioError);
        // Continue anyway for testing purposes
      }
      
      // Get updated lead and all conversation messages
      const updatedLead = await storage.getLead(lead.id);
      const messages = await storage.getMessagesByConversation(conversation.id);
      
      res.json({ 
        success: true, 
        aiResponse,
        lead: updatedLead,
        conversation: {
          id: conversation.id,
          channel: conversation.channel,
          messages: messages.reverse() // Return in chronological order
        }
      });
    } catch (error: any) {
      safeError('TEST: WhatsApp webhook error', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Test email webhook
  app.post('/api/test/email-webhook', isAuthenticated, async (req, res) => {
    try {
      const { from, subject, body, propertyRef } = req.body;
      
      safeLog('TEST: Email received', { 
        fromHash: hashPII(from),
        subjectLength: subject?.length || 0
      });
      
      await storage.createWebhookLog({
        source: 'email_test',
        eventType: 'email_received',
        payload: req.body,
      });

      // Find or create lead
      let lead = await storage.findLeadByContact(from);
      
      if (!lead) {
        safeLog('TEST: Creating new lead for email', { 
          fromHash: hashPII(from)
        });
        lead = await storage.createLead({
          email: from,
          source: 'email',
          sourceDetails: { subject, propertyRef },
          stage: 'new_enquiry',
        });
      }

      // Find or create conversation
      let conversation = await storage.findConversationByChannel(lead.id, 'email');
      
      if (!conversation) {
        safeLog('TEST: Creating new email conversation', { 
          leadId: lead.id
        });
        conversation = await storage.createConversation({
          leadId: lead.id,
          channel: 'email',
          channelIdentifier: from,
        });
      }

      // Create message record for incoming email
      await storage.createMessage({
        conversationId: conversation.id,
        role: 'user',
        content: body,
      });
      safeLog('TEST: Saved user message', { 
        conversationId: conversation.id
      });

      // Generate AI response (skip auto-persistence since we persist manually)
      const aiResponse = await aiService.generateResponse(conversation.id, body, undefined, true);
      safeLog('TEST: Generated AI response', { 
        responseLength: aiResponse.length
      });

      // Create message record for AI response
      await storage.createMessage({
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
      });
      safeLog('TEST: Saved assistant message', { 
        conversationId: conversation.id
      });
      
      // Get updated lead and all conversation messages
      const updatedLead = await storage.getLead(lead.id);
      const messages = await storage.getMessagesByConversation(conversation.id);

      res.json({ 
        success: true, 
        aiResponse,
        lead: updatedLead,
        conversation: {
          id: conversation.id,
          channel: conversation.channel,
          messages: messages.reverse() // Return in chronological order
        }
      });
    } catch (error: any) {
      safeError('TEST: Email webhook error', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get webhook logs (for testing dashboard)
  app.get('/api/test/webhook-logs', isAuthenticated, async (req, res) => {
    try {
      const source = req.query.source as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      const logs = await storage.getAllWebhookLogs(source, limit);
      res.json(logs);
    } catch (error: any) {
      safeError('Error fetching webhook logs', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // VIEWING MANAGEMENT
  // ============================================================================

  // Create viewing
  app.post('/api/viewings', async (req, res) => {
    try {
      const viewingData = insertViewingSchema.parse(req.body);
      
      // Get lead and property details for calendar event
      const lead = await storage.getLead(viewingData.leadId);
      const property = await storage.getProperty(viewingData.propertyId);
      
      if (!lead || !property) {
        return res.status(404).json({ message: 'Lead or property not found' });
      }

      // Create shared calendar event
      let googleCalendarEventId = null;
      let googleMeetLink = null;
      
      try {
        const { GoogleCalendarService } = await import('./googleCalendarService');
        const calendarService = new GoogleCalendarService();
        const calendarEvent = await calendarService.createViewingEvent({
          scheduledAt: viewingData.scheduledAt,
          duration: viewingData.duration || 30,
          viewingType: viewingData.viewingType,
          lead: {
            firstName: lead.name?.split(' ')[0] || '',
            lastName: lead.name?.split(' ').slice(1).join(' ') || '',
            email: lead.email,
            phone: lead.phone || '',
          },
          property: {
            name: property.name,
            address: property.address,
          },
        });
        
        googleCalendarEventId = calendarEvent.eventId;
        googleMeetLink = calendarEvent.meetLink;
      } catch (calendarError: any) {
        console.error('Calendar event creation failed (continuing anyway):', calendarError);
      }

      // Create viewing with calendar event ID
      const viewing = await storage.createViewing({
        ...viewingData,
        googleCalendarEventId,
        googleMeetLink,
      });
      
      // Update lead stage to viewing_booked
      await storage.updateLeadStage(viewingData.leadId, 'viewing_booked');
      
      // Track viewing booked milestone
      const { funnelTrackingService } = await import('./services/funnelTracking');
      await funnelTrackingService.trackViewingBooked(viewingData.leadId, viewing.id);
      
      // Send WhatsApp confirmation
      try {
        const { sendWhatsAppMessage } = await import('./twilioService');
        const formattedDate = new Date(viewingData.scheduledAt).toLocaleString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        
        let message = `Hi ${lead.name?.split(' ')[0] || 'there'}! Your viewing for ${property.name} is confirmed for ${formattedDate}.`;
        
        if (viewingData.viewingType === 'video_call' && googleMeetLink) {
          message += `\n\nJoin the video call here: ${googleMeetLink}`;
        } else if (viewingData.viewingType === 'in_person') {
          message += `\n\nAddress: ${property.address}`;
        }
        
        message += `\n\nLooking forward to showing you around!`;
        
        if (lead.phone) {
          await sendWhatsAppMessage(lead.phone, message);
        }
      } catch (whatsappError: any) {
        console.error('WhatsApp confirmation failed (viewing still created):', whatsappError);
      }
      
      // Send staff reminder with conversation summary
      try {
        const preferences = await storage.getViewingPreferencesByLandlord(property.landlordId);
        
        if (preferences?.staffMobile) {
          // Get conversation messages for summary
          const conversations = await storage.getConversationsByLead(lead.id);
          let conversationMessages: any[] = [];
          
          if (conversations.length > 0) {
            conversationMessages = await storage.getMessagesByConversation(conversations[0].id);
          }
          
          const studentName = lead.name?.split(' ')[0] || lead.name || 'Student';
          
          await sendViewingReminderToStaff(
            preferences.staffMobile,
            studentName,
            new Date(viewingData.scheduledAt),
            conversationMessages
          );
          
          console.log(`✅ Staff reminder sent to ${preferences.staffMobile} for viewing with ${studentName}`);
        } else {
          console.log('⚠️ No staff mobile configured - skipping staff reminder');
        }
      } catch (staffReminderError: any) {
        console.error('Failed to send staff reminder (viewing still created):', staffReminderError);
      }
      
      res.json(viewing);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get upcoming viewings
  app.get('/api/viewings/upcoming', isAuthenticated, async (req, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const propertyId = req.query.propertyId as string | undefined;
      const viewings = await storage.getUpcomingViewings(landlordId, propertyId);
      res.json(viewings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update viewing
  app.patch('/api/viewings/:id', isAuthenticated, async (req, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const currentViewing = await storage.getViewing(req.params.id);
      if (!currentViewing) {
        return res.status(404).json({ message: 'Viewing not found' });
      }

      // SECURITY: Verify landlord owns the property associated with this viewing
      const property = await storage.getProperty(currentViewing.propertyId);
      if (!property || property.landlordId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized: You do not own this viewing' });
      }

      // Update shared calendar event if cancelled or rescheduled
      if (currentViewing.googleCalendarEventId) {
        try {
          const { GoogleCalendarService } = await import('./googleCalendarService');
          const calendarService = new GoogleCalendarService();
          
          if (req.body.status === 'cancelled') {
            await calendarService.deleteViewingEvent(currentViewing.googleCalendarEventId);
          } else if (req.body.scheduledAt || req.body.duration) {
            await calendarService.updateViewingEvent(currentViewing.googleCalendarEventId, {
              scheduledAt: req.body.scheduledAt,
              duration: req.body.duration,
              status: req.body.status,
            });
          }
        } catch (calendarError: any) {
          console.error('Calendar event update failed (continuing anyway):', calendarError);
        }
      }

      const viewing = await storage.updateViewing(req.params.id, req.body);
      
      // Send WhatsApp notification if cancelled
      if (req.body.status === 'cancelled') {
        try {
          const lead = await storage.getLead(viewing.leadId);
          const property = await storage.getProperty(viewing.propertyId);
          
          if (lead && property) {
            const { sendWhatsAppMessage } = await import('./twilioService');
            const message = `Hi ${lead.name?.split(' ')[0] || 'there'}, your viewing for ${property.name} has been cancelled. If you'd like to reschedule, just let me know!`;
            if (lead.phone) {
              await sendWhatsAppMessage(lead.phone, message);
            }
          }
        } catch (whatsappError: any) {
          console.error('WhatsApp cancellation notification failed:', whatsappError);
        }
      }
      
      res.json(viewing);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Record viewing outcome (with lead stage update)
  app.patch('/api/viewings/:id/outcome', isAuthenticated, async (req, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { outcome, outcomeReason } = req.body;
      
      // SECURITY: Verify landlord owns the viewing before recording outcome
      const currentViewing = await storage.getViewing(req.params.id);
      if (!currentViewing) {
        return res.status(404).json({ message: 'Viewing not found' });
      }
      
      const property = await storage.getProperty(currentViewing.propertyId);
      if (!property || property.landlordId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized: You do not own this viewing' });
      }
      
      // Update viewing with outcome
      const viewing = await storage.updateViewing(req.params.id, {
        status: 'completed',
        outcome,
        outcomeReason,
      });

      // Update lead stage based on outcome
      const lead = await storage.getLead(viewing.leadId);
      if (lead) {
        let newStage = lead.stage;
        
        if (outcome === 'interested') {
          newStage = 'viewed_awaiting_application';
        } else if (outcome === 'not_interested') {
          // Could add a 'lost' stage or keep tracking as is
          newStage = 'new_enquiry'; // Keep for now, might add 'lost' stage later
        }
        // If needs_time, keep current stage for follow-up
        
        await storage.updateLeadStage(viewing.leadId, newStage);
      }

      res.json(viewing);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ============================================================================
  // TENANT APPLICATION MANAGEMENT
  // ============================================================================

  // Middleware to validate tenant access token
  const validateTenantToken = async (req: any, res: any, next: any) => {
    const token = req.headers['x-tenant-token'] || req.query.token;
    const leadId = req.params.id || req.params.leadId;

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const lead = await storage.getLead(leadId);
    if (!lead || lead.accessToken !== token) {
      return res.status(403).json({ message: "Invalid access token" });
    }

    req.lead = lead;
    next();
  };

  // Create or update application for a lead (requires tenant token)
  app.post('/api/leads/:id/application', validateTenantToken, async (req: any, res) => {
    try {
      const leadId = req.params.id;
      const lead = req.lead;

      // Check if application already exists
      const existingApplication = await storage.getApplicationByLead(leadId);

      // Prevent updating submitted applications (must go through submit endpoint)
      if (existingApplication && existingApplication.status === 'submitted') {
        return res.status(400).json({ message: "Cannot update submitted application" });
      }

      // Validate and sanitize request body - remove status/submittedAt if present
      const { status, submittedAt, paymentOption, ...validData } = req.body;
      const validatedData = insertTenantApplicationSchema.partial().parse({
        ...validData,
        leadId,
        propertyId: lead.propertyId,
        roomId: lead.roomId,
      });

      let application;
      if (existingApplication) {
        // Update existing draft application
        application = await storage.updateApplication(existingApplication.id, validatedData);
      } else {
        // Create new draft application
        application = await storage.createApplication({
          ...validatedData,
          leadId,
          propertyId: lead.propertyId!,
          roomId: lead.roomId!,
          status: "draft",
        });
      }

      // Also update lead with application details for contract generation
      await storage.updateLead(leadId, {
        universityName: validatedData.institution,
        courseName: validatedData.course,
        paymentOption: paymentOption || "instalments",
        needsGuarantor: paymentOption === "instalments",
        guarantorName: validatedData.guarantorName,
        guarantorEmail: validatedData.guarantorEmail,
        guarantorPhone: validatedData.guarantorPhone,
        guarantorAddress: validatedData.guarantorAddress,
      });

      res.json(application);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get application by ID
  app.get('/api/applications/:id', async (req, res) => {
    try {
      const application = await applicationService.getApplicationWithDocuments(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get application by lead ID
  app.get('/api/leads/:leadId/application', async (req, res) => {
    try {
      const application = await applicationService.getApplicationByLeadWithDocuments(req.params.leadId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Middleware to validate tenant token for application routes
  const validateApplicationToken = async (req: any, res: any, next: any) => {
    const token = req.headers['x-tenant-token'] || req.query.token;
    const applicationId = req.params.id;

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const application = await storage.getApplication(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const lead = await storage.getLead(application.leadId);
    if (!lead || lead.accessToken !== token) {
      return res.status(403).json({ message: "Invalid access token" });
    }

    req.application = application;
    req.lead = lead;
    next();
  };

  // Upload document for an application (requires tenant token)
  app.post('/api/applications/:id/documents', validateApplicationToken, upload.single('file'), async (req: any, res) => {
    try {
      const applicationId = req.params.id;
      const { documentType } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (!documentType) {
        return res.status(400).json({ message: "documentType is required" });
      }

      // Upload document
      const document = await applicationService.uploadApplicationDocument(
        applicationId,
        {
          buffer: req.file.buffer,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
        documentType
      );

      res.json(document);
    } catch (error: any) {
      safeError('Error uploading document', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Submit application (finalize and progress lead) (requires tenant token)
  app.post('/api/applications/:id/submit', validateApplicationToken, async (req: any, res) => {
    try {
      const applicationId = req.params.id;
      const application = req.application;

      // Validate required documents are uploaded
      const documents = await storage.getApplicationDocuments(applicationId);
      const requiredDocTypes = ['photo_id', 'proof_of_enrollment', 'guarantor_letter'];
      const uploadedDocTypes = documents.map(d => d.documentType);
      const missingDocs = requiredDocTypes.filter(type => !uploadedDocTypes.includes(type));

      if (missingDocs.length > 0) {
        return res.status(400).json({ 
          message: `Missing required documents: ${missingDocs.join(', ')}` 
        });
      }

      // Submit application
      const submittedApplication = await applicationService.submitApplication(
        application.leadId,
        {
          ...application,
          status: "submitted",
        }
      );

      res.json(submittedApplication);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ============================================================================
  // CONTRACT GENERATION & SIGNING
  // ============================================================================

  // Get contract preview
  app.get('/api/leads/:leadId/contract/preview', async (req, res) => {
    try {
      const { leadId } = req.params;
      const lead = await storage.getLead(leadId);
      
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      if (!lead.roomId) {
        return res.status(400).json({ message: "No room assigned to this lead" });
      }

      const room = await storage.getRoom(lead.roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const property = await storage.getProperty(room.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const contractResult = await generateContract(lead, room, property);
      
      // Check if result is a Buffer (PDF) or string (HTML)
      if (Buffer.isBuffer(contractResult)) {
        // Send as PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="contract-${lead.id}.pdf"`);
        res.send(contractResult);
      } else {
        // Send as HTML (fallback)
        res.send(contractResult);
      }
    } catch (error: any) {
      safeError('Error generating contract', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Sign contract
  app.post('/api/leads/:leadId/contract/sign', async (req, res) => {
    try {
      const { leadId } = req.params;
      const lead = await storage.getLead(leadId);
      
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Calculate moveOutDate (52 weeks from moveInDate) if moveInDate exists
      const updates: any = {
        stage: "contract_signed",
        contractSignedDate: new Date(),
      };

      if (lead.moveInDate && !lead.moveOutDate) {
        updates.moveOutDate = addWeeks(new Date(lead.moveInDate), 52);
      }

      // Update lead with contract signed status and moveOutDate
      const updatedLead = await storage.updateLead(leadId, updates);

      res.json(updatedLead);
    } catch (error: any) {
      console.error("Error signing contract:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // OBJECT STORAGE INTEGRATION
  // ============================================================================
  
  // Get upload URL for object storage
  app.post('/api/objects/upload', isAuthenticated, async (req, res) => {
    try {
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Set ACL policy for property images
  app.put('/api/property-images', isAuthenticated, async (req: any, res) => {
    try {
      const { imageURL } = req.body;
      if (!imageURL) {
        return res.status(400).json({ error: "imageURL is required" });
      }

      const user = await getAuthenticatedUser(req); const userId = user.id;
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        imageURL,
        {
          owner: userId,
          visibility: "public",
        }
      );

      res.status(200).json({ objectPath });
    } catch (error: any) {
      console.error("Error setting property image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve objects
  app.get('/objects/:objectPath(*)', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req); const userId = user.id;
      const { ObjectStorageService, ObjectNotFoundError } = await import("./objectStorage");
      const { ObjectPermission } = await import("./objectAcl");
      const objectStorageService = new ObjectStorageService();
      
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId,
        requestedPermission: ObjectPermission.READ,
      });
      
      if (!canAccess) {
        return res.sendStatus(401);
      }
      
      objectStorageService.downloadObject(objectFile, res);
    } catch (error: any) {
      console.error("Error checking object access:", error);
      if (error.name === "ObjectNotFoundError") {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Serve public objects
  app.get('/public-objects/:filePath(*)', async (req, res) => {
    try {
      const filePath = req.params.filePath;
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const file = await objectStorageService.searchPublicObject(filePath);
      
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      
      objectStorageService.downloadObject(file, res);
    } catch (error: any) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============================================================================
  // CONTRACT TEMPLATES
  // ============================================================================

  // Configure multer for PDF uploads
  const contractUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'));
      }
    },
  });

  // PDF upload endpoint
  app.post('/api/upload', isAuthenticated, contractUpload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Import the file storage functions
      const { uploadToObjectStorage } = await import('./fileStorage');
      
      // Upload to object storage
      const fileUrl = await uploadToObjectStorage(req.file);
      
      res.json({ url: fileUrl });
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      res.status(500).json({ error: error.message || 'Upload failed' });
    }
  });

  // Create contract template
  app.post('/api/landlord/contract-templates', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { name, fileUrl } = req.body;

      if (!name || !fileUrl) {
        return res.status(400).json({ message: "Name and file URL are required" });
      }

      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();

      // Set ACL for the uploaded file
      const normalizedPath = await objectStorageService.trySetObjectEntityAclPolicy(
        fileUrl,
        {
          owner: user.id,
          visibility: "private",
        }
      );

      const template = await storage.createContractTemplate({
        landlordId: user.id,
        name,
        fileUrl: normalizedPath,
      });

      res.json(template);
    } catch (error: any) {
      console.error("Error creating contract template:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get all contract templates for landlord
  app.get('/api/landlord/contract-templates', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const templates = await storage.getContractTemplatesByLandlord(user.id);
      res.json(templates);
    } catch (error: any) {
      console.error("Error fetching contract templates:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get single contract template
  app.get('/api/landlord/contract-templates/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { id } = req.params;
      
      const template = await storage.getContractTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      if (template.landlordId !== user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      res.json(template);
    } catch (error: any) {
      console.error("Error fetching contract template:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Update contract template
  app.put('/api/landlord/contract-templates/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { id } = req.params;
      const { name, fields, isDefault } = req.body;

      // Verify ownership
      const template = await storage.getContractTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      if (template.landlordId !== user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // If setting as default, unset other defaults
      if (isDefault) {
        const allTemplates = await storage.getContractTemplatesByLandlord(user.id);
        for (const t of allTemplates) {
          if (t.id !== id && t.isDefault) {
            await storage.updateContractTemplate(t.id, { isDefault: false });
          }
        }
      }

      const updatedTemplate = await storage.updateContractTemplate(id, {
        name,
        fields,
        isDefault,
      });

      res.json(updatedTemplate);
    } catch (error: any) {
      console.error("Error updating contract template:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Delete contract template
  app.delete('/api/landlord/contract-templates/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { id } = req.params;

      // Verify ownership
      const template = await storage.getContractTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      if (template.landlordId !== user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deleteContractTemplate(id);
      res.json({ message: "Template deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting contract template:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Upload property media (direct file upload)
  app.post('/api/properties/:id/upload-media', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { id } = req.params;
      const { mediaType, fileUrl } = req.body; // mediaType: 'hero' | 'floorPlan' | 'gallery'

      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (property.landlordId !== user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();

      const normalizedPath = await objectStorageService.trySetObjectEntityAclPolicy(
        fileUrl,
        {
          owner: user.id,
          visibility: "public",
        }
      );

      const updates: any = {};
      if (mediaType === 'hero') {
        updates.heroImageUrl = normalizedPath;
      } else if (mediaType === 'floorPlan') {
        updates.floorPlanUrl = normalizedPath;
      } else if (mediaType === 'gallery') {
        const currentImages = property.imageUrls || [];
        updates.imageUrls = [...currentImages, normalizedPath];
      }

      const updatedProperty = await storage.updateProperty(id, updates);
      res.json(updatedProperty);
    } catch (error: any) {
      console.error("Error uploading property media:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Upload room media (direct file upload)
  app.post('/api/rooms/:id/upload-media', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { id } = req.params;
      const { mediaType, fileUrl } = req.body; // mediaType: 'image' | 'video'

      const room = await storage.getRoom(id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const property = await storage.getProperty(room.propertyId);
      if (!property || property.landlordId !== user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();

      const normalizedPath = await objectStorageService.trySetObjectEntityAclPolicy(
        fileUrl,
        {
          owner: user.id,
          visibility: "public",
        }
      );

      const updates: any = {};
      if (mediaType === 'image') {
        const currentImages = room.imageUrls || [];
        updates.imageUrls = [...currentImages, normalizedPath];
      } else if (mediaType === 'video') {
        const currentVideos = room.videoUrls || [];
        updates.videoUrls = [...currentVideos, normalizedPath];
      }

      const updatedRoom = await storage.updateRoom(id, updates);
      res.json(updatedRoom);
    } catch (error: any) {
      console.error("Error uploading room media:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // STRIPE PAYMENT (Deposit Collection)
  // ============================================================================

  // Create payment intent for deposit
  app.post('/api/create-deposit-payment', async (req, res) => {
    try {
      const { amount, leadId, propertyId, roomId } = req.body;
      
      // Create Stripe payment intent
      if (!stripe) throw new Error('Stripe not configured');
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to pence
        currency: "gbp",
        metadata: {
          leadId,
          propertyId,
          roomId,
          type: 'deposit',
        },
      });

      // Create deposit record
      const deposit = await storage.createDeposit({
        leadId,
        propertyId,
        roomId,
        amount: Math.round(amount * 100), // Store in pence
        status: 'pending',
        stripePaymentIntentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret!,
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        depositId: deposit.id,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe webhook for payment confirmation with idempotent processing
  // Note: This endpoint requires raw body parsing for signature validation
  app.post(
    '/api/webhooks/stripe',
    express.raw({ type: 'application/json' }),
    createIdempotentWebhookHandler({
      provider: 'stripe',
      getEventId: (req) => req.stripeEvent?.id,
      getEventType: (req) => req.stripeEvent?.type || 'unknown',
      verifySignature: async (req) => {
        const sig = req.headers['stripe-signature'] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        
        if (!webhookSecret) {
          console.warn('⚠️  STRIPE_WEBHOOK_SECRET not set - skipping signature verification');
          return true; // In dev, allow without signature
        }
        
        if (!stripe) {
          console.error('Stripe not initialized - missing STRIPE_SECRET_KEY');
          return false;
        }
        
        try {
          // Stripe.constructEvent verifies the signature and parses the event
          const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webhookSecret
          );
          
          // Attach parsed event to req for handler to use
          req.stripeEvent = event;
          
          return true;
        } catch (err: any) {
          console.error('Stripe signature verification failed:', err.message);
          return false;
        }
      }
    }, storage),
    async (req, res) => {
    try {
      const event = req.stripeEvent;
      const webhookEvent = req.webhookEvent;

      // TRIAL BILLING FIX (Bug #7): Verified trial implementation
      // This handler processes card verification WITHOUT charging the customer
      // The subscription is created with trial_period_days in checkout session creation
      // Stripe automatically handles trial_end and will NOT charge until trial expires
      
      // Handle setup_intent.succeeded (card verification complete - NOW start trial)
      if (event.type === 'setup_intent.succeeded') {
        const setupIntent = event.data.object;
        
        // Find subscription by customer (may be incomplete or trialing)
        if (!stripe) throw new Error('Stripe not configured');
        const subscriptions = await stripe.subscriptions.list({
          customer: setupIntent.customer as string,
          limit: 1,
        });

        const subscription = subscriptions.data[0];
        if (subscription) {
          const { landlordId, sessionId, planName } = subscription.metadata;

          if (landlordId && sessionId) {
            try {
              // Get user details
              const user = await db.query.users.findFirst({
                where: eq(users.id, landlordId),
              });

              if (user) {
                // IMPORTANT: Setting status to 'trialing' does NOT charge the card
                // Stripe will automatically charge when trial_end is reached
                // The card is only verified here with SetupIntent, no payment made
                const now = new Date();
                await db.update(users)
                  .set({
                    subscriptionStatus: 'trialing',
                    subscriptionPlan: subscription.metadata.plan || user.subscriptionPlan,
                    subscriptionStartDate: now,
                    subscriptionInterval: 'monthly',
                  })
                  .where(eq(users.id, landlordId));

                // Update onboarding session
                await storage.updateOnboardingSession(sessionId, {
                  paymentStatus: 'trialing',
                  completedAt: new Date(),
                });

                console.log(`✅ Card verified for user ${user.email}. Trial started. Subscription: ${subscription.id}`);
              }
            } catch (error: any) {
              console.error('Error in setup_intent.succeeded:', error);
            }
          }
        }
      }

      // Handle customer.subscription.updated (status changed to trialing - send welcome email)
      if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object;
        const previousAttributes = event.data.previous_attributes;

        // MONITORING: Log trial-to-active conversion
        if (subscription.status === 'active' && previousAttributes?.status === 'trialing') {
          const { landlordId } = subscription.metadata;
          const trialEndDate = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;
          const actualChargeDate = new Date();
          
          console.log('🔄 [TRIAL CONVERSION] Subscription transitioned from trialing to active', {
            landlordId,
            stripeCustomerId: subscription.customer,
            subscriptionId: subscription.id,
            trialEndDate: trialEndDate?.toISOString(),
            actualChargeDate: actualChargeDate.toISOString(),
            planId: subscription.items.data[0]?.price?.id,
            amount: subscription.items.data[0]?.price?.unit_amount ? (subscription.items.data[0].price.unit_amount / 100) : 0,
            status: subscription.status,
            eventTimestamp: new Date(event.created * 1000).toISOString(),
          });
        }

        // Check if subscription just transitioned to trialing (from incomplete)
        if (subscription.status === 'trialing' && previousAttributes?.status === 'incomplete') {
          const { landlordId, sessionId, planName } = subscription.metadata;

          if (landlordId && sessionId && planName) {
            try {
              // Get user details
              const user = await db.query.users.findFirst({
                where: eq(users.id, landlordId),
              });

              if (user) {
                // Get payment method details (now available after card verification)
                const paymentMethod = subscription.default_payment_method 
                  ? (stripe ? await stripe.paymentMethods.retrieve(subscription.default_payment_method as string) : null)
                  : null;
                const cardLast4 = paymentMethod?.card?.last4 || null;

                // Calculate first charge date (day 15 = trial end + 1 day)
                const trialEnd = new Date(subscription.trial_end! * 1000);
                const firstChargeDate = new Date(trialEnd);
                firstChargeDate.setDate(firstChargeDate.getDate() + 1);

                console.log('🎉 [TRIAL START] Trial subscription activated', {
                  landlordId,
                  stripeCustomerId: subscription.customer,
                  subscriptionId: subscription.id,
                  planName,
                  trialEndDate: trialEnd.toISOString(),
                  firstChargeDate: firstChargeDate.toISOString(),
                  cardLast4,
                });

                // Send welcome email with trial and invoice details
                const { emailService } = await import('./emailService');
                const { generateOnboardingWelcomeWithInvoiceEmail } = await import('./emailTemplates');
                
                const emailHtml = generateOnboardingWelcomeWithInvoiceEmail({
                  landlordName: `${user.firstName} ${user.lastName}`,
                  landlordEmail: user.email,
                  planName: planName,
                  monthlyAmount: subscription.items.data[0].price.unit_amount! / 100,
                  trialDays: 14,
                  firstChargeDate: firstChargeDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
                  cardLast4: cardLast4,
                });

                await emailService.sendEmail(
                  user.email!,
                  `Welcome to TermFlow! Your 14-Day Free Trial Starts Now`,
                  emailHtml
                );

                console.log(`✅ Trial active for user ${user.email}. Welcome email sent with card ${cardLast4}.`);
              }
            } catch (emailError: any) {
              console.error('Error sending welcome email:', emailError);
              metrics.recordTransactionFailure('stripe_trial_welcome_email', emailError.message);
            }
          }
        }
      }

      // Handle invoice.payment_succeeded (first payment after trial, or regular payments)
      if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object;
        if (!stripe) throw new Error('Stripe not configured');
        const subscription = invoice.subscription ? await stripe.subscriptions.retrieve(invoice.subscription as string) : null;
        
        if (subscription) {
          const { landlordId } = subscription.metadata;

          if (landlordId) {
            try {
              // MONITORING: Log successful payment with detailed context
              console.log('💳 [PAYMENT SUCCESS] Invoice payment succeeded', {
                landlordId,
                stripeCustomerId: subscription.customer,
                subscriptionId: subscription.id,
                invoiceId: invoice.id,
                amountPaid: invoice.amount_paid / 100,
                billingReason: invoice.billing_reason,
                periodStart: new Date(invoice.period_start * 1000).toISOString(),
                periodEnd: new Date(invoice.period_end * 1000).toISOString(),
                paidAt: new Date(invoice.status_transitions?.paid_at || event.created * 1000).toISOString(),
                attemptCount: invoice.attempt_count,
              });

              // Update user subscription status
              await db.update(users)
                .set({
                  subscriptionStatus: 'active',
                })
                .where(eq(users.id, landlordId));

              console.log(`✅ Payment successful for user ${landlordId}. Subscription is now active.`);

              // If this is the first payment (after trial), send confirmation email
              if (invoice.billing_reason === 'subscription_cycle') {
                const user = await db.query.users.findFirst({
                  where: eq(users.id, landlordId),
                });

                if (user && user.email) {
                  const { emailService } = await import('./emailService');
                  
                  await emailService.sendEmail(
                    user.email,
                    `Payment Confirmed - Your TermFlow Subscription is Active`,
                    `
                      <p>Hi ${user.firstName},</p>
                      <p>Your payment of £${(invoice.amount_paid / 100).toFixed(2)} has been successfully processed.</p>
                      <p>Your TermFlow subscription is now active. You'll continue to be charged £${(invoice.amount_paid / 100).toFixed(2)} monthly.</p>
                      <p>Thank you for choosing TermFlow!</p>
                      <p>The TermFlow Team</p>
                    `
                  );

                  console.log(`✅ First payment confirmation email sent to ${user.email}`);
                }
              }
            } catch (paymentError: any) {
              console.error('Error handling invoice payment:', paymentError);
              metrics.recordTransactionFailure('stripe_invoice_payment_processing', paymentError.message);
            }
          }
        }
      }

      // Handle invoice.payment_failed (billing failure during trial-to-paid transition)
      if (event.type === 'invoice.payment_failed') {
        const invoice = event.data.object;
        if (!stripe) throw new Error('Stripe not configured');
        const subscription = invoice.subscription ? await stripe.subscriptions.retrieve(invoice.subscription as string) : null;
        
        if (subscription) {
          const { landlordId } = subscription.metadata;

          if (landlordId) {
            console.error('❌ [BILLING FAILURE] Invoice payment failed', {
              landlordId,
              stripeCustomerId: subscription.customer,
              subscriptionId: subscription.id,
              invoiceId: invoice.id,
              amountDue: invoice.amount_due / 100,
              billingReason: invoice.billing_reason,
              attemptCount: invoice.attempt_count,
              nextPaymentAttempt: invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000).toISOString() : null,
              failedAt: new Date().toISOString(),
              lastPaymentError: invoice.last_payment_error?.message || 'Unknown error',
              wasTrialing: subscription.status === 'past_due' || invoice.billing_reason === 'subscription_cycle',
            });

            metrics.recordTransactionFailure('stripe_billing_failure', invoice.last_payment_error?.message || 'Payment failed');

            try {
              const user = await db.query.users.findFirst({
                where: eq(users.id, landlordId),
              });

              if (user && user.email) {
                await db.update(users)
                  .set({
                    subscriptionStatus: 'past_due',
                  })
                  .where(eq(users.id, landlordId));

                const { emailService } = await import('./emailService');
                await emailService.sendEmail(
                  user.email,
                  `Payment Failed - Action Required for Your TermFlow Subscription`,
                  `
                    <p>Hi ${user.firstName},</p>
                    <p>We were unable to process your payment of £${(invoice.amount_due / 100).toFixed(2)}.</p>
                    <p>Please update your payment method to continue using TermFlow.</p>
                    <p>If you have any questions, please contact our support team.</p>
                    <p>The TermFlow Team</p>
                  `
                );

                console.log(`⚠️ Payment failure notification sent to ${user.email}`);
              }
            } catch (notificationError: any) {
              console.error('Error sending payment failure notification:', notificationError);
              metrics.recordTransactionFailure('stripe_failure_notification', notificationError.message);
            }
          }
        }
      }

      // Handle payment_intent.succeeded event for deposits
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const { leadId } = paymentIntent.metadata;
        
        // Handle deposit payment (existing logic)
        if (leadId) {
          // Find and update deposit record
          const deposit = await storage.getDepositByLead(leadId);
          if (deposit && deposit.stripePaymentIntentId === paymentIntent.id) {
            await storage.updateDeposit(deposit.id, {
              status: 'paid',
              paidAt: new Date(),
            });

            // Get lead to calculate moveOutDate
            const lead = await storage.getLead(leadId);
            
            // Calculate moveOutDate if needed
            let moveOutDate = lead?.moveOutDate;
            if (lead && lead.moveInDate && !lead.moveOutDate) {
              moveOutDate = addWeeks(new Date(lead.moveInDate), 52);
            }
            
            // Trigger workflow automation: deposit paid → RTR checks
            const { workflowAutomation } = await import('./services/workflowAutomation');
            await workflowAutomation.handleDepositPaid(leadId, deposit.amount, paymentIntent.id);
            
            // Update moveOutDate if calculated
            if (moveOutDate) {
              await storage.updateLead(leadId, { moveOutDate });
            }
            
            // Track deposit paid milestone
            const { funnelTrackingService } = await import('./services/funnelTracking');
            await funnelTrackingService.trackDepositPaid(leadId, {
              amount: paymentIntent.amount / 100,
              paymentIntentId: paymentIntent.id,
            });
            
            // Send WhatsApp confirmation
            try {
              const { sendWhatsAppMessage } = await import('./twilioService');
              const lead = await storage.getLead(leadId);
              if (lead) {
                const message = `Hi ${lead.name?.split(' ')[0] || 'there'}! Your deposit payment of £${(deposit.amount / 100).toFixed(2)} has been confirmed. We'll be in touch shortly with your tenancy agreement.`;
                if (lead.phone) {
              await sendWhatsAppMessage(lead.phone, message);
            }
              }
            } catch (whatsappError: any) {
              console.error('WhatsApp deposit confirmation failed:', whatsappError);
            }
          }
        }
      }

      // Mark webhook as processed
      await markWebhookComplete(storage, webhookEvent.id);

      res.json({ received: true });
    } catch (error: any) {
      console.error('Stripe webhook error:', error);
      if (req.webhookEvent) {
        await markWebhookFailed(storage, req.webhookEvent.id, error.message);
      }
      res.status(400).json({ message: error.message });
    }
  });

  // ============================================================================
  // CONTRACT MANAGEMENT
  // ============================================================================

  // Create contract
  app.post('/api/contracts', isAuthenticated, async (req, res) => {
    try {
      const contractData = insertContractSchema.parse(req.body);
      const contract = await storage.createContract(contractData);
      
      // Update lead stage
      await storage.updateLeadStage(contractData.leadId, 'contracts_sent');
      
      res.json(contract);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update contract
  app.patch('/api/contracts/:id', isAuthenticated, async (req, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      
      // SECURITY: Verify landlord owns the contract before updating
      const contract = await storage.getContract(req.params.id);
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
      
      const lead = await storage.getLead(contract.leadId);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      if (!lead.propertyId) {
        return res.status(400).json({ message: 'Lead has no property assigned' });
      }
      const property = await storage.getProperty(lead.propertyId);
      if (!property || property.landlordId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized: You do not own this contract' });
      }
      
      const updatedContract = await storage.updateContract(req.params.id, req.body);
      res.json(updatedContract);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // RTR Sequence Endpoints
  // POST /api/contracts/:id/approve
  app.post('/api/contracts/:id/approve', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const contract = await storage.approveApplication(req.params.id, user.id);
      res.json(contract);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // POST /api/contracts/:id/right-to-rent
  app.post('/api/contracts/:id/right-to-rent', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const contract = await storage.getContract(req.params.id);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      if (contract.approvalStatus !== "approved") {
        return res.status(400).json({ message: "Application must be approved before RTR check" });
      }
      
      const { status, documentUrl } = req.body;
      
      if (!status || !["passed", "failed"].includes(status)) {
        return res.status(400).json({ message: "Status must be 'passed' or 'failed'" });
      }
      
      const updatedContract = await storage.updateRightToRentStatus(
        req.params.id,
        status,
        user.id,
        documentUrl
      );
      
      // Trigger workflow automation: RTR passed → create contract (if not already created)
      if (status === 'passed') {
        const { workflowAutomation } = await import('./services/workflowAutomation');
        await workflowAutomation.handleRtrPassed(contract.leadId, user.id);
      }
      
      res.json(updatedContract);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // POST /api/contracts/:id/charge-deposit
  app.post('/api/contracts/:id/charge-deposit', isAuthenticated, async (req: any, res) => {
    try {
      const contract = await storage.getContract(req.params.id);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      if (contract.rightToRentStatus !== "passed") {
        return res.status(400).json({ 
          message: "Legal Requirement: Right-to-Rent check must pass before charging deposit" 
        });
      }
      
      const { stripePaymentIntentId } = req.body;
      
      if (!stripePaymentIntentId) {
        return res.status(400).json({ message: "Stripe Payment Intent ID is required" });
      }
      
      const updatedContract = await storage.chargeDeposit(req.params.id, stripePaymentIntentId);
      res.json(updatedContract);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // POST /api/contracts/:id/tenant-sign
  app.post('/api/contracts/:id/tenant-sign', isAuthenticated, async (req: any, res) => {
    try {
      const contract = await storage.getContract(req.params.id);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      if (contract.depositChargeStatus !== "charged") {
        return res.status(400).json({ 
          message: "Contract cannot be signed until deposit is paid" 
        });
      }
      
      const updatedContract = await storage.recordTenantSignature(req.params.id);
      
      // Trigger workflow automation: student signed → notify landlord
      // Get landlordId through lead->property chain
      const lead = await storage.getLead(contract.leadId);
      if (lead?.propertyId) {
        const property = await storage.getProperty(lead.propertyId);
        if (property) {
          const { workflowAutomation } = await import('./services/workflowAutomation');
          await workflowAutomation.handleStudentSignature(req.params.id, property.landlordId);
        }
      }
      
      res.json(updatedContract);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // POST /api/contracts/:id/landlord-sign
  app.post('/api/contracts/:id/landlord-sign', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const contract = await storage.getContract(req.params.id);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      if (contract.tenantSignatureStatus !== "signed") {
        return res.status(400).json({ 
          message: "Landlord cannot sign until tenant has signed" 
        });
      }
      
      const updatedContract = await storage.recordLandlordSignature(req.params.id, user.id);
      
      // Trigger workflow automation: both parties signed → archive lead
      const { workflowAutomation } = await import('./services/workflowAutomation');
      await workflowAutomation.handleBothPartiesSigned(req.params.id);
      
      // Track contract signed milestone
      const { funnelTrackingService } = await import('./services/funnelTracking');
      await funnelTrackingService.trackContractSigned(contract.leadId, contract.id);
      
      res.json(updatedContract);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // GET /api/contracts/:id/sequence-status
  app.get('/api/contracts/:id/sequence-status', isAuthenticated, async (req: any, res) => {
    try {
      const sequenceStatus = await storage.getContractSequenceStatus(req.params.id);
      res.json(sequenceStatus);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // PATCH /api/contracts/:id/upload-document - Upload contract document
  app.patch('/api/contracts/:id/upload-document', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const contract = await storage.getContract(req.params.id);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      // Get the lead to check property ownership
      const lead = await storage.getLead(contract.leadId);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Get the property to verify landlord ownership
      const property = await storage.getProperty(lead.propertyId);
      if (!property || property.landlordId !== user.id) {
        return res.status(403).json({ message: "Unauthorized: You don't own this contract" });
      }

      // Validate request body
      const { contractUrl } = req.body;
      if (!contractUrl || typeof contractUrl !== 'string') {
        return res.status(400).json({ message: "contractUrl is required and must be a string" });
      }

      // Update the contract document
      const updatedContract = await storage.updateContractDocument(req.params.id, contractUrl);
      res.json(updatedContract);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ============================================================================
  // MOVE-IN COORDINATION
  // ============================================================================
  
  // Schedule move-in
  app.post('/api/move-in/schedule', isAuthenticated, async (req, res) => {
    try {
      const { leadId, moveInDate, keyCollectionMethod, keyCollectionDetails, keyCollectionTime } = req.body;
      
      const lead = await storage.getLead(leadId);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      const user = await getAuthenticatedUser(req);
      const property = lead.propertyId ? await storage.getProperty(lead.propertyId) : null;
      
      const { moveInService } = await import('./services/moveInService');
      const result = await moveInService.scheduleMoveIn({
        leadId,
        contractId: '', // Will be filled from contract
        tenantName: lead.name || 'Tenant',
        tenantEmail: lead.email || '',
        propertyAddress: property ? `${property.name}, ${property.address}` : 'Property',
        moveInDate: new Date(moveInDate),
        landlordId: user.id,
        propertyId: lead.propertyId,
        roomId: lead.roomId,
        keyCollectionMethod,
        keyCollectionDetails,
        keyCollectionTime,
      });
      
      res.json(result);
    } catch (error: any) {
      safeError('Error scheduling move-in', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get move-in details
  app.get('/api/move-in/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const moveIn = await storage.getMoveIn(id);
      
      if (!moveIn) {
        return res.status(404).json({ message: 'Move-in not found' });
      }
      
      res.json(moveIn);
    } catch (error: any) {
      safeError('Error fetching move-in details', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get move-in checklist
  app.get('/api/move-in/:id/checklist', async (req, res) => {
    try {
      const { id } = req.params;
      const moveIn = await storage.getMoveIn(id);
      
      if (!moveIn) {
        return res.status(404).json({ message: 'Move-in not found' });
      }
      
      const { moveInService } = await import('./services/moveInService');
      const checklist = await moveInService.generateChecklist(moveIn.leadId);
      
      res.json(checklist);
    } catch (error: any) {
      safeError('Error fetching checklist', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update checklist item
  app.post('/api/move-in/:id/checklist/:itemIndex', async (req, res) => {
    try {
      const { id, itemIndex } = req.params;
      const { completed } = req.body;
      
      const { moveInService } = await import('./services/moveInService');
      await moveInService.updateChecklistItem(id, parseInt(itemIndex), completed);
      
      res.json({ success: true });
    } catch (error: any) {
      safeError('Error updating checklist item', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get welcome pack
  app.get('/api/move-in/:id/welcome-pack', async (req, res) => {
    try {
      const { id } = req.params;
      const moveIn = await storage.getMoveIn(id);
      
      if (!moveIn) {
        return res.status(404).json({ message: 'Move-in not found' });
      }
      
      const { moveInService } = await import('./services/moveInService');
      const welcomePack = await moveInService.generateWelcomePack(moveIn.leadId);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="welcome-pack-${id}.pdf"`);
      res.send(welcomePack);
    } catch (error: any) {
      safeError('Error generating welcome pack', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Mark move-in as complete
  app.post('/api/move-in/:id/complete', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      
      const { moveInService } = await import('./services/moveInService');
      await moveInService.completeMoveIn(id);
      
      res.json({ success: true, message: 'Move-in marked as complete' });
    } catch (error: any) {
      safeError('Error completing move-in', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get upcoming move-ins for landlord
  app.get('/api/landlord/move-ins/upcoming', isAuthenticated, async (req, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const days = parseInt(req.query.days as string) || 30;
      
      const { moveInService } = await import('./services/moveInService');
      const moveIns = await moveInService.getUpcomingMoveIns(user.id, days);
      
      res.json(moveIns);
    } catch (error: any) {
      safeError('Error fetching upcoming move-ins', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // DEPOSIT PROTECTION (UK Housing Act 2004 Compliance)
  // ============================================================================

  // POST /api/contracts/:id/deposit-protection
  app.post('/api/contracts/:id/deposit-protection', isAuthenticated, async (req: any, res) => {
    try {
      const { scheme, certificateNumber, protectionDate } = req.body;
      
      if (!scheme || !certificateNumber) {
        return res.status(400).json({ 
          message: "Protection scheme and certificate number are required" 
        });
      }

      const validSchemes = ["DPS", "MyDeposits", "TDS"];
      if (!validSchemes.includes(scheme)) {
        return res.status(400).json({ 
          message: "Invalid scheme. Must be DPS, MyDeposits, or TDS" 
        });
      }

      const contract = await storage.getContract(req.params.id);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      if (contract.depositChargeStatus !== "charged") {
        return res.status(400).json({ 
          message: "Deposit must be taken before it can be protected" 
        });
      }

      const protectionDateObj = protectionDate ? new Date(protectionDate) : new Date();
      
      const updatedContract = await storage.markDepositProtected(
        req.params.id,
        scheme,
        certificateNumber,
        protectionDateObj
      );
      
      res.json(updatedContract);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // GET /api/contracts/:id/deposit-protection-status
  app.get('/api/contracts/:id/deposit-protection-status', isAuthenticated, async (req: any, res) => {
    try {
      const status = await storage.getDepositProtectionStatus(req.params.id);
      
      // Determine warning level
      let warningLevel = "safe";
      if (status.isOverdue) {
        warningLevel = "overdue";
      } else if (status.daysRemaining !== null) {
        if (status.daysRemaining <= 2) {
          warningLevel = "critical";
        } else if (status.daysRemaining <= 7) {
          warningLevel = "urgent";
        } else if (status.daysRemaining <= 14) {
          warningLevel = "warning";
        }
      }
      
      res.json({ ...status, warningLevel });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // GET /api/deposit-protection/overdue
  app.get('/api/deposit-protection/overdue', isAuthenticated, async (req: any, res) => {
    try {
      const overdueContracts = await storage.getOverdueDepositProtections();
      res.json(overdueContracts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/deposit-protection/check-overdue
  // This can be called by a daily cron job to mark overdue contracts
  app.post('/api/deposit-protection/check-overdue', isAuthenticated, async (req, res) => {
    try {
      const now = new Date();
      
      const overdueContracts = await db
        .update(contracts)
        .set({
          depositProtectionStatus: 'overdue'
        })
        .where(
          and(
            eq(contracts.depositChargeStatus, 'charged'),
            eq(contracts.depositProtectionStatus, 'not_protected'),
            isNotNull(contracts.depositProtectionDeadline),
            lt(contracts.depositProtectionDeadline, now)
          )
        )
        .returning();
      
      res.json({
        success: true,
        contractsMarkedOverdue: overdueContracts.length,
        contracts: overdueContracts.map(c => ({
          id: c.id,
          deadline: c.depositProtectionDeadline
        }))
      });
    } catch (error) {
      console.error('Error checking overdue deposits:', error);
      res.status(500).json({ error: 'Failed to check overdue deposits' });
    }
  });

  // POST /api/deposit-protection/send-reminders
  // This can be called by a daily cron job to send reminder emails
  app.post('/api/deposit-protection/send-reminders', isAuthenticated, async (req, res) => {
    try {
      const { sendDepositProtectionReminders } = await import('./depositProtectionReminders');
      const result = await sendDepositProtectionReminders(storage);
      
      res.json({
        success: true,
        emailsSent: result.emailsSent,
        contractsProcessed: result.contractsProcessed
      });
    } catch (error) {
      console.error('Error sending deposit protection reminders:', error);
      res.status(500).json({ error: 'Failed to send reminders' });
    }
  });

  // GET /api/system/email-status
  app.get("/api/system/email-status", isAuthenticated, async (req, res) => {
    const { emailService } = await import('./emailService');
    res.json({
      configured: emailService.isConfigured(),
      message: emailService.isConfigured() 
        ? 'Email service is ready' 
        : 'Email service not configured. Set SMTP environment variables.'
    });
  });

  // ============================================================================
  // NEW DEPOSIT PROTECTION SYSTEM (UK Housing Act 2004)
  // ============================================================================

  // GET /api/deposits/tds-status - Check TDS API configuration status
  app.get('/api/deposits/tds-status', isAuthenticated, async (req: any, res) => {
    try {
      const { depositProtectionService } = await import('./services/depositProtectionService');
      const status = depositProtectionService.getTDSConfigStatus();
      
      res.json(status);
    } catch (error: any) {
      console.error('Error checking TDS status:', error);
      res.status(500).json({ 
        error: 'Failed to check TDS configuration',
        message: error.message 
      });
    }
  });

  // POST /api/deposits/protect - Register a deposit with protection scheme
  app.post('/api/deposits/protect', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { leadId, amount, scheme, tenancyStartDate, tenancyEndDate } = req.body;
      
      // Validate input
      if (!leadId || !amount || !scheme) {
        return res.status(400).json({ 
          message: "leadId, amount, and scheme are required" 
        });
      }
      
      const validSchemes = ["TDS", "DPS", "MyDeposits"];
      if (!validSchemes.includes(scheme)) {
        return res.status(400).json({ 
          message: "Invalid scheme. Must be TDS, DPS, or MyDeposits" 
        });
      }
      
      // Get lead details
      const lead = await storage.getLead(leadId);
      if (!lead || lead.landlordId !== user.id) {
        return res.status(404).json({ message: "Lead not found or unauthorized" });
      }
      
      // Get property details
      const property = lead.propertyId ? await storage.getProperty(lead.propertyId) : null;
      if (!property) {
        return res.status(400).json({ message: "Property not found for lead" });
      }
      
      // Register deposit protection
      const { depositProtectionService } = await import('./services/depositProtectionService');
      const protection = await depositProtectionService.registerDeposit({
        leadId,
        amount: parseFloat(amount),
        tenantName: lead.name || 'Tenant',
        tenantEmail: lead.email || '',
        propertyAddress: `${property.name}, ${property.address}`,
        tenancyStartDate: new Date(tenancyStartDate || Date.now()),
        tenancyEndDate: new Date(tenancyEndDate || Date.now() + 365 * 24 * 60 * 60 * 1000),
        scheme,
        landlordId: user.id,
      });
      
      res.json({
        success: true,
        registrationId: protection.registrationId,
        certificateUrl: protection.certificateUrl,
        prescribedInfoUrl: protection.prescribedInfoUrl,
        certificateNumber: protection.certificateNumber,
      });
    } catch (error: any) {
      console.error('Error registering deposit protection:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // GET /api/deposits/:id/certificate - Download deposit protection certificate
  app.get('/api/deposits/:id/certificate', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const protection = await storage.getDepositProtection(req.params.id);
      
      if (!protection || protection.landlordId !== user.id) {
        return res.status(404).json({ message: "Deposit protection not found" });
      }
      
      // Generate certificate PDF
      const { depositProtectionService } = await import('./services/depositProtectionService');
      const certificatePdf = await depositProtectionService.generateCertificate(protection);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="certificate-${protection.certificateNumber}.pdf"`);
      res.send(certificatePdf);
    } catch (error: any) {
      console.error('Error generating certificate:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // GET /api/deposits/:id/prescribed-info - Download prescribed information
  app.get('/api/deposits/:id/prescribed-info', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const protection = await storage.getDepositProtection(req.params.id);
      
      if (!protection || protection.landlordId !== user.id) {
        return res.status(404).json({ message: "Deposit protection not found" });
      }
      
      // Generate prescribed info PDF
      const { depositProtectionService } = await import('./services/depositProtectionService');
      const prescribedInfoPdf = await depositProtectionService.generatePrescribedInfo(protection);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="prescribed-info-${protection.certificateNumber}.pdf"`);
      res.send(prescribedInfoPdf);
    } catch (error: any) {
      console.error('Error generating prescribed info:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // GET /api/landlord/deposits/unprotected - List unregistered deposits
  app.get('/api/landlord/deposits/unprotected', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const protections = await storage.getDepositProtectionsByLandlord(user.id);
      
      // Filter for unprotected/pending deposits
      const unprotected = protections.filter(p => p.status !== 'registered');
      
      // Add days remaining calculation
      const now = new Date();
      const protectionsWithDeadline = unprotected.map(p => ({
        ...p,
        daysRemaining: Math.floor((p.protectionDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        isOverdue: p.protectionDeadline < now,
      }));
      
      res.json(protectionsWithDeadline);
    } catch (error: any) {
      console.error('Error fetching unprotected deposits:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // POST /api/deposits/:id/resend-docs - Resend protection documents
  app.post('/api/deposits/:id/resend-docs', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const protection = await storage.getDepositProtection(req.params.id);
      
      if (!protection || protection.landlordId !== user.id) {
        return res.status(404).json({ message: "Deposit protection not found" });
      }
      
      // Resend emails with documents
      const emailHtml = `
        <h2>Deposit Protection Documents</h2>
        <p>Your deposit protection documents are attached to this email.</p>
        <ul>
          <li>Certificate Number: ${protection.certificateNumber}</li>
          <li>Protection Scheme: ${protection.scheme}</li>
          <li>Amount Protected: £${protection.amount}</li>
        </ul>
        <p>Please keep these documents safe for your records.</p>
      `;
      
      await emailService.sendEmail(
        protection.tenantEmail,
        `Deposit Protection Documents - ${protection.certificateNumber}`,
        emailHtml
      );
      
      res.json({ success: true, message: 'Documents resent successfully' });
    } catch (error: any) {
      console.error('Error resending documents:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // GET /api/deposits/status/:leadId - Check deposit protection status by lead
  app.get('/api/deposits/status/:leadId', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const protection = await storage.getDepositProtectionByLead(req.params.leadId);
      
      if (!protection) {
        return res.json({ protected: false });
      }
      
      if (protection.landlordId !== user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const now = new Date();
      const daysRemaining = Math.floor(
        (protection.protectionDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      res.json({
        protected: protection.status === 'registered',
        status: protection.status,
        certificateNumber: protection.certificateNumber,
        scheme: protection.scheme,
        registrationId: protection.registrationId,
        daysRemaining: protection.status === 'pending' ? daysRemaining : null,
        isOverdue: protection.status === 'pending' && daysRemaining < 0,
        protectionDate: protection.registeredAt,
      });
    } catch (error: any) {
      console.error('Error checking deposit status:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // ============================================================================
  // RIGHT TO RENT VERIFICATION (UK Legal Requirement)
  // ============================================================================

  // GET /api/rtr/check/:token - Get RTR check details by token (for tenant upload page)
  app.get('/api/rtr/check/:token', async (req, res) => {
    try {
      const { token } = req.params;
      
      // Find check by upload URL containing token
      const checks = await db
        .select()
        .from(rightToRentChecks)
        .where(sql`${rightToRentChecks.uploadUrl} LIKE ${'%' + token + '%'}`)
        .limit(1);
      
      if (checks.length === 0) {
        return res.status(404).json({ message: 'RTR check not found or link expired' });
      }
      
      const check = checks[0];
      
      // Check if expired
      if (check.uploadExpiresAt && check.uploadExpiresAt < new Date()) {
        return res.status(410).json({ message: 'RTR check link has expired' });
      }
      
      res.json({
        id: check.id,
        status: check.status,
        checkType: check.checkType,
        documents: check.documents || [],
        rejectionReason: check.rejectionReason,
      });
    } catch (error: any) {
      console.error('Error fetching RTR check:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/rtr/initiate - Initiate RTR check for a lead
  app.post('/api/rtr/initiate', isAuthenticated, async (req: any, res) => {
    try {
      const { leadId } = req.body;
      
      if (!leadId) {
        return res.status(400).json({ message: 'Lead ID required' });
      }
      
      const lead = await storage.getLead(leadId);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      const { rightToRentService } = await import('./services/rightToRentService');
      const rtrCheck = await rightToRentService.initiateCheck({
        id: lead.id,
        name: lead.name || 'Tenant',
        email: lead.email || '',
        nationality: undefined, // leads don't have nationality field
      });
      
      res.json(rtrCheck);
    } catch (error: any) {
      console.error('Error initiating RTR check:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/rtr/upload - Upload RTR documents
  app.post('/api/rtr/upload', 
    multer({ 
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
    }).single('document'),
    async (req: any, res) => {
      try {
        const { checkId, type } = req.body;
        const file = req.file;
        
        if (!file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }
        
        if (!checkId) {
          return res.status(400).json({ message: 'Check ID required' });
        }
        
        // Upload to object storage using signed URL approach
        const { objectStorageClient } = await import('./objectStorage');
        const fileName = `rtr-documents/${checkId}/${Date.now()}-${file.originalname}`;
        const bucketName = process.env.OBJECT_STORAGE_BUCKET || 'repl-default-bucket';
        
        // Upload the file to object storage
        const bucket = objectStorageClient.bucket(bucketName);
        const fileObj = bucket.file(fileName);
        await fileObj.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
        });
        
        // Get public URL for the file
        const fileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        
        res.json({
          document: {
            type: type || 'document',
            name: file.originalname,
            url: fileUrl,
          }
        });
      } catch (error: any) {
        console.error('Error uploading RTR document:', error);
        res.status(500).json({ message: error.message });
      }
    }
  );

  // POST /api/rtr/:checkId/submit-documents - Submit documents for review
  app.post('/api/rtr/:checkId/submit-documents', async (req, res) => {
    try {
      const { checkId } = req.params;
      const { documents } = req.body;
      
      if (!documents || !Array.isArray(documents) || documents.length === 0) {
        return res.status(400).json({ message: 'Documents required' });
      }
      
      const { rightToRentService } = await import('./services/rightToRentService');
      const result = await rightToRentService.processDocuments(checkId, documents);
      
      res.json(result);
    } catch (error: any) {
      console.error('Error submitting RTR documents:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/rtr/:checkId/verify-share-code - Verify Home Office share code
  app.post('/api/rtr/:checkId/verify-share-code', async (req, res) => {
    try {
      const { checkId } = req.params;
      const { shareCode, dateOfBirth } = req.body;
      
      if (!shareCode || !dateOfBirth) {
        return res.status(400).json({ message: 'Share code and date of birth required' });
      }
      
      const { rightToRentService } = await import('./services/rightToRentService');
      const result = await rightToRentService.verifyShareCode(checkId, shareCode, dateOfBirth);
      
      res.json(result);
    } catch (error: any) {
      console.error('Error verifying share code:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // GET /api/landlord/rtr/pending - Get RTR checks awaiting review
  app.get('/api/landlord/rtr/pending', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { rightToRentService } = await import('./services/rightToRentService');
      const checks = await rightToRentService.getChecksForReview(user.id);
      
      // Enrich with lead details
      const enrichedChecks = await Promise.all(
        checks.map(async (check) => {
          const lead = await storage.getLead(check.leadId);
          return {
            ...check,
            leadName: lead?.name,
            leadEmail: lead?.email,
            propertyId: lead?.propertyId,
            roomId: lead?.roomId,
          };
        })
      );
      
      res.json(enrichedChecks);
    } catch (error: any) {
      console.error('Error fetching pending RTR checks:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/landlord/rtr/:checkId/review - Approve/reject RTR check
  app.post('/api/landlord/rtr/:checkId/review', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { checkId } = req.params;
      const { approved, notes, expiryDate } = req.body;
      
      if (typeof approved !== 'boolean') {
        return res.status(400).json({ message: 'Approval decision required' });
      }
      
      const { rightToRentService } = await import('./services/rightToRentService');
      await rightToRentService.reviewCheck(
        checkId,
        approved,
        user.id,
        notes,
        expiryDate ? new Date(expiryDate) : undefined
      );
      
      res.json({ 
        success: true, 
        message: approved ? 'RTR check approved' : 'RTR check rejected' 
      });
    } catch (error: any) {
      console.error('Error reviewing RTR check:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // GET /api/rtr/expiring - Get RTR checks expiring soon
  app.get('/api/rtr/expiring', isAuthenticated, async (req, res) => {
    try {
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const expiringChecks = await storage.getRightToRentChecksExpiringSoon(thirtyDaysFromNow);
      
      res.json(expiringChecks);
    } catch (error: any) {
      console.error('Error fetching expiring RTR checks:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/rtr/check-expiring - Check and notify about expiring RTR permissions
  app.post('/api/rtr/check-expiring', isAuthenticated, async (req, res) => {
    try {
      const { rightToRentService } = await import('./services/rightToRentService');
      await rightToRentService.checkExpiringPermissions();
      
      res.json({ success: true, message: 'Expiry checks completed' });
    } catch (error: any) {
      console.error('Error checking expiring permissions:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // FOLLOW-UPS (Automated WhatsApp Re-engagement)
  // ============================================================================

  // Get dormant leads needing follow-up
  app.get('/api/follow-ups/dormant', isAuthenticated, async (req: any, res) => {
    try {
      const { followUpService } = await import('./followUpService');
      const propertyId = req.query.propertyId as string | undefined;
      const dormantLeads = await followUpService.getDormantLeads(propertyId);
      res.json(dormantLeads);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Trigger follow-up for specific lead
  app.post('/api/follow-ups/:leadId', isAuthenticated, async (req, res) => {
    try {
      const { followUpService } = await import('./followUpService');
      await followUpService.sendFollowUp(req.params.leadId);
      res.json({ success: true, message: 'Follow-up sent successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get follow-up history for a lead
  app.get('/api/follow-ups/:leadId', isAuthenticated, async (req, res) => {
    try {
      const followUps = await storage.getFollowUpsByLead(req.params.leadId);
      res.json(followUps);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // ANALYTICS & DASHBOARD
  // ============================================================================

  // Get dashboard metrics
  app.get('/api/dashboard/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req); const landlordId = user.id;
      const properties = await storage.getPropertiesByLandlord(landlordId);
      const propertyIds = properties.map(p => p.id);
      
      const allLeads = await Promise.all(
        properties.map(p => storage.getLeadsByProperty(p.id))
      );
      
      const leadsData = allLeads.flat();
      const leadIds = leadsData.map(l => l.id);
      
      // Calculate leads needing attention (automation exceptions)
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const needsAttention = leadsData.filter(lead => {
        const updatedAt = lead.updatedAt ? new Date(lead.updatedAt) : new Date(lead.createdAt);
        
        // Contract sent but not signed after 3 days
        if (lead.stage === 'contract_sent' && updatedAt < threeDaysAgo) return true;
        
        // Viewing booked but not attended after 1 day past viewing time
        if (lead.stage === 'viewing_booked' && updatedAt < oneDayAgo) return true;
        
        // Application submitted but not progressed after 3 days
        if (lead.stage === 'application_submitted' && updatedAt < threeDaysAgo) return true;
        
        // Viewed but no application after 7 days
        if (lead.stage === 'viewed_awaiting_application' && updatedAt < sevenDaysAgo) return true;
        
        return false;
      });

      // Get all signed contracts for revenue calculation
      const { eq, inArray } = await import('drizzle-orm');
      let signedContracts = [];
      if (leadIds.length > 0) {
        signedContracts = await db
          .select()
          .from(contracts)
          .where(
            inArray(contracts.leadId, leadIds)
          );
      }
      
      // Calculate total revenue (weeklyRent × contractLengthWeeks)
      const revenueGenerated = signedContracts
        .filter(c => c.status === 'signed' || c.status === 'active')
        .reduce((sum, contract) => {
          const weeklyRent = parseFloat(contract.weeklyRent.toString());
          const weeks = contract.contractLengthWeeks;
          return sum + (weeklyRent * weeks);
        }, 0);

      // Calculate total income secured (sum of all signed contracts: rent roll + deposits)
      const totalIncomeSecured = signedContracts
        .filter(c => c.status === 'signed')
        .reduce((sum, c) => {
          const rentRoll = parseFloat(c.weeklyRent.toString()) * c.contractLengthWeeks;
          const deposit = parseFloat(c.depositAmount.toString());
          return sum + rentRoll + deposit;
        }, 0);

      // Get all completed viewings for success rate calculation
      let completedViewings = [];
      if (propertyIds.length > 0) {
        completedViewings = await db
          .select()
          .from(viewings)
          .where(inArray(viewings.propertyId, propertyIds));
      }
      
      const completedViewingsCount = completedViewings.filter(v => v.status === 'completed').length;
      
      // Fixed: Use correct stage name 'contract_signed'
      const contractsSignedCount = leadsData.filter(l => l.stage === 'contract_signed').length;

      const metrics = {
        totalLeads: leadsData.length,
        newEnquiries: leadsData.filter(l => l.stage === 'new_enquiry').length,
        viewingsBooked: leadsData.filter(l => l.stage === 'viewing_booked').length,
        contractsSigned: contractsSignedCount,
        totalDepositValue: leadsData
          .filter(l => l.depositPaid)
          .reduce((sum, l) => sum + parseFloat(l.depositAmount || '0'), 0),
        revenueGenerated: Math.round(revenueGenerated),
        totalIncomeSecured: Math.round(totalIncomeSecured * 100) / 100,
        conversionRate: leadsData.length > 0 
          ? (contractsSignedCount / leadsData.length * 100).toFixed(1)
          : '0.0',
        successRate: completedViewingsCount > 0
          ? (contractsSignedCount / completedViewingsCount * 100).toFixed(1)
          : '0.0',
        needsAttention: needsAttention.length,
      };

      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get pipeline data (for kanban visualization)
  app.get('/api/dashboard/pipeline', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req); const landlordId = user.id;
      const properties = await storage.getPropertiesByLandlord(landlordId);
      
      const allLeads = await Promise.all(
        properties.map(p => storage.getLeadsByProperty(p.id))
      );
      
      const leads = allLeads.flat();

      const stages = [
        'new_enquiry',
        'viewing_booked',
        'viewed_awaiting_application',
        'application_submitted',
        'deposit_paid',
        'contract_sent',
        'contract_signed',
        'moved_in',
      ];

      const pipeline = stages.map(stage => ({
        stage,
        count: leads.filter(l => l.stage === stage).length,
        leads: leads.filter(l => l.stage === stage),
      }));

      res.json(pipeline);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get property financial analytics
  app.get('/api/analytics/property-financials/:propertyId', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { propertyId } = req.params;
      
      // Get all properties or specific property
      let properties = await storage.getPropertiesByLandlord(landlordId);
      if (propertyId !== 'all') {
        properties = properties.filter(p => p.id === propertyId);
      }
      
      // For each property, calculate financial metrics
      const propertyFinancials = await Promise.all(properties.map(async (property) => {
        // Get rooms for this property
        const rooms = await storage.getRoomsByProperty(property.id);
        const totalRooms = rooms.length;
        
        // Get signed contracts for this property's rooms
        const allContracts = await storage.getContractsByLandlord(landlordId);
        const propertyContracts = allContracts.filter(contract => 
          contract.status === 'signed' && 
          rooms.some(room => room.id === contract.roomId)
        );
        
        const roomsLet = propertyContracts.length;
        
        // Calculate average weekly rent
        const totalWeeklyRent = propertyContracts.reduce((sum, c) => 
          sum + parseFloat(c.weeklyRent.toString()), 0
        );
        const avgWeeklyRent = roomsLet > 0 ? totalWeeklyRent / roomsLet : 0;
        
        // Calculate current rent roll (weekly rent × contract length for each contract)
        const rentRoll = propertyContracts.reduce((sum, c) => 
          sum + (parseFloat(c.weeklyRent.toString()) * c.contractLengthWeeks), 0
        );
        
        // Calculate total income secured (rent roll + deposits)
        const totalDeposits = propertyContracts.reduce((sum, c) => 
          sum + parseFloat(c.depositAmount.toString()), 0
        );
        const totalIncomeSecured = rentRoll + totalDeposits;
        
        return {
          propertyId: property.id,
          propertyName: property.name,
          totalRooms,
          roomsLet,
          occupancyRate: totalRooms > 0 ? Math.round((roomsLet / totalRooms) * 100) : 0,
          avgWeeklyRent: Math.round(avgWeeklyRent * 100) / 100,
          rentRoll: Math.round(rentRoll * 100) / 100,
          totalDeposits: Math.round(totalDeposits * 100) / 100,
          totalIncomeSecured: Math.round(totalIncomeSecured * 100) / 100,
        };
      }));
      
      res.json(propertyFinancials);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get booking pacing analytics with year-over-year comparison
  app.get('/api/analytics/booking-pacing/:propertyId', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { propertyId } = req.params;
      
      // Get all properties or specific property
      let properties = await storage.getPropertiesByLandlord(landlordId);
      if (propertyId !== 'all') {
        properties = properties.filter(p => p.id === propertyId);
      }
      
      // Get all rooms for the selected properties
      const allRooms = await Promise.all(
        properties.map(p => storage.getRoomsByProperty(p.id))
      );
      const rooms = allRooms.flat();
      const totalRooms = rooms.length;
      
      // Get all signed contracts for the landlord
      const allContracts = await storage.getContractsByLandlord(landlordId);
      const signedContracts = allContracts.filter(contract => 
        contract.status === 'signed' && 
        contract.signedAt &&
        rooms.some(room => room.id === contract.roomId)
      );
      
      // Current year and previous year
      const currentYear = new Date().getFullYear();
      const previousYear = currentYear - 1;
      
      // Helper function to get week number of year
      const getWeekOfYear = (date: Date): number => {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const diff = date.getTime() - startOfYear.getTime();
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        return Math.floor(diff / oneWeek) + 1;
      };
      
      // Helper function to get start of week
      const getStartOfWeek = (year: number, week: number): Date => {
        const jan1 = new Date(year, 0, 1);
        const daysToAdd = (week - 1) * 7;
        return new Date(jan1.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      };
      
      // Group contracts by week for current year
      const currentYearContracts = signedContracts.filter(c => {
        const signedDate = new Date(c.signedAt!);
        return signedDate.getFullYear() === currentYear;
      });
      
      // Group contracts by week for previous year
      const previousYearContracts = signedContracts.filter(c => {
        const signedDate = new Date(c.signedAt!);
        return signedDate.getFullYear() === previousYear;
      });
      
      // Create weekly data for current year
      const currentWeekData: Record<number, number> = {};
      currentYearContracts.forEach(contract => {
        const week = getWeekOfYear(new Date(contract.signedAt!));
        currentWeekData[week] = (currentWeekData[week] || 0) + 1;
      });
      
      // Create weekly data for previous year
      const previousWeekData: Record<number, number> = {};
      previousYearContracts.forEach(contract => {
        const week = getWeekOfYear(new Date(contract.signedAt!));
        previousWeekData[week] = (previousWeekData[week] || 0) + 1;
      });
      
      // Get current week to only show data up to now
      const currentWeek = getWeekOfYear(new Date());
      const maxWeek = 52;
      
      // Build cumulative data for current year
      let cumulativeCurrent = 0;
      const currentYearData = [];
      for (let week = 1; week <= maxWeek; week++) {
        if (week <= currentWeek) {
          const count = currentWeekData[week] || 0;
          cumulativeCurrent += count;
          currentYearData.push({
            period: `Week ${week}`,
            date: format(getStartOfWeek(currentYear, week), 'yyyy-MM-dd'),
            count,
            cumulative: cumulativeCurrent,
          });
        }
      }
      
      // Build cumulative data for previous year (same weeks as current year for comparison)
      let cumulativePrevious = 0;
      const previousYearData = [];
      for (let week = 1; week <= currentWeek; week++) {
        const count = previousWeekData[week] || 0;
        cumulativePrevious += count;
        previousYearData.push({
          period: `Week ${week}`,
          date: format(getStartOfWeek(previousYear, week), 'yyyy-MM-dd'),
          count,
          cumulative: cumulativePrevious,
        });
      }
      
      // Calculate benchmark pace (target: Sept 2026 = week 36 of 2026)
      // Assume target is to have all rooms booked by Sept 1, 2026
      const targetDate = new Date(2026, 8, 1); // Sept 1, 2026
      const weeksUntilTarget = differenceInWeeks(targetDate, new Date());
      const weeksFromYearStart = getWeekOfYear(targetDate);
      
      // Calculate required pace (linear progression to reach totalRooms by target week)
      const requiredPace = [];
      if (totalRooms > 0 && weeksFromYearStart > 0) {
        const weeklyTarget = totalRooms / weeksFromYearStart;
        for (let week = 1; week <= Math.min(currentWeek, weeksFromYearStart); week++) {
          requiredPace.push({
            period: `Week ${week}`,
            cumulative: Math.round(weeklyTarget * week),
          });
        }
      }
      
      // Determine status
      let status: 'ahead' | 'behind' | 'on_track' = 'on_track';
      if (requiredPace.length > 0 && currentYearData.length > 0) {
        const currentPace = currentYearData[currentYearData.length - 1].cumulative;
        const benchmarkPace = requiredPace[requiredPace.length - 1].cumulative;
        
        if (currentPace > benchmarkPace * 1.1) {
          status = 'ahead';
        } else if (currentPace < benchmarkPace * 0.9) {
          status = 'behind';
        }
      }
      
      res.json({
        currentYear: {
          year: currentYear,
          data: currentYearData,
        },
        previousYear: {
          year: previousYear,
          data: previousYearData,
        },
        benchmark: {
          targetDate: format(targetDate, 'yyyy-MM-dd'),
          totalRooms,
          requiredPace,
        },
        status,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Helper function to calculate student profile analytics
  async function calculateStudentProfileAnalytics(leads: any[], properties: any[]) {
    const total = leads.length;

    // University breakdown
    const universities: Record<string, number> = {};
    leads.forEach(lead => {
      if (lead.universityName) {
        universities[lead.universityName] = (universities[lead.universityName] || 0) + 1;
      }
    });

    // Year of study from tags
    const yearOfStudy = {
      'First Year': leads.filter(l => l.tags?.includes('first-year')).length,
      'Second Year': leads.filter(l => l.tags?.includes('second-year')).length,
      'Final Year': leads.filter(l => l.tags?.includes('final-year')).length,
      'Postgrad': leads.filter(l => l.tags?.includes('postgrad')).length,
    };

    // UK vs International
    const ukVsInternational = {
      'UK Students': leads.filter(l => l.tags?.includes('uk-student')).length,
      'International': leads.filter(l => l.tags?.includes('international')).length,
    };

    // Top courses
    const courses: Record<string, number> = {};
    leads.forEach(lead => {
      if (lead.courseName) {
        courses[lead.courseName] = (courses[lead.courseName] || 0) + 1;
      }
    });
    const topCourses = Object.entries(courses)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([course, count]) => ({ course, count }));

    // Move-in dates from moveInDate timestamp field
    const moveInDateCounts: Record<string, number> = {};
    leads.forEach(lead => {
      if (lead.moveInDate) {
        const dateStr = format(new Date(lead.moveInDate), 'MMMM yyyy');
        moveInDateCounts[dateStr] = (moveInDateCounts[dateStr] || 0) + 1;
      }
    });

    const moveInDates: Record<string, number> = {
      'September 2026': moveInDateCounts['September 2026'] || 0,
      'January 2027': moveInDateCounts['January 2027'] || 0,
      'Other': 0,
    };
    
    Object.entries(moveInDateCounts).forEach(([dateStr, count]) => {
      if (dateStr !== 'September 2026' && dateStr !== 'January 2027') {
        moveInDates['Other'] += count;
      }
    });

    // Budget ranges from notes
    const budgetRanges = {
      '<£150/week': 0,
      '£150-£200/week': 0,
      '£200-£250/week': 0,
      '>£250/week': 0,
    };
    leads.forEach(lead => {
      const notes = lead.notes?.toLowerCase() || '';
      const budgetMatch = notes.match(/£?(\d{2,3})(?:\s*(?:per week|\/week|pw|weekly|a week))/i);
      if (budgetMatch) {
        const budget = parseInt(budgetMatch[1]);
        if (budget < 150) budgetRanges['<£150/week']++;
        else if (budget < 200) budgetRanges['£150-£200/week']++;
        else if (budget < 250) budgetRanges['£200-£250/week']++;
        else budgetRanges['>£250/week']++;
      }
    });

    // Room type demand
    const roomTypes = {
      'En-suite': leads.filter(l => l.tags?.includes('en-suite')).length,
      'Studio': leads.filter(l => l.tags?.includes('studio')).length,
      'Cluster/Shared': leads.filter(l => l.tags?.includes('cluster')).length,
    };

    // Lifestyle preferences
    const lifestyle = {
      'Group Bookings': leads.filter(l => l.tags?.includes('group-booking')).length,
      'Solo': leads.filter(l => !l.tags?.includes('group-booking')).length,
    };

    // Lead sources
    const sources: Record<string, number> = {};
    leads.forEach(lead => {
      sources[lead.source] = (sources[lead.source] || 0) + 1;
    });

    // Conversion funnel with correct stage names
    const conversionFunnel = [
      { stage: 'New Enquiries', count: leads.filter(l => l.stage === 'new_enquiry').length },
      { stage: 'Viewings', count: leads.filter(l => ['viewing_booked', 'viewed_awaiting_application'].includes(l.stage || '')).length },
      { stage: 'Applications', count: leads.filter(l => l.stage === 'application_submitted').length },
      { stage: 'Deposits Paid', count: leads.filter(l => l.stage === 'deposit_paid').length },
      { stage: 'Contracts Signed', count: leads.filter(l => l.stage === 'contract_signed').length },
    ];

    // Property preferences - include unassigned leads
    const propertyPreferences: Record<string, number> = {};
    const propertyMap = new Map(properties.map(p => [p.id, p.name]));
    leads.forEach(lead => {
      if (lead.propertyId) {
        const propertyName = propertyMap.get(lead.propertyId) || 'Unknown';
        propertyPreferences[propertyName] = (propertyPreferences[propertyName] || 0) + 1;
      } else {
        propertyPreferences['Unassigned'] = (propertyPreferences['Unassigned'] || 0) + 1;
      }
    });

    // Generate recommendations
    const recommendations = [];
    
    // University recommendations
    const ntuCount = universities['Nottingham Trent University'] || 0;
    const uonCount = universities['University of Nottingham'] || 0;
    const ntuPercent = total > 0 ? Math.round((ntuCount / total) * 100) : 0;
    const uonPercent = total > 0 ? Math.round((uonCount / total) * 100) : 0;
    
    if (ntuPercent > 60) {
      recommendations.push({
        type: 'university',
        message: `${ntuPercent}% of your leads are from NTU - consider increasing marketing near campus`,
      });
    } else if (uonPercent > 60) {
      recommendations.push({
        type: 'university',
        message: `${uonPercent}% of your leads are from UoN - consider focusing marketing efforts in Beeston`,
      });
    }

    // Room type recommendations
    const totalRoomPrefs = roomTypes['En-suite'] + roomTypes['Studio'] + roomTypes['Cluster/Shared'];
    if (totalRoomPrefs > 0) {
      const studioPercent = Math.round((roomTypes['Studio'] / totalRoomPrefs) * 100);
      if (studioPercent > 40) {
        recommendations.push({
          type: 'room-type',
          message: `High demand for studios (${studioPercent}%) - consider converting cluster flats to studios`,
        });
      }
    }

    // Move-in date recommendations
    const totalMoveIn = moveInDates['September 2026'] + moveInDates['January 2027'] + moveInDates['Other'];
    if (totalMoveIn > 0) {
      const sepPercent = Math.round((moveInDates['September 2026'] / totalMoveIn) * 100);
      if (sepPercent > 80) {
        recommendations.push({
          type: 'move-in',
          message: `Peak move-in: September 2026 (${sepPercent}%) - focus marketing campaigns May-August`,
        });
      }
    }

    // International student recommendations
    const internationalPercent = total > 0 ? Math.round((ukVsInternational['International'] / total) * 100) : 0;
    if (internationalPercent > 50) {
      recommendations.push({
        type: 'international',
        message: `${internationalPercent}% international students - ensure guarantor support process is streamlined`,
      });
    }

    return {
      total,
      demographics: {
        universities,
        yearOfStudy,
        ukVsInternational,
        topCourses,
      },
      preferences: {
        moveInDates,
        budgetRanges,
        roomTypes,
        lifestyle,
      },
      targeting: {
        sources,
        conversionFunnel,
        propertyPreferences,
      },
      recommendations,
    };
  }

  // Get student profile analytics - uses path parameter
  app.get('/api/analytics/student-profiles/:propertyId', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { propertyId } = req.params;
      
      let leads = await storage.getLeadsByLandlord(landlordId);
      
      // Filter by property if not 'all'
      if (propertyId !== 'all') {
        leads = leads.filter(lead => lead.propertyId === propertyId);
      }
      
      const properties = await storage.getPropertiesByLandlord(landlordId);
      const analytics = await calculateStudentProfileAnalytics(leads, properties);
      
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // CALL LOGS ENDPOINTS - AI Call Performance & Lead Management
  // ============================================================================

  // Get all call logs for authenticated landlord with lead info joined
  app.get('/api/call-logs', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const callLogs = await storage.getCallLogsByLandlord(user.id);
      
      // Join with leads to get lead info
      const callLogsWithLeads = await Promise.all(
        callLogs.map(async (callLog) => {
          const lead = callLog.leadId ? await storage.getLead(callLog.leadId) : null;
          return {
            ...callLog,
            lead,
          };
        })
      );
      
      res.json(callLogsWithLeads);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Mark call as reviewed
  app.patch('/api/call-logs/:id/review', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { id } = req.params;
      const { reviewNotes } = req.body;
      
      // Verify the call log belongs to this landlord
      const callLog = await storage.getCallLog(id);
      if (!callLog) {
        return res.status(404).json({ message: 'Call log not found' });
      }
      if (callLog.landlordId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const updatedCallLog = await storage.markCallReviewed(id, reviewNotes);
      res.json(updatedCallLog);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update lead info from call and mark leadInfoUpdated = true
  app.patch('/api/call-logs/:id/update-lead', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { id } = req.params;
      const { leadUpdates, updatedFields } = req.body;
      
      // Verify the call log belongs to this landlord
      const callLog = await storage.getCallLog(id);
      if (!callLog) {
        return res.status(404).json({ message: 'Call log not found' });
      }
      if (callLog.landlordId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      // Verify the lead exists
      if (!callLog.leadId) {
        return res.status(400).json({ message: 'No lead associated with this call' });
      }
      
      // Update the lead
      await storage.updateLead(callLog.leadId, leadUpdates);
      
      // Update call log to mark lead info as updated
      const updatedCallLog = await storage.updateCallLog(id, {
        leadInfoUpdated: true,
        updatedFields: updatedFields,
      });
      
      res.json(updatedCallLog);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // AI SALES TRAINER
  // ============================================================================

  // Analyze a call and generate coaching insights
  app.post('/api/call-logs/:id/analyze', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { id } = req.params;
      
      // Verify the call log belongs to this landlord
      const callLog = await storage.getCallLog(id);
      if (!callLog) {
        return res.status(404).json({ message: 'Call log not found' });
      }
      if (callLog.landlordId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      // Import AI Sales Trainer service dynamically
      const { aiSalesTrainerService } = await import('./services/aiSalesTrainer');
      const { profileEnrichmentService } = await import('./services/profileEnrichment');
      
      // Analyze the call transcript
      const analysis = await aiSalesTrainerService.analyzeCallTranscript(
        id,
        callLog.callTranscription,
        callLog.leadId || undefined
      );
      
      // Calculate improvement score
      const improvementScore = await aiSalesTrainerService.calculateImprovementScore(
        user.id,
        callLog.callScore || 50
      );
      
      // Save coaching insights to call log
      const updatedCallLog = await storage.saveAICoachingInsights(id, {
        ...analysis,
        improvementScore,
      });
      
      // Save profile insights if lead exists
      if (callLog.leadId && analysis.profileInsights.length > 0) {
        await profileEnrichmentService.saveCallInsights(
          callLog.leadId,
          id,
          analysis.profileInsights
        );
      }
      
      // Link to viewing if mentioned
      if (analysis.viewingMention.mentioned && callLog.leadId) {
        const viewingId = await aiSalesTrainerService.findMatchingViewing(
          callLog.leadId,
          analysis.viewingMention.details || ''
        );
        
        if (viewingId) {
          await storage.linkCallToViewing(id, viewingId);
        }
      }
      
      res.json({
        success: true,
        analysis,
        callLog: updatedCallLog,
      });
    } catch (error: any) {
      console.error('Call analysis error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get latest coaching insights across all calls
  app.get('/api/sales-trainer/insights', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      
      const callLogs = await storage.getCallLogsByLandlord(user.id);
      
      // Get recent calls with AI coaching data
      const recentCallsWithInsights = callLogs
        .filter(log => log.aiCoachSummary !== null)
        .slice(0, 10)
        .map(log => ({
          id: log.id,
          callTimestamp: log.callTimestamp,
          aiCoachSummary: log.aiCoachSummary,
          conversionOpportunities: log.conversionOpportunities,
          missedTalkingPoints: log.missedTalkingPoints,
          skillFocusAreas: log.skillFocusAreas,
          improvementScore: log.improvementScore,
          callScore: log.callScore,
        }));
      
      res.json(recentCallsWithInsights);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get learning metrics over time
  app.get('/api/sales-trainer/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { period = 'month' } = req.query;
      
      const metrics = await storage.getLearningMetrics(user.id, period as string);
      
      // Calculate current metrics from recent calls
      const callLogs = await storage.getCallLogsByLandlord(user.id);
      const recentCalls = callLogs.slice(0, 30);
      
      const avgCallScore = recentCalls.filter(c => c.callScore !== null).length > 0
        ? Math.round(
            recentCalls
              .filter(c => c.callScore !== null)
              .reduce((sum, c) => sum + (c.callScore || 0), 0) /
              recentCalls.filter(c => c.callScore !== null).length
          )
        : 0;
      
      const conversionRate = recentCalls.length > 0
        ? Math.round(
            (recentCalls.filter(c => c.customerSentiment === 'positive').length /
              recentCalls.length) *
              100
          )
        : 0;
      
      res.json({
        historicalMetrics: metrics,
        currentMetrics: {
          avgCallScore,
          conversionRate,
          totalCalls: recentCalls.length,
          callsWithAICoaching: recentCalls.filter(c => c.aiCoachSummary !== null).length,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Apply a profile insight to lead
  app.post('/api/sales-trainer/apply-insight/:insightId', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { insightId } = req.params;
      
      // Get the insight
      const insights = await storage.getProfileInsightsByLead(''); // Will need to verify ownership
      const insight = insights.find(i => i.id === insightId);
      
      if (!insight) {
        return res.status(404).json({ message: 'Insight not found' });
      }
      
      // Verify the lead belongs to this landlord
      const lead = await storage.getLead(insight.leadId);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      // Get lead's property to verify landlord ownership
      if (lead.propertyId) {
        const property = await storage.getProperty(lead.propertyId);
        if (property && property.landlordId !== user.id) {
          return res.status(403).json({ message: 'Unauthorized' });
        }
      }
      
      // Apply the insight
      const { profileEnrichmentService } = await import('./services/profileEnrichment');
      const result = await profileEnrichmentService.enrichLeadProfile(insight.leadId);
      
      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Link call to viewing
  app.patch('/api/call-logs/:id/link-viewing/:viewingId', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { id, viewingId } = req.params;
      
      // Verify the call log belongs to this landlord
      const callLog = await storage.getCallLog(id);
      if (!callLog) {
        return res.status(404).json({ message: 'Call log not found' });
      }
      if (callLog.landlordId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      // Verify the viewing exists
      const viewing = await storage.getViewing(viewingId);
      if (!viewing) {
        return res.status(404).json({ message: 'Viewing not found' });
      }
      
      const updatedCallLog = await storage.linkCallToViewing(id, viewingId);
      res.json(updatedCallLog);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // WEBHOOK EVENTS ADMIN (for monitoring and debugging)
  // ============================================================================

  // Get all webhook events with filtering
  app.get('/api/admin/webhook-events', isAuthenticated, async (req, res) => {
    try {
      const { provider, status, limit = 100 } = req.query;
      
      const events = await storage.getWebhookEvents({
        provider: provider as string | undefined,
        status: status as string | undefined,
        limit: Number(limit),
      });
      
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single webhook event by ID
  app.get('/api/admin/webhook-events/:id', isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getWebhookEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: 'Webhook event not found' });
      }
      
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Retry failed webhook event
  app.post('/api/admin/webhook-events/:id/retry', isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getWebhookEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: 'Webhook event not found' });
      }
      
      if (event.status === 'completed') {
        return res.status(400).json({ message: 'Cannot retry completed webhook' });
      }
      
      // Reset status to pending for retry
      await storage.markWebhookProcessed(eventId);
      
      res.json({ success: true, message: 'Webhook event reset for retry', event });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // OPERATIONAL METRICS (for monitoring retry attempts and failures)
  // ============================================================================

  // GET /api/admin/metrics - Returns operational metrics summary
  app.get('/api/admin/metrics', isAuthenticated, async (req, res) => {
    try {
      const metricsSummary = metrics.getMetricsSummary();
      res.json(metricsSummary);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/admin/metrics/reset - Reset all metrics (protected endpoint)
  app.post('/api/admin/metrics/reset', isAuthenticated, async (req, res) => {
    try {
      metrics.resetMetrics();
      res.json({ success: true, message: 'All metrics have been reset' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // FEATURE FLAGS
  // ============================================================================

  // GET /api/feature-flags (isAuthenticated)
  app.get("/api/feature-flags", isAuthenticated, async (req, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const flags = await storage.getAllFeatureFlags(user.id);
      
      res.json(flags);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      res.status(500).json({ error: 'Failed to fetch feature flags' });
    }
  });

  // POST /api/feature-flags (isAuthenticated)
  app.post("/api/feature-flags", isAuthenticated, async (req, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { featureKey, enabled } = req.body;
      
      // Validate featureKey
      const validKeys = [
        'whatsapp_integration',
        'incentives_system',
        'ai_call_scoring'
      ];
      
      if (!validKeys.includes(featureKey)) {
        return res.status(400).json({ error: 'Invalid feature key' });
      }
      
      const flag = await storage.setFeatureFlag(
        user.id,
        featureKey,
        enabled,
        user.id // User enabling/disabling for themselves
      );
      
      res.json(flag);
    } catch (error) {
      console.error('Error updating feature flag:', error);
      res.status(500).json({ error: 'Failed to update feature flag' });
    }
  });

  // GET /api/feature-flags/:featureKey (isAuthenticated)
  app.get("/api/feature-flags/:featureKey", isAuthenticated, async (req, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { featureKey } = req.params;
      
      const enabled = await storage.getFeatureFlag(user.id, featureKey);
      
      res.json({ featureKey, enabled });
    } catch (error) {
      console.error('Error checking feature flag:', error);
      res.status(500).json({ error: 'Failed to check feature flag' });
    }
  });

  // ============================================================================
  // EMAIL AUTOMATION ENDPOINTS
  // ============================================================================

  // 1. Welcome Email
  app.post("/api/emails/welcome", isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { landlordName, trialEndDate, trialDays, features } = req.body;
      
      const html = generateWelcomeEmail({ landlordName, trialEndDate, trialDays, features });
      const sent = await emailService.sendEmail(
        user.email!,
        "Welcome to TermFlow - Your Trial Starts Now!",
        html
      );
      
      // Log to audit
      await db.insert(emailEvents).values({
        eventType: "welcome",
        recipientEmail: req.user!.email!,
        recipientName: landlordName,
        subject: "Welcome to TermFlow - Your Trial Starts Now!",
        status: sent ? "sent" : "failed",
        relatedEntityType: "user",
        relatedEntityId: req.user!.id,
        metadata: { landlordName, trialEndDate, trialDays, features },
        renderedHtml: html,
        triggeredByUserId: req.user!.id,
        errorMessage: sent ? null : "SMTP not configured",
      });
      
      res.json({ status: sent ? "sent" : "failed" });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // 2. Onboarding Confirmation (with attachment)
  app.post("/api/emails/onboarding-confirmation", isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { landlordName, propertyName, contractUrl, onboardingDate, selections } = req.body;
      
      const html = generateOnboardingConfirmationEmail({
        landlordName,
        propertyName,
        contractUrl,
        onboardingDate,
        selections,
      });
      
      // Attachment (if contractUrl provided)
      const attachments = contractUrl ? [{ 
        filename: 'contract.pdf',
        path: contractUrl 
      }] : undefined;
      
      const sent = await emailService.sendEmail(
        user.email!,
        `Onboarding Complete - ${propertyName}`,
        html,
        attachments
      );
      
      await db.insert(emailEvents).values({
        eventType: "onboarding_confirmation",
        recipientEmail: req.user!.email!,
        recipientName: landlordName,
        subject: `Onboarding Complete - ${propertyName}`,
        status: sent ? "sent" : "failed",
        relatedEntityType: "property",
        relatedEntityId: null,
        metadata: { landlordName, propertyName, contractUrl, selections },
        renderedHtml: html,
        triggeredByUserId: req.user!.id,
      });
      
      res.json({ status: sent ? "sent" : "failed" });
    } catch (error) {
      console.error('Error sending onboarding email:', error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // 3. Staff Account Created
  app.post("/api/emails/staff-created", isAuthenticated, async (req: any, res) => {
    try {
      const { staffName, staffEmail, role } = req.body;
      const invitedBy = req.user!.displayName || req.user!.email!;
      const loginUrl = `${process.env.BASE_URL || 'https://termflow.com'}/auth/login`;
      
      const html = generateStaffAccountCreatedEmail({
        staffName,
        staffEmail,
        invitedBy,
        loginUrl,
        role,
      });
      
      const sent = await emailService.sendEmail(
        staffEmail,
        "You've been invited to TermFlow",
        html
      );
      
      await db.insert(emailEvents).values({
        eventType: "staff_created",
        recipientEmail: staffEmail,
        recipientName: staffName,
        subject: "You've been invited to TermFlow",
        status: sent ? "sent" : "failed",
        relatedEntityType: "user",
        relatedEntityId: null,
        metadata: { staffName, staffEmail, invitedBy, role },
        renderedHtml: html,
        triggeredByUserId: req.user!.id,
      });
      
      res.json({ status: sent ? "sent" : "failed" });
    } catch (error) {
      console.error('Error sending staff email:', error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // 4. Deal Approval Required
  app.post("/api/emails/deal-approval", isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const { leadId, tenantName, propertyName, roomType, rentPerWeek, depositAmount, moveInDate, contractTerms } = req.body;
      
      // Create approval record with token
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours
      
      const [approval] = await db.insert(approvals).values({
        leadId,
        token,
        expiresAt,
        metadata: { tenantName, propertyName, roomType, rentPerWeek, depositAmount, moveInDate },
      }).returning();
      
      const baseUrl = process.env.BASE_URL || 'https://termflow.com';
      const approvalUrl = `${baseUrl}/api/approvals/${token}/approve`;
      const requestChangesUrl = `${baseUrl}/api/approvals/${token}/request-changes`;
      
      const html = generateDealApprovalEmail({
        landlordName: `${user.firstName} ${user.lastName}` || 'there',
        tenantName,
        propertyName,
        roomType,
        rentPerWeek,
        depositAmount,
        moveInDate,
        contractTerms,
        approvalUrl,
        requestChangesUrl,
      });
      
      const sent = await emailService.sendEmail(
        user.email!,
        `Deal Approval Required - ${tenantName}`,
        html
      );
      
      await db.insert(emailEvents).values({
        eventType: "deal_approval",
        recipientEmail: user.email!,
        recipientName: `${user.firstName} ${user.lastName}` || '',
        subject: `Deal Approval Required - ${tenantName}`,
        status: sent ? "sent" : "failed",
        relatedEntityType: "lead",
        relatedEntityId: leadId,
        metadata: { tenantName, propertyName, approvalId: approval.id },
        renderedHtml: html,
        triggeredByUserId: req.user!.id,
      });
      
      res.json({ status: sent ? "sent" : "failed", approvalId: approval.id });
    } catch (error) {
      console.error('Error sending approval email:', error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // 5. Weekly Summary Email
  app.post("/api/emails/weekly-summary", isAuthenticated, async (req: any, res) => {
    try {
      const { propertyId, buildingOrPortfolioName } = req.body;
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      const metrics = await calculateWeeklyMetrics(landlordId, propertyId);
      
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
      const weekRange = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      
      const baseUrl = process.env.BASE_URL || 'https://termflow.com';
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      const approveQueueLink = generateSignedLink(
        `${baseUrl}/approvals/queue`,
        { action: 'view_approvals', entityId: landlordId, expiresAt }
      );
      
      const paymentsQueueLink = metrics.paymentFailures > 0 
        ? generateSignedLink(
            `${baseUrl}/payments/failed`,
            { action: 'view_failed_payments', entityId: landlordId, expiresAt }
          )
        : undefined;
      
      const rtrQueueLink = metrics.rtrFailed > 0
        ? generateSignedLink(
            `${baseUrl}/rtr/failed`,
            { action: 'view_failed_rtr', entityId: landlordId, expiresAt }
          )
        : undefined;
      
      // SECURITY FIX: Get landlord's property IDs to prevent cross-landlord data leaks
      const landlordProperties = await db.select({ id: properties.id })
        .from(properties)
        .where(eq(properties.landlordId, landlordId));
      
      const landlordPropertyIds = landlordProperties.map(p => p.id);
      
      // Build secure property filter
      const securePropertyFilter = propertyId
        ? and(
            eq(leads.propertyId, propertyId),
            inArray(properties.id, landlordPropertyIds) // Verify ownership
          )
        : landlordPropertyIds.length > 0
          ? inArray(leads.propertyId, landlordPropertyIds) // Portfolio: only landlord's properties
          : sql`false`; // No properties = no results
      
      const weekLeads = await db.select()
        .from(leads)
        .leftJoin(properties, eq(leads.propertyId, properties.id))
        .where(and(
          gte(leads.createdAt, weekStart),
          lte(leads.createdAt, weekEnd),
          securePropertyFilter
        ));
      
      const csvData = weekLeads.map(({ leads: lead, properties: property }) => ({
        name: lead.name,
        email: lead.email || '',
        phone: lead.phone || '',
        propertyName: property?.name || '',
        roomType: lead.roomId || '',
        status: lead.status,
        source: lead.source || 'Direct',
        createdAt: lead.createdAt!,
      }));
      
      const csvContent = generateLeadsCSV(csvData);
      
      const upcomingViewings = await db.select()
        .from(viewings)
        .leftJoin(leads, eq(viewings.leadId, leads.id))
        .leftJoin(properties, eq(leads.propertyId, properties.id))
        .where(and(
          gte(viewings.scheduledAt, new Date()),
          lte(viewings.scheduledAt, weekEnd),
          securePropertyFilter
        ));
      
      const icsEvents = upcomingViewings.map(({ viewings: v, leads: lead, properties: property }) => ({
        title: `Viewing: ${lead?.name} - ${property?.name}`,
        startTime: v.scheduledAt!,
        endTime: new Date(v.scheduledAt!.getTime() + 30 * 60000),
        location: property?.address || '',
        description: `Viewing with ${lead?.name} (${lead?.email})`,
      }));
      
      const icsContent = generateICS(icsEvents);
      
      const html = generateWeeklySummaryEmail({
        landlordName: `${user.firstName} ${user.lastName}` || user.email!,
        buildingOrPortfolioName: buildingOrPortfolioName || 'Your Portfolio',
        weekRange,
        ...metrics,
        approveQueueLink,
        paymentsQueueLink,
        rtrQueueLink,
        icsLink: icsEvents.length > 0 ? `${baseUrl}/api/weekly-summary/calendar.ics` : undefined,
      });
      
      const attachments = [
        {
          filename: `week-${format(weekStart, 'yyyy-ww')}-leads.csv`,
          content: Buffer.from(csvContent),
          contentType: 'text/csv',
        },
      ];
      
      if (icsEvents.length > 0) {
        attachments.push({
          filename: 'viewings.ics',
          content: Buffer.from(icsContent),
          contentType: 'text/calendar',
        });
      }
      
      const subject = `This week at ${buildingOrPortfolioName || 'Your Portfolio'} — ${metrics.occupancyForecast}% forecast, ${metrics.awaitingApprovals} approvals`;
      
      const sent = await emailService.sendEmail(
        user.email!,
        subject,
        html,
        attachments
      );
      
      await db.insert(emailEvents).values({
        eventType: "weekly_summary",
        recipientEmail: req.user!.email!,
        recipientName: req.user!.displayName || '',
        subject,
        status: sent ? "sent" : "failed",
        relatedEntityType: propertyId ? "property" : "user",
        relatedEntityId: propertyId || landlordId,
        metadata: { weekRange, metrics, buildingOrPortfolioName },
        renderedHtml: html,
        triggeredByUserId: landlordId,
      });
      
      res.json({ status: sent ? "sent" : "failed" });
    } catch (error) {
      console.error('Error sending weekly summary:', error);
      res.status(500).json({ message: "Failed to send weekly summary" });
    }
  });

  // 6. Get Email Events (audit trail)
  app.get("/api/emails/events", isAuthenticated, async (req: any, res) => {
    try {
      const { type, status, limit = '50', offset = '0' } = req.query;
      
      let query = db.select().from(emailEvents)
        .where(eq(emailEvents.triggeredByUserId, req.user!.id))
        .orderBy(desc(emailEvents.sentAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));
      
      const events = await query;
      res.json(events);
    } catch (error) {
      console.error('Error fetching email events:', error);
      res.status(500).json({ message: "Failed to fetch email events" });
    }
  });

  // ============================================================================
  // INVOICE ENDPOINTS
  // ============================================================================

  // Download invoice PDF
  app.get("/api/invoices/:id/pdf", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      // Get invoice and verify ownership
      const invoice = await db.query.invoices.findFirst({
        where: and(
          eq(invoices.id, parseInt(id)),
          eq(invoices.landlordId, landlordId)
        ),
      });
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      // Get pass-through costs for this invoice
      const { passThroughCosts, subtotalPassThrough } = await calculateMonthlyUsage(
        landlordId,
        new Date(invoice.billingPeriodStart)
      );
      
      // Generate PDF using puppeteer
      const { generateInvoicePDF } = await import('./pdfService');
      
      const pdfBuffer = await generateInvoicePDF({
        landlordName: user.firstName + ' ' + user.lastName || user.email!,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: format(invoice.createdAt!, 'MMM d, yyyy'),
        billingPeriod: `${format(invoice.billingPeriodStart, 'MMM d')} - ${format(invoice.billingPeriodEnd, 'MMM d, yyyy')}`,
        dueDate: format(invoice.dueDate, 'MMM d, yyyy'),
        subscriptionPlan: "TermFlow Pro",
        subscriptionFee: Number(invoice.subscriptionFee),
        passThroughCosts,
        subtotalPassThrough,
        totalAmount: Number(invoice.totalAmount),
        paymentMethod: "Visa ending in 4242",
        paymentStatus: invoice.status as 'paid' | 'pending' | 'overdue',
      });
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // Generate and send monthly invoice
  app.post("/api/invoices/send-monthly", isAuthenticated, async (req, res) => {
    try {
      const { month } = req.body; // ISO date string
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      const invoiceMonth = month ? new Date(month) : startOfMonth(new Date());
      
      // Get landlord's subscription plan (placeholder - replace with actual logic)
      const subscriptionPlan = "TermFlow Pro";
      const subscriptionFee = 99.00;
      
      // Calculate usage
      const { passThroughCosts, subtotalPassThrough } = await calculateMonthlyUsage(
        landlordId,
        invoiceMonth
      );
      
      // Generate invoice record
      const invoice = await generateMonthlyInvoice(landlordId, invoiceMonth, subscriptionFee);
      
      // Get payment method (placeholder)
      const paymentMethod = "Visa ending in 4242";
      
      // Generate email
      const html = generateMonthlyInvoiceEmail({
        landlordName: `${user.firstName} ${user.lastName}` || user.email!,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: format(invoice.createdAt!, 'MMM d, yyyy'),
        billingPeriod: `${format(invoice.billingPeriodStart, 'MMM d')} - ${format(invoice.billingPeriodEnd, 'MMM d, yyyy')}`,
        dueDate: format(invoice.dueDate, 'MMM d, yyyy'),
        subscriptionPlan,
        subscriptionFee,
        passThroughCosts,
        subtotalPassThrough,
        totalAmount: Number(invoice.totalAmount),
        paymentMethod,
        paymentStatus: invoice.status as 'paid' | 'pending' | 'overdue',
        downloadPdfLink: `/api/invoices/${invoice.id}/pdf`,
      });
      
      const subject = `Invoice #${invoice.invoiceNumber} - ${format(invoice.billingPeriodStart, 'MMMM yyyy')}`;
      
      // Send email
      const sent = await emailService.sendEmail(
        user.email!,
        subject,
        html
      );
      
      // Update invoice status
      if (sent) {
        await db.update(invoices)
          .set({ status: 'sent' })
          .where(eq(invoices.id, invoice.id));
      }
      
      // Log to audit
      await db.insert(emailEvents).values({
        eventType: "monthly_invoice",
        recipientEmail: user.email!,
        recipientName: `${user.firstName} ${user.lastName}` || '',
        subject,
        status: sent ? "sent" : "failed",
        relatedEntityType: "invoice",
        relatedEntityId: invoice.id.toString(),
        metadata: { invoiceNumber: invoice.invoiceNumber, billingPeriod: format(invoiceMonth, 'yyyy-MM') },
        renderedHtml: html,
        triggeredByUserId: landlordId,
      });
      
      res.json({ 
        status: sent ? "sent" : "failed",
        invoice: {
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          totalAmount: invoice.totalAmount,
        }
      });
    } catch (error) {
      console.error('Error sending monthly invoice:', error);
      res.status(500).json({ message: "Failed to send invoice" });
    }
  });

  // Get invoice details
  app.get("/api/invoices/:id", isAuthenticated, async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      const invoice = await db.query.invoices.findFirst({
        where: and(
          eq(invoices.id, invoiceId),
          eq(invoices.landlordId, landlordId)
        ),
      });
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      res.json(invoice);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });

  // 6. Approval Endpoints
  app.patch("/api/approvals/:token/approve", async (req, res) => {
    try {
      const { token } = req.params;
      
      const approval = await db.query.approvals.findFirst({
        where: eq(approvals.token, token),
      });
      
      if (!approval) {
        return res.status(404).json({ message: "Approval not found" });
      }
      
      if (approval.status !== 'pending') {
        return res.status(400).json({ message: "Approval already processed" });
      }
      
      if (new Date() > new Date(approval.expiresAt)) {
        return res.status(400).json({ message: "Approval link expired" });
      }
      
      await db.update(approvals)
        .set({ 
          status: 'approved',
          decidedAt: new Date(),
        })
        .where(eq(approvals.id, approval.id));
      
      res.json({ message: "Deal approved successfully" });
    } catch (error) {
      console.error('Error approving deal:', error);
      res.status(500).json({ message: "Failed to approve deal" });
    }
  });

  app.patch("/api/approvals/:token/request-changes", async (req, res) => {
    try {
      const { token } = req.params;
      const { changes } = req.body;
      
      const approval = await db.query.approvals.findFirst({
        where: eq(approvals.token, token),
      });
      
      if (!approval) {
        return res.status(404).json({ message: "Approval not found" });
      }
      
      if (approval.status !== 'pending') {
        return res.status(400).json({ message: "Approval already processed" });
      }
      
      if (new Date() > new Date(approval.expiresAt)) {
        return res.status(400).json({ message: "Approval link expired" });
      }
      
      await db.update(approvals)
        .set({ 
          status: 'changes_requested',
          decidedAt: new Date(),
          metadata: { ...approval.metadata as any, requestedChanges: changes },
        })
        .where(eq(approvals.id, approval.id));
      
      res.json({ message: "Changes requested successfully" });
    } catch (error) {
      console.error('Error requesting changes:', error);
      res.status(500).json({ message: "Failed to request changes" });
    }
  });

  // ============================================================================
  // WHATSAPP TEMPLATE MANAGEMENT
  // ============================================================================

  // Get all templates for landlord
  app.get("/api/whatsapp-templates", isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const templates = await db.select()
        .from(whatsappTemplates)
        .where(eq(whatsappTemplates.landlordId, landlordId))
        .orderBy(whatsappTemplates.category, whatsappTemplates.name);
      
      res.json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Get single template
  app.get("/api/whatsapp-templates/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { id } = req.params;
      
      const template = await db.query.whatsappTemplates.findFirst({
        where: and(
          eq(whatsappTemplates.id, id),
          eq(whatsappTemplates.landlordId, landlordId)
        ),
      });
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      console.error('Error fetching template:', error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Create template
  app.post("/api/whatsapp-templates", isAuthenticated, async (req: any, res) => {
    try {
      const landlordId = req.user?.id;
      
      if (!landlordId) {
        console.error('No landlordId found in session. req.user:', req.user);
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const templateData = insertWhatsappTemplateSchema.parse({
        ...req.body,
        landlordId,
      });
      
      const [template] = await db.insert(whatsappTemplates)
        .values(templateData)
        .returning();
      
      res.status(201).json(template);
    } catch (error) {
      console.error('Error creating template:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  // Update template
  app.patch("/api/whatsapp-templates/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { id } = req.params;
      
      // Verify ownership
      const existing = await db.query.whatsappTemplates.findFirst({
        where: and(
          eq(whatsappTemplates.id, id),
          eq(whatsappTemplates.landlordId, landlordId)
        ),
      });
      
      if (!existing) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      const [updated] = await db.update(whatsappTemplates)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(whatsappTemplates.id, id))
        .returning();
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating template:', error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  // Delete template
  app.delete("/api/whatsapp-templates/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      const { id } = req.params;
      
      // Verify ownership
      const existing = await db.query.whatsappTemplates.findFirst({
        where: and(
          eq(whatsappTemplates.id, id),
          eq(whatsappTemplates.landlordId, landlordId)
        ),
      });
      
      if (!existing) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      await db.delete(whatsappTemplates)
        .where(eq(whatsappTemplates.id, id));
      
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error('Error deleting template:', error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // ============================================================================
  // STUDENT PORTAL WEBHOOKS
  // ============================================================================

  // Zod schemas for webhook payload validation
  const accommodationForStudentsSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required").optional().nullable(),
    phone: z.string().optional().nullable(),
    propertyRef: z.string().min(1, "Property reference is required"),
    message: z.string().optional().nullable(),
    moveInDate: z.string().optional().nullable(),
    budget: z.string().optional().nullable(),
  });

  const studentComSchema = z.object({
    studentName: z.string().min(1, "Student name is required"),
    studentEmail: z.string().email("Valid email is required").optional().nullable(),
    studentPhone: z.string().optional().nullable(),
    propertyId: z.string().min(1, "Property ID is required"),
    roomType: z.string().optional().nullable(),
    moveIn: z.string().optional().nullable(),
    budget: z.string().optional().nullable(),
    nationality: z.string().optional().nullable(),
  });

  const uniplacesSchema = z.object({
    tenant_name: z.string().min(1, "Tenant name is required"),
    tenant_email: z.string().email("Valid email is required").optional().nullable(),
    tenant_phone: z.string().optional().nullable(),
    listing_id: z.string().min(1, "Listing ID is required"),
    room_type: z.string().optional().nullable(),
    check_in: z.string().optional().nullable(),
    monthly_budget: z.string().optional().nullable(),
  });

  const amberStudentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required").optional().nullable(),
    mobile: z.string().optional().nullable(),
    property_external_id: z.string().min(1, "Property external ID is required"),
    room_preference: z.string().optional().nullable(),
    move_in_date: z.string().optional().nullable(),
    price_range: z.string().optional().nullable(),
    university: z.string().optional().nullable(),
  });

  // Accommodation for Students Webhook
  app.post("/webhooks/portals/accommodation-for-students", createIdempotentWebhookHandler({
    provider: 'accommodation-for-students',
    getEventId: (req: any) => req.headers['x-event-id'] || crypto.randomUUID(),
    getEventType: (req: any) => 'lead_inquiry',
  }, storage), async (req: any, res) => {
    try {
      // Verify API key
      const apiKey = req.headers['x-api-key'];
      if (!apiKey || apiKey !== process.env.ACCOMMODATION_FOR_STUDENTS_API_KEY) {
        safeLog('Unauthorized webhook attempt - Accommodation for Students', { 
          hasKey: !!apiKey,
          ip: req.ip 
        });
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validate payload
      const validationResult = accommodationForStudentsSchema.safeParse(req.body);
      if (!validationResult.success) {
        safeLog('Invalid webhook payload - Accommodation for Students', { 
          errors: validationResult.error.errors 
        });
        return res.status(400).json({ 
          message: "Invalid payload", 
          errors: validationResult.error.errors 
        });
      }

      const webhookEvent = req.webhookEvent;
      const { name, email, phone, propertyRef, message, moveInDate, budget } = validationResult.data;
      
      // Find property by reference
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, propertyRef),
      });
      
      if (!property) {
        safeLog('Property not found for portal webhook', { propertyRef });
        await markWebhookComplete(storage, webhookEvent.id);
        return res.status(200).json({ message: "Property not found, webhook acknowledged" });
      }
      
      // Create lead
      const [lead] = await db.insert(leads).values({
        name,
        email: email || null,
        phone: phone || null,
        whatsappNumber: phone || null,
        propertyId: property.id,
        stage: 'new_enquiry',
        source: 'accommodation_for_students',
        notes: message || null,
        moveInDate: moveInDate ? new Date(moveInDate) : null,
        budget: budget || null,
      }).returning();
      
      safeLog('Lead created from Accommodation for Students', { leadId: lead.id });
      
      await markWebhookComplete(storage, webhookEvent.id);
      res.status(201).json({ message: "Lead created successfully", leadId: lead.id });
    } catch (error: any) {
      safeError('Accommodation for Students webhook error', error);
      if (req.webhookEvent) {
        await markWebhookFailed(storage, req.webhookEvent.id, error.message);
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Student.com Webhook
  app.post("/webhooks/portals/student-com", createIdempotentWebhookHandler({
    provider: 'student-com',
    getEventId: (req: any) => req.headers['x-event-id'] || crypto.randomUUID(),
    getEventType: (req: any) => 'lead_inquiry',
  }, storage), async (req: any, res) => {
    try {
      // Verify API key
      const apiKey = req.headers['x-api-key'];
      if (!apiKey || apiKey !== process.env.STUDENT_COM_API_KEY) {
        safeLog('Unauthorized webhook attempt - Student.com', { 
          hasKey: !!apiKey,
          ip: req.ip 
        });
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validate payload
      const validationResult = studentComSchema.safeParse(req.body);
      if (!validationResult.success) {
        safeLog('Invalid webhook payload - Student.com', { 
          errors: validationResult.error.errors 
        });
        return res.status(400).json({ 
          message: "Invalid payload", 
          errors: validationResult.error.errors 
        });
      }

      const webhookEvent = req.webhookEvent;
      const { studentName, studentEmail, studentPhone, propertyId, roomType, moveIn, budget, nationality } = validationResult.data;
      
      // Find property
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, propertyId),
      });
      
      if (!property) {
        safeLog('Property not found for Student.com webhook', { propertyId });
        await markWebhookComplete(storage, webhookEvent.id);
        return res.status(200).json({ message: "Property not found, webhook acknowledged" });
      }
      
      // Create lead
      const [lead] = await db.insert(leads).values({
        name: studentName,
        email: studentEmail || null,
        phone: studentPhone || null,
        whatsappNumber: studentPhone || null,
        propertyId: property.id,
        roomType: roomType || null,
        stage: 'new_enquiry',
        source: 'student_com',
        moveInDate: moveIn ? new Date(moveIn) : null,
        budget: budget || null,
        nationality: nationality || null,
      }).returning();
      
      safeLog('Lead created from Student.com', { leadId: lead.id });
      
      await markWebhookComplete(storage, webhookEvent.id);
      res.status(201).json({ message: "Lead created successfully", leadId: lead.id });
    } catch (error: any) {
      safeError('Student.com webhook error', error);
      if (req.webhookEvent) {
        await markWebhookFailed(storage, req.webhookEvent.id, error.message);
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Uniplaces Webhook
  app.post("/webhooks/portals/uniplaces", createIdempotentWebhookHandler({
    provider: 'uniplaces',
    getEventId: (req: any) => req.headers['x-event-id'] || crypto.randomUUID(),
    getEventType: (req: any) => 'lead_inquiry',
  }, storage), async (req: any, res) => {
    try {
      // Verify API key
      const apiKey = req.headers['x-api-key'];
      if (!apiKey || apiKey !== process.env.UNIPLACES_API_KEY) {
        safeLog('Unauthorized webhook attempt - Uniplaces', { 
          hasKey: !!apiKey,
          ip: req.ip 
        });
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validate payload
      const validationResult = uniplacesSchema.safeParse(req.body);
      if (!validationResult.success) {
        safeLog('Invalid webhook payload - Uniplaces', { 
          errors: validationResult.error.errors 
        });
        return res.status(400).json({ 
          message: "Invalid payload", 
          errors: validationResult.error.errors 
        });
      }

      const webhookEvent = req.webhookEvent;
      const { tenant_name, tenant_email, tenant_phone, listing_id, room_type, check_in, monthly_budget } = validationResult.data;
      
      // Find property by listing ID
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, listing_id),
      });
      
      if (!property) {
        safeLog('Property not found for Uniplaces webhook', { listing_id });
        await markWebhookComplete(storage, webhookEvent.id);
        return res.status(200).json({ message: "Property not found, webhook acknowledged" });
      }
      
      // Create lead
      const [lead] = await db.insert(leads).values({
        name: tenant_name,
        email: tenant_email || null,
        phone: tenant_phone || null,
        whatsappNumber: tenant_phone || null,
        propertyId: property.id,
        roomType: room_type || null,
        stage: 'new_enquiry',
        source: 'uniplaces',
        moveInDate: check_in ? new Date(check_in) : null,
        budget: monthly_budget || null,
      }).returning();
      
      safeLog('Lead created from Uniplaces', { leadId: lead.id });
      
      await markWebhookComplete(storage, webhookEvent.id);
      res.status(201).json({ message: "Lead created successfully", leadId: lead.id });
    } catch (error: any) {
      safeError('Uniplaces webhook error', error);
      if (req.webhookEvent) {
        await markWebhookFailed(storage, req.webhookEvent.id, error.message);
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Amber Student Webhook
  app.post("/webhooks/portals/amber-student", createIdempotentWebhookHandler({
    provider: 'amber-student',
    getEventId: (req: any) => req.headers['x-event-id'] || crypto.randomUUID(),
    getEventType: (req: any) => 'lead_inquiry',
  }, storage), async (req: any, res) => {
    try {
      // Verify API key
      const apiKey = req.headers['x-api-key'];
      if (!apiKey || apiKey !== process.env.AMBER_STUDENT_API_KEY) {
        safeLog('Unauthorized webhook attempt - Amber Student', { 
          hasKey: !!apiKey,
          ip: req.ip 
        });
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validate payload
      const validationResult = amberStudentSchema.safeParse(req.body);
      if (!validationResult.success) {
        safeLog('Invalid webhook payload - Amber Student', { 
          errors: validationResult.error.errors 
        });
        return res.status(400).json({ 
          message: "Invalid payload", 
          errors: validationResult.error.errors 
        });
      }

      const webhookEvent = req.webhookEvent;
      const { name, email, mobile, property_external_id, room_preference, move_in_date, price_range, university } = validationResult.data;
      
      // Find property
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, property_external_id),
      });
      
      if (!property) {
        safeLog('Property not found for Amber Student webhook', { property_external_id });
        await markWebhookComplete(storage, webhookEvent.id);
        return res.status(200).json({ message: "Property not found, webhook acknowledged" });
      }
      
      // Create lead
      const [lead] = await db.insert(leads).values({
        name,
        email: email || null,
        phone: mobile || null,
        whatsappNumber: mobile || null,
        propertyId: property.id,
        roomType: room_preference || null,
        stage: 'new_enquiry',
        source: 'amber_student',
        moveInDate: move_in_date ? new Date(move_in_date) : null,
        budget: price_range || null,
        university: university || null,
      }).returning();
      
      safeLog('Lead created from Amber Student', { leadId: lead.id });
      
      await markWebhookComplete(storage, webhookEvent.id);
      res.status(201).json({ message: "Lead created successfully", leadId: lead.id });
    } catch (error: any) {
      safeError('Amber Student webhook error', error);
      if (req.webhookEvent) {
        await markWebhookFailed(storage, req.webhookEvent.id, error.message);
      }
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // CONTRACT SIGNATURE ENDPOINTS
  // ============================================================================

  // Send contract for signature
  app.post('/api/contracts/:id/send-for-signature', isAuthenticated, async (req: any, res) => {
    try {
      const contractId = req.params.id;
      const user = await getAuthenticatedUser(req);
      
      // Get contract
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
      
      // Verify ownership
      const property = await storage.getProperty(contract.propertyId);
      if (property?.landlordId !== user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Check if already sent
      if (contract.signableEnvelopeId) {
        return res.status(400).json({ 
          message: 'Contract already sent for signature',
          envelopeId: contract.signableEnvelopeId
        });
      }
      
      // Get lead and room details
      const lead = await storage.getLead(contract.leadId);
      const room = await storage.getRoom(contract.roomId);
      
      if (!lead || !room) {
        return res.status(400).json({ message: 'Lead or room not found' });
      }
      
      // Generate contract PDF
      const { generateContract } = await import('./contractTemplate');
      const contractPdf = await generateContract(lead, room, property);
      
      // Convert to Buffer if it's HTML
      let pdfBuffer: Buffer;
      if (typeof contractPdf === 'string') {
        const puppeteer = await import('puppeteer');
        const browser = await puppeteer.launch({ 
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(contractPdf);
        pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
      } else {
        pdfBuffer = contractPdf as Buffer;
      }
      
      // Send for signature via Signable
      const { signableService } = await import('./services/signableService');
      const envelope = await signableService.createEnvelope({
        pdfBuffer,
        tenantEmail: lead.email || '',
        tenantName: lead.name || '',
        landlordEmail: user.email || '',
        landlordName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Landlord',
        guarantorEmail: lead.needsGuarantor ? lead.guarantorEmail || undefined : undefined,
        guarantorName: lead.needsGuarantor ? lead.guarantorName || undefined : undefined,
        contractId: contract.id
      });
      
      // Update contract with Signable details
      await storage.updateContract(contract.id, {
        signableEnvelopeId: envelope.envelopeId,
        tenantSigningUrl: envelope.signingUrls.tenant,
        landlordSigningUrl: envelope.signingUrls.landlord,
        guarantorSigningUrl: envelope.signingUrls.guarantor,
        tenantSignatureStatus: 'pending',
        sentAt: new Date()
      });
      
      // Send notifications
      const workflowService = new (await import('./services/workflowAutomation')).WorkflowAutomationService();
      await workflowService.sendSigningNotification(lead, envelope.signingUrls.tenant || '');
      
      // Update lead stage
      await storage.updateLead(contract.leadId, {
        stage: 'contract_sent'
      });
      
      safeLog('Contract sent for signature', {
        contractId: contract.id,
        envelopeId: envelope.envelopeId,
        leadId: contract.leadId
      });
      
      res.json({
        success: true,
        envelopeId: envelope.envelopeId,
        signingUrls: envelope.signingUrls
      });
    } catch (error: any) {
      safeError('Error sending contract for signature', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get signing URL for a contract
  app.get('/api/contracts/:id/signing-url', isAuthenticated, async (req: any, res) => {
    try {
      const contractId = req.params.id;
      const { party } = req.query; // 'tenant' or 'landlord' or 'guarantor'
      const user = await getAuthenticatedUser(req);
      
      // Get contract
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
      
      // Verify ownership or tenant access
      const lead = await storage.getLead(contract.leadId);
      const property = await storage.getProperty(contract.propertyId);
      
      const isLandlord = property?.landlordId === user.id;
      const isTenant = lead?.email === user.email;
      
      if (!isLandlord && !isTenant) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Return appropriate signing URL
      let signingUrl = '';
      if (party === 'tenant' && contract.tenantSigningUrl) {
        signingUrl = contract.tenantSigningUrl;
      } else if (party === 'landlord' && contract.landlordSigningUrl) {
        signingUrl = contract.landlordSigningUrl;
      } else if (party === 'guarantor' && contract.guarantorSigningUrl) {
        signingUrl = contract.guarantorSigningUrl;
      } else if (isTenant && contract.tenantSigningUrl) {
        signingUrl = contract.tenantSigningUrl;
      } else if (isLandlord && contract.landlordSigningUrl) {
        signingUrl = contract.landlordSigningUrl;
      }
      
      if (!signingUrl) {
        return res.status(404).json({ message: 'Signing URL not available' });
      }
      
      res.json({ signingUrl });
    } catch (error: any) {
      safeError('Error getting signing URL', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Resend signature reminder
  app.post('/api/contracts/:id/resend-signature', isAuthenticated, async (req: any, res) => {
    try {
      const contractId = req.params.id;
      const user = await getAuthenticatedUser(req);
      
      // Get contract
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
      
      // Verify ownership
      const property = await storage.getProperty(contract.propertyId);
      if (property?.landlordId !== user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      if (!contract.signableEnvelopeId) {
        return res.status(400).json({ message: 'Contract not yet sent for signature' });
      }
      
      // Send reminder via Signable
      const { signableService } = await import('./services/signableService');
      await signableService.sendReminder(contract.signableEnvelopeId);
      
      // Also resend notifications
      const lead = await storage.getLead(contract.leadId);
      if (lead && contract.tenantSigningUrl) {
        const workflowService = new (await import('./services/workflowAutomation')).WorkflowAutomationService();
        await workflowService.sendSigningNotification(lead, contract.tenantSigningUrl);
      }
      
      safeLog('Signature reminder sent', {
        contractId: contract.id,
        envelopeId: contract.signableEnvelopeId
      });
      
      res.json({ success: true, message: 'Reminder sent successfully' });
    } catch (error: any) {
      safeError('Error sending signature reminder', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get contract signature status
  app.get('/api/contracts/:id/signature-status', isAuthenticated, async (req: any, res) => {
    try {
      const contractId = req.params.id;
      const user = await getAuthenticatedUser(req);
      
      // Get contract
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
      
      // Verify access
      const property = await storage.getProperty(contract.propertyId);
      const lead = await storage.getLead(contract.leadId);
      const isLandlord = property?.landlordId === user.id;
      const isTenant = lead?.email === user.email;
      
      if (!isLandlord && !isTenant) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Get status from Signable if envelope exists
      let signableStatus = null;
      if (contract.signableEnvelopeId) {
        try {
          const { signableService } = await import('./services/signableService');
          signableStatus = await signableService.getEnvelopeStatus(contract.signableEnvelopeId);
        } catch (error) {
          console.error('Error getting Signable status:', error);
        }
      }
      
      res.json({
        contractId: contract.id,
        envelopeId: contract.signableEnvelopeId,
        tenantSignatureStatus: contract.tenantSignatureStatus,
        landlordSignatureStatus: contract.landlordSignatureStatus,
        tenantSignedAt: contract.tenantSignedAt,
        landlordSignedAt: contract.landlordSignedAt,
        fullyExecutedAt: contract.fullyExecutedAt,
        signedDocumentUrl: contract.signedDocumentUrl,
        signableStatus
      });
    } catch (error: any) {
      safeError('Error getting signature status', error);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // SIGNABLE WEBHOOK ENDPOINT
  // ============================================================================

  // Signable E-Signature Webhook
  app.post("/webhooks/signable", createIdempotentWebhookHandler(), async (req: any, res) => {
    try {
      // Verify webhook signature (HMAC-SHA256)
      const signature = req.headers['x-signable-signature'] || req.headers['x-webhook-signature'];
      
      if (signature) {
        const { signableService } = await import('./services/signableService');
        const payload = JSON.stringify(req.body);
        
        if (!signableService.validateWebhookSignature(payload, signature)) {
          safeLog('Invalid webhook signature - Signable', { 
            hasSignature: !!signature,
            ip: req.ip 
          });
          return res.status(401).json({ message: "Invalid signature" });
        }
        
        safeLog('Signable webhook signature validated');
      } else {
        safeLog('Signable webhook received without signature - proceeding');
      }

      // Log webhook event
      safeLog('Signable webhook received', { 
        event: req.body.event || req.body.action,
        envelopeId: req.body.envelope_id || req.body.envelopeId,
        status: req.body.envelope_status || req.body.status
      });

      // Process the webhook event
      const { signableService } = await import('./services/signableService');
      await signableService.handleWebhook(req.body);

      // Mark webhook as completed
      await markWebhookComplete(req);
      res.json({ status: "ok", received: true });
    } catch (error: any) {
      safeError('Signable webhook error', error);
      await markWebhookFailed(req, error.message);
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // N8N WEBHOOK ENDPOINTS
  // ============================================================================

  // n8n Webhook: Welcome Email
  app.post("/webhooks/n8n/emails/welcome", async (req, res) => {
    try {
      // Verify API key
      const apiKey = req.headers['x-api-key'];
      if (apiKey !== process.env.N8N_API_KEY) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { email, landlordName, trialEndDate, trialDays, features } = req.body;
      
      const html = generateWelcomeEmail({ landlordName, trialEndDate, trialDays, features });
      const sent = await emailService.sendEmail(email, "Welcome to TermFlow", html);
      
      await db.insert(emailEvents).values({
        eventType: "welcome",
        recipientEmail: email,
        recipientName: landlordName,
        subject: "Welcome to TermFlow",
        status: sent ? "sent" : "failed",
        metadata: { source: "n8n", landlordName, trialDays },
        renderedHtml: html,
      });
      
      res.status(202).json({ status: sent ? "sent" : "failed" });
    } catch (error) {
      console.error('n8n webhook error:', error);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  // ============================================================================
  // SEO: Sitemap XML
  // ============================================================================

  app.get('/sitemap.xml', async (req, res) => {
    try {
      const { generateSitemap } = await import('./sitemap');
      const sitemap = generateSitemap();
      
      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error: any) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // ============================================================================
  // TEXT-TO-SPEECH API (Voice Conversation)
  // ============================================================================

  app.post('/api/tts', isAuthenticated, async (req: any, res) => {
    try {
      const { text, voice = 'fable' } = req.body;

      if (!text) {
        return res.status(400).json({ message: 'Text is required' });
      }

      const openai = (await import('openai')).default;
      const client = new openai({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Generate speech using OpenAI TTS
      const mp3 = await client.audio.speech.create({
        model: 'tts-1',
        voice: voice, // fable = male British voice
        input: text,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length,
      });

      res.send(buffer);
    } catch (error: any) {
      console.error('TTS error:', error);
      res.status(500).json({ message: 'Failed to generate speech' });
    }
  });

  // ============================================================================
  // CONVERSATION STRATEGIES SEED (A/B Testing Setup)
  // ============================================================================

  app.post('/api/strategies/seed', isAuthenticated, async (req: any, res) => {
    try {
      const { STRATEGY_DEFINITIONS } = await import('./conversationStrategies');
      
      // Check if strategies already exist
      const existing = await storage.getAllStrategies();
      
      if (existing.length > 0) {
        return res.json({ 
          message: 'Strategies already seeded',
          count: existing.length,
          strategies: existing.map(s => ({ id: s.id, name: s.name, strategyType: s.strategyType }))
        });
      }
      
      // Insert all strategy definitions
      const seededStrategies = [];
      for (const strategyDef of STRATEGY_DEFINITIONS) {
        const strategy = await storage.createStrategy(strategyDef);
        seededStrategies.push({
          id: strategy.id,
          name: strategy.name,
          strategyType: strategy.strategyType,
          isActive: strategy.isActive,
          priority: strategy.priority,
        });
      }
      
      res.json({
        message: 'Successfully seeded conversation strategies',
        count: seededStrategies.length,
        strategies: seededStrategies,
      });
    } catch (error: any) {
      console.error('Strategy seed error:', error);
      res.status(500).json({ message: 'Failed to seed strategies', error: error.message });
    }
  });

  // Get all strategies (for admin/testing)
  app.get('/api/strategies', isAuthenticated, async (req: any, res) => {
    try {
      const strategies = await storage.getAllStrategies();
      res.json({ strategies });
    } catch (error: any) {
      console.error('Get strategies error:', error);
      res.status(500).json({ message: 'Failed to get strategies' });
    }
  });

  // ============================================================================
  // STRATEGY ANALYTICS & A/B TESTING
  // ============================================================================

  // Get all strategy performance metrics
  app.get('/api/analytics/strategy-performance', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      
      // Get all active strategies
      const strategies = await storage.getActiveStrategies();
      
      // Get latest performance for each strategy
      const performanceData = await Promise.all(
        strategies.map(async (strategy) => {
          const assignments = await storage.getAssignmentsByStrategy(strategy.id);
          const totalLeads = assignments.length;
          
          // Count conversions
          const contactsCaptured = await storage.countStrategyEventsByFunnelStage(strategy.id, 'contact_captured');
          const viewingsBooked = await storage.countStrategyEventsByFunnelStage(strategy.id, 'viewing_booked');
          const depositsPaid = await storage.countStrategyEventsByFunnelStage(strategy.id, 'deposit_paid');
          const contractsSigned = await storage.countStrategyEventsByFunnelStage(strategy.id, 'contract_signed');
          
          // Calculate rates
          const contactCaptureRate = totalLeads > 0 ? ((contactsCaptured / totalLeads) * 100).toFixed(1) : '0.0';
          const viewingRate = totalLeads > 0 ? ((viewingsBooked / totalLeads) * 100).toFixed(1) : '0.0';
          const depositRate = totalLeads > 0 ? ((depositsPaid / totalLeads) * 100).toFixed(1) : '0.0';
          const contractRate = totalLeads > 0 ? ((contractsSigned / totalLeads) * 100).toFixed(1) : '0.0';
          
          return {
            strategy,
            totalLeads,
            contactsCaptured,
            viewingsBooked,
            depositsPaid,
            contractsSigned,
            contactCaptureRate,
            viewingRate,
            depositRate,
            contractRate,
          };
        })
      );
      
      res.json(performanceData);
    } catch (error: any) {
      console.error('Strategy performance error:', error);
      res.status(500).json({ message: error.message, stack: error.stack });
    }
  });

  // Get rapport quality scores by strategy
  app.get('/api/analytics/strategy/:strategyId/rapport', isAuthenticated, async (req: any, res) => {
    try {
      const { strategyId } = req.params;
      const { rapportScoringService } = await import('./services/rapportScoring');
      
      const rapportAnalysis = await rapportScoringService.getStrategyRapportAnalysis(strategyId);
      res.json(rapportAnalysis);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get rapport score for a specific lead
  app.get('/api/analytics/lead/:leadId/rapport', isAuthenticated, async (req: any, res) => {
    try {
      const { leadId } = req.params;
      const { rapportScoringService } = await import('./services/rapportScoring');
      
      const rapportScore = await rapportScoringService.calculateRapportScore(leadId);
      
      if (!rapportScore) {
        return res.status(404).json({ message: 'No conversation data available for this lead' });
      }
      
      res.json(rapportScore);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Manually override strategy for a lead
  app.post('/api/analytics/strategy/:leadId/override', isAuthenticated, async (req: any, res) => {
    try {
      const { leadId } = req.params;
      const { strategyId } = req.body;
      
      if (!strategyId) {
        return res.status(400).json({ message: 'strategyId is required' });
      }
      
      // Verify lead exists
      const lead = await storage.getLead(leadId);
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      // Verify strategy exists
      const strategy = await storage.getStrategy(strategyId);
      if (!strategy) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      
      // Override strategy
      const { strategyAssignmentService } = await import('./services/strategyAssignment');
      await strategyAssignmentService.overrideStrategy(leadId, strategyId);
      
      res.json({ success: true, leadId, strategyId });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // TEMPLATE PERFORMANCE ANALYTICS (Thompson Sampling)
  // ============================================================================

  // Get template performance analytics with Thompson Sampling stats
  app.get('/api/analytics/template-performance', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const landlordId = user.id;
      
      // Get all templates
      const templates = await db.select().from(messageTemplateVariants);
      
      // For each template, get bandit stats across all cohorts
      const performance = await Promise.all(
        templates.map(async (template) => {
          // Get all bandit stats for this template
          const stats = await db.select()
            .from(templateBanditStats)
            .where(eq(templateBanditStats.templateId, template.id));
          
          // Get show events
          const showEvents = await db.select()
            .from(templateShowEvents)
            .where(eq(templateShowEvents.templateId, template.id));
          
          // Calculate aggregated metrics
          const totalShown = stats.reduce((sum, s) => sum + (s.shownCount || 0), 0);
          const totalReward = stats.reduce((sum, s) => sum + parseFloat(String(s.totalReward || 0)), 0);
          const avgAlpha = stats.length > 0 
            ? stats.reduce((sum, s) => sum + parseFloat(String(s.alpha || 1)), 0) / stats.length
            : 1;
          const avgBeta = stats.length > 0
            ? stats.reduce((sum, s) => sum + parseFloat(String(s.beta || 1)), 0) / stats.length
            : 1;
          
          // Calculate CTR estimate (alpha / (alpha + beta))
          const ctrEstimate = avgAlpha / (avgAlpha + avgBeta);
          
          // Count outcomes
          const clicked = showEvents.filter(e => e.outcome === 'clicked').length;
          const converted = showEvents.filter(e => e.outcome === 'converted').length;
          const ignored = showEvents.filter(e => e.outcome === 'ignored').length;
          
          return {
            template: {
              id: template.id,
              templateKey: template.templateKey,
              stage: template.stage,
              channel: template.channel,
              toneOrSubject: template.toneOrSubject,
              isActive: template.isActive,
            },
            metrics: {
              totalShown,
              totalReward,
              ctrEstimate: (ctrEstimate * 100).toFixed(2) + '%',
              clicked,
              converted,
              ignored,
              avgAlpha: avgAlpha.toFixed(2),
              avgBeta: avgBeta.toFixed(2),
            },
            cohorts: stats.map(s => ({
              cohortKey: s.cohortKey,
              shownCount: s.shownCount,
              totalReward: s.totalReward,
              alpha: s.alpha,
              beta: s.beta,
              ctr: (parseFloat(String(s.alpha)) / (parseFloat(String(s.alpha)) + parseFloat(String(s.beta))) * 100).toFixed(2) + '%',
            })),
          };
        })
      );
      
      // Sort by total shown (descending)
      performance.sort((a, b) => b.metrics.totalShown - a.metrics.totalShown);
      
      res.json(performance);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============================================================================
  // BLOG POST API (SEO Content Marketing)
  // ============================================================================

  // Get all published blog posts
  app.get('/api/blog/posts', async (req, res) => {
    try {
      const posts = await storage.getAllPublishedBlogPosts();
      res.json(posts);
    } catch (error: any) {
      console.error('Get blog posts error:', error);
      res.status(500).json({ message: 'Failed to get blog posts' });
    }
  });

  // Get blog posts by category
  app.get('/api/blog/posts/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const posts = await storage.getBlogPostsByCategory(category);
      res.json(posts);
    } catch (error: any) {
      console.error('Get blog posts by category error:', error);
      res.status(500).json({ message: 'Failed to get blog posts by category' });
    }
  });

  // Get single blog post by slug (public)
  app.get('/api/blog/posts/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      // Increment view count
      await storage.incrementBlogPostViews(post.id);
      
      res.json(post);
    } catch (error: any) {
      console.error('Get blog post error:', error);
      res.status(500).json({ message: 'Failed to get blog post' });
    }
  });

  // Create blog post (admin only - authenticated)
  app.post('/api/blog/posts', isAuthenticated, async (req: any, res) => {
    try {
      const user = await getAuthenticatedUser(req);
      const post = await storage.createBlogPost({
        ...req.body,
        authorId: user.id,
        authorName: `${user.firstName} ${user.lastName}` || 'TermFlow Team',
      });
      res.status(201).json(post);
    } catch (error: any) {
      console.error('Create blog post error:', error);
      res.status(500).json({ message: 'Failed to create blog post', error: error.message });
    }
  });

  // Update blog post (admin only - authenticated)
  app.patch('/api/blog/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const post = await storage.updateBlogPost(id, req.body);
      res.json(post);
    } catch (error: any) {
      console.error('Update blog post error:', error);
      res.status(500).json({ message: 'Failed to update blog post' });
    }
  });

  // Delete blog post (admin only - authenticated)
  app.delete('/api/blog/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBlogPost(id);
      res.json({ message: 'Blog post deleted successfully' });
    } catch (error: any) {
      console.error('Delete blog post error:', error);
      res.status(500).json({ message: 'Failed to delete blog post' });
    }
  });

  // Newsletter subscription endpoint (public)
  app.post('/api/newsletter', async (req, res) => {
    try {
      const { email } = req.body;

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
      }

      // In a production environment, you would save this to a database
      // For now, we'll just log it and return success
      safeLog('Newsletter subscription', { 
        email: hashPII(email),
        timestamp: new Date().toISOString() 
      });

      // TODO: Add to email marketing platform (e.g., Mailchimp, SendGrid, etc.)
      // await emailService.subscribeToNewsletter(email);

      res.status(200).json({ 
        success: true,
        message: 'Successfully subscribed to newsletter' 
      });
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      res.status(500).json({ message: 'Failed to subscribe to newsletter' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
