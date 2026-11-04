import { SEOHead } from "@/components/SEOHead";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-tf-bg flex flex-col">
      <SEOHead
        title="Cookie Policy - TermFlow"
        description="TermFlow's cookie policy. Learn about the cookies we use, why we use them, and how you can manage your cookie preferences."
        keywords="cookie policy, cookies, tracking, privacy preferences"
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
          <h1 className="text-4xl font-bold mb-4" data-testid="text-cookies-heading">Cookie Policy</h1>
          <p className="text-sm text-muted-foreground mb-8" data-testid="text-last-updated">
            Last updated: October 14, 2025
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            {/* Introduction */}
            <section data-testid="section-introduction">
              <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.
              </p>
              <p className="text-muted-foreground mt-3">
                This Cookie Policy explains what cookies are, how we use them, and how you can control them.
              </p>
            </section>

            {/* Why We Use Cookies */}
            <section data-testid="section-purpose">
              <h2 className="text-2xl font-bold mb-4">2. Why We Use Cookies</h2>
              <p className="text-muted-foreground mb-3">We use cookies to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Keep you signed in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Ensure the security of our platform</li>
                <li>Understand how you use our service to improve it</li>
                <li>Provide essential functionality like payment processing</li>
                <li>Analyze traffic and usage patterns</li>
              </ul>
            </section>

            {/* Essential Cookies */}
            <section data-testid="section-essential">
              <h2 className="text-2xl font-bold mb-4">3. Essential Cookies</h2>
              <p className="text-muted-foreground">
                These cookies are strictly necessary for our website to function. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-4">3.1 Authentication Cookies</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Session ID:</strong> Keeps you logged in while browsing</li>
                <li><strong>Authentication Token:</strong> Verifies your identity</li>
                <li><strong>Security Token:</strong> Protects against cross-site request forgery (CSRF)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">3.2 Functional Cookies</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>User Preferences:</strong> Remembers your settings and preferences</li>
                <li><strong>Language Selection:</strong> Stores your language preference</li>
                <li><strong>Load Balancing:</strong> Distributes traffic across our servers</li>
              </ul>
            </section>

            {/* Analytics Cookies */}
            <section data-testid="section-analytics">
              <h2 className="text-2xl font-bold mb-4">4. Analytics Cookies</h2>
              <p className="text-muted-foreground">
                We use analytics cookies to understand how visitors interact with our website. This helps us improve our service and user experience.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-4">4.1 First-Party Analytics</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Page Views:</strong> Tracks which pages you visit</li>
                <li><strong>Session Duration:</strong> Measures how long you spend on our site</li>
                <li><strong>Feature Usage:</strong> Records which features you use</li>
                <li><strong>Error Tracking:</strong> Helps us identify and fix technical issues</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">4.2 Third-Party Analytics</h3>
              <p className="text-muted-foreground">
                We may use third-party analytics services like Google Analytics. These services use cookies to collect anonymous usage data. You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
              </p>
            </section>

            {/* Third-Party Cookies */}
            <section data-testid="section-third-party">
              <h2 className="text-2xl font-bold mb-4">5. Third-Party Cookies</h2>
              <p className="text-muted-foreground mb-3">
                We work with trusted third-party service providers who may set cookies on your device:
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">5.1 Payment Processing (Stripe)</h3>
              <p className="text-muted-foreground">
                Stripe uses cookies to process payments securely and prevent fraud. See <a href="https://stripe.com/cookies-policy/legal" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Stripe's Cookie Policy</a>.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">5.2 Communications (Twilio)</h3>
              <p className="text-muted-foreground">
                Twilio may use cookies for SMS and WhatsApp communications. See <a href="https://www.twilio.com/legal/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Twilio's Privacy Policy</a>.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">5.3 Calendar Integration (Google)</h3>
              <p className="text-muted-foreground">
                Google Calendar integration may set cookies. See <a href="https://policies.google.com/technologies/cookies" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google's Cookie Policy</a>.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">5.4 AI Processing (OpenAI)</h3>
              <p className="text-muted-foreground">
                Our AI features are powered by OpenAI. See <a href="https://openai.com/policies/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">OpenAI's Privacy Policy</a>.
              </p>
            </section>

            {/* Managing Cookies */}
            <section data-testid="section-managing">
              <h2 className="text-2xl font-bold mb-4">6. How to Manage Cookies</h2>
              
              <h3 className="text-xl font-semibold mb-3">6.1 Browser Settings</h3>
              <p className="text-muted-foreground mb-3">
                Most browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>View and delete cookies</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies (note: this may break our service)</li>
                <li>Clear cookies when you close your browser</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">6.2 Browser-Specific Instructions</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">6.3 Important Note</h3>
              <p className="text-muted-foreground">
                Blocking or deleting cookies may prevent you from using certain features of our service, particularly those requiring authentication or personalization.
              </p>
            </section>

            {/* Cookie Duration */}
            <section data-testid="section-duration">
              <h2 className="text-2xl font-bold mb-4">7. How Long Cookies Last</h2>
              
              <h3 className="text-xl font-semibold mb-3">7.1 Session Cookies</h3>
              <p className="text-muted-foreground">
                These temporary cookies are deleted when you close your browser. We use them for authentication and security.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-4">7.2 Persistent Cookies</h3>
              <p className="text-muted-foreground">
                These cookies remain on your device for a set period (typically 30 days to 12 months) or until you delete them. We use them to remember your preferences and improve your experience.
              </p>
            </section>

            {/* Updates */}
            <section data-testid="section-updates">
              <h2 className="text-2xl font-bold mb-4">8. Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            {/* Contact */}
            <section data-testid="section-contact">
              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about our use of cookies:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground mt-3">
                <li><strong>Email:</strong> <a href="mailto:privacy@termflow.ai" className="text-primary hover:underline">privacy@termflow.ai</a></li>
                <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@termflow.ai" className="text-primary hover:underline">dpo@termflow.ai</a></li>
                <li><strong>Address:</strong> London, United Kingdom</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                For more information about how we handle your data, please see our <a href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</a>.
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
