import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Key,
  FileText,
  CheckCircle,
  Clock,
  Users,
  Download,
  Send,
} from 'lucide-react';
import { format, isBefore, isToday, isTomorrow, addDays } from 'date-fns';

interface MoveIn {
  id: string;
  leadId: string;
  contractId?: string;
  tenantName: string;
  tenantEmail: string;
  propertyAddress: string;
  moveInDate: string;
  keyCollectionMethod: 'office' | 'lockbox' | 'agent';
  keyCollectionDetails: string;
  keyCollectionTime?: string;
  checklistSent: boolean;
  welcomePackSent: boolean;
  inventoryCompleted: boolean;
  moveInCompleted: boolean;
  completedAt?: string;
  createdAt: string;
}

export function MoveInManagement() {
  const { toast } = useToast();
  const [selectedTimeRange, setSelectedTimeRange] = useState<number>(30);

  // Fetch upcoming move-ins
  const { data: moveIns, isLoading } = useQuery<MoveIn[]>({
    queryKey: ['/api/landlord/move-ins/upcoming', selectedTimeRange],
    queryFn: async () => {
      const response = await fetch(`/api/landlord/move-ins/upcoming?days=${selectedTimeRange}`);
      if (!response.ok) throw new Error('Failed to fetch move-ins');
      return response.json();
    },
  });

  // Mark move-in as complete
  const completeMutation = useMutation({
    mutationFn: async (moveInId: string) => 
      apiRequest('POST', `/api/move-in/${moveInId}/complete`),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Move-in marked as complete',
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/landlord/move-ins/upcoming'] 
      });
    },
  });

  // Send welcome pack
  const sendWelcomePackMutation = useMutation({
    mutationFn: async (moveInId: string) => {
      // This would trigger the welcome pack generation and email
      const response = await apiRequest('POST', `/api/move-in/${moveInId}/send-welcome-pack`);
      return response;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Welcome pack sent to tenant',
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/landlord/move-ins/upcoming'] 
      });
    },
  });

  const getMoveInStatus = (moveIn: MoveIn) => {
    const moveInDate = new Date(moveIn.moveInDate);
    
    if (moveIn.moveInCompleted) {
      return { label: 'Completed', variant: 'default' as const };
    }
    if (isToday(moveInDate)) {
      return { label: 'Today', variant: 'destructive' as const };
    }
    if (isTomorrow(moveInDate)) {
      return { label: 'Tomorrow', variant: 'secondary' as const };
    }
    if (isBefore(moveInDate, new Date())) {
      return { label: 'Overdue', variant: 'destructive' as const };
    }
    return { label: 'Upcoming', variant: 'outline' as const };
  };

  const getKeyCollectionIcon = (method: string) => {
    switch (method) {
      case 'office':
        return '🏢';
      case 'lockbox':
        return '🔐';
      case 'agent':
        return '👤';
      default:
        return '🔑';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Move-in Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const upcomingCount = moveIns?.filter(m => !m.moveInCompleted).length || 0;
  const todayCount = moveIns?.filter(m => 
    isToday(new Date(m.moveInDate)) && !m.moveInCompleted
  ).length || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Move-ins
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCount}</div>
            <p className="text-xs text-muted-foreground">
              Tenants moving in today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Move-ins
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingCount}</div>
            <p className="text-xs text-muted-foreground">
              In the next {selectedTimeRange} days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moveIns && moveIns.length > 0
                ? Math.round((moveIns.filter(m => m.moveInCompleted).length / moveIns.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-2">
        <Button
          variant={selectedTimeRange === 7 ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTimeRange(7)}
        >
          Next 7 days
        </Button>
        <Button
          variant={selectedTimeRange === 14 ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTimeRange(14)}
        >
          Next 14 days
        </Button>
        <Button
          variant={selectedTimeRange === 30 ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTimeRange(30)}
        >
          Next 30 days
        </Button>
      </div>

      {/* Move-in List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Move-ins</CardTitle>
          <CardDescription>
            Manage upcoming tenant move-ins and track progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!moveIns || moveIns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No move-ins scheduled in the next {selectedTimeRange} days
            </div>
          ) : (
            moveIns.map((moveIn) => {
              const status = getMoveInStatus(moveIn);
              const moveInDate = new Date(moveIn.moveInDate);
              
              return (
                <div
                  key={moveIn.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{moveIn.tenantName}</p>
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {moveIn.propertyAddress}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(moveInDate, 'PPP')}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>{getKeyCollectionIcon(moveIn.keyCollectionMethod)}</span>
                        {moveIn.keyCollectionMethod}
                        {moveIn.keyCollectionTime && ` at ${moveIn.keyCollectionTime}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {moveIn.checklistSent && (
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Checklist sent
                        </Badge>
                      )}
                      {moveIn.welcomePackSent && (
                        <Badge variant="outline" className="text-xs">
                          <Send className="h-3 w-3 mr-1" />
                          Welcome pack sent
                        </Badge>
                      )}
                      {moveIn.inventoryCompleted && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Inventory done
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!moveIn.welcomePackSent && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendWelcomePackMutation.mutate(moveIn.id)}
                        disabled={sendWelcomePackMutation.isPending}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send Pack
                      </Button>
                    )}
                    
                    <a
                      href={`/api/move-in/${moveIn.id}/welcome-pack`}
                      download
                      data-testid={`button-download-pack-${moveIn.id}`}
                    >
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </a>
                    
                    {!moveIn.moveInCompleted && (
                      <Button
                        size="sm"
                        onClick={() => completeMutation.mutate(moveIn.id)}
                        disabled={completeMutation.isPending}
                        data-testid={`button-complete-movein-${moveIn.id}`}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}