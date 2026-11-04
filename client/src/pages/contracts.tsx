// Contracts Management - View and manage tenant contracts with RTR compliance sequence
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { FileText, Download, Calendar, CheckCircle2, Clock, XCircle, Circle, AlertCircle, Shield, AlertTriangle, Upload, Loader2 } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";
import { formatCurrency } from "@/lib/formatCurrency";

interface RTRSequenceStatus {
  canApprove: boolean;
  canCheckRTR: boolean;
  canChargeDeposit: boolean;
  canTenantSign: boolean;
  canLandlordSign: boolean;
  currentStep: string;
  nextStep: string;
  blockers: string[];
}

interface Contract {
  id: string;
  leadId: string;
  contractUrl?: string;
  status?: string;
  approvalStatus: string;
  rightToRentStatus: string;
  rightToRentCheckedAt?: string;
  rightToRentDocumentUrl?: string;
  depositChargeStatus: string;
  depositChargedAt?: string;
  depositAmount?: number;
  tenantSignatureStatus: string;
  tenantSignedAt?: string;
  landlordSignatureStatus: string;
  landlordSignedAt?: string;
  sequenceCompletedAt?: string;
  depositProtectionStatus?: string;
  depositProtectionScheme?: string;
  depositProtectionCertificateNumber?: string;
  depositProtectionDate?: string;
  depositProtectionDeadline?: string;
  // Signable fields
  signableEnvelopeId?: string;
  tenantSigningUrl?: string;
  landlordSigningUrl?: string;
  guarantorSigningUrl?: string;
  signedDocumentUrl?: string;
  fullyExecutedAt?: string;
  startDate?: string;
  roomId?: string;
  propertyId?: string;
}

interface DepositProtectionStatus {
  isProtected: boolean;
  daysRemaining: number | null;
  isOverdue: boolean;
  deadline: Date | null;
  remindersSent: number;
  warningLevel: string;
}

