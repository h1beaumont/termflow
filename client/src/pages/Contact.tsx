import { SEOHead } from "@/components/SEOHead";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactModal } from "@/components/ContactModal";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, MessageCircle, Calendar } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-tf-bg flex flex-col">
      <SEOHead
        title="Contact Us - TermFlow"
        description="Get in touch with TermFlow. Book a demo, ask questions, or learn how we can automate your student accommodation lettings."
        keywords="contact termflow, student accommodation support, PBSA lettings help"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <a href="/" data-testid="link-home">
            <TermFlowWordmark />
          </a>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href="/how-it-works" className="hidden md:inline text-base font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap" data-testid="link-how-it-works">
              How It Works
            </a>
            <Button variant="default" size="sm" asChild data-testid="link-demo" className="text-sm sm:text-base px-3 sm:px-4 bg-tf-lime text-tf-navy hover:bg-tf-lime/90 border-0 font-bold shadow-sm">
              <a href="/book-demo" className="whitespace-nowrap">
                <span className="hidden xs:inline">Book </span>Demo
              </a>
            </Button>
            <a href="/pricing" className="hidden sm:inline text-base font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap" data-testid="link-pricing">
              Pricing
            </a>
            <Button variant="default" size="sm" asChild data-testid="button-login" className="text-sm sm:text-base px-3 sm:px-4">
              <a href="/api/login" className="whitespace-nowrap">
                Sign in
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-tf-navy to-tf-navy-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-contact-heading">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-300">
              We're here to help automate your student accommodation lettings
            </p>
          </div>
        </div>

        {/* Contact Options */}
        <div className="max-w-6xl mx-auto px-6 -mt-12 mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Email Card */}
            <Card className="hover-elevate" data-testid="card-contact-email">
              <CardHeader>
                <div className="p-3 rounded-md bg-primary/10 w-fit mb-2">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email Us</CardTitle>
                <CardDescription>
                  Send us a message anytime
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="mailto:sales@termflow.ai" 
                  className="text-primary hover:underline font-medium"
                  data-testid="link-email-sales"
                >
                  sales@termflow.ai
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  We typically respond within 24 hours
                </p>
              </CardContent>
            </Card>

            {/* Book Demo Card */}
            <Card className="hover-elevate" data-testid="card-contact-demo">
              <CardHeader>
                <div className="p-3 rounded-md bg-primary/10 w-fit mb-2">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Book a Demo</CardTitle>
                <CardDescription>
                  See TermFlow in action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-tf-lime text-tf-navy hover:bg-tf-lime/90" data-testid="button-book-demo-card">
                  <a href="/book-demo">Schedule Now</a>
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  15-minute personalized walkthrough
                </p>
              </CardContent>
            </Card>

            {/* Live Chat Card */}
            <Card className="hover-elevate" data-testid="card-contact-chat">
              <CardHeader>
                <div className="p-3 rounded-md bg-primary/10 w-fit mb-2">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Try AI Demo</CardTitle>
                <CardDescription>
                  Chat with our AI assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full" data-testid="button-try-demo-card">
                  <a href="/demo">Start Demo</a>
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Experience automation firsthand
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-muted/30 py-16">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4" data-testid="text-contact-form-heading">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground">
                Fill out the form and we'll get back to you within 24 hours
              </p>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <Button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full bg-tf-lime text-tf-navy hover:bg-tf-lime/90"
                  data-testid="button-open-contact-form"
                >
                  Open Contact Form
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Office Location */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8" data-testid="text-office-heading">
              Our Office
            </h2>
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div className="text-left">
                    <p className="font-semibold" data-testid="text-office-location">London, United Kingdom</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      UK & EU Data Residency
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Contact Modal */}
      <ContactModal open={isContactModalOpen} onOpenChange={setIsContactModalOpen} />
    </div>
  );
}
