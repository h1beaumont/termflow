import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { ServiceSchema } from "@/components/ServiceSchema";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";
import { 
  FileCheck2, Clock, CheckCircle, AlertTriangle, ArrowRight,
  Upload, Scan, Shield, Database, AlertCircle, FileText
} from "lucide-react";

export default function IDDocumentCollection() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Playbooks", url: "/playbooks" },
    { name: "ID Document Collection", url: "/playbooks/id-document-collection" }
  ];
  const steps = [
    {
      number: 1,
      title: "Automated Document Requests",
      description: "Triggered automatically when a tenant reaches the application stage. System sends personalised WhatsApp, email, or SMS messages requesting specific documents based on tenant type (UK, EU, international student, guarantor).",
      automation: "100% automated",
      icon: FileText,
      details: [
        "Triggered by application status or manual request",
        "Personalised message based on tenant nationality",
        "Clear instructions on document requirements",
        "Multiple reminder sequences if not uploaded",
        "Deadline tracking with escalation alerts"
      ]
    },
    {
      number: 2,
      title: "Multi-Channel Upload Options",
      description: "Tenants can upload documents via WhatsApp (most popular with students), email attachment, or secure web portal. Mobile-first design ensures seamless experience on any device.",
      automation: "100% automated",
      icon: Upload,
      details: [
        "WhatsApp Business API for direct uploads",
        "Secure web portal with drag-and-drop",
        "Email attachment processing",
        "Mobile camera integration for instant capture",
        "Automatic file format validation (PDF, JPG, PNG)"
      ]
    },
    {
      number: 3,
      title: "OCR Extraction & Data Capture",
      description: "Google Cloud Vision OCR automatically extracts key data from documents: passport number, expiry date, nationality, visa type, BRP number. Achieves 98% accuracy on standard documents.",
      automation: "95% automated",
      icon: Scan,
      details: [
        "Passport data extraction (name, number, expiry, nationality)",
        "Visa type and conditions recognition",
        "BRP number and immigration status",
        "Driving licence details",
        "Guarantor ID verification",
        "Confidence scoring (flags low-quality scans)"
      ]
    },
    {
      number: 4,
      title: "Automated Validation & Compliance Checks",
      description: "System validates expiry dates, checks for document authenticity markers, and flags issues for manual review. Ensures compliance with Right-to-Rent requirements before contract issuance.",
      automation: "85% automated",
      icon: Shield,
      details: [
        "Expiry date validation (flags documents expiring within 6 months)",
        "Document type verification (matches expected format)",
        "Right-to-Rent eligibility checks",
        "Visa condition analysis for international students",
        "Authenticity markers detection",
        "Automatic escalation for manual review if needed"
      ]
    },
    {
      number: 5,
      title: "Secure Encrypted Storage",
      description: "All documents stored with AES-256 encryption in UK-based data centres. GDPR-compliant with automated retention policies (deleted 12 months after tenancy end unless legal requirement to retain).",
      automation: "100% automated",
      icon: Database,
      details: [
        "AES-256 encryption at rest and in transit",
        "UK data residency (no overseas transfers)",
        "Role-based access controls (landlord, manager, admin)",
        "Audit trail of all document access",
        "Automated retention policy enforcement",
        "Secure download with expiring links"
      ]
    },
    {
      number: 6,
      title: "Right-to-Rent Workflow Trigger",
      description: "Once documents are validated, system automatically triggers Right-to-Rent approval workflow. Landlord receives compliant checklist and can approve or reject with one click. Links back to main onboarding flow.",
      automation: "75% automated",
      icon: CheckCircle,
      details: [
        "Automatic RTR workflow initiation",
        "Landlord approval dashboard with document preview",
        "Compliant RTR checklist generation",
        "One-click approve/reject with reason logging",
        "Integration with tenant onboarding playbook",
        "Automated confirmation to tenant upon approval"
      ]
    }
  ];

  const integrations = [
    "Google Cloud Vision OCR",
    "WhatsApp Business API",
    "Object Storage (encrypted, UK-based)",
    "Right-to-Rent API",
    "Email service (document delivery)",
    "Stripe Identity (optional enhanced verification)"
  ];

  const pitfalls = [
    {
      problem: "Students upload blurry or partial photos",
      solution: "Implement quality checks with instant feedback. If OCR confidence is below 85%, reject upload immediately and ask for retake with helpful tips (good lighting, flat surface, full document visible)."
    },
    {
      problem: "International students confused about which visa documents to upload",
      solution: "Use nationality field to provide specific guidance. For example, Chinese students see: 'Upload your visa vignette sticker (in passport) and BRP card (front and back)'. Include example images."
    },
    {
      problem: "Documents expiring during tenancy period",
      solution: "Flag documents expiring within 6 months of tenancy end. Send automated reminders 90 days before expiry asking for renewed documents. Essential for visa holders on short-term permissions."
    },
    {
      problem: "GDPR concerns over document storage duration",
      solution: "Implement automated retention policies: documents deleted 12 months after tenancy end unless there's a legal dispute. Provide tenant-facing dashboard showing what documents are stored and retention dates."
    }
  ];

  return (
    <>
      <SEOHead
        title="ID & Document Collection Automation: GDPR-Compliant OCR Extraction | TermFlow"
        description="Automate passport, visa, and ID document collection for PBSA with 98% OCR accuracy. Reduce manual work from 4 hours to 15 minutes per tenant. GDPR-compliant, encrypted storage, Right-to-Rent integration."
        keywords="ID document collection automation, passport OCR extraction, visa verification automation, Right-to-Rent automation, GDPR document storage, student ID verification"
        canonical="https://termflow.ai/playbooks/id-document-collection"
        ogTitle="ID & Document Collection Automation: 4 Hours → 15 Minutes"
        ogDescription="Battle-tested playbook for automated document collection with OCR extraction. Used by PBSA operators for 20,000+ tenants annually."
        ogType="article"
        ogUrl="https://termflow.ai/playbooks/id-document-collection"
      />

      <ServiceSchema
        name="Automated ID Document Collection & Verification"
        description="Secure automated collection and verification of student ID documents, passports, and right-to-rent checks with OCR and compliance tracking for PBSA operators."
        provider={{
          name: "TermFlow",
          url: "https://termflow.co.uk"
        }}
        serviceType="Document Verification Service"
      />

      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <TermFlowWordmark />
            <SiteSearch />
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">
              Home
            </a>
            <Button asChild size="sm" variant="default" data-testid="button-book-demo">
              <a href="/book-demo">Book Demo</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-background">
        {/* Breadcrumbs */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" data-testid="link-home">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/playbooks" data-testid="link-playbooks">Playbooks</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>ID & Document Collection</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-8">
          <LastUpdated date="January 20, 2025" className="mb-8" />
        </div>

        {/* Hero */}
        <section className="py-12 bg-gradient-to-br from-green-50 via-background to-background dark:from-green-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4" data-testid="badge-category">
                <FileCheck2 className="w-3 h-3 mr-1" />
                Compliance Playbook
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                ID & Document Collection: Compliant, Fast, Automated
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Stop chasing students for passports and visas. Automate the entire document collection process with OCR extraction, 
                validation, and GDPR-compliant storage. Reduce manual work from 4 hours to 15 minutes per tenant.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Time Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">4hrs → 15min</p>
                    <p className="text-xs text-muted-foreground mt-1">Per tenant</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">OCR Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">98%</p>
                    <p className="text-xs text-muted-foreground mt-1">First-time extraction</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Turnaround</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">24 hours</p>
                    <p className="text-xs text-muted-foreground mt-1">Average completion</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                The Problem: Document Chasing Wastes Hours & Risks Compliance
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Collecting ID documents from students is one of the most time-consuming and frustrating parts of the lettings process:
                </p>
                
                <ul className="space-y-3 my-6">
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Sending manual requests via email/WhatsApp and tracking who's responded</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Receiving blurry photos via WhatsApp that are unreadable</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Manually typing passport numbers, expiry dates, visa details into spreadsheets</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Missing expired documents that should have been flagged during onboarding</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Storing documents insecurely (email attachments, local hard drives, Dropbox)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>GDPR compliance risks from improper document retention and access controls</span>
                  </li>
                </ul>

                <p className="text-muted-foreground leading-relaxed">
                  For international students (often 50-70% of PBSA tenants), this is even worse. Visa documents are complex, 
                  students don't always know which documents to send, and Right-to-Rent compliance depends on getting this right. 
                  A single missed expired visa can lead to £20,000 civil penalties.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                The Solution: Fully Automated Document Collection & Validation
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                TermFlow automates every step of ID document collection: from requesting documents via the tenant's preferred 
                channel, to OCR extraction, validation, encrypted storage, and Right-to-Rent workflow triggering. The system 
                handles 92% of the work automatically, with humans only reviewing flagged edge cases.
              </p>

              <img 
                src="/diagrams/id-collection-flow.svg" 
                alt="ID document collection automation flow diagram" 
                className="w-full border rounded-lg shadow-sm bg-white p-6 mb-8"
                data-testid="img-flow-diagram"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-green-700 dark:text-green-400">What Gets Automated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Document request messages (WhatsApp, email, SMS)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Multi-channel upload processing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>OCR data extraction (98% accuracy)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Expiry date validation & alerts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Encrypted storage with audit trails</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Right-to-Rent workflow triggering</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <CardTitle className="text-orange-700 dark:text-orange-400">What Needs Human Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Low-quality scans (OCR confidence below 85%)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Complex visa conditions requiring interpretation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Documents expiring during tenancy period</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Right-to-Rent approval (final decision)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Breakdown */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Step-by-Step Implementation Guide</h2>
              
              <div className="space-y-8">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <Card key={step.number} data-testid={`card-step-${step.number}`}>
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex-shrink-0">
                            {step.number}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className="w-5 h-5 text-primary" />
                              <CardTitle className="text-xl">{step.title}</CardTitle>
                              <Badge variant="secondary" className="ml-auto">{step.automation}</Badge>
                            </div>
                            <CardDescription className="text-base leading-relaxed">
                              {step.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Automation Impact */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Automation Impact & Results</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Time Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Before Automation</p>
                      <p className="text-3xl font-bold text-destructive">4 hours</p>
                      <p className="text-xs text-muted-foreground">Per tenant (chasing, data entry, filing)</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">After Automation</p>
                      <p className="text-3xl font-bold text-green-600">15 minutes</p>
                      <p className="text-xs text-muted-foreground">Manual review of flagged items only</p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="font-semibold">For 200 tenants/year:</p>
                      <p className="text-2xl font-bold text-primary">787 hours saved</p>
                      <p className="text-sm text-muted-foreground">Equivalent to 0.4 FTE</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Success Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">OCR Accuracy</span>
                      <span className="text-xl font-bold">98%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Turnaround</span>
                      <span className="text-xl font-bold">24 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tenant Upload Rate</span>
                      <span className="text-xl font-bold">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Compliance Pass Rate</span>
                      <span className="text-xl font-bold">99.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">GDPR Audit Score</span>
                      <span className="text-xl font-bold">100%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Key Integrations */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Key Integrations</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {integrations.map((integration, idx) => (
                  <Card key={idx} className="bg-muted/50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium">{integration}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Supported Documents */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Supported Document Types</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">UK & EU Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-primary" />
                        UK passport (bio page)
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-primary" />
                        EU national ID card
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-primary" />
                        UK driving licence (photo card)
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-primary" />
                        Guarantor ID (if applicable)
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">International Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-primary" />
                        Passport (bio page + visa vignette)
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-primary" />
                        BRP card (front and back)
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-primary" />
                        Student visa (Tier 4 / Graduate visa)
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-primary" />
                        Proof of Right-to-Rent status
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-primary" />
                        CAS letter (if requested)
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Common Pitfalls */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-orange-500" />
                Common Pitfalls & Solutions
              </h2>
              
              <div className="space-y-6">
                {pitfalls.map((pitfall, idx) => (
                  <Card key={idx} className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <CardTitle className="text-lg text-orange-700 dark:text-orange-400">
                        ⚠️ Pitfall: {pitfall.problem}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm mb-1">Solution:</p>
                          <p className="text-sm text-muted-foreground">{pitfall.solution}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Playbooks */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Related Playbooks</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-lg">Tenant Onboarding Automation</CardTitle>
                    <CardDescription>
                      Complete automation from enquiry to move-in. ID collection is Step 5 of the full onboarding workflow.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="sm" data-testid="link-tenant-onboarding">
                      <Link href="/playbooks/tenant-onboarding-automation">
                        Read Playbook <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-lg">Inspection Scheduling Automation</CardTitle>
                    <CardDescription>
                      Automated photo documentation and reporting. Similar document management principles applied to inspections.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="sm" data-testid="link-inspection-scheduling">
                      <Link href="/playbooks/inspection-scheduling-automation">
                        Read Playbook <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">
                See ID Collection Automation in Action
              </h2>
              <p className="text-lg opacity-90">
                Book a demo to see how TermFlow eliminates document chasing, achieves 98% OCR accuracy, 
                and ensures GDPR compliance. We'll show you the exact workflow used by{" "}
                <Link href="/personas/pbsa-operators" className="text-white hover:underline" data-testid="link-pbsa-operators">
                  PBSA operators
                </Link>
                {" "}managing 20,000+ beds. Explore our{" "}
                <Link href="/automation-ideas" className="text-white hover:underline" data-testid="link-automation-ideas">
                  automation ideas library
                </Link>
                {" "}or view{" "}
                <Link href="/outcomes" className="text-white hover:underline" data-testid="link-outcomes">
                  real operator outcomes
                </Link>
                .
              </p>
              <div className="pt-4">
                <Button 
                  asChild 
                  size="lg" 
                  variant="secondary"
                  data-testid="button-book-demo"
                >
                  <Link href="/book-demo">
                    Book Your Free Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Last Updated Badge */}
        <div className="container mx-auto px-4 py-6 text-center border-t">
          <Badge variant="outline" data-testid="badge-last-updated">
            Last Updated: January 2025
          </Badge>
        </div>

        <Footer />
      </div>
    </>
  );
}
