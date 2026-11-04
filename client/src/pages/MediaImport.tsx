import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Upload, Image as ImageIcon, FileText, Trash2, Download } from "lucide-react";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { Property, Room, ContractTemplate } from "@shared/schema";
import { format } from "date-fns";

export default function MediaImport() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<'property' | 'room' | 'contracts'>('property');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [floorPlanUrl, setFloorPlanUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState('');
  const [roomImageUrls, setRoomImageUrls] = useState('');
  const [roomVideoUrls, setRoomVideoUrls] = useState('');
  const [importResults, setImportResults] = useState<any>(null);
  const [templateName, setTemplateName] = useState('');

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ['/api/properties', selectedPropertyId, 'rooms'],
    enabled: (selectedTab === 'room') && !!selectedPropertyId,
  });

  const { data: contractTemplates = [] } = useQuery<ContractTemplate[]>({
    queryKey: ['/api/landlord/contract-templates'],
    enabled: selectedTab === 'contracts',
  });

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  // URL-based import mutations
  const importPropertyImages = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', `/api/properties/${selectedPropertyId}/import-images`, data);
    },
    onSuccess: (data) => {
      setImportResults(data);
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Import Complete",
        description: `Successfully imported ${data.imported.length} images`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message,
      });
    },
  });

  const importRoomImages = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', `/api/rooms/${selectedRoomId}/import-images`, data);
    },
    onSuccess: (data) => {
      setImportResults(data);
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Import Complete",
        description: `Successfully imported ${data.imported.length} images`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message,
      });
    },
  });

  // File upload mutations
  const uploadPropertyMedia = useMutation({
    mutationFn: async ({ mediaType, fileUrl }: { mediaType: string; fileUrl: string }) => {
      return await apiRequest('POST', `/api/properties/${selectedPropertyId}/upload-media`, {
        mediaType,
        fileUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Upload Complete",
        description: "Media uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    },
  });

  const uploadRoomMedia = useMutation({
    mutationFn: async ({ mediaType, fileUrl }: { mediaType: string; fileUrl: string }) => {
      return await apiRequest('POST', `/api/rooms/${selectedRoomId}/upload-media`, {
        mediaType,
        fileUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Upload Complete",
        description: "Media uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    },
  });

  const uploadContractTemplate = useMutation({
    mutationFn: async ({ name, fileUrl }: { name: string; fileUrl: string }) => {
      return await apiRequest('POST', '/api/landlord/contract-templates', {
        name,
        fileUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landlord/contract-templates'] });
      setTemplateName('');
      toast({
        title: "Template Uploaded",
        description: "Contract template uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    },
  });

  const deleteContractTemplate = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/landlord/contract-templates/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landlord/contract-templates'] });
      toast({
        title: "Template Deleted",
        description: "Contract template deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message,
      });
    },
  });

  const handlePropertyImport = () => {
    if (!selectedPropertyId) {
      toast({
        variant: "destructive",
        title: "No Property Selected",
        description: "Please select a property first",
      });
      return;
    }

    const data: any = {};
    
    if (heroImageUrl.trim()) {
      data.heroImageUrl = heroImageUrl.trim();
    }
    
    if (floorPlanUrl.trim()) {
      data.floorPlanUrl = floorPlanUrl.trim();
    }
    
    if (galleryUrls.trim()) {
      const urls = galleryUrls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
      if (urls.length > 0) {
        data.imageUrls = urls;
      }
    }

    if (Object.keys(data).length === 0) {
      toast({
        variant: "destructive",
        title: "No URLs Provided",
        description: "Please provide at least one image URL",
      });
      return;
    }

    setImportResults(null);
    importPropertyImages.mutate(data);
  };

  const handleRoomImport = () => {
    if (!selectedRoomId) {
      toast({
        variant: "destructive",
        title: "No Room Selected",
        description: "Please select a room first",
      });
      return;
    }

    const data: any = {};
    
    if (roomImageUrls.trim()) {
      const urls = roomImageUrls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
      if (urls.length > 0) {
        data.imageUrls = urls;
      }
    }
    
    if (roomVideoUrls.trim()) {
      const urls = roomVideoUrls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
      if (urls.length > 0) {
        data.videoUrls = urls;
      }
    }

    if (Object.keys(data).length === 0) {
      toast({
        variant: "destructive",
        title: "No URLs Provided",
        description: "Please provide at least one image or video URL",
      });
      return;
    }

    setImportResults(null);
    importRoomImages.mutate(data);
  };

  const resetForm = () => {
    setHeroImageUrl('');
    setFloorPlanUrl('');
    setGalleryUrls('');
    setRoomImageUrls('');
    setRoomVideoUrls('');
    setImportResults(null);
  };

  const handleGetUploadUrl = async () => {
    const response = await apiRequest('POST', '/api/objects/upload', {});
    return {
      method: "PUT" as const,
      url: response.uploadURL,
    };
  };

  const isLoading = importPropertyImages.isPending || 
                   importRoomImages.isPending || 
                   uploadPropertyMedia.isPending ||
                   uploadRoomMedia.isPending ||
                   uploadContractTemplate.isPending;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-media-import">Media Import Tool</h1>
        <p className="text-muted-foreground mt-2">
          Import media from URLs or upload files directly to object storage
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={(v) => {
        setSelectedTab(v as 'property' | 'room' | 'contracts');
        setSelectedPropertyId('');
        setSelectedRoomId('');
        resetForm();
      }}>
        <TabsList data-testid="tabs-import-type">
          <TabsTrigger value="property" data-testid="tab-property">Property Images</TabsTrigger>
          <TabsTrigger value="room" data-testid="tab-room">Room Images</TabsTrigger>
          <TabsTrigger value="contracts" data-testid="tab-contracts">Contract Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="property" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Property Images</CardTitle>
              <CardDescription>
                Upload images or import from URLs - hero images, floor plans, and gallery images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="property-select">Select Property</Label>
                <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                  <SelectTrigger id="property-select" data-testid="select-property">
                    <SelectValue placeholder="Choose a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem 
                        key={property.id} 
                        value={property.id}
                        data-testid={`option-property-${property.id}`}
                      >
                        {property.name} - {property.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProperty && (
                <Alert>
                  <ImageIcon className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{selectedProperty.name}</strong>
                    <br />
                    Current hero image: {selectedProperty.heroImageUrl ? '✓ Set' : '✗ Not set'}
                    <br />
                    Current floor plan: {selectedProperty.floorPlanUrl ? '✓ Set' : '✗ Not set'}
                    <br />
                    Gallery images: {selectedProperty.imageUrls?.length || 0}
                  </AlertDescription>
                </Alert>
              )}

              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Hero Image</h3>
                <div className="space-y-2">
                  <Label htmlFor="hero-image">Paste URL</Label>
                  <Input
                    id="hero-image"
                    data-testid="input-hero-image"
                    placeholder="https://example.com/hero-image.jpg"
                    value={heroImageUrl}
                    onChange={(e) => setHeroImageUrl(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <ObjectUploader
                  maxNumberOfFiles={1}
                  onGetUploadParameters={handleGetUploadUrl}
                  onComplete={(result) => {
                    const uploadedUrl = result.successful[0]?.uploadURL;
                    if (uploadedUrl && selectedPropertyId) {
                      uploadPropertyMedia.mutate({ mediaType: 'hero', fileUrl: uploadedUrl });
                    }
                  }}
                  onError={(error) => {
                    toast({
                      variant: "destructive",
                      title: "Upload Error",
                      description: error.message,
                    });
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Hero Image
                </ObjectUploader>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Floor Plan</h3>
                <div className="space-y-2">
                  <Label htmlFor="floor-plan">Paste URL</Label>
                  <Input
                    id="floor-plan"
                    data-testid="input-floor-plan"
                    placeholder="https://example.com/floor-plan.jpg"
                    value={floorPlanUrl}
                    onChange={(e) => setFloorPlanUrl(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <ObjectUploader
                  maxNumberOfFiles={1}
                  onGetUploadParameters={handleGetUploadUrl}
                  onComplete={(result) => {
                    const uploadedUrl = result.successful[0]?.uploadURL;
                    if (uploadedUrl && selectedPropertyId) {
                      uploadPropertyMedia.mutate({ mediaType: 'floorPlan', fileUrl: uploadedUrl });
                    }
                  }}
                  onError={(error) => {
                    toast({
                      variant: "destructive",
                      title: "Upload Error",
                      description: error.message,
                    });
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Floor Plan
                </ObjectUploader>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Gallery Images</h3>
                <div className="space-y-2">
                  <Label htmlFor="gallery-urls">Paste URLs (one per line)</Label>
                  <Textarea
                    id="gallery-urls"
                    data-testid="textarea-gallery-urls"
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                    value={galleryUrls}
                    onChange={(e) => setGalleryUrls(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <ObjectUploader
                  maxNumberOfFiles={10}
                  onGetUploadParameters={handleGetUploadUrl}
                  onComplete={(result) => {
                    result.successful.forEach((file) => {
                      if (file.uploadURL && selectedPropertyId) {
                        uploadPropertyMedia.mutate({ mediaType: 'gallery', fileUrl: file.uploadURL });
                      }
                    });
                  }}
                  onError={(error) => {
                    toast({
                      variant: "destructive",
                      title: "Upload Error",
                      description: error.message,
                    });
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Gallery Images
                </ObjectUploader>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handlePropertyImport}
                  disabled={!selectedPropertyId || isLoading}
                  data-testid="button-import-property"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Upload className="mr-2 h-4 w-4" />
                  Import from URLs
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}
                  data-testid="button-reset"
                >
                  Clear URLs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="room" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Room Images & Videos</CardTitle>
              <CardDescription>
                Upload media or import from URLs - room photos and videos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="room-property-select">Select Property</Label>
                <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                  <SelectTrigger id="room-property-select" data-testid="select-room-property">
                    <SelectValue placeholder="Choose a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem 
                        key={property.id} 
                        value={property.id}
                        data-testid={`option-room-property-${property.id}`}
                      >
                        {property.name} - {property.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPropertyId && rooms.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="room-select">Select Room</Label>
                  <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                    <SelectTrigger id="room-select" data-testid="select-room">
                      <SelectValue placeholder="Choose a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem 
                          key={room.id} 
                          value={room.id}
                          data-testid={`option-room-${room.id}`}
                        >
                          {room.roomNumber} - {room.roomType} (£{room.rentPerWeek}/week)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Room Photos</h3>
                <div className="space-y-2">
                  <Label htmlFor="room-images">Paste URLs (one per line)</Label>
                  <Textarea
                    id="room-images"
                    data-testid="textarea-room-images"
                    placeholder="https://example.com/room-image1.jpg&#10;https://example.com/room-image2.jpg"
                    value={roomImageUrls}
                    onChange={(e) => setRoomImageUrls(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <ObjectUploader
                  maxNumberOfFiles={10}
                  onGetUploadParameters={handleGetUploadUrl}
                  onComplete={(result) => {
                    result.successful.forEach((file) => {
                      if (file.uploadURL && selectedRoomId) {
                        uploadRoomMedia.mutate({ mediaType: 'image', fileUrl: file.uploadURL });
                      }
                    });
                  }}
                  onError={(error) => {
                    toast({
                      variant: "destructive",
                      title: "Upload Error",
                      description: error.message,
                    });
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Room Photos
                </ObjectUploader>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Room Videos</h3>
                <div className="space-y-2">
                  <Label htmlFor="room-videos">Paste URLs (one per line)</Label>
                  <Textarea
                    id="room-videos"
                    data-testid="textarea-room-videos"
                    placeholder="https://example.com/room-tour.mp4&#10;https://drive.google.com/file/d/FILE_ID/view"
                    value={roomVideoUrls}
                    onChange={(e) => setRoomVideoUrls(e.target.value)}
                    rows={3}
                  />
                  <Alert>
                    <ImageIcon className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Google Drive Videos:</strong> Paste the shareable link from Google Drive. 
                      It will be automatically converted to an embed URL.
                      <br />
                      <span className="text-muted-foreground">
                        Example: https://drive.google.com/file/d/FILE_ID/view
                      </span>
                    </AlertDescription>
                  </Alert>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <ObjectUploader
                  maxNumberOfFiles={5}
                  onGetUploadParameters={handleGetUploadUrl}
                  onComplete={(result) => {
                    result.successful.forEach((file) => {
                      if (file.uploadURL && selectedRoomId) {
                        uploadRoomMedia.mutate({ mediaType: 'video', fileUrl: file.uploadURL });
                      }
                    });
                  }}
                  onError={(error) => {
                    toast({
                      variant: "destructive",
                      title: "Upload Error",
                      description: error.message,
                    });
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Room Videos
                </ObjectUploader>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleRoomImport}
                  disabled={!selectedRoomId || isLoading}
                  data-testid="button-import-room"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Upload className="mr-2 h-4 w-4" />
                  Import from URLs
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}
                  data-testid="button-reset-room"
                >
                  Clear URLs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Templates</CardTitle>
              <CardDescription>
                Upload PDF contract templates to use across your properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Upload New Template</h3>
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    data-testid="input-template-name"
                    placeholder="e.g., Standard AST Contract 2025"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
                <ObjectUploader
                  maxNumberOfFiles={1}
                  onGetUploadParameters={handleGetUploadUrl}
                  onComplete={(result) => {
                    const uploadedUrl = result.successful[0]?.uploadURL;
                    if (uploadedUrl && templateName.trim()) {
                      uploadContractTemplate.mutate({ 
                        name: templateName.trim(), 
                        fileUrl: uploadedUrl 
                      });
                    } else if (!templateName.trim()) {
                      toast({
                        variant: "destructive",
                        title: "Name Required",
                        description: "Please enter a template name first",
                      });
                    }
                  }}
                  onError={(error) => {
                    toast({
                      variant: "destructive",
                      title: "Upload Error",
                      description: error.message,
                    });
                  }}
                  buttonClassName={!templateName.trim() ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Upload PDF Template
                </ObjectUploader>
              </div>

              {contractTemplates.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Your Templates</h3>
                  <div className="space-y-2">
                    {contractTemplates.map((template) => (
                      <Card key={template.id} className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate" data-testid={`template-name-${template.id}`}>
                                {template.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Uploaded {format(new Date(template.uploadedAt), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(template.fileUrl, '_blank')}
                              data-testid={`button-download-${template.id}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteContractTemplate.mutate(template.id)}
                              disabled={deleteContractTemplate.isPending}
                              data-testid={`button-delete-${template.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {contractTemplates.length === 0 && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    No templates uploaded yet. Upload your first contract template above.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {importResults && (
        <Card data-testid="card-import-results">
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {importResults.imported.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Successfully Imported ({importResults.imported.length})
                </h3>
                <div className="space-y-2">
                  {importResults.imported.map((item: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-2 text-sm"
                      data-testid={`result-success-${idx}`}
                    >
                      <Badge variant="secondary">{item.type}</Badge>
                      <div className="flex-1">
                        <p className="text-muted-foreground truncate">{item.sourceUrl}</p>
                        <p className="text-xs text-green-600">→ {item.storedUrl}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {importResults.failed.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-destructive">
                  <XCircle className="h-4 w-4" />
                  Failed ({importResults.failed.length})
                </h3>
                <div className="space-y-2">
                  {importResults.failed.map((item: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-2 text-sm"
                      data-testid={`result-failed-${idx}`}
                    >
                      <Badge variant="destructive">{item.type}</Badge>
                      <div className="flex-1">
                        <p className="text-muted-foreground truncate">{item.sourceUrl}</p>
                        <p className="text-xs text-destructive">{item.error}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
