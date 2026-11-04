import { useState } from "react";
import { ContractTemplateEditor, type ContractField } from "@/components/ContractTemplateEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { FileText, Save, Upload } from "lucide-react";

export default function ContractTemplateTest() {
  const [savedFields, setSavedFields] = useState<ContractField[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>();

  // Handle PDF upload
  const handleUpload = async (file: File): Promise<string> => {
    // Create a local URL for preview
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    
    toast({
      title: "PDF Uploaded",
      description: `${file.name} has been uploaded successfully`,
    });
    
    return url;
  };

  // Handle save
  const handleSave = (fields: ContractField[]) => {
    setSavedFields(fields);
    
    // Log the fields for testing
    console.log("Saved fields:", fields);
    
    toast({
      title: "Template Saved",
      description: `${fields.length} fields have been saved`,
    });
  };

  // Sample fields for testing
  const sampleFields: ContractField[] = [
    {
      id: "field-1",
      type: "text",
      page: 1,
      x: 10,
      y: 10,
      width: 20,
      height: 5,
      label: "Tenant Name",
      required: true,
      recipient: "tenant",
      dataKey: "tenant_name",
    },
    {
      id: "field-2",
      type: "signature",
      page: 1,
      x: 10,
      y: 80,
      width: 25,
      height: 10,
      label: "Tenant Signature",
      required: true,
      recipient: "tenant",
    },
    {
      id: "field-3",
      type: "date",
      page: 1,
      x: 40,
      y: 80,
      width: 15,
      height: 5,
      label: "Contract Date",
      required: true,
      recipient: "tenant",
      dataKey: "contract_date",
    },
  ];

  const loadSampleTemplate = () => {
    setSavedFields(sampleFields);
    toast({
      title: "Sample Template Loaded",
      description: "Sample fields have been loaded for testing",
    });
  };

  return (
    <>
      <SEOHead
        title="Contract Template Editor Test"
        description="Test page for the contract template editor with PDF viewer and field placement"
      />

      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="border-b bg-background">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Contract Template Editor Test</h1>
                <p className="text-muted-foreground">
                  Upload a PDF contract and place fields for signatures, dates, and text
                </p>
              </div>
              <div className="flex items-center gap-4">
                {savedFields.length > 0 && (
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {savedFields.length} saved field{savedFields.length !== 1 && "s"}
                  </Badge>
                )}
                <Button
                  variant="outline"
                  onClick={loadSampleTemplate}
                  data-testid="button-load-sample"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Load Sample
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 overflow-hidden">
          <ContractTemplateEditor
            pdfUrl={pdfUrl}
            existingFields={savedFields}
            onSave={handleSave}
            onUpload={handleUpload}
          />
        </div>

        {/* Info Panel */}
        {savedFields.length > 0 && (
          <div className="border-t bg-muted/50">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">Last saved configuration:</span>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {savedFields.filter(f => f.type === "signature").length} signatures
                    </Badge>
                    <Badge variant="outline">
                      {savedFields.filter(f => f.type === "text").length} text fields
                    </Badge>
                    <Badge variant="outline">
                      {savedFields.filter(f => f.type === "date").length} dates
                    </Badge>
                    <Badge variant="outline">
                      {savedFields.filter(f => f.type === "checkbox").length} checkboxes
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    console.log("Fields configuration:", JSON.stringify(savedFields, null, 2));
                    toast({
                      title: "Configuration Logged",
                      description: "Check the console for field configuration",
                    });
                  }}
                  data-testid="button-log-config"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Log Config
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}