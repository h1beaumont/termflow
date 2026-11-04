import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Home, Clock, Heart, DollarSign, CheckCircle, Zap, MessageSquare, Star } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function BoutiqueStudentHouses() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Sectors", url: "/sectors" },
    { name: "Boutique Student Houses", url: "/sectors/boutique-student-houses" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="TermFlow for Boutique Student Housing Providers | From £99/month"
        description="Affordable AI automation for independent student housing providers with 10-100 beds. Save 20+ hours/week, achieve 95% occupancy, and reclaim your evenings. No tech team needed. 14-day free trial."
        keywords="student house automation, small landlord software, independent student accommodation, affordable lettings automation, boutique PBSA"
        canonical="https://termflow.co.uk/sectors/boutique-student-houses"
        ogUrl="https://termflow.co.uk/sectors/boutique-student-houses"
      />

      <BreadcrumbSchema items={breadcrumbItems} />

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
            <Button asChild size="sm" variant="default" data-testid="button-book-demo">
              <a href="/book-demo">Try Free for 14 Days</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <LastUpdated date="January 20, 2025" className="mb-8" />

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Home className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              TermFlow for Boutique Student Housing Providers
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            Affordable AI automation for independent landlords and small providers managing 10-100 student beds. Simple setup, no tech team required, from £99/month.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Badge variant="secondary" data-testid="badge-sector">Small Providers</Badge>
            <Badge variant="default" data-testid="badge-pricing">From £99/month</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-target-audience">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-tf-navy" />
              Who This Is For
            </CardTitle>
            <CardDescription>
              Independent landlords and small student accommodation providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Your Portfolio</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>10-100 beds across 3-15 properties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Mix of HMOs, student houses, and small blocks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Owner-operated or small family business</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Focused on one or two university cities</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Your Reality</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>You do everything: lettings, viewings, maintenance, admin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>No dedicated admin team or property manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Budget-conscious and cost-sensitive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Want to grow but can't afford to hire staff</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-pain-points">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Your Daily Struggle
            </CardTitle>
            <CardDescription>
              The reality of running a one-person student housing operation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Drowning in Manual Admin</h3>
                <p className="text-sm text-muted-foreground">
                  4-6 hours daily responding to WhatsApp, email, and phone enquiries. Manually sending viewing links, generating contracts, chasing deposits. You're working evenings and weekends just to keep up. Can't switch off because enquiries come 24/7.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Clearing Season Panic</h3>
                <p className="text-sm text-muted-foreground">
                  August brings 50-100 enquiries per week for your 32 beds. You physically can't respond fast enough whilst also doing viewings. Losing bookings to faster competitors with bigger teams. Desperate to hire temporary help but can't justify the cost.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">No Work-Life Balance</h3>
                <p className="text-sm text-muted-foreground">
                  Checking messages at 10 PM, on holiday, during family dinners. Students expect instant responses. Feel guilty if you don't reply within an hour. This isn't why you got into property - you wanted passive income, not a second full-time job.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Can't Afford Enterprise Software</h3>
                <p className="text-sm text-muted-foreground">
                  Looked at property management systems that cost £5,000+ per year. Can't justify that for 32 beds when margins are tight. Stuck with spreadsheets, manual processes, and inbox overwhelm. Know there must be a better way but can't find affordable solutions.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Occupancy Anxiety</h3>
                <p className="text-sm text-muted-foreground">
                  Every empty bed costs £400/month in lost rent. Need 95%+ occupancy to make numbers work. But you're so busy with admin that you can't focus on marketing and conversions. Vicious cycle of being too busy to prevent being too busy.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Growth is Impossible</h3>
                <p className="text-sm text-muted-foreground">
                  Could buy another property but already maxed out on time. Can't scale without hiring staff, which destroys your profit margins. Trapped at current size because manual processes don't scale. Dream of 100 beds feels impossible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-how-termflow-helps">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              How TermFlow Transforms Your Life
            </CardTitle>
            <CardDescription>
              Affordable automation that reclaims 20+ hours per week
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">WhatsApp-First Automation</h3>
              <p className="text-sm text-muted-foreground mb-3">
                AI responds to every enquiry within 60 seconds via WhatsApp, email, or web chat. Students get instant property details, availability, and viewing booking links. No more checking messages at 10 PM - the AI handles it whilst you sleep. Wake up to booked viewings, not unanswered enquiries.
              </p>
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm font-medium">Manchester Landlord Success Story</p>
                <p className="text-sm text-muted-foreground mt-1">
                  32 beds across 5 properties. Was spending 4-6 hours daily on admin. TermFlow reduced this to 45 minutes per day - just handling approvals and viewings. Reclaimed evenings and weekends. Occupancy improved from 88% to 95% because AI responds instantly to every enquiry. "I actually went on holiday this year without checking messages. Game-changer."
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Automated Viewing Bookings</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Students book their own viewings from available slots in your Google Calendar. Automatic reminders 24 hours and 2 hours before viewing. Rescheduling handled automatically without back-and-forth. You just show up for confirmed viewings.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Digital Contracts & Deposits</h3>
              <p className="text-sm text-muted-foreground mb-3">
                AI generates contracts automatically using your templates. DocuSign integration for legally binding e-signatures. Stripe payment links for deposits with automatic receipts. Deposit protection registration handled automatically. What used to take 3 hours now takes 10 minutes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Simple Setup - No Tech Team Required</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Connect your WhatsApp Business account, Google Calendar, and email. Upload your property details and contract templates. You're live in 2 hours. No technical knowledge required. We guide you through everything.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-use-cases">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-tf-navy" />
              Perfect For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">One-Person Operations</h3>
                <p className="text-sm text-muted-foreground">You wear all hats: landlord, letting agent, maintenance coordinator, accounts. TermFlow handles the repetitive communications so you can focus on viewings and strategy.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Clearing Season Survival</h3>
                <p className="text-sm text-muted-foreground">Handle 50-100 enquiries per week without drowning. AI books viewings, qualifies leads, and generates contracts whilst you focus on showing properties.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Work-Life Balance</h3>
                <p className="text-sm text-muted-foreground">Stop checking messages at 10 PM. Take holidays without guilt. Reclaim evenings and weekends. Let the AI handle 24/7 communications.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Growing from 20 to 50+ Beds</h3>
                <p className="text-sm text-muted-foreground">Scale your portfolio without hiring staff. The AI scales with you - 10 beds or 100 beds, same affordable pricing.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-metrics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Typical Results
            </CardTitle>
            <CardDescription>
              What boutique operators achieve with TermFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">20+ hrs</div>
                <div className="text-sm text-muted-foreground mt-1">Saved per week</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">95%</div>
                <div className="text-sm text-muted-foreground mt-1">Occupancy rate</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">£99</div>
                <div className="text-sm text-muted-foreground mt-1">Starting price/month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-pricing">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-tf-navy" />
              Simple, Affordable Pricing
            </CardTitle>
            <CardDescription>
              No enterprise nonsense. Just honest pricing for small operators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="font-semibold text-2xl mb-2">From £99/month</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pay per property, not per bed. Perfect for 10-50 bed portfolios. No setup fees, no contracts, cancel anytime.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>WhatsApp, email, and web chat automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Automated viewing booking and reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Digital contracts and deposit collection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>14-day free trial - no credit card required</span>
                  </li>
                </ul>
              </div>
              <Button asChild size="lg" className="w-full" data-testid="button-cta-trial">
                <a href="/book-demo">Try TermFlow Free for 14 Days</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
