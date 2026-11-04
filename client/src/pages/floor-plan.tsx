import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Video, 
  Calendar, 
  PoundSterling, 
  Maximize2, 
  Play,
  Wifi,
  Bath,
  Utensils,
  Tv,
  Bed,
  DoorOpen,
  Ruler,
  CalendarCheck,
  Users,
  MessageCircle,
  X
} from "lucide-react";
import { ViewingBookingDialog } from "@/components/ViewingBookingDialog";
import { DepositPaymentDialog } from "@/components/DepositPaymentDialog";
import { InteractiveFloorPlan } from "@/components/InteractiveFloorPlan";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

// Helper function to get icon for room features
const getFeatureIcon = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  
  if (lowerFeature.includes('wifi') || lowerFeature.includes('internet')) return Wifi;
  if (lowerFeature.includes('ensuite') || lowerFeature.includes('bath') || lowerFeature.includes('shower')) return Bath;
  if (lowerFeature.includes('kitchen') || lowerFeature.includes('cooking')) return Utensils;
  if (lowerFeature.includes('tv') || lowerFeature.includes('television')) return Tv;
  if (lowerFeature.includes('bed') || lowerFeature.includes('bedroom')) return Bed;
  if (lowerFeature.includes('door') || lowerFeature.includes('private')) return DoorOpen;
  
  return null; // Return null for features without specific icons
};

