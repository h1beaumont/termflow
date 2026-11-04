import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SEOHead } from "@/components/SEOHead";
import { SoftwareApplicationSchema } from "@/components/SoftwareApplicationSchema";
import { SiteSearch } from "@/components/SiteSearch";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { BackToTop } from "@/components/BackToTop";
import { 
  DollarSign, 
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  CreditCard,
  AlertCircle,
  Wrench,
  FileText,
  CalendarCheck,
  Lock
} from "lucide-react";
import { Link } from "wouter";

export default function YardiIntegration() {
  const automationSteps = [
    {
      title: "Booking confirmations with instant deposit instructions",
      description: "Send automated booking confirmations immediately after Yardi records a new tenancy. Include personalised deposit payment instructions, deadline reminders, and Stripe payment links.",
      details: [
        "Triggered on new tenancy creation in Yardi",
        "Personalised with resident name, property, move-in date",
        "Stripe payment link embedded for instant deposit collection",
        "Automatic reminder 3 days before deposit deadline"
      ],
      icon: CreditCard
    },
    {
      title: "Arrears detection with automated payment reminders",
      description: "Monitor Yardi billing ledger daily. Detect arrears automatically and send tiered reminder sequences (friendly → formal → escalation) via email and WhatsApp. Track payment status in real-time.",
      details: [
        "Daily sync with Yardi billing ledger",
        "Tiered reminder sequence (Day 3, Day 7, Day 14)",
        "Multi-channel delivery (email, WhatsApp, SMS)",
        "Automatic pause when payment received"
      ],
      icon: AlertCircle
    },
    {
      title: "Instalment plan workflows for struggling residents",
      description: "Offer automated instalment plans to residents behind on rent. AI generates payment schedules based on arrears amount and resident history. Collect instalment commitments via DocuSign.",
      details: [
        "AI-generated instalment schedules (2-6 month plans)",
        "DocuSign integration for instalment agreement signing",
        "Automatic payment tracking & reminder follow-ups",
        "Escalation to human if plan not honored"
      ],
      icon: DollarSign
    },
    {
      title: "Maintenance ticket classification & routing",
      description: "Capture maintenance requests from Yardi resident portal. AI classifies issue type (plumbing, electrical, heating) and routes to appropriate contractor. Send resident real-time status updates.",
      details: [
        "Auto-classify 12 maintenance categories with 94% accuracy",
        "Priority detection for safety-critical issues",
        "Smart routing to in-house team or contractor",
        "Real-time status updates to resident (logged → assigned → completed)"
      ],
      icon: Wrench
    },
    {
      title: "Lease renewal automation",
      description: "Identify residents 60 days before contract end. Send renewal offers automatically, generate new lease documents, and collect e-signatures via DocuSign. Sync signed leases back to Yardi.",
      details: [
        "Auto-triggered 60 days before contract end",
        "Personalised renewal offer with rent increase (if applicable)",
        "DocuSign e-signature workflow for new lease",
        "Signed lease synced back to Yardi automatically"
      ],
      icon: FileText
    },
    {
      title: "Move-out inspection scheduling",
      description: "Automatically schedule move-out inspections 14 days before lease end. Send residents appointment booking links, collect pre-inspection photos via WhatsApp, and generate inspection reports.",
      details: [
        "Auto-triggered 14 days before lease end",
        "Calendar integration for inspection booking",
        "Pre-inspection photo collection via WhatsApp",
        "Digital inspection report generation & archiving"
      ],
      icon: CalendarCheck
    }
  ];

  const pilotSteps = [
    {
      title: "Setup (Week 1)",
      description: "Connect TermFlow to Yardi via secure API. Configure automation triggers for one pilot property. Map billing ledger fields and test arrears detection workflows.",
      tasks: [
        "Yardi API connection & billing ledger mapping",
        "Configure arrears detection thresholds",
        "Set up email/WhatsApp templates with your branding",
        "Test workflows with sample resident & billing data"
      ]
    },
    {
      title: "Test (Week 2)",
      description: "Run live automations on pilot property. Monitor arrears reminders, payment tracking, and maintenance routing. Collect feedback from finance and on-site teams.",
      tasks: [
        "Go live with arrears detection & reminder workflows",
        "Monitor payment conversion rates & resident responses",
        "Test maintenance ticket classification & routing",
        "Refine reminder timing & messaging based on results"
      ]
    },
    {
      title: "Scale (Week 3+)",
      description: "Roll out to remaining Yardi properties. Enable advanced features (instalment plans, lease renewals, move-out inspections). Track arrears reduction and time saved.",
      tasks: [
        "Expand to all properties in your Yardi portfolio",
        "Enable instalment plans & lease renewal automation",
        "Set up performance dashboards (arrears reduction, time saved)",
        "Ongoing optimization & monthly reviews"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="TermFlow for Yardi | Automate Booking, Billing, Arrears, Maintenance - PBSA Automation"
        description="From booking to billing, automate the entire resident journey with Yardi + TermFlow. Reduce arrears by 40%, route maintenance 95% faster. GDPR-compliant, 2-week pilot."
        keywords="Yardi automation, PBSA Yardi integration, Yardi arrears automation, Yardi maintenance routing, Yardi lease renewal, student accommodation billing"
        canonical="https://termflow.co.uk/integrations/yardi"
        ogTitle="TermFlow for Yardi | Reduce Arrears 40%, Route Maintenance 95% Faster"
        ogDescription="Automate booking confirmations, arrears reminders, instalment plans, and maintenance routing. Real-time sync with Yardi, GDPR-compliant."
        ogType="website"
        ogUrl="https://termflow.co.uk/integrations/yardi"
      />

      <SoftwareApplicationSchema />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <TermFlowWordmark />
            <SiteSearch />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/integrations" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-integrations">
              Integrations
            </Link>
            <Button asChild size="sm" variant="default" data-testid="button-book-demo-header">
              <Link href="/book-demo">Book Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-background to-background dark:from-green-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4" data-testid="badge-integration-category">
              <DollarSign className="w-3 h-3 mr-1" />
              Yardi Integration
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              TermFlow for Yardi
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              From booking to billing, automate the entire resident journey. TermFlow connects to Yardi to automate booking confirmations, 
              arrears nudges, maintenance routing, and billing communications—while your data stays in sync.
            </p>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card data-testid="card-metric-arrears-reduction">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Arrears Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">40%</p>
                  <p className="text-xs text-muted-foreground mt-1">Automated payment reminders</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-maintenance-routing">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Maintenance Routing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">95% faster</p>
                  <p className="text-xs text-muted-foreground mt-1">Auto-classification & dispatch</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-renewal-rate">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Lease Renewal Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">+28%</p>
                  <p className="text-xs text-muted-foreground mt-1">Automated renewal campaigns</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why TermFlow + Yardi */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why TermFlow + Yardi?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Yardi is the backbone of your property management—bookings, billing, ledgers, and reporting. But it doesn't handle the daily 
              communication grind: chasing arrears, routing maintenance, sending renewal offers, and scheduling inspections. TermFlow automates 
              these workflows while keeping Yardi as your single source of truth.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card data-testid="card-problem">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Without TermFlow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Finance teams manually export arrears reports and send reminders</p>
                  <p>• Instalment plans negotiated via phone/email (untracked)</p>
                  <p>• Maintenance tickets manually classified and routed</p>
                  <p>• Lease renewals sent individually, signed copies uploaded manually</p>
                  <p>• Move-out inspections scheduled via back-and-forth emails</p>
                </CardContent>
              </Card>

              <Card data-testid="card-solution">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    With TermFlow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Arrears detected daily, tiered reminders sent automatically</p>
                  <p>• Instalment plans offered via AI, tracked & enforced automatically</p>
                  <p>• Maintenance tickets classified with AI, routed to right contractor</p>
                  <p>• Lease renewals sent 60 days early, e-signed via DocuSign</p>
                  <p>• Move-out inspections scheduled automatically with photo collection</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What We Automate */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">What We Automate</h2>
            
            <div className="space-y-8">
              {automationSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} data-testid={`card-automation-${index + 1}`}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <CardTitle className="text-xl">{step.title}</CardTitle>
                            <Badge variant="outline" className="shrink-0">Step {index + 1}</Badge>
                          </div>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid md:grid-cols-2 gap-3 text-sm">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
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

      {/* How It Works: Data Flow */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">How It Works: Data Flow</h2>
            
            <Card data-testid="card-data-flow">
              <CardHeader>
                <CardTitle>Yardi API Integration with Billing Sync</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Yardi Event Trigger</h4>
                      <p className="text-sm text-muted-foreground">
                        New booking, arrears detected, maintenance ticket created → Yardi API fires event to TermFlow
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">TermFlow Automation Engine</h4>
                      <p className="text-sm text-muted-foreground">
                        Pulls resident & billing data (name, balance, payment history), applies business rules, and triggers appropriate workflow
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Multi-Channel Outreach</h4>
                      <p className="text-sm text-muted-foreground">
                        Sends arrears reminder, renewal offer, or maintenance update via email, WhatsApp, or SMS based on resident preferences
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Response & Data Sync</h4>
                      <p className="text-sm text-muted-foreground">
                        Resident pays arrears, signs renewal, or books inspection → TermFlow logs activity and syncs payment/contract status back to Yardi
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Integration Method:</strong> Yardi REST API for billing ledger sync, resident portal connection for maintenance tickets. 
                    Real-time webhook support where available, otherwise hourly sync.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security & DPIA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              Security & DPIA
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card data-testid="card-security-access">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Data Access Scope
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold mb-1">Read Access:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Resident contact data (name, email, phone)</li>
                      <li>• Billing ledger (balance, payment history, arrears status)</li>
                      <li>• Lease start/end dates, renewal eligibility</li>
                      <li>• Maintenance ticket details (issue type, status, location)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Write Access:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Communication log timestamps (arrears reminders sent)</li>
                      <li>• Instalment plan status & payment tracking</li>
                      <li>• Maintenance ticket classification & routing updates</li>
                      <li>• Lease renewal campaign engagement metrics</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-security-compliance">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    GDPR & Sub-Processor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold mb-1">Sub-Processor Agreement:</p>
                    <p className="text-muted-foreground">
                      TermFlow acts as a data processor on behalf of your organisation. Standard DPA provided with GDPR Article 28 clauses.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">PII Scoping:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Contact data limited to name, email, phone, payment status</li>
                      <li>• No financial data stored (payment links via Stripe only)</li>
                      <li>• Data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                      <li>• Retention: 12 months post-contract end (configurable)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <strong>DPIA Support:</strong> We provide a pre-filled Data Protection Impact Assessment template for your compliance team. 
                Covers billing data access, retention policies, and payment security measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Program */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Pilot Program: 2 Weeks, 1 Property</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Test TermFlow on a single property before rolling out to your entire Yardi portfolio. 
              Target: <strong>40% arrears reduction</strong> and <strong>95% faster maintenance routing</strong>.
            </p>

            <div className="space-y-6">
              {pilotSteps.map((step, index) => (
                <Card key={index} data-testid={`card-pilot-step-${index + 1}`}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <CardTitle>{step.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-2">{step.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {step.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button asChild size="lg" data-testid="button-book-pilot">
                <Link href="/book-demo">
                  Book Your Yardi Pilot
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                2-week pilot • No long-term contract • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      <MobileStickyCTA />
      <BackToTop />
    </div>
  );
}

function AlertTriangle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
