import { storage } from '../storage';
import type { Lead, MoveInCoordination, InsertMoveInCoordination } from '@shared/schema';
import { emailService } from '../emailService';
import { addDays, format, isAfter, isBefore } from 'date-fns';
import PDFDocument from 'pdf-lib';
import { PDFDocument as PDFKit, rgb, StandardFonts } from 'pdf-lib';

/**
 * Move-in Coordination Service
 * Handles the final step of tenant onboarding after contract signing
 */
class MoveInService {
  
  /**
   * Schedule move-in after contract is fully executed
   */
  async scheduleMoveIn(params: {
    leadId: string;
    contractId: string;
    tenantName: string;
    tenantEmail: string;
    propertyAddress: string;
    moveInDate: Date;
    landlordId: string;
    propertyId?: string;
    roomId?: string;
    keyCollectionMethod?: 'office' | 'lockbox' | 'agent';
    keyCollectionDetails?: string;
    keyCollectionTime?: string;
  }): Promise<{
    moveInId: string;
    checklistUrl: string;
  }> {
    try {
      // Check if move-in already scheduled for this lead
      const existing = await storage.getMoveInByLead(params.leadId);
      if (existing) {
        console.log(`[MoveIn] Move-in already scheduled for lead ${params.leadId}`);
        return {
          moveInId: existing.id,
          checklistUrl: `/move-in-checklist?id=${existing.id}`,
        };
      }

      // Create move-in coordination record
      const moveIn = await storage.createMoveIn({
        leadId: params.leadId,
        landlordId: params.landlordId,
        contractId: params.contractId,
        propertyId: params.propertyId,
        roomId: params.roomId,
        moveInDate: params.moveInDate,
        keyCollectionMethod: params.keyCollectionMethod || 'office',
        keyCollectionDetails: params.keyCollectionDetails || 'Reception desk at property office',
        keyCollectionTime: params.keyCollectionTime || '09:00-17:00',
        checklistItems: this.getDefaultChecklistItems(params.moveInDate),
      });

      console.log(`[MoveIn] Move-in scheduled for ${format(params.moveInDate, 'yyyy-MM-dd')}: ${moveIn.id}`);

      // Schedule automated reminders
      await this.scheduleReminders(moveIn.id, params.moveInDate, params.tenantEmail);

      // Send initial confirmation email
      await this.sendMoveInConfirmation(moveIn.id, params.tenantEmail, params.tenantName);

      return {
        moveInId: moveIn.id,
        checklistUrl: `/move-in-checklist?id=${moveIn.id}`,
      };
    } catch (error: any) {
      console.error('[MoveIn] Error scheduling move-in:', error);
      throw error;
    }
  }

  /**
   * Get default checklist items for move-in
   */
  private getDefaultChecklistItems(moveInDate: Date) {
    return [
      {
        task: 'Set up utilities (electricity, gas, water)',
        completed: false,
        dueDate: addDays(moveInDate, -7),
      },
      {
        task: 'Arrange contents insurance',
        completed: false,
        dueDate: addDays(moveInDate, -5),
      },
      {
        task: 'Set up internet/broadband',
        completed: false,
        dueDate: addDays(moveInDate, -5),
      },
      {
        task: 'Register with local GP',
        completed: false,
        dueDate: addDays(moveInDate, 7),
      },
      {
        task: 'Update address with bank',
        completed: false,
        dueDate: addDays(moveInDate, 3),
      },
      {
        task: 'Prepare ID documents for key collection',
        completed: false,
        dueDate: addDays(moveInDate, -1),
      },
      {
        task: 'Review and sign inventory',
        completed: false,
        dueDate: moveInDate,
      },
      {
        task: 'Take meter readings',
        completed: false,
        dueDate: moveInDate,
      },
      {
        task: 'Test smoke alarms',
        completed: false,
        dueDate: moveInDate,
      },
      {
        task: 'Locate emergency exits',
        completed: false,
        dueDate: moveInDate,
      },
    ];
  }

