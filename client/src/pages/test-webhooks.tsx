import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MessageSquare, Mail, Database, Copy, Check, Loader2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface WebhookLog {
  id: string;
  source: string;
  eventType: string;
  payload: any;
  processed: boolean;
  error?: string;
  createdAt: string;
}

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface TestResponse {
  success: boolean;
  aiResponse: string;
  lead: any;
  conversation: {
    id: string;
    messages: Message[];
  };
}

export default function TestWebhooksPage() {
  const { toast } = useToast();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  // WhatsApp test state
  const [whatsappPhone, setWhatsappPhone] = useState("+447700999888");
  const [whatsappBody, setWhatsappBody] = useState("Hi! I'm interested in a room at Stanley House.");
  const [whatsappResult, setWhatsappResult] = useState<TestResponse | null>(null);
  
  // Email test state
  const [emailFrom, setEmailFrom] = useState("test.student@nottingham.ac.uk");
  const [emailSubject, setEmailSubject] = useState("Enquiry about Stanley House");
  const [emailBody, setEmailBody] = useState("Hello,\n\nI'm interested in booking a room for the upcoming academic year. Could you provide more details about availability and pricing?\n\nThanks!");
  const [emailPropertyRef, setEmailPropertyRef] = useState("");
  const [emailResult, setEmailResult] = useState<TestResponse | null>(null);
  
  // Logs filter state
  const [logsFilter, setLogsFilter] = useState<string>("all");

  // Webhook logs query
  const { data: webhookLogs = [], refetch: refetchLogs } = useQuery<WebhookLog[]>({
    queryKey: ['/api/test/webhook-logs', logsFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (logsFilter !== 'all') {
        params.append('source', logsFilter);
      }
      const res = await fetch(`/api/test/webhook-logs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      return res.json();
    },
  });

  // WhatsApp test mutation
  const whatsappMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/test/whatsapp-webhook', {
        From: whatsappPhone,
        Body: whatsappBody
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setWhatsappResult(data);
      refetchLogs();
      toast({
        title: "WhatsApp Test Successful",
        description: "AI response generated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Email test mutation
  const emailMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/test/email-webhook', {
        from: emailFrom,
        subject: emailSubject,
        body: emailBody,
        propertyRef: emailPropertyRef || undefined,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setEmailResult(data);
      refetchLogs();
      toast({
        title: "Email Test Successful",
        description: "AI response generated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(type);
    setTimeout(() => setCopiedUrl(null), 2000);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return '';
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Webhook Testing Dashboard</h1>
          <p className="text-muted-foreground mt-2" data-testid="text-page-description">
            Test WhatsApp and Email integrations by simulating webhook calls. All tests bypass signature validation.
          </p>
        </div>

        {/* Production URLs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Production Webhook URLs
            </CardTitle>
            <CardDescription>
              Use these URLs when configuring Twilio and your email parser in production
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted p-3 rounded text-sm">
                {getBaseUrl()}/api/webhooks/whatsapp
              </code>
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(`${getBaseUrl()}/api/webhooks/whatsapp`, 'WhatsApp URL')}
                data-testid="button-copy-whatsapp-url"
              >
                {copiedUrl === 'WhatsApp URL' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted p-3 rounded text-sm">
                {getBaseUrl()}/api/webhooks/email
              </code>
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(`${getBaseUrl()}/api/webhooks/email`, 'Email URL')}
                data-testid="button-copy-email-url"
              >
                {copiedUrl === 'Email URL' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Testing Tabs */}
        <Tabs defaultValue="whatsapp" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="whatsapp" data-testid="tab-whatsapp">
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp Test
            </TabsTrigger>
            <TabsTrigger value="email" data-testid="tab-email">
              <Mail className="h-4 w-4 mr-2" />
              Email Test
            </TabsTrigger>
            <TabsTrigger value="logs" data-testid="tab-logs">
              <Database className="h-4 w-4 mr-2" />
              Webhook Logs
            </TabsTrigger>
          </TabsList>

          {/* WhatsApp Test Section */}
          <TabsContent value="whatsapp" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp Webhook Test</CardTitle>
                  <CardDescription>
                    Simulate a WhatsApp message from Twilio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-phone">From (Phone Number)</Label>
                    <Input
                      id="whatsapp-phone"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      placeholder="+447700123456"
                      data-testid="input-whatsapp-phone"
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: +[country code][number]
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-body">Message Body</Label>
                    <Textarea
                      id="whatsapp-body"
                      value={whatsappBody}
                      onChange={(e) => setWhatsappBody(e.target.value)}
                      placeholder="What the tenant is saying..."
                      rows={6}
                      data-testid="textarea-whatsapp-body"
                    />
                  </div>
                  <Button
                    onClick={() => whatsappMutation.mutate()}
                    disabled={whatsappMutation.isPending}
                    className="w-full"
                    data-testid="button-send-whatsapp"
                  >
                    {whatsappMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Test WhatsApp Message
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {whatsappResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Test Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">AI Response</h3>
                      <div className="bg-muted p-3 rounded text-sm" data-testid="text-whatsapp-ai-response">
                        {whatsappResult.aiResponse}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Lead Details</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={whatsappResult.lead.name ? "default" : "secondary"}>
                            {whatsappResult.lead.name ? 'Updated' : 'Created'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stage:</span>
                          <span className="font-medium">{whatsappResult.lead.stage}</span>
                        </div>
                        {whatsappResult.lead.name && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{whatsappResult.lead.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Conversation Thread</h3>
                      <ScrollArea className="h-[200px] border rounded p-2">
                        <div className="space-y-2">
                          {whatsappResult.conversation.messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`p-2 rounded text-sm ${
                                msg.role === 'user'
                                  ? 'bg-muted ml-8'
                                  : msg.role === 'assistant'
                                  ? 'bg-primary/10 mr-8'
                                  : 'bg-secondary/50'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {msg.role}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-foreground">{msg.content}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Email Test Section */}
          <TabsContent value="email" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Email Webhook Test</CardTitle>
                  <CardDescription>
                    Simulate an email from your email parser
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-from">From (Email Address)</Label>
                    <Input
                      id="email-from"
                      type="email"
                      value={emailFrom}
                      onChange={(e) => setEmailFrom(e.target.value)}
                      placeholder="tenant@example.com"
                      data-testid="input-email-from"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-subject">Subject Line</Label>
                    <Input
                      id="email-subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Enquiry about property"
                      data-testid="input-email-subject"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-body">Email Body</Label>
                    <Textarea
                      id="email-body"
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Email content..."
                      rows={6}
                      data-testid="textarea-email-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-ref">Property Reference (Optional)</Label>
                    <Input
                      id="property-ref"
                      value={emailPropertyRef}
                      onChange={(e) => setEmailPropertyRef(e.target.value)}
                      placeholder="PROP123"
                      data-testid="input-property-ref"
                    />
                  </div>
                  <Button
                    onClick={() => emailMutation.mutate()}
                    disabled={emailMutation.isPending}
                    className="w-full"
                    data-testid="button-send-email"
                  >
                    {emailMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {emailResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Test Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">AI Response</h3>
                      <div className="bg-muted p-3 rounded text-sm" data-testid="text-email-ai-response">
                        {emailResult.aiResponse}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Lead Details</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={emailResult.lead.name ? "default" : "secondary"}>
                            {emailResult.lead.name ? 'Updated' : 'Created'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stage:</span>
                          <span className="font-medium">{emailResult.lead.stage}</span>
                        </div>
                        {emailResult.lead.name && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{emailResult.lead.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Conversation Thread</h3>
                      <ScrollArea className="h-[200px] border rounded p-2">
                        <div className="space-y-2">
                          {emailResult.conversation.messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`p-2 rounded text-sm ${
                                msg.role === 'user'
                                  ? 'bg-muted ml-8'
                                  : msg.role === 'assistant'
                                  ? 'bg-primary/10 mr-8'
                                  : 'bg-secondary/50'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {msg.role}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-foreground">{msg.content}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Webhook Logs Section */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Webhook Logs</CardTitle>
                    <CardDescription>
                      Recent webhook calls and their responses
                    </CardDescription>
                  </div>
                  <Select value={logsFilter} onValueChange={setLogsFilter}>
                    <SelectTrigger className="w-[180px]" data-testid="select-logs-filter">
                      <SelectValue placeholder="Filter by source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="twilio">WhatsApp (Production)</SelectItem>
                      <SelectItem value="twilio_test">WhatsApp (Test)</SelectItem>
                      <SelectItem value="email">Email (Production)</SelectItem>
                      <SelectItem value="email_test">Email (Test)</SelectItem>
                      <SelectItem value="justcall">JustCall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {webhookLogs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No webhook logs found</p>
                        <p className="text-sm">Send a test message to see logs here</p>
                      </div>
                    ) : (
                      webhookLogs.map((log) => (
                        <Card key={log.id} className={log.error ? 'border-destructive' : ''}>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Badge variant={log.error ? 'destructive' : log.processed ? 'default' : 'secondary'}>
                                      {log.source}
                                    </Badge>
                                    {log.eventType && (
                                      <Badge variant="outline">{log.eventType}</Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                  </p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    copyToClipboard(JSON.stringify(log.payload, null, 2), 'Payload');
                                  }}
                                  data-testid={`button-copy-payload-${log.id}`}
                                >
                                  {copiedUrl === 'Payload' ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>

                              {log.error && (
                                <div className="bg-destructive/10 p-2 rounded">
                                  <p className="text-sm text-destructive font-medium">Error:</p>
                                  <p className="text-sm text-destructive">{log.error}</p>
                                </div>
                              )}

                              <div>
                                <p className="text-sm font-medium mb-1">Request Payload:</p>
                                <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(log.payload, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
