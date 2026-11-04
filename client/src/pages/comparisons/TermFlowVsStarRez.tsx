import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Zap, Globe, Bot, Building2, PoundSterling, Clock, CheckCircle, XCircle, Users, Plug, ArrowRight, Settings } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function TermFlowVsStarRez() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Comparisons", url: "/comparisons" },
    { name: "TermFlow vs StarRez", url: "/comparisons/termflow-vs-starrez" }
  ];

  const featureComparison = [
    {
      category: "AI & Automation",
      features: [
        { name: "AI Enquiry Assistant", termflow: true, starrez: false, termflowNote: "Ava AI - 24/7 conversational", starrezNote: "Rule-based workflows" },
        { name: "Conversational AI", termflow: true, starrez: false, termflowNote: "Natural language on WhatsApp/Email", starrezNote: "Traditional form-based" },
        { name: "AI Contract Generation", termflow: true, starrez: false, termflowNote: "Auto-populate from conversation", starrezNote: "Template automation" },
        { name: "Intelligent Lead Scoring", termflow: true, starrez: false, termflowNote: "ML-based prioritisation", starrezNote: "Manual scoring rules" },
        { name: "24/7 Automated Responses", termflow: true, starrez: false, termflowNote: "Instant AI replies", starrezNote: "Scheduled automations" },
      ]
    },
    {
      category: "Geographic Focus & Compliance",
      features: [
        { name: "UK Market Focus", termflow: true, starrez: false, termflowNote: "Built for UK PBSA", starrezNote: "Global platform" },
        { name: "Right-to-Rent Verification", termflow: true, starrez: true, termflowNote: "Automated UK Home Office checks", starrezNote: "Manual compliance tracking" },
        { name: "UK Deposit Schemes", termflow: true, starrez: true, termflowNote: "TDS/DPS/MyDeposits API", starrezNote: "Manual registration" },
        { name: "GDPR Compliance", termflow: true, starrez: true, termflowNote: "UK/EU data residency", starrezNote: "Global data handling" },
        { name: "UK Academic Calendars", termflow: true, starrez: true, termflowNote: "Pre-configured UK terms", starrezNote: "Configurable globally" },
      ]
    },
    {
      category: "Integrations & Portals",
      features: [
        { name: "OTA/Portal Connections", termflow: true, starrez: true, termflowNote: "100+ UK-focused portals", starrezNote: "450+ global channels" },
        { name: "WhatsApp Business API", termflow: true, starrez: false, termflowNote: "Full conversational flow", starrezNote: "Not available" },
        { name: "UK Property Portals", termflow: true, starrez: true, termflowNote: "Rightmove, Zoopla, StuRents", starrezNote: "Via RMS integrations" },
        { name: "DocuSign/Signable", termflow: true, starrez: true, termflowNote: "Full e-signature flow", starrezNote: "Enterprise e-signature" },
        { name: "Payment Gateways", termflow: true, starrez: true, termflowNote: "Stripe, GoCardless", starrezNote: "Multiple processors" },
      ]
    },
    {
      category: "Implementation & Support",
      features: [
        { name: "Go-Live Timeline", termflow: true, starrez: true, termflowNote: "1-2 days", starrezNote: "3-6 months typical" },
        { name: "Setup Complexity", termflow: true, starrez: true, termflowNote: "Self-service possible", starrezNote: "Enterprise implementation" },
        { name: "Training Required", termflow: true, starrez: true, termflowNote: "2-hour onboarding", starrezNote: "Multi-week training" },
        { name: "UK Support Team", termflow: true, starrez: true, termflowNote: "UK-based team", starrezNote: "Global support centres" },
        { name: "Data Migration", termflow: true, starrez: true, termflowNote: "Included free", starrezNote: "Professional services" },
      ]
    },
    {
      category: "Contracts & Operations",
      features: [
        { name: "Digital Contracts", termflow: true, starrez: true, termflowNote: "AI-generated UK ASTs", starrezNote: "Template management" },
        { name: "Multi-tenant Contracts", termflow: true, starrez: true, termflowNote: "Joint/individual ASTs", starrezNote: "Complex contract types" },
        { name: "Maintenance Requests", termflow: true, starrez: true, termflowNote: "AI triage & routing", starrezNote: "Work order management" },
        { name: "Room Allocation", termflow: true, starrez: true, termflowNote: "AI-optimised matching", starrezNote: "Advanced allocation engine" },
        { name: "Reporting & Analytics", termflow: true, starrez: true, termflowNote: "Real-time dashboards", starrezNote: "Enterprise reporting" },
      ]
    },
  ];

  const useCases = [
    {
      title: "Choose TermFlow If...",
      icon: Zap,
      points: [
        "You're a UK PBSA operator wanting AI automation",
        "You need to go live quickly (1-2 days)",
        "You want transparent, predictable pricing",
        "You need WhatsApp/conversational AI for enquiries",
        "You have under 2,000 beds and want agility",
        "You prioritise UK compliance (RTR, TDS) automation",
      ],
      colour: "bg-tf-lime/10 border-tf-lime/20"
    },
    {
      title: "Choose StarRez If...",
      icon: Globe,
      points: [
        "You're a large global operator (5,000+ beds)",
        "You need multi-country, multi-currency support",
        "You have IT resources for complex implementation",
        "You require deep customisation and workflows",
        "You're already in the StarRez ecosystem",
        "You need 450+ OTA channel connections globally",
      ],
      colour: "bg-muted/50 border-muted"
    },
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="TermFlow vs StarRez: PBSA Software Comparison for UK Operators"
        description="Compare TermFlow vs StarRez for student housing management. UK-focused analysis of features, AI automation, pricing & integrations. Find the right PBSA platform for your portfolio."
        keywords="TermFlow vs StarRez, StarRez alternative, PBSA software UK, student housing software comparison, StarRez competitor"
        canonical="https://termflow.co.uk/comparisons/termflow-vs-starrez"
        ogUrl="https://termflow.co.uk/comparisons/termflow-vs-starrez"
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
            <Globe className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              TermFlow vs StarRez: PBSA Software Comparison for UK Operators
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl" data-testid="text-page-description">
            An unbiased comparison of TermFlow and StarRez for UK student accommodation operators. 
            Understand the key differences in AI automation, pricing, implementation, and which platform 
            best fits your portfolio size and operational needs.
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
                    <span><strong>Portals:</strong> 100+ UK-focused integrations</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-muted/50 rounded-lg border" data-testid="card-summary-starrez">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  StarRez
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Focus:</strong> Global enterprise platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>AI Assistant:</strong> Rule-based automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Pricing:</strong> Enterprise quotes only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Go-Live:</strong> 3-6 months typical</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Portals:</strong> 450+ global channels</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Bottom Line:</strong> StarRez is a comprehensive global platform suited for large multinational operators who need extensive customisation and have IT resources for complex implementation. 
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
              <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-differentiator-uk-global">
                <Globe className="h-8 w-8 text-tf-navy mx-auto mb-2" />
                <div className="text-xl font-bold text-tf-navy">UK vs Global</div>
                <div className="text-sm text-muted-foreground mt-1">
                  TermFlow built for UK compliance (RTR, TDS) vs StarRez global flexibility
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-differentiator-ai">
                <Bot className="h-8 w-8 text-tf-navy mx-auto mb-2" />
                <div className="text-xl font-bold text-tf-navy">Conversational AI</div>
                <div className="text-sm text-muted-foreground mt-1">
                  TermFlow Ava AI vs StarRez traditional rule-based workflows
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-differentiator-timeline">
                <Clock className="h-8 w-8 text-tf-navy mx-auto mb-2" />
                <div className="text-xl font-bold text-tf-navy">1-2 Days vs Months</div>
                <div className="text-sm text-muted-foreground mt-1">
                  TermFlow rapid go-live vs StarRez enterprise implementation
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
                      <th className="text-center p-3 w-1/3">StarRez</th>
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
                            {feature.starrez ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span className="text-xs text-muted-foreground">{feature.starrezNote}</span>
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
              <div className="p-6 bg-muted/50 rounded-lg border" data-testid="card-pricing-starrez">
                <h3 className="font-bold text-lg mb-4">StarRez Pricing</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Enterprise only:</strong> Contact sales for quote</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Implementation fees:</strong> Significant upfront cost</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Per-bed licensing:</strong> Typically £15-40/bed/year</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Add-on modules:</strong> Additional costs for features</span>
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
                StarRez's enterprise model often requires £50,000+ upfront implementation investment plus ongoing per-bed fees, making it better suited for large portfolios with dedicated IT budgets.
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
              <div className="p-4 rounded-lg border bg-muted/30" data-testid="card-implementation-starrez">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  StarRez Implementation
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Month 1-2:</strong> Discovery and scoping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Month 2-4:</strong> Configuration and customisation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Month 4-6:</strong> UAT, training, go-live</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Training:</strong> Multi-week programme</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>IT requirement:</strong> Dedicated project resources</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Implementation Reality</p>
              <p className="text-sm text-muted-foreground">
                StarRez implementations typically require dedicated IT project management, extensive UAT cycles, and significant internal resource allocation. 
                TermFlow is designed for operators who want to be live within days, not months, with minimal disruption to existing operations.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-ota-comparison">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plug className="h-5 w-5 text-tf-navy" />
              OTA & Portal Integrations
            </CardTitle>
            <CardDescription>
              Comparing distribution channel connectivity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg border border-tf-lime/30 bg-tf-lime/5" data-testid="card-ota-termflow">
                <h4 className="font-semibold mb-3">TermFlow: 100+ UK Portals</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Rightmove</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Zoopla</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>StuRents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Accommodation for Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>UniHomes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Student.com</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  UK-focused portals with deep integration for British student lettings cycle
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30" data-testid="card-ota-starrez">
                <h4 className="font-semibold mb-3">StarRez: 450+ Global Channels</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Booking.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Expedia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Airbnb</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>HousingAnywhere</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Student.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>+ 440 more</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Global reach via RMS partnership - ideal for international operators
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>UK Focus vs Global Reach:</strong> StarRez's 450+ channels are excellent for operators with global portfolios or those seeking maximum OTA distribution. 
                TermFlow's 100+ UK-focused integrations are specifically optimised for the British student lettings market, with deeper integration with UK-specific portals like StuRents, Accommodation for Students, and property portals.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-use-cases">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-tf-navy" />
              Which Platform is Right for You?
            </CardTitle>
            <CardDescription>
              Use case recommendations based on your operation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <div key={index} className={`p-6 rounded-lg border ${useCase.colour}`} data-testid={index === 0 ? "card-choose-termflow" : "card-choose-starrez"}>
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
              <ArrowRight className="h-5 w-5 text-tf-navy" />
              Switching from StarRez to TermFlow?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you're a UK operator finding StarRez overly complex for your needs, TermFlow offers a streamlined migration path:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center" data-testid="card-migration-step-1">
                  <div className="text-2xl font-bold text-tf-navy">1</div>
                  <div className="font-medium mt-2">Data Export</div>
                  <div className="text-sm text-muted-foreground mt-1">We handle CSV/API data migration</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center" data-testid="card-migration-step-2">
                  <div className="text-2xl font-bold text-tf-navy">2</div>
                  <div className="font-medium mt-2">Parallel Run</div>
                  <div className="text-sm text-muted-foreground mt-1">Run both systems during transition</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center" data-testid="card-migration-step-3">
                  <div className="text-2xl font-bold text-tf-navy">3</div>
                  <div className="font-medium mt-2">Full Cutover</div>
                  <div className="text-sm text-muted-foreground mt-1">Typically within 2 weeks</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="section-cta">
          <CardHeader>
            <CardTitle>Ready to Compare for Your Portfolio?</CardTitle>
            <CardDescription>Get a personalised assessment for your UK PBSA operation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Book a 15-minute call with our team to discuss your specific requirements, current pain points, and see how TermFlow compares to StarRez for your portfolio size and operational needs.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/book-demo" data-testid="link-cta-demo">
                <Button size="lg" data-testid="button-cta-demo">Book a Demo</Button>
              </a>
              <a href="/roi-calculator" data-testid="link-cta-calculator">
                <Button size="lg" variant="outline" data-testid="button-cta-calculator">Calculate Your ROI</Button>
              </a>
              <a href="/pricing" data-testid="link-cta-pricing">
                <Button size="lg" variant="outline" data-testid="button-cta-pricing">View Pricing</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
