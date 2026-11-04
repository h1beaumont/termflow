import { useRoute } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";
import { ComparisonBarChart } from "@/components/Charts/ComparisonBarChart";
import { TrendLineChart } from "@/components/Charts/TrendLineChart";
import { DemographicsPieChart } from "@/components/Charts/DemographicsPieChart";
import { ConversionFunnelChart } from "@/components/Charts/ConversionFunnelChart";
import { ArrowLeft, Building2, MapPin, Calendar, Quote, CheckCircle } from "lucide-react";
import { getCaseStudyBySlug, caseStudies } from "@/data/caseStudies";

export default function CaseStudy() {
  const [, params] = useRoute("/case-studies/:slug");
  const caseStudy = params?.slug ? getCaseStudyBySlug(params.slug) : undefined;

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-tf-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
          <p className="text-muted-foreground mb-8">The case study you're looking for doesn't exist.</p>
          <Button asChild>
            <a href="/case-studies">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Case Studies
            </a>
          </Button>
        </div>
      </div>
    );
  }

  // Get other case studies for recommendations
  const otherCaseStudies = caseStudies.filter(cs => cs.slug !== caseStudy.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title={`${caseStudy.title} | TermFlow Case Studies`}
        description={caseStudy.metaDescription}
        keywords={`${caseStudy.propertyName}, PBSA case study, student lettings automation`}
        canonical={`https://termflow.co.uk/case-studies/${caseStudy.slug}`}
        ogUrl={`https://termflow.co.uk/case-studies/${caseStudy.slug}`}
        ogTitle={caseStudy.title}
        ogDescription={caseStudy.metaDescription}
        ogType="article"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/">
              <TermFlowWordmark />
            </a>
            <SiteSearch />
          </div>
          <div className="flex items-center gap-4">
            <a href="/case-studies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-case-studies">
              <ArrowLeft className="h-4 w-4 inline mr-1" />
              All Case Studies
            </a>
            <Button variant="default" size="sm" asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90" data-testid="button-book-demo">
              <a href="/book-demo">Book Demo</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/case-studies" className="hover:text-foreground" data-testid="breadcrumb-case-studies">Case Studies</a>
          <span>/</span>
          <span className="text-foreground">{caseStudy.propertyName}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-br from-tf-navy to-tf-navy-700 text-white rounded-2xl p-8 md:p-12">
          <Badge className="bg-tf-lime text-tf-navy mb-4">Success Story</Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            {caseStudy.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-tf-lime flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-300">Property</div>
                <div className="font-semibold">{caseStudy.propertyName}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-tf-lime flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-300">Location</div>
                <div className="font-semibold">{caseStudy.location} • {caseStudy.units} units</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-tf-lime flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-300">Timeline</div>
                <div className="font-semibold">{caseStudy.timeline}</div>
              </div>
            </div>
          </div>

          <div className="text-gray-300">
            <span className="font-semibold">Type:</span> {caseStudy.propertyType}
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">The Challenge</h2>
        <div className="prose prose-lg max-w-none text-foreground">
          <div dangerouslySetInnerHTML={{ __html: caseStudy.challenge.replace(/\n/g, '<br/>') }} />
        </div>
      </section>

      {/* Solution Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 bg-muted/30">
        <div className="max-w-7xl">
          <h2 className="text-3xl font-bold mb-6">The Solution</h2>
          <div className="prose prose-lg max-w-none text-foreground">
            <div dangerouslySetInnerHTML={{ __html: caseStudy.solution.replace(/\n/g, '<br/>') }} />
          </div>
        </div>
      </section>

      {/* Results Section with Charts */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">The Results</h2>
        
        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {caseStudy.results.map((result, index) => (
            <Card key={index} className="hover-elevate">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground">{result.metric}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-tf-lime">{result.improvement}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {result.before} → {result.after}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {caseStudy.results.map((result, index) => {
            if (!result.chartData) return null;

            // Determine chart type based on data structure
            if (result.metric.includes('Conversion') && result.chartData.length === 2) {
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <ComparisonBarChart
                      data={result.chartData}
                      dataKey="value"
                      nameKey="name"
                      title={result.metric}
                      yAxisLabel="Conversion Rate (%)"
                    />
                  </CardContent>
                </Card>
              );
            }

            if (result.metric.includes('Response Time') && result.chartData[0]?.month) {
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <TrendLineChart
                      data={result.chartData}
                      lines={[
                        { dataKey: 'beforeTermFlow', name: 'Before TermFlow', color: 'hsl(var(--tf-slate))' },
                        { dataKey: 'afterTermFlow', name: 'After TermFlow', color: 'hsl(var(--tf-lime))' },
                      ]}
                      title="Response Time Improvement"
                      yAxisLabel="Minutes"
                    />
                  </CardContent>
                </Card>
              );
            }

            if (result.metric.includes('Demographics') || result.metric.includes('Bookings')) {
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <DemographicsPieChart
                      data={result.chartData}
                      dataKey="before"
                      nameKey="name"
                      title={`${result.metric} - Before vs After`}
                    />
                  </CardContent>
                </Card>
              );
            }

            if (result.metric.includes('No-Show') && result.chartData[0]?.stage) {
              return (
                <Card key={index} className="lg:col-span-2">
                  <CardContent className="p-6">
                    <ConversionFunnelChart
                      data={result.chartData}
                      title="Viewing Conversion Funnel"
                    />
                  </CardContent>
                </Card>
              );
            }

            // Default bar chart for other metrics
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <ComparisonBarChart
                    data={result.chartData}
                    dataKey="hours"
                    nameKey="name"
                    title={result.metric}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <Card className="bg-gradient-to-r from-tf-navy/5 to-tf-lime/5 border-tf-lime/20">
          <CardContent className="p-8 md:p-12">
            <Quote className="h-12 w-12 text-tf-lime mb-6" />
            <blockquote className="text-xl md:text-2xl font-medium mb-6 italic">
              "{caseStudy.testimonial.quote}"
            </blockquote>
            <div className="flex items-center gap-4">
              <div>
                <div className="font-semibold text-lg">{caseStudy.testimonial.author}</div>
                <div className="text-muted-foreground">
                  {caseStudy.testimonial.role}, {caseStudy.testimonial.company}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Key Takeaways */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Key Takeaways</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseStudy.keyTakeaways.map((takeaway, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-tf-lime flex-shrink-0 mt-0.5" />
              <p className="text-foreground">{takeaway}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-tf-navy to-tf-navy-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Achieve Similar Results for Your Property
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Book a personalized demo to see how TermFlow can transform your student lettings operation with proven automation strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90 font-semibold" data-testid="button-cta-book-demo">
              <a href="/book-demo">Book Your Free Demo</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10" data-testid="button-cta-guides">
              <a href="/knowledge-base">Read Implementation Guides</a>
            </Button>
          </div>
        </div>
      </section>

      {/* More Case Studies */}
      {otherCaseStudies.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">More Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherCaseStudies.map(cs => (
              <CaseStudyCard key={cs.slug} caseStudy={cs} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
