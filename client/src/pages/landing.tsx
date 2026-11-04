// Landing Page - For non-authenticated users
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, Calendar, FileCheck, PoundSterling, MessageSquare, Video, Home, Building2, UserSearch, TrendingUp, CheckCircle, Star, Quote, Mail, Phone, CreditCard, Table, Webhook, Zap, MessageCircle, Heart, Award, Eye, Globe, Shield, ArrowRight, Sparkles, Clock, Calculator } from "lucide-react";
import { SiStripe, SiGooglecalendar, SiGooglesheets, SiTwilio } from "react-icons/si";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SEOHead } from "@/components/SEOHead";
import { OrganizationSchema } from "@/components/OrganizationSchema";
import { SoftwareApplicationSchema } from "@/components/SoftwareApplicationSchema";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { EnhancedStructuredData } from "@/components/EnhancedStructuredData";
import { AnimatedHero } from "@/components/AnimatedHero";
import { HowToSchema } from "@/components/HowToSchema";
import { AggregateRatingSchema } from "@/components/AggregateRatingSchema";
import { OffersSchema } from "@/components/OffersSchema";
import { ProfessionalServiceSchema } from "@/components/ProfessionalServiceSchema";
import { StickyHowItWorks } from "@/components/StickyHowItWorks";
import { Footer } from "@/components/Footer";
import { StickyCTA } from "@/components/StickyCTA";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FAQ, FAQItem } from "@/components/FAQ";
import { TestimonialWithSchema, TestimonialData } from "@/components/TestimonialWithSchema";
import { TrustBadges } from "@/components/TrustBadges";
import { TrustSignals } from "@/components/TrustSignals";
import { SocialProofBanner } from "@/components/SocialProofBanner";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { BackToTop } from "@/components/BackToTop";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SiteSearch } from "@/components/SiteSearch";
import { OptimizedImage } from "@/components/OptimizedImage";
import rightmoveLogo from "@assets/rightmove-logo-new.png";
import zooplaLogo from "@assets/zoopla-logo.png";
import openrentLogo from "@assets/openrent-logo.png";
import accommodationLogo from "@assets/accommodation-for-students-logo.png";
import myStudentHallsLogo from "@assets/my-student-halls-logo.png";
import uniplacesLogo from "@assets/uniplaces-logo.png";
import headshot2 from "@assets/stock_images/professional_busines_4a59ef67.jpg";
import headshot3 from "@assets/stock_images/professional_busines_96686da7.jpg";
import headshot4 from "@assets/stock_images/professional_busines_3eac0e8f.jpg";
import sarahHeadshot from "@assets/stock_images/friendly_young_woman_6ba1b3c2.jpg";
import openaiLogo from "@assets/stock_images/openai_company_logo__848dc366.jpg";
import twilioLogo from "@assets/stock_images/twilio_company_logo__3bd12c37.jpg";
import whatsappLogo from "@assets/stock_images/whatsapp_logo.png";
import stripeLogo from "@assets/Stripe_Logo_1_1760546998208.png";
import googleLogo from "@assets/stock_images/google_company_logo__af0689fd.jpg";
import googleCalendarLogo from "@assets/stock_images/google_calendar_logo.png";
import googleSheetsLogo from "@assets/stock_images/google_sheets_logo.png";
import justcallLogo from "@assets/stock_images/justcall_logo.jpg";
import neonLogo from "@assets/stock_images/neon_database_compan_c767576d.jpg";
import replitLogo from "@assets/stock_images/replit_company_logo__ce51c33d.jpg";
import n8nLogo from "@assets/stock_images/n8n_logo.png";
import docusignLogo from "@assets/DocuSign_Logo_1_1760547148374.png";

