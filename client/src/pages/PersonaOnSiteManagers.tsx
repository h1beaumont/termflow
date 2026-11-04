import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Clock, Users, CheckCircle, AlertTriangle, Target, MessageSquare, Wrench, FileText, Heart } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { SiteSearch } from "@/components/SiteSearch";

export default function PersonaOnSiteManagers() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Buyer Personas", url: "#" },
    { name: "On-Site Managers", url: "/personas/on-site-managers" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="For On-Site Accommodation Managers | TermFlow"
        description="Discover how TermFlow helps on-site accommodation managers reduce repetitive queries, improve tenant satisfaction, and reclaim time for proactive property management."
        keywords="accommodation manager, on-site property management, tenant satisfaction, maintenance coordination, student accommodation"
        canonical="https://termflow.co.uk/personas/on-site-managers"
        ogUrl="https://termflow.co.uk/personas/on-site-managers"
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
            <Home className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              For On-Site Accommodation Managers
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            You're the face of the building. Students come to you for everything from WiFi passwords to washing machine issues. You need to reduce reactive firefighting and improve tenant satisfaction.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
          </div>
        </div>

        {/* A Day in the Life */}
        <Card className="mb-8" data-testid="card-day-in-life">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-tf-navy" />
              A Day in Your Life
            </CardTitle>
            <CardDescription>
              Managing a 150-bed student property from the front desk
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">8:00 AM</span> - Office Opens
                </h3>
                <p className="text-sm text-muted-foreground">
                  Queue of 5 students waiting at reception. WiFi password resets, package collection, viewing request, noise complaint, washing machine broken again.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">10:00 AM</span> - Email Avalanche
                </h3>
                <p className="text-sm text-muted-foreground">
                  45 unread emails. Same questions you answered yesterday: "When's bin day?", "How do I use the laundry?", "Can I have an extra key?" Copying from saved responses.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">12:00 PM</span> - Maintenance Crisis
                </h3>
                <p className="text-sm text-muted-foreground">
                  Hot water down in Block B. 30 students messaging. Need to log it, call contractor, update everyone. Can't focus on the viewing you're supposed to be doing.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">2:00 PM</span> - Viewing While Managing
                </h3>
                <p className="text-sm text-muted-foreground">
                  Trying to show a prospective student around. Interrupted 4 times for package deliveries, key issues, and a student locked out. Can't give viewings proper attention.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">4:00 PM</span> - Compliance Admin
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fire safety checks due this week. Right-to-Rent documentation incomplete for 12 students. Contract renewals to process. This takes time away from community building.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">6:00 PM</span> - Evening Rush
                </h3>
                <p className="text-sm text-muted-foreground">
                  Students back from lectures with more questions. Same FAQs you answered this morning. Office technically closes at 5, but you're still here dealing with urgent issues.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pain Points */}
        <Card className="mb-8" data-testid="card-pain-points">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Your Daily Challenges
            </CardTitle>
            <CardDescription>
              What makes your job harder than it needs to be
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Repetitive Tenant Queries</h3>
                <p className="text-sm text-muted-foreground">
                  You answer the same 20 questions every single day: WiFi password, bin day, laundry instructions, guest policy. 60% of your time is spent on repetitive FAQs that could be automated.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Maintenance Coordination Chaos</h3>
                <p className="text-sm text-muted-foreground">
                  Student reports broken shower. You log it manually. Update spreadsheet. Call contractor. Chase quote. Inform student. Follow up. This same process 50 times per month. Our{" "}
                  <Link href="/playbooks/maintenance-triage-automation" className="text-primary hover:underline" data-testid="link-maintenance-triage-automation">
                    automated maintenance triage system
                  </Link>
                  {" "}can reduce this to just 2 minutes per request.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Compliance Tracking Overhead</h3>
                <p className="text-sm text-muted-foreground">
                  Right-to-Rent checks, fire safety inspections, contract renewals—all tracked in different spreadsheets. Manual reminders. No visibility on what's overdue until it's a problem.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">No Time for Proactive Work</h3>
                <p className="text-sm text-muted-foreground">
                  You want to build community, run events, improve tenant satisfaction. But you're stuck in reactive mode, responding to urgent issues all day. Proactive work never happens.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Inconsistent Communication</h3>
                <p className="text-sm text-muted-foreground">
                  When the hot water breaks, you need to update 150 students. Some get WhatsApp messages, some get emails, some see the notice on the board. No single source of truth.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Difficult to Measure Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Head office asks "How are we doing on tenant satisfaction?" You don't have data. No clear SLAs. No metrics to prove you're improving. It's all anecdotal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals & Objectives */}
        <Card className="mb-8" data-testid="card-goals">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-tf-navy" />
              What You Want to Achieve
            </CardTitle>
            <CardDescription>
              Your goals for becoming a better site manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                  <Heart className="h-6 w-6 text-tf-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Better Tenant Satisfaction</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Instant answers to common questions. Faster maintenance response. Proactive communication. Make students feel valued, not like another ticket number.
                  </p>
                  <Badge variant="secondary">Target: 4.5+ star reviews</Badge>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                  <Clock className="h-6 w-6 text-tf-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Less Reactive Firefighting</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Automate repetitive queries so you can focus on complex issues that actually need human attention. Reclaim 10+ hours per week for proactive work. See{" "}
                    <Link href="/outcomes" className="text-primary hover:underline" data-testid="link-outcomes">
                      real outcomes from on-site managers
                    </Link>
                    {" "}who've achieved this.
                  </p>
                  <Badge variant="secondary">Target: 10+ hours saved/week</Badge>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                  <FileText className="h-6 w-6 text-tf-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Clear SLA Tracking</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Know exactly how long maintenance requests take to resolve. Track response times. Identify bottlenecks. Have data to show head office you're improving.
                  </p>
                  <Badge variant="secondary">Target: Response time &lt; 4 hours</Badge>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                  <Users className="h-6 w-6 text-tf-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Build Community, Not Just Manage</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Free up time to organise events, build relationships, create a real community. That's the job you signed up for—not admin drudgery.
                  </p>
                  <Badge variant="secondary">Target: 2 events/month</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How TermFlow Helps */}
        <Card className="mb-8" data-testid="card-how-termflow-helps">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              How TermFlow Makes Your Job Easier
            </CardTitle>
            <CardDescription>
              Built for site managers who want to do more than put out fires
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-tf-navy" />
                  AI FAQ Assistant (24/7)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Students get instant answers to common questions via WhatsApp. WiFi password? Bin day? Laundry instructions? Ava handles it all automatically.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Answers 80% of repetitive queries automatically</li>
                  <li>• Works 24/7, even when office is closed</li>
                  <li>• Escalates complex issues to you with full context</li>
                  <li>• Reduces your inbox from 45 emails/day to 10</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-tf-navy" />
                  Maintenance Request Tracking
                </h3>
                <p className="text-sm text-muted-foreground">
                  Students report issues via WhatsApp. Automatically logged. Auto-assign to contractor. Track status. Close loop with tenant. All in one system. Explore our complete{" "}
                  <Link href="/playbooks/maintenance-triage-automation" className="text-primary hover:underline" data-testid="link-maintenance-triage-automation-playbook">
                    maintenance triage automation playbook
                  </Link>
                  {" "}for details.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Automatic ticket creation from WhatsApp/email</li>
                  <li>• SLA tracking: time to respond, time to resolve</li>
                  <li>• Contractor coordination with status updates</li>
                  <li>• Tenant notifications when issues resolved</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-tf-navy" />
                  Compliance Dashboard
                </h3>
                <p className="text-sm text-muted-foreground">
                  See all Right-to-Rent checks, fire safety inspections, and contract renewals in one place. Auto-reminders when things are overdue.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Visual compliance status by tenant</li>
                  <li>• Automatic reminders for expiring documents</li>
                  <li>• One-click document collection via WhatsApp</li>
                  <li>• Audit trail for inspections</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-tf-navy" />
                  Broadcast Messaging
                </h3>
                <p className="text-sm text-muted-foreground">
                  Need to update all tenants about maintenance? Send one WhatsApp message to everyone. Track who's seen it. No more notice boards.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• One-click WhatsApp broadcast to all tenants</li>
                  <li>• Segment by floor, block, or room type</li>
                  <li>• Read receipts and delivery confirmations</li>
                  <li>• Template library for common announcements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Savings */}
        <Card className="mb-8 border-2 border-tf-navy" data-testid="card-time-savings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-tf-navy" />
              Time Savings for On-Site Managers
            </CardTitle>
            <CardDescription>
              Real numbers from managers using TermFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-tf-navy mb-2">12 hours</div>
                <div className="text-sm text-muted-foreground">Per week saved on repetitive queries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tf-navy mb-2">6 hours</div>
                <div className="text-sm text-muted-foreground">Per week saved on maintenance coordination</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tf-navy mb-2">18 hours</div>
                <div className="text-sm text-muted-foreground">Total per week freed up for proactive work</div>
              </div>
            </div>

            <div className="bg-tf-navy/5 p-6 rounded-md border border-tf-navy/20">
              <h4 className="font-semibold mb-4">Weekly Time Breakdown:</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Answering repetitive FAQs (WiFi, bins, laundry, etc.)</span>
                  <div className="flex items-center gap-2">
                    <span className="line-through text-muted-foreground">15 hours</span>
                    <span className="font-semibold text-green-600">→ 3 hours</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Logging and coordinating maintenance requests</span>
                  <div className="flex items-center gap-2">
                    <span className="line-through text-muted-foreground">8 hours</span>
                    <span className="font-semibold text-green-600">→ 2 hours</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Compliance tracking and document chasing</span>
                  <div className="flex items-center gap-2">
                    <span className="line-through text-muted-foreground">5 hours</span>
                    <span className="font-semibold text-green-600">→ 1 hour</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Broadcasting updates to tenants</span>
                  <div className="flex items-center gap-2">
                    <span className="line-through text-muted-foreground">3 hours</span>
                    <span className="font-semibold text-green-600">→ 0.5 hours</span>
                  </div>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Total Time Saved Per Week</span>
                  <span className="text-tf-navy">18 hours</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-tf-navy to-tf-navy-700 rounded-lg p-8 md:p-12 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            See TermFlow in Action for Site Managers
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Book a 20-minute walkthrough tailored to on-site managers. We'll show you exactly how to reduce repetitive queries and reclaim your time. Ready to get started?{" "}
            <Link href="/start-here" className="text-white underline hover:text-white/80" data-testid="link-start-here">
              Start here
            </Link>
            {" "}for a step-by-step onboarding guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" data-testid="button-cta-demo">
              <a href="/book-demo">Book Your Free Demo</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20" data-testid="button-cta-contact">
              <a href="/contact">Talk to Our Team</a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
