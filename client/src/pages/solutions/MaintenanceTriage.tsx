import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  AlertTriangle,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";

export default function MaintenanceTriage() {
  const workflowSteps = [
    {
      title: "Capture",
      description: "Maintenance requests arrive via WhatsApp, email, web portal, or phone (transcribed). AI acknowledges within 2 minutes and creates ticket with unique reference number.",
      details: [
        "Multi-channel capture (WhatsApp, email, web, phone transcription)",
        "Instant auto-acknowledgment to resident",
        "Unique ticket reference number assigned",
        "Preferred contact channel detected automatically"
      ],
      icon: MessageSquare
    },
    {
      title: "Classify (LLM + Rules)",
      description: "AI categorises issue type (plumbing, electrical, heating, safety) with 94% accuracy. Combines LLM understanding with rule-based safety detection.",
      details: [
        "LLM-powered natural language understanding",
        "12 maintenance categories with confidence scoring",
        "Rule-based emergency keywords (leak, no heating, sparks)",
        "Location extraction (room number, common area, bathroom)"
      ],
      icon: Zap
    },
    {
      title: "Prioritise",
      description: "Automated priority scoring based on safety risk, property damage potential, and resident vulnerability. Assigns SLA: Emergency (1h), Urgent (24h), Routine (3-5 days).",
      details: [
        "Emergency detection for safety-critical issues",
        "Vulnerable resident flagging (disabilities, elderly)",
        "Property damage risk assessment",
        "SLA assignment with countdown timer"
      ],
      icon: AlertTriangle
    },
    {
      title: "Route (Fixflo/Plentific/MRI)",
      description: "Smart routing to in-house team or external contractors based on skillset, availability, and location. Direct integration with Fixflo, Plentific, and MRI Software.",
      details: [
        "Fixflo/Plentific/MRI integration for automatic dispatch",
        "Skill-based routing (plumber, electrician, general)",
        "Location-based assignment (nearest available technician)",
        "On-call schedule integration for after-hours emergencies"
      ],
      icon: ArrowRight
    },
    {
      title: "Close (with comms)",
      description: "Residents receive real-time updates on job status, technician ETA, and completion confirmation. Automatic satisfaction survey triggers after-job completion.",
      details: [
        "Real-time status updates to resident (via preferred channel)",
        "Technician details and ETA notifications",
        "Completion confirmation request",
        "Automatic satisfaction survey (1-5 rating + comments)"
      ],
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Maintenance Triage That Understands Student Life | PBSA Automation - TermFlow"
        description="Auto-classify maintenance issues, prioritise safety-critical requests, and route to contractors intelligently. Reduce first response time, cut duplicate tickets by 65%."
        keywords="PBSA maintenance automation, maintenance triage automation, Fixflo integration, Plentific automation, MRI Software integration, student accommodation maintenance"
        canonical="https://termflow.co.uk/solutions/maintenance-triage"
        ogTitle="Maintenance Triage Automation | First Response Time ↓, Duplicates ↓65%"
        ogDescription="AI-powered triage that auto-classifies, prioritises, and routes maintenance requests. Integrates with Fixflo, Plentific, and MRI Software."
        ogType="website"
        ogUrl="https://termflow.co.uk/solutions/maintenance-triage"
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
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">
              Home
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
            <Badge className="mb-4" data-testid="badge-solution-category">
              <Wrench className="w-3 h-3 mr-1" />
              Maintenance Triage
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Maintenance Triage That Understands Student Life
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Stop drowning in maintenance inbox chaos. Auto-classify issues with AI, prioritise safety-critical requests, and route to the right contractor—all without your team living in the inbox. Keep residents updated automatically.
            </p>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card data-testid="card-metric-response-time">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">First Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">&lt; 2 mins</p>
                  <p className="text-xs text-muted-foreground mt-1">Auto-acknowledgment to residents</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-duplicates">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Duplicate Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">↓65%</p>
                  <p className="text-xs text-muted-foreground mt-1">Automatic duplicate detection</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-sla-compliance">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">SLA Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">95%</p>
                  <p className="text-xs text-muted-foreground mt-1">On-time response & resolution</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">How It Works</h2>
            
            <div className="space-y-8">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} data-testid={`card-step-${step.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{step.title}</CardTitle>
                            <Badge variant="outline" className="text-xs">{`Step ${index + 1}`}</Badge>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{detail}</span>
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

      {/* Proof / Metrics */}
      <section className="py-16 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Real Results from PBSA Operators</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card data-testid="card-proof-efficiency">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Efficiency Gains
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Before Automation</p>
                    <p className="text-2xl font-bold text-destructive">2 hours/day</p>
                    <p className="text-xs text-muted-foreground">Manual triage, routing, and updates</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">After Automation</p>
                    <p className="text-2xl font-bold text-green-600">20 minutes/day</p>
                    <p className="text-xs text-muted-foreground">Edge-case review & escalations only</p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="font-semibold">For 500 requests/month:</p>
                    <p className="text-xl font-bold text-primary">40+ hours/month saved</p>
                    <p className="text-sm text-muted-foreground">Maintenance team can focus on actual repairs</p>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-proof-performance">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">First Response Time</span>
                    <span className="text-xl font-bold">&lt; 2 mins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Duplicate Tickets Reduced</span>
                    <span className="text-xl font-bold">↓65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">AI Classification Accuracy</span>
                    <span className="text-xl font-bold">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">SLA Compliance</span>
                    <span className="text-xl font-bold">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Resident Satisfaction</span>
                    <span className="text-xl font-bold">4.6/5</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 border-l-4 border-l-orange-500" data-testid="card-proof-integrations">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Integrations: Fixflo, Plentific, MRI Software
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  TermFlow integrates directly with leading PBSA maintenance platforms, automatically creating jobs and syncing status updates:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>Fixflo:</strong> Auto-create jobs, sync status, track contractor performance</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>Plentific:</strong> Smart dispatch with skillset matching and availability checks</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>MRI Software:</strong> Bi-directional sync for job status and resident updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance & Data Retention */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Compliance & Safety Guardrails</h2>
            
            <Card className="border-l-4 border-l-primary" data-testid="card-compliance">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="mb-2">Built-In Safety & GDPR Protection</CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      TermFlow's maintenance triage includes safety detection rules and GDPR-compliant data handling for all resident communications.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Safety-First Prioritisation
                  </h3>
                  <ul className="space-y-2 ml-6">
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Rule-based emergency keywords (leak, no heating, electrical sparks) override AI classification
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Vulnerable resident flags (disabilities, elderly) auto-escalate priority
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      After-hours emergency escalation to on-call staff (15-min response chain)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    GDPR-Safe Communications
                  </h3>
                  <ul className="space-y-2 ml-6">
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Resident data stored with encryption and access controls
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Automatic data retention policies (configurable 1-5 years post-tenancy)
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Consent tracking for SMS/WhatsApp communications
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-primary" />
                    Staff Overrides & Manual Review
                  </h3>
                  <p className="text-sm text-muted-foreground ml-6">
                    AI classifications below 80% confidence are flagged for human review. Staff can override priority, 
                    reassign contractors, or escalate at any stage. All overrides are logged for audit purposes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Automate Maintenance Triage?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              See how TermFlow handles auto-classification, prioritisation, and smart routing for your PBSA maintenance operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" data-testid="button-book-demo-cta">
                <Link href="/book-demo">
                  Book a Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-view-all-solutions">
                <Link href="/solutions">
                  View All Solutions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MobileStickyCTA />
      <BackToTop />
    </div>
  );
}
