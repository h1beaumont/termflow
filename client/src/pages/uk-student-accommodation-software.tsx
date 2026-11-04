import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { OrganizationSchema } from "@/components/OrganizationSchema";
import { ServiceSchema } from "@/components/ServiceSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { FAQSchema, FAQSchemaItem } from "@/components/FAQSchema";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Footer } from "@/components/Footer";
import { TrustBadges } from "@/components/TrustBadges";
import { FAQ, FAQItem } from "@/components/FAQ";
import { 
  MapPin,
  Building2,
  Users,
  Shield,
  Clock,
  CheckCircle,
  Globe,
  ArrowRight,
  Award,
  PoundSterling,
  Bot,
  GraduationCap,
  Flag
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function UKStudentAccommodationSoftware() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "UK Student Accommodation Software", url: "/uk-student-accommodation-software" }
  ];

  const faqItems: FAQItem[] = [
    {
      question: "What makes TermFlow ideal for UK student accommodation?",
      answer: "TermFlow is built specifically for the UK market with deep understanding of UK regulations, university partnerships, and student expectations. We handle Right to Rent checks automatically, integrate with UK deposit protection schemes (DPS, TDS, mydeposits), support UK guarantor requirements, and understand the UK academic calendar including clearing periods. Our AI is trained on UK student communication patterns and preferences."
    },
    {
      question: "Which UK universities does TermFlow work with?",
      answer: "TermFlow works with student accommodation serving all major UK universities including Russell Group institutions. We handle properties near universities in London, Manchester, Birmingham, Leeds, Bristol, Edinburgh, Glasgow, Newcastle, Sheffield, and Liverpool. Our platform adapts to each university's specific requirements, term dates, and partnership agreements."
    },
    {
      question: "How does TermFlow handle UK compliance requirements?",
      answer: "TermFlow ensures full compliance with UK regulations including: automated Right to Rent checks with document verification, deposit protection within 30 days as required by law, GDPR-compliant data handling and storage, Houses in Multiple Occupation (HMO) licensing support, and UK fire safety and maintenance requirements tracking. All processes are auditable and generate compliance reports."
    },
    {
      question: "Can TermFlow handle clearing period demand?",
      answer: "Absolutely. TermFlow is designed to handle the massive spike in enquiries during A-level results day and clearing period. Our AI responds instantly to hundreds of simultaneous enquiries, books viewings automatically, and processes applications 24/7. Many UK operators report handling 10x more clearing enquiries without adding staff or working overtime."
    },
    {
      question: "What UK payment methods does TermFlow support?",
      answer: "TermFlow supports all major UK payment methods including bank transfers, debit/credit cards, and international payments for overseas students. We integrate with UK banks for direct debit setup, process deposits through approved protection schemes, and handle international wire transfers with automatic currency conversion. Parents can pay directly from overseas accounts."
    },
    {
      question: "How much does UK student accommodation software cost?",
      answer: "TermFlow pricing starts at £99/month for smaller UK portfolios (up to 100 beds), making it accessible for independent operators. Larger portfolios benefit from volume pricing - £299/month for 200-500 beds and custom enterprise pricing for 500+ beds. This is typically 80% cheaper than traditional letting agent fees which can be 8-12% of rental income."
    }
  ];

  const faqSchemaItems: FAQSchemaItem[] = faqItems.map(item => ({
    question: item.question,
    answer: item.answer
  }));

  const ukCities = [
    { name: "London", universities: 40, beds: "75,000+" },
    { name: "Manchester", universities: 5, beds: "35,000+" },
    { name: "Birmingham", universities: 5, beds: "30,000+" },
    { name: "Leeds", universities: 4, beds: "28,000+" },
    { name: "Bristol", universities: 2, beds: "25,000+" },
    { name: "Edinburgh", universities: 4, beds: "22,000+" },
    { name: "Glasgow", universities: 3, beds: "20,000+" },
    { name: "Newcastle", universities: 2, beds: "18,000+" },
    { name: "Sheffield", universities: 2, beds: "17,000+" },
    { name: "Liverpool", universities: 3, beds: "16,000+" }
  ];

  const ukSpecificFeatures = [
    {
      title: "Right to Rent Automation",
      description: "Automated document checks and verification for UK visa requirements",
      icon: Shield
    },
    {
      title: "UK Deposit Protection",
      description: "Integrated with DPS, TDS, and mydeposits schemes",
      icon: PoundSterling
    },
    {
      title: "Clearing Period Ready",
      description: "Handle A-level results day surge with unlimited capacity",
      icon: GraduationCap
    },
    {
      title: "UK Guarantor Support",
      description: "Manage UK-based and international guarantor agreements",
      icon: Users
    },
    {
      title: "UCAS Integration",
      description: "Sync with university admissions and accommodation systems",
      icon: Building2
    },
    {
      title: "UK Academic Calendar",
      description: "Built around September intakes and 40-52 week tenancies",
      icon: Clock
    }
  ];

  const ukRegulations = [
    "Right to Rent Checks",
    "Deposit Protection Schemes",
    "GDPR Compliance",
    "HMO Licensing",
    "Fire Safety Regulations",
    "Energy Performance Certificates",
    "Gas Safety Certificates",
    "Electrical Safety Standards"
  ];

  const ukStats = [
    { label: "UK Properties Using TermFlow", value: "200+", description: "Across all major cities" },
    { label: "UK Student Beds Managed", value: "20,000+", description: "And growing rapidly" },
    { label: "UK Compliance Rate", value: "100%", description: "Full regulatory adherence" },
    { label: "Average UK ROI", value: "470%", description: "Within first year" }
  ];

  return (
    <>
      <SEO
        title="UK Student Accommodation Software - PBSA Platform for British Universities | TermFlow"
        description="Leading UK student accommodation software designed for British PBSA operators. Automated Right to Rent checks, UK deposit protection, clearing period management. From £99/month."
        keywords="UK student accommodation software, British PBSA software, UK student housing platform, student accommodation software UK, UK student lettings system, British university accommodation software, clearing period software, Right to Rent automation UK"
        canonical="https://termflow.co.uk/uk-student-accommodation-software"
        ogTitle="UK Student Accommodation Software - Built for British PBSA"
        ogDescription="Purpose-built software for UK student accommodation. Handle clearing surges, Right to Rent checks, and UK compliance automatically. Used by 200+ British properties."
        ogUrl="https://termflow.co.uk/uk-student-accommodation-software"
      />
      
      <OrganizationSchema />
      <ServiceSchema 
        name="UK Student Accommodation Software"
        description="Purpose-built software for UK student accommodation operators. Handle clearing surges, Right to Rent checks, and UK compliance automatically."
      />
      <LocalBusinessSchema />
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
                  UK Pricing
                </a>
              </Link>
              <Link href="/locations/london">
                <a className="text-sm font-medium hover:text-primary" data-testid="link-locations">
                  UK Locations
                </a>
              </Link>
              <Link href="/book-demo">
                <a data-testid="link-book-demo">
                  <Button size="sm">Book UK Demo</Button>
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
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flag className="h-5 w-5 text-primary" />
              <Badge>Built in the UK, for the UK Market</Badge>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              UK Student Accommodation Software That Understands British PBSA
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Purpose-built for UK student accommodation operators. Handle Right to Rent checks, 
              deposit protection, clearing periods, and UK compliance - all automated by AI that speaks 
              proper British English (and 24 other languages for international students).
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/book-demo">
                <a data-testid="button-hero-demo">
                  <Button size="lg">
                    Book UK Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </Link>
              <Link href="/resources/pbsa-automation-guide-2025">
                <a data-testid="button-hero-guide">
                  <Button size="lg" variant="outline">
                    UK PBSA Guide 2025
                  </Button>
                </a>
              </Link>
            </div>
          </motion.div>

          {/* UK Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {ukStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover-elevate">
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

      {/* UK Market Context */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              The UK Student Accommodation Market Needs Specialist Software
            </h2>
            <p className="text-xl text-muted-foreground">
              With 2.9 million students and growing international demand, UK PBSA requires purpose-built solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-elevate">
              <CardHeader>
                <div className="text-4xl font-bold text-primary">700,000+</div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">PBSA Beds in the UK</h3>
                <p className="text-muted-foreground">
                  The UK has the largest purpose-built student accommodation market in Europe, 
                  requiring specialized management software.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="text-4xl font-bold text-primary">35%</div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">International Students</h3>
                <p className="text-muted-foreground">
                  UK universities attract students from 200+ countries, requiring multilingual 
                  support and international payment processing.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="text-4xl font-bold text-primary">£7.5bn</div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Annual Market Value</h3>
                <p className="text-muted-foreground">
                  The UK student accommodation sector is worth billions, with operators needing 
                  efficient software to remain competitive.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* UK-Specific Features */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Features Designed Specifically for UK Student Accommodation
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ukSpecificFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <feature.icon className="h-8 w-8 text-primary mb-3" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
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

      {/* UK Cities Coverage */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Serving Student Accommodation Across the UK
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {ukCities.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover-elevate">
                  <CardContent className="p-4">
                    <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">{city.name}</h3>
                    <p className="text-sm text-muted-foreground">{city.universities} universities</p>
                    <Badge variant="secondary" className="mt-2">{city.beds} beds</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/service-areas">
              <a data-testid="link-all-locations">
                <Button variant="outline">
                  View All UK Locations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* UK Compliance */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">100% UK Compliant</Badge>
            <h2 className="text-3xl font-bold mb-4">
              Full Compliance with UK Regulations
            </h2>
            <p className="text-xl text-muted-foreground">
              TermFlow ensures your student accommodation meets all UK legal requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ukRegulations.map((regulation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 p-3 bg-white rounded-lg hover-elevate"
              >
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{regulation}</span>
              </motion.div>
            ))}
          </div>

          <Card className="mt-12 bg-primary/5">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Automated Right to Rent Checks</h3>
                  <p className="text-muted-foreground mb-4">
                    TermFlow automatically verifies tenant eligibility to rent in the UK. We check passports, 
                    visas, and biometric residence permits, maintaining a complete audit trail for Home Office 
                    compliance.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Document verification in seconds</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Follow-up checks scheduled automatically</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Full audit trail maintained</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Deposit Protection Integration</h3>
                  <p className="text-muted-foreground mb-4">
                    Deposits are automatically protected with government-approved schemes within the 30-day 
                    legal requirement. TermFlow integrates with all three schemes and handles the entire process.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-white rounded">
                      <div className="font-semibold">DPS</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded">
                      <div className="font-semibold">TDS</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded">
                      <div className="font-semibold">mydeposits</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Clearing Period Focus */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <Badge className="mb-4" variant="destructive">Clearing Period Ready</Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Built to Handle UK Clearing Period Chaos
                </h2>
                <p className="text-xl text-muted-foreground">
                  When A-level results drop and clearing opens, TermFlow scales instantly
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">∞</div>
                  <h3 className="font-semibold mb-2">Unlimited Capacity</h3>
                  <p className="text-muted-foreground">
                    Handle hundreds of enquiries simultaneously without queues or delays
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <h3 className="font-semibold mb-2">Always Available</h3>
                  <p className="text-muted-foreground">
                    Students get instant responses even at 2am when they're making decisions
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">30s</div>
                  <h3 className="font-semibold mb-2">Instant Response</h3>
                  <p className="text-muted-foreground">
                    AI responds, qualifies, and books viewings before competitors even see the enquiry
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link href="/solutions/clearing-period">
                  <a data-testid="link-clearing-guide">
                    <Button size="lg" variant="outline">
                      Get Your Clearing Period Playbook
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* UK Success Stories */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for UK Student Accommodation Providers
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-elevate">
              <CardHeader>
                <Badge className="w-fit mb-2">London</Badge>
                <CardTitle>Capital Student Housing</CardTitle>
                <CardDescription>1,200 beds across 3 properties</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">98% occupancy</p>
                <p className="text-muted-foreground mb-4">
                  "TermFlow handles our international enquiries perfectly. Students from China can 
                  communicate in Mandarin at their convenience and sign contracts before flying to London."
                </p>
                <p className="text-sm font-medium">- James Chen, Property Manager</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <Badge className="w-fit mb-2">Manchester</Badge>
                <CardTitle>Northern Student Living</CardTitle>
                <CardDescription>850 beds near University of Manchester</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">45% faster lettings</p>
                <p className="text-muted-foreground mb-4">
                  "During clearing, we had 200+ enquiries in 48 hours. TermFlow's AI handled every 
                  single one, booked viewings, and we signed 40 contracts that weekend."
                </p>
                <p className="text-sm font-medium">- Emma Richardson, Regional Manager</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <Badge className="w-fit mb-2">Edinburgh</Badge>
                <CardTitle>Scottish Student Homes</CardTitle>
                <CardDescription>650 beds in Edinburgh city centre</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">£45k saved annually</p>
                <p className="text-muted-foreground mb-4">
                  "We eliminated letting agent fees and reduced admin staff overtime. The ROI was 
                  immediate. Right to Rent checks are now 100% compliant and automatic."
                </p>
                <p className="text-sm font-medium">- David MacLeod, Operations Director</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions About UK Student Accommodation Software
          </h2>
          <FAQ items={faqItems} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Flag className="h-6 w-6" />
            <h2 className="text-3xl font-bold">
              Join 200+ UK Properties Using TermFlow
            </h2>
          </div>
          <p className="text-xl mb-8 opacity-90">
            See how TermFlow can transform your UK student accommodation operations with a demo tailored to British PBSA
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/book-demo?market=uk">
              <a data-testid="button-cta-demo">
                <Button size="lg" variant="secondary">
                  Book UK Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </Link>
            <Link href="/pricing">
              <a data-testid="button-cta-pricing">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  View UK Pricing
                </Button>
              </a>
            </Link>
          </div>
          <p className="mt-8 text-sm opacity-75">
            14-day free trial • No credit card required • UK-based support
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