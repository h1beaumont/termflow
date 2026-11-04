import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Globe, Zap, CheckCircle2, Calendar } from "lucide-react";

export function AIChatMockup() {
  const shouldReduceMotion = useReducedMotion();
  const [activeConvo, setActiveConvo] = useState(0);

  const conversations = [
    {
      id: 1,
      name: "Wei Li",
      language: "Chinese",
      flag: "🇨🇳",
      messages: [
        { from: "student", text: "你好！我想预订一个房间", time: "10:23", translated: "Hello! I want to book a room" },
        { from: "ai", text: "你好Wei！我们有单人间和套房可供选择。你更喜欢哪种？", time: "10:23", translated: "Hi Wei! We have studios and ensuite rooms available. Which would you prefer?" },
        { from: "student", text: "套房的价格是多少？", time: "10:24", translated: "How much is the studio?" },
        { from: "ai", text: "高级套房每周£189。包括所有账单。你想预约参观吗？", time: "10:24", translated: "Premium Studios are £189/week. All bills included. Would you like to book a viewing?" },
      ],
      status: "qualified",
    },
    {
      id: 2,
      name: "Maria Garcia",
      language: "Spanish",
      flag: "🇪🇸",
      messages: [
        { from: "student", text: "Hola, ¿tienen habitaciones disponibles para septiembre?", time: "11:15", translated: "Hello, do you have rooms available for September?" },
        { from: "ai", text: "¡Hola Maria! Sí, tenemos habitaciones disponibles. ¿Prefieres una habitación individual o un estudio?", time: "11:15", translated: "Hi Maria! Yes, we have rooms available. Would you prefer an ensuite or a studio?" },
        { from: "student", text: "Un estudio, por favor", time: "11:16", translated: "A studio, please" },
      ],
      status: "active",
    },
    {
      id: 3,
      name: "Raj Patel",
      language: "Hindi",
      flag: "🇮🇳",
      messages: [
        { from: "student", text: "नमस्ते, क्या आप सितंबर के लिए कमरे बुक कर रहे हैं?", time: "14:30", translated: "Hello, are you taking bookings for September?" },
        { from: "ai", text: "नमस्ते Raj! हाँ, हम बुकिंग ले रहे हैं। मैं आपको उपलब्ध कमरे दिखा सकता हूं।", time: "14:30", translated: "Hello Raj! Yes, we are taking bookings. I can show you available rooms." },
      ],
      status: "new",
    },
  ];

  const aiMetrics = [
    { label: "Response Time", value: "< 30s", icon: Zap, color: "text-green-600" },
    { label: "Languages", value: "25+", icon: Globe, color: "text-blue-600" },
    { label: "Qualification Rate", value: "84%", icon: CheckCircle2, color: "text-purple-600" },
  ];

  const currentConvo = conversations[activeConvo];

  return (
    <div className="space-y-6" data-testid="mockup-ai-chat">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold">AI Assistant (Ava)</h3>
        <p className="text-sm text-muted-foreground mt-1">24/7 multilingual WhatsApp automation</p>
      </div>

      {/* AI Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {aiMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: shouldReduceMotion ? 0 : index * 0.1 }}
          >
            <Card className="hover-elevate" data-testid={`metric-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversation List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conversations.map((convo, index) => (
                <motion.button
                  key={convo.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: shouldReduceMotion ? 0 : index * 0.1 }}
                  onClick={() => setActiveConvo(index)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    activeConvo === index
                      ? "border-primary bg-primary/5"
                      : "border-border hover-elevate"
                  }`}
                  data-testid={`conversation-${convo.id}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{convo.flag}</span>
                      <span className="font-semibold text-sm">{convo.name}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        convo.status === "qualified"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : convo.status === "active"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {convo.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {convo.language} • {convo.messages.length} messages
                  </p>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Conversation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentConvo.flag}</span>
                <div>
                  <CardTitle className="text-base">{currentConvo.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Conversation in {currentConvo.language}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1">
                <MessageSquare className="h-3 w-3" />
                WhatsApp
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Chat Messages */}
            <div className="space-y-4 mb-4">
              {currentConvo.messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ x: msg.from === "student" ? -20 : 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: shouldReduceMotion ? 0 : index * 0.1 }}
                  className={`flex ${msg.from === "student" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 ${
                      msg.from === "student"
                        ? "bg-muted border"
                        : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                    }`}
                    data-testid={`message-${index}`}
                  >
                    {msg.from === "ai" && (
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          <Zap className="h-2 w-2 mr-1" />
                          AI Ava
                        </Badge>
                      </div>
                    )}
                    <p className="text-sm mb-1">{msg.text}</p>
                    <div
                      className={`text-xs mt-2 pt-2 border-t ${
                        msg.from === "student"
                          ? "border-border text-muted-foreground"
                          : "border-white/20 text-white/70"
                      }`}
                    >
                      <p className="italic">Translation: {msg.translated}</p>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        msg.from === "student" ? "text-muted-foreground" : "text-white/70"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Typing Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.5 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <div className="flex gap-1">
                <motion.div
                  animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="h-2 w-2 rounded-full bg-primary"
                />
                <motion.div
                  animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="h-2 w-2 rounded-full bg-primary"
                />
                <motion.div
                  animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="h-2 w-2 rounded-full bg-primary"
                />
              </div>
              <span>Ava is typing...</span>
            </motion.div>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs font-semibold mb-2 text-muted-foreground">AI Suggested Actions:</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" data-testid="button-book-viewing">
                  <Calendar className="h-3 w-3 mr-1" />
                  Book Viewing
                </Button>
                <Button variant="outline" size="sm" data-testid="button-send-brochure">
                  Send Brochure
                </Button>
                <Button variant="outline" size="sm" data-testid="button-escalate">
                  Escalate to Staff
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Detection Banner */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Globe className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Automatic Language Detection</h4>
              <p className="text-sm text-muted-foreground">
                Ava automatically detects the language and responds in the same language. Supports 25+ languages including:
                Chinese, Spanish, Hindi, Arabic, French, German, Portuguese, and more.
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
