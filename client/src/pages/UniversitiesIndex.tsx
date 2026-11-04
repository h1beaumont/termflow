import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Building2, MapPin, Users, CheckCircle } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function UniversitiesIndex() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Universities", url: "/universities" }
  ];

  const cities = [
    {
      city: "London",
      universities: ["UCL", "King's College London", "Imperial College", "LSE", "Queen Mary", "City University", "SOAS", "Royal Holloway"],
      operators: "12 operators, 3,500+ beds",
      challenges: "High international student volumes (60-70%), competitive market, premium pricing"
    },
    {
      city: "Manchester",
      universities: ["University of Manchester", "Manchester Metropolitan University"],
      operators: "8 operators, 2,200+ beds",
      challenges: "Large student population, clearing season surge, BTR crossover market"
    },
    {
      city: "Birmingham",
      universities: ["University of Birmingham", "Aston University", "Birmingham City University"],
      operators: "6 operators, 1,800+ beds",
      challenges: "Multi-campus coordination, diverse student demographics"
    },
    {
      city: "Leeds",
      universities: ["University of Leeds", "Leeds Beckett University"],
      operators: "5 operators, 1,500+ beds",
      challenges: "High postgraduate volumes, competitive pricing environment"
    },
    {
      city: "Nottingham",
      universities: ["University of Nottingham", "Nottingham Trent University"],
      operators: "4 operators, 1,200+ beds",
      challenges: "Two large universities with different academic calendars"
    },
    {
      city: "Bristol",
      universities: ["University of Bristol", "UWE Bristol"],
      operators: "5 operators, 1,400+ beds",
      challenges: "Premium market, high property costs, competitive clearing"
    },
    {
      city: "Newcastle",
      universities: ["Newcastle University", "Northumbria University"],
      operators: "4 operators, 1,100+ beds",
      challenges: "Budget-conscious students, high clearing volumes"
    },
    {
      city: "Sheffield",
      universities: ["University of Sheffield", "Sheffield Hallam University"],
      operators: "4 operators, 1,000+ beds",
      challenges: "Large international cohorts, visa compliance critical"
    },
    {
      city: "Glasgow",
      universities: ["University of Glasgow", "University of Strathclyde", "Glasgow Caledonian"],
      operators: "3 operators, 900+ beds",
      challenges: "Scottish academic calendar differences, international students"
    },
    {
      city: "Edinburgh",
      universities: ["University of Edinburgh", "Edinburgh Napier", "Heriot-Watt"],
      operators: "4 operators, 1,100+ beds",
      challenges: "Premium market, high international volumes, competitive"
    },
    {
      city: "Liverpool",
      universities: ["University of Liverpool", "Liverpool John Moores", "Liverpool Hope"],
      operators: "3 operators, 850+ beds",
      challenges: "Multiple universities, diverse student needs"
    },
    {
      city: "Durham",
      universities: ["Durham University"],
      operators: "2 operators, 600+ beds",
      challenges: "Collegiate system, traditional market, high domestic:international ratio"
    }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="UK Universities & PBSA Operators We Work With | TermFlow"
        description="TermFlow works with PBSA operators across 30+ UK university cities. From London (UCL, Imperial, KCL) to Manchester, Birmingham, Leeds, and beyond. See if we work in your city."
        keywords="UK universities PBSA, student accommodation operators, London student housing, Manchester PBSA, university accommodation providers"
        canonical="https://termflow.co.uk/universities"
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
            <Building2 className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              UK Universities & PBSA Operators We Work With
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            TermFlow powers student accommodation operations across the UK, from London to Edinburgh. We work with operators serving 30+ universities in 12+ cities, managing 18,000+ beds.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Badge variant="secondary" data-testid="badge-coverage">12 UK Cities</Badge>
            <Badge variant="default" data-testid="badge-operators">60+ Operators</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-overview">
          <CardHeader>
            <CardTitle>Our UK Coverage</CardTitle>
            <CardDescription>
              TermFlow supports PBSA operators across major university cities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">30+</div>
                <div className="text-sm text-muted-foreground mt-1">UK Universities</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">60+</div>
                <div className="text-sm text-muted-foreground mt-1">PBSA Operators</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">18k+</div>
                <div className="text-sm text-muted-foreground mt-1">Beds Under Management</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {cities.map((cityData, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-city-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-tf-navy" />
                  {cityData.city}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {cityData.operators}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Universities Served</h3>
                  <div className="flex flex-wrap gap-2">
                    {cityData.universities.map((uni, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {uni}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy" />
                    City-Specific Challenges
                  </h3>
                  <p className="text-sm text-muted-foreground">{cityData.challenges}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">How TermFlow Helps</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {cityData.city === "London" && (
                      <>
                        <li>• Multilingual AI for 70% international students</li>
                        <li>• Visa & RTR compliance automation</li>
                        <li>• Premium market lead qualification</li>
                      </>
                    )}
                    {cityData.city === "Manchester" && (
                      <>
                        <li>• Clearing season surge automation (600+ enquiries/week)</li>
                        <li>• BTR crossover workflows</li>
                        <li>• Multi-property coordination</li>
                      </>
                    )}
                    {cityData.city === "Birmingham" && (
                      <>
                        <li>• Multi-campus student coordination</li>
                        <li>• Diverse demographic communication preferences</li>
                        <li>• High-volume enquiry management</li>
                      </>
                    )}
                    {cityData.city === "Leeds" && (
                      <>
                        <li>• Postgraduate-specific workflows</li>
                        <li>• Competitive pricing optimization</li>
                        <li>• Late availability remarketing</li>
                      </>
                    )}
                    {cityData.city === "Nottingham" && (
                      <>
                        <li>• Dual-university academic calendar management</li>
                        <li>• Separate workflow handling per university</li>
                        <li>• Cross-university student coordination</li>
                      </>
                    )}
                    {cityData.city === "Bristol" && (
                      <>
                        <li>• Premium market positioning automation</li>
                        <li>• High-value lead prioritization</li>
                        <li>• Competitive clearing response speeds</li>
                      </>
                    )}
                    {(cityData.city === "Newcastle" || cityData.city === "Sheffield" || cityData.city === "Liverpool" || cityData.city === "Durham") && (
                      <>
                        <li>• High-volume clearing season automation</li>
                        <li>• Budget-conscious student workflows</li>
                        <li>• Fast response time competitive advantage</li>
                      </>
                    )}
                    {(cityData.city === "Glasgow" || cityData.city === "Edinburgh") && (
                      <>
                        <li>• Scottish academic calendar alignment</li>
                        <li>• International student visa workflows</li>
                        <li>• Premium market automation</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8" data-testid="card-case-study">
          <CardHeader>
            <CardTitle>Success Story: Multi-City Operator</CardTitle>
            <CardDescription>
              How TermFlow scaled a 5-city, 1,200-bed portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">The Challenge</h3>
                <p className="text-sm text-muted-foreground">
                  PBSA operator with properties in London, Manchester, Birmingham, Leeds, and Bristol. Each city had different operational teams using different processes. Clearing season overwhelmed all 5 cities simultaneously. Central team couldn't benchmark performance across cities.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">The Solution</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  TermFlow portfolio-wide implementation with standardised workflows across all cities. Central dashboard with city-by-city performance tracking. AI automation handled clearing surge in all 5 cities without proportional staff increase.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">The Results</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">97.5%</div>
                    <div className="text-xs text-muted-foreground mt-1">Average occupancy across all cities</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">£180k</div>
                    <div className="text-xs text-muted-foreground mt-1">Annual savings (£36k per city)</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-xs text-muted-foreground mt-1">Admin time reduction during clearing</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-cta">
          <CardHeader>
            <CardTitle>See If We Work in Your City</CardTitle>
            <CardDescription>Book a demo to discuss your specific city and universities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Whether you operate in one city or across multiple UK locations, we'll show you how TermFlow handles city-specific challenges and integrates with local university systems. Bring your questions about your specific market.
            </p>
            <Button asChild size="lg" data-testid="button-cta-demo">
              <a href="/book-demo">See If We Work in Your City</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
