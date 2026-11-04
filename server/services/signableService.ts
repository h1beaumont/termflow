// Signable E-Signature Service for Automated Contract Signing
import { PDFDocument } from 'pdf-lib';
import { objectStorageClient, parseObjectPath } from '../objectStorage';
import { storage } from '../storage';
import type { Contract, Lead } from '@shared/schema';
import crypto from 'crypto';

interface SigningParty {
  email: string;
  name: string;
  role: 'tenant' | 'landlord' | 'guarantor';
}

interface CreateEnvelopeParams {
  pdfBuffer: Buffer;
  tenantEmail: string;
  tenantName: string;
  landlordEmail?: string;
  landlordName?: string;
  guarantorEmail?: string;
  guarantorName?: string;
  contractId?: string;
}

interface EnvelopeResponse {
  envelopeId: string;
  signingUrls: {
    tenant?: string;
    landlord?: string;
    guarantor?: string;
  };
}

interface EnvelopeStatus {
  status: 'pending' | 'signed' | 'declined' | 'expired' | 'completed';
  signedDocument?: Buffer;
  signedAt?: Date;
  signedBy?: string[];
}

interface SignableWebhookEvent {
  event: 'envelope_sent' | 'envelope_signed' | 'envelope_declined' | 'envelope_completed' | 'party_signed';
  envelope_id: string;
  envelope_status: string;
  party_email?: string;
  party_name?: string;
  timestamp: string;
  download_url?: string;
}

class SignableService {
  private readonly apiKey: string;
  private readonly apiUrl: string = 'https://api.signable.co.uk/v1';
  private readonly maxRetries: number = 3;
  private readonly retryDelay: number = 1000; // 1 second
  
  constructor() {
    if (!process.env.SIGNABLE_API_KEY) {
      throw new Error('SIGNABLE_API_KEY not configured');
    }
    this.apiKey = process.env.SIGNABLE_API_KEY;
  }

