import { SEOHead } from "@/components/SEOHead";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function AUP() {
  return (
    <div className="min-h-screen bg-tf-bg flex flex-col">
      <SEOHead
        title="Acceptable Use Policy - TermFlow"
        description="TermFlow's Acceptable Use Policy. Learn about permitted and prohibited uses of our AI-powered lettings automation platform."
        keywords="acceptable use policy, AUP, terms of use, prohibited activities"
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
          <h1 className="text-4xl font-bold mb-4" data-testid="text-aup-heading">Acceptable Use Policy</h1>
          <p className="text-sm text-muted-foreground mb-8" data-testid="text-last-updated">
            Last updated: October 14, 2025
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            {/* Introduction */}
            <section data-testid="section-introduction">
              <h2 className="text-2xl font-bold mb-4">1. Introduction and Scope</h2>
              <p className="text-muted-foreground">
                This Acceptable Use Policy ("AUP") sets forth the rules and guidelines for using TermFlow's AI-powered lettings automation platform ("Service"). This policy is incorporated into and forms part of our Terms of Service.
              </p>
              <p className="text-muted-foreground mt-3">
                By using our Service, you agree to comply with this AUP. Violation of this policy may result in immediate suspension or termination of your account.
              </p>
            </section>

            {/* Permitted Uses */}
            <section data-testid="section-permitted">
              <h2 className="text-2xl font-bold mb-4">2. Permitted Uses</h2>
              <p className="text-muted-foreground mb-3">You may use the Service for:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Managing student accommodation lettings and applications</li>
                <li>Automating communications with prospective tenants</li>
                <li>Processing viewing bookings and calendar management</li>
                <li>Generating and managing tenancy contracts</li>
                <li>Collecting deposits and processing payments</li>
                <li>Accessing analytics and reporting features</li>
                <li>Any other legitimate business purpose related to property management in compliance with UK law</li>
              </ul>
            </section>

            {/* Prohibited Uses */}
            <section data-testid="section-prohibited">
              <h2 className="text-2xl font-bold mb-4">3. Prohibited Uses</h2>
              <p className="text-muted-foreground mb-3">
                You must NOT use the Service for any of the following purposes:
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">3.1 Illegal Activities</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Any activity that violates UK laws or regulations</li>
                <li>Fraud, money laundering, or financial crimes</li>
                <li>Housing discrimination based on protected characteristics</li>
                <li>Violations of data protection laws (UK GDPR, DPA 2018)</li>
                <li>Breach of tenancy regulations or housing standards</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">3.2 Harassment and Abuse</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Harassment, bullying, or intimidation of tenants or third parties</li>
                <li>Discrimination based on race, religion, gender, sexual orientation, disability, or other protected characteristics</li>
                <li>Abusive, threatening, or offensive communications</li>
                <li>Stalking or unwanted contact</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">3.3 Spam and Unsolicited Communications</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Sending spam, bulk unsolicited messages, or chain letters</li>
                <li>Marketing to individuals who have not opted in</li>
                <li>Sending messages unrelated to legitimate tenancy matters</li>
                <li>Violating electronic communications regulations (PECR)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">3.4 Technical Abuse</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Data scraping, web scraping, or automated data extraction</li>
                <li>Reverse engineering, decompiling, or disassembling the Service</li>
                <li>Attempting to gain unauthorized access to systems or accounts</li>
                <li>Circumventing security measures or access controls</li>
                <li>Introducing viruses, malware, or harmful code</li>
                <li>Denial-of-service attacks or network disruption</li>
                <li>Using bots, scripts, or automated tools without authorization</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">3.5 Misrepresentation and Fraud</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Impersonating another person, entity, or TermFlow employee</li>
                <li>Providing false or misleading property information</li>
                <li>Creating fake listings or fraudulent tenancy agreements</li>
                <li>Misrepresenting your identity or credentials</li>
                <li>Engaging in deceptive practices</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">3.6 Data Misuse</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Collecting or storing personal data without proper consent</li>
                <li>Sharing tenant data with unauthorized third parties</li>
                <li>Using tenant data for purposes beyond tenancy management</li>
                <li>Failing to implement adequate data security measures</li>
                <li>Retaining data longer than legally permitted</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">3.7 Intellectual Property Violations</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Uploading copyrighted content without permission</li>
                <li>Infringing trademarks, patents, or other IP rights</li>
                <li>Using TermFlow's branding or logos without authorization</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">3.8 Resource Abuse</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Excessive use that degrades service performance for other users</li>
                <li>Using the Service beyond your subscription tier limits</li>
                <li>Creating multiple accounts to circumvent usage limits</li>
              </ul>
            </section>

            {/* Consequences */}
            <section data-testid="section-consequences">
              <h2 className="text-2xl font-bold mb-4">4. Consequences of Violation</h2>
              
              <h3 className="text-xl font-semibold mb-3">4.1 Enforcement Actions</h3>
              <p className="text-muted-foreground mb-3">
                Violation of this AUP may result in one or more of the following actions:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Warning:</strong> Written notice of policy violation with opportunity to rectify</li>
                <li><strong>Temporary Suspension:</strong> Account access suspended pending investigation</li>
                <li><strong>Permanent Termination:</strong> Immediate account closure without refund</li>
                <li><strong>Legal Action:</strong> Civil or criminal proceedings where appropriate</li>
                <li><strong>Law Enforcement:</strong> Reporting to relevant authorities</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">4.2 Repeat Violations</h3>
              <p className="text-muted-foreground">
                Repeat violations will result in progressively severe enforcement actions, up to and including permanent account termination and legal proceedings.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">4.3 No Refunds</h3>
              <p className="text-muted-foreground">
                Accounts suspended or terminated for AUP violations are not eligible for refunds of subscription fees.
              </p>
            </section>

            {/* Reporting Violations */}
            <section data-testid="section-reporting">
              <h2 className="text-2xl font-bold mb-4">5. Reporting Violations</h2>
              
              <h3 className="text-xl font-semibold mb-3">5.1 How to Report</h3>
              <p className="text-muted-foreground mb-3">
                If you become aware of any violation of this AUP, please report it immediately:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li><strong>Abuse Team:</strong> <a href="mailto:abuse@termflow.ai" className="text-primary hover:underline">abuse@termflow.ai</a></li>
                <li><strong>Security Issues:</strong> <a href="mailto:security@termflow.ai" className="text-primary hover:underline">security@termflow.ai</a></li>
                <li><strong>Data Protection:</strong> <a href="mailto:dpo@termflow.ai" className="text-primary hover:underline">dpo@termflow.ai</a></li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">5.2 Information to Include</h3>
              <p className="text-muted-foreground mb-3">When reporting a violation, please provide:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Your contact information</li>
                <li>Description of the violation</li>
                <li>Evidence (screenshots, message logs, etc.)</li>
                <li>Date and time of the incident</li>
                <li>Account or user involved (if known)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">5.3 Confidentiality</h3>
              <p className="text-muted-foreground">
                Reports will be handled confidentially, and we will not disclose the identity of reporters unless required by law.
              </p>
            </section>

            {/* Monitoring */}
            <section data-testid="section-monitoring">
              <h2 className="text-2xl font-bold mb-4">6. Monitoring and Investigation</h2>
              <p className="text-muted-foreground">
                TermFlow reserves the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Monitor use of the Service for compliance with this AUP</li>
                <li>Investigate suspected violations</li>
                <li>Access and disclose account information when necessary to comply with legal obligations or protect our rights</li>
                <li>Remove or disable access to content that violates this policy</li>
                <li>Cooperate with law enforcement investigations</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                However, we do not actively monitor all user communications and are not responsible for content created by users.
              </p>
            </section>

            {/* User Responsibility */}
            <section data-testid="section-responsibility">
              <h2 className="text-2xl font-bold mb-4">7. Your Responsibility</h2>
              <p className="text-muted-foreground mb-3">As a user of TermFlow, you are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Ensuring all use of the Service complies with this AUP and applicable laws</li>
                <li>Reviewing and approving all AI-generated content before sending to tenants</li>
                <li>Obtaining proper consent for data collection and processing</li>
                <li>Implementing appropriate security measures for your account</li>
                <li>Training your staff on acceptable use requirements</li>
                <li>Reporting any suspected violations immediately</li>
              </ul>
            </section>

            {/* Changes to Policy */}
            <section data-testid="section-changes">
              <h2 className="text-2xl font-bold mb-4">8. Modifications to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this AUP from time to time to reflect changes in legal requirements, technology, or our services. We will notify you of material changes via email or platform notification at least 14 days in advance.
              </p>
              <p className="text-muted-foreground mt-3">
                Continued use of the Service after changes become effective constitutes acceptance of the updated AUP.
              </p>
            </section>

            {/* Contact */}
            <section data-testid="section-contact">
              <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about this Acceptable Use Policy:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground mt-3">
                <li><strong>General Enquiries:</strong> <a href="mailto:support@termflow.ai" className="text-primary hover:underline">support@termflow.ai</a></li>
                <li><strong>Abuse Reports:</strong> <a href="mailto:abuse@termflow.ai" className="text-primary hover:underline">abuse@termflow.ai</a></li>
                <li><strong>Legal Team:</strong> <a href="mailto:legal@termflow.ai" className="text-primary hover:underline">legal@termflow.ai</a></li>
                <li><strong>Address:</strong> London, United Kingdom</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                For related policies, see our <a href="/legal/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</a>.
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
