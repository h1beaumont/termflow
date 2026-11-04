import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Building, TrendingUp, BarChart3, Users, CheckCircle, Shield, Zap, Globe } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function PBSAREITs() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Sectors", url: "/sectors" },
    { name: "PBSA REITs", url: "/sectors/pbsa-reits" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="TermFlow for PBSA REITs & Institutional Investors | Enterprise Automation"
        description="Portfolio-wide AI automation for PBSA REITs managing 1,000+ beds across multiple cities. Standardised workflows, real-time analytics, and 15% admin cost reduction per bed."
        keywords="PBSA REIT automation, institutional student accommodation, multi-property management, portfolio automation, PBSA analytics, investor reporting"
        canonical="https://termflow.co.uk/sectors/pbsa-reits"
        ogUrl="https://termflow.co.uk/sectors/pbsa-reits"
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <TermFlowWordmark />
            <SiteSearch />
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">
              Home
            </a>
            <Button asChild size="sm" variant="default" data-testid="button-book-demo">
              <a href="/book-demo">Book Demo</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <LastUpdated date="January 20, 2025" className="mb-8" />

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Building className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              TermFlow for PBSA REITs & Institutional Investors
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            Enterprise-grade AI automation for large-scale PBSA portfolios with 1,000+ beds across multiple cities. Portfolio-wide standardisation, real-time analytics, and investor-grade reporting. Designed for{" "}
            <Link href="/personas/central-operations" className="text-primary hover:underline" data-testid="link-central-operations">
              central operations teams
            </Link>
            {" "}managing multi-property portfolios.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Badge variant="secondary" data-testid="badge-sector">Enterprise/REIT</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-target-audience">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-tf-navy" />
              Who This Is For
            </CardTitle>
            <CardDescription>
              Institutional investors and REITs with multi-city PBSA portfolios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Portfolio Scale</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>1,000-10,000+ beds across portfolio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Properties in 5-20 UK university cities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Institutional ownership (REITs, private equity, pension funds)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Centralised operations with regional teams</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Operational Structure</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Central operations team (15-50 staff)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Property managers for each city/region</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Investor reporting requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Focus on NOI optimisation and yield</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-pain-points">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              Your Biggest Challenges
            </CardTitle>
            <CardDescription>
              What keeps portfolio directors and COOs up at night
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Multi-Property Standardisation</h3>
                <p className="text-sm text-muted-foreground">
                  15 properties using 15 different processes for tenant onboarding. Manchester team does things differently to Bristol. Impossible to benchmark performance or scale best practices. Regional managers resistant to central control.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Investor Reporting Burden</h3>
                <p className="text-sm text-muted-foreground">
                  Monthly investor reports require 3 days of manual data compilation. Occupancy, RevPAB, and NOI data scattered across systems. Board requires real-time visibility you can't provide. Late or inaccurate reports damage investor confidence.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Admin Costs at Scale</h3>
                <p className="text-sm text-muted-foreground">
                  £45/bed/month admin costs eating into NOI. Need 2 staff per 100 beds for enquiry handling and contracts. Can't justify hiring 60 more staff to maintain quality. Automation could save £500k+ annually but legacy systems block implementation.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Cross-Property Benchmarking</h3>
                <p className="text-sm text-muted-foreground">
                  Can't compare London performance to Leeds because data structures differ. No way to identify which properties need intervention. Best practices from top performers can't be replicated portfolio-wide.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Peak Season Strain</h3>
                <p className="text-sm text-muted-foreground">
                  Clearing season hits all 15 properties simultaneously. Central team overwhelmed supporting regional operations. Temporary staff costs spike £80k in August-September. Properties with weaker teams underperform consistently.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Yield Optimisation</h3>
                <p className="text-sm text-muted-foreground">
                  Board expects 2% NOI improvement year-on-year. Can't raise rents significantly in competitive markets. Must reduce operating costs whilst maintaining service quality. Traditional efficiency gains already exhausted.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-how-termflow-helps">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              How TermFlow Transforms Portfolio Operations
            </CardTitle>
            <CardDescription>
              Enterprise automation with portfolio-wide standardisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Central Operations Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Real-time visibility across all 15 properties from single dashboard. Live occupancy, pipeline, and revenue metrics for each city. Automated alerts for properties falling behind targets. Standardised KPIs for meaningful benchmarking. Board-ready reports generated automatically.
              </p>
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm font-medium">2,500-Bed Portfolio Case Study</p>
                <p className="text-sm text-muted-foreground mt-1">
                  REIT with 8 properties across UK. Portfolio-wide automation saved £42k per property annually. Reduced central ops team from 32 to 24 staff whilst improving performance. 99% average occupancy across portfolio vs 94% pre-automation. Board reporting time cut from 3 days to 2 hours.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Standardised Workflows</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Identical tenant onboarding process across all properties. AI automation ensures consistency regardless of regional team quality. Best practices replicated portfolio-wide automatically. Regional managers retain oversight whilst central team maintains standards.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Cross-Property Benchmarking</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Compare lead conversion rates across all cities. Identify which properties need operational intervention. Understand why Bristol outperforms Leeds and replicate success. Datadriven decisions on resource allocation and investment priorities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">15% Admin Cost Reduction Per Bed</h3>
              <p className="text-sm text-muted-foreground mb-3">
                From £45/bed/month to £38/bed through automation. Eliminates need for 40% of seasonal temporary staff. Scales to 10,000+ beds without proportional staff increase. £500k-£2M annual savings depending on portfolio size.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-enterprise-features">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-tf-navy" />
              Enterprise Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Multi-Property Dashboard</h3>
                <p className="text-sm text-muted-foreground">Portfolio-wide visibility with drill-down to individual properties. Real-time occupancy, pipeline, and financial metrics across all cities.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Role-Based Access Control</h3>
                <p className="text-sm text-muted-foreground">Central ops see everything. Regional managers see their properties only. Property-level staff have restricted access. Investor read-only access for portfolio metrics.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">API Access & Integration</h3>
                <p className="text-sm text-muted-foreground">REST API for integration with property management systems, investor reporting platforms, and finance systems. Webhook support for real-time data sync.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Automated Investor Reporting</h3>
                <p className="text-sm text-muted-foreground">Monthly board packs generated automatically. Standardised templates with portfolio and property-level breakdowns. Export to Excel, PDF, or direct integration with investor portals.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">White-Label Options</h3>
                <p className="text-sm text-muted-foreground">Brand the tenant-facing experience with your REIT branding. Custom domain for tenant portal. Your logo on all student communications.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Dedicated Account Management</h3>
                <p className="text-sm text-muted-foreground">Named customer success manager for portfolio. Quarterly business reviews. Priority support with 2-hour SLA for enterprise clients.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-metrics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Success Metrics
            </CardTitle>
            <CardDescription>
              Results from PBSA REITs using TermFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">15%</div>
                <div className="text-sm text-muted-foreground mt-1">Admin cost reduction per bed</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">99%</div>
                <div className="text-sm text-muted-foreground mt-1">Portfolio occupancy</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">£42k</div>
                <div className="text-sm text-muted-foreground mt-1">Annual savings per property</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-cta">
          <CardHeader>
            <CardTitle>Enterprise Demo</CardTitle>
            <CardDescription>Talk to our REIT and institutional investor team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Schedule an enterprise demo to see portfolio-wide automation in action. We'll show you multi-property dashboards, investor reporting, and discuss integration with your existing systems.
            </p>
            <Button asChild size="lg" data-testid="button-cta-demo">
              <a href="/book-demo">Enterprise Demo - Talk to Our REIT Team</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
