import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, CheckCircle, XCircle, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

interface EmailEvent {
  id: string;
  eventType: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  status: string;
  sentAt: string;
  errorMessage?: string;
}

export default function EmailEvents() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: events, isLoading } = useQuery<EmailEvent[]>({
    queryKey: ['/api/emails/events', { type: typeFilter === 'all' ? undefined : typeFilter, status: statusFilter === 'all' ? undefined : statusFilter }],
  });

  const getStatusBadge = (status: string) => {
    if (status === 'sent') return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Sent</Badge>;
    if (status === 'failed') return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
    return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Queued</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Email Events - TermFlow</title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Email Events</h1>
          <p className="text-muted-foreground">
            Audit trail of all automated emails sent by TermFlow
          </p>
        </div>

        <div className="flex gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48" data-testid="select-type-filter">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="welcome">Welcome</SelectItem>
              <SelectItem value="onboarding_confirmation">Onboarding</SelectItem>
              <SelectItem value="staff_created">Staff Created</SelectItem>
              <SelectItem value="deal_approval">Deal Approval</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48" data-testid="select-status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="queued">Queued</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card data-testid="card-email-events">
          <CardHeader>
            <CardTitle>Email History</CardTitle>
            <CardDescription>
              All emails sent through the automated system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events?.map((event) => (
                  <TableRow key={event.id} data-testid={`row-email-${event.id}`}>
                    <TableCell className="font-medium capitalize">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {event.eventType.replace(/_/g, ' ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.recipientName || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{event.recipientEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{event.subject}</TableCell>
                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(event.sentAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {(!events || events.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No email events found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
