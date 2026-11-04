import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "wouter";

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const STORAGE_KEY = "termflow-mobile-cta-dismissed";

  useEffect(() => {
    // Check if user has dismissed the CTA before
    const isDismissed = localStorage.getItem(STORAGE_KEY);
    
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg border-t-2 border-primary-foreground/20"
      data-testid="mobile-sticky-cta"
    >
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold">Get Your Free Demo</p>
          <p className="text-xs opacity-90">See TermFlow in action</p>
        </div>
        <Button 
          size="sm" 
          variant="secondary"
          asChild
          className="flex-shrink-0 font-bold shadow-md min-w-[88px] min-h-[44px]"
          data-testid="button-mobile-cta"
          aria-label="Book a demo"
        >
          <Link href="/book-demo">Book Now</Link>
        </Button>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-2 hover:bg-white/20 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Dismiss mobile call-to-action banner"
          data-testid="button-dismiss-mobile-cta"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
