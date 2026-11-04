import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// Helper to extract error message from API response
function extractErrorMessage(error: any): string {
  try {
    // Error format from throwIfResNotOk is: "STATUS: JSON_STRING"
    // e.g., "400: {\"message\":\"Token expired\"}"
    const errorMessage = error.message || "";
    const match = errorMessage.match(/^\d+:\s*(.+)$/);
    
    if (match) {
      const jsonString = match[1];
      try {
        const parsed = JSON.parse(jsonString);
        return parsed.message || jsonString;
      } catch {
        return jsonString;
      }
    }
    
    return errorMessage || "An error occurred";
  } catch {
    return "An error occurred";
  }
}

const resendSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResendFormData = z.infer<typeof resendSchema>;

export default function VerifyEmailPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showResendForm, setShowResendForm] = useState(false);

  const form = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: "",
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async (verificationToken: string) => {
      const response = await apiRequest("POST", "/api/auth/verify-email", { 
        token: verificationToken 
      });
      return response;
    },
    onSuccess: () => {
      setVerificationStatus("success");
      toast({
        title: "Email verified!",
        description: "Your account is now active. You can sign in to TermFlow.",
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        setLocation("/login");
      }, 3000);
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      setErrorMessage(message);
      setVerificationStatus("error");
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: message,
      });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async (data: ResendFormData) => {
      const response = await apiRequest("POST", "/api/auth/resend-verification", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for a new verification link.",
      });
      setShowResendForm(false);
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast({
        variant: "destructive",
        title: "Failed to resend",
        description: message,
      });
    },
  });

  useEffect(() => {
    // Extract token from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    
    if (tokenParam) {
      setToken(tokenParam);
      // Automatically verify when token is present
      verifyEmailMutation.mutate(tokenParam);
    } else {
      setVerificationStatus("error");
      setErrorMessage("No verification token found in the link");
      toast({
        variant: "destructive",
        title: "Invalid link",
        description: "No verification token found. Please check your email for the verification link.",
      });
    }
  }, []);

  const onResendSubmit = (data: ResendFormData) => {
    resendVerificationMutation.mutate(data);
  };

  if (verificationStatus === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tf-navy via-tf-navy-light to-tf-navy p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">TermFlow</h1>
            <p className="text-gray-300">AI-Powered Student Lettings Automation</p>
          </div>

          <Card className="border-tf-navy-lighter shadow-xl">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 bg-tf-lime/10 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-tf-lime animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold">Verifying Your Email</CardTitle>
              <CardDescription>
                Please wait while we verify your account...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                This should only take a moment
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-gray-400">
            © 2025 TermFlow. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tf-navy via-tf-navy-light to-tf-navy p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">TermFlow</h1>
            <p className="text-gray-300">AI-Powered Student Lettings Automation</p>
          </div>

          <Card className="border-tf-navy-lighter shadow-xl">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 bg-tf-lime/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-tf-lime" />
              </div>
              <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
              <CardDescription>
                Your account is now active and ready to use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                You'll be redirected to sign in shortly...
              </p>
              <Button
                className="w-full bg-tf-lime text-tf-navy hover:bg-tf-lime/90 font-bold"
                onClick={() => setLocation("/login")}
                data-testid="button-go-to-login"
              >
                Continue to sign in
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-gray-400">
            © 2025 TermFlow. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  // Error state with resend option
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tf-navy via-tf-navy-light to-tf-navy p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">TermFlow</h1>
          <p className="text-gray-300">AI-Powered Student Lettings Automation</p>
        </div>

        <Card className="border-tf-navy-lighter shadow-xl">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">Verification Failed</CardTitle>
            <CardDescription>
              {errorMessage || "This verification link is invalid or has expired"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showResendForm ? (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  Verification links expire after 24 hours for security. You can request a new verification email below.
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full bg-tf-lime text-tf-navy hover:bg-tf-lime/90 font-bold"
                    onClick={() => setShowResendForm(true)}
                    data-testid="button-show-resend-form"
                  >
                    Resend verification email
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setLocation("/login")}
                    data-testid="button-try-login"
                  >
                    Try signing in
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  Enter your email address to receive a new verification link
                </p>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onResendSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              autoComplete="email"
                              data-testid="input-resend-email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowResendForm(false)}
                        data-testid="button-cancel-resend"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-tf-lime text-tf-navy hover:bg-tf-lime/90 font-bold"
                        disabled={resendVerificationMutation.isPending}
                        data-testid="button-resend-verification"
                      >
                        {resendVerificationMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send link"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          © 2025 TermFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
}
