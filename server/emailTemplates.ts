// ============================================================================
// EMAIL LAYOUT HELPER
// ============================================================================

interface EmailLayoutData {
  title: string;
  preheader?: string;
  heroIcon?: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
  footerText?: string;
}

function renderEmailLayout(data: EmailLayoutData): string {
  const baseUrl = process.env.BASE_URL || 'https://termflow.com';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${data.preheader ? `<meta name="description" content="${data.preheader}">` : ''}
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        ${data.heroIcon ? `<div style="font-size: 40px; margin-bottom: 10px;">${data.heroIcon}</div>` : ''}
        <h2 style="margin: 0; font-size: 24px;">${data.title}</h2>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        ${data.bodyHtml}
        
        ${data.ctaText && data.ctaUrl ? `
          <div style="margin: 30px 0; text-align: center;">
            <a href="${data.ctaUrl}" style="background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
              ${data.ctaText}
            </a>
          </div>
        ` : ''}
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          ${data.footerText || 'This is an automated email from TermFlow.'}
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>TermFlow - AI-Powered Student Lettings Automation</p>
        <p>Questions? Reply to this email or visit <a href="${baseUrl}" style="color: #3b82f6;">termflow.com</a></p>
      </div>
      
    </body>
    </html>
  `;
}

// ============================================================================
// DEPOSIT REMINDER TEMPLATE (Existing)
// ============================================================================

interface DepositReminderData {
  landlordName: string;
  tenantName: string;
  propertyName: string;
  depositAmount: number;
  depositChargedDate: string;
  deadlineDate: string;
  daysRemaining: number;
  potentialFine: number;
  contractId: number;
}

export function generateDepositReminderEmail(
  data: DepositReminderData,
  urgency: 'info' | 'warning' | 'urgent' | 'critical' | 'violation'
): string {
  const baseUrl = process.env.BASE_URL || 'https://termflow.com';
  const markProtectedUrl = `${baseUrl}/contracts`;
  
  const urgencyColors = {
    info: '#3b82f6',
    warning: '#f59e0b',
    urgent: '#f97316',
    critical: '#ef4444',
    violation: '#991b1b',
  };
  
  const urgencyLabels = {
    info: 'Action Required',
    warning: 'Important Reminder',
    urgent: '⚠️ URGENT',
    critical: '🚨 CRITICAL',
    violation: '⚠️ LEGAL VIOLATION',
  };
  
  let bodyContent = '';
  
  if (urgency === 'violation') {
    bodyContent = `
      <p style="color: #991b1b; font-weight: bold; font-size: 18px;">
        Your deposit protection is now <strong>OVERDUE</strong>.
      </p>
      <p>
        The legal deadline to protect this deposit was <strong>${data.deadlineDate}</strong>.
        You are now in violation of the <strong>UK Housing Act 2004</strong>.
      </p>
      <p style="background: #fee2e2; padding: 15px; border-left: 4px solid #991b1b;">
        <strong>Legal Consequences:</strong><br/>
        • Potential fine: Up to <strong>£${data.potentialFine.toLocaleString()}</strong> (3x deposit amount)<br/>
        • Cannot serve Section 21 eviction notice<br/>
        • Tenant may claim compensation<br/>
        • Legal action may be taken against you
      </p>
      <p>
        <strong>Immediate action required:</strong><br/>
        1. Protect the deposit immediately in an approved scheme<br/>
        2. Contact a solicitor for legal advice<br/>
        3. Consider settling with the tenant to avoid court action
      </p>
    `;
  } else if (data.daysRemaining <= 2) {
    bodyContent = `
      <p style="color: #ef4444; font-weight: bold; font-size: 18px;">
        You have <strong>${data.daysRemaining} day${data.daysRemaining === 1 ? '' : 's'}</strong> remaining to protect this deposit!
      </p>
      <p>
        The legal deadline is <strong>${data.deadlineDate}</strong>.
        Failure to comply will result in serious legal consequences.
      </p>
      <p style="background: #fef2f2; padding: 15px; border-left: 4px solid #ef4444;">
        <strong>If you miss the deadline:</strong><br/>
        • Fine of up to <strong>£${data.potentialFine.toLocaleString()}</strong><br/>
        • Cannot evict tenant with Section 21<br/>
        • Tenant can sue for compensation
      </p>
    `;
  } else if (data.daysRemaining <= 9) {
    bodyContent = `
      <p style="color: #f97316; font-weight: bold;">
        You have <strong>${data.daysRemaining} days</strong> remaining to protect this deposit.
      </p>
      <p>
        The legal deadline is <strong>${data.deadlineDate}</strong>.
        Please take action soon to avoid legal penalties.
      </p>
    `;
  } else {
    bodyContent = `
      <p>
        You have <strong>${data.daysRemaining} days</strong> remaining to protect this deposit.
        The deadline is <strong>${data.deadlineDate}</strong>.
      </p>
    `;
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="background: ${urgencyColors[urgency]}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">${urgencyLabels[urgency]}: Deposit Protection</h2>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <p>Hello ${data.landlordName},</p>
        
        ${bodyContent}
        
        <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="margin-top: 0; color: #374151;">Deposit Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Tenant:</td>
              <td style="padding: 8px 0; font-weight: 600;">${data.tenantName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Property:</td>
              <td style="padding: 8px 0; font-weight: 600;">${data.propertyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Deposit Amount:</td>
              <td style="padding: 8px 0; font-weight: 600;">£${data.depositAmount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Received:</td>
              <td style="padding: 8px 0; font-weight: 600;">${data.depositChargedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Deadline:</td>
              <td style="padding: 8px 0; font-weight: 600; color: ${urgencyColors[urgency]};">${data.deadlineDate}</td>
            </tr>
          </table>
        </div>
        
        ${urgency !== 'violation' ? `
          <div style="background: #eff6ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h3 style="margin-top: 0; color: #1e40af;">How to Protect Your Deposit:</h3>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li style="margin: 8px 0;">Choose an approved scheme:
                <ul style="margin-top: 5px;">
                  <li><a href="https://www.depositprotection.com/" style="color: #2563eb;">DPS (Deposit Protection Service)</a></li>
                  <li><a href="https://www.mydeposits.co.uk/" style="color: #2563eb;">MyDeposits</a></li>
                  <li><a href="https://www.tenancydepositscheme.com/" style="color: #2563eb;">TDS (Tenancy Deposit Scheme)</a></li>
                </ul>
              </li>
              <li style="margin: 8px 0;">Register the deposit with your chosen scheme</li>
              <li style="margin: 8px 0;">Get your certificate number</li>
              <li style="margin: 8px 0;">
                <a href="${markProtectedUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                  Mark as Protected in TermFlow →
                </a>
              </li>
            </ol>
          </div>
        ` : ''}
        
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          This is an automated reminder from TermFlow to help you stay compliant with UK deposit protection laws.
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>TermFlow - AI-Powered Student Lettings Automation</p>
        <p>Questions? Reply to this email or visit <a href="${baseUrl}" style="color: #3b82f6;">termflow.com</a></p>
      </div>
      
    </body>
    </html>
  `;
}

