import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Clock, TrendingDown, Zap, MessageSquare, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ServiceSchema } from '@/components/ServiceSchema';

export default function ClearingMode() {
  const [enabled, setEnabled] = useState(false);
  const [maxDiscount, setMaxDiscount] = useState(20);
  const [rapidOnboarding, setRapidOnboarding] = useState(true);
  const [whatsappBlitz, setWhatsappBlitz] = useState(true);
  const [flexibleTerms, setFlexibleTerms] = useState(false);

  return (
    <>
      <Helmet>
        <title>Clearing Mode Settings - TermFlow</title>
      </Helmet>

      <ServiceSchema
        name="Clearing Mode - High-Volume Enquiry Management"
        description="Handle 400+ student enquiries per week during clearing season with automated responses, viewing scheduling, and application processing for PBSA providers."
        provider={{
          name: "TermFlow",
          url: "https://termflow.co.uk"
        }}
        serviceType="Property Management Software"
        offers={{
          description: "Seasonal add-on for existing customers"
        }}
      />

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Clearing Mode</h1>
          <p className="text-muted-foreground">
            Fill last-minute vacancies during Clearing (Aug-Sep) with automated discounting and rapid onboarding
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-6 border-orange-500/50" data-testid="clearing-mode-status">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Clearing Mode Status</CardTitle>
                <CardDescription>
                  {enabled ? 'Active - Automatically filling vacancies' : 'Inactive'}
                </CardDescription>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={setEnabled}
                data-testid="switch-clearing-mode"
              />
            </div>
          </CardHeader>
          {enabled && (
            <CardContent>
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Term starts in 28 days</AlertTitle>
                <AlertDescription>
                  Clearing Mode will automatically adjust discounts and urgency based on time remaining
                </AlertDescription>
              </Alert>
            </CardContent>
          )}
        </Card>

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Automated Discounting */}
          <Card data-testid="setting-discounting">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingDown className="w-6 h-6 text-orange-500" />
                <div>
                  <CardTitle>Automated Discounting</CardTitle>
                  <CardDescription>
                    AI suggests discount rates based on days to term start
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="max-discount">Maximum Discount (%)</Label>
                  <Input
                    id="max-discount"
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    min={0}
                    max={50}
                    data-testid="input-max-discount"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    AI will never suggest discounts above this limit
                  </p>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Current AI suggestion:</strong> 15% discount (23 days to term start)
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Rapid Onboarding */}
          <Card data-testid="setting-rapid-onboarding">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-orange-500" />
                  <div>
                    <CardTitle>Rapid Onboarding</CardTitle>
                    <CardDescription>
                      48-hour viewing-to-move-in timeline (vs 7-14 days)
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={rapidOnboarding}
                  onCheckedChange={setRapidOnboarding}
                  data-testid="switch-rapid-onboarding"
                />
              </div>
            </CardHeader>
          </Card>

          {/* WhatsApp Blitz */}
          <Card data-testid="setting-whatsapp-blitz">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                  <div>
                    <CardTitle>WhatsApp Blitz</CardTitle>
                    <CardDescription>
                      Proactive outreach to warm leads with discount offers
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={whatsappBlitz}
                  onCheckedChange={setWhatsappBlitz}
                  data-testid="switch-whatsapp-blitz"
                />
              </div>
            </CardHeader>
          </Card>

          {/* Flexible Terms */}
          <Card data-testid="setting-flexible-terms">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-orange-500" />
                  <div>
                    <CardTitle>Flexible Terms</CardTitle>
                    <CardDescription>
                      Offer term-time contracts (4-5 months instead of 12)
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={flexibleTerms}
                  onCheckedChange={setFlexibleTerms}
                  data-testid="switch-flexible-terms"
                />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <Button className="w-full bg-orange-500 hover:bg-orange-600" data-testid="button-save-clearing-settings">
            Save Clearing Mode Settings
          </Button>
        </div>
      </div>
    </>
  );
}
