import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Database, Zap, Link as LinkIcon, CheckCircle, TrendingDown, Clock, RefreshCw, Shield } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function CRMHeavyTeams() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Sectors", url: "/sectors" },
    { name: "CRM-Heavy Teams", url: "/sectors/crm-heavy-teams" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="TermFlow for Operators Using StarRez, Kinetic & Student CRMs | CRM Integration"
        description="Layer AI automation on top of StarRez, Kinetic, and other student CRMs. Automate communications and workflows whilst keeping your CRM. 60% reduction in manual data entry. Bidirectional sync."
        keywords="StarRez automation, Kinetic CRM integration, student accommodation CRM, PBSA software integration, automated lead entry"
        canonical="https://termflow.co.uk/sectors/crm-heavy-teams"
        ogUrl="https://termflow.co.uk/sectors/crm-heavy-teams"
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
            <Database className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              TermFlow for Operators Using StarRez, Kinetic & Student CRMs
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            Layer AI automation on top of your existing student accommodation CRM. Keep StarRez, Kinetic, or your preferred system - TermFlow automates communications and workflows that your CRM doesn't handle. See our{" "}
            <Link href="/automation-ideas" className="text-primary hover:underline" data-testid="link-automation-ideas">
              automation ideas library
            </Link>
            {" "}for what you can automate alongside your CRM.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Badge variant="secondary" data-testid="badge-sector">CRM Integration</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-target-audience">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-tf-navy" />
              Who This Is For
            </CardTitle>
            <CardDescription>
              Operators already using student accommodation CRM systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Your Current Setup</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Using StarRez, Kinetic, or similar student CRM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Invested heavily in CRM setup and training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>CRM holds all your critical data and history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Not willing to rip-and-replace entire system</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Your Frustration</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>CRM doesn't automate student communications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Still manually entering leads into CRM daily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>WhatsApp enquiries live outside your CRM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Team spends hours on CRM admin tasks</span>
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
              Why Your CRM Isn't Enough
            </CardTitle>
            <CardDescription>
              What student accommodation CRMs don't do well
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">No Communication Automation</h3>
                <p className="text-sm text-muted-foreground">
                  StarRez and Kinetic store data beautifully but don't send automated WhatsApp responses. Can't handle instant enquiry responses at 2 AM. You're still manually responding to every single lead despite having a £15k/year CRM.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Manual Lead Entry Bottleneck</h3>
                <p className="text-sm text-muted-foreground">
                  Every Rightmove, Zoopla, and website enquiry must be manually typed into CRM. Copy-pasting name, email, phone, preferences takes 3 minutes per lead. At 50 leads/day, that's 12.5 hours per week of pure data entry.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">System Silos</h3>
                <p className="text-sm text-muted-foreground">
                  WhatsApp conversations live in WhatsApp. Email in Outlook. CRM data in StarRez. No single view of student journey. Staff waste time checking 3 systems to see if student already responded.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Limited Workflow Automation</h3>
                <p className="text-sm text-muted-foreground">
                  CRM doesn't trigger viewing reminders, follow-ups, or contract generation automatically. You can track that student didn't sign contract, but someone still has to manually chase them. Workflow orchestration is manual.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Poor Student Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Students don't care that you have a fancy CRM. They want WhatsApp responses in 60 seconds. Your CRM can't deliver that. You're losing bookings because your response time is 4 hours when competitors respond in 2 minutes.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Integration Complexity</h3>
                <p className="text-sm text-muted-foreground">
                  CRM vendor quoted £20k for custom WhatsApp integration. Implementation timeline is 6 months. You need automation now for this year's clearing season, not next year.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-how-termflow-helps">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              TermFlow Sits On Top of Your CRM
            </CardTitle>
            <CardDescription>
              Keep your CRM, add automation layer for communications and workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Bidirectional CRM Sync</h3>
              <p className="text-sm text-muted-foreground mb-3">
                TermFlow connects to StarRez or Kinetic via API. Every enquiry captured by TermFlow automatically creates a lead in your CRM. Updates flow both ways - if student responds via WhatsApp, CRM record updates automatically. If staff updates CRM, TermFlow sees the change. One source of truth, zero manual data entry.
              </p>
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm font-medium">Kinetic User Case Study</p>
                <p className="text-sm text-muted-foreground mt-1">
                  PBSA operator with 650 beds using Kinetic CRM. Team spent 12 hours/week manually entering leads from portals into Kinetic. TermFlow integration eliminated manual entry entirely. All enquiries auto-sync to Kinetic with full conversation history. Staff now use time for strategic work instead of data entry. "We kept our CRM investment but added the automation it was missing."
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Automated Communications Your CRM Can't Do</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Instant WhatsApp responses 24/7. Automated viewing reminders 24h and 2h before appointment. Post-viewing follow-ups asking for feedback. Contract signing nudges at 24h and 72h. All automated communications whilst keeping CRM as central data repository.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Workflow Orchestration</h3>
              <p className="text-sm text-muted-foreground mb-3">
                TermFlow reads CRM status (e.g., "viewing completed, no application yet") and triggers appropriate automation (follow-up message, application link reminder). Orchestrates multi-step workflows using CRM data without requiring CRM to be workflow engine.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Unified Conversation History</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Every WhatsApp, email, and web chat message synced to CRM lead record. Staff see complete timeline in CRM even if conversation happened on WhatsApp. No more checking multiple systems - CRM remains single source of truth.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-integrations">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-tf-navy" />
              CRM Integration Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">StarRez Integration</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>StarRez Web Services API authentication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Auto-create entries, bookings, and applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Sync custom fields and room preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time availability sync from StarRez inventory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>15-minute sync frequency (configurable)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Kinetic Integration</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Kinetic REST API connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Lead and application object mapping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Activity timeline sync (calls, messages, meetings)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Webhook triggers for status changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Custom field data mapping support</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-md">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-tf-navy" />
                Technical Setup Process
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Provide TermFlow team with CRM API credentials (read/write access)</li>
                <li>Map CRM fields to TermFlow data model (we guide you through this)</li>
                <li>Configure sync frequency and data flow rules</li>
                <li>Test sync with 10 sample leads to verify data accuracy</li>
                <li>Go live - typically 3-5 days from kick-off to production</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-metrics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Success Metrics
            </CardTitle>
            <CardDescription>
              Results from operators integrating TermFlow with CRMs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">60%</div>
                <div className="text-sm text-muted-foreground mt-1">Reduction in manual CRM work</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">12hrs</div>
                <div className="text-sm text-muted-foreground mt-1">Saved per week (lead entry)</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">99.8%</div>
                <div className="text-sm text-muted-foreground mt-1">Data accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-cta">
          <CardHeader>
            <CardTitle>See Our CRM Integrations</CardTitle>
            <CardDescription>Book a demo to see StarRez or Kinetic integration in action</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              We'll show you how TermFlow connects to your CRM, demonstrate bidirectional sync, and walk through the technical setup process. Bring your technical team - we'll answer all integration questions.
            </p>
            <Button asChild size="lg" data-testid="button-cta-demo">
              <a href="/book-demo">See Our CRM Integrations - Book a Demo</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
