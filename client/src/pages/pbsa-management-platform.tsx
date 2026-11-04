import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { OrganizationSchema } from "@/components/OrganizationSchema";
import { ServiceSchema } from "@/components/ServiceSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { FAQSchema, FAQSchemaItem } from "@/components/FAQSchema";
import { HowToSchema } from "@/components/HowToSchema";
import { ProfessionalServiceSchema } from "@/components/ProfessionalServiceSchema";
import { AggregateRatingSchema } from "@/components/AggregateRatingSchema";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Footer } from "@/components/Footer";
import { TrustBadges } from "@/components/TrustBadges";
import { FAQ, FAQItem } from "@/components/FAQ";
import { TestimonialWithSchema, TestimonialData } from "@/components/TestimonialWithSchema";
import { 
  Building2,
  Users,
  BarChart3,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  FileCheck,
  Calendar,
  Video,
  Globe,
  Zap,
  ArrowRight,
  Award,
  PoundSterling,
  Bot,
  RefreshCw,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import headshot1 from "@assets/stock_images/professional_busines_82a17483.jpg";
import headshot2 from "@assets/stock_images/professional_busines_4a59ef67.jpg";
import headshot3 from "@assets/stock_images/professional_busines_96686da7.jpg";

export default function PBSAManagementPlatform() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "PBSA Management Platform", url: "/pbsa-management-platform" }
  ];

  const testimonials: TestimonialData[] = [
    {
      name: "David Thompson",
      role: "Operations Director",
      avatar: headshot1,
      avatarFallback: "DT",
      rating: 5,
      text: "TermFlow transformed our PBSA operations. We reduced enquiry response time from hours to seconds and increased our conversion rate by 45%. The AI handles 95% of initial enquiries perfectly.",
      portfolioSize: "2,500 beds",
      location: "London",
      date: "2024-10-15"
    },
    {
      name: "Emma Richardson",
      role: "Regional Manager",
      avatar: headshot2,
      avatarFallback: "ER",
      rating: 5,
      text: "Managing multiple PBSA properties across different cities was a nightmare. TermFlow's centralized platform lets us see everything in real-time. Occupancy is up 12% year-on-year.",
      portfolioSize: "1,800 beds",
      location: "Manchester",
      date: "2024-09-22"
    },
    {
      name: "Michael Chen",
      role: "Head of Student Services",
      avatar: headshot3,
      avatarFallback: "MC",
      rating: 5,
      text: "International students love the instant multilingual support. Parents feel reassured knowing their children can communicate in their native language 24/7. It's been a game-changer for our Asian markets.",
      portfolioSize: "950 beds",
      location: "Edinburgh",
      date: "2024-08-30"
    }
  ];

  const faqItems: FAQItem[] = [
    {
      question: "What is a PBSA management platform?",
      answer: "A PBSA (Purpose-Built Student Accommodation) management platform is specialized software designed to handle the unique operational needs of student housing. It manages everything from marketing and lettings to maintenance and rebooking, with features specifically built for academic cycles, international students, and high-turnover accommodation. TermFlow's AI-powered platform goes beyond traditional management by automating repetitive tasks like enquiry responses, viewing bookings, and contract generation."
    },
    {
      question: "How does TermFlow differ from traditional property management systems?",
      answer: "Unlike generic property management software, TermFlow is built specifically for PBSA with AI at its core. We understand academic cycles, handle international guarantors, support 25+ languages natively, and automate student-specific workflows like clearing period management and university partnership compliance. Our AI assistant works 24/7, responding to students instantly and booking viewings without human intervention."
    },
    {
      question: "Can TermFlow handle multiple PBSA properties?",
      answer: "Absolutely. TermFlow is designed to scale from single properties to portfolios with thousands of beds. Our platform provides centralized management with property-specific customization. You get a unified dashboard showing all properties while maintaining individual branding, pricing, and workflows for each location. Many clients manage 10+ properties from a single TermFlow account."
    },
    {
      question: "What PBSA-specific features does TermFlow offer?",
      answer: "TermFlow includes features essential for PBSA operations: dual occupancy management, academic year contract templates, international guarantor workflows, university partnership integrations, clearing period automation, rebooking campaigns, maintenance triage for student issues, Right to Rent automation, and parental communication portals. Every feature is designed with student accommodation in mind."
    },
    {
      question: "How quickly can we implement TermFlow in our PBSA portfolio?",
      answer: "Most PBSA operators are live within 48 hours. Our onboarding team imports your property data, configures your workflows, and trains your AI assistant on your specific requirements. We integrate with your existing systems (StarRez, Yardi, Kinetic) without disruption. You'll see immediate impact - many operators report handling 10x more enquiries within the first week."
    },
    {
      question: "Is TermFlow suitable for university-managed accommodation?",
      answer: "Yes, TermFlow works perfectly for both private PBSA operators and university-managed accommodation. We support direct integration with university systems, handle student ID verification, and ensure compliance with university policies. Our platform adapts to nomination agreements, direct-let models, and hybrid approaches commonly used in university partnerships."
    }
  ];

  const faqSchemaItems: FAQSchemaItem[] = faqItems.map(item => ({
    question: item.question,
    answer: item.answer
  }));

  const challenges = [
    {
      problem: "Overwhelming enquiry volumes",
      solution: "AI responds to 100% of enquiries within 30 seconds",
      icon: MessageSquare
    },
    {
      problem: "International student barriers",
      solution: "Native support for 25+ languages, any timezone",
      icon: Globe
    },
    {
      problem: "Manual contract processing",
      solution: "Digital contracts generated and signed in minutes",
      icon: FileCheck
    },
    {
      problem: "Low rebooking rates",
      solution: "Automated campaigns achieve 65% rebooking rates",
      icon: RefreshCw
    },
    {
      problem: "Compliance headaches",
      solution: "Automated Right to Rent and deposit protection",
      icon: Shield
    },
    {
      problem: "Disconnected systems",
      solution: "Unified platform with seamless integrations",
      icon: Target
    }
  ];

  const capabilities = [
    {
      category: "Lead Management",
      features: [
        "24/7 AI chat in 25+ languages",
        "Automatic lead qualification & scoring",
        "Multi-channel response (WhatsApp, Email, Web)",
        "Intelligent follow-up sequences"
      ]
    },
    {
      category: "Operations Automation",
      features: [
        "Self-service viewing bookings",
        "Digital contract generation & e-signing",
        "Automated deposit protection",
        "Right to Rent verification"
      ]
    },
    {
      category: "Student Experience",
      features: [
        "Instant responses any time",
        "Virtual property tours",
        "Parent portal access",
        "Maintenance request triage"
      ]
    },
    {
      category: "Analytics & Insights",
      features: [
        "Real-time occupancy tracking",
        "Conversion funnel analysis",
        "Revenue optimization",
        "Predictive demand forecasting"
      ]
    }
  ];

  const metrics = [
    { label: "Properties Using TermFlow", value: "200+", icon: Building2 },
    { label: "Student Beds Managed", value: "20,000+", icon: Users },
    { label: "Average Response Time", value: "27 seconds", icon: Clock },
    { label: "Enquiry Automation Rate", value: "95%", icon: Bot }
  ];

  return (
    <>
      <SEO
        title="PBSA Management Platform - AI Automation for Student Accommodation | TermFlow"
        description="Complete PBSA management platform with AI automation for student accommodation operators. Handle enquiries, viewings, contracts & compliance 24/7. Built for UK student accommodation."
        keywords="PBSA management platform, PBSA software, student accommodation management system, purpose built student accommodation software, PBSA operations platform, student housing management UK, PBSA CRM, student accommodation automation"
        canonical="https://termflow.co.uk/pbsa-management-platform"
        ogTitle="PBSA Management Platform - Transform Your Student Accommodation Operations"
        ogDescription="AI-powered PBSA management platform that automates enquiries, bookings, contracts and compliance. Join 200+ properties saving 80% on operational costs."
        ogUrl="https://termflow.co.uk/pbsa-management-platform"
      />
      
      <OrganizationSchema />
      <ServiceSchema />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema items={faqSchemaItems} />
      
      {/* Enhanced Structured Data for PBSA Management Platform */}
      <ProfessionalServiceSchema
        name="PBSA Management Platform Services"
        description="Comprehensive AI-powered management platform for Purpose-Built Student Accommodation operators, handling everything from enquiries to rebooking"
        serviceType="Student Accommodation Management Platform"
        aggregateRating={{ ratingValue: 4.9, reviewCount: 200 }}
        hasOfferCatalog={{
          name: "PBSA Platform Features",
          itemListElement: [
            {
              name: "Lead Management System",
              description: "24/7 AI-powered lead capture and qualification from all portals",
              price: "0"
            },
            {
              name: "Operations Automation",
              description: "Automated viewings, contracts, deposits, and compliance checks",
              price: "0"
            },
            {
              name: "Student Experience Platform",
              description: "Multilingual support, virtual tours, and maintenance management",
              price: "0"
            },
            {
              name: "Analytics Dashboard",
              description: "Real-time occupancy, conversion tracking, and revenue optimization",
              price: "0"
            }
          ]
        }}
      />
      
      <AggregateRatingSchema
        itemReviewed={{
          type: "SoftwareApplication",
          name: "TermFlow PBSA Management Platform",
          description: "Complete management platform for PBSA operators",
          url: "https://termflow.co.uk/pbsa-management-platform"
        }}
        ratingValue={4.9}
        reviewCount={200}
        reviews={testimonials.map(t => ({
          author: t.name,
          rating: t.rating,
          reviewBody: t.text,
          datePublished: t.date
        }))}
      />
      
      <HowToSchema
        name="How to Implement PBSA Management Platform"
        description="Step-by-step guide to implementing TermFlow's PBSA management platform for your student accommodation"
        steps={[
          {
            name: "Import Property Data",
            text: "Upload your property details, room types, pricing, and availability via CSV or API integration"
          },
          {
            name: "Connect Lead Sources",
            text: "Link all property portals like Rightmove, Zoopla, Student.com to centralize enquiries"
          },
          {
            name: "Configure AI Assistant",
            text: "Customize Ava's responses, set your tone of voice, and upload property information"
          },
          {
            name: "Set Up Workflows",
            text: "Configure viewing schedules, contract templates, and automated follow-up sequences"
          },
          {
            name: "Go Live",
            text: "Activate the platform and start handling enquiries automatically within 48 hours"
          }
        ]}
        totalTime="PT48H"
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a data-testid="link-logo">
                <TermFlowWordmark />
              </a>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/pricing">
                <a className="text-sm font-medium hover:text-primary" data-testid="link-pricing">
                  Pricing
                </a>
              </Link>
              <Link href="/how-it-works">
                <a className="text-sm font-medium hover:text-primary" data-testid="link-how-it-works">
                  How It Works
                </a>
              </Link>
              <Link href="/book-demo">
                <a data-testid="link-book-demo">
                  <Button size="sm">Book Demo</Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4">Built for UK student accommodation</Badge>
            <h1 className="text-5xl font-bold mb-6">
              The AI-Powered PBSA Management Platform That Runs Itself
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Stop drowning in enquiries and manual tasks. TermFlow's intelligent platform automates 
              your entire PBSA operation - from first enquiry to rebooking - while you focus on strategy and growth.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/book-demo">
                <a data-testid="button-hero-demo">
                  <Button size="lg">
                    Get a Personalized Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </Link>
              <Link href="/how-it-works">
                <a data-testid="button-hero-tour">
                  <Button size="lg" variant="outline">
                    Take Platform Tour
                  </Button>
                </a>
              </Link>
            </div>
          </motion.div>

          {/* Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover-elevate">
                  <CardContent className="p-6">
                    <metric.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-primary">{metric.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{metric.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              PBSA Operations Are Complex. TermFlow Makes Them Simple.
            </h2>
            <p className="text-xl text-muted-foreground">
              We understand the unique challenges of student accommodation management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <item.icon className="h-8 w-8 text-destructive mb-3" />
                    <CardTitle className="text-lg">
                      <span className="text-destructive">Challenge:</span> {item.problem}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        <strong className="text-primary">Solution:</strong> {item.solution}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Complete PBSA Management Platform Capabilities
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to run efficient, profitable student accommodation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{capability.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {capability.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why PBSA Operators Choose TermFlow */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Leading PBSA Operators Choose TermFlow
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-elevate">
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-3" />
                <CardTitle>Built for PBSA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Not a generic property system with student features bolted on. Every feature is designed 
                  specifically for PBSA operations, from clearing period surge handling to academic year cycles.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-3" />
                <CardTitle>Immediate Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Go live in 48 hours, not months. See instant results with 95% enquiry automation and 
                  24/7 availability. Most operators report ROI within the first month of implementation.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-3" />
                <CardTitle>Proven Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join 200+ properties achieving 40% higher conversion rates, 65% rebooking rates, and 
                  80% operational cost savings. Our success metrics are measured and guaranteed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What PBSA Operators Say About TermFlow
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TestimonialWithSchema {...testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Seamless Integration with Your PBSA Tech Stack
            </h2>
            <p className="text-xl text-muted-foreground">
              TermFlow works alongside your existing systems, not against them
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-4">Property Management Systems</h3>
              <ul className="space-y-3 mb-8">
                {["StarRez", "Yardi", "Kinetic", "RMS", "Accommodation System"].map(system => (
                  <li key={system} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{system}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mb-4">Communication & Marketing</h3>
              <ul className="space-y-3">
                {["WhatsApp Business", "Microsoft 365", "Google Workspace", "Mailchimp", "HubSpot"].map(tool => (
                  <li key={tool} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="p-8 bg-primary/5">
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">API-First Architecture</h3>
                <p className="text-muted-foreground mb-6">
                  Our RESTful API and webhooks enable custom integrations with any system. 
                  Real-time data sync ensures all your tools stay updated.
                </p>
                <Link href="/integrations">
                  <a data-testid="link-view-integrations">
                    <Button variant="outline">
                      View All Integrations
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions About PBSA Management Platforms
          </h2>
          <FAQ items={faqItems} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Join 200+ PBSA Properties Using TermFlow
          </h2>
          <p className="text-xl mb-8 opacity-90">
            See how TermFlow can transform your PBSA operations with a personalized demo tailored to your portfolio
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/book-demo">
              <a data-testid="button-cta-demo">
                <Button size="lg" variant="secondary">
                  Book Your Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </Link>
            <Link href="/roi-calculator">
              <a data-testid="button-cta-calculator">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  Calculate Your ROI
                </Button>
              </a>
            </Link>
          </div>
          <p className="mt-8 text-sm opacity-75">
            Free 14-day trial • No credit card required • Go live in 48 hours
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Footer */}
      <Footer />
    </>
  );
}