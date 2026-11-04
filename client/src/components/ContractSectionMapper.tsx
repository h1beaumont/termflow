import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, FileText, Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DynamicSection {
  id: string;
  sectionName: string;
  sectionKey: string;
  sectionType: string;
  pageNumber?: number;
  placeholderText?: string;
}

interface ContractSectionMapperProps {
  contractFileUrl?: string;
  contractFileName?: string;
  existingSections?: DynamicSection[];
  onUpload: (file: File) => Promise<void>;
  onSave: (sections: DynamicSection[]) => Promise<void>;
  onSkip?: () => void;
  uploading?: boolean;
}

const SECTION_TYPES = [
  { value: "text", label: "Text" },
  { value: "date", label: "Date" },
  { value: "currency", label: "Currency/Amount" },
  { value: "address", label: "Address" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Yes/No" },
];

const COMMON_SECTIONS = [
  { name: "Tenant Name", key: "tenant_name", type: "text" },
  { name: "Tenant Email", key: "tenant_email", type: "text" },
  { name: "Tenant Phone", key: "tenant_phone", type: "text" },
  { name: "Property Address", key: "property_address", type: "address" },
  { name: "Room Number", key: "room_number", type: "text" },
  { name: "Rent Amount", key: "rent_amount", type: "currency" },
  { name: "Deposit Amount", key: "deposit_amount", type: "currency" },
  { name: "Tenancy Start Date", key: "start_date", type: "date" },
  { name: "Tenancy End Date", key: "end_date", type: "date" },
  { name: "Contract Date", key: "contract_date", type: "date" },
];

export function ContractSectionMapper({
  contractFileUrl,
  contractFileName,
  existingSections = [],
  onUpload,
  onSave,
  onSkip,
  uploading = false,
}: ContractSectionMapperProps) {
  const [sections, setSections] = useState<DynamicSection[]>(existingSections);
  const [currentSection, setCurrentSection] = useState<Partial<DynamicSection>>({
    sectionName: "",
    sectionKey: "",
    sectionType: "text",
  });
  const [saving, setSaving] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    await onUpload(file);
  };

  const handleAddCommonSection = (common: typeof COMMON_SECTIONS[0]) => {
    const newSection: DynamicSection = {
      id: `section-${Date.now()}`,
      sectionName: common.name,
      sectionKey: common.key,
      sectionType: common.type,
    };
    setSections([...sections, newSection]);
  };

  const handleAddCustomSection = () => {
    if (!currentSection.sectionName || !currentSection.sectionKey || !currentSection.sectionType) {
      alert("Please fill in all required fields");
      return;
    }

    const newSection: DynamicSection = {
      id: `section-${Date.now()}`,
      sectionName: currentSection.sectionName,
      sectionKey: currentSection.sectionKey.toLowerCase().replace(/\s+/g, "_"),
      sectionType: currentSection.sectionType,
      pageNumber: currentSection.pageNumber,
      placeholderText: currentSection.placeholderText,
    };

    setSections([...sections, newSection]);
    setCurrentSection({
      sectionName: "",
      sectionKey: "",
      sectionType: "text",
    });
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    if (sections.length === 0) {
      alert("Please add at least one dynamic section");
      return;
    }

    setSaving(true);
    try {
      await onSave(sections);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Contract Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Template</CardTitle>
          <CardDescription>
            Upload your standard tenancy agreement template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contractFileUrl ? (
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{contractFileName || "Contract Template"}</p>
                <p className="text-sm text-muted-foreground">PDF uploaded successfully</p>
              </div>
              <Badge variant="default">Uploaded</Badge>
            </div>
          ) : (
            <div>
              <Label htmlFor="contract-upload" className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Click to upload contract template
                  </p>
                  <p className="text-xs text-muted-foreground">PDF files only</p>
                </div>
              </Label>
              <Input
                id="contract-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                data-testid="input-contract-upload"
              />
            </div>
          )}

          {!contractFileUrl && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Upload your contract template first before mapping dynamic sections
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dynamic Sections Mapping */}
      {contractFileUrl && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Add Sections */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Add - Common Sections</CardTitle>
                <CardDescription>
                  Click to add commonly used dynamic sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SECTIONS.map((common) => {
                    const alreadyAdded = sections.some(s => s.sectionKey === common.key);
                    return (
                      <Button
                        key={common.key}
                        variant={alreadyAdded ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleAddCommonSection(common)}
                        disabled={alreadyAdded}
                        data-testid={`button-add-${common.key}`}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {common.name}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Custom Section</CardTitle>
                <CardDescription>
                  Define your own dynamic section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="section-name">Section Name *</Label>
                  <Input
                    id="section-name"
                    placeholder="e.g., Guardian Name"
                    value={currentSection.sectionName || ""}
                    onChange={(e) => setCurrentSection({ ...currentSection, sectionName: e.target.value })}
                    data-testid="input-section-name"
                  />
                </div>

                <div>
                  <Label htmlFor="section-key">Section Key *</Label>
                  <Input
                    id="section-key"
                    placeholder="e.g., guardian_name"
                    value={currentSection.sectionKey || ""}
                    onChange={(e) => setCurrentSection({ ...currentSection, sectionKey: e.target.value })}
                    data-testid="input-section-key"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Unique identifier (lowercase, underscores)
                  </p>
                </div>

                <div>
                  <Label htmlFor="section-type">Section Type *</Label>
                  <Select
                    value={currentSection.sectionType || "text"}
                    onValueChange={(value) => setCurrentSection({ ...currentSection, sectionType: value })}
                  >
                    <SelectTrigger id="section-type" data-testid="select-section-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="page-number">Page Number (optional)</Label>
                  <Input
                    id="page-number"
                    type="number"
                    placeholder="e.g., 1"
                    value={currentSection.pageNumber || ""}
                    onChange={(e) => setCurrentSection({ ...currentSection, pageNumber: parseInt(e.target.value) || undefined })}
                    data-testid="input-page-number"
                  />
                </div>

                <div>
                  <Label htmlFor="placeholder-text">Current Placeholder Text (optional)</Label>
                  <Textarea
                    id="placeholder-text"
                    placeholder="e.g., [TENANT NAME]"
                    value={currentSection.placeholderText || ""}
                    onChange={(e) => setCurrentSection({ ...currentSection, placeholderText: e.target.value })}
                    data-testid="input-placeholder-text"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    What currently appears in the template
                  </p>
                </div>

                <Button
                  onClick={handleAddCustomSection}
                  className="w-full"
                  data-testid="button-add-custom-section"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Section
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: Section List */}
          <Card>
            <CardHeader>
              <CardTitle>Mapped Sections ({sections.length})</CardTitle>
              <CardDescription>
                These sections will be auto-filled when generating tenant contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {sections.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No sections added yet</p>
                    <p className="text-xs">Add sections to map your contract template</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sections.map((section) => (
                      <div
                        key={section.id}
                        className="p-3 border rounded-lg space-y-2"
                        data-testid={`section-${section.sectionKey}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium">{section.sectionName}</p>
                            <p className="text-sm text-muted-foreground">{section.sectionKey}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSection(section.id)}
                            data-testid={`button-remove-${section.sectionKey}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary">{section.sectionType}</Badge>
                          {section.pageNumber && (
                            <Badge variant="outline">Page {section.pageNumber}</Badge>
                          )}
                        </div>

                        {section.placeholderText && (
                          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                            Placeholder: {section.placeholderText}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      {contractFileUrl && (
        <div className="flex gap-3 justify-end">
          {onSkip && (
            <Button
              variant="outline"
              onClick={onSkip}
              data-testid="button-skip-mapping"
            >
              Skip for Now
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || sections.length === 0}
            data-testid="button-save-sections"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      )}
    </div>
  );
}
