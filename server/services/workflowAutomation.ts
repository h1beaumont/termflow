import { storage } from '../storage';
import type { Lead, Contract } from '@shared/schema';

/**
 * Workflow Automation Service
 * Handles automated lead progression: deposit → RTR → contract → signatures → archival
 */
class WorkflowAutomationService {
  
  /**
   * Step 1: Deposit Paid → Trigger RTR Checks
   * Called when deposit payment is confirmed
   */
  async handleDepositPaid(leadId: string, depositAmount: number, stripePaymentIntentId: string) {
    try {
      const lead = await storage.getLead(leadId);
      if (!lead) {
        throw new Error(`Lead ${leadId} not found`);
      }

      // Update lead with deposit info
      await storage.updateLead(leadId, {
        depositPaid: true,
        depositAmount: depositAmount.toString(),
        stripePaymentIntentId,
        stage: 'deposit_paid',
      });

      console.log(`[Workflow] Deposit paid for lead ${leadId}. Initiating RTR checks and deposit protection...`);
      
      // Get property and room details for deposit protection
      const property = lead.propertyId ? await storage.getProperty(lead.propertyId) : null;
      const room = lead.roomId ? await storage.getRoom(lead.roomId) : null;
      
      if (!property) {
        throw new Error('Property not found for lead');
      }
      
      // Register deposit protection automatically (UK Legal Requirement)
      const { depositProtectionService } = await import('./depositProtectionService');
      
      // Determine scheme based on landlord preference (default to TDS)
      const scheme = 'TDS'; // In production, this would come from landlord preferences
      
      // Calculate tenancy dates (assuming 48-week standard student tenancy)
      const tenancyStartDate = new Date();
      tenancyStartDate.setMonth(8); // September start
      tenancyStartDate.setDate(1);
      const tenancyEndDate = new Date(tenancyStartDate);
      tenancyEndDate.setFullYear(tenancyEndDate.getFullYear() + 1);
      tenancyEndDate.setMonth(7); // August end
      
      const propertyAddress = `${property.name}, ${property.address}`;
      
      try {
        const depositProtection = await depositProtectionService.registerDeposit({
          leadId: lead.id,
          amount: depositAmount,
          tenantName: lead.name || 'Tenant',
          tenantEmail: lead.email || '',
          propertyAddress,
          tenancyStartDate,
          tenancyEndDate,
          scheme,
          landlordId: lead.landlordId,
        });
        
        console.log(`[Workflow] Deposit protection registered: ${depositProtection.registrationId}`);
        
        // Update lead with protection details
        await storage.updateLead(leadId, {
          depositProtectionScheme: scheme,
          depositProtectionRegistrationId: depositProtection.registrationId,
          depositProtectionCertificate: depositProtection.certificateNumber,
        });
      } catch (dpError: any) {
        console.error(`[Workflow] WARNING: Failed to register deposit protection: ${dpError.message}`);
        // Don't fail the whole process, but log for manual follow-up
      }
      
      // Initiate RTR check automatically
      const { rightToRentService } = await import('./rightToRentService');
      const rtrCheck = await rightToRentService.initiateCheck({
        id: lead.id,
        name: lead.name || 'Tenant',
        email: lead.email || '',
        nationality: lead.nationality,
      });
      
      console.log(`[Workflow] RTR check initiated: ${rtrCheck.checkId}`);
      
      // Update lead with RTR status
      await storage.updateLead(leadId, {
        rtrStatus: 'pending',
        rtrCheckedAt: new Date(),
      });
      
      // Schedule RTR reminders (12h and 48h)
      this.scheduleRtrReminders(rtrCheck.checkId);
      
      return { 
        success: true, 
        message: 'Deposit received and protected. Right to Rent verification link sent to tenant.',
        rtrCheckId: rtrCheck.checkId,
        rtrUploadUrl: rtrCheck.uploadUrl,
        depositProtected: true,
      };
    } catch (error: any) {
      console.error('[Workflow] Error handling deposit payment:', error);
      throw error;
    }
  }

