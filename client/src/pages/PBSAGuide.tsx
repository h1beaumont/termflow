import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SEOHead } from "@/components/SEOHead";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Footer } from "@/components/Footer";
import { SiteSearch } from "@/components/SiteSearch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BookOpen, CheckCircle, Download, TrendingUp, Users, Zap, Clock, Shield, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

export default function PBSAGuide() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
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
          source: "pbsa_guide",
          notes: "PBSA Automation Guide 2025 Download Request",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit");
      }

      setSubmitted(true);
      toast({
        title: "Success!",
        description: "Check your email for the download link. It should arrive within 2 minutes.",
      });

      // Mock download trigger (in production, this would be sent via email)
      setTimeout(() => {
        toast({
          title: "Guide Ready",
          description: "Your PBSA Automation Guide has been sent to your email.",
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
        title="PBSA Automation Guide 2025 | Free Download - TermFlow"
        description="Download the complete guide to automating your PBSA operations in 2025. Learn how AI can transform your student lettings workflow, boost efficiency, and increase occupancy rates."
        keywords="PBSA automation guide, student accommodation automation, lettings automation ebook, student housing technology, PBSA efficiency guide"
        canonical="https://termflow.co.uk/resources/pbsa-automation-guide-2025"
        ogUrl="https://termflow.co.uk/resources/pbsa-automation-guide-2025"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
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

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-tf-navy to-tf-navy-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 mb-6">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-semibold">Free Resource</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            The Complete Guide to PBSA Automation in 2025
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Learn how leading PBSA operators are using AI to automate their workflow, increase occupancy rates by 15%, and reduce admin time by 40%.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column - What's Inside */}
            <div>
              <h2 className="text-3xl font-bold mb-6">What's Inside:</h2>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="flex gap-4 pt-6">
                    <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                      <TrendingUp className="h-6 w-6 text-tf-navy" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">ROI & Business Case</h3>
                      <p className="text-sm text-muted-foreground">
                        Calculate the exact savings automation can deliver for your portfolio size, including real operator case studies
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex gap-4 pt-6">
                    <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                      <Zap className="h-6 w-6 text-tf-navy" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Automation Workflows</h3>
                      <p className="text-sm text-muted-foreground">
                        Step-by-step workflows for automating enquiries, viewings, applications, contracts, and deposits
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex gap-4 pt-6">
                    <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                      <Users className="h-6 w-6 text-tf-navy" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">International Student Strategy</h3>
                      <p className="text-sm text-muted-foreground">
                        How to serve international students 24/7 with AI in 25+ languages, including timezone optimization
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex gap-4 pt-6">
                    <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                      <Clock className="h-6 w-6 text-tf-navy" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Clearing Period Playbook</h3>
                      <p className="text-sm text-muted-foreground">
                        Proven tactics for handling 500+ enquiries per week during peak season without hiring extra staff
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex gap-4 pt-6">
                    <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                      <Shield className="h-6 w-6 text-tf-navy" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Compliance & Security</h3>
                      <p className="text-sm text-muted-foreground">
                        GDPR, Right-to-Rent, deposit protection, and data security best practices for automated workflows
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex gap-4 pt-6">
                    <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                      <Sparkles className="h-6 w-6 text-tf-navy" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">2025 Trends & Predictions</h3>
                      <p className="text-sm text-muted-foreground">
                        Industry expert insights on AI, student expectations, and the future of PBSA operations
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex gap-4 pt-6">
                    <div className="rounded-lg bg-tf-navy/10 p-3 h-fit">
                      <CheckCircle className="h-6 w-6 text-tf-navy" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Implementation Checklist</h3>
                      <p className="text-sm text-muted-foreground">
                        30-day roadmap for rolling out automation across your portfolio with minimal disruption
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Download Form */}
            <div className="sticky top-24">
              <Card className="border-2 border-tf-navy">
                <CardContent className="pt-6">
                  {!submitted ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center rounded-full bg-tf-navy/10 p-4 mb-4">
                          <Download className="h-8 w-8 text-tf-navy" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Download Your Free Guide</h3>
                        <p className="text-muted-foreground">
                          Enter your details below and we'll send the guide to your email instantly
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

                          <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={form.formState.isSubmitting}
                            data-testid="button-download"
                          >
                            {form.formState.isSubmitting ? "Sending..." : "Download Free Guide"}
                          </Button>
                        </form>
                      </Form>

                      <div className="mt-6 pt-6 border-t">
                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-foreground mb-1">Instant access</p>
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
                        We've sent the PBSA Automation Guide 2025 to your email. It should arrive within 2 minutes.
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
      </section>

      <Footer />
    </div>
  );
}
