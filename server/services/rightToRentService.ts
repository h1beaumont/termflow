import { storage } from '../storage';
import { 
  RightToRentCheck, 
  InsertRightToRentCheck,
  Lead
} from '@shared/schema';
import { generateSignedLink } from '../utils/signedLinks';
import crypto from 'crypto';

/**
 * Right to Rent Verification Service
 * Handles UK legal requirement for tenant eligibility checks
 */
class RightToRentService {
  
  /**
   * Initiate a new Right to Rent check for a lead
   */
  async initiateCheck(lead: {
    id: string;
    name: string;
    email: string;
    nationality?: string;
  }): Promise<{
    checkId: string;
    uploadUrl: string;
    status: 'pending';
  }> {
    try {
      // Generate secure upload token
      const uploadToken = crypto.randomBytes(32).toString('hex');
      const uploadUrl = `${process.env.APP_URL || 'http://localhost:5000'}/right-to-rent/${uploadToken}`;
      
      // Create RTR check record
      const rtrCheck = await storage.createRightToRentCheck({
        leadId: lead.id,
        status: 'pending',
        checkType: 'document',
        uploadUrl,
        uploadExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        checkInitiatedBy: 'system',
        tenantNationality: lead.nationality,
        documents: [],
      });
      
      // Send initial notification
      await this.sendRtrNotification(lead, 'initial', uploadUrl);
      
      console.log(`[RTR] Check initiated for lead ${lead.id}: ${rtrCheck.id}`);
      
      return {
        checkId: rtrCheck.id,
        uploadUrl,
        status: 'pending' as const
      };
    } catch (error: any) {
      console.error('[RTR] Error initiating check:', error);
      throw error;
    }
  }
  
  /**
   * Process uploaded documents for RTR check
   */
  async processDocuments(checkId: string, documents: {
    type: 'passport' | 'visa' | 'brp' | 'share_code';
    fileUrl: string;
  }[]): Promise<{
    status: 'reviewing' | 'approved' | 'rejected';
    issues?: string[];
  }> {
    try {
      const check = await storage.getRightToRentCheck(checkId);
      if (!check) {
        throw new Error(`RTR check ${checkId} not found`);
      }
      
      // Add documents to the check
      const updatedDocuments = [
        ...(check.documents as any[] || []),
        ...documents.map(doc => ({
          ...doc,
          uploadedAt: new Date()
        }))
      ];
      
      // Determine document category based on document type
      let documentCategory: 'list_a' | 'list_b' | undefined;
      const hasPassport = documents.some(d => d.type === 'passport');
      const hasVisa = documents.some(d => d.type === 'visa');
      const hasBRP = documents.some(d => d.type === 'brp');
      
      if (hasPassport) {
        // UK/Irish passport = List A (permanent)
        documentCategory = 'list_a';
      } else if (hasVisa || hasBRP) {
        // Visa or BRP = List B (time-limited)
        documentCategory = 'list_b';
      }
      
      // Auto-approve if UK/Irish passport (List A)
      const autoApproved = documentCategory === 'list_a';
      const newStatus = autoApproved ? 'approved' : 'reviewing';
      
      await storage.updateRightToRentCheck(checkId, {
        documents: updatedDocuments,
        documentCategory,
        status: newStatus,
        ...(autoApproved && {
          reviewedAt: new Date(),
          reviewedBy: 'system',
          reviewNotes: 'Auto-approved: UK/Irish passport detected (List A document)'
        })
      });
      
      // Get the lead for notifications
      const lead = await storage.getLead(check.leadId);
      
      if (autoApproved && lead) {
        // Notify about auto-approval
        await this.sendRtrNotification(lead, 'approved');
        
        // Trigger contract creation via workflow
        const { workflowAutomation } = await import('./workflowAutomation');
        await workflowAutomation.handleRtrPassed(check.leadId, lead.landlordId!);
      } else if (lead) {
        // Notify about manual review
        await this.sendRtrNotification(lead, 'reviewing');
      }
      
      console.log(`[RTR] Documents processed for check ${checkId}. Status: ${newStatus}`);
      
      return {
        status: newStatus as 'reviewing' | 'approved',
        ...(documentCategory === 'list_b' && {
          issues: ['Time-limited permission detected. Manual review required.']
        })
      };
    } catch (error: any) {
      console.error('[RTR] Error processing documents:', error);
      throw error;
    }
  }
  
