import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load widget after page is idle using requestIdleCallback
    // Fallback to setTimeout after 2.5s
    let timeoutId: number | null = null;
    let idleId: number | null = null;
    let loaded = false;

    const loadWidget = () => {
      if (loaded) return;
      loaded = true;
      setIsLoaded(true);
      // Clear other timer once loaded
      if (timeoutId) clearTimeout(timeoutId);
      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };

    const scheduleLoad = () => {
      // Use requestIdleCallback for best performance
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(loadWidget);
      }
      
      // Always set timeout as fallback (2.5s max wait)
      timeoutId = window.setTimeout(loadWidget, 2500);
    };

    if (document.readyState === 'complete') {
      // Page already loaded - schedule widget load
      scheduleLoad();
    } else {
      // Wait for page load, then schedule widget load
      window.addEventListener('load', scheduleLoad);
    }

    // Cleanup on unmount - ALWAYS runs regardless of path taken
    return () => {
      window.removeEventListener('load', scheduleLoad);
      if (timeoutId) clearTimeout(timeoutId);
      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  // Don't render anything until page is loaded + 1.5s
  if (!isLoaded) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-tf-lime text-tf-navy hover:bg-tf-lime/90"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-chat-widget"
          aria-label="Open chat widget"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Chat Widget Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            data-testid="chat-widget-card"
          >
            <Card className="shadow-xl">
              <CardHeader className="gap-2">
                <CardTitle className="text-lg">Chat with our team</CardTitle>
                <CardDescription>
                  Experience our AI assistant or book a personalized demo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  asChild 
                  className="w-full bg-tf-lime text-tf-navy hover:bg-tf-lime/90"
                  data-testid="button-try-ai-demo"
                >
                  <a href="/demo">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Try AI Demo
                  </a>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full"
                  data-testid="button-book-demo-widget"
                >
                  <a href="/book-demo">Book a Live Demo</a>
                </Button>
                <Button 
                  asChild 
                  variant="ghost" 
                  className="w-full"
                  data-testid="button-contact-us-widget"
                >
                  <a href="/contact">Contact Us</a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
