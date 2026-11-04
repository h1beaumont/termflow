import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Download, ExternalLink, Sparkles, User, Bell } from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "wouter";

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

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery<Subscription>({
    queryKey: ["/api/billing/subscription"],
  });

  // Fetch invoices
  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/billing/invoices"],
  });

  // Fetch viewing preferences
  const { data: viewingPreferences } = useQuery({
    queryKey: ["/api/viewing-preferences"],
  });

  // Open customer portal
  const openCustomerPortal = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/billing/create-customer-portal-session", {});
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
      return await apiRequest("POST", "/api/billing/cancel-subscription", {});
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
      return await apiRequest("POST", "/api/billing/update-subscription", {
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

  // Toggle retention messaging
  const toggleRetentionMessaging = useMutation({
    mutationFn: async (enabled: boolean) => {
      return await apiRequest("POST", "/api/viewing-preferences", {
        autoRetentionMessaging: enabled,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/viewing-preferences"] });
      toast({
        title: "Preferences Updated",
        description: "Retention messaging settings saved",
      });
    },
  });

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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-bold" data-testid="text-page-title">Settings</h1>
        <p className="text-muted-foreground mt-2" data-testid="text-page-description">
          Manage your account, billing, and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6" data-testid="tabs-settings">
        <TabsList data-testid="tabs-list-settings">
          <TabsTrigger value="account" data-testid="tab-account">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="billing" data-testid="tab-billing">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6" data-testid="content-account">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details from Replit Auth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={user?.firstName || ""} 
                    disabled 
                    data-testid="input-first-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={user?.lastName || ""} 
                    disabled 
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user?.email || ""} 
                  disabled 
                  data-testid="input-email"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Profile information is managed through your Replit account
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6" data-testid="content-billing">
          {/* Current Subscription */}
          {subscription?.status && (
            <Card data-testid="card-current-subscription">
              <CardHeader>
                <CardTitle data-testid="text-subscription-title">Current Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground" data-testid="text-plan-label">Plan</p>
                    <p className="text-2xl font-bold" data-testid="text-plan-name">{getPlanDisplayName(subscription.plan)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground" data-testid="text-status-label">Status</p>
                    {getStatusBadge(subscription.status)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground" data-testid="text-billing-interval-label">Billing</p>
                    <p className="font-medium" data-testid="text-billing-interval">
                      {subscription.interval === 'annual' ? 'Annual' : 'Monthly'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground" data-testid="text-amount-label">Amount</p>
                    <p className="text-2xl font-bold" data-testid="text-amount">
                      {subscription.amount ? formatCurrency(subscription.amount / 100, subscription.currency) : "—"}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{subscription.interval === 'annual' ? 'year' : 'month'}
                      </span>
                    </p>
                  </div>
                </div>
                {subscription.currentPeriodEnd && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground" data-testid="text-next-billing-label">
                      {subscription.cancelAtPeriodEnd ? "Access ends" : "Next billing date"}
                    </p>
                    <p className="font-medium" data-testid="text-next-billing-date">
                      {format(new Date(subscription.currentPeriodEnd), "MMMM d, yyyy")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Annual Pricing Incentive */}
          {subscription?.interval === 'monthly' && subscription?.status === 'active' && (
            <Card className="border-primary/20 bg-primary/5" data-testid="card-annual-incentive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" data-testid="text-annual-title">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Save {annualSavings.percentage}% with Annual Billing
                </CardTitle>
                <CardDescription data-testid="text-annual-description">
                  Pay for 10 months, get 12 months of service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly</p>
                    <p className="text-lg font-semibold" data-testid="text-monthly-calculation">
                      £{annualSavings.monthly} × 12 = £{annualSavings.monthly * 12}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Annual</p>
                    <p className="text-lg font-semibold text-primary" data-testid="text-annual-price">
                      £{annualSavings.annual}
                    </p>
                  </div>
                </div>
                <div className="bg-primary/10 p-3 rounded-md" data-testid="card-savings">
                  <p className="text-sm font-medium text-primary">
                    Save £{annualSavings.savings} per year
                  </p>
                </div>
                <Button 
                  onClick={() => switchToAnnual.mutate()}
                  disabled={switchToAnnual.isPending}
                  className="w-full"
                  data-testid="button-switch-annual"
                >
                  Switch to Annual Billing
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Invoices */}
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
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6" data-testid="content-notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage your notification settings and automated messaging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-retention" className="text-base">
                    Automatic Retention Messaging
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Send automated retention messages to tenants on their checkout day
                  </p>
                </div>
                <Switch
                  id="auto-retention"
                  checked={viewingPreferences?.autoRetentionMessaging ?? false}
                  onCheckedChange={(checked) => toggleRetentionMessaging.mutate(checked)}
                  data-testid="switch-auto-retention"
                />
              </div>
              <div className="flex items-center justify-between opacity-50">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-base">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates for new leads and viewings
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  disabled
                  data-testid="switch-email-notifications"
                />
              </div>
              <div className="flex items-center justify-between opacity-50">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications" className="text-base">
                    SMS Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get text alerts for urgent property matters
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  disabled
                  data-testid="switch-sms-notifications"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
