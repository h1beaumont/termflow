import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, TrendingUp, FileText, Eye, ChevronDown, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TemplatePerformance {
  template: {
    id: string;
    templateKey: string;
    stage: string;
    channel: string;
    toneOrSubject: string;
    isActive: boolean;
  };
  metrics: {
    totalShown: number;
    totalReward: number;
    ctrEstimate: string;
    clicked: number;
    converted: number;
    ignored: number;
    avgAlpha: string;
    avgBeta: string;
  };
  cohorts: Array<{
    cohortKey: string;
    shownCount: number;
    totalReward: string;
    alpha: string;
    beta: string;
    ctr: string;
  }>;
}

type SortField = 'templateKey' | 'stage' | 'channel' | 'totalShown' | 'ctrEstimate' | 'clicked' | 'converted';
type SortDirection = 'asc' | 'desc';

export default function TemplateAnalytics() {
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>('totalShown');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data: performanceData, isLoading } = useQuery<TemplatePerformance[]>({
    queryKey: ['/api/analytics/template-performance'],
  });

  const toggleRow = (templateId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(templateId)) {
      newExpanded.delete(templateId);
    } else {
      newExpanded.add(templateId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!performanceData || performanceData.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No template performance data available yet. Templates will appear here once they start being used.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Filter data
  let filteredData = performanceData;
  if (channelFilter !== "all") {
    filteredData = filteredData.filter(d => d.template.channel === channelFilter);
  }
  if (stageFilter !== "all") {
    filteredData = filteredData.filter(d => d.template.stage === stageFilter);
  }

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let aVal: any, bVal: any;

    switch (sortField) {
      case 'templateKey':
        aVal = a.template.templateKey;
        bVal = b.template.templateKey;
        break;
      case 'stage':
        aVal = a.template.stage;
        bVal = b.template.stage;
        break;
      case 'channel':
        aVal = a.template.channel;
        bVal = b.template.channel;
        break;
      case 'totalShown':
        aVal = a.metrics.totalShown;
        bVal = b.metrics.totalShown;
        break;
      case 'ctrEstimate':
        aVal = parseFloat(a.metrics.ctrEstimate);
        bVal = parseFloat(b.metrics.ctrEstimate);
        break;
      case 'clicked':
        aVal = a.metrics.clicked;
        bVal = b.metrics.clicked;
        break;
      case 'converted':
        aVal = a.metrics.converted;
        bVal = b.metrics.converted;
        break;
      default:
        aVal = 0;
        bVal = 0;
    }

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Calculate summary statistics
  const totalTemplates = performanceData.length;
  const activeTemplates = performanceData.filter(d => d.template.isActive).length;
  const totalMessagesShown = performanceData.reduce((sum, d) => sum + d.metrics.totalShown, 0);
  const avgCTR = performanceData.length > 0
    ? (performanceData.reduce((sum, d) => sum + parseFloat(d.metrics.ctrEstimate), 0) / performanceData.length).toFixed(2)
    : "0.00";

  // Get unique stages and channels for filters
  const stages = Array.from(new Set(performanceData.map(d => d.template.stage))).sort();
  const channels = Array.from(new Set(performanceData.map(d => d.template.channel))).sort();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-template-analytics">Template Performance Analytics</h1>
          <p className="text-muted-foreground">Thompson Sampling A/B Testing Results</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="card-total-templates">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-templates">{totalTemplates}</div>
            <p className="text-xs text-muted-foreground">
              {activeTemplates} active
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-messages-shown">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages Shown</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-messages-shown">{totalMessagesShown.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all templates
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-avg-ctr">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-avg-ctr">{avgCTR}%</div>
            <p className="text-xs text-muted-foreground">
              Mean across templates
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-templates">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-templates">{activeTemplates}</div>
            <p className="text-xs text-muted-foreground">
              Currently testing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Channel</label>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger data-testid="select-channel-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                {channels.map(channel => (
                  <SelectItem key={channel} value={channel}>
                    {channel === 'wa' ? 'WhatsApp' : channel === 'email' ? 'Email' : channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Stage</label>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger data-testid="select-stage-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map(stage => (
                  <SelectItem key={stage} value={stage}>
                    {stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Template Performance</CardTitle>
          <CardDescription>
            Click on a row to see cohort-level breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead 
                  className="cursor-pointer hover-elevate"
                  onClick={() => handleSort('templateKey')}
                  data-testid="header-template-key"
                >
                  Template Key {sortField === 'templateKey' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover-elevate"
                  onClick={() => handleSort('stage')}
                  data-testid="header-stage"
                >
                  Stage {sortField === 'stage' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover-elevate"
                  onClick={() => handleSort('channel')}
                  data-testid="header-channel"
                >
                  Channel {sortField === 'channel' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Tone/Subject</TableHead>
                <TableHead 
                  className="cursor-pointer hover-elevate text-right"
                  onClick={() => handleSort('totalShown')}
                  data-testid="header-shown-count"
                >
                  Shown {sortField === 'totalShown' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover-elevate text-right"
                  onClick={() => handleSort('ctrEstimate')}
                  data-testid="header-ctr"
                >
                  CTR {sortField === 'ctrEstimate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover-elevate text-right"
                  onClick={() => handleSort('clicked')}
                  data-testid="header-clicked"
                >
                  Clicked {sortField === 'clicked' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover-elevate text-right"
                  onClick={() => handleSort('converted')}
                  data-testid="header-converted"
                >
                  Converted {sortField === 'converted' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-right">Alpha</TableHead>
                <TableHead className="text-right">Beta</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => (
                <>
                  <TableRow 
                    key={item.template.id} 
                    className="cursor-pointer hover-elevate"
                    onClick={() => toggleRow(item.template.id)}
                    data-testid={`row-template-${item.template.id}`}
                  >
                    <TableCell>
                      {expandedRows.has(item.template.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium" data-testid={`text-template-key-${item.template.id}`}>
                      {item.template.templateKey}
                    </TableCell>
                    <TableCell data-testid={`text-stage-${item.template.id}`}>
                      {item.template.stage.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" data-testid={`badge-channel-${item.template.id}`}>
                        {item.template.channel === 'wa' ? 'WhatsApp' : 'Email'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" data-testid={`text-tone-${item.template.id}`}>
                      {item.template.toneOrSubject}
                    </TableCell>
                    <TableCell className="text-right" data-testid={`text-shown-${item.template.id}`}>
                      {item.metrics.totalShown.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium" data-testid={`text-ctr-${item.template.id}`}>
                      {item.metrics.ctrEstimate}
                    </TableCell>
                    <TableCell className="text-right" data-testid={`text-clicked-${item.template.id}`}>
                      {item.metrics.clicked}
                    </TableCell>
                    <TableCell className="text-right" data-testid={`text-converted-${item.template.id}`}>
                      {item.metrics.converted}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground" data-testid={`text-alpha-${item.template.id}`}>
                      {item.metrics.avgAlpha}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground" data-testid={`text-beta-${item.template.id}`}>
                      {item.metrics.avgBeta}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.template.isActive ? "default" : "secondary"}
                        data-testid={`badge-status-${item.template.id}`}
                      >
                        {item.template.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  
                  {/* Cohort Breakdown */}
                  {expandedRows.has(item.template.id) && item.cohorts.length > 0 && (
                    <TableRow data-testid={`cohort-breakdown-${item.template.id}`}>
                      <TableCell colSpan={12} className="bg-muted/50">
                        <div className="p-4 space-y-2">
                          <h4 className="font-semibold text-sm mb-3">Cohort Breakdown</h4>
                          <div className="space-y-2">
                            {item.cohorts.map((cohort, idx) => (
                              <div 
                                key={idx} 
                                className="flex items-center justify-between p-2 rounded-md bg-background"
                                data-testid={`cohort-${item.template.id}-${idx}`}
                              >
                                <div className="flex-1">
                                  <span className="text-sm font-medium">{cohort.cohortKey}</span>
                                </div>
                                <div className="flex gap-6 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Shown: </span>
                                    <span className="font-medium">{cohort.shownCount}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">CTR: </span>
                                    <span className="font-medium">{cohort.ctr}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">α: </span>
                                    <span className="font-medium">{cohort.alpha}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">β: </span>
                                    <span className="font-medium">{cohort.beta}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Reward: </span>
                                    <span className="font-medium">{cohort.totalReward}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
