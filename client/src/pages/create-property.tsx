import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { insertPropertySchema, type InsertProperty } from "@shared/schema";
import type { UploadResult } from "@uppy/core";
import { useState } from "react";
import { Loader2, Plus, X, HelpCircle, Upload, Globe } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface AIInsights {
  commonQuestions?: string[];
  highlights?: string[];
  policies?: {
    pets?: string;
    guests?: string;
    smoking?: string;
    noise?: string;
  };
  pricing?: {
    rent?: string;
    deposit?: string;
    billsIncluded?: boolean;
  };
  location?: {
    universities?: string[];
    transportLinks?: string;
  };
  amenities?: string[];
  faqs?: FAQ[];
  description?: string;
  keyFeatures?: string[];
  utilitiesIncluded?: boolean;
  utilityDetails?: string;
}

const AMENITIES_OPTIONS = [
  "WiFi",
  "Gym", 
  "Laundry",
  "Bike Storage",
  "Study Rooms",
  "Cinema Room",
  "Games Room",
  "Common Room",
  "Outdoor Space",
  "BBQ Area",
  "Parking",
  "24/7 Security",
  "On-site Management",
];

const ACCESSIBILITY_OPTIONS = [
  "Wheelchair Access",
  "Lift",
  "Ground Floor Rooms",
  "Wide Doorways",
];

