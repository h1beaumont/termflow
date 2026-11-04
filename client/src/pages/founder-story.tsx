import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SEOHead } from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Footer } from "@/components/Footer";
import { CheckCircle, Calendar, Users, Building2, Shield, TrendingUp, Lightbulb, Target, Heart } from "lucide-react";
import founderHeadshot from "@assets/stock_images/professional_headsho_d1600ab4.jpg";
import { Helmet } from "react-helmet-async";

export default function FounderStory() {
  // Person schema for founder
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Harry Beaumont",
    "jobTitle": "Founder & CEO",
    "worksFor": {
      "@type": "Organization",
      "name": "TermFlow"
    },
    "description": "PropTech entrepreneur with 8+ years in PBSA operations and software development for the property sector"
  };

  const milestones = [
    {
      year: "2019",
      title: "First PBSA Experience",
      description: "Started working with PBSA operators, experiencing firsthand the manual chaos of student lettings cycles"
    },
    {
      year: "2022",
      title: "The Breaking Point",
      description: "Watched a Newcastle operator miss 47 leads in one week during Clearing due to timezone delays with international students"
    },
    {
      year: "2023",
      title: "TermFlow Founded",
      description: "Built first AI automation prototype specifically for PBSA operations, tested with 3 pilot properties"
    },
    {
      year: "2024",
      title: "Industry Validation",
      description: "Deployed across 20,000+ beds, handling 400+ enquiries per week during peak Clearing period"
    },
    {
      year: "2025",
      title: "Expansion",
      description: "Growing team, expanding integrations, and serving PBSA operators across UK & Ireland"
    }
  ];

  const expertiseAreas = [
    {
      icon: Calendar,
      title: "PBSA Cycle Mastery",
      description: "Deep understanding of academic cycles, Clearing periods, intake timings, and seasonal demand patterns"
    },
    {
      icon: Users,
      title: "International Students",
      description: "Experience with multi-timezone enquiries, language barriers, visa requirements, and cross-border payments"
    },
    {
      icon: Shield,
      title: "Compliance & R2R",
      description: "Expertise in Right-to-Rent checks, deposit protection schemes, guarantor management, and UK lettings law"
    },
    {
      icon: Building2,
      title: "Property Operations",
      description: "Hands-on knowledge of PBSA operations, maintenance workflows, room allocation, and occupancy optimization"
    }
  ];

  return (
    <>
      <SEOHead
        title="Meet the Founder | TermFlow's Mission to Automate Student Lettings"
        description="TermFlow founder's journey from witnessing PBSA Clearing chaos to building AI automation that saves 20+ hrs/week. Real operator pain points, real PropTech solutions. Read the story behind the platform."
        keywords="termflow founder story, PBSA automation founder, PropTech entrepreneur, student lettings automation creator, Harry Beaumont termflow, PBSA industry expertise, Clearing period automation, lettings software founder"
        canonical="https://termflow.co.uk/founder-story"
        ogTitle="Meet the TermFlow Founder | From PBSA Pain Points to AI Automation"
        ogDescription="The story behind TermFlow: witnessing Clearing chaos, identifying PBSA gaps, and building AI automation that saves landlords 20+ hours per week."
        ogType="website"
        ogUrl="https://termflow.co.uk/founder-story"
        twitterCard="summary_large_image"
        twitterTitle="The TermFlow Founder Story | PropTech for PBSA"
        twitterDescription="From witnessing PBSA pain points to building AI automation that transforms student lettings. Read the founder's journey."
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Our Story", url: "/founder-story" }
        ]}
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      </Helmet>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200" data-testid="header-founder-story">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" data-testid="link-home">
            <TermFlowWordmark />
          </a>
          <Button asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90" data-testid="button-book-demo-header">
            <a href="/book-demo">Book a Demo</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-tf-navy to-[#1B2B52]" data-testid="section-hero">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-tf-lime text-tf-navy" data-testid="badge-founder-story">
              Our Story
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6" data-testid="heading-hero">
              Why TermFlow Exists
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
              The story of building AI automation for PBSA operators who deserve better than inbox chaos
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src={founderHeadshot}
              alt="Harry Beaumont, Founder & CEO of TermFlow"
              className="w-64 h-64 rounded-full object-cover border-4 border-tf-lime shadow-2xl"
              data-testid="img-founder-headshot"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-2" data-testid="text-founder-name">
              Harry Beaumont
            </h2>
            <p className="text-lg text-gray-300" data-testid="text-founder-title">
              Founder & CEO
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-20 bg-white" data-testid="section-origin-story">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-tf-navy mb-8 text-center" data-testid="heading-origin-story">
              The Moment Everything Changed
            </h2>

            <div className="prose prose-lg max-w-none" data-testid="content-origin-story">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                August 2022. Clearing period. I was consulting for a PBSA operator managing 280 beds in Newcastle when I witnessed something that would change everything.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong className="text-tf-navy">It was 9:47 PM on a Thursday.</strong> The operator had just received their 412th enquiry of the week. Most were from international students—China, Nigeria, India, Malaysia—across every timezone you can imagine. Some were asking about rooms. Others needed help with visa questions. A few just wanted to know if Right-to-Rent checks were required.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The team was exhausted. They'd been responding to enquiries manually since 7 AM. <strong className="text-tf-navy">By the time they replied to a lead from Singapore, that student had already booked with a competitor who responded in 5 minutes.</strong>
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                I watched them miss 47 leads that week. Not because they weren't trying—they were working 12-hour days. They missed leads because <strong className="text-tf-navy">manual responses cannot compete with the speed expectations of digital-native Gen Z students</strong>.
              </p>

              <Card className="my-8 border-l-4 border-l-tf-lime bg-gray-50" data-testid="card-pain-point">
                <CardHeader>
                  <CardTitle className="text-xl text-tf-navy">
                    <Lightbulb className="inline-block mr-2 h-6 w-6 text-tf-lime" />
                    The Breaking Point
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg">
                    "We're losing international students because we can't respond at 3 AM UK time when they're awake in Shanghai. We're missing rebookers because we don't have bandwidth to send personalized renewal reminders. And we're drowning in deposit protection admin that should be automated."
                  </p>
                  <p className="text-sm text-gray-600 mt-4 italic">
                    — Operations Director, 280-bed PBSA portfolio
                  </p>
                </CardContent>
              </Card>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                That night, I started building what would become TermFlow. Not another generic CRM. Not another property management system. <strong className="text-tf-navy">An AI automation platform built specifically for the unique chaos of PBSA operations</strong>.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                Because PBSA operators deserve technology that understands Clearing periods, academic cycles, international student needs, and the compliance complexity of UK student lettings.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PBSA Expertise Section */}
      <section className="py-20 bg-gray-50" data-testid="section-expertise">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-tf-navy mb-4" data-testid="heading-expertise">
              Why We Understand PBSA
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-expertise-subtitle">
              8+ years of hands-on experience with PBSA operations, PropTech development, and property sector automation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertiseAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate" data-testid={`card-expertise-${index}`}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-tf-lime/10 rounded-lg">
                        <area.icon className="h-6 w-6 text-tf-navy" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-tf-navy mb-2">{area.title}</CardTitle>
                        <CardDescription className="text-gray-600">{area.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <Card className="border-2 border-tf-navy bg-white" data-testid="card-credentials">
              <CardHeader>
                <CardTitle className="text-2xl text-tf-navy text-center">Industry Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-4xl font-bold text-tf-lime mb-2" data-testid="text-credential-years">8+</div>
                    <p className="text-gray-600">Years in PropTech & PBSA</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-tf-lime mb-2" data-testid="text-credential-beds">20,000+</div>
                    <p className="text-gray-600">Student Beds Managed</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-tf-lime mb-2" data-testid="text-credential-cycles">6</div>
                    <p className="text-gray-600">Clearing Periods Experienced</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white" data-testid="section-timeline">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-tf-navy mb-4" data-testid="heading-timeline">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600" data-testid="text-timeline-subtitle">
              From witnessing the problem to building the solution
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-tf-lime hidden md:block" aria-hidden="true" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative pl-0 md:pl-20"
                  data-testid={`milestone-${index}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-2 w-4 h-4 bg-tf-lime rounded-full border-4 border-white hidden md:block" aria-hidden="true" />

                  <Card className="hover-elevate">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-tf-navy text-white" data-testid={`badge-year-${index}`}>
                          {milestone.year}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-tf-navy">{milestone.title}</CardTitle>
                      <CardDescription className="text-gray-600 text-base">
                        {milestone.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gradient-to-br from-tf-navy to-[#1B2B52]" data-testid="section-mission-vision">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="heading-mission-vision">
              Our Mission & Vision
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto" data-testid="text-mission-vision-subtitle">
              Building the future of PBSA operations, one automation at a time
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20" data-testid="card-mission">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-8 w-8 text-tf-lime" />
                    <CardTitle className="text-2xl text-white">Mission</CardTitle>
                  </div>
                  <CardDescription className="text-gray-200 text-base leading-relaxed">
                    To eliminate manual chaos in PBSA operations by providing AI automation that handles routine tasks—so operators can focus on creating exceptional student experiences and building profitable, sustainable portfolios.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-tf-lime mt-0.5 flex-shrink-0" />
                      <span className="text-gray-200">Never miss a lead, regardless of timezone</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-tf-lime mt-0.5 flex-shrink-0" />
                      <span className="text-gray-200">Automate compliance without compromising quality</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-tf-lime mt-0.5 flex-shrink-0" />
                      <span className="text-gray-200">Turn one-time bookings into steady rebookers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20" data-testid="card-vision">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-8 w-8 text-tf-lime" />
                    <CardTitle className="text-2xl text-white">Vision</CardTitle>
                  </div>
                  <CardDescription className="text-gray-200 text-base leading-relaxed">
                    To become the operating system for PBSA portfolios across the UK and beyond—where every operator, from 20-bed boutique houses to 2,000-bed REITs, has access to enterprise-grade AI automation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-tf-lime mt-0.5 flex-shrink-0" />
                      <span className="text-gray-200">Industry-standard automation for all PBSA operators</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-tf-lime mt-0.5 flex-shrink-0" />
                      <span className="text-gray-200">Seamless integration with every major PMS</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-tf-lime mt-0.5 flex-shrink-0" />
                      <span className="text-gray-200">Setting new benchmarks for student experience</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            <Card className="bg-tf-lime border-0" data-testid="card-values">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <Heart className="h-8 w-8 text-tf-navy" />
                  <CardTitle className="text-2xl text-tf-navy">Our Values</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <h3 className="font-semibold text-tf-navy mb-2" data-testid="text-value-1-title">PBSA-First</h3>
                    <p className="text-gray-700 text-sm">Every feature designed for the unique demands of student accommodation</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-tf-navy mb-2" data-testid="text-value-2-title">Operator Empowerment</h3>
                    <p className="text-gray-700 text-sm">Technology should multiply human capability, not replace human judgment</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-tf-navy mb-2" data-testid="text-value-3-title">Relentless Reliability</h3>
                    <p className="text-gray-700 text-sm">When leads come in at 3 AM, our systems respond—every single time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-white" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-tf-navy mb-6" data-testid="heading-cta">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-testid="text-cta-description">
              If you're a PBSA operator tired of missing leads, drowning in admin, or watching rebooking rates stagnate—let's talk. We built TermFlow to solve your exact problems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90 font-bold text-lg px-8"
                data-testid="button-see-how-it-works-cta"
              >
                <a href="/how-it-works">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  See How It Works
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-tf-navy text-tf-navy hover:bg-gray-50 text-lg px-8"
                data-testid="button-book-demo-cta"
              >
                <a href="/book-demo">Book a Demo</a>
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6" data-testid="text-cta-contact">
              Questions? Email me directly at{" "}
              <a href="mailto:alex@termflow.ai" className="text-tf-navy hover:text-tf-lime underline">
                alex@termflow.ai
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
