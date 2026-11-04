import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mail, Phone, Webhook, Check, Copy, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Connect() {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet has been copied successfully.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const whatsappEmbedCode = `<!-- WhatsApp Widget -->
<script>
  window.addEventListener('load', function() {
    var whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/447700900000?text=Hi, I\'d like to enquire about accommodation';
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.target = '_blank';
    whatsappBtn.innerHTML = '<i class="fa fa-whatsapp"></i>';
    document.body.appendChild(whatsappBtn);
  });
</script>`;

  const emailForwardingExample = `leads-stanley-house@termflow.app
leads-broadgate-house@termflow.app`;

  const webhookExample = `POST https://api.termflow.app/webhooks/lead
{
  "property_id": "your-property-id",
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+447700900000",
  "message": "Interested in Premium Studio"
}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-card">
        <div className="container max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight mb-4" data-testid="text-hero-title">
              Connect All Your Lead Sources
            </h1>
            <p className="text-xl text-primary mb-2" data-testid="text-hero-tagline">
              One platform. Every enquiry. Fully automated.
            </p>
            <p className="text-lg text-muted-foreground" data-testid="text-hero-description">
              Single channel where leads from all portals, estate agents, websites, and messages flow into one place. 
              Our AI progresses and closes them automatically—no leads fall through the cracks.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Options */}
      <div className="container max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8" data-testid="text-integrations-title">
          Integration Options
        </h2>

        {/* Shared Calendar - Strongly Recommended */}
        <Card className="border-2 border-primary mb-6 hover-elevate" data-testid="card-integration-shared-calendar">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  Shared Calendar Integration
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">STRONGLY RECOMMENDED</span>
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-base font-medium">
              ⚠️ Connect your shared calendar to avoid any missed viewings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Why this is critical:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Never miss a viewing</strong> - All bookings sync instantly to your calendar</li>
                <li>• <strong>Mobile reminders</strong> - Get notifications 24h and 1h before each viewing</li>
                <li>• <strong>Google Meet links</strong> - Auto-generated for video viewings</li>
                <li>• <strong>Two-way sync</strong> - Cancellations reflect immediately</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">What happens automatically:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Student books a viewing via AI → Calendar event created</li>
                <li>2. You get email + mobile notification with all details</li>
                <li>3. Viewing rescheduled → Calendar updates automatically</li>
                <li>4. Viewing cancelled → Event removed from calendar</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">✅ Already Connected</p>
              <p className="text-sm text-muted-foreground">
                Your shared calendar is integrated and syncing. All viewings are automatically added with:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Tenant name, phone, and email</li>
                <li>• Property address and room type</li>
                <li>• Viewing type (in-person/video/self-guided)</li>
                <li>• Auto-generated video call link (video viewings)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* WhatsApp Integration */}
          <Card className="hover-elevate" data-testid="card-integration-whatsapp">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>WhatsApp Integration</CardTitle>
              </div>
              <CardDescription>
                Embed WhatsApp widget on your website for instant 24/7 AI-powered responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">How it works:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Leads automatically captured when students message</li>
                  <li>• AI responds 24/7 with property details</li>
                  <li>• Books viewings and answers questions instantly</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Setup:</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Copy the embed code below</li>
                  <li>2. Paste into your website footer</li>
                  <li>3. Configure your WhatsApp number in settings</li>
                </ol>
              </div>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                  <code>{whatsappEmbedCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(whatsappEmbedCode, 'whatsapp')}
                  data-testid="button-copy-whatsapp"
                >
                  {copiedId === 'whatsapp' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Parser Integration */}
          <Card className="hover-elevate" data-testid="card-integration-email">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email Parser Integration</CardTitle>
              </div>
              <CardDescription>
                Forward leads from ANY source to your dedicated TermFlow email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">How it works:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• System automatically processes forwarded emails</li>
                  <li>• Creates leads with extracted contact details</li>
                  <li>• AI immediately engages with enquiry</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Works with:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Rightmove & Zoopla enquiries</li>
                  <li>• Estate agent referrals</li>
                  <li>• Website contact forms</li>
                  <li>• Student portal messages</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Setup:</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Get your unique email addresses below</li>
                  <li>2. Set up forwarding rules in your email client</li>
                  <li>3. All forwarded emails become leads automatically</li>
                </ol>
              </div>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                  <code>{emailForwardingExample}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(emailForwardingExample, 'email')}
                  data-testid="button-copy-email"
                >
                  {copiedId === 'email' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* JustCall Phone Integration */}
          <Card className="hover-elevate" data-testid="card-integration-justcall">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>JustCall Phone Integration</CardTitle>
              </div>
              <CardDescription>
                AI monitors calls and provides intelligent follow-up with call context
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">How it works:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• JustCall provides AI-powered transcription and analysis</li>
                  <li>• Automatic lead matching by caller phone number</li>
                  <li>• AI references call context in follow-up messages</li>
                  <li>• Seamless handoff between phone and WhatsApp/email</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Auto-transcription of every call</li>
                  <li>• Sentiment analysis and action items</li>
                  <li>• Seamless lead matching</li>
                  <li>• Call context stored for AI reference</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Setup:</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Get API key + secret from JustCall dashboard</li>
                  <li>2. Add webhook URL: https://your-domain.repl.co/api/webhooks/justcall</li>
                  <li>3. Subscribe to "Call AI report generated" webhook</li>
                  <li>4. Test with a sample call to verify connection</li>
                </ol>
              </div>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                  <code>POST https://your-domain.repl.co/api/webhooks/justcall</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard('https://your-domain.repl.co/api/webhooks/justcall', 'justcall')}
                  data-testid="button-copy-justcall"
                >
                  {copiedId === 'justcall' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Student Portal Webhooks */}
          <Card className="hover-elevate" data-testid="card-integration-webhooks">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Webhook className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Student Portal Webhooks</CardTitle>
              </div>
              <CardDescription>
                Direct integration with student accommodation portals for real-time lead capture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Supported Portals:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Accommodation for Students</li>
                  <li>• Student.com</li>
                  <li>• Uniplaces</li>
                  <li>• University Living</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">How it works:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Instant lead capture when student enquires</li>
                  <li>• Real-time data sync to TermFlow</li>
                  <li>• AI engages within seconds of enquiry</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Setup:</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Copy your webhook URL below</li>
                  <li>2. Add to portal settings (integration section)</li>
                  <li>3. Test webhook to confirm connection</li>
                </ol>
              </div>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                  <code>{webhookExample}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(webhookExample, 'webhook')}
                  data-testid="button-copy-webhook"
                >
                  {copiedId === 'webhook' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <Card className="bg-primary/5 border-primary/20" data-testid="card-benefits">
          <CardHeader>
            <CardTitle className="text-2xl">Why Connect Everything to TermFlow?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">All enquiries in one dashboard</h4>
                  <p className="text-sm text-muted-foreground">
                    No more juggling multiple platforms. Every lead from every source appears in one unified view.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">AI handles 90% of conversations automatically</h4>
                  <p className="text-sm text-muted-foreground">
                    From initial enquiry to viewing booking, AI manages the entire journey with human-like interactions.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">No leads fall through the cracks</h4>
                  <p className="text-sm text-muted-foreground">
                    Instant responses 24/7 mean you never miss an opportunity, even while you sleep.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Seamless handoff from AI to human when needed</h4>
                  <p className="text-sm text-muted-foreground">
                    AI knows when to escalate. You step in only when your personal touch is truly required.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4" data-testid="text-cta-title">
            Ready to Connect Your Lead Sources?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start by choosing an integration method above, or contact our team for a custom integration solution.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" data-testid="button-start-connecting">
              Start Connecting
            </Button>
            <Button size="lg" variant="outline" data-testid="button-contact-support">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
