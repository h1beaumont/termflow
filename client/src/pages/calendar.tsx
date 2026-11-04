import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Home, User, DoorOpen, DoorClosed, Upload, FileText, Shield, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEOHead } from "@/components/SEOHead";

interface Tenancy {
  leadId: string;
  tenantName: string;
  roomNumber: string;
  moveInDate: string | null;
  moveOutDate: string | null;
  roomId: string | null;
  propertyId: string;
  propertyName: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
}

interface ViewingPreferences {
  autoRetentionEnabled: boolean;
}

interface ExtractedContractData {
  tenantName: string | null;
  propertyAddress: string | null;
  roomNumber: string | null;
  startDate: string | null;
  endDate: string | null;
  weeklyRent: number | null;
  depositAmount: number | null;
  contractLengthWeeks: number | null;
  propertyMatched?: string | null;
  roomMatched?: string | null;
}

interface UploadResponse {
  success: boolean;
  extractedData: ExtractedContractData;
  leadId: string;
  message: string;
}

export default function Calendar() {
  const { toast } = useToast();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [uploadedData, setUploadedData] = useState<ExtractedContractData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch properties
  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Fetch tenancies
  const { data: tenancies, isLoading: tenanciesLoading } = useQuery<Tenancy[]>({
    queryKey: ["/api/calendar/tenancies", selectedPropertyId],
    queryFn: async () => {
      const url = selectedPropertyId === "all" 
        ? "/api/calendar/tenancies" 
        : `/api/calendar/tenancies?propertyId=${selectedPropertyId}`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch tenancies");
      return response.json();
    },
  });

  // Fetch viewing preferences for auto-retention toggle
  const { data: preferences } = useQuery<ViewingPreferences>({
    queryKey: ["/api/viewing-preferences"],
  });

  // Update auto-retention setting
  const updateSettingsMutation = useMutation({
    mutationFn: async (autoRetentionEnabled: boolean) => {
      return apiRequest("/api/calendar/settings", {
        method: "PUT",
        body: JSON.stringify({ autoRetentionEnabled }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/viewing-preferences"] });
    },
  });

  // Upload contract mutation
  const uploadContractMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/tenancy-calendar/upload-contract', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload contract');
      }

      return response.json() as Promise<UploadResponse>;
    },
    onSuccess: (data) => {
      setUploadedData(data.extractedData);
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/tenancies"] });
      toast({
        title: "Contract processed successfully!",
        description: data.message,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size must be less than 10MB",
      });
      return;
    }

    uploadContractMutation.mutate(file);
  };

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    if (!tenancies) return [];

    return tenancies.filter(tenancy => {
      const moveIn = tenancy.moveInDate ? new Date(tenancy.moveInDate) : null;
      const moveOut = tenancy.moveOutDate ? new Date(tenancy.moveOutDate) : null;

      return (
        (moveIn && isSameDay(moveIn, day)) ||
        (moveOut && isSameDay(moveOut, day))
      );
    });
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  if (propertiesLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <SEOHead
        title="Tenancy Calendar - TermFlow | Move-in Schedule"
        description="Visualize all tenancy move-ins and move-outs across your student properties. Plan occupancy and manage turnover efficiently with calendar view."
      />
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-calendar-title">
            Tenancy Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            Track move-ins and move-outs across your properties
          </p>
        </div>
        
        {/* Property Filter */}
        {!propertiesLoading && properties && properties.length > 1 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedPropertyId}
                onValueChange={setSelectedPropertyId}
              >
                <SelectTrigger className="w-64" data-testid="select-property-filter">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties?.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Upload Existing Contract Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Existing Contracts
              </CardTitle>
              <CardDescription className="mt-2">
                Upload existing tenancy agreements to automatically populate your calendar
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-500/10">
              <Shield className="h-3 w-3 mr-1" />
              Files deleted after processing
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Data Protection:</strong> Files are processed immediately and never stored on our servers. 
              Your contracts are deleted right after extraction for maximum security.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="contract-upload"
                data-testid="input-contract-file"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadContractMutation.isPending}
                data-testid="button-upload-contract"
              >
                {uploadContractMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing contract...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Choose Contract (PDF)
                  </>
                )}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Max file size: 50MB
            </div>
          </div>

          {/* Extraction Success Preview */}
          {uploadedData && (
            <Alert className="bg-green-500/10 border-green-500/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-400">
                    Contract processed successfully!
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {uploadedData.tenantName && (
                      <div>
                        <span className="text-muted-foreground">Tenant:</span>{" "}
                        <span className="font-medium">{uploadedData.tenantName}</span>
                      </div>
                    )}
                    {uploadedData.propertyMatched && (
                      <div>
                        <span className="text-muted-foreground">Property:</span>{" "}
                        <span className="font-medium">{uploadedData.propertyMatched}</span>
                      </div>
                    )}
                    {uploadedData.roomMatched && (
                      <div>
                        <span className="text-muted-foreground">Room:</span>{" "}
                        <span className="font-medium">{uploadedData.roomMatched}</span>
                      </div>
                    )}
                    {uploadedData.startDate && uploadedData.endDate && (
                      <div>
                        <span className="text-muted-foreground">Period:</span>{" "}
                        <span className="font-medium">
                          {format(new Date(uploadedData.startDate), 'MMM yyyy')} - {format(new Date(uploadedData.endDate), 'MMM yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedData(null)}
                    className="mt-2"
                  >
                    Dismiss
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Auto-Retention Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Auto-Retention Messaging</CardTitle>
          <CardDescription>
            Automatically contact tenants on their checkout day to offer room renewal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <Label htmlFor="auto-retention" className="text-sm font-medium">
                Auto-contact tenants on checkout day
              </Label>
              <p className="text-sm text-muted-foreground">
                Sends WhatsApp message: "Hi [Name], your tenancy at [Room] ends today. Want to secure the same room for next year? Reply YES to rebook instantly!"
              </p>
            </div>
            <Switch
              id="auto-retention"
              checked={preferences?.autoRetentionEnabled || false}
              onCheckedChange={(checked) => updateSettingsMutation.mutate(checked)}
              disabled={updateSettingsMutation.isPending}
              data-testid="toggle-auto-retention"
            />
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Move-in Date</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <span className="text-sm text-muted-foreground">Move-out Date</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {format(currentMonth, "MMMM yyyy")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevMonth}
                data-testid="button-prev-month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                data-testid="button-next-month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tenanciesLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-24 border rounded-md bg-muted/30" />
              ))}

              {/* Calendar days */}
              {daysInMonth.map((day) => {
                const events = getEventsForDay(day);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={day.toString()}
                    className={`min-h-24 border rounded-md p-2 ${
                      !isSameMonth(day, currentMonth)
                        ? "bg-muted/30 text-muted-foreground"
                        : "bg-background"
                    } ${isToday ? "ring-2 ring-primary" : ""}`}
                    data-testid={`calendar-day-${format(day, "yyyy-MM-dd")}`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {events.map((event, idx) => {
                        const isMoveIn = event.moveInDate && isSameDay(new Date(event.moveInDate), day);
                        const isMoveOut = event.moveOutDate && isSameDay(new Date(event.moveOutDate), day);

                        return (
                          <HoverCard key={`${event.leadId}-${idx}`}>
                            <HoverCardTrigger asChild>
                              <div
                                className={`text-xs p-1 rounded cursor-pointer ${
                                  isMoveIn
                                    ? "bg-green-500/20 text-green-700 dark:text-green-300"
                                    : "bg-orange-500/20 text-orange-700 dark:text-orange-300"
                                }`}
                                data-testid={`event-${event.leadId}`}
                              >
                                <div className="flex items-center gap-1 truncate">
                                  {isMoveIn ? (
                                    <DoorOpen className="h-3 w-3 flex-shrink-0" />
                                  ) : (
                                    <DoorClosed className="h-3 w-3 flex-shrink-0" />
                                  )}
                                  <span className="truncate">{event.tenantName}</span>
                                </div>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <p className="font-semibold">{event.tenantName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {event.propertyName} - Room {event.roomNumber}
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-2 pt-2 border-t">
                                  {event.moveInDate && (
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="bg-green-500/10">
                                        <DoorOpen className="h-3 w-3 mr-1" />
                                        Move-in
                                      </Badge>
                                      <span className="text-sm">
                                        {format(new Date(event.moveInDate), "PPP")}
                                      </span>
                                    </div>
                                  )}
                                  {event.moveOutDate && (
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="bg-orange-500/10">
                                        <DoorClosed className="h-3 w-3 mr-1" />
                                        Move-out
                                      </Badge>
                                      <span className="text-sm">
                                        {format(new Date(event.moveOutDate), "PPP")}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Empty State */}
      {!tenanciesLoading && tenancies?.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="font-semibold text-lg">No Tenancies Found</h3>
              <p className="text-muted-foreground">
                {selectedPropertyId === "all"
                  ? "There are no confirmed tenancies across your properties yet."
                  : "There are no confirmed tenancies for this property yet."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
