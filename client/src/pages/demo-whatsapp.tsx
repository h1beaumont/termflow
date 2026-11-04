import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Check, CheckCheck, Sparkles, MessageSquare, Calendar, Home, FileCheck } from "lucide-react";
import { format } from "date-fns";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import avaAvatar from "@assets/stock_images/friendly_young_woman_6ba1b3c2.jpg";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function DemoWhatsApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! How's it going?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>(() => {
    // Check localStorage for existing session
    const stored = localStorage.getItem("demo-session-id");
    return stored || "";
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      // Store session ID
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("demo-session-id", data.sessionId);
      }
      
      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
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
    };

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(input);
    setInput("");
    inputRef.current?.focus();
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const exampleQuestions = [
    "What rooms are available for September 2026?",
    "Can I book a viewing for Stanley House?",
    "How much is the deposit?",
    "Do you have studios available?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-tf-navy/5 via-background to-tf-lime/5">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[40%_60%] gap-6 lg:gap-8">
          
          {/* Left Panel - Info */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 mb-4">
                <Sparkles className="w-4 h-4 text-[#25D366]" />
                <span className="text-sm font-semibold text-[#25D366]">LIVE DEMO</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-tf-navy" data-testid="text-demo-title">
                Experience AI-Powered Student Lettings
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6" data-testid="text-demo-subtitle">
                See how Ava, our AI assistant, handles enquiries instantly via WhatsApp
              </p>
            </div>

            {/* Key Benefits */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-tf-lime" />
                Key Benefits
              </h3>
              <ul className="space-y-3">
                {[
                  { icon: MessageSquare, text: "Responds instantly 24/7" },
                  { icon: Calendar, text: "Books viewings automatically" },
                  { icon: Home, text: "Answers property questions" },
                  { icon: FileCheck, text: "Progresses leads to application" },
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3" data-testid={`benefit-${i}`}>
                    <div className="w-8 h-8 rounded-full bg-tf-lime/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-4 h-4 text-tf-lime" />
                    </div>
                    <span className="text-sm text-foreground">{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Example Questions */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3" data-testid="text-example-questions-title">
                Try asking Ava:
              </h3>
              <div className="space-y-2">
                {exampleQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left px-4 py-3 rounded-lg bg-card border border-border hover-elevate active-elevate-2 transition-all text-sm"
                    data-testid={`quick-question-${i}`}
                  >
                    <span className="text-tf-navy font-medium">"{question}"</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Card className="p-6 bg-gradient-to-br from-tf-navy to-tf-navy-700 text-white border-0">
              <h3 className="font-bold text-xl mb-2">Ready to automate your lettings?</h3>
              <p className="text-white/80 text-sm mb-4">
                Get started with TermFlow today and let AI handle your student enquiries.
              </p>
              <Button variant="secondary" size="lg" asChild className="w-full" data-testid="button-cta-get-started">
                <a href="/">Get Started with TermFlow</a>
              </Button>
            </Card>
          </div>

          {/* Right Panel - WhatsApp Chat */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <Card className="h-full lg:h-[600px] flex flex-col overflow-hidden border-2 border-[#25D366]/20">
              {/* WhatsApp Header */}
              <div className="bg-[#25D366] text-white px-4 py-3 flex items-center gap-3" data-testid="chat-header">
                <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-white/30">
                  <AvatarImage src={avaAvatar} alt="Ava" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">Ava</h3>
                  <p className="text-xs text-white/80">Usually replies instantly</p>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E5DDD5]" data-testid="chat-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start items-end gap-2"}`}
                    data-testid={`message-${message.role}-${message.id}`}
                  >
                    {/* Avatar for assistant messages */}
                    {message.role === "assistant" && (
                      <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-white">
                        <AvatarImage src={avaAvatar} alt="Ava" />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-[#DCF8C6] text-gray-900 rounded-br-none"
                          : "bg-white text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-gray-500">
                          {format(message.timestamp, "HH:mm")}
                        </span>
                        {message.role === "user" && (
                          <CheckCheck className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {chatMutation.isPending && (
                  <div className="flex justify-start items-end gap-2" data-testid="typing-indicator">
                    <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-white">
                      <AvatarImage src={avaAvatar} alt="Ava" />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="bg-white rounded-lg rounded-bl-none px-4 py-3 max-w-[70%]">
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

              {/* Input Area */}
              <div className="p-4 bg-[#F0F0F0] border-t" data-testid="chat-input-area">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white border-gray-300"
                    disabled={chatMutation.isPending}
                    data-testid="input-message"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || chatMutation.isPending}
                    size="icon"
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white flex-shrink-0"
                    data-testid="button-send"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
