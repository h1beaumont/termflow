import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Clock, PoundSterling, Calendar, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ROICalculatorProps {
  className?: string;
  compact?: boolean;
}

export function ROICalculator({ className, compact = false }: ROICalculatorProps) {
  const [units, setUnits] = useState(100);
  const [enquiriesPerWeek, setEnquiriesPerWeek] = useState(200);
  const [adminHoursPerWeek, setAdminHoursPerWeek] = useState(25);
  const [hourlyStaffCost, setHourlyStaffCost] = useState(30);

  // Calculate results
  const results = useMemo(() => {
    // Time saved = enquiries * 0.05 hours (AI handles 95%)
    const weeklyTimeSaved = enquiriesPerWeek * 0.05;
    
    // Cost saved = time saved * hourly rate
    const weeklyCostSaved = weeklyTimeSaved * hourlyStaffCost;
    
    // Annual savings = cost saved * 52 weeks
    const annualSavings = weeklyCostSaved * 52;
    
    // TermFlow annual cost based on units
    let monthlyTermFlowCost = 99;
    if (units > 500) monthlyTermFlowCost = 499;
    else if (units > 300) monthlyTermFlowCost = 299;
    else if (units > 100) monthlyTermFlowCost = 199;
    
    const annualTermFlowCost = monthlyTermFlowCost * 12;
    
    // ROI = (annual savings - annual cost) / annual cost * 100
    const roi = ((annualSavings - annualTermFlowCost) / annualTermFlowCost) * 100;
    
    // Payback period in months
    const paybackMonths = annualTermFlowCost / (weeklyCostSaved * 4.33);
    
    return {
      weeklyTimeSaved: Math.round(weeklyTimeSaved * 10) / 10,
      weeklyCostSaved: Math.round(weeklyCostSaved),
      annualSavings: Math.round(annualSavings),
      monthlyTermFlowCost,
      annualTermFlowCost,
      roi: Math.round(roi),
      paybackMonths: Math.max(0.1, Math.round(paybackMonths * 10) / 10),
    };
  }, [units, enquiriesPerWeek, adminHoursPerWeek, hourlyStaffCost]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Input Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Your Current Situation</CardTitle>
          <CardDescription>
            Adjust the sliders to match your portfolio and workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Number of Units */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="units-slider">Number of Units/Beds</Label>
              <span className="text-sm font-semibold text-foreground" data-testid="text-units-value">
                {units}
              </span>
            </div>
            <Slider
              id="units-slider"
              min={10}
              max={1000}
              step={10}
              value={[units]}
              onValueChange={(value) => setUnits(value[0])}
              className="w-full"
              data-testid="slider-units"
            />
          </div>

          {/* Enquiries per Week */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="enquiries-slider">Average Enquiries per Week</Label>
              <span className="text-sm font-semibold text-foreground" data-testid="text-enquiries-value">
                {enquiriesPerWeek}
              </span>
            </div>
            <Slider
              id="enquiries-slider"
              min={50}
              max={500}
              step={10}
              value={[enquiriesPerWeek]}
              onValueChange={(value) => setEnquiriesPerWeek(value[0])}
              className="w-full"
              data-testid="slider-enquiries"
            />
          </div>

          {/* Admin Hours per Week */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-hours-slider">Hours Spent on Admin per Week</Label>
              <span className="text-sm font-semibold text-foreground" data-testid="text-admin-hours-value">
                {adminHoursPerWeek}
              </span>
            </div>
            <Slider
              id="admin-hours-slider"
              min={5}
              max={80}
              step={5}
              value={[adminHoursPerWeek]}
              onValueChange={(value) => setAdminHoursPerWeek(value[0])}
              className="w-full"
              data-testid="slider-admin-hours"
            />
          </div>

          {/* Hourly Staff Cost */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="hourly-cost-slider">Hourly Staff Cost (£)</Label>
              <span className="text-sm font-semibold text-foreground" data-testid="text-hourly-cost-value">
                £{hourlyStaffCost}
              </span>
            </div>
            <Slider
              id="hourly-cost-slider"
              min={15}
              max={100}
              step={5}
              value={[hourlyStaffCost]}
              onValueChange={(value) => setHourlyStaffCost(value[0])}
              className="w-full"
              data-testid="slider-hourly-cost"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className={cn(
        "grid gap-4",
        compact ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {/* Weekly Time Saved */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-weekly-time-saved">
              {results.weeklyTimeSaved} hrs
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              AI handles 95% of enquiries instantly
            </p>
          </CardContent>
        </Card>

        {/* Weekly Cost Saved */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Cost Saved</CardTitle>
            <PoundSterling className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-weekly-cost-saved">
              £{results.weeklyCostSaved.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on your hourly staff cost
            </p>
          </CardContent>
        </Card>

        {/* Annual Savings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-annual-savings">
              £{results.annualSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total savings per year
            </p>
          </CardContent>
        </Card>

        {/* ROI Percentage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return on Investment</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-roi-percentage">
              {results.roi > 0 ? '+' : ''}{results.roi}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Annual cost: £{results.annualTermFlowCost.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Payback Period */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payback Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-payback-months">
              {results.paybackMonths} months
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Time to recover investment
            </p>
          </CardContent>
        </Card>

        {/* TermFlow Cost */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TermFlow Cost</CardTitle>
            <PoundSterling className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-termflow-cost">
              £{results.monthlyTermFlowCost}/mo
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {units} units
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-green-100 dark:bg-green-900 p-3">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">Your Projected Savings</h3>
              <p className="text-sm text-muted-foreground">
                By implementing TermFlow, you could save{" "}
                <span className="font-bold text-foreground">
                  £{results.annualSavings.toLocaleString()} per year
                </span>{" "}
                while automating {results.weeklyTimeSaved} hours of admin work every week.
                That's a{" "}
                <span className="font-bold text-foreground">{results.roi}% ROI</span> with full
                payback in just {results.paybackMonths} months.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
