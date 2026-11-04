import { SEOHead } from "@/components/SEOHead";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-tf-bg flex flex-col">
      <SEOHead
        title="Privacy Policy - TermFlow"
        description="TermFlow's privacy policy. Learn how we collect, use, and protect your data in compliance with GDPR and UK data protection laws."
        keywords="privacy policy, data protection, GDPR compliance"
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
          <h1 className="text-4xl font-bold mb-4" data-testid="text-privacy-heading">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8" data-testid="text-last-updated">
            Last updated: October 14, 2025
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            {/* Introduction */}
            <section data-testid="section-introduction">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                TermFlow ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered lettings automation platform for student accommodation.
              </p>
              <p className="text-muted-foreground">
                We are fully compliant with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </section>

            {/* Information We Collect */}
            <section data-testid="section-data-collection">
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Account information (name, email, phone number)</li>
                <li>Property details and listings</li>
                <li>Student tenant data (with consent)</li>
                <li>Payment and billing information</li>
                <li>Communications and correspondence</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Usage data and analytics</li>
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section data-testid="section-data-usage">
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-3">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide and maintain our lettings automation service</li>
                <li>Process payments and manage subscriptions</li>
                <li>Communicate with you about your account and bookings</li>
                <li>Send automated messages to students on your behalf</li>
                <li>Improve our AI algorithms and service quality</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            {/* Legal Basis for Processing */}
            <section data-testid="section-legal-basis">
              <h2 className="text-2xl font-bold mb-4">4. Legal Basis for Processing</h2>
              <p className="text-muted-foreground mb-3">We process your data under the following legal bases:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Contract Performance:</strong> To provide our services as agreed</li>
                <li><strong>Legitimate Interests:</strong> To improve our services and prevent fraud</li>
                <li><strong>Legal Obligation:</strong> To comply with UK laws and regulations</li>
                <li><strong>Consent:</strong> For marketing communications and optional features</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section data-testid="section-data-sharing">
              <h2 className="text-2xl font-bold mb-4">5. How We Share Your Information</h2>
              <p className="text-muted-foreground mb-3">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Service Providers:</strong> Stripe (payments), Twilio (communications), Google (calendar), OpenAI (AI processing)</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                We do not sell your personal information to third parties.
              </p>
            </section>

            {/* Data Security */}
            <section data-testid="section-data-security">
              <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>256-bit SSL/TLS encryption for data transmission</li>
                <li>Encrypted data storage</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and authentication</li>
                <li>UK and EU data residency options</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section data-testid="section-data-retention">
              <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Active account data: For the duration of your subscription</li>
                <li>Transaction records: 7 years (UK tax law requirement)</li>
                <li>Marketing data: Until you unsubscribe or request deletion</li>
                <li>Tenant data: As required by tenancy agreements and law</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section data-testid="section-user-rights">
              <h2 className="text-2xl font-bold mb-4">8. Your Rights Under GDPR</h2>
              <p className="text-muted-foreground mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate data</li>
                <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Restriction:</strong> Limit how we use your data</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Object:</strong> Object to certain processing activities</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                To exercise these rights, contact us at <a href="mailto:privacy@termflow.ai" className="text-primary hover:underline">privacy@termflow.ai</a>
              </p>
            </section>

            {/* Cookies */}
            <section data-testid="section-cookies">
              <h2 className="text-2xl font-bold mb-4">9. Cookies</h2>
              <p className="text-muted-foreground">
                We use essential cookies to make our site work. We do not use non-essential tracking cookies without your consent. For more information, see our <a href="/legal/cookies" className="text-primary hover:underline">Cookie Policy</a>.
              </p>
            </section>

            {/* Children's Privacy */}
            <section data-testid="section-children">
              <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our service is intended for landlords and property managers. We do not knowingly collect data from children under 18 without parental consent. Student tenant data is collected only when they are 18+ and have provided consent.
              </p>
            </section>

            {/* International Transfers */}
            <section data-testid="section-international">
              <h2 className="text-2xl font-bold mb-4">11. International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your data is primarily stored in the UK and EU. When we transfer data internationally, we ensure adequate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.
              </p>
            </section>

            {/* Changes to Policy */}
            <section data-testid="section-changes">
              <h2 className="text-2xl font-bold mb-4">12. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through our platform. Continued use of our service after changes constitutes acceptance.
              </p>
            </section>

            {/* Contact */}
            <section data-testid="section-contact">
              <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related questions or to exercise your rights:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground mt-3">
                <li><strong>Email:</strong> <a href="mailto:privacy@termflow.ai" className="text-primary hover:underline">privacy@termflow.ai</a></li>
                <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@termflow.ai" className="text-primary hover:underline">dpo@termflow.ai</a></li>
                <li><strong>Address:</strong> London, United Kingdom</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                You also have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK's supervisory authority for data protection.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
