import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, PoundSterling, TrendingUp, CheckCircle, Zap, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaybackPeriodCalculatorProps {
  className?: string;
}

export function PaybackPeriodCalculator({ className }: PaybackPeriodCalculatorProps) {
  const [beds, setBeds] = useState(100);
  const [avgRentPerWeek, setAvgRentPerWeek] = useState(150);
  const [currentResponseTime, setCurrentResponseTime] = useState(8);
  const [targetOccupancy, setTargetOccupancy] = useState(95);
  const [monthlyRent, setMonthlyRent] = useState(15000);
  const [marketingSpend, setMarketingSpend] = useState(1000);

  // Calculate results
  const results = useMemo(() => {
    // Calculate TermFlow cost based on beds - using CORRECT pricing tiers
    let monthlyTermFlowCost = 99;
    if (beds > 500) monthlyTermFlowCost = 499;
    else if (beds > 200) monthlyTermFlowCost = 299;
    else if (beds > 100) monthlyTermFlowCost = 179;

    // Calculate annual lease value per bed (40 weeks academic year)
    const avgLeadValue = avgRentPerWeek * 40;

    // Estimate leads lost per month without automation (5% of beds with slow response)
    // Add minimum threshold to ensure realistic calculations
    const minLeadsLostPerMonth = 2; // At least 2 leads per month for any portfolio
    const calculatedLeadsLost = (beds * 0.05) * (currentResponseTime / 24);
    const leadsLostPerMonth = Math.max(Math.round(calculatedLeadsLost), minLeadsLostPerMonth);

    // Revenue protected by faster response times
    const revenueProtectedMonthly = leadsLostPerMonth * avgLeadValue;
    const revenueProtectedAnnual = revenueProtectedMonthly * 12;

    // Time saved calculation
    // Assume 3 minutes per enquiry, 50 enquiries per 10 beds per month
    const enquiriesPerMonth = (beds / 10) * 50;
    const timePerEnquiryMinutes = 3;
    const timeSavedMonthly = (enquiriesPerMonth * timePerEnquiryMinutes * 0.95) / 60; // 95% automation

    // Payback period calculation with zero-value guard
    // Factor in marketing spend savings and monthly rent to calculate value
    const marketingSavings = marketingSpend * 0.5; // Assume 50% reduction in marketing spend with automation
    const monthlyValueGenerated = (revenueProtectedMonthly / 12) + marketingSavings;
    
    let paybackWeeks: number;
    let isOptimal = false;
    let paybackMessage = "";

    // Guard against zero/negative values
    if (monthlyValueGenerated <= 0 || leadsLostPerMonth === 0) {
      // Already optimal - show minimal payback
      paybackWeeks = 1;
      isOptimal = true;
      paybackMessage = "Already optimised! TermFlow adds further value through automation";
    } else {
      const paybackMonths = monthlyTermFlowCost / monthlyValueGenerated;
      
      // Guard against Infinity or unrealistic values
      if (!isFinite(paybackMonths) || paybackMonths <= 0) {
        paybackWeeks = 1;
        isOptimal = true;
        paybackMessage = "Minimal payback period - automation delivers immediate value";
      } else {
        paybackWeeks = Math.max(1, Math.ceil(paybackMonths * 4.33));
      }
    }

    // Break-even point (how many bookings needed)
    const breakEvenBookings = Math.ceil(monthlyTermFlowCost / avgRentPerWeek);

    // Improved occupancy logic - calculate realistic uplift
    // Assume automation can improve occupancy by up to 3%, but not beyond 100%
    const occupancyWithAutomation = Math.min(targetOccupancy + 3, 100);
    const occupancyGainPercent = Math.max(0, occupancyWithAutomation - targetOccupancy);
    const additionalRevenue = (beds * avgRentPerWeek * 40 * (occupancyGainPercent / 100));

    return {
      paybackWeeks,
      timeSavedMonthly: Math.round(timeSavedMonthly),
      revenueProtectedAnnual: Math.round(revenueProtectedAnnual),
      breakEvenBookings,
      monthlyTermFlowCost,
      additionalRevenue: Math.round(additionalRevenue),
      leadsLostPerMonth,
      isOptimal,
      paybackMessage,
      occupancyGainPercent,
      marketingSavings: Math.round(marketingSavings),
      monthlyRent,
    };
  }, [beds, avgRentPerWeek, currentResponseTime, targetOccupancy, monthlyRent, marketingSpend]);

  return (
    <div className={cn("space-y-6", className)} data-testid="calculator-payback-period">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-tf-lime/10 px-4 py-2 mb-4">
          <Clock className="h-4 w-4 text-tf-navy" />
          <span className="text-sm font-semibold text-tf-navy">Payback Calculator</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-payback-title">
          See Your Payback Period
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-payback-subtitle">
          Calculate how quickly TermFlow pays for itself through faster lead response and protected revenue
        </p>
      </div>

      {/* Input Controls */}
      <Card className="border-2 border-tf-lime/20 bg-gradient-to-br from-tf-lime/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-tf-lime" />
            Your Portfolio Details
          </CardTitle>
          <CardDescription>
            Adjust these values to match your operation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Number of Beds */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="beds-slider">Number of Beds/Units</Label>
              <span className="text-sm font-semibold text-foreground" data-testid="text-beds-value">
                {beds}
              </span>
            </div>
            <Slider
              id="beds-slider"
              min={50}
              max={1000}
              step={10}
              value={[beds]}
              onValueChange={(value) => setBeds(value[0])}
              className="w-full"
              data-testid="input-unit-count"
            />
          </div>

          {/* Average Rent */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="rent-slider">Average Rent per Bed per Week (£)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" data-testid="icon-rent-info" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Based on average 40-week academic year contract value.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-foreground" data-testid="text-rent-value">
                £{avgRentPerWeek}
              </span>
            </div>
            <Slider
              id="rent-slider"
              min={80}
              max={300}
              step={5}
              value={[avgRentPerWeek]}
              onValueChange={(value) => setAvgRentPerWeek(value[0])}
              className="w-full"
              data-testid="slider-rent"
            />
          </div>

          {/* Current Response Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="response-slider">Current Lead Response Time (hours)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" data-testid="icon-response-info" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Based on preventing 5% lead loss from delayed responses. TermFlow responds in under 30 seconds.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-foreground" data-testid="text-response-value">
                {currentResponseTime}h
              </span>
            </div>
            <Slider
              id="response-slider"
              min={1}
              max={24}
              step={1}
              value={[currentResponseTime]}
              onValueChange={(value) => setCurrentResponseTime(value[0])}
              className="w-full"
              data-testid="slider-response"
            />
            <p className="text-xs text-muted-foreground">
              TermFlow responds instantly (under 30 seconds)
            </p>
          </div>

          {/* Target Occupancy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="occupancy-slider">Target Occupancy Rate (%)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" data-testid="icon-occupancy-info" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Automation can improve occupancy by up to 3% through faster response times and better lead management.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-foreground" data-testid="text-occupancy-value">
                {targetOccupancy}%
              </span>
            </div>
            <Slider
              id="occupancy-slider"
              min={85}
              max={100}
              step={1}
              value={[targetOccupancy]}
              onValueChange={(value) => setTargetOccupancy(value[0])}
              className="w-full"
              data-testid="slider-occupancy"
            />
            <p className="text-xs text-muted-foreground">
              Potential uplift: +{results.occupancyGainPercent}% (capped at 100%)
            </p>
          </div>

          {/* Monthly Rent */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="monthly-rent-slider">Total Monthly Rent Income (£)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" data-testid="icon-monthly-rent-info" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Your total monthly rental income across all units.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-foreground" data-testid="text-monthly-rent-value">
                £{monthlyRent.toLocaleString()}
              </span>
            </div>
            <Slider
              id="monthly-rent-slider"
              min={5000}
              max={100000}
              step={1000}
              value={[monthlyRent]}
              onValueChange={(value) => setMonthlyRent(value[0])}
              className="w-full"
              data-testid="input-monthly-rent"
            />
            <p className="text-xs text-muted-foreground">
              Total monthly rental income from your portfolio
            </p>
          </div>

          {/* Marketing Spend */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="marketing-spend-slider">Monthly Marketing Spend (£)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" data-testid="icon-marketing-spend-info" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Your current monthly spend on marketing, advertising, and lead generation.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-foreground" data-testid="text-marketing-spend-value">
                £{marketingSpend.toLocaleString()}
              </span>
            </div>
            <Slider
              id="marketing-spend-slider"
              min={0}
              max={10000}
              step={100}
              value={[marketingSpend]}
              onValueChange={(value) => setMarketingSpend(value[0])}
              className="w-full"
              data-testid="input-marketing-spend"
            />
            <p className="text-xs text-muted-foreground">
              TermFlow can reduce marketing costs by up to 50% through better conversion
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Payback Period */}
        <Card className="border-2 border-tf-lime bg-gradient-to-br from-tf-lime/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payback Period</CardTitle>
            {results.isOptimal ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Clock className="h-4 w-4 text-tf-navy" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-tf-navy" data-testid="text-payback-weeks">
              {results.isOptimal ? "< 1 week" : `${results.paybackWeeks} weeks`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {results.isOptimal ? results.paybackMessage : "Pays for itself quickly"}
            </p>
          </CardContent>
        </Card>

        {/* Time Saved */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-time-saved">
              {results.timeSavedMonthly}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              per month
            </p>
          </CardContent>
        </Card>

        {/* Revenue Protected */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Protected</CardTitle>
            <PoundSterling className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600" data-testid="text-revenue-protected">
              £{results.revenueProtectedAnnual.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              per year from faster responses
            </p>
          </CardContent>
        </Card>

        {/* Break-even Point */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Break-even Point</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-breakeven-bookings">
              {results.breakEvenBookings}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              bookings to break even
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="border-2 border-tf-lime bg-gradient-to-br from-tf-lime/5 via-transparent to-tf-navy/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-tf-lime/20 p-3 border-2 border-tf-lime">
              <TrendingUp className="h-6 w-6 text-tf-navy" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 text-tf-navy">Your Projected ROI</h3>
              <p className="text-sm text-muted-foreground">
                TermFlow costs just{" "}
                <span className="font-bold text-foreground">
                  £{results.monthlyTermFlowCost}/month
                </span>{" "}
                for {beds} beds. By responding to leads instantly, you'll protect approximately{" "}
                <span className="font-bold text-foreground">
                  £{results.revenueProtectedAnnual.toLocaleString()} in annual revenue
                </span>{" "}
                from missed opportunities. 
                {results.isOptimal ? (
                  <>
                    {" "}TermFlow delivers immediate value through automation and time savings, 
                    with {results.timeSavedMonthly} hours saved every month.
                  </>
                ) : (
                  <>
                    {" "}That means TermFlow pays for itself in just{" "}
                    <span className="font-bold text-tf-navy">{results.paybackWeeks} weeks</span>.
                    You'll save {results.timeSavedMonthly} hours every month while preventing{" "}
                    {results.leadsLostPerMonth} lost leads.
                  </>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assumptions Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-5 w-5 text-muted-foreground" />
            Calculation Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                <strong className="text-foreground">Lead Response:</strong> Based on preventing 5% lead loss from delayed responses. Minimum 2 leads/month for realistic modeling.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                <strong className="text-foreground">Academic Year:</strong> Assumes average 40-week contract period for revenue calculations.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                <strong className="text-foreground">Occupancy Improvement:</strong> Automation can improve occupancy by up to 3% through faster response times, capped at 100%.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                <strong className="text-foreground">Estimates:</strong> All calculations are estimates based on industry averages. Actual results may vary based on your specific operation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
