import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Zap, Building2, Bot, Users, Shield, Calendar, CheckCircle, XCircle, PoundSterling, Clock, ArrowRight, GraduationCap, Heart, Settings } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function TermFlowVsKinetic() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Comparisons", url: "/comparisons" },
    { name: "TermFlow vs Kinetic", url: "/comparisons/termflow-vs-kinetic" }
  ];

  const featureComparison = [
    {
      category: "AI & Automation",
      features: [
        { name: "Conversational AI Assistant", termflow: true, kinetic: false, termflowNote: "Ava AI - 24/7 response", kineticNote: "Traditional workflows" },
        { name: "24/7 Automated Enquiry Handling", termflow: true, kinetic: false, termflowNote: "WhatsApp, Email, Web", kineticNote: "Business hours support" },
        { name: "AI Contract Generation", termflow: true, kinetic: false, termflowNote: "Auto-populate from data", kineticNote: "Manual document creation" },
        { name: "Intelligent Lead Scoring", termflow: true, kinetic: false, termflowNote: "ML-based prioritisation", kineticNote: "Rule-based workflows" },
      ]
    },
    {
      category: "Target Market & Scope",
      features: [
        { name: "University Accommodation", termflow: true, kinetic: true, termflowNote: "Lettings automation", kineticNote: "Full campus integration" },
        { name: "Private PBSA Operators", termflow: true, kinetic: true, termflowNote: "All portfolio sizes", kineticNote: "Large operators focus" },
        { name: "Small Portfolio Support (< 100 beds)", termflow: true, kinetic: false, termflowNote: "From £99/month", kineticNote: "Enterprise pricing" },
        { name: "Events & Catering Management", termflow: false, kinetic: true, termflowNote: "Not included", kineticNote: "Full event platform" },
      ]
    },
    {
      category: "Student Wellbeing & Services",
      features: [
        { name: "Dedicated Wellbeing Platform", termflow: false, kinetic: true, termflowNote: "Lettings-focused", kineticNote: "StudentLife platform" },
        { name: "Student Engagement Tools", termflow: false, kinetic: true, termflowNote: "Automated comms only", kineticNote: "Community features" },
        { name: "Pastoral Care Integration", termflow: false, kinetic: true, termflowNote: "Not included", kineticNote: "University integration" },
        { name: "Automated Welfare Check-ins", termflow: true, kinetic: true, termflowNote: "Via messaging", kineticNote: "Dedicated module" },
      ]
    },
    {
      category: "Lettings & Contracts",
      features: [
        { name: "Digital Contract Signing", termflow: true, kinetic: true, termflowNote: "DocuSign/Signable", kineticNote: "Integrated e-signature" },
        { name: "Automated Viewing Booking", termflow: true, kinetic: false, termflowNote: "AI-powered scheduling", kineticNote: "Manual coordination" },
        { name: "Right-to-Rent Verification", termflow: true, kinetic: true, termflowNote: "Automated API checks", kineticNote: "Manual verification" },
        { name: "Dual Occupancy Pricing", termflow: true, kinetic: true, termflowNote: "Single/shared rates", kineticNote: "Room type pricing" },
      ]
    },
    {
      category: "Communication & Channels",
      features: [
        { name: "WhatsApp Business API", termflow: true, kinetic: false, termflowNote: "Full conversation flow", kineticNote: "Not available" },
        { name: "Multi-channel Unified Inbox", termflow: true, kinetic: false, termflowNote: "WhatsApp, Email, Web", kineticNote: "Portal-based comms" },
        { name: "Automated Follow-ups", termflow: true, kinetic: false, termflowNote: "AI-timed sequences", kineticNote: "Scheduled notifications" },
        { name: "International Language Support", termflow: true, kinetic: false, termflowNote: "Multi-language AI", kineticNote: "English primary" },
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
        "You're a small-to-medium PBSA operator (< 500 beds)",
        "You prioritise transparent, predictable pricing",
        "You want rapid 1-2 day implementation",
        "You focus on lettings automation over campus services",
      ],
      colour: "bg-tf-lime/10 border-tf-lime/20"
    },
    {
      title: "Choose Kinetic If...",
      icon: GraduationCap,
      points: [
        "You're a university or large institutional operator",
        "You need integrated events/catering management",
        "Student wellbeing platform is a priority (StudentLife)",
        "You require deep campus system integration",
        "You have budget for enterprise implementation",
        "You manage 1,000+ beds with complex operations",
      ],
      colour: "bg-muted/50 border-muted"
    },
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="TermFlow vs Kinetic: Student Accommodation Software Comparison 2025"
        description="TermFlow vs Kinetic Software comparison for PBSA operators. Compare AI automation, pricing, features & ROI. See which student accommodation platform fits your needs."
        keywords="TermFlow vs Kinetic, Kinetic Software alternative, student accommodation software comparison, PBSA management software, Kinetic alternative"
        canonical="https://termflow.co.uk/comparisons/termflow-vs-kinetic"
        ogUrl="https://termflow.co.uk/comparisons/termflow-vs-kinetic"
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
              TermFlow vs Kinetic: Student Accommodation Software Comparison 2025
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl" data-testid="text-page-description">
            An unbiased, side-by-side comparison of TermFlow and Kinetic Software for student accommodation management. 
            Discover which platform best fits your PBSA operation's needs, whether you're a private operator or university.
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
                    <span><strong>Focus:</strong> AI-powered lettings automation</span>
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
                    <span><strong>Setup:</strong> 1-2 days implementation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Market:</strong> All PBSA portfolio sizes</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-muted/50 rounded-lg border" data-testid="card-summary-kinetic">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2" data-testid="text-summary-kinetic-title">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  Kinetic Software
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Focus:</strong> Full campus management platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>AI Assistant:</strong> Traditional workflow-based</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Pricing:</strong> Enterprise pricing (custom quotes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Setup:</strong> Longer implementation timeline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Market:</strong> Universities & large operators</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Bottom Line:</strong> TermFlow is purpose-built for PBSA operators who want AI-powered lettings automation with rapid implementation and transparent pricing. 
              Kinetic Software offers a comprehensive campus management suite including events, catering, and the StudentLife wellbeing platform - ideal for universities and large institutional operators who need more than pure lettings functionality.
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
                  TermFlow uses AI (Ava) for 24/7 enquiry handling vs Kinetic's traditional workflow approach
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-differentiator-setup">
                <Clock className="h-8 w-8 text-tf-navy mx-auto mb-2" />
                <div className="text-xl font-bold text-tf-navy" data-testid="text-differentiator-setup-title">Fast Setup</div>
                <div className="text-sm text-muted-foreground mt-1">
                  TermFlow: 1-2 days go-live vs Kinetic's extended enterprise implementation
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="card-differentiator-wellbeing">
                <Heart className="h-8 w-8 text-tf-navy mx-auto mb-2" />
                <div className="text-xl font-bold text-tf-navy" data-testid="text-differentiator-wellbeing-title">Wellbeing Focus</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Kinetic includes StudentLife wellbeing platform; TermFlow focuses on lettings automation
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
                      <th className="text-center p-3 w-1/3">Kinetic</th>
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
                            {feature.kinetic ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span className="text-xs text-muted-foreground">{feature.kineticNote}</span>
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
              <div className="p-6 bg-muted/50 rounded-lg border" data-testid="card-pricing-kinetic">
                <h3 className="font-bold text-lg mb-4" data-testid="text-pricing-kinetic-title">Kinetic Pricing</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Enterprise pricing:</strong> Contact for custom quote</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>No public pricing:</strong> Sales process required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Modular approach:</strong> Pay for modules you need</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Implementation fees:</strong> Typically required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Contract length:</strong> Multi-year common</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Pricing Insight:</strong> TermFlow's transparent pricing makes it accessible for operators of all sizes. 
                Kinetic's enterprise model is designed for larger university and institutional deployments where comprehensive campus management justifies higher investment.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-implementation-comparison">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-tf-navy" />
              Implementation & Onboarding
            </CardTitle>
            <CardDescription>
              Getting started with each platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg border border-tf-lime/30 bg-tf-lime/5" data-testid="card-implementation-termflow">
                <h4 className="font-semibold mb-3 flex items-center gap-2" data-testid="text-implementation-termflow-title">
                  <Clock className="h-4 w-4" />
                  TermFlow Implementation
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Day 1:</strong> Account setup & property configuration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Day 1-2:</strong> AI training with your property data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Day 2:</strong> Go live with full automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Self-service onboarding available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>No technical resources required</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30" data-testid="card-implementation-kinetic">
                <h4 className="font-semibold mb-3 flex items-center gap-2" data-testid="text-implementation-kinetic-title">
                  <Calendar className="h-4 w-4" />
                  Kinetic Implementation
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Discovery phase:</strong> Requirements gathering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Configuration:</strong> Custom module setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Timeline:</strong> Weeks to months depending on scope</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Dedicated implementation team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>May require internal IT involvement</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-best-for">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-tf-navy" />
              Which Platform is Best For You?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <div key={index} className={`p-6 rounded-lg border ${useCase.colour}`} data-testid={index === 0 ? "card-choose-termflow" : "card-choose-kinetic"}>
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

        <Card className="mb-8" data-testid="card-kinetic-strengths">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-tf-navy" />
              Where Kinetic Excels
            </CardTitle>
            <CardDescription>
              Features where Kinetic has an advantage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg" data-testid="card-kinetic-strength-wellbeing">
                  <h4 className="font-semibold mb-2 flex items-center gap-2" data-testid="text-kinetic-strength-wellbeing-title">
                    <Heart className="h-4 w-4 text-pink-600" />
                    StudentLife Wellbeing Platform
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Kinetic's StudentLife platform provides dedicated wellbeing features including mental health resources, 
                    community building tools, and pastoral care integration that goes beyond lettings automation.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg" data-testid="card-kinetic-strength-events">
                  <h4 className="font-semibold mb-2 flex items-center gap-2" data-testid="text-kinetic-strength-events-title">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Events & Catering Management
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Universities and large operators benefit from Kinetic's integrated events management and catering 
                    functionality - features outside TermFlow's lettings-focused scope.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg" data-testid="card-kinetic-strength-campus">
                  <h4 className="font-semibold mb-2 flex items-center gap-2" data-testid="text-kinetic-strength-campus-title">
                    <Building2 className="h-4 w-4 text-purple-600" />
                    University Campus Integration
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    For university accommodation offices, Kinetic offers deeper integration with campus systems, 
                    student information systems, and institutional workflows.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg" data-testid="card-kinetic-strength-enterprise">
                  <h4 className="font-semibold mb-2 flex items-center gap-2" data-testid="text-kinetic-strength-enterprise-title">
                    <Shield className="h-4 w-4 text-green-600" />
                    Enterprise Support
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Large operators get dedicated account management, custom training programmes, 
                    and enterprise SLAs suited to institutional requirements.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm">
                <strong>Honest Assessment:</strong> If your primary need is comprehensive campus management with wellbeing, 
                events, and catering features for a large university operation, Kinetic may be the better fit. 
                TermFlow focuses specifically on automating the lettings journey with AI-powered efficiency.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-migration">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-tf-navy" />
              Switching to TermFlow
            </CardTitle>
            <CardDescription>
              Making the transition from Kinetic or other platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you're considering moving from Kinetic to TermFlow for your lettings automation, 
                we offer a smooth transition process:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Data migration:</strong> We'll help import your property data and tenant information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Parallel running:</strong> Run both systems during transition if needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Team training:</strong> Comprehensive onboarding for your staff</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Free trial:</strong> Test TermFlow with your actual properties before committing</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <section data-testid="section-cta">
        <Card className="mb-8" data-testid="card-cta">
          <CardHeader>
            <CardTitle>Ready to See TermFlow in Action?</CardTitle>
            <CardDescription>
              Book a personalised demo to see how TermFlow compares for your specific operation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              See how TermFlow's AI automation can transform your lettings process. We'll show you 
              exactly how it works with your property types and answer any questions about switching 
              from your current platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" data-testid="button-cta-demo">
                <a href="/book-demo" data-testid="link-book-demo">Book a Demo</a>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-cta-pricing">
                <a href="/pricing" data-testid="link-pricing">View Pricing</a>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-cta-calculator">
                <a href="/roi-calculator" data-testid="link-roi-calculator">Calculate Your ROI</a>
              </Button>
            </div>
          </CardContent>
        </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
}
