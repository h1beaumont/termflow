import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Upload, CheckCircle2, Bot, User, FileText, AlertCircle, Mic, MicOff, Volume2, MessageSquare, UserPlus, Info } from "lucide-react";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { ContractSectionMapper } from "@/components/ContractSectionMapper";
import { FloorPlanMapper } from "@/components/FloorPlanMapper";
import { TaskDelegation } from "@/components/TaskDelegation";
import { OnboardingSummary } from "@/components/OnboardingSummary";
import { OnboardingPaymentForm } from "@/components/OnboardingPaymentForm";
import { useVoiceConversation } from "@/hooks/use-voice-conversation";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface OnboardingSession {
  id: string;
  currentSection: string;
  completedSections: string[];
  isComplete: boolean;
  messageCount: number;
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

interface SessionData {
  session: OnboardingSession;
  responses: OnboardingResponse[];
  sections: SectionInfo[];
  attachments: OnboardingAttachment[];
}

interface ProgressData {
  progress: number;
}

export default function OnboardingNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showContractMapper, setShowContractMapper] = useState(false);
  const [showFloorPlanMapper, setShowFloorPlanMapper] = useState(false);
  const [showTaskDelegation, setShowTaskDelegation] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [contractAttachmentId, setContractAttachmentId] = useState<number | null>(null);
  const [floorPlanAttachmentId, setFloorPlanAttachmentId] = useState<number | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>("");

  const voice = useVoiceConversation({
    onTranscript: (text) => {
      setInputMessage(text);
      setTimeout(() => handleSendMessage(), 100);
    },
    onError: (error) => {
      toast({
        title: "Voice Error",
        description: `Could not process voice: ${error}`,
        variant: "destructive",
      });
    },
    autoPlayResponses: voiceEnabled,
  });

  const { data: sessionData, isLoading: sessionLoading } = useQuery<SessionData>({
    queryKey: ["/api/onboarding/session-new"],
  });

  const { data: progressData } = useQuery<ProgressData>({
    queryKey: ["/api/onboarding/progress-new"],
    refetchInterval: 5000,
  });

  const [hasHydrated, setHasHydrated] = useState(false);
  
  useEffect(() => {
    if (sessionData?.responses && !hasHydrated) {
      const chatMessages: Message[] = [];
      sessionData.responses.forEach((r: any, index: number) => {
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
          content: "Welcome to TermFlow! I'm here to help you get your properties set up.\n\n✨ Two ways to complete your setup:\n• Chat with me to complete sections conversationally\n• Or forward any section to your team for instant completion\n\nLet's start with some basic information about your company. What's your company or brand name?",
          timestamp: new Date(),
        });
      }

      setMessages(chatMessages);
      setHasHydrated(true);
    }
  }, [sessionData, hasHydrated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/onboarding/chat-new", { message });
      return response.json();
    },
    onSuccess: (data: any) => {
      const assistantMessage = {
        role: "assistant" as const,
        content: data.message || '',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      
      // Speak the assistant's response if voice is enabled
      if (voiceEnabled && data.message) {
        voice.speak(data.message);
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/session-new"] });
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/progress-new"] });

      // Check if approaching completion (90%+ progress)
      if (progressData && progressData.progress >= 90 && !showSummary) {
        setShowTaskDelegation(true);
      }

      if (data.isComplete) {
        // Don't redirect immediately, show summary first
        setShowSummary(true);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", file.type.includes("pdf") ? "contract" : "document");
      formData.append("section", sessionData?.session?.currentSection || "contracts");

      const response = await fetch("/api/onboarding/upload-new", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "File Uploaded",
        description: data.message,
      });

      // Detect contract upload
      if (data.attachment.fileType === 'contract' || 
          sessionData?.session?.currentSection === 'contracts') {
        setContractAttachmentId(data.attachment.id);
        setShowContractMapper(true);
      }

      // Detect floor plan upload
      if (data.attachment.fileType === 'floor_plan' || 
          data.attachment.fileName.toLowerCase().includes('floor') ||
          data.attachment.fileName.toLowerCase().includes('plan')) {
        setFloorPlanAttachmentId(data.attachment.id);
        setShowFloorPlanMapper(true);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: `📎 Uploaded: ${data.attachment.fileName}`,
          timestamp: new Date(),
        },
        {
          role: "assistant",
          content: "Perfect! I've received your file. Let me process that and we'll continue.",
          timestamp: new Date(),
        },
      ]);

      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/session-new"] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const userMessage = inputMessage.trim();
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    setLastUserMessage(userMessage); // Track for loading context
    setInputMessage("");
    chatMutation.mutate(userMessage);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    uploadMutation.mutate(file, {
      onSettled: () => setUploadingFile(false),
    });
  };

  const sections: SectionInfo[] = sessionData?.sections || [];
  const currentSectionIndex = sections.findIndex(
    (s: SectionInfo) => s.key === sessionData?.session?.currentSection
  );
  const progressPercentage = progressData?.progress || 0;

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card p-4">
        <div className="container mx-auto flex items-center justify-between">
          <TermFlowWordmark className="h-8" />
          <div className="text-sm text-muted-foreground" data-testid="progress-text">
            Section {currentSectionIndex + 1} of {sections.length}
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 flex flex-col py-6 gap-6 max-w-6xl">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Onboarding Progress</CardTitle>
              <span className="text-sm font-medium" data-testid="progress-percentage">
                {progressPercentage}%
              </span>
            </div>
            <Progress value={progressPercentage} className="mt-2" data-testid="progress-bar" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sections.map((section: SectionInfo) => {
                const isCompleted = sessionData?.session?.completedSections?.includes(section.key);
                const isCurrent = section.key === sessionData?.session?.currentSection;

                return (
                  <div
                    key={section.key}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                      isCompleted
                        ? "bg-primary/10 text-primary"
                        : isCurrent
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2" data-testid={`section-${section.key}`}>
                      {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                      {section.name}
                    </div>
                    {!isCompleted && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowTaskDelegation(true)}
                        data-testid={`button-forward-${section.key}`}
                        title="Forward to Staff"
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Alert className="border-primary/20 bg-primary/5" data-testid="alert-completion-options">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="ml-2">
            <div className="space-y-2">
              <p className="font-medium text-sm">Two ways to complete your setup:</p>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <div className="flex items-start gap-2 p-2 rounded-md bg-background/50">
                  <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Chat with AI</p>
                    <p className="text-xs text-muted-foreground">Have a conversation below to complete each section</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-md bg-background/50">
                  <UserPlus className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Forward to Staff</p>
                    <p className="text-xs text-muted-foreground">Delegate sections to team members for instant completion</p>
                  </div>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Chat with Our Onboarding Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 p-0">
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                      data-testid={`message-${message.role}-${index}`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                ))}
                {chatMutation.isPending && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      {lastUserMessage.match(/https?:\/\/|www\.|\.com|\.co\.uk|\.org/i) ? (
                        <div className="flex items-center gap-2" data-testid="scraping-indicator">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Analyzing your website (30-60 seconds)...</span>
                        </div>
                      ) : (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-4 bg-card space-y-3">
              {sessionData?.session?.currentSection === "contracts" && (
                <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-md">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  <p className="text-sm">
                    Please upload your contract template for this section
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {voice.isSupported && (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Voice Conversation</span>
                      {voice.isSpeaking && (
                        <span className="text-xs text-primary flex items-center gap-1">
                          <span className="animate-pulse">●</span> Speaking
                        </span>
                      )}
                    </div>
                    <Button
                      variant={voiceEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setVoiceEnabled(!voiceEnabled);
                        if (!voiceEnabled) {
                          toast({
                            title: "Voice Enabled",
                            description: "The assistant will now speak responses aloud",
                          });
                        }
                      }}
                      data-testid="button-voice-toggle"
                    >
                      {voiceEnabled ? "Voice On" : "Voice Off"}
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={voice.isListening ? "Listening..." : "Type your message..."}
                    disabled={chatMutation.isPending || sessionData?.session?.isComplete || voice.isListening}
                    className="flex-1"
                    data-testid="input-message"
                  />

                  {voice.isSupported && voiceEnabled && (
                    <Button
                      onClick={() => {
                        if (voice.isListening) {
                          voice.stopListening();
                        } else {
                          voice.startListening();
                        }
                      }}
                      variant={voice.isListening ? "default" : "outline"}
                      size="icon"
                      disabled={chatMutation.isPending || sessionData?.session?.isComplete || voice.isSpeaking}
                      data-testid="button-microphone"
                      className={voice.isListening ? "animate-pulse" : ""}
                    >
                      {voice.isListening ? (
                        <Mic className="w-4 h-4" />
                      ) : (
                        <MicOff className="w-4 h-4" />
                      )}
                    </Button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    data-testid="input-file"
                  />

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="icon"
                    disabled={uploadingFile || sessionData?.session?.isComplete}
                    data-testid="button-upload"
                  >
                    {uploadingFile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || chatMutation.isPending || sessionData?.session?.isComplete}
                    data-testid="button-send"
                  >
                    {chatMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {sessionData?.attachments && sessionData.attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Files:</p>
                  <div className="flex flex-wrap gap-2">
                    {sessionData.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md text-sm"
                        data-testid={`attachment-${att.id}`}
                      >
                        <FileText className="w-3 h-3" />
                        {att.fileName}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contract Section Mapper */}
        {showContractMapper && contractAttachmentId && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Map Contract Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <ContractSectionMapper
                contractFileUrl={sessionData?.attachments?.find((a: any) => a.id === contractAttachmentId)?.fileUrl}
                contractFileName={sessionData?.attachments?.find((a: any) => a.id === contractAttachmentId)?.fileName}
                existingSections={[]}
                onUpload={async (file: File) => {
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("fileType", "contract");
                  await fetch("/api/onboarding/upload-new", {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                  });
                  queryClient.invalidateQueries({ queryKey: ["/api/onboarding/session-new"] });
                }}
                onSave={async (sections: any[]) => {
                  await apiRequest("POST", "/api/onboarding/save-contract-sections", {
                    sessionId: sessionData?.session?.id,
                    contractAttachmentId,
                    sections,
                  });
                  setShowContractMapper(false);
                  toast({
                    title: "Contract Sections Mapped",
                    description: "Your contract template has been configured successfully.",
                  });
                }}
                onSkip={() => setShowContractMapper(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Floor Plan Mapper */}
        {showFloorPlanMapper && floorPlanAttachmentId && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Map Floor Plan Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <FloorPlanMapper
                floorPlanUrl={sessionData?.attachments?.find((a: any) => a.id === floorPlanAttachmentId)?.fileUrl}
                floorPlanFileName={sessionData?.attachments?.find((a: any) => a.id === floorPlanAttachmentId)?.fileName}
                rooms={[]}
                existingZones={[]}
                onUpload={async (file: File) => {
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("fileType", "floor_plan");
                  await fetch("/api/onboarding/upload-new", {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                  });
                  queryClient.invalidateQueries({ queryKey: ["/api/onboarding/session-new"] });
                }}
                onSave={async (zones: any[]) => {
                  await apiRequest("POST", "/api/onboarding/save-floor-plan-zones", {
                    sessionId: sessionData?.session?.id,
                    floorPlanAttachmentId,
                    zones,
                  });
                  setShowFloorPlanMapper(false);
                  toast({
                    title: "Floor Plan Mapped",
                    description: "Your floor plan zones have been configured successfully.",
                  });
                }}
                onSkip={() => setShowFloorPlanMapper(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Task Delegation Dialog */}
        {showTaskDelegation && !showSummary && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Forward to Staff Member</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Delegate the remaining onboarding sections to a team member. They'll receive an email with a secure link to continue from where you left off.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delegate-email">Staff Member Email</Label>
                <Input
                  id="delegate-email"
                  type="email"
                  placeholder="team.member@example.com"
                  data-testid="input-delegate-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delegate-name">Staff Member Name (Optional)</Label>
                <Input
                  id="delegate-name"
                  type="text"
                  placeholder="John Smith"
                  data-testid="input-delegate-name"
                />
              </div>
              <Alert className="border-primary/20 bg-primary/5">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="ml-2">
                  <p className="text-sm font-medium">Current Progress:</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentSectionIndex + 1} of {sections.length} sections completed. Your staff member will continue from section {currentSectionIndex + 2}.
                  </p>
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowTaskDelegation(false)}
                  data-testid="button-cancel-delegation"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    const emailInput = document.getElementById('delegate-email') as HTMLInputElement;
                    const nameInput = document.getElementById('delegate-name') as HTMLInputElement;
                    
                    if (!emailInput.value) {
                      toast({
                        title: "Email Required",
                        description: "Please enter a valid email address",
                        variant: "destructive",
                      });
                      return;
                    }

                    try {
                      await apiRequest("POST", "/api/onboarding/delegate-session", {
                        sessionId: sessionData?.session?.id,
                        delegatedToEmail: emailInput.value,
                        delegatedToName: nameInput.value || undefined,
                      });
                      
                      toast({
                        title: "Onboarding Delegated",
                        description: `An email has been sent to ${emailInput.value} with instructions to continue.`,
                      });
                      
                      setShowTaskDelegation(false);
                    } catch (error) {
                      toast({
                        title: "Delegation Failed",
                        description: "Failed to delegate onboarding. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                  data-testid="button-confirm-delegation"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Forward to Staff
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary (before payment) */}
        {showSummary && !showPayment && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Onboarding Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <OnboardingSummary
                completedSections={[]}
                delegatedTasks={[]}
                paymentStatus="pending"
              />
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setShowSummary(false);
                    setShowPayment(true);
                  }}
                  className="w-full"
                  data-testid="button-continue-to-payment"
                >
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Form (final step) */}
        {showPayment && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Complete Your Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <OnboardingPaymentForm
                planName="Starter"
                monthlyAmount={99}
                features={["Unlimited properties", "AI-powered chat", "Contract management"]}
                sessionId={sessionData?.session?.id || ""}
                onSuccess={() => {
                  toast({
                    title: "Payment Successful! 🎉",
                    description: "Your onboarding is complete. Redirecting to dashboard...",
                  });
                  setTimeout(() => {
                    setLocation("/dashboard");
                  }, 2000);
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
