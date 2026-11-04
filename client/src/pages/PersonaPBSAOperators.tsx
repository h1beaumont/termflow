import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Clock, Users, CheckCircle, AlertTriangle, Target, Calendar, MessageSquare, FileCheck } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { SiteSearch } from "@/components/SiteSearch";

export default function PersonaPBSAOperators() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Buyer Personas", url: "#" },
    { name: "PBSA Operators", url: "/personas/pbsa-operators" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="For PBSA Operators (100-500 Beds) | TermFlow"
        description="Discover how TermFlow helps PBSA operators managing 100-500 beds scale without hiring, achieve 95%+ occupancy, and reduce admin by 40% during clearing season."
        keywords="PBSA operators, student accommodation automation, property management software, clearing season automation, occupancy optimization"
        canonical="https://termflow.co.uk/personas/pbsa-operators"
        ogUrl="https://termflow.co.uk/personas/pbsa-operators"
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
            <Building2 className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              For PBSA Operators Managing 100-500 Beds
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            You're managing multiple properties with a small team. Clearing season brings 400+ enquiries per week. You need to scale occupancy without scaling headcount.
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
              The reality of managing 200-400 student beds with a lean team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">6:30 AM</span> - Day Starts Early
                </h3>
                <p className="text-sm text-muted-foreground">
                  Check overnight WhatsApp messages from international students. 15 new enquiries before breakfast. Clear spam, qualify leads, respond to urgent viewing requests.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">9:00 AM</span> - Inbox Explosion
                </h3>
                <p className="text-sm text-muted-foreground">
                  Clearing results just dropped. Rightmove, Zoopla, and direct website enquiries flooding in. Phone ringing nonstop. Team already overwhelmed.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">11:00 AM</span> - Viewing Marathon
                </h3>
                <p className="text-sm text-muted-foreground">
                  Back-to-back viewings across two properties. Between viewings, manually sending booking links, chasing no-shows, updating spreadsheets.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">2:00 PM</span> - Admin Backlog
                </h3>
                <p className="text-sm text-muted-foreground">
                  Still 40 unread emails. Three students waiting for contracts. Deposit protection registrations overdue. Rightmove leads from yesterday still unanswered.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">5:00 PM</span> - Evening Shift
                </h3>
                <p className="text-sm text-muted-foreground">
                  International students coming online. More enquiries via WhatsApp in Mandarin, Arabic, Spanish. Using Google Translate to respond.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">9:00 PM</span> - Still Working
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manually generating contracts, chasing late responses, preparing tomorrow's viewing schedule. Know you'll be checking messages again before bed.
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
              Your Biggest Challenges
            </CardTitle>
            <CardDescription>
              What keeps you up at night during clearing season
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Clearing Season Overwhelm</h3>
                <p className="text-sm text-muted-foreground">
                  August-September brings 400+ enquiries per week. Your team of 3 can't physically respond fast enough. Leads go cold while you're on viewings. You know you're losing bookings to faster competitors.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">24/7 Enquiry Expectations</h3>
                <p className="text-sm text-muted-foreground">
                  International students expect instant responses. They're messaging at 11 PM your time. If you don't reply within an hour, they've already booked elsewhere. You can't afford to hire night staff.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Manual Process Bottlenecks</h3>
                <p className="text-sm text-muted-foreground">
                  Every booking requires 15+ manual steps: send viewing link, follow up, generate contract, chase signature, register deposit, update spreadsheet. This doesn't scale. Our{" "}
                  <Link href="/automation-ideas" className="text-primary hover:underline" data-testid="link-automation-ideas">
                    automation ideas library
                  </Link>
                  {" "}shows 30+ workflow optimizations that eliminate these bottlenecks.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Occupancy Pressure</h3>
                <p className="text-sm text-muted-foreground">
                  You need 95%+ occupancy by September to hit revenue targets. Every empty bed costs £500/month. But you're spending so much time on admin, you can't focus on conversions.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Can't Scale Without Hiring</h3>
                <p className="text-sm text-muted-foreground">
                  You want to add another 100 beds next year, but your current team is maxed out. Hiring is expensive and risky. You need leverage that doesn't require more salaries.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Inconsistent Experience</h3>
                <p className="text-sm text-muted-foreground">
                  When you're rushed, enquiry responses vary in quality. Some students get detailed answers, others get one-liners. This hurts conversion rates and brand perception.
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
              What You're Trying to Achieve
            </CardTitle>
            <CardDescription>
              Your strategic objectives for the next 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                  <TrendingUp className="h-6 w-6 text-tf-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Scale Without Hiring</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Add 100 more beds next year without adding headcount. Use automation to create leverage, not just efficiency.
                  </p>
                  <Badge variant="secondary">Target: 40% admin reduction</Badge>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                  <Building2 className="h-6 w-6 text-tf-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">95%+ Occupancy by September</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Reduce void costs by filling beds faster. Convert more enquiries during peak season by responding instantly, even at 2 AM.
                  </p>
                  <Badge variant="secondary">Target: 95%+ occupancy</Badge>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                  <Clock className="h-6 w-6 text-tf-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Reduce Admin Time by 40%</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Free up 20+ hours per week currently spent on repetitive tasks. Redirect this time to higher-value activities like partnership development and portfolio growth.
                  </p>
                  <Badge variant="secondary">Target: 20+ hours saved/week</Badge>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                  <Users className="h-6 w-6 text-tf-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Consistent Student Experience</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Every enquiry gets the same high-quality response within 5 minutes, regardless of time of day or staff availability.
                  </p>
                  <Badge variant="secondary">Target: 5min response time</Badge>
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
              How TermFlow Solves Your Problems
            </CardTitle>
            <CardDescription>
              Purpose-built automation for PBSA operators like you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-tf-navy" />
                  24/7 AI Assistant (Ava)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ava responds to every enquiry within 30 seconds, 24/7. Handles clearing season surges without breaking a sweat. Qualifies leads, answers property questions, books viewings—all automatically. Learn more about our{" "}
                  <Link href="/playbooks/tenant-onboarding-automation" className="text-primary hover:underline" data-testid="link-tenant-onboarding-automation">
                    automated tenant onboarding workflows
                  </Link>
                  .
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Instant responses in 25+ languages</li>
                  <li>• Handles 400+ enquiries/week during clearing</li>
                  <li>• Escalates complex queries to your team</li>
                  <li>• Works while you sleep (perfect for international students)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-tf-navy" />
                  Automated Viewing Booking
                </h3>
                <p className="text-sm text-muted-foreground">
                  Students book viewings directly from WhatsApp. Syncs with your calendar. Automatic reminders reduce no-shows by 60%.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Two-way Google Calendar sync</li>
                  <li>• Automatic WhatsApp/SMS reminders</li>
                  <li>• Virtual viewing links for international students</li>
                  <li>• Post-viewing follow-up automation</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-tf-navy" />
                  Digital Contract Automation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Generate, send, and track contracts with one click. Students sign on mobile. Deposits auto-protected. Compliance handled. Our{" "}
                  <Link href="/playbooks/id-document-collection" className="text-primary hover:underline" data-testid="link-id-document-collection">
                    automated ID document collection system
                  </Link>
                  {" "}ensures Right-to-Rent compliance with 98% OCR accuracy.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• One-click contract generation</li>
                  <li>• Mobile-friendly e-signatures</li>
                  <li>• Automatic deposit protection registration</li>
                  <li>• Right-to-Rent document collection</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-tf-navy" />
                  Real-Time Portfolio Dashboard
                </h3>
                <p className="text-sm text-muted-foreground">
                  See occupancy, pipeline, and conversion metrics across all properties in real-time. Make data-driven decisions during clearing.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Live occupancy tracking by property</li>
                  <li>• Conversion funnel analytics</li>
                  <li>• Revenue forecasting</li>
                  <li>• Lead source ROI analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI for Operators */}
        <Card className="mb-8 border-2 border-tf-navy" data-testid="card-roi">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tf-navy" />
              ROI for a 300-Bed Operator
            </CardTitle>
            <CardDescription>
              Real numbers from operators using TermFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-tf-navy mb-2">£12,400</div>
                <div className="text-sm text-muted-foreground">Annual savings from reduced admin time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tf-navy mb-2">£18,000</div>
                <div className="text-sm text-muted-foreground">Additional revenue from 3% occupancy uplift</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tf-navy mb-2">£30,400</div>
                <div className="text-sm text-muted-foreground">Total annual value vs £3,588 annual cost</div>
              </div>
            </div>

            <div className="bg-tf-navy/5 p-6 rounded-md border border-tf-navy/20">
              <h4 className="font-semibold mb-4">Breakdown:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">20 hours/week saved @ £20/hour × 52 weeks</span>
                  <span className="font-semibold">£20,800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avoided new hire (clearing season relief)</span>
                  <span className="font-semibold">£8,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">6 extra beds filled (92% → 95% occupancy) @ £500/bed/month × 10 months</span>
                  <span className="font-semibold">£30,000</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span>Total Annual Value</span>
                  <span className="text-tf-navy">£58,800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TermFlow Annual Cost (£299/month × 12)</span>
                  <span className="font-semibold">-£3,588</span>
                </div>
                <div className="border-t border-tf-navy pt-2 flex justify-between font-bold text-lg">
                  <span>Net Annual Benefit</span>
                  <span className="text-tf-navy">£55,212</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-tf-navy to-tf-navy-700 rounded-lg p-8 md:p-12 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            See How TermFlow Works for PBSA Operators
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Book a 30-minute demo to see the platform in action. We'll show you how operators like you are scaling to 95%+ occupancy without adding headcount. Check out our{" "}
            <Link href="/outcomes" className="text-white underline hover:text-white/80" data-testid="link-outcomes">
              real outcomes from PBSA operators
            </Link>
            {" "}to see quantifiable results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" data-testid="button-cta-demo">
              <a href="/book-demo">Book Your Free Demo</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20" data-testid="button-cta-calculator">
              <a href="/roi-calculator">Calculate Your ROI</a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
