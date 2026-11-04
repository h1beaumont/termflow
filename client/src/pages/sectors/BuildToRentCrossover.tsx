import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Building2, TrendingUp, Users, CheckCircle, Calendar, UserCheck, Zap, FileText } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function BuildToRentCrossover() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Sectors", url: "/sectors" },
    { name: "Build-to-Rent Crossover", url: "/sectors/build-to-rent-crossover" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="TermFlow for Build-to-Rent with Student Tenants | BTR + Student Expertise"
        description="Student-specific automation layered on your BTR operations. Handle academic calendar cycles, guarantor workflows, and group bookings. Achieve 97% student occupancy whilst maintaining BTR standards."
        keywords="BTR student accommodation, build to rent student housing, student co-living automation, BTR automation, mixed-use BTR"
        canonical="https://termflow.co.uk/sectors/build-to-rent-crossover"
        ogUrl="https://termflow.co.uk/sectors/build-to-rent-crossover"
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
              TermFlow for Build-to-Rent Operators with Student Tenants
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            Student-specific automation layered on your BTR operations. Handle academic calendar cycles, guarantor workflows, and younger demographic communication preferences without disrupting your core BTR processes. See how{" "}
            <Link href="/personas/pbsa-operators" className="text-primary hover:underline" data-testid="link-pbsa-operators">
              PBSA operators
            </Link>
            {" "}use our{" "}
            <Link href="/playbooks/tenant-onboarding-automation" className="text-primary hover:underline" data-testid="link-tenant-onboarding-automation">
              tenant onboarding automation
            </Link>
            .
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Badge variant="secondary" data-testid="badge-sector">BTR/Mixed-Use</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-target-audience">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-tf-navy" />
              Who This Is For
            </CardTitle>
            <CardDescription>
              BTR operators adding student accommodation or operating mixed-use buildings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Your Situation</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Core BTR portfolio (young professionals)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Adding 100-500 bed student block or floors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Student co-living spaces targeting postgrads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Mixed buildings (students + young professionals)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Your Challenge</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Students operate on different cycle than professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Peak letting season is August-September, not year-round</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>WhatsApp-first communication vs email for professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Guarantor requirements different from professional tenants</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-pain-points">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              Why Student Tenants Are Different
            </CardTitle>
            <CardDescription>
              Challenges BTR operators face when adding student blocks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Peak Seasonality</h3>
                <p className="text-sm text-muted-foreground">
                  Your professional BTR units lease year-round. But student blocks receive 80% of enquiries in June-September. Your team isn't sized for 200 student enquiries per week during clearing. Can't justify hiring temporary staff for 2-month peak.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Communication Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Gen Z students expect WhatsApp responses, not email. They message at midnight expecting instant replies. Your BTR resident portal doesn't work for student demographic. Email-first approach loses you bookings to WhatsApp-first competitors.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Guarantor Workflows</h3>
                <p className="text-sm text-muted-foreground">
                  Students need guarantors (usually parents), professionals don't. Guarantor forms, credit checks, and communication add complexity. Parents in Hong Kong, Nigeria, or India need timezone-appropriate communication. Your BTR systems don't handle this workflow.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Group Bookings</h3>
                <p className="text-sm text-muted-foreground">
                  Students want to live with friends - group bookings of 4-8 people. Your BTR system designed for individual applicants. Coordinating 6 separate applications for one flat is administrative nightmare. Groups abandon if process is too complex.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Academic Calendar Alignment</h3>
                <p className="text-sm text-muted-foreground">
                  Student tenancies start September, end June/July. Different from 12-month professional leases. Need to handle summer sub-lets or accept vacancy. Lease dates tied to university term dates, not calendar months.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Different Approval Criteria</h3>
                <p className="text-sm text-muted-foreground">
                  Can't credit check students (no income). Rely on university acceptance letters and guarantor checks instead. Your BTR affordability criteria don't work for students. Need separate approval workflow without reinventing entire system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-how-termflow-helps">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              Student Automation Layered on BTR
            </CardTitle>
            <CardDescription>
              Keep your BTR systems, add student-specific workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Dual Workflow System</h3>
              <p className="text-sm text-muted-foreground mb-3">
                TermFlow integrates with your BTR property management system. Professional tenants continue through your existing process. Student enquiries automatically routed to student-specific workflows. One platform, two distinct experiences optimised for each demographic.
              </p>
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm font-medium">BTR Operator Case Study</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Large BTR operator added 200-bed student block to existing 800-unit professional portfolio. TermFlow handled student workflows (WhatsApp, guarantors, group bookings) whilst BTR system handled professional tenants. Achieved 97% student occupancy by September. Zero impact on core BTR operations. "We didn't need to retrain staff or change systems - TermFlow just handles the student complexity."
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">WhatsApp-First for Students, Email for Professionals</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Students get instant WhatsApp responses 24/7. Professional enquiries handled via email and resident portal as normal. AI detects enquiry type and routes appropriately. No manual triage required.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Guarantor Workflow Automation</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Automated guarantor forms sent to parents. Timezone-appropriate communication (emails sent at 9 AM parent's local time). DocuSign integration for guarantor agreement signatures. Progress tracking for student + guarantor completion.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Group Booking Coordination</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Students indicate they want to live with friends. System creates linked applications for the group. Tracks completion status for all 6 members. Holds rooms until entire group confirmed. One-click approval for complete groups.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Academic Calendar Intelligence</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Knows term dates for 50+ UK universities. Suggests appropriate lease start/end dates based on student's university. Handles September-June contracts vs 12-month professional leases. Automated renewal invitations in April for next academic year.
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
                <h3 className="font-semibold">Clearing Season Surge</h3>
                <p className="text-sm text-muted-foreground">Handle 200+ student enquiries per week in August-September without scaling your BTR team. AI automation manages peak season whilst staff focus on professional lettings.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Mixed-Use Buildings</h3>
                <p className="text-sm text-muted-foreground">Floors 1-10 for professionals, floors 11-15 for students. Different workflows for different demographics in same building. Unified reporting for NOI optimisation.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Postgraduate Co-Living</h3>
                <p className="text-sm text-muted-foreground">Target 22-28 age group with student-style flexibility but BTR amenities. Academic calendar alignment with professional-grade facilities and service.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">International Student Onboarding</h3>
                <p className="text-sm text-muted-foreground">Multilingual AI handles 50%+ international students. Visa document collection, sponsor licence compliance, and RTR checks automated. Parents communicated with in appropriate timezones.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-metrics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Success Metrics
            </CardTitle>
            <CardDescription>
              Results from BTR operators adding student blocks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">97%</div>
                <div className="text-sm text-muted-foreground mt-1">Student occupancy</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">6 days</div>
                <div className="text-sm text-muted-foreground mt-1">Lead to contract</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">Zero</div>
                <div className="text-sm text-muted-foreground mt-1">Impact on BTR ops</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-cta">
          <CardHeader>
            <CardTitle>BTR + Student Expertise</CardTitle>
            <CardDescription>Talk to our team about student-specific automation for BTR</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              We understand both BTR operations and student accommodation workflows. Let us show you how TermFlow handles student complexity whilst integrating with your BTR systems.
            </p>
            <Button asChild size="lg" data-testid="button-cta-demo">
              <a href="/book-demo">Book a Demo - BTR + Student Expertise</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
