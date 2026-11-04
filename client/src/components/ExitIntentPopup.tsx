import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Gift, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
});

type FormData = z.infer<typeof formSchema>;

const SESSION_KEY = "termflow_exit_intent_shown";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      companyName: "",
    },
  });

  useEffect(() => {
    // Check if already shown in this session
    const shown = sessionStorage.getItem(SESSION_KEY);
    if (shown === "true") {
      setHasShown(true);
      return;
    }

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      // Detect mouse leaving from top of viewport
      if (e.clientY <= 10 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem(SESSION_KEY, "true");
      }
    };

    // Add listener after a small delay to avoid triggering on page load
    const timeoutId = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          company: data.companyName,
          source: "exit_intent",
          notes: "Free Lettings Automation Audit Request",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit");
      }

      toast({
        title: "Success!",
        description: "We'll send your free audit details to your email within 24 hours.",
      });

      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-exit-intent">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-lg bg-green-100 dark:bg-green-900 p-2">
              <Gift className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900 p-2">
              <Sparkles className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <DialogTitle className="text-2xl">Wait! Get Your Free Audit</DialogTitle>
          <DialogDescription className="text-base">
            Before you go, claim your{" "}
            <span className="font-bold text-foreground">Free Lettings Automation Audit</span>{" "}
            (worth £500). We'll show you exactly where AI can save you time and money.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@company.com"
                      type="email"
                      {...field}
                      data-testid="input-exit-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Company Ltd"
                      {...field}
                      data-testid="input-exit-company"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-sm">What you'll get:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Custom automation recommendations for your portfolio</li>
                <li>✓ ROI projections based on your current workflow</li>
                <li>✓ Implementation roadmap & timeline</li>
                <li>✓ No obligation, no sales pressure</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={form.formState.isSubmitting}
              data-testid="button-claim-audit"
            >
              {form.formState.isSubmitting ? "Submitting..." : "Claim My Free Audit"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              We respect your privacy. No spam, ever.
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
