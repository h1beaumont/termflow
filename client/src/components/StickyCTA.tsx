import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StickyCTAProps {
  text?: string;
  ctaText?: string;
  ctaLink?: string;
  showAfterScroll?: number; // Show CTA after scrolling X pixels
  dismissible?: boolean;
}

export function StickyCTA({
  text = "Ready to automate your lettings?",
  ctaText = "Start Free Trial",
  ctaLink = "/api/login",
  showAfterScroll = 800,
  dismissible = true
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const ticking = useRef(false);

  // Check session storage once on mount
  useEffect(() => {
    const dismissed = sessionStorage.getItem('sticky-cta-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  // Set up scroll handler (respects isDismissed state)
  useEffect(() => {
    // Don't set up scroll handler if already dismissed
    if (isDismissed) {
      return;
    }

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          
          // Show CTA after user scrolls past threshold
          if (scrolled > showAfterScroll) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    sessionStorage.setItem('sticky-cta-dismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-tf-navy border-t border-tf-lime/20 shadow-2xl"
          data-testid="sticky-cta-bar"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Text */}
              <div className="flex-1 min-w-[200px]">
                <p className="text-white font-semibold text-lg" data-testid="text-sticky-cta">
                  {text}
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex items-center gap-3">
                <Button 
                  size="lg" 
                  asChild 
                  className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90 font-bold shadow-lg"
                  data-testid="button-sticky-cta"
                >
                  <a href={ctaLink}>
                    {ctaText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>

                {/* Dismiss Button */}
                {dismissible && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDismiss}
                    className="text-white hover:bg-white/10"
                    aria-label="Dismiss banner"
                    data-testid="button-dismiss-sticky-cta"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