  /**
   * Generate move-in checklist
   */
  async generateChecklist(leadId: string): Promise<{
    items: {
      task: string;
      completed: boolean;
      dueDate?: Date;
    }[]
  }> {
    const moveIn = await storage.getMoveInByLead(leadId);
    
    if (!moveIn) {
      throw new Error('Move-in not found for this lead');
    }

    return {
      items: moveIn.checklistItems as any || this.getDefaultChecklistItems(moveIn.moveInDate),
    };
  }

  /**
   * Update checklist item status
   */
  async updateChecklistItem(moveInId: string, itemIndex: number, completed: boolean): Promise<void> {
    const moveIn = await storage.getMoveIn(moveInId);
    
    if (!moveIn) {
      throw new Error('Move-in not found');
    }

    const items = (moveIn.checklistItems as any[]) || [];
    if (items[itemIndex]) {
      items[itemIndex].completed = completed;
      
      await storage.updateMoveIn(moveInId, {
        checklistItems: items,
      });

      console.log(`[MoveIn] Checklist item ${itemIndex} marked as ${completed ? 'completed' : 'pending'}`);
    }
  }

  /**
   * Send key collection details to tenant
   */
  async sendKeyCollectionInfo(moveInId: string): Promise<void> {
    const moveIn = await storage.getMoveIn(moveInId);
    
    if (!moveIn) {
      throw new Error('Move-in not found');
    }

    const lead = await storage.getLead(moveIn.leadId);
    
    if (!lead || !lead.email) {
      throw new Error('Lead not found or missing email');
    }

    const emailContent = `
      <h2>Key Collection Details</h2>
      <p>Dear ${lead.name || 'Tenant'},</p>
      
      <p>Your move-in date is approaching! Here are your key collection details:</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Collection Information</h3>
        <p><strong>Date:</strong> ${format(moveIn.moveInDate, 'EEEE, dd MMMM yyyy')}</p>
        <p><strong>Time:</strong> ${moveIn.keyCollectionTime || '09:00-17:00'}</p>
        <p><strong>Method:</strong> ${moveIn.keyCollectionMethod === 'office' ? 'Property Office' : 
                                       moveIn.keyCollectionMethod === 'lockbox' ? 'Lockbox' : 'Agent Meeting'}</p>
        <p><strong>Location/Details:</strong> ${moveIn.keyCollectionDetails || 'Reception desk at property office'}</p>
      </div>
      
      <h3>What to Bring:</h3>
      <ul>
        <li>Photo ID (passport or driving license)</li>
        <li>Signed tenancy agreement</li>
        <li>Proof of deposit payment</li>
        <li>Student ID (if applicable)</li>
      </ul>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>The Property Team</p>
    `;

    await emailService.sendEmail({
      to: lead.email,
      subject: 'Key Collection Details - 3 Days to Move-in',
      html: emailContent,
    });

    await storage.updateMoveIn(moveInId, {
      keyDetailsSent: true,
      keyDetailsSentAt: new Date(),
    });

    console.log(`[MoveIn] Key collection details sent to ${lead.email}`);
  }

