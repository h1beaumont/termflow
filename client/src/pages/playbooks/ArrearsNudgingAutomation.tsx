import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { ServiceSchema } from "@/components/ServiceSchema";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";
import { 
  PoundSterling, Clock, CheckCircle, AlertTriangle, ArrowRight,
  Bell, CreditCard, TrendingDown, FileText, Scale, AlertCircle
} from "lucide-react";

export default function ArrearsNudgingAutomation() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Playbooks", url: "/playbooks" },
    { name: "Arrears Nudging Automation", url: "/playbooks/arrears-nudging-automation" }
  ];
  const steps = [
    {
      number: 1,
      title: "Pre-Due Reminders (Proactive Prevention)",
      description: "Automated friendly reminders sent 7 days, 3 days, and 1 day before rent due date. Includes payment link, amount, and due date. Studies show this reduces arrears by 35% before they even occur.",
      automation: "100% automated",
      icon: Bell,
      details: [
        "7-day advance notice (WhatsApp, email, or SMS)",
        "3-day reminder with payment link",
        "1-day final reminder with countdown",
        "Personalised amount and due date",
        "Multi-language support for international students",
        "Payment method options (bank transfer, Stripe, standing order)"
      ]
    },
    {
      number: 2,
      title: "Overdue Notifications (Day 1-7)",
      description: "Immediate notification on Day 1 of arrears with payment link. Day 3 and Day 7 follow-ups with escalating tone (still friendly but more urgent). Tracks acknowledgment and payment promises.",
      automation: "100% automated",
      icon: AlertTriangle,
      details: [
        "Day 1: Polite reminder (may have forgotten)",
        "Day 3: More urgent tone + payment plan option",
        "Day 7: Final automated reminder before escalation",
        "Automatic payment link generation (exact outstanding amount)",
        "Acknowledgment tracking (tenant confirms receipt)",
        "Payment promise logging (tenant commits to date)"
      ]
    },
    {
      number: 3,
      title: "Stripe Payment Link Generation",
      description: "Automatically generates personalised Stripe payment links with exact outstanding amount (including any late fees if applicable). Tenants pay via card, Apple Pay, or Google Pay. Instant confirmation on payment.",
      automation: "100% automated",
      icon: CreditCard,
      details: [
        "Dynamic link generation (exact amount owed)",
        "Multiple payment methods (card, Apple Pay, Google Pay)",
        "Partial payment option (if policy allows)",
        "Late fees automatically added (if configured)",
        "Instant payment confirmation to tenant and landlord",
        "Automatic arrears record update on payment"
      ]
    },
    {
      number: 4,
      title: "Escalation to On-Site Manager (Day 14)",
      description: "After 14 days of non-payment, system escalates to on-site manager with full history: all messages sent, tenant responses, payment promises. Manager receives dashboard with recommended actions.",
      automation: "75% automated",
      icon: FileText,
      details: [
        "Automatic escalation trigger on Day 14",
        "Full communication history provided to manager",
        "Payment promise tracking dashboard",
        "Recommended action templates (phone call, in-person meeting)",
        "Manager can override automation for manual handling",
        "Notes field for recording conversation outcomes"
      ]
    },
    {
      number: 5,
      title: "Payment Plan Negotiation (Automated Options)",
      description: "System offers pre-approved payment plan options (e.g., 4 weekly instalments). Tenant selects plan via web portal, system generates updated payment schedule and sends confirmation. Manager approves exceptions.",
      automation: "85% automated",
      icon: Scale,
      details: [
        "Pre-configured payment plan options (e.g., 2/4/6 week splits)",
        "Tenant self-service selection via web portal",
        "Automatic instalment schedule generation",
        "Updated payment links for each instalment",
        "Manager approval required for custom plans",
        "Breach detection if instalment missed"
      ]
    },
    {
      number: 6,
      title: "Legal/Eviction Workflow (Day 30+)",
      description: "For arrears exceeding 30 days (or landlord-defined threshold), system presents legal options to landlord: Section 8 notice, court action, or eviction. Generates compliant notice templates. Final decision by human.",
      automation: "50% automated",
      icon: AlertCircle,
      details: [
        "Automatic threshold detection (30+ days arrears)",
        "Legal notice template generation (Section 8)",
        "Arrears calculation with interest (if applicable)",
        "Landlord decision dashboard (proceed or negotiate)",
        "Integration with legal portals (if using solicitors)",
        "Compliance checks (notice periods, tenant rights)"
      ]
    }
  ];

  const integrations = [
    "Stripe Payments (payment links)",
    "WhatsApp Business API",
    "Accounting systems (Xero, QuickBooks)",
    "Legal portals (for notices)",
    "Email & SMS services",
    "Tenant CRM (payment history)"
  ];

  const pitfalls = [
    {
      problem: "Students in genuine hardship receive aggressive reminders, damaging relationship",
      solution: "Implement hardship flag system. If tenant reports financial difficulty, pause automated reminders and escalate immediately to on-site manager for compassionate handling. Include links to university hardship funds and financial support services in all communications."
    },
    {
      problem: "International students miss payments due to delayed overseas transfers",
      solution: "Configure 5-day grace period for international students (detected by nationality field). Send pre-due reminder explaining UK payment timelines and suggesting they initiate transfers 7 days early. Offer alternative payment methods (Western Union, Wise)."
    },
    {
      problem: "Automated messages feel robotic and impersonal, lowering tenant satisfaction",
      solution: "Use warm, empathetic tone: 'We noticed rent hasn't come through yet - just wanted to check everything's okay?' vs 'Your rent is overdue.' Personalise with tenant name, property address, and friendly signature from named on-site manager."
    },
    {
      problem: "Arrears escalate due to deposit deduction disputes from previous tenancy",
      solution: "Cross-check arrears against deposit disputes. If tenant is disputing deductions, pause rent arrears workflow until dispute resolved. Send explanation: 'We see you've queried your deposit deduction - let's resolve that first before discussing rent.'"
    }
  ];

  const toneEscalation = [
    {
      stage: "Pre-Due (Day -7 to -1)",
      tone: "Helpful Reminder",
      example: "Hi Sarah! Just a friendly reminder that rent is due on 1st October. You can pay via the link below. Let us know if you need any help! 😊",
      color: "text-blue-600"
    },
    {
      stage: "Early Overdue (Day 1-3)",
      tone: "Gentle Nudge",
      example: "Hi Sarah, we noticed rent hasn't come through yet. No worries if it's on the way! If there's an issue, just let us know and we can help sort it out.",
      color: "text-orange-600"
    },
    {
      stage: "Mid Overdue (Day 7-14)",
      tone: "Firmer Notice",
      example: "Hi Sarah, rent is now 7 days overdue (£850 outstanding). Please pay via the link below or contact us urgently to discuss a payment plan. We're here to help.",
      color: "text-red-600"
    },
    {
      stage: "Late Overdue (Day 30+)",
      tone: "Formal Warning",
      example: "Dear Sarah, rent remains unpaid after 30 days (£850 + £25 late fee). We must now consider formal action. Please contact our office immediately to resolve this matter.",
      color: "text-destructive"
    }
  ];

  return (
    <>
      <SEOHead
        title="Arrears Management Automation: Automated Rent Nudges & Escalation | TermFlow"
        description="Automate rent collection with pre-due reminders, payment links, and escalation workflows. Reduce arrears by £18k/year and save 6 hours/week on manual rent chasing. Battle-tested playbook for PBSA operators."
        keywords="arrears management automation, rent collection automation, automated rent reminders, payment link generation, arrears escalation workflow, student rent collection"
        canonical="https://termflow.ai/playbooks/arrears-nudging-automation"
        ogTitle="Arrears Management Automation: £18k Saved Per 100 Beds Annually"
        ogDescription="Complete playbook for automated rent collection. Reduce manual work from 6 hours/week to 30 minutes with 92% collection rate."
        ogType="article"
        ogUrl="https://termflow.ai/playbooks/arrears-nudging-automation"
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      <ServiceSchema
        name="Automated Arrears Management & Payment Reminders"
        description="Gentle automated payment reminders, arrears escalation workflows, and payment plan management for student accommodation providers with compliance tracking."
        provider={{
          name: "TermFlow",
          url: "https://termflow.co.uk"
        }}
        serviceType="Payment Management System"
      />

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

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          <LastUpdated date="January 20, 2025" className="mb-8" />
        </div>

        {/* Hero */}
        <section className="py-12 bg-gradient-to-br from-purple-50 via-background to-background dark:from-purple-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4" data-testid="badge-category">
                <PoundSterling className="w-3 h-3 mr-1" />
                Financial Playbook
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Arrears Management: Automated Nudges & Escalation
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Stop manually chasing rent every month. Automate the entire arrears process from pre-due reminders to escalation workflows. 
                Reduce arrears by £18k/year per 100 beds whilst reclaiming 6 hours per week.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Time Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">6hrs/wk → 30min</p>
                    <p className="text-xs text-muted-foreground mt-1">Weekly oversight</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Collection Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-xs text-muted-foreground mt-1">Within 14 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Arrears Reduction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">£18k/year</p>
                    <p className="text-xs text-muted-foreground mt-1">Per 100 beds</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                The Problem: Manual Rent Chasing is Exhausting & Ineffective
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Chasing late rent is one of the most time-consuming and emotionally draining tasks for PBSA operators:
                </p>
                
                <ul className="space-y-3 my-6">
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Spending 6+ hours per week manually sending reminder emails and WhatsApp messages</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Inconsistent follow-up (some tenants chased aggressively, others slipping through the cracks)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>No systematic escalation, leading to arrears ballooning before action is taken</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Students forget payment deadlines without proactive reminders</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Payment links sent manually via email, easy to lose or ignore</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Legal escalation delayed due to poor record-keeping of communication attempts</span>
                  </li>
                </ul>

                <p className="text-muted-foreground leading-relaxed">
                  For a 200-bed property with 15% of tenants paying late each month, that's 30 tenants requiring manual follow-up. 
                  At 12 minutes per tenant across multiple touchpoints, that's 6 hours of work every single month. 
                  Automation reduces this to 30 minutes of exception handling.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                The Solution: Fully Automated Arrears Management
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                TermFlow automates the entire arrears workflow from pre-due reminders to legal escalation. The system proactively 
                prevents arrears with friendly nudges, generates payment links automatically, and only escalates to humans when 
                required. All communication is logged for compliance and evidence trail.
              </p>

              <img 
                src="/diagrams/arrears-nudging-flow.svg" 
                alt="Arrears nudging automation flow diagram" 
                className="w-full border rounded-lg shadow-sm bg-white p-6 mb-8"
                data-testid="img-flow-diagram"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-green-700 dark:text-green-400">What Gets Automated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Pre-due reminders (7, 3, 1 day before)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Overdue notifications (Day 1, 3, 7)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Stripe payment link generation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Payment confirmation & arrears update</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Payment plan options & scheduling</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Escalation triggers & notifications</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <CardTitle className="text-orange-700 dark:text-orange-400">What Needs Human Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Hardship cases requiring compassionate handling</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Custom payment plan approvals (beyond standard options)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Day 14+ escalation decisions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Legal action decisions (eviction, court proceedings)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Breakdown */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Step-by-Step Implementation Guide</h2>
              
              <div className="space-y-8">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <Card key={step.number} data-testid={`card-step-${step.number}`}>
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex-shrink-0">
                            {step.number}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className="w-5 h-5 text-primary" />
                              <CardTitle className="text-xl">{step.title}</CardTitle>
                              <Badge variant="secondary" className="ml-auto">{step.automation}</Badge>
                            </div>
                            <CardDescription className="text-base leading-relaxed">
                              {step.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Tone Escalation */}
        <section className="py-12 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Communication Tone Escalation</h2>
              <p className="text-muted-foreground mb-6">
                Automated messages use progressively firmer tone whilst remaining professional and empathetic:
              </p>
              
              <div className="space-y-4">
                {toneEscalation.map((stage, idx) => (
                  <Card key={idx} className="border-l-4" style={{ borderLeftColor: 'currentColor' }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-lg ${stage.color}`}>{stage.stage}</CardTitle>
                        <Badge variant="outline">{stage.tone}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/50 p-4 rounded-md border">
                        <p className="text-sm italic">"{stage.example}"</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Automation Impact */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Automation Impact & Results</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Time Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Before Automation</p>
                      <p className="text-3xl font-bold text-destructive">6 hours/week</p>
                      <p className="text-xs text-muted-foreground">Manual rent chasing & follow-up</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">After Automation</p>
                      <p className="text-3xl font-bold text-green-600">30 minutes/week</p>
                      <p className="text-xs text-muted-foreground">Exception handling only</p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="font-semibold">Annual savings:</p>
                      <p className="text-2xl font-bold text-primary">286 hours/year</p>
                      <p className="text-sm text-muted-foreground">15% of FTE capacity</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-primary" />
                      Financial Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Collection Rate</span>
                      <span className="text-xl font-bold">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Resolution Time</span>
                      <span className="text-xl font-bold">45% faster</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Arrears Reduction (100 beds)</span>
                      <span className="text-xl font-bold">£18k/year</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Payment Plan Uptake</span>
                      <span className="text-xl font-bold">64%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Legal Escalations</span>
                      <span className="text-xl font-bold">-58%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Key Integrations */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Key Integrations</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {integrations.map((integration, idx) => (
                  <Card key={idx} className="bg-muted/50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium">{integration}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Common Pitfalls */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-orange-500" />
                Common Pitfalls & Solutions
              </h2>
              
              <div className="space-y-6">
                {pitfalls.map((pitfall, idx) => (
                  <Card key={idx} className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <CardTitle className="text-lg text-orange-700 dark:text-orange-400">
                        ⚠️ Pitfall: {pitfall.problem}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm mb-1">Solution:</p>
                          <p className="text-sm text-muted-foreground">{pitfall.solution}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hardship & Support */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Hardship Handling & Support Signposting</h2>
              
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-400">Compassionate Automation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    All automated arrears messages include links to financial support resources:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>University hardship funds and emergency loans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Student finance helplines and advice services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Payment plan options (self-service selection)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Direct contact option to speak to on-site manager</span>
                    </li>
                  </ul>
                  <div className="pt-4 border-t border-blue-200">
                    <p className="text-sm font-semibold mb-2">Hardship Flag System:</p>
                    <p className="text-sm text-muted-foreground">
                      If a tenant reports financial difficulty (via keyword detection or manual flag), the system pauses 
                      automated reminders and immediately escalates to the on-site manager for compassionate, personalised handling.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Playbooks */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Related Playbooks</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-lg">Tenant Onboarding Automation</CardTitle>
                    <CardDescription>
                      Set payment expectations from day one. Automated deposit collection workflow includes Stripe integration.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="sm" data-testid="link-tenant-onboarding">
                      <Link href="/playbooks/tenant-onboarding-automation">
                        Read Playbook <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-lg">Maintenance Triage Automation</CardTitle>
                    <CardDescription>
                      Similar escalation principles applied to maintenance requests. Automated triage and SLA tracking.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="sm" data-testid="link-maintenance-triage">
                      <Link href="/playbooks/maintenance-triage-automation">
                        Read Playbook <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">
                See Arrears Automation in Action
              </h2>
              <p className="text-lg opacity-90">
                Book a demo to see how TermFlow eliminates manual rent chasing, achieves 92% collection rates, 
                and reduces arrears by £18k/year per 100 beds. We'll show you the exact workflow used by operators managing 500+ beds.
              </p>
              <div className="pt-4">
                <Button 
                  asChild 
                  size="lg" 
                  variant="secondary"
                  data-testid="button-book-demo"
                >
                  <Link href="/book-demo">
                    Book Your Free Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Last Updated Badge */}
        <div className="container mx-auto px-4 py-6 text-center border-t">
          <Badge variant="outline" data-testid="badge-last-updated">
            Last Updated: January 2025
          </Badge>
        </div>

        <Footer />
      </div>
    </>
  );
}
