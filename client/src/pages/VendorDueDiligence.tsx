import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Lock, Database, FileText, Download, Server, Eye, CheckCircle, Clock, Users, AlertTriangle } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { SiteSearch } from "@/components/SiteSearch";

export default function VendorDueDiligence() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Procurement", url: "#" },
    { name: "Vendor Due Diligence", url: "/procurement/due-diligence" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="Vendor Due Diligence Pack | TermFlow Security & Compliance"
        description="Complete vendor due diligence information for procurement teams evaluating TermFlow. Security posture, compliance certifications, DPA templates, SLA commitments, and support model."
        keywords="vendor due diligence, PBSA security compliance, software procurement, DPA template, security questionnaire, vendor assessment"
        canonical="https://termflow.co.uk/procurement/due-diligence"
        ogUrl="https://termflow.co.uk/procurement/due-diligence"
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
              Vendor Due Diligence Pack
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            Complete vendor assessment information for procurement teams evaluating TermFlow. Download our security questionnaire, DPA template, and compliance documentation.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Button variant="outline" size="sm" data-testid="button-download-checklist">
              <Download className="h-4 w-4 mr-2" />
              Download Due Diligence Checklist (PDF)
            </Button>
          </div>
        </div>

        {/* Quick Summary */}
        <Alert className="mb-8 border-2 border-tf-navy" data-testid="alert-summary">
          <Shield className="h-5 w-5 text-tf-navy" />
          <AlertTitle className="text-lg font-bold">Executive Summary for Procurement</AlertTitle>
          <AlertDescription className="text-base mt-2">
            TermFlow is a UK-based PBSA automation platform with GDPR compliance, UK/EU data residency, enterprise-grade security, and transparent vendor practices. We provide full DPA, sub-processor list, and compliance documentation for your vendor assessment.
          </AlertDescription>
        </Alert>

        {/* Security Posture */}
        <Card className="mb-8" data-testid="card-security-posture">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-tf-navy" />
              Security Posture Overview
            </CardTitle>
            <CardDescription>
              Infrastructure, data protection, and access controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table data-testid="table-security">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Security Domain</TableHead>
                  <TableHead>TermFlow Implementation</TableHead>
                  <TableHead>Evidence/Documentation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Data Residency</TableCell>
                  <TableCell>UK/EU only (London data centres)</TableCell>
                  <TableCell>Infrastructure diagram available on request</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Encryption (Transit)</TableCell>
                  <TableCell>TLS 1.3, Perfect Forward Secrecy</TableCell>
                  <TableCell>SSL Labs A+ rating</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Encryption (At Rest)</TableCell>
                  <TableCell>AES-256 (database, object storage)</TableCell>
                  <TableCell>Infrastructure provider certifications</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Access Controls</TableCell>
                  <TableCell>Role-based (RBAC), MFA enforced</TableCell>
                  <TableCell>Access control policy document</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Audit Logging</TableCell>
                  <TableCell>All data access logged (90-day retention)</TableCell>
                  <TableCell>Sample audit log export</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Secrets Management</TableCell>
                  <TableCell>Encrypted environment variables, 90-day rotation</TableCell>
                  <TableCell>Secrets management policy</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Vulnerability Management</TableCell>
                  <TableCell>Automated dependency scanning, monthly penetration tests</TableCell>
                  <TableCell>Latest pen test summary (NDA required)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Incident Response</TableCell>
                  <TableCell>24-hour notification SLA, documented IR plan</TableCell>
                  <TableCell>Incident response policy document</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Data Processing Agreement */}
        <Card className="mb-8" data-testid="card-dpa">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-tf-navy" />
              Data Processing Agreement (DPA)
            </CardTitle>
            <CardDescription>
              GDPR-compliant data processing terms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              TermFlow provides a standard Data Processing Agreement (DPA) compliant with GDPR and UK Data Protection Act 2018. The DPA covers:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Included in DPA:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Data processing instructions and limitations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Sub-processor list with 30-day notification for changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Security measures and technical safeguards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Data subject rights procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Data breach notification (within 24 hours)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Data deletion upon contract termination</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Additional Documentation:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Data Protection Impact Assessment (DPIA) template</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Records of Processing Activities (ROPA)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Data flow diagram (system architecture)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Security questionnaire responses (CAIQ/SIG)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
              <p className="text-sm font-semibold mb-2">Request DPA Template:</p>
              <p className="text-sm text-muted-foreground mb-3">
                Email procurement@termflow.co.uk with your organisation name and we'll send the DPA template within 24 hours. We can also accommodate custom DPA requirements.
              </p>
              <Button variant="outline" size="sm" data-testid="button-request-dpa">
                <Download className="h-4 w-4 mr-2" />
                Request DPA Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sub-Processors */}
        <Card className="mb-8" data-testid="card-subprocessors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-tf-navy" />
              Sub-Processors List
            </CardTitle>
            <CardDescription>
              Third-party processors with access to data
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
                  <TableHead>DPA Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Neon (PostgreSQL)</TableCell>
                  <TableCell>Database hosting</TableCell>
                  <TableCell>All application data</TableCell>
                  <TableCell>UK (AWS eu-west-2)</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900">Signed</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Google Cloud Storage</TableCell>
                  <TableCell>Object storage (documents, media)</TableCell>
                  <TableCell>Uploads, contracts, RTR docs</TableCell>
                  <TableCell>UK (europe-west2)</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900">Signed</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">OpenAI</TableCell>
                  <TableCell>AI chatbot (Ava)</TableCell>
                  <TableCell>Student messages, property details</TableCell>
                  <TableCell>US (GDPR-compliant)</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900">Signed</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Twilio</TableCell>
                  <TableCell>WhatsApp/SMS messaging</TableCell>
                  <TableCell>Phone numbers, message content</TableCell>
                  <TableCell>US (GDPR-compliant)</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900">Signed</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Stripe</TableCell>
                  <TableCell>Payment processing</TableCell>
                  <TableCell>Payment details, deposit amounts</TableCell>
                  <TableCell>EU (PCI-DSS Level 1)</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900">Signed</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <p className="text-sm text-muted-foreground mt-4">
              <strong>Sub-Processor Change Notification:</strong> We notify customers 30 days before adding or changing sub-processors. Customers have the right to object.
            </p>
          </CardContent>
        </Card>

        {/* Compliance Certifications */}
        <Card className="mb-8" data-testid="card-certifications">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-tf-navy" />
              Compliance Certifications (Current & Roadmap)
            </CardTitle>
            <CardDescription>
              Security and compliance standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div>
                  <p className="font-semibold">GDPR Compliance</p>
                  <p className="text-sm text-muted-foreground">UK Data Protection Act 2018 (UK GDPR)</p>
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
                  <p className="text-sm text-muted-foreground">Information security management system</p>
                </div>
                <Badge variant="outline">Target: Q4 2025</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div>
                  <p className="font-semibold">Cyber Essentials Plus</p>
                  <p className="text-sm text-muted-foreground">UK government-backed cybersecurity scheme</p>
                </div>
                <Badge variant="outline">Target: Q2 2025</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md border hover-elevate">
                <div>
                  <p className="font-semibold">PCI-DSS (via Stripe)</p>
                  <p className="text-sm text-muted-foreground">Payment card industry data security</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Certified (Stripe)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Continuity */}
        <Card className="mb-8" data-testid="card-continuity">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Business Continuity & Disaster Recovery
            </CardTitle>
            <CardDescription>
              Uptime guarantees and recovery procedures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Uptime SLA</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>99.9% uptime guarantee</strong> (8.76 hours max downtime/year)</li>
                  <li>• Automatic failover to backup infrastructure</li>
                  <li>• Real-time status monitoring: status.termflow.co.uk</li>
                  <li>• SLA credits for downtime exceeding guarantee</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Backup & Recovery</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Daily encrypted backups</strong> (retained for 30 days)</li>
                  <li>• Recovery Time Objective (RTO): 4 hours</li>
                  <li>• Recovery Point Objective (RPO): 24 hours (last backup)</li>
                  <li>• Quarterly disaster recovery drills</li>
                </ul>
              </div>

              <div className="space-y-3 md:col-span-2">
                <h4 className="font-semibold">Incident Response</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>24-hour breach notification</strong> to affected customers</li>
                  <li>• Documented incident response plan (IR policy available on request)</li>
                  <li>• Root cause analysis provided within 7 days of incident</li>
                  <li>• Post-incident review and remediation plan</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SLA Commitments */}
        <Card className="mb-8" data-testid="card-sla">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-tf-navy" />
              SLA Commitments
            </CardTitle>
            <CardDescription>
              Service level agreements for support and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table data-testid="table-sla">
              <TableHeader>
                <TableRow>
                  <TableHead>Service Level</TableHead>
                  <TableHead>Commitment</TableHead>
                  <TableHead>Measurement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Platform Uptime</TableCell>
                  <TableCell>99.9% (monthly)</TableCell>
                  <TableCell>Automated monitoring, public status page</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Critical Support Response</TableCell>
                  <TableCell>Within 2 hours</TableCell>
                  <TableCell>Ticket system timestamps</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">High Priority Support</TableCell>
                  <TableCell>Within 4 hours (business hours)</TableCell>
                  <TableCell>Ticket system timestamps</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Standard Support</TableCell>
                  <TableCell>Within 24 hours (business hours)</TableCell>
                  <TableCell>Ticket system timestamps</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Security Incident Notification</TableCell>
                  <TableCell>Within 24 hours</TableCell>
                  <TableCell>Email notification + ticket</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Planned Maintenance Notice</TableCell>
                  <TableCell>7 days advance notice</TableCell>
                  <TableCell>Email + in-app notification</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Support Model */}
        <Card className="mb-8" data-testid="card-support">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-tf-navy" />
              Support Model
            </CardTitle>
            <CardDescription>
              How we support customers post-launch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Support Channels:</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                    <p className="font-semibold mb-1">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@termflow.co.uk</p>
                    <p className="text-sm text-muted-foreground">Response: Within 24 hours</p>
                  </div>

                  <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                    <p className="font-semibold mb-1">In-App Chat</p>
                    <p className="text-sm text-muted-foreground">Real-time chat in dashboard</p>
                    <p className="text-sm text-muted-foreground">Hours: Mon-Fri 9am-6pm GMT</p>
                  </div>

                  <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                    <p className="font-semibold mb-1">Phone Support (Enterprise)</p>
                    <p className="text-sm text-muted-foreground">Dedicated account manager</p>
                    <p className="text-sm text-muted-foreground">For portfolios 500+ beds</p>
                  </div>

                  <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                    <p className="font-semibold mb-1">Knowledge Base</p>
                    <p className="text-sm text-muted-foreground">Self-service documentation</p>
                    <p className="text-sm text-muted-foreground">24/7 availability</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Support Tiers by Plan:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Email Support</TableHead>
                      <TableHead>Chat Support</TableHead>
                      <TableHead>Phone Support</TableHead>
                      <TableHead>Dedicated Manager</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Starter</TableCell>
                      <TableCell><CheckCircle className="h-5 w-5 text-green-600" /></TableCell>
                      <TableCell><CheckCircle className="h-5 w-5 text-green-600" /></TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Professional</TableCell>
                      <TableCell><CheckCircle className="h-5 w-5 text-green-600" /></TableCell>
                      <TableCell><CheckCircle className="h-5 w-5 text-green-600" /></TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Enterprise</TableCell>
                      <TableCell><CheckCircle className="h-5 w-5 text-green-600" /></TableCell>
                      <TableCell><CheckCircle className="h-5 w-5 text-green-600" /></TableCell>
                      <TableCell><CheckCircle className="h-5 w-5 text-green-600" /></TableCell>
                      <TableCell><CheckCircle className="h-5 w-5 text-green-600" /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Terms */}
        <Card className="mb-12" data-testid="card-contract-terms">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-tf-navy" />
              Contract Terms Overview
            </CardTitle>
            <CardDescription>
              Standard commercial terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-semibold">Contract Length</span>
                <span className="text-muted-foreground">12 months minimum (annual billing available)</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-semibold">Renewal</span>
                <span className="text-muted-foreground">Auto-renewal (30-day cancellation notice)</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-semibold">Payment Terms</span>
                <span className="text-muted-foreground">Monthly or annual in advance</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-semibold">Price Increases</span>
                <span className="text-muted-foreground">60-day notice, capped at 10% annually</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-semibold">Data Ownership</span>
                <span className="text-muted-foreground">Customer retains all data ownership</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-semibold">Data Export</span>
                <span className="text-muted-foreground">Full export in machine-readable format (JSON/CSV)</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-semibold">Termination</span>
                <span className="text-muted-foreground">30-day data retention post-termination, then secure deletion</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-semibold">Liability Cap</span>
                <span className="text-muted-foreground">12 months of fees paid (negotiable for Enterprise)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-tf-navy to-tf-navy-700 rounded-lg p-8 md:p-12 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Need Additional Due Diligence Documentation?
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Contact our procurement team to request DPA templates, security questionnaires, compliance certifications, or schedule a security briefing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" data-testid="button-cta-procurement">
              <a href="mailto:procurement@termflow.co.uk">
                <FileText className="mr-2 h-4 w-4" />
                Email Procurement Team
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20" data-testid="button-cta-download">
              <a href="#">
                <Download className="mr-2 h-4 w-4" />
                Download Checklist (PDF)
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
