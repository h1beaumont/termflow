import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEOHead } from "@/components/SEOHead";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";
import { BookOpen, Home, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  termflowContext?: string;
}

export default function Glossary() {
  const glossaryTerms: GlossaryTerm[] = [
    {
      id: "ai",
      term: "AI (Artificial Intelligence)",
      definition: "Technology that enables machines to simulate human intelligence, including learning, reasoning, and problem-solving. In property management, AI can handle conversations, qualify leads, and make decisions based on predefined rules.",
      termflowContext: "TermFlow uses AI to power Ava, our virtual lettings assistant that handles student enquiries 24/7 in 25+ languages, books viewings automatically, and qualifies leads without human intervention."
    },
    {
      id: "automation",
      term: "Automation",
      definition: "The use of technology to perform tasks with minimal human intervention. In lettings, automation can handle repetitive tasks like responding to enquiries, sending reminders, and processing applications.",
      termflowContext: "TermFlow automates the entire student lettings cycle - from initial WhatsApp enquiry to signed contract and deposit protection - reducing admin time by up to 95%."
    },
    {
      id: "clearing",
      term: "Clearing (Student Context)",
      definition: "The period (typically late August) when UK universities fill remaining course places for students who didn't get their required grades or changed their minds. This creates a massive surge in accommodation enquiries over a 2-3 week window.",
      termflowContext: "During clearing, operators can receive 400+ enquiries per week. TermFlow's AI handles this surge automatically, ensuring every student gets an instant response and viewing slot without overwhelming your team."
    },
    {
      id: "crm",
      term: "CRM (Customer Relationship Management)",
      definition: "Software that helps businesses manage interactions with current and potential customers. In property management, a CRM tracks leads, communications, viewing history, and the application pipeline.",
      termflowContext: "TermFlow includes a purpose-built lettings CRM that automatically captures leads from all sources (WhatsApp, email, portals), tracks every interaction, and shows your entire pipeline in real-time."
    },
    {
      id: "deposit-protection",
      term: "Deposit Protection",
      definition: "A legal requirement in the UK that requires landlords to protect tenant deposits in a government-approved scheme (TDS, DPS, or MyDeposits) within 30 days of receiving it. The scheme safeguards the money and provides dispute resolution.",
      termflowContext: "TermFlow integrates with all major UK deposit protection schemes and automatically protects deposits when contracts are signed. You'll never miss the 30-day deadline or face fines."
    },
    {
      id: "e-signature",
      term: "E-signature",
      definition: "Electronic signature that allows documents to be signed digitally rather than on paper. E-signatures are legally binding in the UK and most countries, making contract signing faster and more convenient.",
      termflowContext: "TermFlow generates tenancy agreements automatically and allows students to e-sign on their mobile phones. International students can sign contracts before arriving in the UK, eliminating delays."
    },
    {
      id: "guarantor",
      term: "Guarantor",
      definition: "A person (usually a parent or legal guardian) who agrees to pay rent if the tenant cannot. Commonly required for students who lack rental history or sufficient income. The guarantor must typically be a UK homeowner or pass affordability checks.",
      termflowContext: "TermFlow's application workflow includes built-in guarantor verification, allowing you to request guarantor details, send them documents to sign, and verify their income/homeowner status."
    },
    {
      id: "lead-nurturing",
      term: "Lead Nurturing",
      definition: "The process of developing relationships with potential tenants at every stage of the lettings funnel. This involves timely follow-ups, providing relevant information, and staying top-of-mind until they're ready to book.",
      termflowContext: "TermFlow automatically nurtures leads by sending personalized follow-ups after viewings, reminding students about application deadlines, and re-engaging dormant leads at strategic intervals."
    },
    {
      id: "lettings-agent",
      term: "Lettings Agent",
      definition: "A professional or company that manages the rental process on behalf of property owners. Traditional agents typically charge 8-12% of annual rent and handle marketing, viewings, tenant vetting, and contract administration.",
      termflowContext: "TermFlow replaces traditional lettings agents by automating their key tasks (enquiries, viewings, contracts) at a fraction of the cost - starting at £99/month versus thousands in agent fees per property."
    },
    {
      id: "occupancy-rate",
      term: "Occupancy Rate",
      definition: "The percentage of available beds that are currently rented out. Calculated as (occupied beds / total beds) × 100. A 95%+ occupancy rate is considered excellent in student accommodation.",
      termflowContext: "TermFlow helps maximize occupancy by ensuring instant responses to enquiries (students won't go elsewhere), automated follow-ups (no leads fall through the cracks), and real-time floor plan availability."
    },
    {
      id: "pbsa",
      term: "PBSA (Purpose-Built Student Accommodation)",
      definition: "Housing specifically designed and built for student living, typically featuring en-suite rooms, communal areas, on-site management, and amenities like gyms and study spaces. Distinct from HMOs (houses in multiple occupation) or standard rental properties.",
      termflowContext: "TermFlow is purpose-built for PBSA operators managing 50+ beds. Our platform handles the unique challenges of student accommodation: high enquiry volumes, international students, guarantor verification, and seasonal demand."
    },
    {
      id: "right-to-rent",
      term: "Right to Rent",
      definition: "A UK legal requirement that landlords verify a tenant's immigration status before renting to them. Landlords must check original documents (passport, visa, biometric residence permit) and keep copies for the duration of the tenancy plus one year.",
      termflowContext: "TermFlow's AI verifies Right to Rent documents automatically by checking passports, visas, and university letters. You get instant alerts if a student doesn't have valid status, protecting you from fines up to £3,000."
    },
    {
      id: "roi",
      term: "ROI (Return on Investment)",
      definition: "A financial metric that measures the profitability of an investment. Calculated as (Net Benefit / Cost) × 100. In lettings technology, ROI considers time saved, reduced fees, and increased occupancy against software costs.",
      termflowContext: "TermFlow delivers 300-500% ROI in year one for most operators by eliminating agent commissions (£20,000-60,000/year savings), reducing admin time (20+ hours/week), and increasing occupancy through faster response times."
    },
    {
      id: "tenancy-agreement",
      term: "Tenancy Agreement",
      definition: "A legally binding contract between landlord and tenant that outlines rental terms including rent amount, payment schedule, tenancy length, deposit, responsibilities, and terms for ending the tenancy.",
      termflowContext: "TermFlow auto-generates compliant tenancy agreements using your custom template, pre-fills all student details, and sends them for e-signature. Students can sign on mobile in under 2 minutes."
    },
    {
      id: "whatsapp-business-api",
      term: "WhatsApp Business API",
      definition: "The enterprise version of WhatsApp that allows businesses to integrate messaging into their systems, automate conversations, and communicate with customers at scale. Unlike WhatsApp Business App, the API supports automation and integrations.",
      termflowContext: "TermFlow connects to WhatsApp Business API to enable Ava (our AI assistant) to respond to student enquiries instantly, 24/7. Students can message your property just like texting a friend, and get immediate answers in their native language."
    }
  ];

  // Sort terms alphabetically
  const sortedTerms = [...glossaryTerms].sort((a, b) => 
    a.term.localeCompare(b.term)
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Student Lettings Glossary | PBSA & AI Automation Terms - TermFlow"
        description="Comprehensive glossary of student accommodation, PBSA, and AI automation terms. Learn about Right to Rent, deposit protection, clearing season, WhatsApp Business API, and more."
        keywords="PBSA glossary, student accommodation terms, lettings terminology, Right to Rent, deposit protection, student clearing, WhatsApp Business API, AI automation terms"
        canonical="https://termflow.co.uk/resources/glossary"
        ogTitle="Student Lettings & PBSA Glossary | TermFlow"
        ogDescription="Understand key terms in student accommodation management and lettings automation"
        ogType="website"
        ogUrl="https://termflow.co.uk/resources/glossary"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" data-testid="link-home">
              <TermFlowWordmark />
            </Link>
            <SiteSearch />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1" data-testid="link-home-text">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Button variant="default" size="sm" asChild data-testid="button-book-demo">
              <Link href="/book-demo">Book Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary/10 via-purple-500/10 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-glossary-title">
              Student Lettings Glossary
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-glossary-subtitle">
            Your complete guide to student accommodation, PBSA, and lettings automation terminology
          </p>
        </div>
      </section>

      {/* Glossary Terms */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2" data-testid="card-glossary-terms">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {sortedTerms.map((item, index) => (
                  <AccordionItem 
                    key={item.id} 
                    value={item.id}
                    data-testid={`glossary-term-${item.id}`}
                  >
                    <AccordionTrigger 
                      className="text-left hover:no-underline" 
                      data-testid={`glossary-trigger-${item.id}`}
                    >
                      <span className="font-bold text-lg">{item.term}</span>
                    </AccordionTrigger>
                    <AccordionContent data-testid={`glossary-content-${item.id}`}>
                      <div className="space-y-4 pt-2">
                        <p className="text-foreground leading-relaxed">
                          {item.definition}
                        </p>
                        {item.termflowContext && (
                          <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r">
                            <p className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                              <ArrowRight className="h-4 w-4" />
                              How TermFlow Uses This
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {item.termflowContext}
                            </p>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-12 px-6 bg-gradient-to-br from-primary/10 via-purple-500/10 to-background">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4" data-testid="text-pricing-cta-title">
                  See How TermFlow Saves You Money
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-pricing-cta-description">
                  Understanding these terms is just the start. Calculate exactly how much time and money you could save by automating your lettings workflow.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button size="lg" asChild data-testid="button-pricing-cta-roi">
                    <Link href="/roi-calculator">Calculate Your ROI</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild data-testid="button-pricing-cta-pricing">
                    <Link href="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" data-testid="text-cta-title">
            Ready to Automate Your Student Lettings?
          </h2>
          <p className="text-lg text-muted-foreground mb-8" data-testid="text-cta-description">
            See how TermFlow puts these concepts into action
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild data-testid="button-cta-demo">
              <Link href="/book-demo">Book a Free Demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-cta-how-it-works">
              <Link href="/how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 TermFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
