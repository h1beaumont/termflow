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
  MapPin, 
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Home,
  Mail,
  Users,
  Key,
  Wifi,
  Lock
} from "lucide-react";
import { Link } from "wouter";

export default function KineticIntegration() {
  const automationSteps = [
    {
      title: "Room allocation instant notifications",
      description: "Send automated notifications the moment room allocations are confirmed in Kinetic. Students receive room number, floor plan with their room highlighted, and building details—no more 'where's my room?' emails.",
      details: [
        "Triggered instantly on Kinetic allocation confirmation",
        "Interactive floor plan with student's room highlighted",
        "Building address, floor number, and room type",
        "Link to virtual tour and amenities guide"
      ],
      icon: MapPin
    },
    {
      title: "Check-in day automated instructions",
      description: "48 hours before move-in, automatically send personalised check-in instructions. Include key collection location, building access codes, WiFi credentials, and on-site team contact details.",
      details: [
        "Auto-triggered 48h before move-in date",
        "Key collection location & opening hours",
        "Building access codes and parking instructions",
        "WiFi SSID and password for student's building"
      ],
      icon: Key
    },
    {
      title: "Move-in welcome sequences with flatmate introductions",
      description: "Welcome students with a personalised sequence: flatmate introductions (name, course, interests), building rules, amenities guide, and first-week tips. Sent progressively over 7 days post-move-in.",
      details: [
        "Flatmate introductions with photos & interests",
        "Building rules & quiet hours reminders",
        "Amenities guide (gym, study rooms, laundry)",
        "First-week tips (local shops, transport, events)"
      ],
      icon: Users
    },
    {
      title: "Building-specific information (WiFi, facilities, rules)",
      description: "Deliver tailored information based on student's assigned building in Kinetic. WiFi credentials, gym booking links, laundry app instructions, and building-specific rules sent automatically.",
      details: [
        "WiFi credentials unique to student's building",
        "Gym, study room, and common area booking links",
        "Laundry app setup instructions & top-up details",
        "Building-specific rules (bike storage, guest policies)"
      ],
      icon: Wifi
    },
    {
      title: "Key collection reminders",
      description: "Automatic reminders 7 days, 3 days, and 1 day before move-in date. Include key collection location, required ID, and opening hours. Reduce no-shows and on-site confusion by 75%.",
      details: [
        "Multi-stage reminders (7 days, 3 days, 1 day before)",
        "Key collection location with Google Maps link",
        "Required ID documents (passport, visa, booking confirmation)",
        "Opening hours & emergency contact for late arrivals"
      ],
      icon: Clock
    },
    {
      title: "Early move-in/late checkout automation",
      description: "Process early move-in and late checkout requests automatically. Collect preferences via WhatsApp, check availability in Kinetic, and confirm with payment link (if applicable).",
      details: [
        "Capture early move-in/late checkout requests via WhatsApp",
        "Check availability in Kinetic API in real-time",
        "Auto-confirm if available, send payment link for fees",
        "Sync confirmed requests back to Kinetic"
      ],
      icon: Home
    }
  ];

  const pilotSteps = [
    {
      title: "Setup (Week 1)",
      description: "Connect TermFlow to your Kinetic instance via secure API. Configure automation triggers for one pilot property. Map room allocation fields and test notification workflows.",
      tasks: [
        "Kinetic API connection & room allocation mapping",
        "Configure notification triggers for pilot property",
        "Set up email/WhatsApp templates with your branding",
        "Test workflows with sample allocation data"
      ]
    },
    {
      title: "Test (Week 2)",
      description: "Run live automations during peak move-in period. Monitor notification delivery, student engagement, and on-site team feedback. TermFlow support available daily for troubleshooting.",
      tasks: [
        "Go live with room allocation & check-in notifications",
        "Monitor delivery rates & student satisfaction",
        "Collect on-site team feedback on query reduction",
        "Refine templates & timing based on results"
      ]
    },
    {
      title: "Scale (Week 3+)",
      description: "Roll out to all Kinetic properties. Enable advanced features (flatmate intros, early move-in automation). Track time saved and student satisfaction metrics.",
      tasks: [
        "Expand to all properties in your Kinetic portfolio",
        "Enable flatmate intros & building-specific info",
        "Set up performance dashboards (queries reduced, time saved)",
        "Ongoing optimization & monthly reviews"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="TermFlow for Kinetic | Automate Room Allocation, Check-In, Move-In - PBSA Automation"
        description="Smart room allocation with resident communication on autopilot. Automate allocation notifications, check-in instructions, and move-in sequences. Zero manual comms during peak move-in."
        keywords="Kinetic automation, PBSA Kinetic integration, Kinetic room allocation automation, Kinetic check-in automation, student accommodation move-in"
        canonical="https://termflow.co.uk/integrations/kinetic"
        ogTitle="TermFlow for Kinetic | Zero Manual Comms During Peak Move-In"
        ogDescription="Automate room allocation notifications, check-in instructions, and flatmate introductions. Real-time sync with Kinetic, GDPR-compliant."
        ogType="website"
        ogUrl="https://termflow.co.uk/integrations/kinetic"
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
      <section className="py-16 bg-gradient-to-br from-purple-50 via-background to-background dark:from-purple-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4" data-testid="badge-integration-category">
              <MapPin className="w-3 h-3 mr-1" />
              Kinetic Integration
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              TermFlow for Kinetic
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Smart room allocation with resident communication on autopilot. Automate allocation notifications, check-in instructions, 
              and move-in welcome sequences—so your team can focus on the in-person experience while TermFlow handles the digital comms.
            </p>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card data-testid="card-metric-manual-comms">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Manual Comms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">Zero</p>
                  <p className="text-xs text-muted-foreground mt-1">During peak move-in periods</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-query-reduction">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Query Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">80%</p>
                  <p className="text-xs text-muted-foreground mt-1">"Where's my room?" emails eliminated</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-student-satisfaction">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Student Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">4.8/5</p>
                  <p className="text-xs text-muted-foreground mt-1">Move-in experience rating</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why TermFlow + Kinetic */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why TermFlow + Kinetic?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kinetic excels at room allocation, booking management, and student portal functionality. But every allocation update triggers 
              a wave of manual communication: "Where's my room?", "How do I collect my keys?", "Who are my flatmates?". TermFlow automates 
              these resident touchpoints while Kinetic stays your source of truth.
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
                  <p>• On-site teams manually email allocation confirmations</p>
                  <p>• Students flood inbox with "where's my room?" queries</p>
                  <p>• Check-in instructions sent individually before move-in</p>
                  <p>• WiFi credentials and building rules shared via PDF attachments</p>
                  <p>• Key collection reminders = repetitive manual emails</p>
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
                  <p>• Allocation notifications sent instantly with floor plans</p>
                  <p>• Students receive room details, building info, and tour links</p>
                  <p>• Check-in instructions auto-sent 48h before move-in</p>
                  <p>• Building-specific WiFi, facilities, and rules delivered automatically</p>
                  <p>• Multi-stage key collection reminders (7d, 3d, 1d before)</p>
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
                <CardTitle>Kinetic API for Room Allocation Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Kinetic Event Trigger</h4>
                      <p className="text-sm text-muted-foreground">
                        Room allocated, check-in date approaching, or early move-in requested → Kinetic API fires event to TermFlow
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
                        Pulls student data (name, email, phone, room number, building, move-in date), applies business rules, and triggers appropriate workflow
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
                        Sends room allocation notification, check-in instructions, or flatmate intro via email/WhatsApp based on student preferences
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
                        Student confirms early move-in, acknowledges check-in instructions → TermFlow logs activity and syncs status back to Kinetic
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Integration Method:</strong> Kinetic REST API for room allocation data, real-time webhook updates when available. 
                    Read-only access to allocation data—Kinetic remains your single source of truth.
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
                    <p className="font-semibold mb-1">Read-Only Access:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Student name, email, phone</li>
                      <li>• Room allocation data (room number, building, floor)</li>
                      <li>• Move-in/out dates and check-in status</li>
                      <li>• Flatmate data (names, courses, interests - if public in Kinetic)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">No Write Access:</p>
                    <p className="text-muted-foreground">
                      TermFlow does not modify allocation data in Kinetic. All room assignments remain managed exclusively within Kinetic.
                    </p>
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
                      <li>• Communication logs stored for 12 months (configurable)</li>
                      <li>• GDPR-compliant communications (unsubscribe honored immediately)</li>
                      <li>• Right to erasure supported via API</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <strong>DPIA Support:</strong> We provide a pre-filled Data Protection Impact Assessment template for your compliance team. 
                Covers read-only data access, retention policies, and communication security measures.
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
              Test TermFlow on a single property during peak move-in period. 
              Target: <strong>Zero manual comms during peak move-in</strong>.
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
                  Book Your Kinetic Pilot
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
