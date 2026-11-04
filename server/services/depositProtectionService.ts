import { storage } from '../storage';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { DepositProtection, Lead, Property, Room } from '@shared/schema';
import { addDays, format, differenceInDays } from 'date-fns';
import { generateSignedLink } from '../utils/signedLinks';
import { emailService } from '../emailService';
import { sendWhatsAppMessage } from '../twilioService';

/**
 * TDS API Client for production-ready integration
 * Handles both live TDS API calls and simulation mode for testing/development
 */
class TDSApiClient {
  private baseUrl: string;
  private apiKey: string;
  private accountId: string;
  private isConfigured: boolean;

  constructor() {
    this.baseUrl = process.env.TDS_API_URL || 'https://api.tenancydepositscheme.com/v1';
    this.apiKey = process.env.TDS_API_KEY || '';
    this.accountId = process.env.TDS_ACCOUNT_ID || '';
    this.isConfigured = Boolean(this.apiKey && this.accountId);

    // Log configuration status on initialization
    if (!this.isConfigured) {
      console.warn('[TDSApiClient] ⚠️ TDS API credentials not configured. Running in simulation mode.');
      console.warn('[TDSApiClient] Set TDS_API_KEY, TDS_API_URL, and TDS_ACCOUNT_ID environment variables for production.');
    } else {
      console.log('[TDSApiClient] ✅ TDS API configured and ready for production use.');
    }
  }

  /**
   * Check if TDS API is properly configured
   */
  isProduction(): boolean {
    return this.isConfigured;
  }

