import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CheckCircle, Clock, User, CalendarCheck, ChevronRight, ChevronLeft, Bot, MessageSquare, PoundSterling, Zap, BarChart3, Check } from "lucide-react";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Progress } from "@/components/ui/progress";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
type DayOfWeek = typeof DAYS[number];

const weeklyAvailabilitySchema = z.object({
  enabled: z.boolean(),
  start: z.string(),
  end: z.string(),
});

const formSchema = z.object({
  timezone: z.string().default("Europe/London"),
  weeklyAvailability: z.record(z.enum(DAYS), weeklyAvailabilitySchema),
  viewingDuration: z.number().default(20),
  bufferTime: z.number().default(10),
  breakWindows: z.array(z.any()).default([]),
  staffEmail: z.string().email("Please enter a valid email address"),
  staffMobile: z.string().regex(/^\+44\d{10}$/, "Phone must be in format +44XXXXXXXXXX"),
  googleCalendarConnected: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

const STEP_TITLES = [
  "Welcome",
  "Viewing Hours",
  "Staff Details",
  "Calendar Integration",
  "Review & Complete",
];

const DEFAULT_FORM_VALUES: FormData = {
  timezone: "Europe/London",
  weeklyAvailability: {
    monday: { enabled: false, start: "09:00", end: "17:00" },
    tuesday: { enabled: false, start: "09:00", end: "17:00" },
    wednesday: { enabled: false, start: "09:00", end: "17:00" },
    thursday: { enabled: false, start: "09:00", end: "17:00" },
    friday: { enabled: false, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "10:00", end: "16:00" },
    sunday: { enabled: false, start: "10:00", end: "16:00" },
  },
  viewingDuration: 20,
  bufferTime: 10,
  breakWindows: [],
  staffEmail: "",
  staffMobile: "",
  googleCalendarConnected: false,
};

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

  const { data: existingPreferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ["/api/viewing-preferences"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  // Reset form when preferences data loads
  useEffect(() => {
    if (!isLoadingPreferences && existingPreferences) {
      form.reset(existingPreferences);
    }
  }, [existingPreferences, isLoadingPreferences, form]);

  const savePreferencesMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("POST", "/api/viewing-preferences", data);
    },
    onSuccess: async () => {
      await apiRequest("PATCH", "/api/onboarding/complete");
      await queryClient.invalidateQueries({ queryKey: ["/api/onboarding/status"] });
      toast({
        title: "Onboarding Complete!",
        description: "Your viewing preferences have been saved successfully.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save preferences",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    savePreferencesMutation.mutate(data);
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEP_TITLES.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return ["weeklyAvailability"];
      case 2:
        return ["staffEmail", "staffMobile"];
      case 3:
        return ["googleCalendarConnected"];
      default:
        return [];
    }
  };

  const progressPercentage = ((currentStep + 1) / STEP_TITLES.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          {/* Progress Bar */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span data-testid="progress-text">Step {currentStep + 1} of {STEP_TITLES.length}</span>
              <span data-testid="progress-percentage">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" data-testid="progress-bar" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {STEP_TITLES.map((title, index) => (
                <div key={title} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                    data-testid={`step-indicator-${index}`}
                  >
                    {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  {index < STEP_TITLES.length - 1 && (
                    <div
                      className={`w-12 h-1 ${
                        index < currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <CardTitle data-testid="step-title">{STEP_TITLES[currentStep]}</CardTitle>
          <CardDescription data-testid="step-description">
            {currentStep === 0 && "Let's get your property automation set up in just a few steps"}
            {currentStep === 1 && "Select your available days and hours for viewings"}
            {currentStep === 2 && "Provide staff contact details for viewing reminders"}
            {currentStep === 3 && "Connect your shared calendar (optional)"}
            {currentStep === 4 && "Review your preferences and complete setup"}
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="min-h-[400px]">
              {isLoadingPreferences ? (
                <div className="space-y-4 py-8" data-testid="loading-state">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-5/6" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-2/3" />
                </div>
              ) : (
                <>
                  {currentStep === 0 && (
                    <div className="space-y-8 py-6">
                      {/* Hero Section */}
                      <div className="text-center space-y-4">
                        <TermFlowWordmark className="mx-auto" />
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Welcome to TermFlow</h2>
                          <p className="text-lg text-muted-foreground font-medium">AI automation for student lettings</p>
                        </div>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                          Replace letting agents and expensive CRMs with complete automation - from first enquiry to deposit payment.
                        </p>
                      </div>

                      {/* Key Benefits Section */}
                      <div className="max-w-3xl mx-auto">
                        <h3 className="text-lg font-semibold mb-4 text-center">Key Benefits</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <PoundSterling className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Replace expensive CRMs and eliminate agent fees</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <Bot className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">AI handles 90% of tenant conversations automatically</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <MessageSquare className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">All enquiries in one place (WhatsApp, email, phone, portals)</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Instant viewings, applications, contracts, and deposits</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-lg border md:col-span-2">
                            <BarChart3 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Complete pipeline visibility and analytics</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* What You're Getting Section */}
                      <div className="max-w-3xl mx-auto">
                        <h3 className="text-lg font-semibold mb-4 text-center">What You're Getting</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">AI Conversations</p>
                              <p className="text-sm text-muted-foreground">24/7 automated responses across all channels</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Lead Capture</p>
                              <p className="text-sm text-muted-foreground">WhatsApp, email, phone, student portals</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Smart Viewings</p>
                              <p className="text-sm text-muted-foreground">Automated booking with calendar sync</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Interactive Floor Plans</p>
                              <p className="text-sm text-muted-foreground">Click to book or pay deposits</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Digital Contracts</p>
                              <p className="text-sm text-muted-foreground">Auto-generated and signed online</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Stripe Payments</p>
                              <p className="text-sm text-muted-foreground">Instant £1,000 deposit collection</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Tenancy Calendar</p>
                              <p className="text-sm text-muted-foreground">Move-in/out tracking with retention messaging</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Pipeline Management</p>
                              <p className="text-sm text-muted-foreground">Track every lead from enquiry to move-in</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Onboarding Roadmap */}
                      <div className="max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold mb-4 text-center">What We'll Set Up Next</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                            <div>
                              <p className="font-medium">Property & viewing hours</p>
                              <p className="text-sm text-muted-foreground">Configure your availability for viewings</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                            <div>
                              <p className="font-medium">Staff contact details</p>
                              <p className="text-sm text-muted-foreground">For viewing reminders and notifications</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                            <div>
                              <p className="font-medium">Calendar integration (optional)</p>
                              <p className="text-sm text-muted-foreground">Sync with shared calendar to avoid conflicts</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                            <div>
                              <p className="font-medium">Review and launch</p>
                              <p className="text-sm text-muted-foreground">Confirm your settings and start automating</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-timezone">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                            <SelectItem value="Europe/Paris">Europe/Paris (CET)</SelectItem>
                            <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <FormLabel>Weekly Availability</FormLabel>
                    {DAYS.map((day) => (
                      <div key={day} className="flex items-center gap-4" data-testid={`day-row-${day}`}>
                        <FormField
                          control={form.control}
                          name={`weeklyAvailability.${day}.enabled`}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid={`checkbox-${day}`}
                                />
                              </FormControl>
                              <FormLabel className="capitalize w-24">{day}</FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`weeklyAvailability.${day}.start`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  type="time"
                                  {...field}
                                  disabled={!form.watch(`weeklyAvailability.${day}.enabled`)}
                                  data-testid={`input-${day}-start`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <span className="text-muted-foreground">to</span>

                        <FormField
                          control={form.control}
                          name={`weeklyAvailability.${day}.end`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  type="time"
                                  {...field}
                                  disabled={!form.watch(`weeklyAvailability.${day}.enabled`)}
                                  data-testid={`input-${day}-end`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 py-8">
                  <div className="text-center mb-6">
                    <User className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Staff Contact Details</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      These details will be used to send viewing reminders and updates
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-4">
                    <FormField
                      control={form.control}
                      name="staffEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Staff Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="staff@example.com"
                              {...field}
                              data-testid="input-staff-email"
                            />
                          </FormControl>
                          <FormDescription>Email address for viewing notifications</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="staffMobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Staff Mobile</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+44XXXXXXXXXX"
                              {...field}
                              data-testid="input-staff-mobile"
                            />
                          </FormControl>
                          <FormDescription>Mobile number in format +44XXXXXXXXXX for SMS reminders</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 py-8">
                  <div className="text-center">
                    <CalendarCheck className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Shared Calendar Integration</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Connect your shared calendar to automatically sync viewing appointments and avoid double bookings.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="googleCalendarConnected"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-center gap-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-google-calendar"
                          />
                        </FormControl>
                        <FormLabel className="text-base">Connect Shared Calendar (Optional)</FormLabel>
                      </FormItem>
                    )}
                  />

                  <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground text-center">
                    Note: Shared calendar integration can be configured later in settings.
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Review Your Preferences</h3>
                    <p className="text-muted-foreground">Please confirm your viewing schedule settings</p>
                  </div>

                  <div className="space-y-4 bg-muted p-4 rounded-lg">
                    <div data-testid="review-timezone">
                      <p className="font-medium">Timezone</p>
                      <p className="text-sm text-muted-foreground">{form.watch("timezone")}</p>
                    </div>

                    <div data-testid="review-availability">
                      <p className="font-medium">Available Days</p>
                      <p className="text-sm text-muted-foreground">
                        {DAYS.filter((day) => form.watch(`weeklyAvailability.${day}.enabled`))
                          .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
                          .join(", ") || "None"}
                      </p>
                    </div>

                    <div data-testid="review-duration">
                      <p className="font-medium">Viewing Duration</p>
                      <p className="text-sm text-muted-foreground">20 minutes (fixed)</p>
                    </div>

                    <div data-testid="review-buffer">
                      <p className="font-medium">Buffer Time</p>
                      <p className="text-sm text-muted-foreground">10 minutes (fixed)</p>
                    </div>

                    <div data-testid="review-staff">
                      <p className="font-medium">Staff Contact</p>
                      <p className="text-sm text-muted-foreground">
                        {form.watch("staffEmail")} • {form.watch("staffMobile")}
                      </p>
                    </div>

                    <div data-testid="review-calendar">
                      <p className="font-medium">Shared Calendar</p>
                      <p className="text-sm text-muted-foreground">
                        {form.watch("googleCalendarConnected") ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
                </>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              {currentStep === 0 ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    asChild
                    data-testid="link-learn-more"
                  >
                    <Link href="/connect">Explore TermFlow integration features</Link>
                  </Button>
                  <Button 
                    type="button" 
                    onClick={nextStep} 
                    disabled={isLoadingPreferences}
                    data-testid="button-get-started"
                  >
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isLoadingPreferences}
                    data-testid="button-previous"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < STEP_TITLES.length - 1 ? (
                    <Button 
                      type="button" 
                      onClick={nextStep} 
                      disabled={isLoadingPreferences}
                      data-testid="button-next"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={savePreferencesMutation.isPending || isLoadingPreferences}
                      data-testid="button-complete"
                    >
                      {savePreferencesMutation.isPending ? "Saving..." : "Complete Setup"}
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
