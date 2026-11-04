import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  FileText,
  Edit,
  Trash2,
  MoreVertical,
  Upload,
  Calendar,
  CheckCircle,
  FileSignature,
  Star,
  StarOff,
  Hash,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import type { ContractTemplate } from "@shared/schema";

export default function ContractTemplates() {
  const [, navigate] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Fetch templates
  const { data: templates, isLoading } = useQuery<ContractTemplate[]>({
    queryKey: ["/api/landlord/contract-templates"],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/landlord/contract-templates/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landlord/contract-templates"] });
      toast({
        title: "Template deleted",
        description: "The contract template has been removed.",
      });
      setDeleteDialogOpen(false);
      setSelectedTemplate(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set default mutation
  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("PUT", `/api/landlord/contract-templates/${id}`, { isDefault: true });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landlord/contract-templates"] });
      toast({
        title: "Default template set",
        description: "This template will be used for new contracts.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to set default template. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ name, file }: { name: string; file: File }) => {
      // First, upload the file to object storage (you'll need to implement this endpoint)
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }
      
      const { fileUrl } = await uploadResponse.json();
      
      // Then create the template record
      const response = await apiRequest("POST", "/api/landlord/contract-templates", { name, fileUrl });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landlord/contract-templates"] });
      toast({
        title: "Template uploaded",
        description: "Your contract template has been saved.",
      });
      setUploadDialogOpen(false);
      setNewTemplateName("");
      setUploadedFile(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = () => {
    if (!newTemplateName || !uploadedFile) {
      toast({
        title: "Missing information",
        description: "Please provide a name and select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({ name: newTemplateName, file: uploadedFile });
  };

  const countFields = (fields: unknown) => {
    if (!fields || !Array.isArray(fields)) return 0;
    return fields.length;
  };

  const getDefaultTemplate = () => {
    return templates?.find(t => t.isDefault);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground" data-testid="text-page-title">
            Contract Templates
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your contract templates and set field mappings for automatic data population
          </p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-upload-template">
              <Upload className="h-4 w-4" />
              Upload Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Contract Template</DialogTitle>
              <DialogDescription>
                Upload a PDF contract template to use for generating tenant contracts
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="e.g., Standard AST 2024"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  data-testid="input-template-name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="template-file">PDF File</Label>
                <Input
                  id="template-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  data-testid="input-template-file"
                />
                {uploadedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {uploadedFile.name}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending || !newTemplateName || !uploadedFile}
                data-testid="button-confirm-upload"
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Default template indicator */}
      {getDefaultTemplate() && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-medium">Default Template</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>{getDefaultTemplate()?.name}</strong> is currently set as the default template for all new contracts.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : !templates || templates.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-medium">No templates yet</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Upload your first contract template to get started
              </p>
            </div>
            <Button
              onClick={() => setUploadDialogOpen(true)}
              className="gap-2"
              data-testid="button-upload-first-template"
            >
              <Upload className="h-4 w-4" />
              Upload Template
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className={template.isDefault ? "ring-2 ring-primary/20" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileSignature className="h-5 w-5 text-muted-foreground" />
                      {template.name}
                      {template.isDefault && (
                        <Badge variant="default" className="ml-auto">
                          Default
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Uploaded {format(new Date(template.uploadedAt), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid={`button-menu-${template.id}`}>
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Template options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/contract-templates/${template.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Fields
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`/objects/${template.fileUrl}`, "_blank")}>
                        <Eye className="mr-2 h-4 w-4" />
                        View PDF
                      </DropdownMenuItem>
                      {!template.isDefault && (
                        <DropdownMenuItem onClick={() => setDefaultMutation.mutate(template.id)}>
                          <Star className="mr-2 h-4 w-4" />
                          Set as Default
                        </DropdownMenuItem>
                      )}
                      {template.isDefault && (
                        <DropdownMenuItem 
                          onClick={() => setDefaultMutation.mutate(template.id)}
                          disabled
                        >
                          <StarOff className="mr-2 h-4 w-4" />
                          Remove Default
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    {countFields(template.fields)} fields
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Modified {format(new Date(template.uploadedAt), "MMM d")}
                  </div>
                </div>
                {template.fields && Array.isArray(template.fields) && template.fields.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {(template.fields as any[]).slice(0, 3).map((field: any, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {field.label}
                      </Badge>
                    ))}
                    {template.fields.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.fields.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => navigate(`/contract-templates/${template.id}/edit`)}
                  data-testid={`button-edit-${template.id}`}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Configure Fields
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTemplate?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedTemplate && deleteMutation.mutate(selectedTemplate.id)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}