// ============================================================================
// NEW EMAIL TEMPLATES
// ============================================================================

// 1. Welcome / Trial Start
interface WelcomeEmailData {
  landlordName: string;
  trialEndDate: string;
  trialDays: number;
  features: string[];
}

export function generateWelcomeEmail(data: WelcomeEmailData): string {
  const bodyHtml = `
    <p>Welcome to TermFlow, ${data.landlordName}! 🎉</p>
    
    <p>Your <strong>${data.trialDays}-day free trial</strong> is now active and will run until <strong>${data.trialEndDate}</strong>.</p>
    
    <div style="background: #eff6ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3b82f6;">
      <h3 style="margin-top: 0; color: #1e40af;">What's included in your trial:</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        ${data.features.map(f => `<li style="margin: 8px 0;">${f}</li>`).join('')}
      </ul>
    </div>
    
    <p><strong>Next steps:</strong></p>
    <ol style="margin: 10px 0; padding-left: 20px;">
      <li style="margin: 8px 0;">Complete your property setup</li>
      <li style="margin: 8px 0;">Upload room details and pricing</li>
      <li style="margin: 8px 0;">Configure your AI assistant Ava</li>
      <li style="margin: 8px 0;">Start accepting enquiries!</li>
    </ol>
  `;
  
  return renderEmailLayout({
    title: "Welcome to TermFlow!",
    preheader: `Your ${data.trialDays}-day trial starts now`,
    heroIcon: "🚀",
    bodyHtml,
    ctaText: "Go to Dashboard",
    ctaUrl: `${process.env.BASE_URL || 'https://termflow.com'}/dashboard`,
    footerText: "Your trial includes full access to all features. No credit card required.",
  });
}

// 2. Onboarding Confirmation
interface OnboardingConfirmationData {
  landlordName: string;
  propertyName: string;
  contractUrl: string;
  onboardingDate: string;
  selections: { label: string; value: string }[];
}

