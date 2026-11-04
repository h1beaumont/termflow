import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SEOHead } from "@/components/SEOHead";
import { SiteSearch } from "@/components/SiteSearch";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { BackToTop } from "@/components/BackToTop";
import { 
  Plug, 
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  Home,
  BarChart3,
  Target,
  Wrench
} from "lucide-react";
import { Link } from "wouter";

interface Integration {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  automations: string[];
  benefits: string;
}

const integrations: Integration[] = [
  {
    name: "StarRez",
    slug: "starrez",
    tagline: "Close the human gaps in your student accommodation management system",
    description: "Automate pre-arrival emails, document chasing, check-in instructions, and rebooker nudges. TermFlow fills the manual gaps in StarRez with intelligent automation.",
    icon: <Home className="w-8 h-8" />,
    category: "Property Management System",
    automations: [
      "Pre-arrival welcome emails & document requests",
      "Automated ID & guarantor follow-ups",
      "Check-in day instructions & key handoff",
      "Rebooker campaigns with NPS tracking"
    ],
    benefits: "15+ hrs/week saved on manual comms, 35% higher rebooking rates"
  },
  {
    name: "Yardi",
    slug: "yardi",
    tagline: "From booking to billing, automate the entire resident journey",
    description: "TermFlow connects to Yardi to automate booking confirmations, arrears nudges, maintenance routing, and billing communications. Your data stays in sync while manual work disappears.",
    icon: <BarChart3 className="w-8 h-8" />,
    category: "Property Management System",
    automations: [
      "Booking→billing automated confirmations",
      "Arrears detection & instalment workflows",
      "Maintenance ticket classification & routing",
      "Lease renewal automation with DocuSign"
    ],
    benefits: "40% reduction in arrears, 95% faster ticket routing"
  },
  {
    name: "Kinetic",
    slug: "kinetic",
    tagline: "Smart room allocation with resident communication on autopilot",
    description: "Automate room allocation notifications, check-in day flows, and move-in communications. TermFlow works alongside Kinetic to keep residents informed without manual effort.",
    icon: <Target className="w-8 h-8" />,
    category: "Student Accommodation Platform",
    automations: [
      "Room allocation instant notifications",
      "Check-in day automated instructions",
      "Move-in welcome sequences",
      "Flatmate introduction emails"
    ],
    benefits: "Zero manual comms during peak move-in periods"
  },
  {
    name: "Fixflo",
    slug: "fixflo",
    tagline: "Maintenance tickets that route themselves",
    description: "TermFlow auto-tags tickets, educates tenants with knowledge articles, and reduces repeat maintenance calls. Works seamlessly with your Fixflo workflows.",
    icon: <Wrench className="w-8 h-8" />,
    category: "Maintenance Management",
    automations: [
      "Auto-tagging & classification with AI",
      "Tenant education via knowledge articles",
      "Priority routing for emergencies",
      "Duplicate ticket detection & consolidation"
    ],
    benefits: "65% fewer duplicate tickets, <2 min first response time"
  }
];

export default function Integrations() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="TermFlow Integrations | Connect StarRez, Yardi, Kinetic & Fixflo PBSA Software"
        description="Plug TermFlow into StarRez, Yardi, Kinetic & Fixflo to automate communications. 15+ hrs/week saved on manual tasks, 35% higher rebooking rates, 65% fewer duplicate tickets. Ready-made workflows."
        keywords="termflow integrations, StarRez automation, Yardi PBSA automation, Kinetic student accommodation, Fixflo maintenance automation, PBSA software integrations, property management system integration, student housing software"
        canonical="https://termflow.co.uk/integrations"
        ogTitle="TermFlow Integrations | StarRez, Yardi, Kinetic & Fixflo Automation"
        ogDescription="Connect TermFlow to your existing PBSA tech stack. Automate comms in StarRez, Yardi, Kinetic & Fixflo without replacing your systems."
        ogType="website"
        ogUrl="https://termflow.co.uk/integrations"
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
            <Badge className="mb-4" data-testid="badge-integrations">
              <Plug className="w-3 h-3 mr-1" />
              Integrations
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Connect TermFlow to Your Existing PBSA Tech Stack
            </h1>
            
            <p className="text-xl text-muted-foreground">
              We integrate with StarRez, Yardi, Kinetic, and Fixflo to automate the manual gaps in your property management systems. 
              Keep your data where it is while automation handles the busywork.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-semibold">15+ hrs/week saved</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-semibold">GDPR & DPIA compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-semibold">Two-week pilot</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {integrations.map((integration) => (
              <Card 
                key={integration.slug} 
                className="hover-elevate h-full flex flex-col" 
                data-testid={`card-integration-${integration.slug}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="text-5xl" aria-label={integration.name}>
                      {integration.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {integration.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{integration.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground italic">
                    {integration.tagline}
                  </CardDescription>
                  <CardDescription className="text-base pt-2">
                    {integration.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm">What TermFlow Automates:</h4>
                    <ul className="space-y-2">
                      {integration.automations.map((automation, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{automation}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm font-medium text-primary">{integration.benefits}</p>
                    </div>
                  </div>
                  <Button asChild variant="default" className="w-full" data-testid={`button-learn-${integration.slug}`}>
                    <Link href={`/integrations/${integration.slug}`}>
                      View Integration Details <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & DPIA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Security & Data Protection</h2>
              <p className="text-muted-foreground">
                All integrations are GDPR compliant with full DPIA documentation available. 
                We act as a sub-processor and maintain strict data scoping protocols.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card data-testid="card-security-gdpr">
                <CardHeader>
                  <Shield className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">GDPR Compliant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    UK data residency, full consent tracking, and data retention policies aligned with PBSA regulations.
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-security-dpia">
                <CardHeader>
                  <CheckCircle className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">DPIA Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Complete Data Protection Impact Assessments for each integration, with PII scopes clearly defined.
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-security-pilot">
                <CardHeader>
                  <Zap className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Two-Week Pilot</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Test any integration with one property for two weeks. Clear metric targets and easy rollback.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Connect TermFlow to Your Systems?
            </h2>
            <p className="text-xl text-muted-foreground">
              Book a demo to see exactly how TermFlow integrates with your existing PBSA software. 
              We'll walk through data flows, security protocols, and implementation timelines.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="default" data-testid="button-book-demo-cta">
                <Link href="/book-demo">
                  Book a Demo
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-solutions-cta">
                <Link href="/solutions">
                  View Solutions
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
