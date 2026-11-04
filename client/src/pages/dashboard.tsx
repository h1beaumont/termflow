// Landlord Dashboard - Main analytics and metrics view
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Calendar, FileCheck, PoundSterling, TrendingUp, ArrowUpRight, AlertCircle, Shield, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/SEOHead";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/formatCurrency";
import { MoveInManagement } from "@/components/dashboard/MoveInManagement";

// Type definitions for API responses
interface DashboardMetrics {
  totalLeads: number;
  newEnquiries: number;
  contractsSigned: number;
  totalIncomeSecured: number;
  revenueGenerated: number;
  totalDepositValue: number;
  conversionRate: string;
  viewingsBooked: number;
  needsAttention: number;
}

interface PipelineStage {
  stage: string;
  count: number;
}

interface Property {
  id: string;
  name: string;
}

interface Contract {
  id: string;
  roomId: string;
  status: string;
  weeklyRent: string;
  contractLengthWeeks: number;
  depositAmount: string;
}

interface Room {
  id: string;
  propertyId: string;
}

interface Lead {
  id: string;
  propertyId: string;
  stage: string;
}

interface OverdueContract {
  id: string;
  tenantName: string;
  contractSignedDate: string;
  depositProtectedDate?: string;
  daysSinceSigning: number;
}

interface PendingRTRCheck {
  id: string;
  leadId: string;
  leadName?: string;
  leadEmail?: string;
  status: string;
  checkType: string;
  documents?: any[];
  createdAt: string;
}

