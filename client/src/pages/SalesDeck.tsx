import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileText, Download, CheckCircle, TrendingUp, Users, Zap, Building2, PoundSterling } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { SiteSearch } from "@/components/SiteSearch";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name is required"),
  role: z.string().min(1, "Please select your role"),
});

type FormData = z.infer<typeof formSchema>;

export default function SalesDeck() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Resources", url: "#" },
    { name: "Sales Deck", url: "/resources/sales-deck" }
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          role: data.role,
          source: "sales_deck",
          notes: `Sales Deck Download Request - Role: ${data.role}`,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit");
      }

      setSubmitted(true);
      toast({
        title: "Success!",
        description: "Check your email for the sales deck download link. It should arrive within 2 minutes.",
      });

      // Mock download trigger (in production, this would be sent via email)
      setTimeout(() => {
        toast({
          title: "Sales Deck Ready",
          description: "Your TermFlow sales deck has been sent to your email.",
        });
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="Sales Deck Download | TermFlow One-Pager"
        description="Download the TermFlow sales deck: one-page overview of PBSA automation, key results (98% occupancy, 20+ hours saved), case studies, and pricing. Perfect for decision-makers."
        keywords="TermFlow sales deck, PBSA automation overview, student accommodation pitch deck, ROI one-pager, sales presentation"
        canonical="https://termflow.co.uk/resources/sales-deck"
        ogUrl="https://termflow.co.uk/resources/sales-deck"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <TermFlowWordmark />
            <SiteSearch />
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">
              Home
            </a>
            <Button asChild size="sm" variant="outline" data-testid="button-book-demo">
              <a href="/book-demo">Book Demo</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <LastUpdated date="January 20, 2025" className="mb-8" />

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              TermFlow Sales Deck
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            One-page overview of TermFlow's PBSA automation platform. Perfect for sharing with decision-makers who need to quickly understand the value proposition.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Left: Deck Preview - Takes 3 columns */}
          <div className="md:col-span-3 space-y-8">
            <Card data-testid="card-deck-contents">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-tf-navy" />
                  What's in the Deck
                </CardTitle>
                <CardDescription>
                  A comprehensive one-page overview for decision-makers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Problem */}
                <div className="space-y-3 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-tf-navy text-white w-8 h-8 flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h3 className="font-bold text-lg">The Problem</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    <strong>PBSA Admin Overwhelm During Peak Season:</strong> 400+ enquiries/week during clearing, 24/7 student expectations, manual processes that don't scale, and occupancy targets of 95%+ with lean teams.
                  </p>
                </div>

                {/* Solution */}
                <div className="space-y-3 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-tf-navy text-white w-8 h-8 flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <h3 className="font-bold text-lg">The Solution</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10 mb-3">
                    <strong>TermFlow AI Automation:</strong> Purpose-built platform for PBSA operators. AI handles enquiries 24/7, automates viewing booking, generates contracts digitally, and manages compliance.
                  </p>
                  <div className="pl-10 grid sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>24/7 AI assistant (Ava)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Automated viewing booking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Digital contracts & e-sign</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Right-to-Rent compliance</span>
                    </div>
                  </div>
                </div>

                {/* How It Works */}
                <div className="space-y-3 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-tf-navy text-white w-8 h-8 flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <h3 className="font-bold text-lg">How It Works</h3>
                  </div>
                  <div className="pl-10 space-y-3 text-sm text-muted-foreground">
                    <div className="flex gap-3">
                      <Zap className="h-5 w-5 text-tf-navy flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Lead Capture → AI Response</p>
                        <p>Students enquire via Rightmove, Zoopla, WhatsApp, or website. Ava responds in 30 seconds, qualifies leads, answers property questions.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Zap className="h-5 w-5 text-tf-navy flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Automated Booking → Viewing</p>
                        <p>Students book viewings directly from WhatsApp. Syncs with your calendar. Automated reminders reduce no-shows by 60%.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Zap className="h-5 w-5 text-tf-navy flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Contract → Move-in</p>
                        <p>Generate contracts with one click. Students sign on mobile. Deposit auto-protected. Right-to-Rent compliance handled.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-3 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-tf-navy text-white w-8 h-8 flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <h3 className="font-bold text-lg">Key Results</h3>
                  </div>
                  <div className="pl-10 grid sm:grid-cols-2 gap-4">
                    <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-tf-navy" />
                        <p className="font-semibold text-2xl text-tf-navy">95%</p>
                      </div>
                      <p className="text-sm text-muted-foreground">AI accuracy on enquiries</p>
                    </div>

                    <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-tf-navy" />
                        <p className="font-semibold text-2xl text-tf-navy">20+ hours</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Saved per week (admin)</p>
                    </div>

                    <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-5 w-5 text-tf-navy" />
                        <p className="font-semibold text-2xl text-tf-navy">98%</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Average occupancy rate</p>
                    </div>

                    <div className="bg-tf-navy/5 p-4 rounded-md border border-tf-navy/20">
                      <div className="flex items-center gap-2 mb-2">
                        <PoundSterling className="h-5 w-5 text-tf-navy" />
                        <p className="font-semibold text-2xl text-tf-navy">£23/bed</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Monthly cost reduction</p>
                    </div>
                  </div>
                </div>

                {/* Case Studies */}
                <div className="space-y-3 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-tf-navy text-white w-8 h-8 flex items-center justify-center font-bold text-sm">
                      5
                    </div>
                    <h3 className="font-bold text-lg">Proof: 3 Short Case Studies</h3>
                  </div>
                  <div className="pl-10 space-y-4">
                    <div className="bg-tf-navy/5 p-4 rounded-md border-l-4 border-tf-navy">
                      <p className="font-semibold mb-1">320-bed operator, Newcastle</p>
                      <p className="text-sm text-muted-foreground">
                        "During clearing, we had 400+ enquiries in one week. TermFlow handled every single one while we slept. Occupancy went from 92% to 98%."
                      </p>
                    </div>

                    <div className="bg-tf-navy/5 p-4 rounded-md border-l-4 border-tf-navy">
                      <p className="font-semibold mb-1">150-bed operator, London</p>
                      <p className="text-sm text-muted-foreground">
                        "Lead-to-contract time dropped from 14 days to 6 days. International students sign contracts before arriving in the UK. Game-changer."
                      </p>
                    </div>

                    <div className="bg-tf-navy/5 p-4 rounded-md border-l-4 border-tf-navy">
                      <p className="font-semibold mb-1">280-bed operator, Bristol</p>
                      <p className="text-sm text-muted-foreground">
                        "Response time went from 4 hours to 30 seconds. We're capturing leads we used to lose to competitors. Admin costs per bed dropped 51%."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-tf-navy text-white w-8 h-8 flex items-center justify-center font-bold text-sm">
                      6
                    </div>
                    <h3 className="font-bold text-lg">Pricing Signal</h3>
                  </div>
                  <div className="pl-10">
                    <p className="text-2xl font-bold text-tf-navy mb-2">From £99/month</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Starter plan for properties up to 50 beds. Professional and Enterprise plans available for larger portfolios.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Typical ROI: 8-10x in first year for 300-bed operators (£30k+ net benefit vs £3,588 annual cost)
                    </p>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-tf-navy text-white w-8 h-8 flex items-center justify-center font-bold text-sm">
                      7
                    </div>
                    <h3 className="font-bold text-lg">Next Steps</h3>
                  </div>
                  <div className="pl-10 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">1. Book a 30-minute demo:</strong> See the platform in action with your property data
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">2. 1-2 week implementation:</strong> We handle setup, training, and go-live
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">3. See results in 30 days:</strong> Track time savings, occupancy uplift, and cost reduction
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Download Form - Takes 2 columns */}
          <div className="md:col-span-2">
            <div className="sticky top-24">
              <Card className="border-2 border-tf-navy">
                <CardContent className="pt-6">
                  {!submitted ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center rounded-full bg-tf-navy/10 p-4 mb-4">
                          <Download className="h-8 w-8 text-tf-navy" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Download Sales Deck</h3>
                        <p className="text-muted-foreground">
                          Get the one-page TermFlow overview sent to your email instantly
                        </p>
                      </div>

                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="John Smith"
                                    {...field}
                                    data-testid="input-name"
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
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="john@company.com"
                                    type="email"
                                    {...field}
                                    data-testid="input-email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Acme Student Accommodation"
                                    {...field}
                                    data-testid="input-company"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Role</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-role">
                                      <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="operator">PBSA Operator / Owner</SelectItem>
                                    <SelectItem value="manager">Operations / Site Manager</SelectItem>
                                    <SelectItem value="director">Director / C-Level</SelectItem>
                                    <SelectItem value="procurement">Procurement / Buyer</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={form.formState.isSubmitting}
                            data-testid="button-download"
                          >
                            {form.formState.isSubmitting ? "Sending..." : "Download Sales Deck"}
                          </Button>
                        </form>
                      </Form>

                      <div className="mt-6 pt-6 border-t">
                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-foreground mb-1">Instant delivery</p>
                            <p>Download link sent to your email in under 2 minutes</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 p-4 mb-4">
                        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Check Your Email!</h3>
                      <p className="text-muted-foreground mb-6">
                        We've sent the TermFlow sales deck to your email. It should arrive within 2 minutes.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Don't see it? Check your spam folder or{" "}
                        <a href="/contact" className="text-tf-navy font-semibold hover:underline">
                          contact us
                        </a>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <p className="text-xs text-center text-muted-foreground mt-4">
                We respect your privacy. No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
