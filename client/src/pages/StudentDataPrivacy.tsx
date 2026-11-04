import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Lock, Database, FileText, Key, Server, Eye, Download, ExternalLink, AlertTriangle } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { SiteSearch } from "@/components/SiteSearch";
import openaiLogo from "@assets/stock_images/openai_company_logo__848dc366.jpg";
import twilioLogo from "@assets/stock_images/twilio_company_logo__3bd12c37.jpg";
import stripeLogo from "@assets/Stripe_Logo_1_1760546998208.png";

export default function StudentDataPrivacy() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Security", url: "/security-privacy" },
    { name: "Student Data Privacy", url: "/security/student-data-privacy" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="Student Data Privacy & Security | TermFlow GDPR Compliance"
        description="Learn how TermFlow protects student data with GDPR compliance, UK data residency, AES-256 encryption, and transparent privacy practices for PBSA operators."
        keywords="student data privacy, GDPR compliance, UK data residency, student accommodation security, Right-to-Rent data protection"
        canonical="https://termflow.co.uk/security/student-data-privacy"
        ogUrl="https://termflow.co.uk/security/student-data-privacy"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <TermFlowWordmark />
            <SiteSearch />
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">
              Home
            </a>
            <Button asChild size="sm" variant="outline" data-testid="button-book-demo">
              <a href="/book-demo">Book Demo</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <LastUpdated date="January 20, 2025" className="mb-8" />

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              Student Data Privacy & Security
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            How TermFlow protects student data with GDPR compliance, UK data residency, enterprise-grade encryption, and complete transparency.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Button variant="outline" size="sm" data-testid="button-download-pdf">
              <Download className="h-4 w-4 mr-2" />
              Download Security Overview (PDF)
            </Button>
          </div>
        </div>

        {/* GDPR Guarantee */}
        <Alert className="mb-8 border-2 border-tf-navy" data-testid="alert-gdpr-guarantee">
          <Shield className="h-5 w-5 text-tf-navy" />
          <AlertTitle className="text-lg font-bold">GDPR & UK Data Protection Guarantee</AlertTitle>
          <AlertDescription className="text-base mt-2">
            All student data is stored exclusively in UK/EU data centres. TermFlow is fully compliant with GDPR and the UK Data Protection Act 2018. Your data never leaves UK/EU jurisdiction.
          </AlertDescription>
        </Alert>

        {/* How We Handle Student Data */}
        <Card className="mb-8" data-testid="card-data-handling">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-tf-navy" />
              How We Handle Student Data
            </CardTitle>
            <CardDescription>
              What we process, why we process it, and how we protect it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">What Student Data We Process</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Personal details (name, email, phone number, date of birth)</li>
                  <li>• University information (institution, course, year of study)</li>
                  <li>• Right-to-Rent documents (passport, visa, share codes)</li>
                  <li>• Financial data (deposit payments, rent details)</li>
                  <li>• Communication history (WhatsApp, email, call logs)</li>
                  <li>• Viewing preferences and application data</li>
                  <li>• Contract documents and signatures</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Why We Process It</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Lettings automation:</strong> Enquiry handling, viewing booking, application processing</li>
                  <li>• <strong>Legal compliance:</strong> Right-to-Rent checks (UK Immigration Act requirement)</li>
                  <li>• <strong>Contract performance:</strong> Tenancy agreements, deposit protection</li>
                  <li>• <strong>Financial transactions:</strong> Payment processing, deposit registration</li>
                  <li>• <strong>Communication:</strong> Responding to queries, sending updates</li>
                  <li>• <strong>Service improvement:</strong> AI training, analytics</li>
                </ul>
              </div>

              <div className="space-y-3 md:col-span-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-tf-navy" />
                  Legal Basis for Processing
                </h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                    <p className="font-semibold mb-1">Legitimate Interest</p>
                    <p className="text-muted-foreground">Lettings automation, enquiry management, service improvements</p>
                  </div>
                  <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                    <p className="font-semibold mb-1">Contract Performance</p>
                    <p className="text-muted-foreground">Tenancy agreements, deposit processing, rent collection</p>
                  </div>
                  <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                    <p className="font-semibold mb-1">Legal Obligation</p>
                    <p className="text-muted-foreground">Right-to-Rent compliance, deposit protection schemes</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UK Data Residency */}
        <Card className="mb-8" data-testid="card-data-residency">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-tf-navy" />
              UK/EU Data Residency
            </CardTitle>
            <CardDescription>
              Your data never leaves UK/EU jurisdiction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                All TermFlow infrastructure and data storage is located exclusively within UK/EU data centres to comply with GDPR and the UK Data Protection Act 2018.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                  <h4 className="font-semibold mb-2">Primary Database</h4>
                  <p className="text-sm text-muted-foreground mb-1">Neon PostgreSQL</p>
                  <p className="text-sm text-muted-foreground">AWS eu-west-2 (London, UK)</p>
                </div>

                <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                  <h4 className="font-semibold mb-2">Object Storage</h4>
                  <p className="text-sm text-muted-foreground mb-1">Google Cloud Storage</p>
                  <p className="text-sm text-muted-foreground">europe-west2 (London, UK)</p>
                </div>

                <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                  <h4 className="font-semibold mb-2">Application Hosting</h4>
                  <p className="text-sm text-muted-foreground mb-1">Replit</p>
                  <p className="text-sm text-muted-foreground">EU Region</p>
                </div>
              </div>

              <Alert data-testid="alert-no-us-transfer">
                <Shield className="h-4 w-4" />
                <AlertTitle>No US Data Transfers</AlertTitle>
                <AlertDescription>
                  Student data is never transferred to or processed in non-EU jurisdictions. All infrastructure providers maintain GDPR compliance and UK/EU data residency.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Encryption Standards */}
        <Card className="mb-8" data-testid="card-encryption">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-tf-navy" />
              Encryption Standards
            </CardTitle>
            <CardDescription>
              Military-grade encryption protecting data in transit and at rest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Data in Transit</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>TLS 1.3:</strong> All API requests, webhook communications, and browser connections</li>
                  <li>• <strong>Perfect Forward Secrecy:</strong> Unique session keys for each connection</li>
                  <li>• <strong>Certificate Pinning:</strong> Protection against man-in-the-middle attacks</li>
                  <li>• <strong>HSTS Enabled:</strong> Force HTTPS on all connections</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Data at Rest</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>AES-256 Encryption:</strong> Database and object storage</li>
                  <li>• <strong>Encrypted Backups:</strong> Daily encrypted database backups</li>
                  <li>• <strong>Encrypted Storage:</strong> All Right-to-Rent documents, contracts, and uploads</li>
                  <li>• <strong>Key Rotation:</strong> Automatic encryption key rotation every 90 days</li>
                </ul>
              </div>

              <div className="space-y-3 md:col-span-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Key className="h-5 w-5 text-tf-navy" />
                  Secrets Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  All API keys, passwords, and sensitive credentials are stored in encrypted environment variables with rotation capabilities. Secrets are never stored in code or version control.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Controls */}
        <Card className="mb-8" data-testid="card-access-controls">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-tf-navy" />
              Access Controls & Audit Trails
            </CardTitle>
            <CardDescription>
              Who can access student data and how we track it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Role-Based Access Control (RBAC)</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                    <p className="font-semibold mb-1">Landlord/Operator</p>
                    <p className="text-sm text-muted-foreground">Full access to own students and properties only. Cannot see other operators' data.</p>
                  </div>
                  <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                    <p className="font-semibold mb-1">Site Manager</p>
                    <p className="text-sm text-muted-foreground">Access to assigned properties only. Read-only access to sensitive financial data.</p>
                  </div>
                  <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                    <p className="font-semibold mb-1">TermFlow Support Staff</p>
                    <p className="text-sm text-muted-foreground">Read-only access for troubleshooting. All access logged and audited.</p>
                  </div>
                  <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                    <p className="font-semibold mb-1">TermFlow Engineers</p>
                    <p className="text-sm text-muted-foreground">No access to production data. Database access only for emergency maintenance with approval.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Comprehensive Audit Trails</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Every action on student data is logged with timestamp, user ID, IP address, and action type.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Student profile views and edits</li>
                  <li>• Document downloads (Right-to-Rent, contracts)</li>
                  <li>• Data exports and API calls</li>
                  <li>• Login attempts and session activity</li>
                  <li>• Configuration changes and permission updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right-to-Rent Data Handling */}
        <Card className="mb-8" data-testid="card-right-to-rent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-tf-navy" />
              Right-to-Rent Compliance Data Handling
            </CardTitle>
            <CardDescription>
              How we securely handle identity documents and immigration data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert data-testid="alert-high-risk">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle>High-Risk Processing</AlertTitle>
                <AlertDescription>
                  Right-to-Rent documents (passports, visas, share codes) are classified as high-risk personal data. TermFlow implements additional security measures for this data.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h3 className="font-semibold">Security Measures for Identity Documents</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Encrypted Storage:</strong> All documents stored with AES-256 encryption</li>
                  <li>• <strong>Access Logging:</strong> Every document view logged with user ID, timestamp, IP address</li>
                  <li>• <strong>Automatic Deletion:</strong> Documents deleted 2 years after tenancy end (UK legal requirement)</li>
                  <li>• <strong>Secure Sharing:</strong> Time-limited signed URLs for document access (expire after 1 hour)</li>
                  <li>• <strong>No Third-Party Access:</strong> Documents never shared with sub-processors (OpenAI, Twilio, etc.)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Retention Policy</h3>
                <p className="text-sm text-muted-foreground">
                  Per UK Immigration Act requirements, Right-to-Rent documents must be retained for 2 years after tenancy ends. TermFlow automatically purges documents after this period.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sub-Processors */}
        <Card className="mb-8" data-testid="card-subprocessors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-tf-navy" />
              Sub-Processors & Third Parties
            </CardTitle>
            <CardDescription>
              All third parties we work with, each with a Data Processing Agreement (DPA) in place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table data-testid="table-subprocessors">
              <TableHeader>
                <TableRow>
                  <TableHead>Sub-Processor</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Data Shared</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>DPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="flex items-center gap-2">
                    <img src={openaiLogo} alt="OpenAI" className="h-8 w-8 object-contain" />
                    OpenAI
                  </TableCell>
                  <TableCell>AI chatbot (Ava)</TableCell>
                  <TableCell className="text-sm">Student messages, property details (no ID documents)</TableCell>
                  <TableCell>US (GDPR-compliant)</TableCell>
                  <TableCell>
                    <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1" data-testid="link-openai-dpa">
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2">
                    <img src={twilioLogo} alt="Twilio" className="h-8 w-8 object-contain" />
                    Twilio
                  </TableCell>
                  <TableCell>WhatsApp messaging, SMS</TableCell>
                  <TableCell className="text-sm">Phone numbers, message content</TableCell>
                  <TableCell>US (GDPR-compliant)</TableCell>
                  <TableCell>
                    <a href="https://www.twilio.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1" data-testid="link-twilio-dpa">
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2">
                    <img src={stripeLogo} alt="Stripe" className="h-8 w-8 object-contain" />
                    Stripe
                  </TableCell>
                  <TableCell>Payment processing</TableCell>
                  <TableCell className="text-sm">Payment details, deposit amounts (PCI-DSS compliant)</TableCell>
                  <TableCell>EU</TableCell>
                  <TableCell>
                    <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1" data-testid="link-stripe-dpa">
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <p className="text-sm text-muted-foreground mt-4">
              All sub-processors have signed Data Processing Agreements (DPAs) committing to GDPR compliance. We conduct annual reviews of sub-processor security practices.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-8" data-testid="card-retention">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-tf-navy" />
              Data Retention Policies
            </CardTitle>
            <CardDescription>
              How long we keep student data and why
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table data-testid="table-retention">
              <TableHeader>
                <TableRow>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Retention Period</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Deletion Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Student Profiles</TableCell>
                  <TableCell>2 years after tenancy end</TableCell>
                  <TableCell>Legal claims period</TableCell>
                  <TableCell>Automated purge</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Right-to-Rent Documents</TableCell>
                  <TableCell>2 years after tenancy end</TableCell>
                  <TableCell>UK Immigration Act requirement</TableCell>
                  <TableCell>Secure deletion + audit log</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Conversation Logs</TableCell>
                  <TableCell>1 year after tenancy end</TableCell>
                  <TableCell>Quality assurance, dispute resolution</TableCell>
                  <TableCell>Automated purge</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Payment Records</TableCell>
                  <TableCell>7 years after transaction</TableCell>
                  <TableCell>HMRC/tax compliance</TableCell>
                  <TableCell>Automated purge</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Call Recordings</TableCell>
                  <TableCell>6 months</TableCell>
                  <TableCell>Staff training, quality</TableCell>
                  <TableCell>Automated purge</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20 mt-4">
              <h4 className="font-semibold text-sm mb-2">Automated Deletion</h4>
              <p className="text-sm text-muted-foreground">
                Data is automatically purged after retention periods expire. Our automated systems run weekly checks to ensure no data is kept longer than legally required or necessary for business purposes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Student Rights */}
        <Card className="mb-8" data-testid="card-student-rights">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-tf-navy" />
              Student Rights Under GDPR
            </CardTitle>
            <CardDescription>
              What rights students have over their data and how to exercise them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Right to Access</h3>
                <p className="text-sm text-muted-foreground">
                  Students can request a copy of all personal data we hold about them. We respond within 30 days with a complete data export.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Right to Rectification</h3>
                <p className="text-sm text-muted-foreground">
                  Students can request corrections to inaccurate data. We update records within 72 hours of verification.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Right to Erasure ("Right to be Forgotten")</h3>
                <p className="text-sm text-muted-foreground">
                  Students can request deletion of their data, except where we have a legal obligation to retain it (e.g., Right-to-Rent, payment records).
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Right to Data Portability</h3>
                <p className="text-sm text-muted-foreground">
                  Students can request their data in a machine-readable format (JSON/CSV) to transfer to another service.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Right to Object</h3>
                <p className="text-sm text-muted-foreground">
                  Students can object to processing based on legitimate interests. We stop processing unless we have compelling legal grounds.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Right to Restrict Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Students can request we temporarily stop processing their data while investigating a complaint or dispute.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
              <h4 className="font-semibold text-sm mb-2">How to Exercise Your Rights</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Students should contact their landlord/property manager, who can submit requests on their behalf via the TermFlow dashboard. Alternatively, email privacy@termflow.co.uk directly.
              </p>
              <p className="text-sm text-muted-foreground">
                We aim to respond to all requests within 30 days. Complex requests may take up to 90 days with explanation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Certifications */}
        <Card className="mb-12" data-testid="card-certifications">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-tf-navy" />
              Security Certifications Roadmap
            </CardTitle>
            <CardDescription>
              Current compliance status and planned certifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div>
                  <p className="font-semibold">GDPR Compliance</p>
                  <p className="text-sm text-muted-foreground">Data Protection Act 2018 (UK GDPR)</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Compliant</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div>
                  <p className="font-semibold">SOC 2 Type II</p>
                  <p className="text-sm text-muted-foreground">Security, availability, confidentiality audit</p>
                </div>
                <Badge variant="outline">Target: Q3 2025</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div>
                  <p className="font-semibold">ISO 27001</p>
                  <p className="text-sm text-muted-foreground">Information security management</p>
                </div>
                <Badge variant="outline">Target: Q4 2025</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div>
                  <p className="font-semibold">Cyber Essentials Plus</p>
                  <p className="text-sm text-muted-foreground">UK government-backed cybersecurity certification</p>
                </div>
                <Badge variant="outline">Target: Q2 2025</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-tf-navy to-tf-navy-700 rounded-lg p-8 md:p-12 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Questions About Data Security?
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Our security team is here to answer your questions. Book a call to discuss your specific compliance requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" data-testid="button-cta-contact">
              <a href="/contact">Talk to Our Security Team</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20" data-testid="button-cta-due-diligence">
              <a href="/procurement/due-diligence">Download Due Diligence Pack</a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
