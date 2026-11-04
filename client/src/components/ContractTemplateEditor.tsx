import { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  Save,
  Upload,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Type,
  CheckSquare,
  Calendar,
  PenTool,
  Hash,
  ChevronDown,
  Move,
  Undo,
  Redo,
  FileText,
  Settings,
  Layers,
  MousePointer,
  Copy,
  AlertCircle,
} from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

// Types
export type FieldType = 
  | "signature"
  | "initial"
  | "date"
  | "text"
  | "checkbox"
  | "dropdown";

export interface ContractField {
  id: string;
  type: FieldType;
  page: number;
  x: number; // % of page width
  y: number; // % of page height
  width: number; // % of page width
  height: number; // % of page height
  label: string;
  required: boolean;
  recipient: "tenant" | "guarantor" | "landlord";
  dataKey?: string;
  options?: string[]; // For dropdown fields
}

interface ContractTemplateEditorProps {
  pdfUrl?: string;
  existingFields?: ContractField[];
  onSave: (fields: ContractField[]) => void;
  onUpload?: (file: File) => Promise<string>; // Returns PDF URL
}

const FIELD_TYPES: { type: FieldType; label: string; icon: any; color: string }[] = [
  { type: "signature", label: "Signature", icon: PenTool, color: "bg-blue-500/20 border-blue-500" },
  { type: "initial", label: "Initial", icon: PenTool, color: "bg-purple-500/20 border-purple-500" },
  { type: "text", label: "Text", icon: Type, color: "bg-gray-500/20 border-gray-500" },
  { type: "date", label: "Date", icon: Calendar, color: "bg-green-500/20 border-green-500" },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare, color: "bg-yellow-500/20 border-yellow-500" },
  { type: "dropdown", label: "Dropdown", icon: ChevronDown, color: "bg-orange-500/20 border-orange-500" },
];

const DATA_KEYS = [
  { key: "tenant_name", label: "Tenant Name" },
  { key: "tenant_email", label: "Tenant Email" },
  { key: "tenant_phone", label: "Tenant Phone" },
  { key: "guarantor_name", label: "Guarantor Name" },
  { key: "guarantor_email", label: "Guarantor Email" },
  { key: "property_address", label: "Property Address" },
  { key: "room_number", label: "Room Number" },
  { key: "rent_amount", label: "Rent Amount" },
  { key: "deposit_amount", label: "Deposit Amount" },
  { key: "start_date", label: "Start Date" },
  { key: "end_date", label: "End Date" },
  { key: "contract_date", label: "Contract Date" },
  { key: "weekly_rent", label: "Weekly Rent" },
  { key: "total_rent", label: "Total Rent" },
  { key: "contract_length", label: "Contract Length" },
];

