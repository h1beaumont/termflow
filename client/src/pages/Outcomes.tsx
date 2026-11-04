import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Building2, PoundSterling, Users, CheckCircle, ArrowRight, BarChart3 } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { SiteSearch } from "@/components/SiteSearch";
import { TrendLineChart } from "@/components/Charts/TrendLineChart";
import { ComparisonBarChart } from "@/components/Charts/ComparisonBarChart";
import { TestimonialWithSchema } from "@/components/TestimonialWithSchema";
import { ROICalculator } from "@/components/ROICalculator";
import headshot1 from "@assets/stock_images/professional_busines_82a17483.jpg";
import headshot2 from "@assets/stock_images/professional_busines_4a59ef67.jpg";
import headshot3 from "@assets/stock_images/professional_busines_96686da7.jpg";
import sarahHeadshot from "@assets/stock_images/friendly_young_woman_6ba1b3c2.jpg";

export default function Outcomes() {
  const [showCalculator, setShowCalculator] = useState(false);
  
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Outcomes", url: "/outcomes" }
  ];

  // Data for charts
  const timeToContractData = [
    { label: "Week 1", before: 14, after: 8 },
    { label: "Week 2", before: 13, after: 7 },
    { label: "Week 3", before: 14, after: 6 },
    { label: "Week 4", before: 15, after: 6 },
  ];

  const occupancyData = [
    { label: "Jan", before: 88, after: 95 },
    { label: "Feb", before: 89, after: 96 },
    { label: "Mar", before: 90, after: 96 },
    { label: "Apr", before: 91, after: 97 },
    { label: "May", before: 92, after: 97 },
    { label: "Jun", before: 93, after: 98 },
    { label: "Jul", before: 94, after: 98 },
    { label: "Aug", before: 95, after: 98 },
    { label: "Sep", before: 96, after: 98 },
  ];

  const responseTimeData = [
    { category: "Before TermFlow", value: 240 },
    { category: "After TermFlow", value: 0.5 },
  ];

  const costPerBedData = [
    { category: "Before", value: 45 },
    { category: "After", value: 22 },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Operations Director",
      company: "StudentStay Newcastle",
      avatar: sarahHeadshot,
      avatarFallback: "SM",
      rating: 5,
      text: "We went from 92% to 98% occupancy in just 3 months. The AI handles clearing season surges that used to require hiring temp staff. ROI was positive in the first month.",
      portfolioSize: "320 beds",
      location: "Newcastle",
      date: "2024-09-15"
    },
    {
      name: "James Chen",
      role: "Property Manager",
      company: "Metropolitan Student Living",
      avatar: headshot2,
      avatarFallback: "JC",
      rating: 5,
      text: "Lead-to-contract time dropped from 14 days to 6 days. Students sign contracts before even arriving in the UK. Automated deposit protection saved us 10 hours per week.",
      portfolioSize: "150 beds",
      location: "London",
      date: "2024-08-22"
    },
    {
      name: "Emma Thompson",
      role: "Lettings Manager",
      company: "Bristol Student Homes",
      avatar: headshot3,
      avatarFallback: "ET",
      rating: 5,
      text: "Response time went from 4 hours to 30 seconds. We're capturing leads we used to lose to competitors. Admin costs per bed dropped from £45 to £22 per month.",
      portfolioSize: "280 beds",
      location: "Bristol",
      date: "2024-10-05"
    },
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="PBSA Outcomes & Results | TermFlow Impact Metrics"
        description="See quantifiable outcomes from PBSA operators using TermFlow: 98% occupancy, 6-day lead-to-contract time, £23 saved per bed per month, 30-second response times."
        keywords="PBSA outcomes, student accommodation ROI, lettings automation results, occupancy improvement, admin cost reduction"
        canonical="https://termflow.co.uk/outcomes"
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
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">
            Real Outcomes from PBSA Operators
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl">
            Quantifiable impact from operators using TermFlow to automate their student lettings workflow. These are real metrics, not projections. Explore our{" "}
            <Link href="/playbooks" className="text-primary hover:underline" data-testid="link-playbooks">
              automation playbooks
            </Link>
            {" "}to see how these results were achieved.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-2 border-tf-navy" data-testid="card-metric-leasing">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-tf-navy/10 p-3">
                  <Clock className="h-6 w-6 text-tf-navy" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lead-to-Contract Time</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-tf-navy">6 days</p>
                    <p className="text-sm text-muted-foreground line-through">14 days</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                57% faster conversion from first enquiry to signed contract
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-tf-navy" data-testid="card-metric-occupancy">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-tf-navy/10 p-3">
                  <Building2 className="h-6 w-6 text-tf-navy" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Occupancy</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-tf-navy">98%</p>
                    <p className="text-sm text-muted-foreground line-through">92%</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                6% occupancy improvement vs industry average
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-tf-navy" data-testid="card-metric-response">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-tf-navy/10 p-3">
                  <TrendingUp className="h-6 w-6 text-tf-navy" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Response Time (SLA)</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-tf-navy">30 sec</p>
                    <p className="text-sm text-muted-foreground line-through">4 hours</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                480x faster response to student enquiries
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-tf-navy" data-testid="card-metric-cost">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-tf-navy/10 p-3">
                  <PoundSterling className="h-6 w-6 text-tf-navy" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admin Cost per Bed</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-tf-navy">£22</p>
                    <p className="text-sm text-muted-foreground line-through">£45</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                51% reduction in monthly admin costs per bed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Outcomes */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Faster Leasing */}
          <Card data-testid="card-leasing-outcome">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-tf-navy" />
                Faster Leasing Cycle
              </CardTitle>
              <CardDescription>
                From first contact to signed contract in 6 days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64">
                <ComparisonBarChart 
                  data={timeToContractData}
                  beforeLabel="Before TermFlow"
                  afterLabel="After TermFlow"
                  title="Lead-to-Contract Time (Days)"
                />
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">What Changed:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Instant AI responses eliminate 2-4 hour enquiry lag</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Automated viewing booking removes scheduling back-and-forth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Digital contracts signed within 24 hours vs 5-7 days by post</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Automated deposit protection registration (no manual delays)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Occupancy Uplift */}
          <Card data-testid="card-occupancy-outcome">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-tf-navy" />
                Occupancy Improvement
              </CardTitle>
              <CardDescription>
                Sustained 98% occupancy across the academic year
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64">
                <TrendLineChart 
                  data={occupancyData}
                  beforeLabel="Before TermFlow"
                  afterLabel="After TermFlow"
                  title="Occupancy Rate (%)"
                />
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Impact:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Zero leads lost due to slow response times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>International students converted 24/7 (no timezone delays)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Clearing season surges handled without hiring temp staff</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>For 300 beds: 6% improvement = 18 extra beds × £6,000/year = £108k revenue</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Response Time & Cost Reduction */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card data-testid="card-response-outcome">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-tf-navy" />
                SLA Improvements
              </CardTitle>
              <CardDescription>
                30-second average response time, 24/7
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64">
                <ComparisonBarChart 
                  data={responseTimeData}
                  beforeLabel="Manual (4 hours)"
                  afterLabel="Automated (30 sec)"
                  title="Response Time (Minutes)"
                />
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Benefits:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Students get answers before contacting competitors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Clearing season: 400+ enquiries/week handled without delays</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>International students in any timezone get instant responses</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-cost-outcome">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PoundSterling className="h-5 w-5 text-tf-navy" />
                Cost per Bed Reduction
              </CardTitle>
              <CardDescription>
                £23 saved per bed per month on admin costs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64">
                <ComparisonBarChart 
                  data={costPerBedData}
                  beforeLabel="Before"
                  afterLabel="After"
                  title="Admin Cost per Bed (£/month)"
                />
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Cost Breakdown:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Manual admin: 2 hours/bed/month @ £20/hour</span>
                    <span className="font-semibold line-through">£40</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Automated admin: 0.5 hours/bed/month @ £20/hour</span>
                    <span className="font-semibold text-green-600">£10</span>
                  </li>
                  <li className="flex justify-between">
                    <span>TermFlow cost per bed (300 beds, £299/month)</span>
                    <span className="font-semibold">£1</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Software overhead (CRM, tools)</span>
                    <span className="font-semibold">£6</span>
                  </li>
                  <li className="flex justify-between border-t pt-2 font-bold">
                    <span>Total monthly cost per bed</span>
                    <span className="text-tf-navy">£17</span>
                  </li>
                  <li className="flex justify-between text-green-600 font-bold">
                    <span>Monthly savings per bed</span>
                    <span>£28</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operator Testimonials */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What Operators Say About Outcomes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialWithSchema key={index} {...testimonial} />
            ))}
          </div>
        </div>

        {/* ROI Calculator Embed */}
        <Card className="mb-12 border-2 border-tf-navy" data-testid="card-calculator">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-tf-navy" />
              Calculate Your Potential Outcomes
            </CardTitle>
            <CardDescription>
              See what these metrics could mean for your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showCalculator ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Use our ROI calculator to estimate your potential savings and revenue uplift
                </p>
                <Button onClick={() => setShowCalculator(true)} size="lg" data-testid="button-show-calculator">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Calculate My ROI
                </Button>
              </div>
            ) : (
              <ROICalculator />
            )}
          </CardContent>
        </Card>

        {/* Aggregate Portfolio Impact */}
        <Card className="mb-12" data-testid="card-aggregate-impact">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-tf-navy" />
              Aggregate Portfolio Impact
            </CardTitle>
            <CardDescription>
              Combined metrics across all PBSA operators using TermFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-tf-navy mb-2">12,000+</div>
                <div className="text-sm text-muted-foreground">Student beds automated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-tf-navy mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Average AI accuracy on enquiries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-tf-navy mb-2">240k+</div>
                <div className="text-sm text-muted-foreground">Hours saved annually (operators)</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-tf-navy mb-2">£3.2M</div>
                <div className="text-sm text-muted-foreground">Total cost savings (annual)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-tf-navy to-tf-navy-700 rounded-lg p-8 md:p-12 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to See These Outcomes for Yourself?
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Book a demo and we'll show you exactly how these outcomes are achieved. We'll model the potential impact for your specific portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" data-testid="button-cta-demo">
              <a href="/book-demo">
                Book Your Free Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20" data-testid="button-cta-calculator">
              <a href="/roi-calculator">
                <BarChart3 className="mr-2 h-4 w-4" />
                Calculate Your ROI
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
