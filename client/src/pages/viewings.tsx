// Viewings Management - Book and manage property viewings
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Video, MapPin, User, Clock, CheckCircle2, Mail, Phone, MessageSquare, GraduationCap, BookOpen, Tag, Building } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ViewingOutcomeDialog } from "@/components/ViewingOutcomeDialog";
import { SEOHead } from "@/components/SEOHead";

export default function Viewings() {
  const { toast } = useToast();
  const [selectedViewing, setSelectedViewing] = useState<any>(null);
  const [outcomeDialogOpen, setOutcomeDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  
  const { data: viewings, isLoading } = useQuery({
    queryKey: ['/api/viewings/upcoming'],
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
  });

  const filteredViewings = useMemo(() => {
    if (selectedPropertyId === 'all' || !viewings) return viewings;
    return viewings.filter((viewing: any) => 
      viewing.lead?.propertyId === selectedPropertyId || viewing.propertyId === selectedPropertyId
    );
  }, [selectedPropertyId, viewings]);

  const updateViewingMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      await apiRequest("PATCH", `/api/viewings/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/viewings/upcoming'] });
      toast({
        title: "Viewing updated",
        description: "The viewing has been updated successfully",
      });
    },
  });

  const viewingTypeLabels: Record<string, string> = {
    in_person: "In-Person",
    video_call: "Video Call",
    self_guided: "Self-Guided",
  };

  const viewingTypeIcons: Record<string, any> = {
    in_person: MapPin,
    video_call: Video,
    self_guided: User,
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <SEOHead
        title="Viewings - TermFlow | Property Tour Schedule"
        description="Book and manage property viewings for student accommodation. Track in-person, video call and self-guided tours with automated booking."
      />
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-viewings-title">Viewings</h1>
          <p className="text-muted-foreground mt-2">Manage booked property viewings</p>
        </div>
        {!propertiesLoading && properties && properties.length > 1 && (
          <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
            <SelectTrigger className="w-64" data-testid="select-viewings-property-filter">
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

      {/* Viewings List */}
      {!filteredViewings || filteredViewings.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No upcoming viewings</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Viewings will appear here when prospects book them
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredViewings.map((viewing: any) => {
            const TypeIcon = viewingTypeIcons[viewing.viewingType] || Calendar;
            
            return (
              <Card key={viewing.id} className="hover-elevate" data-testid={`card-viewing-${viewing.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                        <TypeIcon className="h-5 w-5" />
                        {viewingTypeLabels[viewing.viewingType] || viewing.viewingType}
                        <Badge 
                          variant={viewing.status === 'scheduled' ? 'default' : 'secondary'}
                          data-testid={`badge-status-${viewing.id}`}
                        >
                          {viewing.status}
                        </Badge>
                      </CardTitle>
                      
                      {viewing.leadName && (
                        <div className="mt-2 text-base font-medium" data-testid={`text-lead-name-${viewing.id}`}>
                          {viewing.leadName}
                        </div>
                      )}
                      
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(viewing.scheduledAt).toLocaleString()} 
                        ({viewing.duration} minutes)
                      </CardDescription>
                      
                      {viewing.propertyName && (
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <Building className="h-3 w-3" />
                          {viewing.propertyName}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Information */}
                  {(viewing.leadEmail || viewing.leadPhone || viewing.leadWhatsappNumber) && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Contact Details</div>
                      <div className="flex gap-3 flex-wrap">
                        {viewing.leadEmail && (
                          <a 
                            href={`mailto:${viewing.leadEmail}`}
                            className="flex items-center gap-1.5 text-sm hover-elevate px-2 py-1 rounded-md"
                            data-testid={`link-email-${viewing.id}`}
                          >
                            <Mail className="h-4 w-4" />
                            {viewing.leadEmail}
                          </a>
                        )}
                        {viewing.leadPhone && (
                          <a 
                            href={`tel:${viewing.leadPhone}`}
                            className="flex items-center gap-1.5 text-sm hover-elevate px-2 py-1 rounded-md"
                            data-testid={`link-phone-${viewing.id}`}
                          >
                            <Phone className="h-4 w-4" />
                            {viewing.leadPhone}
                          </a>
                        )}
                        {viewing.leadWhatsappNumber && (
                          <a 
                            href={`https://wa.me/${viewing.leadWhatsappNumber.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm hover-elevate px-2 py-1 rounded-md"
                            data-testid={`link-whatsapp-${viewing.id}`}
                          >
                            <MessageSquare className="h-4 w-4" />
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Student Details */}
                  {(viewing.leadUniversityName || viewing.leadCourseName) && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Student Details</div>
                      <div className="flex gap-3 flex-wrap">
                        {viewing.leadUniversityName && (
                          <div className="flex items-center gap-1.5 text-sm" data-testid={`text-university-${viewing.id}`}>
                            <GraduationCap className="h-4 w-4" />
                            {viewing.leadUniversityName}
                          </div>
                        )}
                        {viewing.leadCourseName && (
                          <div className="flex items-center gap-1.5 text-sm" data-testid={`text-course-${viewing.id}`}>
                            <BookOpen className="h-4 w-4" />
                            {viewing.leadCourseName}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags and Source */}
                  <div className="flex gap-2 flex-wrap">
                    {viewing.leadSource && (
                      <Badge variant="outline" data-testid={`badge-source-${viewing.id}`}>
                        {viewing.leadSource}
                      </Badge>
                    )}
                    {viewing.leadTags && viewing.leadTags.length > 0 && viewing.leadTags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary" data-testid={`badge-tag-${viewing.id}-${idx}`}>
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Notes */}
                  {viewing.leadNotes && (
                    <div className="text-sm text-muted-foreground border-l-2 border-muted pl-3" data-testid={`text-notes-${viewing.id}`}>
                      {viewing.leadNotes}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap pt-2">
                    {viewing.status === 'scheduled' && (
                      <>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => {
                            setSelectedViewing(viewing);
                            setOutcomeDialogOpen(true);
                          }}
                          data-testid={`button-record-outcome-${viewing.id}`}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Record Outcome
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateViewingMutation.mutate({
                            id: viewing.id,
                            updates: { status: 'cancelled' }
                          })}
                          data-testid={`button-cancel-${viewing.id}`}
                        >
                          Cancel
                        </Button>
                        {viewing.googleMeetLink && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            asChild
                            data-testid={`button-join-video-${viewing.id}`}
                          >
                            <a href={viewing.googleMeetLink} target="_blank" rel="noopener noreferrer">
                              <Video className="h-4 w-4 mr-2" />
                              Join Video Call
                            </a>
                          </Button>
                        )}
                      </>
                    )}
                    
                    {viewing.status === 'completed' && viewing.outcome && (
                      <Badge variant="secondary" data-testid={`badge-outcome-${viewing.id}`}>
                        {viewing.outcome === 'interested' && '✓ Interested'}
                        {viewing.outcome === 'needs_time' && '⏱ Needs Time'}
                        {viewing.outcome === 'not_interested' && '✗ Not Interested'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Viewing Outcome Dialog */}
      {selectedViewing && (
        <ViewingOutcomeDialog
          viewing={selectedViewing}
          open={outcomeDialogOpen}
          onOpenChange={setOutcomeDialogOpen}
        />
      )}
    </div>
  );
}
