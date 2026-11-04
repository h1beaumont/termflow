import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  BookOpen,
  CreditCard,
  Share2,
  Clock,
  ShieldCheck
} from 'lucide-react';

// Share code verification schema
const shareCodeSchema = z.object({
  shareCode: z.string()
    .min(9, 'Share code must be 9 characters')
    .max(9, 'Share code must be 9 characters')
    .regex(/^[A-Z0-9]{9}$/, 'Share code must be 9 uppercase letters/numbers'),
  dateOfBirth: z.string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in DD/MM/YYYY format'),
});

type ShareCodeForm = z.infer<typeof shareCodeSchema>;

export default function RightToRent() {
  const [, params] = useRoute('/right-to-rent/:token');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{
    type: string;
    name: string;
    url: string;
  }>>([]);
  const [selectedTab, setSelectedTab] = useState('documents');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get check details from token
  const { data: checkDetails, isLoading: isLoadingCheck } = useQuery({
    queryKey: [`/api/rtr/check/${params?.token}`],
    enabled: !!params?.token,
  });

  // Share code form
  const shareCodeForm = useForm<ShareCodeForm>({
    resolver: zodResolver(shareCodeSchema),
    defaultValues: {
      shareCode: '',
      dateOfBirth: '',
    },
  });

  // Document upload mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('checkId', checkDetails?.id || '');
      
      // Determine document type based on file name
      let docType = 'other';
      const fileName = file.name.toLowerCase();
      if (fileName.includes('passport')) docType = 'passport';
      else if (fileName.includes('visa')) docType = 'visa';
      else if (fileName.includes('brp') || fileName.includes('residence')) docType = 'brp';
      
      formData.append('type', docType);

      return apiRequest('/api/rtr/upload', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: (data) => {
      setUploadedDocuments(prev => [...prev, data.document]);
      toast({
        title: 'Document uploaded',
        description: 'Your document has been uploaded successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload document. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Submit documents mutation
  const submitDocumentsMutation = useMutation({
    mutationFn: async () => {
      if (uploadedDocuments.length === 0) {
        throw new Error('Please upload at least one document');
      }

      return apiRequest(`/api/rtr/${checkDetails?.id}/submit-documents`, {
        method: 'POST',
        body: JSON.stringify({
          documents: uploadedDocuments.map(doc => ({
            type: doc.type,
            fileUrl: doc.url,
          })),
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Documents submitted',
        description: 'Your documents have been submitted for review.',
      });
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: [`/api/rtr/check/${params?.token}`] });
    },
    onError: (error: any) => {
      toast({
        title: 'Submission failed',
        description: error.message || 'Failed to submit documents.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    },
  });

  // Share code verification mutation
  const verifyShareCodeMutation = useMutation({
    mutationFn: async (data: ShareCodeForm) => {
      return apiRequest(`/api/rtr/${checkDetails?.id}/verify-share-code`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      if (data.valid && data.rightToRent) {
        toast({
          title: 'Verification successful',
          description: 'Your Right to Rent has been verified!',
        });
        queryClient.invalidateQueries({ queryKey: [`/api/rtr/check/${params?.token}`] });
      } else {
        toast({
          title: 'Verification failed',
          description: 'The share code could not be verified. Please check your details.',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Verification error',
        description: error.message || 'Failed to verify share code.',
        variant: 'destructive',
      });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPG, PNG, or PDF file.',
        variant: 'destructive',
      });
      return;
    }

    setUploadProgress(20);
    await uploadDocumentMutation.mutateAsync(file);
    setUploadProgress(100);
    
    // Reset progress after animation
    setTimeout(() => setUploadProgress(0), 500);
  };

  const handleShareCodeSubmit = (data: ShareCodeForm) => {
    verifyShareCodeMutation.mutate(data);
  };

  const handleDocumentsSubmit = () => {
    setIsSubmitting(true);
    submitDocumentsMutation.mutate();
  };

  if (isLoadingCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!checkDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              Invalid Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>This Right to Rent check link is invalid or has expired.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please contact your landlord for a new link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkDetails.status === 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Already Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your Right to Rent check has already been approved!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your tenancy contract will be sent to you shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Right to Rent Verification</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            UK law requires us to verify your right to rent before you can move in.
            This is a quick, secure process that helps protect both you and your landlord.
          </p>
        </div>

        {/* Status Alert */}
        {checkDetails.status === 'reviewing' && (
          <Alert className="mb-6">
            <Clock className="w-4 h-4" />
            <AlertTitle>Under Review</AlertTitle>
            <AlertDescription>
              Your documents are being reviewed. We'll notify you within 24 hours.
            </AlertDescription>
          </Alert>
        )}

        {checkDetails.status === 'rejected' && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Additional Information Required</AlertTitle>
            <AlertDescription>
              {checkDetails.rejectionReason || 'Please upload additional documents or contact us for assistance.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Verification Method</CardTitle>
            <CardDescription>
              You can verify your right to rent using documents or a Home Office share code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="documents">
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Documents
                </TabsTrigger>
                <TabsTrigger value="sharecode">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Code
                </TabsTrigger>
              </TabsList>

              <TabsContent value="documents" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Accepted Documents</h3>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">UK or Irish Passport</p>
                        <p className="text-sm text-muted-foreground">
                          Provides permanent right to rent
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Valid Visa</p>
                        <p className="text-sm text-muted-foreground">
                          Student visa or other UK visa
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Biometric Residence Permit (BRP)</p>
                        <p className="text-sm text-muted-foreground">
                          Card showing your immigration status
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Area */}
                <div>
                  <label htmlFor="document-upload" className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary cursor-pointer transition-colors">
                      <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm font-medium">Click to upload document</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG, or PDF (max 10MB)
                      </p>
                    </div>
                  </label>
                  <input
                    id="document-upload"
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    disabled={uploadDocumentMutation.isPending}
                  />

                  {uploadProgress > 0 && (
                    <Progress value={uploadProgress} className="mt-2" />
                  )}
                </div>

                {/* Uploaded Documents */}
                {uploadedDocuments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Uploaded Documents</h4>
                    <div className="space-y-2">
                      {uploadedDocuments.map((doc, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Badge variant="secondary">{doc.type}</Badge>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleDocumentsSubmit}
                      disabled={isSubmitting}
                      className="w-full mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Submit Documents for Review
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sharecode" className="space-y-4">
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertTitle>Home Office Share Code</AlertTitle>
                  <AlertDescription>
                    If you have a Home Office share code, you can use it for instant verification.
                    Get your share code at{' '}
                    <a 
                      href="https://www.gov.uk/view-prove-immigration-status" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline text-primary"
                    >
                      gov.uk
                    </a>
                  </AlertDescription>
                </Alert>

                <Form {...shareCodeForm}>
                  <form onSubmit={shareCodeForm.handleSubmit(handleShareCodeSubmit)} className="space-y-4">
                    <FormField
                      control={shareCodeForm.control}
                      name="shareCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Share Code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., ABC123DEF"
                              maxLength={9}
                              className="uppercase"
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              data-testid="input-share-code"
                            />
                          </FormControl>
                          <FormDescription>
                            9-character code from the Home Office
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={shareCodeForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="DD/MM/YYYY"
                              maxLength={10}
                              data-testid="input-date-of-birth"
                            />
                          </FormControl>
                          <FormDescription>
                            Enter your date of birth as shown on your documents
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={verifyShareCodeMutation.isPending}
                      data-testid="button-verify-share-code"
                    >
                      {verifyShareCodeMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 mr-2" />
                          Verify Share Code
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              Your documents are encrypted and stored securely
            </p>
            <p className="text-xs text-muted-foreground">
              Need help? Contact us at support@termflow.com
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}