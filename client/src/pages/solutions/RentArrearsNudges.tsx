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
  AlertCircle, 
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  TrendingUp,
  MessageSquare,
  CreditCard,
  Users
} from "lucide-react";
import { Link } from "wouter";

export default function RentArrearsNudges() {
  const workflowSteps = [
    {
      title: "Detect Arrears",
      description: "Automated daily checks flag late payments within 24 hours. System detects partial payments, missed instalments, and first-time arrears vs repeat cases.",
      details: [
        "Daily automated payment reconciliation",
        "Partial payment detection and tracking",
        "First-time vs repeat arrears classification",
        "Integration with Stripe for payment status"
      ],
      icon: AlertCircle
    },
    {
      title: "Gentle Reminder",
      description: "Friendly, GDPR-compliant reminder sent via student's preferred channel (WhatsApp/email). No shame, just a helpful nudge with payment link and options.",
      details: [
        "Multi-channel delivery (WhatsApp, email, SMS)",
        "Personalised message with payment link",
        "Tone calibrated for student audience (no shame)",
        "Automatic language detection for international students"
      ],
      icon: MessageSquare
    },
    {
      title: "Instalment Plan Offer",
      description: "If arrears persist for 7+ days, automated instalment plan offer is sent. Student can self-select plan (2-week, 4-week, or custom) and commit digitally.",
      details: [
        "Pre-approved instalment plan templates (2-week, 4-week)",
        "Self-service plan selection and digital agreement",
        "Automatic calendar reminders for instalment dates",
        "Payment link generation for each instalment"
      ],
      icon: CreditCard
    },
    {
      title: "Guarantor Escalation",
      description: "If arrears exceed 14 days or instalment plan is missed, automated escalation to guarantor. Guarantor receives context-aware email with payment options.",
      details: [
        "Automatic guarantor contact retrieval from onboarding",
        "Context-aware messaging (arrears amount, timeline)",
        "Payment link for guarantor to pay directly",
        "CC to student to maintain transparency"
      ],
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Rent Arrears & Payment Nudges for PBSA | Automate Instalment Plans - TermFlow"
        description="Reduce rent arrears by 40% with automated payment reminders, instalment plan workflows, and guarantor escalation. GDPR-compliant, student-friendly nudges."
        keywords="rent arrears automation, PBSA arrears management, payment reminder automation, instalment plan automation, guarantor workflows, student rent collection"
        canonical="https://termflow.co.uk/solutions/rent-arrears-nudges"
        ogTitle="Rent Arrears Automation | 40% Reduction, +25% Collection Rate"
        ogDescription="Automated instalment plans, guarantor workflows, and gentle payment reminders. Reduce arrears while maintaining positive resident relationships."
        ogType="website"
        ogUrl="https://termflow.co.uk/solutions/rent-arrears-nudges"
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
      <section className="py-16 bg-gradient-to-br from-purple-50 via-background to-background dark:from-purple-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4" data-testid="badge-solution-category">
              <AlertCircle className="w-3 h-3 mr-1" />
              Rent Arrears Management
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Rent Arrears & Payment Nudges for PBSA
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Reduce arrears by 40% with automated payment reminders, instalment plan workflows, and guarantor escalation—all while maintaining positive resident relationships. GDPR-compliant, student-friendly nudges that actually work.
            </p>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card data-testid="card-metric-arrears-reduction">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Arrears Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">40%</p>
                  <p className="text-xs text-muted-foreground mt-1">Compared to manual reminders</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-collection-rate">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Collection Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">+25%</p>
                  <p className="text-xs text-muted-foreground mt-1">Increase in on-time payments</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-guarantor-success">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Guarantor Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">78%</p>
                  <p className="text-xs text-muted-foreground mt-1">Pay within 48 hours of contact</p>
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
              <Card data-testid="card-proof-financial">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Financial Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Before Automation</p>
                    <p className="text-2xl font-bold text-destructive">£36k/year arrears</p>
                    <p className="text-xs text-muted-foreground">200-bed property average</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">After Automation</p>
                    <p className="text-2xl font-bold text-green-600">£21k/year arrears</p>
                    <p className="text-xs text-muted-foreground">40% reduction in outstanding payments</p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="font-semibold">Net Improvement:</p>
                    <p className="text-xl font-bold text-primary">£15k/year saved</p>
                    <p className="text-sm text-muted-foreground">Per 200-bed property</p>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-proof-performance">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Arrears Reduction</span>
                    <span className="text-xl font-bold">40%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Collection Rate Increase</span>
                    <span className="text-xl font-bold">+25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Guarantor Response Rate</span>
                    <span className="text-xl font-bold">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Instalment Plan Completion</span>
                    <span className="text-xl font-bold">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Days to Payment</span>
                    <span className="text-xl font-bold">6 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 border-l-4 border-l-purple-500" data-testid="card-proof-sector-context">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Sector Context: Why Arrears Are Rising
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  UK student arrears have increased significantly post-pandemic. According to industry reports, PBSA operators face:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-purple-500 font-bold">•</span>
                    <span className="text-muted-foreground">Higher cost of living squeezing student budgets</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-purple-500 font-bold">•</span>
                    <span className="text-muted-foreground">International student payment delays (FX, guarantor coordination)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-purple-500 font-bold">•</span>
                    <span className="text-muted-foreground">Manual arrears chasing often delayed or inconsistent</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  <strong>TermFlow's automated nudges help operators maintain collection rates</strong> while preserving positive resident relationships—critical for rebooking and reputation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance & Data Retention */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Compliance & GDPR-Safe Communications</h2>
            
            <Card className="border-l-4 border-l-primary" data-testid="card-compliance">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="mb-2">GDPR-Compliant Arrears Management</CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      All payment reminders and guarantor communications are GDPR-compliant, with consent tracking and secure data handling.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    GDPR-Safe Communications
                  </h3>
                  <ul className="space-y-2 ml-6">
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Consent tracking for SMS/WhatsApp payment reminders
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Encrypted storage for payment data and guarantor details
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Student notification when guarantor is contacted (transparency)
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Automatic data retention policies (configurable 1-7 years post-tenancy)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Student-Friendly Tone & Calibration
                  </h3>
                  <p className="text-sm text-muted-foreground ml-6">
                    Reminder messages are tone-calibrated for student audiences—no shame, no pressure, just helpful nudges. 
                    Messages include payment links, instalment options, and support contact details. All communications are 
                    logged for audit and dispute resolution.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Guarantor Workflow Compliance
                  </h3>
                  <p className="text-sm text-muted-foreground ml-6">
                    Guarantor details collected during onboarding are stored securely and only accessed when arrears exceed thresholds. 
                    Guarantors receive context-aware emails with full transparency (student is CC'd). Guarantor consent for contact 
                    is captured at onboarding.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    Staff Overrides & Manual Escalation
                  </h3>
                  <p className="text-sm text-muted-foreground ml-6">
                    Staff can pause automated nudges for individual students (e.g., hardship cases, payment plan negotiations). 
                    All overrides are logged with reason codes. Staff can manually trigger guarantor contact or instalment plan offers at any time.
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
            <h2 className="text-3xl font-bold mb-4">Ready to Reduce Rent Arrears?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              See how TermFlow automates payment reminders, instalment plans, and guarantor workflows to reduce arrears by 40%.
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
