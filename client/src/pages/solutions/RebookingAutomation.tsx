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
  RefreshCw, 
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  TrendingUp,
  Star,
  Video,
  FileSignature,
  Gift
} from "lucide-react";
import { Link } from "wouter";

export default function RebookingAutomation() {
  const workflowSteps = [
    {
      title: "NPS Survey",
      description: "Automated NPS survey sent 2-3 months before contract end. Identifies promoters (9-10), passives (7-8), and detractors (0-6) for targeted follow-up.",
      details: [
        "Automated trigger 60-90 days before contract end",
        "Multi-channel delivery (WhatsApp, email, SMS)",
        "Automatic sentiment analysis and categorisation",
        "Detractor feedback routed to on-site team for intervention"
      ],
      icon: Star
    },
    {
      title: "Personalised Offers",
      description: "Promoters receive early-bird rebooking offers with loyalty discounts. System generates personalised offers based on room type, contract length, and preferences.",
      details: [
        "Dynamic pricing rules (loyalty discounts, early-bird rates)",
        "Room preference matching from previous year",
        "Group booking coordination for friend groups",
        "Limited-time offer urgency messaging"
      ],
      icon: Gift
    },
    {
      title: "Virtual Tour Booking",
      description: "Students can book self-guided virtual tours or in-person viewings for new room types. Automatic calendar sync and reminder workflow.",
      details: [
        "Self-service virtual tour links (video + 360° if available)",
        "In-person viewing booking with calendar integration",
        "Automated reminders 24h and 2h before viewing",
        "Post-viewing follow-up within 2 hours"
      ],
      icon: Video
    },
    {
      title: "Digital Signing",
      description: "One-click contract renewal via DocuSign. Pre-filled with previous year's details, students just review and sign on mobile. Deposit link sent automatically.",
      details: [
        "DocuSign integration for legally binding e-signatures",
        "Contract pre-filled from previous tenancy data",
        "Mobile-optimised signing experience",
        "Automatic deposit collection via Stripe after signing"
      ],
      icon: FileSignature
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="TermFlow Rebooking Automation | 35% Higher Retention, 2-Day Time to Sign for PBSA"
        description="Automate PBSA rebooking with TermFlow: NPS surveys → personalised offers → virtual tours → DocuSign contracts. 35% retention increase, 2-day average time to sign, loyalty discounts. Turn satisfied tenants into rebookers automatically."
        keywords="termflow rebooking automation, PBSA student retention, automated NPS surveys, contract renewal automation, tenancy renewal workflow, loyalty program automation, virtual tour booking, PBSA retention rates, student accommodation rebooking"
        canonical="https://termflow.co.uk/solutions/rebooking-automation"
        ogTitle="TermFlow Rebooking Automation | 35% Higher Retention for PBSA"
        ogDescription="Automated NPS surveys, personalised renewal offers, virtual tours & DocuSign contracts. 35% higher rebooking rates, 2-day time to sign."
        ogType="website"
        ogUrl="https://termflow.co.uk/solutions/rebooking-automation"
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
      <section className="py-16 bg-gradient-to-br from-teal-50 via-background to-background dark:from-teal-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4" data-testid="badge-solution-category">
              <RefreshCw className="w-3 h-3 mr-1" />
              Rebooking Automation
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Rebooking Automation for PBSA
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Turn satisfied tenants into rebookers with automated NPS surveys, personalised renewal offers, virtual tour invitations, and seamless contract signing. 
              Increase rebooking rates by 35% while reducing time-to-sign to just 2 days.
            </p>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card data-testid="card-metric-rebooking-rate">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Rebooking Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">+35%</p>
                  <p className="text-xs text-muted-foreground mt-1">Increase vs manual outreach</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-time-to-sign">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Time to Sign</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">2 days</p>
                  <p className="text-xs text-muted-foreground mt-1">Average from offer to signature</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-nps">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">NPS Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">68%</p>
                  <p className="text-xs text-muted-foreground mt-1">Students complete survey</p>
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
              <Card data-testid="card-proof-rebooking">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Rebooking Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Before Automation</p>
                    <p className="text-2xl font-bold text-destructive">52% rebooking rate</p>
                    <p className="text-xs text-muted-foreground">Manual outreach, inconsistent follow-up</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">After Automation</p>
                    <p className="text-2xl font-bold text-green-600">70% rebooking rate</p>
                    <p className="text-xs text-muted-foreground">Automated NPS → offer → sign workflow</p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="font-semibold">For 200-bed property:</p>
                    <p className="text-xl font-bold text-primary">+36 rebookers/year</p>
                    <p className="text-sm text-muted-foreground">£216k additional revenue (@£6k/bed/year)</p>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-proof-efficiency">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Speed & Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Time to Sign (Offer → Contract)</span>
                    <span className="text-xl font-bold">2 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">NPS Response Rate</span>
                    <span className="text-xl font-bold">68%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Offer Acceptance Rate (Promoters)</span>
                    <span className="text-xl font-bold">82%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Virtual Tour Completion</span>
                    <span className="text-xl font-bold">91%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Manual Outreach Time Saved</span>
                    <span className="text-xl font-bold">12 hrs/week</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 border-l-4 border-l-teal-500" data-testid="card-proof-nps-insights">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-teal-500" />
                  NPS-Driven Retention Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  TermFlow's automated NPS workflow segments residents into three groups and triggers tailored actions:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Promoters (9-10)</Badge>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Immediate rebooking offer with loyalty discount</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Early-bird rates (limited time)</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Friend referral incentives</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Passives (7-8)</Badge>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Virtual tour invite for upgraded rooms</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Personalised offer based on feedback</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Follow-up from on-site team</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Detractors (0-6)</Badge>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Immediate escalation to on-site manager</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Issue resolution workflow triggered</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Follow-up survey after issue resolved</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance & Data Retention */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Compliance & Consent Management</h2>
            
            <Card className="border-l-4 border-l-primary" data-testid="card-compliance">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="mb-2">GDPR-Safe Rebooking Communications</CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      All rebooking communications are GDPR-compliant, with consent tracking and transparent data usage for marketing purposes.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Consent Management
                  </h3>
                  <ul className="space-y-2 ml-6">
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Marketing consent captured during initial onboarding
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      One-click unsubscribe available in all marketing communications
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      NPS surveys sent to all residents (transactional, not marketing)
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Preference centre for channel selection (WhatsApp, email, SMS)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Data Retention & Privacy
                  </h3>
                  <ul className="space-y-2 ml-6">
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      NPS responses stored securely with encryption
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Automatic data retention policies (configurable 1-7 years post-tenancy)
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Rebooking history and preferences stored for personalisation
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Data subject access request (DSAR) automation for resident data
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileSignature className="w-4 h-4 text-primary" />
                    Contract Signing & Legal Binding
                  </h3>
                  <p className="text-sm text-muted-foreground ml-6">
                    Renewal contracts sent via DocuSign for legally binding e-signatures. All contracts include audit trails 
                    (timestamp, IP address, consent). Students can review terms before signing, with option to request amendments 
                    from on-site team.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-orange-600" />
                    Staff Overrides & Manual Intervention
                  </h3>
                  <p className="text-sm text-muted-foreground ml-6">
                    On-site teams can manually trigger rebooking offers, adjust loyalty discounts, or pause automated communications 
                    for individual students. Detractor feedback is always escalated to staff for personalised follow-up. All overrides 
                    are logged with reason codes.
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
            <h2 className="text-3xl font-bold mb-4">Ready to Increase Rebooking Rates?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              See how TermFlow automates NPS surveys, personalised offers, virtual tours, and contract signing to increase rebooking rates by 35%.
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
