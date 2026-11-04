import { SEOHead } from "@/components/SEOHead";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Shield, CheckCircle } from "lucide-react";

export default function GDPR() {
  return (
    <div className="min-h-screen bg-tf-bg flex flex-col">
      <SEOHead
        title="GDPR Information - TermFlow"
        description="Learn about TermFlow's GDPR compliance, data protection measures, and how we safeguard your information."
        keywords="GDPR compliance, data protection, EU data privacy"
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
          {/* Header with Icon */}
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-md bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold" data-testid="text-gdpr-heading">GDPR Compliance</h1>
              <p className="text-muted-foreground">UK & EU General Data Protection Regulation</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-8" data-testid="text-last-updated">
            Last updated: October 14, 2025
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            {/* Introduction */}
            <section data-testid="section-introduction">
              <h2 className="text-2xl font-bold mb-4">Our Commitment to Data Protection</h2>
              <p className="text-muted-foreground">
                TermFlow is fully committed to protecting your personal data and complying with the UK General Data Protection Regulation (UK GDPR) and the EU General Data Protection Regulation (EU GDPR). This page explains how we meet our obligations and protect your rights.
              </p>
              <div className="bg-muted/50 p-4 rounded-md mt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong>Certification:</strong> Our data protection practices are regularly audited and certified to ensure ongoing compliance with GDPR requirements.
                </p>
              </div>
            </section>

            {/* Data Collection Transparency */}
            <section data-testid="section-data-collection">
              <h2 className="text-2xl font-bold mb-4">1. Data Collection Transparency</h2>
              <p className="text-muted-foreground">
                We believe in complete transparency about what data we collect and why:
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-4">Personal Data We Collect</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Landlord Data:</strong> Name, email, phone number, business details, payment information</li>
                <li><strong>Tenant Data (with consent):</strong> Name, contact details, viewing preferences, identification documents</li>
                <li><strong>Property Data:</strong> Addresses, floor plans, photos, rental terms</li>
                <li><strong>Usage Data:</strong> Login times, feature usage, communication logs</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">Why We Collect This Data</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide our AI-powered lettings automation service</li>
                <li>To facilitate communication between landlords and tenants</li>
                <li>To process payments and manage contracts</li>
                <li>To improve our service through analytics</li>
                <li>To comply with legal obligations (KYC, anti-money laundering)</li>
              </ul>
            </section>

            {/* Your GDPR Rights */}
            <section data-testid="section-user-rights">
              <h2 className="text-2xl font-bold mb-4">2. Your Rights Under GDPR</h2>
              <p className="text-muted-foreground mb-4">
                You have the following rights regarding your personal data:
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Right to Access</h3>
                  <p className="text-muted-foreground">
                    Request a copy of all personal data we hold about you. We'll provide this within 30 days in a commonly used electronic format.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Right to Rectification</h3>
                  <p className="text-muted-foreground">
                    Correct any inaccurate or incomplete personal data. You can update most information directly in your account settings.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Right to Erasure ("Right to be Forgotten")</h3>
                  <p className="text-muted-foreground">
                    Request deletion of your personal data when it's no longer necessary for the purposes collected, subject to legal retention requirements.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Right to Restriction of Processing</h3>
                  <p className="text-muted-foreground">
                    Request that we limit how we use your data while we investigate a dispute or claim.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Right to Data Portability</h3>
                  <p className="text-muted-foreground">
                    Receive your data in a structured, machine-readable format (JSON, CSV) to transfer to another service.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Right to Object</h3>
                  <p className="text-muted-foreground">
                    Object to processing based on legitimate interests or for direct marketing purposes.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Right to Withdraw Consent</h3>
                  <p className="text-muted-foreground">
                    Withdraw consent for any processing that relies on consent (e.g., marketing emails) at any time.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Process Data */}
            <section data-testid="section-data-processing">
              <h2 className="text-2xl font-bold mb-4">3. How We Process Your Data</h2>
              
              <h3 className="text-xl font-semibold mb-3">Legal Basis for Processing</h3>
              <p className="text-muted-foreground mb-3">We process your data under these legal grounds:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Contract Performance:</strong> To deliver our service as agreed in our Terms</li>
                <li><strong>Legitimate Interests:</strong> To improve our service, prevent fraud, and maintain security</li>
                <li><strong>Legal Obligation:</strong> To comply with UK laws (tax, KYC, tenancy regulations)</li>
                <li><strong>Consent:</strong> For optional features and marketing communications</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">Data Minimization</h3>
              <p className="text-muted-foreground">
                We only collect data that is necessary and relevant for our stated purposes. We do not collect excessive or unnecessary information.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">Purpose Limitation</h3>
              <p className="text-muted-foreground">
                We only use your data for the purposes disclosed when collected. Any new purposes require your explicit consent or a legal basis.
              </p>
            </section>

            {/* Data Retention */}
            <section data-testid="section-retention">
              <h2 className="text-2xl font-bold mb-4">4. Data Retention Policy</h2>
              <p className="text-muted-foreground mb-3">
                We retain personal data only as long as necessary:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Active Accounts:</strong> For the duration of your subscription plus 30 days</li>
                <li><strong>Financial Records:</strong> 7 years (HMRC requirement)</li>
                <li><strong>Tenant Applications:</strong> 6 months after application or end of tenancy</li>
                <li><strong>Marketing Data:</strong> Until you unsubscribe or request deletion</li>
                <li><strong>Audit Logs:</strong> 12 months for security purposes</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                After retention periods expire, we securely delete or anonymize your data.
              </p>
            </section>

            {/* Third-Party Processors */}
            <section data-testid="section-processors">
              <h2 className="text-2xl font-bold mb-4">5. Third-Party Data Processors</h2>
              <p className="text-muted-foreground mb-3">
                We work with carefully vetted third-party processors who meet GDPR standards:
              </p>
              
              <div className="space-y-3">
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="font-semibold">Stripe (Payment Processing)</p>
                  <p className="text-sm text-muted-foreground">PCI DSS Level 1 certified, EU data residency available</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="font-semibold">Twilio (Communications)</p>
                  <p className="text-sm text-muted-foreground">ISO 27001 certified, GDPR compliant</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="font-semibold">Google Workspace (Calendar, Storage)</p>
                  <p className="text-sm text-muted-foreground">ISO 27001, SOC 2/3 certified, EU data residency</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="font-semibold">OpenAI (AI Processing)</p>
                  <p className="text-sm text-muted-foreground">Data Processing Addendum signed, zero data retention mode</p>
                </div>
              </div>

              <p className="text-muted-foreground mt-4">
                All processors sign Data Processing Agreements (DPAs) with Standard Contractual Clauses for international transfers.
              </p>
            </section>

            {/* Data Security */}
            <section data-testid="section-security">
              <h2 className="text-2xl font-bold mb-4">6. Data Security Measures</h2>
              <p className="text-muted-foreground mb-3">
                We implement industry-leading security measures:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Encryption:</strong> 256-bit SSL/TLS for data in transit, AES-256 for data at rest</li>
                <li><strong>Access Controls:</strong> Role-based access, multi-factor authentication</li>
                <li><strong>Regular Audits:</strong> Quarterly security audits and penetration testing</li>
                <li><strong>Incident Response:</strong> 24/7 monitoring and breach notification within 72 hours</li>
                <li><strong>Employee Training:</strong> Mandatory GDPR and security training for all staff</li>
                <li><strong>Data Residency:</strong> UK and EU data centers available</li>
              </ul>
            </section>

            {/* International Transfers */}
            <section data-testid="section-transfers">
              <h2 className="text-2xl font-bold mb-4">7. International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your data is primarily stored in UK and EU data centers. When data must be transferred internationally (e.g., for US-based AI processing), we ensure:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li>Adequate security measures in the receiving country</li>
                <li>Transparency about which data is transferred and why</li>
                <li>Your explicit consent where required</li>
              </ul>
            </section>

            {/* Exercising Your Rights */}
            <section data-testid="section-exercise-rights">
              <h2 className="text-2xl font-bold mb-4">8. How to Exercise Your Rights</h2>
              <p className="text-muted-foreground mb-3">
                To exercise any of your GDPR rights:
              </p>
              
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-md">
                <h3 className="text-lg font-semibold mb-4">Contact Our Data Protection Officer</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Email:</strong> <a href="mailto:dpo@termflow.ai" className="text-primary hover:underline">dpo@termflow.ai</a></li>
                  <li><strong>Privacy Team:</strong> <a href="mailto:privacy@termflow.ai" className="text-primary hover:underline">privacy@termflow.ai</a></li>
                  <li><strong>Response Time:</strong> Within 30 days (may extend to 60 days for complex requests)</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  We may ask for identification to verify your identity before processing requests.
                </p>
              </div>
            </section>

            {/* Complaints */}
            <section data-testid="section-complaints">
              <h2 className="text-2xl font-bold mb-4">9. Right to Lodge a Complaint</h2>
              <p className="text-muted-foreground">
                If you believe we have not handled your personal data properly, you have the right to lodge a complaint with:
              </p>
              <div className="bg-muted/30 p-4 rounded-md mt-4">
                <p className="font-semibold mb-2">Information Commissioner's Office (ICO)</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk</a></li>
                  <li>Helpline: 0303 123 1113</li>
                  <li>Address: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
                </ul>
              </div>
              <p className="text-muted-foreground mt-4">
                We encourage you to contact us first so we can address your concerns directly.
              </p>
            </section>

            {/* Updates */}
            <section data-testid="section-updates">
              <h2 className="text-2xl font-bold mb-4">10. Updates to This Page</h2>
              <p className="text-muted-foreground">
                We regularly review and update our GDPR compliance practices. Material changes will be communicated via email and reflected on this page with an updated "Last updated" date.
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
