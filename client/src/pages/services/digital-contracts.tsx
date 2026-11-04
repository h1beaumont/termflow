import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileSignature, 
  Shield, 
  CheckCircle, 
  Clock, 
  FileCheck,
  AlertCircle,
  Lock,
  Zap,
  ArrowRight,
  Star,
  TrendingUp,
  FileText,
  Users,
  Wallet,
  Eye,
  Award,
  Bell
} from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { SoftwareApplicationSchema } from "@/components/SoftwareApplicationSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { ServiceSchema } from "@/components/ServiceSchema";
import { Footer } from "@/components/Footer";
import { FAQ, FAQItem } from "@/components/FAQ";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { Link } from "wouter";

export default function DigitalContracts() {
  const faqs: FAQItem[] = [
    {
      question: "Is this legally binding for student tenancy agreements?",
      answer: "Yes! E-signatures are legally valid in the UK under the Electronic Communications Act 2000. Our system creates a full audit trail showing who signed what and when, making it even more legally robust than paper contracts."
    },
    {
      question: "How does Right-to-Rent verification work?",
      answer: "Students upload passport/visa documents directly in the system. Our AI checks expiry dates and flags issues automatically. Staff review flagged documents and mark as verified. All documents are stored securely with full audit trail for Home Office compliance."
    },
    {
      question: "Which deposit protection schemes do you integrate with?",
      answer: "We integrate with all three UK government-approved schemes: TDS (Tenancy Deposit Scheme), DPS (Deposit Protection Service), and MyDeposits. Deposits are automatically registered after contract signing."
    },
    {
      question: "What happens if a student doesn't sign the contract?",
      answer: "Automated reminders are sent at 24h, 72h, and 7 days. If still unsigned after 7 days, staff are notified to follow up personally. You can also set a deadline that automatically releases the room if not signed by X date."
    },
    {
      question: "Can we use our own contract template?",
      answer: "Absolutely. You upload your existing contract template (PDF or Word), and we map the fields (student name, room number, rent amount, etc.). The system auto-fills these fields for each contract and sends for signature."
    },
    {
      question: "How do guarantor signatures work?",
      answer: "For students requiring guarantors, the system sends the contract to both student and guarantor. Both must sign before the contract is complete. Guarantor details are collected during application and auto-populated."
    }
  ];

  return (
    <>
      <SoftwareApplicationSchema />
      
      <SEOHead
        title="Digital PBSA Contracts & E-Signatures | TermFlow"
        description="Automate student tenancy agreements with digital contracts and e-signatures. Instant signing, deposit protection integration, compliance tracking for PBSA operators."
        keywords="digital tenancy agreements, student accommodation contracts, e-signature for PBSA, automated contract signing, student housing agreements, PBSA contract automation"
        canonical="https://termflow.co.uk/digital-contracts"
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://termflow.co.uk/" },
          { name: "Services", url: "https://termflow.co.uk/services" },
          { name: "Digital Contracts", url: "https://termflow.co.uk/digital-contracts" }
        ]}
      />

      <ServiceSchema
        name="Digital Contracts & E-Signatures"
        description="Automate student tenancy agreements with digital contracts, e-signatures, and compliance tracking"
        provider={{ name: "TermFlow", url: "https://termflow.co.uk" }}
        areaServed="United Kingdom"
        serviceType="Software as a Service"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#14213D] via-[#1B2B52] to-[#0E1A31] text-white py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(158,240,26,0.1),transparent_50%)]" />
          
          <div className="container max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge className="mb-6 bg-[#9EF01A] text-[#14213D] hover:bg-[#9EF01A]/90" data-testid="badge-service-category">
                Contract Automation
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight" data-testid="heading-hero">
                Digital Contracts in Minutes, Not Days
              </h1>
              
              <p className="text-xl md:text-2xl mb-4 text-white/90" data-testid="text-hero-subheadline">
                E-Signature & Contract Automation for Student Accommodation
              </p>
              
              <div className="flex flex-wrap gap-6 justify-center mb-10 text-lg">
                <div className="flex items-center gap-2" data-testid="feature-instant">
                  <Zap className="w-5 h-5 text-[#9EF01A]" />
                  <span>Instant Signing</span>
                </div>
                <div className="flex items-center gap-2" data-testid="feature-compliance">
                  <Shield className="w-5 h-5 text-[#9EF01A]" />
                  <span>Legal Compliance</span>
                </div>
                <div className="flex items-center gap-2" data-testid="feature-deposit">
                  <Wallet className="w-5 h-5 text-[#9EF01A]" />
                  <span>Deposit Protection</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book-demo">
                  <Button 
                    size="lg" 
                    className="bg-[#9EF01A] text-[#14213D] hover:bg-[#9EF01A]/90 font-semibold text-lg px-8"
                    data-testid="button-hero-demo"
                  >
                    Book a Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 text-lg px-8 backdrop-blur-sm"
                    data-testid="button-hero-learn"
                  >
                    See How It Works
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-background">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-problems">
                The Paper Contract Nightmare
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Slow, manual contract processes delay move-ins and create compliance headaches
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  title: "Slow Turnaround Times",
                  description: "Print, scan, email, wait for signature, chase, scan again. 5-7 days to get one contract signed. Students book elsewhere.",
                  icon: Clock
                },
                {
                  title: "Delayed Move-Ins",
                  description: "Contract stuck in email? Student can't move in. Room sits empty. Revenue lost while you wait for a signature.",
                  icon: AlertCircle
                },
                {
                  title: "Lost Contracts",
                  description: "Which version is current? Did they sign page 3? Contracts buried in email threads. No central tracking.",
                  icon: FileText
                },
                {
                  title: "Manual Compliance Tracking",
                  description: "Spreadsheet of Right-to-Rent checks. Manual deposit protection registration. One mistake = £5,000 fine.",
                  icon: Shield
                },
                {
                  title: "Deposit Protection Delays",
                  description: "Contract signed, but deposit not protected within 30 days. Another £5,000 fine waiting to happen.",
                  icon: Wallet
                },
                {
                  title: "Guarantor Coordination Chaos",
                  description: "Student in UK, guarantor in China. Printing, mailing, scanning contracts across 6 time zones. Nightmare.",
                  icon: Users
                }
              ].map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover-elevate" data-testid={`card-problem-${index}`}>
                    <CardHeader>
                      <problem.icon className="w-10 h-10 text-[#FF595E] mb-3" />
                      <CardTitle className="text-xl">{problem.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{problem.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution/Features Section */}
        <section className="py-20 bg-slate-50">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-[#9EF01A]/10 text-[#14213D] border-[#9EF01A]" data-testid="badge-solution">
                The Solution
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-solution">
                Contracts Signed in Hours, Not Days
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From application approval to signed contract—fully automated and legally compliant
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: FileSignature,
                  title: "Digital Tenancy Agreement Templates",
                  description: "Upload your contract template once. System auto-fills student name, room details, rent amount, contract dates. Send for signature in one click."
                },
                {
                  icon: CheckCircle,
                  title: "E-Signature Integration",
                  description: "Legally binding e-signatures via DocuSign or built-in signing. Students sign on phone, tablet, or desktop. Works from anywhere in the world."
                },
                {
                  icon: Shield,
                  title: "Automated Right-to-Rent Checks",
                  description: "Students upload passport/visa. AI flags expiry dates and missing documents. Staff review and approve. Full audit trail for Home Office compliance."
                },
                {
                  icon: Wallet,
                  title: "Deposit Protection Integration",
                  description: "Automatically register deposits with TDS, DPS, or MyDeposits after contract signing. No manual data entry. Never miss the 30-day deadline."
                },
                {
                  icon: Users,
                  title: "Guarantor Management",
                  description: "Contract sent to student and guarantor simultaneously. Both sign digitally. Track signing status in real-time. No postal delays."
                },
                {
                  icon: Eye,
                  title: "Compliance Tracking Dashboard",
                  description: "See all contracts at a glance: Pending signature, Awaiting Right-to-Rent, Deposit protected. Identify compliance risks before they become fines."
                },
                {
                  icon: Bell,
                  title: "Contract Status Notifications",
                  description: "Automated reminders to students who haven't signed. Staff notifications for contracts requiring action. Never lose track of a contract again."
                },
                {
                  icon: Lock,
                  title: "Secure Document Storage",
                  description: "All contracts and ID documents stored encrypted. GDPR-compliant retention policies. Legal audit trail with timestamps and IP addresses."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full" data-testid={`card-feature-${index}`}>
                    <CardHeader>
                      <feature.icon className="w-12 h-12 text-[#9EF01A] mb-3" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-lg">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-background">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-how-it-works">
                From Approval to Move-In Ready
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The complete contract workflow—automated end-to-end
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  step: 1,
                  title: "Application Approved",
                  description: "Staff approve student application in dashboard. System triggers contract generation automatically."
                },
                {
                  step: 2,
                  title: "AI Generates Contract",
                  description: "Contract auto-filled with student name, room number, rent amount, contract dates, guarantor details. Staff review and approve contract in 30 seconds."
                },
                {
                  step: 3,
                  title: "Sent for E-Signature",
                  description: "Contract sent to student (and guarantor if required) via email/WhatsApp with signing link. Works on any device, anywhere in the world."
                },
                {
                  step: 4,
                  title: "Automated Reminders",
                  description: "If unsigned after 24h: reminder sent. After 72h: another reminder. After 7 days: staff notified to follow up personally."
                },
                {
                  step: 5,
                  title: "Right-to-Rent & Deposit Protection",
                  description: "Once signed, student uploads ID documents. Staff verify Right-to-Rent. Deposit automatically registered with chosen protection scheme."
                },
                {
                  step: 6,
                  title: "Move-In Ready",
                  description: "All compliance checks complete. Student marked as 'Move-in ready.' Key collection details sent automatically. Room occupied on time."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6"
                  data-testid={`step-${step.step}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#9EF01A] text-[#14213D] flex items-center justify-center font-bold text-xl">
                      {step.step}
                    </div>
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-lg">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-slate-50">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-benefits">
                Measurable Impact on Your Operations
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Real results from PBSA operators using TermFlow contract automation
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                {
                  metric: "5 days → 2 hours",
                  description: "Contract turnaround time",
                  icon: Clock
                },
                {
                  metric: "100% compliance",
                  description: "Right-to-Rent verification",
                  icon: Shield
                },
                {
                  metric: "Zero fines",
                  description: "Deposit protection penalties",
                  icon: Award
                },
                {
                  metric: "3 days faster",
                  description: "Average move-in speed",
                  icon: TrendingUp
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center h-full hover-elevate" data-testid={`card-benefit-${index}`}>
                    <CardHeader>
                      <benefit.icon className="w-12 h-12 text-[#9EF01A] mx-auto mb-4" />
                      <CardTitle className="text-3xl font-bold text-[#14213D]">{benefit.metric}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-lg">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 bg-background">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-compliance">
                Built for UK Compliance
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Every feature designed to keep you legally compliant and audit-ready
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border-2 border-[#9EF01A]/20" data-testid="card-compliance-rtr">
                <CardHeader>
                  <Shield className="w-12 h-12 text-[#9EF01A] mb-3" />
                  <CardTitle className="text-2xl">UK Right-to-Rent Compliant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">Automated document collection from students</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">AI flags expired passports and visas</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">Full audit trail for Home Office compliance</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">Staff verification workflow with timestamps</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#9EF01A]/20" data-testid="card-compliance-deposit">
                <CardHeader>
                  <Wallet className="w-12 h-12 text-[#9EF01A] mb-3" />
                  <CardTitle className="text-2xl">Deposit Protection Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">TDS (Tenancy Deposit Scheme)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">DPS (Deposit Protection Service)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">MyDeposits integration</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">Automatic registration within 30 days</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#9EF01A]/20" data-testid="card-compliance-gdpr">
                <CardHeader>
                  <Lock className="w-12 h-12 text-[#9EF01A] mb-3" />
                  <CardTitle className="text-2xl">GDPR-Compliant Document Storage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">End-to-end encryption for all documents</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">Automated data retention policies</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">Student data access and deletion rights</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">ISO 27001 certified infrastructure</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#9EF01A]/20" data-testid="card-compliance-audit">
                <CardHeader>
                  <FileCheck className="w-12 h-12 text-[#9EF01A] mb-3" />
                  <CardTitle className="text-2xl">Legal Audit Trail</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">Timestamped contract actions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">IP address logging for signatures</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">Document version history</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#9EF01A] flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">Export audit reports for legal review</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Case Study/Testimonial */}
        <section className="py-20 bg-slate-50">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-[#9EF01A]/20" data-testid="card-case-study">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#14213D] to-[#1B2B52] flex items-center justify-center text-white font-bold text-2xl">
                        JW
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-[#9EF01A] text-[#9EF01A]" />
                        ))}
                      </div>
                      <CardTitle className="text-2xl mb-2">500-bed portfolio, Manchester & Leeds</CardTitle>
                      <p className="text-muted-foreground">James Wilson, Portfolio Director</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-xl leading-relaxed text-foreground border-l-4 border-[#9EF01A] pl-6 italic">
                    "We used to spend days chasing signatures and manually registering deposits. Last year we got fined £5,000 for missing a 30-day deposit protection deadline. Since switching to TermFlow, contract turnaround dropped from 5 days to 2 hours, and we haven't missed a single compliance deadline. The system just does it automatically. Worth every penny."
                  </blockquote>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Badge variant="secondary" data-testid="badge-metric-turnaround">
                      <Clock className="w-4 h-4 mr-1" />
                      5 days → 2 hours
                    </Badge>
                    <Badge variant="secondary" data-testid="badge-metric-compliance">
                      <Shield className="w-4 h-4 mr-1" />
                      100% compliance
                    </Badge>
                    <Badge variant="secondary" data-testid="badge-metric-fines">
                      <Award className="w-4 h-4 mr-1" />
                      Zero fines since launch
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#14213D] via-[#1B2B52] to-[#0E1A31] text-white">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6" data-testid="heading-cta">
                Ready to Automate Your Contracts?
              </h2>
              <p className="text-xl mb-10 text-white/90">
                See how TermFlow can reduce contract turnaround from days to hours—with full legal compliance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book-demo">
                  <Button 
                    size="lg" 
                    className="bg-[#9EF01A] text-[#14213D] hover:bg-[#9EF01A]/90 font-semibold text-lg px-10"
                    data-testid="button-cta-demo"
                  >
                    Book a Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 text-lg px-10 backdrop-blur-sm"
                    data-testid="button-cta-pricing"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-20 bg-background">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-related">
                Related Services
              </h2>
              <p className="text-xl text-muted-foreground">
                Complete your PBSA automation stack
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link href="/ai-viewing-booking">
                <Card className="h-full hover-elevate cursor-pointer" data-testid="card-related-viewings">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      AI Viewing Booking Automation
                      <ArrowRight className="w-5 h-5 text-[#9EF01A]" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg mb-4">
                      Automate viewing bookings with 24/7 WhatsApp responses, timezone handling, and automated reminders.
                    </p>
                    <Badge className="bg-[#9EF01A]/10 text-[#14213D]">Before Contract</Badge>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/how-it-works">
                <Card className="h-full hover-elevate cursor-pointer" data-testid="card-related-platform">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      Complete Platform Overview
                      <ArrowRight className="w-5 h-5 text-[#9EF01A]" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg mb-4">
                      See how contract automation fits into the complete student lettings workflow from enquiry to move-in.
                    </p>
                    <Badge className="bg-[#9EF01A]/10 text-[#14213D]">Full Journey</Badge>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-50">
          <div className="container max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-faq">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about digital contracts and e-signatures
              </p>
            </motion.div>

            <FAQ items={faqs} />
          </div>
        </section>

        <Footer />
        <MobileStickyCTA />
      </div>
    </>
  );
}
