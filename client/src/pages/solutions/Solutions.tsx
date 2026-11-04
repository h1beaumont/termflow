import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SEOHead } from "@/components/SEOHead";
import { SiteSearch } from "@/components/SiteSearch";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { BackToTop } from "@/components/BackToTop";
import { 
  UserCheck, 
  Wrench, 
  AlertCircle, 
  RefreshCw,
  CheckCircle,
  ArrowRight,
  Clock,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";

interface Solution {
  title: string;
  slug: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  stats: {
    label: string;
    value: string;
  }[];
}

const solutions: Solution[] = [
  {
    title: "Student Onboarding Automation",
    slug: "student-onboarding",
    description: "Automate ID collection, document verification, guarantor flows, and Right-to-Rent handoff. Turn move-in chaos into a smooth, compliant process.",
    icon: <UserCheck className="w-6 h-6" />,
    benefits: [
      "Automated ID & document collection",
      "Right-to-Rent compliance built-in",
      "Guarantor workflows for international students",
      "Digital contract signing via DocuSign"
    ],
    stats: [
      { label: "Time Saved", value: "15 hrs/week" },
      { label: "Compliance Rate", value: "100%" }
    ]
  },
  {
    title: "Maintenance Triage Automation",
    slug: "maintenance-triage",
    description: "Auto-classify issues, prioritise safety-critical requests, route to contractors, and keep residents updated—without your team living in the inbox.",
    icon: <Wrench className="w-6 h-6" />,
    benefits: [
      "Auto-classify with LLM + rules",
      "Priority routing for emergencies",
      "Integrates with Fixflo, Plentific, MRI",
      "Resident updates & knowledge articles"
    ],
    stats: [
      { label: "First Response", value: "< 2 mins" },
      { label: "Duplicate Tickets", value: "-65%" }
    ]
  },
  {
    title: "Rent Arrears & Payment Nudges",
    slug: "rent-arrears-nudges",
    description: "Automated instalment plans, guarantor workflows, and gentle payment reminders. Reduce arrears while maintaining positive resident relationships.",
    icon: <AlertCircle className="w-6 h-6" />,
    benefits: [
      "Automated payment reminders",
      "Instalment plan workflows",
      "Guarantor escalation protocols",
      "GDPR-compliant communications"
    ],
    stats: [
      { label: "Arrears Reduction", value: "40%" },
      { label: "Collection Rate", value: "+25%" }
    ]
  },
  {
    title: "Rebooking Automation",
    slug: "rebooking-automation",
    description: "Turn satisfied tenants into rebookers with automated NPS surveys, personalised renewal offers, virtual tours, and seamless contract signing.",
    icon: <RefreshCw className="w-6 h-6" />,
    benefits: [
      "NPS-triggered renewal offers",
      "Personalised tour invitations",
      "One-click contract renewal",
      "Loyalty incentives automation"
    ],
    stats: [
      { label: "Rebooking Rate", value: "+35%" },
      { label: "Time to Sign", value: "2 days" }
    ]
  }
];

export default function Solutions() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="PBSA Automation Solutions | Student Onboarding, Maintenance, Rebooking - TermFlow"
        description="Proven automation solutions for PBSA operators: student onboarding, maintenance triage, rent arrears management, and rebooking workflows. Save 20+ hours/week."
        keywords="PBSA automation, student onboarding automation, maintenance triage automation, rent arrears automation, rebooking automation, PBSA software, student accommodation operations"
        canonical="https://termflow.co.uk/solutions"
        ogTitle="PBSA Automation Solutions | TermFlow"
        ogDescription="Automate student onboarding, maintenance triage, rent arrears management, and rebooking workflows. Proven by operators managing 20,000+ beds."
        ogType="website"
        ogUrl="https://termflow.co.uk/solutions"
      />

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
            <Button asChild size="sm" variant="default" data-testid="button-book-demo">
              <Link href="/book-demo">Book Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="mb-4" data-testid="badge-solutions">
              <CheckCircle className="w-3 h-3 mr-1" />
              Automation Solutions
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Automate Your PBSA Operations from Inbox to Renewal
            </h1>
            
            <p className="text-xl text-muted-foreground">
              Four proven automation workflows designed specifically for student accommodation operators. 
              From onboarding to rebooking, close the manual gaps and reclaim your time.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-semibold">Save 20+ hours/week</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-semibold">85-95% automation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="font-semibold">100% compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution) => (
              <Card 
                key={solution.slug} 
                className="hover-elevate h-full flex flex-col" 
                data-testid={`card-solution-${solution.slug}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {solution.icon}
                    </div>
                    <div className="flex gap-3">
                      {solution.stats.map((stat, idx) => (
                        <div key={idx} className="text-right">
                          <div className="text-2xl font-bold text-primary">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{solution.title}</CardTitle>
                  <CardDescription className="text-base">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between gap-6">
                  <ul className="space-y-2">
                    {solution.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="default" className="w-full" data-testid={`button-learn-${solution.slug}`}>
                    <Link href={`/solutions/${solution.slug}`}>
                      Explore {solution.title} solution <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Automate Your PBSA Operations?
            </h2>
            <p className="text-xl text-muted-foreground">
              See how these solutions work together in a live demo. We'll show you exactly how to implement each workflow for your properties.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="default" data-testid="button-book-demo-cta">
                <Link href="/book-demo">
                  Book a Demo
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-pricing-cta">
                <Link href="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 TermFlow. All rights reserved.
          </p>
        </div>
      </footer>

      <BackToTop />
      <MobileStickyCTA />
    </div>
  );
}