// Signable Signature Management Component
function SignableSignatureManager({ contract, onRefresh }: { contract: Contract; onRefresh: () => void }) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Send contract for signature
  const sendForSignatureMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/contracts/${contract.id}/send-for-signature`),
    onSuccess: () => {
      toast({ 
        title: "Contract Sent for Signature", 
        description: "The contract has been sent to all parties for electronic signature." 
      });
      onRefresh();
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to Send", 
        description: error.message || "Could not send contract for signature", 
        variant: "destructive" 
      });
    }
  });

  // Resend reminder
  const resendReminderMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/contracts/${contract.id}/resend-signature`),
    onSuccess: () => {
      toast({ 
        title: "Reminder Sent", 
        description: "A reminder has been sent to sign the contract." 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to Send Reminder", 
        description: error.message || "Could not send reminder", 
        variant: "destructive" 
      });
    }
  });

  const getSignatureStatusIcon = () => {
    if (contract.fullyExecutedAt) {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    }
    if (contract.tenantSignatureStatus === "signed" && contract.landlordSignatureStatus === "signed") {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    }
    if (contract.tenantSignatureStatus === "signed" || contract.landlordSignatureStatus === "signed") {
      return <Clock className="h-4 w-4 text-blue-600" />;
    }
    if (contract.signableEnvelopeId) {
      return <Clock className="h-4 w-4 text-amber-600" />;
    }
    return <Circle className="h-4 w-4 text-gray-400" />;
  };

  const getSignatureStatusText = () => {
    if (contract.fullyExecutedAt) {
      return "Fully Executed";
    }
    if (contract.tenantSignatureStatus === "signed" && contract.landlordSignatureStatus === "signed") {
      return "All Parties Signed";
    }
    if (contract.tenantSignatureStatus === "signed") {
      return "Tenant Signed - Awaiting Landlord";
    }
    if (contract.landlordSignatureStatus === "signed") {
      return "Landlord Signed - Awaiting Tenant";
    }
    if (contract.signableEnvelopeId) {
      return "Sent for Signature";
    }
    return "Not Sent";
  };

  const canSendForSignature = contract.rightToRentStatus === "passed" && !contract.signableEnvelopeId;
  const canResendReminder = contract.signableEnvelopeId && !contract.fullyExecutedAt;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Electronic Signature (Signable)
        </CardTitle>
        <CardDescription>
          Manage digital signing of the tenancy agreement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Signature Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {getSignatureStatusIcon()}
            <div>
              <p className="font-medium">{getSignatureStatusText()}</p>
              {contract.signableEnvelopeId && (
                <p className="text-xs text-muted-foreground">
                  Envelope ID: {contract.signableEnvelopeId}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {contract.signedDocumentUrl && (
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={contract.signedDocumentUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-1" />
                  Download Signed
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Signature Actions */}
        {canSendForSignature && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ready for Signature</AlertTitle>
            <AlertDescription>
              RTR checks have passed. The contract is ready to be sent for electronic signature.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          {canSendForSignature && (
            <Button
              onClick={() => sendForSignatureMutation.mutate()}
              disabled={sendForSignatureMutation.isPending}
              className="w-full"
            >
              {sendForSignatureMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              Send for Signature
            </Button>
          )}
          
          {canResendReminder && (
            <Button
              onClick={() => resendReminderMutation.mutate()}
              disabled={resendReminderMutation.isPending}
              variant="outline"
            >
              {resendReminderMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              Send Reminder
            </Button>
          )}
        </div>

        {/* Signature Timeline */}
        {contract.signableEnvelopeId && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Signature Progress</p>
            <div className="space-y-1">
              {contract.tenantSignedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  <span>Tenant signed on {new Date(contract.tenantSignedAt).toLocaleDateString()}</span>
                </div>
              )}
              {contract.landlordSignedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  <span>Landlord signed on {new Date(contract.landlordSignedAt).toLocaleDateString()}</span>
                </div>
              )}
              {contract.fullyExecutedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  <span className="font-medium">Fully executed on {new Date(contract.fullyExecutedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RTRSequenceTracker({ contract, onRefresh }: { contract: Contract; onRefresh: () => void }) {
  const [rtrDialogOpen, setRtrDialogOpen] = useState(false);
  const [rtrStatus, setRtrStatus] = useState<"passed" | "failed">("passed");
  const [rtrDocumentUrl, setRtrDocumentUrl] = useState("");
  const { toast } = useToast();

  const { data: sequenceStatus, isLoading: statusLoading } = useQuery<RTRSequenceStatus>({
    queryKey: ['/api/contracts', contract.id, 'sequence-status'],
  });

  const approveMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/contracts/${contract.id}/approve`, {}),
    onSuccess: () => {
      toast({ title: "Application Approved", description: "Application has been approved successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      onRefresh();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const rtrMutation = useMutation({
    mutationFn: (data: { status: string; documentUrl?: string }) =>
      apiRequest('POST', `/api/contracts/${contract.id}/right-to-rent`, data),
    onSuccess: () => {
      toast({ title: "RTR Check Complete", description: "Right-to-Rent check has been recorded" });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      setRtrDialogOpen(false);
      onRefresh();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const chargeDepositMutation = useMutation({
    mutationFn: (stripePaymentIntentId: string) =>
      apiRequest('POST', `/api/contracts/${contract.id}/charge-deposit`, { stripePaymentIntentId }),
    onSuccess: () => {
      toast({ title: "Deposit Taken", description: "Deposit taken via Stripe" });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      onRefresh();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const tenantSignMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/contracts/${contract.id}/tenant-sign`, {}),
    onSuccess: () => {
      toast({ title: "Tenant Signed", description: "Tenant signature has been recorded" });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      onRefresh();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const landlordSignMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/contracts/${contract.id}/landlord-sign`, {}),
    onSuccess: () => {
      toast({ title: "Contract Signed", description: "Contract has been signed by landlord" });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      onRefresh();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleRTRSubmit = () => {
    rtrMutation.mutate({ status: rtrStatus, documentUrl: rtrDocumentUrl || undefined });
  };

  if (statusLoading) {
    return <Skeleton className="h-64" />;
  }

  const steps = [
    {
      number: 1,
      title: "Landlord Approval",
      status: contract.approvalStatus,
      completed: contract.approvalStatus === "approved",
      canExecute: sequenceStatus?.canApprove,
      action: () => approveMutation.mutate(),
      actionLabel: "Approve Application",
      isPending: approveMutation.isPending,
      timestamp: null,
    },
    {
      number: 2,
      title: "RTR Check",
      status: contract.rightToRentStatus,
      completed: contract.rightToRentStatus === "passed",
      failed: contract.rightToRentStatus === "failed",
      canExecute: sequenceStatus?.canCheckRTR,
      action: () => setRtrDialogOpen(true),
      actionLabel: "Complete RTR Check",
      isPending: rtrMutation.isPending,
      timestamp: contract.rightToRentCheckedAt,
    },
    {
      number: 3,
      title: "Take Deposit",
      status: contract.depositChargeStatus,
      completed: contract.depositChargeStatus === "charged",
      canExecute: sequenceStatus?.canChargeDeposit,
      action: () => {
        const mockPaymentIntentId = `pi_${Date.now()}`;
        chargeDepositMutation.mutate(mockPaymentIntentId);
      },
      actionLabel: "Take Deposit",
      isPending: chargeDepositMutation.isPending,
      timestamp: contract.depositChargedAt,
    },
    {
      number: 4,
      title: "Tenant Signature",
      status: contract.tenantSignatureStatus,
      completed: contract.tenantSignatureStatus === "signed",
      canExecute: sequenceStatus?.canTenantSign,
      action: () => tenantSignMutation.mutate(),
      actionLabel: "Record Tenant Signature",
      isPending: tenantSignMutation.isPending,
      timestamp: contract.tenantSignedAt,
    },
    {
      number: 5,
      title: "Landlord Countersign",
      status: contract.landlordSignatureStatus,
      completed: contract.landlordSignatureStatus === "signed",
      canExecute: sequenceStatus?.canLandlordSign,
      action: () => landlordSignMutation.mutate(),
      actionLabel: "Countersign Contract",
      isPending: landlordSignMutation.isPending,
      timestamp: contract.landlordSignedAt,
    },
  ];

  const getStepIcon = (step: typeof steps[0]) => {
    if (step.completed) {
      return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
    }
    if (step.failed) {
      return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    }
    if (step.canExecute && !step.completed) {
      return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
    if (!step.canExecute && !step.completed) {
      return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
    return <Circle className="h-5 w-5 text-muted-foreground" />;
  };

  const getStepColor = (step: typeof steps[0]) => {
    if (step.completed) return "border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-950";
    if (step.failed) return "border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-950";
    if (step.canExecute) return "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950";
    return "border-muted bg-muted/20";
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">RTR Compliance Sequence</h3>
          <Badge variant="outline" data-testid="badge-sequence-status">
            {sequenceStatus?.currentStep}
          </Badge>
        </div>

        {sequenceStatus && sequenceStatus.blockers.length > 0 && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <p className="font-medium">Legal Requirements:</p>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                {sequenceStatus.blockers.map((blocker, idx) => (
                  <li key={idx}>{blocker}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className={`p-4 rounded-md border-2 transition-colors ${getStepColor(step)}`}
              data-testid={`step-${step.number}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="shrink-0 mt-1">{getStepIcon(step)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {step.number}. {step.title}
                      </span>
                      {step.completed && step.timestamp && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(step.timestamp).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                    {!step.completed && !step.canExecute && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete previous steps to unlock
                      </p>
                    )}
                    {step.failed && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Check failed - please retry
                      </p>
                    )}
                  </div>
                </div>
                {step.canExecute && !step.completed && (
                  <Button
                    size="sm"
                    onClick={step.action}
                    disabled={step.isPending}
                    data-testid={`button-${step.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {step.isPending ? "Processing..." : step.actionLabel}
                  </Button>
                )}
                {step.completed && (
                  <Badge variant="default" className="bg-green-500/10 text-green-700 dark:text-green-400">
                    Complete
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {contract.sequenceCompletedAt && (
          <div className="p-4 rounded-md bg-green-50 dark:bg-green-950 border-2 border-green-600 dark:border-green-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-900 dark:text-green-100">
                Contract Fully Executed
              </span>
              <span className="text-sm text-green-700 dark:text-green-300 ml-auto">
                {new Date(contract.sequenceCompletedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RTR Check Dialog */}
      <Dialog open={rtrDialogOpen} onOpenChange={setRtrDialogOpen}>
        <DialogContent data-testid="dialog-rtr-check">
          <DialogHeader>
            <DialogTitle>Complete Right-to-Rent Check</DialogTitle>
            <DialogDescription>
              Record the outcome of the Right-to-Rent compliance check for this tenant
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Check Result</Label>
              <RadioGroup value={rtrStatus} onValueChange={(value: any) => setRtrStatus(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="passed" id="passed" data-testid="radio-rtr-passed" />
                  <Label htmlFor="passed" className="font-normal cursor-pointer">
                    Passed - Tenant has right to rent
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="failed" id="failed" data-testid="radio-rtr-failed" />
                  <Label htmlFor="failed" className="font-normal cursor-pointer">
                    Failed - Tenant does not have right to rent
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentUrl">Evidence Document URL (Optional)</Label>
              <Input
                id="documentUrl"
                placeholder="https://..."
                value={rtrDocumentUrl}
                onChange={(e) => setRtrDocumentUrl(e.target.value)}
                data-testid="input-rtr-document-url"
              />
              <p className="text-xs text-muted-foreground">
                Upload RTR check documentation for audit trail
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRtrDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRTRSubmit}
              disabled={rtrMutation.isPending}
              data-testid="button-submit-rtr"
            >
              {rtrMutation.isPending ? "Submitting..." : "Submit Check"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DepositProtectionTracker({ contract, onRefresh }: { contract: Contract; onRefresh: () => void }) {
  const [protectionDialogOpen, setProtectionDialogOpen] = useState(false);
  const [scheme, setScheme] = useState("DPS");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [protectionDate, setProtectionDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const { data: protectionStatus, isLoading } = useQuery<DepositProtectionStatus>({
    queryKey: ['/api/contracts', contract.id, 'deposit-protection-status'],
    enabled: contract.depositChargeStatus === "charged",
  });

  const protectMutation = useMutation({
    mutationFn: (data: { scheme: string; certificateNumber: string; protectionDate: string }) =>
      apiRequest('POST', `/api/contracts/${contract.id}/deposit-protection`, data),
    onSuccess: () => {
      toast({ 
        title: "Deposit Protected", 
        description: "Deposit has been successfully protected in approved scheme" 
      });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      setProtectionDialogOpen(false);
      setCertificateNumber("");
      onRefresh();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleProtectionSubmit = () => {
    if (!certificateNumber.trim()) {
      toast({ 
        title: "Certificate Required", 
        description: "Please enter a certificate number",
        variant: "destructive" 
      });
      return;
    }
    protectMutation.mutate({ scheme, certificateNumber, protectionDate });
  };

  // Don't show if deposit not charged
  if (contract.depositChargeStatus !== "charged") {
    return null;
  }

  if (isLoading) {
    return <Skeleton className="h-32" />;
  }

  if (!protectionStatus) {
    return null;
  }

  const { isProtected, daysRemaining, isOverdue, deadline, warningLevel } = protectionStatus;

  // Show protected status
  if (isProtected) {
    return (
      <Card className="border-green-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            <CardTitle className="text-green-900 dark:text-green-100">Deposit Protected</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Scheme</p>
              <p className="font-medium">{contract.depositProtectionScheme}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Certificate</p>
              <p className="font-medium">{contract.depositProtectionCertificateNumber}</p>
            </div>
          </div>
          {contract.depositProtectionDate && (
            <p className="text-sm text-muted-foreground">
              Protected on: {new Date(contract.depositProtectionDate).toLocaleDateString('en-GB')}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show overdue violation
  if (isOverdue) {
    const depositAmountNumber = typeof contract.depositAmount === 'string' 
      ? parseFloat(contract.depositAmount) 
      : (contract.depositAmount || 1000);
    const potentialFine = depositAmountNumber * 3;

    return (
      <>
        <Alert variant="destructive" data-testid="alert-deposit-protection-overdue">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">LEGAL VIOLATION: Deposit Protection Overdue</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              This deposit should have been protected by{' '}
              <strong>{deadline ? new Date(deadline).toLocaleDateString('en-GB') : 'the deadline'}</strong>.
            </p>
            <p className="text-sm">
              You may face fines up to <strong>{formatCurrency(potentialFine)}</strong> (3x deposit amount).
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setProtectionDialogOpen(true)}
                data-testid="button-mark-protected-overdue"
              >
                Protect Immediately
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a 
                  href="https://www.depositprotection.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="link-dps-scheme"
                >
                  DPS
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a 
                  href="https://www.mydeposits.co.uk/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="link-mydeposits-scheme"
                >
                  MyDeposits
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a 
                  href="https://www.tenancydepositscheme.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="link-tds-scheme"
                >
                  TDS
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
        {/* Protection Dialog */}
        <Dialog open={protectionDialogOpen} onOpenChange={setProtectionDialogOpen}>
          <DialogContent data-testid="dialog-mark-protected">
            <DialogHeader>
              <DialogTitle>Mark Deposit as Protected</DialogTitle>
              <DialogDescription>
                Record deposit protection details after registering with an approved scheme
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="scheme">Protection Scheme</Label>
                <Select value={scheme} onValueChange={setScheme}>
                  <SelectTrigger id="scheme" data-testid="select-protection-scheme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DPS">DPS (Deposit Protection Service)</SelectItem>
                    <SelectItem value="MyDeposits">MyDeposits</SelectItem>
                    <SelectItem value="TDS">TDS (Tenancy Deposit Scheme)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificateNumber">Certificate Number</Label>
                <Input
                  id="certificateNumber"
                  placeholder="Enter certificate number"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  data-testid="input-certificate-number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protectionDate">Protection Date</Label>
                <Input
                  id="protectionDate"
                  type="date"
                  value={protectionDate}
                  onChange={(e) => setProtectionDate(e.target.value)}
                  data-testid="input-protection-date"
                />
              </div>
              <div className="p-3 bg-muted rounded-md space-y-2">
                <p className="text-sm font-medium">Quick Links to Schemes:</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.depositprotection.com/" target="_blank" rel="noopener noreferrer">DPS</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.mydeposits.co.uk/" target="_blank" rel="noopener noreferrer">MyDeposits</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.tenancydepositscheme.com/" target="_blank" rel="noopener noreferrer">TDS</a>
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setProtectionDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleProtectionSubmit}
                disabled={protectMutation.isPending}
                data-testid="button-submit-protection"
              >
                {protectMutation.isPending ? "Submitting..." : "Mark as Protected"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Show warning with countdown
  const progressValue = daysRemaining !== null ? ((30 - daysRemaining) / 30) * 100 : 0;
  
  let cardClassName = "border-blue-500";
  let iconColor = "text-blue-600 dark:text-blue-400";
  let titleColor = "text-blue-900 dark:text-blue-100";

  if (warningLevel === "critical") {
    cardClassName = "border-red-500";
    iconColor = "text-red-600 dark:text-red-400";
    titleColor = "text-red-900 dark:text-red-100";
  } else if (warningLevel === "urgent") {
    cardClassName = "border-orange-500";
    iconColor = "text-orange-600 dark:text-orange-400";
    titleColor = "text-orange-900 dark:text-orange-100";
  } else if (warningLevel === "warning") {
    cardClassName = "border-yellow-500";
    iconColor = "text-yellow-600 dark:text-yellow-400";
    titleColor = "text-yellow-900 dark:text-yellow-100";
  }

  return (
    <>
      <Card className={cardClassName} data-testid="card-deposit-protection-warning">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${iconColor}`} />
            <CardTitle className={titleColor}>Deposit Protection Required</CardTitle>
          </div>
          <CardDescription>
            UK law requires deposit protection within 30 days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Deadline:</span>
              <span className="font-medium">
                {deadline ? new Date(deadline).toLocaleDateString('en-GB') : 'N/A'}
                {daysRemaining !== null && (
                  <span className={warningLevel === "critical" ? "text-red-600 dark:text-red-400 ml-2" : "ml-2"}>
                    ({daysRemaining} days remaining)
                  </span>
                )}
              </span>
            </div>
            <Progress value={progressValue} className="h-2" data-testid="progress-deposit-protection" />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setProtectionDialogOpen(true)}
              data-testid="button-mark-protected"
            >
              Mark as Protected
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.depositprotection.com/" target="_blank" rel="noopener noreferrer">
                DPS
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.mydeposits.co.uk/" target="_blank" rel="noopener noreferrer">
                MyDeposits
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.tenancydepositscheme.com/" target="_blank" rel="noopener noreferrer">
                TDS
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Protection Dialog */}
      <Dialog open={protectionDialogOpen} onOpenChange={setProtectionDialogOpen}>
        <DialogContent data-testid="dialog-mark-protected">
          <DialogHeader>
            <DialogTitle>Mark Deposit as Protected</DialogTitle>
            <DialogDescription>
              Record deposit protection details after registering with an approved scheme
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scheme">Protection Scheme</Label>
              <Select value={scheme} onValueChange={setScheme}>
                <SelectTrigger id="scheme" data-testid="select-protection-scheme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DPS">DPS (Deposit Protection Service)</SelectItem>
                  <SelectItem value="MyDeposits">MyDeposits</SelectItem>
                  <SelectItem value="TDS">TDS (Tenancy Deposit Scheme)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificateNumber">Certificate Number</Label>
              <Input
                id="certificateNumber"
                placeholder="Enter certificate number"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                data-testid="input-certificate-number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protectionDate">Protection Date</Label>
              <Input
                id="protectionDate"
                type="date"
                value={protectionDate}
                onChange={(e) => setProtectionDate(e.target.value)}
                data-testid="input-protection-date"
              />
            </div>
            <div className="p-3 bg-muted rounded-md space-y-2">
              <p className="text-sm font-medium">Quick Links to Schemes:</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.depositprotection.com/" target="_blank" rel="noopener noreferrer">DPS</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.mydeposits.co.uk/" target="_blank" rel="noopener noreferrer">MyDeposits</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.tenancydepositscheme.com/" target="_blank" rel="noopener noreferrer">TDS</a>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProtectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleProtectionSubmit}
              disabled={protectMutation.isPending}
              data-testid="button-submit-protection"
            >
              {protectMutation.isPending ? "Submitting..." : "Mark as Protected"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ContractDocumentManager({ contract, onRefresh }: { contract: Contract; onRefresh: () => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Only show for draft or signed contracts
  const canUpload = contract.status === "draft" || contract.status === "signed";

  const uploadMutation = useMutation({
    mutationFn: (contractUrl: string) =>
      apiRequest('PATCH', `/api/contracts/${contract.id}/upload-document`, { contractUrl }),
    onSuccess: () => {
      toast({ 
        title: "Contract Uploaded", 
        description: "Contract document has been successfully uploaded" 
      });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      setIsUploading(false);
      onRefresh();
    },
    onError: (error: any) => {
      toast({ 
        title: "Upload Failed", 
        description: error.message, 
        variant: "destructive" 
      });
      setIsUploading(false);
    },
  });

  const handleGetUploadUrl = async () => {
    const res = await fetch("/api/objects/upload", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    return { method: "PUT" as const, url: data.uploadURL };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    const firstUpload = result.successful?.[0];
    const uploadUrl = firstUpload?.uploadURL;
    if (!uploadUrl) return;

    setIsUploading(true);
    try {
      const res = await fetch("/api/property-images", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageURL: uploadUrl }),
      });
      const data = await res.json();
      const objectPath = data.objectPath;
      
      // Update contract with the new document URL
      uploadMutation.mutate(objectPath);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to process uploaded document",
      });
      setIsUploading(false);
    }
  };

  if (!canUpload) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Contract Document
        </CardTitle>
        <CardDescription>
          Upload and manage the tenancy agreement PDF
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Show current contract if exists */}
        {contract.contractUrl && (
          <div className="p-3 rounded-md bg-muted/50 border">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium truncate">Contract Document</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                asChild
                data-testid={`button-view-contract-${contract.id}`}
              >
                <a href={contract.contractUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  View
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Upload section */}
        <div className="space-y-3" data-testid={`upload-section-contract-${contract.id}`}>
          <div className="flex items-center gap-3">
            <ObjectUploader
              maxNumberOfFiles={1}
              maxFileSize={52428800}
              onGetUploadParameters={handleGetUploadUrl}
              onComplete={handleUploadComplete}
            >
              <Upload className="h-4 w-4 mr-2" />
              {contract.contractUrl ? "Replace Contract" : "Upload Contract"}
            </ObjectUploader>
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Supported format: PDF (Max 50MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Contracts() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const { data: contracts, isLoading, refetch } = useQuery({
    queryKey: ['/api/contracts'],
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
  });

  const { data: leads } = useQuery({
    queryKey: ['/api/leads'],
  });

  // Filter contracts by property
  const filteredContracts = useMemo(() => {
    if (!contracts) return [];
    if (selectedPropertyId === 'all') return contracts as any[];
    
    const leadsArray = leads as any[] | undefined;
    const propertyLeadIds = leadsArray
      ?.filter((lead: any) => lead.propertyId === selectedPropertyId)
      .map((lead: any) => lead.id);
    
    const contractsArray = contracts as any[];
    return contractsArray.filter((c: any) => propertyLeadIds?.includes(c.leadId));
  }, [selectedPropertyId, contracts, leads]);

  const selectedContract = filteredContracts?.find((c: any) => c.id === selectedContractId);

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const getSequenceStatusBadge = (contract: Contract) => {
    // Check Signable status first
    if (contract.fullyExecutedAt) {
      return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Fully Executed</Badge>;
    }
    if (contract.signableEnvelopeId) {
      if (contract.landlordSignatureStatus === "signed" && contract.tenantSignatureStatus === "signed") {
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">All Parties Signed</Badge>;
      }
      if (contract.tenantSignatureStatus === "signed") {
        return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">Awaiting Landlord Signature</Badge>;
      }
      if (contract.tenantSignatureStatus === "pending") {
        return <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400">Awaiting Tenant Signature</Badge>;
      }
    }
    // Original sequence status
    if (contract.sequenceCompletedAt) {
      return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Fully Executed</Badge>;
    }
    if (contract.landlordSignatureStatus === "signed") {
      return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">Awaiting Final Steps</Badge>;
    }
    if (contract.tenantSignatureStatus === "signed") {
      return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">Awaiting Landlord Signature</Badge>;
    }
    if (contract.depositChargeStatus === "charged") {
      return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">Awaiting Tenant Signature</Badge>;
    }
    if (contract.rightToRentStatus === "passed") {
      return <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400">Ready for Signing</Badge>;
    }
    if (contract.approvalStatus === "approved") {
      return <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400">RTR Check Required</Badge>;
    }
    return <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-400">Awaiting Approval</Badge>;
  };

  return (
    <div className="p-8 space-y-8">
      <SEOHead
        title="Contracts - TermFlow | Tenancy Agreements & RTR Compliance"
        description="Manage student tenancy agreements with Right-to-Rent compliance tracking. Enforce UK legal requirements for deposit collection and contract signing."
      />
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-contracts-title">
            Contracts
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage tenant contracts with RTR compliance sequence
          </p>
        </div>
        {!propertiesLoading && properties && (properties as any[]).length > 1 ? (
          <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
            <SelectTrigger className="w-64" data-testid="select-contracts-property-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {(properties as any[])?.map((p: any) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      {/* Contracts List */}
      {!filteredContracts || filteredContracts.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No contracts yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Contracts will appear here when created for leads
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contracts List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">All Contracts</h2>
            {filteredContracts.map((contract: any) => {
              const lead = (leads as any[] | undefined)?.find((l: any) => l.id === contract.leadId);
              const property = (properties as any[] | undefined)?.find((p: any) => p.id === lead?.propertyId);
              
              return (
                <Card
                  key={contract.id}
                  className={`hover-elevate cursor-pointer ${selectedContractId === contract.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedContractId(contract.id)}
                  data-testid={`card-contract-${contract.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {lead?.name || "Anonymous Tenant"}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {property?.name}
                        </CardDescription>
                      </div>
                      {getSequenceStatusBadge(contract)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      {contract.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Start: {new Date(contract.startDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contract Details with RTR Sequence */}
          <div>
            {selectedContract ? (
              <Card>
                <CardHeader>
                  <CardTitle>Contract Details</CardTitle>
                  <CardDescription>
                    Track Right-to-Rent compliance and contract execution
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SignableSignatureManager contract={selectedContract} onRefresh={() => refetch()} />
                  <ContractDocumentManager contract={selectedContract} onRefresh={() => refetch()} />
                  <RTRSequenceTracker contract={selectedContract} onRefresh={() => refetch()} />
                  <DepositProtectionTracker contract={selectedContract} onRefresh={() => refetch()} />
                </CardContent>
              </Card>
            ) : (
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Select a contract</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose a contract from the list to view RTR sequence details
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