export default function CreateProperty() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [heroImageUrl, setHeroImageUrl] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [nearbyUniversities, setNearbyUniversities] = useState<string[]>([]);
  const [newUniversity, setNewUniversity] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([]);
  const [whatsappInsights, setWhatsappInsights] = useState<AIInsights | null>(null);
  const [websiteInsights, setWebsiteInsights] = useState<AIInsights | null>(null);
  const [whatsappFile, setWhatsappFile] = useState<File | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  const form = useForm<InsertProperty>({
    resolver: zodResolver(insertPropertySchema.omit({ landlordId: true })),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      postcode: "",
      description: "",
      propertyType: "student_accommodation",
      totalBedrooms: 1,
      numberOfBathrooms: undefined,
      parkingSpaces: undefined,
      gardenOutdoorSpace: false,
      furnishingStatus: undefined,
      petPolicy: undefined,
      smokingPolicy: undefined,
      guestPolicy: "",
      noisePolicy: "",
      cleaningSchedule: "",
      utilitiesIncluded: false,
      utilityDetails: "",
      councilTaxIncluded: false,
      tvLicenseIncluded: false,
      internetSpeed: "",
      transportLinks: "",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      await apiRequest("POST", "/api/properties", {
        ...data,
        heroImageUrl,
        imageUrls,
        amenities: selectedAmenities,
        accessibilityFeatures: selectedAccessibility,
        keyFeatures,
        nearbyUniversities,
        frequentQuestions: faqs,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Property created",
        description: "Your property has been created successfully",
      });
      navigate("/properties");
    },
  });

  const whatsappUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/properties/whatsapp-upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setWhatsappInsights(data.insights);
      toast({
        title: "WhatsApp analysis complete",
        description: "AI has extracted insights from your conversation history",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const websiteScrapeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await fetch('/api/properties/scrape-website', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Scraping failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setWebsiteInsights(data.insights);
      toast({
        title: "Website analysis complete",
        description: "AI has extracted property information from the website",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Scraping failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const applyWhatsAppInsights = () => {
    if (!whatsappInsights) return;

    if (whatsappInsights.highlights) {
      setKeyFeatures(prev => [...new Set([...prev, ...whatsappInsights.highlights!])]);
    }
    if (whatsappInsights.policies?.pets) {
      form.setValue('petPolicy', whatsappInsights.policies.pets);
    }
    if (whatsappInsights.policies?.smoking) {
      form.setValue('smokingPolicy', whatsappInsights.policies.smoking);
    }
    if (whatsappInsights.policies?.guests) {
      form.setValue('guestPolicy', whatsappInsights.policies.guests);
    }
    if (whatsappInsights.policies?.noise) {
      form.setValue('noisePolicy', whatsappInsights.policies.noise);
    }
    if (whatsappInsights.location?.universities) {
      setNearbyUniversities(prev => [...new Set([...prev, ...whatsappInsights.location!.universities!])]);
    }
    if (whatsappInsights.location?.transportLinks) {
      form.setValue('transportLinks', whatsappInsights.location.transportLinks);
    }
    if (whatsappInsights.amenities) {
      setSelectedAmenities(prev => [...new Set([...prev, ...whatsappInsights.amenities!])]);
    }
    if (whatsappInsights.faqs) {
      setFaqs(prev => [...prev, ...whatsappInsights.faqs!]);
    }
    if (whatsappInsights.pricing?.billsIncluded !== undefined) {
      form.setValue('utilitiesIncluded', whatsappInsights.pricing.billsIncluded);
    }

    toast({
      title: "Insights applied",
      description: "WhatsApp insights have been applied to the form",
    });
  };

  const applyWebsiteInsights = () => {
    if (!websiteInsights) return;

    if (websiteInsights.description) {
      form.setValue('description', websiteInsights.description);
    }
    if (websiteInsights.amenities) {
      setSelectedAmenities(prev => [...new Set([...prev, ...websiteInsights.amenities!])]);
    }
    if (websiteInsights.keyFeatures) {
      setKeyFeatures(prev => [...new Set([...prev, ...websiteInsights.keyFeatures!])]);
    }
    if (websiteInsights.policies?.pets) {
      form.setValue('petPolicy', websiteInsights.policies.pets);
    }
    if (websiteInsights.policies?.smoking) {
      form.setValue('smokingPolicy', websiteInsights.policies.smoking);
    }
    if (websiteInsights.policies?.guests) {
      form.setValue('guestPolicy', websiteInsights.policies.guests);
    }
    if (websiteInsights.location?.universities) {
      setNearbyUniversities(prev => [...new Set([...prev, ...websiteInsights.location!.universities!])]);
    }
    if (websiteInsights.location?.transportLinks) {
      form.setValue('transportLinks', websiteInsights.location.transportLinks);
    }
    if (websiteInsights.faqs) {
      setFaqs(prev => [...prev, ...websiteInsights.faqs!]);
    }
    if (websiteInsights.utilitiesIncluded !== undefined) {
      form.setValue('utilitiesIncluded', websiteInsights.utilitiesIncluded);
    }
    if (websiteInsights.utilityDetails) {
      form.setValue('utilityDetails', websiteInsights.utilityDetails);
    }

    toast({
      title: "Insights applied",
      description: "Website insights have been applied to the form",
    });
  };

  const handleGetHeroUploadUrl = async () => {
    const res = await fetch("/api/objects/upload", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    return { method: "PUT" as const, url: data.uploadURL };
  };

  const handleHeroUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    const uploadUrl = result.successful[0]?.uploadURL;
    if (!uploadUrl) return;

    const res = await fetch("/api/property-images", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageURL: uploadUrl }),
    });
    const data = await res.json();
    setHeroImageUrl(data.objectPath);
    toast({
      title: "Hero image uploaded",
      description: "Your property hero image has been uploaded",
    });
  };

  const handleGetGalleryUploadUrl = async () => {
    const res = await fetch("/api/objects/upload", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    return { method: "PUT" as const, url: data.uploadURL };
  };

  const handleGalleryUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    const uploadUrls = result.successful.map(f => f.uploadURL).filter(Boolean) as string[];
    if (uploadUrls.length === 0) return;

    const processedUrls: string[] = [];
    for (const url of uploadUrls) {
      const res = await fetch("/api/property-images", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageURL: url }),
      });
      const data = await res.json();
      processedUrls.push(data.objectPath);
    }

    setImageUrls(prev => [...prev, ...processedUrls]);
    toast({
      title: "Gallery images uploaded",
      description: `${processedUrls.length} image(s) uploaded successfully`,
    });
  };

  const addKeyFeature = () => {
    if (newFeature.trim()) {
      setKeyFeatures([...keyFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeKeyFeature = (index: number) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
  };

  const addUniversity = () => {
    if (newUniversity.trim()) {
      setNearbyUniversities([...nearbyUniversities, newUniversity.trim()]);
      setNewUniversity("");
    }
  };

  const removeUniversity = (index: number) => {
    setNearbyUniversities(nearbyUniversities.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight" data-testid="text-create-property-title">
          Create Property
        </h1>
        <p className="text-muted-foreground mt-2">Add a new property to your portfolio</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="basic" data-testid="tab-basic">Basic</TabsTrigger>
              <TabsTrigger value="amenities" data-testid="tab-amenities">Amenities</TabsTrigger>
              <TabsTrigger value="policies" data-testid="tab-policies">Policies</TabsTrigger>
              <TabsTrigger value="utilities" data-testid="tab-utilities">Utilities</TabsTrigger>
              <TabsTrigger value="location" data-testid="tab-location">Location</TabsTrigger>
              <TabsTrigger value="faqs" data-testid="tab-faqs">FAQs</TabsTrigger>
              <TabsTrigger value="ai" data-testid="tab-ai">AI Enrichment</TabsTrigger>
              <TabsTrigger value="images" data-testid="tab-images">Images</TabsTrigger>
            </TabsList>

            {/* Tab 1: Basic Details */}
            <TabsContent value="basic" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Property Details</CardTitle>
                  <CardDescription>Essential information about your property</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Central Student Living" {...field} data-testid="input-property-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 High Street" {...field} data-testid="input-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Manchester" {...field} data-testid="input-city" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input placeholder="M1 2WD" {...field} data-testid="input-postcode" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-property-type">
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="student_accommodation">Student Accommodation</SelectItem>
                              <SelectItem value="house_share">House Share</SelectItem>
                              <SelectItem value="studio">Studio</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="totalBedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Bedrooms</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-total-bedrooms" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numberOfBathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              value={field.value || ""}
                              onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              data-testid="input-bathrooms" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parkingSpaces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parking Spaces (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              value={field.value || ""}
                              onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              data-testid="input-parking-spaces" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="gardenOutdoorSpace"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-garden"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Garden/Outdoor Space</FormLabel>
                            <FormDescription>Property has outdoor area</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="furnishingStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Furnishing Status (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger data-testid="select-furnishing">
                                <SelectValue placeholder="Select furnishing status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fully_furnished">Fully Furnished</SelectItem>
                              <SelectItem value="part_furnished">Part Furnished</SelectItem>
                              <SelectItem value="unfurnished">Unfurnished</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your property..."
                            className="min-h-32"
                            {...field}
                            value={field.value || ""}
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Amenities & Features */}
            <TabsContent value="amenities" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Amenities & Features</CardTitle>
                  <CardDescription>Select all amenities and special features your property offers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <FormLabel>Amenities</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {AMENITIES_OPTIONS.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`amenity-${amenity}`}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAmenities([...selectedAmenities, amenity]);
                              } else {
                                setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                              }
                            }}
                            data-testid={`checkbox-amenity-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FormLabel>Accessibility Features</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {ACCESSIBILITY_OPTIONS.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={`accessibility-${feature}`}
                            checked={selectedAccessibility.includes(feature)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAccessibility([...selectedAccessibility, feature]);
                              } else {
                                setSelectedAccessibility(selectedAccessibility.filter(a => a !== feature));
                              }
                            }}
                            data-testid={`checkbox-accessibility-${feature.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <label htmlFor={`accessibility-${feature}`} className="text-sm cursor-pointer">
                            {feature}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FormLabel>Key Features</FormLabel>
                    <FormDescription>Highlight unique selling points</FormDescription>
                    <div className="flex gap-2 mt-3">
                      <Input
                        placeholder="e.g., Close to campus"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyFeature())}
                        data-testid="input-new-feature"
                      />
                      <Button type="button" onClick={addKeyFeature} data-testid="button-add-feature">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {keyFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {keyFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md" data-testid={`feature-${index}`}>
                            <span className="text-sm">{feature}</span>
                            <button
                              type="button"
                              onClick={() => removeKeyFeature(index)}
                              className="hover:text-destructive"
                              data-testid={`button-remove-feature-${index}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="internetSpeed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Internet Speed (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 100Mbps, Gigabit" 
                            {...field} 
                            value={field.value || ""}
                            data-testid="input-internet-speed" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Policies & Rules */}
            <TabsContent value="policies" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Policies & Rules</CardTitle>
                  <CardDescription>Define property rules and policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="petPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Policy (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger data-testid="select-pet-policy">
                              <SelectValue placeholder="Select pet policy" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no_pets">No Pets</SelectItem>
                            <SelectItem value="cats_allowed">Cats Allowed</SelectItem>
                            <SelectItem value="small_pets_allowed">Small Pets Allowed</SelectItem>
                            <SelectItem value="all_pets_allowed">All Pets Allowed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="smokingPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Smoking Policy (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger data-testid="select-smoking-policy">
                              <SelectValue placeholder="Select smoking policy" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no_smoking">No Smoking</SelectItem>
                            <SelectItem value="outdoor_only">Outdoor Only</SelectItem>
                            <SelectItem value="smoking_allowed">Smoking Allowed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guestPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guest Policy (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe guest rules and overnight stay policies..."
                            className="min-h-24"
                            {...field}
                            value={field.value || ""}
                            data-testid="textarea-guest-policy"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noisePolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Noise Policy (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Quiet hours, noise restrictions..."
                            className="min-h-24"
                            {...field}
                            value={field.value || ""}
                            data-testid="textarea-noise-policy"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cleaningSchedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cleaning Schedule (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Communal area cleaning schedule and responsibilities..."
                            className="min-h-24"
                            {...field}
                            value={field.value || ""}
                            data-testid="textarea-cleaning-schedule"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Utilities & Bills */}
            <TabsContent value="utilities" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Utilities & Bills</CardTitle>
                  <CardDescription>Specify what utilities and bills are included in rent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="utilitiesIncluded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-utilities-included"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Utilities Included</FormLabel>
                          <FormDescription>Utilities are included in the rent</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="utilityDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Utility Details (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Specify what's included (gas, electricity, water, internet) or excluded..."
                            className="min-h-24"
                            {...field}
                            value={field.value || ""}
                            data-testid="textarea-utility-details"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="councilTaxIncluded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-council-tax"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Council Tax Included</FormLabel>
                          <FormDescription>Council tax is included in the rent</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tvLicenseIncluded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-tv-license"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>TV License Included</FormLabel>
                          <FormDescription>TV license is included in the rent</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 5: Location & Transport */}
            <TabsContent value="location" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Location & Transport</CardTitle>
                  <CardDescription>Add nearby universities and transport information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <FormLabel>Nearby Universities</FormLabel>
                    <FormDescription>Add universities near your property</FormDescription>
                    <div className="flex gap-2 mt-3">
                      <Input
                        placeholder="e.g., University of Manchester"
                        value={newUniversity}
                        onChange={(e) => setNewUniversity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUniversity())}
                        data-testid="input-new-university"
                      />
                      <Button type="button" onClick={addUniversity} data-testid="button-add-university">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {nearbyUniversities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {nearbyUniversities.map((uni, index) => (
                          <div key={index} className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md" data-testid={`university-${index}`}>
                            <span className="text-sm">{uni}</span>
                            <button
                              type="button"
                              onClick={() => removeUniversity(index)}
                              className="hover:text-destructive"
                              data-testid={`button-remove-university-${index}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="transportLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transport Links (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Bus routes, tram stops, walking distances to transport hubs..."
                            className="min-h-32"
                            {...field}
                            value={field.value || ""}
                            data-testid="textarea-transport-links"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 6: FAQs */}
            <TabsContent value="faqs" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Add common questions and answers about your property</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Question"
                              value={faq.question}
                              onChange={(e) => updateFaq(index, 'question', e.target.value)}
                              data-testid={`input-faq-question-${index}`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFaq(index)}
                              data-testid={`button-remove-faq-${index}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea
                            placeholder="Answer"
                            value={faq.answer}
                            onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                            className="min-h-20"
                            data-testid={`textarea-faq-answer-${index}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={addFaq} className="w-full" data-testid="button-add-faq">
                    <Plus className="h-4 w-4 mr-2" />
                    Add FAQ
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 7: AI Data Enrichment */}
            <TabsContent value="ai" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Data Enrichment</CardTitle>
                  <CardDescription>Use AI to extract property information from WhatsApp conversations or websites</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* WhatsApp Upload Section */}
                  <div className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">WhatsApp Message History</h3>
                      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" data-testid="button-show-instructions">
                            <HelpCircle className="h-4 w-4 mr-2" />
                            How to export
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>How to Export WhatsApp Chat</DialogTitle>
                            <DialogDescription>Follow these steps to export your WhatsApp conversation history</DialogDescription>
                          </DialogHeader>
                          <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <div className="space-y-3">
                              <h4 className="font-semibold">iOS (iPhone)</h4>
                              <ol className="list-decimal list-inside space-y-2 text-sm">
                                <li>Open WhatsApp chat with tenant</li>
                                <li>Tap chat name at top</li>
                                <li>Scroll down and tap "Export Chat"</li>
                                <li>Choose "Without Media"</li>
                                <li>Save .txt file</li>
                                <li>Upload here</li>
                              </ol>
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-semibold">Android</h4>
                              <ol className="list-decimal list-inside space-y-2 text-sm">
                                <li>Open WhatsApp chat</li>
                                <li>Tap 3 dots menu</li>
                                <li>Select "More"</li>
                                <li>Tap "Export chat"</li>
                                <li>Choose "Without Media"</li>
                                <li>Save .txt file</li>
                                <li>Upload here</li>
                              </ol>
                            </div>
                          </div>
                          <Button onClick={() => setShowInstructions(false)} className="mt-4" data-testid="button-close-instructions">
                            Got it
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-sm text-muted-foreground">Upload WhatsApp chat export (.txt or .zip) to extract property information</p>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept=".txt,.zip"
                        onChange={(e) => setWhatsappFile(e.target.files?.[0] || null)}
                        data-testid="input-whatsapp-file"
                      />
                      <Button
                        type="button"
                        onClick={() => whatsappFile && whatsappUploadMutation.mutate(whatsappFile)}
                        disabled={!whatsappFile || whatsappUploadMutation.isPending}
                        data-testid="button-upload-whatsapp"
                      >
                        {whatsappUploadMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                    {whatsappInsights && (
                      <Card className="mt-3">
                        <CardHeader>
                          <CardTitle className="text-sm">Extracted Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                            {JSON.stringify(whatsappInsights, null, 2)}
                          </pre>
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={applyWhatsAppInsights}
                            data-testid="button-apply-whatsapp-insights"
                          >
                            Apply Suggestions
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Website Scraping Section */}
                  <div className="space-y-3 p-4 border rounded-lg">
                    <h3 className="font-semibold">Website Scraping</h3>
                    <p className="text-sm text-muted-foreground">Enter a property website URL to extract information</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/property"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        data-testid="input-website-url"
                      />
                      <Button
                        type="button"
                        onClick={() => websiteUrl && websiteScrapeMutation.mutate(websiteUrl)}
                        disabled={!websiteUrl || websiteScrapeMutation.isPending}
                        data-testid="button-scrape-website"
                      >
                        {websiteScrapeMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Scraping...
                          </>
                        ) : (
                          <>
                            <Globe className="h-4 w-4 mr-2" />
                            Scrape
                          </>
                        )}
                      </Button>
                    </div>
                    {websiteInsights && (
                      <Card className="mt-3">
                        <CardHeader>
                          <CardTitle className="text-sm">Extracted Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                            {JSON.stringify(websiteInsights, null, 2)}
                          </pre>
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={applyWebsiteInsights}
                            data-testid="button-apply-website-insights"
                          >
                            Apply Suggestions
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 8: Images */}
            <TabsContent value="images" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Images</CardTitle>
                  <CardDescription>Upload hero image and gallery photos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hero Image</label>
                    <div className="flex items-center gap-3">
                      <ObjectUploader
                        maxNumberOfFiles={1}
                        maxFileSize={52428800}
                        onGetUploadParameters={handleGetHeroUploadUrl}
                        onComplete={handleHeroUploadComplete}
                      >
                        <span>Upload Hero Image</span>
                      </ObjectUploader>
                      {heroImageUrl && (
                        <span className="text-sm text-muted-foreground">✓ Uploaded</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gallery Images</label>
                    <div className="flex items-center gap-3">
                      <ObjectUploader
                        maxNumberOfFiles={10}
                        maxFileSize={52428800}
                        onGetUploadParameters={handleGetGalleryUploadUrl}
                        onComplete={handleGalleryUploadComplete}
                      >
                        <span>Upload Gallery Images</span>
                      </ObjectUploader>
                      {imageUrls.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {imageUrls.length} image(s) uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Buttons (Always visible at bottom) */}
          <div className="flex gap-3 pt-6 mt-6 border-t">
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              data-testid="button-create-property"
            >
              {createMutation.isPending ? "Creating..." : "Create Property"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/properties")}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
