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
  UserCheck, 
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  FileText,
  AlertTriangle
} from "lucide-react";
import { Link } from "wouter";

export default function StudentOnboarding() {
  const workflowSteps = [
    {
      title: "Capture",
      description: "Automated document requests triggered when student accepts offer. Multi-channel collection via WhatsApp, email, or web portal.",
      details: [
        "Automatic trigger on booking confirmation",
        "Personalised document checklist (UK vs International)",
        "Upload via WhatsApp, email, or secure portal",
        "Mobile-optimised for students on the go"
      ],
      icon: FileText
    },
    {
      title: "Process",
      description: "OCR extraction reads passport, visa, BRP details with 98% accuracy. AI validates expiry dates and flags issues automatically.",
      details: [
        "OCR extraction of ID data (name, DOB, nationality, expiry)",
        "Automatic expiry date validation",
        "Guarantor document verification for international students",
        "Duplicate detection across properties"
      ],
      icon: UserCheck
    },
    {
      title: "Route",
      description: "Right-to-Rent checks routed to compliance team with pre-filled checklist. DocuSign integration for instant contract signing.",
      details: [
        "Right-to-Rent compliance checklist auto-generated",
        "Escalation to human review for complex visa cases",
        "DocuSign e-signature workflow triggered",
        "Guarantor signature collection (if required)"
      ],
      icon: ArrowRight
    },
    {
      title: "Close",
      description: "Welcome pack sent automatically. Student receives move-in details, key collection instructions, and first-day checklist.",
      details: [
        "Automated welcome email with move-in guide",
        "Key collection appointment booking",
        "Pre-arrival checklist and FAQs",
        "Staff override available for edge cases"
      ],
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Student Onboarding Automation for PBSA | ID, Documents, Right-to-Rent - TermFlow"
        description="Automate student onboarding with ID collection, document verification, guarantor flows, and Right-to-Rent compliance. Save 15 hours/week, achieve 100% compliance rate."
        keywords="student onboarding automation, PBSA onboarding, ID document collection, Right-to-Rent automation, guarantor verification, international student onboarding"
        canonical="https://termflow.co.uk/solutions/student-onboarding"
        ogTitle="Student Onboarding Automation | Save 15 Hours/Week"
        ogDescription="Automate ID collection, document verification, and Right-to-Rent compliance for PBSA. Proven by operators managing 20,000+ beds."
        ogType="website"
        ogUrl="https://termflow.co.uk/solutions/student-onboarding"
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
      <section className="py-16 bg-gradient-to-br from-blue-50 via-background to-background dark:from-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4" data-testid="badge-solution-category">
              <UserCheck className="w-3 h-3 mr-1" />
              Student Onboarding
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Student Onboarding Automation for PBSA
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              From ID collection to Right-to-Rent sign-off in one seamless flow. Automate document verification, guarantor workflows, and compliance checks—turning move-in chaos into a smooth, compliant onboarding process.
            </p>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card data-testid="card-metric-time-saved">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Time Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">15 hrs/week</p>
                  <p className="text-xs text-muted-foreground mt-1">Manual document chasing eliminated</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-compliance">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Compliance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">100%</p>
                  <p className="text-xs text-muted-foreground mt-1">Right-to-Rent compliant</p>
                </CardContent>
              </Card>
              <Card data-testid="card-metric-completion">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">94%</p>
                  <p className="text-xs text-muted-foreground mt-1">Documents collected on first ask</p>
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
                  <Card key={index} data-testid={`card-step-${step.title.toLowerCase()}`}>
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
              <Card data-testid="card-proof-time">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Time Savings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Before Automation</p>
                    <p className="text-2xl font-bold text-destructive">15 hours/week</p>
                    <p className="text-xs text-muted-foreground">Chasing documents, manual checks</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">After Automation</p>
                    <p className="text-2xl font-bold text-green-600">30 minutes/week</p>
                    <p className="text-xs text-muted-foreground">Oversight & edge-case review only</p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="font-semibold">For 100 onboardings/year:</p>
                    <p className="text-xl font-bold text-primary">720+ hours saved</p>
                    <p className="text-sm text-muted-foreground">Equivalent to 0.4 FTE reclaimed</p>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-proof-compliance">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Compliance & Quality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Right-to-Rent Compliance</span>
                    <span className="text-xl font-bold">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Document Collection Rate</span>
                    <span className="text-xl font-bold">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">OCR Accuracy</span>
                    <span className="text-xl font-bold">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Time to Complete</span>
                    <span className="text-xl font-bold">4 days</span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold mb-2">International Students</p>
                    <p className="text-xs text-muted-foreground">Guarantor workflows automatically triggered for non-UK students, with GDPR-safe document storage</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Data Retention */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Compliance & Data Protection</h2>
            
            <Card className="border-l-4 border-l-primary" data-testid="card-compliance">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="mb-2">Built for Right-to-Rent & GDPR Compliance</CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      TermFlow's onboarding automation is designed to meet UK Right-to-Rent requirements and GDPR standards for international student data.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Right-to-Rent Compliance
                  </h3>
                  <ul className="space-y-2 ml-6">
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Automated checklist for UK and international students
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Document verification trail with timestamps
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Staff override for complex visa cases (with audit log)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    GDPR-Safe Data Handling
                  </h3>
                  <ul className="space-y-2 ml-6">
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Encrypted storage for all ID documents and personal data
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Automatic data retention policies (configurable 1-7 years post-tenancy)
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Student consent tracking for data processing
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Data subject access request (DSAR) automation
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Staff Overrides & Manual Review
                  </h3>
                  <p className="text-sm text-muted-foreground ml-6">
                    Complex visa cases (e.g., Tier 4 restrictions, BRP conditions) are automatically flagged for human review. 
                    Staff can override AI decisions at any stage, with all actions logged for audit purposes.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Integration: DocuSign for E-Signatures</h3>
                  <p className="text-sm text-muted-foreground">
                    Contracts are sent via DocuSign for legally binding e-signatures. Students sign on mobile, 
                    guarantors receive separate signature requests, and all documents are stored with audit trails.
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
            <h2 className="text-3xl font-bold mb-4">Ready to Automate Student Onboarding?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              See how TermFlow handles ID collection, document verification, and Right-to-Rent compliance for your PBSA operation.
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
