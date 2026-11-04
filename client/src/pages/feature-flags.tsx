import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Gift, Phone, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";

interface Feature {
  key: string;
  name: string;
  description: string;
  icon: any;
  requiresSetup: boolean;
  setupLink?: string;
  costs: string;
}

const FEATURES: Feature[] = [
  {
    key: 'whatsapp_integration',
    name: 'WhatsApp Integration',
    description: 'Enable WhatsApp messaging for tenant communications. Requires Twilio account.',
    icon: MessageSquare,
    requiresSetup: true,
    setupLink: '/connect',
    costs: 'Twilio charges apply per message (~$0.005/message)',
  },
  {
    key: 'incentives_system',
    name: 'Automated Incentives',
    description: 'Offer automated discounts and incentives to speed up conversions.',
    icon: Gift,
    requiresSetup: false,
    costs: 'No additional costs - discount amounts determined by you',
  },
  {
    key: 'ai_call_scoring',
    name: 'AI Call Scoring',
    description: 'Analyze phone calls with AI to score staff performance and extract insights.',
    icon: Phone,
    requiresSetup: true,
    setupLink: '/connect',
    costs: 'JustCall charges apply per call recording (~$0.01/minute)',
  },
];

export default function FeatureFlags() {
  const { toast } = useToast();
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    feature: Feature | null;
    action: 'enable' | 'disable';
  }>({ open: false, feature: null, action: 'enable' });

  const { data: flags, isLoading } = useQuery({
    queryKey: ['/api/feature-flags'],
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ featureKey, enabled }: { featureKey: string; enabled: boolean }) => {
      return apiRequest('/api/feature-flags', {
        method: 'POST',
        body: JSON.stringify({ featureKey, enabled }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/feature-flags'] });
      toast({
        title: "Feature updated",
        description: `Feature has been ${dialogState.action === 'enable' ? 'enabled' : 'disabled'} successfully.`,
      });
      setDialogState({ open: false, feature: null, action: 'enable' });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update feature flag",
        variant: "destructive",
      });
    },
  });

  const getFeatureStatus = (featureKey: string): boolean => {
    if (!flags) return false;
    const flag = flags.find((f: any) => f.featureKey === featureKey);
    return flag?.enabled || false;
  };

  const handleToggleClick = (feature: Feature, currentStatus: boolean) => {
    setDialogState({
      open: true,
      feature,
      action: currentStatus ? 'disable' : 'enable',
    });
  };

  const handleConfirm = () => {
    if (!dialogState.feature) return;
    
    toggleMutation.mutate({
      featureKey: dialogState.feature.key,
      enabled: dialogState.action === 'enable',
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center" data-testid="loading-feature-flags">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Feature Flags | TermFlow"
        description="Manage optional features for your property management account"
      />
      
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Feature Flags</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Enable or disable optional features for your account. Some features may have additional costs or require setup.
          </p>
        </div>

        <div className="space-y-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            const isEnabled = getFeatureStatus(feature.key);

            return (
              <Card key={feature.key} data-testid={`card-feature-${feature.key}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" data-testid={`icon-${feature.key}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg" data-testid={`text-feature-name-${feature.key}`}>
                            {feature.name}
                          </CardTitle>
                          {isEnabled && (
                            <Badge variant="default" data-testid={`badge-enabled-${feature.key}`}>
                              Enabled
                            </Badge>
                          )}
                          {feature.requiresSetup && !isEnabled && (
                            <Badge variant="outline" data-testid={`badge-setup-required-${feature.key}`}>
                              Setup Required
                            </Badge>
                          )}
                        </div>
                        <CardDescription data-testid={`text-feature-description-${feature.key}`}>
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => handleToggleClick(feature, isEnabled)}
                      disabled={toggleMutation.isPending}
                      data-testid={`switch-feature-${feature.key}`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground" data-testid={`text-costs-${feature.key}`}>
                      <strong>Costs:</strong> {feature.costs}
                    </div>
                    {isEnabled && feature.requiresSetup && feature.setupLink && (
                      <Link href={feature.setupLink}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid={`button-setup-${feature.key}`}
                        >
                          Configure <ExternalLink className="ml-2 w-3 h-3" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <AlertDialog 
          open={dialogState.open} 
          onOpenChange={(open) => !toggleMutation.isPending && setDialogState({ ...dialogState, open })}
        >
          <AlertDialogContent data-testid="dialog-feature-confirmation">
            <AlertDialogHeader>
              <AlertDialogTitle data-testid="text-dialog-title">
                {dialogState.action === 'enable' ? 'Enable' : 'Disable'} {dialogState.feature?.name}?
              </AlertDialogTitle>
              <AlertDialogDescription data-testid="text-dialog-description">
                {dialogState.action === 'enable' ? (
                  <>
                    <p className="mb-3">{dialogState.feature?.description}</p>
                    
                    {dialogState.feature?.costs && (
                      <p className="text-sm mb-3">
                        <strong>Costs:</strong> {dialogState.feature.costs}
                      </p>
                    )}
                    
                    {dialogState.feature?.requiresSetup && (
                      <Alert className="mt-4" data-testid="alert-setup-required">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Setup Required</AlertTitle>
                        <AlertDescription>
                          You'll need to configure this integration before it works fully.
                          {dialogState.feature.setupLink && (
                            <Link href={dialogState.feature.setupLink}>
                              <Button 
                                variant="link" 
                                className="p-0 h-auto mt-2"
                                data-testid="button-go-to-setup"
                              >
                                Go to setup →
                              </Button>
                            </Link>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                ) : (
                  <p>
                    This will turn off {dialogState.feature?.name} for your account.
                    Any ongoing processes using this feature may be affected.
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                disabled={toggleMutation.isPending}
                data-testid="button-cancel-dialog"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                disabled={toggleMutation.isPending}
                data-testid="button-confirm-dialog"
                className={dialogState.action === 'disable' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
              >
                {toggleMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {dialogState.action === 'enable' ? 'Enable Feature' : 'Disable Feature'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
