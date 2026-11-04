import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Globe, Languages, Shield, Clock, CheckCircle, FileCheck, UserCheck, Zap } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function InternationalIntakes() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Sectors", url: "/sectors" },
    { name: "International Intakes", url: "/sectors/international-intakes" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="TermFlow for Operators with High International Student Volumes | Multilingual AI"
        description="Purpose-built for operators with 50%+ international students. Multilingual AI in 10+ languages, visa workflow automation, RTR compliance, and 24/7 multi-timezone support. 98% visa compliance guaranteed."
        keywords="international student accommodation, multilingual student housing, visa automation, right-to-rent international students, BRP tracking, sponsor licence compliance"
        canonical="https://termflow.co.uk/sectors/international-intakes"
        ogUrl="https://termflow.co.uk/sectors/international-intakes"
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
              <a href="/book-demo">Book Demo</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <LastUpdated date="January 20, 2025" className="mb-8" />

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              TermFlow for Operators with High International Student Volumes
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            Purpose-built for operators with 50%+ international students. Multilingual AI in 10+ languages, visa workflow automation, RTR compliance, and 24/7 multi-timezone support.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Badge variant="secondary" data-testid="badge-sector">International</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-target-audience">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-tf-navy" />
              Who This Is For
            </CardTitle>
            <CardDescription>
              Operators with high international student populations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Your Student Population</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>50-90% international students</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>High volumes from China, India, Nigeria, Saudi Arabia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Tier 4 visa holders requiring sponsor licence compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>London, Manchester, or other international student hubs</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Your Challenges</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Language barriers in communications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Complex visa documentation requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>24/7 enquiries across 12+ timezones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-tf-navy mt-0.5 flex-shrink-0" />
                    <span>Right-to-Rent compliance for visa holders</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-pain-points">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-amber-500" />
              International Student Complexity
            </CardTitle>
            <CardDescription>
              Why international students require specialist workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Language Barriers</h3>
                <p className="text-sm text-muted-foreground">
                  Chinese students message you in Mandarin at 3 AM UK time. Nigerian students prefer voice notes in Yoruba. Your team uses Google Translate, which gives awful translations that confuse students more. You're losing bookings because students can't understand your responses.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Timezone Nightmare</h3>
                <p className="text-sm text-muted-foreground">
                  Beijing is 8 hours ahead. Mumbai is 5.5 hours ahead. Lagos is 1 hour behind. Students expect responses during their daytime, which is your night-time. Can't hire 24/7 staff for 150 beds. Missing enquiries because you're asleep.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Visa Document Complexity</h3>
                <p className="text-sm text-muted-foreground">
                  Need passport, visa, BRP, CAS letter, bank statements, and sponsor licence documents. Documents in Arabic, Mandarin, Hindi. OCR tools can't read non-English text. Manual verification takes 45 minutes per student. With 200 international students, that's 150 hours of document checking.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Right-to-Rent for Visa Holders</h3>
                <p className="text-sm text-muted-foreground">
                  Tier 4 visa RTR checks are different from UK passports. Need to verify visa conditions, check study restrictions, validate BRP. Home Office guidance is 50 pages long. One mistake could cost you £3,000 civil penalty. Manual process prone to errors.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Parent/Guarantor Communication</h3>
                <p className="text-sm text-muted-foreground">
                  Parents in China don't speak English. They want WeChat communication, not email. Indian parents need WhatsApp in Hindi. Saudi parents prefer Arabic. You're using Google Translate to communicate with guarantors, risking misunderstandings on legal contracts.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">BRP and Visa Expiry Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Tier 4 visas expire mid-tenancy. BRPs need tracking. Student visa extended but forgot to update you. You have legal obligation to report if visa expires. Manual spreadsheet tracking is error-prone and audit risk.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-how-termflow-helps">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              Multilingual AI Built for International Students
            </CardTitle>
            <CardDescription>
              Native-level fluency in 10+ languages with visa and compliance automation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">10+ Languages, Native Fluency</h3>
              <p className="text-sm text-muted-foreground mb-3">
                AI agent communicates fluently in Mandarin, Cantonese, Arabic, Spanish, French, Hindi, Urdu, Portuguese, German, and Italian. Not Google Translate - actual native-level conversations. Detects student's language preference automatically from first message. Chinese student gets responses in Simplified Chinese, Indian student in Hindi or English.
              </p>
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm font-medium">London Operator Case Study</p>
                <p className="text-sm text-muted-foreground mt-1">
                  350 beds, 70% international students (40% Chinese, 20% Middle East, 10% Indian). Before TermFlow, used Google Translate causing confusion. Now AI responds in student's native language instantly. International student bookings increased 28%. RTR compliance improved from 94% to 99%. "Students tell us they chose us because we communicated clearly in their language from day one."
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">24/7 Multi-Timezone Support</h3>
              <p className="text-sm text-muted-foreground mb-3">
                AI never sleeps. Chinese student messages at 3 AM UK time (11 AM Beijing time) - gets instant response in Mandarin. Nigerian student contacts at 10 PM UK time (11 PM Lagos time) - instant response. You wake up to booked viewings, not unanswered messages.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Visa Document Collection & OCR</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Automated document request workflow in student's language. OCR reads documents in any language - extracts data from Chinese passports, Arabic BRPs, Hindi bank statements. Auto-validates visa expiry dates, checks study restrictions, flags issues. Reduces 45-minute manual verification to 3-minute AI check.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Right-to-Rent for Visa Holders</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Automated RTR workflow specifically for Tier 4 visa holders. Checks visa type, study restrictions, BRP validity. Generates compliant RTR checklist for landlord approval. Creates audit trail for Home Office compliance. Alerts you 30 days before visa expiry.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">BRP and Visa Expiry Tracking</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Automatic tracking of BRP and visa expiry dates. Alerts sent 60, 30, and 14 days before expiry. Student receives reminder in their language to provide updated documents. Compliance dashboard shows all students with visas expiring soon.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">International Guarantor Workflow</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Guarantor forms sent to parents in their language. Chinese parent gets Simplified Chinese form with WeChat payment link. Indian parent gets Hindi form with WhatsApp link. Timezone-appropriate sending (9 AM parent's local time). DocuSign supports non-English signatures.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-languages">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-tf-navy" />
              Supported Languages
            </CardTitle>
            <CardDescription>
              Native-level AI communication in 10+ languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">English (UK)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">Mandarin (Simplified)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">Cantonese</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">Arabic (Modern Standard)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">Hindi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">Spanish</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">French</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">Portuguese</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">German</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">Italian</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">Urdu</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">Japanese</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-metrics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Success Metrics
            </CardTitle>
            <CardDescription>
              Results from operators with high international volumes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">98%</div>
                <div className="text-sm text-muted-foreground mt-1">Visa compliance rate</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">Multi-timezone coverage</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-tf-navy">95%</div>
                <div className="text-sm text-muted-foreground mt-1">Document accuracy (OCR)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-compliance">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-tf-navy" />
              UK Visa Compliance
            </CardTitle>
            <CardDescription>
              Built-in compliance for UK sponsor licence holders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              TermFlow understands UK visa sponsor duties and Right-to-Rent requirements for international students. Automated workflows ensure you meet Home Office obligations whilst reducing manual compliance work.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Tier 4 visa verification and study restriction checks</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>BRP validity confirmation with Home Office database integration</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Automated alerts for visa expiry (60, 30, 14 days)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>RTR audit trail for civil penalty protection</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-cta">
          <CardHeader>
            <CardTitle>International Student Demo</CardTitle>
            <CardDescription>See multilingual AI and visa automation in action</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              We'll demonstrate AI conversations in Mandarin, Arabic, and Hindi. Show you visa document OCR extracting data from non-English documents. Walk through RTR compliance workflows for Tier 4 visa holders.
            </p>
            <Button asChild size="lg" data-testid="button-cta-demo">
              <a href="/book-demo">International Student Demo Available</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
