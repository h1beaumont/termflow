import { useRef, lazy, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  FileSignature, 
  Building2, 
  Video, 
  Calendar, 
  FileCheck,
  MessageSquare,
  Zap,
  CheckCircle,
  BarChart3,
  Clock,
  Globe,
  Shield,
  Smartphone,
  X,
  Info,
  ExternalLink,
  ArrowDown,
  FileText,
  Award,
  Sparkles
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { SEOHead } from "@/components/SEOHead";
import { ServiceSchema } from "@/components/ServiceSchema";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { InPageNav } from "@/components/InPageNav";
import { BackToTop } from "@/components/BackToTop";
import { FAQ, FAQItem } from "@/components/FAQ";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { SiteSearch } from "@/components/SiteSearch";

// Lazy load heavy mockup components for better performance and code splitting
const DashboardMockup = lazy(() => import("@/components/FeatureShowcase/DashboardMockup").then(m => ({ default: m.DashboardMockup })));
const AnalyticsMockup = lazy(() => import("@/components/FeatureShowcase/AnalyticsMockup").then(m => ({ default: m.AnalyticsMockup })));
const StudentProfileMockup = lazy(() => import("@/components/FeatureShowcase/StudentProfileMockup").then(m => ({ default: m.StudentProfileMockup })));
const ContractWorkflowMockup = lazy(() => import("@/components/FeatureShowcase/ContractWorkflowMockup").then(m => ({ default: m.ContractWorkflowMockup })));
const FloorPlanMockup = lazy(() => import("@/components/FeatureShowcase/FloorPlanMockup").then(m => ({ default: m.FloorPlanMockup })));
const VirtualViewingMockup = lazy(() => import("@/components/FeatureShowcase/VirtualViewingMockup").then(m => ({ default: m.VirtualViewingMockup })));
const CalendarMockup = lazy(() => import("@/components/FeatureShowcase/CalendarMockup").then(m => ({ default: m.CalendarMockup })));
const AIChatMockup = lazy(() => import("@/components/FeatureShowcase/AIChatMockup").then(m => ({ default: m.AIChatMockup })));

// Loading skeleton for mockups to prevent layout shift
function MockupSkeleton() {
  return (
    <div className="space-y-4" data-testid="mockup-skeleton">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-64 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();
  
  // Section refs for navigation
  const overviewRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const workflowRef = useRef<HTMLElement>(null);
  const methodologyRef = useRef<HTMLElement>(null);
  const disclaimerRef = useRef<HTMLElement>(null);

  const sections = [
    { id: "overview", label: "Overview", ref: overviewRef },
    { id: "features", label: "Features", ref: featuresRef },
    { id: "workflow", label: "How It Works", ref: workflowRef },
    { id: "disclaimer", label: "What We Don't Provide", ref: disclaimerRef },
  ];

  const scrollToMethodology = () => {
    methodologyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Map mockup IDs to lazy components for better code splitting
  const mockupComponents: Record<string, React.ComponentType> = {
    'ai': AIChatMockup,
    'students': StudentProfileMockup,
    'virtual': VirtualViewingMockup,
    'calendar': CalendarMockup,
    'contracts': ContractWorkflowMockup,
    'floorplans': FloorPlanMockup,
    'dashboard': DashboardMockup,
    'analytics': AnalyticsMockup,
  };

  const featureCategories = [
    {
      id: "lead-management",
      title: "Lead Management & Communication",
      icon: MessageSquare,
      color: "from-pink-500 to-rose-500",
      features: [
        {
          id: "ai",
          title: "AI Assistant (Ava)",
          description: "24/7 multilingual WhatsApp automation",
          caption: "Ava handles student enquiries automatically, detects language, qualifies leads, and books viewings—all without human intervention.",
          mockupId: "ai",
          highlights: [
            "Automatic language detection (25+ languages)",
            "Contextual responses based on property data",
            "Lead qualification and scoring",
            "Viewing booking without human intervention",
            "Escalation to staff when needed"
          ]
        },
        {
          id: "students",
          title: "Student Profiles",
          description: "Complete tenant journey tracking",
          caption: "See every interaction, document, and payment in one place. Track each student from first message to move-in.",
          mockupId: "students",
          highlights: [
            "Full conversation history (WhatsApp, email, calls)",
            "Right-to-Rent document verification",
            "Application status and approval workflow",
            "Payment history and deposit tracking",
            "Automated communications timeline"
          ]
        }
      ]
    },
    {
      id: "viewing-tours",
      title: "Viewing & Tours",
      icon: Video,
      color: "from-teal-500 to-cyan-500",
      features: [
        {
          id: "virtual",
          title: "Virtual Viewings",
          description: "24/7 property tours",
          caption: "Students can take self-guided tours anytime. Track completion and automatically follow up based on viewing behavior.",
          mockupId: "virtual",
          highlights: [
            "Embedded video hosting (YouTube, Vimeo, custom)",
            "Self-guided tour links with tracking",
            "Virtual reality (360°) integrations",
            "Viewing completion notifications",
            "Automated follow-up sequences"
          ]
        },
        {
          id: "calendar",
          title: "Smart Calendar",
          description: "Automated viewing scheduling",
          caption: "Students book available slots instantly. Automatic reminders reduce no-shows. Two-way sync with your calendar.",
          mockupId: "calendar",
          highlights: [
            "Shared calendar two-way sync",
            "AI-powered slot suggestions",
            "Automatic reminders (WhatsApp, SMS, email)",
            "Staff availability management",
            "No-show tracking and rescheduling"
          ]
        }
      ]
    },
    {
      id: "documentation-contracts",
      title: "Documentation & Contracts",
      icon: FileSignature,
      color: "from-orange-500 to-red-500",
      features: [
        {
          id: "contracts",
          title: "Digital Contracts",
          description: "E-sign contracts in seconds",
          caption: "Generate contracts instantly, students sign on mobile, deposit automatically protected. Fully compliant and legally binding.",
          mockupId: "contracts",
          highlights: [
            "Template library with variable insertion",
            "Automatic contract generation from bookings",
            "Secure e-signature with audit trail",
            "Deposit protection integration",
            "Compliance tracking (Right-to-Rent, deposit schemes)"
          ]
        },
        {
          id: "floorplans",
          title: "Interactive Floor Plans",
          description: "Visual property management",
          caption: "Click any room to see tenant details, availability, and history. Drag-and-drop builder makes setup easy.",
          mockupId: "floorplans",
          highlights: [
            "Drag-and-drop floor plan builder",
            "Real-time room availability status",
            "Clickable rooms with tenant details",
            "Visual vacancy tracking",
            "Export and sharing capabilities"
          ]
        }
      ]
    },
    {
      id: "analytics-insights",
      title: "Analytics & Insights",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      features: [
        {
          id: "dashboard",
          title: "Command Center Dashboard",
          description: "Real-time oversight of your entire operation",
          caption: "See everything that matters in one view. Live occupancy, conversion rates, revenue metrics, and action items.",
          mockupId: "dashboard",
          highlights: [
            "Live occupancy rates across all properties",
            "Active leads pipeline with conversion tracking",
            "Upcoming viewings and contract renewals",
            "Revenue metrics and financial KPIs",
            "Alert system for urgent actions"
          ]
        },
        {
          id: "analytics",
          title: "Advanced Analytics",
          description: "Data-driven insights for better decisions",
          caption: "Understand your performance with conversion funnels, demographic breakdowns, and year-over-year comparisons.",
          mockupId: "analytics",
          highlights: [
            "Conversion funnel analysis (enquiry → contract)",
            "Student demographic breakdowns by nationality",
            "Booking pacing vs. previous years",
            "Revenue per available room (RevPAR)",
            "AI call scoring and staff performance"
          ]
        }
      ]
    }
  ];

  const stats = [
    
    { 
      label: "Languages Supported", 
      value: "25+", 
      icon: Globe,
      source: "Platform capability verified through API integration",
      methodology: "Direct integration with language detection and translation APIs supporting 25+ languages for real-time international student communications."
    },
    
    { 
      label: "Response Time", 
      value: "<30s", 
      icon: Zap,
      source: "AI system performance metric (verified)",
      methodology: "Median response time across all automated conversations operating 24/7. Measured across thousands of student enquiries."
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: "Capture Leads",
      description: "AI agent (Ava) responds to WhatsApp, email, portal enquiries 24/7. Creates lead profile automatically with preferences and budget.",
      icon: MessageSquare,
      visual: "AI Chat Interface",
      stepNumber: "1"
    },
    {
      step: 2,
      title: "Book Viewings",
      description: "Calendar syncs with landlord availability. Student picks slot, gets instant confirmation. Reminders sent automatically.",
      icon: Calendar,
      visual: "Smart Calendar",
      stepNumber: "2"
    },
    {
      step: 3,
      title: "Verify Documents",
      description: "AI checks passport, visa, university letter. Instantly verifies Right-to-Rent. Landlord gets instant approval notification.",
      icon: FileCheck,
      visual: "Document Verification",
      stepNumber: "3"
    },
    {
      step: 4,
      title: "Sign Contracts & Take Deposits",
      description: "Tenancy agreement auto-generated with all details. Student e-signs on mobile. Instant payment via Stripe. Deposit protected automatically.",
      icon: FileSignature,
      visual: "E-Signature & Payment",
      stepNumber: "4"
    },
    {
      step: 5,
      title: "Track Performance",
      description: "Real-time analytics show conversion rates, response times, and revenue metrics. AI continuously optimizes your lettings process.",
      icon: TrendingUp,
      visual: "Analytics Dashboard",
      stepNumber: "5"
    }
  ];

  const animationDuration = shouldReduceMotion ? 0 : 0.6;
  const animationDelay = shouldReduceMotion ? 0 : 0.1;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="How PBSA Automation Works | Student Lettings Software | TermFlow"
        description="See how TermFlow automates student accommodation from enquiry to move-in. AI-powered viewing bookings, digital contracts, Right-to-Rent verification. Setup in 1-2 days."
        keywords="PBSA automation, student lettings software, how termflow works, AI viewing bookings, digital contracts student accommodation, Right-to-Rent verification, student lettings workflow, PBSA software UK"
        canonical="https://termflow.co.uk/how-it-works"
        ogTitle="How PBSA Automation Works | Student Lettings Software | TermFlow"
        ogDescription="See how TermFlow automates student accommodation from enquiry to move-in. AI-powered viewing bookings, digital contracts, Right-to-Rent verification."
        ogType="website"
        ogUrl="https://termflow.co.uk/how-it-works"
        twitterCard="summary_large_image"
        twitterTitle="How PBSA Automation Works | Student Lettings Software | TermFlow"
        twitterDescription="AI-powered viewing bookings, digital contracts, Right-to-Rent verification. Setup in 1-2 days."
      />

      <ServiceSchema
        name="AI Lettings Automation for Student Accommodation"
        description="Automated PBSA lettings platform handling enquiries, viewings, applications, contracts, and payments with AI. Cut admin time by 40% with our comprehensive automation suite."
        provider={{
          name: "TermFlow",
          url: "https://termflow.co.uk"
        }}
        serviceType="Property Management Software"
        offers={{
          price: "99",
          priceCurrency: "GBP",
          description: "From £99/month with 14-day free trial"
        }}
      />

      {/* In-Page Navigation */}
      <InPageNav sections={sections} />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <a href="/" className="hover:opacity-80 transition-opacity" data-testid="link-home">
              <TermFlowWordmark />
            </a>
            <SiteSearch />
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href="/" className="hidden md:inline text-base font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap" data-testid="link-home-text">
              Home
            </a>
            <Button variant="outline" size="sm" asChild data-testid="link-demo" className="text-sm sm:text-base px-3 sm:px-4 border-2 border-tf-lime/80 text-tf-lime hover:bg-tf-lime/20 hover:text-tf-lime hover:border-tf-lime font-bold shadow-sm">
              <a href="/book-demo" className="whitespace-nowrap">
                <span className="hidden xs:inline">Book </span>Demo
              </a>
            </Button>
            <a href="/pricing" className="hidden sm:inline text-base font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap" data-testid="link-pricing">
              Pricing
            </a>
            <Button variant="outline" size="sm" asChild data-testid="button-signin" className="text-sm sm:text-base px-3 sm:px-4">
              <a href="/login" className="whitespace-nowrap">
                Sign in
              </a>
            </Button>
            <Button variant="default" size="sm" asChild data-testid="button-signup" className="text-sm sm:text-base px-3 sm:px-4 bg-tf-lime text-tf-navy hover:bg-tf-lime/90 border-0 font-bold shadow-sm">
              <a href="/login" className="whitespace-nowrap">
                Sign up
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Overview */}
      <section ref={overviewRef} id="overview" className="py-20 px-6 bg-gradient-to-b from-primary/10 via-purple-500/10 to-background relative overflow-hidden scroll-mt-20">
        {/* Animated gradient orbs */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </>
        )}

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: animationDuration }}
          >
            <Badge className="mb-4 text-sm px-4 py-1 bg-gradient-to-r from-primary to-purple-600 text-white border-0" data-testid="badge-complete-platform">
              <Zap className="h-4 w-4 mr-2" />
              Complete Platform Overview
            </Badge>
          </motion.div>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: animationDuration, delay: animationDelay }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent" 
            data-testid="text-page-title"
          >
            How TermFlow Automates Your Entire Student Lettings Cycle
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: animationDuration, delay: animationDelay * 2 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" 
            data-testid="text-page-subtitle"
          >
            A complete lettings automation platform — from AI conversations to digital contracts, 
            interactive floor plans to virtual viewings. Everything you need in one place.
          </motion.p>
          
          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" asChild data-testid="button-start-trial-hero" className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90 font-bold">
              <a href="/login">
                <Zap className="h-5 w-5 mr-2" />
                Try TermFlow Free
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-book-demo-hero">
              <a href="/book-demo">
                <Video className="h-5 w-5 mr-2" />
                See It in Action
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            14-day free trial • No credit card required
          </p>

          {/* Stats Grid - Animated */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: animationDuration, delay: animationDelay * 4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const gradients = [
                "from-blue-500 to-cyan-500",
                "from-purple-500 to-pink-500",
                "from-green-500 to-emerald-500",
                "from-orange-500 to-red-500"
              ];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ y: 30, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: animationDuration - 0.1, delay: animationDelay * 5 + index * animationDelay }}
                >
                  <Card className="hover-elevate border-2 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <CardContent className="pt-6 text-center relative z-10">
                      <motion.div
                        whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </motion.div>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">{stat.value}</div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              onClick={scrollToMethodology}
                              className="hover-elevate rounded-full p-1 transition-colors"
                              data-testid={`button-stat-source-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                              aria-label={`View methodology for ${stat.label}`}
                            >
                              <Info className="h-4 w-4 text-primary" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs p-3" data-testid={`tooltip-stat-source-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">Click to view detailed methodology</p>
                              <div className="flex items-center gap-1 text-primary text-xs font-medium">
                                <ArrowDown className="h-3 w-3" />
                                <span>See how we measured this</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats Disclaimer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: animationDuration, delay: animationDelay * 9 }}
            className="mt-8 text-center"
          >
            <Card className="max-w-2xl mx-auto bg-muted/30 border-border/50" data-testid="card-stats-attribution">
              <CardContent className="pt-4 pb-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2 justify-center">
                    <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground text-left">
                      <p className="mb-2">
                        <strong className="text-foreground">How TermFlow is designed to work.</strong> These describe the platform's capabilities, not results from a customer deployment.
                      </p>
                      <p className="text-xs mt-2">
                        <button 
                          onClick={scrollToMethodology}
                          className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                          data-testid="link-view-methodology"
                        >
                          View detailed methodology below
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Accordion */}
      <section ref={featuresRef} id="features" className="py-20 px-6 scroll-mt-20" data-testid="section-features">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: animationDuration }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" data-testid="badge-platform-features">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore each feature category to see detailed demonstrations and capabilities
            </p>
          </motion.div>

          <Accordion type="single" collapsible defaultValue="lead-management" className="space-y-6">
            {featureCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: animationDuration, delay: categoryIndex * animationDelay }}
                >
                  <AccordionItem value={category.id} className="border-2 rounded-lg" data-testid={`accordion-${category.id}`}>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 text-left">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} flex-shrink-0`}>
                          <CategoryIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{category.title}</h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            {category.features.length} features
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-8 mt-4">
                        {category.features.map((feature, featureIndex) => (
                          <div key={feature.id} className="space-y-4" data-testid={`feature-${feature.id}`}>
                            <div className="flex items-start gap-3">
                              <Badge variant="outline" className="mt-1">{featureIndex + 1}</Badge>
                              <div>
                                <h4 className="text-xl font-bold mb-1">{feature.title}</h4>
                                <p className="text-muted-foreground">{feature.description}</p>
                              </div>
                            </div>

                            {/* Lazy-loaded Mockup with Caption */}
                            <div className="space-y-3">
                              <Card className="border-2 overflow-hidden">
                                <CardContent className="p-6">
                                  <Suspense fallback={<MockupSkeleton />}>
                                    {(() => {
                                      const MockupComponent = mockupComponents[feature.mockupId as keyof typeof mockupComponents];
                                      return MockupComponent ? <MockupComponent /> : null;
                                    })()}
                                  </Suspense>
                                </CardContent>
                              </Card>
                              <div className="flex items-start gap-2 px-4" data-testid={`caption-${feature.id}`}>
                                <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-muted-foreground italic">
                                  {feature.caption}
                                </p>
                              </div>
                            </div>

                            {/* Feature Highlights */}
                            <div className="grid md:grid-cols-2 gap-2 mt-4">
                              {feature.highlights.map((highlight, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm" data-testid={`highlight-${feature.id}-${idx}`}>
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{highlight}</span>
                                </div>
                              ))}
                            </div>

                            {featureIndex < category.features.length - 1 && (
                              <div className="border-t mt-6" />
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* Workflow Section */}
      <section ref={workflowRef} id="workflow" className="py-20 px-6 bg-muted/30 scroll-mt-20" data-testid="section-workflow">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: animationDuration }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" data-testid="badge-workflow">
              <Zap className="h-4 w-4 mr-2" />
              End-to-End Workflow
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              From Enquiry to Move-in: 100% Automated
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how TermFlow handles the complete lettings journey
            </p>
          </motion.div>

          <div className="space-y-12">
            {workflowSteps.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.step}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: animationDuration, delay: animationDelay * index }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                  data-testid={`workflow-step-${item.step}`}
                >
                  {/* Content */}
                  <div className={`${isEven ? 'md:text-right md:pr-12' : 'md:pl-12 md:col-start-2'}`}>
                    <div className={`inline-flex items-center gap-3 mb-4 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                        {item.step}
                      </div>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground mb-3">{item.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {item.visual}
                    </Badge>
                  </div>

                  {/* Visual */}
                  <div className={`${isEven ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1'}`}>
                    <Card className="overflow-hidden hover-elevate border-2">
                      <div className="h-1 bg-gradient-to-r from-primary to-primary/50" />
                      <CardContent className="p-6">
                        <div className="bg-gradient-to-br from-muted to-muted/50 rounded-lg p-4 min-h-[180px] relative overflow-hidden border border-border/50">
                          {/* Browser Chrome */}
                          <div className="flex items-center gap-1.5 mb-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                          </div>

                          {/* Step 1: WhatsApp Chat */}
                          {item.step === 1 && (
                            <div className="space-y-2">
                              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-[10px] font-semibold">ST</div>
                                <div className="flex-1 bg-background/80 rounded-lg p-2 text-xs">Hi, looking for a room near NTU?</div>
                              </motion.div>
                              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.3 }} className="flex gap-2 flex-row-reverse">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                                  <MessageSquare className="h-3.5 w-3.5 text-white" />
                                </div>
                                <div className="flex-1 bg-primary/20 rounded-lg p-2 text-xs">Perfect! We have Stanley House - 2 min from NTU. What's your budget? 😊</div>
                              </motion.div>
                              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: shouldReduceMotion ? 0 : 0.6 }} className="p-2 bg-green-500/20 rounded border border-green-500/30 text-center">
                                <div className="text-[10px] font-semibold text-green-600 dark:text-green-400">✓ Lead Added to Dashboard</div>
                              </motion.div>
                            </div>
                          )}

                          {/* Step 2: Calendar Booking */}
                          {item.step === 2 && (
                            <div className="space-y-2">
                              <div className="grid grid-cols-7 gap-1 mb-1">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                  <div key={i} className="text-[10px] text-center text-muted-foreground font-medium">{day}</div>
                                ))}
                              </div>
                              <div className="grid grid-cols-7 gap-1">
                                {[...Array(14)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: shouldReduceMotion ? 0 : i * 0.03 }}
                                    className={`aspect-square rounded text-[10px] flex items-center justify-center ${
                                      i === 9 ? 'bg-primary text-primary-foreground font-bold' : 'bg-background/60 text-muted-foreground'
                                    }`}
                                  >
                                    {i + 1}
                                  </motion.div>
                                ))}
                              </div>
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.5 }} className="p-2 bg-primary/20 rounded border border-primary/30">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3.5 w-3.5 text-primary" />
                                  <div className="text-[10px] font-semibold">Viewing: Thu 10th, 2:00 PM</div>
                                </div>
                                <div className="text-[9px] text-muted-foreground mt-0.5">Confirmation sent via WhatsApp ✓</div>
                              </motion.div>
                            </div>
                          )}

                          {/* Step 3: Document Verification */}
                          {item.step === 3 && (
                            <div className="space-y-2">
                              {['Passport.pdf', 'Visa.pdf', 'Uni Letter.pdf'].map((doc, i) => (
                                <motion.div
                                  key={doc}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: shouldReduceMotion ? 0 : i * 0.2 }}
                                  className="flex items-center gap-2 p-2 bg-background/80 rounded border border-border/50"
                                >
                                  <FileCheck className="h-4 w-4 text-primary" />
                                  <div className="flex-1 text-[10px] font-medium">{doc}</div>
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: shouldReduceMotion ? 0 : 0.3 + i * 0.2 }}
                                  >
                                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                  </motion.div>
                                </motion.div>
                              ))}
                              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: shouldReduceMotion ? 0 : 0.8 }} className="p-2 bg-green-500/20 rounded border border-green-500/30 text-center">
                                <div className="text-[10px] font-semibold text-green-600 dark:text-green-400">✓ Right-to-Rent Verified</div>
                              </motion.div>
                            </div>
                          )}

                          {/* Step 4: Contract & Payment */}
                          {item.step === 4 && (
                            <div className="space-y-2">
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-background/80 rounded border border-border/50">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileSignature className="h-4 w-4 text-primary" />
                                  <div className="text-[10px] font-semibold">Tenancy Agreement 2024-25</div>
                                </div>
                                <div className="space-y-1 mb-2">
                                  <div className="h-1.5 bg-foreground/20 rounded w-full" />
                                  <div className="h-1.5 bg-foreground/20 rounded w-4/5" />
                                  <div className="h-1.5 bg-foreground/20 rounded w-3/5" />
                                </div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: shouldReduceMotion ? 0 : 0.3 }} className="flex items-center gap-2 pt-2 border-t border-border/30">
                                  <div className="h-6 bg-gradient-to-r from-primary/30 to-primary/10 rounded flex-1 flex items-center justify-center text-[9px] font-medium">Sarah Thompson</div>
                                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                </motion.div>
                              </motion.div>
                              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: shouldReduceMotion ? 0 : 0.6 }} className="p-2 bg-primary/20 rounded border border-primary/30 flex items-center justify-between">
                                <div className="text-[10px] font-semibold">Deposit: £850</div>
                                <div className="text-[9px] text-green-600 dark:text-green-400 font-semibold">✓ Instant Payment</div>
                              </motion.div>
                            </div>
                          )}

                          {/* Step 5: Analytics */}
                          {item.step === 5 && (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-2 bg-background/80 rounded border border-primary/20">
                                  <div className="text-[9px] text-muted-foreground">Conversion Rate</div>
                                  <div className="text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">67%</div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.1 }} className="p-2 bg-background/80 rounded border border-primary/20">
                                  <div className="text-[9px] text-muted-foreground">Avg Response</div>
                                  <div className="text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">24s</div>
                                </motion.div>
                              </div>
                              <div className="h-16 bg-background/60 rounded border border-border/30 flex items-end justify-around p-1.5 gap-1">
                                {[0.5, 0.7, 0.6, 0.9, 0.8, 1, 0.85].map((height, i) => (
                                  <motion.div 
                                    key={i} 
                                    initial={{ scaleY: 0 }} 
                                    animate={{ scaleY: height }} 
                                    transition={{ delay: shouldReduceMotion ? 0 : 0.2 + i * 0.08, duration: 0.4 }}
                                    className="flex-1 bg-gradient-to-t from-primary to-purple-500 rounded-t origin-bottom"
                                    style={{ height: `${height * 100}%` }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button size="lg" asChild data-testid="button-see-workflow">
              <a href="/book-demo">
                <Zap className="h-5 w-5 mr-2" />
                Book a Demo Call
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* What We Don't Provide */}
      <section ref={disclaimerRef} id="disclaimer" className="py-20 px-6 bg-muted/30 scroll-mt-20" data-testid="section-disclaimer">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Clear Expectations</Badge>
            <h2 className="text-4xl font-bold mb-4">What We Don't Provide</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              To avoid confusion — here's what TermFlow is NOT
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card data-testid="disclaimer-not-portal">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <X className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Not a Property Listing Portal</CardTitle>
                    <CardDescription className="mt-2">
                      We don't list your properties on Rightmove or Zoopla. We <strong>capture leads FROM</strong> those portals when students enquire about your listings.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card data-testid="disclaimer-not-marketplace">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <X className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Not a Tenant Marketplace</CardTitle>
                    <CardDescription className="mt-2">
                      We're not Booking.com for students. We're the <strong>backend automation platform for landlords</strong> to manage their existing enquiries.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card data-testid="disclaimer-not-property-mgmt">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <X className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Not Property Management</CardTitle>
                    <CardDescription className="mt-2">
                      We don't handle maintenance, repairs, cleaning, or ongoing property operations. We automate the <strong>lettings process only</strong> (enquiry to move-in).
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card data-testid="disclaimer-not-general-lettings">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <X className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Not for General Lettings</CardTitle>
                    <CardDescription className="mt-2">
                      Specifically built for <strong>student accommodation</strong>. Not designed for family homes, commercial properties, or general residential lettings.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card data-testid="disclaimer-not-staffing">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <X className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Not Providing Physical Staff</CardTitle>
                    <CardDescription className="mt-2">
                      We automate processes, but we don't send people to conduct viewings or meet tenants. You control your own team and operations.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card data-testid="disclaimer-not-legal">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <X className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Not Legal/Compliance Service</CardTitle>
                    <CardDescription className="mt-2">
                      We facilitate compliant workflows (Right-to-Rent, deposit protection), but <strong>you retain legal responsibility</strong> for compliance.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h4 className="font-semibold text-lg mb-2">What We Actually Do</h4>
                    <p className="text-muted-foreground">
                      We're a <strong>lettings automation platform</strong> that sits between you and your enquiries. 
                      Think of us as your digital lettings team — handling conversations, bookings, applications, 
                      and contracts automatically, while you maintain full control of your properties and operations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <FAQ
            title="Frequently Asked Questions"
            description="Everything you need to know about how TermFlow works"
            items={[
              {
                question: "How long does it take to set up TermFlow?",
                answer: "Most operators are up and running within 24-48 hours. Setup includes connecting your WhatsApp Business account, importing property data, and customizing automated messages. Our onboarding team guides you through each step, and you can start with a single property to test before scaling."
              },
              {
                question: "Do I need technical knowledge to use the platform?",
                answer: "No technical knowledge required. TermFlow is designed for property managers and operators, not developers. Everything is configured through a visual interface with drag-and-drop tools. If you can use WhatsApp and email, you can use TermFlow."
              },
              {
                question: "Can TermFlow integrate with my existing systems?",
                answer: "Yes. TermFlow integrates with major property portals (Rightmove, Zoopla, SpareRoom), calendar systems (Google Calendar, Outlook), payment processors (Stripe), and CRM tools. We also provide API access for custom integrations. Most integrations are pre-built and require just a few clicks to activate."
              },
              {
                question: "What happens if the AI can't answer a student's question?",
                answer: "Ava (our AI assistant) is trained to recognize when a question requires human expertise. In these cases, she will automatically escalate the conversation to your team via notification, and you can take over seamlessly within the same chat thread. You'll see the full conversation history and context."
              },
              {
                question: "Is my data secure and GDPR compliant?",
                answer: "Absolutely. TermFlow is fully GDPR compliant with data encryption in transit and at rest, regular security audits, and clear data processing agreements. All student data is stored on UK/EU servers. We're also compliant with Right-to-Rent requirements and deposit protection regulations."
              },
              {
                question: "Can I customize the automated messages and responses?",
                answer: "Yes. You have full control over message templates, tone of voice, and conversation flows. You can customize responses by property, room type, or student demographic. Our template library gives you a starting point, and you can A/B test different approaches to optimize conversion rates."
              },
              {
                question: "Do I need to change my current workflow to use TermFlow?",
                answer: "No. TermFlow adapts to your existing workflow, not the other way around. You can start with just lead capture automation and gradually add more features like viewing bookings, document verification, and contracts as you get comfortable. Many operators run TermFlow alongside their existing systems during a transition period."
              }
            ] as FAQItem[]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 relative overflow-hidden">
        {/* Animated Background */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Ready to See It in Action?
            </h2>
          </motion.div>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: animationDelay }}
            className="text-xl text-muted-foreground mb-8"
          >
            Try TermFlow free for 14 days • No credit card required
          </motion.p>
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: animationDelay * 2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild data-testid="button-start-trial" className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90 font-bold">
              <a href="/login">
                <Sparkles className="h-5 w-5 mr-2" />
                Try TermFlow Free
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-view-pricing">
              <a href="/book-demo">
                <Video className="h-5 w-5 mr-2" />
                Book a Demo
              </a>
            </Button>
          </motion.div>
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: animationDelay * 3 }}
            className="mt-6"
          >
            <a 
              href="/case-studies" 
              className="inline-flex items-center text-foreground font-semibold hover:underline"
              data-testid="link-case-studies"
            >
              <Award className="h-4 w-4 mr-2" />
              Read customer results and success stories
              <span className="ml-1">→</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 TermFlow. Built for student accommodation landlords.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA />
    </div>
  );
}
