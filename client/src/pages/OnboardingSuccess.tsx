import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Calendar, 
  CreditCard, 
  Mail, 
  ArrowRight, 
  ShieldCheck,
  Clock,
  FileText,
  Sparkles
} from "lucide-react";

export default function OnboardingSuccess() {
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState(14);

  // Fetch user data to get subscription details
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  // Calculate trial dates from subscription start date (or fallback to current time if not set)
  const subscriptionStart = user?.subscriptionStartDate ? new Date(user.subscriptionStartDate) : new Date();
  
  // Calculate trial end date (end of day 14 = start + 13 days)
  const trialEndDate = new Date(subscriptionStart);
  trialEndDate.setDate(trialEndDate.getDate() + 13);

  // Calculate first charge date (day 15 = start + 14 days)
  const firstChargeDate = new Date(subscriptionStart);
  firstChargeDate.setDate(firstChargeDate.getDate() + 14);

  useEffect(() => {
    // Countdown animation
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 14));
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const handleContinueToDashboard = () => {
    setLocation("/dashboard");
  };

  const subscriptionAmount = user?.subscriptionAmount || 299;
  const planName = user?.subscriptionPlan || "Professional";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 animate-in zoom-in duration-500">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" data-testid="text-success-title">
            Welcome to TermFlow! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your account is set up and your <strong>14-day free trial</strong> has begun
          </p>
        </div>

        {/* Trial Information Card */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2" data-testid="text-trial-title">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  Your Free Trial Details
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  No charge today - enjoy full access for 14 days
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2 animate-pulse">
                {countdown} Days Free
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            {/* Card Verification - No Charge */}
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800" data-testid="alert-no-charge">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-900 dark:text-green-100">Card Verified - No Charge Today</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-200">
                We've verified your payment method but <strong>haven't charged you anything</strong>. 
                Your card will only be charged after your free trial ends.
              </AlertDescription>
            </Alert>

            <Separator />

            {/* Trial Timeline */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                What Happens Next
              </h3>

              <div className="space-y-4 pl-7 border-l-2 border-blue-200 dark:border-blue-800">
                {/* Today */}
                <div className="relative" data-testid="timeline-today">
                  <div className="absolute -left-[30px] w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900"></div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">Trial Started - {subscriptionStart.toLocaleDateString()}</p>
                      <Badge variant="secondary">Day 1</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ✅ Card verified (no charge)
                      <br />
                      ✅ Full access to all {planName} features
                      <br />
                      ✅ Welcome email sent with invoice details
                    </p>
                  </div>
                </div>

                {/* During Trial */}
                <div className="relative" data-testid="timeline-trial">
                  <div className="absolute -left-[30px] w-4 h-4 bg-purple-400 rounded-full border-4 border-white dark:border-gray-900"></div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">Days 1-14 - Free Trial Period</p>
                      <Badge variant="outline">No Charges</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Explore all features at no cost. Set up your properties, configure AI settings, and start automating your lettings.
                    </p>
                  </div>
                </div>

                {/* Day 15 - First Charge */}
                <div className="relative" data-testid="timeline-charge">
                  <div className="absolute -left-[30px] w-4 h-4 bg-orange-500 rounded-full border-4 border-white dark:border-gray-900"></div>
                  <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-orange-900 dark:text-orange-100">
                        {firstChargeDate.toLocaleDateString()} - First Payment
                      </p>
                      <Badge className="bg-orange-600 hover:bg-orange-700">Day 15</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        💳 Your card will be charged: <strong className="text-lg">£{subscriptionAmount}</strong>
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        This covers your first month of {planName} plan access
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recurring Payments */}
                <div className="relative" data-testid="timeline-recurring">
                  <div className="absolute -left-[30px] w-4 h-4 bg-gray-400 rounded-full border-4 border-white dark:border-gray-900"></div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">Monthly Thereafter</p>
                      <Badge variant="outline">Recurring</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      £{subscriptionAmount}/month, charged automatically on the same day each month. Cancel anytime from your account settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Invoice Email */}
            <Alert data-testid="alert-invoice-email">
              <Mail className="h-5 w-5" />
              <AlertTitle>Welcome Email & Invoice Sent</AlertTitle>
              <AlertDescription>
                Check your inbox at <strong>{user?.email}</strong>. We've sent you:
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Welcome email with getting started guide</li>
                  <li>Invoice showing your Day 15 charge (£{subscriptionAmount})</li>
                  <li>Clear breakdown of what you're paying for</li>
                  <li>Recurring payment schedule</li>
                </ul>
              </AlertDescription>
            </Alert>

          </CardContent>
        </Card>

        {/* Plan Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Subscription Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div data-testid="text-plan-name">
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-semibold">{planName}</p>
              </div>
              <div data-testid="text-billing-amount">
                <p className="text-sm text-muted-foreground">Monthly Amount</p>
                <p className="font-semibold">£{subscriptionAmount}</p>
              </div>
              <div data-testid="text-trial-end">
                <p className="text-sm text-muted-foreground">Trial Ends</p>
                <p className="font-semibold">{trialEndDate.toLocaleDateString()}</p>
              </div>
              <div data-testid="text-first-charge">
                <p className="text-sm text-muted-foreground">First Charge</p>
                <p className="font-semibold">{firstChargeDate.toLocaleDateString()}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Payment Method</span>
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Card ending in ••••
              </span>
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={handleContinueToDashboard}
            className="gap-2"
            data-testid="button-continue-dashboard"
          >
            Continue to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground">
          Questions about billing? Contact us at support@termflow.com or visit your{" "}
          <button 
            onClick={() => setLocation("/settings")} 
            className="text-blue-600 hover:underline"
          >
            account settings
          </button>
        </p>

      </div>
    </div>
  );
}
