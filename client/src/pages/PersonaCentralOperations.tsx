import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock, TrendingUp, CheckCircle, AlertTriangle, Target, BarChart3, FileText, Settings, Eye } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { SiteSearch } from "@/components/SiteSearch";

export default function PersonaCentralOperations() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Buyer Personas", url: "#" },
    { name: "Central Operations", url: "/personas/central-operations" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="For Central Operations Teams | TermFlow"
        description="Discover how TermFlow helps central operations teams achieve portfolio-wide standardisation, real-time visibility, and data-driven decisions across multiple PBSA properties."
        keywords="central operations, portfolio management, PBSA operations, multi-property management, standardisation, operational efficiency"
        canonical="https://termflow.co.uk/personas/central-operations"
        ogUrl="https://termflow.co.uk/personas/central-operations"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <TermFlowWordmark />
            <SiteSearch />
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">
              Home
            </a>
            <Button asChild size="sm" variant="outline" data-testid="button-book-demo">
              <a href="/book-demo">Book Demo</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <LastUpdated date="January 20, 2025" className="mb-8" />

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              For Central Operations Teams
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            You oversee 5-15 properties across multiple cities. Each site manager runs things differently. You need portfolio-wide visibility, standardised processes, and data to drive strategic decisions.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
          </div>
        </div>

        {/* A Day in the Life */}
        <Card className="mb-8" data-testid="card-day-in-life">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-tf-navy" />
              A Day in Your Life
            </CardTitle>
            <CardDescription>
              Managing operations across a 1,500-bed portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">7:30 AM</span> - Portfolio Check
                </h3>
                <p className="text-sm text-muted-foreground">
                  Open 8 different spreadsheets to compile occupancy numbers. Manchester reports 94%, but you don't know how many are in the pipeline. Need to chase site managers for updates.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">9:00 AM</span> - Fire Drill in Leeds
                </h3>
                <p className="text-sm text-muted-foreground">
                  Leeds site manager reports contract signing bottleneck. They're using a different process than everyone else. No idea why. This shouldn't be happening.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">11:00 AM</span> - Board Meeting Prep
                </h3>
                <p className="text-sm text-muted-foreground">
                  CEO wants portfolio-wide metrics: conversion rates, average time-to-sign, revenue forecast. Manually aggregating data from 10 different sources. This takes all morning.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">2:00 PM</span> - Process Inconsistency
                </h3>
                <p className="text-sm text-muted-foreground">
                  Discover Bristol is using a completely different contract template. Edinburgh's viewing process is totally different from London's. How did we get here?
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">4:00 PM</span> - Reactive Problem Solving
                </h3>
                <p className="text-sm text-muted-foreground">
                  Newcastle site manager flags compliance issue. Right-to-Rent documents missing for 8 students. How many other properties have this problem? No way to know without checking each one manually.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">6:00 PM</span> - Still Working
                </h3>
                <p className="text-sm text-muted-foreground">
                  Trying to implement a new process across all sites. Wrote a detailed SOP. But know from experience half the sites won't follow it. Need a better way to enforce standards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pain Points */}
        <Card className="mb-8" data-testid="card-pain-points">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Your Strategic Challenges
            </CardTitle>
            <CardDescription>
              What's preventing portfolio-wide excellence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Multi-Property Coordination Chaos</h3>
                <p className="text-sm text-muted-foreground">
                  Each property is a silo. Different systems, different processes, different data formats. You spend 15 hours per week just trying to understand what's happening across the portfolio. This is a common challenge for{" "}
                  <Link href="/sectors/pbsa-reits" className="text-primary hover:underline" data-testid="link-pbsa-reits">
                    PBSA REITs managing large portfolios
                  </Link>
                  .
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Inconsistent Processes</h3>
                <p className="text-sm text-muted-foreground">
                  You create SOPs, but site managers interpret them differently. Some properties excel, others struggle. No way to enforce consistency or identify best practices to roll out.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Reporting Overhead</h3>
                <p className="text-sm text-muted-foreground">
                  Board wants KPIs every month. Manually aggregating data from spreadsheets, emails, and different CRMs. Takes 2-3 days. By the time you finish, data is already outdated.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">No Real-Time Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Can't see portfolio occupancy in real time. Don't know which properties are underperforming until month-end. Reactive management instead of proactive intervention.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Resource Allocation Guesswork</h3>
                <p className="text-sm text-muted-foreground">
                  Which properties need more staff during clearing? Which are converting leads well? Which need training? Making decisions based on gut feel, not data.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Compliance Risk Exposure</h3>
                <p className="text-sm text-muted-foreground">
                  One property misses Right-to-Rent checks. Another has expired deposit protections. You only find out when audited. No centralised compliance dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals & Objectives */}
        <Card className="mb-8" data-testid="card-goals">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-tf-navy" />
              Your Strategic Objectives
            </CardTitle>
            <CardDescription>
              What success looks like for your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                  <Settings className="h-6 w-6 text-tf-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Standardisation Across Portfolio</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Every property follows the same processes: lead capture, viewing workflow, contract generation, deposit protection. No more rogue implementations. Our{" "}
                    <Link href="/playbooks/tenant-onboarding-automation" className="text-primary hover:underline" data-testid="link-tenant-onboarding-automation-playbook">
                      standardized tenant onboarding playbook
                    </Link>
                    {" "}ensures consistency across all properties.
                  </p>
                  <Badge variant="secondary">Target: 100% process compliance</Badge>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                  <Eye className="h-6 w-6 text-tf-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Real-Time Portfolio Visibility</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    One dashboard showing occupancy, pipeline, conversion rates, and revenue across all properties in real time. No more spreadsheet wrangling.
                  </p>
                  <Badge variant="secondary">Target: Live portfolio dashboard</Badge>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                  <BarChart3 className="h-6 w-6 text-tf-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Data-Driven Decisions</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Identify underperforming properties in real time. Allocate resources based on data, not gut feel. Replicate best practices from high performers.
                  </p>
                  <Badge variant="secondary">Target: Weekly performance reviews</Badge>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                  <TrendingUp className="h-6 w-6 text-tf-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Portfolio-Wide Efficiency Gains</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Reduce operational overhead by 30% through automation and standardisation. Reinvest savings into growth and tenant experience improvements. Browse our{" "}
                    <Link href="/automation-ideas" className="text-primary hover:underline" data-testid="link-automation-ideas">
                      automation ideas library
                    </Link>
                    {" "}for specific workflow optimizations.
                  </p>
                  <Badge variant="secondary">Target: 30% cost reduction</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How TermFlow Helps */}
        <Card className="mb-8" data-testid="card-how-termflow-helps">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              How TermFlow Transforms Operations
            </CardTitle>
            <CardDescription>
              Built for multi-property portfolio management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-tf-navy" />
                  Centralised Process Control
                </h3>
                <p className="text-sm text-muted-foreground">
                  Define processes once, deploy across all properties. Site managers can't deviate because the workflow is enforced by the system. Learn more about{" "}
                  <Link href="/why-termflow" className="text-primary hover:underline" data-testid="link-why-termflow">
                    why TermFlow's centralized approach
                  </Link>
                  {" "}works for multi-property operators.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Standardised AI responses across all properties</li>
                  <li>• Unified contract templates (with property-specific variables)</li>
                  <li>• Consistent viewing workflows everywhere</li>
                  <li>• Central template library for WhatsApp/email</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-tf-navy" />
                  Portfolio Command Dashboard
                </h3>
                <p className="text-sm text-muted-foreground">
                  See real-time occupancy, pipeline, conversion rates, and revenue across all properties in one view. Drill down into any property or metric.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Live occupancy by property and room type</li>
                  <li>• Portfolio-wide conversion funnel</li>
                  <li>• Revenue forecasting with confidence intervals</li>
                  <li>• Comparative performance rankings</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-tf-navy" />
                  Performance Analytics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Identify underperformers instantly. See which properties have the best conversion rates, fastest response times, highest occupancy.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Property-by-property benchmarking</li>
                  <li>• Lead source ROI analysis</li>
                  <li>• Response time SLA tracking</li>
                  <li>• Automated weekly performance reports</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-tf-navy" />
                  Centralised Compliance
                </h3>
                <p className="text-sm text-muted-foreground">
                  Portfolio-wide compliance dashboard. See every overdue Right-to-Rent check, expiring deposit protection, unsigned contract across all properties.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Live compliance status by property</li>
                  <li>• Auto-escalation for overdue items</li>
                  <li>• Audit trail for all compliance activities</li>
                  <li>• One-click export for regulatory reporting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio-Wide Efficiency */}
        <Card className="mb-8 border-2 border-tf-navy" data-testid="card-efficiency">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tf-navy" />
              Portfolio-Wide Efficiency Gains
            </CardTitle>
            <CardDescription>
              Real numbers from operations teams managing 1,000+ beds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-tf-navy mb-2">30%</div>
                <div className="text-sm text-muted-foreground">Operational overhead reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tf-navy mb-2">15 hours</div>
                <div className="text-sm text-muted-foreground">Per week saved on reporting</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tf-navy mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Process standardisation across portfolio</div>
              </div>
            </div>

            <div className="bg-tf-navy/5 p-6 rounded-md border border-tf-navy/20">
              <h4 className="font-semibold mb-4">Annual Portfolio-Wide Value (1,500 beds):</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time saved on data aggregation (15h/week × 52 weeks × £35/hour)</span>
                  <span className="font-semibold">£27,300</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Site manager time savings across 10 properties (10h/week each × 52 × £25/hour)</span>
                  <span className="font-semibold">£130,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Additional revenue from 2% portfolio occupancy improvement (30 beds × £500/month × 10 months)</span>
                  <span className="font-semibold">£150,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avoided compliance penalties</span>
                  <span className="font-semibold">£5,000</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span>Total Annual Value</span>
                  <span className="text-tf-navy">£312,300</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TermFlow Annual Cost (Enterprise plan)</span>
                  <span className="font-semibold">-£12,000</span>
                </div>
                <div className="border-t border-tf-navy pt-2 flex justify-between font-bold text-lg">
                  <span>Net Annual Benefit</span>
                  <span className="text-tf-navy">£300,300</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-tf-navy to-tf-navy-700 rounded-lg p-8 md:p-12 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            See TermFlow's Portfolio Management Features
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Book a demo tailored to central operations teams. We'll show you the portfolio dashboard, performance analytics, and standardisation features. Explore{" "}
            <Link href="/sectors/pbsa-reits" className="text-white underline hover:text-white/80" data-testid="link-pbsa-reits-use">
              how PBSA REITs use TermFlow
            </Link>
            {" "}for portfolio-wide control.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" data-testid="button-cta-demo">
              <a href="/book-demo">Book Your Free Demo</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20" data-testid="button-cta-calculator">
              <a href="/roi-calculator">Calculate Portfolio ROI</a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
