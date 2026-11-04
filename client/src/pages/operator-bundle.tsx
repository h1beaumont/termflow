import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert } from '@/components/ui/alert';
import { Shield, Gift, Phone, Check } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ServiceSchema } from '@/components/ServiceSchema';

export default function OperatorBundle() {
  return (
    <>
      <Helmet>
        <title>Operator Bundle Settings - TermFlow</title>
      </Helmet>

      <ServiceSchema
        name="Operator Bundle - Advanced PBSA Automation Suite"
        description="Premium automation package for large PBSA operators with unlimited properties, priority support, custom integrations, and dedicated account management."
        provider={{
          name: "TermFlow",
          url: "https://termflow.co.uk"
        }}
        serviceType="Property Management Software"
        offers={{
          description: "Custom pricing for enterprise"
        }}
      />

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Operator Bundle</h1>
          <p className="text-muted-foreground">
            Manage approval workflows, incentives, and call scoring
          </p>
        </div>

        {/* Bundle Status */}
        <Card className="mb-6 border-purple-500/50" data-testid="bundle-status">
          <CardHeader>
            <CardTitle>Bundle Status</CardTitle>
            <CardDescription>
              £89/month - Save £28/mo compared to individual features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="font-medium">Approval Gate</div>
                  <div className="text-sm text-green-500">Active</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-500" />
                <div>
                  <div className="font-medium">Incentives</div>
                  <div className="text-sm text-green-500">Active</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="font-medium">Call Scoring</div>
                  <div className="text-sm text-green-500">Active</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Tabs */}
        <Tabs defaultValue="approval" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="approval" data-testid="tab-approval">
              <Shield className="w-4 h-4 mr-2" />
              Approval Gate
            </TabsTrigger>
            <TabsTrigger value="incentives" data-testid="tab-incentives">
              <Gift className="w-4 h-4 mr-2" />
              Incentives
            </TabsTrigger>
            <TabsTrigger value="calls" data-testid="tab-calls">
              <Phone className="w-4 h-4 mr-2" />
              Call Scoring
            </TabsTrigger>
          </TabsList>

          {/* Approval Gate Settings */}
          <TabsContent value="approval">
            <Card>
              <CardHeader>
                <CardTitle>Approval Gate Settings</CardTitle>
                <CardDescription>
                  Require manual approval before AI proceeds with contracts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Approval Required</div>
                    <div className="text-sm text-muted-foreground">
                      AI waits for your approval before sending contracts
                    </div>
                  </div>
                  <Switch defaultChecked data-testid="switch-approval-required" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto-Approve Applications</div>
                    <div className="text-sm text-muted-foreground">
                      Skip approval for applications meeting criteria
                    </div>
                  </div>
                  <Switch data-testid="switch-auto-approve" />
                </div>

                <Alert>
                  <Check className="h-4 w-4" />
                  <div className="ml-2">
                    <strong>27 applications</strong> awaiting your approval
                  </div>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Incentives Settings */}
          <TabsContent value="incentives">
            <Card>
              <CardHeader>
                <CardTitle>Incentives Settings</CardTitle>
                <CardDescription>
                  Configure automated discounts and bonuses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Early-Bird Discounts</div>
                    <div className="text-sm text-muted-foreground">
                      5-15% off for bookings 4+ months ahead
                    </div>
                  </div>
                  <Switch defaultChecked data-testid="switch-early-bird" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Referral Bonuses</div>
                    <div className="text-sm text-muted-foreground">
                      £50-£200 for successful tenant referrals
                    </div>
                  </div>
                  <Switch defaultChecked data-testid="switch-referrals" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Group Booking Deals</div>
                    <div className="text-sm text-muted-foreground">
                      10% off for 3+ students booking together
                    </div>
                  </div>
                  <Switch defaultChecked data-testid="switch-group-deals" />
                </div>

                <Alert>
                  <Check className="h-4 w-4" />
                  <div className="ml-2">
                    <strong>£2,450 saved</strong> by tenants this month via incentives
                  </div>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Call Scoring Settings */}
          <TabsContent value="calls">
            <Card>
              <CardHeader>
                <CardTitle>Call Scoring Settings</CardTitle>
                <CardDescription>
                  AI analyzes phone calls for performance insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Performance Scoring</div>
                    <div className="text-sm text-muted-foreground">
                      AI scores staff calls 0-100
                    </div>
                  </div>
                  <Switch defaultChecked data-testid="switch-performance-scoring" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Sentiment Analysis</div>
                    <div className="text-sm text-muted-foreground">
                      Track positive/negative conversation tones
                    </div>
                  </div>
                  <Switch defaultChecked data-testid="switch-sentiment" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Lead Update Suggestions</div>
                    <div className="text-sm text-muted-foreground">
                      AI suggests profile updates from call context
                    </div>
                  </div>
                  <Switch defaultChecked data-testid="switch-lead-updates" />
                </div>

                <Alert>
                  <Check className="h-4 w-4" />
                  <div className="ml-2">
                    <strong>Average score: 82/100</strong> across 156 calls this month
                  </div>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button className="w-full mt-6 bg-purple-500 hover:bg-purple-600" data-testid="button-save-bundle-settings">
          Save Settings
        </Button>
      </div>
    </>
  );
}
