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
  ClipboardCheck, Clock, CheckCircle, AlertTriangle, ArrowRight,
  Calendar, Bell, Camera, FileText, Wrench, AlertCircle
} from "lucide-react";

export default function InspectionSchedulingAutomation() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Playbooks", url: "/playbooks" },
    { name: "Inspection Scheduling Automation", url: "/playbooks/inspection-scheduling-automation" }
  ];
  const steps = [
    {
      number: 1,
      title: "Inspection Calendar Setup",
      description: "System automatically schedules inspections based on property calendar: mid-term (Week 20), end-of-term (pre-checkout), and move-out inspections. Landlord can configure custom schedules per property.",
      automation: "95% automated",
      icon: Calendar,
      details: [
        "Automatic scheduling based on academic calendar",
        "Mid-term inspections (health & safety check)",
        "End-of-term inspections (pre-checkout condition assessment)",
        "Move-out inspections (deposit deduction assessment)",
        "Custom schedules per property type",
        "Bulk scheduling for entire portfolio"
      ]
    },
    {
      number: 2,
      title: "Automated Tenant Notifications",
      description: "System sends legally compliant notifications 14 days before inspection (or custom notice period). Includes date, time, purpose, and tenant rights information. Sent via WhatsApp, email, and SMS.",
      automation: "100% automated",
      icon: Bell,
      details: [
        "14-day advance notice (legally compliant)",
        "Multi-channel notifications (WhatsApp, email, SMS)",
        "Clear explanation of inspection purpose",
        "Tenant rights and access information",
        "Reminder notifications (7 days, 1 day before)",
        "Automated chasing if tenant doesn't confirm"
      ]
    },
    {
      number: 3,
      title: "Tenant Confirmation & Rescheduling",
      description: "Tenants can confirm attendance or request rescheduling via self-service web portal. Calendar integration shows available alternative slots. If tenant unavailable, inspection can proceed with documented notice (where legally permitted).",
      automation: "90% automated",
      icon: Calendar,
      details: [
        "Self-service confirmation portal",
        "One-click rescheduling with available slots",
        "Automatic conflict detection (tenant has lecture, etc.)",
        "Documented notice trail for compliance",
        "Inspection can proceed if notice given (UK law)",
        "Absence recording if tenant doesn't attend"
      ]
    },
    {
      number: 4,
      title: "Inspector Assignment & Routing Optimization",
      description: "Automatically assigns inspectors based on availability, location, and workload. Route optimization ensures efficient scheduling of multiple inspections in same building or area. Mobile calendar sync for inspectors.",
      automation: "88% automated",
      icon: ClipboardCheck,
      details: [
        "Skill-based assignment (property type, inspection complexity)",
        "Location-based routing (minimise travel time)",
        "Workload balancing across inspector team",
        "Mobile calendar integration (Google Calendar, Outlook)",
        "Bulk inspection scheduling for same property",
        "Contractor integration (for external inspectors)"
      ]
    },
    {
      number: 5,
      title: "Digital Inspection Checklist & Photo Documentation",
      description: "Mobile app provides digital checklist based on property type and inspection purpose. Inspectors capture photos for every item, add notes, and rate condition (excellent, good, fair, poor). All evidence timestamped and geotagged.",
      automation: "85% automated",
      icon: Camera,
      details: [
        "Customisable checklist templates (room-by-room)",
        "Photo capture with automatic upload",
        "Condition rating system (excellent → poor)",
        "Inspector notes and observations",
        "Timestamp and geolocation metadata",
        "Offline mode (sync when back online)"
      ]
    },
    {
      number: 6,
      title: "Automated Report Generation",
      description: "System auto-generates professional PDF inspection reports within 2 hours of completion. Includes photos, condition ratings, and recommended actions. Automatically emailed to landlord and tenant with secure access links.",
      automation: "95% automated",
      icon: FileText,
      details: [
        "PDF report generation (branded template)",
        "Photo gallery with condition ratings",
        "Room-by-room breakdown with notes",
        "Recommended actions and priority levels",
        "Comparison with previous inspection (if available)",
        "Automatic email delivery to landlord & tenant"
      ]
    },
    {
      number: 7,
      title: "Maintenance Issue Creation",
      description: "Inspection findings automatically create maintenance tickets for issues requiring attention. System categorises by urgency (emergency, urgent, routine) and routes to appropriate contractors. Links back to maintenance playbook.",
      automation: "92% automated",
      icon: Wrench,
      details: [
        "Automatic ticket creation from inspection findings",
        "Priority assignment (emergency, urgent, routine)",
        "Category detection (plumbing, electrical, etc.)",
        "Photo attachment from inspection",
        "Routing to maintenance triage workflow",
        "Tenant notification of remedial action"
      ]
    },
    {
      number: 8,
      title: "Follow-Up Workflow & Issue Resolution Tracking",
      description: "System tracks resolution of inspection findings, sends reminders to contractors, and confirms completion with tenants. Dashboard shows outstanding items per property with SLA tracking. Landlord approves completion.",
      automation: "88% automated",
      icon: CheckCircle,
      details: [
        "Outstanding issue tracking dashboard",
        "SLA monitoring for maintenance completion",
        "Contractor reminder workflows",
        "Tenant confirmation on issue resolution",
        "Landlord approval for job completion",
        "Historical trend analysis (repeat issues flagged)"
      ]
    }
  ];

  const integrations = [
    "Google Calendar / Outlook",
    "Mobile inspection apps",
    "Maintenance CRM (Fixflo, Arthur Online)",
    "WhatsApp Business API",
    "Email & SMS services",
    "Cloud storage (photo backup)"
  ];

  const pitfalls = [
    {
      problem: "Tenants claim they never received inspection notice, causing legal disputes",
      solution: "Use multi-channel notifications (WhatsApp, email, SMS) with delivery confirmation tracking. System logs all communications with timestamps. For high-risk properties, send registered post as backup and scan proof into system."
    },
    {
      problem: "Inspectors rush through checklists, missing critical issues that surface later",
      solution: "Enforce minimum time per inspection (e.g., 20 minutes for studio, 45 minutes for 5-bed house). System alerts if inspection completed suspiciously fast. Random quality audits by senior inspector with re-inspection if quality issues found."
    },
    {
      problem: "Photo documentation is inconsistent (different angles, lighting, missing rooms)",
      solution: "Provide photo guidelines within mobile app: 'Take wide-angle shot of entire room, then close-ups of any damage.' Mandatory photo count per room (e.g., minimum 3 photos per bedroom). AI flags if photos appear blurry or poorly lit."
    },
    {
      problem: "Inspection findings don't translate into maintenance action, issues languish",
      solution: "Automatically create maintenance tickets for any item rated 'fair' or 'poor'. Dashboard shows 'Inspection → Maintenance Handoff' status with SLA tracking. Escalate to landlord if maintenance not scheduled within 7 days of inspection."
    }
  ];

  const inspectionTypes = [
    {
      type: "Mid-Term Inspection",
      timing: "Week 15-20 of academic year",
      purpose: "Health & safety check, early damage detection, tenant welfare",
      focus: ["Fire safety (alarms, extinguishers)", "Damp, mould, ventilation", "Appliance functionality", "General housekeeping standards", "Tenant wellbeing check"],
      color: "text-blue-600"
    },
    {
      type: "End-of-Term Inspection",
      timing: "2-3 weeks before tenancy end",
      purpose: "Pre-checkout condition assessment, deposit deduction preparation",
      focus: ["Damage beyond wear & tear", "Cleaning standards required", "Missing items inventory", "Repair cost estimates", "Advance warning to tenant"],
      color: "text-orange-600"
    },
    {
      type: "Move-Out Inspection",
      timing: "Within 24 hours of checkout",
      purpose: "Final condition assessment, deposit deduction decision",
      focus: ["Room-by-room damage documentation", "Cleaning standard assessment", "Utility meter readings", "Key handover confirmation", "Deposit deduction calculation"],
      color: "text-red-600"
    },
    {
      type: "Health & Safety Audit",
      timing: "Annually or as required by regulations",
      purpose: "Legal compliance, safety certification, risk mitigation",
      focus: ["Fire alarm testing", "Carbon monoxide detector check", "Gas safety certification", "Electrical safety inspection", "Legionella risk assessment"],
      color: "text-green-600"
    }
  ];

  return (
    <>
      <SEOHead
        title="Inspection Scheduling Automation: Coordinated Compliance & Documentation | TermFlow"
        description="Automate property inspections from scheduling to reporting. Achieve 95% completion rate with full legal compliance, photo documentation, and 2-day turnaround. Complete playbook for PBSA operators."
        keywords="property inspection automation, inspection scheduling software, automated inspection reports, digital inspection checklist, PBSA compliance inspections, photo documentation"
        canonical="https://termflow.ai/playbooks/inspection-scheduling-automation"
        ogTitle="Inspection Scheduling Automation: 3 Hours → 40 Minutes Per Property"
        ogDescription="Battle-tested playbook for automated property inspections. Used by PBSA operators to maintain 95% completion rates with full compliance."
        ogType="article"
        ogUrl="https://termflow.ai/playbooks/inspection-scheduling-automation"
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      <ServiceSchema
        name="Automated Property Inspection Scheduling"
        description="Intelligent scheduling of mid-term and end-of-tenancy inspections with automated tenant coordination, calendar management, and follow-up for PBSA operators."
        provider={{
          name: "TermFlow",
          url: "https://termflow.co.uk"
        }}
        serviceType="Inspection Management System"
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
        <section className="py-12 bg-gradient-to-br from-teal-50 via-background to-background dark:from-teal-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4" data-testid="badge-category">
                <ClipboardCheck className="w-3 h-3 mr-1" />
                Compliance Playbook
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Inspection Scheduling: Automated Coordination & Documentation
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Stop spending hours coordinating inspections. Automate scheduling, tenant consent, photo documentation, and reporting. 
                Achieve 95% completion rate with 100% legal compliance and 2-day report turnaround.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Time Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">3hrs → 40min</p>
                    <p className="text-xs text-muted-foreground mt-1">Per property</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">95%</p>
                    <p className="text-xs text-muted-foreground mt-1">On schedule</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Report Turnaround</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">2 days</p>
                    <p className="text-xs text-muted-foreground mt-1">Average delivery</p>
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
                The Problem: Inspection Chaos Kills Completion Rates
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Property inspections are essential for compliance, safety, and deposit protection. Yet most operators struggle with:
                </p>
                
                <ul className="space-y-3 my-6">
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Spending 2-3 hours per property coordinating inspection dates with tenants</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Missing legal notice periods, exposing landlord to disputes</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Low completion rates (60-70%) due to tenant no-shows and scheduling conflicts</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Paper-based checklists that get lost or damaged, with no photo evidence</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Report generation taking 5-7 days, delaying maintenance action</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Inspection findings not translating into maintenance tickets, issues languish</span>
                  </li>
                </ul>

                <p className="text-muted-foreground leading-relaxed">
                  For a 200-bed property requiring mid-term, end-of-term, and move-out inspections, that's 600 inspections per year. 
                  At 3 hours each for coordination and reporting, that's 1,800 hours of admin work annually. Automation reduces this to 400 hours.
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
                The Solution: End-to-End Inspection Automation
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                TermFlow automates the entire inspection lifecycle from scheduling to follow-up. The system handles tenant notifications, 
                consent management, inspector assignment, photo documentation, report generation, and maintenance handoff. Staff only 
                intervene for rescheduling exceptions and final landlord approval.
              </p>

              <img 
                src="/diagrams/inspection-scheduling-flow.svg" 
                alt="Inspection scheduling automation flow diagram" 
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
                        <span>Inspection scheduling based on calendar</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Legally compliant tenant notifications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Inspector assignment & route optimization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Digital checklist & photo capture</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>PDF report generation & delivery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Maintenance ticket creation & tracking</span>
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
                        <span>Complex rescheduling requests (tenant on holiday, etc.)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Dispute resolution (tenant contests findings)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Quality audits (random inspection re-checks)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Landlord final approval (deposit deductions)</span>
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

        {/* Inspection Types */}
        <section className="py-12 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Inspection Types & Purposes</h2>
              
              <div className="space-y-4">
                {inspectionTypes.map((inspection, idx) => (
                  <Card key={idx}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-xl ${inspection.color}`}>{inspection.type}</CardTitle>
                        <Badge variant="secondary">{inspection.timing}</Badge>
                      </div>
                      <CardDescription className="text-sm mt-2">
                        <strong>Purpose:</strong> {inspection.purpose}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-semibold mb-2 text-muted-foreground">Key Focus Areas:</p>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {inspection.focus.map((area, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{area}</span>
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
                      <p className="text-3xl font-bold text-destructive">3 hours</p>
                      <p className="text-xs text-muted-foreground">Per property (coordination + reporting)</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">After Automation</p>
                      <p className="text-3xl font-bold text-green-600">40 minutes</p>
                      <p className="text-xs text-muted-foreground">Exception handling only</p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="font-semibold">For 200-bed property (600 inspections/year):</p>
                      <p className="text-2xl font-bold text-primary">1,400 hours saved</p>
                      <p className="text-sm text-muted-foreground">0.7 FTE capacity reclaimed</p>
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
                      <span className="text-sm text-muted-foreground">Completion Rate</span>
                      <span className="text-xl font-bold">95%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Notice Compliance</span>
                      <span className="text-xl font-bold">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Report Turnaround</span>
                      <span className="text-xl font-bold">2 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Photo Documentation</span>
                      <span className="text-xl font-bold">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Maintenance Handoff</span>
                      <span className="text-xl font-bold">92%</span>
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
                    <CardTitle className="text-lg">Maintenance Triage Automation</CardTitle>
                    <CardDescription>
                      Inspection findings automatically create maintenance tickets. Seamless handoff between inspections and repairs.
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

                <Card className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-lg">ID & Document Collection</CardTitle>
                    <CardDescription>
                      Similar photo documentation principles for ID verification. Automated evidence trail for compliance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="sm" data-testid="link-id-collection">
                      <Link href="/playbooks/id-document-collection">
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
                See Inspection Automation in Action
              </h2>
              <p className="text-lg opacity-90">
                Book a demo to see how TermFlow achieves 95% inspection completion rates with full legal compliance and 
                2-day report turnaround. We'll show you the mobile app, digital checklists, and automated workflows.
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