export function generateOnboardingConfirmationEmail(data: OnboardingConfirmationData): string {
  const bodyHtml = `
    <p>Hello ${data.landlordName},</p>
    
    <p>Thank you for completing your onboarding on <strong>${data.onboardingDate}</strong>!</p>
    
    <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
      <h3 style="margin-top: 0; color: #374151;">Your Selections:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${data.selections.map(s => `
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">${s.label}:</td>
            <td style="padding: 8px 0; font-weight: 600;">${s.value}</td>
          </tr>
        `).join('')}
      </table>
    </div>
    
    <p><strong>Contract Attached:</strong><br/>
    Your uploaded contract is attached to this email. Please review and keep for your records.</p>
    
    <div style="background: #fef3c7; padding: 15px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #f59e0b;">
      <p style="margin: 0;"><strong>⚠️ Liability Acknowledgement Required</strong></p>
      <p style="margin: 8px 0 0 0;">By using TermFlow, you acknowledge that you remain responsible for compliance with all UK lettings regulations, including Right-to-Rent checks, deposit protection, and safety certificates.</p>
    </div>
  `;
  
  return renderEmailLayout({
    title: "Onboarding Complete",
    preheader: `${data.propertyName} setup confirmed`,
    heroIcon: "✅",
    bodyHtml,
    ctaText: "View Dashboard",
    ctaUrl: `${process.env.BASE_URL || 'https://termflow.com'}/dashboard`,
  });
}

// 3. Staff Account Created
interface StaffAccountCreatedData {
  staffName: string;
  staffEmail: string;
  invitedBy: string;
  loginUrl: string;
  role: string;
}

export function generateStaffAccountCreatedEmail(data: StaffAccountCreatedData): string {
  const bodyHtml = `
    <p>Hello ${data.staffName},</p>
    
    <p><strong>${data.invitedBy}</strong> has invited you to join TermFlow as a <strong>${data.role}</strong>.</p>
    
    <div style="background: #eff6ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3b82f6;">
      <h3 style="margin-top: 0; color: #1e40af;">What TermFlow will do for you:</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li style="margin: 8px 0;">Automate tenant enquiries via AI (Ava)</li>
        <li style="margin: 8px 0;">Manage viewings and applications</li>
        <li style="margin: 8px 0;">Handle contracts and payments</li>
        <li style="margin: 8px 0;">Track all tenant interactions</li>
      </ul>
    </div>
    
    <p><strong>Your login details:</strong></p>
    <p>Email: <strong>${data.staffEmail}</strong><br/>
    You'll sign in using Replit Auth (no password needed).</p>
  `;
  
  return renderEmailLayout({
    title: "You've been invited to TermFlow",
    preheader: `${data.invitedBy} invited you as ${data.role}`,
    heroIcon: "👋",
    bodyHtml,
    ctaText: "Sign In Now",
    ctaUrl: data.loginUrl,
  });
}

// 4. Deal Approval Required
interface DealApprovalData {
  landlordName: string;
  tenantName: string;
  propertyName: string;
  roomType: string;
  rentPerWeek: number;
  depositAmount: number;
  moveInDate: string;
  contractTerms: { label: string; value: string }[];
  approvalUrl: string;
  requestChangesUrl: string;
}

export function generateDealApprovalEmail(data: DealApprovalData): string {
  const bodyHtml = `
    <p>Hello ${data.landlordName},</p>
    
    <p>A new deal is ready for your approval:</p>
    
    <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
      <h3 style="margin-top: 0; color: #374151;">Deal Summary:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Tenant:</td>
          <td style="padding: 8px 0; font-weight: 600;">${data.tenantName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Property:</td>
          <td style="padding: 8px 0; font-weight: 600;">${data.propertyName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Room Type:</td>
          <td style="padding: 8px 0; font-weight: 600;">${data.roomType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Weekly Rent:</td>
          <td style="padding: 8px 0; font-weight: 600;">£${data.rentPerWeek}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Deposit:</td>
          <td style="padding: 8px 0; font-weight: 600;">£${data.depositAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Move-in Date:</td>
          <td style="padding: 8px 0; font-weight: 600;">${data.moveInDate}</td>
        </tr>
        ${data.contractTerms.map(t => `
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">${t.label}:</td>
            <td style="padding: 8px 0; font-weight: 600;">${t.value}</td>
          </tr>
        `).join('')}
      </table>
    </div>
    
    <div style="background: #fef3c7; padding: 15px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #f59e0b;">
      <p style="margin: 0;"><strong>⚠️ Approval Required</strong></p>
      <p style="margin: 8px 0 0 0;">Once approved, the system will proceed with Right-to-Rent verification, deposit collection, and contract dispatch.</p>
    </div>
    
    <div style="display: flex; gap: 10px; margin: 20px 0;">
      <a href="${data.approvalUrl}" style="flex: 1; background: #10b981; color: white; padding: 14px 20px; text-decoration: none; border-radius: 6px; text-align: center; font-weight: 600;">
        ✅ Approve Deal
      </a>
      <a href="${data.requestChangesUrl}" style="flex: 1; background: #f59e0b; color: white; padding: 14px 20px; text-decoration: none; border-radius: 6px; text-align: center; font-weight: 600;">
        📝 Request Changes
      </a>
    </div>
  `;
  
  return renderEmailLayout({
    title: "Deal Approval Required",
    preheader: `${data.tenantName} - ${data.propertyName}`,
    heroIcon: "📋",
    bodyHtml,
    footerText: "This approval link expires in 72 hours.",
  });
}

