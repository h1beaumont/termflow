import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CaseStudySchema } from "@/components/CaseStudySchema";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";
import { Award, TrendingUp, Users, DollarSign } from "lucide-react";
import { caseStudies, getFeaturedCaseStudies } from "@/data/caseStudies";

export default function CaseStudies() {
  const featuredCaseStudies = getFeaturedCaseStudies();

  // Calculate aggregate stats from all case studies
  const totalUnits = caseStudies.reduce((sum, cs) => sum + cs.units, 0);

  return (
    <div className="min-h-screen bg-tf-bg">
      {/* Add schema.org structured data for all featured case studies */}
      {featuredCaseStudies.map(cs => (
        <CaseStudySchema key={cs.slug} caseStudy={cs} />
      ))}
      
      <SEOHead
        title="Student Accommodation Case Studies | PBSA Automation Results | TermFlow"
        description="Real results from UK PBSA operators using TermFlow. See how student accommodation providers reduced admin by 70% and increased rebooking rates. Verified case studies."
        keywords="student accommodation case studies, PBSA automation results, student lettings success stories, property automation ROI, lettings conversion improvement, AI lettings testimonials, PBSA occupancy rates, student accommodation ROI UK"
        canonical="https://termflow.co.uk/case-studies"
        ogTitle="Student Accommodation Case Studies | PBSA Automation Results | TermFlow"
        ogDescription="Real results from UK PBSA operators using TermFlow. See how student accommodation providers reduced admin by 70% and increased rebooking rates."
        ogType="website"
        ogUrl="https://termflow.co.uk/case-studies"
        twitterCard="summary_large_image"
        twitterTitle="Student Accommodation Case Studies | PBSA Automation Results | TermFlow"
        twitterDescription="Real results from UK PBSA operators. 70% admin reduction, increased rebooking rates. Verified case studies."
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
            <a href="/knowledge-base" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-knowledge-base">
              Knowledge Base
            </a>
            <a href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">
              Pricing
            </a>
            <Button variant="default" size="sm" asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90" data-testid="button-book-demo">
              <a href="/book-demo">Book Demo</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tf-navy via-tf-navy-700 to-tf-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="h-10 w-10 text-tf-lime" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Success Stories from PBSA Landlords
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Real results from student accommodation operators who transformed their business with TermFlow automation.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-tf-lime" />
                <div className="text-3xl font-bold">{totalUnits.toLocaleString()}</div>
              </div>
              <div className="text-sm text-gray-300">Total Units Managed</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-tf-lime" />
                <div className="text-3xl font-bold">+50%</div>
              </div>
              <div className="text-sm text-gray-300">Avg. Conversion Increase</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-tf-lime" />
                <div className="text-3xl font-bold">-92%</div>
              </div>
              <div className="text-sm text-gray-300">Avg. Time Saved</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-5 w-5 text-tf-lime" />
                <div className="text-3xl font-bold">98%</div>
              </div>
              <div className="text-sm text-gray-300">Avg. Occupancy Achieved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Success Stories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how PBSA operators across the UK are achieving exceptional results with TermFlow automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCaseStudies.map(caseStudy => (
            <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} featured />
          ))}
        </div>
      </section>

      {/* All Case Studies */}
      {caseStudies.length > featuredCaseStudies.length && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-8">More Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies
              .filter(cs => !cs.featured)
              .map(caseStudy => (
                <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
              ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-tf-navy to-tf-navy-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Achieve Similar Results?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join successful PBSA landlords who transformed their operations with TermFlow. Book a personalized demo to see how we can help your property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90 font-semibold" data-testid="button-cta-book-demo">
              <a href="/book-demo">Book Your Free Demo</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10" data-testid="button-cta-guides">
              <a href="/knowledge-base">Read Our Guides</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
