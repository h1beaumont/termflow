import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, FileCheck, Loader2, CheckCircle2 } from "lucide-react";
import type { TenantApplication, ApplicationDocument } from "@shared/schema";

const formSchema = z.object({
  // Personal Info
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  studentId: z.string().min(1, "Student ID is required"),
  
  // University Details
  institution: z.string().min(1, "Institution is required"),
  course: z.string().min(1, "Course is required"),
  yearOfStudy: z.number().min(1).max(10),
  expectedGraduation: z.string().min(1, "Expected graduation date is required"),
  
  // Payment Option
  paymentOption: z.enum(["full_payment", "instalments"], {
    required_error: "Please select a payment option",
  }),
  
  // Guarantor Details (conditional - required only for instalments)
  guarantorName: z.string().optional(),
  guarantorEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  guarantorPhone: z.string().optional(),
  guarantorAddress: z.string().optional(),
  guarantorRelationship: z.string().optional(),
}).refine((data) => {
  // If instalments selected, guarantor fields are required
  if (data.paymentOption === "instalments") {
    return data.guarantorName && data.guarantorEmail && data.guarantorPhone && data.guarantorAddress && data.guarantorRelationship;
  }
  return true;
}, {
  message: "Guarantor details are required when paying by instalments",
  path: ["guarantorName"],
});

type FormData = z.infer<typeof formSchema>;

interface TenantApplicationFormProps {
  leadId: string;
  propertyId: string;
  roomId: string;
  onSuccess?: () => void;
}

const STEPS = [
  { id: 1, title: "Personal Information", description: "Your basic details" },
  { id: 2, title: "University Details", description: "Your educational information" },
  { id: 3, title: "Guarantor Information", description: "Your guarantor's details" },
  { id: 4, title: "Documents", description: "Upload required documents" },
];

