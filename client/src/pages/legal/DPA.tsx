import { SEOHead } from "@/components/SEOHead";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function DPA() {
  return (
    <div className="min-h-screen bg-tf-bg flex flex-col">
      <SEOHead
        title="Data Processing Agreement - TermFlow"
        description="TermFlow's GDPR-compliant Data Processing Agreement (DPA). Learn about our data processing practices, obligations, and sub-processors."
        keywords="data processing agreement, DPA, GDPR, data processor, sub-processors"
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
          <h1 className="text-4xl font-bold mb-4" data-testid="text-dpa-heading">Data Processing Agreement</h1>
          <p className="text-sm text-muted-foreground mb-8" data-testid="text-last-updated">
            Last updated: October 14, 2025
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            {/* Introduction */}
            <section data-testid="section-introduction">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                This Data Processing Agreement ("DPA") forms part of the Terms of Service between you (the "Controller") and TermFlow (the "Processor") and governs the processing of personal data in accordance with UK GDPR and the Data Protection Act 2018.
              </p>
              <p className="text-muted-foreground mt-3">
                This DPA applies when TermFlow processes personal data on behalf of the Controller in connection with the provision of our AI-powered lettings automation services.
              </p>
            </section>

            {/* Definitions */}
            <section data-testid="section-definitions">
              <h2 className="text-2xl font-bold mb-4">2. Definitions</h2>
              <p className="text-muted-foreground mb-3">For the purposes of this DPA:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>"Controller":</strong> The entity that determines the purposes and means of processing personal data (you, the landlord or property manager)</li>
                <li><strong>"Processor":</strong> TermFlow, which processes personal data on behalf of the Controller</li>
                <li><strong>"Data Subject":</strong> The individual to whom personal data relates (e.g., student tenants, property viewers)</li>
                <li><strong>"Personal Data":</strong> Any information relating to an identified or identifiable natural person</li>
                <li><strong>"Processing":</strong> Any operation performed on personal data, including collection, storage, use, and deletion</li>
                <li><strong>"Sub-processor":</strong> A third-party processor engaged by TermFlow to process personal data</li>
                <li><strong>"UK GDPR":</strong> The UK General Data Protection Regulation and Data Protection Act 2018</li>
              </ul>
            </section>

            {/* Subject Matter and Duration */}
            <section data-testid="section-subject-matter">
              <h2 className="text-2xl font-bold mb-4">3. Subject Matter and Duration</h2>
              
              <h3 className="text-xl font-semibold mb-3">3.1 Subject Matter</h3>
              <p className="text-muted-foreground">
                This DPA applies to the processing of personal data necessary for TermFlow to provide its AI-powered lettings automation platform for student accommodation.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">3.2 Duration</h3>
              <p className="text-muted-foreground">
                This DPA remains in effect for the duration of the service agreement between the parties, and continues for as long as TermFlow processes personal data on behalf of the Controller.
              </p>
            </section>

            {/* Nature and Purpose */}
            <section data-testid="section-nature-purpose">
              <h2 className="text-2xl font-bold mb-4">4. Nature and Purpose of Processing</h2>
              
              <h3 className="text-xl font-semibold mb-3">4.1 Nature of Processing</h3>
              <p className="text-muted-foreground mb-3">TermFlow processes personal data through:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Collection via web forms, WhatsApp, email, and SMS</li>
                <li>Storage in secure UK/EU-based databases</li>
                <li>Automated processing using AI algorithms</li>
                <li>Communication automation (messaging, emails)</li>
                <li>Analytics and reporting</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">4.2 Purpose of Processing</h3>
              <p className="text-muted-foreground mb-3">Personal data is processed to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Manage student accommodation enquiries and applications</li>
                <li>Automate viewing bookings and calendar management</li>
                <li>Generate and process tenancy contracts</li>
                <li>Facilitate deposit collection and payment processing</li>
                <li>Enable automated communications with prospective tenants</li>
                <li>Provide analytics and reporting to the Controller</li>
              </ul>
            </section>

            {/* Personal Data Categories */}
            <section data-testid="section-data-categories">
              <h2 className="text-2xl font-bold mb-4">5. Types of Personal Data</h2>
              <p className="text-muted-foreground mb-3">TermFlow may process the following categories of personal data:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Identity Data:</strong> Name, date of birth, student ID</li>
                <li><strong>Contact Data:</strong> Email address, phone number, WhatsApp details</li>
                <li><strong>Financial Data:</strong> Payment information (processed via Stripe)</li>
                <li><strong>Academic Data:</strong> University, course, year of study</li>
                <li><strong>Preference Data:</strong> Room preferences, move-in dates, requirements</li>
                <li><strong>Communication Data:</strong> Message history, email correspondence</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
              </ul>
            </section>

            {/* Data Subjects */}
            <section data-testid="section-data-subjects">
              <h2 className="text-2xl font-bold mb-4">6. Categories of Data Subjects</h2>
              <p className="text-muted-foreground mb-3">Personal data may relate to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Prospective student tenants making enquiries</li>
                <li>Applicants who have submitted rental applications</li>
                <li>Current tenants under active tenancy agreements</li>
                <li>Guarantors or parents of student tenants</li>
                <li>Visitors who have booked property viewings</li>
              </ul>
            </section>

            {/* Processor Obligations */}
            <section data-testid="section-obligations">
              <h2 className="text-2xl font-bold mb-4">7. Processor Obligations</h2>
              <p className="text-muted-foreground mb-3">TermFlow shall:</p>

              <h3 className="text-xl font-semibold mb-3 mt-4">7.1 Processing Instructions</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Process personal data only on documented instructions from the Controller</li>
                <li>Immediately inform the Controller if instructions violate UK GDPR</li>
                <li>Not process personal data for any other purpose without prior written consent</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">7.2 Security Measures</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Implement appropriate technical and organizational security measures</li>
                <li>Use 256-bit SSL/TLS encryption for data transmission</li>
                <li>Encrypt personal data at rest using industry-standard encryption</li>
                <li>Maintain access controls and authentication mechanisms</li>
                <li>Conduct regular security audits and penetration testing</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">7.3 Confidentiality</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Ensure all personnel authorized to process personal data are bound by confidentiality obligations</li>
                <li>Provide adequate training to personnel on data protection requirements</li>
                <li>Limit access to personal data on a need-to-know basis</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">7.4 Data Breach Notification</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Notify the Controller without undue delay (within 24 hours) upon becoming aware of a personal data breach</li>
                <li>Provide sufficient information to enable the Controller to meet breach notification obligations</li>
                <li>Cooperate with the Controller in investigating and mitigating the breach</li>
              </ul>
            </section>

            {/* Sub-processors */}
            <section data-testid="section-subprocessors">
              <h2 className="text-2xl font-bold mb-4">8. Sub-processors</h2>
              
              <h3 className="text-xl font-semibold mb-3">8.1 Authorized Sub-processors</h3>
              <p className="text-muted-foreground mb-3">
                The Controller provides general authorization for TermFlow to engage the following sub-processors:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Stripe:</strong> Payment processing (USA/EU, Standard Contractual Clauses)</li>
                <li><strong>Twilio:</strong> SMS and WhatsApp communications (USA/EU, Standard Contractual Clauses)</li>
                <li><strong>OpenAI:</strong> AI processing and natural language understanding (USA, Standard Contractual Clauses)</li>
                <li><strong>Google Cloud:</strong> Calendar integration and cloud services (EU/UK)</li>
                <li><strong>Neon/AWS:</strong> Database hosting (EU/UK data residency)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">8.2 Sub-processor Requirements</h3>
              <p className="text-muted-foreground">
                TermFlow ensures that sub-processors are bound by data protection obligations equivalent to those in this DPA, including appropriate security measures and confidentiality commitments.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">8.3 Changes to Sub-processors</h3>
              <p className="text-muted-foreground">
                TermFlow will inform the Controller of any intended changes to sub-processors at least 30 days in advance. The Controller may object to the appointment of a new sub-processor on reasonable grounds.
              </p>
            </section>

            {/* Data Subject Rights */}
            <section data-testid="section-data-rights">
              <h2 className="text-2xl font-bold mb-4">9. Data Subject Rights</h2>
              <p className="text-muted-foreground mb-3">
                TermFlow shall assist the Controller in responding to data subject requests to exercise their rights under UK GDPR:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Right of Access:</strong> Provide copies of personal data upon request</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Delete personal data when no longer necessary</li>
                <li><strong>Right to Restriction:</strong> Limit processing in certain circumstances</li>
                <li><strong>Right to Data Portability:</strong> Provide data in a structured, machine-readable format</li>
                <li><strong>Right to Object:</strong> Stop processing for specific purposes</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                TermFlow will respond to Controller requests for assistance within 5 business days.
              </p>
            </section>

            {/* Data Return and Deletion */}
            <section data-testid="section-termination">
              <h2 className="text-2xl font-bold mb-4">10. Termination and Data Return</h2>
              
              <h3 className="text-xl font-semibold mb-3">10.1 Upon Termination</h3>
              <p className="text-muted-foreground mb-3">
                Upon termination of the service agreement or at the Controller's request, TermFlow shall:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Return all personal data to the Controller in a structured, machine-readable format</li>
                <li>Securely delete all copies of personal data unless legal retention is required</li>
                <li>Provide written certification of deletion upon request</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">10.2 Legal Retention</h3>
              <p className="text-muted-foreground">
                TermFlow may retain personal data to the extent required by UK law (e.g., financial records for tax purposes) but will continue to protect such data in accordance with this DPA.
              </p>
            </section>

            {/* Audits */}
            <section data-testid="section-audits">
              <h2 className="text-2xl font-bold mb-4">11. Audits and Compliance</h2>
              <p className="text-muted-foreground">
                TermFlow shall make available to the Controller all information necessary to demonstrate compliance with this DPA and UK GDPR. The Controller may conduct audits or appoint an independent auditor with reasonable notice and during normal business hours.
              </p>
            </section>

            {/* Contact */}
            <section data-testid="section-contact">
              <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
              <p className="text-muted-foreground">
                For DPA-related questions or to exercise data protection rights:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground mt-3">
                <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@termflow.ai" className="text-primary hover:underline">dpo@termflow.ai</a></li>
                <li><strong>Legal Team:</strong> <a href="mailto:legal@termflow.ai" className="text-primary hover:underline">legal@termflow.ai</a></li>
                <li><strong>Privacy Team:</strong> <a href="mailto:privacy@termflow.ai" className="text-primary hover:underline">privacy@termflow.ai</a></li>
                <li><strong>Address:</strong> London, United Kingdom</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                For more information, see our <a href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</a> and <a href="/legal/terms" className="text-primary hover:underline">Terms of Service</a>.
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
