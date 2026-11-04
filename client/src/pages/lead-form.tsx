import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  propertyName: z.string().min(1, "Please select a property"),
  roomType: z.string().min(1, "Please select a room type"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export default function LeadForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      propertyName: "",
      roomType: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await apiRequest("POST", "/api/leads/public-form", data);
      return response;
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const onSubmit = (data: LeadFormData) => {
    submitMutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold" data-testid="text-success-title">Thank you!</h2>
              <p className="text-muted-foreground" data-testid="text-success-message">
                We've received your enquiry and will be in touch shortly via WhatsApp or email.
              </p>
              <p className="text-sm text-muted-foreground">
                Check your WhatsApp for instant viewing options and next steps.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle data-testid="text-form-title">Quick Enquiry</CardTitle>
          <CardDescription data-testid="text-form-description">
            Tell us what you're looking for and we'll get back to you within minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                data-testid="input-name"
                placeholder="John Smith"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive" data-testid="error-name">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="input-email"
                placeholder="john@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive" data-testid="error-email">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone / WhatsApp</Label>
              <Input
                id="phone"
                type="tel"
                data-testid="input-phone"
                placeholder="+44 7700 900000"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive" data-testid="error-phone">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyName">Which property interests you?</Label>
              <Select
                onValueChange={(value) => form.setValue("propertyName", value)}
                data-testid="select-property"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stanley House" data-testid="option-stanley">Stanley House (City Centre)</SelectItem>
                  <SelectItem value="Broadgate House" data-testid="option-broadgate">Broadgate House (Beeston)</SelectItem>
                  <SelectItem value="Not sure yet" data-testid="option-unsure">Not sure yet</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.propertyName && (
                <p className="text-sm text-destructive" data-testid="error-property">
                  {form.formState.errors.propertyName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type Preference</Label>
              <Select
                onValueChange={(value) => form.setValue("roomType", value)}
                data-testid="select-room-type"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En-suite" data-testid="option-ensuite">En-suite</SelectItem>
                  <SelectItem value="Studio" data-testid="option-studio">Studio</SelectItem>
                  <SelectItem value="Cluster Flat" data-testid="option-cluster">Cluster Flat</SelectItem>
                  <SelectItem value="Any" data-testid="option-any">Any</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.roomType && (
                <p className="text-sm text-destructive" data-testid="error-room-type">
                  {form.formState.errors.roomType.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={submitMutation.isPending}
              data-testid="button-submit"
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
