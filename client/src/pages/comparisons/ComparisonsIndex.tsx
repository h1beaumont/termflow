import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";
import { 
  Scale, Building2, Zap, Bot, Cog, ArrowRight, CheckCircle
} from "lucide-react";

interface ComparisonCard {
  slug: string;
  title: string;
  description: string;
  icon: React.ElementType;
  highlights: string[];
}

const competitorComparisons: ComparisonCard[] = [
  {
    slug: "termflow-vs-concurrent",
    title: "TermFlow vs Concurrent",
    description: "Compare AI-first automation against StuRents marketplace integration. See how TermFlow's 24/7 AI assistant outperforms form-based enquiry handling.",
    icon: Building2,
    highlights: ["AI enquiry handling", "WhatsApp automation", "Transparent pricing"]
  },
  {
    slug: "termflow-vs-kinetic",
    title: "TermFlow vs Kinetic",
    description: "Purpose-built PBSA automation versus traditional property management. Discover why TermFlow delivers 50% faster onboarding for student lets.",
    icon: Building2,
    highlights: ["Student-focused workflows", "Academic cycle automation", "Multi-channel comms"]
  },
  {
    slug: "termflow-vs-starrez",
    title: "TermFlow vs StarRez",
    description: "Compare TermFlow's agile AI platform with StarRez's enterprise suite. Find the right fit for your portfolio size and automation goals.",
    icon: Building2,
    highlights: ["Faster implementation", "Per-bed pricing", "API-first integration"]
  },
  {
    slug: "termflow-vs-yardi",
    title: "TermFlow vs Yardi",
    description: "Specialist PBSA automation versus general property management. See why operators choose TermFlow for student-specific workflows.",
    icon: Building2,
    highlights: ["PBSA-specific features", "Lower total cost", "Faster ROI"]
  }
];

const technologyComparisons: ComparisonCard[] = [
  {
    slug: "ai-vs-manual-workflows",
    title: "AI vs Manual Workflows",
    description: "Side-by-side analysis of 10 common PBSA workflows. See exactly how AI automation reduces admin from £45/bed/month to £22/bed with 2.1 month ROI.",
    icon: Bot,
    highlights: ["£23/bed savings", "20+ hrs/week saved", "95%+ accuracy"]
  },
  {
    slug: "rpa-vs-api-integration",
    title: "RPA vs API Integration",
    description: "When to use robotic process automation versus native API connections. Practical guidance for PBSA operators building automation stacks.",
    icon: Cog,
    highlights: ["Integration patterns", "Cost comparison", "Best use cases"]
  },
  {
    slug: "zapier-vs-make-vs-n8n",
    title: "Zapier vs Make vs n8n",
    description: "Compare the leading workflow automation platforms for PBSA. Pricing, features, and which works best with TermFlow's ecosystem.",
    icon: Zap,
    highlights: ["Pricing tiers", "PBSA workflows", "TermFlow integration"]
  }
];

