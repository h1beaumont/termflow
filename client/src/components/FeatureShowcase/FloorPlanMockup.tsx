import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, User } from "lucide-react";

export function FloorPlanMockup() {
  const shouldReduceMotion = useReducedMotion();
  const rooms = [
    { id: "101", name: "Room 101", status: "available", x: 10, y: 20, width: 20, height: 15, tenant: null },
    { id: "102", name: "Room 102", status: "occupied", x: 35, y: 20, width: 20, height: 15, tenant: "Sarah Chen" },
    { id: "103", name: "Room 103", status: "reserved", x: 60, y: 20, width: 20, height: 15, tenant: "Wei Li" },
    { id: "104", name: "Studio 104", status: "available", x: 10, y: 50, width: 30, height: 25, tenant: null },
    { id: "105", name: "Studio 105", status: "occupied", x: 45, y: 50, width: 30, height: 25, tenant: "Emma Wilson" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/80 hover:bg-green-600/90 border-green-600";
      case "reserved":
        return "bg-yellow-500/80 hover:bg-yellow-600/90 border-yellow-600";
      case "occupied":
        return "bg-gray-400/80 hover:bg-gray-500/90 border-gray-500";
      default:
        return "bg-muted";
    }
  };

  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === "available").length,
    reserved: rooms.filter(r => r.status === "reserved").length,
    occupied: rooms.filter(r => r.status === "occupied").length,
  };

  return (
    <div className="space-y-6" data-testid="mockup-floor-plan">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Interactive Floor Plan</h3>
          <p className="text-sm text-muted-foreground mt-1">Visual property management - First Floor</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            Available: {stats.available}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            Reserved: {stats.reserved}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <div className="h-2 w-2 rounded-full bg-gray-500" />
            Occupied: {stats.occupied}
          </Badge>
        </div>
      </div>

      {/* Floor Plan Canvas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Stanley House - Floor 1
            </CardTitle>
            <Button variant="outline" size="sm" data-testid="button-edit-floor-plan">
              Edit Floor Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full aspect-[4/3] bg-muted/30 rounded-lg border-2 border-dashed border-border overflow-hidden">
            {/* Floor Plan Background Grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-10 grid-rows-10 h-full">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className="border border-muted-foreground" />
                ))}
              </div>
            </div>

            {/* Rooms */}
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={shouldReduceMotion ? {} : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.1 }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                className={`absolute rounded-lg border-2 cursor-pointer transition-all ${getStatusColor(room.status)} shadow-lg`}
                style={{
                  left: `${room.x}%`,
                  top: `${room.y}%`,
                  width: `${room.width}%`,
                  height: `${room.height}%`,
                }}
                data-testid={`room-${room.id}`}
              >
                <div className="h-full flex flex-col items-center justify-center p-2 text-white">
                  <p className="font-bold text-sm drop-shadow-md">{room.name}</p>
                  {room.tenant && (
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <User className="h-3 w-3" />
                      <span className="drop-shadow-md">{room.tenant}</span>
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className="mt-2 text-xs bg-white/90 text-gray-900"
                  >
                    {room.status === "available" ? "Available" : room.status === "reserved" ? "Reserved" : "Occupied"}
                  </Badge>
                </div>
              </motion.div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur rounded-lg border p-3 shadow-lg">
              <p className="text-xs font-semibold mb-2">Status Legend</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded bg-green-500 border border-green-600" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded bg-yellow-500 border border-yellow-600" />
                  <span>Reserved</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded bg-gray-400 border border-gray-500" />
                  <span>Occupied</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            Click any room to view tenant details, documents, and contract information
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
