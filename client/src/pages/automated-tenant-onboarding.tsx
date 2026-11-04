import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { OrganizationSchema } from "@/components/OrganizationSchema";
import { ServiceSchema } from "@/components/ServiceSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { FAQSchema, FAQSchemaItem } from "@/components/FAQSchema";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Footer } from "@/components/Footer";
import { TrustBadges } from "@/components/TrustBadges";
import { FAQ, FAQItem } from "@/components/FAQ";
import { 
  Users,
  FileCheck,
  Shield,
  Clock,
  CheckCircle,
  MessageSquare,
  Calendar,
  Globe,
  Zap,
  ArrowRight,
  Award,
  Bot,
  CreditCard,
  UserCheck,
  FileSignature,
  Home,
  Key
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function AutomatedTenantOnboarding() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Automated Tenant Onboarding", url: "/automated-tenant-onboarding" }
  ];

  const faqItems: FAQItem[] = [
    {
      question: "What is automated tenant onboarding?",
      answer: "Automated tenant onboarding is the process of using AI and digital tools to streamline the entire journey from initial enquiry to move-in day. This includes automated communication, document collection, contract generation, e-signatures, deposit collection, compliance checks, and welcome pack delivery - all without manual intervention. TermFlow's system handles this 24/7 in multiple languages."
    },
    {
      question: "How long does automated onboarding take with TermFlow?",
      answer: "With TermFlow, the entire onboarding process can be completed in as little as 24 hours for motivated students. Our AI responds instantly to enquiries, viewing bookings are confirmed immediately, contracts are generated in minutes, and e-signatures collected digitally. Compare this to traditional methods that typically take 7-14 days with multiple back-and-forth communications."
    },
    {
      question: "What documents can be automatically collected during onboarding?",
      answer: "TermFlow automatically collects and verifies: passport/ID for Right to Rent checks, student enrollment letters, guarantor information and agreements, proof of income/funding, visa documentation for international students, emergency contact details, and any custom documents your properties require. All documents are securely stored and compliance-checked automatically."
    },
    {
      question: "Is automated onboarding suitable for international students?",
      answer: "Absolutely. In fact, international students benefit most from automated onboarding. TermFlow communicates in 25+ languages, works across all timezones, handles international guarantors, processes overseas payments, and ensures visa and Right to Rent compliance. Students can complete the entire process from their home country before arriving in the UK."
    },
    {
      question: "How does automated deposit collection and protection work?",
      answer: "When a student signs their contract digitally, TermFlow automatically sends payment links for deposits and advance rent. We integrate with Stripe for secure payment processing and automatically register deposits with approved protection schemes (DPS, TDS, mydeposits) within 30 days as required by law. Students receive instant confirmation and certificate numbers."
    },
    {
      question: "Can we customize the automated onboarding flow?",
      answer: "Yes, TermFlow's onboarding automation is fully customizable to match your specific requirements. Set custom document requirements, create property-specific welcome messages, design your contract templates, configure payment schedules, and add any additional steps unique to your properties. The AI learns your preferences and maintains consistency across all interactions."
    }
  ];

  const faqSchemaItems: FAQSchemaItem[] = faqItems.map(item => ({
    question: item.question,
    answer: item.answer
  }));

  const onboardingSteps = [
    {
      step: "1",
      title: "Initial Enquiry",
      description: "AI responds instantly in student's language",
      icon: MessageSquare,
      time: "30 seconds"
    },
    {
      step: "2",
      title: "Qualification",
      description: "Automated assessment of needs and budget",
      icon: UserCheck,
      time: "2 minutes"
    },
    {
      step: "3",
      title: "Viewing Booking",
      description: "Self-service slot selection or virtual tour",
      icon: Calendar,
      time: "1 minute"
    },
    {
      step: "4",
      title: "Application",
      description: "Digital forms with document upload",
      icon: FileCheck,
      time: "10 minutes"
    },
    {
      step: "5",
      title: "Contract Generation",
      description: "Automated creation with correct terms",
      icon: FileSignature,
      time: "Instant"
    },
    {
      step: "6",
      title: "E-Signature",
      description: "Legally binding digital signatures",
      icon: Shield,
      time: "5 minutes"
    },
    {
      step: "7",
      title: "Payment Collection",
      description: "Secure deposit and rent processing",
      icon: CreditCard,
      time: "2 minutes"
    },
    {
      step: "8",
      title: "Move-In Ready",
      description: "Keys scheduled, welcome pack sent",
      icon: Key,
      time: "Automated"
    }
  ];

  const benefits = [
    {
      title: "Reduce Time-to-Tenancy by 85%",
      description: "Complete onboarding in hours, not weeks. Students love the speed, you love the efficiency.",
      metric: "24hr average"
    },
    {
      title: "Zero Manual Data Entry",
      description: "Information flows automatically from enquiry to contract. No more retyping the same details.",
      metric: "100% automated"
    },
    {
      title: "Increase Conversion Rates",
      description: "Fast, smooth onboarding means fewer drop-offs. Students commit before viewing other properties.",
      metric: "40% higher conversion"
    },
    {
      title: "Ensure 100% Compliance",
      description: "Every Right to Rent check completed, every deposit protected, every document stored securely.",
      metric: "Zero compliance issues"
    },
    {
      title: "Delight International Students",
      description: "Complete onboarding from anywhere in the world, in any language, at any time.",
      metric: "25+ languages"
    },
    {
      title: "Scale Without Stress",
      description: "Handle 10x more onboardings during clearing without adding staff or working weekends.",
      metric: "Unlimited capacity"
    }
  ];

  const comparisonData = [
    {
      aspect: "First Response Time",
      manual: "2-24 hours",
      automated: "30 seconds",
      improvement: "48x faster"
    },
    {
      aspect: "Document Collection",
      manual: "3-7 days",
      automated: "Same day",
      improvement: "7x faster"
    },
    {
      aspect: "Contract Generation",
      manual: "1-2 days",
      automated: "Instant",
      improvement: "Immediate"
    },
    {
      aspect: "Deposit Protection",
      manual: "Up to 30 days",
      automated: "Same day",
      improvement: "Compliant"
    },
    {
      aspect: "Total Onboarding Time",
      manual: "7-14 days",
      automated: "24 hours",
      improvement: "10x faster"
    },
    {
      aspect: "Staff Hours Required",
      manual: "4-6 hours",
      automated: "5 minutes",
      improvement: "95% reduction"
    }
  ];

  return (
    <>
      <SEO
        title="Automated Tenant Onboarding for Student Accommodation | TermFlow"
        description="Streamline student tenant onboarding with AI automation. From enquiry to move-in in 24 hours. Digital contracts, e-signatures, deposit protection & compliance checks automated."
        keywords="automated tenant onboarding, student onboarding automation, digital tenant onboarding, automated student registration, tenant onboarding software, student accommodation onboarding, PBSA onboarding platform, automated compliance checks"
        canonical="https://termflow.co.uk/automated-tenant-onboarding"
        ogTitle="Automated Tenant Onboarding - From Enquiry to Move-In in 24 Hours"
        ogDescription="Transform your student onboarding with AI automation. Handle documents, contracts, payments and compliance checks automatically. Used by 200+ student properties."
        ogUrl="https://termflow.co.uk/automated-tenant-onboarding"
      />
      
      <OrganizationSchema />
      <ServiceSchema />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema items={faqSchemaItems} />

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
              <Link href="/solutions">
                <a className="text-sm font-medium hover:text-primary" data-testid="link-solutions">
                  Solutions
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
              Automated Tenant Onboarding That Takes 24 Hours, Not 14 Days
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Transform your student onboarding from a manual nightmare into an automated dream. 
              AI handles everything from first enquiry to key collection - in any language, at any time, with zero errors.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/book-demo">
                <a data-testid="button-hero-demo">
                  <Button size="lg">
                    See Onboarding Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </Link>
              <Link href="/how-it-works">
                <a data-testid="button-hero-how">
                  <Button size="lg" variant="outline">
                    How It Works
                  </Button>
                </a>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Join 200+ properties onboarding students 10x faster
            </p>
          </motion.div>
        </div>
      </section>

      {/* Onboarding Process */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              The 8-Step Automated Onboarding Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              From first contact to move-in ready in record time
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {onboardingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {step.time}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
              <Clock className="h-8 w-8 text-primary" />
              <div className="text-left">
                <div className="text-2xl font-bold text-primary">Total Time: 24 Hours</div>
                <div className="text-sm text-muted-foreground">vs 7-14 days manually</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Automate Your Student Tenant Onboarding?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    <Badge className="w-fit">{benefit.metric}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Manual vs Automated Onboarding: The Numbers Don't Lie
          </h2>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Process</th>
                      <th className="text-center p-4 font-medium">Manual</th>
                      <th className="text-center p-4 font-medium">Automated</th>
                      <th className="text-center p-4 font-medium">Improvement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-4 font-medium">{row.aspect}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.manual}</td>
                        <td className="p-4 text-center text-primary font-medium">{row.automated}</td>
                        <td className="p-4 text-center">
                          <Badge variant="secondary">{row.improvement}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/roi-calculator">
              <a data-testid="link-calculate-savings">
                <Button size="lg" variant="outline">
                  Calculate Your Time & Cost Savings
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features for Seamless Onboarding
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Intelligent Communication</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Bot className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>AI Assistant (Ava)</strong>
                    <p className="text-muted-foreground">Responds 24/7 in 25+ languages via WhatsApp, email, web chat</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>International Support</strong>
                    <p className="text-muted-foreground">Handles different timezones, currencies, and cultural preferences</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Smart Follow-Ups</strong>
                    <p className="text-muted-foreground">Automated nudges keep students moving through the process</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">Digital Document Processing</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <FileCheck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Smart Forms</strong>
                    <p className="text-muted-foreground">Pre-filled applications with data validation and error checking</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Compliance Automation</strong>
                    <p className="text-muted-foreground">Right to Rent, visa checks, guarantor validation all automated</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <FileSignature className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>E-Signatures</strong>
                    <p className="text-muted-foreground">Legally binding digital signatures collected on any device</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mt-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Payment & Financial</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Integrated Payments</strong>
                    <p className="text-muted-foreground">Collect deposits and rent via Stripe with instant confirmation</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Deposit Protection</strong>
                    <p className="text-muted-foreground">Automatic registration with DPS, TDS, or mydeposits</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Guarantor Management</strong>
                    <p className="text-muted-foreground">UK and international guarantor agreements handled automatically</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">Move-In Coordination</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Arrival Scheduling</strong>
                    <p className="text-muted-foreground">Students book move-in slots that sync with your team's calendar</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Key className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Key Collection</strong>
                    <p className="text-muted-foreground">Digital check-in with QR codes and automated key assignment</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Home className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Welcome Packs</strong>
                    <p className="text-muted-foreground">Digital welcome guides sent automatically before arrival</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="bg-primary/5">
            <CardHeader>
              <Badge className="w-fit mb-2">Case Study</Badge>
              <CardTitle>How Newcastle Student Housing Transformed Their Onboarding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold text-primary">400+</div>
                  <p className="text-muted-foreground">Clearing week enquiries handled automatically</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">24hrs</div>
                  <p className="text-muted-foreground">Average time from enquiry to signed contract</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <p className="text-muted-foreground">Reduction in admin time per tenant</p>
                </div>
              </div>
              <blockquote className="italic text-muted-foreground border-l-4 border-primary pl-4">
                "During clearing week, we had more enquiries than our team could handle. TermFlow's automated 
                onboarding meant every student got an instant response, could book viewings immediately, and 
                sign contracts the same day. What would have taken weeks of overtime was handled automatically."
              </blockquote>
              <p className="mt-4 font-medium">- Sarah Mitchell, Operations Director</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions About Automated Tenant Onboarding
          </h2>
          <FAQ items={faqItems} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Start Onboarding Students 10x Faster Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 200+ student accommodation providers using TermFlow to automate their tenant onboarding
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/book-demo">
              <a data-testid="button-cta-demo">
                <Button size="lg" variant="secondary">
                  Book Onboarding Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </Link>
            <Link href="/pricing">
              <a data-testid="button-cta-pricing">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  View Pricing
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