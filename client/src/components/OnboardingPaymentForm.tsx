import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";

interface CheckoutFormProps {
  amount: number;
  planName: string;
  onSuccess?: () => void;
}

function CheckoutForm({ amount, planName, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/onboarding-success',
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful!",
        description: `Your ${planName} subscription is now active`,
      });
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
        data-testid="button-submit-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Start Free Trial (Card Verification Only)
          </>
        )}
      </Button>
    </form>
  );
}

interface PaymentFormContentProps {
  planName: string;
  monthlyAmount: number;
  features: string[];
  onSuccess: () => void;
  sessionId: string;
  stripePromise: Promise<Stripe | null>;
}

function PaymentFormContent({
  planName,
  monthlyAmount,
  features,
  onSuccess,
  sessionId,
  stripePromise,
}: PaymentFormContentProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { toast } = useToast();

  // Create payment intent on mount
  useEffect(() => {
    if (!clientSecret && !paymentError) {
      setIsLoading(true);

      apiRequest("POST", "/api/onboarding/create-subscription-payment", {
        amount: monthlyAmount,
        planName,
        sessionId,
      })
        .then((res: any) => res.json())
        .then((data: any) => {
          // TEST MODE: Skip payment and redirect immediately
          if (data.testMode) {
            toast({
              title: "🧪 Test Mode Activated",
              description: `Access granted for ${planName} plan - payment bypassed`,
              duration: 3000,
            });
            setIsLoading(false);
            // Redirect to dashboard after showing toast
            setTimeout(() => {
              onSuccess();
            }, 1000);
            return;
          }

          // PRODUCTION MODE: Normal Stripe flow
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            setPaymentError(data.message || "Failed to initialize payment");
          }
          setIsLoading(false);
        })
        .catch((error: any) => {
          const errorMessage = error.message || "Failed to initialize payment";
          setPaymentError(errorMessage);
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
          setIsLoading(false);
        });
    }
  }, [clientSecret, monthlyAmount, planName, sessionId, toast, paymentError, onSuccess]);

  // If there's a payment initialization error, show skip option
  if (paymentError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{planName} Plan</CardTitle>
                <CardDescription>
                  Your selected subscription plan
                </CardDescription>
              </div>
              <Badge variant="default" className="text-lg px-4 py-2">
                £{monthlyAmount}/month
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">Payment system unavailable</p>
            <p className="text-sm mt-1">{paymentError}</p>
          </AlertDescription>
        </Alert>

        <Button 
          onClick={onSuccess} 
          className="w-full"
          size="lg"
          data-testid="button-skip-payment"
        >
          Continue Without Payment (Demo Mode)
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{planName} Plan</CardTitle>
              <CardDescription>
                Your selected subscription plan
              </CardDescription>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              £{monthlyAmount}/month
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Verify your payment method to start your 14-day free trial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm amount={monthlyAmount} planName={planName} onSuccess={onSuccess} />
            </Elements>
          ) : (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load payment form. Please refresh the page.
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertDescription>
              Your payment is secured by Stripe. Your card details are never stored on our servers.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Trial & Billing Info */}
      <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            14-Day Free Trial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert className="border-green-200 bg-white dark:bg-gray-950">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>No charge today!</strong> We'll verify your card but won't charge you during the 14-day trial.
            </AlertDescription>
          </Alert>
          
          <div className="text-sm space-y-2 bg-white dark:bg-gray-950 p-4 rounded-lg">
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Trial Period:</span>
              <strong>14 days (no charge)</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">First Charge (Day 15):</span>
              <strong className="text-orange-600">£{monthlyAmount}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Recurring:</span>
              <strong>£{monthlyAmount}/month</strong>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Next Charge Date:</span>
              <strong>{new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong>
            </p>
          </div>

          <p className="text-xs text-muted-foreground pt-2">
            Cancel anytime before day 15 to avoid charges. By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface OnboardingPaymentFormProps {
  planName: string;
  monthlyAmount: number;
  features: string[];
  onSuccess: () => void;
  sessionId: string;
}

export function OnboardingPaymentForm({
  planName,
  monthlyAmount,
  features,
  onSuccess,
  sessionId,
}: OnboardingPaymentFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);

  // Lazy-load Stripe on component mount
  useEffect(() => {
    const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    
    if (!publicKey) {
      setStripeError("Payment system not configured. Please contact support.");
      console.warn("⚠️  VITE_STRIPE_PUBLIC_KEY not set. Payment form will show error state.");
      return;
    }

    try {
      setStripePromise(loadStripe(publicKey));
    } catch (error) {
      setStripeError("Failed to initialize payment system.");
      console.error("Stripe initialization error:", error);
    }
  }, []);

  // If Stripe is not configured, show error state instead of crashing
  if (stripeError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{planName} Plan</CardTitle>
                <CardDescription>
                  Your selected subscription plan
                </CardDescription>
              </div>
              <Badge variant="default" className="text-lg px-4 py-2">
                £{monthlyAmount}/month
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">Payment Unavailable</p>
            <p className="text-sm mt-1">{stripeError}</p>
          </AlertDescription>
        </Alert>

        <Button 
          onClick={onSuccess} 
          className="w-full"
          size="lg"
          data-testid="button-skip-payment"
        >
          Continue Without Payment (Demo Mode)
        </Button>
      </div>
    );
  }

  // Show loading state while Stripe is initializing
  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <PaymentFormContent
      planName={planName}
      monthlyAmount={monthlyAmount}
      features={features}
      onSuccess={onSuccess}
      sessionId={sessionId}
      stripePromise={stripePromise}
    />
  );
}