  /**
   * Execute API request with retry logic
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    retries: number = this.maxRetries
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && (error.message?.includes('network') || error.message?.includes('timeout'))) {
        console.log(`[Signable] Retrying request, ${retries} attempts remaining...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.executeWithRetry(fn, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Create and send contract for signature
   */
  async createEnvelope(params: CreateEnvelopeParams): Promise<EnvelopeResponse> {
    return this.executeWithRetry(async () => {
      try {
        console.log('[Signable] Creating envelope for contract');
        
        // Convert PDF to base64
        const pdfBase64 = params.pdfBuffer.toString('base64');
        
        // Prepare signing parties with correct API structure
        const parties: any[] = [];
        
        // Tenant is always required
        parties.push({
          name: params.tenantName,
          email: params.tenantEmail,
          role: 'tenant',
          signature_request: {
            delivery_method: 'link',
            redirect_url: `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'https://termflow.replit.app'}/contracts/signing-complete`
          }
        });
        
        // Add landlord if provided
        if (params.landlordEmail && params.landlordName) {
          parties.push({
            name: params.landlordName,
            email: params.landlordEmail,
            role: 'landlord',
            signature_request: {
              delivery_method: 'link',
              redirect_url: `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'https://termflow.replit.app'}/contracts/signing-complete`
            }
          });
        }
        
        // Add guarantor if needed (for instalment payments)
        if (params.guarantorEmail && params.guarantorName) {
          parties.push({
            name: params.guarantorName,
            email: params.guarantorEmail,
            role: 'guarantor',
            signature_request: {
              delivery_method: 'link',
              redirect_url: `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'https://termflow.replit.app'}/contracts/signing-complete`
            }
          });
        }
        
        // Create envelope with Signable API
        const envelopeData = {
          title: `Tenancy Agreement - ${params.tenantName}`,
          message: 'Please sign your tenancy agreement',
          documents: [
            {
              title: 'Contract',
              file_content: pdfBase64,
              file_name: 'contract.pdf'
            }
          ],
          parties,
          merge_fields: [], // For field population if needed
          settings: {
            reminder_days: 2,
            expire_days: 30,
            allow_decline: true,
            allow_reassign: false,
            embedded_signing: true
          }
        };
        
        console.log('[Signable] Sending create envelope request');
        
        const response = await fetch(`${this.apiUrl}/envelopes`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(envelopeData)
        });
        
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          console.log(`[Signable] Rate limited. Retry after ${retryAfter} seconds`);
          throw new Error('Rate limited by Signable API');
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorDetails;
          try {
            errorDetails = JSON.parse(errorText);
          } catch {
            errorDetails = { message: errorText };
          }
          console.error('[Signable] API error response:', errorDetails);
          throw new Error(`Signable API error: ${response.status} - ${errorDetails.message || errorText}`);
        }
        
        const result = await response.json();
        
        // Log the response structure for debugging
        console.log('[Signable] Envelope created response:', JSON.stringify(result, null, 2));
        
        // Extract signing URLs for each party
        const signingUrls: any = {};
        if (result.parties) {
          result.parties.forEach((party: any) => {
            const role = party.role?.toLowerCase();
            const signingUrl = party.signature_request?.signing_url || party.signing_url;
            
            if (role === 'tenant' && signingUrl) {
              signingUrls.tenant = signingUrl;
            } else if (role === 'landlord' && signingUrl) {
              signingUrls.landlord = signingUrl;
            } else if (role === 'guarantor' && signingUrl) {
              signingUrls.guarantor = signingUrl;
            }
          });
        }
        
        console.log('[Signable] Envelope created successfully:', result.id || result.envelope_id);
        
        return {
          envelopeId: result.id || result.envelope_id,
          signingUrls
        };
      } catch (error: any) {
        console.error('[Signable] Error creating envelope:', error);
        throw error;
      }
    });
  }

  /**
   * Get envelope status and download signed document if complete
   */
  async getEnvelopeStatus(envelopeId: string): Promise<EnvelopeStatus> {
    return this.executeWithRetry(async () => {
      try {
        console.log('[Signable] Getting envelope status:', envelopeId);
        
        const response = await fetch(`${this.apiUrl}/envelopes/${envelopeId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json'
          }
        });
        
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          console.log(`[Signable] Rate limited. Retry after ${retryAfter} seconds`);
          throw new Error('Rate limited by Signable API');
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorDetails;
          try {
            errorDetails = JSON.parse(errorText);
          } catch {
            errorDetails = { message: errorText };
          }
          console.error('[Signable] API error response:', errorDetails);
          throw new Error(`Signable API error: ${response.status} - ${errorDetails.message || errorText}`);
        }
        
        const envelope = await response.json();
        
        // Log the envelope structure for debugging
        console.log('[Signable] Envelope status response:', JSON.stringify(envelope, null, 2));
        
        // Map Signable status to our status
        let status: EnvelopeStatus['status'] = 'pending';
        const envelopeStatus = envelope.status || envelope.envelope_status;
        
        switch (envelopeStatus?.toLowerCase()) {
          case 'draft':
          case 'sent':
          case 'delivered':
          case 'opened':
            status = 'pending';
            break;
          case 'signed':
          case 'partial':
            status = 'signed';
            break;
          case 'completed':
          case 'complete':
            status = 'completed';
            break;
          case 'declined':
          case 'rejected':
            status = 'declined';
            break;
          case 'expired':
          case 'voided':
          case 'cancelled':
            status = 'expired';
            break;
        }
        
        // Download signed document if completed
        let signedDocument: Buffer | undefined;
        if (status === 'completed' && envelope.documents && envelope.documents.length > 0) {
          const docId = envelope.documents[0].id || envelope.documents[0].document_id;
          if (docId) {
            signedDocument = await this.downloadSignedDocument(envelopeId, docId);
          }
        }
        
        // Get list of who has signed
        const signedBy: string[] = [];
        if (envelope.parties) {
          envelope.parties.forEach((party: any) => {
            const partyStatus = party.status || party.party_status;
            if (partyStatus === 'signed' || partyStatus === 'completed') {
              signedBy.push(party.email || party.party_email);
            }
          });
        }
        
        return {
          status,
          signedDocument,
          signedAt: envelope.completed_at ? new Date(envelope.completed_at) : undefined,
          signedBy
        };
      } catch (error: any) {
        console.error('[Signable] Error getting envelope status:', error);
        throw error;
      }
    });
  }

  /**
   * Cancel/void an envelope
   */
  async cancelEnvelope(envelopeId: string): Promise<void> {
    return this.executeWithRetry(async () => {
      try {
        console.log('[Signable] Cancelling envelope:', envelopeId);
        
        const response = await fetch(`${this.apiUrl}/envelopes/${envelopeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json'
          }
        });
        
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          console.log(`[Signable] Rate limited. Retry after ${retryAfter} seconds`);
          throw new Error('Rate limited by Signable API');
        }
        
        // 204 No Content is a success response for DELETE
        if (response.status === 204) {
          console.log('[Signable] Envelope cancelled successfully:', envelopeId);
          return;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorDetails;
          try {
            errorDetails = JSON.parse(errorText);
          } catch {
            errorDetails = { message: errorText };
          }
          console.error('[Signable] API error response:', errorDetails);
          throw new Error(`Signable API error: ${response.status} - ${errorDetails.message || errorText}`);
        }
        
        console.log('[Signable] Envelope cancelled successfully:', envelopeId);
      } catch (error: any) {
        console.error('[Signable] Error cancelling envelope:', error);
        throw error;
      }
    });
  }

  /**
   * Send reminder for unsigned envelope
   */
  async sendReminder(envelopeId: string): Promise<void> {
    return this.executeWithRetry(async () => {
      try {
        console.log('[Signable] Sending reminder for envelope:', envelopeId);
        
        const response = await fetch(`${this.apiUrl}/envelopes/${envelopeId}/remind`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json'
          }
        });
        
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          console.log(`[Signable] Rate limited. Retry after ${retryAfter} seconds`);
          throw new Error('Rate limited by Signable API');
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorDetails;
          try {
            errorDetails = JSON.parse(errorText);
          } catch {
            errorDetails = { message: errorText };
          }
          console.error('[Signable] API error response:', errorDetails);
          throw new Error(`Signable API error: ${response.status} - ${errorDetails.message || errorText}`);
        }
        
        console.log('[Signable] Reminder sent successfully:', envelopeId);
      } catch (error: any) {
        console.error('[Signable] Error sending reminder:', error);
        throw error;
      }
    });
  }

  /**
   * Download signed document from Signable
   */
  private async downloadSignedDocument(envelopeId: string, documentId: string): Promise<Buffer> {
    return this.executeWithRetry(async () => {
      try {
        console.log(`[Signable] Downloading signed document: envelope=${envelopeId}, doc=${documentId}`);
        
        const response = await fetch(`${this.apiUrl}/envelopes/${envelopeId}/documents/${documentId}/download`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/pdf'
          }
        });
        
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          console.log(`[Signable] Rate limited. Retry after ${retryAfter} seconds`);
          throw new Error('Rate limited by Signable API');
        }
        
        if (!response.ok) {
          throw new Error(`Failed to download signed document: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        console.log(`[Signable] Downloaded document size: ${arrayBuffer.byteLength} bytes`);
        return Buffer.from(arrayBuffer);
      } catch (error: any) {
        console.error('[Signable] Error downloading signed document:', error);
        throw error;
      }
    });
  }

  /**
   * Store signed document in object storage
   */
  async storeSignedDocument(contractId: string, pdfBuffer: Buffer): Promise<string> {
    try {
      const fileName = `signed-contracts/${contractId}_signed_${Date.now()}.pdf`;
      const privateDir = process.env.PRIVATE_OBJECT_DIR || '/replit-objstore-d33f4229-e880-4815-a9ef-fdb66b2a30e4/.private';
      const filePath = `${privateDir}/${fileName}`;
      
      // Upload to object storage using objectStorageClient
      const { bucketName, objectName } = parseObjectPath(filePath);
      const bucket = objectStorageClient.bucket(bucketName);
      const fileRef = bucket.file(objectName);
      
      await fileRef.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf',
          uploadedAt: new Date().toISOString(),
          contractId: contractId,
        },
      });
      
      // Make the file private
      await fileRef.makePrivate();
      
      console.log('[Signable] Signed document stored:', filePath);
      return filePath;
    } catch (error) {
      console.error('[Signable] Error storing signed document:', error);
      throw error;
    }
  }

  /**
   * Validate webhook signature using HMAC-SHA256
   */
  validateWebhookSignature(payload: string, signature: string): boolean {
    if (!process.env.SIGNABLE_WEBHOOK_SECRET) {
      console.warn('[Signable] SIGNABLE_WEBHOOK_SECRET not configured, skipping signature validation');
      return true; // Skip validation if secret not configured
    }
    
    try {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.SIGNABLE_WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');
      
      // Use timing-safe comparison
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('[Signable] Error validating webhook signature:', error);
      return false;
    }
  }

  /**
   * Handle webhook event from Signable
   */
  async handleWebhook(event: SignableWebhookEvent): Promise<void> {
    try {
      console.log('[Signable] Processing webhook event:', event.event, 'for envelope:', event.envelope_id);
      
      // Map different webhook event formats from Signable
      const eventType = event.event?.toLowerCase() || '';
      const envelopeId = event.envelope_id || event.envelopeId || '';
      
      if (!envelopeId) {
        console.warn('[Signable] No envelope ID in webhook event');
        return;
      }
      
      // Find contract by envelope ID
      const contract = await storage.getContractByEnvelopeId(envelopeId);
      if (!contract) {
        console.warn('[Signable] Contract not found for envelope:', envelopeId);
        return;
      }
      
      // Handle different event types (handle variations in event naming)
      switch (eventType) {
        case 'envelope_sent':
        case 'sent':
          console.log('[Signable] Envelope sent to parties');
          break;
          
        case 'party_signed':
        case 'envelope_signed':
        case 'signed':
          await this.handlePartySigned(contract, event);
          break;
          
        case 'envelope_completed':
        case 'completed':
        case 'complete':
          await this.handleEnvelopeCompleted(contract, event);
          break;
          
        case 'envelope_declined':
        case 'declined':
        case 'rejected':
          await this.handleEnvelopeDeclined(contract, event);
          break;
          
        case 'envelope_expired':
        case 'expired':
        case 'voided':
        case 'cancelled':
          await this.handleEnvelopeExpired(contract, event);
          break;
          
        default:
          console.log('[Signable] Unhandled webhook event type:', eventType);
      }
    } catch (error) {
      console.error('[Signable] Error handling webhook:', error);
      throw error;
    }
  }

  /**
   * Handle party signed event
   */
  private async handlePartySigned(contract: Contract, event: SignableWebhookEvent): Promise<void> {
    console.log(`[Signable] Party signed: ${event.party_email} for contract ${contract.id}`);
    
    // Update contract with signature information
    const updates: any = {};
    
    // Check if it's the tenant signing
    const lead = await storage.getLead(contract.leadId);
    if (lead && lead.email === event.party_email) {
      updates.tenantSignedAt = new Date();
      
      // Notify landlord that tenant has signed
      const { handleStudentSignature } = await import('../services/workflowAutomation');
      const workflowService = new handleStudentSignature();
      await workflowService.handleStudentSignature(contract.id, contract.landlordId);
    }
    
    // Check if it's the landlord signing
    const landlord = await storage.getUser(contract.landlordId);
    if (landlord && landlord.email === event.party_email) {
      updates.landlordSignedAt = new Date();
    }
    
    // Update contract
    if (Object.keys(updates).length > 0) {
      await storage.updateContract(contract.id, updates);
    }
  }

  /**
   * Handle envelope completed (fully signed)
   */
  private async handleEnvelopeCompleted(contract: Contract, event: SignableWebhookEvent): Promise<void> {
    console.log(`[Signable] Envelope completed for contract ${contract.id}`);
    
    try {
      // Download the signed document
      if (event.download_url) {
        const signedPdf = await this.downloadSignedDocument(event.download_url);
        
        // Store in object storage
        const signedDocUrl = await this.storeSignedDocument(contract.id, signedPdf);
        
        // Update contract
        await storage.updateContract(contract.id, {
          signedDocumentUrl: signedDocUrl,
          fullyExecutedAt: new Date(),
          approvalStatus: 'signed'
        });
        
        // Update lead status to completed
        await storage.updateLead(contract.leadId, {
          stage: 'completed',
          contractSignedDate: new Date()
        });
        
        // Send confirmation emails
        await this.sendCompletionNotifications(contract);
      }
    } catch (error) {
      console.error('[Signable] Error handling envelope completion:', error);
      throw error;
    }
  }

  /**
   * Handle envelope declined
   */
  private async handleEnvelopeDeclined(contract: Contract, event: SignableWebhookEvent): Promise<void> {
    console.log(`[Signable] Envelope declined for contract ${contract.id}`);
    
    // Update contract status
    await storage.updateContract(contract.id, {
      approvalStatus: 'rejected',
      rejectionReason: `Document declined by ${event.party_email || 'party'}`
    });
    
    // Update lead status
    await storage.updateLead(contract.leadId, {
      stage: 'lost',
      lostReason: 'Contract declined'
    });
  }

  /**
   * Handle envelope expired
   */
  private async handleEnvelopeExpired(contract: Contract, event: SignableWebhookEvent): Promise<void> {
    console.log(`[Signable] Envelope expired for contract ${contract.id}`);
    
    // Update contract status
    await storage.updateContract(contract.id, {
      approvalStatus: 'expired'
    });
    
    // Could trigger a re-send or notification here
  }

  /**
   * Send completion notifications
   */
  private async sendCompletionNotifications(contract: Contract): Promise<void> {
    try {
      const lead = await storage.getLead(contract.leadId);
      const landlord = await storage.getUser(contract.landlordId);
      const property = await storage.getProperty(contract.propertyId);
      
      const { sendEmail } = await import('../emailService');
      
      // Send to tenant
      if (lead?.email) {
        await sendEmail({
          to: lead.email,
          subject: `Contract Fully Executed - ${property?.name || 'Your Tenancy'}`,
          html: `
            <h2>Your Tenancy Agreement is Complete!</h2>
            <p>Great news! Your tenancy agreement has been fully executed by all parties.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Property:</strong> ${property?.name || 'N/A'}<br/>
              <strong>Move-in Date:</strong> ${lead.moveInDate ? new Date(lead.moveInDate).toLocaleDateString() : 'TBC'}
            </div>
            
            <p>Your signed contract has been securely stored and you can access it anytime from your tenant portal.</p>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Complete any remaining payments</li>
              <li>Prepare for your move-in date</li>
              <li>Review the tenant handbook</li>
            </ul>
          `
        });
      }
      
      // Send to landlord
      if (landlord?.email) {
        await sendEmail({
          to: landlord.email,
          subject: `Contract Fully Executed - ${lead?.name || 'Tenant'} - ${property?.name || 'Property'}`,
          html: `
            <h2>Tenancy Agreement Fully Executed</h2>
            <p>The tenancy agreement has been fully signed by all parties.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Tenant:</strong> ${lead?.name || 'N/A'}<br/>
              <strong>Property:</strong> ${property?.name || 'N/A'}<br/>
              <strong>Contract ID:</strong> ${contract.id}
            </div>
            
            <p>The signed document has been stored securely and is available in your dashboard.</p>
            
            <p style="margin-top: 20px;">
              <a href="${process.env.REPLIT_DOMAINS?.split(',')[0] || 'https://termflow.replit.app'}/contracts" 
                 style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Contract
              </a>
            </p>
          `
        });
      }
    } catch (error) {
      console.error('[Signable] Error sending completion notifications:', error);
      // Don't throw - notifications are not critical
    }
  }
}

// Export singleton instance
export const signableService = new SignableService();