import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Check, Code2, MessageSquare, Mail, Phone, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const baseUrl = window.location.origin;
  const whatsappWebhookUrl = `${baseUrl}/api/webhooks/whatsapp`;
  const emailWebhookUrl = `${baseUrl}/api/webhooks/email`;
  const justCallWebhookUrl = `${baseUrl}/api/webhooks/justcall`;

  const copyToClipboard = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    toast({
      title: "Copied!",
      description: `${itemName} copied to clipboard`,
    });
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const embeddableFormHtml = `<!-- TermFlow Lead Capture Form -->
<div id="termflow-form-container"></div>
<script>
(function() {
  const API_URL = '${baseUrl}/api/leads/public-form';
  
  const styles = \`
    .termflow-form { 
      max-width: 500px; 
      margin: 0 auto; 
      padding: 24px; 
      background: #ffffff; 
      border-radius: 8px; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .termflow-form h2 { 
      margin: 0 0 8px 0; 
      font-size: 24px; 
      font-weight: 600; 
      color: #111827; 
    }
    .termflow-form p { 
      margin: 0 0 20px 0; 
      color: #6b7280; 
      font-size: 14px; 
    }
    .termflow-form-group { 
      margin-bottom: 16px; 
    }
    .termflow-form label { 
      display: block; 
      margin-bottom: 6px; 
      font-size: 14px; 
      font-weight: 500; 
      color: #374151; 
    }
    .termflow-form input, .termflow-form select { 
      width: 100%; 
      padding: 10px 12px; 
      border: 1px solid #d1d5db; 
      border-radius: 6px; 
      font-size: 14px; 
      box-sizing: border-box;
    }
    .termflow-form input:focus, .termflow-form select:focus { 
      outline: none; 
      border-color: #3b82f6; 
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); 
    }
    .termflow-form button { 
      width: 100%; 
      padding: 12px; 
      background: #3b82f6; 
      color: white; 
      border: none; 
      border-radius: 6px; 
      font-size: 16px; 
      font-weight: 600; 
      cursor: pointer; 
    }
    .termflow-form button:hover { 
      background: #2563eb; 
    }
    .termflow-form button:disabled { 
      background: #9ca3af; 
      cursor: not-allowed; 
    }
    .termflow-success { 
      text-align: center; 
      padding: 40px 20px; 
    }
    .termflow-success-icon { 
      font-size: 48px; 
      color: #10b981; 
      margin-bottom: 16px; 
    }
    .termflow-error { 
      color: #dc2626; 
      font-size: 14px; 
      margin-top: 4px; 
    }
  \`;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  const container = document.getElementById('termflow-form-container');
  
  let submitted = false;
  
  function render() {
    if (submitted) {
      container.innerHTML = \`
        <div class="termflow-form">
          <div class="termflow-success">
            <div class="termflow-success-icon">✓</div>
            <h2>Thank you!</h2>
            <p style="margin-top: 12px;">We've received your enquiry and will be in touch shortly via WhatsApp or email.</p>
            <p style="color: #6b7280; font-size: 14px;">Check your WhatsApp for instant viewing options.</p>
          </div>
        </div>
      \`;
    } else {
      container.innerHTML = \`
        <form class="termflow-form" id="termflow-form">
          <h2>Quick Enquiry</h2>
          <p>Tell us what you're looking for and we'll get back to you within minutes</p>
          
          <div class="termflow-form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" required placeholder="John Smith">
          </div>
          
          <div class="termflow-form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required placeholder="john@example.com">
          </div>
          
          <div class="termflow-form-group">
            <label for="phone">Phone / WhatsApp</label>
            <input type="tel" id="phone" name="phone" required placeholder="+44 7700 900000">
          </div>
          
          <div class="termflow-form-group">
            <label for="propertyName">Which property interests you?</label>
            <select id="propertyName" name="propertyName" required>
              <option value="">Select a property</option>
              <option value="Stanley House">Stanley House (City Centre)</option>
              <option value="Broadgate House">Broadgate House (Beeston)</option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </div>
          
          <div class="termflow-form-group">
            <label for="roomType">Room Type Preference</label>
            <select id="roomType" name="roomType" required>
              <option value="">Select room type</option>
              <option value="En-suite">En-suite</option>
              <option value="Studio">Studio</option>
              <option value="Cluster Flat">Cluster Flat</option>
              <option value="Any">Any</option>
            </select>
          </div>
          
          <button type="submit" id="submit-btn">Submit Enquiry</button>
        </form>
      \`;
      
      document.getElementById('termflow-form').addEventListener('submit', handleSubmit);
    }
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const formData = new FormData(form);
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          propertyName: formData.get('propertyName'),
          roomType: formData.get('roomType'),
        }),
      });
      
      if (response.ok) {
        submitted = true;
        render();
      } else {
        alert('Failed to submit. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Enquiry';
      }
    } catch (error) {
      alert('Network error. Please check your connection and try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Enquiry';
    }
  }
  
  render();
})();
</script>
<!-- End TermFlow Form -->`;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Integrations & Setup</h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Connect your automation channels and embed lead capture forms on your website
        </p>
      </div>

      <Tabs defaultValue="form" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="form" data-testid="tab-form">
            <Globe className="w-4 h-4 mr-2" />
            Web Form
          </TabsTrigger>
          <TabsTrigger value="whatsapp" data-testid="tab-whatsapp">
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="email" data-testid="tab-email">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="justcall" data-testid="tab-justcall">
            <Phone className="w-4 h-4 mr-2" />
            JustCall
          </TabsTrigger>
        </TabsList>

        {/* Embeddable Form */}
        <TabsContent value="form" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Embeddable Lead Capture Form
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Add this HTML snippet to your website to capture student enquiries
                  </CardDescription>
                </div>
                <Badge variant="secondary">HTML</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Code2 className="h-4 w-4" />
                <AlertDescription>
                  This is a standalone HTML snippet that works on any website. No dependencies required.
                </AlertDescription>
              </Alert>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">HTML Code</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(embeddableFormHtml, 'Form HTML')}
                    data-testid="button-copy-form-html"
                  >
                    {copiedItem === 'Form HTML' ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedItem === 'Form HTML' ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
                <div className="relative bg-muted rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm" data-testid="text-form-html">
                    <code>{embeddableFormHtml}</code>
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Setup Instructions</h3>
                <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Copy the HTML code above</li>
                  <li>Paste it into your website's HTML where you want the form to appear</li>
                  <li>The form will automatically submit to TermFlow and create leads</li>
                  <li>Students will receive WhatsApp messages with viewing options</li>
                  <li>All submissions appear in your Leads dashboard automatically</li>
                </ol>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full" data-testid="button-get-help-form">
                  Need Help? Get Step-by-Step Assistance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Integration */}
        <TabsContent value="whatsapp" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    WhatsApp Webhook Integration
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Connect Twilio to enable AI-powered WhatsApp conversations
                  </CardDescription>
                </div>
                <Badge>Twilio</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertDescription>
                  Ava (your AI agent) will automatically respond to WhatsApp messages with property info, viewings, and booking assistance
                </AlertDescription>
              </Alert>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Webhook URL</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(whatsappWebhookUrl, 'WhatsApp URL')}
                    data-testid="button-copy-whatsapp-url"
                  >
                    {copiedItem === 'WhatsApp URL' ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedItem === 'WhatsApp URL' ? 'Copied!' : 'Copy URL'}
                  </Button>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <code className="text-sm break-all" data-testid="text-whatsapp-url">{whatsappWebhookUrl}</code>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Setup Instructions</h3>
                <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Log in to your <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Twilio Console</a></li>
                  <li>Go to <strong>Messaging → Try it out → Send a WhatsApp message</strong></li>
                  <li>Configure your WhatsApp Sandbox or production number</li>
                  <li>In <strong>Webhooks</strong>, set "When a message comes in" to the webhook URL above</li>
                  <li>Set method to <strong>POST</strong></li>
                  <li>Save your Twilio credentials in TermFlow environment:
                    <ul className="ml-6 mt-2 space-y-1">
                      <li>• <code>TWILIO_ACCOUNT_SID</code></li>
                      <li>• <code>TWILIO_AUTH_TOKEN</code></li>
                      <li>• <code>TWILIO_WHATSAPP_NUMBER</code> (e.g. whatsapp:+14155238886)</li>
                    </ul>
                  </li>
                  <li>Test by sending a message to your WhatsApp number - Ava should respond!</li>
                </ol>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full" data-testid="button-get-help-whatsapp">
                  Need Help? Get Step-by-Step Assistance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Integration */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Email Webhook Integration
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Auto-respond to portal enquiries with WhatsApp and form links
                  </CardDescription>
                </div>
                <Badge>Email Parser</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  When students email from Rightmove, Zoopla, or other portals, TermFlow sends instant auto-replies with multi-channel options
                </AlertDescription>
              </Alert>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Webhook URL</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(emailWebhookUrl, 'Email URL')}
                    data-testid="button-copy-email-url"
                  >
                    {copiedItem === 'Email URL' ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedItem === 'Email URL' ? 'Copied!' : 'Copy URL'}
                  </Button>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <code className="text-sm break-all" data-testid="text-email-url">{emailWebhookUrl}</code>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Setup Instructions</h3>
                <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Set up an email parsing service (Zapier Email Parser, Mailparser, or custom)</li>
                  <li>Configure a dedicated email address for portal enquiries (e.g. leads@yourdomain.com)</li>
                  <li>Forward portal emails to your parser email address</li>
                  <li>Configure the parser to extract:
                    <ul className="ml-6 mt-2 space-y-1">
                      <li>• <code>from</code> - Student's email</li>
                      <li>• <code>subject</code> - Email subject</li>
                      <li>• <code>body</code> - Message content</li>
                      <li>• <code>propertyRef</code> - Property name (optional)</li>
                    </ul>
                  </li>
                  <li>Set the webhook URL above as the parser's destination</li>
                  <li>Configure SMTP settings in TermFlow for auto-reply delivery:
                    <ul className="ml-6 mt-2 space-y-1">
                      <li>• <code>SMTP_HOST</code></li>
                      <li>• <code>SMTP_PORT</code></li>
                      <li>• <code>SMTP_USER</code></li>
                      <li>• <code>SMTP_PASS</code></li>
                    </ul>
                  </li>
                  <li>Test by sending an enquiry email - student should get auto-reply with CTAs!</li>
                </ol>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full" data-testid="button-get-help-email">
                  Need Help? Get Step-by-Step Assistance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JustCall Integration */}
        <TabsContent value="justcall" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-purple-600" />
                    JustCall AI Summary Integration
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Get AI-powered call transcriptions and insights from phone conversations
                  </CardDescription>
                </div>
                <Badge>JustCall</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Phone className="h-4 w-4" />
                <AlertDescription>
                  AI automatically summarizes call intents, extracts key details, and scores staff performance
                </AlertDescription>
              </Alert>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Webhook URL</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(justCallWebhookUrl, 'JustCall URL')}
                    data-testid="button-copy-justcall-url"
                  >
                    {copiedItem === 'JustCall URL' ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedItem === 'JustCall URL' ? 'Copied!' : 'Copy URL'}
                  </Button>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <code className="text-sm break-all" data-testid="text-justcall-url">{justCallWebhookUrl}</code>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Setup Instructions</h3>
                <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Log in to your <a href="https://app.justcall.io" target="_blank" rel="noopener noreferrer" className="text-primary underline">JustCall Dashboard</a></li>
                  <li>Go to <strong>Settings → Integrations → Webhooks</strong></li>
                  <li>Click <strong>Add Webhook</strong></li>
                  <li>Enter the webhook URL above</li>
                  <li>Select events to track:
                    <ul className="ml-6 mt-2 space-y-1">
                      <li>• <code>call.completed</code> - When call ends</li>
                      <li>• <code>recording.available</code> - When recording is ready</li>
                    </ul>
                  </li>
                  <li>Set your JustCall API key in TermFlow environment:
                    <ul className="ml-6 mt-2 space-y-1">
                      <li>• <code>JUSTCALL_API_KEY</code></li>
                    </ul>
                  </li>
                  <li>Enable call transcription in JustCall settings</li>
                  <li>Make a test call - check Analytics → AI Call Logs for AI summary!</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">What You'll Get</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span><strong>AI Intent Detection</strong> - Viewing, pricing, availability, complaint, etc.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span><strong>Sentiment Analysis</strong> - Positive, neutral, or negative call sentiment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span><strong>Staff Performance Scoring</strong> - Professional, helpful, knowledge scores</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span><strong>Action Items</strong> - Follow-ups, bookings, callbacks extracted automatically</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full" data-testid="button-get-help-justcall">
                  Need Help? Get Step-by-Step Assistance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
