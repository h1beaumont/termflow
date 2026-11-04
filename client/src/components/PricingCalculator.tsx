import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Zap, CheckCircle } from "lucide-react";

export function PricingCalculator() {
  const [units, setUnits] = useState<number>(150);

  // Calculate pricing tier based on units - CORRECT PRICING TIERS
  const getPricingTier = (unitCount: number) => {
    if (unitCount >= 501) {
      return {
        name: "Premium",
        monthly: 499,
        annual: 499 * 12 * 0.85, // 15% discount
        color: "from-purple-500 to-indigo-500",
        features: ["501-1000 units", "Priority support", "Dedicated account manager", "Custom integrations"]
      };
    } else if (unitCount >= 201) {
      return {
        name: "Growth",
        monthly: 299,
        annual: 299 * 12 * 0.85,
        color: "from-blue-500 to-cyan-500",
        features: ["201-500 units", "Advanced analytics", "API access", "Priority support"]
      };
    } else if (unitCount >= 101) {
      return {
        name: "Professional",
        monthly: 179,
        annual: 179 * 12 * 0.85,
        color: "from-green-500 to-emerald-500",
        features: ["101-200 units", "All core features", "Multi-property", "Email support"]
      };
    } else {
      return {
        name: "Starter",
        monthly: 99,
        annual: 99 * 12 * 0.85,
        color: "from-orange-500 to-red-500",
        features: ["50-100 units", "AI conversations", "Digital contracts", "Basic analytics"]
      };
    }
  };

  const tier = getPricingTier(units);
  const monthlySavings = tier.monthly * 12 - tier.annual;

  return (
    <Card className="overflow-hidden border-2 border-primary/20" data-testid="pricing-calculator">
      <CardHeader className="bg-gradient-to-r from-tf-navy/5 to-tf-lime/5">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <Badge variant="secondary" className="gap-1">
            <Zap className="w-3 h-3" />
            Live Calculator
          </Badge>
        </div>
        <CardTitle className="text-2xl">Find Your Perfect Plan</CardTitle>
        <CardDescription>
          Adjust the slider to see pricing based on your portfolio size
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Units Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-muted-foreground">
              Number of Units
            </label>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground" data-testid="calculator-units">
                {units}
              </div>
              <div className="text-xs text-muted-foreground">units in portfolio</div>
            </div>
          </div>
          <Slider
            value={[units]}
            onValueChange={(value) => setUnits(value[0])}
            min={50}
            max={1000}
            step={10}
            className="w-full"
            data-testid="slider-units"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>50 units</span>
            <span>1000+ units</span>
          </div>
        </div>

        {/* Recommended Plan */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-1">
                Recommended Plan
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${tier.color} text-white font-bold text-lg`} data-testid="calculator-plan">
                {tier.name}
              </div>
            </div>
          </div>

          {/* Pricing Display */}
          <div className="grid grid-cols-2 gap-4">
            {/* Monthly */}
            <Card className="bg-muted/30">
              <CardContent className="pt-4 pb-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Monthly</div>
                <div className="text-2xl font-bold text-foreground" data-testid="calculator-monthly">
                  £{tier.monthly}
                </div>
                <div className="text-xs text-muted-foreground">per month</div>
              </CardContent>
            </Card>

            {/* Annual */}
            <Card className="bg-gradient-to-br from-tf-lime/10 to-tf-navy/10 border-2 border-tf-lime/30">
              <CardContent className="pt-4 pb-4 text-center relative">
                <Badge variant="default" className="absolute -top-2 left-1/2 -translate-x-1/2 bg-tf-lime text-tf-navy text-xs">
                  Save £{monthlySavings.toFixed(0)}/yr
                </Badge>
                <div className="text-xs text-muted-foreground mb-1">Annual</div>
                <div className="text-2xl font-bold text-foreground" data-testid="calculator-annual">
                  £{Math.round(tier.annual)}
                </div>
                <div className="text-xs text-muted-foreground">per year</div>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="space-y-2 pt-2">
            <div className="text-sm font-semibold text-muted-foreground">Includes:</div>
            <div className="grid gap-2">
              {tier.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-tf-lime flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 space-y-2">
          <Button size="lg" className="w-full" asChild data-testid="button-calculator-cta">
            <a href="/book-demo">
              <TrendingUp className="w-5 h-5 mr-2" />
              Book Demo for {tier.name} Plan
            </a>
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            14-day free trial • No credit card required
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
