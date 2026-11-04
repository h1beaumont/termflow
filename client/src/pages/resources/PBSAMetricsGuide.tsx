import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { BarChart3, TrendingUp, DollarSign, Users, Heart, CheckCircle, Download } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function PBSAMetricsGuide() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Resources", url: "/resources" },
    { name: "PBSA Metrics Guide", url: "/resources/pbsa-metrics-guide" }
  ];

  const metrics = {
    occupancy: [
      { name: "Occupancy Rate", definition: "% of beds occupied vs total beds", calculation: "(Occupied Beds / Total Beds) × 100", benchmark: "95-98% (peak season)", improve: "Faster lead response, better booking experience" },
      { name: "Void Rate", definition: "% of beds empty during academic year", calculation: "(Empty Beds / Total Beds) × 100", benchmark: "2-5% (acceptable void)", improve: "Early bird bookings, retention campaigns" },
      { name: "RevPAB (Revenue Per Available Bed)", definition: "Revenue generated per bed (occupied or not)", calculation: "Total Revenue / Total Beds", benchmark: "£6,500-£9,500/year London, £4,500-£6,500 regional", improve: "Reduce voids, optimize pricing" }
    ],
    conversion: [
      { name: "Lead-to-Contract Conversion", definition: "% of leads that become tenants", calculation: "(Signed Contracts / Total Leads) × 100", benchmark: "15-25% (varies by source)", improve: "Faster response times, better qualification" },
      { name: "Viewing-to-Application Rate", definition: "% of viewings that result in applications", calculation: "(Applications / Viewings) × 100", benchmark: "40-60%", improve: "Better property presentation, follow-up" },
      { name: "Application-to-Contract Rate", definition: "% of applications that complete contract", calculation: "(Contracts / Applications) × 100", benchmark: "65-80%", improve: "Simpler contract process, deposit flexibility" }
    ],
    operations: [
      { name: "Average Response Time", definition: "Time from enquiry to first response", calculation: "Sum of response times / Number of enquiries", benchmark: "< 2 hours (best practice: < 15 minutes)", improve: "AI automation, WhatsApp instant response" },
      { name: "Maintenance Resolution Time", definition: "Time from report to issue resolved", calculation: "Sum of resolution times / Number of issues", benchmark: "< 48 hours non-emergency, < 4 hours emergency", improve: "Better triage, contractor management" },
      { name: "Contract Processing Time", definition: "Days from application to signed contract", calculation: "Average days per contract", benchmark: "3-7 days", improve: "Digital contracts, automated document collection" }
    ],
    satisfaction: [
      { name: "Net Promoter Score (NPS)", definition: "Would students recommend your accommodation?", calculation: "% Promoters - % Detractors", benchmark: "40-60 (good), 60+ (excellent)", improve: "Better service, faster issue resolution" },
      { name: "Student Satisfaction Score", definition: "Overall satisfaction rating", calculation: "Average rating from surveys", benchmark: "4.2-4.6 / 5.0", improve: "Regular feedback loops, act on concerns" },
      { name: "Renewal Rate", definition: "% of students who renew for next year", calculation: "(Renewals / Total Current Tenants) × 100", benchmark: "25-40% (postgrad-heavy areas)", improve: "Early renewal incentives, good service" }
    ],
    marketing: [
      { name: "Cost Per Lead", definition: "Marketing spend per enquiry generated", calculation: "Total Marketing Spend / Number of Leads", benchmark: "£15-£35 per lead", improve: "Better targeting, organic channels" },
      { name: "Cost Per Acquisition", definition: "Total cost to acquire one tenant", calculation: "Total Sales & Marketing Costs / Number of Contracts", benchmark: "£80-£150 per tenant", improve: "Optimize conversion funnel, reduce CAC" },
      { name: "Lead Source ROI", definition: "Which channels deliver best value?", calculation: "Revenue from channel / Cost of channel", benchmark: "3:1 minimum (good: 5:1+)", improve: "Double down on best channels, cut poor performers" }
    ]
  };

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="Complete Guide to PBSA Metrics & KPIs | TermFlow Resource Library"
        description="Comprehensive PBSA metrics guide covering occupancy, financial, operations, student satisfaction, and marketing KPIs. Includes industry benchmarks, calculation methods, and improvement strategies. Free spreadsheet template."
        keywords="PBSA metrics, student accommodation KPIs, occupancy rate, RevPAB, NPS student housing, PBSA benchmarks, property management metrics"
        canonical="https://termflow.co.uk/resources/pbsa-metrics-guide"
        ogUrl="https://termflow.co.uk/resources/pbsa-metrics-guide"
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
            <BarChart3 className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              Complete Guide to PBSA Metrics & KPIs
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            The definitive guide to student accommodation metrics. Track occupancy, financial performance, operational efficiency, student satisfaction, and marketing ROI. Includes industry benchmarks and actionable improvement strategies.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Badge variant="secondary" data-testid="badge-category">Resource Guide</Badge>
            <Badge variant="default" data-testid="badge-length">15-minute read</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-download-template">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-tf-navy" />
              Free PBSA Metrics Tracking Spreadsheet
            </CardTitle>
            <CardDescription>
              Download our ready-to-use Excel template for tracking all metrics in this guide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Pre-configured formulas for 25+ PBSA metrics. Track monthly performance, compare against benchmarks, and visualize trends with built-in charts. Compatible with Excel and Google Sheets.
            </p>
            <Button asChild size="lg" data-testid="button-download-template">
              <a href="/book-demo">Download Free Template (Email Required)</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-occupancy-metrics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tf-navy" />
              Occupancy & Revenue Metrics
            </CardTitle>
            <CardDescription>
              Core financial health indicators for PBSA operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {metrics.occupancy.map((metric, index) => (
                <div key={index} className="border-l-4 border-l-tf-navy pl-4">
                  <h3 className="font-semibold text-lg mb-2">{metric.name}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1"><strong>Definition:</strong> {metric.definition}</p>
                      <p className="text-muted-foreground"><strong>Calculation:</strong> {metric.calculation}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1"><strong>Industry Benchmark:</strong> {metric.benchmark}</p>
                      <p className="text-green-700 dark:text-green-400"><strong>How to Improve:</strong> {metric.improve}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-conversion-metrics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Conversion Funnel Metrics
            </CardTitle>
            <CardDescription>
              Track performance at each stage of the letting funnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {metrics.conversion.map((metric, index) => (
                <div key={index} className="border-l-4 border-l-green-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">{metric.name}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1"><strong>Definition:</strong> {metric.definition}</p>
                      <p className="text-muted-foreground"><strong>Calculation:</strong> {metric.calculation}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1"><strong>Industry Benchmark:</strong> {metric.benchmark}</p>
                      <p className="text-green-700 dark:text-green-400"><strong>How to Improve:</strong> {metric.improve}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-operations-metrics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Operational Efficiency Metrics
            </CardTitle>
            <CardDescription>
              Measure speed and quality of operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {metrics.operations.map((metric, index) => (
                <div key={index} className="border-l-4 border-l-blue-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">{metric.name}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1"><strong>Definition:</strong> {metric.definition}</p>
                      <p className="text-muted-foreground"><strong>Calculation:</strong> {metric.calculation}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1"><strong>Industry Benchmark:</strong> {metric.benchmark}</p>
                      <p className="text-green-700 dark:text-green-400"><strong>How to Improve:</strong> {metric.improve}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-satisfaction-metrics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-600" />
              Student Satisfaction Metrics
            </CardTitle>
            <CardDescription>
              Track happiness, retention, and recommendation likelihood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {metrics.satisfaction.map((metric, index) => (
                <div key={index} className="border-l-4 border-l-pink-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">{metric.name}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1"><strong>Definition:</strong> {metric.definition}</p>
                      <p className="text-muted-foreground"><strong>Calculation:</strong> {metric.calculation}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1"><strong>Industry Benchmark:</strong> {metric.benchmark}</p>
                      <p className="text-green-700 dark:text-green-400"><strong>How to Improve:</strong> {metric.improve}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-marketing-metrics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Marketing & Acquisition Metrics
            </CardTitle>
            <CardDescription>
              Measure marketing efficiency and channel performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {metrics.marketing.map((metric, index) => (
                <div key={index} className="border-l-4 border-l-purple-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">{metric.name}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1"><strong>Definition:</strong> {metric.definition}</p>
                      <p className="text-muted-foreground"><strong>Calculation:</strong> {metric.calculation}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1"><strong>Industry Benchmark:</strong> {metric.benchmark}</p>
                      <p className="text-green-700 dark:text-green-400"><strong>How to Improve:</strong> {metric.improve}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-termflow-metrics">
          <CardHeader>
            <CardTitle>How TermFlow Improves Your Metrics</CardTitle>
            <CardDescription>
              Direct impact on key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Occupancy & Revenue
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Occupancy Rate: +3-5% improvement from faster response times</li>
                  <li>• Void Rate: -2-3% reduction from better conversion</li>
                  <li>• RevPAB: +5-8% from reduced voids and faster lease-up</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Conversion Funnel
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Lead-to-Contract: +8-12% from instant responses</li>
                  <li>• Viewing-to-Application: +10-15% from better follow-up</li>
                  <li>• Application-to-Contract: +12-18% from simpler process</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Operations
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Average Response Time: From 2+ hours to 60 seconds</li>
                  <li>• Contract Processing: From 7 days to 3 days</li>
                  <li>• Admin Time: -40% reduction (20+ hours/week saved)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Satisfaction & Marketing
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• NPS: +8-12 points from better service</li>
                  <li>• Satisfaction Score: +0.3-0.5 from faster resolution</li>
                  <li>• Cost Per Acquisition: -20-30% from higher conversion</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-review-framework">
          <CardHeader>
            <CardTitle>Quarterly Metrics Review Framework</CardTitle>
            <CardDescription>
              How to conduct effective performance reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Month 1: Data Collection</h3>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Gather all metrics from systems (CRM, finance, surveys)</li>
                  <li>Calculate each KPI using formulas in this guide</li>
                  <li>Document any data quality issues or gaps</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Month 2: Analysis</h3>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Compare current performance vs benchmarks</li>
                  <li>Identify trends (improving, declining, stable)</li>
                  <li>Pinpoint underperforming areas requiring attention</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Month 3: Action Planning</h3>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Set improvement targets for next quarter</li>
                  <li>Assign ownership for each initiative</li>
                  <li>Implement changes (automation, process improvements, training)</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <p className="text-sm font-medium mb-2">Review Meeting Agenda Template</p>
                <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Review occupancy & revenue metrics (15 min)</li>
                  <li>Analyze conversion funnel performance (15 min)</li>
                  <li>Discuss operations efficiency (10 min)</li>
                  <li>Review student satisfaction scores (10 min)</li>
                  <li>Evaluate marketing ROI (10 min)</li>
                  <li>Set targets and actions for next quarter (15 min)</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-cta">
          <CardHeader>
            <CardTitle>Track These Metrics Automatically with TermFlow</CardTitle>
            <CardDescription>
              Real-time dashboards with all KPIs in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              TermFlow automatically tracks response times, conversion rates, occupancy, and satisfaction scores. See all metrics in real-time dashboards. No manual spreadsheet entry required.
            </p>
            <div className="flex gap-3">
              <Button asChild size="lg" data-testid="button-cta-demo">
                <a href="/book-demo">Book a Demo - See Live Dashboards</a>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-download-template2">
                <a href="/book-demo">Download Free Spreadsheet Template</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
