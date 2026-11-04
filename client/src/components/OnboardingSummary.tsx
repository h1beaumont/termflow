import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Mail, AlertCircle, FileText, MapPin, Users, CreditCard } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CompletedSection {
  section: string;
  title: string;
  completedAt: string;
  icon: React.ReactNode;
}

interface DelegatedTask {
  id: string;
  taskType: string;
  taskTitle: string;
  delegatedToEmail: string;
  delegatedToName?: string;
  status: "pending" | "in_progress" | "completed";
  completedAt?: string;
}

interface OnboardingSummaryProps {
  completedSections: CompletedSection[];
  delegatedTasks: DelegatedTask[];
  paymentStatus: "pending" | "processing" | "succeeded" | "failed";
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  company_info: <Users className="h-4 w-4" />,
  contracts: <FileText className="h-4 w-4" />,
  floor_plans: <MapPin className="h-4 w-4" />,
  payment: <CreditCard className="h-4 w-4" />,
};

export function OnboardingSummary({
  completedSections,
  delegatedTasks,
  paymentStatus,
}: OnboardingSummaryProps) {
  const pendingTasks = delegatedTasks.filter(t => t.status === "pending");
  const inProgressTasks = delegatedTasks.filter(t => t.status === "in_progress");
  const completedDelegatedTasks = delegatedTasks.filter(t => t.status === "completed");

  const allTasksCompleted = delegatedTasks.length > 0 && pendingTasks.length === 0 && inProgressTasks.length === 0;
  const hasAnyDelegations = delegatedTasks.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Summary</CardTitle>
          <CardDescription>
            Review your completed setup and outstanding tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">{completedSections.length} Sections Complete</span>
            </div>
            {hasAnyDelegations && (
              <>
                {completedDelegatedTasks.length > 0 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium">{completedDelegatedTasks.length} Delegated Tasks Done</span>
                  </div>
                )}
                {(pendingTasks.length > 0 || inProgressTasks.length > 0) && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">
                      {pendingTasks.length + inProgressTasks.length} Tasks Delegated
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completed Sections */}
      <Card>
        <CardHeader>
          <CardTitle>What You've Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {completedSections.map((section) => (
              <div
                key={section.section}
                className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
                data-testid={`completed-${section.section}`}
              >
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  {SECTION_ICONS[section.section] || section.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{section.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Completed {new Date(section.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delegated Tasks Status */}
      {hasAnyDelegations && (
        <Card>
          <CardHeader>
            <CardTitle>Delegated Tasks</CardTitle>
            <CardDescription>
              Tasks assigned to team members for completion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Awaiting Completion</h4>
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                    data-testid={`delegated-task-${task.id}`}
                  >
                    <Clock className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">{task.taskTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {task.delegatedToName || task.delegatedToEmail}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                ))}
              </div>
            )}

            {/* In Progress Tasks */}
            {inProgressTasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">In Progress</h4>
                {inProgressTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                    data-testid={`in-progress-task-${task.id}`}
                  >
                    <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0 animate-spin" />
                    <div className="flex-1">
                      <p className="font-medium">{task.taskTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {task.delegatedToName || task.delegatedToEmail}
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">In Progress</Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Delegated Tasks */}
            {completedDelegatedTasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Completed by Team</h4>
                {completedDelegatedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
                    data-testid={`completed-delegated-task-${task.id}`}
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">{task.taskTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {task.delegatedToName || task.delegatedToEmail}
                        </p>
                      </div>
                      {task.completedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Completed {new Date(task.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Badge variant="default">Complete</Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Notification Alert */}
            {!allTasksCompleted && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  We've emailed your team member(s) with instructions. You'll receive a confirmation email once all tasks are complete.
                </AlertDescription>
              </Alert>
            )}

            {allTasksCompleted && (
              <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  All delegated tasks are complete! Your team has finished the setup.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${
            paymentStatus === "succeeded" 
              ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
              : paymentStatus === "failed"
              ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
              : "bg-muted border-border"
          }`}>
            <CreditCard className={`h-5 w-5 ${
              paymentStatus === "succeeded" ? "text-green-500" : 
              paymentStatus === "failed" ? "text-red-500" : 
              "text-muted-foreground"
            }`} />
            <div className="flex-1">
              <p className="font-medium">
                {paymentStatus === "succeeded" ? "Payment Successful" :
                 paymentStatus === "failed" ? "Payment Failed" :
                 paymentStatus === "processing" ? "Processing Payment" :
                 "Payment Pending"}
              </p>
              <p className="text-sm text-muted-foreground">
                {paymentStatus === "succeeded" ? "Your subscription is active" :
                 paymentStatus === "failed" ? "Please try again or contact support" :
                 paymentStatus === "processing" ? "Please wait while we process your payment" :
                 "Complete payment to activate your subscription"}
              </p>
            </div>
            <Badge variant={
              paymentStatus === "succeeded" ? "default" :
              paymentStatus === "failed" ? "destructive" :
              "secondary"
            }>
              {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      {allTasksCompleted && paymentStatus === "succeeded" && (
        <Alert className="bg-primary/5 border-primary">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong>Setup Complete!</strong> Your TermFlow platform is ready. You can now manage properties, track leads, and automate your lettings process.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
