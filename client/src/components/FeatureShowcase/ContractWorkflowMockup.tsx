import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileSignature, Shield, CheckCircle, Clock, Edit3 } from "lucide-react";

export function ContractWorkflowMockup() {
  const shouldReduceMotion = useReducedMotion();
  
  const contractDetails = [
    { label: "Tenant Name", value: "Wei Li" },
    { label: "Room Number", value: "Studio 12A" },
    { label: "Weekly Rent", value: "£189.00" },
    { label: "Contract Length", value: "51 weeks" },
    { label: "Total Rent Roll", value: "£9,639.00" },
    { label: "Deposit Amount", value: "£945.00" },
  ];

  const depositProtection = {
    scheme: "MyDeposits",
    status: "Protected",
    certificateNumber: "MD-2024-987654",
    protectionDate: "Jan 28, 2024",
    deadline: "Within 30 days of receipt",
  };

  const signatureSteps = [
    { step: "Generate Contract", status: "completed", date: "Jan 26" },
    { step: "Send to Tenant", status: "completed", date: "Jan 26" },
    { step: "Tenant E-Signature", status: "in-progress", date: "Pending" },
    { step: "Landlord Countersign", status: "pending", date: "-" },
    { step: "Protect Deposit", status: "pending", date: "-" },
  ];

  return (
    <div className="space-y-6" data-testid="mockup-contract-workflow">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold">Digital Contract Workflow</h3>
        <p className="text-sm text-muted-foreground mt-1">E-signature and deposit protection automation</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contract Template */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Contract Details
              </CardTitle>
              <Button size="sm" variant="outline" data-testid="button-edit-contract">
                <Edit3 className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-muted/30">
                <h4 className="font-semibold mb-3">Assured Shorthold Tenancy Agreement</h4>
                <div className="space-y-2">
                  {contractDetails.map((detail, index) => (
                    <motion.div
                      key={detail.label}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{detail.label}:</span>
                      <span className="font-medium">{detail.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-sm mb-2">Key Terms</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>51-week academic year contract (Sep 2024 - Aug 2025)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Bills included: Wi-Fi, water, electricity, heating</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Deposit protection via MyDeposits scheme</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full" data-testid="button-preview-contract">
                <FileSignature className="h-4 w-4 mr-2" />
                Preview Full Contract
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* E-Signature & Deposit Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Signature & Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Signature Progress */}
              <div>
                <h4 className="font-semibold text-sm mb-3">E-Signature Workflow</h4>
                <div className="space-y-2">
                  {signatureSteps.map((item, index) => (
                    <motion.div
                      key={item.step}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: shouldReduceMotion ? 0 : index * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-md"
                      data-testid={`signature-step-${index}`}
                    >
                      <motion.div
                        className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : item.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                        animate={shouldReduceMotion ? {} : item.status === "in-progress" ? {
                          scale: [1, 1.1, 1],
                        } : {}}
                        transition={{
                          duration: 1.5,
                          repeat: item.status === "in-progress" ? Infinity : 0
                        }}
                      >
                        {item.status === "completed" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : item.status === "in-progress" ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </motion.div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.step}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                      {item.status === "completed" && (
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                          Done
                        </Badge>
                      )}
                      {item.status === "in-progress" && (
                        <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          In Progress
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Deposit Protection Status */}
              <motion.div 
                className="rounded-lg border-2 border-green-200 bg-green-50/50 p-4"
                animate={shouldReduceMotion ? {} : {
                  borderColor: ["rgb(187 247 208)", "rgb(134 239 172)", "rgb(187 247 208)"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-green-700 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-green-900 mb-1">
                      Deposit Protection Ready
                    </h4>
                    <div className="space-y-1 text-sm text-green-800">
                      <p>Scheme: <strong>{depositProtection.scheme}</strong></p>
                      <p>Amount: <strong>£{contractDetails[5].value}</strong></p>
                      <p className="text-xs text-green-700 mt-2">
                        ⚠️ Must be protected {depositProtection.deadline}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                    Compliant
                  </Badge>
                </div>
              </motion.div>

              <Button variant="outline" className="w-full" data-testid="button-send-reminder">
                Send Signature Reminder to Tenant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
