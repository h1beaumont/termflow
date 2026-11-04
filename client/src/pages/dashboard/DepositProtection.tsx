import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  Download, 
  Send, 
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Timer,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface DepositProtection {
  id: string;
  leadId: string;
  tenantName: string;
  tenantEmail: string;
  propertyAddress: string;
  amount: string;
  scheme: 'TDS' | 'DPS' | 'MyDeposits';
  status: 'pending' | 'registered' | 'failed';
  certificateNumber?: string;
  registrationId?: string;
  protectionDeadline: string;
  registeredAt?: string;
  daysRemaining?: number;
  isOverdue?: boolean;
  createdAt: string;
}

function DepositProtectionDashboard() {
  const { toast } = useToast();
  const [selectedDeposit, setSelectedDeposit] = useState<DepositProtection | null>(null);
  const [protectionScheme, setProtectionScheme] = useState<'TDS' | 'DPS' | 'MyDeposits'>('TDS');
  const [isProtectDialogOpen, setIsProtectDialogOpen] = useState(false);

  // Fetch unprotected deposits
  const { data: unprotectedDeposits = [], isLoading, error } = useQuery<DepositProtection[]>({
    queryKey: ['/api/landlord/deposits/unprotected'],
  });

  // Protect deposit mutation
  const protectDepositMutation = useMutation({
    mutationFn: async (data: { depositId: string; scheme: string }) => {
      const deposit = unprotectedDeposits.find(d => d.id === data.depositId);
      if (!deposit) throw new Error('Deposit not found');
      
      return apiRequest('/api/deposits/protect', {
        method: 'POST',
        body: JSON.stringify({
          leadId: deposit.leadId,
          amount: deposit.amount,
          scheme: data.scheme,
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Deposit Protected',
        description: 'The deposit has been registered successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/landlord/deposits/unprotected'] });
      setIsProtectDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Protection Failed',
        description: error.message || 'Failed to register deposit protection',
        variant: 'destructive',
      });
    },
  });

  // Resend documents mutation
  const resendDocsMutation = useMutation({
    mutationFn: async (depositId: string) => {
      return apiRequest(`/api/deposits/${depositId}/resend-docs`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Documents Sent',
        description: 'Protection documents have been resent to the tenant.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Send',
        description: error.message || 'Failed to resend documents',
        variant: 'destructive',
      });
    },
  });

  // Calculate statistics
  const stats = {
    total: unprotectedDeposits.length,
    overdue: unprotectedDeposits.filter(d => d.isOverdue).length,
    dueSoon: unprotectedDeposits.filter(d => !d.isOverdue && d.daysRemaining && d.daysRemaining <= 7).length,
    pending: unprotectedDeposits.filter(d => d.status === 'pending').length,
  };

  const getUrgencyBadge = (deposit: DepositProtection) => {
    if (deposit.status === 'registered') {
      return <Badge className="bg-green-500">Protected</Badge>;
    }
    
    if (deposit.isOverdue) {
      return <Badge variant="destructive">OVERDUE - Legal Risk</Badge>;
    }
    
    if (!deposit.daysRemaining) return null;
    
    if (deposit.daysRemaining <= 3) {
      return <Badge variant="destructive">Critical - {deposit.daysRemaining} days</Badge>;
    }
    
    if (deposit.daysRemaining <= 7) {
      return <Badge className="bg-orange-500">Urgent - {deposit.daysRemaining} days</Badge>;
    }
    
    if (deposit.daysRemaining <= 14) {
      return <Badge className="bg-yellow-500">Warning - {deposit.daysRemaining} days</Badge>;
    }
    
    return <Badge variant="outline">{deposit.daysRemaining} days remaining</Badge>;
  };

  const downloadCertificate = async (depositId: string) => {
    window.open(`/api/deposits/${depositId}/certificate`, '_blank');
  };

  const downloadPrescribedInfo = async (depositId: string) => {
    window.open(`/api/deposits/${depositId}/prescribed-info`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deposit Protection</h1>
          <p className="text-muted-foreground">
            UK law requires all deposits to be protected within 30 days
          </p>
        </div>
        <Shield className="h-8 w-8 text-blue-500" />
      </div>

      {/* Urgent Alert */}
      {stats.overdue > 0 && (
        <Alert variant="destructive" className="border-red-600">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>URGENT: Legal Compliance Risk</AlertTitle>
          <AlertDescription>
            You have {stats.overdue} overdue deposit{stats.overdue > 1 ? 's' : ''} that must be protected immediately.
            Failure to protect deposits can result in penalties of 1-3x the deposit amount.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Unprotected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Requires action</p>
          </CardContent>
        </Card>

        <Card className={stats.overdue > 0 ? 'border-red-600' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Legal risk</p>
          </CardContent>
        </Card>

        <Card className={stats.dueSoon > 0 ? 'border-orange-500' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.dueSoon}</div>
            <p className="text-xs text-muted-foreground">Within 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting registration</p>
          </CardContent>
        </Card>
      </div>

      {/* Deposits Table */}
      <Card>
        <CardHeader>
          <CardTitle>Deposit Protection Status</CardTitle>
          <CardDescription>
            All deposits must be protected with an approved scheme within 30 days of receipt
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : unprotectedDeposits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold">All Deposits Protected</h3>
              <p className="text-muted-foreground">
                Great job! All your deposits are properly protected.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unprotectedDeposits.map((deposit) => (
                  <TableRow 
                    key={deposit.id}
                    className={deposit.isOverdue ? 'bg-red-50 dark:bg-red-900/10' : ''}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{deposit.tenantName}</p>
                        <p className="text-sm text-muted-foreground">{deposit.tenantEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{deposit.propertyAddress}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold">£{deposit.amount}</p>
                    </TableCell>
                    <TableCell>
                      {getUrgencyBadge(deposit)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {deposit.isOverdue ? (
                          <XCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Timer className="h-4 w-4 text-orange-500" />
                        )}
                        <span className="text-sm">
                          {format(new Date(deposit.protectionDeadline), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {deposit.status === 'registered' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadCertificate(deposit.id)}
                              data-testid={`button-download-cert-${deposit.id}`}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Certificate
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadPrescribedInfo(deposit.id)}
                              data-testid={`button-download-info-${deposit.id}`}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Info
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resendDocsMutation.mutate(deposit.id)}
                              data-testid={`button-resend-${deposit.id}`}
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Resend
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant={deposit.isOverdue ? 'destructive' : 'default'}
                            onClick={() => {
                              setSelectedDeposit(deposit);
                              setIsProtectDialogOpen(true);
                            }}
                            data-testid={`button-protect-${deposit.id}`}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Protect Now
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Protection Dialog */}
      <Dialog open={isProtectDialogOpen} onOpenChange={setIsProtectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Deposit Protection</DialogTitle>
            <DialogDescription>
              Select an approved scheme to protect this deposit
            </DialogDescription>
          </DialogHeader>
          
          {selectedDeposit && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Tenant:</p>
                  <p className="text-muted-foreground">{selectedDeposit.tenantName}</p>
                </div>
                <div>
                  <p className="font-medium">Amount:</p>
                  <p className="text-muted-foreground">£{selectedDeposit.amount}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Property:</p>
                  <p className="text-muted-foreground">{selectedDeposit.propertyAddress}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Protection Scheme</label>
                <Select value={protectionScheme} onValueChange={(value: any) => setProtectionScheme(value)}>
                  <SelectTrigger data-testid="select-scheme">
                    <SelectValue placeholder="Select a scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TDS">
                      Tenancy Deposit Scheme (TDS)
                    </SelectItem>
                    <SelectItem value="DPS">
                      Deposit Protection Service (DPS)
                    </SelectItem>
                    <SelectItem value="MyDeposits">
                      MyDeposits
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedDeposit.isOverdue && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Legal Compliance Warning</AlertTitle>
                  <AlertDescription>
                    This deposit is {Math.abs(selectedDeposit.daysRemaining || 0)} days overdue. 
                    Protect immediately to minimize legal exposure.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsProtectDialogOpen(false)}
              data-testid="button-cancel-protect"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedDeposit) {
                  protectDepositMutation.mutate({
                    depositId: selectedDeposit.id,
                    scheme: protectionScheme,
                  });
                }
              }}
              disabled={protectDepositMutation.isPending}
              data-testid="button-confirm-protect"
            >
              {protectDepositMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Protecting...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Protect Deposit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Information Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            UK Deposit Protection Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p>• Deposits must be protected within 30 days of receipt</p>
          <p>• Prescribed information must be provided to tenants</p>
          <p>• Three approved schemes: TDS, DPS, and MyDeposits</p>
          <p>• Non-compliance penalties: Return deposit + 1-3x deposit value</p>
          <p>• You cannot serve Section 21 notice until deposit is protected</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default DepositProtectionDashboard;