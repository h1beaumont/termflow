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
import { 
  Bot, 
  MessageSquare, 
  FileCheck, 
  BarChart3, 
  Shield, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  Users, 
  Building2,
  Calendar,
  Video,
  Globe,
  Zap,
  ArrowRight,
  Award,
  PoundSterling
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function StudentLettingsSoftware() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Student Lettings Software", url: "/student-lettings-software" }
  ];

  const faqItems: FAQItem[] = [
    {
      question: "What is student lettings software?",
      answer: "Student lettings software is a specialised property management system designed for Purpose-Built Student Accommodation (PBSA) operators. It automates the entire lettings cycle from initial enquiry through to move-in, including viewing bookings, contract generation, deposit protection, and compliance checks. TermFlow's AI-powered platform handles these tasks 24/7, responding to students instantly in their preferred language."
    },
    {
      question: "How does TermFlow's student lettings automation work?",
      answer: "TermFlow uses AI technology to automate the entire student lettings process. When a student enquires via WhatsApp, email, or web portal, our AI assistant Ava responds instantly, qualifies the lead, books viewings, and follows up automatically. The system generates contracts, collects signatures digitally, processes deposits, and handles Right to Rent checks - all without manual intervention."
    },
    {
      question: "Can TermFlow integrate with existing student accommodation systems?",
      answer: "Yes, TermFlow integrates seamlessly with major student accommodation management systems including StarRez, Yardi, Kinetic, and RMS. We also provide API access for custom integrations and can sync with your existing calendar, email, and property management tools. Our platform is designed to complement, not replace, your existing infrastructure."
    },
    {
      question: "How much does student lettings software typically cost?",
      answer: "TermFlow's pricing starts at £99/month for portfolios up to 100 beds, making it accessible for both small operators and large PBSA providers. Unlike traditional letting agents who charge 8-12% commission, our flat-fee model can save operators thousands per month. For larger portfolios (500+ beds), we offer custom enterprise pricing with volume discounts."
    },
    {
      question: "Is TermFlow compliant with UK student accommodation regulations?",
      answer: "Absolutely. TermFlow is fully compliant with UK regulations including GDPR, Right to Rent checks, deposit protection schemes (DPS, TDS, mydeposits), and student data privacy laws. We maintain ISO 27001 certification and undergo regular security audits. All contracts generated are legally binding and compliant with UK tenancy laws."
    },
    {
      question: "What languages does TermFlow support for international students?",
      answer: "TermFlow's AI assistant communicates fluently in over 25 languages including Mandarin, Arabic, Spanish, French, Hindi, and more. The system automatically detects the student's language and responds accordingly, making it ideal for UK universities with high international student populations. This eliminates language barriers and timezone issues."
    }
  ];

  const faqSchemaItems: FAQSchemaItem[] = faqItems.map(item => ({
    question: item.question,
    answer: item.answer
  }));

  const features = [
    {
      icon: Bot,
      title: "24/7 AI Assistant",
      description: "Responds to student enquiries instantly in 25+ languages via WhatsApp, email, and web chat",
      stats: "95% response automation"
    },
    {
      icon: Calendar,
      title: "Automated Viewing Bookings",
      description: "Students self-book viewings 24/7. Calendar syncs with your team's availability automatically",
      stats: "3x more viewings booked"
    },
    {
      icon: FileCheck,
      title: "Digital Contract Management",
      description: "Generate, send, and collect legally binding e-signatures. Deposits protected automatically",
      stats: "72% faster contract completion"
    },
    {
      icon: Shield,
      title: "Compliance Automation",
      description: "Right to Rent checks, ID verification, guarantor validation - all automated and audit-ready",
      stats: "100% compliance rate"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track conversion rates, occupancy, revenue metrics. Identify bottlenecks instantly",
      stats: "40% conversion improvement"
    },
    {
      icon: Globe,
      title: "Multi-Property Management",
      description: "Manage unlimited properties from one dashboard. Scale from 50 to 5000+ beds seamlessly",
      stats: "Built for UK student accommodation"
    }
  ];

  const benefits = [
    {
      title: "Reduce Operational Costs by 80%",
      description: "Eliminate letting agent fees and reduce staff time spent on repetitive tasks. Our AI handles enquiries, bookings, and admin work 24/7.",
      icon: PoundSterling
    },
    {
      title: "Never Miss Another Lead",
      description: "Respond to every enquiry within 30 seconds, even at 3am. Convert more international students who enquire outside UK hours.",
      icon: Clock
    },
    {
      title: "Scale Without Hiring",
      description: "Handle 10x more enquiries without adding staff. Perfect for clearing period when enquiry volumes spike dramatically.",
      icon: TrendingUp
    },
    {
      title: "Improve Student Experience",
      description: "Students love instant responses in their language. Self-service viewing bookings and digital contracts match their expectations.",
      icon: Award
    }
  ];

  const caseStudies = [
    {
      name: "Newcastle Student Housing",
      beds: "320 beds",
      result: "Handled 400+ clearing week enquiries automatically",
      quote: "TermFlow processed more enquiries in one week than our team could handle in a month."
    },
    {
      name: "Manchester PBSA Group",
      beds: "850 beds",
      result: "Reduced time-to-contract from 14 days to 3 days",
      quote: "International students sign contracts before arriving in the UK. Game-changing."
    },
    {
      name: "London Student Residences",
      beds: "1,200 beds",
      result: "Achieved 98% occupancy rate, up from 89%",
      quote: "The AI qualification means we only spend time on serious enquiries."
    }
  ];

  return (
    <>
      <SEO
        title="Student Lettings Software - AI Automation for PBSA | TermFlow"
        description="Revolutionary student lettings software that automates your entire PBSA operation. AI-powered enquiry handling, viewing bookings, digital contracts & compliance. From £99/month."
        keywords="student lettings software, student accommodation software, PBSA software, student housing management system, student lettings automation, UK student accommodation platform, student property management software, university accommodation software"
        canonical="https://termflow.co.uk/student-lettings-software"
        ogTitle="Student Lettings Software - Automate Your PBSA Operations"
        ogDescription="AI-powered student lettings software that handles enquiries, viewings, contracts & compliance 24/7. Used by operators managing 20,000+ beds across the UK."
        ogUrl="https://termflow.co.uk/student-lettings-software"
      />
      
      <OrganizationSchema />
      <ServiceSchema 
        name="Student Lettings Software"
        description="AI-powered student lettings software that automates the entire PBSA operation from enquiry to move-in."
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema items={faqSchemaItems} />
      
      {/* Enhanced Structured Data for Student Lettings Software */}
      <ProfessionalServiceSchema
        name="Student Lettings Software Solutions"
        description="AI-powered lettings software specifically designed for student accommodation operators in the UK and Ireland"
        serviceType="Student Accommodation Lettings Software"
        aggregateRating={{ ratingValue: 4.9, reviewCount: 127 }}
        hasOfferCatalog={{
          name: "Student Lettings Features",
          itemListElement: [
            {
              name: "AI Enquiry Management",
              description: "Instant 24/7 responses to student enquiries in 25+ languages",
              price: "0"
            },
            {
              name: "Automated Viewing System",
              description: "Self-service viewing bookings with calendar integration",
              price: "0"
            },
            {
              name: "Digital Contract Processing",
              description: "Generate and collect e-signatures on tenancy agreements",
              price: "0"
            },
            {
              name: "Compliance Automation",
              description: "Automated Right to Rent checks and deposit protection",
              price: "0"
            }
          ]
        }}
      />
      
      <AggregateRatingSchema
        itemReviewed={{
          type: "SoftwareApplication",
          name: "TermFlow Student Lettings Software",
          description: "Specialized lettings software for student accommodation",
          url: "https://termflow.co.uk/student-lettings-software"
        }}
        ratingValue={4.8}
        reviewCount={127}
      />
      
      <HowToSchema
        name="How to Set Up Student Lettings Automation"
        description="Complete guide to automating your student lettings process with TermFlow"
        steps={[
          {
            name: "Connect Property Portals",
            text: "Link Rightmove, Zoopla, OpenRent and other portals to capture all enquiries"
          },
          {
            name: "Upload Property Information",
            text: "Add property details, floor plans, videos, and pricing information"
          },
          {
            name: "Configure AI Responses",
            text: "Set up Ava to answer common questions and qualify leads automatically"
          },
          {
            name: "Enable Digital Contracts",
            text: "Upload tenancy templates and connect DocuSign for e-signatures"
          },
          {
            name: "Activate Payment Processing",
            text: "Connect Stripe for deposit collection and automated protection"
          }
        ]}
        totalTime="PT24H"
        estimatedCost={{ value: "99", currency: "GBP" }}
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
              AI-Powered Student Lettings Software for Modern PBSA Operators
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Automate your entire student accommodation lettings process. From first enquiry to move-in, 
              our AI handles everything 24/7 in 25+ languages. Join leading UK operators saving 80% on operational costs.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/book-demo">
                <a data-testid="button-hero-demo">
                  <Button size="lg">
                    See Live Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </Link>
              <Link href="/pricing">
                <a data-testid="button-hero-pricing">
                  <Button size="lg" variant="outline">
                    View Pricing
                  </Button>
                </a>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {[
              { label: "Response Time", value: "<30s", description: "Average first response" },
              { label: "Languages", value: "25+", description: "Including Mandarin & Arabic" },
              { label: "Conversion Rate", value: "+40%", description: "Enquiry to contract" },
              { label: "Cost Savings", value: "80%", description: "vs letting agents" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="font-medium mt-2">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Student Lettings Software */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">What is Student Lettings Software?</h2>
          <div className="prose prose-lg max-w-none">
            <p>
              Student lettings software is purpose-built technology designed specifically for managing student accommodation 
              properties. Unlike generic property management systems, it addresses the unique challenges of PBSA operations: 
              high tenant turnover, international student requirements, academic year cycles, and compliance with university 
              partnerships.
            </p>
            <p>
              TermFlow takes student lettings software to the next level with AI automation. Our platform doesn't just 
              manage data - it actively handles tasks that traditionally require human intervention. When a student sends 
              a WhatsApp message at 2am from Shanghai, our AI responds instantly in Mandarin, books their virtual viewing, 
              and follows up automatically until they sign their contract.
            </p>
            <p>
              Modern student lettings software must handle multiple communication channels (WhatsApp, WeChat, email), 
              support dozens of languages, integrate with university systems, manage guarantors across different countries, 
              and ensure compliance with constantly evolving regulations. TermFlow excels at all of these while maintaining 
              the personal touch that students expect.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Complete Student Lettings Automation Platform
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to run modern student accommodation efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <feature.icon className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{feature.stats}</Badge>
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why PBSA Operators Choose TermFlow
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Student Lettings Automation Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Student Enquires",
                description: "Via WhatsApp, email, or property portals - any language, any time"
              },
              {
                step: "2", 
                title: "AI Qualifies & Books",
                description: "Ava responds instantly, qualifies needs, books viewings automatically"
              },
              {
                step: "3",
                title: "Digital Processing",
                description: "Contracts generated, signed digitally, deposits protected instantly"
              },
              {
                step: "4",
                title: "Move-In Ready",
                description: "Compliance checked, keys scheduled, welcome pack sent automatically"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Success Stories from UK Student Accommodation Operators
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <CardTitle>{study.name}</CardTitle>
                    <CardDescription>{study.beds}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-primary mb-2">{study.result}</div>
                    </div>
                    <blockquote className="italic text-muted-foreground">
                      "{study.quote}"
                    </blockquote>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/case-studies">
              <a data-testid="link-view-case-studies">
                <Button variant="outline" size="lg">
                  View All Case Studies
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            Integrates with Your Existing Systems
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12">
            TermFlow works alongside your current property management software
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {["StarRez", "Yardi", "Kinetic", "RMS", "Salesforce", "HubSpot", "Google Calendar", "Microsoft 365"].map((integration) => (
              <div key={integration} className="bg-white rounded-lg p-6 shadow-sm hover-elevate">
                <div className="text-center font-medium">{integration}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions About Student Lettings Software
          </h2>
          <FAQ items={faqItems} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Student Lettings?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join leading PBSA operators using TermFlow to automate their operations and increase occupancy rates
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/book-demo">
              <a data-testid="button-cta-demo">
                <Button size="lg" variant="secondary">
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </Link>
            <Link href="/pricing">
              <a data-testid="button-cta-pricing">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  See Pricing
                </Button>
              </a>
            </Link>
          </div>
          <p className="mt-8 text-sm opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
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