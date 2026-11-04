import { useState } from "react";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SecurityBadges } from "@/components/SecurityBadges";
import { Mail, MapPin, Linkedin, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      toast({
        title: "Success!",
        description: "You're now subscribed to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-tf-navy text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Column 1: Company */}
          <div className="lg:col-span-1" data-testid="footer-company">
            <div className="mb-4">
              <TermFlowWordmark className="[&>div]:text-white" />
            </div>
            <p className="text-sm text-gray-300 mb-4">
              AI-Powered Lettings Automation for PBSA
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Automate your student accommodation lettings from enquiry to contract.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://linkedin.com/company/termflow" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-tf-lime transition-colors"
                data-testid="link-linkedin"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/termflow" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-tf-lime transition-colors"
                data-testid="link-twitter"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div data-testid="footer-product">
            <h3 className="font-semibold text-base mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/how-it-works" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-how-it-works">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-pricing">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/demo" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-demo">
                  Live Demo
                </a>
              </li>
              <li>
                <a href="/book-demo" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-book-demo">
                  Book a Demo
                </a>
              </li>
              <li>
                <a href="/integrations" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-integrations">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div data-testid="footer-resources">
            <h3 className="font-semibold text-base mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/founder-story" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-founder-story">
                  Our Story
                </a>
              </li>
              <li>
                <a href="/resources/pbsa-automation-guide-2025" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-pbsa-guide">
                  PBSA Automation Guide 2025
                </a>
              </li>
              <li>
                <a href="/resources/glossary" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-glossary">
                  Glossary
                </a>
              </li>
              <li>
                <a href="/roi-calculator" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-roi-calculator">
                  ROI Calculator
                </a>
              </li>
              <li>
                <a href="/knowledge-base" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-knowledge-base">
                  Knowledge Base
                </a>
              </li>
              <li>
                <a href="/case-studies" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-case-studies">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-support">
                  Support Center
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Compliance */}
          <div data-testid="footer-legal">
            <h3 className="font-semibold text-base mb-4">Legal & Compliance</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/legal/privacy" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/legal/terms" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-terms">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/legal/gdpr" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-gdpr">
                  GDPR Information
                </a>
              </li>
              <li>
                <a href="/legal/cookies" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-cookies">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="/legal/dpa" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-dpa">
                  Data Processing Agreement
                </a>
              </li>
              <li>
                <a href="/legal/aup" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-aup">
                  Acceptable Use Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div data-testid="footer-contact">
            <h3 className="font-semibold text-base mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-gray-400" />
                <a href="mailto:sales@termflow.ai" className="text-gray-300 hover:text-tf-lime transition-colors" data-testid="link-footer-email">
                  sales@termflow.ai
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                <span className="text-gray-300" data-testid="text-footer-address">
                  London, United Kingdom
                </span>
              </li>
            </ul>
            <Button 
              asChild 
              className="mt-4 w-full bg-tf-lime text-tf-navy hover:bg-tf-lime/90"
              data-testid="button-footer-book-demo"
            >
              <a href="/book-demo">Book a Demo</a>
            </Button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 p-8 bg-white/5 rounded-lg border border-white/10" data-testid="newsletter-section">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Built for UK PBSA Operators</h3>
            <p className="text-gray-300 mb-6">
              Get weekly automation tips, industry insights, and exclusive strategies to streamline your student lettings
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white text-gray-900 border-gray-300"
                data-testid="input-newsletter-email"
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90"
                data-testid="button-newsletter-subscribe"
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-gray-400 mt-3">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Legal Entity Details */}
        {/* TODO: Update with actual legal entity details before production launch */}
        <div className="text-center mb-6 space-y-1" data-testid="footer-legal-entity">
          <p className="text-sm text-gray-300">
            TermFlow Software Limited | Registered in England & Wales
          </p>
          <p className="text-xs text-gray-400">
            Company No.: <span className="text-amber-500">[To be added]</span> | 
            VAT: <span className="text-amber-500">[To be added]</span> | 
            Registered Address: <span className="text-amber-500">[To be added]</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            For full legal entity details, contact: legal@termflow.com
          </p>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-gray-400" data-testid="text-copyright">
            © 2025 TermFlow. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400" data-testid="text-data-residency">
              UK & EU Data Residency
            </span>
          </div>
          
          <div className="text-white">
            <SecurityBadges size="sm" showLabels={false} />
          </div>
        </div>
      </div>
    </footer>
  );
}
