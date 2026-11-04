// Analytics - Performance insights and metrics
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Users, PoundSterling, Calendar, Target } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from "@/lib/formatCurrency";

export default function Analytics() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
  });

  const { data: allContracts } = useQuery({
    queryKey: ['/api/contracts'],
  });

  const { data: allRooms } = useQuery({
    queryKey: ['/api/rooms'],
  });

  const { data: allLeads } = useQuery({
    queryKey: ['/api/leads'],
  });

  const { data: financialData, isLoading: financialLoading } = useQuery({
    queryKey: ['/api/analytics/property-financials', selectedPropertyId],
  });

  const { data: bookingPacingData, isLoading: bookingPacingLoading } = useQuery({
    queryKey: [`/api/analytics/booking-pacing/${selectedPropertyId || 'all'}`],
  });

  // Filter metrics based on selected property
  const filteredMetrics = useMemo(() => {
    if (selectedPropertyId === 'all' || !allContracts || !allRooms || !allLeads) {
      return metrics; // Return original portfolio-wide metrics
    }

    // Get room IDs for the selected property
    const propertyRoomIds = allRooms
      .filter((room: any) => room.propertyId === selectedPropertyId)
      .map((room: any) => room.id);

    // Filter contracts by property rooms
    const propertyContracts = allContracts.filter((contract: any) =>
      propertyRoomIds.includes(contract.roomId)
    );

    // Filter leads by property ID
    const propertyLeads = allLeads.filter((lead: any) => lead.propertyId === selectedPropertyId);

    // Recalculate metrics for this property
    const contractsSigned = propertyContracts.filter((c: any) => c.status === 'signed').length;
    
    const totalDepositValue = propertyContracts
      .filter((c: any) => c.status === 'signed')
      .reduce((sum: number, c: any) => sum + parseFloat(c.depositAmount), 0);

    const viewingsBooked = propertyLeads.filter((l: any) => l.stage === 'viewing_booked' || l.stage === 'viewing_completed').length;

    return {
      ...metrics,
      totalLeads: propertyLeads.length,
      newEnquiries: propertyLeads.filter((l: any) => l.stage === 'new_enquiry').length,
      contractsSigned,
      totalDepositValue: Math.round(totalDepositValue * 100) / 100,
      viewingsBooked,
      conversionRate: propertyLeads.length > 0
        ? ((contractsSigned / propertyLeads.length) * 100).toFixed(1)
        : '0.0',
    };
  }, [selectedPropertyId, metrics, allContracts, allRooms, allLeads]);

  if (metricsLoading || financialLoading || bookingPacingLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const conversionRate = parseFloat(filteredMetrics?.conversionRate || '0');
  const isPositiveTrend = conversionRate > 10;

  return (
    <div className="p-8 space-y-8">
      <SEOHead
        title="Analytics - TermFlow | Financial & Booking Insights"
        description="Deep dive into performance metrics and conversion analytics. Analyze booking trends, revenue forecasts and optimize your student lettings strategy."
      />
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-analytics-title">Analytics</h1>
          <p className="text-muted-foreground mt-2">Performance insights and conversion metrics</p>
        </div>
        {!propertiesLoading && properties && properties.length > 1 && (
          <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
            <SelectTrigger className="w-64" data-testid="select-analytics-property-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties?.map((p: any) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-elevate">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between gap-2">
              Conversion Rate
              {isPositiveTrend ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-conversion-rate">{filteredMetrics?.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Enquiry to contract signed
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredMetrics?.totalLeads || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total prospects in pipeline
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PoundSterling className="h-4 w-4" />
              Revenue Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(filteredMetrics?.totalDepositValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total deposits collected
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              New Enquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredMetrics?.newEnquiries || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting first response
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Viewings Booked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredMetrics?.viewingsBooked || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredMetrics?.contractsSigned || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Contracts signed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Property Financial Breakdown - Now Above Pacing */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedPropertyId === 'all' ? 'Property Financial Breakdown' : `${properties?.find((p: any) => p.id === selectedPropertyId)?.name || 'Property'} Financial Breakdown`}
          </CardTitle>
          <CardDescription>
            {selectedPropertyId === 'all' ? 'Revenue and occupancy metrics per property' : 'Revenue and occupancy metrics for selected property'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!financialData || financialData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No property financial data available</p>
              <p className="text-sm mt-2">Add properties and signed contracts to see financial metrics</p>
            </div>
          ) : (
            financialData
              .filter((property: any) => selectedPropertyId === 'all' || property.propertyId === selectedPropertyId)
              .map((property: any) => (
              <div key={property.propertyId} className="mb-6 last:mb-0">
                {selectedPropertyId === 'all' && (
                  <h3 className="font-semibold text-lg mb-3">{property.propertyName}</h3>
                )}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Rooms Let</p>
                    <p className="text-2xl font-bold" data-testid={`text-rooms-let-${property.propertyId}`}>
                      {property.roomsLet} / {property.totalRooms}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {property.occupancyRate}% occupancy
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Avg Weekly Rent</p>
                    <p className="text-2xl font-bold">£{property.avgWeeklyRent.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Current Rent Roll</p>
                    <p className="text-2xl font-bold">£{property.rentRoll.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      Based on signed contracts
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Secured</p>
                    <p className="text-2xl font-bold text-green-600">£{property.totalIncomeSecured.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      Rent roll + deposits
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Booking Pacing - Now Below Financial Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Pacing</CardTitle>
          <CardDescription>Year-over-year comparison and benchmark progress</CardDescription>
        </CardHeader>
        <CardContent>
          {!bookingPacingData ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No booking data available</p>
              <p className="text-sm mt-2">Sign contracts to see booking pace analytics</p>
            </div>
          ) : (
            <>
              {/* Status Indicator */}
              <div className="mb-6">
                {bookingPacingData.status === 'ahead' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="h-3 w-3 rounded-full bg-green-600" />
                    <span className="font-medium">Ahead of pace</span>
                    <span className="text-sm text-muted-foreground">
                      ({bookingPacingData.currentYear.data[bookingPacingData.currentYear.data.length - 1]?.cumulative || 0} bookings)
                    </span>
                  </div>
                )}
                {bookingPacingData.status === 'on_track' && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <div className="h-3 w-3 rounded-full bg-yellow-600" />
                    <span className="font-medium">On track</span>
                    <span className="text-sm text-muted-foreground">
                      ({bookingPacingData.currentYear.data[bookingPacingData.currentYear.data.length - 1]?.cumulative || 0} bookings)
                    </span>
                  </div>
                )}
                {bookingPacingData.status === 'behind' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="h-3 w-3 rounded-full bg-red-600" />
                    <span className="font-medium">Behind benchmark</span>
                    <span className="text-sm text-muted-foreground">
                      ({bookingPacingData.currentYear.data[bookingPacingData.currentYear.data.length - 1]?.cumulative || 0} bookings)
                    </span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {bookingPacingData.benchmark.totalRooms} rooms by {new Date(bookingPacingData.benchmark.targetDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Chart */}
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={bookingPacingData.currentYear.data.map((item: any, index: number) => {
                    // Format date as "Jan 2025" instead of "Week 1"
                    const date = new Date(item.date);
                    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                    return {
                      period: monthYear,
                      currentYear: item.cumulative,
                      previousYear: bookingPacingData.previousYear.data[index]?.cumulative || 0,
                      benchmark: bookingPacingData.benchmark.requiredPace[index]?.cumulative || 0,
                    };
                  })}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="period" 
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    label={{ value: 'Cumulative Bookings', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="currentYear" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name={`${bookingPacingData.currentYear.year} Bookings`}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previousYear" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name={`${bookingPacingData.previousYear.year} Bookings`}
                    dot={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="benchmark" 
                    stroke="hsl(var(--accent-foreground))" 
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    name="Benchmark Pace"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
