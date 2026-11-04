import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Zap, Globe, Bot, Building2, PoundSterling, Clock, CheckCircle, XCircle, Users, Plug, ArrowRight, Settings, TrendingUp, Shield } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function TermFlowVsYardi() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Comparisons", url: "/comparisons" },
    { name: "TermFlow vs Yardi", url: "/comparisons/termflow-vs-yardi" }
  ];

  const featureComparison = [
    {
      category: "AI & Automation",
      features: [
        { name: "AI Enquiry Assistant", termflow: true, yardi: false, termflowNote: "Ava AI - 24/7 conversational", yardiNote: "Rule-based automation only" },
        { name: "Conversational AI", termflow: true, yardi: false, termflowNote: "Natural language on WhatsApp/Email", yardiNote: "Traditional portal forms" },
        { name: "AI Contract Generation", termflow: true, yardi: false, termflowNote: "Auto-populate from conversation", yardiNote: "Template-based generation" },
        { name: "Intelligent Lead Scoring", termflow: true, yardi: false, termflowNote: "ML-based prioritisation", yardiNote: "Manual lead management" },
        { name: "24/7 Automated Responses", termflow: true, yardi: false, termflowNote: "Instant AI replies", yardiNote: "Business hours workflows" },
      ]
    },
    {
      category: "Geographic Focus & Compliance",
      features: [
        { name: "UK Market Focus", termflow: true, yardi: false, termflowNote: "Built specifically for UK PBSA", yardiNote: "Global platform adapted for UK" },
        { name: "Right-to-Rent Verification", termflow: true, yardi: true, termflowNote: "Automated UK Home Office checks", yardiNote: "Manual compliance tracking" },
        { name: "UK Deposit Schemes", termflow: true, yardi: true, termflowNote: "TDS/DPS/MyDeposits API", yardiNote: "Manual registration process" },
        { name: "GDPR Compliance", termflow: true, yardi: true, termflowNote: "UK/EU data residency", yardiNote: "Global data centres" },
        { name: "UK Academic Calendars", termflow: true, yardi: true, termflowNote: "Pre-configured UK terms", yardiNote: "Requires custom configuration" },
      ]
    },
    {
      category: "Target Market & Scalability",
      features: [
        { name: "Small Operators (Under 200 beds)", termflow: true, yardi: false, termflowNote: "Core focus, from £99/month", yardiNote: "Not cost-effective" },
        { name: "Mid-Size (200-1000 beds)", termflow: true, yardi: true, termflowNote: "Scalable pricing", yardiNote: "Enterprise tier required" },
        { name: "Large REITs (1000+ beds)", termflow: true, yardi: true, termflowNote: "Enterprise options", yardiNote: "Primary target market" },
        { name: "Investor Portal/Reporting", termflow: false, yardi: true, termflowNote: "Basic reporting", yardiNote: "Comprehensive REIT tools" },
        { name: "Multi-Asset Class", termflow: false, yardi: true, termflowNote: "PBSA-focused only", yardiNote: "Full property portfolio" },
      ]
    },
    {
      category: "Integrations & Channels",
      features: [
        { name: "WhatsApp Business API", termflow: true, yardi: false, termflowNote: "Full conversational flow", yardiNote: "Not available" },
        { name: "UK Property Portals", termflow: true, yardi: true, termflowNote: "StuRents, Rightmove, Zoopla", yardiNote: "Via third-party connectors" },
        { name: "DocuSign/Signable", termflow: true, yardi: true, termflowNote: "Full e-signature flow", yardiNote: "Enterprise e-signature" },
        { name: "Payment Gateways", termflow: true, yardi: true, termflowNote: "Stripe, GoCardless", yardiNote: "Multiple processors" },
        { name: "Accounting Integration", termflow: true, yardi: true, termflowNote: "Xero, QuickBooks", yardiNote: "Built-in Yardi accounting" },
      ]
    },
    {
      category: "Implementation & Support",
      features: [
        { name: "Go-Live Timeline", termflow: true, yardi: true, termflowNote: "1-2 days", yardiNote: "6-12 months typical" },
        { name: "Setup Complexity", termflow: true, yardi: true, termflowNote: "Self-service possible", yardiNote: "Enterprise implementation team" },
        { name: "Training Required", termflow: true, yardi: true, termflowNote: "2-hour onboarding", yardiNote: "Multi-week training programme" },
        { name: "UK Support Team", termflow: true, yardi: true, termflowNote: "UK-based team", yardiNote: "UK office available" },
        { name: "Data Migration", termflow: true, yardi: true, termflowNote: "Included free", yardiNote: "Professional services fee" },
      ]
    },
  ];

  const useCases = [
    {
      title: "Choose TermFlow If...",
      icon: Zap,
      points: [
        "You're a UK PBSA operator wanting AI automation",
        "You need to go live quickly (1-2 days, not months)",
        "You want transparent, predictable pricing from £99/month",
        "You need WhatsApp/conversational AI for student enquiries",
        "You have under 1,000 beds and want agility",
        "You prioritise UK compliance (RTR, TDS) automation",
      ],
      colour: "bg-tf-lime/10 border-tf-lime/20"
    },
    {
      title: "Choose Yardi If...",
      icon: Building2,
      points: [
        "You're a large REIT with 1,000+ beds across multiple asset classes",
        "You need comprehensive investor portals and financial reporting",
        "You have IT resources for 6-12 month enterprise implementation",
        "You require deep accounting and ERP integration",
        "You're already in the Yardi ecosystem",
        "You need multi-country, multi-currency support",
      ],
      colour: "bg-muted/50 border-muted"
    },
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="TermFlow vs Yardi: Student Accommodation Software for UK PBSA"
        description="TermFlow vs Yardi UK comparison for PBSA operators. Compare AI automation, pricing, implementation time & features. See which student housing platform delivers better ROI."
        keywords="TermFlow vs Yardi, Yardi alternative UK, PBSA software comparison, Yardi student housing alternative, student accommodation software"
        canonical="https://termflow.co.uk/comparisons/termflow-vs-yardi"
        ogUrl="https://termflow.co.uk/comparisons/termflow-vs-yardi"
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
            <a href="/book-demo" data-testid="link-header-book-demo">
              <Button size="sm" variant="default" data-testid="button-header-book-demo">Book Demo</Button>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <LastUpdated date="December 8, 2025" className="mb-8" />

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              TermFlow vs Yardi: Student Accommodation Software for UK PBSA
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl" data-testid="text-page-description">
            An honest comparison of TermFlow and Yardi for UK student accommodation operators. 
            Understand the key differences in AI automation, pricing, implementation timelines, 
            and which platform best fits your portfolio size and operational requirements.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: December 2025</Badge>
            <Badge variant="secondary" data-testid="badge-category">Competitor Comparison</Badge>
            <Badge variant="secondary" data-testid="badge-pbsa">PBSA Software UK</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-executive-summary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-tf-navy" />
              Executive Summary
            </CardTitle>
            <CardDescription>
              Key differences at a glance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="p-6 bg-tf-lime/10 rounded-lg border border-tf-lime/20" data-testid="card-summary-termflow">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Bot className="h-5 w-5 text-tf-navy" />
                  TermFlow
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Focus:</strong> UK PBSA with AI-first automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>AI Assistant:</strong> Ava conversational AI 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Pricing:</strong> From £99/month, transparent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Go-Live:</strong> 1-2 days implementation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Best For:</strong> Operators wanting AI automation fast</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-muted/50 rounded-lg border" data-testid="card-summary-yardi">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  Yardi
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Focus:</strong> Enterprise REITs, multi-asset class</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>AI Assistant:</strong> Traditional automation only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Pricing:</strong> Enterprise quotes, significant investment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Go-Live:</strong> 6-12 months typical</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Best For:</strong> Large REITs needing investor portals</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Bottom Line:</strong> Yardi is a comprehensive enterprise platform suited for large REITs with 1,000+ beds who need investor reporting, 
              multi-asset class management, and have the budget and IT resources for 6-12 month implementations. 
              TermFlow is purpose-built for UK PBSA operators who want AI-powered automation, rapid deployment, and transparent pricing without enterprise complexity.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-key-differentiators">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-tf-navy" />
              Key Differentiators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-differentiator-sizes">
                <Users className="h-8 w-8 text-tf-navy mx-auto mb-2" />
                <div className="text-xl font-bold text-tf-navy">All Sizes vs REITs</div>
                <div className="text-sm text-muted-foreground mt-1">
                  TermFlow from £99/month for any size vs Yardi enterprise-only focus
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-differentiator-ai">
                <Bot className="h-8 w-8 text-tf-navy mx-auto mb-2" />
                <div className="text-xl font-bold text-tf-navy">Conversational AI</div>
                <div className="text-sm text-muted-foreground mt-1">
                  TermFlow Ava AI vs Yardi traditional rule-based workflows
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-differentiator-timeline">
                <Clock className="h-8 w-8 text-tf-navy mx-auto mb-2" />
                <div className="text-xl font-bold text-tf-navy">Days vs Months</div>
                <div className="text-sm text-muted-foreground mt-1">
                  TermFlow 1-2 day go-live vs Yardi 6-12 month implementation
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <section data-testid="section-feature-comparison">
        {featureComparison.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="mb-6" data-testid={`card-comparison-${categoryIndex}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.category}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid={`table-comparison-${categoryIndex}`}>
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-3 w-1/3">Feature</th>
                      <th className="text-center p-3 w-1/3 bg-tf-lime/10">TermFlow</th>
                      <th className="text-center p-3 w-1/3">Yardi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.features.map((feature, featureIndex) => (
                      <tr key={featureIndex} className="border-b last:border-0">
                        <td className="p-3 font-medium">{feature.name}</td>
                        <td className="p-3 text-center bg-tf-lime/5">
                          <div className="flex flex-col items-center gap-1">
                            {feature.termflow ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span className="text-xs text-muted-foreground">{feature.termflowNote}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            {feature.yardi ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span className="text-xs text-muted-foreground">{feature.yardiNote}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
        </section>

        <Card className="mb-8" data-testid="card-pricing-comparison">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PoundSterling className="h-5 w-5 text-tf-navy" />
              Pricing Comparison
            </CardTitle>
            <CardDescription>
              Understanding the cost structures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-tf-lime/10 rounded-lg border border-tf-lime/20" data-testid="card-pricing-termflow">
                <h3 className="font-bold text-lg mb-4">TermFlow Pricing</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Starter:</strong> £99/month - Up to 50 beds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Professional:</strong> £249/month - Up to 200 beds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Enterprise:</strong> Custom pricing - 200+ beds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>No setup fees</strong> - Start immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Free trial</strong> - Test before committing</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-muted/50 rounded-lg border" data-testid="card-pricing-yardi">
                <h3 className="font-bold text-lg mb-4">Yardi Pricing</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Enterprise only:</strong> Contact sales for quote</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Implementation fees:</strong> £50,000-£250,000+ typical</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Per-user licensing:</strong> Significant ongoing cost</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Module add-ons:</strong> Additional costs for features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Multi-year contracts:</strong> Typically 3-5 years</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Pricing Advantage:</strong> TermFlow's transparent pricing means UK operators can start from £99/month with no setup fees or long-term contracts. 
                Yardi's enterprise model typically requires £50,000-£250,000+ upfront implementation investment plus significant ongoing licensing, 
                making it better suited for large REITs with dedicated IT budgets and multi-year procurement cycles.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-implementation-comparison">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-tf-navy" />
              Implementation & Go-Live Comparison
            </CardTitle>
            <CardDescription>
              Understanding the deployment differences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg border border-tf-lime/30 bg-tf-lime/5" data-testid="card-implementation-termflow">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  TermFlow Implementation
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Day 1:</strong> Account setup, property import</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Day 2:</strong> AI training, go-live</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Training:</strong> 2-hour onboarding session</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Data migration:</strong> Included at no cost</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>IT requirement:</strong> None - cloud-native</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30" data-testid="card-implementation-yardi">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Yardi Implementation
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Month 1-3:</strong> Discovery, scoping, planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Month 4-8:</strong> Configuration and customisation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Month 9-12:</strong> Testing, training, go-live</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Training:</strong> Multi-week training programme</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>IT requirement:</strong> Dedicated project team</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>Implementation Reality:</strong> For a typical UK PBSA operator with 200-500 beds, TermFlow can be fully operational within 2 days. 
                The same Yardi implementation would typically take 6-12 months, require dedicated IT resources, and involve significant change management. 
                This difference is crucial for operators who need to modernise quickly ahead of peak letting season.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-uk-compliance">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-tf-navy" />
              UK Compliance & Market Focus
            </CardTitle>
            <CardDescription>
              Understanding UK-specific requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg border border-tf-lime/30 bg-tf-lime/5" data-testid="card-compliance-termflow">
                <h4 className="font-semibold mb-3">TermFlow UK Focus</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Right-to-Rent:</strong> Automated Home Office share code verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Deposit Schemes:</strong> API integration with TDS, DPS, MyDeposits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>UK AST Contracts:</strong> Pre-configured Assured Shorthold Tenancy templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Academic Calendars:</strong> UK university terms pre-configured</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Data Residency:</strong> UK/EU data centres, GDPR-compliant</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30" data-testid="card-compliance-yardi">
                <h4 className="font-semibold mb-3">Yardi Global Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Right-to-Rent:</strong> Manual compliance tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Deposit Schemes:</strong> Manual registration process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>UK Contracts:</strong> Requires custom configuration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Academic Calendars:</strong> Needs manual setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Data Residency:</strong> UK office, global data centres</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-use-cases">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tf-navy" />
              Which Platform Is Right For You?
            </CardTitle>
            <CardDescription>
              Honest recommendations based on your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <div key={index} className={`p-6 rounded-lg border ${useCase.colour}`} data-testid={index === 0 ? "card-choose-termflow" : "card-choose-yardi"}>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <useCase.icon className="h-5 w-5" />
                    {useCase.title}
                  </h3>
                  <ul className="space-y-2">
                    {useCase.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-migration">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plug className="h-5 w-5 text-tf-navy" />
              Switching from Yardi to TermFlow
            </CardTitle>
            <CardDescription>
              What to expect if you're considering a change
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Many UK PBSA operators have moved from Yardi to TermFlow seeking AI automation and faster time-to-value. 
                Here's what the migration process typically looks like:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center" data-testid="card-migration-step-1">
                  <div className="text-2xl font-bold text-tf-navy">Week 1</div>
                  <div className="text-sm text-muted-foreground mt-1">Data export from Yardi, property and tenant import to TermFlow</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center" data-testid="card-migration-step-2">
                  <div className="text-2xl font-bold text-tf-navy">Week 2</div>
                  <div className="text-sm text-muted-foreground mt-1">AI training on your portfolio, team onboarding</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center" data-testid="card-migration-step-3">
                  <div className="text-2xl font-bold text-tf-navy">Week 3+</div>
                  <div className="text-sm text-muted-foreground mt-1">Parallel running, full go-live when ready</div>
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900 mt-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Migration Support:</strong> TermFlow provides dedicated migration support at no additional cost. 
                  Our team handles the data export, import, and validation to ensure a smooth transition with zero data loss.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="section-cta">
          <CardHeader>
            <CardTitle>Ready to See TermFlow in Action?</CardTitle>
            <CardDescription>Experience the difference AI automation makes for UK PBSA operators</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Book a personalised demo to see how TermFlow can automate your student lettings process. 
              We'll show you the AI assistant, UK compliance features, and calculate your specific ROI based on your portfolio size.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/book-demo" data-testid="link-cta-demo">
                <Button size="lg" data-testid="button-cta-demo">Book Your Demo</Button>
              </a>
              <a href="/roi-calculator" data-testid="link-cta-calculator">
                <Button size="lg" variant="outline" data-testid="button-cta-calculator">Calculate Your Savings</Button>
              </a>
              <a href="/pricing" data-testid="link-cta-pricing">
                <Button size="lg" variant="outline" data-testid="button-cta-pricing">View Pricing</Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-related-comparisons">
          <CardHeader>
            <CardTitle>Related Comparisons</CardTitle>
            <CardDescription>Explore other PBSA software comparisons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/comparisons/termflow-vs-starrez" className="block p-4 bg-muted/50 rounded-lg hover-elevate transition-colors" data-testid="link-vs-starrez">
                <h4 className="font-semibold mb-1">TermFlow vs StarRez</h4>
                <p className="text-sm text-muted-foreground">Global enterprise platform comparison</p>
              </a>
              <a href="/comparisons/termflow-vs-kinetic" className="block p-4 bg-muted/50 rounded-lg hover-elevate transition-colors" data-testid="link-vs-kinetic">
                <h4 className="font-semibold mb-1">TermFlow vs Kinetic</h4>
                <p className="text-sm text-muted-foreground">UK property management comparison</p>
              </a>
              <a href="/comparisons/ai-vs-manual-workflows" className="block p-4 bg-muted/50 rounded-lg hover-elevate transition-colors" data-testid="link-ai-vs-manual">
                <h4 className="font-semibold mb-1">AI vs Manual Workflows</h4>
                <p className="text-sm text-muted-foreground">See the automation ROI difference</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
