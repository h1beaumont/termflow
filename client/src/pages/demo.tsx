import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Check, CheckCheck, Sparkles, MessageSquare, Calendar, Home, FileCheck, Mail, Smartphone, MonitorSmartphone, RotateCcw, Play, Pause } from "lucide-react";
import { format } from "date-fns";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SEOHead } from "@/components/SEOHead";
import avaAvatar from "@assets/stock_images/friendly_young_woman_6ba1b3c2.jpg";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  delivered?: boolean;
}

type Channel = "whatsapp" | "email" | "webchat" | "sms";

const EXAMPLE_CONVERSATION = [
  { role: "user" as const, content: "Hi, looking for accommodation for September 2026" },
  { role: "assistant" as const, content: "Hi! Great to hear you're planning ahead for September 2026. I'd be happy to help you find the perfect student accommodation.\n\nWhat university will you be attending, and do you have a budget in mind?" },
  { role: "user" as const, content: "I'm starting at Nottingham Trent, budget £150/week" },
  { role: "assistant" as const, content: "Perfect! For Nottingham Trent University with a £150/week budget, I have several great options:\n\n▸ Stanley House - £145/week\n- 5 min walk to campus\n- Ensuite rooms available\n- All bills included\n\n▸ Victoria Hall - £140/week\n- Near city center\n- Shared kitchen\n- Study room on-site\n\nWould you like to book a viewing for either property?" },
  { role: "user" as const, content: "Can I book a viewing for Stanley House?" },
  { role: "assistant" as const, content: "Absolutely! I can arrange a viewing for Stanley House.\n\nWhen would work best for you?\n• This Saturday at 2pm\n• Next Tuesday at 11am\n• Next Friday at 3pm\n\nOr suggest your own time!" },
  { role: "user" as const, content: "Saturday at 2pm works for me" },
  { role: "assistant" as const, content: "Great! I've booked your viewing for Stanley House this Saturday at 2pm.\n\nYou'll receive a confirmation email shortly with:\n• Address and directions\n• What to bring\n• Our contact details\n\nIs there anything else you'd like to know about the property or the application process?" },
  { role: "user" as const, content: "What documents do I need to apply?" },
  { role: "assistant" as const, content: "Good question! For your application, you'll need:\n\n• Photo ID (passport or driver's license)\n• Proof of university enrollment\n• UK guarantor details (parent/guardian)\n• Bank statements (last 3 months)\n\nInternational students can use:\n• Sponsor letter, or\n• Pay rent upfront option\n\nThe whole process takes about 48 hours once we have everything. Would you like me to send you the application link now?" },
];

const QUICK_QUESTIONS = {
  availability: [
    "What rooms are available for September 2026?",
    "Do you have any studios available?",
  ],
  viewing: [
    "Can I book a viewing for Stanley House?",
    "When is the next available viewing slot?",
  ],
  pricing: [
    "How much is the deposit?",
    "Are bills included in the rent?",
  ],
  moveIn: [
    "What documents do I need to apply?",
    "How long does the application process take?",
  ],
};