export default function TenantApplicationForm({ leadId, propertyId, roomId, onSuccess }: TenantApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, ApplicationDocument>>({});
  const { toast } = useToast();

  // Fetch existing application if any
  const { data: existingApplication } = useQuery<{ 
    id: string; 
    documents: ApplicationDocument[];
  } & TenantApplication>({
    queryKey: ['/api/leads', leadId, 'application'],
    enabled: !!leadId,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateOfBirth: existingApplication?.dateOfBirth ? new Date(existingApplication.dateOfBirth).toISOString().split('T')[0] : "",
      nationality: existingApplication?.nationality || "",
      studentId: existingApplication?.studentId || "",
      institution: existingApplication?.institution || "",
      course: existingApplication?.course || "",
      yearOfStudy: existingApplication?.yearOfStudy || 1,
      expectedGraduation: existingApplication?.expectedGraduation ? new Date(existingApplication.expectedGraduation).toISOString().split('T')[0] : "",
      paymentOption: (existingApplication?.paymentOption as "instalments" | "full_payment") || "instalments",
      guarantorName: existingApplication?.guarantorName || "",
      guarantorEmail: existingApplication?.guarantorEmail || "",
      guarantorPhone: existingApplication?.guarantorPhone || "",
      guarantorAddress: existingApplication?.guarantorAddress || "",
      guarantorRelationship: existingApplication?.guarantorRelationship || "",
    },
  });

  // Save application mutation
  const saveApplicationMutation = useMutation({
    mutationFn: async (data: Partial<FormData>) => {
      const response = await apiRequest("POST", `/api/leads/${leadId}/application`, {
        ...data,
        propertyId,
        roomId,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        expectedGraduation: data.expectedGraduation ? new Date(data.expectedGraduation) : undefined,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setApplicationId(data.id);
      queryClient.invalidateQueries({ queryKey: ['/api/leads', leadId, 'application'] });
    },
  });

  // Upload document mutation
  const uploadDocMutation = useMutation({
    mutationFn: async ({ file, documentType }: { file: File; documentType: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await fetch(`/api/applications/${applicationId}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      setUploadedDocs(prev => ({ ...prev, [variables.documentType]: data }));
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Submit application mutation
  const submitApplicationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/applications/${applicationId}/submit`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "Your application has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/leads', leadId] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['dateOfBirth', 'nationality', 'studentId'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['institution', 'course', 'yearOfStudy', 'expectedGraduation', 'paymentOption'];
    } else if (currentStep === 3) {
      const paymentOption = form.getValues('paymentOption');
      if (paymentOption === 'instalments') {
        fieldsToValidate = ['guarantorName', 'guarantorEmail', 'guarantorPhone', 'guarantorAddress', 'guarantorRelationship'];
      }
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      // Save progress
      const values = form.getValues();
      await saveApplicationMutation.mutateAsync(values);
      
      // Skip guarantor step if full payment selected
      const paymentOption = form.getValues('paymentOption');
      if (currentStep === 2 && paymentOption === 'full_payment') {
        setCurrentStep(4); // Skip to documents
      } else {
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      }
    }
  };

  const handleBack = () => {
    const paymentOption = form.getValues('paymentOption');
    // If on documents step (4) and full payment was selected, skip back to university details (2)
    if (currentStep === 4 && paymentOption === 'full_payment') {
      setCurrentStep(2);
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    if (!applicationId) {
      toast({
        title: "Error",
        description: "Please complete the previous steps first.",
        variant: "destructive",
      });
      return;
    }

    await uploadDocMutation.mutateAsync({ file, documentType });
  };

  const handleSubmit = async () => {
    const requiredDocs = ['photo_id', 'proof_of_enrollment', 'guarantor_letter'];
    const missingDocs = requiredDocs.filter(doc => !uploadedDocs[doc]);

    if (missingDocs.length > 0) {
      toast({
        title: "Missing documents",
        description: `Please upload all required documents: ${missingDocs.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    await submitApplicationMutation.mutateAsync();
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Tenant Application</CardTitle>
        <CardDescription>Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}</CardDescription>
        <Progress value={progress} className="mt-2" data-testid="progress-application" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-date-of-birth" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., British" {...field} data-testid="input-nationality" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Your student ID number" {...field} data-testid="input-student-id" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University/Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., University of Manchester" {...field} data-testid="input-institution" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Computer Science" {...field} data-testid="input-course" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Study</FormLabel>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-year-of-study">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                          <SelectItem value="5">5th Year</SelectItem>
                          <SelectItem value="6">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expectedGraduation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Graduation Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-expected-graduation" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentOption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Option</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger data-testid="select-payment-option">
                            <SelectValue placeholder="Select payment option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full_payment">Full Payment (No guarantor required)</SelectItem>
                          <SelectItem value="instalments">Instalments (Guarantor required)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                {form.watch('paymentOption') === 'instalments' ? (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        A UK based guarantor is required for all tenants paying by instalments.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="guarantorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guarantor Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} data-testid="input-guarantor-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guarantorEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guarantor Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" {...field} data-testid="input-guarantor-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guarantorPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guarantor Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+44 7700 900000" {...field} data-testid="input-guarantor-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guarantorAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guarantor Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Full address" {...field} data-testid="input-guarantor-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guarantorRelationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship to You</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger data-testid="select-guarantor-relationship">
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="guardian">Guardian</SelectItem>
                              <SelectItem value="relative">Relative</SelectItem>
                              <SelectItem value="employer">Employer</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Full Payment Selected</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Since you selected full payment, you do not need to provide guarantor information.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <DocumentUpload
                    label="Photo ID"
                    description="Upload a copy of your passport or driver's license"
                    documentType="photo_id"
                    onUpload={(file) => handleFileUpload(file, 'photo_id')}
                    uploadedDoc={uploadedDocs['photo_id']}
                    isUploading={uploadDocMutation.isPending}
                  />
                  <DocumentUpload
                    label="Proof of Enrollment"
                    description="Upload your university acceptance letter or student ID card"
                    documentType="proof_of_enrollment"
                    onUpload={(file) => handleFileUpload(file, 'proof_of_enrollment')}
                    uploadedDoc={uploadedDocs['proof_of_enrollment']}
                    isUploading={uploadDocMutation.isPending}
                  />
                  <DocumentUpload
                    label="Guarantor Letter"
                    description="Upload a signed guarantor agreement letter"
                    documentType="guarantor_letter"
                    onUpload={(file) => handleFileUpload(file, 'guarantor_letter')}
                    uploadedDoc={uploadedDocs['guarantor_letter']}
                    isUploading={uploadDocMutation.isPending}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  data-testid="button-back"
                >
                  Back
                </Button>
              )}
              
              <div className="ml-auto">
                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={saveApplicationMutation.isPending}
                    data-testid="button-next"
                  >
                    {saveApplicationMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Next'
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitApplicationMutation.isPending}
                    data-testid="button-submit"
                  >
                    {submitApplicationMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface DocumentUploadProps {
  label: string;
  description: string;
  documentType: string;
  onUpload: (file: File) => void;
  uploadedDoc?: ApplicationDocument;
  isUploading: boolean;
}

function DocumentUpload({ label, description, documentType, onUpload, uploadedDoc, isUploading }: DocumentUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="font-medium">{label}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {uploadedDoc && (
          <CheckCircle2 className="h-5 w-5 text-green-600" data-testid={`icon-uploaded-${documentType}`} />
        )}
      </div>
      
      {uploadedDoc ? (
        <div className="flex items-center gap-2 text-sm">
          <FileCheck className="h-4 w-4" />
          <span className="text-muted-foreground" data-testid={`text-filename-${documentType}`}>
            {uploadedDoc.fileName}
          </span>
        </div>
      ) : (
        <div>
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={isUploading}
            className="cursor-pointer"
            data-testid={`input-file-${documentType}`}
          />
          {isUploading && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
