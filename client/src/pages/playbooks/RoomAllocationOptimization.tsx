import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { ServiceSchema } from "@/components/ServiceSchema";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema} from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";
import { 
  Users, Clock, CheckCircle, AlertTriangle, ArrowRight,
  FormInput, UserPlus, Zap, Eye, FileText, AlertCircle
} from "lucide-react";

export default function RoomAllocationOptimization() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Playbooks", url: "/playbooks" },
    { name: "Room Allocation Optimization", url: "/playbooks/room-allocation-optimization" }
  ];
  const steps = [
    {
      number: 1,
      title: "Preference Collection During Application",
      description: "Students submit room preferences during application: room type (ensuite, shared bathroom), floor preference, flatmate requests, amenities (quiet vs social, ground floor for accessibility). Mobile-optimised form with photos of room types.",
      automation: "100% automated",
      icon: FormInput,
      details: [
        "Room type preferences (ensuite, standard, premium)",
        "Floor/location preferences (ground floor, specific building)",
        "Flatmate group requests (friends want to live together)",
        "Lifestyle preferences (quiet study vs social)",
        "Special requirements (accessibility, allergies)",
        "Amenity priorities (ensuite, desk space, storage)"
      ]
    },
    {
      number: 2,
      title: "Group Booking Handling",
      description: "System identifies friend groups who want to live together. Links applications and flags group size compatibility with available flats. Supports groups of 2-8 students, automatically suggesting suitable properties.",
      automation: "92% automated",
      icon: UserPlus,
      details: [
        "Automatic group detection from shared references",
        "Manual group linking by applicants",
        "Group size validation (matches flat configurations)",
        "Mixed-gender group handling (if policy allows)",
        "Partial group allocation (if preferred flat unavailable)",
        "Group priority scoring (complete groups prioritised)"
      ]
    },
    {
      number: 3,
      title: "AI Matching Algorithm",
      description: "Machine learning algorithm optimises allocation based on: student preferences, room availability, group requests, nationality diversity, and fairness across cohorts. Runs optimisation to maximise overall satisfaction whilst maintaining equitable distribution.",
      automation: "90% automated",
      icon: Zap,
      details: [
        "Preference matching (room type, location, flatmates)",
        "Group allocation optimisation",
        "Diversity scoring (avoid nationality clustering)",
        "Fairness constraints (equitable distribution across cohorts)",
        "Accessibility priority (students with disabilities)",
        "Late applicant handling (fill remaining rooms)"
      ]
    },
    {
      number: 4,
      title: "Draft Allocation Generation",
      description: "System generates draft allocation with satisfaction scores per student (0-100%). Dashboard shows: first-choice allocation rate, diversity metrics, and flagged conflicts. Landlord reviews before finalising.",
      automation: "95% automated",
      icon: Eye,
      details: [
        "Draft allocation with satisfaction scores",
        "First-choice allocation percentage dashboard",
        "Diversity metrics (nationality, gender, course)",
        "Conflict detection (incompatible flatmates)",
        "Manual override options for edge cases",
        "What-if scenario testing (landlord can re-run)"
      ]
    },
    {
      number: 5,
      title: "Landlord Approval & Manual Overrides",
      description: "Landlord reviews draft allocation, makes manual adjustments for edge cases (e.g., move specific student to different flat for pastoral reasons). System recalculates scores after each change. Final approval locks allocation.",
      automation: "60% automated",
      icon: CheckCircle,
      details: [
        "Review dashboard with filter/search",
        "Manual room swap functionality",
        "Reason logging for manual changes",
        "Recalculation of satisfaction scores",
        "Bulk approval for entire allocation",
        "Undo/redo for manual changes"
      ]
    },
    {
      number: 6,
      title: "Automated Tenant Notifications",
      description: "Once approved, system sends personalised room assignment notifications to all students: room number, flatmate names, floor plan, move-in date. Includes icebreaker prompts to encourage flatmate introductions.",
      automation: "100% automated",
      icon: FileText,
      details: [
        "Personalised room assignment email/WhatsApp",
        "Flatmate introductions (names, courses, hobbies)",
        "Interactive floor plan with room location",
        "Move-in instructions and checklist",
        "Icebreaker prompts (favourite foods, music, study habits)",
        "Contact details for flatmates (opt-in)"
      ]
    },
    {
      number: 7,
      title: "Confirmation & Contract Generation",
      description: "Students confirm room acceptance via self-service portal. System auto-generates tenancy agreements with room-specific details (room number, rent amount, flatmate names). Links to contract signing workflow.",
      automation: "95% automated",
      icon: FileText,
      details: [
        "One-click room acceptance portal",
        "Contract generation with room details",
        "Automatic rent calculation (room type pricing)",
        "Flatmate list inclusion in contract",
        "Link to contract signing playbook",
        "Rejection handling (releases room for re-allocation)"
      ]
    }
  ];

  const integrations = [
    "Property management system (room inventory)",
    "Student CRM (application data)",
    "Contract generation (DocuSign, Signable)",
    "WhatsApp Business API",
    "Email systems",
    "Analytics dashboard"
  ];

  const pitfalls = [
    {
      problem: "Algorithm prioritises individual preferences over group requests, splitting friend groups",
      solution: "Implement group priority weighting: complete friend groups score 2x individual preference satisfaction. System tries to keep groups together unless it's impossible (e.g., group of 7 but only 5-bed or 6-bed flats available). In such cases, automatically suggests alternative: split into 3+4 or offer nearby rooms."
    },
    {
      problem: "Nationality clustering creates cultural isolation (e.g., all Chinese students in one flat)",
      solution: "Implement diversity constraints: max 50% of any nationality per flat (configurable). Algorithm penalises homogeneous allocations. Exception: students who explicitly request same-nationality flatmates can override. Dashboard shows diversity metrics to track compliance."
    },
    {
      problem: "Late applicants get leftover poor-quality rooms, leading to dissatisfaction",
      solution: "Reserve 10-15% of mid-tier rooms for late applicants and clearing season. Don't fill 100% capacity with early applicants. This ensures late applicants still get reasonable choices. Alternatively, offer incentive (e.g., £50 discount) for students willing to take less popular rooms."
    },
    {
      problem: "Students reject room allocation, creating last-minute vacancies",
      solution: "Implement waitlist system: students who didn't get first-choice can opt into waitlist for preferred room types. When rejection occurs, system automatically offers room to highest-priority waitlist student. Rejection deadline enforced (7 days to accept/reject) to avoid last-minute chaos."
    }
  ];

  const matchingCriteria = [
    {
      criterion: "Room Type Preferences",
      weight: "35%",
      description: "Ensuite vs standard, premium vs basic, single vs shared amenities",
      examples: ["Student requests ensuite → Allocated ensuite room", "Student accepts shared bathroom → Standard room with 5 others sharing"]
    },
    {
      criterion: "Group Requests",
      weight: "30%",
      description: "Friend groups wanting to live together in same flat",
      examples: ["Group of 4 friends → 5-bed flat with one additional student", "Group of 6 → Entire 6-bed house"]
    },
    {
      criterion: "Lifestyle Compatibility",
      weight: "15%",
      description: "Quiet vs social, early riser vs night owl, study habits",
      examples: ["Quiet studious student → Flat with similar students", "Social extrovert → Flat with party-friendly residents"]
    },
    {
      criterion: "Diversity & Fairness",
      weight: "10%",
      description: "Nationality mix, gender balance, course distribution",
      examples: ["Prevent all-Chinese flat", "Mix of law, engineering, business students"]
    },
    {
      criterion: "Special Requirements",
      weight: "10%",
      description: "Accessibility needs, medical requirements, religious considerations",
      examples: ["Wheelchair user → Ground floor accessible room", "Vegan student → Separate fridge space"]
    }
  ];

  return (
    <>
      <SEOHead
        title="Room Allocation Optimization: AI-Powered Matching & Fairness | TermFlow"
        description="Automate student room allocation with AI-powered matching. Achieve 87% first-choice allocation, 4.2/5 satisfaction, and 90% faster process. Battle-tested playbook for PBSA operators."
        keywords="room allocation automation, student room matching, AI room assignment, group booking allocation, PBSA room optimization, preference-based allocation"
        canonical="https://termflow.ai/playbooks/room-allocation-optimization"
        ogTitle="Room Allocation Optimization: 8 Hours → 1 Hour Manual Review"
        ogDescription="Complete playbook for automated room allocation. Used by PBSA operators to achieve 87% first-choice allocation satisfaction."
        ogType="article"
        ogUrl="https://termflow.ai/playbooks/room-allocation-optimization"
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      <ServiceSchema
        name="AI-Powered Room Allocation & Matching"
        description="Intelligent room allocation using AI to match students by preferences, optimize occupancy, and automate room assignment workflows for PBSA providers."
        provider={{
          name: "TermFlow",
          url: "https://termflow.co.uk"
        }}
        serviceType="Room Management System"
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
        <section className="py-12 bg-gradient-to-br from-pink-50 via-background to-background dark:from-pink-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4" data-testid="badge-category">
                <Users className="w-3 h-3 mr-1" />
                Operations Playbook
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Room Allocation: Automated Matching & Optimization
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Stop spending hours manually assigning rooms. Let AI optimise allocation based on student preferences, group requests, 
                and fairness constraints. Achieve 87% first-choice satisfaction and reclaim 8 hours per allocation cycle.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Time Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">8hrs → 1hr</p>
                    <p className="text-xs text-muted-foreground mt-1">Manual review only</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">First-Choice Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">87%</p>
                    <p className="text-xs text-muted-foreground mt-1">Get preferred room</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">4.2/5</p>
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
                The Problem: Manual Allocation is Slow, Unfair, and Frustrating
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Room allocation is one of the most complained-about aspects of student accommodation. Manual allocation is a nightmare:
                </p>
                
                <ul className="space-y-3 my-6">
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Spending 8+ hours manually matching students to rooms using spreadsheets</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Friend groups get split up because there's no systematic way to keep them together</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>First-come-first-served creates unfairness (early applicants get best rooms)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Nationality clustering leads to cultural isolation and integration issues</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Students with specific needs (accessibility, quiet study space) get overlooked</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-destructive font-bold">✗</span>
                    <span>Late applicants only get leftover poor-quality rooms, leading to complaints</span>
                  </li>
                </ul>

                <p className="text-muted-foreground leading-relaxed">
                  For a 200-bed property with 180 applications, that's trying to optimise 180 students across 40 flats with varying room types, 
                  group requests, and preferences. Doing this manually is impossible to do fairly. AI can optimise in minutes what would take humans days.
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
                The Solution: AI-Powered Allocation with Fairness Constraints
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                TermFlow uses machine learning to optimise room allocation based on student preferences, group requests, diversity goals, 
                and fairness constraints. The system runs thousands of simulations to find the optimal allocation that maximises overall 
                satisfaction whilst ensuring equitable distribution. Landlords review and approve with one click.
              </p>

              <img 
                src="/diagrams/room-allocation-flow.svg" 
                alt="Room allocation optimization flow diagram" 
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
                        <span>Preference collection during application</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Group request detection & linking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>AI matching optimisation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Draft allocation generation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Student notifications & flatmate intros</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Contract generation with room details</span>
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
                        <span>Draft allocation approval (final decision)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Manual overrides for edge cases (pastoral reasons)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Conflict resolution (incompatible flatmate complaints)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Late applicant manual placement</span>
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

        {/* Matching Criteria */}
        <section className="py-12 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">AI Matching Criteria & Weighting</h2>
              <p className="text-muted-foreground mb-6">
                The algorithm optimises allocation based on multiple weighted criteria to balance individual preferences with fairness:
              </p>
              
              <div className="space-y-4">
                {matchingCriteria.map((item, idx) => (
                  <Card key={idx}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{item.criterion}</CardTitle>
                        <Badge variant="secondary">{item.weight}</Badge>
                      </div>
                      <CardDescription className="text-sm mt-2">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-semibold mb-2 text-muted-foreground">Examples:</p>
                      <ul className="space-y-1">
                        {item.examples.map((example, i) => (
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
                      <p className="text-3xl font-bold text-destructive">8 hours</p>
                      <p className="text-xs text-muted-foreground">Manual allocation in spreadsheets</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">After Automation</p>
                      <p className="text-3xl font-bold text-green-600">1 hour</p>
                      <p className="text-xs text-muted-foreground">Review & approval only</p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="font-semibold">Annual savings (2 allocation cycles):</p>
                      <p className="text-2xl font-bold text-primary">14 hours/year</p>
                      <p className="text-sm text-muted-foreground">90% faster process</p>
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
                      <span className="text-sm text-muted-foreground">First-Choice Allocation</span>
                      <span className="text-xl font-bold">87%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tenant Satisfaction</span>
                      <span className="text-xl font-bold">4.2/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Group Kept Together</span>
                      <span className="text-xl font-bold">93%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Diversity Score</span>
                      <span className="text-xl font-bold">85/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Room Change Requests</span>
                      <span className="text-xl font-bold">-62%</span>
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

        {/* Edge Cases */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Handling Edge Cases</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Late Applications</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      <strong>Strategy:</strong> Reserve 10-15% mid-tier rooms for late applicants. Don't fill 100% capacity with early birds.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Implementation:</strong> System flags rooms as "reserved for late allocation" and prevents early assignment.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Room Change Requests</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      <strong>Policy:</strong> Room swaps allowed within first 2 weeks of occupancy if both students agree.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Implementation:</strong> Self-service room swap portal. System validates swap compatibility and updates contracts.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Flatmate Conflicts</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      <strong>Escalation:</strong> If students report serious incompatibility (noise, harassment), on-site manager intervenes.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Resolution:</strong> System suggests alternative rooms in quieter flats. Manager approves emergency moves.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Special Needs Priority</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      <strong>Priority:</strong> Students with disabilities or medical needs get first choice of accessible rooms.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Implementation:</strong> Algorithm assigns 2x weight to accessibility requirements over general preferences.
                    </p>
                  </CardContent>
                </Card>
              </div>
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
                      Room allocation is Step 0 of onboarding. Once allocated, students proceed to application, ID checks, contracts.
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
                    <CardTitle className="text-lg">Inspection Scheduling Automation</CardTitle>
                    <CardDescription>
                      Room allocation data feeds into inspection workflows. System knows which rooms to inspect and who to notify.
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
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">
                See Room Allocation Automation in Action
              </h2>
              <p className="text-lg opacity-90">
                Book a demo to see how TermFlow's AI matching algorithm achieves 87% first-choice allocation whilst maintaining 
                fairness and diversity. We'll show you the preference collection forms, allocation dashboard, and automated workflows.
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