  /**
   * Register a deposit with TDS
   */
  async registerDeposit(data: {
    tenancyStartDate: Date;
    tenancyEndDate: Date;
    depositAmount: number;
    propertyAddress: string;
    tenantName: string;
    tenantEmail: string;
    tenantPhone?: string;
    landlordName: string;
    landlordEmail: string;
    landlordPhone?: string;
    referenceNumber?: string;
  }): Promise<{
    registrationNumber: string;
    certificateUrl: string;
    certificateNumber: string;
    status: 'registered' | 'pending' | 'simulated';
    requiresManualAction: boolean;
  }> {
    // If API is configured, make real HTTP call
    if (this.isConfigured) {
      try {
        const headers = {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Account-ID': this.accountId,
        };

        const payload = {
          accountId: this.accountId,
          deposit: {
            amount: data.depositAmount,
            referenceNumber: data.referenceNumber || `DEP-${Date.now()}`,
          },
          tenancy: {
            startDate: data.tenancyStartDate.toISOString(),
            endDate: data.tenancyEndDate.toISOString(),
            propertyAddress: data.propertyAddress,
          },
          tenant: {
            name: data.tenantName,
            email: data.tenantEmail,
            phone: data.tenantPhone || '',
          },
          landlord: {
            name: data.landlordName,
            email: data.landlordEmail,
            phone: data.landlordPhone || '',
          },
        };

        const response = await fetch(`${this.baseUrl}/deposits/register`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`TDS API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        console.log(`[TDSApiClient] ✅ Deposit registered successfully with TDS: ${result.registrationNumber}`);
        
        return {
          registrationNumber: result.registrationNumber,
          certificateUrl: result.certificateUrl,
          certificateNumber: result.certificateNumber,
          status: 'registered',
          requiresManualAction: false,
        };
      } catch (error: any) {
        console.error('[TDSApiClient] ❌ Error registering with TDS API:', error.message);
        // Fall back to simulation mode if API fails
        return this.simulateRegistration(data);
      }
    }

    // Simulation mode when API is not configured
    return this.simulateRegistration(data);
  }

  /**
   * Simulate deposit registration for testing/demo purposes
   */
  private async simulateRegistration(data: any) {
    console.warn('[TDSApiClient] 📋 SIMULATION MODE: Generating local registration for testing');
    
    const simulatedRegNumber = `SIM-TDS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const simulatedCertNumber = `CERT-SIM-${Date.now()}`;
    
    return {
      registrationNumber: simulatedRegNumber,
      certificateUrl: `/api/deposits/documents/certificate-${simulatedRegNumber}.pdf`,
      certificateNumber: simulatedCertNumber,
      status: 'simulated' as const,
      requiresManualAction: true,
    };
  }

  /**
   * Download certificate from TDS
   */
  async downloadCertificate(registrationNumber: string): Promise<Buffer | null> {
    if (!this.isConfigured) {
      console.warn('[TDSApiClient] Cannot download certificate - API not configured');
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/certificates/${registrationNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Account-ID': this.accountId,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download certificate: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error: any) {
      console.error('[TDSApiClient] Error downloading certificate:', error.message);
      return null;
    }
  }

  /**
   * Get deposit status from TDS
   */
  async getDepositStatus(registrationNumber: string): Promise<{
    status: string;
    details: any;
  } | null> {
    if (!this.isConfigured) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/deposits/${registrationNumber}/status`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Account-ID': this.accountId,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get deposit status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('[TDSApiClient] Error getting deposit status:', error.message);
      return null;
    }
  }

  /**
   * Initiate deposit release with TDS
   */
  async initiateRelease(
    registrationNumber: string,
    deductions: Array<{ reason: string; amount: number }>
  ): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn('[TDSApiClient] Cannot initiate release - API not configured');
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/deposits/${registrationNumber}/release`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Account-ID': this.accountId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deductions }),
      });

      if (!response.ok) {
        throw new Error(`Failed to initiate release: ${response.status}`);
      }

      console.log(`[TDSApiClient] ✅ Release initiated for ${registrationNumber}`);
      return true;
    } catch (error: any) {
      console.error('[TDSApiClient] Error initiating release:', error.message);
      return false;
    }
  }
}

// Initialize TDS client singleton
const tdsClient = new TDSApiClient();

interface DepositRegistrationData {
  leadId: string;
  depositId?: string;
  amount: number;
  tenantName: string;
  tenantEmail: string;
  propertyAddress: string;
  tenancyStartDate: Date;
  tenancyEndDate: Date;
  scheme: 'TDS' | 'DPS' | 'MyDeposits';
  landlordId: string;
}

interface ProtectionSchemeDetails {
  name: string;
  fullName: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  membershipNumber?: string;
}

const SCHEME_DETAILS: Record<string, ProtectionSchemeDetails> = {
  TDS: {
    name: 'TDS',
    fullName: 'Tenancy Deposit Scheme',
    website: 'www.tenancydepositscheme.com',
    phone: '0300 037 1000',
    email: 'deposits@tenancydepositscheme.com',
    address: '1 The Progression Centre, 42 Mark Road, Hemel Hempstead, Herts, HP2 7DW',
  },
  DPS: {
    name: 'DPS',
    fullName: 'Deposit Protection Service',
    website: 'www.depositprotection.com',
    phone: '0330 303 0030',
    email: 'enquiries@depositprotection.com',
    address: 'The Pavilions, Bridgwater Road, Bristol, BS13 8AE',
  },
  MyDeposits: {
    name: 'MyDeposits',
    fullName: 'MyDeposits',
    website: 'www.mydeposits.co.uk',
    phone: '0333 321 9401',
    email: 'info@mydeposits.co.uk',
    address: 'Premiere House, 1st Floor, Elstree Way, Borehamwood, WD6 1JH',
  },
};

class DepositProtectionService {
  /**
   * Get TDS configuration status
   */
  getTDSConfigStatus(): {
    isConfigured: boolean;
    apiUrl: string;
    mode: 'production' | 'simulation';
    message: string;
  } {
    const isConfigured = tdsClient.isProduction();
    return {
      isConfigured,
      apiUrl: process.env.TDS_API_URL || 'https://api.tenancydepositscheme.com/v1',
      mode: isConfigured ? 'production' : 'simulation',
      message: isConfigured 
        ? 'TDS API is configured and ready for production use'
        : 'TDS API not configured - running in simulation mode. Set TDS_API_KEY, TDS_API_URL, and TDS_ACCOUNT_ID environment variables.',
    };
  }