export function ContractTemplateEditor({
  pdfUrl,
  existingFields = [],
  onSave,
  onUpload,
}: ContractTemplateEditorProps) {
  // PDF state
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfFile, setPdfFile] = useState<string | undefined>(pdfUrl);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Fields state
  const [fields, setFields] = useState<ContractField[]>(existingFields);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<FieldType>("signature");
  const [isPlacingField, setIsPlacingField] = useState(false);
  
  // History for undo/redo
  const [history, setHistory] = useState<ContractField[][]>([existingFields]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Refs
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get selected field
  const selectedField = fields.find(f => f.id === selectedFieldId);

  // Handle PDF upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    if (onUpload) {
      try {
        const url = await onUpload(file);
        setPdfFile(url);
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload PDF file",
          variant: "destructive",
        });
      }
    } else {
      // Local preview
      const url = URL.createObjectURL(file);
      setPdfFile(url);
    }
  };

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  // Handle page load success
  const onPageLoadSuccess = ({ width, height }: { width: number; height: number }) => {
    setPageSize({ width, height });
  };

  // Add field to history
  const addToHistory = (newFields: ContractField[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newFields);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setFields(history[historyIndex - 1]);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setFields(history[historyIndex + 1]);
    }
  };

  // Place field on PDF click
  const handlePdfClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacingField || !pageRef.current) return;

    const rect = pageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newField: ContractField = {
      id: `field-${Date.now()}`,
      type: selectedTool,
      page: currentPage,
      x,
      y,
      width: selectedTool === "checkbox" ? 3 : 15,
      height: selectedTool === "checkbox" ? 3 : 5,
      label: `New ${selectedTool} field`,
      required: false,
      recipient: "tenant",
    };

    const newFields = [...fields, newField];
    setFields(newFields);
    addToHistory(newFields);
    setSelectedFieldId(newField.id);
    setIsPlacingField(false);

    toast({
      title: "Field added",
      description: `${selectedTool} field added to page ${currentPage}`,
    });
  };

  // Update field position
  const handleFieldDrag = (fieldId: string, x: number, y: number) => {
    const newFields = fields.map(f =>
      f.id === fieldId ? { ...f, x, y } : f
    );
    setFields(newFields);
  };

  // Update field size
  const handleFieldResize = (fieldId: string, width: number, height: number) => {
    const newFields = fields.map(f =>
      f.id === fieldId ? { ...f, width, height } : f
    );
    setFields(newFields);
  };

  // Update field after drag/resize
  const handleFieldUpdate = (fieldId: string, x: number, y: number, width: number, height: number) => {
    const newFields = fields.map(f =>
      f.id === fieldId ? { ...f, x, y, width, height } : f
    );
    setFields(newFields);
    addToHistory(newFields);
  };

  // Update field properties
  const updateField = (fieldId: string, updates: Partial<ContractField>) => {
    const newFields = fields.map(f =>
      f.id === fieldId ? { ...f, ...updates } : f
    );
    setFields(newFields);
    addToHistory(newFields);
  };

  // Delete field
  const deleteField = (fieldId: string) => {
    const newFields = fields.filter(f => f.id !== fieldId);
    setFields(newFields);
    addToHistory(newFields);
    setSelectedFieldId(null);
    
    toast({
      title: "Field deleted",
      description: "Field has been removed from the template",
    });
  };

  // Duplicate field
  const duplicateField = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const newField: ContractField = {
      ...field,
      id: `field-${Date.now()}`,
      x: field.x + 2,
      y: field.y + 2,
      label: `${field.label} (copy)`,
    };

    const newFields = [...fields, newField];
    setFields(newFields);
    addToHistory(newFields);
    setSelectedFieldId(newField.id);
  };

  // Clear all fields
  const clearAllFields = () => {
    if (fields.length === 0) return;
    
    if (window.confirm("Are you sure you want to remove all fields?")) {
      setFields([]);
      addToHistory([]);
      setSelectedFieldId(null);
    }
  };

  // Save template
  const handleSave = () => {
    if (fields.length === 0) {
      toast({
        title: "No fields to save",
        description: "Please add at least one field before saving",
        variant: "destructive",
      });
      return;
    }

    onSave(fields);
    toast({
      title: "Template saved",
      description: `${fields.length} fields saved successfully`,
    });
  };

  // Get field style
  const getFieldStyle = (field: ContractField) => {
    const typeConfig = FIELD_TYPES.find(t => t.type === field.type);
    return typeConfig?.color || "bg-gray-500/20 border-gray-500";
  };

  // Get field icon
  const getFieldIcon = (field: ContractField) => {
    const typeConfig = FIELD_TYPES.find(t => t.type === field.type);
    const Icon = typeConfig?.icon || Type;
    return <Icon className="h-3 w-3" />;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          handleRedo();
        } else if (e.key === "s") {
          e.preventDefault();
          handleSave();
        }
      } else if (e.key === "Delete" && selectedFieldId) {
        deleteField(selectedFieldId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFieldId, historyIndex]);

  // Current page fields
  const currentPageFields = fields.filter(f => f.page === currentPage);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {/* Field Type Selector */}
            <div className="flex items-center gap-2">
              <Label className="text-sm">Tool:</Label>
              <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                <Button
                  size="sm"
                  variant={!isPlacingField ? "default" : "ghost"}
                  onClick={() => setIsPlacingField(false)}
                  className="h-8"
                  data-testid="button-select-tool"
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
                {FIELD_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.type}
                      size="sm"
                      variant={isPlacingField && selectedTool === type.type ? "default" : "ghost"}
                      onClick={() => {
                        setSelectedTool(type.type);
                        setIsPlacingField(true);
                      }}
                      className="h-8"
                      data-testid={`button-tool-${type.type}`}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                data-testid="button-undo"
              >
                <Undo className="h-4 w-4 mr-1" />
                Undo
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                data-testid="button-redo"
              >
                <Redo className="h-4 w-4 mr-1" />
                Redo
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pdfFile && (
              <>
                <Badge variant="secondary">
                  {fields.length} field{fields.length !== 1 && "s"}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearAllFields}
                  disabled={fields.length === 0}
                  data-testid="button-clear-all"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </>
            )}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={fields.length === 0}
              data-testid="button-save-template"
            >
              <Save className="h-4 w-4 mr-1" />
              Save Template
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-muted/50">
          {!pdfFile ? (
            // Upload Area
            <div className="flex-1 flex items-center justify-center p-8">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Upload Contract Template</CardTitle>
                  <CardDescription>
                    Upload a PDF contract to start placing fields
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label htmlFor="pdf-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">
                          Click to upload PDF
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF files only, up to 10MB
                        </p>
                      </div>
                    </Label>
                    <Input
                      id="pdf-upload"
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      data-testid="input-pdf-upload"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* PDF Controls */}
              <div className="flex items-center justify-between p-4 border-b bg-background">
                <div className="flex items-center gap-4">
                  {/* Page Navigation */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                      data-testid="button-prev-page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={currentPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (page >= 1 && page <= numPages) {
                            setCurrentPage(page);
                          }
                        }}
                        className="w-16 h-8 text-center"
                        min={1}
                        max={numPages}
                        data-testid="input-page-number"
                      />
                      <span className="text-sm text-muted-foreground">
                        of {numPages}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                      disabled={currentPage >= numPages}
                      data-testid="button-next-page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-8" />

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                      disabled={scale <= 0.5}
                      data-testid="button-zoom-out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Slider
                        value={[scale]}
                        onValueChange={([value]) => setScale(value)}
                        min={0.5}
                        max={2}
                        step={0.1}
                        className="flex-1"
                        data-testid="slider-zoom"
                      />
                      <span className="text-sm font-medium w-12">
                        {Math.round(scale * 100)}%
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setScale(Math.min(2, scale + 0.1))}
                      disabled={scale >= 2}
                      data-testid="button-zoom-in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isPlacingField && (
                    <Badge variant="default" className="animate-pulse">
                      Click on PDF to place {selectedTool} field
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    data-testid="button-fullscreen"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div 
                ref={pdfContainerRef}
                className="flex-1 overflow-auto p-8 flex justify-center"
              >
                <div 
                  className="relative bg-white shadow-lg"
                  style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
                >
                  <Document
                    file={pdfFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    }
                  >
                    <div 
                      ref={pageRef}
                      className="relative"
                      onClick={handlePdfClick}
                      style={{ cursor: isPlacingField ? "crosshair" : "default" }}
                    >
                      <Page
                        pageNumber={currentPage}
                        onLoadSuccess={onPageLoadSuccess}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />

                      {/* Fields Overlay */}
                      {currentPageFields.map((field) => (
                        <Rnd
                          key={field.id}
                          position={{ 
                            x: (field.x / 100) * pageSize.width, 
                            y: (field.y / 100) * pageSize.height 
                          }}
                          size={{ 
                            width: (field.width / 100) * pageSize.width,
                            height: (field.height / 100) * pageSize.height
                          }}
                          onDragStop={(e, d) => {
                            const x = (d.x / pageSize.width) * 100;
                            const y = (d.y / pageSize.height) * 100;
                            handleFieldUpdate(
                              field.id,
                              x,
                              y,
                              field.width,
                              field.height
                            );
                          }}
                          onResizeStop={(e, direction, ref, delta, position) => {
                            const width = (ref.offsetWidth / pageSize.width) * 100;
                            const height = (ref.offsetHeight / pageSize.height) * 100;
                            const x = (position.x / pageSize.width) * 100;
                            const y = (position.y / pageSize.height) * 100;
                            handleFieldUpdate(field.id, x, y, width, height);
                          }}
                          bounds="parent"
                          className={`absolute border-2 rounded cursor-move ${getFieldStyle(field)} ${
                            selectedFieldId === field.id ? "ring-2 ring-primary" : ""
                          }`}
                          disableDragging={isPlacingField}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setSelectedFieldId(field.id);
                          }}
                        >
                          <div className="flex items-center justify-center h-full p-1">
                            <div className="flex items-center gap-1 text-xs font-medium">
                              {getFieldIcon(field)}
                              <span className="truncate">{field.label}</span>
                              {field.required && (
                                <span className="text-red-500">*</span>
                              )}
                            </div>
                          </div>
                        </Rnd>
                      ))}
                    </div>
                  </Document>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar - Field Properties & List */}
        {pdfFile && (
          <div className="w-96 border-l bg-background flex flex-col">
            <Tabs defaultValue="fields" className="flex-1 flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b">
                <TabsTrigger value="fields" className="flex-1">
                  <Layers className="h-4 w-4 mr-2" />
                  Fields ({fields.length})
                </TabsTrigger>
                <TabsTrigger value="properties" className="flex-1" disabled={!selectedField}>
                  <Settings className="h-4 w-4 mr-2" />
                  Properties
                </TabsTrigger>
              </TabsList>

              <TabsContent value="fields" className="flex-1 p-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-2">
                    {fields.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No fields added yet</p>
                        <p className="text-xs mt-2">
                          Select a tool and click on the PDF to add fields
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Group fields by page */}
                        {Array.from(new Set(fields.map(f => f.page))).sort().map(page => (
                          <div key={page} className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">
                              Page {page}
                            </div>
                            {fields
                              .filter(f => f.page === page)
                              .map((field) => (
                                <Card
                                  key={field.id}
                                  className={`cursor-pointer transition-colors ${
                                    selectedFieldId === field.id
                                      ? "ring-2 ring-primary"
                                      : "hover:bg-muted/50"
                                  }`}
                                  onClick={() => {
                                    setSelectedFieldId(field.id);
                                    setCurrentPage(field.page);
                                  }}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded ${getFieldStyle(field)}`}>
                                          {getFieldIcon(field)}
                                        </div>
                                        <div>
                                          <div className="font-medium text-sm">
                                            {field.label}
                                            {field.required && (
                                              <span className="text-red-500 ml-1">*</span>
                                            )}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {field.type} • {field.recipient}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            duplicateField(field.id);
                                          }}
                                          data-testid={`button-duplicate-${field.id}`}
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteField(field.id);
                                          }}
                                          data-testid={`button-delete-${field.id}`}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="properties" className="flex-1 p-0">
                {selectedField && (
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      <div>
                        <Label htmlFor="field-label">Label</Label>
                        <Input
                          id="field-label"
                          value={selectedField.label}
                          onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                          className="mt-1"
                          data-testid="input-field-label"
                        />
                      </div>

                      <div>
                        <Label htmlFor="field-type">Type</Label>
                        <Select
                          value={selectedField.type}
                          onValueChange={(value: FieldType) => 
                            updateField(selectedField.id, { type: value })
                          }
                        >
                          <SelectTrigger id="field-type" className="mt-1" data-testid="select-field-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map((type) => (
                              <SelectItem key={type.type} value={type.type}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="field-recipient">Recipient</Label>
                        <Select
                          value={selectedField.recipient}
                          onValueChange={(value: "tenant" | "guarantor" | "landlord") => 
                            updateField(selectedField.id, { recipient: value })
                          }
                        >
                          <SelectTrigger id="field-recipient" className="mt-1" data-testid="select-field-recipient">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tenant">Tenant</SelectItem>
                            <SelectItem value="guarantor">Guarantor</SelectItem>
                            <SelectItem value="landlord">Landlord</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="field-datakey">Data Mapping</Label>
                        <Select
                          value={selectedField.dataKey || ""}
                          onValueChange={(value) => 
                            updateField(selectedField.id, { dataKey: value || undefined })
                          }
                        >
                          <SelectTrigger id="field-datakey" className="mt-1" data-testid="select-field-datakey">
                            <SelectValue placeholder="Select data field..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {DATA_KEYS.map((key) => (
                              <SelectItem key={key.key} value={key.key}>
                                {key.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Maps this field to tenant/property data
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="field-required"
                          checked={selectedField.required}
                          onCheckedChange={(checked) => 
                            updateField(selectedField.id, { required: checked as boolean })
                          }
                        />
                        <Label
                          htmlFor="field-required"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Required field
                        </Label>
                      </div>

                      {selectedField.type === "dropdown" && (
                        <div>
                          <Label htmlFor="field-options">Options (one per line)</Label>
                          <textarea
                            id="field-options"
                            className="mt-1 w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                            value={selectedField.options?.join("\n") || ""}
                            onChange={(e) => {
                              const options = e.target.value
                                .split("\n")
                                .filter(o => o.trim());
                              updateField(selectedField.id, { options });
                            }}
                            data-testid="textarea-field-options"
                          />
                        </div>
                      )}

                      <Separator />

                      <div>
                        <Label>Position & Size</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">X</span>
                            <div className="font-mono">{selectedField.x.toFixed(1)}%</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Y</span>
                            <div className="font-mono">{selectedField.y.toFixed(1)}%</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Width</span>
                            <div className="font-mono">{selectedField.width.toFixed(1)}%</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Height</span>
                            <div className="font-mono">{selectedField.height.toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 space-y-2">
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => duplicateField(selectedField.id)}
                          data-testid="button-duplicate-field"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate Field
                        </Button>
                        <Button
                          className="w-full"
                          variant="destructive"
                          onClick={() => deleteField(selectedField.id)}
                          data-testid="button-delete-field"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Field
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Help text */}
      {pdfFile && (
        <div className="border-t bg-muted/50 px-4 py-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {isPlacingField ? (
                <span>Click on the PDF to place a {selectedTool} field</span>
              ) : (
                <span>Select a tool above or click on a field to edit</span>
              )}
            </div>
            <Separator orientation="vertical" className="h-3" />
            <span>Drag fields to reposition • Drag corners to resize • Delete key to remove</span>
            <Separator orientation="vertical" className="h-3" />
            <span>⌘/Ctrl+Z to undo • ⌘/Ctrl+Y to redo • ⌘/Ctrl+S to save</span>
          </div>
        </div>
      )}
    </div>
  );
}