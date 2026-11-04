import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Link as LinkIcon, Zap, CheckCircle, XCircle, AlertTriangle, Shield } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function RPAVsAPIIntegration() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Comparisons", url: "/comparisons" },
    { name: "RPA vs API Integration", url: "/comparisons/rpa-vs-api-integration" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="RPA vs API Integration for PBSA: Which Approach is Right? | TermFlow"
        description="Complete comparison of RPA (Robotic Process Automation) vs API-first integration for student accommodation. Learn when to use each approach, pros/cons, and how TermFlow's hybrid strategy reduces failures by 85%."
        keywords="RPA vs API, PBSA integration, robotic process automation, API integration, PBSA software integration, legacy system integration"
        canonical="https://termflow.co.uk/comparisons/rpa-vs-api-integration"
        ogUrl="https://termflow.co.uk/comparisons/rpa-vs-api-integration"
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
            <LinkIcon className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              RPA vs API Integration for PBSA: Which Approach is Right?
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            Comprehensive comparison of Robotic Process Automation (RPA) and API-first integration for student accommodation operations. Understand when to use each approach and why TermFlow's hybrid strategy delivers 85% fewer failures.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Badge variant="secondary" data-testid="badge-category">Technical Comparison</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-definitions">
          <CardHeader>
            <CardTitle>What Are RPA and API Integration?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  RPA (Robotic Process Automation)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Software "robots" that mimic human actions by clicking buttons, filling forms, and copying data through a system's user interface. RPA doesn't require API access - it automates through the front-end just like a human would.
                </p>
                <p className="text-sm font-medium">Example:</p>
                <p className="text-sm text-muted-foreground">
                  RPA bot logs into your property management system, navigates to "Add New Lead", fills in the form fields by copying data from an email, clicks "Save", then logs into your CRM to repeat the process.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-green-600" />
                  API Integration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Direct system-to-system connection using Application Programming Interfaces (APIs). No user interface involved - data flows directly between databases via structured code, like two computers talking in their own language.
                </p>
                <p className="text-sm font-medium">Example:</p>
                <p className="text-sm text-muted-foreground">
                  API call sends lead data directly to your property management system's database in milliseconds. System instantly creates record, assigns ID, triggers workflows - all programmatically without any UI interaction.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-comparison-table">
          <CardHeader>
            <CardTitle>Side-by-Side Comparison</CardTitle>
            <CardDescription>
              Feature-by-feature analysis of RPA vs API integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2">Factor</th>
                    <th className="text-center p-2">RPA</th>
                    <th className="text-center p-2">API Integration</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="p-2 font-medium">Setup Time</td>
                    <td className="text-center p-2">1-2 weeks</td>
                    <td className="text-center p-2">2-6 weeks</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Requires API Access</td>
                    <td className="text-center p-2"><XCircle className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Works with Legacy Systems</td>
                    <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center p-2"><XCircle className="h-4 w-4 text-red-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Speed (per action)</td>
                    <td className="text-center p-2">10-30 seconds</td>
                    <td className="text-center p-2">0.1-1 second</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Reliability</td>
                    <td className="text-center p-2">75-85%</td>
                    <td className="text-center p-2">99.5%+</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Breaks When UI Changes</td>
                    <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-amber-500 mx-auto" /></td>
                    <td className="text-center p-2"><XCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Maintenance Effort</td>
                    <td className="text-center p-2">High</td>
                    <td className="text-center p-2">Low</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Cost at Scale</td>
                    <td className="text-center p-2">Increases with volume</td>
                    <td className="text-center p-2">Fixed, scalable</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Error Handling</td>
                    <td className="text-center p-2">Complex</td>
                    <td className="text-center p-2">Simple</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Best For</td>
                    <td className="text-center p-2">Quick wins, legacy systems</td>
                    <td className="text-center p-2">High volume, mission-critical</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card data-testid="card-rpa-pros-cons">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                RPA Pros & Cons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Advantages
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Works with any system (even Excel spreadsheets)</li>
                    <li>• No API access or vendor cooperation required</li>
                    <li>• Faster initial setup (1-2 weeks vs 4-6 weeks)</li>
                    <li>• Good for quick wins and proof of concept</li>
                    <li>• Can automate processes across multiple disconnected systems</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    Disadvantages
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Breaks when UI changes (website redesign = rebuild RPA)</li>
                    <li>• Slow (10-30 seconds per action vs 0.1 second API)</li>
                    <li>• Higher failure rate (15-25% vs 0.5% for APIs)</li>
                    <li>• Expensive at scale (bot licenses + maintenance)</li>
                    <li>• Complex error handling (can't distinguish UI issue from data issue)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-api-pros-cons">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-green-600" />
                API Integration Pros & Cons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Advantages
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 99.5%+ reliability - rock solid</li>
                    <li>• Fast (0.1-1 second vs 10-30 seconds RPA)</li>
                    <li>• UI changes don't affect integration</li>
                    <li>• Low maintenance once built</li>
                    <li>• Scales to millions of transactions with same cost</li>
                    <li>• Simple, predictable error handling</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    Disadvantages
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Requires vendor to provide API access</li>
                    <li>• Longer initial setup (2-6 weeks)</li>
                    <li>• Doesn't work with legacy systems without APIs</li>
                    <li>• May require vendor cooperation/documentation</li>
                    <li>• Some vendors charge for API access</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8" data-testid="card-when-to-use">
          <CardHeader>
            <CardTitle>When to Use Each Approach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 border-l-4 border-l-amber-500 pl-4">
                <h3 className="font-semibold text-lg">Use RPA When...</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>System has no API and vendor won't provide one</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>You need a quick proof of concept (1-2 weeks)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Automation spans multiple disconnected legacy systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Volume is low (fewer than 100 actions/day)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Process is not mission-critical (can tolerate 15% failure rate)</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 border-l-4 border-l-green-600 pl-4">
                <h3 className="font-semibold text-lg">Use API Integration When...</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Vendor provides API access (most modern systems do)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>High volume (100+ actions/day)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Mission-critical workflow (need 99%+ reliability)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Speed is important (real-time processing required)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Long-term automation (will run for years)</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-termflow-approach">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-tf-navy" />
              The TermFlow Hybrid Approach
            </CardTitle>
            <CardDescription>
              Best of both worlds: APIs where available, intelligent RPA for legacy systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Why Hybrid Beats Pure RPA or Pure API</h3>
              <p className="text-sm text-muted-foreground mb-3">
                TermFlow doesn't force you into one approach. We use API integrations for 80% of workflows (Stripe, DocuSign, WhatsApp, Google Calendar - all have excellent APIs). For the remaining 20% where APIs don't exist (legacy university systems, old property management software), we use intelligent RPA with enhanced error handling.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Real-World Example: PBSA Operator Migration</h3>
              <div className="bg-muted/50 p-4 rounded-md space-y-3">
                <p className="text-sm"><strong>Challenge:</strong></p>
                <p className="text-sm text-muted-foreground">
                  350-bed operator was using pure RPA to connect their legacy student CRM (no API) to Stripe for payments. RPA failure rate was 28% - requiring manual intervention on 1 in 4 transactions.
                </p>
                <p className="text-sm"><strong>TermFlow Hybrid Solution:</strong></p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Stripe payments: API integration (99.9% success rate)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Legacy CRM: Intelligent RPA with retry logic and error detection (96% success rate, up from 72%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Overall failure rate reduced from 28% to 4%</span>
                  </li>
                </ul>
                <p className="text-sm"><strong>Result:</strong></p>
                <p className="text-sm text-muted-foreground">
                  85% reduction in integration failures. Manual intervention reduced from 98 transactions/month to 14. Team saved 12 hours/week troubleshooting failed automations.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">TermFlow's Smart RPA Enhancements</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Intelligent Retry Logic</h4>
                  <p className="text-xs text-muted-foreground">RPA detects temporary failures (slow loading) vs permanent (wrong credentials). Auto-retries temporary failures 3 times with exponential backoff.</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">UI Change Detection</h4>
                  <p className="text-xs text-muted-foreground">AI detects when target system's UI has changed. Alerts team immediately instead of silently failing for days.</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Fallback Workflows</h4>
                  <p className="text-xs text-muted-foreground">If RPA fails 3 times, creates task for human intervention with all context. Prevents data loss.</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Monitoring & Alerts</h4>
                  <p className="text-xs text-muted-foreground">Real-time monitoring of RPA success rates. Alert sent if success rate drops below 90% in 24-hour period.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-maintenance">
          <CardHeader>
            <CardTitle>Maintenance Requirements</CardTitle>
            <CardDescription>
              What to expect after implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2">Maintenance Task</th>
                    <th className="text-center p-2">RPA</th>
                    <th className="text-center p-2">API</th>
                    <th className="text-center p-2">TermFlow Hybrid</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="p-2">UI change updates</td>
                    <td className="text-center p-2">Every 3-6 months</td>
                    <td className="text-center p-2">N/A</td>
                    <td className="text-center p-2">Rarely (auto-detected)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">API version upgrades</td>
                    <td className="text-center p-2">N/A</td>
                    <td className="text-center p-2">Annually</td>
                    <td className="text-center p-2">Annually (managed by us)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Failure troubleshooting</td>
                    <td className="text-center p-2">Weekly</td>
                    <td className="text-center p-2">Rare</td>
                    <td className="text-center p-2">Monthly</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Average hours/month</td>
                    <td className="text-center p-2">8-12 hours</td>
                    <td className="text-center p-2">1-2 hours</td>
                    <td className="text-center p-2">2-3 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-cta">
          <CardHeader>
            <CardTitle>Discuss Your Integration Needs</CardTitle>
            <CardDescription>Let us design the right approach for your systems</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Book a technical consultation to discuss your existing systems. We'll recommend whether API, RPA, or hybrid is best for each integration. Bring your IT team - we'll answer all technical questions.
            </p>
            <Button asChild size="lg" data-testid="button-cta-demo">
              <a href="/book-demo">Discuss Your Integration Needs</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
