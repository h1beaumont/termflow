import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { GraduationCap, TrendingDown, Clock, Shield, Users, CheckCircle, Calendar, MessageSquare, FileCheck, Building2 } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function UniversityOperators() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Sectors", url: "/sectors" },
    { name: "University Operators", url: "/sectors/university-operators" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="TermFlow for University-Managed Accommodation | Purpose-Built for In-House Teams"
        description="AI automation for university accommodation offices managing 500+ beds. Handle clearing season peaks, maintain RTR compliance, and reduce admin by 40% with budget-friendly public sector pricing."
        keywords="university accommodation automation, halls of residence software, clearing season automation, student accommodation management, RTR compliance, pastoral care integration"
        canonical="https://termflow.co.uk/sectors/university-operators"
        ogUrl="https://termflow.co.uk/sectors/university-operators"
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
            <GraduationCap className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              TermFlow for University-Managed Accommodation
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            Purpose-built AI automation for in-house university accommodation teams managing halls of residence and managed properties. Scalable, compliant, and budget-friendly for public sector institutions. Explore our{" "}
            <Link href="/playbooks" className="text-primary hover:underline" data-testid="link-playbooks">
              automation playbooks
            </Link>
            {" "}designed specifically for university teams.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Badge variant="secondary" data-testid="badge-sector">University Sector</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-target-audience">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-tf-navy" />
              Who This Is For
            </CardTitle>
            <CardDescription>
              In-house university accommodation teams managing student halls and properties
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Typical Portfolio</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>500-2,000 beds across multiple halls of residence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Mix of catered and self-catered accommodation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>En-suite rooms, shared flats, studio apartments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>University-owned or head-leased properties</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Team Structure</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Accommodation office: 4-15 staff members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>On-site wardens and residence life teams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Reports to Student Services or Estates department</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Budget constraints from public sector funding</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-pain-points">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-amber-500" />
              Your Biggest Challenges
            </CardTitle>
            <CardDescription>
              What makes university accommodation management uniquely difficult
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Clearing Season Volume Peaks</h3>
                <p className="text-sm text-muted-foreground">
                  August clearing results trigger 600-800 enquiries in 48 hours. Your team of 6 can't physically respond fast enough. Students accepted through clearing need accommodation within 2 weeks. Manual processes create bottlenecks when speed is critical.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Complex Compliance Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  Right-to-Rent checks for international students with complex visa conditions. Sponsor licence compliance for Tier 4 visa holders. Data protection for under-18s. Manual tracking of compliance creates audit risks and administrative burden.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Integration with University Systems</h3>
                <p className="text-sm text-muted-foreground">
                  Student Information Systems (SIS) need accommodation data. Finance systems require payment tracking. Pastoral care teams need welfare alerts. Manual data entry across multiple systems wastes hours daily and introduces errors.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Budget Constraints</h3>
                <p className="text-sm text-muted-foreground">
                  Public sector procurement processes limit software budgets. Difficult to justify expensive enterprise systems. Need cost-effective solutions that deliver measurable ROI. Can't hire additional staff to handle peak periods.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Student Wellbeing Coordination</h3>
                <p className="text-sm text-muted-foreground">
                  Accommodation issues affect student welfare. Need to flag concerns to pastoral care teams quickly. Maintenance requests might indicate mental health issues. Manual coordination between teams delays intervention.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Parental Communication</h3>
                <p className="text-sm text-muted-foreground">
                  Parents and guarantors require detailed communication. GDPR compliance whilst managing parental inquiries. International parents in different time zones. Volume of parent queries doubles your communication workload.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-how-termflow-helps">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              How TermFlow Helps University Teams
            </CardTitle>
            <CardDescription>
              Scalable AI automation designed for 500+ bed university portfolios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Clearing Season Automation</h3>
              <p className="text-sm text-muted-foreground mb-3">
                AI agent handles 800+ enquiries in 48 hours without human intervention. Instant WhatsApp and email responses in multiple languages. Automated viewing booking synced with university calendar. Contract generation and e-signature workflow for rapid turnaround. Your team focuses on approvals and complex cases only.
              </p>
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm font-medium">Durham University Case Study</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Accommodation office managing 1,200 beds. During 2024 clearing, TermFlow handled 650 enquiries in 72 hours with 98% occupancy achieved. Team saved 25 hours/week during peak season, allowing focus on pastoral care coordination.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">RTR & Compliance Automation</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Automated Right-to-Rent checks with visa validation for international students. Sponsor licence compliance tracking for Tier 4 visa holders. BRP and visa expiry monitoring with automatic alerts. GDPR-compliant document storage with audit trail. Reduces compliance admin by 15 hours/week.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">University System Integration</h3>
              <p className="text-sm text-muted-foreground mb-3">
                API integration with Student Information Systems (SIS). Automatic accommodation data sync to finance systems. Pastoral care alert workflow for welfare concerns. Eliminates manual data entry across systems. Real-time occupancy reporting for senior management.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Maintenance Coordination</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Students report issues via WhatsApp with photo upload. AI triage categorises urgency and routes to correct team. Integration with estates helpdesk systems. Automatic follow-up and satisfaction surveys. Flags recurring issues for pastoral care intervention.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-use-cases">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-tf-navy" />
              Key Use Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Clearing Season Enquiry Surge</h3>
                <p className="text-sm text-muted-foreground">Handle 600+ enquiries in 48 hours with instant responses, automated viewing booking, and rapid contract generation for students accepted through clearing.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">International Student Onboarding</h3>
                <p className="text-sm text-muted-foreground">Multilingual AI assistant, visa document collection, RTR compliance automation, and parent communication coordination for 50%+ international cohorts.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Pastoral Care Integration</h3>
                <p className="text-sm text-muted-foreground">Automatic alerts to student services for welfare concerns, maintenance issue patterns indicating wellbeing problems, and coordinated support interventions.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Retention & Re-Application</h3>
                <p className="text-sm text-muted-foreground">Automated renewal invitations for returning students, priority booking for current residents, and room swap coordination during academic year.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-metrics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              Success Metrics
            </CardTitle>
            <CardDescription>
              Results from university accommodation teams using TermFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">98%</div>
                <div className="text-sm text-muted-foreground mt-1">Occupancy in clearing</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">40%</div>
                <div className="text-sm text-muted-foreground mt-1">Admin reduction</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">25hrs</div>
                <div className="text-sm text-muted-foreground mt-1">Saved per week (clearing)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-pricing">
          <CardHeader>
            <CardTitle>University Sector Pricing</CardTitle>
            <CardDescription>Budget-friendly for public sector institutions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              TermFlow offers dedicated public sector pricing for universities, recognising budget constraints and procurement requirements. Volume discounts for 500+ bed portfolios. Flexible payment terms compatible with university finance cycles.
            </p>
            <Button asChild size="lg" data-testid="button-cta-demo">
              <a href="/book-demo">Book a Demo - University Pricing Available</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