  /**
   * Generate welcome pack PDF
   */
  async generateWelcomePack(leadId: string): Promise<Buffer> {
    const moveIn = await storage.getMoveInByLead(leadId);
    const lead = await storage.getLead(leadId);
    
    if (!moveIn || !lead) {
      throw new Error('Move-in or lead not found');
    }

    const property = moveIn.propertyId ? await storage.getProperty(moveIn.propertyId) : null;
    const room = moveIn.roomId ? await storage.getRoom(moveIn.roomId) : null;

    // Create a new PDF document
    const pdfDoc = await PDFKit.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPos = height - 50;

    // Title
    page.drawText('Welcome to Your New Home!', {
      x: 50,
      y: yPos,
      size: 24,
      font: boldFont,
      color: rgb(0.08, 0.13, 0.24), // Navy color
    });

    yPos -= 40;

    // Tenant name
    page.drawText(`Dear ${lead.name || 'Tenant'},`, {
      x: 50,
      y: yPos,
      size: 14,
      font: font,
      color: rgb(0, 0, 0),
    });

    yPos -= 30;

    // Property info
    page.drawText('Property Information', {
      x: 50,
      y: yPos,
      size: 18,
      font: boldFont,
      color: rgb(0.08, 0.13, 0.24),
    });

    yPos -= 25;
    
    if (property) {
      page.drawText(`Property: ${property.name}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPos -= 20;
      
      page.drawText(`Address: ${property.address}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPos -= 20;
    }

    if (room) {
      page.drawText(`Room: ${room.name}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPos -= 20;
    }

    // Important contacts
    yPos -= 20;
    page.drawText('Important Contacts', {
      x: 50,
      y: yPos,
      size: 18,
      font: boldFont,
      color: rgb(0.08, 0.13, 0.24),
    });

    yPos -= 25;
    
    const contacts = [
      { name: 'Property Office', number: '0115 123 4567', hours: 'Mon-Fri 9am-5pm' },
      { name: 'Emergency Maintenance', number: '0800 999 8888', hours: '24/7' },
      { name: 'Local Police', number: '101', hours: 'Non-emergency' },
      { name: 'NHS', number: '111', hours: 'Medical advice' },
    ];

    for (const contact of contacts) {
      page.drawText(`${contact.name}: ${contact.number} (${contact.hours})`, {
        x: 50,
        y: yPos,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPos -= 20;
    }

    // House rules
    yPos -= 20;
    page.drawText('House Rules', {
      x: 50,
      y: yPos,
      size: 18,
      font: boldFont,
      color: rgb(0.08, 0.13, 0.24),
    });

    yPos -= 25;
    
    const rules = [
      '• Quiet hours: 10pm - 8am',
      '• No smoking in the property',
      '• Guests must be registered at reception',
      '• Keep common areas clean and tidy',
      '• Report maintenance issues promptly',
    ];

    for (const rule of rules) {
      page.drawText(rule, {
        x: 50,
        y: yPos,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPos -= 20;
    }

    // Utilities information
    yPos -= 20;
    page.drawText('Utilities & Services', {
      x: 50,
      y: yPos,
      size: 18,
      font: boldFont,
      color: rgb(0.08, 0.13, 0.24),
    });

    yPos -= 25;
    
    const utilities = [
      '• WiFi Network: StudentHouse_5G',
      '• WiFi Password: Contact reception',
      '• Heating: Central heating, controlled via thermostat',
      '• Bins: Collection every Tuesday (recycling) and Friday (general)',
      '• Laundry: Ground floor, operated via app',
    ];

    for (const utility of utilities) {
      page.drawText(utility, {
        x: 50,
        y: yPos,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPos -= 20;
    }

    // Important dates
    yPos -= 20;
    page.drawText('Important Dates', {
      x: 50,
      y: yPos,
      size: 18,
      font: boldFont,
      color: rgb(0.08, 0.13, 0.24),
    });

    yPos -= 25;
    
    page.drawText(`Move-in Date: ${format(moveIn.moveInDate, 'dd MMMM yyyy')}`, {
      x: 50,
      y: yPos,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
    yPos -= 20;
    
    page.drawText('Rent Due: 1st of each month', {
      x: 50,
      y: yPos,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
    yPos -= 20;

    // Save and return the PDF
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  /**
   * Send welcome pack to tenant
   */
  async sendWelcomePack(moveInId: string): Promise<void> {
    const moveIn = await storage.getMoveIn(moveInId);
    
    if (!moveIn) {
      throw new Error('Move-in not found');
    }

    const lead = await storage.getLead(moveIn.leadId);
    
    if (!lead || !lead.email) {
      throw new Error('Lead not found or missing email');
    }

    // Generate the welcome pack PDF
    const welcomePackPdf = await this.generateWelcomePack(moveIn.leadId);

    // For now, we'll just mark it as sent. In production, you'd upload to storage and send the link
    // const welcomePackUrl = await uploadToStorage(welcomePackPdf, `welcome-pack-${moveIn.id}.pdf`);

    const emailContent = `
      <h2>Welcome to Your New Home!</h2>
      <p>Dear ${lead.name || 'Tenant'},</p>
      
      <p>We're excited to welcome you to your new home tomorrow!</p>
      
      <p>Attached is your welcome pack containing all the important information you'll need:</p>
      
      <ul>
        <li>Property guide and house rules</li>
        <li>Emergency contacts</li>
        <li>WiFi and utilities information</li>
        <li>Local area guide</li>
        <li>Important dates and reminders</li>
      </ul>
      
      <p><strong>Remember to bring tomorrow:</strong></p>
      <ul>
        <li>Photo ID</li>
        <li>Signed tenancy agreement</li>
        <li>Proof of deposit payment</li>
      </ul>
      
      <p>We look forward to meeting you!</p>
      
      <p>Best regards,<br>The Property Team</p>
    `;

    await emailService.sendEmail({
      to: lead.email,
      subject: 'Welcome Pack - Moving in Tomorrow!',
      html: emailContent,
      // attachments: [{ filename: 'welcome-pack.pdf', content: welcomePackPdf }],
    });

    await storage.updateMoveIn(moveInId, {
      welcomePackSent: true,
      welcomePackSentAt: new Date(),
      // welcomePackUrl: welcomePackUrl,
    });

    console.log(`[MoveIn] Welcome pack sent to ${lead.email}`);
  }

  /**
   * Mark move-in as complete
   */
  async completeMoveIn(moveInId: string): Promise<void> {
    const moveIn = await storage.getMoveIn(moveInId);
    
    if (!moveIn) {
      throw new Error('Move-in not found');
    }

    await storage.updateMoveIn(moveInId, {
      moveInCompleted: true,
      moveInCompletedAt: new Date(),
    });

    // Update lead status to completed
    await storage.updateLead(moveIn.leadId, {
      stage: 'completed',
    });

    console.log(`[MoveIn] Move-in completed for ${moveInId}`);

    // Send feedback request after 24 hours
    setTimeout(async () => {
      await this.sendFeedbackRequest(moveInId);
    }, 24 * 60 * 60 * 1000);
  }

  /**
   * Send move-in confirmation email
   */
  private async sendMoveInConfirmation(moveInId: string, tenantEmail: string, tenantName: string): Promise<void> {
    const moveIn = await storage.getMoveIn(moveInId);
    
    if (!moveIn) return;

    const emailContent = `
      <h2>Move-in Scheduled Successfully!</h2>
      <p>Dear ${tenantName},</p>
      
      <p>Your move-in has been scheduled for <strong>${format(moveIn.moveInDate, 'EEEE, dd MMMM yyyy')}</strong>.</p>
      
      <p>We'll send you:</p>
      <ul>
        <li>Move-in checklist (7 days before)</li>
        <li>Key collection details (3 days before)</li>
        <li>Welcome pack (1 day before)</li>
        <li>Move-in day reminder (on the day)</li>
      </ul>
      
      <p>You can view your move-in checklist at any time here:<br>
      <a href="${process.env.VITE_APP_URL}/move-in-checklist?id=${moveInId}" style="color: #9EF01A;">View Checklist</a></p>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>The Property Team</p>
    `;

    await emailService.sendEmail({
      to: tenantEmail,
      subject: 'Move-in Scheduled - Important Information',
      html: emailContent,
    });

    console.log(`[MoveIn] Confirmation email sent to ${tenantEmail}`);
  }

  /**
   * Schedule automated reminders for move-in
   */
  private async scheduleReminders(moveInId: string, moveInDate: Date, tenantEmail: string): Promise<void> {
    const now = new Date();
    
    // 7 days before: Send checklist
    const checklistDate = addDays(moveInDate, -7);
    if (isAfter(checklistDate, now)) {
      setTimeout(async () => {
        await this.sendChecklist(moveInId);
      }, checklistDate.getTime() - now.getTime());
    }

    // 3 days before: Send key collection details
    const keyDetailsDate = addDays(moveInDate, -3);
    if (isAfter(keyDetailsDate, now)) {
      setTimeout(async () => {
        await this.sendKeyCollectionInfo(moveInId);
      }, keyDetailsDate.getTime() - now.getTime());
    }

    // 1 day before: Send welcome pack
    const welcomePackDate = addDays(moveInDate, -1);
    if (isAfter(welcomePackDate, now)) {
      setTimeout(async () => {
        await this.sendWelcomePack(moveInId);
      }, welcomePackDate.getTime() - now.getTime());
    }

    // Day of: Send reminder
    if (isAfter(moveInDate, now)) {
      setTimeout(async () => {
        await this.sendMoveInDayReminder(moveInId);
      }, moveInDate.getTime() - now.getTime());
    }

    // Day after: Send inventory form
    const inventoryDate = addDays(moveInDate, 1);
    if (isAfter(inventoryDate, now)) {
      setTimeout(async () => {
        await this.sendInventoryForm(moveInId);
      }, inventoryDate.getTime() - now.getTime());
    }

    console.log(`[MoveIn] Reminders scheduled for move-in ${moveInId}`);
  }

  /**
   * Send move-in checklist
   */
  private async sendChecklist(moveInId: string): Promise<void> {
    const moveIn = await storage.getMoveIn(moveInId);
    const lead = moveIn ? await storage.getLead(moveIn.leadId) : null;
    
    if (!moveIn || !lead || !lead.email) return;

    const emailContent = `
      <h2>Move-in Checklist - 7 Days to Go!</h2>
      <p>Dear ${lead.name || 'Tenant'},</p>
      
      <p>Your move-in date is approaching! Here's your checklist to ensure a smooth move:</p>
      
      <h3>Before Move-in Day:</h3>
      <ul>
        <li>☐ Set up utilities (electricity, gas, water)</li>
        <li>☐ Arrange contents insurance</li>
        <li>☐ Set up internet/broadband</li>
        <li>☐ Prepare documents for key collection</li>
        <li>☐ Pack essentials for first night</li>
      </ul>
      
      <h3>On Move-in Day:</h3>
      <ul>
        <li>☐ Collect keys (bring ID and signed contract)</li>
        <li>☐ Check inventory thoroughly</li>
        <li>☐ Take meter readings</li>
        <li>☐ Test all appliances</li>
        <li>☐ Locate emergency exits and fire extinguishers</li>
      </ul>
      
      <p><a href="${process.env.VITE_APP_URL}/move-in-checklist?id=${moveInId}" style="color: #9EF01A;">View Full Interactive Checklist</a></p>
      
      <p>Best regards,<br>The Property Team</p>
    `;

    await emailService.sendEmail({
      to: lead.email,
      subject: 'Move-in Checklist - 7 Days to Go!',
      html: emailContent,
    });

    await storage.updateMoveIn(moveInId, {
      checklistSent: true,
      checklistSentAt: new Date(),
    });

    console.log(`[MoveIn] Checklist sent to ${lead.email}`);
  }

  /**
   * Send move-in day reminder
   */
  private async sendMoveInDayReminder(moveInId: string): Promise<void> {
    const moveIn = await storage.getMoveIn(moveInId);
    const lead = moveIn ? await storage.getLead(moveIn.leadId) : null;
    
    if (!moveIn || !lead || !lead.email) return;

    const emailContent = `
      <h2>Today's the Day - Welcome Home!</h2>
      <p>Dear ${lead.name || 'Tenant'},</p>
      
      <p>Today is your move-in day! Here's a quick reminder:</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Key Collection</h3>
        <p><strong>Time:</strong> ${moveIn.keyCollectionTime || '09:00-17:00'}</p>
        <p><strong>Location:</strong> ${moveIn.keyCollectionDetails || 'Property office reception'}</p>
        <p><strong>Don't forget:</strong> Photo ID, signed contract, deposit proof</p>
      </div>
      
      <p>Our team is ready to welcome you. If you have any issues, call us on 0115 123 4567.</p>
      
      <p>Best regards,<br>The Property Team</p>
    `;

    await emailService.sendEmail({
      to: lead.email,
      subject: "Today's the Day - Welcome Home!",
      html: emailContent,
    });

    console.log(`[MoveIn] Move-in day reminder sent to ${lead.email}`);
  }

  /**
   * Send inventory form
   */
  private async sendInventoryForm(moveInId: string): Promise<void> {
    const moveIn = await storage.getMoveIn(moveInId);
    const lead = moveIn ? await storage.getLead(moveIn.leadId) : null;
    
    if (!moveIn || !lead || !lead.email) return;

    const emailContent = `
      <h2>Property Inventory - Please Review</h2>
      <p>Dear ${lead.name || 'Tenant'},</p>
      
      <p>Welcome to your new home! Please complete the property inventory within 7 days.</p>
      
      <p>The inventory documents the condition of your room/property at the start of your tenancy. This protects both you and the landlord.</p>
      
      <h3>What to do:</h3>
      <ol>
        <li>Check each item on the inventory list</li>
        <li>Note any existing damage or issues</li>
        <li>Take photos for your records</li>
        <li>Sign and return within 7 days</li>
      </ol>
      
      <p><a href="${process.env.VITE_APP_URL}/inventory?moveIn=${moveInId}" style="color: #9EF01A;">Complete Inventory Online</a></p>
      
      <p>If you notice any issues not listed, please report them immediately.</p>
      
      <p>Best regards,<br>The Property Team</p>
    `;

    await emailService.sendEmail({
      to: lead.email,
      subject: 'Property Inventory - Action Required',
      html: emailContent,
    });

    await storage.updateMoveIn(moveInId, {
      inventorySent: true,
      inventorySentAt: new Date(),
    });

    console.log(`[MoveIn] Inventory form sent to ${lead.email}`);
  }

  /**
   * Send feedback request
   */
  private async sendFeedbackRequest(moveInId: string): Promise<void> {
    const moveIn = await storage.getMoveIn(moveInId);
    const lead = moveIn ? await storage.getLead(moveIn.leadId) : null;
    
    if (!moveIn || !lead || !lead.email) return;

    const emailContent = `
      <h2>How Was Your Move-in Experience?</h2>
      <p>Dear ${lead.name || 'Tenant'},</p>
      
      <p>We hope you're settling in well! We'd love to hear about your move-in experience.</p>
      
      <p>Your feedback helps us improve our service for future tenants.</p>
      
      <p><a href="${process.env.VITE_APP_URL}/feedback?moveIn=${moveInId}" style="color: #9EF01A;">Share Your Feedback</a></p>
      
      <p>It only takes 2 minutes!</p>
      
      <p>Thank you for choosing to live with us.</p>
      
      <p>Best regards,<br>The Property Team</p>
    `;

    await emailService.sendEmail({
      to: lead.email,
      subject: 'How Was Your Move-in Experience?',
      html: emailContent,
    });

    console.log(`[MoveIn] Feedback request sent to ${lead.email}`);
  }

  /**
   * Get upcoming move-ins for landlord
   */
  async getUpcomingMoveIns(landlordId: string, days: number = 30): Promise<MoveInCoordination[]> {
    const moveIns = await storage.getUpcomingMoveIns(landlordId, days);
    return moveIns;
  }

  /**
   * Process move-in timeline automation
   * Called by scheduler to handle time-based actions
   */
  async processMoveInAutomation(): Promise<void> {
    try {
      const now = new Date();
      
      // Get all pending move-ins
      const moveIns = await storage.getPendingMoveIns();
      
      for (const moveIn of moveIns) {
        const daysUntilMoveIn = Math.ceil((moveIn.moveInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // 7 days before: Send checklist
        if (daysUntilMoveIn === 7 && !moveIn.checklistSent) {
          await this.sendChecklist(moveIn.id);
        }
        
        // 3 days before: Send key details
        if (daysUntilMoveIn === 3 && !moveIn.keyDetailsSent) {
          await this.sendKeyCollectionInfo(moveIn.id);
        }
        
        // 1 day before: Send welcome pack
        if (daysUntilMoveIn === 1 && !moveIn.welcomePackSent) {
          await this.sendWelcomePack(moveIn.id);
        }
        
        // Day of move-in
        if (daysUntilMoveIn === 0 && !moveIn.moveInCompleted) {
          await this.sendMoveInDayReminder(moveIn.id);
        }
        
        // Day after: Send inventory
        if (daysUntilMoveIn === -1 && !moveIn.inventorySent) {
          await this.sendInventoryForm(moveIn.id);
        }
      }
      
      console.log(`[MoveIn] Processed ${moveIns.length} pending move-ins`);
    } catch (error: any) {
      console.error('[MoveIn] Error processing automation:', error);
    }
  }
}

export const moveInService = new MoveInService();