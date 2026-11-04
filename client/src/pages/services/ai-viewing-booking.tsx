import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  Globe, 
  Bell, 
  BarChart3,
  Zap,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Users
} from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { SoftwareApplicationSchema } from "@/components/SoftwareApplicationSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { ServiceSchema } from "@/components/ServiceSchema";
import { Footer } from "@/components/Footer";
import { FAQ, FAQItem } from "@/components/FAQ";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { Link } from "wouter";

export default function AIViewingBooking() {
  const faqs: FAQItem[] = [
    {
      question: "How does AI viewing booking work with WhatsApp?",
      answer: "Students message your property via WhatsApp, and our AI assistant (Ava) instantly responds with available viewing slots based on your calendar. Students can book directly in the conversation—no apps, no back-and-forth emails."
    },
    {
      question: "Can the system handle different timezones for international students?",
      answer: "Yes! The system automatically detects the student's timezone and displays viewing slots in their local time, while booking them correctly in your timezone. This eliminates confusion for international students booking from overseas."
    },
    {
      question: "What happens if a student doesn't show up for a viewing?",
      answer: "The system tracks no-shows automatically and can send a follow-up message asking if they'd like to reschedule. You get analytics on no-show rates and can see patterns to improve your viewing process."
    },
    {
      question: "Does this integrate with my existing Google Calendar?",
      answer: "Absolutely. TermFlow syncs two-way with Google Calendar, so your existing appointments block out viewing slots automatically, and all student viewings appear in your calendar instantly."
    },
    {
      question: "How are reminders sent to students?",
      answer: "Automated reminders are sent via WhatsApp, SMS, or email (your choice) at 24 hours and 2 hours before the viewing. This reduces no-shows by up to 60% compared to no reminders."
    },
    {
      question: "Can I still manually control my availability?",
      answer: "Yes! You set your weekly availability, break times, and can block out specific dates. The AI only suggests slots within your configured availability windows."
    }
  ];

  return (
    <>
      <SoftwareApplicationSchema />
      
      <SEOHead
        title="AI Viewing Booking Automation for PBSA | TermFlow"
        description="Automate student accommodation viewings with AI-powered booking. 24/7 scheduling, timezone handling, WhatsApp confirmations, and automated reminders for PBSA operators."
        keywords="student viewing booking, PBSA viewing automation, property tour scheduling, automated property viewings, student accommodation viewings, viewing management software"
        canonical="https://termflow.co.uk/ai-viewing-booking"
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://termflow.co.uk/" },
          { name: "Services", url: "https://termflow.co.uk/services" },
          { name: "AI Viewing Booking", url: "https://termflow.co.uk/ai-viewing-booking" }
        ]}
      />

      <ServiceSchema
        name="AI Viewing Booking Automation"
        description="Automate student accommodation viewings with AI-powered booking, timezone handling, and automated reminders"
        provider={{ name: "TermFlow", url: "https://termflow.co.uk" }}
        areaServed="United Kingdom"
        serviceType="Software as a Service"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#14213D] via-[#1B2B52] to-[#0E1A31] text-white py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(158,240,26,0.1),transparent_50%)]" />
          
          <div className="container max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge className="mb-6 bg-[#9EF01A] text-[#14213D] hover:bg-[#9EF01A]/90" data-testid="badge-service-category">
                Viewing Automation
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight" data-testid="heading-hero">
                Never Miss a Viewing Again
              </h1>
              
              <p className="text-xl md:text-2xl mb-4 text-white/90" data-testid="text-hero-subheadline">
                AI-Powered Viewing Management for Student Accommodation
              </p>
              
              <div className="flex flex-wrap gap-6 justify-center mb-10 text-lg">
                <div className="flex items-center gap-2" data-testid="feature-247">
                  <Clock className="w-5 h-5 text-[#9EF01A]" />
                  <span>24/7 Booking</span>
                </div>
                <div className="flex items-center gap-2" data-testid="feature-instant">
                  <Zap className="w-5 h-5 text-[#9EF01A]" />
                  <span>Instant Confirmations</span>
                </div>
                <div className="flex items-center gap-2" data-testid="feature-reminders">
                  <Bell className="w-5 h-5 text-[#9EF01A]" />
                  <span>Automated Reminders</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book-demo">
                  <Button 
                    size="lg" 
                    className="bg-[#9EF01A] text-[#14213D] hover:bg-[#9EF01A]/90 font-semibold text-lg px-8"
                    data-testid="button-hero-demo"
                  >
                    Book a Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 text-lg px-8 backdrop-blur-sm"
                    data-testid="button-hero-learn"
                  >
                    See How It Works
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-background">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-problems">
                The Viewing Scheduling Nightmare
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                PBSA operators lose hours every week to viewing coordination—and still miss bookings
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  title: "Endless Back-and-Forth",
                  description: "Students message at 2am asking for viewings. You respond at 9am. They've booked elsewhere by then.",
                  icon: MessageSquare
                },
                {
                  title: "Timezone Confusion",
                  description: "International students booking from Asia get the times wrong. Double-bookings or no-shows.",
                  icon: Globe
                },
                {
                  title: "No-Show Chaos",
                  description: "Students forget viewings without reminders. Your staff waits around for ghosts.",
                  icon: Users
                },
                {
                  title: "Admin Time Sink",
                  description: "Staff spend 10+ hours/week just coordinating viewing schedules instead of closing deals.",
                  icon: Clock
                },
                {
                  title: "Clearing Period Overload",
                  description: "100+ viewing requests in one week. Your team drowns. Enquiries slip through the cracks.",
                  icon: TrendingUp
                },
                {
                  title: "Lost Follow-Ups",
                  description: "Student viewed but didn't apply? No system to follow up automatically. Revenue lost.",
                  icon: BarChart3
                }
              ].map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover-elevate" data-testid={`card-problem-${index}`}>
                    <CardHeader>
                      <problem.icon className="w-10 h-10 text-[#FF595E] mb-3" />
                      <CardTitle className="text-xl">{problem.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{problem.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution/Features Section */}
        <section className="py-20 bg-slate-50">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-[#9EF01A]/10 text-[#14213D] border-[#9EF01A]" data-testid="badge-solution">
                The Solution
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-solution">
                AI That Books Viewings While You Sleep
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                TermFlow handles every viewing from first contact to post-viewing follow-up—automatically
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: MessageSquare,
                  title: "24/7 Automated Booking",
                  description: "Students book viewings via WhatsApp, Email, or Web—instantly. AI responds in 25+ languages, suggests available slots, and confirms bookings without human intervention."
                },
                {
                  icon: Globe,
                  title: "Intelligent Timezone Handling",
                  description: "Automatically detects student timezone and displays slots in their local time. No more 'I thought it was 3pm UK time' confusion."
                },
                {
                  icon: Bell,
                  title: "Automated Reminders",
                  description: "24-hour and 2-hour reminders sent via WhatsApp/SMS. Reduce no-shows by 60%. Students can reschedule in one tap."
                },
                {
                  icon: BarChart3,
                  title: "Post-Viewing Follow-Ups",
                  description: "Didn't apply after viewing? AI sends personalized follow-up asking about concerns, offers alternative rooms, nudges toward application."
                },
                {
                  icon: Calendar,
                  title: "Google Calendar Integration",
                  description: "Two-way sync with your existing calendar. Your meetings block out viewing slots. All viewings appear in your calendar instantly."
                },
                {
                  icon: TrendingUp,
                  title: "No-Show Tracking & Analytics",
                  description: "See no-show rates, peak booking times, conversion from viewing to application. Optimize your viewing process with data."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full" data-testid={`card-feature-${index}`}>
                    <CardHeader>
                      <feature.icon className="w-12 h-12 text-[#9EF01A] mb-3" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-lg">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-background">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-how-it-works">
                How It Works (The Student Journey)
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From first message to viewing completion—fully automated
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  step: 1,
                  title: "Student Requests Viewing",
                  description: "Student messages via WhatsApp: 'Can I see the ensuite room?' AI detects language, confirms property details, asks for preferred dates."
                },
                {
                  step: 2,
                  title: "AI Suggests Available Slots",
                  description: "Based on your calendar, AI offers 3-5 available slots in student's timezone: 'I have Tuesday 2pm, Wednesday 11am, or Thursday 4pm—which works?'"
                },
                {
                  step: 3,
                  title: "Auto-Books & Sends Confirmations",
                  description: "Student picks a slot. AI books it instantly, sends confirmation with viewing address, staff contact, and calendar invite. Syncs to your Google Calendar."
                },
                {
                  step: 4,
                  title: "Sends Reminders",
                  description: "24 hours before: 'Your viewing is tomorrow at 2pm.' 2 hours before: 'Your viewing is in 2 hours. See you soon!' Includes easy reschedule button."
                },
                {
                  step: 5,
                  title: "Post-Viewing Follow-Up",
                  description: "If student doesn't apply within 48 hours: 'Did you have any concerns? We have other rooms available.' Automatic nudges increase conversion by 35%."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6"
                  data-testid={`step-${step.step}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#9EF01A] text-[#14213D] flex items-center justify-center font-bold text-xl">
                      {step.step}
                    </div>
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-lg">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-slate-50">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-benefits">
                The Impact on Your Operations
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Real results from PBSA operators using TermFlow
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                {
                  metric: "12 hours/week",
                  description: "Saved on admin coordination",
                  icon: Clock
                },
                {
                  metric: "60% reduction",
                  description: "In viewing no-shows",
                  icon: TrendingUp
                },
                {
                  metric: "35% increase",
                  description: "Viewing → application conversion",
                  icon: BarChart3
                },
                {
                  metric: "150+ viewings",
                  description: "Handled during Clearing week",
                  icon: Users
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center h-full hover-elevate" data-testid={`card-benefit-${index}`}>
                    <CardHeader>
                      <benefit.icon className="w-12 h-12 text-[#9EF01A] mx-auto mb-4" />
                      <CardTitle className="text-3xl font-bold text-[#14213D]">{benefit.metric}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-lg">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Study/Testimonial */}
        <section className="py-20 bg-background">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-[#9EF01A]/20" data-testid="card-case-study">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#14213D] to-[#1B2B52] flex items-center justify-center text-white font-bold text-2xl">
                        SM
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-[#9EF01A] text-[#9EF01A]" />
                        ))}
                      </div>
                      <CardTitle className="text-2xl mb-2">280 beds, Newcastle</CardTitle>
                      <p className="text-muted-foreground">Sarah Mitchell, Operations Director</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-xl leading-relaxed text-foreground border-l-4 border-[#9EF01A] pl-6 italic">
                    "During Clearing week, we had 150+ viewing requests in 5 days. TermFlow's AI handled every single one—booking slots, sending confirmations, and reminders—all while we focused on showing properties and closing deals. Zero missed appointments, zero double-bookings. We couldn't have managed Clearing without it."
                  </blockquote>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Badge variant="secondary" data-testid="badge-metric-viewings">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      150 viewings in 5 days
                    </Badge>
                    <Badge variant="secondary" data-testid="badge-metric-automation">
                      <Zap className="w-4 h-4 mr-1" />
                      100% automated booking
                    </Badge>
                    <Badge variant="secondary" data-testid="badge-metric-accuracy">
                      <Shield className="w-4 h-4 mr-1" />
                      Zero double-bookings
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#14213D] via-[#1B2B52] to-[#0E1A31] text-white">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6" data-testid="heading-cta">
                Ready to Automate Your Viewings?
              </h2>
              <p className="text-xl mb-10 text-white/90">
                See how TermFlow can handle 100+ viewings per week with zero admin overhead
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book-demo">
                  <Button 
                    size="lg" 
                    className="bg-[#9EF01A] text-[#14213D] hover:bg-[#9EF01A]/90 font-semibold text-lg px-10"
                    data-testid="button-cta-demo"
                  >
                    Book a Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 text-lg px-10 backdrop-blur-sm"
                    data-testid="button-cta-pricing"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-20 bg-background">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-related">
                Related Services
              </h2>
              <p className="text-xl text-muted-foreground">
                Complete your PBSA automation stack
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link href="/digital-contracts">
                <Card className="h-full hover-elevate cursor-pointer" data-testid="card-related-contracts">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      Digital Contracts & E-Signatures
                      <ArrowRight className="w-5 h-5 text-[#9EF01A]" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg mb-4">
                      Sign tenancy agreements in minutes with automated Right-to-Rent checks and deposit protection integration.
                    </p>
                    <Badge className="bg-[#9EF01A]/10 text-[#14213D]">After Viewing</Badge>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/how-it-works">
                <Card className="h-full hover-elevate cursor-pointer" data-testid="card-related-platform">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      Complete Platform Overview
                      <ArrowRight className="w-5 h-5 text-[#9EF01A]" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg mb-4">
                      See how viewing automation fits into the complete student lettings workflow from enquiry to move-in.
                    </p>
                    <Badge className="bg-[#9EF01A]/10 text-[#14213D]">Full Journey</Badge>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-50">
          <div className="container max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-faq">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about AI viewing booking
              </p>
            </motion.div>

            <FAQ items={faqs} />
          </div>
        </section>

        <Footer />
        <MobileStickyCTA />
      </div>
    </>
  );
}
