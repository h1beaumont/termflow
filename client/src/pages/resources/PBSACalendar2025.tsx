import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Calendar, Clock, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function PBSACalendar2025() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Resources", url: "/resources" },
    { name: "PBSA Calendar 2025", url: "/resources/pbsa-calendar-2025" }
  ];

  const periods = [
    {
      month: "September-November 2024",
      title: "Retention Season",
      priority: "High",
      volume: "Low",
      description: "Focus on retaining current tenants for next academic year. Early bird bookings from returning students.",
      automate: ["Automated renewal invitations to current tenants", "Early bird discount campaigns via WhatsApp", "Room swap requests automation", "Retention offer tracking"],
      prep: ["Set early bird pricing and deadlines", "Prepare renewal contract templates", "Configure retention discount workflows", "Train team on retention strategies"],
      kpis: ["Retention rate (target: 30-40%)", "Early bird conversion rate", "Time to renewal decision"]
    },
    {
      month: "December 2024-February 2025",
      title: "Clearing Prep & Early Bookings",
      priority: "Medium",
      volume: "Growing",
      description: "Prepare systems for clearing season surge. Handle early applicants who have conditional offers.",
      automate: ["Conditional offer tracking and follow-up", "Automated viewing booking for university open days", "Document collection workflows prep", "Early payment processing"],
      prep: ["Test all automated workflows at scale", "Update property availability in all systems", "Prepare clearing season staff schedule", "Configure surge capacity settings"],
      kpis: ["Early booking conversion rate", "System response time", "Workflow success rate"]
    },
    {
      month: "March-April 2025",
      title: "Peak Clearing Season",
      priority: "Critical",
      volume: "Very High (400+ enquiries/week)",
      description: "UCAS clearing results trigger massive enquiry surge. Speed is critical - students book within 24-48 hours of offer.",
      automate: ["Instant WhatsApp/email responses (60-second SLA)", "Automated viewing slot booking", "Contract generation and e-signature", "Deposit payment links", "Automated follow-ups for incomplete applications"],
      prep: ["Scale AI capacity for 10x normal volume", "Prepare clearing season playbook for team", "Set up real-time dashboard monitoring", "Brief team on escalation protocols"],
      kpis: ["Response time (target: < 60 seconds)", "Viewing booking rate", "Clearing conversion rate (target: 18-25%)", "Occupancy by end of April"]
    },
    {
      month: "May-June 2025",
      title: "Late Availabilities & Document Push",
      priority: "High",
      volume: "Medium",
      description: "Fill last remaining rooms. Chase outstanding documents and deposits from students who booked in March-April.",
      automate: ["Late availability remarketing campaigns", "Document chase automation (progressively urgent)", "Deposit reminder workflows", "Guarantor form completion nudges"],
      prep: ["Identify and market last remaining rooms", "Configure escalation paths for non-responders", "Prepare last-minute discount strategy", "Set RTR compliance deadlines"],
      kpis: ["Final occupancy rate (target: 95-98%)", "Document completion rate", "Outstanding deposit collection"]
    },
    {
      month: "July-August 2025",
      title: "Move-In Coordination & Final Prep",
      priority: "Medium",
      volume: "Low",
      description: "Coordinate move-in logistics. Handle last-minute bookings from international students arriving late.",
      automate: ["Move-in appointment booking", "Key collection reminders", "Welcome pack distribution", "International student late bookings"],
      prep: ["Finalize room allocations", "Prepare welcome packs and keys", "Brief maintenance team on turnaround schedule", "Configure move-in day automation"],
      kpis: ["Smooth move-in rate (no issues)", "International late bookings", "Final occupancy confirmation"]
    },
    {
      month: "September 2025",
      title: "New Intake & Onboarding Peak",
      priority: "High",
      volume: "High",
      description: "Students move in. Focus shifts to resident onboarding, maintenance requests, and next year's retention planning.",
      automate: ["Maintenance request triage", "Welcome and onboarding communications", "Early retention planning for next year", "Satisfaction surveys"],
      prep: ["Test maintenance workflow automation", "Prepare onboarding sequence", "Configure satisfaction survey automation", "Plan retention strategy for 2025-26"],
      kpis: ["Maintenance resolution time", "Onboarding satisfaction score", "Early retention interest"]
    }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="PBSA Automation Calendar 2025-26: When to Implement What | TermFlow"
        description="Complete PBSA automation calendar for 2025-26 academic year. Month-by-month breakdown of clearing season prep, peak periods, and automation implementation timeline. Get ready for 400+ enquiries/week during clearing."
        keywords="PBSA calendar 2025, clearing season timeline, student accommodation automation calendar, UCAS clearing dates, PBSA seasonal planning"
        canonical="https://termflow.co.uk/resources/pbsa-calendar-2025"
        ogUrl="https://termflow.co.uk/resources/pbsa-calendar-2025"
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
            <Calendar className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              The PBSA Automation Calendar: When to Implement What in 2025-26
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            Month-by-month automation strategy for the 2025-26 academic year. Know exactly what to automate when, how to prepare for clearing season, and when to implement TermFlow for maximum impact.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Badge variant="secondary" data-testid="badge-category">Resource Guide</Badge>
            <Badge variant="default" data-testid="badge-length">12-minute read</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-overview">
          <CardHeader>
            <CardTitle>PBSA Season at a Glance</CardTitle>
            <CardDescription>
              Understanding the annual cycle of student accommodation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-amber-600">Sep-Nov</div>
                <div className="text-sm text-muted-foreground mt-1">Retention</div>
                <div className="text-xs text-muted-foreground mt-2">Focus on keeping current tenants</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">Dec-Feb</div>
                <div className="text-sm text-muted-foreground mt-1">Early Bookings</div>
                <div className="text-xs text-muted-foreground mt-2">Conditional offers & prep</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center border-2 border-tf-navy">
                <div className="text-2xl font-bold text-tf-navy">Mar-Apr</div>
                <div className="text-sm text-muted-foreground mt-1">PEAK CLEARING</div>
                <div className="text-xs text-muted-foreground mt-2">400+ enquiries/week</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">May-Jun</div>
                <div className="text-sm text-muted-foreground mt-1">Final Push</div>
                <div className="text-xs text-muted-foreground mt-2">Last rooms & docs</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">Jul-Aug</div>
                <div className="text-sm text-muted-foreground mt-1">Move-In Prep</div>
                <div className="text-xs text-muted-foreground mt-2">Logistics & late bookings</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-pink-600">Sep</div>
                <div className="text-sm text-muted-foreground mt-1">Onboarding</div>
                <div className="text-xs text-muted-foreground mt-2">Move-in & next year retention</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {periods.map((period, index) => (
          <Card key={index} className="mb-6" data-testid={`card-period-${index}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-tf-navy" />
                    {period.month}
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold mt-1">
                    {period.title}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={period.priority === "Critical" ? "destructive" : period.priority === "High" ? "default" : "secondary"} data-testid={`badge-priority-${index}`}>
                    {period.priority} Priority
                  </Badge>
                  <Badge variant="outline" data-testid={`badge-volume-${index}`}>
                    {period.volume} Volume
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-muted-foreground">{period.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      What to Automate
                    </h3>
                    <ul className="space-y-2">
                      {period.automate.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      Preparation Checklist
                    </h3>
                    <ul className="space-y-2">
                      {period.prep.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Key Success Metrics</h4>
                  <div className="flex flex-wrap gap-2">
                    {period.kpis.map((kpi, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {kpi}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="mb-8" data-testid="card-clearing-deep-dive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-tf-navy" />
              Clearing Season Deep Dive: Week-by-Week Strategy
            </CardTitle>
            <CardDescription>
              March-April 2025 is your make-or-break period. Here's how to dominate clearing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-l-tf-navy pl-4">
                <h3 className="font-semibold mb-2">Weeks 1-2 (Early March): Pre-Clearing Surge</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Conditional offer holders start enquiring. Volume: 50-100 enquiries/week.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• AI handles instant responses whilst you focus on high-value leads</li>
                  <li>• Automated conditional offer tracking (if Grade A achieved = auto-contract)</li>
                  <li>• Early bird discount campaigns to secure commitments</li>
                </ul>
              </div>

              <div className="border-l-4 border-l-amber-500 pl-4">
                <h3 className="font-semibold mb-2">Weeks 3-4 (Mid-March): Clearing Begins</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  UCAS main round results. Volume spikes to 200-300 enquiries/week.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 60-second WhatsApp response SLA critical (students booking same day)</li>
                  <li>• Automated viewing slot booking preventing double-bookings</li>
                  <li>• Contract generation within 4 hours of viewing completion</li>
                </ul>
              </div>

              <div className="border-l-4 border-l-red-500 pl-4">
                <h3 className="font-semibold mb-2">Weeks 5-8 (Late March-April): PEAK CLEARING</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Absolute peak. Volume: 400-600 enquiries/week. Team at breaking point without automation.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• AI handles 95% of routine enquiries automatically</li>
                  <li>• Real-time occupancy dashboard shows which rooms filling fast</li>
                  <li>• Automated follow-ups for incomplete applications (24h, 48h, 72h)</li>
                  <li>• Team focuses only on complex cases and approvals</li>
                </ul>
              </div>

              <div className="border-l-4 border-l-green-600 pl-4">
                <h3 className="font-semibold mb-2">Weeks 9-10 (Late April): Post-Clearing Wind-Down</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Volume drops to 50-100/week. Focus shifts to filling last rooms and chasing docs.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Automated remarketing of last remaining rooms</li>
                  <li>• Document completion chase automation (progressively urgent)</li>
                  <li>• Deposit reminder workflows with payment link nudges</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-implementation-timeline">
          <CardHeader>
            <CardTitle>TermFlow Implementation Timeline</CardTitle>
            <CardDescription>
              When to start TermFlow to be ready for clearing season
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Ideal Timeline: Start in January 2025
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                  Gives you 8-10 weeks to set up, test, and optimize before clearing peak in March-April.
                </p>
                <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-24">Week 1-2:</span>
                    <span>TermFlow setup, system integration, data migration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-24">Week 3-4:</span>
                    <span>Team training, workflow testing, AI agent fine-tuning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-24">Week 5-6:</span>
                    <span>Soft launch with 25% of enquiries, monitoring and optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-24">Week 7-8:</span>
                    <span>Full launch at 100% capacity, ready for clearing surge</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Acceptable: Start in February 2025
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Tighter timeline but still achievable. 4-6 weeks for setup and testing before clearing. Requires faster decision-making and dedicated implementation focus.
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-900">
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Risky: Starting After March 2025
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200">
                  You'll miss the main clearing surge. Consider implementing now for next year, or focus on late availabilities (May-June) and start planning for 2025-26 cycle.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-cta">
          <CardHeader>
            <CardTitle>Get Ready for 2025 Clearing Season</CardTitle>
            <CardDescription>Book a demo to see how TermFlow handles clearing season automation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              See live demos of clearing season workflows: instant WhatsApp responses, automated viewing booking, contract generation, and real-time occupancy dashboards. We'll show you exactly how TermFlow handles 400+ enquiries/week.
            </p>
            <Button asChild size="lg" data-testid="button-cta-demo">
              <a href="/book-demo">Get Ready for 2025 Clearing - Book a Demo</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