export default function ComparisonsIndex() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Comparisons", url: "/comparisons" }
  ];

  return (
    <>
      <SEOHead
        title="PBSA Software Comparisons 2025 | TermFlow vs Competitors"
        description="Unbiased comparisons of leading student accommodation software. TermFlow vs Concurrent, Kinetic, StarRez & Yardi. Feature-by-feature analysis to help you choose the right PBSA platform."
        keywords="PBSA software comparison, student accommodation software comparison, TermFlow alternatives, Concurrent alternative, Kinetic alternative"
        canonical="https://termflow.co.uk/comparisons"
        ogTitle="PBSA Software Comparisons 2025 | TermFlow vs Competitors"
        ogDescription="Unbiased comparisons of leading student accommodation software. Feature-by-feature analysis to help you choose the right PBSA platform."
        ogType="website"
        ogUrl="https://termflow.co.uk/comparisons"
      />

      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="header-main">
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

      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-8">
          <Breadcrumb items={breadcrumbItems} />
          <LastUpdated date="December 8, 2025" className="mb-8" />
        </div>

        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-background" data-testid="section-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge className="mb-4" data-testid="badge-comparisons">
                <Scale className="w-3 h-3 mr-1" />
                Software Comparisons
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="text-page-title">
                PBSA Software Comparisons
              </h1>
              
              <p className="text-xl text-muted-foreground" data-testid="text-page-description">
                Unbiased, feature-by-feature comparisons to help you choose the right{" "}
                <Link href="/pbsa-management-platform" className="text-primary hover:underline" data-testid="link-pbsa-platform">
                  PBSA platform
                </Link>
                {" "}for your student accommodation portfolio. Each guide includes pricing, features, and honest assessments of where each platform excels.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2" data-testid="badge-unbiased-analysis">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Unbiased analysis</span>
                </div>
                <div className="flex items-center gap-2" data-testid="badge-updated-date">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Updated December 2025</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16" data-testid="section-competitor-comparisons">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3" data-testid="heading-competitor-comparisons">Competitor Comparisons</h2>
              <p className="text-muted-foreground max-w-2xl" data-testid="text-competitor-description">
                Head-to-head comparisons of TermFlow against leading PBSA and property management platforms. See exactly where each solution excels.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6" data-testid="grid-competitor-comparisons">
              {competitorComparisons.map((comparison) => (
                <Card key={comparison.slug} className="hover-elevate" data-testid={`card-comparison-${comparison.slug}`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10" data-testid={`icon-${comparison.slug}`}>
                        <comparison.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg" data-testid={`text-title-${comparison.slug}`}>{comparison.title}</CardTitle>
                        <CardDescription className="mt-2" data-testid={`text-description-${comparison.slug}`}>
                          {comparison.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4" data-testid={`badges-${comparison.slug}`}>
                      {comparison.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs" data-testid={`badge-${comparison.slug}-${index}`}>
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild variant="outline" className="w-full" data-testid={`button-read-${comparison.slug}`}>
                      <Link href={`/comparisons/${comparison.slug}`}>
                        Read Comparison
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30" data-testid="section-technology-comparisons">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3" data-testid="heading-technology-comparisons">Technology Comparisons</h2>
              <p className="text-muted-foreground max-w-2xl" data-testid="text-technology-description">
                Understand the technology choices behind PBSA automation. Compare AI vs manual processes, integration approaches, and workflow platforms.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6" data-testid="grid-technology-comparisons">
              {technologyComparisons.map((comparison) => (
                <Card key={comparison.slug} className="hover-elevate" data-testid={`card-comparison-${comparison.slug}`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10" data-testid={`icon-${comparison.slug}`}>
                        <comparison.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg" data-testid={`text-title-${comparison.slug}`}>{comparison.title}</CardTitle>
                        <CardDescription className="mt-2" data-testid={`text-description-${comparison.slug}`}>
                          {comparison.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4" data-testid={`badges-${comparison.slug}`}>
                      {comparison.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs" data-testid={`badge-${comparison.slug}-${index}`}>
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild variant="outline" className="w-full" data-testid={`button-read-${comparison.slug}`}>
                      <Link href={`/comparisons/${comparison.slug}`}>
                        Read Comparison
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16" data-testid="section-cta">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20" data-testid="card-cta">
              <CardContent className="py-12">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold" data-testid="heading-cta">
                    Ready to See TermFlow in Action?
                  </h2>
                  <p className="text-muted-foreground" data-testid="text-cta-description">
                    Book a personalised demo to see how TermFlow's AI automation compares to your current systems. We'll show you exactly how much time and money you could save.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button asChild size="lg" data-testid="button-book-demo-cta">
                      <Link href="/book-demo">
                        Book a Demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" data-testid="button-roi-calculator">
                      <Link href="/roi-calculator">
                        Calculate Your ROI
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
