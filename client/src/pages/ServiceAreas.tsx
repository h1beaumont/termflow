import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Phone, Shield, Globe, Users } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { SiteSearch } from "@/components/SiteSearch";

export default function ServiceAreas() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Service Areas", url: "/service-areas" }
  ];
  const cities = [
    {
      name: "London",
      slug: "london-student-accommodation-automation",
      beds: "3,500+",
      universities: ["UCL", "King's College", "Imperial", "LSE"],
      description: "Serving London's largest PBSA market with AI automation for high-volume operations"
    },
    {
      name: "Manchester",
      slug: "manchester-student-accommodation-automation",
      beds: "2,200+",
      universities: ["University of Manchester", "Manchester Met"],
      description: "Supporting Manchester's growing student accommodation sector"
    },
    {
      name: "Bristol",
      slug: "bristol-student-accommodation-automation",
      beds: "1,800+",
      universities: ["University of Bristol", "UWE Bristol"],
      description: "Automation for Bristol's competitive student lettings market"
    },
    {
      name: "Edinburgh",
      slug: "edinburgh-student-accommodation-automation",
      beds: "1,600+",
      universities: ["University of Edinburgh", "Edinburgh Napier"],
      description: "Serving Scotland's capital with GDPR-compliant automation"
    },
    {
      name: "Newcastle",
      slug: "newcastle-student-accommodation-automation",
      beds: "1,400+",
      universities: ["Newcastle University", "Northumbria University"],
      description: "Supporting Newcastle's thriving student accommodation sector"
    },
    {
      name: "Birmingham",
      slug: "birmingham-student-accommodation-automation",
      beds: "1,500+",
      universities: ["University of Birmingham", "Aston University", "BCU"],
      description: "Automation for Birmingham's diverse PBSA market"
    },
    {
      name: "Leeds",
      slug: "leeds-student-accommodation-automation",
      beds: "1,300+",
      universities: ["University of Leeds", "Leeds Beckett"],
      description: "Serving Leeds' established student accommodation market"
    },
    {
      name: "Glasgow",
      slug: "glasgow-student-accommodation-automation",
      beds: "1,200+",
      universities: ["University of Glasgow", "Strathclyde"],
      description: "Supporting Glasgow's growing PBSA sector"
    },
    {
      name: "Sheffield",
      slug: "sheffield-student-accommodation-automation",
      beds: "1,100+",
      universities: ["University of Sheffield", "Sheffield Hallam"],
      description: "Automation for Sheffield's student accommodation providers"
    },
    {
      name: "Liverpool",
      slug: "liverpool-student-accommodation-automation",
      beds: "1,000+",
      universities: ["University of Liverpool", "Liverpool John Moores"],
      description: "Serving Liverpool's vibrant student lettings market"
    },
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="Service Areas - UK & Ireland Coverage | TermFlow"
        description="TermFlow serves PBSA operators across the UK & Ireland with AI automation. UK-first approach ensures GDPR compliance, data residency, and local support in 10 major cities."
        keywords="PBSA service areas, UK student accommodation automation, GDPR compliant automation, student lettings coverage, UK data residency"
        canonical="https://termflow.co.uk/service-areas"
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
            <MapPin className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              UK & Ireland Coverage
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            TermFlow serves PBSA operators across the United Kingdom and Ireland with AI automation, GDPR compliance, and UK data residency. We're UK-first by design.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
          </div>
        </div>

        {/* Coverage Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-tf-navy" data-testid="card-coverage">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-tf-navy/10 p-3">
                  <MapPin className="h-6 w-6 text-tf-navy" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Primary Coverage</p>
                  <p className="text-2xl font-bold text-tf-navy">UK & Ireland</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                10 major cities served with local support
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-tf-navy" data-testid="card-beds">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-tf-navy/10 p-3">
                  <Building2 className="h-6 w-6 text-tf-navy" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Beds Automated</p>
                  <p className="text-2xl font-bold text-tf-navy">18,000+</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Across all service areas combined
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-tf-navy" data-testid="card-support">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-tf-navy/10 p-3">
                  <Phone className="h-6 w-6 text-tf-navy" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Support Hours</p>
                  <p className="text-2xl font-bold text-tf-navy">GMT</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Mon-Fri 9am-6pm local time support
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why UK-First */}
        <Card className="mb-12" data-testid="card-uk-first">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-tf-navy" />
              Why We're UK-First by Design
            </CardTitle>
            <CardDescription>
              Our UK focus isn't a limitation—it's a strategic advantage for PBSA operators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-tf-navy" />
                  GDPR & UK Data Residency
                </h3>
                <p className="text-sm text-muted-foreground">
                  All student data stored exclusively in UK/EU data centres (London, UK). Fully compliant with GDPR and UK Data Protection Act 2018. Your data never leaves UK/EU jurisdiction.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Primary database: AWS eu-west-2 (London)</li>
                  <li>• Object storage: Google Cloud europe-west2 (London)</li>
                  <li>• Application hosting: Replit EU region</li>
                  <li>• No US data transfers</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-tf-navy" />
                  UK University & PBSA Expertise
                </h3>
                <p className="text-sm text-muted-foreground">
                  Deep understanding of UK academic calendar, clearing process, Right-to-Rent requirements, and deposit protection schemes (TDS, DPS, MyDeposits).
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• UK clearing season optimisations</li>
                  <li>• Right-to-Rent automation (UK Immigration Act)</li>
                  <li>• Deposit protection scheme integrations</li>
                  <li>• UK property portal integrations (Rightmove, Zoopla)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-tf-navy" />
                  Local Support Teams
                </h3>
                <p className="text-sm text-muted-foreground">
                  UK-based support team understands local market dynamics, terminology, and challenges. No overseas call centres or timezone delays.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Support in GMT timezone</li>
                  <li>• UK-based onboarding specialists</li>
                  <li>• Local market knowledge</li>
                  <li>• Same-day response during office hours</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-tf-navy" />
                  Purpose-Built for UK PBSA
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our AI is trained on UK student accommodation terminology, pricing models (per week vs per month), and common enquiries specific to UK universities.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• British English throughout</li>
                  <li>• UK date formats (DD/MM/YYYY)</li>
                  <li>• UK currency (£) and pricing conventions</li>
                  <li>• Academic year terminology (clearing, Freshers' Week, etc.)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cities We Serve */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Cities We Serve</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Card key={city.slug} className="hover-elevate" data-testid={`card-city-${city.slug}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{city.name}</CardTitle>
                    <MapPin className="h-5 w-5 text-tf-navy" />
                  </div>
                  <CardDescription>{city.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{city.beds} beds automated</span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-1">Major Universities:</p>
                    <div className="flex flex-wrap gap-1">
                      {city.universities.map((uni) => (
                        <Badge key={uni} variant="secondary" className="text-xs">
                          {uni}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full" data-testid={`button-learn-more-${city.slug}`}>
                    <a href={`/${city.slug}`}>
                      View student accommodation automation in {city.name}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <Card className="mb-12" data-testid="card-map">
          <CardHeader>
            <CardTitle>UK Coverage Map</CardTitle>
            <CardDescription>
              TermFlow operates in major UK student cities with established PBSA markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-tf-navy/5 rounded-md border-2 border-dashed border-tf-navy/20 p-12 text-center">
              <MapPin className="h-16 w-16 text-tf-navy/40 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Interactive UK Coverage Map</p>
              <p className="text-sm text-muted-foreground">
                10 major cities with active PBSA operators using TermFlow
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Expansion Plans */}
        <Card className="mb-12" data-testid="card-expansion">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-tf-navy" />
              Expansion Roadmap
            </CardTitle>
            <CardDescription>
              Future service area expansion plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-tf-navy/10 p-3">
                <MapPin className="h-6 w-6 text-tf-navy" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">2025: Additional UK Cities</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Expanding to Nottingham, Cardiff, and Southampton based on operator demand. Same UK-first approach with local support.
                </p>
                <Badge variant="outline">Q2-Q3 2025</Badge>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-tf-navy/10 p-3">
                <Globe className="h-6 w-6 text-tf-navy" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Ireland Coverage</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Dublin and Cork expansion planned for late 2025, maintaining EU data residency and GDPR compliance.
                </p>
                <Badge variant="outline">Q4 2025</Badge>
              </div>
            </div>

            <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
              <p className="text-sm font-semibold mb-2">Why We Expand Carefully:</p>
              <p className="text-sm text-muted-foreground">
                We prioritise depth over breadth. Each new city gets dedicated onboarding support, local market expertise, and integration with regional property portals. We'd rather serve 10 cities exceptionally well than 50 cities poorly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-tf-navy to-tf-navy-700 rounded-lg p-8 md:p-12 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Operate in One of Our Service Areas?
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            See how TermFlow is helping PBSA operators in your city automate their workflow, improve occupancy, and reduce admin costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" data-testid="button-cta-demo">
              <a href="/book-demo">Book Your Free Demo</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20" data-testid="button-cta-locations">
              <a href="/#locations">Browse All Locations</a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
