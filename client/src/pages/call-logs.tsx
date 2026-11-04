import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/SEOHead";
import { Phone, Star, TrendingUp, AlertCircle, Eye, Edit, Brain, Target, Lightbulb, Sparkles } from "lucide-react";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CallLog {
  id: string;
  callTimestamp: string;
  callDuration: number | null;
  callScore: number | null;
  customerSentiment: string | null;
  callSummary: string | null;
  actionItems: string | null;
  callTranscription: any;
  staffReviewed: boolean;
  reviewNotes: string | null;
  leadInfoUpdated: boolean;
  aiCoachSummary: string | null;
  conversionOpportunities: any | null;
  missedTalkingPoints: any | null;
  skillFocusAreas: any | null;
  improvementScore: number | null;
  viewingId: string | null;
  lead: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    universityName: string | null;
    courseName: string | null;
  } | null;
}

export default function CallLogs() {
  const { toast } = useToast();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [updateLeadDialogOpen, setUpdateLeadDialogOpen] = useState(false);
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [leadFormData, setLeadFormData] = useState({
    name: "",
    email: "",
    phone: "",
    universityName: "",
    courseName: "",
  });

  const { data: callLogs, isLoading } = useQuery<CallLog[]>({
    queryKey: ['/api/call-logs'],
  });

  // Mark call as reviewed mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ id, reviewNotes }: { id: string; reviewNotes?: string }) => {
      return apiRequest(`/api/call-logs/${id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ reviewNotes }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/call-logs'] });
      toast({
        title: "Call Reviewed",
        description: "Call has been marked as reviewed successfully.",
      });
      setReviewDialogOpen(false);
      setReviewNotes("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark call as reviewed",
        variant: "destructive",
      });
    },
  });

  // Update lead mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, leadUpdates, updatedFields }: { id: string; leadUpdates: any; updatedFields: string[] }) => {
      return apiRequest(`/api/call-logs/${id}/update-lead`, {
        method: 'PATCH',
        body: JSON.stringify({ leadUpdates, updatedFields }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/call-logs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: "Lead Updated",
        description: "Lead information has been updated successfully.",
      });
      setUpdateLeadDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update lead",
        variant: "destructive",
      });
    },
  });

  // Analyze call mutation
  const analyzeCallMutation = useMutation({
    mutationFn: async (callId: string) => {
      return apiRequest(`/api/call-logs/${callId}/analyze`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/call-logs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sales-trainer/insights'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sales-trainer/metrics'] });
      toast({
        title: "Analysis Complete",
        description: "AI coaching insights have been generated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze call",
        variant: "destructive",
      });
    },
  });

  // Fetch AI coaching insights
  const { data: coachingInsights } = useQuery({
    queryKey: ['/api/sales-trainer/insights'],
  });

  // Fetch learning metrics
  const { data: learningMetrics } = useQuery({
    queryKey: ['/api/sales-trainer/metrics'],
  });

  // Calculate stats
  const stats = useMemo(() => {
    if (!callLogs || callLogs.length === 0) {
      return {
        averageScore: 0,
        totalCallsThisMonth: 0,
        positiveSentimentRate: 0,
        callsNeedingReview: 0,
      };
    }

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const callsThisMonth = callLogs.filter(log => 
      isWithinInterval(new Date(log.callTimestamp), { start: monthStart, end: monthEnd })
    );

    const callsWithScore = callLogs.filter(log => log.callScore !== null);
    const averageScore = callsWithScore.length > 0
      ? Math.round(callsWithScore.reduce((sum, log) => sum + (log.callScore || 0), 0) / callsWithScore.length)
      : 0;

    const positiveCalls = callLogs.filter(log => log.customerSentiment === 'positive').length;
    const positiveSentimentRate = callLogs.length > 0
      ? Math.round((positiveCalls / callLogs.length) * 100)
      : 0;

    const callsNeedingReview = callLogs.filter(log => !log.staffReviewed).length;

    return {
      averageScore,
      totalCallsThisMonth: callsThisMonth.length,
      positiveSentimentRate,
      callsNeedingReview,
    };
  }, [callLogs]);

  // Format duration as "Xm Ys"
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Get score color
  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score > 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  // Get sentiment badge variant
  const getSentimentVariant = (sentiment: string | null): "default" | "secondary" | "destructive" => {
    if (sentiment === 'positive') return "default";
    if (sentiment === 'neutral') return "secondary";
    return "destructive";
  };

  // Open review dialog
  const openReviewDialog = (callLog: CallLog) => {
    setSelectedCallLog(callLog);
    setReviewNotes(callLog.reviewNotes || "");
    setReviewDialogOpen(true);
  };

  // Open update lead dialog
  const openUpdateLeadDialog = (callLog: CallLog) => {
    setSelectedCallLog(callLog);
    if (callLog.lead) {
      setLeadFormData({
        name: callLog.lead.name || "",
        email: callLog.lead.email || "",
        phone: callLog.lead.phone || "",
        universityName: callLog.lead.universityName || "",
        courseName: callLog.lead.courseName || "",
      });
    }
    setUpdateLeadDialogOpen(true);
  };

  // Handle review submit
  const handleReviewSubmit = () => {
    if (selectedCallLog) {
      reviewMutation.mutate({
        id: selectedCallLog.id,
        reviewNotes: reviewNotes.trim() || undefined,
      });
    }
  };

  // Handle lead update submit
  const handleLeadUpdateSubmit = () => {
    if (!selectedCallLog || !selectedCallLog.lead) return;

    const updatedFields: string[] = [];
    const leadUpdates: any = {};

    if (leadFormData.name !== selectedCallLog.lead.name) {
      leadUpdates.name = leadFormData.name;
      updatedFields.push('name');
    }
    if (leadFormData.email !== (selectedCallLog.lead.email || "")) {
      leadUpdates.email = leadFormData.email;
      updatedFields.push('email');
    }
    if (leadFormData.phone !== (selectedCallLog.lead.phone || "")) {
      leadUpdates.phone = leadFormData.phone;
      updatedFields.push('phone');
    }
    if (leadFormData.universityName !== (selectedCallLog.lead.universityName || "")) {
      leadUpdates.universityName = leadFormData.universityName;
      updatedFields.push('universityName');
    }
    if (leadFormData.courseName !== (selectedCallLog.lead.courseName || "")) {
      leadUpdates.courseName = leadFormData.courseName;
      updatedFields.push('courseName');
    }

    if (updatedFields.length === 0) {
      toast({
        title: "No Changes",
        description: "No changes were made to the lead information.",
      });
      return;
    }

    updateLeadMutation.mutate({
      id: selectedCallLog.id,
      leadUpdates,
      updatedFields,
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Average Call Score",
      value: stats.averageScore,
      description: "AI performance rating",
      icon: Star,
    },
    {
      title: "Calls This Month",
      value: stats.totalCallsThisMonth,
      description: "Total calls handled",
      icon: Phone,
    },
    {
      title: "Positive Sentiment",
      value: `${stats.positiveSentimentRate}%`,
      description: "Customer satisfaction rate",
      icon: TrendingUp,
    },
    {
      title: "Needs Review",
      value: stats.callsNeedingReview,
      description: "Calls awaiting staff review",
      icon: AlertCircle,
    },
  ];

  return (
    <>
      <SEOHead
        title="AI Call Logs - Staff Performance & Lead Management | TermFlow"
        description="Monitor AI call performance, review call transcripts, and update lead information from AI-powered phone calls."
      />

      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">AI Call Logs</h1>
          <p className="text-muted-foreground" data-testid="text-page-subtitle">
            Staff Performance & Lead Management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card key={index} data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid={`text-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Sales Trainer Dashboard */}
        {coachingInsights && coachingInsights.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold" data-testid="text-ai-trainer-title">AI Sales Trainer</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* Latest Coaching Insights */}
              <Card data-testid="card-coaching-insights">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Latest Coaching Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coachingInsights.slice(0, 3).map((insight: any) => (
                    <div key={insight.id} className="space-y-2 pb-4 border-b last:border-0" data-testid={`insight-${insight.id}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(insight.callTimestamp), 'MMM dd, HH:mm')}
                        </span>
                        {insight.improvementScore && (
                          <Badge variant={insight.improvementScore > 0 ? "default" : "destructive"}>
                            {insight.improvementScore > 0 ? '+' : ''}{insight.improvementScore}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm" data-testid={`text-coach-summary-${insight.id}`}>
                        {insight.aiCoachSummary}
                      </p>
                      {insight.conversionOpportunities && insight.conversionOpportunities.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium mb-1">Conversion Opportunities:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {insight.conversionOpportunities.slice(0, 2).map((opp: any, idx: number) => (
                              <li key={idx} className="flex items-start gap-1" data-testid={`opportunity-${insight.id}-${idx}`}>
                                <Target className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                <span>{opp.opportunity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card data-testid="card-performance-trends">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {learningMetrics?.currentMetrics && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Call Score</p>
                          <p className="text-2xl font-bold" data-testid="text-avg-call-score">
                            {learningMetrics.currentMetrics.avgCallScore}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Conversion Rate</p>
                          <p className="text-2xl font-bold" data-testid="text-conversion-rate">
                            {learningMetrics.currentMetrics.conversionRate}%
                          </p>
                        </div>
                      </div>
                      
                      {/* Simple trend chart */}
                      {callLogs && callLogs.filter(c => c.callScore).length > 0 && (
                        <div className="h-40" data-testid="chart-performance-trend">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={callLogs.filter(c => c.callScore).slice(0, 10).reverse().map(log => ({
                              date: format(new Date(log.callTimestamp), 'MM/dd'),
                              score: log.callScore,
                            }))}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip />
                              <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Enrichment Highlights */}
            {callLogs && callLogs.some(c => c.aiCoachSummary) && (
              <Card data-testid="card-profile-enrichment">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Profile Enrichment Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {callLogs.filter(c => c.aiCoachSummary).length} Calls Analyzed
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {learningMetrics?.currentMetrics?.callsWithAICoaching || 0} With AI Coaching
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {callLogs.filter(c => c.leadInfoUpdated).length} Profiles Updated
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Call Logs Table */}
        <Card data-testid="card-call-logs-table">
          <CardHeader>
            <CardTitle>Call History</CardTitle>
          </CardHeader>
          <CardContent>
            {!callLogs || callLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-no-calls">
                No call logs available
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Lead Name</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callLogs.map((callLog) => (
                    <TableRow key={callLog.id} data-testid={`row-call-log-${callLog.id}`}>
                      <TableCell data-testid={`text-timestamp-${callLog.id}`}>
                        {format(new Date(callLog.callTimestamp), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell data-testid={`text-lead-name-${callLog.id}`}>
                        {callLog.lead?.name || "Unknown"}
                      </TableCell>
                      <TableCell data-testid={`text-duration-${callLog.id}`}>
                        {formatDuration(callLog.callDuration)}
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`font-semibold ${getScoreColor(callLog.callScore)}`}
                          data-testid={`text-score-${callLog.id}`}
                        >
                          {callLog.callScore ?? "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getSentimentVariant(callLog.customerSentiment)}
                          data-testid={`badge-sentiment-${callLog.id}`}
                        >
                          {callLog.customerSentiment || "unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell data-testid={`text-summary-${callLog.id}`}>
                        <div className="max-w-md truncate">
                          {callLog.callSummary || "No summary available"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!callLog.aiCoachSummary && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => analyzeCallMutation.mutate(callLog.id)}
                              disabled={analyzeCallMutation.isPending}
                              data-testid={`button-analyze-${callLog.id}`}
                            >
                              <Brain className="h-4 w-4 mr-1" />
                              {analyzeCallMutation.isPending ? 'Analyzing...' : 'Analyze'}
                            </Button>
                          )}
                          {callLog.aiCoachSummary && (
                            <Badge variant="outline" className="mr-2">
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI Analyzed
                            </Badge>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openReviewDialog(callLog)}
                            data-testid={`button-review-${callLog.id}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          {callLog.lead && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openUpdateLeadDialog(callLog)}
                              data-testid={`button-update-lead-${callLog.id}`}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Update Lead
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
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" data-testid="dialog-review">
          <DialogHeader>
            <DialogTitle>Call Review</DialogTitle>
            <DialogDescription>
              Review the call transcript and add notes
            </DialogDescription>
          </DialogHeader>

          {selectedCallLog && (
            <div className="space-y-4">
              {/* Call Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Lead:</p>
                  <p className="text-muted-foreground">{selectedCallLog.lead?.name || "Unknown"}</p>
                </div>
                <div>
                  <p className="font-medium">Date:</p>
                  <p className="text-muted-foreground">
                    {format(new Date(selectedCallLog.callTimestamp), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Score:</p>
                  <p className={getScoreColor(selectedCallLog.callScore)}>
                    {selectedCallLog.callScore ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Sentiment:</p>
                  <Badge variant={getSentimentVariant(selectedCallLog.customerSentiment)}>
                    {selectedCallLog.customerSentiment || "unknown"}
                  </Badge>
                </div>
              </div>

              {/* Action Items */}
              {selectedCallLog.actionItems && (
                <div>
                  <Label className="font-medium">Action Items</Label>
                  <div className="mt-2 p-3 bg-muted rounded-md text-sm" data-testid="text-action-items">
                    {selectedCallLog.actionItems}
                  </div>
                </div>
              )}

              {/* Transcript */}
              {selectedCallLog.callTranscription && (
                <div>
                  <Label className="font-medium">Call Transcript</Label>
                  <div className="mt-2 p-3 bg-muted rounded-md text-sm space-y-2 max-h-64 overflow-y-auto" data-testid="text-transcript">
                    {Array.isArray(selectedCallLog.callTranscription) ? (
                      selectedCallLog.callTranscription.map((item: any, idx: number) => (
                        <div key={idx}>
                          <span className="font-semibold">
                            {item.speaker_id === 'assistant' ? 'AI Agent' : 'Customer'}:
                          </span>{' '}
                          {item.sentence}
                        </div>
                      ))
                    ) : (
                      <p>No transcript available</p>
                    )}
                  </div>
                </div>
              )}

              {/* Review Notes */}
              <div>
                <Label htmlFor="review-notes">Staff Review Notes</Label>
                <Textarea
                  id="review-notes"
                  placeholder="Add your review notes here..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="mt-2"
                  rows={4}
                  data-testid="input-review-notes"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              data-testid="button-close-review"
            >
              Close
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={reviewMutation.isPending}
              data-testid="button-mark-reviewed"
            >
              {reviewMutation.isPending ? "Saving..." : "Mark as Reviewed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Lead Dialog */}
      <Dialog open={updateLeadDialogOpen} onOpenChange={setUpdateLeadDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-update-lead">
          <DialogHeader>
            <DialogTitle>Update Lead Information</DialogTitle>
            <DialogDescription>
              Update lead details based on call insights
            </DialogDescription>
          </DialogHeader>

          {selectedCallLog && selectedCallLog.lead && (
            <div className="space-y-4">
              {/* Suggested Updates */}
              {selectedCallLog.callSummary && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                  <p className="text-sm font-medium mb-1">AI Suggested Updates:</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-suggested-updates">
                    {selectedCallLog.callSummary}
                  </p>
                </div>
              )}

              {/* Editable Fields */}
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="lead-name">Name</Label>
                  <Input
                    id="lead-name"
                    value={leadFormData.name}
                    onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                    data-testid="input-lead-name"
                  />
                </div>

                <div>
                  <Label htmlFor="lead-email">Email</Label>
                  <Input
                    id="lead-email"
                    type="email"
                    value={leadFormData.email}
                    onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                    data-testid="input-lead-email"
                  />
                </div>

                <div>
                  <Label htmlFor="lead-phone">Phone</Label>
                  <Input
                    id="lead-phone"
                    value={leadFormData.phone}
                    onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                    data-testid="input-lead-phone"
                  />
                </div>

                <div>
                  <Label htmlFor="lead-university">University</Label>
                  <Input
                    id="lead-university"
                    value={leadFormData.universityName}
                    onChange={(e) => setLeadFormData({ ...leadFormData, universityName: e.target.value })}
                    data-testid="input-lead-university"
                  />
                </div>

                <div>
                  <Label htmlFor="lead-course">Course</Label>
                  <Input
                    id="lead-course"
                    value={leadFormData.courseName}
                    onChange={(e) => setLeadFormData({ ...leadFormData, courseName: e.target.value })}
                    data-testid="input-lead-course"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateLeadDialogOpen(false)}
              data-testid="button-close-update-lead"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLeadUpdateSubmit}
              disabled={updateLeadMutation.isPending}
              data-testid="button-save-lead-changes"
            >
              {updateLeadMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
