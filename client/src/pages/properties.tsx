// Properties Management - View and manage all properties
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, BedDouble, MapPin, Upload, Pencil, ImageIcon, Loader2, MousePointerClick, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ObjectUploader } from "@/components/ObjectUploader";
import { FloorPlanEditor } from "@/components/FloorPlanEditor";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import type { UploadResult } from "@uppy/core";

export default function Properties() {
  const { toast } = useToast();
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [hotspotEditingProperty, setHotspotEditingProperty] = useState<any>(null);
  const [floorPlanUrl, setFloorPlanUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { data: properties, isLoading } = useQuery({
    queryKey: ['/api/properties'],
  });

  // Fetch rooms for hotspot editor
  const { data: hotspotRooms, isLoading: hotspotRoomsLoading } = useQuery({
    queryKey: [`/api/properties/${hotspotEditingProperty?.id}/rooms`],
    enabled: !!hotspotEditingProperty?.id,
  });

  const updateFloorPlanMutation = useMutation({
    mutationFn: async ({ propertyId, floorPlanUrl }: { propertyId: string; floorPlanUrl: string }) => {
      return await apiRequest('PATCH', `/api/properties/${propertyId}`, { floorPlanUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Floor plan updated",
        description: "Property floor plan has been updated successfully",
      });
      setEditingProperty(null);
      setFloorPlanUrl("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update floor plan",
      });
    },
  });

  const handleGetUploadUrl = async () => {
    const res = await fetch("/api/objects/upload", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    return { method: "PUT" as const, url: data.uploadURL };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    const uploadUrl = result.successful[0]?.uploadURL;
    if (!uploadUrl) return;

    setIsUploading(true);
    try {
      const res = await fetch("/api/property-images", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageURL: uploadUrl }),
      });
      const data = await res.json();
      setFloorPlanUrl(data.objectPath);
      toast({
        title: "Floor plan uploaded",
        description: "Floor plan has been uploaded successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to process uploaded image",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditFloorPlan = (property: any) => {
    setEditingProperty(property);
    setFloorPlanUrl(property.floorPlanUrl || "");
  };

  const handleSaveFloorPlan = () => {
    if (!editingProperty) return;
    updateFloorPlanMutation.mutate({
      propertyId: editingProperty.id,
      floorPlanUrl,
    });
  };

  const updateFloorPlanDataMutation = useMutation({
    mutationFn: async ({ propertyId, floorPlanData }: { propertyId: string; floorPlanData: any }) => {
      return await apiRequest('PATCH', `/api/properties/${propertyId}`, { floorPlanData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Hotspots saved",
        description: "Floor plan hotspots have been saved successfully",
      });
      setHotspotEditingProperty(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "Failed to save hotspots",
      });
    },
  });

  const handleEditHotspots = (property: any) => {
    if (!property.floorPlanUrl) {
      toast({
        variant: "destructive",
        title: "No floor plan",
        description: "Please upload a floor plan before creating hotspots",
      });
      return;
    }
    setHotspotEditingProperty(property);
  };

  const handleSaveZones = (zones: any[]) => {
    if (!hotspotEditingProperty) return;
    updateFloorPlanDataMutation.mutate({
      propertyId: hotspotEditingProperty.id,
      floorPlanData: { zones },
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-properties-title">Properties</h1>
          <p className="text-muted-foreground mt-2">Manage your student accommodation portfolio</p>
        </div>
        <Button asChild data-testid="button-add-property">
          <Link href="/properties/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Properties Grid */}
      {!properties || properties.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No properties yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get started by adding your first property
              </p>
            </div>
            <Button data-testid="button-add-first-property">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Property
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property: any) => (
            <Card key={property.id} className="hover-elevate overflow-hidden" data-testid={`card-property-${property.id}`}>
              {property.heroImageUrl ? (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img 
                    src={property.heroImageUrl} 
                    alt={property.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl truncate" data-testid={`text-property-name-${property.id}`}>
                      {property.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {property.city}
                    </CardDescription>
                  </div>
                  <Badge variant={property.isActive ? "default" : "secondary"} data-testid={`badge-status-${property.id}`}>
                    {property.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BedDouble className="h-4 w-4" />
                    <span>{property.totalBedrooms} bedrooms</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => handleEditFloorPlan(property)}
                  data-testid={`button-edit-floorplan-${property.id}`}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Upload Floor Plan
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => handleEditHotspots(property)}
                  data-testid={`button-edit-hotspots-${property.id}`}
                >
                  <MousePointerClick className="h-4 w-4 mr-2" />
                  Edit Hotspots
                </Button>
                <Button variant="outline" className="flex-1" asChild data-testid={`button-view-floorplan-${property.id}`}>
                  <Link href={`/properties/${property.id}/floor-plan`}>View Floor Plan</Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild data-testid={`button-room-analytics-${property.id}`}>
                  <Link href={`/properties/${property.id}/room-analytics`}>
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Room Analytics
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Floor Plan Upload Dialog */}
      <Dialog open={!!editingProperty} onOpenChange={(open) => !open && setEditingProperty(null)}>
        <DialogContent className="max-w-2xl" data-testid="dialog-floor-plan-upload">
          <DialogHeader>
            <DialogTitle>Edit Floor Plan - {editingProperty?.name}</DialogTitle>
            <DialogDescription>
              Upload a floor plan image for this property (PNG, JPG, or SVG)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Floor Plan Display */}
            {floorPlanUrl && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Floor Plan</label>
                <div className="relative border rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={floorPlanUrl} 
                    alt="Floor Plan" 
                    className="w-full h-auto max-h-96 object-contain"
                    data-testid="img-current-floor-plan"
                  />
                </div>
              </div>
            )}

            {!floorPlanUrl && (
              <div className="border-2 border-dashed rounded-lg p-12 text-center bg-muted/20">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No floor plan uploaded yet</p>
              </div>
            )}

            {/* Upload Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Upload New Floor Plan</label>
              <div className="flex items-center gap-3">
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={52428800}
                  onGetUploadParameters={handleGetUploadUrl}
                  onComplete={handleUploadComplete}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {floorPlanUrl ? "Replace Floor Plan" : "Upload Floor Plan"}
                </ObjectUploader>
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: PNG, JPG, SVG (Max 50MB)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleSaveFloorPlan}
                disabled={!floorPlanUrl || updateFloorPlanMutation.isPending}
                data-testid="button-save-floor-plan"
              >
                {updateFloorPlanMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Floor Plan"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingProperty(null)}
                disabled={updateFloorPlanMutation.isPending}
                data-testid="button-cancel-floor-plan"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hotspot Editor Dialog */}
      <Dialog open={!!hotspotEditingProperty} onOpenChange={(open) => !open && setHotspotEditingProperty(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto" data-testid="dialog-hotspot-editor">
          <DialogHeader>
            <DialogTitle>Edit Floor Plan Hotspots - {hotspotEditingProperty?.name}</DialogTitle>
            <DialogDescription>
              Draw zones over rooms and assign them to create interactive hotspots
            </DialogDescription>
          </DialogHeader>

          {hotspotRoomsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !hotspotRooms || hotspotRooms.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <p>No rooms found for this property. Please add rooms first.</p>
            </div>
          ) : hotspotEditingProperty?.floorPlanUrl ? (
            <FloorPlanEditor
              floorPlanUrl={hotspotEditingProperty.floorPlanUrl}
              rooms={hotspotRooms}
              existingZones={hotspotEditingProperty.floorPlanData?.zones || []}
              onSave={handleSaveZones}
              onCancel={() => setHotspotEditingProperty(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
