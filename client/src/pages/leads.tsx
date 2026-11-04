// Leads Management - Pipeline view of all tenant leads
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MessageSquare, Calendar, User } from "lucide-react";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";

export default function Leads() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const { data: leads, isLoading } = useQuery({
    queryKey: ['/api/leads'],
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
  });

  const filteredLeads = useMemo(() => {
    if (!leads) return leads;
    
    let filtered = leads;
    
    // Filter by property
    if (selectedPropertyId !== 'all') {
      filtered = filtered.filter((lead: any) => lead.propertyId === selectedPropertyId);
    }
    
    // Filter by stage
    if (selectedStage !== 'all') {
      filtered = filtered.filter((lead: any) => lead.stage === selectedStage);
    }
    
    return filtered;
  }, [selectedPropertyId, selectedStage, leads]);

  const stageLabels: Record<string, string> = {
    new_enquiry: "New Enquiry",
    viewing_booked: "Viewing Booked",
    viewed_awaiting_application: "Viewed - Awaiting Application",
    application_submitted: "Application Submitted",
    deposit_paid: "Deposit Paid",
    contract_sent: "Contract Sent",
    contract_signed: "Contract Signed",
  };

  const stageColors: Record<string, string> = {
    new_enquiry: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    viewing_booked: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    contracts_signed_deposit: "bg-green-500/10 text-green-700 dark:text-green-400",
    move_in_complete: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <SEOHead
        title="Leads - TermFlow | Manage Student Enquiries"
        description="Manage all student accommodation enquiries and applications. Track leads through your pipeline from initial contact to contract signing."
      />
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-leads-title">Leads</h1>
          <p className="text-muted-foreground mt-2">Manage all tenant enquiries and applications</p>
        </div>
        <div className="flex items-center gap-3">
          {!propertiesLoading && properties && properties.length > 1 && (
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger className="w-64" data-testid="select-leads-property-filter">
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
          
          {/* Stage Filter */}
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="w-64" data-testid="select-leads-stage-filter">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="new_enquiry">New Enquiry</SelectItem>
              <SelectItem value="viewing_booked">Viewing Booked</SelectItem>
              <SelectItem value="viewed_awaiting_application">Viewed - Awaiting Application</SelectItem>
              <SelectItem value="application_submitted">Application Submitted</SelectItem>
              <SelectItem value="deposit_paid">Deposit Paid</SelectItem>
              <SelectItem value="contract_sent">Contract Sent</SelectItem>
              <SelectItem value="contract_signed">Contract Signed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leads List */}
      {!filteredLeads || filteredLeads.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <User className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No leads yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Leads will appear here when prospects enquire about your properties
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead: any) => (
            <Card key={lead.id} className="hover-elevate" data-testid={`card-lead-${lead.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {lead.name || "Anonymous Lead"}
                      <Badge 
                        variant="secondary" 
                        className={stageColors[lead.stage] || ""}
                        data-testid={`badge-stage-${lead.id}`}
                      >
                        {stageLabels[lead.stage] || lead.stage}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Enquiry received {new Date(lead.enquiryDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {(lead.stage === "application_submitted" || lead.stage === "contract_sent" || lead.stage === "contract_signed") && (
                      <Button 
                        variant={lead.stage === "contract_signed" ? "secondary" : "default"} 
                        size="sm" 
                        asChild 
                        data-testid={`button-view-contract-${lead.id}`}
                      >
                        <Link href={`/leads/${lead.id}/contract`}>
                          {lead.stage === "contract_signed" ? "View Contract" : "Sign Contract"}
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild data-testid={`button-view-lead-${lead.id}`}>
                      <Link href={`/leads/${lead.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm">
                  {lead.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span data-testid={`text-email-${lead.id}`}>{lead.email}</span>
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span data-testid={`text-phone-${lead.id}`}>{lead.phone}</span>
                    </div>
                  )}
                  {lead.whatsappNumber && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </div>
                  )}
                  {lead.viewingDate && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Viewing: {new Date(lead.viewingDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {lead.depositPaid && (
                  <div className="mt-3">
                    <Badge variant="default" className="bg-green-500/10 text-green-700 dark:text-green-400">
                      Deposit Paid: £{lead.depositAmount}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
