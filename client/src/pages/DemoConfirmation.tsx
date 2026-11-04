import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, MessageSquare, FileText, BarChart3, Mail, Gift, Share2, BookOpen, Calculator } from "lucide-react";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SEOHead } from "@/components/SEOHead";
import { TestimonialWithSchema, TestimonialData } from "@/components/TestimonialWithSchema";
import headshot1 from "@assets/stock_images/professional_busines_82a17483.jpg";
import headshot2 from "@assets/stock_images/professional_busines_4a59ef67.jpg";
import sarahHeadshot from "@assets/stock_images/friendly_young_woman_6ba1b3c2.jpg";

export default function DemoConfirmation() {
  const testimonials: TestimonialData[] = [
    {
      name: "Sarah Mitchell",
      role: "Operations Director",
      company: "StudentStay Newcastle",
      avatar: sarahHeadshot,
      avatarFallback: "SM",
      rating: 5,
      text: "During clearing period, we had 400+ enquiries in one week. TermFlow handled every single one while we slept.",
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
      text: "International students love the instant WhatsApp responses in multiple languages. No more timezone issues.",
      portfolioSize: "150 beds",
      location: "London",
      date: "2024-08-22"
    }
  ];

  const demoTopics = [
    {
      icon: MessageSquare,
      title: "AI Assistant Demo",
      description: "See Ava handle real student enquiries in multiple languages"
    },
    {
      icon: Calendar,
      title: "Smart Booking Flow",
      description: "Watch how viewings get booked automatically 24/7"
    },
    {
      icon: FileText,
      title: "Digital Contracts",
      description: "E-signature and deposit protection in action"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Live metrics and conversion tracking walkthrough"
    }
  ];

  const resources = [
    {
      icon: Calculator,
      title: "ROI Calculator",
      description: "Calculate your potential savings",
      href: "/roi-calculator"
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Learn about PBSA automation",
      href: "/knowledge-base"
    },
    {
      icon: FileText,
      title: "Blog",
      description: "Industry insights and tips",
      href: "/blog"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-tf-navy/5 via-background to-tf-lime/5">
      <SEOHead
        title="Demo Booked - TermFlow"
        description="Your TermFlow demo has been confirmed. Check your email for calendar invite and next steps."
        canonical="https://termflow.co.uk/book-demo/confirmation"
        ogUrl="https://termflow.co.uk/book-demo/confirmation"
      />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-lime" />
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <TermFlowWordmark />
          <Button variant="ghost" size="sm" asChild data-testid="link-home">
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" data-testid="text-confirmation-title">
            Demo Booked Successfully! 🎉
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Check your email for the calendar invite and meeting details. We're excited to show you how TermFlow can transform your lettings process.
          </p>
          <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm">
            <Mail className="w-4 h-4" />
            Calendar invite sent to your email
          </Badge>
        </div>

        {/* What to Expect */}
        <Card className="mb-8" data-testid="card-what-to-expect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-tf-navy" />
              What to Expect in Your 15-Minute Demo
            </CardTitle>
            <CardDescription>
              We'll walk you through the complete platform tailored to your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {demoTopics.map((topic, index) => {
                const Icon = topic.icon;
                return (
                  <div key={index} className="flex gap-3 p-4 rounded-lg bg-muted/30 hover-elevate">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-tf-navy to-tf-navy-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">{topic.title}</div>
                      <div className="text-sm text-muted-foreground">{topic.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Referral CTA */}
        <Card className="mb-8 bg-gradient-to-br from-tf-lime/10 to-tf-navy/10 border-2 border-tf-lime/30" data-testid="card-referral">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-tf-navy" />
              Know Another Operator?
            </CardTitle>
            <CardDescription>
              Refer them to TermFlow and get £50 credit when they sign up
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Help other PBSA operators save time with AI automation. You'll both get £50 credit.
                </p>
              </div>
              <Button variant="default" asChild data-testid="button-refer">
                <a href="/contact?subject=referral">
                  <Share2 className="w-4 h-4 mr-2" />
                  Refer Now
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="mb-8" data-testid="card-resources">
          <CardHeader>
            <CardTitle>Explore While You Wait</CardTitle>
            <CardDescription>
              Learn more about PBSA automation and calculate your potential ROI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <a
                    key={index}
                    href={resource.href}
                    className="flex flex-col gap-3 p-4 rounded-lg bg-muted/30 hover-elevate transition-all"
                    data-testid={`link-resource-${index}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-tf-navy to-tf-navy-700 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">{resource.title}</div>
                      <div className="text-sm text-muted-foreground">{resource.description}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">What Operators Are Saying</h2>
            <p className="text-muted-foreground">Thanks for your interest in TermFlow</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <TestimonialWithSchema key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Additional CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Have questions before the demo?
          </p>
          <Button variant="outline" asChild data-testid="button-contact">
            <a href="/contact">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Us
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
