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
  Wrench, 
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  AlertTriangle as AlertTriangleIcon,
  MessageSquare,
  Users,
  FileText,
  Lock
} from "lucide-react";
import { Link } from "wouter";

export default function FixfloIntegration() {
  const automationSteps = [
    {
      title: "Auto-tagging & AI classification of tickets",
      description: "AI reads incoming maintenance tickets from Fixflo and classifies them into 12 categories (plumbing, electrical, heating, safety, etc.) with 94% accuracy. Auto-tags for priority routing.",
      details: [
        "LLM-powered natural language understanding",
        "12 maintenance categories with confidence scoring",
        "Rule-based emergency keywords (leak, no heating, sparks)",
        "Location extraction (room number, common area, bathroom)"
      ],
      icon: Zap
    },
    {
      title: "Tenant education via knowledge article suggestions",
      description: "Before escalating to a contractor, AI suggests relevant knowledge articles to tenants (e.g., 'How to reset WiFi router', 'Common boiler troubleshooting'). Reduces repeat calls by 40%.",
      details: [
        "AI matches ticket description to knowledge base",
        "Sends relevant articles via email/WhatsApp within 2 minutes",
        "Tracks if tenant resolves issue themselves",
        "Escalates to contractor if issue persists after 4 hours"
      ],
      icon: FileText
    },
    {
      title: "Priority routing for emergencies (gas, electric, water, locks)",
      description: "Safety-critical issues (gas leak, electrical fault, no water, lock-out) automatically flagged as emergencies. Routed to on-call team with SMS alert within 1 minute.",
      details: [
        "Emergency detection for gas, electric, water, locks",
        "SMS alert to on-call team (1 minute response time)",
        "Vulnerable resident flagging (disabilities, elderly)",
        "SLA assignment: Emergency (1h), Urgent (24h), Routine (3-5 days)"
      ],
      icon: AlertTriangleIcon
    },
    {
      title: "Duplicate ticket detection & consolidation",
      description: "AI detects duplicate tickets (e.g., 5 residents reporting 'no hot water' in same building). Consolidates into single ticket, notifies all residents of grouped issue.",
      details: [
        "Cross-reference tickets by building, issue type, and time",
        "Auto-consolidate duplicates into master ticket",
        "Notify all affected residents of grouped issue",
        "Reduces contractor call-outs by 65%"
      ],
      icon: Users
    },
    {
      title: "Contractor auto-assignment based on issue type",
      description: "Smart routing to in-house team or external contractors based on skillset (plumber, electrician, general), availability, and location. Direct integration with Fixflo contractor database.",
      details: [
        "Skill-based routing (plumber, electrician, HVAC, general)",
        "Location-based assignment (nearest available technician)",
        "On-call schedule integration for after-hours emergencies",
        "Automatic contractor dispatch via Fixflo API"
      ],
      icon: Wrench
    },
    {
      title: "Resident updates at each stage (logged → assigned → completed)",
      description: "Residents receive real-time status updates via WhatsApp and email at every stage: ticket logged, contractor assigned, technician en route, issue resolved. Automatic satisfaction survey on completion.",
      details: [
        "Real-time status updates (logged → assigned → en route → completed)",
        "Technician details and ETA notifications",
        "Completion confirmation request",
        "Automatic satisfaction survey (1-5 rating + comments)"
      ],
      icon: MessageSquare
    }
  ];

  const pilotSteps = [
    {
      title: "Setup (Week 1)",
      description: "Connect TermFlow to Fixflo via secure API. Configure AI classification rules for one pilot property. Map contractor skillsets and test routing workflows.",
      tasks: [
        "Fixflo API connection & ticket ingestion setup",
        "Configure AI classification for 12 maintenance categories",
        "Map contractor skillsets & availability schedules",
        "Test workflows with sample ticket data"
      ]
    },
    {
      title: "Test (Week 2)",
      description: "Run live automations on pilot property. Monitor ticket classification accuracy, duplicate detection, and resident satisfaction. TermFlow support available daily for troubleshooting.",
      tasks: [
        "Go live with auto-classification & routing",
        "Monitor duplicate detection & consolidation accuracy",
        "Track first response time & resident satisfaction scores",
        "Refine AI rules & knowledge base suggestions"
      ]
    },
    {
      title: "Scale (Week 3+)",
      description: "Roll out to all Fixflo-managed properties. Enable advanced features (knowledge base suggestions, emergency routing). Track duplicate ticket reduction and first response time.",
      tasks: [
        "Expand to all properties in your Fixflo portfolio",
        "Enable knowledge base suggestions & emergency routing",
        "Set up performance dashboards (duplicates ↓, response time ↓)",
        "Ongoing optimization & monthly reviews"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="TermFlow for Fixflo | Auto-Classify, Route, Update Maintenance Tickets - PBSA Automation"
        description="Maintenance tickets that route themselves. AI auto-tags, educates tenants, routes emergencies, and updates residents at every stage. 65% fewer duplicates, <2 min first response time."
        keywords="Fixflo automation, PBSA Fixflo integration, Fixflo AI classification, Fixflo maintenance routing, student accommodation maintenance automation"
        canonical="https://termflow.co.uk/integrations/fixflo"
        ogTitle="TermFlow for Fixflo | 65% Fewer Duplicates, <2 Min First Response Time"
        ogDescription="Auto-classify maintenance tickets, educate tenants with knowledge articles, route emergencies, and update residents in real-time. Integrates with Fixflo API."
        ogType="website"
        ogUrl="https://termflow.co.uk/integrations/fixflo"
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
      <section className="py-16 bg-gradient-to-br from-orange-50 via-background to-background dark:from-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4" data-testid="badge-integration-category">
              <Wrench className="w-3 h-3 mr-1" />
              Fixflo Integration
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              TermFlow for Fixflo
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Maintenance tickets that route themselves. TermFlow auto-tags tickets, educates tenants with knowledge articles, 
              and reduces repeat maintenance calls. Works seamlessly with your Fixflo workflows.
            </p>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card data-testid="card-metric-duplicate-reduction">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Duplicate Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">↓65%</p>
                  <p className="text-xs text-muted-foreground mt-1">Automatic duplicate detection</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-response-time">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">First Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">&lt;2 mins</p>
                  <p className="text-xs text-muted-foreground mt-1">Auto-acknowledgment to residents</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-self-service">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Self-Service Resolution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">40%</p>
                  <p className="text-xs text-muted-foreground mt-1">Via knowledge article suggestions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why TermFlow + Fixflo */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why TermFlow + Fixflo?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Fixflo is a powerful maintenance management platform—but it still requires humans to read, classify, and route every ticket. 
              TermFlow adds an AI layer that auto-classifies issues, suggests self-service solutions, and routes emergencies instantly—while 
              keeping Fixflo as your workflow engine and audit trail.
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
                  <p>• Maintenance teams manually read & classify every ticket</p>
                  <p>• Duplicate tickets create unnecessary contractor call-outs</p>
                  <p>• Emergencies buried in inbox, delayed response times</p>
                  <p>• Tenants don't know if their issue is being addressed</p>
                  <p>• Simple fixes (WiFi reset, boiler relight) require contractor visits</p>
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
                  <p>• AI classifies tickets automatically (94% accuracy)</p>
                  <p>• Duplicate detection consolidates related issues</p>
                  <p>• Emergencies flagged & routed to on-call team within 1 minute</p>
                  <p>• Residents receive real-time status updates at every stage</p>
                  <p>• Knowledge base suggestions resolve 40% of issues without contractor</p>
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
                <CardTitle>Fixflo API for Ticket Ingestion & Status Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Fixflo Ticket Created</h4>
                      <p className="text-sm text-muted-foreground">
                        Resident submits maintenance ticket via Fixflo portal → webhook fires to TermFlow with ticket details
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">TermFlow AI Classification</h4>
                      <p className="text-sm text-muted-foreground">
                        AI reads ticket description, classifies issue type (plumbing, electrical, heating), detects priority (emergency vs routine), and checks for duplicates
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Smart Routing & Tenant Education</h4>
                      <p className="text-sm text-muted-foreground">
                        If simple fix → send knowledge article to tenant. If emergency → route to on-call team with SMS alert. Otherwise → assign to appropriate contractor via Fixflo API.
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Real-Time Resident Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        TermFlow sends status updates to resident at every stage: ticket logged → contractor assigned → technician en route → issue resolved. Satisfaction survey triggered on completion.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Integration Method:</strong> Fixflo API for ticket ingestion and contractor assignment. Webhook for real-time status updates. 
                    Read/write access to maintenance tickets—Fixflo remains your workflow engine and audit trail.
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
                      <li>• Maintenance ticket details (issue description, location, priority)</li>
                      <li>• Resident contact data (name, email, phone)</li>
                      <li>• Contractor details (name, skillset, availability)</li>
                      <li>• Ticket status & resolution timestamps</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Write Access:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Ticket classification tags & priority flags</li>
                      <li>• Contractor assignment & routing updates</li>
                      <li>• Resident communication log timestamps</li>
                      <li>• Knowledge base suggestion tracking</li>
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
                      <li>• Ticket descriptions stored for 12 months (configurable)</li>
                      <li>• GDPR-safe resident communications (unsubscribe honored)</li>
                      <li>• Right to erasure supported via API</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <strong>DPIA Support:</strong> We provide a pre-filled Data Protection Impact Assessment template for your compliance team. 
                Covers ticket data access, resident communications, and retention policies.
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
              Test TermFlow on a single Fixflo-managed property. 
              Target: <strong>65% fewer duplicate tickets</strong> and <strong>&lt;2 minute first response time</strong>.
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
                  Book Your Fixflo Pilot
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
