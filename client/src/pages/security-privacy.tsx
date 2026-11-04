import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Shield, Lock, Database, FileText, Bell, Download, Server, HardDrive, Key, UserCheck, AlertTriangle, ExternalLink } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import openaiLogo from "@assets/stock_images/openai_company_logo__848dc366.jpg";
import twilioLogo from "@assets/stock_images/twilio_company_logo__3bd12c37.jpg";
import whatsappLogo from "@assets/stock_images/whatsapp_logo.png";
import stripeLogo from "@assets/stock_images/stripe_payment_compa_ee771d19.jpg";
import googleLogo from "@assets/stock_images/google_company_logo__af0689fd.jpg";
import googleCalendarLogo from "@assets/stock_images/google_calendar_logo.png";
import googleSheetsLogo from "@assets/stock_images/google_sheets_logo.png";
import justcallLogo from "@assets/stock_images/justcall_logo.jpg";
import neonLogo from "@assets/stock_images/neon_database_compan_c767576d.jpg";
import replitLogo from "@assets/stock_images/replit_company_logo__ce51c33d.jpg";
import n8nLogo from "@assets/stock_images/n8n_logo.png";
import docusignLogo from "@assets/stock_images/docusign_official_co_2f44ccbc.jpg";

export default function SecurityPrivacy() {
  return (
    <div className="p-8 max-w-7xl mx-auto print:p-4">
      <SEOHead
        title="Security & Privacy - GDPR Compliance | TermFlow"
        description="Learn how TermFlow protects tenant data with encryption, GDPR compliance, and transparent privacy practices for student lettings."
        ogTitle="Security & Privacy - GDPR Compliance | TermFlow"
        ogDescription="Learn how TermFlow protects tenant data with encryption, GDPR compliance, and transparent privacy practices for student lettings."
        ogType="website"
        twitterCard="summary_large_image"
        twitterTitle="Security & Privacy - GDPR Compliance | TermFlow"
        twitterDescription="Learn how TermFlow protects tenant data with encryption, GDPR compliance, and transparent privacy practices for student lettings."
      />

      <div className="mb-6">
        <Breadcrumb data-testid="breadcrumb-security-privacy">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" data-testid="link-home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage data-testid="text-current-page">Security & Privacy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center justify-between mb-6 print:mb-4">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3" data-testid="text-page-title">
            <Shield className="h-8 w-8 text-primary" />
            Security & Privacy
          </h1>
          <p className="text-muted-foreground mt-2" data-testid="text-page-subtitle">
            How we protect your data and ensure GDPR compliance
          </p>
        </div>
        <Button variant="outline" className="print:hidden" data-testid="button-download-pdf">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="space-y-6">
        {/* Data Protection Impact Assessment (DPIA) Summary */}
        <Card data-testid="card-dpia-summary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Data Protection Impact Assessment (DPIA) Summary
            </CardTitle>
            <CardDescription>
              Our comprehensive approach to protecting tenant data in student lettings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg" data-testid="text-what-we-process">What We Process</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Tenant personal data (names, emails, phone numbers)</li>
                  <li>• University details and course information</li>
                  <li>• Viewing preferences and application data</li>
                  <li>• Right-to-Rent documents (passport, visa, share codes)</li>
                  <li>• Financial data for security deposits</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg" data-testid="text-why-we-process">Why We Process It</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Lettings automation from enquiry to move-in</li>
                  <li>• Contract management and tenancy agreements</li>
                  <li>• Deposit processing and financial transactions</li>
                  <li>• Right-to-Rent compliance (UK legal requirement)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg" data-testid="text-legal-basis">Legal Basis</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Legitimate interest:</strong> Lettings automation</li>
                  <li>• <strong>Contract performance:</strong> Tenancy agreements</li>
                  <li>• <strong>Legal obligation:</strong> Right-to-Rent checks</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2" data-testid="text-risk-assessment">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Risk Assessment
                </h3>
                <p className="text-sm text-muted-foreground">
                  <strong>High-risk processing</strong> due to financial data and identity documents
                </p>
              </div>

              <div className="space-y-3 md:col-span-2">
                <h3 className="font-semibold text-lg" data-testid="text-mitigation-measures">Mitigation Measures</h3>
                <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>• End-to-end encryption (TLS 1.3)</div>
                  <div>• Role-based access controls</div>
                  <div>• Comprehensive audit logs</div>
                  <div>• Regular staff training</div>
                  <div>• Data Processing Agreements with all subprocessors</div>
                  <div>• Automated data retention policies</div>
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <h3 className="font-semibold text-lg" data-testid="text-data-subject-rights">Data Subject Rights</h3>
                <p className="text-sm text-muted-foreground">
                  All tenants have the right to: Access, Rectification, Erasure, Portability, Objection, and Restriction of processing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hosting & Infrastructure */}
        <Card data-testid="card-hosting-residency">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              Hosting & Infrastructure
            </CardTitle>
            <CardDescription>
              UK/EU data residency ensuring compliance with GDPR and Data Protection Act 2018
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">UK/EU Data Residency</h3>
              <p className="text-muted-foreground">
                All TermFlow infrastructure and data storage is located exclusively within 
                UK/EU jurisdiction to comply with GDPR and Data Protection Act 2018.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Primary database: Neon PostgreSQL (AWS eu-west-2, London, UK)</li>
                <li>Object storage: Google Cloud Storage (europe-west2, London, UK)</li>
                <li>Application hosting: Replit EU region</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Data Never Leaves UK/EU</h3>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>GDPR Guarantee</AlertTitle>
                <AlertDescription>
                  Your tenant data is never transferred to or processed in non-EU jurisdictions. 
                  All infrastructure providers maintain GDPR compliance and UK/EU data residency.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Encryption & Security */}
        <Card data-testid="card-encryption-security">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Encryption & Security
            </CardTitle>
            <CardDescription>
              Multi-layer security protecting data in transit and at rest
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">In Transit</h3>
                <p className="text-sm text-muted-foreground">
                  TLS 1.3 encryption for all API requests and webhook communications
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">At Rest</h3>
                <p className="text-sm text-muted-foreground">
                  AES-256 encryption for database and object storage
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  Secrets Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Environment variables with rotation capabilities, never stored in code
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Session Security</h3>
                <p className="text-sm text-muted-foreground">
                  Encrypted session tokens, HTTP-only cookies, CSRF protection
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h3 className="font-semibold">Webhook Security</h3>
                <p className="text-sm text-muted-foreground">
                  HMAC signature verification for all incoming webhooks (Stripe, Twilio, JustCall, e-signature providers)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention & Deletion */}
        <Card data-testid="card-data-retention">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Data Retention & Deletion
            </CardTitle>
            <CardDescription>
              Automated retention schedules ensuring compliance with UK legal requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table data-testid="table-retention-periods">
              <TableHeader>
                <TableRow>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Retention Period</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Tenant Profiles</TableCell>
                  <TableCell>2 years after tenancy end</TableCell>
                  <TableCell>Legal claims period</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Conversation Logs</TableCell>
                  <TableCell>1 year after tenancy end</TableCell>
                  <TableCell>Quality assurance</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Right-to-Rent Documents</TableCell>
                  <TableCell>2 years after tenancy end</TableCell>
                  <TableCell>Legal requirement (UK Immigration Act)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Payment Records</TableCell>
                  <TableCell>7 years after transaction</TableCell>
                  <TableCell>HMRC/tax compliance</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Call Recordings</TableCell>
                  <TableCell>6 months</TableCell>
                  <TableCell>Staff training & quality</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Viewing Bookings</TableCell>
                  <TableCell>1 year</TableCell>
                  <TableCell>Analytics & insights</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="bg-primary/5 p-4 rounded-md border border-primary/20">
              <h4 className="font-semibold text-sm mb-2">Automated Deletion</h4>
              <p className="text-sm text-muted-foreground">
                Data is automatically purged after retention periods expire. Our automated systems ensure no data is kept longer than legally required or necessary for business purposes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Records of Processing Activities (ROPA) */}
        <Card data-testid="card-ropa">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Records of Processing Activities (ROPA)
            </CardTitle>
            <CardDescription>
              Complete transparency on how we process tenant data at each stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table data-testid="table-ropa">
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Data Categories</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Legal Basis</TableHead>
                    <TableHead>Retention</TableHead>
                    <TableHead>Recipients</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Lead Capture</TableCell>
                    <TableCell>Name, email, phone, university, course</TableCell>
                    <TableCell>Enquiry management</TableCell>
                    <TableCell>Legitimate interest</TableCell>
                    <TableCell>2 years</TableCell>
                    <TableCell>Landlord only</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">AI Conversations</TableCell>
                    <TableCell>Messages, preferences</TableCell>
                    <TableCell>Viewing booking automation</TableCell>
                    <TableCell>Legitimate interest</TableCell>
                    <TableCell>1 year</TableCell>
                    <TableCell>OpenAI (DPA), Landlord</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Viewing Scheduling</TableCell>
                    <TableCell>Name, date/time preferences</TableCell>
                    <TableCell>Appointment booking</TableCell>
                    <TableCell>Legitimate interest</TableCell>
                    <TableCell>1 year</TableCell>
                    <TableCell>Shared Calendar API, Landlord</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Right-to-Rent Checks</TableCell>
                    <TableCell>Passport, visa, share codes</TableCell>
                    <TableCell>Legal compliance</TableCell>
                    <TableCell>Legal obligation</TableCell>
                    <TableCell>2 years</TableCell>
                    <TableCell>RTR API provider, Landlord</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Contract Signing</TableCell>
                    <TableCell>Full name, address, signature</TableCell>
                    <TableCell>Tenancy agreement</TableCell>
                    <TableCell>Contract performance</TableCell>
                    <TableCell>7 years</TableCell>
                    <TableCell>DocuSign API (DPA), Landlord</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Deposit Processing</TableCell>
                    <TableCell>Bank details, payment data</TableCell>
                    <TableCell>Security deposit</TableCell>
                    <TableCell>Contract performance</TableCell>
                    <TableCell>7 years</TableCell>
                    <TableCell>Stripe (DPA), Landlord</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Call Logs</TableCell>
                    <TableCell>Voice recordings, transcripts</TableCell>
                    <TableCell>Quality assurance</TableCell>
                    <TableCell>Legitimate interest</TableCell>
                    <TableCell>6 months</TableCell>
                    <TableCell>JustCall (DPA), Landlord</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Subprocessors & Third Parties */}
        <Card data-testid="card-subprocessors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Subprocessors & Third Parties
            </CardTitle>
            <CardDescription>
              All third-party processors we work with, each with a Data Processing Agreement (DPA) in place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div className="flex items-center gap-3">
                  <img src={openaiLogo} alt="OpenAI" className="h-12 w-12 object-contain" />
                  <div>
                    <p className="font-medium">OpenAI</p>
                    <p className="text-sm text-muted-foreground">AI chatbot</p>
                  </div>
                </div>
                <a 
                  href="https://openai.com/policies/privacy-policy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-openai"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div className="flex items-center gap-3">
                  <img src={whatsappLogo} alt="WhatsApp" className="h-12 w-12 object-contain" />
                  <div>
                    <p className="font-medium">WhatsApp (via Twilio)</p>
                    <p className="text-sm text-muted-foreground">Messaging platform</p>
                  </div>
                </div>
                <a 
                  href="https://www.twilio.com/legal/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-twilio"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div className="flex items-center gap-3">
                  <img src={stripeLogo} alt="Stripe" className="h-12 w-12 object-contain" />
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-muted-foreground">Payments (PCI-DSS)</p>
                  </div>
                </div>
                <a 
                  href="https://stripe.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-stripe"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div className="flex items-center gap-3">
                  <img src={googleCalendarLogo} alt="Google Calendar" className="h-12 w-12 object-contain" />
                  <div>
                    <p className="font-medium">Google Calendar</p>
                    <p className="text-sm text-muted-foreground">Scheduling & calendar</p>
                  </div>
                </div>
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-google-calendar"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div className="flex items-center gap-3">
                  <img src={googleSheetsLogo} alt="Google Sheets" className="h-12 w-12 object-contain" />
                  <div>
                    <p className="font-medium">Google Sheets</p>
                    <p className="text-sm text-muted-foreground">Data management</p>
                  </div>
                </div>
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-google-sheets"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div className="flex items-center gap-3">
                  <img src={justcallLogo} alt="JustCall" className="h-12 w-12 object-contain" />
                  <div>
                    <p className="font-medium">JustCall</p>
                    <p className="text-sm text-muted-foreground">Call recording</p>
                  </div>
                </div>
                <a 
                  href="https://justcall.io/privacy-policy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-justcall"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div className="flex items-center gap-3">
                  <img src={docusignLogo} alt="DocuSign" className="h-12 w-12 object-contain" />
                  <div>
                    <p className="font-medium">DocuSign</p>
                    <p className="text-sm text-muted-foreground">E-signature</p>
                  </div>
                </div>
                <a 
                  href="https://www.signable.co.uk/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-signable"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div className="flex items-center gap-3">
                  <img src={neonLogo} alt="Neon" className="h-12 w-12 object-contain" />
                  <div>
                    <p className="font-medium">Neon</p>
                    <p className="text-sm text-muted-foreground">Database hosting</p>
                  </div>
                </div>
                <a 
                  href="https://neon.tech/privacy-policy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-neon"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div className="flex items-center gap-3">
                  <img src={replitLogo} alt="Replit" className="h-12 w-12 object-contain" />
                  <div>
                    <p className="font-medium">Replit</p>
                    <p className="text-sm text-muted-foreground">Infrastructure</p>
                  </div>
                </div>
                <a 
                  href="https://replit.com/site/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-replit"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div className="flex items-center gap-3">
                  <img src={n8nLogo} alt="n8n" className="h-12 w-12 object-contain" />
                  <div>
                    <p className="font-medium">n8n</p>
                    <p className="text-sm text-muted-foreground">Workflow automation</p>
                  </div>
                </div>
                <a 
                  href="https://n8n.io/legal/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-n8n"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Rights (GDPR Article 15-22) */}
        <Card data-testid="card-tenant-rights">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Tenant Rights (GDPR Article 15-22)
            </CardTitle>
            <CardDescription>
              Your comprehensive rights under UK GDPR and Data Protection Act 2018
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full" data-testid="accordion-tenant-rights">
              <AccordionItem value="access">
                <AccordionTrigger data-testid="trigger-right-access">Right to Access (Article 15)</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    You have the right to request a copy of all your personal data we hold. We will provide this in a commonly used electronic format within 30 days of your request. Contact <a href="mailto:privacy@termflow.com" className="text-primary hover:underline">privacy@termflow.com</a> to exercise this right.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rectification">
                <AccordionTrigger data-testid="trigger-right-rectification">Right to Rectification (Article 16)</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    If any of your personal data is inaccurate or incomplete, you have the right to have it corrected or completed. We will update your information within 72 hours of receiving your request and notify any third parties who received the data.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="erasure">
                <AccordionTrigger data-testid="trigger-right-erasure">Right to Erasure (Article 17)</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    You can request deletion of your personal data, subject to legal retention requirements (e.g., tax records must be kept for 7 years, Right-to-Rent documents for 2 years). We will delete all data not subject to legal retention within 30 days.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="restriction">
                <AccordionTrigger data-testid="trigger-right-restriction">Right to Restrict Processing (Article 18)</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    You can request that we pause processing of your personal data during disputes or while we verify accuracy. Your data will be stored but not used until the issue is resolved.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="portability">
                <AccordionTrigger data-testid="trigger-right-portability">Right to Data Portability (Article 20)</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    You can request your personal data in a machine-readable format (JSON or CSV) to transfer to another service provider. We will provide this within 30 days at no cost.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="object">
                <AccordionTrigger data-testid="trigger-right-object">Right to Object (Article 21)</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    You can object to processing of your data for marketing purposes or where we rely on legitimate interests. We will stop processing unless we have compelling legitimate grounds that override your rights.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="automated">
                <AccordionTrigger data-testid="trigger-automated-decision">Automated Decision-Making (Article 22)</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    AI is involved in initial conversation handling and viewing scheduling, but all final tenancy decisions are made by the landlord. You have the right to request human review of any automated decisions that significantly affect you.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-6 p-4 bg-primary/5 rounded-md border border-primary/20">
              <p className="text-sm font-medium mb-2">Contact for Data Subject Requests</p>
              <p className="text-sm text-muted-foreground">
                To exercise any of these rights, email <a href="mailto:privacy@termflow.com" className="text-primary hover:underline font-medium">privacy@termflow.com</a> with your request. We will respond within 30 days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Incident Response */}
        <Card data-testid="card-incident-response">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Security Incident Response
            </CardTitle>
            <CardDescription>
              How we detect, respond to, and communicate security breaches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Breach Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Automated monitoring and alerting systems detect anomalous activity 24/7
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Notification Timeline</h3>
                <p className="text-sm text-muted-foreground">
                  72 hours to ICO (Information Commissioner's Office), immediate notification to affected users
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Incident Log</h3>
                <p className="text-sm text-muted-foreground">
                  All breaches are recorded and reviewed quarterly with corrective actions implemented
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Security Contact</h3>
                <p className="text-sm text-muted-foreground">
                  Report security concerns to <a href="mailto:security@termflow.com" className="text-primary hover:underline font-medium">security@termflow.com</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates & Changes */}
        <Card data-testid="card-updates-changes">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Updates & Changes
            </CardTitle>
            <CardDescription>
              Policy version history and notification procedures
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Last Updated</h3>
              <p className="text-sm text-muted-foreground">October 2025</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Change Notifications</h3>
              <p className="text-sm text-muted-foreground">
                We will email all landlords 30 days before any material policy changes take effect, giving you time to review and provide feedback.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Version History</h3>
              <p className="text-sm text-muted-foreground">
                Full changelog available at <a href="/changelog" className="text-primary hover:underline">termflow.com/changelog</a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Residency & Sovereignty */}
        <section>
          <h2 className="text-2xl font-semibold mb-4" data-testid="text-data-residency-title">Data Residency & Sovereignty</h2>
          
          <Card className="mb-6" data-testid="card-data-residency">
            <CardHeader>
              <CardTitle>Where Your Data Is Stored</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Primary Database - UK/EU Region</h3>
                <p className="text-muted-foreground">
                  All tenant data (applications, viewings, contracts, messages) is stored exclusively 
                  in UK/EU data centers using Neon PostgreSQL (AWS eu-west-2, London).
                </p>
                <Alert className="mt-2" data-testid="alert-gdpr-compliant">
                  <Shield className="h-4 w-4" />
                  <AlertTitle>GDPR Compliant</AlertTitle>
                  <AlertDescription>
                    Data never leaves UK/EU jurisdiction. No US-based storage.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Object Storage - UK Region</h3>
                <p className="text-muted-foreground">
                  Property images and documents stored in Google Cloud Storage UK region (europe-west2).
                  All files encrypted at rest with AES-256.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Third-Party Services - Data Processing Agreements</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>Stripe:</strong> Payment data processed via UK entity with DPA in place</li>
                  <li><strong>Twilio:</strong> WhatsApp messages stored in EU region (Dublin)</li>
                  <li><strong>OpenAI:</strong> AI processing with zero data retention (enterprise agreement)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cross-Border Data Transfers */}
        <section>
          <h2 className="text-2xl font-semibold mb-4" data-testid="text-cross-border-title">Cross-Border Data Transfers</h2>
          
          <Card data-testid="card-cross-border-transfers">
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                TermFlow implements Standard Contractual Clauses (SCCs) for any third-party 
                services that may process data outside the UK/EU:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>OpenAI API calls use EU-based endpoints where available</li>
                <li>Stripe processes payments via UK entity (no US transfer)</li>
                <li>Twilio WhatsApp uses EU data centers (Dublin)</li>
                <li>All sub-processors maintain GDPR compliance</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Footer Note */}
        <div className="text-center py-6 text-sm text-muted-foreground print:py-2">
          <p>
            For questions about this policy, contact{" "}
            <a href="mailto:privacy@termflow.com" className="text-primary hover:underline font-medium">
              privacy@termflow.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
