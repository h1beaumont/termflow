import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CreditCard, Download, ExternalLink, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Subscription {
  plan: string;
  status: string;
  interval: string;
  amount: number | null;
  currency?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  invoicePdf: string;
  hostedInvoiceUrl: string;
}

export default function Billing() {
  const { toast } = useToast();

  // Fetch subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery<Subscription>({
    queryKey: ["/api/billing/subscription"],
  });

  // Fetch invoices
  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/billing/invoices"],
  });

  // Open customer portal
  const openCustomerPortal = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/billing/create-customer-portal-session", "POST", {});
      return response;
    },
    onSuccess: (data: any) => {
      window.open(data.url, "_blank");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to open customer portal",
        variant: "destructive",
      });
    },
  });

  // Cancel subscription
  const cancelSubscription = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/billing/cancel-subscription", "POST", {});
    },
    onSuccess: (data: any) => {
      toast({
        title: "Subscription Cancelled",
        description: `Your subscription will remain active until ${format(new Date(data.periodEnd), "MMMM d, yyyy")}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/billing/subscription"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    },
  });

  // Switch to annual billing
  const switchToAnnual = useMutation({
    mutationFn: async () => {
      if (!subscription?.plan) return;
      return await apiRequest("/api/billing/update-subscription", "POST", {
        plan: subscription.plan,
        interval: "annual",
      });
    },
    onSuccess: () => {
      toast({
        title: "Switched to Annual Billing",
        description: "You're now saving 16% with annual billing!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/billing/subscription"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to switch to annual billing",
        variant: "destructive",
      });
    },
  });

  if (subscriptionLoading) {
    return (
      <div className="p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", label: string }> = {
      active: { variant: "default", label: "Active" },
      cancelled: { variant: "secondary", label: "Cancelled" },
      past_due: { variant: "destructive", label: "Past Due" },
      incomplete: { variant: "outline", label: "Incomplete" },
    };

    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant} data-testid={`badge-status-${status}`}>{config.label}</Badge>;
  };

  const getPlanDisplayName = (plan?: string) => {
    if (!plan) return "No Plan";
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  const formatCurrency = (amount: number, currency: string = "gbp") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const calculateAnnualSavings = () => {
    if (!subscription?.amount || !subscription?.plan) return { monthly: 0, annual: 0, savings: 0 };
    
    const prices: Record<string, { monthly: number, annual: number }> = {
      starter: { monthly: 99, annual: 990 },
      professional: { monthly: 199, annual: 1990 },
    };

    const planPrices = prices[subscription.plan];
    if (!planPrices) return { monthly: 0, annual: 0, savings: 0 };

    const savings = (planPrices.monthly * 12) - planPrices.annual;
    const percentage = Math.round((savings / (planPrices.monthly * 12)) * 100);

    return {
      monthly: planPrices.monthly,
      annual: planPrices.annual,
      savings,
      percentage,
    };
  };

  const annualSavings = calculateAnnualSavings();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold" data-testid="text-page-title">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2" data-testid="text-page-description">
          Manage your subscription, invoices, and payment methods
        </p>
      </div>

      {/* Current Subscription Section */}
      <Card data-testid="card-current-subscription">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
          <div>
            <CardTitle data-testid="text-subscription-plan">{getPlanDisplayName(subscription?.plan)} Plan</CardTitle>
            <CardDescription data-testid="text-subscription-interval">
              {subscription?.interval === "annual" ? "Annual" : "Monthly"} Billing
            </CardDescription>
          </div>
          {getStatusBadge(subscription?.status)}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold" data-testid="text-subscription-amount">
              {subscription?.amount ? formatCurrency(subscription.amount, subscription.currency) : "—"}
            </span>
            <span className="text-muted-foreground" data-testid="text-subscription-period">
              / {subscription?.interval === "annual" ? "year" : "month"}
            </span>
          </div>
          
          {subscription?.currentPeriodEnd && (
            <div className="text-sm text-muted-foreground" data-testid="text-next-billing-date">
              Next billing date: {format(new Date(subscription.currentPeriodEnd), "MMMM d, yyyy")}
            </div>
          )}

          {subscription?.cancelAtPeriodEnd && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md" data-testid="alert-cancellation-notice">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Your subscription will be cancelled on {format(new Date(subscription.currentPeriodEnd), "MMMM d, yyyy")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Annual Pricing Incentive Card */}
      {subscription?.interval === "monthly" && subscription?.plan !== "enterprise" && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10" data-testid="card-annual-incentive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle data-testid="text-annual-incentive-title">Save {annualSavings.percentage}% with Annual Billing</CardTitle>
            </div>
            <CardDescription data-testid="text-annual-incentive-description">
              Pay for 10 months, get 12 months of service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground" data-testid="text-monthly-price-label">Monthly</p>
                <p className="text-2xl font-bold" data-testid="text-monthly-price">
                  {formatCurrency(annualSavings.monthly)} × 12 = {formatCurrency(annualSavings.monthly * 12)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground" data-testid="text-annual-price-label">Annual</p>
                <p className="text-2xl font-bold text-primary" data-testid="text-annual-price">
                  {formatCurrency(annualSavings.annual)}
                </p>
              </div>
            </div>

            <div className="p-3 bg-primary/10 rounded-md">
              <p className="text-sm font-medium text-primary" data-testid="text-savings-amount">
                Save {formatCurrency(annualSavings.savings)} per year
              </p>
            </div>

            <Button 
              className="w-full" 
              onClick={() => switchToAnnual.mutate()}
              disabled={switchToAnnual.isPending}
              data-testid="button-switch-to-annual"
            >
              Switch to Annual Billing
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Billing Cycle Information */}
      {subscription?.currentPeriodStart && subscription?.currentPeriodEnd && (
        <Card data-testid="card-billing-cycle">
          <CardHeader>
            <CardTitle data-testid="text-billing-cycle-title">Billing Cycle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground" data-testid="text-current-period-label">Current Period</span>
              <span className="text-sm font-medium" data-testid="text-current-period">
                {format(new Date(subscription.currentPeriodStart), "MMM d, yyyy")} - {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground" data-testid="text-next-payment-label">Next Payment Date</span>
              <span className="text-sm font-medium" data-testid="text-next-payment-date">
                {format(new Date(subscription.currentPeriodEnd), "MMMM d, yyyy")}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Section */}
      <Card data-testid="card-invoices">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
          <div>
            <CardTitle data-testid="text-invoices-title">Invoices</CardTitle>
            <CardDescription data-testid="text-invoices-description">
              Download your billing history
            </CardDescription>
          </div>
          {subscription?.status === "active" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => openCustomerPortal.mutate()}
              disabled={openCustomerPortal.isPending}
              data-testid="button-open-portal"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage in Portal
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {invoicesLoading ? (
            <div className="text-sm text-muted-foreground" data-testid="text-loading-invoices">Loading invoices...</div>
          ) : invoices.length === 0 ? (
            <div className="text-sm text-muted-foreground" data-testid="text-no-invoices">No invoices yet</div>
          ) : (
            <Table data-testid="table-invoices">
              <TableHeader>
                <TableRow>
                  <TableHead data-testid="text-invoice-header-date">Date</TableHead>
                  <TableHead data-testid="text-invoice-header-amount">Amount</TableHead>
                  <TableHead data-testid="text-invoice-header-status">Status</TableHead>
                  <TableHead data-testid="text-invoice-header-download">Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                    <TableCell data-testid={`text-invoice-date-${invoice.id}`}>
                      {format(new Date(invoice.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell data-testid={`text-invoice-amount-${invoice.id}`}>
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </TableCell>
                    <TableCell data-testid={`text-invoice-status-${invoice.id}`}>
                      <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        data-testid={`button-download-invoice-${invoice.id}`}
                      >
                        <a href={invoice.invoicePdf} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Subscription Management */}
      <Card data-testid="card-subscription-management">
        <CardHeader>
          <CardTitle data-testid="text-management-title">Subscription Management</CardTitle>
          <CardDescription data-testid="text-management-description">
            {subscription?.status === "active" ? "Update payment method or cancel your subscription" : "Choose a plan to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {subscription?.status === "active" ? (
            <>
              <Button
                variant="outline"
                onClick={() => openCustomerPortal.mutate()}
                disabled={openCustomerPortal.isPending}
                data-testid="button-update-payment-method"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Update Payment Method
              </Button>

              {!subscription?.cancelAtPeriodEnd && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" data-testid="button-cancel-subscription">
                      Cancel Subscription
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent data-testid="dialog-cancel-confirmation">
                    <AlertDialogHeader>
                      <AlertDialogTitle data-testid="text-cancel-dialog-title">
                        Are you sure you want to cancel?
                      </AlertDialogTitle>
                      <AlertDialogDescription data-testid="text-cancel-dialog-description">
                        Your subscription will remain active until{" "}
                        {subscription?.currentPeriodEnd && format(new Date(subscription.currentPeriodEnd), "MMMM d, yyyy")}.
                        After that, you'll lose access to all features, but you can export your data before the end date.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-testid="button-keep-subscription">
                        Keep Subscription
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => cancelSubscription.mutate()}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        data-testid="button-confirm-cancellation"
                      >
                        Confirm Cancellation
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          ) : (
            <Button
              asChild
              data-testid="button-choose-plan"
            >
              <a href="/pricing">
                Choose a Plan
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