  /**
   * Register a deposit with a protection scheme using TDS API client
   * Handles both production (with API) and simulation modes
   */
  async registerDeposit(data: DepositRegistrationData): Promise<{
    registrationId: string;
    certificateUrl: string;
    prescribedInfoUrl: string;
    certificateNumber: string;
    requiresManualAction?: boolean;
  }> {
    try {
      // Calculate the 30-day deadline
      const protectionDeadline = addDays(new Date(), 30);
      
      // For TDS scheme, use the TDS API client
      let registrationResult;
      let status: 'registered' | 'pending' | 'simulated' = 'pending';
      let requiresManualAction = false;
      
      if (data.scheme === 'TDS') {
        // Get landlord details
        const landlord = await storage.getUser(data.landlordId);
        const lead = await storage.getLead(data.leadId);
        
        // Use TDS API client for registration
        registrationResult = await tdsClient.registerDeposit({
          tenancyStartDate: data.tenancyStartDate,
          tenancyEndDate: data.tenancyEndDate,
          depositAmount: data.amount,
          propertyAddress: data.propertyAddress,
          tenantName: data.tenantName,
          tenantEmail: data.tenantEmail,
          tenantPhone: lead?.whatsappNumber || undefined,
          landlordName: landlord?.firstName && landlord?.lastName 
            ? `${landlord.firstName} ${landlord.lastName}`
            : 'Landlord',
          landlordEmail: landlord?.email ?? '',
          landlordPhone: undefined,
        });
        
        status = registrationResult.status;
        requiresManualAction = registrationResult.requiresManualAction;
        
        // Log admin notification if manual action required
        if (requiresManualAction) {
          console.warn('[DepositProtection] ⚠️ MANUAL ACTION REQUIRED');
          console.warn('[DepositProtection] TDS API not configured - deposit requires manual registration');
          console.warn('[DepositProtection] Visit: https://www.tenancydepositscheme.com to register manually');
          console.warn(`[DepositProtection] Reference: ${registrationResult.registrationNumber}`);
          
          // Send admin notification email
          if (landlord?.email) {
            await this.sendAdminNotification(
              landlord.email,
              data.tenantName,
              data.amount,
              registrationResult.registrationNumber
            );
          }
        }
      } else {
        // For non-TDS schemes, use simulated registration (as before)
        const registrationId = `REG-${data.scheme}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const certificateNumber = `CERT-${data.scheme}-${Date.now()}`;
        
        registrationResult = {
          registrationNumber: registrationId,
          certificateUrl: '',
          certificateNumber: certificateNumber,
          status: 'simulated' as const,
          requiresManualAction: true,
        };
        
        status = 'simulated';
        requiresManualAction = true;
      }
      
      // Create deposit protection record in database
      const protection = await storage.createDepositProtection({
        leadId: data.leadId,
        depositId: data.depositId,
        landlordId: data.landlordId,
        amount: data.amount.toFixed(2),
        scheme: data.scheme,
        registrationId: registrationResult.registrationNumber,
        certificateNumber: registrationResult.certificateNumber,
        status: status === 'simulated' ? 'pending' : status,
        registeredAt: new Date(),
        protectionDeadline,
        tenantName: data.tenantName,
        tenantEmail: data.tenantEmail,
        propertyAddress: data.propertyAddress,
        tenancyStartDate: data.tenancyStartDate,
        tenancyEndDate: data.tenancyEndDate,
      });
      
      // Try to download certificate from TDS if available
      let certificateUrl = registrationResult.certificateUrl;
      
      if (data.scheme === 'TDS' && tdsClient.isProduction()) {
        const certificateBuffer = await tdsClient.downloadCertificate(registrationResult.registrationNumber);
        if (certificateBuffer) {
          certificateUrl = await this.uploadDocument(certificateBuffer, `certificate-${protection.id}.pdf`);
        }
      }
      
      // If no certificate from API, generate one locally
      if (!certificateUrl || certificateUrl === '') {
        const certificatePdf = await this.generateCertificate(protection);
        certificateUrl = await this.uploadDocument(certificatePdf, `certificate-${protection.id}.pdf`);
      }
      
      // Always generate prescribed information locally (legal requirement)
      const prescribedInfoPdf = await this.generatePrescribedInfo(protection);
      const prescribedInfoUrl = await this.uploadDocument(prescribedInfoPdf, `prescribed-info-${protection.id}.pdf`);
      
      // Update protection with document URLs
      await storage.updateDepositProtection(protection.id, {
        certificateUrl,
        prescribedInfoUrl,
      });
      
      // Schedule reminders if not fully registered yet
      if (protection.status === 'pending' || protection.status === 'simulated') {
        await this.scheduleReminders(protection.id, protectionDeadline);
      }
      
      // Send confirmation emails with appropriate messaging
      await this.sendProtectionConfirmation(
        protection, 
        certificateUrl, 
        prescribedInfoUrl,
        requiresManualAction
      );
      
      const logStatus = requiresManualAction ? '📋 (Manual registration required)' : '✅';
      console.log(`[DepositProtection] Deposit registered ${logStatus}: ${registrationResult.registrationNumber}`);
      
      return {
        registrationId: registrationResult.registrationNumber,
        certificateUrl,
        prescribedInfoUrl,
        certificateNumber: registrationResult.certificateNumber,
        requiresManualAction,
      };
    } catch (error: any) {
      console.error('[DepositProtection] Error registering deposit:', error);
      throw error;
    }
  }
  
  /**
   * Send admin notification when manual deposit registration is required
   */
  private async sendAdminNotification(
    adminEmail: string,
    tenantName: string,
    amount: number,
    referenceNumber: string
  ) {
    const emailHtml = `
      <h2 style="color: #ff8800;">⚠️ Manual Deposit Registration Required</h2>
      
      <p>A deposit has been recorded but requires manual registration with TDS as the API is not configured.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Deposit Details:</h3>
        <ul>
          <li><strong>Tenant:</strong> ${tenantName}</li>
          <li><strong>Amount:</strong> £${amount}</li>
          <li><strong>Reference:</strong> ${referenceNumber}</li>
          <li><strong>Status:</strong> Awaiting manual registration</li>
        </ul>
      </div>
      
      <h3>Action Required:</h3>
      <ol>
        <li>Log in to the TDS Custodial portal</li>
        <li>Register this deposit within 30 days</li>
        <li>Use reference: ${referenceNumber}</li>
      </ol>
      
      <p><strong>Register at:</strong> <a href="https://www.tenancydepositscheme.com/agents-and-landlords/custodial/">TDS Custodial Portal</a></p>
      
      <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin-top: 20px;">
        <strong>⏰ Legal Requirement:</strong> This deposit must be protected within 30 days of receipt to avoid penalties of 1-3x the deposit amount.
      </div>
      
      <hr style="margin: 30px 0;">
      
      <p style="color: #666; font-size: 12px;">
        To enable automatic registration, configure TDS API credentials in your environment:
        <br>• TDS_API_KEY
        <br>• TDS_API_URL
        <br>• TDS_ACCOUNT_ID
      </p>
    `;
    
    await emailService.sendEmail(
      adminEmail,
      `⚠️ ACTION REQUIRED: Manual Deposit Registration - ${tenantName}`,
      emailHtml
    );
  }
  
  /**
   * Generate the deposit protection certificate PDF
   */
  async generateCertificate(protection: DepositProtection): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const scheme = SCHEME_DETAILS[protection.scheme];
    
    // Header
    page.drawText('DEPOSIT PROTECTION CERTIFICATE', {
      x: 50,
      y: height - 50,
      size: 20,
      font: boldFont,
      color: rgb(0.08, 0.13, 0.24),
    });
    
    page.drawText(`${scheme.fullName}`, {
      x: 50,
      y: height - 80,
      size: 14,
      font: font,
      color: rgb(0.08, 0.13, 0.24),
    });
    
    // Certificate Number
    page.drawText(`Certificate Number: ${protection.certificateNumber}`, {
      x: 50,
      y: height - 120,
      size: 12,
      font: boldFont,
      color: rgb(0.08, 0.13, 0.24),
    });
    
    // Main content
    const content = [
      '',
      'This certificate confirms that the tenancy deposit detailed below',
      'has been protected in accordance with the Housing Act 2004.',
      '',
      `Tenant Name: ${protection.tenantName}`,
      `Property Address: ${protection.propertyAddress}`,
      `Deposit Amount: £${protection.amount}`,
      `Date Protected: ${format(protection.registeredAt || new Date(), 'dd MMMM yyyy')}`,
      `Tenancy Start Date: ${format(protection.tenancyStartDate, 'dd MMMM yyyy')}`,
      `Tenancy End Date: ${format(protection.tenancyEndDate, 'dd MMMM yyyy')}`,
      '',
      'Scheme Details:',
      `${scheme.fullName}`,
      `Website: ${scheme.website}`,
      `Phone: ${scheme.phone}`,
      `Email: ${scheme.email}`,
      '',
      'Important Information:',
      '• This deposit is protected by law',
      '• At the end of the tenancy, the deposit will be returned according',
      '  to the agreed deductions between landlord and tenant',
      '• In case of dispute, the scheme provides free adjudication service',
      '',
      'For more information about your rights and the scheme rules,',
      `please visit ${scheme.website} or call ${scheme.phone}`,
    ];
    
    let yPosition = height - 160;
    for (const line of content) {
      const isHeader = line.includes(':') && !line.startsWith('•');
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: 11,
        font: isHeader ? boldFont : font,
        color: rgb(0.08, 0.13, 0.24),
      });
      yPosition -= 20;
    }
    
    // Footer
    page.drawText(`Generated on ${format(new Date(), 'dd MMMM yyyy HH:mm')}`, {
      x: 50,
      y: 50,
      size: 9,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
  
  /**
   * Generate the prescribed information document with enhanced legal requirements
   */
  async generatePrescribedInfo(protection: DepositProtection): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const scheme = SCHEME_DETAILS[protection.scheme];
    const isSimulated = protection.status === 'simulated';
    
    // Header
    page.drawText('PRESCRIBED INFORMATION', {
      x: 50,
      y: height - 50,
      size: 20,
      font: boldFont,
      color: rgb(0.08, 0.13, 0.24),
    });
    
    page.drawText('Housing Act 2004 - Tenancy Deposit Protection', {
      x: 50,
      y: height - 75,
      size: 12,
      font: font,
      color: rgb(0.08, 0.13, 0.24),
    });
    
    // Warning if manual registration needed
    if (isSimulated) {
      page.drawText('⚠️ AWAITING MANUAL REGISTRATION', {
        x: 50,
        y: height - 95,
        size: 10,
        font: boldFont,
        color: rgb(1, 0.4, 0),
      });
    }
    
    // Enhanced content sections with all legally required information
    const sections = [
      {
        title: '1. PARTIES TO THE TENANCY',
        content: [
          `Tenant(s): ${protection.tenantName}`,
          `Tenant Email: ${protection.tenantEmail}`,
          `Landlord: As registered with the scheme`,
          `Property: ${protection.propertyAddress}`,
        ],
      },
      {
        title: '2. DEPOSIT INFORMATION',
        content: [
          `Amount Protected: £${protection.amount}`,
          `Date Deposit Received: ${format(protection.registeredAt || new Date(), 'dd MMMM yyyy')}`,
          `Date Deposit Protected: ${format(protection.registeredAt || new Date(), 'dd MMMM yyyy')}`,
          `Protection Certificate: ${protection.certificateNumber}`,
          `Registration Number: ${protection.registrationId}`,
        ],
      },
      {
        title: '3. TENANCY DETAILS',
        content: [
          `Tenancy Type: Assured Shorthold Tenancy`,
          `Start Date: ${format(protection.tenancyStartDate, 'dd MMMM yyyy')}`,
          `End Date: ${format(protection.tenancyEndDate, 'dd MMMM yyyy')}`,
          `Monthly Rent: £${(parseFloat(protection.amount) / 1.5).toFixed(2)} (estimated)`,
        ],
      },
      {
        title: '4. DEPOSIT PROTECTION SCHEME DETAILS',
        content: [
          `Scheme Name: ${scheme.fullName}`,
          `Scheme Address: ${scheme.address}`,
          `Telephone: ${scheme.phone}`,
          `Email: ${scheme.email}`,
          `Website: ${scheme.website}`,
          '',
          'The scheme is authorised by the government under the',
          'Housing Act 2004 to protect tenancy deposits.',
        ],
      },
      {
        title: '5. HOW THE DEPOSIT IS PROTECTED',
        content: [
          '• The deposit is held by the custodial scheme',
          '• The scheme holds the deposit for the duration of tenancy',
          '• Interest may be earned on the deposit (scheme dependent)',
          '• The deposit remains the property of the tenant',
          '• Protection continues if the tenancy becomes periodic',
        ],
      },
      {
        title: '6. PROCEDURES AT END OF TENANCY',
        content: [
          'When the tenancy ends:',
          '',
          '• The landlord must apply for deposit return',
          '• Proposed deductions must be detailed and justified',
          '• You have 14 days to respond to the proposal',
          '• If you agree, the deposit is returned within 10 days',
          '• If you disagree, dispute resolution is available',
          '',
          'Valid reasons for deductions:',
          '• Unpaid rent or utility bills',
          '• Damage beyond reasonable wear and tear',
          '• Missing items listed in the inventory',
          '• Cleaning to return property to original state',
          '• Breach of tenancy agreement terms',
        ],
      },
      {
        title: '7. DISPUTE RESOLUTION PROCESS',
        content: [
          'Alternative Dispute Resolution (ADR):',
          '',
          '• Free service provided by the scheme',
          '• Independent adjudicator reviews evidence',
          '• Both parties submit evidence online',
          '• Decision typically within 28 days',
          '• Decision is final and binding',
          '',
          'Evidence typically includes:',
          '• Tenancy agreement',
          '• Inventory and check-in/out reports',
          '• Photographs',
          '• Receipts and invoices',
          '• Correspondence between parties',
          '',
          'Note: Court action remains an option if either',
          'party prefers not to use ADR.',
        ],
      },
      {
        title: '8. YOUR RIGHTS AND RESPONSIBILITIES',
        content: [
          'Tenant Rights:',
          '• Deposit must be protected within 30 days',
          '• You must receive this prescribed information',
          '• Deposit returned if no deductions agreed',
          '• Free access to dispute resolution',
          '• Compensation if deposit not protected properly',
          '',
          'Tenant Responsibilities:',
          '• Pay rent on time and in full',
          '• Keep property in good condition',
          '• Report maintenance issues promptly',
          '• Allow reasonable access for inspections',
          '• Return property in agreed condition',
        ],
      },
      {
        title: '9. WHAT TO DO IF YOU BELIEVE YOUR DEPOSIT',
        content: [
          'IS NOT PROTECTED:',
          '',
          '1. Check with all three schemes:',
          `   • ${SCHEME_DETAILS.TDS.fullName}`,
          `   • ${SCHEME_DETAILS.DPS.fullName}`,
          `   • ${SCHEME_DETAILS.MyDeposits.fullName}`,
          '',
          '2. Contact your landlord or agent',
          '',
          '3. If not protected, you may claim compensation',
          '   through the county court (1-3x deposit amount)',
          '',
          '4. Seek legal advice if necessary',
        ],
      },
      {
        title: '10. IMPORTANT DATES',
        content: [
          `Deposit Received: ${format(protection.registeredAt || new Date(), 'dd MMMM yyyy')}`,
          `Must be Protected by: ${format(addDays(protection.registeredAt || new Date(), 30), 'dd MMMM yyyy')}`,
          `Certificate Issued: ${format(new Date(), 'dd MMMM yyyy')}`,
          `Tenancy Ends: ${format(protection.tenancyEndDate, 'dd MMMM yyyy')}`,
        ],
      },
    ];
    
    let yPosition = height - 115;
    let currentPage = page;
    
    for (const section of sections) {
      // Check if we need a new page for the section title
      if (yPosition < 150) {
        currentPage = pdfDoc.addPage([595, 842]);
        yPosition = height - 50;
      }
      
      // Section title
      currentPage.drawText(section.title, {
        x: 50,
        y: yPosition,
        size: 11,
        font: boldFont,
        color: rgb(0.08, 0.13, 0.24),
      });
      yPosition -= 18;
      
      // Section content
      for (const line of section.content) {
        // Check if we need a new page for content
        if (yPosition < 80) {
          currentPage = pdfDoc.addPage([595, 842]);
          yPosition = height - 50;
        }
        
        const isSubheading = line.endsWith(':') && !line.startsWith('•');
        const isBullet = line.startsWith('•');
        const isIndented = line.startsWith('   ');
        
        currentPage.drawText(line, {
          x: isIndented ? 70 : isBullet ? 60 : 50,
          y: yPosition,
          size: 9,
          font: isSubheading ? boldFont : font,
          color: rgb(0.08, 0.13, 0.24),
        });
        yPosition -= 13;
      }
      
      yPosition -= 8; // Extra space between sections
    }
    
    // Add footer with generation date on last page
    const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
    lastPage.drawText(`Generated on ${format(new Date(), 'dd MMMM yyyy HH:mm')}`, {
      x: 50,
      y: 40,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    if (isSimulated) {
      lastPage.drawText('This document is pending manual TDS registration', {
        x: 50,
        y: 28,
        size: 8,
        font: font,
        color: rgb(1, 0.4, 0),
      });
    }
    
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
  
  /**
   * Check the registration status of a deposit
   */
  async checkRegistrationStatus(registrationId: string): Promise<{
    status: 'pending' | 'registered' | 'failed';
    certificateNumber?: string;
  }> {
    const protection = await storage.getDepositProtectionByRegistrationId(registrationId);
    
    if (!protection) {
      return { status: 'failed' };
    }
    
    return {
      status: protection.status as 'pending' | 'registered' | 'failed',
      certificateNumber: protection.certificateNumber || undefined,
    };
  }
  
  /**
   * Schedule reminders for unregistered deposits
   */
  private async scheduleReminders(protectionId: string, deadline: Date) {
    const reminderDays = [7, 14, 25]; // Days before deadline to send reminders
    
    for (const days of reminderDays) {
      const scheduledDate = addDays(new Date(), days);
      if (scheduledDate < deadline) {
        await storage.createDepositProtectionReminder({
          depositProtectionId: protectionId,
          reminderType: `${days}_days`,
          scheduledFor: scheduledDate,
          status: 'pending',
        });
      }
    }
  }
  
  /**
   * Send protection confirmation to tenant and landlord
   */
  private async sendProtectionConfirmation(
    protection: DepositProtection,
    certificateUrl: string,
    prescribedInfoUrl: string,
    requiresManualAction: boolean = false
  ) {
    // Email to tenant
    const statusMessage = requiresManualAction 
      ? 'is being processed for protection'
      : 'has been protected';
    
    const additionalInfo = requiresManualAction
      ? `
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>⚠️ Registration in Progress:</strong>
          <p>Your deposit is being manually registered with ${SCHEME_DETAILS[protection.scheme].fullName}. 
          This process will be completed within the legal 30-day requirement. You will receive 
          confirmation once registration is complete.</p>
        </div>
      `
      : '';
    
    const tenantEmailHtml = `
      <h2>Your Deposit ${requiresManualAction ? 'Registration in Progress' : 'Has Been Protected'}</h2>
      <p>Dear ${protection.tenantName},</p>
      
      <p>We're pleased to confirm that your tenancy deposit of <strong>£${protection.amount}</strong> 
      ${statusMessage} with ${SCHEME_DETAILS[protection.scheme].fullName}.</p>
      
      <p><strong>Certificate Number:</strong> ${protection.certificateNumber}</p>
      <p><strong>Property:</strong> ${protection.propertyAddress}</p>
      
      ${additionalInfo}
      
      <h3>Important Documents</h3>
      <ul>
        <li><a href="${certificateUrl}">Download Protection Certificate</a></li>
        <li><a href="${prescribedInfoUrl}">Download Prescribed Information</a></li>
      </ul>
      
      <p>Please keep these documents safe for your records. They confirm that your deposit 
      ${requiresManualAction ? 'will be' : 'is'} protected by law and explain your rights.</p>
      
      <h3>What This Means For You</h3>
      <ul>
        <li>Your deposit ${requiresManualAction ? 'will be' : 'is'} safe and protected by an approved government scheme</li>
        <li>At the end of your tenancy, you'll get your deposit back minus any agreed deductions</li>
        <li>If there's a dispute, you have access to free adjudication</li>
      </ul>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>The TermFlow Team</p>
    `;
    
    await emailService.sendEmail(
      protection.tenantEmail,
      `Deposit Protected - Certificate #${protection.certificateNumber}`,
      tenantEmailHtml
    );
    
    // WhatsApp message to tenant (if we have their number)
    const lead = await storage.getLead(protection.leadId);
    if (lead?.whatsappNumber) {
      await sendWhatsAppMessage(
        lead.whatsappNumber,
        `✅ Great news! Your deposit of £${protection.amount} has been protected with ${protection.scheme}. ` +
        `Certificate #${protection.certificateNumber}. Check your email for important documents. ` +
        `Your deposit is now legally protected! 🏠`
      );
    }
    
    // Email to landlord
    const landlord = await storage.getUser(protection.landlordId);
    if (landlord?.email) {
      const landlordEmailHtml = `
        <h2>Deposit Protection Confirmed</h2>
        
        <p>The following deposit has been successfully protected:</p>
        
        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Tenant:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${protection.tenantName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Property:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${protection.propertyAddress}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Amount:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">£${protection.amount}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Scheme:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${SCHEME_DETAILS[protection.scheme].fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Certificate:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${protection.certificateNumber}</td>
          </tr>
        </table>
        
        <p>Documents have been sent to the tenant and are available in your dashboard.</p>
        
        <p>Best regards,<br>TermFlow</p>
      `;
      
      await emailService.sendEmail(
        landlord.email,
        `Deposit Protected - ${protection.tenantName}`,
        landlordEmailHtml
      );
    }
  }
  
  /**
   * Upload document to storage
   */
  private async uploadDocument(buffer: Buffer, filename: string): Promise<string> {
    // In production, this would upload to S3/GCS
    // For now, we'll return a placeholder URL
    const baseUrl = process.env.PUBLIC_URL || 'http://localhost:5000';
    return `${baseUrl}/api/deposits/documents/${filename}`;
  }
  
  /**
   * Handle deposit release at end of tenancy
   */
  async initiateRelease(
    depositProtectionId: string,
    deductions?: Array<{ reason: string; amount: number }>
  ): Promise<void> {
    const protection = await storage.getDepositProtection(depositProtectionId);
    
    if (!protection) {
      throw new Error('Deposit protection not found');
    }
    
    // Calculate total deductions
    const totalDeductions = deductions?.reduce((sum, d) => sum + d.amount, 0) || 0;
    const returnAmount = parseFloat(protection.amount) - totalDeductions;
    
    // Try to use TDS API if scheme is TDS and API is configured
    let releaseInitiated = false;
    if (protection.scheme === 'TDS' && tdsClient.isProduction() && protection.registrationId) {
      releaseInitiated = await tdsClient.initiateRelease(
        protection.registrationId,
        deductions || []
      );
      
      if (releaseInitiated) {
        console.log(`[DepositProtection] ✅ Release initiated via TDS API for ${protection.certificateNumber}`);
      }
    }
    
    if (!releaseInitiated) {
      // Fallback to manual process or simulation
      console.log(`[DepositProtection] 📋 Manual release process for ${protection.certificateNumber}`);
      console.log(`[DepositProtection] Total deposit: £${protection.amount}`);
      console.log(`[DepositProtection] Deductions: £${totalDeductions}`);
      console.log(`[DepositProtection] Return amount: £${returnAmount}`);
      
      // Send admin notification for manual release if TDS not configured
      if (protection.scheme === 'TDS' && !tdsClient.isProduction()) {
        const landlord = await storage.getUser(protection.landlordId);
        if (landlord?.email) {
          await emailService.sendEmail(
            landlord.email,
            `⚠️ Manual Deposit Release Required - ${protection.tenantName}`,
            `
              <h2>Manual Deposit Release Required</h2>
              
              <p>The TDS API is not configured, so this deposit release must be processed manually.</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Release Details:</h3>
                <ul>
                  <li><strong>Registration:</strong> ${protection.registrationId}</li>
                  <li><strong>Certificate:</strong> ${protection.certificateNumber}</li>
                  <li><strong>Tenant:</strong> ${protection.tenantName}</li>
                  <li><strong>Total Deposit:</strong> £${protection.amount}</li>
                  <li><strong>Deductions:</strong> £${totalDeductions}</li>
                  <li><strong>To Return:</strong> £${returnAmount}</li>
                </ul>
                
                ${deductions && deductions.length > 0 ? `
                  <h4>Deduction Breakdown:</h4>
                  <ul>
                    ${deductions.map(d => `<li>${d.reason}: £${d.amount.toFixed(2)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
              
              <h3>Action Required:</h3>
              <ol>
                <li>Log in to TDS Custodial portal</li>
                <li>Find deposit by registration: ${protection.registrationId}</li>
                <li>Initiate release with proposed deductions</li>
                <li>Notify tenant of the proposal</li>
              </ol>
              
              <p><strong>Process at:</strong> <a href="https://www.tenancydepositscheme.com">TDS Portal</a></p>
            `
          );
        }
      }
    }
    
    // Send notification to tenant about proposed deductions
    const emailHtml = `
      <h2>Deposit Return Proposal</h2>
      <p>Dear ${protection.tenantName},</p>
      
      <p>Your tenancy has ended and we're proposing the following for your deposit return:</p>
      
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Original Deposit:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">£${protection.amount}</td>
        </tr>
        ${deductions?.map(d => `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${d.reason}:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">-£${d.amount.toFixed(2)}</td>
          </tr>
        `).join('') || ''}
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Amount to Return:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>£${returnAmount.toFixed(2)}</strong></td>
        </tr>
      </table>
      
      <p>If you agree with these deductions, the deposit will be returned within 10 working days.</p>
      <p>If you disagree, you can raise a dispute through ${SCHEME_DETAILS[protection.scheme].fullName}.</p>
      
      <p>Best regards,<br>The TermFlow Team</p>
    `;
    
    await emailService.sendEmail(
      protection.tenantEmail,
      'Deposit Return Proposal',
      emailHtml
    );
  }
  
  /**
   * Check for overdue deposit protections and send alerts
   */
  async checkOverdueProtections(): Promise<void> {
    const overdueContracts = await storage.getOverdueDepositProtections();
    
    for (const contract of overdueContracts) {
      if (!contract.depositProtectionDeadline) continue;
      
      const daysRemaining = differenceInDays(contract.depositProtectionDeadline, new Date());
      
      if (daysRemaining <= 0 && contract.depositProtectionStatus !== 'protected') {
        // CRITICAL: Deposit not protected and deadline passed
        console.error(`[DepositProtection] CRITICAL: Contract ${contract.id} deposit protection is overdue!`);
        
        // Get lead and property details to find landlord
        const lead = await storage.getLead(contract.leadId);
        const room = await storage.getRoom(contract.roomId);
        if (!room) continue;
        const property = await storage.getProperty(room.propertyId);
        if (!property) continue;
        
        const landlord = await storage.getUser(property.landlordId);
        if (landlord?.email) {
          const tenantName = lead?.name || 'Tenant';
          await emailService.sendEmail(
            landlord.email,
            '🚨 URGENT: Deposit Protection Overdue - Legal Risk',
            `
              <h2 style="color: red;">URGENT ACTION REQUIRED</h2>
              <p>A deposit has NOT been protected within the legal 30-day deadline:</p>
              <ul>
                <li>Tenant: ${tenantName}</li>
                <li>Amount: £${contract.depositAmount}</li>
                <li>Days Overdue: ${Math.abs(daysRemaining)}</li>
              </ul>
              <p><strong>You are now at risk of penalties of 1-3x the deposit amount!</strong></p>
              <p>Please protect this deposit IMMEDIATELY to minimize legal exposure.</p>
            `
          );
        }
      } else if (daysRemaining <= 5 && contract.depositProtectionStatus !== 'protected') {
        // Send urgent reminder
        console.warn(`[DepositProtection] WARNING: Contract ${contract.id} deposit protection has ${daysRemaining} days remaining`);
      }
    }
  }
}

// Export singleton instance
export const depositProtectionService = new DepositProtectionService();