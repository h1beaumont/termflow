import { Button } from "@/components/ui/button";
import { ROICalculator } from "@/components/ROICalculator";
import { SEOHead } from "@/components/SEOHead";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Footer } from "@/components/Footer";
import { ArrowRight, Calculator } from "lucide-react";

export default function ROICalculatorPage() {
  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="ROI Calculator | TermFlow - Calculate Your Lettings Automation Savings"
        description="Calculate exactly how much you could save by automating your student lettings with TermFlow. Get instant ROI projections, payback periods, and annual savings estimates."
        keywords="lettings ROI calculator, student accommodation ROI, automation savings calculator, lettings cost savings, PBSA automation ROI"
        canonical="https://termflow.co.uk/roi-calculator"
        ogUrl="https://termflow.co.uk/roi-calculator"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <TermFlowWordmark />
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">
              Home
            </a>
            <Button asChild size="sm" data-testid="button-book-demo">
              <a href="/book-demo">Book Demo</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-tf-navy/10 px-4 py-2 mb-6">
              <Calculator className="h-4 w-4 text-tf-navy" />
              <span className="text-sm font-semibold text-tf-navy">Free ROI Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Calculate Your Lettings Automation ROI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              See exactly how much time and money you could save by automating your student lettings workflow with TermFlow. Adjust the sliders below to match your portfolio.
            </p>
          </div>

          {/* ROI Calculator */}
          <ROICalculator />

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-tf-navy to-tf-navy-700 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Start Saving?
              </h2>
              <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
                Book a free demo and we'll show you exactly how TermFlow can automate your workflow and deliver these results for your portfolio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" variant="secondary" data-testid="button-book-demo-cta">
                  <a href="/book-demo" className="gap-2">
                    Book Your Free Demo
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" data-testid="button-view-pricing">
                  <a href="/pricing">
                    View Pricing
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
