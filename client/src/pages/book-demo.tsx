import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Calendar, Mail, Video, ArrowDown, Sparkles, Clock, Shield } from "lucide-react";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SEOHead } from "@/components/SEOHead";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { EventSchema } from "@/components/EventSchema";
import { Footer } from "@/components/Footer";
import { FAQ, FAQItem } from "@/components/FAQ";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Form schema - 6 required fields + 1 optional
const bookDemoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid work email address"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  numberOfBeds: z.string().min(1, "Please select number of beds"),
  preferredDateTime: z.string().optional(),
  specificInterests: z.array(z.string()).optional(),
  message: z.string().optional(),
});

type BookDemoFormData = z.infer<typeof bookDemoSchema>;

const interestOptions = [
  { id: "clearing_automation", label: "Clearing automation" },
  { id: "viewing_management", label: "Viewing management" },
  { id: "contract_automation", label: "Contract automation" },
  { id: "retention_tools", label: "Retention tools" },
  { id: "full_walkthrough", label: "Full platform walkthrough" },
];

export default function BookDemo() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<BookDemoFormData>({
    resolver: zodResolver(bookDemoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      numberOfBeds: "",
      preferredDateTime: "",
      specificInterests: [],
      message: "",
    },
  });

  // Submit form mutation
  const submitMutation = useMutation({
    mutationFn: async (data: BookDemoFormData) => {
      const response = await apiRequest("POST", "/api/demo-bookings", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Demo Booked Successfully!",
        description: "We'll send you a calendar invite shortly.",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookDemoFormData) => {
    submitMutation.mutate(data);
  };

  const faqItems: FAQItem[] = [
    {
      question: "How long is the demo?",
      answer: "Our demos are typically 30 minutes. We'll show you the key features most relevant to your operation based on your specific interests."
    },
    {
      question: "What will we cover in the demo?",
      answer: "We'll walk through AI conversation automation, lead management, viewing booking, digital contracts, and analytics. We'll focus on the areas you selected as interests in the form."
    },
    {
      question: "Do I need to prepare anything?",
      answer: "No preparation needed! Just come with any questions about your current process and challenges. We'll show you how TermFlow can help."
    },
    {
      question: "Can I get a free trial after the demo?",
      answer: "Yes! All demos include access to a 14-day free trial. No credit card required. You can test TermFlow with your actual properties and leads."
    },
    {
      question: "What if I can't make the scheduled time?",
      answer: "No problem! You can reschedule using the link in your calendar invite, or contact us directly and we'll find a time that works better."
    }
  ];

  return (
    <>
      <LocalBusinessSchema />
      
      {/* Event Schema for Demo Booking */}
      <EventSchema
        name="TermFlow Platform Demo - AI Automation for PBSA"
        description="Join our 30-minute personalized demo to see how TermFlow automates student lettings for PBSA operators. Learn about AI conversations, automated viewings, digital contracts, and analytics."
        eventAttendanceMode="OnlineEventAttendanceMode"
        location={{
          type: "VirtualLocation",
          url: "https://termflow.co.uk/demo"
        }}
        organizer={{
          name: "TermFlow",
          url: "https://termflow.co.uk"
        }}
        performer={{
          name: "TermFlow Sales Team",
          jobTitle: "PBSA Automation Specialist"
        }}
        offers={{
          price: "0",
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
          url: "https://termflow.co.uk/book-demo"
        }}
      />
      
      <SEOHead
        title="Book PBSA Software Demo | Free Trial | TermFlow"
        description="Book a free 30-minute demo of TermFlow student accommodation software. See AI automation in action. 14-day free trial, no credit card required."
        keywords="book PBSA demo, student accommodation software demo, AI lettings platform demo, TermFlow demo, free PBSA trial, student lettings software demo"
        canonical="https://termflow.co.uk/book-demo"
        ogTitle="Book PBSA Software Demo | Free Trial | TermFlow"
        ogDescription="Book a free 30-minute demo of TermFlow student accommodation software. See AI automation in action. 14-day free trial, no credit card required."
        ogType="website"
        ogUrl="https://termflow.co.uk/book-demo"
        twitterCard="summary_large_image"
        twitterTitle="Book PBSA Software Demo | Free Trial | TermFlow"
        twitterDescription="Book a free 30-minute demo of TermFlow. See AI automation in action. 14-day free trial."
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Book a Demo", url: "/book-demo" }
        ]}
      />
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-lime" />
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <TermFlowWordmark />
          <Button variant="ghost" size="sm" asChild data-testid="link-home">
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </header>

      <div className="min-h-screen bg-gradient-to-br from-tf-navy/5 via-background to-tf-lime/5">
        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-tf-lime text-tf-navy" data-testid="badge-free-demo">
                <Calendar className="h-3 w-3 mr-1" />
                Free 30-Min Demo
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" data-testid="text-hero-title">
                See TermFlow in Action
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
                Book a personalized demo and discover how AI automation transforms PBSA operations
              </p>
              <p className="text-sm text-muted-foreground">
                30 minutes • No obligation • No credit card required
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 pb-12">
          {!isSubmitted ? (
            /* Booking Form */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card data-testid="card-book-demo-form" className="mb-12">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-tf-navy" />
                    Book Your Demo
                  </CardTitle>
                  <CardDescription>Fill out the form below and we'll send you a calendar invite</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Contact Information Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="John Smith"
                                    {...field}
                                    data-testid="input-full-name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Work Email *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="john@company.com"
                                    {...field}
                                    data-testid="input-email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company/Portfolio Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Stanley House Ltd"
                                  {...field}
                                  data-testid="input-company"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Context Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Tell Us About Your Operation</h3>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="numberOfBeds"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Number of Beds *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-number-of-beds">
                                      <SelectValue placeholder="Select range" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="10-50" data-testid="option-10-50">10-50 beds</SelectItem>
                                    <SelectItem value="51-100" data-testid="option-51-100">51-100 beds</SelectItem>
                                    <SelectItem value="101-250" data-testid="option-101-250">101-250 beds</SelectItem>
                                    <SelectItem value="251-500" data-testid="option-251-500">251-500 beds</SelectItem>
                                    <SelectItem value="500+" data-testid="option-500-plus">500+ beds</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="preferredDateTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Time</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-preferred-time">
                                      <SelectValue placeholder="Select preference" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="morning" data-testid="option-morning">Morning (9am-12pm)</SelectItem>
                                    <SelectItem value="afternoon" data-testid="option-afternoon">Afternoon (12pm-5pm)</SelectItem>
                                    <SelectItem value="flexible" data-testid="option-flexible">Flexible</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription className="text-xs">We'll send calendar options via email</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="specificInterests"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>What would you like to see? (Optional)</FormLabel>
                                <FormDescription className="text-xs">Select all that apply</FormDescription>
                              </div>
                              <div className="grid md:grid-cols-2 gap-3">
                                {interestOptions.map((item) => (
                                  <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="specificInterests"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={item.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(item.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...(field.value || []), item.id])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== item.id
                                                      )
                                                    );
                                              }}
                                              data-testid={`checkbox-${item.id}`}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal cursor-pointer">
                                            {item.label}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Questions or Special Requests (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Any specific challenges you'd like us to address?"
                                  className="resize-none"
                                  rows={3}
                                  {...field}
                                  data-testid="textarea-message"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={submitMutation.isPending}
                        data-testid="button-submit-demo"
                      >
                        {submitMutation.isPending ? "Submitting..." : "Book My Demo"}
                        <Sparkles className="ml-2 h-4 w-4" />
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        By submitting this form, you agree to receive demo-related communications from TermFlow
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 mb-12"
            >
              <Card className="border-tf-lime/30" data-testid="card-success">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-tf-lime/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-tf-lime" data-testid="icon-success" />
                  </div>
                  <CardTitle className="text-2xl">Demo Booked Successfully!</CardTitle>
                  <CardDescription className="text-base">
                    Check your email for the calendar invite and next steps
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="default" asChild data-testid="button-back-home">
                      <a href="/">Back to Home</a>
                    </Button>
                    <Button variant="outline" asChild data-testid="button-explore">
                      <a href="/how-it-works">Learn how TermFlow works</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Workflow Diagram Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">What Happens Next?</h2>
              <p className="text-muted-foreground">Here's what to expect after booking</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6" data-testid="diagram-demo-workflow">
              {/* Step 1 */}
              <Card className="relative">
                <CardHeader>
                  <div className="w-12 h-12 bg-tf-lime/10 rounded-full flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-tf-lime" />
                  </div>
                  <CardTitle className="text-lg">1. Book Demo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Complete the form above in just 15 seconds
                  </p>
                </CardContent>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block">
                  <ArrowDown className="w-6 h-6 text-tf-lime rotate-[-90deg]" />
                </div>
              </Card>

              {/* Step 2 */}
              <Card className="relative">
                <CardHeader>
                  <div className="w-12 h-12 bg-tf-lime/10 rounded-full flex items-center justify-center mb-3">
                    <Mail className="w-6 h-6 text-tf-lime" />
                  </div>
                  <CardTitle className="text-lg">2. Get Invite</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Receive calendar invite instantly via email
                  </p>
                </CardContent>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block">
                  <ArrowDown className="w-6 h-6 text-tf-lime rotate-[-90deg]" />
                </div>
              </Card>

              {/* Step 3 */}
              <Card className="relative">
                <CardHeader>
                  <div className="w-12 h-12 bg-tf-lime/10 rounded-full flex items-center justify-center mb-3">
                    <Video className="w-6 h-6 text-tf-lime" />
                  </div>
                  <CardTitle className="text-lg">3. Live Demo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    30-min personalized walkthrough of TermFlow
                  </p>
                </CardContent>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block">
                  <ArrowDown className="w-6 h-6 text-tf-lime rotate-[-90deg]" />
                </div>
              </Card>

              {/* Step 4 */}
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-tf-lime/10 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-tf-lime" />
                  </div>
                  <CardTitle className="text-lg">4. Free Trial</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    14-day trial access. No credit card needed
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <FAQ 
              items={faqItems}
              title="Common Questions"
              data-testid="faq-demo-booking"
            />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
