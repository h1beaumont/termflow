import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, FileCheck, MessageSquare, Mail, Phone } from "lucide-react";

export function StudentProfileMockup() {
  const messages = [
    {
      id: 1,
      from: "student",
      text: "Hello! I'm interested in a room for September 2024",
      time: "10:23 AM",
      type: "whatsapp",
    },
    {
      id: 2,
      from: "ai",
      text: "Hi Wei! 👋 We have studios and ensuite rooms available. Which would you prefer?",
      time: "10:23 AM",
      type: "whatsapp",
    },
    {
      id: 3,
      from: "student",
      text: "A studio please. What's the weekly price?",
      time: "10:25 AM",
      type: "whatsapp",
    },
    {
      id: 4,
      from: "ai",
      text: "Premium Studios are £189/week. Would you like to book a viewing?",
      time: "10:25 AM",
      type: "whatsapp",
    },
    {
      id: 5,
      from: "student",
      text: "Yes please! Friday afternoon if possible",
      time: "10:27 AM",
      type: "whatsapp",
    },
  ];

  const documents = [
    { name: "Passport Copy", status: "verified", icon: FileCheck, color: "text-green-600" },
    { name: "Student Visa", status: "verified", icon: FileCheck, color: "text-green-600" },
    { name: "Offer Letter", status: "verified", icon: FileCheck, color: "text-green-600" },
    { name: "Bank Statement", status: "pending", icon: Clock, color: "text-yellow-600" },
  ];

  const timeline = [
    { stage: "Enquiry Received", date: "Jan 15, 2024", status: "completed" },
    { stage: "Viewing Booked", date: "Jan 18, 2024", status: "completed" },
    { stage: "Application Submitted", date: "Jan 22, 2024", status: "completed" },
    { stage: "Documents Verified", date: "Jan 25, 2024", status: "in-progress" },
    { stage: "Contract Sent", date: "Pending", status: "pending" },
  ];

  return (
    <div className="space-y-6" data-testid="mockup-student-profile">
      {/* Student Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/placeholder-avatar.jpg" />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">WL</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-2xl font-bold">Wei Li</h3>
          <p className="text-sm text-muted-foreground">University of Manchester • MSc Computer Science</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              High Priority
            </Badge>
            <Badge variant="outline">Chinese National</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1" data-testid="badge-contact-whatsapp">
            <MessageSquare className="h-3 w-3" />
            WhatsApp
          </Badge>
          <Badge variant="outline" className="gap-1" data-testid="badge-contact-email">
            <Mail className="h-3 w-3" />
            Email
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversation History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversation History
            </CardTitle>
            <p className="text-sm text-muted-foreground">WhatsApp chat with AI Assistant</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ x: msg.from === "student" ? -20 : 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex ${msg.from === "student" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.from === "student"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                    data-testid={`message-${index}`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.from === "student" ? "text-muted-foreground" : "opacity-70"}`}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Document Verification
            </CardTitle>
            <p className="text-sm text-muted-foreground">Right-to-Rent compliance</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  data-testid={`document-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <doc.icon className={`h-5 w-5 ${doc.color}`} />
                    <span className="font-medium">{doc.name}</span>
                  </div>
                  <Badge variant={doc.status === "verified" ? "secondary" : "outline"}>
                    {doc.status === "verified" ? "Verified" : "Pending"}
                  </Badge>
                </motion.div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Application Timeline */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Application Timeline</h4>
              {timeline.map((item, index) => (
                <div key={item.stage} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        item.status === "completed"
                          ? "bg-green-600"
                          : item.status === "in-progress"
                          ? "bg-yellow-600"
                          : "bg-muted"
                      }`}
                    />
                    {index < timeline.length - 1 && (
                      <div className="w-px h-8 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-sm">{item.stage}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
