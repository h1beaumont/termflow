import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Save, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface FloorPlanEditorProps {
  floorPlanUrl: string;
  rooms: any[];
  existingZones?: Zone[];
  onSave: (zones: Zone[]) => void;
  onCancel: () => void;
}

export function FloorPlanEditor({ floorPlanUrl, rooms, existingZones = [], onSave, onCancel }: FloorPlanEditorProps) {
  const [zones, setZones] = useState<Zone[]>(existingZones);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentZone, setCurrentZone] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setIsDrawing(true);
    setCurrentZone({ startX: x, startY: y, endX: x, endY: y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentZone || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCurrentZone({ ...currentZone, endX: x, endY: y });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentZone) return;
    
    // Calculate final zone coordinates (normalize to ensure positive width/height)
    const x = Math.min(currentZone.startX, currentZone.endX);
    const y = Math.min(currentZone.startY, currentZone.endY);
    const width = Math.abs(currentZone.endX - currentZone.startX);
    const height = Math.abs(currentZone.endY - currentZone.startY);

    // Only create zone if it has meaningful size
    if (width > 2 && height > 2) {
      const newZone: Zone = {
        id: `zone-${Date.now()}`,
        roomId: "", // Will be assigned later
        coordinates: { x, y, width, height }
      };
      setZones([...zones, newZone]);
      setSelectedZoneId(newZone.id);
    }

    setIsDrawing(false);
    setCurrentZone(null);
  };

  const handleDeleteZone = (zoneId: string) => {
    setZones(zones.filter(z => z.id !== zoneId));
    if (selectedZoneId === zoneId) {
      setSelectedZoneId(null);
    }
  };

  const handleAssignRoom = (zoneId: string, roomId: string) => {
    setZones(zones.map(z => z.id === zoneId ? { ...z, roomId } : z));
  };

  const handleSave = () => {
    // Validate all zones have rooms assigned
    const unassigned = zones.filter(z => !z.roomId);
    if (unassigned.length > 0) {
      alert("Please assign rooms to all zones before saving");
      return;
    }
    onSave(zones);
  };

  const getRoomById = (roomId: string) => rooms.find(r => r.id === roomId);

  const formatRoomDisplay = (room: any) => {
    if (!room) return "Unassigned";
    return `Room ${room.roomNumber} - ${room.roomType}`;
  };

  // Calculate current drawing zone for display
  const getDrawingZoneStyle = () => {
    if (!currentZone) return {};
    const x = Math.min(currentZone.startX, currentZone.endX);
    const y = Math.min(currentZone.startY, currentZone.endY);
    const width = Math.abs(currentZone.endX - currentZone.startX);
    const height = Math.abs(currentZone.endY - currentZone.startY);
    
    return {
      left: `${x}%`,
      top: `${y}%`,
      width: `${width}%`,
      height: `${height}%`,
    };
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Floor Plan Canvas */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Draw Room Zones</CardTitle>
            <CardDescription>
              Click and drag on the floor plan to draw rectangular zones over each room
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              ref={containerRef}
              className="relative border-2 border-dashed rounded-lg overflow-hidden cursor-crosshair bg-muted/20"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              data-testid="floorplan-canvas"
            >
              <img 
                ref={imageRef}
                src={floorPlanUrl} 
                alt="Floor Plan"
                className="w-full h-auto select-none pointer-events-none"
                onLoad={handleImageLoad}
                draggable={false}
                data-testid="img-floorplan-editor"
              />
              
              {/* Existing Zones */}
              {zones.map(zone => {
                const room = getRoomById(zone.roomId);
                const isSelected = selectedZoneId === zone.id;
                
                return (
                  <div
                    key={zone.id}
                    className={`absolute border-2 transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/20 ring-2 ring-primary' 
                        : zone.roomId 
                          ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20' 
                          : 'border-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20'
                    }`}
                    style={{
                      left: `${zone.coordinates.x}%`,
                      top: `${zone.coordinates.y}%`,
                      width: `${zone.coordinates.width}%`,
                      height: `${zone.coordinates.height}%`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedZoneId(zone.id);
                    }}
                    data-testid={`zone-${zone.id}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-semibold bg-background/90 px-2 py-1 rounded">
                        {room ? `Room ${room.roomNumber}` : "Unassigned"}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Current Drawing Zone */}
              {isDrawing && currentZone && (
                <div
                  className="absolute border-2 border-primary bg-primary/20"
                  style={getDrawingZoneStyle()}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel} data-testid="button-cancel-editor">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-zones">
            <Save className="h-4 w-4 mr-2" />
            Save Zones
          </Button>
        </div>
      </div>

      {/* Zone List & Room Assignment */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Zones ({zones.length})</CardTitle>
            <CardDescription>
              Assign rooms to each zone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {zones.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No zones yet. Draw zones on the floor plan.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {zones.map(zone => {
                    const room = getRoomById(zone.roomId);
                    const isSelected = selectedZoneId === zone.id;
                    
                    return (
                      <div 
                        key={zone.id}
                        className={`p-3 border rounded-lg space-y-2 ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                        data-testid={`zone-config-${zone.id}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant={zone.roomId ? "default" : "secondary"}>
                            Zone {zones.indexOf(zone) + 1}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteZone(zone.id)}
                            data-testid={`button-delete-zone-${zone.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Select
                          value={zone.roomId}
                          onValueChange={(roomId) => handleAssignRoom(zone.id, roomId)}
                        >
                          <SelectTrigger data-testid={`select-room-${zone.id}`}>
                            <SelectValue placeholder="Select room..." />
                          </SelectTrigger>
                          <SelectContent>
                            {rooms.map(room => (
                              <SelectItem key={room.id} value={room.id}>
                                Room {room.roomNumber} - {room.roomType}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {room && (
                          <div className="text-xs text-muted-foreground">
                            £{room.rentPerWeek}/week • {room.status}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