// ============================================================================
// WEEKLY SUMMARY EMAIL
// ============================================================================

interface WeeklySummaryData {
  landlordName: string;
  buildingOrPortfolioName: string;
  weekRange: string;
  
  occupancyForecast: number;
  targetOccupancy: number;
  deltaVsLastWeek: number;
  depositsTaken: number;
  depositValue: number;
  contractsSigned: number;
  contractValue: number;
  
  newLeads: number;
  medianReplyTime: string;
  viewingsBooked: number;
  noShows: number;
  applicationsStarted: number;
  awaitingApprovals: number;
  approveQueueLink?: string;
  
  paymentFailures?: number;
  paymentsQueueLink?: string;
  rtrFailed?: number;
  rtrQueueLink?: string;
  
  topSource: string;
  topSourceConv: number;
  slowStage: string;
  slowStageTime: string;
  callScoreAvg: number;
  improvementVsLastWeek: number;
  
  thisWeekViewings: number;
  icsLink?: string;
}

export function generateWeeklySummaryEmail(data: WeeklySummaryData): string {
  const deltaSymbol = data.deltaVsLastWeek >= 0 ? '+' : '';
  const improvementSymbol = data.improvementVsLastWeek >= 0 ? '+' : '';
  
  let needsAttentionSection = '';
  
  if (data.awaitingApprovals && data.awaitingApprovals > 0) {
    needsAttentionSection += `• ${data.awaitingApprovals} deal(s) waiting on your approval → <a href="${data.approveQueueLink}" style="color: #3b82f6;">Approve now</a><br/>`;
  }
  
  if (data.paymentFailures && data.paymentFailures > 0) {
    needsAttentionSection += `• ${data.paymentFailures} payment(s) failed → <a href="${data.paymentsQueueLink}" style="color: #3b82f6;">Review payments</a><br/>`;
  }
  
  if (data.rtrFailed && data.rtrFailed > 0) {
    needsAttentionSection += `• ${data.rtrFailed} Right to Rent checks failed → <a href="${data.rtrQueueLink}" style="color: #3b82f6;">Review RTR</a><br/>`;
  }
  
  const bodyHtml = `
    <p>Hi ${data.landlordName},</p>
    
    <p>Here's your week at a glance for <strong>${data.buildingOrPortfolioName}</strong> (${data.weekRange}).</p>
    
    <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
      <h3 style="margin-top: 0; color: #374151;">Occupancy & Revenue</h3>
      <p style="margin: 8px 0;">
        • Forecast occupancy: <strong>${data.occupancyForecast}%</strong> (target ${data.targetOccupancy}%) 
        <span style="color: ${data.deltaVsLastWeek >= 0 ? '#10b981' : '#ef4444'};">[${deltaSymbol}${data.deltaVsLastWeek}pp]</span>
      </p>
      <p style="margin: 8px 0;">
        • Deposits taken: <strong>${data.depositsTaken}</strong> | Value: <strong>£${data.depositValue.toLocaleString()}</strong>
      </p>
      <p style="margin: 8px 0;">
        • Contracts signed: <strong>${data.contractsSigned}</strong> | Value: <strong>£${data.contractValue.toLocaleString()}</strong>
      </p>
    </div>
    
    <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
      <h3 style="margin-top: 0; color: #374151;">Pipeline Health</h3>
      <p style="margin: 8px 0;">• New leads: <strong>${data.newLeads}</strong> | Reply time (median): <strong>${data.medianReplyTime}</strong></p>
      <p style="margin: 8px 0;">• Viewings booked: <strong>${data.viewingsBooked}</strong> | No-shows: <strong>${data.noShows}</strong></p>
      <p style="margin: 8px 0;">• Applications started: <strong>${data.applicationsStarted}</strong></p>
      <p style="margin: 8px 0;">• Awaiting approval: <strong>${data.awaitingApprovals}</strong> 
        ${data.approveQueueLink ? `→ <a href="${data.approveQueueLink}" style="color: #3b82f6; font-weight: 600;">Approve now</a>` : ''}
      </p>
    </div>
    
    ${needsAttentionSection ? `
      <div style="background: #fef2f2; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ef4444;">
        <h3 style="margin-top: 0; color: #991b1b;">⚠️ Needs Your Attention</h3>
        ${needsAttentionSection}
      </div>
    ` : ''}
    
    <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
      <h3 style="margin-top: 0; color: #374151;">Top Insights</h3>
      <p style="margin: 8px 0;">• Best source this week: <strong>${data.topSource}</strong> (${data.topSourceConv}% to viewing)</p>
      <p style="margin: 8px 0;">• Slowest stage: <strong>${data.slowStage}</strong> (median ${data.slowStageTime})</p>
      <p style="margin: 8px 0;">• Call quality (AI-scored): <strong>${data.callScoreAvg}/100</strong> 
        <span style="color: ${data.improvementVsLastWeek >= 0 ? '#10b981' : '#ef4444'};">(${improvementSymbol}${data.improvementVsLastWeek} vs last week)</span>
      </p>
    </div>
    
    <div style="background: #eff6ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3b82f6;">
      <h3 style="margin-top: 0; color: #1e40af;">📅 This Week's Calendar</h3>
      <p style="margin: 8px 0;">• Upcoming viewings: <strong>${data.thisWeekViewings}</strong> 
        ${data.icsLink ? `→ <a href="${data.icsLink}" style="color: #3b82f6;">Download .ics</a>` : ''}
      </p>
    </div>
    
    <div style="background: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 8px;">
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        <strong>📎 Attachments:</strong><br/>
        • CSV: Full lead data for the week<br/>
        • PDF: One-page summary report
      </p>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      You don't need to log in for any of this. Approvals and changes are 1-click in the links above.
    </p>
  `;
  
  return renderEmailLayout({
    title: "📊 Weekly Summary",
    preheader: `${data.buildingOrPortfolioName} — Week ${data.weekRange}`,
    bodyHtml,
    footerText: "This is your automated weekly summary from TermFlow.",
  });
}

