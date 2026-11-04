import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { ContractTemplateEditor, type ContractField } from "@/components/ContractTemplateEditor";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import type { ContractTemplate } from "@shared/schema";

export default function EditContractTemplate() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [templateName, setTemplateName] = useState("");
  const [fields, setFields] = useState<ContractField[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch template
  const { data: template, isLoading, error } = useQuery<ContractTemplate>({
    queryKey: [`/api/landlord/contract-templates/${id}`],
    enabled: !!id,
  });

  // Set initial values when template loads
  useEffect(() => {
    if (template) {
      setTemplateName(template.name);
      setFields(Array.isArray(template.fields) ? template.fields as ContractField[] : []);
    }
  }, [template]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ name, fields }: { name: string; fields: ContractField[] }) => {
      const response = await apiRequest("PUT", `/api/landlord/contract-templates/${id}`, { name, fields });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landlord/contract-templates"] });
      queryClient.invalidateQueries({ queryKey: [`/api/landlord/contract-templates/${id}`] });
      toast({
        title: "Template saved",
        description: "Your changes have been saved successfully.",
      });
      setHasChanges(false);
      navigate("/contract-templates");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!templateName) {
      toast({
        title: "Name required",
        description: "Please provide a name for the template.",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({ name: templateName, fields });
  };

  const handleFieldsChange = (newFields: ContractField[]) => {
    setFields(newFields);
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[600px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="text-destructive">
              <h3 className="text-lg font-medium">Template not found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                The template you're looking for could not be loaded.
              </p>
            </div>
            <Button onClick={() => navigate("/contract-templates")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/contract-templates")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground" data-testid="text-page-title">
              Edit Contract Template
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure field mappings for automatic data population
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending || !hasChanges}
          className="gap-2"
          data-testid="button-save"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Template Name */}
      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
          <CardDescription>
            Update the template name and configure field placements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-w-md">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => {
                setTemplateName(e.target.value);
                setHasChanges(true);
              }}
              placeholder="e.g., Standard AST 2024"
              data-testid="input-template-name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contract Template Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Field Configuration</CardTitle>
          <CardDescription>
            Click on the PDF to place fields where data should be inserted. Fields will be automatically populated when generating contracts.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ContractTemplateEditor
            pdfUrl={`/objects/${template.fileUrl}`}
            existingFields={fields}
            onSave={handleFieldsChange}
          />
        </CardContent>
      </Card>

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="flex items-center justify-between p-4">
            <p className="text-sm font-medium">
              You have unsaved changes
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTemplateName(template.name);
                  setFields(Array.isArray(template.fields) ? template.fields as ContractField[] : []);
                  setHasChanges(false);
                }}
                data-testid="button-discard"
              >
                Discard
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateMutation.isPending}
                data-testid="button-save-inline"
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}