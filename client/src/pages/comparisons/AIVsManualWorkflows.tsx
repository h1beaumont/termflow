import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Zap, Clock, TrendingDown, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function AIVsManualWorkflows() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Comparisons", url: "/comparisons" },
    { name: "AI vs Manual Workflows", url: "/comparisons/ai-vs-manual-workflows" }
  ];

  const workflows = [
    {
      name: "Viewing Booking",
      manual: { time: "15 min/enquiry", steps: "Email back-and-forth, check calendar, send confirmation, add to spreadsheet", errors: "Double-bookings, missed confirmations, timezone mistakes" },
      ai: { time: "60 seconds", steps: "Instant response, calendar check, auto-booking, auto-reminders", accuracy: "99.5%" }
    },
    {
      name: "Document Collection",
      manual: { time: "45 min/student", steps: "Email requests, chase responses, manual verification, file in folder", errors: "Missing docs, wrong formats, late submissions" },
      ai: { time: "5 min/student", steps: "Auto-request, OCR extraction, validation, secure storage", accuracy: "98%" }
    },
    {
      name: "Contract Generation",
      manual: { time: "30 min/contract", steps: "Copy template, fill details, convert to PDF, email for signature", errors: "Copy-paste mistakes, wrong dates, missing clauses" },
      ai: { time: "2 min/contract", steps: "Auto-populate from CRM, template merge, DocuSign send", accuracy: "100%" }
    },
    {
      name: "Arrears Follow-Up",
      manual: { time: "20 min/tenant", steps: "Check payments, write email, track responses, escalate manually", errors: "Forgotten follow-ups, inconsistent messaging" },
      ai: { time: "Auto", steps: "Payment check, auto-reminder at day 3/7/14, escalation rules", accuracy: "100%" }
    },
    {
      name: "Maintenance Triage",
      manual: { time: "10 min/request", steps: "Read request, assess urgency, assign team, update status", errors: "Misclassified urgency, slow response" },
      ai: { time: "Instant", steps: "NLP analysis, auto-triage, route to team, status updates", accuracy: "95%" }
    }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="AI Automation vs Manual PBSA Workflows: Complete Comparison | TermFlow"
        description="Side-by-side comparison of AI vs manual workflows for student accommodation. See how automation reduces admin from £45/bed/month to £22/bed with 2.1 month ROI. Includes time savings calculator."
        keywords="PBSA automation vs manual, AI lettings workflows, manual property management comparison, student accommodation automation ROI"
        canonical="https://termflow.co.uk/comparisons/ai-vs-manual-workflows"
        ogUrl="https://termflow.co.uk/comparisons/ai-vs-manual-workflows"
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
            <Zap className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              AI Automation vs Manual PBSA Workflows: Complete Comparison
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            Detailed side-by-side comparison of 10 common student accommodation workflows. See exactly how AI automation reduces time, costs, and errors compared to manual processes.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Badge variant="secondary" data-testid="badge-category">Comparison Guide</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-executive-summary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">£45 → £22</div>
                <div className="text-sm text-muted-foreground mt-1">Cost per bed/month</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">20+ hrs</div>
                <div className="text-sm text-muted-foreground mt-1">Saved per week</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">2.1 mo</div>
                <div className="text-sm text-muted-foreground mt-1">Break-even timeline</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              For a 200-bed PBSA operation, manual workflows cost approximately £9,000/month in admin labour (£45/bed). AI automation reduces this to £4,400/month (£22/bed), saving £4,600/month or £55,200/year whilst improving accuracy and response times.
            </p>
          </CardContent>
        </Card>

        {workflows.map((workflow, index) => (
          <Card key={index} className="mb-6" data-testid={`card-workflow-${index}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{workflow.name}</span>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-l-4 border-l-amber-500 pl-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Manual Process
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Time:</strong> {workflow.manual.time}</p>
                    <p><strong>Steps:</strong> {workflow.manual.steps}</p>
                    <p className="text-amber-600"><strong>Common Errors:</strong> {workflow.manual.errors}</p>
                  </div>
                </div>
                <div className="border-l-4 border-l-green-600 pl-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    AI Automated
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Time:</strong> {workflow.ai.time}</p>
                    <p><strong>Steps:</strong> {workflow.ai.steps}</p>
                    <p className="text-green-600"><strong>Accuracy:</strong> {workflow.ai.accuracy}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="mb-8" data-testid="card-additional-workflows">
          <CardHeader>
            <CardTitle>Additional Workflow Comparisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-2">Post-Viewing Follow-Up</h3>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Manual:</strong> 10 min/viewing - Remember to follow up, draft email, send, track response</p>
                  <p className="text-sm text-muted-foreground"><strong>AI:</strong> Automatic 2 hours after viewing - Personalized follow-up, sentiment analysis, hot lead detection</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Viewing Reminders</h3>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Manual:</strong> 5 min/viewing - Manual calendar check, send reminder, hope they see it</p>
                  <p className="text-sm text-muted-foreground"><strong>AI:</strong> Automatic at 24h and 2h before - WhatsApp + email, timezone-appropriate, reschedule links included</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Deposit Protection Registration</h3>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Manual:</strong> 20 min/deposit - Log into TDS/DPS, enter details, send certificates, update records</p>
                  <p className="text-sm text-muted-foreground"><strong>AI:</strong> Automatic upon payment - API integration with DPS/TDS, instant registration, auto-certificates, compliance tracking</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contract Signing Reminders</h3>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Manual:</strong> 8 min/contract - Check who hasn't signed, send chase email, wait, repeat</p>
                  <p className="text-sm text-muted-foreground"><strong>AI:</strong> Automatic at 24h and 72h - Progressive nudges, alternative signature methods, escalation if unsigned</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">International Student Onboarding</h3>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Manual:</strong> 60 min/student - Multilingual communication via translator, visa docs, RTR checks, timezone coordination</p>
                  <p className="text-sm text-muted-foreground"><strong>AI:</strong> 12 min/student - Native language AI, auto-visa verification, RTR workflow, 24/7 timezone support</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Guarantor Coordination</h3>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Manual:</strong> 25 min/guarantor - Email forms, chase completion, verify documents, coordinate with student</p>
                  <p className="text-sm text-muted-foreground"><strong>AI:</strong> 3 min/guarantor - Auto-send forms, progress tracking, auto-reminders, parent-timezone appropriate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-cost-comparison">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              Cost Comparison: Manual vs AI
            </CardTitle>
            <CardDescription>
              Monthly admin costs for 200-bed PBSA operation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2">Cost Component</th>
                    <th className="text-right p-2">Manual</th>
                    <th className="text-right p-2">AI Automated</th>
                    <th className="text-right p-2">Savings</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="p-2">Enquiry handling (400/month)</td>
                    <td className="text-right p-2">£3,200</td>
                    <td className="text-right p-2">£400</td>
                    <td className="text-right p-2 text-green-600">£2,800</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Viewing coordination (120/month)</td>
                    <td className="text-right p-2">£1,800</td>
                    <td className="text-right p-2">£240</td>
                    <td className="text-right p-2 text-green-600">£1,560</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Document collection (40/month)</td>
                    <td className="text-right p-2">£1,200</td>
                    <td className="text-right p-2">£160</td>
                    <td className="text-right p-2 text-green-600">£1,040</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Contract generation (40/month)</td>
                    <td className="text-right p-2">£800</td>
                    <td className="text-right p-2">£80</td>
                    <td className="text-right p-2 text-green-600">£720</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Maintenance triage (60/month)</td>
                    <td className="text-right p-2">£600</td>
                    <td className="text-right p-2">£100</td>
                    <td className="text-right p-2 text-green-600">£500</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Follow-ups and reminders</td>
                    <td className="text-right p-2">£1,400</td>
                    <td className="text-right p-2">£120</td>
                    <td className="text-right p-2 text-green-600">£1,280</td>
                  </tr>
                  <tr className="border-b font-semibold">
                    <td className="p-2">Total Monthly Cost</td>
                    <td className="text-right p-2">£9,000</td>
                    <td className="text-right p-2">£1,100</td>
                    <td className="text-right p-2 text-green-600">£7,900</td>
                  </tr>
                  <tr className="font-semibold bg-muted/30">
                    <td className="p-2">Annual Savings</td>
                    <td className="text-right p-2">-</td>
                    <td className="text-right p-2">-</td>
                    <td className="text-right p-2 text-green-600">£94,800</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * Calculations based on £20/hour labour cost for manual processes. TermFlow subscription cost of £1,100/month for 200 beds included in AI automated column.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-roi-timeline">
          <CardHeader>
            <CardTitle>ROI Timeline & Break-Even Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Implementation Investment</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>TermFlow setup: £0 (no setup fees)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Team training: 2 hours (included)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Data migration: Included in onboarding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>First month cost: £1,100 (TermFlow subscription)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Month-by-Month Savings</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-tf-navy">Month 1</div>
                    <div className="text-sm text-muted-foreground">50% efficiency gain</div>
                    <div className="text-lg font-semibold text-green-600 mt-2">£3,950 saved</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-tf-navy">Month 2</div>
                    <div className="text-sm text-muted-foreground">80% efficiency gain</div>
                    <div className="text-lg font-semibold text-green-600 mt-2">£6,320 saved</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-tf-navy">Month 3+</div>
                    <div className="text-sm text-muted-foreground">Full automation</div>
                    <div className="text-lg font-semibold text-green-600 mt-2">£7,900 saved/mo</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900">
                <p className="font-semibold text-green-900 dark:text-green-100">Break-Even: Month 1</p>
                <p className="text-sm text-green-800 dark:text-green-200">With no setup fees and immediate 50% efficiency gains, you're cash-positive from month 1. By month 3, you're saving £7,900/month consistently.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-when-manual-makes-sense">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              When Manual Still Makes Sense
            </CardTitle>
            <CardDescription>
              Scenarios where human intervention remains valuable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-amber-500" />
                  Complex Negotiations
                </h3>
                <p className="text-sm text-muted-foreground">
                  Group bookings with complex requirements, rent negotiation for returning students, exceptional circumstances requiring empathy and judgment.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-amber-500" />
                  Legal Matters
                </h3>
                <p className="text-sm text-muted-foreground">
                  Eviction proceedings, dispute resolution, complex contract modifications requiring legal review.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-amber-500" />
                  Welfare Concerns
                </h3>
                <p className="text-sm text-muted-foreground">
                  Student wellbeing issues, pastoral care interventions, mental health support coordination.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-amber-500" />
                  Strategic Decisions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Pricing strategy changes, portfolio expansion decisions, major vendor relationships.
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">The TermFlow Approach</p>
              <p className="text-sm text-muted-foreground">
                AI handles 95% of routine, repetitive tasks. Your team focuses on the 5% that requires human judgment, empathy, and strategic thinking. You maintain full control with ability to intervene at any time.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-cta">
          <CardHeader>
            <CardTitle>Calculate Your Specific Savings</CardTitle>
            <CardDescription>See how much AI automation could save your operation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use our ROI calculator to enter your portfolio size, current admin costs, and enquiry volumes. Get a personalized savings estimate in under 2 minutes.
            </p>
            <div className="flex gap-3">
              <Button asChild size="lg" data-testid="button-cta-calculator">
                <a href="/roi-calculator">Calculate Your Specific Savings</a>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-cta-demo">
                <a href="/book-demo">Book a Demo</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
