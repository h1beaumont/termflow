import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, X, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Section {
  id: string;
  label: string;
  ref: React.RefObject<HTMLElement>;
}

interface InPageNavProps {
  sections: Section[];
}

export function InPageNav({ sections }: InPageNavProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const resizeTicking = useRef(false);
  const scrollTicking = useRef(false);
  const sectionPositions = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    // Cache section positions
    const cachePositions = () => {
      const positions = new Map<string, number>();
      sections.forEach(section => {
        if (section.ref.current) {
          positions.set(section.id, section.ref.current.offsetTop);
        }
      });
      sectionPositions.current = positions;
    };

    cachePositions();
    
    // Observe all sections for layout changes using ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      // Throttle position recalculation
      if (!resizeTicking.current) {
        window.requestAnimationFrame(() => {
          cachePositions();
          resizeTicking.current = false;
        });
        resizeTicking.current = true;
      }
    });

    // Observe each section element
    sections.forEach(section => {
      if (section.ref.current) {
        resizeObserver.observe(section.ref.current);
      }
    });
    
    // Also recalculate on window resize
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(cachePositions, 150);
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [sections]);

  useEffect(() => {
    let scrollTicking = false;
    
    const handleScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 150;

          // Use cached positions instead of reading offsetTop on every scroll
          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const cachedTop = sectionPositions.current.get(section.id);
            
            if (cachedTop !== undefined && cachedTop <= scrollPosition) {
              setActiveSection(section.id);
              break;
            }
          }
          
          scrollTicking = false;
        });

        scrollTicking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section?.ref.current) {
      const top = section.ref.current.offsetTop - 100;
      window.scrollTo({ top, behavior: "smooth" });
      setIsOpen(false);
    }
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Floating Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Button
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="h-14 w-14 rounded-full shadow-lg"
            data-testid="button-mobile-nav-toggle"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
                onClick={() => setIsOpen(false)}
                data-testid="overlay-mobile-nav"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l z-40 p-6 overflow-y-auto"
                data-testid="menu-mobile-nav"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">Jump to Section</h3>
                  <p className="text-sm text-muted-foreground">Navigate the page</p>
                </div>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover-elevate"
                      }`}
                      data-testid={`nav-item-${section.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{section.label}</span>
                        {activeSection === section.id && (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
      data-testid="nav-desktop"
    >
      <Card className="shadow-lg border-2">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            On This Page
          </p>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all flex items-center gap-2 ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover-elevate text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`nav-item-${section.id}`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    activeSection === section.id
                      ? "bg-primary-foreground"
                      : "bg-border"
                  }`}
                />
                <span className="truncate">{section.label}</span>
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </motion.div>
  );
}
