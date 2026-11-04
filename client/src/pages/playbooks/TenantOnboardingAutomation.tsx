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
  UserPlus, Clock, CheckCircle, AlertTriangle, ArrowRight,
  MessageSquare, Calendar, FileText, CreditCard, Shield, Key
} from "lucide-react";

export default function TenantOnboardingAutomation() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Playbooks", url: "/playbooks" },
    { name: "Tenant Onboarding Automation", url: "/playbooks/tenant-onboarding-automation" }
  ];
  const steps = [
    {
      number: 1,
      title: "Enquiry Capture",
      description: "Automatically capture and respond to enquiries from all channels including WhatsApp, email, web forms, and phone. AI agent responds within 60 seconds with property details, availability, and viewing booking options.",
      automation: "100% automated",
      icon: MessageSquare,
      details: [
        "Multi-channel integration (WhatsApp, email, web, portals)",
        "Instant AI responses in tenant's preferred language",
        "Pre-qualification questions to assess suitability",
        "Automatic CRM record creation with lead scoring"
      ]
    },
    {
      number: 2,
      title: "Automated Viewing Booking",
      description: "Syncs with your Google Calendar to offer available viewing slots. Sends automated reminders 24 hours and 2 hours before the viewing. Handles rescheduling requests automatically.",
      automation: "95% automated",
      icon: Calendar,
      details: [
        "Real-time calendar availability checks",
        "Self-service booking with instant confirmation",
        "Automated reminders via WhatsApp and email",
        "One-click rescheduling for tenants and staff",
        "Location details and directions included"
      ]
    },
    {
      number: 3,
      title: "Post-Viewing Follow-Up",
      description: "Within 2 hours of the viewing, automatically send follow-up messages asking for feedback and offering to progress the application. Detects interest level and prioritises hot leads.",
      automation: "100% automated",
      icon: MessageSquare,
      details: [
        "Triggered automatically 2 hours after viewing",
        "Sentiment analysis on responses",
        "Hot lead escalation to human agent",
        "Application form link if tenant is interested"
      ]
    },
    {
      number: 4,
      title: "Application Form Pre-Fill",
      description: "Uses data from previous interactions to pre-fill the application form. Students only need to verify and complete missing fields, reducing application time from 45 minutes to under 10 minutes.",
      automation: "90% automated",
      icon: FileText,
      details: [
        "Pre-populates name, email, phone from enquiry",
        "Remembers university, course, start date",
        "Auto-selects room preferences from conversation",
        "Mobile-optimised form with progress saving"
      ]
    },
    {
      number: 5,
      title: "ID & Document Collection",
      description: "Automated prompts for passport, visa, BRP, and other required documents. OCR extraction automatically reads and validates documents. Links to detailed ID Collection playbook.",
      automation: "92% automated",
      icon: Shield,
      details: [
        "Automated document request triggers",
        "Multi-channel upload (WhatsApp, email, web)",
        "OCR extraction with 98% accuracy",
        "Automatic expiry date validation",
        "Secure encrypted storage (GDPR compliant)"
      ]
    },
    {
      number: 6,
      title: "Contract Generation & E-Signature",
      description: "Automatically generates tenancy agreements using approved templates. Integrates with DocuSign or Signable for legally binding e-signatures. Tracks signing progress and sends reminders.",
      automation: "95% automated",
      icon: FileText,
      details: [
        "Template-based contract generation",
        "Custom clauses based on property/room type",
        "DocuSign/Signable integration",
        "Automatic signing reminders (24h, 72h)",
        "Countersignature workflow for landlord"
      ]
    },
    {
      number: 7,
      title: "Deposit Collection",
      description: "Generates personalised Stripe payment links with exact deposit amount. Sends automated receipts and registers deposit with TDS, DPS, or MyDeposits. Tracks payment status in real-time.",
      automation: "100% automated",
      icon: CreditCard,
      details: [
        "Stripe integration with personalised links",
        "Multiple payment methods supported",
        "Instant automated receipt generation",
        "Automatic deposit protection registration",
        "Payment reminder workflow if not paid"
      ]
    },
    {
      number: 8,
      title: "Right-to-Rent Checks",
      description: "Triggers Right-to-Rent workflow using uploaded documents. Provides landlord with compliant checklist and approval interface. Escalates to human review for complex visa cases.",
      automation: "50% automated",
      icon: Shield,
      details: [
        "API integration with RTR services",
        "Automated compliance checklist",
        "Landlord approval dashboard",
        "Document verification trail",
        "Escalation for complex cases (e.g., visa conditions)"
      ]
    }
  ];

  const integrations = [
    "WhatsApp Business API",
    "Google Calendar",
    "DocuSign / Signable",
    "Stripe Payments",
    "Right-to-Rent API",
    "Property portals (Rightmove, Zoopla, etc.)"
  ];

  const pitfalls = [
    {
      problem: "Students don't respond to document requests",
      solution: "Use multi-channel reminders (WhatsApp preferred) and set clear deadlines. Escalate to phone call after 48 hours of no response."
    },
    {
      problem: "International students struggle with e-signature process",
      solution: "Include video tutorial link in DocuSign invite. Offer WhatsApp support for technical issues."
    },
    {
      problem: "Right-to-Rent checks delayed for complex visa types",
      solution: "Build buffer time into timelines. Flag visa-holder applications early for human review. Maintain specialist advisor for immigration questions."
    },
    {
      problem: "Deposit protection registration failures",
      solution: "Automated retry logic with error notifications. Daily reconciliation check to catch failed registrations."
    }
  ];

  return (
    <>
      <SEOHead
        title="Tenant Onboarding Automation Playbook: From Enquiry to Move-In | TermFlow"
        description="Complete automation playbook for PBSA tenant onboarding. Reduce manual time from 12 hours to 45 minutes per tenant with 95% automation. Includes flow diagrams, step-by-step guide, and success metrics."
        keywords="tenant onboarding automation, PBSA onboarding workflow, student lettings automation, tenancy application automation, automated viewing booking"
        canonical="https://termflow.ai/playbooks/tenant-onboarding-automation"
        ogTitle="Tenant Onboarding Automation: 12 Hours → 45 Minutes Per Tenant"
        ogDescription="Battle-tested playbook to automate your entire student onboarding process. Used by operators managing 20,000+ beds."
        ogType="article"
        ogUrl="https://termflow.ai/playbooks/tenant-onboarding-automation"
      />

      <ServiceSchema
        name="Automated Tenant Onboarding for Student Accommodation"
        description="Streamline student tenant onboarding with automated welcome packs, key collection scheduling, inventory checks, and first-day communications for PBSA providers."
        provider={{
          name: "TermFlow",
          url: "https://termflow.co.uk"
        }}
        serviceType="Tenant Onboarding Automation"
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
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="container mx-auto px-4 pt-8">
          <LastUpdated date="January 20, 2025" className="mb-8" />
        </div>

        {/* Hero */}
        <section className="py-12 bg-gradient-to-br from-blue-50 via-background to-background dark:from-blue-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4" data-testid="badge-category">
                <UserPlus className="w-3 h-3 mr-1" />
                Onboarding Playbook
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Tenant Onboarding Automation: From Enquiry to Move-In
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                The complete automation playbook to transform your tenant onboarding from a 12-hour manual process into a 45-minute oversight task. 
                Achieve 95% completion rate and 6-day average cycle time.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Time Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">12hrs → 45min</p>
                    <p className="text-xs text-muted-foreground mt-1">Per tenant</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Automation Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">95%</p>
                    <p className="text-xs text-muted-foreground mt-1">Fully automated</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Cycle Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">6 days</p>
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
                The Problem: Manual Onboarding is Killing Your Efficiency
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Traditional tenant onboarding for student accommodation is a labour-intensive nightmare. Operators spend 8-12 hours per tenant manually:
                </p>
                
                <ul className="space-y-3 my-6">
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Responding to enquiries across multiple channels (often missing leads from portals)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Coordinating viewing times via endless back-and-forth emails</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Chasing students for application forms and supporting documents</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Manually generating contracts and chasing for signatures</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Processing deposits and registering with protection schemes</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Conducting Right-to-Rent checks with paper trails</span>
                  </li>
                </ul>

                <p className="text-muted-foreground leading-relaxed">
                  During peak letting season (clearing period), operators receive 400+ enquiries per week. Without automation, it's physically impossible to respond fast enough, leading to lost revenue and poor tenant experience.
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
                The Solution: End-to-End Automation
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                TermFlow automates the entire tenant journey from first enquiry to keys handover. Every step is orchestrated automatically, with intelligent escalation to humans only when needed.
              </p>

              <img 
                src="/diagrams/onboarding-flow.svg" 
                alt="Tenant onboarding automation flow diagram" 
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
                        <span>Enquiry responses (60-second reply time)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Viewing bookings and reminders</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Application form pre-population</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Document collection and validation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Contract generation and e-signatures</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Deposit collection and protection</span>
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
                        <span>Right-to-Rent approval (complex visa cases)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Application approval (final decision)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Complex enquiries (escalated by AI)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Guarantor negotiations</span>
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
                      <p className="text-3xl font-bold text-destructive">12 hours</p>
                      <p className="text-xs text-muted-foreground">Per tenant onboarding</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">After Automation</p>
                      <p className="text-3xl font-bold text-green-600">45 minutes</p>
                      <p className="text-xs text-muted-foreground">Manual oversight only</p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="font-semibold">For 100 tenants/year:</p>
                      <p className="text-2xl font-bold text-primary">1,142 hours saved</p>
                      <p className="text-sm text-muted-foreground">Equivalent to 0.6 FTE</p>
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
                      <span className="text-sm text-muted-foreground">Completion Rate</span>
                      <span className="text-xl font-bold">95%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Cycle Time</span>
                      <span className="text-xl font-bold">6 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">First Response Time</span>
                      <span className="text-xl font-bold">60 seconds</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Contract Signing Rate</span>
                      <span className="text-xl font-bold">89%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tenant Satisfaction</span>
                      <span className="text-xl font-bold">4.7/5</span>
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
              <h2 className="text-3xl font-bold mb-6">Key Integrations Required</h2>
              <p className="text-muted-foreground mb-8">
                This playbook requires the following integrations to function fully. TermFlow handles all setup and API connections.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.map((integration, idx) => (
                  <Card key={idx} className="hover-elevate" data-testid={`card-integration-${idx}`}>
                    <CardHeader className="pb-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                      <CardTitle className="text-base">{integration}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> Related playbook available: <Link href="/playbooks/id-document-collection" className="underline font-semibold hover:text-blue-700" data-testid="link-related-playbook">ID & Document Collection</Link> for detailed guidance on Step 5.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Pitfalls */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Common Pitfalls & How to Avoid Them</h2>
              
              <div className="space-y-4">
                {pitfalls.map((pitfall, idx) => (
                  <Card key={idx} data-testid={`card-pitfall-${idx}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-destructive">{pitfall.problem}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        <strong className="text-green-600">Solution:</strong> {pitfall.solution}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Template Library */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Template Library Included</h2>
              <p className="text-muted-foreground mb-6">
                This playbook includes 8 pre-written message templates optimised for conversion and tenant satisfaction:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Initial enquiry response (60-second auto-reply)",
                  "Viewing confirmation with directions",
                  "24-hour viewing reminder",
                  "Post-viewing follow-up (interest check)",
                  "Application form invitation",
                  "Document upload request",
                  "Contract signing invitation",
                  "Welcome message with move-in details"
                ].map((template, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{template}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">
                See This Playbook in Action
              </h2>
              <p className="text-lg text-muted-foreground">
                Book a personalised demo to see the complete tenant onboarding automation flow. 
                We'll walk you through each step and show you real tenant interactions. See how this integrates with{" "}
                <Link href="/playbooks/id-document-collection" className="text-primary hover:underline" data-testid="link-id-document-collection">
                  ID document collection
                </Link>
                , or explore our{" "}
                <Link href="/automation-ideas" className="text-primary hover:underline" data-testid="link-automation-ideas">
                  automation ideas library
                </Link>
                {" "}for 30+ more workflows. View{" "}
                <Link href="/outcomes" className="text-primary hover:underline" data-testid="link-outcomes">
                  real outcomes from PBSA operators
                </Link>
                .
              </p>
              <div className="pt-4">
                <Button asChild size="lg" data-testid="button-book-demo">
                  <Link href="/book-demo">
                    Book Your Free Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Last Updated */}
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
