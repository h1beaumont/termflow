import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Zap, Shield, Users, Building2, Phone, MessageSquare, Mail, Calendar, FileCheck, BarChart3, Headphones, Code, Award, Crown, Clock, Sparkles, Gift, RefreshCw, Heart, Info, Package, Calculator, TrendingUp, CheckCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SEOHead } from "@/components/SEOHead";
import { SoftwareApplicationSchema } from "@/components/SoftwareApplicationSchema";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { formatCurrency } from "@/lib/formatCurrency";
import { ROICalculator } from "@/components/ROICalculator";
import { PricingCalculator } from "@/components/PricingCalculator";
import { PaybackPeriodCalculator } from "@/components/PaybackPeriodCalculator";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { TestimonialWithSchema, TestimonialData } from "@/components/TestimonialWithSchema";
import { BackToTop } from "@/components/BackToTop";
import { FAQ, FAQItem } from "@/components/FAQ";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { SiteSearch } from "@/components/SiteSearch";
import headshot1 from "@assets/stock_images/professional_busines_82a17483.jpg";
import headshot2 from "@assets/stock_images/professional_busines_4a59ef67.jpg";
import headshot3 from "@assets/stock_images/professional_busines_96686da7.jpg";
import headshot4 from "@assets/stock_images/professional_busines_3eac0e8f.jpg";
import sarahHeadshot from "@assets/stock_images/friendly_young_woman_6ba1b3c2.jpg";