export default function Landing() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1] || '');
  const variantParam = params.get('variant');
  const [variant, setVariant] = useState(
    variantParam === '2' ? 2 : variantParam === '3' ? 3 : 1
  );
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (variantParam) {
      const v = parseInt(variantParam);
      if (v >= 1 && v <= 3) setVariant(v);
    }
  }, [variantParam]);

  const heroVariations = [
    {
      title: "AI Flows That Take PBSA from Inbox Chaos to Steady Rebookers",
      tagline: "Automated lead handling, viewings, R2R checks, contracts, and deposit collection—from enquiry to move-in",
      subtitle: "Built for PBSA operators across the UK & Ireland",
      primaryCTA: "See TermFlow in Action",
      secondaryCTA: "Explore Solutions",
      primaryAction: "/book-demo",
      secondaryAction: "/solutions",
    },
    {
      title: "AI Automation for Student Lettings (PBSA)",
      tagline: "From initial enquiry to signed contracts—automated viewings, Right-to-Rent, and deposit collection",
      subtitle: "Built for PBSA operators across the UK & Ireland",
      primaryCTA: "See TermFlow in Action",
      secondaryCTA: "Explore Solutions",
      primaryAction: "/book-demo",
      secondaryAction: "/solutions",
    },
    {
      title: "Automate Your PBSA Operations: Faster Bookings, Fewer Pings, Higher Rebookers",
      tagline: "AI-powered lead automation, viewings, Right-to-Rent checks, digital contracts, and deposit collection",
      subtitle: "Built for PBSA operators across the UK & Ireland",
      primaryCTA: "See TermFlow in Action",
      secondaryCTA: "Explore Solutions",
      primaryAction: "/book-demo",
      secondaryAction: "/solutions",
    },
  ];

  const currentHero = heroVariations[variant - 1];

  // Testimonials data with schema
  const testimonials: TestimonialData[] = [
    {
      name: "Sarah Mitchell",
      role: "Operations Director",
      company: "StudentStay Newcastle",
      avatar: sarahHeadshot,
      avatarFallback: "SM",
      rating: 5,
      text: "During clearing period, we had 400+ enquiries in one week. TermFlow handled every single one while we slept. The AI agent books viewings and chases applications automatically. Game-changer.",
      portfolioSize: "320 beds",
      location: "Newcastle",
      date: "2024-09-15"
    },
    {
      name: "James Chen",
      role: "Property Manager",
      company: "Metropolitan Student Living",
      avatar: headshot2,
      avatarFallback: "JC",
      rating: 5,
      text: "International students love the instant WhatsApp responses in multiple languages. No more timezone issues. Contracts are signed digitally before students even arrive in the UK.",
      portfolioSize: "150 beds",
      location: "London",
      date: "2024-08-22"
    },
    {
      name: "Emma Thompson",
      role: "Lettings Manager",
      company: "Bristol Student Homes",
      avatar: headshot3,
      avatarFallback: "ET",
      rating: 5,
      text: "We used to miss leads from Rightmove because we couldn't respond fast enough. Now every enquiry gets an instant reply with a viewing link. Our occupancy rate jumped to 98%.",
      portfolioSize: "280 beds",
      location: "Bristol",
      date: "2024-10-05"
    },
    {
      name: "Michael Roberts",
      role: "Portfolio Owner",
      company: "Edinburgh Student Quarter",
      avatar: headshot4,
      avatarFallback: "MR",
      rating: 5,
      text: "The automated contract system is brilliant. Students complete applications, get approved, and sign digitally - all without us lifting a finger. Saved us hiring 2 admin staff.",
      portfolioSize: "450 beds",
      location: "Edinburgh",
      date: "2024-07-18"
    }
  ];

  // FAQ data with long-tail keyword questions
  const faqItems: FAQItem[] = [
    {
      question: "How does AI lettings automation work for student accommodation?",
      answer: "TermFlow's AI assistant (Ava) captures leads from all property portals and responds instantly via WhatsApp, email, or web chat. It qualifies leads, books viewings based on your calendar availability, and guides students through the entire application process - all without human intervention. The AI detects student language preferences, answers property questions using your data, and escalates to staff only when needed."
    },
    {
      question: "Can AI really replace my lettings team for student accommodation properties?",
      answer: "TermFlow doesn't replace your team - it handles the repetitive tasks so your team can focus on high-value work. The AI handles routine tasks like responding to enquiries, booking viewings, and processing applications. Your team stays in control for approvals, complex queries, and strategic decisions."
    },
    {
      question: "Is automated student lettings software GDPR compliant?",
      answer: "Yes, TermFlow is fully GDPR compliant. All student data is encrypted, stored securely in UK data centers, and processed according to GDPR regulations. Students can request data export or deletion at any time. We're also compliant with UK deposit protection schemes (TDS, DPS, MyDeposits) and Right-to-Rent requirements."
    },
    {
      question: "What property portals does TermFlow integrate with?",
      answer: "TermFlow captures leads from all major UK property portals including Rightmove, Zoopla, OpenRent, Student.com, Accommodation for Students, Uniplaces, My Student Halls, and 100+ others. We also integrate with WhatsApp, email, and web forms to ensure you never miss a lead from any source."
    },
    {
      question: "How much does AI lettings automation cost for student accommodation?",
      answer: "TermFlow pricing starts from £99/month for portfolios up to 100 units, scaling to £499/month for 500-1000 units. All features are included at every tier - AI conversations, smart viewings, digital contracts, analytics, and integrations. There are no setup fees, and you can cancel anytime."
    },
    {
      question: "Can students sign tenancy agreements digitally on mobile?",
      answer: "Yes, students can sign contracts digitally on any device - mobile, tablet, or desktop. TermFlow automatically generates tenancy agreements with all details pre-filled, sends them via WhatsApp or email, and students can e-sign in seconds. All signatures are legally binding with full audit trails. Deposits are processed instantly via Stripe and protected automatically."
    },
    {
      question: "Does the AI assistant support multiple languages for international students?",
      answer: "Yes, TermFlow's AI automatically detects and responds in 25+ languages including Chinese, Spanish, French, German, Italian, and Arabic. This is perfect for student accommodation properties with international students. The AI maintains context across languages and can switch mid-conversation based on student preference."
    },
    {
      question: "How long does it take to set up AI automation for my properties?",
      answer: "Most operators are fully set up within 1-2 days. The process includes: importing property data (via spreadsheet or API), uploading floor plans and videos, connecting your calendar, and customising AI responses. We provide onboarding support and training. You can start with a 14-day free trial to test everything before committing."
    }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      {/* Exit Intent Popup */}
      <ExitIntentPopup />
      
      <SEOHead
        title="Student Accommodation Software UK | PBSA Management Platform | TermFlow"
        description="AI lettings software for UK student accommodation. AI-powered automation for enquiries, viewings, contracts & Right-to-Rent checks. Free 14-day trial."
        keywords="PBSA software, student accommodation software, student housing software UK, student lettings software, PBSA management software, student property management software, AI student accommodation, PBSA automation, student accommodation management system"
        canonical="https://termflow.co.uk/"
        ogTitle="Student Accommodation Software UK | PBSA Management Platform"
        ogDescription="AI lettings software for UK student accommodation. AI-powered automation for enquiries, viewings, contracts & Right-to-Rent."
        ogType="website"
        ogUrl="https://termflow.co.uk/"
        twitterCard="summary_large_image"
        twitterTitle="Student Accommodation Software UK | PBSA Management Platform"
        twitterDescription="AI lettings software for UK student accommodation. AI-powered automation for enquiries, viewings, contracts & Right-to-Rent."
      />
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <LocalBusinessSchema />
      <EnhancedStructuredData />
      
      {/* Additional Comprehensive Structured Data */}
      <HowToSchema
        name="How to Automate Student Lettings with TermFlow"
        description="Step-by-step guide to implementing AI automation for your PBSA operations, from initial enquiry to contract signing"
        steps={[
          {
            name: "Connect Your Property Portals",
            text: "Link TermFlow to Rightmove, Zoopla, and 100+ other portals. Enquiries automatically flow into your AI assistant Ava."
          },
          {
            name: "Customise AI Responses", 
            text: "Upload property details, floor plans, and videos. Set your tone of voice and response templates. Ava learns your specific requirements."
          },
          {
            name: "Activate Smart Viewing Bookings",
            text: "Connect your calendar (Google, Outlook, or any CalDAV). Ava automatically schedules viewings based on your availability."
          },
          {
            name: "Enable Digital Contracts",
            text: "Upload your tenancy agreement template. TermFlow generates contracts with pre-filled student details and sends for e-signature."
          },
          {
            name: "Process Deposits Automatically",
            text: "Connect Stripe for instant payment collection. Deposits are automatically protected with DPS/TDS/MyDeposits schemes."
          }
        ]}
        totalTime="PT48H"
        estimatedCost={{ value: "99", currency: "GBP" }}
      />
      
      <AggregateRatingSchema
        itemReviewed={{
          type: "SoftwareApplication",
          name: "TermFlow",
          description: "AI-powered lettings automation platform for PBSA operators",
          url: "https://termflow.co.uk",
          image: "https://termflow.co.uk/og-image.png"
        }}
      />
      
      <OffersSchema
        offers={[
          {
            name: "Starter Plan",
            description: "Perfect for small PBSA operators with up to 100 beds",
            price: "99",
            features: ["AI conversations", "Smart viewings", "Digital contracts", "Basic analytics"],
            category: "Entry Level"
          },
          {
            name: "Professional Plan",
            description: "For growing portfolios with 100-250 beds",
            price: "179",
            features: ["Everything in Starter", "Advanced analytics", "Multiple properties", "API access"],
            category: "Most Popular"
          },
          {
            name: "Growth Plan",
            description: "For established operators with 250-500 beds",
            price: "299",
            features: ["Everything in Professional", "Custom integrations", "Priority support", "White-label options"],
            category: "Scale"
          },
          {
            name: "Enterprise Plan",
            description: "For large portfolios with 500+ beds",
            price: "499",
            features: ["Everything in Growth", "Dedicated account manager", "Custom workflows", "SLA guarantees"],
            category: "Enterprise"
          }
        ]}
      />
      
      <ProfessionalServiceSchema
        name="TermFlow PBSA Automation Services"
        description="Professional AI automation services for Purpose-Built Student Accommodation operators in the UK and Ireland"
        serviceType="Property Management Automation"
        aggregateRating={{ ratingValue: 4.9, reviewCount: 127 }}
        hasOfferCatalog={{
          name: "PBSA Automation Solutions",
          itemListElement: [
            {
              name: "Enquiry Automation",
              description: "AI-powered response to all enquiries within 30 seconds, 24/7",
              price: "0",
              priceCurrency: "GBP"
            },
            {
              name: "Viewing Management",
              description: "Automated viewing bookings with calendar integration",
              price: "0",
              priceCurrency: "GBP"
            },
            {
              name: "Digital Contracts",
              description: "Automated contract generation and e-signature collection",
              price: "0",
              priceCurrency: "GBP"
            },
            {
              name: "Maintenance Triage",
              description: "AI-powered maintenance ticket classification and routing",
              price: "0",
              priceCurrency: "GBP"
            }
          ]
        }}
      />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <TermFlowWordmark />
            <SiteSearch />
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href="/how-it-works" className="hidden md:inline text-base font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap" data-testid="link-how-it-works">
              How It Works
            </a>
            <a href="/contact" className="hidden lg:inline text-base font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap" data-testid="link-contact-us">
              Contact Us
            </a>
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

      {/* Animated Hero Section */}
      <AnimatedHero
        title={currentHero.title}
        tagline={currentHero.tagline}
        subtitle={currentHero.subtitle}
        primaryCTA={currentHero.primaryCTA}
        secondaryCTA={currentHero.secondaryCTA}
        primaryAction={currentHero.primaryAction}
        secondaryAction={currentHero.secondaryAction}
      />

      {/* Demo Video Section */}
      <div className="bg-gradient-to-b from-background to-muted/30 py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-video-heading">
              See TermFlow in Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch how AI automation transforms your entire lettings process in just 90 seconds
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div
              className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-tf-navy to-tf-navy-900 cursor-pointer hover-elevate group"
              onClick={() => setShowVideoModal(true)}
              data-testid="video-thumbnail"
            >
              {/* Video Thumbnail Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-tf-lime/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-10 h-10 text-tf-lime" />
                  </div>
                  <p className="text-white text-xl font-semibold">Watch Demo Video</p>
                  <p className="text-white/70 text-sm mt-2">See the complete platform walkthrough</p>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 bg-tf-lime/90 text-tf-navy px-3 py-1 rounded-full text-sm font-semibold">
                90 seconds
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button size="lg" variant="outline" onClick={() => setShowVideoModal(true)} data-testid="button-watch-video">
                <Video className="w-5 h-5 mr-2" />
                Watch Full Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-tf-navy" />
              TermFlow Platform Demo
            </DialogTitle>
            <DialogDescription>
              See how AI automation works for student lettings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-tf-navy/10 to-tf-lime/10 flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center p-8">
                <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Demo Video Coming Soon</h3>
                <p className="text-muted-foreground mb-6">
                  We're creating a comprehensive video walkthrough. In the meantime, book a live demo to see the platform in action.
                </p>
                <Button size="lg" asChild data-testid="button-modal-book-demo">
                  <a href="/book-demo">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Live Demo
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Portal Integration Section */}
      <div className="bg-gradient-to-b from-muted/50 to-background py-16 border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">We capture your leads and automate your lettings from</h3>
            <p className="text-sm text-muted-foreground">Major property portals & your direct channels</p>
          </div>
          
          {/* Portal Logos - Integrated Design */}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 mb-8">
            <OptimizedImage src={rightmoveLogo} alt="Rightmove property portal logo" width={150} height={40} className="h-10 w-auto object-contain" loading="lazy" data-testid="logo-rightmove" />
            <OptimizedImage src={zooplaLogo} alt="Zoopla property portal logo" width={120} height={32} className="h-8 w-auto object-contain" loading="lazy" data-testid="logo-zoopla" />
            <OptimizedImage src={openrentLogo} alt="OpenRent property portal logo" width={150} height={40} className="h-10 w-auto object-contain" loading="lazy" data-testid="logo-openrent" />
            <div className="text-xl font-black tracking-tight text-[#FF6B6B]" data-testid="logo-studentcom" aria-label="Student.com student accommodation portal integration">Student.com</div>
            <OptimizedImage src={accommodationLogo} alt="Accommodation for Students property portal logo" width={180} height={24} className="h-6 w-auto object-contain" loading="lazy" data-testid="logo-accommodation" />
            <div className="text-xl font-black tracking-tight text-[#FFBF00]" data-testid="logo-amber" aria-label="Amber student housing platform integration">amber</div>
            <OptimizedImage src={uniplacesLogo} alt="Uniplaces property portal logo" width={135} height={36} className="h-9 w-auto object-contain" loading="lazy" data-testid="logo-uniplaces" />
            <OptimizedImage src={myStudentHallsLogo} alt="My Student Halls property portal logo" width={120} height={32} className="h-8 w-auto object-contain" loading="lazy" data-testid="logo-mystudent" />
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">+ 100's more websites</span> <span className="text-foreground/80">via WhatsApp, Email & Web Forms</span>
            </p>
          </div>

          {/* Integration Flow Diagram */}
          <div className="mt-16" data-testid="diagram-integration-flow">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Seamless Integration with Leading Portals</h3>
              <p className="text-muted-foreground">Automated lead capture and multi-channel communication</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-5xl mx-auto">
              {/* Step 1: Student Portals */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex-1"
              >
                <Card className="p-6 text-center border-tf-navy/20">
                  <CardContent className="p-0">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-tf-navy/10 mb-3">
                        <Globe className="w-6 h-6 text-tf-navy" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Student Portals</h4>
                      <p className="text-sm text-muted-foreground">Rightmove, Zoopla, Student.com and more</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Arrow */}
              <div className="hidden md:block">
                <ArrowRight className="w-8 h-8 text-tf-lime" />
              </div>
              <div className="md:hidden">
                <ArrowRight className="w-8 h-8 text-tf-lime rotate-90" />
              </div>

              {/* Step 2: TermFlow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1"
              >
                <Card className="p-6 text-center border-tf-lime/40 bg-gradient-to-br from-tf-lime/10 to-tf-lime/5">
                  <CardContent className="p-0">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-tf-lime/20 mb-3">
                        <Sparkles className="w-6 h-6 text-tf-lime" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">TermFlow AI</h4>
                      <p className="text-sm text-muted-foreground">Intelligent automation & routing</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Arrow */}
              <div className="hidden md:block">
                <ArrowRight className="w-8 h-8 text-tf-lime" />
              </div>
              <div className="md:hidden">
                <ArrowRight className="w-8 h-8 text-tf-lime rotate-90" />
              </div>

              {/* Step 3: Communication Channels */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1"
              >
                <Card className="p-6 text-center border-tf-navy/20">
                  <CardContent className="p-0">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-tf-navy/10 mb-3">
                        <MessageCircle className="w-6 h-6 text-tf-navy" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Multi-Channel</h4>
                      <p className="text-sm text-muted-foreground">WhatsApp, Email, SMS & CRM</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* CTA for Impact Stats Section */}
          <div className="mt-12 text-center">
            <Button size="lg" variant="default" asChild data-testid="button-stats-cta">
              <a href="/pricing">
                <PoundSterling className="w-5 h-5 mr-2" />
                Calculate Your ROI
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Integrations Ecosystem Section */}
      <div className="bg-gradient-to-b from-background to-muted/30 py-20" data-testid="section-integrations-ecosystem">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-integrations-heading">Enterprise-Grade Integrations Ecosystem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              TermFlow connects seamlessly with the tools you already use to create a complete lettings automation platform
            </p>
          </div>

          {/* Communication & Messaging */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center" data-testid="text-category-communication">Communication & Messaging</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="hover-elevate h-full" data-testid="card-integration-whatsapp">
                  <CardHeader className="gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <OptimizedImage src={whatsappLogo} alt="WhatsApp integration logo" width={48} height={48} className="h-12 w-12 object-contain" loading="lazy" data-testid="icon-whatsapp" />
                        <div>
                          <CardTitle className="text-lg">WhatsApp</CardTitle>
                          <Badge variant="secondary" className="mt-1" data-testid="badge-whatsapp">API Integration</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      Instant messaging with students on their preferred platform, powered by Twilio's reliable infrastructure
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="hover-elevate h-full" data-testid="card-integration-email">
                  <CardHeader className="gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-12 w-12 text-primary" data-testid="icon-email" />
                        <div>
                          <CardTitle className="text-lg">Email</CardTitle>
                          <Badge variant="secondary" className="mt-1" data-testid="badge-email">SMTP/API</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      Automated email campaigns, responses, and notifications to keep students engaged throughout the journey
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="hover-elevate h-full" data-testid="card-integration-sms">
                  <CardHeader className="gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-12 w-12 text-primary" data-testid="icon-sms" />
                        <div>
                          <CardTitle className="text-lg">SMS</CardTitle>
                          <Badge variant="secondary" className="mt-1" data-testid="badge-sms">API Integration</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      Text message notifications and reminders for viewing confirmations, contract updates, and urgent alerts
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Payment, Telephony & Contracts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center" data-testid="text-category-payment-telephony">Payment, Telephony & Contracts</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="hover-elevate h-full" data-testid="card-integration-stripe">
                  <CardHeader className="gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <OptimizedImage src={stripeLogo} alt="Stripe integration logo" width={48} height={48} className="h-12 w-12 object-contain" loading="lazy" data-testid="icon-stripe" />
                        <div>
                          <CardTitle className="text-lg">Stripe</CardTitle>
                          <Badge variant="secondary" className="mt-1" data-testid="badge-stripe">API Integration</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      Secure deposit and rent collection with automated payment processing, refunds, and financial reporting
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="hover-elevate h-full" data-testid="card-integration-justcall">
                  <CardHeader className="gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <OptimizedImage src={justcallLogo} alt="JustCall integration logo" width={48} height={48} className="h-12 w-12 object-contain" loading="lazy" data-testid="icon-justcall" />
                        <div>
                          <CardTitle className="text-lg">JustCall</CardTitle>
                          <Badge variant="secondary" className="mt-1" data-testid="badge-justcall">API Integration</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      AI-powered call transcription and analytics to extract insights from every student conversation
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="hover-elevate h-full" data-testid="card-integration-docusign">
                  <CardHeader className="gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <OptimizedImage src={docusignLogo} alt="DocuSign integration logo" width={48} height={48} className="h-12 w-12 object-contain" loading="lazy" data-testid="icon-docusign" />
                        <div>
                          <CardTitle className="text-lg">DocuSign</CardTitle>
                          <Badge variant="secondary" className="mt-1" data-testid="badge-docusign">API Integration</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      Legally binding e-signatures for tenancy agreements with automated contract generation and signing workflows
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Productivity & Automation Tools */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center" data-testid="text-category-productivity">Productivity & Automation Tools</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="hover-elevate h-full" data-testid="card-integration-google-calendar">
                  <CardHeader className="gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <OptimizedImage src={googleCalendarLogo} alt="Google Calendar integration logo" width={48} height={48} className="h-12 w-12 object-contain" loading="lazy" data-testid="icon-google-calendar" />
                        <div>
                          <CardTitle className="text-lg">Google Calendar</CardTitle>
                          <Badge variant="secondary" className="mt-1" data-testid="badge-google-calendar">API Integration</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      Automated viewing scheduling synced with your team's availability, eliminating double bookings
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="hover-elevate h-full" data-testid="card-integration-google-sheets">
                  <CardHeader className="gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <OptimizedImage src={googleSheetsLogo} alt="Google Sheets integration logo" width={48} height={48} className="h-12 w-12 object-contain" loading="lazy" data-testid="icon-google-sheets" />
                        <div>
                          <CardTitle className="text-lg">Google Sheets</CardTitle>
                          <Badge variant="secondary" className="mt-1" data-testid="badge-google-sheets">API Integration</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      Seamless data import and export for bulk property updates and custom reporting workflows
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="hover-elevate h-full" data-testid="card-integration-n8n">
                  <CardHeader className="gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <OptimizedImage src={n8nLogo} alt="n8n integration logo" width={48} height={48} className="h-12 w-12 object-contain" loading="lazy" data-testid="icon-n8n" />
                        <div>
                          <CardTitle className="text-lg">n8n / Webhooks</CardTitle>
                          <Badge variant="secondary" className="mt-1" data-testid="badge-n8n">Webhook</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      Custom workflow automation and integrations with any third-party system via webhooks
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Need a custom integration? <span className="font-semibold text-foreground">Our API-first architecture makes it simple.</span>
            </p>
            <Button variant="outline" size="lg" asChild data-testid="button-view-integrations">
              <a href="/integrations">View All Integrations</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Brand Story Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 via-purple-500/5 to-background" data-testid="section-brand-story">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 text-white border-0" data-testid="badge-our-story">
              <Heart className="h-4 w-4 mr-2" />
              Our Story
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-brand-story-title">
              Why TermFlow Exists
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Story Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2" data-testid="text-problem-heading">
                  <TrendingUp className="h-5 w-5" />
                  The Problem We Saw
                </h3>
                <p className="text-foreground leading-relaxed" data-testid="text-problem-description">
                  PBSA operators were drowning in admin during clearing season. 400+ WhatsApp messages, 
                  200+ emails, back-to-back viewing requests—all in one week. Teams working 12-hour days 
                  just to keep up, yet still losing leads to faster competitors.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2" data-testid="text-insight-heading">
                  <Zap className="h-5 w-5" />
                  Our Insight
                </h3>
                <p className="text-foreground leading-relaxed" data-testid="text-insight-description">
                  Most student enquiries are repetitive and automatable: "Is the room still available?", "When can I view?", "What's included in rent?", 
                  "How do I pay my deposit?". The same questions. Every. Single. Day.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2" data-testid="text-solution-heading">
                  <CheckCircle className="h-5 w-5" />
                  Our Solution
                </h3>
                <p className="text-foreground leading-relaxed" data-testid="text-solution-description">
                  We built an AI that handles lettings 24/7—answering questions, booking viewings, verifying 
                  documents, and signing contracts automatically. Not a chatbot. A digital lettings team that 
                  never sleeps, speaks 25+ languages, and scales instantly during peak demand.
                </p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2" data-testid="text-mission-heading">
                  <Award className="h-5 w-5" />
                  Our Mission
                </h3>
                <p className="text-foreground leading-relaxed font-medium" data-testid="text-mission-description">
                  Make student accommodation operations effortless. No operator should waste time on repetitive 
                  admin when AI can do it better, faster, and at a fraction of the cost.
                </p>
              </div>
            </div>

            {/* Founder Quote Card */}
            <div>
              <Card className="border-2 border-primary/20 hover-elevate" data-testid="card-founder-quote">
                <CardContent className="pt-6">
                  <Quote className="h-10 w-10 text-primary/30 mb-4" />
                  <blockquote className="text-lg text-foreground leading-relaxed mb-6 italic" data-testid="text-founder-quote">
                    "I ran short-let businesses for years and built the AI that answered our guests, took payments and
                    booked our cleaners. Student lettings has the same problem at a bigger scale: hundreds of the
                    same questions every week, and a student who books with whoever replies first. TermFlow is
                    what I built to fix that."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-primary/20">
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">HB</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-foreground" data-testid="text-founder-name">Harry Beaumont</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-founder-title">Founder</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* Sticky How It Works Section */}
      <div id="how-it-works" data-testid="section-how-it-works">
        <StickyHowItWorks />
      </div>

      {/* Who It's For Section */}
      <div className="bg-muted/30 py-20" data-testid="section-who-its-for">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Who It's For</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for property professionals managing student accommodation at scale
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-pbsa-operators">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-lg bg-primary/10 w-fit">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">PBSA Operators</CardTitle>
                  <CardDescription className="text-base">
                    Managing 100-500+ beds across multiple properties. Automate repetitive tasks and scale operations without hiring more staff.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-accommodation-managers">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-lg bg-primary/10 w-fit">
                    <Home className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">Accommodation Managers</CardTitle>
                  <CardDescription className="text-base">
                    Running student halls or HMOs. Handle peak season enquiries without the stress. Respond instantly 24/7.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-letting-agents">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-lg bg-primary/10 w-fit">
                    <UserSearch className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">Letting Agents</CardTitle>
                  <CardDescription className="text-base">
                    Specialising in student sector rentals. Win more landlord instructions by demonstrating superior technology and faster lets.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="hover-elevate h-full" data-testid="card-property-developers">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-lg bg-primary/10 w-fit">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">Property Developers</CardTitle>
                  <CardDescription className="text-base">
                    Building or converting student housing. Pre-let units faster and demonstrate strong demand to investors with data.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>

          {/* CTA for Who It's For Section */}
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild data-testid="button-who-its-for-cta">
              <a href="/how-it-works">
                <Eye className="w-5 h-5 mr-2" />
                See How It Works
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* How It Works / Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four powerful features that automate your entire lettings process from first enquiry to signed contract
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="hover-elevate border-primary/30" data-testid="card-automated-conversations">
            <CardHeader>
              <Bot className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl mb-2">Automated Conversations</CardTitle>
              <CardDescription className="text-base">
                Instantly answer every enquiry from your property portal listings. Nurture leads, 
                answer common questions, and ensure you never miss an opportunity.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate border-primary/30" data-testid="card-smart-viewings">
            <CardHeader>
              <Video className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl mb-2">Smart Viewings Booker</CardTitle>
              <CardDescription className="text-base">
                Book viewings automatically based on your shared calendar availability. Video tours from 
                interactive floor plans, online calls, or in-person viewings. No more back-and-forth emails.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate border-primary/30" data-testid="card-digital-applications">
            <CardHeader>
              <FileCheck className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl mb-2">Digital Application Processing</CardTitle>
              <CardDescription className="text-base">
                Collect and manage tenant applications in a clean, simple dashboard. Chase references 
                and gather required documents without lifting a finger.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate border-primary/30" data-testid="card-contract-signing">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl mb-2">Automated Contract Signing</CardTitle>
              <CardDescription className="text-base">
                Once you approve an applicant, the system automatically sends the tenancy agreement 
                for a secure, legally-binding digital signature.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA for Features Section */}
        <div className="mt-12 text-center">
          <Button size="lg" variant="default" asChild data-testid="button-features-cta">
            <a href="/pricing">
              <TrendingUp className="w-5 h-5 mr-2" />
              View Pricing
            </a>
          </Button>
        </div>
      </div>

      {/* Enquiry Management & Student Analysis Section */}
      <div className="bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Never Lose Track of a Lead</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every enquiry is chased, progressed, and followed up automatically while building a complete picture of each student
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="hover-elevate" data-testid="card-enquiry-tracking">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl mb-2">Automated Follow-ups</CardTitle>
                <CardDescription className="text-base">
                  Every enquiry is automatically chased and progressed through your pipeline. 
                  No lead falls through the cracks.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-student-profiling">
              <CardHeader>
                <UserSearch className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl mb-2">Student Profiling</CardTitle>
                <CardDescription className="text-base">
                  Build a complete picture with dozens of traits and data points - budget, preferences, 
                  move-in date, course details, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-analytics">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl mb-2">Powerful Analytics</CardTitle>
                <CardDescription className="text-base">
                  Deep insights from every interaction help you understand your market and optimise 
                  your lettings strategy.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section with JSON-LD Schema */}
      <div className="bg-muted/30 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <FAQ 
            items={faqItems}
            title="Frequently Asked Questions About AI Lettings Automation"
            description="Everything you need to know about automating your student lettings with TermFlow"
          />
        </div>
      </div>

      {/* Final CTA Section - Merged */}
      <div className="bg-gradient-to-b from-muted/30 to-primary/5 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-cta-title">
            Ready to automate your lettings?
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8" data-testid="text-cta-description">
            Your digital lettings team is ready to work 24/7. Handle every enquiry, booking, and contract 
            automatically while you stay in complete control.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild data-testid="button-cta-trial" className="text-lg px-8 py-6">
              <a href="/login">
                Start 14-Day Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-cta-demo" className="text-lg px-8 py-6">
              <a href="/book-demo">Book a Demo</a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • 14-day free trial
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Sticky CTA Bar - Shows after user scrolls 800px */}
      <StickyCTA
        text="Ready to automate your student lettings?"
        ctaText="Start 14-Day Free Trial"
        ctaLink="/api/login"
        showAfterScroll={800}
        dismissible={true}
      />

      {/* Back to Top Button */}
      <BackToTop />

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA />
    </div>
  );
}
