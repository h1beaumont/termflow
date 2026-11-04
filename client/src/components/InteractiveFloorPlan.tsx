import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Zone {
  id: string;
  roomId: string;
  coordinates: {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    width: number; // percentage 0-100
    height: number; // percentage 0-100
  };
}

interface InteractiveFloorPlanProps {
  floorPlanUrl: string;
  zones: Zone[];
  rooms: any[];
  onRoomClick?: (room: any) => void;
  showLabels?: boolean;
}

export function InteractiveFloorPlan({ 
  floorPlanUrl, 
  zones = [], 
  rooms, 
  onRoomClick,
  showLabels = true 
}: InteractiveFloorPlanProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imageRef.current;
    if (img && img.complete) {
      setImageDimensions({ width: img.offsetWidth, height: img.offsetHeight });
    }
  }, [floorPlanUrl]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({ width: imageRef.current.offsetWidth, height: imageRef.current.offsetHeight });
    }
  };

  const getRoomById = (roomId: string) => rooms.find(r => r.id === roomId);

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/30 border-green-500/60 hover:bg-green-500/40";
      case "reserved":
        return "bg-yellow-500/30 border-yellow-500/60 hover:bg-yellow-500/40";
      case "occupied":
        return "bg-gray-500/30 border-gray-500/60 hover:bg-gray-500/40";
      default:
        return "bg-blue-500/30 border-blue-500/60 hover:bg-blue-500/40";
    }
  };

  const handleZoneClick = (zone: Zone) => {
    const room = getRoomById(zone.roomId);
    if (room && onRoomClick) {
      onRoomClick(room);
    }
  };

  const handleZoneTouch = (zone: Zone) => {
    // For mobile: first touch highlights, second touch clicks
    if (hoveredZone === zone.id) {
      handleZoneClick(zone);
    } else {
      setHoveredZone(zone.id);
    }
  };

  const formatRoomType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!floorPlanUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interactive Floor Plan</CardTitle>
          <CardDescription>No floor plan available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">
            <p>Upload a floor plan to enable interactive room viewing</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Floor Plan</CardTitle>
        <CardDescription>
          {zones.length > 0 
            ? "Click on any room to view details and take action" 
            : "Interactive zones not configured yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative border rounded-lg overflow-hidden bg-muted/20">
          <img 
            ref={imageRef}
            src={floorPlanUrl} 
            alt="Interactive Floor Plan"
            className="w-full h-auto select-none"
            onLoad={handleImageLoad}
            draggable={false}
            data-testid="img-interactive-floorplan"
          />
          
          {/* Interactive Zones */}
          {zones.map(zone => {
            const room = getRoomById(zone.roomId);
            if (!room) return null;
            
            const isHovered = hoveredZone === zone.id;
            const statusColor = getRoomStatusColor(room.status);
            
            return (
              <div
                key={zone.id}
                className={`absolute border-2 transition-all cursor-pointer ${statusColor} ${
                  isHovered ? 'ring-2 ring-primary scale-105 z-10' : ''
                }`}
                style={{
                  left: `${zone.coordinates.x}%`,
                  top: `${zone.coordinates.y}%`,
                  width: `${zone.coordinates.width}%`,
                  height: `${zone.coordinates.height}%`,
                }}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => handleZoneClick(zone)}
                onTouchStart={() => handleZoneTouch(zone)}
                data-testid={`interactive-zone-${room.roomNumber}`}
              >
                {/* Room Label */}
                {showLabels && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="bg-background/95 px-3 py-1.5 rounded-md shadow-sm text-center">
                      <div className="font-semibold text-sm" data-testid={`label-room-${room.roomNumber}`}>
                        Room {room.roomNumber}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatRoomType(room.roomType)}
                      </div>
                      <div className="text-xs font-bold mt-1">
                        £{room.rentPerWeek}/week
                      </div>
                    </div>
                  </div>
                )}

                {/* Hover Info Popup */}
                {isHovered && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20 pointer-events-none">
                    <div className="bg-popover text-popover-foreground border rounded-lg shadow-lg p-3 min-w-[200px]">
                      <div className="space-y-1">
                        <div className="font-semibold">Room {room.roomNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatRoomType(room.roomType)}
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <span className="text-sm font-bold">
                            £{room.rentPerWeek}/week
                          </span>
                          <Badge variant={room.status === "available" ? "default" : "secondary"}>
                            {room.status}
                          </Badge>
                        </div>
                        {room.features && room.features.length > 0 && (
                          <div className="text-xs text-muted-foreground pt-1 border-t">
                            {room.features.slice(0, 3).join(", ")}
                          </div>
                        )}
                        <div className="text-xs text-primary pt-1">
                          Click for details →
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Legend */}
          {zones.length > 0 && (
            <div className="absolute bottom-4 right-4 bg-background/95 border rounded-lg p-3 space-y-2">
              <div className="text-xs font-semibold">Room Status</div>
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-green-500/60 bg-green-500/30"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-yellow-500/60 bg-yellow-500/30"></div>
                  <span>Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-gray-500/60 bg-gray-500/30"></div>
                  <span>Occupied</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Helper Text */}
        {zones.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center md:hidden">
            Tap a room to view details
          </div>
        )}
      </CardContent>
    </Card>
  );
}
