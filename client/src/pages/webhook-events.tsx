import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Eye, Filter } from "lucide-react";
import { format } from "date-fns";

interface WebhookEvent {
  id: number;
  provider: string;
  eventId: string;
  eventType: string;
  status: string;
  rawPayload: any;
  headers: any;
  processedAt: string | null;
  errorMessage: string | null;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function WebhookEventsPage() {
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [payloadDialogOpen, setPayloadDialogOpen] = useState(false);

  // Fetch webhook events
  const { data: events = [], isLoading, refetch } = useQuery<WebhookEvent[]>({
    queryKey: ['/api/admin/webhook-events', providerFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (providerFilter !== 'all') params.append('provider', providerFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const res = await fetch(`/api/admin/webhook-events?${params}`);
      if (!res.ok) throw new Error('Failed to fetch webhook events');
      return res.json();
    },
  });

  // Retry mutation
  const retryMutation = useMutation({
    mutationFn: async (eventId: number) => {
      return apiRequest('POST', `/api/admin/webhook-events/${eventId}/retry`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/webhook-events'] });
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getProviderBadgeVariant = (provider: string) => {
    switch (provider) {
      case 'stripe':
        return 'default';
      case 'twilio':
        return 'secondary';
      case 'justcall':
        return 'outline';
      case 'email':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleViewPayload = (event: WebhookEvent) => {
    setSelectedEvent(event);
    setPayloadDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-webhook-events-title">Webhook Events</h1>
          <p className="text-muted-foreground">Monitor and debug webhook integrations</p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          data-testid="button-refresh-events"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Webhook Events</CardTitle>
              <CardDescription>
                View and manage webhook events from all providers
              </CardDescription>
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger className="w-[140px]" data-testid="select-provider-filter">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="justcall">JustCall</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading webhook events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No webhook events found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Retries</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} data-testid={`row-webhook-event-${event.id}`}>
                    <TableCell className="font-mono text-xs" data-testid={`text-event-id-${event.id}`}>
                      {event.id}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getProviderBadgeVariant(event.provider)} data-testid={`badge-provider-${event.id}`}>
                        {event.provider}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs" data-testid={`text-event-type-${event.id}`}>
                      {event.eventType}
                    </TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[200px]" data-testid={`text-external-id-${event.id}`}>
                      {event.eventId}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(event.status)} data-testid={`badge-status-${event.id}`}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell data-testid={`text-retry-count-${event.id}`}>
                      {event.retryCount > 0 ? (
                        <span className="text-destructive">{event.retryCount}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs" data-testid={`text-timestamp-${event.id}`}>
                      {format(new Date(event.createdAt), 'MMM d, HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPayload(event)}
                          data-testid={`button-view-payload-${event.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {event.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => retryMutation.mutate(event.id)}
                            disabled={retryMutation.isPending}
                            data-testid={`button-retry-${event.id}`}
                          >
                            <RefreshCw className="h-4 w-4" />
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

      {/* Payload Dialog */}
      <Dialog open={payloadDialogOpen} onOpenChange={setPayloadDialogOpen}>
        <DialogContent className="max-w-3xl" data-testid="dialog-webhook-payload">
          <DialogHeader>
            <DialogTitle>Webhook Event Details</DialogTitle>
            <DialogDescription>
              Event ID: {selectedEvent?.id} | {selectedEvent?.provider} - {selectedEvent?.eventType}
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Status</h4>
                <div className="flex gap-2 items-center">
                  <Badge variant={getStatusBadgeVariant(selectedEvent.status)}>
                    {selectedEvent.status}
                  </Badge>
                  {selectedEvent.processedAt && (
                    <span className="text-xs text-muted-foreground">
                      Processed: {format(new Date(selectedEvent.processedAt), 'MMM d, yyyy HH:mm:ss')}
                    </span>
                  )}
                </div>
              </div>

              {selectedEvent.errorMessage && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-destructive">Error Message</h4>
                  <div className="bg-destructive/10 p-3 rounded-md">
                    <pre className="text-xs text-destructive whitespace-pre-wrap" data-testid="text-error-message">
                      {selectedEvent.errorMessage}
                    </pre>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-2">Raw Payload</h4>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <pre className="text-xs" data-testid="text-raw-payload">
                    {JSON.stringify(selectedEvent.rawPayload, null, 2)}
                  </pre>
                </ScrollArea>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Headers</h4>
                <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                  <pre className="text-xs" data-testid="text-headers">
                    {JSON.stringify(selectedEvent.headers, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
