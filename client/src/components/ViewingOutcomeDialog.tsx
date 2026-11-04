import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThumbsUp, Clock, ThumbsDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ViewingOutcomeDialogProps {
  viewing: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewingOutcomeDialog({ viewing, open, onOpenChange }: ViewingOutcomeDialogProps) {
  const { toast } = useToast();
  const [outcome, setOutcome] = useState<string>("");
  const [reason, setReason] = useState("");

  const submitOutcomeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/viewings/${viewing.id}/outcome`, {
        outcome,
        outcomeReason: reason || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/viewings/upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: "Outcome recorded",
        description: "The viewing outcome has been saved successfully",
      });
      onOpenChange(false);
      setOutcome("");
      setReason("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save outcome",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!outcome) {
      toast({
        title: "Selection required",
        description: "Please select a viewing outcome",
        variant: "destructive",
      });
      return;
    }

    if ((outcome === "needs_time" || outcome === "not_interested") && !reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for this outcome",
        variant: "destructive",
      });
      return;
    }

    submitOutcomeMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-viewing-outcome">
        <DialogHeader>
          <DialogTitle>Record Viewing Outcome</DialogTitle>
          <DialogDescription>
            How did the viewing go? This helps us track the tenant's journey and trigger appropriate follow-ups.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>Viewing Outcome</Label>
            <RadioGroup value={outcome} onValueChange={setOutcome}>
              <div className="flex items-start space-x-3 p-4 border rounded-md hover-elevate active-elevate-2">
                <RadioGroupItem value="interested" id="interested" data-testid="radio-interested" />
                <Label htmlFor="interested" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">Interested</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tenant is interested and wants to proceed with application
                  </p>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-md hover-elevate active-elevate-2">
                <RadioGroupItem value="needs_time" id="needs_time" data-testid="radio-needs-time" />
                <Label htmlFor="needs_time" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="font-semibold">Needs Time to Think</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tenant needs more time to decide - we'll follow up
                  </p>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-md hover-elevate active-elevate-2">
                <RadioGroupItem value="not_interested" id="not_interested" data-testid="radio-not-interested" />
                <Label htmlFor="not_interested" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <ThumbsDown className="h-4 w-4 text-red-600" />
                    <span className="font-semibold">Not Interested</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tenant is not interested in this property
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {(outcome === "needs_time" || outcome === "not_interested") && (
            <div className="space-y-2">
              <Label htmlFor="reason">
                {outcome === "needs_time" ? "What do they need to consider?" : "Why not interested?"}
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  outcome === "needs_time"
                    ? "e.g., Comparing with other properties, waiting for flatmates, budget concerns..."
                    : "e.g., Too expensive, location not suitable, room too small..."
                }
                rows={3}
                data-testid="textarea-outcome-reason"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-outcome"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitOutcomeMutation.isPending}
            data-testid="button-submit-outcome"
          >
            {submitOutcomeMutation.isPending ? "Saving..." : "Save Outcome"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
