import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, X, Building2, Shield, Zap, TrendingUp, FileCheck, Users, Globe, Wrench } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { SiteSearch } from "@/components/SiteSearch";

export default function WhyTermFlow() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Why TermFlow", url: "/why-termflow" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="Why TermFlow vs Generic Automation? | Built for PBSA"
        description="Discover why TermFlow outperforms Zapier, Make, and generic RPA tools for PBSA operators. Purpose-built features, deeper integrations, and 20+ hours saved per week."
        keywords="TermFlow vs Zapier, PBSA automation comparison, student accommodation software, Make vs TermFlow, purpose-built automation"
        canonical="https://termflow.co.uk/why-termflow"
        ogUrl="https://termflow.co.uk/why-termflow"
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
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">
            Why TermFlow vs Generic Automation Tools?
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl">
            You could spend months configuring Zapier, Make, or building your own RPA system. Or you could use TermFlow, purpose-built for PBSA, and go live in 2 weeks.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
          </div>
        </div>

        {/* Key Difference Statement */}
        <Card className="mb-12 border-2 border-tf-navy" data-testid="card-key-difference">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Building2 className="h-16 w-16 text-tf-navy flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Built for PBSA, Not Configured for It</h2>
                <p className="text-lg text-muted-foreground">
                  Generic automation tools require you to become a no-code developer. TermFlow is a complete PBSA platform that understands Right-to-Rent, deposit protection, student data handling, and property portals out of the box.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card className="mb-12" data-testid="card-comparison-table">
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
            <CardDescription>
              How TermFlow compares to generic automation platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table data-testid="table-comparison">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Feature</TableHead>
                    <TableHead className="text-center">TermFlow</TableHead>
                    <TableHead className="text-center">Zapier / Make</TableHead>
                    <TableHead className="text-center">Generic RPA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Setup Time</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mb-1" />
                        <span className="text-sm">1-2 weeks</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <X className="h-5 w-5 text-red-500 mb-1" />
                        <span className="text-sm">3-6 months</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <X className="h-5 w-5 text-red-500 mb-1" />
                        <span className="text-sm">6-12 months</span>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">PBSA-Specific AI Training</TableCell>
                    <TableCell className="text-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Right-to-Rent Compliance</TableCell>
                    <TableCell className="text-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Deposit Protection Integration</TableCell>
                    <TableCell className="text-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Student CRM (Profiles, Timeline, Applications)</TableCell>
                    <TableCell className="text-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Property Portal Integration (Rightmove, Zoopla)</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mb-1" />
                        <span className="text-sm">Native</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <X className="h-5 w-5 text-amber-500 mb-1" />
                        <span className="text-sm">Email parsing only</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">WhatsApp Business API (Pre-configured)</TableCell>
                    <TableCell className="text-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <X className="h-5 w-5 text-amber-500 mb-1" />
                        <span className="text-sm">Manual setup</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Digital Contract Templates (UK PBSA Compliant)</TableCell>
                    <TableCell className="text-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Multi-Language Student Support (25+ languages)</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mb-1" />
                        <span className="text-sm">Auto-detect</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <X className="h-5 w-5 text-amber-500 mb-1" />
                        <span className="text-sm">Manual config</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">GDPR & UK Data Residency</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mb-1" />
                        <span className="text-sm">UK/EU only</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <X className="h-5 w-5 text-amber-500 mb-1" />
                        <span className="text-sm">Global</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <X className="h-5 w-5 text-amber-500 mb-1" />
                        <span className="text-sm">Varies</span>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Ongoing Maintenance Required</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mb-1" />
                        <span className="text-sm">Managed</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <X className="h-5 w-5 text-red-500 mb-1" />
                        <span className="text-sm">You maintain</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <X className="h-5 w-5 text-red-500 mb-1" />
                        <span className="text-sm">You maintain</span>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-tf-navy/5">
                    <TableCell className="font-bold">Total Cost of Ownership (Annual, 300 beds)</TableCell>
                    <TableCell className="text-center font-bold text-tf-navy">£3,588</TableCell>
                    <TableCell className="text-center font-bold text-muted-foreground">£8,000+</TableCell>
                    <TableCell className="text-center font-bold text-muted-foreground">£15,000+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              * Zapier/Make costs include platform fees + developer time + ongoing maintenance. Generic RPA includes development, hosting, and maintenance costs.
            </p>
          </CardContent>
        </Card>

        {/* PBSA-Specific Features */}
        <Card className="mb-12" data-testid="card-pbsa-features">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-tf-navy" />
              PBSA-Specific Features That Matter
            </CardTitle>
            <CardDescription>
              Features you can't get from generic automation tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-tf-navy" />
                  Right-to-Rent Compliance
                </h3>
                <p className="text-sm text-muted-foreground">
                  Automatic Right-to-Rent document collection, verification, and storage. Compliant with UK Immigration Act requirements. Audit trail for inspections. Learn more in our{" "}
                  <Link href="/playbooks/id-document-collection" className="text-primary hover:underline" data-testid="link-id-document-collection-playbook">
                    ID document collection playbook
                  </Link>
                  .
                </p>
                <p className="text-sm italic text-muted-foreground">
                  Generic tools: You'd need to build this from scratch, including secure document storage, expiry tracking, and compliance reporting.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-tf-navy" />
                  Deposit Protection Integration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Automatic deposit registration with TDS, DPS, or MyDeposits. Compliance tracking. Overdue reminders. One-click export for audits.
                </p>
                <p className="text-sm italic text-muted-foreground">
                  Generic tools: No pre-built deposit protection integrations. You'd manually export data to CSV and upload to schemes.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-tf-navy" />
                  International Student Workflows
                </h3>
                <p className="text-sm text-muted-foreground">
                  Auto-detect student language (25+ supported). Timezone-aware scheduling. Currency conversion for international payments. Visa status tracking.
                </p>
                <p className="text-sm italic text-muted-foreground">
                  Generic tools: You'd configure language detection, translation APIs, and timezone logic manually—and maintain it forever.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-tf-navy" />
                  Student Lifecycle Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complete student journey: Enquiry → Viewing → Application → Contract → Move-in → Renewals. Automated communications at each stage. See our{" "}
                  <Link href="/playbooks/tenant-onboarding-automation" className="text-primary hover:underline" data-testid="link-tenant-onboarding-automation-playbook">
                    tenant onboarding automation playbook
                  </Link>
                  {" "}for details.
                </p>
                <p className="text-sm italic text-muted-foreground">
                  Generic tools: You'd build this workflow from scratch using dozens of connected Zaps. Any change breaks the entire chain.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-tf-navy" />
                  Property Portal Integration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Native integration with Rightmove, Zoopla, OpenRent. Instant lead capture. Automatic response within 30 seconds.
                </p>
                <p className="text-sm italic text-muted-foreground">
                  Generic tools: Limited to email parsing. Miss leads that come through messaging features. No real-time capture.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-tf-navy" />
                  Clearing Season Mode
                </h3>
                <p className="text-sm text-muted-foreground">
                  Handle 500+ enquiries per week. Auto-prioritise urgent leads. Bulk messaging. Real-time occupancy forecasting.
                </p>
                <p className="text-sm italic text-muted-foreground">
                  Generic tools: No concept of "clearing season". No surge handling. You'd need to manually scale infrastructure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Measurable Differentiators */}
        <Card className="mb-12 border-2 border-tf-navy" data-testid="card-metrics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-tf-navy" />
              Measurable Performance Differentiators
            </CardTitle>
            <CardDescription>
              Real metrics from operators using TermFlow. View complete{" "}
              <Link href="/outcomes" className="text-primary hover:underline" data-testid="link-outcomes">
                case studies and outcomes
              </Link>
              {" "}from PBSA operators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-tf-navy mb-2">95%</div>
                <div className="text-sm text-muted-foreground">AI response accuracy (vs 60-70% for generic chatbots)</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-tf-navy mb-2">20+ hours</div>
                <div className="text-sm text-muted-foreground">Saved per week (vs 5-10 hours for basic automation)</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-tf-navy mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Average occupancy (vs 92% industry average)</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-tf-navy mb-2">30 sec</div>
                <div className="text-sm text-muted-foreground">Average response time (vs 4+ hours manual)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Case Study Comparison */}
        <Card className="mb-12" data-testid="card-case-study">
          <CardHeader>
            <CardTitle>Real Operator Experience: TermFlow vs Zapier</CardTitle>
            <CardDescription>
              Newcastle operator with 280 beds tried both approaches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">First Attempt: Zapier (6 months)</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Spent 3 months building workflows with external consultant (cost: £6,000)</li>
                  <li>• Required ongoing maintenance when integrations broke (5-8 hours/month)</li>
                  <li>• AI responses were generic, often incorrect about property details</li>
                  <li>• No Right-to-Rent or deposit protection integration</li>
                  <li>• Built basic email parsing for Rightmove leads (missed 40% of enquiries)</li>
                  <li>• WhatsApp required separate Twilio setup (£500 setup + ongoing costs)</li>
                  <li>• Final outcome: Abandoned after 6 months, £8,500 sunk cost</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-tf-navy">Second Attempt: TermFlow (2 weeks)</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Onboarded in 10 days: property data import, calendar sync, AI training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>AI understood PBSA context: room types, academic year, clearing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Right-to-Rent and deposit protection built-in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>WhatsApp Business API pre-configured, working day one</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Native Rightmove/Zoopla integration capturing 100% of leads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Zero maintenance required—updates handled automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Result: 94% → 98% occupancy, 22 hours/week saved</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Real Cost */}
        <Card className="mb-12" data-testid="card-real-cost">
          <CardHeader>
            <CardTitle>The Real Cost of "Configuring It Yourself"</CardTitle>
            <CardDescription>
              Hidden costs of generic automation platforms for PBSA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Platform subscription (Zapier Pro or Make)</span>
                <span className="font-semibold">£600-1,200/year</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">External consultant to build workflows (3 months)</span>
                <span className="font-semibold">£6,000-12,000</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Separate WhatsApp Business API setup (Twilio)</span>
                <span className="font-semibold">£500-1,500/year</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">OpenAI API for chatbot (if you manage to configure it)</span>
                <span className="font-semibold">£300-800/year</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Ongoing maintenance (5-8 hours/month @ £50/hour)</span>
                <span className="font-semibold">£3,000-4,800/year</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Lost leads due to broken integrations (10% of pipeline)</span>
                <span className="font-semibold">£5,000-15,000/year</span>
              </div>
              <div className="flex justify-between items-center py-4 border-t-2 border-tf-navy">
                <span className="font-bold text-lg">Total Cost (Year 1)</span>
                <span className="font-bold text-lg text-tf-navy">£15,400-35,300</span>
              </div>
            </div>

            <div className="mt-6 bg-tf-navy/5 p-6 rounded-md border border-tf-navy/20">
              <h4 className="font-semibold mb-2">TermFlow Alternative:</h4>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">£299/month × 12 months (includes everything)</span>
                <span className="font-bold text-tf-navy text-xl">£3,588/year</span>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                No setup fees. No consultants. No maintenance. No surprise costs. Working in 2 weeks.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-tf-navy to-tf-navy-700 rounded-lg p-8 md:p-12 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Stop Configuring, Start Operating
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            See why PBSA operators choose TermFlow over generic automation tools. Book a demo and we'll show you the difference in 30 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" data-testid="button-cta-demo">
              <a href="/book-demo">Book Your Free Demo</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20" data-testid="button-cta-calculator">
              <a href="/roi-calculator">Calculate Your Savings</a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
