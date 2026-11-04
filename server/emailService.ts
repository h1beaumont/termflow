import nodemailer from 'nodemailer';

interface EmailAttachment {
  filename: string;
  path?: string;
  content?: Buffer;
  contentType?: string;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig | null = null;
  
  constructor() {
    this.initialize();
  }
  
  private initialize() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || 'noreply@termflow.com';
    
    if (!host || !port || !user || !pass) {
      console.warn('⚠️  SMTP not configured. Email reminders will be logged to console only.');
      console.warn('   To enable emails, set: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS');
      return;
    }
    
    this.config = {
      host,
      port: parseInt(port),
      secure: parseInt(port) === 465,
      auth: { user, pass },
      from,
    };
    
    this.transporter = nodemailer.createTransport(this.config);
    console.log('✅ Email service configured successfully');
  }
  
  async sendEmail(
    to: string, 
    subject: string, 
    html: string,
    attachments?: EmailAttachment[]
  ): Promise<boolean> {
    if (!this.transporter) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 EMAIL (would send if SMTP configured):');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${html.substring(0, 200)}...`);
      if (attachments) {
        console.log(`Attachments: ${attachments.map(a => a.filename).join(', ')}`);
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return false;
    }
    
    try {
      await this.transporter.sendMail({
        from: this.config!.from,
        to,
        subject,
        html,
        attachments,
      });
      console.log(`✅ Email sent to ${to}: ${subject}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send email to ${to}:`, error);
      return false;
    }
  }
  
  isConfigured(): boolean {
    return this.transporter !== null;
  }

  async sendDemoBookingConfirmation(data: {
    to: string;
    name: string;
    company: string;
    numberOfBeds: string;
    preferredDateTime: string;
  }): Promise<boolean> {
    const subject = `Demo Booking Confirmed - ${data.company}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #14213D; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 30px; }
          .info-row { margin: 15px 0; }
          .info-label { font-weight: bold; color: #14213D; }
          .cta { background-color: #9EF01A; color: #14213D; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; font-weight: bold; }
          .footer { text-align: center; color: #64748B; font-size: 14px; margin-top: 30px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Demo Booking Confirmed</h1>
          </div>
          <div class="content">
            <p>Hi ${data.name},</p>
            
            <p>Thank you for booking a demo of TermFlow! We're excited to show you how our AI automation platform can transform your student lettings operations.</p>
            
            <h3>Your Booking Details:</h3>
            <div class="info-row">
              <span class="info-label">Company:</span> ${data.company}
            </div>
            <div class="info-row">
              <span class="info-label">Portfolio Size:</span> ${data.numberOfBeds} beds
            </div>
            <div class="info-row">
              <span class="info-label">Preferred Time:</span> ${data.preferredDateTime}
            </div>
            
            <p>Our team will be in touch shortly to confirm the exact date and time for your demo.</p>
            
            <p><strong>What to expect in your demo:</strong></p>
            <ul>
              <li>Live demonstration of our WhatsApp AI automation</li>
              <li>Automated viewing booking and contract generation</li>
              <li>Multi-channel conversation memory system</li>
              <li>ROI calculation based on your portfolio size</li>
              <li>Integration options with your existing systems</li>
            </ul>
            
            <p>In the meantime, feel free to explore our website or reply to this email if you have any questions.</p>
            
            <a href="https://termflow.com" class="cta">Visit TermFlow</a>
          </div>
          <div class="footer">
            <p>TermFlow - AI automation for student lettings (PBSA)</p>
            <p>Questions? Reply to this email or call us</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return await this.sendEmail(data.to, subject, html);
  }
}

export const emailService = new EmailService();
