import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  type: string;
  section: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

interface TaskDelegationProps {
  tasks: Task[];
  onDelegate: (taskIds: string[], delegatedToEmail: string, delegatedToName?: string) => Promise<void>;
  onContinue: () => void;
}

export function TaskDelegation({ tasks, onDelegate, onContinue }: TaskDelegationProps) {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [delegatedToEmail, setDelegatedToEmail] = useState("");
  const [delegatedToName, setDelegatedToName] = useState("");
  const [delegating, setDelegating] = useState(false);
  const [skipDelegation, setSkipDelegation] = useState(false);

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const handleTaskToggle = (taskId: string) => {
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedTaskIds.filter(id => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTaskIds.length === incompleteTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(incompleteTasks.map(t => t.id));
    }
  };

  const handleDelegate = async () => {
    if (selectedTaskIds.length === 0) {
      alert("Please select at least one task to delegate");
      return;
    }

    if (!delegatedToEmail || !delegatedToEmail.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    setDelegating(true);
    try {
      await onDelegate(selectedTaskIds, delegatedToEmail, delegatedToName);
      setSkipDelegation(true);
    } finally {
      setDelegating(false);
    }
  };

  const handleContinue = () => {
    if (incompleteTasks.length > 0 && selectedTaskIds.length === 0 && !skipDelegation) {
      const confirm = window.confirm(
        "You have incomplete tasks. Are you sure you want to continue without delegating them?"
      );
      if (!confirm) return;
    }
    onContinue();
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Tasks Summary</CardTitle>
          <CardDescription>
            Review your completed tasks or forward remaining work to a team member for instant completion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">{completedTasks.length} Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">{incompleteTasks.length} Remaining</span>
            </div>
          </div>

          {incompleteTasks.length > 0 && !skipDelegation && (
            <Alert className="border-primary/20 bg-primary/5">
              <UserPlus className="h-4 w-4 text-primary" />
              <AlertDescription>
                <strong>Forward to your team for instant completion.</strong> They'll receive an email with a secure link to complete these tasks on your behalf immediately.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Completed Tasks ✓</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
                  data-testid={`completed-task-${task.id}`}
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <Badge variant="default">Done</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Incomplete Tasks */}
      {incompleteTasks.length > 0 && !skipDelegation && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Outstanding Tasks</CardTitle>
                {incompleteTasks.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    data-testid="button-select-all"
                  >
                    {selectedTaskIds.length === incompleteTasks.length ? "Deselect All" : "Select All"}
                  </Button>
                )}
              </div>
              <CardDescription>
                Select tasks to delegate to a team member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {incompleteTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover-elevate"
                    data-testid={`task-${task.id}`}
                  >
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={selectedTaskIds.includes(task.id)}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                      data-testid={`checkbox-task-${task.id}`}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`task-${task.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {task.title}
                      </Label>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    {task.required && (
                      <Badge variant="secondary">Required</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delegation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Delegate To</CardTitle>
              <CardDescription>
                Enter the email of the team member who will complete the selected tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="delegate-email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="delegate-email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={delegatedToEmail}
                    onChange={(e) => setDelegatedToEmail(e.target.value)}
                    className="pl-9"
                    data-testid="input-delegate-email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="delegate-name">Name (optional)</Label>
                <Input
                  id="delegate-name"
                  type="text"
                  placeholder="e.g., John Smith"
                  value={delegatedToName}
                  onChange={(e) => setDelegatedToName(e.target.value)}
                  data-testid="input-delegate-name"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSkipDelegation(true)}
                  className="flex-1"
                  data-testid="button-skip-delegation"
                >
                  I'll Do This Myself
                </Button>
                <Button
                  onClick={handleDelegate}
                  disabled={delegating || selectedTaskIds.length === 0 || !delegatedToEmail}
                  className="flex-1"
                  data-testid="button-delegate"
                >
                  {delegating ? "Sending..." : `Delegate ${selectedTaskIds.length} Task${selectedTaskIds.length !== 1 ? 's' : ''}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Continue Button */}
      {(incompleteTasks.length === 0 || skipDelegation) && (
        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            size="lg"
            data-testid="button-continue"
          >
            Continue to Payment
          </Button>
        </div>
      )}
    </div>
  );
}