// ============================================================================
// MONTHLY INVOICE EMAIL
// ============================================================================

interface MonthlyInvoiceData {
  landlordName: string;
  invoiceNumber: string;
  invoiceDate: string;
  billingPeriod: string;
  dueDate: string;
  
  // Subscription
  subscriptionPlan: string;
  subscriptionFee: number;
  
  // Pass-through costs (itemized)
  passThroughCosts: Array<{
    service: string;
    description: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  
  // Totals
  subtotalPassThrough: number;
  totalAmount: number;
  
  // Payment
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  downloadPdfLink?: string;
}

export function generateMonthlyInvoiceEmail(data: MonthlyInvoiceData): string {
  const passThroughRows = data.passThroughCosts.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.service}</strong><br/>
        <span style="color: #6b7280; font-size: 14px;">${item.description}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">£${item.unitCost.toFixed(4)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;"><strong>£${item.totalCost.toFixed(2)}</strong></td>
    </tr>
  `).join('');
  
  const statusColor = data.paymentStatus === 'paid' ? '#10b981' : data.paymentStatus === 'overdue' ? '#ef4444' : '#f59e0b';
  const statusText = data.paymentStatus === 'paid' ? 'PAID' : data.paymentStatus === 'overdue' ? 'OVERDUE' : 'PENDING';
  
  const bodyHtml = `
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
        <div>
          <h1 style="margin: 0; font-size: 28px; color: #111827;">INVOICE</h1>
          <p style="margin: 8px 0 0 0; color: #6b7280;">Invoice #${data.invoiceNumber}</p>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; padding: 6px 16px; background: ${statusColor}; color: white; border-radius: 6px; font-weight: 600; font-size: 14px;">
            ${statusText}
          </span>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px;">
        <div>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">BILLED TO</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; color: #111827;"><strong>${data.landlordName}</strong></p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">INVOICE DATE</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; color: #111827;">${data.invoiceDate}</p>
          <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 14px;">DUE DATE</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; color: #111827;">${data.dueDate}</p>
        </div>
      </div>
    </div>
    
    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
      <div style="background: #f9fafb; padding: 16px; border-bottom: 2px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 600;">BILLING PERIOD: ${data.billingPeriod}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 14px; font-weight: 600;">DESCRIPTION</th>
            <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 14px; font-weight: 600;">QTY</th>
            <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 14px; font-weight: 600;">UNIT COST</th>
            <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 14px; font-weight: 600;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
              <strong>${data.subscriptionPlan}</strong><br/>
              <span style="color: #6b7280; font-size: 14px;">Monthly subscription</span>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">1</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">£${data.subscriptionFee.toFixed(2)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;"><strong>£${data.subscriptionFee.toFixed(2)}</strong></td>
          </tr>
          
          ${passThroughRows}
        </tbody>
      </table>
    </div>
    
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <span style="color: #6b7280;">Subscription</span>
        <span style="color: #111827; font-weight: 600;">£${data.subscriptionFee.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <span style="color: #6b7280;">Pass-through costs</span>
        <span style="color: #111827; font-weight: 600;">£${data.subtotalPassThrough.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 16px 0 0 0;">
        <span style="font-size: 18px; font-weight: 600; color: #111827;">TOTAL</span>
        <span style="font-size: 24px; font-weight: 700; color: #111827;">£${data.totalAmount.toFixed(2)}</span>
      </div>
    </div>
    
    <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #3b82f6;">
      <p style="margin: 0; color: #1e40af;">
        <strong>💳 Payment Method:</strong> ${data.paymentMethod}
      </p>
    </div>
    
    ${data.downloadPdfLink ? `
      <div style="text-align: center; margin-top: 24px;">
        <a href="${data.downloadPdfLink}" style="display: inline-block; padding: 12px 32px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
          📄 Download PDF Invoice
        </a>
      </div>
    ` : ''}
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 24px; text-align: center;">
      Questions about this invoice? Contact us at <a href="mailto:billing@termflow.com" style="color: #3b82f6;">billing@termflow.com</a>
    </p>
  `;
  
  return renderEmailLayout({
    title: "📄 Monthly Invoice",
    preheader: `Your invoice for ${data.billingPeriod} is ready`,
    bodyHtml,
    footerText: "Thank you for using TermFlow.",
  });
}

// ============================================================================
// EMAIL AUTO-REPLY (Portal Lead Capture)
// ============================================================================

interface EmailAutoReplyData {
  studentName?: string;
  propertyName?: string;
  whatsappLink: string;
  formLink: string;
}

export function generateEmailAutoReply(data: EmailAutoReplyData): string {
  const greeting = data.studentName ? `Hi ${data.studentName}` : 'Hi there';
  const propertyMention = data.propertyName ? ` about ${data.propertyName}` : '';
  
  const bodyHtml = `
    <p style="font-size: 16px; color: #111827;">
      ${greeting}! 👋
    </p>
    
    <p style="font-size: 16px; color: #111827;">
      Thanks for your enquiry${propertyMention}. We reply fastest on WhatsApp - you'll get instant responses about:
    </p>
    
    <ul style="color: #374151; line-height: 1.8;">
      <li>📅 <strong>Viewing slots</strong> (in-person, video, or self-guided)</li>
      <li>🏠 <strong>Room availability</strong> and pricing</li>
      <li>📝 <strong>Application and booking</strong></li>
    </ul>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 24px 0;">
      <p style="margin: 0 0 12px 0; color: #111827; font-weight: 600;">Choose how to continue:</p>
      
      <div style="margin-bottom: 12px;">
        <a href="${data.whatsappLink}" style="display: block; background: #25D366; color: white; padding: 14px 20px; text-decoration: none; border-radius: 6px; text-align: center; font-weight: 600; font-size: 16px;">
          💬 Chat on WhatsApp (Fastest)
        </a>
      </div>
      
      <div>
        <a href="${data.formLink}" style="display: block; background: #3b82f6; color: white; padding: 14px 20px; text-decoration: none; border-radius: 6px; text-align: center; font-weight: 600; font-size: 16px;">
          📝 Use Quick Form (30 seconds)
        </a>
      </div>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      You'll get viewing options and next steps instantly!
    </p>
  `;
  
  return renderEmailLayout({
    title: "Quick Reply",
    heroIcon: "⚡",
    preheader: "Get instant viewing slots and availability",
    bodyHtml,
    footerText: "This is an automated response. Your enquiry is important to us.",
  });
}

// ============================================================================
// TASK DELEGATION EMAIL
// ============================================================================

interface TaskDelegationEmailData {
  delegatedToName?: string;
  landlordName?: string;
  companyName?: string;
  tasks: Array<{
    taskType: string;
    taskSection: string;
    taskDescription: string;
  }>;
  accessToken: string;
  expiresAt: Date;
}

export function generateTaskDelegationEmail(data: TaskDelegationEmailData): string {
  const baseUrl = process.env.BASE_URL || 'https://termflow.com';
  const delegationUrl = `${baseUrl}/onboarding/delegated/${data.accessToken}`;
  const expiryDate = data.expiresAt.toLocaleDateString('en-GB');
  
  const tasksListHtml = data.tasks.map(task => `
    <div style="background: white; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #3b82f6;">
      <div style="font-weight: 600; color: #1f2937; margin-bottom: 5px;">${task.taskType}</div>
      <div style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">Section: ${task.taskSection}</div>
      <div style="color: #4b5563;">${task.taskDescription}</div>
    </div>
  `).join('');

  return renderEmailLayout({
    title: 'Onboarding Tasks Delegated to You',
    heroIcon: '📋',
    preheader: `${data.landlordName || 'A team member'} has delegated ${data.tasks.length} onboarding task(s) to you`,
    bodyHtml: `
      <p>Hello ${data.delegatedToName ? `<strong>${data.delegatedToName}</strong>` : 'there'},</p>
      
      <p>${data.landlordName || 'A team member'} from <strong>${data.companyName || 'their organization'}</strong> has delegated ${data.tasks.length} onboarding task(s) to you for completion:</p>
      
      ${tasksListHtml}
      
      <p style="margin-top: 25px;">Please complete these tasks by <strong>${expiryDate}</strong>. Click the button below to access your secure delegation portal:</p>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>⏰ Important:</strong> This delegation link expires on ${expiryDate}. Please complete the tasks before this date.
        </p>
      </div>
    `,
    ctaText: 'Complete Delegated Tasks',
    ctaUrl: delegationUrl,
    footerText: 'This delegation was created as part of the TermFlow onboarding process.'
  });
}

// ============================================================================
// ONBOARDING COMPLETION EMAIL
// ============================================================================

interface OnboardingCompletionEmailData {
  landlordName?: string;
  companyName?: string;
  completedSections: number;
  totalSections: number;
  delegatedTasks?: number;
  paymentCompleted: boolean;
  subscriptionPlan?: string;
}

export function generateOnboardingCompletionEmail(data: OnboardingCompletionEmailData): string {
  const baseUrl = process.env.BASE_URL || 'https://termflow.com';
  const dashboardUrl = `${baseUrl}/dashboard`;
  
  const statusItems = [
    `✅ Completed ${data.completedSections}/${data.totalSections} onboarding sections`,
    data.paymentCompleted ? `✅ Subscription activated: ${data.subscriptionPlan || 'Standard Plan'}` : '⏳ Payment pending',
    data.delegatedTasks ? `📋 ${data.delegatedTasks} task(s) delegated to team members` : '✅ All tasks completed directly'
  ];

  return renderEmailLayout({
    title: 'Onboarding Complete! 🎉',
    heroIcon: '🎉',
    preheader: 'Your TermFlow onboarding is complete and your account is ready',
    bodyHtml: `
      <p>Hello ${data.landlordName ? `<strong>${data.landlordName}</strong>` : 'there'},</p>
      
      <p>Congratulations! You've successfully completed the TermFlow onboarding process for <strong>${data.companyName || 'your organization'}</strong>.</p>
      
      <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; color: #065f46;">✨ Onboarding Summary</h3>
        ${statusItems.map(item => `<p style="margin: 5px 0; color: #047857;">${item}</p>`).join('')}
      </div>
      
      ${data.delegatedTasks ? `
        <p>The tasks you delegated to your team members are now in progress. You'll receive notifications when they're completed.</p>
      ` : ''}
      
      <p><strong>What's Next?</strong></p>
      <ul style="color: #4b5563;">
        <li>Access your dashboard to manage properties and leads</li>
        <li>Configure your AI chatbot settings</li>
        <li>Set up your first property listing</li>
        <li>Start receiving and managing tenant enquiries</li>
      </ul>
      
      <p>Our AI-powered platform is now ready to automate your student lettings process 24/7!</p>
    `,
    ctaText: 'Go to Dashboard',
    ctaUrl: dashboardUrl,
    footerText: 'Welcome to TermFlow! If you need help getting started, our support team is here for you.'
  });
}

// ============================================================================
// ONBOARDING WELCOME EMAIL WITH TRIAL & INVOICE
// ============================================================================

interface OnboardingWelcomeWithInvoiceData {
  landlordName: string;
  landlordEmail: string;
  planName: string;
  monthlyAmount: number;
  trialDays: number;
  firstChargeDate: string;
  cardLast4?: string;
}

export function generateOnboardingWelcomeWithInvoiceEmail(data: OnboardingWelcomeWithInvoiceData): string {
  const baseUrl = process.env.BASE_URL || 'https://termflow.com';
  const dashboardUrl = `${baseUrl}/dashboard`;
  const settingsUrl = `${baseUrl}/settings`;
  
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + (data.trialDays - 1));
  
  return renderEmailLayout({
    title: `Welcome to TermFlow! Your ${data.trialDays}-Day Free Trial Starts Now`,
    heroIcon: '🎉',
    preheader: `No charge today - Your ${data.trialDays}-day free trial has begun. First payment on ${data.firstChargeDate}`,
    bodyHtml: `
      <p>Hello <strong>${data.landlordName}</strong>,</p>
      
      <p>Welcome to TermFlow! Your account is now active and your <strong>${data.trialDays}-day free trial</strong> has started.</p>
      
      <div style="background: #dcfce7; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 6px;">
        <h3 style="margin: 0 0 15px 0; color: #065f46;">✅ Card Verified - No Charge Today</h3>
        <p style="margin: 0; color: #047857; font-size: 15px;">
          We've verified your payment method but <strong>haven't charged you anything</strong>. 
          You have full access to all ${data.planName} features at no cost until ${trialEndDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
        </p>
      </div>
      
      <h3 style="color: #1f2937; margin-top: 30px;">📋 Your Trial & Billing Schedule</h3>
      
      <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 2px solid #e5e7eb;">
        <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 15px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span style="color: #6b7280;">Trial Period:</span>
            <strong>${data.trialDays} days (no charge)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span style="color: #6b7280;">Trial Ends:</span>
            <strong>${trialEndDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
          </div>
        </div>
        
        <div style="background: #fff7ed; padding: 15px; border-radius: 6px; border-left: 4px solid #f97316;">
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span style="color: #9a3412; font-weight: 600;">First Charge (Day ${data.trialDays + 1}):</span>
            <strong style="color: #ea580c; font-size: 18px;">£${data.monthlyAmount}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span style="color: #9a3412;">Charge Date:</span>
            <strong style="color: #9a3412;">${data.firstChargeDate}</strong>
          </div>
          <p style="margin: 10px 0 0 0; color: #9a3412; font-size: 13px;">
            This covers your first month of ${data.planName} access
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 15px;">
          <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span style="color: #6b7280;">Monthly Thereafter:</span>
            <strong>£${data.monthlyAmount}/month (recurring)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span style="color: #6b7280;">Payment Method:</span>
            <strong>Card ending ${data.cardLast4 || '••••'}</strong>
          </div>
        </div>
      </div>
      
      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; color: #1e40af; font-size: 14px;">
          <strong>📧 Invoice Summary:</strong> This email serves as your invoice record. On ${data.firstChargeDate}, 
          you will be charged <strong>£${data.monthlyAmount}</strong> for your ${data.planName} subscription, which will then recur monthly.
        </p>
      </div>
      
      <h3 style="color: #1f2937; margin-top: 30px;">🚀 Get Started</h3>
      <ul style="color: #4b5563; line-height: 1.8;">
        <li>Access your dashboard to set up properties</li>
        <li>Configure your AI chatbot (Ava) settings</li>
        <li>Connect your WhatsApp and email channels</li>
        <li>Import your existing leads and viewings</li>
        <li>Start automating your lettings process!</li>
      </ul>
      
      <p style="margin-top: 25px; color: #6b7280; font-size: 14px;">
        <strong>Need to cancel?</strong> You can cancel anytime before ${trialEndDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} 
        to avoid any charges. Visit your <a href="${settingsUrl}" style="color: #3b82f6;">account settings</a> to manage your subscription.
      </p>
    `,
    ctaText: 'Go to Dashboard',
    ctaUrl: dashboardUrl,
    footerText: `Questions about your trial or billing? Reply to this email or contact us at support@termflow.com`
  });
}
