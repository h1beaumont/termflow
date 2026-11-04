import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Upload, CheckCircle2, Bot, User, FileText, AlertCircle, UserPlus, Info, Clock } from "lucide-react";
import { TermFlowWordmark } from "@/components/TermFlowLogo";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface OnboardingSession {
  id: string;
  landlordId: number;
  currentSection: string;
  completedSections: string[];
  isComplete: boolean;
  messageCount: number;
  tasksDelegated: boolean;
}

interface SectionInfo {
  key: string;
  name: string;
  order: number;
}

interface OnboardingResponse {
  question: string;
  answer: string;
  createdAt: string;
}

interface OnboardingAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

interface Delegation {
  id: number;
  sessionId: string;
  delegatedToEmail: string;
  delegatedToName: string;
  createdAt: string;
  expiresAt: string;
  status: string;
}

interface DelegatedSessionData {
  delegation: Delegation;
  session: OnboardingSession;
  responses: OnboardingResponse[];
  sections: SectionInfo[];
  attachments?: OnboardingAttachment[];
}

export default function StaffAccess() {
  const [match, params] = useRoute("/staff-access/:token");
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  const token = params?.token || "";

  // Fetch delegated session data
  const { data: delegatedData, isLoading: sessionLoading, error } = useQuery<DelegatedSessionData>({
    queryKey: ["/api/onboarding/delegated-session", token],
    queryFn: async () => {
      const response = await fetch(`/api/onboarding/delegated-session/${token}`);
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Invalid or expired access link' : 'Failed to load session');
      }
      return response.json();
    },
    enabled: !!token,
    retry: false,
  });

  const [hasHydrated, setHasHydrated] = useState(false);
  
  // Hydrate messages from responses
  useEffect(() => {
    if (delegatedData?.responses && !hasHydrated) {
      const chatMessages: Message[] = [];
      delegatedData.responses.forEach((r: any) => {
        chatMessages.push({
          role: "assistant",
          content: r.question,
          timestamp: new Date(r.createdAt),
        });
        chatMessages.push({
          role: "user",
          content: r.answer,
          timestamp: new Date(r.createdAt),
        });
      });

      if (chatMessages.length === 0) {
        chatMessages.push({
          role: "assistant",
          content: "Welcome! Let's continue from where we left off. I'll guide you through the remaining setup sections.",
          timestamp: new Date(),
        });
      } else {
        // Add a message to indicate continuation
        chatMessages.push({
          role: "assistant",
          content: "Welcome! I can see the progress so far. Let's continue from where we left off.",
          timestamp: new Date(),
        });
      }

      setMessages(chatMessages);
      setHasHydrated(true);
    }
  }, [delegatedData, hasHydrated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", `/api/onboarding/delegated-chat/${token}`, { message });
      return response.json();
    },
    onSuccess: (data: any) => {
      const assistantMessage = {
        role: "assistant" as const,
        content: data.message || '',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/delegated-session", token] });

      if (data.isComplete) {
        toast({
          title: "Setup Complete!",
          description: "All sections have been completed. The onboarding process is finished.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const userMessage = {
      role: "user" as const,
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");

    chatMutation.mutate(messageToSend);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingFile(true);

    try {
      const response = await fetch(`/api/onboarding/upload-delegated/${token}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      const userMessage = {
        role: "user" as const,
        content: `[Uploaded file: ${file.name}]`,
        timestamp: new Date(),
      };

      const assistantMessage = {
        role: "assistant" as const,
        content: data.message || "File uploaded successfully!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/delegated-session", token] });

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Could not upload file",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <TermFlowWordmark className="h-8" />
            </div>
            <CardTitle className="text-center">Access Link Invalid</CardTitle>
            <CardDescription className="text-center">
              This access link is either invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {(error as any)?.message || 'The access link you followed is not valid. Please contact the person who sent you the link for a new one.'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (sessionLoading || !delegatedData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading onboarding session...</p>
        </div>
      </div>
    );
  }

  const session = delegatedData.session;
  const delegation = delegatedData.delegation;
  const sections = delegatedData.sections || [];
  const completedCount = session.completedSections.length;
  const totalCount = sections.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Calculate time until expiry
  const expiresAt = new Date(delegation.expiresAt);
  const now = new Date();
  const hoursUntilExpiry = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)));

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <TermFlowWordmark className="h-8" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Access expires in {hoursUntilExpiry}h</span>
          </div>
        </div>

        {/* Delegation Info Card */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Delegated Onboarding Session</p>
              <p className="text-sm">
                You've been asked to help complete the onboarding process.
                {completedCount > 0 && (
                  <span className="ml-1">
                    {completedCount} of {totalCount} sections already completed.
                  </span>
                )}
              </p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Progress Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Setup Progress</CardTitle>
              <span className="text-sm font-medium text-muted-foreground">
                {completedCount} / {totalCount} sections
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">AI Setup Assistant</CardTitle>
            </div>
            <CardDescription>
              Continue the conversation to complete remaining sections
            </CardDescription>
          </CardHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  data-testid={`message-${msg.role}-${idx}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {msg.role === "user" && (
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {chatMutation.isPending && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile || chatMutation.isPending}
                data-testid="button-upload"
              >
                {uploadingFile ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>

              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                disabled={chatMutation.isPending}
                data-testid="input-message"
                className="flex-1"
              />

              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || chatMutation.isPending}
                data-testid="button-send"
              >
                {chatMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
