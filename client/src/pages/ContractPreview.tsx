import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Loader2, CheckCircle2, Printer } from "lucide-react";
import type { Lead } from "@shared/schema";

export default function ContractPreview() {
  const { leadId } = useParams();
  const [, navigate] = useLocation();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { toast } = useToast();

  // Fetch lead data
  const { data: lead, isLoading: loadingLead } = useQuery<Lead>({
    queryKey: ['/api/leads', leadId],
  });

  // Fetch contract HTML
  const { data: contractHtml, isLoading: loadingContract } = useQuery<string>({
    queryKey: ['/api/leads', leadId, 'contract', 'preview'],
    enabled: !!leadId,
  });

  // Sign contract mutation
  const signContractMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/leads/${leadId}/contract/sign`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Contract signed successfully!",
        description: "Your tenancy agreement has been signed. Please proceed to pay the deposit.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/leads', leadId] });
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      navigate(`/leads/${leadId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to sign contract",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSignContract = () => {
    if (!acceptedTerms) {
      toast({
        title: "Please accept the terms",
        description: "You must read and accept the terms of the tenancy agreement before signing.",
        variant: "destructive",
      });
      return;
    }
    signContractMutation.mutate();
  };

  if (loadingLead || loadingContract) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8">
        <Card className="p-12">
          <div className="text-center space-y-4">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Lead not found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The lead you're looking for doesn't exist.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const isAlreadySigned = lead.stage === "contract_signed" || lead.contractSignedDate;

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-contract-title">
            Tenancy Agreement
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and sign your tenancy agreement for {lead.name || 'your room'}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handlePrint}
          data-testid="button-print-contract"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>

      {/* Contract Status */}
      {isAlreadySigned && (
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div>
                <CardTitle className="text-green-900 dark:text-green-100">
                  Contract Signed
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  This contract was signed on {lead.contractSignedDate ? new Date(lead.contractSignedDate).toLocaleDateString() : 'N/A'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Contract Content */}
      <Card data-testid="card-contract-content">
        <CardContent className="p-6">
          {contractHtml ? (
            <div 
              className="contract-content"
              dangerouslySetInnerHTML={{ __html: contractHtml }}
              data-testid="div-contract-html"
            />
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                Contract not available. Please ensure all required information is provided.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms Acceptance and Signature */}
      {!isAlreadySigned && contractHtml && (
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>Sign Contract</CardTitle>
            <CardDescription>
              Review the terms and conditions above, then sign your tenancy agreement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="accept-terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                data-testid="checkbox-accept-terms"
              />
              <label
                htmlFor="accept-terms"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I have read and accept the terms and conditions of this tenancy agreement. 
                I understand that this is a legally binding contract and I am responsible 
                for all obligations outlined in this document.
              </label>
            </div>

            <Button
              onClick={handleSignContract}
              disabled={!acceptedTerms || signContractMutation.isPending}
              className="w-full"
              data-testid="button-sign-contract"
            >
              {signContractMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Contract...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Sign Contract
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .contract-content {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
