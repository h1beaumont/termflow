import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface DepositPaymentDialogProps {
  room: {
    id: string;
    name: string;
    depositAmount: number;
  };
  property: {
    id: string;
    name: string;
  };
  leadId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function CheckoutForm({ amount, onSuccess }: { amount: number; onSuccess?: () => void }) {
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
        return_url: window.location.origin + '/deposit-success',
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
        title: "Payment Successful",
        description: `Your deposit of £${amount.toFixed(2)} has been paid!`,
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
        data-testid="button-submit-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay £${amount.toFixed(2)} Deposit`
        )}
      </Button>
    </form>
  );
}

export function DepositPaymentDialog({
  room,
  property,
  leadId,
  open,
  onOpenChange,
  onSuccess,
}: DepositPaymentDialogProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Convert deposit amount to number once with validation
  const depositAmount = Number(room.depositAmount);
  const isValidAmount = !isNaN(depositAmount) && depositAmount > 0;

  // Create payment intent when dialog opens
  useEffect(() => {
    if (open && !clientSecret) {
      setIsLoading(true);
      
      if (!isValidAmount) {
        toast({
          title: "Error",
          description: "Invalid deposit amount",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      apiRequest("POST", "/api/create-deposit-payment", {
        amount: depositAmount,
        leadId,
        propertyId: property.id,
        roomId: room.id,
      })
        .then((res: any) => res.json())
        .then((data: any) => {
          setClientSecret(data.clientSecret);
          setIsLoading(false);
        })
        .catch((error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to initialize payment",
            variant: "destructive",
          });
          setIsLoading(false);
        });
    }
    
    // Reset state when dialog closes
    if (!open) {
      setClientSecret("");
      setIsLoading(false);
    }
  }, [open, clientSecret, depositAmount, isValidAmount, leadId, property.id, room.id, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-deposit-payment">
        <DialogHeader>
          <DialogTitle>Pay Deposit</DialogTitle>
          <DialogDescription>
            Secure your room at {property.name} with a deposit payment of £{depositAmount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm amount={depositAmount} onSuccess={onSuccess} />
            </Elements>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