export default function Demo() {
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! I'm Ava, your AI assistant for student accommodation. How can I help you today?",
      timestamp: new Date(),
      delivered: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>(() => {
    const stored = localStorage.getItem("demo-session-id");
    return stored || "";
  });
  const [isPlayingExample, setIsPlayingExample] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-play example conversation
  useEffect(() => {
    if (!isPlayingExample || exampleIndex >= EXAMPLE_CONVERSATION.length) {
      if (exampleIndex >= EXAMPLE_CONVERSATION.length) {
        setIsPlayingExample(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      const example = EXAMPLE_CONVERSATION[exampleIndex];
      const newMessage: ChatMessage = {
        id: `example-${exampleIndex}`,
        role: example.role,
        content: example.content,
        timestamp: new Date(),
        delivered: true,
      };
      
      setMessages(prev => [...prev, newMessage]);
      setExampleIndex(prev => prev + 1);
    }, exampleIndex === 0 ? 500 : 2000); // First message faster, then 2s delay

    return () => clearTimeout(timer);
  }, [isPlayingExample, exampleIndex]);

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/demo/chat", {
        message,
        sessionId: sessionId || undefined,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("demo-session-id", data.sessionId);
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          delivered: true,
        },
      ]);
    },
    onError: (error: any) => {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again!",
          timestamp: new Date(),
          delivered: true,
        },
      ]);
    },
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      delivered: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Mark as delivered after a short delay
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, delivered: true } : msg
      ));
    }, 300);

    chatMutation.mutate(input);
    setInput("");
    inputRef.current?.focus();
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const handleReset = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Hey! I'm Ava, your AI assistant for student accommodation. How can I help you today?",
      timestamp: new Date(),
      delivered: true,
    }]);
    setSessionId("");
    localStorage.removeItem("demo-session-id");
    setIsPlayingExample(false);
    setExampleIndex(0);
  };

  const handlePlayExample = () => {
    handleReset();
    setIsPlayingExample(true);
    setExampleIndex(0);
  };

  const handlePauseExample = () => {
    setIsPlayingExample(false);
  };

  const renderChannelIcon = (ch: Channel) => {
    switch (ch) {
      case "whatsapp": return <MessageSquare className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "webchat": return <MonitorSmartphone className="w-4 h-4" />;
      case "sms": return <Smartphone className="w-4 h-4" />;
    }
  };

  const renderMessages = () => {
    const props = {
      messages,
      chatMutation,
      input,
      setInput,
      handleSend,
      inputRef,
      messagesEndRef,
    };

    switch (channel) {
      case "whatsapp":
        return <WhatsAppMessages {...props} />;
      case "email":
        return <EmailMessages {...props} />;
      case "webchat":
        return <WebChatMessages {...props} />;
      case "sms":
        return <SMSMessages {...props} />;
    }
  };

  const allQuestions = [
    ...QUICK_QUESTIONS.availability,
    ...QUICK_QUESTIONS.viewing,
    ...QUICK_QUESTIONS.pricing,
    ...QUICK_QUESTIONS.moveIn,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-tf-navy/5 via-background to-tf-lime/5">
      <SEOHead
        title="Interactive PBSA Demo | Student Lettings Automation | TermFlow"
        description="Try TermFlow's interactive demo for student accommodation. Experience AI enquiry handling, automated viewings, and digital contracts. No login required."
        keywords="interactive PBSA demo, student lettings automation demo, AI student accommodation, automated viewings demo, digital contracts demo, student lettings AI chatbot"
        canonical="https://termflow.co.uk/demo"
        ogTitle="Interactive PBSA Demo | Student Lettings Automation | TermFlow"
        ogDescription="Try TermFlow's interactive demo for student accommodation. Experience AI enquiry handling, automated viewings, and digital contracts. No login required."
        ogType="website"
        ogUrl="https://termflow.co.uk/demo"
        twitterCard="summary_large_image"
        twitterTitle="Interactive PBSA Demo | Student Lettings Automation | TermFlow"
        twitterDescription="Try TermFlow's interactive demo. Experience AI enquiry handling, automated viewings, and digital contracts."
      />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-lime" />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <TermFlowWordmark />
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="/" className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap" data-testid="link-home">
              Home
            </a>
            <Button variant="default" size="sm" asChild data-testid="button-get-started" className="text-xs sm:text-sm px-2 sm:px-3">
              <a href="/" className="whitespace-nowrap">
                Get Started
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-[40%_60%] gap-6 lg:gap-8">
          
          {/* Left Panel - Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-tf-lime/10 border border-tf-lime/20 mb-3 sm:mb-4">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-tf-lime" />
                <span className="text-xs sm:text-sm font-semibold text-tf-lime">LIVE DEMO</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4 text-tf-navy" data-testid="text-demo-title">
                Experience AI-Powered Student Lettings Automation
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6" data-testid="text-demo-subtitle">
                See how Ava handles enquiries via WhatsApp, Email, Web Chat, and SMS
              </p>
            </div>

            {/* Key Benefits */}
            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-tf-lime" />
                Key Benefits
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { icon: MessageSquare, text: "Responds instantly 24/7" },
                  { icon: Calendar, text: "Books viewings automatically" },
                  { icon: Home, text: "Answers property questions" },
                  { icon: FileCheck, text: "Progresses leads to application" },
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-3" data-testid={`benefit-${i}`}>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-tf-lime/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tf-lime" />
                    </div>
                    <span className="text-xs sm:text-sm text-foreground">{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Example Conversation */}
            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-tf-navy" />
                Try Example Journey
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Watch a complete student journey from initial enquiry to application
              </p>
              <Button
                onClick={isPlayingExample ? handlePauseExample : handlePlayExample}
                className="w-full min-h-11 sm:min-h-10"
                variant={isPlayingExample ? "outline" : "default"}
                data-testid="button-play-example"
              >
                {isPlayingExample ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Example
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Play Example Conversation
                  </>
                )}
              </Button>
            </Card>

            {/* Example Questions */}
            <div className="hidden sm:block">
              <h3 className="font-semibold text-sm text-muted-foreground mb-3" data-testid="text-example-questions-title">
                Or try asking Ava:
              </h3>
              <div className="space-y-2">
                {allQuestions.slice(0, 6).map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-card border border-border hover-elevate active-elevate-2 transition-all text-xs sm:text-sm min-h-11 sm:min-h-0"
                    data-testid={`quick-question-${i}`}
                  >
                    <span className="text-tf-navy font-medium">"{question}"</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Quick Questions - Horizontal Scroll */}
            <div className="sm:hidden">
              <h3 className="font-semibold text-sm text-muted-foreground mb-3" data-testid="text-example-questions-title-mobile">
                Quick questions:
              </h3>
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-2 pb-2">
                  {allQuestions.slice(0, 6).map((question, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickQuestion(question)}
                      className="inline-flex items-center px-4 py-2.5 rounded-lg bg-card border border-border hover-elevate active-elevate-2 transition-all text-xs font-medium text-tf-navy min-h-11 whitespace-nowrap"
                      data-testid={`quick-question-mobile-${i}`}
                    >
                      "{question}"
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* CTA */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-tf-navy to-tf-navy-700 text-white border-0">
              <h3 className="font-bold text-lg sm:text-xl mb-2">Ready to automate your lettings?</h3>
              <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">
                Get started with TermFlow today and let AI handle your student enquiries.
              </p>
              <Button variant="secondary" size="lg" asChild className="w-full min-h-11" data-testid="button-cta-get-started">
                <a href="/">Get Started with TermFlow</a>
              </Button>
            </Card>
          </div>

          {/* Right Panel - Multi-Channel Chat */}
          <div className="lg:sticky lg:top-24 h-[600px] lg:h-[calc(100vh-8rem)]">
            <Tabs value={channel} onValueChange={(v) => setChannel(v as Channel)} className="h-full flex flex-col">
              {/* Channel Selector */}
              <div className="mb-4 flex-shrink-0">
                <TabsList className="grid w-full grid-cols-4 h-auto gap-1 sm:gap-0 p-1" data-testid="channel-selector">
                  <TabsTrigger value="whatsapp" className="flex flex-col sm:flex-row items-center gap-1 py-2.5 sm:py-2 min-h-11 sm:min-h-0" data-testid="tab-whatsapp">
                    {renderChannelIcon("whatsapp")}
                    <span className="text-xs sm:text-sm">WhatsApp</span>
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex flex-col sm:flex-row items-center gap-1 py-2.5 sm:py-2 min-h-11 sm:min-h-0" data-testid="tab-email">
                    {renderChannelIcon("email")}
                    <span className="text-xs sm:text-sm">Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="webchat" className="flex flex-col sm:flex-row items-center gap-1 py-2.5 sm:py-2 min-h-11 sm:min-h-0" data-testid="tab-webchat">
                    {renderChannelIcon("webchat")}
                    <span className="text-xs sm:text-sm">Web Chat</span>
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="flex flex-col sm:flex-row items-center gap-1 py-2.5 sm:py-2 min-h-11 sm:min-h-0" data-testid="tab-sms">
                    {renderChannelIcon("sms")}
                    <span className="text-xs sm:text-sm">SMS</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Channel Views */}
              {["whatsapp", "email", "webchat", "sms"].map((ch) => (
                <TabsContent key={ch} value={ch} className="flex-1 min-h-0">
                  <Card className="h-full flex flex-col overflow-hidden border-2" data-testid={`channel-${ch}`}>
                    {renderMessages()}
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Stats & Reset */}
            <div className="flex items-center justify-between mt-3 sm:mt-4 px-1">
              <Badge variant="secondary" className="text-xs" data-testid="message-count">
                {messages.length} messages
              </Badge>
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                className="text-xs min-h-11 sm:min-h-8"
                data-testid="button-reset"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// WhatsApp Messages Component
interface ChannelMessagesProps {
  messages: ChatMessage[];
  chatMutation: any;
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

function WhatsAppMessages({ messages, chatMutation, input, setInput, handleSend, inputRef, messagesEndRef }: ChannelMessagesProps) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <>
      {/* WhatsApp Header */}
      <div className="bg-[#25D366] text-white px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3" data-testid="whatsapp-header">
        <Avatar className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 border-2 border-white/30">
          <AvatarImage src={avaAvatar} alt="Ava" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base truncate">Ava - TermFlow</h3>
          <p className="text-xs text-white/80 truncate">Usually replies instantly</p>
        </div>
      </div>

      {/* Messages Container */}
      <ScrollArea className="flex-1 p-3 sm:p-4 bg-[#E5DDD5]" data-testid="whatsapp-messages">
        <div className="space-y-2 sm:space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start items-end gap-2"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              data-testid={`message-${message.role}-${message.id}`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 border-2 border-white">
                  <AvatarImage src={avaAvatar} alt="Ava" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-lg px-3 sm:px-4 py-2 ${
                  message.role === "user"
                    ? "bg-[#DCF8C6] text-gray-900 rounded-br-none"
                    : "bg-white text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-gray-500">
                    {format(message.timestamp, "HH:mm")}
                  </span>
                  {message.role === "user" && (
                    message.delivered ? (
                      <CheckCheck className="w-3 h-3 text-blue-500" data-testid="check-delivered" />
                    ) : (
                      <Check className="w-3 h-3 text-gray-400" data-testid="check-sent" />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex justify-start items-end gap-2 animate-in fade-in slide-in-from-bottom-2" data-testid="typing-indicator">
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 border-2 border-white">
                <AvatarImage src={avaAvatar} alt="Ava" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className="bg-white rounded-lg rounded-bl-none px-3 sm:px-4 py-2.5 sm:py-3 max-w-[70%]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-[#F0F0F0] border-t" data-testid="whatsapp-input-area">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white border-gray-300 min-h-11"
            disabled={chatMutation.isPending}
            data-testid="input-message"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || chatMutation.isPending}
            size="icon"
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white flex-shrink-0 min-h-11 w-11"
            data-testid="button-send"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

// Email Messages Component
interface EmailMessagesProps {
  messages: ChatMessage[];
  chatMutation: any;
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

function EmailMessages({ messages, chatMutation, input, setInput, handleSend, messagesEndRef }: EmailMessagesProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <>
      {/* Email Header */}
      <div className="bg-card border-b px-3 sm:px-4 py-2.5 sm:py-3" data-testid="email-header">
        <h3 className="font-semibold text-sm sm:text-base">Accommodation Enquiry</h3>
        <p className="text-xs text-muted-foreground mt-0.5">You ↔ Ava (ava@termflow.com)</p>
      </div>

      {/* Email Thread */}
      <ScrollArea className="flex-1 p-3 sm:p-4 bg-background" data-testid="email-messages">
        <div className="space-y-3 sm:space-y-4 max-w-3xl">
          {messages.map((message, index) => (
            <Card key={message.id} className="p-3 sm:p-4 animate-in fade-in slide-in-from-bottom-2 duration-300" data-testid={`email-${message.role}-${message.id}`}>
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                  {message.role === "assistant" ? (
                    <>
                      <AvatarImage src={avaAvatar} alt="Ava" />
                      <AvatarFallback>A</AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback>You</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-semibold text-xs sm:text-sm">
                      {message.role === "assistant" ? "Ava" : "You"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.role === "assistant" ? "<ava@termflow.com>" : "<you@email.com>"}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    {format(message.timestamp, "EEE, d MMM yyyy 'at' HH:mm")}
                  </p>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed pl-0 sm:pl-13">
                {message.content}
              </div>
            </Card>
          ))}

          {chatMutation.isPending && (
            <Card className="p-3 sm:p-4 animate-in fade-in" data-testid="email-typing-indicator">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span>Ava is typing...</span>
              </div>
            </Card>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Reply Area */}
      <div className="p-3 sm:p-4 border-t bg-card" data-testid="email-input-area">
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your reply..."
            className="w-full min-h-[80px] sm:min-h-[100px] px-3 py-2 text-xs sm:text-sm border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={chatMutation.isPending}
            data-testid="input-email"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              size="sm"
              className="min-h-11 sm:min-h-8"
              data-testid="button-send-email"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Send Reply
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Web Chat Messages Component
function WebChatMessages({ messages, chatMutation, input, setInput, handleSend, inputRef, messagesEndRef }: ChannelMessagesProps) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <>
      {/* Web Chat Header */}
      <div className="bg-gradient-to-r from-tf-navy to-tf-navy-700 text-white px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-3" data-testid="webchat-header">
        <Avatar className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 border-2 border-white/20">
          <AvatarImage src={avaAvatar} alt="Ava" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base truncate">TermFlow Support</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xs text-white/90 truncate">Ava is online</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <ScrollArea className="flex-1 p-3 sm:p-4 bg-gradient-to-b from-background to-muted/20" data-testid="webchat-messages">
        <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start items-start gap-2"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              data-testid={`webchat-${message.role}-${message.id}`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                  <AvatarImage src={avaAvatar} alt="Ava" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              )}
              
              <div className="flex flex-col gap-1">
                {message.role === "assistant" && (
                  <span className="text-[10px] sm:text-xs text-muted-foreground ml-1">Ava</span>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-md rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 ${
                    message.role === "user"
                      ? "bg-tf-navy text-white rounded-br-sm"
                      : "bg-card border rounded-tl-sm"
                  }`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                </div>
                <span className="text-[10px] text-muted-foreground ml-1">
                  {format(message.timestamp, "HH:mm")}
                </span>
              </div>
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex justify-start items-start gap-2 animate-in fade-in" data-testid="webchat-typing-indicator">
              <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                <AvatarImage src={avaAvatar} alt="Ava" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] sm:text-xs text-muted-foreground ml-1">Ava</span>
                <div className="bg-card border rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2.5 sm:py-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t bg-card" data-testid="webchat-input-area">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 rounded-full min-h-11"
            disabled={chatMutation.isPending}
            data-testid="input-webchat"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || chatMutation.isPending}
            size="icon"
            className="rounded-full flex-shrink-0 min-h-11 w-11"
            data-testid="button-send-webchat"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

// SMS Messages Component
function SMSMessages({ messages, chatMutation, input, setInput, handleSend, inputRef, messagesEndRef }: ChannelMessagesProps) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <>
      {/* SMS Header */}
      <div className="bg-background border-b px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3" data-testid="sms-header">
        <Avatar className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0">
          <AvatarImage src={avaAvatar} alt="Ava" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base truncate">Ava - TermFlow</h3>
          <p className="text-xs text-muted-foreground truncate">+44 7700 900000</p>
        </div>
      </div>

      {/* Messages Container */}
      <ScrollArea className="flex-1 p-3 sm:p-4 bg-background" data-testid="sms-messages">
        <div className="space-y-1.5 sm:space-y-2 max-w-xl mx-auto">
          {messages.map((message, index) => {
            const showTimestamp = index === 0 || 
              (messages[index - 1] && 
               message.timestamp.getTime() - messages[index - 1].timestamp.getTime() > 300000);

            return (
              <div key={message.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {showTimestamp && (
                  <div className="text-center my-3 sm:my-4">
                    <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted px-2 sm:px-3 py-1 rounded-full">
                      {format(message.timestamp, "EEE HH:mm")}
                    </span>
                  </div>
                )}
                <div
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`sms-${message.role}-${message.id}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {chatMutation.isPending && (
            <div className="flex justify-start animate-in fade-in" data-testid="sms-typing-indicator">
              <div className="max-w-[75%] bg-muted rounded-2xl rounded-bl-md px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t bg-muted/30" data-testid="sms-input-area">
        <div className="flex gap-2 max-w-xl mx-auto">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Text message"
            className="flex-1 bg-background min-h-11"
            disabled={chatMutation.isPending}
            data-testid="input-sms"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || chatMutation.isPending}
            size="icon"
            variant="default"
            className="flex-shrink-0 min-h-11 w-11"
            data-testid="button-send-sms"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
