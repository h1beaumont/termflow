import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, Users, Eye, FileText, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StrategyPerformance {
  strategy: {
    id: string;
    name: string;
    strategyType: string;
    description: string;
    isActive: boolean;
  };
  totalLeads: number;
  contactsCaptured: number;
  viewingsBooked: number;
  depositsPaid: number;
  contractsSigned: number;
  contactCaptureRate: string;
  viewingRate: string;
  depositRate: string;
  contractRate: string;
}

export default function StrategyAnalytics() {
  const { data: performanceData, isLoading } = useQuery<StrategyPerformance[]>({
    queryKey: ['/api/analytics/strategy-performance'],
  });

  // Calculate statistical significance (chi-square test)
  const calculateSignificance = (strategy1: StrategyPerformance, strategy2: StrategyPerformance): string => {
    const n1 = strategy1.totalLeads;
    const n2 = strategy2.totalLeads;
    
    // Need at least 30 samples for statistical significance
    if (n1 < 30 || n2 < 30) {
      return "Insufficient data";
    }
    
    const p1 = strategy1.contractsSigned / n1;
    const p2 = strategy2.contractsSigned / n2;
    
    // Pooled proportion
    const p = (strategy1.contractsSigned + strategy2.contractsSigned) / (n1 + n2);
    
    // Z-score
    const z = (p1 - p2) / Math.sqrt(p * (1 - p) * (1/n1 + 1/n2));
    
    // Two-tailed test
    const pValue = 2 * (1 - normalCDF(Math.abs(z)));
    
    if (pValue < 0.05) {
      return "Significant (p < 0.05)";
    } else if (pValue < 0.10) {
      return "Marginal (p < 0.10)";
    } else {
      return "Not significant";
    }
  };

  // Normal CDF approximation
  const normalCDF = (x: number): number => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!performanceData || performanceData.length === 0) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No strategy performance data available yet. Strategies will be assigned automatically as leads come in.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Sort by total leads (highest first)
  const sortedData = [...performanceData].sort((a, b) => b.totalLeads - a.totalLeads);
  
  // Find best performing strategy by contract conversion rate
  const bestStrategy = sortedData.reduce((best, current) => {
    if (current.totalLeads < 10) return best; // Minimum sample size
    return parseFloat(current.contractRate) > parseFloat(best.contractRate) ? current : best;
  }, sortedData[0]);

  return (
    <div className="p-6 space-y-6" data-testid="page-strategy-analytics">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-analytics-title">Conversation Strategy A/B Testing</h1>
        <p className="text-muted-foreground mt-2">
          Track conversion performance across different conversation approaches
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-leads">
              {sortedData.reduce((sum, s) => sum + s.totalLeads, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-strategies">
              {sortedData.filter(s => s.strategy.isActive).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Best Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold" data-testid="text-best-strategy">
              {bestStrategy.strategy.name}
            </div>
            <p className="text-sm text-muted-foreground">{bestStrategy.contractRate}% conversion</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Contract Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-avg-contract-rate">
              {(sortedData.reduce((sum, s) => sum + parseFloat(s.contractRate), 0) / sortedData.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Strategy Performance Comparison</CardTitle>
          <CardDescription>
            Funnel conversion rates by conversation approach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Strategy</TableHead>
                <TableHead className="text-center">Leads</TableHead>
                <TableHead className="text-center">Contact Capture</TableHead>
                <TableHead className="text-center">Viewing Booked</TableHead>
                <TableHead className="text-center">Deposit Paid</TableHead>
                <TableHead className="text-center">Contract Signed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((perf) => (
                <TableRow key={perf.strategy.id} data-testid={`row-strategy-${perf.strategy.strategyType}`}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{perf.strategy.name}</div>
                      <div className="text-sm text-muted-foreground">{perf.strategy.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{perf.totalLeads}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="font-medium">{perf.contactCaptureRate}%</div>
                      <div className="text-xs text-muted-foreground">{perf.contactsCaptured}/{perf.totalLeads}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="font-medium">{perf.viewingRate}%</div>
                      <div className="text-xs text-muted-foreground">{perf.viewingsBooked}/{perf.totalLeads}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="font-medium">{perf.depositRate}%</div>
                      <div className="text-xs text-muted-foreground">{perf.depositsPaid}/{perf.totalLeads}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="font-medium text-green-600">{perf.contractRate}%</div>
                      <div className="text-xs text-muted-foreground">{perf.contractsSigned}/{perf.totalLeads}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {perf.strategy.isActive ? (
                      <Badge variant="default" data-testid={`badge-active-${perf.strategy.strategyType}`}>Active</Badge>
                    ) : (
                      <Badge variant="secondary" data-testid={`badge-inactive-${perf.strategy.strategyType}`}>Inactive</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Statistical Significance */}
      {sortedData.length >= 2 && sortedData[0].totalLeads >= 30 && sortedData[1].totalLeads >= 30 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistical Significance</CardTitle>
            <CardDescription>
              Comparing top 2 strategies (chi-square test, α = 0.05)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <span className="font-medium">{sortedData[0].strategy.name}</span>
                  <span className="text-muted-foreground"> vs </span>
                  <span className="font-medium">{sortedData[1].strategy.name}</span>
                </div>
                <Badge variant="outline">
                  {calculateSignificance(sortedData[0], sortedData[1])}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Statistical significance requires at least 30 leads per strategy. Current sample sizes: {sortedData[0].totalLeads} and {sortedData[1].totalLeads}.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Best Performing Strategy</p>
              <p className="text-sm text-muted-foreground">
                {bestStrategy.strategy.name} achieves {bestStrategy.contractRate}% contract conversion with {bestStrategy.totalLeads} leads.
              </p>
            </div>
          </div>
          
          {sortedData.some(s => s.totalLeads < 30) && (
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium">Insufficient Data for Some Strategies</p>
                <p className="text-sm text-muted-foreground">
                  Strategies with fewer than 30 leads may not have statistically significant results. Continue testing for more reliable insights.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
