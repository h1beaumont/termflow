import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, MessageSquare, Trash2, Edit, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const templateFormSchema = z.object({
  templateKey: z.string().min(1, "Template key is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  variables: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
});

type TemplateFormData = z.infer<typeof templateFormSchema>;

interface WhatsappTemplate {
  id: string;
  templateKey: string;
  name: string;
  description: string | null;
  content: string;
  variables: string[] | null;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function WhatsappTemplates() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WhatsappTemplate | null>(null);
  const { toast } = useToast();

  const { data: templates = [], isLoading } = useQuery<WhatsappTemplate[]>({
    queryKey: ["/api/whatsapp-templates"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: TemplateFormData) => {
      const payload = {
        ...data,
        variables: data.variables ? data.variables.split(',').map(v => v.trim()) : [],
      };
      return apiRequest("POST", "/api/whatsapp-templates", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-templates"] });
      setIsCreateOpen(false);
      form.reset();
      toast({ title: "Template created successfully" });
    },
    onError: (error: any) => {
      console.error('Create template error:', error);
      toast({ 
        title: "Failed to create template", 
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TemplateFormData }) => {
      const payload = {
        ...data,
        variables: data.variables ? data.variables.split(',').map(v => v.trim()) : [],
      };
      return apiRequest("PATCH", `/api/whatsapp-templates/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-templates"] });
      setEditingTemplate(null);
      toast({ title: "Template updated successfully" });
    },
    onError: (error: any) => {
      console.error('Update template error:', error);
      toast({ 
        title: "Failed to update template", 
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/whatsapp-templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-templates"] });
      toast({ title: "Template deleted successfully" });
    },
    onError: (error: any) => {
      console.error('Delete template error:', error);
      toast({ 
        title: "Failed to delete template", 
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    },
  });

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      templateKey: "",
      name: "",
      description: "",
      content: "",
      variables: "",
      category: "general",
      isActive: true,
    },
  });

  const handleEdit = (template: WhatsappTemplate) => {
    setEditingTemplate(template);
    form.reset({
      templateKey: template.templateKey,
      name: template.name,
      description: template.description || "",
      content: template.content,
      variables: template.variables?.join(', ') || "",
      category: template.category,
      isActive: template.isActive,
    });
  };

  const onSubmit = (data: TemplateFormData) => {
    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      welcome: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      viewing: "bg-green-500/10 text-green-700 dark:text-green-400",
      application: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
      retention: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
      follow_up: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
      general: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="heading-templates">WhatsApp Templates</h1>
          <p className="text-muted-foreground mt-1">
            Manage automated WhatsApp message templates for leads and tenants
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-template">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create WhatsApp Template</DialogTitle>
              <DialogDescription>
                Create a new message template with dynamic variables
              </DialogDescription>
            </DialogHeader>
            <TemplateForm form={form} onSubmit={onSubmit} isSubmitting={createMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading templates...</div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first WhatsApp template to automate messaging
            </p>
            <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-first">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id} data-testid={`card-template-${template.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category}
                      </Badge>
                      {template.isActive ? (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle className="w-3 h-3" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    {template.description && (
                      <CardDescription>{template.description}</CardDescription>
                    )}
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground font-mono">
                        Key: {template.templateKey}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(template)}
                      data-testid={`button-edit-${template.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(template.id)}
                      data-testid={`button-delete-${template.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">Message Content</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(template.content)}
                      data-testid={`button-copy-${template.id}`}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{template.content}</p>
                  </div>
                </div>
                {template.variables && template.variables.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Variables</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update the message template and variables
            </DialogDescription>
          </DialogHeader>
          <TemplateForm form={form} onSubmit={onSubmit} isSubmitting={updateMutation.isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TemplateForm({
  form,
  onSubmit,
  isSubmitting,
}: {
  form: ReturnType<typeof useForm<TemplateFormData>>;
  onSubmit: (data: TemplateFormData) => void;
  isSubmitting: boolean;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Welcome Message" {...field} data-testid="input-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="templateKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Key</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., welcome_message" {...field} data-testid="input-key" />
                </FormControl>
                <FormDescription>Unique identifier (no spaces)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="welcome">Welcome</SelectItem>
                  <SelectItem value="viewing">Viewing</SelectItem>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="retention">Retention</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="What is this template used for?" {...field} data-testid="input-description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Hi {{studentName}}, welcome to {{propertyName}}..."
                  className="min-h-32"
                  {...field}
                  data-testid="textarea-content"
                />
              </FormControl>
              <FormDescription>
                Use {`{{variableName}}`} for dynamic content
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="variables"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variables (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="studentName, propertyName, viewingDate"
                  {...field}
                  data-testid="input-variables"
                />
              </FormControl>
              <FormDescription>Comma-separated list of variable names</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
                <FormDescription>
                  Enable this template for automated messaging
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="switch-active"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting} data-testid="button-submit">
            {isSubmitting ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
