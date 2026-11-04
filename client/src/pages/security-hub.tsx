import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SEOHead } from "@/components/SEOHead";
import { SoftwareApplicationSchema } from "@/components/SoftwareApplicationSchema";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Footer } from "@/components/Footer";
import { FAQ, FAQItem } from "@/components/FAQ";
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Database, 
  Key, 
  Server, 
  Eye,
  UserCheck,
  ArrowRight,
  FileCheck,
  Users,
  Building2,
  Download,
  ExternalLink,
  Zap,
  RefreshCw,
  ShieldCheck,
  Globe,
  HardDrive
} from "lucide-react";

export default function SecurityHub() {
  const faqItems: FAQItem[] = [
    {
      question: "Who controls final decisions in TermFlow?",
      answer: "Landlords and operators maintain full control at all times. TermFlow's AI assistant (Ava) handles conversations and suggests actions, but every critical decision requires human approval. Tenancy approvals, contract signatures, deposit releases, and payment processing all require explicit landlord confirmation. The AI automates communication—humans control outcomes."
    },
    {
      question: "Is student data shared with third parties?",
      answer: "No. We do not share, sell, or monetize student data. Student information is only used to deliver TermFlow services and is processed by trusted sub-processors (OpenAI for AI, Twilio for messaging, Stripe for payments) under strict Data Processing Agreements. All sub-processors are GDPR-compliant and operate under contractual obligations to protect data. Students can request data export or deletion at any time."
    },
    {
      question: "What happens if the AI makes a mistake or fails?",
      answer: "TermFlow has multiple safety layers: (1) AI responses are validated against property data before sending, (2) Critical actions (approvals, payments, contracts) always require human confirmation, (3) If AI confidence is low, queries are escalated to staff immediately, (4) All conversations are logged and reviewable by landlords, (5) Manual override is always available—you can take control of any conversation instantly."
    },
    {
      question: "Can I revoke TermFlow's access to my data?",
      answer: "Yes, instantly. You can export all your data at any time and delete your account within the dashboard. Upon deletion, we permanently remove all property data, student records, and conversation history within 30 days (we retain some data longer only if required by law for accounting/compliance). We also provide a full data export in JSON and CSV formats before deletion."
    },
    {
      question: "How does TermFlow handle Right-to-Rent verification data?",
      answer: "Right-to-Rent data (passport scans, visa documents) is encrypted at rest using AES-256 and in transit using TLS 1.3. Documents are stored in UK data centers and automatically deleted 12 months after tenancy ends (or earlier if you configure it). Only authorized staff can access identity documents, and all access is logged for audit trails. We comply with UK Home Office guidance on document retention."
    },
    {
      question: "What certifications does TermFlow have?",
      answer: "TermFlow is GDPR-compliant and processes data in accordance with UK Data Protection Act 2018. We maintain SOC 2 Type II compliance (security, availability, confidentiality). Our infrastructure uses ISO 27001-certified data centers in the UK. We conduct annual penetration testing and quarterly security audits. We're also members of the UK PropTech Association and adhere to their data ethics framework."
    },
    {
      question: "How does TermFlow ensure data residency in the UK?",
      answer: "All primary data storage is in UK data centers (London region). Student data, property records, and conversation logs never leave UK servers. Some sub-processors (OpenAI for AI, Stripe for payments) may process data outside the UK, but we use Standard Contractual Clauses (SCCs) and Data Processing Agreements to ensure GDPR-level protection. You can request a full data flow map during procurement."
    },
    {
      question: "What happens to data if TermFlow shuts down?",
      answer: "We have a Business Continuity Plan: (1) You receive 90 days' notice before service termination, (2) During this period, you can export all data in portable formats (JSON, CSV, PDF), (3) We provide migration assistance to alternative platforms, (4) After termination, all data is securely deleted within 30 days unless you request extended retention. We also maintain data backups for 90 days post-shutdown for recovery purposes."
    }
  ];

  const legalDocs = [
    {
      title: "Terms of Service",
      description: "Platform usage terms, service levels, and contractual obligations",
      icon: FileText,
      href: "/legal/terms",
      badge: "Updated Oct 2025"
    },
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your data under UK GDPR",
      icon: Lock,
      href: "/legal/privacy",
      badge: "GDPR Compliant"
    },
    {
      title: "Data Processing Agreement",
      description: "Controller-processor terms for GDPR Article 28 compliance",
      icon: FileCheck,
      href: "/legal/dpa",
      badge: "Article 28"
    },
    {
      title: "Student Data Privacy",
      description: "Specific protections for student personal data and Right-to-Rent",
      icon: UserCheck,
      href: "/security/student-data-privacy",
      badge: "Student Focus"
    },
    {
      title: "Cookie Policy",
      description: "How we use cookies and tracking technologies",
      icon: Eye,
      href: "/legal/cookies",
      badge: "Transparency"
    },
    {
      title: "Acceptable Use Policy",
      description: "Guidelines for appropriate use of the TermFlow platform",
      icon: AlertTriangle,
      href: "/legal/aup",
      badge: "Fair Use"
    }
  ];

  const complianceBadges = [
    {
      title: "UK Data Residency",
      description: "All primary data stored in UK data centers (London region)",
      icon: Globe,
      color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
    },
    {
      title: "GDPR Compliant",
      description: "Full compliance with UK GDPR and Data Protection Act 2018",
      icon: ShieldCheck,
      color: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
    },
    {
      title: "Right-to-Rent Compliance",
      description: "Secure handling of UK Home Office identity verification",
      icon: UserCheck,
      color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800"
    },
    {
      title: "Deposit Protection",
      description: "Integration with TDS, DPS, and MyDeposits schemes",
      icon: Shield,
      color: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
    },
    {
      title: "SOC 2 Type II",
      description: "Certified for security, availability, and confidentiality",
      icon: CheckCircle,
      color: "bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800"
    },
    {
      title: "ISO 27001 Infrastructure",
      description: "Data centers meet international security standards",
      icon: Server,
      color: "bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800"
    }
  ];

  const securityPractices = [
    {
      title: "End-to-End Encryption",
      description: "All data encrypted in transit (TLS 1.3) and at rest (AES-256). Student documents, payment data, and conversations are protected with enterprise-grade encryption.",
      icon: Lock
    },
    {
      title: "Regular Security Audits",
      description: "Annual penetration testing by certified ethical hackers, quarterly vulnerability scans, and continuous monitoring for threats. Full audit reports available on request.",
      icon: ShieldCheck
    },
    {
      title: "Access Controls & Permissions",
      description: "Role-based access control (RBAC) ensures only authorized users can view sensitive data. Multi-factor authentication (MFA) required for all admin accounts.",
      icon: Key
    },
    {
      title: "Data Retention Policies",
      description: "Student data retained only as long as necessary. Right-to-Rent documents auto-deleted after 12 months. Conversation logs retained for 24 months for compliance.",
      icon: Database
    },
    {
      title: "Backup & Disaster Recovery",
      description: "Automated daily backups with 30-day retention. Geographic redundancy across UK regions. Recovery Time Objective (RTO) of 4 hours, Recovery Point Objective (RPO) of 1 hour.",
      icon: HardDrive
    },
    {
      title: "Incident Response Plan",
      description: "24/7 security monitoring with automated alerts. Incident response team activates within 1 hour of detection. Breach notification within 72 hours as required by GDPR.",
      icon: AlertTriangle
    }
  ];

  return (
    <>
      <SoftwareApplicationSchema />
      <LocalBusinessSchema />
      
      <SEOHead
        title="PBSA Security & Compliance Hub | TermFlow"
        description="Learn how TermFlow keeps your PBSA data secure with GDPR compliance, UK data residency, and human-in-loop AI controls."
        keywords="PBSA security, student data protection, GDPR compliance, UK data residency, AI security controls, Right-to-Rent compliance, deposit protection"
        canonical="https://termflow.co.uk/security"
        ogTitle="Security & Compliance | TermFlow"
        ogDescription="Learn how TermFlow keeps your PBSA data secure with GDPR compliance, UK data residency, and human-in-loop AI controls."
        ogType="website"
        ogUrl="https://termflow.co.uk/security"
        twitterCard="summary_large_image"
        twitterTitle="Security & Compliance | TermFlow"
        twitterDescription="GDPR-compliant AI automation for student lettings with UK data residency and human-in-loop controls."
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Security & Compliance", url: "/security" }
        ]}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="header-security-hub">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <a href="/" data-testid="link-home">
            <TermFlowWordmark />
          </a>
          <Button asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90" data-testid="button-book-demo-header">
            <a href="/book-demo">Book Demo</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-tf-navy to-tf-navy-700" data-testid="section-hero">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <Badge className="bg-tf-lime text-tf-navy" data-testid="badge-security">
                Security & Compliance
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6" data-testid="heading-hero">
              Security & Compliance at TermFlow
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8" data-testid="text-hero-subtitle">
              How TermFlow keeps your PBSA data secure with GDPR compliance, UK data residency, and human-in-loop AI controls
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button asChild variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm" data-testid="button-download-security-pdf">
                <a href="#legal-docs">
                  <Download className="h-4 w-4 mr-2" />
                  Legal Documents
                </a>
              </Button>
              <Button asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90" data-testid="button-book-security-demo">
                <a href="/book-demo">Discuss Security Requirements</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Human-in-Loop Diagram Section (PRIMARY FOCUS) */}
      <section className="py-20 bg-white" data-testid="diagram-human-in-loop">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-tf-navy mb-4" data-testid="heading-human-in-loop">
              AI Assists, Humans Decide
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto" data-testid="text-human-in-loop-subtitle">
              TermFlow's AI automates conversations and suggests actions, but landlords and operators maintain full control over every critical decision.
            </p>
          </motion.div>

          {/* Flowchart Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <Card className="border-2 border-tf-navy/10 shadow-lg" data-testid="card-flowchart">
              <CardContent className="p-8">
                {/* Flowchart Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-center">
                  {/* Step 1: AI Suggestion */}
                  <div className="text-center" data-testid="flow-step-ai-suggestion">
                    <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mb-4">
                      <Zap className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-tf-navy">AI Suggestion</h3>
                    <p className="text-sm text-gray-600">
                      Ava processes enquiry, suggests response, and recommends action
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex justify-center items-center">
                    <ArrowRight className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="md:hidden flex justify-center items-center">
                    <ArrowRight className="h-8 w-8 text-gray-400 rotate-90" />
                  </div>

                  {/* Step 2: Human Review */}
                  <div className="text-center" data-testid="flow-step-human-review">
                    <div className="mx-auto w-20 h-20 bg-amber-100 dark:bg-amber-950 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-tf-navy">Human Review</h3>
                    <p className="text-sm text-gray-600">
                      Landlord reviews suggestion and approves or rejects
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex justify-center items-center">
                    <ArrowRight className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="md:hidden flex justify-center items-center">
                    <ArrowRight className="h-8 w-8 text-gray-400 rotate-90" />
                  </div>

                  {/* Step 3: Final Action */}
                  <div className="text-center" data-testid="flow-step-final-action">
                    <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-tf-navy">Final Action</h3>
                    <p className="text-sm text-gray-600">
                      Only after approval, action is executed (contract, payment, etc.)
                    </p>
                  </div>
                </div>

                {/* Emphasis Text */}
                <div className="mt-10 p-6 bg-tf-lime/10 border-l-4 border-tf-lime rounded-md">
                  <p className="text-lg font-semibold text-tf-navy text-center" data-testid="text-emphasis">
                    "AI automates conversations, humans control outcomes"
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Specific Examples Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-tf-navy mb-6 text-center" data-testid="heading-examples">
              Real Examples: Where Human Approval is Required
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Example 1: Tenancy Approvals */}
              <Card className="hover-elevate" data-testid="card-example-tenancy">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-md flex items-center justify-center mb-3">
                    <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">Tenancy Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Ava can suggest a student for a room based on preferences, but cannot approve the tenancy.
                  </p>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-xs">
                    <strong className="text-tf-navy">Landlord Action Required:</strong>
                    <br />
                    Review student profile → Click "Approve Tenancy" → Confirm
                  </div>
                </CardContent>
              </Card>

              {/* Example 2: Contract Signatures */}
              <Card className="hover-elevate" data-testid="card-example-contracts">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-md flex items-center justify-center mb-3">
                    <FileCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Contract Signatures</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Ava generates contract draft, but landlord must review terms and send for signature.
                  </p>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-xs">
                    <strong className="text-tf-navy">Landlord Action Required:</strong>
                    <br />
                    Review contract → Edit if needed → Click "Send for Signature"
                  </div>
                </CardContent>
              </Card>

              {/* Example 3: Deposit Releases */}
              <Card className="hover-elevate" data-testid="card-example-deposits">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-md flex items-center justify-center mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">Deposit Releases</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Ava can remind about deposit release, but cannot release funds without landlord verification.
                  </p>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-xs">
                    <strong className="text-tf-navy">Landlord Action Required:</strong>
                    <br />
                    Verify property condition → Enter refund amount → Authorize release
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Additional Safety Layer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <Card className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800" data-testid="card-safety-layers">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-tf-navy" />
                  Additional Safety Layers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Conversation Review:</strong> Landlords can review all AI conversations in real-time and override responses at any moment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Escalation Triggers:</strong> If AI confidence is below 85%, queries are automatically escalated to staff for manual handling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Audit Logs:</strong> Every AI action is logged with timestamp, context, and reasoning for full transparency and compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Manual Override:</strong> Landlords can disable AI for specific properties, conversations, or time periods instantly</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Compliance Badges Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900" data-testid="section-compliance-badges">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-tf-navy mb-4" data-testid="heading-compliance">
              Certifications & Compliance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto" data-testid="text-compliance-subtitle">
              TermFlow meets the highest standards for data protection, security, and PBSA industry compliance
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {complianceBadges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <Card key={index} className={`border-2 ${badge.color}`} data-testid={`badge-compliance-${index}`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-md">
                        <IconComponent className="h-6 w-6 text-tf-navy" />
                      </div>
                      <div>
                        <CardTitle className="text-base mb-1">{badge.title}</CardTitle>
                        <CardDescription className="text-sm">{badge.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Legal Documents Grid */}
      <section id="legal-docs" className="py-20 bg-white" data-testid="grid-legal-docs">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-tf-navy mb-4" data-testid="heading-legal-docs">
              Legal Documentation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto" data-testid="text-legal-docs-subtitle">
              Comprehensive legal policies covering data protection, service terms, and compliance requirements
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {legalDocs.map((doc, index) => {
              const IconComponent = doc.icon;
              return (
                <Card key={index} className="hover-elevate" data-testid={`card-legal-doc-${index}`}>
                  <CardHeader>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-tf-navy/5 rounded-md">
                        <IconComponent className="h-5 w-5 text-tf-navy" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1">{doc.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">{doc.badge}</Badge>
                      </div>
                    </div>
                    <CardDescription className="text-sm">{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="sm" className="w-full" data-testid={`button-view-legal-${index}`}>
                      <a href={doc.href}>
                        View Document
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Data Security Practices */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900" data-testid="section-data-security">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-tf-navy mb-4" data-testid="heading-data-security">
              Data Security Practices
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto" data-testid="text-data-security-subtitle">
              Enterprise-grade security measures protecting your PBSA data and student information
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {securityPractices.map((practice, index) => {
              const IconComponent = practice.icon;
              return (
                <Card key={index} className="hover-elevate" data-testid={`card-security-practice-${index}`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-tf-lime/10 rounded-md">
                        <IconComponent className="h-6 w-6 text-tf-navy" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{practice.title}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">{practice.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </motion.div>

          {/* Additional Security Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <Card className="bg-tf-navy text-white border-0" data-testid="card-security-note">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Request a Security Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-200">
                  For enterprise procurement, we offer comprehensive security reviews including penetration test reports, SOC 2 documentation, and custom Data Processing Agreements.
                </p>
                <Button asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90" data-testid="button-request-security-review">
                  <a href="/book-demo?topic=security">Request Security Review</a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Security FAQ */}
      <section className="py-20 bg-white" data-testid="section-security-faq">
        <div className="max-w-4xl mx-auto px-6">
          <FAQ 
            items={faqItems}
            title="Security & Compliance FAQ"
            description="Common questions about TermFlow's security, data protection, and AI control mechanisms"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-tf-navy to-tf-navy-700" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" data-testid="heading-cta">
              Ready to Discuss Your Security Requirements?
            </h2>
            <p className="text-xl text-gray-200 mb-8" data-testid="text-cta-subtitle">
              Book a demo to discuss security, compliance, and data protection with our team
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90" size="lg" data-testid="button-cta-book-demo">
                <a href="/book-demo">Book a Demo</a>
              </Button>
              <Button asChild variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm" size="lg" data-testid="button-cta-contact">
                <a href="/contact">Contact Security Team</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
