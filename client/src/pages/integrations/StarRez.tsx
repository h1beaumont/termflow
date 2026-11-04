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
  Home, 
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  FileText,
  Mail,
  Users,
  Key,
  TrendingUp,
  RefreshCw,
  Lock
} from "lucide-react";
import { Link } from "wouter";

export default function StarRezIntegration() {
  const automationSteps = [
    {
      title: "Pre-arrival welcome emails with document requests",
      description: "Automatically send personalized welcome emails to new residents as soon as their booking is confirmed in StarRez. Include tailored document checklists (ID, visa, guarantor forms) based on student type (UK, EU, International).",
      details: [
        "Triggered automatically on booking confirmation",
        "Personalised by nationality & student type",
        "Mobile-optimised upload links for WhatsApp/email",
        "Multi-language support for international students"
      ],
      icon: Mail
    },
    {
      title: "Automated ID & guarantor follow-ups with OCR extraction",
      description: "Chase missing documents with smart reminders via WhatsApp and email. OCR extracts passport, visa, and BRP details automatically. AI validates expiry dates and flags issues for manual review.",
      details: [
        "OCR extraction of ID data (name, DOB, nationality, expiry)",
        "Automatic expiry date validation",
        "Guarantor document verification for international students",
        "Escalation to compliance team for complex cases"
      ],
      icon: FileText
    },
    {
      title: "Check-in day instructions with key handoff details",
      description: "Send automated check-in instructions 48 hours before move-in. Include key collection location, building access codes, WiFi details, and emergency contacts. Sync with StarRez room allocation data.",
      details: [
        "Automatic trigger 48h before move-in date",
        "Building-specific instructions (key location, access codes)",
        "WiFi credentials and facility information",
        "Emergency contact details and on-site team"
      ],
      icon: Key
    },
    {
      title: "Rebooker campaigns with NPS tracking",
      description: "Identify high-satisfaction residents (NPS 9-10) and automatically trigger rebooking campaigns 8-12 weeks before contract end. Track engagement and conversion rates in real-time.",
      details: [
        "NPS survey automation post-move-in",
        "Targeted rebooking offers for high-NPS residents",
        "Multi-channel outreach (email, WhatsApp, SMS)",
        "Real-time conversion tracking & reporting"
      ],
      icon: TrendingUp
    },
    {
      title: "Room allocation notifications",
      description: "Instant notifications when room allocations are updated in StarRez. Students receive their room number, floor plan, and flatmate introductions automatically. Reduces 'where's my room?' queries by 80%.",
      details: [
        "Real-time sync with StarRez allocation updates",
        "Interactive floor plans with room highlighting",
        "Flatmate introductions (name, course, interests)",
        "Building amenities & facilities guide"
      ],
      icon: Home
    },
    {
      title: "Lease renewal automation with DocuSign",
      description: "Automatic lease renewal workflows 60 days before contract end. Generate renewal contracts, send via DocuSign, and track signature status. Sync signed contracts back to StarRez automatically.",
      details: [
        "Auto-triggered 60 days before contract end",
        "DocuSign e-signature workflow integration",
        "Signature status tracking & reminders",
        "Signed contracts synced back to StarRez"
      ],
      icon: RefreshCw
    }
  ];

  const pilotSteps = [
    {
      title: "Setup (Week 1)",
      description: "Connect TermFlow to your StarRez instance via secure API. Configure automation triggers for one pilot property (100-300 beds recommended). Map data fields and test workflows.",
      tasks: [
        "API connection & data field mapping",
        "Configure automation triggers for pilot property",
        "Set up email/WhatsApp templates with your branding",
        "Test workflows with sample resident data"
      ]
    },
    {
      title: "Test (Week 2)",
      description: "Run live automations on pilot property. Monitor performance, collect feedback from on-site team, and refine workflows. TermFlow support available daily for troubleshooting.",
      tasks: [
        "Go live with pre-arrival & check-in automations",
        "Monitor delivery rates & resident engagement",
        "Collect on-site team feedback",
        "Refine templates & timing based on results"
      ]
    },
    {
      title: "Scale (Week 3+)",
      description: "Roll out successful workflows to remaining properties. Enable rebooking campaigns, document collection, and renewal automations. Track time saved and conversion metrics.",
      tasks: [
        "Expand to all properties in your StarRez portfolio",
        "Enable advanced features (rebooking, renewals, OCR)",
        "Set up performance dashboards",
        "Ongoing optimization & monthly reviews"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="TermFlow for StarRez | Automate Pre-Arrival, Documents, Rebooking - PBSA Automation"
        description="Close the human gaps in StarRez with TermFlow. Automate pre-arrival emails, document chasing, check-in instructions, and rebooker campaigns. Save 15+ hrs/week, boost rebooking by 35%."
        keywords="StarRez automation, PBSA StarRez integration, StarRez pre-arrival automation, StarRez document collection, StarRez rebooking, student accommodation automation"
        canonical="https://termflow.co.uk/integrations/starrez"
        ogTitle="TermFlow for StarRez | Save 15+ Hours/Week on Manual Comms"
        ogDescription="Automate pre-arrival workflows, document collection, and rebooking campaigns. Real-time sync with StarRez, GDPR-compliant, 2-week pilot."
        ogType="website"
        ogUrl="https://termflow.co.uk/integrations/starrez"
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
      <section className="py-16 bg-gradient-to-br from-blue-50 via-background to-background dark:from-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4" data-testid="badge-integration-category">
              <Home className="w-3 h-3 mr-1" />
              StarRez Integration
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              TermFlow for StarRez
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Close the human gaps in StarRez—pre-arrival emails, document chasing, check-in instructions, and rebooker nudges. 
              TermFlow fills the manual communication gaps with intelligent automation while your data stays in StarRez.
            </p>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card data-testid="card-metric-time-saved">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Time Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">15+ hrs/week</p>
                  <p className="text-xs text-muted-foreground mt-1">Manual comms eliminated</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-rebooking">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Rebooking Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">+35%</p>
                  <p className="text-xs text-muted-foreground mt-1">Higher retention with NPS-driven campaigns</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-document-collection">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Document Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">94%</p>
                  <p className="text-xs text-muted-foreground mt-1">Collected on first automated ask</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why TermFlow + StarRez */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why TermFlow + StarRez?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              StarRez is powerful for managing bookings, room allocations, and billing—but it doesn't handle the hundreds of manual emails, 
              document chases, and rebooking nudges your team sends every week. TermFlow sits on top of StarRez to automate these human-intensive tasks 
              while keeping your source of truth in StarRez.
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
                  <p>• Teams manually send pre-arrival emails to every new booking</p>
                  <p>• Document chasing done via spreadsheets & reminder emails</p>
                  <p>• Check-in instructions sent individually before move-in day</p>
                  <p>• Rebooking campaigns require manual NPS tracking & outreach</p>
                  <p>• Room allocation updates = "where's my room?" inbox chaos</p>
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
                  <p>• Pre-arrival emails sent automatically on booking confirmation</p>
                  <p>• Documents collected via WhatsApp/email with OCR extraction</p>
                  <p>• Check-in instructions sent 48h before move-in (auto-synced)</p>
                  <p>• Rebooking campaigns triggered by NPS score (9-10 only)</p>
                  <p>• Room allocation notifications sent instantly with floor plans</p>
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
                <CardTitle>Real-Time Sync with StarRez</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">StarRez Event Trigger</h4>
                      <p className="text-sm text-muted-foreground">
                        Booking confirmed, room allocated, or contract end approaching → StarRez webhook fires to TermFlow
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
                        Pulls resident data (name, email, phone, nationality, move-in date), applies business rules, and triggers appropriate workflow
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
                        Sends personalised email, WhatsApp, or SMS based on resident preferences and engagement history
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
                        Student responds (uploads document, confirms check-in, books renewal) → TermFlow logs activity and syncs status back to StarRez
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Integration Method:</strong> StarRez REST API + webhook-based triggers. No data duplication—StarRez remains your single source of truth.
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
                      <li>• Resident name, email, phone, nationality</li>
                      <li>• Booking status, move-in/out dates, room allocation</li>
                      <li>• Contract start/end dates</li>
                      <li>• NPS scores (if stored in StarRez)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Write Access:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Document upload status (ID, visa, guarantor forms)</li>
                      <li>• Communication log timestamps</li>
                      <li>• Rebooking campaign engagement metrics</li>
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
                      <li>• Contact data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                      <li>• Document uploads stored in GDPR-compliant EU data centers</li>
                      <li>• Retention: 12 months post-contract end (configurable)</li>
                      <li>• Right to erasure supported via API</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <strong>DPIA Support:</strong> We provide a pre-filled Data Protection Impact Assessment template for your compliance team. 
                Covers data flows, retention policies, and security measures.
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
              Test TermFlow on a single property (100-300 beds recommended) before rolling out to your entire StarRez portfolio. 
              Target: <strong>15+ hours/week saved</strong> and <strong>35% rebooking rate improvement</strong>.
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
                  Book Your StarRez Pilot
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
