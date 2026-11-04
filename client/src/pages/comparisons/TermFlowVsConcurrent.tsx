import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Zap, Building2, Bot, FileText, Shield, Phone, CheckCircle, XCircle, Users, PoundSterling, Clock, ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function TermFlowVsConcurrent() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Comparisons", url: "/comparisons" },
    { name: "TermFlow vs Concurrent", url: "/comparisons/termflow-vs-concurrent" }
  ];

  const featureComparison = [
    {
      category: "AI & Automation",
      features: [
        { name: "AI Enquiry Assistant", termflow: true, concurrent: false, termflowNote: "Ava AI - 24/7 response", concurrentNote: "Form-based only" },
        { name: "24/7 Automated Responses", termflow: true, concurrent: false, termflowNote: "WhatsApp, Email, Web", concurrentNote: "Business hours only" },
        { name: "AI Contract Generation", termflow: true, concurrent: false, termflowNote: "Auto-populate from data", concurrentNote: "Manual templates" },
        { name: "Intelligent Lead Scoring", termflow: true, concurrent: false, termflowNote: "ML-based prioritisation", concurrentNote: "Manual assessment" },
      ]
    },
    {
      category: "Compliance & Verification",
      features: [
        { name: "Right-to-Rent Verification", termflow: true, concurrent: true, termflowNote: "Automated API checks", concurrentNote: "Manual verification" },
        { name: "Guarantor Management", termflow: true, concurrent: true, termflowNote: "Automated workflows", concurrentNote: "Basic tracking" },
        { name: "Deposit Protection", termflow: true, concurrent: true, termflowNote: "Auto DPS/TDS integration", concurrentNote: "Manual registration" },
        { name: "GDPR Compliance Tools", termflow: true, concurrent: true, termflowNote: "Built-in automation", concurrentNote: "Standard compliance" },
      ]
    },
    {
      category: "Integrations",
      features: [
        { name: "Property Portal Listings", termflow: true, concurrent: true, termflowNote: "Rightmove, Zoopla, etc.", concurrentNote: "StuRents marketplace" },
        { name: "WhatsApp Business API", termflow: true, concurrent: false, termflowNote: "Full conversation flow", concurrentNote: "Not available" },
        { name: "Twilio/SMS Integration", termflow: true, concurrent: false, termflowNote: "Automated reminders", concurrentNote: "Not available" },
        { name: "DocuSign/Signable", termflow: true, concurrent: true, termflowNote: "Full e-signature flow", concurrentNote: "Basic e-signature" },
        { name: "Calendar Sync", termflow: true, concurrent: true, termflowNote: "Google Calendar API", concurrentNote: "Basic calendar" },
      ]
    },
    {
      category: "Contracts & Lettings",
      features: [
        { name: "Digital Contracts", termflow: true, concurrent: true, termflowNote: "AI-generated + custom", concurrentNote: "Template-based" },
        { name: "Multi-tenant Contracts", termflow: true, concurrent: true, termflowNote: "Joint/individual ASTs", concurrentNote: "Standard contracts" },
        { name: "Dual Occupancy Pricing", termflow: true, concurrent: false, termflowNote: "Single/shared rates", concurrentNote: "Manual pricing" },
        { name: "Academic Cycle Templates", termflow: true, concurrent: true, termflowNote: "48-52 week options", concurrentNote: "Fixed templates" },
      ]
    },
    {
      category: "Communication",
      features: [
        { name: "Multi-channel Inbox", termflow: true, concurrent: false, termflowNote: "WhatsApp, Email, Web unified", concurrentNote: "Email-focused" },
        { name: "Automated Follow-ups", termflow: true, concurrent: false, termflowNote: "AI-timed sequences", concurrentNote: "Manual reminders" },
        { name: "Viewing Reminders", termflow: true, concurrent: true, termflowNote: "24h + 2h auto-send", concurrentNote: "Basic reminders" },
        { name: "International Language Support", termflow: true, concurrent: false, termflowNote: "Multi-language AI", concurrentNote: "English only" },
      ]
    },
  ];

  const useCases = [
    {
      title: "Choose TermFlow If...",
      icon: Zap,
      points: [
        "You want AI-powered 24/7 enquiry handling",
        "You need WhatsApp/SMS communication automation",
        "You prioritise transparent, predictable pricing",
        "You want automated Right-to-Rent verification",
        "You need multi-language support for international students",
        "You want to reduce admin time by 50%+",
      ],
      colour: "bg-tf-lime/10 border-tf-lime/20"
    },
    {
      title: "Choose Concurrent If...",
      icon: Building2,
      points: [
        "You're already using StuRents marketplace extensively",
        "You prefer a marketplace-first approach",
        "You have a dedicated admin team for manual processes",
        "You need deep StuRents integration specifically",
        "You're comfortable with custom quote pricing",
        "You prioritise portal listings over automation",
      ],
      colour: "bg-muted/50 border-muted"
    },
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="TermFlow vs Concurrent: 2025 PBSA Software Comparison | Which is Best?"
        description="Detailed 2025 comparison of TermFlow vs Concurrent for student accommodation. Compare features, pricing, AI automation, integrations & ROI. Unbiased side-by-side analysis."
        keywords="TermFlow vs Concurrent, Concurrent alternative, PBSA software comparison, student accommodation software comparison, StuRents alternative"
        canonical="https://termflow.co.uk/comparisons/termflow-vs-concurrent"
        ogUrl="https://termflow.co.uk/comparisons/termflow-vs-concurrent"
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
        <LastUpdated date="December 8, 2025" className="mb-8" />

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              TermFlow vs Concurrent: 2025 PBSA Software Comparison
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl" data-testid="text-page-description">
            An unbiased, side-by-side comparison of TermFlow and Concurrent for student accommodation management. 
            Discover which platform best fits your PBSA operation's needs, budget, and automation goals.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: December 2025</Badge>
            <Badge variant="secondary" data-testid="badge-category">Competitor Comparison</Badge>
            <Badge variant="secondary" data-testid="badge-pbsa">PBSA Software</Badge>
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
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2" data-testid="text-summary-termflow-title">
                  <Bot className="h-5 w-5 text-tf-navy" />
                  TermFlow
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Focus:</strong> AI-first automation platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>AI Assistant:</strong> Ava handles enquiries 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Pricing:</strong> From £99/month, transparent tiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Channels:</strong> WhatsApp, Email, Web, SMS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Right-to-Rent:</strong> Automated verification</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-muted/50 rounded-lg border" data-testid="card-summary-concurrent">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2" data-testid="text-summary-concurrent-title">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  Concurrent (StuRents)
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Focus:</strong> Marketplace-first platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>AI Assistant:</strong> Form-based enquiries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Pricing:</strong> Custom quote required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Channels:</strong> Email and portal focused</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Right-to-Rent:</strong> Manual checks</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Bottom Line:</strong> TermFlow is built for PBSA operators who want to automate their lettings process end-to-end with AI. 
              Concurrent (part of StuRents) focuses on marketplace listings and traditional property management workflows. 
              If automation and reducing admin time are priorities, TermFlow offers more comprehensive AI-powered features.
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
              <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-differentiator-ai">
                <Bot className="h-8 w-8 text-tf-navy mx-auto mb-2" />
                <div className="text-xl font-bold text-tf-navy" data-testid="text-differentiator-ai-title">AI-First</div>
                <div className="text-sm text-muted-foreground mt-1">
                  TermFlow uses AI (Ava) for 24/7 enquiry handling vs Concurrent's form-based approach
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-differentiator-pricing">
                <PoundSterling className="h-8 w-8 text-tf-navy mx-auto mb-2" />
                <div className="text-xl font-bold text-tf-navy" data-testid="text-differentiator-pricing-title">Transparent Pricing</div>
                <div className="text-sm text-muted-foreground mt-1">
                  TermFlow from £99/mo with clear tiers vs Concurrent's custom quotes
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-differentiator-multichannel">
                <Phone className="h-8 w-8 text-tf-navy mx-auto mb-2" />
                <div className="text-xl font-bold text-tf-navy" data-testid="text-differentiator-multichannel-title">Multi-Channel</div>
                <div className="text-sm text-muted-foreground mt-1">
                  WhatsApp, SMS, Email unified inbox vs email-focused communication
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
                      <th className="text-center p-3 w-1/3">Concurrent</th>
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
                            {feature.concurrent ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span className="text-xs text-muted-foreground">{feature.concurrentNote}</span>
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
                <h3 className="font-bold text-lg mb-4" data-testid="text-pricing-termflow-title">TermFlow Pricing</h3>
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
                    <span><strong>No setup fees</strong> - Get started immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Free trial available</strong> - Test before committing</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-muted/50 rounded-lg border" data-testid="card-pricing-concurrent">
                <h3 className="font-bold text-lg mb-4" data-testid="text-pricing-concurrent-title">Concurrent Pricing</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Custom quote:</strong> Contact sales for pricing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No public pricing:</strong> Negotiation required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>StuRents integration:</strong> Bundled marketplace access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Setup fees:</strong> May apply (varies)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Contract length:</strong> Typically annual</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Pricing Advantage:</strong> TermFlow's transparent pricing means you know exactly what you'll pay from day one. 
                No lengthy sales negotiations or surprise fees. Most operators see ROI within 2-3 months through reduced admin time.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-automation-comparison">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-tf-navy" />
              AI & Automation Deep Dive
            </CardTitle>
            <CardDescription>
              The biggest difference between the platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg border border-tf-lime/30 bg-tf-lime/5" data-testid="card-termflow-ai">
                  <h4 className="font-semibold mb-3 flex items-center gap-2" data-testid="text-termflow-ai-title">
                    <Bot className="h-4 w-4" />
                    TermFlow AI (Ava)
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>24/7 automated enquiry responses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Natural language understanding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Automatic viewing booking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Multi-language support (international students)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Intelligent lead qualification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Handoff to human when needed</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30" data-testid="card-concurrent-approach">
                  <h4 className="font-semibold mb-3 flex items-center gap-2" data-testid="text-concurrent-approach-title">
                    <FileText className="h-4 w-4" />
                    Concurrent Approach
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Form-based enquiry collection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Manual response required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Business hours response times</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>English-only interface</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Manual lead assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Traditional workflow management</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Why AI Matters for PBSA</p>
                <p className="text-sm text-muted-foreground">
                  Student accommodation enquiries often come outside business hours - evenings, weekends, and from international time zones. 
                  AI-powered responses mean you never miss a hot lead. TermFlow's Ava AI can handle routine queries, book viewings, 
                  and qualify leads automatically, freeing your team to focus on high-value activities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-right-to-rent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-tf-navy" />
              Right-to-Rent Compliance
            </CardTitle>
            <CardDescription>
              A critical requirement for UK lettings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-l-tf-lime pl-4" data-testid="card-termflow-r2r">
                <h3 className="font-semibold mb-3" data-testid="text-termflow-r2r-title">TermFlow R2R Automation</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Automated Home Office share code verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>ID document OCR extraction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Automatic follow-up reminders for expiring visas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Compliance audit trail</span>
                  </li>
                </ul>
              </div>
              <div className="border-l-4 border-l-muted pl-4" data-testid="card-concurrent-r2r">
                <h3 className="font-semibold mb-3" data-testid="text-concurrent-r2r-title">Concurrent R2R Process</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Manual share code checking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Manual document review</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Manual tracking of visa expiries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Basic document storage</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-target-audience">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-tf-navy" />
              Target Audience & Market Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-tf-lime/10 border border-tf-lime/20" data-testid="card-termflow-audience">
                <h3 className="font-bold text-lg mb-4" data-testid="text-termflow-audience-title">TermFlow: Pure Automation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Built specifically for PBSA operators who want to automate the entire lettings journey from first enquiry to signed contract. 
                  Ideal for teams looking to reduce admin overhead and improve response times.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>PBSA operators (50-500+ beds)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Property management companies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>University accommodation teams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>High-volume lettings operations</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-lg bg-muted/50 border" data-testid="card-concurrent-audience">
                <h3 className="font-bold text-lg mb-4" data-testid="text-concurrent-audience-title">Concurrent: Marketplace Focus</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Part of the StuRents ecosystem, Concurrent is designed for operators who prioritise marketplace visibility 
                  and want a platform integrated with student property listing portals.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>StuRents marketplace users</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Portal-first marketing strategy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Traditional lettings workflows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Teams comfortable with manual processes</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {useCases.map((useCase, index) => (
            <Card key={index} className={useCase.colour} data-testid={index === 0 ? "card-choose-termflow" : "card-choose-concurrent"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <useCase.icon className="h-5 w-5" />
                  {useCase.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {useCase.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8" data-testid="card-migration">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-tf-navy" />
              Switching from Concurrent to TermFlow
            </CardTitle>
            <CardDescription>
              Considering a change? Here's what to expect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-stat-migration">
                  <div className="text-2xl font-bold text-tf-navy" data-testid="text-stat-migration-value">1-2 Days</div>
                  <div className="text-sm text-muted-foreground mt-1">Data migration</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-stat-training">
                  <div className="text-2xl font-bold text-tf-navy" data-testid="text-stat-training-value">2 Hours</div>
                  <div className="text-sm text-muted-foreground mt-1">Team training</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-stat-productivity">
                  <div className="text-2xl font-bold text-tf-navy" data-testid="text-stat-productivity-value">Week 1</div>
                  <div className="text-sm text-muted-foreground mt-1">Full productivity</div>
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Migration Support:</strong> TermFlow offers dedicated migration assistance for operators switching from Concurrent or other platforms. 
                  We'll help transfer your property data, student records, and set up your automation workflows. 
                  Most teams are fully operational within the first week.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <section data-testid="section-cta">
        <Card className="mb-8" data-testid="card-cta">
          <CardHeader>
            <CardTitle>Ready to See the Difference?</CardTitle>
            <CardDescription>
              Experience TermFlow's AI-powered automation firsthand
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Book a personalised demo to see how TermFlow can transform your PBSA lettings operation. 
              We'll show you exactly how our AI assistant Ava handles enquiries, automates viewings, 
              and streamlines the entire journey from first contact to signed contract.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" data-testid="button-cta-demo">
                <a href="/book-demo" data-testid="link-book-demo">Book a Demo</a>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-cta-pricing">
                <a href="/pricing" data-testid="link-pricing">View Pricing</a>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-cta-roi">
                <a href="/roi-calculator" data-testid="link-roi-calculator">Calculate Your ROI</a>
              </Button>
            </div>
          </CardContent>
        </Card>
        </section>

        <Card className="mb-8 bg-muted/30" data-testid="card-disclaimer">
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> This comparison is based on publicly available information as of December 2025. 
              Features and pricing may change. We recommend contacting both TermFlow and Concurrent directly for the most current information. 
              TermFlow is committed to providing accurate, unbiased comparisons to help you make informed decisions.
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
