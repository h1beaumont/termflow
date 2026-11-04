import { SEOHead } from "@/components/SEOHead";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-tf-bg flex flex-col">
      <SEOHead
        title="TermFlow Terms of Service | AI Lettings Automation Platform User Agreement"
        description="TermFlow's terms of service for PBSA landlords using our AI-powered lettings automation platform. Coverage includes account usage, data processing, service levels, compliance, and UK lettings law alignment."
        keywords="termflow terms of service, PBSA platform terms, lettings automation user agreement, AI lettings terms and conditions, student accommodation software agreement, termflow legal"
        canonical="https://termflow.co.uk/legal/terms"
        ogTitle="TermFlow Terms of Service | AI Lettings Platform User Agreement"
        ogDescription="Terms of service for PBSA landlords using TermFlow's AI-powered lettings automation platform. Account usage, data processing, compliance, and UK lettings law."
        ogType="website"
        ogUrl="https://termflow.co.uk/legal/terms"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <a href="/" data-testid="link-home">
            <TermFlowWordmark />
          </a>
          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" asChild data-testid="button-login">
              <a href="/api/login">Sign in</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-terms-heading">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8" data-testid="text-last-updated">
            Last updated: October 14, 2025
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            {/* Introduction */}
            <section data-testid="section-introduction">
              <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using TermFlow's AI-powered lettings automation platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use our Service.
              </p>
              <p className="text-muted-foreground">
                These Terms constitute a legally binding agreement between you ("User", "you", or "your") and TermFlow ("we", "us", or "our").
              </p>
            </section>

            {/* Service Description */}
            <section data-testid="section-service">
              <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
              <p className="text-muted-foreground">
                TermFlow provides an AI-powered automation platform for student accommodation lettings, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Automated lead capture and qualification</li>
                <li>WhatsApp, email, and SMS communication automation</li>
                <li>Viewing booking and calendar management</li>
                <li>Contract generation and digital signing</li>
                <li>Deposit collection and payment processing</li>
                <li>Analytics and reporting</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section data-testid="section-accounts">
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold mb-3">3.1 Account Registration</h3>
              <p className="text-muted-foreground">
                You must create an account to use our Service. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">3.2 Account Eligibility</h3>
              <p className="text-muted-foreground">
                You must be at least 18 years old and have the legal authority to enter into these Terms. Our Service is intended for UK-based property landlords and managers.
              </p>
            </section>

            {/* Acceptable Use */}
            <section data-testid="section-acceptable-use">
              <h2 className="text-2xl font-bold mb-4">4. Acceptable Use Policy</h2>
              <p className="text-muted-foreground mb-3">You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any UK laws or regulations</li>
                <li>Send spam, unsolicited messages, or harassment</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to systems</li>
                <li>Use automated means to access the Service without permission</li>
                <li>Impersonate another person or entity</li>
                <li>Collect or store personal data of students without consent</li>
              </ul>
            </section>

            {/* Payment Terms */}
            <section data-testid="section-payment">
              <h2 className="text-2xl font-bold mb-4">5. Payment Terms</h2>
              
              <h3 className="text-xl font-semibold mb-3">5.1 Pricing</h3>
              <p className="text-muted-foreground">
                Our pricing is based on a per-bed-per-month model with volume tiers. Current pricing is available at <a href="/pricing" className="text-primary hover:underline">/pricing</a>.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">5.2 Billing</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Subscription fees are billed monthly in advance</li>
                <li>Payment is processed via Stripe</li>
                <li>All fees are non-refundable unless otherwise stated</li>
                <li>We reserve the right to change pricing with 30 days' notice</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">5.3 Late Payment</h3>
              <p className="text-muted-foreground">
                Failure to pay on time may result in service suspension or termination. You remain responsible for all fees accrued during suspension.
              </p>
            </section>

            {/* Intellectual Property */}
            <section data-testid="section-ip">
              <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The Service and its original content, features, and functionality are owned by TermFlow and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground mt-3">
                You retain ownership of your data (property listings, tenant information, etc.) but grant us a license to use it to provide the Service.
              </p>
            </section>

            {/* Data and Privacy */}
            <section data-testid="section-privacy">
              <h2 className="text-2xl font-bold mb-4">7. Data and Privacy</h2>
              <p className="text-muted-foreground">
                Your use of the Service is also governed by our <a href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</a>. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Comply with UK GDPR and data protection laws</li>
                <li>Only collect and process tenant data with proper consent</li>
                <li>Maintain accurate and up-to-date information</li>
                <li>Notify us of any data breaches immediately</li>
              </ul>
            </section>

            {/* Termination */}
            <section data-testid="section-termination">
              <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
              
              <h3 className="text-xl font-semibold mb-3">8.1 Termination by You</h3>
              <p className="text-muted-foreground">
                You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. No refunds for partial months.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">8.2 Termination by Us</h3>
              <p className="text-muted-foreground">
                We may suspend or terminate your account if you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Violate these Terms or our Acceptable Use Policy</li>
                <li>Fail to pay fees when due</li>
                <li>Engage in fraudulent or illegal activity</li>
                <li>Cause harm to our systems or other users</li>
              </ul>
            </section>

            {/* Warranties and Disclaimers */}
            <section data-testid="section-warranties">
              <h2 className="text-2xl font-bold mb-4">9. Warranties and Disclaimers</h2>
              <p className="text-muted-foreground">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. We do not guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Uninterrupted or error-free operation</li>
                <li>Complete accuracy of AI-generated content</li>
                <li>That the Service will meet your specific requirements</li>
                <li>That all bugs or errors will be corrected</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                You are responsible for reviewing all AI-generated communications and contracts before sending to students.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section data-testid="section-liability">
              <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY UK LAW, TERMFLOW SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Damages arising from unauthorized access to your account</li>
                <li>Errors or inaccuracies in AI-generated content</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Our total liability shall not exceed the amount you paid us in the 12 months prior to the claim.
              </p>
            </section>

            {/* Indemnification */}
            <section data-testid="section-indemnification">
              <h2 className="text-2xl font-bold mb-4">11. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless TermFlow from any claims, damages, or expenses arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Your violation of these Terms</li>
                <li>Your violation of any laws or regulations</li>
                <li>Your breach of any tenant's rights</li>
                <li>Your misuse of the Service</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section data-testid="section-governing-law">
              <h2 className="text-2xl font-bold mb-4">12. Governing Law and Dispute Resolution</h2>
              <p className="text-muted-foreground">
                These Terms are governed by the laws of England and Wales. Any disputes shall be resolved through:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li><strong>Negotiation:</strong> Good faith discussions between parties</li>
                <li><strong>Mediation:</strong> Facilitated resolution (if negotiation fails)</li>
                <li><strong>Arbitration or Courts:</strong> Exclusive jurisdiction of English courts</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section data-testid="section-changes">
              <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms from time to time. We will notify you of material changes via email or platform notification at least 30 days in advance. Continued use after changes constitutes acceptance.
              </p>
            </section>

            {/* Contact */}
            <section data-testid="section-contact">
              <h2 className="text-2xl font-bold mb-4">14. Contact Us</h2>
              <p className="text-muted-foreground">
                For questions about these Terms:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground mt-3">
                <li><strong>Email:</strong> <a href="mailto:legal@termflow.ai" className="text-primary hover:underline">legal@termflow.ai</a></li>
                <li><strong>Support:</strong> <a href="mailto:support@termflow.ai" className="text-primary hover:underline">support@termflow.ai</a></li>
                <li><strong>Address:</strong> London, United Kingdom</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