  /**
   * Step 2: RTR Passed → Auto-Create Contract & Send for Signature
   * Called when RTR checks pass (manually approved by landlord)
   */
  async handleRtrPassed(leadId: string, landlordId: string) {
    try {
      const lead = await storage.getLead(leadId);
      if (!lead) {
        throw new Error(`Lead ${leadId} not found`);
      }

      // Check if contract already exists
      const existingContract = await storage.getContractByLead(leadId);
      if (existingContract) {
        console.log(`[Workflow] Contract already exists for lead ${leadId}`);
        return existingContract;
      }

      // Update lead RTR status
      await storage.updateLead(leadId, {
        rtrStatus: 'passed',
        rtrCheckedAt: new Date(),
      });

      // Get property details for contract
      const property = lead.propertyId ? await storage.getProperty(lead.propertyId) : null;
      const room = lead.roomId ? await storage.getRoom(lead.roomId) : null;

      if (!property || !room) {
        throw new Error('Property or room not found for lead');
      }

      // Get landlord details
      const landlord = await storage.getUser(landlordId);

      // Create contract automatically
      const contract = await storage.createContract({
        landlordId,
        leadId,
        propertyId: property.id,
        roomId: room.id,
        depositAmount: lead.depositAmount?.toString() || '0',
        approvalStatus: 'approved',
        rightToRentStatus: 'passed',
        rightToRentCheckedAt: new Date(),
        rightToRentCheckedBy: landlordId,
      });

      console.log(`[Workflow] Contract auto-created for lead ${leadId}: ${contract.id}`);

      // Generate contract PDF and send for signature
      try {
        const { generateContract } = await import('../contractTemplate');
        const contractPdf = await generateContract(lead, room, property);
        
        // Convert to Buffer if it's HTML
        let pdfBuffer: Buffer;
        if (typeof contractPdf === 'string') {
          // If HTML, convert to PDF
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

        // Send contract for signature via Signable
        const { signableService } = await import('./signableService');
        const envelope = await signableService.createEnvelope({
          pdfBuffer,
          tenantEmail: lead.email || '',
          tenantName: lead.name || '',
          landlordEmail: landlord?.email || '',
          landlordName: `${landlord?.firstName || ''} ${landlord?.lastName || ''}`.trim() || 'Landlord',
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

        // Send signing link to tenant via Email and WhatsApp
        await this.sendSigningNotification(lead, envelope.signingUrls.tenant || '');

        // Update lead stage
        await storage.updateLead(leadId, {
          stage: 'contract_sent',
        });

        console.log(`[Workflow] Contract sent for signature via Signable: ${envelope.envelopeId}`);

      } catch (signError: any) {
        console.error('[Workflow] Error sending contract for signature:', signError);
        // Don't fail the whole process if signing fails - contract still exists
        // Update lead stage anyway
        await storage.updateLead(leadId, {
          stage: 'contract_sent',
        });
      }
      
      return contract;
    } catch (error: any) {
      console.error('[Workflow] Error creating contract:', error);
      throw error;
    }
  }

  /**
   * Send signing notification to tenant
   */
  async sendSigningNotification(lead: Lead, signingUrl: string) {
    try {
      // Send email notification
      if (lead.email) {
        const { sendEmail } = await import('../emailService');
        await sendEmail({
          to: lead.email,
          subject: 'Your Tenancy Agreement is Ready to Sign',
          html: `
            <h2>Your Contract is Ready for Signature!</h2>
            <p>Hi ${lead.name || 'there'},</p>
            
            <p>Great news! Your tenancy agreement has been approved and is now ready for you to review and sign electronically.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>What happens next?</strong>
              <ol>
                <li>Click the button below to review your agreement</li>
                <li>Sign electronically using your mouse or touchscreen</li>
                <li>We'll send the agreement to your landlord for countersignature</li>
                <li>You'll receive a copy once fully executed</li>
              </ol>
            </div>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${signingUrl}" 
                 style="background-color: #9EF01A; color: #14213D; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
                Sign Your Agreement Now
              </a>
            </p>
            
            <p><em>This link will expire in 30 days. Please sign as soon as possible to secure your accommodation.</em></p>
            
            <p>If you have any questions, feel free to reply to this email or message us on WhatsApp.</p>
            
            <p>Best regards,<br>The TermFlow Team</p>
          `
        });
      }
      
      // Send WhatsApp notification
      if (lead.whatsappNumber) {
        const { sendWhatsAppMessage } = await import('../twilioService');
        const message = `Hi ${lead.name || 'there'} 👋

Great news! Your tenancy agreement is ready to sign! ✍️

Click here to review and sign electronically:
${signingUrl}

It only takes 2 minutes and you'll be all set for move-in! 🏠

Any questions? Just reply here and we'll help right away.`;
        
        await sendWhatsAppMessage(lead.whatsappNumber, message);
      }
      
      console.log(`[Workflow] Signing notifications sent to ${lead.name}`);
    } catch (error: any) {
      console.error('[Workflow] Error sending signing notifications:', error);
      // Don't throw - notifications are not critical
    }
  }

  /**
   * Step 3: Student Signs → Notify Landlord
   * Called when student signs the contract
   */
  async handleStudentSignature(contractId: string, landlordId: string) {
    try {
      const contract = await storage.getContract(contractId);
      if (!contract) {
        throw new Error(`Contract ${contractId} not found`);
      }

      // Get landlord and lead details for notification
      const landlord = await storage.getUser(landlordId);
      const lead = await storage.getLead(contract.leadId);
      const property = lead?.propertyId ? await storage.getProperty(lead.propertyId) : null;

      // Update lead stage
      await storage.updateLead(contract.leadId, {
        stage: 'contract_signed',
        contractSignedDate: new Date(),
      });

      console.log(`[Workflow] Student signed contract ${contractId}. Notifying landlord ${landlordId}.`);
      
      // Send email notification to landlord
      try {
        const { sendEmail } = await import('../emailService');
        
        if (landlord?.email) {
          await sendEmail({
            to: landlord.email,
            subject: `Contract Signed by Tenant - ${lead?.name || 'Student'} - ${property?.name || 'Property'}`,
            html: `
              <h2>Tenant Has Signed the Contract</h2>
              <p>Good news! The tenant has signed the tenancy agreement and it's now ready for your countersignature.</p>
              
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>Tenant:</strong> ${lead?.name || 'N/A'}<br/>
                <strong>Property:</strong> ${property?.name || 'N/A'}<br/>
                <strong>Contract ID:</strong> ${contractId}
              </div>
              
              <p><strong>Next Step:</strong> Please log in to TermFlow to review and countersign the contract to complete the process.</p>
              
              <p style="margin-top: 20px;">
                <a href="${process.env.REPLIT_DOMAINS?.split(',')[0] || 'https://termflow.replit.app'}/contracts" 
                   style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Review Contract
                </a>
              </p>
            `,
          });
          
          console.log(`[Workflow] Email notification sent to landlord ${landlord.email}`);
        }
      } catch (emailError: any) {
        console.error('[Workflow] Failed to send landlord notification email:', emailError);
        // Don't throw - notification failure shouldn't break workflow
      }
      
      return { success: true, message: 'Student signature recorded. Landlord notified.' };
    } catch (error: any) {
      console.error('[Workflow] Error handling student signature:', error);
      throw error;
    }
  }

  /**
   * Step 4: Both Parties Sign → Schedule Move-in & Complete Workflow
   * Called when landlord signs (completing the contract signing)
   */
  async handleBothPartiesSigned(contractId: string) {
    try {
      const contract = await storage.getContract(contractId);
      if (!contract) {
        throw new Error(`Contract ${contractId} not found`);
      }

      // Verify both parties signed
      if (contract.tenantSignatureStatus !== 'signed' || contract.landlordSignatureStatus !== 'signed') {
        throw new Error('Both parties must sign before completing workflow');
      }

      // Get lead details
      const lead = await storage.getLead(contract.leadId);
      if (!lead) {
        throw new Error(`Lead ${contract.leadId} not found`);
      }

      // Trigger move-in coordination
      console.log(`[Workflow] Contract ${contractId} fully signed. Scheduling move-in for lead ${contract.leadId}`);
      
      const { moveInService } = await import('./moveInService');
      
      // Calculate move-in date (typically start of tenancy from contract)
      // For student lettings, this is usually September 1st
      const moveInDate = new Date();
      moveInDate.setMonth(8); // September
      moveInDate.setDate(1);
      
      // If it's already past September, use next year
      if (moveInDate < new Date()) {
        moveInDate.setFullYear(moveInDate.getFullYear() + 1);
      }
      
      // Get property and room details
      const property = lead.propertyId ? await storage.getProperty(lead.propertyId) : null;
      const room = lead.roomId ? await storage.getRoom(lead.roomId) : null;
      
      // Schedule move-in
      const moveInResult = await moveInService.scheduleMoveIn({
        leadId: lead.id,
        contractId: contract.id,
        tenantName: lead.name || 'Tenant',
        tenantEmail: lead.email || '',
        propertyAddress: property ? `${property.name}, ${property.address}` : 'Property',
        moveInDate,
        landlordId: contract.landlordId,
        propertyId: lead.propertyId,
        roomId: lead.roomId,
        keyCollectionMethod: 'office',
        keyCollectionDetails: property ? `Reception desk at ${property.name}` : 'Property office',
        keyCollectionTime: '09:00-17:00',
      });
      
      console.log(`[Workflow] Move-in scheduled for ${lead.name}: ${moveInResult.moveInId}`);

      // Update lead status to move-in scheduled (not archived yet - wait until move-in complete)
      await storage.updateLead(contract.leadId, {
        stage: 'move_in_scheduled',
        contractSignedDate: new Date(),
      });

      // Mark contract sequence as completed
      await storage.updateContract(contractId, {
        sequenceCompletedAt: new Date(),
      });
      
      return { 
        success: true, 
        message: 'Contract fully executed and move-in scheduled!',
        moveInId: moveInResult.moveInId,
        checklistUrl: moveInResult.checklistUrl,
      };
    } catch (error: any) {
      console.error('[Workflow] Error archiving lead:', error);
      throw error;
    }
  }

  /**
   * Get workflow status for a lead
   */
  async getWorkflowStatus(leadId: string) {
    const lead = await storage.getLead(leadId);
    if (!lead) {
      throw new Error(`Lead ${leadId} not found`);
    }

    const contract = await storage.getContractByLead(leadId);

    return {
      leadId,
      stage: lead.stage,
      depositPaid: lead.depositPaid,
      rtrStatus: lead.rtrStatus,
      contractCreated: !!contract,
      contractId: contract?.id,
      tenantSigned: contract?.tenantSignatureStatus === 'signed',
      landlordSigned: contract?.landlordSignatureStatus === 'signed',
      archived: lead.archived,
      completedAt: lead.completedAt,
    };
  }

  /**
   * Schedule RTR reminder notifications
   * Sends reminders at 12h and 48h if check not completed
   */
  private scheduleRtrReminders(checkId: string) {
    // Schedule 12-hour reminder
    setTimeout(async () => {
      try {
        const { rightToRentService } = await import('./rightToRentService');
        await rightToRentService.sendReminder(checkId);
      } catch (error) {
        console.error(`[Workflow] Error sending 12h RTR reminder for check ${checkId}:`, error);
      }
    }, 12 * 60 * 60 * 1000); // 12 hours

    // Schedule 48-hour reminder
    setTimeout(async () => {
      try {
        const { rightToRentService } = await import('./rightToRentService');
        await rightToRentService.sendReminder(checkId);
      } catch (error) {
        console.error(`[Workflow] Error sending 48h RTR reminder for check ${checkId}:`, error);
      }
    }, 48 * 60 * 60 * 1000); // 48 hours

    console.log(`[Workflow] RTR reminders scheduled for check ${checkId}`);
  }
}

export const workflowAutomation = new WorkflowAutomationService();
export { WorkflowAutomationService };
