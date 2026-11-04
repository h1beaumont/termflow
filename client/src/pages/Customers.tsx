import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SEOHead } from "@/components/SEOHead";
import { SiteSearch } from "@/components/SiteSearch";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { BackToTop } from "@/components/BackToTop";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  CheckCircle,
  MessageSquare,
  Building2,
  Zap,
  Award,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import headshot1 from "@assets/stock_images/professional_busines_82a17483.jpg";
import headshot2 from "@assets/stock_images/professional_busines_4a59ef67.jpg";
import headshot3 from "@assets/stock_images/professional_busines_96686da7.jpg";
import headshot4 from "@assets/stock_images/professional_busines_3eac0e8f.jpg";
import sarahHeadshot from "@assets/stock_images/friendly_young_woman_6ba1b3c2.jpg";

interface CaseStudy {
  customer: string;
  role: string;
  company: string;
  location: string;
  beds: number;
  avatar: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    before: string;
    after: string;
    improvement: string;
  }[];
  quote: string;
  integration?: string;
}

const caseStudies: CaseStudy[] = [
  {
    customer: "Sarah Mitchell",
    role: "Operations Director",
    company: "StudentStay Newcastle",
    location: "Newcastle upon Tyne",
    beds: 320,
    avatar: sarahHeadshot,
    challenge: "During clearing period, 400+ enquiries in one week overwhelmed the team. Students were waiting 24+ hours for responses, and we lost bookings to faster competitors.",
    solution: "Implemented TermFlow's AI agent (Ava) with WhatsApp integration and automated viewing scheduler. All enquiries got instant responses 24/7, and viewings were booked automatically based on calendar availability.",
    results: [
      {
        metric: "Response Time",
        before: "24+ hours",
        after: "<2 minutes",
        improvement: "95% faster"
      },
      {
        metric: "Occupancy Rate",
        before: "87%",
        after: "98%",
        improvement: "+11 pp"
      },
      {
        metric: "Admin Time/Week",
        before: "35 hours",
        after: "8 hours",
        improvement: "77% reduction"
      }
    ],
    quote: "During clearing, we had 400+ enquiries in one week. TermFlow handled every single one while we slept. The AI agent books viewings and chases applications automatically. Game-changer.",
    integration: "Integrated with Google Calendar and WhatsApp"
  },
  {
    customer: "James Chen",
    role: "Property Manager",
    company: "Metropolitan Student Living",
    location: "London",
    beds: 450,
    avatar: headshot2,
    challenge: "International students (60% of portfolio) struggled with UK guarantor requirements. Manual document collection took 15+ hours per week, and Right-to-Rent compliance was a constant worry.",
    solution: "Deployed TermFlow's Student Onboarding automation with OCR document extraction, guarantor workflows for international students, and automated Right-to-Rent compliance tracking.",
    results: [
      {
        metric: "Document Collection",
        before: "15 hrs/week",
        after: "2 hrs/week",
        improvement: "87% time saved"
      },
      {
        metric: "R2R Compliance",
        before: "92%",
        after: "100%",
        improvement: "Perfect record"
      },
      {
        metric: "Contract Completion",
        before: "8 days avg",
        after: "2 days avg",
        improvement: "75% faster"
      }
    ],
    quote: "International students love the instant WhatsApp responses in multiple languages. No more timezone issues. Contracts are signed digitally before students even arrive in the UK.",
    integration: "Integrated with DocuSign and Stripe"
  },
  {
    customer: "Emma Thompson",
    role: "Lettings Manager",
    company: "Bristol Student Homes",
    location: "Bristol",
    beds: 280,
    avatar: headshot3,
    challenge: "Maintenance requests were drowning the team. 60+ tickets per week, many duplicates or non-urgent. First response time was 4+ hours, and students complained about lack of updates.",
    solution: "Implemented TermFlow's Maintenance Triage automation with Fixflo integration. AI auto-classifies tickets, prioritizes emergencies, sends knowledge articles for common issues, and keeps students updated throughout.",
    results: [
      {
        metric: "First Response Time",
        before: "4+ hours",
        after: "<2 minutes",
        improvement: "98% faster"
      },
      {
        metric: "Duplicate Tickets",
        before: "40% of total",
        after: "14% of total",
        improvement: "65% reduction"
      },
      {
        metric: "Self-Service Resolution",
        before: "5%",
        after: "40%",
        improvement: "+35 pp"
      }
    ],
    quote: "Students get instant acknowledgment and knowledge articles for common issues. Emergencies are routed immediately. Our maintenance team can focus on actual fixes instead of inbox management.",
    integration: "Integrated with Fixflo"
  },
  {
    customer: "Michael Roberts",
    role: "Portfolio Owner",
    company: "Edinburgh Student Quarter",
    location: "Edinburgh & Glasgow",
    beds: 650,
    avatar: headshot4,
    challenge: "Rebooking rate was only 45%, losing revenue to competitors. Manual renewal process took 3-4 weeks, and we had no visibility into student satisfaction levels.",
    solution: "Launched TermFlow's Rebooking Automation with NPS surveys, personalized renewal offers, virtual tours, and one-click contract renewal. All triggered automatically based on satisfaction scores.",
    results: [
      {
        metric: "Rebooking Rate",
        before: "45%",
        after: "78%",
        improvement: "+33 pp"
      },
      {
        metric: "Time to Renewal",
        before: "3-4 weeks",
        after: "2 days avg",
        improvement: "91% faster"
      },
      {
        metric: "Annual Revenue Impact",
        before: "Baseline",
        after: "+£285k",
        improvement: "16% increase"
      }
    ],
    quote: "NPS surveys identify our promoters automatically, and they get first-pick renewal offers. The automated contract system is brilliant. Students complete applications and sign digitally - all without us lifting a finger.",
    integration: "Integrated with DocuSign and StarRez"
  }
];

