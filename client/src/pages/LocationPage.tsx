import { SEOHead } from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Building2, Users, Clock, TrendingUp, CheckCircle, MapPin } from "lucide-react";

interface LocationPageProps {
  city: string;
  citySlug: string;
  universities: string[];
  stats: {
    studentPopulation: string;
    pbsaProperties: string;
    avgOccupancyRate: string;
  };
  challenges: string[];
  benefits: string[];
}

export function LocationPage({ city, citySlug, universities, stats, challenges, benefits }: LocationPageProps) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `TermFlow ${city}`,
    "description": `AI-powered lettings automation for ${city} student accommodation (PBSA). Automate enquiries, viewings, contracts, and deposits for ${city} landlords.`,
    "url": `https://termflow.co.uk/${citySlug}-student-accommodation-automation`,
    "telephone": "+44-20-XXXX-XXXX",
    "email": "hello@termflow.co.uk",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "addressCountry": "GB"
    },
    "areaServed": {
      "@type": "City",
      "name": city,
      "addressCountry": "GB"
    },
    "priceRange": "£99-£499",
    "openingHours": "Mo-Fr 09:00-17:00",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "4",
      "bestRating": "5",
      "worstRating": "1"
    },
    "sameAs": [
      "https://www.linkedin.com/company/termflow"
    ]
  };

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title={`${city} Student Accommodation Automation | AI Lettings for ${city} PBSA`}
        description={`Automate ${city} student lettings with AI. Handle enquiries from ${universities.join(', ')} students 24/7. Save 20+ hours/week. PBSA automation from £99/month.`}
        keywords={`${city} student accommodation automation, ${city} PBSA software, ${city} lettings automation, ${universities.map(u => u + ' accommodation').join(', ')}`}
        canonical={`https://termflow.co.uk/${citySlug}-student-accommodation-automation`}
        ogTitle={`${city} Student Accommodation Automation | TermFlow`}
        ogDescription={`AI-powered lettings automation for ${city} PBSA. Automate ${city} student enquiries, viewings, and contracts.`}
        ogType="website"
        ogUrl={`https://termflow.co.uk/${citySlug}-student-accommodation-automation`}
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: `${city} Student Accommodation`, url: `/${citySlug}-student-accommodation-automation` }
        ]}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" data-testid="link-home">
            <TermFlowWordmark />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm font-semibold text-muted-foreground hover:text-foreground" data-testid="link-pricing">
              Pricing
            </Link>
            <Button variant="default" size="sm" asChild data-testid="button-book-demo">
              <Link href="/book-demo">Book Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-tf-navy/10 to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4" data-testid="badge-location">
            <MapPin className="w-3 h-3 mr-1" />
            {city}
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            AI Lettings Automation for {city} Student Accommodation
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Automate your {city} PBSA operations. Handle enquiries from {universities[0]}, {universities[1]}, and {universities.length > 2 ? 'more' : universities[2]} students 24/7. Save 20+ hours/week.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-cta-demo">
              <Link href="/book-demo" className="text-lg px-8">Book a Free Demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-pricing">
              <Link href="/pricing" className="text-lg px-8">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 bg-white dark:bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{city} Student Accommodation Market</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stats.studentPopulation}</div>
              <div className="text-muted-foreground">Students in {city}</div>
            </div>
            <div className="text-center">
              <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stats.pbsaProperties}</div>
              <div className="text-muted-foreground">PBSA Properties</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stats.avgOccupancyRate}</div>
              <div className="text-muted-foreground">Avg. Occupancy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Universities Served */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Serving {city} Universities</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {universities.map(uni => (
              <Badge key={uni} variant="outline" className="text-base px-4 py-2">
                {uni}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-12 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Challenges for {city} PBSA Operators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-background rounded-lg">
                <Clock className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">{challenge}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How TermFlow Helps {city} Landlords</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <p className="text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-transparent to-tf-navy/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Automate Your {city} Student Lettings?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join {city} PBSA operators saving 20+ hours/week with AI automation
          </p>
          <Button size="lg" asChild data-testid="button-final-cta">
            <Link href="/book-demo" className="text-lg px-8">Book a Demo Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
