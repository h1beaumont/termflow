import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { LastUpdated } from "@/components/LastUpdated";
import { Zap, DollarSign, CheckCircle, XCircle, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";

export default function ZapierVsMaken8n() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Comparisons", url: "/comparisons" },
    { name: "Zapier vs Make vs n8n", url: "/comparisons/zapier-vs-make-vs-n8n" }
  ];

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="Zapier vs Make vs n8n for PBSA Automation: Honest Comparison | TermFlow"
        description="Detailed comparison of Zapier, Make, n8n and TermFlow for student accommodation automation. Cost analysis at scale (100-1000 beds), learning curve, reliability, and migration paths. See which tool is right for your PBSA operation."
        keywords="Zapier vs Make, PBSA automation tools, n8n student accommodation, workflow automation comparison, TermFlow vs Zapier"
        canonical="https://termflow.co.uk/comparisons/zapier-vs-make-vs-n8n"
        ogUrl="https://termflow.co.uk/comparisons/zapier-vs-make-vs-n8n"
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
            <Zap className="h-10 w-10 text-tf-navy" />
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              Zapier vs Make vs n8n for PBSA Automation: Honest Comparison
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl">
            Comprehensive comparison of generic automation tools (Zapier, Make, n8n) versus purpose-built PBSA automation (TermFlow). See costs at scale, learning curves, reliability, and migration paths. Check our{" "}
            <Link href="/playbooks" className="text-primary hover:underline" data-testid="link-playbooks-hub">
              automation playbooks
            </Link>
            {" "}to see what TermFlow can build for you.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" data-testid="badge-updated">Last Updated: January 2025</Badge>
            <Badge variant="secondary" data-testid="badge-category">Tool Comparison</Badge>
          </div>
        </div>

        <Card className="mb-8" data-testid="card-feature-comparison">
          <CardHeader>
            <CardTitle>Feature Comparison Table</CardTitle>
            <CardDescription>
              How each tool handles PBSA automation workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2">Feature</th>
                    <th className="text-center p-2">Zapier</th>
                    <th className="text-center p-2">Make</th>
                    <th className="text-center p-2">n8n</th>
                    <th className="text-center p-2">TermFlow</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="p-2 font-medium">PBSA-Specific Features</td>
                    <td className="text-center p-2"><XCircle className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="text-center p-2"><XCircle className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="text-center p-2"><XCircle className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Pre-built Student Workflows</td>
                    <td className="text-center p-2"><XCircle className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="text-center p-2"><XCircle className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="text-center p-2"><XCircle className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">WhatsApp AI Agent</td>
                    <td className="text-center p-2">Manual setup</td>
                    <td className="text-center p-2">Manual setup</td>
                    <td className="text-center p-2">Manual setup</td>
                    <td className="text-center p-2">Built-in</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Technical Skill Required</td>
                    <td className="text-center p-2">Low</td>
                    <td className="text-center p-2">Medium</td>
                    <td className="text-center p-2">High</td>
                    <td className="text-center p-2">Low</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Setup Time (Full PBSA Stack)</td>
                    <td className="text-center p-2">40-60 hours</td>
                    <td className="text-center p-2">30-40 hours</td>
                    <td className="text-center p-2">50-80 hours</td>
                    <td className="text-center p-2">2-4 hours</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Multilingual Support</td>
                    <td className="text-center p-2">Manual translation</td>
                    <td className="text-center p-2">Manual translation</td>
                    <td className="text-center p-2">Manual translation</td>
                    <td className="text-center p-2">10+ languages built-in</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">PBSA-Specific Integrations</td>
                    <td className="text-center p-2">Build yourself</td>
                    <td className="text-center p-2">Build yourself</td>
                    <td className="text-center p-2">Build yourself</td>
                    <td className="text-center p-2">Pre-built</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Uptime SLA</td>
                    <td className="text-center p-2">99.7%</td>
                    <td className="text-center p-2">99.5%</td>
                    <td className="text-center p-2">Self-hosted</td>
                    <td className="text-center p-2">99.9%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">PBSA-Specific Support</td>
                    <td className="text-center p-2"><XCircle className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="text-center p-2"><XCircle className="h-4 w-4 text-red-500 mx-auto" /></td>
                    <td className="text-center p-2">Community only</td>
                    <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-cost-comparison">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-tf-navy" />
              Cost Comparison at Scale
            </CardTitle>
            <CardDescription>
              Monthly costs for different portfolio sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2">Portfolio Size</th>
                    <th className="text-right p-2">Zapier</th>
                    <th className="text-right p-2">Make</th>
                    <th className="text-right p-2">n8n</th>
                    <th className="text-right p-2">TermFlow</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="p-2 font-medium">100 beds</td>
                    <td className="text-right p-2">£350/mo</td>
                    <td className="text-right p-2">£280/mo</td>
                    <td className="text-right p-2">£150/mo*</td>
                    <td className="text-right p-2 text-green-600 font-semibold">£220/mo</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">200 beds</td>
                    <td className="text-right p-2">£750/mo</td>
                    <td className="text-right p-2">£580/mo</td>
                    <td className="text-right p-2">£200/mo*</td>
                    <td className="text-right p-2 text-green-600 font-semibold">£420/mo</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">500 beds</td>
                    <td className="text-right p-2">£1,900/mo</td>
                    <td className="text-right p-2">£1,450/mo</td>
                    <td className="text-right p-2">£400/mo*</td>
                    <td className="text-right p-2 text-green-600 font-semibold">£980/mo</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">1,000 beds</td>
                    <td className="text-right p-2">£3,800/mo</td>
                    <td className="text-right p-2">£2,900/mo</td>
                    <td className="text-right p-2">£800/mo*</td>
                    <td className="text-right p-2 text-green-600 font-semibold">£1,850/mo</td>
                  </tr>
                  <tr className="border-b bg-muted/30 font-semibold">
                    <td className="p-2">Annual savings vs Zapier (500 beds)</td>
                    <td className="text-right p-2">-</td>
                    <td className="text-right p-2">£5,400</td>
                    <td className="text-right p-2">£18,000*</td>
                    <td className="text-right p-2 text-green-600">£11,040</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * n8n costs include self-hosting infrastructure (server, maintenance, backups). Excludes developer time to build workflows.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Zapier/Make costs based on 50,000 tasks/month for 100 beds, scaling linearly. TermFlow pricing is per-bed, unlimited tasks.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card data-testid="card-zapier">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Zapier
              </CardTitle>
              <CardDescription>Best for: Simple, low-volume workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Strengths
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Easiest to use - no technical knowledge required</li>
                    <li>• 5,000+ pre-built app integrations</li>
                    <li>• Great documentation and tutorials</li>
                    <li>• Reliable uptime (99.7%)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-red-600 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Weaknesses for PBSA
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Extremely expensive at scale (£3,800/mo for 1,000 beds)</li>
                    <li>• No PBSA-specific features or templates</li>
                    <li>• Limited error handling and debugging</li>
                    <li>• No built-in AI agent capabilities</li>
                    <li>• 40-60 hours to build full PBSA automation stack</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-make">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Make (formerly Integromat)
              </CardTitle>
              <CardDescription>Best for: Complex workflows, lower cost than Zapier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Strengths
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• More affordable than Zapier at scale</li>
                    <li>• Visual workflow builder with branching logic</li>
                    <li>• Good for complex, multi-step automations</li>
                    <li>• Better error handling than Zapier</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-red-600 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Weaknesses for PBSA
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Steeper learning curve than Zapier</li>
                    <li>• Still expensive for high-volume PBSA (£2,900/mo for 1,000 beds)</li>
                    <li>• No PBSA-specific templates</li>
                    <li>• Requires technical knowledge for complex workflows</li>
                    <li>• 30-40 hours setup time for PBSA stack</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-n8n">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                n8n
              </CardTitle>
              <CardDescription>Best for: Self-hosted, technical teams, budget-conscious</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Strengths
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Free (self-hosted) or low cloud cost</li>
                    <li>• Full control over data and infrastructure</li>
                    <li>• Open-source with active community</li>
                    <li>• Unlimited executions on self-hosted</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-red-600 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Weaknesses for PBSA
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Requires technical team to set up and maintain</li>
                    <li>• Self-hosting = infrastructure costs, backups, security</li>
                    <li>• 50-80 hours to build PBSA automation from scratch</li>
                    <li>• No PBSA-specific support (community forums only)</li>
                    <li>• You're responsible for uptime and reliability</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-termflow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-tf-navy" />
                TermFlow
              </CardTitle>
              <CardDescription>Best for: PBSA operators who want purpose-built automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Strengths
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Purpose-built for PBSA (pre-built workflows, integrations)</li>
                    <li>• 2-4 hour setup vs 40-80 hours with generic tools</li>
                    <li>• Multilingual AI agent included (10+ languages)</li>
                    <li>• PBSA-specific support team</li>
                    <li>• Competitive pricing with unlimited tasks</li>
                    <li>• 99.9% uptime SLA</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-amber-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Trade-Offs
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Less flexibility for non-PBSA use cases</li>
                    <li>• Not suitable if you need to automate unrelated businesses</li>
                    <li>• More expensive than n8n if you have technical team to build/maintain</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8" data-testid="card-pbsa-workflows">
          <CardHeader>
            <CardTitle>PBSA-Specific Workflows: Which Tool Handles What Best</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2">Workflow</th>
                    <th className="text-center p-2">Zapier</th>
                    <th className="text-center p-2">Make</th>
                    <th className="text-center p-2">n8n</th>
                    <th className="text-center p-2">TermFlow</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="p-2">WhatsApp AI responses</td>
                    <td className="text-center p-2 text-red-500">Manual build (20h)</td>
                    <td className="text-center p-2 text-amber-500">Manual build (15h)</td>
                    <td className="text-center p-2 text-amber-500">Manual build (25h)</td>
                    <td className="text-center p-2 text-green-600">Built-in</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Multilingual support</td>
                    <td className="text-center p-2 text-red-500">Build yourself</td>
                    <td className="text-center p-2 text-red-500">Build yourself</td>
                    <td className="text-center p-2 text-red-500">Build yourself</td>
                    <td className="text-center p-2 text-green-600">10+ languages</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Visa/RTR automation</td>
                    <td className="text-center p-2 text-red-500">No templates</td>
                    <td className="text-center p-2 text-red-500">No templates</td>
                    <td className="text-center p-2 text-amber-500">Build custom</td>
                    <td className="text-center p-2 text-green-600">Pre-built</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Viewing automation</td>
                    <td className="text-center p-2 text-amber-500">Basic</td>
                    <td className="text-center p-2 text-green-600">Good</td>
                    <td className="text-center p-2 text-green-600">Good</td>
                    <td className="text-center p-2 text-green-600">PBSA-optimized</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Guarantor workflows</td>
                    <td className="text-center p-2 text-red-500">Build yourself</td>
                    <td className="text-center p-2 text-amber-500">Build yourself</td>
                    <td className="text-center p-2 text-amber-500">Build yourself</td>
                    <td className="text-center p-2 text-green-600">Pre-built</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Contract generation</td>
                    <td className="text-center p-2 text-amber-500">Via DocuSign</td>
                    <td className="text-center p-2 text-green-600">Via DocuSign</td>
                    <td className="text-center p-2 text-green-600">Via DocuSign</td>
                    <td className="text-center p-2 text-green-600">Pre-built templates</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-migration">
          <CardHeader>
            <CardTitle>Migration Path: From Zapier/Make to TermFlow</CardTitle>
            <CardDescription>
              How to transition without disrupting operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Typical Migration Timeline</h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li><strong>Week 1:</strong> TermFlow setup, connect systems, import data (parallel to existing Zapier/Make)</li>
                  <li><strong>Week 2:</strong> Test TermFlow workflows with 10% of leads, both systems running</li>
                  <li><strong>Week 3:</strong> Migrate 50% of traffic to TermFlow, monitor closely</li>
                  <li><strong>Week 4:</strong> Full cutover to TermFlow, turn off Zapier/Make</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-2">What We Migrate For You</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Property data (rooms, availability, pricing)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Lead and tenant records from your CRM/spreadsheets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>WhatsApp Business Account connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Email templates and messaging workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Training for your team (included in setup)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900">
                <p className="font-semibold text-green-900 dark:text-green-100 mb-1">Zero Downtime Migration Guarantee</p>
                <p className="text-sm text-green-800 dark:text-green-200">We run both systems in parallel during transition. Your students never experience disruption. If migration hits any issues, we can revert to old system whilst we troubleshoot.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-decision-framework">
          <CardHeader>
            <CardTitle>Decision Framework: Which Tool is Right for You?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-l-purple-500 pl-4">
                <h3 className="font-semibold mb-2">Choose Zapier if...</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• You have fewer than 50 beds (low volume)</li>
                  <li>• You need very simple automations (2-3 steps max)</li>
                  <li>• You have zero technical knowledge and can't hire help</li>
                  <li>• Budget is not a constraint</li>
                </ul>
              </div>

              <div className="border-l-4 border-l-blue-500 pl-4">
                <h3 className="font-semibold mb-2">Choose Make if...</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• You need complex, multi-step workflows</li>
                  <li>• You have some technical knowledge or can hire consultant</li>
                  <li>• You're willing to invest 30-40 hours in setup</li>
                  <li>• You want more control than Zapier offers</li>
                </ul>
              </div>

              <div className="border-l-4 border-l-orange-500 pl-4">
                <h3 className="font-semibold mb-2">Choose n8n if...</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• You have an in-house technical team</li>
                  <li>• You want full data control (self-hosted)</li>
                  <li>• You're prepared to invest 50-80 hours building</li>
                  <li>• You can maintain infrastructure and handle support yourself</li>
                </ul>
              </div>

              <div className="border-l-4 border-l-tf-navy pl-4 bg-muted/30 p-3">
                <h3 className="font-semibold mb-2">Choose TermFlow if...</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• You run a PBSA operation (100+ beds typically)</li>
                  <li>• You want purpose-built automation (2-4 hour setup vs 40-80 hours)</li>
                  <li>• You need multilingual support for international students</li>
                  <li>• You want PBSA-specific support team who understand your business</li>
                  <li>• You value reliability and uptime (99.9% SLA)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8" data-testid="card-cta">
          <CardHeader>
            <CardTitle>See TermFlow vs Generic Tools</CardTitle>
            <CardDescription>Live demo comparing purpose-built vs generic automation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              We'll show you side-by-side: same workflow in Zapier/Make (which you'd have to build) vs TermFlow (pre-built, PBSA-optimized). See the difference in setup time, reliability, and PBSA-specific features. Browse our{" "}
              <Link href="/automation-ideas" className="text-primary hover:underline" data-testid="link-automation-ideas">
                automation ideas library
              </Link>
              {" "}for 30+ workflows, or{" "}
              <Link href="/start-here" className="text-primary hover:underline" data-testid="link-start-here">
                learn how to get started
              </Link>
              .
            </p>
            <Button asChild size="lg" data-testid="button-cta-demo">
              <a href="/book-demo">See TermFlow vs Generic Tools Demo</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