export default function Dashboard() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');

  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ['/api/dashboard/metrics'],
  });

  const { data: pipeline, isLoading: pipelineLoading } = useQuery<PipelineStage[]>({
    queryKey: ['/api/dashboard/pipeline'],
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const { data: allContracts } = useQuery<Contract[]>({
    queryKey: ['/api/contracts'],
  });

  const { data: allRooms } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  const { data: allLeads } = useQuery<Lead[]>({
    queryKey: ['/api/leads'],
  });

  const { data: overdueContracts } = useQuery<OverdueContract[]>({
    queryKey: ['/api/deposit-protection/overdue'],
  });

  const { data: pendingRTRChecks } = useQuery<PendingRTRCheck[]>({
    queryKey: ['/api/landlord/rtr/pending'],
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

    // Filter leads by property ID directly (leads are associated with property from enquiry stage)
    const propertyLeads = allLeads.filter((lead: any) => lead.propertyId === selectedPropertyId);

    // Recalculate metrics for this property
    const contractsSigned = propertyContracts.filter((c: any) => c.status === 'signed').length;
    
    const totalIncomeSecured = propertyContracts
      .filter((c: any) => c.status === 'signed')
      .reduce((sum: number, c: any) => {
        const rentRoll = parseFloat(c.weeklyRent) * c.contractLengthWeeks;
        const deposit = parseFloat(c.depositAmount);
        return sum + rentRoll + deposit;
      }, 0);

    const revenueGenerated = propertyContracts
      .filter((c: any) => c.status === 'signed')
      .reduce((sum: number, c: any) => sum + (parseFloat(c.weeklyRent) * c.contractLengthWeeks), 0);

    const totalDepositValue = propertyContracts
      .filter((c: any) => c.status === 'signed')
      .reduce((sum: number, c: any) => sum + parseFloat(c.depositAmount), 0);

    return {
      ...metrics,
      totalLeads: propertyLeads.length,
      newEnquiries: propertyLeads.filter((l: any) => l.stage === 'new_enquiry').length,
      contractsSigned,
      totalIncomeSecured: Math.round(totalIncomeSecured * 100) / 100,
      revenueGenerated: Math.round(revenueGenerated),
      totalDepositValue: Math.round(totalDepositValue * 100) / 100,
      conversionRate: propertyLeads.length > 0
        ? ((contractsSigned / propertyLeads.length) * 100).toFixed(1)
        : '0.0',
    };
  }, [selectedPropertyId, metrics, allContracts, allRooms, allLeads]);

  // Filter pipeline based on selected property
  const filteredPipeline = useMemo(() => {
    if (selectedPropertyId === 'all' || !allLeads || !pipeline) {
      return pipeline; // Return original portfolio-wide pipeline
    }

    // Filter leads by property ID directly (leads are associated with property from enquiry stage)
    const propertyLeads = allLeads.filter((lead: any) => lead.propertyId === selectedPropertyId);

    // Recalculate pipeline stage counts for property leads
    return pipeline.map((stage: any) => ({
      ...stage,
      count: propertyLeads.filter((lead: any) => lead.stage === stage.stage).length,
    }));
  }, [selectedPropertyId, pipeline, allLeads, allContracts, allRooms]);

  if (metricsLoading || pipelineLoading) {
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

  const metricCards = [
    {
      title: "Revenue Generated",
      value: formatCurrency(filteredMetrics?.revenueGenerated),
      description: "Total contract value",
      icon: PoundSterling,
      trend: "+18% from last month",
      isRevenue: true,
    },
    {
      title: "Total Income Secured",
      value: formatCurrency(filteredMetrics?.totalIncomeSecured),
      description: "Rent roll + deposits paid",
      icon: PoundSterling,
      trend: "All signed contracts",
      isRevenue: true,
      highlight: true,
    },
    {
      title: "Contracts Signed",
      value: filteredMetrics?.contractsSigned || 0,
      description: "",
      icon: FileCheck,
      trend: `${filteredMetrics?.conversionRate || 0}% conversion`,
    },
    {
      title: "Total Leads",
      value: filteredMetrics?.totalLeads || 0,
      description: "Active enquiries",
      icon: Users,
      trend: "+12% from last month",
    },
    {
      title: "Viewings Booked",
      value: filteredMetrics?.viewingsBooked || 0,
      description: "Booked viewings",
      icon: Calendar,
      trend: "+8% from last month",
    },
  ];

  const stageLabels: Record<string, string> = {
    new_enquiry: "New Enquiry",
    viewing_booked: "Viewing Booked",
    viewed_awaiting_application: "Viewed - Awaiting Application",
    application_submitted: "Application Submitted",
    deposit_paid: "Deposit Paid",
    contract_sent: "Contract Sent",
    contract_signed: "Contract Signed",
    moved_in: "Moved In",
  };

  return (
    <div className="p-8 space-y-8">
      <SEOHead
        title="Dashboard - TermFlow | Student Accommodation Analytics & Pipeline"
        description="View comprehensive analytics, pipeline metrics and performance data for your student lettings portfolio. Track leads, viewings, contracts and revenue in real-time."
      />
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-dashboard-title">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of your lettings performance</p>
        </div>
        {!propertiesLoading && properties && properties.length > 1 && (
          <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
            <SelectTrigger className="w-64" data-testid="select-dashboard-property-filter">
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

      {/* Overdue Deposit Protection Warning */}
      {overdueContracts && overdueContracts.length > 0 && (
        <Alert variant="destructive" className="mb-4" data-testid="alert-overdue-deposit-protection">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Deposit Protection Violations Detected</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              <strong>{overdueContracts.length}</strong> contract(s) have overdue deposit protection.
              This is a serious legal violation under the UK Housing Act 2004.
            </p>
            <p className="text-sm">
              You may face fines up to 3x the deposit amount for each violation.
            </p>
            <Link href="/contracts" className="inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:no-underline" data-testid="link-review-contracts">
              Review Contracts Now →
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Pending RTR Checks Warning */}
      {pendingRTRChecks && pendingRTRChecks.length > 0 && (
        <Alert className="mb-4 border-orange-200 bg-orange-50" data-testid="alert-pending-rtr-checks">
          <Shield className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-lg font-bold text-orange-900">Right to Rent Checks Pending</AlertTitle>
          <AlertDescription className="space-y-2">
            <p className="text-orange-800">
              <strong>{pendingRTRChecks.length}</strong> tenant(s) have pending Right to Rent verification.
              UK law requires RTR checks before tenancy starts.
            </p>
            <p className="text-sm text-orange-700">
              Documents are awaiting your review. Contracts cannot proceed until RTR is verified.
            </p>
            <Link href="/contracts" className="inline-flex items-center gap-1 font-medium text-orange-900 underline underline-offset-4 hover:no-underline" data-testid="link-review-rtr">
              Review RTR Documents →
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {metricCards.map((card) => (
          <Card key={card.title} className={`hover-elevate ${(card as any).highlight ? 'border-green-500/50 bg-green-50/5' : ''}`} data-testid={`card-metric-${card.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`${card.isRevenue ? 'text-4xl' : 'text-3xl'} font-bold`} data-testid={`text-metric-${card.title.toLowerCase().replace(/\s+/g, '-')}`}>
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {card.trend.includes('%') && <TrendingUp className="h-3 w-3 text-green-600" />}
                {card.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Pipeline</CardTitle>
          <CardDescription>Lead distribution across stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPipeline?.map((stage: any) => {
              const total = filteredMetrics?.totalLeads || 1;
              const percentage = total > 0 ? Math.round((stage.count / total) * 100) : 0;
              
              return (
                <div key={stage.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{stageLabels[stage.stage] || stage.stage}</span>
                    <span className="text-muted-foreground">
                      {stage.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {filteredMetrics?.needsAttention || 0} leads require manual intervention
            </p>
            <a href="/leads" className="text-sm text-primary flex items-center gap-1 mt-2 hover:underline" data-testid="link-view-all-leads">
              Review leads
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Viewings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {filteredMetrics?.viewingsBooked || 0} viewings scheduled this week
            </p>
            <a href="/viewings" className="text-sm text-primary flex items-center gap-1 mt-2 hover:underline" data-testid="link-view-viewings">
              Manage viewings
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              RTR Checks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {pendingRTRChecks?.length || 0} checks pending review
            </p>
            <a href="/contracts" className="text-sm text-primary flex items-center gap-1 mt-2 hover:underline" data-testid="link-review-rtr-checks">
              Review RTR documents
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Move-in Management */}
      <div className="mt-8">
        <MoveInManagement />
      </div>
    </div>
  );
}
