import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, ImageIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FloorPlanEditor } from "./FloorPlanEditor";

interface FloorPlanMapperProps {
  floorPlanUrl?: string;
  floorPlanFileName?: string;
  rooms: any[];
  existingZones?: any[];
  onUpload: (file: File) => Promise<void>;
  onSave: (zones: any[]) => Promise<void>;
  onSkip?: () => void;
  uploading?: boolean;
}

export function FloorPlanMapper({
  floorPlanUrl,
  floorPlanFileName,
  rooms,
  existingZones = [],
  onUpload,
  onSave,
  onSkip,
  uploading = false,
}: FloorPlanMapperProps) {
  const [saving, setSaving] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, etc.)");
      return;
    }

    await onUpload(file);
  };

  const handleSave = async (zones: any[]) => {
    setSaving(true);
    try {
      await onSave(zones);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <div className="space-y-6">
      {/* Floor Plan Upload */}
      {!floorPlanUrl ? (
        <Card>
          <CardHeader>
            <CardTitle>Interactive Floor Plan</CardTitle>
            <CardDescription>
              Upload a floor plan image to create interactive room zones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="floorplan-upload" className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Click to upload floor plan
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or other image formats</p>
                </div>
              </Label>
              <Input
                id="floorplan-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                data-testid="input-floorplan-upload"
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Interactive floor plans let tenants click on rooms to view details, book viewings, or pay deposits
              </AlertDescription>
            </Alert>

            {rooms.length === 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No rooms found. Please add rooms to your property before mapping the floor plan.
                </AlertDescription>
              </Alert>
            )}

            {onSkip && (
              <Button
                variant="outline"
                onClick={onSkip}
                className="w-full"
                data-testid="button-skip-floorplan"
              >
                Skip Floor Plan Mapping
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Floor Plan Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Map Room Zones</CardTitle>
                  <CardDescription>
                    Draw zones over rooms and assign them to create interactive hotspots
                  </CardDescription>
                </div>
                <Badge variant="default">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  {floorPlanFileName || "Floor Plan"}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Floor Plan Editor */}
          <FloorPlanEditor
            floorPlanUrl={floorPlanUrl}
            rooms={rooms}
            existingZones={existingZones}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}
