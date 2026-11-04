import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Rocket, Calendar, Database, Users, TrendingUp, AlertTriangle, FileText, MessageSquare } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { SiteSearch } from "@/components/SiteSearch";
import { FAQ, FAQItem } from "@/components/FAQ";

export default function StartHere() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Start Here", url: "/start-here" }
  ];
  const faqItems: FAQItem[] = [
    {
      question: "How long does implementation actually take?",
      answer: "Most operators are live in 10-14 days. This includes: property data import (2 days), calendar integration (1 day), AI training on your properties (3 days), WhatsApp setup (1 day), team training (2 days), and live testing (2-3 days). We've had operators go live in as little as 7 days when they have all their data ready."
    },
    {
      question: "What if my property data is messy or incomplete?",
      answer: "We help you clean it up during onboarding. Our team will audit your current data (spreadsheets, CRM exports, etc.) and work with you to fill gaps. Most operators discover their data is better than they thought—we just need room names, bed counts, pricing, and basic amenities to get started."
    },
    {
      question: "Do I need technical knowledge to set this up?",
      answer: "No. Our onboarding team handles all technical configuration. You'll need to provide access to your Google Calendar, property data, and approve WhatsApp Business API setup—but we do the heavy lifting. If you can use email and spreadsheets, you can use TermFlow."
    },
    {
      question: "What happens if something breaks during implementation?",
      answer: "We have rollback procedures at every stage. If integration fails, we revert to manual process while we troubleshoot—you never lose access to leads. Our onboarding team monitors your setup daily and catches issues before they impact operations."
    },
    {
      question: "Can I trial it on one property before rolling out to my whole portfolio?",
      answer: "Yes. Most operators start with 1-2 pilot properties to prove ROI before expanding. This reduces risk and lets your team learn the system. Once you see results (typically 30 days), rolling out to other properties is quick—just duplicate the pilot configuration."
    },
    {
      question: "How much of my team's time does onboarding require?",
      answer: "Expect 8-12 hours total from your team across the 2-week period: initial discovery call (1 hour), data preparation (3-4 hours), calendar setup (1 hour), AI training review (2 hours), team training sessions (2 hours), and testing/feedback (2-3 hours). We schedule around your availability."
    },
    {
      question: "What if my team resists using AI to talk to students?",
      answer: "We address this head-on in training. Show your team that Ava handles repetitive queries (\"When's bin day?\") while they focus on complex issues. Most teams love it once they see Ava handling midnight enquiries they used to deal with. We provide scripts for explaining this to students too."
    },
    {
      question: "Do I need to migrate all my old student data?",
      answer: "No. We focus on active tenancies and incoming enquiries. Historical data can stay in your old system—we only import what's needed for current operations. This simplifies migration and reduces risk."
    },
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="Getting Started with TermFlow | Onboarding Guide"
        description="Learn how to get started with TermFlow in 1-2 weeks. Step-by-step onboarding process, what to prepare, expected timeline, and KPIs to track for PBSA automation success."
        keywords="TermFlow onboarding, PBSA implementation, student accommodation software setup, automation onboarding, getting started guide"
        canonical="https://termflow.co.uk/start-here"
        ogUrl="https://termflow.co.uk/start-here"
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
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              Getting Started with TermFlow
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            From signed contract to live automation in 1-2 weeks. Here's exactly what to expect during onboarding and how to set yourself up for success. Explore our{" "}
            <Link href="/playbooks" className="text-primary hover:underline" data-testid="link-playbooks">
              automation playbooks
            </Link>
            {" "}to see what you'll be able to automate.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
          </div>
        </div>

        {/* Timeline Overview */}
        <Card className="mb-12 border-2 border-tf-navy" data-testid="card-timeline">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-tf-navy" />
              Implementation Timeline
            </CardTitle>
            <CardDescription>
              Typical 10-14 day onboarding from kickoff to go-live
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-8">
                {/* Day 1-2: Discovery */}
                <div className="flex gap-6 relative">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-tf-navy text-white flex items-center justify-center font-bold z-10">
                    Days 1-2
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-bold mb-2">Discovery & Planning</h3>
                    <p className="text-muted-foreground mb-4">
                      Kickoff call to understand your properties, current processes, and goals. We audit your existing data and create a customised implementation plan.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Kickoff call with your team (1 hour)</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Property data audit and cleanup plan</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Calendar and integration requirements review</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Implementation timeline agreed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day 3-5: Data Migration */}
                <div className="flex gap-6 relative">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-tf-navy text-white flex items-center justify-center font-bold z-10">
                    Days 3-5
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-bold mb-2">Data Migration & Integration</h3>
                    <p className="text-muted-foreground mb-4">
                      Import your property data, connect calendars, and set up integrations. Our team does the heavy lifting—you just review and approve.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Property data imported (rooms, pricing, amenities)</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Google Calendar two-way sync configured</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>WhatsApp Business API setup and verified</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Stripe/payment integration connected</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day 6-8: AI Training */}
                <div className="flex gap-6 relative">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-tf-navy text-white flex items-center justify-center font-bold z-10">
                    Days 6-8
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-bold mb-2">AI Training & Customisation</h3>
                    <p className="text-muted-foreground mb-4">
                      Train Ava on your properties, policies, and tone of voice. Test responses and refine until you're confident.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>AI trained on property details and FAQs</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Brand voice and tone customisation</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Test conversations with feedback loop</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Escalation rules configured</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day 9-10: Team Training */}
                <div className="flex gap-6 relative">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-tf-navy text-white flex items-center justify-center font-bold z-10">
                    Days 9-10
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-bold mb-2">Team Training</h3>
                    <p className="text-muted-foreground mb-4">
                      Hands-on training for your team. Learn how to monitor Ava, handle escalations, track analytics, and manage contracts. Training covers workflows from our{" "}
                      <Link href="/playbooks" className="text-primary hover:underline" data-testid="link-playbooks-library">
                        playbooks library
                      </Link>
                      .
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Dashboard walkthrough and key metrics</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Viewing management and calendar usage</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Contract generation and e-signature process</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Escalation handling and AI supervision</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day 11-14: Go Live */}
                <div className="flex gap-6 relative">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center font-bold z-10">
                    Days 11-14
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Testing & Go-Live</h3>
                    <p className="text-muted-foreground mb-4">
                      Soft launch with monitoring, then full go-live. We watch your first 100 enquiries closely and make real-time adjustments.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Soft launch: monitor first 50 conversations</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Real-time adjustments based on feedback</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Full go-live and handoff to support team</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>30-day check-in scheduled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What You Need to Prepare */}
        <Card className="mb-12" data-testid="card-preparation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-tf-navy" />
              What You Need to Prepare
            </CardTitle>
            <CardDescription>
              Gather these before your kickoff call to accelerate onboarding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-tf-navy" />
                  Property Data
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Property addresses and names</li>
                  <li>• Room list (name, type, bed count, pricing)</li>
                  <li>• Amenities and features per property</li>
                  <li>• Tenancy start/end dates (academic year dates)</li>
                  <li>• Photos/videos (if available)</li>
                  <li>• Floor plans (optional, but helpful)</li>
                </ul>
                <p className="text-sm text-muted-foreground italic">
                  Format: Spreadsheet (Excel/Google Sheets) or export from your current CRM
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-tf-navy" />
                  Calendar Access
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Google Calendar admin access (for viewing scheduler)</li>
                  <li>• Staff availability patterns</li>
                  <li>• Viewing slot preferences (e.g., 30 min slots, 9am-5pm)</li>
                  <li>• Blackout dates (when viewings can't be booked)</li>
                </ul>
                <p className="text-sm text-muted-foreground italic">
                  We'll configure two-way sync so Ava books viewings directly into your calendar
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-tf-navy" />
                  WhatsApp Business Number
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dedicated phone number for WhatsApp Business API</li>
                  <li>• Can be a new number or existing landline (we help port)</li>
                  <li>• Facebook Business Manager account (we can create one)</li>
                  <li>• Business verification documents (if not already verified)</li>
                </ul>
                <p className="text-sm text-muted-foreground italic">
                  Takes 2-3 days for Meta to approve WhatsApp Business API access
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-tf-navy" />
                  Team & Processes
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• List of staff who need TermFlow access</li>
                  <li>• Current enquiry response templates/scripts (if any)</li>
                  <li>• FAQs students commonly ask</li>
                  <li>• Policies (pets, guests, deposits, Right-to-Rent, etc.)</li>
                  <li>• Contract templates (we'll digitise these)</li>
                </ul>
                <p className="text-sm text-muted-foreground italic">
                  We use your existing knowledge to train Ava—no need to start from scratch
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs to Track */}
        <Card className="mb-12" data-testid="card-kpis">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tf-navy" />
              KPIs to Track (First 30/60/90 Days)
            </CardTitle>
            <CardDescription>
              Measure success and identify opportunities for improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full" data-testid="accordion-kpis">
              <AccordionItem value="30-days">
                <AccordionTrigger className="text-lg font-semibold">First 30 Days: Baseline & Early Wins</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <h4 className="font-semibold mb-2">Response Time Metrics</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Average response time (target: &lt;30 seconds)</li>
                      <li>• % of enquiries answered by Ava vs escalated to humans (target: 80% Ava, 20% human)</li>
                      <li>• Response time distribution (0-1 min, 1-5 min, 5+ min)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">AI Accuracy</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• % of Ava responses rated as accurate (manual review of 50 conversations)</li>
                      <li>• Common questions Ava struggles with (we refine these)</li>
                      <li>• Escalation rate by question type</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Early Conversion Signals</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Viewing booking rate (% of enquiries that book a viewing)</li>
                      <li>• No-show rate for automated bookings</li>
                      <li>• Time from enquiry to viewing booked</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="60-days">
                <AccordionTrigger className="text-lg font-semibold">60 Days: Optimisation Phase</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <h4 className="font-semibold mb-2">Conversion Funnel</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Enquiry → Viewing booked (target: 60%)</li>
                      <li>• Viewing attended → Application started (target: 70%)</li>
                      <li>• Application → Contract signed (target: 85%)</li>
                      <li>• Overall enquiry → contract conversion rate (target: 35%+)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Time Savings</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Hours saved per week on enquiry responses</li>
                      <li>• Hours saved on viewing coordination</li>
                      <li>• Hours saved on contract generation and tracking</li>
                      <li>• Total admin time reduction (target: 20+ hours/week)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Lead Quality</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Lead source performance (Rightmove vs Zoopla vs direct)</li>
                      <li>• International vs domestic student conversion rates</li>
                      <li>• Peak enquiry times and Ava's handling capacity</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="90-days">
                <AccordionTrigger className="text-lg font-semibold">90 Days: ROI Validation</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <h4 className="font-semibold mb-2">Occupancy Impact</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Current occupancy vs pre-TermFlow baseline</li>
                      <li>• Days to full occupancy (vs historical average)</li>
                      <li>• Void rate reduction (empty beds)</li>
                      <li>• Revenue per available bed (RevPAB) improvement</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Cost Savings</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Admin hours saved (£ value)</li>
                      <li>• Temp staff avoided during clearing (£ value)</li>
                      <li>• Cost per lead vs pre-TermFlow</li>
                      <li>• Cost per signed contract vs pre-TermFlow</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Portfolio Health</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Lead-to-contract time (target: {'<'}10 days)</li>
                      <li>• Contract signing rate (% of viewings → signed contracts)</li>
                      <li>• Student satisfaction scores (if collected)</li>
                      <li>• Team satisfaction (less admin burden)</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Risk Mitigation */}
        <Card className="mb-12" data-testid="card-risks">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Risk Mitigation: What Could Go Wrong
            </CardTitle>
            <CardDescription>
              Common concerns and how we address them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-amber-500">⚠</span>
                  "What if Ava gives wrong information to students?"
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Mitigation:</strong> We manually review Ava's first 100 conversations with you. You can override any response in real-time. Ava is trained to say "Let me connect you with a team member" if uncertain. We track accuracy weekly and refine continuously.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-amber-500">⚠</span>
                  "What if calendar integration breaks and viewings get double-booked?"
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Mitigation:</strong> Two-way sync prevents double-booking. If sync fails (rare), Ava stops booking automatically and notifies you. We monitor integration health 24/7 and fix issues within 2 hours.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-amber-500">⚠</span>
                  "What if our team doesn't adopt the new system?"
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Mitigation:</strong> We involve your team from day one. Training is hands-on, not theoretical. We show them how Ava saves them time (not replaces them). Change management support included for 60 days post-launch.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-amber-500">⚠</span>
                  "What if WhatsApp Business API gets rejected by Meta?"
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Mitigation:</strong> We handle the application and have a 98% approval rate. If rejected, we troubleshoot with Meta support. Meanwhile, Ava works via email and web chat—WhatsApp is a bonus, not a dependency.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-amber-500">⚠</span>
                  "What if TermFlow goes down during clearing season?"
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Mitigation:</strong> 99.9% uptime SLA. Automatic failover to backup systems. During critical periods (clearing), we monitor 24/7. If downtime occurs, we have a manual fallback plan you can activate instantly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions About Getting Started</h2>
          <FAQ items={faqItems} />
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-tf-navy to-tf-navy-700 rounded-lg p-8 md:p-12 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Book a discovery call and we'll create a custom implementation plan for your portfolio. No obligation—just a clear path from where you are to where you want to be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" data-testid="button-cta-demo">
              <a href="/book-demo">
                <Rocket className="mr-2 h-4 w-4" />
                Book Discovery Call
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20" data-testid="button-cta-contact">
              <a href="/contact">Talk to Onboarding Team</a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