export default function Pricing() {
  const [units, setUnits] = useState<number>(50);
  const [inputValue, setInputValue] = useState<string>("50");
  const [agentFeeType, setAgentFeeType] = useState<"percentage" | "fixed">("percentage");
  const [agentFeePercentage, setAgentFeePercentage] = useState<number>(9);
  const [agentFeeFixed, setAgentFeeFixed] = useState<number>(500);

  // Calculate price based on units
  const calculatePrice = (unitCount: number): { price: number; label: string } => {
    if (unitCount >= 1000) {
      return { price: 0, label: "Custom" };
    } else if (unitCount >= 501) {
      return { price: 499, label: "£499" };
    } else if (unitCount >= 201) {
      return { price: 299, label: "£299" };
    } else if (unitCount >= 101) {
      return { price: 179, label: "£179" };
    } else {
      return { price: 99, label: "£99" };
    }
  };

  const currentPricing = calculatePrice(units);

  // Calculate ROI based on number of units and custom agent fee
  const averageRentPerUnit = 150; // £150/week average
  const weeksPerMonth = 4.33;

  const monthlyRent = units * averageRentPerUnit * weeksPerMonth;
  
  // Calculate agent fee based on type
  const agentFeeSavings = agentFeeType === "percentage" 
    ? monthlyRent * (agentFeePercentage / 100)
    : (agentFeeFixed * units) / 12; // Fixed fee per letting: total annual cost / 12 months
  
  const totalMonthlySavings = agentFeeSavings;
  const annualSavings = totalMonthlySavings * 12;

  // Testimonials data
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

  // All features available at all pricing tiers
  const allFeatures = [
    { text: "AI conversations (WhatsApp, email, web)", included: true },
    { text: "Lead capture from all sources", included: true },
    { text: "Smart viewing booking", included: true },
    { text: "Digital contracts & deposits", included: true },
    { text: "Interactive floor plans with videos", included: true },
    { text: "JustCall phone integration", included: true },
    { text: "Tenancy calendar & retention messaging", included: true },
    { text: "Advanced pipeline analytics", included: true },
    { text: "Multi-property management", included: true },
    { text: "Priority support", included: true },
    { text: "API access", included: true },
  ];

  const handleUnitsChange = (value: number) => {
    const clampedValue = Math.max(50, Math.min(1500, value));
    setUnits(clampedValue);
    setInputValue(clampedValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const numValue = Number(inputValue);
    if (!isNaN(numValue)) {
      handleUnitsChange(numValue);
    } else {
      setInputValue(units.toString());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Exit Intent Popup */}
      <ExitIntentPopup />
      
      <SoftwareApplicationSchema />
      <LocalBusinessSchema />
      
      <SEOHead
        title="PBSA Software Pricing UK | From £99/Month | TermFlow"
        description="Transparent PBSA software pricing from £99/month. All features included at every tier. No setup fees, cancel anytime. Compare to Concurrent, Kinetic & Yardi pricing."
        keywords="PBSA software pricing UK, student accommodation software cost, PBSA CRM pricing, property management software UK, student lettings software price, Concurrent alternative, Kinetic alternative, Yardi alternative"
        canonical="https://termflow.co.uk/pricing"
        ogTitle="PBSA Software Pricing UK | From £99/Month | TermFlow"
        ogDescription="Transparent PBSA software pricing from £99/month. All features included at every tier. No setup fees, cancel anytime."
        ogType="website"
        ogUrl="https://termflow.co.uk/pricing"
        twitterCard="summary_large_image"
        twitterTitle="PBSA Software Pricing UK | From £99/Month | TermFlow"
        twitterDescription="Transparent PBSA software pricing from £99/month. All features included. Compare to Concurrent, Kinetic & Yardi."
      />
      {/* Header */}
      <header className="w-full border-b">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <TermFlowWordmark />
            <SiteSearch />
          </div>
          <div className="flex items-center gap-5">
            <a href="/" className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">
              Home
            </a>
            <a href="/how-it-works" className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">
              How It Works
            </a>
            <Button variant="outline" size="sm" asChild data-testid="button-signin" className="text-sm sm:text-base px-3 sm:px-4">
              <a href="/login">Sign in</a>
            </Button>
            <Button variant="default" size="sm" asChild data-testid="button-signup" className="text-sm sm:text-base px-3 sm:px-4 bg-tf-lime text-tf-navy hover:bg-tf-lime/90 border-0 font-bold shadow-sm">
              <a href="/login">Sign up</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-primary text-primary-foreground" data-testid="badge-free-trial">
            <Gift className="h-3 w-3 mr-1" />
            14-Day Free Trial
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6" data-testid="text-pricing-title">
            Simple, Transparent Pricing for Student Accommodation Automation
          </h1>
          <p className="text-xl text-muted-foreground mb-4" data-testid="text-pricing-subtitle">
            Start your free 14-day trial today
          </p>
          <p className="text-lg text-primary font-semibold" data-testid="text-pricing-savings">
            Eliminate agent commission fees and replace expensive CRMs
          </p>
        </div>
      </section>


      {/* Sliding Scale Pricing */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border-primary" data-testid="card-sliding-scale-pricing">
            <CardHeader className="text-center">
              <Badge className="mx-auto mb-4" data-testid="badge-sliding-scale">
                <Zap className="h-3 w-3 mr-1" />
                Sliding Scale Pricing
              </Badge>
              <h2 className="text-3xl mb-2 font-bold" data-testid="text-pricing-calculator-title">
                Pay Only For What You Need
              </h2>
              <CardDescription className="text-base" data-testid="text-pricing-calculator-description">
                All features included at every tier. Price scales with your portfolio size.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Unit Count Selector */}
              <div className="space-y-6">
                <div className="text-center">
                  <label className="text-sm font-medium mb-4 block">How many units do you manage?</label>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Input
                      type="number"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      min={50}
                      max={1500}
                      className="w-32 text-center text-2xl font-bold"
                      data-testid="input-unit-count"
                    />
                    <span className="text-muted-foreground">units</span>
                  </div>
                  <Slider
                    value={[units]}
                    onValueChange={([value]) => handleUnitsChange(value)}
                    min={50}
                    max={1500}
                    step={10}
                    className="max-w-md mx-auto"
                    data-testid="slider-unit-count"
                  />
                  <div className="flex justify-between max-w-md mx-auto mt-2 text-sm text-muted-foreground">
                    <span>50</span>
                    <span>1000+</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="text-center p-8 bg-primary/5 rounded-lg border-2 border-primary">
                  <Badge className="mb-3 bg-primary text-primary-foreground" data-testid="badge-trial-included">
                    <Gift className="h-3 w-3 mr-1" />
                    14-Day Free Trial Included
                  </Badge>
                  <div className="text-5xl font-bold mb-2" data-testid="text-calculated-price">
                    {currentPricing.label}
                    {currentPricing.price > 0 && <span className="text-2xl text-muted-foreground">/month</span>}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {units >= 1000 ? (
                      "Contact us for custom enterprise pricing"
                    ) : (
                      `For ${units} units • £${(currentPricing.price / units).toFixed(2)} per unit/month`
                    )}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="mt-2 cursor-help" data-testid="badge-pricing-tier">
                          <Info className="h-3 w-3 mr-1" />
                          {units >= 1000 ? "Enterprise Tier" : 
                           units >= 501 ? "Premium Tier (501-1000 units)" :
                           units >= 201 ? "Growth Tier (201-500 units)" :
                           units >= 101 ? "Professional Tier (101-200 units)" :
                           "Starter Tier (50-100 units)"}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs" data-testid="tooltip-pricing-tier">
                        <p className="text-sm">Your portfolio size automatically determines your tier. All features are included regardless of tier - pricing simply scales with your needs.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* All Features Included */}
                <div>
                  <h2 className="text-xl font-semibold text-center mb-4">Everything Included:</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {allFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2" data-testid={`list-feature-${index}`}>
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Breakdown Table with Use Cases */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-center">Pricing Tiers & Use Cases:</h4>
                  <div className="space-y-3 text-sm">
                    <div className="py-3 border-b" data-testid="tier-50-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold">50-100 units</span>
                        <span className="font-bold text-primary">£99/month</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Perfect for single PBSA properties or small portfolios</p>
                    </div>
                    <div className="py-3 border-b" data-testid="tier-101-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold">101-200 units</span>
                        <span className="font-bold text-primary">£179/month</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Ideal for growing PBSA operators with multiple buildings</p>
                    </div>
                    <div className="py-3 border-b" data-testid="tier-201-500">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold">201-500 units</span>
                        <span className="font-bold text-primary">£299/month</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Recommended for established portfolios and property groups</p>
                    </div>
                    <div className="py-3 border-b" data-testid="tier-501-1000">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold">501-1000 units</span>
                        <span className="font-bold text-primary">£499/month</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Enterprise solution for large PBSA operators</p>
                    </div>
                    <div className="py-3" data-testid="tier-1000-plus">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold">1000+ units</span>
                        <span className="font-bold text-primary">Custom pricing</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Custom solution tailored to your scale and needs</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col gap-4">
              <div className="flex gap-4 w-full">
                <Button 
                  className="flex-1" 
                  variant="default"
                  asChild
                  data-testid="button-start-trial"
                >
                  {units >= 1000 ? (
                    <a href="/connect">Contact Sales</a>
                  ) : (
                    <a href="/login">
                      Start 14-Day Free Trial
                      <Sparkles className="h-4 w-4 ml-2" />
                    </a>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  asChild
                  data-testid="button-see-demo"
                >
                  <a href="/book-demo">Book a Demo</a>
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground w-full">
                {units >= 1000 ? (
                  "Get custom pricing for your enterprise portfolio"
                ) : (
                  "No credit card required"
                )}
              </p>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Bundles & Add-Ons Section with Tabs */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500" data-testid="badge-bundles-addons">
              <Package className="h-3 w-3 mr-1" />
              Bundles & Add-Ons
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Enhance Your Plan</h2>
            <p className="text-xl text-muted-foreground">
              Choose from our bundles or individual add-ons to supercharge your automation
            </p>
          </div>

          <Tabs defaultValue="bundle" className="max-w-5xl mx-auto" data-testid="tabs-bundles-addons">
            <TabsList className="grid w-full grid-cols-2 mb-8" data-testid="tabs-list-bundles-addons">
              <TabsTrigger value="bundle" data-testid="tab-trigger-bundle">
                <Shield className="h-4 w-4 mr-2" />
                Operator Bundle
              </TabsTrigger>
              <TabsTrigger value="addons" data-testid="tab-trigger-addons">
                <Sparkles className="h-4 w-4 mr-2" />
                Add-Ons
              </TabsTrigger>
            </TabsList>

            {/* Bundle Tab Content */}
            <TabsContent value="bundle" data-testid="tab-content-bundle">
              <Card className="border-2 border-purple-500" data-testid="bundle-operator">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl font-bold">£89</span>
                    <span className="text-muted-foreground">/month</span>
                    <Badge variant="outline" className="ml-2">Save £28/mo</Badge>
                  </div>
                  <CardTitle className="text-2xl">Operator Bundle</CardTitle>
                  <CardDescription className="text-base">
                    Perfect for hands-on landlords who want control + automation
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {/* Feature 1: Approval Gate */}
                    <div className="text-center p-4 rounded-lg bg-card border">
                      <Shield className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                      <h4 className="font-semibold mb-2">Approval Gate</h4>
                      <p className="text-sm text-muted-foreground">
                        Manual approval before AI proceeds with contracts
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Worth £29/mo
                      </p>
                    </div>

                    {/* Feature 2: Automated Incentives */}
                    <div className="text-center p-4 rounded-lg bg-card border">
                      <Gift className="w-8 h-8 mx-auto mb-3 text-pink-500" />
                      <h4 className="font-semibold mb-2">Incentives</h4>
                      <p className="text-sm text-muted-foreground">
                        Early-bird discounts, referral bonuses, group deals
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Worth £39/mo
                      </p>
                    </div>

                    {/* Feature 3: AI Call Scoring */}
                    <div className="text-center p-4 rounded-lg bg-card border">
                      <Phone className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                      <h4 className="font-semibold mb-2">Call Scoring</h4>
                      <p className="text-sm text-muted-foreground">
                        AI analyzes calls for staff performance insights
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Worth £49/mo
                      </p>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Everything in Operator Bundle:</h4>
                    <ul className="grid md:grid-cols-2 gap-3">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 mt-0.5" />
                        <span>Manual approval workflow for contracts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 mt-0.5" />
                        <span>Early-bird discount automation (5-15%)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 mt-0.5" />
                        <span>Referral bonus tracking (£50-£200)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 mt-0.5" />
                        <span>Group booking deals (3+ students)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 mt-0.5" />
                        <span>JustCall integration for call recording</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 mt-0.5" />
                        <span>AI performance scores (0-100)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 mt-0.5" />
                        <span>Sentiment analysis on conversations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-purple-500 mt-0.5" />
                        <span>Lead update suggestions from calls</span>
                      </li>
                    </ul>
                  </div>

                  <Alert className="mt-6">
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Best Value for Growing Portfolios</AlertTitle>
                    <AlertDescription>
                      Get 3 powerful features for less than the price of 2. Perfect for landlords managing 5+ properties.
                    </AlertDescription>
                  </Alert>
                </CardContent>

                <CardFooter className="flex gap-4">
                  <Button className="flex-1 bg-purple-500 hover:bg-purple-600" asChild data-testid="button-start-trial-bundle">
                    <a href="/login">Start Free Trial</a>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild data-testid="button-book-demo-bundle">
                    <a href="/book-demo">Book a Demo</a>
                  </Button>
                </CardFooter>
              </Card>

              {/* Comparison to Individual Features */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Individual prices:</strong> Approval Gate (£29) + Incentives (£39) + Call Scoring (£49) = £117/mo
                  <br />
                  <strong>Bundle price:</strong> £89/mo - <span className="text-purple-500 font-semibold">Save £28/mo (24% off)</span>
                </p>
              </div>
            </TabsContent>

            {/* Add-Ons Tab Content */}
            <TabsContent value="addons" data-testid="tab-content-addons">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Clearing Mode Add-On */}
                <Card className="border-2 border-orange-500/50" data-testid="addon-clearing-mode">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <Badge className="bg-orange-500">Seasonal</Badge>
                      <span className="text-2xl font-bold">+£99/mo</span>
                    </div>
                    <CardTitle className="text-2xl">Clearing Mode</CardTitle>
                    <CardDescription>
                      Fill last-minute vacancies during Clearing (Aug-Sep) with automated discounting and rapid onboarding
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-orange-500 mt-0.5" />
                        <span>
                          <strong>Automated Discounting:</strong> AI suggests discount rates based on days to term start
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-orange-500 mt-0.5" />
                        <span>
                          <strong>Priority Response:</strong> Instant automated replies to all portal enquiries
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-orange-500 mt-0.5" />
                        <span>
                          <strong>Rapid Onboarding:</strong> 48-hour viewing-to-move-in (vs 7-14 days)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-orange-500 mt-0.5" />
                        <span>
                          <strong>WhatsApp Blitz:</strong> Proactive outreach to warm leads with offers
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-orange-500 mt-0.5" />
                        <span>
                          <strong>Flexible Terms:</strong> Term-time contract options
                        </span>
                      </li>
                    </ul>

                    <Alert className="mt-6">
                      <Clock className="h-4 w-4" />
                      <AlertTitle>August-September Only</AlertTitle>
                      <AlertDescription>
                        Clearing Mode automatically activates when term start is within 30 days. Cancel anytime.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter className="flex gap-4">
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600" asChild data-testid="button-start-trial-clearing">
                      <a href="/login">Start Free Trial</a>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild data-testid="button-book-demo-clearing">
                      <a href="/book-demo">Book a Demo</a>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Retention Pro Add-On */}
                <Card className="border-2 border-teal-500/50" data-testid="addon-retention-pro">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <Badge className="bg-teal-500">Retention</Badge>
                      <span className="text-2xl font-bold">+£69/mo</span>
                    </div>
                    <CardTitle className="text-2xl">Retention Pro</CardTitle>
                    <CardDescription>
                      Keep tenants longer with automated renewal campaigns and churn prevention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-teal-500 mt-0.5" />
                        <span>
                          <strong>Automated Renewal Campaigns:</strong> 90/60/30 days before tenancy end
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-teal-500 mt-0.5" />
                        <span>
                          <strong>Tenant Satisfaction Surveys:</strong> AI sentiment analysis on feedback
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-teal-500 mt-0.5" />
                        <span>
                          <strong>Smart Retention Offers:</strong> Early renewal discounts, rent freeze, upgrades
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-teal-500 mt-0.5" />
                        <span>
                          <strong>Churn Risk Scoring:</strong> 0-100 score for each tenant
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-teal-500 mt-0.5" />
                        <span>
                          <strong>Automated Waitlist Management:</strong> Fill vacancies before they happen
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-teal-500 mt-0.5" />
                        <span>
                          <strong>Multi-Year Contract Incentives:</strong> Reward long-term commitments
                        </span>
                      </li>
                    </ul>

                    <Alert className="mt-6">
                      <Heart className="h-4 w-4" />
                      <AlertTitle>Reduce Tenant Turnover</AlertTitle>
                      <AlertDescription>
                        Average 40% reduction in churn when using Retention Pro's automated campaigns
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter className="flex gap-4">
                    <Button className="flex-1 bg-teal-500 hover:bg-teal-600" asChild data-testid="button-start-trial-retention">
                      <a href="/login">Start Free Trial</a>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild data-testid="button-book-demo-retention">
                      <a href="/book-demo">Book a Demo</a>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* No Hidden Fees Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-tf-navy/5 to-background" data-testid="section-no-hidden-fees">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-tf-navy text-white" data-testid="badge-no-hidden-fees">
              <CheckCircle className="h-3 w-3 mr-1" />
              Transparent Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-no-hidden-fees-title">
              No Hidden Fees. Ever.
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="text-no-hidden-fees-subtitle">
              What you see is what you pay—simple, transparent pricing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* What's Included Card */}
            <Card className="border-2 border-primary/20" data-testid="card-whats-included">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  Everything Included
                </CardTitle>
                <CardDescription>All features at no extra cost</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Unlimited enquiries processed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>All AI features included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>No per-conversation charges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>No setup fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>WhatsApp, Email, and SMS included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Free updates and feature releases</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Optional Extras Card */}
            <Card className="border-2 border-muted" data-testid="card-optional-extras">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  Optional Extras
                </CardTitle>
                <CardDescription>Usage-based costs you control</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Phone className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Phone call transcription</strong>
                      <p className="text-sm">Usage-based via JustCall (optional)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <MessageSquare className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">SMS beyond included allowance</strong>
                      <p className="text-sm">Standard Twilio rates apply</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Code className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Premium integrations</strong>
                      <p className="text-sm">Third-party service costs (e.g., DocuSign)</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Exit Guarantee Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-tf-lime/5 to-background" data-testid="section-exit-guarantee">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-tf-lime text-tf-navy" data-testid="badge-exit-guarantee">
              <RefreshCw className="h-3 w-3 mr-1" />
              Risk-Free Trial
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-exit-guarantee-title">
              Try Risk-Free with Our Exit Guarantee
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="text-exit-guarantee-subtitle">
              We're confident you'll love TermFlow, but if not—no hard feelings
            </p>
          </div>

          <Card className="border-2 border-tf-lime/30" data-testid="card-exit-guarantee">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-tf-lime/10 p-2 rounded-lg">
                      <Gift className="h-5 w-5 text-tf-navy" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">14-day free trial</h4>
                      <p className="text-sm text-muted-foreground">No credit card required to start</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-tf-lime/10 p-2 rounded-lg">
                      <X className="h-5 w-5 text-tf-navy" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Cancel anytime</h4>
                      <p className="text-sm text-muted-foreground">No penalties or cancellation fees</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-tf-lime/10 p-2 rounded-lg">
                      <FileCheck className="h-5 w-5 text-tf-navy" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Data export available</h4>
                      <p className="text-sm text-muted-foreground">Export to CSV/JSON format anytime</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-tf-lime/10 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-tf-navy" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">30-day data retention</h4>
                      <p className="text-sm text-muted-foreground">Access your data after cancellation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-tf-lime/10 p-2 rounded-lg">
                      <RefreshCw className="h-5 w-5 text-tf-navy" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Prorated refunds</h4>
                      <p className="text-sm text-muted-foreground">For annual plans cancelled early</p>
                    </div>
                  </div>
                  <Alert className="mt-4">
                    <Shield className="h-4 w-4" />
                    <AlertTitle>GDPR Compliant</AlertTitle>
                    <AlertDescription className="text-xs">
                      All data handling follows UK GDPR regulations
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SLA Section */}
      <section className="py-16 px-6 bg-muted/30" data-testid="section-sla">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-tf-navy text-white" data-testid="badge-sla">
              <Shield className="h-3 w-3 mr-1" />
              Service Guarantee
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-sla-title">
              Our Commitment to You
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="text-sla-subtitle">
              Enterprise-grade reliability and support for all plans
            </p>
          </div>

          <div className="grid gap-6">
            {/* Uptime Guarantee */}
            <Card className="border-2 border-primary/20" data-testid="card-uptime">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  99.5% Uptime Guarantee
                </CardTitle>
                <CardDescription>
                  We monitor our systems 24/7 to ensure maximum availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Current uptime</span>
                      <span className="text-primary font-bold">99.8%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '99.8%' }}></div>
                    </div>
                  </div>
                  <Badge variant="outline" className="whitespace-nowrap">
                    Service credits if we miss our SLA
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Support Response Times */}
            <Card className="border-2 border-muted" data-testid="card-support-times">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-primary" />
                  Support Response Times
                </CardTitle>
                <CardDescription>
                  Fast, reliable support when you need it most
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Priority Level</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Channels</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow data-testid="row-critical">
                      <TableCell className="font-medium">
                        <Badge variant="destructive">Critical</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          Within 2 hours
                        </div>
                      </TableCell>
                      <TableCell>Email, Chat, Phone</TableCell>
                    </TableRow>
                    <TableRow data-testid="row-high">
                      <TableCell className="font-medium">
                        <Badge variant="default">High Priority</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          Within 4 hours
                        </div>
                      </TableCell>
                      <TableCell>Email, Chat</TableCell>
                    </TableRow>
                    <TableRow data-testid="row-normal">
                      <TableCell className="font-medium">
                        <Badge variant="outline">Normal</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          Within 24 hours
                        </div>
                      </TableCell>
                      <TableCell>Email, Chat</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="mt-4 text-sm text-muted-foreground">
                  <strong>Premium tier (501+ units):</strong> Includes dedicated phone support for all priority levels
                </div>
              </CardContent>
            </Card>

            {/* Incident Credits */}
            <Alert className="border-tf-navy/20 bg-tf-navy/5" data-testid="alert-incident-credits">
              <Shield className="h-4 w-4 text-tf-navy" />
              <AlertTitle>Service Credits for SLA Breaches</AlertTitle>
              <AlertDescription>
                If we fail to meet our uptime SLA, you'll receive service credits equivalent to 10% of your monthly subscription for each 0.1% below 99.5% uptime. We're accountable to our promises.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Payback Period Calculator Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-tf-lime/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <PaybackPeriodCalculator />
          
          <div className="mt-8 text-center">
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" asChild data-testid="button-start-trial-payback">
                <a href="/login">
                  <Zap className="h-5 w-5 mr-2" />
                  Start 14-Day Free Trial
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-book-demo-payback">
                <a href="/book-demo">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Book a Demo
                </a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-tf-navy/10 px-4 py-2 mb-6">
              <Calculator className="h-4 w-4 text-tf-navy" />
              <span className="text-sm font-semibold text-tf-navy">See Your Savings</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Calculate Your ROI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See exactly how much you could save by automating your lettings workflow. Adjust the sliders to match your portfolio.
            </p>
          </div>

          <ROICalculator />

          <div className="mt-8 text-center">
            <Button asChild size="lg" data-testid="button-roi-calculator-link">
              <a href="/roi-calculator" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                View Full ROI Calculator
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4" data-testid="badge-testimonials">
              <Award className="h-3 w-3 mr-1" />
              Built for PBSA Operators
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-testimonials-title">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="text-testimonials-subtitle">
              Real results from student accommodation operators across the UK
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialWithSchema 
                key={index} 
                testimonial={testimonial} 
                testId={`pricing-testimonial-${index}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" data-testid="text-faq-title">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground" data-testid="text-faq-description">
              Everything you need to know about our pricing
            </p>
          </div>
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1" data-testid="accordion-faq-1">
              <AccordionTrigger>How does the sliding scale pricing work?</AccordionTrigger>
              <AccordionContent>
                Our pricing is based on the total number of units across all your properties. The more units you manage, 
                the lower your cost per unit becomes. All features are included at every tier - you only pay for scale. 
                Simply adjust the slider to see your exact monthly price based on your portfolio size.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" data-testid="accordion-faq-2">
              <AccordionTrigger>Is there a setup fee?</AccordionTrigger>
              <AccordionContent>
                No, there are no setup fees for any of our plans. You only pay the monthly subscription cost. 
                We'll help you get started with onboarding guides and support to ensure a smooth transition.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" data-testid="accordion-faq-3">
              <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
              <AccordionContent>
                Yes, absolutely. All our plans are month-to-month with no long-term contracts required. 
                You can cancel at any time, and your service will continue until the end of your current billing period.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" data-testid="accordion-faq-4">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept all major credit and debit cards through our secure Stripe integration. 
                For Enterprise customers, we can also arrange invoice billing on request.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" data-testid="accordion-faq-5">
              <AccordionTrigger>How does the 14-day free trial work?</AccordionTrigger>
              <AccordionContent>
                Every plan includes a 14-day free trial with full access to all features. A credit card is required to start your trial. 
                Simply sign up, complete the quick onboarding, and start automating your lettings immediately. 
                After 14 days, you'll only be charged if you choose to continue.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6" data-testid="accordion-faq-6">
              <AccordionTrigger>What happens to my data if I cancel?</AccordionTrigger>
              <AccordionContent>
                You can export all your data at any time, including lead information, contracts, and analytics. 
                After cancellation, your data is retained for 30 days to allow for export, then securely deleted 
                from our systems in accordance with GDPR regulations.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Regulatory Compliance */}
          <Alert className="mt-12 border-primary/20 bg-primary/5" data-testid="alert-compliance">
            <Shield className="h-5 w-5 text-primary" />
            <AlertTitle className="text-lg font-semibold">Fully Compliant Deposit Protection</AlertTitle>
            <AlertDescription className="mt-2">
              All deposits are handled in compliance with UK deposit protection schemes. TermFlow is compliant with TDS (Tenancy Deposit Scheme), DPS (Deposit Protection Service), and MyDeposits regulations. Your tenant deposits are protected by law.
              <br />
              <a 
                href="/security-privacy" 
                className="inline-flex items-center mt-3 text-primary font-medium hover:underline"
                data-testid="link-compliance-details"
              >
                View full compliance and security details
                <span className="ml-1">→</span>
              </a>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <FAQ
            title="Pricing Questions"
            description="Everything you need to know about TermFlow pricing and value"
            items={[
              {
                question: "What's included in the free trial?",
                answer: "Your 14-day free trial includes full access to all TermFlow features with no credit card required. You can test AI conversations, viewing bookings, document verification, digital contracts, analytics, and all integrations. Support is included. The trial is risk-free and you can cancel anytime before it ends."
              },
              {
                question: "How much can I actually save with TermFlow compared to traditional lettings agents?",
                answer: "Traditional lettings agents charge 8-12% of annual rent (typically £400-600 per bed). With TermFlow starting at £99/month for 50-100 beds, you save approximately £20,000-30,000 annually on a 100-bed property. Many operators report TermFlow pays for itself within the first 2-3 contracts signed."
              },
              {
                question: "Can I switch plans or cancel anytime?",
                answer: "Yes. You can upgrade, downgrade, or cancel your plan at any time with no penalties or cancellation fees. If you downgrade mid-month, the change takes effect at your next billing cycle. If you cancel, you'll retain access until the end of your current billing period. No long-term contracts required."
              },
              {
                question: "Are there any hidden fees or extra costs?",
                answer: "No hidden fees. The monthly price includes all features, unlimited users, priority support, and regular updates. The only optional extras are add-ons like the Operator Bundle (£89/mo) or Clearing Mode (£199/mo). Payment processing fees (Stripe) are standard industry rates and go directly to the payment provider, not TermFlow."
              },
              {
                question: "What's the ROI for operators in the first year?",
                answer: "Most operators see 300-500% ROI in year one by eliminating agent commissions, reducing admin time (20+ hours/week), and increasing occupancy rates through faster response times. For a 200-bed property, typical annual savings are £40,000-60,000 compared to traditional lettings agents, while TermFlow costs just £2,148/year (£179/month)."
              },
              {
                question: "Do you offer discounts for multi-property portfolios or annual payment?",
                answer: "Yes. Portfolios with 500+ beds qualify for discounted pricing (from £299-499/month). Portfolios with 1000+ beds receive custom enterprise pricing with dedicated support. We also offer 15% discount for annual payment upfront. Contact our sales team for volume discounts tailored to your specific needs."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit and debit cards (Visa, Mastercard, Amex) via Stripe. For enterprise customers (1000+ beds), we can arrange direct bank transfer and custom invoicing. All payments are processed securely with PCI compliance. UK VAT is added automatically for UK-based businesses."
              }
            ] as FAQItem[]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-12 rounded-lg">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-cta-title">
              Ready to Transform Your Lettings Business?
            </h2>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-cta-description">
              14-day free trial • No credit card required
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" asChild data-testid="button-cta-trial" className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90 font-bold">
                <a href="/login">
                  <Zap className="h-5 w-5 mr-2" />
                  Start 14-Day Free Trial
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-cta-demo">
                <a href="/book-demo">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Talk to Sales
                </a>
              </Button>
            </div>
            <div className="mt-6">
              <a 
                href="/case-studies" 
                className="inline-flex items-center text-primary font-semibold hover:underline"
                data-testid="link-case-studies"
              >
                <Award className="h-4 w-4 mr-2" />
                See success stories from PBSA operators like you
                <span className="ml-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 TermFlow. All rights reserved.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA />
    </div>
  );
}
