import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";
import { 
  UserPlus, FileCheck2, Wrench, PoundSterling, 
  ClipboardCheck, Users, Filter, Clock, Zap, ArrowRight
} from "lucide-react";
import { useState } from "react";

interface Playbook {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'Onboarding' | 'Operations' | 'Compliance' | 'Financial';
  icon: React.ElementType;
  timeSavings: string;
  automationPercentage: number;
  color: string;
}

const playbooks: Playbook[] = [
  {
    id: "1",
    slug: "tenant-onboarding-automation",
    title: "Tenant Onboarding Automation",
    description: "From enquiry to move-in. Automate viewings, applications, ID checks, contracts, and deposits. Complete onboarding in 6 days.",
    category: "Onboarding",
    icon: UserPlus,
    timeSavings: "12 hours → 45 minutes",
    automationPercentage: 95,
    color: "text-blue-600"
  },
  {
    id: "2",
    slug: "id-document-collection",
    title: "ID & Document Collection",
    description: "Automated document requests, OCR extraction, and compliance checks. No more chasing tenants for passports and visas.",
    category: "Compliance",
    icon: FileCheck2,
    timeSavings: "4 hours → 15 minutes",
    automationPercentage: 92,
    color: "text-green-600"
  },
  {
    id: "3",
    slug: "maintenance-triage-automation",
    title: "Maintenance Triage & Routing",
    description: "AI-powered triage, smart routing, SLA tracking. Handle maintenance requests 30% faster with automated prioritisation.",
    category: "Operations",
    icon: Wrench,
    timeSavings: "2 hours/day → 20 minutes",
    automationPercentage: 88,
    color: "text-orange-600"
  },
  {
    id: "4",
    slug: "arrears-nudging-automation",
    title: "Arrears Management & Nudges",
    description: "Automated rent reminders, escalation workflows, and payment links. Reduce arrears by £18k/year per 100 beds.",
    category: "Financial",
    icon: PoundSterling,
    timeSavings: "6 hours/week → 30 minutes",
    automationPercentage: 85,
    color: "text-purple-600"
  },
  {
    id: "5",
    slug: "inspection-scheduling-automation",
    title: "Inspection Scheduling & Documentation",
    description: "Automated coordination, tenant consent, photo documentation, and reporting. 95% completion rate with full compliance.",
    category: "Compliance",
    icon: ClipboardCheck,
    timeSavings: "3 hours → 40 minutes",
    automationPercentage: 90,
    color: "text-teal-600"
  },
  {
    id: "6",
    slug: "room-allocation-optimization",
    title: "Room Allocation & Matching",
    description: "AI-powered matching based on preferences, groups, and fairness. Achieve 87% first-choice allocation satisfaction.",
    category: "Operations",
    icon: Users,
    timeSavings: "8 hours → 1 hour",
    automationPercentage: 87,
    color: "text-pink-600"
  }
];

export default function PlaybooksHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', 'Onboarding', 'Operations', 'Compliance', 'Financial'];
  
  const filteredPlaybooks = selectedCategory === 'All' 
    ? playbooks 
    : playbooks.filter(p => p.category === selectedCategory);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Playbooks", url: "/playbooks" }
  ];

  return (
    <>
      <SEOHead
        title="PBSA Automation Playbooks | 6 Battle-Tested Workflows - TermFlow"
        description="Proven automation playbooks for PBSA operators: tenant onboarding, ID collection, maintenance triage, arrears management, inspections, and room allocation. Save 20+ hours/week."
        keywords="PBSA automation playbooks, student accommodation workflows, lettings automation guides, property management playbooks, tenant onboarding automation"
        canonical="https://termflow.ai/playbooks"
        ogTitle="6 Battle-Tested Automation Playbooks for PBSA Operators"
        ogDescription="Detailed workflow guides to automate your student accommodation operations. Proven by operators managing 20,000+ beds."
        ogType="website"
        ogUrl="https://termflow.ai/playbooks"
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

      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-8">
          <Breadcrumb items={breadcrumbItems} />
          <LastUpdated date="January 20, 2025" className="mb-8" />
        </div>

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge className="mb-4" data-testid="badge-playbooks">
                <Zap className="w-3 h-3 mr-1" />
                Automation Playbooks
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                6 Battle-Tested Workflows to Automate Your PBSA Operations
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Proven automation playbooks used by{" "}
                <Link href="/personas/pbsa-operators" className="text-primary hover:underline" data-testid="link-pbsa-operators">
                  PBSA operators
                </Link>
                {" "}managing 20,000+ student beds across the UK. 
                Each playbook includes step-by-step implementation guides, flow diagrams, and real success metrics.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Save 20+ hours/week</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="font-semibold">85-95% automation</span>
                </div>
              </div>

              <div className="pt-6">
                <Button asChild size="lg" data-testid="button-book-demo">
                  <Link href="/book-demo">
                    Book a Demo to See These in Action
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 border-b bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filter by category:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    data-testid={`button-filter-${category.toLowerCase()}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Playbooks Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaybooks.map((playbook) => {
                const Icon = playbook.icon;
                return (
                  <Card 
                    key={playbook.id} 
                    className="hover-elevate transition-all duration-300"
                    data-testid={`card-playbook-${playbook.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-lg bg-muted ${playbook.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" data-testid={`badge-category-${playbook.id}`}>
                          {playbook.category}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl">
                        {playbook.title}
                      </CardTitle>
                      
                      <CardDescription className="text-sm leading-relaxed">
                        {playbook.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Time Savings */}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">{playbook.timeSavings}</span>
                      </div>

                      {/* Automation Percentage */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Automation</span>
                          <span className="font-semibold">{playbook.automationPercentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-primary h-full transition-all duration-500"
                            style={{ width: `${playbook.automationPercentage}%` }}
                          />
                        </div>
                      </div>

                      <Button 
                        asChild 
                        variant="outline" 
                        className="w-full"
                        data-testid={`button-read-playbook-${playbook.id}`}
                      >
                        <Link href={`/playbooks/${playbook.slug}`}>
                          Read Playbook
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">
                See These Playbooks in Action
              </h2>
              <p className="text-lg text-muted-foreground">
                Book a personalised demo to see how these workflows can transform your PBSA operations. 
                We'll show you the exact automation flows, integrations, and results. Check out our{" "}
                <Link href="/automation-ideas" className="text-primary hover:underline" data-testid="link-automation-ideas">
                  automation ideas library
                </Link>
                {" "}for 30+ additional workflow optimizations, or{" "}
                <Link href="/start-here" className="text-primary hover:underline" data-testid="link-start-here">
                  start here
                </Link>
                {" "}to learn about implementation.
              </p>
              <div className="pt-4">
                <Button asChild size="lg" data-testid="button-book-demo-footer">
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
        <div className="container mx-auto px-4 py-6 text-center">
          <Badge variant="outline" data-testid="badge-last-updated">
            Last Updated: January 2025
          </Badge>
        </div>

        <Footer />
      </div>
    </>
  );
}