export default function FloorPlan() {
  const params = useParams();
  const propertyId = params.id;
  const { user, isAuthenticated } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [roomDetailsOpen, setRoomDetailsOpen] = useState(false);
  const [viewingDialogOpen, setViewingDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [fullScreenVideo, setFullScreenVideo] = useState<string | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: [`/api/properties/${propertyId}`],
  });

  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: [`/api/properties/${propertyId}/rooms`],
  });

  if (propertyLoading || roomsLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const roomStatusColors: Record<string, string> = {
    available: "bg-green-500/20 border-green-500/40",
    reserved: "bg-yellow-500/20 border-yellow-500/40",
    occupied: "bg-gray-500/20 border-gray-500/40",
  };

  const handleBookViewing = (room: any) => {
    setSelectedRoom(room);
    setViewingDialogOpen(true);
  };

  const handlePayDeposit = (room: any) => {
    setSelectedRoom(room);
    setDepositDialogOpen(true);
  };

  const handleFullScreenVideo = (videoUrl: string) => {
    setFullScreenVideo(videoUrl);
  };

  const formatRoomType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const calculateAcademicYearTotal = (weeklyRent: string | number) => {
    const rent = typeof weeklyRent === 'string' ? parseFloat(weeklyRent) : weeklyRent;
    return (rent * 52).toFixed(2);
  };

  const createWhatsAppLink = (room: any) => {
    // Default landlord phone number - in production this would come from property/landlord data
    const phoneNumber = '447000000000'; // UK format without +
    const message = `Hi, I'm interested in Room ${room.roomNumber} at ${property?.name}. Can you tell me more about availability?`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Button variant="ghost" asChild className="mb-4" data-testid="button-back">
            <Link href="/properties">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-floorplan-title">
            {property?.name} - Interactive Floor Plan
          </h1>
          <p className="text-muted-foreground mt-2">
            Hover over rooms to see videos and details. Click quick actions to book or pay deposit.
          </p>
        </div>
      </div>

      {/* Floor Plan Visualization */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Floor Plan */}
        <div className="lg:col-span-3">
          {property?.floorPlanData?.zones && property.floorPlanData.zones.length > 0 ? (
            <InteractiveFloorPlan
              floorPlanUrl={property.floorPlanUrl}
              zones={property.floorPlanData.zones}
              rooms={rooms || []}
              onRoomClick={(room) => {
                setSelectedRoom(room);
                setRoomDetailsOpen(true);
              }}
              showLabels={true}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Floor Plan</CardTitle>
                <CardDescription>
                  {property?.floorPlanUrl 
                    ? "Interactive zones not configured yet. Contact the landlord to set up room hotspots."
                    : "No floor plan uploaded yet"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Display uploaded floor plan if available */}
                {property?.floorPlanUrl && (
                  <div className="mb-6">
                    <img 
                      src={property.floorPlanUrl} 
                      alt={`${property.name} Floor Plan`}
                      className="w-full h-auto rounded-lg border"
                      data-testid="img-floor-plan"
                    />
                  </div>
                )}
                
                {/* Grid-based room layout (fallback when no zones) */}
                <div className="relative">
                  <h3 className="text-lg font-semibold mb-4">Room Overview</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {rooms?.map((room: any) => {
                      const isHovered = hoveredRoom === room.id;
                      
                      return (
                        <HoverCard key={room.id} openDelay={200} closeDelay={100}>
                          <HoverCardTrigger asChild>
                            <div
                              className={`
                                relative p-6 rounded-lg border-2 transition-all cursor-pointer
                                ${roomStatusColors[room.status] || roomStatusColors.available}
                                ${isHovered ? 'ring-2 ring-primary scale-105 z-10' : 'hover:scale-102'}
                              `}
                              onMouseEnter={() => setHoveredRoom(room.id)}
                              onMouseLeave={() => setHoveredRoom(null)}
                              data-testid={`room-zone-${room.id}`}
                            >
                              <div className="text-left">
                                <div className="font-semibold text-lg mb-1" data-testid={`text-room-number-${room.id}`}>
                                  {room.roomNumber}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {formatRoomType(room.roomType)}
                                </div>
                                <div className="text-sm font-bold mt-2">
                                  £{room.rentPerWeek}/week
                                </div>
                                <Badge 
                                  variant="secondary" 
                                  className="mt-2"
                                  data-testid={`badge-status-${room.id}`}
                                >
                                  {room.status}
                                </Badge>
                              </div>
                              
                              {/* Video indicator */}
                              {room.videoUrls && room.videoUrls.length > 0 && (
                                <div className="absolute top-2 right-2">
                                  <div className="bg-primary/90 text-primary-foreground rounded-full p-1.5">
                                    <Play className="h-3 w-3" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </HoverCardTrigger>
                          
                          <HoverCardContent 
                            className="w-96" 
                            side="right" 
                            align="start"
                            data-testid={`hover-card-${room.id}`}
                          >
                            <div className="space-y-4">
                              {/* Room Header */}
                              <div>
                                <h3 className="font-semibold text-lg">
                                  Room {room.roomNumber}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {formatRoomType(room.roomType)}
                                </p>
                              </div>

                              {/* Video Preview */}
                              {room.videoUrls && room.videoUrls.length > 0 && (
                                <div className="relative">
                                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                                    {room.videoUrls[0].includes('drive.google.com') ? (
                                      <iframe 
                                        src={room.videoUrls[0]} 
                                        className="w-full h-full"
                                        title="Room Video"
                                        allow="autoplay"
                                        data-testid={`video-preview-${room.id}`}
                                      />
                                    ) : (
                                      <video 
                                        src={room.videoUrls[0]} 
                                        autoPlay 
                                        muted 
                                        loop
                                        className="w-full h-full object-cover"
                                        data-testid={`video-preview-${room.id}`}
                                      />
                                    )}
                                  </div>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => handleFullScreenVideo(room.videoUrls[0])}
                                    data-testid={`button-fullscreen-${room.id}`}
                                  >
                                    <Maximize2 className="h-3 w-3 mr-1" />
                                    Full Screen
                                  </Button>
                                </div>
                              )}

                              {/* Room Details */}
                              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                                <div>
                                  <p className="text-sm text-muted-foreground">Weekly Rent</p>
                                  <p className="font-semibold">£{room.rentPerWeek}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Deposit</p>
                                  <p className="font-semibold">£{room.depositAmount}</p>
                                </div>
                              </div>

                              {/* Features */}
                              {room.features && room.features.length > 0 && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">Features</p>
                                  <div className="flex flex-wrap gap-1">
                                    {room.features.slice(0, 4).map((feature: string, idx: number) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {feature.replace(/_/g, ' ')}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Quick Action Buttons */}
                              <div className="flex gap-2 pt-3 border-t">
                                <Button 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => handleBookViewing(room)}
                                  data-testid={`button-book-viewing-${room.id}`}
                                >
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Book Viewing
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => handlePayDeposit(room)}
                                  data-testid={`button-pay-deposit-${room.id}`}
                                >
                                  <PoundSterling className="h-3 w-3 mr-1" />
                                  Pay Deposit
                                </Button>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Legend & Info Sidebar */}
        <div className="space-y-4">
          {/* Room Status Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Room Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500/30 border-2 border-green-500/50" />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500/30 border-2 border-yellow-500/50" />
                <span className="text-sm">Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-500/30 border-2 border-gray-500/50" />
                <span className="text-sm">Occupied</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Guide */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                  <Play className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium">Video indicator</p>
                  <p className="text-xs text-muted-foreground">Room has video tour</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground space-y-1 pt-2">
                <p>• Hover over rooms to see details</p>
                <p>• Videos autoplay on hover</p>
                <p>• Click buttons to book or pay</p>
              </div>
            </CardContent>
          </Card>

          {/* Room Types */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Room Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from(new Set(rooms?.map((r: any) => r.roomType) || [])).map((type: any) => (
                <div key={type} className="text-sm">
                  <span className="font-medium">{formatRoomType(type)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Screen Video Dialog */}
      {fullScreenVideo && (
        <Dialog open={!!fullScreenVideo} onOpenChange={() => setFullScreenVideo(null)}>
          <DialogContent className="max-w-6xl p-0" data-testid="dialog-fullscreen-video">
            <div className="aspect-video bg-black">
              {fullScreenVideo.includes('drive.google.com') ? (
                <iframe 
                  src={fullScreenVideo} 
                  className="w-full h-full"
                  title="Full Screen Video"
                  allowFullScreen
                  allow="autoplay; fullscreen"
                  data-testid="video-fullscreen"
                />
              ) : (
                <video 
                  src={fullScreenVideo} 
                  controls 
                  autoPlay
                  className="w-full h-full"
                  data-testid="video-fullscreen"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Viewing Booking Dialog */}
      {selectedRoom && (
        <ViewingBookingDialog
          room={selectedRoom}
          property={{ id: property?.id, name: property?.name }}
          open={viewingDialogOpen}
          onOpenChange={setViewingDialogOpen}
          onSuccess={() => {
            setViewingDialogOpen(false);
            setSelectedRoom(null);
          }}
        />
      )}

      {/* Deposit Payment Dialog */}
      {selectedRoom && (
        <DepositPaymentDialog
          room={{
            id: selectedRoom.id,
            name: selectedRoom.roomNumber,
            depositAmount: parseFloat(selectedRoom.depositAmount),
          }}
          property={{ id: property?.id, name: property?.name }}
          leadId="" 
          open={depositDialogOpen}
          onOpenChange={setDepositDialogOpen}
          onSuccess={() => {
            setDepositDialogOpen(false);
            setSelectedRoom(null);
          }}
        />
      )}

      {/* Enhanced Room Details Dialog (from Interactive Floor Plan) */}
      {selectedRoom && (
        <Dialog open={roomDetailsOpen} onOpenChange={setRoomDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0" data-testid="dialog-room-details">
            <DialogHeader className="px-6 pt-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <DialogTitle className="text-3xl font-bold">Room {selectedRoom.roomNumber}</DialogTitle>
                  <p className="text-muted-foreground mt-2">
                    {formatRoomType(selectedRoom.roomType)}
                  </p>
                </div>
                <Badge 
                  variant={selectedRoom.status === "available" ? "default" : "secondary"}
                  className="text-sm"
                  data-testid={`badge-status-modal-${selectedRoom.id}`}
                >
                  {selectedRoom.status}
                </Badge>
              </div>
            </DialogHeader>

            <ScrollArea className="max-h-[calc(90vh-8rem)]">
              <div className="px-6 pb-6 space-y-6">
                {/* Video Tour Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Tour
                  </h3>
                  {selectedRoom.videoUrls && selectedRoom.videoUrls.length > 0 ? (
                    <div className="relative">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                        {selectedRoom.videoUrls[0].includes('drive.google.com') ? (
                          <iframe 
                            src={selectedRoom.videoUrls[0]} 
                            className="w-full h-full"
                            title="Room Video Tour"
                            allow="autoplay; fullscreen"
                            data-testid="video-room-details"
                          />
                        ) : (
                          <video 
                            src={selectedRoom.videoUrls[0]} 
                            controls
                            className="w-full h-full object-cover"
                            data-testid="video-room-details"
                          />
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-3 right-3 backdrop-blur-sm bg-background/80"
                        onClick={() => handleFullScreenVideo(selectedRoom.videoUrls[0])}
                        data-testid="button-fullscreen-modal"
                      >
                        <Maximize2 className="h-4 w-4 mr-2" />
                        Full Screen
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
                      <div className="text-center space-y-2">
                        <Video className="h-12 w-12 mx-auto text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">No video tour available</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Pricing Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <PoundSterling className="h-5 w-5" />
                    Pricing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3 gap-1">
                        <CardTitle className="text-sm text-muted-foreground">Weekly Rent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold" data-testid="text-weekly-rent">
                          £{selectedRoom.rentPerWeek}<span className="text-base text-muted-foreground font-normal">/week</span>
                        </p>
                        {selectedRoom.isDualOccupancy && selectedRoom.rentPerWeekDual && (
                          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            or £{selectedRoom.rentPerWeekDual}/week per person for dual occupancy
                          </p>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3 gap-1">
                        <CardTitle className="text-sm text-muted-foreground">Deposit</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold" data-testid="text-deposit">
                          £{selectedRoom.depositAmount}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          One-time payment
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3 gap-1">
                        <CardTitle className="text-sm text-muted-foreground">Academic Year Total (52 weeks)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold" data-testid="text-academic-total">
                          £{calculateAcademicYearTotal(selectedRoom.rentPerWeek)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          £{selectedRoom.rentPerWeek} × 52 weeks
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Room Details Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <DoorOpen className="h-5 w-5" />
                    Room Details
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedRoom.size && (
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <Ruler className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Size</p>
                          <p className="font-semibold" data-testid="text-room-size">
                            {selectedRoom.size}m²
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <Bed className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Room Type</p>
                        <p className="font-semibold" data-testid="text-room-type-detail">
                          {formatRoomType(selectedRoom.roomType)}
                        </p>
                      </div>
                    </div>

                    {selectedRoom.availableFrom && (
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <CalendarCheck className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Available From</p>
                          <p className="font-semibold" data-testid="text-available-from">
                            {format(new Date(selectedRoom.availableFrom), 'dd MMM yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features Section */}
                {selectedRoom.features && selectedRoom.features.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Features & Amenities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedRoom.features.map((feature: string, idx: number) => {
                          const IconComponent = getFeatureIcon(feature);
                          return (
                            <div 
                              key={idx} 
                              className="flex items-center gap-3 p-3 border rounded-lg"
                              data-testid={`feature-${idx}`}
                            >
                              {IconComponent ? (
                                <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                              ) : (
                                <div className="h-5 w-5 rounded-full bg-primary/20 flex-shrink-0" />
                              )}
                              <span className="font-medium capitalize">
                                {feature.replace(/_/g, ' ')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Action Buttons - Only show for unauthenticated users */}
                {!isAuthenticated && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Interested?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button 
                          size="lg"
                          variant="default"
                          className="w-full"
                          asChild
                          data-testid="button-whatsapp-viewing"
                        >
                          <a href={createWhatsAppLink(selectedRoom)} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Book a Viewing
                          </a>
                        </Button>
                        <Button 
                          size="lg"
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setRoomDetailsOpen(false);
                            setDepositDialogOpen(true);
                          }}
                          data-testid="button-reserve-deposit"
                        >
                          <PoundSterling className="h-5 w-5 mr-2" />
                          Reserve with Deposit
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 text-center">
                        Secure your room today. Questions? Contact us via WhatsApp.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
