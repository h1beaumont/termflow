import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const CONSENT_KEY = "termflow-cookie-consent";

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Show banner after 2 seconds delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setIsVisible(false);
    
    // Initialize analytics if accepted
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setIsVisible(false);
    
    // Deny analytics if declined
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-500">
      <Card className="shadow-2xl border-2">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-tf-navy to-tf-navy-700 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1 text-sm">We Value Your Privacy</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We use cookies to improve your experience, analyse site traffic, and personalise content. 
                Your data stays in the UK and complies with GDPR.{" "}
                <a href="/privacy-policy" className="text-tf-navy hover:underline font-medium">
                  Learn more about our cookie policy
                </a>
              </p>
            </div>
            <button
              onClick={handleDecline}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Decline cookies"
              data-testid="button-cookie-decline-icon"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDecline}
              className="flex-1"
              data-testid="button-cookie-decline"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1"
              data-testid="button-cookie-accept"
            >
              Accept All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
