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
  Wrench, Clock, CheckCircle, AlertTriangle, ArrowRight,
  MessageSquare, Zap, Bell, Users, TrendingUp, AlertCircle
} from "lucide-react";

export default function MaintenanceTriageAutomation() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Playbooks", url: "/playbooks" },
    { name: "Maintenance Triage Automation", url: "/playbooks/maintenance-triage-automation" }
  ];
  const steps = [
    {
      number: 1,
      title: "Multi-Channel Request Capture",
      description: "Automatically capture maintenance requests from WhatsApp, email, web portal, or phone calls (via transcription). AI agent acknowledges request within 2 minutes and assigns ticket number for tracking.",
      automation: "100% automated",
      icon: MessageSquare,
      details: [
        "WhatsApp Business API integration",
        "Email parsing with natural language understanding",
        "Web portal submission forms",
        "Phone call transcription (via JustCall integration)",
        "Automatic ticket creation with unique reference number",
        "Instant acknowledgment to tenant via preferred channel"
      ]
    },
    {
      number: 2,
      title: "AI-Powered Categorization",
      description: "Machine learning model classifies maintenance type (plumbing, electrical, heating, appliances, cleaning, structural) with 94% accuracy. System learns from historical data and manual corrections.",
      automation: "94% automated",
      icon: Zap,
      details: [
        "Automatic categorization into 12 maintenance types",
        "Keyword extraction from tenant descriptions",
        "Historical pattern recognition",
        "Location analysis (common room, bathroom, kitchen)",
        "Manual override available for complex cases",
        "Category confidence scoring (flags uncertain classifications)"
      ]
    },
    {
      number: 3,
      title: "Priority Assessment & SLA Assignment",
      description: "Automated priority scoring based on issue type, tenant vulnerability, safety risk, and property damage potential. Assigns SLA targets: Emergency (1h), Urgent (24h), Routine (3-5 days).",
      automation: "90% automated",
      icon: AlertTriangle,
      details: [
        "Emergency detection (heating failure in winter, water leak, electrical fault)",
        "Vulnerable tenant flagging (disabilities, elderly)",
        "Safety risk assessment (fire hazard, structural damage)",
        "Property damage potential scoring",
        "SLA target assignment with countdown timer",
        "Escalation rules if SLA at risk of breach"
      ]
    },
    {
      number: 4,
      title: "Automatic Routing & Assignment",
      description: "Routes to in-house team or external contractors based on category, availability, location, and skillset. Integrates with on-call schedules and contractor portals for instant dispatch.",
      automation: "88% automated",
      icon: Users,
      details: [
        "In-house vs contractor decision logic",
        "Skill-based routing (plumber, electrician, general handyman)",
        "Location-based assignment (nearest available technician)",
        "On-call schedule integration (after-hours emergencies)",
        "Contractor portal auto-dispatch",
        "Manual reassignment option for complex jobs"
      ]
    },
    {
      number: 5,
      title: "Tenant Communication & Updates",
      description: "Automatically sends acknowledgment, ETA, technician details, and real-time updates to tenant. Reduces 'Where's my repair?' queries by 80%. Uses tenant's preferred communication channel.",
      automation: "100% automated",
      icon: Bell,
      details: [
        "Instant acknowledgment with ticket reference",
        "ETA notification when job assigned",
        "Technician details and contact information",
        "Job status updates (in progress, on hold, completed)",
        "Automatic reminders if tenant confirmation needed",
        "Multi-language support for international students"
      ]
    },
    {
      number: 6,
      title: "SLA Tracking & Escalation",
      description: "Real-time SLA monitoring with automatic escalation if targets at risk. Dashboard shows response time, resolution time, and breach alerts. Sends escalation notifications to management.",
      automation: "100% automated",
      icon: TrendingUp,
      details: [
        "Response time tracking (acknowledgment to assignment)",
        "Resolution time monitoring (job completion)",
        "SLA breach prediction (flags jobs at risk)",
        "Automatic escalation to on-site manager",
        "Dashboard with live SLA compliance metrics",
        "Historical performance reporting"
      ]
    },
    {
      number: 7,
      title: "Completion Confirmation & Satisfaction Survey",
      description: "After job completion, system confirms with tenant and sends satisfaction survey. Automatically creates follow-up tickets if tenant reports issues. Tracks contractor performance metrics.",
      automation: "100% automated",
      icon: CheckCircle,
      details: [
        "Automated completion confirmation request",
        "Tenant satisfaction survey (1-5 rating + comments)",
        "Follow-up ticket creation if issue persists",
        "Contractor performance tracking",
        "Feedback loop for AI model improvement",
        "Dispute resolution workflow if tenant unhappy"
      ]
    }
  ];

  const integrations = [
    "WhatsApp Business API",
    "Maintenance CRM (Fixflo, Arthur Online)",
    "Contractor portals",
    "Google Calendar (on-call schedules)",
    "JustCall (phone transcription)",
    "Email systems"
  ];

  const pitfalls = [
    {
      problem: "AI misclassifies urgent issues as routine, delaying response",
      solution: "Implement confidence threshold: classifications below 80% confidence are escalated to human review. Specific keywords like 'leak', 'no heating', 'electrical sparks' trigger automatic emergency classification regardless of AI prediction."
    },
    {
      problem: "Tenants report 'emergency' for non-urgent issues (e.g., 'urgent: lightbulb out')",
      solution: "AI detects keyword exaggeration vs actual description. Automatically re-prioritises to appropriate category and sends explanation to tenant: 'We've logged this as routine maintenance (3-5 days). For genuine emergencies, please call [emergency number].'"
    },
    {
      problem: "Contractors don't update job status, leaving tenants in the dark",
      solution: "Require status updates via contractor portal or SMS. If no update received within 24 hours of assignment, system sends automated reminder. After 48 hours, escalates to on-site manager to manually confirm progress."
    },
    {
      problem: "After-hours emergencies fall through the cracks",
      solution: "Integrate with on-call schedules in Google Calendar. Emergency issues outside office hours automatically trigger SMS/call to on-call staff. Escalation chain defined: if no response within 15 minutes, escalate to next person on rota."
    }
  ];

  const priorityMatrix = [
    {
      priority: "Emergency",
      sla: "1 hour response",
      examples: ["No heating in winter", "Major water leak", "Electrical fault/sparking", "Blocked toilet (only WC in property)", "Security issue (broken locks)"],
      color: "text-red-600"
    },
    {
      priority: "Urgent",
      sla: "24 hours response",
      examples: ["Heating reduced but working", "Minor leak (contained)", "Appliance breakdown (fridge, oven)", "Blocked shower/sink", "Pest sighting"],
      color: "text-orange-600"
    },
    {
      priority: "Routine",
      sla: "3-5 days response",
      examples: ["Lightbulb replacement", "Cabinet door loose", "General cleaning issues", "Cosmetic damage (scuffs, marks)", "Window adjustment"],
      color: "text-blue-600"
    }
  ];

  return (
    <>
      <SEOHead
        title="Maintenance Triage Automation: Smart Routing & Priority Management | TermFlow"
        description="Automate maintenance request triage with AI-powered categorization, priority assessment, and smart routing. Reduce response time by 30% and achieve 95% SLA compliance. Complete playbook for PBSA operators."
        keywords="maintenance triage automation, property maintenance automation, PBSA maintenance workflow, AI maintenance categorization, SLA tracking automation, contractor management"
        canonical="https://termflow.ai/playbooks/maintenance-triage-automation"
        ogTitle="Maintenance Triage Automation: 2 Hours/Day → 20 Minutes"
        ogDescription="Battle-tested playbook for automated maintenance management. Used by PBSA operators to handle 500+ requests/month efficiently."
        ogType="article"
        ogUrl="https://termflow.ai/playbooks/maintenance-triage-automation"
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      <ServiceSchema
        name="Automated Maintenance Triage for Student Housing"
        description="AI-powered maintenance request triage, urgency assessment, contractor assignment, and tenant communication automation for PBSA maintenance teams."
        provider={{
          name: "TermFlow",
          url: "https://termflow.co.uk"
        }}
        serviceType="Maintenance Management System"
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
        <section className="py-12 bg-gradient-to-br from-orange-50 via-background to-background dark:from-orange-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4" data-testid="badge-category">
                <Wrench className="w-3 h-3 mr-1" />
                Operations Playbook
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Maintenance Triage: Smart Routing & Priority Management
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Stop drowning in maintenance requests. Automate triage, priority assessment, routing, and tenant communication. 
                Reduce manual work from 2 hours/day to 20 minutes of oversight. Achieve 95% SLA compliance.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Time Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">2hrs/day → 20min</p>
                    <p className="text-xs text-muted-foreground mt-1">Daily oversight</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">SLA Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">95%</p>
                    <p className="text-xs text-muted-foreground mt-1">On-time response</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Tenant Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">4.6/5</p>
                    <p className="text-xs text-muted-foreground mt-1">Average rating</p>
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
                The Problem: Maintenance Chaos Hurts Tenant Satisfaction
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Maintenance is the biggest driver of tenant satisfaction (or dissatisfaction) in PBSA. Yet most operators handle 
                  it with a chaotic mix of emails, WhatsApp messages, phone calls, and sticky notes:
                </p>
                
                <ul className="space-y-3 my-6">
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Requests flood in via multiple channels with no central tracking</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Unclear priorities mean genuine emergencies get buried in routine requests</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Manual assignment wastes time and leads to contractor mismatches</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Tenants constantly ask "When's the plumber coming?" because there's no visibility</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>SLA breaches are common because there's no systematic tracking</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>After-hours emergencies fall through the cracks when no one's monitoring</span>
                  </li>
                </ul>

                <p className="text-muted-foreground leading-relaxed">
                  For a 200-bed property receiving 40-50 maintenance requests per month, on-site staff spend 2+ hours every day 
                  just triaging, assigning, and updating tenants. That's 60+ hours per month that could be automated.
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
                The Solution: AI-Powered Triage & Smart Routing
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                TermFlow automates the entire maintenance triage process. Requests are captured from any channel, automatically 
                categorised by AI, prioritised based on urgency and risk, routed to the right technician, and tenants receive 
                real-time updates. Staff only intervene for edge cases or SLA breaches.
              </p>

              <img 
                src="/diagrams/maintenance-triage-flow.svg" 
                alt="Maintenance triage automation flow diagram" 
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
                        <span>Multi-channel request capture & ticketing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>AI categorization (94% accuracy)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Priority assessment & SLA assignment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Intelligent routing to contractors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Tenant updates & ETA notifications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>SLA tracking & escalation alerts</span>
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
                        <span>Uncertain classifications (below 80% AI confidence)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>SLA breach alerts requiring intervention</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Tenant disputes about job completion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Complex or unusual maintenance issues</span>
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

        {/* Priority Matrix */}
        <section className="py-12 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Priority Matrix & SLA Targets</h2>
              
              <div className="space-y-4">
                {priorityMatrix.map((priority, idx) => (
                  <Card key={idx} className="border-l-4" style={{ borderLeftColor: priority.color.replace('text-', 'rgb(var(--') + '))' }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-xl ${priority.color}`}>{priority.priority}</CardTitle>
                        <Badge variant="secondary">{priority.sla}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-semibold mb-2 text-muted-foreground">Common Examples:</p>
                      <ul className="space-y-1">
                        {priority.examples.map((example, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
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
                      <p className="text-3xl font-bold text-destructive">2 hours/day</p>
                      <p className="text-xs text-muted-foreground">Manual triage, assignment, updates</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">After Automation</p>
                      <p className="text-3xl font-bold text-green-600">20 minutes/day</p>
                      <p className="text-xs text-muted-foreground">Manual oversight only</p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="font-semibold">For 50 requests/month:</p>
                      <p className="text-2xl font-bold text-primary">45 hours saved/month</p>
                      <p className="text-sm text-muted-foreground">23% of FTE capacity reclaimed</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Success Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">SLA Compliance</span>
                      <span className="text-xl font-bold">95%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tenant Satisfaction</span>
                      <span className="text-xl font-bold">4.6/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Resolution Time</span>
                      <span className="text-xl font-bold">30% faster</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">AI Accuracy</span>
                      <span className="text-xl font-bold">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">"Where's My Repair?" Queries</span>
                      <span className="text-xl font-bold">-80%</span>
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

        {/* Related Playbooks */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Related Playbooks</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-lg">Inspection Scheduling Automation</CardTitle>
                    <CardDescription>
                      Inspection findings automatically create maintenance tickets. Seamless handoff between inspections and repairs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="sm" data-testid="link-inspection-scheduling">
                      <Link href="/playbooks/inspection-scheduling-automation">
                        Read Playbook <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-lg">Tenant Onboarding Automation</CardTitle>
                    <CardDescription>
                      Set tenant expectations from day one with automated welcome communications including maintenance reporting procedures.
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
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">
                See Maintenance Triage Automation in Action
              </h2>
              <p className="text-lg opacity-90">
                Book a demo to see how TermFlow transforms maintenance chaos into an efficient, automated system. 
                We'll show you the AI categorization, smart routing, and real-time SLA tracking used by{" "}
                <Link href="/personas/onsite-managers" className="text-white hover:underline" data-testid="link-onsite-managers">
                  on-site managers
                </Link>
                {" "}at 200-bed properties. Check our{" "}
                <Link href="/automation-ideas" className="text-white hover:underline" data-testid="link-automation-ideas">
                  automation ideas library
                </Link>
                {" "}for more workflows.
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