export default function Customers() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Customer Success Stories | PBSA Operators Using TermFlow"
        description="Real results from PBSA operators: 77% admin reduction, 98% occupancy rates, 100% Right-to-Rent compliance. See how TermFlow transforms student accommodation operations."
        keywords="PBSA case studies, student accommodation automation, lettings automation results, PBSA success stories, termflow customers"
        canonical="https://termflow.co.uk/customers"
        ogTitle="Customer Success Stories | TermFlow"
        ogDescription="77% admin reduction, 98% occupancy, 100% compliance. Real results from PBSA operators using TermFlow automation."
        ogType="website"
        ogUrl="https://termflow.co.uk/customers"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <TermFlowWordmark />
            <SiteSearch />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">
              Home
            </Link>
            <Button asChild size="sm" variant="default" data-testid="button-book-demo">
              <Link href="/book-demo">Book Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="mb-4" data-testid="badge-customers">
              <Award className="w-3 h-3 mr-1" />
              Customer Success Stories
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Real Results from PBSA Operators Using TermFlow
            </h1>
            
            <p className="text-xl text-muted-foreground">
              From 320-bed Newcastle operations to 650-bed Scottish portfolios, 
              see how automation transforms student accommodation management.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-3xl font-bold text-primary">1,700+</div>
                <div className="text-sm text-muted-foreground">Student Beds Managed</div>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-3xl font-bold text-primary">77%</div>
                <div className="text-sm text-muted-foreground">Avg Admin Reduction</div>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Avg Occupancy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-16">
          {caseStudies.map((study, index) => (
            <Card 
              key={index} 
              className="overflow-hidden" 
              data-testid={`card-case-study-${index}`}
            >
              <CardHeader className="bg-muted/30 border-b">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary">
                    <AvatarImage src={study.avatar} alt={study.customer} />
                    <AvatarFallback>{study.customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-1">{study.customer}</CardTitle>
                    <CardDescription className="text-base">
                      {study.role}, {study.company} | {study.location}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Building2 className="w-3 h-3 mr-1" />
                        {study.beds} beds
                      </Badge>
                      {study.integration && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {study.integration}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Challenge */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-destructive" />
                    The Challenge
                  </h3>
                  <p className="text-muted-foreground">{study.challenge}</p>
                </div>

                {/* Solution */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    The Solution
                  </h3>
                  <p className="text-muted-foreground">{study.solution}</p>
                </div>

                {/* Results */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    The Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {study.results.map((result, idx) => (
                      <Card key={idx} className="bg-muted/30" data-testid={`card-result-${index}-${idx}`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {result.metric}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-muted-foreground">Before:</span>
                            <span className="font-semibold">{result.before}</span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-muted-foreground">After:</span>
                            <span className="font-semibold text-primary">{result.after}</span>
                          </div>
                          <div className="pt-2 mt-2 border-t">
                            <div className="text-center">
                              <div className="text-lg font-bold text-primary">{result.improvement}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="p-6 rounded-lg bg-primary/5 border-l-4 border-primary">
                  <p className="text-lg italic text-foreground">
                    "{study.quote}"
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    — {study.customer}, {study.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your PBSA Operations?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join operators managing 1,700+ beds who've automated their workflows with TermFlow. 
              Book a demo to see how automation can work for your portfolio.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="default" data-testid="button-book-demo-cta">
                <Link href="/book-demo">
                  Book Your Demo
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-solutions-cta">
                <Link href="/solutions">
                  View Solutions <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 TermFlow. All rights reserved.
          </p>
        </div>
      </footer>

      <BackToTop />
      <MobileStickyCTA />
    </div>
  );
}