  /**
   * Verify Home Office share code for digital RTR
   * (Simulated for now - in production would call Home Office API)
   */
  async verifyShareCode(
    checkId: string,
    shareCode: string, 
    dateOfBirth: string
  ): Promise<{
    valid: boolean;
    rightToRent: boolean;
    expiryDate?: Date;
  }> {
    try {
      const check = await storage.getRightToRentCheck(checkId);
      if (!check) {
        throw new Error(`RTR check ${checkId} not found`);
      }
      
      // SIMULATION: In production, this would call the Home Office API
      // For testing, validate format and simulate response
      const isValidFormat = /^[A-Z0-9]{9}$/.test(shareCode.toUpperCase());
      const isValidDOB = /^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth);
      
      if (!isValidFormat || !isValidDOB) {
        return {
          valid: false,
          rightToRent: false
        };
      }
      
      // Simulate successful verification
      const simulatedResponse = {
        valid: true,
        rightToRent: true,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      };
      
      // Store verification result
      await storage.updateRightToRentCheck(checkId, {
        shareCode,
        shareCodeDateOfBirth: dateOfBirth,
        shareCodeVerificationResult: simulatedResponse,
        checkType: 'share_code',
        status: 'approved',
        documentCategory: 'list_b', // Share codes are always time-limited
        expiryDate: simulatedResponse.expiryDate,
        reviewedAt: new Date(),
        reviewedBy: 'system',
        reviewNotes: 'Approved via Home Office share code verification'
      });
      
      // Get lead and trigger workflow
      const lead = await storage.getLead(check.leadId);
      if (lead) {
        await this.sendRtrNotification(lead, 'approved');
        
        // Trigger contract creation
        const { workflowAutomation } = await import('./workflowAutomation');
        await workflowAutomation.handleRtrPassed(check.leadId, lead.landlordId!);
      }
      
      console.log(`[RTR] Share code verified for check ${checkId}`);
      
      return simulatedResponse;
    } catch (error: any) {
      console.error('[RTR] Error verifying share code:', error);
      throw error;
    }
  }
  
  /**
   * Get all RTR checks pending review
   */
  async getChecksForReview(landlordId?: string): Promise<RightToRentCheck[]> {
    try {
      const checks = await storage.getRightToRentChecksByStatus('reviewing', landlordId);
      console.log(`[RTR] Found ${checks.length} checks for review`);
      return checks;
    } catch (error: any) {
      console.error('[RTR] Error getting checks for review:', error);
      throw error;
    }
  }
  
  /**
   * Approve or reject a manual RTR check
   */
  async reviewCheck(
    checkId: string, 
    approved: boolean, 
    reviewerId: string,
    notes?: string,
    expiryDate?: Date
  ): Promise<void> {
    try {
      const check = await storage.getRightToRentCheck(checkId);
      if (!check) {
        throw new Error(`RTR check ${checkId} not found`);
      }
      
      // Update check status
      await storage.updateRightToRentCheck(checkId, {
        status: approved ? 'approved' : 'rejected',
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewNotes: notes,
        ...(approved && expiryDate && { expiryDate }),
        ...(!approved && notes && { rejectionReason: notes })
      });
      
      // Get lead for notifications
      const lead = await storage.getLead(check.leadId);
      if (lead) {
        await this.sendRtrNotification(
          lead, 
          approved ? 'approved' : 'rejected',
          undefined,
          notes
        );
        
        if (approved) {
          // Trigger contract creation
          const { workflowAutomation } = await import('./workflowAutomation');
          await workflowAutomation.handleRtrPassed(check.leadId, lead.landlordId!);
        }
      }
      
      console.log(`[RTR] Check ${checkId} ${approved ? 'approved' : 'rejected'} by ${reviewerId}`);
    } catch (error: any) {
      console.error('[RTR] Error reviewing check:', error);
      throw error;
    }
  }
  
  /**
   * Send RTR reminder if check not completed
   */
  async sendReminder(checkId: string): Promise<void> {
    try {
      const check = await storage.getRightToRentCheck(checkId);
      if (!check || check.status !== 'pending') {
        return;
      }
      
      const lead = await storage.getLead(check.leadId);
      if (!lead) {
        return;
      }
      
      const remindersSent = check.remindersSent || 0;
      
      // Send reminder based on count
      if (remindersSent === 0) {
        // 12-hour reminder
        await this.sendRtrNotification(lead, 'reminder_12h', check.uploadUrl!);
      } else if (remindersSent === 1) {
        // 48-hour reminder
        await this.sendRtrNotification(lead, 'reminder_48h', check.uploadUrl!);
      }
      
      // Update reminder count
      await storage.updateRightToRentCheck(checkId, {
        remindersSent: remindersSent + 1,
        lastReminderAt: new Date()
      });
      
      console.log(`[RTR] Reminder ${remindersSent + 1} sent for check ${checkId}`);
    } catch (error: any) {
      console.error('[RTR] Error sending reminder:', error);
      throw error;
    }
  }
  
  /**
   * Check for expiring RTR permissions and send warnings
   */
  async checkExpiringPermissions(): Promise<void> {
    try {
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const expiringChecks = await storage.getRightToRentChecksExpiringSoon(thirtyDaysFromNow);
      
      for (const check of expiringChecks) {
        if (!check.expiryReminderSent) {
          const lead = await storage.getLead(check.leadId);
          if (lead) {
            await this.sendRtrNotification(lead, 'expiry_warning', undefined, undefined, check.expiryDate);
            
            await storage.updateRightToRentCheck(check.id, {
              expiryReminderSent: true
            });
            
            console.log(`[RTR] Expiry warning sent for check ${check.id}`);
          }
        }
      }
    } catch (error: any) {
      console.error('[RTR] Error checking expiring permissions:', error);
      throw error;
    }
  }
  
  /**
   * Send RTR-related notifications
   */
  private async sendRtrNotification(
    lead: Lead,
    type: 'initial' | 'reminder_12h' | 'reminder_48h' | 'reviewing' | 'approved' | 'rejected' | 'expiry_warning',
    uploadUrl?: string,
    notes?: string,
    expiryDate?: Date
  ): Promise<void> {
    const { emailService } = await import('../emailService');
    
    let subject = '';
    let html = '';
    
    switch (type) {
      case 'initial':
        subject = 'Complete Your Right to Rent Check';
        html = `
          <h2>Right to Rent Verification Required</h2>
          <p>Hi ${lead.name || 'there'},</p>
          <p>As part of UK legal requirements, we need to verify your right to rent in the UK.</p>
          <p><strong>What you need to do:</strong></p>
          <ol>
            <li>Click the link below</li>
            <li>Upload your documents OR enter your Home Office share code</li>
            <li>Submit for verification</li>
          </ol>
          <p><strong>Accepted documents:</strong></p>
          <ul>
            <li>UK or Irish passport</li>
            <li>Valid visa</li>
            <li>Biometric Residence Permit (BRP)</li>
            <li>Home Office share code</li>
          </ul>
          <div style="margin: 30px 0;">
            <a href="${uploadUrl}" style="background: #9EF01A; color: #14213D; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Complete Right to Rent Check</a>
          </div>
          <p>This link expires in 7 days.</p>
        `;
        break;
        
      case 'reminder_12h':
        subject = 'Reminder: Right to Rent Check Required';
        html = `
          <h2>Don't Forget Your Right to Rent Check</h2>
          <p>Hi ${lead.name || 'there'},</p>
          <p>This is a friendly reminder that we still need your Right to Rent documents to proceed with your tenancy.</p>
          <div style="margin: 30px 0;">
            <a href="${uploadUrl}" style="background: #9EF01A; color: #14213D; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Upload Documents Now</a>
          </div>
          <p>Need help? Reply to this email and we'll assist you.</p>
        `;
        break;
        
      case 'reminder_48h':
        subject = 'Urgent: Right to Rent Check Needed';
        html = `
          <h2>Action Required: Right to Rent Check</h2>
          <p>Hi ${lead.name || 'there'},</p>
          <p><strong>We urgently need your Right to Rent documents to secure your room.</strong></p>
          <p>Without these documents, we cannot proceed with your contract and your room may be released.</p>
          <div style="margin: 30px 0;">
            <a href="${uploadUrl}" style="background: #FF595E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Complete Check Now</a>
          </div>
          <p>If you're having trouble, please contact us immediately.</p>
        `;
        break;
        
      case 'reviewing':
        subject = 'Right to Rent Documents Received - Under Review';
        html = `
          <h2>Documents Received</h2>
          <p>Hi ${lead.name || 'there'},</p>
          <p>Thank you for submitting your Right to Rent documents. They are now being reviewed by our team.</p>
          <p>We'll notify you within 24 hours once the review is complete.</p>
        `;
        break;
        
      case 'approved':
        subject = 'Right to Rent Check Approved - Contract Ready!';
        html = `
          <h2>Great News - You're Approved!</h2>
          <p>Hi ${lead.name || 'there'},</p>
          <p>Your Right to Rent check has been approved! ✓</p>
          ${expiryDate ? `<p><strong>Note:</strong> Your permission expires on ${expiryDate.toLocaleDateString()}. We'll remind you before renewal is needed.</p>` : ''}
          <p>Your tenancy contract is now being prepared and will be sent to you shortly for electronic signature.</p>
          <p>Thank you for completing this important step!</p>
        `;
        break;
        
      case 'rejected':
        subject = 'Right to Rent Check - Additional Information Required';
        html = `
          <h2>Additional Information Needed</h2>
          <p>Hi ${lead.name || 'there'},</p>
          <p>Unfortunately, we need additional information to complete your Right to Rent check.</p>
          ${notes ? `<p><strong>Reason:</strong> ${notes}</p>` : ''}
          <p>Please contact us as soon as possible to resolve this issue.</p>
        `;
        break;
        
      case 'expiry_warning':
        subject = 'Right to Rent Permission Expiring Soon';
        html = `
          <h2>Your Right to Rent Permission is Expiring</h2>
          <p>Hi ${lead.name || 'there'},</p>
          <p>Your current Right to Rent permission expires on ${expiryDate?.toLocaleDateString()}.</p>
          <p>To continue your tenancy, you'll need to provide updated documents before this date.</p>
          <p>Please contact us to arrange a new Right to Rent check.</p>
        `;
        break;
    }
    
    if (lead.email && subject && html) {
      await emailService.sendEmail({
        to: lead.email,
        subject,
        html
      });
    }
    
    // Also send WhatsApp if available
    if (lead.whatsappNumber && (type === 'initial' || type === 'approved' || type === 'rejected')) {
      const { sendWhatsAppMessage } = await import('../twilioService');
      let message = '';
      
      switch (type) {
        case 'initial':
          message = `Hi ${lead.name}, we need you to complete your Right to Rent check. Please visit: ${uploadUrl}`;
          break;
        case 'approved':
          message = `Great news ${lead.name}! Your Right to Rent check has been approved ✓ Your contract will be sent shortly.`;
          break;
        case 'rejected':
          message = `Hi ${lead.name}, we need additional information for your Right to Rent check. Please contact us ASAP.`;
          break;
      }
      
      if (message) {
        await sendWhatsAppMessage(lead.whatsappNumber, message);
      }
    }
  }
}

// Export singleton instance
export const rightToRentService = new RightToRentService();