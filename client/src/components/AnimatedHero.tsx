import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MessageSquare, Calendar, Video, FileCheck, CreditCard, Send, FileSignature, CheckCircle, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { TrustBadges } from '@/components/TrustBadges';

interface AnimatedHeroProps {
  title?: string;
  tagline?: string;
  subtitle?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  primaryAction?: string;
  secondaryAction?: string;
}

// Complete 8-stage tenant journey - TermFlow's USP!
const ANIMATION_STAGES = [
  {
    id: 'enquiry',
    duration: 2500,
    icon: MessageSquare,
    title: 'New Enquiry',
    description: 'AI captures leads from all portals & WhatsApp instantly',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'viewing-booked',
    duration: 2500,
    icon: Calendar,
    title: 'Viewing Booked',
    description: 'AI schedules viewing to shared calendar automatically',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    id: 'viewed',
    duration: 2500,
    icon: Video,
    title: 'Viewed Property',
    description: 'Video tour or self-guided completed',
    color: 'from-teal-500 to-green-500',
  },
  {
    id: 'application',
    duration: 2500,
    icon: FileCheck,
    title: 'Application Submitted',
    description: 'Right-to-Rent validated, AI scores & approves',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'deposit',
    duration: 2500,
    icon: CreditCard,
    title: 'Deposit Paid',
    description: 'Instant Stripe payment with auto-protection',
    color: 'from-emerald-500 to-lime-500',
  },
  {
    id: 'contract-sent',
    duration: 2500,
    icon: Send,
    title: 'Contract Sent',
    description: 'Digital contract delivered instantly',
    color: 'from-lime-500 to-yellow-500',
  },
  {
    id: 'contract-signed',
    duration: 2500,
    icon: FileSignature,
    title: 'Contract Signed',
    description: 'E-signature completed in seconds',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'moved-in',
    duration: 2000,
    icon: CheckCircle,
    title: 'Moved In',
    description: 'Fully automated - zero human intervention',
    color: 'from-orange-500 to-green-600',
  },
];

export function AnimatedHero({
  title = "Student Lettings on",
  tagline = "",
  subtitle = "Autopilot",
  primaryCTA = "Get Started Free",
  secondaryCTA = "Watch Demo",
  primaryAction = "/api/login",
  secondaryAction = "#how-it-works"
}: AnimatedHeroProps = {}) {
  const shouldReduceMotion = useReducedMotion();
  const [currentStage, setCurrentStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // Start paused for LCP optimization
  const [isMobile, setIsMobile] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false); // Gate animations post-LCP

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Defer animations until after LCP for optimal mobile performance
  useEffect(() => {
    if (shouldReduceMotion) {
      setCanAnimate(false);
      return;
    }

    const startAnimations = () => {
      setCanAnimate(true);
      setIsAnimating(true);
    };

    // Use requestIdleCallback if available, otherwise setTimeout fallback
    // This ensures animations only start after browser is idle
    let handle: number;
    
    if ('requestIdleCallback' in window) {
      handle = (window as any).requestIdleCallback(startAnimations, { timeout: 1500 });
    } else {
      handle = setTimeout(startAnimations, 1500) as unknown as number;
    }

    return () => {
      if ('requestIdleCallback' in window) {
        (window as any).cancelIdleCallback(handle);
      } else {
        clearTimeout(handle);
      }
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!isAnimating || shouldReduceMotion || !canAnimate) return;

    const stage = ANIMATION_STAGES[currentStage];
    const duration = isMobile ? stage.duration * 0.75 : stage.duration;
    
    const timer = setTimeout(() => {
      if (currentStage < ANIMATION_STAGES.length - 1) {
        setCurrentStage(currentStage + 1);
      } else {
        setCurrentStage(0);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [currentStage, isAnimating, isMobile, canAnimate]);

  const stage = ANIMATION_STAGES[currentStage];
  const Icon = stage.icon;

  return (
    <section className="relative min-h-[700px] md:min-h-[800px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background to-muted py-20 md:py-24">
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${stage.color} opacity-10`}
        animate={shouldReduceMotion || !canAnimate ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: stage.duration / 1000,
          ease: "easeInOut",
        }}
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 text-foreground"
            initial={{ opacity: 1, y: 0 }}
            data-testid="text-hero-animated-title"
          >
            {title}
          </motion.h1>
          
          {tagline && (
            <motion.p
              className="text-lg md:text-xl font-semibold text-primary mb-4"
              initial={{ opacity: 1, y: 0 }}
              data-testid="text-hero-tagline"
            >
              {tagline}
            </motion.p>
          )}
          
          {subtitle && (
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 1, y: 0 }}
              data-testid="text-hero-subtitle"
            >
              {subtitle.split('**').map((part, index) => 
                index % 2 === 1 ? <strong key={index} className="text-foreground font-bold">{part}</strong> : part
              )}
            </motion.p>
          )}

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
          >
            <TrustBadges variant="hero" className="mb-8" />
          </motion.div>

          <div className="mt-12 mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.id}
                className="flex flex-col items-center"
                initial={shouldReduceMotion || !canAnimate ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={shouldReduceMotion || !canAnimate ? {} : { opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: shouldReduceMotion || !canAnimate ? 0 : 0.4 }}
              >
                <motion.div
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center mb-6`}
                  animate={shouldReduceMotion || !canAnimate ? {} : (!isMobile ? {
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  } : {
                    scale: [1, 1.05, 1],
                  })}
                  transition={shouldReduceMotion || !canAnimate ? {} : (!isMobile ? {
                    rotate: { duration: stage.duration / 1000, ease: "linear" },
                    scale: { duration: 0.6, repeat: Infinity, repeatType: "reverse" },
                  } : {
                    scale: { duration: 0.8, repeat: Infinity, repeatType: "reverse" },
                  })}
                  data-testid={`hero-icon-${stage.id}`}
                >
                  <Icon className="w-12 h-12 text-white" />
                </motion.div>

                <motion.h3
                  className="text-3xl font-bold mb-3"
                  initial={{ opacity: 1 }}
                  data-testid={`hero-title-${stage.id}`}
                >
                  {stage.title}
                </motion.h3>

                <motion.p
                  className="text-lg text-muted-foreground max-w-md"
                  initial={{ opacity: 1 }}
                  data-testid={`hero-description-${stage.id}`}
                >
                  {stage.description}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-1.5 mb-8 flex-wrap max-w-md mx-auto">
            {ANIMATION_STAGES.map((s, index) => (
              <motion.div
                key={s.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStage
                    ? `w-10 bg-gradient-to-r ${s.color}`
                    : index < currentStage
                    ? 'w-6 bg-primary/50'
                    : 'w-6 bg-border'
                }`}
                data-testid={`hero-progress-${s.id}`}
              />
            ))}
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 1, y: 0 }}
          >
            <Button size="lg" asChild data-testid="button-get-started">
              <a href={primaryAction}>
                {primaryCTA}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-watch-demo">
              <a href={secondaryAction}>
                {secondaryCTA}
              </a>
            </Button>
          </motion.div>

          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-animation-toggle"
          >
            {isAnimating ? 'Pause' : 'Play'} Animation
          </button>
        </div>
      </div>
    </section>
  );
}
