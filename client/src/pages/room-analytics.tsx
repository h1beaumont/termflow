import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Calendar, TrendingDown, Home } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { formatCurrency } from "@/lib/formatCurrency";

interface RoomTypeAnalytics {
  roomType: string;
  count: number;
  avgWeeklyRate: number;
  totalVoidDays: number;
  avgVoidDays: number;
  totalVoidCost: number;
  avgVoidCost: number;
  currentVacancies: number;
}

export default function RoomAnalytics() {
  const { propertyId } = useParams();

  const { data: analytics, isLoading } = useQuery<RoomTypeAnalytics[]>({
    queryKey: ['/api/properties', propertyId, 'room-analytics'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const totalVoidCost = analytics?.reduce((sum, a) => sum + a.totalVoidCost, 0) || 0;
  const totalVoidDays = analytics?.reduce((sum, a) => sum + a.totalVoidDays, 0) || 0;

  return (
    <>
      <Helmet>
        <title>Room Type Analytics - TermFlow</title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Room Type Analytics</h1>
          <p className="text-muted-foreground">
            Average weekly rates, void days, and lost revenue by room type
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card data-testid="card-total-void-cost">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Void Cost</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(totalVoidCost)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lost revenue from vacancies
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-total-void-days">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Void Days</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVoidDays}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Days vacant across all room types
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-room-types">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Room Types</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Different room types in property
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Table */}
        <Card data-testid="table-room-analytics">
          <CardHeader>
            <CardTitle>Room Type Performance</CardTitle>
            <CardDescription>
              Detailed breakdown of pricing and vacancy metrics by room type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Type</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Avg Weekly Rate</TableHead>
                  <TableHead className="text-right">Current Vacancies</TableHead>
                  <TableHead className="text-right">Total Void Days</TableHead>
                  <TableHead className="text-right">Avg Void Days</TableHead>
                  <TableHead className="text-right">Total Void Cost</TableHead>
                  <TableHead className="text-right">Avg Void Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics?.map((item) => (
                  <TableRow key={item.roomType} data-testid={`row-${item.roomType}`}>
                    <TableCell className="font-medium capitalize">
                      {item.roomType.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.avgWeeklyRate)}</TableCell>
                    <TableCell className="text-right">
                      {item.currentVacancies > 0 ? (
                        <span className="text-destructive font-semibold">{item.currentVacancies}</span>
                      ) : (
                        <span className="text-green-600">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{item.totalVoidDays}</TableCell>
                    <TableCell className="text-right">{item.avgVoidDays}</TableCell>
                    <TableCell className="text-right text-destructive">
                      {formatCurrency(item.totalVoidCost)}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      {formatCurrency(item.avgVoidCost)}
                    </TableCell>
                  </TableRow>
                ))}
                {(!analytics || analytics.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No room analytics available. Add rooms to your property to see analytics.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-blue-500/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Understanding Void Costs</h4>
                <p className="text-sm text-muted-foreground">
                  Void cost = (Void days ÷ 7) × Weekly rate. This shows lost revenue during vacancy periods. 
                  Track void reasons in individual room records to identify patterns and reduce future vacancies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
